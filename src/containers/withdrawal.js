import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  TouchableHighlight,
  Image,
  TextInput,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { bankIcons } from './Help/bankIcons';
import PiwikAction from "../lib/utils/piwik";
import FlickerFreeTextInput from './Common/FlickerFreeTextInput';

// import Modal from 'react-native-modal';
import { Toast } from "antd-mobile-rn";
import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
import actions from "$LIB/redux/actions/index";
import { formatMoney } from "../lib/utils/util";
import Modals from "react-native-modal";
import CommonModals from "./Common/Modals";
import { errCodeHandle } from "./Common/ErrorHandle";
import { Toasts } from "./Toast";
import { ACTION_UserInfo_getBalanceAll } from "../lib/redux/actions/UserInfoAction";
import BannerAction from "../lib/utils/banner";
import LoadingBone from "./Common/LoadingBone";
import { getMoneyFormat } from './Common/CommonFnData'
import debounce from "../lib/utils/debounce";

const { width, height } = Dimensions.get("window");
const itemWidth = width - 20;
const newStyle = {};
for (const key in InputItemStyle) {
  //console.log(key)
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === "input") {
      newStyle[key].fontSize = 14;
    }
  }
}
const WithdrawalIcon1 = {
  LB: require("./../images/bank/bankicon/LB.png"),
  CCW: require("./../images/bank/bankicon/CTC.png"),
};
const WithdrawalIcon3 = {
  LB: require("./../images/bank/bankicon/LB1.png"),
  CCW: require("./../images/bank/bankicon/CTC.png"),
};
const WithdrawalIcon1Pik = {
  LB: {
    Category: 'Withdrawal Nav',
    Action: 'Click',
    Name: 'LB_WithdrawPage',
  },
  CCW: {
    Category: 'Withdrawal Nav',
    Action: 'Click',
    Name: 'Crypto_WithdrawPage',

  }
};
const WithdrawalIcon2 = {
  "USDT-TRC20": require("./../images/TRC20.png"),
  "USDT-ERC20": require("./../images/ERC20.png"),
};

const ameverification = {
	'SNC0001': {
		title: '实名验证',
		msg: `您的提款请求无法提交。\n系统检测到您提交的提款帐户名称和帐户验证名称之间存在差异。 请在“个人资料” -“上传文件页面”中上传所需的文件以验证您的身份。\n 如您已上传，请耐心等待。 如需了解更多详情，请联系在线客服。`,
	},
	'SNC0002': {
		title: '待验证通知',
		msg: `您的提款请求无法提交。\n系统检测到您提交的提款帐户名称和帐户验证名称之间存在差异。 请在“个人资料” -“上传文件页面”中上传所需的文件以验证您的身份。\n如您已上传，请耐心等待。 如需了解更多详情，请联系在线客服。`
	},
	'SNC0003': {
		title: '待验证通知',
		msg: `您的提款请求无法提交。\n请耐心等待，您的新银行帐户名称正在验证中。\n如需了解更多详情，请联系在线客服。`
	}
}

class withdrawal extends React.Component {
  constructor(props) {
    super(props);
    // this.onOpenChange = (isOpen) => {
    //   /* tslint:disable: no-console */
    // };
    this.state = {
      CTC_Notice: false,
      CTC_instructions: false,
      checkActive: false,
      exchangeRate: "",
      oneExchangeRate: "",
      AppData: this.props,
      fromWallet: "主账户",
      fromWalletA: [], //来源数据
      fromWalletText: "",
      fromWalletKey: 0, //默认第一个为转入账户
      toWallet: "请选择账户", // 目標選擇
      toWalletKey: "",
      toWalletA: [], //目標總數據
      BonusData: "",
      bonusCouponKEY: 0, // 優惠券
      bonusCoupon: "",
      BonusMSG: "", //優惠提示訊息
      unfinGames: "",
      Sliderss: 0,
      transferType: "",
      money: "",
      prefixMoney: "",
      moneyST: "",
      monMoney: 1,
      maxMoney: 1,
      bonusId: 0,
      toAccount: "SB",
      fromAccount: "MAIN",
      mainTotle: "",
      showPush: false,
      fastActive: 1,
      isloginGuide1: false,
      isloginGuide2: false,
      BtnPosTop1: 0,
      BtnPosTop2: 0,
      BtnPosTop3: 0,
      BtnPosLeft1: 0,
      BtnPosLeft2: 0,
      BtnPosLeft3: 0,
      heights: 0,
      toAccount2: "",
      payMoneyBtn: false,
      UnderMaintenance: false, //一键转账是否维护
      UnderMaintenance1: false,
      UnderMaintenance2: false,
      bonusKey: 0,
      otherWalletListOpen: false, //其他錢包狀態
      otherWalletList: "", //其他帳戶金額
      otherWalletTotal: 0,
      AccountTotalBal: 0, //帳戶總餘額
      SBbalance: 0, //SB餘額
      SbUnderMaintenance: true, //SB維護狀態
      visible: false,
      AboutPopup: false,
      paymentWithdrawal: [],
      paymentWithdrawalType: "LB",
      CoinTypes: [],
      CoinTypesINdex: 0,
      withdrawalsSetting: {
        maxBal: "",
        minBal: "",
      },
      checked: false,
      withdrawalsBtnStatus: false,
      withdrawalsBank: "",
      withdrawalsBankINdex: 0,
      balanceDoubleInfor: [],
      isShowblance: false,
      ctcExchangeRate: "",
      isShowModal: false,
      memberInfo: null,
      WithdrawalverificationIndex: "",
      ctcWalletList: [],
      ctcWalletList2: [],
      ctcWalletListIndex: 0,
      isShowCtcModal: false,
      isShownameverification: '',
      isErrorModal: false,
      untreated: "",
      FirstName: "",
      isDepositModal: false,
      MAINBalance: 0,
      isFocus: false,
      hitKycModal: false,
      kycData: {},
      bannerData: "", // banner
      isShowLbModal: false,

      LBavailableMethods: [],
      LBMethodCode: 0,
      SuggestedAmounts: [],
      SRAmountsActive: 9999,
      LBSRErrModal: false,
      withdrawalData: '',
      moreDepositWithdrawal: false,
      aboutPopup: false
    };
  }

  componentWillMount() {
    //开启竖屏锁定
    window.openOrientation();
    // this.isloginGuide1()
    this.TotalBal();
    // this.Bonus();
    this.getWithdrawalNotification();
    this.getPaymentWithdrawal();
    this.getWithdrawalLbBankAction();
    this.getWithdrawalUserBankAction();
    this.GetCryptoWallet();
    this.getBanner();
    this.checkCustomFlag()
  }

  componentDidMount() {
    this.getUser();
  }

