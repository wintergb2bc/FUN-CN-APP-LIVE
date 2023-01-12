import React from "react";
import {
  StyleSheet,
  WebView,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  TouchableHighlight,
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Carousel,
  WhiteSpace,
  WingBlank,
  Flex,
  Toast,
  InputItem,
  ActivityIndicator,
  List,
  Picker,
} from "antd-mobile-rn";
import { maskEmail, maskPhone, maskPhone4 } from "../../actions/Reg";

const { width, height } = Dimensions.get("window");
import VerificationCodeInput from "../VerificationCodeInput";
import LivechatDragHoliday from "../LivechatDragHoliday";
import PiwikAction from "../../lib/utils/piwik";
import { errCodeHandle } from "../Common/ErrorHandle";

let verificationType = {
  phone: {
    navTitle: "手机验证",
    title: "手机接收验证码",
    txt1: "为了确保您帐户的安全，请按照以下说明验证您的手机号码。",
    txt2: "手机号码",
    txt3: "如果您想更新手机号码，请联系我们的",
    txt4: "请输入您手机收到的验证码",
  },
  email: {
    navTitle: "邮箱验证",
    title: "邮箱接收验证码",
    txt1: "为了确保您帐户的安全，请按照以下说明验证您的电子邮件。",
    txt2: "电子邮箱",
    txt3: "如果您想更新电子邮箱，请联系我们的 ",
    txt4: "请输入您邮箱收到的验证码",
  },
};

