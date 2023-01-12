import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import PiwikAction from "../../lib/utils/piwik";
import { Toast } from "antd-mobile-rn";


class GamePageHeaderRight extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{ right: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
        <TouchableOpacity
          style={{ marginRight: 12, alignItems: "center", justifyContent: "center" }}
          onPress={() => {
            PiwikAction.SendPiwik(`WCIcon_GameHeader`);
            if (isGameLock) {
              Toast.fail("您的账户已被锁，请联系在线客服。", 2);
              return;
            }
            Actions.SbSports({
              sbType: 'IPSB',
              SportId: 2022
            });
          }}
        >
          <Image
            resizeMode="stretch"
            source={require("../../images/worldCup/WCIcon.png")}
            style={{ width: 28, height: 28, marginBottom: 2 }}
          />
          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={{ fontSize: 10, color: "#FFFDF7", fontWeight: "bold" }}>世界杯</Text>
            <View style={{
              backgroundColor: "#F92D2D",
              borderRadius: 2,
              justifyContent: "center",
              alignItems: "center",
              width: 11,
              height: 11,
              marginLeft: 1
            }}>
              <Text style={{ fontSize: 7, color: "#fff", fontWeight: "bold" }}>热</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            window.openmenuX && window.openmenuX();
          }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 0,
          }}
        >
          <Image
            resizeMode="stretch"
            source={require("../../images/icon/more.png")}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  game: state.game,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GamePageHeaderRight);
