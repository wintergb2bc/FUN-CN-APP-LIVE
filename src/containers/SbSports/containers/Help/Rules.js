import React from "react";
import {
    StyleSheet,
    Text,
    TextStyle,
    Image,
    View,
    ViewStyle,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    TextInput,
    FlatList,
    RefreshControl,
    ImageBackground,
    Linking,
    WebView
} from "react-native";
import Touch from "react-native-touch-once";
import LinearGradient from "react-native-linear-gradient";
import { Actions } from "react-native-router-flux";
import {
    Toast,
    Flex,
    Picker,
    List,
    Modal,
    Drawer,
    ActivityIndicator
} from "antd-mobile-rn";
import WebViewIOS from "react-native-webview";

const { width, height } = Dimensions.get("window");

const ruleURLs = {
    'IM': 'https://7xc9b5.skylgl.com/cn/',
    'BTI': 'https://contents.masamiab.com/betting-rules/zh/',
    'SABA': 'https://rrl.net2cast.com/cs/RnR.html',
}

export default class Rules extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadD: true,
            onNavigation: 0,
            checkActive: 'IM',
            activeUrl: ruleURLs['IM'],
        };
    }

    componentWillMount(props) {

    }

    componentDidMount() {

    }

    componentWillUnmount() { }



    _onNavigationStateChange = (e) => {

    }

    checkActive(checkActive) {
        if (checkActive == this.state.checkActive) { return }

        let onNavigation = this.state.onNavigation
        onNavigation += 1

        let activeUrl = ruleURLs[checkActive];

        this.setState({ checkActive, onNavigation, activeUrl, loadD: true })
    }

    render() {
        const {
            onNavigation,
            activeUrl,
            checkActive,
            loadD,
        } = this.state

        return (
            <View style={styles.rootView}>
                <View style={styles.topNav}>
                    <Touch onPress={() => { Actions.pop() }} style={{ position: 'absolute', left: 15 }}>
                        <Image resizeMode='stretch' source={require('../../images/icon-white.png')} style={{ width: 30, height: 30 }} />
                    </Touch>
                    <View style={styles.btnType}>
                        <Touch style={[styles.btnList, { backgroundColor: checkActive == 'IM' ? '#fff' : 'transparent' }]} onPress={() => { this.checkActive('IM') }}>
                            <Text style={[styles.btnTxt, { color: checkActive == 'IM' ? '#00a6ff' : '#e8e8e8' }]}>IM</Text>
                        </Touch>
                        <Touch style={[styles.btnList, { backgroundColor: checkActive == 'SABA' ? '#fff' : 'transparent' }]} onPress={() => { this.checkActive('SABA') }}>
                            <Text style={[styles.btnTxt, { color: checkActive == 'SABA' ? '#00a6ff' : '#e8e8e8' }]}>沙巴</Text>
                        </Touch>
                        <Touch style={[styles.btnList, { backgroundColor: checkActive == 'BTI' ? '#fff' : 'transparent' }]} onPress={() => { this.checkActive('BTI') }}>
                            <Text style={[styles.btnTxt, { color: checkActive == 'BTI' ? '#00a6ff' : '#e8e8e8' }]}>BTI</Text>
                        </Touch>
                    </View>
                </View>
                <View style={{ flex: 1}}>
                    {checkActive && (
                        Platform.OS == "ios" ?
                            <View style={{ flex: 1 }}>
                                <WebViewIOS
                                    onLoadEnd={e => this.setState({ loadD: false })}
                                    source={{ uri: activeUrl }}
                                    mixedContentMode="always"
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    scalesPageToFit={false}
                                    allowsInlineMediaPlayback
                                    mediaPlaybackRequiresUserAction={false}
                                    onNavigationStateChange={this._onNavigationStateChange}
                                    allowFileAccess
                                    style={{ flex: 1, zIndex: 15 }}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                            :
                            <View style={{ flex: 1 }}>
                                <WebView
                                    onLoadEnd={e => this.setState({ loadD: false })}
                                    source={{ uri: activeUrl }}
                                    mixedContentMode="always"
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    scalesPageToFit={false}
                                    onNavigationStateChange={this._onNavigationStateChange}
                                    style={{ flex: 1, zIndex: 15 }}
                                />
                            </View>
                    )}
                </View>


                {checkActive && loadD == true && (
                    <Flex
                        style={{
                            position: 'absolute',
                            top: 50,
                            left: 0,
                            width: width,
                            height: height,
                            zIndex: 99,
                            backgroundColor: "#999"
                        }}
                    >
                        <Flex.Item>
                            <ActivityIndicator size="large" color="#fff" />
                        </Flex.Item>
                    </Flex>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        backgroundColor: "#fff",
    },
    webViewStyle: {
        flex: 1,
        backgroundColor: "#fff",
        borderWidth: 0
    },
    topNav: {
        width: width,
        height: 50,
        backgroundColor: '#00a6ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        zIndex: 99999999,
    },
    btnType: {
        backgroundColor: '#7676801F',
        borderRadius: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    btnList: {
        width: 88,
        backgroundColor: '#00A6FF',
        borderRadius: 50,
    },
    btnTxt: {
        textAlign: 'center',
        lineHeight: 32,
    },
});
