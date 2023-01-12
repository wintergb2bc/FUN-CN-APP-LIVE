import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, Platform } from 'react-native';
import { Radio } from 'antd-mobile-rn';
import Carousel, { Pagination } from "react-native-snap-carousel";
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';


const {
    width,
    height
} = Dimensions.get('window');

const carouselD1 = [
    {
        imgs: require('../../images/bank/CTCTutorial/CHANNEL/Step-1-min.png'),
        txt1: '步骤一',
        txt2: '如何进行极速虚拟币支付',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/CHANNEL/Step-2-min.png'),
        txt1: '步骤二',
        txt2: '重要提示',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/CHANNEL/Step-3-min.png'),
        txt1: '步骤三',
        txt2: '如何进行充值',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/CHANNEL/Step-4-min.png'),
        txt1: '步骤四',
        txt2: '如何添加钱包地址',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/CHANNEL/Step-5-min.png'),
        txt1: '步骤五',
        txt2: '成功添加钱包地址',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/CHANNEL/Step-6-min.png'),
        txt1: '步骤六',
        txt2: '查看交易记录',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/CHANNEL/Step-7-min.png'),
        txt1: '步骤七',
        txt2: '查看交易记录',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/CHANNEL/Step-8-min.png'),
        txt1: '步骤七',
        txt2: '查看交易记录',
    },

]
const carouselD2 = [
    {
        imgs: require('../../images/bank/CTCTutorial/INVOICE/Step-1-min.png'),
        txt1: '步骤一',
        txt2: '如何进行极速虚拟币支付',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/INVOICE/Step-2-min.png'),
        txt1: '步骤二',
        txt2: '重要提示',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/INVOICE/Step-3-min.png'),
        txt1: '步骤三',
        txt2: '如何进行充值',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/INVOICE/Step-4-min.png'),
        txt1: '步骤四',
        txt2: '如何添加钱包地址',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/INVOICE/Step-5-min.png'),
        txt1: '步骤五',
        txt2: '成功添加钱包地址',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/INVOICE/Step-6-min.png'),
        txt1: '步骤五',
        txt2: '成功添加钱包地址',
    },
]

const carouselD3 = [
    {
        imgs: require('../../images/bank/CTCTutorial/OTC/Step-1-min.png'),
        txt1: '步骤一',
        txt2: '如何进行极速虚拟币支付',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/OTC/Step-2-min.png'),
        txt1: '步骤二',
        txt2: '重要提示',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/OTC/Step-3-min.png'),
        txt1: '步骤三',
        txt2: '如何进行充值',
    },
]

const carouselD4 = [
    {
        imgs: require('../../images/bank/CTCTutorial/INVOICE_AUT/1-min.png'),
        txt1: '步骤一',
        txt2: '如何进行极速虚拟币支付',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/INVOICE_AUT/2-min.png'),
        txt1: '步骤一',
        txt2: '如何进行极速虚拟币支付',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/INVOICE_AUT/3-min.png'),
        txt1: '步骤一',
        txt2: '如何进行极速虚拟币支付',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/INVOICE_AUT/4-min.png'),
        txt1: '步骤一',
        txt2: '如何进行极速虚拟币支付',
    },
    {
        imgs: require('../../images/bank/CTCTutorial/INVOICE_AUT/5-min.png'),
        txt1: '步骤一',
        txt2: '如何进行极速虚拟币支付',
    },
]


