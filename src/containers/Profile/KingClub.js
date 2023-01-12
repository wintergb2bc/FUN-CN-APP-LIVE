import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import AutoHeightImage from 'react-native-auto-height-image';

const { width } = Dimensions.get("window");

class KingClub extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ScrollView style={styles.viewContainer}>
        <AutoHeightImage
          width={width}
          resizeMethod="resize"
          resizeMode="stretch"
          source={require("../../images/user/Rewards-Banner.jpg")}
        />
        <TouchableOpacity
          onPress={() => {
            LiveChatOpenGlobe();
          }}
          style={{ position: "absolute", bottom: "3%", alignSelf: "center" }}
        >
          <Image style={{ width: 157, height: 40 }} resizeMode="stretch"
                 source={require("../../images/user/Rewards-Button.png")}/>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});
const mapDispatchToProps = (dispatch) => ({
  userInfo_updateMemberInfo: (data) =>
    dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(KingClub);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#001B40",
  },
});
