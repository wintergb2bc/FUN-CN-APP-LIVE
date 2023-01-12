import React from "react";
import { Dimensions, Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { DatePicker, List, Picker, Toast } from "antd-mobile-rn";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";
import VerificationCodeInput from "./VerificationCodeInput";
import Touch from "react-native-touch-once";
import { maskEmail, maskPhone4 } from "./../actions/Reg";
import ListItems from "antd-mobile-rn/lib/list/style/index.native";
import moment from "moment";
import { Toasts } from "./Toast";
import PiwikAction from "../lib/utils/piwik";

const DatePickerLocale = {
  DatePickerLocale: {
    year: "年",
    month: "月",
    day: "日",
    hour: "",
    minute: "",
  },
  okText: "确定",
  dismissText: "取消",
};
const locatData = require("./locatData.json");
locatData.forEach((item) => {
  item.value = item.label;
  item.children.forEach((val) => {
    val.value = val.label;
    val.children.forEach((v) => {
      v.value = v.label;
    });
  });
});
const { width, height } = Dimensions.get("window");
const newStyle = {};
for (const key in ListItems) {
  if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
    newStyle[key] = { ...StyleSheet.flatten(ListItems[key]) };
    if (key == "Item") {
      newStyle[key].paddingLeft = 0;
      newStyle[key].paddingRight = 0;
      newStyle[key].height = 40;
      newStyle[key].width = width - 20;
      newStyle[key].overflow = "hidden";
    }
    newStyle[key].color = "transparent";
    newStyle[key].fontSize = -999;
    newStyle[key].backgroundColor = "transparent";
    newStyle[key].borderRadius = 4;
  }
}
const ListItemstyles = newStyle;
let verificationType = {
  phone: {
    navTitle: "手机验证",
    title: "验证手机号码",
    txt1: '点击"发送"，您的手机将会收到验证码，请输入您收到的验证码以完成本次验证.',
    txt2: "手机号码",
    txt3: "如果您想更新手机号码，请联系我们的",
    txt4: "请输入您手机收到的验证码",
  },
  email: {
    navTitle: "邮箱验证",
    title: "验证电子邮箱",
    txt1: '点击"发送"，您的电子邮箱将会收到验证码，请输入您收到的验证码以完成本次验证.',
    txt2: "电子邮箱",
    txt3: "如果您想更新电子邮箱，请联系我们的 ",
    txt4: "请输入您邮箱收到的验证码",
  },
};

class BettingHistory extends React.Component {
  constructor(props) {
    super(props);
    let phoneEmailCodeLength = 6;
    this.state = {
      memberInfo: this.props.memberInfo,
      Withdrawalverification: [0, 1, 2, 3],
      WithdrawalverificationIndex: this.props.WithdrawalverificationIndex,
      IdentityCard: "",
      province: "",
      isprovince: false,
      verifyErr: false,
      address: "",
      birthdayDate: "",
      isbirthdayDate: false,
      phone: "",
      email: "",
      phoneEmailStep: 0,
      phoneEmailCodeArr: Array.from(
        { length: phoneEmailCodeLength },
        (v) => ""
      ),
      phoneEmailCodeLength,
      countdownNum: 300,
      countdownNumMMSS: "",
      isShowCountdownNumMMSS: false,
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
      verificaType: "",
      phone: "",
      email: "",
      // phone: "",
      verification: true,
      memberCode: "",
      isSHowModal1: false,
      isAddress: false,
      errmessage: "",
    };
  }

  componentDidMount() {
    if (!this.props.isRemainingAttempt) {
      this.getUserInfor()
      this.getUser()
    }
  }

