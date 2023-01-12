/* 展示 一直條 的投注線(Line) 包含一個頭，跟兩個OddsCell */


import { dataIsEqual } from '../../../../../lib/js/util';
// import {VendorPeriodName} from "$SBLIB/vendor/data/VendorConsts";
import {VendorPeriodName} from '../../../../../lib/vendor/data/VendorConsts';
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
import LineDescCell from "./LineDescCell";
import OddsCell from "./OddsCell";
const { width, height } = Dimensions.get("window");
import React from "react";

class LineColumn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}

		//指定要監控變化的prop
		this.MonitorProps = ['LeftOrRight', 'PeriodId'];
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	shouldComponentUpdate(nextProps, nextState) {
	  const thisPropLineKey = this.props.LineData ? this.props.LineData.EventId + '|||' + this.props.LineData.LineId : null;
	  const nextPropLineKey = nextProps.LineData ? nextProps.LineData.EventId + '|||' + nextProps.LineData.LineId: null;

	  return !dataIsEqual(this.props, nextProps, this.MonitorProps)
	  || JSON.stringify(this.props.LineData) !== JSON.stringify(nextProps.LineData)
	    || this.props.OddsUpData.Lines[thisPropLineKey] !== nextProps.OddsUpData.Lines[nextPropLineKey]
	    || this.props.OddsDownData.Lines[thisPropLineKey] !== nextProps.OddsDownData.Lines[nextPropLineKey]
	}

	render() {
		const {Vendor, LineData, OddsUpData, OddsDownData, ClickOdds, LeftOrRight, PeriodId } = this.props;

		//console.log('====Line rendered', LineData ? LineData.EventId + '|||' + LineData.LineId : 'NULL Line');

		let selectionForHome = null;
		let selectionForAway = null;

		if (LineData && LineData.Selections && LineData.Selections.length > 1) {
			if (LineData.Selections.length === 2) {
				//一般來說應該會排整齊，第一個是主，第二個是客
				selectionForHome = LineData.Selections[0];
				selectionForAway = LineData.Selections[1];
			}

			//如果排錯，或者返回的selection不是剛好兩個，就嘗試用filter找對應的
			if (!selectionForHome || (selectionForHome.TargetTeamId !== null && selectionForHome.TargetTeamId !== selectionForHome.HomeTeamId)) {
				const selectionsForHome = LineData.Selections.filter(s => s.TargetTeamId === s.HomeTeamId);
				if (selectionsForHome && selectionsForHome.length > 0) {
					selectionForHome = selectionsForHome[0];
				}
			}
			if (!selectionForAway || (selectionForAway.TargetTeamId !== null && selectionForAway.TargetTeamId !== selectionForAway.AwayTeamId)) {
				const selectionsForAway = LineData.Selections.filter(s => s.TargetTeamId === s.AwayTeamId);
				if (selectionsForAway && selectionsForAway.length > 0) {
					selectionForAway = selectionsForAway[0];
				}
			}
		}

		return (
			<View>
				{
					LineData ? (
						<View style={{ width: (width * 0.25 - 2) }}>
							<LineDescCell LineData={LineData} />
							{/*主隊賠率*/}
							<OddsCell
								Vendor={Vendor}
								SelectionData={selectionForHome}
								LineIsLocked={LineData.IsLocked}
								OddsUpData={OddsUpData}
								OddsDownData={OddsDownData}
								ClickOdds={ClickOdds}
							/>
							{/*客隊賠率*/}
							<OddsCell
								Vendor={Vendor}
								SelectionData={selectionForAway}
								LineIsLocked={LineData.IsLocked}
								OddsUpData={OddsUpData}
								OddsDownData={OddsDownData}
								ClickOdds={ClickOdds}
							/>
						</View>
					) : (
							<View>
								<View>
									<Text style={{ width: width * 0.24, textAlign: 'center', lineHeight: 38 }}>
										{VendorPeriodName[PeriodId]}{LeftOrRight === 'LEFT' ? '让球' : '大小'}
									</Text>
								</View>
								<View style={styles.noactive}>
									<Image resizeMode='stretch' source={require('../../../../../images/betting/Locked.png')} style={{ width: 15, height: 15 }} />
								</View>
								<View style={styles.noactive}>
									<Image resizeMode='stretch' source={require('../../../../../images/betting/Locked.png')} style={{ width: 15, height: 15 }} />
								</View>
							</View>
						)
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	active: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#e6f6ff',
		borderRadius: 5,
		height: 42,
		marginBottom: 5,
		borderColor: '#00a6ff',
		borderWidth: 1,
	},
	noactive: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#f7f7f7',
		borderRadius: 5,
		height: 42,
		marginBottom: 5,
	},
});

export default LineColumn
