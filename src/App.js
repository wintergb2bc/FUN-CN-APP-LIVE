import React, { Component } from "react";
import {
  AppRegistry,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from "react-native";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import CodePush from "react-native-code-push";
import Service from "./actions/Service"; //請求
import ServiceSB from "./containers/SbSports/actions/Service"; //請求
import Domain from "./Domain"; //域名
import Api from "./actions/Api"; //api
import storage from "./actions/Storage";
import localStorage from "./actions/localStorage";
import AnalyticsUtil from "./actions/AnalyticsUtil"; //友盟
import { timeout_fetch } from "./lib/SportRequest";
import HostConfig from "./containers/SbSports/lib/Host.config";
import Main from "./containers/Main";
import { Toast, Modal, Progress } from "antd-mobile-rn";
import SplashScreen from "react-native-splash-screen";
import { Toasts } from "./containers/Toast";
import Orientation from "react-native-orientation-locker";
import LivechatMain from "./containers/LivechatMain"; // 第三方遊戲預加載 永遠都在層級
import store from "./lib/redux/store/index";
import {
  ACTION_MaintainStatus_NoTokenBTI,
  ACTION_MaintainStatus_NoTokenIM,
  ACTION_MaintainStatus_NoTokenSABA,
} from './lib/redux/actions/MaintainStatusAction';
import HomeModalCarousel from "./containers/Home/HomeModalCarousel";
import HomeModalCarousel2 from "./containers/Home/HomeModalCarousel2";
import OpenGamePopup from "./containers/Common/Game/OpenGamePopup";
import SportPopup from "./containers/Common/Game/SportPopup";
import EventData from "./containers/SbSports/lib/vendor/data/EventData";
import GlobalPopup from "./containers/Common/GlobalPopup";
import { Actions } from "react-native-router-flux";
import VendorIM from './containers/SbSports/lib/vendor/im/VendorIM';
import VendorSABA from './containers/SbSports/lib/vendor/saba/VendorSABA';
import VendorBTI from './containers/SbSports/lib/vendor/bti/VendorBTI';
import { getDetail } from "./containers/Events/WorldCup/Common/utils";
import actions from "./lib/redux/actions";
import moment from "moment/moment";
import { ACTION_DuringTheWorldCup } from "./lib/redux/actions/EventAction";
//codepush key線上
const IosLive = "";
const AndroidLive = "";

const { width, height } = Dimensions.get("window");

//字體不跟者 手機設置改變
Text.defaultProps = Object.assign({}, Text.defaultProps, {
  allowFontScaling: false,
});
//文字显示不全
const defaultFontFamily = {
  ...Platform.select({
    android: { fontFamily: "" },
  }),
};
const oldRender = Text.render;
Text.render = function (...args) {
  const origin = oldRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [defaultFontFamily, origin.props.style],
  });
};

class App extends Component<{}> {
  constructor() {
    super();
    this.state = {
      progress: "",
      restartAllowed: true,
      updataTexe: "",
      update: "",
      updataGo: false,
      codePushProgress: "更新进度: 0%", //更新進度
      // eslint-disable-next-line no-undef
      CodeKey: Platform.OS === "android" ? CodePushKeyAndroid : CodePushKeyIOS,
      isMandatory: false, //是否強制更新
      percent: 0,
      CloseVersion: false,
      CodePushLoading: "",
      CheckUptate: false,
      homeHomeStatus: false, // 首次進入APP
      homeHomeStatus2: false, // 非首次
    };
    this.appInitUrl = null; //喚醒Url
    this.preGetAppInitUrlPromise = this.preGetAppInitUrl();
    this.getHomeModalStatus();
  }

  //添加此代码
  delayed() {
    SplashScreen.hide();
  }

