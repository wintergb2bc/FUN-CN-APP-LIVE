import {
  StyleSheet,
  WebView,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import SnapCarousel, {
  ParallaxImage,
  Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
import { Flex, Toast, WingBlank, WhiteSpace, Tabs, Drawer } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
const { width, height } = Dimensions.get("window");
import React from "react";
import SelectionOdds from "./SelectionOdds";
// import { ChangeSvg } from '$LIB/js/util';
// import Router from 'next/router';
import { connect } from 'react-redux';

class CorrectScoreSelectionBox extends React.Component {
  render() {
    const { Vendor, LineData, OddsUpData, OddsDownData, ClickOdds } = this.props;

    let LineDataIsLocked = false;
    let CorrectScores4HomeWin = [];
    let CorrectScores4Tie = [];
    let CorrectScores4AwayWin = [];
    let CorrectScores4Other = null;
    const correctScoreInfo = Vendor.splitCorrectScoreSelectionsFromLine(LineData);
    if (correctScoreInfo) {
      LineDataIsLocked = correctScoreInfo.lineData.IsLocked;
      CorrectScores4HomeWin = correctScoreInfo.homes;
      CorrectScores4Tie = correctScoreInfo.ties;
      CorrectScores4AwayWin = correctScoreInfo.aways;
      CorrectScores4Other = correctScoreInfo.other;
    }

    let width = this.props.detailWidth
    return <View>
      <View style={{  width: width, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        { [CorrectScores4HomeWin, CorrectScores4Tie, CorrectScores4AwayWin].map((selections,index) => {
          return <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 4}} key={index}>
            {selections.map((item, selectionIndex) => {
              return <SelectionOdds
                key={selectionIndex}
                Vendor={Vendor}
                SelectionData={item}
                LineIsLocked={LineDataIsLocked}
                OddsUpData={OddsUpData}
                OddsDownData={OddsDownData}
                ClickOdds={ClickOdds}
                SelectionCountInLine={1}
                EventType="CORRECTSCORE"
              />
            })}
          </View>
        })}
      </View>
      { CorrectScores4Other ?
        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 4}}>
          <SelectionOdds
            Vendor={Vendor}
            SelectionData={CorrectScores4Other}
            LineIsLocked={LineDataIsLocked}
            OddsUpData={OddsUpData}
            OddsDownData={OddsDownData}
            ClickOdds={ClickOdds}
            SelectionCountInLine={1}
            EventType="CORRECTSCORE"
          />
        </View> : null }
    </View>
  }
}

export default CorrectScoreSelectionBox;

const styles = StyleSheet.create({
  listData: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  SelectionHeader1: {
    backgroundColor: '#f7f7f7',
    height: 38,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    borderRadius: 5,
    paddingLeft: 8,
    paddingRight: 8,
  },
  SelectionHeader2: {
    backgroundColor: '#f7f7f7',
    height: 38,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 5,
  },
  SelectionHeader3: {

    backgroundColor: '#f7f7f7',
    height: 38,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 5,
  }
})
