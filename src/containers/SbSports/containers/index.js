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
	Modal
} from "react-native";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
// import fetch from 'fetch-with-proxy';
import { Flex, Toast, WingBlank, WhiteSpace, Tabs, Drawer } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import LoopCarousel from "react-native-looped-carousel";
import SnapCarousel, {
	ParallaxImage,
	Pagination
} from "react-native-snap-carousel";
import Carousel from "react-native-snap-carousel";
import AnalyticsUtil from "../actions/AnalyticsUtil"; //友盟
import LinearGradient from "react-native-linear-gradient";
import EventListing from '../game/EventListing'
import HomeHeader from './HomeHeader'
import { Decimal } from "decimal.js";
import VendorIM from './../lib/vendor/im/VendorIM';
import VendorBTI from './../lib/vendor/bti/VendorBTI';
import VendorSABA from './../lib/vendor/saba/VendorSABA';
const { width, height } = Dimensions.get("window");
import BottomtimeIcon from '../game/Footer/bottomtimeIcon'
import Recommend from './Recommend'
import Layout from './Layout'
import BetCartPopup from '../game/Betting/BetCartPopup'
import { ACTION_UserInfo_getBalanceSB, ACTION_UserInfo_login } from '$LIB/redux/actions/UserInfoAction';
const AffCodeIos = NativeModules.CoomaanTools;
import IovationX from "./../actions/IovationNativeModule";
import FastImage from "react-native-fast-image"; //android 拿黑盒子
import SbTransferPopup from "./SBTransferPopup"

class Home extends React.Component {
	// static navigationOptions = ({ navigation }) => {
	// 	return {
	// 		headerStyle: {
	// 			backgroundColor: "#00a6ff",
	// 			borderBottomWidth: 0,
	// 			maintenancePopup: false,
	// 			maintenanceSport: '乐天堂体育',
	// 			jumpToSport: 'IM体育',
	// 			lowerV: 'BTI'
	// 		},
	// 		headerTitle: <HomeHeader />,
	// 	};
	// };

	constructor(props) {
		super(props);
		this.state = {
			balance: '0.00',
			Vendor: VendorIM,
			VendorKey: 0,
			VendorLayoutKey: 1,
			sbType: this.props.sbType,
			SportId: this.props.SportId
		};
		console.log('propsprops')
		console.log(this.props)
	}

	componentWillMount() {
		// if(window.EuroCupLogin){
		// 	setTimeout(() => {
		// 		Actions.EuroCup()
		// 	}, 500);
		// }
		window.VendorData = VendorIM;
		window.lowerV = 'IM';
		if (ApiPort.UserLogin == true) {
			// this.Checkdomin();
			// this.getMainDomain();
			// this.getServerUrl();
			//新注册用户需要二次获取信息
			window.GetMessageCounts && window.GetMessageCounts()
		}

	}
	componentDidMount() {
		this.getE2()
		// setTimeout(() => {
		// 	navigateToSceneGlobe()
		// }, 2000)
	}

	componentWillUnmount() {
		VendorSABA.stopTokenRenewWhenLeave(); //沙巴停止更新token
		VendorBTI.stopTokenRenewWhenLeave(); //BTI停止更新token
	}
	getE2() {
		GetE2 = true
		if (Platform.OS === "android") {
			IovationX.getE2BlackBox(
				blackbox => {
					E2Backbox = blackbox;
					Iovation = blackbox
				},
				errorCallback => { }
			);

			// IovationX.getIovationBlackBox(
			// 	blackbox => {
			// 		Iovation = blackbox;
			// 	},
			// 	errorCallback => { }
			// );
		} else {
			// AffCodeIos.getVersion((error, event) => {
			// 	if (error) {
			// 		//console.log(error)
			// 	} else {
			// 		Iovation = event;
			// 	}
			// });

			if (!AffCodeIos.getE2BlackBox) {
				return;
			}

			AffCodeIos.getE2BlackBox((error, event) => {
				if (error) {
					//console.log(error)
				} else {
					E2Backbox = event;
					Iovation = event
				}
			});
		}
	}


	render() {
		window.changeGame = (key) => {
			const vendorMap = {
				'IM': VendorIM,
				'BTI': VendorBTI,
				'SABA': VendorSABA,
			}

			let Vendor = vendorMap[key];
			window.lowerV = key;
			window.VendorData = Vendor
			this.setState({
				Vendor,
				VendorKey: Math.ceil(Math.random() * 100000),
				VendorLayoutKey: Math.ceil(Math.random() * 100000),
				lowerV: key,
				SportId: 1
			})

		}
		window.changeGameKey = () => {
			//切换盘口，刷新盘率
			this.setState({VendorKey: Math.ceil(Math.random() * 100000),})
		}
		const {
			Vendor,
			VendorKey,
			VendorLayoutKey,
		} = this.state;

		return (
			<View style={{ flex: 1, position: "relative" }}>
				<HomeHeader sbType={this.props.sbType} />
				<View
					style={{
						position: "absolute",
						zIndex: -1,
						top: window.DeviceInfoIos ? 40+50 : 10+50,
						left: 0,
						width: width,
						height: 125,
					}}
				>
					<Image
						resizeMode="stretch"
						style={{
							width: width,
							height: 125,
						}}
						source={require("../../../images/home/headerBG3New.png")}
					/>
				</View>
				<EventListing key={VendorKey} Vendor={Vendor} SportId={this.state.SportId} />

				{/* 早盘日期选择 */}
				<View style={{ position: 'absolute', bottom: 20, left: (width - 110) * 0.5 }}>
					<BottomtimeIcon />
				</View>
				{/* 热门赛事 */}
				<Recommend />
				{/* 推送 */}
				<Layout key={VendorLayoutKey} Vendor={Vendor} />
			</View>
		);
	}
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
	userInfo_login: username => ACTION_UserInfo_login(username),
	userInfo_getBalanceSB: (forceUpdate = false) => ACTION_UserInfo_getBalanceSB(forceUpdate),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({


});
