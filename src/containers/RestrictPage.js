import React, { Component } from "react";
import {
    ScrollView,
    View,
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
import PushUtil from "../actions/PushUtil"; //友盟 push 推送
import DeviceInfo from 'react-native-device-info'  //獲取設備信息 
import AnalyticsUtil from '../actions/AnalyticsUtil'; //友盟  
const { width, height } = Dimensions.get("window");
import Touch from 'react-native-touch-once';
/**
 * 限制页面
 */
class RestrictPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Devicetoken: "",
            keepLogin: this.props.keepLogin
        };
    }

    componentWillMount() {
        if(!this.state.keepLogin){
            ApiPort.UserLogin = false;
        }

    }

    componentDidMount() {
        if(this.props.from == 'maintenance') {
            // window.maintenanceLiveChatXT = this.props.error_details.LiveChat
        }
    }

    componentWillUnmount() {}

    // 前往在线客服
    goToChat() {
        //navigateToSceneGlobe();

        setTimeout(() => {
            LiveChatOpenGlobe();
        }, 100);
    }


    render() {
        const {
            newTime
        } = this.state;
        console.log('this.props.from this.props.from ', this.props.from)
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {
                    //ip限制
                    this.props.from == 'restrict' &&
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <ImageBackground
                            resizeMode="stretch"
                            source={require("../images/RestrictPage/IP-Restricted.png")}
                            style={{ width: width, height: width * 1.8 }}
                        >
                            <View style={{ padding: 15, paddingTop: width * 0.7 }}>
                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        resizeMode="stretch"
                                        source={require("../images/RestrictPage/restrict.png")}
                                        style={{ width: 76, height: 76 }}
                                    />
                                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#000', lineHeight: 45 }}>访问受限</Text>
                                    <Text style={{ color: '#999', lineHeight: 22 }}>
                                        抱歉！您所在的地区受到限制,
							    </Text>
                                    <Text style={{ color: '#999', lineHeight: 22 }}>
                                        无法正常游览我们的网站哦。若有不便之处, 请多多原谅。
							    </Text>
                                    <Text style={{ color: '#999', lineHeight: 22 }}>
                                        若您有任何疑问, 请联系我们的在线客服或发邮件
							    </Text>
                                    <Touch onPress={() => { LiveChatOpenGlobe() }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 10, width: width - 80, height: 40, backgroundColor: '#00A6FF', marginTop: 15 }}>
                                        <Text style={{ color: '#fff', paddingLeft: 15 }}>在线客服</Text>
                                    </Touch>
                                    <Touch onPress={() => {
                                        Linking.openURL("mailto:"+'cs@fun88.com' );
                                    }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderColor: '#00A6FF', borderWidth: 1, borderRadius: 10, width: width - 80, height: 40, marginTop: 15 }}>
                                        <Text style={{ color: '#00A6FF', paddingLeft: 15 }}>电邮: cs@fun88.com</Text>
                                    </Touch>

                                </View>
                            </View>
                        </ImageBackground>
                    </ScrollView>
                }
                {
                    //维护
                    this.props.from == 'maintenance' &&
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                    <ImageBackground
                        resizeMode="stretch"
                        source={require("../images/RestrictPage/Maintainence-Page.png")}
                        style={{ width: width, height: width * 1.8 }}
                    >
                        <View style={{ padding: 15, paddingTop: width * 0.7 }}>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#000', lineHeight: 45 }}>亲爱的客户</Text>
                                <Text style={{ color: '#999', lineHeight: 22 }}>
                                我们的系统正在升级维护中，请稍后再尝试登入,
                                </Text>
                                <Text style={{ color: '#999', lineHeight: 22 }}>
                                您可以通过以下方式联系我们在线客服。
                                </Text>
                                <Touch onPress={() => { LiveChatOpenGlobe() }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 10, width: width - 80, height: 40, backgroundColor: '#00A6FF', marginTop: 15 }}>
                                    <Text style={{ color: '#fff', paddingLeft: 15 }}>在线客服</Text>
                                </Touch>
                                <Touch onPress={() => {
                                    Linking.openURL("mailto:"+'cs@fun88.com' );
                                }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderColor: '#00A6FF', borderWidth: 1, borderRadius: 10, width: width - 80, height: 40, marginTop: 15 }}>
                                    <Text style={{ color: '#00A6FF', paddingLeft: 15 }}>电邮: cs@fun88.com</Text>
                                </Touch>
                                <Touch onPress={() => {
                                    Linking.openURL("tel:"+'+86 400 842 891' );
                                }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderColor: '#00A6FF', borderWidth: 1, borderRadius: 10, width: width - 80, height: 40, marginTop: 15 }}>
                                    <Text style={{ color: '#00A6FF', paddingLeft: 15 }}>热线电话: +86 400 842 891</Text>
                                </Touch>
                            </View>
                        </View>
                    </ImageBackground>
                </ScrollView>
                }
                {
                    //账户限制
                  this.props.from == 'accountProblem' &&
                  <View style={styles.accountProblem}>
                      <Image source={require("./../images/icon/Error_s.png")} resizeMode='stretch' style={{ width: 58, height: 58 }}></Image>
                      <Text style={{color: '#000', fontSize: 18, fontWeight: 'bold', paddingBottom: 15, paddingTop: 25 }}>账号违反乐天堂条规</Text>
                      <Text style={{color: '#999', fontSize: 14, lineHeight: 22, textAlign: 'center', }}>{`对不起，您的账号违反乐天堂条规，我们将暂停服\n务或关闭您的用户账户。`}</Text>
                  </View>
                }
            </View>
        );
    }
}

export default RestrictPage;


const styles = StyleSheet.create({
    accountProblem: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#EFEFF4',
        paddingBottom: 100,
    },
});
