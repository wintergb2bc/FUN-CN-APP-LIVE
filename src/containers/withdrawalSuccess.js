import React from 'react';
import { Text, View, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, StyleSheet, TextInput, Clipboard, Platform, BackHandler, Modal } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Button, Carousel, WhiteSpace, WingBlank, Flex, Toast, InputItem, Picker, List } from 'antd-mobile-rn';
import InputItemStyle from 'antd-mobile-rn/lib/input-item/style/index';
import Touch from 'react-native-touch-once';
import AnalyticsUtil from './../actions/AnalyticsUtil'; //友盟  
import QRCodeS from 'react-native-qrcode';
import LivechatDragHoliday from './LivechatDragHoliday'
import QRCodeA from 'react-native-qrcode-svg';
import { LBPrompt } from './Common/Deposit/depositPrompt'
import ViewShot from "react-native-view-shot";
import PiwikAction from "../lib/utils/piwik";

const {
    width, height
} = Dimensions.get('window')

class DepositCenterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeDeposit: this.props.activeCode,
            otherAccount: false,
            otherBank: '',
            otherBankST: '',
            Bottoms: false,
            payCallback: this.props.payCallback,
            PayAready: false,
            countdownTime: '',
            Countdown: '00:00',
            INVOICE_TimeOut: false,
            prompt: false,
            INVOICE_AutNext: '',
            INVOICE_AutCodeErr: false,
            INVOICE_AutModal: false,
            INVOICE_AutCode: '',
            ALBPay: false,
            LBMethodCode: this.props.LBMethodCode,
            copyCenter: '',
        }
    }

    //复制
    copy(txt, copyCenter) {
        try {
            const value = String(txt)
            Clipboard.setString(value);
            Toast.info("已复制", 2);
            this.setState({ copyCenter })
        } catch (error) {
            console.log(error);

        }

    }

    render() {
        const {
            activeDeposit,
            payCallback,
            LBMethodCode,
            copyCenter,
        } = this.state;
        return <View style={{ flex: 1, backgroundColor: '#EFEFF4', padding: 10 }}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
                {
                    <View>
                        <View style={styles.PayAready}>
                            <Image
                              resizeMode="stretch"
                              source={require("./../images/icon-done.png")}
                              style={{ width: 48, height: 48 }}
                            />
                            <Text style={{ fontSize: 17, color: '#000', textAlign: 'center', lineHeight: 42, paddingBottom: 15 }}>已成功提交</Text>
                            <View style={styles.detials}>
                                <Text style={{ fontSize: 12, color: '#999999' }}>提款金额</Text>
                                <Text style={{ color: '#000', fontSize: 20 }}>￥{this.props.amount}</Text>
                            </View>
                            <View style={styles.detials}>
                                <Text style={{ fontSize: 12, color: '#999999' }}>交易单号</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 12, color: '#222222', marginRight: 10 }}>{payCallback.transactionId}</Text>
                                    <Touch onPress={() => { this.copy(payCallback.transactionId, 'transactionId') }}>
                                        <Image
                                          resizeMode="stretch"
                                          source={require("../images/icon/copy.png")}
                                          style={{ width: 16, height: 16 }}
                                        />
                                    </Touch>
                                    {
                                      copyCenter == 'transactionId' &&
                                      <Image
                                        resizeMode="stretch"
                                        source={require("../images/check.png")}
                                        style={styles.checkIcon}
                                      />
                                    }
                                </View>
                            </View>
                            <View style={styles.steps}>
                                <View style={styles.stepsLeft}>
                                    <View style={styles.steps1}><Text style={{ color: '#fff', fontSize: 11 }}>✓</Text></View>
                                    <View style={styles.stepsView} />
                                    <View style={styles.steps2}><Text style={{ color: '#bcbec3' }}></Text></View>
                                </View>
                                <View style={[styles.stepsLeft, { alignItems: 'flex-start'}]}>
                                    <Text style={[styles.stepeTxt, { color: '#00a6ff'}]}>提交成功</Text>
                                    <Text style={[styles.stepeTxt, { lineHeight: 25, color: '#666666', fontSize: 11, paddingBottom: 14 }]}>处理中</Text>
                                    <Text style={[styles.stepeTxt, { width: width -80}]}>{
                                        this.props.amount < 3000 || this.props.amount >= 10000 ? '您的提现将于3小时内完成， 请您耐心等待！' : '预计60:00分钟内到账​'
                                    }</Text>
                                </View>
                            </View>
                            {
                              activeDeposit == 'LB' && payCallback.payoutMode != 'Normal' && <View style={{ backgroundColor: '#FFF5BF', borderRadius: 8, padding: 10, marginTop: 15, }}>

                                  {/* LBMethodCode == 'FastProcessing' && */}


                                  {
                                      payCallback.rebateAmount > 0
                                        ?
                                        <View style={{ marginBottom: 15 }}>
                                            <Text style={{ color: '#83630B', fontWeight: 'bold', fontSize: 12, lineHeight: 20 }}>恭喜您！您在此笔提现交易中将获得额外红利，若您收到该笔交易金额后，可在交易记录页面中查看额外红利并点击“确认到账”领取额外红利。</Text>
                                        </View>
                                        :
                                        <View style={{ marginBottom: 15 }}>
                                            <Text style={{ color: '#83630B', fontWeight: 'bold', fontSize: 12, lineHeight: 20 }}>若银行账户已收到该款项，请前往交易记录页面点击”确认到账“。</Text>
                                        </View>
                                  }



                                  <View >
                                      <Text style={{ color: '#83630B', fontSize: 11, lineHeight: 20 }}>1. 请注意，乐天堂不会在金额还没到账前通知会员点击 “确认到账”。<Text style={{ color: 'red' }}>请留意您的资金安全</Text>。</Text>
                                  </View>

                                  <View >
                                      <Text style={{ color: '#83630B', fontSize: 11, lineHeight: 20 }}>2. 若您在尚未检查的情况下点击 “确认到账”，所产生的 损失乐天堂<Text style={{ color: 'red' }}>概不负责赔偿</Text>。</Text>
                                  </View>
                                  <View >
                                      <Text style={{ color: '#83630B', fontSize: 11, lineHeight: 20 }}>3. 请确认您的金额是否已到账。</Text>
                                  </View>
                              </View>
                            }
                        </View>
                        {
                          activeDeposit == 'CTC' && <Text style={{ color: "#999999", textAlign: 'center', marginTop: 25 }}>请注意, 交易将以实时汇率进行。</Text>
                        }

                        <View style={{ marginTop: 20 }}>
                            <Touch onPress={() => {
                                PiwikAction.SendPiwik("withdrawToRecord");
                                Actions.recordes({
                                    recordIndex: 2,
                                });
                            }} style={{ borderRadius: 8, backgroundColor: '#00a6ff', width: width - 20 }}>
                                <Text style={{ color: '#fff', fontSize: 16, lineHeight: 48, textAlign: 'center', fontWeight: 'bold' }}>查看交易记录</Text>
                            </Touch>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Touch
                              onPress={() => {
                                  Actions.pop()
                                  Actions.home1()
                              }}
                              style={{
                                  borderRadius: 8,
                                  borderColor: "#00a6ff",
                                  borderWidth: 1,
                                  width: width - 30,
                              }}
                            >
                                <Text
                                  style={{
                                      color: "#00a6ff",
                                      fontSize: 16,
                                      lineHeight: 48,
                                      textAlign: "center",
                                  }}
                                >
                                    回到首页
                                </Text>
                            </Touch>
                        </View>
                    </View>
                }
            </ScrollView>
        </View>
    }

}

