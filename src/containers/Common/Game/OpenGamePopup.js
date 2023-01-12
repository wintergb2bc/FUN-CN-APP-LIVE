import React, { Component } from "react";
import { Linking } from "react-native";
import CommonModals from "../Modals";
import { connect } from "react-redux";
import actions from "../../../lib/redux/actions/index";

class OpenGamePopup extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <CommonModals.ExclamationModal
        desc={"将为您打开新的窗口"}
        onPressLeft={() => {
          this.props.clearGame();
        }}
        onPressRight={() => {
          Linking.openURL(this.props.game.url);
          this.props.clearGame();
        }}
        closeModal={() => {
          this.props.clearGame();
        }}
        leftText="取消"
        rightText="确定"
        visible={true}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  game: state.game,
});
const mapDispatchToProps = (dispatch) => ({
  clearGame: () => dispatch(actions.ACTION_ClearGameInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OpenGamePopup);
