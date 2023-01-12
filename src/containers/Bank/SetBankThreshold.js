import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  Text,
  TextStyle,
  Button,
  View,
  TextInput,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Flex, Carousel, WhiteSpace, WingBlank, InputItem, Toast } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';

const { width, height } = Dimensions.get('window')

class SetBankThreshold extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thresholdTime: this.props.withdrawalThresholdCount || 0, // 提款次數
      thresholdAmount: this.props.withdrawalThresholdAmount || 0, // 提款金額
      thresholdPercent: this.props.withdrawalThresholdPercent || 0, // 限額百分比
      thresholdTimeST: '',  // 提款次數提示
      thresholdAmountST: '',  // 提款次數提示
      thresholdPercentST: '',// 限額百分比提示
      tipVisible: false,
      check1: false,
      check2: false,
      check3: false,
    }
  }

  componentDidMount() {
    this.checkThresholdTime(this.state.thresholdTime);
    this.checkSetThresholdAmount(this.state.thresholdAmount);
    this.thresholdPercent(this.state.thresholdPercent)
  }

  thresholdPercent(val) { // 限額百分比
    if (val * 1 >= 1 && val * 1 <= 100) {
      return this.setState({ thresholdPercent: val + '', check3: true })
    } else {
      return this.setState({ thresholdPercent: val + '', check3: false })
    }
  }


  setThresholdTime(val) { // 提款次數
    let money = val.replace(/,/gi, '')
    this.checkThresholdTime(money);
  }

  checkThresholdTime = (val) => {
    const min = 1;
    const max = 999999999;
    if (val * 1 >= min && val * 1 <= max) {
      return this.setState({ thresholdTime: val, thresholdTimeST: '', check1: true })
    } else {
      return this.setState({ thresholdTime: val, check1: false })
    }
  }

  setThresholdAmount(val) { // 提款限額
    let money = val.replace("￥ ", "").replace(/,/gi, '')
    this.checkSetThresholdAmount(money);
  }

  checkSetThresholdAmount = (val) => {
    const min = 1;
    const max = 999999999;
    if (val * 1 >= min && val * 1 <= max) {
      return this.setState({ thresholdAmount: val, check2: true })
    } else {
      return this.setState({ thresholdAmount: val, check2: false })
    }
  }

  UpdateMemberWithdrawalThreshold() { // 獲取特定銀行卡提現紀錄
    const { thresholdTime, thresholdAmount, thresholdPercent, check1, check2, check3 } = this.state

    if (!thresholdTime || !thresholdAmount || !thresholdPercent) return;
    if (!check1 || !check2 || !check3) return;

    const data = {
      withdrawalThresholdAmount: Number(thresholdAmount.replace(/,/gi, '')),
      withdrawalThresholdCount: Number(thresholdTime.replace(/,/gi, '')),
      threshold: thresholdPercent,
      updatedBy: memberCode,
    };

    Toast.loading('提交中，请稍候...', 2)
    fetchRequest(ApiPort.MemberWithdrawalThreshold, 'PATCH', data)
      .then((res) => {
        Toast.hide()
        if (res != undefined) {
          if (res.isSuccess) {
            this.props.reloadMemberWithdrawalThreshold(true)
            Actions.pop()// 返回上頁
            // setTimeout(() => { Actions.pop() }, 1000)
          } else {
            Toast.fail('未更新')
          }
        }
      })
      .catch((error) => console.log(error))
  }

  TipThreshold(param) {
    this.setState({ tipVisible: param })
  }

  render() {
    const {
      thresholdTime,
      thresholdAmount,
      thresholdPercent,
      check1,
      check2,
      check3
    } = this.state

    window.displayTipThreshold = (param) => {
      this.TipThreshold(param)
    }

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 15 }}>
        <>
          <Text style={{ lineHeight: 25, color: '#666666' }}>提款次数</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={thresholdTime}
              placeholder=''
              keyboardType="numeric"
              placeholderTextColor="#999999"
              style={{ textAlign: 'left', paddingLeft: 10, width: width - 60 }}
              onChangeText={(value) => {
                let val = value.replace(/[^0-9]+/g, "");
                this.setThresholdTime(val)
              }}
              maxLength={16}
            />
          </View>
          <View style={styles.noticeWrap}>
            {this.state.check1 ? (
              <Image
                resizeMode="stretch"
                source={require("../../images/icon/ok.png")}
                style={{ width: 14, height: 14, marginRight: 8 }}
              />
            ) : (
              <Image
                resizeMode="stretch"
                source={require("../../images/icon/notOk.png")}
                style={{ width: 14, height: 14, marginRight: 8 }}
              />
            )}

            <Text style={styles.description}>只许使用数字1-999,999,999</Text>
          </View>

          <Text style={{ lineHeight: 25, color: '#666666', marginTop: 20 }}>提款金额</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={thresholdAmount}
              placeholder=''
              keyboardType="numeric"
              placeholderTextColor="#999999"
              style={{ textAlign: 'left', paddingLeft: 10, width: width - 60 }}
              onChangeText={(value) => {
                let val = value.replace(/[^0-9]+/g, "");
                this.setThresholdAmount(val)
              }}
              maxLength={16}
            />
          </View>
          <View style={styles.noticeWrap}>
            {this.state.check2 ? (
              <Image
                resizeMode="stretch"
                source={require("../../images/icon/ok.png")}
                style={{ width: 14, height: 14, marginRight: 8 }}
              />
            ) : (
              <Image
                resizeMode="stretch"
                source={require("../../images/icon/notOk.png")}
                style={{ width: 14, height: 14, marginRight: 8 }}
              />
            )}

            <Text style={styles.description}>只许使用数字1-999,999,999</Text>
          </View>

          <Text style={{ lineHeight: 25, color: '#666666', marginTop: 20 }}>限额百分比(%)</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={thresholdPercent}
              placeholder=''
              keyboardType="numeric"
              placeholderTextColor="#999999"
              style={{ textAlign: 'left', paddingLeft: 10, width: width - 60 }}
              onChangeText={(value) => {
                let val = value.replace(/[^0-9]+/g, "");
                this.thresholdPercent(val)
              }}
              maxLength={16}
            />
          </View>
          <View style={styles.noticeWrap}>
            {this.state.check3 ? (
              <Image
                resizeMode="stretch"
                source={require("../../images/icon/ok.png")}
                style={{ width: 14, height: 14, marginRight: 8 }}
              />
            ) : (
              <Image
                resizeMode="stretch"
                source={require("../../images/icon/notOk.png")}
                style={{ width: 14, height: 14, marginRight: 8 }}
              />
            )}

            <Text style={styles.description}>只许使用数字1-100%</Text>
          </View>

          <Touch
            onPress={() => {
              this.UpdateMemberWithdrawalThreshold();
              PiwikEvent('Save_Limitsetting_withdrawalmanagement')
            }}
            style={{
              backgroundColor: (check1 && check2 && check3) ? '#00A6FF' : '#EFEFF4',
              borderRadius: 8,
              marginTop: 20,
              height: 44
            }}
          >
            <Text style={{
              color: (check1 && check2 && check3) ? '#fff' : '#BCBEC3',
              lineHeight: 44,
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold'
            }}>保存</Text>
          </Touch>
        </>

        <View style={{ backgroundColor: '#F5F5F5', padding: 12, marginTop: 20, borderRadius: 8, marginBottom: 75 }}>
          <Text style={{ color: '#999', lineHeight: 20, fontSize: 12 }}>
            限额设置适用于所有提款银行账户。例：{"\n"}
            提款次数= 50,{"\n"}
            提款金额= 100,000{"\n"}
            限额百分比= 50％{"\n"}
            当您成功提款25笔或提款总额达50,000元人民币至同一银行账户时, 系统将会提醒您注意账户安全，建议您添加或更换新的银行账户。
          </Text>
        </View>
      </ScrollView>
    )
  }
}

export default SetBankThreshold;

const styles = StyleSheet.create({
  inputRow: {
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E3E3E8',
    borderRadius: 8,
  },
  description: {
    lineHeight: 25,
    color: '#666666',
    fontSize: 12
  },
  arrow: {
    height: 0,
    width: 0,
    borderWidth: 10,
    borderStyle: 'solid',
    borderBottomColor: '#000000CC',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    position: 'absolute',
    top: -20,
    right: Platform.OS == 'ios' ? 63 : 50,
  },
  noticeWrap: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    height: 41,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 8
  }
});
