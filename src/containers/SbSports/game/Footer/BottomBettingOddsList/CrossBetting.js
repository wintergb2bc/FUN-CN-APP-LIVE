/* ************* 串关 投注设置详情  例如 2串1 3串1 **************** */

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
import ComboBonusModal from '../../ComboBonusModal';
import { numberWithCommas } from '../BettingDataCheck';
import BetKeyboard from '../BottomNumberKeyboard/';
import Bettotalamount from '../BottomSubmitBetting/';
import CannotBetting from './CannotBetting';
import {Decimal} from "decimal.js";
import BetOddsList from './BetOddsList';

class CrossBetting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ShowKeyboard: false,
			Activeinput: 0,
			showgift: false,
			showgiftModal: false
		};
		this._refsBetKeyboard = React.createRef();
	}

	render() {
		const { ShowKeyboard, Activeinput } = this.state;
		const { BetInfoData, BetAmountData, OddsUpData, OddsDown, Balance, Vendor, detailWidth,detailHeight } = this.props;
		const { BetSettings, Selections } = BetInfoData;
		let BetAmountvallist = [];
		let Errorlist = [];
		let ComboCountlist = [];
		let EstimatedPayoutRatelist = [];
		let FreeBetTokenList = [];

		//無法投注原因
		let isNotEnoughSelections = false;
		if (!BetSettings || BetSettings.length <= 0) {
			//過濾掉 不支持串關 和 狀態異常 的投注選項，剩下的不到兩個 => 無法投注
			isNotEnoughSelections = BetInfoData.getSelectionsForCombo().length < 2;
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
									BetActiveType={2}
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
								{BetSettings.map((item, index) => {
									const betAmountDataKey = item.ComboType; //串關用 串關方式 作為key
									const targetAmountData = BetAmountData.find(v => v.key == betAmountDataKey);
									const Amount = targetAmountData ? targetAmountData.betAmount : '';
									BetAmountvallist[index] = (Amount == '') ? 0 : Amount;
									ComboCountlist[index] = item.ComboCount * Amount;
									EstimatedPayoutRatelist[index] = (Number(BetAmountvallist[index]) *
										Number(item.EstimatedPayoutRate)).toFixed(2);

									//免費投注
									const thisFreeBetToken = targetAmountData ? targetAmountData.freeBetToken : null;
									FreeBetTokenList[index] = thisFreeBetToken;
									let thisFreeBetData = null;
									if (thisFreeBetToken) {
										thisFreeBetData = (item && item.FreeBets)
											? item.FreeBets.find(fb => fb.FreeBetToken == thisFreeBetToken)
											: null;
									}

									let thisMinAmount = item.MinAmount;
									//免費投注影響投注下限
									if (thisFreeBetData) {
										if (thisFreeBetData.FreeBetAmount > (item.ComboCount * item.MinAmount)) {
											thisMinAmount = new Decimal(thisFreeBetData.FreeBetAmount).dividedBy(item.ComboCount).toDecimalPlaces(0,2).toNumber(); //無條件進位
										}
									}

									let result =
										OddsUpData != ''
											? OddsUpData.some(function (items) {
												if (item.SelectionId == items.SelectionId) {
													return true;
												}
											})
											: false;
									let resultd =
										OddsDown != ''
											? OddsDown.some(function (items) {
												if (item.SelectionId == items.SelectionId) {
													return true;
												}
											})
											: false;

									let Amounterror =
										Amount != '' ? Amount < thisMinAmount || Amount > item.MaxAmount : false;
									let AmountCheck = {
										Amounterror: Amounterror,
										Amount: Amount
									};
									Errorlist.push(AmountCheck);
									let AmountFixed =
										Amount != '' && Amount != 'undefined' ? Number(Amount).toFixed(2) : '';

									return (
										<View key={index}>
											<View style={[styles.Settingsinput,{width: width - 20, marginTop: 10, marginBottom: 0, borderBottomRightRadius: ShowKeyboard && Activeinput == index ? 0: 10, borderBottomLeftRadius: ShowKeyboard && Activeinput == index ? 0: 10}]}>
												<View style={styles.list_Inputdata}>
													{result ? (
														<View style={styles.OddsTxt}>
															<Text>
																{item.ComboTypeName}x{item.ComboCount}
															</Text>
															<View style={styles.OddsTxt}>
																<Text style={{ color: 'red', paddingRight: 5 }}>
																	@ {Number(item.EstimatedPayoutRate.toFixed(2))}
																</Text>
																<Image resizeMode='stretch' source={require('../../../images/betting/round-up.png')} style={{ width: 12, height: 12 }} />
																{/* @<span
												dangerouslySetInnerHTML={{
													__html: ChangeSvg(
														Number(item.EstimatedPayoutRate.toFixed(2))
													)
												}}
												className="NumberBet"
											/>
											<img src="/svg/betting/round-up.svg" /> */}
															</View>
														</View>
													) : resultd ? (
														<View style={styles.OddsTxt}>
															<Text>
																{item.ComboTypeName}x{item.ComboCount}
															</Text>
															<View style={styles.OddsTxt}>
																<Text style={{ color: '#0ccc3c', paddingRight: 5 }}>
																	@ {Number(item.EstimatedPayoutRate.toFixed(2))}
																</Text>
																<Image resizeMode='stretch' source={require('../../../images/betting/round-down.png')} style={{ width: 12, height: 12 }} />
																{/* @<span
												dangerouslySetInnerHTML={{
													__html: ChangeSvg(
														Number(item.EstimatedPayoutRate.toFixed(2))
													)
												}}
												className="NumberBet"
											/>
											<img src="/svg/betting/round-down.svg" /> */}
															</View>
														</View>
													) : (
														<View style={styles.OddsTxt}>
															<Text>
																{item.ComboTypeName}x{item.ComboCount}
															</Text>
															<View style={styles.OddsTxt}>
																<Text style={{ color: '#0ccc3c', paddingRight: 5 }}>
																	@ {Number(item.EstimatedPayoutRate.toFixed(2))}
																</Text>
																{/* @<span
												dangerouslySetInnerHTML={{
													__html: ChangeSvg(
														Number(item.EstimatedPayoutRate.toFixed(2))
													)
												}}
												className="NumberBet"
											/>
											<img src="/svg/betting/round-down.svg" /> */}
															</View>

														</View>
													)}

													<Touch
														style={[styles.InputBox,{width: width * 0.31 ,borderColor: this.state.ShowKeyboard? '#00A6FF': '#fff'}]}
														onPress={() => {
															this.setState({
																ShowKeyboard: true,
																Activeinput: index
															});
														}}
													>
														<Text style={{ color: '#000', fontWeight: 'bold', lineHeight: 35, paddingLeft: 2, }}>￥</Text>
														<Text style={{ color: '#000', lineHeight: 35, fontWeight: 'bold' }}>{AmountFixed}</Text>
													</Touch>
													{
														// 	<div className="InputBox">
														// 	<span className="icon">￥</span>
														// 	<input
														// 		defaultValue={AmountFixed}
														// 		style={{ width: '100%' }}
														// 		disabled
														// 		className={
														// 			ShowKeyboard && Activeinput == index ? (
														// 				'Inputactive input'
														// 			) : (
														// 					'input'
														// 				)
														// 		}
														// 		key={Amount}
														// 	/>
														// 	<div
														// 		className="Falseinput"
														// 		onClick={() => {
														// 			this.setState({
														// 				ShowKeyboard: true,
														// 				Activeinput: index
														// 			});
														// 		}}
														// 	/>
														// </div>
													}
												</View>

												{
													Errorlist[index].Amounterror &&
													<View style={[styles.maxMinErr,{width: width - 55,backgroundColor: '#fee0e0',}]}>
														{
															ShowKeyboard && (
																<Text
																	style={styles.maxMiinErrTxt2}
																>
																	{Errorlist[index].Amount < thisMinAmount &&
																	`金额必须为￥ ${numberWithCommas(thisMinAmount)} 或以上的金额`}
																	{Errorlist[index].Amount != '' &&
																	Errorlist[index].Amount > item.MaxAmount &&
																	`金额必须为￥ ${numberWithCommas(item.MaxAmount)} 或以下的金额`}
																</Text>
															)}
													</View>
												}
												{/* {ShowKeyboard &&
								Errorlist != '' && (

									// <p
									// 	className="Error"
									// 	style={{
									// 		display: Errorlist[index].Amounterror ? 'flex' : 'none'
									// 	}}
									// >
									// 	{Errorlist[index].Amount < thisMinAmount &&
									// 		`金额必须为￥ ${numberWithCommas(thisMinAmount)} 或以上的金额`}
									// 	{Errorlist[index].Amount > item.MaxAmount &&
									// 		`金额必须为￥ ${numberWithCommas(item.MaxAmount)} 或以下的金额`}
									// </p>
								)} */}
												<View className="gift-freebet">
													{item.HasComboBonus ?
														<View className="gift">
															<Touch style={styles.gift} onPress={() => {this.setState({showgift: !this.state.showgift})}}>
																<View style={styles.giftBg}>
																	<Image resizeMode='stretch' source={require('../../../images/betting/orange.png')} style={{ width: 75, height: 35 }} />
																</View>
																<Text style={{color: '#fff'}}>{item.ComboBonusPercentage}%</Text>
																<Image resizeMode='stretch' source={require('../../../images/betting/gift.png')} style={{ width: 22, height: 22 }} />
															</Touch>
															{this.state.showgift && (
																<View style={styles.gift_alert}>
																	<View style={styles.arrow} />
																	<View style={styles.giftView}>
																		<View style={styles.giftViewList}>
																			<Text style={{color: '#fff', lineHeight: 35}}>串关奖励</Text>
																			<Touch onPress={() => { this.setState({ showgift: false }) }}>
																				<Image resizeMode='stretch' source={require('../../../images/closeWhite.png')} style={{ width: 20, height: 20 }} />
																			</Touch>
																		</View>
																		<View style={styles.giftViewList}>
																			<View>
																				<Text style={{color: '#fff', fontSize: 12}}>
																					串关奖励 系统将依据您投注的串关数给予
																				</Text>
																				<Text style={{color: '#fff', fontSize: 12}}>
																					您高{item.ComboBonusPercentage}%的额外赔率奖励
																				</Text>
																			</View>
																			<Touch
																				onPress={() => {
																					this.setState({ showgiftModal: true });
																				}}
																				style={styles.giftDetail}
																			>
																				<Text style={{color: '#000', fontSize: 12}}>查看详情</Text>
																			</Touch>
																		</View>
																	</View>
																</View>
															)}
															{
																this.state.showgiftModal &&
																<ComboBonusModal
																	visible={this.state.showgiftModal}
																	onClose={() => {
																		this.setState({
																			showgiftModal: false
																		});
																	}}
																/>
															}

														</View>
														: (thisFreeBetData ? <View /> : null)}
													{
														thisFreeBetData &&
														<View><Text>{'使用 ' + thisFreeBetData.FreeBetAmount + ' 元串关免费彩金'}</Text></View>
													}
												</View>

												{/* <View className="list Amountdata">
								<small className="light-gray">
									可赢金额：￥{BetAmountvallist[index] == '' ? (
										0
									) : (
											(Number(BetAmountvallist[index]) *
												Number(item.EstimatedPayoutRate)).toFixed(2)
										)}
								</small>
								<small className="light-gray">
									最低-最高:￥{numberWithCommas(item.MinAmount)}-￥{numberWithCommas(item.MaxAmount)}
								</small>
							</View> */}
												<View style={[styles.lightGray,{width: width - 55, paddingLeft: 0, paddingRight: 0,paddingTop: 8,}]}>
													<Text style={{ fontSize: 12, color: '#BCBEC3' }}>
														可赢金额：￥{BetAmountvallist[index] == '' ? (
														0
													) : (
														(Number(BetAmountvallist[index]) *
															Number(item.EstimatedPayoutRate)).toFixed(2)
													)}
													</Text>
													<Text style={{ fontSize: 12, color: '#BCBEC3' }}>
														最低-最高:￥{numberWithCommas(thisMinAmount)}-￥{numberWithCommas(item.MaxAmount)}
													</Text>
												</View>

											</View>
											{/* 投注键盘 */}
											<View style={[styles.ShowKeyboardBox,{width: width - 20,}]}>
												{ShowKeyboard &&
												Activeinput == index && (
													<BetKeyboard
														isLandscape={this.props.isLandscape}
														detailWidth={detailWidth}
														detailHeight={detailHeight}
														modifyNum={this.props.modifyNum}
														chooseFreeBet={this.props.chooseFreeBet}
														BetSetting={item}
														BetAmountData={BetAmountData}
														BetAmountDataKey={betAmountDataKey}
														Balance={this.props.Balance}
														ref={this._refsBetKeyboard}
														Vendor={Vendor}
													/>
												)}
											</View>
										</View>
									);
								})}
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
								BetActiveType={2}
								BetInfoData={BetInfoData}
								StartBetting={this.props.StartBetting}
								RemoveBetCart={this.props.RemoveBetCart}
								CloseBottomSheet={this.props.CloseBottomSheet}
								ActiveInput={Activeinput}
								FreeBetTokenList={FreeBetTokenList}
								Amounterror={
									Errorlist != '' ? Errorlist.filter((item) => item.Amounterror == true) != '' : false
								}
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
									BetActiveType={2}
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
							type={2}
							isNotEnoughSelections={isNotEnoughSelections}
						/>
					</View>
				)}
			</View>
		);
	}
}

export default CrossBetting;