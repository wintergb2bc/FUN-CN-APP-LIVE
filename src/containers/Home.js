import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  Linking,
  View,
  Platform,
  Dimensions,
  NativeModules,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
// import fetch from 'fetch-with-proxy';
import { Flex, Toast, WingBlank } from "antd-mobile-rn";
import TabsStyle from "antd-mobile-rn/lib/tabs/style/index.native";
import { Actions } from "react-native-router-flux";
import SnapCarousel, {
  ParallaxImage,
  Pagination,
} from "react-native-snap-carousel";
import Carousel from "react-native-snap-carousel";

const { width, height } = Dimensions.get("window");
const AffCodeIos = NativeModules.CoomaanTools;
import IovationX from "./../actions/IovationNativeModule"; //android 拿黑盒子
import actions from "../lib/redux/actions/index";
import NavigationUtil from "../lib/utils/NavigationUtil";
import FastImage from 'react-native-fast-image'
import LoadingBone from "./Common/LoadingBone";
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import { openNewWindowList, openNewWindowListAndroid, openNewWindowListIOS } from "../lib/data/game";
import CornerLabel from "./Common/CornerLabel";
import ScrollableTabView, {
  ScrollableTabBar,
} from "react-native-scrollable-tab-view";
import PiwikAction from "../lib/utils/piwik";
import BannerAction from "../lib/utils/banner";
import { getAllVendorToken } from './SbSports/lib/js/util';
import CsCallIcon from '@/containers/csCall/CsCallIcon'

const AnimatableImage = Animatable.Image;
const AnimatableView = Animatable.View

const featureImgHeight = 0.20 * (width);
// 進到GameList頁
const gameHaveList = ["CASINO", "P2P", "SLOT", "LIVECASINO", 'INSTANTGAMES'];

let clickedSport = "";
import { sportsName } from "../lib/data/game";

// 移除Tabs下方那條線
const newStyle = {};
for (const key in TabsStyle) {
  if (Object.prototype.hasOwnProperty.call(TabsStyle, key)) {
    newStyle[key] = { ...StyleSheet.flatten(TabsStyle[key]) };
    if (newStyle["Tabs"]["topTabBarSplitLine"].borderBottomWidth !== 0) {
      newStyle["Tabs"]["topTabBarSplitLine"].borderBottomWidth = 0;
    }
  }
}

const tabName = {
  SPORTSBOOK: "体育",
  ESPORTS: "电竞",
  P2P: "棋牌",
  SLOT: "老虎机",
  LIVECASINO: "真人",
  KENOLOTTERY: "彩票",
};