  componentWillUnmount() {
    if (window.openOrien == "orientation") {
      //游戏页面开启转账，关闭客服需要解锁竖屏
      window.removeOrientation();
    }
    //卸载键盘隐藏事件监听
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }
  }

  //isIWMM是否显示更多提款方式
  //User.js,DepositCenter.js, withdrawal.js都是用到	
  checkCustomFlag() {
    fetchRequest(ApiPort.CustomFlag + 'flagKey=IsIWMM&', 'GET')
      .then(data => {
        if (data.isSuccess) {
          let result = data.result
          let isDeposited = result.isDeposited ? result.isDeposited : false
          if (!isDeposited) {
            //去存款弹窗
            this.setState({ isDepositModal: true })
          }
        }
      })
      .catch(() => { })
  }
  //进行姓名银行卡验证添加
  goIWMM() {
    this.setState({ moreDepositWithdrawal: true });
  }

  getBanner() {
    fetch(`${CMS_Domain + ApiPort.CMS_BannerWithdraw}`, {
      method: "GET",
      headers: {
        token: CMS_token,
        Authorization: ApiPort.Token || "",
      },
    })
      .then((response) => (headerData = response.json()))
      .then((data) => {
        this.setState({ bannerData: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //获取用户信息
  getUser() {
    Toast.loading("加载中,请稍候...", 300);
    fetchRequest(window.ApiPort.Member, "GET")
      .then((data) => {
        Toast.hide();
        if (data && data.result) {
          let memberInfo = data && data.result.memberInfo;
          let IdentityCard = memberInfo.documentID;

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

          console.log('memberInfo.isDeposited ', memberInfo.isDeposited);
          if (memberInfo.isDeposited != 1) {
            this.setState({
              isDepositModal: true,
            });
            return;
          }

          console.log(IdentityCard, DOB, Address, phoneStatus, emailStatus);
          if (IdentityCard && DOB && Address && !phoneStatus && !emailStatus) {
            this.setState({ isShowModal: false });
          } else {
            const providers = ['Email', 'SMS']; // BTI, IM, SABA
            let processed = [];

            providers.forEach(function (provider) {
              processed.push(fetchRequest(ApiPort.VerificationAttempt + `?ServiceAction=ContactVerification&channelType=${provider}&`, "GET"));
            });
            Promise.all(processed).then((res) => {
              if (res.find(v => v.attempt == 0)) {
                //手机或者邮箱其中一个，没有次数了，
                Actions.pop();
                Actions.Withdrawalverification({
                  memberInfo: '',
                  getUser: () => { },
                  WithdrawalverificationIndex: 0,
                  isRemainingAttempt: true,
                })
              } else {
                this.setState({
                  isShowModal: true
                })
              }

            })
              .catch(() => { })
          }

          this.setState({
            memberInfo,
            FirstName,
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
            this.setState({
              WithdrawalverificationIndex: 2,
            });
            return;
          }
          if (emailStatus) {
            this.setState({
              WithdrawalverificationIndex: 3,
            });
            return;
          }
        }
      })
      .catch((error) => {
        Toast.hide();
        console.log(error);
      });
  }

  //獲取加密貨幣錢包
  async GetCryptoWallet() {
    // Toast.loading("", 200);
    try {
      const res = await fetchRequest(
        window.ApiPort.CryptoWallet + "?CryptoCurrencyCode=USDT-ERC20&",
        "GET"
      );
      Toast.hide();
      if (res && res.result && res.result.length > 0) {
        // const banks = this.adjustBanks(res);
        this.setState({ ctcWalletList: res.result });
      } else {
        this.setState({ ctcWalletList: [] });
      }
    } catch (error) {
      // 获取失败
    } finally {
      this.setState({ loading: false });
    }

    // Toast.loading("", 200);
    try {
      const res = await fetchRequest(
        window.ApiPort.CryptoWallet + "?CryptoCurrencyCode=USDT-TRC20&",
        "GET"
      );
      Toast.hide();
      if (res && res.result && res.result.length > 0) {
        // const banks = this.adjustBanks(res);
        this.setState({ ctcWalletList2: res.result });
      } else {
        this.setState({ ctcWalletList2: [] });
      }
    } catch (error) {
      // 获取失败
    } finally {
      this.setState({ loading: false });
    }
  }

  getWithdrawalLbBankAction() {
    global.storage
      .load({
        key: "WithdrawalsLbBanks",
        id: "WithdrawalsLbBanks",
      })
      .then((data) => {
        dispatch({ type: "WITHDRAWALLBBANKACTION", data });
      })
      .catch(() => {
        dispatch({ type: "WITHDRAWALLBBANKACTION", data: [] });
      });

    fetchRequest(
      window.ApiPort.PaymentDetails +
      "?transactionType=Withdrawal&method=LB&isMobile=true&",
      "GET"
    )
      .then((res) => {
        if (res.isSuccess) {
          let withdrawalsBank = res.result.banks;

          global.storage.save({
            key: "WithdrawalsLbBanks",
            id: "WithdrawalsLbBanks",
            data: withdrawalsBank,
            expires: null,
          });
          return dispatch({
            type: "WITHDRAWALLBBANKACTION",
            data: withdrawalsBank,
          });
        } else {
          global.storage.save({
            key: "WithdrawalsLbBanks",
            id: "WithdrawalsLbBanks",
            data: [],
            expires: null,
          });
          return dispatch({ type: "WITHDRAWALLBBANKACTION", data: [] });
        }
      })
      .catch((err) => {
        Toast.hide();
        console.log(err);
      });
  }

  getWithdrawalUserBankAction() {
    global.storage
      .load({
        key: "withdrawalsUserBank",
        id: "withdrawalsUserBank",
      })
      .then((data) => {
        dispatch({ type: "WITHDRAWALUSERBANKACTION", data });
      })
      .catch(() => {
        dispatch({ type: "WITHDRAWALUSERBANKACTION", data: [] });
      });

    fetchRequest(
      window.ApiPort.GetMemberBanks + "AccountType=Withdrawal&",
      "GET"
    )
      .then((res) => {
        let withdrawalsBank = res.result;
        let defaultBank = withdrawalsBank.find((v) => v.isDefault);
        if (defaultBank) {
          let defaultBankIndex = withdrawalsBank.findIndex((v) => v.isDefault);
          withdrawalsBank.splice(defaultBankIndex, 1);
          withdrawalsBank.unshift(defaultBank);
        }

        this.setState(
          {
            withdrawalsBank,
          },
          () => {
            this.changeWithdrawalsBtnStatus();
          }
        );

        global.storage.save({
          key: "withdrawalsUserBank",
          id: "withdrawalsUserBank",
          data: withdrawalsBank,
          expires: null,
        });
      })
      .catch((err) => {
        Toast.hide();
        console.log(err);
      });
  }

  changeWithdrawalsBtnStatus() {
    const { paymentWithdrawalType,
      ctcWalletList,
      ctcWalletList2,
      CoinTypesINdex,
      CoinTypes,
      withdrawalsBank,
      money,
      withdrawalsSetting,
      LBMethodCode,
    } = this.state;
    const { minBal, maxBal } = withdrawalsSetting;

    let moneyFlag = money.length > 0 && money >= minBal && money <= maxBal;
    let withdrawalsBtnStatus = false;
    if (paymentWithdrawalType == 'LB') {
      // if(LBMethodCode == 'FastProcessing') {
      // 	withdrawalsBtnStatus = Array.isArray(withdrawalsBank) && withdrawalsBank.length > 0
      // } else {
      withdrawalsBtnStatus = moneyFlag && Array.isArray(withdrawalsBank) && withdrawalsBank.length > 0;
      //}
    } else {
      if (CoinTypes[CoinTypesINdex] == 'USDT-ERC20') {
        withdrawalsBtnStatus = moneyFlag && ctcWalletList.length > 0;
      } else {
        withdrawalsBtnStatus = moneyFlag && ctcWalletList2.length > 0;
      }
    }

    this.setState({
      withdrawalsBtnStatus,
      moneyFlag
    });
  }

  //
  getWithdrawalNotification() {
    return fetchRequest(
      `${window.ApiPort.WithdrawalNotification}withdrawalAmount=${this.state.money || 0
      }&`,
      "GET"
    );
  }

  getPaymentWithdrawal() {
    //this.getPhoneEmailVerify(this.props.memberInforData)
    // global.storage.load({
    // 	key: 'paymentWithdrawal',
    // 	id: 'paymentWithdrawal'
    // }).then(data => {
    // 	this.setState({
    // 		paymentWithdrawal: data
    // 	})
    // }).catch(() => {
    // 	// Toast.loading('加载中,请稍候...', 2000)
    // })

    fetchRequest(window.ApiPort.Payment + '?transactionType=Withdrawal&', 'GET').then(res => {
      if (res) {
        Toast.hide();
        let paymentWithdrawal = res.result.paymentMethods;
        let CCWpaymentWithdrawal = paymentWithdrawal.find(v => v.code == "CCW");
        let LBpaymentWithdrawal = paymentWithdrawal.find(v => v.code == "LB");
        if (CCWpaymentWithdrawal) {
          //CCW渠道,没有CoinTypes，paymentWithdrawal只使用LB
          if (CCWpaymentWithdrawal.availableCoinTypes && CCWpaymentWithdrawal.availableCoinTypes.coinTypes) {
            this.setState({
              CoinTypes: CCWpaymentWithdrawal.availableCoinTypes.coinTypes
            });
          } else {
            paymentWithdrawal = paymentWithdrawal.filter(v => v.code != 'CCW');
          }
        }
        let LBavailableMethods = [];
        let LBMethodCode = '';
        if (LBpaymentWithdrawal) {
          //LB渠道
          LBavailableMethods = LBpaymentWithdrawal.availableMethods ? LBpaymentWithdrawal.availableMethods : [];
          LBMethodCode = LBavailableMethods[0] ? LBavailableMethods[0].methodCode : '';
        }
        this.setState({
          paymentWithdrawal,
          LBavailableMethods,
          LBMethodCode,
        });

        this.getWithdrawsDetail(paymentWithdrawal[0].code, LBMethodCode);
        if (LBMethodCode == 'FastProcessing') {
          PiwikEvent('Withdrawal Nav', 'Click', 'SmallRiver_WithdrawalPage');
        } else if (LBMethodCode == 'NormalProcessing') {
          PiwikEvent('Withdrawal Nav', 'Click', 'LB_WithdrawPage');
        }
        global.storage.save({
          key: "paymentWithdrawal",
          id: "paymentWithdrawal",
          data: res,
          expires: null,
        });
      }
    }).catch((err) => {
      Toast.hide();
      console.log(err);
    });
  }

  getWithdrawsDetail(paymentWithdrawalType) {
    console.log('getWithdrawsDetail')
    this.setState({
      paymentWithdrawalType,
      withdrawalsSettingFlag: false,
      money: "",
      ctcWalletListIndex: 0,
      withdrawalsBtnStatus: false,
      withdrawalsSetting: {
        maxBal: "",
        minBal: "",
      },
      SRAmountsActive: 9999,
      isFocus: false,
    });
    Toast.loading("加载中,请稍候...", 2000);
    let urls = window.ApiPort.PaymentDetails + '?transactionType=Withdrawal&method=' + paymentWithdrawalType + '&isMobile=true&';
    if (paymentWithdrawalType == 'LB') {
      //小额提款
      urls = window.ApiPort.PaymentDetails + '?transactionType=Withdrawal&method=LB&methodCode=' + 'DEFAULT' + '&isMobile=true&';
    }
    fetchRequest(urls, 'GET').then(data => {
      const res = data.result;
      Toast.hide();
      //debugger;
      // if (paymentWithdrawalType === 'LB') {
      // 	let bankAddList = res.result.Banks
      // 	this.setState({
      // 		bankAddList
      // 	})
      // 	global.storage.save({
      // 		key: 'WithdrawalsLbBanks',
      // 		id: 'WithdrawalsLbBanks',
      // 		data: bankAddList,
      // 		expires: null
      // 	})
      // }
      this.setState({
        withdrawalsSetting: res.setting,
        //SuggestedAmounts,
      });
      if (paymentWithdrawalType == 'CCW') {
        this.CTC_NoticeCheck();
        this.getWithdrawsDetail1(0);
      } else if (paymentWithdrawalType == 'LB') {
        this.setState({
          SuggestedAmounts: res.suggestedAmounts
        });
      }
    })
      .catch((err) => {
        Toast.hide();
        console.log(err);
      });

    let tempWithdrawalIcon1Pik = WithdrawalIcon1Pik[paymentWithdrawalType];
    tempWithdrawalIcon1Pik &&
      PiwikEvent(
        tempWithdrawalIcon1Pik.Category,
        tempWithdrawalIcon1Pik.Action,
        tempWithdrawalIcon1Pik.Name
      );
  }

  //获取所以账户
  TotalBal() {
    if (this.state.transferType == "") {
      //普通转账刷新下拉列表标题
      this.setState({
        allBalance: [],
        fromWalletA: [],
        toWalletA: [],
        BonusData: "",
      });
    }
    fetchRequest(window.ApiPort.Balance, "GET").then((data) => {
      if (data && data.result && data.result.length > 0 && data.result[0].name) {
        let res = data.result;
        let allBalance = this.balanceSort(res);
        let MAINBalance = res.find(
          (v) => v.name.toLocaleUpperCase() == "MAIN"
        ) || { balance: 0 };
        this.setState(
          {
            MAINBalance: MAINBalance.balance,
            allBalance,
            fromWalletA: allBalance,
            toWalletA: allBalance, //默认转入账户为第一个主账户
            AccountTotalBal: res.find((v) => v.name === "TotalBal").balance,
            otherWalletList: res.filter(
              (v) =>
                (v.state === "UnderMaintenance" || v.balance !== 0) &&
                v.name !== "SB" &&
                v.name !== "TotalBal"
            ),
            SBbalance: res.find((v) => v.name === "SB").balance, //SB 餘額
            SbUnderMaintenance:
              res.find((v) => v.name === "SB").state === "UnderMaintenance", //SB維護狀態
            maxMoney: allBalance[0].balance, //转账最大金额
          },
          () => {
            this.calcOtherWalletTotal();
          }
        );
        let MAINMoney = allBalance.filter((item) => {
          return item.name == "MAIN";
        });
        this.props.userInfo_updateBalance(MAINMoney[0].balance);
      }
    });
  }

  calcOtherWalletTotal = () => {
    const { otherWalletList } = this.state;
    if (!otherWalletList.length) {
      this.setState({
        otherWalletTotal: 0,
      });
      return;
    }
    const otherBal = otherWalletList.reduce(function (a, b) {
      return { balance: a.balance + b.balance };
    }).balance;

    this.setState({
      otherWalletTotal: otherBal,
    });
  };

  //去除总余额，把主账户放到第一个
  balanceSort(list) {
    let MAIN = [];
    let all = [];
    all = list.filter((item) => {
      item.nameMoney = item.localizedName + " ￥" + item.balance;
      if (item.name === "MAIN") {
        MAIN = item;
      }
      return item.name !== "TotalBal" && item.name !== "MAIN";
    });
    this.setState({ mainTotle: MAIN, toAccount2: all[0].name }); //获取主账户,和获取一键转账第一个默认值
    all.unshift(MAIN);
    return all;
  }

  getWithdrawsDetail1(CoinTypesINdex) {
    this.setState(
      {
        CoinTypesINdex,
        ctcWalletListIndex: 0,
      },
      () => {
        this.CryptoExchangeRate(this.state.CoinTypes[CoinTypesINdex]);
      }
    );
  }

  //獲取加密貨幣匯率
  CryptoExchangeRate(CurrencyTo, moneyChange = false) {
    !moneyChange && Toast.loading("加载中...", 200);
    fetchRequest(
      window.ApiPort.CryptoExchangeRate +
      `currencyFrom=CNY&CurrencyTo=${CurrencyTo}&baseAmount=${this.state.money || 1
      }&`,
      "GET"
    )
      .then((res) => {
        Toast.hide();
        let data = res.result;
        if (res.isSuccess) {
          if (data.tiersExchangeRate) {
            //两个汇率
            this.setState({ exchangeRate: data }, () => {
              this.getUsdtNum();
            });
          } else {
            //单汇率
            this.setState({ oneExchangeRate: data });
          }
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  closePopver() {
    this.setState({
      AboutPopup: this.state.AboutPopup == false ? true : false,
    });
  }

  accountDropdown(item, index) {
    let flag = this.state.withdrawalsBankINdex * 1 === index * 1;
    return (
      <TouchableOpacity
        style={[
          styles.toreturnModalDropdownList,
          {
            backgroundColor: true
              ? flag
                ? "#25AAE1"
                : "#fff"
              : flag
                ? "#25AAE1"
                : "#212121",
          },
        ]}
        key={index}
      >
        <Text
          style={[
            styles.toreturnModalDropdownListText,
            { color: true ? (!flag ? "#000" : "#fff") : "#fff" },
          ]}
        >
          {item.bankName} - **************{item.accountNumber.slice(-3)}
        </Text>
      </TouchableOpacity>
    );
  }
  
  
  checkPrefixAmount = () => {
    const { paymentWithdrawalType, money, withdrawalsBtnStatus } = this.state;
    console.log(this.state)
    fetchRequest(
     `${window.ApiPort.ClosestPrefixAmount}transactionType=Withdrawal&amount=${money}&method=${paymentWithdrawalType}&methodCode=DEFAULT&`,
      "GET"
    )
      .then((res) => {
        if(res.isSuccess && res.result.isExist) {
          this.setState({
            isShowLbModal: true,
            prefixMoney: res.result.prefixAmount
          })
        } else {
          withdrawalsBtnStatus && this.withdrawalsBtn();
        }
      })
      .catch((err) => {
        console.log(err)
        withdrawalsBtnStatus && this.withdrawalsBtn();
      });
  }

  async withdrawalsBtn(usePrefixMoney = false) {
    const { withdrawalsBank, money, paymentWithdrawalType, CoinTypes,
      CoinTypesINdex, ctcWalletListIndex, ctcWalletList, ctcWalletList2, MAINBalance,
      withdrawalsBankINdex, withdrawalsBtnStatus, LBMethodCode, prefixMoney } = this.state;
    const withdrawalBank = withdrawalsBank[withdrawalsBankINdex];
    if (!money) {
      Toasts.fail("请输入金额", 1.5);
      return;
    }
    if (money > MAINBalance) {
      Toasts.fail("金额超过主钱包", 1.5);
      return;
    }
    if (!withdrawalsBtnStatus) return;
    let params = {};
    console.log(this.state);
    const passMoney = usePrefixMoney ? prefixMoney : money;
    if (paymentWithdrawalType == "LB") {
      params = {
        language: "zh-cn",
        paymentMethod: "LB",
        charges: 0,
        MemberName: userNameDB,
        RequestedBy: userNameDB,
        amount: passMoney,
        CurrencyCode: "CNY",
        transactionType: "Withdrawal",
        domainName: SBTDomain,
        isMobile: false,
        isSmallSet: false,
        mgmtRefNo: "Fun88MobileApps",
        swiftCode: "Fun88MobileApps",
        bankName: withdrawalBank.bankName,
        address: "",
        city: withdrawalBank.city,
        province: withdrawalBank.province,
        branch: withdrawalBank.branch,
        accountHolderName: withdrawalBank.accountHolderName,
        accountNumber: withdrawalBank.accountNumber,
        methodCode: "DEFAULT"
      };
    } else {
      let temp =
        CoinTypes[CoinTypesINdex] == "USDT-ERC20"
          ? ctcWalletList[ctcWalletListIndex]
          : ctcWalletList2[ctcWalletListIndex];
      params = {
        accountNumber: temp.walletAddress,
        accountHolderName: temp.walletName,
        language: "zh-cn",
        paymentMethod: "CCW",
        amount: passMoney,
        transactionType: "Withdrawal",
        isMobile: true,
        isSmallSet: false,
        ConvertedCurrency: CoinTypes[CoinTypesINdex],
      };
    }
    console.log(params);

    Toast.loading("加载中,请稍候...", 2000);

    // 先看KYC
    const kycStatus = await this.getWithdrawalNotification();
    const kycRes = kycStatus.result[0];
    console.log(kycRes);

    // kycRuleId=4 Hit KYC
    if (kycRes.kycRuleId == 4) {
      this.setState({
        hitKycModal: true,
        kycData: kycRes,
      });
      return;
    }

    fetchRequest(window.ApiPort.PaymentApplications, "POST", params)
      .then((data) => {
        Toast.hide();
        this.TotalBal();
        const res = data.result;
        this.setState({ withdrawalData: res });
        if (data.isSuccess) {
          this.state.checked && this.setDefault(withdrawalBank.bankAccountID);
          Toasts.success("提款请求已成功提交", 2);
          this.setState({
            money: '',
            passMoney: '',
            withdrawalsBtnStatus: false,
            SRAmountsActive: 99999,
          });
          if (LBMethodCode == 'FastProcessing') {
            Actions.pop();
          }
          Actions.withdrawalSuccess({
            activeCode: paymentWithdrawalType,
            payCallback: res,
            amount: passMoney,
            LBMethodCode: LBMethodCode || false,
          })
        } else {
          if (res.errorCode && res.errorCode == "P101103") {
            this.setState({
              untreated: res,
            });
            return;
          }
          let warnings = res.warnings;
          if (Array.isArray(warnings) && warnings.length) {
            let errCode = warnings.map((v) => v.code.toLocaleUpperCase());
            if (errCode.includes("SNC0001")) {
              this.setState({
                isShownameverification: 'SNC0001',
              });
            }
			if (errCode.includes("SNC0002")) {
              this.setState({
                isShownameverification: 'SNC0002',
              });
            }
			if (errCode.includes("SNC0003")) {
              this.setState({
                isShownameverification: 'SNC0003',
              });
            }
			

            if (errCode.includes("P101018")) {
              this.setState({
                isErrorModal: true,
              });
            }
          }
          if (paymentWithdrawalType == 'LB') {
            //LB错误提示
            this.setState({ LBSRErrModal: true });
            return;
          }

          Toasts.fail(res.errorMessage, 2);
        }
      })
      .catch((err) => {
        Toast.hide();
        this.submitErrHandle(err);
        console.log('err', err);
      });
  }

  submitErrHandle = (err) => {
    let warnings = err.errors;
    if (Array.isArray(warnings) && warnings.length) {
      let errCode = warnings.map((v) => v.errorCode.toLocaleUpperCase());
      if (errCode.includes("P101103")) {
        const errData = warnings.filter(v => v.errorCode == 'P101103')[0]
        // console.log('errData1111', errData)
        const untreated = {
          ...errData,
          lastWithdrawalID: err.result.lastWithdrawalID,
          lastWithdrawalAmount: err.result.lastWithdrawalAmount,
        }
        // console.log('errData2222', untreated)
        this.setState({
          untreated: untreated,
        });
        return;
      }
	  
      if (errCode.includes("SNC0001")) {
        this.setState({
          isShownameverification: 'SNC0001',
        });
        return;
      }
	  if (errCode.includes("SNC0002")) {
        this.setState({
          isShownameverification: 'SNC0002',
        });
        return;
      }
	  if (errCode.includes("SNC0003")) {
        this.setState({
          isShownameverification: 'SNC0003',
        });
        return;
      }

      if (errCode.includes("P101018")) {
        this.setState({
          isErrorModal: true,
        });
        return;
      }

      if (warnings[0]) {
        Toast.fail(warnings[0].description, 2);
      }
      return;
    }
  }

  setDefault(id) {
    Toast.loading("加载中,请稍候...", 2000);
    fetchRequest(
      window.ApiPort.PATCHMemberBanksDefault + id + "/SetDefault?",
      "PATCH"
    )
      .then((res) => {
        Toast.hide();
        this.getWithdrawalUserBankAction();
      })
      .catch((error) => {
        Toast.hide();
        console.log(error);
      });
  }

  //一键转账
  fastPayMoney() {
    // let ST = this.state;
    // if (!ST.otherWalletList || ST.otherWalletList.length == 0) { return }
    // if (ST.UnderMaintenance) {
    // 	Toasts.fail("您所选的账户在维护中，请重新选择", 2);
    // 	return;
    // }

    let data = {
      fromAccount: "All",
      toAccount: "MAIN",
      amount: this.state.AccountTotalBal,
      bonusId: 0,
      blackBoxValue: Iovation,
      e2BlackBoxValue: E2Backbox,
      bonusCoupon: "",
    };
    PiwikEvent("Transfer", "Submit", "QuickTransfer_WithdrawalPage");
    Toast.loading("转账中,请稍候...", 200);
    fetchRequest(window.ApiPort.POST_Transfer, "POST", data)
      .then((data) => {
        Toast.hide();
        if (data.isSuccess) {
          this.payAfter(data.result);
        }
      })
      .catch((e) => {
        console.log('catch');
        console.log(e);
        Toasts.fail(e.result.messages, 2);
      });
  }

  //转账后处理
  payAfter(data) {
    console.log('转账后处理');
    this.TotalBal();
    this.props.userInfo_getBalanceSB(true);
    if (data.status != 1) {
      const msg = data.messages || "失败";
      Toasts.fail(msg, 2);
    } else {
      Toasts.success("转账成功", 2);
    }
  }

  getUsdtNum() {
    const { tiersExchangeRate, withdrawableBalances } = this.state.exchangeRate;
    let num = 0,
      whichRate = 0;

    if (tiersExchangeRate["1"] != 0 && tiersExchangeRate["2"] != 0) {
      //两个汇率 都不为0
      if (withdrawableBalances == 0) {
        whichRate = 2;
      } else {
        if (Number(this.state.money) > withdrawableBalances) {
          whichRate = 2;
        }
      }
    }
    // ctcExchangeRate
    this.setState({ whichRate });
  }

  CTC_NoticeCheck() {
    global.storage
      .load({
        key: "CTCNotice",
        id: "CTCNotice",
      })
      .then((ret) => {
      })
      .catch((err) => {
        this.setState({ CTC_Notice: true });
      });
  }

  CTC_Notice() {
    if (this.state.checkActive) {
      global.storage.save({
        key: "CTCNotice",
        id: "CTCNotice",
        data: "CTCNotice",
        expires: null,
      });
    }
  }

  //小额提款金额选择
  LBSRAmountSelect(item, SRAmountsActive) {
    item.isActive && this.setState({ money: item.amount + '', SRAmountsActive }, () => {
      this.changeWithdrawalsBtnStatus();
    });
  }

  // 骨架屏
  paymentWithdrawalLoadingBone = () => {
    return Array.from({ length: 2 }, (v) => v).map((v, i) => {
      return (
        <View key={i} style={{
          width: (width - 90) / 5,
          height: (width - 90) / 5,
          alignItems: "flex-start",
          justifyContent: "flex-start",
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: "#efeff4",
          marginRight: 10,
          paddingVertical: 10,
        }}>
          <LoadingBone />
        </View>
      );
    });
  }

  closePopover() {
    this.setState({
      aboutPopup: this.state.aboutPopup == false ? true : false,
    });
  }

  nameverification() {
	const { withdrawalsBank, withdrawalsBankINdex, isShownameverification } = this.state
	
	if(isShownameverification == 'SNC0001') {
		const accountHolderName = withdrawalsBank[withdrawalsBankINdex].accountHolderName || ''
		fetchRequest(window.ApiPort.AccountHolderName + 'bankHolderName=' + accountHolderName + '&', "POST")
		.then((data) => {
			Actions.UploadFile({
				fromPage: "Withdrawal",
			});
		})
		.catch((e) => {
			Actions.UploadFile({
				fromPage: "Withdrawal",
			});
		});
	}
	this.setState({isShownameverification: ''})

  }

  render() {
    const {
      isFocus,
      CTC_Notice,
      checkActive,
      CTC_instructions,
      allBalance,
      CoinTypes,
      whichRate,
      exchangeRate,
      withdrawalsBtnStatus,
      money,
      checked,
      CoinTypesINdex,
      isShowblance,
      withdrawalsSetting,
      otherWalletListOpen,
      otherWalletList,
      AccountTotalBal,
      paymentWithdrawalType,
      paymentWithdrawal,
      MAINBalance,
      withdrawalsBank,
      withdrawalsBankINdex,
      ctcWalletList,
      ctcWalletList2,
      ctcWalletListIndex,
      isShowCtcModal,
      isShownameverification,
      isErrorModal,
      FirstName,
      untreated,
      oneExchangeRate,
      isDepositModal,
      hitKycModal,
      kycData,
      bannerData,
      isShowModal,
      LBavailableMethods,
      LBMethodCode,
      SuggestedAmounts,
      SRAmountsActive,
      LBSRErrModal,
      isShowLbModal,
      withdrawalData,
      moreDepositWithdrawal,
      isIWMM,
      prefixMoney
    } = this.state;
    // Toast.hide()
    console.log(this.state);
    const PasswordInput = {
      backgroundColor: true ? "#fff" : "#000",
      color: true ? "#3C3C3C" : "#fff",
      borderColor: true ? "#F2F2F2" : "#00AEEF",
    };
    return (
      <View style={{ flex: 1 }}>
        {/* LB,SR错误弹窗，使用errorMessage */}
        <Modals
          isVisible={isShowLbModal}
          backdropColor={'#000'}
          backdropOpacity={0.4}
          style={{ justifyContent: 'center', width: "90%", alignSelf: "center" }}
        >
          <View style={[styles.LBSRErrModal, {paddingHorizontal: 16, paddingTop: 32, paddingBottom: 16}]}>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={require('../images/warn.png')}
                resizeMode='stretch'
                style={{ width: 64, height: 64 }}
              />
            </View>
            <Text style={{ color: '#666', fontSize: 14, textAlign: 'center', paddingVertical: 24 }}>
              快速提款 {prefixMoney} 元，即刻体验推荐金额 ？
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Touch onPress={() => {
                this.setState({ isShowLbModal: false });
                this.withdrawalsBtn();
              }} style={[styles.LBSRErrModalBtn, styles.LBSRErrModalBtn1, { backgroundColor: '#fff', borderColor: '#00A6FF', borderWidth: 1 }]}>
                <Text style={{ color: '#00A6FF', textAlign: 'center', fontSize: 16 }}>取消</Text>
              </Touch>

              <Touch onPress={() => {
                this.setState({
                  isShowLbModal: false
                }, () => {
                  this.withdrawalsBtn(true);
                });
              }} style={[styles.LBSRErrModalBtn, styles.LBSRErrModalBtn1]}>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: "bold" }}>好的</Text>
              </Touch>
            </View>
          </View>
        </Modals>
        {/* 更多存款提款验证 */}
        <Modals
          isVisible={moreDepositWithdrawal}
          backdropColor={'#000'}
          backdropOpacity={0.4}
          style={{ justifyContent: 'center', margin: 0, marginLeft: 15, }}
        >
          <View style={styles.moreOtpModal}>
            <Image resizeMode='contain' source={require("../images/warn.png")} style={{ width: 64, height: 64 }} />
            <Text style={{ color: '#666', lineHeight: 20, textAlign: 'center', paddingTop: 20, fontSize: 14 }}>
              {`提醒您，完成验证后，即可享有更多存款\n和提款方式。`}
            </Text>
            <View style={styles.moreOtpBtn}>
              <Touch onPress={() => { this.setState({ moreDepositWithdrawal: false }) }} style={styles.moreOtpLeftBtn}>
                <Text style={styles.moreOtpItem}>稍后验证</Text>
              </Touch>
              <Touch onPress={() => {
                this.setState({ moreDepositWithdrawal: false }, () => {
                  Actions.pop()
                  Actions.BankCardVerify({ isWithdrawal: true })
                })
              }} style={styles.moreOtpRightBtn}>
                <Text style={[styles.moreOtpItem, { color: '#fff', lineHeight: 42 }]}>立即验证</Text>
              </Touch>
            </View>
          </View>
        </Modals>

        <Modals
          isVisible={LBSRErrModal}
          backdropColor={'#000'}
          backdropOpacity={0.4}
          style={{ justifyContent: 'center', margin: 0, padding: 25 }}
        >
          <View style={styles.LBSRErrModal}>
            <Touch style={styles.modalClose} onPress={() => { this.setState({ LBSRErrModal: false }) }}>
              <Image
                source={require('../images/close.png')}
                resizeMode='stretch'
                style={{ width: 16, height: 16 }}
              />
            </Touch>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20, }}>
              <Image
                source={require('../images/warn.png')}
                resizeMode='stretch'
                style={{ width: 52, height: 52 }}
              />
            </View>
            <Text style={{ color: '#333333', fontSize: 13, lineHeight: 20, textAlign: 'center' }}>
              {Boolean(withdrawalData.errorMessage) ? `${withdrawalData.errorMessage}` : '网络错误，请稍后重试'}
            </Text>
            <View style={{ padding: 15 }}>
              <Touch onPress={() => { this.setState({ LBSRErrModal: false }) }} style={styles.LBSRErrModalBtn}>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 15 }}>我知道了</Text>
              </Touch>
            </View>
          </View>
        </Modals>
        <CommonModals.ExclamationSingleModal
          visible={hitKycModal}
          title={kycData.popMsgTopic || ""}
          desc={kycData.popMsg || ""}
          btnText="马上验证"
          onPress={() => {
            this.setState({
              hitKycModal: false,
            });
            Actions.UploadFile({
              fromPage: "Withdrawal",
            });
          }}
        />
        <Modal visible={isShowCtcModal} transparent={true} animationType="fade">
          <TouchableHighlight
            onPress={() => {
              this.setState({
                isShowCtcModal: false,
              });
            }}
            style={styles.modalOverly}
          >
            <View style={styles.modalOverlyBody}>
              <Text style={styles.modalOverlyBodyText}>
                {paymentWithdrawalType == "LB" ? "钱包地址" : "钱包地址"}
              </Text>
              <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                <View>
                  <View>
                    {paymentWithdrawalType == "LB" ? (
                      <View>
                        {
                          Array.isArray(withdrawalsBank) && withdrawalsBank.length > 0 && withdrawalsBank.map((v, i) => {
                            return <TouchableOpacity style={styles.modalList}
                              onPress={() => {
                                this.setState({
                                  withdrawalsBankINdex: i,
                                  isShowCtcModal: false
                                });
                              }}
                            >
                              <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <Image
                                  resizeMode="stretch"
                                  source={bankIcons[v.bankName] ? bankIcons[v.bankName].imgUrl : require('../images/bank/bankicon/unionpay.png')}
                                  style={{
                                    width: 22,
                                    height: 22,
                                  }}
                                />
                                <Text style={{ color: '#000', paddingLeft: 8 }}>{v.bankName} - **************{v.accountNumber.slice(-3)}</Text>
                              </View>

                              <View style={[styles.virvleBox1, {
                                borderColor: withdrawalsBankINdex == i ? '#00A6FF' : '#BCBEC3',
                                backgroundColor: withdrawalsBankINdex != i ? '#fff' : '#00A6FF'
                              }]}>
                                {
                                  withdrawalsBankINdex == i && <View style={styles.virvleBox}></View>
                                }
                              </View>
                            </TouchableOpacity>;
                          })
                        }

                        {Array.isArray(withdrawalsBank) &&
                          withdrawalsBank.length > 0 &&
                          withdrawalsBank.length < 3 && (
                            <TouchableOpacity
                              style={styles.modalBtnAdd}
                              onPress={() => {
                                this.setState({
                                  isShowCtcModal: false,
                                });

                                Actions.NewBank({
                                  bankType: "W",
                                  fromPage: "withdrawals",
                                  getWithdrawalUserBankAction: () => {
                                    this.getWithdrawalUserBankAction(this);
                                  },
                                });
                              }}
                            >
                              <Text
                                style={{
                                  color: "#00A6FF",
                                }}
                              >
                                添加银行账户
                              </Text>
                            </TouchableOpacity>
                          )}
                      </View>
                    ) : (
                      <View>
                        {(CoinTypes[CoinTypesINdex] == "USDT-ERC20"
                          ? ctcWalletList
                          : ctcWalletList2
                        ).map((v, i) => {
                          return (
                            <TouchableOpacity
                              key={i}
                              style={styles.ctcmodalList}
                              onPress={() => {
                                this.setState({
                                  ctcWalletListIndex: i,
                                  isShowCtcModal: false,
                                });
                              }}
                            >
                              <View>
                                <Text
                                  style={{
                                    color: "#999999",
                                    width: width - 80,
                                  }}
                                >
                                  {v.walletName}
                                </Text>
                                <Text
                                  style={{
                                    color: "#999999",
                                    width: width - 80,
                                  }}
                                >
                                  {v.walletAddress}
                                </Text>
                              </View>

                              <View
                                style={[
                                  styles.virvleBox1,
                                  {
                                    borderColor:
                                      ctcWalletListIndex == i
                                        ? "#00A6FF"
                                        : "#BCBEC3",

                                    backgroundColor:
                                      ctcWalletListIndex != i
                                        ? "#fff"
                                        : "#00A6FF",
                                  },
                                ]}
                              >
                                {ctcWalletListIndex == i && (
                                  <View style={styles.virvleBox}></View>
                                )}
                              </View>
                            </TouchableOpacity>
                          );
                        })}

                        {CoinTypes[CoinTypesINdex] == "USDT-ERC20" &&
                          ctcWalletList.length < 3 && (
                            <TouchableOpacity
                              style={styles.modalBtnAdd}
                              onPress={() => {
                                this.setState({
                                  isShowCtcModal: false,
                                });
                                Actions.CreatWallet({
                                  CoinTypesType: CoinTypes[CoinTypesINdex],
                                  GetCryptoWallet: (v) => {
                                    this.GetCryptoWallet(v);
                                  },
                                });
                              }}
                            >
                              <Text
                                style={{
                                  color: "#00A6FF",
                                }}
                              >
                                添加 USDT-{CoinTypes[CoinTypesINdex]} 钱包地址
                              </Text>
                            </TouchableOpacity>
                          )}

                        {CoinTypes[CoinTypesINdex] == "USDT-TRC20" &&
                          ctcWalletList2.length < 3 && (
                            <TouchableOpacity
                              style={styles.modalBtnAdd}
                              onPress={() => {
                                this.setState({
                                  isShowCtcModal: false,
                                });

                                Actions.CreatWallet({
                                  CoinTypesType: CoinTypes[CoinTypesINdex],
                                  GetCryptoWallet: (v) => {
                                    this.GetCryptoWallet(v);
                                  },
                                });
                              }}
                            >
                              <Text
                                style={{
                                  color: "#00A6FF",
                                }}
                              >
                                添加 USDT-{CoinTypes[CoinTypesINdex]} 钱包地址
                              </Text>
                            </TouchableOpacity>
                          )}
                      </View>
                    )}
                  </View>
                </View>
              </ScrollView>
            </View>
          </TouchableHighlight>
        </Modal>

        <Modal animationType="fade" transparent={true} visible={isShowModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContainer1}>
              <View style={styles.modalContainerHead}>
                <Text style={styles.modalContainerHeadText}>安全认证</Text>
              </View>

              <View
                style={{
                  padding: 15,
                  paddingVertical: 25,
                }}
              >
                <Text
                  style={{
                    marginBottom: 10,
                  }}
                >
                  为了您的账户安全，请先完成以下验证：
                </Text>
                <Text style={{ color: "#666666", marginBottom: 2 }}></Text>
                <Text style={{ color: "#666666", marginBottom: 2 }}>
                  • 验证身份证号码{" "}
                </Text>
                <Text style={{ color: "#666666", marginBottom: 2 }}>
                  • 完善个人资料{" "}
                </Text>
                <Text style={{ color: "#666666", marginBottom: 2 }}>
                  • 验证手机号{" "}
                </Text>
                <Text style={{ color: "#666666", marginBottom: 2 }}>
                  • 验证电子邮箱
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 15,
                  }}
                >
                  <Touch
                    onPress={() => {
                      this.setState({
                        isShowModal: false,
                      });
                      Actions.pop();
                    }}
                    style={{
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#00A6FF",
                      paddingHorizontal: 40,
                    }}
                  >
                    <Text style={{ color: "#00A6FF", fontSize: 15 }}>
                      取消提款
                    </Text>
                  </Touch>
                  <Touch
                    onPress={() => {
                      Actions.pop();
                      console.log(this.state.memberInfo);
                      Actions.Withdrawalverification({
                        memberInfo: this.state.memberInfo,
                        getUser: () => {
                          this.getUser();
                        },
                        WithdrawalverificationIndex:
                          this.state.WithdrawalverificationIndex,
                      });

                      PiwikEvent(
                        "Verification",
                        "Click",
                        "Verify_Account_WithdrawalPage"
                      );
                    }}
                    style={{
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#00A6FF",
                      paddingHorizontal: 40,
                      backgroundColor: "#00A6FF",
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 15 }}>
                      立即验证
                    </Text>
                  </Touch>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={Boolean(isShownameverification)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContainer1,{width: width * 0.8}]}>
				<Touch style={styles.ameverificationClose} onPress={() => { this.setState({isShownameverification: false})}}>
					<Image
						source={require('../images/close.png')}
						resizeMode='stretch'
						style={{ width: 18, height: 18 }}
					/>
				</Touch>
				<View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					<Image
						source={require('../images/warnBlue.png')}
						resizeMode='stretch'
						style={{ width: 52, height: 52,marginTop: 15, }}
					/>
				</View>
				<Text style={styles.ameverificationTitle}>
				{isShownameverification != '' && ameverification[isShownameverification].title}
				</Text>
              <View
                style={{
                  padding: 15,
                  paddingVertical: 25,
                }}
              >
                <Text
                  style={{
                    marginBottom: 10,
					color: '#666666',
					lineHeight: 19,
                  }}
                >
                  {isShownameverification != '' && ameverification[isShownameverification].msg}
                </Text>
                
				{
				isShownameverification == 'SNC0001' &&
					<>
					{withdrawalsBank.length > 0 && (
					<Text style={{ color: "#666666", textAlign: 'center', paddingTop: 8 }}>
						提款账户名:{" "}
						{withdrawalsBank[withdrawalsBankINdex].accountHolderName}
					</Text>
					)}
					<Text style={{ color: "#666666", textAlign: 'center' }}>
					注册姓名: {FirstName}
					</Text>
					<View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 20,
                  }}
                >
                <Touch
					onPress={() => {this.nameverification('')}}
					style={{
					height: 44,
					alignItems: "center",
					justifyContent: "center",
					borderRadius: 6,
					backgroundColor: "#00A6FF",
					width: width * 0.6,
					}}
				>
						<Text style={{ color: "#fff", fontSize: 15 }}>立即验证</Text>
					</Touch>
					</View>
				</>
				}
				{
				isShownameverification == 'SNC0002' &&
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginTop: 20,
					}}
					>
					<Touch
						onPress={() => {
							this.setState({ isShownameverification: '' })
						}}
						style={{
						height: 44,
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 6,
						paddingHorizontal: 28,
						backgroundColor: "#00A6FF",
						}}
					>
						<Text style={{ color: "#fff", fontSize: 15 }}>我已上传</Text>
					</Touch>
					<Touch
						onPress={() => {
							this.setState({ isShownameverification: false }, () => {
								Actions.UploadFile({
									fromPage: "Withdrawal",
								})
							});
						}}
						style={{
						height: 44,
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 6,
						borderWidth: 1,
						borderColor: "#00A6FF",
						paddingHorizontal: 28,
						backgroundColor: "#00A6FF",
						}}
					>
						<Text style={{ color: "#fff", fontSize: 15 }}>
							立即验证
						</Text>
					</Touch>
					</View>
				}

