import React, { Component } from 'react';
import { Text, View, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, StyleSheet, } from 'react-native';
import { connect } from "react-redux";
import CsCallIcon from './CsCallIcon'

const { width, height } = Dimensions.get('window')

class ToggleVipCsCall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <View>
        {this.props.csCall.isVip && <CsCallIcon />}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  csCall: state.csCall
});
export default connect(mapStateToProps)(ToggleVipCsCall);

const styles = StyleSheet.create({

})