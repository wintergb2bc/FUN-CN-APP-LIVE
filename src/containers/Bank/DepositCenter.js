import React from "react";
import { Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { connect } from "react-redux";
import { Actions, ActionConst } from "react-native-router-flux";
import { DatePicker, Flex, List, Modal, Slider, Toast } from "antd-mobile-rn";
import Modals from "react-native-modal";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ModalDropdown from "react-native-modal-dropdown";
import { Svg, Polygon } from 'react-native-svg';
import {
  ALBPrompt,
  APPrompt,
  BCPrompt,
  CCPrompt,
  CTCPrompt,
  JDPPrompt,
  LBPrompt,
  OAPrompt,
  PPBPrompt,
  QQrompt,
  SRPrompt,
  UPPrompt,
  WCLBPrompt,
  WCPrompt
} from "../Common/Deposit/depositPrompt";
import ListItems from "antd-mobile-rn/lib/list/style/index.native";
import { PushLayout } from "../Layout";
import PromptBox from "../Common/Deposit/PromptBox";
import {
  ALBType,
  bankImage,
  bankImageActive,
  DepositListShow,
  mgmtRefNo,
  MoneyInputNoNeedMarginTop,
  promptList,
} from "./DepositData";
import actions from "../../lib/redux/actions/index";
import BannerAction from "../../lib/utils/banner";
import PiwikAction from "../../lib/utils/piwik";
import { ACTION_GetAnnouncement } from "../../lib/redux/actions/AnnouncementAction";
import debounce from '../../lib/utils/debounce';
import { LOGIN, LOGOUT } from "../../lib/redux/actions/AuthAction";
import { getInitialState } from "../../lib/redux/reducers/AuthReducer";   // 引入
import ChargeModal from './chargeModal'

const newStyle = {};
for (const key in ListItems) {
  if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(ListItems[key]) };
    newStyle[key].opacity = 0;
    newStyle[key].color = "transparent";
    newStyle[key].backgroundColor = "transparent";
    newStyle[key].height = 30;
    newStyle[key].width = width;
  }
}

const { width } = Dimensions.get("window");

let DepositList = {
  LB: 'show',
  WCLB: 'show',
  UP: 'show',
  OA: 'show',
  WC: 'show',
  QQ: 'show',
  BC: 'show',
  BCM: 'show',
  ALB: 'show',
  CTC: 'show',
  JDP: 'show',
  AP: 'show',
  CC: 'show',
  PPB: 'show',
  SR: 'show',
};

class DepositCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ShowDepositorNameField: false,
      PrefillRegisteredName: false,
      lbVisible: false,
      isSmileLBAvailable: false,
      keyboardOpen: true,
      depositList: [],
      activeCode: "", //选中
      activeName: "",
      money: 0,
      SignUpMoney: 0,
      MaxBalShow: "0.00",
      MinBalShow: "0.00",
      DayBalShow: "0.00",
      TransferNumber: "1",
      MaxBal: "0.00",
      MinBal: "0.00",
      APcaredUSD: false, //AP卡美元兑换
      USDRateMoney: "0.00", //AP卡美元
      USDRate: 0, //AP卡美元兑换汇率
      activeBalance: "MAIN",
      defaultBalance: "",
      activeBalanceName: "",
      DayBal: "", //每日最高
      allBalance: [], //所有账户
      LBnameTest: "",
      BonusData: "",
      BonusIndex: 0,
      charges: "", //qq支付使用，实际到账 = 存款金额 + API 的 charges
      chargesMoney: 0, //qq支付使用，实际到账 = 存款金额 + API 的 charges
      PayAreadyQQ: false,
      bonusKey: 0, //优惠选择key
      bonusId: 0,
      BonusMSG: "",
      bonusCoupon: "", //优惠卷码
      bonusCouponKEY: 0, //!=0需要优惠卷码
      okPayBtn: true,
      nextBtn: false, //下一步
      depositDetail: "", //存款详情
      ALBTypeActive: ALBType[0].code,
      userMember: "",
      Sliderss: 0,
      SliderssRun: false,
      PayAready: false,
      bonusTitle: "",
      caredNum: "",
      caredNumST: "",
      PINNum: "",
      PINNumST: "",
      monthDate: "月份",
      yearDate: "年份",
      BCBankData: "",
      MemberName: "",
      showPush: false,
      MemberNameTest: "",
      BankNameKey: 0,
      checkWallet: false,
      activeSlide: 0,
      ISpromp: false,
      accountHolderName: "",
      accountHolderNameTest: "",
      FirstName: "",
      LBFirstName: "",
      LBFirstNameTest: "",
      Countdown: "14:59",
      activeDeposit: "",
      okPayModal: false,
      CTCtype: 0, //0极速虚拟币支付和1虚拟币支付
      CTCListtype: 0, //0比特币 (BTC)和1以太坊 (ETH)和2泰达币 (USDT-ERC20)
      CTC_CHANNEL_INVOICE: "", //极速虚拟币支付和虚拟币支付
      CTC_CHANNEL_pay: false, //极速虚拟币支付弹窗
      curBonusTitle: "", //优惠标题
      uniqueAmountStatus: false, //是否尾数部位0
      BC_Deposit: [],
      IsAutoAssign: false, //本地银行  支付宝转账  微信转账  false显示银行卡  true不显示
      moneyST: "",
      paymentchannel: "", //存款渠道選擇
      paymentchannelEND: "DEFAULT", //存款渠道當前選擇
      OASuggestedAmount: [], //特殊金額
      depositPageDate: "",
      nowActiveDeposit: "", //进入存款传的指定存款方式code
      CTCPromptActive: 1, //虚拟币温馨提示
      isPopup: false, //存款被锁定
      ppbVisible: false,
      ppbVisibleErr: false,
      isQrcodeALB: false,
      bannerData: "", // banner

      isDepositVerificationOTP: false,

      // Phase 2
      DepositData: '',
      SuggestedAmounts: [],//小额存款金额list
      SRdisabledErr: false,
      SRAmountsActive: 99999,
      moreDepositWithdrawal: false,
      depositErrModal: false,
      FirstNameModal: false,
      isShowRpeatModal: false,
      lastDepositID: '',
      lastDepositAmount: '',
      PPBTimer: 0,
      chargeModalVisible: false,
    };
  }

  componentWillMount(props) {

    // 自我限制檢查
    if (this.props.userSetting.selfExclusions.disableDeposit) {
      this.props.selfExclusionsPopup(true);
      return;
    }

    // 公告
    console.log('公告')
    this.props.getAnnouncementPopup("Deposit");

    window.bonusState = false;
    this.props.froms == "promotions" && this.getBonus();
    //开启竖屏
    window.openOrientation();
    // this.checkCustomFlag();
    this.checkMember();
    this.getBanner();
    storage
      .load({
        key: "depositList",
        id: "depositList",
      })
      .then((data) => {
        if (data) {
          this.setState({
            activeCode: data[0].code,
            activeName: data[0].name,
            depositList: data,
          });
        }
        // this.depositCodeClick(data[0].code, data[0].name);
        //再次刷新钱包
        this.GetPaymentReload();
      })
      .catch(() => {
        this.GetPaymentReload();
      });
  }

  componentWillUnmount() {
    if (window.openOrien == "orientation") {
      //游戏页面跳转过来,需要解锁横屏
      window.removeOrientation();
    }
    this.Countdowns && clearInterval(this.Countdowns);
    this.PPBtimerID && clearInterval(this.PPBtimerID);
  }

  //isDepositVerificationOTP 是否需要验证手机,isIWMM 是否显示开启更多存款和提款方式btn
  //User.js,DepositCenter.js, withdrawal.js都是用到
  checkCustomFlag() {

    fetchRequest(ApiPort.CustomFlag + 'flagKey=BankCardVerification&', 'GET')
      .then(data => {
        if (data.isSuccess) {
          let result = data.result;
          let isDepositVerificationOTP = result.isDepositVerificationOTP ? result.isDepositVerificationOTP : false;
          this.setState({isDepositVerificationOTP });
          if (!(!this.state.isDepositVerificationOTP && this.state.FirstName.length > 0)) {
            //需要手机验证，才能存款
            Actions.BankCardVerify({ type: ActionConst.REPLACE, isDepositVerificationOTP: true, isNameVerification: this.state.FirstName.length > 0 });
          }
        }
      })
      .catch(() => {
      });
  }

  //进行姓名银行卡验证添加
  goIWMM() {
    // PiwikEvent('Verification', 'Click', 'IWMM_PII_DepositPage')
    this.setState({ moreDepositWithdrawal: true });
  }

  //  小额存款金额选择,金额，选中key
  SRAmountSelect(item, SRAmountsActive) {
    item.isActive && this.setState({ money: item.amount, SRAmountsActive }, () => {
      this.validation();
    });
  }

  SRdisabledErr(item) {
    if (item.length > 0) {
      let isActive = '';
      isActive = item.find(v => v.isActive == true);
      this.setState({ SRdisabledErr: isActive ? false : true });
    }
  }

  //倒计时处理
  Countdown() {
    let time = 900;
    let m, s, ms;
    this.Countdowns = setInterval(() => {
      time -= 1;
      m = parseInt(time / 60).toString();
      s = time - m * 60;
      if (s < 10) {
        s = "0" + s.toString();
      }
      ms = m + ":" + s;
      if (m < 10) {
        ms = "0" + m.toString() + ":" + s;
      }
      this.setState({ Countdown: ms });

      if (m == 0 && s == 0) {
        clearInterval(this.Countdowns);
      }
    }, 1000);
  }

  //存款成功统一清空输入框
  clearData() {
    this.setState({
      okPayBtn: this.state.activeCode == "CTC" ? true : false,
      Sliderss: 0,
      SliderssRun: !this.state.SliderssRun,
      // money: '',
      monthDate: "月份",
      yearDate: "年份",
      caredNum: "",
      PINNum: "",
      APcaredUSD: false,
      bonusCoupon: "",
      chargesMoney: 0,
      BonusMSG: "",
      // allBalance: '',
      bonusId: 0,
      BonusData: "",
    });
    // setTimeout(() => {
    //     this.setState({ allBalance })
    // }, 1000);
  }

  //获取用户信息
  checkMember() {
    //将账户清空，获取默认账户后再加回去
    this.setState({ activeBalanceName: "" });
    fetchRequest(ApiPort.Member, "GET")
      .then((data) => {
        let memberInfo = data.result.memberInfo;
        let memberNewInfo = data.result.memberNewInfo;
        if (memberInfo) {
          this.props.userInfo_updateMemberInfo(data.result);
          let nameSt = memberInfo.firstName == "";
          let IdentityCardSt = memberNewInfo.identityCard ? false : true;
          let FirstName = memberInfo.firstName;
          let phoneData = memberInfo.contacts.find(
            (v) => v.contactType.toLocaleLowerCase() === "phone"
          );
          let phoneSt = phoneData
            ? phoneData.status.toLocaleLowerCase() === "unverified"
              ? true
              : false
            : true;
          //手机、用户名、身份证号都需要验证,分两次，
          let verify = IdentityCardSt || phoneSt || nameSt ? true : false;
          let activeBalance = this.props.froms == "promotions" ? this.props.promotionsDetail?.bonusProduct : memberInfo.preferWallet;
          this.setState({ FirstName, LBFirstName: FirstName, activeBalance }, () => {
            this.checkCustomFlag(FirstName);
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //点击下一步
  okPayClick() {
    const st = this.state;
    if (!st.FirstName) {
      //没有姓名无法存款，去个人中心添加
      this.setState({ FirstNameModal: true });
      return;
    }
    //极速虚拟币支付
    if (st.CTC_CHANNEL_INVOICE == "CHANNEL" && st.activeCode == "CTC") {
      if (st.depositDetail.banks.length == 0) {
        return;
      }
      // PiwikEvent('Submit_Crypto_deposit')
      PiwikEvent("Deposit", "Submit", "Crypto");
      this.setState({ CTC_CHANNEL_pay: true });
      return;
    }

    if (!st.okPayBtn) {
      return;
    }
    //提交前需要提示显示银行卡或者二维码
    if (st.activeCode == "ALB" && !st.isQrcodeALB) {
      this.setState({ isQrcodeALB: true });
      return;
    }
    this.setState({ isQrcodeALB: false });
    let moneys = st.money;

    // let data = {
    //   // accountNumber: "372568",
    //   accountHolderName: "14710000372568",
    //   language: "zh-cn",
    //   swiftCode: "Fun88MobileApps",
    //   paymentMethod: st.activeCode,
    //   charges: st.charges,
    //   amount: moneys,
    //   transactionType: "Deposit",
    //   domainName: "fun88native://",
    //   isMobile: true,
    //   isSmallSet: false,
    // };

    let data = {
      accountHolderName: st.accountHolderName,
      language: "zh-cn",
      paymentMethod: st.activeCode,
      charges: st.charges,
      amount: moneys,
      transactionType: "Deposit",
      domainName: SBTDomain,
      isMobile: true,
      isSmallSet: false,
      bonusId: st.bonusId,
      mgmtRefNo: mgmtRefNo,
      successUrl: SuccessURL,
      depositingWallet: st.activeBalance, //目標帳戶
      isPreferredWalletSet: false, // 是不是首選帳戶
      blackBoxValue: Iovation,
      e2BlackBoxValue: E2Backbox,
    };
    if (st.activeCode == "LB") {
      if (st.depositDetail.bankAccounts.length == 0) {
        Toasts.fail("存款银行错误,联系客服添加", 2);
        return;
      }
      let BankAccounts = st.depositDetail.bankAccounts[st.BankNameKey];
      data = {
        domainName: SBTDomain,
        isMobile: true,
        IsSmallSet: false,
        MemberCode: userNameDB,
        RequestedBy: userNameDB,
        amount: moneys,
        CurrencyCode: "cny",
        transactionType: "1",
        Charges: st.charges,
        accountNumber: "0", //帐号
        accountHolderName: st.LBFirstName, //账户持有人姓名
        bankName: BankAccounts.bankCode, //银行名
        city: "city",
        province: "province",
        branch: "branch",
        SWIFTCode: "FUN88",
        paymentMethod: "LB",
        mgmtRefNo: mgmtRefNo,
        bonusId: st.bonusId,
        refNo: "0",
        offlineRefNo: "0",
        // depositingBankAcctNum: BankAccounts.AccountNo.slice(-6),
        merchantType: 1,
        depositingWallet: st.activeBalance,
        blackBoxValue: Iovation,
        e2BlackBoxValue: E2Backbox,
      };
      if (!st.IsAutoAssign) {
        data.depositingBankAcctNum = BankAccounts.accountNo.slice(-6);
      }
    } else if (st.activeCode == "WCLB") {
      if (st.depositDetail.bankAccounts.length == 0) {
        Toasts.fail("存款银行错误,联系客服添加", 2);
        return;
      }
      let BankAccounts = st.depositDetail.bankAccounts[st.BankNameKey];
      data = {
        accountHolderName: st.FirstName, //账户持有人姓名
        accountNumber: BankAccounts.accountNo, //帐号
        amount: moneys,
        bankName: BankAccounts.bankName, //银行名
        city: "city",
        province: "province",
        branch: "branch",
        language: "zh-cn",
        paymentMethod: "WCLB",
        charges: st.charges,
        transactionType: "Deposit",
        domainName: SBTDomain,
        isMobile: false,
        isSmallSet: false,
        refNo: "0",
        offlineDepositDate: "",
        mgmtRefNo: mgmtRefNo,
        transferType:
          (st.depositDetail.transferTypes.length > 0 &&
            st.depositDetail.transferTypes[0]) ||
          "", // 收款账户支持信息
        offlineRefNo: "0",
        // "depositingBankAcctNum": BankAccounts.AccountNo.slice(-6),
        isPreferredWalletSet: false, // 是否设为默认目标账户
        depositingWallet: st.activeBalance,
        cardName: "",
        cardNumber: "",
        cardPIN: "",
        cardExpiryDate: "",
        bonusId: st.bonusId,
        bonusCoupon: st.bonusCoupon,
        couponText: "",
        fileBytes: "",
        fileName: "",
        secondStepModel: null,
        successUrl: SuccessURL,
        blackBoxValue: Iovation,
        e2BlackBoxValue: E2Backbox,
      };
      if (!st.IsAutoAssign) {
        data.depositingBankAcctNum = BankAccounts.accountNo.slice(-6);
      }
    } else if (st.activeCode == "ALB") {
      if (st.depositDetail.bankAccounts.length == 0) {
        Toasts.fail("存款银行错误,联系客服添加", 2);
        return;
      }
      let BankAccounts = st.depositDetail.bankAccounts[st.BankNameKey];

      data = {
        accountHolderName: st.FirstName, // 账户持有人姓名
        accountNumber: "0", //帐号
        amount: moneys,
        bankName: BankAccounts.bankName, //银行名
        language: "zh-cn",
        paymentMethod: "ALB",
        charges: st.charges,
        transactionType: "Deposit",
        domainName: SBTDomain,
        isSmallSet: false,
        refNo: "0",
        offlineDepositDate: "",
        mgmtRefNo: mgmtRefNo,
        offlineRefNo: "0",
        BankLogID: BankAccounts.bankLogID,
        depositingBankAcctNum: BankAccounts.accountNo,
        isPreferredWalletSet: false,
        isMobile: true,
        depositingWallet: st.activeBalance,
        bonusId: st.bonusId,
        bonusCoupon: st.bonusCoupon,
        secondStepModel: null,
        successUrl: SuccessURL,
        blackBoxValue: Iovation,
        e2BlackBoxValue: E2Backbox,
        transferType: {
          ID: 27,
          Sorting: 2,
          Name: "LocalBank",
          CurrencyCode: "CNY",
          Code: "LocalBank",
          IsActive: true,
        },
      };
      if (!st.IsAutoAssign) {
        data.depositingBankAcctNum = BankAccounts.accountNo;
      }
    } else if (st.activeCode == "CC" || st.activeCode == "AP") {
      //APcaredUSD=true表示AP存款，且卡号事美元
      moneys = st.APcaredUSD ? st.USDRateMoney : st.money; //AP存款换美元处理
      let cardExpiryDate =
        st.activeCode == "AP" ? st.yearDate + "/" + st.monthDate : "";
      let USDRate = st.activeCode == "AP" ? st.USDRate : "0";
      data = {
        accountHolderName: "",
        accountNumber: "0",
        amount: moneys,
        bankName: "",
        bonusId: st.bonusId,
        bonusCoupon: st.bonusCoupon,
        cardExpiryDate: cardExpiryDate,
        cardName: "",
        cardNumber: st.caredNum,
        cardPIN: st.PINNum,
        charges: st.charges,
        couponText: "",
        depositingBankAcctNum: "",
        depositingWallet: st.activeBalance, // 目标账户Code
        domainName: SuccessURL,
        fileBytes: "",
        fileName: "",
        isMobile: false,
        isPreferredWalletSet: false, // 是否设为默认目标账户
        isSmallSet: false,
        language: "zh-cn",
        mgmtRefNo: mgmtRefNo,
        offlineDepositDate: "",
        offlineRefNo: "0",
        paymentMethod: st.activeCode,
        refNo: USDRate,
        secondStepModel: null,
        successUrl: SuccessURL,
        transactionType: "Deposit",
        transferType: null,
        "blackBoxValue": Iovation,
        "e2BlackBoxValue": E2Backbox,
      }
    } else if (st.activeCode == "BC") {
      if (st.depositDetail.banks.length == 0) {
        Toasts.fail("存款银行错误,联系客服添加", 2);
        return;
      }
      let bankNames = st.depositDetail.banks[st.BankNameKey].code;
      data = {
        accountHolderName: st.accountHolderName,
        accountNumber: "0",
        amount: moneys,
        bankName: bankNames,
        bonusId: st.bonusId,
        bonusCoupon: st.bonusCoupon,
        cardExpiryDate: "",
        cardName: "",
        cardNumber: "",
        cardPIN: "",
        charges: st.charges,
        couponText: "",
        depositingBankAcctNum: "",
        depositingWallet: st.activeBalance,
        domainName: SBTDomain,
        fileBytes: "",
        fileName: "",
        isMobile: true,
        isPreferredWalletSet: false, // 是否设为默认目标账户
        isSmallSet: false,
        language: "zh-cn",
        mgmtRefNo: mgmtRefNo,
        offlineDepositDate: "",
        offlineRefNo: "0",
        paymentMethod: "BC",
        refNo: "0",
        secondStepModel: null,
        successUrl: SuccessURL,
        transactionType: "Deposit",
        transferType: null,
        blackBoxValue: Iovation,
        e2BlackBoxValue: E2Backbox,
      };
    } else if (st.activeCode == "BCM") {
      let bankNames =
        (st.depositDetail.banks.length > 0 &&
          st.depositDetail.banks[st.BankNameKey].code) ||
        "";

      data = {
        accountHolderName: st.accountHolderName,
        amount: moneys,
        charges: st.charges,
        bankName: bankNames,
        depositingBankAcctNum: "",
        depositingWallet: st.activeBalance, // 目标账户Code
        domainName: SBTDomain,
        isMobile: true,
        isPreferredWalletSet: false, // 是否设为默认目标账户
        isSmallSet: false,
        language: "zh-cn",
        mgmtRefNo: mgmtRefNo,
        offlineDepositDate: "",
        offlineRefNo: "0",
        paymentMethod: "BCM",
        bonusId: st.bonusId,
        refNo: "0",
        successUrl: SuccessURL,
        transactionType: "Deposit",
        blackBoxValue: Iovation,
        e2BlackBoxValue: E2Backbox,
      };
    } else if (st.activeCode == "QQ") {
      data = {
        accountHolderName: "",
        accountNumber: "0",
        amount: moneys,
        bankName: "",
        bonusId: st.bonusId,
        bonusCoupon: st.bonusCoupon,
        cardExpiryDate: "",
        cardName: "",
        cardNumber: "",
        cardPIN: "",
        charges: st.charges,
        couponText: "",
        depositingBankAcctNum: "",
        depositingWallet: st.activeBalance, // 目标账户Code,
        domainName: SBTDomain,
        mgmtRefNo: mgmtRefNo,
        fileBytes: "",
        fileName: "",
        isMobile: true,
        isPreferredWalletSet: false, // 是否设为默认目标账户,
        isSmallSet: false,
        language: "zh-cn",
        offlineDepositDate: "",
        offlineRefNo: "0",
        paymentMethod: "QQ",
        refNo: "0",
        secondStepModel: null,
        successUrl: SuccessURL,
        transactionType: "Deposit",
        transferType: null,
        blackBoxValue: Iovation,
        e2BlackBoxValue: E2Backbox,
      };
    } else if (st.activeCode == "CTC") {
      // 虚拟币支付
      data = {
        language: "zh-cn",
        paymentMethod: st.activeCode,
        charges: 0,
        Amount: moneys,
        transactionType: "Deposit",
        domainName: SBTDomain,
        isMobile: true,
        IsSmallSet: false,
        // "bonusId": st.CTC_CHANNEL_INVOICE != 'INVOICE' ? st.bonusId : 0,//无法申请优惠
        bonusId: st.bonusId, //无法申请优惠
        mgmtRefNo: mgmtRefNo,
        successUrl: SuccessURL,
        Methodcode: st.CTC_CHANNEL_INVOICE,
        depositingWallet: st.activeBalance, //目標帳戶
        isPreferredWalletSet: false, // 是不是首選帳戶
        blackBoxValue: Iovation,
        e2BlackBoxValue: E2Backbox,
      };
    } else if (st.activeCode == "PPB") {
      let bankNames =
        (st.depositDetail.banks.length > 0 &&
          st.depositDetail.banks[st.BankNameKey].code) ||
        "";
      data = {
        accountHolderName: st.accountHolderName,
        accountNumber: "0",
        amount: moneys,
        bankName: bankNames,
        bonusId: st.bonusId,
        bonusCoupon: st.bonusCoupon,
        cardExpiryDate: "",
        cardName: "",
        cardNumber: "",
        cardPIN: "",
        charges: st.charges,
        couponText: "",
        depositingBankAcctNum: "",
        depositingWallet: st.activeBalance, // 目标账户Code
        domainName: SBTDomain,
        fileBytes: "",
        fileName: "",
        isMobile: true,
        isPreferredWalletSet: false, // 是否设为默认目标账户
        isSmallSet: false,
        language: "zh-cn",
        mgmtRefNo: mgmtRefNo,
        offlineDepositDate: "",
        offlineRefNo: "0",
        paymentMethod: "PPB",
        refNo: "0",
        secondStepModel: null,
        successUrl: SuccessURL,
        transactionType: "Deposit",
        transferType: null,
        blackBoxValue: Iovation,
        e2BlackBoxValue: E2Backbox,
      };
    } else if (st.activeCode == 'SR') {
      data = {
        language: "zh-cn",
        paymentMethod: "SR",
        charges: st.charges,
        MemberName: userNameDB,
        RequestedBy: userNameDB,
        amount: moneys,
        CurrencyCode: "CNY",
        transactionType: "Deposit",
        domainName: SBTDomain,
        isMobile: false,
        isSmallSet: false,
        mgmtRefNo: mgmtRefNo,
        bankName: "",
        address: "",
        city: "",
        province: "",
        branch: "",
        accountHolderName: "",
        bonusId: st.bonusId,
        bonusCoupon: st.bonusCoupon,
        blackBoxValue: Iovation,
        e2BlackBoxValue: E2Backbox,
      };

    }

    if (
      st.paymentchannelEND != "" &&
      st.activeCode != "CTC" &&
      st.activeCode != "LB"
    ) {
      //支付渠道
      data.methodcode = st.paymentchannelEND;
    }

    this.okPayPiwik(st.activeCode);
    if (st.activeCode === "PPB") {
      this.startTiming();
    } else {
      Toast.loading("存款中,请稍候...", 200);
    }
    fetchRequest(ApiPort.PaymentApplications, "POST", data)
      .then((res) => {
        Toast.hide();
        if (st.activeCode === "PPB") {
          this.stopPPBLoading();
        } else {
          Toast.hide();
        }
        let data = res.result;
        if (data && data.isPopup == true) {
          //存款被锁定提示
          this.setState({ isPopup: true });
        }
        this.setState({ DepositData: data });
        if (res.isSuccess) {
          this.props.froms == "promotions" && this.okBonusId(data);

          if (['BC', 'BCM', 'UP', 'PPB', 'OA', 'WC', 'JDP', 'QQ',].includes(st.activeCode)) { // && data.vendorCharges

            if (
              ['BC', 'BCM', 'UP', 'OA', 'JDP', 'WC'].includes(st.activeCode)
              && !data.vendorCharges
              && !data.totalWaiveRemain
            ) {
              this.isSuccess(data);
            } else {
              this.setState({ chargeModalVisible: true, }, () => {
                if (st.activeCode == 'PPB') {
                  setTimeout(() => { //1分钟后自动跳转
                    this.state.chargeModalVisible && this.setState({ chargeModalVisible: false }, () => {
                      this.isSuccess(data);
                    });
                  }, 60 * 1000);
                  return;
                }
              })
            }
            return
          }

          // if (st.activeCode == 'PPB') {
          //   this.setState({ ppbVisible: true });
          //   setTimeout(() => {
          //     //1分钟后自动跳转
          //     this.state.ppbVisible && this.setState({ ppbVisible: false }, () => {
          //       this.isSuccess(data);
          //     });
          //   }, 60 * 1000);
          //   return;
          // }
          // if (st.activeCode === "QQ") {
          //   this.setState({ PayAreadyQQ: true });
          //   return
          // }

          let isSmileLBAvailable = data.returnedBankDetails
            ? !data.returnedBankDetails.isSmileLBAvailable
            : false;
          if (
            st.activeCode == "LB" &&
            (data.isPaybnbDepositWithDifferentRequestedBank ||
              isSmileLBAvailable)
          ) {
            // 本地银行充值银行错误
            this.setState({ lbVisible: true, isSmileLBAvailable: true });
            return;
          }
          if (
            (st.activeCode == "WCLB" || st.activeCode == "ALB") &&
            isSmileLBAvailable
          ) {
            this.setState({ isSmileLBAvailable: true }, () => {
              this.isSuccess(data);
            });
            return;
          }
          this.isSuccess(data);
        } else {
          if (st.activeCode == 'PPB' && data.errorCode == "P103001") {
            this.setState({ ppbVisibleErr: true });
            return;
          }


          if (st.activeCode == 'SR' || data.errorCode == 'P111001' || data.errorCode == 'P111004') {
            if (st.activeCode == 'SR' && data.errorCode == 'P101116') {
              this.setState({
                lastDepositID: data.lastDepositID,
                lastDepositAmount: data.lastDepositAmount,
                isShowRpeatModal: true
              });
              return;
            }
            this.setState({ depositErrModal: true });
            return;
          }
          const description = res.errors[0].description;
          Toasts.fail(description, 2);
        }
      })
      .catch((e) => {
        if (st.activeCode === "PPB") {
          this.stopPPBLoading();
          Toast.hide();
        } else {
          Toast.hide();
        }
        this.postPaymentCatch(e);
        if (e.errors && e.errors[0]) {
          let getDesc = e.errors[0].description;
          let getErrCode = e.errors[0].errorCode;
          if (getErrCode === "P101116") {
            Toast.fail(getDesc);
          }
          this.setState({
            DepositData: data
          })
        }
        console.log(e);
      });
  }

  postPaymentCatch = (res) => {
    console.log('postPaymentCatch')
    console.log(res)
    const { activeCode } = this.state;
    let errors = res.errors[0];
    if (activeCode == 'PPB' && errors.errorCode == "P103001") {
      this.setState({ ppbVisibleErr: true });
      return;
    }

    if (activeCode == 'SR' || errors.errorCode == 'P111001' || errors.errorCode == 'P111004') {
      if (activeCode == 'SR' && errors.errorCode == 'P101116') {
        if (res.result) {
          this.setState({
            lastDepositID: res.result.lastDepositID,
            lastDepositAmount: res.result.lastDepositAmount,
            isShowRpeatModal: true
          });
        }
        return;
      }
    }
    const description = errors.description;
    Toasts.fail(description, 2);
  }

  //极速虚拟币支付
  CTC_CHANNEL_pay() {
    const st = this.state;

    let item = st.depositDetail.banks[st.CTCListtype];
    let dataJson =
      "?CoinsCurrency=" + item.code + "&ExchangeAmount=1&MethodCode=CHANNEL&";
    Toast.loading("存款中,请稍候...", 200);
    PiwikEvent("Deposit_Nav", "Confirm", "Crypto_Channel_Next");
    fetchRequest(ApiPort.GetCryptocurrencyInfo + dataJson, "GET")
      .then((res) => {
        const data = res.result;
        Toast.hide();
        if (data && data.isPopup == true) {
          //存款被锁定提示
          this.setState({ isPopup: true });
        }
        if (data.error) {
          Toasts.fail(data.error, 2);
        } else if (data.status == "SUCCESS") {
          //成功
          let checkcallbackDate = {
            userName: st.FirstName,
            data: data,
            activeBalanceName: "",
            activeCode: st.activeCode,
            activeName: `${item.name}(${item.code})`,
            payCallback: data,
            ALBTypeActive: "",
            bonusTitle: "",
          };

          Actions.DepositCenterPage({
            checkcallbackDate,
            previousPage: "",
            CTC_code: item.code,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getBanner() {
    fetch(`${CMS_Domain + ApiPort.CMS_BannerDeposit}`, {
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

  okPayPiwik(code) {
    switch (code) {
      case "LB":
        // PiwikEvent('Deposit', 'Submit', 'Localbank')
        PiwikEvent("Deposit", "Submit", "Submit_Localbank_Deposit");
        break;
      case "JDP":
        PiwikEvent("Deposit", "Submit", "Submit_JD_Deposit");
        break;
      case "UP":
        PiwikEvent("Deposit", "Submit", "Submit_Unionpay_Deposit");
        break;
      case "BC":
        PiwikEvent("Deposit", "Submit", "Submit_CDC_Deposit");
        break;
      case "BCM":
        PiwikEvent("Deposit", "Submit", "Submit_MobileCDC_Deposit");
        break;
      case "ALB":
        // PiwikEvent('Deposit', 'Submit', 'LocalbankAlipay')
        PiwikEvent("Deposit_Nav", "Next", "Submit_LocalbankAlipay_Deposit");
        break;
      case "OA":
        PiwikEvent("Deposit", "Submit", "Submit_OnlineAlipay_Deposit");
        break;
      case "QQ":
        PiwikEvent("Deposit", "Submit", "Submit_QQwallet_Deposit");
        break;
      case "AP":
        PiwikEvent("Deposit", "Submit", "Submit_Astropay_Deposit");
        break;
      case "CC":
        PiwikEvent("Deposit", "Submit", "Submit_Cashcard_Deposit");
        break;
      case "PPB":
        PiwikEvent("Deposit", "Submit", "Submit_P2PBanking_Deposit");
        break;
      case "WCLB":
        PiwikEvent("Deposit_Nav", "Next", "Submit_LocalbankWechat_Deposit");
        break;
      case "WC":
        PiwikEvent("Deposit", "Submit", "Submit_OnlineWechat_Deposit");
        break;
      case "CTC":
        PiwikEvent("Deposit", "Submit", "Submit_Crypto_Deposit");
        break;
      case "SR":
        PiwikEvent("Deposit", "Submit", "SmallRiver_Deposit");
        break;
      default:
        break;
    }
  }

  //QQ存款成功处理
  PayAreadyQQ() {
    this.setState({ PayAreadyQQ: false }, () => {
      let data = this.state.DepositData;
      let st = this.state;
      let datas = { ...data, moneys: st.money };
      let checkcallbackDate = {
        userName: "",
        data: "",
        activeBalanceName: "",
        activeCode: st.activeCode,
        activeName: st.activeName,
        payCallback: data,
        ALBTypeActive: "",
        bonusTitle: st.bonusTitle,
        INVOICE_AUT: false,
        CTC_INVOICE_OTC: false
      };
      Actions.DepositPage({
        checkcallbackDate,
        data: datas,
        activeCode: st.activeCode,
        activeName: st.activeName,
        previousPage: "",
        froms: this.props.froms,
        BonusData: st.BonusData[st.BonusIndex],
      });
      this.clearData();
    });
  }

  //充值成功后要给后台传优惠id，
  okBonusId(value) {
    let ST = this.state;
    let data = {
      blackBoxValue: Iovation,
      e2BlackBoxValue: E2Backbox,
      blackBox: E2Backbox,
      bonusId: ST.bonusId,
      amount: ST.money,
      bonusMode: "deposit",
      targetWallet: this.props.promotionsDetail?.bonusProduct,
      couponText: "",
      isMax: false,
      depositBonus: {
        depositCharges: ST.charges,
        depositId: value.transactionId || "",
      },
      successBonusId: value.successBonusId || "",
    };

    fetchRequest(ApiPort.POST_BonusApplications, "POST", data)
      .then((data) => {
        if (data && data.message == "fun88_BonusApplySuccess") {
          window.bonusState = true;
        } else {
          Toasts.fail("优惠申请失败，请联系在线客服", 2);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //存款成功处理
  isSuccess(data) {
    const st = this.state;
    console.log('isSuccess')
    console.log(data)
    // data.vendorDepositBankDetails = {
    //   bankCode: "CMB",
    //   bankName: "招商银行",
    //   bankAccountNumber: "6214834189045108",
    //   bankAccountName: "刘香霖",
    //   bankProvince: "",
    //   bankCity: "",
    //   bankBranch: "",
    //   pgRemark: "请务必在5分钟内付款",
    //   transferAmount: 101
    // };
    //表示优惠过来的存款SignUpBonus
    let checkcallbackDate = "";
    if (st.activeCode == "LB") {
      checkcallbackDate = {
        userName: st.LBFirstName,
        data: st.depositDetail.bankAccounts[st.BankNameKey],
        activeBalanceName: st.activeBalanceName,
        activeCode: st.activeCode,
        activeName: st.activeName,
        payCallback: data,
        ALBTypeActive: "",
        bonusTitle: st.bonusTitle,
      };
      Actions.DepositCenterPage({
        checkcallbackDate,
        previousPage: "",
        froms: this.props.froms,
        BonusData: st.BonusData[st.BonusIndex],
        isSmileLBAvailable: st.isSmileLBAvailable,
        depositCodeClick: () => {
          this.depositCodeClick(st.depositList[0].code, st.depositList[0].name);
        },
      });
    } else if (st.activeCode == 'SR') {
      Actions.SRSecondStep({ secondStepData: data, activeDeposit: st.activeCode });

    } else if (st.activeCode == 'PPB' && data.vendorDepositBankDetails) {
      Actions.PPBSecondStep({
        secondStepData: data,
        activeDeposit: st.activeCode,
        TimeoutSeconds: st.depositDetail && st.depositDetail.setting && st.depositDetail.setting.timeoutSeconds,
      });

    } else if (st.activeCode == "WCLB") {
      checkcallbackDate = {
        userName: st.FirstName,
        data: st.depositDetail.bankAccounts[st.BankNameKey],
        activeBalanceName: st.activeBalanceName,
        activeCode: st.activeCode,
        activeName: st.activeName,
        payCallback: data,
        ALBTypeActive: "",
        bonusTitle: st.bonusTitle,
      };
      Actions.DepositCenterPage({
        checkcallbackDate,
        previousPage: "",
        froms: this.props.froms,
        BonusData: st.BonusData[st.BonusIndex],
        isSmileLBAvailable: st.isSmileLBAvailable,
        depositCodeClick: () => {
          this.depositCodeClick(st.depositList[0].code, st.depositList[0].name);
        },
      });
    } else if (
      st.activeCode == "CTC" &&
      st.CTC_CHANNEL_INVOICE == "INVOICE_AUT"
    ) {
      checkcallbackDate = {
        userName: "",
        data: "",
        activeBalanceName: "",
        activeCode: st.activeCode,
        activeName: st.activeName,
        payCallback: data,
        ALBTypeActive: "",
        bonusTitle: st.bonusTitle,
        INVOICE_AUT: true,
      };
      Actions.DepositCenterPage({
        checkcallbackDate,
        previousPage: "",
        froms: this.props.froms,
        BonusData: st.BonusData[st.BonusIndex],
      });
    } else if (st.activeCode == "ALB") {
      checkcallbackDate = {
        userName: "",
        data: "",
        activeBalanceName: "",
        activeCode: st.activeCode,
        activeName: st.activeName,
        payCallback: data,
        ALBTypeActive: st.ALBTypeActive,
        bonusTitle: st.bonusTitle,
      };
      Actions.DepositCenterPage({
        checkcallbackDate,
        previousPage: "",
        froms: this.props.froms,
        BonusData: st.BonusData[st.BonusIndex],
        isSmileLBAvailable: st.isSmileLBAvailable,
        depositCodeClick: () => {
          this.depositCodeClick(st.depositList[0].code, st.depositList[0].name);
        },
      });
    } else if (
      st.activeCode == "PPB" ||
      st.activeCode == "JDP" ||
      st.activeCode == "OA" ||
      st.activeCode == "WC" ||
      st.activeCode == "BC" ||
      st.activeCode == "BCM" ||
      st.activeCode == "UP" ||
      (st.activeCode == "CTC" &&
        st.CTC_CHANNEL_INVOICE == "INVOICE") ||
      (st.activeCode == "CTC" &&
        st.CTC_CHANNEL_INVOICE == "OTC")
    ) {
      checkcallbackDate = {
        userName: "",
        data: "",
        activeBalanceName: "",
        activeCode: st.activeCode,
        activeName: st.activeName,
        payCallback: data,
        ALBTypeActive: "",
        bonusTitle: st.bonusTitle,
        INVOICE_AUT: false,
        CTC_INVOICE_OTC: (st.activeCode == "CTC" && st.CTC_CHANNEL_INVOICE == "INVOICE") ||
          (st.activeCode == "CTC" && st.CTC_CHANNEL_INVOICE == "OTC"),
      };
      let datas = { ...data, moneys: st.money };
      // 第三方頁
      Actions.DepositPage({
        checkcallbackDate,
        activeCode: st.activeCode,
        data: datas,
        activeName: st.activeName,
        previousPage: "",
        froms: this.props.froms,
        BonusData: st.BonusData[st.BonusIndex],
      });
    } else if (st.activeCode === "CC" || st.activeCode === "AP") {
      this.Countdown();
      this.setState({ PayAready: true });
    } else if (st.activeCode === "QQ") {
      this.PayAreadyQQ()
      // this.setState({ PayAreadyQQ: true });
    }
    this.setState({ isSmileLBAvailable: false });
    // this.clearData()
  }

  //金额输入
  MoneySlider = () => {
    const {
      SliderssRun,
      moneyST,
      money,
      MaxBalShow,
      MinBalShow,
      TransferNumber,
      activeCode,
      OASuggestedAmount,
      depositDetail
    } = this.state;

    const vendorCharges = depositDetail?.setting?.vendorCharges;
    return (
      <View>
        {
          <View>
            <Text
              style={[
                stylespage.inputLabel,
                {
                  marginTop: MoneyInputNoNeedMarginTop.includes(activeCode)
                    ? 0
                    : 15,
                  marginBottom: 5,
                },
              ]}
            >
              存款金额
            </Text>
            <View style={{ backgroundColor: "#fff", borderRadius: 5 }}>
              {/* <Text style={{ color: "#000", fontSize: 12 }}>{`输入金额(￥${MinBalShow}~￥${MaxBalShow})`}</Text> */}
              <View
                style={{
                  borderColor: "#ddd",
                  borderWidth: 1,
                  borderRadius: 5,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextInput
                  // value={money != "" && "￥" + money}
                  value={money}
                  style={{
                    color: "#000",
                    height: 44,
                    width: width - 60,
                  }}
                  keyboardType={"number-pad"}
                  maxLength={10}
                  placeholder={`单笔存款范围:${MinBalShow}-${MaxBalShow},每日可存款${TransferNumber}次`}
                  placeholderTextColor="#BCBEC3"
                  placeholderTextFontSize={14}
                  onChangeText={(value) => {
                    this.moneyChange(value);
                  }}
                  onBlur={() => {
                    this.moneyBlur();
                  }}
                  onFocus={() => {
                    this.setState({ SliderssRun: !SliderssRun, money: 0 });
                  }}
                />
              </View>
              {moneyST != "" && (
                <PromptBox
                  type="error"
                  msg={moneyST}
                  containerStyle={{ marginTop: 8 }}
                />
              )}
              {(activeCode == "OA" || activeCode == "WC") &&
                money.toString().slice(-1) == 0 && (
                  <PromptBox
                    type="hint"
                    msg="请您输入非整数的金额进行充值，例如：301，519元。"
                    containerStyle={{ marginTop: 8 }}
                  />
                )}
              {vendorCharges && (
                <PromptBox
                  type="info"
                  msg={"温馨提示：此交易将征收第三方手续费，请于提交后确认交易详情，再进行转帐。"}
                  containerStyle={{ marginTop: 8 }}
                  textStyle={{ fontWeight: "bold", fontSize: 12 }}
                />
              )}
              {
                // uniqueAmountStatus && OASuggestedAmount.length == 0 &&
                // <Text style={{ color: 'red', fontSize: 11, marginBottom: 10 }}>
                //     基于风控机制，建议提交存款的时候，尾数请避免输入0，建议提交1-9的金额，举例： 135元，128元等的，以免无法提交存款。
                // </Text>
              }
              <View>
                {OASuggestedAmount.length > 0 && this.MoneyNeedThis()}
                {/* {SliderssRun && OASuggestedAmount.length == 0 && this.SliderssRun()} */}
                {/* {!SliderssRun && OASuggestedAmount.length == 0 && this.SliderssRun()} */}
              </View>
            </View>
            {/* <View style={stylespage.moneyas}>
                              <Text style={{ color: '#666666', fontSize: 12 }}>{`单笔最低金额 ${MinBalShow} 元，最高金额 ${MaxBalShow} 元，每日总允许金额 ${DayBalShow} 元`}</Text>
                          </View> */}
          </View>
        }
      </View>
    );
  };

  //只能用建議金額
  MoneyNeedThis = () => {
    const { OASuggestedAmount, money } = this.state;
    return (
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <View style={stylespage.SuggestedAmountArrow}></View>
        <View
          style={{
            backgroundColor: "#F5F5F5",
            paddingTop: 10,
            paddingBottom: 10,
            width: "100%",
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#666666", fontSize: 13, paddingLeft: 5 }}>
            请选择以下存款金额以便快速到账
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              left: 5,
              width: width - 60,
              justifyContent: "space-between",
              flexWrap: "wrap",
              marginTop: 8,
            }}
          >
            {OASuggestedAmount.map((item, index) => {
              return (
                <View key={index} style={{ paddingBottom: 7 }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        {
                          OASuggestedAmount: "",
                        },
                        () => {
                          this.moneyChange("￥" + item, "OASuggestedAmount");
                        }
                      );
                    }}
                  >
                    <View
                      style={[
                        money == item
                          ? stylespage.OAMoneyButtonHover
                          : stylespage.OAMoneyButton,
                      ]}
                    >
                      <Text
                        style={{
                          color: money == item ? "#fff" : "#000",
                          textAlign: "center",
                          lineHeight: 35,
                          fontSize: 12,
                        }}
                      >
                        {"￥" + item}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  //滑动金额初始化
  SliderssRun = () => {
    const { Sliderss } = this.state;
    return (
      <View style={{}}>
        <Text style={{ fontSize: 12 }}>或是使用滑动条</Text>
        <Slider
          value={Sliderss}
          step={0.25}
          minimumTrackTintColor={"red"}
          defaultValue={Sliderss}
          onChange={(value) => {
            this.sliderChange(value);
          }}
        />
        <View
          style={[stylespage.SliderList, { paddingLeft: 10, paddingRight: 10 }]}
        >
          <View style={stylespage.scaleKey} />
          <View style={stylespage.scaleKey} />
          <View style={stylespage.scaleKey} />
          <View style={stylespage.scaleKey} />
          <View style={stylespage.scaleKey} />
        </View>
        <View style={stylespage.SliderList}>
          <Text style={{ fontSize: 11, color: "#000" }}> 0%</Text>
          <Text style={{ fontSize: 11, color: "#000", marginLeft: 5 }}>
            {" "}
            50%
          </Text>
          <Text style={{ fontSize: 11, color: "#000" }}>100%</Text>
        </View>
      </View>
    );
  };

  //获取存款方式
  GetPaymentReload() {
    Toast.loading('加载中...', 200);
    fetchRequest(ApiPort.Payment + "?transactionType=deposit&", "GET")
      .then((res) => {
        let data = res.result.paymentMethods;
        // PiwikEvent("Deposit_wallet");
        Toast.hide();
        if (data) {
          // 過濾未開放的方式
          let newData = data.filter((v) => {
            return DepositListShow.includes(v.code);
          });

          storage.save({
            key: "depositList",
            id: "depositList",
            data: newData,
            expires: null,
          });
          let activeDepositIndex = data.findIndex((item) => {
            return item.code == this.state.nowActiveDeposit;
          });
          if (activeDepositIndex == -1) {
            activeDepositIndex = 0;
          }

          this.setState({
            activeCode: newData[activeDepositIndex].code,
            activeName: newData[activeDepositIndex].name,
            depositList: newData,
          });
          this.depositCodeClick(
            newData[activeDepositIndex].code,
            newData[activeDepositIndex].name
          );
        } else {
          Toasts.fail("网络出错误", 2);
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  depositPiwik(code) {
    switch (code) {
      case "LB":
        PiwikEvent("Deposit Nav", "Click", "Localbank_DepositPage");
        break;
      case "JDP":
        PiwikEvent("Deposit Nav", "Click", "JD_DepositPage");
        break;
      case "UP":
        PiwikEvent("Deposit Nav", "Click", "Unionpay_DepositPage");
        break;
      case "BC":
        PiwikEvent("Deposit Nav", "Click", "CDC_DepositPage");
        break;
      case "BCM":
        PiwikEvent("Deposit Nav", "Click", "MobileCDC_DepositPage");
        break;
      case "ALB":
        PiwikEvent("Deposit Nav", "Click", "LocalbankAlipay_DepositPage");
        break;
      case "OA":
        PiwikEvent("Deposit Nav", "Click", "OnlineAlipay_DepositPage");
        break;
      case "QQ":
        PiwikEvent("Deposit Nav", "Click", "QQwallet_DepositPage");
        break;
      case "AP":
        PiwikEvent("Deposit Nav", "Click", "Astropay_DepositPage");
        break;
      case "CC":
        PiwikEvent("Deposit Nav", "Click", "Cashcard_DepositPage");
        break;
      case "PPB":
        PiwikEvent("Deposit Nav", "Click", "P2PBanking_DepositPage");
        break;
      case "WCLB":
        PiwikEvent("Deposit Nav", "Click", "LocalbankWechat_DepositPage");
        break;
      case "WC":
        PiwikEvent("Deposit Nav", "Click", "OnlineWechat_DepositPage");
        break;
      case "CTC":
        PiwikEvent("Deposit Nav", "Click", "Crypto_DepositPage");
        break;
      case "SR":
        PiwikEvent("Deposit Nav", "Click", "SmallRiver_DepositPage");
        break;
      default:
        break;
    }
  }

  //获取存款详情
  depositCodeClick(code, name) {
    const Filtercode = this.state.depositList.filter(
      (type) => type.code == code
    );

    //支付渠道
    let BoxM = [];
    Filtercode[0].availableMethods.length > 0 &&
      Filtercode[0].availableMethods.map(function (item) {
        if (item.methodType != "DEFAULT" && item.methodCode != "DEFAULT") {
          BoxM.push({
            value: item.methodCode,
            label: item.methodType,
            isNew: item.isNew || false,
          });
        }
      });

    let BoxMs = BoxM.length > 0 ? BoxM[0].value : "DEFAULT";

    //尾数是否为0的判断
    let depositList = this.state.depositList;
    let activeDeposit = depositList.find((item) => {
      return item.code == code;
    });
    this.setState({
      isQrcodeALB: false,
      CTC_CHANNEL_INVOICE: "",
      activeName: name,
      activeCode: code,
      MaxBal: "0.00",
      moneyST: "",
      MinBal: "0.00",
      monthDate: "月份",
      yearDate: "年份",
      okPayBtn: false,
      CTCtype: 0,
      depositDetail: "",
      Sliderss: 0,
      BankNameKey: 0,
      chargesMoney: 0,
      SliderssRun: !this.state.SliderssRun,
      money: "", //不清空金额
      caredNum: "",
      PINNum: "",
      APcaredUSD: false,
      FirstNameChange: false,
      bonusCoupon: "",
      accountHolderName: "",
      accountHolderNameTest: "",
      PrefillRegisteredName: false,
      ShowDepositorNameField: false,
      activeDeposit,
      uniqueAmountStatus: activeDeposit.uniqueAmountStatus,
      paymentchannel: BoxM, //支付渠道選擇  benji
      paymentchannelEND: BoxM.length > 0 ? BoxM[0].value : "DEFAULT", //支付渠道選擇  benji
      OASuggestedAmount: [],
      SRdisabledErr: false,
      SRAmountsActive: 9999,
      SuggestedAmounts: [],
    });
    Toast.loading("加载中...", 200);
    let isMobile = code == "BC" ? false : true;
    let getDeposit =
      "?transactionType=deposit&method=" +
      code +
      "&MethodCode=" +
      BoxMs +
      "&isMobile=" +
      isMobile +
      "&";

    fetchRequest(ApiPort.PaymentDetails + getDeposit, "GET")
      .then((res) => {
        let data = res.result;
        console.log(data, "GetDetails");
        this.depositPiwik(code);
        Toast.hide();
        //验证是否能存款
        console.log("datadatadatadata111", data);
        // this.validation()
        let MaxBal = data.setting ? data.setting.maxBal : "0.00";
        let MinBal = data.setting ? data.setting.minBal : "0.00";
        let charges = data.setting ? data.setting.charges : 0;
        // let MaxBalShow = this.formatAmount(MaxBal),
        //     MinBalShow = this.formatAmount(MinBal),
        //     DayBalShow = this.formatAmount(DayBal);
        console.log("datadatadatadata", data);
        let MaxBalShow = data.setting ? data.setting.maxBal : "0.00";
        let MinBalShow = data.setting ? data.setting.minBal : "0.00";
        let DayBalShow = data.setting ? data.setting.charges : 0;
        let TransferNumber = data.setting ? data.setting.transferNumber : 0;
        console.log("datadatadatadata222", data);
        //美元汇率
        let USDRate = 0;
        if (code === "AP" && data.setting != "") {
          USDRate =
            data.setting.exchangeRates != ""
              ? data.setting.exchangeRates[0].rate
              : 0;
        }

        if (code == "CTC") {
          let CTC_CHANNEL_INVOICE =
            activeDeposit.availableMethods[0].methodCode;
          this.setState({ CTC_CHANNEL_INVOICE });
          //急速虚拟币支付默认金额1
          if (CTC_CHANNEL_INVOICE == "CHANNEL") {
            noewMoney = MinBal.toString();
            this.setState({ okPayBtn: true });
          }
        }
        let SuggestedAmounts = data.suggestedAmounts ? data.suggestedAmounts : [];
        let ShowDepositorNameField =
          data.setting.showDepositorNameField || false;
        let PrefillRegisteredName = data.setting.prefillRegisteredName || false;

        let IsAutoAssign = data.setting.isAutoAssign
          ? data.setting.isAutoAssign
          : false;

        this.setState(
          {
            MaxBal,
            MinBal,
            USDRate,
            DayBal: data.setting.dayBal,
            depositDetail: data,
            charges,
            MaxBalShow,
            MinBalShow,
            DayBalShow,
            TransferNumber,
            ShowDepositorNameField,
            PrefillRegisteredName,
            IsAutoAssign,
            SuggestedAmounts
          },
          () => {
            //检查最低金额符合
            // this.moneyChange(noewMoney)
          }
        );
        this.SRdisabledErr(SuggestedAmounts);//SR存款提示
      })
      .catch(() => {
        Toast.hide();
      });
  }

  //檢查有無規定金額  benji
  checkAmount(passMoney) {
    const { activeCode, money, paymentchannelEND } = this.state;

    // 金額是0，api會報錯，先擋掉
    if (!money) {
      return;
    }

    const moneyValue = passMoney || money;

    let url = `isMobile=true&amount=${moneyValue}&Method=${activeCode}&MethodCode=${paymentchannelEND}&`;
    console.log(ApiPort.SuggestedAmount + url, "TT1111");
    Toast.loading("检测中,请稍候...", 6);
    fetchRequest(ApiPort.SuggestedAmount + url, "GET").then((res) => {
      console.log(res, "SuggestedAmount");
      Toast.hide();
      if (res && res.result && res.result.length > 0) {
        this.setState(
          {
            OASuggestedAmount: res.result,
            okPayBtn: false,
          },
          () => {
            // this.moneyChange(this.state.money || '0')
          }
        );
      } else {
        this.setState(
          {
            payMoneyST: true,
            payMoneySTMsg: "",
          },
          () => {
            //this.moneyChange(this.state.money || '0')
          }
        );
      }
    });
  }

  //檢測支付渠道 最小最大金額
  checkAgn(key) {
    const { activeCode, paymentchannelEND } = this.state;
    let typeS = key ? key : paymentchannelEND;

    //isMobile   判斷是不是 手機版 ,不是要寫false
    Toast.loading("加载中,请稍候...", 6);
    fetchRequest(
      ApiPort.PaymentDetails +
      "?transactionType=deposit&method=" +
      activeCode +
      "&MethodCode=" +
      typeS +
      "&",
      "GET"
    ).then((res) => {
      console.log(res, "支付渠道A");
      Toast.hide();
      const data = res.result;

      let MaxBal = data.setting ? data.setting.maxBal : "0.00";
      let MinBal = data.setting ? data.setting.minBal : "0.00";
      let DayBal = data.setting ? data.setting.dayBal : "0.00";
      let charges = data.setting ? data.setting.charges : 0;

      let MaxBalShow = MaxBal;
      let MinBalShow = MinBal;
      let DayBalShow = DayBal;
      let TransferNumber = data.setting ? data.setting.transferNumber : 0;
      let ShowDepositorNameField = data.setting.showDepositorNameField || false;
      let PrefillRegisteredName = data.setting.prefillRegisteredName || false;
      let IsAutoAssign = data.setting.isAutoAssign
        ? data.setting.isAutoAssign
        : false;
      let SuggestedAmounts = data.suggestedAmounts ? data.suggestedAmounts : [];

      this.setState(
        {
          MaxBal,
          MinBal,
          DayBal,
          MaxBalShow,
          MinBalShow,
          DayBalShow,
          charges,
          depositDetail: data,
          TransferNumber,
          ShowDepositorNameField,
          PrefillRegisteredName,
          IsAutoAssign,
          SuggestedAmounts
        },
        () => {
          //检查最低金额符合
          // this.moneyChange(this.state.money || '0')
        }
      );
      this.SRdisabledErr(SuggestedAmounts);//SR存款提示
    });
  }

  //只給有支付渠道用
  paymentchannelDWButton = (value) => {
    const { activeCode } = this.state;
    //只給支付渠道用
    if (activeCode == "OA") {
      this.setState({
        paymentchannelEND: value,
        OASuggestedAmount: [],
        money: "",
        moneyST: "",
        chargesMoney: 0,
        Sliderss: 0,
        accountHolderName: "",
        accountHolderNameTest: "",
      });
    } else {
      this.setState({
        paymentchannelEND: value,
        OASuggestedAmount: []
      });
    }



    setTimeout(() => {
      this.checkAgn(value);
    }, 600);
  };

  //验证信息完整
  validation() {
    const st = this.state;
    //新增存款姓名，
    const accountHolderNameVal = ["BC", "BCM", "OA", "PPB", "UP"];
    let okPayBtn = false;
    //lb本银验证
    if (st.activeCode === "LB") {
      if (st.money && !st.moneyST && !st.LBFirstNameTest) {
        okPayBtn = true;
      }
    } else if (st.activeCode === "CC") {
      if (
        st.money &&
        !st.caredNumST &&
        !st.PINNumST &&
        !st.moneyST &&
        st.caredNum &&
        st.PINNum
      ) {
        okPayBtn = true;
      }
    } else if (st.activeCode === "AP") {
      if (
        st.money &&
        !st.caredNumST &&
        !st.PINNumST &&
        !st.moneyST &&
        st.monthDate != "月份" &&
        st.caredNum &&
        st.PINNum
      ) {
        okPayBtn = true;
      }
    } else if (st.activeCode === "CTC" && st.CTC_CHANNEL_INVOICE == "CHANNEL") {
      okPayBtn = true;
    } else if (
      accountHolderNameVal.includes(st.activeCode) &&
      st.ShowDepositorNameField &&
      !st.PrefillRegisteredName
    ) {
      if (st.accountHolderName && !st.accountHolderNameTest) {
        okPayBtn = true;
      }
    } else if (st.money && !st.moneyST) {
      //其他银行只要输入进入和选择账户
      okPayBtn = true;
    }

    //提交按钮默认高亮，点击提示信息填写完整,置灰
    // key && this.setState({ okPayModal: !okPayBtn })

    this.setState({ okPayBtn });
  }

  //滑动条金额
  sliderChange(value) {
    console.log("asdasdasd", value);
    const st = this.state;
    let money = 0;
    if (value == 0) {
      money = 100.0;
    } else {
      money = (value * this.state.MaxBal).toFixed(2);
    }
    //除了以下的都不能输入小数点
    if (
      st.activeCode !== "ALB" ||
      st.activeCode !== "LB" ||
      st.activeCode !== "WCLB" ||
      st.activeCode !== "AP"
    ) {
      money = Math.ceil(money);
    }

    //这些是不能输入尾数0的存款
    if (st.uniqueAmountStatus) {
      if (money.toString().slice(-1) == 0) {
        money = Number(money) - 1;
      }
    }
    this.moneyChange("￥" + money);
  }

  //输入金额
  moneyChange(value, type) {
    console.log(type, "moneyChange");
    const st = this.state;
    let test = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/g;
    let moneyST = "";
    let Sliderss = 0;
    let money = value.replace("￥", "");
    let NeedCallApiCheck = [
      "OA",
      "QQ",
      "JDP",
      "BC",
      "BCM",
      "WC",
      "ALB",
      "UP",
      "PPB",
      "BCM",
    ]; //需要call API檢查金額
    //除了以下的都不能输入小数点
    if (
      st.activeCode !== "ALB" ||
      st.activeCode !== "LB" ||
      st.activeCode !== "WCLB" ||
      st.activeCode !== "AP"
    ) {
      money = money.replace(".", "");
    }

    console.log(st.activeCode, "st.activeCode");

    if (money == "" || Number(money) == 0) {
      if (st.activeCode === "CTC") {
        moneyST = "金额必须为 " + st.MinBal + " 或以上的金额";
      } else {
        moneyST = "最低存款金额 " + st.MinBal + "元";
      }
    } else if (test.test(Number(money)) != true) {
      moneyST = "请输入正确的金额格式";
    } else if (Number(money) > Number(st.MaxBal)) {
      if (st.activeCode === "CTC") {
        moneyST = "金额必须为 " + st.MaxBal + " 或以下的金额";
      } else {
        moneyST = "最高存款金额 " + st.MaxBal + "元";
      }
    } else if (Number(money) < Number(st.MinBal)) {
      if (st.activeCode === "CTC") {
        moneyST = "金额必须为 " + st.MinBal + " 或以上的金额";
      } else {
        moneyST = "最低存款金额 " + st.MinBal + "元";
      }
    } else if (NeedCallApiCheck.indexOf(st.activeCode) != -1) {
      console.log("moneymoneymoneymoney", money);
      if (!type) {
        //檢測金額  benji
        debounce(() => this.checkAmount(money), 500);
      }
    } else if (st.uniqueAmountStatus) {
      if (money.toString().slice(-1) == 0) {
        moneyST = '金额必须以 "1-9" 结尾';
      } else {
        moneyST = "";
      }
    } else {
      moneyST = "";
      // Sliderss = money / MaxBal;
    }
    //qq支付微支付在线支付宝有个实际到账
    let chargesMoney = 0;
    if ((st.activeCode == 'QQ' || st.activeCode == 'OA' || st.activeCode == 'WC' || st.activeCode == 'PPB' || st.activeCode == 'JDP' || st.activeCode == 'BC' || st.activeCode == 'BCM' || st.activeCode == 'UP') && moneyST == '') {
      chargesMoney = Number(money) + (Number(money) * Number(st.charges))
    }

    this.setState({ money, moneyST, Sliderss, chargesMoney }, () => {
      this.validation();
    });
  }

  //美元兑换处理
  APcaredUSDMoney(value) {
    const st = this.state;
    let USDRateMoney = "0.00"; //美元
    let test = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/g;
    let moneyST = "";
    let money = value.replace("￥", "");

    if (money == "" || Number(money) == 0) {
      moneyST = "最低存款金额$" + (st.MinBal / st.USDRate).toFixed(2);
    } else if (test.test(Number(money)) != true) {
      moneyST = "请输入正确的金额格式";
    } else if (Number(money) > (st.MaxBal / st.USDRate).toFixed(2)) {
      moneyST = "最大存款金额为：$" + (st.MaxBal / st.USDRate).toFixed(2);
    } else if (Number(money) < (st.MinBal / st.USDRate).toFixed(2)) {
      moneyST = "最低存款金额$" + (st.MinBal / st.USDRate).toFixed(2);
    } else {
      moneyST = "";
    }
    //算美元金额
    if (moneyST == "") {
      // USDRateMoney = st.USDRate * 10 * money / 10;
      USDRateMoney = parseInt(st.USDRate * money);
    }

    this.setState({ money, moneyST, USDRateMoney }, () => {
      this.validation();
    });
  }

  //输入金额后校验优惠信息
  moneyBlur() {
    this.bonusChange(this.state.bonusId, this.state.money);
  }

  //账户选择
  _dropdown_renderButtonText(rowData) {
    return `${rowData.name}`;
  }

  //账户选择下拉
  _dropdown_1_renderRow(rowData, rowID, highlighted) {
    return (
      <View style={{ width: width - 50 }}>
        <Text
          style={{
            color: highlighted ? "red" : "#000",
            paddingLeft: 15,
            lineHeight: 38,
          }}
        >{`${rowData.name}`}</Text>
      </View>
    );
  }

  //支付宝转账选择
  ALB_dropdown_renderButtonText(rowData) {
    return `${rowData.name}`;
  }

  //支付宝转账下拉
  ALB_dropdown_1_renderRow(rowData, rowID, highlighted) {
    return (
      <View style={{ width: width - 50 }}>
        <Text
          style={{
            color: highlighted ? "red" : "#000",
            paddingLeft: 15,
            lineHeight: 38,
          }}
        >{`${rowData.name}`}</Text>
      </View>
    );
  }

  //支付宝转账
  ALB_balanceSelect = (key) => {
    this.setState(
      {
        ALBTypeActive: ALBType[key].code,
      },
      () => {
        this.okPayClick();
      }
    );
  };

  //AP卡卡号
  APcaredChange(value) {
    const numTest = /^[0-9]{16,30}$/;
    let caredNumST = "";
    if (value == "") {
      caredNumST = "请输入卡号";
    } else if (numTest.test(value) != true) {
      caredNumST = "卡号格式错误";
    }
    //判断是不是美元卡
    let APcaredUSD =
      (caredNumST == "" && value != "" && value.slice(3, 4) == "6") || false;

    this.setState({ money: 0, caredNum: value, caredNumST, APcaredUSD }, () => {
      this.validation();
    });
  }

  //同城卡卡号
  CCcaredChange(value) {
    const numTest = /^[0-9]{4,30}$/;
    let caredNumST = "";
    if (value == "") {
      caredNumST = "请输入卡号";
    } else if (numTest.test(value) != true) {
      caredNumST = "卡号格式错误";
    }
    this.setState({ caredNum: value, caredNumST }, () => {
      this.validation();
    });
  }

  //同城卡密码
  CCPINChange(value) {
    const numTest = /^[0-9]{4,30}$/;
    let PINNumST = "";
    if (value == "") {
      PINNumST = "请输入卡密码";
    } else if (numTest.test(value) != true) {
      PINNumST = "卡密码格式错误";
    }
    this.setState({ PINNum: value, PINNumST }, () => {
      this.validation();
    });
  }

  monthDateChange = (value) => {
    let Wdate = new Date(value);
    let Wy = Wdate.getFullYear();
    let Wm = Wdate.getMonth() + 1;
    if (Number(Wm) < 10) {
      Wm = "0" + Wm.toString();
    }
    this.setState(
      {
        monthDate: Wm,
        yearDate: Wy,
      },
      () => {
        this.validation();
      }
    );
  };

  //支付渠道選擇
  OASuggested_dropdown_renderButtonText(rowData) {
    return `${rowData.label}`;
  }

  //支付渠道下拉
  OASuggested_dropdown_1_renderRow(rowData, rowID, highlighted) {
    return (
      <View style={{ width: width - 50 }}>
        <Text
          style={{
            color: highlighted ? "red" : "#000",
            paddingLeft: 15,
            lineHeight: 38,
          }}
        >{`${rowData.label}`}</Text>
      </View>
    );
  }

  //LB存款选择
  LB_dropdown_renderButtonText(rowData) {
    return `${rowData.bankName}`;
  }

  //LB存款下拉
  LB_dropdown_1_renderRow(rowData, rowID, highlighted) {
    return (
      <View style={{ width: width - 50 }}>
        <Text
          style={{
            color: highlighted ? "red" : "#000",
            paddingLeft: 15,
            lineHeight: 38,
          }}
        >{`${rowData.bankName}`}</Text>
      </View>
    );
  }

  //在线存款选择
  BC_dropdown_renderButtonText(rowData) {
    return `${rowData.name}`;
  }

  //在线存款下拉
  BC_dropdown_1_renderRow(rowData, rowID, highlighted) {
    return (
      <View style={{ width: width - 50 }}>
        <Text
          style={{
            color: highlighted ? "red" : "#000",
            paddingLeft: 15,
            lineHeight: 38,
          }}
        >{`${rowData.name}`}</Text>
      </View>
    );
  }

  //在线存款选择
  BCbank_dropdown_renderButtonText(rowData) {
    return `${rowData.name}`;
  }

  //在线存款下拉
  BCbank_dropdown_1_renderRow(rowData, rowID, highlighted) {
    return (
      <View style={{ width: width - 50 }}>
        <Text
          style={{
            color: highlighted ? "red" : "#000",
            paddingLeft: 15,
            lineHeight: 38,
          }}
        >{`${rowData.name}`}</Text>
      </View>
    );
  }

  //LB选择银行卡选择
  bankSelect = (key) => {
    this.setState({
      BankNameKey: key,
    });
  };

  renderPage({ item, index }) {
    return (
      <View key={index}>
        <Image
          resizeMode="contain"
          style={{ width: width / 1.3, height: width / 1.3 }}
          source={item.imgs}
        />
        <Text
          style={{
            lineHeight: 35,
            marginTop: 30,
            color: "#220000",
            fontSize: 17,
          }}
        >
          {item.title}
        </Text>
        <Text style={{ color: "#220000", fontSize: 13 }}>{item.conter}</Text>
      </View>
    );
  }

  //LB填写姓名
  LBFirstName(value) {
    const nameTest = /^[\u4e00-\u9fa5\u0E00-\u0E7F ]{2,15}$/;
    let LBFirstNameTest = "";
    if (value == "") {
      LBFirstNameTest = "请输入姓名";
    } else if (nameTest.test(value) != true) {
      LBFirstNameTest = "姓名格式错误";
    }
    this.setState(
      { LBFirstName: value, LBFirstNameTest, FirstNameChange: true },
      () => {
        this.validation();
      }
    );
  }

  accountHolderName(value) {
    const nameTest = /^[\u4e00-\u9fa5\u0E00-\u0E7F ]{2,15}$/;
    let accountHolderNameTest = "";
    if (value == "" || value.length < 2) {
      accountHolderNameTest = "请输入全名";
    } else if (nameTest.test(value) != true) {
      accountHolderNameTest = "格式不正确";
    }
    this.setState({ accountHolderName: value, accountHolderNameTest }, () => {
      this.validation();
    });
  }

  //优惠
  _dropdown_1_renderButtonText(rowData) {
    return (
      <Text style={{ width: width * 0.7 }} numberOfLines={1}>{`${rowData.title === "fun88_ApplyNextTime" ? "下回再参与！" : rowData.title
        }`}</Text>
    );
  }

  //优惠下拉列表
  _dropdown_3_renderRow(rowData, rowID, highlighted) {
    return (
      <View
        style={{
          width: width - 50,
          padding: 15,
          backgroundColor: highlighted ? "#00A6FF" : "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text style={{ color: highlighted ? "#fff" : "#000" }}>
          {rowData.title != "" &&
            (rowData.title === "fun88_ApplyNextTime"
              ? "下回再参与！"
              : rowData.title)}
        </Text>
        {/* <Text style={{color: highlighted? '#666': 'transparent'}}>✓</Text> */}
      </View>
    );
  }

  //拿優惠
  getBonus() {
    Toast.loading("加载中...", 200);
    this.setState({ BonusData: "", BonusMSG: "" });
    fetchRequest(
      ApiPort.Bonus + "?transactionType=Deposit&wallet=" + "MAIN" + "&",
      "GET"
    )
      .then((res) => {
        Toast.hide();
        const data = res.result;
        if (data.length > 0) {
          let promotionsId =
            this.props.promotionsDetail.bonusId;
          let BonusIndex = data.findIndex((v) => v.id == promotionsId);
          if (BonusIndex == -1) {
            BonusIndex = 0;
          }
          this.setState(
            { BonusData: data, BonusIndex, bonusId: promotionsId },
            () => {
              //默认选择优惠验证
              this.bonusChange(promotionsId, this.state.money);
            }
          );
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  BonusButton = (key) => {
    let bonusId = this.state.BonusData[key].id;
    this.setState(
      {
        BonusIndex: key,
        bonusId,
        bonusCouponKEY: this.state.BonusData[key].bonusCouponID, //是否需要优惠码
      },
      () => {
        this.bonusChange(bonusId, this.state.money);
      }
    );
  };
  //获取优惠详情信息
  bonusChange = (id, money) => {
    let m = money.toString().replace("￥", "");
    let st = this.state;

    if (id == 0 || this.state.moneyST) {
      //金额格式错误和不选择优惠
      this.setState({ BonusMSG: "" });
      return;
    }

    if (st.activeCode == "AP") {
      //AP充值换美元处理
      m = st.APcaredUSD ? st.USDRateMoney : m;
    }
    let data = {
      transactionType: "Deposit",
      bonusId: id,
      amount: m || 1, //没有输入金额时候传1过去拿最低充值金额,传0过去拿不到
      wallet: this.props.promotionsDetail?.bonusProduct,
      couponText: "string",
    };
    fetchRequest(ApiPort.BonusCalculate, "POST", data)
      .then((data) => {
        if (data.previewMessage != "") {
          this.setState({
            BonusMSG: id != 0 ? data.previewMessage : '',
            // BonusMSG: "",
          });
        } else if (data.errorMessage != "") {
          this.setState({
            BonusMSG: id != 0 ? data.errorMessage : "",
          });
        }
      })
      .catch(() => {
        Toast.fail(data.errorMessage, 2);
      });
  };

  //姓名认证
  MemberName(value) {
    const nameTest = /^[\u4e00-\u9fa5\u0E00-\u0E7F ]{2,15}$/;
    let MemberNameTest = "";
    if (value == "") {
      MemberNameTest = "请输入全名";
    } else if (nameTest.test(value) != true) {
      MemberNameTest = "真实姓名格式有误";
    }
    this.setState({ MemberName: value, MemberNameTest });
  }

  CTCchange(item, index) {
    let activeDeposit = this.state.activeDeposit;
    this.setState({
      CTCtype: index,
      CTC_CHANNEL_INVOICE: item.methodCode,
      activeName: item.methodType,
    });
    this.checkAgn(item.methodCode);
    if (item.methodCode == "CHANNEL") {
      this.setState({ okPayBtn: true });
    } else {
      this.setState({ okPayBtn: false });
    }
    if (item.methodCode == "CHANNEL") {
      PiwikEvent("Deposit_Nav", "Confirm", "Crypto_Channel");
    } else if (item.methodCode == "INVOICE") {
      PiwikEvent("Deposit_Nav", "Confirm", "Crypto_Invoice1");
    } else if (item.methodCode == "INVOICE_AUT") {
      PiwikEvent("Deposit_Nav", "Confirm", "Crypto_Invoice2");
    } else {
      PiwikEvent("Deposit_Nav", "Confirm", "Crypto_OTC");
    }
  }

  CHANNEL_change(key) {
    this.setState({ CTCListtype: key });
    let code = this.state.depositDetail.banks[key].code;
    if (code == "BTC") {
      PiwikEvent("Deposit_Nav", "Confirm", "Crypto_BTC");
    } else if (code == "ETH") {
      PiwikEvent("Deposit_Nav", "Confirm", "Crypto_Invoice2");
    } else if (code == "USDT-ERC20") {
      PiwikEvent("Deposit_Nav", "Confirm", "Crypto_ERC20");
    } else if (code == "USDT-TRC20") {
      PiwikEvent("Deposit_Nav", "Confirm", "Crypto_TRC20");
    }
  }

  // LB 取消充值
  CancelPaybnbDeposit(val) {
    if (this.state.isSmileLBAvailable) {
      return;
    }
    fetchRequest(
      ApiPort.CancelPaybnbDeposit + "depositId=" + val.transactionId + "&",
      "POST"
    );
  }

  PayAready() {
    this.setState({ PayAready: false });
  }

  formatAmount(num) {
    if (!num) {
      return 0;
    }
    let numCount = num.toString().split(".");
    let numCountVal =
      (numCount[0] + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,") +
      (numCount[1] ? "." + numCount[1].toString().substr(0, 2) : "");
    return typeof num === "number" && isNaN(num) ? 0 : numCountVal;
  }

  noBankTextUI = () => {
    return (
      <View
        style={{
          backgroundColor: "#EFEFF4",
          borderRadius: 8,
          height: 44,
          width: "100%",
        }}
      >
        <Text
          onPress={() => {
            LiveChatOpenGlobe();
          }}
          style={{
            fontSize: 14,
            lineHeight: 44,
            paddingLeft: 12,
            color: "#999",
          }}
        >
          没有可使用的银行，请联系在线客服。
        </Text>
      </View>
    );
  };
  noBankTextUI2 = () => {
    return (
      <View
        style={{
          backgroundColor: "#EFEFF4",
          borderRadius: 8,
          height: 44,
          width: "100%",
        }}
      >
        <Text
          onPress={() => {
            LiveChatOpenGlobe();
          }}
          style={{
            fontSize: 14,
            lineHeight: 44,
            paddingLeft: 12,
            color: "#999",
          }}
        >
          请联系客服添加
        </Text>
      </View>
    );
  };

  startTiming() {
    this.PPBtimerID = setInterval(() => {
      this.setState({
        PPBTimer: this.state.PPBTimer + 1
      });
    }, 1000);
  }

  PPBLoading() {
    const { PPBTimer } = this.state;
    if (PPBTimer <= 25) {
      return Toast.loading("正在为您匹配合适的账户…", 0);
    } else if (PPBTimer <= 50 && PPBTimer > 25) {
      return Toast.loading("账户匹配中，请耐心等待…", 0);
    } else {
      return Toast.loading("交易繁忙中，乐天使请您耐心等待10秒 或使用其他存款方式...", 0);
    }
  }

  stopPPBLoading() {
    this.PPBtimerID && clearInterval(this.PPBtimerID);
    this.setState({
      PPBTimer: 0
    });
  }

  getIconWidth = (code) => {
    switch (code) {
      case "AP":
        return 40;
      default:
        return 22;
    }
  }

  getIconHeight = (code) => {
    switch (code) {
      case "AP":
        return 15;
      default:
        return 22;
    }
  }

  render() {
    window.goHome = () => {
      Actions.pop();
    };
    const {
      accountHolderName,
      accountHolderNameTest,
      ShowDepositorNameField,
      PrefillRegisteredName,
      keyboardOpen,
      depositList,
      activeCode,
      activeName,
      Sliderss,
      moneyST,
      money,
      MaxBal,
      MinBal,
      activeBalanceName,
      allBalance,
      defaultBalance,
      LBnameTest,
      TransferNumber,
      BonusData,
      BonusIndex,
      bonusKey,
      BonusMSG,
      bonusCouponID,
      okPayBtn,
      nextBtn,
      IsAutoAssign,
      PayAready,
      bonusCoupon,
      caredNum,
      caredNumST,
      PINNum,
      PINNumST,
      monthDate,
      yearDate,
      checkWallet,
      activeBalance,
      activeDeposit,
      CTCtype,
      CTCListtype,
      CTC_CHANNEL_INVOICE,
      CTC_CHANNEL_pay,
      activeSlide,
      ISpromp,
      BC_Deposit,
      isSmileLBAvailable,
      MemberName,
      MemberNameTest,
      chargesMoney,
      Countdown,
      depositDetail,
      APcaredUSD,
      USDRateMoney,
      USDRate,
      SignUpMoney,
      charges,
      okPayModal,
      FirstName,
      curBonusTitle,
      PayAreadyQQ,
      depositPageDate,
      isPopup,
      ppbVisible,
      ppbVisibleErr,
      MaxBalShow,
      MinBalShow,
      DayBalShow,
      isQrcodeALB,
      bannerData,

      DepositData,
      SuggestedAmounts,
      SRdisabledErr,
      moreDepositWithdrawal,
      SRAmountsActive,
      depositErrModal,
      FirstNameModal,
      isShowRpeatModal,
      lastDepositID,
      lastDepositAmount,
      PPBTimer
    } = this.state;
    const { paymentchannel, paymentchannelEND } = this.state; //支付渠道
    window.showPushDeposit = (showPush) => {
      this.setState({ showPush });
    };
    return (
      <View style={{ flex: 1 }}>
        {PPBTimer > 0 && (
          this.PPBLoading()
        )}
        {
          this.state.chargeModalVisible &&
          <ChargeModal
            isVisible={this.state.chargeModalVisible}
            activeCode={activeCode}
            appliedData={DepositData}
            closePop={(val) => this.setState({ chargeModalVisible: val }, () => this.isSuccess(DepositData))}
            TimeoutSeconds={depositDetail.setting.timeoutSeconds || ''}
          />
        }
        <Modal
          animationType='none'
          transparent={true}
          visible={FirstNameModal}
          onRequestClose={() => {
          }}
          style={{ padding: 0, width: width / 1.3 }}
        >
          <View style={stylespage.secussModal}>
            <Text style={{ color: '#222222', lineHeight: 35, fontSize: 18 }}>提醒</Text>
            <Text style={{
              color: '#222222',
              padding: 10,
              paddingBottom: 20,
              textAlign: 'center',
              lineHeight: 19
            }}>{`您好，为了保障您账户资金的安全，\n请先完善个人资料。`}</Text>
            <Touch onPress={() => {
              this.setState({ FirstNameModal: false }, () => {
                Actions.pop();
                Actions.userInfor();
              });
            }} style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width / 1.5 }}>
              <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 38, }}>我知道了</Text>
            </Touch>
          </View>
        </Modal>

        {/* 网银转账提示 和错误提示 */}
        <Modals
          isVisible={ppbVisible || ppbVisibleErr}
          backdropColor={'#000'}
          backdropOpacity={0.4}
          style={{ justifyContent: 'center', margin: 0, padding: 25 }}
        >
          <View style={stylespage.ppbModal}>
            <View style={stylespage.ppbModalTitle}>
              <Text style={{
                color: '#fff',
                lineHeight: 42,
                textAlign: 'center',
                fontSize: 16
              }}>{ppbVisible ? '存款' : '温馨提醒'}</Text>
            </View>
            <View style={{ paddingHorizontal: 15, paddingBottom: 15 }}>
              {
                ppbVisible &&
                <View>
                  <Text style={stylespage.ppbOrder}>订单{DepositData.transactionId}创建成功。</Text>
                  <View style={stylespage.ppbModalMsg}>
                    <Text style={{ color: '#83630B', fontSize: 12, lineHeight: 18 }}>乐天使温馨提醒 :
                      请在5分钟之内完成支付，以免到账延迟。</Text>
                  </View>
                </View>
              }
              {
                ppbVisibleErr &&
                <Text style={stylespage.ppbOrder2}>当前交易繁忙，推荐使用USDT存款方式，体验极致存款速度，安全安心。</Text>
              }
              <Touch onPress={() => {
                if (ppbVisible) {
                  this.setState({ ppbVisible: !ppbVisible }, () => {
                    this.isSuccess(DepositData);
                  });
                } else {
                  this.setState({ ppbVisibleErr: !ppbVisibleErr });
                }
              }} style={stylespage.ppbModalBtn}>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>{ppbVisible ? '我知道了' : ppbVisibleErr ? '知道了' : '好的'}</Text>
              </Touch>
            </View>
          </View>
        </Modals>

        {/* 存款错误弹窗，使用errorMessage */}
        <Modals
          isVisible={depositErrModal}
          backdropColor={'#000'}
          backdropOpacity={0.4}
          style={{ justifyContent: 'center', margin: 0, padding: 25 }}
        >
          <View style={stylespage.ppbModal}>
            <Touch style={stylespage.modalClose} onPress={() => {
              this.setState({ depositErrModal: false });
            }}>
              <Image
                source={require('../../images/close.png')}
                resizeMode='stretch'
                style={{ width: 16, height: 16 }}
              />
            </Touch>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20, }}>
              <Image
                source={require('../../images/warn.png')}
                resizeMode='stretch'
                style={{ width: 52, height: 52 }}
              />
            </View>
            <Text style={{ color: '#333333', fontSize: 13, lineHeight: 20, textAlign: 'center' }}>
              {Boolean(DepositData.errorMessage) ? `${DepositData.errorMessage}` : '网络错误，请稍后重试'}
            </Text>
            <View style={{ padding: 15 }}>
              <Touch onPress={() => {
                this.setState({ depositErrModal: false });
              }} style={stylespage.ppbModalBtn}>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 15 }}>我知道了</Text>
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
          <View style={stylespage.moreOtpModal}>
            <Image resizeMode='contain' source={require("../../images/warn.png")} style={{ width: 64, height: 64 }} />
            <Text style={{ color: '#666', lineHeight: 20, textAlign: 'center', paddingTop: 20, fontSize: 14 }}>
              {`提醒您，完成验证后，即可享有更多存款\n和提款方式。`}
            </Text>
            <View style={stylespage.moreOtpBtn}>
              <Touch onPress={() => {
                this.setState({ moreDepositWithdrawal: false });
              }} style={stylespage.moreOtpLeftBtn}>
                <Text style={stylespage.moreOtpItem}>稍后验证</Text>
              </Touch>
              <Touch onPress={() => {
                this.setState({ moreDepositWithdrawal: false }, () => {
                  Actions.BankCardVerify();
                });
              }} style={stylespage.moreOtpRightBtn}>
                <Text style={[stylespage.moreOtpItem, { color: '#fff', lineHeight: 42 }]}>立即验证</Text>
              </Touch>
            </View>
          </View>
        </Modals>

        {/* 存款锁定提示 */}
        <Modal
          animationType="none"
          transparent={true}
          visible={isPopup}
          style={{ padding: 0, width: width / 1.3 }}
        >
          <View style={stylespage.secussModal}>
            <Text style={{ color: "#222222", lineHeight: 35, fontSize: 18 }}>
              信息
            </Text>
            <Text
              style={{
                color: "#696969",
                padding: 10,
                fontSize: 13,
                lineHeight: 22,
              }}
            >
              抱歉，由于您还有未完成的存款记录，暂时无法重复提交。若您已转账成功，请
              <Text
                onPress={() => {
                  this.setState({ isPopup: false }, () => {
                    LiveChatOpenGlobe();
                  });
                }}
                style={{
                  fontWeight: "bold",
                  lineHeight: 22,
                  fontSize: 13,
                  color: "#1C8EFF",
                }}
              >
                联系客服
              </Text>
              。
            </Text>
            <Touch
              onPress={() => {
                this.setState({ isPopup: false });
              }}
              style={{
                padding: 10,
                backgroundColor: "#00a6ff",
                borderRadius: 5,
                width: width * 0.6,
                marginTop: 15,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>关闭</Text>
            </Touch>
          </View>
        </Modal>
        {/* QQ存款提示窗 */}
        {/* <Modals
          isVisible={PayAreadyQQ}
          backdropColor={'#000'}
          backdropOpacity={0.4}
          style={{ justifyContent: 'center', margin: 0, marginLeft: 20, }}
        >
          <View style={[stylespage.secussModal, { width: width - 40, borderRadius: 10, padding: 20, paddingTop: 0 }]}>
            <View style={{
              backgroundColor: '#00A6FF',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              width: width - 40
            }}>
              <Text style={{
                color: '#fff',
                lineHeight: 40,
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>存款</Text>
            </View>
            <Text style={{
              color: '#222222',
              width: width - 80,
              paddingBottom: 8,
              paddingTop: 15
            }}>订单 {DepositData != '' && DepositData.transactionId || '-- --'} 创建成功。</Text>
            <View style={{ width: width - 80, borderRadius: 8, backgroundColor: '#FFF5BF' }}>
              <Text style={{ color: '#83630B', fontSize: 12, lineHeight: 20, padding: 10 }}>
                乐天使温馨提醒:请勿使用 QQ 添加陌生账号或是私自汇款给对方，以免遇到诈骗。 如有任何损失，乐天堂一概不负责。
              </Text>
            </View>
            <Touch onPress={() => {
              this.PayAreadyQQ();
            }} style={{ backgroundColor: '#00a6ff', borderRadius: 5, marginTop: 25 }}>
              <Text style={{
                color: '#fff',
                lineHeight: 40,
                textAlign: 'center',
                width: width - 80,
                fontSize: 16,
                fontWeight: 'bold'
              }}>我知道了</Text>
            </Touch>
          </View>
        </Modals> */}
        <Modal
          animationType="none"
          transparent={true}
          visible={okPayModal}
          style={{ padding: 0, width: width / 1.3 }}
        >
          <View style={stylespage.secussModal}>
            <Text style={{ color: "#222222", lineHeight: 35, fontSize: 18 }}>
              提醒
            </Text>
            <Text style={{ color: "#222222", padding: 10, paddingBottom: 20 }}>
              请填写完成表单才能进行提交
            </Text>
            <Touch
              onPress={() => {
                this.setState({ okPayModal: false });
              }}
              style={{
                padding: 10,
                backgroundColor: "#00a6ff",
                borderRadius: 50,
              }}
            >
              <Text
                style={{ color: "#fff", paddingLeft: 10, paddingRight: 10 }}
              >
                确认
              </Text>
            </Touch>
          </View>
        </Modal>
        <Modals
          isVisible={CTC_CHANNEL_pay}
          backdropColor={"#000"}
          backdropOpacity={0.4}
          style={{ justifyContent: "center", margin: 0, marginLeft: 20 }}
          onBackdropPress={() => {
            this.setState({ CTC_CHANNEL_pay: false });
          }}
        >
          {depositDetail != "" &&
            depositDetail.banks.length > 0 &&
            depositDetail.banks[CTCListtype] && (
              <View
                style={[
                  stylespage.secussModal,
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
                      lineHeight: 35,
                      textAlign: "center",
                    }}
                  >
                    重要提示
                  </Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={bankImage[depositDetail.banks[CTCListtype].code]}
                  style={{ width: 98, height: 30, marginTop: 5 }}
                />
                <Text style={{ color: "#222", lineHeight: 35 }}>
                  {depositDetail.banks[CTCListtype].name}(
                  {depositDetail.banks[CTCListtype].code})
                </Text>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: "#00a6ff", lineHeight: 22 }}>
                    请确保将
                    <Text style={{ color: "#00a6ff" }}>
                      {depositDetail.banks[CTCListtype].name} (
                      {depositDetail.banks[CTCListtype].code}) 转入收款账户
                    </Text>
                    ，若您使用其他虚拟货币支付，则可能造成资金损失。
                  </Text>
                  <Text style={{ color: "#222", lineHeight: 22 }}>
                    当您点击“确认”，则表示您已同意承担上述风险。
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Touch
                    onPress={() => {
                      this.setState({ CTC_CHANNEL_pay: false });
                      PiwikEvent("Deposit_Nav", "Back", "Crypto_Channel_Back");
                    }}
                    style={{
                      borderColor: "#00a6ff",
                      borderRadius: 5,
                      width: 120,
                      marginTop: 35,
                      borderWidth: 1,
                      marginRight: 30,
                    }}
                  >
                    <Text
                      style={{
                        color: "#00a6ff",
                        lineHeight: 42,
                        textAlign: "center",
                      }}
                    >
                      关闭
                    </Text>
                  </Touch>
                  <Touch
                    onPress={() => {
                      this.setState({ CTC_CHANNEL_pay: false }, () => {
                        this.CTC_CHANNEL_pay();
                      });
                    }}
                    style={{
                      backgroundColor: "#00a6ff",
                      borderRadius: 5,
                      width: 120,
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
                      确认
                    </Text>
                  </Touch>
                </View>
              </View>
            )}
        </Modals>
        {
          // 教学
          activeCode != "" && (
            <Modal
              animationType="none"
              transparent={true}
              visible={ISpromp}
              style={{ width: width / 1.2, padding: 0 }}
            >
              <View style={{ backgroundColor: "#fff", borderRadius: 15 }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#000",
                    fontWeight: "bold",
                    textAlign: "center",
                    lineHeight: 30,
                  }}
                >
                  {activeName}
                </Text>
                <Carousel
                  ref={(c) => {
                    this._carousel = c;
                  }}
                  data={promptList[activeCode]}
                  renderItem={this.renderPage}
                  sliderWidth={width}
                  itemWidth={width}
                  autoplay={true}
                  // loop={true}
                  onSnapToItem={(index) =>
                    this.setState({ activeSlide: index })
                  }
                />
                <Pagination
                  // dotsLength={promptList[activeCode].length}
                  dotsLength={3}
                  activeDotIndex={activeSlide}
                  containerStyle={{
                    paddingVertical: 2,
                    position: "absolute",
                    bottom: 60,
                  }}
                  dotStyle={{
                    backgroundColor: "#000000BF",
                    position: "relative",
                    top: -60,
                    left: width / 5,
                  }}
                  inactiveDotStyle={{
                    width: 10,
                    backgroundColor: "#00000040",
                  }}
                  inactiveDotOpacity={1}
                  inactiveDotScale={0.6}
                />
                <Touch
                  onPress={() => {
                    this.setState({ ISpromp: false });
                  }}
                  style={{ padding: 15 }}
                >
                  <Text
                    style={{
                      color: "#00a6ff",
                      textAlign: "center",
                      fontSize: 18,
                    }}
                  >
                    关闭
                  </Text>
                </Touch>
              </View>
            </Modal>
          )
        }
        {/* 存款完成提示 */}
        <Modal
          animationType="none"
          transparent={true}
          visible={PayAready}
          style={{ padding: 0, width: width / 1.3 }}
        >
          <View style={stylespage.secussModal}>
            <Image
              resizeMode="stretch"
              source={require("../../images/icon-done.png")}
              style={{ width: 60, height: 60 }}
            />
            <Text style={{ color: "#222222", lineHeight: 25 }}>提交成功</Text>
            <Text style={{ color: "#42D200", lineHeight: 25 }}>
              {Countdown}
            </Text>
            <Text style={{ color: "#222222", padding: 10, fontSize: 13 }}>
              交易需要一段时间，请稍后再检查您的目标账户。
            </Text>
            <Touch
              onPress={() => {
                this.PayAready();
              }}
              style={{
                padding: 10,
                backgroundColor: "#00a6ff",
                borderRadius: 50,
              }}
            >
              <Text style={{ color: "#fff" }}>返回存款首页</Text>
            </Touch>
          </View>
        </Modal>
        {/* 本地银行充值银行错误 */}
        <Modals
          isVisible={this.state.lbVisible}
          backdropColor={'#000'}
          backdropOpacity={0.4}
          style={{ justifyContent: 'center', margin: 0, padding: 25 }}
        // onBackdropPress={() => {this.setState({ lbVisible: false })}}
        >
          <View style={[stylespage.secussModal, { borderRadius: 15 }]}>
            <View style={{
              backgroundColor: '#00A6FF',
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              width: width - 50
            }}>
              <Text style={{ color: '#fff', lineHeight: 42, textAlign: 'center', fontSize: 16 }}>温馨提醒</Text>
            </View>
            <Text style={{ color: '#666', padding: 25, lineHeight: 21, paddingBottom: 15, }}>
              {isSmileLBAvailable ? '很抱歉，目前暂无可存款的银行。此次交易将被取消，请尝试其他存款方式。' : '抱歉，您选择的银行暂不可用，建议您使用其他收款账户。​'}
            </Text>
            <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
              <Touch onPress={() => {
                this.setState({ lbVisible: false }, () => {
                  this.CancelPaybnbDeposit(DepositData);
                });
              }} style={stylespage.modalBtnclose}>
                <Text style={{ color: '#00a6ff' }}>不用了</Text>
              </Touch>
              <Touch onPress={() => {
                this.setState({ lbVisible: false }, () => {
                  this.isSuccess(DepositData);
                });
              }} style={stylespage.modalBtnok}>
                <Text style={{ color: '#fff' }}>好的</Text>
              </Touch>
            </View>
          </View>
        </Modals>

        <Modals
          isVisible={isShowRpeatModal}
          backdropColor={'#000'}
          backdropOpacity={0.4}
          style={{ justifyContent: 'center', margin: 0, marginLeft: 20, }}
        >
          <View style={[stylespage.secussModal, { width: width - 40, borderRadius: 10, padding: 20, paddingTop: 0 }]}>
            <View style={{
              backgroundColor: '#00A6FF',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              width: width - 40
            }}>
              <Text style={{
                color: '#fff',
                lineHeight: 44,
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>重要提示</Text>
            </View>
            <Text
              style={{ color: '#666', width: width - 80, paddingBottom: 16, paddingTop: 24, fontSize: 14 }}>请耐心等待，您有一项存款申请正在处理中。</Text>
            <View style={{ width: width - 80, borderRadius: 8, backgroundColor: '#EFEFF4', padding: 20 }}>
              <Text style={{ color: '#666', fontSize: 14, lineHeight: 20, marginBottom: 5 }}>
                存款编号：{lastDepositID}
              </Text>
              <Text style={{ color: '#666', fontSize: 14, lineHeight: 20 }}>
                存款金额：{lastDepositAmount}
              </Text>
            </View>

            <Text style={{
              color: '#666',
              width: width - 80,
              paddingTop: 16,
              fontSize: 14
            }}>请等待处理完毕后，再提交其他存款申请。</Text>
            <Touch onPress={() => {
              this.setState({
                isShowRpeatModal: false,
                lastDepositID: '',
                lastDepositAmount: ''
              });
            }} style={{ backgroundColor: '#00a6ff', borderRadius: 5, marginTop: 24 }}>
              <Text style={{
                color: '#fff',
                lineHeight: 48,
                textAlign: 'center',
                width: width - 80,
                fontSize: 16,
                fontWeight: 'bold'
              }}>好的</Text>
            </Touch>
          </View>
        </Modals>

        <View style={{ backgroundColor: "#efeff4" }}>
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            onKeyboardWillShow={() => {
              if (Platform.OS === "android") {
                this.setState({ keyboardOpen: true });
              }
            }}
            onKeyboardWillHide={() => {
              if (Platform.OS === "android") {
                this.setState({ keyboardOpen: false });
              }
            }}
          >
            <PushLayout showPush={this.state.showPush} />
            <View style={{ padding: 8, paddingTop: 16, paddingBottom: 50 }}>
              {
                // banner
                bannerData && bannerData.length ? (
                  <View style={{ marginBottom: 16 }}>
                    <Touch
                      onPress={() => {
                        PiwikEvent("Banner", "Click", `${bannerData[0].title}_DepositPage`);
                        BannerAction.onBannerClick(bannerData[0], "depo")
                      }}
                    // onPress={this.directToPromo.bind(
                    //   this,
                    //   bannerData &&
                    //     bannerData[0].action &&
                    //     bannerData[0].action.ID
                    // )}
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
                        source={require("../../images/icon/closeBlack.png")}
                        style={{ width: 12, height: 12 }}
                      />
                    </Touch>
                  </View>
                ) : null
              }
              {/* 存款方式选择 */}
              {keyboardOpen && (
                <View style={stylespage.depositList}>
                  {depositList.length == 0 &&
                    new Array(10).fill(1).map((v, index) => {
                      return (
                        <View key={index} style={stylespage.depositCode3} />
                      );
                    })}
                  {depositList.length > 0 && depositList[0] &&
                    depositList.map((item, index) => {
                      return (
                        <Touch
                          onPress={() => {
                            this.depositCodeClick(item.code, item.name, true);
                          }}
                          key={index}
                          style={[
                            activeCode == item.code
                              ? stylespage.depositCode1
                              : stylespage.depositCode2,
                          ]}
                        >
                          <Image
                            resizeMode="contain"
                            source={
                              activeCode == item.code
                                ? bankImageActive[item.code]
                                : bankImage[item.code]
                            }
                            style={{ width: this.getIconWidth(item.code), height: this.getIconHeight(item.code), marginTop: item.code === "AP" ? 12 : 5, marginBottom: 4 }}
                          />
                          <Text
                            style={{
                              fontSize: 10,
                              color: activeCode == item.code ? "#fff" : "#000",
                            }}
                          >
                            {item.name}
                          </Text>
                          {
                            item.isNew &&
                            <View style={stylespage.news}>
                              <Text style={{ color: "#fff", fontSize: 8, fontWeight: "bold" }}>
                                新
                              </Text>
                            </View>
                          }
                          {
                            item.isFast &&
                            <View style={stylespage.fast}>
                              <Text style={{ color: "#fff", fontSize: 8, fontWeight: "bold" }}>
                                极速
                              </Text>
                            </View>
                          }
                        </Touch>
                      );
                    })}

                  {/*排版補位用*/}
                  {depositList.length > 0 && depositList.length % 5 !== 0 && (
                    Array.from({ length: 5 - (depositList.length % 5) }, (v) => v).map((v, i1) => {
                      return (
                        <View key={i1} style={stylespage.depositCode4} />
                      );
                    })
                  )}
                </View>
              )}
              <View
                style={[
                  isQrcodeALB
                    ? { height: 0, overflow: "hidden" }
                    : {
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      paddingVertical: 16,
                      paddingHorizontal: 8,
                      marginTop: 15,
                    },
                ]}
              >
                {depositList.length == 0 && (
                  <View
                    style={{
                      backgroundColor: "#f8f8f8",
                      height: 150,
                      borderRadius: 8,
                    }}
                  ></View>
                )}
                {activeCode == "WC" && (
                  <PromptBox
                    type="info"
                    containerStyle={{ marginBottom: 16 }}
                    msg="为避免款项延迟或掉单, 请于2分钟内完成扫码及转账动作。"
                  />
                )}
                {paymentchannel != "" && activeCode != "CTC" && (
                  <View>
                    <Text style={[stylespage.inputLabel, { marginBottom: 8 }]}>
                      支付渠道
                    </Text>

                    <View
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      {paymentchannel &&
                        paymentchannel.map((item, index) => {
                          return (
                            <Touch
                              key={index}
                              style={stylespage.channel}
                              onPress={() => {
                                this.paymentchannelDWButton(item.value);
                              }}
                            >
                              <View
                                style={
                                  item.value == paymentchannelEND
                                    ? stylespage.paymenRadiusAHover
                                    : stylespage.paymenRadiusA
                                }
                              >
                                <View
                                  style={
                                    item.value == paymentchannelEND
                                      ? stylespage.paymenRadiusBHover
                                      : stylespage.paymenRadiusB
                                  }
                                />
                              </View>
                              <View>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    width: (width - 105) / 2,
                                    paddingLeft: 5,
                                    color: "#222222",
                                  }}
                                >
                                  {`${item.label}`}
                                </Text>
                              </View>
                              {item.isNew && (
                                // <View style={stylespage.news}>
                                //   <Text style={{ color: "#fff", fontSize: 8 }}>
                                //     新
                                //   </Text>
                                // </View>
                                <Image
                                  style={stylespage.newsIcon}
                                  // resizeMode="stretch"
                                  source={require("../../images/bank/new.png")}
                                />
                              )}
                            </Touch>
                          );
                        })}
                    </View>
                  </View>
                )}
                {/* {(activeCode == "OA" || activeCode == "WC") &&
                  Number(charges) < 0 && (
                    <PromptBox
                      type="info"
                      containerStyle={{ marginBottom: 16 }}
                      msg={`温馨提示：使用${activeName} 进行存款，第三方平台将征收手续费 ${Math.abs(
                        Number(charges) * 100
                      ).toFixed(2)}%。`}
                    />
                  )} */}
                {ShowDepositorNameField && PrefillRegisteredName && (
                  <View>
                    <Text style={[stylespage.inputLabel, { marginTop: 10 }]}>
                      存款人姓名
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#EFEFF4",
                        borderRadius: 5,
                        marginTop: 5,
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{ fontSize: 12, color: "#999", lineHeight: 17 }}
                      >
                        请确保您的存款账户姓名与注册姓名一致，任何他人代付或转账将被拒绝且无法保证退款。
                      </Text>
                    </View>
                  </View>
                )}
                {ShowDepositorNameField && !PrefillRegisteredName && (
                  <View>
                    <Text
                      style={[
                        stylespage.inputLabel,
                        { paddingTop: 5, paddingBottom: 5 },
                      ]}
                    >
                      存款人姓名
                    </Text>
                    <View style={stylespage.inputView}>
                      <TextInput
                        value={accountHolderName}
                        style={{ color: "#000", height: 38, width: width - 60 }}
                        placeholder={"请输入姓名"}
                        placeholderTextColor="#BCBEC3"
                        onChangeText={(value) => {
                          this.accountHolderName(value);
                        }}
                      />
                    </View>
                    {accountHolderNameTest != "" && (
                      <View
                        style={{
                          backgroundColor: "#FEE0E0",
                          borderRadius: 5,
                          padding: 10,
                          marginTop: 10,
                        }}
                      >
                        <Text style={{ color: "#EB2121", fontSize: 12 }}>
                          {accountHolderNameTest}
                        </Text>
                      </View>
                    )}
                    <PromptBox
                      type="info"
                      containerStyle={{ marginVertical: 8 }}
                      textStyle={{ fontWeight: "bold", fontSize: 12 }}
                      msg="请使用您本人账户进行转账，任何他人代付或转账将被拒绝且无法保证退款。"
                    />
                  </View>
                )}
                {/* {
                                      (this.state.paymentchannelEND == 'AlipayH5_LC' && Number(this.state.charges) < 0) &&
                                       <View style={{ backgroundColor: '#fff5bf', borderRadius: 5, marginTop: 15, padding: 10, marginBottom: 15 }}>
                                          <Text style={{ fontSize: 12, color: '#83630b', lineHeight: 17 }}>温馨提示：使用在线支付宝进行存款，第三方平台将征收手续费。</Text>
                                      </View>
                                  }
                                  {
                                      (this.state.paymentchannelEND == 'WeChatH5_LC' && Number(this.state.charges) < 0) &&
                                       <View style={{ backgroundColor: '#fff5bf', borderRadius: 5, marginTop: 15, padding: 10, marginBottom: 15 }}>
                                          <Text style={{ fontSize: 12, color: '#83630b', lineHeight: 17 }}>温馨提示：使用V信支付进行存款，第三方平台将征收手续费。</Text>
                                      </View>
                                  } */}

                {/* 加密货币 */}
                {activeCode == "CTC" && (
                  <View>
                    <PromptBox
                      containerStyle={{
                        marginBottom: 16,
                        paddingHorizontal: 16,
                      }}
                      type="info"
                      msg={`重要提示：若使用泰达币支付，部分平台将征收手续费。${"\n"}当日总存款达相应金额可获得手续费无限返还福利。${"\n"}*目前支持使用泰达币 (USDT-ERC20及USDT-TRC20协议) 进行存款。`}
                    />
                    <Text>
                      选择支付方式<Text style={{ color: "#F92D2D" }}>*</Text>
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        marginTop: 15,
                        flexWrap: "wrap",
                      }}
                    >
                      {activeDeposit != "" &&
                        activeDeposit.availableMethods.length > 0 ? (
                        activeDeposit.availableMethods.map((item, index) => {
                          return (
                            item.methodCode != "DEFAULT" && (
                              <Touch
                                style={stylespage.CTCData}
                                onPress={() => {
                                  this.CTCchange(item, index);
                                }}
                              >
                                <View
                                  style={[
                                    CTCtype == index
                                      ? stylespage.CTCList1
                                      : stylespage.CTCList2,
                                  ]}
                                ></View>
                                <View style={{ width: (width - 80) * 0.4 }}>
                                  <Text style={{ fontSize: 13, color: "#000" }}>
                                    {item.methodType}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 11,
                                      color: "#999",
                                      lineHeight: 16,
                                      marginTop: 2,
                                    }}
                                  >
                                    {item.methodCode == "INVOICE"
                                      ? "第三方交易所"
                                      : item.methodCode == "CHANNEL"
                                        ? "支付完成后会生成订单编号"
                                        : item.methodCode == "OTC"
                                          ? "人民币转账"
                                          : "需填入交易哈希"}
                                  </Text>
                                </View>
                              </Touch>
                            )
                          );
                        })
                      ) : (
                        <Text
                          onPress={() => {
                            Actions.LiveChatST();
                          }}
                          style={{
                            fontSize: 14,
                            lineHeight: 40,
                            paddingLeft: 15,
                          }}
                        >
                          请联系客服添加
                        </Text>
                      )}
                    </View>
                    {
                      CTC_CHANNEL_INVOICE == "CHANNEL" ? (
                        <View>
                          <Text>
                            选择加密货币{" "}
                            <Text style={{ color: "#F92D2D" }}>*</Text>
                          </Text>
                          <View style={stylespage.CTCtypes}>
                            {depositDetail != "" &&
                              depositDetail.banks.length == 0 && (
                                <Text
                                  onPress={() => {
                                    Actions.LiveChatST();
                                  }}
                                  style={{
                                    fontSize: 14,
                                    lineHeight: 40,
                                    paddingLeft: 15,
                                  }}
                                >
                                  请联系客服添加
                                </Text>
                              )}
                            {depositDetail != "" &&
                              depositDetail.banks.length > 0 &&
                              depositDetail.banks.map((item, index) => {
                                return (
                                  <Touch
                                    key={index}
                                    onPress={() => {
                                      this.CHANNEL_change(index);
                                    }}
                                    style={[
                                      CTCListtype == index
                                        ? stylespage.CTCtypeList1
                                        : stylespage.CTCtypeList2,
                                    ]}
                                  >
                                    <Image
                                      resizeMode="contain"
                                      source={bankImage[item.code]}
                                      style={{
                                        width: 106,
                                        height: 32,
                                        marginTop: 5,
                                      }}
                                    />
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        color:
                                          CTCListtype == index
                                            ? "#fff"
                                            : "#222",
                                      }}
                                    >
                                      {item.name}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        color:
                                          CTCListtype == index
                                            ? "#fff"
                                            : "#222",
                                      }}
                                    >
                                      ({item.code})
                                    </Text>
                                    {item.code == "USDT-TRC20" && (
                                      <View style={stylespage.noPage}>
                                        <Text
                                          style={{
                                            color: "#fff",
                                            fontSize: 11,
                                            padding: 1,
                                          }}
                                        >
                                          免手续费
                                        </Text>
                                      </View>
                                    )}
                                  </Touch>
                                );
                              })}
                          </View>
                        </View>
                      ) : // : activeDeposit != '' && activeDeposit.availableMethods.length > 0 && activeDeposit.availableMethods[].MethodCode == 'INVOICE' ?
                        CTC_CHANNEL_INVOICE == "OTC" ||
                          CTC_CHANNEL_INVOICE == "INVOICE" ||
                          CTC_CHANNEL_INVOICE == "INVOICE_AUT" ? (
                          <View>
                            <Text style={stylespage.inputLabel}>
                              存款金额 <Text style={{ color: "#F92D2D" }}>*</Text>
                            </Text>
                            <View style={{ marginTop: 6 }}>
                              <View style={stylespage.inputView}>
                                <TextInput
                                  value={money}
                                  style={{
                                    color: "#000",
                                    height: 38,
                                    width: width - 50,
                                    paddingLeft: 10,
                                  }}
                                  placeholder={`单笔存款 最低：${MinBalShow}元起, 最高：${MaxBalShow}元`}
                                  placeholderTextFontSize={8}
                                  placeholderTextColor="#BCBEC3"
                                  maxLength={10}
                                  keyboardType={"number-pad"}
                                  onChangeText={(value) => {
                                    this.moneyChange(value);
                                  }}
                                />
                              </View>
                              {moneyST != "" && (
                                <PromptBox
                                  type="error"
                                  msg={moneyST}
                                  containerStyle={{ marginTop: 8 }}
                                />
                              )}
                              {depositDetail?.setting?.vendorCharges && (
                                <PromptBox
                                  type="info"
                                  msg={"温馨提示：此交易将征收第三方手续费，请于提交后确认交易详情，再进行转帐。"}
                                  containerStyle={{ marginTop: 8 }}
                                  textStyle={{ fontWeight: "bold", fontSize: 12 }}
                                />
                              )}
                            </View>
                          </View>
                        ) : null
                      // :
                      // <View>
                      //     {this.MoneySlider()}
                      // </View>
                    }
                  </View>
                )}
                {
                  //金额选择
                  (activeCode == "JDP" ||
                    activeCode == "PPB" ||
                    activeCode == "OA" ||
                    activeCode == "WC" ||
                    activeCode == "UP" ||
                    activeCode == "WCLB" ||
                    activeCode == "QQ" ||
                    activeCode == "BC" ||
                    activeCode == "BCM") && <View>{this.MoneySlider()}</View>
                }
                {/* LB本地银行 */}
                {activeCode == "LB" && (
                  <View>
                    <View
                      style={{
                        backgroundColor: "#fff5bf",
                        borderRadius: 5,
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#83630b",
                          lineHeight: 17,
                        }}
                      >
                        请确保“存款人姓名”和“存入金额”与您本人账户姓名和转入的金额保持一致以便及时到账！
                      </Text>
                    </View>
                    {this.MoneySlider()}
                    {!IsAutoAssign && (
                      <View>
                        <Text
                          style={[
                            stylespage.inputLabel,
                            { paddingTop: 15, paddingBottom: 5 },
                          ]}
                        >
                          存款银行
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: 5,
                            marginBottom: 10,
                          }}
                        >
                          {depositDetail != "" &&
                            depositDetail.bankAccounts.length == 0 && (
                              <View
                                style={{
                                  backgroundColor: "#EFEFF4",
                                  borderRadius: 8,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 14,
                                    lineHeight: 44,
                                    color: "#999999",
                                    paddingHorizontal: 12,
                                  }}
                                >
                                  暂无可存款的银行.请尝试其他存款方式。
                                </Text>
                              </View>
                            )}
                          {depositDetail != "" &&
                            depositDetail.bankAccounts.length > 0 && (
                              <View
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  flexDirection: "row",
                                  height: 40,
                                  borderRadius: 5,
                                  borderWidth: 1,
                                  borderColor: "#ccc",
                                }}
                              >
                                <ModalDropdown
                                  ref={(el) => (this._dropdown_3 = el)}
                                  defaultValue={
                                    depositDetail.bankAccounts[0].bankName
                                  }
                                  // defaultIndex={0}
                                  textStyle={stylespage.dropdown_D_text}
                                  dropdownStyle={
                                    stylespage.dropdown_DX_dropdown
                                  }
                                  options={depositDetail.bankAccounts}
                                  renderButtonText={(rowData) =>
                                    this.LB_dropdown_renderButtonText(rowData)
                                  }
                                  renderRow={this.LB_dropdown_1_renderRow.bind(
                                    this
                                  )}
                                  onSelect={this.bankSelect}
                                  style={{ zIndex: 10, width: width - 70 }}
                                />
                                <Image
                                  resizeMode="stretch"
                                  source={require("../../images/down.png")}
                                  style={{
                                    width: 16,
                                    height: 16,
                                    position: "absolute",
                                    right: 10,
                                  }}
                                />
                              </View>
                            )}
                        </View>
                      </View>
                    )}
                    <View>
                      <Text
                        style={[
                          stylespage.inputLabel,
                          { paddingTop: 5, paddingBottom: 5 },
                        ]}
                      >
                        存款人姓名
                      </Text>
                      <View style={stylespage.inputView}>
                        {!this.state.FirstNameChange && (
                          <TextInput
                            value={this.state.LBFirstName.replace(/./g, "*")}
                            style={{
                              color: "#000",
                              height: 38,
                              width: width - 60,
                              paddingLeft: 10,
                            }}
                            placeholder={""}
                            onFocus={() => {
                              this.LBFirstName("");
                            }}
                          />
                        )}
                        {this.state.FirstNameChange && (
                          <TextInput
                            value={this.state.LBFirstName}
                            style={{
                              color: "#000",
                              height: 38,
                              width: width - 60,
                            }}
                            placeholder={""}
                            onChangeText={(value) => {
                              this.LBFirstName(value);
                            }}
                            textContentType="password"
                            secureTextEntry={!this.state.FirstNameChange}
                          />
                        )}
                      </View>
                      <Text style={{ color: "red", fontSize: 12 }}>
                        {this.state.LBFirstNameTest != "" &&
                          this.state.LBFirstNameTest}
                      </Text>
                    </View>
                  </View>
                )}
                {activeCode == "ALB" && (
                  <View>
                    <View>{this.MoneySlider()}</View>
                    {!IsAutoAssign && (
                      <View>
                        <Text
                          style={[
                            stylespage.inputLabel,
                            { paddingTop: 15, paddingBottom: 5 },
                          ]}
                        >
                          存款银行
                        </Text>
                        <View
                          style={{ backgroundColor: "#fff", borderRadius: 5 }}
                        >
                          {depositDetail != "" &&
                            depositDetail.bankAccounts.length == 0 &&
                            this.noBankTextUI2()}
                          {depositDetail != "" &&
                            depositDetail.bankAccounts.length > 0 && (
                              <View
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  flexDirection: "row",
                                  height: 40,
                                  borderRadius: 5,
                                  borderWidth: 1,
                                  borderColor: "#ccc",
                                }}
                              >
                                <ModalDropdown
                                  ref={(el) => (this._dropdown_3 = el)}
                                  defaultValue={
                                    depositDetail.bankAccounts[0].bankName
                                  }
                                  // defaultIndex={0}
                                  textStyle={stylespage.dropdown_D_text}
                                  dropdownStyle={
                                    stylespage.dropdown_DX_dropdown
                                  }
                                  options={depositDetail.bankAccounts}
                                  renderButtonText={(rowData) =>
                                    this.LB_dropdown_renderButtonText(rowData)
                                  }
                                  renderRow={this.LB_dropdown_1_renderRow.bind(
                                    this
                                  )}
                                  onSelect={this.bankSelect}
                                  style={{ zIndex: 10, width: width - 60 }}
                                />
                                <Image
                                  resizeMode="stretch"
                                  source={require("../../images/down.png")}
                                  style={{
                                    width: 16,
                                    height: 16,
                                    position: "absolute",
                                    right: 10,
                                  }}
                                />
                              </View>
                            )}
                        </View>
                      </View>
                    )}
                  </View>
                )}
                {activeCode == "WCLB" && (
                  <View>
                    {!IsAutoAssign && (
                      <View>
                        <Text
                          style={[
                            stylespage.inputLabel,
                            { paddingTop: 15, paddingBottom: 5 },
                          ]}
                        >
                          存款银行
                        </Text>
                        <View
                          style={{ backgroundColor: "#fff", borderRadius: 5 }}
                        >
                          {depositDetail != "" &&
                            depositDetail.bankAccounts.length == 0 &&
                            this.noBankTextUI()}
                          {depositDetail != "" &&
                            depositDetail.bankAccounts.length > 1 ? (
                            <View
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "row",
                                height: 40,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: "#ccc",
                              }}
                            >
                              <ModalDropdown
                                ref={(el) => (this._dropdown_3 = el)}
                                defaultValue={
                                  depositDetail.bankAccounts[0].bankName
                                }
                                // defaultIndex={0}
                                textStyle={stylespage.dropdown_D_text}
                                dropdownStyle={stylespage.dropdown_DX_dropdown}
                                options={depositDetail.bankAccounts}
                                renderButtonText={(rowData) =>
                                  this.LB_dropdown_renderButtonText(rowData)
                                }
                                renderRow={this.LB_dropdown_1_renderRow.bind(
                                  this
                                )}
                                onSelect={this.bankSelect}
                                style={{ zIndex: 10, width: width - 60 }}
                              />
                              <Image
                                resizeMode="stretch"
                                source={require("../../images/down.png")}
                                style={{
                                  width: 16,
                                  height: 16,
                                  position: "absolute",
                                  right: 10,
                                }}
                              />
                            </View>
                          ) : depositDetail != "" &&
                            depositDetail.bankAccounts.length == 1 ? (
                            <View
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                flexDirection: "row",
                                borderRadius: 5,
                                backgroundColor: "#EFEFF4",
                              }}
                            >
                              <Text style={{ lineHeight: 40, paddingLeft: 10 }}>
                                {depositDetail.bankAccounts[0].bankName}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    )}
                  </View>
                )}
                {
                  ((activeCode == 'QQ' || activeCode == 'OA' || activeCode == 'WC' || activeCode == 'PPB' || activeCode == 'JDP' || activeCode == 'BC' || activeCode == 'BCM' || activeCode == 'UP') && Number(charges) < 0) &&
                  <PromptBox
                    type="info"
                    containerStyle={{ marginVertical: 8 }}
                    textStyle={{ fontWeight: "bold", fontSize: 12 }}
                    msg={`温馨提示：使用${activeName}进行存款，第三方平台将征收手续费 ${Math.abs(Number(charges) * 100).toFixed(2)}%。`}
                  />
                }
                {(activeCode == "QQ" ||
                  activeCode == "OA" ||
                  activeCode == "WC" ||
                  activeCode == "PPB" ||
                  activeCode == 'JDP' ||
                  activeCode == 'BC' ||
                  activeCode == 'BCM' ||
                  activeCode == 'UP') &&
                  charges != 0 && (
                    <View>
                      <Text style={{ paddingBottom: 5, fontSize: 12, color: "#666", marginTop: 15 }}>
                        实际到账
                      </Text>
                      <View>
                        <View
                          style={{
                            backgroundColor: "#EFEFF4",
                            borderRadius: 5,
                            paddingLeft: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: "#666",
                              lineHeight: 38,
                              width: width - 60,
                            }}
                          >
                            {chargesMoney}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                {activeCode == "PPB" && (
                  //存款銀行 PPB
                  <View>
                    {depositDetail != "" && depositDetail.banks.length > 0 && (
                      <Text
                        style={[
                          stylespage.inputLabel,
                          { paddingTop: 15, paddingBottom: 5 },
                        ]}
                      >
                        存款银行
                      </Text>
                    )}
                    <View style={{ backgroundColor: "#fff", borderRadius: 5 }}>
                      {depositDetail != "" && depositDetail.banks.length > 0 && (
                        <View
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                            height: 40,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: "#ccc",
                          }}
                        >
                          <ModalDropdown
                            ref={(el) => (this._dropdown_3 = el)}
                            defaultValue={depositDetail.banks[0].name}
                            defaultIndex={0}
                            textStyle={stylespage.dropdown_D_text}
                            dropdownStyle={stylespage.dropdown_DX_dropdown}
                            options={depositDetail.banks}
                            renderButtonText={(rowData) =>
                              this.BCbank_dropdown_renderButtonText(rowData)
                            }
                            renderRow={this.BCbank_dropdown_1_renderRow.bind(
                              this
                            )}
                            onSelect={this.bankSelect}
                            style={{ zIndex: 10, width: width - 60 }}
                          />
                          <Image
                            resizeMode="stretch"
                            source={require("../../images/down.png")}
                            style={{
                              width: 16,
                              height: 16,
                              position: "absolute",
                              right: 10,
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                )}
                {activeCode === "CC" && (
                  <View>
                    {
                      <View>
                        <Text
                          style={[stylespage.inputLabel, { paddingBottom: 5 }]}
                        >
                          存款金额
                        </Text>
                        <View style={stylespage.inputView}>
                          <TextInput
                            value={money}
                            style={{
                              color: "#000",
                              height: 38,
                              width: width - 60,
                            }}
                            placeholder={`单笔存款范围:${MinBalShow}-${MaxBalShow},每日可存款${TransferNumber}次`}
                            placeholderTextColor="#BCBEC3"
                            placeholderTextFontSize={14}
                            maxLength={10}
                            keyboardType={"number-pad"}
                            onChangeText={(value) => {
                              this.moneyChange(value);
                            }}
                            onBlur={() => {
                              this.moneyBlur();
                            }}
                          />
                        </View>
                        {moneyST != "" && (
                          <View
                            style={{
                              backgroundColor: "#fee0e0",
                              borderRadius: 5,
                              marginTop: 10,
                              marginBottom: 10,
                            }}
                          >
                            <Text
                              style={{
                                color: "red",
                                fontSize: 11,
                                paddingLeft: 10,
                                paddingBottom: 10,
                                paddingTop: 10,
                              }}
                            >
                              {moneyST}
                            </Text>
                          </View>
                        )}
                      </View>
                    }
                    {depositDetail?.setting?.vendorCharges && (
                      <PromptBox
                        type="info"
                        msg={"温馨提示：此交易将征收第三方手续费，请于提交后确认交易详情，再进行转帐。"}
                        containerStyle={{ marginTop: 8 }}
                        textStyle={{ fontWeight: "bold", fontSize: 12 }}
                      />
                    )}
                    <View>
                      <Text
                        style={[
                          stylespage.inputLabel,
                          { paddingTop: 15, paddingBottom: 5 },
                        ]}
                      >
                        乐卡序列号
                      </Text>
                      <View style={stylespage.inputView}>
                        <TextInput
                          value={caredNum}
                          style={{
                            color: "#000",
                            height: 38,
                            width: width - 60,
                          }}
                          placeholder={""}
                          maxLength={16}
                          onChangeText={(value) => {
                            this.CCcaredChange(value);
                          }}
                        />
                      </View>
                      {caredNumST != "" && (
                        <Text style={{ color: "red", fontSize: 12 }}>
                          {caredNumST}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text
                        style={[
                          stylespage.inputLabel,
                          { paddingTop: 15, paddingBottom: 5 },
                        ]}
                      >
                        乐卡密码
                      </Text>
                      <View style={stylespage.inputView}>
                        <TextInput
                          value={PINNum}
                          style={{
                            color: "#000",
                            height: 38,
                            width: width - 60,
                          }}
                          placeholder={""}
                          maxLength={10}
                          onChangeText={(value) => {
                            this.CCPINChange(value);
                          }}
                        />
                      </View>
                      {PINNumST != "" && (
                        <Text style={{ color: "red", fontSize: 12 }}>
                          {PINNumST}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                {activeCode === "AP" && (
                  <View>
                    <View>
                      <Text style={{ paddingBottom: 5 }}>AstroPay卡号</Text>
                      <View style={stylespage.inputView}>
                        <TextInput
                          value={caredNum}
                          style={{
                            color: "#000",
                            height: 38,
                            width: width - 60,
                          }}
                          placeholder={""}
                          maxLength={16}
                          onChangeText={(value) => {
                            this.APcaredChange(value);
                          }}
                        />
                      </View>
                      {caredNumST != "" && (
                        <Text style={{ color: "red", fontSize: 12 }}>
                          {caredNumST}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text style={{ paddingTop: 15, paddingBottom: 5 }}>
                        安全码
                      </Text>
                      <View style={stylespage.inputView}>
                        <TextInput
                          value={PINNum}
                          maxLength={4}
                          style={{
                            color: "#000",
                            height: 38,
                            width: width - 60,
                          }}
                          placeholder={""}
                          onChangeText={(value) => {
                            this.CCPINChange(value);
                          }}
                        />
                      </View>
                      {PINNumST != "" && (
                        <Text style={{ color: "red", fontSize: 12 }}>
                          {PINNumST}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text style={{ paddingTop: 15, paddingBottom: 5 }}>
                        有效日期
                      </Text>
                      <View style={stylespage.inputView}>
                        <View style={{ width: width - 60 }}>
                          <Text
                            style={{
                              lineHeight: 38,
                              textAlign: "left",
                              paddingLeft: 10,
                            }}
                          >
                            {yearDate + "/" + monthDate}
                          </Text>
                        </View>
                        <View
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 999,
                            width: width,
                          }}
                        >
                          <DatePicker
                            title=""
                            value={new Date()}
                            mode="month"
                            minDate={new Date(new Date())}
                            maxDate={
                              new Date(
                                new Date(
                                  new Date().getTime() +
                                  1000 * 60 * 60 * 24 * 366 * 10
                                )
                              )
                            }
                            onChange={this.monthDateChange}
                            format="YYYY-MM-DD"
                          >
                            <List.Item styles={StyleSheet.create(newStyle)}>
                              <Text style={{ fontSize: 14, color: "#fff" }}>
                                月份
                              </Text>
                            </List.Item>
                          </DatePicker>
                        </View>
                      </View>
                    </View>
                    {
                      <View>
                        <View>
                          <View
                            style={{
                              backgroundColor: "#f3f3f3",
                              borderRadius: 5,
                              paddingLeft: 10,
                              marginTop: 15,
                            }}
                          >
                            <Text
                              style={{
                                color: "#000",
                                lineHeight: 38,
                                width: width - 60,
                              }}
                            >
                              美金兑换汇率: {USDRate}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text style={{ paddingTop: 15, paddingBottom: 5 }}>
                            卡片面值({APcaredUSD ? "USD" : "RMB"})
                          </Text>
                          <View style={stylespage.inputView}>
                            <TextInput
                              value={money}
                              style={{
                                color: "#000",
                                height: 38,
                                width: width - 60,
                                fontSize: 11,
                              }}
                              placeholderTextColor="#BCBEC3"
                              placeholder={`最低：${MinBalShow} 人民币（${(
                                MinBal / USDRate
                              ).toFixed(
                                2
                              )} 美元），最高金额 : ${MaxBalShow} 人民币（${(
                                MaxBal / USDRate
                              ).toFixed(2)} 美元）。`}
                              maxLength={10}
                              placeholderTextFontSize={8}
                              keyboardType={"number-pad"}
                              onChangeText={(value) => {
                                APcaredUSD
                                  ? this.APcaredUSDMoney(value)
                                  : this.moneyChange(value);
                              }}
                              onBlur={() => {
                                this.moneyBlur();
                              }}
                            />
                          </View>
                          {moneyST != "" && (
                            <View
                              style={{
                                backgroundColor: "#fee0e0",
                                borderRadius: 5,
                                marginTop: 10,
                                marginBottom: 10,
                              }}
                            >
                              <Text
                                style={{
                                  color: "red",
                                  fontSize: 11,
                                  paddingLeft: 10,
                                  paddingBottom: 10,
                                  paddingTop: 10,
                                }}
                              >
                                {moneyST}
                              </Text>
                            </View>
                          )}
                        </View>
                        {APcaredUSD && (
                          <View>
                            <Text style={{ paddingTop: 15, paddingBottom: 5 }}>
                              实际存入(RMB)
                            </Text>
                            <View
                              style={{
                                backgroundColor: "#f3f3f3",
                                borderRadius: 5,
                                paddingLeft: 15,
                              }}
                            >
                              <Text
                                style={{
                                  color: "#000",
                                  lineHeight: 38,
                                  width: width - 60,
                                }}
                              >
                                {USDRateMoney}
                              </Text>
                            </View>
                          </View>
                        )}
                        {/* <View style={{ marginTop: 10, backgroundColor: '#EBEBED', borderRadius: 15, padding: 15, }}>
                                                  <Text style={{ color: "#666666", width: width - 60 }}>{`最低：${MinBalShow} 人民币（${(MinBal / USDRate).toFixed(2)} 美元），最高金额 : ${MaxBalShow} 人民币（${(MaxBal / USDRate).toFixed(2)} 美元）。`}</Text>
                                              </View> */}
                      </View>
                    }
                  </View>
                )}
                {(activeCode == "BC" || activeCode == "BCM") && (
                  <View>
                    {depositDetail != "" && depositDetail.banks.length > 0 ? (
                      <View>
                        <Text
                          style={[
                            stylespage.inputLabel,
                            { paddingTop: 15, paddingBottom: 5 },
                          ]}
                        >
                          存款银行
                        </Text>
                        <View
                          style={{ backgroundColor: "#fff", borderRadius: 5 }}
                        >
                          {depositDetail != "" &&
                            depositDetail.banks.length == 0 &&
                            this.noBankTextUI2()}
                          {depositDetail != "" &&
                            depositDetail.banks.length > 0 && (
                              <View
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  flexDirection: "row",
                                  height: 40,
                                  borderRadius: 5,
                                  borderWidth: 1,
                                  borderColor: "#ccc",
                                }}
                              >
                                <ModalDropdown
                                  ref={(el) => (this._dropdown_3 = el)}
                                  defaultValue={depositDetail.banks[0].name}
                                  defaultIndex={0}
                                  textStyle={stylespage.dropdown_D_text}
                                  dropdownStyle={
                                    stylespage.dropdown_DX_dropdown
                                  }
                                  options={depositDetail.banks}
                                  renderButtonText={(rowData) =>
                                    this.BCbank_dropdown_renderButtonText(
                                      rowData
                                    )
                                  }
                                  renderRow={this.BCbank_dropdown_1_renderRow.bind(
                                    this
                                  )}
                                  onSelect={this.bankSelect}
                                  style={{ zIndex: 10, width: width - 60 }}
                                />
                                <Image
                                  resizeMode="stretch"
                                  source={require("../../images/down.png")}
                                  style={{
                                    width: 16,
                                    height: 16,
                                    position: "absolute",
                                    right: 10,
                                  }}
                                />
                              </View>
                            )}
                        </View>
                      </View>
                    ) : activeCode == "BC" ? (
                      <View>
                        <Text
                          style={[
                            stylespage.inputLabel,
                            { paddingTop: 15, paddingBottom: 5 },
                          ]}
                        >
                          存款银行
                        </Text>
                        <View
                          style={{ backgroundColor: "#fff", borderRadius: 5 }}
                        >
                          {depositDetail != "" &&
                            depositDetail.banks.length == 0 &&
                            this.noBankTextUI2()}
                        </View>
                      </View>
                    ) : null}
                  </View>
                )}
                {
                  activeCode == 'SR' &&
                  <View>
                    {
                      (Array.isArray(SuggestedAmounts) && SuggestedAmounts.length > 0 && SuggestedAmounts[0].amount)
                        ? <View>
                          <Text style={{ paddingTop: 15, color: '#666666', fontSize: 12 }}>存款金额</Text>
                          <View style={stylespage.SRAmounts}>
                            {
                              SuggestedAmounts.map((item, index) => {
                                return (
                                  <Touch
                                    key={index}
                                    style={[
                                      stylespage.SRAmountsItem,
                                      {
                                        backgroundColor: !item.isActive ? '#EFEFF4' : SRAmountsActive == index ? '#00A6FF' : '#fff',
                                        borderColor: !item.isActive ? '#EFEFF4' : '#E3E3E8'
                                      }
                                    ]}
                                    onPress={() => {
                                      this.SRAmountSelect(item, index);
                                    }}
                                  >
                                    <Text style={{
                                      fontSize: 16,
                                      fontWeight: "500",
                                      color: !item.isActive ? '#BCBEC3' : SRAmountsActive == index ? '#fff' : '#000'
                                    }}>{item.amount}</Text>
                                  </Touch>
                                );
                              })
                            }
                          </View>
                        </View>
                        :
                        <Text style={{ color: '#EB2121', fontSize: 12, paddingTop: 15, fontWeight: "500" }}>目前没有适合的金额，请尝试使用不同的存款提交方法</Text>

                    }


                    {
                      SRdisabledErr &&
                      <Text style={{ color: '#EB2121', fontSize: 12, paddingTop: 15, fontWeight: "500" }}>目前没有适合的金额，请尝试使用不同的存款提交方法</Text>
                    }
                  </View>
                }
                {
                  // activeCode == 'ALB' &&
                  // <View>
                  //     {/* 转账方式选择 */}
                  //     <Text style={{ paddingTop: 15, paddingBottom: 5 }}>存款银行</Text>
                  //     <View style={{ backgroundColor: "#fff", borderRadius: 5 }}>
                  //         <View
                  //             style={{
                  //                 display: "flex",
                  //                 justifyContent: "space-between",
                  //                 alignItems: "center",
                  //                 flexDirection: "row",
                  //                 height: 40,
                  //                 borderRadius: 5,
                  //                 borderWidth: 1,
                  //                 borderColor: '#ccc'
                  //             }}
                  //         >
                  //             <ModalDropdown
                  //                 ref={el => (this._dropdown_3 = el)}
                  //                 defaultValue={ALBType[0].name}
                  //                 defaultIndex={0}
                  //                 textStyle={stylespage.dropdown_D_text}
                  //                 dropdownStyle={stylespage.dropdown_DX_dropdown}
                  //                 options={ALBType}
                  //                 renderButtonText={rowData =>
                  //                     this.ALB_dropdown_renderButtonText(rowData)
                  //                 }
                  //                 renderRow={this.ALB_dropdown_1_renderRow.bind(this)}
                  //                 onSelect={this.ALB_balanceSelect}
                  //                 style={{ zIndex: 10, width: width - 60 }}
                  //             />
                  //             <Image
                  //                 resizeMode="stretch"
                  //                 source={require("../../images/down.png")}
                  //                 style={{
                  //                     width: 16,
                  //                     height: 16,
                  //                     position: "absolute",
                  //                     right: 10
                  //                 }}
                  //             />
                  //         </View>
                  //     </View>
                  // </View>
                }
                {
                  // 优惠申请，
                  this.props.froms == "promotions" && BonusData != "" && (
                    <View style={{ paddingTop: 10 }}>
                      <Text style={{ paddingBottom: 10 }}>优惠申请</Text>

                      <Flex style={{ backgroundColor: "#fff" }}>
                        <Flex.Item
                          style={{
                            flex: 1,
                            paddingTop: 5,
                            backgroundColor: "#EFEFF4",
                            borderRadius: 6,
                          }}
                        >
                          <ModalDropdown
                            disabled={this.props.froms == "promotions"}
                            ref={(el) => (this._dropdown_3 = el)}
                            defaultValue={BonusData[BonusIndex].title}
                            defaultIndex={BonusIndex}
                            textStyle={stylespage.dropdown_D_text}
                            dropdownStyle={stylespage.dropdown_DX_dropdown}
                            options={BonusData}
                            renderButtonText={(rowData) =>
                              this._dropdown_1_renderButtonText(rowData)
                            }
                            renderRow={this._dropdown_3_renderRow.bind(this)}
                            onSelect={this.BonusButton}
                          />
                          {/* <View style={{position: 'absolute', right: 10, top: 8}}>
                                                  <Image resizeMode='stretch' source={require('../../images/down.png')} style={{ width: 20, height: 20 }} />
                                              </View> */}
                        </Flex.Item>
                      </Flex>
                      {BonusMSG != "" && (
                        <Text
                          style={{
                            color: "red",
                            fontSize: 11,
                            width: width - 50,
                            lineHeight: 16,
                            paddingTop: 10,
                          }}
                        >
                          {BonusMSG}
                        </Text>
                      )}
                    </View>
                  )
                }
                <Touch
                  onPress={() => {
                    this.okPayClick();
                  }}
                  style={{
                    backgroundColor: okPayBtn ? "#00a6ff" : "#EFEFF4",
                    borderRadius: 8,
                    marginTop: 30,
                  }}
                >
                  <Text
                    style={{
                      lineHeight: 44,
                      textAlign: "center",
                      color: okPayBtn ? "#fff" : "#BCBEC3",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {activeCode == "CTC" ? "下一步" : "提交"}
                  </Text>
                </Touch>
              </View>

              {activeCode == "ALB" && isQrcodeALB && (
                <View>
                  <View style={stylespage.ALBmoneyView}>
                    <Text style={stylespage.inputLabel}>存款金额</Text>
                    <Text style={{ color: "#000", fontWeight: "bold" }}>
                      ¥{money}
                    </Text>
                  </View>
                  <View style={stylespage.isQrcodeALB}>
                    <View style={stylespage.arrowTop} />
                    <Text
                      style={{
                        color: "#999999",
                        fontSize: 12,
                        width: width - 50,
                      }}
                    >
                      转账时请必须转入系统生成的金额, 请选择以下方式继续支付.
                    </Text>
                    <View style={stylespage.isQrcodeBtn}>
                      <Touch
                        onPress={() => {
                          this.ALB_balanceSelect(1);
                        }}
                        style={stylespage.isQrcodeBtnL}
                      >
                        <Text
                          style={{
                            color: "#00A6FF",
                            textAlign: "center",
                            lineHeight: 38,
                          }}
                        >
                          显示银行账户
                        </Text>
                      </Touch>
                      <Touch
                        onPress={() => {
                          this.ALB_balanceSelect(0);
                        }}
                        style={stylespage.isQrcodeBtnR}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            textAlign: "center",
                            lineHeight: 40,
                          }}
                        >
                          显示二维码
                        </Text>
                      </Touch>
                    </View>
                  </View>
                </View>
              )}

              {activeCode == "CTC" && (
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 25,
                  }}
                >
                  <Touch
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 50,
                      width: 90,
                    }}
                    onPress={() => {
                      Actions.CTCpage({ actionType: "Deposit" });
                      PiwikEvent("Deposit_Nav", "Confirm", "Deposit_Tutorial");
                    }}
                  >
                    <Text
                      style={{
                        color: "#666",
                        textAlign: "center",
                        lineHeight: 40,
                      }}
                    >
                      存款教程
                    </Text>
                  </Touch>
                </View>
              )}
              <View style={{ width: width - 55 }}>
                {
                  // 本地银行
                  activeCode == "LB" && <LBPrompt />
                }
                {
                  //支付宝转账
                  activeCode == "ALB" && <ALBPrompt />
                }
                {
                  //京东钱包
                  activeCode == "JDP" && <JDPPrompt />
                }
                {
                  //银联支付
                  activeCode == "UP" && <UPPrompt />
                }
                {
                  //在线支付
                  (activeCode == "BC" || activeCode == "BCM") && <BCPrompt />
                }
                {
                  //在线支付宝
                  activeCode == "OA" && (
                    <OAPrompt key={charges} depositCharges={charges} />
                  )
                }
                {
                  //微转账
                  activeCode == "WCLB" && <WCLBPrompt />
                }
                {
                  //微支付
                  activeCode == "WC" && (
                    <WCPrompt
                      key={charges}
                      depositCharges={charges}
                      item={this.state.paymentchannelEND}
                    />
                  )
                }
                {
                  //AstroPay
                  activeCode == "AP" && <APPrompt />
                }
                {
                  //同乐卡
                  activeCode == "CC" && <CCPrompt />
                }
                {
                  //QQ
                  activeCode == "QQ" && <QQrompt />
                }
                {
                  //虚拟币
                  activeCode == "CTC" && (
                    <CTCPrompt
                      key={this.state.CTCPromptActive}
                      CTCBack={() => {
                        this.setState({
                          CTCPromptActive: this.state.CTCPromptActive + 1,
                        });
                      }}
                      CTCPromptActive={this.state.CTCPromptActive}
                    />
                  )
                }
                {
                  //網銀支付
                  activeCode == "PPB" && <PPBPrompt />
                }
                {
                  //小额存款
                  activeCode == 'SR' &&
                  <SRPrompt />
                }
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        {/*客服懸浮球*/}
        {/* <LivechatDragHoliday /> */}
      </View>
    );
  }
}

const stylespage = StyleSheet.create({
  ppbModalBtn: {
    padding: 10,
    backgroundColor: "#00a6ff",
    borderRadius: 8,
    width: width - 80,
  },
  ppbModalTitle: {
    backgroundColor: "#00A6FF",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: width - 50,
  },
  otpMsgBtn: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    width: width - 90,
  },
  otpLeftBtn: {
    borderColor: "#00a6ff",
    borderRadius: 5,
    width: (width - 110) * 0.5,
    borderWidth: 1,
  },
  otpRightBtn: {
    backgroundColor: "#00a6ff",
    borderRadius: 5,
    width: (width - 110) * 0.5,
  },
  moneyas: {
    backgroundColor: "#ebebed",
    borderRadius: 10,
    height: 40,
    marginTop: 10,
    paddingLeft: 5,
    justifyContent: "center",
  },
  BonusData: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 5,
    padding: 10,
  },
  bonusList: {
    width: 20,
    height: 20,
    borderRadius: 40,
    borderWidth: 2,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  BonusPop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  dateSelect: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 40,
    width: width / 2.4,
  },
  checkWallet: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    height: 40,
  },
  nomodalBtnok: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#efeff4",
    margin: 10,
  },
  selectText2: {
    color: "#666666",
    fontSize: 14,
    marginVertical: 10,
  },
  bonusItemBtn: {
    paddingVertical: 13,
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#F3F3F3",
    backgroundColor: "#FFFFFF",
    marginVertical: 3,
  },
  bonusItemTitle: {
    color: "#222222",
    fontSize: 14,
    paddingLeft: 20,
    width: width * 0.8,
  },
  //支付渠道樣式
  channel: {
    width: "48%",
    paddingLeft: 5,
    height: 44,
    borderColor: "#E3E3E8",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  paymenRadiusA: {
    borderColor: "#E3E3E8",
    borderWidth: 2,
    borderRadius: 12,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    // top: 10,
    // left: 10
  },
  paymenRadiusAHover: {
    borderColor: "#00a6ff",
    borderWidth: 4,
    borderRadius: 12,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    // top: 10,
    // left: 10
  },

  paymenRadiusB: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 11,
    height: 11,
  },
  paymenRadiusBHover: {
    // backgroundColor: '#00a6ff', borderRadius: 12, width: 15, height: 15,
  },

  OAMoneyButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: width * 0.2,
  },

  OAMoneyButtonHover: {
    backgroundColor: "#00A6FF",
    borderRadius: 8,
    width: width * 0.2,
  },
  //支付渠道樣式

  depositList: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  depositCode1: {
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    width: (width - 90) / 5,
    height: (width - 90) / 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 10,
    backgroundColor: "#00a6ff",
    borderRadius: 5,
  },
  depositCode2: {
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    width: (width - 90) / 5,
    height: (width - 90) / 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e3e3e8",
  },
  depositCode3: {
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    width: (width - 100) / 5,
    height: (width - 100) / 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e4e4e4",
  },
  depositCode4: {
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    width: (width - 100) / 5,
    height: (width - 100) / 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 10,
    backgroundColor: "#fff",
    // borderRadius: 5,
    // borderWidth: 1,
    // borderColor: "#e3e3e8",
  },
  emptyCode: {
    paddingVertical: 8,
    width: (width - 100) / 5,
    height: (width - 100) / 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 10,
  },
  SliderList: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  scaleKey: {
    width: 1,
    height: 8,
    backgroundColor: "#999999",
  },
  dropdown_D_text: {
    paddingBottom: 3,
    fontSize: 14,
    color: "#000",
    textAlignVertical: "center",
    lineHeight: 30,
    paddingLeft: 15,
  },
  dropdown_DX_dropdown: {
    borderRadius: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowColor: "#666",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4,
  },
  inputView: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    height: 38,
    display: "flex",
    alignItems: "center",
  },
  CTCData: {
    borderRadius: 10,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 6,
    paddingBottom: 12,
    paddingTop: 12,
    borderWidth: 1,
    borderColor: "#E3E3E8",
    width: (width - 50) * 0.5,
    minHeight: 74.5,
  },
  CTCList1: {
    width: 16,
    height: 16,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#00a6ff",
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  CTCList2: {
    width: 16,
    height: 16,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#bcbec3",
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  secussModal: {
    // width: width / 1.2,
    // height: height / 3,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtnclose: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 140,
    height: 44,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#00a6ff",
    margin: 10,
  },
  modalBtnok: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 140,
    height: 44,
    borderRadius: 5,
    backgroundColor: "#00a6ff",
    margin: 10,
  },
  CTCtypes: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    width: width - 50,
  },
  CTCtypeList1: {
    paddingTop: 10,
    width: (width - 65) * 0.5,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00a6ff",
    borderRadius: 10,
    marginBottom: 15,
  },
  CTCtypeList2: {
    paddingTop: 10,
    width: (width - 65) * 0.5,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e6e6eb",
  },
  noPage: {
    backgroundColor: "#eb2121",
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
    position: "absolute",
    right: 0,
    top: 0,
  },
  ppbOrder: {
    textAlign: "left",
    color: "#000",
    // fontWeight: "400",
    paddingTop: Platform.OS == "ios" ? 10 : 15,
    paddingBottom: 10,
  },
  ppbOrder2: {
    textAlign: "left",
    color: "#000",
    // fontWeight: "400",
    paddingVertical: 15
  },
  ppbSubmit: {
    textAlign: "center",
    color: "#2190FF",
    fontSize: 18,
    paddingTop: 20,
  },
  news: {
    backgroundColor: "#EA2222",
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    paddingVertical: 2.5,
    paddingHorizontal: 4,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 9,
  },
  fast: {
    backgroundColor: "#2057EB",
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    paddingVertical: 2.5,
    paddingHorizontal: 4,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 9,
  },
  newsIcon: {
    width: 20,
    height: 16,
    position: "absolute",
    right: 0,
    top: 0,
  },
  arrowTop: {
    position: "absolute",
    top: -20,
    width: 0,
    height: 0,
    zIndex: 9,
    borderWidth: 10,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderBottomColor: "#fff",
    borderRightColor: "transparent",
  },
  isQrcodeALB: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    width: width - 30,
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15,
  },
  isQrcodeBtn: {
    display: "flex",
    width: width - 50,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  isQrcodeBtnL: {
    width: (width - 65) * 0.5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#00A6FF",
  },
  isQrcodeBtnR: {
    width: (width - 65) * 0.5,
    borderRadius: 5,
    backgroundColor: "#00A6FF",
  },
  ALBmoneyView: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    width: width - 30,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 12,
    color: "#666666",
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
  moreDepositWithdrawalWrap: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#35C95B',
    width: "100%",
    // marginLeft: 3,
  },
  moreDepositWithdrawalItem: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 44,
  },
  modalClose: {
    position: 'absolute',
    top: 25,
    right: 25,
    zIndex: 99,
  },
  SRAmounts: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  SRAmountsItem: {
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: '#E3E3E8',
    width: (width - 84) / 4,
    marginTop: 8,
    marginLeft: 4,
    marginRight: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  checkBoxInnerAcitve: {
    width: 8,
    height: 8,
    backgroundColor: "#F92D2D",
    color: "#F92D2D",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  ppbModal: {
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  ppbModalMsg: {
    backgroundColor: '#FFF5BF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  newsTxt: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  navView: {
    width: width,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    flexDirection: 'row'
  },
  navTxt: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
});

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  userSetting: state.userSetting,
});
const mapDispatchToProps = (dispatch) => ({
  userInfo_updateMemberInfo: (data) =>
    dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
  selfExclusionsPopup: (open) =>
    dispatch(actions.ACTION_SelfExclusionsPopup(open)),
  getAnnouncementPopup: (optionType) => dispatch(actions.ACTION_GetAnnouncement(optionType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepositCenter);
