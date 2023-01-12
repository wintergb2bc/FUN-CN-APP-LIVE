import React, { Component } from 'react';
import { StyleSheet, Text, TextStyle, View, TextInput, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Flex, Carousel, WhiteSpace, WingBlank, InputItem, Toast, Modal } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import { NavigationActions } from 'react-navigation';
import { passwordReg } from "../../actions/Reg"
import LivechatDragHoliday from "../LivechatDragHoliday"  //可拖動懸浮
import { Actions } from 'react-native-router-flux';
const {
    width
} = Dimensions.get('window')


class SetPassword extends React.Component<any, any> {

    inputRef: any;

    constructor(props) {
        super(props);
        this.state = {

            password1: '',
            password2: '',
            password3: '',
            passwordST1: '',
            passwordST2: '',
            passwordST3: '',
            changeBtn: false,
            eyse1: true,
            eyse2: true,
            eyse3: true,
            Countdown: '10:00',
            loginOutPop: false,
        }

    }
    componentWillMount(props) {
        this.Countdown()
    }

    componentWillUnmount() {
        this.Countdowns && clearInterval(this.Countdowns);
    }


    password2(value) {
        let passwordST2 = '';
        let passwordST3 = '';
        if (value == '') {
            passwordST2 = '请输入新密码'
        } else if (!passwordReg.test(value)) {
            passwordST2 = '密码必须包含 6-20 个字符，字符只限于使用字母和数字。可以包含^#$@中的特殊字符'
        } else if (value != this.state.password3 && this.state.password3) {
            passwordST3 = '您输入的确认密码与新密码不相同'
        }

        this.setState({ passwordST2, passwordST3, password2: value }, () => {
            this.validation();
        })
    }
    password3(value) {
        let passwordST3 = '';
        if (value == '') {
            passwordST3 = '请再次输入新密码'
        } else if (!passwordReg.test(value)) {
            passwordST3 = '密码必须包含 6-20 个字符，字符只限于使用字母和数字。可以包含^#$@中的特殊字符'
        } else if (value != this.state.password2 && this.state.password2) {
            passwordST3 = '您输入的确认密码与新密码不相同'
        }

        this.setState({ passwordST3, password3: value }, () => {
            this.validation();
        })
    }
    validation() {
        const st = this.state;
        let changeBtn = true
        if (!st.password2 || !st.password3 || st.passwordST2 || st.passwordST3) {
            changeBtn = false
        }
        this.setState({ changeBtn })
    }

    changeBtn() {
        if (!this.state.changeBtn) { return }

        const MemberData = {
            "newPassword": this.state.password2
        }
        PiwikEvent('Submit_resetPW');
        Toast.loading('更改中,请稍候...', 200);

        fetchRequest(ApiPort.Password, 'PUT', MemberData)
            .then((res) => {
                Toast.hide();
                if (res.isSuccess) {
                    //修改成功后退出
                    navigateToSceneGlobeX();
                    Toast.success('密码更新成功', 2, () => {
                        //重新登录
                        Toast.loading("重新登录中,请稍候...", 3);
                        window.AccountFailureLogin && window.AccountFailureLogin(this.state.password2)
                    });
                } else {
                    Toast.fail(res.message);
                }
            })
            .catch((error) => {
                Toast.fail('出现错误请稍候重试');
            })
    }

    Countdown() {
        let time = 10 * 60
        let m, s, ms;
        this.Countdowns = setInterval(() => {
            time -= 1;
            m = "0" + parseInt(time / 60).toString();
            s = time - m * 60;
            if (s < 10) {
                s = "0" + s.toString();
            }
            ms = m + ":" + s;
            this.setState({ Countdown: ms });
            if (m == 0 && s == 0) {
                this.setState({ loginOutPop: true })
                clearInterval(this.Countdowns);
            }
        }, 1000);
    }

