/* **********系统混合过关  例如 系统混合过关2/3 3串4 **************/
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
import { numberWithCommas } from '../BettingDataCheck';
import BetKeyboard from '../BottomNumberKeyboard/';
import Bettotalamount from '../BottomSubmitBetting/';
import CannotBetting from './CannotBetting';
import {Decimal} from "decimal.js";
import BetOddsList from './BetOddsList';

class CrossBettingSystem extends React.Component {
	constructor(props) {
		super();
		this.state = {
			ShowKeyboard: false,
			currentChecked: 0
		};
		this._refsBetKeyboard = React.createRef();
	}
	componentDidMount() {
	}
	render() {
		const { BetInfoData, BetAmountData, OddsUpData, OddsDown, Balance, Vendor, detailWidth, detailHeight } = this.props;
		const { currentChecked } = this.state;
		const betAmountDataKey = 'system'; //系統混合過關 用 'system'  作為key
		const targetAmountData = BetAmountData.find(v => v.key == betAmountDataKey);
		let Amount = targetAmountData ? targetAmountData.betAmount : '';
		let BetAmountvallist = [ Amount ];
		const BetSettings = BetInfoData && BetInfoData.SystemParlayBetSettings ? BetInfoData.SystemParlayBetSettings : null;
		let EstimatedPayoutRatelist =
			BetSettings && BetSettings.length > 0
				? [
					(Number(BetAmountvallist[0]) *
						Number(BetSettings[currentChecked].EstimatedPayoutRate)).toFixed(2)
				]
				: [ 0 ];
		let ComboCountlist =
			BetSettings && BetSettings.length > 0
				? [ BetSettings[currentChecked].ComboCount * Amount ]
				: [ 0 ];

		//免費投注
		const thisFreeBetToken = targetAmountData ? targetAmountData.freeBetToken : null;
		let FreeBetTokenList = [thisFreeBetToken];
		let thisFreeBetData = null;
		let currentBetSetting = BetSettings ? BetSettings[currentChecked] : null;
		if (thisFreeBetToken) {
			thisFreeBetData = (currentBetSetting && currentBetSetting.FreeBets)
				? currentBetSetting.FreeBets.find(fb => fb.FreeBetToken == thisFreeBetToken)
				: null;
		}

		let MaxAmount = currentBetSetting ? currentBetSetting.MaxAmount : 0;
		let MinAmount = currentBetSetting ?currentBetSetting.MinAmount : 0;
		//免費投注影響投注下限
		if (thisFreeBetData) {
			if (thisFreeBetData.FreeBetAmount > (currentBetSetting.ComboCount * currentBetSetting.MinAmount)) {
				MinAmount = new Decimal(thisFreeBetData.FreeBetAmount).dividedBy(currentBetSetting.ComboCount).toDecimalPlaces(0,2).toNumber(); //無條件進位
			}
		}
		let AmountFixed = Amount != '' && Amount != 'undefined' ? Number(Amount).toFixed(2) : '';

		//無法投注原因
		let isNotEnoughSelections = false;
		if (BetSettings || BetSettings.length <= 0) {
			//過濾掉 不支持串關 和 狀態異常 的投注選項，剩下的不到3個 => 無法投注
			isNotEnoughSelections = BetInfoData.getSelectionsForCombo().length < 3;
		}

		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (
			<View>
				{BetSettings && BetSettings.length > 0 ? (
				<View style={{ height: (height * 0.9) - 90 }}>
					<ScrollView
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
					>
						<View style={{ paddingBottom: 120 }}>
							<BetOddsList
								isLandscape={this.props.isLandscape}
								detailWidth={detailWidth}
								detailHeight={detailHeight}
								/* 上升赔率 */
								OddsUpData={OddsUpData}
								/* 下降赔率 */
								OddsDown={OddsDown}
								/* 注单类型  单投 - 混合 - 系统混合 */
								BetActiveType={3}
								/* 盘口检查数据 */
								BetInfoData={BetInfoData}
								/* 投注金額 */
								BetAmountData={BetAmountData}
								/* 键盘金额计算 */
								modifyNum={this.props.modifyNum}
								/* 選擇免費投注 */
								chooseFreeBet={this.props.chooseFreeBet}
								/* 监听滚动事件 */
								_onScrollEvent={this.props._onScrollEvent}
								/* 删除购物车盘口 */
								RemoveBetCart={this.props.RemoveBetCart}
								/* 会员余额 */
								Balance={this.props.Balance}
								/* 厂商模块 */
								Vendor={this.props.Vendor}
							/>
							<View style={[styles.SystemParlayBet,{width: width - 20, marginTop: 10}]}>
								<View className="cap-list">
									{BetSettings.map((item, index) => {
										return (
											<Touch
												style={styles.capItem}
												key={index}
												onPress={() => {
													this.setState({
														currentChecked: index,
													});
												}}
											>
												<View
													style={[index === this.state.currentChecked ? styles.activeCapList : styles.capList]}
													// className={`cap-item-circle${index === this.state.currentChecked
													// 	? ' curr'
													// 	: ''}`}
												/>
												<Text style={{ paddingLeft: 12 }}>
													{item.ComboTypeName} x {item.ComboCount} @{item.EstimatedPayoutRate && Number(item.EstimatedPayoutRate.toFixed(2))}
												</Text>
											</Touch>
										);
									})}
								</View>
								<Touch style={[styles.capInput,{width: width - 50,borderColor: this.state.ShowKeyboard? '#00A6FF': '#fff'}]} onPress={() => { this.setState({ ShowKeyboard: true }) }}>
									<Text style={{ color: '#000', fontWeight: 'bold', lineHeight: 35, paddingLeft: 4, }}>￥</Text>
									<Text style={{ color: '#000', lineHeight: 35, fontWeight: 'bold' }}>{AmountFixed}</Text>
								</Touch>
								<View className="Inputdata InputBox">

									{/* <span className="icon">￥</span>
						<input
							defaultValue={AmountFixed}
							style={{ width: '100%' }}
							disabled
							className={this.state.ShowKeyboard ? 'Inputactive input' : 'input'}
							key={Amount}
						/> */}
									{/* 兼容火狐 input disabled 无法触发click事件问题 放一个覆盖层 */}
									{/* <div
							className="Falseinput"
							onClick={() => {
								this.setState({
									ShowKeyboard: true
								});
							}}
						/> */}
								</View>
								{
									Amount != '' &&
									<View style={[styles.maxMinErr2,{width: width - 50,}]}>
										<View style={[styles.maxMinErrView2,{width: width - 50,}]}>
											{Amount != '' &&
											Amount < MinAmount && <Text style={styles.maxMinErrTxt}>金额必须为￥ {numberWithCommas(MinAmount)} 或以上的金额</Text>}
											{Amount != '' &&
											Amount > MaxAmount && <Text style={styles.maxMinErrTxt}>金额必须为￥ {numberWithCommas(MaxAmount)} 或以下的金额</Text>}
										</View>
									</View>
								}
								{
									thisFreeBetData &&
									<View className="gift-freebet system">
										<View></View>
										<Text className="freebet">{'使用 ' + thisFreeBetData.FreeBetAmount + ' 元串关免费彩金'}</Text>
									</View>
								}
								<View className="ShowKeyboardBox ">
									<Text style={{ fontSize: 12, marginTop: 10, textAlign: 'right', color: '#BCBEC3' }}>
										最低-最高：￥{numberWithCommas(MinAmount)}-￥{numberWithCommas(MaxAmount)}
									</Text>
								</View>

								{this.state.ShowKeyboard && (
									<View style={{left: -15}}>
											<BetKeyboard
											isLandscape={this.props.isLandscape}
											detailWidth={detailWidth}
											detailHeight={detailHeight}
											modifyNum={this.props.modifyNum}
											chooseFreeBet={this.props.chooseFreeBet}
											BetSetting={BetSettings ? BetSettings[currentChecked] : null}
											BetAmountData={BetAmountData}
											BetAmountDataKey={betAmountDataKey}
											Balance={this.props.Balance}
											ref={this._refsBetKeyboard}
											Vendor={Vendor}
										/>
									</View>
								)}
							</View>
						</View>
					</ScrollView>
					{/* 投注金額總計和投注按鈕 */}
					<View style={{ position: 'absolute', bottom: 0, left: 0 }}>
						<Bettotalamount
							EuroCupBet={this.props.EuroCupBet}
							EuroCupBetDetail={this.props.EuroCupBetDetail || false}
							detailWidth={detailWidth}
							detailHeight={detailHeight}
							Vendor={Vendor}
							BetAmountvallist={BetAmountvallist}
							ComboCount={ComboCountlist}
							EstimatedPayoutRatelist={EstimatedPayoutRatelist}
							BetActiveType={3}
							BetInfoData={BetInfoData}
							StartBetting={this.props.StartBetting}
							RemoveBetCart={this.props.RemoveBetCart}
							CloseBottomSheet={this.props.CloseBottomSheet}
							ActiveInput={currentChecked}
							FreeBetTokenList={FreeBetTokenList}
							Amounterror={Amount != '' ? Amount < MinAmount || Amount > MaxAmount : true}
							Balance={Balance}
						/>
					</View>
				</View>
				) : (
					/* 无法投注 仍然要列出投注選項 */
					<View style={{ height: (height * 0.9) - 90 }}>
						<ScrollView
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
						>
							<View style={{ paddingBottom: 120 }}>
								<BetOddsList
									isLandscape={this.props.isLandscape}
									detailWidth={detailWidth}
									detailHeight={detailHeight}
									/* 上升赔率 */
									OddsUpData={OddsUpData}
									/* 下降赔率 */
									OddsDown={OddsDown}
									/* 注单类型  单投 - 混合 - 系统混合 */
									BetActiveType={3}
									/* 盘口检查数据 */
									BetInfoData={BetInfoData}
									/* 投注金額 */
									BetAmountData={BetAmountData}
									/* 键盘金额计算 */
									modifyNum={this.props.modifyNum}
									/* 選擇免費投注 */
									chooseFreeBet={this.props.chooseFreeBet}
									/* 监听滚动事件 */
									_onScrollEvent={this.props._onScrollEvent}
									/* 删除购物车盘口 */
									RemoveBetCart={this.props.RemoveBetCart}
									/* 会员余额 */
									Balance={this.props.Balance}
									/* 厂商模块 */
									Vendor={this.props.Vendor}
								/>
							</View>
						</ScrollView>
						<CannotBetting
							detailWidth={detailWidth}
							detailHeight={detailHeight}
							RemoveBetCart={this.props.RemoveBetCart}
							type={3}
							isNotEnoughSelections={isNotEnoughSelections}
						/>
					</View>
				)}
			</View>
		);
	}
}

export default CrossBettingSystem;