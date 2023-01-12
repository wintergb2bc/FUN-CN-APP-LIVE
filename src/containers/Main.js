import React from "react";
import {
  BackHandler,
  Dimensions,
  Image,
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Flex, Toast } from "antd-mobile-rn";
import { connect } from "react-redux";
import DeviceInfo from "react-native-device-info"; //獲取設備信息
import { Actions, Lightbox, Modal, Router, Scene, Stack, Drawer, ActionConst } from "react-native-router-flux";
// import EuroCup from "../EuroCup/index";
// import EuroCupGroup from "../EuroCup/Group/index";
// import EuroGroupDetail from "../EuroCup/Group/EuroGroupDetail";
// import EuroPlayerDetail from "../EuroCup/Group/EuroPlayerDetail";
import PromotionsDetail from "../EuroCup/Tabs/PromoTab/PromotionsDetail/index";
import PromotionsEverydayGift from "../EuroCup/Tabs/PromoTab/PromotionsEverydayGift";
import PromotionsForm from "../EuroCup/Tabs/PromoTab/PromotionsForm/index";
import PromoRebateHistory from "../EuroCup/Tabs/PromoTab/PromoRebateHistory/index";
import PromotionsRebateDetail from "../EuroCup/Tabs/PromoTab/PromotionsRebateDetail/index";
import PromotionsBank from "./Bank/PromotionsBank";
import PromotionsAddress from "../EuroCup/Tabs/PromoTab/PromotionsAddress/index";
import Newaddress from "../EuroCup/Tabs/PromoTab/PromotionsAddress/Newaddress";
import PromoTab from "../EuroCup/Tabs/PromoTab/index";
import FreebetSetting from '../EuroCup/Tabs/PromoTab/FreebetSetting'

// import DoubleEleven from "../game/DoubleEleven";
import BettingRecord from "./BettingRecord";
import BettingRecordDetail from "./BettingRecord/BettingRecordDetail";
import Login from "./Login/Login";
import ForgetName from "./Login/ForgetName";
import Home from "./Home";
import LoginOtp from "./loginOtp/loginOtp";
import SecurityNotice from "./loginOtp/SecurityNotice";
import SecurityUpdateNotice from "./RestPassword/SecurityUpdateNotice";
import SetVerification from "./RestPassword/SetVerification";
import SetBankThreshold from "./Bank/SetBankThreshold";
import SetPassword from "./RestPassword/SetPassword";
import News from "./News";
import NewsDetail from "./NewsDetail";
import RestrictPage from "./RestrictPage"; //限制页面
import Orientation from "react-native-orientation-locker";

import DepositCenter from "./Bank/DepositCenter";
import CTCpage from "./Bank/CTCpage";
import DepositPage from "./Bank/DepositPage";
import DepositCenterPage from "./Bank/DepositCenterPage";
import PPBSecondStep from './Bank/PPBSecondStep'
import SRSecondStep from './Bank/SRSecondStep'
import Transfer from "./Bank/transfer";
import WorldCup from './Events/WorldCup';
import WorldCupNewDetail from './Events/WorldCup/WorldCupNewDetail';
import WorldCupNew from './Events/WorldCup/WorldCupNew';
import WorldCupMyPrize from './Events/WorldCup/WorldCupMyPrize';
import WorldCupMyRule from './Events/WorldCup/WorldCupMyRule';
// import Betting_detail from "../game/Betting-detail/index";

import NotificationDetail from "./notificationDetail";
import LoginTouch from "./LoginPage/LoginTouch";
import LoginPattern from "./LoginPage/LoginPattern";
import SetLogin from "./LoginPage/SetLogin";
// import LoginFace from "./LoginPage/LoginFace";
// import LoginPage from "./LoginPage/LoginPage";
import FastLogin from "./LoginPage/FastLogin";
import GamePage from "./Game/GamePage";
import TabIcon from "./tabIcon";
import TabIconWCP from "./Home/tabIconWCP";
import AnalyticsUtil from "./../actions/AnalyticsUtil";
import Touch from "react-native-touch-once";
import User from "./Profile";
import userInfor from "./Profile/UserInfo";
import UserUpdateInfo from "./Profile/UserInfo/UserUpdateInfo";
import ChangePassword from "./Profile/UserInfo/ChangePassword";
import SecurityQuestion from "./Profile/UserInfo/SecurityQuestion";
import PreferWallet from "./Profile/UserInfo/PreferWallet";
import SelfExclusion from "./Profile/SelfExclusion";
import SecurityCode from "./Profile/SecurityCode";
import UploadFile from "./Profile/UploadFile";
import UploadFileDetail from "./Profile/UploadFile/UploadFileDetail";
import UploadFileStatus from "./Profile/UploadFile/UploadFileStatus";
import UploadExample from "./Profile/UploadFile/UploadExample";
import UploadFileGuide from "./Profile/UploadFile/UploadFileGuide";

import bankcard from "./bankcard";
import bankcardDetail from "./bankcardDetail";
import recordes from "./recordes/recordes";
import withdrawal from "./withdrawal";
import SecurityCheck from "./Profile/SecurityCheck";
import VIP from "./Profile/VIP";
import ModifyName from "./ModifyName";

import recordsDatails from "./recordes/recordsDatails";
import NewBank from "./NewBank";
import CreatWallet from "./CreatWallet";
import Withdrawalverification from "./Withdrawalverification";
import Verification from "./Verification";
import RedoDepositTransaction from "./RedoDepositTransaction";
import withdrawalGuide from "./withdrawalGuide";
import withdrawalSuccess from "./withdrawalSuccess";
import ProductIntro from "./Game/ProductIntro";
import ProductGamePage from "./Game/ProductGamePage";
import ProductGameDetail from "./Game/ProductGameDetail";
import KingClub from "./Profile/KingClub";
import AboutUSDT from "./Profile/AboutUSDT";
import USDTHelpCenter from "./Profile/AboutUSDT/USDTHelpCenter";
import USDTWalletProtocols from "./Profile/AboutUSDT/USDTWalletProtocols";
import Sponsor from "./Profile/Sponsor";
import Recommend from "./Profile/Recommend";
import RecommendPage from "./Profile/Recommend/RecommendPage";
import HelpCenter from "./Profile/Help";
import HelpDetail from "./Profile/Help/HelpDetail";
import BankCardVerify from './Bank/BankCardVerify'

import NavigationUtil from "../lib/utils/NavigationUtil";
import actions from "../lib/redux/actions/index";
import { logout } from "../lib/redux/actions/AuthAction";
import PiwikAction from "../lib/utils/piwik";


import SbSports from './SbSports/containers/index';
import Rules from './SbSports/containers/Help/Rules';
import BetTutorial from './SbSports/containers/Betting/tutorial';
import Betting_detail from './SbSports/game/Betting-detail/index';
import betRecord from './SbSports/containers/Betting/betRecord';
import search from './SbSports/containers/search';
import TransferSb from './SbSports/containers/TransferSb';
import Setting from './SbSports/containers/Setting/Setting';
import SetTingModle from './SbSports/containers/Setting/SetTingModle';
import NewsSb from './SbSports/containers/News';
import NewsDetailSb from './SbSports/containers/NewsDetail';
import SbShare from "./SbSports/game/Betting-detail/SbShare";
import DrawerContent from './SbSports/containers/DrawerContent';

