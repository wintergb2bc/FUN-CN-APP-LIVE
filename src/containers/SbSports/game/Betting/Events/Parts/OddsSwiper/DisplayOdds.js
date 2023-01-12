/* 展示 一個賠率 包含賠率上下變化  */

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
import { dataIsEqual } from '../../../../../lib/js/util';
const { width, height } = Dimensions.get("window");
import React from "react";

class DisplayOdds extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}

		//指定要監控變化的prop
		this.MonitorProps = ['DisplayOdds'];
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.UpOrDown !== nextProps.UpOrDown) {
		  return true;
		}
		return !dataIsEqual(this.props.SelectionData, nextProps.SelectionData, this.MonitorProps);
	  }

	render() {
		const { SelectionData, UpOrDown } = this.props;

		//console.log('===DisplayOdds',UpOrDown);

		// let thisClassName = "Number-black";
		// if (UpOrDown === 'UP') {
		// 	thisClassName = "red"
		// } else if (UpOrDown === 'DOWN') {
		// 	thisClassName = "green"
		// }

		return SelectionData ? (
			<View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
				<Text
					style={
						UpOrDown === 'UP' ? styles.red
							:
							UpOrDown === 'DOWN' ? styles.green
								: styles.black
					}
				>
					{SelectionData.DisplayOdds}
				</Text>
				{/* { UpOrDown === 'UP' ? <img src="/svg/betting/round-up.svg" className="Betting-up-svg" /> : null}
				{ UpOrDown === 'DOWN' ? <img src="/svg/betting/round-down.svg" /> : null} */}
				<View>
				{ UpOrDown === 'UP' ? <Image resizeMode='stretch' source={require('../../../../../images/betting/round-up.png')} style={{ width: 6, height: 6 }} /> : null}
				{ UpOrDown === 'DOWN' ? <Image resizeMode='stretch' source={require('../../../../../images/betting/round-down.png')} style={{ width: 6, height: 6 }} /> : null}
				</View>
			</View>
		) : (
				<View >
				</View>
			)
	}
}

export default DisplayOdds

const styles = StyleSheet.create({
	red: {
		fontSize: 13,
		color: 'red',
		paddingLeft: 5,
		fontWeight: '500',
	},
	green: {
		fontSize: 13,
		color: '#0ccc3c',
		paddingLeft: 5,
		fontWeight: '500',
	},
	black: {
		fontSize: 13,
		color: '#000',
		paddingLeft: 5,
		fontWeight: '500',
	},
});
