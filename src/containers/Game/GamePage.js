import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  WebView,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView
} from "react-native";
import { connect } from "react-redux";
import actions from "$LIB/redux/actions/index";
import WebViewIOS from "react-native-webview";
import LoadIngWebViewGif from "./../Common/LoadIngWebViewGif";
import { Actions } from "react-native-router-flux";
import { Flex, Modal, Toast, } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import * as Animatable from "react-native-animatable";

const AnimatableImage = Animatable.Image;
const { width, height } = Dimensions.get("window");
const CIRCLE_SIZE = 80;

import { openNewWindowList, openNewWindowListAndroid, openNewWindowListIOS, sportsName } from "../../lib/data/game";
import PiwikAction from "../../lib/utils/piwik";
import OneClickTransfer from './AviatorGame/OneClickTransfer'
import HeaderBackIcon from "../Common/HeaderBackIcon";
import GamePageNavRight from "./AviatorGame/Nav/GamePageNavRight";
import GamePageNavLeft from "./AviatorGame/Nav/GamePageNavLeft";
//從react-native-safe-area抄來的代碼，處理iphone下巴問題
const thisIsIPhoneX = (() => {
  const X_WIDTH = 375;
  const X_HEIGHT = 812;
  const XSMAX_WIDTH = 414;
  const XSMAX_HEIGHT = 896;
  const PAD_WIDTH = 768;
  const PAD_HEIGHT = 1024;

  const IPHONE12_H = 844;
  const IPHONE12_Max = 926;
  const IPHONE12_Mini = 780;

  const IPHONE13_H = 844;
  const IPHONE13_Max = 926;
  const IPHONE13_Mini = 780;

  const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

  return (
    Platform.OS === 'ios' &&
    ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
      (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT)) ||
    ((D_HEIGHT === XSMAX_HEIGHT && D_WIDTH === XSMAX_WIDTH) ||
      (D_HEIGHT === XSMAX_WIDTH && D_WIDTH === XSMAX_HEIGHT)) ||
    (D_HEIGHT === IPHONE12_H) || (D_HEIGHT === IPHONE12_Max) || (D_HEIGHT === IPHONE12_Mini) ||
    (D_HEIGHT === IPHONE13_H) || (D_HEIGHT === IPHONE13_Max) || (D_HEIGHT === IPHONE13_Mini)
  );
})();

// 有些遊戲重整需重新get
const reloadGetGameList = ["AG", "MGSQF","IMOPT","CQG","BSG","LBK","EBT"];

class GamePage extends React.Component {
  constructor(props) {
    super(props);
    this._onOrientationChange = this._onOrientationChange.bind(this);
    this.state = {
      loadD: true,
      loadone: 1,
      widthS: width,
      heightS: height,
      gametype: this.props.gametype,
      gameOpenUrl: this.props.GameOpenUrl,
      gameKey: Math.random(),
      menuOpen: false,
      Noreload: true,
      displayInstantGamesTutorial: false, // 小遊戲, 首次進入遊戲教學
      AccountTotalBal: 0, //帳戶總餘額
      openBalanceInfo: false, // 開啟餘額彈窗, 針對特定遊戲的nav such as 小遊戲
    };
    console.log('reload ',this.props)
    console.log('reload ',this.state)
  }

  componentWillMount(props){
    // 體育鎖屏
    if(!sportsName.includes(this.props.gametype) && this.props.gametype !== "VTG"){
      window.openOrien = 'orientation'
      window.removeOrientation()
    }
  }
  
  componentDidMount(props) {
    const { gametype, gameCategory = "", launchGameCode, gameInfo, GameOpenUrl } = this.props;

    this.props.navigation.setParams({
      title: this.props.gameHeadName,
    });
    console.log('gameCategory ',gameCategory)
    // 只有keno會在這裡開公告
    if (gameCategory.toLowerCase() === "keno") {
      this.props.getAnnouncementPopup(this.props.gameCategory);
    }

    this.loadInterval = setInterval(() => {
      this.widthHeight();
    }, 50);

    this.getGameInfoHandler()
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    //離開註銷監聽
    if(!sportsName.includes(this.props.gametype) && this.props.gametype !== "VTG"){
      window.openOrien = ''
      window.openOrientation()
    }
    const { loadone, loadD } = this.state;
    this.loadInterval && clearInterval(this.loadInterval);
    this.props.gameInfo_clear({})
    if (ApiPort.UserLogin && !loadD && loadone == 2) {
      this.props.userInfo_getBalanceAll();
    }
  }

