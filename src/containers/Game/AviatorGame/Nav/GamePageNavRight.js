import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  WebView,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { connect } from "react-redux";
import Touch from "react-native-touch-once";

import actions from "$LIB/redux/actions/index";
import { getMoneyFormat } from '@/containers/Common/CommonFnData'
import { Actions } from "react-native-router-flux";
import { Toast } from "antd-mobile-rn";

class GamePageNavRight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openBalInfo: false,
    };
  }

  componentWillMount() {
    this.props.userInfo_getBalance(true)
    // console.log('this.props.userInfo', this.props.userInfo)
  }

  openBalInfoHandler() {
    window.openBalanceInform && window.openBalanceInform()
    this.setState({ openBalInfo: !this.state.openBalInfo })
  }

  render() {
    const { openBalInfo } = this.state
    const { allBalance } = this.props.userInfo

    const balance = allBalance.filter((item, index) => {
      return item.name == "P2P"
    })[0]

    const Reload = () => {
      return (
        <View style={{ right: 15 }}>
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20 }}
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
              source={require("@/images/icon/more.png")}
              style={{ width: 28, height: 28 }}
            />
          </TouchableOpacity>
        </View>
      );
    };
    
    const WorldCupButton = () => {
      return (
        <TouchableOpacity
          style={{ marginRight: 20, alignItems: "center", justifyContent: "center", alignSelf: "center" }}
          onPress={() => {
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
            source={require("../../../../images/worldCup/WCIcon.png")}
            style={{ width: 25, height: 25}}
          />
          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={{ fontSize: 8, color: "#FFFDF7", fontWeight: "bold" }}>世界杯</Text>
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
      )
    }

    return (
      <>
        {
          this.props.form === "sbBottomNav" || (this.props.gameInfo && this.props.gameInfo.result && this.props.gameInfo.result.provider == 'SPR') ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={this.openBalInfoHandler.bind(this)}
                style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10, marginRight: 10, paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}
              >
                <View style={{ alignItems: "flex-end", marginRight: 5, }}>
                  <Text style={{ fontSize: 10 }}>双赢棋牌/小游戏</Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold' }}>¥ {getMoneyFormat(balance.balance)}</Text>
                </View>
                <Image
                  resizeMode="stretch"
                  source={openBalInfo ? require("@/images/icon/icon-Up.png") : require("@/images/icon/icon-Down.png")}
                  style={{ width: 16, height: 16 }}
                />
              </TouchableOpacity>
              {this.props.event.worldCupTabOpen && this.props.form !== "sbBottomNav" && (
                  <WorldCupButton />
                )
              }
              <Touch
                onPress={() => {
                  LiveChatOpenGlobe();
                  PiwikEvent("CS", "Launch", "CS_GameNavigation");
                }}
                style={{ marginRight: 10, }}
              >
                <Image
                  resizeMode="stretch"
                  source={require("@/images/cs.png")}
                  style={{ width: 28, height: 28 }}
                />
              </Touch>
            </View>
          ) : (
            <View style={{ right: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
              {this.props.event.worldCupTabOpen && (
                  <WorldCupButton />
                )
              }
              <Reload />
            </View>
          )
        }
      </>

    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  gameInfo: state.gameInfo,
  event: state.event
});
const mapDispatchToProps = (dispatch) => ({
  userInfo_getBalance: (forceUpdate = false) =>
    dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GamePageNavRight);