  //获取用户信息
  getUser(key) {
    Toast.loading("加载中,请稍候...", 300);
    fetchRequest(window.ApiPort.Member, "GET")
      .then((data) => {
        Toast.hide();
        if (data && data.result) {
          let WithdrawalverificationIndex = "";
          let memberInfo = data && data.result.memberInfo;
          let memberNewInfo = data && data.result.memberNewInfo;
          let IdentityCard = memberNewInfo.identityCard;

          let DOB = memberInfo.dob;
          let FirstName = memberInfo.firstName;

          let Address = memberInfo.address.address;
          let City = memberInfo.address.city;
          const phoneData = memberInfo.contacts.find(
            (v) => v.contactType.toLocaleLowerCase() === "phone"
          );
          let phoneStatus = phoneData
            ? phoneData.status.toLocaleLowerCase() === "unverified"
              ? true
              : false
            : true;
          const phone = phoneData ? phoneData.contact : "";
          const emailData = memberInfo.contacts.find(
            (v) => v.contactType.toLocaleLowerCase() === "email"
          );
          let emailStatus = emailData
            ? emailData.status.toLocaleLowerCase() === "unverified"
              ? true
              : false
            : true;
          if (memberInfo.DOB) {
            this.setState({
              birthdayDate: memberInfo.dob.toLocaleUpperCase().split("T")[0],
              isbirthdayDate: true,
            });
          }
          this.setState({
            province: memberInfo.address.city,
            isprovince: Boolean(memberInfo.address.city),
            address: memberInfo.address.address,
            isAddress: Boolean(memberInfo.address.address),
          });

          if (!IdentityCard) {
            this.setState({
              WithdrawalverificationIndex: 0,
            });
            return;
          }
          if (!(DOB && Address && City)) {
            this.setState({
              WithdrawalverificationIndex: 1,
            });
            return;
          }
          if (phoneStatus) {
            this.setState(
              {
                WithdrawalverificationIndex: 2,
                verificaType: "phone",
              },
              () => {
                this.getVerifyTimes();
              }
            );
            return;
          }
          if (emailStatus) {
            this.setState(
              {
                WithdrawalverificationIndex: 3,
                verificaType: "email",
              },
              () => {
                this.getVerifyTimes();
              }
            );
            return;
          }

          Actions.pop();
        }
      })
      .catch((error) => {
        Toast.hide();
      });
  }

  getUserInfor() {
    const { memberInfo } = this.state;
    const phoneData = memberInfo.contacts.find(
      (v) => v.contactType.toLocaleLowerCase() === "phone"
    );
    let phoneStatus = phoneData
      ? phoneData.status.toLocaleLowerCase() === "unverified"
        ? true
        : false
      : true;
    const phone = phoneData ? phoneData.contact : "";
    const emailData = memberInfo.contacts.find(
      (v) => v.contactType.toLocaleLowerCase() === "email"
    );
    let emailStatus = emailData
      ? emailData.status.toLocaleLowerCase() === "unverified"
        ? true
        : false
      : true;
    const email = emailData ? emailData.contact : "";
    this.setState({
      phone,
      email,
    });
    // debugger;
    if (this.state.WithdrawalverificationIndex == 2) {
      this.setState({
        verificaType: "phone",
      });
    }

    if (this.state.WithdrawalverificationIndex == 3) {
      this.setState({
        verificaType: "email",
      });
    }
  }

  changeRebateDatePicker(day) {
    this.setState({
      birthdayDate: moment(day).format("YYYY-MM-DD"),
    });
  }

  getVerifyTimes() {
    //获取剩余次数
    let types = this.state.verificaType == "email" ? "Email" : "SMS";
    Toast.loading("加载中...", 100);
    fetchRequest(
      ApiPort.VerificationAttempt +
      `?ServiceAction=ContactVerification&channelType=${types}&`,
      "GET"
    )
      .then((data) => {
        const res = data.result;
        Toast.hide();
        this.setState({ verifyTimes: res && res.attempt });
        if (res.attempt == 0) {
          this.setState({ verification: false });
          this.changeTitile("超过尝试次数");
        }
      })
      .catch(() => {
      });
  }

  changeTitile = (title) => {
    this.props.navigation.setParams({
      title: title,
    });
  }

  getDownTime() {
    //获取剩余次数
    // global.storage.load({
    //     key: 'verifyTimes',
    //     id: 'verifyTimes'
    // }).then(verifyTimes => {
    //     if (verifyTimes) {
    //         this.setState({ verifyTimes })
    //     }
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
    this.setState({ phone: datas });
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
    this.setState({
      errmessage: "",
    });
    const data = {
      siteId: siteId,
      msisdn: this.state.phone,
      //   isRegistration: false,
      //   isOneTimeService: false,
      username: userNameDB,
      //   CurrencyCode: "CNY",
      //   isMandatoryStep: false,
      serviceAction: "WithdrawalVerification",
    };
    Toast.loading("发送中...", 100);
    fetchRequest(window.ApiPort.PhoneVerify, "POST", data)
      .then((res) => {
        Toast.hide();
        if (res.isSuccess) {
          Toasts.success("发送成功", 2);
        } else {
          let resendCounter = res.result.resendCounter;
          if (resendCounter == 0) {
            this.setState({
              isSHowModal1: true,
            });
            return;
          } else {
            Toasts.fail(res.result.description, 2);
          }
        }
        this.CountdownPhone(300);
        this.clearCode();
      })
      .catch((err) => {
        // errCodeHandle(err ,"短信服务异常，请稍后再试");
      });
  }

