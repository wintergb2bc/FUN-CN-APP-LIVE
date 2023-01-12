import React from "react";
import SelectionData from './../../../containers/SbSports/lib/vendor/data/SelectionData';
// import { withBetterRouter } from '$LIB/utils/withBetterRouter';
// import Router from "next/router";
import reactUpdate from 'immutability-helper';
import Skeleton from './../../../containers/SbSports/game/Skeleton/Skeleton';
import Bottombetbox from './../../../containers/SbSports/game/Footer/bottombetbox';
import BetCartPopup from './../../../containers/SbSports/game/Betting/BetCartPopup';
//import MiniEvent from './../../../containers/SbSports/game/Betting/MiniEvent';
import OutRightEvent from './../../../containers/SbSports/game/Betting/Events/OutRightEvent';
import NormalEvent from './../../../containers/SbSports/game/Betting/Events/NormalEvent';
// import Image from '@/Image/Image';
import moment from "moment";
import { VendorConfigs } from './../../../containers/SbSports/lib/vendor/data/VendorConsts';
import HostConfig from './../../../containers/SbSports/lib/Host.config';
import { connect } from "react-redux";
// import { checkIsLogin, redirectToLogin } from "$LIB/utils/util";
import { EventChangeType, SpecialUpdateType } from "./../../../containers/SbSports/lib/vendor/data/VendorConsts";

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
const { width, height } = Dimensions.get("window");
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';

