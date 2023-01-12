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
import { Flex, Toast, WingBlank, WhiteSpace, Tabs, Drawer } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
const { width, height } = Dimensions.get("window");
import React from "react";
import SelectionOdds from "./SelectionOdds";
import CorrectScoreSelectionBox from "./CorrectScoreSelectionBox";
// import { ChangeSvg } from '$LIB/js/util';
// import Router from 'next/router';
import { connect } from 'react-redux';

class SelectionBox extends React.Component {
	render() {
		const { Vendor, IndexInArray, LineData, OddsUpData, OddsDownData, ClickOdds } = this.props;
		const { SelectionCountInLine, Selections } = LineData;

		let width = this.props.detailWidth;

		//波膽特別處理
		if (Vendor.isCorrectScoreLine(LineData)) {
			return <CorrectScoreSelectionBox
				Vendor={Vendor}
				OddsUpData={OddsUpData}
				OddsDownData={OddsDownData}
				LineData={LineData}
				IndexInArray={IndexInArray}
				ClickOdds={ClickOdds}
				detailWidth={width}
			/>
		}

		return (
			<View style={styles.listData}>
				{//這裡針對 主客隊 相關玩法(讓球,角球總數等) 展示隊伍名
					IndexInArray === 0 &&
					LineData.IsDisplayByTeam && (
						<View style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center',width: width, flexDirection: 'row',flexWrap: 'wrap',}}>
							<View>
								<Text style={{
									width: SelectionCountInLine == 3 ? width * 0.25 : width * 0.35,
									textAlign: 'center',
								}}>{LineData.HomeTeamName}</Text>
							</View>
							{SelectionCountInLine == 3 ? (
								<View>
									<Text style={{ color: 'transparent' }}>11</Text>
								</View>
							) : null //湊三個符合排版
							}
							<View>
								<Text style={{
									width: SelectionCountInLine == 3 ? width * 0.25 : width * 0.35,
									textAlign: 'center',
								}}>{LineData.AwayTeamName}</Text>
							</View>
						</View>
					)}
				<View style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center',width: width, flexDirection: 'row',flexWrap: 'wrap',}}>
					{Selections.map((item, index) => {
						return <SelectionOdds
							key={index}
							Vendor={Vendor}
							SelectionData={item}
							LineIsLocked={LineData.IsLocked}
							OddsUpData={OddsUpData}
							OddsDownData={OddsDownData}
							ClickOdds={ClickOdds}
							SelectionCountInLine={SelectionCountInLine}
							detailWidth={width}
						/>
					})}
				</View>
			</View>
		);
	}
}

export default SelectionBox;

const styles = StyleSheet.create({
	listData: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	SelectionHeader1: {
		backgroundColor: '#f7f7f7',
		height: 38,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 10,
		borderRadius: 5,
		paddingLeft: 8,
		paddingRight: 8,
	},
	SelectionHeader2: {
		backgroundColor: '#f7f7f7',
		height: 38,
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 10,
		borderRadius: 5,
	},
	SelectionHeader3: {

		backgroundColor: '#f7f7f7',
		height: 38,
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 10,
		borderRadius: 5,
	}
})
