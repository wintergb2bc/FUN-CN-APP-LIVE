/*
	投注页面 导航菜单  所有游戏种类
*/

import React from 'react';
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
	FlatList,
	TextInput,
	KeyboardAvoidingView,
} from "react-native";
import SnapCarousel, {
	ParallaxImage,
	Pagination
} from "react-native-snap-carousel";
import {
	Button,
	Carousel,
	WhiteSpace,
	WingBlank,
	Radio,
	InputItem,
	DatePicker,
	Flex,
	Toast,
	List
} from "antd-mobile-rn";
import Skeleton from '../Skeleton/Skeleton'
import { Actions } from "react-native-router-flux";
import Accordion from '../../containers/Accordion'
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import SelectionData from '../../lib/vendor/data/SelectionData';
import CryptoJS from "crypto-js";
import Collapsible from 'react-native-collapsible';
import OutRightEvent from './Events/OutRightEvent';
import NormalEvent from './Events/NormalEvent';
import Bottombetbox from '../Footer/bottombetbox';
import BetCartPopup from './BetCartPopup'
import {VendorMarkets} from "../../lib/vendor/data/VendorConsts";
import { connect } from 'react-redux';
import { ACTION_BetCart_setIsComboBet, ACTION_BetCart_add, ACTION_BetCart_remove, ACTION_BetCart_clear } from '$LIB/redux/actions/BetCartAction';
import EventData from "./../../lib/vendor/data/EventData";

import AccordionItem from 'antd-mobile-rn/lib/accordion/style/index.native';
const newStyle = {};
for (const key in AccordionItem) {
	if (Object.prototype.hasOwnProperty.call(AccordionItem, key)) {
		// StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
		newStyle[key] = { ...StyleSheet.flatten(AccordionItem[key]) };
		newStyle[key].borderBottomWidth = 0;
		newStyle[key].borderTopWidth = 0;
	}
}

const SECTIONS = [
	{
		title: 'First',
		content: 'Lorem ipsum...',
	},
	{
		title: 'Second',
		content: 'Lorem ipsum...',
	},
];

