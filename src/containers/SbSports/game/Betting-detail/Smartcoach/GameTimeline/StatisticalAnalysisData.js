/*
 * @Author: Alan
 * @Date: 2021-05-19 18:44:23
 * @LastEditors: Alan
 * @LastEditTime: 2021-05-29 23:44:46
 * @Description: 赛程-足球数据统计分析
 * @FilePath: \Fun88-Sport-Code2.0\components\Games\Betting-detail\Smartcoach\GameTimeline\StatisticalAnalysisData.js
 */
import PieView from './PieView'
import React, { Component } from 'react';
import { Actions } from "react-native-router-flux";
import { Flex, Toast, Progress } from "antd-mobile-rn";
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

class StatisticalAnalysisData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Tabactive: 0
		};
	}
	componentDidMount() {
		console.log(this._container);
	}
	toPercent(point) {
		var str = Number(point * 100).toFixed(1);
		str += '%';
		return str;
	}
	render() {
		const { TimelineSocketCartogramData } = this.props;
		const {
			/* 黄牌 */
			yellow_card,
			/* 红牌 */
			red_card,
			/* 危险进攻 */
			dangerous_attacks,
			/* 攻击 */
			attacks,
			/* 角球 */
			corner,
			/* 控球率 */
			possession,
			/* 射正球门 */
			shots_on_target,
			/* 射偏球门 */
			shots_off_target
		} = TimelineSocketCartogramData.statistics;

		let option1 = {
			title: {},
			legend: {},
			color: ['#EB2121', '#00A6FF'],
			series: [{
				name: '',
				type: 'pie',
				radius: [10, 15], //饼图半径暂支持数字
				data: [attacks[1], attacks[0]], //饼图占用数据
			}]
		}
		let option2 = {
			title: {},
			legend: {},
			color: ['#EB2121', '#00A6FF'],
			series: [{
				name: '',
				type: 'pie',
				radius: [10, 15], //饼图半径暂支持数字
				data: [dangerous_attacks[1], dangerous_attacks[0]], //饼图占用数据
			}]
		}
		
		let option3 = {
			title: {},
			legend: {},
			color: ['#EB2121', '#00A6FF'],
			series: [{
				name: '',
				type: 'pie',
				radius: [10, 15], //饼图半径暂支持数字
				data: [possession[1], possession[0]], //饼图占用数据
			}]
		}
		
		return (
			<View style={{ width: width, backgroundColor: '#fff', paddingTop: 15, paddingBottom: 15, }}>
				{/* 环形图 */}
				<View style={styles.listView}>
					<View style={styles.listItem}>
						<Text style={{ color: '#666', fontSize: 12 }}>进攻</Text>
					</View>
					<View style={styles.listItem}>
						<Text style={{ color: '#666', fontSize: 12 }}>危险进攻</Text>
					</View>
					<View style={styles.listItem}>
						<Text style={{ color: '#666', fontSize: 12 }}>控球率</Text>
					</View>
				</View>
				<View style={styles.listView}>
					<View style={styles.listItem}>
						<Text style={{ color: '#000', fontSize: 12 }}>{attacks[0]}</Text>
						<PieView height={width * 0.1} width={width * 0.1} BGcolor={'#fff'} option={option1} />
						<Text style={{ color: '#000', fontSize: 12 }}>{attacks[1]}</Text>
					</View>
					<View style={styles.listItem}>
						<Text style={{ color: '#000', fontSize: 12 }}>{dangerous_attacks[0]}</Text>
						<PieView height={width * 0.1} width={width * 0.1} BGcolor={'#fff'} option={option2} />
						<Text style={{ color: '#000', fontSize: 12 }}>{dangerous_attacks[1]}</Text>
					</View>
					<View style={styles.listItem}>
						<Text style={{ color: '#000', fontSize: 12 }}>{possession[0]}</Text>
						<PieView height={width * 0.1} width={width * 0.1} BGcolor={'#fff'} option={option3} />
						<Text style={{ color: '#000', fontSize: 12 }}>{possession[1]}</Text>
					</View>
				</View>

				{/* 进度条 */}
				<View style={[styles.listView,{marginTop: 25}]}>
					<View style={styles.listItemCenter}>
						<Image resizeMode='stretch' source={require('../../../../images/betting/red-j-b.png')} style={{ width: 14, height: 14 }} />
						<View style={styles.yellowView} />
						<View style={styles.redView} />
					</View>
					<View style={styles.listItemCenter}>
						<Text style={{ color: '#000', fontSize: 12 }}>{shots_on_target[0]}</Text>
						<View style={{justifyContent: 'center',alignItems: 'center'}}>
							<Text style={{ color: '#666', fontSize: 12, position: 'absolute', top: -15 }}>射正球门</Text>
							<View style={{ backgroundColor: '#00A6FF', width: width / 5, height: 5, borderRadius: 5 }}>
								<View style={{ backgroundColor: '#EB2121', height: 5, borderRadius: 5,
												width: (width / 5) * (shots_on_target[0] / (shots_on_target[0] + shots_on_target[1]))
									}}></View>
							</View>
						</View>
						<Text style={{ color: '#000', fontSize: 12 }}>{shots_on_target[1]}</Text>
					</View>
					<View style={styles.listItemCenter}>
						<View style={styles.redView} />
						<View style={styles.yellowView} />
						<Image resizeMode='stretch' source={require('../../../../images/betting/red-j-b.png')} style={{ width: 14, height: 14 }} />
					</View>
				</View>

				<View  style={[styles.listView,{marginTop: 15}]}>
					<View style={styles.listItemCenter}>
						<Text style={{ color: '#000', fontSize: 12 }}>{corner[0]}</Text>
						<Text style={{ color: '#000', fontSize: 12 }}>{yellow_card[0]}</Text>
						<Text style={{ color: '#000', fontSize: 12 }}>{red_card[0]}</Text>
					</View>
					<View style={styles.listItemCenter}>
						<Text style={{ color: '#000', fontSize: 12 }}>{shots_off_target[0]}</Text>
						<View style={{justifyContent: 'center',alignItems: 'center'}}>
							<Text style={{ color: '#666', fontSize: 12, position: 'absolute', top: -15 }}>射偏球门</Text>
							<View style={{ backgroundColor: '#00A6FF', width: width / 5, height: 5, borderRadius: 5 }}>
								<View style={{ backgroundColor: '#EB2121', height: 5, borderRadius: 5,
												width: (width / 5) * (shots_off_target[0] / (shots_off_target[0] + shots_off_target[1]))
									}}></View>
							</View>
						</View>
						<Text style={{ color: '#000', fontSize: 12 }}>{shots_off_target[1]}</Text>
					</View>
					<View style={styles.listItemCenter}>
						<Text style={{ color: '#000', fontSize: 12 }}>{red_card[1]}</Text>
						<Text style={{ color: '#000', fontSize: 12 }}>{yellow_card[1]}</Text>
						<Text style={{ color: '#000', fontSize: 12 }}>{corner[1]}</Text>
					</View>
				</View>
			</View>
		);
	}
}

export default StatisticalAnalysisData;
const styles = StyleSheet.create({
	listView: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	listItem: {
		width: width / 3,
		paddingLeft: 10,
		paddingRight: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	},
	listItemCenter: {
		width: width / 3,
		paddingLeft: 10,
		paddingRight: 10,
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
	},
	yellowView: {
		width: 10,
		height: 14,
		backgroundColor: '#F6B500',
		borderRadius: 2,
	},
	redView: {
		width: 10,
		height: 14,
		backgroundColor: '#EB2121',
		borderRadius: 2,
	},
});
