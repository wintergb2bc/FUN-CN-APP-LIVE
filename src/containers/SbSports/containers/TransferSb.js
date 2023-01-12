import React from "react";
import {
	StyleSheet,
	ScrollView,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
	Keyboard,
	Platform,
	NativeModules,
	Image,
	TextInput
} from "react-native";
import { Actions } from "react-native-router-flux";
import Modal from 'react-native-modal';
import {
	Radio,
	WhiteSpace,
	Flex,
	Toast,
	List,
	Drawer,
	Button,
} from "antd-mobile-rn";
import {PushLayout} from './Layout'
import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
import AnalyticsUtil from "./../../../actions/AnalyticsUtil"; //友盟
import ModalDropdown from "react-native-modal-dropdown";
import { ACTION_UserInfo_getBalanceSB } from './../../../lib/redux/actions/UserInfoAction';
import { ApiPortSB } from "./../lib/SPORTAPI";
import { fetchRequestSB } from "./../lib/SportRequest";
import { Toasts } from "../../Toast";
const { width, height } = Dimensions.get("window");

const newStyle = {};
for (const key in InputItemStyle) {
	//console.log(key)
	if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
		// StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
		newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
		if (key === "input") {
			newStyle[key].fontSize = 14;
		}
	}
}

const BUTTONS = [];

class TransferSb extends React.Component {
	constructor(props) {
		super(props);
		this.onOpenChange = isOpen => {
			/* tslint:disable: no-console */
			console.log('是否打开了 Drawer', isOpen.toString());
		  };
		this.state = {
			AppData: this.props,
			fromWallet: "主账户",
			fromWalletA: [], //来源数据
			fromWalletText: "",
			fromWalletKey: 0, //默认第一个为转入账户
			toWallet: "请选择账户", // 目標選擇
			toWalletKey: "",
			toWalletA: [], //目標總數據
			BonusData: "",
			bonusCouponKEY: 0, // 優惠券
			bonusCoupon: "",
			BonusMSG: "", //優惠提示訊息
			unfinGames: "",
			Sliderss: 0,
			transferType: "",
			money: "",
			moneyST: "",
			monMoney: 1,
			maxMoney: 1,
			bonusId: 0,
			toAccount: "SB",
			fromAccount: "MAIN",
			mainTotle: "",
			showPush: false,
			fastActive: 1,
			promotionData: '',
			isloginGuide1: false,
			isloginGuide2: false,
			BtnPosTop1: 0,
			BtnPosTop2: 0,
			BtnPosTop3: 0,
			BtnPosLeft1: 0,
			BtnPosLeft2: 0,
			BtnPosLeft3: 0,
			heights: 0,
			toAccount2: "",
			payMoneyBtn: false,
			UnderMaintenance: false, //一键转账是否维护
			UnderMaintenance1: false,
			UnderMaintenance2: false,
			bonusKey: 0,
			otherWalletListOpen:false,//其他錢包狀態
			otherWalletList:'',//其他帳戶金額
			otherWalletTotal:0,
			isExceedLimit: false,
			AcountTotalBal:0,//帳戶總餘額
			SBbalance:0,//SB餘額
			SbUnderMaintenance:true, //SB維護狀態
			visible: false,
			AboutPopup:false,
			fastPayMoneyMAIN: false,
		};
	}

	componentWillMount() {
		// if(window.GetSelfExclusionRestriction('DisableFundIn')) {
		// 	return
		// }
		//开启竖屏锁定
		window.openOrientation()
		// this.isloginGuide1()
		this.TotalBal();
		this.Bonus();
	}

	componentDidMount() {
		this.props.navigation && this.props.navigation.setParams({
			title: this.props.froms == 'promotions' ? '优惠申请' : '转账'
		});
	}

	componentWillUnmount() {
		if(window.openOrien == 'orientation') {
			//游戏页面开启转账，关闭客服需要解锁竖屏
			window.removeOrientation()
		}
		//卸载键盘隐藏事件监听
        if(this.keyboardDidHideListener) {
            this.keyboardDidHideListener.remove();
        }
	}
	//键盘关闭监听，去获取优惠是否满足
	keyboardDidHideHandler() {
		this.bonusChange(this.state.bonusId, this.state.money);
	}

