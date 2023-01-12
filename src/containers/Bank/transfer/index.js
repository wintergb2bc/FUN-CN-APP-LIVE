import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal as NativeModal,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";
import { Flex, Toast, WhiteSpace } from "antd-mobile-rn";
import { PushLayout } from "../../Layout";
import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index";
import Touch from "../../Common/TouchOnce";
import { connect } from "react-redux";
import AnalyticsUtil from "../../../actions/AnalyticsUtil"; //友盟
import OneClickTransfer from "./OneClickTransfer"; //友盟
import ModalDropdown from "react-native-modal-dropdown";
import { ACTION_UserInfo_getBalanceAll } from "../../../lib/redux/actions/UserInfoAction";
import { Toasts } from "../../Toast";
import { formatMoney } from "../../../lib/utils/util";
import AutoHeightImage from 'react-native-auto-height-image';
import { labelText } from "../../../lib/data/game";
// import actions from "../../../lib/redux/actions/index";
import actions from "$LIB/redux/actions/index";
import CsCallIcon from '@/containers/csCall/CsCallIcon'

const { width, height } = Dimensions.get("window");

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

class transfer extends React.Component {
  constructor(props) {
    super(props);
    this.onOpenChange = (isOpen) => {
      /* tslint:disable: no-console */
      console.log("是否打开了 Drawer", isOpen.toString());
    };
    this.state = {
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
      moneyST: "",
      monMoney: 1,
      maxMoney: 1,
      bonusId: 0,
      toAccount:
        this.props.froms == "promotions"
          ? this.props.promotionsDetail?.bonusProduct
          : "",
      fromAccount: this.props.froms == "promotions"
        ? "MAIN"
        : "",
      mainTotle: "",
      showPush: false,
      fastActive: 1,
      promotionData: "",
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
      toBalance: 0, //SB餘額
      SbUnderMaintenance: true, //SB維護狀態
      visibleOtherWalletList: false,
      visibleToWalletList: false,
      fastPayMoneyMAIN: false,
      tabType: this.props.froms == "promotions" ? 2 : 1, // 1.一键转账 2.普通转账

      // 未完成遊戲
      imgWrapHeight: 0,
      unfinishedGamesList: [],
      unfinishedGamesModal: false,
      unfinishedGamesMessages: "",

      // 有設轉帳總額限制彈窗
      exceedLimitModal: false
    };
  }

  componentWillMount() {
    //开启竖屏锁定
    window.openOrientation();
    // this.isloginGuide1()

    this.TotalBal();
    this.Bonus();
    if (this.props.userSetting.selfExclusions.disableFundIn) {
      this.props.selfExclusionsPopup(true);
      return;
    }
    // 公告
    this.props.getAnnouncementPopup("Transfer");
    console.log(this.props.promotionsDetail);
  }

