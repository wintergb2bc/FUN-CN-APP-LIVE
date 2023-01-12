import { View, Text, StyleSheet, Platform } from 'react-native'
import React from 'react'

const OrderTickets = (props) => {
  const { appliedData } = props
  return (
    <View style={{ margin: 5, marginTop: 20, }}>
      <Text style={[styles.order]}>订单{appliedData.transactionId || ''}创建成功。</Text>
      {(appliedData.totalWaiveRemain >= 0 && appliedData.vendorCharges) &&
        <Text style={[styles.order]}>此交易将征收第三方额外费用，详情如下。</Text>}
    </View>
  )
}

export default OrderTickets

const styles = StyleSheet.create({
  order: {
    textAlign: 'left',
    lineHeight: 20,
  },
})