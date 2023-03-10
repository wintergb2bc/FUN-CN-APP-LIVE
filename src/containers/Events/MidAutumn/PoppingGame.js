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
      poppingGameActive: false,//?????????????????????
      howToModal: false,
      noPrizes: false,
      noPrizesMsg: '?????????',
      myPrizesModal: false,
      myPrizeList: 'default',
      popingActive: false,
      onPrizes: false,
      PrizeName: '??????',
      PrizeImg: 'CN_Freebet-18',
      onPrizesMsg: '??????',
      PrizeBG: false,
      UserLogin: ApiPort.UserLogin,
      MemberProgress: '',//????????????????????????
      MemberProgressLoading: true,
      backModalBtn: '',//?????????????????????
      nextModalBtn: '',//????????????,??????????????????
      ActiveGame: '',

      rounds: 1,//???????????????
      rotateDeg: new Animated.Value(0),//????????????,
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

  //???????????????????????????id
  getMiniGames() {
    Toast.loading("?????????,?????????...", 20);
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
        // Toasts.fail('????????????????????????????????????', 2);
        this.errorHandle(err);
        Toast.hide();
      });
  }

  //?????????????????????
  isPoppingGameStart() {
    const startTime = this.state.ActiveGame.eventStartDate.replace('T', ' ').replace(/\-/g, '/') + ' +08:00'; //????????????
    const endTime = this.state.ActiveGame.eventEndDate.replace('T', ' ').replace(/\-/g, '/') + ' +08:00'; //????????????

    let startNow = parseInt(new Date(startTime).getTime() - new Date().getTime());
    let startEnd = parseInt(new Date(startTime).getTime() - new Date(endTime).getTime());
    let nowEnd = parseInt(new Date(endTime).getTime() - new Date().getTime());
    let times = false;
    if (startNow > 0) {
      //???????????????
      times = startNow;
      this.MemberProgressLoadingDone();
    } else if (nowEnd > 0) {
      //???????????????
      times = nowEnd;
      this.setState({ poppingGameActive: true, popingActive: true }, () => {
        this.getMemberProgress();
      });
    } else {
      this.MemberProgressLoadingDone();
    }
    
    this.Countdown(times);
  }

  //???????????????
  Countdown(time) {
    if (!time) {
      return;
    }

    // let time = 300;
    //???????????????,??????app??????setInterval???????????????
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
    return result.prizeType == 4 ? '????????????' : result.actualPrizeValue + ' ' + result.prizeTypeDesc;
  }

  //??????api
  SnatchPrize() {
    PiwikAction.SendPiwik("SpinLuckyWheel_MidAutumn2022");
    if (!this.UserLogin()) {
      return;
    }

    // let res = {
    //   "result":{
    //     "prizeStatus":3,
    //     "prizeStatusDesc":"??????120.50 / 200.00???????????????",
    //     "applyDate":"2022-02-01T00:00:00.000Z",
    //     "prizeId":1,
    //     "prizeName":"88 ??????",
    //     "actualPrizeValue":88,
    //     "prizeType":3,
    //     "prizeTypeDesc":"??????",
    //     "platform":"Android",
    //     "remainingGrabFromCurrentTier":0,
    //     "remainingGrabFromHighestTier":3
    //   },
    //   "isSuccess":true
    // };
    this.setState({
      wheelClick: true,
    });
    Toast.loading("?????????...", 20);
    fetchRequest(`${ApiPort.SnatchPrize}promoId=${this.state.ActiveGame.promoId}&`, "POST")
      .then(res => {

        let backModalBtn = '';
        let nextModalBtn = '';
        if (res.isSuccess) {
          //??????
          let result = res.result;
          let onPrizesMsg = '??????';

          if (result.remainingGrabFromCurrentTier > 0) {
            onPrizesMsg = `???????????? -${result.remainingGrabFromCurrentTier}- ??????????????????`;
            backModalBtn = '??????';
            nextModalBtn = '??????????????????';

          } else if (result.remainingGrabFromHighestTier > 0) {
            onPrizesMsg = `???????????????????????????????????????????????????`;
            backModalBtn = '??????';
            nextModalBtn = '????????????';

          } else if (result.remainingGrabFromHighestTier == 0) {
            onPrizesMsg = `??????????????????????????????????????????????????????`;
            backModalBtn = '????????????';
          }

          if (result.prizeType == 1 || result.prizeType == 3 || result.prizeType == 4 || result.prizeType == 5) {
            this.rotateSpin(result, onPrizesMsg);
          } else if (result.prizeType == 2) {
            //????????????

          }

        } else {
          //?????????
          let errorCode = res.errors ? res.errors[0].errorCode : '';
          let noPrizesMsg = '?????????';

          if (errorCode == 'MG00012') {
            noPrizesMsg = `?????? 300 ??????????????? 1 ???????????????????????????\n???????????????????????????`;
            backModalBtn = '??????';
            nextModalBtn = '????????????';

          } else if (errorCode == 'MG00004') {
            noPrizesMsg = `???????????????????????? 300 ?????? \n????????????????????????????????????`;
            backModalBtn = '??????';
            nextModalBtn = '????????????';

          } else if (errorCode == 'MG00001') {
            noPrizesMsg = `??????????????????????????????????????????\n????????????????????????????????????`;
            backModalBtn = '????????????';


          } else if (errorCode == 'MG00002') {
            noPrizesMsg = `???????????????????????????????????????????????????`;
            backModalBtn = '??????';
            nextModalBtn = '????????????';

          } else if (errorCode == 'MG00003') {
            noPrizesMsg = `??????????????????????????????????????????????????????`;
            backModalBtn = '????????????';

          } else if (errorCode == 'MG00009') {
            // ????????????remainingGrabFromCurrentTier???remainingGrabFromHighestTier
            this.getMemberProgress('MG00009');
            return;
          } else if (errorCode == 'MG00005') {
            noPrizesMsg = `??????????????????????????????????????????`;
            backModalBtn = '????????????';

          } else if (errorCode == 'MG99998') {
            noPrizesMsg = `??????????????????????????????\n?????????????????????????????????`;
            backModalBtn = '????????????';

          } else {
            noPrizesMsg = `????????????????????????????????????`;
            backModalBtn = '????????????';

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
        // Toasts.fail('????????????????????????????????????', 2)
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
    //?????????
    let errorCode = res.errors ? res.errors[0].errorCode : '';
    let noPrizesMsg = '?????????';

    if (errorCode == 'MG00012') {
      noPrizesMsg = `?????? 300 ??????????????? 1 ???????????????????????????\n???????????????????????????`;
      backModalBtn = '??????';
      nextModalBtn = '????????????';

    } else if (errorCode == 'MG00004') {
      noPrizesMsg = `???????????????????????? 300 ?????? \n????????????????????????????????????`;
      backModalBtn = '??????';
      nextModalBtn = '????????????';

    } else if (errorCode == 'MG00001') {
      noPrizesMsg = `??????????????????????????????????????????\n????????????????????????????????????`;
      backModalBtn = '????????????';


    } else if (errorCode == 'MG00002') {
      noPrizesMsg = `???????????????????????????????????????????????????`;
      backModalBtn = '??????';
      nextModalBtn = '????????????';

    } else if (errorCode == 'MG00003') {
      noPrizesMsg = `??????????????????????????????????????????????????????`;
      backModalBtn = '????????????';

    } else if (errorCode == 'MG00009') {
      // ????????????remainingGrabFromCurrentTier???remainingGrabFromHighestTier
      this.getMemberProgress('MG00009');
      return;
    } else if (errorCode == 'MG00005') {
      noPrizesMsg = `??????????????????????????????????????????`;
      backModalBtn = '????????????';

    } else if (errorCode == 'MG99998') {
      noPrizesMsg = `??????????????????????????????\n?????????????????????????????????`;
      backModalBtn = '????????????';

    } else {
      noPrizesMsg = `????????????????????????????????????`;
      backModalBtn = '????????????';

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


  // ????????????
  rotateSpin = (data, onPrizesMsg = "") => {

    if (Object.keys(data).length === 0) {
      Toast.fail("Error");
      console.log('result??????');
      return;
    }

    //1 ???????????????3 ?????????4 ????????? 5??????
    const { prizeType, actualPrizeValue = "" } = data;

    // ??????????????????
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
      // ????????????rounds+1,?????????????????????????????????3???
      this.setState({
        rounds: this.state.rounds + 1
      });
      //?????????????????????
      this.state.rotateDeg.stopAnimation(() => {
        if(prizeType == 5){
          //??????
          this.setState({
            noPrizes: true,
            noPrizesMsg: `???????????????????????????????????????????????????`,
            backModalBtn: '????????????'
          });
          return;
        }
        // ?????????????????????
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

  //  ??????????????????
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
              //????????????prizeType == 5
              myPrizeList.push(item);
            }
          });
          this.setState({ myPrizeList });
        } else {
          //????????????
          this.setState({ myPrizesModal: false });
          Toasts.fail('????????????????????????????????????', 2);
        }
      })
      .catch(err => {
        Toasts.fail('????????????????????????????????????', 2);
      });
  }

  MemberProgressLoadingDone = () => {
    this.setState({ MemberProgress: '', MemberProgressLoading: false });
  }
  
  //??????????????????????????????????????????
  getMemberProgress(errCode = '') {
    
    // ?????????????????????????????? ???call
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
            let noPrizesMsg = '?????????';
            let backModalBtn = '';
            let nextModalBtn = '';
            if (result.remainingGrabFromCurrentTier > 0) {
              noPrizesMsg = `???????????????????????????????????????????????????\n???????????? -${result.remainingGrabFromCurrentTier}- ???????????????????????????`;
              backModalBtn = '??????';
              nextModalBtn = '??????????????????';

            } else if (result.remainingGrabFromCurrentTier == 0 && result.remainingGrabFromHighestTier > 0) {
              noPrizesMsg = `???????????????????????????????????????????????????\n?????????????????????????????????????????????????????????`;
              backModalBtn = '??????';
              nextModalBtn = '????????????';

            } else if (result.remainingGrabFromCurrentTier == 0 && result.remainingGrabFromHighestTier == 0) {
              noPrizesMsg = `???????????????????????????????????????????????????\n????????????????????????????????????????????????????????????`;
              backModalBtn = '????????????';

            }
            this.setState({ noPrizes: true, noPrizesMsg, nextModalBtn, backModalBtn });
          }
        }
      })
      .catch(err => {
        this.setState({
          MemberProgressLoading: false
        });
        Toasts.fail('????????????????????????????????????', 2);
      });
  }

  nextModalBtn(key) {
    if (key == '????????????') {
      Actions.home1();
      Actions.DepositCenter();
      PiwikAction.SendPiwik("Deposit_MidAutumn2022");
    } else {
      //????????????
      this.setState({ onPrizes: false, noPrizes: false, PrizeBG: false });
      this.SnatchPrize();
      PiwikAction.SendPiwik("SpinMore_MidAutumn2022");
    }
  }

  //  ????????????
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
      Toasts.fail('????????????', 2);
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
        {/* ??????????????? */}
        <Modals
          isVisible={howToModal}
          backdropColor={'#000'}
          backdropOpacity={0.7}
          style={{ justifyContent: 'center', margin: 30 }}
        >
          <View style={styles.rulesModal}>
            <View style={styles.modalTitle2}>
              <Text style={{ color: '#0C2274', fontSize: 16, fontWeight: "900" }}>???????????????</Text>
              <Touch onPress={() => {
                this.setState({ howToModal: false });
              }}>
                <Image resizeMode='stretch' source={require('../../../images/minGame/closeIcon.png')}
                       style={{ width: 30, height: 30 }}/>
              </Touch>
            </View>
            <ScrollView style={{ padding: 10, }}>
              <Text style={styles.rulesTxt}>1. ???????????????????????????????????????</Text>
              <Text style={styles.rulesTxt}> ???????????????2022???9???9??? 00:00 ???2022???9???14??? 23:59:59??? (???????????????</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>2. ????????????:</Text>
              <Text style={styles.rulesTxt}>- ???????????????????????????????????????????????????????????????????????????300???????????????:</Text>
              <View>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerTh}>????????????(???)</Text>
                  <Text style={styles.headerTHMin}>????????????</Text>
                  <Text style={styles.headerTHMin}>????????????</Text>
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
                      <Text style={styles.ruleTableDetailText}>10,000 ??????</Text>
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
                    <Text style={styles.ruleTableDetailText}>??????5???</Text>
                  </View>

                </View>
              </View>
              <Text style={[styles.rulesTxt, { paddingTop: 15 }]}>???:</Text>
              <Text
                style={[styles.rulesTxt, { paddingBottom: 10 }]}>?????????9???9??????????????????300??????????????????????????????????????????????????????????????????2,700??????????????????????????????3,000??????????????????????????????????????????</Text>
              <Text style={styles.rulesTxt}>- ???????????????????????????5??????</Text>
              <Text style={styles.rulesTxt}>- ??????????????????????????????????????????</Text>
              <Text style={styles.rulesTxt}>- ????????????????????????????????????????????????</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>3. ?????????????????????, ???????????????????????????????????????</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>4. ???????????????</Text>
              <Text style={styles.rulesTxt}>???????????????????????????????????????30????????????</Text>
              <Text style={styles.rulesTxt}>???????????????????????????????????????30????????????</Text>
              <Text style={styles.rulesTxt}>?????????????????????????????????????????????????????????30?????????</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>5. ?????????</Text>
              <Text style={styles.rulesTxt}>????????????????????????????????????????????????????????????????????????????????????30??????</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>6. ???????????????</Text>
              <Text style={styles.rulesTxt}>???????????????????????????????????????????????????30??????1????????????????????????</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>7. ??????????????????????????????</Text>
              <Text style={styles.rulesTxt}>- ?????????????????????????????????????????????????????????????????????</Text>
              <Text style={styles.rulesTxt}>- ?????????????????????????????????7???????????????????????????????????????????????????</Text>
              <Text style={styles.rulesTxt}>-
                ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</Text>
              <Text style={styles.rulesTxt}>- ???????????????????????????????????????????????????????????????</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10, paddingBottom: 40 }]}>8. ???????????????????????????</Text>
            </ScrollView>
          </View>
        </Modals>
        {/* ???????????? */}
        <Modals
          isVisible={myPrizesModal}
          backdropColor={'#000'}
          backdropOpacity={0.7}
          style={{ justifyContent: 'center', margin: 10 }}
        >
          <View style={styles.myPrizesModal}>
            <View style={styles.modalTitle}>
              <Text style={{ color: '#133292', fontSize: 16, fontWeight: 'bold' }}>????????????</Text>
              <Touch onPress={() => {
                this.setState({ myPrizesModal: false, myPrizeList: 'default' });
              }}>
                <Image resizeMode='stretch' source={require('../../../images/minGame/closeIcon.png')}
                       style={{ width: 23, height: 23 }}/>
              </Touch>
            </View>
            <ScrollView style={{ padding: 15}}>
              <View style={[styles.myPrizeList, { marginBottom: 6 }]}>
                <Text style={styles.myPrizesTime}>??????</Text>
                <Text style={styles.myPrizes}>??????</Text>
                <Text style={styles.myPrizesStatus}>??????</Text>
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
                  <Text style={styles.myPrizesTime}>??????????????????</Text>
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
        {/* ???????????? */}
        <Modals
          isVisible={noPrizes}
          backdropColor={'#000'}
          backdropOpacity={0.7}
          style={{ justifyContent: 'center', margin: 30 }}
        >
          <View style={styles.noPrizesModal}>
            <View style={styles.modalTitle}>
              <Text style={{ color: '#133292', fontSize: 15, fontWeight: 'bold' }}>????????????</Text>
              <Touch onPress={() => {
                this.setState({ noPrizes: false });
              }}>
                <Image resizeMode='stretch' source={require('../../../images/minGame/closeIcon.png')}
                       style={{ width: 23, height: 23 }}/>
              </Touch>
            </View>
            {
              //???????????????????????????
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
                <Touch style={[styles.backBth, { backgroundColor: backModalBtn === "????????????" ? "#F6DAB5" : "#FF734A"}]} onPress={() => {
                  this.setState({ noPrizes: false });
                }}>
                  <Text style={{ color: backModalBtn === "????????????" ? "#133292" : "#fff", fontSize: 13 }}>{backModalBtn}</Text>
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
        {/* ?????? */}
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
                  <Text style={{ color: '#F6DAB5', fontSize: 20, fontWeight: 'bold', paddingBottom: 22 }}>??????</Text>
                  <Image resizeMode='stretch' source={prizeList[PrizeImg]}
                         style={{ width: 100, height: 100, marginBottom: 10 }}/>
                  <Text style={styles.onPrizesMsg}>??????????????? <Text
                    style={{ color: '#FFD500', fontWeight: 'bold', fontSize: 15 }}>{PrizeName}</Text> ! </Text>
                  {
                    //???????????????????????????
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
                        {backModalBtn === "??????" && (
                          <Image
                            style={[styles.backBthBG, { marginRight: nextModalBtn !== ""? 15:0}]}
                            resizeMode="stretch"
                            source={require("../../../images/minGame/Button-CN_3.png")}
                          />
                        )}
                        {backModalBtn === "????????????" && (
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
                        {nextModalBtn === "????????????" && (
                          <Image
                            style={styles.backBthBG}
                            resizeMode="stretch"
                            source={require("../../../images/minGame/Button-CN_6.png")}
                          />
                        )}
                        {nextModalBtn === "??????????????????" && (
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
              // ?????????zIndex???????????????????????????
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
                  <Text style={styles.headerBGTitle}>9???9??????9???14??? FUN?????????</Text>
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
                  <Text style={styles.countdownFoot}>???</Text>
                  <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                  <Text style={styles.countdownFoot}>???</Text>
                  <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                  <Text style={styles.countdownFoot}>???</Text>
                  <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                  <Text style={styles.countdownFoot}>???</Text>
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
            {/*    <Text style={{ color: '#0A2EA9', fontSize: 12 }}>???????????????6???18??? 00:00 ??? 6???20??? 23:59 (????????????)</Text>*/}
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
                  <Text style={styles.resetAmountTxt}>????????????????????????</Text>
                  {
                    (MemberProgressLoading && UserLogin) ?
                      <ActivityIndicator color="#FFEB9C"/>
                      :
                      <View style={styles.activeAmount}>
                        <Text
                          style={styles.resetAmountTxt}>{MemberProgress ? (MemberProgress.totalDepositedDaily || '0') : '0'}???</Text>
                        <Image resizeMode='stretch' source={require('../../../images/minGame/reset.png')}
                               style={{ width: 18, height: 18, marginLeft: 5 }}/>
                      </View>
                  }
                </Touch>
                <View style={styles.resetAmount}>
                  <Text style={styles.resetAmountTxt}>????????????????????????</Text>
                  <Text
                    style={styles.resetAmountTxt}>{MemberProgress ? (MemberProgress.remainingGrabFromCurrentTier || '0') : '0'}???</Text>
                </View>
              </View>
              <Image resizeMode='stretch' source={require('../../../images/minGame/HowTo_CN.png')}
                     style={{ width: 180, height: 27, marginBottom: 22, marginTop: 100 }}/>
              <ImageBackground
                style={styles.howToBG}
                resizeMode="stretch"
                source={require("../../../images/minGame/HowToStep-BG_Mobile.png")}
              >
                <Text style={{ color: '#FEF681', fontSize: 15 }}>??????????????????????????????</Text>
                <View style={styles.howStep}>
                  <View style={styles.howStepList}>
                    <Image resizeMode='stretch' source={require('../../../images/minGame/HowToStep_1.png')}
                           style={{ width: 60, height: 60 }}/>
                    <Text style={{ color: '#FFE121', fontWeight: 'bold', padding: 8, fontSize: 13 }}>?????????</Text>
                    <Text style={{ color: '#fff', fontSize: 10 }}>???????????????????????????</Text>
                  </View>
                  <View style={styles.howStepList}>
                    <Image resizeMode='stretch' source={require('../../../images/minGame/HowToStep_2.png')}
                           style={{ width: 60, height: 60 }}/>
                    <Text style={{ color: '#FFE121', fontWeight: 'bold', padding: 8, fontSize: 13 }}>?????????</Text>
                    <Text style={{ color: '#fff', fontSize: 10 }}>???????????? 300??? ???????????????</Text>
                  </View>
                  <View style={styles.howStepList}>
                    <Image resizeMode='stretch' source={require('../../../images/minGame/HowToStep_3.png')}
                           style={{ width: 60, height: 60 }}/>
                    <Text style={{ color: '#FFE121', fontWeight: 'bold', padding: 8, fontSize: 13 }}>?????????</Text>
                    <Text style={{ color: '#fff', fontSize: 10 }}>FUN?????????</Text>
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




