import React from "react";
import { Dimensions, Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Toast, WhiteSpace } from "antd-mobile-rn";
import { maskEmail, maskPhone4 } from "./../actions/Reg";
import VerificationCodeInput from './VerificationCodeInput'

const { width, height } = Dimensions.get("window");

let verificationType = {
  phone: {
    navTitle: "手机验证",
    title: "手机接收验证码",
    txt1: "为了确保您帐户的安全，請在添加提款錢包之前验证您的手机号码。",
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
const WalletNameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9 ]{0,20}$/;

// 个人资料--手机验证/邮箱验证
class CreatWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aaa: "",
      errCode: 0,
      exceed: false,
      codeAgainPhone: false,
      codeAgainEmail: false,
      verifyTimes: 3, //剩余次数
      getCodePhone: true,
      getCodeEmail: true,
      verificationCode: "",
      CountdownPhone: "300",
      CountdownEmail: "300",
      CountdownPhone_minutes: "5:00",
      CountdownEmail_minutes: "5:00",
      issubmitBtn: false,
      verificaType: 'phone',
      phone: '',
      email: '',
      phoneOrEmail: "",
      verification: true,
      memberCode: '',
      CoinTypesType: this.props.CoinTypesType,
      step: 0,
      ctcWalletName: '',
      ctcWalletAddress: '',
      isSHowModal: false,
      isSHowModal1: false,
      errorMessageText: '',
      errorMessageText1: '',
      errorMessageText2: ''
    };
  }

  componentWillMount() {
    //	this.setData()
    this.getUser()
    // this.getDownTime()
  }


  //获取用户信息
  getUser(key) {
    Toast.loading("加载中,请稍候...", 300);
    fetchRequest(window.ApiPort.Member, "GET")
      .then(data => {
        Toast.hide();
        if (data && data.result) {
          let memberInfo = data.result.memberInfo;
          const phoneData = memberInfo.contacts.find(v => v.contactType.toLocaleLowerCase() === 'phone')
          let phoneStatus = phoneData ? (phoneData.status.toLocaleLowerCase() === 'unverified' ? true : false) : true
          const phone = phoneData ? phoneData.contact : ''
          const emailData = memberInfo.contacts.find(v => v.contactType.toLocaleLowerCase() === 'email')
          let emailStatus = emailData ? (emailData.status.toLocaleLowerCase() === 'unverified' ? true : false) : true


          this.setState({
            phone,
            phoneOrEmail: phone
          })

          console.log(phone)

        }
      })
      .catch(error => {
        Toast.hide();
      });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      title: `添加 ${this.state.CoinTypesType} 钱包地址`,
    })
  }

  componentWillUnmount() {
    //存储倒计时
    if (this.state.codeAgainPhone) {
      let phoneTime = (new Date()).getTime() / 1000 + this.state.CountdownPhone
      global.storage.save({
        key: 'VerifyPhone',
        id: 'VerifyPhone',
        data: phoneTime,
        expires: null
      });
    }

    //存储倒计时
    if (this.state.codeAgainEmail) {
      let emailTime = (new Date()).getTime() / 1000 + this.state.CountdownEmail
      global.storage.save({
        key: 'VerifyEmail',
        id: 'VerifyEmail',
        data: emailTime,
        expires: null
      });
    }

    //保存次数
    global.storage.save({
      key: 'verifyTimes',
      id: 'verifyTimes',
      data: this.state.verifyTimes,
      expires: null
    });

    this.CountdownPhones && clearInterval(this.CountdownPhones);
    this.CountdownEmails && clearInterval(this.CountdownEmails);

  }

  getDownTime() {

    //获取剩余次数
    global.storage.load({
      key: 'verifyTimes',
      id: 'verifyTimes'
    }).then(verifyTimes => {
      if (verifyTimes) {
        this.setState({ verifyTimes })
      }
    })

    //重新进行倒计时
    if (this.state.verificaType == 'phone') {
      global.storage.load({
        key: 'VerifyPhone',
        id: 'VerifyPhone'
      }).then(ret => {
        let news = (new Date()).getTime() / 1000

        if (ret - news > 0) {
          this.CountdownPhone(parseInt(ret - news))
        }
      })
    } else if (this.state.verificaType == 'email') {
      global.storage.load({
        key: 'VerifyEmail',
        id: 'VerifyEmail'
      }).then(ret => {
        let news = (new Date()).getTime() / 1000

        if (ret - news > 0) {
          this.CountdownEmail(parseInt(ret - news))
        }
      })

    }
  }

  setData() {
    let phone = this.props.dataPhone
    let email = this.props.dataEmail
    if (this.state.verificaType == 'phone' && phone.indexOf('-') > -1) {
      phone = phone.split('-')[1]
    }

    let memberCode = this.props.memberCode
    this.setState({ phone, email, memberCode }, () => {
      this, this.setVerifyData()
    })
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

    PiwikEvent('Verification', 'Click', 'ResendOTP_CryptoWallet_Withdrawal')
  }

  //TODO: 发送短信验证码 111
  sendSMSVerfication() {
    let number = this.state.phoneOrEmail
    Toast.loading("验证码发送中,请稍候...", 200);
    fetchRequest(window.ApiPort.SendSmsOTP + 'phoneNumber=' + number + '&', "POST")
      .then(res => {
        Toast.hide();
        let data = res.result;
        if (!res.isSuccess) {
          // 发送异常
          Toasts.fail(res.errorMessage, 2);
          this.setState({
            verifyTimes: data.attempts,
            isSHowModal1: data.attempts <= 0
          })
        } else {
          Toasts.success("发送成功", 2);
          this.CountdownPhone(300)
          this.clearCode();
          this.setState({
            verifyTimes: data.attempts,
            isSHowModal1: data.attempts <= 0
          })
        }
      })
      .catch(err => {
        // errCodeHandle(err ,"短信服务异常，请稍后再试");
      });
  }


  VerifySmsOTP() { // 111
    this.setState({
      errorMessageText1: ''
    })
    // UMonEvent && UMonEvent("Verify_TTH_Crypto")
    const data = {
      verificationCode: this.state.verificationCode
    }
    Toast.loading("验证中,请稍候...", 200);
    fetchRequest(window.ApiPort.SendSmsOTP, "PATCH", data)
      .then(data => {
        Toast.hide();
        if (data.isSuccess) {
          Toasts.success("验证成功", 2);
          this.setState({
            step: 1
          })
        } else {
          //Toasts.fail(data.message || "验证失败", 2);
          this.setState({
            verifyTimes: data.result.attempts,
            isSHowModal1: data.result.attempts <= 0,
            errorMessageText1: data.description || "验证失败"
          })
          this.clearCode()
        }
      })
      .catch((err) => {
        console.log(err);
      });

    PiwikEvent('Verification', 'Submit', 'SubmitOTP_CryptoWallet_Withdrawal')
  }

  //手机验证码倒计时处理
  CountdownPhone(item) {

    this.setState({ codeAgainPhone: true, getCodePhone: false })
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
        this.setState({ getCodePhone: true })
        clearInterval(this.CountdownPhones);
      }
    }, 1000);
  }

  //邮箱验证码倒计时处理
  CountdownEmail(item) {
    this.setState({ codeAgainEmail: true, getCodeEmail: false })
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
        this.setState({ getCodeEmail: true })
        clearInterval(this.CountdownEmails);
      }
    }, 1000);
  }

  // 清空验证码
  clearCode() {
    let errCode = this.state.errCode
    errCode += 1
    this.setState({
      issubmitBtn: false,
      verificationCode: "",
      errCode,
    });
  }

  checked(code) {
    if (code.length == 6) {
      this.setState({ issubmitBtn: true, verificationCode: code });
    } else {
      this.setState({ issubmitBtn: false });
    }
  }

  changType() {
    this.setState({
      verificationCode: '',
      verificaType: this.state.verificaType == 'email' ? 'phone' : 'email',
    }, () => {
      this.setVerifyData()
      this.props.navigation.setParams({
        title: verificationType[this.state.verificaType].title
      });
    })
  }


  //新增加密貨幣錢包 提交
  addCryptoWallet() {
    this.setState({
      errorMessageText: '',
      errorMessageText2: ''
    })
    // UMonEvent &&UMonEvent("Addwallet_Crypto")
    Toast.loading("提交中,请稍候...", 200);
    const { ctcWalletAddress, ctcWalletName, isDefault, verificationCode, CoinTypesType } = this.state;
    const requestData = {
      walletName: ctcWalletName,
      walletAddress: ctcWalletAddress,
      passCode: verificationCode,
      cryptocurrencyCode: CoinTypesType,
      isDefault: true
    };
    fetchRequest(window.ApiPort.CryptoWallet + "?", "POST", requestData).then(data => {
      Toast.hide();
      if (data.isSuccess) {
        this.setState({
          toastSuccessFlag: true,
          toastMsg: `成功添加 ${CoinTypesType} 钱包地址`
        });
        Toasts.success('添加成功')
        setTimeout(() => {
          Actions.pop();
          this.props.GetCryptoWallet(this.state.CoinTypesType);
        }, 500);
      } else {
        let walletAddressErrorList = data.result.walletAddressErrorList
        if (Array.isArray(walletAddressErrorList) && walletAddressErrorList.length) {
          this.setState({
            errorMessageText: walletAddressErrorList[0].Description
          })

          // setTimeout(() => {
          //   this.setState({
          //     errorMessageText: '',
          //     ctcWalletAddress: ''
          //   })
          // }, 2500)

          Toasts.fail(walletAddressErrorList[0].Description);
        }

        let walletNameErrorList = data.walletNameErrorList
        if (Array.isArray(walletNameErrorList) && walletNameErrorList.length) {
          this.setState({
            errorMessageText2: walletNameErrorList[0].Description
          })

          // setTimeout(() => {
          //   this.setState({
          //     errorMessageText: '',
          //     ctcWalletAddress: ''
          //   })
          // }, 2500)

          Toasts.fail(walletNameErrorList[0].Description);
        }

      }
    });


    PiwikEvent('Withdrawal Nav', 'Click', `Add_CryptoWallet_${CoinTypesType}`)
  }


  render() {
    const {
      errCode,
      errorMessage,
      exceed,
      step,
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
      ctcWalletName,
      ctcWalletAddress,
      CoinTypesType,
      isSHowModal,
      isSHowModal1,
      errorMessageText,
      errorMessageText1,
      errorMessageText2
    } = this.state;
    console.log(this.state)
    const WalletAddressRegex = this.state.CoinTypesType == 'USDT-ERC20' ? /^0x[a-zA-Z0-9]{40}$/ : /^T[a-zA-Z0-9]{33}$/;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>


        <Modal animationType='fade' transparent={true} visible={isSHowModal}
        >
          <View style={{
            width,
            height,
            flex: 1,
            backgroundColor: 'rgba(0 ,0 ,0, .6)',
            alignItems: 'center',
            justifyContent: 'center'

          }}>
            <View style={{
              width: width * .9,
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#fff'
            }}>
              <View style={{
                height: 44,
                backgroundColor: '#00A6FF',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#fff'
                }}>温馨提醒</Text>
              </View>

              <View style={{
                padding: 15,
                paddingVertical: 25
              }}>
                <Text style={{
                  marginBottom: 10, color: '#666'
                }}>您将需要再次验证电话号码以访问此页面，你确定要离开吗？</Text>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                  <Touch onPress={() => {
                    this.setState({
                      isSHowModal: false
                    })
                    Actions.pop()
                  }} style={{
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: '#00A6FF',
                    width: 130
                  }}>
                    <Text style={{ color: '#00A6FF', fontSize: 15 }}>离开</Text>
                  </Touch>
                  <Touch
                    onPress={() => {
                      this.setState({
                        isSHowModal: false
                      })
                    }}
                    style={{
                      height: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: '#00A6FF',
                      width: 130,
                      backgroundColor: '#00A6FF'
                    }}>
                    <Text style={{ color: '#fff', fontSize: 15 }}>继续添加钱包</Text>
                  </Touch>
                </View>
              </View>
            </View>

          </View>
        </Modal>

        <Modal animationType='fade' transparent={true} visible={isSHowModal1}
        >
          <View style={{
            width,
            height,
            flex: 1,
            backgroundColor: 'rgba(0 ,0 ,0, .6)',
            alignItems: 'center',
            justifyContent: 'center'

          }}>
            <View style={{
              width: width * .9,
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#fff'
            }}>


              <View style={{
                padding: 15,
                paddingVertical: 25
              }}>

                <View style={{ alignItems: 'center' }}>
                  <Image source={require('./../images/error1.png')} style={{
                    width: 70, height: 70
                  }} resizeMode='stretch'></Image>

                  <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>超过尝试次数</Text>
                  <Text style={{
                    textAlign: 'center',
                    marginBottom: 10, color: '#000', marginTop: 15, paddingHorizontal: 20
                  }}>您已超过 5 次尝试, 请 24 小时之后再试。或联系我们的在线客服进行验证</Text>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                  <Touch onPress={() => {
                    this.setState({
                      isSHowModal1: false
                    })

                  }} style={{
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: '#00A6FF',
                    width: 130
                  }}>
                    <Text style={{ color: '#00A6FF', fontSize: 15 }}>关闭</Text>
                  </Touch>
                  <Touch
                    onPress={() => {
                      this.setState({
                        isSHowModal1: false
                      })
                      LiveChatOpenGlobe()
                    }}
                    style={{
                      height: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: '#00A6FF',
                      width: 130,
                      backgroundColor: '#00A6FF'
                    }}>
                    <Text style={{ color: '#fff', fontSize: 15 }}>联系客服</Text>
                  </Touch>
                </View>
              </View>
            </View>

          </View>
        </Modal>


        {
          step == 0 && <View>
            {
              verification &&
              <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                <View style={{ padding: 10, marginBottom: 20 }}>
                  <WhiteSpace size="lg"/>
                  <View>
                    <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10, paddingBottom: 20 }}>
                      <View style={{ borderBottomColor: '#c4c4c4', borderBottomWidth: 1 }}>
                        <Text style={{ color: "#171717", fontSize: 18 }}>
                          {verificationType[verificaType].title}
                        </Text>
                        <Text style={{ color: "#999", paddingTop: 12, paddingBottom: 25 }}>
                          {verificationType[verificaType].txt1}
                        </Text>
                      </View>
                      <Text style={{
                        paddingTop: 20,
                        paddingBottom: 8,
                        color: '#2D2D2D'
                      }}>{verificationType[verificaType].txt2}</Text>
                      {
                        verificaType == 'email' &&
                        <View style={{ borderRadius: 10, backgroundColor: '#efeff4', paddingLeft: 15 }}>
                          <Text style={{ lineHeight: 45, color: '#000' }}>{phoneOrEmail}</Text>
                        </View>
                      }
                      {
                        verificaType == 'phone' &&
                        <View style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexDirection: 'row'
                        }}>
                          <View style={{ borderRadius: 10, backgroundColor: '#efeff4', width: (width - 60) / 5 }}>
                            <Text style={{ lineHeight: 45, textAlign: 'center', color: '#000' }}>+86</Text>
                          </View>
                          <View style={{
                            borderRadius: 10,
                            backgroundColor: '#efeff4',
                            paddingLeft: 15,
                            width: (width - 60) / 1.2
                          }}>
                            <Text style={{ lineHeight: 45, color: '#000' }}>******{phoneOrEmail.slice(-5)}</Text>
                          </View>
                        </View>
                      }
                      <View style={{ borderRadius: 10, backgroundColor: '#efeff4', marginTop: 15, paddingLeft: 15 }}>
                        <Text
                          style={{ color: '#999999', fontSize: 12, lineHeight: 45 }}>{verificationType[verificaType].txt3}<Text
                          onPress={() => {
                            LiveChatOpenGlobe()
                          }} style={{ color: '#00a6ff', fontSize: 12 }}>在线客服</Text></Text>
                      </View>

                      {
                        verificaType == 'email' &&
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          {getCodeEmail && (
                            <Touch onPress={() => {
                              this.getCode()
                            }} style={styles.getCodeBtn}>
                              <Text style={{ color: "#fff", textAlign: "center", lineHeight: 45 }}>
                                {codeAgainEmail ? '重新发送验证码' : '发送'}
                              </Text>
                            </Touch>
                          )}
                          {!getCodeEmail && (
                            <View style={styles.getCodeBtnAgain}>
                              <Text style={{ color: "#999", textAlign: "center", lineHeight: 45 }}>
                                重新发送验证码： {CountdownEmail_minutes}
                              </Text>
                            </View>
                          )}
                        </View>
                      }
                      {
                        verificaType == 'phone' &&
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          {getCodePhone && (
                            <Touch onPress={() => {
                              this.getCode()
                            }} style={styles.getCodeBtn}>
                              <Text style={{ color: "#fff", textAlign: "center", lineHeight: 45 }}>
                                {codeAgainPhone ? '重新发送验证码' : '发送'}
                              </Text>
                            </Touch>
                          )}
                          {!getCodePhone && (
                            <View style={styles.getCodeBtnAgain}>
                              <Text style={{ color: "#999", textAlign: "center", lineHeight: 45 }}>
                                重新发送验证码： {CountdownPhone_minutes}
                              </Text>
                            </View>
                          )}
                        </View>
                      }

                      {((verificaType == "phone" && codeAgainPhone) ||
                        (verificaType == "email" && codeAgainEmail)) && (
                        <View
                          style={{ paddingVertical: 10, borderRadius: 10, paddingBottom: 20 }}
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
                              inputSize={6}//默认value是 6
                              TextInputChange={(value) => {
                                this.checked(value)
                              }}
                            />
                            {/*{verifyErr && (*/}
                            {/*  <View*/}
                            {/*    style={{*/}
                            {/*      backgroundColor: "#FEE5E5",*/}
                            {/*      borderRadius: 5,*/}
                            {/*      marginTop: 10,*/}
                            {/*    }}*/}
                            {/*  >*/}
                            {/*    <Text*/}
                            {/*      style={{*/}
                            {/*        color: "#EB2121",*/}
                            {/*        fontSize: 12,*/}
                            {/*        lineHeight: 35,*/}
                            {/*        paddingLeft: 10,*/}
                            {/*      }}*/}
                            {/*    >*/}
                            {/*      验证码有误，请检查并确保您输入了正确的验证码.*/}
                            {/*    </Text>*/}
                            {/*  </View>*/}
                            {/*)}*/}
                            {
                              errorMessageText1.length > 0 && <View style={{
                                backgroundColor: '#FEE0E0',
                                paddingVertical: 10,
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 15,
                                marginTop: 10,
                                borderRadius: 4
                              }}>
                                <Text style={{ color: '#EB2121' }}>{errorMessageText1}</Text>
                              </View>
                            }
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
                              {
                                verificaType == 'phone' &&
                                <Touch style={codeAgainPhone && issubmitBtn ? styles.addBtn : styles.addBtnAgain}
                                       onPress={() => {
                                         this.VerifySmsOTP()
                                       }}>
                                  <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>立即验证</Text>
                                </Touch>
                              }
                            </View>
                          </View>
                          {/*<Touch onPress={() => {*/}
                          {/*  this.changType()*/}
                          {/*}}>*/}
                          {/*  <Text style={{*/}
                          {/*    color: '#00a6ff',*/}
                          {/*    textAlign: 'center',*/}
                          {/*    lineHeight: 45,*/}
                          {/*    paddingTop: 20,*/}
                          {/*    fontSize: 16*/}
                          {/*  }}>更换验证方式</Text>*/}
                          {/*</Touch> */}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </KeyboardAwareScrollView>
            }
            {
              //三次错误
              verification == false &&
              <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
                <View style={{
                  padding: 20,
                  paddingTop: 50,
                  width: width,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Image resizeMode='stretch' source={require('./../images/warn.png')} style={{ width: 60, height: 60 }}/>
                  <Text style={{
                    fontSize: 20,
                    color: '#222',
                    paddingTop: 35,
                    paddingBottom: 20,
                    fontWeight: 'bold'
                  }}>超过尝试次数</Text>
                  <Text style={{ lineHeight: 22, color: '#666666' }}>您已超过 5 次尝试, 请 24 小时之后再试。或联系我们的在线客服进行验证</Text>
                  {/* <Touch style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width - 40, marginTop: 30 }} onPress={() => { LiveChatOpenGlobe() }}>
                    <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>联系客服</Text>
                  </Touch> */}
                </View>
              </View>
            }
            {/*客服懸浮球*/}
            {/* <LivechatDragHoliday /> */}
          </View>
        }


        {
          step == 1 && <View>
            {
              CoinTypesType == "USDT-ERC20"
                ?
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                  <View style={{ padding: 10, marginBottom: 20, paddingTop: 25 }}>
                    <View style={{ marginBottom: 20 }}>
                      <Text style={{ color: '#666666', marginBottom: 10 }}>钱包名称</Text>

                      <TextInput
                        value={ctcWalletName}
                        //keyboardType='decimal-pad'
                        style={[{
                          height: 42,
                          borderWidth: 1,
                          borderRadius: 4,
                          borderColor: errorMessageText2.length > 0 ? '#EB2121' : '#E3E3E8',
                          paddingHorizontal: 15
                        }]}
                        maxLength={20}
                        placeholderTextColor='#BCBEC3'
                        onChangeText={(ctcWalletName) => {
                          //let money = getDoubleNum(value)
                          this.setState({
                            ctcWalletName: ctcWalletName.trim()
                          }, () => {
                            //	this.changeWithdrawalsBtnStatus()
                          })
                        }}
                      />

                      {
                        errorMessageText2.length > 0 && ctcWalletName.length > 0 && <View style={{
                          backgroundColor: '#FEE0E0',
                          height: 40,
                          justifyContent: 'center',
                          paddingLeft: 15,
                          marginTop: 10,
                          borderRadius: 4
                        }}>
                          <Text style={{ color: '#EB2121' }}>{errorMessageText2}</Text>
                        </View>
                      }

                      <View style={{
                        backgroundColor: '#F5F5F5',
                        borderRadius: 10,
                        padding: 15,
                        marginTop: 15
                      }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
                          {
                            ctcWalletName.length > 0 && WalletNameRegex.test(ctcWalletName) ? <View style={{
                                backgroundColor: '#0CCC3C',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#fff' }}>✓</Text>
                              </View>
                              :
                              <View style={{
                                backgroundColor: '#BCBEC3',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#F5F5F5' }}>✓</Text>
                              </View>
                          }

                          <Text style={{ color: '#666666' }}>不允许使用特殊字符</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
                          {
                            ctcWalletName.length > 0 && WalletNameRegex.test(ctcWalletName) ? <View style={{
                                backgroundColor: '#0CCC3C',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#fff' }}>✓</Text>
                              </View>
                              :
                              <View style={{
                                backgroundColor: '#BCBEC3',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#F5F5F5' }}>✓</Text>
                              </View>
                          }

                          <Text style={{ color: '#666666' }}>最多20个字符</Text>
                        </View>
                      </View>
                    </View>


                    <View style={{ marginBottom: 20 }}>
                      <Text style={{ color: '#666666', marginBottom: 10 }}>钱包地址</Text>

                      <TextInput
                        value={ctcWalletAddress}
                        //keyboardType='decimal-pad'
                        style={[{
                          height: 42,
                          borderWidth: 1,
                          borderRadius: 4,
                          borderColor: errorMessageText.length > 0 ? '#EB2121' : '#E3E3E8',
                          paddingHorizontal: 15
                        }]}
                        maxLength={42}
                        placeholderTextColor='#BCBEC3'
                        onChangeText={(ctcWalletAddress) => {
                          //let money = getDoubleNum(value)
                          this.setState({
                            ctcWalletAddress: ctcWalletAddress.trim(),
                            errorMessageText: false
                          }, () => {
                            //	this.changeWithdrawalsBtnStatus()
                          })
                        }}
                      />

                      {
                        errorMessageText.length > 0 && ctcWalletAddress.length > 0 && <View style={{
                          backgroundColor: '#FEE0E0',
                          height: 40,
                          justifyContent: 'center',
                          paddingLeft: 15,
                          marginTop: 10,
                          borderRadius: 4
                        }}>
                          <Text style={{ color: '#EB2121' }}>{errorMessageText}</Text>
                        </View>
                      }

                      {
                        !(ctcWalletAddress.length > 0 && WalletAddressRegex.test(ctcWalletAddress)) && ctcWalletAddress.length > 0 &&
                        <View style={{
                          backgroundColor: '#FEE0E0',
                          borderRadius: 10,
                          padding: 15,
                          marginTop: 15
                        }}>
                          <Text style={{ color: '#EB2121' }}>钱包地址无效</Text>

                          {
                            console.log(WalletAddressRegex)
                          }
                        </View>
                      }


                      <View style={{
                        backgroundColor: '#F5F5F5',
                        borderRadius: 10,
                        padding: 15,
                        marginTop: 15
                      }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
                          {
                            ctcWalletAddress.length > 0 && WalletAddressRegex.test(ctcWalletAddress) ? <View style={{
                                backgroundColor: '#0CCC3C',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#fff' }}>✓</Text>
                              </View>
                              :
                              <View style={{
                                backgroundColor: '#BCBEC3',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#F5F5F5' }}>✓</Text>
                              </View>
                          }

                          <Text style={{ color: '#666' }}>不允许使用空格和特殊字符</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
                          {
                            ctcWalletAddress.length > 0 && WalletAddressRegex.test(ctcWalletAddress) ? <View style={{
                                backgroundColor: '#0CCC3C',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#fff' }}>✓</Text>
                              </View>
                              :
                              <View style={{
                                backgroundColor: '#BCBEC3',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#F5F5F5' }}>✓</Text>
                              </View>
                          }

                          <Text style={{ color: '#666' }}>以"0x"开头, 为一串42个字母数字字符</Text>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        ctcWalletAddress.length > 0 && WalletAddressRegex.test(ctcWalletAddress) && ctcWalletName.length > 0 && WalletNameRegex.test(ctcWalletName) && this.addCryptoWallet()
                      }}
                      style={{
                        height: 46,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: ctcWalletAddress.length > 0 && WalletAddressRegex.test(ctcWalletAddress) && ctcWalletName.length > 0 && WalletNameRegex.test(ctcWalletName) ? '#00A6FF' : '#EFEFF4',
                        borderRadius: 10
                      }}>
                      <Text style={{
                        color: ctcWalletAddress.length > 0 && WalletAddressRegex.test(ctcWalletAddress) && ctcWalletName.length > 0 && WalletNameRegex.test(ctcWalletName) ? '#fff' : '#BCBEC3',
                        fontWeight: 'bold',
                        fontSize: 16
                      }}>提交</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAwareScrollView>
                :
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                  <View style={{ padding: 10, marginBottom: 20, paddingTop: 25 }}>
                    <View style={{ marginBottom: 20 }}>
                      <Text style={{ color: '#666666', marginBottom: 10 }}>钱包名称</Text>

                      <TextInput
                        value={ctcWalletName}
                        //keyboardType='decimal-pad'
                        style={[{
                          height: 42,
                          borderWidth: 1,
                          borderRadius: 4,
                          borderColor: '#E3E3E8',
                          paddingHorizontal: 15
                        }]}
                        maxLength={20}
                        placeholderTextColor='#BCBEC3'
                        onChangeText={(ctcWalletName) => {
                          //let money = getDoubleNum(value)
                          this.setState({
                            ctcWalletName: ctcWalletName.trim()
                          }, () => {
                            //	this.changeWithdrawalsBtnStatus()
                          })
                        }}
                      />

                      <View style={{
                        backgroundColor: '#F5F5F5',
                        borderRadius: 10,
                        padding: 15,
                        marginTop: 15
                      }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
                          {
                            ctcWalletName.length > 0 && WalletNameRegex.test(ctcWalletName) ? <View style={{
                                backgroundColor: '#0CCC3C',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#fff' }}>✓</Text>
                              </View>
                              :
                              <View style={{
                                backgroundColor: '#BCBEC3',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#F5F5F5' }}>✓</Text>
                              </View>
                          }

                          <Text style={{ color: '#666666' }}>不允许使用特殊字符</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
                          {
                            ctcWalletName.length > 0 && WalletNameRegex.test(ctcWalletName) ? <View style={{
                                backgroundColor: '#0CCC3C',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#fff' }}>✓</Text>
                              </View>
                              :
                              <View style={{
                                backgroundColor: '#BCBEC3',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#F5F5F5' }}>✓</Text>
                              </View>
                          }

                          <Text style={{ color: '#666666' }}>最多20个字符</Text>
                        </View>
                      </View>
                    </View>


                    <View style={{ marginBottom: 20 }}>
                      <Text style={{ color: '#666666', marginBottom: 10 }}>钱包地址</Text>

                      <TextInput
                        value={ctcWalletAddress}
                        //keyboardType='decimal-pad'
                        style={[{
                          height: 42,
                          borderWidth: 1,
                          borderRadius: 4,
                          borderColor: errorMessageText.length > 0 ? '#EB2121' : '#E3E3E8',
                          paddingHorizontal: 15
                        }]}
                        maxLength={34}
                        placeholderTextColor='#BCBEC3'
                        onChangeText={(ctcWalletAddress) => {
                          //let money = getDoubleNum(value)
                          this.setState({
                            ctcWalletAddress: ctcWalletAddress.trim(),
                            errorMessageText: false
                          }, () => {
                            //	this.changeWithdrawalsBtnStatus()
                          })
                        }}
                      />

                      {
                        errorMessageText.length > 0 && ctcWalletAddress.length > 0 && <View style={{
                          backgroundColor: '#FEE0E0',
                          height: 40,
                          justifyContent: 'center',
                          paddingLeft: 15,
                          marginTop: 10,
                          borderRadius: 4
                        }}>
                          <Text style={{ color: '#EB2121' }}>{errorMessageText}</Text>
                        </View>
                      }

                      {
                        !(ctcWalletAddress.length > 0 && WalletAddressRegex.test(ctcWalletAddress)) && ctcWalletAddress.length > 0 &&
                        <View style={{
                          backgroundColor: '#FEE0E0',
                          borderRadius: 10,
                          padding: 15,
                          marginTop: 15
                        }}>
                          <Text style={{ color: '#EB2121' }}>钱包地址无效</Text>

                          {
                            console.log(WalletAddressRegex)
                          }
                        </View>
                      }


                      <View style={{
                        backgroundColor: '#F5F5F5',
                        borderRadius: 10,
                        padding: 15,
                        marginTop: 15
                      }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
                          {
                            ctcWalletAddress.length > 0 && WalletAddressRegex.test(ctcWalletAddress) ? <View style={{
                                backgroundColor: '#0CCC3C',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#fff' }}>✓</Text>
                              </View>
                              :
                              <View style={{
                                backgroundColor: '#BCBEC3',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#F5F5F5' }}>✓</Text>
                              </View>
                          }

                          <Text style={{ color: '#666' }}>不允许使用空格和特殊字符</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
                          {
                            ctcWalletAddress.length > 0 && WalletAddressRegex.test(ctcWalletAddress) ? <View style={{
                                backgroundColor: '#0CCC3C',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#fff' }}>✓</Text>
                              </View>
                              :
                              <View style={{
                                backgroundColor: '#BCBEC3',
                                width: 18,
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10000,
                                marginRight: 8,

                              }}>
                                <Text style={{ color: '#F5F5F5' }}>✓</Text>
                              </View>
                          }

                          <Text style={{ color: '#666' }}>以"T"开头, 为一串34个字母数字字符</Text>
                        </View>
                      </View>

                    </View>


                    <TouchableOpacity
                      onPress={() => {
                        ctcWalletAddress.length > 0 && WalletAddressRegex.test(ctcWalletAddress) && ctcWalletName.length > 0 && WalletNameRegex.test(ctcWalletName) && this.addCryptoWallet()
                      }}
                      style={{
                        height: 46,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: ctcWalletAddress.length > 0 && WalletAddressRegex.test(ctcWalletAddress) && ctcWalletName.length > 0 && WalletNameRegex.test(ctcWalletName) ? '#00A6FF' : '#EFEFF4',
                        borderRadius: 10
                      }}>
                      <Text style={{
                        color: ctcWalletAddress.length > 0 && WalletAddressRegex.test(ctcWalletAddress) && ctcWalletName.length > 0 && WalletNameRegex.test(ctcWalletName) ? '#fff' : '#BCBEC3',
                        fontWeight: 'bold',
                        fontSize: 16
                      }}>提交</Text>
                    </TouchableOpacity>


                  </View>


                </KeyboardAwareScrollView>


            }


          </View>
        }

      </View>
    );
  }
}

export default CreatWallet;

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
    paddingBottom: 10
  },
  steps: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 25,
    paddingRight: 25
  },
  stepListActive: {
    backgroundColor: "#00623b",
    width: 45,
    height: 45,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center"
  },
  stepList: {
    backgroundColor: "transparent",
    borderColor: "#a1a1a1",
    borderWidth: 2,
    width: 45,
    height: 45,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center"
  },
  accountNum: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    height: 50,
    backgroundColor: "#e4e4e4"
  },
  accountTxt: {
    borderRightWidth: 1,
    borderColor: "#989898",
    padding: 10
  },
  getCodeBtn: {
    backgroundColor: "#00a6ff",
    borderRadius: 10,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 40,
  },
  getCodeBtnAgain: {
    backgroundColor: "#efeff4",
    borderRadius: 10,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 20
  },
  submitBtn: {
    borderRadius: 5,
    marginTop: 15
  },
  topNav: {
    width: width,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  btnTouch: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  gameButtonBox: {
    flexDirection: 'row',
    marginRight: 10
  },
  hiddenView: {
    width: 100,
    height: 40,
    position: 'absolute',
    left: -width,
    zIndex: 1000,
    bottom: -20,
  }
});
