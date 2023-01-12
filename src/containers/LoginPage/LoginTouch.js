import React, { Component } from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	NativeModules,
	NativeEventEmitter,
	ScrollView,
	Platform,
	TextInput,
	Alert,
	Dimensions,
	Modal,
	ImageBackground
} from "react-native";
import { Toast, Flex, WingBlank } from "antd-mobile-rn";
import { connect } from "react-redux";

import FingerprintScanner from "react-native-fingerprint-scanner";
import Touch from "react-native-touch-once";
import { nameReg, passwordReg } from "../../actions/Reg";
import styles from "./style";
import { Actions } from "react-native-router-flux";
import { Linking } from "react-native";
import { login } from "../../lib/redux/actions/AuthAction";
const { width, height } = Dimensions.get("window");
// 指纹识别
class LoginTouch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			LoginTouchNum: window.LoginTouchNum,
			msgtype: 100,
			loginBtn: false,
			seeLoginPwd: false,
			emptyLogMsg: '',
			imagesArray: [],
			loginPwd: "",
			validation: "",
			validationActive: '',
			validationSuccess: false,
			loginUsername: this.props.username || ""
		};
	}

	componentDidMount() {
		this.props.navigation && this.props.navigation.setParams({
			title: DeviceInfoIos ? '脸部辨识快速登录' : '指纹辨识认证'
		});

		if(LoginTouchNum > 2 || (((DeviceInfoIos && LoginTouchNum > 1) || (!DeviceInfoIos && LoginTouchNum > 0)) && Platform.OS == "ios")) {
			//ios一次等于3次
			let title = `${DeviceInfoIos ? '脸部解锁': '指纹辨识'}功能已关闭`
			let message = `${DeviceInfoIos ? "脸部辨识失败4次" : "指纹辨识失败3次"}，请使用一般登入或是 联系客服。`;
			Alert.alert(title, message, [{ text: '确定', onPress: () => { } }]);
			return
		}

		// FingerprintScanner.isSensorAvailable()
		// 	.then(promise => {
		// 	})
		// 	.catch(error => {
		// 		ErrorMsg(error.name);
		// 	});
	}
	componentWillUnmount() {
		Platform.OS == "android" && FingerprintScanner.release();
		this.setState({ validationSuccess: false });
	}


	handleTextInput(key, value) {

		let emptyLogMsg = ''
		let loginBtn = true
		if (!passwordReg.test(value)) {
			emptyLogMsg = '请输入正确的密码。'
			loginBtn = false
		}
		this.setState({ emptyLogMsg, loginBtn })

		this.setState({
			[key]: value
		});
	}

	// 提交按钮
	okBtn() {
		if(this.state.emptyLogMsg || this.state.loginPwd == '') { return }
		if(LoginTouchNum > 2 || (((DeviceInfoIos && LoginTouchNum > 1) || (!DeviceInfoIos && LoginTouchNum > 0)) && Platform.OS == "ios")) {
			//ios一次等于3次
			let title = `${DeviceInfoIos ? '脸部解锁': '指纹辨识'}功能已关闭`
			let message = `${DeviceInfoIos ? "脸部辨识失败4次" : "指纹辨识失败3次"}，请使用一般登入或是 联系客服。`;
			Alert.alert(title, message, [{ text: '确定', onPress: () => { } }]);
			return
		}

		if (this.props.fastChange) {
			//我的 -》本地密码对比，没问题保存修改
			let fastLoginKey = "fastLoginPass" + this.state.loginUsername.toLowerCase();
			let sfastLoginId = "fastLoginPass" + this.state.loginUsername.toLowerCase();
			global.storage
				.load({
					key: fastLoginKey,
					id: sfastLoginId
				})
				.then(ret => {
					if (ret != this.state.loginPwd) {
						//5崔退出，密码错误弹窗
						let passErr = this.state.passErr
						passErr += 1
						this.setState({ passErr })
						Alert.alert('密码错误', '请重新输入，错误5次将强制登出账号。',
							[{ text: '确定', onPress: () => {
								if (passErr == 5) {
									window.navigateToSceneGlobeX && window.navigateToSceneGlobeX();
								}
							} }],
						);
					} else {
						this.setState({ validationActive: '' })
						setTimeout(() => {
							this.setState({ validationActive: 'active' })
						}, 500);
					}
				})
				.catch(err => {
					Toasts.error('网络错误，请重新登陆');
					window.navigateToSceneGlobe && window.navigateToSceneGlobe();
				})


		} else {
			//先去登陆，在验证指纹脸部
			window.FastLoginErr += 1
			window.fastLogin &&
				window.fastLogin(
					this.state.loginUsername,
					this.state.loginPwd,
					"LoginTouch"
				);
		}
	}

	// 返回按钮
	goBack() {
		Actions.pop();
	}
	successActive() {
		//验证成功
		LoginTouchNum = 0
		this.setState({ validationActive: 'success' })
		//保存快捷登陆方式
		let fastLoginKey = "fastLogin" + this.state.loginUsername.toLowerCase();
		let sfastLoginId = "fastLogin" + this.state.loginUsername.toLowerCase();
		global.storage.save({
			key: fastLoginKey,
			id: sfastLoginId,
			data: 'LoginTouch',
			expires: null
		});
		global.storage.save({
			key: `lockTouch${userNameDB.toLowerCase()}`,
			id: `lockTouch${userNameDB.toLowerCase()}`,
			data: LoginTouchNum,
			expires: null
		});
	}

	//设置成功按钮
	successBtn() {
		//验证成功跳转
		if (this.props.fastChange) {
			//我的页面  进入
			this.props.changeBack()
			Actions.pop();
		} else {
			// 登陆页面进入
			let username = "loginok";
			let password = "loginok";
			this.props.login({ username, password });
		}
	}

	render() {
		const {
			LoginTouchNum,
			msgtype,
			seeLoginPwd,
			emptyLogMsg,
			loginBtn,
			validation,
			loginUsername,
			loginPwd,
			validationActive,
			validationSuccess
		} = this.state;

		//登陆成功
		window.FastLoginBack = key => {
			Toast.hide();
			this.setState({ validationActive: '' })
			setTimeout(() => {
				this.setState({ validationActive: 'active' })
			}, 500);
		};
		return (
			<View style={{ flex: 1, backgroundColor: '#fff' }}>
				<View>
					<View>
						<View style={styles.validation}>
							{/* 输入用户名和密码 */}
							{
								(validationActive == '' || validationActive == 'active') &&
								<View style={styles.inputBoxView}>
									<Text style={styles.titleTxt}>
										请输入您的密码确认启用
									</Text>

									<View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
										<Image
											resizeMode="stretch"
											source={DeviceInfoIos ? require("../../images/login/faceed.png") : require("../../images/login/touched.png")}
											style={{ width: 46, height: 47 }}
										/>
										<Text style={{ color: '#666', padding: 10 }}>{loginUsername}</Text>
									</View>

									{/* 密码 */}
									{
										emptyLogMsg != '' &&
										<View style={styles.errMsg}>
											<Text style={{ color: '#EB2121', lineHeight: 35 }}>{emptyLogMsg}</Text>
										</View>
									}
									<View style={styles.inputView}>
										<Image resizeMode='stretch' source={require('../../images/login/password.png')} style={{ width: 20, height: 20 }} />
										<TextInput
											style={styles.input}
											underlineColorAndroid="transparent"
											value={loginPwd}
											placeholder="密码"
											placeholderTextColor="#BCBEC3"
											maxLength={20}
											textContentType="password"
											secureTextEntry={!seeLoginPwd}
											onChangeText={value =>
												this.handleTextInput("loginPwd", value)
											}
										/>
										<Touch style={styles.eyesBtn} onPress={() => { this.setState({ seeLoginPwd: !seeLoginPwd }) }}>
											<Image
												resizeMode='stretch'
												source={!seeLoginPwd ? require('../../images/login/close_eye.png') : require('../../images/login/eyse.png')}
												style={{ width: 18, height: 13 }}
											/>
										</Touch>
									</View>

									{/* 提交按钮 */}
									<Touch
										style={{ width: width - 40, backgroundColor: loginBtn ? '#00A6FF' : '#EFEFF4', borderRadius: 8, }}
										onPress={() => { this.okBtn() }}
									>
										<Text style={{ color: loginBtn ? '#fff' : '#BCBEC3', lineHeight: 45, textAlign: 'center' }}>确认</Text>
									</Touch>

								</View>
							}
							{
								validationActive == 'active' &&
								<View>
									{/* ios指纹脸部  */}
									{Platform.OS == "ios" && ((DeviceInfoIos && LoginTouchNum < 2) || (!DeviceInfoIos && LoginTouchNum == 0)) && (
										<FingerprintPopupIOS
											errCallback={err => {
												ErrorMsg(err, (LoginTouchNum) => { this.setState({LoginTouchNum}) });
												//脸部识别需要2次打开,错误是回调，所以小于2
											}}
											successCallback={() => {
												this.successActive();
											}}
										/>
									)}
									{/* android指纹 */}
									{Platform.OS == "android" && (
										<FingerprintPopupAndroid
											errCallback={err => {
												// this.errorMessage(err);
											}}
											successCallback={() => {
												this.successActive();
											}}
										/>
									)}
								</View>
							}

						</View>

						{/* 设定成功 */}
						{
							validationActive == 'success' &&
							<View style={styles.inputBoxView}>
								<Text style={styles.titleTxt}>
									{DeviceInfoIos ? '设定成功，下次登入即可使用脸部辨识认证' : '设定成功，下次登入即可使用指纹辨识认证'}
								</Text>

								<View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
									<Image
										resizeMode="stretch"
										source={DeviceInfoIos ? require("../../images/login/faceed.png") : require("../../images/login/touched.png")}
										style={{ width: 46, height: 47 }}
									/>
									<Text style={{ color: '#666', padding: 10 }}>{loginUsername}</Text>
									<View style={{ position: 'absolute', top: 30, right: 12, backgroundColor: '#fff', borderRadius: 40 }}>
										<Image
											resizeMode="stretch"
											source={require("../../images/icon-done.png")}
											style={{ width: 18, height: 18 }}
										/>
									</View>
								</View>

								{/* 提交按钮 */}
								<Touch
									style={{ width: width - 40, backgroundColor: '#00A6FF', borderRadius: 8, }}
									onPress={() => { this.successBtn() }}
								>
									<Text style={{ color: '#fff', lineHeight: 45, textAlign: 'center' }}>完成设定</Text>
								</Touch>

							</View>
						}
					</View>
				</View>
			</View>
		);
	}
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
	login: loginDetails => {
		login(dispatch, loginDetails);
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginTouch);