  componentWillMount() {
    global.Toasts = Toasts;
    setTimeout(() => {
      this.delayed();
    }, 1500); //啟動圖消失
    CodePush.disallowRestart(); //禁止重启
    CodePush.checkForUpdate(this.state.CodeKey).then((update) => {
      this.apk_package = update; // 更新状态等信息
      console.log(update);
      if (update) {
        this.state.isMandatory = update.isMandatory;
        this.state.update = update;
        if (update.isMandatory == true) {
          this.syncImmediate();
          //this.onButtonClick2(update)
          return;
        }
        this.syncImmediate();
        //console.log(update)
        // 有可用的更新，这时进行一些控制更新提示弹出层的的操作
      } else {
        // 没有可用的更新
        this.setState({ CheckUptate: true });
      }
    });
    this.GetDomainConfig();
    this.getBannerFeature();
    this.checkWorldCupTab();
    this.CloseVersion();
    setInterval(() => {
      this.CloseVersion();
    }, 10000);

    const defaultCachePromise = new Promise(resolve => resolve(null));

		window.initialCache = {};
		['IM','SABA','BTI'].map(s => {
			window.initialCache[s] = {isUsed: false, isUsedForHeader: false, cachePromise: defaultCachePromise};
		})

		//獲取初始緩存數據
		window.getInitialCache = (VendorName) => {
			window.initialCache[VendorName].cachePromise = timeout_fetch(
				fetch(HostConfig.Config.CacheApi + '/cache/v4/' + VendorName.toLowerCase())
				,3000 //最多查3秒，超過放棄
			)
				.then(response => response.json())
				.then(jsonData => {
					let newData = {};
					newData.trCount = jsonData.trCount;
					newData.count = jsonData.count;
					newData.list = jsonData.list.map(ev => EventData.clone(ev)); //需要轉換一下

					console.log('===get initialCache of',VendorName,newData);

					return newData;
				})
				.catch((e) => {
					console.log('===== cached '+VendorName+' data has exception',e);
					window.initialCache[VendorName].isUsed = true; //報錯 就標記為已使用
				})
			return window.initialCache[VendorName].cachePromise;
		}

		//獲取首屏緩存服務器數據(IM)
		window.getInitialCache('IM')
			.finally(() => {
				//等IM獲取到，才獲取其他Vendor
				['SABA','BTI'].map(VendorName => {
					window.getInitialCache(VendorName);
				})
			})

    //獲取歐洲杯聯賽id
    // timeout_fetch(
    //   fetch(HostConfig.Config.CacheApi + "/ec2021leagues"),
    //   3000 //最多查3秒，超過放棄
    // )
    //   .then((response) => response.json())
    //   .then((jsonData) => {
    //     window.EuroCup2021LeagueIds = jsonData.data;
    //   })
    //   .catch((e) => {
    //     console.log("===== get EURO league IDs has exception", e);
    //   });

    //全局綁定維護狀態切換函數
    global.maintainStatus_noTokenBTI = (isNoToken) => store.dispatch(ACTION_MaintainStatus_NoTokenBTI(isNoToken));
    global.maintainStatus_noTokenIM = (isNoToken) => store.dispatch(ACTION_MaintainStatus_NoTokenIM(isNoToken));
    global.maintainStatus_noTokenSABA = (isNoToken) => store.dispatch(ACTION_MaintainStatus_NoTokenSABA(isNoToken));
  }

  componentDidMount() {
    // Orientation.lockToPortrait();
    CodePush.allowRestart(); //在加载完了，允许重启
	this.codepushReset()
    //app未開啟情況下，被scheme喚醒處理
    this.callAppInitialUrl();
    //APP已開啟情況下，在背景中被scheme喚醒(監聽)
    Linking.addEventListener('url', this.callAppEventHandler);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url',this.callAppEventHandler);
  }

  //app已開啟，在背景被scheme喚醒 處理函數
  callAppEventHandler = (event) => {
    console.log('===callAppEventHandler',event);
    this.handleCallAppUrl(event.url, 'event');
  }

