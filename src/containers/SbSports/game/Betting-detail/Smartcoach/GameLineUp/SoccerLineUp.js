/*
 * @Author: Alan
 * @Date: 2021-06-17 14:37:08
 * @LastEditors: Alan
 * @LastEditTime: 2021-07-05 18:34:00
 * @Description: 球队阵容
 * @FilePath: \Fun88-Sport-Code2.0\components\Games\Betting-detail\Smartcoach\GameLineUp\SoccerLineUp.js
 */
import React, { Component } from 'react';
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
	ImageBackground,
	Alert,
	UIManager,
	Modal
} from "react-native";
import ImageForTeam from "../../../RNImage/ImageForTeam";

export default class FootballField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			home: props.home,
			away: props.away,
			homemodule: props.home_formation,
			awaymodule: props.away_formation
		};
	}

	render() {
		const { HomeTeamName, AwayTeamName, Vendor, HomeTeamId, AwayTeamId, HomeIconUrl, AwayIconUrl } = this.props;
		const { home, away, homemodule, awaymodule } = this.state;
		let checkHome = [];
		let checkAway = [];
		/* 为了识别两种足球阵式 eg:4-2-3-1  4-3-3  */
		let hometype = homemodule.split('-').length == 4;
		let awaytype = awaymodule.split('-').length == 4;
		console.log('homemodulehomemodulehomemodule', homemodule, awaymodule)
		return (
			<View style={{ flex: 1 }}>
				<View>
					{/* <Text style={{ fontSize: 12, color: '#999999', textAlign: 'center', lineHeight: 35 }}>替补、进球和红黄牌信息，仅在精彩集锦中提供</Text> */}
				</View>
				<View>
					<View>
						<View style={styles.HomeTeam}>
							<View style={styles.Names}>
								<ImageForTeam TeamId={HomeTeamId} Vendor={Vendor} IconUrl={HomeIconUrl}/>
								<Text style={{ fontSize: 14, paddingLeft: 10, color: '#fff' }}>{HomeTeamName}</Text>
							</View>
							<Text style={{ fontSize: 14, color: '#fff' }}>{homemodule}</Text>
						</View>
						<ImageBackground
							style={{ width: width, height: width * 1.517, display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}
							resizeMode="stretch"
							source={require('../../../../images/betting/smartcoach/bg.png')}
						>
							<View style={{ width: width }}>
								{/* 主队 */}
								{home &&
									home.map((data, i) => {
										/* 过滤出 非替补队员 */
										let Datafilter = data.filter((item) => item.bench == 0);
										Datafilter != '' && checkHome.push(i);
										return (
											Datafilter != '' && (
												<View key={'h' + i} style={styles.lines}>
													{Datafilter.map((d, j) => {
														return (
															<View key={'he' + j} style={[styles.players, { marginBottom: home.length > 5 ? 18 : 32 }]}>
																<Ball
																	d={d}
																	events={home.home_team_events}
																	team={'Home'}
																	// goalkeeper={checkHome[0] == i ? '#8D0000' : '#EB2121'}
																	goalkeeper={'#000'}
																/>
																<Text style={{ fontSize: 12, color: '#fff' }}>{d.player_name}</Text>
															</View>
														);
													})}
												</View>
											)
										);
									})}
							</View>
							{/* 客队 */}
							{/* <View className="Team Away" style={{ paddingTop: !awaytype ? '0.439rem' : '0.2439rem' }}> */}
							<View style={{ width: width }}>
								{/* .reverse() */}
								{away &&
									away.map((data, i) => {
										/* 过滤出 非替补队员 */
										let Datafilter = data.filter((item) => item.bench == 0);
										Datafilter != '' && checkAway.push(i);
										return (
											Datafilter != '' && (
												<View
													key={'a' + i}
													style={styles.lines}
												// style={{ padding: !awaytype ? '0.439rem' : '0.2439rem' }}
												>
													{Datafilter.map((d, j) => {
														return (
															<View key={'ae' + j} style={[styles.players, { marginTop: away.length > 5 ? 18 : 32 }]}>
																<Ball
																	d={d}
																	events={away.away_team_events}
																	team={'Away'}
																	// goalkeeper={
																	// 	checkAway[awaytype ? 4 : 3]== i ?('#004D76'):('#00a6ff')
																	// }
																	goalkeeper={'#fff'}
																/>
																<Text style={{ fontSize: 12, color: '#fff' }}>{d.player_name}</Text>
															</View>
														);
													})}
												</View>
											)
										);
									})}


							</View>
						</ImageBackground>
						<View style={styles.HomeTeam}>
							<View style={styles.Names}>
								<ImageForTeam TeamId={AwayTeamId} Vendor={Vendor} IconUrl={AwayIconUrl} />
								<Text style={{ fontSize: 14, color: '#fff', paddingLeft: 10 }}>{AwayTeamName}</Text>
							</View>
							<Text style={{ fontSize: 14, color: '#fff' }}>{awaymodule}</Text>
						</View>
					</View>
				</View>
			</View>
		);
	}
}

/* 球员 */
class Ball extends React.Component {
	render() {
		const { events, d, team, goalkeeper } = this.props;
		const { red, yellow, sub_in, sub_out, goals } = d.stats;
		return (
			<View className="ball">
				<View style={[styles.nameNumber, { backgroundColor: goalkeeper }]}>
					{/* 进球 */}
					{goals.minutes && <View style={styles.goals}><Image resizeMode='stretch' source={require('../../../../images/betting/smartcoach/goals.png')} style={{width: 14,height: 14}} /></View>}

					<Text numberOfLines={1} style={{ fontSize: 12, color: team=='Home'?'#fff': '#000' }}>{d.shirt_number}</Text>

					{/* 黄牌 */}
					{yellow.minute && <View style={styles.yellow}><Image source={require('../../../../images/betting/smartcoach/yellow.png')} style={{width: 9,height: 12}} /></View>}
					{/* 红牌 */}
					{red.minute && <View style={styles.red}><Image source={require('../../../../images/betting/smartcoach/red.png')} style={{width: 9,height: 12}} /></View>}
					{/* 上场 */}
					{sub_in.minute && <View style={styles.sub_in}><Image source={require('../../../../images/betting/smartcoach/sub_in.png')} style={{width: 12,height: 12}} /></View>}
					{/* 下场 */}
					{sub_out.minute && <View style={styles.sub_out}><Image source={require('../../../../images/betting/smartcoach/sub_out.png')} style={{width: 12,height: 12}} /></View>}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	goals: {
		position: 'absolute',
		bottom: 10,
		right: 16,
	},
	yellow: {
		position: 'absolute',
		bottom: 10,
		left: 16,
	},
	red: {
		position: 'absolute',
		bottom: 10,
		left: 16,
	},
	sub_in: {
		position: 'absolute',
		top: 10,
		right: 16,
	},
	sub_out: {
		position: 'absolute',
		top: 10,
		left: 16,
	},
	HomeTeam: {
		width: width,
		height: 43,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#0B8449',
		paddingLeft: 15,
		paddingRight: 15,
	},
	Names: {
		flexDirection: 'row',
	},
	nameNumber: {
		width: 22,
		height: 22,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 60,
	},
	lines: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
	},
	players: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width / 4
	},
});

