/* 投注記錄-提前兌現-結果彈窗 */

import React from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  Image,
  View,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
  WebView,
  NativeModules,
  Alert,
  UIManager,
  Clipboard,
  RefreshControl,
  Button
} from "react-native";
import Touch from "react-native-touch-once";
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { ACTION_UserInfo_getBalanceSB } from '$LIB/redux/actions/UserInfoAction';
import {CashOutStatusType} from "./../../../lib/vendor/data/VendorConsts";
import WagerData from "./../../../lib/vendor/data/WagerData";
import { Flex, Toast, WingBlank, WhiteSpace, Accordion, Tabs, TabPane, Drawer } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import styles from './CashOutStyles';

const { width, height } = Dimensions.get("window");

class CashOutPopup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      progressPercent: 100, //倒數關閉進度百分比
    }

    this.storedWagerData = null; //wagerData暫存，因為關閉時會清掉prop帶來的數據
    this.countDownHandle = null;
    this.countDownFinalHandle = null;
  }

  componentDidMount () {
  }

  componentWillUnmount() {
    this.clearTimeouts();
  }

  //清理定時器，避免關閉後觸發 報錯
  clearTimeouts = () => {
    if (this.countDownHandle) {
      clearTimeout(this.countDownHandle);
    }
    if (this.countDownFinalHandle) {
      clearTimeout(this.countDownFinalHandle);
    }
  }



  //定時關閉
  countDownClose = () => {
    this.clearTimeouts();

    const { closePopup } = this.props;
    const countDownSecond = 5;  //倒數5秒後關閉
    const piece = 100 / countDownSecond; //每次要切掉的長度
    let that = this;

    const countDownTimout = () => {
      that.countDownHandle = setTimeout(() => {
        const leftPercent = that.state.progressPercent - piece;
        that.setState({progressPercent: leftPercent}, () => {
          if (leftPercent >0) {
            countDownTimout();
          } else {
            //500ms後再關閉，讓動畫跑一下
            that.countDownFinalHandle = setTimeout(() => {
              closePopup();
            },500)
          }
        });
      },1000);
    }

    countDownTimout();
  }

  //彈窗開啟事件
  doOnOpen = () => {
    const { wagerData } = this.props;
    //存下wagerData
    this.storedWagerData = WagerData.clone(wagerData);

    let that = this;
    this.setState({
      progressPercent: 100  //這個組件會一直存在，復用的，所以每次打開要重置數據
    }, () => {
      that.countDownClose();     //幾秒後自動關閉彈窗
    })
  }

  //統一處理關閉彈窗請求
  doOnClose = () => {
    this.clearTimeouts();

    const { unlockWager, showSettledWagers, reloadWagers } = this.props;

    unlockWager(); //解鎖注單數據 - 繼續(輪詢)更新此注單數據

    //注意不是用 props.wagerData 因為這個數據關閉彈窗的時候 就清掉了
    if (this.storedWagerData
      && this.storedWagerData.CashOutStatus == CashOutStatusType.DONE) { //查看已兑现单
      console.log('===doOnClose showSettledWagers')
      showSettledWagers();
      this.props.userInfo_getBalanceSB();
    } else { //失敗或拒絕
      console.log('===doOnClose reloadWagers')
      reloadWagers(); //刷新數據
    }
  }

  //從bet-records直接複製過來
  getWagerScore = (wagerItemData) => {
    if (wagerItemData.HomeTeamFTScore !== null || wagerItemData.AwayTeamFTScore !== null) {
      return '[' +  (wagerItemData.HomeTeamFTScore ?? 0) + '-' + (wagerItemData.AwayTeamFTScore ?? 0)  + ']';
    }
    return '';
  }

  render () {
    const { wagerData, closePopup } = this.props;
    // if (!wagerData) { //有數據才render內容 不能寫在這裡，會無法正常觸發modal的onModalWillHide/onModalHide事件
    //   return null;
    // }

    const val = wagerData; //從bet-record複製過來 直接使用相同的參數名

    let statusBgColor = styles.cashoutPopupStatusGreenBg; //成功:綠色
    let statusTextColor = styles.cashoutPopupStatusGreenText; //成功:綠色
    let statusName = '兑现成功'
    if (wagerData) {
      if (wagerData.CashOutStatus == CashOutStatusType.FAIL) { //失敗
        statusBgColor = styles.cashoutPopupStatusRedBg;
        statusTextColor = styles.cashoutPopupStatusRedText;
        statusName = '兑现失败'
      } else if (wagerData.CashOutStatus == CashOutStatusType.DECLINE) { //拒絕價格異動
        statusBgColor = styles.cashoutPopupStatusRedBg;
        statusTextColor = styles.cashoutPopupStatusRedText;
        statusName = '兑现取消'
      }
    }

    return <Modal
      isVisible={wagerData !== null}
      backdropColor={'#000'}
      backdropOpacity={0.3}
      onModalWillShow={this.doOnOpen}
      onModalWillHide={this.doOnClose}
      onBackButtonPress={closePopup}
      onBackdropPress={closePopup}
      style={styles.cashoutPopup}
    >
      {/*有數據才render內容*/}
      { wagerData && <>
      <View style={[styles.cashoutPopupProgress,{width: this.state.progressPercent + '%' }]} />
      <View style={styles.cashoutPopupWager}>
        { /*從bet-records直接複製過來 刪除了最後的注單和客服信息 也刪除了免費投注和額外盈利*/
          val.WagerType !== 2
            ? <View style={{ justifyContent: "center", alignItems: 'center', backgroundColor: '#fff', marginTop: 0, width: width - 16*2, borderRadius: 8 }}>
              <View style={{ backgroundColor: '#fff', width: width - 16*4, paddingTop: 20, paddingBottom: 16, borderRadius: 8, flexDirection: 'row', justifyContent: "space-between" }}>
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{color: '#000', fontSize: 16}}>{val.WagerItems[0].SelectionDesc}<Text style={{ color: '#00A6FF', fontSize: 18 }}> @{val.WagerItems[0].Odds}</Text></Text>
                  </View>
                  {val.WagerItems[0].LineDesc &&
                  <View style={{ paddingTop: 5 }}>
                    <Text style={{ color: '#BCBEC3', width: width * 0.6, fontSize: 14 }}>{val.WagerItems[0].LineDesc}</Text>
                  </View>
                  }
                </View>
                <View style={[styles.cashoutPopupStatusBox,statusBgColor]}>
                  <Text style={[styles.cashoutPopupStatusText,statusTextColor]}>{statusName}</Text>
                </View>
              </View>
              <View style={{ width: width - 16*4, backgroundColor: '#fff', borderColor: '#EFEFF4', borderTopWidth: 1, paddingTop: 6, paddingBottom: 6 }}>
                {val.WagerItems.map(item => (
                  <View key={item.EventId} style={{ paddingTop: 10, paddingBottom: 10 }}>
                    <View>
                      {val.WagerItems[0].IsOutRightEvent
                        ? <Text style={{ fontSize: 12, color: '#000' }}>{val.WagerItems[0].OutRightEventName}</Text>
                        : <Text style={{ fontSize: 12, color: '#000' }}>{val.WagerItems[0].HomeTeamName} VS {val.WagerItems[0].AwayTeamName} {this.getWagerScore(val.WagerItems[0])}</Text>
                      }
                      <View>

                      </View>
                    </View>
                    <Text style={{ color: '#BCBEC3', fontSize: 12, paddingTop: 5 }}>{val.WagerItems[0].LeagueName}</Text>
                    <Text style={{ color: '#BCBEC3', fontSize: 12, paddingTop: 5 }}>开赛时间：{val.WagerItems[0].getEventDateMoment().format('MM/DD HH:mm')}</Text>
                  </View>
                ))}
                <View style={{ borderColor: '#dde0e6', borderTopWidth: 1, marginTop: 6, paddingTop: 16, paddingBottom: 16 }}>
                  <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                    <Text style={{ color: '#999', fontSize: 12 }}>投注额：<Text style={{ color: '#000', fontWeight: 'bold' }}>￥{val.BetAmount}</Text></Text>
                    {/*<Text style={{ color: '#999', fontSize: 12, paddingTop: 3 }}>可赢金额：<Text style={{ color: '#000', fontWeight: 'bold' }}>￥{val.PotentialPayoutAmount}</Text></Text>*/}
                    <Text style={{ color: '#999', fontSize: 12, paddingTop: 3 }}>兑现金额：<Text style={{ color: '#000', fontWeight: 'bold' }}>￥{val.CashOutPrice}</Text></Text>
                  </View>
                </View>
              </View>
            </View>
            : <View style={{ backgroundColor: '#fff', marginTop: 0, width: width - 16*2, borderRadius: 8 }}>
              <View style={{ justifyContent: "center", alignItems: 'center', backgroundColor: '#fff', paddingTop: 20, paddingBottom: 16, borderRadius: 8 }}>
                <View style={{ flexDirection: 'row', width: width - 16*4, top: -5 }}>
                  <View style={{ flex: 1, flexDirection: 'row' ,alignItems: 'center', justifyContent: 'flex-start'}}>
                    <View>
                      <Text style={{ fontSize: 16, color: '#000' }}>混合投注</Text>
                    </View>
                    <View style={{ paddingLeft: 10 }}>
                      <Text style={{ fontSize: 12, color: '#666666' }}>{val.ComboTypeName} X {val.ComboCount} {val.Odds ? '@' + val.Odds : ''}</Text>
                    </View>
                  </View>
                  <View style={[styles.cashoutPopupStatusBox,statusBgColor]}>
                    <Text style={[styles.cashoutPopupStatusText,statusTextColor]}>{statusName}</Text>
                  </View>
                </View>
              </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                <View style={[{width: width - 16*4, backgroundColor: '#fff', borderColor: '#EFEFF4', borderTopWidth: 1, paddingTop: 6, paddingBottom: 6}, { paddingLeft: 8 }]}>
                  {val.WagerItems.map(item => (
                    <View key={item.EventId} style={{ paddingLeft: 18, paddingTop: 10, paddingBottom: 10, borderColor: '#dde0e6', borderBottomWidth: 1 }}>

                      <View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontSize: 14, color: '#000' }}>{item.SelectionDesc}<Text style={{ fontSize: 18, color: '#00A6FF' }}> @{item.Odds}</Text></Text>
                        </View>
                        <View>
                          <Text style={{ color: '#BCBEC3', fontSize: 12 }}>{item.LineDesc}</Text>
                        </View>
                      </View>
                      <View style={{ paddingTop: 10 }}>
                        {item.IsOutRightEvent
                          ? <Text style={{ color: '#000', fontSize: 12 }}>{item.OutRightEventName}</Text>
                          : <Text style={{ color: '#000', fontSize: 12 }}>{item.HomeTeamName} VS {item.AwayTeamName} {this.getWagerScore(item)}</Text>
                        }
                      </View>
                      <Text style={{ color: '#BCBEC3', paddingTop: 2, fontSize: 12 }}>{item.LeagueName}</Text>
                      <Text style={{ color: '#BCBEC3', paddingTop: 2, fontSize: 12 }}>开赛时间：{item.getEventDateMoment().format('MM/DD HH:mm')}</Text>
                    </View>
                  ))}


                  <View style={{ marginTop: 6, paddingTop: 16, paddingBottom: 16}}>
                    <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                      <Text style={{ color: '#999', fontSize: 12 }}>投注额：<Text style={{ color: '#000', fontWeight: 'bold' }}>￥{val.BetAmount}</Text></Text>
                      {/*<Text style={{ color: '#999', fontSize: 12, paddingTop: 3 }}>可赢金额：<Text style={{ color: '#eb2121', fontSize: 14, fontWeight: 'bold' }}>￥{val.PotentialPayoutAmount}</Text></Text>*/}
                      <Text style={{ color: '#999', fontSize: 12, paddingTop: 3 }}>兑现金额：<Text style={{ color: '#eb2121', fontSize: 14, fontWeight: 'bold' }}>￥{val.CashOutPrice}</Text></Text>
                    </View>
                  </View>

                </View>
              </ScrollView>
            </View>
        }
      </View>
      {
        (wagerData.CashOutStatus == CashOutStatusType.DONE || wagerData.CashOutStatus == CashOutStatusType.FAIL) &&
          <Touch
            style={styles.cashoutPopupButton}
            onPress={closePopup}
          >
            <Text style={styles.cashoutPopupButtonText}>
          {
            wagerData.CashOutStatus == CashOutStatusType.DONE && "查看已兑现单"
          }
          {
            wagerData.CashOutStatus == CashOutStatusType.FAIL && "关闭"
          }
            </Text>
          </Touch>
      }
    </>}
    </Modal>
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});

const mapDispatchToProps = {
  userInfo_getBalanceSB: ACTION_UserInfo_getBalanceSB,
};

export default connect(mapStateToProps, mapDispatchToProps)(CashOutPopup);
