import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, Modal, ActivityIndicator, Platform, WebView } from 'react-native'
import {
    Toast, Flex,
} from 'antd-mobile-rn'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import ViewShot from 'react-native-view-shot'
// import { toThousands } from '../../../actions/Reg'

import WebViewIOS from "react-native-webview";
const { width, height } = Dimensions.get("window");
import WebViewAndroid from 'react-native-webview-android'

class RedoDepositTransaction extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            ResubmitDepositDetails: '',
            recordItem: this.props.recordsDatails,
            isShowModal: false,
            loadD: true,
            loadone: 1,
            payHtml: this.props.data ? this.props.data.redirectUrl : "",
            activeName: this.props.activeName,
            visible: false
        }
    }

    componentDidMount() {
        console.log(this.props)
        this.getResubmitOnlineDepositDetails()
    }

    getResubmitOnlineDepositDetails(item) {
        Toast.loading('加载中,请稍候...', 2000)
        fetchRequest(window.ApiPort.GetResubmitOnlineDepositDetails + 'resubmitDepositID=' + this.state.recordItem.transactionId + '&', 'GET').then(data => {
            Toast.hide()
            let res = data.result;
            if(res.resubmitAmount) {
                this.setState({
                    ResubmitDepositDetails: res,
                })
            } else {
                Toasts.fail('提交失败,请 重试')
                Actions.pop()
            }
        }).catch(err => {
            Toast.hide()
        })
    }


    CreateResubmitOnlineDeposit(res) {
        Toast.loading('加载中,请稍候...', 2000)
        fetchRequest(window.ApiPort.CreateResubmitOnlineDeposit + `resubmitDepositID=${this.state.recordItem.transactionId}&returnUrl=` + SBTDomain + '&', 'POST').then(data => {
            Toast.hide()
            let res = data.result;
            if (res.resubmitStatus) {
                Toasts.success('提交成功')
                this.setState({
                    payHtml: res.resubmitRedirectUrl,
                    isShowModal: true
                })
                this.props.getDepositWithdrawalsRecords()
            } else {
                Toasts.fail('提交失败')
            }
        }).catch(err => {
            Toast.hide()
        })
    }


    render() {
        const { ResubmitDepositDetails, isShowModal, recordItem } = this.state
        const js = `$('#btnClose').remove()`;
        const { payHtml, loadD, loadone, activeName } = this.state;
        let testUrl = payHtml.split(":");
        let urlHtml = false;
        if (testUrl[0] != "https" && testUrl[0] != "http") {
            urlHtml = false;
        } else {
            urlHtml = true;
        }
        let PaymentMethodId = recordItem.paymentMethodId
        console.log(payHtml)
        return <View style={[styles.viewContainer, { backgroundColor: true ? '#EFEFF4' : '#000' }]}>
            <Modal transparent={false} visible={isShowModal} animationType='slide'>
                <View style={styles.viewModal}>
                    <View style={[styles.viewModalHead,{paddingTop: DeviceInfoIos? 65: 20}]}>
                        <TouchableOpacity hitSlop={{ left: 15, right: 15, top: 15, bottom: 15 }} onPress={() => {
                            this.setState({
                                isShowModal: false
                            })
                        }}>
                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>X</Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>重新提交存款</Text>
                        <TouchableOpacity onPress={() => {

                            LiveChatOpenGlobe()
                        }} style={{}}>
                            <Image
                                source={require("../images/cs.png")}
                                style={{ width: 30, height: 30 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>

                        <View style={{ flex: 1 }}>
                            {Platform.OS == "ios" ?

                                <WebViewIOS
                                    onLoadStart={e => this.setState({ loadD: true })}
                                    onLoadEnd={e => this.setState({ loadD: false, loadone: 2 })}
                                    source={urlHtml == false ? { html: payHtml } : { uri: payHtml }}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    scalesPageToFit={Platform.OS === "ios" ? false : true}
                                    style={{
                                        width: width,
                                        height: height - Platform.OS === "ios" ? 175 : 115
                                    }}
                                />

                                : Platform.OS == "android" &&
                                (
                                    PaymentMethodId == 'CTC' ?
                                        <WebViewAndroid
                                            onLoadStart={e => this.setState({ loadD: true })}
                                            onLoadEnd={e => this.setState({ loadD: false, loadone: 2 })}
                                            source={urlHtml == false ? { html: payHtml } : { uri: payHtml }}
                                            javaScriptEnabled={true}
                                            domStorageEnabled={true}
                                            scalesPageToFit={Platform.OS === "ios" ? false : true}
                                            style={{
                                                width: width,
                                                height: height - 115,
                                            }}
                                        />
                                        :
                                        <WebView
                                            onLoadStart={e => this.setState({ loadD: true })}
                                            onLoadEnd={e => this.setState({ loadD: false, loadone: 2 })}
                                            source={urlHtml == false ? { html: payHtml } : { uri: payHtml }}
                                            javaScriptEnabled={true}
                                            domStorageEnabled={true}
                                            scalesPageToFit={Platform.OS === "ios" ? false : true}
                                            style={{
                                                width: width,
                                                height: height - Platform.OS === "ios" ? 175 : 115
                                            }}
                                        />
                                )

                            }
                        </View>
                    </View >
                    {loadone == 1 && loadD == true && (
                        <Flex
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 9999,
                                height: height,
                                width: width,
                                backgroundColor: "#202020"
                            }}
                        >
                            <Flex.Item>
                                <ActivityIndicator size="large" color="#fff" />
                            </Flex.Item>
                        </Flex>
                    )}
                </View>
            </Modal>


            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {
                    ResubmitDepositDetails != '' &&
                    <View style={{ backgroundColor: true ? '#fff' : '#2E2E2E', borderRadius: 6, padding: 10, }}>
                        <View style={{ marginVertical: 12, flexDirection: 'row' }}>
                            <Text style={{ width: (width - 20) * .3, color: true ? '#999' : '#FFFFFF' }}>存款方式</Text>
                            <Text style={{ color: true ? '#000' : '#00AEEF' }}>{ResubmitDepositDetails.paymentGatewayName}</Text>
                        </View>
                        {
                            ResubmitDepositDetails.methodTypeName && <View style={{ marginVertical: 12, flexDirection: 'row' }}>
                                <Text style={{ width: (width - 20) * .3, color: true ? '#999' : '#FFFFFF' }}>支付渠道</Text>
                                <Text style={{ color: true ? '#000' : '#00AEEF' }}>{ResubmitDepositDetails.methodTypeName}</Text>
                            </View>
                        }

                        <View style={{ marginVertical: 12, flexDirection: 'row' }}>
                            <Text style={{ width: (width - 20) * .3, color: true ? '#999' : '#FFFFFF' }}>存款金额</Text>
                            <Text style={{ color: true ? '#000' : '#00AEEF' }}><Text>￥</Text>{ResubmitDepositDetails.resubmitAmount}</Text>
                        </View>
                    </View>
                }

                <View style={{ backgroundColor: '#FFF5BF', marginTop: 20, padding: 10, borderRadius: 6 }}>
                    <Text style={{ color: '#83630B', }}>您无需转账,请点击提交，在交易记录出现前，请不要关闭此页。任何的中断将会导致提交失败。</Text>
                </View>

                <TouchableOpacity
                    onPress={this.CreateResubmitOnlineDeposit.bind(this)}
                    style={{ backgroundColor: '#00A6FF', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 4, marginTop: 30 }}>
                    <Text style={{ color: '#fff' }}>提交</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10
    },
    viewModal: {
        width,
        height,
        flex: 1
    },
    viewModalHead: {
        backgroundColor: '#00A6FF',
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 15
    }
})

export default (RedoDepositTransaction)
