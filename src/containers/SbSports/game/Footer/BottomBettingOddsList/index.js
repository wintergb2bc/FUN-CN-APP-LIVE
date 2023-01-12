/* ******************** 购物车投注盘口列表 ********************** */
import React from 'react';
import {
	SelectionChangeType,
	SelectionStatusType,
	VendorErrorType,
	SpecialUpdateType
} from './../../../lib/vendor/data/VendorConsts';
import { numberWithCommas } from '../BettingDataCheck';
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
import BetKeyboard from '../BottomNumberKeyboard/';
import Bettotalamount from '../BottomSubmitBetting/';

/* app因為 投注選項 和 下注玩法 需要包在同一個scrollview下面，所以修改架構 */
/* 原本的 BetOdds 是三種玩法共用，在app改名為 SingleBetting 給 單注 專用 */
/* 在app另外加上 BetOddsList 給 兩種串關 展示投注選項(這個模塊直接抄 SingleBetting 裡面 展示投注選項 的代碼) */
/* 文檔名不動，這樣方便跟mobile代碼對上 */
class SingleBetting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ShowKeyboard: false, //是否展示數字輸入鍵盤
			Activeinput: 0, //當前選擇的投注選項index
		};
		this._refsBetKeyboard = React.createRef();
	}

	render() {
		const { ShowKeyboard, Activeinput } = this.state;
		let { BetActiveType, BetInfoData, BetAmountData, OddsUpData, OddsDown, Vendor, Balance, detailWidth, detailHeight } = this.props;
		const { Selections, BetSettings } = BetInfoData;
		let ComboCountlist = [];
		let Errorlist = [];
		let EstimatedPayoutRatelist = [];
		let BetAmountvallist = [];
		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height

		//投注不可用的置灰模塊
		const DisableBetBlock = (props) => {
			return <Touch
				style={[styles.CantPlay,{width: width - 20,}]}
				onPress={() => {
					this.props.RemoveBetCart(props.item);
				}}
			>
				<View style={styles.CantPlayErr}>
					<Text style={{ color: '#fff' }}>{props.message}</Text>
				</View>
			</Touch>
		}

		return (
			<View style={{ height: (height * 0.9) - 90 }} key={BetActiveType}>
				{(Selections && Selections.length > 0) ? (
					<View style={{ height: (height * 0.9) - 90 }}>
						<ScrollView
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}

						>
							<View style={{ paddingBottom: 120 }}>
								{Selections.map((item, index) => {
									//這邊金額的相關計算都只有 單投 適用
									//對串投來說 這裡只是拿來顯示 投注選項而已 實際的投注動作 在 crossbetting 裡面處理
									const betAmountDataKey = item.EventId; //單注用EventId作為key
									const targetAmountData = BetAmountData.find(v => v.key == betAmountDataKey);
									let Amount = targetAmountData ? targetAmountData.betAmount : '';

									//只適用單投
									const targetBetSetting =
										BetSettings !== null
											? BetSettings[index] != null ? BetSettings[index] : false
											: false;
									/* 金额统一乘 负数盘比例（RealBetAmountRate），如果不是负数盘 比例返回的是 （1）  所以统一都乘 RealBetAmountRate */
									let AmountSet = targetBetSetting
										? Number(Number(Amount) * Number(targetBetSetting.RealBetAmountRate)).toFixed(2)
										: 0;
									BetAmountvallist[index] = (Amount == '') ? 0 : Amount;
									ComboCountlist[index] = AmountSet;
									if (BetSettings && BetActiveType == 1) {
										EstimatedPayoutRatelist[index] = targetBetSetting
											? (Number(BetAmountvallist[index]) *
												Number(targetBetSetting.EstimatedPayoutRate)).toFixed(2)
											: 0;
									}
									/* 检测盘口是否关闭 */
									const oddsClosed = (BetActiveType == 1) ? ((item.SelectionStatus !== SelectionStatusType.OK) || !targetBetSetting)  //單注才有對應的BetSetting
										: (item.SelectionStatus !== SelectionStatusType.OK)

									const oddsClosedName = (item.SelectionStatus === SelectionStatusType.UPDATING || item.SelectionStatus === SelectionStatusType.EUODDSONLY)
										? item.SelectionStatusName
										: '盘口关闭';

									//上下限異常(賠率更新中)
									const oddsUpdating = (BetActiveType == 1) && targetBetSetting && targetBetSetting.MinAmount == 0 && targetBetSetting.MaxAmount == 0;

									//不支持串投
									const NoParlay = (BetActiveType == 2 || BetActiveType == 3) && !item.IsOpenParlay;

									const CantPlay = oddsClosed || oddsUpdating;

									/* 上升盘口 */
									let result =
										OddsUpData != ''
											? OddsUpData.some(function (items) {
												if (item.SelectionId == items.SelectionId) {
													return true;
												}
											})
											: false;
									/* 下降盘口 */
									let resultd =
										OddsDown != ''
											? OddsDown.some(function (items) {
												if (item.SelectionId == items.SelectionId) {
													return true;
												}
											})
											: false;
									/* 实际投注金额判断 */
									let ActualBetAmount = targetBetSetting ? targetBetSetting.IsMinusOdds : false;
									/* 错误的投注金额 */
									let Amounterror =
										AmountSet != '0.00' && targetBetSetting
											? AmountSet < targetBetSetting.MinAmount || AmountSet > targetBetSetting.MaxAmount
											: false;

									/* 错误对象 */
									let AmountCheck = {
										Amounterror: Amounterror,
										Amount: AmountSet
									};
									Errorlist.push(AmountCheck);
									let AmountFixed = Amount != '' && Amount != 'undefined' ? Number(Amount).toFixed(2) : '';
									return item ? (
										<View key={index}>
											<View style={[styles.Betinputlist,{width: width,}]}>
												<View style={[styles.input_area,{width: width - 20, borderBottomLeftRadius: Activeinput == index && ShowKeyboard ? 0: 10, borderBottomRightRadius: Activeinput == index && ShowKeyboard ? 0: 10}]}>
													{
														NoParlay ? <DisableBetBlock item={item} message={'不支持串关投注'} />
															: oddsClosed ? <DisableBetBlock item={item} message={oddsClosedName} />
															: oddsUpdating ? <DisableBetBlock item={item} message={'赔率更新中'} />
																: null
													}

													<View style={styles.closeLeft}>
														<Touch
															// style={styles.closeLeft}
															onPress={() => {
																this.props.RemoveBetCart(item);
															}}
															style={{ paddingLeft: 10, }}
														>
															<Image resizeMode='stretch' source={require('../../../images/close.png')} style={{ width: 12, height: 12 }} />
															{/* <ReactSVG className="Betting-closem -svg" src={'/svg/betting/close.svg'} /> */}
														</Touch>
													</View>
													<View style={[styles.itemRight,{width: width - 35 - 20,}]}>
														<View style={[styles.iteamName,{width: width - 55,}]}>
															{item.IsOutRightEvent ? (
																<Text style={{ color: '#000', width: (width - 80) * 0.6, fontWeight: 'bold' }}>{`${item.OutRightEventName}`}</Text>
															) : (
																<Text style={{ color: '#000', width: (width - 80) * 0.6, fontWeight: 'bold' }}>
																	{item.HomeTeamName} vs {item.AwayTeamName}
																</Text>
															)}
															<View>
																{result ? (
																	<View style={styles.OddsTxt}>
																		{/* @<span
																dangerouslySetInnerHTML={{
																	__html: ChangeSvg(item.DisplayOdds)
																}}
																className="NumberBet"
															/>
															<img src="/svg/betting/round-up.svg" /> */}
																		<Text style={{ color: 'red', fontSize: 18, paddingRight: 5 }}>
																			@ {item.DisplayOdds}
																		</Text>
																		<Image resizeMode='stretch' source={require('../../../images/betting/round-up.png')} style={{ width: 12, height: 12 }} />
																	</View>
																) : resultd ? (
																	<View style={styles.OddsTxt}>
																		{/* @<span
																dangerouslySetInnerHTML={{
																	__html: ChangeSvg(item.DisplayOdds)
																}}
																className="NumberBet"
															/>
															<img src="/svg/betting/round-down.svg" /> */}
																		<Text style={{ color: '#0ccc3c', fontSize: 18, paddingRight: 5 }}>
																			@ {item.DisplayOdds}
																		</Text>
																		<Image resizeMode='stretch' source={require('../../../images/betting/round-down.png')} style={{ width: 12, height: 12 }} />
																	</View>
																) : (
																	<View style={styles.OddsTxt}>
																		<Text style={{ color: '#00a6ff', fontSize: 18, paddingRight: 5 }}>
																			@ {item.DisplayOdds}
																		</Text>
																	</View>
																)}
															</View>
														</View>
														<View style={[styles.iteamTime,{width: width - 55,}]}>
															<Text style={{ color: '#999', width: (width - 80) * 0.4 }}>{item.LeagueName}</Text>
															<Text style={{ color: '#000', fontWeight: 'bold', textAlign: 'right', width: (width - 80) * 0.4 }}>{item.SelectionDesc}</Text>
														</View>
														<View style={[styles.iteamInput,{width: width - 55,}]}>
															<Text className="gray Nameset" style={{width: width * 0.45, color: '#999999'}}>
																{item.LineDesc != 'undefined' ? item.LineDesc : ''}
															</Text>
															{/* 投注金額輸入框 只適用於單投 */}
															{BetActiveType === 1 && (
																<Touch
																	style={[styles.InputBox,{width: width * 0.31,borderColor: this.state.ShowKeyboard? '#00A6FF': '#fff'}]}
																	onPress={() => {
																		if (CantPlay) return;
																		this.setState({
																			ShowKeyboard: true,
																			Activeinput: index
																		});
																		this.props._onScrollEvent(index);
																	}}
																>
																	<Text style={{ color: '#000', fontWeight: 'bold', lineHeight: 35, paddingLeft: 2, }}>￥</Text>
																	<Text style={{ color: '#000', lineHeight: 35, fontWeight: 'bold' }}>{AmountFixed}</Text>
																	{/* <TextInput
														defaultValue={AmountFixed}
														style={{ width: '100%' }}
														disabled
														className={
															ShowKeyboard && Activeinput == index ? (
																'Inputactive input'
															) : (
																	'input'
																)
														}
														key={Amount}
														/> */}
																	{/* 兼容火狐 input disabled 无法触发click事件问题 放一个覆盖层 */}
																	{/* <Touch
															className="Falseinput"
															onPress={() => {
																if (CantPlay != '-1') return;
																this.setState({
																	ShowKeyboard: true,
																	Activeinput: index
																});
																this.props._onScrollEvent(index);
															}}
														/> */}
																</Touch>
															)}
														</View>
														{/* 负数盘 实际投注金额 */}
														{ActualBetAmount && (
															<View>
																<Text style={styles.ActualBetAmount}>实际投注￥ {numberWithCommas(AmountSet)}</Text>
															</View>
														)}
														{BetActiveType == 1 &&
														targetBetSetting &&
														ShowKeyboard &&
														Amounterror && (
															<View style={[styles.maxMinErr,{width: width - 55,}]}>
																<View style={[styles.maxMinErrView,{width: width - 85,}]}>
																		<Text
																			style={styles.maxMinErrTxt}
																			// style={{
																			// 	display: Errorlist[index].Amounterror ? 'flex' : 'none'
																			// }}
																		>
																			{Errorlist[index].Amount < targetBetSetting.MinAmount &&
																			`金额必须为￥ ${numberWithCommas(targetBetSetting.MinAmount)} 或以上的金额`}
																			{Errorlist[index].Amount != '' &&
																			Errorlist[index].Amount > targetBetSetting.MaxAmount &&
																			`金额必须为￥ ${numberWithCommas(targetBetSetting.MaxAmount)} 或以下的金额`}
																		</Text>
																</View>
															</View>
														)}

														{BetActiveType == 1 &&
														BetSettings != null && (
															<View style={[styles.lightGray,{width: width - 55}]}>
																<Text style={{ fontSize: 12, maxWidth: width * 0.36, color: '#BCBEC3' }}>
																	可赢金额:￥{BetAmountvallist[index] == '' || !targetBetSetting ? (
																	0
																) : (
																	(Number(BetAmountvallist[index]) *
																		Number(targetBetSetting.EstimatedPayoutRate)).toFixed(2)
																)}
																</Text>
																<Text style={{ fontSize: 12, color: '#BCBEC3' }}>
																	最低-最高:￥{targetBetSetting ? (
																	numberWithCommas(targetBetSetting.MinAmount)
																) : (
																	0
																)}-￥{targetBetSetting ? (
																	numberWithCommas(targetBetSetting.MaxAmount)
																) : (
																	0
																)}
																</Text>
															</View>
														)}
													</View>
												</View>

											</View>
											{/* 投注键盘 只适用于单投 */}
											{BetActiveType == 1 && (
												<View style={[styles.ShowKeyboardBox,{width: width - 20,}]}>
													{ShowKeyboard &&
													Activeinput == index &&
													!CantPlay &&
													targetBetSetting && (
														<BetKeyboard
															isLandscape={this.props.isLandscape}
															detailWidth={detailWidth}
															detailHeight={detailHeight}
															modifyNum={this.props.modifyNum}
															chooseFreeBet={this.props.chooseFreeBet}
															BetSetting={targetBetSetting}
															BetAmountData={BetAmountData}
															BetAmountDataKey={betAmountDataKey}
															Balance={this.props.Balance}
															ref={this._refsBetKeyboard}
															Vendor={Vendor}
														/>
													)}
												</View>
											)}
										</View>
									) : (
										<View className="errortxt" key={index}>此盘口关闭，或刷新试试！</View>
									);
								})}

							</View>
						</ScrollView>

						{/* 投注金額總計和投注按鈕 只适用于单投 且單投 沒有免費投注 */}
						<View style={{ position: 'absolute', bottom: 0, left: 0 }}>
							{/* 适用于单投 */}
							{BetActiveType == 1 && (
								<Bettotalamount
									EuroCupBet={this.props.EuroCupBet}
									EuroCupBetDetail={this.props.EuroCupBetDetail || false}
									detailWidth={detailWidth}
									detailHeight={detailHeight}
									Vendor={Vendor}
									/* 选择的盘口下注金额数据  */
									BetAmountvallist={BetAmountvallist}
									/* 注单数量 */
									ComboCount={ComboCountlist}
									/* 盘口的金额赔率 用于计算可盈利的金额*/
									EstimatedPayoutRatelist={EstimatedPayoutRatelist}
									/* 注单类型 */
									BetActiveType={1}
									/* 盘口的详情数据 */
									BetInfoData={BetInfoData}
									/* 开始下注 */
									StartBetting={this.props.StartBetting}
									/* 删除购物车 */
									RemoveBetCart={this.props.RemoveBetCart}
									/* 关闭投注框 */
									CloseBottomSheet={this.props.CloseBottomSheet}
									/* 当前选择的盘口key */
									ActiveInput={Activeinput}
									FreeBetTokenList={[]}
									Amounterror={
										Errorlist.filter((item) => item && item.Amounterror == true) != ''
									}
									Balance={Balance}
								/>
							)}
						</View>
					</View>
				) : (
					<View className="errortxt">此盘口关闭，或刷新试试！</View>
				)}
			</View>
		);
	}
}

export default SingleBetting;