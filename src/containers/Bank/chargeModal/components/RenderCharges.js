import { View, Text, StyleSheet, Platform } from 'react-native'
import React from 'react'

const RenderCharges = (props) => {
  const { appliedData } = props

  const moneyFormat = (money) => {
    return Number(money.toFixed(2))
  }

  const getRealAmountHandler = () => {
    return appliedData.uniqueAmount + removeMinusHandler(appliedData.charges)
  }

  const removeMinusHandler = (val) => {
    return Math.abs(val).toString().replace('-', '')
  }

  return (
    <View style={{ margin: 5, backgroundColor: '#F3F3F3', padding: 10, borderRadius: 10, }}>
      <Text style={[styles.order]}>存款金额：{moneyFormat(appliedData.uniqueAmount) || ''}</Text>
      <Text style={[styles.order]}>第三方额外收费：{removeMinusHandler(appliedData.charges) || '0'}</Text>
      <Text style={[styles.order]}>实际金额：{moneyFormat(appliedData.actualAmount) || getRealAmountHandler.bind(this) || ''}</Text>
    </View>
  )
}

export default RenderCharges

const styles = StyleSheet.create({
  order: {
    textAlign: 'left',
    color: '#222222',
    lineHeight: 20,
  },
})