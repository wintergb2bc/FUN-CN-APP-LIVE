import React, { Component } from "react";
import {
    ScrollView,
    View,
    Text,
    Dimensions,
    Image,
    ImageBackground,
    TouchableOpacity,
    Platform,
    StyleSheet,
    Linking,
    Switch,
    Clipboard,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { WhiteSpace, Toast } from "antd-mobile-rn";
const { width, height } = Dimensions.get("window");
import Touch from 'react-native-touch-once';
import {fetchRequestSB} from './../../lib/SportRequest';
import {ApiPortSB} from './../../lib/SPORTAPI';

const oddsTypeList = {
    MY: '马来盘', //马来盘
    HK: '香港盘', //香港盘
    EU: '欧洲盘', //欧洲盘
    ID: '印尼盘', //印尼盘
}

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setType: this.props.setType || 'setSystem',
            setTing: '',
            alwaysAcceptBetterOdds: false,
            amount1: 9999,
            amount2: 1000,
            amount3: 100,
            betSlipSound: false,
            betSlipVibration: false,
            goalAllRB: true,
            goalIBet: true,
            goalMyFavorite: true,
            goalNotification: true,
            goalSound: false,
            goalSoundType: 1,
            goalVibration: true,
            listDisplayType: 1,
            oddsType: "EU",
        };
        this.propsChangeFun = this.propsChangeFun.bind(this)
    }

    componentWillMount() {
        if (this.props.setType == 'setPush') {
            this.props.navigation.setParams({
                title: '推送设置'
            });
        }
        global.storage
            .load({
                key: "setTing",
                id: "setTing"
            })
            .then(res => {
                this.setData(res)
            })
            .catch(err => {
                // this.getSeting()
            });
            this.getSeting()
    }

    componentDidMount() {
        let adsd = {
            alwaysAcceptBetterOdds: false,
            amount1: 7777,
            amount2: 1000,
            amount3: 100,
            betSlipSound: false,
            betSlipVibration: false,
            goalAllRB: false,
            goalIBet: true,
            goalMyFavorite: true,
            goalNotification: true,
            goalSound: false,
            goalSoundType: 1,
            goalVibration: true,
            listDisplayType: 1,
            oddsType: "EU",
        }
        global.storage.save({
            key: "setTing",
            id: "setTing",
            data: adsd,
            expires: null
        });
    }

    componentWillUnmount() { }

    setData(res) {
        this.setState({
            amount1: res.amount1,
            amount2: res.amount2,
            amount3: res.amount3,
            oddsType: res.oddsType,
            alwaysAcceptBetterOdds: res.alwaysAcceptBetterOdds,
            betSlipVibration: res.betSlipVibration,
            betSlipSound: res.betSlipSound,
            goalNotification: res.goalNotification,
            goalMyFavorite: res.goalMyFavorite,
            goalIBet: res.goalIBet,
            goalAllRB: res.goalAllRB,
            goalSound: res.goalSound,
            goalSoundType: res.goalSoundType,
            goalVibration: res.goalVibration,
            listDisplayType: res.listDisplayType ?? 1,
            setTing: res,
        })
    }

    getSeting() {
        // Toast.loading('加载中,请稍候...', 200);
        fetchRequestSB(ApiPortSB.GetMemberNotificationSetting, 'GET')
            .then((res) => {
                // Toast.hide();
                if (res && res.result && res.result.notificationSetting) {
                    this.setData(res.result.notificationSetting)
                    global.storage.save({
                        key: "setTing",
                        id: "setTing",
                        data: res.result.notificationSetting,
                        expires: null
                    });
                }
            })
            .catch((e) => { });
    }

    onSubmit() {
        const {
            alwaysAcceptBetterOdds,
            amount1,
            amount2,
            amount3,
            betSlipSound,
            betSlipVibration,
            goalAllRB,
            goalIBet,
            goalMyFavorite,
            goalNotification,
            goalSound,
            goalSoundType,
            goalVibration,
            oddsType,
            listDisplayType,
        } = this.state;
        // const val1 = parseInt(amount1), val2 = parseInt(amount2), val3 = parseInt(amount3);

        // if (val1 < 10 || val2 < 10 || val3 < 10) {
        //     Toasts.error("最低金额是￥10");
        //     return;
        // }
        // if (val1 > 99999 || val2 > 99999 || val3 > 99999) {
        //     Toasts.error("最高金额是￥99,999");
        //     return;
        // }
        // if (val1 < val2 || val1 < val3) {
        //     Toasts.error("快捷金额1必须大于快捷金额2和快捷金额3");
        //     return;
        // }
        // if (val2 > val1 || val2 < val3) {
        //     Toasts.error("快捷金额2必须小于快捷金额1且大于快捷金额3");
        //     return;
        // }
        // if (val3 > val1 || val3 > val2) {
        //     Toasts.error("快捷金额3必须小于快捷金额1和快捷金额2");
        //     return;
        // }

        const updateData = {
            amount1: amount1,
            amount2: amount2,
            amount3: amount3,
            oddsType: oddsType,
            alwaysAcceptBetterOdds: alwaysAcceptBetterOdds,
            betSlipVibration: betSlipVibration,
            betSlipSound: betSlipSound,
            goalNotification: goalNotification,
            goalMyFavorite: goalMyFavorite,
            goalIBet: goalIBet,
            goalAllRB: goalAllRB,
            goalSound: goalSound,
            goalSoundType: goalSoundType,
            goalVibration: goalVibration,
            listDisplayType: listDisplayType,
        };
        // Toast.loading('设置中,请稍候...', 200);
        fetchRequestSB(ApiPortSB.EditMemberNotificationSetting, "POST", updateData)
            .then((res) => {
                // Toast.hide();
                if (res.isSuccess == true) {
                    Toasts.success('设置成功');
                    localStorage.setItem('NotificationSetting-' + res.result.memberCode, JSON.stringify(updateData));
                    global.storage.save({
                        key: "setTing",
                        id: "setTing",
                        data: updateData,
                        expires: null
                    });
                }
            }).catch((err) => {
                // Toast.hide();
            });
    }

    onSwitchChange(key) {
        if(key == 'goalNotification') {
            if(this.state.goalNotification == true) {
                this.setState({
                    goalMyFavorite: false,
                    goalIBet: false,
                    goalAllRB: false,
                    goalSound: false,
                    goalVibration: false,
                })
            } else {
                this.setState({
                    goalMyFavorite: true,
                    goalIBet: true,
                    goalAllRB: false,
                    goalSound: true,
                    goalVibration: true,
                })
            }
        }

        this.setState({ [key]: !this.state[key] }, () => {
            this.onSubmit()
        })
    }

    checkPush(key) {
        this.setState({ [key]: !this.state[key] }, () => {
            this.onSubmit()
        })
    }
    propsChangeFun(oddsType) {
        console.log('oddsTypeoddsType',oddsType)
        this.setState({ oddsType })
    }
    render() {
        const {
            setType,
            alwaysAcceptBetterOdds,
            amount1,
            amount2,
            amount3,
            betSlipSound,
            betSlipVibration,
            goalAllRB,
            goalIBet,
            goalMyFavorite,
            goalNotification,
            goalSound,
            goalSoundType,
            goalVibration,
            oddsType,
        } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: '#efeff4' }}>
                {
                    setType == 'setSystem' &&
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ padding: 15 }}>
                            <Touch onPress={() => { Actions.SetTingModle({ setType: 'oddsType', propsChangeFun: this.propsChangeFun }) }} style={styles.setSystemView}>
                                <Text style={{ color: '#666' }}>盘口设置</Text>
                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#bcbec3', fontSize: 12 }}>{oddsTypeList[oddsType]}</Text>
                                    <Image resizeMode='stretch' source={require('../../images/iconRight.png')} style={{ width: 30, height: 30 }} />
                                </View>
                            </Touch>

                            <View style={styles.setSystemView}>
                                <Text style={{ color: '#666' }}>自动接受更好的赔率</Text>
                                <Switch
                                    onTintColor={'#00A6FF'}
                                    value={alwaysAcceptBetterOdds}
                                    thumbTintColor={'#fff'}
                                    onValueChange={() => { this.onSwitchChange('alwaysAcceptBetterOdds') }}
                                />
                            </View>

                            <View style={styles.setSystemView}>
                                <Text style={{ color: '#666' }}>震动</Text>
                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#bcbec3', fontSize: 12 }}>注单震动提醒</Text>
                                    <Switch
                                        onTintColor={'#00A6FF'}
                                        value={betSlipVibration}
                                        thumbTintColor={'#fff'}
                                        onValueChange={() => { this.onSwitchChange('betSlipVibration') }}
                                    />
                                </View>
                            </View>

                            <View style={styles.setSystemView}>
                                <Text style={{ color: '#666' }}>提示音</Text>
                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#bcbec3', fontSize: 12 }}>注单提示音</Text>
                                    <Switch
                                        onTintColor={'#00A6FF'}
                                        value={betSlipSound}
                                        thumbTintColor={'#fff'}
                                        onValueChange={() => { this.onSwitchChange('betSlipSound') }}
                                    />
                                </View>
                            </View>

                            <Touch onPress={() => { Actions.SetTingModle({ setType: 'amount' }) }} style={styles.setSystemView}>
                                <Text style={{ color: '#666' }}>自定义快捷金额</Text>
                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Image resizeMode='stretch' source={require('../../images/iconRight.png')} style={{ width: 30, height: 30 }} />
                                </View>
                            </Touch>
                        </View>
                    </ScrollView>
                }
                {
                    setType == 'setPush' &&
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ padding: 15 }}>
                            <View style={styles.setPushView}>
                                <View style={styles.setPushListTop}>
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>进球推送</Text>
                                    <Switch
                                        onTintColor={'#00A6FF'}
                                        value={goalNotification}
                                        thumbTintColor={'#fff'}
                                        onValueChange={() => { this.onSwitchChange('goalNotification') }}
                                    />
                                </View>
                                <Touch onPress={() => { this.checkPush('goalMyFavorite') }} style={styles.setPushList}>
                                    <Text style={{ color: '#666666', width: 110, textAlign: 'center' }}>我收藏的赛事</Text>
                                    <Image
                                        resizeMode="contain"
                                        source={goalMyFavorite ? require("../../images/check.png") : require("../../images/nocheck.png")}
                                        style={{ width: 20, height: 20, marginRight: 15, }} />
                                </Touch>
                                <Touch onPress={() => { this.checkPush('goalIBet') }} style={styles.setPushList}>
                                    <Text style={{ color: '#666666', width: 110, textAlign: 'center' }}>我投注的赛事</Text>
                                    <Image
                                        resizeMode="contain"
                                        source={goalIBet ? require("../../images/check.png") : require("../../images/nocheck.png")}
                                        style={{ width: 20, height: 20, marginRight: 15, }} />
                                </Touch>
                                <Touch onPress={() => { this.checkPush('goalAllRB') }} style={styles.setPushList}>
                                    <Text style={{ color: '#666666', width: 110, textAlign: 'center' }}>全部滚球</Text>
                                    <Image
                                        resizeMode="contain"
                                        source={goalAllRB ? require("../../images/check.png") : require("../../images/nocheck.png")}
                                        style={{ width: 20, height: 20, marginRight: 15, }} />
                                </Touch>

                                <View style={styles.setPushList}>
                                    <Text style={{ color: '#000', fontWeight: 'bold', width: 110, textAlign: 'center' }}>声音</Text>
                                    <Switch
                                        onTintColor={'#00A6FF'}
                                        thumbTintColor={'#fff'}
                                        value={goalSound}
                                        onValueChange={() => { this.onSwitchChange('goalSound') }}
                                    />
                                </View>
                                <View style={styles.setPushList}>
                                    <Text style={{ color: '#000', fontWeight: 'bold', width: 110, textAlign: 'center' }}>震动</Text>
                                    <Switch
                                        onTintColor={'#00A6FF'}
                                        value={goalVibration}
                                        thumbTintColor={'#fff'}
                                        onValueChange={() => { this.onSwitchChange('goalVibration') }}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                }
            </View>
        );
    }
}

export default Setting;

const styles = StyleSheet.create({
    setSystemView: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 15,
    },




    setPushView: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    setPushListTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: width - 60,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    setPushList: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: width - 60,
        height: 50,
    }
});