	getBtnPos1 = (e) => {
		NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
			console.log('pypypy', px, py)
			this.setState({
				BtnPosTop1: py,
				BtnPosLeft1: px,
			});
		});
	}
	getBtnPos2 = (e) => {
		NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
			console.log('pypypy222', px, py)
			this.setState({
				BtnPosTop2: py,
				BtnPosLeft2: px,
			});
		});
	}
	getBtnPos3 = (e) => {
		NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
			console.log('pypypy', px, py)
			this.setState({
				BtnPosTop3: py,
				BtnPosLeft3: px,
			});
		});
	}
	//当高度低于多少时候需要滑动
	getBtnPos4 = (e) => {
		NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
			console.log('pypypy', px, py)
			this.setState({
				heights: height,
			});
		});
	}

	//登录引导
	isloginGuide1() {
		global.storage
			.load({
				key: "isloginGuideTransfer1",
				id: "isloginGuideTransfer1"
			})
			.then(data => { })
			.catch(err => {
				this.setState({ isloginGuide1: true })
				storage.save({
					key: "isloginGuideTransfer1",
					id: "isloginGuideTransfer1",
					data: false,
					expires: null
				});
			});
	}
	//登录引导
	isloginGuide2() {
		global.storage
			.load({
				key: "isloginGuideTransfer2",
				id: "isloginGuideTransfer2"
			})
			.then(data => { })
			.catch(err => {
				this.setState({ isloginGuide2: true })
				storage.save({
					key: "isloginGuideTransfer2",
					id: "isloginGuideTransfer2",
					data: false,
					expires: null
				});
			});
	}

	UMpush(key) {
		//友盟點擊事件
		AnalyticsUtil.onEvent(key);
	}

	drpFrame = style => {
		style.width = "95%";
		style.left = 10;
		return style;
	};

	//转出转入
	_dropdown_renderButtonText(rowData) {
		return `${rowData.nameMoney}`;
	}
	//转出下拉
	_dropdown_1_renderRow(rowData, rowID, highlighted) {
		return (
			<View
				style={{
					width: width - 20,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flexDirection: "row",
					paddingLeft: 10,
					paddingRight: 10,
					height: 35
				}}
			>
				<Text
					style={{ color: highlighted ? "red" : "#000" }}
				>{`${rowData.localizedName}`}</Text>
				<Text style={{ color: highlighted ? "red" : "#000" }}>
					{rowData.state == "UnderMaintenance"
						? "维护中"
						: rowData.balance + "元"}
				</Text>
			</View>
		);
	}
	//转入下拉
	_dropdown_2_renderRow(rowData, rowID, highlighted) {
		return (
			<View
				style={{
					width: width - 20,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flexDirection: "row",
					paddingLeft: 10,
					paddingRight: 10,
					height: 35
				}}
			>
				<Text
					style={{ color: highlighted ? "red" : "#000" }}
				>{`${rowData.localizedName}`}</Text>
				<Text style={{ color: highlighted ? "red" : "#000" }}>
					{rowData.state == "UnderMaintenance"
						? "维护中"
						: rowData.balance + "元"}
				</Text>
			</View>
		);
	}
	//优惠
	_dropdown_1_renderButtonText(rowData) {
		return `${rowData.title === "fun88_ApplyNextTime"?"下回再参与！":rowData.title}`;
	}
	//优惠下拉列表
	_dropdown_3_renderRow(rowData, rowID, highlighted) {
		return (
			<View style={{ width: width - 43, backgroundColor: highlighted ? "#00A6FF" : "#fff" , display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingLeft: 10, paddingRight: 10, height: 55,}}>
				<Text style={{color: highlighted? '#fff': '#666', lineHeight: 22}}>
					{rowData.title != "" && (rowData.title === "fun88_ApplyNextTime"?"下回再参与":rowData.title)}
				</Text>
				{/* <Text style={{color: highlighted? '#666': 'transparent'}}>✓</Text> */}
			</View>
		);
	}

	//转出账户选择
	fromWallet(key){
		const { allBalance, otherWalletList } = this.state;
		let toWalletA = allBalance.filter(item => {
			return item.name != otherWalletList[key].name;
		});
		this.setState(
			{
				fromAccount: otherWalletList[key].name,
				fromWalletKey: key,
				toWalletA, //转入账户去除已选择的转出
				maxMoney: otherWalletList[key].balance, //转账最大金额
				moneyST: "",
				money: "",
				Sliderss: 0.00001,
				UnderMaintenance1: otherWalletList[key].state == "UnderMaintenance" //是否维护
			},
			() => {
				this.validation();
			}
		);
	};

	//转入账户
	toWallet = key => {
		const { allBalance, toWalletA } = this.state;
		let fromWalletA = allBalance.filter(item => {
			return item.name != toWalletA[key].name;
		});
		this.setState(
			{
				toWalletKey: key,
				fromWalletA, //转出账户去除已选择的转入
				toAccount: toWalletA[key].name,
				BonusData: [], //重置优惠列表
				bonusId: 0,
				BonusMSG: "",
				UnderMaintenance2: toWalletA[key].state == "UnderMaintenance" //是否维护
			},
			() => {
				this.validation();
			}
		);
		this.Bonus(toWalletA[key].name);
	};

	//获取所以账户
	TotalBal() {
		if (this.state.transferType == "") {
			//普通转账刷新下拉列表标题
			this.setState({
				allBalance: [],
				fromWalletA: [],
				toWalletA: [],
				BonusData: '',
			});
		}
		fetchRequestSB(ApiPortSB.GETALLBalance, "GET").then(data1 => {
			console.log(data,'ssss')
			let data = data1.result
			if (data) {
				allBalance = data;
			}
			if (data.length > 0 && data[0].name) {
				let allBalance = this.balanceSort(data);
				this.setState({
					allBalance,
					fromWalletA: allBalance,
					toWalletA: allBalance, //默认转入账户为第一个主账户
					AcountTotalBal:data.find((v) => v.name === "TotalBal").balance,
					otherWalletList: data.filter(
                        (v) =>
                            (v.state === "UnderMaintenance" || v.balance !== 0) &&
                            v.name !== "SB" &&
                            v.name !== "TotalBal"
                    ),
					SBbalance:data.find((v) => v.name === "SB").balance, //SB 餘額
					SbUnderMaintenance:data.find((v) => v.name === "SB").state === "UnderMaintenance", //SB維護狀態
					maxMoney: allBalance[0].balance, //转账最大金额
				}, () => {
				   this.calcOtherWalletTotal();
				});
				let TotalData = allBalance.filter((item) => { return (item.name == 'TotalBal') });
				let MAINMoney = allBalance.filter((item) => { return (item.name == 'MAIN') });
				TotalBal = TotalData[0].balance;
				MAIN = MAINMoney[0].balance;
				window.ChangeMoney && window.ChangeMoney(MAIN, TotalBal)
			}
		});
	}


	calcOtherWalletTotal = () => {
        const { otherWalletList } = this.state;
        if (!otherWalletList.length) {
            this.setState({
                otherWalletTotal: 0,
            });
            return;
        }
        const otherBal = otherWalletList.reduce(function (a, b) {
            return { balance: a.balance + b.balance };
        }).balance;

        this.setState({
            otherWalletTotal: otherBal,
        });
	};


	//去除总余额，把主账户放到第一个
	balanceSort(list) {
		let MAIN = [];
		let all = [];
		all = list.filter(item => {
			item.nameMoney =
				item.localizedName + " ￥" + item.balance;
			if (item.name === "MAIN") {
				MAIN = item;
			}
			return item.name !== "TotalBal" && item.name !== "MAIN";
		});
		this.setState({ mainTotle: MAIN, toAccount2: all[0].name }); //获取主账户,和获取一键转账第一个默认值
		all.unshift(MAIN);
		return all;
	}

	//输入金额
	moneyChange(value) {
		const {fromWalletA,fromAccount} =this.state;
		let test = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/g;
		let moneyST = "";
		let Sliderss = 0;
		let money = value.replace("￥", "");

		if (Number(this.state.maxMoney) == 0) {
			moneyST = "转出金额为零，请存款";
		} else if (money == "" || Number(money) == 0) {
			moneyST = "请输入转账金额";
		} else if (Number(money) > Number(this.state.maxMoney)) {
			moneyST = "余额不足";
		} else if (test.test(Number(money))) {
			Sliderss = money / this.state.maxMoney;
		} else {
			moneyST = "请输入正确的转账金额格式";
		}

		{fromWalletA.find((v) =>  v.name === fromAccount).localizedName}
		this.setState({ money, moneyST, Sliderss,UnderMaintenance1: fromWalletA.find((v) =>  v.name === fromAccount).state == "UnderMaintenance" }, () => {
			this.validation();
		});
	}

	//输入金额后校验优惠信息
	moneyBlur() {
		this.bonusChange(this.state.bonusId, this.state.money);
	}

	//滑动条金额
	sliderChange(value) {
		console.log("asdasdasd", value);
		let money = 0;
		if (value == 0) {
			money = 0.01
		} else {
			money = (value * this.state.maxMoney).toFixed(2);
		}
		this.moneyChange("￥" + money);
	}

	//拿優惠
	Bonus(key) {
		fetchRequestSB(
			ApiPortSB.Bonus + "?transactionType=Transfer&wallet=SB&",
			"GET"
		)
			.then(data1 => {
				let data = data1.result
				let promotionId = -1
				let promotionData = ''
				let BonusIndex = 0

				if(this.props.froms == 'promotions') {
					//优惠跳转转账
					promotionId = this.props.promotionsDetail.bonusProductList[0].bonusID
					promotionData = data.find((Item) => {return (Item.id == promotionId)});
					BonusIndex = data.findIndex(v => v.id == promotionId)
					if(BonusIndex == -1) {BonusIndex = data.length - 1}
				} else {
					BonusIndex = data.length - 1
				}
				if(promotionData.length == 0) { promotionData = '' }


				this.setState({
					promotionData,
					BonusData: data,
					BonusMSG: '',
				}, () => { data.length > 0 && this.bonusSelect(BonusIndex) });
			})
			.catch(() => { });
	}

	//优惠选择
	BonusButton = key => {
		let id = this.state.BonusData[key].id;
		this.setState({
			bonusId: this.state.BonusData[key].id,
			bonusCouponKEY: this.state.BonusData[key].bonusCouponID //是否需要优惠码
		});
		this.bonusChange(id, this.state.money);
	};

	//获取优惠详情信息
	bonusChange = (id, money) => {
		let m = money.toString().replace("￥", "");
		if (id == 0) {
			this.setState({ BonusMSG: '' });
			return;
		}
		let data = {
			transactionType: "Transfer",
			bonusId: id,
			amount: m || 0,
			wallet: this.state.toAccount,
			couponText: "string"
		};
		this.setState({BonusMSG: ''})
		Toast.loading('确认优惠中，请稍等...', 200);

		fetchRequestSB('/api/Bonus/Calculate?', "POST", data)
			.then(data => {
				Toast.hide();
				if (data.previewMessage != "") {
					this.setState({
						// BonusMSG: data.previewMessage
						BonusMSG: ''
					});
				} else if (data.errorMessage != "") {
					this.setState({
						BonusMSG: id != 0 ? data.errorMessage: ''
					});
				}
			})
			.catch(() => {
				Toast.hide();
			});
	};

	//转账
	okPayMoney() {
		let ST = this.state;
		if (!ST.payMoneyBtn) {
			return;
		}

		let data = {
			fromAccount: ST.fromAccount,
			toAccount: "SB",
			amount: ST.money,
			bonusId: ST.bonusId,
			blackBoxValue: Iovation,
			e2BlackBoxValue: E2Backbox,
			bonusCoupon: ""
		};

		if (ST.bonusCouponKEY != 0) {
			data.bonusCoupon = ST.bonusCoupon || "";
		}
		PiwikEvent('Transfer', 'Submit', 'Transfer_normal')
		Toast.loading("转账中,请稍候...", 20000000);
		fetchRequestSB(ApiPortSB.POSTTransfer, "POST", data).then(data => {
				Toast.hide();
				if (data.isSuccess) {
					this.payAfter(data.result);
				}
			}).catch(() => {
				Toast.hide();
			})
	}
	//给后台传优惠id，
	okBonusId(value) {
		let ST = this.state;
		let data = {
			"blackBoxValue": Iovation,
			"e2BlackBoxValue": E2Backbox,
			"blackBox": E2Backbox,
			"bonusId": ST.bonusId,
			"amount": ST.money,
			"bonusMode": "Transfer",
			"targetWallet": "SB",
			"couponText": "",
			"isMax": false,
			"transferBonus": {
				"fromWallet": ST.fromAccount,
				"transactionId": value.transferId
			},
			"successBonusId": value.successBonusId
		   }

		fetchRequestSB(ApiPortSB.PromoApplications, "POST", data)
			.then(data => {
				if(data && data.result && data.result.bonusResult && data.result.bonusResult.message == 'Success') {
					//跳转其他页面
					Actions.pop()
					Actions.PromotionsBank({froms: 'transfer'})
				} else {
					setTimeout(() => {
						Toasts.fail('优惠申请失败，请联系在线客服', 2);
					}, 2000);
				}
			})
			.catch(() => { });
	}
	//信息完整验证
	validation() {
		const ST = this.state;
		if (ST.UnderMaintenance1) {
			Toasts.fail("您所选的账户在维护中，请重新选择", 2);
			return;
		}
		if (ST.money != "" && ST.toAccount != "" && ST.moneyST == "" && ST.fromAccount != '') {
			this.setState({ payMoneyBtn: true });
		} else {
			this.setState({ payMoneyBtn: false });
		}
	}
	//转账后处理
	payAfter(data) {
		console.log(data)
		this.TotalBal();
		//this.props.userInfo_getBalanceSB(true);
		if(data.selfExclusionOption && data.selfExclusionOption.isExceedLimit) {
			//自我限制弹窗
			this.setState({isExceedLimit: true})
			return
		}
		// status = 1 transferId != 0 前端寫死轉賬成功信息
		if (data.status != 1) {
			
			if(!data.messages){
				Toasts.fail("转帐失败", 2);
			} else {
				let msg = data.messages;
				Toasts.fail(msg, 2);
			}
			
		} else if (data.status == 1 && data.transferId != 0) {
			const msg = "转帐成功";
			Toasts.success(msg, 2);
		} else {
			Toasts.success(data.messages, 2);
			this.Bonus();
		}
		if(data && this.state.bonusId != 0) {
			if(data.successBonusId) {
				this.okBonusId(data)
			} else {
				setTimeout(() => {
					Toasts.fail('优惠申请失败，请联系在线客服', 2);
				}, 2000);
			}
		}
		//刷新账户余额
		this.setState({fromAccount: 'MAIN', money: '', payMoneyBtn: false})

	}
	//快速转账选择
	fastSelect(key) {
		let toAccount2 = this.state.allBalance[key].name;
		this.fastSelectPiwik(toAccount2)
		let UnderMaintenance =
			this.state.allBalance[key].state == "UnderMaintenance";
		this.setState({ fastActive: key, toAccount2, UnderMaintenance });
	}
	fastSelectPiwik(key) {
		switch (key) {
			case 'SB':
				PiwikEvent('BTiIMSPIMESTF_1clicktransfer_transfer')
                break;
            case 'SP':
				PiwikEvent('SPsport__1clicktransfer_transfer')
                break;
            case 'P2P':
				PiwikEvent('BoleP2P_1clicktransfer_transfer')
				break;
			case 'KYG':
				PiwikEvent('KYGP2P_1clicktransfer_transfer')
				break;
			case 'LD':
				PiwikEvent('Live__1clicktransfer_transfer')
				break;
			case 'SLOT':
				PiwikEvent('Slot__1clicktransfer_transfer')
				break;
			case 'PT':
				PiwikEvent('PT_1clicktransfer_transfer')
				break;
			case 'BOY2':
				PiwikEvent('BYkeno_1clicktransfer_transfer')
				break;
			case 'KENO':
				PiwikEvent('VRkeno_1clicktransfer_transfer')
				break;
			case 'AG':
				PiwikEvent('Fishing2slot_1clicktransfer_transfer')
                break;
			default:
				break;
		}
	}
	//一键转账
	fastPayMoney() {
		let ST = this.state;
		if(!ST.otherWalletList || ST.otherWalletList.length == 0) { return }
		if (ST.UnderMaintenance) {
			Toasts.fail("您所选的账户在维护中，请重新选择", 2);
			return;
		}

		let data = {
			fromAccount: "All",
			toAccount:"SB",
			amount: this.state.AcountTotalBal,
			bonusId: 0,
			blackBoxValue: Iovation,
			e2BlackBoxValue: E2Backbox,
			bonusCoupon: ""
		};
		PiwikEvent('Transfer', 'Submit', 'Transfer_oneclick')
		Toast.loading("转账中,请稍候...", 2000);
		fetchRequestSB(ApiPortSB.POSTTransfer, "POST", data)
			.then(data => {
				Toast.hide();
				this.payAfter(data.result);
			})
			.catch(() => {
				Toasts.fail(data.messages, 2);
			});
	}
	fastPayMoneyMAIN() {
		let ST = this.state;
		// if(!ST.otherWalletList || ST.otherWalletList.length == 0) { return }
		// if (ST.UnderMaintenance) {
		// 	Toasts.fail("您所选的账户在维护中，请重新选择", 2);
		// 	return;
		// }
		if(ST.fastPayMoneyMAIN) { return }
		let data = {
			fromAccount: "All",
			toAccount:"MAIN",
			amount: 0,
			bonusId: 0,
			blackBoxValue: Iovation,
			e2BlackBoxValue: E2Backbox,
			bonusCoupon: ""
		};
		PiwikEvent('Transfer', 'Submit', 'Transfer_oneclick')
		Toast.loading("转账中,请稍候...", 2000);
		fetchRequestSB(ApiPortSB.POSTTransfer, "POST", data)
			.then(data1 => {
				let data = data1.result

				Toast.hide();
				this.TotalBal();
				//this.props.userInfo_getBalanceSB(true);
				if(data.selfExclusionOption && data.selfExclusionOption.isExceedLimit) {
					//自我限制弹窗
					this.setState({isExceedLimit: true})
					return
				}
				if (data.status == 0) {
					const msg = data.messages || "转帐失败";
					Toasts.fail(msg, 2);
				} else {
					Toasts.success('转账成功');
					this.setState({fastPayMoneyMAIN: true})
				}
			})
			.catch(() => {
				Toast.hide();
			});
	}
	//优惠选择
	bonusSelect(key) {
		const BonusData = this.state.BonusData;
		this.setState({
			bonusCouponID: BonusData[key].bonusCouponID,
			bonusKey: key,
			bonusTitle: BonusData[key].title,
			bonusId: BonusData[key].id,
			BonusMSG: '',
		})
		this.bonusChange(BonusData[key].id, this.state.money);
	}
	//优惠码
	bonusCouponID(value) {
		this.setState({ bonusCoupon: value })
	}


	    /*
    * formatMoney(s,type)
    * 功能：金额按千位逗号分割
    * 参数：s，需要格式化的金额数值.
    * 参数：type,判断格式化后的金额是否需要小数位.
    * 返回：返回格式化后的数值字符串.
    */
   formatMoney = (s, type) => {
	if (/[^0-9\.]/.test(s)) return "0.00";
	if (s == null || s == "") return "0.00";
	s = s.toString().replace(/^(\d*)$/, "$1.");
	s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
	s = s.replace(".", ",");
	var re = /(\d)(\d{3},)/;
	while (re.test(s)) s = s.replace(re, "$1,$2");
	s = s.replace(/,(\d\d)$/, ".$1");
	if (type == 0) {
	  // 不带小数位(默认是有小数位)
	  var a = s.split(".");
	  if (a[1] == "00") {
		s = a[0];
	  }
	}
	return s;
  }


   //显示
   show(){
	   if(this.state.otherWalletList && this.state.otherWalletList.length > 0) {
		this.setState({
			visible: true
		});
	   }

	}
		//隐藏
		hide(){
			this.setState({
				visible: false
			});
		}

		//弹框
		_renderModal() {
			const {otherWalletList,fromAccount} = this.state;
			return (
				<Modal
					isVisible={true}
					animationIn={'bounceInUp'}
					backdropColor={'#000'}
					backdropOpacity={0.4}
					style={{justifyContent: 'flex-end', margin: 0,}}
					onBackdropPress={() => this.hide()}
				>
				 <View style={{backgroundColor:'#efeff4',width:width,height:height/1.5}}>
					 <ScrollView>
					<View><Text style={{textAlign:'center',paddingTop:15,fontSize:16,fontWeight:'bold'}}>源自账号</Text></View>
					{otherWalletList !="" &&
						 <View style={{paddingTop:5,width:width-30,left:15}}>
                                {otherWalletList.length
                                    ? otherWalletList.map((val, index) => {
                                          return (
											  <Touch onPress={()=> this.fromWallet(index)}>
                                              <View  style={styles.moneyButton}>
												    <View style={{flex:1, justifyContent: "flex-start",  alignItems: "flex-start",}}>
                                               	   <Text style={{color:'#999'}}>{val.localizedName}</Text>
												  </View>

												  <View style={{flex:1,paddingRight:20,justifyContent: "flex-end",  alignItems: "flex-end",}}>
													{val.state ===
													"UnderMaintenance" ? (
														<View>
															<Text style={{fontWeight:'bold'}}>维护中</Text>
														</View>
													) : (
														<View style={{flexDirection:'row'}}>
															<Text style={{fontWeight:'bold'}}>￥ {this.formatMoney(val.balance, 2)}</Text>
															<View style={val.name == fromAccount ? styles.moneyButtontochB:styles.moneyButtontochA}></View>
														</View>
													)}
												  </View>
                                              </View>
											  </Touch>
                                          );
                                      })
                                    : null}
                            </View>
						}
						</ScrollView>
				</View>
				</Modal>
			)
		}

		closePopver(){
			this.setState({
				AboutPopup:this.state.AboutPopup == false? true:false
			})
		}


	render() {
		const {
			fromAccount,
			fromWalletA,
			toWalletA,
			allBalance,
			transferType,
			money,
			moneyST,
			BonusData,
			mainTotle,
			fastActive,
			payMoneyBtn,
			otherWalletListOpen,
			otherWalletList,
			otherWalletTotal,
			AcountTotalBal,
			SBbalance,
			promotionData,
			BonusMSG,
			SbUnderMaintenance,
			AboutPopup,
			isExceedLimit,
			fastPayMoneyMAIN,
		} = this.state;

		window.ReloadMoneyS = () => {
			this.TotalBal();
		};

		window.showPushTransfer = (showPush) => {
			this.setState({showPush})
		}
		//显示优惠一键转账,主账户金额小于最低申请金额
		let showFastPayMoneyMAIN = fastPayMoneyMAIN || (mainTotle != '' && this.props.froms == 'promotions' && promotionData != '' && mainTotle.balance < promotionData.minAccept)? true: false

		return (
			<View style={{ flex: 1 }}>
				<PushLayout showPush={this.state.showPush} />
				{/* 自我限制弹窗 */}
				<Modal
					animationType="none"
					transparent={true}
					visible={isExceedLimit}
					style={{margin: 0}}
				>
					<View style={styles.modals}>
						<View style={styles.selfExclusion}>
							<View style={styles.selfExclusionTitle}>
								<Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>自我限制</Text>
							</View>
							<Text onPress={() => { this.setState({isExceedLimit: false}, () => {
								LiveChatOpenGlobe()
							})}} style={styles.selfExclusionMsg}>
								转帐金额已超过您的自我限制金额，若您需要任何帮助，请联系<Text style={{color: '#00A6FF'}}>在线客服</Text>。
							</Text>
							<Touch onPress={() => { this.setState({isExceedLimit: false}) }} style={styles.selfExclusionBtn}>
								<Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>知道了</Text>
							</Touch>
						</View>
					</View>
				</Modal>
				{/* 普通转账引导 */}
				{/* <Modal
					animationType="none"
					transparent={true}
					visible={this.state.isloginGuide1 && BtnPosTop1 != 0}
					onRequestClose={() => { }}
				>
					<View style={{
						flex: 1,
						zIndex: 9999,
						backgroundColor: "rgba(0, 0, 0,0.6)",
						alignItems: 'center',
					}}>
					</View>
				</Modal> */}
				{/* 快捷转账引导 */}
				{/* <Modal
					animationType="none"
					transparent={true}
					visible={this.state.isloginGuide2 && BtnPosTop2 != 0 && this.state.heights != 0}
					onRequestClose={() => { }}
				>
					<View style={{
						flex: 1,
						zIndex: 9999,
						backgroundColor: "rgba(0, 0, 0,0.7)",
						alignItems: 'center',
					}}>
					</View>
				</Modal> */}
				<ScrollView
					style={{ flex: 1 }}
					automaticallyAdjustContentInsets={false}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
				>

				  <WhiteSpace size="sm" />
				  {
					this.props.froms != 'promotions' &&
					<View style={{justifyContent:"center",alignItems:'center',marginTop:10}}>
					<View style={styles.totalMoneyWrap}>
						<View style={styles.moneyFlex}>
							<View style={styles.moneyWrapA}>
								<Text style={styles.totalText}>总余额</Text>
								<Text style={styles.totalText1}><Text style={{fontSize:12}}>￥</Text> {this.formatMoney(AcountTotalBal,2)}</Text>
							</View>
							<View style={{width:1,backgroundColor:'#efeff4',right:20,top:8,height:40}}></View>
							<View style={{top:8,right:10, display: 'flex',}}>
							   <Touch onPress={() => { this.closePopver() }}>
								<Image resizeMode='stretch' source={require('./../images/transfer/notice.png')} style={{ width: 17, height: 17,top:3 }} />
							   </Touch>

								{AboutPopup &&

									<View style={styles.Popover}>
										<TouchableOpacity onPress={() => { this.closePopver() }}  style={styles.PopoverConten}>
											<View style={styles.arrowB} />
											<Text style={{ color: '#fff', paddingRight: 5, fontSize: 12 }}>包含 V2 虚拟体育, 沙巴体育, BTI 体育，{"\n"}IM 体育和电竞​</Text>
											<Image resizeMode='stretch' source={require('./../images/closeWhite.png')} style={{ width: 15, height: 15 }} />

										 </TouchableOpacity>
										</View>

								}

						    </View>
							<View style={styles.moneyWrapB}>
								<Text style={styles.totalText}>体育/电竞</Text>
								<Text style={styles.totalText1}><Text style={{fontSize:12}}>￥</Text> {this.formatMoney(SBbalance,2)}</Text>
							</View>
							<View style={{right:10,top:5}}>
								<Touch onPress={() => {
										this.fastPayMoney();
									}}>
									<Image resizeMode='stretch' source={require('./../images/transfer/onebutton.png')} style={{ width: 24, height: 24 }} />
								</Touch>
							</View>
						</View>


						<View style={styles.moneyWrap}>
								<Text style={[styles.totalText,{color:'#000',flex:1,alignItems: "flex-start",}]}>其它钱包</Text>
								<Touch onPress={() =>this.setState({otherWalletListOpen:otherWalletListOpen ==false?true:false}) } style={{flexDirection:'row'}}>
								<Text style={[styles.totalText1,{right:5,alignItems: "flex-end",}]}><Text style={{fontSize:12}}>￥ </Text> {this.formatMoney(otherWalletTotal, 2)}</Text>
								{
									otherWalletList != '' && otherWalletList.length > 0 && <View style={styles.arrow}></View>
								}

							</Touch>
						 </View>


						{otherWalletListOpen &&otherWalletList !="" &&
						 <View style={styles.walletList}>
                                {otherWalletList.length
                                    ? otherWalletList.map((val, index) => {
                                          return (
                                              <View style={{paddingTop:5,paddingBottom:5, width: width * 0.4}}>
                                                  <Text style={{color:'#999'}}>{val.localizedName}</Text>
                                                  {val.state ===
                                                  "UnderMaintenance" ? (
                                                      <Text>维护中</Text>
                                                  ) : (
                                                      <View>
                                                          <Text style={{fontWeight:'bold'}}>￥ {this.formatMoney(val.balance, 2)}</Text>
                                                      </View>
                                                  )}
                                              </View>
                                          );
                                      })
                                    : null}
                            </View>
						}

					</View>
					</View>
					}
					{transferType == "" && (
					<>
						<View style={{ padding: 10,backgroundColor:'#fff',borderRadius:10,width:width-20, alignSelf:'center', marginTop: 10}}>
							{
								showFastPayMoneyMAIN &&
								<View>
									<View style={{padding: 10,backgroundColor: '#FFF5BF', borderRadius:  8,}}>
										<Text style={{color: '#83630B', fontSize: 12,lineHeight: 18,}}>温馨提示：请先点击一键转账将账户余额转账至主账户后，再转账申请此红利</Text>
									</View>
								</View>
							}
							{/* 转出自 */}
							<View style={{flexDirection: "row", }}>
								<View style={{flex:1,paddingTop:10}}>
									<Text style={{ color: "#666666", lineHeight: 30,fontSize:12 }}>源自账号</Text>
									{
										this.props.froms != 'promotions' &&
										<View style={{ borderColor:'#E3E3E8',borderWidth:1,borderRadius:6 }}>
											{fromWalletA.length == 0 ? (
												<Text
													style={{ fontSize: 14, lineHeight: 40, paddingLeft: 15 }}
												>
													数据加载中..
												</Text>
											) : (
												<Touch onPress={() => this.show()}>
													<View
														style={{
															display: "flex",
															justifyContent: "space-between",
															alignItems: "center",
															flexDirection: "row",
															height: 40,

														}}
													>
															<Text style={{color:'#000',paddingLeft:5,fontSize:12}} >
															{fromWalletA.find((v) =>  v.name === fromAccount).localizedName}
															￥{fromWalletA.find((v) =>  v.name === fromAccount).balance}
															</Text>
													</View>
													</Touch>
												)}
										</View>
									}
									{
										this.props.froms == 'promotions' &&
										<View style={{ borderColor:'#E3E3E8',borderWidth:1,borderRadius:6 }}>
											{fromWalletA.length == 0 ? (
												<Text
													style={{ fontSize: 14, lineHeight: 40, paddingLeft: 15 }}
												>
													数据加载中..
												</Text>
											) : (
												<View
														style={{
															display: "flex",
															justifyContent: "space-between",
															alignItems: "center",
															flexDirection: "row",
															height: 40,

														}}
													>
															<Text style={{color:'#000',paddingLeft:5,fontSize:12}} >
															{fromWalletA.find((v) =>  v.name === fromAccount).localizedName}
															￥{fromWalletA.find((v) =>  v.name === fromAccount).balance}
															</Text>
															{
																showFastPayMoneyMAIN &&
																<View style={{position: 'absolute', right: 15}}>
																	<Touch onPress={() => {
																			this.fastPayMoneyMAIN();
																		}}>
																		<Image resizeMode='stretch' source={fastPayMoneyMAIN ?require('./../images/transfer/onebuttonW.png'): require('../../../images/transfer/onebutton.png')} style={{ width: 19, height: 19 }} />
																	</Touch>
																</View>
															}
													</View>
												)}
										</View>
									}
								</View>
								<View style={{flex:0.1,alignItems:'center',top:50,left:5}}>
									<Image resizeMode='stretch' source={require('./../images/transfer/money.png')} style={{ width: 20, height: 20 }} />
								</View>
								{/* 转入至 */}
								<View style={{flex:1,paddingTop:10, paddingLeft: 10}}>
									<Text style={{ color: "#666666", lineHeight: 30,fontSize:12, }}>目标账户</Text>
									<View style={{ backgroundColor: "#EFEFF4",borderRadius: 10 }}>
										{SbUnderMaintenance ? (
											<Text
												style={{ fontSize: 14, lineHeight: 40, paddingLeft: 15 }}
											>
												数据加载中..
											</Text>
										) : (
												<View
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
														flexDirection: "row",
														height: 40,

													}}
												>
											<Text style={{color:'#bcbec3',paddingLeft:5,fontSize:12}}>{SbUnderMaintenance ? '维护中':'体育/电竞 ￥'+this.formatMoney(SBbalance,2)}</Text>

												</View>
											)}
									</View>
								</View>
							</View>
							{/* 转账金额 */}
							<View >

								<View style={{ backgroundColor: "#fff",paddingTop:10 }}>
									<Text style={{ color: "#666666", fontSize: 12,paddingBottom:10 }}>金额</Text>
									<View
										style={{
											borderColor:moneyST!="" ? "red":"#ddd",
											borderWidth: 1,
											borderRadius: 5,
											height: 38,
											display: "flex",
											alignItems: "center"
										}}
									>
										<TextInput
											value={money != "" &&  money}
											maxLength={8}
											style={{
												textAlign: "left",
												color: "#000",
												height: 38,
												width: width - 70
											}}
											placeholder={'输入金额'}
											placeholderTextColor={'#999'}
											onChangeText={value => {
												this.moneyChange(value);
											}}
											onBlur={() => {
												this.moneyBlur();
											}}
										/>
									</View>
									{moneyST != "" &&
									<View style={{backgroundColor:'#fee0e0',borderRadius:10,marginTop:10,marginBottom:10}}>
										<Text style={{ color: "red", fontSize: 11,paddingLeft:10,paddingBottom:10,paddingTop:10 }}>
											{moneyST}
										</Text>
									</View>
									}

								</View>
							</View>

							{
								promotionData != '' &&
								this.props.froms == 'promotions' &&
								<View>
									<View style={styles.BonusDatas} >
										<Text style={{textAlign: 'center', color: '#000', width: width - 60, lineHeight: 22,paddingBottom: 15, fontSize: 17}}>{promotionData.title}</Text>
										<View style={styles.stateList}>
											<Text style={styles.statesTitle}>申请金额</Text>
											<Text style={styles.statesTitle}>可得红利</Text>
											<Text style={styles.statesTitle}>所需流水</Text>
										</View>
										<View style={styles.stateList}>
											<Text style={styles.statesTitles}>¥{money == '' ? '0': money}</Text>
											<Text style={styles.statesTitles}>¥{Number(money) * promotionData.givingRate > promotionData.maxGiving ? promotionData.maxGiving : (Number(money) * promotionData.givingRate).toFixed(2)}</Text>
											<Text style={styles.statesTitles}>{((Number(money) + Number(money) * promotionData.givingRate) * promotionData.releaseValue).toFixed(2)}</Text>
										</View>
									</View>
									{
										BonusMSG != '' &&
										<Text style={{color: 'red', fontSize: 11,width: width - 60,lineHeight: 15, paddingTop: 10}}>{BonusMSG}</Text>
									}
								</View>
							}

							{/* 优惠选择 */}
							{
								(this.props.froms != 'promotions' || promotionData == '') &&
								BonusData != '' &&
								<View style={{ paddingTop:10, }}>
									<Text style={{ fontSize:12,paddingBottom: 10 }}>优惠申请</Text>

										<Flex style={{ backgroundColor: "#fff" }}>
										<Flex.Item
											style={{
												flex: 1,
												paddingTop: 5,
												backgroundColor: "#fff",
												borderColor:'#E3E3E8',borderWidth:1,borderRadius:6
											}}
										>
											<ModalDropdown
												ref={el => (this._dropdown_3 = el)}
												defaultValue="下回再参与"
												defaultIndex={BonusData.length - 1}
												textStyle={styles.dropdown_D_text}
												dropdownStyle={[styles.dropdown_DX_dropdown,{height: BonusData.length > 2? 55 * 3: 55 * BonusData.length}]}
												options={BonusData}
												renderButtonText={rowData =>
													this._dropdown_1_renderButtonText(rowData)
												}
												renderRow={this._dropdown_3_renderRow.bind(this)}
												onSelect={this.BonusButton}
											/>
											<View style={{position: 'absolute', right: 10, top: 12}}>
												<Image resizeMode='stretch' source={require('./../images/down.png')} style={{ width: 16, height: 16 }} />
											</View>
										</Flex.Item>
									</Flex>
									{
										BonusMSG != '' &&
										<Text style={{color: 'red', fontSize: 11,width: width - 50,lineHeight: 16, paddingTop: 10}}>{BonusMSG}</Text>
									}

								</View>
							}


							{/* 立即转账 */}
							<Touch
								onPress={() => this.okPayMoney()}
								style={{
									backgroundColor: payMoneyBtn ? "#00a6ff" : "#EFEFF4",
									borderRadius: 5,
									marginTop: 20
								}}
							>
								<Text
									style={{ color: payMoneyBtn? '#fff': "#BCBEC3", lineHeight: 42, textAlign: "center" }}
								>
									提交
             				   </Text>
							</Touch>

							<Touch
								onPress={() => {Actions.pop(); Actions.DepositCenter({ froms: 'promotions', promotionsDetail: this.props.promotionsDetail })}}
								style={{
									borderColor: '#00a6ff',
									borderRadius: 5,
									borderWidth: 1,
									marginTop: 15
								}}
							>
								<Text
									style={{ color: "#00a6ff", lineHeight: 40, textAlign: "center" }}
								>
									存款
             				   </Text>
							</Touch>
						</View>
				</>
					)}
					{transferType == "new" && (
						<View style={{ padding: 10 }} onLayout={(e) => this.getBtnPos4(e)}>
							<View
								style={{
									backgroundColor: "#fff",
									height: 80,
									display: "flex",
									justifyContent: "space-around",
									alignItems: "center",
									flexDirection: "row",
									borderRadius: 10
								}}
							>
								<View style={{ width: width / 3.2 }}>
									<Text style={{ textAlign: "center" }}>主账户</Text>
									<Text style={{ textAlign: "center" }}>
										￥{mainTotle != "" && mainTotle.balance}
									</Text>
								</View>
								<View onLayout={(e) => this.getBtnPos2(e)}>
									<Touch
										onPress={() => {
											this.setState({ toAccount2: "MAIN" }, () => {
												PiwikEvent('Collectalltomain_1clicktranfer_transfer');
												this.fastPayMoney();
											});
										}}
										style={{
											backgroundColor: "#F92D2D",
											padding: 5,
											paddingLeft: 12,
											paddingRight: 12,
											borderRadius: 30
										}}
									>
										<Text style={{ color: "#fff" }}>收集至主账户</Text>
									</Touch>
								</View>

							</View>
							<View style={styles.fastBox}>
								{allBalance != "" &&
									allBalance.map((item, index) => {
										if (index == 0) {
											return;
										}
										return (
											<Touch
												onPress={() => {
													this.fastSelect(index);
												}}
												key={index}
												style={[
													styles.fastList,
													{
														borderColor:
															index == fastActive ? "#F92D2D" : "#fff"
													}
												]}
											>
												<Text numberOfLines={1} style={{ fontSize: 12 }}>
													{item.localizedName}
												</Text>
												<Text
													numberOfLines={1}
													style={{
														fontSize: 12,
														paddingTop: 8,
														color:
															item.state == "UnderMaintenance" ? "red" : "#000"
													}}
												>
													{item.state == "UnderMaintenance"
														? "维护中"
														: "￥" + item.balance}
												</Text>
											</Touch>
										);
									})}
							</View>
							<View style={styles.fastBtn} onLayout={(e) => this.getBtnPos3(e)}>
								<Touch
									onPress={() => {
										this.fastPayMoney();
									}}
									style={{ backgroundColor: "#F92D2D", borderRadius: 50 }}
								>
									<Text
										style={{
											color: "#fff",
											textAlign: "center",
											lineHeight: 35
										}}
									>
										一键转至该账户
                  </Text>
								</Touch>
							</View>
							<View
								style={{
									backgroundColor: "#dedede",
									borderRadius: 5,
									marginTop: 10
								}}
							>
								<Text style={{ color: "#000", fontSize: 12, padding: 15 }}>
									请先选择您欲转入的目标账户，并按下“一键转至该账户”，所有账户的余额将会转账至目标账户。
                </Text>
							</View>
						</View>
					)}
				</ScrollView>

							{/*源自帳戶彈窗*/}
							{this.state.visible && this._renderModal()}
							{/*源自帳戶彈窗*/}

			</View>
		);
	}
}
const mapStateToProps = state => ({
	userInfo: state.userInfo,
	maintainStatus: state.maintainStatus,
});
const mapDispatchToProps = {
	userInfo_getBalanceSB: (forceUpdate = false) => ACTION_UserInfo_getBalanceSB(forceUpdate),
};

