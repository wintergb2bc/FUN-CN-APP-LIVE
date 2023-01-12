/* 一般體育賽事 */

import React from "react";
import { dataIsEqual } from '../../../lib/js/util';
import TimeBlock from "./Parts/TimeBlock";
import FavouriteStar from "./Parts/FavouriteStar";
import LinesCount from "./Parts/LinesCount";
import CornerCount from "./Parts/CornerCount";
import TeamBlock, {TeamBlockHorizontal} from "./Parts/TeamBlock";
import {connect} from "react-redux";
import OddsSwiper from "./Parts/OddsSwiper";
import OddsCell from "./Parts/OddsSwiper/OddsCell";
import OddsHorizontal from "./Parts/OddsHorizontal";
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
const { width, height } = Dimensions.get("window");

class NormalEvent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	shouldComponentUpdate(nextProps, nextState) {
		const thisPropEventId = this.props.EventData ? this.props.EventData.EventId : null;
		const nextPropEventId = nextProps.EventData ? nextProps.EventData.EventId : null;

		return this.props.userSetting.ListDisplayType !== nextProps.userSetting.ListDisplayType
			|| this.props.ShowCorrectScore !== nextProps.ShowCorrectScore
			|| this.props.CorrectScoreExpandEventIds.indexOf(thisPropEventId) !== nextProps.CorrectScoreExpandEventIds.indexOf(nextPropEventId)
			|| (JSON.stringify(this.props.EventData) !== JSON.stringify(nextProps.EventData))
			|| this.props.OddsUpData.Events[thisPropEventId] !== nextProps.OddsUpData.Events[nextPropEventId]
			|| this.props.OddsDownData.Events[thisPropEventId] !== nextProps.OddsDownData.Events[nextPropEventId]
	}


	render() {
		const { Vendor, EventData, ToggleFavourite, ToSportsDetails, OddsUpData, OddsDownData, ClickOdds, DisplayType, EuroCup, ShowCorrectScore, CorrectScoreExpandEventIds, ToggleCorrectScore } = this.props;
		const {ListDisplayType} = this.props.userSetting;

		if (ShowCorrectScore) {
			return <CorrectScoreEvent
				Vendor={Vendor}
				EventData={EventData}
				ToggleFavourite={ToggleFavourite}
				ToSportsDetails={ToSportsDetails}
				OddsUpData={OddsUpData}
				OddsDownData={OddsDownData}
				ClickOdds={ClickOdds}
				CorrectScoreExpandEventIds={CorrectScoreExpandEventIds}
				ToggleCorrectScore={ToggleCorrectScore}
			/>
		}

		return (
			EuroCup ?
			<View>
				{
					DisplayType == 1 ? <VerticalEvent
					Vendor={Vendor}
					EventData={EventData}
					ToggleFavourite={ToggleFavourite}
					ToSportsDetails={ToSportsDetails}
					OddsUpData={OddsUpData}
					OddsDownData={OddsDownData}
					ClickOdds={ClickOdds}
				  /> : <HorizontalEvent
					Vendor={Vendor}
					EventData={EventData}
					ToggleFavourite={ToggleFavourite}
					ToSportsDetails={ToSportsDetails}
					OddsUpData={OddsUpData}
					OddsDownData={OddsDownData}
					ClickOdds={ClickOdds}
					ListDisplayType={ListDisplayType}
				  />
				}
			</View>
			:
			<View>
				{
					parseInt(ListDisplayType) != 2 ? <VerticalEvent
					Vendor={Vendor}
					EventData={EventData}
					ToggleFavourite={ToggleFavourite}
					ToSportsDetails={ToSportsDetails}
					OddsUpData={OddsUpData}
					OddsDownData={OddsDownData}
					ClickOdds={ClickOdds}
				/> : <HorizontalEvent
					Vendor={Vendor}
					EventData={EventData}
					ToggleFavourite={ToggleFavourite}
					ToSportsDetails={ToSportsDetails}
					OddsUpData={OddsUpData}
					OddsDownData={OddsDownData}
					ClickOdds={ClickOdds}
					ListDisplayType={ListDisplayType}
				/>
				}
			</View>
		)
	}
}

const mapStateToProps = state => ({
	userSetting: state.userSetting,
  });

  export default connect(
	mapStateToProps,
	null,
  )(NormalEvent);