  componentDidMount() {
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

  //键盘关闭监听，去获取优惠是否满足
  keyboardDidHideHandler() {
    this.bonusChange(this.state.bonusId, this.state.money);
  }

  getBtnPos1 = (e) => {
    NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
      console.log("pypypy", px, py);
      this.setState({
        BtnPosTop1: py,
        BtnPosLeft1: px,
      });
    });
  };
  getBtnPos2 = (e) => {
    NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
      console.log("pypypy222", px, py);
      this.setState({
        BtnPosTop2: py,
        BtnPosLeft2: px,
      });
    });
  };
  getBtnPos3 = (e) => {
    NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
      console.log("pypypy", px, py);
      this.setState({
        BtnPosTop3: py,
        BtnPosLeft3: px,
      });
    });
  };
  //当高度低于多少时候需要滑动
  getBtnPos4 = (e) => {
    NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
      console.log("pypypy", px, py);
      this.setState({
        heights: height,
      });
    });
  };

  //登录引导
  isloginGuide1() {
    global.storage
      .load({
        key: "isloginGuideTransfer1",
        id: "isloginGuideTransfer1",
      })
      .then((data) => {
      })
      .catch((err) => {
        this.setState({ isloginGuide1: true });
        storage.save({
          key: "isloginGuideTransfer1",
          id: "isloginGuideTransfer1",
          data: false,
          expires: null,
        });
      });
  }

  //登录引导
  isloginGuide2() {
    global.storage
      .load({
        key: "isloginGuideTransfer2",
        id: "isloginGuideTransfer2",
      })
      .then((data) => {
      })
      .catch((err) => {
        this.setState({ isloginGuide2: true });
        storage.save({
          key: "isloginGuideTransfer2",
          id: "isloginGuideTransfer2",
          data: false,
          expires: null,
        });
      });
  }

  UMpush(key) {
    //友盟點擊事件
    AnalyticsUtil.onEvent(key);
  }

  drpFrame = (style) => {
    style.width = "95%";
    style.left = 10;
    return style;
  };

  //转出转入
  _dropdown_renderButtonText(rowData) {
    return `${rowData.nameMoney}`;
  }

  //转出下拉
  _dropdown_1_renderRow(rowData, rowID, highlighted) {
    return (
      <View
        style={{
          width: width - 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: 10,
          paddingRight: 10,
          height: 35,
        }}
      >
        <Text style={{ color: highlighted ? "red" : "#000" }}>{`${rowData.localizedName
          }`}</Text>
        <Text style={{ color: highlighted ? "red" : "#000" }}>
          {rowData.state == "UnderMaintenance"
            ? "维护中"
            : rowData.balance + "元"}
        </Text>
      </View>
    );
  }

  //转入下拉
  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    return (
      <View
        style={{
          width: width - 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: 10,
          paddingRight: 10,
          height: 35,
        }}
      >
        <Text style={{ color: highlighted ? "red" : "#000" }}>{`${rowData.localizedName
          }`}</Text>
        <Text style={{ color: highlighted ? "red" : "#000" }}>
          {rowData.state == "UnderMaintenance"
            ? "维护中"
            : rowData.balance + "元"}
        </Text>
      </View>
    );
  }

  //优惠
  _dropdown_1_renderButtonText(rowData) {
    return `${rowData.title === "fun88_ApplyNextTime" ? "下回再参与！" : rowData.title
      }`;
  }

  //优惠下拉列表
  _dropdown_3_renderRow(rowData, rowID, highlighted) {
    return (
      <View
        style={{
          width: width - 43,
          backgroundColor: highlighted ? "#00A6FF" : "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: 10,
          paddingRight: 10,
          height: 55,
        }}
      >
        <Text style={{ color: highlighted ? "#fff" : "#666", lineHeight: 22 }}>
          {rowData.title != "" &&
            (rowData.title === "fun88_ApplyNextTime"
              ? "下回再参与"
              : rowData.title)}
        </Text>
        {/* <Text style={{color: highlighted? '#666': 'transparent'}}>✓</Text> */}
      </View>
    );
  }

  //转出账户选择
  fromWallet(key) {
    const { allBalance, otherWalletList } = this.state;
    let toWalletA = allBalance.filter((item) => {
      return item.name != otherWalletList[key].name;
    });
    this.setState(
      {
        fromAccount: otherWalletList[key].name,
        fromWalletKey: key,
        toWalletA, //转入账户去除已选择的转出
        maxMoney: otherWalletList[key].balance, //转账最大金额
        moneyST: "",
        money: "",
        Sliderss: 0.00001,
        UnderMaintenance1: otherWalletList[key].state == "UnderMaintenance", //是否维护
      },
      () => {
        this.validation();
      }
    );
  }

  //转入账户
  toWallet = (key) => {
    const { allBalance, toWalletA } = this.state;
    // let fromWalletA = allBalance.filter((item) => {
    //   return item.name != toWalletA[key].name;
    // });
    // return
    this.setState(
      {
        toWalletKey: key,
        // fromWalletA, //转出账户去除已选择的转入
        toAccount: toWalletA[key].name,
        // toWallet:  toWalletA[key].name,
        BonusData: [], //重置优惠列表
        bonusId: 0,
        BonusMSG: "",
        UnderMaintenance2: toWalletA[key].state == "UnderMaintenance", //是否维护
      },
      () => {
        this.validation();
      }
    );
    this.Bonus(toWalletA[key].name);
  };

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
    fetchRequest(ApiPort.Balance, "GET").then((data) => {
      console.log(data, "ssss");
      let res = data.result;
      if (data && res) {
        allBalance = res;
      }
      if (res.length > 0 && res[0].name) {
        let allBalance = this.balanceSort(res);
        const findToAccount = res.find((v) => v.name === this.state.toAccount);
        console.log(findToAccount);
        this.setState(
          {
            allBalance,
            fromWalletA: allBalance,
            toWalletA: allBalance, //默认转入账户为第一个主账户
            AccountTotalBal: res.find((v) => v.name === "TotalBal").balance,
            otherWalletList: res.filter(
              (v) =>
                v.name === "MAIN" ||
                (v.state === "UnderMaintenance" || v.balance !== 0) &&
                v.name !== "TotalBal"
            ),
            toBalance: findToAccount ? findToAccount.balance : 0, //SB 餘額
            SbUnderMaintenance: findToAccount ? findToAccount.state === "UnderMaintenance" : false, //SB維護狀態
            maxMoney: allBalance[0].balance, //转账最大金额
            toWalletKey: res.findIndex((v) => v.name === this.state.toAccount),
            toWallet: findToAccount ? findToAccount.localizedName : "",
          },
          () => {
            this.calcOtherWalletTotal();
          }
        );
        let TotalData = res.filter((item) => {
          return item.name == "TotalBal";
        });
        let MAINMoney = allBalance.filter((item) => {
          return item.name == "MAIN";
        });
        TotalBal = TotalData[0].balance;
        MAIN = MAINMoney[0].balance;
        window.ChangeMoney && window.ChangeMoney(MAIN, TotalBal);
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
      console.log(item);
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

  //输入金额
  moneyChange(value) {
    const { fromWalletA, fromAccount } = this.state;
    let test = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/g;
    let moneyST = "";
    let Sliderss = 0;
    let money = value.replace("￥", "");

    if (Number(this.state.maxMoney) == 0) {
      moneyST = "转出金额为零，请存款。";
    } else if (money == "" || Number(money) == 0) {
      moneyST = "请输入转账金额";
    } else if (Number(money) > Number(this.state.maxMoney)) {
      moneyST = "余额不足";
    } else if (test.test(Number(money))) {
      Sliderss = money / this.state.maxMoney;
    } else {
      moneyST = "请输入正确的转账金额格式";
    }

    // {
    //   fromWalletA.find((v) => v.name === fromAccount).localizedName;
    // }
    this.setState(
      {
        money,
        moneyST,
        Sliderss,
        UnderMaintenance1: fromAccount !== "" ? fromWalletA.find((v) => v.name === fromAccount).state ==
          "UnderMaintenance" : false
      },
      () => {
        this.validation();
      }
    );
  }

  //输入金额后校验优惠信息
  moneyBlur() {
    this.bonusChange(this.state.bonusId, this.state.money);
  }

  //滑动条金额
  sliderChange(value) {
    console.log("asdasdasd", value);
    let money = 0;
    if (value == 0) {
      money = 0.01;
    } else {
      money = (value * this.state.maxMoney).toFixed(2);
    }
    this.moneyChange("￥" + money);
  }

  //拿優惠
  Bonus(key) {
    const toAccount = key || this.state.toAccount;
    if (!toAccount) {
      return;
    }
    fetchRequest(
      ApiPort.Bonus + `?transactionType=Transfer&wallet=${toAccount}&`,
      "GET"
    )
      .then((data) => {
        let promotionId = -1;
        let promotionData = "";
        let BonusIndex = 0;
        console.log(this.props);
        let res = data.result;
        if (this.props.froms == "promotions") {
          //优惠跳转转账
          promotionId = this.props.promotionsDetail.bonusId;
          promotionData = res.find((Item) => {
            return Item.id == promotionId;
          });
          BonusIndex = res.findIndex((v) => v.id == promotionId);
          if (BonusIndex == -1) {
            BonusIndex = res.length - 1;
          }
        } else {
          BonusIndex = res.length - 1;
        }
        if (promotionData.length == 0) {
          promotionData = "";
        }

        this.setState(
          {
            promotionData,
            BonusData: res,
            BonusMSG: "",
          },
          () => {
            res.length > 0 && this.bonusSelect(BonusIndex);
          }
        );
      })
      .catch(() => {
      });
  }

  //优惠选择
  BonusButton = (key) => {
    let id = this.state.BonusData[key].id;
    this.setState({
      bonusId: this.state.BonusData[key].id,
      bonusCouponKEY: this.state.BonusData[key].bonusCouponID, //是否需要优惠码
    });
    this.bonusChange(id, this.state.money);
  };

  //获取优惠详情信息
  bonusChange = (id, money) => {
    let m = money.toString().replace("￥", "");
    if (id == 0) {
      this.setState({ BonusMSG: "" });
      return;
    }
    console.log('bonusChange');
    let data = {
      bonusMode: "Transfer",
      bonusId: id,
      amount: m || "0",
      wallet: this.state.toAccount,
    };
    this.setState({ BonusMSG: "" });
    Toast.loading("确认优惠中，请稍等...", 200);

    fetchRequest("/api/Bonus/Calculate?", "POST", data)
      .then((data) => {
        console.log('data ', data.result.message);
        console.log('id ', id);
        Toast.hide();
        if (data.result.previewMessage && data.result.previewMessage != "") {
          this.setState({
            // BonusMSG: data.previewMessage
            BonusMSG: "",
          });
        } else if (data.result.message != "") {
          this.setState({
            BonusMSG: id != 0 ? data.result.message : "",
          });
        }
      })
      .catch(() => {
        Toast.hide();
      });
  };

  //转账
  okPayMoney() {
    let ST = this.state;
    if (!ST.payMoneyBtn) {
      return;
    }

    let data = {
      fromAccount: ST.fromAccount,
      toAccount: ST.toAccount,
      amount: ST.money,
      // bonusId: ST.bonusId,
      blackBoxValue: Iovation,
      e2BlackBoxValue: E2Backbox,
    };

    if (ST.bonusCouponKEY != 0) {
      data.bonusCoupon = ST.bonusCoupon || "";
    }

    if (this.props.froms == "promotions") {
      let promoId = this.props.promotionsDetail?.promoId;
      PiwikEvent("Transfer", "Submit", `Transfer_${promoId}`);
    } else {
      PiwikEvent("Transfer", "Submit", "Normal_Transfer");
    }
    Toast.loading("转账中,请稍候...", 200);
    fetchRequest(ApiPort.POST_Transfer, "POST", data)
      .then((data) => {
        Toast.hide();
        this.payAfter(data.result);
      })
      .catch(() => {
        Toasts.fail(data.result.messages, 2);
      });
  }

  //给后台传优惠id，
  okBonusId(value) {
    let ST = this.state;
    let data = {
      blackBoxValue: Iovation,
      e2BlackBoxValue: E2Backbox,
      blackBox: E2Backbox,
      bonusId: ST.bonusId,
      amount: ST.money,
      bonusMode: "Transfer",
      targetWallet: ST.toAccount,
      couponText: "",
      isMax: false,
      transferBonus: {
        fromWallet: ST.fromAccount,
        transactionId: value.transferId,
      },
      successBonusId: value.successBonusId,
    };

    fetchRequest(ApiPort.POST_BonusApplications, "POST", data)
      .then((data) => {
        if (data && data.result.bonusResult && data.result.bonusResult.message == "Success") {
          //跳转其他页面
          Actions.pop();
          Actions.PromotionsBank({ froms: "transfer" });
        } else {
          setTimeout(() => {
            Toasts.fail("优惠申请失败，请联系在线客服", 2);
          }, 2000);
        }
      })
      .catch(() => {
      });
  }

  //信息完整验证
  validation() {
    const ST = this.state;
    if (ST.UnderMaintenance1) {
      Toasts.fail("您所选的账户在维护中，请重新选择", 2);
      return;
    }
    if (
      ST.money != "" &&
      ST.toAccount != "" &&
      ST.moneyST == "" &&
      ST.fromAccount != ""
    ) {
      this.setState({ payMoneyBtn: true });
    } else {
      this.setState({ payMoneyBtn: false });
    }
  }

  //转账后处理
  payAfter(data) {
    this.TotalBal();
    this.props.userInfo_getBalanceSB(true);

    if (data.selfExclusionOption && data.selfExclusionOption.isExceedLimit) {
      // 有設轉帳總額限制
      this.setState({
        exceedLimitModal: true
      });
    } else if (data.status != 1 && data.unfinishedGames) {
      // 有未完成遊戲
      this.checkUnfinishedGames(data);
    } else if (data.status != 1) {
      if (!data.messages) {
        Toasts.fail("转帐失败", 2);
      } else {
        let msg = data.messages;
        Toasts.fail(msg, 2);
      }
    } else {
      Toasts.success("转账成功", 2);
      this.Bonus();
      if (data && this.state.bonusId != 0) {
        this.okBonusId(data);
      }
    }
    //刷新账户余额
    this.setState({ fromAccount: "MAIN", money: "", payMoneyBtn: false });
  }

  checkUnfinishedGames = (data) => {
    let msg = data.messages || "";
    this.setState({
      unfinishedGamesList: data.unfinishedGames || [],
      unfinishedGamesModal: true,
      unfinishedGamesMessages: data.unfinishedGamesMessages || msg
    });
  }

  //快速转账选择
  fastSelect(key) {
    let toAccount2 = this.state.allBalance[key].name;
    this.fastSelectPiwik(toAccount2);
    let UnderMaintenance =
      this.state.allBalance[key].state == "UnderMaintenance";
    this.setState({ fastActive: key, toAccount2, UnderMaintenance });
  }

  fastSelectPiwik(key) {
    switch (key) {
      case "SB":
        PiwikEvent("BTiIMSPIMESTF_1clicktransfer_transfer");
        break;
      case "SP":
        PiwikEvent("SPsport__1clicktransfer_transfer");
        break;
      case "P2P":
        PiwikEvent("BoleP2P_1clicktransfer_transfer");
        break;
      case "KYG":
        PiwikEvent("KYGP2P_1clicktransfer_transfer");
        break;
      case "LD":
        PiwikEvent("Live__1clicktransfer_transfer");
        break;
      case "SLOT":
        PiwikEvent("Slot__1clicktransfer_transfer");
        break;
      case "PT":
        PiwikEvent("PT_1clicktransfer_transfer");
        break;
      case "BOY2":
        PiwikEvent("BYkeno_1clicktransfer_transfer");
        break;
      case "KENO":
        PiwikEvent("VRkeno_1clicktransfer_transfer");
        break;
      case "AG":
        PiwikEvent("Fishing2slot_1clicktransfer_transfer");
        break;
      default:
        break;
    }
  }

  //一键转账 MAIN
  fastPayMoneyMain() {
    if (!this.state.fromAccount) {
      Toasts.fail("Error");
      return;
    }
    let data = {
      fromAccount: "All",
      toAccount: "MAIN",
      amount: this.state.AccountTotalBal,
      bonusId: 0,
      blackBoxValue: Iovation,
      e2BlackBoxValue: E2Backbox,
      bonusCoupon: "",
    };
    PiwikEvent("Transfer", "Submit", "Transfer_oneclick");
    Toast.loading("转账中,请稍候...", 200);
    fetchRequest(ApiPort.POST_Transfer, "POST", data)
      .then((data) => {
        Toast.hide();
        if (data.isSuccess) {
          this.payAfter(data.result);
        }
      })
      .catch(() => {
      });
  }

  //一键转账
  fastPayMoney(item) {
    if (!item) {
      return;
    }

    if (item.state === "UnderMaintenance") {
      Toasts.fail("您所选的账户在维护中，请重新选择", 2);
      return;
    }

    let data = {
      fromAccount: "All",
      toAccount: item.name,
      amount: this.state.AccountTotalBal,
      bonusId: 0,
      blackBoxValue: Iovation,
      e2BlackBoxValue: E2Backbox,
      bonusCoupon: "",
    };
    PiwikEvent("Transfer", "Submit", "Transfer_oneclick");
    Toast.loading("转账中,请稍候...", 200);
    fetchRequest(ApiPort.POST_Transfer, "POST", data)
      .then((data) => {
        Toast.hide();
        if (data.isSuccess) {
          this.payAfter(data.result);
        }
      })
      .catch(() => {
      });
  }

  //优惠选择
  bonusSelect(key) {
    const BonusData = this.state.BonusData;
    this.setState({
      bonusCouponID: BonusData[key].bonusCouponID,
      bonusKey: key,
      bonusTitle: BonusData[key].title,
      bonusId: BonusData[key].id,
      BonusMSG: "",
    });
    this.bonusChange(BonusData[key].id, this.state.money);
  }

  //优惠码
  bonusCouponID(value) {
    this.setState({ bonusCoupon: value });
  }

  //显示
  showOtherWalletList() {
    if (this.state.otherWalletList && this.state.otherWalletList.length > 0) {
      this.setState({
        visibleOtherWalletList: true,
      });
    }
  }

  //隐藏
  hideOtherWalletList() {
    this.setState({
      visibleOtherWalletList: false,
    });
  }

  //显示
  showToWalletList() {
    if (this.state.toWalletA && this.state.toWalletA.length > 0) {
      this.setState({
        visibleToWalletList: true,
      });
    }
  }

  //隐藏
  hideToWalletList() {
    this.setState({
      visibleToWalletList: false,
    });
  }

  //弹框
  _renderModal() {
    const { otherWalletList, fromAccount } = this.state;
    return (
      <Modal
        isVisible={true}
        animationIn={"bounceInUp"}
        backdropColor={"#000"}
        backdropOpacity={0.4}
        style={{ justifyContent: "flex-end", margin: 0 }}
        onBackdropPress={() => this.hideOtherWalletList()}
      >
        <View
          style={{
            backgroundColor: "#efeff4",
            width: width,
            height: height / 1.5,
          }}
        >
          <ScrollView>
            <View>
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: 15,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                源自账户
              </Text>
            </View>
            {otherWalletList != "" && (
              <View style={{ paddingTop: 5, width: width - 30, left: 15 }}>
                {otherWalletList.length
                  ? otherWalletList.map((val, index) => {
                    if (val.name === this.state.toAccount) {
                      return null;
                    }
                    return (
                      <Touch
                        key={index}
                        onPress={() => this.fromWallet(index)}
                      >
                        <View style={styles.moneyButton}>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                            }}
                          >
                            <Text style={{ color: "#999" }}>
                              {val.localizedName}
                            </Text>
                          </View>

                          <View
                            style={{
                              flex: 1,
                              paddingRight: 20,
                              justifyContent: "flex-end",
                              alignItems: "flex-end",
                            }}
                          >
                            {val.state === "UnderMaintenance" ? (
                              <View>
                                <Text style={{ fontWeight: "bold" }}>
                                  维护中
                                </Text>
                              </View>
                            ) : (
                              <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontWeight: "bold" }}>
                                  ￥ {formatMoney(val.balance, 2)}
                                </Text>
                                <View
                                  style={
                                    val.name == fromAccount
                                      ? styles.moneyButtontochB
                                      : styles.moneyButtontochA
                                  }
                                ></View>
                              </View>
                            )}
                          </View>
                        </View>
                      </Touch>
                    );
                  })
                  : null}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  }

  //弹框
  _renderToWalletListModal() {
    const { toWalletA, toAccount } = this.state;
    return (
      <Modal
        isVisible={true}
        animationIn={"bounceInUp"}
        backdropColor={"#000"}
        backdropOpacity={0.4}
        style={{ justifyContent: "flex-end", margin: 0 }}
        onBackdropPress={() => this.hideToWalletList()}
      >
        <View
          style={{
            backgroundColor: "#efeff4",
            width: width,
            height: height / 1.5,
          }}
        >
          <ScrollView>
            <View>
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: 15,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                目标账户
              </Text>
            </View>
            {toWalletA != "" && (
              <View style={{ paddingTop: 5, width: width - 30, left: 15 }}>
                {toWalletA.length
                  ? toWalletA.map((val, index) => {
                    if (val.name === this.state.fromAccount) {
                      return null;
                    }
                    return (
                      <Touch key={index} onPress={() => this.toWallet(index)}>
                        <View style={styles.moneyButton}>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                            }}
                          >
                            <Text style={{ color: "#999" }}>
                              {val.localizedName}
                            </Text>
                          </View>

                          <View
                            style={{
                              flex: 1,
                              paddingRight: 20,
                              justifyContent: "flex-end",
                              alignItems: "flex-end",
                            }}
                          >
                            {val.state === "UnderMaintenance" ? (
                              <View>
                                <Text style={{ fontWeight: "bold" }}>
                                  维护中
                                </Text>
                              </View>
                            ) : (
                              <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontWeight: "bold" }}>
                                  ￥ {formatMoney(val.balance, 2)}
                                </Text>
                                <View
                                  style={
                                    val.name == toAccount
                                      ? styles.moneyButtontochB
                                      : styles.moneyButtontochA
                                  }
                                ></View>
                              </View>
                            )}
                          </View>
                        </View>
                      </Touch>
                    );
                  })
                  : null}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  }

  sourceAccountUI = () => {
    const { fromAccount, fromWalletA, visibleOtherWalletList } = this.state;
    return (
      <View
        style={{
          borderColor: "#E3E3E8",
          borderWidth: 1,
          borderRadius: 6,
        }}
      >
        {fromWalletA.length == 0 ? (
          <Text
            style={{
              fontSize: 14,
              lineHeight: 44,
              paddingLeft: 15,
            }}
          >
            数据加载中..
          </Text>
        ) : (
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              height: 44,
              borderRadius: 8,
              flex: 1,
            }}
          >
            <Touch
              style={{
                height: 44,
                flex: 1,
              }}
              onPress={() => this.showOtherWalletList()}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%",
                  height: 44,
                }}
              >
                <Text
                  style={{
                    color: "#222",
                    paddingLeft: 16,
                    fontSize: 14,
                  }}
                >
                  {fromAccount === "" ? "请选择账户" :
                    `${fromWalletA.find((v) => v.name === fromAccount).localizedName} ￥${fromWalletA.find((v) => v.name === fromAccount).balance}`
                  }
                </Text>
              </View>
            </Touch>
            {(this.props.froms === "promotions" && this.props.oneClick) && (
              <View style={{
                position: "absolute",
                right: 46,
                top: 11,
              }}>
                <Touch onPress={() => {
                  this.fastPayMoneyMain();
                }}>
                  <Image resizeMode='stretch' source={require('../../../images/transfer/onebutton2.png')}
                    style={{ width: 20, height: 20 }} />
                </Touch>
              </View>
            )}
            <View
              style={{
                position: "absolute",
                right: 16,
                top: 14,
              }}
            >
              <Image
                resizeMode="stretch"
                source={
                  visibleOtherWalletList
                    ? require("../../../images/up.png")
                    : require("../../../images/down.png")
                }
                style={{
                  width: 16,
                  height: 16,
                  transform: [{ rotateY: "180deg" }],
                }}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  targetAccountUI = () => {
    const { toWalletA, toAccount, visibleOtherWalletList } = this.state;
    return (
      <View
        style={{
          borderColor: "#E3E3E8",
          borderWidth: 1,
          borderRadius: 6,
        }}
      >
        {toWalletA.length == 0 ? (
          <Text
            style={{
              fontSize: 14,
              lineHeight: 44,
              paddingLeft: 15,
            }}
          >
            数据加载中..
          </Text>
        ) : (
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              height: 44,
              borderRadius: 8,
              flex: 1,
            }}
          >
            <Touch
              style={{
                height: 44,
                flex: 1,
              }}
              onPress={() => this.showToWalletList()}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%",
                  height: 44,
                }}
              >
                <Text
                  style={{
                    color: "#222",
                    paddingLeft: 16,
                    fontSize: 14,
                  }}
                >
                  {toAccount === "" ? "请选择账户" :
                    `${toWalletA.find((v) => v.name === toAccount).localizedName} ￥${toWalletA.find((v) => v.name === toAccount).balance}`
                  }
                  {/*{*/}
                  {/*  toWalletA.find((v) => v.name === toAccount).localizedName*/}
                  {/*}*/}
                  {/*￥{toWalletA.find((v) => v.name === toAccount).balance}*/}
                </Text>
              </View>
            </Touch>
            <View
              style={{
                position: "absolute",
                right: 16,
                top: 14,
              }}
            >
              <Image
                resizeMode="stretch"
                source={
                  visibleOtherWalletList
                    ? require("../../../images/up.png")
                    : require("../../../images/down.png")
                }
                style={{
                  width: 16,
                  height: 16,
                  transform: [{ rotateY: "180deg" }],
                }}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  render() {
    const {
      fromWalletA,
      allBalance,
      transferType,
      money,
      moneyST,
      BonusData,
      mainTotle,
      fastActive,
      payMoneyBtn,
      AccountTotalBal,
      toBalance,
      promotionData,
      BonusMSG,
      SbUnderMaintenance,
      fastPayMoneyMAIN,
      tabType,
      unfinishedGamesModal,
      unfinishedGamesList,
      unfinishedGamesMessages,
      exceedLimitModal
    } = this.state;
    window.ReloadMoneyS = () => {
      this.TotalBal();
    };

    window.showPushTransfer = (showPush) => {
      this.setState({ showPush });
    };
    return (
      <View style={{ flex: 1 }}>

        <NativeModal
          animationType='none'
          transparent={true}
          visible={unfinishedGamesModal}
          onRequestClose={() => {
          }}
        >
          <View style={styles.ModalBG}>
            <View style={styles.modalView}>
              <View style={{ backgroundColor: '#00A6FF', borderTopRightRadius: 10, borderTopLeftRadius: 10, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10 }}>
                <View style={{ width: 20, height: 20 }} />
                <Text style={{ color: '#fff', lineHeight: 40, textAlign: 'center' }}>温馨提醒</Text>
                <Touch style={styles.modalClose} onPress={() => {
                  this.setState({ unfinishedGamesModal: false });
                }}>
                  <Image
                    source={require('../../../images/icon/closeWhite.png')}
                    resizeMode='stretch'
                    style={{ width: 20, height: 20 }}
                  />
                </Touch>
              </View>

              {unfinishedGamesList.length > 0 ? (
                <>
                  <Image resizeMode='stretch' source={require('../../../images/icon/wranXL.png')} style={{ width: 60, height: 60, marginBottom: 16, marginTop: 30 }} />
                  <Text style={{ color: "#222", fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>交易申请失败</Text>
                  <Text style={{ color: '#666', lineHeight: 24, fontSize: 14, textAlign: "center" }}>系统侦测到您的账号正在进行游戏,{"\n"}请联系在线客服, 为您提供最贴心的服务</Text>

                  <ScrollView style={{ backgroundColor: "#EFEFF4", width: "90%", maxHeight: height * 0.456, marginVertical: 16, paddingVertical: 16, borderRadius: 8 }}>
                    {unfinishedGamesList.map((item, index) => {
                      const rowLen = unfinishedGamesList.length;
                      const isLast = rowLen === index + 1;
                      return (
                        <View key={item.gameId} style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 16, alignItems: "center", marginBottom: isLast ? 0 : 16 }}>
                          <View
                            style={[{ flex: .45 }, styles.gameImgWrap]}
                            onLayout={event => {
                              let { width, height } = event.nativeEvent.layout;
                              this.setState({
                                imgWrapHeight: width
                              }, () => {
                                console.log(width);
                              });
                            }
                            }
                            key={item.gameId}
                          >
                            <AutoHeightImage
                              resizeMode="stretch"
                              width={this.state.imgWrapHeight}
                              fallbackSource={require("../../../images/loadIcon/loadinglight.jpg")}
                              source={{ uri: item.imgGameName }}
                              defaultSource={require("../../../images/loadIcon/loadinglight.jpg")}
                            />
                            <View
                              style={{
                                backgroundColor: "#fff",
                                paddingVertical: 6,
                                paddingHorizontal: 10,
                                alignSelf: "flex-start",
                                width: "100%",
                                borderBottomLeftRadius: 8,
                                borderBottomRightRadius: 8
                              }}
                            >
                              <Text numberOfLines={1} style={{ color: "#333", fontSize: 12 }}>
                                {item.gameName}
                              </Text>
                            </View>
                            {labelText[item.provider] && (
                              <View
                                style={{
                                  position: "absolute",
                                  top: 6,
                                  left: 6,
                                  backgroundColor: labelText[item.provider].bgColor,
                                  paddingVertical: 3,
                                  paddingHorizontal: 5,
                                  borderRadius: 4,
                                }}
                              >
                                <Text
                                  style={{
                                    color: labelText[item.provider].color,
                                    fontSize: 10,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {labelText[item.provider].text}
                                </Text>
                              </View>
                            )}
                          </View>
                          <View style={{ flex: .55, justifyContent: "center", alignItems: "flex-end" }}>
                            <Touch style={{ width: "78%", borderRadius: 8, borderColor: "#00A6FF", borderWidth: 1, minHeight: 44, justifyContent: "center", alignItems: "center" }}
                              onPress={() => {
                                this.props.playGame({ provider: item.provider, gameId: item.gameId })
                                this.setState({ unfinishedGamesModal: false });
                              }}>
                              <Text style={{ color: "#00A6FF", fontSize: 16 }}>立即游戏</Text>
                            </Touch>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </>
              ) : (
                <Text style={{ color: '#666', lineHeight: 22, fontSize: 14, paddingHorizontal: 16, paddingVertical: 24 }}>{unfinishedGamesMessages}</Text>
              )}

              <Touch onPress={() => {
                this.setState({ unfinishedGamesModal: false });
              }} style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: "90%", marginBottom: 24 }}>
                <Text style={{ color: '#fff', lineHeight: 40, textAlign: 'center', fontWeight: 'bold' }}>我知道了</Text>
              </Touch>
            </View>
          </View>
        </NativeModal>

        <NativeModal
          animationType='none'
          transparent={true}
          visible={exceedLimitModal}
          onRequestClose={() => {
          }}
        >
          <View style={styles.ModalBG}>
            <View style={[styles.modalView, { borderRadius: 16 }]}>
              <View style={{ backgroundColor: '#00A6FF', borderTopRightRadius: 16, borderTopLeftRadius: 16, width: "100%" }}>
                <Text style={{ color: '#fff', lineHeight: 44, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>自我限制</Text>
              </View>

              <Touch style={{ paddingVertical: 24, paddingHorizontal: 16 }} onPress={() => {
                Actions.pop();
                LiveChatOpenGlobe();
              }}>
                <Text style={{
                  color: "#000",
                  fontSize: 14,
                  lineHeight: 22
                }}>转帐金额已超过您的自我限制金额，如需要任何帮助，请联系<Text
                  style={{ color: '#00a6ff', fontSize: 14 }}>在线客服</Text>。
                </Text>
              </Touch>

              <Touch onPress={() => {
                this.setState({ exceedLimitModal: false });
              }} style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: "90%", marginBottom: 16 }}>
                <Text style={{ color: '#fff', lineHeight: 44, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>知道了</Text>
              </Touch>
            </View>
          </View>
        </NativeModal>

        <View style={[styles.topNav]}>
          <Touch
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={() => {
              Actions.pop();
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../../../images/icon-white.png")}
              style={{ width: 24, height: 24 }}
            />
          </Touch>
          {this.props.froms == "promotions" ? (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>优惠申请</Text>
          ) : (
            <View style={styles.btnType}>
              <Touch
                style={[
                  styles.btnList,
                  { backgroundColor: tabType == 1 ? "#fff" : "transparent" },
                ]}
                onPress={() => {
                  this.setState({ tabType: 1 });
                }}
              >
                <Text
                  style={[
                    styles.btnTxt,
                    { color: tabType == 1 ? "#00a6ff" : "#CCEDFF" },
                  ]}
                >
                  一键转账
                </Text>
              </Touch>
              <Touch
                style={[
                  styles.btnList,
                  { backgroundColor: tabType == 2 ? "#fff" : "transparent" },
                ]}
                onPress={() => {
                  this.setState({ tabType: 2 });
                  // PiwikEvent("Announcement", "View", "Vendor_Announcement");
                }}
              >
                <Text
                  style={[
                    styles.btnTxt,
                    { color: tabType == 2 ? "#00a6ff" : "#CCEDFF" },
                  ]}
                >
                  普通转账
                </Text>
              </Touch>
            </View>
          )}
          <View style={{ flexDirection: 'row' }}>
            {this.props.csCall.isVip && <CsCallIcon />}
            <Touch
              onPress={() => {
                LiveChatOpenGlobe();
                PiwikEvent("Live Chat", "Launch", "Notification_CS");
              }}
            >
              <Image
                resizeMode="stretch"
                source={require("../../../images/cs.png")}
                style={{ width: 30, height: 30 }}
              />
            </Touch>
          </View>
        </View>
        <PushLayout showPush={this.state.showPush} />
        {/* 普通转账引导 */}
        {/* <Modal
					animationType="none"
					transparent={true}
					visible={this.state.isloginGuide1 && BtnPosTop1 != 0}
					onRequestClose={() => { }}
				>
					<View style={{
						flex: 1,
						zIndex: 9999,
						backgroundColor: "rgba(0, 0, 0,0.6)",
						alignItems: 'center',
					}}>
					</View>
				</Modal> */}
        {/* 快捷转账引导 */}
        {/* <Modal
					animationType="none"
					transparent={true}
					visible={this.state.isloginGuide2 && BtnPosTop2 != 0 && this.state.heights != 0}
					onRequestClose={() => { }}
				>
					<View style={{
						flex: 1,
						zIndex: 9999,
						backgroundColor: "rgba(0, 0, 0,0.7)",
						alignItems: 'center',
					}}>
					</View>
				</Modal> */}
        <ScrollView
          style={{ flex: 1 }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <WhiteSpace size="sm" />
          {/* {this.props.froms != "promotions" && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View style={styles.totalMoneyWrap}>
                <View style={styles.moneyFlex}>
                  <View style={styles.moneyWrapA}>
                    <Text style={styles.totalText}>总余额</Text>
                    <Text style={styles.totalText1}>
                      <Text style={{ fontSize: 12 }}>￥</Text>{" "}
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
                  <View style={{ top: 8, right: 10, display: "flex" }}>
                    <Touch
                      onPress={() => {
                        this.closePopver();
                      }}
                    >
                      <Image
                        resizeMode="stretch"
                        source={require("../../../images/transfer/notice.png")}
                        style={{ width: 17, height: 17, top: 3 }}
                      />
                    </Touch>

                    {AboutPopup && (
                      <View style={styles.Popover}>
                        <TouchableOpacity
                          onPress={() => {
                            this.closePopver();
                          }}
                          style={styles.PopoverConten}
                        >
                          <View style={styles.arrowB} />
                          <Text
                            style={{
                              color: "#fff",
                              paddingRight: 5,
                              fontSize: 12,
                            }}
                          >
                            包含沙巴体育, BTi体育, IM体育和电竞
                          </Text>
                          <Image
                            resizeMode="stretch"
                            source={require("../../../images/closeWhite.png")}
                            style={{ width: 15, height: 15 }}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <View style={styles.moneyWrapB}>
                    <Text style={styles.totalText}>体育/电竞</Text>
                    <Text style={styles.totalText1}>
                      <Text style={{ fontSize: 12 }}>￥</Text>{" "}
                      {formatMoney(toBalance, 2)}
                    </Text>
                  </View>
                  <View style={{ right: 10, top: 5 }}>
                    <Touch
                      onPress={() => {
                        this.fastPayMoney();
                      }}
                    >
                      <Image
                        resizeMode="stretch"
                        source={require("../../../images/transfer/onebutton.png")}
                        style={{ width: 24, height: 24 }}
                      />
                    </Touch>
                  </View>
                </View>

                <View style={styles.moneyWrap}>
                  <Text
                    style={[
                      styles.totalText,
                      { color: "#000", flex: 1, alignItems: "flex-start" },
                    ]}
                  >
                    其它钱包
                  </Text>
                  <Touch
                    onPress={() =>
                      this.setState({
                        otherWalletListOpen:
                          otherWalletListOpen == false ? true : false,
                      })
                    }
                    style={{ flexDirection: "row" }}
                  >
                    <Text
                      style={[
                        styles.totalText1,
                        { right: 5, alignItems: "flex-end" },
                      ]}
                    >
                      <Text style={{ fontSize: 12 }}>￥ </Text>{" "}
                      {formatMoney(otherWalletTotal, 2)}
                    </Text>
                    {otherWalletList != "" && otherWalletList.length > 0 && (
                      <View style={styles.arrow}></View>
                    )}
                  </Touch>
                </View>

                {otherWalletListOpen && otherWalletList != "" && (
                  <View style={styles.walletList}>
                    {otherWalletList.length
                      ? otherWalletList.map((val, index) => {
                          return (
                            <View
                              style={{
                                paddingTop: 5,
                                paddingBottom: 5,
                                width: width * 0.4,
                              }}
                            >
                              <Text style={{ color: "#999" }}>
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
                  </View>
                )}
              </View>
            </View>
          )} */}
          {tabType == 2 && transferType == "" && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  padding: 10,
                  paddingBottom: 20,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  width: width - 20,
                }}
              >

                {(this.props.froms === "promotions" && this.props.oneClick) && (
                  <View style={{
                    backgroundColor: "#FFF5BF",
                    padding: 15,
                    borderRadius: 10,
                  }}>
                    <Text style={{ color: "#83630B", fontSize: 12 }}>
                      温馨提示：请先点击一键转账将账户余额转账至主账户后，再转账申请此红利
                    </Text>
                  </View>
                )}

                {/* 转出自 */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#666666",
                      marginTop: 16,
                      marginBottom: 8,
                      fontSize: 12,
                    }}
                  >
                    源自账户
                  </Text>
                  {this.props.froms != "promotions" && this.sourceAccountUI()}
                  {this.props.froms == "promotions" && (
                    <View
                      style={{
                        borderColor: "#E3E3E8",
                        borderWidth: 1,
                        borderRadius: 6,
                      }}
                    >
                      {fromWalletA.length == 0 ? (
                        <Text
                          style={{
                            fontSize: 14,
                            lineHeight: 44,
                            paddingLeft: 15,
                          }}
                        >
                          数据加载中..
                        </Text>
                      ) : (
                        this.sourceAccountUI()
                      )}
                    </View>
                  )}
                </View>
                {/* 转入至 */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#666666",
                      marginTop: 24,
                      marginBottom: 8,
                      fontSize: 12,
                    }}
                  >
                    目标账户
                  </Text>
                  <View
                    style={{
                      backgroundColor:
                        this.props.froms !== "promotions"
                          ? "#fff"
                          : "#EFEFF4",
                      borderRadius: 8,
                    }}
                  >
                    {this.props.froms !== "promotions" ? (
                      this.targetAccountUI()
                    ) : SbUnderMaintenance ? (
                      <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 44,
                          paddingLeft: 15,
                        }}
                      >
                        数据加载中..
                      </Text>
                    ) : (
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          height: 44,
                        }}
                      >
                        <Text
                          style={{
                            color: "#bcbec3",
                            paddingLeft: 16,
                            fontSize: 14,
                          }}
                        >
                          {SbUnderMaintenance
                            ? "维护中"
                            : `${this.state.toWallet} ￥` +
                            formatMoney(toBalance, 2)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* 转账金额 */}

                <View
                  style={{
                    backgroundColor: "#fff",
                  }}
                >
                  <Text
                    style={{
                      color: "#666666",
                      fontSize: 12,
                      marginTop: 24,
                      marginBottom: 8,
                    }}
                  >
                    金额
                  </Text>
                  <View
                    style={{
                      borderColor: moneyST != "" ? "red" : "#ddd",
                      borderWidth: 1,
                      borderRadius: 5,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      value={money != "" && money}
                      maxLength={8}
                      style={{
                        textAlign: "left",
                        color: "#222",
                        height: 44,
                        width: "100%",
                        fontSize: 14,
                        paddingLeft: 16,
                      }}
                      placeholder={"输入金额"}
                      placeholderTextColor={"#999"}
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
                        borderRadius: 10,
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
                {promotionData != "" && this.props.froms == "promotions" && (
                  <View>
                    <View style={styles.BonusDatas}>
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#000",
                          width: width - 60,
                          lineHeight: 22,
                          paddingBottom: 15,
                          fontSize: 17,
                        }}
                      >
                        {promotionData.title}
                      </Text>
                      <View style={styles.stateList}>
                        <Text style={styles.statesTitle}>申请金额</Text>
                        <Text style={styles.statesTitle}>可得红利</Text>
                        <Text style={styles.statesTitle}>所需流水</Text>
                      </View>
                      <View style={styles.stateList}>
                        <Text style={styles.statesTitles}>
                          ¥{money == "" ? "0" : money}
                        </Text>
                        <Text style={styles.statesTitles}>
                          ¥
                          {Number(money) * promotionData.givingRate >
                            promotionData.maxGiving
                            ? promotionData.maxGiving
                            : (
                              Number(money) * promotionData.givingRate
                            ).toFixed(2)}
                        </Text>
                        <Text style={styles.statesTitles}>
                          {(
                            (Number(money) +
                              Number(money) * promotionData.givingRate) *
                            promotionData.releaseValue
                          ).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    {BonusMSG != "" && (
                      <Text
                        style={{
                          color: "red",
                          fontSize: 11,
                          width: width - 60,
                          lineHeight: 15,
                          paddingTop: 10,
                        }}
                      >
                        {BonusMSG}
                      </Text>
                    )}
                  </View>
                )}
                {console.log('BonusMSG ', BonusMSG)}
                {/* 优惠选择 */}
                {(this.props.froms != "promotions" || promotionData == "") &&
                  BonusData != "" && (
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          marginTop: 24,
                          marginBottom: 8,
                          color: "#666666",
                        }}
                      >
                        优惠申请
                      </Text>

                      <Flex style={{ backgroundColor: "#fff" }}>
                        <Flex.Item
                          style={{
                            flex: 1,
                            height: 44,
                            backgroundColor: "#fff",
                            borderColor: "#E3E3E8",
                            borderWidth: 1,
                            borderRadius: 6,
                            justifyContent: "center",
                          }}
                        >
                          <ModalDropdown
                            ref={(el) => (this._dropdown_3 = el)}
                            defaultValue="下回再参与"
                            defaultIndex={BonusData.length - 1}
                            textStyle={styles.dropdown_D_text}
                            dropdownStyle={[
                              styles.dropdown_DX_dropdown,
                              {
                                height:
                                  BonusData.length > 2
                                    ? 55 * 3
                                    : 55 * BonusData.length,
                              },
                            ]}
                            options={BonusData}
                            renderButtonText={(rowData) =>
                              this._dropdown_1_renderButtonText(rowData)
                            }
                            renderRow={this._dropdown_3_renderRow.bind(this)}
                            onSelect={this.BonusButton}
                          />
                          <View
                            style={{ position: "absolute", right: 10, top: 12 }}
                          >
                            <Image
                              resizeMode="stretch"
                              source={require("../../../images/down.png")}
                              style={{ width: 16, height: 16 }}
                            />
                          </View>
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
                  )}

                {/* 立即转账 */}
                <Touch
                  onPress={() => this.okPayMoney()}
                  style={{
                    backgroundColor: payMoneyBtn ? "#00a6ff" : "#EFEFF4",
                    borderRadius: 5,
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      color: payMoneyBtn ? "#fff" : "#BCBEC3",
                      lineHeight: 44,
                      textAlign: "center",
                    }}
                  >
                    提交
                  </Text>
                </Touch>

                {/* <Touch
                  onPress={() => {
                    Actions.pop();
                    Actions.DepositCenter({
                      froms: "promotions",
                      promotionsDetail: this.props.promotionsDetail,
                    });
                  }}
                  style={{
                    borderColor: "#00a6ff",
                    borderRadius: 5,
                    borderWidth: 1,
                    marginTop: 15,
                  }}
                >
                  <Text
                    style={{
                      color: "#00a6ff",
                      lineHeight: 44,
                      textAlign: "center",
                    }}
                  >
                    存款
                  </Text>
                </Touch> */}
              </View>
            </View>
          )}
          {tabType == 1 &&
            (allBalance != "" ? (
              <OneClickTransfer
                allBalance={allBalance}
                AccountTotalBal={AccountTotalBal}
                fastPayMoney={(item) => this.fastPayMoney(item)}
              />
            ) : (
              <View style={{ marginTop: 20 }}>
                <ActivityIndicator color="#00A6FF" />
              </View>
            ))}
        </ScrollView>

        {/*源自帳戶彈窗*/}
        {this.state.visibleOtherWalletList && this._renderModal()}
        {/*源自帳戶彈窗*/}
        {this.state.visibleToWalletList && this._renderToWalletListModal()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
  userSetting: state.userSetting,
  csCall: state.csCall,
});
const mapDispatchToProps = (dispatch) => ({
  userInfo_getBalanceSB: (forceUpdate = false) =>
    dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
  playGame: (data) => dispatch(actions.ACTION_PlayGame(data)),
  selfExclusionsPopup: (open) =>
    dispatch(actions.ACTION_SelfExclusionsPopup(open)),
  getAnnouncementPopup: (optionType) => dispatch(actions.ACTION_GetAnnouncement(optionType)),
});


export default connect(mapStateToProps, mapDispatchToProps)(transfer);

const styles = StyleSheet.create({
  dropdown_D_text: {
    fontSize: 14,
    color: "#222",
    textAlignVertical: "center",
    paddingLeft: 16,
    width: width * 0.75,
  },
  dropdown_DX_dropdown: {
    borderWidth: 1,
    borderColor: "#E3E3E8",
    overflow: "hidden",
    marginTop: 14,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowColor: "#fff",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4,
  },
  fastBox: {
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 5,
    flexWrap: "wrap",
    marginTop: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  fastList: {
    width: width / 3.52,
    height: 70,
    borderWidth: 1,
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  fastBtn: {
    backgroundColor: "#fff",
    padding: 15,
    display: "flex",
    justifyContent: "center",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  moneyButton: {
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
  },
  moneyButtontochA: {
    borderColor: "#bcbec3",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 16,
    width: 15,
    height: 15,
    left: 8,
    top: 1,
  },
  moneyButtontochB: {
    borderColor: "#00a6ff",
    backgroundColor: "#fff",
    borderWidth: 3,
    borderRadius: 16,
    width: 15,
    height: 15,
    left: 8,
    top: 1,
  },
  BonusDatas: {
    width: width - 40,
    borderWidth: 1,
    borderColor: "#E3E3E8",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  stateList: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 10,
    width: width - 60,
  },
  statesTitle: {
    color: "#666666",
    fontSize: 12,
    width: (width - 60) / 3,
    textAlign: "center",
  },
  statesTitles: {
    color: "#000",
    width: (width - 60) / 3,
    textAlign: "center",
  },
  topNav: {
    width: width,
    height: 50,
    backgroundColor: "#00a6ff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btnTxt: {
    textAlign: "center",
    lineHeight: 32,
  },

  modalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: width * 0.92,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // top: 120
  },
  ModalBG: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0,0.5)",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameImgWrap: {
    // height: 114,
    // height: 0.333 * (width - 20),
    // marginRight: 8,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});
