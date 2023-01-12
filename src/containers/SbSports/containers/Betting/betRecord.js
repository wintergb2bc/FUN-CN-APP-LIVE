import React from "react";
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
	Modal,
	Clipboard,
	RefreshControl,
	Button,
	Switch
} from "react-native";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
import ComboBonusModal from '../../game/ComboBonusModal'
// import fetch from 'fetch-with-proxy';
import { Flex, Toast, WingBlank, WhiteSpace, Accordion, Tabs, TabPane, Drawer } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import VendorBTI from './../../lib/vendor/bti/VendorBTI';
import VendorIM from './../../lib/vendor/im/VendorIM';
import VendorSABA from './../../lib/vendor/saba/VendorSABA';
import moment from 'moment'
import CalendarPicker from 'react-native-calendar-picker';
import CashOutButtonBox from "./CashOut/CashOutButtonBox";
import CashOutPopup from "./CashOut/CashOutPopup";
import WagerData from "./../../lib/vendor/data/WagerData";
import {CashOutStatusType} from "./../../lib/vendor/data/VendorConsts";
import CashOutStyles from './CashOut/CashOutStyles';
import i18n from './../../lib/vendor/vendori18n';
const { width, height } = Dimensions.get("window");

const dateRadioSource = [{
	text: "今天",
	piwik: 'Betrecord_today',
	value: 1
}, {
	text: "昨天",
	piwik: 'Betrecord_yesterday',
	value: 2
}, {
	text: "近7天",
	piwik: 'Betrecord_7days',
	value: 3
}, {
	text: "日期",
	piwik: 'Betrecord_daterange',
	value: 4
}]

const minDate = [new Date(new Date().getTime() - 90*24*60*60*1000), new Date(new Date().getTime() - 1*60*60*1000)];//90天
const minDateIM = [new Date(new Date().getTime() - 31*24*60*60*1000), new Date(new Date().getTime() - 1*24*60*60*1000)];//31天
const minDateSABA = [new Date(new Date().getTime() - 29*24*60*60*1000), new Date(new Date().getTime() - 1*24*60*60*1000)];//31天
const maxDate = [new Date(), new Date()];

const day7time = 24*60*60*7*1000;
const day1time = 24*60*60*1*1000;

