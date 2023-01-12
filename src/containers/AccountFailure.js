import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
    Image,
    Dimensions,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Platform,
} from "react-native";
import {
    Button,
    Carousel,
    WhiteSpace,
    WingBlank,
    Radio,
    InputItem,
    DatePicker,
    Flex,
    Toast,
    List
} from "antd-mobile-rn";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CheckBox from "react-native-check-box";
import Touch from "react-native-touch-once";

import { NavigationActions } from "react-navigation";
import { Actions } from "react-native-router-flux";

const { width, height } = Dimensions.get("window");

import ListItems from "antd-mobile-rn/lib/list/style/index.native";
import { emailReg } from "../actions/Reg"

const newStyle = {};
for (const key in ListItems) {
    if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
        newStyle[key] = { ...StyleSheet.flatten(ListItems[key]) };
        newStyle[key].opacity = 0;
        newStyle[key].color = "transparent";
        newStyle[key].backgroundColor = "transparent";
        newStyle[key].height = 50
        newStyle[key].width = width
    }
}

class AccountFailure extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            typeAction: this.props.typeAction || 100,//0默认，1验证，2验证失败，3验证成功,4长时间未登录，5资料不全
            dayDate: '',
            monthDate: '',
            yearDate: '',
            userName: '',
            emails: '',
            VerifyTimes: 3,
            emailST: '',
            okBtn: false,
            nowDate: (new Date()).getTime() - (18 * 365.5 * 24 * 60 * 60 * 1000),//最低18周岁
        };
    }
    componentWillMount() {
        !this.props.typeAction && this.getAValidation()
    }
    componentDidMount() {
    }


    componentWillUnmount() {

    }
    getAValidation() {
    let data = { userName: userNameDB }
    Toast.loading("加载中...", 100);
    fetchRequest(ApiPort.ConfiscatedAccountInfoValidation, 'POST', data)
        .then(res => {
            Toast.hide();
            if (res && res.result) {
                if(res.result.code == 'MEM00057') {
                    //资料完整，查看还有几次验证
                    this.getAttempts()
                } else {
                    this.setState({typeAction: 5})
                }
            } else {
                Toast.fail('系统出现异常，请您联系小同在线客服。', 2);
            }
        })
        .catch(error => {
            Toast.fail('系统出现异常，请您联系小同在线客服。', 2);
        })
    }
    getAttempts() {
        let data = { userName: userNameDB }
        Toast.loading("加载中...", 100);
        fetchRequest(ApiPort.ConfiscatedMemberVerifyAttempts, 'POST', data)
            .then(res => {
                Toast.hide();
                if (res && res.isSuccess) {
                    let VerifyTimes = res.result.attemptRemaining
                    this.setState({VerifyTimes})
                    if(VerifyTimes < 1) {
                        this.setState({typeAction: 2})
                    } else {
                        this.setState({typeAction: 0})
                    }
                } else {
                    Toast.fail('系统出现异常，请您联系小同在线客服。', 2);
                }
            })
            .catch(error => {
                Toast.fail('系统出现异常，请您联系小同在线客服。', 2);
            })
    }
    getWallets() {
        if (!this.state.okBtn) { return }

        let dates = `${this.state.yearDate}-${this.state.monthDate}-${this.state.dayDate}`
        let data = {
            dob: dates,
            email: this.state.emails,
            firstName: this.state.userName,
            lastName: "",
            userName: userNameDB,
        }

        Toast.loading("提交中...", 100);
        fetchRequest(ApiPort.ConfiscatedMemberVerification, 'POST', data)
            .then(res => {
                Toast.hide();
                if (res && res.isSuccess) {
                    if (res.result.message.indexOf('成功') > -1) {
                        //成功
                        Toast.success(res.result.description, 2);
                        this.setState({ typeAction: 3 })

                    } else {
                        //失败
                        if(!res.result.attempts) {
                        //attempts空不提示，次数减一
                        Toast.fail(res.result.description, 2);
                        }
                        this.setState({ okBtn: false })
                        if (res.result.attempts) {
                            this.setState({ VerifyTimes: res.result.attempts })
                            global.storage.save({
                                key: 'VerifyTime',
                                id: 'VerifyTime',
                                data: res.result.attempts,
                                expires: null
                            });
                        }
                        if (res.result.attempts == 0) {
                            this.setState({ typeAction: 2 })
                        }
                    }
                } else {
                    Toast.fail(res.description, 2);
                }
            })
            .catch(error => {
                Toast.fail('系统出现异常，请您联系小同在线客服。', 2);
            })
    }

    //生日选择
    monthDateChange = (value) => {
        let Wdate = new Date(value);
        let Wy = Wdate.getFullYear();
        let Wm = Wdate.getMonth() + 1;
        let Wd = Wdate.getDate();
        if (Number(Wm) < 10) Wm = '0' + Wm.toString();
        if (Number(Wd) < 10) Wd = '0' + Wd.toString();
        this.setState({
            dayDate: Wd,
            monthDate: Wm,
            yearDate: Wy,
        }, () => { this.validation() })
    }
    emails(value) {
        let emailST = '';
        if (value == '') {
            emailST = '请输入邮箱地址'
        } else if (emailReg.test(value) != true) {
            emailST = '电子邮箱地址无效的格式'
        }
        this.setState({ emails: value, emailST }, () => {
            this.validation()
        })
    }
    validation() {
        let okBtn = false;
        let st = this.state;
        if (st.userName && st.emails && st.dayDate && !st.emailST) {
            okBtn = true
        }
        this.setState({ okBtn })
    }
    render() {
        const {
            typeAction,
            dayDate,
            monthDate,
            yearDate,
            userName,
            emails,
            VerifyTimes,
            okBtn,
            emailST,
            nowDate,
        } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                    <ImageBackground
                        resizeMode="cover"
                        source={require("../images/y-so-serious-white.png")}
                        style={{ width: width, height: height, backgroundColor: '#f4f4f4', marginTop: Platform.OS == "ios" ? 40 : 0, paddingBottom: 40 }}
                    >
                        <View style={{ backgroundColor: '#D91616', height: 58, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: width, paddingLeft: 25, }}>
                            <Image resizeMode='stretch' source={require('../images/login/tlc-logo.png')} style={{ width: 90, height: 45 }} />
                        </View>
                        <View style={styles.viewItem}>
                            {
                                typeAction == 0 &&
                                <View style={styles.viewCenter}>
                                    <Image resizeMode='stretch' source={require('../images/img-restricted.png')} style={{ width: width * 0.45, height: (width * 0.45) * 1.166 }} />
                                    <Text style={{ fontSize: 24, color: '#222', lineHeight: 60, fontWeight: 'bold' }}>
                                        您的账户已被禁止使用
                                    </Text>
                                    <Text style={{ color: '#222', lineHeight: 22, marginBottom: 32 }}>
                                        请回答与您的帐户相关的安全问题，或与在线客服联系验证您的身份。
                                    </Text>
                                    <Touch onPress={() => { this.setState({ typeAction: 1 }) }} style={[styles.touchView, { backgroundColor: '#1C8EFF' }]}>
                                        <Text style={{ color: '#fff', paddingLift: 15 }}>开始验证</Text>
                                    </Touch>
                                    <Touch onPress={() => { LiveChatOpenGlobe() }} style={styles.touchView}>
                                        <Image resizeMode='stretch' source={require('../images/icon-cs1.png')} style={{ width: 16, height: 16 }} />
                                        <Text style={{ color: '#fff', paddingLift: 15 }}>在线客服</Text>
                                    </Touch>
                                </View>
                            }
                            {
                                typeAction == 1 &&
                                <View style={styles.viewCenter}>
                                    <Text style={{ fontSize: 24, color: '#222', lineHeight: 60, fontWeight: 'bold' }}>
                                        账户验证
                                    </Text>
                                    <Text style={{ color: '#222', lineHeight: 22, marginBottom: 22 }}>
                                        请回答以下问题，以验证您的身份，并重新启动您的账户。
                                    </Text>
                                    {
                                        VerifyTimes < 3 &&
                                        <Text style={{ color: '#222', lineHeight: 22, marginBottom: 22 }}>
                                            请提供有效信息以便我们处理您的请求，您最多只能再提交 <Text style={{ color: '#F92D2D' }}>{VerifyTimes}</Text> 次。或是请联系<Text style={{color: '#1C8EFF', textDecorationLine:'underline'}} onPress={() => { LiveChatOpenGlobe() }}>在线客服</Text>。
                                        </Text>
                                    }
                                    <View>
                                        <Text style={{ color: '#666666', lineHeight: 28 }}>生日日期</Text>
                                        <View style={styles.dateSelect}>
                                            {
                                                dayDate == '' &&
                                                <Text style={{ color: '#999999' }}>请选择日期</Text>
                                            }
                                            {
                                                dayDate != '' &&
                                                <Text style={{ color: '#222222' }}>{yearDate}-{monthDate}-{dayDate}</Text>
                                            }
                                            <Image resizeMode='stretch' source={require('../images/icon-calendar.png')} style={{ width: 18, height: 18 }} />
                                        </View>
                                        <View style={{ position: 'absolute', top: 15, left: 0, zIndex: 999, width: width }}>
                                            <DatePicker
                                                title=""
                                                value={new Date(nowDate)}
                                                mode="date"
                                                minDate={new Date(new Date('1920/01/01'))}
                                                maxDate={new Date(nowDate)}
                                                onChange={this.monthDateChange}
                                                format="YYYY-MM-DD"
                                            >
                                                <List.Item styles={StyleSheet.create(newStyle)}>
                                                    {/* <Text style={{ fontSize: 14, color: '#fff' }}>月份</Text> */}
                                                </List.Item>
                                            </DatePicker>
                                        </View>
                                    </View>

                                    <View>
                                        <Text style={{ color: '#666666', lineHeight: 28 }}>注册姓名</Text>
                                        <View style={styles.dateSelect}>
                                            <TextInput
                                                value={userName}
                                                style={{ color: "#222222", height: 38, width: width - 60 }}
                                                placeholder={'请输入您的姓名'}
                                                placeholderTextColor={'#999999'}
                                                maxLength={25}
                                                onChangeText={value => {
                                                    let userName = value.replace(/\s+/g, '')
                                                    this.setState({ userName }, () => { this.validation() })
                                                }}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text style={{ color: '#666666', lineHeight: 28 }}>邮箱地址</Text>
                                        <View style={styles.dateSelect}>
                                            <TextInput
                                                value={emails}
                                                style={{ color: "#222222", height: 38, width: width - 60 }}
                                                placeholder={'请输入邮箱地址'}
                                                placeholderTextColor={'#999999'}
                                                maxLength={50}
                                                onChangeText={value => {
                                                    this.emails(value)
                                                }}
                                            />
                                        </View>
                                        {
                                            emailST != '' &&
                                            <Text style={{ fontSize: 12, color: '#F92D2D' }}>{emailST}</Text>
                                        }
                                    </View>


                                    <Touch onPress={() => { this.getWallets() }} style={[styles.touchView, { backgroundColor: okBtn ? '#1C8EFF' : '#ccc' }]}>
                                        <Text style={{ color: '#fff', paddingLift: 15 }}>提交</Text>
                                    </Touch>
                                    <Touch onPress={() => { LiveChatOpenGlobe() }} style={styles.touchView}>
                                        <Image resizeMode='stretch' source={require('../images/icon-cs1.png')} style={{ width: 16, height: 16 }} />
                                        <Text style={{ color: '#fff', paddingLift: 15 }}>在线客服</Text>
                                    </Touch>
                                    <Text style={{ color: '#222222', lineHeight: 40 }}>可提交次数还剩 <Text style={{ color: '#F92D2D' }}>{VerifyTimes}</Text> 次</Text>
                                </View>
                            }

                            {
                                //失败
                                typeAction == 2 &&
                                <View style={styles.viewCenter}>
                                    <Image resizeMode='stretch' source={require('../images/img-restricted.png')} style={{ width: width * 0.45, height: (width * 0.45) * 1.166 }} />
                                    <Text style={{ fontSize: 24, color: '#222', lineHeight: 60, fontWeight: 'bold' }}>
                                        账户验证失败
                                    </Text>
                                    <Text style={{ color: '#222', lineHeight: 22, marginBottom: 32 }}>
                                        您的账户已被禁止使用，您最多只能提交验证 3 次。请直接联系在线客服。
                                    </Text>
                                    <Touch onPress={() => { LiveChatOpenGlobe() }} style={styles.touchView}>
                                        <Image resizeMode='stretch' source={require('../images/icon-cs1.png')} style={{ width: 16, height: 16 }} />
                                        <Text style={{ color: '#fff', paddingLift: 15 }}>在线客服</Text>
                                    </Touch>
                                </View>
                            }

                            {
                                //成功
                                typeAction == 3 &&
                                <View style={styles.viewCenter}>
                                    <Image resizeMode='stretch' source={require('../images/afterSignup.png')} style={{ width: width * 0.50, height: (width * 0.50) * 0.9333 }} />
                                    <Text style={{ fontSize: 24, color: '#222', lineHeight: 60, fontWeight: 'bold' }}>
                                        账户验证成功
                                    </Text>
                                    <Text style={{ color: '#222', lineHeight: 22, marginBottom: 32 }}>
                                        您的账户已成功重新启用。 请点击“确定”以重新回到首页。
                                    </Text>
                                    <Touch onPress={() => { 
                                        setTimeout(() => { window.AccountFailureLogin && window.AccountFailureLogin() }, 500)
                                        Actions.pop() 
                                    }} style={styles.touchView}>
                                        <Text style={{ color: '#fff', paddingLift: 15 }}>确定</Text>
                                    </Touch>
                                </View>
                            }

                            {
                                //长时间未登录，找客服
                                typeAction == 4 &&
                                <View style={styles.viewCenter}>
                                    <Image resizeMode='stretch' source={require('../images/img-restricted.png')} style={{ width: width * 0.45, height: (width * 0.45) * 1.166 }} />
                                    <Text style={{ fontSize: 24, color: '#222', lineHeight: 60, fontWeight: 'bold' }}>
                                        您的账户已关闭
                                    </Text>
                                    <Text style={{ color: '#222', lineHeight: 22, marginBottom: 32 }}>
                                        因为您长时间未游戏，您的账户已关闭。请注册新的账号或与客服联系。
                                    </Text>
                                    <Touch onPress={() => { LiveChatOpenGlobe() }} style={styles.touchView}>
                                        <Image resizeMode='stretch' source={require('../images/icon-cs1.png')} style={{ width: 16, height: 16 }} />
                                        <Text style={{ color: '#fff', paddingLift: 15 }}>在线客服</Text>
                                    </Touch>
                                </View>
                            }
                                                        {
                                //是资料不全，找客服
                                typeAction == 5 &&
                                <View style={styles.viewCenter}>
                                    <Image resizeMode='stretch' source={require('../images/img-restricted.png')} style={{ width: width * 0.45, height: (width * 0.45) * 1.166 }} />
                                    <Text style={{ fontSize: 24, color: '#222', lineHeight: 60, fontWeight: 'bold' }}>
                                        您的账户已被禁止使用
                                    </Text>
                                    <Text style={{ color: '#222', lineHeight: 22, marginBottom: 32 }}>
                                        您的验证尚未完成，请与在线客服联系以验证您的身份。
                                    </Text>
                                    <Touch onPress={() => { LiveChatOpenGlobe() }} style={styles.touchView}>
                                        <Image resizeMode='stretch' source={require('../images/icon-cs1.png')} style={{ width: 16, height: 16 }} />
                                        <Text style={{ color: '#fff', paddingLift: 15 }}>在线客服</Text>
                                    </Touch>
                                </View>
                            }
                        </View>
                    </ImageBackground>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

export default AccountFailure;

const styles = StyleSheet.create({
    viewItem: {
        padding: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        paddingTop: 25
    },
    viewCenter: {
        padding: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        paddingTop: 25,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: width - 30,
    },
    touchView: {
        backgroundColor: '#F92D2D',
        width: width - 60,
        borderRadius: 8,
        height: 42,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        marginTop: 10,
    },
    dateSelect: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 10,
        height: 40,
        width: width - 60,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 12,
    },
    dateInput: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 10,
        height: 40,
        width: width - 60,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
    },
});








