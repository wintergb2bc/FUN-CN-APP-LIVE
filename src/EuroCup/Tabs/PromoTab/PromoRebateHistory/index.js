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
	TextInput,
	ActivityIndicator,
	UIManager,
	Modal
} from "react-native";
import {
	Button,
	Progress,
	WhiteSpace,
	WingBlank,
	InputItem,
	Toast,
	Flex
} from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import React from 'react';
import moment from 'moment';
import BettingCalendar from "../../../../containers/BettingRecord/BettingCalendar";

class PromoRebateHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			datalist: '',
			ScrollTop: false,
		};
	}

	componentDidMount() {
		let Rebatedata = JSON.parse(localStorage.getItem('Rebatedata'));
		/*------ 获得本条返水的ID ------*/
		// const { id } = Router.router.query;
		/*------ 根据ID筛选出对应的数据 -----*/
		// this.props.navigation.setParams({
		// 	title: this.props.Title
		// });
		// this.getDetail()
		
		
		if (Rebatedata) {
			console.log(Rebatedata)
			console.log(this.props.rebateId)
			let datalist = Rebatedata.filter((item) => item.categoryId === this.props.categoryId);
			this.setState({
				datalist: datalist
			});
		}
	}
	
	

	render() {
		const { datalist, ScrollTop } = this.state;
		return (
			<View style={{flex: 1, backgroundColor: '#EFEFF4', padding: 15,}}>
				<ScrollView
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
				{datalist != '' ? (
					datalist.map((data, index) => {
						const {
							applyDate,
							categoryId,
							totalBetAmount,
							totalGivenAmount,
							rebateId,
						} = data;
						return (
							<View style={styles.Historylist} key={index}>
								<View style={styles.hengview}>
									<View style={styles.viewlist}>
										<Text style={{color: '#999999', fontSize: 12, paddingRight: 15}}>流水</Text>
										<Text style={{ fontSize: 12}}>{totalBetAmount}</Text>
									</View>
									<View style={styles.viewlist}>
										<Text style={{color: '#999999', fontSize: 12, paddingRight: 15}}>返水</Text>
										<Text style={{ fontSize: 12, fontWeight: 'bold'}}>¥ {totalGivenAmount}</Text>
									</View>
									<View style={styles.viewlist}>
										<Text style={{color: '#999999', fontSize: 12, paddingRight: 15}}>编号</Text>
										<Text style={{ fontSize: 12}}>{rebateId}</Text>
									</View>
									<View style={[styles.viewlist, { paddingBottom: 0 }]}>
										<Text style={{color: '#999999', fontSize: 12, paddingRight: 15}}>日期</Text>
										<Text style={{ fontSize: 12}}>{moment(applyDate).format('YYYY-MM-DD')}</Text>
									</View>
								</View>
							</View>
						);
					})
				) : (
					<Text style={{lineHeight: 70,textAlign: 'center'}}>暂无记录</Text>
				)}
				</ScrollView>
				{
					ScrollTop &&
					<View style={styles.goTop}>
						<Touch onPress={() => {
							this._ScrollTop && this._ScrollTop.scrollTo({ x: 0, y: 0 })
							this.setState({ScrollTop: false})
						}}>
							<Image resizeMode='stretch' source={require('../../../../images/goTop.png')} style={{width: 80,height: 80}} />
						</Touch>
					</View>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	goTop: {
		position: 'absolute',
		bottom: 20,
		zIndex: 9999,
		right: 0,
	},
	hengview: {
		display: 'flex',
		// justifyContent: 'space-between',
		// alignItems: 'center',
		// flexDirection: 'row',
		// flexWrap: 'wrap'
	},
	viewlist: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		paddingBottom: 10,
	},
	Historylist: {
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 10,
		marginBottom: 15,
	},
})

export default PromoRebateHistory;
