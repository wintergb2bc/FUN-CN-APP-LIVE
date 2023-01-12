/* 串关购物车浮窗 */
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
import { Toast } from 'antd-mobile-rn';
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import React from "react";
import { connect } from 'react-redux';
import { ACTION_BetCart_setIsComboBet } from '$LIB/redux/actions/BetCartAction';

class _BetCartPopup extends React.Component {
	state = {};
	render() {
		const { Vendor } = this.props;
		const isComboBet = this.props.betCartInfo['isComboBet' + Vendor.configs.VendorName];
		const betCartData = this.props.betCartInfo['betCart' + Vendor.configs.VendorName];
		return (
			<View>
				{
					global.localStorage.getItem('loginStatus') == 1 && betCartData && betCartData.length > 0 &&
					<Touch
						onPress={async () => {
							let betCartTabId = isComboBet == true ? 2 : 1; //1單注2串關
							if (isComboBet == true && betCartData.length < 2) {
								//投注選項不滿兩個，就切回單注模式
								await this.props.betCart_setIsComboBet(false, Vendor.configs.VendorName);
								betCartTabId = 1;
							}
							this.props.ShowBottomSheet(betCartTabId);
							PiwikEvent('Game Nav', 'Click', 'Betcart_MainPage_SB2.0')
						}}
						style={styles.iconView}
					>
						<Image resizeMode='stretch' source={require('../../images/Group.png')} style={{ width: 25, height: 25 }} />
						<View style={styles.numIcon}>

							<Text style={{ color: '#fff' }}>{betCartData.length}</Text>
						</View>
					</Touch>
				}
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	betCartInfo: state.betCartInfo,
});

const mapDispatchToProps = {
	betCart_setIsComboBet: ACTION_BetCart_setIsComboBet,
};

export default connect(mapStateToProps, mapDispatchToProps)(_BetCartPopup);

const styles = StyleSheet.create({
	iconView: {
		backgroundColor: '#00a6ff',
		height: 55,
		width: 55,
		borderRadius: 130,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	numIcon: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: -8,
		right: -2,
		backgroundColor: '#fcab23',
		width: 25,
		height: 25,
		borderRadius: 30
	}
});