  //TODO: 获取邮箱验证码
  sendEmailVerfication() {
    this.setState({
      errmessage: "",
    });
    const data = {
      siteId: siteId,
      // ipAddress: "",
      username: this.state.memberInfo.MemberCode,
      email: this.state.email,
      // domainUrl: SBTDomain,
      serviceAction: "WithdrawalVerification",
    };
    Toast.loading("发送中...", 100);
    fetchRequest(window.ApiPort.EmailVerify, "POST", data)
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
    this.setState({
      errmessage: "",
    });
    const data = {
      serviceAction: "WithdrawalVerification",
      // username: userNameDB,
      verificationCode: this.state.verificationCode,
      msisdn: "86-" + this.state.phone,
      // siteId: siteId,
      //   IsMandatoryStep: false,
      //   IsRegistration: true,
    };
    Toast.loading("验证中...", 100);
    fetchRequest(window.ApiPort.PhoneTAC, "PATCH", data)
      .then((res) => {
        Toast.hide();
        if (res) {
          if (!res.result.isVerified) {
            let verifyTimes = res.result.remainingAttempt;
            this.setState({ verifyTimes, verifyErr: true });
            if (verifyTimes == 0) {
              this.setState({ verification: false });
              //this.props.noMoreverifcation()
              this.changeTitile("超过尝试次数");
              return;
            }
            Toasts.fail(res.result.message, 2);
          } else {
            Toasts.success("验证成功", 2);
            this.getUser();
          }
          this.clearCode();
        } else {
          Toasts.fail("短信验证服务异常，请稍后再试", 2);
        }
      })
      .catch((err) => {
        // errCodeHandle(err ,"短信验证服务异常，请稍后再试");
      });
  }

