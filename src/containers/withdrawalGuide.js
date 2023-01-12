import React from 'react'
import { StyleSheet, ScrollView, Text, View, Modal, TouchableOpacity, Dimensions, Clipboard, Image, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { Toast, Tabs } from 'antd-mobile-rn'
import ModalDropdown from 'react-native-modal-dropdown'
import moment from 'moment'
import Orientation from 'react-native-orientation-locker'
import Carousel, { Pagination } from 'react-native-snap-carousel'
const { width, height } = Dimensions.get('window')

const GuideImg = {
    LB: [
        require('./../images/guideImg1.jpg'),
        require('./../images/guideImg2.jpg')
    ],
    CCW: [
        [
            require('./../images/guideImg6.jpg'),
            require('./../images/guideImg5.jpg')
        ],
        [
            require('./../images/guideImg3.jpg'),
            require('./../images/guideImg4.jpg')
        ]
    ]
}

class RecordsContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            coinTypesArr: [
                {
                    title: '如何提款泰达币?'
                },
                {
                    title: '如何添加钱包地址？'
                }
            ],
            bankarrIndex: 0,
            bannerIndex: 0,
            paymentWithdrawalType: this.props.paymentWithdrawalType
        }
    }

    componentDidMount(props) {
        Orientation.lockToPortrait() //鎖定屏幕
        const { paymentWithdrawalType, coinTypes } = this.state
        this.props.navigation.setParams({
            title: paymentWithdrawalType == 'LB' ? '便捷提款教程' : '泰达币提款教程'
        })
    }



    renderPage(item) {
        console.log(item)
        return <TouchableOpacity key={item.index} style={[styles.carouselImg]}>
            <Image
                resizeMode='stretch'
                style={styles.carouselImg}

                source={item.item} />

        </TouchableOpacity>
    }



    render() {
        const { bannerIndex, paymentWithdrawalType, coinTypesArr, bankarrIndex, coinTypes, arrowFlag2,
            balanceInfor, tranferRecordsList, fromWalletIndex, toWalletIndex,
            toBalanceInfor, fromBalanceInfor, withdrawalRecordsList,
            recordIndex, dateFrom, dateTo, depositListIndex, depositRecordsList, withdrawalListIndex } = this.state

        const bannerData = paymentWithdrawalType == 'LB' ? GuideImg[paymentWithdrawalType] : GuideImg[paymentWithdrawalType][bankarrIndex]
        console.log(paymentWithdrawalType)
        return <View style={[styles.viewContainer, { backgroundColor: true ? '#EFEFF4' : '#000' }]}>
            {
                paymentWithdrawalType == 'CCW' && <View style={{ backgroundColor: '#00A6FF', flexDirection: 'row', alignItems: 'center', }}>
                    {
                        coinTypesArr.map((v, i) => {
                            let flag = bankarrIndex == i
                            return <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        bankarrIndex: i,
                                        bannerIndex: 0
                                    })
                                }}
                                style={{
                                    width: width / 2,

                                    alignItems: 'center', justifyContent: 'center', height: 44,
                                    borderBottomWidth: 3,
                                    borderBottomColor: flag ? '#FFFFFF' : '#00A6FF'
                                }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: flag ? '#FFFFFF' : '#B4E4FE',
                                    fontWeight: flag ? 'bold' : 'normal',
                                    fontSize: 13
                                }}>{v.title}</Text>
                            </TouchableOpacity>
                        })
                    }
                </View>
            }
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    {
                        Array.isArray(bannerData) && bannerData.length > 0 && <View style={styles.wrapper}>
                            <Carousel
                                data={bannerData}
                                renderItem={this.renderPage.bind(this)}
                                sliderWidth={width - 40}
                                itemWidth={width - 40}
                                autoplay={true}
                                loop={true}
                                autoplayDelay={500}
                                autoplayInterval={4000}
                                onSnapToItem={index => { this.setState({ bannerIndex: index }) }}
                            />
                            <Pagination
                                dotsLength={bannerData.length}
                                activeDotIndex={bannerIndex}
                                containerStyle={styles.containerStyle}
                                dotStyle={styles.dotStyle}
                                inactiveDotStyle={styles.inactiveDotStyle}
                                inactiveDotOpacity={1}
                                inactiveDotScale={0.6}
                            />
                        </View>
                    }
                </View>


            </ScrollView>
        </View>
    }
}

