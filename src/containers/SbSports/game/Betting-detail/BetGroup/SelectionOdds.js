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
// import { ChangeSvg } from '$LIB/js/util';
// import Router from 'next/router';
import { connect } from 'react-redux';

class SelectionOdds extends React.Component {

  isOddsUpOrDown = (SelectionData, list) => {
    if (SelectionData && list) {
      const thisKey = SelectionData.EventId + '|||' + SelectionData.LineId + '|||' + SelectionData.SelectionId;
      return (list.Selections[thisKey] === true);
    }
    return false;
  }

  render() {
    const {Vendor, OddsUpData, OddsDownData, SelectionData, ClickOdds, LineIsLocked, SelectionCountInLine} = this.props;
    const isComboBet = this.props.betCartInfo['isComboBet' + Vendor.configs.VendorName];
    const betCartData = this.props.betCartInfo['betCart' + Vendor.configs.VendorName];

    const IsCorrectScore = (this.props.EventType === "CORRECTSCORE");

    const Upstatus = this.isOddsUpOrDown(SelectionData, OddsUpData);
    const Downstatus = this.isOddsUpOrDown(SelectionData, OddsDownData);
    const CheckSelect = isComboBet ? betCartData.filter((i) => i.SelectionId == SelectionData.SelectionId) : [];

    let width = this.props.detailWidth
    return (
      (LineIsLocked || SelectionData.SelectionIsLocked) ? (
        <View
          style={[styles.SelectionHeader,{width: width * 0.8},
            SelectionCountInLine == 3 ? {width: width * 0.3,} : {},
            SelectionCountInLine == 2 ? {width: width * 0.4,} : {},
            { justifyContent: 'center' },
            IsCorrectScore ? {width: '100%', flexGrow: 0} : {},
          ]}
        >
          <Image resizeMode='stretch' source={require('../../../images/betting/Locked.png')} style={{ width: 15, height: 15 }} />
        </View>
      ) : (
      <Touch
        onPress={() => {
          ClickOdds(SelectionData);
        }}
        style={[styles.SelectionHeader,{width: width * 0.8},
          SelectionCountInLine == 3 ? {width: width * 0.3, flexGrow: 0, paddingHorizontal: 8, marginHorizontal:0} : {},
          SelectionCountInLine == 2 ? {width: width * 0.4,} : {},
          IsCorrectScore ? {width: '100%', flexGrow: 0} : {},
          CheckSelect != '' ? { borderColor: '#00a6ff', borderWidth: 1 } : {},
        ]}
      >
        <Text style={[{fontSize: 13},
          SelectionCountInLine == 1 ? {fontSize: 13,width: width * 0.4} : {},
          SelectionCountInLine == 3 ? {fontSize: 13,width: width * 0.15} : {},
          IsCorrectScore ? {width: 'auto'} : {},
        ]}>{SelectionData.SelectionName}</Text>
        {SelectionData.Handicap !== null ? <Text>{SelectionData.Handicap}</Text> : null}
        <View style={[
          {display: 'flex',justifyContent: 'center', alignItems: 'center', flexDirection: 'row'},
          SelectionCountInLine == 1 ? {width: width * 0.2} : {},
          IsCorrectScore ? {width: 'auto'} : {},
        ]}>
          {!SelectionData.DisplayOdds || SelectionData.DisplayOdds == 0 ? (
            <Text>—</Text>
          ) : (
            // <span
            // 	dangerouslySetInnerHTML={{
            // 		__html: ChangeSvg(SelectionData.DisplayOdds)
            // 	}}
            // 	className="NumberBet"
            // />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: Downstatus? '#0ccc3c': Upstatus? 'red': '#000'
              }}
            >
              {SelectionData.DisplayOdds}
            </Text>
          )}

          <View>
          {Downstatus ? (
            <Image resizeMode='stretch' source={require('../../../images/betting/round-down.png')} style={{ width: 6, height: 6 }} />
            // <img src="/svg/betting/round-down.svg" />
          ) : Upstatus ? (
            <Image resizeMode='stretch' source={require('../../../images/betting/round-up.png')} style={{ width: 6, height: 6 }} />
            // <img src="/svg/betting/round-up.svg" />
          ) : (
            null
          )}
          </View>
        </View>
      </Touch>
      )
    );
  }
}

const mapStateToProps = (state) => ({
  betCartInfo: state.betCartInfo,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectionOdds);

const styles = StyleSheet.create({
  listData: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  SelectionHeader: {
    backgroundColor: '#f7f7f7',
    height: 32,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 77,
    marginTop: 8,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    flexShrink: 0,
    flexGrow: 1,
  },
})
