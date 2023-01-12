/*
	投注页面 导航菜单  所有游戏种类
*/


import {
	StyleSheet,
	WebView,
	Text,
	View,
	Animated,
	TouchableOpacity,
	Dimensions,
	Image,
	NativeModules,
	ScrollView,
	ImageBackground,
	Platform,
	TextInput,
	KeyboardAvoidingView,
} from "react-native";
import SnapCarousel, {
	ParallaxImage,
	Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import React from 'react'
import moment from 'moment';
import { VendorMarkets } from "../../lib/vendor/data/VendorConsts";
import Bottomtime from '../Footer/bottomtime';
import { connect } from "react-redux";
import getSportIcon from "../../lib/js/getSportIcon";

const theDayAfterTenDays = moment().add(10, 'days').format('YYYY-MM-DD');
const theDaytoday = moment().format('YYYY-MM-DD');

class Bettingnav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isExpandAll: true, //默認全展開
			SportId: this.props.BetType ? this.props.BetType.SportId : 1,
			// MarketId: VendorMarkets.RUNNING, //默認選3滾球，數據比較少
			MarketId: this.props.BetType ? this.props.BetType.MarketId : VendorMarkets.RUNNING, //默認選 滾球
			SortWay: this.props.BetType ? this.props.BetType.SortWay : 1 /*排序 1联赛 2时间 0不指定排序  */,
			Selectdate: theDayAfterTenDays,
			currentMenu: null,
			navBarFreeze: false,
			menuName: '',
			GuideTop: 0,
			GuideLeft: 0,
		};
	}

	componentDidMount() {
		this.props.NavRef && this.props.NavRef(this);

		// const {query} = this.props.router; //從鏈接獲取要加載的參數

		// if(!(JSON.stringify(query) === "{}" || !query)) {
		// 	//有傳入參數
		// 	const {SportId,MarketId,SortWay,Selectdate} = this.state;
		// 	let cloneQuery = Object.assign({SportId,MarketId,SortWay},query);

		// 	//處理一下數據格式，要用int型態
		// 	cloneQuery.SportId = parseInt(cloneQuery.SportId);
		// 	cloneQuery.MarketId = parseInt(cloneQuery.MarketId);
		// 	cloneQuery.SortWay = parseInt(cloneQuery.SortWay);

		// 	//特別處理日期，實際上只會選一天
		// 	cloneQuery.Selectdate = query.EndDate ?? Selectdate;

		// 	//從路由更新 下拉菜單 選中項目
		// 	this.setState({ SportId:cloneQuery.SportId, MarketId: cloneQuery.MarketId, SortWay: cloneQuery.SortWay, Selectdate: cloneQuery.Selectdate })

		// 	//更新banner
		// 	this.props.MenuChange(cloneQuery.SportId);
		// }

		//處理捲動時，navbar固定在上方
		// const handleScroll = (topOffset = 0) => {
		// 	const bettingList = document.getElementById("Betting-list");

		// 	if (this.navRef.current && bettingList) {
		// 		const lgbcr = this.navRef.current.getBoundingClientRect(); //玩法組橫條
		// 		var lgbcr_height = lgbcr.height||(lgbcr.bottom - lgbcr.top); //相容ie
		// 		const lcbcr = bettingList.getBoundingClientRect(); //玩法列表

		// 		//凍結的條件： 玩法列表的top 小於等於  天花板 +玩法組的height)
		// 		//注意上面有header(topOffset)
		// 		const freeze = lcbcr.top <= lgbcr_height + topOffset;
		// 		//console.log('===',freeze,lcbcr.top,'<=',lgbcr_height + topOffset,lgbcr_height);
		// 		if (this.state.navBarFreeze !== freeze) { //減少觸發render次數
		// 			this.setState({navBarFreeze: freeze});
		// 		}
		// 	} else {
		// 		//console.log('===navRefs not FOUND');
		// 	}
		// }

		// const headerBar = document.getElementById("header-bar");
		// let topOffset = 0;
		// if(headerBar) {
		// 	topOffset = headerBar.clientHeight;
		// }

		// this.handleScrollForNavbar = () => handleScroll(topOffset);

		// window.addEventListener("scroll", this.handleScrollForNavbar);
	}

	componentWillUnmount() {
		// if (this.handleScrollForNavbar) {
		// 	window.removeEventListener("scroll", this.handleScrollForNavbar)
		// }
	}

	clickSport = (sportData) => {
		const sportId = sportData.SportId;
		// console.log('sportIdsportIdsportId', sportId)
		this.setState(
			{
				SportId: sportId,
				menuName: '',
			},
			() => {
				this.ChangeGame();
				this.props.MenuChange(sportId); //banner刷新
			}
		);
	}
	clickMarket = (marketData) => {
		const marketId = marketData.MarketId;
		this.setState(
			{
				menuName: '',
				MarketId: marketId
			},
			() => {
				this.ChangeGame();
			}
		);
	}

	/* 选择游戏 */
	ChangeGame = (date) => {
		const { SportId, MarketId, SortWay } = this.state;
		let StartDate = date ? moment(new Date(date)).format('YYYY-MM-DD') : theDaytoday; /* 今天 */
		let EndDate = date ? moment(new Date(date)).format('YYYY-MM-DD') : theDayAfterTenDays; /* 10天後 */
		const type = {
			SportId: SportId /* 体育类型 */,
			MarketId: MarketId /* 市场类型 */,
			SortWay: SortWay /* 排序 */,
			StartDate: StartDate /* 开始日期 */,
			EndDate: EndDate /* 结束日期 */
		};
		this.props.GetEvents(type);
		this.setState({
			Selectdate: date,
			isExpandAll: true, //選擇變化之後  要重置(全展開)
		}, () => {
			this.props.onToggleButtonClicked(true)
		});
		PiwikEvent('Odds_Filter', 'Click', 'MainPage_ViewMore')
	};

	changeToggleButtonStatus = (isExpandAll) => {
		this.setState({ isExpandAll });
	}
	changeSelect() {
		this.setState(prevState => {
			if (prevState.SortWay == 1) {
				return {SortWay: 2}
			} else {
				return {SortWay: 1}
			}
		}, () => {
			this.ChangeGame();
		})
	}

	getGuide = (e) => {
		NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
			this.setState({
				GuideTop: py,
				GuideLeft: px,
			});
		});
	}
	getGuideReturn() {
		const {GuideTop,GuideLeft} = this.state;
		return {GuideTop,GuideLeft}
	}
	render() {
		const { SportId, MarketId, Selectdate, menuName, SortWay, isExpandAll } = this.state;
		const { Vendor, SportDatas, Loading } = this.props;
		const VendorName = Vendor.configs.VendorName;
		let selectedSport, selectedMarket;
		if (SportDatas) {
			const targetSports = SportDatas.filter(s => parseInt(s.SportId) === parseInt(SportId));
			if (targetSports && targetSports.length > 0) {
				selectedSport = targetSports[0];
			} else {
				selectedSport = SportDatas[0]; //找不到就默認用第一個
			}
			if (selectedSport) {
				const targetMarkets = selectedSport.Markets.filter(m => parseInt(m.MarketId) === parseInt(MarketId));
				if (targetMarkets && targetMarkets.length > 0) {
					selectedMarket = targetMarkets[0];
				}
			}
		}

		const MarketDatas = selectedSport?selectedSport.Markets:[];

		//只有足球和世界杯有波膽切換，另外足球的猜冠軍也沒有波膽切換
		const HasCorrectScore = selectedSport && ([1,2022].indexOf(parseInt(selectedSport.SportId)) !== -1) && selectedMarket && (parseInt(selectedMarket.MarketId) !== 5);
		// console.log(SportDatas)
		// console.log(SportId, 'selectedSportselectedSport', SportDatas)
		return (
			<View>
				{SportDatas.length > 0 &&
					<View>
						<View style={styles.nav}>
							<ScrollView
								horizontal={true}
								style={styles.SportTabs}
								showsHorizontalScrollIndicator={false}
								showsVerticalScrollIndicator={false}
							>
								{ SportDatas.map(item => {
									if (item.SportId != "2022" && item.Count <= 0) {
										return null; //If there is no available odd, just hide the sport icon
									}

									const sportIsSelected = (selectedSport && (selectedSport.SportId === item.SportId));

									const sportIcon = getSportIcon(VendorName, item.SportId, sportIsSelected);
									return <>
										{
											(item.SportId == "2022") ? this.props.event.worldCupTabOpen ? (
												<ImageBackground style={[styles.SportWorldCupTab, sportIsSelected ? styles.SportTabSelected : {}]} key={item.SportId} source={require("../../../../images/worldCup/sbTabBG.png")}>
													<View style={{
														position: 'absolute',
														top: 0,
														right: 0,
														borderBottomLeftRadius: 8,
														borderTopRightRadius: 4,
														width: 15,
														height: 15,
														backgroundColor: "#FFD139",
														justifyContent: 'center',
														alignItems: 'center'}}>
														<Text style={{color: "#222222", fontSize: 9}}>热</Text>
													</View>
													<Touch
														onPress={() => this.clickSport(item)}
													>
														<Image resizeMode='stretch' source={require("../../../../images/worldCup/sbTabIcon.png")} style={{ width: 28, height: 28, marginBottom: 2 }} />
														<Text style={[styles.SportTabText,, (sportIsSelected ? styles.SportTabTextSelected : {})]}>{item.SportName}</Text>
													</Touch>
												</ImageBackground>
											):null:(
												<Touch
													key={item.SportId}
													style={[styles.SportTab, (sportIsSelected ? styles.SportTabSelected : {})]}
													onPress={() => this.clickSport(item)}
												>
													<Text style={[styles.SportTabText,styles.SportTabTextCount, (sportIsSelected ? styles.SportTabTextCountSelected : {})]}>{item.Count}</Text>
													<Image resizeMode='stretch' source={sportIcon} style={{ width: 20, height: 20, marginBottom: 2 }} />
													<Text style={[styles.SportTabText,, (sportIsSelected ? styles.SportTabTextSelected : {})]}>{item.SportName}</Text>
												</Touch>
											)
										}
									</>
								})}
							</ScrollView>
							<View style={styles.MarketTabs}>
								{ MarketDatas.map(item => {
									const marketIsSelected = (selectedMarket && (selectedMarket.MarketId === item.MarketId));
									return <Touch
										key={item.MarketId}
										style={[styles.MarketTab, marketIsSelected ? styles.MarketTabSelected : {}]}
										onPress={() => this.clickMarket(item)}
									>
										<View style={[styles.MarketTabInnerWrap, marketIsSelected ? styles.MarketTabSelectedInnerWrap : {}]}>
											{/*Text在IOS不能正確處理borderBottom，所以在外面再包一層view*/}
											<Text style={[styles.MarketTabText, marketIsSelected ? styles.MarketTabSelectedText : {}]}>
												{item.MarketName + ' ' + item.Count}
											</Text>
										</View>
									</Touch>
								})}
							</View>
							<View style={styles.Divider}>
								<View style={styles.InnerDivider}/>
							</View>
							<View style={styles.ButtonBox}>
								<View style={styles.LeftBox}>
									{HasCorrectScore ? <>
										<Touch
											onPress={() => this.props.ToggleShowCorrectScore(false)}
											style={[styles.LeftBoxButton, (this.props.ShowCorrectScore ? {} : styles.LeftBoxButtonSelected)]}
										>
											<Text style={[styles.LeftBoxButtonText ,  (this.props.ShowCorrectScore ? {} : styles.LeftBoxButtonTextSelected)]}>
												{ parseInt(this.props.userSetting.ListDisplayType) === 1 ? "主要市场" : "全场让球"}
											</Text>
										</Touch>
										<Touch
											onPress={() => this.props.ToggleShowCorrectScore(true)}
											style={[styles.LeftBoxButton, (this.props.ShowCorrectScore ? styles.LeftBoxButtonSelected : {})]}
										>
											<Text style={[styles.LeftBoxButtonText, (this.props.ShowCorrectScore ? styles.LeftBoxButtonTextSelected : {})]}>全场波胆</Text>
										</Touch>
									</> : null}
								</View>
								<View style={styles.RightBox}>
									<Touch style={styles.btnType} onPress={() => { this.changeSelect() }}>
										<View style={[styles.btnList, { backgroundColor: SortWay == 1 ? '#00A6FF' : 'transparent' }]}>
											<Text style={[styles.btnTxt, { color: SortWay == 1 ? '#fff' : '#666666', fontWeight:  SortWay == 1 ? '600' : '400' }]}>联赛</Text>
										</View>
										<View style={[styles.btnList, { backgroundColor: SortWay == 2 ? '#00A6FF' : 'transparent' }]}>
											<Text style={[styles.btnTxt, { color: SortWay == 2 ? '#fff' : '#666666', fontWeight:  SortWay == 2 ? '600' : '400' }]}>时间</Text>
										</View>
									</Touch>
									<Touch style={{ marginLeft: 12, backgroundColor: '#EFEFF4', borderRadius: 50, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
										this.setState({
											isExpandAll: !this.state.isExpandAll
										}, () => {
											this.props.onToggleButtonClicked(this.state.isExpandAll)
										});
									}}>
										<Image resizeMode='stretch' source={isExpandAll? require('../../images/all-up.png'): require('../../images/all-down.png')} style={{ width: 16, height: 16 }} />
									</Touch>
								</View>
							</View>
						</View>
						{/* 日期动作面板 */}
						{selectedMarket && parseInt(selectedMarket.MarketId) === VendorMarkets.EARLY  //早盤才可以選日期
						&& parseInt(selectedSport.SportId) !== 2022 //世界杯的早盤不用選日期
							&& !Loading && (
								<Bottomtime ChangeGame={(e) => this.ChangeGame(e)} Selectdate={Selectdate} SportId={SportId} />
							)}
					</View>
				}
			</View>
		);
	}
}