// 用於比對flash和fp的兩方api的categoryCode
const gamesData = [
  {
    flashCode: "Sportsbook",
    fpCode: "Sportsbook",
  },
  {
    flashCode: "ESports",
    fpCode: "Esports",
  },
  {
    flashCode: "InstantGames",
    fpCode: "InstantGames",
  },
  {
    flashCode: "LiveCasino",
    fpCode: "Casino",
  },
  {
    flashCode: "P2P",
    fpCode: "P2P",
  },
  {
    flashCode: "Slot",
    fpCode: "Slot",
  },
  {
    flashCode: "KenoLottery",
    fpCode: "Lottery",
  },
];

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      BtnPosLeft2: 0,
      BtnPosTop3: 0,
      BtnPosLeft3: 0,
      BannerDB: [],
      newsAnnouncements: "",
      BannerFeature: [],
      BannerFeatureEmpty: false,
      activeSlide: 0, //当前轮播图序号
      activeSlide2: 0,

      gameCategory: null, //游戏类别
      gameProviders: [], //游戏供应商数据
      gameSequences: [], //遊戲序列
      gameTabsKey: 0, //當前遊戲tab

      curGameCatId: 0, //当前游戏Category_Id
      curGameCatCode: "",
      CMS_GameProvidersList: [],
      getGameKey: 0,
      soprtGameLad: false, //体育延迟再去请求api
      sprHotGame: [], // spr hot game數據
      gameLabelStatus: '',
    };
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    this.homeInit();
  }

  componentDidMount() {
    fetchRequest(`${ApiPort.app}appName=${window.appIOSId}&`, "GET");
    // setTimeout(() => {
    // 	navigateToSceneGlobe()
    // }, 2000)
  }

  componentWillUnmount() {
  }

  homeInit = () => {
    if (ApiPort.UserLogin) {
      // this.Checkdomin();
      // this.getMainDomain();
      // this.getServerUrl();
      //新注册用户需要二次获取信息
      // window.GetMessageCounts && window.GetMessageCounts();
    }

    if (ApiPort.UserLogin) {
      this.props.userInfo_getBalance();
    }
    this.getHomeBanner();
    this.getBannerFeature();
    this.getSequence();
    setTimeout(() => {
      this.getHomeNews();
      this.getSprGames(); // 單獨獲取spr hot game
    }, 1500);
  }

  getSequence(flag) {
    global.storage
      .load({
        key: "GameSequence",
        id: "GameSequence",
      })
      .then((gameSequences) => {
        if (gameSequences.length) {
          this.setState(
            {
              gameSequences,
            },
          );
        }
      })
      .catch(() => {
      });
    fetchRequest(ApiPort.Sequence, "GET")
      .then((res) => {
        Toast.hide();
        if (res.result && res.result.length) {
          // let gameSequencesCasino = res.find(
          //   (v) => v.code.toLocaleUpperCase() === "CASINO"
          // );
          this.setState(
            {
              gameSequences: res.result,
            },
            () => this.getGameCategory()
          );
          global.storage.save({
            key: "GameSequence",
            id: "GameSequence",
            data: res.result,
            expires: null,
          });
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }
  
  getSequence(flag) {
    global.storage
      .load({
        key: "GameSequence",
        id: "GameSequence",
      })
      .then((gameSequences) => {
        if (gameSequences.length) {
          this.setState(
            {
              gameSequences,
            },
          );
        }
      })
      .catch(() => {
      });
    fetchRequest(ApiPort.Sequence, "GET")
      .then((res) => {
        Toast.hide();
        if (res.result && res.result.length) {
          // let gameSequencesCasino = res.find(
          //   (v) => v.code.toLocaleUpperCase() === "CASINO"
          // );
          this.setState(
            {
              gameSequences: res.result,
            },
            () => this.getGameCategory()
          );
          global.storage.save({
            key: "GameSequence",
            id: "GameSequence",
            data: res.result,
            expires: null,
          });
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  getHomeBanner() {
    //先获取缓存
    storage
      .load({
        key: "getHomeBanner",
        id: "getHomeBanner",
      })
      .then((data) => {
        this.setState({
          BannerDB: data,
        });
      });
    const login = ApiPort.UserLogin ? "after" : "before";
    fetch(`${CMS_Domain + ApiPort.CMS_Banner}?login=${login}&displaying_webp`, {
      method: "GET",
      headers: {
        token: CMS_token,
      },
    })
      .then(response => response.json())
      .then((data) => {
        if (data.length) {
          // PiwikEvent('CMS_home_main' + ((new Date()).getTime() - times - 600))
          // PiwikEvent('CMS_home_main')
          this.setState({
            BannerDB: data,
          });
          storage.save({
            key: "getHomeBanner",
            id: "getHomeBanner",
            data: data,
            expires: null,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getBannerFeature() {
    //先获取缓存
    storage
      .load({
        key: "getBannerFeature",
        id: "getBannerFeature",
      })
      .then((data) => {
        this.setState({
          BannerFeature: data,
          BannerFeatureEmpty: data.length === 0
        });
      });
    let times = new Date().getTime();
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
          // PiwikEvent('CMS_home_feature' + ((new Date()).getTime() - times - 600))
          // PiwikEvent("CMS_home_feature");
          this.setState({
            BannerFeature: data,
            BannerFeatureEmpty: data.length === 0
          });
          storage.save({
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

  getHomeNews() {
    fetchRequest(
      ApiPort.GetAnnouncements +
      "messageTypeOptionID=10&pageSize=8&pageIndex=1&",
      "GET"
    )
      .then((data) => {
        Toast.hide();
        if (data.result && data.result.announcementsByMember.length > 0) {
          this.setState({ newsAnnouncements: data.result });
        }
      })
      .catch((error) => {
        Toast.hide();
      });
  }

  getBtnPos3 = (e) => {
    NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
      this.setState({
        BtnPosTop3: py,
        BtnPosLeft3: px,
      });
    });
  };
  // banner
  _renderBannerItem = ({ item, index }, parallaxProps) => {
    // console.log('home_main_banner', item, index)
    return (
      <Touch
        key={index}
        onPress={() => BannerAction.onBannerClick(item, "home")}
        // onPress={() => this.JumtProm(item, index)}
        style={styles.carouselItem}
      >
        <ParallaxImage
          onLoadStart={() => {
            this.times1 = new Date().getTime();
          }}
          // onLoad={() => { PiwikEvent(index + 'CMS_home_main_img' + ((new Date()).getTime() - this.times1)) }}
          //onLoad={() => { PiwikEvent(index + 'CMS_home_main_img') }}
          source={{ uri: item.cmsImageUrl }}
          containerStyle={styles.carouselImageContainer}
          style={styles.carouselImage}
          parallaxFactor={0}
          {...parallaxProps}
        />
      </Touch>
    );
  };

  _renderBannerItem2 = ({ item, index }, parallaxProps) => {
    return (
      <Touch
        key={index}
        onPress={() => BannerAction.onBannerClick(item, "Home", "Feature")}
        style={styles.featureWrap}
      >
        <FastImage
          resizeMethod="resize"
          resizeMode="stretch"
          onLoadStart={() => {
            this.times2 = new Date().getTime();
          }}
          source={{ uri: item.cmsImageUrl }}
          style={{
            width: width - 30,
            height: featureImgHeight,
          }}
        />
        {/* <ParallaxImage
					source={{ uri: item.cmsImageUrl }}
					containerStyle={styles.carouselImageContainer}
					style={{
						...StyleSheet.absoluteFillObject,
						resizeMode: "contain",
						width: width - 30,
						height: 0.2 * (width - 30),
						borderRadius: 50
					}}
					parallaxFactor={0.4}
					{...parallaxProps}
				/> */}
      </Touch>
    );
  };

  get pagination() {
    const { BannerDB, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={BannerDB.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationStyle}
        dotStyle={styles.paginationdotStyle}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  get pagination2() {
    const { BannerFeature, activeSlide2 } = this.state;
    return (
      <Pagination
        dotsLength={BannerFeature.length}
        activeDotIndex={activeSlide2}
        containerStyle={styles.paginationStyle}
        dotStyle={styles.paginationdotStyle2}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  // 获取游戏类别
  getGameCategory() {
    storage
      .load({
        key: "GameCategory",
        id: "GameCategory",
      })
      .then((data) => {
        this.setCategoryData(data);
      })
      .catch((err) => {
      });
    this.getCategory();
  }

  // 从api 拿 获取游戏类别
  getCategory() {
    fetch(`${CMS_Domain + ApiPort.CMS_GameCategory}`, {
      method: "GET",
      headers: {
        token: CMS_token,
      },
    })
      .then(response => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          this.setCategoryData(data);
          this.getGameProviders(data);
          storage.save({
            key: "GameCategory", // 注意:请不要在key中使用_下划线符号!
            id: "GameCategory", // 注意:请不要在id中使用_下划线符号!
            data: data,
            expires: null,
          });
        }
      })
      .catch((error) => {
        //	Toast.hide();
        console.log(error);
      });
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

  setCategoryData(data) {
    // console.log("获取游戏类别",data);
    let categoryArray = [];
    if (data.length === 0) {
      return;
    }
    data.map((item) => {
      const {
        gameCatPageName,
        gameCatId,
        gameCatCode,
        gameCatDesc,
        gameCatTitle,
        gameCatDefaultImageUrl,
        gameCatSubtitle,
      } = item;
      if (
        gamesData.find(
          (v) =>
            v.fpCode.toLocaleLowerCase() === gameCatCode.toLocaleLowerCase()
        )
      ) {
        categoryArray.push({
          title: gameCatPageName,
          gameCatId: gameCatId,
          gameCatCode: gameCatCode.toLocaleLowerCase(),
          gameCatDesc: gameCatDesc,
          gameCatTitle: gameCatTitle,
          gameCatDefaultImageUrl: gameCatDefaultImageUrl,
          gameCatSubtitle: gameCatSubtitle,
        });
      }
    });
    this.setState({
      gameCategory: categoryArray,
      curGameCatId: categoryArray[0].gameCatId,
      curGameCatCode: categoryArray[0].gameCatCode,
    });
  }

  // 获取所有游戏供应商
  getGameProviders(value) {
    value.forEach((item) => {
      storage
        .load({
          key: `GameProviders${item.gameCatId}`,
          id: `GameProviders${item.gameCatId}`,
        })
        .then((data) => {
          // 先用缓存的
          if (data != "") {
            this.sortGameProviders(data);
          }
        })
        .catch((err) => {
        });
    });

	let time = 0
	let gamedataInterval = setInterval(() => {
		this.getProviders(value[time].gameCatId);
		time++;
		if (time == value.length) {
			gamedataInterval && clearInterval(gamedataInterval);
			gamedataInterval = null
			return;
		}
	}, 1500);
  }

  // 从API获取所有游戏供应商
  getProviders(id) {
    fetch(
      `${CMS_Domain + ApiPort.CMS_GameProviders}/${id}`,
      {
        method: "GET",
        headers: {
          token: CMS_token,
        },
      }
    )
      .then(response => response.json())
      .then((data) => {
        if (data && data.providers) {
          console.log(`GameProviders${id}`)
          storage.save({
            key: `GameProviders${id}`, // 注意:请不要在key中使用_下划线符号!
            id: `GameProviders${id}`, // 注意:请不要在id中使用_下划线符号!
            data: data.providers,
          });
          this.sortGameProviders(data.providers);
        }
      })
      .catch((error) => {
        //	Toast.hide();
        console.log(error);
      });
  }

  sortGameProviders(data) {
    let results = {};

    results = data.reduce((total, cur) => {
      const gameCatCode = cur.gameCatCode
        ? cur.gameCatCode.toLocaleLowerCase()
        : null;

      if (gameCatCode) {
        if (total[gameCatCode]) {
          total[gameCatCode].push(cur);
        } else {
          total[gameCatCode] = [cur];
        }
      }
      return total;
    }, {});
    // console.log(results)
    // this.matchCategoryProviders(results);

    this.setState(prevState => ({
      gameProviders: {                   // object that we want to update
        ...prevState.gameProviders,    // keep all other key-value pairs
        [Object.keys(results)]: Object.values(results)[0]    // update the value of specific key
      }
    }));
  }

  //比较category和providers ,没有provider的category去掉
  matchCategoryProviders(gameProviders) {
    let { gameCategory } = this.state;
    let finalCategories = [];
    if (gameCategory) {
      gameCategory.map((item) => {
        if (gameProviders[item.gameCatCode]) {
          // 如果该catCode有对应的provider游戏数据
          finalCategories.push(item);
        }
      });
      // 最终的游戏类别
      this.setState({ gameCategory: finalCategories });
    }
  }

  getBtnPos2 = (e) => {
    NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
      this.setState({
        BtnPosTop2: py,
        BtnPosLeft2: px,
      });
    });
  };

  gameTypePiwik(code) {
    switch (code) {
      case "sportsbook":
        PiwikEvent("Sport_homepage");
        break;
      case "esports":
        PiwikEvent("Esport_homepage");
        break;
      case "instantgames":
        PiwikEvent("Spribe_homepage");
        break;
      case "casino":
        PiwikEvent("Live_homepage");
        break;
      case "p2p":
        PiwikEvent("P2P_homepage");
        break;
      case "slot":
        PiwikEvent("Slot_homepage");
        break;
      case "lottery":
        PiwikEvent("Keno_homepage");
        break;
      default:
        break;
    }
  }

  renderTab(name, i, isTabActive, onPressHandler) {
    const { gameSequences, gameLabelStatus } = this.state;
    const findGame = gamesData.filter(
      (v) => v.flashCode === gameSequences[i].code
    )[0];
    let flag = i * 1 === this.state.gameTabsKey;
    if (!findGame) {
      return;
    }
    return (
      <View
        key={i}
        style={{
          paddingHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          key={i}
          style={{
            alignItems: "center",
          }}
          onPress={() => {
            onPressHandler(i);
            this.setState({
              gameTabsKey: i,
              curGameCatCode: findGame.fpCode,
              curGameCatId: findGame.fpCode,
            });
          }}
        >
          {
            gameSequences[i].name == '小游戏' && (
              <>
                {
                  gameLabelStatus == 'isComingSoon' ? (
                    <View style={{ width: 44, backgroundColor: '#FF4141', position: 'absolute', top: -2, right: -16, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 3 }}>
                      <Text style={{ color: '#fff', fontSize: 8 }}>敬请期待</Text>
                    </View>
                  ) : gameLabelStatus == 'isNew' ? (
                    < Image
                      resizeMode='stretch'
                      source={require('@/images/icon/new.png')}
                      style={{ width: 17, height: 17, position: 'absolute', top: -2, right: -11, }}
                    />
                  ) : null
                }
              </>
            )
          }

          <Text
            style={{
              fontSize: 14,
              color: flag ? "#00A6FF" : "#999999",
              paddingBottom: 6,
              paddingTop: 15,
              fontWeight: "bold",
            }}
          >
            {name}
          </Text>
          <View
            style={[
              styles.gameTabbarLine,
              {
                backgroundColor: flag ? "#00A6FF" : undefined,
              },
            ]}
          ></View>
        </TouchableOpacity >
      </View >
    );
  }

  /**
   * @param {number} item 游戏类型
   * @param {string} item2 細節
   * @param {string} categoryData
   */
  onGameItemPress(item, item2, categoryData, index) {
    const { gameTabsKey, sprHotGame } = this.state;
    let gameCode = item.code.toLocaleUpperCase();
    let subProvidersCode = item.subProviders[index].code.toLocaleUpperCase();

    // console.log('onGameItemPress', item, item2, categoryData, index)

    if (gameHaveList.indexOf(gameCode) > -1 && item2.code != "AVIATOR" || item2.code === "VTG") {
      if (Object.keys(categoryData).length === 0) {
        return;
      }
      let gameDetail = {
        code: item2.code,
        title: item2.name,
        category: categoryData,
        categoryGameCode: item.code,
      }
      // console.log('gameDetail', gameDetail)
      if (item2.code === "VTG") {
        gameDetail.navTitle = "V2 虚拟体育";
      }

      Actions.ProductGameDetail(gameDetail);
      return;
    }

    if (!ApiPort.UserLogin) {
      NavigationUtil.goToLogin();
      return;
    };

    if (!this.state.curGameCatCode) {
      return;
    }
    // 體育先彈公告，再彈體育專屬彈窗
    if (sportsName.includes(item2.code)) {
      this.props.getAnnouncementPopup(this.state.curGameCatCode, true, {
        provider: item2.code,
        gameId: null,
        category: this.state.curGameCatCode
      });
    } else if (item2.code.toLocaleUpperCase() == "AVIATOR") { // spr hot game 
      PiwikEvent("Game Nav", "Launch", `${sprHotGame.gameName}__SPR_HomePage`);
      if (sprHotGame && sprHotGame.gameId) {
        this.props.playGame({
          provider: sprHotGame.provider,
          gameId: sprHotGame.gameId,
          category: this.state.curGameCatCode
        });
      }
    } else {
      this.props.playGame({
        provider: item2.code,
        gameId: null,
        category: this.state.curGameCatCode
      });
    }
  }

  openAviatorGame(from) {
    const { sprHotGame } = this.state;

    if (!ApiPort.UserLogin) {
      NavigationUtil.goToLogin();
      return;
    }
    if (sprHotGame && sprHotGame.gameId) {
      this.props.playGame({
        provider: sprHotGame.provider,
        gameId: sprHotGame.gameId,
        category: "InstantGames",
        from
      });
    }
  }
  
  getSprGames() {

    const param = {
      gameType: 'InstantGames', // gameCatCode
      providers: 'SPR', // providerCode
      category: 'AllGames',
      keyword: 'Aviator',
    }

    const fetchurl = `${ApiPort.GetGame}gameType=${param.gameType}&pageNumber=1&provider=${param.providers}&category=${param.category}&pageSize=15&gameSortingType=Default&keyword=${param.keyword}&`;

    fetchRequest(fetchurl, "GET").then((res) => {
      // console.log('res', res)
      if (res.isSuccess && res.result && res.result.gameDetails) {
        
        // 存起來，方便體育內此遊戲的使用
        this.props.saveAviator(res.result.gameDetails[0]);
        
        this.setState({ sprHotGame: res.result.gameDetails[0] }, () => {
          this.getGameStatus(param, 'AVIATOR') // 針對tabbar 小遊戲 的label 狀態
          this.getGameStatus(param, 'InstantGames') // 針對home page 的 小遊戲 tab bar 的label 狀態
        });
      }
    });
  }

  getGameStatus(data, keyword) {
    fetchRequest(ApiPort.GameMaintenanceStatus + `providerCode=${keyword}&`, "GET")
      .then((res) => {
        // console.log('res', res)
        if (res.isSuccess && res.result) {
          const result = res.result

          if (keyword == 'AVIATOR') {
            const param = {
              gameType: data.gameType,
              providers: data.providers,
              gameName: result.providerCode,
              isComingSoon: result.isComingSoon,
              isNew: result.isNew,
            }
            this.props.getGameMaintainStatus(param);
          } else {
            this.setState({
              gameLabelStatus: result.isComingSoon ? 'isComingSoon' : result.isNew ? 'isNew' : ''
            }, () => console.log('gameLabelStatus', this.state.gameLabelStatus));

          }
        }
      });
  }

  navigateToSceneGame(key, item, gameTabsKey) {
    // RmoveOrien() //刪掉監聽
    Actions[key]({ data: item, gameTabsKey });
  }

  gamePiwik = (code) => {
    console.log(`${code}_Game_Home`);
    PiwikAction.SendPiwik(`${code}_Game_Home`);
  }

  /**
   - Tabs和主內容抓Sequences
   - 底部文字抓Providers
   - 最右邊文字抓gameCategory
   **/
  gameTab = () => {
    const { gameSequences, gameTabsKey } = this.state;
    if (!gameSequences) {
      return;
    }
    return (
      <ScrollableTabView
        style={{ height: 40 }}
        page={gameTabsKey}
        renderTabBar={() => (
          <ScrollableTabBar
            style={[{ borderBottomWidth: 0 }]}
            renderTab={this.renderTab.bind(this)}
          />
        )}
        tabBarUnderlineStyle={{ height: 0 }}
      >
        {gameSequences.map((v, i) => {
          return (
            <Text
              key={i}
              tabLabel={v.name}
              style={{
                display: "none",
                height: 0,
                opacity: 0,
                transform: [{ scale: 0 }],
              }}
            ></Text>
          );
        })}
      </ScrollableTabView>
    );
  };

  gameTabContent = () => {
    const {
      gameCategory,
      gameProviders,
      gameSequences,
      gameTabsKey,
      curGameCatCode,
    } = this.state;
    const categoryData = gameCategory
      ? gameCategory.filter(
        (v) => v.gameCatCode === curGameCatCode.toLowerCase()
      )[0]
      : {};

    if (gameSequences.length === 0) {
      return;
    }
    const findGame = gamesData.filter(
      (v) => v.flashCode === gameSequences[gameTabsKey].code
    )[0];
    const code = findGame ? findGame.fpCode.toLocaleLowerCase() : "";
    const providerData = gameProviders[code] ? gameProviders[code] : [];
    let getSubtitle = "";
    if (!gameSequences[gameTabsKey].subProviders) return;
    return (
      <ScrollView ref='_gameScrollView'
        onContentSizeChange={() => {
          this.refs._gameScrollView.scrollTo({ x: 0, y: 0, animated: true });
        }}
        horizontal={true}
        style={styles.gameContentBox}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "row",
          }}
        >
          {gameSequences[gameTabsKey].subProviders.map((item, i) => {
            if (providerData.length !== 0) {
              const getSubProvider = providerData.filter(
                (v) =>
                  v.providerCode.toLocaleLowerCase() ===
                  item.code.toLocaleLowerCase()
              )[0];
              getSubtitle =
                getSubProvider && getSubProvider.providerSubtitle
                  ? getSubProvider.providerSubtitle
                  : "";
            }
            // console.log(item)
            return (
              <Touch
                onPress={() => {
                  this.gamePiwik(item.code)

                  //vendor體育-要彈窗
                  // if (sportsName.includes(item.code)) {
                  //   this.props.sportGamePopup(item.code);
                  //   return;
                  // }

                  if (item.code === "SB2") {
                    //樂體育不用彈窗
                    if (ApiPort.UserLogin) {
                      // 自我限制檢查
                      if (this.props.userSetting.selfExclusions.disableBetting) {
                        this.props.selfExclusionsPopup(true);
                        return;
                      }
                      if (ApiPort.UserLogin && isGameLock) {
                        Toast.fail("您的账户已被锁，请联系在线客服。", 2);
                        return;
                      }
                      //已登入 先獲取token後跳轉
                      Toast.loading("加载中...");
                      getAllVendorToken()
                        .finally(() => {
                          //不管成功或失敗都跳轉
                          Toast.hide();
                          Actions.SbSports({
                            sbType: 'IPSB'
                          });
                        });
                    } else {
                      //未登入 直接跳轉
                      Actions.SbSports({
                        sbType: 'IPSB'
                      });
                    }
                    return;
                  }

                  this.onGameItemPress(
                    gameSequences[gameTabsKey],
                    item,
                    categoryData,
                    i
                  );
                }}
                key={i}
                style={styles.gameContetnItem}
              >
                <View style={{ zIndex: 1, overflow: "hidden" }}>
                  {item.isNew && (
                    <CornerLabel
                      cornerRadius={54}
                      style={{ height: 24, backgroundColor: "#FF4141" }}
                      linear={false}
                      // linearColor={["#FF4141", "#fc5050"]}
                      textStyle={{
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: "bold"
                      }}
                    >
                      新
                    </CornerLabel>
                  )}
                  {item.isHot && (
                    <CornerLabel
                      cornerRadius={54}
                      style={{ height: 24, backgroundColor: "#FDB454" }}
                      linear={false}
                      // linearColor={["#FDB454", "#FDB454"]}
                      textStyle={{
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: "bold"
                      }}
                    >
                      热
                    </CornerLabel>
                  )}
                  <Image
                    onLoadStart={() => {
                      this.times3 = new Date().getTime();
                    }}
                    source={{
                      uri: item.imageUrl || "",
                    }}
                    resizeMethod="resize"
                    resizeMode="stretch"
                    style={[styles.gameContentImg, { zIndex: 99 }]}
                  />
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(0, 0, 0, 0.4)",
                      "rgba(0, 0, 0, 0.4)",
                    ]}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      bottom: 0,
                      position: "absolute",
                      width: 0.36 * width,
                      height: 35,
                      // backgroundColor: "rgba(0, 0, 0,0.2)",
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      zIndex: 99999
                    }}
                  >
                    <Text style={styles.gameContentTitle}>{item.name || ""}</Text>
                  </LinearGradient>
                </View>
                {getSubtitle !== "" && (
                  <Text style={styles.gameSubtitle} numberOfLines={1}>
                    {getSubtitle}
                  </Text>
                )}
              </Touch>
            );
          })}
          {// 隱藏小遊戲的了解更多
            (categoryData.gameCatCode !== "instantgames") ? (
              <Touch
                onPress={() => {
                  this.onGameIntroPress(gameProviders[code], categoryData);
                }}
                style={styles.gameIntroItem}
              >
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 8,
                  }}
                >
                  {gameProviders[code] && categoryData && (
                    <>
                      <Text style={[styles.gameIntroTitle]}>
                        {categoryData.gameCatTitle}
                      </Text>
                      <Text style={styles.gameIntroSubTitle}>
                        {categoryData.gameCatDesc}
                      </Text>
                    </>
                  )}
                  <Text style={styles.gameIntroBtn}>了解更多</Text>
                </View>
              </Touch>
            ) : null
          }

        </View>
      </ScrollView>
    );
  };

  onGameIntroPress = (item, category) => {
    // console.log('onGameIntroPress', item)
    // console.log('category', category)
    // 前往游戏介绍页面
    const findGame = gamesData.filter(
      (v) =>
        v.fpCode.toLocaleLowerCase() ===
        category.gameCatCode.toLocaleLowerCase()
    )[0];

    if (
      category.gameCatCode === "slot" ||
      category.gameCatCode === "p2p" ||
      category.gameCatCode === "casino"
    ) {
      Actions.ProductGamePage({
        gameItem: item, //用於圖片
        category: category, //主要用于棋牌，真人，电子的id
        categoryCode: findGame.flashCode,
      });
      return;
    }
    Actions.ProductIntro({
      gameItem: item, //api拿到的游戏内容
      category: category, //主要用于棋牌，真人，电子的id
      categoryCode: findGame.flashCode,
    });
  };

  render() {
    window.isSTcommon_url = true;
    window.refreshingHome = () => {
      Actions.Login();
      this.homeInit();
    };

    window.getAviator = (from = "") => {
      if(from !== "sb"){
        Actions.pop();
      }
      this.openAviatorGame(from) // 單獨獲取spr hot game
    }


    const {
      newsAnnouncements,
      BannerDB,
      BannerFeature,
      BannerFeatureEmpty,
      gameProviders,
      balance,
      gameSequences,
      gameTabsKey,
      curGameCatId,
      sportOpenModal,
      openNewWindowModal,
    } = this.state;
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}>
        <View style={styles.wrapper}>
          <View style={styles.wrapperNav}>
            <View>
              <Image
                resizeMode="cover"
                source={require("../images/home/funLogo.png")}
                style={{ width: 78, height: 35 }}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              {this.props.csCall.isVip && <CsCallIcon />}
              <Touch
                onPress={() => {
                  LiveChatOpenGlobe();
                  PiwikEvent("LiveChat", "Launch", "LoginPage");
                }}
              >
                <Image
                  resizeMode="stretch"
                  source={require("../images/cs.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Touch>
            </View>
          </View>
          {/* 公告 */}
          <Flex style={styles.warning} onLayout={(e) => this.getBtnPos3(e)}>
            <Touch
              style={styles.waringBtn}
              hitSlop={{ top: 10, bottom: 10, left: 30, right: 300 }}
            // onPress={() => this.onNewsPress()}
            >
              <View style={styles.warningIcon}>
                <Image
                  resizeMode="stretch"
                  source={require("../images/home/bell.png")}
                  style={styles.warningIcon}
                />
              </View>
              <Carousel
                ref={(c) => {
                  this._carousel = c;
                }}
                data={
                  (newsAnnouncements != "" &&
                    newsAnnouncements.announcementsByMember) ||
                  []
                }
                autoplay={true}
                loop={true}
                sliderWidth={width}
                itemWidth={width}
                autoplayDelay={500}
                autoplayInterval={4000}
                renderItem={(item, i) => {
                  return (
                    <Touch
                      key={i}
                      style={styles.warningT}
                      onPress={() => {
                        if (ApiPort.UserLogin == false) {
                          this.toggleLoginPopup(true);
                          return;
                        }
                        Actions.news({ Nowatype: "公告" });
                      }}
                    >
                      <Text
                        style={styles.warningText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.item.topic}
                      </Text>
                    </Touch>
                  );
                }}
              />
            </Touch>
          </Flex>
          <View
            style={{
              position: "absolute",
              zIndex: -1,
              top: -width * 0.25,
              left: 0,
            }}
          >
            <Image
              resizeMethod="resize"
              resizeMode="contain"
              style={{
                width: width,
                height: width * 0.9,
              }}
              source={require("../images/home/headerBG3.png")}
            />
          </View>
          {Array.isArray(BannerDB) && BannerDB.length > 0 ? (
            <>
              <SnapCarousel
                ref={(c) => {
                  this._snapcarousel = c;
                }}
                data={BannerDB}
                renderItem={this._renderBannerItem}
                onSnapToItem={(index) => this.setState({ activeSlide: index })}
                sliderWidth={width}
                sliderHeight={0.52 * (width - 60)}
                itemWidth={width - 60}
                hasParallaxImages={true}
                firstItem={0}
                loop={true}
                autoplay={true}
              />
              {this.pagination}
            </>
          ) : (
            <View style={[styles.wrapper2, { backgroundColor: "#e0e0e0" }]}>
              <LoadingBone></LoadingBone>
            </View>
          )}
        </View>
        {/* 登录前-欢迎栏/登录后-用户信息 */}
        <View style={{ marginTop: BannerFeatureEmpty ? 10 : 0, marginBottom: BannerFeatureEmpty ? 19 : 19 }}>
          <WingBlank>
            {!ApiPort.UserLogin ? (
              <Flex>
                <Flex.Item style={styles.avatarBox}>
                  <Text style={styles.greetingText}>欢迎到来～</Text>
                  <Text style={styles.greetingText}>
                    赶紧体验新版乐天堂吧！
                  </Text>
                </Flex.Item>

                <Flex.Item style={styles.singInBox}>
                  <Touch
                    onPress={() => {
                      NavigationUtil.goToLogin();
                      PiwikAction.SendPiwik("homeLogin");
                    }}
                    hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
                  >
                    <Text style={{ color: "#00A6FF", fontSize: 16, fontWeight: 'bold' }}>登录</Text>
                  </Touch>
                </Flex.Item>

                <Flex.Item style={styles.setUpBox}>
                  <Touch
                    onPress={() => {
                      NavigationUtil.goToRegister();
                      PiwikAction.SendPiwik("homeRegister");
                    }}
                    hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
                  >
                    <Text style={{ color: "#0CCC3C", fontSize: 16, fontWeight: 'bold' }}>注册</Text>
                  </Touch>
                </Flex.Item>
              </Flex>
            ) : null}

            {ApiPort.UserLogin ? (
              <Flex onLayout={(e) => this.getBtnPos1(e)}>
                <View style={styles.balanceWrap}>
                  <Text style={styles.siginInText}>账户余额</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#00A6FF",
                        fontSize: 24,
                      }}
                    >
                      ￥ {this.props.userInfo.balanceTotal}
                    </Text>
                    {this.props.userInfo.isGettingBalance ? (
                      <AnimatableImage
                        resizeMode="stretch"
                        easing="linear"
                        style={styles.refreshIcon}
                        animation="rotate"
                        duration={800}
                        source={require("../images/common/icon-refresh.png")}
                      />
                    ) : (
                      <Touch
                        onPress={() => this.props.userInfo_getBalance(true)}
                      >
                        <Image
                          style={styles.refreshIcon}
                          source={require("../images/common/icon-refresh.png")}
                        />
                      </Touch>
                    )}
                  </View>
                </View>
                <View style={styles.siginInWrap}>
                  <View style={styles.listItem}>
                    <Touch
                      onPress={() => {
                        NavigationUtil.goPage("DepositCenter");
                        PiwikAction.SendPiwik("Deposit_Home");
                      }}
                      style={styles.iconBtn}
                    >
                      <Image
                        resizeMode="stretch"
                        source={require("../images/userFianceIcon1.png")}
                        style={styles.iconBtnImg}
                      />
                      <Text style={styles.siginInText}>存款</Text>
                    </Touch>
                  </View>

                  <View style={styles.listItem}>
                    <Touch
                      onPress={() => {
                        Actions.Transfer();
                        PiwikAction.SendPiwik("Transfer_Home");
                      }}
                      style={styles.iconBtn}
                    >
                      <Image
                        resizeMode="stretch"
                        source={require("../images/userFianceIcon2.png")}
                        style={styles.iconBtnImg}
                      />
                      <Text style={styles.siginInText}>转账</Text>
                    </Touch>
                  </View>

                  <View style={styles.listItem}>
                    <Touch
                      onPress={() => {
                        Actions.withdrawal();
                        PiwikAction.SendPiwik("Withdrawal_Home");
                      }}
                      style={styles.iconBtn}
                    >
                      <Image
                        resizeMode="stretch"
                        source={require("../images/userFianceIcon3.png")}
                        style={styles.iconBtnImg}
                      />
                      <Text style={styles.siginInText}>提款</Text>
                    </Touch>
                  </View>
                </View>
              </Flex>
            ) : null}
          </WingBlank>
        </View>

        {/* 中间的Banner轮播图 */}
        <View
          style={{
            width: width,
            // height: 0.3 * (width),
            alignItems: "center",
            marginBottom: 10
          }}
        >
          {BannerFeatureEmpty ? (null) : Array.isArray(BannerFeature) && BannerFeature.length > 0 ? (
            <>
              <SnapCarousel
                ref={(c) => {
                  this._snapcarousel = c;
                }}
                data={BannerFeature}
                renderItem={this._renderBannerItem2}
                onSnapToItem={(index) => this.setState({ activeSlide2: index })}
                sliderWidth={width}
                sliderHeight={0.25 * (width)}
                itemWidth={width - 30}
                hasParallaxImages={true}
                firstItem={0}
                loop={true}
                autoplay={true}
              />
              {this.pagination2}
            </>
          ) : (
            <View style={[styles.featureWrap, { backgroundColor: "#e0e0e0" }]}>
              <LoadingBone></LoadingBone>
            </View>
          )}
        </View>

        {/* 游戏 */}
        <View style={styles.gameBox} onLayout={(e) => this.getBtnPos2(e)}>
          {Array.isArray(gameSequences) && gameSequences.length > 0 ? (
            <>
              {this.gameTab()}
              {this.gameTabContent()}
            </>
          ) : (
            <View style={styles.gameContainer}>
              <View style={styles.loadBox}>
                <LoadingBone></LoadingBone>
              </View>

              <ScrollView horizontal={true}>
                <View style={[styles.gameContent, { overflow: "hidden" }]}>
                  {Array.from({ length: 4 }, (v) => v).map((v2, i2) => {
                    return (
                      <View key={i2} style={styles.gameContetnItem}>
                        <View
                          style={[
                            styles.gameWrap,
                            { backgroundColor: "#e0e0e0" },
                          ]}
                        >
                          <LoadingBone></LoadingBone>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
  userSetting: state.userSetting,
  csCall: state.csCall,
  gameMaintainStatus: state.gameInfo.maintainStatus
});
const mapDispatchToProps = (dispatch) => ({
  userInfo_login: (username) => actions.ACTION_UserInfo_login(username),
  userInfo_getBalance: (forceUpdate = false) =>
    dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
  userInfo_updateBalance: (newBalance) =>
    dispatch(actions.ACTION_UserInfo_updateBalance(newBalance)),
  playGame: (data) => dispatch(actions.ACTION_PlayGame(data)),
  getAnnouncementPopup: (optionType, showLoading, gameData) => dispatch(actions.ACTION_GetAnnouncement(optionType, true, gameData)),
  selfExclusionsPopup: (open) =>
    dispatch(actions.ACTION_SelfExclusionsPopup(open)),
  sportGamePopup: (code) => dispatch(actions.ACTION_OpenSport(code)),
  getGameMaintainStatus: (code => dispatch(actions.ACTION_GameIsMaintain(code))),
  worldCupTabToggle: (flag) => dispatch(actions.ACTION_WorldCupTab(flag)),
  saveAviator: (data) => dispatch(actions.ACTION_AviatorGameData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  wrapper: {
    width: width,
    // height: 0.7 * (width - 15),
    marginBottom: 17,
    marginTop: height * 0.02,
    // backgroundColor: "green"
  },
  wrapperNav: {
    width: width,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  warning: {
    zIndex: 999,
    height: width / 10,
    width: width,
    paddingHorizontal: 30,
    backgroundColor: "#00A6FF",
  },
  waringBtn: {
    width: width - 60,
    flexDirection: "row",
    alignItems: "center",
  },
  warningIcon: {
    width: 16,
    height: 16,
  },
  avatarBox: {
    flex: 2,
    justifyContent: "center",
  },
  greetingText: {
    flex: 1,
    fontSize: 12,
    color: "#666666",
    marginVertical: 3,
    fontWeight: '400'
  },
  singInBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D3F0FF",
    width: 80,
    height: 40,
    marginRight: 10,
    borderRadius: 8,
  },
  setUpBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CBFFD8",
    width: 80,
    height: 40,
    borderRadius: 8,
  },
  warningT: {
    width: width - 80,
    height: 30,
  },
  warningText: {
    width: width - 80,
    color: "#fff",
    lineHeight: 30,
    paddingLeft: 5,
    // textAlign:"center"
  },
  carouselItem: {
    width: width - 60,
    height: 0.498 * (width - 60),
    borderRadius: 10,
    overflow: 'hidden'
  },
  carouselImageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    // backgroundColor: " white",
    borderRadius: 10,
  },
  carouselImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "stretch",
    width: width - 60,
    height: 0.498 * (width - 60),
    borderRadius: 10,
  },
  paginationStyle: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: width,
    // height:30,
    // backgroundColor: 'rgba(0, 0, 0, 0.75)',
    // backgroundColor: 'rgba(255, 255, 255, 0.92)'
  },
  paginationdotStyle: {
    width: 20,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    top: 25,
  },
  paginationdotStyle2: {
    width: 20,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    top: 9,
  },
  gameBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  gameContentBox: {
    // minWidth: width,
    flex: 1,
    marginHorizontal: 10,
    marginLeft: 13,
    paddingTop: 18,
    paddingBottom: 15
  },
  gameContetnItem: {
    width: 0.373 * width,
    height: 0.58 * width,
    // marginHorizontal: 5,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  gameContentImg: {
    width: 0.36 * width,
    height: 0.46 * width,
    borderRadius: 10,
  },
  gameContentTitle: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    // width: 0.373 * width,
    // position: 'absolute',
    // bottom: 5,
  },
  gameSubtitle: {
    color: "#222222",
    fontSize: 12,
    textAlign: "center",
    paddingBottom: 10,
    paddingTop: 5,
  },
  gameIntroItem: {
    width: 0.373 * width,
    height: 0.48 * width,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#F8F9FA",
    justifyContent: "space-evenly",
    marginRight: 20,
    // marginTop: 8,
  },
  gameIntroTitle: {
    color: "#00A6FF",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 11,
    fontWeight: "bold",
  },
  gameIntroSubTitle: {
    color: "#666666",
    fontSize: 10,
    textAlign: "left",
    marginBottom: 23,
  },
  gameIntroBtn: {
    color: "#666666",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 12,
  },
  gameTabbarLine: {
    // position: 'absolute',
    // left: 0,
    // bottom: 5,
    // right: 0,
    height: 2,
    width: 12,
    borderRadius: 1,
  },
  gameContainer: {
    marginHorizontal: 10,
    paddingVertical: 15,
  },
  loadBox: {
    height: 40,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
    borderRadius: 4,
    overflow: "hidden",
  },
  gameContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  gameWrap: {
    width: 0.34 * width,
    height: 0.43 * width,
    position: "relative",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  wrapper2: {
    width: width - 60,
    height: 0.498 * (width - 60),
    margin: 10,
    marginBottom: 0,
    overflow: "hidden",
    borderRadius: 6,
    alignSelf: "center",
  },
  listItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtnImg: {
    width: 40,
    height: 40,
    marginBottom: 2,
  },
  balanceWrap: {
    // alignItems: "center",
    borderRadius: 6,
    flex: 1,
  },
  siginInWrap: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
  },
  siginInText: {
    color: "#222222",
    fontSize: 10,
  },
  refreshIcon: {
    width: 16,
    height: 16,
    marginLeft: 13,
  },
  featureWrap: {
    height: featureImgHeight,
    width: width - 30,
    overflow: "hidden",
    borderRadius: 100,
  },
});