import PoppingGame from './Events/MidAutumn/PoppingGame';
import GoldenWeek from './Events/GoldenWeek';
import moment from "moment";

import OpenAviatorGame from '../containers/Game/OpenAviatorGame'
import GamePageNavLeft from './Game/AviatorGame/Nav/GamePageNavLeft'
import GamePageNavRight from './Game/AviatorGame/Nav/GamePageNavRight'
import GamePageNavMiddle from './Game/AviatorGame/Nav/GamePageNavMiddle'
import ToggleVipCsCall from '@/containers/csCall/ToggleVipCsCall'

const RouterWithRedux = connect()(Router);
import { StackViewStyleInterpolator } from 'react-navigation-stack';
import SbTabBar from "./SbSports/SbTabBar";
const AffCodeAndroid = NativeModules.opeinstall; //android 獲取code 參數

//  监听原生 UM push  监听外部通知 benji 9/14
const { CheckInvoice } = NativeModules;
const checkInvoiceEmitter = CheckInvoice
  ? new NativeEventEmitter(CheckInvoice)
  : "";

const { width, height } = Dimensions.get("window");
let PushNative = NativeModules.PushNative; //push跳转到原生ios里面
// piwik
window.PiwikEvent = (track, action, name) => {
  // console.log("Piwik發送", track, action, name);
  console.log("%c" + `Piwik發送 ${track} ${action} ${name}`, 'background: #222; color: #bada55; font-size: 14px');

  //這是給piwik sdk 追蹤
  if (Platform.OS === "android") {
    NativeModules.opeinstall.PiwikTackEvent("Tarck", track, action, name);
  }
  if (Platform.OS === "ios") {
    PushNative.PiwikTackEvent("data", { track, action, name });
  }
};
window.PiwikMenberCode = (data) => {
  if (Platform.OS === "android") {
    NativeModules.opeinstall.PiwikTackEvent(
      "menberCode",
      data,
      "menberCode",
      "menberCode"
    );
  }
  if (Platform.OS === "ios") {
    PushNative.PiwikTackMemberCode("data", { track: data });
  }
};
window.PiwikVersion = (data) => {
  if (Platform.OS === "android") {
    NativeModules.opeinstall.PiwikTackEvent("APPVER", data, " ", " ");
  }
  if (Platform.OS === "ios") {
    PushNative.PiwikTackVersion("data", { track: data });
  }
};