// const carouselw1 = [
//     {
//         imgs: require('../../images/tutorial/cd1.png'),
//         txt1: '步骤一',
//         txt2: '如何提现泰达币',
//     },
//     {
//         imgs: require('../../images/tutorial/cd2.png'),
//         txt1: '步骤二',
//         txt2: '如何添加钱包地址',
//     },
//     {
//         imgs: require('../../images/tutorial/cd3.png'),
//         txt1: '步骤三',
//         txt2: '成功添加钱包地址后点击立即提款即可完成提交',
//     },
//     {
//         imgs: require('../../images/tutorial/cd4.png'),
//         txt1: '步骤四',
//         txt2: '提交成功',
//     },
//     {
//         imgs: require('../../images/tutorial/cd5.png'),
//         txt1: '步骤五',
//         txt2: '查看交易记录',
//     },
//     {
//         imgs: require('../../images/tutorial/t7.png'),
//         txt1: '',
//         txt2: '',
//     },
// ]

// const carouselw2 = [
//     {
//         imgs: require('../../images/tutorial/cb1.png'),
//         txt1: '步骤一',
//         txt2: '如何添加钱包地址',
//     },
//     {
//         imgs: require('../../images/tutorial/cb2.png'),
//         txt1: '步骤二',
//         txt2: '添加钱包地址',
//     },
//     {
//         imgs: require('../../images/tutorial/cb3.png'),
//         txt1: '步骤三',
//         txt2: '如何在第三方获取您的钱包地址',
//     },
//     {
//         imgs: require('../../images/tutorial/cb4.png'),
//         txt1: '步骤四',
//         txt2: '复制地址后返回同乐城提现账户页面',
//     },
//     {
//         imgs: require('../../images/tutorial/cb5.png'),
//         txt1: '步骤五',
//         txt2: '输入完成点击添加即可',
//     },
//     {
//         imgs: require('../../images/tutorial/t7.png'),
//         txt1: '',
//         txt2: '',
//     },
// ]

