import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground, Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Modals from 'react-native-modal';
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';
import { Toast } from "antd-mobile-rn";
import AnimatedTurnTableDrawPage from "./Turntable";
import PiwikAction from "../../../lib/utils/piwik";

const {
  width,
  height
} = Dimensions.get('window');


const prizeList = {
  'CN_Freebet-18': require("../../../images/minGame/prizes/CN_Freebet-18.png"),
  'CN_Freebet-28': require("../../../images/minGame/prizes/CN_Freebet-28.png"),
  'CN_Freebet-58': require("../../../images/minGame/prizes/CN_Freebet-58.png"),
  'CN_Freebet-88': require("../../../images/minGame/prizes/CN_Freebet-88.png"),
  'CN_Freebet-128': require("../../../images/minGame/prizes/CN_Freebet-128.png"),
  'CN_Freebet-188': require("../../../images/minGame/prizes/CN_Freebet-188.png"),
  'CN_Freebet-288': require("../../../images/minGame/prizes/CN_Freebet-288.png"),
  'CN_Freebet-588': require("../../../images/minGame/prizes/CN_Freebet-588.png"),
  'CN_RewardPts-28': require("../../../images/minGame/prizes/CN_RewardPts-28.png"),
  'CN_RewardPts-58': require("../../../images/minGame/prizes/CN_RewardPts-58.png"),
  'CN_RewardPts-88': require("../../../images/minGame/prizes/CN_RewardPts-88.png"),
  'CN_RewardPts-128': require("../../../images/minGame/prizes/CN_RewardPts-128.png"),
  'CN_RewardPts-288': require("../../../images/minGame/prizes/CN_RewardPts-288.png"),
  'CN_RewardPts-588': require("../../../images/minGame/prizes/CN_RewardPts-588.png"),
  CN_MysteryGift: require("../../../images/minGame/prizes/CN_MysteryGift.png"),
};

class PoppingGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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
      nextModalBtn: '',//立即存款,继续自动获取
      ActiveGame: '',

      rounds: 1,//转圈的圈数
      rotateDeg: new Animated.Value(0),//选择角度,
      wheelClick: false
    };


  }

  componentWillMount() {
    this.getMiniGames();
  }

  componentWillUnmount() {
    this.clearIntervals();
  }

  clearIntervals() {
    this.Countdowns && clearInterval(this.Countdowns);
  }

  //获取活动开始时间，id
  getMiniGames() {
    Toast.loading("加载中,请稍候...", 20);
    fetchRequest(ApiPort.MiniGamesActiveGame, "GET")
      .then(res => {
        Toast.hide();
        if (res.isSuccess && res.result) {
          this.setState({ ActiveGame: res.result }, () => {
            this.isPoppingGameStart();
          });
        }
      })
      .catch(err => {
        // Toasts.fail('系统出现错误，请联系客服', 2);
        this.errorHandle(err);
        Toast.hide();
      });
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
      this.MemberProgressLoadingDone();
    } else if (nowEnd > 0) {
      //活动未结束
      times = nowEnd;
      this.setState({ poppingGameActive: true, popingActive: true }, () => {
        this.getMemberProgress();
      });
    } else {
      this.MemberProgressLoadingDone();
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


  getPrizeName(result) {
    return result.prizeType == 4 ? '神秘惊喜' : result.actualPrizeValue + ' ' + result.prizeTypeDesc;
  }

  //抽奖api
  SnatchPrize() {
    PiwikAction.SendPiwik("SpinLuckyWheel_MidAutumn2022");
    if (!this.UserLogin()) {
      return;
    }

    // let res = {
    //   "result":{
    //     "prizeStatus":3,
    //     "prizeStatusDesc":"完成120.50 / 200.00流水以获取",
    //     "applyDate":"2022-02-01T00:00:00.000Z",
    //     "prizeId":1,
    //     "prizeName":"88 乐币",
    //     "actualPrizeValue":88,
    //     "prizeType":3,
    //     "prizeTypeDesc":"乐币",
    //     "platform":"Android",
    //     "remainingGrabFromCurrentTier":0,
    //     "remainingGrabFromHighestTier":3
    //   },
    //   "isSuccess":true
    // };
    this.setState({
      wheelClick: true,
    });
    Toast.loading("请稍候...", 20);
    fetchRequest(`${ApiPort.SnatchPrize}promoId=${this.state.ActiveGame.promoId}&`, "POST")
      .then(res => {

        let backModalBtn = '';
        let nextModalBtn = '';
        if (res.isSuccess) {
          //中奖
          let result = res.result;
          let onPrizesMsg = '中奖';

          if (result.remainingGrabFromCurrentTier > 0) {
            onPrizesMsg = `今天剩余 -${result.remainingGrabFromCurrentTier}- 次游戏次数。`;
            backModalBtn = '返回';
            nextModalBtn = '继续自动获取';

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

          } else if (errorCode == 'MG99998') {
            noPrizesMsg = `抱歉，该活动已结束，\n请期待我们的下一个活动`;
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

  errorHandle = (res) => {
    console.log('errorHandle');
    console.log(res);
    let backModalBtn = '';
    let nextModalBtn = '';
    //未中奖
    let errorCode = res.errors ? res.errors[0].errorCode : '';
    let noPrizesMsg = '未中奖';

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

    } else if (errorCode == 'MG99998') {
      noPrizesMsg = `抱歉，该活动已结束，\n请期待我们的下一个活动`;
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

  getObjKey(obj, value) {
    return Object.keys(obj).find(key => {
      if (obj[key].includes(value)) {
        return key;
      }
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
    const { prizeType, actualPrizeValue = "" } = data;

    // 旋轉停的位置
    let prizePos = -1;

    switch (prizeType) {
      case 1:
        if (actualPrizeValue < 100) {
          prizePos = Math.random() < 0.5 ? 1 : 7;
        } else if (actualPrizeValue < 300) {
          prizePos = Math.random() < 0.5 ? 3 : 5;
        } else {
          prizePos = 6;
        }
        break;
      case 3:
        prizePos = Math.random() < 0.5 ? 2 : 4;
        break;
      case 4:
        prizePos = 0;
        break;
      case 5:
        prizePos = (Math.floor(Math.random()*(1-7+1))+7)+0.5;
        break;
      default:
        break;
    }

    let oneTimeRotate = ((prizePos) / 8 + 3 * this.state.rounds);
    Animated.timing(this.state.rotateDeg, {
      toValue: oneTimeRotate,
      duration: 5000,
      easing: Easing.out(Easing.quad)
    }).start(() => {
      // 每抽一次rounds+1,为了转盘能继续顺时针转3圈
      this.setState({
        rounds: this.state.rounds + 1
      });
      //动画结束时回调
      this.state.rotateDeg.stopAnimation(() => {
        if(prizeType == 5){
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
      });
    });
  };

  youWin = (result, onPrizesMsg = "") => {
    let imgs = ['', 'Freebet', '', 'RewardPts', 'MysteryGift'];
    let PrizeImg = 'CN_' + imgs[result.prizeType] + (result.prizeType != 4 ? ('-' + result.actualPrizeValue) : '');
    let PrizeName = this.getPrizeName(result);
    this.setState({
      PrizeName,
      PrizeImg,
      onPrizes: true,
      onPrizesMsg,
    }, () => {
      setTimeout(() => {
        this.setState({ PrizeBG: true });
      }, 1200);
    });
  }

  //  获取我的奖品
  PrizeHistory() {
    if (!this.UserLogin()) {
      return;
    }

    this.setState({ myPrizesModal: true });

    fetchRequest(`${ApiPort.PrizeHistory}promoId=${this.state.ActiveGame.promoId}&`, "GET")
      .then(res => {
        if (res.isSuccess && res.result) {
          let myPrizeList = [];
          res.result.forEach((item) => {
            if (item.prizeType != 5) {
              //去除空奖prizeType == 5
              myPrizeList.push(item);
            }
          });
          this.setState({ myPrizeList });
        } else {
          //错误提示
          this.setState({ myPrizesModal: false });
          Toasts.fail('系统出现错误，请联系客服', 2);
        }
      })
      .catch(err => {
        Toasts.fail('系统出现错误，请联系客服', 2);
      });
  }

  MemberProgressLoadingDone = () => {
    this.setState({ MemberProgress: '', MemberProgressLoading: false });
  }
  
  //获取存款次数，金额，抽奖次数
  getMemberProgress(errCode = '') {
    
    // 未登入、非活動進行中 不call
    if (!this.UserLogin() || !this.state.ActiveGame.promoId || !this.state.poppingGameActive) {
      this.MemberProgressLoadingDone();
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
              nextModalBtn = '继续自动获取';

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
        Toasts.fail('系统出现错误，请联系客服', 2);
      });
  }

  nextModalBtn(key) {
    if (key == '立即存款') {
      Actions.home1();
      Actions.DepositCenter();
      PiwikAction.SendPiwik("Deposit_MidAutumn2022");
    } else {
      //自动获取
      this.setState({ onPrizes: false, noPrizes: false, PrizeBG: false });
      this.SnatchPrize();
      PiwikAction.SendPiwik("SpinMore_MidAutumn2022");
    }
  }

  //  日期处理
  applyDate(applyDate) {
    if (!applyDate) {
      return '00-00-00 00:00 AM';
    }
    let dates = applyDate.split('T');
    return (dates[0] + ' ' + dates[1].split(':')[0] + ':' + dates[1].split(':')[1]);

  }

  UserLogin() {
    if (!this.state.UserLogin) {
      Actions.Login({ from: 'midAutumn' });
      Toasts.fail('请先登录', 2);
      window.getMiniGames = true;
      return false;
    }
    return true;
  }

  render() {
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
      wheelClick
    } = this.state;
    console.log(this.state);
    return (
      <View style={{ flex: 1, backgroundColor: '#000a41' }}>
        {/* 规则与条款 */}
        <Modals
          isVisible={howToModal}
          backdropColor={'#000'}
          backdropOpacity={0.7}
          style={{ justifyContent: 'center', margin: 30 }}
        >
          <View style={styles.rulesModal}>
            <View style={styles.modalTitle2}>
              <Text style={{ color: '#0C2274', fontSize: 16, fontWeight: "900" }}>规则与条款</Text>
              <Touch onPress={() => {
                this.setState({ howToModal: false });
              }}>
                <Image resizeMode='stretch' source={require('../../../images/minGame/closeIcon.png')}
                       style={{ width: 30, height: 30 }}/>
              </Touch>
            </View>
            <ScrollView style={{ padding: 10, }}>
              <Text style={styles.rulesTxt}>1. 此活动开放给所有乐天堂会员</Text>
              <Text style={styles.rulesTxt}> 活动时间：2022年9月9日 00:00 至2022年9月14日 23:59:59。 (北京时间）</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>2. 参加方式:</Text>
              <Text style={styles.rulesTxt}>- 游戏次数将以会员当天累计存款总额为标准，最低存款为300元，如下图:</Text>
              <View>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerTh}>存款等级(元)</Text>
                  <Text style={styles.headerTHMin}>游戏次数</Text>
                  <Text style={styles.headerTHMin}>累积次数</Text>
                </View>
                <View style={styles.tableBody}>
                  <View>
                    <View style={styles.tableTh}>
                      <Text style={styles.ruleTableDetailText}>300 - 999</Text>
                    </View>
                    <View style={styles.tableTh}>
                      <Text style={styles.ruleTableDetailText}>1,000 - 2,499</Text>
                    </View>
                    <View style={styles.tableTh}>
                      <Text style={styles.ruleTableDetailText}>2,500 - 4,999</Text>
                    </View>
                    <View style={styles.tableTh}>
                      <Text style={styles.ruleTableDetailText}>5,000 - 9,999</Text>
                    </View>
                    <View style={styles.tableTh}>
                      <Text style={styles.ruleTableDetailText}>10,000 以上</Text>
                    </View>
                  </View>
                  <View>
                    <View style={styles.tableThMin}>
                      <Text style={styles.ruleTableDetailText}>1</Text>
                    </View>
                    <View style={styles.tableThMin}>
                      <Text style={styles.ruleTableDetailText}>2</Text>
                    </View>
                    <View style={styles.tableThMin}>
                      <Text style={styles.ruleTableDetailText}>3</Text>
                    </View>
                    <View style={styles.tableThMin}>
                      <Text style={styles.ruleTableDetailText}>4</Text>
                    </View>
                    <View style={styles.tableThMin}>
                      <Text style={styles.ruleTableDetailText}>5</Text>
                    </View>
                  </View>
                  <View style={[styles.tableThMin, { height: 125 }]}>
                    <Text style={styles.ruleTableDetailText}>一天5次</Text>
                  </View>

                </View>
              </View>
              <Text style={[styles.rulesTxt, { paddingTop: 15 }]}>例:</Text>
              <Text
                style={[styles.rulesTxt, { paddingBottom: 10 }]}>会员于9月9日完成第一笔300元存款，即刻获取一次游戏机会。会员其后再存款2,700元，当日总存款累积至3,000元，便可进行剩余的游戏次数。</Text>
              <Text style={styles.rulesTxt}>- 当日游戏次数最多为5次。</Text>
              <Text style={styles.rulesTxt}>- 会员点击“转盘”以激活奖品。</Text>
              <Text style={styles.rulesTxt}>- 未进行的游戏次数不会累计至次日。</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>3. 此活动将以乐币, 免费彩金与神秘惊喜为奖品。</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>4. 派彩时间：</Text>
              <Text style={styles.rulesTxt}>免费彩金（主钱包）：得奖后30分钟内。</Text>
              <Text style={styles.rulesTxt}>乐币（天王俱乐部）：得奖后30分钟内。</Text>
              <Text style={styles.rulesTxt}>中秋大礼包（礼品）：确认收货信息之后的30天内。</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>5. 乐币：</Text>
              <Text style={styles.rulesTxt}>乐币自动计入会员账号后，可在天王俱乐部查询。使用有效期为30天。</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>6. 免费彩金：</Text>
              <Text style={styles.rulesTxt}>彩金自动记入会员主钱包后，有效期为30天。1倍流水方可提款。</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>7. 中秋大礼包（礼品）：</Text>
              <Text style={styles.rulesTxt}>- 礼品将随机派发，该礼品将不会透露直到会员收件。</Text>
              <Text style={styles.rulesTxt}>- 天使客服将在活动结束后7天之内联系中奖会员，索取收件信息。</Text>
              <Text style={styles.rulesTxt}>-
                若礼品已出库，因收件信息不完整，物流公司无法联系会员而被退回，乐天堂有权撤销该礼品。</Text>
              <Text style={styles.rulesTxt}>- 礼品不可兑换成现金、彩金、乐币、免费旋转。</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10, paddingBottom: 40 }]}>8. 须遵守乐天堂条款。</Text>
            </ScrollView>
          </View>
        </Modals>
        {/* 我的奖品 */}
        <Modals
          isVisible={myPrizesModal}
          backdropColor={'#000'}
          backdropOpacity={0.7}
          style={{ justifyContent: 'center', margin: 10 }}
        >
          <View style={styles.myPrizesModal}>
            <View style={styles.modalTitle}>
              <Text style={{ color: '#133292', fontSize: 16, fontWeight: 'bold' }}>我的奖品</Text>
              <Touch onPress={() => {
                this.setState({ myPrizesModal: false, myPrizeList: 'default' });
              }}>
                <Image resizeMode='stretch' source={require('../../../images/minGame/closeIcon.png')}
                       style={{ width: 23, height: 23 }}/>
              </Touch>
            </View>
            <ScrollView style={{ padding: 15}}>
              <View style={[styles.myPrizeList, { marginBottom: 6 }]}>
                <Text style={styles.myPrizesTime}>日期</Text>
                <Text style={styles.myPrizes}>奖品</Text>
                <Text style={styles.myPrizesStatus}>状态</Text>
              </View>
              {
                myPrizeList == 'default' &&
                <View style={{ paddingTop: 80 }}>
                  <ActivityIndicator color="#fff"/>
                </View>
              }
              {
                myPrizeList.length == 0 &&
                <View style={[styles.myPrizeList, { backgroundColor: '#152E8B', justifyContent: 'center', }]}>
                  <Text style={styles.myPrizesTime}>没有获奖记录</Text>
                </View>

              }
              {
                myPrizeList != 'default' && myPrizeList.length > 0 && myPrizeList.map((item, index) => {
                  return (
                    <View style={[styles.myPrizeList, {
                      marginBottom: 3,
                      backgroundColor: index % 2 == 0 ? '#152E8B' : '#2642AA'
                    }]} key={index}>
                      <Text style={styles.myPrizesTime}>{this.applyDate(item.applyDate)}</Text>
                      <Text style={styles.myPrizes}>{this.getPrizeName(item)}</Text>
                      <Text style={styles.myPrizesStatus}>{item.prizeStatusDesc}</Text>
                    </View>
                  );
                })
              }
              <View style={{ height: 50, width: 30 }}/>
            </ScrollView>
          </View>
        </Modals>
        {/* 没有中奖 */}
        <Modals
          isVisible={noPrizes}
          backdropColor={'#000'}
          backdropOpacity={0.7}
          style={{ justifyContent: 'center', margin: 30 }}
        >
          <View style={styles.noPrizesModal}>
            <View style={styles.modalTitle}>
              <Text style={{ color: '#133292', fontSize: 15, fontWeight: 'bold' }}>温馨提示</Text>
              <Touch onPress={() => {
                this.setState({ noPrizes: false });
              }}>
                <Image resizeMode='stretch' source={require('../../../images/minGame/closeIcon.png')}
                       style={{ width: 23, height: 23 }}/>
              </Touch>
            </View>
            {
              //文字中间有其他颜色
              noPrizesMsg.includes('-') ?
                <Text style={styles.noPrizesMsg}>
                  {`${noPrizesMsg.split('-')[0]}`}<Text
                  style={{ color: '#F6DAB5' }}>{`${noPrizesMsg.split('-')[1]}`}</Text>{`${noPrizesMsg.split('-')[2]}`}
                </Text>
                :
                <Text style={styles.noPrizesMsg}>{`${noPrizesMsg}`}</Text>
            }
            <View style={styles.noPrizesBtn}>
              {
                backModalBtn != '' &&
                <Touch style={[styles.backBth, { backgroundColor: backModalBtn === "我知道了" ? "#F6DAB5" : "#FF734A"}]} onPress={() => {
                  this.setState({ noPrizes: false });
                }}>
                  <Text style={{ color: backModalBtn === "我知道了" ? "#133292" : "#fff", fontSize: 13 }}>{backModalBtn}</Text>
                </Touch>
              }
              {
                nextModalBtn != '' &&
                <Touch onPress={() => {
                  this.nextModalBtn(nextModalBtn);
                }} style={styles.nextBth}>
                  <Text style={{ color: '#133292', fontSize: 13 }}>{nextModalBtn}</Text>
                </Touch>
              }
            </View>
          </View>
        </Modals>
        {/* 中奖 */}
        <Modals
          isVisible={onPrizes}
          backdropColor={'#000'}
          backdropOpacity={0.7}
          style={{ justifyContent: 'center', alignItems: "center" }}
        >
          {
            onPrizes &&
            <ImageBackground
              style={styles.PrizeBG}
              resizeMode="stretch"
              source={require("../../../images/minGame/Prize-Popup-BG.gif")}
            >
              {
                PrizeBG &&
                <View style={styles.PrizeBG}>
                  <Text style={{ color: '#F6DAB5', fontSize: 20, fontWeight: 'bold', paddingBottom: 22 }}>奖品</Text>
                  <Image resizeMode='stretch' source={prizeList[PrizeImg]}
                         style={{ width: 100, height: 100, marginBottom: 10 }}/>
                  <Text style={styles.onPrizesMsg}>恭喜您获得 <Text
                    style={{ color: '#FFD500', fontWeight: 'bold', fontSize: 15 }}>{PrizeName}</Text> ! </Text>
                  {
                    //文字中间有其他颜色
                    onPrizesMsg.includes('-') ?
                      <Text style={styles.onPrizesMsg}>
                        {`${onPrizesMsg.split('-')[0]}`}<Text
                        style={{
                          color: '#FFD500',
                          fontWeight: "bold",
                          fontSize: 15
                        }}>{`${onPrizesMsg.split('-')[1]}`}</Text>{`${onPrizesMsg.split('-')[2]}`}
                      </Text>
                      :
                      <Text style={styles.onPrizesMsg}>{`${onPrizesMsg}`}</Text>
                  }
                  <View style={styles.omPrizesBtn}>
                    {
                      backModalBtn != '' &&
                      <Touch onPress={() => {
                        this.setState({ onPrizes: false, PrizeBG: false });
                      }}>
                        {backModalBtn === "返回" && (
                          <Image
                            style={[styles.backBthBG, { marginRight: nextModalBtn !== ""? 15:0}]}
                            resizeMode="stretch"
                            source={require("../../../images/minGame/Button-CN_3.png")}
                          />
                        )}
                        {backModalBtn === "我知道了" && (
                          <Image
                            style={[styles.backBthBG, { marginRight: nextModalBtn !== ""? 15:0}]}
                            resizeMode="stretch"
                            source={require("../../../images/minGame/Button-CN_5.png")}
                          />
                        )}
                      </Touch>
                    }
                    {
                      nextModalBtn != '' &&
                      <Touch onPress={() => {
                        this.nextModalBtn(nextModalBtn);
                      }}>
                        {nextModalBtn === "立即存款" && (
                          <Image
                            style={styles.backBthBG}
                            resizeMode="stretch"
                            source={require("../../../images/minGame/Button-CN_6.png")}
                          />
                        )}
                        {nextModalBtn === "继续自动获取" && (
                          <Image
                            style={styles.backBthBG}
                            resizeMode="stretch"
                            source={require("../../../images/minGame/Button-CN_4.png")}
                          />
                        )}
                      </Touch>
                    }
                  </View>
                </View>
              }
            </ImageBackground>
          }
        </Modals>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <>
            <ImageBackground
              // 安卓設zIndex在這會導致按鈕失效
              style={Platform.OS === "ios" ? styles.headerBG2 : styles.headerBG2Android}
              resizeMode="stretch"
              source={require("../../../images/minGame/BG.jpg")}>
              <View style={styles.container}>
                <Image resizeMode='stretch' source={require('../../../images/minGame/Title_CN.webp')}
                       style={{ width: width * 0.96, height: width * 0.96 * 0.38 }}/>
                <ImageBackground
                  style={{ width: 278, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 2 }}
                  resizeMode="stretch"
                  source={require("../../../images/minGame/Title_Activity.png")}
                >
                  <Text style={styles.headerBGTitle}>9月9日至9月14日 FUN转中秋</Text>
                </ImageBackground>

                <View style={styles.countdown}>
                  <ImageBackground
                    style={styles.countDownImg}
                    resizeMode="stretch"
                    source={require("../../../images/minGame/countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[0][0]}</Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[styles.countDownImg, { marginLeft: 3 }]}
                    resizeMode="stretch"
                    source={require("../../../images/minGame/countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[0][1]}</Text>
                  </ImageBackground>
                  <Text style={styles.timeSeparator}></Text>
                  <ImageBackground
                    style={styles.countDownImg}
                    resizeMode="stretch"
                    source={require("../../../images/minGame/countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[1][0]}</Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[styles.countDownImg, { marginLeft: 3 }]}
                    resizeMode="stretch"
                    source={require("../../../images/minGame/countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[1][1]}</Text>
                  </ImageBackground>
                  <Text style={styles.timeSeparator}></Text>
                  <ImageBackground
                    style={styles.countDownImg}
                    resizeMode="stretch"
                    source={require("../../../images/minGame/countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[2][0]}</Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[styles.countDownImg, { marginLeft: 3 }]}
                    resizeMode="stretch"
                    source={require("../../../images/minGame/countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[2][1]}</Text>
                  </ImageBackground>
                  <Text style={styles.timeSeparator}></Text>
                  <ImageBackground
                    style={styles.countDownImg}
                    resizeMode="stretch"
                    source={require("../../../images/minGame/countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[3][0]}</Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[styles.countDownImg, { marginLeft: 3 }]}
                    resizeMode="stretch"
                    source={require("../../../images/minGame/countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[3][1]}</Text>
                  </ImageBackground>
                </View>
                <View style={[styles.countdown, { marginTop: 5, marginBottom: 40 }]}>
                  <Text style={styles.countdownFoot}>天</Text>
                  <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                  <Text style={styles.countdownFoot}>时</Text>
                  <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                  <Text style={styles.countdownFoot}>分</Text>
                  <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                  <Text style={styles.countdownFoot}>秒</Text>
                </View>

                <AnimatedTurnTableDrawPage
                  SnatchPrize={() => this.SnatchPrize()}
                  onSpinEvent={(type, wonPrizes) => {
                    this.onSpinEvent(type, wonPrizes);
                  }}
                  rotateDeg={rotateDeg}
                  poppingGameActive={poppingGameActive}
                  wheelClick={wheelClick}
                />
              </View>
            </ImageBackground>
            {/*<View style={styles.activityTime}>*/}
            {/*    <Text style={{ color: '#0A2EA9', fontSize: 12 }}>活动时间：6月18日 00:00 至 6月20日 23:59 (北京时间)</Text>*/}
            {/*</View>*/}
            <ImageBackground
              style={styles.prizeBG}
              resizeMode="stretch"
              source={require("../../../images/minGame/BGfood.jpg")}
            >
              <View style={styles.activeAmount}>
                <Touch onPress={() => {
                  this.getMemberProgress('click');
                }} style={styles.resetAmount}>
                  <Text style={styles.resetAmountTxt}>今日累计有效存款</Text>
                  {
                    (MemberProgressLoading && UserLogin) ?
                      <ActivityIndicator color="#FFEB9C"/>
                      :
                      <View style={styles.activeAmount}>
                        <Text
                          style={styles.resetAmountTxt}>{MemberProgress ? (MemberProgress.totalDepositedDaily || '0') : '0'}元</Text>
                        <Image resizeMode='stretch' source={require('../../../images/minGame/reset.png')}
                               style={{ width: 18, height: 18, marginLeft: 5 }}/>
                      </View>
                  }
                </Touch>
                <View style={styles.resetAmount}>
                  <Text style={styles.resetAmountTxt}>今日剩余游戏次数</Text>
                  <Text
                    style={styles.resetAmountTxt}>{MemberProgress ? (MemberProgress.remainingGrabFromCurrentTier || '0') : '0'}次</Text>
                </View>
              </View>
              <Image resizeMode='stretch' source={require('../../../images/minGame/HowTo_CN.png')}
                     style={{ width: 180, height: 27, marginBottom: 22, marginTop: 100 }}/>
              <ImageBackground
                style={styles.howToBG}
                resizeMode="stretch"
                source={require("../../../images/minGame/HowToStep-BG_Mobile.png")}
              >
                <Text style={{ color: '#FEF681', fontSize: 15 }}>轻松三步，幸运不断！</Text>
                <View style={styles.howStep}>
                  <View style={styles.howStepList}>
                    <Image resizeMode='stretch' source={require('../../../images/minGame/HowToStep_1.png')}
                           style={{ width: 60, height: 60 }}/>
                    <Text style={{ color: '#FFE121', fontWeight: 'bold', padding: 8, fontSize: 13 }}>步骤一</Text>
                    <Text style={{ color: '#fff', fontSize: 10 }}>注册或登入您的账户</Text>
                  </View>
                  <View style={styles.howStepList}>
                    <Image resizeMode='stretch' source={require('../../../images/minGame/HowToStep_2.png')}
                           style={{ width: 60, height: 60 }}/>
                    <Text style={{ color: '#FFE121', fontWeight: 'bold', padding: 8, fontSize: 13 }}>步骤二</Text>
                    <Text style={{ color: '#fff', fontSize: 10 }}>存款最低 300元 至您的账户</Text>
                  </View>
                  <View style={styles.howStepList}>
                    <Image resizeMode='stretch' source={require('../../../images/minGame/HowToStep_3.png')}
                           style={{ width: 60, height: 60 }}/>
                    <Text style={{ color: '#FFE121', fontWeight: 'bold', padding: 8, fontSize: 13 }}>步骤三</Text>
                    <Text style={{ color: '#fff', fontSize: 10 }}>FUN转中秋</Text>
                  </View>
                </View>
                <Touch onPress={() => {
                  this.setState({ howToModal: true });
                  PiwikAction.SendPiwik("Tnc_MidAutumn2022");
                }} style={styles.howBtn}>
                  <Image resizeMode='stretch' source={require('../../../images/minGame/Button-CN_1.png')}
                         style={{ width: 150, height: 37.6, }}/>
                </Touch>
              </ImageBackground>
              <Image resizeMode='stretch' source={require('../../../images/minGame/PrizeList_CN.png')}
                     style={{ width: 180, height: 27, marginBottom: 28, marginTop: 57 }}/>
              <View style={styles.prizeView}>
                {
                  Object.values(prizeList).map((item, index) => {
                    return (
                      <Image key={index} resizeMode='stretch' source={item}
                             style={{
                               width: (width - 78) / 4,
                               height: (width - 78) / 4,
                               marginVertical: 7,
                               marginHorizontal: 7
                             }}/>
                    );
                  })
                }
              </View>
              <Touch onPress={() => {
                PiwikAction.SendPiwik("MyPrize_MidAutumn2022");
                this.PrizeHistory();
              }} style={styles.howBtn}>
                <Image resizeMode='stretch' source={require('../../../images/minGame/Button-CN_2.png')}
                       style={{ width: 150, height: 37.6, }}/>
              </Touch>
            </ImageBackground>
          </>
        </ScrollView>
      </View>
    );
  }

}

export default PoppingGame;


const styles = StyleSheet.create({
  PrizeBG: {
    width: width * 1,
    height: width * 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPrizesMsg: {
    color: '#fff',
    lineHeight: 17,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 13,
    textAlign: 'center',
  },
  backBth: {
    width: width * 0.35,
    marginRight: 15,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
  },
  nextBth: {
    width: width * 0.35,
    backgroundColor: '#F6DAB5',
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
  },
  backBthBG: {
    width: width * 0.31,
    // marginRight: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
  },
  noPrizesBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  omPrizesBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 27
  },
  onPrizesMsg: {
    color: '#B6C5D9',
    fontSize: 15,
    lineHeight: 18,
  },
  headerTh: {
    width: (width - 80) * 0.4,
    lineHeight: 25,
    textAlign: 'center',
    fontSize: 11,
    color: '#133292',
  },
  headerTHMin: {
    width: (width - 80) * 0.2,
    lineHeight: 25,
    textAlign: 'center',
    fontSize: 11,
    color: '#133292',
  },
  tableTh: {
    width: (width - 80) * 0.46,
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F6DAB5'
  },
  tableThMin: {
    width: (width - 80) * 0.27,
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F6DAB5'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F6DAB5',
    flexDirection: 'row',
    marginTop: 10,
  },
  tableBody: {
    borderWidth: 1,
    borderColor: '#F6DAB5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rulesTxt: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 20,
  },
  rulesModal: {
    width: width - 46,
    backgroundColor: '#133292',
    height: height * 0.7,
    paddingBottom: 5,
    borderRadius: 8,
    alignSelf: "center"
  },
  myPrizesModal: {
    width: width - 46,
    backgroundColor: '#133292',
    height: height * 0.5,
    paddingBottom: 5,
    borderRadius: 8,
    alignSelf: "center"
  },
  myPrizeList: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#2642AA',
  },
  myPrizesTime: {
    width: width * 0.35,
    color: '#fff',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 18,
    paddingTop: 3,
    paddingBottom: 3,
  },
  myPrizes: {
    width: width * 0.25,
    color: '#fff',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 12,
    paddingTop: 3,
    paddingBottom: 3,
  },
  myPrizesStatus: {
    width: width * 0.3,
    color: '#fff',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 12,
    paddingTop: 3,
    paddingBottom: 3,
  },
  noPrizesModal: {
    width: width - 60,
    backgroundColor: '#133292',
    paddingBottom: 20,
    borderRadius: 8,
    alignSelf: "center"
  },
  modalTitle: {
    backgroundColor: '#F6DAB5',
    height: 37,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  modalTitle2: {
    backgroundColor: '#F6DAB5',
    height: 50,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  prizeView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - 10,
    paddingBottom: 70,
  },
  prizeBG: {
    width: width,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 210,
    paddingBottom: 140
  },
  howBtn: {
    width: 160,
    height: 40,
  },
  howStep: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 22,
    paddingBottom: 34,
  },
  howStepList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  howToBG: {
    width: width,
    height: width * .74,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBG2: {
    width: width,
    height: width * 1.5,
    paddingTop: 43,
    zIndex: 10
  },
  headerBG2Android: {
    width: width,
    height: width * 1.5,
    paddingTop: 43,
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: width,
    height: width * 1.44,
    zIndex: 100
  },
  countdown: {
    display: 'flex',
    width: "92%",
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  countdownTime: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 50,
  },
  countDownImg: {
    width: 35, 
    height: 50
  },
  timeSeparator: {
    width: 18,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#001B6C',
  },
  countdownFoot: {
    width: 67,
    textAlign: 'center',
    color: '#001B6C',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerBGTitle: {
    // lineHeight: 32,
    textAlign: 'center',
    fontSize: 14,
    color: '#E5EBFF'
  },
  activeAmount: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  resetAmount: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 50,
    borderWidth: 1,
    borderColor: '#FFEB9C',
    borderRadius: 8,
    margin: 8,
    paddingTop: 3,
    paddingBottom: 3,
  },
  resetAmountTxt: {
    color: '#FFEB9C',
    fontSize: 13,
    lineHeight: 20,
  },
  ruleTableDetailText: {
    color: '#FFFFFF', 
    fontSize: 11
  }
});