//投注記錄
class BetRecord extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			ScrollTop: false,
			vendor: "bti",
			page: "unsettle",
			dateRadio: 3, //默認開啟近７天
			date: [new Date(new Date().getTime() - day7time), new Date()],
			showDateRange: false,
			unsettleWagersList: [],
			//getUnSettledWagersHasError: [], 未結算不用，已改為輪詢
			settledWagersList: [],
			getSettledWagersHasError: false,
			showComboBonusModal: false,
			cashOutLockingVendor: null, //當前鎖定注單for 提前兌現 的vendor(tab key)，用來處理兌現中切換vendor的情況
			cashOutLockingWagerData: null, //鎖定注單 for 提前兌現
			cashOutLockingWagerIsProcessing: false, //鎖定注單是否正在進行兌現(因為流程有彈窗，同時間內只能兌現一張單，其他按鈕必須不可用)
			cashOutWagerDataForPopup: null, //注單數據 for 提前兌現 結果彈窗
			showCashOutOnly: false, //只展示可提前兌現的數據
			checkActive: window.lowerV,
			onTab: '1',
			nowShowType: [],
			onRefresh: false,
			visible4: false,
			selectedStartDate: moment(minDate[1]).format('YYYY-MM-DD'),
			selectedEndDate: moment(maxDate[0]).format('YYYY-MM-DD'),
			minDate: minDate,
			maxDate: maxDate,
			dateActive: false,
			dataErr: '',
		};


		this.totalBetCurrency = 0;
		this.totalWinCurrency = 0;
		this.onDateChange = this.onDateChange.bind(this);

		this.VendorMapping = {
			'BTI': VendorBTI,
			'IM': VendorIM,
			'SABA':VendorSABA,
		}

		this.currentVendor = VendorIM;

		this.unSettlePollingKey = null; //未結算注單 輪詢key
		this.isDidUnmount = null; //紀錄是否已退出投注記錄頁面 => 決定cashout彈窗還要不要展示
	}

	componentDidMount() {
		this.isDidUnmount = false;
		const lowerV = window.lowerV;
		const vendor = this.VendorMapping[lowerV];
		let currentV = this.state.vendor;
		let currentP = this.state.page;
		if (vendor) {
			this.currentVendor = vendor;
			this.setState({ vendor: lowerV });
			currentV = lowerV;
		}
		this.doQuery(this.currentVendor);
		this.changeDate()
		//this.updateUrl(currentV,currentP);
	}

	componentWillMount() {
		window.openOrientation && window.openOrientation()
	}

	componentWillUnmount() {
		this.isDidUnmount = true;
		this.deleteUnSettlePolling();
	}

	//刪除 未結算注單 輪詢
	deleteUnSettlePolling = () => {
		if (this.currentVendor && this.unSettlePollingKey) {
			this.currentVendor.deletePolling(this.unSettlePollingKey);
		}
	}

	changeDate() {
		let minDates = minDate
		let selectedStartDate = moment(minDate[1]).format('YYYY-MM-DD')
		if(this.state.checkActive == 'IM') {
			minDates = minDateIM
			selectedStartDate = moment(minDateIM[1]).format('YYYY-MM-DD')
		}
		if(this.state.checkActive == 'SABA') {
			minDates = minDateSABA
			selectedStartDate = moment(minDateSABA[1]).format('YYYY-MM-DD')
		}
		this.setState({minDate: minDates, selectedStartDate})
	}

	doQuery(Vendor) {
		this.currentVendor = Vendor;
		// 查詢未結算注單
		this.getUnsettleWagers();
		// 查詢已結算注單
		this.getSettledWagers();
	}

	// 查詢未結算注單
	getUnsettleWagers = () => {
		this.deleteUnSettlePolling(); //先刪除輪詢

		this.unSettlePollingKey = this.currentVendor.getUnsettleWagersPolling(
			data => {
				//console.log('getUnsettleWagers', data);
				this.setState(state => {
					//處理 注單數據鎖定
					if (state.cashOutLockingWagerData
						&& state.cashOutLockingVendor == state.vendor //如果vendor tab切走了 就不用處理
					) {
						let indexInOldData = state.unsettleWagersList.findIndex(item => item.WagerId === state.lockingWagerId);
						if (indexInOldData < 0) {
							indexInOldData = 0; //找不到就放第一個
						}

						const oldData = state.cashOutLockingWagerData; //直接使用鎖定數據，不使用本地清單，因為切到另外一個vendor再切回來，數據就不見了
						let cloneArr = [...data];
						const indexInNewData = data.findIndex(item => item.WagerId === state.cashOutLockingWagerData.WagerId);
						if (indexInNewData !== -1) {
							// const newData = cloneArr[indexInNewData];
							// if (newData.CashOutPrice !== oldDta.CashOutPrice) {
							//   console.log('=====兌現金額已變化：',oldDta.CashOutPrice,' => ',newData.CashOutPrice, ' ||| ', oldDta.CashOutPriceId, ' => ',newData.CashOutPriceId)
							// }
							//有在新數據裡面 => 不更新這筆(用舊數據取代)
							cloneArr.splice(indexInNewData, 1, oldData); //用splice處理取代
						} else {
							//沒在新數據裡面 => 表示已經被刪除了 => 補進去
							cloneArr.splice(indexInOldData, 0, oldData); //用splice處理加入(deletecount = 0)
						}
						return {
							unsettleWagersList: cloneArr
						}
					}
					return {
						unsettleWagersList: data
					}
				})
			}
		);
	}

	// 查詢已結算注單
	getSettledWagers = (key = null) => {

		const { selectedStartDate, selectedEndDate } = this.state;

		if (key === null) {
			key = this.state.date;
		}

		let date = typeof key === "number" ? [new Date(), new Date()] : key;
		const startDate = selectedStartDate ? selectedStartDate.toString() : '';
		const endDate = selectedEndDate ? selectedEndDate.toString() : '';


		switch (key) {
			case 1:
				date = [new Date(), new Date()];
				break;
			case 2:
				date = [new Date(new Date().getTime() - day1time), new Date(new Date().getTime() - day1time)];
				break;
			case 3:
				date = [new Date(new Date().getTime() - day7time), new Date()];
				break;
			case 4:
				date = [startDate, endDate]
				break;
			default:
				break;
		}

		this.setState({date})
		Toast.loading('加载中,请稍候...', 6);
		this.currentVendor.getSettledWagers(moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD'))
			.then(data => {
				//console.log('getSettledWagers', data)
				Toast.hide();
				this.totalBetCurrency = 0;
				this.totalWinCurrency = 0;
				data.forEach((val) => {
					this.totalBetCurrency += parseFloat(val.BetAmount);
					this.totalWinCurrency += parseFloat(val.WinLossAmount);
				})
				this.setState({
					settledWagersList: data,
					getSettledWagersHasError: false,
					onRefresh: false
				});
			})
			.catch(err => {
				this.setState({getSettledWagersHasError: true, onRefresh: false}); //查詢錯誤就設為true
				Toast.hide();
				console.log('getSettledWagers has error',err)
			});
	}

	onChange = date => this.setState({ date })
	dateChange() {
		if(this.state.dataErr != '') { return }
		this.getSettledWagers(4);
		this.setState({ visible4: false, dateActive: true })
		// this.setState({dateRadio: 4})
	}

	getWagerScore(wagerItemData) {
		if (wagerItemData.HomeTeamFTScore !== null || wagerItemData.AwayTeamFTScore !== null) {
			return '[' + (wagerItemData.HomeTeamFTScore ?? 0) + '-' + (wagerItemData.AwayTeamFTScore ?? 0) + ']';
		}
		return '';
	}

	checkMaintenanceStatus = (name) => {
		const { isBTI, isIM, isSABA, noTokenBTI, noTokenIM, noTokenSABA } = this.props.maintainStatus;
		const { isLogin } = ApiPort.UserLogin; //有登入才額外判斷 token獲取狀態
		switch (name) {
			case 'bti':
				return isBTI || (isLogin && noTokenBTI);
			case 'im':
				return isIM || (isLogin && noTokenIM);
			case 'saba':
				return isSABA || (isLogin && noTokenSABA);
			default:
				return false;
		}
	};

	checkActive(checkActive) {
		if(checkActive == 'IM') {
			if (this.checkMaintenanceStatus('im')) return false;
			PiwikEvent('Account', 'View', 'BetRecord_IM_SB2.0')
		} else if(checkActive == 'BTI') {
			if (this.checkMaintenanceStatus('bti')) return false;
			PiwikEvent('Account', 'View', 'BetRecord_BTi_SB2.0')
		} else if(checkActive == 'SABA') {
			if (this.checkMaintenanceStatus('saba')) return false;
			PiwikEvent('Account', 'View', 'Betrecord_SABA_SB2.0')
		}
		if (checkActive == this.state.checkActive) { return }
		let onNavigation = this.state.onNavigation
		onNavigation += 1
		this.setState({ checkActive, onNavigation, dateRadio: 1, nowShowType: [],unsettleWagersList: [],settledWagersList: [], date : [new Date(), new Date()] }, () => {
			this.deleteUnSettlePolling(); //先刪除輪詢
			this.doQuery(this.VendorMapping[checkActive]);
			this.changeDate()
		})

	}


	onTabClick(key) {    //tabs切換
		if(key == 1) {
			//this.getUnsettleWagers(); 輪詢不用點擊查詢
			PiwikEvent('Account', 'View', 'Betrecord_Openbets_SB2.0')
		} else {
			this.getSettledWagers()
			PiwikEvent('Account', 'View', 'Betrecord_Settledbets_SB2.0')
		}
		this.setState({
			onTab: key,
			nowShowType: [],
		})

	}

	TocuhShowType(key) {
		let nowShowType = this.state.nowShowType
		//console.log(key,'nowshow')
		if (nowShowType[key] == key) {
			nowShowType[key] = 'a';
		} else {
			nowShowType[key] = key
		}


		this.setState({
			nowShowType
		})
	}


	//复制
	copy(txt) {
		PiwikEvent('Account', 'View', 'Betrecord_copyID_SB2.0')
		try {
			const value = String(txt)
			Clipboard.setString(value);
			Toast.info("已复制", 2);
		} catch (error) {
			//console.log(error);

		}

	}


	_contentViewScroll = (e) => {
		this.setState({
			onRefresh: true
		})
		this.doQuery(this.currentVendor);
	}

	onDateChange(date, type) {
		let dataErr = false
		if (type === 'END_DATE') {
			if(date) {
				this.setState({
					selectedEndDate: date,
				},() => {
					let startDate = this.state.selectedStartDate.toString()
					dataErr = new Date(startDate).getTime() > new Date(date.toString()).getTime()? true: false
					this.setState({dataErr: dataErr? '结束时间不能小于开始时间': ''})
				});
			}
		} else {
			this.setState({
				selectedStartDate: date,
			}, () => {
				let endDate = this.state.selectedEndDate? this.state.selectedEndDate.toString(): new Date()
				dataErr = new Date(date.toString()).getTime() > new Date(endDate).getTime()? true: false
				this.setState({dataErr: dataErr? '开始时间不能大于结束时间': ''})
			});
		}
	}

	//提前兌現 => 更新鎖定注單狀態
	updateLockingWager = (wagerData) => {
		if (this.isDidUnmount) {
			return false; //如果已經離開投注記錄頁面，放棄更新
		}
		this.setState(state => {
			let newState = {};

			//如果已經切換vendor
			if (state.cashOutLockingVendor !== state.vendor) {
				newState.cashOutWagerDataForPopup = null;  //不展示彈窗
				if (wagerData.CashOutStatus != CashOutStatusType.PROCESS) {
					//鎖定注單 不是處理中 ，直接解鎖 (注意和 cashOutLockingWagerIsProcessing 判斷不同， 不需要考慮NEWPRICE新價格的狀況)
					newState.cashOutLockingWagerData = null
					newState.cashOutLockingVendor = null
				}
				return newState;
			}

			//更新鎖定注單數據
			newState.cashOutLockingWagerData = wagerData;

			//更新列表數據
			const indexInList = state.unsettleWagersList.findIndex(item => item.WagerId === wagerData.WagerId);
			if (indexInList !== -1) {
				let cloneArr = [...state.unsettleWagersList];
				cloneArr.splice(indexInList, 1, wagerData); //用splice處理取代
				newState.unsettleWagersList = cloneArr;
			}

			//更新鎖定注單狀態：是否處理中
			newState.cashOutLockingWagerIsProcessing = (wagerData.CashOutStatus == CashOutStatusType.PROCESS || wagerData.CashOutStatus == CashOutStatusType.NEWPRICE)

			//處理彈窗 成功，失敗，拒絕 才會有彈窗
			if (wagerData.CashOutStatus == CashOutStatusType.DONE
				|| wagerData.CashOutStatus == CashOutStatusType.FAIL
				|| wagerData.CashOutStatus == CashOutStatusType.DECLINE
			) {
				newState.cashOutWagerDataForPopup = wagerData;
			} else {
				newState.cashOutWagerDataForPopup = null;
			}

			return newState;
		})
	}

	//提前兌現 => 鎖定注單
	lockWager = (wagerData) => {
		this.setState(state => ({cashOutLockingWagerData:WagerData.clone(wagerData), cashOutLockingVendor: state.vendor}));
	}

	//提前兌現 => 解鎖注單
	unlockWager = () => {
		this.setState({cashOutLockingWagerData:null, cashOutLockingVendor: null});
	}

	//提前兌現 => 切換 到 已結算注單
	showSettledWagers = () => {
		this.setState({page: 'settled'},() => {
			this.doQuery(this.currentVendor);
			this.onTabClick('2');
		})
	}

	//提前兌現 => 刷新數據
	reloadWagers = () => {
		this.doQuery(this.currentVendor);
	}

	//提前兌現 => 關閉結果彈窗
	closePopup = () => {
		this.setState({cashOutWagerDataForPopup: null});
	}

	//提前兌現 => 過濾數據
	toggleCashOutFilter = (val) => {
		this.setState({showCashOutOnly: val});
	}


	openLiveChat = (betId, eventDate) => {
		LiveChatOpenGlobe("&CUSTOM!MatchStartDate=" + moment(eventDate).utcOffset(0).format("YYYY-MM-DD HH:mm:ss") + "&CUSTOM!BetslipID=" + betId)
	}

	//獲取 已結算 注單狀態
	getSettledWagerStatusName = (wagerData) => {
		//val.WinLossAmount > 0 ? "赢" : val.WinLossAmount < 0 ? "输" : "和"

		const Vendor = this.currentVendor;
		if (wagerData.WinLossAmount > 0) {
			return "赢"; //贏
		} else if (wagerData.WinLossAmount < 0) {
			return "输";  //輸
		}
		//和
		if (Vendor.configs.VendorName === 'IM') {
			if ([1,2].indexOf(wagerData.WagerStatus) !== -1) { //IM: 1待定 2確認 展示為和, 其他Vendor都有對應的正確文字
				return "和";
			}
			return (wagerData.WagerStatusName ? wagerData.WagerStatusName : "和");
		}
		return (wagerData.WagerStatusName ? wagerData.WagerStatusName : "和");
	}

	renderSettledWagerStatus = (wagerData) => {
		const statusName = this.getSettledWagerStatusName(wagerData);
		return <View	style={wagerData.WinLossAmount > 0 ? styles.win : wagerData.WinLossAmount < 0 ? styles.lost : styles.level}>
			<Text style={[(wagerData.WinLossAmount > 0 ? styles.Textwin : wagerData.WinLossAmount < 0 ? styles.Textlost: styles.Textlevel)
				, (statusName && statusName.length > 1) ? {minWidth: statusName.length * 25} : {}
				, (statusName && statusName.length > 1 && Platform.OS === "android") ? {height: 35} : {}
			]}>{statusName}</Text>
		</View>
	}

	render() {
		const {
			checkActive, onTab, settledWagersList, nowShowType, onRefresh, selectedStartDate, selectedEndDate,minDate,maxDate, dateActive,
			dataErr,
			ScrollTop,
		} = this.state;

		const Vendor = this.currentVendor;
		const btiIsMaintenance = this.checkMaintenanceStatus('bti');
		const imIsMaintenance = this.checkMaintenanceStatus('im');
		const sabaIsMaintenance = this.checkMaintenanceStatus('saba');

		let unsettleWagersList = this.state.unsettleWagersList;
		if (this.state.showCashOutOnly) {
			unsettleWagersList = unsettleWagersList.filter(w => w.CanCashOut);
		}

		const startDate = selectedStartDate ? selectedStartDate.toString() : '';
		const endDate = selectedEndDate ? selectedEndDate.toString() : '';

		return (
			<View style={styles.rootView}>

				{/*Head*/}
				<View style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', paddingLeft: 20, backgroundColor: '#00a6ff', paddingBottom: 11, paddingTop: 15}}>
					<TouchableOpacity style={{ marginRight: 33, position: "relative", justifyContent: "center", height: 30 }} onPress={()=>{
							if(imIsMaintenance){
								return;
							}
						this.checkActive('IM')
					}}>
						<View style={{borderBottomColor: checkActive == 'IM'? "#fff" : "transparent", borderBottomWidth: 3, paddingBottom:2}}>
							<Text style={{color: "#fff", fontSize: checkActive == 'IM' ? 20 : 16}}>IM</Text>
						</View>
						{
							imIsMaintenance && <View style={styles.maintenance}><Text style={{ color: '#704708', fontSize: 10 }}>维修</Text></View>
						}
					</TouchableOpacity>
					<TouchableOpacity style={{ marginRight: 33, position: "relative", justifyContent: "center", height: 30 }} onPress={()=>{
						if(imIsMaintenance){
							return;
						}
						this.checkActive('SABA')
					}}>
						<View style={{borderBottomColor: checkActive == 'SABA'? "#fff" : "transparent", borderBottomWidth: 3, paddingBottom:2}}>
							<Text style={{color: "#fff", fontSize: checkActive == 'SABA' ? 20 : 16}}>沙巴</Text>
						</View>
						{
							sabaIsMaintenance && <View style={styles.maintenance}><Text style={{ color: '#704708', fontSize: 10 }}>维修</Text></View>
						}
					</TouchableOpacity>
					<TouchableOpacity style={{ position: "relative", justifyContent: "center", height: 30 }} onPress={()=>{
						if(imIsMaintenance){
							return;
						}
						this.checkActive('BTI')
					}}>
						<View style={{borderBottomColor: checkActive == 'BTI'? "#fff" : "transparent", borderBottomWidth: 3, paddingBottom:2}}>
							<Text style={{color: "#fff", fontSize: checkActive == 'BTI' ? 20 : 16}}>BTI</Text>
						</View>
						{
							btiIsMaintenance && <View style={styles.maintenance}><Text style={{ color: '#704708', fontSize: 10 }}>维修</Text></View>
						}
					</TouchableOpacity>
				</View>

				<View style={{ flexDirection: 'row', height: 40, borderColor: '#00a6ff', borderTopWidth: 1 }}>{/*Tabs*/}


					<Touch style={[styles.Typs, { backgroundColor: onTab == 1 ? "#EFEFF4" : "#D7D7DB", borderTopLeftRadius: 8, }]} onPress={() => { this.onTabClick('1') }}>
						<Text style={onTab == 1 ? styles.TypsTextHover : styles.TypsText}>未结算 {unsettleWagersList.length}</Text>
					</Touch>

					<Touch style={[styles.Typs, { backgroundColor: onTab == 2 ? "#EFEFF4" : "#D7D7DB", borderTopRightRadius: 8 }]} onPress={() => { this.onTabClick('2') }}>
						<Text style={onTab == 2 ? styles.TypsTextHover : styles.TypsText}>已结算 {this.state.settledWagersList.length}</Text>
					</Touch>


				</View>

				<ScrollView
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl refreshing={onRefresh} onRefresh={() => this._contentViewScroll()} />
					}
					onScroll={(e) => {
						let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
						if(offsetY > 80 && !ScrollTop) {
							this.setState({ScrollTop: true})
						}
						if(offsetY < 80 && ScrollTop) {
							this.setState({ScrollTop: false})
						}
					}}
					scrollEventThrottle={16}
					ref={res => { this._ScrollTop = res}}
				>

					{/* 未结算 */}

					{onTab == 1 &&
						<View style={{ justifyContent: "center", alignItems: 'center' }}>
							{
								Vendor.configs.HasCashOut &&
								<View style={CashOutStyles.cashoutFilterButton}>
									<Text>只显示兑现注单</Text>
									<Switch
										onTintColor={'#00A6FF'}
										value={this.state.showCashOutOnly}
										thumbTintColor={'#fff'}
										onValueChange={this.toggleCashOutFilter}
									/>
								</View>
							}
							{
								unsettleWagersList.length
									?	unsettleWagersList.map((val, key) => {
										return <View key={key}>
											{
												val.WagerType !== 2 ?
													<View style={{ justifyContent: "center", alignItems: 'center', backgroundColor: '#fff', marginTop: 10, width: width, borderRadius: 8 }}>
														<View style={{ backgroundColor: '#fff', width: width - 50, paddingTop: 20, paddingBottom: 7, borderRadius: 8 }}>
															<TouchableOpacity onPress={() => {
																this.TocuhShowType(key);
															}}>
																<View>
																	<View style={{ flexDirection: 'row' }}>
																		<Text style={{color: '#000', fontSize: 16}}>{val.WagerItems[0].SelectionDesc}<Text style={{ color: '#00A6FF', fontSize: 18 }}> @{val.WagerItems[0].Odds}</Text></Text>
																	</View>
																	{val.WagerItems[0].LineDesc &&
																	<View style={{ paddingTop: 5 }}>
																		<Text style={{ color: '#BCBEC3', width: width * 0.6, fontSize: 14 }}>{val.WagerItems[0].LineDesc}</Text>
																	</View>
																	}
																</View>
																<View style={{ top: -40, right: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
																	<Text style={{ color: '#999999', textAlign: 'right' }}>
																		{(['IM','SABA'].indexOf(checkActive) !== -1) ? val.WagerStatusName : '投注成功'}
																	</Text>
																	<View style={nowShowType[key] == key ? styles.arrows : styles.arrow}></View>
																</View>
															</TouchableOpacity>
														</View>
														<View style={nowShowType[key] == key ? styles.showContext : styles.hideContext}>
															{val.WagerItems.map(item => (
																<View key={item.EventId} style={{ paddingTop: 10, paddingBottom: 10 }}>
																	<View>
																		{val.WagerItems[0].IsOutRightEvent
																			? <Text style={{ fontSize: 12, color: '#000' }}>{val.WagerItems[0].OutRightEventName}</Text>
																			: <Text style={{ fontSize: 12, color: '#000' }}>{val.WagerItems[0].HomeTeamName} VS {val.WagerItems[0].AwayTeamName} {this.getWagerScore(val.WagerItems[0])}</Text>
																		}
																		<View>

																		</View>
																	</View>
																	<Text style={{ color: '#BCBEC3', fontSize: 12, paddingTop: 5 }}>{val.WagerItems[0].LeagueName}</Text>
																	{
																		val.WagerItems[0].IsRB &&
																		<View style={styles.gameTmes}>
																			<Image resizeMode='stretch' source={require('../../images/timeIcon.png')} style={{ width: 16, height: 16 }} />
																			<Text style={{color: '#BCBEC3', fontSize: 12}}>
																				{` ${val.WagerItems[0].RBPeriodName} ${val.WagerItems[0].RBMinute? val.WagerItems[0].RBMinute + "'": '-'} | ${val.WagerItems[0].RBHomeScore}-${val.WagerItems[0].RBAwayScore}`}
																			</Text>
																		</View>
																	}
																	{
																		!val.WagerItems[0].IsRB &&
																		<Text style={{ color: '#BCBEC3', fontSize: 12, paddingTop: 5 }}>开赛时间：{val.WagerItems[0].getEventDateMoment().format('MM/DD HH:mm')}</Text>
																	}
																</View>
															))}
															<View style={{ borderColor: '#dde0e6', borderTopWidth: 1, paddingTop: 10 }}>
																<View>
																	<View style={styles.bettMoney}>
																		<Text style={{ color: '#999', fontSize: 12 }}>投注额：<Text style={{ color: '#000', fontWeight: 'bold' }}>￥{val.BetAmount}</Text></Text>
																		<Text style={{ color: '#999', fontSize: 12, paddingTop: 3 }}>可赢金额：<Text style={{ color: '#000', fontWeight: 'bold' }}>￥{val.PotentialPayoutAmount}</Text></Text>
																	</View>
																	<View>
																		{val.FreeBetAmount > 0 ? <Text style={{ color: '#666', fontSize: 12 }}>免费投注：<Text style={{ color: '#000', fontWeight: 'bold' }}>￥{val.FreeBetAmount}</Text></Text> : null}
																	</View>
																</View>
																<View style={{ flexDirection: 'row', paddingTop: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
																	<View>
																		<View style={{ flexDirection: 'row' }}>
																			<Text style={{ color: '#BCBEC3', fontSize: 12 }}>单号：</Text>
																			<Text style={{ color: '#BCBEC3', fontSize: 12 }}>{val.WagerId}</Text>
																			<View style={{ paddingLeft: 1 }}>
																				<Touch onPress={() => { this.copy(val.WagerId) }}>
																					<Image
																						resizeMode="stretch"
																						source={require("../../../../images/icon/copy.png")}
																						style={{ width: 14, height: 14, marginLeft: 6 }}
																					/>
																				</Touch>
																			</View>
																		</View>
																		<Text style={{ color: '#BCBEC3', fontSize: 12, paddingTop: 3 }}>
																			{val.getCreateTimeMoment().format('YYYY-MM-DD HH:mm:ss')}{val.OddsTypeName ? '(' + val.OddsTypeName + ')' : ''}
																		</Text>
																	</View>
																	<Touch onPress={() => {
																		this.openLiveChat(val.WagerId, val.WagerItems[0].EventDate);
																		PiwikEvent('CS', 'Launch', 'LiveChat_BetRecord_SB2.0')
																	}}>
																		<View style={{ paddingLeft: 2 }}>
																			<Image resizeMode='stretch' source={require('../../images/cs.png')} style={{ width: 26, height: 26 }} />
																		</View>
																	</Touch>
																</View>
															</View>
														</View>
													</View>
													: <View style={{ backgroundColor: '#fff', marginTop: 10, width: width, borderRadius: 8 }}>
														<View style={{ justifyContent: "center", alignItems: 'center', backgroundColor: '#fff', paddingTop: 20, paddingBottom: 7, borderRadius: 8 }}>
															<TouchableOpacity onPress={() => {
																this.TocuhShowType(key);
															}}>

																<View style={{ flexDirection: 'row', width: width - 50, top: -5 }}>
																	<View style={{ flex: 1, flexDirection: 'row' ,alignItems: 'center', justifyContent: 'flex-start'}}>
																		<View>
																			<Text style={{ fontSize: 16, color: '#000' }}>混合投注</Text>
																		</View>
																		<View style={{ paddingLeft: 10 }}>
																			<Text style={{ fontSize: 12, color: '#666666' }}>{val.ComboTypeName} X {val.ComboCount} {val.Odds ? '@' + val.Odds : ''}</Text>
																		</View>
																		{
																			val.HasComboBonus ?
																				<Touch
																					onPress={() => {
																						this.setState({
																							showComboBonusModal: true
																						});
																					}} style={styles.gift}>
																					<View style={styles.giftBg}>
																						<Image resizeMode='stretch' source={require('../../images/betting/orange.png')} style={{ width: 40, height: 28 }} />
																					</View>
																					<Text style={{ color: '#fff', fontSize: 12, }}>{val.ComboBonusPercentage}%</Text>
																					<Image resizeMode='stretch' source={require('../../images/betting/gift.png')} style={{ width: 15, height: 15 }} />
																				</Touch> : null
																		}
																	</View>
																	<View style={{ right: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
																		<Text style={{ color: '#999', textAlign: 'right' }}>
																			{(['IM','SABA'].indexOf(checkActive) !== -1) ? val.WagerStatusName : '投注成功'}
																		</Text>
																		<View style={nowShowType[key] == key ? styles.arrows : styles.arrow}></View>
																	</View>
																</View>
															</TouchableOpacity>
														</View>
														<ScrollView
															showsHorizontalScrollIndicator={false}
															showsVerticalScrollIndicator={false}
														>
															<View style={[nowShowType[key] == key ? styles.showContext : styles.hideContext, { paddingLeft: 8 }]}>
																{val.WagerItems.map(item => (
																	<View key={item.EventId} style={{ paddingLeft: 18, paddingTop: 10, paddingBottom: 10, borderColor: '#dde0e6', borderBottomWidth: 1 }}>

																		<View>
																			<View style={{ flexDirection: 'row' }}>
																				<Text style={{ fontSize: 14, color: '#000' }}>{item.SelectionDesc}<Text style={{ fontSize: 18, color: '#00A6FF' }}> @{item.Odds}</Text></Text>
																			</View>
																			<View>
																				<Text style={{ color: '#BCBEC3', fontSize: 12 }}>{item.LineDesc}</Text>
																			</View>
																		</View>
																		<View style={{ paddingTop: 10 }}>
																			{item.IsOutRightEvent
																				? <Text style={{ color: '#000', fontSize: 12 }}>{item.OutRightEventName}</Text>
																				: <Text style={{ color: '#000', fontSize: 12 }}>{item.HomeTeamName} VS {item.AwayTeamName} {this.getWagerScore(item)}</Text>
																			}
																		</View>
																		<Text style={{ color: '#BCBEC3', paddingTop: 2, fontSize: 12 }}>{item.LeagueName}</Text>
																		{
																			item.IsRB &&
																			<View style={styles.gameTmes}>
																				<Image resizeMode='stretch' source={require('../../images/timeIcon.png')} style={{ width: 16, height: 16 }} />
																				<Text style={{color: '#BCBEC3', fontSize: 12}}>
																					{` ${item.RBPeriodName} ${item.RBMinute? item.RBMinute + "'" : '-'} | ${item.RBHomeScore}-${item.RBAwayScore}`}
																				</Text>
																			</View>
																		}
																		{
																			!item.IsRB &&
																			<Text style={{ color: '#BCBEC3', paddingTop: 5, fontSize: 12 }}>开赛时间：{item.getEventDateMoment().format('MM/DD HH:mm')}</Text>
																		}
																	</View>
																))}


																<View style={{ paddingTop: 10, paddingLeft: 18}}>
																	<View>
																		<View style={styles.bettMoney}>
																			<Text style={{ color: '#999', fontSize: 12 }}>投注额：<Text style={{ color: '#000', fontWeight: 'bold' }}>￥{val.BetAmount}</Text></Text>
																			<Text style={{ color: '#999', fontSize: 12, paddingTop: 3 }}>可赢金额：<Text style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>￥{val.PotentialPayoutAmount}</Text></Text>
																		</View>
																		<View>
																			{val.HasComboBonus && <Text style={{ color: '#BCBEC3', fontSize: 12 }}>额外盈利：<Text style={{fontSize: 12, color: '#BCBEC3'}}>￥{val.ComboBonusWinningsAmount}</Text></Text>}
																			{val.FreeBetAmount > 0 && <Text style={{ color: '#BCBEC3', fontSize: 12 }}>免费投注：<Text style={{fontSize: 12, color: '#BCBEC3'}}>￥{val.FreeBetAmount}</Text></Text>}
																		</View>
																	</View>
																	<View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
																		<View style={{ paddingTop: 5, flex: 1 }}>
																			<View style={{ flexDirection: 'row' }}>
																				<Text style={{ color: '#BCBEC3', fontSize: 12 }}>单号：</Text>
																				<Text style={{ color: '#BCBEC3', fontSize: 12 }}>{val.WagerId}</Text>
																				<View style={{ paddingLeft: 2, paddingTop: 1 }}>
																					<Touch onPress={() => { this.copy(val.WagerId) }}>
																						<Image
																							resizeMode="stretch"
																							source={require("../../../../images/icon/copy.png")}
																							style={{ width: 14, height: 14, marginLeft: 6 }}
																						/>
																					</Touch>
																				</View>
																			</View>
																			<Text style={{ color: '#BCBEC3', fontSize: 12, paddingTop: 3 }}>
																				{val.getCreateTimeMoment().format('YYYY-MM-DD HH:mm:ss')}{val.OddsTypeName ? '(' + val.OddsTypeName + ')' : ''}
																			</Text>
																		</View>
																		<Touch onPress={() => {
																			this.openLiveChat(val.WagerId, val.WagerItems[0].EventDate);
																			PiwikEvent('CS', 'Launch', 'LiveChat_BetRecord_SB2.0')
																		}}>
																			<View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end', paddingLeft: 2 }}>
																				<Image resizeMode='stretch' source={require('../../images/cs.png')} style={{ width: 26, height: 26, }} />
																			</View>
																		</Touch>
																	</View>
																</View>

															</View>
														</ScrollView>
													</View>
											}

											<CashOutButtonBox
												Vendor={Vendor}
												wagerData={val}
												updateLockingWager={this.updateLockingWager}
												lockWager={this.lockWager}
												lockingWagerId={this.state.cashOutLockingWagerData ? this.state.cashOutLockingWagerData.WagerId : null}
												lockingWagerIsProcessing={this.state.cashOutLockingWagerIsProcessing}
												unlockWager={this.unlockWager}
											/>
										</View>
									})
							 	: <View style={CashOutStyles.betRecordsEmpty}>
										<Image resizeMode='stretch' source={require('../../images/emptybox.png')} style={CashOutStyles.betRecordsEmptyImg} />
										<Text style={CashOutStyles.betRecordsEmptyText} >
											{
												this.state.showCashOutOnly ? '没有兑现注单' : '暂无记录'
											}
										</Text>
									</View>
							}
						</View>
					}

					{/*已結算*/}

					{onTab == 2 &&
						<View style={{ justifyContent: "center", alignItems: 'center', }}>
							<View style={{ paddingTop: 8, paddingBottom: 5, alignSelf: "flex-start", marginLeft: 16 }}>
								<View style={{ flexDirection: 'row' }}>
									{dateRadioSource.map((v, i) => {
										return <View key={i} style={{ paddingRight: 10 }}>
											<Touch
												onPress={() => {
													PiwikEvent('Account', 'View', v.piwik)
													if (v.value === 4) {
														this.setState({ visible4: true, dateRadio: 4 })
													} else {
														this.setState({ dateRadio: v.value, dateActive: false })
														this.getSettledWagers(v.value)
													}
												}} >
												<View
													key={"btn" + i}
													style={this.state.dateRadio === v.value ? styles.active : styles.noactive}
												>
													{v.value != 4 ?

														<Text style={[this.state.dateRadio === v.value ? styles.textactive : styles.textnoactive, { textAlign: 'center' }]}>{v.text}</Text>
														: <View style={{ flexDirection: 'row', display: 'flex',justifyContent: 'center', alignItems: 'center' }}>
															<Text style={[this.state.dateRadio === v.value ? styles.textactive : styles.textnoactive, { textAlign: 'center', paddingRight: 5 }]}>{dateActive? moment(startDate).format('MM/DD') + '至' + moment(endDate || (new Date())).format('MM/DD'): v.text}</Text>
															{this.state.dateRadio === v.value ?
																<Image resizeMode="stretch" source={require('../../images/calendarhover.png')} style={{ width: 13, height: 14 }} />
																:
																<Image resizeMode="stretch" source={require('../../images/calendar.png')} style={{ width: 13, height: 14 }} />
															}
														</View>
													}
												</View>
											</Touch>
										</View>
									})}
								</View>
								<View style={{ flexDirection: 'row', paddingTop: 14 }}>
									<Text style={{ color: "#666" }}>总计 {this.state.settledWagersList.length} 单  </Text>
									<Text style={{ color: "#666", marginLeft: 15 }}>总投注额 : ￥{this.totalBetCurrency.toFixed(2)}</Text>
									<Text style={{ color: "#666", marginLeft: 15 }}>总输赢 : ￥{this.totalWinCurrency.toFixed(2)}</Text>
								</View>
							</View>
							{this.state.settledWagersList.length ? <View style={{ justifyContent: "center", alignItems: 'center', }}>


								{this.state.settledWagersList.map((val, key) => {
									return val.WagerType !== 2 ? <View style={{ backgroundColor: '#fff', marginTop: 10, width: width, borderRadius: 8 }}>
										<View style={{ justifyContent: "center", alignItems: 'center', backgroundColor: '#fff', paddingTop: 20, paddingBottom: 7, borderRadius: 8 }}>
											<TouchableOpacity onPress={() => {
												this.TocuhShowType(key);
											}}>
												<View style={{ flexDirection: 'row', width: width - 50, }}>
													<View style={{ flex: 1 }}>
														<View style={{ flexDirection: 'row' }}>
															<Text style={{fontSize: 16, color: '#000',  width: width * 0.6}}>{val.WagerItems[0].SelectionDesc}<Text style={{ color: '#00a6ff', fontSize: 18 }}> @{val.WagerItems[0].Odds}</Text></Text>
														</View>
														{val.WagerItems[0].LineDesc &&
															<View style={{ paddingTop: 5 }}>
																<Text style={{ color: '#BCBEC3', fontSize: 14 }}>{val.WagerItems[0].LineDesc}</Text>
															</View>
														}
													</View>
													<View style={{ width: 30, height: 30, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', top: -5, marginRight:10 }}>
														{
															(val.CashOutStatus == CashOutStatusType.DONE && val.CashOutAmount > 0)
																? <View style={CashOutStyles.cashoutResultBox}><Text style={CashOutStyles.cashoutResultBoxText}>兑现成功</Text></View>
																: this.renderSettledWagerStatus(val)
														}
														<View style={[styles.arrow, { top: -12 }]}></View>
													</View>
												</View>

											</TouchableOpacity>
										</View>
										<View style={nowShowType[key] == key ? styles.showContextNot : styles.hideContextNot}>
											{val.WagerItems.map(item => (
												<View key={item.EventId} style={{ paddingTop: 10, paddingBottom: 10 }}>
													<View>
														{val.WagerItems[0].IsOutRightEvent
															? <Text style={{ fontSize: 12, color: '#000' }}>{item.OutRightEventName}</Text>
															: <Text style={{ fontSize: 12, color: '#000' }}>{item.HomeTeamName} VS {item.AwayTeamName} {this.getWagerScore(item)}</Text>
														}
														<View>

														</View>
													</View>
													<Text style={{ color: '#BCBEC3', paddingTop: 5, fontSize: 12}}>{item.LeagueName}</Text>
													{
														item.IsRB &&
														<View style={styles.gameTmes}>
															<Image resizeMode='stretch' source={require('../../images/timeIcon.png')} style={{ width: 16, height: 16 }} />
															<Text style={{color: '#BCBEC3', fontSize: 12}}>
																{` ${item.RBPeriodName} ${item.RBMinute? item.RBMinute + "'": '-'} | ${item.RBHomeScore}-${item.RBAwayScore}`}
															</Text>
														</View>
													}
													{
														!item.IsRB &&
														<Text style={{ color: '#BCBEC3', paddingTop: 5, fontSize: 12 }}>开赛时间：{item.getEventDateMoment().format('MM/DD HH:mm')}</Text>
													}
													{
														item.GameResult ?
															<View style={{ alignItems: 'flex-end', marginTop: -16, right: 15 }}>
																<Text style={{ color: '#BCBEC3', paddingTop: 2, fontSize: 12 }}>赛果 {item.GameResult}</Text>
															</View>
															: null
													}
												</View>
											))}
											<View style={{ borderColor: '#dde0e6', borderTopWidth: 1, paddingTop: 10 }}>
												<View>
													<View style={styles.bettMoney}>
														<Text style={{ color: '#999', fontSize: 12 }}>投注额：<Text style={{ color: '#000', fontWeight: 'bold' }}>￥{val.BetAmount}</Text></Text>
														{
															(val.CashOutStatus == CashOutStatusType.DONE && val.CashOutAmount > 0)
																? <Text style={{color: '#999', fontSize: 12, paddingTop: 3}}>兑现金额：<Text style={{color: '#000', fontSize: 14,fontWeight: 'bold'}}>￥{val.CashOutAmount}</Text></Text>
																: <Text style={{color: '#999', fontSize: 12, paddingTop: 3}}>可赢金额：<Text style={{color: '#eb2121',fontSize: 14,fontWeight: 'bold'}}>￥{val.WinLossAmount}</Text></Text>
														}
													</View>
													<View>
														{val.FreeBetAmount > 0 ? <Text style={{ color: '#666', fontSize: 12 }}>免费投注：<Text style={{ color: '#000', fontWeight: 'bold' }}>￥{val.FreeBetAmount}</Text></Text> : null}
													</View>
												</View>
												<View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
													<View>
														<View style={{ flexDirection: 'row', paddingTop: 5 }}>
															<Text style={{ color: '#BCBEC3', fontSize: 12 }}>单号：</Text>
															<Text style={{ color: '#BCBEC3', fontSize: 12 }}>{val.WagerId}</Text>
															<View style={{ paddingLeft: 1 }}>
																<Touch onPress={() => { this.copy(val.WagerId) }}>
																	<Image
																		resizeMode="stretch"
																		source={require("../../../../images/icon/copy.png")}
																		style={{ width: 14, height: 14, marginLeft: 6 }}
																	/>
																</Touch>
															</View>
														</View>
														<Text style={{ color: '#BCBEC3', fontSize: 12, paddingTop: 3 }}>
															{val.getCreateTimeMoment().format('YYYY-MM-DD HH:mm:ss')}{val.OddsTypeName ? '(' + val.OddsTypeName + ')' : ''}
														</Text>
													</View>
													<Touch onPress={() => {
														this.openLiveChat(val.WagerId, val.WagerItems[0].EventDate);
														PiwikEvent('CS', 'Launch', 'LiveChat_BetRecord_SB2.0')
													}}>
														<View style={{ left: 5 }}>
															<Image resizeMode='stretch' source={require('../../images/cs.png')} style={{ width: 26, height: 26 }} />
														</View>
													</Touch>
												</View>
											</View>
										</View>
									</View> : <View style={{ backgroundColor: '#fff', marginTop: 10, width: width, borderRadius: 8 }}>
											<View style={{ justifyContent: "center", alignItems: 'center', backgroundColor: '#fff', paddingTop: 20, paddingBottom: 7, borderRadius: 8 }}>
												<TouchableOpacity onPress={() => {
													this.TocuhShowType(key);
												}}
													style={{ flexDirection: 'row' }}>
													<View style={{ flexDirection: 'row', width: width - 70,alignItems: 'center', justifyContent: 'flex-start' }}>
														<View>
															<Text style={{color: '#000', fontSize: 16}}>混合投注</Text>
														</View>
														<View style={{ paddingLeft: 10 }}>
															<Text style={{ fontSize: 12, color: '#666666' }}>{val.ComboTypeName} X {val.ComboCount} {val.Odds ? '@' + val.Odds : ''}</Text>
														</View>
														{
															val.HasComboBonus ?
															<Touch
																onPress={() => {
																	this.setState({
																		showComboBonusModal: true
																	});
																}} style={styles.gift}>
																<View style={styles.giftBg}>
																	<Image resizeMode='stretch' source={require('../../images/betting/orange.png')} style={{ width: 40, height: 28 }} />
																</View>
																<Text style={{ color: '#fff', fontSize: 12 }}>{val.ComboBonusPercentage}%</Text>
																<Image resizeMode='stretch' source={require('../../images/betting/gift.png')} style={{ width: 15, height: 15 }} />
															</Touch> : null
														}
													</View>
													<View style={{ width: 30, height: 30, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', top: -5 }}>
														{
															(val.CashOutStatus == CashOutStatusType.DONE && val.CashOutAmount > 0)
																? <View style={CashOutStyles.cashoutResultBox}><Text style={CashOutStyles.cashoutResultBoxText}>兑现成功</Text></View>
																: this.renderSettledWagerStatus(val)
														}
														<View style={[styles.arrow, { top: -12 }]}></View>
													</View>
												</TouchableOpacity>
											</View>



											<View style={nowShowType[key] == key ? styles.showContextNot : styles.hideContextNot}>
												<View>

													{val.WagerItems.map(item => {
														return <View style={{ paddingTop: 10, paddingBottom: 10, borderColor: '#dde0e6', borderBottomWidth: 1 }}>
															<View>
																<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
																	<Text style={{ fontSize: 14,color: '#000' }}>{item.SelectionDesc}<Text style={{ fontSize: 18, color: '#00a6ff' }}> @{item.Odds}</Text></Text>
																</View>
																<View>
																	<Text style={{ color: '#BCBEC3', fontSize: 12 }}>{item.LineDesc}</Text>
																</View>
															</View>

															<View style={{ paddingTop: 10 }}>
																{item.IsOutRightEvent
																	? <Text style={{ color: '#000', fontSize: 12 }}>{item.OutRightEventName}</Text>
																	: <Text style={{ color: '#000', fontSize: 12 }}>{item.HomeTeamName} VS {item.AwayTeamName} {this.getWagerScore(item)}</Text>
																}
															</View>
															<Text style={{ color: '#BCBEC3', paddingTop: 5, fontSize: 12 }}>{item.LeagueName}</Text>
															{
																item.IsRB &&
																<View style={styles.gameTmes}>
																	<Image resizeMode='stretch' source={require('../../images/timeIcon.png')} style={{ width: 16, height: 16 }} />
																	<Text style={{color: '#BCBEC3', fontSize: 12}}>
																		{` ${item.RBPeriodName} ${item.RBMinute? item.RBMinute + "'": '-'} | ${item.RBHomeScore}-${item.RBAwayScore}`}
																	</Text>
																</View>
															}
															{
																!item.IsRB &&
																<Text style={{ color: '#BCBEC3', paddingTop: 5, fontSize: 12 }}>开赛时间：{item.getEventDateMoment().format('MM/DD HH:mm')}</Text>
															}
															{
																item.GameResult ?
																	<View style={{ alignItems: 'flex-end', marginTop: -16, right: 15 }}>
																		<Text style={{ color: '#BCBEC3', paddingTop: 2, fontSize: 12 }}>赛果 {item.GameResult}</Text>
																	</View>
																	: null
															}

														</View>
													})}
												</View>

												<View style={{ paddingTop: 10 }}>
													<View>
														<View style={styles.bettMoney}>
															<Text style={{ color: '#999', fontSize: 12 }}>投注额：<Text style={{ color: '#000', fontWeight: 'bold' }}>￥{val.BetAmount}</Text></Text>
															{
																(val.CashOutStatus == CashOutStatusType.DONE && val.CashOutAmount > 0)
																	? <Text style={{color: '#999', fontSize: 12, paddingTop: 3}}>兑现金额：<Text style={{color: '#000',fontSize: 14,fontWeight: 'bold'}}>￥{val.CashOutAmount}</Text></Text>
																	: <Text style={{color: '#999', fontSize: 12, paddingTop: 3}}>可赢金额：<Text style={{color: '#eb2121',fontSize: 14,fontWeight: 'bold'}}>￥{val.WinLossAmount}</Text></Text>
															}
														</View>
														<View>
															{val.HasComboBonus && <Text style={{fontSize: 12, color: '#BCBEC3'}}>额外盈利：<Text style={{fontSize: 12, color: '#BCBEC3'}}>￥{Number(val.ComboBonusWinningsAmount).toFixed(2)}</Text></Text>}
															{val.FreeBetAmount > 0 && <Text style={{fontSize: 12, color: '#BCBEC3'}}>免费投注：<Text style={{fontSize: 12, color: '#BCBEC3'}}>￥{val.FreeBetAmount}</Text></Text>}
														</View>
													</View>
													<View>
														<View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
															<View style={{ paddingTop: 5, flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
																<View style={{ flexDirection: 'row' }}>
																	<Text style={{ color: '#BCBEC3', fontSize: 12 }}>单号：</Text>
																	<Text style={{ color: '#BCBEC3', fontSize: 12 }}>{val.WagerId}</Text>
																</View>
																<View style={{ paddingLeft: 2, paddingTop: 1 }}>
																	<Touch onPress={() => { this.copy(val.WagerId) }}>
																		<Image
																			resizeMode="stretch"
																			source={require("../../../../images/icon/copy.png")}
																			style={{ width: 14, height: 14, marginLeft: 6 }}
																		/>
																	</Touch>
																</View>
															</View>
															<Touch onPress={() => {
																this.openLiveChat(val.WagerId, val.WagerItems[0].EventDate);
																PiwikEvent('CS', 'Launch', 'LiveChat_BetRecord_SB2.0')
															}}>

																<View style={{ right: -15, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
																	<Image resizeMode='stretch' source={require('../../images/cs.png')} style={{ width: 26, height: 26, }} />
																</View>
															</Touch>
														</View>
														<Text style={{ color: '#BCBEC3', fontSize: 12 }}>
															{val.getCreateTimeMoment().format('YYYY-MM-DD HH:mm:ss')}{val.OddsTypeName ? '(' + val.OddsTypeName + ')' : ''}
														</Text>


													</View>
												</View>




											</View>
										</View>
								})}
							</View> : <View style={CashOutStyles.betRecordsEmpty}>
								<Image resizeMode='stretch' source={require('../../images/emptybox.png')} style={CashOutStyles.betRecordsEmptyImg} />
								<Text style={CashOutStyles.betRecordsEmptyText} >{ this.state.getSettledWagersHasError ? '查询失败，请点击标题重新查询' : '暂无记录'}</Text>
							</View>
							}
						</View>
					}



					<View style={{ height: 60 }}></View>



					<Modal transparent={true} animationType={'slide'} visible={this.state.visible4} onRequestClose={() => { }}>
						<View style={{ width, height, position: 'relative' }}>
							<View style={{ flex: 1 }}>
								<TouchableOpacity onPress={() => this.setState({ visible4: false })}>
									<View style={{ position: 'absolute', width, height, top: 0, left: 0, backgroundColor: 'rgba(0,0,0,.5)' }} />
								</TouchableOpacity>
							</View>
							{
								dataErr != '' &&
								<View style={styles.dataErr}>
									<View style={styles.dateErrCenter}>
										<Text style={{color: '#eb2121', fontSize: 13, lineHeight: 32}}>{dataErr}</Text>
									</View>
								</View>
							}
							<View style={{ height: Platform.OS == "ios"? 470: 520, width: width, backgroundColor: '#fff',justifyContent: 'center', alignItems: 'center' }}>

								<View style={{ paddingTop: 20, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>

									<View style={{ flex: 1, left: 18 }}>
										<TouchableOpacity onPress={() => this.setState({ visible4: false })}>
											<Text style={{ color: '#666666' }}>取消</Text>
										</TouchableOpacity>
									</View>

									<View style={{ flex: 1, color: '#000' }}><Text>选择日期</Text></View>
									<View style={{ flex: 0.3 }}>
										<TouchableOpacity onPress={() => this.dateChange()}>
											<Text style={{ color: '#00a6ff' }}>确认</Text>
										</TouchableOpacity>
									</View>
								</View>

								<View style={{ paddingTop: 20, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
									<View style={styles.textDateA}>
										<Text style={{ color: '#00a6ff', flex: 0.9, paddingLeft: 10,fontSize: 16  }}>从</Text>
										<Text style={{ color: '#00a6ff',fontSize: 16  }}>{moment(startDate).format('YYYY/MM/DD')} </Text>
									</View>

									<View style={{ width: 20 }}></View>
									<View style={styles.textDateB}>
										<Text style={{ color: '#000', flex: 0.9, paddingLeft: 10,fontSize: 16  }}>至</Text>
										<Text style={{ color: '#000', fontSize: 16 }}>{moment(endDate || (new Date())).format('YYYY/MM/DD')} </Text>
									</View>

								</View>

								<View style={{ flex: 1, backgroundColor: '#FFFFFF', }}>
									<CalendarPicker
										allowBackwardRangeSelect={false}
										// firstDay={0}
										selectedStartDate={moment(startDate).format('YYYY-MM-DD')}
										selectedEndDate={moment(endDate || (new Date())).format('YYYY-MM-DD')}
										allowRangeSelection={true}
										minDate={moment(minDate[0]).format('YYYY-MM-DD')}
										maxDate={moment(maxDate[0]).format('YYYY-MM-DD')}
										weekdays={['一', '二', '三', '四', '五', '六', '日']}
										months={['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']}
										previousTitle="＜"
										nextTitle="＞"
										previousTitleStyle={{color: '#000'}}
										nextTitleStyle={{color: '#000'}}
										selectedDayColor="#E6F6FF"
										selectedDayTextColor="#000"
										scaleFactor={375}
										textStyle={{
											fontFamily: 'Cochin',
											color: '#666',
										}}
										selectedRangeEndStyle={{
											backgroundColor: '#00A6FF',
										}}
										selectedRangeEndTextStyle={{
											color: '#fff'
										}}
										onDateChange={this.onDateChange}
										headerWrapperStyle={styles.headerWrapperStyle}
										monthYearHeaderWrapperStyle={styles.monthYear}
										dayLabelsWrapper={styles.dayLabelsWrapper}
									/>


								</View>
							</View>
						</View>
					</Modal>

					{
						this.state.showComboBonusModal &&
						<ComboBonusModal
							visible={this.state.showComboBonusModal}
							onClose={() => {
								this.setState({
									showComboBonusModal: false
								});
							}}
						/>
					}

					{/* 提前兌現 結果彈窗 */}
					<CashOutPopup
						wagerData={this.state.cashOutWagerDataForPopup}
						unlockWager={this.unlockWager}
						showSettledWagers={this.showSettledWagers}
						reloadWagers={this.reloadWagers}
						closePopup={this.closePopup}
					/>

				</ScrollView>
				{
					ScrollTop &&
					<View style={styles.goTop}>
						<Touch onPress={() => {
							this._ScrollTop && this._ScrollTop.scrollTo({ x: 0, y: 0 })
							this.setState({ScrollTop: false})
						}}>
							<Image resizeMode='stretch' source={require('../../images/goTop.png')} style={{width: 80,height: 80}} />
						</Touch>
					</View>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	maintenance: {
		color: '#000',
		borderColor: '#ffdf63',
		borderWidth: 1,
		padding: 3,
		borderRadius: 4,
		backgroundColor: '#ffdf63',
		marginLeft: 4,
		marginTop: 3,
		marginBottom: 3,
	},
	gameTmes: {
		paddingTop: 5,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
	},
	goTop: {
		position: 'absolute',
		bottom: 50,
		zIndex: 9999,
		right: 0,
	},
	dataErr: {
		display: 'flex',
		justifyContent: 'center',
		padding: 12,
		alignItems: 'center',
		flexDirection: 'row' ,
		position: 'absolute',
		top: 70,
		left: 0,
		width: width,
		zIndex: 999,
	},
	dateErrCenter: {
		backgroundColor: '#ffdada',
		borderRadius: 6,
		paddingLeft: 15,
		paddingRight: 15,
	},
	dayLabelsWrapper: {
		borderTopWidth: 0,
		borderBottomWidth: 0,

	},
	headerWrapperStyle: {
		backgroundColor: '#F8F8F8',
		paddingTop: 10,
		paddingBottom: 10,
		marginTop: 15,
		width: width - 30,
	},
	monthYear: {
		display: 'flex',
		flexDirection: 'row-reverse',
    },
	gift: {
        display: 'flex',
        justifyContent: 'space-around',
		paddingRight: 5,
        alignItems: 'center',
        flexDirection: 'row',
        width: 45,
        height: 28,
    },
    giftBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 75,
        height: 35,
    },
	textDateA: {
		borderColor: '#00a6ff', borderWidth: 1, borderRadius: 6, width: width / 2.3, paddingTop: 10, paddingBottom: 10, flexDirection: 'row',
		backgroundColor: '#E6F6FF',
	},
	textDateB: {
		borderColor: '#bcbec3', borderWidth: 1, borderRadius: 6, width: width / 2.3, paddingTop: 10, paddingBottom: 10, flexDirection: 'row'
	},
	win: {
		borderRadius: 50,
		backgroundColor: '#ffcfcf',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	lost: {
		borderRadius: 50,
		backgroundColor: '#c7f7d3',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	level: {
		borderRadius: 50,
		backgroundColor: '#ddd',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	Textwin: {
		padding: 8,
		color: '#eb2121',
		textAlign: 'center'
	},
	Textlost: {
		padding: 8,
		color: '#0ccc3c',
		textAlign: 'center'
	},
	Textlevel: {
		padding: 8,
		color: '#888',
		textAlign: 'center'
	},
	textactive: {
		color: '#00a6ff',
	},
	textnoactive: {
		color: '#666',
	},
	active: {

		paddingLeft: 15,
		paddingRight: 15,
		borderColor: '#00a6ff',
		height: 30,
		borderWidth: 1,
		borderRadius: 17,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	noactive: {
		paddingLeft: 15,
		paddingRight: 15,
		height: 30,
		borderColor: '#666',
		borderWidth: 1,
		borderRadius: 17,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	hideContext: {
		display: 'none',
		backgroundColor: '#fff', borderColor: '#EFEFF4', borderTopWidth: 1, paddingBottom: 10,
		height: 0,
	},
	showContext: {
		width: width - 50,
		backgroundColor: '#fff', borderColor: '#EFEFF4', borderTopWidth: 1, paddingBottom: 10
	},
	hideContextNot: {
		display: 'none',
		backgroundColor: '#fff', borderColor: '#EFEFF4', borderTopWidth: 1, paddingBottom: 10,
		height: 0,
	},
	showContextNot: {
		marginLeft: 25,
		width: width - 50,
		backgroundColor: '#fff', borderColor: '#EFEFF4', borderTopWidth: 1, paddingBottom: 10
	},
	bettMoney:{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'},
	Typs: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	TypsText: {
		textAlign: 'center',
		color: '#222',
		fontSize: 14,
	},
	TypsTextHover: {
		textAlign: 'center',
		color: '#222',
		fontWeight: 'bold',
		fontSize: 14,
		top: 1,
	},
	rootView: {
		flex: 1,
		backgroundColor: "#efeff4",
	},
	webViewStyle: {
		flex: 1,
		backgroundColor: "#fff",
		borderWidth: 0
	},
	topNav: {
		width: width,
		height: 50,
		backgroundColor: '#00a6ff',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		position: 'relative',
		zIndex: 99999999,
	},
	btnType: {
		backgroundColor: '#0A92E0',
		borderRadius: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	btnList: {
		width: 88,
		backgroundColor: '#00A6FF',
		borderRadius: 50,
		flexDirection:'row',
		flexWrap:'wrap',
		alignItems: 'center',
		justifyContent: 'center',
	},
	btnTxt: {
		textAlign: 'center',
		lineHeight: 32,
	},
	arrow: {
		top: -5,
		left: 8,
		width: 10,
		height: 10,
		borderColor: '#999',
		borderRightWidth: 2,
		borderBottomWidth: 2,
		transform: [{ rotate: '45deg' }],
	},
	arrows: {
		top: 0,
		left: 8,
		width: 10,
		height: 10,
		borderColor: '#999',
		borderLeftWidth: 2,
		borderTopWidth: 2,
		transform: [{ rotate: '45deg' }],
	},
});

const mapStateToProps = state => ({
	userInfo: state.userInfo,
	maintainStatus: state.maintainStatus,
});

export default connect(
	mapStateToProps,
	null,
)(BetRecord)
