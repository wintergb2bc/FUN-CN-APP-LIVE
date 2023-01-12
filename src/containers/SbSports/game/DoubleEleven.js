import React from "react";
import {
    StyleSheet,
    WebView,
    Text,
    View,
    CameraRoll,
    Animated,
    TouchableOpacity,
    PermissionsAndroid,
    Dimensions,
    Platform,
    Image,
    BackHandler
} from "react-native";
import { Actions } from "react-native-router-flux";
import {
    Carousel,
    WhiteSpace,
    WingBlank,
    Modal,
    Flex,
    Toast,
    ActivityIndicator,
    Picker,
    List
} from "antd-mobile-rn";
import { captureScreen } from "react-native-view-shot";
import Touch from "react-native-touch-once";
import WebViewIOS from "react-native-webview";
const { width, height } = Dimensions.get("window");
import WebViewAndroid from 'react-native-webview-android'

let goLogin = true
class DoubleEleven extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadD: false,
            loadone: 1,
            urlHtml: this.props.urlHtml ? this.props.urlHtml: "",
        };
    }

    componentWillMount(props) {
        goLogin = true
    }

    componentDidMount() {}

    componentWillUnmount() {}





    render() {

        const { urlHtml, loadD, loadone } = this.state;
        const patchPostMessageFunction = function () {
            var NativeAppFun = {Deposit: (action) => {
                var us = navigator.userAgent;
                var isAndroid = us.indexOf('Android') > -1 || us.indexOf('Adr') > -1;
                if(isAndroid) {
                    window.postMessage(action)
                } else {
                    window.ReactNativeWebView.postMessage(action)
                }
                
            }}
            // window.NativeApps = NativeAppFun
            window.postMessage = NativeAppFun.Deposit
        };
        const unLogin = function () {
            function ShowLogin() {
                var us = navigator.userAgent;
                var isAndroid = us.indexOf('Android') > -1 || us.indexOf('Adr') > -1;
                if(isAndroid) {
                    window.postMessage('ShowLogin')
                } else {
                    window.ReactNativeWebView.postMessage('ShowLogin')
                }
                return
            }
            setTimeout(() => {
                var PrizesBtn = {
                    GetPrizes: function () {
                        ShowLogin()
                    }
                }
                window.GetPrizes = PrizesBtn.GetPrizes

                document.getElementById("flake-0").addEventListener("click", ShowLogin)
                document.getElementById("flake-1").addEventListener("click", ShowLogin)
                document.getElementById("flake-2").addEventListener("click", ShowLogin)
                document.getElementById("flake-3").addEventListener("click", ShowLogin)
                document.getElementById("flake-4").addEventListener("click", ShowLogin)
                document.getElementById("flake-5").addEventListener("click", ShowLogin)
                document.getElementById("flake-6").addEventListener("click", ShowLogin)
                document.getElementById("flake-7").addEventListener("click", ShowLogin)
                document.getElementById("flake-8").addEventListener("click", ShowLogin)
                document.getElementById("flake-9").addEventListener("click", ShowLogin)
                document.getElementById("flake-10").addEventListener("click", ShowLogin)
                document.getElementById("flake-11").addEventListener("click", ShowLogin)
                document.getElementById("flake-12").addEventListener("click", ShowLogin)
                document.getElementById("flake-13").addEventListener("click", ShowLogin)

            }, 200);
        }
        const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();'



        return (
            <View style={{ flex: 1 }}>

                <View style={{ flex: 1 }}>
                    {Platform.OS == "ios" ?

                        <WebViewIOS
                            onLoadStart={e => this.setState({ loadD: true })}
                            onLoadEnd={e => this.setState({ loadD: false, loadone: 2 })}
                            source={{ uri: urlHtml }}
                            // cacheEnabled={false}
                            // incognito={true}
                            mixedContentMode='always'
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            scalesPageToFit={false}
                            allowsInlineMediaPlayback
                            mediaPlaybackRequiresUserAction={false}
                            allowFileAccess
                            injectedJavaScript={patchPostMessageJsCode}
                            onMessage={event => {
                                event.persist();
                                console.log('eventevent',event)
                                let action = event.nativeEvent && event.nativeEvent.data || ''
                                if(action && action == 'ShowDeposit') {
                                    PiwikEvent('Deposit_Nav', 'Click', 'Deposit_LaborDay22')
                                    Actions.pop()
                                    if(!ApiPort.UserLogin) {
                                        Actions.Login()
                                        return
                                    }
                                    Actions.DepositCenter()
                                } else if(action && action == 'ShowLogin') {
                                    getMiniGames = true
                                    Actions.pop()
                                    Actions.Login()
                                }
                            }}
                            style={{
                                width: width,
                                height: height - Platform.OS === "ios" ? 175 : 115
                            }}
                        />

                        : Platform.OS == "android" &&
                        (
                            <WebView
                                onLoadStart={e => this.setState({ loadD: true })}
                                onLoadEnd={e => this.setState({ loadD: false, loadone: 2 })}
                                source={{ uri: urlHtml }}
                                // cacheEnabled={false}
                                // incognito={true}
                                mixedContentMode='always'
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                scalesPageToFit={false}
                                allowsInlineMediaPlayback
                                mediaPlaybackRequiresUserAction
                                allowFileAccess
                                injectedJavaScript={patchPostMessageJsCode}
                                onMessage={event => {
                                    event.persist();
                                    let action = event.nativeEvent && event.nativeEvent.data || ''
                                    if(action && action == 'ShowDeposit') {
                                        PiwikEvent('Deposit_Nav', 'Click', 'Deposit_LaborDay22')
                                        Actions.pop()
                                        if(!ApiPort.UserLogin) {
                                            Actions.Login()
                                            return
                                        }
                                        Actions.DepositCenter()
                                    } else if(action && action == 'ShowLogin' && goLogin) {
                                        goLogin = false
                                        getMiniGames = true
                                        Actions.pop()
                                        Actions.Login()
                                    }
                                }}
                                style={{
                                    width: width,
                                    height: height - Platform.OS === "ios" ? 175 : 115
                                }}
                            />
                        )


                    }


                    {loadone == 1 && loadD == true && (
                        <Flex
                            style={{
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
            </View >
        );
    }
}

export default DoubleEleven;

const styles = StyleSheet.create({
    closeButton: {
        top: Platform.OS === "ios" ? 45 : 15,
        left: 20,
        fontSize: 24,
        fontWeight: "900",
        color: "#fff",
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        paddingTop: Platform.OS === "ios" ? 8 : 5,
        borderColor: "#d3d3d3",
        textAlign: "center"
    },
    SaveButton: {
        top: Platform.OS === "ios" ? 45 : 15,
        left: 0,
        fontSize: 18,
        fontWeight: "900",
        color: "#00623b",
        borderRadius: 6,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: "#fafafa",
        textAlign: "center"
    },
});