export class FingerprintPopupIOS extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		FingerprintScanner.authenticate({
			description: DeviceInfoIos ? "温馨提示,使用脸部辨识" : "温馨提示,使用指纹辨识",
			fallbackEnabled: false
		})
			.then(() => {
				this.props.successCallback();
			})
			.catch(error => {
				this.props.errCallback(error.name);
			});
	}

	render() {
		return false;
	}
}

export class FingerprintPopupAndroid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: true,
			errorMessage: "使用指纹辨识",
			onLock: false,//锁定
			touchNull: false,
		};
	}

	componentDidMount() {
		if(LoginTouchNum > 3 && lockLogin < 5) {
			this.onLockMsg('指纹辨识失败3次，请使用一般登入或是 联系客服。')
			this.props.errCallback(4)
			return
		}
		FingerprintScanner.authenticate({
			onAttempt: this.handleAuthenticationAttempted
		})
			.then(() => {
				this.props.successCallback();
			})
			.catch(error => {
				// this.props.errCallback(error.name);
				this.errorMessage(error.name);
			});
	}

	componentWillUnmount() {
		FingerprintScanner.release();
	}

	//验证失败
	handleAuthenticationAttempted = error => {
		this.errorMessage(error.name);
	};
	//指纹验证错误提示
	errorMessage(err) {
		let title = '温馨提醒'
		let message = "";
		let touchNull = false
		let onLock = false
		let active = false

		LoginTouchNum += 1
		

		switch (err) {
			case "AuthenticationNotMatch":
				//不匹配
				message = "辨别失败，请重新输入。";
				window.LockLoginFun && window.LockLoginFun(1)
				lockLogin < 5 && this.setState({active: true})
				break;
			case "AuthenticationFailed":
				//指纹不匹配
				message = "辨别失败，请重新输入。";
				active = true
				break;
			case "UserCancel":
				//点击取消
				message = "您已取消验证";
				active = true
				break;
			case "UserFallback":
				//点击输入密码
				message = "您已取消验证 ";
				active = true
				break;
			case "SystemCancel":
				//进入后台
				message = "系统已取消验证";
				active = true
				break;
			case "PasscodeNotSet":
				//手机没有设置密码
				message = "您还未设置密码";
				active = true
				break;
			case "FingerprintScannerNotAvailable":
				//无法使用指纹功能
				message = "指纹登入无法启动，此手机没有指纹识别功能";
				active = true
				break;
			case "FingerprintScannerNotEnrolled":
				//手机没有预先设置指纹
				LoginTouchNum -= 1
				touchNull = true
				message = DeviceInfoIos ? "未检测到您有录入脸部辨识信息。 请至系统设定修改。" : "没有设定指纹！至少设定一个。";
				break;
			case "FingerprintScannerUnknownError":
				//验证错误次数过多，请使用密码登录
				message = "指纹辨识失败3次，请使用一般登入或是 联系客服。";
				this.onLockMsg(message)
				break;
			case "FingerprintScannerNotSupported":
				//设备不支持
				message = "此手机不支持该功能";
				active = true
				break;
			case "DeviceLocked":
				//认证不成功，锁定30秒
				message = "指纹辨识失败3次，请使用一般登入或是 联系客服。";
				this.onLockMsg(message)
				onLock = true
				break;

			default:
				message = "错误原因导致无法使用";
				active = true
				break;
		}

		if(lockLogin >= 5) {
			this.props.errCallback(4)
			this.setState({ active: false })
			Alert.alert('密码错误', '你已超过尝试的限制，请联系管理员',
			[{ text: '确定', onPress: () => {LiveChatOpenGlobe()} }]);
			return
		}
		
		global.storage.save({
			key: `lockTouch${userNameDB.toLowerCase()}`,
			id: `lockTouch${userNameDB.toLowerCase()}`,
			data: LoginTouchNum,
			expires: null
		});
		if(LoginTouchNum > 2) {
			//错误是回调，第三次错误提示
			this.setState({active: false})
			onLock = true
			this.onLockMsg('指纹辨识失败3次，请使用一般登入或是 联系客服。')
			this.props.errCallback(LoginTouchNum)
			return
		}
		this.props.errCallback(LoginTouchNum)
		if(touchNull) {
			//没有 设置过指纹 
			Alert.alert(title, message,
				[{
					text: '取消',onPress: () => { Actions.pop() },
				},
				{
					text: '前往设定', onPress: () => {
						Actions.pop()
						if(!NativeModules.opeinstall.openNetworkSettings) {
							Toasts.error('请手动打开手机设置')
							return
						}
						NativeModules.opeinstall.openNetworkSettings((data) => {
							!data && Toasts.error('请手动打开手机设置')
						});
					}
				},
				],
			);
			this.setState({active: false})
			return
		}
		this.setState({ errorMessage: "" });
		setTimeout(() => {
			this.setState({ errorMessage: message });
		}, 500);
	}

	onLockMsg(msg) {
		this.setState({active: false}, () => {
			Alert.alert('指纹辨识功能已关闭', msg, [{ text: '确定', onPress: () => { } }]);
		})
	}

	render() {
		const {
			errorMessage,
		} = this.state

		return (
			<View>
				<Modal
					animationType="none"
					transparent={true}
					visible={this.state.active}
					onRequestClose={() => { }}
				>
					<View style={styles.modals} >
						<View style={styles.modalView} >
							<Text style={styles.modalTitle} >{'温馨提醒'}</Text>
							<Text style={{ color: "#000" }}>{errorMessage}</Text>
							<View style={styles.modalImg} >
								<Image
									resizeMode="stretch"
									source={require("../../images/login/touched.png")}
									style={{ width: 70, height: 70 }}
								/>
							</View>
							<Text
								style={{ color: "#2ECC9D", textAlign: 'right', fontSize: 17 }}
								onPress={() => {
									this.setState({ active: false })
								}}
							>
								取消
							</Text>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}


export const ErrorMsg = (err, callBack, FastLogin) => {
	// 指纹验证错误提示
	let message = "";
	let title = '温馨提醒'
	let set = false//android前往设置提示语
	let close = false

	LoginTouchNum += 1
	switch (err) {
		case "AuthenticationNotMatch":
			//不匹配
			title = (DeviceInfoIos ? '脸部解锁': '指纹辨识') + '功能已关闭'
			message = DeviceInfoIos ? "脸部辨识失败4次，请使用一般登入或是联系客服。" : "指纹辨识失败3次，请使用一般登入或是 联系客服。";
			break;
		case "AuthenticationFailed":
			//指纹不匹配
			title = (DeviceInfoIos ? '脸部解锁': '指纹辨识') + '功能已关闭'
			message = DeviceInfoIos ? "脸部辨识失败4次，请使用一般登入或是联系客服。" : "指纹辨识失败3次，请使用一般登入或是 联系客服。";
			break;
		case "UserCancel":
			//点击取消
			DeviceInfoIos ? '': LoginTouchNum = 0
			message = "您已取消验证";
			close = true
			break;
		case "UserFallback":
			//点击输入密码
			message = "您已取消验证 ";
			close = true
			break;
		case "SystemCancel":
			//进入后台
			message = "系统已取消验证";
			break;
		case "PasscodeNotSet":
			//手机没有设置密码
			message = "您还未设置密码";
			break;
		case "FingerprintScannerNotAvailable":
			message = DeviceInfoIos ? "未检测到您有录入脸部辨识信息。 请至系统设定修改。" : "指纹登入无法启动，您手机内还未设置指纹";
			title = '系统错误'
			set = true
			break;
		case "FingerprintScannerNotEnrolled":
			//手机没有预先设置指纹
			message = DeviceInfoIos ? "未检测到您有录入脸部辨识信息。 请至系统设定修改。" : "指纹登入无法启动，您手机内还未设置指纹";
			title = '系统错误'
			set = true
			break;
		case "FingerprintScannerUnknownError":
			//验证错误次数过多，请使用密码登录
			message = DeviceInfoIos ? "脸部辨识失败4次，请使用一般登入或是联系客服。" : "指纹辨识失败3次，请使用一般登入或是 联系客服。";
			LoginTouchNum = 4
			break;
		case "FingerprintScannerNotSupported":
			//手机没有预先设置指纹
			message = DeviceInfoIos ? "未检测到您有录入脸部辨识信息。 请至系统设定修改。" : "指纹登入无法启动，您手机内还未设置指纹";
			LoginTouchNum = 0
			title = '系统错误'
			set = true
			break;
		case "DeviceLocked":
			//认证不成功，锁定30秒
			message = DeviceInfoIos ? "脸部辨识失败4次，请使用一般登入或是联系客服。" : "指纹辨识失败3次，请使用一般登入或是 联系客服。";
			LoginTouchNum = 4
			break;
		default:
			message = "错误原因导致无法使用";
			break;
	}
	
	callBack(DeviceInfoIos && lockLogin >= 4 && FastLogin? 3: LoginTouchNum)

	if((!DeviceInfoIos && lockLogin >= 2 && FastLogin) || (DeviceInfoIos && lockLogin >= 4 && FastLogin)) {
		Alert.alert('密码错误', '你已超过尝试的限制，请联系管理员',
		[{ text: '确定', onPress: () => {LiveChatOpenGlobe()} }]);
		return
	}
	global.storage.save({
		key: `lockTouch${userNameDB.toLowerCase()}`,
		id: `lockTouch${userNameDB.toLowerCase()}`,
		data: LoginTouchNum,
		expires: null
	});
	
	if((DeviceInfoIos && LoginTouchNum > 1) || (!DeviceInfoIos && LoginTouchNum > 0)) {
		//脸部解锁需要2次,错误是回调，第二次错误提示
		title = (DeviceInfoIos ? '脸部解锁': '指纹辨识') + '功能已关闭'
		message = DeviceInfoIos ? "脸部辨识失败4次，请使用一般登入或是联系客服。" : "指纹辨识失败3次，请使用一般登入或是 联系客服。";
		Alert.alert(title, message, [{ text: '确定', onPress: () => {  } }]);
		return
	}
	!close && Alert.alert(title, message, [{ text: '确定', onPress: () => {set && Linking.openURL('app-settings:').catch((err) => {})} }]);
	// Actions.pop()
}