export class VerticalEvent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	shouldComponentUpdate(nextProps, nextState) {
		const thisPropEventId = this.props.EventData ? this.props.EventData.EventId : null;
		const nextPropEventId = nextProps.EventData ? nextProps.EventData.EventId : null;

		return (
			JSON.stringify(this.props.EventData) !== JSON.stringify(nextProps.EventData)
			|| this.props.OddsUpData.Events[thisPropEventId] !== nextProps.OddsUpData.Events[nextPropEventId]
			|| this.props.OddsDownData.Events[thisPropEventId] !== nextProps.OddsDownData.Events[nextPropEventId]
		)
	}

	render() {
		const { Vendor, EventData, ToggleFavourite, ToSportsDetails, OddsUpData, OddsDownData, ClickOdds} = this.props;
		//console.log('asssssssssssssssssssssssssss')
		//console.log('===Event rendered', EventData ? EventData.EventId : 'NULL Event');

		return (
			<View style={{ flex: 1, width: width, borderBottomColor: '#EFEFF4', borderBottomWidth: 1, }}>
				<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
					<View style={{ width: width * 0.5, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
						<View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: 38 }}>
							{/* 時間 直播等圖示 */}
							<TimeBlock EventData={EventData} />
							{/* 關注(收藏)星 */}
							<FavouriteStar EventData={EventData} ToggleFavourite={ToggleFavourite} />
							{/* 投注線(玩法)總數 */}
							<LinesCount EventData={EventData} />
							{/* 角球 總數 */}
							<CornerCount EventData={EventData} />
						</View>
						{/* 主队 球隊名 比分 紅牌 */}
						<TeamBlock
							Vendor={Vendor}
							EventData={EventData}
							ToSportsDetails={ToSportsDetails}
							HomeOrAway="HOME"
						/>
						{/* 客队 球隊名 比分 紅牌 */}
						<TeamBlock
							Vendor={Vendor}
							EventData={EventData}
							ToSportsDetails={ToSportsDetails}
							HomeOrAway="AWAY"
						/>
					</View>
					<View style={{ width: width * 0.5 }}>
						<OddsSwiper
							Vendor={Vendor}
							/* 盘口数据 */
							EventData={EventData}
							/* 上升赔率 */
							OddsUpData={OddsUpData}
							/* 下降赔率 */
							OddsDownData={OddsDownData}
							/* 點擊賠率 */
							ClickOdds={ClickOdds}
						/>
					</View>
				</View>
			</View>
		)
	}
}

export class HorizontalEvent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	shouldComponentUpdate(nextProps, nextState) {
		const thisPropEventId = this.props.EventData ? this.props.EventData.EventId : null;
		const nextPropEventId = nextProps.EventData ? nextProps.EventData.EventId : null;

		return (
			JSON.stringify(this.props.EventData) !== JSON.stringify(nextProps.EventData)
			|| this.props.OddsUpData.Events[thisPropEventId] !== nextProps.OddsUpData.Events[nextPropEventId]
			|| this.props.OddsDownData.Events[thisPropEventId] !== nextProps.OddsDownData.Events[nextPropEventId]
		)
	}

	render() {
		const { Vendor, EventData, ToggleFavourite, ToSportsDetails, OddsUpData, OddsDownData, ClickOdds } = this.props;
		//console.log('===Event rendered', EventData ? EventData.EventId : 'NULL Event');

		return (
			<View style={{ flex: 1, width: width, borderBottomWidth: 1,borderBottomColor: '#efeff4' }}>
				<View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
					<View style={{ width: width, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: 38 }}>
						<View style={{width: width * 0.33, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
							{/* 時間 直播等圖示 */}
							<TimeBlock EventData={EventData} />
							{/* 關注(收藏)星 */}
							<FavouriteStar EventData={EventData} ToggleFavourite={ToggleFavourite} />
						</View>
						{/* 投注線(玩法)總數 */}
						<View style={{width: width * 0.33}}>
							<CornerCount EventData={EventData} />
						</View>
						{/* 角球 總數 */}
						<View style={{width: width * 0.33, alignItems: 'flex-end', paddingRight: 20}}>
							<LinesCount ListDisplayType={2} EventData={EventData} ToSportsDetails={ToSportsDetails} Vendor={Vendor} />
						</View>
					</View>
					<View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 40}}>
						{/* 主队 球隊名 比分 紅牌 */}
						<TeamBlockHorizontal
							Vendor={Vendor}
							EventData={EventData}
							ToSportsDetails={ToSportsDetails}
							HomeOrAway="HOME"
						/>
						{/* 中間的 vs 或 - 字樣 */}
						{EventData &&
							(EventData.IsRB ? (
								<Text style={{color: '#BCBEC3', fontSize: 20, display: 'flex', justifyContent:'center', alignItems: 'center', paddingHorizontal: 8, lineHeight:40, height: 40}}>-</Text>
							) : (
								<Text style={{color: '#BCBEC3', fontSize: 16, display: 'flex', justifyContent:'center', alignItems: 'center', paddingHorizontal: 8, lineHeight:40,height: 40}} >VS</Text>
						))}
						{/* 客队 球隊名 比分 紅牌 */}
						<TeamBlockHorizontal
							Vendor={Vendor}
							EventData={EventData}
							ToSportsDetails={ToSportsDetails}
							HomeOrAway="AWAY"
						/>
					</View>
					<OddsHorizontal
						Vendor={Vendor}
						//盘口数据
						EventData={EventData}
						//上升赔率
						OddsUpData={OddsUpData}
						//下降赔率
						OddsDownData={OddsDownData}
						//點擊賠率
						ClickOdds={ClickOdds}
					/>
				</View>
			</View>
		)
	}
}

