
import React, { Component, PropTypes } from 'react'
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
	TextInput,
	KeyboardAvoidingView,
} from "react-native";
import { Actions } from "react-native-router-flux";
import SnapCarousel, {
	ParallaxImage,
	Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
import ImageForTeam from "../RNImage/ImageForTeam";
import { connect } from "react-redux";
const { width, height } = Dimensions.get("window");

/*
	投注页面 公用头部  赛事比分概况
*/

const swiperConfigs = {
	loop: true,
	speed: 500,
	preloadImages: false,
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},
	pagination: {
		el: '.swiper-pagination',
		bulletElement: 'li',
		hideOnClick: true,
		clickable: true
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev'
	},
}

let banners = [
	{imgs: require("../../images/betting/banner1.png")},
	{imgs: require("../../images/betting/banner2.png")},
]

let banners1 = [
	{imgs: require("../../images/betting/banner3.png")},
	{imgs: require("../../images/betting/banner1.png")},
	{imgs: require("../../images/betting/banner2.png")},
]

class Header extends Component {
	constructor() {
		super();
		this.state = {
			isOpen: false,
			activeSlide: 0,
		};
	}
	componentDidMount() {
		//console.log('=====header componentDidMount')
		this.props.HeaderRef && this.props.HeaderRef(this);
	}

	componentWillUnmount() {
		//console.log('=====header componentWillUnmount')
	}

	//獲取兩個一組的banner數據
	getPairedBannerData = (eventDatas) => {
		if (!eventDatas || (Array.isArray(eventDatas) && eventDatas.length <=0)) {
			return [];
		}
		let list = []
		let num = 0;
		let items = []
		eventDatas.forEach((item, index) => {
			num += 1
			items.push(item)
			if (num == 2) {
				list.push(items)
				num = 0
				items = []
			}

		})
		return list;
	}

	goDetaile(EventData) {
		// ${ this.props.Vendor.configs.VendorPage } /detail?sid=${EventData.SportId}&eid=${EventData.EventId}&lid=${EventData.LeagueId}
		let dataList = {
			eid: EventData.EventId,
			sid: EventData.SportId,
			lid: EventData.LeagueId,
			// OE: IsOutRightEvent,
		}
		PiwikEvent('Match', 'Launch', 'Mainpage_banner')
		Actions.Betting_detail({ dataList, Vendor: this.props.Vendor })
		console.log('EventDataEventData', EventData.EventId)
	}