  // TODO:校验邮件验证码
  verifyEmailTAC() {
    this.setState({
      errmessage: "",
    });
    const data = {
      serviceAction: "WithdrawalVerification",
      // username: this.state.memberInfo.MemberCode,
      email: this.state.email,
      tac: this.state.verificationCode,
      // siteId: siteId,
    };
    console.log(this.state.memberInfo);
    Toast.loading("验证中...", 100);
    fetchRequest(window.ApiPort.EmailTAC, "PATCH", data)
      .then((res) => {
        Toast.hide();
        if (res) {
          if (!res.result.isVerified) {
            let verifyTimes = res.result.remainingAttempt;
            this.setState({ verifyTimes, verifyErr: true });
            if (verifyTimes == 0) {
              this.setState({ verification: false });
              this.changeTitile("超过尝试次数");
              return;
            }
            this.clearCode();
            Toasts.fail(res.result.message, 2);
          } else {
            Toasts.success("验证成功", 2);
            this.getUser();
          }
        } else {
          Toasts.fail("邮件验证服务异常，请稍后再试", 2);
        }
      })
      .catch((err) => {
        // errCodeHandle(err ,"邮件验证服务异常，请稍后再试");
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
      PiwikEvent("Verification", "Submit", "Phone_Verification_WithdrawalPage");
    }
    if (this.state.verificaType == "email" && this.state.codeAgainEmail) {
      this.verifyEmailTAC();
      PiwikEvent("Verification", "Submit", "Email_Verification_WithdrawalPage");
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

  submitMemberInforIdentityCard() {
    const { IdentityCard } = this.state;

    const params = {
      key: "IdentityCard",
      value1: IdentityCard,
    };

    Toast.loading("加载中,请稍候...", 2000);
    fetchRequest(window.ApiPort.Member, "PATCH", params)
      .then((res) => {
        Toast.hide();
        if (res.result.isSuccess) {
          Toasts.success("更新成功!");
          // Toasts.success(res.message, 2);
          this.getUser();
        } else {
          const error = data.errors ? data.errors[0] : null;
          Toasts.fail(error.description);
        }
      })
      .catch((err) => {
        Toast.hide();
      });
  }

  submitMemberInfor() {
    const {
      province,
      address,
      nameErr,
      profileMasterDataIndex,
      profileMasterData,
      memberInfo,
      name,
      question,
      secretQuestionsData,
      secretQuestionsIndex,
      countryData,
      countryIndex,
      birthdayDate,
      sexIndex,
    } = this.state;

    let contacts = memberInfo.contacts || memberInfo.contacts;
    let tempEmail = contacts.find(
      (v) => v.contactType.toLocaleLowerCase() === "email"
    );
    let email = tempEmail ? tempEmail.contact : "";
    let tempPhone = contacts.find(
      (v) => v.contactType.toLocaleLowerCase() === "phone"
    );
    let phone = tempPhone ? tempPhone.contact : "";
    let Address = memberInfo.address;

    const params = {
      wallet: "MAIN",
      addresses: {
        address: this.state.address,
        city: province,
        country: "中国",
        nationId: 1,
      },
      dob: memberInfo.dob
        ? moment(memberInfo.dob).format("YYYY-MM-DD")
        : birthdayDate,
    };

    Toast.loading("加载中,请稍候...", 2000);
    fetchRequest(window.ApiPort.Member, "PUT", params)
      .then((res) => {
        Toast.hide();
        if (res.result.isSuccess) {
          Toasts.success("更新成功!");
          // this.setState({
          //     question: ''
          // })

          this.getUser();
        } else {
          const error = data.errors ? data.errors[0] : null;
          Toasts.fail(error.description);
        }
      })
      .catch((err) => {
        Toast.hide();
      });
  }

  render() {
    const {
      isSHowModal1,
      Withdrawalverification,
      WithdrawalverificationIndex,
      IdentityCard,
      province,
      address,
      birthdayDate,
      phone,
      email,
      verifyErr,
      phoneEmailStsp,
      countdownNumMMSS,
      phoneEmailCodeArr,
      errCode,
      errorMessage,
      exceed,
      codeAgainPhone,
      codeAgainEmail,
      getCodePhone,
      getCodeEmail,
      verifyTimes,
      CountdownPhone,
      CountdownEmail,
      issubmitBtn,
      verificaType,
      //phone,
      dataType,
      verification,
      CountdownPhone_minutes,
      CountdownEmail_minutes,
      isbirthdayDate,
      isprovince,
      isAddress,
      errmessage,
    } = this.state;
    // Toast.hide();
    console.log(WithdrawalverificationIndex, verificaType);
    return (
      <View style={[styles.viewContainer, { backgroundColor: "#fff" }]}>
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
                    source={require("./../images/error1.png")}
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

        <KeyboardAwareScrollView
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 15 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 25,
            }}
          >
            {Withdrawalverification.map((v, i) => {
              return (
                <View key={i} style={{
                  flexDirection: "row",
                  alignItems: "center"
                }}>
                  {WithdrawalverificationIndex > i && (
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 10000,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 2,
                        borderColor: "#00A6FF",
                        backgroundColor: "#00A6FF",
                      }}
                    >
                      {
                        <Text
                          style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 20,
                          }}
                        >
                          ✓
                        </Text>
                      }
                    </View>
                  )}
                  {WithdrawalverificationIndex == i && (
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 10000,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 2,
                        borderColor: "#00A6FF",
                        backgroundColor: "#00A6FF",
                      }}
                    >
                      {
                        <Text
                          style={{
                            color: "#fff",
                          }}
                        >
                          {i + 1}
                        </Text>
                      }
                    </View>
                  )}

                  {WithdrawalverificationIndex < i && (
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 10000,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 2,
                        borderColor: "#DCDCE0",
                      }}
                    >
                      {
                        <Text
                          style={{
                            color: "#DCDCE0",
                          }}
                        >
                          {i + 1}
                        </Text>
                      }
                    </View>
                  )}
                  <View
                    style={{
                      height: 2,
                      backgroundColor:
                        WithdrawalverificationIndex - 1 < i
                          ? "#D6D6D6"
                          : "#00A6FF",
                      width: 50,
                      marginHorizontal:
                        (width - 20 - 4 * 30 - 50 * 3) / 3.2 / 2,
                    }}
                  ></View>
                </View>
              );
            })}
          </View>

          {WithdrawalverificationIndex == 0 && (
            <View>
              <View
                style={{
                  paddingBottom: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#E3E3E8",
                }}
              >
                <Text
                  style={{ fontWeight: "bold", marginBottom: 10, fontSize: 16 }}
                >
                  验证身份证号码
                </Text>
                <Text style={{ color: "#999999", fontWeight: "400" }}>
                  请输入您的有效身份证件以验证您的帐户
                </Text>
              </View>

              <View style={{ marginTop: 20 }}>
                <Text style={{ color: "#999999", marginBottom: 10 }}>
                  身份证号码 (18位）
                </Text>
                <TextInput
                  value={IdentityCard}
                  onChangeText={(IdentityCard) => {
                    let num = IdentityCard.replace(/[^0-9a-zA-Z]/g, "");
                    this.setState({
                      IdentityCard: num,
                    });
                  }}
                  textContentType="password"
                  secureTextEntry={false}
                  style={{
                    borderWidth: 1,
                    borderColor: "#E3E3E8",
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    height: 40,
                  }}
                  maxLength={18}
                ></TextInput>

                {IdentityCard.length > 0 && IdentityCard.length < 18 && (
                  <TextInput
                    value={"身份证号码格式错误"}
                    onChangeText={(IdentityCard) => {
                      let num = IdentityCard.replace(/[^0-9a-zA-Z]/g, "");
                      this.setState({
                        IdentityCard: num,
                      });
                    }}
                    editable={false}
                    textContentType="password"
                    secureTextEntry={false}
                    style={{
                      borderWidth: 1,
                      borderColor: "#FEE0E0",
                      borderRadius: 6,
                      paddingHorizontal: 10,
                      height: 40,
                      backgroundColor: "#FEE0E0",
                      color: "#EB2121",
                      marginTop: 15,
                    }}
                  ></TextInput>
                )}
              </View>

              <TouchableOpacity
                onPress={() => {
                  IdentityCard.length == 18 &&
                    this.submitMemberInforIdentityCard();

                  PiwikEvent(
                    "Verification",
                    "Submit",
                    "Submit_NationalID_WithdrawPage"
                  );
                }}
                style={{
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  marginBottom: 15,
                  marginTop: 20,
                  backgroundColor:
                    IdentityCard.length == 18 ? "#00A6FF" : "#EFEFF4",
                }}
              >
                <Text
                  style={{
                    color: IdentityCard.length == 18 ? "#FFFFFF" : "#BCBEC3",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  提交
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {WithdrawalverificationIndex == 1 && (
            <View>
              <View
                style={{
                  paddingBottom: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#E3E3E8",
                }}
              >
                <Text
                  style={{ fontWeight: "bold", marginBottom: 10, fontSize: 16 }}
                >
                  完善个人资料{" "}
                </Text>
                <Text style={{ color: "#999999", fontWeight: "400" }}>
                  填写您的出生日期及联系地址
                </Text>
              </View>

              <View style={{ marginTop: 20 }}>
                <Text style={{ color: "#999999", marginBottom: 10 }}>
                  出生日期
                </Text>
                {
                  <DatePicker
                    minDate={new Date(1930, 1, 1)}
                    maxDate={new Date(moment(new Date()).subtract(21, "year"))}
                    mode="date"
                    disabled={isbirthdayDate}
                    onChange={this.changeRebateDatePicker.bind(this)}
                    format="YYYY-MM-DD"
                    locale={DatePickerLocale}
                  >
                    <List.Item styles={StyleSheet.create(ListItemstyles)}>
                      <View
                        style={[
                          styles.limitListsInput,
                          {
                            borderWidth: 1,
                            borderColor: "#E3E3E8",
                            borderRadius: 6,
                            paddingHorizontal: 10,
                            height: 40,
                            width: width - 20,
                            justifyContent: "center",
                          },
                        ]}
                      >
                        {birthdayDate.length > 0 && (
                          <Text>
                            {moment(new Date(birthdayDate)).format(
                              "YYYY年MM月DD日"
                            )}
                          </Text>
                        )}

                        {!isbirthdayDate && (
                          <Image
                            resizeMode="stretch"
                            source={require("./../images/icon1.png")}
                            style={{
                              width: 24,
                              height: 24,
                              position: "absolute",
                              right: 10,
                            }}
                          ></Image>
                        )}
                      </View>
                    </List.Item>
                  </DatePicker>
                }
              </View>

              <View style={{ marginTop: 20 }}>
                <Text style={{ color: "#999999", marginBottom: 10 }}>
                  省市/自治市
                </Text>
                <Picker
                  disabled={isprovince}
                  title="选择地区"
                  onChange={(value) => {
                    this.setState({
                      province: value.join(" "),
                    });
                  }}
                  data={locatData}
                  cols={3}
                >
                  <List.Item styles={StyleSheet.create(ListItemstyles)}>
                    <View
                      style={[
                        styles.limitListsInput,
                        {
                          borderWidth: 1,
                          borderColor: "#E3E3E8",
                          borderRadius: 6,
                          paddingHorizontal: 10,
                          height: 40,
                          width: width - 20,
                          justifyContent: "center",
                        },
                      ]}
                    >
                      <Text>{province}</Text>
                    </View>
                  </List.Item>
                </Picker>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={{ color: "#999999", marginBottom: 10 }}>
                  联系地址
                </Text>
                <TextInput
                  editable={!isAddress}
                  value={address}
                  //keyboardType='number-pad'
                  onChangeText={(address) => {
                    this.setState({
                      address,
                    });
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: "#E3E3E8",
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    height: 40,
                  }}
                ></TextInput>
              </View>

              <TouchableOpacity
                onPress={() => {
                  this.submitMemberInfor();

                  PiwikEvent(
                    "Verification",
                    "Submit",
                    "Submit_DOB_WithdrawPage"
                  );
                }}
                style={{
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  marginBottom: 15,
                  marginTop: 20,
                  backgroundColor:
                    birthdayDate.length > 0 &&
                      province.length > 0 &&
                      address.length > 0
                      ? "#00A6FF"
                      : "#EFEFF4",
                }}
              >
                <Text
                  style={{
                    color:
                      birthdayDate.length > 0 &&
                        province.length > 0 &&
                        address.length > 0
                        ? "#FFFFFF"
                        : "#BCBEC3",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  提交
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {WithdrawalverificationIndex == 2 && verificaType.length > 0 && (
            <View>
              {verification && (
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                  <View style={{ marginBottom: 20 }}>
                    {/* <WhiteSpace size="lg" /> */}
                    <View>
                      <View
                        style={{
                          backgroundColor: "#fff",
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
                            color: "#999",
                          }}
                        >
                          {verificationType[verificaType].txt2}
                        </Text>

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
                            <Text style={{ lineHeight: 44, color: "#222" }}>
                              {maskPhone4(phone)}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            borderRadius: 10,
                            backgroundColor: "#F7F7FC",
                            marginTop: 15,
                            paddingLeft: 15,
                          }}
                        >
                          <Text
                            style={{
                              color: "#666",
                              fontSize: 12,
                              lineHeight: 45,
                            }}
                          >
                            {verificationType[verificaType].txt3}
                            <Text
                              onPress={() => {
                                LiveChatOpenGlobe();
                              }}
                              style={{ color: "#00a6ff", fontSize: 12, textDecorationLine: 'underline' }}
                            >
                              在线客服
                            </Text>
                          </Text>
                        </View>

                        {getCodePhone && (
                          <Touch
                            onPress={() => {
                              this.getCode();
                              if (codeAgainPhone) {
                                PiwikAction.SendPiwik("ResendCode_Phone_WithdrawPage")
                                return;
                              };
                              PiwikAction.SendPiwik("Send_Phone_WithdrawPage");
                            }}
                            style={styles.getCodeBtn}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                textAlign: "center",
                                lineHeight: 44,
                                fontSize: 16,
                                fontWeight: "bold"
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
                              重新发送验证码：({CountdownPhone_minutes})
                            </Text>
                          </View>
                        )}
                      </View>

                      {((verificaType == "phone" && codeAgainPhone) ||
                        (verificaType == "email" && codeAgainEmail)) && (
                          <View
                            style={{
                              // paddingVertical: 10,
                              borderRadius: 10,
                              paddingBottom: 20,
                            }}
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
                                注意：如果5分钟后仍未收到验证码，请点击“重新发送验证码”以获取新的验证码。
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
                                <Text style={{ color: "#00a6ff" }}>
                                  {verifyTimes}
                                </Text>
                                ）次尝试机会
                              </Text>
                              {/* {
                                                        errmessage.length > 0 && <View style={{ backgroundColor: '#FEE0E0', height: 30, marginTop: 10, justifyContent: 'center', borderRadius: 6, alignItems: 'center' }}>
                                                            <Text style={{ color: '#EB2121' }}>{errmessage}</Text>
                                                        </View>
                                                    } */}

                              <View
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                  marginTop: 10,
                                }}
                              >
                                <Touch
                                  style={
                                    codeAgainPhone && issubmitBtn
                                      ? styles.addBtn
                                      : styles.addBtnAgain
                                  }
                                  onPress={() => {
                                    this.submitBtn();
                                    PiwikAction.SendPiwik("Verify_Phone_WithdrawPage");
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: codeAgainPhone && issubmitBtn
                                        ? "#fff"
                                        : "#999",
                                      textAlign: "center",
                                      lineHeight: 44,
                                      fontSize: 16,
                                      fontWeight: "bold"
                                    }}
                                  >
                                    立即验证
                                  </Text>
                                </Touch>
                              </View>
                            </View>
                          </View>
                        )}
                    </View>
                  </View>
                </KeyboardAwareScrollView>
              )}
              {
                //三次错误
                verification == false && (
                  <View style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
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
                        source={require("./../images/warn.png")}
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
                      <Text style={{ lineHeight: 22, color: "#666666" }}>
                        您已超过 5 次尝试, 请 24
                        小时之后再试。或联系我们的在线客服进行验证
                      </Text>
                      {/* <Touch style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width - 40, marginTop: 30 }} onPress={() => { LiveChatOpenGlobe() }}>
                                        <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>联系客服</Text>
                                    </Touch> */}
                    </View>
                  </View>
                )
              }
            </View>
          )}

          {WithdrawalverificationIndex == 3 && verificaType.length > 0 && (
            <View>
              {verification && (
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                  <View style={{ marginBottom: 20 }}>
                    {/* <WhiteSpace size="lg" /> */}
                    <View>
                      <View
                        style={{
                          backgroundColor: "#fff",
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
                            color: "#999",
                          }}
                        >
                          {verificationType[verificaType].txt2}
                        </Text>
                        <View
                          style={{
                            borderRadius: 10,
                            backgroundColor: "#efeff4",
                            paddingLeft: 15,
                          }}
                        >
                          <Text style={{ lineHeight: 44, color: "#222" }}>
                            {maskEmail(email)}
                          </Text>
                        </View>
                        <View
                          style={{
                            borderRadius: 10,
                            backgroundColor: "#F7F7FC",
                            marginTop: 15,
                            paddingLeft: 15,
                          }}
                        >
                          <Text
                            style={{
                              color: "#666",
                              fontSize: 12,
                              lineHeight: 45,
                            }}
                          >
                            {verificationType[verificaType].txt3}
                            <Text
                              onPress={() => {
                                LiveChatOpenGlobe();
                              }}
                              style={{ color: "#00a6ff", fontSize: 12, textDecorationLine: 'underline' }}
                            >
                              在线客服
                            </Text>
                          </Text>
                        </View>

                        {verificaType == "email" && (
                          <>
                            {getCodeEmail && (
                              <Touch
                                onPress={() => {
                                  this.getCode();
                                  if (codeAgainEmail) {
                                    PiwikAction.SendPiwik("ResendCode_Email_WithdrawPage");
                                    return
                                  }
                                  PiwikAction.SendPiwik("Send_Email_WithdrawPage");
                                }}
                                style={styles.getCodeBtn}
                              >
                                <Text
                                  style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    lineHeight: 44,
                                    fontSize: 16,
                                    fontWeight: "bold"
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
                                  重新发送验证码：({CountdownEmail_minutes})
                                </Text>
                              </View>
                            )}
                          </>
                        )}
                      </View>

                      {((verificaType == "phone" && codeAgainPhone) ||
                        (verificaType == "email" && codeAgainEmail)) && (
                          <View
                            style={{
                              // paddingVertical: 10,
                              borderRadius: 10,
                              paddingBottom: 20,
                            }}
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
                                请注意：获取新的验证码前请查看您的垃圾箱
                                若您在10分钟内尚未收到验证码，请点击”重新发送”。
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
                                <Text style={{ color: "#00a6ff" }}>
                                  {verifyTimes}
                                </Text>
                                ）次尝试机会
                              </Text>
                              {/* {
                                                        errmessage.length > 0 && <View style={{ backgroundColor: '#FEE0E0', height: 30, marginTop: 10, justifyContent: 'center', borderRadius: 6, alignItems: 'center' }}>
                                                            <Text style={{ color: '#EB2121' }}>{errmessage}</Text>
                                                        </View>
                                                    } */}
                              <View
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                  marginTop: 10,
                                }}
                              >
                                <Touch
                                  style={
                                    codeAgainEmail && issubmitBtn
                                      ? styles.addBtn
                                      : styles.addBtnAgain
                                  }
                                  onPress={() => {
                                    this.submitBtn();
                                    PiwikAction.SendPiwik("Verify_Email_WithdrawPage");
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: codeAgainEmail && issubmitBtn
                                        ? "#fff"
                                        : "#999",
                                      textAlign: "center",
                                      lineHeight: 44,
                                      fontSize: 16,
                                      fontWeight: "bold"
                                    }}
                                  >
                                    立即验证
                                  </Text>
                                </Touch>
                              </View>
                            </View>
                          </View>
                        )}
                    </View>
                  </View>
                </KeyboardAwareScrollView>
              )}
              {
                //三次错误
                verification == false && (
                  <View style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
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
                        source={require("./../images/warn.png")}
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
                      <Text style={{ lineHeight: 22, color: "#666666" }}>
                        您已超过 5 次尝试, 请 24
                        小时之后再试。或联系我们的在线客服进行验证
                      </Text>
                      {/* <Touch style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width - 40, marginTop: 30 }} onPress={() => { LiveChatOpenGlobe() }}>
                                        <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>联系客服</Text>
                                    </Touch> */}
                    </View>
                  </View>
                )
              }
            </View>
          )}

          <TouchableOpacity
            style={{
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 100,
            }}
            onPress={() => {
              Actions.pop();
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#00A6FF",
              }}
            >
              下次再验证
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        {
          this.props.isRemainingAttempt &&
          <View style={styles.phoneErr}>
            <View style={{ padding: 20, paddingTop: 80, width: width, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Image resizeMode='stretch' source={require('./../images/warn.png')} style={{ width: 60, height: 60 }} />
              <Text style={{ fontSize: 20, color: '#222', paddingTop: 35, paddingBottom: 20, fontWeight: 'bold' }}>超过尝试次数</Text>
              <Text style={{ lineHeight: 22, color: '#999', textAlign: 'center' }}>{`您已超过5次尝试，请24小时后再尝试或\n联系在线客服。`}</Text>
              <Touch style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width - 40, marginTop: 30 }} onPress={() => { LiveChatOpenGlobe() }}>
                <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>联系在线客服</Text>
              </Touch>
            </View>
          </View>
        }
      </View>
    );
  }
}

