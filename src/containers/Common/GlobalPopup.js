import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import OpenGamePopup from "./Game/OpenGamePopup";
import SportPopup from "./Game/SportPopup";
import SelfExclusionPopup from "./Game/SelfExclusionPopup";
import AnnouncementPopup from "./AnnouncementPopup";
import CsCallPopup from '@/containers/csCall';

class GlobalPopup extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {

    return (
      <>
        {this.props.game.openSportPopup && <SportPopup />}
        {this.props.announcement.announcementPopup && <AnnouncementPopup />}
        {this.props.game.openNewPageShow && <OpenGamePopup />}
        {this.props.userSetting.selfExclusionsPopup && <SelfExclusionPopup />}
        {this.props.csCall.showCsCallPopup && <CsCallPopup />}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userSetting: state.userSetting,
  game: state.game,
  userInfo: state.userInfo,
  announcement: state.announcement,
  csCall: state.csCall,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalPopup);