let backTime = 0;
let time = 0;
const onBackPress = () => {
  if (Actions.state.index == 0) {
    if (Platform.OS === "android") {
      Toast.info("再按一次退出应用", 3);
      if (backTime == 1) {
        BackHandler.exitApp();
      }
      backTime++;
      //BackHandler.exitApp();
      setTimeout(() => {
        backTime = 0;
      }, 3000);

      return true;
    }
  }
  return true;
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount(props) {
  }

  componentDidMount() {
    this.openOrientation()
    this.getDeviceInfoIos();
    this.UpushJump(); // UM推送 點擊跳指定頁面
  }

  componentWillUnmount() {
    this.removeOrientation()
  }

  openOrientation() {
    //锁定竖屏
    if (Platform.OS === "ios") {
      console.log('====LockOrientation');
      Orientation.lockToPortrait();
      Orientation.removeOrientationListener(this._onOrientationChange); //先移掉再加上，避免多個Listener同時使用，造成怎麼樣都無法旋轉
      Orientation.addOrientationListener(this._onOrientationChange);
    } else {
      Orientation.lockToPortrait();
    }
  }

  _onOrientationChange(props) {
    console.log('==== onOrientationChange to LOCK');
    Orientation.lockToPortrait();
  }

  removeOrientation() {
    //移除锁定竖屏
    if (Platform.OS === "ios") {
      console.log('====RemoveOrientation');
      Orientation.unlockAllOrientations();
      Orientation.removeOrientationListener(this._onOrientationChange);
    } else {
      Orientation.unlockAllOrientations();
    }
  }
  
  //判断iphonex以上型号
  getDeviceInfoIos = () => {
    if (Platform.OS === "android") {
      window.DeviceInfoIos = false;
    } else {
      //ios手机型号是有指纹的
      let iphoneXMax = [
        "iPhone 5",
        "iPhone 5s",
        "iPhone 6",
        "iPhone 6s",
        "iPhone 6s Plus",
        "iPhone 7",
        "iPhone 7 Plus",
        "iPhone 8",
        "iPhone 8 Plus",
        "iPhone SE",
      ];
      const getModel = DeviceInfo.getModel();
      if (iphoneXMax.indexOf(getModel) > -1) {
        window.DeviceInfoIos = false;
      }
    }
  };

  UpushJump() {
    //友盟推送接收

    setTimeout(() => {
      if (Platform.OS == "android") {
        //原生事件不存在 終止事件
        if (!AffCodeAndroid.getUMMSG) {
          return;
        }
        AffCodeAndroid.getUMMSG((info) => {
          console.log(info, "umMSGAAA");
          if (info.CODE) {
            let msgD = JSON.parse(info.CODE);
            console.log(msgD, "umMSG");
            if (msgD.url) {
              if (msgD.url == "registered") {
                Logonregist();
              }

              if (msgD.url == "inbox") {
                UmPma = true; //全局參數 在home.js執行跳收件箱
                if (ApiPort.UserLogin == true) {
                  //已登陸狀態
                  Actions.news();
                  UmPma = false;
                }
              }
            }
          }
        });
      }

      if (Platform.OS == "ios") {
        //獲取原生事件失敗 停止
        if (checkInvoiceEmitter == "") {
          return;
        }
        //  监听iOS原生 UM push  监听外部通知 benji 9/14
        checkInvoiceEmitter.addListener("didReceiveNotification", (info) => {
          //Clipboard.setString(info.aps.alert.jump1)

          if (info.url) {
            if (info.url == "registered") {
              Logonregist();
            }
            if (info.url == "inbox") {
              UmPma = true; //全局參數 在home.js執行跳收件箱
              if (ApiPort.UserLogin == true) {
                //已登陸狀態
                Actions.news();
                UmPma = false;
              }
            }
          }
        });
      }
    }, 10000);
  }

  navigateToScene(key, item, logoutx) {
    if (item) {
      setTimeout(() => {
        Toasts.fail(item);
      }, 1500);
    }
    if (key === "logout") {
      if (!logoutx && ApiPort.UserLogin) {
        this.logout();
      }
      ApiPort.UserLogin = false;
      ApiPort.Token = "";
      global.localStorage.setItem("loginStatus", 0);
      isMobileOpen = false;
      this.props.logout();
      this.props.userInfo_logout(); //清空redux用戶資料
      this.props.isVipHandler(false)
      //清理vendor緩存
      localStorage.removeItem('IM_Token');
      localStorage.removeItem('IM_MemberCode');
      localStorage.removeItem('IM_MemberType');
      localStorage.removeItem('IM_Token_ExpireTime');
      localStorage.removeItem('BTI_Token');
      localStorage.removeItem('BTI_MemberCode');
      localStorage.removeItem('BTI_JWT');
      localStorage.removeItem('BTI_Token_ExpireTime');
      localStorage.removeItem('SABA_Token');
      localStorage.removeItem('SABA_MemberCode');
      localStorage.removeItem('SABA_JWT');
      localStorage.removeItem('SABA_Token_ExpireTime');
      this.props.announcement_clear(); //清空redux公告資料
      this.props.selfExclusions_clear(); //清空自我限制資料
      setTimeout(() => {
        Gologin = true;
      }, 2000);
      AnalyticsUtil.onEvent("logout_sidemenu");
      return;
    }

    Actions[key]({});
  }

  logout() {
    const memberDataLogin = window.memberDataLogin;

    let data = {
      clientId: "Fun88.CN.App",
      clientSecret: "FUNmuittenCN",
      refreshToken: memberDataLogin.refreshToken
        ? memberDataLogin.refreshToken
        : "",
      deviceToken: window.Devicetoken,
      packageName: Platform.OS === "ios" ? appIOSId : appAndroidId,
      imei: "",
      macAddress: window.userMAC,
      serialNumber: "",
      pushNotificationPlatform: "umeng+",
      os: Platform.OS === "android" ? "Android" : "iOS",
      siteId: siteId,
      ipAddress: "",
    };
    fetchRequest(ApiPort.logout, "POST", data)
      .then((res) => {
      })
      .catch((error) => {
      })
      .finally((error) => {
      });
  }

  render() {
    window.openOrientation = () => {
      this.openOrientation();
    };
    window.removeOrientation = () => {
      this.removeOrientation();
    };

    // 清緩存logout
    window.navigateToSceneGlobe = (msg = "") => {
      this.navigateToScene("logout", msg, true);
    };

    // 清緩存logout + call post logout
    window.navigateToSceneGlobeX = (msg = "") => {
      this.navigateToScene("logout", msg, false);
    };

    const AppLogoGamePage = () => {
      return (
        <Flex>
          {Platform.OS === "android" ? (
            <Flex.Item
              alignItems="center"
              style={{ flex: 1, marginLeft: 0, marginTop: -5 }}
            >
              <Image
                resizeMethod="resize"
                resizeMode="cover"
                source={require("../images/home/funLogo.png")}
                style={{ width: 78.5, height: 35 }}
              />
            </Flex.Item>
          ) : (
            Platform.OS === "ios" && (
              <Flex.Item alignItems="center" style={{ marginTop: -5 }}>
                <Image
                  resizeMode="stretch"
                  source={require("../images/home/funLogo.png")}
                  style={{ width: 78.5, height: 35 }}
                />
              </Flex.Item>
            )
          )}
        </Flex>
      );
    };

    const Reload = () => {
      return (
        <View style={{ right: 15 }}>
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 40, right: 20 }}
            onPress={() => {
              window.openmenuX && window.openmenuX();
            }}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 0,
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../images/icon/more.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
      );
    };

    const DrawerImage = () => {
      return (
        <View style={styles.drawerImageComponent}>
          <Image
            source={require("../images/drawer/drawer.png")}
            style={styles.drawerImage}
          />
        </View>
      );
    };
    const LiveChackIcon = (type) => {
      return (
        <Touch
          onPress={() => {
            if (type == "DepositCenter") {
              PiwikEvent("LiveChat", "Launch", "Deposit_CS");
            } else if (type == "Transfer") {
              PiwikEvent("LiveChat", "Launch", "Transfer_CS");
            }
            LiveChatOpenGlobe();
          }}
          style={{ paddingRight: 15 }}
        >
          <Image
            source={require("../images/cs.png")}
            style={{ width: 30, height: 30 }}
          />
        </Touch>
      );
    };

    const BackIconHome = () => {
      return (
        <View style={{ paddingLeft: 15 }}>
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            onPress={() => {
              ApiPort.UserLogin ? Actions.home1() : Actions.home();
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../images/icon-white.png")}
              style={{ width: 21, height: 21 }}
            />
          </TouchableOpacity>
        </View>
      );
    };

    const MyTransitionSpec = ({
      duration: 300,
      // easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
      // timing: Animated.timing,
    });

    const transitionConfig = () => ({
      transitionSpec: MyTransitionSpec,
      // screenInterpolator: StackViewStyleInterpolator.forFadeFromBottomAndroid,
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;
        const width = layout.initWidth;

        //right to left by replacing bottom scene


        const inputRange = [index - 1, index, index + 1];

        const opacity = position.interpolate({
          inputRange,
          outputRange: ([0, 1, 0]),
        });

        const translateX = position.interpolate({
          inputRange,
          outputRange: ([width, 0, 0]),
        });

        return {
          opacity,
          transform: [
            { translateX }
          ],
        };

        //from center to corners
        // const inputRange = [index - 1, index, index + 1];
        // const opacity = position.interpolate({
        //     inputRange,
        //     outputRange: [0.8, 1, 1],
        // });

        // const scaleY = position.interpolate({
        //     inputRange,
        //     outputRange: ([0.8, 1, 1]),
        // });

        // return {
        //     opacity,
        //     transform: [
        //         { scaleY }
        //     ]
        // };
      }
    });


    const WorldCupAppLogo = () => {
      return (
        <Flex>
          {Platform.OS === "android" ? (
            <Flex.Item
              alignItems="flex-start"
              style={{ flex: 1, marginLeft: 0, marginTop: -5 }}
            >
              <Image
                resizeMethod="resize"
                resizeMode="stretch"
                source={require("../images/worldCup/Logo_WC-2022-CN.png")}
                style={{ width: 84, height: 24 }}
              />
            </Flex.Item>
          ) : (
            Platform.OS === "ios" && (
              <Flex.Item alignItems="flex-start" style={{ marginTop: -5, marginLeft: -15 }}>
                <Image
                  resizeMode="stretch"
                  source={require("../images/worldCup/Logo_WC-2022-CN.png")}
                  style={{ width: 84, height: 24 }}
                />
              </Flex.Item>
            )
          )}
        </Flex>
      );
    };
    
    return (
      <RouterWithRedux
        backAndroidHandler={onBackPress}
        onStateChange={(prevState, newState, action) => {
          console.log('action.routeName ',action.routeName)
          if (action.routeName === "WorldCup") {
            PiwikAction.SendPiwik("Enter_WCPage2022_BottomNav");
            window.refreshingWorldCup();
          }
          //console.log('===Router State Changed',prevState,newState,action);
          //判斷當前是否還可以執行Actions.pop(); 用於sb2.0"返回樂天堂"按鈕(=0則無法pop，因為沒有上層scene了)
          //幾乎全部都在lightbox內，所以有多層結構，要往內找 root => lightbox => 實際要摸的stack
          let routeIndex = 0;
          const lightbox = newState && newState.routes ? newState.routes[newState.index] : null;
          if (lightbox) {
            const stacks = lightbox.routes ? lightbox.routes[lightbox.index] : null;
            routeIndex = stacks.index;
          }
          window.currentRouteIndex = routeIndex;
        }}
      >
        <Modal key="modal" hideNavBar>
          <Lightbox key="lightbox">
            <Stack
              key="root"
              navigationBarStyle={{
                borderBottomWidth: 0,
                backgroundColor: "#00A6FF",
                height: 0,
              }}
              headerLayoutPreset="center"
              hideNavBar
            // transitionConfig={transitionConfig}
            >
              <Stack key="drawer" panHandlers={null} hideNavBar initial={this.props.scene === "drawer"}>
                {this.props.worldCupOpen ? (
                  ApiPort.UserLogin ? (
                    <Scene
                      key="tabbar"
                      tabs={true}
                      tabBarPosition="bottom"
                      showLabel={false}
                      tabBarStyle={styles.tabBarStyle}
                      tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
                      titleStyle={styles.titleStyle}
                    >
                      <Scene
                        key="home1"
                        component={Home}
                        icon={TabIconWCP}
                        onEnter={() => {
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          window.DoubleEleven && window.DoubleEleven();
                          PiwikAction.SendPiwik("Home_Bottomnav");
                        }}
                        titleStyle={styles.titleStyle}
                      />
                      <Scene
                        key="promotion"
                        component={PromoTab}
                        icon={TabIconWCP}
                        onEnter={() => {
                          this.getMemberInfo();
                          // window.requestPromoData && window.requestPromoData()
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          PiwikAction.SendPiwik("Promo_Bottomnav");
                        }}
                        titleStyle={styles.titleStyle}
                      />
                      <Scene
                        key="vip"
                        component={VIP}
                        icon={TabIconWCP}
                        onEnter={() => { }}
                        titleStyle={styles.titleStyle}
                      />
                      <Stack
                        key="WorldCup"
                        hideTabBar={true}
                        // hideNavBar={false}
                        icon={TabIconWCP}
                        renderTitle={() => {
                          return <WorldCupAppLogo />;
                        }}
                        renderRightButton={() => {
                          return <LiveChackIcon />;
                        }}
                        renderLeftButton={() => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                Actions.pop();
                              }}
                              style={{ marginLeft: 15 }}
                            >
                              <Image
                                resizeMode="contain"
                                source={require("../images/euroCup/home.png")}
                                style={{ width: 26, height: 26 }}
                              />
                            </TouchableOpacity>
                          );
                        }}
                        titleStyle={styles.titleStyle}
                        navigationBarStyle={styles.navBar}
                      >
                        <Scene component={WorldCup} />
                      </Stack>
                      <Stack
                        key="BettingRecord"
                        icon={TabIconWCP}
                        titleStyle={styles.titleStyle}
                        renderLeftButton={null}
                        onEnter={() => {
                          // window.requestPromoData && window.requestPromoData()
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          PiwikAction.SendPiwik("BetRecord_Bottomnav");
                        }}
                      >
                        <Scene
                          key="BettingRecord"
                          component={BettingRecord}
                          back
                          backButtonTintColor="#222222"
                        />
                      </Stack>
                      <Scene
                        key="Aviator"
                        component={OpenAviatorGame}
                        icon={TabIconWCP}
                        onEnter={() => {
                          window.getAviator && window.getAviator()
                        }}
                        titleStyle={[styles.titleStyle, { zIndex: 9999 }]}
                      />
                      <Scene
                        key="personal"
                        // renderRightButton={() => { return <LiveChack /> }}
                        component={User}
                        icon={TabIconWCP}
                        onEnter={() => {
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          PiwikAction.SendPiwik("Profile_Bottomnav");
                        }}
                        titleStyle={styles.titleStyle}
                      />
                    </Scene>
                  ) : (
                    <Scene
                      key="tabbar"
                      tabs={true}
                      tabBarPosition="bottom"
                      showLabel={false}
                      tabBarStyle={styles.tabBarStyle}
                      tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
                      titleStyle={styles.titleStyle}
                    >
                      <Scene
                        key="home1"
                        component={Home}
                        icon={TabIconWCP}
                        onEnter={() => {
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          window.DoubleEleven && window.DoubleEleven();
                          PiwikAction.SendPiwik("Home_Bottomnav");
                        }}
                        titleStyle={styles.titleStyle}
                      />
                      <Scene
                        key="promotion"
                        component={PromoTab}
                        icon={TabIconWCP}
                        onEnter={() => {
                          // window.requestPromoData && window.requestPromoData()
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          PiwikAction.SendPiwik("Promo_Bottomnav");
                        }}
                        titleStyle={styles.titleStyle}
                      />
                      <Scene
                        key="vip"
                        component={VIP}
                        icon={TabIconWCP}
                        onEnter={() => { }}
                        titleStyle={styles.titleStyle}
                      />
                      <Stack
                        key="WorldCup"
                        hideTabBar={true}
                        // hideNavBar={false}
                        icon={TabIconWCP}
                        renderTitle={() => {
                          return <WorldCupAppLogo />;
                        }}
                        renderRightButton={() => {
                          return <LiveChackIcon />;
                        }}
                        renderLeftButton={() => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                Actions.pop();
                              }}
                              style={{ marginLeft: 15 }}
                            >
                              <Image
                                resizeMode="contain"
                                source={require("../images/euroCup/home.png")}
                                style={{ width: 26, height: 26 }}
                              />
                            </TouchableOpacity>
                          );
                        }}
                        titleStyle={styles.titleStyle}
                        navigationBarStyle={styles.navBar}
                      >
                        <Scene component={WorldCup} />
                      </Stack>
                      <Stack
                        key="BettingRecord"
                        icon={TabIconWCP}
                        titleStyle={styles.titleStyle}
                        renderLeftButton={null}
                        tabBarOnPress={() => NavigationUtil.goToLogin()}
                        onEnter={() => {
                          // window.requestPromoData && window.requestPromoData()
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          PiwikAction.SendPiwik("BetRecord_Bottomnav");
                        }}
                      >
                        <Scene
                          key="BettingRecord"
                          component={BettingRecord}
                          back
                          backButtonTintColor="#222222"
                        />
                      </Stack>
                      <Scene
                        key="Aviator"
                        component={OpenAviatorGame}
                        icon={TabIconWCP}
                        onEnter={() => {
                          window.getAviator && window.getAviator()
                        }}
                        titleStyle={[styles.titleStyle, { zIndex: 9999 }]}
                      />
                      <Scene
                        key="personal"
                        // renderRightButton={() => { return <LiveChack /> }}
                        component={User}
                        icon={TabIconWCP}
                        onEnter={() => {
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          PiwikAction.SendPiwik("Profile_Bottomnav");
                        }}
                        titleStyle={styles.titleStyle}
                      />
                    </Scene>
                  )
                ) : (
                  ApiPort.UserLogin ? (
                    <Scene
                      key="tabbar"
                      tabs={true}
                      tabBarPosition="bottom"
                      showLabel={false}
                      tabBarStyle={styles.tabBarStyle}
                      tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
                      titleStyle={styles.titleStyle}
                    >
                      <Scene
                        key="home1"
                        component={Home}
                        icon={TabIcon}
                        onEnter={() => {
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          window.DoubleEleven && window.DoubleEleven();
                          PiwikAction.SendPiwik("Home_Bottomnav");
                        }}
                        titleStyle={styles.titleStyle}
                      />
                      <Scene
                        key="promotion"
                        component={PromoTab}
                        icon={TabIcon}
                        onEnter={() => {
                          this.getMemberInfo();
                          // window.requestPromoData && window.requestPromoData()
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          PiwikAction.SendPiwik("Promo_Bottomnav");
                        }}
                        titleStyle={styles.titleStyle}
                      />
                      <Stack
                        key="BettingRecord"
                        icon={TabIcon}
                        titleStyle={styles.titleStyle}
                        renderLeftButton={null}
                        onEnter={() => {
                          // window.requestPromoData && window.requestPromoData()
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          PiwikAction.SendPiwik("BetRecord_Bottomnav");
                        }}
                      >
                        <Scene
                          key="BettingRecord"
                          component={BettingRecord}
                          back
                          backButtonTintColor="#222222"
                        />
                      </Stack>
                      <Scene
                        key="Aviator"
                        component={OpenAviatorGame}
                        icon={TabIcon}
                        onEnter={() => {
                          window.getAviator && window.getAviator()
                        }}
                        titleStyle={[styles.titleStyle, { zIndex: 9999 }]}
                      />
                      <Scene
                        key="personal"
                        // renderRightButton={() => { return <LiveChack /> }}
                        component={User}
                        icon={TabIcon}
                        onEnter={() => {
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          PiwikAction.SendPiwik("Profile_Bottomnav");
                        }}
                        titleStyle={styles.titleStyle}
                      />
                    </Scene>
                  ) : (
                    <Scene
                      key="tabbar"
                      tabs={true}
                      tabBarPosition="bottom"
                      showLabel={false}
                      tabBarStyle={styles.tabBarStyle}
                      tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
                      titleStyle={styles.titleStyle}
                    >
                      <Scene
                        key="home1"
                        component={Home}
                        icon={TabIcon}
                        onEnter={() => {
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          window.DoubleEleven && window.DoubleEleven();
                          PiwikAction.SendPiwik("Home_Bottomnav");
                        }}
                        titleStyle={styles.titleStyle}
                      />
                      <Scene
                        key="promotion"
                        component={PromoTab}
                        icon={TabIcon}
                        onEnter={() => {
                          // window.requestPromoData && window.requestPromoData()
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          PiwikAction.SendPiwik("Promo_Bottomnav");
                        }}
                        titleStyle={styles.titleStyle}
                      />
                      <Stack
                        key="BettingRecord"
                        icon={TabIcon}
                        titleStyle={styles.titleStyle}
                        renderLeftButton={null}
                        tabBarOnPress={() => NavigationUtil.goToLogin()}
                        onEnter={() => {
                          // window.requestPromoData && window.requestPromoData()
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          PiwikAction.SendPiwik("BetRecord_Bottomnav");
                        }}
                      >
                        <Scene
                          key="BettingRecord"
                          component={BettingRecord}
                          back
                          backButtonTintColor="#222222"
                        />
                      </Stack>
                      <Scene
                        key="Aviator"
                        component={OpenAviatorGame}
                        icon={TabIcon}
                        onEnter={() => {
                          window.getAviator && window.getAviator()
                        }}
                        titleStyle={[styles.titleStyle, { zIndex: 9999 }]}
                      />
                      <Scene
                        key="personal"
                        // renderRightButton={() => { return <LiveChack /> }}
                        component={User}
                        icon={TabIcon}
                        onEnter={() => {
                          window.CheckUptateGlobe &&
                            window.CheckUptateGlobe(false);
                          PiwikAction.SendPiwik("Profile_Bottomnav");
                        }}
                        titleStyle={styles.titleStyle}
                      />
                    </Scene>
                  )
                )}
              </Stack>

              <Stack
                key="Login"
                headerLayoutPreset="center"
                navigationBarStyle={styles.hideNavigationBar}
                initial={this.props.scene === "login"}
              >
                <Scene key="Login" component={Login} panHandlers={null} />
              </Stack>

              <Stack
                key="ForgetName"
                headerLayoutPreset="center"
                navigationBarStyle={styles.hideNavigationBar}
              >
                <Scene key="ForgetName" component={ForgetName} />
              </Stack>

              {/* <Stack
						key="LoginOtp"
						headerLayoutPreset="center"
						navigationBarStyle={styles.hideNavigationBar}
					>
						<Scene
							key="LoginOtp"
							component={LoginOtp}
							// panHandlers={null}
						/>
					</Stack> */}
              <Stack
                key="LoginOtp"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                renderRightButton={() => {
                  return <LiveChackIcon />;
                }}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="LoginOtp"
                  component={LoginOtp}
                  // title="安全验证"
                  panHandlers={null}
                />
              </Stack>

              <Stack
                key='FreebetSetting'
                title='免费投注申请́'
                navigationBarStyle={styles.navigationBarStyle}
                back
                backButtonTintColor="#fff"
              >
                <Scene titleStyle={styles.titleStyle} component={FreebetSetting} />
              </Stack>

              <Stack
                key="SecurityNotice"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                back
                backButtonTintColor="#fff"
                renderRightButton={() => {
                  return <LiveChackIcon />;
                }}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="SecurityNotice"
                  component={SecurityNotice}
                  title="安全公告"
                  panHandlers={null}
                />
              </Stack>

              {/* 使用tabBarComponent 客製化tabBar */}
              <Scene
                key="SBTabbar"
                tabs={true}
                wrap={false}
                showLabel={false}
                tabBarPosition={'bottom'}
                panHandlers={null}
                lazy
                tabBarComponent={SbTabBar}
              >
                <Scene
                  key="SbSports"
                  component={SbSports}
                  hideNavBar
                  titleStyle={styles.titleStyle}
                />
                <Stack  key="promotionSBWrap"
                        titleStyle={styles.titleStyle}>
                  <Scene
                    key="promotionSB"
                    component={PromoTab}
                  />
                </Stack>
                <Stack
                  key="betRecordSBWrap"
                  titleStyle={styles.titleStyle}
                >
                  <Scene
                    key="betRecordSB"
                    component={betRecord}
                  />
                </Stack>
                <Scene
                  key="SbAirCraftWrap"
                  hideNavBar
                  titleStyle={styles.titleStyle}
                  navigationBarStyle={styles.navBar}
                  component={GamePage}
                  gametype={"SPR"}
                />
                <Stack
                  key="personalSBWrap"
                  titleStyle={styles.titleStyle}
                  hideTabBar={true}
                  hideNavBar={true}
                >
                  <Scene
                    key="personalSB"
                    component={DrawerContent}
                  />
                </Stack>
              </Scene>
              
              <Stack
                key="Rules"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyleHeightsmall}
              >
                <Scene key="Rules" component={Rules} />
              </Stack>
              <Stack
                key="BetTutorial"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyleHeightsmall}
              >
                <Scene key="BetTutorial" component={BetTutorial} />
              </Stack>
              <Stack
                key="Betting_detail"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyleHeightsmall}
              >
                <Scene key="Betting_detail" component={Betting_detail} />
              </Stack>
              <Stack
                key="betRecord"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyleHeightsmall}
              >
                <Scene key="betRecord" component={betRecord} />
              </Stack>
              <Stack
                key="search"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyleHeightsmall}
              >
                <Scene key="search" component={search} />
              </Stack>
              <Stack
                key="TransferSb"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene titleStyle={styles.titleStyle}
                  key="TransferSb"
                  component={TransferSb}
                  title="转账" renderRightButton={() => {
                    return <LiveChackIcon type={'Transfer'} />;
                  }} />
              </Stack>
              <Stack
                key="Setting"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene titleStyle={styles.titleStyle} key="Setting" component={Setting} title="系统设置" />
              </Stack>
              <Stack
                key="SetTingModle"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene titleStyle={styles.titleStyle} key="SetTingModle" component={SetTingModle} title="自定义快捷金额" />
              </Stack>
              <Stack
                key="NewsSb"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyleHeightsmall}
              >
                <Scene key="NewsSb" component={NewsSb} />
              </Stack>
              <Stack
                key="NewsDetailSb"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene titleStyle={styles.titleStyle} key="NewsDetailSb" component={NewsDetailSb} title="消息详情" />
              </Stack>
              <Scene
                titleStyle={styles.titleStyle}
                key="SbShare"
                component={SbShare}
                panHandlers={null}
                modal={false}
              />


              <Stack
                key="SecurityUpdateNotice"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                back
                backButtonTintColor="#fff"
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="SecurityUpdateNotice"
                  component={SecurityUpdateNotice}
                  title="安全系统升级公告"
                  panHandlers={null}
                />
              </Stack>

              <Stack
                key="KingClub"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                back
                backButtonTintColor="#fff"
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="KingClub"
                  component={KingClub}
                  title="天王俱乐部"
                />
              </Stack>

              <Stack
                key="AboutUSDT"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                back
                backButtonTintColor="#fff"
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="AboutUSDT"
                  component={AboutUSDT}
                  title="USDT介绍"
                />
              </Stack>

              <Stack
                key="USDTHelpCenter"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                back
                backButtonTintColor="#fff"
              >
                <Scene
                  key="USDTHelpCenter"
                  component={USDTHelpCenter}
                  title="常见问题"
                  back
                  titleStyle={styles.titleStyle}
                />
              </Stack>

              <Stack
                key="USDTWalletProtocols"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                back
                backButtonTintColor="#fff"
              >
                <Scene
                  key="USDTWalletProtocols"
                  component={USDTWalletProtocols}
                  title="钱包协议的区别"
                  back
                  titleStyle={styles.titleStyle}
                />
              </Stack>

              <Stack
                key="HelpCenter"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                back
                backButtonTintColor="#fff"
              >
                <Scene
                  key="HelpCenter"
                  component={HelpCenter}
                  title="帮助中心"
                  back
                  titleStyle={styles.titleStyle}
                />
              </Stack>

              <Stack
                key="HelpDetail"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                back
                backButtonTintColor="#fff"
              >
                <Scene
                  key="HelpDetail"
                  component={HelpDetail}
                  title=""
                  back
                  titleStyle={styles.titleStyle}
                />
              </Stack>

              <Stack
                key="Sponsor"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                back
                backButtonTintColor="#fff"
              >
                <Scene
                  key="Sponsor"
                  component={Sponsor}
                  title="赞助伙伴"
                  back
                  titleStyle={styles.titleStyle}
                />
              </Stack>

              <Stack
                key="Recommend"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                back
                backButtonTintColor="#fff"
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="Recommend"
                  component={Recommend}
                  title="推荐好友"
                />
              </Stack>

              <Stack
                key="RecommendPage"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                back
                backButtonTintColor="#fff"
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="RecommendPage"
                  component={RecommendPage}
                  title="推荐好友"
                />
              </Stack>

              <Stack
                key="SetVerification"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
                renderRightButton={() => {
                  return <LiveChackIcon />;
                }}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="SetVerification"
                  component={SetVerification}
                  title="手机验证"
                />
              </Stack>

              <Stack
                key="BettingRecordDetail"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  key="BettingRecordDetail"
                  component={BettingRecordDetail}
                  back
                  titleStyle={styles.titleStyle}
                />
              </Stack>

              <Stack
                key="SetPassword"
                headerLayoutPreset="center"
                navigationBarStyle={styles.navigationBarStyle}
                renderRightButton={() => {
                  return <LiveChackIcon />;
                }}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="SetPassword"
                  component={SetPassword}
                  title="更换密码"
                />
              </Stack>

              <Stack
                key="News"
                headerLayoutPreset="center"
                navigationBarStyle={styles.hideNavigationBar}
              >
                <Scene key="News" component={News} />
              </Stack>

              <Stack
                key="NewsDetail"
                headerLayoutPreset="center"
                back
                backButtonImage={require('@/images/icon/iconWhite.png')}
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="NewsDetail"
                  component={NewsDetail}
                  title="信息内容"
                />
              </Stack>

              <Stack
                key="GamePage"
                renderRightButton={() => {
                  return <GamePageNavRight />;
                }}
                renderLeftButton={() => {
                  return <GamePageNavLeft />;
                }}
                navigationBarStyle={styles.navBar}
              >
                <Scene component={GamePage} />
              </Stack>
              <Stack
                key="DepositCenter"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="DepositCenter"
                  component={DepositCenter}
                  title="存款"
                  renderRightButton={() => (
                    <View style={{ flexDirection: 'row' }}>
                      <ToggleVipCsCall />
                      <LiveChackIcon type={"DepositCenter"} />
                    </View>
                  )}
                />
              </Stack>

              <Stack
                key="userInfor"
                headerLayoutPreset="center"
                back
                backButtonImage={require('../images/icon-white.png')}
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="userInfor"
                  component={userInfor}
                  title="账户资料"
                  renderRightButton={() => {
                    return <LiveChackIcon type={"userInfor"} />;
                  }}
                />
              </Stack>
              <Stack
                key="UserUpdateInfo"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="UserUpdateInfo"
                  component={UserUpdateInfo}
                />
              </Stack>
              <Stack
                key="ChangePassword"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="ChangePassword"
                  component={ChangePassword}
                  title="密码修改"
                  renderRightButton={() => {
                    return <LiveChackIcon type={"useraddress"} />;
                  }}
                />
              </Stack>
              <Stack
                key="SecurityQuestion"
                headerLayoutPreset="center"
                back
                backButtonImage={require('../images/icon-white.png')}
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="SecurityQuestion"
                  component={SecurityQuestion}
                  title="安全提问"
                />
              </Stack>
              <Stack
                key="PreferWallet"
                headerLayoutPreset="center"
                back
                backButtonImage={require('../images/icon-white.png')}
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="PreferWallet"
                  component={PreferWallet}
                  title="首选账户"
                />
              </Stack>
              <Stack
                key="SelfExclusion"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="SelfExclusion"
                  component={SelfExclusion}
                  title="行为限制"
                />
              </Stack>
              <Stack
                key="SecurityCode"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
                renderRightButton={() => {
                  return <LiveChackIcon />;
                }}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="SecurityCode"
                  component={SecurityCode}
                  title="创建安全码"
                />
              </Stack>
              <Stack
                key="UploadFile"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
                renderRightButton={() => {
                  return <LiveChackIcon />;
                }}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="UploadFile"
                  component={UploadFile}
                  title="上传文件"
                />
                <Scene
                  titleStyle={styles.titleStyle}
                  key="UploadFileDetail"
                  component={UploadFileDetail}
                />
                <Scene
                  titleStyle={styles.titleStyle}
                  key="UploadFileStatus"
                  component={UploadFileStatus}
                />
                <Scene
                  titleStyle={styles.titleStyle}
                  key="UploadExample"
                  component={UploadExample}
                />
                <Scene
                  titleStyle={styles.titleStyle}
                  title="如何上传您的文件"
                  key="UploadFileGuide"
                  component={UploadFileGuide}
                />
              </Stack>
              <Stack
                key="ProductIntro"
                headerLayoutPreset="center"
                backButtonTintColor="#fff"
                back
                backButtonImage={require('../images/icon-white.png')}
                navigationBarStyle={styles.navigationBarStyle}
                titleStyle={styles.titleStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="ProductIntro"
                  component={ProductIntro}
                />
              </Stack>
              <Stack
                key="ProductGamePage"
                headerLayoutPreset="center"
                backButtonTintColor="#fff"
                back
                navigationBarStyle={styles.navigationBarStyle}
                titleStyle={styles.titleStyle}
                backButtonImage={require('../images/icon-white.png')}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="ProductGamePage"
                  component={ProductGamePage}
                />
              </Stack>
              <Stack
                key="ProductGameDetail"
                navigationBarStyle={styles.hideNavigationBar}
              >
                <Scene key="ProductGameDetail" component={ProductGameDetail} />
              </Stack>
              <Stack
                key="PromotionsDetail"
                navigationBarStyle={styles.hideNavigationBar}
              >
                <Scene
                  key="PromotionsDetail"
                  component={PromotionsDetail}
                />
              </Stack>
              <Stack
                key="PromotionsAddress"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene titleStyle={styles.titleStyle} key="PromotionsAddress" component={PromotionsAddress} title="运送详情" />
              </Stack>
              <Stack
                key="Newaddress"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene titleStyle={styles.titleStyle} key="Newaddress" component={Newaddress} title="填写运送资料" />
              </Stack>
              <Stack
                key="PromotionsEverydayGift"
                navigationBarStyle={styles.hideNavigationBar}
              >
                <Scene
                  key="PromotionsEverydayGift"
                  component={PromotionsEverydayGift}
                // title="优惠详情"
                />
              </Stack>

              <Stack
                key="PromotionsRebateDetail"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={[styles.navigationBarStyle]}
                backButtonImage={require('../images/icon-white.png')}
              >
                <Scene titleStyle={styles.titleStyle} key="PromotionsRebateDetail" component={PromotionsRebateDetail} title="好礼详情" />
              </Stack>

              <Stack
                key="PromotionsForm"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="PromotionsForm"
                  component={PromotionsForm}
                  title="查看运送资料"
                />
              </Stack>
              <Stack
                key="PromoRebateHistory"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene titleStyle={styles.titleStyle} key="PromoRebateHistory" component={PromoRebateHistory} title="返水历史" />
              </Stack>
              <Stack
                key="BankCardVerify"
                headerLayoutPreset="center"
                renderLeftButton={() => {
                  return <BackIconHome />;
                }}
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene titleStyle={styles.titleStyle} key="BankCardVerify" component={BankCardVerify} title="账户验证"
                  renderRightButton={() => {
                    return <LiveChackIcon type={'BankCardVerify'} />;
                  }} />
              </Stack>
              <Stack
                key="bankcard"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="bankcard"
                  component={bankcard}
                  title="银行信息"
                  renderRightButton={() => {
                    return <LiveChackIcon type={"bankcard"} />;
                  }}
                />
              </Stack>

              <Stack
                key="SetBankThreshold"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
                renderRightButton={() => {
                  return <LiveChackIcon />;
                }}
              >
                <Scene
                  key="SetBankThreshold"
                  component={SetBankThreshold}
                  title="银行账户限额设置"
                  back
                  titleStyle={styles.titleStyle}
                />
              </Stack>

              <Stack
                key="bankcardDetail"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="bankcardDetail"
                  component={bankcardDetail}
                  title="账户信息"
                  renderRightButton={() => {
                    return <LiveChackIcon type={"bankcardDetail"} />;
                  }}
                />
              </Stack>

              <Stack
                key="SecurityCheck"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="SecurityCheck"
                  component={SecurityCheck}
                  title="安全检查"
                  renderRightButton={() => {
                    return <LiveChackIcon />;
                  }}
                />
              </Stack>

              <Stack key="VIP" navigationBarStyle={styles.hideNavigationBar}>
                <Scene key="VIP" component={VIP} />
              </Stack>

              <Stack
                key="ModifyName"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="ModifyName"
                  component={ModifyName}
                  title="姓名"
                />
              </Stack>

              <Stack
                key="Verification"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="Verification"
                  component={Verification}
                  renderRightButton={() => {
                    return <LiveChackIcon type={"Verification"} />;
                  }}
                />
              </Stack>

              <Stack
                key="withdrawalSuccess"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  title="提款"
                  titleStyle={styles.titleStyle}
                  key="withdrawalSuccess"
                  component={withdrawalSuccess}
                  renderRightButton={() => {
                    return <LiveChackIcon type={"withdrawalSuccess"} />;
                  }}
                />
              </Stack>

              <Stack
                key="RedoDepositTransaction"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  title="重新提交存款"
                  key="RedoDepositTransaction"
                  component={RedoDepositTransaction}
                  renderRightButton={() => {
                    return <LiveChackIcon type={"RedoDepositTransaction"} />;
                  }}
                />
              </Stack>

              <Stack
                key="withdrawalGuide"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="withdrawalGuide"
                  component={withdrawalGuide}
                />
              </Stack>

              <Stack
                key="recordes"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="recordes"
                  component={recordes}
                  title="交易记录"
                  renderRightButton={() => (
                    <View style={{ flexDirection: 'row' }}>
                      <ToggleVipCsCall />
                      <LiveChackIcon type={"withdrawal"} />
                    </View>
                  )}
                />
              </Stack>

              <Stack
                key="NewBank"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="NewBank"
                  component={NewBank}
                  title="添加银行账户"
                  renderRightButton={() => {
                    return <LiveChackIcon type={"NewBank"} />;
                  }}
                />
              </Stack>

              <Stack
                key="Withdrawalverification"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="Withdrawalverification"
                  component={Withdrawalverification}
                  title="账户验证"
                  renderRightButton={() => {
                    return <LiveChackIcon type={"Withdrawalverification"} />;
                  }}
                />
              </Stack>

              <Stack
                key="withdrawal"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="withdrawal"
                  component={withdrawal}
                  title="提款"
                  renderRightButton={() => (
                    <View style={{ flexDirection: 'row' }}>
                      <ToggleVipCsCall />
                      <LiveChackIcon type={"withdrawal"} />
                    </View>
                  )}
                />
              </Stack>

              <Stack
                key="recordsDatails"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="recordsDatails"
                  component={recordsDatails}
                  renderRightButton={() => {
                    return <LiveChackIcon type={"recordsDatails"} />;
                  }}
                />
              </Stack>

              <Stack
                key="CreatWallet"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="CreatWallet"
                  component={CreatWallet}
                  // title='添加银行账户'
                  renderRightButton={() => {
                    return <LiveChackIcon type={"CreatWallet"} />;
                  }}
                />
              </Stack>

              <Stack key="Transfer" navigationBarStyle={styles.hideNavigationBar}>
                <Scene key="Transfer" component={Transfer} />
              </Stack>

              <Stack
                key="CTCpage"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="CTCpage"
                  component={CTCpage}
                  title="CTC充值提示"
                />
              </Stack>
              <Stack
                key="NotificationDetail"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="NotificationDetail"
                  component={NotificationDetail}
                  title="消息详情"
                />
              </Stack>

              <Stack
                backButtonImage={require("../images/closeWhite.png")}
                key="DepositPage"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="DepositPage"
                  component={DepositPage}
                  title="第三方充值页面"
                  renderRightButton={() => {
                    return <LiveChackIcon />;
                  }}
                />
              </Stack>
              <Stack
                key="DepositCenterPage"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="DepositCenterPage"
                  component={DepositCenterPage}
                  title="充值第二步"
                  renderRightButton={() => {
                    return <LiveChackIcon />;
                  }}
                />
              </Stack>

              <Stack
                key="PPBSecondStep"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene titleStyle={styles.titleStyle} key="PPBSecondStep" component={PPBSecondStep} title="网银转账" renderRightButton={() => {
                  return <LiveChackIcon />;
                }} />
              </Stack>
              <Stack
                key="SRSecondStep"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene titleStyle={styles.titleStyle} key="SRSecondStep" component={SRSecondStep} title="小额存款" renderRightButton={() => {
                  return <LiveChackIcon />;
                }} />
              </Stack>

              <Stack
                key="LoginTouch"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="LoginTouch"
                  component={LoginTouch}
                  title="脸部辨识认证"
                  renderRightButton={() => {
                    return <LiveChackIcon />;
                  }}
                />
              </Stack>
              <Stack
                key="LoginPattern"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="LoginPattern"
                  component={LoginPattern}
                  title="设定图形密码"
                  renderRightButton={() => {
                    return <LiveChackIcon />;
                  }}
                />
              </Stack>
              <Stack
                key="SetLogin"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={styles.navigationBarStyle}
              >
                <Scene
                  titleStyle={styles.titleStyle}
                  key="SetLogin"
                  component={SetLogin}
                  title="快速登入"
                  renderRightButton={() => {
                    return <LiveChackIcon />;
                  }}
                />
              </Stack>
              <Stack
                key="FastLogin"
                headerLayoutPreset="center"
                navigationBarStyle={styles.hideNavigationBar}
              >
                <Scene key="FastLogin" component={FastLogin} />
              </Stack>

              {/*目前不需要*/}
              {/*<Stack*/}
              {/*    key="EuroCup"*/}
              {/*    headerLayoutPreset="center"*/}
              {/*    navigationBarStyle={styles.navigationBarStyleHeightsmall}*/}
              {/*>*/}
              {/*  <Scene key="EuroCup" component={EuroCup} />*/}
              {/*</Stack>*/}

              <Stack
                key="PoppingGame"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={[styles.navigationBarStyle, { backgroundColor: '#00A6FF' }]}
              >
                <Scene titleStyle={styles.titleStyle} key="PoppingGame" component={PoppingGame} title="FUN转中秋" renderRightButton={() => {
                  return <LiveChackIcon />;
                }} />
              </Stack>

              <Stack
                key="GoldenWeek"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={[styles.navigationBarStyle, { backgroundColor: '#00A6FF' }]}
              >
                <Scene titleStyle={styles.titleStyle} key="GoldenWeek" component={GoldenWeek} title="绽FUN烟花 喜迎国庆" renderRightButton={() => {
                  return <LiveChackIcon />;
                }} />
              </Stack>


              <Stack
                key="WorldCupNewDetail"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={[styles.navigationBarStyle, { backgroundColor: '#00A6FF' }]}
              >
                <Scene titleStyle={styles.titleStyle} key="WorldCupNewDetail" component={WorldCupNewDetail} title="新闻" />
              </Stack>

              <Stack
                key="WorldCupNew"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={[styles.navigationBarStyle, { backgroundColor: '#00A6FF' }]}
              >
                <Scene titleStyle={styles.titleStyle} key="WorldCupNew" component={WorldCupNew} title="新闻" />
              </Stack>

              <Stack
                key="WorldCupMyPrize"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={[styles.navigationBarStyle, { backgroundColor: '#00A6FF' }]}
              >
                <Scene titleStyle={styles.titleStyle} key="WorldCupMyPrize" component={WorldCupMyPrize} title="我的奖品" />
              </Stack>

              <Stack
                key="WorldCupMyRule"
                headerLayoutPreset="center"
                back
                backButtonTintColor="#fff"
                navigationBarStyle={[styles.navigationBarStyle, { backgroundColor: '#00A6FF' }]}
              >
                <Scene titleStyle={styles.titleStyle} key="WorldCupMyRule" component={WorldCupMyRule} title="规则与条例" />
              </Stack>
            </Stack>


          </Lightbox>

          {/*彈窗類型*/}
          <Stack
            key="RestrictPage"
            headerLayoutPreset="center"
            navigationBarStyle={styles.navigationBarStyle}
            renderLeftButton={() => {
              return (
                <View
                  style={{
                    width: width,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../images/logio.png")}
                    style={{ width: 70, height: 32 }}
                  />
                </View>
              );
            }}
          >
            <Scene key="RestrictPage"
              component={RestrictPage}
              panHandlers={null}
            />
            <Scene key="RestrictPage2"
              component={RestrictPage}
              renderRightButton={() => {
                return <LiveChackIcon />;
              }}
              panHandlers={null}
            />
          </Stack>

          <Stack
            key="RestrictPageWithCS"
            headerLayoutPreset="center"
            navigationBarStyle={styles.navigationBarStyle}
            renderLeftButton={() => {
              return (
                <View
                  style={{
                    width: width,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../images/logio.png")}
                    style={{ width: 70, height: 32 }}
                  />
                </View>
              );
            }}
            renderRightButton={() => {
              return <LiveChackIcon />;
            }}
          >
            <Scene key="RestrictPageWithCS"
              component={RestrictPage}
              panHandlers={null}
            />
          </Stack>

          <Stack
            key="sbMaintenanceRestrictPage"
            headerLayoutPreset="center"
            navigationBarStyle={styles.navigationBarStyle}
            keepLogin={true}
            renderLeftButton={() => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    Actions.home1();
                  }}
                  style={{ marginLeft: 15 }}
                >
                  <Image
                    resizeMode="contain"
                    source={require("../images/euroCup/home.png")}
                    style={{ width: 26, height: 26 }}
                  />
                </TouchableOpacity>
              );
            }}
          >
            <Scene key="sbMaintenanceRestrictPage"
                   component={RestrictPage}
                   panHandlers={null}
            />
          </Stack>
        </Modal>
      </RouterWithRedux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    scene: state.scene.scene,
    worldCupOpen: state.event.duringTheWorldCup
  };
};

