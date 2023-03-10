import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Modals from 'react-native-modal';
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';
import { Toast } from "antd-mobile-rn";
import Popping from './Popping';
import PiwikAction from "../../../lib/utils/piwik";
import FSImageBackground from '../../Common/FastImageBG';

const {
  width,
  height
} = Dimensions.get('window');

const firstHeight = width * 2.06;

const prizeList = {
  'CN_Freebet-18': require("../../../images/goldenWeek/prizes/CN_Freebet-18.png"),
  'CN_Freebet-28': require("../../../images/goldenWeek/prizes/CN_Freebet-28.png"),
  'CN_Freebet-58': require("../../../images/goldenWeek/prizes/CN_Freebet-58.png"),
  'CN_Freebet-88': require("../../../images/goldenWeek/prizes/CN_Freebet-88.png"),
  'CN_Freebet-128': require("../../../images/goldenWeek/prizes/CN_Freebet-128.png"),
  'CN_Freebet-188': require("../../../images/goldenWeek/prizes/CN_Freebet-188.png"),
  'CN_Freebet-288': require("../../../images/goldenWeek/prizes/CN_Freebet-288.png"),
  'CN_Freebet-588': require("../../../images/goldenWeek/prizes/CN_Freebet-588.png"),
  // 'CN_RewardPts-28': require("../../../images/goldenWeek/prizes/CN_Rewards-28.png"),
  'CN_RewardPts-58': require("../../../images/goldenWeek/prizes/CN_Rewards-58.png"),
  'CN_RewardPts-88': require("../../../images/goldenWeek/prizes/CN_Rewards-88.png"),
  'CN_RewardPts-128': require("../../../images/goldenWeek/prizes/CN_Rewards-128.png"),
  'CN_RewardPts-288': require("../../../images/goldenWeek/prizes/CN_Rewards-288.png"),
  'CN_RewardPts-588': require("../../../images/goldenWeek/prizes/CN_Rewards-588.png"),
  CN_MysteryGift: require("../../../images/goldenWeek/prizes/CN_GiftPackage.png"),
};

