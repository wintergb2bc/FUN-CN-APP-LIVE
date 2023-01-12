import React from 'react';
import { StyleSheet, WebView, Text, View, Animated, TouchableOpacity, Dimensions, Image, Linking, Platform, TextInput, KeyboardAvoidingView, TouchableHighlight, ScrollView } from 'react-native';
import Touch from "react-native-touch-once";
import { Actions } from 'react-native-router-flux';
import { Carousel, WhiteSpace, WingBlank, Flex, Toast, InputItem, ActivityIndicator, List, Picker } from 'antd-mobile-rn';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CheckBox from "react-native-check-box";
import ModalDropdown from "react-native-modal-dropdown";
import PickerStyle from "antd-mobile-rn/lib/picker/style/index.native";
import PickerList from "antd-mobile-rn/lib/list/style/index.native";
import WebViewIOS from "react-native-webview";
import HTMLView from 'react-native-htmlview';

const {
    width, height
} = Dimensions.get('window')

const htmls = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge "><meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no"><title>Document</title></head><body>`

class NewsDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            aaa: '',
            dataList: this.props.dataList || '',
            webViewKey: 0,
        }
    }
    componentDidMount() {
    }

    _onNavigationStateChange = (e) => {
        // if(e.url.indexOf('text/html') == -1 && e.url.indexOf('about:blank') == -1) {
        //     Linking.openURL(e.url);

        //     setTimeout(() => {
        //         let webViewKey = this.state.webViewKey
        //         webViewKey = webViewKey + 1
        //         this.setState({webViewKey})
        //     }, 600);
        // }
    }

    render() {

        const {
            aaa,
            dataList,
        } = this.state;

        //图片处理，HTMLView无法显示图片，WebView高度不自适应
        let showWebView = dataList.detail && dataList.detail.content && dataList.detail.content.indexOf('img') > -1;

        return (
            <View style={{ flex: 1, backgroundColor: "#efeff4", padding: 15 }}>
                {
                    dataList != '' && showWebView &&
                    <View style={{ flex: 1 }}>
                        <View>
                            <Text style={{ color: '#000000', fontSize: 18 }}>{dataList.type == 'Announcement' ? dataList.detail.topic : dataList.detail.title}</Text>
                            <Text style={{ color: '#BCBEC3', fontSize: 12, lineHeight: 40, }}>{dataList.dateTime}</Text>
                        </View>
                        <View>
                            {
                                Platform.OS == "ios" ?
                                    <WebViewIOS
                                        key={this.state.webViewKey}
                                        originWhitelist={['*']}
                                        source={{ html: `${htmls} ${dataList.detail.content} </body></html>` }}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                        mixedContentMode="always"
                                        scalesPageToFit={false}
                                        style={{ height: '100%', width: width - 60 }}
                                        onNavigationStateChange={this._onNavigationStateChange}
                                        mediaPlaybackRequiresUserAction={false}
                                    />
                                    :
                                    <WebView
                                        key={this.state.webViewKey}
                                        originWhitelist={['*']}
                                        source={{ html: `${htmls} ${dataList.detail.content} </body></html>` }}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                        mixedContentMode="always"
                                        scalesPageToFit={false}
                                        style={{ height: '100%', width: width - 60 }}
                                        onNavigationStateChange={this._onNavigationStateChange}
                                    />
                            }
                        </View>
                    </View>
                }
                {
                    dataList != '' && !showWebView &&
                    <ScrollView
                        style={{ flex: 1 }}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ padding: 15 }}>
                            <View>
                                <Text style={{ color: '#000000', fontSize: 18, lineHeight: 30 }}>{dataList.type == 'Announcement' ? dataList.detail.topic : dataList.detail.title}</Text>
                                <Text style={{ color: '#BCBEC3', fontSize: 12, lineHeight: 30, }}>{dataList.dateTime}</Text>
                            </View>
                            <HTMLView
                                style={{ width: width - 55 }}
                                value={`<div>${dataList.detail.content}</div>`}
                                stylesheet={styleHtmls}
                            />
                        </View>
                    </ScrollView>
                }
            </View>

        )
    }
}


export default (NewsDetail);



const styles = StyleSheet.create({

});

const styleHtmls = StyleSheet.create({
    div: {
        fontSize: 12,
        lineHeight: 22,
    },
})
