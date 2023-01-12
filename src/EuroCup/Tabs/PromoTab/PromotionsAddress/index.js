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

class PromotionsAddress extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Address: '',
			Remark: '',
			Active: -1,
			Successmsg: '恭喜!您申请成功',
			ShowFailPopup: false,
			ShowSuccessPopup: false,
			Failmsg: '您暂时不符合此好礼资格，建议马上存款。'
		};
	}

	componentDidMount() {
		let Addressdata = JSON.parse(localStorage.getItem('Address'));
		if (Addressdata && Addressdata != '') {
			this.setAdress(Addressdata)
		} else {
			this.getAdress()
		}
		console.log('this.props.promoid ',this.props.promoid)
		this.setState({
			promoid: this.props.promoid
		});
	}
	getAdress() {
		Toast.loading('加载中，请稍候...');
		fetchRequest(ApiPort.ShippingAddress, 'GET')
			.then((res) => {
				Toast.hide()
				if (res && res.result) {
					localStorage.setItem('Address', JSON.stringify(res.result));
					this.setAdress(res.result)
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	setAdress(Addressdata) {
		console.log('Addressdata ',Addressdata)
		let havedefault = Addressdata.find((item) => item.defaultAddress == true);
		if (havedefault) {
			this.setState({
				Active: havedefault.recordNo,
				Address: Addressdata
			});
		} else {
			this.setState({
				Active: Addressdata[0].recordNo,
				Address: Addressdata,
			});
		}
	}

	/**
	 * @description: 申请每日好礼优惠
	 * @param {*}
	 * @return {Object}
	*/

	ApplyDailyDeals = () => {
		const { Active, Remark, promoid, Address } = this.state;
		PiwikEvent('Promo Application', 'Submit', `Apply_${promoid}_EUROPage`)
		let DailyDealsPromotiondata = JSON.parse(localStorage.getItem('DailyDealsPromotiondata'));
		let promo = DailyDealsPromotiondata.find((item) => item.bonusData.bonusId == promoid);
		console.log(promo)
		let Addressdata =
			Active == -1
				? Address.find((item) => item.defaultAddress == true)
				: Address.find((item) => item.recordNo == Active);
		let postData = {
			recipientFirstName: Addressdata.firstName,
			recipientLastName: Addressdata.lastName,
			postalCode: Addressdata.postalCode,
			contactNo: Addressdata.cellphoneNo,
			email: Addressdata.email,
			province: Addressdata.provinceName,
			district: Addressdata.districtName,
			town: Addressdata.townName,
			address: Addressdata.address,
			village: '',
			houseNumber: '',
			zone: '',
			remark: Remark
		};
		Toast.loading('请稍候...');
		let query = `bonusRuleId=${promoid}&`;
		fetchRequest(ApiPort.ApplyDailyDeals + query, 'POST', postData)
			.then((res) => {
				Toast.hide();
				if (res && res.result) {
					if (res.isSuccess) {
						this.setState({
							Successmsg: res.result.message,
							ShowSuccessPopup: true
						});
					} else {
						this.setState({
							Failmsg: res.result.message,
							ShowFailPopup: true
						});
					}
				}
			})
			.catch((res) => {
				if (res.errors && res.errors[0]){
					if(res.errors[0].errorCode === "BP00006" || res.errors[0].errorCode === "BP00007"){
						Toast.fail(res.errors[0].description);	
					}
				}
				console.log(res);
			});
	};

	render() {

		const { Remark, Active, promoid, Failmsg, ShowFailPopup, Successmsg, ShowSuccessPopup, Address } = this.state;
		console.log('Address', Address);
		return (
			<View style={{ flex: 1, backgroundColor: '#EFEFF4', padding: 15, }}>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
				>
					<View style={{backgroundColor:"#E8E8E8", paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16}}>
						<Text style={{ color: '#222', lineHeight: 18, fontSize: 12 }}>FUN88 将在 30天内与您联系并寄出礼品；若没有提交表单将不能兑换此商品，且不完整和错误的信息将会使你丧失兑换礼品的权利</Text>
					</View>
					{Address != '' &&
						Address.map((data, index) => {
							const {
								firstName,
								lastName,
								cellphoneNo,
								provinceName,
								districtName,
								townName,
								address,
								postalCode,
								recordNo,
								defaultAddress
							} = data;
							let status = Active == '-1' ? defaultAddress : Active == recordNo;
							return (
								<View style={{ padding: 10, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10 }} key={index}>
									<Touch
										style={styles.address}
										key={index}
										onPress={() => {
											this.setState({
												Active: recordNo
											});
										}}
									>
										<View style={status ? styles.activeCap : styles.cap} />
										<View>
											<View style={styles.addressList}>
												<Text style={styles.addressTitle}>真实姓名</Text>
												<Text style={styles.addressAcont}>{lastName + firstName}</Text>
											</View>
											<View style={styles.addressList}>
												<Text style={styles.addressTitle}>联系电话</Text>
												<Text style={styles.addressAcont}>+86 {cellphoneNo}</Text>
											</View>
											<View style={styles.addressList}>
												<Text style={styles.addressTitle}>详细地址</Text>
												<Text style={styles.addressAcont}>{provinceName + districtName + townName + address}</Text>
											</View>
											<View style={styles.addressList}>
												<Text style={styles.addressTitle}>邮政编码</Text>
												<Text style={styles.addressAcont}>{postalCode}</Text>
											</View>

										</View>
									</Touch>
									<Touch onPress={() => {
										Actions.Newaddress({
											id: promoid,
											types: 'readOnly',
											from: 'daily',
											addresskey: recordNo,
											addressReadOnly: data,
											ShippingAddress: () => { this.getAdress() }
										})
									}} style={styles.setBtn}>
										<Image style={{ width: 16, height: 16 }} source={require('../../../../images/icon/edit.png')} />
									</Touch>
									<View style={styles.defulTxt}>{defaultAddress && <Text style={{ fontSize: 12, color: '#00A6FF' }}>默认地址</Text>}</View>
								</View>
							);
						})}
					<Touch
						style={styles.add}
						onPress={() => {
							Actions.Newaddress({
								id: promoid,
								types: 'add',
								ShippingAddress: () => { this.getAdress() }
							})
						}}
					>
						<Text style={{ color: '#00A6FF', lineHeight: 40, textAlign: 'center' }}>新增运送地址</Text>
					</Touch>
					{Address != '' && (
						<View>
							<Text style={{ lineHeight: 35, fontSize: 12 }}>备注</Text>
							<View style={styles.inputView}>
								<TextInput
									style={styles.input}
									underlineColorAndroid="transparent"
									value={Remark}
									placeholder="备注"
									placeholderTextColor="#BCBEC3"
									textContentType="username"
									onChangeText={Remark =>
										this.setState({ Remark })
									}
								/>
							</View>
							<Touch
								style={styles.subminBtn}
								onPress={() => {
									if (Active == '-1') {
										Toasts.error('请选择一条地址');
										return;
									}
									this.ApplyDailyDeals();
								}}
							>
								<Text style={{ color: '#fff', lineHeight: 40, textAlign: 'center' }}>提交</Text>
							</Touch>
						</View>
					)}
				</ScrollView>
				{/* ------------------申请失败弹窗----------------- */}
				<Modal
					animationType="none"
					transparent={true}
					visible={ShowFailPopup}
					onRequestClose={() => { }}
				>
					<View style={styles.modalMaster}>
						<View style={styles.modalView}>
							<View style={styles.modalTitle}>
								<Text style={styles.modalTitleTxt}>条件不足</Text>
							</View>
							<Text style={{ lineHeight: 70, textAlign: 'center', color: '#666' }}>{Failmsg}</Text>
							<View style={styles.modalBtn}>
								<Touch onPress={() => { this.setState({ ShowFailPopup: false }) }} style={styles.modalBtnL}>
									<Text style={{ color: '#00A6FF' }}>关闭</Text>
								</Touch>
								<Touch onPress={() => {
									this.setState({ ShowFailPopup: false }, () => { Actions.DepositCenter({ from: 'GamePage' }); PiwikEvent('Promo History', 'View', `Deposit_DailyDeal_EUROPage`) })
								}} style={styles.modalBtnR}>
									<Text style={{ color: '#fff' }}>存款</Text>
								</Touch>
							</View>
						</View>
					</View>
				</Modal>


				{/* ------------------申请成功弹窗----------------- */}

				<Modal
					animationType="none"
					transparent={true}
					visible={ShowSuccessPopup}
					onRequestClose={() => { }}
				>
					<View style={styles.modalMaster}>
						<View style={styles.modalView}>
							<View style={styles.modalTitle}>
								<Text style={styles.modalTitleTxt}>申请成功</Text>
							</View>
							<Text style={{ lineHeight: 70, textAlign: 'center', color: '#666' }}>{Successmsg}</Text>
							<View style={styles.modalBtn}>
								<Touch onPress={() => { this.setState({ ShowSuccessPopup: false }) }} style={styles.modalBtnL}>
									<Text style={{ color: '#00A6FF' }}>关闭</Text>
								</Touch>
								<Touch onPress={() => {
									this.setState({ ShowSuccessPopup: false }, () => { Actions.pop() })
								}} style={styles.modalBtnR}>
									<Text style={{ color: '#fff' }}>立即游戏</Text>
								</Touch>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

export default PromotionsAddress;

const styles = StyleSheet.create({
	setBtn: {
		position: 'absolute',
		top: 15,
		right: 15,
		zIndex: 999,
	},
	defulTxt: {
		position: 'absolute',
		bottom: 15,
		right: 15,
		zIndex: 9,
	},
	inputView: {
		borderRadius: 10,
		backgroundColor: '#fff',
		borderColor: '#E6E6EB',
		borderWidth: 1,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		paddingLeft: 10,
		paddingRight: 10,
		width: width - 20,
		marginBottom: 15,
	},
	input: {
		width: width - 30,
		height: 40,
		color: '#000000',
		textAlign: 'left',
		paddingLeft: 10,
		fontSize: 14,
	},



	modalMaster: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0,0.5)',
	},
	modalView: {
		width: width * 0.9,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 15,
		paddingBottom: 15,
	},
	modalTitle: {
		width: width * 0.9,
		backgroundColor: '#00A6FF',
		borderTopRightRadius: 15,
		borderTopLeftRadius: 15,
	},
	modalTitleTxt: {
		lineHeight: 40,
		textAlign: 'center',
		color: '#fff',
	},
	modalBtn: {
		width: width * 0.9,
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
	},
	modalBtnL: {
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#00A6FF',
		width: width * 0.35,
		height: 40,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalBtnR: {
		borderRadius: 5,
		backgroundColor: '#00A6FF',
		width: width * 0.35,
		height: 42,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},


	add: {
		width: width - 30,
		borderWidth: 1,
		borderColor: '#00A6FF',
		borderRadius: 10,
	},
	subminBtn: {
		width: width - 30,
		backgroundColor: '#00A6FF',
		borderRadius: 10,
	},
	address: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
	},
	activeCap: {
		width: 20,
		height: 20,
		marginLeft: 5,
		marginRight: 15,
		borderRadius: 30,
		borderWidth: 4,
		borderColor: '#00A6FF'
	},
	cap: {
		width: 20,
		height: 20,
		marginLeft: 5,
		marginRight: 15,
		borderRadius: 30,
		borderWidth: 1,
		borderColor: '#EFEFF4'
	},
	addressList: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
	},
	addressTitle: {
		fontSize: 12,
		color: '#999',
		lineHeight: 23,
		marginRight: 10,
	},
	addressAcont: {
		fontSize: 12,
		color: '#000000',
		width: width * 0.5,
	},
})
