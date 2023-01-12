/*
	投注页面 详情内页  播放视频 动画 游戏数据
*/
import {
	StyleSheet,
	WebView,
	Text,
	StatusBar,
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
import Smartcoach from './Smartcoach'
import SkeletonBettingDetail from '../Skeleton/BettingDetail'
import { Flex, Toast, WingBlank, WhiteSpace, Tabs, Drawer } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
const { width, height } = Dimensions.get("window");
import React from "react";
// import Router from 'next/router';
// import dynamic from 'next/dynamic';
// import { DataConsumer } from '@/DataProvider/';
import SelectionBox from './BetGroup/SelectionBox';
// import Collapse, { Panel } from 'rc-collapse';
// import { ReactSVG } from '@/ReactSVG';
import DetailHeader from './Detail-Header';
import Bottombetbox from '../Footer/bottombetbox';
import BetCartPopup from '../Betting/BetCartPopup';
import Bottomsheet from '../Footer/bottomsheet';
// import Skeletondetail from '@/Skeleton/detail';
// import LazyImageForTeam from '@/LazyLoad/LazyImageForTeam';
// import LazyImageForLeague from '../../LazyLoad/LazyImageForLeague';
// import { forceCheck } from 'react-lazyload';
import SelectionData from '../../lib/vendor/data/SelectionData';
import moment from 'moment';
// import FullScreen from './FullScreen';
// import Drawer from '@/Drawer';
// import Keyboard from '@/Games/Footer/Keyboard';
import { EventChangeType, SpecialUpdateType, VendorMarkets } from '../../lib/vendor/data/VendorConsts';
// import { ChangeSvg } from '$LIB/js/util';
import EventData from "../../lib/vendor/data/EventData";
import CryptoJS from "crypto-js";
import { connect } from "react-redux";
import { ACTION_BetCart_setIsComboBet, ACTION_BetCart_add, ACTION_BetCart_remove, ACTION_BetCart_clear } from '$LIB/redux/actions/BetCartAction';
import ImageForLeague from "../RNImage/ImageForLeague";
import ImageForTeam from "../RNImage/ImageForTeam";

class BettingDetail extends React.Component {
	constructor() {
		super();
		this.state = {
			tabactive:1,
			winHeight: height,
			winWidth: width,
			detailWidth: width,
			detailHeight: height,
			isOpen: false,
			fixedLive: false,
			LineGroupId: null, //選中的玩法分組
			PinLines: [], //置頂的玩法
			showDrawer: false,
			EventDetail: '',
			eventDatas: '' /* 顶部导航赛事 */,
			OddsUpData: '' /* 上升赔率 */,
			OddsDownData: '' /* 下降赔率 */,
			scaleStatus: false,
			defaultShowType: 0,
			//showBet: false,
			isLandscape: false,
			LineGroupBarFreeze: false, //玩法分組條 是否固定在最上方
			LineToggleStatusArray: null, //玩法展開/收起的狀態
			headerWidth: width,
			headerHeight: width * 0.6,
			setIsLandscape: true,//横屏是否显示投注页
			infoTabIsEnabled: false, //情報tab可用
		};

		this.lineGroupMore = React.createRef();
		// this.lineGroupBarRef = React.createRef();
		// this.detailHeaderRef = React.createRef();
		// this.detailBannerRef = React.createRef();
		// this.linesContainerRef = React.createRef();
		this._onLayout = this._onLayout.bind(this)

		// 投注全屏窗口元素（全屏状态投注滑动窗口需要）
		this.bettingDrawer = React.createRef();
		this._refsShowBottom = React.createRef();

		this.contentOffsetY = 0; //常规赛事详情的scroll資料，用於判斷 玩法分組條 是否固定在最上方
	}
	componentWillMount() {
		window.removeOrientation && window.removeOrientation()
		this.setState({defaultShowType: this.props.defaultShowType? this.props.defaultShowType : 0})
		window.MiniEventShow && window.MiniEventShow(false,0,0,0,0)
		// setTimeout(() => {
		// 	window.openOrientation && window.openOrientation()
		// },2000)
	}
	componentDidMount() {
		const { eid, sid, lid, OE } = this.props.dataList;
		this.GetIMdatadetail(sid, eid, OE === true);
		this.getLiveEventsInSameLeague(eid, sid, lid);

		//處理捲動時，玩法分組 固定在上方
		// const handleScroll = (topOffset = 0) => {
		// 	if (this.lineGroupBarRef.current && this.linesContainerRef.current) {
		// 		const lgbcr = this.lineGroupBarRef.current.getBoundingClientRect(); //玩法組橫條
		// 		var lgbcr_height = lgbcr.height || (lgbcr.bottom - lgbcr.top); //相容ie
		// 		const lcbcr = this.linesContainerRef.current.getBoundingClientRect(); //玩法列表

		// 		//凍結的條件： 玩法列表的top 小於等於  天花板 +玩法組的height)
		// 		//注意豎屏  上面有聯賽名橫條(topOffset)
		// 		//另外需要考慮 點擊pin 視頻/動畫也凍結的情況
		// 		let fixedHeaderHieght = -1;
		// 		//橫屏不用考慮Pin
		// 		if (!this.state.isLandscape && this.state.fixedLive && this.detailBannerRef.current) {
		// 			const dhcr = this.detailBannerRef.current.getBoundingClientRect() //頭部 視頻/動畫
		// 			fixedHeaderHieght = (dhcr.height || (dhcr.bottom - dhcr.top)) - 1; //相容ie
		// 			//console.log('====fixedHeaderHieght2',fixedHeaderHieght);
		// 		}

		// 		let freeze = lcbcr.top <= lgbcr_height + topOffset + fixedHeaderHieght;
		// 		if (this.state.LineGroupBarFreeze) { //固定(fixed) 之後 玩法組高度不計
		// 			freeze = lcbcr.top <= topOffset + fixedHeaderHieght;
		// 		}
		// 		//console.log('====',freeze,lcbcr.top,'<=',lgbcr_height + topOffset+ fixedHeaderHieght,lgbcr_height,topOffset,fixedHeaderHieght);
		// 		if (this.state.LineGroupBarFreeze !== freeze) {
		// 			//減少觸發render次數
		// 			this.setState({ LineGroupBarFreeze: freeze });
		// 		}
		// 	} else {
		// 		//console.log('===lineGroupRef not FOUND');
		// 	}
		// };

		// let topOffset = 0;
		// if (this.detailHeaderRef.current) {
		// 	topOffset = this.detailHeaderRef.current.clientHeight;
		// }

		// this.handleWindowScrollForLineGroupBar = () => handleScroll(topOffset);
		// window.addEventListener('scroll', this.handleWindowScrollForLineGroupBar);

		//橫屏時，捲動目標改成betting_list_detail
		// const detail = document.getElementById('betting_list_detail');
		// if (detail) {
		// 	this.handleDetailDivScrollForLineGroupBar = () => handleScroll();
		// 	detail.addEventListener('scroll', this.handleDetailDivScrollForLineGroupBar);
		// }
	}

	componentWillUnmount() {
		window.openOrientation && window.openOrientation()
		this.props.Vendor.deletePolling(this.eventPollingKey);
		//處理捲動時，玩法分組 固定在上方
		// if (this.handleWindowScrollForLineGroupBar) {
		// 	window.removeEventListener('scroll', this.handleWindowScrollForLineGroupBar);
		// }
		//橫屏時，捲動目標改成betting_list_detail
		// const detail = document.getElementById('betting_list_detail');
		// if (detail && this.handleDetailDivScrollForLineGroupBar) {
		// 	detail.removeEventListener('scroll', this.handleDetailDivScrollForLineGroupBar);
		// }
	}

	/* 游戏详情数据 */
	GetIMdatadetail = (sid, eid, OE) => {
		//加快速度，從緩存中獲取初始展示數據
		const cacheKey = sid + '|||' + eid;
		const cachedEventDataJSON = this.props.Vendor._cacheGet(cacheKey, null);
		let cachedEventData = null;
		if (cachedEventDataJSON) {
			const tmpObj = JSON.parse(cachedEventDataJSON);
			cachedEventData = EventData.clone(tmpObj);
		}

		if (cachedEventData) {
			this.setState({ EventDetail: cachedEventData });
		}

		let that = this;
		//輪詢 單個比賽數據(在比賽詳情頁 使用) 返回輪詢key
		this.eventPollingKey = this.props.Vendor.getEventDetailPolling(
			(PollingResult) => {
				console.log('PollingResultPollingResultPollingResult', PollingResult)
				//處理 數據變化
				let OddsUpData = {Selections:{}};
				let OddsDownData = {Selections:{}};
				PollingResult.Changes.map((changeData) => {
					//類型：更新
					if (changeData.ChangeType === EventChangeType.Update) {
						changeData.SpecialUpdates.map((sUpdateData) => {
							const thisEventId = changeData.EventId; //比賽ID
							// 處理賠率上升動畫
							if (sUpdateData.UpdateType === SpecialUpdateType.OddsUp) {
								const thisLineId = sUpdateData.LineId; //投注線ID
								const thisSelectionId = sUpdateData.SelectionId; //投注選項ID
								const selectionKey = thisEventId + '|||' + thisLineId + '|||' + thisSelectionId;
								OddsUpData.Selections[selectionKey] = true;
							}
							// 處理賠率下降動畫
							if (sUpdateData.UpdateType === SpecialUpdateType.OddsDown) {
								const thisLineId = sUpdateData.LineId; //投注線ID
								const thisSelectionId = sUpdateData.SelectionId; //投注選項ID
								const selectionKey = thisEventId + '|||' + thisLineId + '|||' + thisSelectionId;
								OddsDownData.Selections[selectionKey] = true;
							}
						});
					}
				});

				//整理一次setState 避免多次刷新
				const newState = {
					EventDetail: PollingResult.NewData,
					OddsUpData,
					OddsDownData
				};

				this.setState(newState, () => {
					//deeplink 如果找不到賽事，返回列表頁
					if (this.state.EventDetail === null && this.props.from && this.props.from === 'deeplink' ) {
						setTimeout(() => {
							that.backToList();
						},2000); //2秒後跳轉
					}
				});
			},
			parseInt(sid),
			eid,
			OE
		); // <==查詢參數  足球 比賽ID
	};

	ShowBottomSheet = (type) => {
		if(this.props.EuroCupBet) {
			PiwikEvent('Betcart', 'Launch', 'Open_BetCart_EUROPage')
		} else {
			PiwikEvent('Betcart', 'Launch', 'MatchPage_Betcart')
		}
		this._refsShowBottom.current.ShowBottomSheet(type);
	};

	/* 存储单投数据 */
	PushBetCart = (data, type) => {
		const { VendorName } = this.props.Vendor.configs;
		this.props.betCart_add(data,VendorName)
		const isComboBet = this.props.betCartInfo['isComboBet' + VendorName];
		const betCartData = this.props.betCartInfo['betCart' + VendorName]

		if (!isComboBet) {
			this._refsShowBottom.current.ShowBottomSheet(type);
		}
	};

	/* 删除数据 */
	RemoveBetCart = async (data, type, callback) => {
		const { VendorName } = this.props.Vendor.configs;
		if (data === null) {
			//清空
			await this.props.betCart_clear(VendorName);
			await this.props.betCart_setIsComboBet(false, VendorName);
		} else {
			//刪除單個
			await this.props.betCart_remove(data, VendorName);
		}

		const betCartData = this.props.betCartInfo['betCart' + VendorName]
		// 如果刪除後購物車為空，自動關閉購物車
		if (!betCartData || betCartData.length <= 0) {
			await this.props.betCart_setIsComboBet(false, VendorName);
			this._refsShowBottom.current.CloseBottomSheet();
		}
	};

	//點擊賠率=>投注
	clickOdds = (selectionData) => {
		if (!global.localStorage.getItem('loginStatus') == 1) {
			this.state.isLandscape && window.openOrientation && window.openOrientation()
			setTimeout(() => {
				Actions.Login({from: "sb"});
			}, this.state.isLandscape? 2000: 200);
			return;
		}
		if(window.GetSelfExclusionRestriction('DisableBetting')) {
			return
		}

		if (!selectionData) {
			return;
		}

		if (!selectionData.DisplayOdds || selectionData.DisplayOdds == 0) return;

		PiwikEvent('Odds', 'Submit', 'Odds_matchpage')

		const { Vendor } = this.props;
		const isComboBet = this.props.betCartInfo['isComboBet' + Vendor.configs.VendorName];
		const betCartData = this.props.betCartInfo['betCart' + Vendor.configs.VendorName];

		let overMaxSelectionCount = betCartData.length >= Vendor.configs.MaxParlay; //是否超過最大限制

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
					Toast.success('添加成功');
				} else {
					this.RemoveBetCart(selectionData);
				}
			} else {
				Toast.fail('哎呀，最多可投注串关' + Vendor.configs.MaxParlay + '场呦');
			}
		}
	};

	getLiveEventsInSameLeague(eid, sid, lid) {
		//參數 體育id(SportId) , 聯賽id(LeagueId) , 賽事id(EventId)
		this.props.Vendor.getLiveEventsInSameLeague(sid, lid, eid).then((eventDatas) => {
			this.setState({
				eventDatas: eventDatas
			});
		});
	}

	//投注線再分組，把類似的玩法合在一堆，返回是數組格式(適配IM同玩法會分成多線的狀況)
	getSimilarGroupedLines(LinesArray) {
		let SimilarGroupedLines = [];
		//給的投注線是已經排序過了，所以直接按順序往下找就可以
		let previousLine = null;
		let tmpLineGroup = [];
		LinesArray.map((l, index) => {
			if (previousLine) {
				if (previousLine.isSimilarTo(l)) {
					tmpLineGroup.push(l); //和前一個投注線類似 放一起
				} else {
					//不相同，保留現在的分組
					SimilarGroupedLines.push(tmpLineGroup);
					//產生一個新的分組
					tmpLineGroup = [];
					tmpLineGroup.push(l);
				}
			} else {
				//第一個執行 還沒有previousLine，直接加入分組
				tmpLineGroup.push(l);
			}

			//最後一筆 保留現在的分組
			if (index === LinesArray.length - 1) {
				SimilarGroupedLines.push(tmpLineGroup);
			} else {
				previousLine = l;
			}
		});
		return SimilarGroupedLines;
	}

	//切換玩法置頂
	togglePinLine(key) {
		let tmp = this.state.PinLines.slice();
		if (this.state.PinLines.indexOf(key) === -1) {
			//加入置頂
			tmp.push(key);
		} else {
			//移除置頂
			tmp = this.state.PinLines.filter((k) => k !== key);
		}
		this.setState({ PinLines: tmp });
	}

	//返回列表頁
	backToList = () => {
		const { Vendor, from } = this.props;
		console.log('===backToList called',from);
		//處理deeplink返回按鈕
		if (from && from === 'deeplink' && Vendor) {
			//返回同vendor的列表頁
			const sbTypeMapping = { IM: 'IPSB', SABA: 'OWS', BTI: 'SBT' } ;
			const sbType = sbTypeMapping[Vendor.configs.VendorName];
			if (sbType) {
				console.log('===backToList sbType',sbType);
				Actions.replace('SbSports', {	sbType	}); //用replace避免又被pop回去
				return;
			}
		}
		console.log('===backToList pop()');
		//沒有特別指定就使用默認方式(pop)
		Actions.pop();
	}
	_onLayout(event) {
		const { winHeight, winWidth } = this.state;
		let { width, height } = event.nativeEvent.layout;
		console.log(winHeight, 'winHeightwinHeightwinHeight', height)
		if (height > width) {
			//竖屏
			this.setState({
				headerHeight: winWidth * 0.6,
				headerWidth: winWidth,
				isLandscape: false,
				setIsLandscape: true,
				detailWidth: winWidth,
				detailHeight: winHeight,
			})
			console.log('this.props.headerWidth1', height)
		} else if (height < width) {
			//横屏
			let winWidths = Dimensions.get("window").height;
			let winHeights = Dimensions.get("window").width;
			this.setState({
				headerHeight: Platform.OS == "android" ? winWidths: winWidths,
				headerWidth: winHeights,
				isLandscape: true,
				tabactive: 1,
				setIsLandscape: false,
				detailWidth: winHeights * 0.4,
				detailHeight: winWidths,
				fixedLive: false,
			})
			console.log('this.props.headerWidth2', winHeights)
		}
	}
	backToListWithMinifyWindow(showMiniEvent, miniShowType) {
			//切换缩小
			const {eid, sid, lid} = this.props.dataList;
			if (this.props.EuroCupBet) {
				window.MiniEventShowEuroCup && window.MiniEventShowEuroCup(showMiniEvent, eid, sid, lid, miniShowType)
			} else {
				window.MiniEventShow && window.MiniEventShow(showMiniEvent, eid, sid, lid, miniShowType)
			}

			Actions.pop()
	}
	/**
	 * @description: 切換情報tab狀態，並打印运行日志 监控无法执行原因 线上正常执行log
	 * @param log 信息，有log表示smartcoach有錯誤
	 * @param hasNamiAnalysis 是否有nami分析數據
	 * @return {*} 控制台信息
	 */
	setInfoTabStatus = (log, hasNamiAnalysis = false) => {
		const smartCoachOK = (log === false);
		const infoTabIsEnabled = smartCoachOK || hasNamiAnalysis; //其中一個有數據，就可以

		let newState = {
			infoTabIsEnabled,
		};

		// //增加tab=sc參數支持即時切換
		// if (infoTabIsEnabled && Router.query && Router.query.tab == 'sc') {
		// 	newState.Tabactive = '1';
		// }

		this.setState(newState);

		if (!smartCoachOK) {
			window.console.log('%c情报日志報錯======>', 'color:red;', log);
		}
	};

	clickLineGroup = (LineGroupId = null) => {
		this.setState({ LineGroupId });
		if (LineGroupId !== null) {
			PiwikEvent('Odds_Filter', 'Click', 'Matchpage_Odds')
		}
	}

	clickLineGroupMore = () => {
		this.lineGroupMore.current.show();
		PiwikEvent('Odds_Filter', 'Click', 'Matchpage_Odds')
	}

	//決定要不要把LineGroupBar設定為凍結
	checkIfFreezeLineGroupBar = (isSmartCoachEnabled) => {
		if (!this.state.isLandscape && this.state.fixedLive) { //豎屏 且 header凍結 才要考慮這個問題
			let offsetY = this.contentOffsetY;
			let offsetH = 0;
			if (isSmartCoachEnabled) {
				offsetH = 40; //有smartcoach => 會多出tab高度
			}
			if (offsetY > offsetH && !this.state.LineGroupBarFreeze) {
				this.setState({LineGroupBarFreeze: true})
			}
			if (offsetY <= offsetH && this.state.LineGroupBarFreeze) {
				this.setState({LineGroupBarFreeze: false})
			}
		}
	}

	//展示分享彈窗
	showSharePopup = () => {
		const { Vendor } = this.props;
		const { EventDetail } = this.state;
		const venodrNameMap = {'IM':'IM', 'SABA':'OW', 'BTI':'BTI'};
		const thisEventId =  venodrNameMap[Vendor.configs.VendorName] + '_' + (EventDetail ? EventDetail.EventId : 'MatchID');
		PiwikEvent('Navigation','Click','Share_' + thisEventId);
		Actions.SbShare({Vendor, EventDetail});
	}

	render() {
		const {
			tabactive,
			setIsLandscape,
			detailWidth,
			detailHeight,
			isLandscape,
			headerHeight,
			headerWidth,
			LineGroupId,
			PinLines,
			EventDetail,
			OddsUpData,
			OddsDownData,
			showDrawer,
			eventDatas,
			LineToggleStatusArray,
		} = this.state;
		const { Vendor } = this.props;
		const isComboBet = this.props.betCartInfo['isComboBet' + Vendor.configs.VendorName];
		const betCartData = this.props.betCartInfo['betCart' + Vendor.configs.VendorName];
		const { LineGroups, Lines } = EventDetail ? EventDetail : {};
		console.log('%c游戏详情', 'font-size:36px;color:red;', EventDetail);

		const isSmartCoachEnabled = (this.props.Vendor.configs.VendorName == 'IM'); //只有im使用smartcoach

		//處理玩法分組
		let selectedLineGroup = null;
		let sortedLineGroups = [];
		if (LineGroups && LineGroups.length > 0) {
			const selectedLineGroups = LineGroups.filter((lg) => lg.LineGroupId === LineGroupId);
			if (selectedLineGroups && selectedLineGroups.length > 0) {
				selectedLineGroup = selectedLineGroups[0];
			}
			//把選中的玩法分組移到第一個
			sortedLineGroups = LineGroups;
			if (selectedLineGroup) {
				const selectedItems = LineGroups.filter((i) => i.LineGroupId === selectedLineGroup.LineGroupId);
				const withoutSelectedItems = LineGroups.filter((i) => i.LineGroupId !== selectedLineGroup.LineGroupId);
				sortedLineGroups = selectedItems.concat(withoutSelectedItems);
			}
		}

		//處理玩法過濾 和 玩法整合
		let groupedLines = this.getSimilarGroupedLines(
			//同類的投注線放在一個數組裡
			EventDetail
				? selectedLineGroup
					? Lines.filter(
						//玩法過濾，只展示選中的玩法分組
						(item) =>
							item.LineGroupIds &&
							item.LineGroupIds.length > 0 &&
							item.LineGroupIds.indexOf(LineGroupId) !== -1
					)
					: Lines
				: []
		);

		//處理玩法展開收起
		let closedLineKeyArray = []; //收起的玩法key
		if (LineToggleStatusArray && LineToggleStatusArray.length > 0) {
			LineToggleStatusArray.map(info => {
				if (!info.isOpen) {
					closedLineKeyArray.push(info.key);
				}
			})
		}

		//console.log('===closedLineKeyArray',closedLineKeyArray);

		const allLineKeyArray = []; //全部的玩法Key
		let openLineKeyArray = []; //展開的玩法key
		groupedLines.map((lineArray) => {
			const firstLine = lineArray[0];
			const thisKey = firstLine.getKeyForCompare();
			allLineKeyArray.push(thisKey);
			if (closedLineKeyArray.indexOf(thisKey) === -1) {
				openLineKeyArray.push(thisKey); //默認展開
			}
		});

		//console.log('===openLineKeyArray',openLineKeyArray);

		//配置在key={} 用來觸發刷新
		// const openLineKeyArrayJSON = CryptoJS.MD5(JSON.stringify(openLineKeyArray));

		//把選中的置頂玩法移到第一個
		let sortedGroupedLines = groupedLines;
		if (PinLines && PinLines.length > 0) {
			//選中的
			const selectedGroupedLines = groupedLines.filter((lineArray) => {
				const firstLine = lineArray[0];
				const thisKey = firstLine.getKeyForCompare(); //玩法合併用的key
				return PinLines.indexOf(thisKey) !== -1;
			});
			//沒選中的
			const withoutSelectedGroupedLines = groupedLines.filter((lineArray) => {
				const firstLine = lineArray[0];
				const thisKey = firstLine.getKeyForCompare(); //玩法合併用的key
				return PinLines.indexOf(thisKey) === -1;
			});
			//接起來
			sortedGroupedLines = selectedGroupedLines.concat(withoutSelectedGroupedLines);
		}

		//處理豎屏凍結
		//(注意stickyHeaderIndices即使設定多個，也只有最後一個會保留住，之前的會被往上推，所以如果有兩個以上的View要同時凍結，就要想辦法包在同一個容器)
		let stickyHeaderIndicesForPortrait = []; //豎屏凍結
		let LineGroupBarWrapInHeader = false; //LineGroupBar要不要包在header內
		if(!isLandscape) { //豎屏
			if (this.state.fixedLive) { //header有凍結
				stickyHeaderIndicesForPortrait = [0];
				if (this.state.LineGroupBarFreeze) { //如果LineGroupBar也凍結，就包在一起
					LineGroupBarWrapInHeader = true;
				}
			} else { //header沒凍結，就單獨凍住LineGroupBar
				if (isSmartCoachEnabled) { //有smartcoach 中間會多一個tab和 smartcoash的view
					stickyHeaderIndicesForPortrait = [3];
				} else {
					stickyHeaderIndicesForPortrait = [1];
				}
			}
		}

		let width = detailWidth;

		return (
			<View
				onLayout={this._onLayout}
				// setHandle={(v) => {
				// 	this.handle = v;
				// }}
				// setStatus={(v) => {
				// 	this.setState({ scaleStatus: v });
				// }}
				// Vendor={this.props.Vendor}
				style={{ flex: 1, backgroundColor: '#fff' }}
			>
				{
					isLandscape && Platform.OS == "android" &&
					<StatusBar
						backgroundColor="#ff0000"
						translucent={true}
						hidden={true}
						animated={true}
					/>
				}
				<View
					id="betting_list_detail"
					// className={`Betting-list-detail ${this.props.className}`}
					ref={this.bettingDrawer}
				>
					{/* 頭部賽事點擊->下拉菜單 */}
					{eventDatas != '' &&
						eventDatas.length > 0 && (
							<View />
							// <Drawer
							// 	direction="top"
							// 	wrapDom={this.bettingDrawer}
							// 	onClose={() => {
							// 		this.setState({
							// 			showDrawer: false
							// 		});
							// 	}}
							// 	className="fullscreen-drawer detail-header-drawer"
							// 	visible={showDrawer}
							// >
							// 	<div className="detail-header-drawer-contents">
							// 		<div className="drawer-header">
							// 			<div className="drawer-header-title">
							// 				{/* {eventDatas[0].LeagueName} <ReactSVG className="back-icon" src="/svg/dow.svg" /> */}
							// 			</div>
							// 		</div>
							// 		{eventDatas.map((item, index) => {
							// 			return (
							// 				<div
							// 					className="con"
							// 					key={index}
							// 					onClick={() => {
							// 						const { Vendor } = this.props;
							// 						//用replace避免返回按鈕失效(預期應該返回列表)
							// 						this.setState(
							// 							{
							// 								showDrawer: false
							// 							},
							// 							() => {
							// 								const URL = Vendor.configs.VendorPage;
							// 								const newUrl = `${URL}/detail?sid=${item.SportId}&eid=${item.EventId}&lid=${item.LeagueId}&OE=${item.IsOutRightEvent}`;
							// 								Router.replace(newUrl);
							// 								//因為是同頁切換，所以不會刷新 也不會觸發didmount，直接複製didmount的處理函數更新數據
							// 								this.GetIMdatadetail(
							// 									item.SportId,
							// 									item.EventId,
							// 									item.IsOutRightEvent
							// 								);
							// 								this.getLiveEventsInSameLeague(
							// 									item.EventId,
							// 									item.SportId,
							// 									item.LeagueId
							// 								);
							// 							}
							// 						);
							// 					}}
							// 				>
							// 					<ul key={index} className={index == 0 ? 'active' : ''}>
							// 						<li className="name">
							// 							{/* <LazyImageForTeam Vendor={Vendor} TeamId={item.HomeTeamId} /> */}
							// 							<p>{item.HomeTeamName}</p>
							// 						</li>
							// 						<li className="center">
							// 							<p>
							// 								<b className={item.HomeScore == 0 ? 'color' : ''}>
							// 									{item.HomeScore}
							// 								</b>
							// 							&nbsp;-&nbsp;
							// 							<b className={item.AwayScore == 0 ? 'color' : ''}>
							// 									{item.AwayScore}
							// 								</b>
							// 							</p>
							// 							<span>{item.RBMinute}'</span>
							// 						</li>
							// 						<li className="name">
							// 							{/* <LazyImageForTeam Vendor={Vendor} TeamId={item.AwayTeamId} /> */}
							// 							<p>{item.AwayTeamName}</p>
							// 						</li>
							// 					</ul>
							// 				</div>
							// 			);
							// 		})}
							// 	</div>
							// </Drawer>
						)}
					{/* 橫屏的投注購物車 */}
					{
						// 	<Drawer
						// 	direction="right"
						// 	wrapDom={this.bettingDrawer}
						// 	onClose={() => {
						// 		this.setState({ showBet: false });
						// 	}}
						// 	className="fullscreen-drawer detail-minibet-drawer"
						// 	visible={this.state.showBet}
						// >
						// 	{this.state.showBet && (
						// 		<Keyboard
						// 			Vendor={this.props.Vendor}
						// 			/* 购物车 */
						// 			Betdata={BetCartdata}
						// 			URL={this.props.Vendor.configs.VendorName == 'BTI' ? '/sports-bti' : '/sports-im'}
						// 			/* 是否横屏 */
						// 			Minishow={true}
						// 			/* 串关类型 */
						// 			BetType={1}
						// 			/* 购物车删除 */
						// 			RemoveBetCart={(e, t, c) => {
						// 				this.RemoveBetCart(e, t, c);
						// 			}}
						// 			ref="CheckBetting"
						// 			/* 是否是详情页 */
						// 			DetailPage={true}
						// 			/* 关闭投注框 */
						// 			CloseBottomSheet={() => {
						// 				this.setState({ showBet: false });
						// 			}}
						// 			/* 关闭横屏投注 */
						// 			onClose={() => {
						// 				this.setState({ showBet: false });
						// 			}}
						// 			/* 关闭串关 */
						// 			PlayCloseBetCartmore={() => {
						// 				this.PlayCloseBetCartmore();
						// 			}}
						// 			/* 串关模式 */
						// 			BetCartmore={() => this.PlayBetCartmore()}
						// 		/>
						// 	)}
						// </Drawer>
					}
					{/* 頭部賽事橫條 */}
					{
						setIsLandscape &&
						<View style={isLandscape ? [styles.navRight,{right: DeviceInfoIos?8:0}] : {}}>
							<View style={[styles.topNav, { width: width, }]}>
								{
									!isLandscape &&
									<Touch onPress={this.backToList}>
										<Image resizeMode='stretch' source={require('../../images/icon-white.png')} style={{ width: 25, height: 25 }} />
									</Touch>
								}

								<View style={[styles.headerTitle, isLandscape ? {width: width} : {}]}>
									{eventDatas && eventDatas.length > 1 ? (
										<Touch
											onPress={() => {
												this.setState(
													{
														showDrawer: !this.state.showDrawer
													},
													() => {
														// setTimeout(forceCheck, 500); //lazyload強制觸發
													}
												);
											}}
											style={styles.headerTitle}
										>
											{/* <LazyImageForLeague
									Vendor={Vendor}
									LeagueId={eventDatas[0].LeagueId}
									thisClassName="Game-logo"
								/> */}
											<ImageForLeague LeagueId={eventDatas[0].LeagueId} Vendor={Vendor} />
											<Text style={[styles.headerTitleTxt, { maxWidth: width * 0.7 }]} numberOfLines={1}>
												{eventDatas[0].LeagueName}
											</Text>
											<Image resizeMode='stretch' source={this.state.showDrawer ? require('../../images/ups.png') : require('../../images/dow.png')} style={{ width: 25, height: 25 }} />

											{/* <ReactSVG
									className="down-arrow"
									src={this.state.showDrawer ? '/svg/up.svg' : '/svg/dow.svg'}
								/> */}
										</Touch>
									) : (
										EventDetail != '' && EventDetail != null && (
											<View style={styles.headerTitle}>
												{/* <LazyImageForLeague
										Vendor={Vendor}
										LeagueId={EventDetail.LeagueId}
										thisClassName="Game-logo"
									/> */}
												<ImageForLeague LeagueId={EventDetail.LeagueId} Vendor={Vendor} />
												<Text style={[styles.headerTitleTxt, { maxWidth: width * 0.7 }]} numberOfLines={1}>{EventDetail.LeagueName}</Text>
											</View>
										)
									)}
								</View>
								{ //猜冠軍不能分享
									(!isLandscape && EventDetail != '' && EventDetail != null && !EventDetail.IsOutRightEvent) ?
									<Touch onPress={this.showSharePopup}>
										<Image resizeMode='stretch' source={require('../../images/sbshare/share.png')} style={{ width: 24, height: 24 }} />
									</Touch> : null
								}
							</View>
						</View>
					}

					<Modal
						animationType="none"
						transparent={true}
						visible={this.state.showDrawer}
						onRequestClose={() => { }}
						supportedOrientations={['portrait', 'landscape']}
					>
						<View style={isLandscape ? [styles.headerDrawerRight,{right: DeviceInfoIos?8:0}] : styles.headerDrawer}>
							<Touch onPress={() => { this.setState({ showDrawer: false }) }} style={{ height: 50, width: width, marginTop: DeviceInfoIos && !isLandscape ? 40 : 0 }}></Touch>
							<View style={[styles.headerDrawerView, { width: width, height: height / 2, }]}>
								<ScrollView
									showsHorizontalScrollIndicator={false}
									showsVerticalScrollIndicator={false}
								>
									{
										eventDatas != '' &&
										eventDatas.length > 0 &&
										eventDatas.map((item, index) => {
											return (
												<Touch onPress={() => {
													const { Vendor } = this.props;
													//用replace避免返回按鈕失效(預期應該返回列表)
													this.setState(
														{
															showDrawer: false
														},
														() => {
															const URL = Vendor.configs.VendorPage;
															// const newUrl = `${URL}/detail?sid=${item.SportId}&eid=${item.EventId}&lid=${item.LeagueId}&OE=${item.IsOutRightEvent}`;
															// Router.replace(newUrl);
															//因為是同頁切換，所以不會刷新 也不會觸發didmount，直接複製didmount的處理函數更新數據
															this.GetIMdatadetail(
																item.SportId,
																item.EventId,
																item.IsOutRightEvent
															);
															this.getLiveEventsInSameLeague(
																item.EventId,
																item.SportId,
																item.LeagueId
															);
															PiwikEvent('Match', 'Launch', 'MatchPage_ViewMore')
														}
													);
												}} key={index} style={[index == 0 ? [styles.drawerActive, { width: width - 40, }] : [styles.nodrawerActive, { width: width - 40, }]]}>
													<View style={[styles.itemTimes, { width: width * 0.3 }]}>
														{/* <LazyImageForTeam Vendor={Vendor} TeamId={item.HomeTeamId} /> */}
														<ImageForTeam TeamId={item.HomeTeamId} Vendor={Vendor} IconUrl={item.HomeIconUrl} />
														<Text style={{ color: index == 0 ? '#000' : '#fff', width: width * 0.3, textAlign: 'center' }} numberOfLines={1}>{item.HomeTeamName}</Text>
													</View>
													<View>
														<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
															<Text style={{ color: item.HomeScore == 0 ? '#7f7f7f' : '#000', fontSize: 20, fontWeight: 'bold' }}>{item.HomeScore}</Text>
															<Text>—</Text>
															<Text style={{ color: item.AwayScore == 0 ? '#7f7f7f' : '#000', fontSize: 20, fontWeight: 'bold' }}>{item.AwayScore}</Text>
														</View>
														<View style={styles.dateFen}>
															<Text style={{ color: '#fff', fontSize: 12 }}> {item.RBMinute}' </Text>
														</View>
													</View>
													<View style={[styles.itemTimes, { width: width * 0.3 }]}>
														{/* <LazyImageForTeam Vendor={Vendor} TeamId={item.AwayTeamId} /> */}
														<ImageForTeam TeamId={item.AwayTeamId} Vendor={Vendor} IconUrl={item.AwayIconUrl} />
														<Text style={{ color: index == 0 ? '#000' : '#fff', width: width * 0.3, textAlign: 'center' }} numberOfLines={1}>{item.AwayTeamName}</Text>
													</View>
												</Touch>
											)
										})
									}
								</ScrollView>
							</View>
							<Touch onPress={() => { this.setState({ showDrawer: false }) }} style={{ height: height, width: width, backgroundColor: "rgba(0, 0, 0,0.5)" }}></Touch>
						</View>
					</Modal>

					{
						// 	<View
						// 	className={'Betting-detail-header' + (EventDetail === null ? ' noEventDataLandscape' : '')}
						// 	ref={this.detailHeaderRef}
						// >
						// 	{/* <ReactSVG
						// 		className="back-icon"
						// 		src="/svg/LeftArrow.svg"
						// 		onClick={() => {
						// 			this.backToList();
						// 			if (BetMore) {
						// 				localStorage.setItem('BetMore', true);
						// 			} else {
						// 				localStorage.setItem('BetMore', false);
						// 			}
						// 		}}
						// 	/> */}
						// 	{eventDatas && eventDatas.length > 1 ? (
						// 		<Touch
						// 			onClick={() => {
						// 				this.setState(
						// 					{
						// 						showDrawer: !this.state.showDrawer
						// 					},
						// 					() => {
						// 						// setTimeout(forceCheck, 500); //lazyload強制觸發
						// 					}
						// 				);
						// 			}}
						// 		>
						// 			{/* <LazyImageForLeague
						// 				Vendor={Vendor}
						// 				LeagueId={eventDatas[0].LeagueId}
						// 				thisClassName="Game-logo"
						// 			/> */}
						// 			<Text>{eventDatas[0].LeagueName}</Text>
						// 			{/* <ReactSVG
						// 				className="down-arrow"
						// 				src={this.state.showDrawer ? '/svg/up.svg' : '/svg/dow.svg'}
						// 			/> */}
						// 		</Touch>
						// 	) : (
						// 			EventDetail != '' && (
						// 				<View>
						// 					{/* <LazyImageForLeague
						// 						Vendor={Vendor}
						// 						LeagueId={EventDetail.LeagueId}
						// 						thisClassName="Game-logo"
						// 					/> */}
						// 					<Text>{EventDetail.LeagueName}</Text>
						// 				</View>
						// 			)
						// 		)}
						// </View>
					}
					{EventDetail != '' && EventDetail != null ? EventDetail.IsOutRightEvent ? (
						/* 猜冠军详情 */
						<View className="Betting-list" style={{ backgroundColor: 'white', padding: 10 }}>
							<ScrollView
								showsHorizontalScrollIndicator={false}
								showsVerticalScrollIndicator={false}
							>
								<View style={{ paddingBottom: 120 }}>
									<Text style={{ color: '#000', fontSize: 12 }}>{EventDetail.getEventDateMoment().format('MM/DD HH:mm')}</Text>
									<Text style={{ color: '#999', fontSize: 16, lineHeight: 45 }}>{EventDetail.OutRightEventName}</Text>
									{Lines && Lines[0] ? (
										Lines[0].Selections.map((d, k) => {
											let CheckSelect =
												isComboBet == true
													? betCartData.filter((i) => i.SelectionId == d.SelectionId)
													: [];
											return (
												<View style={styles.OddsList} key={k}>
													<View style={styles.oddTeam}>
														{/* <LazyImageForTeam Vendor={Vendor} LeagueId={d.TargetTeamId} /> */}
														<Image resizeMode='stretch' source={require('../../images/betting/fun88.png')} style={{ width: 25, height: 25 }} />
														<Text style={{ color: '#000', width: width * 0.5, paddingLeft: 8 }}>{d.SelectionName}</Text>
													</View>
													{d.Odds ? (
														<Touch
															style={CheckSelect != '' ? [styles.OddsActive, { width: width * 0.35 }] : [styles.noOddsActive, { width: width * 0.35 }]}
															// className={CheckSelect != '' ? 'Team Right active' : 'Team Right'}
															onPress={() => {
																this.clickOdds(d);
															}}
														>
															{/* <span
														dangerouslySetInnerHTML={{
															__html: ChangeSvg(d.DisplayOdds)
														}}
														className="NumberBet"
													/> */}
															<Text style={{ color: '#000', lineHeight: 35, textAlign: 'center' }}>{d.DisplayOdds}</Text>
														</Touch>
													) : (
															<View>
																<Text className="gray Team Right">-</Text>
															</View>
														)}
												</View>
											);
										})
									) : null}
								</View>
							</ScrollView>
						</View>
					) : (
							/* 常规赛事详情 */
							// <View className={`Betting-detail-content ${this.state.fixedLive.toString()}`}>
							<ScrollView
								showsHorizontalScrollIndicator={false}
								showsVerticalScrollIndicator={false}
								stickyHeaderIndices={stickyHeaderIndicesForPortrait}
								onScroll={(e) => {
									//console.log('===onScroll', e.nativeEvent.contentOffset);
									//決定要不要把LineGroupBar設定為凍結
									this.contentOffsetY = e.nativeEvent.contentOffset.y; //保存當前值，判斷會用到
									this.checkIfFreezeLineGroupBar(isSmartCoachEnabled);
								}}
							>
								{
									isLandscape &&
									<View style={{ height: headerHeight, width: headerWidth }} />
								}
								<View style={[
									isLandscape ? { height: headerHeight, width: headerWidth, position: 'absolute', top: 0, left: 0, zIndex: 9 }
										: { height: headerHeight, width: headerWidth },
									!isLandscape && LineGroupBarWrapInHeader ? {height: headerHeight + 43} : {}
									]}
								>
									<DetailHeader
										defaultShowType={this.state.defaultShowType}
										setDefaultShowType={(defaultShowType) => {
											this.setState({defaultShowType})
										}}
										backToListWithMinifyWindow={(showMiniEvent, miniShowType) => { this.backToListWithMinifyWindow(showMiniEvent, miniShowType) }}
										// setRef={(v) => { this.detailBannerRef = v }}
										handle={this.handle}
										fixedStatus={this.state.fixedLive}
										scaleStatus={this.state.scaleStatus}
										isLandscapeShow={setIsLandscape}
										setIsLandscape={(v) => {
											this.setState({ setIsLandscape: !this.state.setIsLandscape })
											// this.setState({ isLandscape: v }, () => {
											// 	//強制更新玩法組位置
											// 	if (v !== true) {
											// 		//豎屏
											// 		if (this.handleWindowScrollForLineGroupBar) {
											// 			this.handleWindowScrollForLineGroupBar();
											// 		}
											// 	} else {
											// 		if (this.handleDetailDivScrollForLineGroupBar) {
											// 			this.handleDetailDivScrollForLineGroupBar();
											// 		}
											// 	}
											// });
										}}
										setFixed={(v) => {
											this.setState({ fixedLive: v },() => {
												//需要重新判斷:決定要不要把LineGroupBar設定為凍結
												this.checkIfFreezeLineGroupBar(isSmartCoachEnabled);
											})
											// this.setState({ fixedLive: v }, () => {
											// 	//解除pin時，強制檢查
											// 	if (v === false) {
											// 		setTimeout(() => {
											// 			this.handleWindowScrollForLineGroupBar()
											// 		}, 100);
											// 	}
											// });
										}}
										Vendor={this.props.Vendor}
										EventData={EventDetail}
										isLandscape={isLandscape}
										headerWidth={this.state.headerWidth}
										headerHeight={this.state.headerHeight}
										EuroCupBet={this.props.EuroCupBet}
									/>
									{/* 豎屏且header有凍結，兩個要包在一起才會一起凍結 記得上面容器高度要加上這個高度43，不然會被視為容器外，會點不到 */}
									{!isLandscape && LineGroupBarWrapInHeader && tabactive == 1?
										<DetailLineGroupBar
											width={width}
											Lines={Lines}
											selectedLineGroup={selectedLineGroup}
											sortedLineGroups={sortedLineGroups}
											onClickLineGroup={this.clickLineGroup}
											onClickLineGroupMore={this.clickLineGroupMore}
										/> : null }
								</View>
								{
									!isLandscape && isSmartCoachEnabled &&
									<View style={{flexDirection:'row'}}>
										<Touch onPress={() => { this.setState({tabactive: 1}) }} style={{width: width * 0.5,backgroundColor: tabactive == 1? '#fff': '#EDF0F6'}}>
											<Text style={{color: tabactive == 1 ? '#00A6FF': '#666666',lineHeight: 40, textAlign: 'center', fontSize: 14, fontWeight: '600'}}>赔率</Text>
										</Touch>
										<Touch onPress={() => {
											if(!this.state.infoTabIsEnabled) { return }
											this.setState({tabactive: 2})
											PiwikEvent('Match_Feature', 'View', 'Smartcoach_MatchPage')
										 }} style={{width: width * 0.5,backgroundColor: tabactive == 2? '#fff': '#EDF0F6'}}>
											<Text style={{color: !this.state.infoTabIsEnabled ? '#BCBEC3':tabactive == 2 ? '#00A6FF': '#666666',lineHeight: 40, textAlign: 'center', fontSize: 14, fontWeight: '600'}}>情报</Text>
										</Touch>
									</View>
								}
								{
									isSmartCoachEnabled &&
									<View style={[tabactive == 2? {}: {height: 0, width: 0,opacity: 0, display: 'none'}]}>
											<Smartcoach
												EventDetail={EventDetail}
												Vendor={this.props.Vendor}
												setInfoTabStatus={this.setInfoTabStatus}
											/>
									</View>
								}
								{/* 豎屏且header未凍結，就單獨放這裡，可以吃到stickyHeader(自動凍結) */}
								{!isLandscape && !LineGroupBarWrapInHeader && tabactive == 1 ?
									<DetailLineGroupBar
										width={width}
										Lines={Lines}
										selectedLineGroup={selectedLineGroup}
										sortedLineGroups={sortedLineGroups}
										onClickLineGroup={this.clickLineGroup}
										onClickLineGroupMore={this.clickLineGroupMore}
									/> : null }
								{
									tabactive == 1 &&
									setIsLandscape &&
									<ScrollView
										showsHorizontalScrollIndicator={false}
										showsVerticalScrollIndicator={false}
										stickyHeaderIndices={isLandscape ? [0] : []}
										style={
										isLandscape ? { position: 'absolute', top: 50, right: DeviceInfoIos?8:0, zIndex: 10, height: headerHeight, backgroundColor: '#EFEFF4', width: width }
											: {}
										}
									>
										{/* 橫屏時放在這，可以吃到stickyHeader(自動凍結) */}
										{isLandscape ?
										<DetailLineGroupBar
											width={width}
											Lines={Lines}
											selectedLineGroup={selectedLineGroup}
											sortedLineGroups={sortedLineGroups}
											onClickLineGroup={this.clickLineGroup}
											onClickLineGroupMore={this.clickLineGroupMore}
										/> : null }

										{/* <View className={this.state.LineGroupBarFreeze ? 'Collapselist freeze' : 'Collapselist'} ref={this.linesContainerRef}> */}
												<View style={{ paddingBottom: 120, backgroundColor: '#EFEFF4' }}>
													{
														sortedGroupedLines.map((groupedLines, index) => {
															const firstItem = groupedLines[0];
															const thisKey = firstItem.getKeyForCompare();
															const isPined = PinLines.indexOf(thisKey) !== -1;
															let LeagueName = firstItem.LineDesc;
															return (
																<CollapseList changeTop={() => { this.togglePinLine(thisKey); }} isPined={isPined} LeagueName={LeagueName} detailWidth={detailWidth}>
																	{groupedLines.map((item, indexInGroupedLines) => {
																		return (
																			<SelectionBox
																				key={item.LineId}
																				Vendor={Vendor}
																				OddsUpData={OddsUpData}
																				OddsDownData={OddsDownData}
																				LineData={item}
																				IndexInArray={indexInGroupedLines}
																				ClickOdds={this.clickOdds}
																				detailWidth={detailWidth}
																			/>
																		);
																	})}

																</CollapseList>
															)
														})
													}
												</View>
											{
												// // 	<Collapse
												// // 	defaultActiveKey={openLineKeyArray}
												// // 	accordion={false}
												// // 	onChange={(activeLineKeyArray) => {
												// // 		//console.log('===activeLineKeyArray',activeLineKeyArray);
												// // 		const LineToggleStatusArray = allLineKeyArray.map(thisKey => {
												// // 			if (activeLineKeyArray.indexOf(thisKey) !== -1) {
												// // 				return { key: thisKey, isOpen: true }
												// // 			} else {
												// // 				return { key: thisKey, isOpen: false }
												// // 			}
												// // 		})
												// // 		this.setState({ LineToggleStatusArray }) //保存展開/收起狀態
												// // 	}}
												// // 	key={openLineKeyArrayJSON}
												// // >
												// {
												// 	sortedGroupedLines.map((groupedLines, index) => {
												// 		const firstItem = groupedLines[0];
												// 		const thisKey = firstItem.getKeyForCompare();
												// 		const isPined = PinLines.indexOf(thisKey) !== -1;
												// 		return (
												// 			<Panel
												// 				key={firstItem.getKeyForCompare()}
												// 				header={
												// 					<span className="title">
												// 						{firstItem.PeriodName + firstItem.BetTypeName}
												// 						<i
												// 							className={isPined ? 'active' : ''}
												// 							onClick={(e) => {
												// 								e.stopPropagation(); //禁止穿透點擊
												// 								this.togglePinLine(thisKey);
												// 							}}
												// 						>
												// 							{/* <ReactSVG
												// 								className="public-svg"
												// 								src={
												// 									isPined ? (
												// 										'/svg/betting/goup_active.svg'
												// 									) : (
												// 											'/svg/betting/goup.svg'
												// 										)
												// 								}
												// 							/> */}
												// 						</i>
												// 					</span>
												// 				}
												// 				headerClass="my-header-class"
												// 			>
												// 				{/* {groupedLines.map((item, indexInGroupedLines) => {
												// 					return (
												// 						<SelectionBox
												// 							key={item.LineId}
												// 							PushBetCart={(data, type) => {
												// 								this.PushBetCart(data, type);
												// 							}}
												// 							PlayBetCart={PlayBetCart}
												// 							OddsUpData={OddsUpData}
												// 							OddsDownData={OddsDownData}
												// 							LineData={item}
												// 							IndexInArray={indexInGroupedLines}
												// 							BetCartdata={BetCartdata}
												// 							BetMore={BetMore}
												// 						/>
												// 					);
												// 				})} */}
												// 			</Panel>
												// 		);
												// 	})
												// }
												// // </Collapse>
											}
									</ScrollView>
								}
							</ScrollView>
						) : EventDetail === '' ? (
							// <Skeletondetail />
							<SkeletonBettingDetail />
						) : (
								<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
									{/* <ReactSVG className="noEventData-icon" src="/svg/betting/nodata.svg" /> */}
									<Image resizeMode='stretch' source={require('../../images/betting/nodata.png')} style={{ width: 90, height: 59 }} />
									<Text style={{ color: '#000', fontSize: 16, lineHeight: 40 }}>无数据</Text>
									<Text style={{ color: '#999', fontSize: 16, lineHeight: 30 }}>本场比赛暂无数据,</Text>
									<Text style={{ color: '#999', fontSize: 16, lineHeight: 30 }}>您可以返回并查看其它赛事。</Text>
								</View>
							)}

					{/* 投注板块 */}

					<Bottombetbox
						EuroCupBetDetail={this.props.EuroCupBet || false}
						ref={this._refsShowBottom}
						RemoveBetCart={this.RemoveBetCart}
						DetailPage={true}
						Vendor={this.props.Vendor}
						isLandscape={isLandscape}
						detailWidth={detailWidth}
						detailHeight={detailHeight}
					/>

					{/* 投注购物车浮窗 */}
					{/* {BetCartdata.length != 0 && (
						<BetCartPopup
							BetCartdata={BetCartdata}
							Betdataone={Betdataone}
							ShowBottomSheet={(e, t) => this.ShowBottomSheet(e, t)}
						/>
					)} */}
					{/* 點擊菜單的「更多」出現的下浮窗 */}
					{/* 投注選項 */}
					<Bottomsheet
						ref={this.lineGroupMore}
						headerName="全部盘口"
						hasDefaultButton={true}
						defaultButtonText={'全部' + (Lines ? Lines.length : 0)}
						items={EventDetail ? EventDetail.LineGroups : []}
						selectedItem={selectedLineGroup}
						formatItem={(item) => item.LineGroupName + ' ' + item.LineCount}
						getItemKey={(item) => item.LineGroupId}
						onClickItem={(item) => {
							this.setState({ LineGroupId: item ? item.LineGroupId : null });
						}}
						isLandscape={this.state.isLandscape}
						detailWidth={detailWidth}
						detailHeight={detailHeight}
					/>
				</View>
				{/* 投注购物车浮窗 */}
				<View style={{ position: 'absolute', bottom: 50, left: 5 }}>
					{
						!isLandscape &&
						<BetCartPopup
							Vendor={this.props.Vendor}
							ShowBottomSheet={this.ShowBottomSheet}
						/>
					}

				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	navRight: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
		zIndex: 11,
	},
	topNav: {
		height: 50,
		backgroundColor: '#00a6ff',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		paddingLeft:15,
		paddingRight: 15,
	},
	headerTitle: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
	},

	headerTitleTxt: {
		textAlign: 'center',
		color: '#fff',
		fontSize: 16,
		paddingLeft: 8,
		paddingRight: 8,

	},
	headerDrawer: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flex: 1,
		zIndex: 9999,
		backgroundColor: "transparent",
	},
	headerDrawerRight: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flex: 1,
		zIndex: 9999,
		backgroundColor: "transparent",
		position: 'absolute',
		right: 0,
		top: 0,
	},
	headerDrawerView: {
		backgroundColor: '#00a6ff',
		paddingTop: 30,
		borderBottomRightRadius: 15,
		borderBottomLeftRadius: 15,
		overflow: 'hidden',
	},
	drawerActive: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#fff',
		height: 70,

		marginLeft: 20,
		marginBottom: 15,
		borderRadius: 10,
	},
	nodrawerActive: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: 'rgba(0, 0, 0, 0.1)',

		borderRadius: 10,
		marginBottom: 15,
		height: 70,
		marginLeft: 20,
	},
	itemTimes: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	dateFen: {
		borderRadius: 50,
		backgroundColor: '#eb2121',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 45,
		height: 25,
	},
	Detail_menuView: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 43,
		backgroundColor: '#fff',
	},
	Detail_menu: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingRight: 70,
		backgroundColor: '#fff',
		height: 30,
		overflow: 'hidden',
	},
	list_active: {
		borderRadius: 30,
		paddingHorizontal: 9,
		paddingVertical: 6,
		backgroundColor: '#00a6ff',
		marginLeft: 9,
	},
	nolist_activ: {
		borderRadius: 30,
		paddingHorizontal: 9,
		paddingVertical: 6,
		backgroundColor: '#ecedef',
		marginLeft: 12,
	},
	moreBtn: {
		borderRadius: 30,
		paddingHorizontal: 9,
		paddingVertical: 6,
		backgroundColor: '#ecedef',
		position: 'absolute',
		right: 8,
	},
	titleView: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		padding: 10,
	},
	titles: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	OddsList: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 10,
	},
	oddTeam: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
	},
	OddsActive: {
		backgroundColor: '#e6f6ff',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#00a6ff',
	},
	noOddsActive: {
		backgroundColor: '#f7f7f7',
		borderRadius: 8,
	},
})


