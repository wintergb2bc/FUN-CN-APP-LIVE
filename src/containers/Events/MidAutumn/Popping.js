import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, ActivityIndicator, Platform, ImageBackground } from 'react-native';
import Modals from 'react-native-modal';
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';


const {
    width,
    height
} = Dimensions.get('window')
const PoppingAssetsList = [
    {
        poping: 'poping1',
        top: 40,
        left: 30,
        width: 120,
    },
    {
        poping: 'poping2',
        top: 0,
        left: width - 200,
        width: 110,
    },
    {
        poping: 'poping3',
        top: 140,
        left: 50,
        width: 130,
    },
    {
        poping: 'poping4',
        top: 90,
        left: width - 180,
        width: 130,
    },
    {
        poping: 'poping5',
        top: 250,
        left: 20,
        width: 145,
    },
    {
        poping: 'poping6',
        top: 245,
        left: width - 170,
        width: 145,
    },
]


class Popping extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            poping1: 0,
            poping2: 0,
            poping3: 0,
            poping4: 0,
            poping5: 0,
            poping6: 0,
        }
        this.popingInterval = null

    }
    componentWillMount() {
        this.popingActive()
    }
    componentWillUnmount() {
        this.clearIntervals()
    }

    clearIntervals() {
        this.popingInterval && clearInterval(this.popingInterval)
    }




    //开启动画GIF
    popingActive() {
            this.popingInterval = setInterval(() => {
                if (this.props.popingActive) {
                    const prizeArray = [1, 2, 3]//3个gif图，使用splice不会有重复显示
                    const popingArray = [1, 2, 3, 4, 5, 6]//6个弹出位置，使用splice位置不重复
                    const popingNum = new Array(Math.floor(Math.random() * 3) + 1).fill(1)//一次弹出几个,1,2,3

                    //状态恢复默认，防止没刷新gif,没动画
                    this.setState({
                        poping1: 0,
                        poping2: 0,
                        poping3: 0,
                        poping4: 0,
                        poping5: 0,
                        poping6: 0,
                    }, () => {
                        popingNum.forEach((item, key) => {
                            const popingKey = popingArray.splice(Math.floor(Math.random() * popingArray.length), 1)[0]
                            const prizeKey = prizeArray.splice(Math.floor(Math.random() * prizeArray.length), 1)[0]
                            this.setState({
                                ['poping' +  popingKey]: prizeKey
                            })
                        })
                    })
                }
            }, 2000);
    }

    //抽奖api
    SnatchPrize(item) {
        if (this.state[item.poping] != 0) {
            this.props.SnatchPrize()
        }
    }


    render() {

        return (
            <View style={{ flex: 1 }}>
                {
                    PoppingAssetsList.map((item, index) => {
                        let poping = this.state[item.poping]
                        return <View key={index}>
                            <Touch onPress={() => { this.SnatchPrize(item) }} style={[styles.portal, { left: item.left, top: item.top, }]} activeOpacity={1}>
                                <ImageBackground
                                    style={{ width: item.width, height: item.width * 0.58 }}
                                    resizeMode="stretch"
                                    source={require("../../../images/minGame/portal.png")}
                                >
                                    <View style={[styles.portalPop, { top: -100 - (index * 10) }]}>
                                        {
                                            poping == 1 &&
                                            <Image resizeMode='stretch' source={require('../../../images/minGame/Popping_Casino.gif')}
                                                style={{ width: item.width, height: item.width * 1.225 }} />
                                        }
                                        {
                                            poping == 2 &&
                                            <Image resizeMode='stretch' source={require('../../../images/minGame/Popping_Slot.gif')}
                                                style={{ width: item.width, height: item.width * 1.225 }} />
                                        }
                                        {
                                            poping == 3 &&
                                            <Image resizeMode='stretch' source={require('../../../images/minGame/Popping_Sport.gif')}
                                                style={{ width: item.width, height: item.width * 1.225 }} />
                                        }
                                    </View>
                                </ImageBackground>
                            </Touch>
                        </View>
                    })
                }
            </View>
        )
    }

}

export default Popping;


const styles = StyleSheet.create({
    portal: {
        position: 'absolute',
        top: 0,
        left: width - 200,
        zIndex: 9,
        height: 150,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    portalPop: {
        position: 'absolute',
        top: -145,
        left: 0,
        zIndex: 99,
    },
});




