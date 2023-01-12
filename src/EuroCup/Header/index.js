import React from "react";
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
    Modal,
    Platform,
    NativeModules,
    TextInput,
    KeyboardAvoidingView,
    TouchableHighlight,
    Settings
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import { TransferSubmit } from "../../lib/data/wallet";
import {
    Carousel,
    WhiteSpace,
    WingBlank,
    Flex,
    Toast,
    InputItem,
    ActivityIndicator,
    List,
    Picker
} from "antd-mobile-rn";
const { width, height } = Dimensions.get("window");
import { connect } from "react-redux";
import reactUpdate from 'immutability-helper';
import ModalDropdown from 'react-native-modal-dropdown';
// import {
//     ACTION_MaintainStatus_NoTokenBTI, ACTION_MaintainStatus_NoTokenIM, ACTION_MaintainStatus_NoTokenOW,
//     ACTION_MaintainStatus_SetBTI, ACTION_MaintainStatus_SetIM, ACTION_MaintainStatus_SetOW
// } from '../lib/redux/actions/MaintainStatusAction';
import { ACTION_MaintainStatus_SetIM } from '../../lib/redux/actions/MaintainStatusAction'
import { ACTION_UserInfo_getBalanceAll } from '../../lib/redux/actions/UserInfoAction';

const backgroundColors = {
    TotalBal: '#E0E0E0',
    Main: '#E0E0E0',
    Sportsbook: '#C1E0FF',
    LiveDealer: '#97D8A5',
    P2P: '#C1E0FF',
    Slots: '#F5E497',
    Keno: '#FCA6A7',
};


class HomeHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            BtnPosTop: 0,
            BtnPosLeft: 0,
            nowGame: 'BTI',
            gameMenuState: false,
            balance: '',
            transferPopup: false,
        };
    }
    componentWillMount(props) {
        this.getMaintenanceStatus()
    }
    componentDidMount() { 
        window.EuroCupLogin = false
    }

    componentWillUnmount() { }
    	// 獲取維護資訊
	getMaintenanceStatus = () => {
		const providers = ['IPSB']; // 樂天堂體育、IM體育
		let processed = [];

		providers.forEach(function (provider) {
			processed.push(fetchRequest(`${ApiPort.GetProvidersMaintenanceStatus}provider=${provider}&`));
		});

		Promise.all(processed).then((res) => {
			let IMSportStatus;

			if (res) {
                IMSportStatus =
                res[0].ErrorCode == 0 && res[0].Result && res[0].Result.find((v) => v.PlatformGroup === 'Mobile')['IsMaintenance'];

				this.props.maintainStatus_setIM(IMSportStatus === true);

				//和token獲取狀態一起判斷
				// IMSportStatus = this.checkMaintenanceStatus('im');
			}
		});
	};


    //金額分隔符
    numberWithCommas(x) {
        return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0;
    }

    doAllTransfer() {
        PiwikEvent('Transfer', 'Click', 'QuickTransfer_EUROPage')
        this.setState({ transferPopup: false })
        Toast.loading("转账中,请稍候...", 200);
        TransferSubmit(
            {
                fromAccount: "ALL",
                toAccount: "SB",
                amount: 0,
                bonusId: 0,
                bonusCoupon: "",
                blackBoxValue: Iovation,
                e2BlackBoxValue: E2Backbox,
            },
            (res) => {
                Toast.hide();
                if (res) {
                    // 0 – failed 失败
                    // 1 - success 成功
                    // 2 – pending  等待
                    if (res.status == 1) {
                        Toasts.success("转账成功!", 1);
                        setTimeout(() => {
                            this.props.userInfo_getBalanceAll();
                        }, 1000);
                    } else {
                        Toasts.error(res.messages, 1);
                    }
                } else {
                    Toasts.error("转账出错，稍后重试！");
                }
            }
        );
    }







    Jump(key) {
        if (!ApiPort.UserLogin) {
            window.EuroCupLogin = true
            Actions.Login()
            return
        }
    }
    getBtnPos = (e) => {
        NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
            console.log(y,'BtnPosTopBtnPosTop', py)
            this.setState({
                BtnPosTop: y,
                BtnPosLeft: px,
            });
        });
    }

    render() {
        const {
            nowGame,
            gameDB,
            gameMenuState,
            balance,
            eye,
            BtnPosTop,
            BtnPosLeft,
            transferPopup,
        } = this.state;

        let ada = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1]
        console.log('this.props.userInfo',this.props.userInfo)
        return (
            <View>
                <View style={styles.headers}>
                    {/* 转账 */}
                    <Modal
                        animationType="none"
                        transparent={true}
                        visible={transferPopup}
                        onRequestClose={() => { }}
                    >
                        <View style={styles.modals}>
                            <View style={[styles.modalsView,{marginTop: DeviceInfoIos? 95: 70,}]}>
                                {
                                    this.props.userInfo.allBalance && this.props.userInfo.allBalance.length > 0 && this.props.userInfo.allBalance.map((item, index) => {
                                        return (
                                            <View key={index} style={styles.transferList}>
                                                <View style={{ width: 10, height: 10, borderRadius: 20, backgroundColor: backgroundColors[item.category] }} />
                                                <Text style={{ color: '#616161', width: 120, fontSize: 12, paddingLeft: 15, }}>{item.localizedName}</Text>
                                                <Text style={{ color: '#000', fontSize: 12 }}>¥ {this.numberWithCommas(item.balance)}</Text>
                                                {
                                                    item.name == 'SB' &&
                                                    <Touch onPress={() => { this.doAllTransfer() }} style={{ position: 'absolute', right: 0 }}>
                                                        <Image resizeMode='stretch' source={require('../../images/transfer/onebutton.png')} style={{ width: 24, height: 24 }} />
                                                    </Touch>
                                                }

                                            </View>
                                        )
                                    })
                                }
                                <Touch onPress={() => { this.setState({ transferPopup: false },() => {Actions.DepositCenter({ from: 'GamePage' })});PiwikEvent('Deposit Nav', 'Click', 'Deposit_EUROPage') }} style={{ width: width - 50, backgroundColor: '#00A6FF', borderRadius: 10, marginBottom: 20, }}>
                                    <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 40, }}>存款</Text>
                                </Touch>
                                <Touch onPress={() => { this.setState({ transferPopup: false }) }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={styles.arrows} >
                                    </View>
                                </Touch>
                            </View>
                            <Touch style={styles.modalClose} onPress={() => { this.setState({ transferPopup: false }) }} ></Touch>
                        </View>
                    </Modal>
                    
                    {/*logo*/}
                    <View onLayout={(e) => this.getBtnPos(e)} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: 110}}>
                        <Touch onPress={() => {Actions.pop()}} >
                            <Image resizeMode='stretch' source={require('../../images/euroCup/home.png')} style={{ width: 20, height: 20 }} />
                        </Touch>
                        <Image source={require("../../images/euroCup/logo.png")} style={{ height: 32, width: 80 }} />
                    </View>
                    {/*logo*/}


                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        {/*餘額*/}
                        {ApiPort.UserLogin ?
                            <Touch onPress={() => { this.setState({ transferPopup: true }) }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 15 }}>
                                <View style={styles.MoneyBG}>
                                    <Text style={{ fontSize: 11, color: '#fff' }}>
                                        ¥ {this.numberWithCommas(this.props.userInfo.balanceTotal)}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 11, color: '#fff' }}>总余额</Text>
                            </Touch>
                            :
                            <Touch onPress={() => { this.Jump() }} style={{ backgroundColor: '#33C85D', borderRadius: 5, padding: 6, marginRight: 10 }}>
                                <Text style={{ color: '#fff', fontSize: 12 }}>登录/立即开户</Text>
                            </Touch>
                        }
                        <Touch onPress={() => { LiveChatOpenGlobe(); PiwikEvent('CS', 'Launch', 'LiveChat_EUROPage') }} style={{ width: 30, height: 25 }}>
                            <View>
                                <Image source={require('../../images/cs.png')} style={{ width: 25, height: 25 }} />
                            </View>
                        </Touch>
                    </View>

                </View>
            </View>
        );
    }
}


const mapStateToProps = state => ({
    userInfo: state.userInfo,
    maintainStatus: state.maintainStatus,
});
const mapDispatchToProps = {
    userInfo_getBalanceAll: (forceUpdate = false) => ACTION_UserInfo_getBalanceAll(forceUpdate),
    maintainStatus_setIM: (isMaintenance) => ACTION_MaintainStatus_SetIM(isMaintenance),
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);

const styles = StyleSheet.create({
    MoneyBG: {
        backgroundColor: '#0196E6',
        padding: 3,
        borderRadius: 5,
    },
    headers: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        width: width,
        backgroundColor: "#00a6ff",
        zIndex: 99,
        paddingLeft: 10,
        paddingRight: 10,
    },
    modals: {
        flex: 1,
    },
    modalsView: {
        backgroundColor: '#fff',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        // position: 'absolute',
        // left: 0,
        width: width,
        zIndex: 9999,
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 10,
    },
    transferList: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        height: 30,
        width: width - 50,
    },
    modalClose: {
        backgroundColor: "rgba(0, 0, 0,0.5)",
        width: width,
        height: height,
        marginTop: 200,
        position: 'absolute',
        top: 150,
        left: 0,
    },
    arrows: {
        width: 15,
        height: 15,
        borderColor: '#00A6FF',
        borderLeftWidth: 2,
        borderTopWidth: 2,
        transform: [{ rotate: '45deg' }],
    },
});
