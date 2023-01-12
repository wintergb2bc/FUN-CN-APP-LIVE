import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import actions from "../../lib/redux/actions/index";

import { Modal } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import CheckBox from "react-native-check-box";
import { openNewWindowList, openNewWindowListAndroid, openNewWindowListIOS, sportsName } from "../../lib/data/game";
import HTMLView from "react-native-htmlview";

const { width, height } = Dimensions.get("window");

class AnnouncementPopup extends Component {
  constructor() {
    super();
    this.state = {
      checkBox: false,
    };
  }

  close = () => {
    // 要帶分類 緩存用
    const { optionType, gameData } = this.props.announcement;
    const { checkBox } = this.state;
    console.log(`save ann${this.props.userInfo.username}${optionType}`)
    if(checkBox){
      global.storage.save({
        key: `ann${this.props.userInfo.username}`,
        id: optionType,
        data: true,
        expires: null,
      });
    }
    console.log('gameCode ',gameData?.provider)
    if(sportsName.includes(gameData?.provider)){
      this.props.closePopup();
      setTimeout(() => {
        this.props.sportGamePopup(gameData.provider);      
      }, 500);
    } else {
      this.props.closePopup();
    }
  }

  render() {
    const { announcementData } = this.props.announcement;
    const { checkBox } = this.state;
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={true}
        // visible={true}
        maskClosable={true}
        onClose={()=> {
          this.close();
        }}
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
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 24
          }}
        >
          <View style/>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold' }}>重要公告</Text>
          <Touch onPress={() => {
            this.close();
          }} style={{}}>
            <Image resizeMode='stretch' source={require('../../images/icon/closeWhite2.png')}
                   style={{ width: 14, height: 14 }}/>
          </Touch>
        </View>
        <View style={styles.successModal}>

          <Text style={{
            color: "#222",
            fontWeight: "bold",
            fontSize: 16,
            marginBottom: 16,
            marginTop: 18
          }}>{announcementData.topic}</Text>
          <HTMLView
            value={`<div>${announcementData.content}</div>`}
            style={{ width: "100%", textAlign: "center" }}
            stylesheet={styleHtmls}
          />
          {/*<Text style={{*/}
          {/*  color: "#000",*/}
          {/*  fontSize: 14,*/}
          {/*  lineHeight: 22,*/}
          {/*  marginBottom: 25*/}
          {/*}}>*/}
          {/*  {announcementData.content}*/}
          {/*</Text>*/}
          <CheckBox
            checkBoxColor={"#F2F2F2"}
            checkedCheckBoxColor={"#25AAE1"}
            onClick={() => {
              this.setState({ checkBox: !checkBox });
            }}
            isChecked={checkBox}
            rightTextView={
              <Text style={{ color: "#666", fontSize: 12, marginLeft: 10 }}>不再显示</Text>
            }
          />
          <TouchableOpacity
            onPress={() => {
              this.props.closePopup();
              LiveChatOpenGlobe();
            }}
            style={{ backgroundColor: '#00a6ff', borderRadius: 5, marginTop: 25, flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <Image resizeMode='stretch'  style={{ width: 18, height: 17 }} source={require('../../images/icon/LiveChat.png')} />
            <Text style={{
              color: '#fff',
              lineHeight: 44,
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              marginLeft: 8
            }}>在线客服</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  game: state.game,
  userInfo: state.userInfo,
  announcement: state.announcement
});
const mapDispatchToProps = (dispatch) => ({
  closePopup: () => dispatch(actions.ACTION_CloseAnnouncementPopup()),
  sportGamePopup: (code) => dispatch(actions.ACTION_OpenSport(code)),
  playGame: (data) =>
    dispatch(actions.ACTION_PlayGame(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementPopup);

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

const styleHtmls = StyleSheet.create({
  div: {
    fontSize: 12,
    lineHeight: 22,
    width: "100%",
    textAlign: "center"
  },
})
