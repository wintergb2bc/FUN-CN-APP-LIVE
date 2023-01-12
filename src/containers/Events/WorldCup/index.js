import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import Touch from 'react-native-touch-once';
import LinearGradient from "react-native-linear-gradient";
import React from 'react';
import SnapCarousel, { Pagination, ParallaxImage } from "react-native-snap-carousel";
import LoadingBone from "../../Common/LoadingBone";
import BannerAction from "../../../lib/utils/banner";
import { Actions } from "react-native-router-flux";
import { Toast } from "antd-mobile-rn";
import KickBallGame from "./KickBallGame";
import { Toasts } from "../../Toast";
import PiwikAction from "../../../lib/utils/piwik";
import CheckBox from "react-native-check-box";
import { TeamsData } from "./teamsData";
import { getDetail } from "./Common/utils";
import { labelText, openNewWindowList, openNewWindowListIOS, piwikNameMap } from "../../../lib/data/game";
import actions from "../../../lib/redux/actions";
import { connect } from "react-redux";

const { width } = Dimensions.get("window");

const bannerHeight = 0.99 * (width);
const bannerWrapperHeight = 1.12 * width;
const gameItemW = width / 1.96;
const gameItemH = 0.375 * width;
// 新聞顯示筆數
const NewsLimit = 3;
class WorldCup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainBanner: [],
      mainBannerActiveSlide: 0, //当前轮播图序号
      refreshing: false,

      newsSticky: [],
      news: [],
      
      // 遊戲相關
      poping1: 0,
      poping2: 0,
      poping3: 0,
      poping4: 0,
      poping5: 0,
      poping6: 0,
      Countdown: '00:00:00:00',
      poppingGameActive: false,//默认活动未开始
      howToModal: false,
      noPrizes: false,
      noPrizesMsg: '未中奖',
      myPrizesModal: false,
      myPrizeList: 'default',
      popingActive: false,
      onPrizes: false,
      PrizeName: '奖品',
      PrizeImg: 'CN_Freebet-18',
      onPrizesMsg: '中奖',
      PrizeBG: false,
      UserLogin: ApiPort.UserLogin,
      MemberProgress: '',//已存款状态，次数
      MemberProgressLoading: true,
      backModalBtn: '',//返回，我知道了
      nextModalBtn: '',//立即存款,一键点球
      ActiveGame: '',
      gifType: "",
      
      worldCupTeamPopup: false,
      worldCupTeams: [],
      checkedTeamsId: [],
      teamsErr: "",
      gameBanner: [],
      gameEnd: false
    };
  }

  componentDidMount() {
    if(ApiPort.UserLogin) {
      this.getCustomFlag();
    }
    // this.initPage();
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
  }

  initPage(refresh = false) {
    if (refresh) {
      this.setState({
        refreshing: true,
      });
    }
    let processed = [
      this.getBannerMain(),
      this.getBannerGame(),
      this.getNew(),
      this.getMiniGames()
    ];
    Promise.all(processed)
      .then((res) => {
        this.setState({
          refreshing: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          refreshing: false,
        });
      });
  }

  clearState = () => {
    this.setState({
      refreshing: false,
      // 遊戲相關
      poping1: 0,
      poping2: 0,
      poping3: 0,
      poping4: 0,
      poping5: 0,
      poping6: 0,
      howToModal: false,
      noPrizes: false,
      myPrizesModal: false,
      myPrizeList: 'default',
      popingActive: false,
      onPrizes: false,
      PrizeBG: false,
      backModalBtn: '',//返回，我知道了
      nextModalBtn: '',//立即存款,一键点球
      ActiveGame: '',
      gifType: "",

      worldCupTeamPopup: false,
      worldCupTeams: [],
      checkedTeamsId: [],
      teamsErr: "",
    });
  }
  
  getBannerMain() {
    const login = ApiPort.UserLogin ? "after" : "before";
    return fetch(`${window.WorldCup_Domain + ApiPort.CMS_BannerWorldCupMain}?login=${login}&displaying_webp`, {
      method: "GET",
      headers: {
        token: window.CMS_token,
      },
    })
      .then(response => response.json())
      .then((data) => {
        if (data) {
          this.setState({
            mainBanner: data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getBannerGame() {
    const login = ApiPort.UserLogin ? "after" : "before";
    return fetch(`${window.WorldCup_Domain + ApiPort.CMS_BannerWorldCupGame}?login=${login}&displaying_webp`, {
      method: "GET",
      headers: {
        token: window.CMS_token,
      },
    })
      .then(response => response.json())
      .then((data) => {
        if (data) {
          this.setState({ 
            gameBanner: data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }


  getNew() {
    global.storage
      .load({
        key: "worldCupNews",
        id: "worldCupNews",
      })
      .then((data) => {
        if (data.length) {
          this.setState(
            {
              news: data.filter(v => !v.sticky),
              newsSticky: data.filter(v => v.sticky),
            },
          );
        }
      });

    return fetch(`${window.WorldCup_Domain + ApiPort.worldCupNews}`, {
      method: "GET",
      headers: {
        token: window.CMS_token,
      },
    })
      .then(response => response.json())
      .then((res) => {
        if (res) {
          const data = res.data;
          this.setState({
            news: data.filter(v => !v.sticky),
            newsSticky: data.filter(v => v.sticky),
            // BannerFeatureEmpty: data.length === 0
          });
          global.storage.save({
            key: "worldCupNews",
            id: "worldCupNews",
            data: data,
            expires: null,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // banner
  _renderBannerItem = ({ item, index }, parallaxProps) => {
    // console.log('home_main_banner', item, index)
    return (
      <Touch
        key={index}
        onPress={() => {
          console.log('item ',item)
          BannerAction.onBannerClick(item, "worldCup");
          const action = item.action;
          if(action.actionName === "Match"){
            PiwikEvent('Game', 'View', `${action?.matchInfo?.match_id}_IMSP_WCPage2022`);
          }else{
            PiwikEvent('Promo Nav', 'View', `${action?.ID}_PromoTnC_WCPage2022`);
          }
        }}
        // onPress={() => this.JumtProm(item, index)}
        style={styles.carouselItem}
      >
        <ParallaxImage
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

  _renderNewBannerItem = ({ item, index }, parallaxProps) => {
    // console.log('home_main_banner', item, index)
    if (!item.thumbnail) {
      return null;
    }
    return (
      <View style={{ position: "relative" }}>
        <Touch
          key={index}
          onPress={() => getDetail(item)}
          style={styles.carouselItem2}
        >
          <ParallaxImage
            source={{ uri: item.thumbnail }}
            containerStyle={styles.carouselImageContainer}
            style={styles.carouselImage}
            parallaxFactor={0}
            {...parallaxProps}
          />
          <LinearGradient
            colors={[
              "transparent",
              "rgba(0, 0, 0, 0.4)",
              "rgba(0, 0, 0, 0.4)",
            ]}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              bottom: 0,
              position: "absolute",
              width: width - 60,
              height: 50,
              // backgroundColor: "rgba(0, 0, 0,0.2)",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              zIndex: 99999,
              paddingHorizontal: 20
            }}
          >
            <Text style={{
              color: "#fff",
              fontSize: 12,
              fontWeight: "bold",
              zIndex: 99,
              // textAlign: "left",
              // alignItems: "center"
            }}>{item.title}</Text>
          </LinearGradient>
        </Touch>
        {!!(item.video) && (
          <View
            style={{
              position: "absolute",
              top: 16,
              left: 20,
              zIndex: 100,
              width: 24,
              height: 24,
              backgroundColor: "rgba(0, 0, 0,0.5)",
              borderRadius: 24 / 2,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image style={{ width: 16, height: 16 }} source={require('../../../images/worldCup/Icon-Video.png')}/>
          </View>
        )}
      </View>
    );
  };

  get pagination() {
    const { mainBanner, mainBannerActiveSlide } = this.state;
    return (
      <Pagination
        dotsLength={mainBanner.length}
        activeDotIndex={mainBannerActiveSlide}
        containerStyle={styles.paginationStyle}
        dotStyle={styles.paginationdotStyle}
        inactiveDotStyle={styles.paginationdotStyle2}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    );
  }

  refreshPage = () => {
    this.initPage(true);
  }

  titleUI = (title = "") => {
    return (
      <View style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 26,
        flexDirection: "row"
      }}>
        <View style={[styles.diamond2, { marginRight: 10 }]}/>
        <View style={styles.diamond}/>
        <Text style={{ color: "#FFE786", fontWeight: "bold", fontSize: 18, paddingHorizontal: 15 }}>{title}</Text>
        <View style={[styles.diamond, { marginRight: 10 }]}/>
        <View style={styles.diamond2}/>
      </View>
    );
  }
  
  getCustomFlag() {
    // Toast.loading("加载中,请稍候...", 20);
    fetchRequest(ApiPort.CustomFlag + 'flagKey=TeamPreferenceWC22&', 'GET')
      .then(res => {
        if (res.isSuccess && res.result && res.result.worldCupTeamPreference) {
          this.setState({
            worldCupTeamPopup: true
          }, () => {
            this.getWorldCupTeams();
          });
        }

      })
      .catch(err => {
        // Toasts.fail('系统出现错误，请联系客服', 2);
        // Toast.hide();
      });
  }

  getWorldCupTeams() {
    fetchRequest(ApiPort.worldCupTeams, "GET")
      .then(res => {
        if (res.isSuccess && res.result) {
          this.setState({
            worldCupTeams: res.result
          });
        }
      })
      .catch(err => {
      });
  }

  //获取活动开始时间，id
  getMiniGames() {
    // Toast.loading("加载中,请稍候...", 20);
    fetchRequest(ApiPort.MiniGamesActiveGame, "GET")
      .then(res => {
        Toast.hide();
        if (res.isSuccess && res.result) {
          this.setState({ ActiveGame: res.result }, () => {
            this.isPoppingGameStart();
            if (this.state.UserLogin) {
              this.getMemberProgress();
            }
          });
        }
      })
      .catch(err => {
        // Toasts.fail('系统出现错误，请联系客服', 2);
        this.errorHandle(err);
        // Toast.hide();
      });
  }

  errorHandle = (res) => {
    console.log('errorHandle');
    console.log(res);
    let backModalBtn = '';
    let nextModalBtn = '';
    //未中奖
    let errorCode = res.errors ? res.errors[0].errorCode : '';
    let noPrizesMsg = '未中奖';

    if (errorCode == 'MG99998') {
      // 活動已結束
      this.setState({ gameEnd: true });
      this.getMemberProgress();
      return;
    }

    if (errorCode == 'MG00012') {
      noPrizesMsg = `存款 300 元即可获取 1 次参与游戏的机会！\n存得越多，机会越多`;
      backModalBtn = '返回';
      nextModalBtn = '立即存款';

    } else if (errorCode == 'MG00004') {
      noPrizesMsg = `您今日的存款不足 300 元， \n请先存款后再次参与游戏。`;
      backModalBtn = '返回';
      nextModalBtn = '立即存款';

    } else if (errorCode == 'MG00001') {
      noPrizesMsg = `抱歉，您目前还不能参加游戏，\n请等待您的存款通过审核。`;
      backModalBtn = '我知道了';


    } else if (errorCode == 'MG00002') {
      noPrizesMsg = `您的游戏次数已用完，请存款后再试。`;
      backModalBtn = '返回';
      nextModalBtn = '立即存款';

    } else if (errorCode == 'MG00003') {
      noPrizesMsg = `您今天的游戏次数已用完，请明天再试。`;
      backModalBtn = '我知道了';

    } else if (errorCode == 'MG00009') {
      // 需要判断remainingGrabFromCurrentTier，remainingGrabFromHighestTier
      this.getMemberProgress('MG00009');
      return;
    } else if (errorCode == 'MG00005') {
      noPrizesMsg = `抱歉，来晚一步，奖品被抢完了`;
      backModalBtn = '我知道了';

    } else {
      noPrizesMsg = `系统出现错误，请联系客服`;
      backModalBtn = '我知道了';

    }
    this.setState({
      noPrizes: true,
      noPrizesMsg,
      backModalBtn,
      nextModalBtn,
    });
    this.getMemberProgress();
  }

  //是否开始，结束
  isPoppingGameStart() {
    const startTime = this.state.ActiveGame.eventStartDate.replace('T', ' ').replace(/\-/g, '/') + ' +08:00'; //开始时间
    const endTime = this.state.ActiveGame.eventEndDate.replace('T', ' ').replace(/\-/g, '/') + ' +08:00'; //结束时间

    let startNow = parseInt(new Date(startTime).getTime() - new Date().getTime());
    let startEnd = parseInt(new Date(startTime).getTime() - new Date(endTime).getTime());
    let nowEnd = parseInt(new Date(endTime).getTime() - new Date().getTime());
    let times = false;
    if (startNow > 0) {
      //活动未开赛
      times = startNow;
    } else if (nowEnd > 0) {
      //活动未结束
      times = nowEnd;
      this.setState({ poppingGameActive: true });
    } else {
      this.setState({ gameEnd: true });
    }
    this.Countdown(times);
  }

  //倒计时处理
  Countdown(time) {
    if (!time) {
      return;
    }

    // let time = 300;
    //结束时间戳,防止app后台setInterval没有执行，
    let afterMinutes5 = new Date().getTime() + time;

    let d, h, m, s, dhms;
    this.Countdowns = setInterval(() => {
      time = parseInt((afterMinutes5 - (new Date().getTime())) / 1000);
      d = parseInt(time / (60 * 60 * 24));
      h = parseInt(time / (60 * 60) % 24);
      m = parseInt(time / 60 % 60);
      s = parseInt(time % 60);
      d = d < 10 ? "0" + d.toString() : d;
      h = h < 10 ? "0" + h.toString() : h;
      m = m < 10 ? "0" + m.toString() : m;
      s = s < 10 ? "0" + s.toString() : s;

      dhms = d + ":" + h + ":" + m + ":" + s;

      this.setState({ Countdown: dhms });

      if (d < 1 && h < 1 && m < 1 && s < 1) {
        this.setState({ poppingGameActive: false, popingActive: false });
        this.clearIntervals();
      }
    }, 1000);
  }

  //获取存款次数，金额，抽奖次数
  getMemberProgress(errCode = '') {
    if (!ApiPort.UserLogin || !this.state.ActiveGame.promoId) {
      window.getMiniGames = true;
      this.setState({ MemberProgress: '', MemberProgressLoading: false });
      return;
    }

    errCode == 'click' && this.setState({ MemberProgress: '', MemberProgressLoading: true });

    fetchRequest(`${ApiPort.MemberProgress}promoId=${this.state.ActiveGame.promoId}&`, "GET")
      .then(res => {
        let result = res.result || '';
        if (res.isSuccess && result) {
          this.setState({
            MemberProgress: result,
            MemberProgressLoading: false
          });
          if (errCode == 'MG00009') {
            Toast.hide();
            let noPrizesMsg = '未中奖';
            let backModalBtn = '';
            let nextModalBtn = '';
            if (result.remainingGrabFromCurrentTier > 0) {
              noPrizesMsg = `很遗憾您的奖品是空的，请再接再厉！\n今天剩余 -${result.remainingGrabFromCurrentTier}- 次参与游戏的机会。`;
              backModalBtn = '返回';
              nextModalBtn = '一键点球';

            } else if (result.remainingGrabFromCurrentTier == 0 && result.remainingGrabFromHighestTier > 0) {
              noPrizesMsg = `很遗憾您的奖品是空的，请再接再厉！\n您参与游戏的次数已用完，请存款后再试。`;
              backModalBtn = '返回';
              nextModalBtn = '立即存款';

            } else if (result.remainingGrabFromCurrentTier == 0 && result.remainingGrabFromHighestTier == 0) {
              noPrizesMsg = `很遗憾您的奖品是空的，请再接再厉！\n您今日参与游戏的次数已用完，请明天再试。`;
              backModalBtn = '我知道了';

            }
            this.setState({ noPrizes: true, noPrizesMsg, nextModalBtn, backModalBtn });
          }
        }
      })
      .catch(err => {
        this.setState({
          MemberProgressLoading: false
        });
        // Toasts.fail('系统出现错误，请联系客服', 2);
      });
  }

  nextModalBtn(key) {
    if (key == '立即存款') {
      this.clearState();
      Actions.home1();
      Actions.DepositCenter();
      PiwikAction.SendPiwik("Deposit_WC2022");
    } else {
      //自动获取
      this.setState({ onPrizes: false, noPrizes: false, PrizeBG: false });
      this.SnatchPrize();
      PiwikAction.SendPiwik("GrabMore_WC2022");
    }
  }

  UserLogin() {
    if (!window.ApiPort.UserLogin) {
      Actions.Login({ from: 'worldCup' });
      Toasts.fail('请先登录', 2);
      window.getMiniGames = true;
      return false;
    }
    return true;
  }

  //抽奖api
  SnatchPrize() {
    PiwikAction.SendPiwik("SpinLuckyWheel_MidAutumn2022");
    if (!this.UserLogin()) {
      return;
    }
    
    this.setState({
      wheelClick: true,
    });
    Toast.loading("请稍候...", 20);
    fetchRequest(`${ApiPort.SnatchPrize}promoId=${this.state.ActiveGame.promoId}&`, "POST")
      .then(res => {

        let backModalBtn = '';
        let nextModalBtn = '';
        if (res.isSuccess) {
          console.log(1)

          //中奖
          let result = res.result;
          let onPrizesMsg = '中奖';

          if (result.remainingGrabFromCurrentTier > 0) {
            onPrizesMsg = `今天剩余 -${result.remainingGrabFromCurrentTier}- 次游戏次数。`;
            backModalBtn = '返回';
            nextModalBtn = '一键点球';

          } else if (result.remainingGrabFromHighestTier > 0) {
            onPrizesMsg = `您的游戏次数已用完，请存款后再试。`;
            backModalBtn = '返回';
            nextModalBtn = '立即存款';

          } else if (result.remainingGrabFromHighestTier == 0) {
            onPrizesMsg = `您今天的游戏次数已用完，请明天再试。`;
            backModalBtn = '我知道了';
          }

          if (result.prizeType == 1 || result.prizeType == 3 || result.prizeType == 4 || result.prizeType == 5) {
            this.rotateSpin(result, onPrizesMsg);
          } else if (result.prizeType == 2) {
            //免费旋转

          }

        } else {
          //未中奖
          let errorCode = res.errors ? res.errors[0].errorCode : '';
          let noPrizesMsg = '未中奖';
          console.log(errorCode)
          if (errorCode == 'MG00012') {
            noPrizesMsg = `存款 300 元即可获取 1 次参与游戏的机会！\n存得越多，机会越多`;
            backModalBtn = '返回';
            nextModalBtn = '立即存款';

          } else if (errorCode == 'MG00004') {
            noPrizesMsg = `您今日的存款不足 300 元， \n请先存款后再次参与游戏。`;
            backModalBtn = '返回';
            nextModalBtn = '立即存款';

          } else if (errorCode == 'MG00001') {
            noPrizesMsg = `抱歉，您目前还不能参加游戏，\n请等待您的存款通过审核。`;
            backModalBtn = '我知道了';


          } else if (errorCode == 'MG00002') {
            noPrizesMsg = `您的游戏次数已用完，请存款后再试。`;
            backModalBtn = '返回';
            nextModalBtn = '立即存款';

          } else if (errorCode == 'MG00003') {
            noPrizesMsg = `您今天的游戏次数已用完，请明天再试。`;
            backModalBtn = '我知道了';

          } else if (errorCode == 'MG00009') {
            // 需要判断remainingGrabFromCurrentTier，remainingGrabFromHighestTier
            this.getMemberProgress('MG00009');
            return;
          } else if (errorCode == 'MG00005') {
            noPrizesMsg = `抱歉，来晚一步，奖品被抢完了`;
            backModalBtn = '我知道了';

          } else {
            noPrizesMsg = `系统出现错误，请联系客服`;
            backModalBtn = '我知道了';

          }
          this.setState({
            noPrizes: true,
            noPrizesMsg,
          });

        }
        this.setState({
          backModalBtn,
          nextModalBtn,
        });
        Toast.hide();
        this.getMemberProgress();
      })
      .catch(err => {
        Toast.hide();
        this.errorHandle(err);
        // Toasts.fail('系统出现错误，请联系客服', 2)
      })
      .finally(() => {
        this.setState({
          wheelClick: false,
        });
      });

  }

  // 旋转转盘
  rotateSpin = (data, onPrizesMsg = "") => {

    if (Object.keys(data).length === 0) {
      Toast.fail("Error");
      console.log('result為空');
      return;
    }

    //1 免费彩金，3 乐币，4 神秘奖 5空獎
    const { prizeType } = data;
    switch (prizeType) {
      case 1 || 3 || 4:
        this.setState({
          gifType: Math.random() < 0.5 ? "winGif1" : "winGif2"
        });
        break;
      case 5:
        this.setState({
          gifType: "loss"
        });
        break;
      default:
        break;
    }

    setTimeout(() => {
      if (prizeType == 5) {
        //空奖
        this.setState({
          noPrizes: true,
          noPrizesMsg: `很遗憾您的奖品是空的，请再接再厉！`,
          backModalBtn: '我知道了'
        });
        return;
      }

      // 恭喜获取到奖品
      this.youWin(data, onPrizesMsg);
    }, 1200);
  };

  closePrizeModal() {
    this.setState({ noPrizes: false });
  }

  closePrizeBGModal() {
    this.setState({ onPrizes: false, PrizeBG: false });
  }

  youWin = (result, onPrizesMsg = "") => {
    let imgs = ['', 'Freebet', '', 'RewardPts', 'MysteryGift'];
    let PrizeImg = 'CN_' + imgs[result.prizeType];
    let PrizeName = this.getPrizeName(result);
    this.setState({
      PrizeName,
      PrizeImg,
      onPrizes: true,
      onPrizesMsg,
      gifType: ""
    }, () => {
      setTimeout(() => {
        this.setState({ PrizeBG: true });
      }, 1200);
    });
  }

  getPrizeName(result) {
    return result.prizeType == 4 ? '神秘惊喜' : result.actualPrizeValue + ' ' + result.prizeTypeDesc;
  }

  setCheckTeams = (id) => {
    const { checkedTeamsId } = this.state;
    let copy = [...checkedTeamsId]
    
    const index = copy.indexOf(id);
    if (index === -1) {
      copy.push(id)
      this.setState({ checkedTeamsId: copy }, ()=>{});
    } else {
      copy.splice(index, 1)
      this.setState({ checkedTeamsId: copy },()=>{});
    }
  }

  postTeamPreferences = (type) => {
    const { checkedTeamsId } = this.state;
    const teamsId = type === "cancel" ? [0] : checkedTeamsId;

    if(type !== "cancel" && (checkedTeamsId.length > 3 || checkedTeamsId.length === 0)){
      this.setState({ teamsErr: "请至少选择一个球队，最多3个球队" });
      return;
    }
    
    Toast.loading('提交中,请稍候...', 2000);    
    fetchRequest(ApiPort.TeamPreferences + `teamIds=${teamsId.join(",")}&`, 'POST')
      .then(res => {
        if(res.isSuccess && res.result) {
          Toasts.success("成功", 2);
        } else{
          Toasts.fail('系统出现错误', 2);
        }
      })
      .catch(err => {
        console.log(err)
        Toasts.fail('系统出现错误', 2);
      }).finally(()=>{
        Toast.hide();
        this.setState({
            worldCupTeamPopup: false
          })
    });
  }

  onLoadMore() {
    if(this.state.news.length === 0){
      return;
    }
    Actions.WorldCupNew({ news: this.state.news, newsSticky: this.state.newsSticky})
  }

  render() {
    window.refreshingWorldCup = () => {
      this.initPage();
    };
    const { mainBanner, refreshing, newsSticky, news } = this.state;
    const {
      Countdown,
      howToModal,
      noPrizes,
      noPrizesMsg,
      myPrizesModal,
      myPrizeList,
      onPrizes,
      PrizeName,
      PrizeImg,
      PrizeBG,
      onPrizesMsg,
      MemberProgress,
      MemberProgressLoading,
      backModalBtn,
      nextModalBtn,
      UserLogin,
      rotateDeg,
      poppingGameActive,
      gifType,
      worldCupTeams,
      checkedTeamsId,
      worldCupTeamPopup,
      ActiveGame,
      gameBanner,
      gameEnd
    } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: '#012557' }}>
        <Modal
          animationType="none"
          transparent={true}
          visible={worldCupTeamPopup}
          onRequestClose={() => {
          }}
        >
          <View style={styles.modalMaster}>
            <View style={styles.modalView}>
              <View style={styles.modalTitle}>
                <Text style={[styles.modalTitleTxt, {
                  fontWeight: 'bold',
                  fontSize: 16,
                }]}>请选择您支持的3个世界杯球队</Text>
              </View>
              <ScrollView
                style={{
                  paddingHorizontal: 24,
                  paddingTop: 24,
                  marginBottom: 24,
                  height: 303,
                }}
                contentContainerStyle={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {worldCupTeams.length > 0 && worldCupTeams.map(v => {
                  if(!v.id) return null;
                  const getTeam = TeamsData.filter(a => a.englishName === v.englishName)[0]
                  const imgSrc = getTeam?.imgSrc ? getTeam.imgSrc : require("../../../images/worldCup/flags/Netherlands.jpg")
                  return (
                    <CheckBox
                      key={v.id}
                      style={styles.checkBoxFlex}
                      onClick={()=>this.setCheckTeams(v.id)}
                      isChecked={checkedTeamsId.includes(v.id)}
                      rightTextView={<View style={{ flexDirection: "row"}}>
                        <Image
                          resizeMode="stretch"
                          source={imgSrc}
                          style={{ width: 24, height: 16, marginRight: 8, marginLeft: 16 }}
                        />
                        <Text>{v.localizedName}</Text>
                      </View>}
                      checkedCheckBoxColor={"#00A6FF"}
                      uncheckedCheckBoxColor={"#E6E6EB"}
                    />
                    // <Touch
                    //   onPress={() => {
                    //     this.setCheckTeams(v.id)
                    //   }}
                    //   style={styles.checkBoxFlex}
                    // >
                    //   {!checkedTeamsId.includes(v.id) && (
                    //     <View
                    //       style={{ width: 20, height: 20, borderWidth: 1, borderColor: "#E6E6EB", borderRadius: 4 }}>
                    //
                    //     </View>
                    //   )}
                    //   {checkedTeamsId.includes(v.id) && (
                    //     <Image
                    //       resizeMode="stretch"
                    //       source={require("../../../images/chengk.png")}
                    //       style={{ width: 20, height: 20 }}
                    //     />
                    //   )}
                    //   <Text style={{ color: "#666", paddingLeft: 8, fontSize: 14 }}>
                    //     {v.localizedName}
                    //   </Text>
                    // </Touch>
                  )
                })}
              </ScrollView>
              {this.state.teamsErr !== "" && (
                <View style={{justifyContent: "flex-start", alignItems: "flex-start", width: "100%", paddingLeft: 24, marginBottom: 18}}>
                  <Text style={{color:"#FF0000", fontSize: 12}}>{this.state.teamsErr}</Text>
                </View>
              )}
              <View style={styles.modalBtn}>
                <TouchableOpacity onPress={() => {
                  this.postTeamPreferences('cancel')
                  this.setState({ worldCupTeamPopup: false });
                }} style={styles.modalBtnL}>
                  <Text style={{ color: '#00A6FF', fontWeight: 'bold', fontSize: 16 }}>不用了</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.postTeamPreferences()
                }} style={styles.modalBtnR}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>提交</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <ScrollView style={{ flex: 1 }}
                    refreshControl={
                      <RefreshControl refreshing={refreshing} tintColor={"#fff"}
                                      onRefresh={() => this.refreshPage()}/>
                    }>
          <ImageBackground
            source={require('../../../images/worldCup/BG_2.png')}
            resizeMode='cover'
            style={[styles.bannerWrapper, { paddingBottom: 27, alignItems: "center", }]}>
            {Array.isArray(mainBanner) && mainBanner.length > 0 ? (
              <>
                <SnapCarousel
                  data={mainBanner}
                  renderItem={this._renderBannerItem}
                  onSnapToItem={(index) => this.setState({ mainBannerActiveSlide: index })}
                  sliderWidth={width}
                  sliderHeight={width}
                  itemWidth={width - 60}
                  hasParallaxImages={true}
                  firstItem={0}
                  loop={true}
                  autoplay={true}
                />
                {this.pagination}
              </>
            ) : (
              <View style={[styles.carouselItem, {
                backgroundColor: "#e0e0e0",
                justifyContent: "center",
                alignItems: "center",
              }]}>
                <LoadingBone></LoadingBone>
              </View>
            )}
          </ImageBackground>

          <ImageBackground
            source={require('../../../images/worldCup/BG_1.png')}
            resizeMode='cover'
            style={[styles.bannerWrapper, { alignItems: "center" }]}
          >

            {this.titleUI("点球大战")}

            <KickBallGame
              Countdown={Countdown}
              howToModal={howToModal}
              noPrizes={noPrizes}
              noPrizesMsg={noPrizesMsg}
              myPrizesModal={myPrizesModal}
              myPrizeList={myPrizeList}
              onPrizes={onPrizes}
              PrizeName={PrizeName}
              PrizeImg={PrizeImg}
              PrizeBG={PrizeBG}
              onPrizesMsg={onPrizesMsg}
              MemberProgress={MemberProgress}
              MemberProgressLoading={MemberProgressLoading}
              backModalBtn={backModalBtn}
              nextModalBtn={nextModalBtn}
              UserLogin={UserLogin}
              rotateDeg={rotateDeg}
              poppingGameActive={poppingGameActive}
              gameEnd={gameEnd}
              gifType={gifType}
              ActiveGame={ActiveGame}
              SnatchPrize={() => this.SnatchPrize()}
              closePrizeModal={() => this.closePrizeModal()}
              closePrizeBGModal={() => this.closePrizeBGModal()}
              nextModalBtnFn={(key) => this.nextModalBtn(key)}
              getMemberProgress={(code) => this.getMemberProgress(code)}
            />

          </ImageBackground>

          <ImageBackground
            source={require('../../../images/worldCup/BG_2.png')}
            resizeMode='cover'
            style={styles.bannerWrapper}>

            {this.titleUI("其他游戏")}

            <ScrollView horizontal={true}>
              {gameBanner.length > 0 && gameBanner.map((v, index) => {
                return (
                  <Touch
                    style={{
                      width: gameItemW,
                      height: gameItemH,
                      marginRight: 6,
                      borderRadius: 8,
                      marginLeft: index === 0 ? 16 : 0,
                    }}
                    key={index}
                    onPress={() => {
                      BannerAction.onBannerClick(v);
                      const action = v.action;
                      PiwikEvent('Game', 'Launch', `${action?.gameId}_${action?.cgmsVendorCode}_WCPage2022`);
                    }}
                  >
                    <Image
                      resizeMode="cover"
                      style={[styles.gameImg]}
                      source={{ uri: v.cmsImageUrl }}
                      defaultSource={require("../../../images/worldCup/Default-Banner-Games_CN.jpg")}
                    />
                  </Touch>
                );
              })}
            </ScrollView>
          </ImageBackground>

          <ImageBackground
            source={require('../../../images/worldCup/BG_1.png')}
            resizeMode='cover'
            style={styles.bannerWrapper}>

            {this.titleUI("新闻")}

            <SnapCarousel
              ref={(c) => {
                this._snapcarousel = c;
              }}
              data={newsSticky}
              renderItem={this._renderNewBannerItem}
              onSnapToItem={(index) => this.setState({ activeSlide: index })}
              sliderWidth={width}
              // sliderHeight={0.52 * (width - 60)}
              itemWidth={width - 60}
              hasParallaxImages={true}
              firstItem={0}
              loop={true}
              autoplay={true}
            />

            <View style={{ marginTop: 18, paddingHorizontal: 20 }}>
              {news.length > 0 && news.slice(0, NewsLimit).map((v, index) => {
                const isLast = news.length === index + 1;
                return (
                  <Touch onPress={() => {
                    getDetail(v);
                  }} key={index} style={{ flexDirection: "row", marginBottom: 10 }}>
                    <View style={{ flex: 1, borderRadius: 5 }}>
                      <Image style={{ width: 100, height: 60, borderRadius: 5 }}
                             source={{ uri: v.thumbnail }}
                             defaultSource={require("../../../images/loadIcon/loadingdark.jpg")}/>
                    </View>
                    <View style={{
                      flex: 2,
                      justifyContent: "space-between",
                      borderBottomColor: "#4E678A",
                      borderBottomWidth: isLast ? 0 : 1,
                      paddingBottom: 10
                    }}>
                      <Text style={{ fontSize: 12, lineHeight: 18, color: "#fff" }}>{v.title}</Text>
                      <Text style={{ fontSize: 10, lineHeight: 18, color: "#8396B0" }}>{v.updatedDate}</Text>
                    </View>
                  </Touch>
                );
              })}
              {news.length > 0 && news.length > NewsLimit && (
                <Touch
                  style={{
                    height: 44,
                    width: "100%",
                    backgroundColor: "#FFE05C",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 8
                  }}
                  onPress={()=>this.onLoadMore()}
                >
                  <Text style={{ color: "#000000", fontSize: 16, fontWeight: "bold" }}>查看更多</Text>
                </Touch>
              )}
            </View>
            <Text style={{ color: "#A1B3CC", fontSize: 10, marginTop: 42, marginBottom: 31, textAlign: "center" }}>Copyright
              © FUN88 2008-2022. All rights reserved.</Text>

          </ImageBackground>
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  bannerWrapper: {
    width: width,
    // height: bannerWrapperHeight,
    paddingBottom: 17,
  },
  bannerWrapper2: {
    width: width,
    // height: bannerWrapperHeight,
    paddingBottom: 17,
  },
  carouselItem: {
    width: width - 60,
    height: bannerHeight,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 15
  },
  carouselItem2: {
    width: width - 60,
    height: 0.498 * (width - 60),
    borderRadius: 10,
    position: "relative",
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
    bottom: -4,
    width: width,
    // paddingVertical: 25,
    // height:30,
    // backgroundColor: 'rgba(0, 0, 0, 0.75)',
    // backgroundColor: 'rgba(255, 255, 255, 0.92)'
  },
  paginationdotStyle: {
    width: 16,
    height: 4,
    backgroundColor: "#FFE786",
    marginHorizontal: -5,
    top: 15,
  },
  paginationdotStyle2: {
    width: 4,
    height: 4,
    borderRadius: 1000,
    backgroundColor: "#B8B8B8",
    top: 15,
  },
  diamond: {
    width: 10,
    height: 10,
    backgroundColor: "#FFE786",
    transform: [{ rotate: "45deg" }],
  },
  diamond2: {
    width: 7,
    height: 7,
    backgroundColor: "#FFE786",
    transform: [{ rotate: "45deg" }],
  },
  modalMaster: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0,0.5)',
  },
  modalView: {
    width: width * 0.95,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingBottom: 15,
  },
  modalTitle: {
    width: width * 0.95,
    backgroundColor: '#00A6FF',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  modalTitleTxt: {
    lineHeight: 44,
    textAlign: 'center',
    color: '#fff',
  },
  modalBtn: {
    width: width * 0.95,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalBtnL: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00A6FF',
    width: width * 0.4,
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnR: {
    borderRadius: 5,
    backgroundColor: '#00A6FF',
    width: width * 0.4,
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxFlex: {
    display: "flex",
    // justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: '50%',
    marginBottom: 20
  },
  gameImg: {
    width: gameItemW,
    height: gameItemH,
    borderRadius: 8,
  },
});

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});
const mapDispatchToProps = (dispatch) => ({
  playGame: (data) => dispatch(actions.ACTION_PlayGame(data)),
  getAnnouncementPopup: (optionType) => dispatch(actions.ACTION_GetAnnouncement(optionType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorldCup);