//分頁功能 在APP 是在EventListing實現
//const EventPerPageCount = 20; //分頁展示，默認每頁(每次展示)多少筆
class Betting extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			//分頁功能 在APP 是在EventListing實現
			//hasMore: true,
			// action: STATS.init,
			//init: EventPerPageCount,
			openLeague: -1,
			openLeagueNum: 0,
			expandAll: true, //是否全部展開
			LeagueToggleStatusArray: null, //保存聯賽展開/收起狀態
			CorrectScoreExpandEventIds : [], //保存全場波膽展開的EventId，因為數據刷新可能造成reset
		};

		this.clickOdds = this.clickOdds.bind(this);
		this.ShowBottom = React.createRef();
		//分頁功能 在APP 是在EventListing實現
		//this.dataIsFullLoaded = false; //數據已經完整取回(可以正確計算 上滑獲取數據 是否已經到底)
	}
	componentDidMount() {
		this.props.BettingRef && this.props.BettingRef(this);
	}

	//分頁功能 在APP 是在EventListing實現
	// hasMoreData = () => {
	// 	if (!this.dataIsFullLoaded) return true; //數據沒有完整取回前，都視為還沒取完
	// 	return (this.props.EventDatas) ? this.state.init < this.props.EventDatas.length : false;
	// };
	//
	// /* 以下 属于方法下拉刷新 上拉加载 */
	// handleAction = (action) => {
	// 	if (action === this.state.action) {
	// 		return false;
	// 	}
	// 	if (action === STATS.refreshing) {
	// 		return false;
	// 	} else if (action === STATS.loading) {
	// 		this.handLoadMore();
	// 	} else {
	// 		this.setState({
	// 			action: action
	// 		});
	// 	}
	// };
	//
	// handRefreshing = () => {
	// 	if (STATS.refreshing === this.state.action) {
	// 		return false;
	// 	}
	// 	setTimeout(() => {
	// 		this.setState({
	// 			hasMore: true,
	// 			action: STATS.refreshed
	// 		});
	// 	}, 1000);
	// 	this.setState({
	// 		action: STATS.refreshing
	// 	});
	// };
	//
	// handLoadMore = () => {
	// 	if (STATS.loading === this.state.action) {
	// 		return false;
	// 	}
	// 	//无更多内容则不执行后面逻辑
	// 	if (!this.state.hasMore) {
	// 		return;
	// 	}
	// 	setTimeout(() => {
	// 		if (!this.hasMoreData()) {
	// 			this.setState({
	// 				action: STATS.reset,
	// 				hasMore: false
	// 			});
	// 		} else {
	// 			let newState = { action: STATS.reset };
	// 			//已全部加載完，或者 當前還有未展示數據，才可以往上加
	// 			if (this.dataIsFullLoaded || (this.state.init < this.props.EventDatas.length)) {
	// 				newState.init = this.state.init + EventPerPageCount
	// 			}
	// 			this.setState(newState);
	// 		}
	// 	}, 1000);
	// 	this.setState({
	// 		action: STATS.loading
	// 	});
	// };
	//
	// //數據已經完整取回(可以正確計算 上滑獲取數據 是否已經到底)
	// setDataIsFullLoaded = (dataIsFullLoaded = true) => {
	// 	this.dataIsFullLoaded = dataIsFullLoaded;
	// }
	//
	// //數據刷新，需要把hasMore和init復原
	// onEventsRefresh = () => {
	// 	this.setState({ hasMore: true, init: EventPerPageCount });
	// };
	//
	// //獲取目前可視範圍數據量
	// getViewScopeDataCount = () => {
	// 	return this.state.init + EventPerPageCount*6; //當前數量+6頁緩衝
	// }

	/* 跳转至详情 */
	ToSportsDetails = (Vendor, EventData) => {
		const { SportId, EventId, LeagueId, IsOutRightEvent } = EventData;
		//加速開啟：列表的數據，存到緩存 拿來展示，等拿到詳情數據 再取代掉
		const cacheKey = SportId + '|||' + EventId;
		Vendor._cacheSet(cacheKey, JSON.stringify(EventData), 10);
		let dataList = {
			eid: EventId,
			sid: SportId,
			lid: LeagueId,
			OE: IsOutRightEvent,
		}
		console.log('OEOEOEOE',IsOutRightEvent)

		Actions.Betting_detail({ dataList, Vendor: this.props.Vendor })
		// Router.push(
		// 	`${Vendor.configs.VendorPage}/detail?sid=${SportId}&eid=${EventId}&lid=${LeagueId}&OE=${IsOutRightEvent}&BetMore=${this.state
		// 		.PlayBetCart}`
		// );
	};

	ShowBottomSheet = (type) => {
		this.ShowBottom.current.ShowBottomSheet(type);
	};

	/* 存储单投和串关数据 */
	PushBetCart = (data, type) => {
		const { VendorName } = this.props.Vendor.configs;
		this.props.betCart_add(data,VendorName)
		const isComboBet = this.props.betCartInfo['isComboBet' + VendorName];
		if (!isComboBet) {
			this.ShowBottom.current.ShowBottomSheet(type);
		}
	};

	/* 删除数据 */
	RemoveBetCart = async (data = null) => {
		const { VendorName } = this.props.Vendor.configs;
		if (data === null) {
			//清空
			await this.props.betCart_clear(VendorName);
			await this.props.betCart_setIsComboBet(false, VendorName);
		} else {
			//刪除單個
			await this.props.betCart_remove(data, VendorName)
		}

		// 如果刪除後購物車為空，自動關閉購物車
		const betCartData = this.props.betCartInfo['betCart' + VendorName];
		if (!betCartData || betCartData.length <= 0) {
			await this.props.betCart_setIsComboBet(false, VendorName);
			this.ShowBottom.current.CloseBottomSheet();
		}
	};

	//點擊賠率=>投注
	clickOdds = (selectionData) => {
		if (!global.localStorage.getItem('loginStatus') == 1) {
			Actions.Login({from: "sb"});
			return;
		}
		if(window.GetSelfExclusionRestriction('DisableBetting')) {
			return
		}
		if (!selectionData) {
			return;
		}

		if (!selectionData.DisplayOdds || selectionData.DisplayOdds == 0) return;

		PiwikEvent('Odds', 'Submit', 'Odds_mainpage_vertical')

		const { VendorName, MaxParlay } = this.props.Vendor.configs;
		const isComboBet = this.props.betCartInfo['isComboBet' + VendorName];
		const betCartData = this.props.betCartInfo['betCart' + VendorName];

		let overMaxSelectionCount = betCartData.length >= MaxParlay; //是否超過最大限制

		if (!isComboBet) { //單投
			this.PushBetCart(selectionData, 1);
		} else {
			//串關
			//沒超過最大限制
			if (!overMaxSelectionCount) {
				//串關模式是 點擊添加，再點一次就取消
				let indexOf = betCartData.findIndex((v) => {
					return v.SelectionId == selectionData.SelectionId;
				});
				if (indexOf === -1) {
					this.PushBetCart(selectionData, 2);
					Toasts.success('添加成功');
				} else {
					this.RemoveBetCart(selectionData);
				}
			} else {
				Toasts.fail('哎呀，最多可投注串关' + MaxParlay + '场呦');
			}
		}
	}

	toggleAll = (expandAll) => {

		// let newStatus = { expandAll };
		// if (expandAll) {
		// 	newStatus['LeagueToggleStatusArray'] = null;  //清空=全開
		// } else {
		// 	newStatus['LeagueToggleStatusArray'] = []; //空數組=全關
		// }
		this.setState({expandAll, openLeague: expandAll? 2: 0});
	};

	toggleCorrectScore = (EventId) => {
		this.setState(prevState => {
			if (prevState.CorrectScoreExpandEventIds.indexOf(EventId) !== -1) {
				return { CorrectScoreExpandEventIds :prevState.CorrectScoreExpandEventIds.filter(m => m !== EventId) }
			} else {
				return { CorrectScoreExpandEventIds : [...prevState.CorrectScoreExpandEventIds, EventId] }
			}
		})
	}

	gameList = ({item, index}) => {
		const { ToggleFavourite, EventDatas, OddsUpData, OddsDownData, Loading, Vendor, BetType } = this.props;
		const {
			expandAll,
			openLeague,
			openLeagueNum,
			LeagueToggleStatusArray,
		} = this.state;

		const betCartData = this.props.betCartInfo['betCart' + Vendor.configs.VendorName];

		let leagueData = item;
		// let CutEventList = [];
		// CutEventList = CutEventDatas.filter(
		// 	(data) =>
		// 		data.LeagueId == leagueData.LeagueId &&
		// 		leagueData.EventIds.indexOf(data.EventId) !== -1
		// )
		if(index == 0 && openLeagueNum != GameListNum) {
			//总个数发生变化刷新
			console.log('GameListNumGameListNum111',GameListNum)
			this.setState({openLeague: GameListNum, openLeagueNum: GameListNum})
		}
		// console.log('leagueData.LeagueId',leagueData.LeagueId)
		if (leagueData.LeagueId === 'separatorFav') {
			return <View key={leagueData.LeagueKey} style={styles.gameSeparator}>
				<Image resizeMode='stretch' source={require('../../images/betting/separatorFav.png')} style={{ width: 18, height: 18 }} />
				<Text style={{color: '#00A6FF', fontSize: 15,paddingLeft: 8,}}>关注赛事</Text>
			</View>
		}
		if (leagueData.LeagueId === 'separatorRun') {
			return <View key={leagueData.LeagueKey} style={styles.gameSeparator}>
				<Image resizeMode='stretch' source={require('../../images/betting/separatorRun.png')} style={{ width: 24, height: 12 }} />
				<Text style={{color: '#00A6FF', fontSize: 15,paddingLeft: 8,}}>滚球</Text>
			</View>
		}
		if (leagueData.LeagueId === 'separatorToday') {
			return <View key={leagueData.LeagueKey} style={styles.gameSeparator}>
				<Image resizeMode='stretch' source={require('../../images/betting/separatorToday.png')} style={{ width: 17, height: 17 }} />
				<Text style={{color: '#00A6FF', fontSize: 15,paddingLeft: 8,}}>即将进行的赛事</Text>
			</View>
		}
		return (
			<View key={index}>
				<Accordion
					showsAll={expandAll}
					closeAccordion={(isShow) => {

						let open = isShow ? openLeague + 1 : openLeague - 1
						this.setState({openLeague: open})
						console.log('GameListNumGameListNum',open)
						if(open > 0) {
							//一个打开就all就是开
							this.props.onAllLeaguesToggled(true)
						} else if(open < 1) {
							//关闭所以
							this.props.onAllLeaguesToggled(false)
						}
					 }}
					tltleList={leagueData}
					// valueNum={{
					// 	type: CutEventList[0].IsOutRightEvent ? 'OutRightEvent' : 'NormalEvent',//冠军和普通的高度不同
					// 	num: CutEventList.length
					// }}
					// key={expandAll? 1: 0}
				>
					{leagueData.children.map((CutEventitem, CutEventkey) => {
						return CutEventitem.IsOutRightEvent ? (
							<OutRightEvent
								key={CutEventitem.EventId}
								Vendor={Vendor}
								EventData={CutEventitem}
								ToggleFavourite={ToggleFavourite}
								ToSportsDetails={this.ToSportsDetails}
								ClickOdds={this.clickOdds}
							/>
						) : (
								<NormalEvent
									key={CutEventitem.EventId}
									Vendor={Vendor}
									EventData={CutEventitem}
									ToggleFavourite={ToggleFavourite}
									ToSportsDetails={this.ToSportsDetails}
									OddsUpData={OddsUpData}
									OddsDownData={OddsDownData}
									ClickOdds={this.clickOdds}
									ShowCorrectScore={this.props.ShowCorrectScore}
									CorrectScoreExpandEventIds={this.state.CorrectScoreExpandEventIds}
									ToggleCorrectScore={this.toggleCorrectScore}
								/>
							);
					})}
				</Accordion>
			</View>
		)
	}


	render() {
		const { ToggleFavourite, EventDatas, OddsUpData, OddsDownData, Loading, Vendor, BetType } = this.props;
		const {
			expandAll,
			openLeague,
			openLeagueNum,
			LeagueToggleStatusArray,
		} = this.state;

		const betCartData = this.props.betCartInfo['betCart' + Vendor.configs.VendorName];

		/* 赛事的列表数据 */
		/* 当前赛事类型的id 比如全场让球 全场大小的id */
		let PeriodIds = [];
		/* 截取的数据  */
		//分頁功能 在APP 是在EventListing實現
		// let CutEventDatas = EventDatas.slice(0, init);
		/* 截取的数据在Event那边截取 */
		let CutEventDatas = EventDatas;
		/* 獲取聯賽分組 */
		let leagueList = [];
		let currentLeague = null;
		let currentMarket = null;
		CutEventDatas.map((ev, index) => {
			const checkAndCreateSeparator = () => {
				//只有 市場選了[今天] 才需要展示 關注＋滾球＋今天
				if (!BetType || BetType.MarketId !== VendorMarkets.TODAY) {
					return false;
				}
				//處理分界點
				if (currentMarket !== ev.MarketIdForListing
					//分界點只有 關注,滾球 或 今天 才有 (IM早上9點-12點有可能返回早盤(market=1)比賽，用這個邏輯避免出現多餘的分界點)
					&& [VendorMarkets.FAVOURITE,VendorMarkets.RUNNING,VendorMarkets.TODAY].indexOf(ev.MarketIdForListing) !== -1) {
					let header = 'separatorToday';
					if (ev.MarketIdForListing === VendorMarkets.FAVOURITE) {
						header = 'separatorFav';
					} else if (ev.MarketIdForListing === VendorMarkets.RUNNING) {
						header = 'separatorRun';
					}
					leagueList.push({
						LeagueId: header, //聯賽id
						LeagueName: header, //聯賽名
						LeagueKey: header,
						EventIds: [], //該聯賽分組下的賽事
						children: [] //該聯賽分組下的賽事
					});
				}
			}
			if (index === 0) { //開頭第一個分隔線要先放
				checkAndCreateSeparator();
			}
			let createNewLeague = false;
			//逐筆往下查看賽事的聯賽變化
			if (currentLeague) {
				if (ev.LeagueId === currentLeague.LeagueId && ev.MarketIdForListing === currentMarket) {
					//聯賽相同，放一起
					currentLeague.children.push(ev);
				} else {
					//不相同，保留現在的聯賽分組
					leagueList.push(currentLeague);
					//產生一個新的聯賽分組
					createNewLeague = true;
				}
			} else {
				//第一個執行 還沒有currentLeague，
				//產生一個新的聯賽分組
				createNewLeague = true;
			}
			if (createNewLeague) {
				currentLeague = {
					LeagueId: ev.LeagueId, //聯賽id
					LeagueName: ev.LeagueName, //聯賽名
					MarketId: ev.MarketIdForListing, //市場，主要用來區分關注賽事
					children: [] //該聯賽分組下的賽事
				};
				currentLeague.children.push(ev);
				// currentLeague.LeagueKey = ev.LeagueId + '_' + ev.EventId; //因為時間排序 可能會有同一個聯賽 出現多次的情況，所以用  聯賽id + 第一個賽事id 作為key
			}

			if (index !== 0) { //兩個不同市場的分隔線 要在數據建立好之後才加入
				checkAndCreateSeparator();
			}

			currentMarket = ev.MarketIdForListing;
			//最後一筆 保留現在的聯賽分組
			if (index === CutEventDatas.length - 1) {
				leagueList.push(currentLeague);
			}
		});

		if(GameListNum == 0 || GameListNum != leagueList.length) {
			GameListNum = leagueList.length
		}



		/* console.log('%c赛事列表的数据', 'font-size:36px;color:red;', EventDatas); */
		return (
			<View style={{ flex: 1, backgroundColor: 'rgba(233,233,238,1)' }}>
				{Loading ? (
					<Skeleton EventsOnly={true} />
				) : EventDatas == '' ? (
					BetType.MarketId == 4 ?
						<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 35 }}>
							<Image
								onLoadStart={() => { this.props.isMore() }}
								resizeMode='stretch'
								source={require('../../images/shoucnag.png')}
								style={{ width: 100, height: 100 }}
							/>
							<Text style={{ color: '#2f4f4f', paddingTop: 10 }}>暂无关注赛事，马上关注赛事吧</Text>
						</View>
						:
						<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 35 }}>
							<Image
								onLoadStart={() => { this.props.isMore() }}
								resizeMode='stretch'
								source={require('../../images/logo.png')}
								style={{ width: 65, height: 29 }}
							/>
							<Text style={{ color: '#2f4f4f', paddingTop: 10 }}>哎呀！暂无相关赛事，换个游戏试试吧！</Text>
						</View>
				) : (
							<View>
								{
									leagueList.length > 0 &&
									<FlatList
										// key={leagueList.length}
										showsVerticalScrollIndicator={false} //是否显示垂直滚动条
										showsHorizontalScrollIndicator={false} //是否显示水平滚动条
										automaticallyAdjustContentInsets={false}
										numColumns={1} //每行显示1个
										ref={flatList => (this._flatList = flatList)}
										renderItem={this.gameList}
										enableEmptySections={true} //数据可以为空
										// onEndReachedThreshold={0.1} //执行上啦的时候10%执行
										// ListFooterComponent={this.renderFooter}//尾巴
										keyExtractor={(item, index) => (item.key = (index + ''))} //key需要為string格式
										// onRefresh={this.onRefresh}
										data={leagueList}
										extraData={leagueList}

										windowSize={6}
										removeClippedSubviews={Platform.OS === 'android'}
										maxToRenderPerBatch={10}
										updateCellsBatchingPeriod={50}
									/>
								}

							</View>
						)}
				{/* 投注板块 */}
				<Bottombetbox
					ref={this.ShowBottom}
					Vendor={this.props.Vendor}
					RemoveBetCart={this.RemoveBetCart}
				/>
				{/* 购物车浮窗 */}
				{/* {BetCartdata.length != 0 &&
				global.localStorage.getItem('loginStatus') == 1 && (
					<View style={{position: 'absolute', top: height * 0.3}}>
							<BetCartPopup
							ShowBottomSheet={(t) => this.ShowBottomSheet(t)}
							PlayBetCart={PlayBetCart}
							BetCartdata={BetCartdata}
						/>
					</View>
				)} */}
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	betCartInfo: state.betCartInfo,
});

