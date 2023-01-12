import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import actions from "../../../lib/redux/actions/index";
import { Actions } from "react-native-router-flux";

import { Modal } from "antd-mobile-rn";
import moment from 'moment';
import Touch from "react-native-touch-once";

const { width, height } = Dimensions.get("window");

class SelfExclusionPopup extends Component<{}> {
  constructor() {
    super();
    this.state = {};
  }

  getExcludeDay = () => {
    const { selfExclusionSettingID, selfExcludeDuration } = this.props.userSetting.selfExclusions;
    if (selfExclusionSettingID == 3) {
      return "永久";
    } else {
      return selfExcludeDuration + "天";
    }
  }

  render() {
    console.log(this.props.userSetting)
    const { selfExcludeSetDate } = this.props.userSetting.selfExclusions;
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={true}
        // visible={true}
        style={{
          padding: 0,
          width: width / 1.1,
          borderRadius: 10,
          paddingTop: 0,
        }}
      >
        <View
          style={{
            backgroundColor: "#00A6FF",
            height: 44,
            marginHorizontal: -15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold' }}>自我限制</Text>
        </View>
        <View style={styles.successModal}>
          <Touch style={{ paddingTop: 24, paddingBottom: 24 }} onPress={() => {
            this.props.closePopup(false);
            Actions.pop();
            LiveChatOpenGlobe();
          }}>
            <Text style={{
              color: "#000",
              fontSize: 14,
              lineHeight: 22
            }}>您在 {moment(selfExcludeSetDate).format('YYYY/MM/DD')} 已成功设定（{this.getExcludeDay()}）自我行为控制，如需要任何帮助，请联系<Text
              style={{ color: '#00a6ff', fontSize: 14 }}>在线客服</Text>。
            </Text>
          </Touch>
          <TouchableOpacity
            onPress={() => {
              this.props.closePopup(false);
              Actions.pop();
            }}
            style={{ backgroundColor: '#00a6ff', borderRadius: 5 }}>
            <Text style={{
              color: '#fff',
              lineHeight: 44,
              textAlign: 'center',
              width: width - 80,
              fontSize: 16,
              fontWeight: 'bold'
            }}>知道了</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  userSetting: state.userSetting,
});
const mapDispatchToProps = (dispatch) => ({
  closePopup: (open) =>
    dispatch(actions.ACTION_SelfExclusionsPopup(open)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelfExclusionPopup);

const styles = StyleSheet.create({
  successModal: {
    // width: width / 1.2,
    // height: height / 3,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
});
