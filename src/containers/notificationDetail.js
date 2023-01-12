//推送信息详情
import { Flex, Toast, WingBlank, WhiteSpace, Tabs, Drawer } from "antd-mobile-rn";
import moment from 'moment';
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
    WebView,
    NativeModules,
    Alert,
    UIManager,
    Modal
} from "react-native";
import Touch from "react-native-touch-once";
import HTMLView from 'react-native-htmlview';
const { width, height } = Dimensions.get("window");

class NotificationDetail extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            detailData: null
        }
    }
    componentDidMount() {
        this.getDetail();
    }
    componentWillUnmount() {
		window.GetMessageCounts && window.GetMessageCounts()
	}
    getDetail = () => {
        let id, types;
        if (this.props.id && this.props.types) {
            id = this.props.id;
            types = this.props.types;
        } else {
            return;
        }
        const fetchurl = ApiPort.GetMessageDetail + "?MessageID=" + id + "&";
        Toast.loading('加载中,请稍候...', 200);
        fetchRequest(fetchurl, "GET")
            .then((data) => {
                Toast.hide();
                const res = data.result;
                if (res) {
                    if (res.personalMessage.sendOn
                        && res.personalMessage.sendOn.indexOf('T') !== -1
                        && res.personalMessage.sendOn.indexOf('Z') === -1) {  //有T沒Z 補Z 並format
                        res.personalMessage.sendOn = moment(res.personalMessage.sendOn + 'Z').format('YYYY-MM-DD HH:mm:ss');
                    }
                    this.setState({
                        detailData: res.personalMessage,
                    }, () => {
                        this.UpdatePersonalData(res.personalMessage);
                    });
                }
            })
            .catch((error) => {
                Toast.hide();
            })
    };

    // 更新消息已读
    UpdatePersonalData = (data) => {
        let fetchData = this.getSingleFetchData(data);
        this.update("Personal", fetchData, data, true);
    };

    getSingleFetchData = (data) => {
        return {
            personalMessageUpdateItem: [
                {
                    MessageID: data.MessageID,
                    MemberNotificationID: data.MemberNotificationID,
                    IsRead: true,
                    IsOpen: data.IsOpen,
                },
            ],
            actionBy: JSON.parse(localStorage.getItem("memberCode")),
            timestamp: new Date().toJSON(),
        };
    };

    update = (types, fetchData, data, isSingle) => {

        let fetchstring = types === "Announcement" ? "Announcement" : "Message";
        fetchRequest(ApiPort[`Update${fetchstring}`], "PATCH", fetchData)
            .then((res) => {
            })
            .catch((error) => {
                console.log(error);
            })
    };

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#efeff4',padding: 15 }}>
                {this.state.detailData ? <View  >
                    <View  >
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#000', lineHeight: 35, }}>{this.state.detailData.Title || this.state.detailData.Topic || ""}</Text>
                        <Text style={{ color: '#999', fontSize: 12, }}>{this.state.detailData.SendOn}</Text>
                    </View>
                    <View style={{paddingTop: 20,paddingBottom: 20}} >
                        {/* <img src="/img/Rectangle.png" /> */}
                        {/* <p className="noti-detail-article" dangerouslySetInnerHTML={{
                            __html: this.state.detailData.Content,
                        }}></p> */}
                        <HTMLView
                            style={{ width: width - 40 }}
                            value={`<div>${this.state.detailData.Content}</div>`}
                            stylesheet={styleHtmls}
                        />
                    </View>
                    <Text style={{ color: '#999', fontSize: 12, }} >情报推荐内容来源于第三方，仅供参考,会员产生输赢与乐天堂无关！</Text>
                </View> : null}
            </View>
        );
    }
}
const styleHtmls = StyleSheet.create({
    div: {
        fontSize: 12,
        lineHeight: 22,
    },
})
export default NotificationDetail
