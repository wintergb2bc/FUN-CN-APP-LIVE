import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  NativeModules,
  Linking,
  NativeEventEmitter,
  ScrollView,
  Platform,
  Alert,
  TextInput,
  Dimensions,
  ImageBackground,
  Modal,
} from "react-native";
import { Toast, Flex } from "antd-mobile-rn";
import { FingerprintPopupIOS, FingerprintPopupAndroid } from "./LoginTouch";

import PasswordGesture from "../../gesturePassword/customIndex";

import { ErrorMsg } from "./LoginTouch";

import Touch from "react-native-touch-once";
import { nameReg, passwordReg } from "../../actions/Reg";
import styles from "./style";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { login } from "../../lib/redux/actions/AuthAction";

let ScrollNum = 0;

const { width, height } = Dimensions.get("window");

// 设置图形解锁
class FastLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginTouchNum: window.LoginTouchNum,
      faceId: true,
      winHeight: height,
      scrollEnabled: true,
      FastLogin: "",
      step: 1,
      status: "normal",
      timeOut: 300,
      message: "请输入您的图形密码",
      username: this.props.username,
      loginPwd: "",
      patternPass: "2369",
    };
  }
  componentWillMount() {
    if (LoginPatternNum >= 3) {
      Alert.alert(
        "图形解锁功能已关闭",
        "图形辨识失败3次，请使用一般登入或是 联系客服。",
        [{ text: "确定", onPress: () => {} }]
      );
      return;
    }

    if (
      LoginTouchNum > 2 ||
      (((DeviceInfoIos && LoginTouchNum > 1) ||
        (!DeviceInfoIos && LoginTouchNum > 0)) &&
        Platform.OS == "ios")
    ) {
      //ios一次等于3次
      let title = (DeviceInfoIos ? "脸部解锁" : "指纹辨识") + "功能已关闭";
      let message = DeviceInfoIos
        ? "脸部辨识失败4次，请使用一般登入或是联系客服。"
        : "指纹辨识失败3次，请使用一般登入或是 联系客服。";
      Alert.alert(title, message, [{ text: "确定", onPress: () => {} }]);
      return;
    }

    this.getPattern();
    this.getUserName();
  }

  getPattern() {
    const username = this.state.username.toLowerCase();
    let storageKey = "patternKey" + username;
    let storageId = "patternId" + username;
    global.storage
      .load({
        key: storageKey,
        id: storageId,
      })
      .then((ret) => {
        this.setState({ patternPass: ret });
      })
      .catch((err) => {});
  }

  getUserName() {
    //获取记住用户密码
    let fastLoginKey = "fastLoginPass" + this.state.username.toLowerCase();
    let sfastLoginId = "fastLoginPass" + this.state.username.toLowerCase();
    global.storage
      .load({
        key: fastLoginKey,
        id: sfastLoginId,
      })
      .then((ret) => {
        this.setState({ loginPwd: ret });
      })
      .catch((err) => {
        //拿不到密码清除快速登录
        const username = this.state.username.toLowerCase();
        let fastLogin = "fastLogin" + username;
        let sfastLogin = "fastLogin" + username;
        global.storage.remove({
          key: fastLogin,
          id: sfastLogin,
        });
      });
  }

  //验证成功情况登陆
  successActive() {
    LoginTouchNum = 0;
    window.fastLogin &&
      window.fastLogin(this.state.username, this.state.loginPwd, "");
  }

  onStart() {
    if (LoginPatternNum >= 3) {
      Alert.alert(
        "图形解锁功能已关闭",
        "图形辨识失败3次，请使用一般登入或是 联系客服。",
        [{ text: "确定", onPress: () => {} }]
      );
      return;
    }
    this.setState({
      status: "normal",
      message: "请输入您的图形密码",
      scrollEnabled: false,
    });
    if (this.state.timeOut) {
      clearTimeout(this.time);
    }
  }

  onEnd(password) {
    const { patternPass } = this.state;
    this.setState({ scrollEnabled: true });

    if (password == patternPass) {
      //密码正确
      LoginPatternNum = 0;
      this.setState({
        status: "right",
        message: `图形密码输入正确`,
      });
      setTimeout(() => {
        this.successActive();
      }, 1000);
    } else {
      this.setState({
        status: "wrong",
        message: `图形密码输入错误，请重新输入`,
      });
      window.LockLoginFun && window.LockLoginFun(1);
      LoginPatternNum += 1;
    }
    global.storage.save({
      key: `lockPattern${this.state.username}`,
      id: `lockPattern${this.state.username}`,
      data: LoginPatternNum,
      expires: null,
    });
  }

  getBtnPos = (e) => {
    NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
      window.LoginPatternHeight = this.state.winHeight / 2 - (py + height / 2);
      console.log(
        window.LoginPatternHeight,
        "pypypypypypypy1111",
        py,
        this.state.winHeight
      );
    });
  };

  render() {
    const { faceId, LoginTouchNum, message } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {this.props.FastLogin == "LoginTouch" && (
          <View>
            <BGTOP />
            <View style={styles.loginView}>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  resizeMode="stretch"
                  source={
                    DeviceInfoIos
                      ? require("../../images/login/faceed.png")
                      : require("../../images/login/touched.png")
                  }
                  style={{ width: 46, height: 47 }}
                />
                <Text style={{ textAlign: "center", lineHeight: 50 }}>
                  {DeviceInfoIos ? "脸部辨识快速登录" : "使用指纹辨识"}
                </Text>
                <Touch
                  style={{
                    backgroundColor: "#00A6FF",
                    borderRadius: 8,
                    width: width - 40,
                    marginTop: 30,
                  }}
                  onPress={() => {
                    Actions.pop();
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      lineHeight: 42,
                    }}
                  >
                    一般登入
                  </Text>
                </Touch>
              </View>
            </View>
          </View>
        )}

        {this.props.FastLogin == "LoginPattern" && (
          <ScrollView
            scrollEnabled={this.state.scrollEnabled}
            scrollEventThrottle={200}
            onScroll={(e) => {
              let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
              window.LoginPatternHeight =
                window.LoginPatternHeight + offsetY - ScrollNum;
              console.log(
                window.LoginPatternHeight,
                "offsetY.offsetY",
                offsetY
              );
              ScrollNum = offsetY; //记录上一帧滑动距离,用于抵扣
            }}
            style={{ flex: 1 }}
          >
            <BGTOP />
            <View style={styles.bgFFF} />
            <Text style={{ textAlign: "center" }}>{message}</Text>
            <View style={{ flex: 1 }} onLayout={(e) => this.getBtnPos(e)}>
              <PasswordGesture
                status={this.state.status}
                // message={this.state.message}
                onStart={() => this.onStart()}
                onEnd={(password) => this.onEnd(password)}
                innerCircle={true}
                outerCircle={true}
                allowCross={true}
                interval={this.state.timeOut}
                normalColor={"#666"}
                rightColor={"#0CCC3C"}
                rightLineColor={"#0CCC3C"}
                wrongColor={"#F92D2D"}
                // transparentLine={true}
                textStyle={{
                  textAlign: "center",
                  lineHeight: 22,
                  color: "#fff",
                }}
                style={styles.PasswordGestureStyle}
              ></PasswordGesture>
            </View>
            <Touch
              style={{
                backgroundColor: "#00A6FF",
                borderRadius: 8,
                width: width - 40,
                marginTop: 30,
                marginLeft: 20,
                marginBottom: 50,
              }}
              onPress={() => {
                Actions.pop();
              }}
            >
              <Text
                style={{ color: "#fff", textAlign: "center", lineHeight: 42 }}
              >
                一般登入
              </Text>
            </Touch>
          </ScrollView>
        )}

        {
          // 指纹脸部
          this.props.FastLogin == "LoginTouch" && (
            <View>
              {/* ios指纹脸部  */}
              {Platform.OS == "ios" &&
                faceId &&
                ((DeviceInfoIos && LoginTouchNum < 2) ||
                  (!DeviceInfoIos && LoginTouchNum == 0)) && (
                  <FingerprintPopupIOS
                    errCallback={(err) => {
                      ErrorMsg(
                        err,
                        (LoginTouchNum) => {
                          if (LoginTouchNum == 0) {
                            return;
                          }

                          window.LockLoginFun &&
                            window.LockLoginFun(DeviceInfoIos ? 2 : 3);

                          this.setState({ LoginTouchNum });
                        },
                        "FastLogin"
                      );
                      //脸部识别需要2次打开,错误是回调，所以小于2
                      if (DeviceInfoIos && err == "UserCancel") {
                        this.setState({ faceId: false });
                        setTimeout(() => {
                          this.setState({ faceId: true });
                        }, 500);
                      }
                    }}
                    successCallback={() => {
                      this.successActive();
                    }}
                  />
                )}
              {/* android指纹 */}
              {Platform.OS == "android" && LoginTouchNum < 3 && (
                <FingerprintPopupAndroid
                  loginType={true} //登陆时候第一次 不显示弹窗提示
                  errCallback={(LoginTouchNum) => {
                    // this.errorMessage(err);
                    this.setState({ LoginTouchNum });
                  }}
                  successCallback={() => {
                    this.successActive();
                  }}
                />
              )}
            </View>
          )
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  login: (loginDetails) => {
    login(dispatch, loginDetails);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FastLogin);

export class BGTOP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ImageBackground
        source={require("../../images/login/loginBg.jpg")}
        style={styles.bgView}
      >
        <View style={{ height: DeviceInfoIos ? 50 : 10 }}></View>
        <View style={styles.loginNav}>
          <View>
            <Touch
              onPress={() => {
                Actions.pop();
              }}
            >
              <Image
                resizeMode="stretch"
                source={require("../../images/icon-white.png")}
                style={{ width: 30, height: 30 }}
              />
            </Touch>
          </View>
          <View>
            <Touch
              onPress={() => {
                LiveChatOpenGlobe();
                PiwikEvent("LiveChat", "Launch", "LoginPage");
              }}
            >
              <Image
                resizeMode="stretch"
                source={require("../../images/cs.png")}
                style={{ width: 30, height: 30 }}
              />
            </Touch>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