class GameList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//比賽數據
			EventDatas: null,
			OddsUpData: { Events: {}, Lines: {}, Selections: {} } /* 上升赔率 */,
			OddsDownData: { Events: {}, Lines: {}, Selections: {} } /* 下降赔率 */,
			isLoading: false,
			selectedDateIndex: 0, //橫日期選擇的tab

			//從詳情頁過來的 縮小的比分框
			showMiniEvent: false,
			miniEventId: null,
			miniSportId: 1,
			miniLeagueId: null,
			miniShowType: 0,

			//投注購物車相關
			PlayBetCart: false,
			BetCartdata: [],
			BetCartdataLength: 2 /* 串关最少2个 */,
		};

		this.ToggleFavourite = this.ToggleFavourite.bind(this);
		this.ToSportsDetails = this.ToSportsDetails.bind(this);
		this.clickOdds = this.clickOdds.bind(this);
		this.eventView = this.eventView.bind(this);
		this.imMaintenanceView = this.imMaintenanceView.bind(this);
		this.noDataView = this.noDataView.bind(this);


		this.weekDayMap = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '日' }; //用moment的isoWeekday去對  1 being Monday and 7 being Sunday.
		this.EC2021FirstDateMoment = moment(HostConfig.Config.EuroCup2021FirstEventTime).utcOffset(VendorConfigs.TIMEZONE); //第一場官方時間
		this.EC2021FinalDateMoment = moment(HostConfig.Config.EuroCup2021FinalEventTime).utcOffset(VendorConfigs.TIMEZONE); //最後一場官方時間
	}

	componentDidMount() {
		// const {query} = this.props.router; //從鏈接獲取要加載的參數

		//輪詢歐洲杯數據
		this.GetEUROCUPEvents();

		//處理縮小窗
		// if (JSON.stringify(query) !== '{}' || !query) {
		//   if (query.miniEventId) {
		//     this.setState({
		//       showMiniEvent: true,
		//       miniEventId: query.miniEventId,
		//       miniSportId: query.miniSportId,
		//       miniLeagueId: query.miniLeagueId,
		//       miniShowType: query.miniShowType,
		//     });
		//   }
		// }

		//投注購物車處理
		const { Vendor } = this.props;

		let IMBetCartdata = JSON.parse(localStorage.getItem('IMBetCartdata')) || [];
		let BTIBetCartdata = JSON.parse(localStorage.getItem('BTIBetCartdata')) || [];
		let BetCartdata = Vendor.configs.VendorName == 'IM' ? IMBetCartdata : BTIBetCartdata;
		/* 需要重新clone */
		const thisSelections = BetCartdata.map((item) => {
			return SelectionData.clone(item);
		});
		this.setState(
			{
				BetCartdata: thisSelections,
				PlayBetCart: localStorage.getItem('BetMore') || false
			},
			() => {
				localStorage.setItem('BetMore', false);
			}
		);
	}

	componentWillUnmount() {
		const { Vendor } = this.props;
		Vendor.deletePolling(this.eventPollingKey);
	}

	/* 获取游戏列表数据 */
	GetEUROCUPEvents() {
		const { Vendor } = this.props;
		//輪詢 比賽數據
		this.setState({
			isLoading: true,
		});
		this.eventPollingKey = Vendor.getEUROCUP202021EventsPollingGlobal('eventListing',
			(PollingResult) => {
				//console.log('===update Events', PollingResult);

				//處理 數據變化
				let OddsUpData = { Events: {}, Lines: {}, Selections: {} };
				let OddsDownData = { Events: {}, Lines: {}, Selections: {} };
				PollingResult.Changes.map((changeData) => {
					//類型：更新
					if (changeData.ChangeType === EventChangeType.Update) {
						changeData.SpecialUpdates.map((sUpdateData) => {
							const thisEventId = changeData.EventId; //比賽ID
							// 處理賠率上升動畫
							if (sUpdateData.UpdateType === SpecialUpdateType.OddsUp) {
								const thisLineId = sUpdateData.LineId; //投注線ID
								const thisSelectionId = sUpdateData.SelectionId; //投注選項ID
								const lineKey = thisEventId + '|||' + thisLineId;
								const selectionKey = thisEventId + '|||' + thisLineId + '|||' + thisSelectionId;
								OddsUpData.Events[thisEventId] = true;
								OddsUpData.Lines[lineKey] = true;
								OddsUpData.Selections[selectionKey] = true;
							}
							// 處理賠率下降動畫
							if (sUpdateData.UpdateType === SpecialUpdateType.OddsDown) {
								const thisLineId = sUpdateData.LineId; //投注線ID
								const thisSelectionId = sUpdateData.SelectionId; //投注選項ID
								const lineKey = thisEventId + '|||' + thisLineId;
								const selectionKey = thisEventId + '|||' + thisLineId + '|||' + thisSelectionId;
								OddsDownData.Events[thisEventId] = true;
								OddsDownData.Lines[lineKey] = true;
								OddsDownData.Selections[selectionKey] = true;
							}
						});
					}
				});

				//整理一次setState 避免多次刷新
				let newState = {
					isLoading: false,
					EC2021IsEnd: false,
					EventDatas: PollingResult.NewData,
					OddsUpData,
					OddsDownData,
				};

				//如果空數據 不展示切換按鈕
				if (newState.EventDatas && newState.EventDatas.length <= 0) {
					this.props.setDataIsEmpty(true);

					//確認是否歐洲杯已經結束
					let now = moment();
					if (now.diff(this.EC2021FinalDateMoment, 'hours') >= 3) { //當前時間超過最後一場比賽開賽3小時，而且沒數據
						newState.EC2021IsEnd = true;
					}
				} else {
					this.props.setDataIsEmpty(false);
				}

				this.setState(newState);
			},
		);
	};

	//切換關注比賽
	async ToggleFavourite(event) {
		const { Vendor } = this.props;
		if (!event.IsFavourite) {
			await Vendor.addFavouriteEvent(event);
		} else {
			await Vendor.removeFavouriteEvent(event.EventId);
		}
		//更新count
		const newCount = Vendor.getSports().then((PollingResult) => {
			this.setState({ SportDatas: PollingResult.NewData });
		});

		//更新賽事列表
		let targetIndex = -1;
		this.state.EventDatas.map((item, index) => {
			if (item.EventId === event.EventId) {
				targetIndex = index;
			}
		});
		if (targetIndex > -1) {
			let updates = {};
			updates[targetIndex] = { IsFavourite: { $set: !event.IsFavourite } };
			this.setState({ EventDatas: reactUpdate(this.state.EventDatas, updates) });
		}
	};

	//到詳情頁
	ToSportsDetails(Vendor, EventData) {
		const { SportId, EventId, LeagueId, IsOutRightEvent } = EventData;
		//加速開啟：列表的數據，存到緩存 拿來展示，等拿到詳情數據 再取代掉
		const cacheKey = SportId + '|||' + EventId;
		Vendor._cacheSet(cacheKey, JSON.stringify(EventData), 10);
		// const { SportId, EventId, LeagueId, IsOutRightEvent } = EventData;
		let dataList = {
			eid: EventId,
			sid: SportId,
			lid: LeagueId,
			OE: IsOutRightEvent,
			BetMore: this.state.PlayBetCart
		}
		console.log('OEOEOEOE', IsOutRightEvent)
		PiwikEvent('Odds', 'Submit', 'Odds_EUROPage')
		Actions.Betting_detail({ dataList, Vendor: this.props.Vendor, EuroCupBet: true })
		// Router.push(
		// 	`${Vendor.configs
		// 		.VendorPage}/detail?sid=${SportId}&eid=${EventId}&lid=${LeagueId}&OE=${IsOutRightEvent}&BetMore=${this
		// 			.state.PlayBetCart}`
		// );
	};

	//打開投注購物車
	ShowBottomSheet(type) {
		PiwikEvent('Engagement Event', 'View', `Open_BetCart_EUROPage`)
		this.ShowBottom.ShowBottomSheet(type);
	};

	/* 串关开状态 */
	PlayBetCartmore() {
		this.setState({
			PlayBetCart: true
		});
	};
	/* 串关关状态 */
	PlayCloseBetCartmore() {
		this.setState({
			PlayBetCart: false
		});
	};

	Preservationbet(BetCartdata) {
		if (this.props.Vendor.configs.VendorName == 'IM') {
			localStorage.setItem('IMBetCartdata', JSON.stringify(BetCartdata));
		}
		if (this.props.Vendor.configs.VendorName == 'BTI') {
			localStorage.setItem('BTIBetCartdata', JSON.stringify(BetCartdata));
		}
	};

	/* 存储单投和串关数据 */
	PushBetCart(data, type) {
		PiwikEvent('Engagement Event', 'View', `Odds_EUROPage​`)
		const { PlayBetCart } = this.state;
		/* 是否有同一组的盘口 */
		let indexOf = this.state.BetCartdata.findIndex((v) => {
			return v.EventId == data.EventId;
		});
		let MoreStatus = PlayBetCart && PlayBetCart != 'false';
		/* 如果同一个队伍存在相同盘口的ID，可以选择一个 */
		if (indexOf != '-1') {
			/* 删除旧的盘口 */
			const RemoveBetCartOld = this.state.BetCartdata.filter((item) => item.EventId != data.EventId);
			this.setState(
				{
					BetCartdata: RemoveBetCartOld
				},
				() => {
					/* 把新选择的盘口再放进去 */
					this.setState(
						{
							BetCartdata: [...this.state.BetCartdata, data]
						},
						() => {
							if (!MoreStatus) {
								this.ShowBottom.ShowBottomSheet(type);
							}
							this.Preservationbet(this.state.BetCartdata);
						}
					);
				}
			);
		} else {
			this.setState(
				{
					BetCartdata: [...this.state.BetCartdata, data]
				},
				() => {
					if (type == 1) {
						if (!MoreStatus) {
							this.ShowBottom.ShowBottomSheet(type);
						}
					}
					this.Preservationbet(this.state.BetCartdata);
				}
			);
		}
	};

	/* 删除数据 */
	RemoveBetCart(data, type, callback) {
		const BetCart = this.state.BetCartdata.filter((item) => item.EventId != data.EventId);
		/* 清除全部数据 */
		let RemoveAll = () => {
			this.setState({
				BetCartdata: [] /* 清空 */,
				BetCartdataLength: 2 /* 初始化 默认2 */,
				PlayBetCart: false
			});
			this.Preservationbet([]);
		};
		if (data == '') {
			RemoveAll();
		} else {
			this.setState(
				{
					BetCartdata: BetCart,
					BetCartdataLength: BetCart.length
				},
				() => {
					if (type == 2 || type == 3 || this.state.PlayBetCart == true) {
						this.ShowBottom.CheckBetting(BetCart);
						this.Preservationbet(BetCart);
					} else {
						BetCart.forEach((item) => {
							this.ShowBottom.CheckBetting(item);
						});
						this.Preservationbet(BetCart);
					}
				}
			);

			/* 盘口少于两个 关闭串关模式 */
			// if (RemoveBetCart.length < 2) {
			// 	this.setState({
			// 		PlayBetCart: false
			// 	});
			// }

			if (BetCart == '') {
				// if (!this.ShowBottom._refCheckBetting.current.state.PlayBettingStatus) {
				// 	this.ShowBottom.CloseBottomSheet();
				// }
				if (callback == undefined) {
					this.ShowBottom.CloseBottomSheet();
				}
				RemoveAll();
			}
		}
	};

	//點擊賠率=>投注
	clickOdds(selectionData) {
		// if (!checkIsLogin()) {
		// 	redirectToLogin();
		// 	return;
		// }
		if (!ApiPort.UserLogin) {
			Actions.Login()
			return
		}
		if (!selectionData) {
			return;
		}

		const { Vendor } = this.props;
		const { PlayBetCart, BetCartdata } = this.state;

		let MoreStatus = PlayBetCart && PlayBetCart != 'false';

		let overMaxSelectionCount = BetCartdata.length >= Vendor.configs.MaxParlay; //是否超過最大限制

		if (!MoreStatus) {
			this.PushBetCart(selectionData, 1);
		} else if (!overMaxSelectionCount) {
			let indexOf = BetCartdata.findIndex((v) => {
				return v.SelectionId == selectionData.SelectionId;
			});
			if (indexOf === -1) {
				this.PushBetCart(selectionData, 2);
				Toasts.success('添加成功');
			} else {
				this.RemoveBetCart(selectionData, 2, true);
			}
		} else if (overMaxSelectionCount) {
			Toasts.error('哎呀，最多可投注串关' + Vendor.configs.MaxParlay + '场呦');
		}
	};

	//檢查維護狀態
	checkMaintenanceStatus(name) {
		const { isBTI, isIM, isOW, noTokenBTI, noTokenIM, noTokenOW } = this.props.maintainStatus;
		const { isLogin } = this.props.userInfo; //有登入才額外判斷 token獲取狀態
		switch (name) {
			case 'bti':
				return isBTI || (isLogin && noTokenBTI);
			case 'im':
				return isIM || (isLogin && noTokenIM);
			case 'ow':
				return isOW || (isLogin && noTokenOW);
			default:
				return false;
		}
	};

	//賽事展示
	eventView(eventData) {
		const { Vendor, DisplayType } = this.props;
		const { PlayBetCart, BetCartdata, OddsUpData, OddsDownData } = this.state;

		return eventData.IsOutRightEvent ? (
			/* 猜冠军赛事 */
			<OutRightEvent
				key={eventData.EventId}
				Vendor={Vendor}
				EventData={eventData}
				ToggleFavourite={this.ToggleFavourite}
				ToSportsDetails={this.ToSportsDetails}
				ClickOdds={this.clickOdds}
				PlayBetCart={PlayBetCart}
				BetCartdata={BetCartdata}
			/>
		) : (
			/* 常规赛事 */
			<NormalEvent
				key={eventData.EventId}
				Vendor={Vendor}
				EventData={eventData}
				ToggleFavourite={this.ToggleFavourite}
				ToSportsDetails={this.ToSportsDetails}
				OddsUpData={OddsUpData}
				OddsDownData={OddsDownData}
				ClickOdds={this.clickOdds}
				PlayBetCart={PlayBetCart}
				BetCartdata={BetCartdata}
				DisplayType={DisplayType}
				EuroCup={true}
			/>
		);
	}

	//im維護
	imMaintenanceView(className) {
		return <View style={styles.noDataView1}>
			<Image source={require("../../../images/euroCup/tool.png")} style={{ height: 62, width: 62 }} />
			<Text style={{ color: '#666666', lineHeight: 30 }}>系统升级中</Text>
			<Text style={{ color: '#999999', }}>IM体育正在维护，请稍后回来。</Text>
		</View>
	}

	//無數據
	noDataView(className) {
		return <View style={[className ? styles.noDataView1 : styles.noDataView]}>
			<Image source={require("../../../images/euroCup/nodata.png")} style={{ height: 62, width: 62 }} />
			<Text style={{ color: '#666666', lineHeight: 30 }}>无数据</Text>
			<Text style={{ color: '#999999', fontSize: 12, }}>今日无欧洲杯赛事，请选择其他日期。</Text>
		</View>
	}

	render() {
		const { Vendor, DisplayType } = this.props;
		const { PlayBetCart, BetCartdata, EventDatas, isLoading, selectedDateIndex, EC2021IsEnd } = this.state;

		//按日期分組
		let groupByDateEventDatas = [];
		//選中的日期數據(橫式用)
		let selectedDateEventDatas = [];
		if (EventDatas !== null && EventDatas.length > 0) {
			const firstEvent = EventDatas[0];
			const firstEventMoment = firstEvent.getEventDateMoment();
			let firstDateMoment = this.EC2021FirstDateMoment; //第一場官方時間
			const todayMoment = moment(moment().format('YYYY-MM-DD'));
			if (firstDateMoment.diff(todayMoment, 'seconds') < 0) { //第一天比今天0點早，表示第一天已經過去了，以今天為主
				firstDateMoment = todayMoment;
			}
			if (firstEventMoment.diff(firstDateMoment, 'seconds') < 0) { //第一個比賽在今天之前，改用第一個比賽日期起算
				firstDateMoment = firstEventMoment;
			}
			const finalEvent = EventDatas[EventDatas.length - 1];
			const finalEventMoment = finalEvent.getEventDateMoment();

			let finalDateMoment = this.EC2021FinalDateMoment; //最後一場官方時間
			if (finalEventMoment.diff(finalDateMoment, 'seconds') > 0) { //最後一個比賽在 表定最後一天之後，改用最後一個比賽日期
				finalDateMoment = finalEventMoment;
			}

			//時間歸零到本地當天時間0點0分
			firstDateMoment = moment(firstDateMoment.format('YYYY-MM-DD'));
			finalDateMoment = moment(finalDateMoment.format('YYYY-MM-DD'));

			let dateList = [];
			let dateCount = finalDateMoment.diff(firstDateMoment, 'days'); //實際上要+1，因為最初和最終日期都包含，所以下面for迴圈用<=
			for (let cc = 0; cc <= dateCount; cc++) {
				dateList.push(firstDateMoment.clone().add(cc, 'days'));
			}

			//直列表數據
			groupByDateEventDatas = dateList.map(dd => {
				const thisDate = dd.format('YYYY-MM-DD')
				return {
					dateString: dd.format('M月DD ') + this.weekDayMap[dd.isoWeekday()],
					events: EventDatas.filter(ev => ev.EventDateLocal == thisDate)
				}
			})

			//for ended match will be removed, and when all matches in the date has ended, the whole date tab will be removed
			//今天比賽都結束了 tab不展示
			if (todayMoment.diff(firstDateMoment, 'days') === 0       //日期列表第一天是今天
				&& groupByDateEventDatas && groupByDateEventDatas.length > 0     //且列表有數據
				&& (!groupByDateEventDatas[0].events || groupByDateEventDatas[0].events.length <= 0)  //且列表的第一天沒比賽
			) {
				//把日期列表第一天移除
				groupByDateEventDatas = groupByDateEventDatas.filter((data, index) => index !== 0);
			}

			//橫日期數據
			selectedDateEventDatas = groupByDateEventDatas.filter((dateInfo, dateInfoIndex) => {
				return dateInfoIndex === selectedDateIndex;
			})

			//如果橫日期目前選擇的tab沒數據，改展示第一個
			if (
				(!selectedDateEventDatas || selectedDateEventDatas.length <= 0)
				&& (groupByDateEventDatas && groupByDateEventDatas.length > 0)
			) {
				selectedDateEventDatas = groupByDateEventDatas[0];
			}
		}

		const isIM_Maintenacne = this.checkMaintenanceStatus('im');
		//const isIM_Maintenacne = false;

		return <View>
			{
				<View>
					<View className={"Betting-list" + (this.props.noCountDown ? ' noCountDown' : '')} id="Betting-list">
						{isLoading
							?
							<Skeleton euroCup={true} />
							: (
								(EventDatas !== null && EventDatas.length <= 0)
									? //无数据
									<View style={styles.EmptyBox}>
										<Image source={require("../../../images/euroCup/nodata.png")} style={{ height: 62, width: 62 }} />
										<Text style={{ color: '#666666', lineHeight: 30 }}>无数据</Text>
										<Text style={{ color: '#999', fontSize: 12, }}>{EC2021IsEnd ? '欧洲杯赛事已结束，请继续关注更多其他赛事。' : '欧洲杯赛事尚未开启投注，敬请期待。'}</Text>
									</View>
									: //展示數據
									(DisplayType === 1)
										? //直列表
										(isIM_Maintenacne
											? this.imMaintenanceView("EmptyBox")
											: groupByDateEventDatas.map(dateInfo => {
												return <View key={dateInfo.dateString} style={{ backgroundColor: '#fff' }}>
													<View style={{ width: width, backgroundColor: '#EFEFF4', paddingLeft: 20 }}>
														<Text style={{ color: '#000', fontWeight: 'bold', lineHeight: 44 }}>{dateInfo.dateString}</Text>
													</View>
													{
														dateInfo.events && dateInfo.events.length > 0
															? dateInfo.events.map(eventData => this.eventView(eventData))
															: this.noDataView()
													}
												</View>
											})
										)
										: //橫日期
										<View>
											<ScrollView
												horizontal={true}
												style={styles.dateTabs}
												showsHorizontalScrollIndicator={false}
												showsVerticalScrollIndicator={false}
											>
												{ //日期tab
													groupByDateEventDatas.map((dateInfo, dateInfoIndex) => {
														return <TouchableOpacity
															style={[
																dateInfoIndex === selectedDateIndex ? styles.activedateTabs : styles.nodateTabs
															]}
															onPress={() => {
																if (this.state.selectedDateIndex !== dateInfoIndex) {
																	this.setState({ selectedDateIndex: dateInfoIndex })
																}
															}}
														>
															<Text
																key={dateInfo.dateString}
																style={{ color: dateInfoIndex === selectedDateIndex ? '#00A6FF' : '#666666', fontWeight: 'bold', lineHeight: 35, textAlign: 'center' }}
															>
																{dateInfo.dateString}
															</Text>
														</TouchableOpacity>
													})
												}
											</ScrollView>
											<View style={{ backgroundColor: '#fff' }}>
												{
													isIM_Maintenacne
														? this.imMaintenanceView("EmptyBox EmptyBox3")
														: selectedDateEventDatas && selectedDateEventDatas.length > 0
															? selectedDateEventDatas.map(dateInfo => {
																return dateInfo.events && dateInfo.events.length > 0
																	? dateInfo.events.map(eventData => this.eventView(eventData))
																	: this.noDataView("EmptyBox EmptyBox3")
															})
															: this.noDataView("EmptyBox EmptyBox3")
												}
											</View>
										</View>
							)
						}
						{/* 投注板块 */}
						{
							<Bottombetbox
								EuroCupBet={true}
								ref={(ref) => { this.ShowBottom = ref }}
								Vendor={Vendor}
								PlayBetCartmore={() => this.PlayBetCartmore()}
								RemoveBetCart={(e, type, c) => {
									this.RemoveBetCart(e, type, c);
								}}
								BetCartdata={BetCartdata}
								PlayCloseBetCartmore={() => {
									this.PlayCloseBetCartmore();
								}}
								showBetRecord={this.props.showBetRecord}
							/>
						}
						{/* 购物车浮窗 */}
						{
							BetCartdata.length != 0 &&
							ApiPort.UserLogin && (
								<View style={{ position: 'absolute', top: this.props.scrollTop + (height * 0.42), zIndex: 999 }}>
									<BetCartPopup
										ShowBottomSheet={(t) => this.ShowBottomSheet(t)}
										PlayBetCart={PlayBetCart}
										BetCartdata={BetCartdata}
									/>
								</View>
							)
						}
					</View>
					{/* 下方縮小比賽浮窗 */}
					{
						// this.state.showMiniEvent ? (
						//   <MiniEvent
						//     Vendor={Vendor}
						//     EventId={this.state.miniEventId}
						//     SportId={this.state.miniSportId}
						//     LeagueId={this.state.miniLeagueId}
						//     ShowType={this.state.miniShowType}
						//     CloseMini={() => {
						//       this.setState({ showMiniEvent: false, miniEventId: null, miniSportId: 1,miniLeagueId: null, miniShowType: 0 });

						//       //更新網址鏈接
						//       const { pathname, query } = this.props.router;
						//       let cloneQuery = Object.assign({}, query);
						//       //刪除mini配置
						//       delete cloneQuery['miniEventId'];
						//       delete cloneQuery['miniSportId'];
						//       delete cloneQuery['miniLeagueId'];
						//       delete cloneQuery['miniShowType'];
						//       const params = new URLSearchParams(cloneQuery);
						//       //用replace，避免用戶可以點擊back返回
						//       Router.replace(pathname + '?' + params.toString(), undefined, { shallow: true });
						//     }}
						//   />
						// ) : null
					}
				</View>
			}
		</View>;
	}
}

const styles = StyleSheet.create({
	EmptyBox: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: height * 0.35
	},
	noDataView: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#E6E6EB',
		paddingTop: 15,
		paddingBottom: 15
	},
	noDataView1: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#E6E6EB',
		height: height * 0.35
	},
	dateTabs: {
		borderBottomWidth: 2,
		borderBottomColor: '#E0E0E0',
	},
	activedateTabs: {
		borderBottomColor: '#00A6FF',
		borderBottomWidth: 3,
		width: width * 0.25,
	},
	nodateTabs: {
		borderBottomColor: 'transparent',
		borderBottomWidth: 3,
		width: width * 0.25,
	}
})

const mapStateToProps = state => ({
	userInfo: state.userInfo,
	maintainStatus: state.maintainStatus,
});

export default connect(
	mapStateToProps,
	null,
)(GameList)
