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
import { countryData, RoundName } from './common/commonData';

const commandStyle = euroCommandStyle
const { width, height } = Dimensions.get("window");

export default class EuroGroupList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			EuroGroupData: this.props.EuroGroupData || [],
			readMore: true, // 載入更多
			seasonId: seasonId, // 賽季, 23 = 2016 , 24 = 2020 歐洲杯
		};
	}

	componentDidMount() { }

	componentWillMount() {

	}

	render() {
		const EuroGroupData = this.props.EuroGroupData
		return (
			<ScrollView style={styles.rootView} >
				<View style={{ padding: 20 }}>
				{
					EuroGroupData &&
					EuroGroupData.map((item, index) => {
						const latestRound = item && item.teamStat && item.teamStat.latestRound
						// if (!readMore && index >= 6) return // 默認顯示6組

						return (
							<TouchableOpacity
								onPress={() => { Actions.EuroGroupDetail({ teamProfile: item });PiwikEvent('Engagement Event​', 'View​', 'Team_Stats_EUROPage​') }}
								key={index}
								style={[commandStyle.flexColumn, { marginBottom: 10 }]}
							>

								{/* 左側Flag */}
								<View style={{ flexDirection: 'row' }}>
									<View style={[commandStyle.flexColumn, { backgroundColor: countryData[item.id] && countryData[item.id].bgColor || '#000', width: width * .3 }]}>
										{ // country flag
											countryData[item.id]
												? <Image
													resizeMode='contain'
													source={countryData[item.id] && countryData[item.id].flag}
													style={{ width: 40, height: 40, marginLeft: 'auto', marginRight: 'auto', margin: 10 }}
												/>
												: null
										}
									</View>

									{/* 右側 */}
									<View style={[commandStyle.flexColumn, { backgroundColor: '#FFFFFF', padding: 10, width: width * .6 }]}>

										<View style={[{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: width * .5, borderBottomWidth: 0 }]}>
											<Text style={[styles.whiteColor, { fontSize: 16, fontWeight: 'bold', textAlign: 'left', color: '#222222', paddingBottom: 6 }]}>{item.name}</Text>
											<Text style={[styles.whiteColor, styles.fontSizeSmall, { lineHeight: 20 }]}>{item.group}</Text>

											<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width * .3, }}>
												<Text style={[styles.whiteColor, styles.fontSizeSmall]}>夺冠几率推测</Text>
												<Text style={[styles.whiteColor, styles.fontSizeSmall]}>{
													item.chanceToWin !== null && item.chanceToWin !== undefined && item.chanceToWin !== '' ? (item.chanceToWin + '%') : ' '
												}</Text>
											</View>
										</View>

										<View style={{ position: 'absolute', right: 10 }}>
											<Image source={require('../../images/euroCup/iconEnter.png')} style={{ width: 24, height: 24 }} />
										</View>
									</View>
								</View>
							</TouchableOpacity>
						)
					})
				}
				{
					this.state.readMore &&
					<Touch
						onPress={() => this.setState({ readMore: !this.state.readMore }, () => { this.props.showMoreBtn(false) })}
						style={{ borderColor: '#00A6FF', borderWidth: 1, borderRadius: 10, marginTop: 20, width: width - 40 }}
					>
						<Text style={{ color: '#00A6FF', lineHeight: 40, textAlign: 'center' }}>
							展开更多
						</Text>
					</Touch>
				}

				{/* <TouchableOpacity
					onPress={() => this.setState({ readMore: !readMore, })}
					style={styles.readMoreBtn}
				>
					<Text style={styles.readMoreText}>{!readMore ? '载入更多' : '收起'}</Text>
				</TouchableOpacity> */}


				</View>
				<View style={{ marginBottom: 50 }} />
				<View style={{ backgroundColor: '#E6E6EB',marginBottom: 20 }}>
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
		width: width,
		height: 40,
		backgroundColor: '#02849B',
		marginTop: -4,
	},
	bankList: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width / 3,
		height: 40,
	},
	ListBorderRadius: {
		borderTopLeftRadius: 8,
		borderTopEndRadius: 8,
	},
	whiteColor: {
		color: '#666666',
	},
	fontSizeSmall: {
		fontSize: 10,
		fontWeight: 'bold',
	},
	countryWrap: {
		padding: 10
	},
	warn: {
		width: width * .9,
		textAlign: 'center',
		color: '#757575',
		marginTop: 20,
		fontSize: 10
	},
	readMoreBtn: {
		width: width * .9,
		borderColor: '#BDBDBD',
		borderRadius: 20,
		borderWidth: 1,
		padding: 10
	},
	readMoreText: {
		lineHeight: 15,
		textAlign: 'center',
		color: '#757575'
	},
});
