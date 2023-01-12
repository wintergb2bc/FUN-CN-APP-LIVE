import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Platform,
} from "react-native";
import { Toast } from "antd-mobile-rn";
import PiwikAction from "../../lib/utils/piwik";

import Touch from "react-native-touch-once";

import { emailReg, nameReg } from "../../actions/Reg";
import { errCodeHandle } from "../Common/ErrorHandle";
import { Actions } from "react-native-router-flux";
const { width } = Dimensions.get("window");

class ForgetName extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      okBtn: false,
      checkActive: "password",
      email: "",
      emailST: "",
      userName: "",
      userNameST: "",
      checkNamePassword: false,
      isSuccessName: false,
      touchActive: false,
    };
  }

  componentWillMount() {}

  userName(value) {
    let userNameST = "";
    if (value == "") {
      userNameST = "请输入用户名";
    } else if (nameReg.test(value) != true) {
      userNameST = "用户名格式错误";
    }
    this.setState({ isSuccessName: false, touchActive: false, userName: value, userNameST }, () => {
      this.validation();
    });
  }

  email(value) {
    let emailST = "";
    if (value == "") {
      emailST = "请输入邮箱地址";
    } else if (emailReg.test(value) != true) {
      emailST = "错误电邮格式";
    }
    this.setState({ isSuccessName: false, touchActive: false, email: value, emailST }, () => {
      this.validation();
    });
  }

  validation() {
    let okBtn = true;
    let st = this.state;
    if (
      st.checkActive == "password" &&
      (!st.email || !st.userName || st.emailST || st.userNameST)
    ) {
      okBtn = false;
    }

    if (st.checkActive == "name" && (!st.email || st.emailST)) {
      okBtn = false;
    }

    this.setState({ okBtn });
  }

  //忘记用户名
  fogetName() {
    console.log('forget')
    if (!this.state.okBtn) {
      return;
    }
    this.setState({ isSuccessName: false, touchActive: false },()=>{
      Toast.loading("提交中,请稍候...", 20);
      fetchRequest(
        ApiPort.ForgetUsernameByEmail + "email=" + this.state.email + "&",
        "POST"
      )
        .then((data) => {
          Toast.hide();
          this.setState({ isSuccessName: data.isSuccess, touchActive: true });
        })
        .catch((e) => {
          Toast.hide();
          if(e.errors[0].errorCode === "VAL08026") {
           console.log('1')
            this.setState({
              isSuccessName: false,
              touchActive: true
            });
          } else {
            console.log('2')
            errCodeHandle(e);
          }
        });
    });
  }

  //忘记密码
  fogetpassword() {
    if (!this.state.okBtn) {
      return;
    }
    Toast.loading("提交中,请稍候...", 20);
    let list = {
      username: this.state.userName,
      email: this.state.email,
    };
    fetchRequest(ApiPort.ForgetPasswordByEmail, "POST", list)
      .then((data) => {
        console.log("123");
        Toast.hide();
        let isSuccessPassword = false;
        if (data.isSuccess) {
          isSuccessPassword = true;
          this.setState({ isSuccessPassword, touchActive: true });
        }
      })
      .catch((error) => {
        Toast.hide();
        errCodeHandle(error);
      });
  }
  handleInput(key, value) {
    this.setState({ [key]: value }, () => {
      this.verifyLoginDetail(key);
    });
  }
  render() {
    const {
      checkActive,
      email,
      emailST,
      userName,
      userNameST,
      okBtn,
      touchActive,
      isSuccessPassword,
      isSuccessName,
    } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.topNav}>
          <Touch
            onPress={() => {
              Actions.pop();
            }}
            style={{ position: "absolute", left: 15 }}
          >
            <Image
              resizeMode="stretch"
              source={require("../../images/icon-white.png")}
              style={{ width: 30, height: 30 }}
            />
          </Touch>
          <View style={styles.btnType}>
            <Touch
              style={[
                styles.btnList,
                {
                  backgroundColor:
                    checkActive == "password" ? "#fff" : "transparent",
                },
              ]}
              onPress={() => {
                this.setState({ checkActive: "password", touchActive: false });
              }}
            >
              <Text
                style={[
                  styles.btnTxt,
                  { color: checkActive == "password" ? "#00a6ff" : "#BCBEC3" },
                ]}
              >
                忘记密码
              </Text>
            </Touch>
            <Touch
              style={[
                styles.btnList,
                {
                  backgroundColor:
                    checkActive == "name" ? "#fff" : "transparent",
                },
              ]}
              onPress={() => {
                this.setState({ checkActive: "name", touchActive: false });
              }}
            >
              <Text
                style={[
                  styles.btnTxt,
                  { color: checkActive == "name" ? "#00a6ff" : "#BCBEC3" },
                ]}
              >
                忘记用户名
              </Text>
            </Touch>
          </View>
        </View>
        {checkActive == "password" && (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 30,
            }}
          >
            {touchActive && (
              <View
                style={[
                  styles.errMsg,
                  {
                    backgroundColor: isSuccessPassword ? "#e4f7ed" : "#FEE5E5",
                  },
                ]}
              >
                <Text
                  style={{
                    color: isSuccessPassword ? "#0ccc3c" : "#eb2121",
                    fontSize: 11,
                    lineHeight: 18,
                    padding: 8,
                  }}
                >
                  {isSuccessPassword
                    ? "已将更新密码链接以邮件方式发送, 请至您的注册邮箱查收"
                    : "请提供有效信息以便处理您的请求"}
                </Text>
              </View>
            )}
            <View style={[styles.inputView, {borderColor: emailST != "" ? "#EB2121" : "#E6E6EB" , borderWidth: 1}]}>
              <TextInput
                style={[styles.input]}
                underlineColorAndroid="transparent"
                value={email}
                placeholder="电子邮箱"
                placeholderTextColor="#BCBEC3"
                maxLength={40}
                textContentType="emailAddress"
                onChangeText={(value) => this.email(value)}
              />
            </View>
            {emailST != "" && (
              <View style={styles.errMsg}>
                <Text
                  style={{
                    color: "#eb2121",
                    fontSize: 11,
                    lineHeight: 18,
                    padding: 8,
                  }}
                >
                  {emailST}
                </Text>
              </View>
            )}
            <View style={[styles.inputView, {borderColor: userNameST != "" ? "#EB2121" : "#E6E6EB" , borderWidth: 1}]}>
              <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                value={userName}
                placeholder="用户名"
                placeholderTextColor="#BCBEC3"
                maxLength={14}
                textContentType="username"
                onChangeText={(value) => this.userName(value)}
              />
            </View>
            {userNameST != "" && (
              <View style={styles.errMsg}>
                <Text
                  style={{
                    color: "#eb2121",
                    fontSize: 11,
                    lineHeight: 18,
                    padding: 8,
                  }}
                >
                  {userNameST}
                </Text>
              </View>
            )}
            <Touch
              onPress={() => {
                this.fogetpassword();
                PiwikAction.SendPiwik("ForgetPWD");
              }}
              style={[
                styles.okBtn,
                { backgroundColor: okBtn ? "#00A6FF" : "#EFEFF4" },
              ]}
            >
              <Text
                style={{
                  color: okBtn ? "#fff" : "#BCBEC3",
                  textAlign: "center",
                  lineHeight: 44,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                提交
              </Text>
            </Touch>
          </View>
        )}

        {checkActive == "name" && (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 30,
            }}
          >
            {touchActive && (
              <View
                style={[
                  styles.errMsg,
                  { backgroundColor: isSuccessName ? "#e4f7ed" : "#FEE5E5" },
                ]}
              >
                <Text
                  style={{
                    color: isSuccessName ? "#0ccc3c" : "#eb2121",
                    fontSize: 11,
                    lineHeight: 18,
                    padding: 8,
                  }}
                >
                  {isSuccessName
                    ? "用户名已成功发送至您的邮箱"
                    : "请提供有效信息以便处理您的请求"}
                </Text>
              </View>
            )}
            <View style={[styles.inputView, {borderColor: emailST != "" ? "#EB2121" : "#E6E6EB" , borderWidth: 1}]}>
              <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                value={email}
                placeholder="电子邮箱"
                placeholderTextColor="#BCBEC3"
                maxLength={40}
                textContentType="emailAddress"
                onChangeText={(value) => this.email(value)}
              />
            </View>
            {emailST != "" && (
              <View style={styles.errMsg}>
                <Text
                  style={{
                    color: "#eb2121",
                    fontSize: 11,
                    lineHeight: 18,
                    padding: 8,
                  }}
                >
                  {emailST}
                </Text>
              </View>
            )}
            <Touch
              onPress={() => {
                this.fogetName();
                PiwikAction.SendPiwik("ForgetName");
              }}
              style={[
                styles.okBtn,
                { backgroundColor: okBtn ? "#00A6FF" : "#EFEFF4" },
              ]}
            >
              <Text
                style={{
                  color: okBtn ? "#fff" : "#BCBEC3",
                  textAlign: "center",
                  lineHeight: 44,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                提交
              </Text>
            </Touch>
          </View>
        )}
      </View>
    );
  }
}

export default ForgetName;

const styles = StyleSheet.create({
  topNav: {
    width: width,
    height: 50,
    backgroundColor: "#00a6ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btnType: {
    backgroundColor: "#7676801F",
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btnList: {
    width: 110,
    backgroundColor: "#00A6FF",
    borderRadius: 50,
  },
  btnTxt: {
    textAlign: "center",
    lineHeight: 32,
  },
  inputView: {
    borderRadius: 8,
    borderColor: "#E6E6EB",
    borderWidth: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    width: width - 40,
    marginBottom: 15,
  },
  input: {
    width: width - 50,
    height: 40,
    color: "#000000",
    textAlign: "left",
    paddingLeft: 15,
    fontSize: 14,
  },
  okBtn: {
    width: width - 40,
    borderRadius: 8,
    marginBottom: 15,
  },
  errMsg: {
    width: width - 40,
    borderRadius: 5,
    backgroundColor: "#FEE5E5",
    marginBottom: 15,
    paddingLeft: 15,
  },
});
