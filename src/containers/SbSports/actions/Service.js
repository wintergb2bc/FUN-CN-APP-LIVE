
import { Alert,Platform} from 'react-native';
import { Toast } from 'antd-mobile-rn';
import {
    Actions,
  } from "react-native-router-flux";

/**
 * 让fetch也可以timeout
 *  timeout不是请求连接超时的含义，它表示请求的response时间，包括请求的连接、服务器处理及服务器响应回来的时间
 * fetch的timeout即使超时发生了，本次请求也不会被abort丢弃掉，它在后台仍然会发送到服务器端，只是本次请求的响应内容被丢弃而已
 * @param {Promise} fetch_promise    fetch请求返回的Promise
 * @param {number} [timeout=50000]   单位：毫秒，这里设置默认超时时间为10秒
 * @return 返回Promise
 */
function timeout_fetch(fetch_promise, timeout = 50000) {
    let timeout_fn = null;

    //这是一个可以被reject的promise
    let timeout_promise = new Promise(function(resolve, reject) {
        timeout_fn = function() {
             reject('请求超时!!!');
            //Toast.hide();
            //Toast.fail('请求超时,请稍候重试..',3)
        };
    });
    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    let abortable_promise = Promise.race([
        fetch_promise,
        timeout_promise
    ]);

    setTimeout(function() {
        timeout_fn();
    }, timeout);

    return abortable_promise;
}


//window.common_url = 'https://gatewayrb88sl.gamealiyun.com';   //live

let siteId = 45; //android
let platform = 'Android';
if (Platform.OS == 'ios') {
  siteId = 46;
  platform = 'IOS'
}
const apiversion = `api-version=3.0&brand=FUN88&siteId=${siteId}&Platform=SB2${platform}`;

/**
 * @param {string} url 接口地址
 * @param {string} method 请求方法：GET、POST，只能大写
 * @param {JSON} [params=''] body的请求参数，默认为空
 * @return 返回Promise
 */
