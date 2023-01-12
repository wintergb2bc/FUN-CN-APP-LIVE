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


const commandStyle = euroCommandStyle
const { width, height } = Dimensions.get("window");

export default class EuroPlayerDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			seasonId: seasonId, // 賽季, 23 = 2016 , 24 = 2020 歐洲杯
			playerProfile: this.props.playerProfile || [],
			teamProfile: this.props.teamProfile || []
		};

	}

	componentDidMount() { }

	componentWillMount() { }

	goalkeeperAnalysis() { // 守門員
		const { playerProfile, } = this.state
		const playerInfo = playerProfile && playerProfile.matchInfo

		return (
			<View style={[styles.modalView, { margin: 20, borderRadius: 10, }]}>

				<View style={{ flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: .5, borderColor: '#dddddd', marginBottom: 10 }}>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>失球数</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.lossOfPossession || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>传球成功数</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.passesSuccessful || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>传球数</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.passesTotal || 0}</Text>
					</View>

				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: .5, borderColor: '#dddddd', marginBottom: 10 }}>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>阻截成功数</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.tacklesSuccessful || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>阻截数</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.tacklesTotal || 0}</Text>
					</View>

				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>出场</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.played || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>失分</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.goalsConceded || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>防守不失球</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.cleanSheets || 0}</Text>
					</View>

				</View>
			</View>
		)
	}

	playerAnalysis() { // 一般球員
		const { playerProfile, teamProfile } = this.state
		const playerInfo = playerProfile && playerProfile.matchInfo

		return (
			<View style={[styles.modalView, { margin: 20, borderRadius: 10, }]}>

				<View style={{ flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: .5, borderColor: '#dddddd', marginBottom: 10 }}>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>制造机会</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.chancesCreated || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>传球成功数</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.passesSuccessful || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>传球数</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.passesTotal || 0}</Text>
					</View>

				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: .5, borderColor: '#dddddd', marginBottom: 10 }}>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>拦截</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.interceptions || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>过人</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.dribblesCompleted || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>助攻</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.assists || 0}</Text>
					</View>

				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>比赛场次次数</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.played || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>射正</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.shotsOnTarget || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>得分</Text>
						<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.goals || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10, textAlign: 'center' }}>卡数</Text>
						<View style={{ flexDirection: 'row' }}>
							<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.yellowCards || 0}</Text>
							<View style={{ width: 10, height: 15, backgroundColor: '#FCED50', margin: 5, marginBottom: 0 }} />
							<Text style={{ color: '#000', textAlign: 'center', lineHeight: 25 }}>{playerInfo.redCards || 0}</Text>
							<View style={{ width: 10, height: 15, backgroundColor: '#CF2C30', margin: 5, marginBottom: 0 }} />
						</View>
					</View>

				</View>
			</View>
		)
	}

	render() {
		const { playerProfile, teamProfile } = this.state

		const SubCateHeader = ({ name }) => (
			<View style={[commandStyle.subCateHeader]}>
				<View style={commandStyle.subCateHeaderLeft}>
					<Text style={commandStyle.subCateTitle}>{name}</Text>
				</View>
			</View>
		)

		return (
			<View style={[styles.rootView]} >
				{/* Flag */}
				<View style={[{ backgroundColor: countryData[teamProfile.id].bgColor, padding: 10 }]}>

					<View style={{ flexDirection: 'row' }}>
						{/* 左側Flag */}
						<View style={[commandStyle.flexColumn, { width: width * .25, borderRadius: 50, }]}>
							<View style={{ width: 60, height: 60, backgroundColor: '#ddd', borderRadius: 50, overflow: 'hidden', borderWidth: 2, borderColor: '#fff' }}>
								<Image
									resizeMode='contain'
									source={countryData[teamProfile.id].jersey}
									style={{ width: 55, height: 55, marginTop: 2 }}
								/>
							</View>
						</View>

						{/* 右側 */}
						<View style={[commandStyle.flexColumn, { padding: 10, width: width * .5 }]}>
							<View style={[{ flexDirection: 'column', alignItems: 'flex-start', width: width * .5, borderBottomWidth: 0 }]}>
								<Text style={[styles.whiteColor, { fontSize: 18, fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' }]}>{playerProfile.playerName}</Text>

								<View style={{ flexDirection: 'row', marginTop: 5 }}>
									<Image
										resizeMode='contain'
										source={countryData[teamProfile.id].flag}
										style={{ width: 20, height: 20, marginRight: 10 }}
									/>
									<Text style={[styles.whiteColor, styles.fontSizeSmall, { lineHeight: 20 }]}>{teamProfile.name}</Text>
								</View>

								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width * .3, marginTop: 7 }}>
									<Text style={[styles.whiteColor, styles.fontSizeSmall]}>{playerProfile.playerPosition}</Text>
								</View>

							</View>
						</View>

					</View>
				</View>

				<View style={[commandStyle.subCateBox,]}>
					<SubCateHeader name='球员分析' />
					{playerProfile.positionId == 'goalkeeper' ? this.goalkeeperAnalysis() : this.playerAnalysis()}
				</View>
				<View style={{ backgroundColor: '#E6E6EB', position: 'absolute', bottom: 0,left: 0,zIndex: 99,width: width }}>
					<Text style={{ fontSize: 11, color: '#999999', lineHeight: 50, textAlign: 'center' }}>© 版权归乐天堂 FUN88 2008-2021 所有违者必究</Text>
				</View>
			</View >
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
