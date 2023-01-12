import { fetchRequest } from '$LIB/SportRequest';
import { realyNameReg } from '$LIB/SportReg';
import Toast from '@/Toast'
import { Cookie } from "$LIB/utils/Helper";

// 获取用户账户信息以及设置为LocalStorage
export function getMemberInfo (call, refresh) {
    console.log(call, refresh)
  const localMemberInfo = localStorage.getItem("memberInfo");
  let memberInfo = {};

  if (localMemberInfo === null || localMemberInfo === "" || refresh) {
    fetchRequest(ApiPort.Member, "GET").then((res) => {
      if (res && res.isSuccess) {
        res.result.memberInfo.contacts.forEach((val) => {
          res.result.memberInfo["isVerified" + val.contactType] = [val.contact, (val.status === "verified")];
        });

        Object.assign(memberInfo, res.result.memberInfo);
      }

      const memberInfoString = JSON.stringify(memberInfo);
      console.log(memberInfoString)
      localStorage.setItem("memberInfo", memberInfoString === "{}" ? "" : memberInfoString);
      call(memberInfo);
    }).catch(error => {
      console.log('getMemberInfo(GETMemberlistAPI) error:', error);
      return null;
    })

  } else {
    call(JSON.parse(localMemberInfo))
  }
}

// 设置用户真实姓名
export function setUserRealyName (name, call) {
  fetchRequest(ApiPort.Member, "PATCH", {
    "key": "FirstName",
    "value1": name
  }).then((res) => {
    if (res) {
      if (res.result.isSuccess == true) {
        Toast.success('更新成功!');
      } else if (res.isSuccess == false) {
        Toast.error(res.result.message);
      }
      call(res);
    }
  }).catch(error => {
    console.log('setUserRealyName error:', error);
    return null;
  });
}

export function setMemberInfo (data, call) {
  fetchRequest(ApiPort.PUTMemberlistAPI, "PATCH", data).then((res) => {
    call(res);
  }).catch(error => {
    console.log('setMemberInfo error:', error);
    return null;
  });
}

export function setMemberInfoPut (data, call) {
  fetchRequest(ApiPort.PUTMemberlistAPI, "PUT", data).then((res) => {
    call(res);
  }).catch(error => {
    console.log('setMemberInfo error:', error);
    return null;
  });
}

// 获取密保问题
export function getQuestion (call) {
  fetchRequest(ApiPort.GetQuestions, "GET").then((res) => {
    call(res);
  }).catch(error => {
    console.log('getQuestion error:', error);
    return null;
  })
}

export function backToMainsite() {

    let affCode;
    if (Cookie.GetCookieKeyValue('CO_Referer') || sessionStorage.getItem('affCode')) {
        affCode = Cookie.GetCookieKeyValue('CO_Referer') || sessionStorage.getItem('affCode')
    }

    let targetDomain = "";
    let StagingApi = Boolean(
		[
      'sportsstaging.fun88.biz',
      'sports1staging.fun88.biz',
      'sports2staging.fun88.biz',
      'sports3staging.fun88.biz',
      'sports4staging.fun88.biz',
      'sports5staging.fun88.biz',
			'localhost:6868',
			'localhost:8080',
			'192.168.0.108:8080',
			'192.168.137.1:6868',
			'192.168.0.108:6868',
			'127.0.0.1:6868'
		].find((v) => global.location.href.includes(v))
    );

    //　測試環境
    if (StagingApi) {
        targetDomain = "http://member.stagingp4.fun88.biz/"
        // 訪客導回
        if (!localStorage.getItem("loginStatus") == 1){
            window.location.href = `${targetDomain}${affCode?"?aff="+affCode:""}`;
            return;
        }
        // 會員導回
        const url = new URL(targetDomain);
        const token = JSON.parse(localStorage.getItem("memberToken"));
        const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
        if(url && token){
            let mainsiteServiceLink  = `${url.protocol}//${url.hostname}/Services/SBV2Service.ashx?token=${token.split(' ')[1]}&rtoken=${refreshToken}&cultureLanguage=zh-cn`;
            console.log(mainsiteServiceLink)
            window.location.href = mainsiteServiceLink;
        }
    }else{
        // 正式環境
        const url = new URL(global.location.href);
        targetDomain = url.hostname.split('.').length == 3? `${url.protocol}//${url.hostname.split('.')[1]}.${url.hostname.split('.')[2]}`:`${url.protocol}//${url.hostname}`

        // 訪客導回
        if (!localStorage.getItem("loginStatus") == 1){
            window.location.href = `${targetDomain}${affCode?"?aff="+affCode:""}`;
            return;
        }
        // 會員導回
        const token = JSON.parse(localStorage.getItem("memberToken"));
        const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
        if(url && token){
            let mainsiteServiceLink  = `${targetDomain}/Services/SBV2Service.ashx?token=${token.split(' ')[1]}&rtoken=${refreshToken}&cultureLanguage=zh-cn`;
            console.log(mainsiteServiceLink)
            window.location.href = mainsiteServiceLink;
        }
    }

}

export function clearStorageForLogout() {
  localStorage.removeItem('memberToken');
  localStorage.removeItem('memberInfo');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('LocalMemberInfo');
  localStorage.removeItem('PreferWallet');
  localStorage.removeItem('username');
  localStorage.removeItem('memberCode');
  localStorage.removeItem('loginStatus');
  localStorage.removeItem('IM_Token');
  localStorage.removeItem('IM_MemberCode');
  localStorage.removeItem('IM_MemberType');
  localStorage.removeItem('BTI_Token');
  localStorage.removeItem('BTI_MemberCode');
  localStorage.removeItem('BTI_JWT');
  localStorage.removeItem('LoginOTP');
  localStorage.removeItem('Revalidate');
  localStorage.removeItem('domains');
  localStorage.removeItem('userIP');
  localStorage.removeItem("firstLoginToken");
  localStorage.removeItem("useTokeLogin");

  global.userInfo_logout && global.userInfo_logout(); //redux登出
}

// 登出
export function logout(language, currency, userName) {
    let memberData = JSON.parse(localStorage.getItem("memberInfo"));
    let accessToken = localStorage.getItem("memberToken").split(" ")[1];
    let data = {
        client_id: "Fun88.CN.App",
        client_secret: "FUNmuittenCN",
        refresh_token: localStorage.getItem("refreshToken"),
        access_token: accessToken
            ? accessToken
            : "Bearer " + localStorage.getItem("memberToken"),
        membercode: userName ? userName : memberData.userName,
        siteId: siteId,
    };

    fetchRequest(ApiPort.Logout, "POST", data)
        .then((data) => {
            if (data.status === 1) {
                let defaultDomain = JSON.parse(localStorage.getItem("domains"))[
                    "DefaultDomain"
                ];

                clearStorageForLogout();

                window.RefreshTokensetInterval &&
                    clearInterval(RefreshTokensetInterval);

                if(language && currency){
                    let CurrencyCode = currency.split('').slice(0, currency.length - 1).join('');
                    let LanguageCode = language.split("-")[1];
                    if (currency !== "CNY") {
                        let url = new URL(defaultDomain);
                        let goToUrl = `${url.protocol}//${url.host}/${CurrencyCode}/${LanguageCode}`;
                        console.log(goToUrl)
                        window.location.href = goToUrl;
                        return;
                    }
                }


                window.location.href = defaultDomain;
            } else {
                console.log(data.message);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