export default (DepositCenterPage);


const styles = StyleSheet.create({
    checkIcon: {
        width: 16,
        height: 16,
        position: 'absolute',
        right: -21,
    },
    AutModalCloseTxt: {
        lineHeight: 40,
        color: '#00a6ff',
        textAlign: 'center',
    },
    AutModalClose: {
        borderWidth: 1,
        borderColor: '#00a6ff',
        borderRadius: 8,
        width: (width - 40) * 0.4,
        marginRight: 30,
    },
    AutModalok: {
        backgroundColor: '#00a6ff',
        borderRadius: 8,
        width: (width - 40) * 0.4,
    },
    AutModalokTxt: {
        lineHeight: 40,
        color: '#fff',
        textAlign: 'center',
    },
    closeBtn: {
        borderWidth: 1,
        borderColor: '#00a6ff',
        borderRadius: 10,
        width: width * 0.39,
    },
    payBtn: {
        backgroundColor: '#00a6ff',
        borderRadius: 10,
        width: width * 0.39,
    },
    nopayBtn: {
        backgroundColor: '#efeff4',
        borderRadius: 10,
        width: width * 0.39,
    },
    CTCtxt: { paddingLeft: 10, lineHeight: 20, color: '#00a6ff', fontSize: 12 },
    noPage: {
        backgroundColor: '#eb2121',
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    detials: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
        width: width - 60,
        paddingTop: 0,
    },
    stepeTxt: {
        color: '#BCBEC3',
        fontSize: 12,
        width: 120,
        textAlign: 'left'
    },
    stepsLeft: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 10,
    },
    stepsView: {
        width: 1,
        height: 35,
        backgroundColor: '#bcbec3',
        marginBottom: 2,
        marginTop: 2,
    },
    steps2: {
        display: 'flex',
        height: 13,
        width: 13,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#bcbec3',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    steps1: {
        display: 'flex',
        height: 14,
        width: 14,
        borderRadius: 50,
        backgroundColor: '#108ee9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    steps: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        width: width - 60,
    },
    PayAready: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        paddingTop: 35,
        width: width - 20,
    },
    depModal: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    LBdetials: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
    },
    LBdetials1: {
        borderBottomColor: '#F3F3F3',
        borderBottomWidth: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
    },
    inputView: {
        backgroundColor: '#fff',
        borderRadius: 5,
        height: 38,
        display: "flex",
        alignItems: "center",
        marginTop: 5,
        borderWidth: 1,
        marginLeft: 15,
        width: width - 60,
        borderColor: '#E0E0E0',
    },
    secussModal: {
        // width: width / 1.2,
        // height: height / 3,
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: width - 40,
        padding: 15,
        borderRadius: 10,
    },
    copyTxt: {
        fontSize: 12,
        color: '#1C8EFF',
        paddingLeft: 10,
    },
    CTCtOP: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    CTClist: {
        padding: 15,
        borderBottomColor: '#F3F3F3',
        borderBottomWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    popView: {
        position: 'absolute',
        top: -15,
        zIndex: 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 30
    },
    arrow: {
        marginLeft: width * 0.72,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: "solid",
        borderWidth: 7,
        borderTopColor: "rgba(0, 0, 0,0)", //下箭头颜色
        borderLeftColor: "rgba(0, 0, 0,0)", //右箭头颜色
        borderBottomColor: "rgba(0, 0, 0,0.8)", //上箭头颜色
        borderRightColor: "rgba(0, 0, 0,0)" //左箭头颜色
    },
    odleNum: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: width - 30,
        height: 40,
        paddingLeft: 15,
    },
})

