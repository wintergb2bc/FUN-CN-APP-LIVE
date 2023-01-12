import React, { Component } from 'react'
import { View, Image, Text, StyleSheet, Dimensions, Platform } from 'react-native'
import { connect } from 'react-redux'

const { width, height } = Dimensions.get("window");
class TabIconWCP extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    let selected = this.props.focused
    let data = {
      home1: {
        title: `首页`,
        icon: !selected ? require('../../images/home/home.png') : require('../../images/home/home1.png'),
        width: 18.5,
        height: 18.5
      },
      personal: {
        title: `我的`,
        icon: !selected ? require('../../images/home/user.png') : require('../../images/home/user1.png'),
        width: 22,
        height: 22,
      },
      vip: {
        title: `VIP`,
        icon: !selected ? require('../../images/home/vip.png') : require('../../images/home/vip2.png'),
        width: 22,
        height: 22
      },
      WorldCup: {
        title: `世界杯`,
        key: "worldCup",
        icon: !selected ? require('../../images/worldCup/WC_HomepageButton-CN.png') : require('../../images/worldCup/WC_HomepageButton-CN.png'),
        width: 62,
        height: 62
      },
      BettingRecord: {
        title: `投注记录`,
        icon: !selected ? require('../../images/home/betHistory.png') : require('../../images/home/betHistory1.png'),
        width: 22,
        height: 22,
      },
      Aviator: {
        title: `夺金战机`,
        key: 'Aviator',
        icon: !selected ? require('../../images/home/Aviator.png') : require('../../images/home/Aviator.png'),
        width: 22,
        height: 22,
      },
      promotion: {
        title: `优惠`,
        icon: !selected ? require('../../images/home/promo.png') : require('../../images/home/promo1.png'),
        width: 22,
        height: 22,
      },
    }
    let navigationKey = this.props.navigation.state.key

    let param = data[navigationKey]

    return <View style={{
      width: Platform.OS == 'ios' ? width / 9.1 : width / 7.5,
      backgroundColor: param.key === "worldCup" ? "transparent" : "#fff",
      alignItems: 'center',
      height: param.key === "worldCup" ? 74 : 66,
      paddingVertical: param.key === "worldCup" ? 0 : 10,
      marginBottom: param.key === "worldCup" ? 10 : 0,
      zIndex: param.key == 'Aviator' ? 99999 : 0
    }}>
      <Image resizeMode='stretch'
        style={[styles.tabIconImg, {
          width: param.width,
          height: param.height,
          marginTop: param.key === "worldCup" ? -20 : 0,
        }]}
        source={param.icon} />
      <Text style={{ color: !selected ? '#999999' : '#00A6FF', fontSize: 10 }}>{param.title}</Text>

      {param.key == 'Aviator' && (
        <>
          {
            this.props.gameMaintainStatus && this.props.gameMaintainStatus.isComingSoon ? (
              <View style={{ backgroundColor: '#FF4141', position: 'absolute', top: 3, right: -12, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 3, width: 44 }}>
                <Text style={{ color: '#fff', fontSize: 8 }}>敬请期待</Text>
              </View>
            ) : this.props.gameMaintainStatus && this.props.gameMaintainStatus.isNew ? (
              < Image
                resizeMode='stretch'
                source={require('@/images/icon/new.png')}
                style={{ width: 16, height: 16, position: 'absolute', top: 2, right: -2, }}
              />
            ) : null
          }
        </>
      )}
    </View>

  }
}

export default TabIconWCP = connect(
  (state) => {
    return {
      gameMaintainStatus: state.gameInfo.maintainStatus
    }
  }, (dispatch) => {
    return {}
  }
)(TabIconWCP)

const styles = StyleSheet.create({
  tabbarContainer: {
    flex: 1,
    width: width / 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
  },
  tabIconImg: {
    marginBottom: 10
  },
})