const mapDispatchToProps = {
	betCart_setIsComboBet: ACTION_BetCart_setIsComboBet,
	betCart_add: ACTION_BetCart_add,
	betCart_remove: ACTION_BetCart_remove,
	betCart_clear: ACTION_BetCart_clear,
};

export default connect(mapStateToProps, mapDispatchToProps)(Betting);

/* 预防 大数据*/
export function GameDataCut(data, callback, pageSize = 10) {
	let totalCount = data.length;
	let GamePageNumber = 1;
	let totalPageNumer = Math.ceil(totalCount / pageSize);

	let handler = () => {
		let start = (GamePageNumber - 1) * pageSize;
		let end = GamePageNumber * pageSize;
		let currentData = data.slice(start, end);
		if (typeof callback === 'function') {
			callback(currentData, {
				totalCount,
				totalPageNumer,
				GamePageNumber,
				pageSize
			});
		}
		if (GamePageNumber < totalPageNumer) {
			window.requestAnimationFrame(handler);
		}
		GamePageNumber++;
	};
	handler();
}

const styles = StyleSheet.create({
	gameSeparator: {
		width: width,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		height: 40,
		paddingLeft: 12,
	},
	listBox: {
		backgroundColor: '#fff',
		borderRadius: 15,
		marginBottom: 15,
	},
	listData: {
		paddingBottom: 15,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},
});