const mapStateToProps = state => ({
	userSetting: state.userSetting,
	event: state.event
});

export default connect(mapStateToProps, null)(Bettingnav);


const styles = StyleSheet.create({
	nav: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'column',
		paddingLeft: 0,
		paddingRight: 0,
		// borderBottomColor: '#ccc',
		// borderBottomWidth: 1,
		backgroundColor: '#efeff4',
		height: 136,
	},
	btnType: {
		backgroundColor: '#EFEFF4',
		borderRadius: 40,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		height: 25,
	},
	btnList: {
		width: 36,
		height: 25,
		backgroundColor: '#00A6FF',
		borderRadius: 40,
	},
	btnTxt: {
		textAlign: 'center',
		lineHeight: 25,
		fontSize: 10,
	},
	menuList: {
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		height: 55,
		paddingTop: 10,
	},
	SportTabs: {
		width: '100%',
		height: 56,
		flexWrap: 'nowrap',
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: '#EFEFF4',
		// overflow-y: 'scroll',
		// -ms-overflow-style: none;  /* IE and Edge */
		// scrollbar-width: none;  /* Firefox */
		/* Hide scrollbar for Chrome, Safari and Opera */
		// &::-webkit-scrollbar {
		// 		display: none;
		// 	}
	},
	SportTab: {
		minWidth: 56,
		height: 56,
		flexShrink: 0,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 13,
	},
	SportWorldCupTab: {
		minWidth: 56,
		height: 56,
		flexShrink: 0,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 5,
	},
	SportTabSelected: {
		backgroundColor: '#FFFFFF',
		color: '#222222',
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
	},
	SportTabText: {
		fontSize: 10,
		lineHeight: 14,
	},
	SportTabTextSelected: {
		color: '#222222',
		fontWeight: '600',
	},
	SportTabTextCount: {
		position: 'absolute',
		top:2,
		right: 2,
	},
	SportTabTextCountSelected: {
		color: '#222222',
	},
	MarketTabs: {
		width: '100%',
		height: 34,
		overflow: 'hidden',
		flexWrap: 'nowrap',
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: '#FFFFFF',
		color: '#666666',
	},
	MarketTab: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 0,
	},
	MarketTabInnerWrap: {
		//padding: '9 0 8 0'
		paddingTop: 9,
		paddingBottom: 8,
		paddingHorizontal: 4,
	},
	MarketTabText: {
		fontSize: 12,
		lineHeight: 17,
		color: '#666666',
	},
	MarketTabSelected: {

	},
	MarketTabSelectedInnerWrap: {
		//padding: '9 0 5 0',
		paddingTop: 9,
		paddingBottom: 5,
		//border-bottom: 3px solid #00A6FF,
		borderBottomWidth: 3,
		borderBottomColor: '#00A6FF',
		borderStyle: 'solid',
	},
	MarketTabSelectedText: {
		color: '#222222',
		fontWeight: '600',
	},
	Divider: {
		width: '100%',
		height: 1,
		backgroundColor: '#FFFFFF',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 14,
	},
	InnerDivider: {
		height: 1,
		flex:1,
		backgroundColor: '#EFEFF4',
	},
	ButtonBox: {
		width: '100%',
		height: 46,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		color: '#666666',
		paddingLeft: 4,
		paddingRight: 12,
	},
	LeftBox: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	LeftBoxButton: {
		width: 76,
		height: 25,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#EFEFF4',
		borderRadius: 40,
		marginLeft: 4,
	},
	LeftBoxButtonSelected: {
		color: '#FFFFFF',
		backgroundColor: '#00A6FF',
	},
	LeftBoxButtonText: {
		fontSize: 12,
		lineHeight: 25,
		color: '#666666',
	},
	LeftBoxButtonTextSelected: {
		color: '#FFFFFF',
		fontWeight: '600',
	},
	RightBox: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	// .Switchcontainer {
	// 	.Game-switch-text {
	// 			background-color: #EFEFF4;
	// 		}
	// 	}
	// }
	}
});
