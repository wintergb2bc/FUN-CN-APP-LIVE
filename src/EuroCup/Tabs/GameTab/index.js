import React from "react";
// import { withBetterRouter } from '$LIB/utils/withBetterRouter';
// import Image from '@/Image/Image';
import GameList from "./GameList";
// import Router from 'next/router';
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
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';

class GameTab extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//列表/日期切換展示
			displayType: 1,
			dataIsEmpty: false, //如果空數據不展示切換按鈕
		}

		this.setDataIsEmpty = this.setDataIsEmpty.bind(this);
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	//如果空數據不展示切換按鈕
	setDataIsEmpty(value) {
		if (value !== this.state.dataIsEmpty) { //有變更才重新設定
			this.setState({ dataIsEmpty: value })
		}
	}

	render() {
		const { displayType } = this.state;
		const { Vendor } = this.props;
		return <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>

			<View className="menu-bar">
				<View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', padding: 15 }}>
					{
						!this.state.dataIsEmpty ?
							<View>
								{/* <input className="Game-switch" type="checkbox" hidden checked={displayType === 2} readOnly="readOnly" /> */}
								<Touch style={styles.changeTab}
									onPress={() => {
										let targetWay = 2;
										if (displayType === 2) {
											targetWay = 1;
										}
										this.setState(
											{
												displayType: targetWay
											}
										);
									}}
								>
									<View style={[displayType == 1 ? styles.activeTabs : styles.notabs, styles.leftTabs]}>
										<Text style={{ color: displayType == 1 ? '#fff' : '#616161' }}>
											列表
          								</Text>
									</View>
									<View style={[displayType == 2 ? styles.activeTabs : styles.notabs, styles.rightTabs]}>
										<Text style={{ color: displayType == 2 ? '#fff' : '#616161' }}>
											日期
          								</Text>
									</View>
								</Touch>
							</View>
							: <View style={{ width: 50, height: 20 }} />
					}
					<Touch style={styles.ranking} onPress={() => {Actions.EuroCupGroup(); PiwikEvent('Engagement Event', 'View', `Team_Stats_EUROPage`)}}>
						<Image source={require("../../../images/euroCup/badge.png")} style={{ height: 20, width: 15 }} />
						<Text style={{ color: '#fff', paddingLeft: 5 }}>排名</Text>
					</Touch>
				</View>
			</View>
			<GameList
				scrollTop={this.props.scrollTop}
				Vendor={Vendor}
				DisplayType={displayType}
				setDataIsEmpty={this.setDataIsEmpty}
				noCountDown={this.props.noCountDown}
				showBetRecord={this.props.showBetRecord}
			/>
			<View style={{ backgroundColor: '#E6E6EB' }}>
				<Text style={{ fontSize: 11, color: '#999999', lineHeight: 50, textAlign: 'center' }}>© 版权归乐天堂 FUN88 2008-2021 所有违者必究</Text>
			</View>
		</View>
	}
}

const styles = StyleSheet.create({
	ranking: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F35B0E',
		borderRadius: 50,
		height: 26,
		paddingLeft: 10,
		paddingRight: 10,
	},
	changeTab: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#E0E0E0',
		width: 100,
		borderRadius: 50,
		paddingLeft: 20,
		paddingRight: 20,
	},
	leftTabs: {
		borderTopLeftRadius: 50,
		borderBottomLeftRadius: 50,
	},
	rightTabs: {
		borderTopRightRadius: 50,
		borderBottomRightRadius: 50,
	},
	activeTabs: {
		backgroundColor: '#00A6FF',
		width: 50,
		height: 26,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	notabs: {
		width: 50,
		height: 26,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}
})

export default GameTab
