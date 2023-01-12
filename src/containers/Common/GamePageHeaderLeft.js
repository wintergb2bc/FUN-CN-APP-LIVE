import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import { gameCategoryT } from "../../lib/data/game";


class GamePageHeaderLeft extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const gameCategoriesTitle = gameCategoryT[this.props.game.gameCategory] || "";
    return (
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity
          onPress={() => {
            Actions.pop();
          }}
          style={{ marginLeft: 15 }}
        >
          <Image
            resizeMode="contain"
            source={require("../../images/icon/home.png")}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 8 }}>{gameCategoriesTitle}</Text>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  game: state.game,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GamePageHeaderLeft);