const mapStateToProps = state => ({
	routerLog: state.routerLog,
	betCartInfo: state.betCartInfo,
});

const mapDispatchToProps = {
	betCart_setIsComboBet: ACTION_BetCart_setIsComboBet,
	betCart_add: ACTION_BetCart_add,
	betCart_remove: ACTION_BetCart_remove,
	betCart_clear: ACTION_BetCart_clear,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(BettingDetail)

export class CollapseList extends React.Component {
	state = {
		shows: true,
	};
	shows() {
		this.setState({ shows: !this.state.shows })
	}
	render() {

		return (
			<View style={{ backgroundColor: '#FFF', width: this.props.detailWidth, borderRadius: 8, flex: 1, marginTop: 4, paddingBottom: 8 }}>
				<View style={styles.titleView}>
					<TouchableOpacity style={styles.titles} onPress={() => { this.shows() }}>
						<Image resizeMode='stretch' source={this.state.shows ? require('../../images/up.png') : require('../../images/down.png')} style={{ width: 18, height: 18 }} />
						<Text style={{ color: '#000000', fontSize:14, fontWeight: '600', paddingLeft: 10, width: this.props.detailWidth - 80 }}>{this.props.LeagueName}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.props.changeTop() }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 32, height: 30, borderRadius: 32, backgroundColor: this.props.isPined ? '#00a6ff' : '#f7f7f7' }}>
						<Image resizeMode='stretch' source={this.props.isPined ? require('../../images/goup_active.png') : require('../../images/goup.png')} style={{ width: 20, height: 20 }} />
					</TouchableOpacity>
				</View>
				<View>
					{
						<View style={this.state.shows ? {} : { height: 0, overflow: 'hidden' }}>
							{this.props.children}
						</View>
					}
				</View>
			</View>
		);
	}
}

