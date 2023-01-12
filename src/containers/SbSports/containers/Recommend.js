
import React, { Component, PropTypes } from 'react'
import {
    StyleSheet,
    WebView,
    Text,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    ImageBackground,
    Modal,
    Platform,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import { Actions } from "react-native-router-flux";
import SnapCarousel, {
    ParallaxImage,
    Pagination
} from "react-native-snap-carousel";
import moment from "moment";
import VendorIM from "./../lib/vendor/im/VendorIM";
import HostConfig from "./../lib/Host.config";
import { connect } from "react-redux";
import { Flex, Toast, WingBlank, WhiteSpace, Tabs, Drawer } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import EventData from "./../lib/vendor/data/EventData";
import VendorBTI from '../lib/vendor/bti/VendorBTI'
import ImageForLeague from "../game/RNImage/ImageForLeague";
import ImageForTeam from "../game/RNImage/ImageForTeam";
const { width, height } = Dimensions.get("window");
/*
    热门赛事
*/



class Recommend extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            hotEventsVisible: false,
            hotEvents: '',
        };
    }
    componentDidMount() {
        global.storage
        .load({
            key: "guide",
            id: "guide"
        })
        .then(res => {
            //没有新手引导不能弹出，会把新手引导遮住
            global.storage
            .load({
                key: "hotEventsVisible",
                id: "hotEventsVisible"
            })
            .then((data) => {
                if (ApiPort.UserLogin) {
                    this.showHotEvents()
                }
            })
            .catch(err => {
                this.showHotEvents()
            });
        })
        .catch(err => { });

    }

    componentWillUnmount() { }

    showHotEvents(key) {

        const hotEventsVendorName = 'im'; //固定im

        //維護就不展示
        if (this.checkMaintenanceStatus(hotEventsVendorName)) { //true表示維護中
            return;
        }
        if(window.EuroCupLogin) {
            return
        }

        if(!key && getMiniGames) {
            //进入活动不展示
            return
        }

        //在點擊按鈕時 才查詢
        key && Toast.loading('加载中...')
        fetch(HostConfig.Config.CacheApi + '/hotevents/' + hotEventsVendorName)
          .then(response => response.json())
          .then(jsonData => {
              jsonData.data = jsonData.data.map(ev => EventData.clone(ev)); //需要轉換一下
              //有數據才展示彈窗
              const hotEventsVisible = (jsonData.data && jsonData.data.length > 0);
              global.storage.save({
                key: "hotEventsVisible",
                id: "hotEventsVisible",
                data: 'hotEventsVisible',
                expires: null
            });
                this.setState({ hotEvents: jsonData.data, hotEventsVisible });
          })
          .catch(() => null)
          .finally(() => {
                Toast.hide();
          })


        //bti維護就不展示
        // if (this.checkMaintenanceStatus('bti')) { //true表示維護中
        //     return;
        // }


        // VendorBTI.getHotEvents().then(eventDatas => {
        //     //有數據才展示彈窗
        //     const hotEventsVisible = (eventDatas && eventDatas.length > 0);
        //     // hotEventsVisible && (this.timer = setTimeout(() => {
        //     //     this.setState({ hotEventsVisible: false }, () => {
        //     //         // this.props.onHotEventsClosed();
        //     //     })
        //     // }, 3000));
        //     global.storage.save({
        //         key: "hotEventsVisible",
        //         id: "hotEventsVisible",
        //         data: 'hotEventsVisible',
        //         expires: null
        //     });
        //     this.setState({ hotEvents: eventDatas, hotEventsVisible });
        // }).finally(() => {
        //     Toast.hide();
        // })
    }
    checkMaintenanceStatus = (name) => {
        const { isBTI, isIM, isSABA, noTokenBTI, noTokenIM, noTokenSABA } = this.props.maintainStatus;
        const { isLogin } = this.props.userInfo; //有登入才額外判斷 token獲取狀態
        switch (name) {
            case 'bti':
                return isBTI || (isLogin && noTokenBTI);
            case 'im':
                return isIM || (isLogin && noTokenIM);
            case 'saba':
                return isSABA || (isLogin && noTokenSABA);
            default:
                return false;
        }
    };

    render() {
        window.ShowHotEvents = (key) => {
            this.showHotEvents(key)
        }
        const { hotEventsVisible, hotEvents } = this.state;

        const Vendor = VendorIM; //固定im

        return (
            <View>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={!window.isMobileOpen && hotEventsVisible}
                    onRequestClose={() => { }}
                >
                    <View style={styles.depModal}>
                        <View style={{backgroundColor: '#004bef', borderRadius: 15}}>
                            <ImageBackground
                                style={{ width: width - 40, height: 1.34 * (width - 40), padding: 10,position: 'absolute',zIndex: -1 }}
                                resizeMode="stretch"
                                source={require("../images/pop-up-match.png")}
                            ></ImageBackground>
                            <View
                                style={{ width: width - 40,padding: 10 }}
                            >
                                <View>
                                    <View style={{ paddingTop: width * 0.35 }}>
                                        {hotEvents.length > 0 && hotEvents.map((v,i) => (
                                            <Touch key={i} onPress={() => {
                                                this.setState({ hotEventsVisible: false }, () => {
                                                    PiwikEvent('Game Nav', 'Click', 'HotMatches_SB2.0')
                                                    let dataList = {
                                                        eid: v.EventId,
                                                        sid: v.SportId,
                                                        lid: v.LeagueId,
                                                    }
                                                    if (Vendor.configs.VendorName !== lowerV ) { //如果當前不是選擇這個vendor，直接切換過去
                                                        window.changeGameFullPage(Vendor.configs.VendorName);
                                                    }
                                                    Actions.Betting_detail({ dataList, Vendor })
                                                })
                                                // Router.push(
                                                //     `${Vendor.configs.VendorPage}/detail?sid=${v.SportId}&eid=${v.EventId}&lid=${v.LeagueId}`
                                                // );
                                            }}>
                                                <View style={styles.itemsList}>
                                                    <View style={styles.itemName}>
                                                        {/* <LazyImageForLeague Vendor={Vendor} LeagueId={v.LeagueId} /> */}
                                                        <ImageForLeague LeagueId={v.LeagueId} Vendor={Vendor} />
                                                        <Text style={{ color: '#999' }}>{v.LeagueName}</Text>
                                                    </View>
                                                    <View style={styles.BettingList}>
                                                        <View style={{display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
                                                            {/* <LazyImageForTeam Vendor={Vendor} TeamId={v.HomeTeamId} /> */}
                                                            <ImageForTeam TeamId={v.HomeTeamId} Vendor={Vendor} IconUrl={v.HomeIconUrl} />
                                                            <Text style={{ width: (width - 50) * 0.35, color: '#000', textAlign: 'center' }}>{v.HomeTeamName}</Text>
                                                        </View>
                                                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <Text style={{ color: '#000', fontSize: 12, paddingBottom: 15 }}>{v.getEventDateMoment().format('MM/DD HH:mm')}</Text>
                                                            <Text style={{ color: '#999', fontSize: 22, fontWeight: 'bold' }}>VS</Text>
                                                        </View>
                                                        <View style={{display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
                                                            {/* <LazyImageForTeam Vendor={Vendor} TeamId={v.AwayTeamId} /> */}
                                                            <ImageForTeam TeamId={v.AwayTeamId} Vendor={Vendor} IconUrl={v.AwayIconUrl} />
                                                            <Text style={{ width: (width - 50) * 0.35, color: '#000', textAlign: 'center' }}>{v.AwayTeamName}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Touch>
                                        ))}
                                    </View>
                                    <Text style={{color: '#fff', fontSize: 12,textAlign: 'center'}}>点击卡片查看更多投注</Text>
                                </View>
                            </View>
                        </View>
                        <Touch onPress={() => { this.setState({ hotEventsVisible: false }) }} style={styles.closes}>
                            <Image resizeMode='stretch' source={require('../images/closeWhite.png')} style={{ width: 30, height: 30 }} />
                        </Touch>
                    </View>
                </Modal>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    maintainStatus: state.maintainStatus,
});

export default connect(
    mapStateToProps,
    null,
)(Recommend);

const styles = StyleSheet.create({
    depModal: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closes: {
        backgroundColor: 'rgba(0,0,0,.3)',
        width: 38,
        height: 38,
        borderRadius: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    itemsList: {
        padding: 25,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    itemName: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    BettingList: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    }
})
