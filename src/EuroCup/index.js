// import Layout from '@/Layout';
import CountDown from './Header/CountDown';
// import { withBetterRouter } from '$LIB/utils/withBetterRouter';
import React from 'react';
// import Tabs, {TabPane} from "rc-tabs";
import GameTab from "./Tabs/GameTab";
import PromoTab from "./Tabs/PromoTab";
// import Router from "next/router";
// import {checkIsLogin,redirectToLogin} from "$LIB/utils/util";
import VendorIM from './../containers/SbSports/lib/vendor/im/VendorIM';
import MiniEvent from './../containers/SbSports/game/Betting/MiniEvent';
import HeaderView from './Header/index'
import BetRecordTab from './Tabs/BetRecordTab/index'
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


class EuroCup2021 extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 1,
			scrollTop: 0,
			noCountDown: false, //是否有倒計時(影響內容高度)
			//從詳情頁過來的 縮小的比分框
			showMiniEvent: false,
			miniEventId: null,
			miniSportId: 1,
			miniLeagueId: null,
			miniShowType: 0,
		};

		this.setNoCountDown = this.setNoCountDown.bind(this);
		this.showBetRecord = this.showBetRecord.bind(this);

		this.BetRecordTabRef = React.createRef();
	}

	componentDidMount() {
		//處理tab自動切換
		// const {query} = this.props.router;
		// const tabMapping = {"betrecord": "2", "promo": "3"}
		// console.log('===query.tab',query.tab);
		// if (query.tab) {
		// 	const mappingTabKey = tabMapping[query.tab];
		// 	if (mappingTabKey) {
		// 		this.setState({selectedTab: mappingTabKey} );
		// 	}
		// }
	}

	componentWillUnmount() {
	}

	//處理沒有倒計時的樣式
	setNoCountDown(value) {
		if (value !== this.state.noCountDown) { //有變更才重新設定
			this.setState({ noCountDown: value })
		}
	}

	//處理投注後切換注單tab
	showBetRecord(wagertype = 'unsettle') {
		this.setState(
			{ selectedTab: "2" }, //"betrecord": "2"
			() => {
				setTimeout(() => {
					if (this.BetRecordTabRef) {
						this.BetRecordTabRef.showTabDataAndUpdateUrl(wagertype)
					}
				}, 1000); //等一秒再加載
			}
		);
	}

	tabChange(key) {
		if (this.state.selectedTab !== key) {
			if (!ApiPort.UserLogin && key == 2) {
				Actions.Login()
				return
			}

			this.setState({ selectedTab: key }, () => { });
			//更新網址鏈接
			// const { pathname, query } = this.props.router;
			// let cloneQuery = Object.assign({}, query);
			// //更換path配置
			// const tabMapping = {"2": "betrecord" , "3": "promo" }
			// const mappingTabParam = tabMapping[key];
			// //console.log('===',mappingTabParam,'|||',key, JSON.stringify(cloneQuery));
			// if (mappingTabParam) {
			// 	cloneQuery.tab = mappingTabParam;
			// } else {
			// 	delete cloneQuery['tab'];
			// }
			// const params = new URLSearchParams(cloneQuery);
			// const hasParams = (JSON.stringify(cloneQuery) !== '{}');
			// //用replace，避免用戶可以點擊back返回
			// Router.replace(pathname + (hasParams ? '?' + params.toString() : ''), undefined, { shallow: true });
		}
	}
	render() {
		const {
			selectedTab,
			scrollTop,
		} = this.state

		window.MiniEventShowEuroCup = (showMiniEvent, miniEventId, miniSportId, miniLeagueId, miniShowType) => {
			console.log(showMiniEvent,'showMiniEventshowMiniEventshowMiniEvent')
			this.setState({
				showMiniEvent, miniEventId, miniSportId, miniLeagueId, miniShowType
			})
		}
		window.ChangeTabs = (key) => {
			this.tabChange(key)
		}
		return (
			<View style={{ flex: 1 }}>
				<HeaderView />
				<ScrollView
					onScroll={(e) => {
						let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
						let scrollTop = offsetY
						this.setState({scrollTop})
					}}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
				>
					<CountDown setNoCountDown={this.setNoCountDown} />
					{/* Tabs */}
					<View style={styles.tabs}>
						<Touch onPress={() => { this.tabChange(1) }} style={[selectedTab == 1 ? styles.activeTabs : styles.noTabs]}>
							<Text style={{ color: selectedTab == 1 ? '#00A6FF' : '#616161' }}>赛事</Text>
						</Touch>
						<Touch onPress={() => { this.tabChange(2) }} style={[selectedTab == 2 ? styles.activeTabs : styles.noTabs]}>
							<Text style={{ color: selectedTab == 2 ? '#00A6FF' : '#616161' }}>注单</Text>
						</Touch>
						<Touch onPress={() => { this.tabChange(3) }} style={[selectedTab == 3 ? styles.activeTabs : styles.noTabs]}>
							<Text style={{ color: selectedTab == 3 ? '#00A6FF' : '#616161' }}>优惠</Text>
						</Touch>
					</View>
					{
						selectedTab == 1 &&
						<GameTab scrollTop={scrollTop} Vendor={VendorIM} noCountDown={this.state.noCountDown} showBetRecord={this.showBetRecord} />
					}
					{
						selectedTab == 2 &&
						<BetRecordTab />
					}
					{
						selectedTab == 3 &&
						<PromoTab />
					}
				</ScrollView>
				{/* 缩小详情页面 */}
				{this.state.showMiniEvent ? (
					<MiniEvent
						Vendor={VendorIM}
						EventId={this.state.miniEventId}
						SportId={this.state.miniSportId}
						LeagueId={this.state.miniLeagueId}
						ShowType={this.state.miniShowType}
						CloseMini={() => {
							this.setState({ showMiniEvent: false, miniEventId: null, miniSportId: 1, miniLeagueId: null, miniShowType: 0 });

							//更新網址鏈接
							// const { pathname, query } = this.props.router;
							// let cloneQuery = Object.assign({}, query);
							// //刪除mini配置
							// delete cloneQuery['miniEventId'];
							// delete cloneQuery['miniSportId'];
							// delete cloneQuery['miniLeagueId'];
							// delete cloneQuery['miniShowType'];
							// const params = new URLSearchParams(cloneQuery);
							// //用replace，避免用戶可以點擊back返回
							// Router.replace(pathname + '?' + params.toString(), undefined, { shallow: true });
						}}
					/>
				) : null}
			</View>
			// <Layout>
			// 	<div className="Games-content">
			// 		<CountDown setNoCountDown={this.setNoCountDown} />
			// 		<Tabs
			// 			prefixCls="tabsNormal"
			// 			className="main-tabs"
			// 			activeKey={this.state.selectedTab}
			// 			defaultActiveKey={"1"}
			// 			onTabClick={(key) => {
			// 				if (this.state.selectedTab !== key) {
			// 					if (key == '2' && !checkIsLogin()) {
			// 						redirectToLogin();
			// 						return false;
			// 					}

			// 					this.setState({selectedTab: key},() => {});
			// 					//更新網址鏈接
			// 					const { pathname, query } = this.props.router;
			// 					let cloneQuery = Object.assign({}, query);
			// 					//更換path配置
			// 					const tabMapping = {"2": "betrecord" , "3": "promo" }
			// 					const mappingTabParam = tabMapping[key];
			// 					//console.log('===',mappingTabParam,'|||',key, JSON.stringify(cloneQuery));
			// 					if (mappingTabParam) {
			// 						cloneQuery.tab = mappingTabParam;
			// 					} else {
			// 						delete cloneQuery['tab'];
			// 					}
			// 					const params = new URLSearchParams(cloneQuery);
			// 					const hasParams = (JSON.stringify(cloneQuery) !== '{}');
			// 					//用replace，避免用戶可以點擊back返回
			// 					Router.replace(pathname + (hasParams ? '?' + params.toString() : ''), undefined, { shallow: true });
			// 				}
			// 			}}
			// 		>
			// 			<TabPane tab={`赛事`} key="1">
			// 				<GameTab Vendor={this.props.Vendor} noCountDown={this.state.noCountDown} showBetRecord={this.showBetRecord}/>
			// 			</TabPane>
			// 			<TabPane tab={`注单`} key="2">
			// 				<BetRecordTab customRef={(ref) => this.BetRecordTabRef = ref} Vendor={this.props.Vendor} noCountDown={this.state.noCountDown}/>
			// 			</TabPane>
			// 			<TabPane tab={`优惠`} key="3">
			// 				<PromoTab />
			// 			</TabPane>
			// 		</Tabs>
			// 	</div>
			// </Layout>
		);
	}
}

const styles = StyleSheet.create({
	tabs: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		flexDirection: 'row',
		backgroundColor: '#E0E0E0',
		width: width,
		height: 40,
		marginTop: 10,
	},
	activeTabs: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width * 0.33,
		height: 36,
		backgroundColor: '#EFEFF4',
		borderTopRightRadius: 5,
		borderTopLeftRadius: 5,
	},
	noTabs: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width * 0.33,
		height: 36,
	},
})

export default EuroCup2021;