    render() {
        const {
            passwordST1,
            passwordST2,
            passwordST3,
            password1,
            password2,
            password3,
            changeBtn,
            eyse1,
            eyse2,
            eyse3,
            Countdown,
            loginOutPop,
        } = this.state;   //註冊訊息 
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', }}>
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={loginOutPop}
                    onRequestClose={() => { }}
                    style={{ padding: 0, width: width / 1.3 }}
                >
                    <View style={styles.secussModal}>
                        <Text style={{ color: '#222222', lineHeight: 25, fontSize: 16, fontWeight: 'bold', paddingBottom: 10 }}>等待超时</Text>
                        {/* <Image
							resizeMode="stretch"
							source={require("../../images/posino/icon-warn.png")}
							style={{ width: 60, height: 60 }}
						/> */}
                        <Text style={{ color: '#222222', lineHeight: 25, fontWeight: 'bold', paddingTop: 10 }}>该次登录已经超时</Text>
                        <Text style={{ color: '#222222', padding: 10, fontSize: 13 }}>您该次登录已经超时，请再次登录以验证并更新密码。</Text>
                        <Touch onPress={() => { this.setState({ loginOutPop: false }, () => { navigateToSceneGlobe(); Actions.pop() }) }} style={{ padding: 10, backgroundColor: '#00A6FF', borderRadius: 50, marginTop: 15 }}>
                            <Text style={{ color: '#fff', paddingLeft: 25, paddingRight: 25 }}>重新登录</Text>
                        </Touch>
                    </View>
                </Modal>
                <ScrollView
                    style={{ flex: 1 }}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flex: 1, padding: 22 }}>
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: 15 }}>
                            <View style={{ height: 35, width: 35, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 30, backgroundColor: '#00A6FF' }}>
                                <Image resizeMode='contain' source={require('../../images/tick.png')} style={{ width: 14, height: 10 }} />
                            </View>
                            <View style={{ height: 1, width: 200, backgroundColor: '#00A6FF' }} />
                            <View style={{ height: 35, width: 35, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 30, backgroundColor: '#00A6FF' }}>
                                <Text style={{color: '#fff', fontSize: 16}}>2</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#fff5bf', borderRadius: 8, padding: 12, marginBottom: 15 }}>
                            <Text style={{ color: '#83630b', fontSize: 14, lineHeight: 21 }}>{Countdown} 分钟来更新新密码。</Text>
                            <Text style={{ color: '#83630b', fontSize: 14, lineHeight: 21 }}>请在时间结束前更改密码。</Text>
                        </View>
                        <View style={{ borderRadius: 10 }}>
                            <View style={styles.inputRow}>
                                <TextInput
                                    value={password2}
                                    placeholder='新密码'
                                    placeholderTextColor="#999999"
                                    style={{ textAlign: 'left', paddingLeft: 10, width: width - 60 }}
                                    onChangeText={(value) => { this.password2(value) }}
                                    secureTextEntry={eyse2}
                                    maxLength={20}
                                />
                                <TouchableOpacity onPress={() => { this.setState({ eyse2: !eyse2 }) }} style={{ position: 'absolute', right: 15 }}>
                                    <Image resizeMode='contain' source={!eyse2 ? require('../../images/login/close_eye.png') : require('../../images/login/eyse.png')} style={{ width: 22, height: 16 }} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{ color: 'red', lineHeight: 20 }}>{passwordST2 != '' && passwordST2}</Text>
                            <View style={{ borderRadius: 8, backgroundColor: '#F7F7FC', padding: 12, marginBottom: 15 }}>
                                <Text style={{ color: '#666', fontSize: 12, lineHeight: 20 }}>
                                    密码必须包含6-20个字符，字符只限于使用字母和数字，
								</Text>
                                <Text style={{ color: '#666', fontSize: 12, lineHeight: 20 }}>
                                    可以包含^#$@中的特殊字符
								</Text>
                            </View>
                            <View style={styles.inputRow}>
                                <TextInput
                                    value={password3}
                                    placeholder='确认新密码'
                                    placeholderTextColor="#999999"
                                    style={{ textAlign: 'left', paddingLeft: 10, width: width - 60 }}
                                    onChangeText={(value) => { this.password3(value) }}
                                    secureTextEntry={eyse3}
                                    maxLength={20}
                                />
                                <TouchableOpacity onPress={() => { this.setState({ eyse3: !eyse3 }) }} style={{ position: 'absolute', right: 15 }}>
                                    <Image resizeMode='contain' source={!eyse3 ? require('../../images/login/close_eye.png') : require('../../images/login/eyse.png')} style={{ width: 22, height: 16 }} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{ color: 'red', lineHeight: 20 }}>{passwordST3 != '' && passwordST3}</Text>
                        </View>

                        <View>
                            <Touch onPress={() => { this.changeBtn() }} style={{ backgroundColor: changeBtn ? '#00A6FF' : '#efeff4', borderRadius: 10, marginTop: 15 }}>
                                <Text style={{ color: '#fff', lineHeight: 45, textAlign: 'center' }}>更新</Text>
                            </Touch>
                        </View>

                    </View>

                </ScrollView>
                {/*客服懸浮球*/}
                {/* <LivechatDragHoliday /> */}
                {/*客服懸浮球*/}
            </View>

        );
    }
}






export default SetPassword;




const styles = StyleSheet.create({
    topNav: {
        width: width,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    inputRow: {
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
    },
    secussModal: {
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
});

