import React from 'react';
import { Text, View, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import PiwikAction from "../../lib/utils/piwik";
import { connect } from "react-redux";
import actions from "../../lib/redux/actions";

const { width, height } = Dimensions.get("window");
let data = {
  SbSports: {
    title: `首页`,
    selected: require('../../containers/SbSports/images/homeNav.png'),
    unselect: require('../../containers/SbSports/images/homeNav1.png'),
    imgWidthSelected: 56,
    imgWidthUnSelect: 46,
    imgHeightSelected: 36,
    imgHeightUnSelect: 26,
  },
  personalSBWrap: {
    title: `菜单`,
    selected: require('../../images/home/menu.png'),
    unselect: require('../../images/home/menu.png'),
    imgWidthSelected: 26,
    imgWidthUnSelect: 26,
    imgHeightSelected: 26,
    imgHeightUnSelect: 26,
  },
  betRecordSBWrap: {
    title: `注单`,
    selected: require('../../images/home/betHistorySb1.png'),
    unselect: require('../../images/home/betHistorySb.png'),
    imgWidthSelected: 30,
    imgWidthUnSelect: 26,
    imgHeightSelected: 30,
    imgHeightUnSelect: 26,
  },
  SbAirCraftWrap: {
    title: `夺金战机`,
    selected: require('../../images/home/airCraft1.png'),
    unselect: require('../../images/home/airCraft.png'),
    imgWidthSelected: 30,
    imgWidthUnSelect: 26,
    imgHeightSelected: 30,
    imgHeightUnSelect: 26,
  },
  promotionSBWrap: {
    title: `优惠`,
    selected: require('../../images/home/promo1.png'),
    unselect: require('../../images/home/promo.png'),
    imgWidthSelected: 30,
    imgWidthUnSelect: 26,
    imgHeightSelected: 30,
    imgHeightUnSelect: 26,
  },
};

class SbTabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  sendPiwik = (key) => {
    switch (key) {
      case "SbSports":
        PiwikAction.SendPiwik("Main_Display_SB");
        break;
      case "promotionSBWrap":
        PiwikAction.SendPiwik("PromoPage_SB");
        break;
      case "betRecordSBWrap":
        PiwikAction.SendPiwik("BetRecord_SB");
        break;
      case "SbAirCraftWrap":
        PiwikAction.SendPiwik("Aviator_InstantGames");
        break;
      case "personalSBWrap":
        PiwikAction.SendPiwik("Sidemenu_SB");
        break;
      default:
        break;
    }
  }

  render() {
    const { state } = this.props.navigation;
    const activeTabIndex = state.index;
    return (
      <View
        style={{
          paddingBottom: DeviceInfoIos ? 30 : 10,
          backgroundColor: "#FFFFFF",
        }}
      >
        <View style={[styles.headers, { alignItems: "flex-end", position: "relative" }]}>
          {
            state.routes.map((element, index) => {
              const select = activeTabIndex == index;
              return (
                <TouchableOpacity
                  key={element.key}
                  style={{ backgroundColor: "#FFFFFF", width: 56, height: 54, justifyContent: "flex-end" }}
                  onPress={() => {
                    console.log('sb tabbar onPress');
                    if (ApiPort.UserLogin && this.props.userSetting.sbTransferPopup) {
                      this.props.sbTransferToggle('close');
                    }
                    if (element.key === "SbAirCraftWrap") {
                      if (!ApiPort.UserLogin) {
                        Actions.Login({ from: "sb" });
                        return;
                      }

                      // 已經開過不需要再call，直接開頁面
                      if(this.props.gameResult.gametype === "SPR"){
                        Actions[element.key]();
                        return;
                      }
                      
                      if (!select) {
                        window.getAviator && window.getAviator("sb");
                        return;
                      }
                      
                      return;
                    }

                    window.CheckUptateGlobe &&
                    window.CheckUptateGlobe(false);
                    this.sendPiwik(element.key);
                    Actions[element.key]();
                  }}>
                  <View style={{ justifyContent: "center", alignItems: 'center' }}>
                    <Image
                      resizeMode='stretch'
                      source={select ? data[element.key].selected : data[element.key].unselect}
                      style={{
                        width: select ? data[element.key].imgWidthSelected : data[element.key].imgWidthUnSelect,
                        height: select ? data[element.key].imgHeightSelected : data[element.key].imgHeightUnSelect,
                        marginBottom: 3,
                        alignSelf: "center",
                      }}
                    />
                    <Text
                      style={{ color: select ? "#00A6FF" : "#999999", fontSize: 12 }}>{data[element.key].title}</Text>
                  </View>
                  {select && (
                    <Image resizeMode='stretch'
                           style={{
                             position: "absolute", top: -16, zIndex: 1, width: 56, height: 15, right: 0
                           }}
                           source={require('../../images/home/sbActive3.png')}
                    />
                  )}
                  {element.key === "SbAirCraftWrap" && (
                    this.props.gameMaintainStatus && this.props.gameMaintainStatus.isComingSoon ? (
                      <View style={{
                        backgroundColor: '#FF4141',
                        position: 'absolute',
                        top: 3,
                        right: -15,
                        paddingHorizontal: 5,
                        paddingVertical: 3,
                        borderRadius: 3,
                        width: 44,
                        zIndex: 99
                      }}>
                        <Text style={{ color: '#fff', fontSize: 8 }}>敬请期待</Text>
                      </View>
                    ) : this.props.gameMaintainStatus && this.props.gameMaintainStatus.isNew ? (
                      <View style={{
                        // width: 10,
                        // height: 10,
                        backgroundColor: "#FF4240",
                        borderRadius: 5,
                        paddingVertical: 3,
                        paddingHorizontal: 3,
                        position: 'absolute',
                        top: 3,
                        right: 0,
                        zIndex: 100
                      }}>
                        <Text style={{
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 'bold',
                        }}>新</Text>
                      </View>
                    ) : null
                  )}
                </TouchableOpacity>
              );
            })
          }
        </View>
      </View>
    );
  }
}


const mapStateToProps = (state) => ({
  gameMaintainStatus: state.gameInfo.maintainStatus,
  gameResult: state.gameInfo.result,
  userSetting: state.userSetting,
});
const mapDispatchToProps = {
  sbTransferToggle: () => actions.ACTION_SBTransferPopup(),
};

export default connect(mapStateToProps, mapDispatchToProps)(SbTabBar);

const styles = StyleSheet.create({
  headers: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    height: 56,
    width: width,
    backgroundColor: "#FFFFFF",
    zIndex: 99,
    // paddingHorizontal: 20 ,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    // paddingVertical: 30
  },
});
