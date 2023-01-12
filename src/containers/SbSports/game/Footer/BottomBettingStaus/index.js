/* ************* 投注状态 投注中 - 投注成功 - 投注失败************** */
import React from 'react';
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
import ComboBonusModal from '../../ComboBonusModal';

class Betstatus extends React.Component {
	state = {
		showgift: false
	};
	render() {
		const {
			BettingList,
			BetActiveType,
			detailWidth,
			detailHeight,
		} = this.props;

		//投注結果標示模塊
		const HighlightBetBlock = (props) => {
			return <View style={[styles.CantPlay,{width: width - 20,},props.extraStyle1 ? props.extraStyle1 : {}]}>
				<View style={[styles.CantPlayErr,props.extraStyle2 ? props.extraStyle2 : {}]}>
					<Text style={{ color: '#000', fontWeight: 'bold'}}>{props.msg}</Text>
				</View>
			</View>
		}

		//單注才有的數據
		let SingleBetDataArray = [];

		//串關才有的數據
		let ComobBetDataArray = [];
		let hasComboBonus = false; //是否有串關獎勵
		let comboBonusExtraMoney = 0; //串關獎勵額外盈利

		let Selections = []; //投注選項 用於展示
		let totalBet = 0; //總投注額
		let totalWin = 0; //總可贏金額


		//單注
		if (BetActiveType == 1) {
			BettingList.map((bettingObj) => {

				//計算單注相關金額
				const betSetting = bettingObj.betInfo.BetSettings;
				//是否負數盤
				const IsMinusOdds = betSetting ? betSetting.IsMinusOdds : false;
				const BetAmount = bettingObj.amount
				/* 實際投注金額  金额统一乘 负数盘比例（RealBetAmountRate），如果不是负数盘 比例返回的是 （1）  所以统一都乘 RealBetAmountRate */
				const RealBetAmount = betSetting
					? Number(Number(BetAmount) * Number(betSetting.RealBetAmountRate)).toFixed(2)
					: 0;
				//可贏金額 (EstimatedPayoutRate有針對負數盤做調整，所以還是用BetAmount去乘，不是用RealBetAmount)
				const CanWinAmount = betSetting
					? Number(Number(BetAmount) * Number(betSetting.EstimatedPayoutRate)).toFixed(2)
					: 0;

				totalBet = totalBet + Number(RealBetAmount);
				totalWin = totalWin + Number(CanWinAmount);

				SingleBetDataArray.push({
					IsMinusOdds,
					BetAmount,
					RealBetAmount,
					CanWinAmount,
					//增加字段用於展示 投注狀態
					betResultStatus:bettingObj.betResultStatus,
					errorMsg:bettingObj.errorMsg
				});

				//合併selection，用於展示
				Selections.push(bettingObj.betInfo.Selections);
			});
		} else {
			//串關
			//Selections都一樣 只取第一個BetInfo的Selections
			Selections = BettingList[0].betInfo.Selections;

			//只有串投才有串關獎勵，系統混合沒有
			if (BetActiveType == 2) {
				hasComboBonus = BettingList.filter(b => b.betInfo.HasComboBonus).length > 0;
			}

			BettingList.map((bettingObj,index) => {
				const binfo = bettingObj.betInfo;
				let item = null;
				if (BetActiveType == 2) {
					item = binfo.BetSettings.find(s => s.ComboType == bettingObj.comboType);
				} else {
					item = binfo.SystemParlayBetSettings.find(s => s.ComboType == bettingObj.comboType);
				}

				console.log('====betInfo', JSON.parse(JSON.stringify(item)));

				const BetAmount = bettingObj.amount;
				const CanWinAmount = BetAmount * Number(item.EstimatedPayoutRate);
				const TotalBetAmount = BetAmount * item.ComboCount;


				totalBet = totalBet + Number(TotalBetAmount);
				totalWin = totalWin + Number(CanWinAmount);

				ComobBetDataArray.push({BetAmount,CanWinAmount,BetSetting: item});

				if (item.HasComboBonus) {
					//額外盈利 = 投注額 x (EstimatedPayoutRate - OriginEstimatedPayoutRate)
					comboBonusExtraMoney = comboBonusExtraMoney + (BetAmount * (item.EstimatedPayoutRate - item.OriginEstimatedPayoutRate));
				}
			})
		}

		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (
			<View style={styles.betstatus}>
				{(Selections && Selections.length > 0) ? (
				<View>
					{Selections.map((item, index) => {

						const SingleBetData = SingleBetDataArray[index]; //單注數據
						return (
							<View key={index} style={[styles.Betlistitem,{width: width - 20,}]}>
								<View style={[styles.betitem,{width: width - 50,}]}>
									{item.IsOutRightEvent ? (
										<Text style={[styles.teamName,{width: width * 0.7}]}>{`${item.OutRightEventName}`}</Text>
									) : (
										<Text style={[styles.teamName,{width: width * 0.7}]}>{`${item.HomeTeamName +
										' vs ' +
										item.AwayTeamName}`}</Text>
									)}
									<View>
										<Text style={{ color: '#00a6ff', fontSize: 17 }}>
											@{item.DisplayOdds}
											{/* @<span
													dangerouslySetInnerHTML={{
														__html: ChangeSvg(item.DisplayOdds)
													}}
													className="NumberBet"
												/> */}
										</Text>
									</View>
								</View>
								<View style={[styles.betitem,{width: width - 50,}]}>
									<Text style={{ color: '#999', width: width * 0.4 }}>{item.LeagueName}</Text>
									<Text style={{ color: '#000', fontWeight: 'bold', width: width * 0.4, textAlign: 'right' }}>{item.SelectionDesc}</Text>
								</View>
								<View style={[styles.betitem,{width: width - 50,}]}>
									<Text style={{ color: '#000',width: width * 0.6 }}>{item.LineDesc}</Text>
									{/* 投注金額框 只適用於單投 */}
									{BetActiveType == 1 && (
										<View style={{ display: 'flex', flexDirection: 'row' }}>
											<Text>投注额：</Text>
											<Text style={{ color: '#000', fontWeight: 'bold'}}>￥{SingleBetData.BetAmount}</Text>
										</View>
									)}
								</View>
								{/* 负数盘 实际投注金额 */}
								{BetActiveType == 1 && SingleBetData.IsMinusOdds && (
									<View style={[styles.betitem,{width: width - 50, paddingBottom: 0}]}>
										<Text style={{ color: '#000' }}></Text>
										<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
											<Text style={{ color: '#bcbec3', fontSize: 10}}>实际投注：￥{numberWithCommas(SingleBetData.RealBetAmount)}</Text>
										</View>
									</View>
								)}
								{BetActiveType == 1 && (
									<View style={[styles.betitem,{width: width - 50, paddingBottom: 0}]}>
										<Text style={{ color: '#000' }}></Text>
										<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
											<Text style={{ color: '#bcbec3', fontSize: 10}}>可赢金额：￥{SingleBetData.CanWinAmount}</Text>
										</View>
									</View>
								)}
								{BetActiveType == 1 && (<>
									{/* 0未開始 1投注中 2成功 3失敗 4pending 5賠率變更(等待確認重試) */}
									{SingleBetData.betResultStatus === 2 && (
										<HighlightBetBlock msg={'投注成功'} extraStyle1={styles.CantPlay_BetSuccess} extraStyle2={styles.CantPlayErr_BetSuccess}/>
									)}
									{SingleBetData.betResultStatus === 3 && (
										<HighlightBetBlock msg={SingleBetData.errorMsg || '投注失败'} extraStyle1={styles.CantPlay_BetFail} />
									)}
									{SingleBetData.betResultStatus === 4 && (
										<HighlightBetBlock msg={'等待确认中'} extraStyle1={styles.CantPlay_Pending} extraStyle2={styles.CantPlayErr_Pending}/>
									)}
									{SingleBetData.betResultStatus === 5 && (
										<HighlightBetBlock msg={'赔率变更'} extraStyle1={styles.CantPlay_OddsChanged} extraStyle2={styles.CantPlayErr_OddsChanged}/>
									)}
								</>)}
							</View>
						);
					})}
				</View>
				) : null}
				<View className="Bottom-btn">
					{BetActiveType == 2 && <Text style={{color: '#000', fontWeight: 'bold'}}>混合过关</Text>}
					{BetActiveType == 3 && <Text style={{color: '#000', fontWeight: 'bold'}}>系统混合过关</Text>}
					{(BetActiveType == 2 || BetActiveType == 3) &&
					BettingList.map((bettingObj, index) => {
						const ComboBetData = ComobBetDataArray[index]; //串投數據
						const item = ComboBetData.BetSetting;

						return (
							<View style={{paddingBottom: 15}}key={index}>
								<View>
									<Text className="set-gray">
										{item.ComboTypeName} x {item.ComboCount}@{item.EstimatedPayoutRate}
									</Text>
									{item.HasComboBonus && (
										<Touch
											onPress={() => {
												this.setState({
													showgift: !this.state.showgift
												});
											}} className="gift" style={styles.gift}>
											<View style={styles.giftBg}>
												<Image resizeMode='stretch' source={require('../../../images/betting/orange.png')} style={{ width: 75, height: 35 }} />
											</View>
											<Text style={{ color: '#fff', paddingRight: 8 }}>{item.ComboBonusPercentage}%</Text>
											<Image resizeMode='stretch' source={require('../../../images/betting/gift.png')} style={{ width: 22, height: 22 }} />

											{/* <ReactSVG
													src={'/svg/betting/gift.svg'}
													onClick={() => {
														this.setState({
															showgift: !this.state.showgift
														});
													}}
													style={{ marginLeft: 0 }}
												/> */}
										</Touch>
									)}
									{
										this.state.showgift &&
										<ComboBonusModal
											visible={this.state.showgift}
											onClose={() => {
												this.setState({
													showgift: false
												});
											}}
										/>
									}
								</View>
								<View style={styles.BetAmountHun}>
									<Text className="light-gray">
										投注额：<Text style={{ color: '#000', fontWeight: 'bold' }}>￥{Number(ComboBetData.BetAmount).toFixed(2)}</Text>
									</Text>
									<Text className="light-gray">
										可赢金额：<Text style={{ color: '#000', fontWeight: 'bold' }}> ￥{Number(ComboBetData.CanWinAmount).toFixed(2)} </Text>
									</Text>
								</View>
								{/* 0未開始 1投注中 2成功 3失敗 4pending 5賠率變更(等待確認重試) */}
								{bettingObj.betResultStatus === 2 && (
									<HighlightBetBlock msg={'投注成功'} extraStyle1={styles.CantPlay_BetSuccess} extraStyle2={styles.CantPlayErr_BetSuccess}/>
								)}
								{bettingObj.betResultStatus === 3 && (
									<HighlightBetBlock msg={bettingObj.errorMsg || '投注失败'} extraStyle1={styles.CantPlay_BetFail} />
								)}
								{bettingObj.betResultStatus === 4 && (
									<HighlightBetBlock msg={'等待确认中'}extraStyle1={styles.CantPlay_Pending} extraStyle2={styles.CantPlayErr_Pending}/>
								)}
								{bettingObj.betResultStatus === 5 && (
									<HighlightBetBlock msg={'赔率变更'} extraStyle1={styles.CantPlay_OddsChanged} extraStyle2={styles.CantPlayErr_OddsChanged}/>
								)}
							</View>
						);
					})}
					<View style={styles.BetAmount}>
						<Text className="gray">
							总投注额：￥<Text style={{ color: '#000', fontWeight: 'bold' }}>{Number(totalBet).toFixed(2)}</Text>
						</Text>
						{hasComboBonus && (
							<View className="total-amount">
								<Text className="gray">额外赢利</Text>
								<Text>
									￥{(comboBonusExtraMoney > 0) ? (
									Number(comboBonusExtraMoney).toFixed(2)
								) : (
									0
								)}
								</Text>
							</View>
						)}
						<Text className="gray">
							可赢金额：￥<Text style={{ color: '#000', fontWeight: 'bold' }}>{Number(totalWin).toFixed(2)}</Text>
						</Text>
					</View>
				</View>
			</View>
		);
	}
}
export default Betstatus;