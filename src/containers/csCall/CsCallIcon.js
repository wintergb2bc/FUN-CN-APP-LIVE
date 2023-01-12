import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, } from 'react-native';
import { connect } from "react-redux";
import actions from "@/lib/redux/actions/index";

class CsCallIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  toggleCsCallPopHandler(val) {
    this.props.showCsCallPopupHandler(val)
  }

  render() {

    return (
      <TouchableOpacity
        onPress={this.toggleCsCallPopHandler.bind(this, !this.props.csCall.showCsCallPopup)}
        style={{ borderRadius: 20, padding: 5, marginRight: 8, bottom: 5 }}
      >
        <Image
          resizeMode='stretch'
          source={require('@/images/icon/vipCsCallbank.png')}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  csCall: state.csCall
});
const mapDispatchToProps = dispatch => ({
  showCsCallPopupHandler: (val) => dispatch(actions.ACTION_ShowCsCallPopupHandler(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CsCallIcon);

const styles = StyleSheet.create({

})