class CTCpage extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            transactionId: this.props.transactionId || '',
            Records: false,
            actionType: this.props.actionType || '',
            activeCarousel: 0,
            activeCarouse2: 0,
            tutorials: 0,
            carouselD: carouselD1,
            carouselKey: 0,
            Countdown: '10:00',
        }

    }
    componentWillMount() {
        if (this.props.actionType) {
            this.props.navigation.setParams({
                title: this.props.actionType == 'Deposit' ? '泰达币存款教程' : '提现教学'
            });
        } else {
            this.props.navigation.setParams({
                title: this.props.activeName || '虚拟币'
            });
            this.Countdown()
        }
    }
    componentWillUnmount(props) {
        this.Countdowns && clearInterval(this.Countdowns);
        this.state.Records && Actions.Records()
    }

    Countdown() {
        let time = 10 * 60;//10分钟
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
                clearInterval(this.Countdowns);
                Actions.pop()
            }
        }, 1000);
    }

    renderPageDeposit = (items, index) => {
        const item = items.item
        return (
            <View style={{flex: 1, justifyContent: "center" , alignItems: "center"}}>
                {
                    item.imgs &&
                  <Image
                    resizeMode='contain'
                    source={item.imgs}
                    style={{ width: width - 20, height:Platform.OS == "ios"? height - 250 : height- 220, alignSelf: "center", justifyContent: "center" , alignItems: "center"}}
                  />
                }
                {
                    // !item.imgs &&
                    // <View style={{width: width - 90}}>
                    //     <Text style={{color: 'red', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>温馨提示</Text>
                    //     <Text style={{color: '#220000', fontSize: 14, paddingTop: 25, fontWeight: 'bold'}}>{item.txt1}</Text>
                    //     <Text style={{color: '#220000', fontSize: 14, paddingTop: 25, fontWeight: 'bold'}}>{item.txt2}</Text>
                    //     {/* <Text style={{color: '#220000', fontSize: 14, paddingTop: 25, fontWeight: 'bold'}}>{item.title1}</Text>
                    //     <Text style={{color: '#220000', fontSize: 14, fontWeight: 'bold'}}>{item.txt3}</Text> */}
                    //     <Text style={{color: '#220000', fontSize: 14, paddingTop: 25, fontWeight: 'bold'}}>{item.title2}</Text>
                    //     <Text style={{color: '#220000', fontSize: 14, fontWeight: 'bold'}}>{item.txt4}</Text>
                    // </View>
                }
            </View>
        )
    }
    carouselD(key, carouselD) {
        this.setState({ tutorials: key, carouselD: carouselD, carouselKey: key, activeCarousel: 0 })
    }
    render() {
        const {
            transactionId,
            actionType,
            activeCarousel,
            activeCarouse2,
            tutorials,
            carouselD,
            carouselKey,
            Countdown,
        } = this.state;

        return (

            <View style={{ flex: 1, backgroundColor: '#EFEFF4', }} >
                {
                    actionType == '' &&
                    <View style={{ padding: 15 }}>
                        <View style={{ flex: 1, backgroundColor: '#EFEFF4' }} >
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#fff', padding: 30 }}>
                                <Image resizeMode='contain'
                                    source={require("../../images/icon-done.png")}
                                    style={{ width: 55, height: 55 }}
                                />
                                <Text style={{ color: '#222222', paddingTop: 15 }}>提交成功</Text>
                                <Text style={{ color: '#42D200', paddingTop: 10 }}>{transactionId != '' && transactionId}</Text>
                                <Text style={{ color: '#222222', paddingTop: 15, paddingBottom: 15 }}>您的存款将于{Countdown}内到账，感谢您的耐心等待。</Text>
                            </View>
                            <View style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                <Touch onPress={() => { Actions.pop() }} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#F92D2D', width: (width - 50) * 0.5 }}>
                                    <Text style={{ color: '#F92D2D', fontSize: 14, lineHeight: 40, textAlign: 'center' }}>返回充值首页</Text>
                                </Touch>
                                <Touch onPress={() => { this.setState({ Records: true }, () => { Actions.pop() }) }} style={{ borderRadius: 8, backgroundColor: '#F92D2D', width: (width - 50) * 0.5 }}>
                                    <Text style={{ color: '#fff', fontSize: 14, lineHeight: 42, textAlign: 'center' }}>查看交易记录</Text>
                                </Touch>
                            </View>
                        </View>
                    </View>
                }
                {
                    actionType == 'Deposit' &&
                    <>
                        <View style={styles.carouselView}>
                            <Touch onPress={() => { this.carouselD(0, carouselD1) }} style={styles.btnList}>
                                <Text style={[styles.tutorialTxt, { color: tutorials == 0 ? '#fff' : '#B4E4FE' }]}>极速虚拟币{"\n"}支付</Text>
                                <View style={[styles.belowsView,{ backgroundColor: tutorials == 0 ? '#fff' : '#00a6ff' }]} />
                            </Touch>
                            <Touch onPress={() => { this.carouselD(2, carouselD3) }} style={styles.btnList}>
                                <Text style={[styles.tutorialTxt, { color: tutorials == 2 ? '#fff' : '#B4E4FE' }]}>虚拟币交易所{"\n"}(OTC)</Text>
                                <View style={[styles.belowsView,{ backgroundColor: tutorials == 2 ? '#fff' : '#00a6ff' }]} />
                            </Touch>
                            <Touch onPress={() => { this.carouselD(1, carouselD2) }} style={styles.btnList}>
                                <Text style={[styles.tutorialTxt, { color: tutorials == 1 ? '#fff' : '#B4E4FE' }]}>虚拟币{"\n"}支付1</Text>
                                <View style={[styles.belowsView,{ backgroundColor: tutorials == 1 ? '#fff' : '#00a6ff' }]} />
                            </Touch>
                            <Touch onPress={() => { this.carouselD(3, carouselD4) }} style={styles.btnList}>
                                <Text style={[styles.tutorialTxt, { color: tutorials == 3 ? '#fff' : '#B4E4FE' }]}>虚拟币{"\n"}支付2</Text>
                                <View style={[styles.belowsView,{ backgroundColor: tutorials == 3 ? '#fff' : '#00a6ff' }]} />
                            </Touch>
                        </View>
                        <View style={{ marginTop: 16}}>
                            <ScrollView style={{ borderRadius: 10 }}>
                                <Carousel
                                  key={carouselKey}
                                  ref={c => { }}
                                  data={carouselD}
                                  renderItem={this.renderPageDeposit}
                                  sliderWidth={width}
                                  itemWidth={width}
                                  onSnapToItem={index => this.setState({ activeCarousel: index })}
                                />
                                <Pagination
                                  dotsLength={carouselD.length}
                                  activeDotIndex={activeCarousel}
                                  containerStyle={{
                                      paddingVertical: 25,
                                      // position: "absolute",
                                      // bottom: 0
                                  }}
                                  dotStyle={{
                                      backgroundColor: "#00A6FF",
                                      width: 10,
                                      height: 10,
                                      marginHorizontal: -5,
                                      borderRadius: 1000,
                                  }}
                                  inactiveDotStyle={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: 1000,
                                      backgroundColor: "#CDCDD0"
                                  }}
                                  inactiveDotOpacity={1}
                                  inactiveDotScale={1}
                                />
                            </ScrollView>
                        </View>
                    </>
                }
                {
                    // actionType == 'withdrawals' &&
                    // <ScrollView style={{borderRadius: 10}}>
                    //     <View style={{backgroundColor: '#fff', borderRadius: 10, padding: 20}}>
                    //         <View style={styles.carouselView}>
                    //             <Touch onPress={() => { this.carouselD(0, carouselw1) }} style={{width: width * 0.38}}>
                    //                 <Text style={[styles.tutorialTxt, {color: tutorials == 0 ? '#222': '#999'}]}>如何提现泰达币?</Text>
                    //                 <View style={{height: 2, backgroundColor: tutorials == 0 ? '#F92D2D': '#fff'}} />
                    //             </Touch>
                    //             <Touch onPress={() => { this.carouselD(1, carouselw2) }} style={{width: width * 0.38}}>
                    //                 <Text style={[styles.tutorialTxt, {color: tutorials == 1 ? '#222': '#999'}]}>如何添加钱包地址?</Text>
                    //                 <View style={{height: 2, backgroundColor: tutorials == 1 ? '#F92D2D': '#fff'}} />
                    //             </Touch>
                    //         </View>
                    //         <View style={{paddingTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                    //             <Carousel
                    //                 key={carouselKey}
                    //                 ref={c => {}}
                    //                 data={carouselD}
                    //                 renderItem={this.renderPageDeposit}
                    //                 sliderWidth={width}
                    //                 itemWidth={width}
                    //                 onSnapToItem={index => this.setState({ activeCarousel: index })}
                    //             />
                    //             <Pagination
                    //                 dotsLength={carouselD.length}
                    //                 activeDotIndex={activeCarousel}
                    //                 containerStyle={{
                    //                     paddingVertical: 2,
                    //                     position: "absolute",
                    //                     bottom: 65
                    //                 }}
                    //                 dotStyle={{
                    //                     backgroundColor: "#000000BF",
                    //                     position:'relative',
                    //                     top:5,
                    //                 }}
                    //                 inactiveDotStyle={{
                    //                     width: 10,
                    //                     backgroundColor: "#00000040"
                    //                 }}
                    //                 inactiveDotOpacity={1}
                    //                 inactiveDotScale={0.6}
                    //                 />
                    //         </View>
                    //     </View>
                    // </ScrollView>
                }
            </View>
        );
    }
}

export default CTCpage;


const styles = StyleSheet.create({
    carouselView: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#00a6ff'
    },
    tutorialTxt: {
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center',
        paddingTop: 13
    },
    belowsView: {
        position: 'absolute',
        bottom: 0,
        zIndex: 99,
        height: 3,
        width: width * 0.25
    },
    btnList: { 
        width: width * 0.25,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
    },
});




