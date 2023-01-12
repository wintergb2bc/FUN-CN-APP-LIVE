import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import { ActionConst, Actions } from 'react-native-router-flux';
import { Toast } from 'antd-mobile-rn';
import { connect } from "react-redux";
import { bankNameTest, bankTest, IdentityCardReg, maskPhone4, nameTest, phoneReg } from '../../actions/Reg';
import Touch from 'react-native-touch-once';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VerificationCodeInput from '../VerificationCodeInput';
import actions from "$LIB/redux/actions/index";
import { Toasts } from "../Toast";
import Modals from "react-native-modal";
import PiwikAction from "../../lib/utils/piwik";

const {
  width, height
} = Dimensions.get('window');

const titles = {
  nameId: ['请确保您在提交前输入正确的信息，以免延误。', '如需帮助，请联系 ', '在线客服'],
  phone: ['亲爱的会员，为了您的存款能更快速准确地到账，', '请先完善您的个人资料', ' '],
};

class BankCardVerify extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      nameVerify: false,
      IdentityCard: '',
      isIdentityCard: true,
      Names: '',
      isName: true,
      isVerifySuccess: false,
      success: false,
      fromType: 'nameId',
      hasName: false,
      hasIdentityCard: false,
      phoneType: this.props.phoneType ? this.props.phoneType : 1,//1，不显示验证码输入框，2显示验证码输入框，3错误次数5次
      phoneNum: '',
      verifyTimes: 5,
      codeAgainPhone: false,
      CountdownPhone_minutes: '5:00',
      CountdownPhone: 300,
      verifyErr: false,
      issubmitBtn: false,
      errModal: false,
      isPhone: true,
      isSuccessOtp: false,
      bankList: '',
      otherBankName: '',
      isOtherBankName: true,
      activeBank: '',
      phoneChange: false,
      isShowCtcModal: false,
      nameBankOtpModal: false,
      bankCard: '',
      isbankCard: false,
      errCode: 0,
      nameBankSkip: false,
      getCodePhone: true,
      isPhoneEditable: false,
      codeInputFocus: false,
      nameBankErr: false,
      isSubmitNameModal: false,

      // true是已驗證
      phoneStauts: false,
      serviceAction: 'BankCardVerification',//DepositVerification  手机otp, BankCardVerification 个人信息otp使用modal

      // 驗證碼繳驗的loading，用Toast會被Modal擋住顯示不出來，所以自己寫
      PhoneTACLoading: false
    };
  }

  componentDidMount() {
    this.getMember();
    //验证姓名银行卡信息,获取银行卡信息
    this.getWithdrawalLbBankAction();
    console.log('this.props.isNameVerification ',this.props.isNameVerification)
    console.log('this.props.isDepositVerificationOTP ',this.props.isDepositVerificationOTP)
    if (this.props.isDepositVerificationOTP || this.props.isNameVerification) {
      this.setState({
        fromType: 'phone',
        serviceAction: 'DepositVerification'
      }, () => {
        this.getVerifyTimes();
        this.getDownTime();
      });
    } else {
      console.log('姓名银行卡提交');
      //姓名银行卡提交，没有验证过手机，手机验证次数0时候直接进入err，不显示提交表格
      !BankCardPhoneVerify && this.getVerifyTimes();
      global.storage.remove({
        key: "VerifyPhone" + userNameDB,
        id: "VerifyPhone" + userNameDB
      });
    }
  }

  componentWillUnmount() {
    //返回确认是否已验证，
    this.props.checkCustomFlag && this.props.checkCustomFlag();
    if (!this.state.getCodePhone) {
      //记录倒计时时间，下次进入继续计时
      let phoneTime = (new Date()).getTime() / 1000 + this.state.CountdownPhone;
      global.storage.save({
        key: 'VerifyPhone' + userNameDB,
        id: 'VerifyPhone' + userNameDB,
        data: phoneTime,
        expires: null
      });
    }
  }


  getDownTime() {
    global.storage.load({
      key: 'VerifyPhone' + userNameDB,
      id: 'VerifyPhone' + userNameDB
    }).then(ret => {
      let news = (new Date()).getTime() / 1000;

      if (ret - news > 0) {
        this.CountdownPhone(parseInt(ret - news));
      }
    });
  }

  getMemberInfo() {
    Toast.hide();
    if (Object.keys(this.props.userInfo.memberInfo).length !== 0) {
      this.setMemberInfo(this.props.userInfo);
    }
  }

  setMemberInfo(val) {
    const memberInfo = val.memberInfo;
    const memberNewInfo = val.memberNewInfo;
    let phoneData = memberInfo.contacts.find(v => v.contactType.toLocaleLowerCase() === 'phone');
    let phoneNum = phoneData.contact.slice(-11);
    let hasName = memberInfo.firstName != '';
    let Names = memberInfo.firstName || '';
    let hasIdentityCard = memberNewInfo.identityCard ? true : false;
    let IdentityCard = memberNewInfo.identityCard || '';
    this.setState({ Names, IdentityCard, hasName, hasIdentityCard, phoneNum });

    let Contacts = memberInfo.contacts || [];
    let phoneTemp = Contacts.find(v => v.contactType === 'Phone');
    let phoneStauts = phoneTemp ? phoneTemp.status != 'Unverified' : false;
    this.setState({
      phoneStauts
    });
  }

  Names(val) {
    let Names = val;
    let isName = false;
    if (nameTest.test(Names)) {
      isName = true;
    }

    this.setState({
      Names,
      isName,
    }, () => {
      this.verify();
    });
  }

  submitName() {
    const { Names, } = this.state;

    const params = {
      key: 'FirstName',
      value1: Names.trim(),
      value2: ''
    };

    Toast.loading('提交中,请稍候...', 2000);
    fetchRequest(ApiPort.Member, 'PATCH', params).then(res => {
      Toast.hide();
      if (res.isSuccess) {
        this.setState({
          isVerifySuccess: true,
          isVerifySuccessText: "提交成功"
        }, () => {
          setTimeout(() => {
            this.setState({
              isVerifySuccess: false,
              isVerifySuccessText: ""
            });
            this.getUserStatus();
          }, 2000);
        });
      } else {
        this.setState({
          isSubmitNameModal: true
        });
        // Toasts.fail('提交失败', 2)
      }
    }).catch(() => {
      Toast.hide();
    });
  }

  getUserStatus() {
    console.log('getUserStatus')
    fetchRequest(ApiPort.Member, 'GET')
      .then(data => {
        let memberInfo = data.result.memberInfo;
        if (memberInfo) {
          let hasName = memberInfo.firstName != '';
          let Names = memberInfo.firstName || '';
          let Contacts = memberInfo.contacts || [];
          let phoneTemp = Contacts.find(v => v.contactType === 'Phone');
          let phoneStauts = phoneTemp ? phoneTemp.status != 'Unverified' : false;

          this.setState({
            hasName,
            Names,
            phoneStauts
          });
          if (memberInfo.firstName && phoneStauts) {
            Toasts.success("验证成功", 2);
            // this.props.checkMember()
            this.setState({ isSuccess: true, });
            setTimeout(() => {
              //成功后要求3秒后返回
              Actions.home1();
              Actions.DepositCenter({ from: 'GamePage' });
            }, 3000);
          }
        }
      })
      .catch(() => {
      });
  }

  IdentityCard(val) {
    let IdentityCard = val;
    let isIdentityCard = false;
    if (IdentityCardReg.test(IdentityCard)) {
      isIdentityCard = true;
    }

    this.setState({
      IdentityCard,
      isIdentityCard,
    }, () => {
      this.verify();
    });
  }

  otherBankName(val) {
    let isOtherBankName = false;
    if (bankNameTest.test(val)) {
      isOtherBankName = true;
    }
    this.setState({ otherBankName: val, isOtherBankName }, () => {
      this.verify();
    });
  }

  bankCard(val) {
    let isbankCard = false;
    if (bankTest.test(val)) {
      isbankCard = true;
    }
    this.setState({
      bankCard: val,
      isbankCard
    }, () => {
      this.verify();
    });
  }

  verify() {
    const st = this.state;
    let nameVerify = false;
    let isBankName = st.activeBank == '其他银行' ? (st.otherBankName && st.isOtherBankName) : st.activeBank;
    // if (st.Names && st.isName && st.IdentityCard && st.isIdentityCard && st.bankCard && isBankName) {
    if (st.Names && st.isName && st.bankCard && st.isbankCard && isBankName) {
      nameVerify = true;
    }
    this.setState({ nameVerify });
  }

  getWithdrawalLbBankAction() {
    global.storage.load({
      key: 'WithdrawalsLbBanks',
      id: 'WithdrawalsLbBanks'
    }).then(data => {
      this.setState({
        bankList: data
      });
    }).catch(() => {
    });

    fetchRequest(window.ApiPort.PaymentDetails + '?transactionType=Withdrawal&method=LB&isMobile=true&', 'GET')
      .then(data => {
        const res = data.result;
        let list = res.banks || false;
        if (list && list.length > 0) {
          list.push({ Name: '其他银行' });
          this.setState({ bankList: list });
          global.storage.save({
            key: 'WithdrawalsLbBanks',
            id: 'WithdrawalsLbBanks',
            data: list,
            expires: null
          });
        }
      }).catch((err) => {
      Toast.hide();
    });
  }

  //获取用户信息
  getMember() {
    this.getMemberInfo();
    fetchRequest(ApiPort.Member, 'GET')
      .then(data => {
        if (data) {
          this.setMemberInfo(data);
          this.props.userInfo_updateMemberInfo(data.result);
        }
      })
      .catch(() => {
      });
  }

  nameIdBankBtn() {
    //提交姓名银行卡信息
    if (!this.state.nameVerify) {
      return;
    }

    PiwikEvent('Verification', 'Submit', 'Realname_ID_Bankcard_DepositPage');
    if (!BankCardPhoneVerify) {
      //step2没有验证手机去获取验证码，已经验证跳过
      this.getPhoneCode(true);
      return;
    }
    this.setState({ nameBankOtpModal: false });
    let MemberData = {
      realName: this.state.Names,
      // identityCard: this.state.IdentityCard,
      bankName: this.state.activeBank == '其他银行' ? this.state.otherBankName : this.state.activeBank,
      accountNumber: this.state.bankCard
    };
    Toast.loading("提交中,请稍候...", 200);
    fetchRequest(ApiPort.BankCardVerification, 'POST', MemberData).then(data => {
      Toast.hide();
      if (data.isSuccess) {
        if (this.props.isWithdrawal) {
          Actions.home1();
          Actions.withdrawal({ from: 'GamePage' });
          return;
        }
        Actions.home1();
        Actions.DepositCenter({ from: 'GamePage' });
      } else {
        this.nameIdBankBtnCatch(data);
      }
    }).catch(error => {
      Toast.hide();
      this.nameIdBankBtnCatch(error);
      const description = error.errors[0].description || "";
      Toasts.fail(description, 1);
    });
  }

  nameIdBankBtnCatch = (error) => {
    if (error.errors && error.errors[0] && error.errors[0].errorCode === 'PII00702') {
      Actions.RestrictPageWithCS({ from: 'accountProblem', RetryAfter: '' });
    } else {
      this.setState({ nameBankErr: true });
    }
  }


  getVerifyTimes() {
    //获取剩余次数
    Toast.loading("加载中...", 100);
    fetchRequest(ApiPort.VerificationAttempt + `?serviceAction=${this.state.serviceAction}&channelType=SMS&`, "GET")
      .then(data => {
        Toast.hide();
        const res = data.result;
        this.setState({ verifyTimes: res && res.attempt });
        if (res.attempt == 0) {
          this.setState({ phoneType: 3 });
        } else {
          this.getExpiredAt();
          this.CustomFlags();
        }
      })
      .catch(() => {
      });
  }

  getExpiredAt() {
    //验证码是否过期
    fetchRequest(ApiPort.ResendAttempt + `?serviceAction=${this.state.serviceAction}&channelType=SMS&`, "GET")
      .then(data => {
        const res = data.result;
        Toast.hide();
        let phoneType = 1;
        if (res.attempt == 0) {
          //没有次数
          phoneType = 3;
        } else {
          phoneType = res.isExpired ? 1 : 2;
          if (res.expiredAt) {
            //检查 OTP 是否过期
            const startDate = new Date(res.expiredAt);
            const endDate = new Date();
            const diffInMills = startDate.getTime() - endDate.getTime();

            // 計算相差多少秒
            const diffInSec = diffInMills / 1000;

            // 是否還在倒數，是的話直接開otp Modal繼續
            if (diffInSec <= 300 && diffInSec > 0) {
              this.CountdownPhone(parseInt(diffInSec));
            }
          }
        }
        this.setState({ phoneType });
      })
      .catch(() => {
      });
  }

  CustomFlags() {
    //是否可以修改手机
    fetchRequest(ApiPort.CustomFlag + 'flagKey=IsPhoneEditable&', 'GET')
      .then(res => {
        if (res.result) {
          this.setState({ isPhoneEditable: res.result.isPhoneEditable });
        }
      })
      .catch(() => {
      });
  }

  phones(val) {
    let phoneNum = val;
    let isPhone = false;
    if (phoneReg.test(phoneNum)) {
      isPhone = true;
    }

    this.setState({
      phoneNum,
      isPhone,
      phoneType: 1,
    });
  }


  getPhoneCode(nameBankOtp) {
    if(this.state.fromType == 'phone') {
      if(this.state.phoneType == 1) {
        PiwikEvent('Verification', 'Request', 'SendCode_Phone_DepositPage')
      } else {
        PiwikEvent('Verification', 'Request', 'ResendCode_Phone_DepositPage')
      }
    }
    // 驗證碼已發送，直接開otp modal
    if (!this.state.getCodePhone) {
      this.setState({ nameBankOtpModal: true });
      return;
    }
    const data = {
      siteId: siteId,
      msIsdn: "86-" + this.state.phoneNum,
      username: userNameDB,
      serviceAction: this.state.serviceAction,
    };
    Toast.loading("发送中...", 100);
    fetchRequest(ApiPort.PhoneVerify, "POST", data)
      .then(res => {
        Toast.hide();
        this.state.isPhoneEditable && this.CustomFlags();

        nameBankOtp && this.getNameBankOtp(res);
        !nameBankOtp && this.getPhoneOtp(res);

        this.CountdownPhone(300);
        this.clearCode();
      })
      .catch(err => {
        Toasts.fail("短信服务异常，请稍后再试", 2);
      });
  }

  getNameBankOtp(res) {
    let nameBankOtpModal = true;
    if (!res.isSuccess) {
      // 发送异常
      let resendCounter = res.result.resendCounter;
      if (resendCounter == 0) {
        //没有发送次数，
        nameBankOtpModal = false;
        this.setState({ phoneType: 3 });
      } else {
        if (!res.result.message.includes('已发送')) {
          //没有“已发送”表示异常
          nameBankOtpModal = false;
          Toasts.fail('网络错误，请稍后重试', 2);
        }
      }
    }
    this.setState({ nameBankOtpModal });
  }

  getPhoneOtp(res) {
    if (!res.isSuccess) {
      // 发送异常
      let resendCounter = res.result.resendCounter;
      if (resendCounter == 0) {
        this.setState({ phoneType: 3 });
        return;
      } else {
        if (res.result.message.includes('已发送')) {
          this.setState({ errModal: true });
        } else {
          Toasts.fail(res.result.message, 2);
        }
      }
    } else {
      Toasts.success("发送成功", 2);
    }
    this.setState({ phoneType: 2 });
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

  checked(code) {
    if (code.length == 6) {
      this.setState({ issubmitBtn: true, verificationCode: code, verifyErr: false });
    } else {
      this.setState({ issubmitBtn: false });
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

  submitBtn(nameBankOtp) {
    if (!this.state.issubmitBtn) {
      return;
    }
    const data = {
      verificationCode: this.state.verificationCode,
      msisdn: '86-' + this.state.phoneNum,
      serviceAction: this.state.serviceAction,
    };

    // 因為是Modal 所以特製一個加載彈窗
    if (nameBankOtp) {
      this.setState({
        PhoneTACLoading: true
      });
    } else {
      Toast.loading('加载中，请稍候...');
    }
    fetchRequest(ApiPort.PhoneTAC, "PATCH", data)
      .then(res => {
        if (nameBankOtp) {
          this.setState({ PhoneTACLoading: false });
        } else {
          Toast.hide();
        }
        if (res) {
          if (!res.result.isVerified) {
            let verifyTimes = res.result.remainingAttempt || this.state.verifyTimes;
            this.setState({ verifyTimes, verifyErr: true });
            if (res.result.remainingAttempt == 0) {
              this.setState({ phoneType: 3, nameBankOtpModal: false });
              return;
            }
            Toasts.fail(res.result.message, 2);
            this.clearCode();
          } else {
            if (nameBankOtp) {
              // 姓名银行otp成功提示,提交姓名银行卡数据，
              this.setState({ isSuccessOtp: true });
              //判断姓名银行卡手机验证是否通过，未登出前就不需要再验证
              BankCardPhoneVerify = true;
              setTimeout(() => {
                this.nameIdBankBtn();
              }, 2000);
              return;
            }
            if (!nameBankOtp) {
              this.setState({
                isVerifySuccess: true,
                isVerifySuccessText: "验证成功"
              }, () => {
                setTimeout(() => {
                  this.setState({
                    isVerifySuccess: false,
                    isVerifySuccessText: ""
                  });
                  this.getUserStatus();
                }, 2000);
              });
              return;
            }
            Toasts.success("验证成功", 2);
            // this.props.checkMember()
            this.setState({ isVerifySuccess: true, });
            setTimeout(() => {
              //成功后要求3秒后返回
              Actions.home1();
              Actions.DepositCenter({ from: 'GamePage' });
            }, 3000);
          }
        } else {
          this.setState({ PhoneTACLoading: false });
          Toasts.fail("短信验证服务异常，请稍后再试", 2);
        }
      })
      .catch(err => {
        this.setState({ PhoneTACLoading: false });
        Toasts.fail("短信验证服务异常，请稍后再试", 2);
      });
  }

  clserPhoneOtp() {
    console.log('clserPhoneOtp');
    //个人信息otp没做前需要设置手机otp参数默认，公用一个api，参数不同
    this.setState({
      getCodePhone: true,
      phoneType: 1,
      verifyTimes: 5,
      codeAgainPhone: false,
      CountdownPhone_minutes: '5:00',
      CountdownPhone: 300,
      verifyErr: false,
      issubmitBtn: false,
      verificationCode: "",
      errCode: 0,
    });
    this.CountdownPhones && clearInterval(this.CountdownPhones);
  }

  skips() {
    this.setState({ nameBankSkip: true });
  }

  nameBankErr() {
    this.setState({
      nameBankErr: false
    }, () => {
      Actions.home1();
      LiveChatOpenGlobe();
    });
  }

  goBack() {
    if (this.state.fromType == 'phone') {
      PiwikEvent('Verification', 'Click', 'Confirm_Skip_Phone_DepositPage');
    } else {
      PiwikEvent('Verification', 'Click', 'Confirm_Skip_PII_DepositPage');
    }
    this.setState({ nameBankSkip: false }, () => {
      Actions.home1();
    });
  }

  render() {
    const {
      IdentityCard,
      isIdentityCard,
      Names,
      isName,
      nameVerify,
      isVerifySuccess,
      isVerifySuccessText,
      fromType,
      hasName,
      phoneType,
      phoneNum,
      codeAgainPhone,
      phoneChange,
      isPhone,
      CountdownPhone_minutes,
      CountdownPhone,
      verifyErr,
      errCode,
      getCodePhone,
      issubmitBtn,
      verifyTimes,
      errModal,
      otherBankName,
      hasIdentityCard,
      bankList,
      bankCard,
      isOtherBankName,
      isbankCard,
      activeBank,
      isShowCtcModal,
      isSuccessOtp,
      isPhoneEditable,
      nameBankSkip,
      nameBankOtpModal,
      codeInputFocus,
      nameBankErr,
      PhoneTACLoading,
      isSubmitNameModal,
      phoneStauts,
    } = this.state;
    console.log('this.state');
    console.log(this.state);
    console.log(phoneStauts);
    console.log(this.props.userInfo);
    return <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
      {/* //跳过姓名银行卡提示 */}
      <Modals
        isVisible={nameBankSkip}
        backdropColor={'#000'}
        backdropOpacity={0.4}
        style={{ justifyContent: 'center', margin: 0, marginLeft: 20 }}
      >
        <View style={[styles.nameBankSkip, { paddingHorizontal: 15 }]}>
          <Image resizeMode='contain' source={require("../../images/warn.png")} style={{ width: 64, height: 64 }}/>
          <Text style={{ color: '#666', lineHeight: 23, textAlign: 'center', paddingTop: 20 }}>
            {fromType == 'phone' ? `请填写您的真实姓名并完成手机号码验证可确保账号安全和存款快速到账。` : '验证成功后可享有更多存款和提款方式。'}
          </Text>
          <View style={styles.otpMsgBtn}>
            <Touch onPress={() => {
              if(fromType == 'phone'){
                PiwikAction.SendPiwik("Confirm_Skip_Phone_DepositPage");
              }else{
                PiwikAction.SendPiwik("Confirm_Skip_PII_DepositPage");
              }
              this.goBack();
            }} style={styles.otpLeftBtn}>
              <Text style={{ color: '#00a6ff', lineHeight: 40, textAlign: 'center' }}>离开</Text>
            </Touch>
            <Touch onPress={() => {
              this.setState({ nameBankSkip: false });
            }} style={styles.otpRightBtn}>
              <Text style={{ color: '#fff', lineHeight: 42, textAlign: 'center' }}>继续验证</Text>
            </Touch>
          </View>
        </View>
      </Modals>
      <Modals
        isVisible={isSubmitNameModal}
        backdropColor={'#000'}
        backdropOpacity={0.4}
        style={{ justifyContent: 'center', margin: 0, marginLeft: 15, }}
      >
        <View style={styles.nameBankSkip}>
          <Image resizeMode='contain' source={require("../../images/warn.png")} style={{ width: 64, height: 64 }}/>
          <Text style={{
            color: '#666',
            lineHeight: 20,
            textAlign: 'center',
            paddingTop: 20,
            fontSize: 13,
            paddingHorizontal: 20
          }}>
            抱歉，目前我们无法提交您的验证， 请稍后再重试或联络在线客服。
          </Text>

          <Touch onPress={() => {
            this.setState({ isSubmitNameModal: false });
          }} style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width * 0.8, marginTop: 15 }}>
            <Text style={{ color: '#fff', lineHeight: 40, textAlign: 'center' }}>知道了</Text>
          </Touch>
        </View>
      </Modals>
      {/* //姓名银行卡验证错误提示 */}
      <Modals
        isVisible={nameBankErr}
        backdropColor={'#000'}
        backdropOpacity={0.4}
        style={{ justifyContent: 'center', margin: 0, marginLeft: 20, }}
      >
        <View style={styles.nameBankSkip}>
          <Image resizeMode='contain' source={require("../../images/warn.png")} style={{ width: 64, height: 64 }}/>
          <Text
            style={{ textAlign: 'center', color: '#333', fontSize: 18, marginTop: 24, fontWeight: 'bold' }}>验证失败</Text>
          <Text style={{ color: '#666', lineHeight: 23, textAlign: 'center', paddingTop: 20, paddingHorizontal: 16 }}>
            个人信息验证失败，建议您重新确认信息后再次 提交，或者联系在线客服协助。
          </Text>
          <View style={styles.otpMsgBtn}>
            <Touch onPress={() => {
              this.nameBankErr();
            }} style={styles.otpLeftBtn}>
              <Text style={{ color: '#00a6ff', lineHeight: 44, textAlign: 'center', fontSize: 16 }}>在线客服</Text>
            </Touch>
            <Touch onPress={() => {
              this.setState({ nameBankErr: false });
            }} style={styles.otpRightBtn}>
              <Text style={{
                color: '#fff',
                lineHeight: 44,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold'
              }}>重新验证</Text>
            </Touch>
          </View>
        </View>
      </Modals>
      {/* 姓名身份证银行卡otp */}
      <Modal visible={nameBankOtpModal} transparent={true} animationType='fade'>
        <KeyboardAwareScrollView>
          <View style={[styles.modalOtp, { height: codeInputFocus ? height * 0.75 : height }]}>
            {
              isSuccessOtp &&
              <View style={styles.isSuccessOtp}>
                <View style={styles.successCenter}>
                  <Image resizeMode="contain" style={{ width: 48, height: 48 }}
                         source={require('../../images/icon-done.png')}/>
                  <Text style={{ fontSize: 18, color: '#000', paddingTop: 25 }}>验证成功</Text>
                </View>
              </View>
            }
            <View style={{ width: width - 30, }}>
              <View style={styles.modalOtpTitle}>
                <Text style={{ color: '#fff', lineHeight: 45, textAlign: 'center', fontSize: 16 }}>信息验证</Text>
              </View>
              <View style={styles.modalOtpCenter}>
                <Text style={styles.modalOtpMsg}>
                  验证码已发送到您的手机{maskPhone4(phoneNum)} 如需任何帮助，请联系 <Text
                  style={{ color: '#00A6FF', textDecorationLine: 'underline' }} onPress={() => {
                  LiveChatOpenGlobe();
                }}>在线客服</Text>。
                </Text>
                <View style={styles.inputCode}>
                  <Text style={{ color: '#999999', lineHeight: 40, fontSize: 12 }}>
                    您还有（<Text style={{ color: '#00A6FF' }}>{verifyTimes}</Text>）次尝试机会
                  </Text>
                  <VerificationCodeInput
                    key={errCode}
                    inputSize={6}//默认value是 6
                    TextInputChange={(value) => {
                      this.checked(value);
                    }}
                    codeInputFocus={(codeInputFocus) => {
                      this.setState({ codeInputFocus });
                    }}
                  />
                  {
                    verifyErr &&
                    <Text style={{
                      color: '#EB2121',
                      fontSize: 11,
                      lineHeight: 25,
                      textAlign: 'center'
                    }}>验证码错误，请确认您输入正确的验证码</Text>
                  }
                  {
                    !getCodePhone &&
                    <Text style={{ color: '#999', fontSize: 12, lineHeight: 30, marginTop: 16 }}>
                      重新发送 {CountdownPhone_minutes}
                    </Text>
                  }
                  {
                    getCodePhone &&
                    <Text style={{ color: '#00A6FF', fontSize: 12, lineHeight: 30, marginTop: 16 }} onPress={() => {
                      this.getPhoneCode(true);
                    }}>
                      重新发送
                    </Text>
                  }
                </View>

                <View style={{ flexDirection: 'row', paddingTop: 20 }}>
                  <Touch style={styles.closeOtp} onPress={() => {
                    this.setState({ nameBankOtpModal: false });
                  }}>
                    <Text style={styles.closeOtpTxt}>取消</Text>
                  </Touch>

                  {PhoneTACLoading ? (
                    <Touch style={{
                      zIndex: 9999,
                      backgroundColor: '#00A6FF',
                      borderRadius: 8,
                      width: (width - 90) * 0.5,
                      lineHeight: 44,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <ActivityIndicator animating size="small" color="#fff"/>
                    </Touch>
                  ) : (
                    <Touch style={{ backgroundColor: issubmitBtn ? '#00A6FF' : '#EFEFF4', borderRadius: 8 }}
                           onPress={() => {
                             this.submitBtn(true);
                           }}>
                      <Text style={[styles.okOtpTxt, { color: issubmitBtn ? '#fff' : '#BCBEC3' }]}>确定</Text>
                    </Touch>
                  )}

                </View>

              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
      {/* 银行名称列表 */}
      <Modal visible={isShowCtcModal} transparent={true} animationType='fade'>
        <TouchableHighlight onPress={() => {
          this.setState({
            isShowCtcModal: false
          });
        }} style={styles.modalCOntainer}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalHeadTitle}>银行名称</Text>
            <ScrollView
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <View>
                <View>
                  {
                    bankList != '' &&
                    bankList.map((v, i) => {
                      return <TouchableOpacity style={styles.bankListstyle}
                                               key={v.id}
                                               onPress={() => {
                                                 this.setState({
                                                   activeBank: v.name,
                                                   isShowCtcModal: false
                                                 }, () => {
                                                   this.verify();
                                                 });
                                               }}
                      >
                        <View>
                          <Text style={{ color: '#999999' }}>{v.name}</Text>
                        </View>

                        <View style={{
                          borderRadius: 10000,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: activeBank == v.name ? '#00A6FF' : '#BCBEC3',
                          width: 20,
                          height: 20,
                          backgroundColor: activeBank == v.name ? '#00A6FF' : '#fff'
                        }}>
                          {
                            activeBank == v.name && <View style={styles.virvleBox}></View>
                          }
                        </View>
                      </TouchableOpacity>;
                    })
                  }
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableHighlight>
      </Modal>
      {/* 手机短信已发送 */}
      <Modal
        animationType='none'
        transparent={true}
        visible={errModal}
        onRequestClose={() => {
        }}
      >
        <View style={styles.errModal}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: '#00A6FF', borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
              <Text style={{ color: '#fff', lineHeight: 40, textAlign: 'center', width: width * 0.8 }}>温馨提醒</Text>
            </View>
            <Text style={{ color: '#222222', lineHeight: 70 }}>验证码已发送,请在5分钟后尝试</Text>
            <Touch onPress={() => {
              this.setState({ errModal: false });
            }} style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width * 0.6 }}>
              <Text style={{ color: '#fff', lineHeight: 40, textAlign: 'center' }}>知道了</Text>
            </Touch>
          </View>
        </View>
      </Modal>
      {/*提交成功*/}
      <Modals
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        hasBackdrop={true}
        backdropColor={'#000'}
        backdropOpacity={0.4}
        isVisible={isVerifySuccess}
        style={{ justifyContent: 'center', alignItems: "center" }}
      >
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          width: 125,
          height: 125,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Image
            resizeMode="stretch"
            source={require("./../../images/icon-done.png")}
            style={{ width: 40, height: 40, marginBottom: 20 }}
          />
          <Text style={{ fontSize: 16, color: '#222222', fontWeight: 'bold' }}>
            {isVerifySuccessText ? isVerifySuccessText : "提交成功"}
          </Text>
        </View>
      </Modals>
      {phoneType !== 3 && (
        <KeyboardAwareScrollView>
          {
            phoneType != 3 &&
            <View style={styles.veifys}>
              <Image resizeMode="contain" style={{ width: 56, height: 56 }}
                     source={require('../../images/bank/DepositVerify.png')}/>
              {
                fromType == 'phone' &&
                <Text style={[styles.titles, {
                  paddingHorizontal: 15,
                  textAlign: 'center'
                }]}>您好，为了您的账户安全，请填写您的真实姓名并验证您的手机号码。真实姓名一旦填写即不能随意更改，请确保您填写的姓名与您银行账户持有者姓名一致，以利存款快速到账</Text>
              }

              {
                fromType == 'nameId' &&
                <Text style={styles.titles}>请确保您在提交前输入正确的信息，以免延误。 </Text>
              }
              {
                fromType == 'nameId' &&
                <Text style={styles.titles}>
                  如需帮助，请联系<Text onPress={() => {
                  LiveChatOpenGlobe();
                }} style={{ color: '#00A6FF' }}>在线客服</Text>
                </Text>
              }
            </View>
          }
          {
            fromType == 'nameId' &&
            <View style={styles.ViewCenter}>

              <View style={styles.centers}>
                <View>
                  <Text style={styles.titale}>持卡人姓名</Text>
                  {
                    !hasName &&
                    <TextInput
                      value={Names}
                      placeholder='持卡人姓名'
                      maxLength={15}
                      onChangeText={val => {
                        this.Names(val);
                      }}
                      placeholderTextColor={'#BCBEC3'}
                      style={[styles.inputView, { borderColor: Names != '' && !isName ? '#EB2121' : '#ccc', }]}/>
                  }
                  {
                    hasName &&
                    <TextInput
                      value={Names.replace(/./g, '*')}
                      editable={false}
                      style={[styles.inputView, { borderColor: '#EFEFF4', backgroundColor: '#EFEFF4', }]}/>
                  }
                  {
                    Names != '' && !isName &&
                    <View style={styles.errView}>
                      <Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 40 }}>格式不正确</Text>
                    </View>
                  }
                </View>

                {/*<View>*/}
                {/*  <Text style={styles.titale}>身份证号码</Text>*/}
                {/*  {*/}
                {/*    !hasIdentityCard &&*/}
                {/*    <TextInput*/}
                {/*      value={IdentityCard}*/}
                {/*      maxLength={18}*/}
                {/*      placeholder='身份证号码'*/}
                {/*      onChangeText={val => {*/}
                {/*        this.IdentityCard(val)*/}
                {/*      }}*/}
                {/*      placeholderTextColor={'#BCBEC3'}*/}
                {/*      style={[styles.inputView, { borderColor: IdentityCard != '' && !isIdentityCard ? '#EB2121' : '#ccc', }]}/>*/}
                {/*  }*/}
                {/*  {*/}
                {/*    hasIdentityCard &&*/}
                {/*    <TextInput*/}
                {/*      value={'************' + IdentityCard.slice(-6)}*/}
                {/*      editable={false}*/}
                {/*      style={[styles.inputView, { borderColor: '#EFEFF4', backgroundColor: '#EFEFF4', }]}/>*/}
                {/*  }*/}
                {/*  {*/}
                {/*    IdentityCard != '' && !isIdentityCard &&*/}
                {/*    <View style={styles.errView}>*/}
                {/*      <Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 40 }}>身份证号码格式错误</Text>*/}
                {/*    </View>*/}
                {/*  }*/}
                {/*</View>*/}

                <View>
                  <Text style={styles.titale}>银行名称</Text>
                  <Touch style={styles.inputView} onPress={() => {
                    this.setState({ isShowCtcModal: true });
                  }}>
                    <Text style={{ color: activeBank != '' ? '#333' : '#BCBEC3', lineHeight: 42 }}>
                      {activeBank != '' ? activeBank : '请选择银行'}
                    </Text>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/down.png")}
                      style={{
                        width: 16,
                        height: 16,
                        position: "absolute",
                        right: 10,
                        top: 11,
                      }}
                    />
                  </Touch>
                  {
                    activeBank == '其他银行' &&
                    <TextInput
                      value={otherBankName}
                      maxLength={35}
                      placeholder='请填写银行名称'
                      onChangeText={val => {
                        this.otherBankName(val);
                      }}
                      placeholderTextColor={'#BCBEC3'}
                      style={[styles.inputView, {
                        borderColor: otherBankName != '' && !isOtherBankName ? '#EB2121' : '#ccc',
                        marginTop: 8
                      }]}
                    />
                  }
                  {
                    otherBankName != '' && !isOtherBankName &&
                    <View style={styles.errView}>
                      <Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 40 }}>格式不正确</Text>
                    </View>
                  }
                </View>

                <View>
                  <Text style={styles.titale}>银行卡号</Text>
                  <TextInput
                    value={bankCard}
                    maxLength={19}
                    keyboardType='number-pad'
                    placeholder='银行卡号'
                    onChangeText={val => {
                      this.bankCard(val);
                    }}
                    placeholderTextColor={'#BCBEC3'}
                    style={[styles.inputView, { borderColor: bankCard != '' && !isbankCard ? '#EB2121' : '#ccc' }]}/>
                  {
                    bankCard != '' && !isbankCard &&
                    <View style={styles.errView}>
                      <Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 40 }}>银行卡号为14到19位数字</Text>
                    </View>
                  }
                </View>
              </View>
              <Touch style={{
                backgroundColor: nameVerify ? '#00A6FF' : '#E1E1E6',
                borderRadius: 8,
                width: width - 30,
                marginTop: 20
              }} onPress={() => {
                PiwikAction.SendPiwik("VerifyOTP_Phone_DepositPage");
                this.nameIdBankBtn();
              }}>
                <Text style={{
                  color: nameVerify ? '#fff' : '#BBBBBB',
                  textAlign: 'center',
                  lineHeight: 40,
                  fontSize: 16
                }}>提交</Text>
              </Touch>
            </View>
          }
          {
            fromType == 'phone' &&
            <View style={styles.ViewCenter}>
              <View style={styles.ViewCenter}>
                <View style={styles.centers}>
                  <Text style={styles.titalePhone}>真实姓名</Text>
                  <Text style={{ color: '#666', lineHeight: 21, fontSize: 12 }}>请正确输入您的真实姓名, 当前信息将用于核实您日后的存款账户。</Text>

                  <View style={[styles.phoneNum, { marginBottom: 0 }]}>
                    <TextInput
                      value={hasName ? '***' : Names}
                      placeholder='姓名'
                      maxLength={15}
                      onChangeText={val => {
                        this.Names(val);
                      }}
                      placeholderTextColor={'#999'}
                      style={{
                        color: '#000',
                        backgroundColor: hasName ? '#F3F3F3' : '#fff',
                        borderColor: hasName ? '#F3F3F3' : '#CCCCCC',
                        borderWidth: hasName ? 0 : 1,
                        width: (width - 80) * .7 + 15,
                        height: 44,
                        borderRadius: 6,
                        paddingLeft: 15
                      }}
                      editable={!hasName}
                      onFocus={() => {
                        // this.setState({ phoneNum: '', phoneChange: true, phoneType: 1, isPhone: false })
                      }}/>
                    {
                      hasName
                        ?
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image
                            resizeMode="stretch"
                            source={require("./../../images/icon-done.png")}
                            style={{ width: 20, height: 20, marginRight: 5 }}
                          />
                          <Text style={{ fontSize: 12, color: '#222222', fontWeight: 'bold' }}>提交成功</Text>
                        </View>
                        :
                        <Touch onPress={() => {
                          (Names.length > 0 && isName) && this.submitName();
                        }} style={[styles.getPhones, {
                          backgroundColor: (Names.length > 0 && isName) ? '#00A6FF' : '#F3F3F3'
                        }]}>
                          <Text style={{
                            textAlign: 'center',
                            color: (Names.length > 0 && isName) ? '#FFFFFF' : '#BCBEC3',
                            lineHeight: 44
                          }}>提交</Text>
                        </Touch>
                    }
                  </View>

                  {
                    Names != '' && !isName &&
                    <View style={[styles.errView, { width: (width - 80) * .7 + 15, marginTop: 0 }]}>
                      <Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 40, fontWeight: "600" }}>真实姓名格式错误</Text>
                    </View>
                  }
                </View>
              </View>
              <View style={styles.centers}>
                {
                  (phoneType == 1 || phoneType == 2) &&
                  <View>
                    <Text style={styles.titalePhone}>验证您的手机号</Text>
                    <Text style={{ color: '#666', lineHeight: 21, fontSize: 12 }}>确认您的手机号码，然后选择通过短信接受一次性密码。</Text>
                    <View style={styles.phoneNum}>
                      <View style={styles.phoneTitle}>
                        <Text style={{ textAlign: 'center', color: '#000', lineHeight: 44 }}>+86</Text>
                      </View>
                      {
                        isPhoneEditable ?
                          <View style={styles.phonesInput}>
                            <TextInput
                              value={phoneChange ? phoneNum : maskPhone4(phoneNum)}
                              placeholder='手机号码'
                              maxLength={11}
                              onChangeText={val => {
                                let newVal = val.replace(/[^\d]/g,'');
                                this.phones(newVal);
                              }}
                              placeholderTextColor={'#999'}
                              // keyboardType="number-pad"
                              textContentType="telephoneNumber"
                              keyboardType="phone-pad"
                              style={{ width: (width - 80) * 0.48, color: '#000' }}
                              onFocus={() => {
                                this.setState({ phoneNum: '', phoneChange: true, phoneType: 1, isPhone: false });
                              }}/>
                          </View>
                          :
                          <View style={styles.phones}>
                            <Text style={{ color: '#000', lineHeight: 44 }}>{maskPhone4(phoneNum)}</Text>
                          </View>
                      }
                      {
                        phoneStauts
                          ?
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                              resizeMode="stretch"
                              source={require("./../../images/icon-done.png")}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            <Text style={{ fontSize: 12, color: '#222222', fontWeight: 'bold' }}>验证成功</Text>
                          </View>
                          :
                          <View>
                            {
                              !isPhone &&
                              <View style={[styles.getPhones, { backgroundColor: '#F3F3F3' }]}>
                                <Text style={{ textAlign: 'center', color: '#BBBBBB', lineHeight: 44 }}>发送</Text>
                              </View>
                            }
                            {
                              getCodePhone && isPhone &&
                              <Touch onPress={() => {
                                this.getPhoneCode();
                                if(codeAgainPhone){
                                  PiwikAction.SendPiwik("ResendCode_Phone_DepositPage");
                                  return;
                                }
                                PiwikAction.SendPiwik("SendCode_Phone_DepositPage");
                              }} style={styles.getPhones}>
                                <Text style={{
                                  textAlign: 'center',
                                  color: '#fff',
                                  lineHeight: 44
                                }}>{codeAgainPhone ? `重发` : '发送'}</Text>
                              </Touch>
                            }
                            {
                              !getCodePhone &&
                              <Touch onPress={() => {
                                this.getPhoneCode();
                              }} style={[styles.getPhones, { backgroundColor: '#F3F3F3' }]}>
                                <Text style={{
                                  textAlign: 'center',
                                  color: '#BCBEC3',
                                  lineHeight: 44
                                }}>重发 {CountdownPhone_minutes}</Text>
                              </Touch>
                            }
                          </View>
                      }
                    </View>
                    {
                      phoneNum != '' && !isPhone &&
                      <View style={[styles.errView, { marginTop: 0 }]}>
                        <Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 40 }}>请输入正确的手机号</Text>
                      </View>
                    }
                    <Text
                      style={{ color: '#666', lineHeight: 21, fontSize: 12, paddingBottom: 15 }}>如果您想更新手机号码，请联系我们的<Text
                      onPress={() => {
                        LiveChatOpenGlobe();
                      }} style={{ color: '#00ADEF', textDecorationLine: 'underline' }}>在线客服</Text></Text>
                  </View>
                }
                {
                  phoneType == 2 && !phoneStauts &&
                  <View style={styles.inputCode}>
                    <Text style={{ lineHeight: 35, textAlign: 'center', color: '#000' }}>
                      输入发送到手机号的验证码
                    </Text>
                    <Text style={styles.activeMsg}>注意：如果您在5分钟内未收到验证码， </Text>
                    <Text style={styles.activeMsg}>请点击重新发送验证码以获取一个新的验证码。</Text>
                    <VerificationCodeInput
                      key={errCode}
                      inputSize={6}//默认value是 6
                      TextInputChange={(value) => {
                        this.checked(value);
                      }}
                    />
                    {
                      verifyErr &&
                      <View style={{ backgroundColor: '#FEE5E5', borderRadius: 5, marginTop: 10, width: width - 90 }}>
                        <Text style={{
                          color: '#EB2121',
                          fontSize: 11,
                          lineHeight: 35,
                          textAlign: 'center'
                        }}>验证码有误，请检查并确保您输入了正确的验证码。</Text>
                      </View>
                    }
                    <Text style={{ color: '#999999', lineHeight: 40, fontSize: 12 }}>
                      您还有（<Text style={{ color: '#00A6FF' }}>{verifyTimes}</Text>）次尝试机会
                    </Text>
                    <Touch style={issubmitBtn ? styles.addBtn : styles.addBtnAgain} onPress={() => {
                      this.submitBtn();
                      PiwikEvent('Verification', 'Submit', 'VerifyOTP_Phone_DepositPage');
                    }}>
                      <Text style={{
                        color: issubmitBtn ? '#fff' : '#BBBBBB',
                        textAlign: 'center',
                        lineHeight: 45
                      }}>验证</Text>
                    </Touch>
                  </View>
                }
              </View>
            </View>
          }
          {
            phoneType != 3 &&
            <Touch onPress={() => {
              this.skips();
            }}>
              <Text style={{
                textAlign: 'center',
                fontSize: 16,
                color: '#00ADEF',
                padding: 20,
                fontWeight: 'bold'
              }}>跳过验证</Text>
            </Touch>
          }
        </KeyboardAwareScrollView>
      )}

      {/*超過嘗試次數*/}
      {
        phoneType == 3 &&
        <View style={styles.phoneErr}>
          <View style={{
            // padding: 20,
            // paddingTop: 80,
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image resizeMode='stretch' source={require('../../images/warn.png')} style={{ width: 60, height: 60 }}/>
            <Text style={{
              fontSize: 20,
              color: '#222',
              paddingTop: 35,
              paddingBottom: 20,
              fontWeight: 'bold'
            }}>超过尝试次数</Text>
            <Text style={{ lineHeight: 22, color: '#666666', textAlign: 'center' }}>
              {
                fromType == 'phone' &&
                <Text
                  style={{ lineHeight: 22, color: '#999', textAlign: 'center' }}>{`您已超过5次尝试，请24小时后再尝试或\n联系在线客服。`}</Text>
              }
              {
                fromType == 'nameId' &&
                <Text style={{
                  lineHeight: 22,
                  color: '#999',
                  textAlign: 'center'
                }}>{`您已超过5次尝试，请24小时之后再试。或联系我们的在线客服进行验证`}</Text>
              }
            </Text>
            <Touch style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width - 40, marginTop: 30 }}
                   onPress={() => {
                     LiveChatOpenGlobe();
                   }}>
              <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>联系在线客服</Text>
            </Touch>
          </View>
        </View>
      }
    </View>;
  }

}


