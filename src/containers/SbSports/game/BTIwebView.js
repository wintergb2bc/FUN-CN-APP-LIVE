import React from "react";
import ReactNative, {
    StyleSheet,
    Text,
    Image,
    View,
    Platform,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Linking,
    ActivityIndicator,
    WebView,
    NativeModules,
    Alert,
    UIManager,
    Modal
} from "react-native";
import WebViewAndroid from 'react-native-webview-android'
import WebViewIOS from 'react-native-webview';
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
// import fetch from 'fetch-with-proxy';
import { Flex, Toast, WingBlank, WhiteSpace, Tabs, Drawer } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";

const { width, height } = Dimensions.get("window");



class BTIwebView extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            gameLobbyUrl: this.props.gameLobbyUrl,
            loadD: true,
        };
    }

    componentWillMount() {
    }
    componentDidMount() {
    }

    componentWillUnmount() { }
    render() {
        const {
            gameLobbyUrl,
            loadD,
        } = this.state;
        return (
            <View style={{ flex: 1 }}>
                {
                    loadD &&
                    <View style={styles.modalView}><ActivityIndicator size="large" color="#fff" /></View>
                }
                {gameLobbyUrl != '' &&
                    <View style={{ flex: 1 }}>
                        {Platform.OS === "android" ?

                            <WebView
                                // key={Math.ceil(Math.random()*1000)}
                                onLoadStart={e => this.setState({ loadD: true })}
                                onLoadEnd={e => this.setState({ loadD: false })}
                                source={{ uri: gameLobbyUrl }}
                                mixedContentMode="always"
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                scalesPageToFit={false}
                                // onNavigationStateChange={this._onNavigationStateChange}
                                style={{ flex: 1, marginTop: 0, }}
                            />

                            : Platform.OS === "ios" &&
                            <WebViewIOS
                                // key={Math.ceil(Math.random()*1000)}
                                // ref={WEBVIEW_REF}
                                // onMessage={this._onMessage}  
                                // injectedJavaScript={patchPostMessageJsCode}
                                onLoadStart={e => this.setState({ loadD: true })}
                                onLoadEnd={e => this.setState({ loadD: false })}
                                source={{ uri: gameLobbyUrl }}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                scalesPageToFit={Platform.OS === 'ios' ? true : false}
                                style={{ flex: 1, marginTop: 0, }}
                                thirdPartyCookiesEnabled={true}
                                mediaPlaybackRequiresUserAction={false}
                            />
                        }
                    </View>
                }

            </View>
        );
    }
}



export default BTIwebView;

const styles = StyleSheet.create({
    modalView: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
        width: width,
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50,
        backgroundColor: 'rgba(0, 0, 0, .6)',
    },

});