export default BettingHistory;

const styles = StyleSheet.create({
  phoneErr: {
    backgroundColor: '#fff',
    height: height,
    width: width,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
  },
  viewContainer: {
    flex: 1,
    position: "relative",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  resetCodeText1: {
    textAlign: "center",
    marginTop: 10,
  },
  resetCodeText2: {
    color: "#25AAE1",
    textDecorationLine: "underline",
  },
  step2Text: {
    color: "#000",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    color: "#FF0000",
    marginTop: 10,
    textAlign: "center",
  },
  phonesupportBox: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#25AAE1",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  phonesupportBoxImg: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  phonesupportBoxText: {
    color: "#25AAE1",
    fontSize: 12,
    flexWrap: "wrap",
  },
  phoneInputWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  phoneInput: {
    // borderWidth: 1,
    borderRadius: 3,
    //borderColor: '#D4D4D4',
    width: 44,
    height: 44,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  circleText: {
    color: "#01633C",
  },
  circleLine: {
    height: 2,
    backgroundColor: "#fff",
    width: width / 2,
    position: "absolute",
  },
  circleLine1: {
    right: -20,
  },
  circleLine2: {
    left: -20,
  },
  numPageWrap: {
    position: "relative",
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 5,
  },
  circleWrap: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 200,
    height: 34,
    width: 34,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#5ED0FF",
    borderWidth: 5,
    zIndex: 4,
  },
  backConatinerText: {
    color: "#25AAE1",
    fontWeight: "bold",
  },
  backConatiner: {
    position: "absolute",
    bottom: 15,
    flexDirection: "row",
    width: 0.3 * width,
    marginHorizontal: 0.35 * width,
    alignItems: "center",
    height: 40,
    justifyContent: "center",
  },
  serchBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  phoneInforText: {
    color: "#25AAE1",
    fontSize: 12,
    marginTop: 10,
  },
  inputBtn: {
    height: 46,
    backgroundColor: "#25AAE1",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  nameBox: {
    backgroundColor: "#25AAE1",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    position: "relative",
    paddingHorizontal: 20,
  },
  homeTitle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  nameCircleBox: {
    position: "absolute",
    backgroundColor: "#25AAE1",
    bottom: width * 0.9,
    borderRadius: 300,
    transform: [{ scale: 3 }],
    width: width,
    height: width,
    zIndex: -4,
  },
  inputBox: {
    marginHorizontal: 10,
    marginTop: width * 0.14,
  },
  boclkInforText: {
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 5,
  },
  phoneTopBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44,
  },
  phoneHeadBox: {
    height: 44,
    width: 44,
    backgroundColor: "#EFEFEF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneHeadBoxText: {
    color: "#636363",
  },
  inputBase: {
    height: 44,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 5,
    paddingLeft: 15,
    borderColor: "#B7B7B7",
  },
  homeIdentification: {
    textAlign: "center",
    marginBottom: 15,
    marginTop: 15,
    height: 55,
  },
  homeIdentificationname: {
    width: 80,
  },
  homeIdentificationphone: {
    width: 40,
  },
  homeIdentificationemail: {
    width: 60,
  },
  homeIdentificationbouns: {
    width: 70,
    height: 80,
  },
  homeIdentificationbettingBouns: {
    width: 70,
    height: 80,
  },
  homeTextWrap: {
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
  },
  bounsText: {
    color: "#232323",
    fontWeight: "bold",
  },
  bounsGameBox: {
    // backgroundColor: '#EAEAEA',
    marginBottom: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bounsGameBox1: {
    alignItems: "center",
    justifyContent: "center",
    width: width - 20,
    height: (width - 20) * 0.24,
  },
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
    borderRadius: 8,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
