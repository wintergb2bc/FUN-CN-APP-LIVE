/* 展示 投注線(玩法)總數  */

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
const { width, height } = Dimensions.get("window");
import { dataIsEqual } from '../../../../lib/js/util';
import React from "react";

class LinesCount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }

    //指定要監控變化的prop
    this.MonitorProps = ['TotalLineCount'];
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  //優化效能：只有指定的prop變化時才要重新渲染
  shouldComponentUpdate(nextProps, nextState) {
      return !dataIsEqual(this.props.EventData, nextProps.EventData, this.MonitorProps);
  }

  render() {
    const { EventData, ListDisplayType, ToSportsDetails,Vendor } = this.props;

    return EventData ? (
      <Touch onPress={() => {ToSportsDetails(Vendor, EventData)}} style={{flexDirection: 'row'}}>
        <Text style={{ fontSize: 12, color: '#bcbec3' }}>+{EventData.TotalLineCount !== '' && EventData.TotalLineCount}</Text>
        {
          ListDisplayType == 2 &&
          <View 
          style={{
            top: 3,
            width: 8,
            height: 8,
            borderColor:'#666',
            borderRightWidth:1,
            borderBottomWidth:1,
            transform:[{rotate: '-45deg'}],
          }}
        />
        }
      </Touch>
    ) : null
  }
}

export default LinesCount