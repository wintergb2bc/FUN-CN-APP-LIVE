/**
 * 人脸样本采集封装（百度AI-SDK）
 */
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
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";

import Touch from "react-native-touch-once";
import { passwordReg } from "../../actions/Reg";
import styles from "./style";
import { Actions } from "react-native-router-flux";

const FaceCheckHelper = NativeModules.PushFaceViewControllerModule;

const { width, height } = Dimensions.get("window");
class SetLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginType: 0, //0空，1指纹，2九宫格
      username: this.props.username,
    };
  }
  componentWillMount() {
    this.getFastLogin();
  }
  componentWillUnmount() {}

  getFastLogin() {
    //ios获取快速登录方式
    let fastLoginKey = "fastLogin" + this.state.username.toLowerCase();
    let sfastLoginId = "fastLogin" + this.state.username.toLowerCase();
    global.storage
      .load({
        key: fastLoginKey,
        id: sfastLoginId,
      })
      .then((ret) => {
        let loginType = 1;
        if (ret == "LoginPattern") {
          loginType = 2;
        }
        this.setState({ loginType });
      })
      .catch((err) => {});
  }

  setLogin(key) {
    if (this.state.loginType == key) {
      return;
    }

    const username = this.state.username.toLowerCase();
    if (key == 0) {
      this.setState({ loginType: 0 });
      //清除
      let fastLogin = "fastLogin" + username;
      let sfastLogin = "fastLogin" + username;
      global.storage.remove({
        key: fastLogin,
        id: sfastLogin,
      });
      return;
    }

    if (key == 1) {
      Actions.LoginTouch({
        username,
        fastChange: true,
        changeBack: () => {
          this.setState({ loginType: 1 });
        },
      });
    }

    if (key == 2 || key == 3) {
      Actions.LoginPattern({
        username,
        fastChange: true,
        forgotPass: key == 3,
        changeBack: () => {
          this.setState({ loginType: 2 });
        },
      });
    }
  }

  render() {
    const { loginType } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#EFEFF4", padding: 20 }}>
        <View style={styles.setLogin}>
          <Touch
            style={styles.setTouch}
            onPress={() => {
              this.setLogin(1);
            }}
          >
            <Text style={{ color: "#666" }}>使用指纹辨识登入</Text>
            <View
              style={[loginType == 1 ? styles.loginTouch : styles.setDefual]}
            />
          </Touch>
          <Touch
            style={styles.setTouch}
            onPress={() => {
              this.setLogin(2);
            }}
          >
            <Text style={{ color: "#666" }}>使用图形密码</Text>
            <View
              style={[loginType == 2 ? styles.loginTouch : styles.setDefual]}
            />
          </Touch>
          {loginType == 2 && (
            <Touch
              style={[styles.setTouch, { paddingLeft: 30, paddingRight: 10 }]}
              onPress={() => {
                this.setLogin(3);
              }}
            >
              <Text style={{ color: "#999", fontSize: 13 }}>变更图形密码</Text>
              <Image
                resizeMode="stretch"
                source={require("../../images/iconRight.png")}
                style={{ width: 28, height: 28 }}
              />
            </Touch>
          )}
          <Touch
            style={styles.setTouch}
            onPress={() => {
              this.setLogin(0);
            }}
          >
            <Text style={{ color: "#666" }}>关闭所有快速登入功能</Text>
            <View
              style={[loginType == 0 ? styles.loginTouch : styles.setDefual]}
            />
          </Touch>
        </View>
      </View>
    );
  }
}

export default SetLogin;
