/* ------------------- 投注数字键盘 ------------------*/

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
import styles from '../styleType'
import FreeBet from '../BottomFreeBet';

class BetKeyboard extends React.Component {
	constructor(props) {
		super();
		this.state = {
			amount1: 0,
			amount2: 0,
			amount3: 0
		};
		this._refsFreeBetState = React.createRef();
	}
	componentDidMount() {
		const Setting = this.props.Vendor.getMemberSetting();
		this.setState({
			amount1: Setting.amount1,
			amount2: Setting.amount2,
			amount3: Setting.amount3
		});
	}
	render() {
		const { amount1, amount2, amount3 } = this.state;
		const { BetSetting, BetAmountData, BetAmountDataKey, detailWidth, detailHeight } = this.props;
		let NumberList = [
			{
				name: '1',
				key: 1
			},
			{
				name: '2',
				key: 2
			},
			{
				name: '3',
				key: 3
			},
			{
				name: 'MAX',
				key: this.props.Balance > Max ? Max : this.props.Balance
			},
			{
				name: '4',
				key: 4
			},
			{
				name: '5',
				key: 5
			},
			{
				name: '6',
				key: 6
			},
			{
				name: amount1,
				key: 'add'
			},
			{
				name: '7',
				key: 7
			},
			{
				name: '8',
				key: 8
			},
			{
				name: '9',
				key: 9
			},
			{
				name: amount2,
				key: 'add'
			},
			{
				name: '00',
				key: '00'
			},
			{
				name: '0',
				key: 0
			},
			{
				name: '清除',
				key: 'clear'
			},
			{
				name: amount3,
				key: 'add'
			}
		];
		/* 是否有免费投注 */
		let ShowFreeBets = BetSetting != null ? BetSetting.FreeBets != '' : false;
		let Max = BetSetting ? BetSetting.MaxAmount : 0;
		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (
			<View style={[styles.Bet_digit_keyboard_area,{width: width - 20,}]}>
				{/* 免费投注 */}
				{ShowFreeBets && (
					<FreeBet
						detailHeight={detailHeight}
						detailWidth={detailWidth}
						isLandscape={this.props.isLandscape}
						chooseFreeBet={this.props.chooseFreeBet}
						BetSetting={BetSetting}
						BetAmountData={BetAmountData}
						BetAmountDataKey={BetAmountDataKey}
						ref={this._refsFreeBetState}
					/>
				)}
				<View style={[styles.number_area,{width: width - 20,}]}>
					{/* 键盘列表 */}
					{NumberList.map((item, index) => {
						return (
							<TouchableOpacity
								style={[styles.numItemBtn,{width: width * 0.18, height: (width * 0.18) * 0.57, marginLeft: index == 3  || index == 7 || index == 11 || index == 15 ? 15: 0}]}
								// className={
								// 	index == 3 ? (
								// 		'item btn'
								// 	) : index == 7 || index == 11 || index == 15 ? (
								// 		'item orgColor '
								// 	) : (
								// 				'item'
								// 			)
								// }
								key={index}
								onPress={() => {
									this.props.modifyNum(item.key, index, BetAmountDataKey);
								}}
							>
								{index == 14 ? (
									/* 删除 */
									// <ReactSVG className="Betting-dlt -svg" src={'/svg/betting/dlt.svg'} />
									<Image resizeMode='stretch' source={require('../../../images/betting/dlt.png')} style={{ width: 22, height: 22 }} />
								) : index == 3 ? (
										<Image resizeMode='stretch' source={require('../../../images/betting/max.png')} style={{ width: width * 0.18, height: (width * 0.18) * 0.57 }} />
									)
									: (
										<Text style={{ color: index == 7 || index == 11 || index == 15 ? '#FFA82B' : '#999999', fontSize: 12 }}>
											{item.name}
										</Text>
									)
								}
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
		);
	}
}
export default BetKeyboard;
