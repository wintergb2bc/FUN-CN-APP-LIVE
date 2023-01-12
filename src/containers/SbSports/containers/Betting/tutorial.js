import React, { Component } from "react";
import {
    ScrollView,
    View,
    TextInput,
    Text,
    Dimensions,
    Image,
    ImageBackground,
    TouchableOpacity,
    Platform,
    StyleSheet,
    Linking,
    Clipboard,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { WhiteSpace, Toast } from "antd-mobile-rn";
const { width, height } = Dimensions.get("window");
import { handicapData, ouData, singleData, cornerData, oeData, csData } from './mockBetData';
import Touch from 'react-native-touch-once';

let tutorialBetImg = [
    [
        require('../../images/betting/tutorial/singleBet/1-min.png'),
        require('../../images/betting/tutorial/singleBet/2-min.png'),
        require('../../images/betting/tutorial/singleBet/3-min.png'),
        require('../../images/betting/tutorial/singleBet/4-min.png'),
        require('../../images/betting/tutorial/singleBet/5-min.png'),
        require('../../images/betting/tutorial/singleBet/6-min.png'),
        require('../../images/betting/tutorial/singleBet/7-min.png'),
        require('../../images/betting/tutorial/singleBet/8-min.png'),
    ],
    [
        require('../../images/betting/tutorial/bettingCombo/1-min.png'),
        require('../../images/betting/tutorial/bettingCombo/2-min.png'),
        require('../../images/betting/tutorial/bettingCombo/3-min.png'),
        require('../../images/betting/tutorial/bettingCombo/4-min.png'),
        require('../../images/betting/tutorial/bettingCombo/5-min.png'),
        require('../../images/betting/tutorial/bettingCombo/6-min.png'),
        require('../../images/betting/tutorial/bettingCombo/7-min.png'),
        require('../../images/betting/tutorial/bettingCombo/8-min.png'),
        require('../../images/betting/tutorial/bettingCombo/9-min.png'),
        require('../../images/betting/tutorial/bettingCombo/10-min.png'),
    ],
    [
        require('../../images/betting/tutorial/freebet/1-min.png'),
        require('../../images/betting/tutorial/freebet/2-min.png'),
        require('../../images/betting/tutorial/freebet/3-min.png'),
        require('../../images/betting/tutorial/freebet/4-min.png'),
        require('../../images/betting/tutorial/freebet/5-min.png'),
        require('../../images/betting/tutorial/freebet/6-min.png'),
    ],
    [
        require('../../images/betting/tutorial/bettingComboBoost/1-min.png'),
        require('../../images/betting/tutorial/bettingComboBoost/2-min.png'),
        require('../../images/betting/tutorial/bettingComboBoost/3-min.png'),
        require('../../images/betting/tutorial/bettingComboBoost/4-min.png'),
        require('../../images/betting/tutorial/bettingComboBoost/5-min.png'),
    ],
]


class BetTutorial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerActive: 1,
            tabList1: ['让球', '大小', '独赢', '角球', '单双', '波胆'],
            tabList2: ['单项投注', '混合投注', '免费投注', '串关奖励'],
            activeTab: 0,
            refreshKey: 0,
            activeSlide: 0,
            betTutorial: handicapData,
            betTutorialActive: null,
        };
    }

    componentWillMount() {
        global.storage.save({
            key: 'tutorial',
            id: 'tutorial',
            data: 'tutorial',
            expires: null
        });
    }

    componentDidMount() { }

    componentWillUnmount() { }

    headerActive(headerActive) {
        this.setState({ headerActive, activeTab: 0, betTutorialActive: null, betTutorial: handicapData, })
    }
    activeTab(activeTab) {
        this.setState({ activeTab, betTutorialActive: null, refreshKey: this.state.refreshKey + 10,activeSlide: 0 })
        if (this.state.headerActive == 2) {
            let betTutorial = this.getData(activeTab)
            this.setState({ betTutorial })
        }
    }
    getData = (type) => {
        switch (type) {
            case 0:
                // Pushgtagdata(`Tutorial`, 'View', `Odds_Tutorial_让球`);
                return handicapData;
            case 1:
                // Pushgtagdata(`Tutorial`, 'View', `Odds_Tutorial_大小`);
                return ouData;
            case 2:
                // Pushgtagdata(`Tutorial`, 'View', `Odds_Tutorial_独赢`);
                return singleData;
            case 3:
                // Pushgtagdata(`Tutorial`, 'View', `Odds_Tutorial_角球`);
                return cornerData;
            case 4:
                // Pushgtagdata(`Tutorial`, 'View', `Odds_Tutorial_单双`);
                return oeData;
            case 5:
                // Pushgtagdata(`Tutorial`, 'View', `Odds_Tutorial_波胆`);
                return csData;
            default:
                return [];
        }
    };
    txtReturn() {
        let data = this.state.betTutorial
        let key = this.state.betTutorialActive
        if (!data || key == null) {
            return ' '
        }
        let acriveData = data[key.slice(0, 1)][key.slice(2, 3)]
        return `${acriveData.teamName}  ${acriveData.oddType}  @${acriveData.odd}`
    }
    txtReturnBottom(i) {
        let data = this.state.betTutorial
        let key = this.state.betTutorialActive
        if (!data || key == null) {
            return ' '
        }
        let acriveData = data[key.slice(0, 1)][key.slice(2, 3)]
        return acriveData.content[i]
    }
    timgReturn() {
        let data = this.state.betTutorial
        let key = this.state.betTutorialActive
        if (!data || key == null) {
            return ' '
        }
        let imgType = data[key.slice(0, 1)][key.slice(2, 3)].imgType
        let isWin = imgType == 'win' ? require('../../images/betting/tutorial/win.png') :
                    imgType == 'winHalf' ? require('../../images/betting/tutorial/winHalf.png') :
                    imgType == 'lose' ? require('../../images/betting/tutorial/lose.png') :
                    imgType == 'loseHalf' ? require('../../images/betting/tutorial/loseHalf.png') :
                    require('../../images/betting/tutorial/returnPrincipal.png')
        return isWin
    }
    render() {
        const {
            headerActive,
            tabList1,
            tabList2,
            activeTab,
            betTutorial,
            betTutorialActive,
            refreshKey,
            activeSlide,
        } = this.state;

        return (
            this.props.types == 'trends' ?
            <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
                <View style={styles.headerView}>
                    <Touch onPress={() => { Actions.pop() }}>
                        <Image resizeMode='stretch' source={require('../../images/icon-white.png')} style={{ width: 25, height: 25 }} />
                    </Touch>
                    <View style={styles.headerTitle}>
                        <TouchableOpacity onPress={() => { this.headerActive(1) }} style={[headerActive == 1 ? styles.headerActive : styles.noheaderActive]}>
                            <Text style={{ color: headerActive == 1 ? '#00A6FF' : '#99DBFF', fontSize: 12, }}>
                                盘口教程
                            </Text>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: '#fff', height: 22, width: 1, marginLeft: 3, marginRight: 3 }} />
                        <TouchableOpacity onPress={() => { this.headerActive(2) }} style={[headerActive == 2 ? styles.headerActive : styles.noheaderActive]}>
                            <Text style={{ color: headerActive == 2 ? '#00A6FF' : '#99DBFF', fontSize: 12, }}>
                                模拟投注
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Touch onPress={() => LiveChatOpenGlobe()}>
                        <Image resizeMode='stretch' source={require('../../images/cs.png')} style={{ width: 28, height: 28 }} />
                    </Touch>
                </View>
                {
                    headerActive == 1 &&
                    <View style={{ flex: 1, }}>
                        <View style={styles.tabView}>
                            {
                                tabList1.map((item, index) => {
                                    return (
                                        <Touch onPress={() => { this.activeTab(index) }} key={index}>
                                            <Text style={[activeTab == index ? styles.activeTabTxt : styles.noactiveTabTxt]}>{item}</Text>
                                            {
                                                activeTab == index && <View style={styles.activeTabBorder} />
                                            }
                                        </Touch>
                                    )
                                })
                            }
                        </View>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        >
                            {
                                activeTab == 0 &&
                                <View style={{ backgroundColor: '#fff' }}>
                                    <View style={{ padding: 10, margin: 15, width: width - 30, backgroundColor: '#FFF5BF', borderRadius: 10, }}>
                                        <Text style={{ color: '#83630B', fontSize: 12, lineHeight: 20, }}>
                                            滚球-让球赛果为投注后的进球比分。例如：投注时比分1-0，完场比分2-1，则滚球-让球盘赛果为1-1
                                        </Text>
                                    </View>
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab01.png')} style={{ width: width, height: width * 0.6269 }} />
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab02.png')} style={{ width: width, height: width * 0.811 }} />
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab03.png')} style={{ width: width, height: width * 0.714 }} />
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab04.png')} style={{ width: width, height: width * 1.056 }} />
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab05.png')} style={{ width: width, height: width * 1.057 }} />
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab06.png')} style={{ width: width, height: width * 1.059 }} />
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab07.png')} style={{ width: width, height: width * 1.044 }} />
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab08.png')} style={{ width: width, height: width * 1.053 }} />
                                </View>
                            }
                            {
                                activeTab == 1 &&
                                <View>
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab20.png')} style={{ width: width, height: width * 0.816 }} />
                                </View>
                            }
                            {
                                activeTab == 2 &&
                                <View>
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab30.png')} style={{ width: width, height: width * 1.156 }} />
                                </View>
                            }
                            {
                                activeTab == 3 &&
                                <View>
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab40.png')} style={{ width: width, height: width * 1.455 }} />
                                </View>
                            }
                            {
                                activeTab == 4 &&
                                <View>
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab50.png')} style={{ width: width, height: width * 0.668 }} />
                                </View>
                            }
                            {
                                activeTab == 5 &&
                                <View>
                                    <Image resizeMode='contain' source={require('../../images/betting/tutorial/tab60.png')} style={{ width: width, height: width * 0.866 }} />
                                </View>
                            }
                        </ScrollView>
                    </View>
                }
                {
                    headerActive == 2 &&
                    <View style={{ flex: 1 }}>
                        <View style={styles.tabView}>
                            {
                                tabList1.map((item, index) => {
                                    return (
                                        <Touch onPress={() => { this.activeTab(index) }} key={index}>
                                            <Text style={[activeTab == index ? styles.activeTabTxt : styles.noactiveTabTxt]}>{item}</Text>
                                            {
                                                activeTab == index && <View style={styles.activeTabBorder} />
                                            }
                                        </Touch>
                                    )
                                })
                            }
                        </View>
                        <View style={{ padding: 10, }}>
                            <Text style={{ color: '#666', fontSize: 16, paddingBottom: 10 }}>单选项</Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>根据赛果选择会盈利的投注选项</Text>
                        </View>
                        <View style={{ backgroundColor: '#fff' }}>
                            <View style={styles.betTitle}>
                                <View style={styles.teams}>
                                    <Text style={{ color: '#202939' }}>纽卡斯尔联</Text>
                                    <Image resizeMode='stretch' source={require('../../images/login/page1.png')} style={{ width: 28, height: 28 }} />
                                </View>
                                <View>
                                    <Text style={{ color: '#999', fontSize: 12, textAlign: 'center' }}>赛果</Text>
                                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 20 }}>
                                        {
                                            activeTab == 3 ? '7 - 5' : '2 - 0'
                                        }
                                    </Text>
                                </View>
                                <View style={styles.teams}>
                                    <Image resizeMode='stretch' source={require('../../images/login/page2.png')} style={{ width: 35, height: 35 }} />
                                    <Text style={{ color: '#202939',paddingRight: 30 }}>热刺</Text>
                                </View>
                            </View>
                            <View>
                                <View style={styles.handicap}>
                                    {
                                        (activeTab == 0 || activeTab == 3) &&
                                        <View >
                                            <Image resizeMode='stretch' source={require('../../images/login/page1.png')} style={{ width: 28, height: 28, marginBottom: 12 }} />
                                            <Image resizeMode='stretch' source={require('../../images/login/page2.png')} style={{ width: 35, height: 35 }} />
                                        </View>
                                    }
                                    {
                                        betTutorial.map((item, index) => {
                                            return (
                                                <View key={index} style={
                                                    (activeTab == 2 || activeTab == 4 || activeTab == 5) ? styles.rowView : {}
                                                }>
                                                    {
                                                        item.map((v, i) => {
                                                            return (
                                                                <Touch
                                                                    onPress={() => { this.setState({ betTutorialActive: `${index}+${i}` }) }}
                                                                    key={i}
                                                                    style={[
                                                                        styles.betTutorial,
                                                                        {
                                                                            width:
                                                                                activeTab == 0 ? (width - 60) * 0.25 :
                                                                                    activeTab == 1 ? (width - 30) * 0.25 :
                                                                                        activeTab == 2 ? (width - 20) * 0.33 :
                                                                                            activeTab == 3 ? (width - 50) * 0.5 :
                                                                                                activeTab == 4 ? (width - 20) * 0.5 : (width - 30) * 0.333
                                                                        },
                                                                        betTutorialActive == `${index}+${i}` ? styles.betTutorialActive : styles.nobetTutorialActive,
                                                                    ]}
                                                                >
                                                                    <Text style={{ fontSize: 11, color: '#BCBEC3' }}>{v.oddType}</Text>
                                                                    <View style={{display: 'flex',justifyContent: 'center',alignItems: 'center',flexDirection: 'row'}}>
                                                                        <Text style={{
                                                                            color: v.fluxType === 'up' ? '#EB2121': v.fluxType === 'down'? '#0CCC3C': '#000',
                                                                            fontWeight: 'bold'
                                                                        }}>{v.odd}</Text>
                                                                        {
                                                                            v.fluxType === 'up' &&
                                                                            <Image resizeMode='stretch' source={require('../../images/betting/round-up.png')} style={{ width: 7, height: 7,top: -3 }} />
                                                                        }
                                                                        {
                                                                            v.fluxType === 'down' &&
                                                                            <Image resizeMode='stretch' source={require('../../images/betting/round-down.png')} style={{ width: 7, height: 7,top: -3 }} />
                                                                        }
                                                                    </View>
                                                                </Touch>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                        </View>
                        {
                            betTutorialActive != null &&
                            <View>
                                <Text style={{ color: '#666', fontSize: 16, paddingLeft: 10, lineHeight: 40 }}>投注结果</Text>
                                <View style={{ backgroundColor: '#fff', paddingLeft: 15, }}>
                                    <View style={styles.detaile}>
                                        <Text style={{ color: '#000', fontSize: 16, lineHeight: 40 }}>投注：{this.txtReturn()}</Text>
                                        <Image resizeMode='stretch'
                                            source={this.timgReturn()}
                                            style={{ width: 30, height: 30 }} />
                                    </View>
                                    <View style={{paddingTop: 10,}}>
                                        <Text style={{lineHeight: 18,color: '#666666', fontSize: 12, marginBottom: 15,width: width * 0.7}}>{this.txtReturnBottom(0)}</Text>
                                        <Text style={{lineHeight: 18,color: '#666666', fontSize: 12, marginBottom: 15,width: width * 0.7}}>{this.txtReturnBottom(1)}</Text>
                                    </View>
                                </View>
                            </View>
                        }
                    </View>
                }
            </View>
            :
            <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
                <View style={styles.headerView}>
                    <Touch onPress={() => { Actions.pop() }}>
                        <Image resizeMode='stretch' source={require('../../images/icon-white.png')} style={{ width: 25, height: 25 }} />
                    </Touch>
                    <View style={[styles.headerTitle,{backgroundColor: '#00A6FF'}]}>
                        <Text style={{ color: '#fff', fontSize: 16, }}>
                            模拟投注
                        </Text>
                    </View>
                    <Touch onPress={() => LiveChatOpenGlobe()}>
                        <Image resizeMode='stretch' source={require('../../images/cs.png')} style={{ width: 28, height: 28 }} />
                    </Touch>
                </View>
                <View style={styles.tabView}>
                    {
                        tabList2.map((item, index) => {
                            return (
                                <Touch onPress={() => { this.activeTab(index) }} key={index}>
                                    <Text style={[activeTab == index ? styles.activeTabTxt1 : styles.noactiveTabTxt1]}>{item}</Text>
                                    {
                                        activeTab == index && <View style={styles.activeTabBorder} />
                                    }
                                </Touch>
                            )
                        })
                    }
                </View>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        horizontal={true}
                        pagingEnabled={true}
                        key={refreshKey}
                        onMomentumScrollEnd = {(e) => {
                            let offsetY = e.nativeEvent.contentOffset.x; //滑动距离
                            let oriageScrollWidth = e.nativeEvent.layoutMeasurement.width; //scrollView宽度

                            let activeSlide = 0
                            if(offsetY != 0) {
                                //滑动块数
                                activeSlide = offsetY / oriageScrollWidth
                            }
                            this.setState({activeSlide})
                        }}
                    >
                        {
                            tutorialBetImg[activeTab].map((item, index) => {
                                return (
                                    <View key={index} style={{width: width, display:'flex', justifyContent: 'center',alignItems: 'center',padding: 15}}>
                                        <Image resizeMode='stretch' source={item} style={{ width: width - 50, height: (width - 50) * 1.95 }} />
                                        {
                                            index == tutorialBetImg[activeTab].length - 1 &&
                                            <View style={styles.againBtn}>
                                                <Touch 
                                                    onPress={() => {
                                                        Actions.pop()
                                                        Actions.drawerClose()
                                                    }}
                                                    style={{width: width - 150, borderRadius: 10,backgroundColor: '#00A6FF', marginBottom: 15}}
                                                >
                                                    <Text style={{color: '#fff', lineHeight: 40,textAlign: 'center'}}>实战来一注</Text>
                                                </Touch>
                                                <Touch onPress={() => { this.setState({refreshKey: refreshKey + 10,activeSlide: 0}) }} style={{width: width - 150, borderRadius: 10,borderColor: '#fff', borderWidth: 1,}}>
                                                    <Text style={{color: '#fff', lineHeight: 40,textAlign: 'center'}}>再看一次</Text>
                                                </Touch>
                                            </View>
                                        }
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                    <View style={{display: 'flex', justifyContent: 'center',alignItems: 'center', flexDirection: 'row',paddingBottom: 25, width: width}}>
                        {
                            tutorialBetImg[activeTab].map((item, index) => {
                                return(
                                    <View key={index} style={activeSlide == index? styles.activeSlide : styles.noactiveSlide} />
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default BetTutorial;

const styles = StyleSheet.create({
    activeSlide: {
		width: 15,
		height: 4,
		backgroundColor: '#00A6FF',
		borderRadius: 10,
		marginLeft: 5,
	},
	noactiveSlide: {
		width: 4,
		height: 4,
		backgroundColor: '#B8B8B8',
		borderRadius: 10,
		marginLeft: 5,
	},
    againBtn: {
        position: 'absolute',
        bottom: 120,
        left: 0,
        width:  width,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detaile: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: width - 30,
        borderBottomWidth: 1,
        borderBottomColor: '#D2D2D2',
    },
    rowView: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        width: width,
    },
    betTutorial: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 5,
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 8,
    },
    betTutorialActive: {
        backgroundColor: '#E6F6FF',
        borderColor: '#00A6FF',
        borderWidth: 1,
        paddingTop: 7,
        paddingBottom: 7,
    },
    nobetTutorialActive: {
        backgroundColor: '#F7F7F7',
    },
    handicap: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        width: width,
    },
    teams: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    betTitle: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: width,
        paddingTop: 15,
        paddingBottom: 15,
    },
    activeTabTxt: {
        lineHeight: 35,
        fontSize: 12,
        color: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
    },
    noactiveTabTxt: {
        lineHeight: 35,
        fontSize: 12,
        color: '#B4E4FE',
        paddingLeft: 10,
        paddingRight: 10,
    },
    activeTabTxt1: {
        lineHeight: 35,
        fontSize: 12,
        color: '#fff',
        paddingLeft: 13,
        paddingRight: 13,
    },
    noactiveTabTxt1: {
        lineHeight: 35,
        fontSize: 12,
        color: '#B4E4FE',
        paddingLeft: 13,
        paddingRight: 13,
    },
    activeTabBorder: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 3,
        backgroundColor: '#fff',
    },
    tabView: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: width,
        backgroundColor: '#00A6FF',
    },
    headerActive: {
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 8,
        paddingLeft: 15,
        paddingRight: 15,
    },
    noheaderActive: {
        backgroundColor: 'transparent',
        borderRadius: 50,
        padding: 8,
        paddingLeft: 15,
        paddingRight: 15,
    },
    headerView: {
        width: width,
        height: 50,
        backgroundColor: '#00A6FF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
    },
    headerTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#3699CE',
        borderRadius: 50,
    },
});