// 个人资料--手机验证/邮箱验证
class SetLoginOtp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyErr: false,
      isSHowModal1: false,
      aaa: "",
      errCode: 0,
      exceed: false,
      codeAgainPhone: false,
      codeAgainEmail: false,
      verifyTimes: 5, //剩余次数
      getCodePhone: true,
      getCodeEmail: true,
      verificationCode: "",
      CountdownPhone: "300",
      CountdownEmail: "600",
      CountdownPhone_minutes: "5:00",
      CountdownEmail_minutes: "10:00",
      issubmitBtn: false,
      verificaType: this.props.verificaType,
      phone: "",
      email: "",
      phoneOrEmail: "",
      verification: true,
      memberCode: "",
      serviceAction: this.props.from === "reSetPwd" ? "Revalidate" : "OTP"
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      title: verificationType[this.props.verificaType].navTitle,
    });
    this.getVerifyTimes();
    this.setData();
    this.getDownTime();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    //存储倒计时
    if (this.state.codeAgainPhone) {
      let phoneTime = new Date().getTime() / 1000 + this.state.CountdownPhone;
      global.storage.save({
        key: "VerifyPhone",
        id: "VerifyPhone",
        data: phoneTime,
        expires: null,
      });
    }

    //存储倒计时
    if (this.state.codeAgainEmail) {
      let emailTime = new Date().getTime() / 1000 + this.state.CountdownEmail;
      global.storage.save({
        key: "VerifyEmail",
        id: "VerifyEmail",
        data: emailTime,
        expires: null,
      });
    }

    //保存次数
    global.storage.save({
      key: "verifyTimes",
      id: "verifyTimes",
      data: this.state.verifyTimes || "5",
      expires: null,
    });

    this.CountdownPhones && clearInterval(this.CountdownPhones);
    this.CountdownEmails && clearInterval(this.CountdownEmails);
  }

  getVerifyTimes() {
    //获取剩余次数
    let types = this.state.verificaType == "email" ? "Email" : "SMS";
    Toast.loading("加载中...", 100);
    fetchRequest(
      ApiPort.VerificationAttempt + `?ServiceAction=OTP&channelType=${types}&`,
      "GET"
    )
      .then((data) => {
        Toast.hide();
        const res = data.result;
        this.setState({ verifyTimes: res && res.attempt });
        if (res.attempt == 0) {
          this.setState({ verification: false });
          this.changeTitile("超过尝试次数");
        }
      })
      .catch(() => {
      });
  }

  getDownTime() {
    //获取剩余次数
    // global.storage.load({
    // 	key: 'verifyTimes',
    // 	id: 'verifyTimes'
    // }).then(verifyTimes => {
    // 	if (verifyTimes) {
    // 		this.setState({ verifyTimes })
    // 	}
    // })

    //重新进行倒计时
    if (this.state.verificaType == "phone") {
      global.storage
        .load({
          key: "VerifyPhone",
          id: "VerifyPhone",
        })
        .then((ret) => {
          let news = new Date().getTime() / 1000;

          if (ret - news > 0) {
            this.CountdownPhone(parseInt(ret - news));
          }
        });
    } else if (this.state.verificaType == "email") {
      global.storage
        .load({
          key: "VerifyEmail",
          id: "VerifyEmail",
        })
        .then((ret) => {
          let news = new Date().getTime() / 1000;

          if (ret - news > 0) {
            this.CountdownEmail(parseInt(ret - news));
          }
        });
    }
  }

  setData() {
    let phone = this.props.dataPhone;
    let email = this.props.dataEmail;
    if (this.state.verificaType == "phone" && phone.indexOf("-") > -1) {
      phone = phone.split("-")[1];
    }

    let memberCode = this.props.memberCode;
    this.setState({ phone, email, memberCode }, () => {
      this, this.setVerifyData();
    });
  }

  // 隐藏需验证的手机或邮箱
  setVerifyData() {
    let datas;
    const { verificaType, phone, email } = this.state;
    if (verificaType == "email") {
      datas = maskEmail(email);
    } else {
      datas = maskPhone4(phone);
    }
    this.setState({ phoneOrEmail: datas });
  }

  //发送验证码
  getCode() {
    if (this.state.verificaType == "phone") {
      this.sendSMSVerfication();
    }
    if (this.state.verificaType == "email") {
      this.sendEmailVerfication();
    }
  }

  //TODO: 发送短信验证码
  sendSMSVerfication() {
    const data = {
      serviceAction: "OTP",
      msisdn: "86-" + this.state.phone,
      siteId: siteId,
    };
    Toast.loading("发送中...", 100);
    fetchRequest(ApiPort.PhoneVerify, "POST", data)
      .then((res) => {
        Toast.hide();
        if (!res.isSuccess) {
          // 发送异常
          let resendCounter = res.result.resendCounter;
          if (resendCounter == 0) {
            this.setState({
              isSHowModal1: true,
            });
            return;
          } else {
            Toasts.fail(res.result.description, 2);
          }
        } else {
          Toasts.success("发送成功", 2);
        }
        this.CountdownPhone(300);
        this.clearCode();
      })
      .catch((err) => {
        // errCodeHandle(err, "短信服务异常，请稍后再试");
      });
  }

  //TODO: 获取邮箱验证码
  sendEmailVerfication() {
    const data = {
      serviceAction: "OTP",
      email: this.state.email,
      siteId: siteId,
    };
    Toast.loading("发送中...", 100);
    fetchRequest(ApiPort.EmailVerify, "POST", data)
      .then((res) => {
        Toast.hide();
        // 发送异常
        if (!res.isSuccess) {
          let resendCounter = res.result.resendCounter;
          if (resendCounter == 0) {
            this.setState({
              isSHowModal1: true,
            });
            return;
          } else {
            Toasts.fail(res.result.description, 2);
          }
        } else {
          Toasts.success("发送成功", 2);
        }
        this.CountdownEmail(600);
        this.clearCode();
      })
      .catch((err) => {
        Toasts.fail("邮件服务异常，请稍后再试", 2);
      });
  }

  //TODO: 校验短信验证码
  verifySMSTAC() {
    const data = {
      serviceAction: "OTP",
      msisdn: "86-" + this.state.phone,
      verificationCode: this.state.verificationCode,
    };
    Toast.loading("验证中...", 100);
    fetchRequest(ApiPort.PhoneTAC, "PATCH", data)
      .then((res) => {
        Toast.hide();
        if (res) {
          if (!res.result.isVerified) {
            let verifyTimes = res.result.remainingAttempt;
            this.setState({ verifyTimes, verifyErr: true });
            if (verifyTimes == 0 || res.result.errorCode == "REVA0001") {
              this.setState({ verification: false });
              this.props.updateState(this.state.verificaType);
              this.changeTitile("超过尝试次数");
              return;
            }
            const re = /[0-9]/g;
            // const temp = res.result.message && re.exec(res.result.message)[0] || 3;

            Toasts.fail(res.result.message, 2);
            this.clearCode();
          } else {
            Toasts.success("验证成功", 2);
            setTimeout(() => {
              window.VerifyLodin && window.VerifyLodin();
            }, 1000);
          }
        } else {
          Toasts.fail("短信验证服务异常，请稍后再试", 2);
        }
      })
      .catch((err) => {
        // errCodeHandle(err, "短信验证服务异常，请稍后再试");
      });
  }

  changeTitile = (title) => {
    this.props.navigation.setParams({
      title: title,
    });
  }

  // TODO:校验邮件验证码
  verifyEmailTAC() {
    const data = {
      serviceAction: "OTP",
      email: this.state.email,
      tac: this.state.verificationCode,
    };
    Toast.loading("验证中...", 100);
    fetchRequest(ApiPort.EmailTAC, "PATCH", data)
      .then((res) => {
        Toast.hide();
        if (res) {
          if (!res.result.isVerified) {
            let verifyTimes = res.result.remainingAttempt;
            this.setState({ verifyTimes, verifyErr: true });
            if (verifyTimes == 0 || res.result.errorCode == "REVA0001") {
              this.setState({ verification: false });
              this.props.updateState(this.state.verificaType);
              this.changeTitile("超过尝试次数");
              return;
            }
            const re = /[0-9]/g;
            // const temp = res.result.errorMessage && re.exec(res.result.errorMessage)[0] || 3;

            Toasts.fail(res.result.message, 2);
            this.clearCode();
          } else {
            Toasts.success("验证成功", 2);
            setTimeout(() => {
              window.VerifyLodin && window.VerifyLodin();
            }, 1000);
          }
        } else {
          Toasts.fail("邮件验证服务异常，请稍后再试", 2);
        }
      })
      .catch((err) => {
        // errCodeHandle(err, "邮件验证服务异常，请稍后再试");
      });
  }

  //手机验证码倒计时处理
  CountdownPhone(item) {
    this.setState({ codeAgainPhone: true, getCodePhone: false });
    let time = item;
    let m, s, ms;
    this.CountdownPhones = setInterval(() => {
      time -= 1;
      m = "0" + parseInt(time / 60).toString();
      s = time - m * 60;
      if (s < 10) {
        s = "0" + s.toString();
      }
      ms = m + ":" + s;
      this.setState({ CountdownPhone: time, CountdownPhone_minutes: ms });
      if (m == 0 && s == 0) {
        this.setState({ getCodePhone: true });
        clearInterval(this.CountdownPhones);
      }
    }, 1000);
  }

  //邮箱验证码倒计时处理
  CountdownEmail(item) {
    this.setState({ codeAgainEmail: true, getCodeEmail: false });
    let time = item;
    let m, s, ms;
    this.CountdownEmails = setInterval(() => {
      time -= 1;
      m = "0" + parseInt(time / 60).toString();
      s = time - m * 60;
      if (s < 10) {
        s = "0" + s.toString();
      }
      ms = m + ":" + s;
      this.setState({ CountdownEmail: time, CountdownEmail_minutes: ms });
      if (m == 0 && s == 0) {
        this.setState({ getCodeEmail: true });
        clearInterval(this.CountdownEmails);
      }
    }, 1000);
  }

  //提交验证
  submitBtn() {
    if (this.state.verificationCode.length != 6) {
      return;
    }
    // TODO: 提交验证码
    if (this.state.verificaType == "phone" && this.state.codeAgainPhone) {
      this.verifySMSTAC();
    }
    if (this.state.verificaType == "email" && this.state.codeAgainEmail) {
      this.verifyEmailTAC();
    }
  }

  // 清空验证码
  clearCode() {
    let errCode = this.state.errCode;
    errCode += 1;
    this.setState({
      issubmitBtn: false,
      verificationCode: "",
      errCode,
    });
  }

  checked(code) {
    if (code.length == 6) {
      this.setState({
        issubmitBtn: true,
        verificationCode: code,
        verifyErr: false,
      });
    } else {
      this.setState({ issubmitBtn: false });
    }
  }

  changType() {
    this.setState(
      {
        verificationCode: "",
        verificaType: this.state.verificaType == "email" ? "phone" : "email",
      },
      () => {
        this.setVerifyData();
        this.props.navigation.setParams({
          title: verificationType[this.state.verificaType].title,
        });
      }
    );
  }

  render() {
    const {
      isSHowModal1,
      errCode,
      // errorMessage,
      exceed,
      verifyErr,
      codeAgainPhone,
      codeAgainEmail,
      getCodePhone,
      getCodeEmail,
      verifyTimes,
      CountdownPhone,
      CountdownEmail,
      issubmitBtn,
      verificaType,
      phoneOrEmail,
      dataType,
      verification,
      CountdownPhone_minutes,
      CountdownEmail_minutes,
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Modal animationType="fade" transparent={true} visible={isSHowModal1}>
          <View
            style={{
              width,
              height,
              flex: 1,
              backgroundColor: "rgba(0 ,0 ,0, .6)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: width * 0.9,
                borderRadius: 8,
                overflow: "hidden",
                backgroundColor: "#fff",
              }}
            >
              <View
                style={{
                  padding: 15,
                  paddingVertical: 25,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={require("./../../images/error1.png")}
                    style={{
                      width: 70,
                      height: 70,
                    }}
                    resizeMode="stretch"
                  ></Image>

                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    您已经超过5次尝试
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      marginBottom: 10,
                      color: "#000",
                      marginTop: 15,
                      paddingHorizontal: 20,
                    }}
                  >
                    您已超过 5 次尝试, 请 24
                    小时之后再试。或联系我们的在线客服进行验证
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}
                >
                  <Touch
                    onPress={() => {
                      this.setState({
                        verification: false,
                        isSHowModal1: false,
                      });
                      this.changeTitile("超过尝试次数");
                    }}
                    style={{
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#00A6FF",
                      width: 130,
                    }}
                  >
                    <Text style={{ color: "#00A6FF", fontSize: 15 }}>关闭</Text>
                  </Touch>
                  <Touch
                    onPress={() => {
                      this.setState({
                        verification: false,
                        isSHowModal1: false,
                      });
                      this.changeTitile("超过尝试次数");
                      LiveChatOpenGlobe();
                    }}
                    style={{
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#00A6FF",
                      width: 130,
                      backgroundColor: "#00A6FF",
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 15 }}>
                      联系客服
                    </Text>
                  </Touch>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {verification && (
          <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
            <View style={{ padding: 10, marginBottom: 20 }}>
              <WhiteSpace size="lg"/>
              <View>
                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 10,
                    borderRadius: 10,
                    paddingBottom: 20,
                  }}
                >
                  <View
                    style={{
                      borderBottomColor: "#c4c4c4",
                      borderBottomWidth: 1,
                    }}
                  >
                    <Text style={{ color: "#171717", fontSize: 18 }}>
                      {verificationType[verificaType].title}
                    </Text>
                    <Text
                      style={{
                        color: "#999",
                        paddingTop: 12,
                        paddingBottom: 25,
                      }}
                    >
                      {verificationType[verificaType].txt1}
                    </Text>
                  </View>
                  <Text
                    style={{
                      paddingTop: 20,
                      paddingBottom: 8,
                      color: "#2D2D2D",
                    }}
                  >
                    {verificationType[verificaType].txt2}
                  </Text>
                  {verificaType == "email" && (
                    <View
                      style={{
                        borderRadius: 10,
                        backgroundColor: "#efeff4",
                        paddingLeft: 15,
                      }}
                    >
                      <Text style={{ lineHeight: 45, color: "#000" }}>
                        {phoneOrEmail}
                      </Text>
                    </View>
                  )}
                  {verificaType == "phone" && (
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 10,
                          backgroundColor: "#efeff4",
                          width: (width - 60) / 5,
                        }}
                      >
                        <Text
                          style={{
                            lineHeight: 45,
                            textAlign: "center",
                            color: "#000",
                          }}
                        >
                          +86
                        </Text>
                      </View>
                      <View
                        style={{
                          borderRadius: 10,
                          backgroundColor: "#efeff4",
                          paddingLeft: 15,
                          width: (width - 60) / 1.2,
                        }}
                      >
                        <Text style={{ lineHeight: 45, color: "#000" }}>
                          {phoneOrEmail}
                        </Text>
                      </View>
                    </View>
                  )}
                  <View
                    style={{
                      borderRadius: 10,
                      backgroundColor: "#F7F7FC",
                      marginTop: 15,
                      paddingLeft: 15,
                    }}
                  >
                    <Text
                      style={{ color: "#999999", fontSize: 12, lineHeight: 45 }}
                    >
                      {verificationType[verificaType].txt3}
                      <Text
                        onPress={() => {
                          LiveChatOpenGlobe();
                        }}
                        style={{ color: "#00a6ff", fontSize: 12 }}
                      >
                        在线客服
                      </Text>
                    </Text>
                  </View>

                  {verificaType == "email" && (
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {getCodeEmail && (
                        <Touch
                          onPress={() => {
                            this.getCode();
                            codeAgainEmail
                              ? PiwikAction.SendPiwik("ResendCodeEmail")
                              : PiwikAction.SendPiwik("VerificationSendEmail");
                          }}
                          style={styles.getCodeBtn}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 45,
                            }}
                          >
                            {codeAgainEmail ? "重新发送验证码" : "发送"}
                          </Text>
                        </Touch>
                      )}
                      {!getCodeEmail && (
                        <View style={styles.getCodeBtnAgain}>
                          <Text
                            style={{
                              color: "#999",
                              textAlign: "center",
                              lineHeight: 45,
                            }}
                          >
                            重新发送验证码 ({CountdownEmail_minutes})
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                  {verificaType == "phone" && (
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {getCodePhone && (
                        <Touch
                          onPress={() => {
                            this.getCode();
                            codeAgainPhone
                              ? PiwikAction.SendPiwik("ResendCodePhone")
                              : PiwikAction.SendPiwik("VerificationSendPhone");
                          }}
                          style={styles.getCodeBtn}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 45,
                            }}
                          >
                            {codeAgainPhone ? "重新发送验证码" : "发送"}
                          </Text>
                        </Touch>
                      )}
                      {!getCodePhone && (
                        <View style={styles.getCodeBtnAgain}>
                          <Text
                            style={{
                              color: "#999",
                              textAlign: "center",
                              lineHeight: 45,
                            }}
                          >
                            重新发送验证码 ({CountdownPhone_minutes})
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                {((verificaType == "phone" && codeAgainPhone) ||
                  (verificaType == "email" && codeAgainEmail)) && (
                  <View
                    style={{ padding: 10, borderRadius: 10, paddingBottom: 20 }}
                  >
                    <View
                      style={{
                        padding: 15,
                        backgroundColor: "#EFEFF4",
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "#000",
                          fontSize: 12,
                          textAlign: "center",
                        }}
                      >
                        {verificationType[verificaType].txt4}
                      </Text>
                      <Text
                        style={{
                          color: "#666",
                          fontSize: 12,
                          textAlign: "center",
                          paddingBottom: 15,
                          lineHeight: 20,
                        }}
                      >
                        {verificaType == "email"
                          ? "请注意：获取新的验证码前请查看您的垃圾箱，若您在10分钟内尚未收到验证码，请点击”重新发送验证码”"
                          : "注意：如果5分钟后仍未收到验证码，请点击“重新发送验证码”以获取新的验证码。"}
                      </Text>
                      <VerificationCodeInput
                        key={errCode}
                        inputSize={6} //默认value是 6
                        TextInputChange={(value) => {
                          this.checked(value);
                        }}
                      />
                      {verifyErr && (
                        <View
                          style={{
                            backgroundColor: "#FEE5E5",
                            borderRadius: 5,
                            marginTop: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: "#EB2121",
                              fontSize: 12,
                              lineHeight: 35,
                              paddingLeft: 10,
                            }}
                          >
                            验证码有误，请检查并确保您输入了正确的验证码.
                          </Text>
                        </View>
                      )}
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 12,
                          paddingTop: 20,
                          color: "#999",
                        }}
                      >
                        您还有（
                        <Text style={{ color: "#00a6ff" }}>{verifyTimes}</Text>
                        ）次尝试机会
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >
                        {verificaType == "email" && (
                          <Touch
                            style={
                              codeAgainEmail && issubmitBtn
                                ? styles.addBtn
                                : styles.addBtnAgain
                            }
                            onPress={() => {
                              this.submitBtn();
                              PiwikAction.SendPiwik("VerificationSubmitEmail");
                            }}
                          >
                            <Text
                              style={{
                                color: codeAgainEmail && issubmitBtn
                                  ? "#fff"
                                  : "#999",
                                textAlign: "center",
                                lineHeight: 44,
                                fontWeight: 'bold'
                              }}
                            >
                              立即验证
                            </Text>
                          </Touch>
                        )}
                        {verificaType == "phone" && (
                          <Touch
                            style={
                              codeAgainPhone && issubmitBtn
                                ? styles.addBtn
                                : styles.addBtnAgain
                            }
                            onPress={() => {
                              this.submitBtn();
                              PiwikAction.SendPiwik("VerificationSubmitPhone");
                            }}
                          >
                            <Text
                              style={{
                                color: codeAgainPhone && issubmitBtn
                                  ? "#fff"
                                  : "#999",
                                textAlign: "center",
                                lineHeight: 44,
                                fontWeight: 'bold'
                              }}
                            >
                              立即验证
                            </Text>
                          </Touch>
                        )}
                      </View>
                    </View>
                    {this.props.emailShow && this.props.smsShow && (
                      <Touch
                        onPress={() => {
                          this.changType();
                        }}
                      >
                        <Text
                          style={{
                            color: "#00a6ff",
                            textAlign: "center",
                            lineHeight: 45,
                            paddingTop: 20,
                            fontSize: 16,
                          }}
                        >
                          更换验证方式
                        </Text>
                      </Touch>
                    )}
                  </View>
                )}
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}
        {
          //5次错误
          verification == false && (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <View
                style={{
                  paddingHorizontal: 32,
                  width: width,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  marginTop: -44
                }}
              >
                <Image
                  resizeMode="stretch"
                  source={require("../../images/warn.png")}
                  style={{ width: 60, height: 60 }}
                />
                <Text
                  style={{
                    fontSize: 20,
                    color: "#222",
                    paddingTop: 35,
                    paddingBottom: 20,
                    fontWeight: "bold",
                  }}
                >
                  您已经超过5次尝试
                </Text>
                <Text style={{ lineHeight: 22, color: "#999", textAlign: "center" }}>
                  您已超过 5 次尝试, 请 24
                  小时之后再试。或联系我们的<Text style={{ color: '#006AFF' }}
                                     onPress={() => LiveChatOpenGlobe()}>
                  在线客服
                </Text>进行验证
                </Text>
                {/* <Touch style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width - 40, marginTop: 30 }} onPress={() => { LiveChatOpenGlobe() }}>
								<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>联系客服</Text>
							</Touch> */}
              </View>
            </View>
          )
        }
        {/*客服懸浮球*/}
        {/* <LivechatDragHoliday /> */}
      </View>
    );
  }
}