{
					isShownameverification == 'SNC0003' &&
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							marginTop: 20,
						}}
						>
						<Touch
							onPress={() => {this.setState({ isShownameverification: '' })}}
							style={{
							height: 44,
							alignItems: "center",
							justifyContent: "center",
							borderRadius: 6,
							backgroundColor: "#00A6FF",
							width: width * 0.6,
							}}
						>
								<Text style={{ color: "#fff", fontSize: 15 }}>我知道了</Text>
							</Touch>
					</View>
				}
			
              </View>
            </View>
          </View>
        </Modal>

        {/* 提款还没处理提示 */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={untreated != ""}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContainer1}>
              <View style={styles.modalContainerHead}>
                <Text style={styles.modalContainerHeadText}>重要提示</Text>
              </View>

              <View
                style={{
                  padding: 15,
                  paddingVertical: 25,
                }}
              >
                <Text style={{ color: "#666666" }}>
                  请耐心等待，您有一项提款申请正在处理中。
                </Text>
                <View
                  style={{
                    backgroundColor: "#EFEFF4",
                    borderRadius: 10,
                    padding: 20,
                    marginTop: 15,
                    marginBottom: 15,
                  }}
                >
                  <Text style={{ color: "#666666", lineHeight: 30 }}>
                    提款编号：
                    {(untreated.lastWithdrawalID &&
                      untreated.lastWithdrawalID) ||
                      ""}
                  </Text>
                  <Text style={{ color: "#666666", lineHeight: 30 }}>
                    提款金额：
                    {(untreated.lastWithdrawalAmount &&
                      parseFloat(untreated.lastWithdrawalAmount)) ||
                      ""}
                  </Text>
                </View>
                <Text style={{ color: "#666666", marginBottom: 15 }}>
                  请等待处理完毕后，再提交其他提款申请。
                </Text>
                <Touch
                  onPress={() => {
                    this.setState({ untreated: false });
                  }}
                  style={{
                    height: 44,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "#00A6FF",
                    paddingHorizontal: 40,
                    backgroundColor: "#00A6FF",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 15 }}>好的</Text>
                </Touch>
              </View>
            </View>
          </View>
        </Modal>

        <Modal animationType="fade" transparent={true} visible={isErrorModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContainer1}>
              <View style={styles.modalContainerHead}>
                <Text style={styles.modalContainerHeadText}>超过提款限额</Text>
              </View>

              <View
                style={{
                  padding: 15,
                  paddingVertical: 25,
                }}
              >
                <Text style={{ marginBottom: 10 }}>
                  我们注意到您的帐户中存在一些异常活动。请联系在线客服获取帮助。
                </Text>
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
                        isErrorModal: false,
                      });
                    }}
                    style={{
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#00A6FF",
                      paddingHorizontal: 40,
                    }}
                  >
                    <Text style={{ color: "#00A6FF", fontSize: 15 }}>关闭</Text>
                  </Touch>
                  <Touch
                    onPress={() => {
                      this.setState({
                        isErrorModal: false,
                      });
                      LiveChatOpenGlobe();
                    }}
                    style={{
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#00A6FF",
                      paddingHorizontal: 40,
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

        {isDepositModal && (
          <Modal animationType="fade" transparent={true} visible={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContainer1}>
                <View style={styles.modalContainerHead}>
                  <Text style={styles.modalContainerHeadText}>温馨提醒</Text>
                </View>

                <View
                  style={{
                    padding: 15,
                    paddingVertical: 25,
                  }}
                >
                  <Text
                    style={{
                      marginBottom: 10,
                    }}
                  >
                    您还未存款，提款前请先进行存款和游戏。
                  </Text>
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
                          isDepositModal: false,
                        });
                        Actions.pop();
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
                      <Text style={{ color: "#00A6FF", fontSize: 15 }}>取消</Text>
                    </Touch>
                    <Touch
                      onPress={() => {
                        Actions.pop();
                        this.setState({
                          isDepositModal: false,
                        });
                        Actions.DepositCenter();
                        PiwikEvent(
                          "Deposit Nav",
                          "Click",
                          "Deposit_NonDepositor_WithdrawalPage"
                        );
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
                        立即存款
                      </Text>
                    </Touch>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}


        {/* 虚拟币手续费通知 */}
        <Modals
          isVisible={CTC_Notice}
          backdropColor={"#000"}
          backdropOpacity={0.4}
          style={{ justifyContent: "center", margin: 0, marginLeft: 20 }}
          onBackdropPress={() => {
            this.setState({ CTC_Notice: false });
          }}
        >
          {
            <View
              style={[
                styles.secussModal,
                {
                  width: width - 40,
                  borderRadius: 10,
                  padding: 15,
                  paddingTop: 0,
                },
              ]}
            >
              <View
                style={{
                  width: width - 40,
                  backgroundColor: "#00A6FF",
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: "bold",
                    lineHeight: 45,
                    textAlign: "center",
                  }}
                >
                  温馨提示
                </Text>
              </View>
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: 40,
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                加密货币提现手续费
              </Text>
              <Text
                style={{
                  lineHeight: 22,
                  fontSize: 12,
                  color: "#222",
                  marginBottom: 15,
                }}
              >
                从2021/09/22起，当您提现加密货币时，若超过您的加密货币存款总额将会征收手续费。{" "}
              </Text>
              <Text style={{ lineHeight: 22, fontSize: 12, color: "#222" }}>
                您的加密货币余额将根据存款总额减去已提现总额进行计算。
              </Text>
              <Touch
                onPress={() => {
                  this.setState({ checkActive: !this.state.checkActive });
                }}
                style={styles.setPushList}
              >
                <View
                  style={[
                    checkActive ? styles.checkActived : styles.checkActive,
                  ]}
                >
                  {checkActive && (
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
                  )}
                </View>
                <Text style={{ marginLeft: 12, fontSize: 12, color: "#222" }}>
                  不再提示
                </Text>
              </Touch>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Touch
                  onPress={() => {
                    this.setState({ CTC_Notice: false }, () => {
                      this.CTC_Notice();
                    });
                  }}
                  style={{
                    backgroundColor: "#00a6ff",
                    borderRadius: 5,
                    width: width - 70,
                    marginTop: 15,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      lineHeight: 38,
                      textAlign: "center",
                    }}
                  >
                    是的，我知道了
                  </Text>
                </Touch>
              </View>
            </View>
          }
        </Modals>
        {/* 虚拟币手续费说明 */}
        <Modals
          isVisible={exchangeRate != "" && CTC_instructions}
          backdropColor={"#000"}
          backdropOpacity={0.4}
          style={{ justifyContent: "center", margin: 0, marginLeft: 20 }}
          onBackdropPress={() => {
            this.setState({ CTC_instructions: false });
          }}
        >
          {exchangeRate != "" && (
            <View
              style={[
                styles.secussModal,
                {
                  width: width - 40,
                  borderRadius: 10,
                  padding: 15,
                  paddingTop: 0,
                },
              ]}
            >
              <View
                style={{
                  width: width - 40,
                  backgroundColor: "#00A6FF",
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "bold",
                    lineHeight: 45,
                    textAlign: "center",
                  }}
                >
                  换算等值的加密货币
                </Text>
              </View>
              <View style={styles.huiView}>
                <Text style={{ fontSize: 12, color: "#222" }}>提款金额</Text>
                <Text style={{ fontSize: 12, color: "#222" }}>
                  {this.state.money || "0"}元
                </Text>
              </View>
              <View style={styles.ViewBorder}>
                <Text style={[styles.TxtType, { color: "#666" }]}>
                  您的加密货币存款金额一共是{exchangeRate.depositedAmount}元
                </Text>
                <Text style={[styles.TxtType, { color: "#999" }]}>
                  更新时间{exchangeRate.balancesUpdatedAt.replace("T", " ")}
                </Text>
                <View style={{ height: 10, width: 15 }} />

                <Text style={[styles.TxtType, { color: "#666" }]}>
                  您的加密货币提款金额一个是{exchangeRate.withdrawAmount}元
                </Text>
                <Text style={[styles.TxtType, { color: "#999" }]}>
                  更新时间{exchangeRate.balancesUpdatedAt.replace("T", " ")}
                </Text>
                <View style={{ height: 10, width: 15 }} />

                <Text style={[styles.TxtType, { color: "#666" }]}>
                  您的加密货币余额为{exchangeRate.withdrawableBalances}元
                </Text>
                <Text style={[styles.TxtType, { color: "#999" }]}>
                  更新时间{exchangeRate.balancesUpdatedAt.replace("T", " ")}
                </Text>
              </View>
              <View style={{ width: width - 70 }}>
                <Text style={styles.TxtType}>
                  您的加密货币余额将按汇率等级1(免手续费)兑换：
                </Text>
                <Text style={styles.Txt1Type}>
                  {exchangeRate.tiersAmount["1"] || "0"} 元 ={" "}
                  {exchangeRate.tiersExchangeAmount["1"] || "0"}{" "}
                  {exchangeRate.currencyTo}
                </Text>
                <View style={{ height: 10, width: 15 }} />

                <Text style={styles.TxtType}>
                  其余提款金额将按照汇率等级2(征收手续费)兑换：
                </Text>
                <Text style={styles.Txt1Type}>
                  {exchangeRate.tiersAmount["2"] || "0"} 元 ={" "}
                  {exchangeRate.tiersExchangeAmount["2"] || "0"}{" "}
                  {exchangeRate.currencyTo}
                </Text>
                <View style={{ height: 10, width: 15 }} />

                <Text style={styles.TxtType}>您该笔提款的等值加密货币为：</Text>
                <Text style={styles.Txt1Type}>
                  {exchangeRate.convertedAmount} {exchangeRate.currencyTo}
                </Text>
              </View>
              <View
                style={{
                  width: width - 70,
                  backgroundColor: "#FFF5BF",
                  borderRadius: 10,
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: "#83630B",
                    lineHeight: 35,
                    textAlign: "center",
                  }}
                >
                  贴心提醒: 汇率仅供参考，交易将以实时汇率计算
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  width: width - 70,
                }}
              >
                <Touch
                  onPress={() => {
                    this.setState({ CTC_instructions: false }, () => {
                      LiveChatOpenGlobe();
                    });
                  }}
                  style={{
                    borderColor: "#00a6ff",
                    borderRadius: 5,
                    width: (width - 85) / 2,
                    marginTop: 35,
                    borderWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      color: "#00a6ff",
                      lineHeight: 40,
                      textAlign: "center",
                    }}
                  >
                    联系在线客服
                  </Text>
                </Touch>
                <Touch
                  onPress={() => {
                    this.setState({ CTC_instructions: false });
                  }}
                  style={{
                    backgroundColor: "#00a6ff",
                    borderRadius: 5,
                    width: (width - 85) / 2,
                    marginTop: 35,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      lineHeight: 42,
                      textAlign: "center",
                    }}
                  >
                    是的，我知道了
                  </Text>
                </Touch>
              </View>
            </View>
          )}
        </Modals>

        <ScrollView
          style={{ flex: 1, paddingHorizontal: 8 }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {
            // banner
            bannerData && bannerData.length ? (
              !!(bannerData[0].cmsImageUrl) && (
                <View
                  style={{
                    width: itemWidth,
                    justifyContent: "space-between",
                    alignSelf: "center",
                    marginTop: 16,
                  }}
                >
                  <Touch
                    onPress={() => {
                      PiwikEvent("Banner", "Click", `${bannerData[0].title}}_WithdrawPage`);
                      BannerAction.onBannerClick(bannerData[0], "withdrawal")
                    }}
                  >
                    <Image
                      source={{
                        uri: bannerData && bannerData[0].cmsImageUrl,
                      }}
                      style={{
                        width: "100%",
                        height: 69,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "transparent",
                      }}
                      resizeMode="stretch"
                    />
                  </Touch>
                  <Touch
                    onPress={() => {
                      this.setState({ bannerData: "" });
                    }}
                    style={{ position: "absolute", right: 6, top: 2 }}
                  >
                    <Image
                      source={require("../images/icon/closeBlack.png")}
                      style={{ width: 12, height: 12 }}
                    />
                  </Touch>
                </View>
              )
            ) : null
          }
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 16,
              width: "100%"
            }}
          >
            <View style={styles.totalMoneyWrap}>
              <View style={styles.moneyFlex}>
                <View style={styles.moneyWrapA}>
                  <Text style={styles.totalText}>总余额</Text>
                  <Text style={styles.totalText1}>
                    <Text style={{ fontSize: 16 }}>￥</Text>{" "}
                    {formatMoney(AccountTotalBal, 2)}
                  </Text>
                </View>

                <View
                  style={{
                    width: 1,
                    backgroundColor: "#efeff4",
                    right: 20,
                    top: 8,
                    height: 40,
                  }}
                ></View>

                <View style={styles.moneyWrapB}>
                  <Text style={styles.totalText}>主账户</Text>
                  <Text style={styles.totalText1}>
                    <Text style={{ fontSize: 16 }}>￥</Text>{" "}
                    {formatMoney(MAINBalance, 2)}
                  </Text>
                </View>
                <View style={{ right: 10, top: 18 }}>
                  <Touch
                    onPress={() => {
                      this.fastPayMoney();
                    }}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("./../images//transfer/onebutton.png")}
                      style={{ width: 24, height: 24 }}
                    />
                  </Touch>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#EFEFF4",
                  height: 1,
                  width: "90%",
                  alignSelf: "center",
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isShowblance: !isShowblance,
                  });
                  // this.TotalBal();
                }}
                style={[
                  styles.moneyWrap,
                  {
                    flexDirection: "row",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.totalText,
                    { color: "#666", flex: 1, alignItems: "flex-start" },
                  ]}
                >
                  其它钱包
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={[
                      styles.totalText1,
                      { right: 50, alignItems: "flex-end" },
                    ]}
                  >
                    <Text style={{ fontSize: 12 }}>￥ </Text>{" "}
                    {formatMoney(AccountTotalBal - MAINBalance, 2)}
                  </Text>

                  <Image
                    resizeMode="stretch"
                    source={
                      isShowblance
                        ? require("./../images/up.png")
                        : require("./../images/down.png")
                    }
                    style={{
                      width: 16,
                      height: 16,
                      position: "absolute",
                      right: 10,
                    }}
                  />
                </View>
              </TouchableOpacity>

              {otherWalletListOpen && otherWalletList != "" && (
                <TouchableOpacity style={styles.walletList}>
                  {otherWalletList.length
                    ? otherWalletList.map((val, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            // paddingTop: 5,
                            // paddingBottom: 5,
                            width: width * 0.4,
                          }}
                        >
                          <Text style={{ color: "#666", fontSize: 12 }}>
                            {val.localizedName}
                          </Text>
                          {val.state === "UnderMaintenance" ? (
                            <Text>维护中</Text>
                          ) : (
                            <View>
                              <Text style={{ fontWeight: "bold" }}>
                                ￥ {formatMoney(val.balance, 2)}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })
                    : null}
                </TouchableOpacity>
              )}

              {Array.isArray(allBalance) &&
                allBalance.length > 0 &&
                isShowblance && (
                  <View
                    style={{
                      // padding: 10,
                      backgroundColor: "#fff",
                      // borderRadius: 10,
                      paddingTop: 22,
                      // paddingHorizontal: 8,
                      width: "100%",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {allBalance
                      .filter(
                        (v) =>
                          !["TOTALBAL", "MAIN"].includes(
                            v.name.toLocaleUpperCase()
                          )
                      )
                      .map((v, i) => {
                        return (
                          v.balance > 0 && (
                            <View
                              key={i}
                              style={{
                                width: (width - 40) / 2,
                                paddingLeft: 25,
                                marginBottom: 15,
                              }}
                            >
                              <View style={{ flexDirection: "row", }}>
                                <Text
                                  style={{
                                    color: "#666",
                                    fontSize: 12,
                                  }}
                                >
                                  {v.localizedName}
                                </Text>
                                {v.category == "Sportsbook" && (
                                  <>
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.closePopover();
                                      }}
                                      hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                                    >
                                      <Image
                                        resizeMode="stretch"
                                        source={require("../images/transfer/notice.png")}
                                        style={{ width: 14, height: 14, marginLeft: 10 }}
                                      />
                                    </TouchableOpacity>
                                    {this.state.aboutPopup && (
                                      <View style={{ position: "relative", }}>
                                        <View style={styles.Popover}>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.closePopover();
                                            }}
                                            style={styles.PopoverContent}
                                          >
                                            <View style={styles.arrowB} />
                                            <Text
                                              style={{
                                                color: "#fff",
                                                // paddingRight: 5,
                                                fontSize: 12,
                                                lineHeight: 18
                                                // padding: 15,
                                              }}
                                            >
                                              包含 V2 虚拟体育, 沙巴体育, BTI 体育，{"\n"}IM 体育和电竞
                                            </Text>
                                            <Image
                                              resizeMode="stretch"
                                              source={require("../images/closeWhite.png")}
                                              style={{ width: 15, height: 15 }}
                                            />
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                    )}
                                  </>)
                                }
                              </View>
                              <Text
                                style={{
                                  color: "#202939",
                                  fontWeight: "bold",
                                  marginTop: 5,
                                  fontSize: 16,
                                }}
                              >
                                ￥ {formatMoney(v.balance, 2)}
                              </Text>
                            </View>
                          )
                        );
                      })}
                  </View>
                )}
            </View>
          </View>

          {
            <View style={{
              marginBottom: 15,
              width: "100%",
              justifyContent: "center", alignItems: 'center', marginTop: 10
            }}>
              <View style={{ width: "100%", padding: 8, backgroundColor: '#fff', borderRadius: 10 }}>
                <View style={[styles.paymentWithdrawalBox,]}>
                  {
                    Array.isArray(paymentWithdrawal) && paymentWithdrawal.length > 0 ? paymentWithdrawal.map((v, i) => {
                      let flag = paymentWithdrawalType === v.code
                      return <TouchableOpacity key={i}
                        onPress={this.getWithdrawsDetail.bind(this, v.code, LBMethodCode, true)}
                        style={[styles.paymentWithdrawalWrap, {
                          backgroundColor: flag ? '#00A6FF' : '#fff',
                          borderColor: flag ? '#00A6FF' : '#E3E3E8'
                        }]}>
                        {
                          v.isNew && <View style={styles.isNew}>
                            <Text style={styles.isNewTxt}>新</Text>
                          </View>
                        }
                        {
                          v.isFast && <View style={styles.isFast}>
                            <Text style={styles.isNewTxt}>极速</Text>
                          </View>
                        }
                        <Image
                          style={{ width: 22, height: 22, marginTop: 5, marginBottom: 4 }}
                          source={(flag ? WithdrawalIcon3 : WithdrawalIcon1)[v.code]}
                          resizeMode='stretch'></Image>
                        <Text style={[{
                          fontSize: 10,
                          color: flag ? '#FFFFFF' : '#999999'
                        }]}>{v.name}</Text>
                      </TouchableOpacity>
                    }) : this.paymentWithdrawalLoadingBone()
                  }
                </View>
              </View>
            </View>
          }

          {
            paymentWithdrawalType == 'LB' && <View style={{ padding: 8, backgroundColor: '#fff', borderRadius: 10, marginVertical: 10, paddingVertical: 15 }}>
              {
                //LBMethodCode == 'FastProcessing'
                Array.isArray(SuggestedAmounts) && SuggestedAmounts.length > 0 &&
                <View>
                  <Text style={styles.LBTitles}>提款金额</Text>
                  <View style={styles.SRAmounts}>
                    {
                      Array.isArray(SuggestedAmounts) && SuggestedAmounts.length > 0 && SuggestedAmounts[0].amount &&
                      SuggestedAmounts.map((item, index) => {
                        return (
                          <Touch
                            key={index}
                            style={[
                              styles.SRAmountsItem,
                              { backgroundColor: !item.isActive ? '#EFEFF4' : money == item.amount ? '#00A6FF' : '#fff' }
                            ]}
                            onPress={() => { this.LBSRAmountSelect(item, index) }}
                          >
                            <Text style={{ fontSize: 16, color: !item.isActive ? '#BCBEC3' : money == item.amount ? '#fff' : '#000' }}>¥ {item.amount}</Text>
                          </Touch>
                        )
                      })
                    }
                  </View>
                </View>
              }

              {
                //LBMethodCode == 'NormalProcessing' &&
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.LBTitles}>提款金额</Text>
                  <FlickerFreeTextInput
                    value={money + ''}
                    keyboardType='number-pad'
                    inputStyle={[{
                      height: 42,
                      borderWidth: 1,
                      borderRadius: 4,
                      fontSize: money ? 14 : 12,
                      borderColor: '#E3E3E8',
                      paddingHorizontal: 15,
                    }]}
                    height={42}
                    textStyle={{ alignSelf: "center", paddingLeft: 10, fontSize: 14 }}
                    placeholder={`单笔提款 最低：${withdrawalsSetting.minBal}元起，最高：${withdrawalsSetting.maxBal}元。`}
                    placeholderTextColor='#BCBEC3'
                    onChangeText={(money) => {
                      let newVal = money.replace(/[^\d]/g, '');
                      this.setState({
                        money: newVal
                      }, () => {
                        this.changeWithdrawalsBtnStatus()
                      })
                    }}
                    onFocus={() => {
                      this.setState({
                        isFocus: true
                      })
                    }}
                  />
                  {
                    (money > withdrawalsSetting.maxBal) && isFocus &&
                    <View style={{
                      backgroundColor: '#FEE0E0',
                      paddingVertical: 10, flex: 1,
                      justifyContent: 'center', paddingHorizontal: 15, marginTop: 10, borderRadius: 4
                    }}>
                      <Text style={{ color: '#EB2121', fontSize: 12 }}>金额必须为{withdrawalsSetting.maxBal}或以下的金额</Text>
                    </View>
                  }


                  {
                    (money < withdrawalsSetting.minBal) && isFocus &&
                    <View style={{
                      backgroundColor: '#FEE0E0',
                      paddingVertical: 10, flex: 1,
                      justifyContent: 'center', paddingHorizontal: 15, marginTop: 10, borderRadius: 4
                    }}>
                      <Text style={{ color: '#EB2121', fontSize: 12 }}>金额必须为{withdrawalsSetting.minBal}或以上的金额</Text>
                    </View>
                  }


                  {
                    isFocus && (money + '').length > 0 && money <= withdrawalsSetting.maxBal && money >= withdrawalsSetting.minBal && (money < 5000 || money >= 100000) && <View style={{ backgroundColor: '#FFF5BF', borderRadius: 8, padding: 10, marginTop: 10 }}>
                      <Text style={{ color: '#83630B', fontSize: 12, lineHeight: 20 }}>请注意，提款处理时间可能长达3小时，为了加快交易速度，建议您单笔提款金额{money >= 100000 ? '小于100,000' : '大于 5,000'} 元。</Text>
                    </View>
                  }

                </View>
              }

              <View>
                <Text style={styles.LBTitles}>银行账户</Text>
                {
                  Array.isArray(withdrawalsBank) && <View>
                    {
                      withdrawalsBank.length <= 0 ? <TouchableOpacity style={{
                        borderWidth: 1,
                        borderColor: '#00A6FF',
                        height: 42, borderRadius: 6, alignItems: 'center',
                        justifyContent: 'center'

                      }}
                        onPress={() => {
                          Actions.NewBank({
                            bankType: 'W',
                            fromPage: 'withdrawals',
                            getWithdrawalUserBankAction: () => {
                              this.getWithdrawalUserBankAction(this);
                            }
                          });
                        }}>
                        <Text style={{ color: '#00A6FF' }}>添加银行账户</Text>
                      </TouchableOpacity>
                        :
                        <View>

                          <TouchableOpacity onPress={() => {
                            this.setState({
                              isShowCtcModal: true
                            });
                          }} style={[styles.targetWalletBox, PasswordInput]}>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                              <Image
                                resizeMode="stretch"
                                source={bankIcons[withdrawalsBank[withdrawalsBankINdex].bankName] ? bankIcons[withdrawalsBank[withdrawalsBankINdex].bankName].imgUrl : require('../images/bank/bankicon/unionpay.png')}
                                style={{
                                  width: 22,
                                  height: 22,
                                }}
                              />
                              <Text style={[styles.toreturnModalDropdownText, { color: true ? '#000' : '#fff', paddingLeft: 8 }]}>{withdrawalsBank[withdrawalsBankINdex].bankName} - **************{withdrawalsBank[withdrawalsBankINdex].accountNumber.slice(-3)}</Text>
                            </View>
                            <Image
                              resizeMode="stretch"
                              source={false ? require("./../images/up.png") : require("./../images/down.png")}
                              style={{
                                width: 16,
                                height: 16,
                                position: "absolute",
                                right: 10
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                    }
                  </View>
                }

                {
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        checked: !checked
                      });
                    }} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>

                    <View
                      style={{
                        width: 18, height: 18, backgroundColor: checked ? '#00A6FF' : '#fff',
                        borderRadius: 6, marginRight: 5,
                        borderColor: checked ? '#00A6FF' : '#E3E3E8', borderWidth: 1,
                        alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      {
                        checked && <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>✓</Text>
                      }
                    </View>
                    <Text style={{ color: '#222', fontSize: 12 }}>设定为首选银行账户</Text>
                  </TouchableOpacity>
                }


                <TouchableOpacity style={{
                  // borderWidth: 1,
                  // borderColor: '#00A6FF',
                  height: 42, borderRadius: 6, alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 15,
                  backgroundColor: withdrawalsBtnStatus ? '#00A6FF' : '#EFEFF4'
                }} onPress={() => {
                  PiwikAction.SendPiwik("Submit_LocalBank_Withdrawal");
                  this.checkPrefixAmount();
                }}>
                  <Text style={{
                    color: !withdrawalsBtnStatus ? '#BCBEC3' : '#fff',
                    fontWeight: 'bold'
                  }}>提交</Text>
                </TouchableOpacity>
              </View>
            </View>
          }

          {
            paymentWithdrawalType == 'LB' && <View style={{ borderRadius: 10, marginVertical: 10, paddingVertical: 15, marginTop: -10 }}>
              <Text style={{ color: "#666666", fontSize: 13 }}>乐天使温馨提醒 ：</Text>
              <Text style={{ color: '#999999', marginTop: 5, fontSize: 11 }}>收到提款后，请前往【交易记录】页面点击【确认到账】。</Text>
            </View>
          }

          {paymentWithdrawalType == "CCW" && (
            <View
              style={{
                marginTop: 8,
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
              }}
            >
              <View
                style={{
                  paddingVertical: 16,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  paddingHorizontal: 8,
                  width: "100%"
                }}
              >
                {Array.isArray(CoinTypes) && CoinTypes.length > 0 && (
                  <View>
                    <Text style={{ color: "#666666", marginBottom: 8 }}>
                      选择加密货币
                    </Text>
                    <View style={[styles.paymentWithdrawalBox]}>
                      {CoinTypes.length > 0 &&
                        CoinTypes.map((v, i) => {
                          let flag = CoinTypesINdex == i;
                          return (
                            <TouchableOpacity
                              key={i}
                              onPress={this.getWithdrawsDetail1.bind(this, i)}
                              style={[
                                styles.paymentWithdrawalCTCWrap,
                                {
                                  backgroundColor: flag ? "#00A6FF" : "#fff",
                                  borderColor: flag ? "#00A6FF" : "#E3E3E8",
                                  paddingHorizontal: 20,
                                  marginBottom: 15,
                                  width: "48%",
                                  marginRight: i % 2 === 0 ? 10 : 0
                                },
                              ]}
                            >
                              <Image
                                style={{
                                  width: 100,
                                  height: 32,
                                  marginBottom: 5,
                                }}
                                source={WithdrawalIcon2[v]}
                                resizeMode="stretch"
                              ></Image>
                              <Text
                                style={[
                                  {
                                    color: flag ? "#FFFFFF" : "#999999",
                                    fontSize: 12,
                                  },
                                ]}
                              >{` 泰达币-${v.split("-")[1]}\n(${v})`}</Text>
                            </TouchableOpacity>
                          );
                        })}
                    </View>
                  </View>
                )}

                <View>
                  <Text style={{ color: "#666666", marginBottom: 8 }}>
                    提款金额
                  </Text>
                  <FlickerFreeTextInput
                    value={money + ''}
                    keyboardType='number-pad'
                    inputStyle={[
                      {
                        height: 42,
                        borderWidth: 1,
                        borderRadius: 4,
                        fontSize: money ? 14 : 12,
                        borderColor: '#E3E3E8',
                        paddingHorizontal: 15,
                      },
                    ]}
                    height={42}
                    textStyle={{ alignSelf: "center", paddingLeft: 10, fontSize: 14 }}
                    placeholder={`单日提款 最低：${withdrawalsSetting.minBal}元起，最高：${withdrawalsSetting.maxBal}元。`}
                    placeholderTextColor="#BCBEC3"
                    onChangeText={(money) => {
                      //let money = getDoubleNum(value)
                      if(money.match(/[^\d]/g)){
                        return;
                      }
                      let newVal = money.replace(/[^\d]/g, '');
                      this.setState(
                        {
                          money: newVal
                        },
                        () => {
                          debounce(() => {
                            this.CryptoExchangeRate(
                              CoinTypes[CoinTypesINdex],
                              this.state.money > withdrawalsSetting.maxBal
                                ? false
                                : true
                            );
                          }, 500);
                          this.changeWithdrawalsBtnStatus();
                        }
                      );
                    }}
                  />
                  {money > withdrawalsSetting.maxBal && (
                    <View
                      style={{
                        backgroundColor: "#FEE0E0",
                        paddingVertical: 10,
                        flex: 1,
                        justifyContent: "center",
                        paddingHorizontal: 15,
                        marginTop: 10,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ color: "#EB2121", fontSize: 12 }}>
                        金额必须为{withdrawalsSetting.maxBal}或以下的金额
                      </Text>
                    </View>
                  )}

                  {money !== "" && money < withdrawalsSetting.minBal && (
                    <View
                      style={{
                        backgroundColor: "#FEE0E0",
                        paddingVertical: 10,
                        flex: 1,
                        justifyContent: "center",
                        paddingHorizontal: 15,
                        marginTop: 10,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ color: "#EB2121", fontSize: 12 }}>
                        金额必须为{withdrawalsSetting.minBal}或以上的金额
                      </Text>
                    </View>
                  )}

                  {money != "" && exchangeRate != "" && (
                    <View>
                      <Text
                        style={{
                          color: "#666666",
                          marginBottom: 10,
                          marginTop: 10,
                        }}
                      >
                        虚拟币等值数量
                      </Text>
                      <View
                        style={{
                          backgroundColor: "#F5F5F5",
                          borderRadius: 6,
                          paddingVertical: 10,
                          paddingHorizontal: 10,
                        }}
                      >
                        {money != "" && (
                          <Text style={{ color: "#000" }}>
                            {exchangeRate.convertedAmount}{" "}
                            {CoinTypes[CoinTypesINdex]}
                          </Text>
                        )}
                      </View>
                      {whichRate == 2 ? (
                        exchangeRate.tiersExchangeRate && (
                          <View
                            style={{
                              backgroundColor: "#EBEBED",
                              borderRadius: 8,
                              padding: 10,
                              marginTop: 10,
                            }}
                          >
                            <Text
                              style={{
                                color: "#666",
                                fontSize: 12,
                                paddingBottom: 3,
                              }}
                            >
                              参考汇率:
                            </Text>
                            <Text
                              style={{
                                color: "#666",
                                fontSize: 12,
                                paddingBottom: 3,
                              }}
                            >
                              等级1 （免手续费）: 1 人民币 ={" "}
                              {exchangeRate.tiersExchangeRate["1"] || 0}{" "}
                              {CoinTypes[CoinTypesINdex]}
                            </Text>
                            <Text
                              style={{
                                color: "#666",
                                fontSize: 12,
                                paddingBottom: 3,
                              }}
                            >
                              等级2（征收手续费）: 1 人民币 ={" "}
                              {exchangeRate.tiersExchangeRate["2"] || 0}{" "}
                              {CoinTypes[CoinTypesINdex]}
                            </Text>
                            <Text
                              style={{
                                color: "#666",
                                fontSize: 12,
                                lineHeight: 15,
                              }}
                            >
                              以上汇率仅供参考，交易将以实时汇率计算
                            </Text>
                            <Touch
                              onPress={() =>
                                this.setState({ CTC_instructions: true })
                              }
                            >
                              <Text
                                style={{
                                  color: "#1C8EFF",
                                  fontSize: 12,
                                  lineHeight: 15,
                                  fontWeight: "bold",
                                  textDecorationLine: "underline",
                                }}
                              >
                                点击此处了解如何换算等值的加密货币
                              </Text>
                            </Touch>
                          </View>
                        )
                      ) : (
                        <View>
                          <View
                            style={{
                              backgroundColor: "#F5F5F5",
                              borderRadius: 6,
                              paddingVertical: 10,
                              paddingHorizontal: 10,
                              marginTop: 15,
                            }}
                          >
                            {exchangeRate.tiersExchangeRate && (
                              <Text
                                style={{
                                  color: "#666",
                                  fontSize: 12,
                                  lineHeight: 15,
                                }}
                              >
                                参考汇率: 1 RMB ={" "}
                                {(exchangeRate.tiersExchangeRate["1"] != 0 &&
                                  exchangeRate.tiersExchangeRate["1"]) ||
                                  exchangeRate.tiersExchangeRate["2"]}{" "}
                                {CoinTypes[CoinTypesINdex]}
                              </Text>
                            )}
                            <Text
                              style={{
                                color: "#666",
                                fontSize: 12,
                                lineHeight: 15,
                              }}
                            >
                              此汇率仅供参考，交易将以实时汇率进行。
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                  {money != "" && oneExchangeRate != "" && (
                    <View>
                      <Text
                        style={{
                          color: "#666666",
                          marginBottom: 10,
                          marginTop: 10,
                        }}
                      >
                        虚拟币等值数量
                      </Text>
                      <View
                        style={{
                          backgroundColor: "#F5F5F5",
                          borderRadius: 6,
                          paddingVertical: 10,
                          paddingHorizontal: 10,
                        }}
                      >
                        {money != "" && (
                          <Text style={{ color: "#000" }}>
                            {(oneExchangeRate.exchangeRate * money).toFixed(4)}{" "}
                            {CoinTypes[CoinTypesINdex]}
                          </Text>
                        )}
                      </View>

                      <View
                        style={{
                          backgroundColor: "#F5F5F5",
                          borderRadius: 6,
                          paddingVertical: 10,
                          paddingHorizontal: 10,
                          marginTop: 15,
                        }}
                      >
                        <Text style={{ color: "#666666", fontSize: 12 }}>
                          参考汇率: 1 RMB = {oneExchangeRate.exchangeRate}{" "}
                          {CoinTypes[CoinTypesINdex]}
                        </Text>
                        <Text style={{ color: "#666666", fontSize: 12 }}>
                          此汇率仅供参考，交易将以实时汇率进行。
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {money != "" && CoinTypes[CoinTypesINdex] == "USDT-ERC20" && (
                  <View>
                    {ctcWalletList.length > 0 ? (
                      <View>
                        <Text
                          style={{
                            color: "#666666",
                            marginBottom: 10,
                            marginTop: 10,
                          }}
                        >
                          钱包地址
                        </Text>
                        <TouchableOpacity
                          style={{
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: "#E3E3E8",
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            justifyContent: "center",
                          }}
                          onPress={() => {
                            this.setState({
                              isShowCtcModal: true,
                            });
                          }}
                        >
                          <Text style={{ marginBottom: 5 }}>
                            {ctcWalletList[ctcWalletListIndex].walletName}
                          </Text>
                          <Text style={{ width: width - 100 }}>
                            {ctcWalletList[ctcWalletListIndex].walletAddress}
                          </Text>
                          <Image
                            resizeMode="stretch"
                            source={
                              false
                                ? require("./../images/up.png")
                                : require("./../images/down.png")
                            }
                            style={{
                              width: 16,
                              height: 16,
                              position: "absolute",
                              right: 10,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View>
                        <Text
                          style={{
                            color: "#666666",
                            marginBottom: 10,
                            marginTop: 10,
                          }}
                        >
                          钱包地址
                        </Text>

                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            borderColor: "#00A6FF",
                            borderRadius: 4,
                            alignItems: "center",
                            justifyContent: "center",
                            height: 44,
                          }}
                          onPress={() => {
                            Actions.CreatWallet({
                              CoinTypesType: CoinTypes[CoinTypesINdex],
                              GetCryptoWallet: (v) => {
                                this.GetCryptoWallet(v);
                              },
                            });

                            PiwikEvent(
                              "Withdrawal Nav",
                              "Click",
                              "Add_CryptoWallet_WithdrawalPage"
                            );
                          }}
                        >
                          <Text style={{ color: "#00A6FF" }}>
                            添加 USDT-{CoinTypes[CoinTypesINdex]} 钱包地址
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

                {money != "" && CoinTypes[CoinTypesINdex] == "USDT-TRC20" && (
                  <View>
                    {ctcWalletList2.length > 0 ? (
                      <View>
                        <Text
                          style={{
                            color: "#666666",
                            marginBottom: 10,
                            marginTop: 10,
                          }}
                        >
                          钱包地址
                        </Text>
                        <TouchableOpacity
                          style={{
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: "#E3E3E8",
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            justifyContent: "center",
                          }}
                          onPress={() => {
                            this.setState({
                              isShowCtcModal: true,
                            });
                          }}
                        >
                          <Text style={{ marginBottom: 5 }}>
                            {ctcWalletList2[ctcWalletListIndex].walletName}
                          </Text>
                          <Text style={{ width: width - 100 }}>
                            {ctcWalletList2[ctcWalletListIndex].walletAddress}
                          </Text>
                          <Image
                            resizeMode="stretch"
                            source={
                              false
                                ? require("./../images/up.png")
                                : require("./../images/down.png")
                            }
                            style={{
                              width: 16,
                              height: 16,
                              position: "absolute",
                              right: 10,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View>
                        <Text
                          style={{
                            color: "#666666",
                            marginBottom: 10,
                            marginTop: 10,
                          }}
                        >
                          钱包地址
                        </Text>

                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            borderColor: "#00A6FF",
                            borderRadius: 4,
                            alignItems: "center",
                            justifyContent: "center",
                            height: 44,
                          }}
                          onPress={() => {
                            Actions.CreatWallet({
                              CoinTypesType: CoinTypes[CoinTypesINdex],
                              GetCryptoWallet: (v) => {
                                this.GetCryptoWallet(v);
                              },
                            });
                          }}
                        >
                          <Text
                            style={{
                              color: "#00A6FF",
                            }}
                          >
                            添加 USDT-{CoinTypes[CoinTypesINdex]} 钱包地址
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

                <TouchableOpacity
                  style={{
                    // borderWidth: 1,
                    // borderColor: '#00A6FF',
                    height: 44,
                    borderRadius: 6,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 15,
                    backgroundColor: withdrawalsBtnStatus
                      ? "#00A6FF"
                      : "#EFEFF4",
                  }}
                  onPress={() => {
                    PiwikAction.SendPiwik("Submit_Crypto_Withdraw");
                    this.withdrawalsBtn();
                  }}
                >
                  <Text
                    style={{
                      color: !withdrawalsBtnStatus ? "#BCBEC3" : "#fff",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    提交
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {
            LBMethodCode == 'FastProcessing' ?
              <View style={{ marginBottom: 25, paddingLeft: 30 }}>
                <Text style={{ color: '#666', fontSize: 14 }}>乐天使温馨提醒 ：</Text>
                <Text style={{ color: '#999', fontSize: 12, paddingTop: 6 }}>收到提款后，请前往【交易记录】页面点击【确认到账】。</Text>
              </View>
              :
              <View style={{ alignItems: 'center', marginBottom: 25 }}>
                <TouchableOpacity
                  onPress={() => {
                    Actions.withdrawalGuide({
                      paymentWithdrawalType: paymentWithdrawalType,
                      coinTypes: CoinTypes[CoinTypesINdex]
                    });


                    PiwikEvent('Withdrawal Nav', 'View', `Withdrawal_Tutorial`);
                  }}
                  style={{ backgroundColor: '#fff', width: 88, alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 1000, marginTop: 16 }}>
                  <Text style={{
                    color: '#666',
                    fontWeight: "bold"
                  }}>提款教程</Text>
                </TouchableOpacity>
              </View>
          }
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
  game: state.game
});
const mapDispatchToProps = (dispatch) => ({
  userInfo_getBalanceSB: (forceUpdate = false) =>
    ACTION_UserInfo_getBalanceAll(forceUpdate),
  userInfo_updateBalance: (newBalance) =>
    dispatch(actions.ACTION_UserInfo_updateBalance(newBalance)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withdrawal);

const styles = StyleSheet.create({
	ameverificationTitle: {
		paddingTop: 15,
		color: '#222', 
		fontWeight: 'bold', 
		textAlign: 'center',
		fontSize: 16,
	},
	ameverificationClose: {
		position: 'absolute',
		right: 15,
		top: 15,
	},
  checkActived: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 16,
    height: 16,
    backgroundColor: "#00A6FF",
    borderRadius: 4,
  },
  checkActive: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#E3E3E8",
    borderRadius: 4,
  },
  Txt1Type: {
    fontSize: 11,
    color: "#00a6ff",
    lineHeight: 20,
  },
  TxtType: {
    fontSize: 11,
    color: "#222",
    lineHeight: 20,
  },
  ViewBorder: {
    width: width - 70,
    backgroundColor: "#EFEFF4",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  huiView: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: width - 70,
    height: 38,
    backgroundColor: "#EFEFF4",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 15,
    marginTop: 15,
  },
  secussModal: {
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  setPushList: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: width - 70,
    height: 50,
  },
  modalOverly: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .4)",
    width,
    height,
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10000,
    justifyContent: "flex-end",
  },
  modalOverlyBody: {
    backgroundColor: "#EFEFF4",
    paddingTop: 15,
    paddingHorizontal: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 60,
  },
  modalList: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 42,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  modalOverlyBodyText: {
    textAlign: "center",
    fontSize: 16,
    paddingBottom: 25,
    color: "#000000",
    fontWeight: "600",
  },
  modalContainer: {
    width,
    height,
    flex: 1,
    backgroundColor: "rgba(0 ,0 ,0, .6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer1: {
    width: width * 0.9,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  modalContainerHead: {
    height: 44,
    backgroundColor: "#00A6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainerHeadText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  totalMoneyWrap: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 8,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  moneyFlex: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 15,
    flexDirection: "row",
  },
  moneyWrapA: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 10,
    paddingTop: 10,
  },
  virvleBox1: {
    width: 20,
    height: 20,
    borderRadius: 10000,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  virvleBox: {
    borderRadius: 10000,
    width: 10,
    height: 10,
    backgroundColor: "#fff",
  },
  modalBtnAdd: {
    borderWidth: 1,
    borderColor: "#00A6FF",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    marginTop: 10,
  },
  ctcmodalList: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 5,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  moneyWrapB: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingTop: 10,
  },
  moneyWrap: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 20,
  },
  totalText: {
    color: "#666",
    fontSize: 12,
    marginBottom: 7,
  },
  totalText1: {
    fontSize: 16,
    fontWeight: "bold",
  },
  toreturnModalDropdownList: {
    // height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    paddingVertical: 6,
  },
  paymentWithdrawalBox: {
    // padding: 10,
    // paddingBottom: 10,
    flexDirection: "row",
    flexWrap: 'wrap',
  },
  paymentWithdrawalWrap: {
    display: 'flex',
    width: (width - 90) / 5,
    height: (width - 90) / 5,
    overflow: "hidden",
    backgroundColor: "#efeff4",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 10
  },
  paymentWithdrawalCTCWrap: {
    padding: 9,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    // marginRight: 10,
  },
  walletList: {
    paddingLeft: 25,
    paddingTop: 5,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  targetWalletBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderColor: "#4C4C4C34",
    alignItems: "center",
    borderRadius: 4,
  },
  SRAmounts: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 15,
  },
  SRAmountsItem: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3E3E8',
    width: (width - 72) / 4,
    marginTop: 8,
    marginLeft: 4,
    marginRight: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
  LBTitles: {
    color: '#666666',
    marginBottom: 10,
    fontSize: 12,
  },
  LBMethodCode: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingBottom: 15,
  },
  LBMethodCodeList: {
    borderColor: '#E3E3E8',
    borderWidth: 1,
    borderRadius: 8,
    height: 42,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: (width - 60) / 2,
    paddingLeft: 15,
    marginBottom: 8,
  },
  LBMethodCodeActive: {
    width: 15,
    height: 15,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00A6FF',
    marginRight: 12,
  },
  LBMethodCodeNo: {
    width: 16,
    height: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#BCBEC3',
    marginRight: 12,
  },
  LBSRErrModal: {
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  LBSRErrModalBtn: {
    backgroundColor: '#00a6ff',
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  LBSRErrModalBtn1: {
    width: "48%",
  },
  modalClose: {
    position: 'absolute',
    top: 25,
    right: 25,
    zIndex: 99,
  },
  moreOtpModal: {
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 30,
    borderRadius: 10,
    paddingTop: 25,
    paddingBottom: 25,
  },
  moreOtpBtn: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    width: width - 60,
  },
  moreOtpLeftBtn: {
    borderColor: '#00a6ff',
    borderRadius: 5,
    width: (width - 80) * 0.5,
    borderWidth: 1,
  },
  moreOtpItem: {
    color: '#00a6ff',
    lineHeight: 40,
    textAlign: 'center',
    fontSize: 16,
  },
  moreOtpRightBtn: {
    backgroundColor: '#00a6ff',
    borderRadius: 5,
    width: (width - 80) * 0.5,
  },
  moreDepositWithdrawal: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#35C95B',
    width: "100%",
    marginTop: 10,
    // marginLeft: 3,
  },
  moreDepositWithdrawalItem: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 44,
  },
  isNew: {
    backgroundColor: "#EA2222",
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    paddingVertical: 2.5,
    paddingHorizontal: 4,
    position: 'absolute',
    right: -1,
    top: -1,
    zIndex: 9,
  },
  isFast: {
    backgroundColor: "#2057EB",
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    paddingVertical: 2.5,
    paddingHorizontal: 4,
    position: 'absolute',
    right: -1,
    top: -1,
    zIndex: 9,
  },
  isNewTxt: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  PopoverContent: {
    backgroundColor: "#363636",
    borderRadius: 8,
    padding: 15,
    width: 270,
    display: "flex",
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: "row",
    // height: 67,
  },
  arrowB: {
    position: "absolute",
    left: 30,
    top: -13,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: 7,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderBottomColor: "#363636",
    borderRightColor: "transparent",
  },
  Popover: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    width: 270,
    top: 24,
    left: -44,
  },
  circle: {
    width: 8,
    height: 8,
    marginRight: 10,
    borderRadius: 8 / 2,
  },
});
