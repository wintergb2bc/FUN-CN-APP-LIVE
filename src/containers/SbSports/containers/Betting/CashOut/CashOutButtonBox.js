/* 投注記錄-提前兌現-按鈕區塊 */

import React from "react";
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
  Modal,
  Clipboard,
  RefreshControl,
  Button,
  ActivityIndicator,
} from "react-native";
import Touch from "react-native-touch-once";
import {CashOutStatusType} from "./../../../lib/vendor/data/VendorConsts";
import WagerData from "./../../../lib/vendor/data/WagerData";
import { Flex, Toast, WingBlank, WhiteSpace, Accordion, Tabs, TabPane, Drawer } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import styles from './CashOutStyles';

class CashOutButtonBox extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount () {
  }

  componentWillUnmount() {
  }

  //提交兌現 => 展示 重複確認UI
  doCashOut = () => {
    const { wagerData, lockWager, lockingWagerIsProcessing } = this.props;

    //檢查鎖定注單是否正在進行兌現(因為有彈窗，同時間內只能兌現一張單，其他按鈕必須不可用)
    if (lockingWagerIsProcessing) {
      Toast.error('有注單正在兌現中，請先完成當前兌現');
      return false;
    }

    lockWager(wagerData); //鎖定注單數據 - 停止(輪詢)更新
  }

  //重複確認後 提交兌現(新價格也共用這個提交，沒有差別)
  doCashOutSubmit = () => {
    const { Vendor, wagerData, updateLockingWager } = this.props;

    PiwikEvent('BetRecord','Submit',this.props.Vendor.configs.VendorName + '_Cashout');

    //提前兌現piwik日誌
    const cashoutLog = (wagerid, logJSON) => {
      //category, action, name
      console.log('=====cashoutLog', 'cashoutLog_' + this.props.Vendor.configs.VendorName , wagerid, JSON.parse(logJSON));
      PiwikEvent('cashoutLog_' + this.props.Vendor.configs.VendorName , wagerid + '', logJSON); //wagerid需要做成string型態，不然app會報錯
    }

    let cloneWagerData = WagerData.clone(wagerData); //複製一份
    cloneWagerData.CashOutStatus = CashOutStatusType.PROCESS; //切換為處理中
    updateLockingWager(cloneWagerData); //更新上層數據

    Vendor.cashOut(wagerData)
      .then(cashoutResult => {
        updateLockingWager(cashoutResult.WagerData); //直接更新上層數據
        cashoutLog(cashoutResult.WagerData.WagerId, cashoutResult.LogJSON); //日誌
      })
  }

  //取消兌現(這個只是 重複確認 的取消，不是vendor端的，不需要更新wagerData)
  doCashOutCancel = () => {
    const { unlockWager } = this.props;
    unlockWager(); //解鎖注單數據 - 繼續(輪詢)更新此注單數據
  }

  //拒絕新兌現價格
  doCashOutDecline = () => {
    const { Vendor, wagerData, updateLockingWager } = this.props;
    let cloneWagerData = WagerData.clone(wagerData); //複製一份
    cloneWagerData.CashOutStatus = CashOutStatusType.DECLINE; //切換為拒絕
    updateLockingWager(cloneWagerData); //直接更新上層數據

    //調用拒絕API(其實只有BTI需要)
    Vendor.cashOutDeclineNewOffer(wagerData);
  }

  render () {
    const { Vendor, wagerData, lockingWagerId } = this.props;
    const isLocking = (lockingWagerId == wagerData.WagerId);

    const VendorHasCashOut = Vendor.configs.HasCashOut;
    const CanCashOut = VendorHasCashOut && wagerData.CanCashOut; //vendor也有配置開關，可以暫時停用功能

    return <View
      style={[styles.cashoutButtonBox,(CanCashOut ? {} : styles.cashoutButtonBoxEmpty)]}
    >
      {/* 處理每筆投注記錄的 白底 + 下圓角 */}
      {
        CanCashOut
          ? <>
              {/*
                //   NOTYET: 0, //未兌現或不可兌現
                //   DONE: 1, //已兌現
                //   PROCESS: 2, //進行中
                //   CANCEL: 3, //取消
                //   NEWPRICE: 4, //新價格
                //   FAIL: 5, //失敗
                //   DECLINE: 6, //拒絕(by用戶)
              */}
              {
                //   NOTYET: 0, //未兌現或不可兌現 CANCEL: 3, //取消
                ((wagerData.CashOutStatus == CashOutStatusType.NOTYET || wagerData.CashOutStatus == CashOutStatusType.CANCEL) && !isLocking) &&
                  <Touch
                    style={[styles.cashoutButtonContent,styles.cashoutButtonNotyet]}
                    onPress={this.doCashOut}
                  >
                    <Text style={styles.cashoutButtonNotyetText}>兑现价格 ：￥{wagerData.CashOutPrice}</Text>
                  </Touch>
              }
              {
                //   NOTYET: 0, //未兌現或不可兌現 提交前重複確認(點兌現按鈕就會鎖定數據，可以同時拿來判斷是否展示 重複確認UI)
                ((wagerData.CashOutStatus == CashOutStatusType.NOTYET || wagerData.CashOutStatus == CashOutStatusType.CANCEL) && isLocking) &&
                  <View style={[styles.cashoutButtonContent,styles.cashoutButtonConfirmingBox]}>
                    <Text style={styles.cashoutButtonConfirmingMoney}>￥{wagerData.CashOutPrice}</Text>
                    <Text style={styles.cashoutButtonConfirmingText}>兑现价格</Text>
                    <View style={styles.cashoutButtonConfirmingButtonBox}>
                      <Touch
                        style={[styles.cashoutButtonConfirmingButton,styles.cashoutButtonConfirmingButtonCancel]}
                        onPress={this.doCashOutCancel}
                      >
                        <Text style={styles.cashoutButtonConfirmingButtonCancelText}>取消</Text>
                      </Touch>
                      <Touch
                        style={[styles.cashoutButtonConfirmingButton,styles.cashoutButtonConfirmingButtonSubmit]}
                        onPress={this.doCashOutSubmit}
                      >
                        <Text style={styles.cashoutButtonConfirmingButtonSubmitText}>确认</Text>
                      </Touch>
                    </View>
                  </View>
              }
              {
                //   NEWPRICE: 4, //新價格
                wagerData.CashOutStatus == CashOutStatusType.NEWPRICE &&
                <View style={[styles.cashoutButtonContent,styles.cashoutButtonNewpriceBox]}>
                  <Text style={styles.cashoutButtonNewpriceMoney}>￥{wagerData.CashOutPrice}</Text>
                  <Text style={styles.cashoutButtonNewpriceText}>新的兑现价格</Text>
                  <View style={styles.cashoutButtonNewpriceButtonBox}>
                    <Touch
                      style={[styles.cashoutButtonNewpriceButton,styles.cashoutButtonNewpriceButtonDecline]}
                      onPress={this.doCashOutDecline}
                    >
                      <Text style={styles.cashoutButtonConfirmingButtonDeclineText}>拒绝</Text>
                    </Touch>
                    <Touch
                      style={[styles.cashoutButtonNewpriceButton,styles.cashoutButtonNewpriceButtonAccept]}
                      onPress={this.doCashOutSubmit}
                    >
                      <Text style={styles.cashoutButtonNewpriceButtonAcceptText}>接受</Text>
                    </Touch>
                  </View>
                </View>
              }
              {
                //   PROCESS: 2, //進行中
                (wagerData.CashOutStatus == CashOutStatusType.PROCESS) &&
                  <View style={[styles.cashoutButtonContent,styles.cashoutButtonProcessBox]}>
                    <ActivityIndicator color="#999999" />
                    <Text style={styles.cashoutButtonProcessText}>等待中</Text>
                  </View>
              }
              {
                //  DONE: 1, //已兌現
                (wagerData.CashOutStatus == CashOutStatusType.DONE) &&
                <View style={[styles.cashoutButtonContent,styles.cashoutButtonDoneBox]}>
                  <Text style={[styles.cashoutButtonDoneText]}>兑现成功</Text>
                </View>
              }
              {
                //   FAIL: 5, //失敗
                (wagerData.CashOutStatus == CashOutStatusType.FAIL) &&
                <View style={[styles.cashoutButtonContent,styles.cashoutButtonFailBox]}>
                  <Text style={[styles.cashoutButtonFailText]}>兑现失败</Text>
                </View>
              }
              {
                //   DECLINE: 3, //拒絕
                (wagerData.CashOutStatus == CashOutStatusType.DECLINE) &&
                <View style={[styles.cashoutButtonContent,styles.cashoutButtonDeclineBox]}>
                  <Text style={[styles.cashoutButtonDeclineText]}>兑现取消</Text>
                </View>
              }
            </>
          : null
      }
    </View>
  }
}

export default CashOutButtonBox;