export class CorrectScoreEvent extends React.Component {
	constructor (props) {
		super(props);
	}

	componentDidMount () {
	}

	componentWillUnmount() {
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	shouldComponentUpdate(nextProps, nextState) {
		const thisPropEventId = this.props.EventData ? this.props.EventData.EventId : null;
		const nextPropEventId = nextProps.EventData ? nextProps.EventData.EventId : null;

		return (JSON.stringify(this.props.EventData) !== JSON.stringify(nextProps.EventData))
			|| this.props.OddsUpData.Events[thisPropEventId] !== nextProps.OddsUpData.Events[nextPropEventId]
			|| this.props.OddsDownData.Events[thisPropEventId] !== nextProps.OddsDownData.Events[nextPropEventId]
			|| this.props.CorrectScoreExpandEventIds.indexOf(thisPropEventId) !== nextProps.CorrectScoreExpandEventIds.indexOf(nextPropEventId)
	}

	toggleCorrectScoreViewMore = () => {
		if (this.props.EventData) {
			this.props.ToggleCorrectScore(this.props.EventData.EventId);
		}
	}

	render () {
		const {Vendor, EventData, ToggleFavourite, ToSportsDetails, OddsUpData, OddsDownData, ClickOdds, CorrectScoreExpandEventIds} = this.props;
		//console.log('===Event rendered', EventData ? EventData.EventId : 'NULL Event');

		let CorrectScoreViewMore = false;
		if (EventData && CorrectScoreExpandEventIds.indexOf(EventData.EventId) !== -1 ) {
			CorrectScoreViewMore = true;
		}

		let hasFTCorrectScore = false; //是否有全場波膽盤口
		let LineDesc = '全场波胆'; //默認的名稱
		let LineDataIsLocked = false; //投注線是否已鎖定
		let showViewMoreButtons = true; //超過5個才有展開/收合按鈕(for BTI可能低於5個的情況)
		let CorrectScores4HomeWin = [];
		let CorrectScores4Tie = [];
		let CorrectScores4AwayWin = [];
		let CorrectScores4Other = null;
		const correctScoreInfo = Vendor.getFTCorrectScoreSelectionsFromEvent(EventData);
		if (correctScoreInfo) {
			hasFTCorrectScore = true;
			LineDesc = correctScoreInfo.lineData.LineDesc ?? LineDesc;
			LineDataIsLocked = correctScoreInfo.lineData.IsLocked;
			if (correctScoreInfo.homes.length <= 5 && correctScoreInfo.ties.length <= 5 &&  correctScoreInfo.aways.length <= 5) {
				showViewMoreButtons = false;
			}
			if (CorrectScoreViewMore) {
				CorrectScores4HomeWin = correctScoreInfo.homes;
				CorrectScores4Tie = correctScoreInfo.ties;
				CorrectScores4AwayWin = correctScoreInfo.aways;
				CorrectScores4Other = correctScoreInfo.other;
			} else {
				CorrectScores4HomeWin = correctScoreInfo.homes.slice(0,5);
				CorrectScores4Tie = correctScoreInfo.ties.slice(0,5);
				CorrectScores4AwayWin = correctScoreInfo.aways.slice(0,5);
				CorrectScores4Other = null;
			}
		}

		return (
			<View style={{ flex: 1, width: width, borderBottomColor: '#EFEFF4', borderBottomWidth: 1, }}>
				<View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
					<View style={{ width: width, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
						<View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: 38 }}>
							{/* 時間 直播等圖示 */}
							<TimeBlock EventData={EventData} />
							{/* 關注(收藏)星 */}
							<FavouriteStar EventData={EventData} ToggleFavourite={ToggleFavourite} />
							{/* 投注線(玩法)總數 */}
							<LinesCount EventData={EventData} />
							{/* 角球 總數 */}
							<CornerCount EventData={EventData} />
						</View>
						{/* 主队 球隊名 比分 紅牌 */}
						<TeamBlock
							Vendor={Vendor}
							EventData={EventData}
							ToSportsDetails={ToSportsDetails}
							HomeOrAway="HOME"
							EventType="CORRECTSCORE"
						/>
						{/* 客队 球隊名 比分 紅牌 */}
						<TeamBlock
							Vendor={Vendor}
							EventData={EventData}
							ToSportsDetails={ToSportsDetails}
							HomeOrAway="AWAY"
							EventType="CORRECTSCORE"
						/>
					</View>
					{/* 波膽展示 */}
					{hasFTCorrectScore
						?
						<View style={{ paddingHorizontal: 4 }}>
							{/*<Text className="CorrectScoreTitle">{LineDesc}</Text>*/}
							<Text style={{ marginLeft: 4, fontSize: 12, lineHeight: 22 }}>全场波胆</Text>
							<View style={{ width: width, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
								{ [CorrectScores4HomeWin, CorrectScores4Tie, CorrectScores4AwayWin].map((selections,index) => {
									return <View style={{ flex: 1, marginHorizontal: 4 }} key={index}>
										{selections.map((item,selectionIndex) => {
											return <OddsCell
												key={selectionIndex}
												Vendor={Vendor}
												SelectionData={item}
												LineIsLocked={LineDataIsLocked}
												OddsUpData={OddsUpData}
												OddsDownData={OddsDownData}
												ClickOdds={ClickOdds}
												EventType="CORRECTSCORE"
											/>
										})}
									</View>
								}) }
							</View>
							{ CorrectScores4Other ?
								<View style={{ marginHorizontal: 4 }}>
									<OddsCell
										Vendor={Vendor}
										SelectionData={CorrectScores4Other}
										LineIsLocked={LineDataIsLocked}
										OddsUpData={OddsUpData}
										OddsDownData={OddsDownData}
										ClickOdds={ClickOdds}
										EventType="CORRECTSCORE"
									/>
								</View> : null }
							{ showViewMoreButtons ? <>
								{ !CorrectScoreViewMore ?
									<Touch
										style={{  height: 49, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
										onPress={this.toggleCorrectScoreViewMore}
									>
										<Text style={{ color: '#00A6FF', fontSize: 12, lineHeight: 16 }}>查看更多</Text><Image resizeMode='stretch' source={require('../../../images/betting/down-blue.png')} style={{ width: 14, height: 14, marginLeft: 4 }} />
									</Touch> : null }
								{ CorrectScoreViewMore ?
									<Touch
										style={{  height: 49, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
										onPress={this.toggleCorrectScoreViewMore}
									>
										<Text style={{ color: '#00A6FF', fontSize: 12, lineHeight: 16 }}>查看更少</Text><Image resizeMode='stretch' source={require('../../../images/betting/up-blue.png')} style={{ width: 14, height: 14, marginLeft: 4 }} />
									</Touch> : null }
							</> : <View style={{height: 25}} /> }
						</View>
						: <View style={{width: width, height: 49, display: 'flex', justifyContent: 'center', alignItems:'center'}}>
							<Text style={{fontSize: 12, lineHeight: 22, color: '#999999'}}>暂无波胆盘口</Text>
						</View>
					}
				</View>
			</View>
		)
	}
}