  getSprGames() {

    const gameType = 'InstantGames' // gameCatCode
    const providers = 'SPR' // providerCode
    const category = 'AllGames'
    const keyword = 'Aviator'
    const fetchurl = `${ApiPort.GetGame}gameType=${gameType}&pageNumber=1&provider=${providers}&category=${category}&pageSize=15&gameSortingType=Default&keyword=${keyword}&`;

    fetchRequest(fetchurl, "GET").then((res) => {
      console.log('res', res)
      if (res.isSuccess && res.result && res.result.gameDetails) {
        this.setState({ sprHotGame: res.result.gameDetails[0] });
        this.postSPRGame(res.result.gameDetails[0]);
        this.props.saveAviator(res.result.gameDetails[0]);
      }
    });
  }

  postSPRGame = (data) => {
    const provider = data ? data.provider : this.props.game.sprHotGame.provider;
    const gameId = data ? data.gameId : this.props.game.sprHotGame.gameId;
    let params = {
      provider: provider,
      isDemo: false,
      hostName: common_url,
      sportsMenu: "",
      vendorQuery: "",
      mobileLobbyUrl: common_url,
      gameId: gameId,
      bankingUrl: common_url,
      logoutUrl: common_url + "/accessdenied",
      sportid: "",
      eventId: "",
    };
    fetchRequest(ApiPort.Games + "isDemo=false&", "POST", params)
      .then((res) => {
        Toast.hide();
        let data = res.result;
        if (res.isSuccess && data) {
          if (data.isGameMaintenance) {
            Toasts.fail("游戏维护中,请稍候再来", 2);
          }
          if (data.accessDenied) {
            Toasts.fail("拒绝访问", 2);
          }
          if (data.gameLobbyUrl.length) {
            this.setState({
              gameOpenUrl: data.gameLobbyUrl,
              gametype: provider,
              gameCategory: "InstantGames"
            })
            const gameInfo = {
              category: "P2P",
              gameId,
              provider,
              GameOpenUrl: data.gameLobbyUrl,
              launchGameCode: '1',
              gametype: "SPR"
            }
            console.log('gameInfo')
            this.getGameInfoHandler(gameInfo);
          }
        } else {
          Toast.fail("Error", 2);
          return Promise.reject();
        }
      })
      .catch((error) => {
        console.log(error);
        Toast.hide();
      });
  }


  getGameInfoHandler() {
    const { gametype, gameCategory, launchGameCode, gameInfo, GameOpenUrl } = this.props;
    console.log('gameInfo ', gameInfo)

    if (gametype == 'SPR') {
      this.loadTutorialStatus() // spr game tutorial
    }

    const gameData = {
      category: gameInfo?.category,
      gameId: gameInfo?.gameId,
      provider: gameInfo?.provider,
      GameOpenUrl: GameOpenUrl,
      launchGameCode: launchGameCode,
      gametype: gametype
    }

    this.props.gameInfo_update(gameData)
  }

  _onOrientationChange(curOrt) {
    //console.log('在遊戲裡面改變方向1111')
  }

  widthHeight() {
    //重新計算寬高
    const { width, height } = Dimensions.get("window");
    this.setState({
      widthS: width,
      heightS: height,
    });
  }

  reloadGamePage() {
    this.setState({
      gameKey: Math.random(),
      gameOpenUrl: this.state.gameOpenUrl,
      loadD: true,
      loadone: 1,
    });
  }

  getReloadGamePage() {
    this.reloadGamePage2()
  }