	_renderBannerItem2 = (item, index) => {
		return (
			<View key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: 0.333 * (width - 20), width: width - 20 }}>
				{
					item[0] &&
					<Touch onPress={() => { this.goDetaile(item[0]) }} style={styles.BannerList}>
						<View style={styles.temas}>
							{/* <Image resizeMode='stretch' source={require('../../images/betting/fun88.png')} style={{ width: 20, height: 20 }} /> */}
							<ImageForTeam TeamId={item[0].HomeTeamId} IconUrl={item[0].HomeIconUrl} />
							<Text style={styles.temasTxt} numberOfLines={1}>{item[0].HomeTeamName}</Text>
							{
							item[0].IsRB &&
								item[0].HomeRedCard &&
								parseInt(item[0].HomeRedCard) > 0 ? (
									<View style={{ backgroundColor: 'red', borderRadius: 5, paddingLeft: 3,paddingRight: 3 }}>
										<Text style={{color: '#fff', fontSize: 12}}>{item[0].HomeRedCard ?? 0}</Text>
									</View>
								)
							:<Text style={{color: 'transparent'}}>0</Text>
							}
						</View>
						{
							item[0].IsRB &&
							<View style={styles.temasVS}>
								<View style={[styles.temasVS, { flexDirection: 'row' }]}>
									<Text style={{ color: item[0].HomeScore > 0 ? '#fff' : '#efeff4', fontSize: 12 }}>{item[0].HomeScore}</Text>
									<Text style={{ color: '#fff', padding: 8 }}>-</Text>
									<Text style={{ color: item[0].AwayScore > 0 ? '#fff' : '#efeff4', fontSize: 12 }}>{item[0].AwayScore}</Text>
								</View>
								<View style={styles.gameNumber}>
									<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 30 }}>{item[0].RBMinute}'</Text>
								</View>
							</View>
						}
						{
							!item[0].IsRB &&
							<View style={styles.temasVS}>
								<View style={{position: 'absolute', top: -10,}}>
									<Text style={{ color: '#fff', fontSize: 12, width: 90, textAlign: 'center' }}>{item[0].getEventDateMoment().format('MM/DD HH:mm')}</Text>
								</View>
								<Text style={{ color: '#fff', padding: 8 }}>VS</Text>
								<Text style={{ color: '#fff', fontSize: 12 }}>未开始</Text>
							</View>
						}

						<View style={styles.temas}>
							<ImageForTeam TeamId={item[0].AwayTeamId} IconUrl={item[0].AwayIconUrl} />
							<Text style={styles.temasTxt} numberOfLines={1}>{item[0].AwayTeamName}</Text>
							{
							item[0].IsRB &&
								item[0].AwayRedCard &&
								parseInt(item[0].AwayRedCard) > 0 ? (
									<View style={{ backgroundColor: 'red', borderRadius: 5, paddingLeft: 3,paddingRight: 3 }}>
										<Text style={{color: '#fff', fontSize: 12}}>{item[0].AwayRedCard ?? 0}</Text>
									</View>
								)
							:<Text style={{color: 'transparent'}}>0</Text>
							}
						</View>
					</Touch>
				}

				<View style={{ width: 1, backgroundColor: '#fff', height: 0.29 * (width - 20) }} />
				{
					item[1] &&
					<Touch onPress={() => { this.goDetaile(item[1]) }} style={styles.BannerList}>
						<View style={styles.temas}>
							<ImageForTeam TeamId={item[1].HomeTeamId} IconUrl={item[1].HomeIconUrl} />
							<Text style={styles.temasTxt} numberOfLines={1}>{item[1].HomeTeamName}</Text>
							{
							item[1].IsRB &&
								item[1].HomeRedCard &&
								parseInt(item[1].HomeRedCard) > 0 ? (
									<View style={{ backgroundColor: 'red', borderRadius: 5, paddingLeft: 3,paddingRight: 3 }}>
										<Text style={{color: '#fff', fontSize: 12}}>{item[1].HomeRedCard ?? 0}</Text>
									</View>
								)
							:<Text style={{color: 'transparent'}}>0</Text>
							}
						</View>
						{
							item[1].IsRB &&
							<View style={styles.temasVS}>
								<View style={[styles.temasVS, { flexDirection: 'row' }]}>
									<Text style={{ color: item[1].HomeScore > 0 ? '#fff' : '#efeff4', fontSize: 12 }}>{item[1].HomeScore}</Text>
									<Text style={{ color: '#fff', padding: 8 }}>-</Text>
									<Text style={{ color: item[1].AwayScore > 0 ? '#fff' : '#efeff4', fontSize: 12 }}>{item[1].AwayScore}</Text>
								</View>
								<View style={styles.gameNumber}>
									<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 30 }}>{item[1].RBMinute}'</Text>
								</View>
							</View>
						}
						{
							!item[1].IsRB &&
							<View style={styles.temasVS}>
								<View style={{position: 'absolute', top: -10,}}>
									<Text style={{ color: '#fff', fontSize: 12, width: 90, textAlign: 'center' }}>{item[1].getEventDateMoment().format('MM/DD HH:mm')}</Text>
								</View>
								<Text style={{ color: '#fff', padding: 8 }}>VS</Text>
								<Text style={{ color: '#fff', fontSize: 12 }}>未开始</Text>
							</View>
						}

						<View style={styles.temas}>
							<ImageForTeam TeamId={item[1].AwayTeamId} IconUrl={item[1].AwayIconUrl} />
							<Text style={styles.temasTxt} numberOfLines={1}>{item[1].AwayTeamName}</Text>
							{
							item[1].IsRB &&
								item[1].AwayRedCard &&
								parseInt(item[1].AwayRedCard) > 0 ? (
									<View style={{ backgroundColor: 'red', borderRadius: 5, paddingLeft: 3,paddingRight: 3 }}>
										<Text style={{color: '#fff', fontSize: 12}}>{item[1].AwayRedCard ?? 0}</Text>
									</View>
								)
							:<Text style={{color: 'transparent'}}>0</Text>
							}
						</View>
					</Touch>
				}
			</View>
		);
	}
	get pagination2() {
		const { activeSlide } = this.state;
		const eventDatas = this.getPairedBannerData(this.props.BannerDatas);
		return (

			<Pagination
				dotsLength={eventDatas.length}
				activeDotIndex={activeSlide}
				containerStyle={{position: 'absolute',bottom: -26}}
				dotStyle={{
					width: 8,
					height: 8,
					borderRadius: 5,
					backgroundColor: '#00A6FF',
				}}
				inactiveDotStyle={{
					// Define styles for inactive dots here
				}}
				inactiveDotOpacity={0.4}
				inactiveDotScale={0.6}
		  />
		);
	}

	_renderBannerItem1(item, index) {
		return (
			<View key={index} style={{ width: width - 20, height: 0.333 * (width - 20), borderRadius: 10, overflow: 'hidden' }}>
				<Image
					source={item.imgs}
					style={{ width: width - 20, height: 0.333 * (width - 20)}}
				/>
			</View>
		)
	}

	render() {
		const eventDatas = this.getPairedBannerData(this.props.BannerDatas);
		//console.log('eventDataseventDatas', eventDatas)
		const bannersData = this.props.event.duringTheWorldCup ? banners1 : banners;
		return (
			<View>
				{
					<View style={{ width: width, paddingHorizontal: 10, display: 'flex',justifyContent: 'center',alignItems: 'center',paddingBottom: 10, paddingTop: 8 }}>
						<View
							style={{ width: width - 20, height: 0.333 * (width - 20), display: 'flex',justifyContent: 'center',alignItems: 'center' }}
							// resizeMode="stretch"
							// source={require("../../images/betting/header.png")}
						>
							{
								// eventDatas.length > 0 &&
								<View>
									{/* <SnapCarousel
										ref={c => {
											this._snapcarousel = c;
										}}
										data={eventDatas}
										renderItem={this._renderBannerItem2}
										onSnapToItem={index => this.setState({ activeSlide: index })}
										sliderWidth={width - 20}
										sliderHeight={0.333 * (width - 20)}
										itemWidth={width - 10}
										hasParallaxImages={true}
										firstItem={0}
										loop={true}
										autoplay={true}
									/> */}
									<ScrollView
										horizontal={true}
										pagingEnabled={true}
										showsHorizontalScrollIndicator={false}
										showsVerticalScrollIndicator={false}
										onMomentumScrollEnd = {(e) => {
											let offsetY = e.nativeEvent.contentOffset.x; //滑动距离
											let oriageScrollWidth = e.nativeEvent.layoutMeasurement.width; //scrollView宽度

											let activeSlide = 0
											if(offsetY != 0) {
												//滑动块数
												activeSlide = offsetY / oriageScrollWidth
											}
											this.setState({activeSlide})
										}}
									>
										{
											// eventDatas.map((item, index) => {
											bannersData.map((item, index) => {
												return(
													<View key={index}>
														{this._renderBannerItem1(item, index)}
													</View>
												)
											})
										}
									</ScrollView>
								</View>
							}
						</View>
						<View style={{display: 'flex', justifyContent: 'center',alignItems: 'center', flexDirection: 'row', paddingTop: 10}}>
							{
								bannersData.length > 0 && bannersData.map((item, index) => {
									return(
										<View key={index} style={this.state.activeSlide == index? styles.activeSlide : styles.noactiveSlide} />
									)
								})
							}
						</View>
						{/* {this.pagination2} */}
					</View>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	activeSlide: {
		width: 20,
		height: 5,
		backgroundColor: '#00a6ff',
		borderRadius: 10,
		marginLeft: 5,
	},
	noactiveSlide: {
		width: 5,
		height: 5,
		backgroundColor: '#BCBEC3',
		borderRadius: 10,
		marginLeft: 5,
	},
	BannerList: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		width: (width - 20) * 0.49,
	},
	temas: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: (width - 20) * 0.15,
	},
	temasVS: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		// width: (width - 20) * 0.08,
	},
	gameNumber: {
		backgroundColor: '#eb2121',
		borderRadius: 5,
		width: 30,
	},
	temasTxt: {
		fontSize: 12,
		color: '#fff',
		width: (width - 20) * 0.15,
		paddingTop: 10,
		textAlign: 'center'
	},
})

const mapStateToProps = (state) => ({
	event: state.event
});
const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