window.fetchRequestSB = (url, method, params = '',timeout=50000) => {
  const thisBffKey = '3uJfUBFtI0GAPxK8iMzNGg==';

	  let header;
	 if(ApiPort.UserLogin == true){
				header = {
							"Content-Type": "application/json; charset=utf-8",
							"Culture": "ZH-CN",
              'x-bff-key': thisBffKey,
							'Authorization':ApiPort.Token
					};
			}else{
				header = {
							"Content-Type": "application/json; charset=utf-8",
							"Culture": "ZH-CN",
              'x-bff-key': thisBffKey,
					};
      }
   // //console.log(header , '--------------------01---------------------')
    //console.log(common_url+url+apiversion, params); //打印请求参数 if(response.status == 403){}

    let headerData;
    if (params == '') { //如果网络请求中没有参数
        return new Promise(function(resolve, reject) {
            timeout_fetch(fetch(common_url_sb + url+apiversion, {
                    method: method,
                    headers: header,
                }),timeout).then((response) => headerData = response.json())
                .then((responseData) => {


										 if(responseData.error_details){
                                            //  if(responseData.error_details.Code == "AUTH00001"){
                                            //     Toast.fail('The RB88 APP is currently not supporting Thailand region  \n ขณะนี้แอพ RB88 ยังไม่เปิดใช้ภาษาไทย',3)
                                            //       return;
                                            //   }

                                              if (responseData.error_details.Code == "MEM00145") {
                                                if(!global.Restrict){
                                                    isGameLock=false
                                                    global.Restrict = true
                                                    ApiPort.UserLogin == false
                                                    Toast.fail('地区访问限制',2)
                                                    // Actions.replace("RestrictPage",{})
                                                    Actions.RestrictPage({from: 'restrict',RetryAfter: ''})
                                                    return;
                                                }
                                                return
                                            }

											if(responseData.error_details.Code == "GEN0005"){
												if(ApiPort.UserLogin == true){
                                                    if(Gologin == true){
                                                        Gologin = false;
                                                        Toast.fail('重复登录,系统检测到您重复登录',3)
                                                        navigateToSceneGlobeLoginOut('重复登录,系统检测到您重复登录')
                                                    }
                                                }
                                                return;
                                            }

                                            if(responseData.error_details.Code == 'MEM00061'){
                                                Toast.fail('您的帐号无法使用,请联系在线客服!',3, () => { LiveChatOpenGlobe() })
                                                return;
                                            }

                                            if(responseData.error_details.Code == 'GEN0006'){


                                                if(ApiPort.UserLogin == true){
                                                    if(Gologin == true){
                                                        Gologin = false;
                                                        Toast.fail('请重新登录,访问过期',3)
                                                        navigateToSceneGlobeLoginOut('请重新登录,访问过期')
                                                    }
                                                }
                                                return;
                                            }
                                            if(responseData.error_details.Code == "GEN0002"){   //訪問限制
                                                if(!global.Restrict){
                                                    isGameLock=false
                                                    global.Restrict = true
                                                    ApiPort.UserLogin == false
                                                    Toast.fail('地区访问限制',2)
                                                    // Actions.replace("RestrictPage",{})
                                                    Actions.RestrictPage({from: 'restrict',RetryAfter: ''})
                                                    return;
                                                }
                                                return
                                            }


                                            if(responseData.error_details.Code == "GEN0001"){
                                                if(!global.Restrict){
                                                    isGameLock=false
                                                    global.Restrict = true
                                                    ApiPort.UserLogin == false
                                                    Toast.fail('系统正在更新中，请您稍后再尝试登入',2)
                                                    // Actions.replace("RestrictPage",{})
                                                    Actions.RestrictPage({from: 'maintenance', error_details: responseData.error_details})
                                                    return;
                                                }
                                              return;
                                            }

                                            if(responseData.error_details.Message != ""){
                                                Toast.fail(responseData.error_details.Message,3)
                                            }
										 }else{
											 resolve(responseData);
										 }
                })
                .catch((err) => {
                    //console.log('回调 失败err:', common_url + url, err); //网络请求失败返回的数据
                    reject(err);
                });
        });
    } else { //如果网络请求中有参数
        return new Promise(function(resolve, reject) {
			////console.log(resolve, reject)
            timeout_fetch(fetch(common_url_sb+ url+apiversion, {
                    method: method,
                    headers: header,
                    body: JSON.stringify(params) //body参数，通常需要转换成字符串后服务器才能解析
                }),timeout).then((response) => headerData = response.json())
                .then((responseData) => {
                    // console.log('回调 成功res:', common_url + url, responseData); //网络请求成功返回的数据

										if(responseData.error_details){
                                            if(responseData.error_details.Code == 'MEM00004') {
                                                global.storage.save({
                                                    key: 'lockLogin' + params.username,
                                                    id: 'lockLogin' + params.username,
                                                    data: lockLogin += 1,
                                                    expires: null
                                                });
                                                if(FastLoginErr) {
                                                    //快速登陆提示
                                                    Toast.hide();
                                                    Alert.alert('密码错误', '请重新输入，错误5次将强制登出账号。',
                                                        [{ text: '确定', onPress: () => {
                                                            FastLoginErr > 4 && Actions.pop()
                                                        } }],
                                                    );
                                                    return
                                                }
                                                window.PasswordErr && window.PasswordErr()
                                                return
                                            }


                                            if (responseData.error_details.Code == 'MEM00060') {
                                                //超过5次登陆失败不饿能登陆，跳到客服页面
                                                Toast.hide();

                                                global.storage.save({
                                                    key: 'lockLogin' + params.username,
                                                    id: 'lockLogin' + params.username,
                                                    data: 6,
                                                    expires: null
                                                });
                                                Alert.alert('密码错误', responseData.error_details.Message,
                                                    [{
                                                        text: '确定',
                                                        onPress: () => {
                                                            FastLoginErr && Actions.pop()
                                                            LiveChatOpenGlobe()
                                                        },
                                                        style: 'cancel',
                                                    }],
                                                );
                                                return;
                                            }

                                            if (responseData.error_details.Code == "MEM00145") {
                                                if(!global.Restrict){
                                                    isGameLock=false
                                                    global.Restrict = true
                                                    ApiPort.UserLogin == false
                                                    Toast.fail('地区访问限制',2)
                                                    // Actions.replace("RestrictPage",{})
                                                    Actions.RestrictPage({from: 'restrict',RetryAfter: ''})
                                                    return;
                                                }
                                                return
                                            }

                                            if(responseData.error_details.Code == 'MEM00059'){

                                                global.storage.save({
                                                    key: 'lockLogin' + params.username,
                                                    id: 'lockLogin' + params.username,
                                                    data: lockLogin += 1,
                                                    expires: null
                                                });

                                                if(FastLoginErr) {
                                                    //快速登陆提示
                                                    Toast.hide();
                                                    Alert.alert('密码错误', '请重新输入，错误5次将强制登出账号。',
                                                        [{ text: '确定', onPress: () => {
                                                            FastLoginErr > 4 && Actions.pop()
                                                        } }],
                                                    );
                                                    return
                                                }
                                                window.PasswordErr && window.PasswordErr()
                                                Toast.fail(responseData.error_details.Message,2)
                                                return;
                                            }

                                            if(responseData.error_details.Code == 'MEM00061'){
                                                Toast.fail('您的帐号无法使用,请联系在线客服!',2, () => { LiveChatOpenGlobe() })
                                                return;
                                            }

                                            if(responseData.error_details.Code == "MEM00141"){
                                                ApiPort.UserLogin == false
                                                Toast.fail(responseData.error_details.Message,2)
                                                Actions.AccountFailure()
                                                return;
                                            }
                                            if(responseData.error_details.Code == "MEM00140"){
                                                //资料不完整，直接联系客服
                                                ApiPort.UserLogin == false
                                                Toast.fail(responseData.error_details.Message,2)
                                                Actions.AccountFailure({typeAction: 4})
                                                return;
                                            }

                                            // if(responseData.error_details.Code == "AUTH00001"){
                                            //     Toast.fail('The RB88 APP is currently not supporting Thailand region  \n ขณะนี้แอพ RB88 ยังไม่เปิดใช้ภาษาไทย',3)
                                            //       return;
                                            //   }

											if(responseData.error_details.Code == "GEN0005"){
												if(ApiPort.UserLogin == true){
                                                    if(Gologin == true){
                                                        Gologin = false;
                                                        Toast.fail('重复登录,系统检测到您重复登录',2)
                                                        navigateToSceneGlobeLoginOut('重复登录,系统检测到您重复登录')
                                                    }
                                                }
                                                return;
                                            }

                                            if(responseData.error_details.Code == 'GEN0006'){
                                                if(ApiPort.UserLogin == true){
                                                    if(Gologin == true){
                                                       Gologin = false;
                                                        Toast.fail('请重新登录,访问过期',3)
                                                        navigateToSceneGlobeLoginOut('请重新登录,访问过期')
                                                    }
                                                }
                                                return;
                                            }
                                            if(responseData.error_details.Code == "GEN0002"){   //訪問限制
                                                if(!global.Restrict){
                                                    isGameLock=false
                                                    global.Restrict = true
                                                    ApiPort.UserLogin == false
                                                    Toast.fail('地区访问限制',2)
                                                    // Actions.replace("RestrictPage",{})
                                                    Actions.RestrictPage({from: 'restrict',RetryAfter: ''})
                                                    return;
                                                }
                                                return
                                            }


                                            if(responseData.error_details.Code == "GEN0001"){
                                                if(!global.Restrict){
                                                    isGameLock=false
                                                    global.Restrict = true
                                                    ApiPort.UserLogin == false
                                                    Toast.fail('系统正在更新中，请您稍后再尝试登入',2)
                                                    // Actions.replace("RestrictPage",{})
                                                    Actions.RestrictPage({from: 'maintenance', error_details: responseData.error_details})
                                                    return;
                                                }
                                                return
                                                // Toast.fail('热播RB88系统正在更新中，请您稍后再尝试登入。',2)
                                              return;
                                            }

                                            if(responseData.error_details.Message != ""){
                                                Toast.fail(responseData.error_details.Message,2)
                                            }

										}else{

											resolve(responseData);
										}

                })
                .catch((err) => {
                    //console.log('回调 失败err:', common_url + url,  JSON.stringify(err)); //网络请求失败返回的数据
                    reject(err);
                });
        });
    }
}