const mapDispatchToProps = (dispatch) => ({
  logout: (loginDetails) => {
    logout(dispatch, loginDetails);
  },
  userInfo_logout: () => dispatch(actions.ACTION_UserInfo_logout()),
  announcement_clear: () => dispatch(actions.ACTION_ClearAnnouncement()),
  selfExclusions_clear: () => dispatch(actions.ACTION_ClearSelfExclusions()),
  isVipHandler: (val) => dispatch(actions.ACTION_CheckIsVIP(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);

const styles = StyleSheet.create({
  routerScene: {
    padding: 0,
  },

  drawerImageComponent: {
    width: 32,
    height: "100%",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    alignItems: "flex-end",
  },
  drawerImage: {
    width: 32,
    height: 32,
    bottom: 10,
  },
  titleStyle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  navigationBarStyle: {
    backgroundColor: "#00a6ff",
    borderBottomWidth: 0,
    height: Platform.OS === "ios" ? 44 : 50
    // paddingHorizontal: 20,
  },
  hideNavigationBar: {
    backgroundColor: "#00a6ff",
    height: 0,
    borderBottomWidth: 0,
  },
  navBarGameList: {
    height: 45,
    color: "#220000",
    backgroundColor: "#fff",
    borderBottomWidth: 0,
  },
  gameListTitle: { color: "#220011" },
  navBar: {
    height: 45,
    color: "#fff",
    backgroundColor: "#00A6FF",
    borderBottomWidth: 0,
  },
  navigationBarStyleHeightsmall: {
    backgroundColor: '#00a6ff',
    height: 0,
    borderBottomWidth: 0,
  },
  tabBarStyle: {
    backgroundColor: '#fff',
    height: 66,
    borderTopWidth: 0
  }
});
