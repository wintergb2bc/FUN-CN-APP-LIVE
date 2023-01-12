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
	Alert,
	TextInput,
	Dimensions,
	ImageBackground,
	Modal
} from "react-native";
import { Toast, Flex } from "antd-mobile-rn";

import PasswordGesture from "../../gesturePassword/index";

import Touch from "react-native-touch-once";
import { nameReg, passwordReg } from "../../actions/Reg";
import styles from "./style";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { login } from "../../lib/redux/actions/AuthAction";
const { width, height } = Dimensions.get("window");

// 设置图形解锁
class LoginPattern extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			passErr: 0,//密码错误5次需要重新登陆
			seeLoginPwd: false,
			loginBtn: false,
			emptyLogMsg: '',
			imagesArray: [],
			loginPwd: "",
			message: this.props.forgotPass? `请输入旧密码以便重新设定图形密码锁`: `此图形密码锁，用于快速登录应用程序\n请连续画出四至九个点`,
			step: 1,
			forgotPass: this.props.forgotPass,
			status: "normal",
			timeOut: 300,
			beforPassword: "", //首次图形密码
			secondPassword: "", //第二次图形密码
			validationActive: this.props.forgotPass? 'active': '', //设置图案状态
			loginUsername: this.props.username || ""
		};
	}
	componentDidMount() {
		if(LoginPatternNum >= 3) {
			Alert.alert('图形解锁功能已关闭', '图形辨识失败3次，请使用一般登入或是 联系客服。', [{ text: '确定', onPress: () => { } }]);
			return
		}
	}

	componentWillUnmount() { }

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
	// 提交按钮,验证密码,
	okBtn() {
		if(this.state.emptyLogMsg || this.state.loginPwd == '') { return }
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
						LoginPatternNum = 0
						this.setState({ validationActive: 'active' })
					}
				})
				.catch(err => {
					Toasts.error('网络错误，请重新登陆');
					window.navigateToSceneGlobe && window.navigateToSceneGlobe();
				})


		} else {
			//登陆页面-》设置成功后去登陆，
			window.FastLoginErr += 1
			window.fastLogin &&
				window.fastLogin(
					this.state.loginUsername,
					this.state.loginPwd,
					"LoginPattern"
				);
		}

	}

	// 返回按钮
	goBack() {
		Actions.pop();
	}

	onStart() {
		if(LoginPatternNum >= 3) {
			Alert.alert('图形解锁功能已关闭', '图形辨识失败3次，请使用一般登入或是 联系客服。', [{ text: '确定', onPress: () => { } }]);
			return
		}
		this.setState({ status: "normal" });
		if (this.state.timeOut) {
			clearTimeout(this.time);
		}
	}

	onEnd(password) {
		const { timeOut, beforPassword, step } = this.state;
		const loginUsername = this.state.loginUsername.toLowerCase();
		if(LoginPatternNum >= 3) { return }
		// console.log("passwordpasswordpassword", password);
		if (step == 1) {
			if(this.props.fastChange && this.state.forgotPass) {
				//修图形密码
				this.getPattern(password)
				return
			}
			// 第一次输入图案
			if (password.length < 4) {
				this.setState({
					status: "wrong",
					message: `此图形密码锁，用于快速登录应用程序\n请连续画出四至九个点`
				});
				// Toast.fail("请连续画出四至九个点", 2);
				return;
			} else {
				LoginPatternNum = 0
				this.setState({
					beforPassword: password,
					status: "right",
					message: "请再确认一次图形密码锁",
					step: 2
				});
			}
		} else {
			// step==2
			// 第二次输入图案
			if (password === beforPassword) {
				LoginPatternNum = 0
				this.setState({
					status: "right",
					secondPassword: password
				});
				setTimeout(() => {
					//成功设置九宫格密码
					this.setState({ validationActive: 'success' })
					//登陆成功,保存图形密码
					let storageKey = "patternKey" + loginUsername;
					let storageId = "patternId" + loginUsername;
					global.storage.save({
						key: storageKey,
						id: storageId,
						data: this.state.beforPassword,
						expires: null
					});
							//保存快捷登陆方式
					let fastLoginKey = "fastLogin" + loginUsername;
					let sfastLoginId = "fastLogin" + loginUsername;
					global.storage.save({
						key: fastLoginKey,
						id: sfastLoginId,
						data: 'LoginPattern',
						expires: null
					});
				}, 1000);
			} else {
				this.setState({
					status: "wrong",
					message: "两次密码不同，请重新输入"
				});
			}
		}
		global.storage.save({
			key: `lockPattern${loginUsername}`,
			id: `lockPattern${loginUsername}`,
			data: LoginPatternNum,
			expires: null
		});
	}

	getPattern(pass) {
		//修改九宫格密码研制旧图形
		const username = this.state.loginUsername.toLowerCase();
		let storageKey = "patternKey" + username;
		let storageId = "patternId" + username;
		global.storage
			.load({
				key: storageKey,
				id: storageId
			})
			.then(ret => {
				if(pass == ret) {
					LoginPatternNum = 0
					this.setState({ validationActive: 'active', forgotPass: false })
					this.setState({
						status: "right",
						message: `请输入新的图形密码锁，此图形密码锁，\n用于快速登录应用程序，请连续画出四至九个点。`,
					});
				} else {
					LoginPatternNum += 1
					this.setState({
						status: "wrong",
						message: "图形密码输入错误，请重新输入"
					});
				}
				global.storage.save({
					key: `lockPattern${username}`,
					id: `lockPattern${username}`,
					data: LoginPatternNum,
					expires: null
				});
			})
			.catch(err => {
				this.setState({
					status: "wrong",
					message: "图形密码输入错误，请重新输入"
				});
			})
	}


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

	//重新输入
	errorBack() {
		this.setState({
			status: "normal",
			step: 1,
			beforPassword: "",
			message: "此图形密码锁，用于快速登录应用程序，\n请连续画出四至九个点"
		});
	}


	render() {
		//登陆成功
		window.FastLoginBack = key => {
			Toast.hide();
			LoginPatternNum = 0
			this.setState({ validationActive: 'active' });
		};
		const {
			forgotPass,
			loginBtn,
			seeLoginPwd,
			emptyLogMsg,
			validationActive,
			loginUsername,
			loginPwd,
			beforPassword,
			step,
			status,
			message
		} = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: '#fff' }}>
				{
					//设置前验证密码
					validationActive == '' &&
					<View style={styles.inputBoxView}>
						<Text style={styles.titleTxt}>
							请输入您的密码确认启用
						</Text>

						<View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
							<Image
								resizeMode="stretch"
								source={require("../../images/login/unlocked.png")}
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
					//设置图形密码
					validationActive == 'active' &&
					<PasswordGesture
						ref="pg"
						status={this.state.status}
						message={this.state.message}
						onStart={() => this.onStart()}
						onEnd={password => this.onEnd(password)}
						innerCircle={true}
						outerCircle={true}
						allowCross={true}
						interval={this.state.timeOut}
						normalColor={"#666"}
						rightColor={"#666"}
						wrongColor={"#EB2121"}
						textStyle={{ textAlign: "center", lineHeight: 22, color: "#000" }}
						style={{ backgroundColor: "#fff" }}
					>
						{beforPassword != "" && (
							<View style={[styles.patternTxt, { top: height / 1.4 }]}>
								<Touch onPress={() => {
									Alert.alert('图形密码清除设定提醒', '点击确认后，图形密码将清除并重新设定。',
										[{
											text: '取消', onPress: () => { }, style: 'cancel',
										},
										{
											text: '确认', onPress: () => {
												this.errorBack()
											}
										},
										],
									);
								}}>
									<View style={{ borderWidth: 1, borderColor: '#00A6FF', borderRadius: 8, width: width - 40 }}>
										<Text style={{ color: '#00A6FF', textAlign: 'center', lineHeight: 45 }}>重新输入图形密码</Text>
									</View>
								</Touch>
							</View>
						)}
						{this.props.fastChange &&  forgotPass && (
							<View style={[styles.patternTxt, { top: height / 1.4 }]}>
								<Touch onPress={() => { this.setState({ validationActive: '',LoginPatternNum: 0, forgotPass: false, message: `此图形密码锁，用于快速登录应用程序，\n请连续画出四至九个点` }) }}>
									<View style={{ borderWidth: 1, borderColor: '#00A6FF', borderRadius: 8, width: width - 40 }}>
										<Text style={{ color: '#00A6FF', textAlign: 'center', lineHeight: 45 }}>忘记图形密码</Text>
									</View>
								</Touch>
							</View>
						)}
					</PasswordGesture>
				}

				{
					//设置成功
					validationActive == 'success' &&
					<View style={styles.inputBoxView}>
						<Text style={styles.titleTxt}>
							图形密码设定完成，下次登录即可使用图形密码
						</Text>

						<View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
							<Image
								resizeMode="stretch"
								source={require("../../images/login/unlocked.png")}
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
		);
	}
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
	login: loginDetails => {
		login(dispatch, loginDetails);
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPattern);
