// import { ReactSVG } from '@/ReactSVG';
// import Router from 'next/router';
// import LazyImageForTeam from "@/LazyLoad/LazyImageForTeam";
import { VendorMarkets } from "../../lib/vendor/data/VendorConsts";
// import { getStyle } from "$LIB/js/Helper";
import { connect } from "react-redux";
// import { Textfit } from 'react-textfit';
// import VideoPlayer from './Player';
import Video from 'react-native-video';
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
import WebViewIOS from "react-native-webview";
import React from "react";
import ImageForTeam from "../RNImage/ImageForTeam";

class DetailHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showType: this.props.defaultShowType ? parseInt(this.props.defaultShowType) : 0, // 0: 主Header  1: 视频  2: 动画  3: 分析
			src: null,
			isFullScreenSlider: false,
			isLandscape: false,
			showScaleIcon: false,
			fixedStatus: this.props.fixedStatus,
		}

		this.toggleMainPage = this.toggleMainPage.bind(this);
		this.isLandscape = this.isLandscape.bind(this);
		this.detailBannerRef = React.createRef();
	}
	componentDidMount() {
		//this.setState({ src: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8" }); 不使用默認的影片

		// if (this.props.setRef) { //注意miniEvent沒有帶這個ref 只有詳情頁有
		// 	this.props.setRef(this.detailBannerRef); //不知道為啥配置不上，只能在這裏再手工配置一次
		// }

		// if (!this.props.thumbStatus) {
		// 	this.isLandscape();
		// 	window.addEventListener('resize', this.isLandscape);
		// 	window.addEventListener('orientationchange', this.isLandscape); //嘗試解決IOS問題
		// 	(document.fullscreenElement ||
		// 		document.msFullscreenElement ||
		// 		document.mozFullScreenElement ||
		// 		document.webkitFullscreenElement ||
		// 		false) && this.setState({ showScaleIcon: true });
		// }
	}
	componentWillUnmount() {
		// if (!this.props.thumbStatus) {
		// 	window.removeEventListener('resize', this.isLandscape);
		// 	window.removeEventListener('orientationchange', this.isLandscape); //嘗試解決IOS問題
		// }
	}

	isLandscape() {
		// if (getStyle(document.getElementById("betting_list_detail"), "position") !== "fixed") {
		//     this.props.handle.exit()
		//     this.props.setIsLandscape(false);
		//     this.setState({
		//         isFullScreenSlider: false,
		//         isLandscape: false
		//     });
		//     document.querySelector(".Betting-type").style = "";
		//     document.querySelector(".Betting-detail-header").style = "";
		//     document.querySelector(".Detail-menu").style = "";
		//     document.querySelector(".Collapselist").style = "";
		// } else {
		//     this.props.setFixed(false);
		//     this.props.setIsLandscape(true);
		//     this.setState({ isLandscape: true });
		// }
	}
	toggleMainPage() {
		// if (getStyle(document.getElementById("betting_list_detail"), "position") === "fixed") {
		//     let width = parseInt(getStyle(document.getElementById("__next"), "width")), widthProportion = width * 0.6;
		//     if (this.state.isFullScreenSlider) {
		//         this.setState({ isFullScreenSlider: false });
		//         document.querySelector(".Betting-type").style = "width:" + width + "px;";
		//         document.querySelector(".Betting-detail-header").style = "transform:translateX(" + width + "px);";
		//         document.querySelector(".Detail-menu").style = "transform:translateX(" + width + "px);";
		//         document.querySelector(".Collapselist").style = "transform:translateX(" + width + "px);";
		//     } else {
		//         this.setState({ isFullScreenSlider: true });
		//         document.querySelector(".Betting-type").style = "width:" + widthProportion + "px;";
		//         document.querySelector(".Betting-detail-header").style = "transform:translateX(" + widthProportion + "px);";
		//         document.querySelector(".Detail-menu").style = "transform:translateX(" + widthProportion + "px);";
		//         document.querySelector(".Collapselist").style = "transform:translateX(" + widthProportion + "px);";
		//     }
		// }
	}

	backToListWithMinifyWindow() {
		//默認使用routerFilter存下的主頁面查詢參數
		// const { Vendor, routerLog, EventData } = this.props;

		// let query = null;
		// let log = routerLog[Vendor.configs.VendorPage];
		// if (log && log.query) {
		// 	query = log.query;
		// }
		// //console.log('===back and minify',JSON.parse(JSON.stringify(query)));

		// if (query === null) {
		// 	query = {};
		// 	//整頁刷新就會拿不到來源，使用當前的EventData做為參考
		// 	if (EventData) {
		// 		query.SportId = EventData.SportId;
		// 		query.MarketId = EventData.MarketId;
		// 		//早盤需要指定日期
		// 		if (parseInt(EventData.MarketId) === VendorMarkets.EARLY) {
		// 			const targetDate = EventData.getEventDateMoment().format('YYYY-MM-DD');
		// 			query.StartDate = targetDate;
		// 			query.EndDate = targetDate;
		// 		}
		// 	}
		// }

		// //加上要展示的賽事信息
		// if (EventData) {
		// 	query.miniEventId = EventData.EventId;
		// 	query.miniSportId = EventData.SportId;
		// 	query.miniLeagueId = EventData.LeagueId;
		// 	query.miniShowType = this.state.showType;
		// }

		// Router.push({
		//     pathname: Vendor.configs.VendorPage,
		//     query: query
		// });
	}



	/* 设置全屏投注样式 */
	// FullScreenstyle=()=>{
	//     document.body.style.overflow='hidden'
	// }
	render() {
		const { EventData, Vendor, headerWidth, headerHeight, isLandscape, isLandscapeShow, MiniEvent } = this.props;

		let width = isLandscapeShow && isLandscape ? headerWidth * 0.6 : headerWidth
		let height = headerHeight
		console.log(height, 'heightheightheightheightheight', width)
		const htmls = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge "><meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no"><title>Document</title></head><body style="background-color: #000;overflow: hidden;">`
		return (
			// <View className={'Betting-type' + ' Betting-type-' + this.state.showType} ref={this.detailBannerRef}>
			<View style={[MiniEvent ? styles.MiniEvent : styles.noMiniEvent]}>
				<ImageBackground
					style={
						[
							{ width: width, height: height, display: 'flex', justifyContent: 'center', alignItems: 'center' },
							MiniEvent ? { position: 'absolute', top: 0, left: 0 } : {}
						]
					}
					resizeMode="stretch"
					source={this.props.EuroCupBet ? require("../../images/euroCup/bannerBg.png"): require("../../images/betting/pkbg.png")}
				>
					{
						!this.props.thumbStatus && (
							<View style={[styles.Betting_header, { width: width }]}>
								<Touch
									onPress={() => {
										PiwikEvent('Match_Feature', 'Click', 'Match_minimize')
										this.props.backToListWithMinifyWindow(true, this.state.showType);
									}}
									style={{ padding: 5, paddingRight: 30 }}
								>
									<Image resizeMode='stretch' source={require('../../images/betting/down.png')} style={{ width: 20, height: 20 }} />
								</Touch>
								{this.state.showType !== 0 ?
									<Touch
										onPress={() => {
											this.props.setDefaultShowType(0)
											this.setState({ showType: 0 });
											//關閉視頻播放
											// if (this.state.showType === 1 && this.player) {
											// 	this.player.pause();
											// }
										}}
										style={{paddingRight: DeviceInfoIos? 20:0}}
									>
										<Image resizeMode='stretch' source={require('../../images/closeWhite.png')} style={{ width: 20, height: 20 }} />
									</Touch>
									: <Text style={{ color: 'transparent' }}>1</Text>}
							</View>
						)
					}
					<View style={[styles.Betting_header, { width: this.props.headerWidth }]}>
						{
							// this.props.thumbStatus ? null :
							// 	<View>
							// 		{/* 縮小按鈕 */}
							// 		{/* <ReactSVG
							//             src="/svg/betting/down_arrow.svg"
							//             className="bet-arrow-icon"
							//             onClick={() => {
							//                 this.backToListWithMinifyWindow();
							//             }}
							//         /> */}
							// 		<Touch
							// 			onPress={() => {
							// 				this.backToListWithMinifyWindow();
							// 			}}
							// 		>
							// 			<Image resizeMode='stretch' source={require('../../images/betting/down.png')} style={{ width: 28, height: 28 }} />
							// 		</Touch>
							// 		{/* 關閉按鈕 */}
							// 		{/* {this.state.showType !== 0 ? <ReactSVG
							// 			src="/svg/close.svg"
							// 			className="live-close-icon"
							// 			onClick={() => {
							// 				this.setState({ showType: 0 });
							// 				//關閉視頻播放
							// 				if (this.state.showType === 1 && this.player) {
							// 					this.player.pause();
							// 				}
							// 			}}
							// 		/> : null} */}
							// 		{this.state.showType !== 0 ?
							// 			<Touch
							// 				onPress={() => {
							// 					this.backToListWithMinifyWindow();
							// 				}}
							// 			>
							// 				<Image resizeMode='stretch' source={require('../../images/closeWhite.png')} style={{ width: 28, height: 28 }} />
							// 			</Touch>
							// 			: <Text style={{ color: 'transparent' }}>1</Text>}
							// 	</View>
						}
					</View>
					{this.state.showType === 0 ? <View style={{ height: height, display: 'flex', justifyContent: 'center', alignItems: 'center', width: width }}>
						<View style={[styles.Betting_header_score, { width: width }]}>
							<View style={[styles.itemTimes, { width: width * 0.3 }]}>
								{/* <LazyImageForTeam Vendor={Vendor} TeamId={EventData.HomeTeamId} /> */}
								<ImageForTeam TeamId={EventData.HomeTeamId} Vendor={Vendor} IconUrl={EventData.HomeIconUrl} imgSize={48} />
								<Text style={{ color: '#fff', width: width * 0.3, textAlign: 'center', fontSize:12, lineHeight:17, marginTop: 12 }}  >{EventData.HomeTeamName}</Text>
								{
									(EventData.IsRB && EventData.HomeRedCard && parseInt(EventData.HomeRedCard) > 0) ?
										<View style={{ backgroundColor: 'red', borderRadius: 5, padding: 2, marginTop: 4 }}>
											<Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{EventData.HomeRedCard}</Text>
										</View>
										: <View style={{ height: 20, width: 20, padding: 2, marginTop: 4}} />
								}
							</View>
							<View >
								{
									EventData.IsRB ? <View style={styles.itemCenter}>
										<View style={styles.Game_info}>
											<Text style={{ color: EventData.HomeScore > 0 ? '#fff' : '#c8bfbe', fontSize: 36, lineHeight: 50 }}>{EventData.HomeScore}</Text>
											<Text style={{ color: '#fff', paddingHorizontal: 16, fontSize: 40 }}>-</Text>
											<Text style={{ color: EventData.AwayScore > 0 ? '#fff' : '#c8bfbe', fontSize: 36, lineHeight: 50 }}>{EventData.AwayScore}</Text>
										</View>
										{
											EventData.RBMinute > 0 &&
											<View style={styles.dateFen}>
												<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}> {EventData.RBMinute}' </Text>
											</View>
										}
										{
											EventData.HasCornerData &&
											<View style={{display: 'flex',flexDirection: 'row',justifyContent: 'center',alignItems: 'center', marginTop: 14}}>
												{/* <img src="/svg/betting/red-j.svg" className="REDSVG" /> */}
												<Image resizeMode='stretch' source={require('../../images/betting/red-j.png')} style={{ width: 20, height: 20 }} />
												<Text style={{ fontSize: 12, color: '#FFFFFF' }}>{EventData.HomeCorner ?? 0}-{EventData.AwayCorner ?? 0}</Text>
											</View>
										}
									</View>
										: <View style={styles.noGame_info}>
											<Text style={{ color: '#fff' }}>{EventData.getEventDateMoment().format('MM/DD HH:mm')}</Text>
											<Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 36, fontWeight: 'bold' }}>VS</Text>
											<Text style={{ color: '#fff' }}>未开始</Text>
										</View>
								}
							</View>
							<View style={[styles.itemTimes, { width: width * 0.3 }]}>
								{/* <LazyImageForTeam Vendor={Vendor} TeamId={EventData.AwayTeamId} /> */}
								<ImageForTeam TeamId={EventData.AwayTeamId} Vendor={Vendor} IconUrl={EventData.AwayIconUrl} imgSize={48} />
								<Text style={{ color: '#fff', width: width * 0.3, textAlign: 'center', fontSize:12, lineHeight:17, marginTop: 12 }}  >{EventData.AwayTeamName}</Text>
								{
									(EventData.IsRB && EventData.AwayRedCard && parseInt(EventData.AwayRedCard) > 0) ?
										<View style={{ backgroundColor: 'red', borderRadius: 5, padding: 2, marginTop: 4 }}>
											<Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{EventData.AwayRedCard}</Text>
										</View>
										: <View style={{ height: 20, width: 20, padding: 2, marginTop: 4}} />
								}
							</View>
						</View>
						<View style={styles.Footer_menu}>
							{
								EventData.HasLiveStreaming ?
									<Touch
										style={{ minWidth: 50, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
										onPress={() => {
										if (global.localStorage.getItem('loginStatus') != 1) {
											window.openOrientation && window.openOrientation()
											Actions.Login({ from: 'Betting-detail' })
											return
										}
										PiwikEvent('Match_Feature', 'View', 'Match_livestream')
										// this.player.play();
										this.props.setDefaultShowType(1)
										this.setState({ showType: 1 });
									}}>
										<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>视频</Text>
									</Touch>
									: null
							}
							{
								EventData.HasLiveStreaming && EventData.HasVisualization &&
								<View style={{ width: 1, height: 20, backgroundColor: '#999', marginLeft: 10, marginRight: 10 }} />
							}
							{
								EventData.HasVisualization ?
									<Touch
										style={{ minWidth: 50, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
										onPress={() => {
										if (global.localStorage.getItem('loginStatus') != 1) {
											window.openOrientation && window.openOrientation()
											Actions.Login({ from: 'Betting-detail' })
											return
										}
										PiwikEvent('Match_Feature', 'View', 'Match_animation')
										this.props.setDefaultShowType(2)
										this.setState({ showType: 2 });
									}}>
										<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>动画</Text>
									</Touch>
									: null
							}
							{
								EventData.HasStatistic ?
									<Touch
										style={{ minWidth: 50, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
										onPress={() => {
										//this.setState({showType: 3});
										if (global.localStorage.getItem('loginStatus') != 1) {
											window.openOrientation && window.openOrientation()
											Actions.Login({ from: 'Betting-detail' })
											return
										}
										PiwikEvent('Match_Feature', 'View', 'Match_stats')
										Toasts.info("暂未开放！")
									}}>
										<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>数据</Text>
									</Touch>
									: null
							}
							{
								!EventData.HasLiveStreaming && !EventData.HasVisualization && !EventData.HasStatistic &&
								<Text style={{ color: '#bcbec3', fontSize: 12, fontWeight: '600' }}>暂无视频/动画/数据</Text>
							}
						</View>
					</View> : null}
					<View style={styles.Bettingfotter}>
						{
							this.props.thumbStatus ? null : (

								<View>
									{
										!isLandscape &&
										<Touch
											onPress={() => { this.setState({ fixedStatus: !this.state.fixedStatus },() => {this.props.setFixed(this.state.fixedStatus)}) }}
										>
											<Image resizeMode='stretch' source={
												this.state.fixedStatus ? require('../../images/betting/tag_entry.png') : require('../../images/betting/tag_cancel.png')
											} style={{ width: 20, height: 20 }} />
										</Touch>
									}
									{
										isLandscape &&
										<Touch
											onPress={() => {
												// if (global.localStorage.getItem('loginStatus') != 1) {
												// 	window.openOrientation && window.openOrientation()
												// 	Actions.Login({from: 'Betting-detail'})
												// 	return
												// }
												this.props.setIsLandscape()
												PiwikEvent('Odds', 'View', 'Landscape_viewodds')
											}}
											style={{paddingRight: DeviceInfoIos? 20:10}}
										>
											<Image resizeMode='stretch' source={require('../../images/betting/detail_bet_record.png')} style={{ width: 20, height: 20 }} />
										</Touch>
									}
								</View>
							)
						}
						{this.props.thumbStatus ? null : (
							<>
								{/* 橫屏 投注按鈕  */}
								{/* <ReactSVG
                            src={`/svg/betting/${this.state.isFullScreenSlider ? "detail_bet_record_checked" : "detail_bet_record"}.svg`}
                            className="bet-record-icon"
                            onClick={() => {
                                // this.props.scaleStatus && this.setState({showBet: true});
                                if (!localStorage.getItem('loginStatus') == 1) {
                                    Router.push('/login');
                                    return;
                                }
                                this.toggleMainPage();
                            }}
                        /> */}
								{/* 橫屏 全屏按鈕 已經棄用 */}
								{/* {this.state.showScaleIcon ? <ReactSVG
                            src={`/svg/betting/${this.props.scaleStatus ? "detail_scale" : "scale-big"}.svg`}
                            className="bet-scale-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                this.props.setFixed(false);
                                this.props.scaleStatus ? this.props.handle.exit() : this.props.handle.enter();
                                // this.FullScreenstyle();
                            }}
                        /> : null} */}
								{/* 豎屏 pin按鈕  */}
								{/* <ReactSVG
                            src={`/svg/betting/${this.props.fixedStatus ? "tag_entry" : "tag_cancel"}.svg`}
                            className="tag-entry-icon"
                            onClick={() => { this.props.setFixed(!this.props.fixedStatus) }}
                        /> */}
							</>
						)}
					</View>
					{
						EventData.HasLiveStreaming && this.state.showType == 1 &&
						<View style={{backgroundColor: '#000'}}>
							<Video
							source={{ uri: (EventData.LiveStreamingUrl && EventData.LiveStreamingUrl[0] && EventData.LiveStreamingUrl[0].Url) ? EventData.LiveStreamingUrl[0].Url : null }}
							rate={1.0}
							muted={false}
							onLoad={(p) => { console.log('play video onLoad:', EventData.LiveStreamingUrl ,p) }}
							onLoadStart={(p) => { console.log('play video onLoadStart:', EventData.LiveStreamingUrl ,p) }}
							resizeMode={"contain"}
							repeat
							style={{ width: width, height: height }}
							playWhenInactive={true}
							onError={(e) => { console.log('play video has error:', EventData.LiveStreamingUrl ,e)}}
						/>
						</View>
						// this.state.showType !=0 &&
						// EventData.HasLiveStreaming ?
						//     <VideoPlayer
						//         setPlayer={(v) => {
						//             this.player = v
						//         }}
						//         display={this.state.showType === 1 ? "block" : ""}
						//         autoPlay={(this.props.thumbStatus && this.state.showType === 1)}
						//         src={(EventData.HasLiveStreaming && EventData.LiveStreamingUrl) ? EventData.LiveStreamingUrl[0].Url : this.state.src}
						//     />
						//     : null
					}
					{
						this.state.showType === 2 ?
							// <iframe
							// 	src={'https://www.zbxz88.com/cms/F1/brevent.html?lang=zh&timezone=Asia:Hong_Kong&layout=single&brEventId=' + EventData.BREventId}
							// 	frameBorder="0" width="100%" height="100%" style={{
							// 		display: this.state.showType === 2 ? "block" : "none"
							// 	}}></iframe>
							<View style={{ width: width, height: height, backgroundColor: '#000' }}>
								{Platform.OS == "ios" ?
									<View style={{position: 'absolute'}}>
										<WebViewIOS
											onLoadStart={e => this.setState({ loadD: true })}
											onLoadEnd={e => this.setState({ loadD: false, loadone: 2 })}
											// source={{ uri: `https://www.zbxz88.com/cms/F1/brevent.html?lang=zh&timezone=Asia:Hong_Kong&layout=single&brEventId=${EventData.BREventId}` }}
											source={{html: `${htmls}<iframe
											src="https://www.zbxz88.com/cms/F1/brevent.html?lang=zh&timezone=Asia:Hong_Kong&layout=single&brEventId=${EventData.BREventId}"
											frameBorder="0" width="100%" height="${height}px"></iframe></body></html>`}}
											mixedContentMode="always"
											// key={}
											javaScriptEnabled={true}
											domStorageEnabled={true}
											// scalesPageToFit={false}
											allowsInlineMediaPlayback
											mediaPlaybackRequiresUserAction={false}
											allowFileAccess
											style={{ width: width, height: height }}
										/>
									</View>

									: Platform.OS == "android" &&
									<WebView
										onLoadStart={e => this.setState({ loadD: true })}
										onLoadEnd={e => this.setState({ loadD: false, loadone: 2 })}
										source={{ uri: `https://www.zbxz88.com/cms/F1/brevent.html?lang=zh&timezone=Asia:Hong_Kong&layout=single&brEventId=${EventData.BREventId}` }}
										mixedContentMode="always"
										// key={}
										javaScriptEnabled={true}
										domStorageEnabled={true}
										// scalesPageToFit={false}
										style={{ width: width, height: height }}
									/>
								}
							</View>
							: null
					}
				</ImageBackground>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	MiniEvent: {
		transform: [{ scale: 0.38 }],
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 99,
	},
	noMiniEvent: {

	},
	Betting_header: {
		position: 'absolute',
		top: 0,
		left: 0,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		padding: 10,
		zIndex: 99,
	},
	Bettingfotter: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		padding: 10,
		zIndex: 99,
	},
	Betting_header_score: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'flex-start',
		flexDirection: 'row',
		paddingTop: 40,
	},
	itemTimes: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	itemCenter: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

	},
	Game_info: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	noGame_info: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

	},
	dateFen: {
		borderRadius: 8,
		backgroundColor: '#eb2121',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 25,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	Footer_menu: {
		marginTop: 18,
		backgroundColor: '#0006',
		borderRadius: 45,
		paddingHorizontal: 25,
		paddingVertical: 9,
		zIndex: 9,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	}
})

const mapStateToProps = state => ({
	routerLog: state.routerLog
});

export default connect(
	mapStateToProps,
	null,
)(DetailHeader)