export default Records = connect(
    (state) => {
        return {
            balanceInforData: state.balanceInforData,
            memberInforData: state.memberInforData,
        }
    }, (dispatch) => {
        return {
            //getBalanceInforAction: () => dispatch(getBalanceInforAction())
        }
    }
)(RecordsContainer)


const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#EFEFF4'
    },
    recordContainer: {
        marginHorizontal: 10
    },
    recordBoxImg: {
        position: 'absolute',
        left: 0,
        width: 26,
        height: 26,
    },
    recordBoxImg1: {
        position: 'absolute',
        right: 10,
        width: 14,
        height: 14,
    },
    deposiBanktList: {
        backgroundColor: '#fff',
        // width: width,
        // marginHorizontal: -10,
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 55,
        paddingHorizontal: 10,
        justifyContent: 'center',
        borderTopWidth: 1,
        borderRadius: 10
    },
    recordBoxText: {
        color: '#9B9B9B',
        fontSize: 12
    },
    recordBoxText1: {
        color: '#58585B'
    },
    recordBox1: {
        width: width - 40,
        position: 'relative',
        alignItems: 'center',
        marginBottom: 20
    },
    recordBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2
    },
    recordBox2: {
        paddingLeft: 26,
        width: width - 40
    },
    serchBtnBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    fillterBox: {
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingTop: 8,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        marginBottom: 15
    },
    serchBtn: {
        height: 36,
        backgroundColor: '#25AAE1',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    serchBtnText: {
        color: '#fff'
    },
    recordIconBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    recordIcon: {
        width: 16,
        height: 16,
        marginRight: 6
    },
    recordIconText: {
        color: '#26ADE6',
        fontSize: 11
    },
    toreturnModalDropdownList: {
        height: 30,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    bettingWraps: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        overflow: 'hidden',

        backgroundColor: '#fff',
        borderWidth: 1
    },
    bettingBox: {
        height: 38,
        justifyContent: 'center',
        flexDirection: 'row',
        width: (width - 40) / 3,
        alignItems: 'center',
    },
    toreturnModalDropdown: {
        height: 40,
        borderRadius: 4,
        marginTop: 8,
        borderWidth: 1,
        justifyContent: 'center',
    },
    toreturnDropdownStyle: {
        marginTop: 10,
        width: width - 36,
        shadowColor: '#DADADA',
        shadowRadius: 4,
        shadowOpacity: .6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 4
    },
    toreturnModalDropdownTextWrap: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#D7D7DB',
        borderWidth: 1,
        height: 36,
        borderRadius: 6
    },
    toreturnModalDropdownText: {
        fontSize: 13,
        paddingRight: 25
    },
    depositStatusBox: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        flexDirection: 'row',
        height: 30,
        width: 180,
        alignItems: 'center',
        borderRadius: 100,
        justifyContent: 'center',
        // paddingHorizontal: 15
    },
    depositStatusBox1: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
        justifyContent: 'center',
        backgroundColor: '#83E300',
        paddingHorizontal: 15,
        paddingVertical: 4,
        marginLeft: 10
    },
    depositStatusBoxText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold'
    },
    depositStatusImg: {
        marginRight: 5,
        width: 15,
        height: 15
    },
    tranferWallet: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tranferWalletModalDropdown: {
        width: (width - 36) / 2.05,
        marginHorizontal: 0
    },
    tranferWalletModalDropdownStyle: {
        width: (width - 36) / 2.05,
    },
    recordText: {
        marginTop: 100,
        textAlign: 'center'
    },
    wrapper: {
        height: height * .77,
        margin: 20,
        marginBottom: 0,
        borderRadius: 6,
    }, containerStyle: {
        paddingVertical: 2,
        marginTop: 15,
    }, carouselImg: {
        width: width - 40,
        height: height * .77,
        borderRadius: 4
    },
    dotStyle: {
        width: 12,
        height: 12,
        borderRadius: 10,
        marginHorizontal: 3,
        backgroundColor: '#00CEFF',
    },
    inactiveDotStyle: {
        width: 10,
        backgroundColor: '#BCBEC3'
    },
})