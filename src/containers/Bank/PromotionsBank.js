import React, { Component } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle, Image, Dimensions, ScrollView, TouchableOpacity, WebView, Platform } from 'react-native';
import { Button, WhiteSpace, WingBlank, InputItem, Toast, Flex, Switch, List, Radio } from 'antd-mobile-rn';
import ModalDropdown from 'react-native-modal-dropdown';
import Carousel, { Pagination } from "react-native-snap-carousel";
import WebViewIOS from "react-native-webview";
import Touch from 'react-native-touch-once';
import HTMLView from 'react-native-htmlview';
import { Actions } from 'react-native-router-flux';



const {
    width,
    height
} = Dimensions.get('window')


class PromotionsBank extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            bonusId: '',
            money: 0,
            froms: this.props.froms,
        }
    }
    componentWillMount() {
        if(this.props.froms == 'DepositCenter') {
            let datas = this.props.data
            let money = ''
            if(datas.uniqueAmount != 0) {
                money = datas.uniqueAmount
            } else if(datas.moneys != 0) {
                money = datas.moneys
            }
            this.setState({money})

        }
    }
    componentWillUnmount(props) {

    }

    goHistory() {
        window.PromotionsMyType && window.PromotionsMyType()
        Actions.pop()
    }

    render() {
        const {
            money,
            froms,
        } = this.state;
        const { BonusData } = this.props
        return (
            froms == 'DepositCenter' ?
                <View style={styles.views} >
                    <View style={styles.concent}>
                        <Image resizeMode='contain'
                            source={require("../../images/icon-done.png")}
                            style={{ width: 55, height: 55 }}
                        />
                        <Text style={{ color: '#000', lineHeight: 40 }}>交易进行中</Text>
                        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: width - 40, padding: 3 }}>
                            <Text style={{ color: '#999999', fontSize: 12, lineHeight: 35 }}>存款金额</Text>
                            <Text>￥{money}</Text>
                        </View>
                        <View style={styles.BonusData} >
                            <Text style={{ textAlign: 'center', color: '#3C3C3C', width: width - 60, lineHeight: 22, paddingBottom: 15, }}>{BonusData.title}</Text>
                            <View style={styles.stateList}>
                                <Text style={styles.statesTitle}>申请金额</Text>
                                <Text style={styles.statesTitle}>可得红利</Text>
                                <Text style={styles.statesTitle}>所需流水</Text>
                            </View>
                            <View style={styles.stateList}>
                                <Text style={styles.statesTitle}>¥{money}</Text>
                                <Text style={styles.statesTitle}>¥{Number(money) * BonusData.givingRate > BonusData.maxGiving ? BonusData.maxGiving: Number(money) * BonusData.givingRate}</Text>
                                <Text style={styles.statesTitle}>{(Number(money) + Number(money) * BonusData.givingRate) * BonusData.releaseValue}</Text>
                            </View>
                        </View>
                    </View>
                    <Touch  onPress={() => { this.goHistory()}} style={{ backgroundColor: '#00A6FF', borderRadius: 10, marginTop: 15, marginBottom: 15, }}>
                        <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>查看交易记录</Text>
                    </Touch>
                    <Touch  onPress={() => { this.goHistory()}} style={{ borderColor: '#00A6FF', borderRadius: 10, borderWidth: 1, }}>
                        <Text style={{ color: '#00A6FF', textAlign: 'center', lineHeight: 43 }}>查看优惠状态</Text>
                    </Touch>
                </View>
                :
                <View style={styles.views} >
                    <View style={styles.concent}>
                        <Image resizeMode='contain'
                            source={require("../../images/icon-done.png")}
                            style={{ width: 55, height: 55 }}
                        />
                        <Text style={{ color: '#000', lineHeight: 30, fontSize:16 }}>转账成功</Text>
                        <Text style={{ color: '#666', lineHeight: 30, fontSize: 20 }}>优惠已申请</Text>
                    </View>
                    <Touch onPress={() => { this.goHistory()}} style={{ backgroundColor: '#00A6FF', borderRadius: 10, marginTop: 15, marginBottom: 15, }}>
                        <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>查看优惠状态</Text>
                    </Touch>
                </View>
        );
    }
}

export default PromotionsBank;


const styles = StyleSheet.create({
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
    views: {
        flex: 1,
        backgroundColor: '#EFEFF4',
        padding: 10,
    },
    concent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        paddingTop: 30,
    },
    BonusData: {
        width: width - 40,
        borderWidth: 1,
        borderColor: '#E3E3E8',
        padding: 10,
        borderRadius: 10,
    },
});




