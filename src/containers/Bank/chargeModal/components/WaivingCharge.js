import { View, Text, StyleSheet, Platform } from 'react-native'
import React from 'react'

const WaivingCharge = (props) => {
  const { appliedData } = props
  console.log('appliedData', appliedData)
  return (
    <View style={{ margin: 5, }}>
      <Text style={[styles.order]}>
        注意：交易成功后，才会扣除免手续费的次数。
        <Text>剩余 <Text style={{ color: '#F92D2D' }}>{appliedData.totalWaiveRemain || '0'}</Text> 笔交易免手续费。</Text>
      </Text>
    </View>
  )
}

export default WaivingCharge

const styles = StyleSheet.create({
  order: {
    textAlign: 'left',
    color: '#222222',
    lineHeight: 20,
  },
})