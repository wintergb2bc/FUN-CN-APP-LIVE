/* 展示 投注線(Line)的頭 玩法說明(lineDesc)  */

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
import { dataIsEqual } from '../../../../../lib/js/util';
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import React from "react";

class LineDescCell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}

		//指定要監控變化的prop
		this.MonitorProps = ['PeriodName', 'BetTypeName'];
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	shouldComponentUpdate(nextProps, nextState) {
		return !dataIsEqual(this.props.LineData, nextProps.LineData, this.MonitorProps);
	}

	render() {
		const { LineData } = this.props;

		return LineData ? (
			<View>
				<Text style={{width: width * 0.24, textAlign: 'center', lineHeight: 38}}>
					{LineData.LineDesc}
				</Text>
			</View>
		) : null
	}
}

export default LineDescCell
