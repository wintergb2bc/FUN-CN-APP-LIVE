import React from 'react'
import { StyleSheet, View, Dimensions, Platform, WebView, Image, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import Orientation from 'react-native-orientation-locker'
import { getBalanceInforAction } from '../../actions/ReducerAction'
import WebViewIOS from 'react-native-webview'
import DeviceInfo from 'react-native-device-info'
import * as Animatable from 'react-native-animatable'
import { Actions } from 'react-native-router-flux'
import LoadIngWebViewGif from './../Common/LoadIngWebViewGif'

const iphoneXMax = ['iPhone 5', 'iPhone 5s', 'iPhone 6', 'iPhone 6s', 'iPhone 6s Plus', 'iPhone 7', 'iPhone 7 Plus', 'iPhone 8', 'iPhone 8 Plus', 'iPhone SE']
const getModel = DeviceInfo.getModel()
const isIphoneMax = !iphoneXMax.some(v => v === getModel) && Platform.OS === 'ios'
const { width, height } = Dimensions.get('window')
const AnimatableView = Animatable.View
class GameLoadPageContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loadDIPES: false,
            loadDSP: false,
            loadDIPSB: false,
            loadDSBT: false,
            loadDCMD: false,

            loadoneIPES: 1,
            loadoneSP: 1,
            loadoneIPSB: 1,
            loadoneSBT: 1,
            loadoneCMD: 1,

            gameKeyIPES: Math.random(),
            gameKeySP: Math.random(),
            gameKeyIPSB: Math.random(),
            gameKeySBT: Math.random(),
            gameKeyCMD: Math.random(),

            gametype: '',
            isShowGameLoadPage: false
        }
    }

    reloadGamePage() {
        const { gametype } = this.state
        this.setState({
            [`gameKey${gametype.toLocaleUpperCase()}`]: Math.random(),
            [`loadone${gametype.toLocaleUpperCase()}`]: 1
        })
    }

    getGameLoadDetail(isShowGameLoadPage, gameType) {
        this.setState({
            isShowGameLoadPage,
        })
        if (isShowGameLoadPage && gameType) {
            this.setState({
                gametype: gameType
            })
            this.handleHomeView.fadeInRight()
        } else {

        }
    }

    handleViewRef = ref => this.handleHomeView = ref

    makeGameLoadPageAnimate(isShowGameLoadPage, gameType) {
        this.getGameLoadDetail(isShowGameLoadPage, gameType)
    }

    refreshHome() {
        this.setState({
            loadDIPES: false,
            loadDSP: false,
            loadDIPSB: false,
            loadDSBT: false,
            loadDCMD: false,

            loadoneIPES: 1,
            loadoneSP: 1,
            loadoneIPSB: 1,
            loadoneSBT: 1,
            loadoneCMD: 1,
        })
    }

    render() {
        const { loadDIPES, loadDSP, loadDIPSB, loadDSBT, loadDCMD } = this.state
        const { loadoneIPES, loadoneSP, loadoneIPSB, loadoneSBT, loadoneCMD } = this.state
        const { gameKeyIPES, gameKeySP, gameKeyIPSB, gameKeySBT, gameKeyCMD } = this.state
        const { gametype, isShowGameLoadPage } = this.state
        const { width, height } = Dimensions.get('window')
        window.makeGameLoadPageAnimate = (isShowGameLoadPage, gameType) => {
            this.makeGameLoadPageAnimate(isShowGameLoadPage, gameType)
        }
        window.refreshHome = () => {
            this.refreshHome()
        }
        let gameLoadInforArr = Object.keys(window.gameLoadInfor)
        return <AnimatableView
            ref={this.handleViewRef}
            easing={'ease-in-out'}
            duration={300}
            transition='zIndex'
            style={[styles.viewContainer, { zIndex: (isShowGameLoadPage && ApiPort.UserLogin) ? 20 : -20 }]}>
            {
                isIphoneMax && <View style={styles.gameLoadHeadTop}></View>
            }

            <View style={[styles.gameLoadHead, { backgroundColor: '#212121' }]}>
                <TouchableOpacity
                    style={styles.GameArrowBox}
                    hitSlop={{ top: 20, right: 10, left: 10, bottom: 20 }}
                    onPress={() => {
                        this.makeGameLoadPageAnimate(false)
                        !(!this.state[`loadD${gametype.toLocaleUpperCase()}`] && this.state[`loadone${gametype.toLocaleUpperCase()}`] == 1) && this.props.getBalanceInforAction()
                    }}
                >
                    <Image
                        resizeMode='stretch'
                        source={Platform.OS === 'ios' ? require('./../../images/game/ios-gameArrow.png') : require('./../../images/game/android-gameArrow.png')}
                        style={Platform.OS === 'ios' ? styles.iosGameArrow : styles.androidGameArrow}
                    ></Image>
                </TouchableOpacity>

                {
                    gametype.length > 0 && <View style={styles.headTitleBox}>
                        <Text style={styles.headTitle}>{window.gameLoadInfor[gametype].title}</Text>
                    </View>
                }

                <View style={styles.gameButtonBox}>
                    <TouchableOpacity style={[styles.gameButtonBoxWrap]} onPress={() => {
                        this.reloadGamePage()
                    }}>
                        <Image style={styles.gameButtonImg} resizeMode='stretch' source={require('./../../images/game/gameRight0.png')}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.gameButtonBoxWrap, { marginHorizontal: 5 }]} onPress={() => {
                        this.setState({
                            isShowGameLoadPage: false
                        })
                        window.checkMemberStatus('TransferStack', true, () => {
                            this.setState({
                                isShowGameLoadPage: true
                            })
                            Actions.pop()
                        })
                    }}>
                        <Image style={styles.gameButtonImg} resizeMode='stretch' source={require('./../../images/game/gameRight1.png')}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.gameButtonBoxWrap]} onPress={() => {
                        this.setState({
                            isShowGameLoadPage: false
                        })
                        window.checkMemberStatus('DepositStack', true, () => {
                            this.setState({
                                isShowGameLoadPage: true
                            })
                            Actions.pop()
                        })
                    }}>
                        <Image style={styles.gameButtonImg} resizeMode='stretch' source={require('./../../images/game/gameRight2.png')}></Image>
                    </TouchableOpacity>
                </View>
            </View>

            {
                (gameLoadInforArr.length > 0 && ApiPort.UserLogin) && <View style={{ width, height, flex: 1, position: 'relative' }}>
                    {
                        !this.state[`loadD${gametype.toLocaleUpperCase()}`] && this.state[`loadone${gametype.toLocaleUpperCase()}`] == 1 && <LoadIngWebViewGif />
                    }
                    {
                        gameLoadInforArr.map((v, i) => {
                            let urlk = window.gameLoadInfor[v].lobbyUrl.lobbyUrl
                            let flag = v.toLocaleUpperCase() == gametype.toLocaleUpperCase()
                            return <View
                                key={i}
                                style={{
                                    width: flag ? width : 0,
                                    height: flag ? height : 0,
                                    display: flag ? 'flex' : 'none',
                                    opacity: flag ? 1 : 0,
                                    zIndex: flag ? 10 : -10,
                                    flex: flag ? 1 : 0
                                }}>
                                {
                                    urlk ? (
                                        Platform.OS === 'ios' ? <WebViewIOS
                                            onLoadStart={(e) => {
                                                this.setState({
                                                    [`loadD${v.toLocaleUpperCase()}`]: false,
                                                })
                                            }}
                                            onLoadEnd={(e) => {
                                                this.setState({
                                                    [`loadD${v.toLocaleUpperCase()}`]: true,
                                                    [`loadone${v.toLocaleUpperCase()}`]: 2
                                                })
                                            }}
                                            source={{ uri: urlk }}
                                            mixedContentMode='always'
                                            key={this.state[`gameKey${v.toLocaleUpperCase()}`]}
                                            javaScriptEnabled={true}
                                            domStorageEnabled={true}
                                            scalesPageToFit={false}
                                            allowsInlineMediaPlayback
                                            mediaPlaybackRequiresUserAction
                                            allowFileAccess
                                            style={{
                                                width: flag ? width : 0,
                                                height: flag ? height : 0,
                                                display: flag ? 'flex' : 'none',
                                                opacity: flag ? 1 : 0,
                                                zIndex: flag ? 10 : -10,
                                                flex: flag ? 1 : 0
                                            }}
                                        />
                                            :
                                            <WebView
                                                onLoadStart={(e) => {
                                                    this.setState({
                                                        [`loadD${v.toLocaleUpperCase()}`]: false,
                                                    })
                                                }}
                                                onLoadEnd={(e) => {
                                                    this.setState({
                                                        [`loadD${v.toLocaleUpperCase()}`]: true,
                                                        [`loadone${v.toLocaleUpperCase()}`]: 2
                                                    })
                                                }}
                                                source={{ uri: urlk }}
                                                mixedContentMode='always'
                                                key={this.state[`gameKey${v.toLocaleUpperCase()}`]}
                                                javaScriptEnabled={true}
                                                domStorageEnabled={true}
                                                allowsInlineMediaPlayback
                                                mediaPlaybackRequiresUserAction
                                                allowFileAccess
                                                scalesPageToFit={false}
                                                style={{
                                                    width: flag ? width : 0,
                                                    height: flag ? height : 0,
                                                    display: flag ? 'flex' : 'none',
                                                    opacity: flag ? 1 : 0,
                                                    zIndex: flag ? 10 : -10,
                                                    flex: flag ? 1 : 0
                                                }}
                                            />
                                    )
                                        :
                                        null
                                }
                            </View>
                        })
                    }
                </View>
            }
        </AnimatableView>
    }
}

export default GameLoadPage = connect(
    (state) => {
        return {
            balanceInforData: state.balanceInforData,
        }
    }, (dispatch) => {
        return {
            getBalanceInforAction: () => dispatch(getBalanceInforAction())
        }
    }
)(GameLoadPageContainer)

const styles = StyleSheet.create({
    viewContainer: {
        width,
        height,
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    gameButtonImg: {
        width: 26,
        height: 26
    },
    gameButtonBox: {
        flexDirection: 'row',
        width: (width - 10) * .3,
        justifyContent: 'flex-end'
    },
    gameButtonBoxWrap: {
        width: 26,
        height: 26
    },
    gameLoadHeadTop: {
        height: 24,
        backgroundColor: '#00aeef'
    },
    gameLoadHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        height: Platform.OS == 'ios' ? 64 : 46,
        paddingTop: Platform.OS == 'ios' ? 20 : 0,
        zIndex: 18
    },
    iosGameArrow: {
        width: 26,
        height: 26
    },
    androidGameArrow: {
        width: 30,
        height: 26
    },
    GameArrowBox: {
        width: (width - 10) * .3
    },
    headTitleBox: {
        width: (width - 10) * .4
    },
    headTitle: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16
    }
})