export class DetailLineGroupBar extends React.Component {
	render() {

		const { width, Lines , selectedLineGroup, sortedLineGroups, onClickLineGroup, onClickLineGroupMore } = this.props;

		return (
			<View style={[styles.Detail_menuView, { width: width }]}>
				<View style={[styles.Detail_menu, { width: width }]}>
					<Touch
						style={selectedLineGroup === null ? styles.list_active : styles.nolist_activ}
						onPress={() => onClickLineGroup(null)}
					>
						<Text style={{
							color: selectedLineGroup === null ? '#fff' : '#999', lineHeight: 18, fontSize: 12, fontWeight: '600'
						}}>全部 {Lines ? Lines.length : 0}</Text>
					</Touch>
					{sortedLineGroups.map((item, index) => {
						//console.log(item);
						if (item.LineCount > 0) {
							//有數據的分類才展示
							return (
								<Touch
									style={
										(selectedLineGroup
											? selectedLineGroup.LineGroupId
											: null) === item.LineGroupId ? (
											styles.list_active
										) : (
											styles.nolist_activ
										)
									}
									key={index}
									onPress={() => onClickLineGroup(item.LineGroupId)}
								>
									<Text
										style={
											{
												fontSize: 12, fontWeight: '600',
												lineHeight: 18,
												color: (selectedLineGroup
													? selectedLineGroup.LineGroupId
													: null) === item.LineGroupId ? (
													'#fff'
												) : (
													'#999'
												)
											}
										}
									>{item.LineGroupName + ' ' + item.LineCount}</Text>
								</Touch>
							);
						} else {
							return null;
						}
					})}
					<TouchableOpacity
						style={styles.moreBtn}
						onPress={onClickLineGroupMore}
					>
						<Text style={{ lineHeight: 30, color: '#999' }}>+更多</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}
