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
import { Flex, Modal, Toast, } from "antd-mobile-rn";

class GamePageNavMiddle extends React.Component {
  render() {

    const AppLogoGamePage = () => {
      return (
        <Flex>
          {Platform.OS === "android" ? (
            <Flex.Item
              alignItems="center"
              style={{ flex: 1, marginLeft: 0, marginTop: -5 }}
            >
              <Image
                resizeMethod="resize"
                resizeMode="cover"
                source={require("@/images/home/funLogo.png")}
                style={{ width: 78.5, height: 35 }}
              />
            </Flex.Item>
          ) : (
            Platform.OS === "ios" && (
              <Flex.Item alignItems="center" style={{ marginTop: -5 }}>
                <Image
                  resizeMode="stretch"
                  source={require("@/images/home/funLogo.png")}
                  style={{ width: 78.5, height: 35 }}
                />
              </Flex.Item>
            )
          )}
        </Flex>
      );
    };

    return (
      <View>
        {
          this.props.gameInfo && this.props.gameInfo.result && this.props.gameInfo.result.provider == 'SPR' ? (
            <View />
          ) : (
            <AppLogoGamePage />
          )
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  gameInfo: state.gameInfo,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GamePageNavMiddle);