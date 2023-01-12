/* ---------------- 免费投注 ------------------ */
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
import { Flex, Toast, WingBlank, WhiteSpace, Tabs, Drawer,PickerView } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import styles from '../styleType'

class FreeBet extends React.Component {
	constructor(props) {
		super();
		this.state = {
			showmenu: false,
			selectedValue: null,
		};
	}

	render() {
		const { BetSetting, BetAmountData, BetAmountDataKey, isLandscape, detailWidth, detailHeight  } = this.props;

		const targetAmountData = BetAmountData.find(v => v.key == BetAmountDataKey);
		let thisFreeBetToken = targetAmountData ? targetAmountData.freeBetToken : null;
		let thisFreeBetData = null;
		if (thisFreeBetToken) {
			thisFreeBetData = (BetSetting && BetSetting.FreeBets)
				? BetSetting.FreeBets.find(fb => fb.FreeBetToken == thisFreeBetToken)
				: null;
		}
		const thisFreeBetDesc = thisFreeBetToken ? thisFreeBetData.FreeBetAmount + '元串关免费彩金' : '';

		//已被選走的FreeTokens
		const choosedFreeBetTokens = BetAmountData.filter(v => v.freeBetToken !== null).map(v => v.freeBetToken);

		//還沒被選走的FreeBetDatas列表 + 加上已經選中的
		const availableFreeBetDatas = (BetSetting && BetSetting.FreeBets)
			?  BetSetting.FreeBets.filter(fb => choosedFreeBetTokens.indexOf(fb.FreeBetToken) === -1 || fb.FreeBetToken == thisFreeBetToken)
			: []

		const freeBetDataList = [{FreeBetToken: 'empty'},...availableFreeBetDatas]; //第一個默認空白

		const { showmenu } = this.state;

		const freeBetOptions = freeBetDataList.map(
			(item, index) => ({ label: item.FreeBetToken == 'empty' ? '选择免费投注' : item.FreeBetAmount + '元串关免费彩金', value: item.FreeBetToken})
		)


		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (availableFreeBetDatas && availableFreeBetDatas.length >0) && (
			<View className="FreeBetlist">
				<View>
					<View style={{padding:10}}>
						<Touch
							onPress={(e) => {
								this.setState({
									showmenu: true
								});
							}}
							style={[styles.freedSelect,{width: width - 40}]}
						>
							<Text style={{color: '#000'}}>{!thisFreeBetData ? '选择免费投注' : thisFreeBetDesc}</Text>
							<Image resizeMode='stretch' source={require('../../../images/down.png')} style={{ width: 20, height: 20 }} />
						</Touch>
					</View>
					{thisFreeBetData && (
						<Text style={{fontSize: 12,color: '#fcab23',paddingLeft: 10,paddingRight: 10}}>
							温馨提示：您已选择{thisFreeBetDesc}，投注金额请大于或等于{thisFreeBetData.FreeBetAmount}元
						</Text>
					)}
					<Modal
						animationType="none"
						transparent={true}
						visible={showmenu}
						animationType={'slide'}
						supportedOrientations={['portrait', 'landscape']}
					>
						<View style={isLandscape? styles.depModalMin: styles.depModal}>
							<Touch style={styles.marks} onPress={() => { this.setState({showmenu:false})}} />
							{
								isLandscape &&
								<Touch  onPress={() => { this.setState({ isBottomSheetVisible: false }) }} style={[styles.LandscapeClose,{width: width, height: detailHeight,right: DeviceInfoIos? 35:0}]}></Touch>
							}
							<View
								style={isLandscape? [styles.modalCenterLandscape,{width: width, height: detailHeight * 0.5,right: DeviceInfoIos? 35:0}]: styles.modalCenter}
							>
								<Touch style={styles.freedBtn} onPress={() => { this.setState({showmenu:false})}}>
									<Text style={{color: '#00a6ff', textAlign: 'right', lineHeight: 35,paddingRight: 15}}>完成</Text>
								</Touch>
								<PickerView
									onChange={(value) => {
										if (value == 'empty') { //empty轉一下改帶null
											this.props.chooseFreeBet(BetAmountDataKey, null);
										} else {
											this.props.chooseFreeBet(BetAmountDataKey, value)
										}
									}}
									value={thisFreeBetToken}
									data={freeBetOptions}
									cascade={false}
								/>
							</View>
						</View>
					</Modal>
					{
						// <Drawer
						// 	onClose={() => {
						// 		this.setState({
						// 			showmenu: false
						// 		});
						// 	}}
						// 	hasHeader={false}
						// 	maskClosable
						// 	show={showmenu}
						// 	placement={'bottom'}
						// 	height={250}
						// 	className={'FreeBetbox'}
						// >
						// 	<div
						// 		className="Header"
						// 		onClick={() => {
						// 			this.setState({
						// 				showmenu: false
						// 			});
						// 		}}
						// 	>
						// 		<span>完成</span>
						// 	</div>
						// 	<Picker
						// 		selectedValue={Number(this.state.selectedValue)}
						// 		onValueChange={this.handleChange}
						// 		/* 如果已经选择了免费投注的盘口，则其他盘口要禁用不可再选 */
						// 		disabled={Propdactiveindex != activeindex ? true : false}
						// 	>
						// 		{optionGroups.map((item, key) => {
						// 			return (
						// 				<Picker.Item value={key} key={key}>
						// 					{item.title}
						// 				</Picker.Item>
						// 			);
						// 		})}
						// 	</Picker>
						// </Drawer>
					}
				</View>
			</View>
		);
	}
}

export default FreeBet;
