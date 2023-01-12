/*
 * @Author: Alan
 * @Date: 2021-05-19 11:59:19
 * @LastEditors: Alan
 * @LastEditTime: 2021-06-23 19:02:51
 * @Description: 公用组件-即时情报   （即时情报、赛程-赛况、赛前情报）
 * @FilePath: \Fun88-Sport-Code2.0\components\Games\Betting-detail\Smartcoach\GameInsights\index.js
 */
import React, { Component } from 'react';
import Skeleton from '../../../Skeleton/smartcoach'
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
import Touch from 'react-native-touch-once';
import ImageForTeam from "../../../RNImage/ImageForTeam";
const { width, height } = Dimensions.get("window");
class RealTimeCommunication extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showMore: 5,
			Tabactive: 0
		};
	}
	componentDidMount() {
		if(this.props.type == 1) {
			this.setState({showMore: 10})
		}
	}

	/**
	 * @description: 让*号*包裹的内容加粗
	 * @param {string} Message 原始消息
	 * @param {boolean} highlight 是否为红色显示
	 * @return {string}
	*/
	ChangeMessage = (Message, highlight) => {
		let split = Message.split('*');

		return split.map((t, s) => {
			if(s % 2) {
				return <Text style={{color:highlight ? 'red' : 'black', fontWeight: 'bold'}}>{t}</Text>
			} else {
				return t
			}
		});
	};

	render() {
		const {
			/* 联赛名 */
			LeagueName,
			/* 主队名 */
			HomeTeamName,
			/* 客队名 */
			AwayTeamName,
			HomeTeamId,
			HomeIconUrl,
			AwayTeamId,
			AwayIconUrl,
		} = this.props.EventDetail;

		const {
			/* --- 当前选择的类型 -- */
			type,
			/* --- 即时情报数据 ---- */
			LiveInsightsSocketData,
			/* --- 赛前情报数据 ---- */
			PregameInsights,
			/* ----赛程-赛况数据 -------- */
			TimelineSockeMatchreSultData,
			/* 配置信息 */
			Vendor
		} = this.props;
		const {
			showMore,
		} = this.state
		/**
		 * @description: 当前路线类型 公共组件
		 * @param {type = 0} 即时情报
		 * @param {type = 1} 赛况
		 * @param {type = 2} 阵容
		 * @param {type = 3} 赛前情报
		*/
		const setcss = {
			position: 'unset'
		};
		if (type == 0) {
			console.log('%c即时情报', 'color:#e91e63;', LiveInsightsSocketData ? LiveInsightsSocketData : '======>没有数据');
		}
		if (type == 1) {
			console.log('%c赛况-赛程', 'color:#00bcd4;', TimelineSockeMatchreSultData ? TimelineSockeMatchreSultData : '======>没有数据');
		}
		if (type == 3) {
			console.log('%c赛前情报', 'color:#e400ff;', PregameInsights ? PregameInsights : '======>没有数据');
		}
		return (
			<View style={{ flex: 1, paddingTop: 5}}>
				{/* <View className="box" style={type == 1 ? setcss : null}> */}
				<View style={{ marginBottom: showMore != 5 ? 150 : 0 }}>
					{/* 即时情报 */}
					<View>
						{LiveInsightsSocketData && LiveInsightsSocketData != '' ? (
							LiveInsightsSocketData.map((item, key) => {
								const { paragraph, parent_id, status_type, highlight } = item.data.insight;
									let T = parent_id.indexOf('-home') != -1;
									let Message = paragraph && paragraph
										.replace(/##HomeTeamName##/g, HomeTeamName)
										.replace(/##AwayTeamName##/g, AwayTeamName)
										.replace(/##CompetitionName##/g, LeagueName) || '';
								return (
									key < showMore && Message &&
									<View key={key} style={styles.information}>
										<Text style={{color: '#999999', width: 35, textAlign: 'center'}}>{item.data.minutes}'</Text>
										<View style={styles.informationIcon}>
											{/* 黄牌 */}
											{status_type == 4 && (
												<Image resizeMode='stretch' source={require('../../../../images/betting/smartcoach/yellow.png')} style={{ width: 12, height: 18 }} />
											)}
											{/* 红牌 */}
											{status_type == 5 && (
												<Image resizeMode='stretch' source={require('../../../../images/betting/smartcoach/red.png')} style={{ width: 12, height: 18 }} />
											)}
											{/* 替补 */}
											{status_type == 8 && (
												<Image resizeMode='stretch' source={require('../../../../images/betting/smartcoach/out_in.png')} style={{ width: 17, height: 17 }} />
											)}
											{/* 角球 */}
											{status_type == 3 && (
												<Image resizeMode='stretch' source={require('../../../../images/betting/red-j-b.png')} style={{ width: 17, height: 17 }} />
											)}
										</View>
										<Text style={{color: '#000', width: width - 35 - 20 - 30, fontSize: 12, lineHeight: 21}}>{this.ChangeMessage(Message, highlight)}</Text>
									</View>
								);
							})
						) : (
							type == 0 && <Skeleton />
						)}
						{
							showMore == 5 &&
							LiveInsightsSocketData &&
							LiveInsightsSocketData != '' &&
							LiveInsightsSocketData.length > 5 &&
							type == 0 && (
								<View style={{ alignItems: 'center' }}>
									<Touch onPress={() => { this.setState({ showMore: 9999999 }) }} style={[styles.showMore,{width: width * 0.85}]}>
										<Text style={{ color: '#00A6FF', textAlign: 'center', lineHeight: 23 }}>显示更多</Text>
									</Touch>
								</View>
							)}
					</View>
					{/* 赛程-赛况 */}
					{type == 1 &&
					<View>
						{TimelineSockeMatchreSultData && TimelineSockeMatchreSultData != '' ? (
							TimelineSockeMatchreSultData.map((item, key) => {
								const { minutes, livefeed, highlight } = item.data;
									const { text, side } = livefeed;
									let T = side == 1;
									let Message = text && text
										.replace(/##HomeTeamName##/g, HomeTeamName)
										.replace(/##AwayTeamName##/g, AwayTeamName)
										.replace(/##CompetitionName##/g, LeagueName) || '';
								return (
									key < showMore && Message &&
									<View style={T ? styles.itemLeft : styles.itemRight} key={key}>
										<View style={styles.title}>
											<Text style={{ color: '#999999', fontSize: 12 }}>{minutes}'</Text>
										</View>
										<View style={styles.message}>
											<Text style={{ padding: 10, fontSize: 12, lineHeight: 19 }}>{this.ChangeMessage(Message, highlight)}</Text>
										</View>
									</View>
								);
							})
						) : (
							type == 1 && <Skeleton />
						)}
						{
							showMore == 10 &&
							TimelineSockeMatchreSultData &&
							TimelineSockeMatchreSultData != '' &&
							TimelineSockeMatchreSultData.length > 10 &&
							type == 1 && (
								<View style={{ alignItems: 'center' }}>
									<Touch onPress={() => { this.setState({ showMore: 9999999 }) }} style={styles.showMore}>
										<Text style={{ color: '#00A6FF', fontSize: 12, }}>显示更多</Text>
									</Touch>
								</View>
							)}
					</View>
					}
					{/* 赛前情报 */}
					{type == 3 &&
					<View>
						{PregameInsights && PregameInsights != '' ? (
							PregameInsights.map((item, key) => {
								const { paragraph, parent_id, highlight } = item;
								let T = parent_id.indexOf('-home') != -1;
								let Message = paragraph && paragraph
									.replace(/##HomeTeamName##/g, HomeTeamName)
									.replace(/##AwayTeamName##/g, AwayTeamName)
									.replace(/##CompetitionName##/g, LeagueName) || '';
								return (
									key < showMore && Message &&
									<View style={T ? styles.itemLeft : styles.itemRight} key={key}>
										<View style={styles.title}>
											{/* <Text style={{color: '#999999', fontSize: 12, paddingRight: 5}}>50'</Text> */}
											{/* <LazyImageForTeam Vendor={Vendor} TeamId={T ? HomeTeamId : AwayTeamId} /> */}
											{T && <ImageForTeam TeamId={HomeTeamId} imgSize={14} Vendor={Vendor} IconUrl={HomeIconUrl} />}
											<Text style={{ color: '#999999', fontSize: 12, paddingLeft: 5, paddingRight: 5 }}>{T ? HomeTeamName : AwayTeamName}</Text>
											{!T && <ImageForTeam TeamId={AwayTeamId} imgSize={14} Vendor={Vendor} IconUrl={AwayIconUrl}  />}
										</View>
										<View style={styles.message}>
											{T && <View style={styles.leftIcon} />}
											<Text style={{ padding: 10, fontSize: 12, lineHeight: 19 }}>{this.ChangeMessage(Message, highlight)}</Text>
											{!T && <View style={styles.RightIcon} />}
										</View>
									</View>
								);
							})
						) : (
							type == 3 && <Skeleton />
						)}
						{
							showMore == 5 &&
							PregameInsights &&
							PregameInsights != '' &&
							PregameInsights.length > 5 &&
							type == 3 && (
								<View style={{ alignItems: 'center' }}>
									<Touch onPress={() => { this.setState({ showMore: 9999999 }) }} style={styles.showMore}>
										<Text style={{ color: '#00A6FF', fontSize: 12, }}>显示更多</Text>
									</Touch>
								</View>
							)}
					</View>
					}
				</View>
				{/* <style jsx global>{`
					.RealTimeCommunication .message {
						border: ${type == 1 ? 'none !important' : null};
					}
					.RealTimeCommunication .number{
						display ${type == 3 ? 'none' : 'inline-block'};
					}
					.RealTimeCommunication .logo,.name{
						display ${type == 1 ? 'none' : 'inline-block'};
					}


				`}</style> */}
			</View>
		);
	}
}

export default RealTimeCommunication;

const styles = StyleSheet.create({
	information: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		width: width,
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#EFEFF4',
		backgroundColor: '#fff'
	},
	informationIcon: {

	},
	showMore: {
		borderWidth: 1,
		borderColor: '#00A6FF',
		borderRadius: 8,
		padding: 8,
		marginTop: 25,
		marginBottom: 90,
	},
	itemLeft: {
		width: width,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		paddingLeft: 15,
		paddingRight: 15,
		marginBottom: 15,
	},
	itemRight: {
		width: width,
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		paddingLeft: 15,
		paddingRight: 15,
		marginBottom: 15,
	},
	title: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 10,
	},
	message: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderRadius: 12,
	},
	leftIcon: {
		backgroundColor: '#EB2121',
		borderTopLeftRadius: 12,
		borderBottomLeftRadius: 12,
		width: 4,
		height: '100%',
	},
	RightIcon: {
		backgroundColor: '#00A6FF',
		borderTopRightRadius: 12,
		borderBottomRightRadius: 12,
		width: 4,
		height: '100%',
	},
});