const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
});
const mapDispatchToProps = (dispatch) => ({
  userInfo_updateMemberInfo: (data) =>
    dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BankCardVerify);

const styles = StyleSheet.create({
  titles: {
    color: '#666',
    lineHeight: 20,
    fontSize: 14,
  },
  nameBankSkip: {
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 30,
    borderRadius: 10,
    paddingTop: 25,
    paddingBottom: 25,
  },
  otpMsgBtn: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    width: width - 90,
  },
  otpLeftBtn: {
    borderColor: '#00a6ff',
    borderRadius: 5,
    width: (width - 110) * 0.5,
    borderWidth: 1,
  },
  otpRightBtn: {
    backgroundColor: '#00a6ff',
    borderRadius: 5,
    width: (width - 110) * 0.5,
  },
  closeOtpTxt: {
    width: (width - 70) * 0.5,
    lineHeight: 44,
    textAlign: 'center',
    color: '#00A6FF',
    fontSize: 16
  },
  closeOtp: {
    borderWidth: 1,
    borderColor: '#00A6FF',
    borderRadius: 8,
    marginRight: 20,
  },
  okOtpTxt: {
    width: (width - 90) * 0.5,
    lineHeight: 44,
    textAlign: 'center',
    color: '#BCBEC3',
    fontSize: 16,
    fontWeight: 'bold'
  },
  virvleBox: {
    borderRadius: 10000,
    width: 10,
    height: 10,
    backgroundColor: '#fff'
  },
  bankListstyle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 42,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between'
  },
  modalHeadTitle: {
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 25,
    color: '#000000',
    fontWeight: '600'
  },
  modalWrap: {
    backgroundColor: '#EFEFF4',
    paddingTop: 15,
    paddingHorizontal: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 60,
    height: height * .6
  },
  successCenter: {
    width: 161,
    height: 161,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#fff'
  },
  isSuccessOtp: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, .4)',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99999,
  },
  modalOtp: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, .4)',
  },
  modalOtpCenter: {
    backgroundColor: '#fff',
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  modalOtpMsg: {
    color: '#333',
    textAlign: 'center',
    padding: 15,
    lineHeight: 22,
  },
  modalOtpTitle: {
    backgroundColor: '#00A6FF',
    width: width - 30,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  modalCOntainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .4)',
    width,
    height,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10000,
    justifyContent: 'flex-end'
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingBottom: 15,
    width: width * 0.8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0,0.5)",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: "#00A6FF",
    borderRadius: 8,
    width: width - 100,
    marginBottom: 15,
  },
  addBtnAgain: {
    backgroundColor: "#E1E1E6",
    borderRadius: 8,
    width: width - 100,
    marginBottom: 15,
  },
  inputCode: {
    padding: 15,
    backgroundColor:
      '#EFEFF4',
    borderRadius: 10,
    width: width - 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeMsg: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 21,
  },
  phoneErr: {
    flex: 1,
    zIndex: 99,
  },
  phoneTitle: {
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    width: (width - 80) * 0.2,
  },
  phones: {
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    width: (width - 80) * 0.5,
    paddingLeft: 15,
  },
  phonesInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    width: (width - 80) * 0.5,
    paddingLeft: 15,
    height: 42,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  getPhones: {
    backgroundColor: '#35C95B',
    borderRadius: 8,
    width: (width - 80) * 0.3,
  },
  phoneNum: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 10,
  },
  errView: {
    backgroundColor: '#FEE0E0',
    borderRadius: 8,
    paddingLeft: 15,
    marginTop: 10,
  },
  veifys: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 35,

  },
  ViewCenter: {
    padding: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centers: {
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 20,
    width: width - 30
  },
  titale: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 40,
    marginTop: 10,
  },
  titalePhone: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  inputView: {
    borderRadius: 4,
    height: 42,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderColor: '#ccc',
  },
  skipItem: {
    color: '#00a6ff',
    lineHeight: 40,
    textAlign: 'center',
    fontSize: 16,
  },
});
