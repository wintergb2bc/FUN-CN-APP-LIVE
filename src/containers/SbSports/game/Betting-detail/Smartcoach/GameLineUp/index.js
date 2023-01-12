/*
 * @Author: Alan
 * @Date: 2021-05-20 19:47:15
 * @LastEditors: Alan
 * @LastEditTime: 2021-07-05 18:14:46
 * @Description: 阵容部分 包含第三方足球动画插件和阵容情报列表数据
 * @FilePath: \Fun88-Sport-Code2.0\components\Games\Betting-detail\Smartcoach\GameLineUp\index.js
 */
// import { stringify } from 'crypto-js/enc-base64';
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
	Alert,
	UIManager,
	Modal
} from "react-native";
import SoccerLineUp from './SoccerLineUp';
class PrematchIntelligence extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { TeamLineUp, Vendor } = this.props;
		const {
			/* 主队名 */
			HomeTeamName,
			/* 客队名 */
			AwayTeamName,
			HomeTeamId,
			AwayTeamId,
			HomeIconUrl,
			AwayIconUrl,
		} = this.props.EventDetail;
		const { away_players, home_players, away_formation, home_formation } = TeamLineUp;

		/* 合并数组拿到所有替补队员 */
		let HomeSubstitute = []; //主队替补
		let AwaySubstitute = []; //客队替补
		for (let i = 0; i < away_players.length; i++) {
			AwaySubstitute = AwaySubstitute.concat(away_players[i]);
		}
		for (let i = 0; i < home_players.length; i++) {
			HomeSubstitute = HomeSubstitute.concat(home_players[i]);
		}
		console.log('%c队伍阵容', 'color:#009688;', TeamLineUp);
		return (
			<View style={{ flx: 1 }}>
				{/* <Text style={{textAlign: 'center', fontSize: 12,lineHeight: 35, color: '#999'}}>替补、进球和红黄牌信息，仅在即时情报中提供</Text> */}
				<View>
					<SoccerLineUp
						/* 主队阵容 */
						home={home_players}
						/* 客队阵容 */
						away={away_players}
						/* 主队名 */
						HomeTeamName={HomeTeamName}
						/* 客队名 */
						AwayTeamName={AwayTeamName}
						/* 阵容格式 数字 */
						away_formation={away_formation}
						home_formation={home_formation}
						Vendor={Vendor}
						HomeTeamId={HomeTeamId}
						AwayTeamId={AwayTeamId}
						HomeIconUrl={HomeIconUrl}
						AwayIconUrl={AwayIconUrl}
					/>
				</View>
				<View style={{ width: width, backgroundColor: '#fff' }}>
					<View style={{ backgroundColor: '#EFEFF4' }}>
						<Text style={{ lineHeight: 35, color: '#999', fontSize: 12, textAlign: 'center' }}>替补</Text>
					</View>

					<View style={{ width: width, display: 'flex', flexDirection: 'row', paddingBottom: 150 }}>
						<View style={styles.leftItem}>
							{HomeSubstitute != '' &&
								HomeSubstitute.filter((item) => item.bench == 1).map((data, key) => {
									const { player_name, shirt_number, stats } = data;
									const { sub_in, sub_out } = stats;
									return (
										<View style={styles.playersLeft} key={key}>
											{sub_in.minute && (
												<View style={styles.playerList}>
													<Text style={{color: '#999', paddingRight: 12}}>{sub_in.minute}`</Text>
													<Image source={require('../../../../images/betting/smartcoach/sub_in.png')} style={{width: 12,height: 12}} />
												</View>
											)}
											{sub_out.minute && (
												<View style={styles.playerList}>
													<Text style={{color: '#999', paddingRight: 12}}>{sub_out.minute}`</Text>
													<Image source={require('../../../../images/betting/smartcoach/sub_out.png')} style={{width: 12,height: 12}} />
												</View>
											)}
											{
												!sub_in.minute && !sub_out.minute && <View style={styles.playerList} />
											}
											<Text style={{width: width / 4}}>{player_name}</Text>
										</View>
									);
								})}
						</View>
						<View style={styles.rightItem}>
							{AwaySubstitute != '' &&
								AwaySubstitute.filter((item) => item.bench == 1).map((data, key) => {
									const { player_name, shirt_number, stats } = data;
									const { sub_in, sub_out } = stats;
									return (
										<View style={styles.playersRight} key={key}>
											{sub_in.minute && (
												<View style={styles.playerList}>
													<Text style={{color: '#999', paddingRight: 12}}>{sub_in.minute}`</Text>
													<Image source={require('../../../../images/betting/smartcoach/sub_in.png')} style={{width: 12,height: 12}} />
												</View>
											)}
											{sub_out.minute && (
												<View style={styles.playerList}>
													<Text style={{color: '#999', paddingRight: 12}}>{sub_out.minute}`</Text>
													<Image source={require('../../../../images/betting/smartcoach/sub_out.png')} style={{width: 12,height: 12}} />
												</View>
											)}
											{
												!sub_in.minute && !sub_out.minute && <View style={styles.playerList} />
											}
											<Text style={{width: width / 4}}>{player_name}</Text>
										</View>
									);
								})}
						</View>
					</View>
					{/* <View style={{ backgroundColor: '#EFEFF4' }}>
						<Text style={{ lineHeight: 35, color: '#999', fontSize: 12, textAlign: 'center' }}>教练</Text>
					</View>

					<View style={styles.Teamshow}>
						<Text style={{ fontSize: 12 }}>
							{TeamLineUpCoach && TeamLineUpCoach.home_coach_name ? (
								TeamLineUpCoach.home_coach_name
							) : (
								'---'
							)}
						</Text>
						<Text style={{ fontSize: 12 }}>
							{TeamLineUpCoach && TeamLineUpCoach.away_coach_name ? (
								TeamLineUpCoach.away_coach_name
							) : (
								'---'
							)}
						</Text>
					</View> */}
				</View>
			</View>
		);
	}
}

export default PrematchIntelligence;

const styles = StyleSheet.create({
	playerList: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		width: width / 4,
	},
	playersLeft: {
		width: width / 2,
		paddingTop: 10,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	playersRight: {
		width: width / 2,
		paddingTop: 10,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	Teamshow: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		padding: 15,
		marginBottom: 70
	},
	leftItem: {
		width: width / 2,
	},
	rightItem: {
		width: width / 2,
	},
})
