/*----------- 当投注条件不成立时 无法投注时 显示 ---------- */

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
	Alert,
	Modal,
	ImageBackground,
	Platform,
	TextInput,
	KeyboardAvoidingView,
	ActivityIndicator,
} from "react-native";
const { width, height } = Dimensions.get("window");
import Touch from "react-native-touch-once";
import styles from '../styleType'

class CannotBetting extends React.Component {
	render() {
		const { type, isNotEnoughSelections, detailWidth, detailHeight } = this.props;

		let message = () => {
			if (type == 2 && isNotEnoughSelections) {
				return '混合过关最少需要选取两个以上的有效投注选项呦';
			}
			if (type == 3 && isNotEnoughSelections) {
				return '系统混合过关最少需要选取三个以上的有效投注选项呦';
			}
			return '暂时无法投注';
		};

		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (

			<View style={[styles.bettotalamount,{width: width,}]}>
				<View style={[styles.total_amount,{width: width,}]}>
					<Text style={{ color: '#999' }}>总投注额</Text>
					<Text style={{ color: '#000', fontWeight: 'bold' }}>￥ 0</Text>
				</View>
				<View style={[styles.total_amount,{width: width,}]}>
					<Text style={{ color: '#999' }}>可赢金额</Text>
					<Text style={{ color: '#000', fontWeight: 'bold' }}>￥ 0</Text>
				</View>
				<View  style={[styles.BetingBtn,{width: width,}]}>
					<Touch
						style={styles.Btn_left}
						onPress={() => {
							this.props.RemoveBetCart();
							PiwikEvent('BetCart', 'Back', 'ClearBetcart')
						}}
					>
						<Text style={{ color: '#000', fontWeight: 'bold' }}>全部清除</Text>
					</Touch>
					<Touch
						style={[styles.Btn_right,{width: width * 0.6}]}
						onPress={() => {
							window.KeyBoardToast('fail', message())
						}}>
						<Text style={{ color: '#ccc' }}>投注</Text>
					</Touch>
				</View>
			</View>
			// <div className="Bottom-flex">
			// 	<div className="total-amount">
			// 		<label className="gray">总投注额</label>
			// 		<b>￥ 0</b>
			// 	</div>
			// 	<div className="total-amount">
			// 		<label className="gray">可赢金额</label>
			// 		<b>￥ 0</b>
			// 	</div>
			// 	<div className="BetingBtn">
			// 		<button
			// 			className="Btn-left"
			// 			onClick={() => {
			// 				this.props.RemoveBetCart([], 2);
			// 			}}
			// 		>
			// 			全部清除
			// 		</button>

			// 		<button
			// 			className="Btn-right"
			// 			style={{
			// 				color: '#ccc'
			// 			}}
			// 			onClick={() => {
			// 				Toast.fail(message());
			// 			}}
			// 		>
			// 			<big>投注</big>
			// 		</button>
			// 	</div>
			// </div>
		);
	}
}

export default CannotBetting;