export default connect(mapStateToProps, mapDispatchToProps)(TransferSb);




const styles = StyleSheet.create({
	selfExclusionBtn: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		width: width * 0.9 - 30,
		backgroundColor: '#00A6FF',
		borderRadius: 8,
	},
	selfExclusionTitle: {
		borderTopRightRadius: 16,
		borderTopLeftRadius: 16,
		backgroundColor: '#00A6FF',
		width: width * 0.9,
		height: 40,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	selfExclusionMsg: {
		padding: 15,
		paddingBottom: 25,
		paddingTop: 25,
		lineHeight: 18,
		color: '#000',
		fontSize: 13,
	},
	selfExclusion: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width * 0.9,
		backgroundColor: '#fff',
		borderRadius: 16,
		paddingBottom: 20,
	},
	modals: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0,0.5)",
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	totalMoneyWrap:{
		flex:1,
		width:width-20,
		justifyContent: "space-between",
		backgroundColor:'#fff',
		borderRadius:10,
		paddingTop:10,
		paddingBottom:10,
	},
	moneyFlex:{
		flex:1,
		justifyContent: "center",
		paddingBottom: 15,
		flexDirection: "row"
	},
	moneyWrapA:{
		flex:1,
		justifyContent: "flex-start",
		alignItems: "flex-start",
		paddingLeft:10,
		paddingTop:10,
	},
	moneyWrapB:{
		flex:1,
		justifyContent: "flex-end",
		alignItems: "flex-start",
		paddingTop:10,
	},
	moneyWrap:{
		flex:1,
		justifyContent: "flex-start",
		alignItems: "flex-start",
		flexDirection: "row",
		paddingLeft:10,
		paddingTop:20,
	},
	totalText:{
		color:'#999'
	},
	totalText1:{
		fontSize:17,
		fontWeight:'bold'
	},
	arrow:{
		top:5,
		marginRight:10,
		width: 10,
		height: 10,
		borderColor:'#666',
		borderRightWidth:2,
		borderBottomWidth:2,
		transform:[{rotate: '45deg'}],
	  },
	tabBtn: {
		display: "flex",
		width: width,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row"
	},
	newType: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row"
	},
	dropdown_D_text: {
		paddingBottom: 3,
		fontSize: 14,
		color: "#666666",
		textAlignVertical: "center",
		lineHeight: 30,
		paddingLeft: 10,
		width: width * 0.75,
	},
	dropdown_DX_dropdown: {
		borderWidth: 1,
		borderColor: '#E3E3E8',
		overflow: 'hidden',
		marginTop: 10,
		borderRadius: 10,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.6,
		shadowRadius: 10,
		shadowColor: "#fff",
		//注意：这一句是可以让安卓拥有灰色阴影
		elevation: 4
	},
	dropdown_2_row_text: {
		fontSize: 14,
		paddingLeft: 5,
		paddingTop: 12,
		paddingBottom: 13
	},
	dropdown_2_row: {
		flex: 1
	},
	SliderList: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row"
	},
	scaleKey: {
		width: 1,
		height: 8,
		backgroundColor: "#999999"
	},
	fastBox: {
		backgroundColor: "#fff",
		display: "flex",
		alignItems: "center",
		flexDirection: "row",
		paddingTop: 5,
		flexWrap: "wrap",
		marginTop: 10,
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10
	},
	fastList: {
		width: width / 3.52,
		height: 70,
		borderWidth: 1,
		borderRadius: 5,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		margin: 5
	},
	fastBtn: {
		backgroundColor: "#fff",
		padding: 15,
		display: "flex",
		justifyContent: "center",
		borderBottomRightRadius: 10,
		borderBottomLeftRadius: 10
	},
	BonusData: {
		borderWidth: 1,
		borderColor: '#E0E0E0',
		borderRadius: 10,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 5,
		padding: 10,
	},
	bonusList: {
		width: 20,
		height: 20,
		borderRadius: 40,
		borderWidth: 2,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',

	},
	BonusPop: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		flexDirection: 'row',
		width: width - 80
	},
	Popover: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
		position: 'absolute',
		width:270,
		zIndex: 99,
		top:32,
		left:-79,
    },
    PopoverConten: {
        backgroundColor: '#363636',
        borderRadius: 8,
        padding: 15,
				width:270,
        // paddingLeft: 10,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
	},

	arrowB:{
		position: 'absolute',
		left:80,
		top:-13,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: "solid",
        borderWidth: 7,
        borderTopColor: "#ffffff",
        borderLeftColor: "#ffffff",
        borderBottomColor: "#363636",
        borderRightColor: "#ffffff"
	  },

	//源置帳戶
	container:{
		backgroundColor: '#FFFFFF',
    },
    center: {
        justifyContent: 'flex-start',
		alignItems: 'center',
    },
    parent: {
		width:width,height:height/2,
        backgroundColor:'#FFFFFF',
		borderRadius:10,
    },
    content: {
        fontSize: 25,
        color: 'black',
        textAlign: 'center'
	},
	moneyButton:{
		paddingLeft:10,
		paddingRight:5,
	    paddingTop:10,
		paddingBottom:10,
		flexDirection:'row',
		backgroundColor:'#fff',
		borderRadius:10,
		marginTop:10
	},
	moneyButtontochA:{
		borderColor:'#bcbec3',
		backgroundColor:'#fff',
		borderWidth:1,
		borderRadius:16,
		width:15,
		height:15,
		left:8,
		top:1
	},
	moneyButtontochB:{
		borderColor:'#00a6ff',
		backgroundColor:'#fff',
		borderWidth:3,
		borderRadius:16,
		width:15,
		height:15,
		left:8,
		top:1
	},
	walletList: {
		paddingLeft:25,
		paddingTop:5,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	BonusDatas: {
        width: width - 40,
        borderWidth: 1,
        borderColor: '#E3E3E8',
        padding: 10,
        borderRadius: 10,
		marginTop: 15,
    },
	stateList: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 10,
        width: width - 60,
    },
    statesTitle: {
        color: '#666666',
        fontSize: 12,
        width: (width - 60) / 3,
        textAlign: 'center',
    },
	statesTitles: {
		color: '#000',
        width: (width - 60) / 3,
        textAlign: 'center',
	},
});
