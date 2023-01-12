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
import { Actions } from "react-native-router-flux";
import actions from "$LIB/redux/actions/index";
import { gameCategoryT } from "$LIB/data/game";

class GamePageNavLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() { }

  componentWillUnmount() { }


  render() {
    const gameCategoriesTitle = gameCategoryT[this.props.game.gameCategory] || "";
    console.log('this.props.gameInfo ',this.props)
    return (
      <>
        {
          this.props.form === "sbBottomNav" || (this.props.gameInfo && this.props.gameInfo.result && this.props.gameInfo.result.provider == 'SPR') ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              {!this.props.hideBack && (
                <TouchableOpacity
                  onPress={() => { Actions.pop() }}
                  style={{ marginLeft: 15 }}
                >
                  <Image
                    resizeMode="contain"
                    source={require("@/images/icon-white.png")}
                    style={{ width: 26, height: 26 }}
                  />
                </TouchableOpacity>
              )}
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>小游戏</Text>

              <TouchableOpacity
                onPress={() => { window.reloadParticularGame && window.reloadParticularGame() }}
                style={{ marginLeft: 15 }}
              >
                <Image
                  resizeMode="contain"
                  source={require("@/images/icon/refreshWhite.png")}
                  style={{ width: 26, height: 26 }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                onPress={() => Actions.pop()}
                style={{ marginLeft: 15 }}
              >
                <Image
                  resizeMode="contain"
                  source={require("@/images/icon/home.png")}
                  style={{ width: 28, height: 28 }}
                />
              </TouchableOpacity>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 0 }}>{gameCategoriesTitle}</Text>
            </View>
          )

        }
      </>

    )
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  gameInfo: state.gameInfo,
  game: state.game,
});
const mapDispatchToProps = (dispatch) => ({
  gameInfo_clear: (gameObj) =>
    dispatch(actions.ACTION_InitialGameInfo(gameObj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GamePageNavLeft);