  reloadGamePage2() { // 針對 小遊戲 重刷會失去token, 故重新拿link
    const { gameInfo, } = this.props;

    const provider = gameInfo.provider;
    const gameId = gameInfo.gameId;
    params = {
      provider,
      isDemo: false,
      hostName: common_url,
      sportsMenu: "",
      vendorQuery: "",
      mobileLobbyUrl: common_url,
      gameId,
      bankingUrl: common_url,
      logoutUrl: common_url + "/accessdenied",
      sportid: "",
      eventId: "",
    };

    Toast.loading("正在重新启动游戏,请稍候...", 2000);
    fetchRequest(ApiPort.Games + "isDemo=false&", "POST", params)
      .then((res) => {
        if (res.isSuccess && res.result) {
          Toast.hide()
          this.setState({
            gameKey: Math.random(),
            gameOpenUrl: res.result.gameLobbyUrl,
            loadD: true,
            loadone: 1,
          }, () => {
            // this.reloadGamePage()
          })
        } else {
          Toast.fail("Error", 2);
        }
      })
      .catch(err => {
        Toast.hide()
      })
  }

  OpenMenu() {
    //console.log('開menu拉')
    this.setState({
      menuOpen: this.state.menuOpen ? false : true,
    });
  }

  leavePopup = () => {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.state.goHome}
        style={{ padding: 0, width: width / 1.3 }}
      >
        <View style={styles.successModal}>
          <View>
            <Image
              resizeMode="stretch"
              source={require("../../images/icon/exclamation.png")}
              style={{ width: 60, height: 60 }}
            />
          </View>
          <Text style={{ color: "#222222", paddingTop: 32, paddingBottom: 24 }}>
            您确定离开游戏？
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ goHome: false });
              }}
              style={{
                height: 40,
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#00A6FF",
                borderRadius: 8,
                marginRight: 10,
                width: 120,
              }}
            >
              <Text style={{ color: "#00A6FF", textAlign: "center" }}>
                不，再玩一会
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({ goHome: false }, () => {
                  Actions.pop();
                });
              }}
              style={{
                height: 40,
                justifyContent: "center",
                backgroundColor: "#00A6FF",
                borderRadius: 8,
                marginLeft: 10,
                width: 120,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>确认</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  searchStringInArray(str, strArray) {
    for (var j = 0; j < strArray.length; j++) {
      if (strArray[j].match(str)) return j;
    }
    return -1;
  }

  closeTutorial() { // close spr game tutorial
    this.setState({ displayInstantGamesTutorial: false })

    global.storage.save({
      key: `displayInstantGamesTutorial${userNameDB}`,
      id: `displayInstantGamesTutorial${userNameDB}`,
      data: true,
      expires: null
    });
  }

  loadTutorialStatus() { // spr game tutorial
    global.storage.load({
      key: `displayInstantGamesTutorial${userNameDB}`,
      id: `displayInstantGamesTutorial${userNameDB}`
    })
      .then(data => {
        this.setState({ displayInstantGamesTutorial: data ? false : true })
      })
      .catch(err => {
        this.setState({ displayInstantGamesTutorial: true })
      })
  }

  openBalanceInformHandler() { // 開啟餘額彈窗, 針對特定遊戲的nav such as 小遊戲
    this.setState({ openBalanceInfo: !this.state.openBalanceInfo })
  }
  render() {
    const {
      loadone,
      loadD,
      gameOpenUrl,
      gameKey,
      widthS,
      heightS,
      menuOpen,
      Noreload,
      displayInstantGamesTutorial,
      openBalanceInfo,
    } = this.state;
    const { allBalance } = this.props.userInfo

    window.openmenuX = () => {
      this.OpenMenu();
    };

    window.reloadGamePage = () => {
      this.reloadGamePage()
    }

    window.reloadParticularGame = () => {
      this.reloadGamePage2()
    }

    window.openBalanceInform = () => { // 開啟餘額彈窗, 針對特定遊戲的nav such as 小遊戲
      this.openBalanceInformHandler()
    }

    let openUrl = "";
    if (this.props.gametype === "VTG") {
      const getParameterByName = (name, url = "") => {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      }

      const vtgJS = gameOpenUrl.split("?")[0];
      const onlineHash = getParameterByName("onlineHash", gameOpenUrl) + "";
      const language = getParameterByName("language", gameOpenUrl) + "";
      const profile = getParameterByName("profile", gameOpenUrl) + "";
      openUrl = `<!DOCTYPE html>
                <html lang=zh-CN style=width:100%;height:100%;margin:0;padding:0>
                <head><meta charset=UTF-8><meta http-equiv=X-UA-Compatible content="IE=edge "><meta name=viewport content="width=device-width, initial-scale=1.0 user-scalable=no"><title>Document</title></head>
                <body style=width:100%;height:100%;margin:0;padding:0>
                <div id=golden-race-mobile-app style=width:100%;height:100%></div>
                <script src=${vtgJS} id=golden-race-mobile-loader></script>
                <script>document.addEventListener("DOMContentLoaded",function(){console.log("hello");loader=grMobileLoader({onInit:function(a,b){console.log("on init");navigate("${this.props.launchGameCode}")},onlineHash:"${onlineHash}",profile:"${profile}",showOddFormatSelector:false,language:"${language}"})});function navigate(a){console.log("path ",a);loader.navigateByDisplayId(a)};</script>
                </body>
                </html>`;
    } else if (this.props.gametype !== "SBT") {
      openUrl = gameOpenUrl;
    } else {
      let getApi = gameOpenUrl.split("&");
      // 找到btiv3.js
      const getbtiv3Index = this.searchStringInArray("btiv3", getApi);
      // replace domain
      getApi[getbtiv3Index] = encodeURIComponent(`api=https://www.zdhrb64.com/CMSFiles/F1APP/btiv3.js`);
      // 重組
      openUrl = `${getApi.join("&")}&ReferURL=${encodeURIComponent(window.SBTDomain)}&oddsstyleid=3&APIUrl=${encodeURIComponent(window.common_url)}&MemberToken=${encodeURIComponent(ApiPort.Token)}`;
    }
    // console.log('gameOpenUrl ',gameOpenUrl)
    const isSbAirCraft = this.props.navigation.state.routeName === "SbAirCraftWrap";
    const GameWrapComponent = isSbAirCraft ? SafeAreaView : View;
    return (
      <GameWrapComponent
        style={{
          width: widthS,
          height: heightS,
          flex: 1,
          backgroundColor: "#00a6ff",
        }}
      >
        {isSbAirCraft && (
          <View style={[styles.topNav]}>
            <GamePageNavLeft hideBack={true} form={"sbBottomNav"} />
            <GamePageNavRight form={"sbBottomNav"} />
          </View>
        )}
        {/* 離開遊戲彈窗 */}
        {this.leavePopup()}

        {// spr game 教學
          <Modal
            animationType="none"
            transparent={false}
            visible={!isSbAirCraft && displayInstantGamesTutorial}
            style={{ padding: 0, width: width / 1.3 }}
          >
            <View style={{ zIndex: 99, alignItems: 'center', position: 'absolute' }}>
              <Image
                resizeMode="stretch"
                source={require('@/images/game_intro/instantGames/SprGameTutorial.png')}
                style={{ width, height: height <= 667 ? height * 1.1 : height, }}
              />

              <TouchableOpacity
                onPress={this.closeTutorial.bind(this)}
                style={{ width: 154, height: 45, backgroundColor: '#fff', position: 'absolute', bottom: height * .2, zIndex: 1, borderRadius: 10 }}
              >
                <Text style={{ textAlign: 'center', lineHeight: 45, fontSize: 15, fontWeight: 'bold' }}>进入游戏</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        }

        {/*
            sb裡面的教學要露出下方tabBar，so不能用上面的Modal，會整個蓋住，
        */}
        {(isSbAirCraft && displayInstantGamesTutorial) && (
          <View style={{ zIndex: 101, alignItems: 'center', position: 'absolute' }}>
            <Image
              resizeMode="stretch"
              source={require('@/images/game_intro/instantGames/SprGameTutorial.png')}
              style={{ width, height: height <= 667 ? height * 1.1 : height, }}
            />

            <TouchableOpacity
              onPress={this.closeTutorial.bind(this)}
              style={{ width: 154, height: 45, backgroundColor: '#fff', position: 'absolute', bottom: height * .26, zIndex: 1, borderRadius: 10 }}
            >
              <Text style={{ textAlign: 'center', lineHeight: 45, fontSize: 15, fontWeight: 'bold' }}>进入游戏</Text>
            </TouchableOpacity>
          </View>
        )}

        {gameOpenUrl && Platform.OS === "ios" ? (
          // 帶html
          (this.props.gametype === "VTG") ? (
            <WebViewIOS
              onLoadStart={(e) => this.setState({ loadD: true })}
              onLoadEnd={(e) => this.setState({ loadD: false, loadone: 2 })}
              source={{ html: openUrl, baseUrl: SBTDomain }}
              mixedContentMode="always"
              key={gameKey}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              originWhitelist={['*']}
              scalesPageToFit={false}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction
              allowFileAccess
              style={{
                width: widthS,
                height: heightS,
                flex: 1,
                marginBottom: sportsName.includes(this.props.gametype) ? 20 : 0
              }}
            />
          ) : (
            <WebViewIOS
              onLoadStart={(e) => this.setState({ loadD: true })}
              onLoadEnd={(e) => this.setState({ loadD: false, loadone: 2 })}
              source={{ uri: openUrl }}
              mixedContentMode="always"
              key={gameKey}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={false}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction
              allowFileAccess
              style={{
                width: widthS,
                height: heightS,
                flex: 1,
                marginBottom: sportsName.includes(this.props.gametype) ? 20 : 0
              }}
            />
          )
        ) : (
          // 帶html
          (this.props.gametype === "VTG") ? (
            <WebView
              onLoadStart={(e) => this.setState({ loadD: true })}
              onLoadEnd={(e) => this.setState({ loadD: false, loadone: 2 })}
              renderLoading={(e) => {
              }}
              source={{ html: openUrl, baseUrl: SBTDomain }}
              mixedContentMode="always"
              key={gameKey}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              originWhitelist={['*']}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction
              allowFileAccess
              scalesPageToFit={false}
              style={{ width: widthS, height: heightS, flex: 1 }}
              onNavigationStateChange={(even) => {
              }}
            />
          ) : (
            <WebView
              onLoadStart={(e) => this.setState({ loadD: true })}
              onLoadEnd={(e) => this.setState({ loadD: false, loadone: 2 })}
              renderLoading={(e) => {
              }}
              source={{ uri: openUrl }}
              mixedContentMode="always"
              key={gameKey}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction
              allowFileAccess
              scalesPageToFit={false}
              style={{ width: widthS, height: heightS, flex: 1 }}
              onNavigationStateChange={(even) => {
              }}
            />
          )
        )}
        <LoadIngWebViewGif loadStatus={loadD && loadone === 1} />

        {
          openBalanceInfo &&
          <View style={{ position: 'absolute', top: !isSbAirCraft ? 0 : Platform.OS === "ios" ? 55 : 50, left: 0}}>
            <OneClickTransfer allBalance={allBalance} isFromSB={isSbAirCraft} />
          </View>
        }

        {menuOpen && (
          <>
            {/* 背景 */}
            <TouchableOpacity
              activeOpacity={0}
              style={{
                width: widthS,
                height: heightS,
                opacity: 0.8,
                backgroundColor: "#333333",
                position: "absolute",
              }}
              onPress={() => {
                this.OpenMenu();
              }}
            >
              <View></View>
            </TouchableOpacity>
            <View style={styles.menu}>
              <Flex style={styles.navHeader}>
                <Flex.Item style={{ flex: 0.45 }}>
                  <Text
                    style={{
                      textAlign: "left",
                      color: "#999999",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    {this.props.userInfo.username}
                  </Text>
                </Flex.Item>

                <Flex.Item alignItems="flex-end" style={styles.userMoneybox2}>
                  <TouchableOpacity
                    style={styles.button}
                  // onPress={this.userAllmoney}
                  >
                    <Text
                      style={{
                        textAlign: "left",
                        color: "#000000",
                        paddingRight: 8,
                        fontSize: 14,
                      }}
                    >
                      ￥ {this.props.userInfo.balanceTotal}
                    </Text>
                  </TouchableOpacity>
                </Flex.Item>

                <Flex.Item alignItems="flex-end" style={styles.userReload}>
                  {this.props.userInfo.isGettingBalance ? (
                    <AnimatableImage
                      resizeMode="stretch"
                      easing="linear"
                      style={styles.refreshIcon}
                      animation="rotate"
                      iterationCount="infinite"
                      duration={800}
                      source={require("../../images/icon/refreshBlack.png")}
                    />
                  ) : (
                    <Touch onPress={() => this.props.userInfo_getBalance(true)}>
                      <Image
                        style={styles.refreshIcon}
                        source={require("../../images/icon/refreshBlack.png")}
                      />
                    </Touch>
                  )}
                </Flex.Item>
              </Flex>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    PiwikAction.SendPiwik("Ingame_Deposit");
                    Actions.DepositCenter({ from: "GamePage" });
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "row",
                    height: 45,
                  }}
                >
                  <Image
                    resizeMode="stretch"
                    source={require("../../images/icon/deposit.png")}
                    style={styles.sidebarIcon}
                  />
                  <Text style={styles.sidebarText}>存款</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    PiwikAction.SendPiwik("Ingame_Transfer");
                    Actions.Transfer();
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "row",
                    height: 45,
                  }}
                >
                  <Image
                    resizeMode="stretch"
                    source={require("../../images/icon/transfer.png")}
                    style={styles.sidebarIcon}
                  />
                  <Text style={styles.sidebarText}>转账</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    PiwikAction.SendPiwik("Ingame_CS");
                    LiveChatOpenGlobe();
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "row",
                    height: 45,
                  }}
                >
                  <Image
                    resizeMode="stretch"
                    source={require("../../images/icon/cs.png")}
                    style={styles.sidebarIcon}
                  />
                  <Text style={styles.sidebarText}>客服</Text>
                </TouchableOpacity>
                {Noreload == true && (
                  <TouchableOpacity
                    onPress={() => {
                      if(reloadGetGameList.includes(this.props.gametype)){
                        this.getReloadGamePage();
                      }else{
                        this.reloadGamePage();
                      }
                      this.setState({
                        menuOpen: false,
                      });
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                      height: 45,
                    }}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/icon/refreshStyle2.png")}
                      style={styles.sidebarIcon}
                    />
                    <Text style={styles.sidebarText}>刷新</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}
      </GameWrapComponent>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  game: state.game,
  // gameInfo: state.gameInfo,
});
const mapDispatchToProps = (dispatch) => ({
  userInfo_login: (username) => actions.ACTION_UserInfo_login(username),
  userInfo_getBalance: (forceUpdate = false) =>
    dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
  userInfo_updateBalance: (newBalance) =>
    dispatch(actions.ACTION_UserInfo_updateBalance(newBalance)),
  getAnnouncementPopup: (optionType) => dispatch(actions.ACTION_GetAnnouncement(optionType)),
  gameInfo_update: (gameObj) =>
    dispatch(actions.ACTION_GetCurrentGameInfo(gameObj)),
  gameInfo_clear: (gameObj) =>
    dispatch(actions.ACTION_InitialGameInfo(gameObj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);

const styles = StyleSheet.create({
  menu: {
    left: 0,
    top: 0,
    width: width * 0.68,
    height: height,
    backgroundColor: "#fff",
    position: "absolute",
    paddingLeft: 20,
  },
  button: {
    height: 30,
  },
  navHeader: {
    backgroundColor: "#fff",
    paddingRight: 15,
    paddingTop: 16,
    paddingBottom: 20,
  },
  userMoneybox2: {
    flex: 0.4,
    top: 6,
  },
  userReload: {
    flex: 0.1,
  },
  successModal: {
    // width: width / 1.2,
    // height: height / 3,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  sidebarIcon: {
    width: 40,
    height: 40,
  },
  sidebarText: {
    color: "#222222",
    paddingLeft: 10,
  },
  refreshIcon: {
    width: 16,
    height: 16,
    marginLeft: 13,
  },
  topNav: {
    width: width,
    height: Platform.OS === "ios" ? 44 : 50,
    // paddingTop: 80,
    zIndex: 100,
    position: "relative",
    backgroundColor: "#00a6ff",
    display: "flex",
    justifyContent: 'space-between',
    alignItems: "center",
    flexDirection: "row",
  },
});