export default SetLoginOtp;

const styles = StyleSheet.create({
  headerTop: {
    top: 0,
    backgroundColor: "#034631",
    width: width,
    height: Platform.OS === "ios" ? 85 : 45,
    zIndex: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: 10,
  },
  steps: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 25,
    paddingRight: 25,
  },
  stepListActive: {
    backgroundColor: "#00623b",
    width: 45,
    height: 45,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  stepList: {
    backgroundColor: "transparent",
    borderColor: "#a1a1a1",
    borderWidth: 2,
    width: 45,
    height: 45,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  accountNum: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    height: 50,
    backgroundColor: "#e4e4e4",
  },
  accountTxt: {
    borderRightWidth: 1,
    borderColor: "#989898",
    padding: 10,
  },
  getCodeBtn: {
    backgroundColor: "#00a6ff",
    borderRadius: 10,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    width: width - 40,
  },
  getCodeBtnAgain: {
    backgroundColor: "#efeff4",
    borderRadius: 10,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    width: width - 40,
  },
  addBtn: {
    backgroundColor: "#0ccc3c",
    borderRadius: 8,
    width: width - 100,
    marginBottom: 15,
  },
  addBtnAgain: {
    backgroundColor: "#d4d7dd",
    borderRadius: 8,
    width: width - 100,
    marginBottom: 15,
  },
  codeNmu: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codeNmuList: {
    height: 50,
    width: width / 7.8,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ddd",
    textAlign: "center",
    fontSize: 20,
  },
  submitBtn: {
    borderRadius: 5,
    marginTop: 15,
  },
  topNav: {
    width: width,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  btnTouch: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
