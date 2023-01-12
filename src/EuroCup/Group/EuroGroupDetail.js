import React, { Component } from "react";
import {
	Text,
	Platform,
	StyleSheet,
	View,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	Clipboard,
	Image,
	FlatList,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Flex, Toast, Modal } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import euroCommandStyle from './common/euroCommonStyle';
import { countryData } from './common/commonData'
import { doRadarSort } from './common/commonFn'
import { getRequestBody, postRequestBody } from './Request'

const commandStyle = euroCommandStyle
const { width, height } = Dimensions.get("window");

export default class EuroGroupDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			seasonId: seasonId, // 賽季, 23 = 2016 , 24 = 2020 歐洲杯
			teamProfile: this.props.teamProfile || [],
			teamDetail: {},
			isCCW_bank: 0, // 0 銀行卡，1 ERC，2 TRC
			defenderData: [], // 後衛
			midfielder: [], // 中場
			forward: [], // 前锋
			goalkeeper: [], // 守门员
			readMore: false, // 載入更多
			defaulTeamStat: '',
		};

		this.renderPlayer = this.renderPlayer.bind(this)
	}

	componentWillMount() {

		if (this.props.teamProfile) {
			this.getPlayerData()

			// const {
			// 	averageBallPossessionNormalized,
			// 	goalsScoredNormalized,
			// 	freeKicksNormalized,
			// 	cornerKicksNormalized,
			// 	goalsConceded,
			// } = this.props.teamProfile.teamStat
			const getSafeNum = (num) => { return num ? num : 0;}

			let defaulTeamStat = this.props.teamProfile.teamStat.teamStat

			defaulTeamStat.redYellowcards = getSafeNum(defaulTeamStat.redCards) + getSafeNum(defaulTeamStat.yellowCards);
			defaulTeamStat.averageBallPossessionNormalized = getSafeNum(defaulTeamStat.averageBallPossessionNormalized)
			defaulTeamStat.goalsScoredNormalized = getSafeNum(defaulTeamStat.goalsScoredNormalized)
			defaulTeamStat.freeKicksNormalized = getSafeNum(defaulTeamStat.freeKicksNormalized)
			defaulTeamStat.cornerKicksNormalized = getSafeNum(defaulTeamStat.cornerKicksNormalized)
			defaulTeamStat.goalsConcededNormalized = getSafeNum(defaulTeamStat.goalsConcededNormalized)

			defaulTeamStat.averageBallPossession = getSafeNum(defaulTeamStat.averageBallPossession)
			defaulTeamStat.goalsScored = getSafeNum(defaulTeamStat.goalsScored)
			defaulTeamStat.freeKicks = getSafeNum(defaulTeamStat.freeKicks)
			defaulTeamStat.cornerKicks = getSafeNum(defaulTeamStat.cornerKicks)
			defaulTeamStat.goalsConceded = getSafeNum(defaulTeamStat.goalsConceded)

			this.setState({defaulTeamStat})

		}

	}


	async getPlayerData() { // 球員數據
		const { teamProfile, seasonId } = this.state
		let defenderData = [], midfielder = [], forward = [], goalkeeper = [] //  後衛 中場 前锋 守门员

		this.setState({ loading: true });

		const reqData = {
			platform: Platform.OS == 'ios' ? 'IOS' : 'ANDROID',
			seasonId: seasonId,
		}
		console.log('teamProfileteamProfile',teamProfile)
		const playerDB = await postRequestBody(EuroCupDomain + ApiPort.getEuroPlayer + `${teamProfile.teamId}`, reqData)
		console.log('playerDB333', playerDB)
		if (playerDB) {
			playerDB.map((item, index) => {
				if (item.positionId == "defender") defenderData.push(item)
				if (item.positionId == "midfielder") midfielder.push(item)
				if (item.positionId == "forward") forward.push(item)
				if (item.positionId == "goalkeeper") goalkeeper.push(item)
			})

			this.setState({ defenderData, midfielder, forward, goalkeeper, playerDB, loading: false })
		}
	}



	TeamData() { // 隊伍分析
		const { teamDetail, teamProfile, defaulTeamStat } = this.state
		const teamStat = defaulTeamStat
		return (
			<View style={[commandStyle.flexColumn, styles.countryWrap, { marginLeft: 10 }]}>
				<View style={{ width: width * .3, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.grayColor}>场均控球率</Text>
					<Text style={styles.grayColor}>{teamStat.averageBallPossession||0}</Text>
				</View>
				<View style={{ width: width * .3, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.grayColor}>进球数</Text>
					<Text style={styles.grayColor}>{teamStat.goalsScored|| 0}</Text>
				</View>
				<View style={{ width: width * .3, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.grayColor}>任意球数</Text>
					<Text style={styles.grayColor}>{teamStat.freeKicks||0}</Text>
				</View>
				<View style={{ width: width * .3, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.grayColor}>失球数</Text>
					<Text style={styles.grayColor}>{teamStat.goalsConceded||0}</Text>
				</View>
				<View style={{ width: width * .3, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.grayColor}>角球数</Text>
					<Text style={styles.grayColor}>{teamStat.cornerKicks||0}</Text>
				</View>
				<View style={{ width: width * .3, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.grayColor}>红黄牌数</Text>
					<Text style={styles.grayColor}>{teamStat.redYellowcards||0}</Text>
				</View>
			</View>
		)
	}

	renderPlayerTabs() { // 球員頁籤
		const { isCCW_bank, teamProfile } = this.state
		return (
			<View style={[styles.bankNav, styles.ListBorderRadius, { backgroundColor: '#ffffff' }]}>
				<TouchableOpacity
					onPress={() => { this.setState({ isCCW_bank: 0 }) }}
					style={[styles.bankList, styles.ListBorderRadius, { backgroundColor: isCCW_bank == 0 ? '#00A6FF' : '#ffffff' }]}
				>
					<Text style={{ color: isCCW_bank == 0 ? '#ffffff' : '#757575', fontWeight: isCCW_bank == 0 ? 'bold' : 'normal' }}>前锋</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => { this.setState({ isCCW_bank: 1 }) }}
					style={[styles.bankList, styles.ListBorderRadius, { backgroundColor: isCCW_bank == 1 ? '#00A6FF': '#ffffff' }]}
				>
					<Text style={{ color: isCCW_bank == 1 ? '#ffffff' : '#757575', fontWeight: isCCW_bank == 1 ? 'bold' : 'normal' }}>中场</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => { this.setState({ isCCW_bank: 2 }) }}
					style={[styles.bankList, styles.ListBorderRadius, { backgroundColor: isCCW_bank == 2 ?'#00A6FF' : '#ffffff' }]}
				>
					<Text style={{ color: isCCW_bank == 2 ? '#ffffff' : '#757575', fontWeight: isCCW_bank == 2 ? 'bold' : 'normal' }}>后卫</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => { this.setState({ isCCW_bank: 3 }) }}
					style={[styles.bankList, styles.ListBorderRadius, { backgroundColor: isCCW_bank == 3 ? '#00A6FF' : '#ffffff' }]}
				>
					<Text style={{ color: isCCW_bank == 3 ? '#ffffff' : '#757575', fontWeight: isCCW_bank == 3 ? 'bold' : 'normal' }}>守门员</Text>
				</TouchableOpacity>
			</View>
		)
	}

	renderPlayer(data) { // 球員列表
		const { readMore, teamProfile } = this.state
		return (
			<View>
				{
					data.map((item, index) => {
						// if (!readMore && index >= 5) return // 默認顯示5組
						return (
							<View index={index} style={{ flexDirection: 'row', backgroundColor: '#fff', paddingLeft: 5, width: width * .8 }}>
								<Text style={{ color: '#000', lineHeight: 25, fontSize: 12, width: width * .11 }}>{item.playerNumber}</Text>
								<Text
									style={{ color: '#1C8EFF', lineHeight: 25, fontSize: 12, width: width * .45 }}
									onPress={() => Actions.EuroPlayerDetail({ playerProfile: item, teamProfile })}
								>
									{item.playerName}
								</Text>
								<Text style={{ color: '#000', lineHeight: 25, fontSize: 12, width: width * .12 }}>{item.matchInfo.played || 0}</Text>
								<Text style={{ color: '#000', lineHeight: 25, fontSize: 12, width: width * .12 }}>{item.matchInfo.shotsOnTarget || 0}</Text>
								<Text style={{ color: '#000', lineHeight: 25, fontSize: 12, width: width * .12 }}>{item.matchInfo.goals || 0}</Text>
							</View>
						)
					})
				}

				{/* {
					data && data.length > 5 &&
					<Text
						onPress={() => this.setState({ readMore: !readMore })}
						style={{ color: '#9E9E9E', lineHeight: 25, fontSize: 12, width: width * .8, textAlign: 'center' }}>
						{!readMore ? '展开更多' : '收起'}
					</Text>
				} */}
			</View>
		)
	}

	renderGoalkeeper(data) { // 守門員員列表
		const { readMore, teamProfile } = this.state
		return (
			<View>
				{
					data.map((item, index) => {
						// if (!readMore && index >= 5) return // 默認顯示5組
						return (
							<View index={index} style={{ flexDirection: 'row', backgroundColor: '#fff', paddingLeft: 5, width: width * .8 }}>
								<Text style={{ color: '#000', lineHeight: 25, fontSize: 12, width: width * .11 }}>{item.playerNumber}</Text>
								<Text
									style={{ color: '#1C8EFF', lineHeight: 25, fontSize: 12, width: width * .45 }}
									onPress={() => {Actions.EuroPlayerDetail({ playerProfile: item, teamProfile });PiwikEvent('Engagement Event​​', 'View​', 'Player_Stats_EUROPage')}}
								>
									{item.playerName}
								</Text>
								<Text style={{ color: '#000', lineHeight: 25, fontSize: 12, width: width * .12 }}>{item.matchInfo.played || 0}</Text>
								<Text style={{ color: '#000', lineHeight: 25, fontSize: 12, width: width * .12 }}>{item.matchInfo.goalsConceded || 0}</Text>
								<Text style={{ color: '#000', lineHeight: 25, fontSize: 12, width: width * .12 }}>{item.matchInfo.cleanSheets || 0}</Text>
							</View>
						)
					})
				}

				{
					// data && data.length > 5 &&
					// <Text
					// 	onPress={() => this.setState({ readMore: !readMore })}
					// 	style={{ color: '#9E9E9E', lineHeight: 25, fontSize: 12, width: width * .8, textAlign: 'center' }}>
					// 	{!readMore ? '展开更多' : '收起'}
					// </Text>
				}
			</View>
		)
	}

	render() {
		const { teamProfile, teamDetail, isCCW_bank, defenderData, midfielder, forward, goalkeeper, defaulTeamStat } = this.state;
		const teamStat = defaulTeamStat
		console.log('teamProfile',teamProfile)
		const SubCateHeader = ({ name }) => (
			<View style={[commandStyle.subCateHeader]}>
				<View style={commandStyle.subCateHeaderLeft}>
					<Text style={commandStyle.subCateTitle}>{name}</Text>
				</View>
			</View>
		)

		return (
			<ScrollView style={[styles.rootView]} >
				{/* Flag */}
				<View style={[styles.rootView, { backgroundColor: countryData[teamProfile.id] && countryData[teamProfile.id].bgColor, padding: 10 }]}>

					<View style={{ flexDirection: 'row' }}>
						{/* 左側Flag */}
						<View style={[commandStyle.flexColumn, { width: width * .25 }]}>
							<Image
								resizeMode='contain'
								source={countryData[teamProfile.id] && countryData[teamProfile.id].flag}
								style={{ width: 60, height: 60, }}
							/>
						</View>

						{/* 右側 */}
						<View style={[commandStyle.flexColumn, { padding: 10, width: width * .5 }]}>
							<View style={[{ flexDirection: 'column', alignItems: 'flex-start', width: width * .5, borderBottomWidth: 0 }]}>
								<Text style={[styles.whiteColor, { fontSize: 18, fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' }]}>{teamProfile.name}</Text>
								<Text style={[styles.whiteColor, styles.fontSizeSmall, { lineHeight: 20 }]}>{teamProfile.group}</Text>

								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width * .3, }}>
									<Text style={[styles.whiteColor, styles.fontSizeSmall]}>夺冠几率推测 {teamProfile.chanceToWin}%</Text>
								</View>
							</View>
						</View>
					</View>
				</View>

				{/* 战力分析 */}
				<View style={[commandStyle.subCateBox,]}>
					<SubCateHeader name='战力分析' />
					<View style={[styles.modalView, { flexDirection: 'row', margin: 20, borderRadius: 10, }]}>
						{/* 左側雷達 */}
						<View style={[commandStyle.flexColumn, styles.countryWrap, { width: width * .45 }]}>
							{teamStat ? doRadarSort(0, teamProfile.id, teamStat) : null}
						</View>
						{/* 右側數據 */}
						{teamStat ? this.TeamData() : null}
					</View>
				</View>

				{/* 球员分析 */}
				<SubCateHeader name='球员分析' />
				<View style={[commandStyle.subCateBox,]}>
					<View style={[styles.modalView, { width: width * .9, padding: 0, margin: 20, marginTop: 0 }]}>
						{this.renderPlayerTabs()}
						{/* 列表 */}
						<View>
							<View style={{ flexDirection: 'row', backgroundColor: '#00A6FF', paddingLeft: 10 }}>
								<Text style={{ color: '#fff', lineHeight: 25, fontSize: 12, width: width * .12 }}>数字</Text>
								<Text style={{ color: '#fff', lineHeight: 25, fontSize: 12, width: width * .43 }}>球员</Text>
								<Text style={{ color: '#fff', lineHeight: 25, fontSize: 12, width: width * .12 }}>出场</Text>
								<Text style={{ color: '#fff', lineHeight: 25, fontSize: 12, width: width * .12 }}>{isCCW_bank == 3 ? '失分' : '射门'}</Text>
								<Text style={{ color: '#fff', lineHeight: 25, fontSize: 12, width: width * .12 }}>{isCCW_bank == 3 ? '防守' : '得分'}</Text>
							</View>

							<View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingLeft: 10 }}>
								{isCCW_bank == 0 && forward && this.renderPlayer(forward)}
								{isCCW_bank == 1 && midfielder && this.renderPlayer(midfielder)}
								{isCCW_bank == 2 && defenderData && this.renderPlayer(defenderData)}
								{isCCW_bank == 3 && goalkeeper && this.renderGoalkeeper(goalkeeper)}
							</View>

						</View>
					</View>
				</View>
				<View style={{ backgroundColor: '#E6E6EB' }}>
					<Text style={{ fontSize: 11, color: '#999999', lineHeight: 50, textAlign: 'center' }}>© 版权归乐天堂 FUN88 2008-2021 所有违者必究</Text>
				</View>
			</ScrollView >
		);
	}
}

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		backgroundColor: "#F5F7FA",
		color: "#fff",
	},
	bankNav: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		width: width * .9,
		height: 40,
		backgroundColor: '#ffffff',
		marginTop: -4,
	},
	bankList: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width / 4.45,
		height: 40,
	},
	ListBorderRadius: {
		borderTopLeftRadius: 8,
		borderTopEndRadius: 8,
	},
	whiteColor: {
		color: '#FFFFFF',
	},
	grayColor: {
		color: '#757575',
		lineHeight: 20,
		fontSize: 10,
	},
	fontSizeSmall: {
		fontSize: 10,
	},
	countryWrap: {
		padding: 10
	},
	modalView: {
		backgroundColor: "#fff",
		padding: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
});
