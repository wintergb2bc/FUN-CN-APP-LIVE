/* 可滑動 賠率區塊  */

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
import LineColumn from "./LineColumn";
import { dataIsEqual } from '../../../../../lib/js/util';
const { width, height } = Dimensions.get("window");
import React from "react";


const swiperConfigs = {
	autoplay: false,
	speed: 500,
	spaceBetween: 30,
	effect: 'fade',
	roundLengths: true /* 防止常规分辨率屏幕上的文本模糊 */,
	loop: true /* 循环模式 */,
	pagination: {
		el: '.game-swiper-pagination',
		bulletElement: 'li',
		hideOnClick: true,
		clickable: true
	},
	passiveListeners: true /* 事件侦听器，以提高移动设备上的滚动性能 */
};

class OddsSwiper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeSlide: 0,
		}
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}



	//優化效能：只有指定的prop變化時才要重新渲染
	shouldComponentUpdate(nextProps, nextState) {
	  const thisPropLines = this.props.EventData ? this.props.EventData.Lines : null;
	  const nextPropLines = nextProps.EventData ? nextProps.EventData.Lines : null;

	  const thisPropEventId = this.props.EventData ? this.props.EventData.EventId : null;
	  const nextPropEventId = nextProps.EventData ? nextProps.EventData.EventId : null;

	  return (
			JSON.stringify(thisPropLines) !== JSON.stringify(nextPropLines)
			|| this.props.OddsUpData.Events[thisPropEventId] !== nextProps.OddsUpData.Events[nextPropEventId]
			|| this.props.OddsDownData.Events[thisPropEventId] !== nextProps.OddsDownData.Events[nextPropEventId]
		)
	}

	render() {
		const { Vendor, EventData, OddsUpData, OddsDownData, ClickOdds } = this.props;

		//console.log('===OddsSwiper rendered', EventData ? EventData.EventId : 'NULL Event');

		//投注線兩個一組
		let pairedLines = [];
		if (EventData && EventData.Lines && EventData.Lines.length > 0) {
			//判斷投注線有哪些種類的 periodId 1全場 2上半 3下半
			let PeriodIds = [];
			EventData.Lines.map((d, n) => {
				if ([1,2,3].indexOf(d.PeriodId) > -1) {
					PeriodIds.push(d.PeriodId);
				}
			});
			const Periodlist = [...new Set(PeriodIds)];

			Periodlist.map(periodId => {
				//目前固定左讓球右大小，後面可能需要按體育類型去區分
				let LeftLine = null;
				let RightLine = null;
				const LeftLines = EventData.Lines.filter(l => l.PeriodId === periodId && l.BetTypeName === '让球')
				if (LeftLines && LeftLines.length > 0) {
					LeftLine = LeftLines[0];
				}
				const RightLines = EventData.Lines.filter(l => l.PeriodId === periodId && l.BetTypeName === '大小')
				if (RightLines && RightLines.length > 0) {
					RightLine = RightLines[0];
				}

				const PairId = (LeftLine ? LeftLine.LineId : '') + '_' + (RightLine ? RightLine.LineId : '')
				pairedLines.push({ LeftLine, RightLine, PairId, PeriodId: periodId });
			})
		}

		// const getSwiperConfigs = (item) => {
		// 	let clone = JSON.parse(JSON.stringify(swiperConfigs));
		// 	return Object.assign(clone, { loop: item && item.length > 1 });
		// };

		// const thisSwiperConfigs = getSwiperConfigs(pairedLines);
		//console.log('pairedLinespairedLinespairedLines', pairedLines)
		return (
			<View>
				{
					pairedLines.length > 0 ?
						<View>
							<ScrollView
								horizontal={true}
								pagingEnabled={true}
								showsHorizontalScrollIndicator={false}
								showsVerticalScrollIndicator={false}
								onMomentumScrollEnd = {(e) => {
									let offsetY = e.nativeEvent.contentOffset.x; //滑动距离
									let oriageScrollWidth = e.nativeEvent.layoutMeasurement.width; //scrollView宽度

									let activeSlide = 0
									if(offsetY != 0) {
										//滑动块数
										activeSlide = offsetY / oriageScrollWidth
									}
									this.setState({activeSlide})
								}}
							>
								{
									/* 只保留第一层 全场让球 全场大小 */
									pairedLines.splice(0, 1).map((item, index) => {
										let pariedLineData = item
										//console.log(pariedLineData, 'itemitemitemitemitemitem', item)
										return(
											<View key={index} style={{ display: 'flex', justifyContent: 'space-around', alignContent: 'center', width: width * 0.5, flexDirection: 'row' }} >
												<LineColumn
													Vendor={Vendor}
													LineData={pariedLineData.LeftLine}
													LeftOrRight="LEFT"
													PeriodId={pariedLineData.PeriodId}
													/* 上升赔率 */
													OddsUpData={OddsUpData}
													/* 下降赔率 */
													OddsDownData={OddsDownData}
													/* 點擊賠率 */
													ClickOdds={ClickOdds}
												/>
												<LineColumn
													Vendor={Vendor}
													LineData={pariedLineData.RightLine}
													LeftOrRight="RIGHT"
													PeriodId={pariedLineData.PeriodId}
													/* 上升赔率 */
													OddsUpData={OddsUpData}
													/* 下降赔率 */
													OddsDownData={OddsDownData}
													/* 點擊賠率 */
													ClickOdds={ClickOdds}
												/>
											</View>
										)
									})
								}
							</ScrollView>
							{/* <View style={{display: 'flex', justifyContent: 'center',alignItems: 'center', flexDirection: 'row',paddingBottom: 8}}>
								{
									pairedLines.map((item, index) => {
										return(
											<View key={index} style={this.state.activeSlide == index? styles.activeSlide : styles.noactiveSlide} />
										)
									})
								}
							</View> */}
						</View>
						:
						<View>
							<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<Text style={{ width: width * 0.24, textAlign: 'center', lineHeight: 38 }}>
									全场让球
							</Text>
								<Text style={{ width: width * 0.24, textAlign: 'center', lineHeight: 38 }}>
									全场大小
							</Text>
							</View>
							<View style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', width: width * 0.5, flexWrap: 'wrap' }}>
								{[1, 2, 3, 4].map((item, index) => {
									return (
										<View key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7', borderRadius: 5, height: 40, marginBottom: 5, width: width * 0.23 }}>
											<Text style={{color: '#bcbec3'}}>—</Text>
										</View>
									)
								})}
							</View>

						</View>
				}
			</View>
		);
	}
}

export default OddsSwiper


const styles = StyleSheet.create({
	lists: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		height: 42,
		width: width * 0.5,
	},
	activeSlide: {
		width: 12,
		height: 3,
		backgroundColor: '#BCBEC3',
		borderRadius: 10,
		marginLeft: 5,
	},
	noactiveSlide: {
		width: 3,
		height: 3,
		backgroundColor: '#BCBEC3',
		borderRadius: 10,
		marginLeft: 5,
	},
});