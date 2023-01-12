/*
 * @Author: Alan
 * @Date: 2021-05-19 18:41:30
 * @LastEditors: Alan
 * @LastEditTime: 2021-06-23 18:56:51
 * @Description: 赛程
 * @FilePath: \Fun88-Sport-Code2.0\components\Games\Betting-detail\Smartcoach\GameTimeline\index.js
 */
import React, { Component } from 'react';
import StatisticalAnalysisData from './StatisticalAnalysisData';
import GameInsights from '../GameInsights';
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
const { width, height } = Dimensions.get("window");
import ReactNative, {
	StyleSheet,
	Text,
	Image,
	View,
	Platform,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	Linking,
	WebView,
	NativeModules,
	Alert,
	UIManager,
	Modal
} from "react-native";
class Schedule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Tabactive: 0
		};
	}

	render() {
		const { type, TimelineSocketCartogramData, TimelineSockeMatchreSultData, Vendor, EventDetail } = this.props;
		console.log('%c赛况-统计图', 'font-size:19px;color:#009688;', TimelineSockeMatchreSultData);
		return (
			<View style={{width: width,}}>
				<View>
					<Text style={{color: '#666666', fontSize: 12, lineHeight: 30, textAlign: 'center'}}>数据</Text>
					<StatisticalAnalysisData
						EventDetail={EventDetail}
						Vendor={Vendor}
						TimelineSocketCartogramData={TimelineSocketCartogramData.data}
					/>
					<Text style={{color: '#666666', fontSize: 12, lineHeight: 30, textAlign: 'center'}}>赛况</Text>
					<GameInsights
						type={type}
						EventDetail={EventDetail}
						Vendor={Vendor}
						TimelineSockeMatchreSultData={TimelineSockeMatchreSultData}
					/>
				</View>
			</View>
		);
	}
}

export default Schedule;
