import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import { Toasts } from "../../Toast";
import FastImage from 'react-native-fast-image';
import Modals from "react-native-modal";
import PiwikAction from "../../../lib/utils/piwik";

const { width, height } = Dimensions.get("window");

const prizeList = {
  // CN_Freebet: require("../../../images/worldCup/Prize_Freebets-CN.png"),
  CN_RewardPts: require("../../../images/worldCup/Prize_RewardPts-CN.png"),
};


class KickBallGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      UserLogin: ApiPort.UserLogin,
      showGameStart: false,
      howToPlay: false
    };
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
      poppingGameActive,
      gifType,
      gameEnd
    } = this.props;
    const { UserLogin, showGameStart, howToPlay } = this.state;
    return (
      <>
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
            <ScrollView style={{ padding: 15 }}>
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
              <View style={{ width: 17, height: 17 }} />
              <Text style={{ color: '#fff', fontSize: 16 }}>温馨提示</Text>
              <Touch onPress={() => this.props.closePrizeModal()}>
                <Image resizeMode='stretch' source={require('../../../images/worldCup/Icon-Close.png')}
                       style={{ width: 17, height: 17 }}/>
              </Touch>
            </View>
            {
              //文字中间有其他颜色
              noPrizesMsg.includes('-') ?
                <Text style={styles.noPrizesMsg}>
                  {`${noPrizesMsg.split('-')[0]}`}<Text
                  style={{ color: '#0C96F4' }}>{`${noPrizesMsg.split('-')[1]}`}</Text>{`${noPrizesMsg.split('-')[2]}`}
                </Text>
                :
                <Text style={styles.noPrizesMsg}>{`${noPrizesMsg}`}</Text>
            }
            <View style={styles.noPrizesBtn}>
              {
                backModalBtn != '' &&
                <Touch onPress={() => this.props.closePrizeModal()}>
                  <ImageBackground
                    style={[styles.backBthBG2, { marginRight: nextModalBtn !== "" ? 6 : 0 }]}
                    resizeMode="stretch"
                    source={require("../../../images/worldCup/Button-1.png")}
                  >
                    <Text style={{ color: "#fff" }}>{backModalBtn}</Text>
                  </ImageBackground>
                </Touch>
              }
              {
                nextModalBtn != '' &&
                <Touch onPress={() => this.props.nextModalBtnFn(nextModalBtn)}>
                  <ImageBackground
                    style={styles.backBthBG2}
                    resizeMode="stretch"
                    source={require("../../../images/worldCup/Button-2.png")}
                  >
                    <Text style={{ color: "#927D25" }}>{nextModalBtn}</Text>
                  </ImageBackground>
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
          style={{ justifyContent: 'center', alignItems: "center"  }}
        >
          {
            onPrizes &&
            <ImageBackground
              style={styles.PrizeBG}
              resizeMode="stretch"
              source={require("../../../images/worldCup/Pop-Up_CN.gif")}
            >
              {
                PrizeBG &&
                <View style={[styles.PrizeBG, {paddingBottom: 40}]}>
                  <Image resizeMode='stretch' source={require("../../../images/worldCup/Prize_RewardPts-CN.png")}
                         style={{ width: 100, height: 100, marginBottom: 10 }}/>
                  <Text style={styles.onPrizesMsg}>恭喜您获得 <Text
                    style={{ color: '#1B8EF0', fontWeight: 'bold', fontSize: 15 }}>{PrizeName}！</Text></Text>
                  {
                    //文字中间有其他颜色
                    onPrizesMsg.includes('-') ?
                      <Text style={styles.onPrizesMsg}>
                        {`${onPrizesMsg.split('-')[0]}`}<Text
                        style={{
                          color: '#1B8EF0',
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
                      <Touch onPress={() => this.props.closePrizeBGModal()}>
                        <ImageBackground
                          style={[styles.backBthBG, { marginRight: nextModalBtn !== "" ? 6 : 0 }]}
                          resizeMode="stretch"
                          source={require("../../../images/worldCup/Button-Pop-Up_1.png")}
                        >
                          <Text style={{ color: "#fff" }}>{backModalBtn}</Text>
                        </ImageBackground>
                      </Touch>
                    }
                    {
                      nextModalBtn != '' &&
                      <Touch onPress={() => {
                        this.props.nextModalBtnFn(nextModalBtn);
                      }}>
                        <ImageBackground
                          style={styles.backBthBG}
                          resizeMode="stretch"
                          source={require("../../../images/worldCup/Button-Pop-Up_2.png")}
                        >
                          <Text style={{ color: "#fff" }}>{nextModalBtn}</Text>
                        </ImageBackground>
                      </Touch>
                    }
                  </View>
                </View>
              }
            </ImageBackground>
          }
        </Modals>
        <View style={[styles.activeAmount, styles.activeAmountWrap]}>
          <View style={[styles.resetAmount, {alignItems: 'flex-start',}]}>
            <Text
              style={[styles.resetAmountNumTxt, { marginBottom: 4 }]}>{MemberProgress ? (MemberProgress.remainingGrabFromCurrentTier || '0') : '0'}次</Text>
            <Text style={styles.resetAmountTxt}>今日剩余点球次数</Text>

          </View>

          <Touch onPress={() => {
            if(!ApiPort.UserLogin){
              Actions.Login({ from: 'worldCup' });
              return;
            }
            this.props.getMemberProgress('click');
          }} style={[styles.resetAmount,{alignItems: 'flex-end',}]}>
            
            {
              (MemberProgressLoading && UserLogin) ?
                <ActivityIndicator color="#FFEB9C"/>
                :
                <View style={[styles.activeAmount, { marginBottom: 4 }]}>
                  <Text
                    style={[styles.resetAmountNumTxt, {}]}>{MemberProgress ? (MemberProgress.totalDepositedDaily || '0') : '0'}元</Text>
                  <Image resizeMode='stretch' source={require('../../../images/minGame/reset.png')}
                         style={{ width: 18, height: 18, marginLeft: 5 }}/>
                </View>
            }
            <Text style={styles.resetAmountTxt}>今日累计有效存款</Text>
          </Touch>
        </View>
        <View style={{
          height: 1, backgroundColor: "#0B3E85", width: width - 32, marginVertical: 16
        }}/>
        <View style={{
          flexDirection: "row",
          width: width - 32,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 25
        }}>
          <Touch onPress={() => {
            if (!ApiPort.UserLogin) {
              Actions.Login({ from: 'worldCup' });
              return;
            }
            PiwikAction.SendPiwik("MyPrize_WCPage2022");
            Actions.WorldCupMyPrize({ ActiveGame: this.props.ActiveGame });
          }}
                 style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', }}>
            <Image style={{ width: 20, height: 20, marginRight: 5 }}
                   source={require('../../../images/worldCup/Icon-Gift.png')}/>
            <Text style={{ color: "#FFE786" }}>我的奖品 </Text>
            <Image
              source={require("../../../images/icon/goldRight2.png")}
              style={{ width: 16, height: 16 }}
            />
          </Touch>
          <Touch onPress={() => {
            Actions.WorldCupMyRule();
            PiwikAction.SendPiwik("TnC_WCPage2022");
          }} style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', }}>
            <Image style={{ width: 20, height: 20, marginRight: 5 }}
                   source={require('../../../images/worldCup/Icon-Rules.png')}/>
            <Text style={{ color: "#FFE786" }}>规则与条例 </Text>
            <Image
              source={require("../../../images/icon/goldRight2.png")}
              style={{ width: 16, height: 16 }}
            />
          </Touch>
        </View>

        {gameEnd && (
          <FastImage style={{ width: width - 32, height: width * .965, marginBottom: 39 }}
                 resizeMode='stretch'
                 source={require('../../../images/worldCup/BG-CN_EventFinished.gif')}/>
        )}
        {!gameEnd && !showGameStart && (
          <ImageBackground
            source={require('../../../images/worldCup/BG-CN_GameNotStarted.jpg')}
            resizeMode='stretch'
            imageStyle={{ borderRadius: 8 }}
            style={{ width: width - 20, minHeight: 360, alignItems: "center", justifyContent: "center" }}>
            <Image style={{ width: 166, height: 131, marginTop: 10 }}
                   source={require('../../../images/worldCup/Text-Title_CN.png')}/>
            <View style={styles.countdown}>
              <View style={{alignItems: 'center',justifyContent: 'center'}}>
                <View style={{
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                  <ImageBackground
                    style={styles.countDownImg}
                    resizeMode="stretch"
                    source={require("../../../images/worldCup/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[0][0]}</Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[styles.countDownImg, { marginLeft: 3 }]}
                    resizeMode="stretch"
                    source={require("../../../images/worldCup/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[0][1]}</Text>
                  </ImageBackground>
                </View>
                <Text style={{color:"#E2E2E2", fontSize: 12, marginTop: 7}}>天</Text>
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={{alignItems: 'center',justifyContent: 'center'}}>
                <View style={{
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                  <ImageBackground
                    style={styles.countDownImg}
                    resizeMode="stretch"
                    source={require("../../../images/worldCup/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[1][0]}</Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[styles.countDownImg, { marginLeft: 3 }]}
                    resizeMode="stretch"
                    source={require("../../../images/worldCup/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[1][1]}</Text>
                  </ImageBackground>
                </View>
                <Text style={{color:"#E2E2E2", fontSize: 12, marginTop: 7}}>时</Text>
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={{alignItems: 'center',justifyContent: 'center'}}>
                <View style={{
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                  <ImageBackground
                    style={styles.countDownImg}
                    resizeMode="stretch"
                    source={require("../../../images/worldCup/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[2][0]}</Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[styles.countDownImg, { marginLeft: 3 }]}
                    resizeMode="stretch"
                    source={require("../../../images/worldCup/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[2][1]}</Text>
                  </ImageBackground>
                </View>
                <Text style={{color:"#E2E2E2", fontSize: 12, marginTop: 7}}>分</Text>
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={{alignItems: 'center',justifyContent: 'center'}}>
                <View style={{
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                  <ImageBackground
                    style={styles.countDownImg}
                    resizeMode="stretch"
                    source={require("../../../images/worldCup/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[3][0]}</Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[styles.countDownImg, { marginLeft: 3 }]}
                    resizeMode="stretch"
                    source={require("../../../images/worldCup/Countdown.png")}
                  >
                    <Text style={styles.countdownTime}>{Countdown.split(':')[3][1]}</Text>
                  </ImageBackground>
                </View>
                <Text style={{color:"#E2E2E2", fontSize: 12, marginTop: 7}}>秒</Text>
              </View>
            </View>

            <ImageBackground
              style={{
                width: width - 35,
                height: 38,
                paddingHorizontal: 6,
                marginTop: 18,
                justifyContent: "center",
                alignItems: "center",
              }}
              resizeMode="stretch"
              source={require("../../../images/worldCup/ActivityTime.png")}
            >
              <Text style={{ fontSize: 12, color: "#FFE786" }}>活动时间: 11月21日,00:00 - 12月18日,23:59(北京时间)</Text>
            </ImageBackground>

            <View style={{ flexDirection: "row", marginTop: 11 }}>
              {poppingGameActive ? (
                <Touch onPress={() => {
                  if (!this.state.UserLogin) {
                    Actions.Login({ from: 'worldCup' });
                    Toasts.fail('请先登录', 2);
                    return;
                  }
                  this.setState({ showGameStart: true });
                }}>
                  <Image style={{ width: 71, height: 72 }}
                         source={require('../../../images/worldCup/Button-Play.png')}/>
                </Touch>
              ) : (
                <Touch onPress={() => {
                  // this.setState({ howToModal: false });
                }}>
                  <Image style={{ width: 71, height: 72 }}
                         source={require('../../../images/worldCup/Button-Play_Disabled.png')}/>
                </Touch>
              )}
              <Touch onPress={() => {
                this.setState({ showGameStart: true, howToPlay: true });
              }}>
                <Image style={{ width: 71, height: 72 }}
                       source={require('../../../images/worldCup/Button-How.png')}/>
              </Touch>

            </View>

          </ImageBackground>
        )}

        {!gameEnd && showGameStart && (
          <ImageBackground
            source={require('../../../images/worldCup/BG-CN_GameStarted.jpg')}
            resizeMode='stretch'
            imageStyle={{ borderRadius: 8 }}
            style={{ width: width - 20, minHeight: 360, alignItems: "center", justifyContent: "center" }}>
            {howToPlay ? (
              <TouchableWithoutFeedback onPress={() => {
                this.setState({ showGameStart: false, howToPlay: false });
              }}>
                <Image style={{ width: width - 20, height: 340, paddingHorizontal: 10 }}
                       source={require('../../../images/worldCup/HowToPlay_CN.png')}/>
              </TouchableWithoutFeedback>
            ) : (
              <View>
                {gifType === "" && (
                  <>
                    <FastImage
                      resizeMethod="resize"
                      resizeMode="stretch"
                      source={require('../../../images/worldCup/CN_GoalKeeper.gif')}
                      style={{
                        width: width - 32,
                        height: width - 32,
                      }}
                    />
                    <Touch
                      onPress={() => {
                        this.props.SnatchPrize();
                        PiwikAction.SendPiwik("Kick_WCPage2022");
                      }}
                      style={{
                        width: width - 32,
                        height: 300,
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        zIndex: 999,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                      <FastImage
                        resizeMethod="resize"
                        resizeMode="stretch"
                        source={require('../../../images/worldCup/Click-The-Ball_CN.gif')}
                        style={{
                          width: 300,
                          height: 300
                        }}
                      />
                    </Touch>
                  </>
                )}
                {gifType === "winGif1" && (
                  <FastImage
                    resizeMethod="resize"
                    resizeMode="stretch"
                    source={require('../../../images/worldCup/CN_Clicked-Win-AnimatedAsset_1.gif')}
                    style={{
                      width: width - 32,
                      height: width - 32,
                    }}
                  />
                )}
                {gifType === "winGif2" && (
                  <FastImage
                    resizeMethod="resize"
                    resizeMode="stretch"
                    source={require('../../../images/worldCup/CN_Clicked-Win-AnimatedAsset_2.gif')}
                    style={{
                      width: width - 32,
                      height: width - 32,
                    }}
                  />
                )}
                {gifType === "loss" && (
                  <FastImage
                    resizeMethod="resize"
                    resizeMode="stretch"
                    source={require('../../../images/worldCup/CN_Clicked-Lose-AnimatedAsset_1.gif')}
                    style={{
                      width: width - 32,
                      height: width - 32,
                    }}
                  />
                )}
              </View>
            )}
          </ImageBackground>
        )}
      </>
    );
  }
}

export default KickBallGame;


const styles = StyleSheet.create({
  PrizeBG: {
    width: width * 1,
    height: width * 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPrizesMsg: {
    color: '#484848',
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
    width: width * 0.3,
    // marginRight: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 33,
  },
  backBthBG2: {
    width: width * 0.275,
    // marginRight: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 38,
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
    marginTop: 13
  },
  onPrizesMsg: {
    color: '#012557',
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
    width: width - 95,
    backgroundColor: '#fff',
    paddingBottom: 20,
    borderRadius: 8,
    alignSelf: "center"
  },
  modalTitle: {
    backgroundColor: '#013C85',
    height: 32,
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
    width: "91%",
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: 20,
  },
  countdownTime: {
    color: '#FFE786',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 31,
  },
  countDownImg: {
    width: 34.5,
    height: 34.5
  },
  timeSeparator: {
    width: 18,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFE786',
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
  activeAmountWrap: {
    display: 'flex',
    width: "100%",
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  resetAmount: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 3,
  },
  resetAmountTxt: {
    color: '#E2E2E2',
    fontSize: 12,
  },
  resetAmountNumTxt: {
    color: '#FFE786',
    fontSize: 16,
    fontWeight: "bold"
  },
  ruleTableDetailText: {
    color: '#FFFFFF',
    fontSize: 11
  }
});