  //APP未開啟，scheme喚醒APP判斷
  callAppInitialUrl = async () => {
    await this.preGetAppInitUrlPromise;
    console.log('===CallAppInitialUrl',this.appInitUrl);
    this.handleCallAppUrl(this.appInitUrl, 'init');
  }

  getPromotionContent(promotionId = null) {
    Toast.loading("优惠加载中...", 10);
    const pid = promotionId ? `?id=${promotionId}` : "";
    fetch(`${CMS_Domain + ApiPort.CMS_Promotion}${pid}`, {
      method: "GET",
      headers: {
        token: CMS_token,
        Authorization: ApiPort.Token || "",
      },
    })
      .then((response) => (headerData = response.json()))
      .then((data) => {
        Toast.hide();
        console.log('go Actions.promotionSB();')
        if (ApiPort.UserLogin && isGameLock) {
          Toast.fail("您的账户已被锁，请联系在线客服。", 2);
          return;
        }
        Actions.SbSports({
          sbType: 'IPSB'
        });
        Actions.promotionSBWrap();
        Actions.PromotionsDetail({ Detail: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //喚醒app url公用處理函數
  handleCallAppUrl = (url, source) => {
    console.log(`=====[${source}]handleCallAppUrl 0`, url);

    if (url) {
      if (source === 'init') {
        //初始url只用一次，拿到就可以清理掉了，這個函數裡面的url參數是by value，不會被影響
        this.appInitUrl = null;
      }
      //f1m1p5://sb20?type=wcp&deeplink=news&nid=8767 世界杯新聞
      //f1m1p5://sb20?deeplink=im&sid=2&eid=45678&lid=89012  sb2.0專用
      //f1m1p5://sb20?deeplink=promo&pid=8833 //sb優惠
      const urlData = url.split("//")[1];
      const urlArray = urlData.split('?');
      const linkType = urlArray[0];
      
      console.log('urlData ',urlData)
      console.log('linkType ',linkType)
      console.log(`=====[${source}]handleCallAppUrl 1`, url, urlData, linkType);

      //只先支持 sb2.0
      if (linkType === 'sb20') {
        const queryStrings = urlArray[1];

        let list = {};
        queryStrings &&
        queryStrings.split("&").forEach((item, i) => {
          list[item.split("=")[0]] = item.split("=")[1] || "";
        });

        //處理代理號，存入storage
        if (list.aff && list.aff.length > 0) {
          global.storage.save({
            key: "affCodeSG", // 注意:请不要在key中使用_下划线符号!
            id: "affCodeSG", // 注意:请不要在id中使用_下划线符号!
            data: list.aff,
            expires: null,
          });
        }

        console.log(`=====[${source}]handleCallAppUrl 2`, url, urlData, linkType, list);
        if (list.token && list.rtoken) {
          //token登入，不確定是否能用，目前沒使用，先註解，如果後續要啟用，需要再測試
          // window.isMobileOpen = true;
          // Actions.Login({openList: list});
        } else {

          // 世界杯新聞
          if(list.type === "wcp" && list.deeplink === "news" && list.nid) {
            this.checkModalStatus(getDetail, {id: list.nid});
            return;
          }

          // 跳轉sb優惠
          if(list.deeplink === "promo" && list.pid) {
            this.checkModalStatus(this.getPromotionContent, list.pid);
            return;
          }

          // sb體育詳情頁
          if (list.deeplink && list.sid && list.eid && list.lid) {
            console.log(`=====[${source}]handleCallAppUrl 3`, url, urlData, linkType, list);
            this.checkModalStatus(window.openSB20Detail, list.deeplink, list.sid, list.eid, list.lid);
          }
          
        }
      }
      
    }
  }

  //檢查是否剛好開啟Modal，是的話先關閉
  checkModalStatus = (callback, ...callbackArgs) => {
    console.log('callback args ', ...callbackArgs);
    if (this.state.homeHomeStatus || this.state.homeHomeStatus2) {
      this.setState({homeHomeStatus:false, homeHomeStatus2: false}, () => {
        callback && callback(...callbackArgs);
      });
    } else {
      callback && callback(...callbackArgs);
    }
  }
  
  //獲取並存下喚醒Url => 用來判斷是否展示全屏倒數廣告頁
  preGetAppInitUrl = () => {
    return Linking.getInitialURL().then((url) => {
      console.log('===preGetAppInitUrl', url);
      this.appInitUrl = url;
      return url;
    }).catch(err => {
      console.log('===preGetAppInitUrl has error', err);
      return null;
    });
  }

  getHomeModalStatus = async () => {
    //先等拿到喚醒url，才能判斷要不要展示全屏倒數廣告頁
    await this.preGetAppInitUrlPromise;
    let showHomeModal = true; //默認展示
    if (this.appInitUrl && this.appInitUrl.indexOf('f1m1p5://sb20') !== -1) {
      //如果有sb2.0 deep link 就不展示全屏倒數廣告頁，直接進賽事詳情頁
      showHomeModal = false;
    }
    console.log('===getHomeModalStatus:showHomeModal',showHomeModal);

    global.storage
      .load({
        key: "homeHomeStatus",
        id: "homeHomeStatus",
      })
      .then((data) => {
        this.CheckUptate();
        this.setState({
          homeHomeStatus: false,
          homeHomeStatus2: showHomeModal,
        });
      })
      .catch(() => {
        this.setState({
          homeHomeStatus: showHomeModal,
        });
      });
  }

  closeHomeModal() {
    this.setState({
      homeHomeStatus: false,
    });
    this.CheckUptate();
    global.storage.save({
      key: "homeHomeStatus",
      id: "homeHomeStatus",
      data: true,
      expires: null,
    });
  }

  closeHomeModal2() {
    this.setState({
      homeHomeStatus2: false,
    });
    this.CheckUptate();
  }

  getBannerFeature() {
    const login = ApiPort.UserLogin ? "after" : "before";
    fetch(`${CMS_Domain + ApiPort.CMS_BannerFeature}?login=${login}&displaying_webp`, {
      method: "GET",
      headers: {
        token: CMS_token,
      },
    })
      .then(response => response.json())
      .then((data) => {
        if (data) {
          const haveWC = data.some(v => v.action && v.action.actionId == 28 && v.action.url.indexOf("WC2022") !== -1)
          if(haveWC) {
            // 活動進行中
            store.dispatch(actions.ACTION_DuringTheWorldCup(true));
          } else {
            store.dispatch(actions.ACTION_DuringTheWorldCup(false));
          }
          global.storage.save({
            key: "getBannerFeature",
            id: "getBannerFeature",
            data: data,
            expires: null,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  // 世界杯tab
  checkWorldCupTab() {
    fetch(
      "https://sapi.leyouxi211.com/static/wcp2022.json?v=" +
      Math.random(),
      {
        method: "GET",
      }
    )
      .then((response) => (headerData = response.json()))
      .then((res) => {
        if(res.showWCP2022) {
          store.dispatch(actions.ACTION_WorldCupTab(true));
        } else {
          store.dispatch(actions.ACTION_WorldCupTab(false));
        }
      })
      .catch((error) => {
        console.log('get wcp2022 error ', error);
      });
  }
  
  GetDomainConfig() {
    fetch(
      "https://www.zdhrb64.com/CMSFiles/F1APP/Domain.json?v=" +
      Math.random(),
      {
        method: "GET",
      }
    )
      .then((response) => (headerData = response.json()))
      .then((responseData) => {
        console.log(responseData);
        if(isStaging){
          window.SBTDomain = responseData.SBTDomainST;
          return;
        }
        window.SBTDomain = responseData.SBTDomain;
      })
      .catch((error) => {
        // 错误处理
        //	console.log(error)
      });
  }

  CloseVersion() {
    //關閉版本
    fetch(
      "https://www.zdhrb64.com/CMSFiles/F1APP/FUN88P5Update.json?v=" +
        Math.random(),
      {
        method: "GET",
      }
    )
      .then((response) => (headerData = response.json()))
      .then((responseData) => {
        console.log(responseData);
        // 获取到的数据处理
        ///console.log('AAAA2222')
        //console.log(responseData.version)

        if (UpdateV != responseData.version) {
          if (Platform.OS === "ios") {
            if (responseData.ios == true) {
              this.setState({
                CloseVersion: true,
              });
            }
          }

          if (Platform.OS === "android") {
            if (responseData.android == true) {
              this.setState({
                CloseVersion: true,
              });
            }
          }
        }
      })
      .catch((error) => {
        // 错误处理
        //	console.log(error)
      });
  }

  codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({ syncMessage: "检查更新" });
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({ syncMessage: "下载包  " });
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({ syncMessage: "Awaiting user action" });
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ syncMessage: "正在安装更新" });
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({ syncMessage: "App up to date.", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({ syncMessage: "更新被用户取消", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({
          syncMessage: "Update installed and will be applied on restart.",
          progress: false,
          updataGo: false,
        });
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({
          syncMessage: "一个未知的错误 发生ddde eeexxx",
          progress: false,
          updataGo: false,
        });
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
    let percent = parseInt(
      (progress.receivedBytes / progress.totalBytes) * 100
    );
    this.setState({
      percent: percent, // 为了显示进度百分比
    });

    // console.log(percent)
    if (this.state.isMandatory == false) {
      if (percent === 100) {
        setTimeout(() => {
          this.onButtonClick2();
        }, 3000);
      }
    }

    this.setState({ progress });
  }

  toggleAllowRestart() {
    this.state.restartAllowed
      ? CodePush.disallowRestart()
      : CodePush.allowRestart();

    this.setState({ restartAllowed: !this.state.restartAllowed });
  }

  getUpdateMetadata() {
    CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING).then(
      (metadata: LocalPackage) => {
        this.setState({
          syncMessage: metadata
            ? JSON.stringify(metadata)
            : "Running binary version",
          progress: false,
        });
      },
      (error: any) => {
        this.setState({ syncMessage: "Error : " + error, progress: false });
      }
    );
  }

  /** Update is downloaded silently, and applied on restart (recommended) */
  sync() {
    CodePush.sync(
      {},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }

  syncImmediate() {
    if (this.state.isMandatory == true) {
      CodePush.sync(
        { installMode: CodePush.InstallMode.IMMEDIATE },
        this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgress.bind(this)
      );
    }

    if (this.state.isMandatory == false) {
      CodePush.sync(
        { installMode: CodePush.InstallMode.ON_NEXT_RESUME },
        this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgress.bind(this)
      );
    }
  }

  onButtonClick2(msg) {
    // if(this.state.CloseVersion == true){
    //   return;
    // }
    const { update } = this.state;
    let msgt = update.description;
    let msg2 = msgt.split(",").join("\n");
    this.setState({ CodePushLoading: "" });
    Modal.alert("更新提示:", msg2, [
      {
        text: "立即更新",
        onPress: () =>
          setTimeout(() => {
            CodePush.restartApp();
          }, 1000),
      },
    ]);
  }
  //codepush更新失败或是timeout，20s后切换可以再次更新
	codepushReset = () => {
		setTimeout(() => {
			if(!this.state.CheckUptate) {
				this.setState({ CheckUptate: true })
			}
		}, 20000);
	}
  //手動檢測版本更新
  CheckUptate(loading) {
    if (!this.state.CheckUptate) {
      return;
    }
    this.setState({ CheckUptate: false });
	this.codepushReset()
    loading && this.setState({ CodePushLoading: "版本检查中……" });
    CodePush.checkForUpdate(this.state.CodeKey).then((update) => {
      this.apk_package = update; // 更新状态等信息
      this.state.update = update;

      if (update) {
        // 有可用的更新
        this.syncImmediate();
        this.state.isMandatory = update.isMandatory;
      } else {
        // alert('无版本更新')
        this.setState({ CheckUptate: true });
        loading &&
          this.setState({ CodePushLoading: "您的 App 版本已是最新。" });
        // setTimeout(() => {
        //   this.setState({ CodePushLoading: "" });
        // }, 2000);
      }
    });
  }

  onButtonClickLogin(msg) {
    if (this.state.CloseVersion == true) {
      return;
    }
    let msgt = msg.description;
    let msg2 = msgt.split(",").join("\n");
    Modal.alert("更新提示:", msg2, [
      { text: "立即更新", onPress: () => this.syncImmediateLogin() },
    ]);
  }

  syncImmediateLogin() {
    if (this.state.isMandatory == true) {
      CodePush.sync(
        { installMode: CodePush.InstallMode.IMMEDIATE },
        this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgressLogin.bind(this)
      );
      // this.setState({
      //   updataGo:true
      // })
    }

    if (this.state.isMandatory == false) {
      CodePush.sync(
        { installMode: CodePush.InstallMode.ON_NEXT_RESUME },
        this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgressLogin.bind(this)
      );
    }
  }

  codePushDownloadDidProgressLogin(progress) {
    let percent = parseInt(
      (progress.receivedBytes / progress.totalBytes) * 100
    );
    this.setState({
      percent: percent, // 为了显示进度百分比
    });

    if (percent === 100) {
      setTimeout(() => {
        this.onButtonClick2();
      }, 5000);
    }

    this.setState({ progress });
  }

  UpdataApp() {
    //更新版本
    Linking.openURL(`${SBTDomain}/cn/Appinstall.html`);
  }

  render() {
    const {
      updataGo,
      codePushProgress,
      percent,
      CloseVersion,
      CodePushLoading,
      homeHomeStatus,
      homeHomeStatus2,
    } = this.state;

    //SB2.0 deeplink 開啟特定賽事 (原為 window.openApp 已改名)
    window.openSB20Detail = (vendor,sid,eid,lid) => {
      console.log('=====openSB20Detail', vendor,sid,eid,lid);

      let dataList = { eid, sid, lid }
      if(vendor.toLowerCase() == 'im') {
        Actions.Betting_detail({ dataList, from: 'deeplink', Vendor: VendorIM })
      } else if(vendor.toLowerCase() == 'bti') {
        Actions.Betting_detail({ dataList, from: 'deeplink', Vendor: VendorBTI })
      } else if (vendor.toLowerCase() == 'saba') {
        Actions.Betting_detail({dataList, from: 'deeplink', Vendor: VendorSABA})
      }

    }

    window.CheckUptateGlobe = (CodePushLoading = true) => {
      this.CheckUptate(CodePushLoading);
    };

    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <Modal
            animationType="none"
            transparent={true}
            visible={CodePushLoading}
            style={{
              padding: 0,
              paddingTop: 0,
              width: width / 1.1,
              borderRadius: 16,
              paddingBottom: 9,
            }}
          >
            <View style={styles.successModal}>
              <View
                style={{
                  backgroundColor: "#00A6FF",
                  width: "100%",
                  height: 44,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  版本更新
                </Text>
              </View>
              <Text
                style={{
                  color: "#000",
                  paddingTop: 24,
                  paddingBottom: 32,
                  fontSize: 14,
                }}
              >
                {CodePushLoading != "" && CodePushLoading}
              </Text>
              {CodePushLoading === "您的 App 版本已是最新。" ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ CodePushLoading: "" });
                  }}
                  style={{
                    flexDirection: "row",
                    width: "90%",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#00A6FF",
                    height: 44,
                    backgroundColor: "#00A6FF",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", padding: 15, fontSize: 16 }}>
                    确认
                  </Text>
                </TouchableOpacity>
              ) : (

                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ CodePushLoading: "" });
                    }}
                    style={{
                      flexDirection: "row",
                      width: "90%",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#00A6FF",
                      height: 44,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{ color: "#00A6FF", padding: 15, fontSize: 16 }}
                    >
                      退出
                    </Text>
                  </TouchableOpacity>
              )}
            </View>
          </Modal>

          <GlobalPopup />
          <Main />

          <LivechatMain />
          {/*客服懸浮層*/}

          <StatusBar barStyle="light-content" />
          {updataGo == true && <View style={styles.updataBg}></View>}

          {updataGo == true && (
            <View style={styles.popBox}>
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: 15,
                  paddingBottom: 10,
                }}
              >
                更新中,请勿关闭APP
              </Text>
              <View style={{ height: 4, width: width - 40 }}>
                <Progress
                  barStyle={{
                    backgroundColor: "#005a36",
                    borderColor: "#005a36",
                  }}
                  percent={percent}
                />
              </View>
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: 15,
                  paddingBottom: 10,
                }}
              >
                进度:{percent}%
              </Text>
            </View>
          )}

          {/* 首次進入APP */}
          {!ApiPort.UserLogin && homeHomeStatus && (
            <HomeModalCarousel
              closeHomeModal={this.closeHomeModal.bind(this)}
            />
          )}

          {/* 不是首次進入APP */}
          {homeHomeStatus2 && (
            <HomeModalCarousel2
              closeHomeModal={this.closeHomeModal2.bind(this)}
            />
          )}

          {CloseVersion == true && <View style={styles.updataBg2}></View>}

          {CloseVersion == true && (
            <View style={styles.popBoxS}>
              <View
                style={{
                  backgroundColor: "#00A6FF",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "bold",
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                >
                  版本升级提示
                </Text>
              </View>

              <Text
                style={{
                  textAlign: "center",
                  paddingTop: 15,
                  paddingBottom: 5,
                }}
              >
                亲爱的会员，此版本已停止使用。
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: 5,
                  paddingBottom: 10,
                }}
              >
                请下载最新APP以继续游戏。
              </Text>

              <View
                style={{
                  backgroundColor: "#00A6FF",
                  borderRadius: 12,
                  width: 100,
                  left: width / 3.3,
                  marginTop: 5,
                }}
              >
                <TouchableOpacity onPress={() => this.UpdataApp()}>
                  <Text
                    style={{
                      textAlign: "center",
                      paddingTop: 10,
                      paddingBottom: 10,
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    立即下载
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    paddingTop: 50,
  },
  messages: {
    marginTop: 15,
    color: "#fff",
    textAlign: "center",
  },
  restartToggleButton: {
    color: "blue",
    fontSize: 17,
  },
  syncButton: {
    color: "green",
    fontSize: 17,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 20,
  },
  popBox: {
    width: width - 40,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: height / 2,
    left: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    height: 80,
  },
  popBoxS: {
    width: width - 40,
    position: "absolute",
    top: height / 2.5,
    left: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    height: 160,
  },

  updataBg: {
    width: width,
    height: height,
    opacity: 0,
    backgroundColor: "#000",
    position: "absolute",
  },
  updataBg2: {
    width: width,
    height: height,
    opacity: 0.5,
    backgroundColor: "#000",
    position: "absolute",
  },
  successModal: {
    // width: width / 1.2,
    // height: height / 3,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    marginHorizontal: -15,
  },
});

/**
 * Configured with a MANUAL check frequency for easy testing. For production apps, it is recommended to configure a
 * different check frequency, such as ON_APP_START, for a 'hands-off' approach where CodePush.sync() does not
 * need to be explicitly called. All options of CodePush.sync() are also available in this decorator.
 */
let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };

App = CodePush(codePushOptions)(App);

export default App;