class GoldenWeek extends React.Component {

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
      poppingGameEnd: false,//????????????
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
      this.setState({ poppingGameEnd: true });
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
    PiwikAction.SendPiwik("Popping_NationalDay2022");
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
            this.youWin(result, onPrizesMsg);
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
      }, 800);
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
    if (!ApiPort.UserLogin || !this.state.ActiveGame.promoId || !this.state.poppingGameActive) {
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
      PiwikAction.SendPiwik("Deposit_NationalDay2022");
    } else {
      //????????????
      this.setState({ onPrizes: false, noPrizes: false, PrizeBG: false });
      this.SnatchPrize();
      PiwikAction.SendPiwik("GrabMore_NationalDay2022");
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
      Actions.Login({ from: 'goldenWeek' });
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
      poppingGameEnd,
      poppingGameActive,
    } = this.state;
    // ?????????ImageBackground???gif???ios???????????? ?????????????????????ios??????FastImage?????????ImageBackground
    const BgComponent = Platform.OS == "ios" ? FSImageBackground : ImageBackground;
    return (
      <View style={{ flex: 1, backgroundColor: '#7A0A0A' }}>
        {/* ??????????????? */}
        <Modals
          isVisible={howToModal}
          backdropColor={'#000'}
          backdropOpacity={0.7}
          style={{ justifyContent: 'center', margin: 30 }}
        >
          <View style={styles.rulesModal}>
            <View style={styles.modalTitle2}>
              <Text style={{ color: '#F6DAB5', fontSize: 16, fontWeight: "900" }}>???????????????</Text>
              <Touch onPress={() => {
                this.setState({ howToModal: false });
              }}>
                <Image resizeMode='stretch' source={require('../../../images/goldenWeek/closeIcon.png')}
                       style={{ width: 30, height: 30 }}/>
              </Touch>
            </View>
            <ScrollView style={{ padding: 10, }}>
              <Text style={styles.rulesTxt}>1. ???????????????????????????????????????</Text>
              <Text style={styles.rulesTxt}>???????????????2022???10???1??? 00:00:01 ???2022???10???7??? 23:59:59???(????????????) </Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>2. ????????????:</Text>
              <Text style={styles.rulesTxt}>- ???????????????????????????????????????????????????????????????????????????300??????????????????</Text>
              <View style={{ width: "100%" }}>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerTh}>????????????(???)</Text>
                  <Text style={styles.headerTHMin}>????????????</Text>
                  <Text style={[styles.headerTHMin, {width: "22%"}]}>????????????</Text>
                  <Text style={[styles.headerTHMin, {width: "22%"}]}>????????????</Text>
                </View>
                <View style={styles.tableBody}>
                  <View style={{ width: "41%" }}>
                    <View style={styles.tableTh}>
                      <Text style={styles.ruleTableDetailText}>300.00 - 999.99</Text>
                    </View>
                    <View style={styles.tableTh}>
                      <Text style={styles.ruleTableDetailText}>1,000.00 - 2,499.99</Text>
                    </View>
                    <View style={styles.tableTh}>
                      <Text style={styles.ruleTableDetailText}>2,500.00 - 4,999.99</Text>
                    </View>
                    <View style={styles.tableTh}>
                      <Text style={styles.ruleTableDetailText}>5,000.00 - 9,999.99</Text>
                    </View>
                    <View style={styles.tableTh}>
                      <Text style={styles.ruleTableDetailText}>10,000.00 ??????</Text>
                    </View>
                  </View>
                  <View style={{ width: "15%" }}>
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
                  <View style={[styles.tableThMin2, { height: 125 }]}>
                    <Text style={styles.ruleTableDetailText}>????????????</Text>
                  </View>
                  <View style={[styles.tableThMin3, { height: 125 }]}>
                    <Text style={styles.ruleTableDetailText}>????????????</Text>
                  </View>

                </View>
              </View>
              <Text style={[styles.rulesTxt, { paddingTop: 15 }]}>???:</Text>
              <Text
                style={[styles.rulesTxt, { paddingBottom: 10 }]}>?????????10???1??????????????????300??????????????????????????????????????????????????????????????????2,700??????????????????????????????3,000??????????????????????????????????????????</Text>
              <Text style={styles.rulesTxt}>- ???????????????????????????????????????????????????</Text>
              <Text style={styles.rulesTxt}>- ???????????????????????????????????????????????? </Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>3. ?????????????????????????????????????????????????????????</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>4. ???????????????</Text>
              <Text style={styles.rulesTxt}>???????????????????????????????????????30????????????</Text>
              <Text style={styles.rulesTxt}>?????????????????????????????????????????????????????????30?????????</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>5. ???????????????</Text>
              <Text style={styles.rulesTxt}>???????????????????????????????????????????????????30??????1????????????????????????</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>6. ??????????????????????????????</Text>
              <Text style={styles.rulesTxt}>- ?????????????????????????????????????????????????????????????????????</Text>
              <Text style={styles.rulesTxt}>- ????????????????????????????????????7???????????????????????????????????????????????????</Text>
              <Text style={styles.rulesTxt}>-
                ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</Text>
              <Text style={styles.rulesTxt}>- ???????????????????????????????????????????????????????????????</Text>
              <Text style={[styles.rulesTxt, { paddingTop: 10, paddingBottom: 40 }]}>7. ???????????????????????????</Text>
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
              <Text style={{ color: '#F6DAB5', fontSize: 16, fontWeight: 'bold' }}>????????????</Text>
              <Touch onPress={() => {
                this.setState({ myPrizesModal: false, myPrizeList: 'default' });
              }}>
                <Image resizeMode='stretch' source={require('../../../images/goldenWeek/closeIcon.png')}
                       style={{ width: 23, height: 23 }}/>
              </Touch>
            </View>
            <ScrollView style={{ padding: 15 }}>
              <View style={[styles.myPrizeList, { marginBottom: 6 }]}>
                <Text style={styles.myPrizesTime}>??????</Text>
                <Text style={styles.myPrizes}>??????</Text>
                <Text style={styles.myPrizesStatus}>??????</Text>
              </View>
              {
                myPrizeList == 'default' &&
                <View style={{ paddingTop: 20 }}>
                  <ActivityIndicator color="#C80E0E"/>
                </View>
              }
              {
                myPrizeList.length == 0 &&
                <View style={[styles.myPrizeList, { backgroundColor: '#FFE2BC', justifyContent: 'center', }]}>
                  <Text style={styles.myPrizesTime}>??????????????????</Text>
                </View>

              }
              {
                myPrizeList != 'default' && myPrizeList.length > 0 && myPrizeList.map((item, index) => {
                  return (
                    <View style={[styles.myPrizeList, {
                      marginBottom: 3,
                      backgroundColor: index % 2 == 0 ? '#FFE2BC' : '#E8C89F'
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
              <Text style={{ color: '#F6DAB5', fontSize: 15, fontWeight: 'bold' }}>????????????</Text>
              <Touch onPress={() => {
                this.setState({ noPrizes: false });
              }}>
                <Image resizeMode='stretch' source={require('../../../images/goldenWeek/closeIcon.png')}
                       style={{ width: 23, height: 23 }}/>
              </Touch>
            </View>
            {
              //???????????????????????????
              noPrizesMsg.includes('-') ?
                <Text style={styles.noPrizesMsg}>
                  {`${noPrizesMsg.split('-')[0]}`}<Text
                  style={{ color: '#C80E0E' }}>{`${noPrizesMsg.split('-')[1]}`}</Text>{`${noPrizesMsg.split('-')[2]}`}
                </Text>
                :
                <Text style={styles.noPrizesMsg}>{`${noPrizesMsg}`}</Text>
            }
            <View style={styles.noPrizesBtn}>
              {
                backModalBtn != '' &&
                <Touch
                  style={[styles.backBth]}
                  onPress={() => {
                    this.setState({ noPrizes: false });
                  }}>
                  <Text style={{
                    color: "#303030",
                    fontSize: 13
                  }}>{backModalBtn}</Text>
                </Touch>
              }
              {
                nextModalBtn != '' &&
                <Touch onPress={() => {
                  this.nextModalBtn(nextModalBtn);
                }} style={styles.nextBth}>
                  <Text style={{ color: '#F6DAB5', fontSize: 13 }}>{nextModalBtn}</Text>
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
            <BgComponent
              style={styles.PrizeBG}
              resizeMode="stretch"
              source={require("../../../images/goldenWeek/Pop-Up_BG.gif")}
            >
              {
                PrizeBG &&
                <View style={styles.PrizeBG}>
                  <Text style={{ color: '#C80E0E', fontSize: 20, fontWeight: 'bold', paddingBottom: 22 }}>??????</Text>
                  <Image resizeMode='stretch' source={prizeList[PrizeImg]}
                         style={{ width: 100, height: 100, marginBottom: 10 }}/>
                  <Text style={styles.onPrizesMsg}>??????????????? <Text
                    style={{ color: '#C80E0E', fontWeight: 'bold', fontSize: 15 }}>{PrizeName} ! </Text></Text>
                  {
                    //???????????????????????????
                    onPrizesMsg.includes('-') ?
                      <Text style={styles.onPrizesMsg}>
                        {`${onPrizesMsg.split('-')[0]}`}<Text
                        style={{
                          color: '#C80E0E',
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
                        <ImageBackground
                          style={[styles.backBthBG, { marginRight: nextModalBtn !== "" ? 6 : 0 }]}
                          resizeMode="stretch"
                          source={require("../../../images/goldenWeek/Button-1.png")}
                        >
                          <Text style={{ color: "#fff" }}>{backModalBtn}</Text>
                        </ImageBackground>
                      </Touch>
                    }
                    {
                      nextModalBtn != '' &&
                      <Touch onPress={() => {
                        this.nextModalBtn(nextModalBtn);
                      }}>
                        <ImageBackground
                          style={styles.backBthBG}
                          resizeMode="stretch"
                          source={require("../../../images/goldenWeek/Button-2.png")}
                        >
                          <Text style={{ color: "#fff" }}>{nextModalBtn}</Text>
                        </ImageBackground>
                      </Touch>
                    }
                  </View>
                </View>
              }
            </BgComponent>
          }
        </Modals>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <>
            <ImageBackground
              style={Platform.OS === "ios" ? styles.headerBG2 : styles.headerBG2Android}
              resizeMode="stretch"
              source={require("../../../images/goldenWeek/BG-1.jpg")}>
              <View style={styles.container}>
                <Image resizeMode='stretch' source={require('../../../images/goldenWeek/Text_CN.png')}
                       style={{ width: width * 0.89, height: width * 0.96 * 0.56 }}/>
                <ImageBackground
                  style={{
                    width: width * 0.89,
                    height: 45,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 22
                  }}
                  resizeMode="stretch"
                  source={require("../../../images/goldenWeek/ActivityTime.png")}
                >
                  <Text style={styles.headerBGTitle}>?????????????????????</Text>
                </ImageBackground>

                <View style={styles.countdown}>
                  <ImageBackground
                    style={styles.countDownImg}
                    resizeMode="stretch"
                    source={require("../../../images/goldenWeek/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[0][0]}</Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[styles.countDownImg, { marginLeft: 3 }]}
                    resizeMode="stretch"
                    source={require("../../../images/goldenWeek/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[0][1]}</Text>
                  </ImageBackground>
                  <Text style={styles.timeSeparator}></Text>
                  <ImageBackground
                    style={styles.countDownImg}
                    resizeMode="stretch"
                    source={require("../../../images/goldenWeek/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[1][0]}</Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[styles.countDownImg, { marginLeft: 3 }]}
                    resizeMode="stretch"
                    source={require("../../../images/goldenWeek/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[1][1]}</Text>
                  </ImageBackground>
                  <Text style={styles.timeSeparator}></Text>
                  <ImageBackground
                    style={styles.countDownImg}
                    resizeMode="stretch"
                    source={require("../../../images/goldenWeek/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[2][0]}</Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[styles.countDownImg, { marginLeft: 3 }]}
                    resizeMode="stretch"
                    source={require("../../../images/goldenWeek/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[2][1]}</Text>
                  </ImageBackground>
                  <Text style={styles.timeSeparator}></Text>
                  <ImageBackground
                    style={styles.countDownImg}
                    resizeMode="stretch"
                    source={require("../../../images/goldenWeek/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[3][0]}</Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[styles.countDownImg, { marginLeft: 3 }]}
                    resizeMode="stretch"
                    source={require("../../../images/goldenWeek/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[3][1]}</Text>
                  </ImageBackground>
                </View>
                <View style={[styles.countdown, { marginTop: 5, marginBottom: (!poppingGameActive || poppingGameEnd) ? 15 : 40 }]}>
                  <Text style={styles.countdownFoot}>???</Text>
                  <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                  <Text style={styles.countdownFoot}>???</Text>
                  <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                  <Text style={styles.countdownFoot}>???</Text>
                  <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                  <Text style={styles.countdownFoot}>???</Text>
                </View>

                <View style={!poppingGameActive ? styles.portalView : styles.portalViewActive}>
                  {poppingGameEnd ? (
                    <Image resizeMode='stretch' source={require('../../../images/goldenWeek/EventEnded.png')}
                           style={{ width: width * 0.797, height: width * 0.552, alignSelf: "center" }}/>
                  ) : !poppingGameActive ? (
                    <Image resizeMode='stretch' source={require('../../../images/goldenWeek/EventBefore.png')}
                           style={{ width: width * 0.797, height: width * 0.552, alignSelf: "center" }}/>
                  ) : (
                    <Popping
                      // popingActive={true}
                      popingActive={poppingGameActive}
                      SnatchPrize={() => {
                        this.SnatchPrize();
                      }}
                    />
                  )}
                </View>
              </View>
            </ImageBackground>
            {/*<View style={styles.activityTime}>*/}
            {/*    <Text style={{ color: '#0A2EA9', fontSize: 12 }}>???????????????6???18??? 00:00 ??? 6???20??? 23:59 (????????????)</Text>*/}
            {/*</View>*/}
            <ImageBackground
              style={[styles.prizeBG, {marginTop: -1}]}
              resizeMode="stretch"
              source={require("../../../images/goldenWeek/BG-2.jpg")}
            >
              <View style={styles.activeAmount}>
                <Touch onPress={() => {
                  if(!ApiPort.UserLogin) {
                    Actions.Login({ from: 'goldenWeek' });
                    return;
                  }
                  this.getMemberProgress('click');
                }} style={styles.resetAmount}>
                  <Text style={styles.resetAmountTxt}>????????????????????????</Text>
                  {
                    (MemberProgressLoading && UserLogin) ?
                      <ActivityIndicator color="#C80E0E"/>
                      :
                      <View style={styles.activeAmount}>
                        <Text
                          style={styles.resetAmountTxt}>{MemberProgress ? (MemberProgress.totalDepositedDaily.toFixed(2) || '0.00') : '0.00'}???</Text>
                        <Image resizeMode='stretch' source={require('../../../images/goldenWeek/reset.png')}
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
              <View style={styles.resetTime}>
                <Text style={[styles.resetAmountTxt, { textAlign: "center" }]}>2022???10???1??? 00:00:01
                  ???2022???10???7???{"\n"}23:59:59???(???????????????</Text>
              </View>


              <ImageBackground
                style={[styles.howToBG, { marginTop: 36, position: 'relative', }]}
                resizeMode="stretch"
                source={require("../../../images/goldenWeek/Pop-Up.png")}
              >
                <Touch
                  style={{ position: 'absolute', width: width * .925, height: 100, bottom: 0 }}
                  onPress={() => {
                    this.setState({ howToModal: true });
                    PiwikAction.SendPiwik("TnC_NationalDay2022");
                  }}/>
              </ImageBackground>


              <ImageBackground
                style={{ width: width * .925, height: width * 1.07, marginTop: 50 }}
                resizeMode="stretch"
                source={require('../../../images/goldenWeek/Prizes.png')}
              >
                <Touch
                  style={{ position: 'absolute', width: width * .925, height: 100, bottom: 0 }}
                  onPress={() => {
                    PiwikAction.SendPiwik("MyPrize_NationalDay2022");
                    this.PrizeHistory();
                  }}/>
              </ImageBackground>
            </ImageBackground>
          </>
        </ScrollView>
      </View>
    );
  }

}

export default GoldenWeek;


const styles = StyleSheet.create({
  PrizeBG: {
    width: width * 1,
    height: width * 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPrizesMsg: {
    color: '#303030',
    lineHeight: 17,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 13,
    textAlign: 'center',
  },
  backBth: {
    width: width * 0.35,
    marginRight: 15,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 37,
    borderColor: "#C80E0E",
    borderWidth: 2
  },
  nextBth: {
    width: width * 0.35,
    backgroundColor: '#C80E0E',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 37,
  },
  backBthBG: {
    width: width * 0.285,
    // marginRight: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 37,
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
    color: '#303030',
    fontSize: 15,
    lineHeight: 18,
  },
  headerTh: {
    width: "41%",
    lineHeight: 25,
    textAlign: 'center',
    fontSize: 11,
    color: '#F6DAB5',
  },
  headerTHMin: {
    width: "15%",
    lineHeight: 25,
    textAlign: 'center',
    fontSize: 11,
    color: '#F6DAB5',
  },
  tableTh: {
    // width: "100%",
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C80E0E'
  },
  tableThMin: {
    // width: "30%",
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C80E0E'
  },
  tableThMin3: {
    width: "22%",
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C80E0E'
  },
  tableThMin2: {
    width: "22%",
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C80E0E'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: "#C80E0E",
    flexDirection: 'row',
    marginTop: 10,
  },
  tableBody: {
    borderWidth: 2,
    borderColor: '#C80E0E',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rulesTxt: {
    fontSize: 13,
    color: '#303030',
    lineHeight: 17,
  },
  rulesModal: {
    width: width - 46,
    backgroundColor: '#F6DAB5',
    height: height * 0.7,
    paddingBottom: 5,
    borderRadius: 8,
    alignSelf: "center"
  },
  myPrizesModal: {
    width: width - 46,
    backgroundColor: '#F6DAB5',
    maxHeight: height * 0.5,
    paddingBottom: 5,
    borderRadius: 8,
    alignSelf: "center"
  },
  myPrizeList: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#E8C89F',
  },
  myPrizesTime: {
    width: "33%",
    color: '#303030',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 18,
    paddingTop: 3,
    paddingBottom: 3,
  },
  myPrizes: {
    width: "33%",
    color: '#303030',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 12,
    paddingTop: 3,
    paddingBottom: 3,
  },
  myPrizesStatus: {
    width: "33%",
    color: '#303030',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 12,
    paddingTop: 3,
    paddingBottom: 3,
  },
  noPrizesModal: {
    width: width - 60,
    backgroundColor: '#F6DAB5',
    paddingBottom: 20,
    borderRadius: 8,
    alignSelf: "center"
  },
  modalTitle: {
    backgroundColor: '#C80E0E',
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
    backgroundColor: '#C80E0E',
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
    paddingTop: 0,
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
    width: width * .925,
    height: width * .97,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBG2: {
    width: width,
    height: firstHeight,
    paddingTop: 21,
    zIndex: 10
  },
  headerBG2Android: {
    width: width,
    height: firstHeight,
    paddingTop: 21,
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: width,
    height: firstHeight,
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
    lineHeight: 56,
  },
  countDownImg: {
    width: 41,
    height: 56
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
    color: '#7A0A0A',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerBGTitle: {
    // lineHeight: 35,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: "bold",
    color: '#EFDDC1'
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
    width: width * 0.4,
    height: 66,
    backgroundColor: '#FCF6E4',
    borderRadius: 20,
    margin: 8,
    paddingTop: 3,
    paddingBottom: 3,
  },
  resetTime: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.84,
    height: 53,
    backgroundColor: '#FCF6E4',
    borderRadius: 15,
    margin: 8,
    paddingTop: 3,
    paddingBottom: 3,
  },
  resetAmountTxt: {
    color: '#CB1C1B',
    fontSize: 13,
    lineHeight: 20,
  },
  ruleTableDetailText: {
    color: '#303030',
    fontSize: 11
  },
  portalView: {
    width: width,
    alignItems: "center",
    // justifyContent: "center"
  },
  portalViewActive: {
    width: width,
    // justifyContent: "center"
  },
});




