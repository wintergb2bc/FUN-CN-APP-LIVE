
import React from 'react'
import { StyleSheet, View } from 'react-native'
import * as Animatable from 'react-native-animatable'

const AnimatableView = Animatable.View

export default class ModalDropdownArrow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { arrowFlag, flag, style = {} } = this.props
    return <AnimatableView
      transition={['borderTopColor', 'rotate', 'marginTop', 'marginBottom']}
      style={[
        styles.toreturnModalDropdownArrow,
        {
          transform: [{ rotate: `${arrowFlag ? 180 : 0}deg` }],
          marginTop: arrowFlag ? 0 : 6,
          marginBottom: arrowFlag ? 6 : 0,
          borderTopColor: flag ? '#fff' : (window.isBlue ? (arrowFlag ? '#25AAE1' : '#4B4B4B') : (arrowFlag ? '#25AAE1' : '#fff'))
        },
        style
      ]} />
  }
}

const styles = StyleSheet.create({
  toreturnModalDropdownArrow: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 6,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    // borderTopColor: '#25AAE1'
  }
})
