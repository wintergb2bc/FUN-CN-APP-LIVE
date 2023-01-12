import React, { Component } from 'react';
import { Text, View, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, StyleSheet, TextInput, Clipboard, Platform, BackHandler, AppState } from 'react-native';
import { Button, Carousel, WhiteSpace, WingBlank, Flex, Toast, InputItem, Picker, List, Modal } from 'antd-mobile-rn';
import Modals from "react-native-modal";
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';

import OrderTickets from './components/OrderTickets'
import RenderCharges from './components/RenderCharges'
import WaivingCharge from './components/WaivingCharge'

const { width, height } = Dimensions.get('window')

class ChargeModal extends React.Component {
  constructor(props) {
    super(props);
  }

  closePopup(key) {
    if (key == 'liveChat') {
      LiveChatOpenGlobe()
    }
    this.props.closePop(false)
  }

  startCountDown(val) {
    // 分钟
    if (val != 0) {
      const m = parseInt(val / 60)
      const s = val % 60
      return `${m}分${s}秒`
    } else {
      return `5 分钟`
    }
  }

  render() {
    const { isVisible, appliedData, activeCode, TimeoutSeconds } = this.props

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={isVisible}
        // maskClosable={true}
        // onClose={() => {
        //   this.close();
        // }}
        style={{
          padding: 0,
          width: width / 1.1,
          borderRadius: 10,
          paddingTop: 0,
        }}
      >

        <View
          style={{
            backgroundColor: "#00A6FF",
            height: 44,
            marginHorizontal: -15,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 24
          }}
        >
          <View style />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold' }}>存款</Text>
        </View>

        <View>
          {
            ['BC', 'BCM', 'UP', 'PPB', 'OA', 'WC', 'JDP', 'QQ', 'WC'].includes(activeCode) ? (
              <View >

                <OrderTickets appliedData={appliedData} />

                {
                  appliedData && appliedData.vendorCharges && appliedData.totalWaiveRemain >= 0 &&
                  <RenderCharges appliedData={appliedData} />
                }

                {
                  appliedData && appliedData.totalWaiveRemain ? (
                    <WaivingCharge appliedData={appliedData} />
                  ) : null
                }

                {
                  ['PPB'].includes(activeCode) ? (
                    <View style={{ width: width - 65, borderRadius: 8, backgroundColor: '#FFF5BF', marginVertical: 10, }}>
                      <Text style={{ color: '#83630B', fontSize: 12, lineHeight: 20, padding: 10 }}>
                        乐天使温馨提醒:请在{this.startCountDown(TimeoutSeconds)}之内完成支付，以免到账延迟。
                      </Text>
                    </View>
                  ) : null
                }

                {
                  ['QQ'].includes(activeCode) ? (
                    <View style={{ width: width - 65, borderRadius: 8, backgroundColor: '#FFF5BF', marginVertical: 10, }}>
                      <Text style={{ color: '#83630B', fontSize: 12, lineHeight: 20, padding: 10 }}>
                        乐天使温馨提醒：请勿使用 QQ 添加陌生账号或是私自汇款给对方，以免遇到诈骗。如任何损失，乐天堂以概不负责。
                      </Text>
                    </View>
                  ) : null
                }

                <Touch
                  onPress={this.closePopup.bind(this)}
                  style={[styles.submitBtn, { width: width - 60, }]}
                >
                  <Text style={[{ color: '#fff', lineHeight: 40, textAlign: 'center', fontWeight: 'bold' }]}>我知道了</Text>
                </Touch>
              </View>
            ) : null
          }
        </View>

      </Modal>
    );
  }
}

export default (ChargeModal);

const styles = StyleSheet.create({
  submitBtn: { // 右按鈕樣式
    backgroundColor: "#00A6FF",
    borderRadius: 7,
    alignSelf: 'center',
    marginVertical: 10
  },
})