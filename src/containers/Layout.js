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
    Vibration,
    ImageBackground,
    Platform,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import SnapCarousel, {
    ParallaxImage,
    Pagination
} from "react-native-snap-carousel";
import { connect } from "react-redux";
import EventInfo from "./../containers/SbSports/lib/vendor/data/EventInfo"
import Touch from "react-native-touch-once";
import Modal from 'react-native-modal';
const { width, height } = Dimensions.get("window");
import Video from 'react-native-video';
import React from "react";
//import { signalRConnect } from '../lib/utils/signalR'
// import VendorIM from '$SBLIB/vendor/im/VendorIM'
// import VendorBTI from '$SBLIB/vendor/bti/VendorBTI'
import {EventChangeType, SpecialUpdateType, VendorMarkets} from "./../containers/SbSports/lib/vendor/data/VendorConsts";
import { Actions } from "react-native-router-flux";
import HTMLView from 'react-native-htmlview';
import actions from '../lib/redux/actions/index'


class Layout extends React.Component  {

    constructor() {
        super();
        this.state = {
            notificationInfo: "",
            notificationRecommendInfo: null,
            whistle: false,
        };

        this.notification = this.notification.bind(this);
    }

    componentDidMount() {
        if (!ApiPort.UserLogin) { return }
        //進球通知,延迟3秒获取用户配置,
        setTimeout(() => {
            this.notification();
        }, 3000);

        //綁定後台推送(signalR)處理函數
        //這樣做是因為layout在換頁時會被unmount，需要重新綁定當前實例
        if (typeof window !== "undefined") {
            //獲取到全站群發訊息
            window.signalR_onGetBroadcastSBMessage = this.signalR_getBroadcastSBMessage.bind(this);
            //獲取到單發個人訊息
            window.signalR_onGetPrivateSBMessage = this.signalR_getPrivateSBMessage.bind(this);
        }

        //後台推送(signalR) 頁面刷新時重連
        //signalRConnect(true);
    }

    componentWillUnmount() {
        this.props.Vendor.deletePolling(this.eventPollingKey);

        //解綁後台推送(signalR)處理函數
        if (typeof window !== "undefined") {
            //獲取到全站群發訊息
            window.signalR_onGetBroadcastSBMessage = null;
            //獲取到單發個人訊息
            window.signalR_onGetPrivateSBMessage = null;
        }

        if (this.signalR_timout_handler) {
            clearTimeout(this.signalR_timout_handler);
        }
        if (this.notification_timeout_handler) {
            clearTimeout(this.notification_timeout_handler);
        }
    }

    //處理push 廣播群發
    signalR_getBroadcastSBMessage(messageID, messageTitle, messageContent, messageLanguage, messageCategoryId) {
        return this.signalR_getMessage('B', messageID, messageTitle, messageContent, messageLanguage, messageCategoryId);
    }

    //處理push 單發個人
    signalR_getPrivateSBMessage(messageID, messageTitle, messageContent, messageLanguage, messageCategoryId) {
        return this.signalR_getMessage('P', messageID, messageTitle, messageContent, messageLanguage, messageCategoryId);
    }

    //處理push  type=B 為廣播群發  type=P 為單發個人
    signalR_getMessage(type = 'B', messageID, messageTitle, messageContent, messageLanguage, messageCategoryId) {
        let thisMsgType = 'broadcastSBMessage';
        if (type !== 'B') {
            thisMsgType = 'privateSBMessage';
        }

        const replaceAll = function (source, search, replacement) {
            return source.replace(new RegExp(search), replacement);
        };

        // +號特別處理  改成htmlencode的空白(%20)
        if (messageTitle && messageTitle.length > 0) {
            messageTitle = replaceAll(messageTitle, /\+/, '%20');
        }
        if (messageContent && messageContent.length > 0) {
            messageContent = replaceAll(messageContent, /\+/, '%20');
        }

        //發過來的內容url encode過 需要decode
        const urlDecodedMessageTitle = decodeURIComponent(messageTitle);
        const urlDecodedMessageContent = decodeURIComponent(messageContent);

        console.log('===signalR get ' + thisMsgType + ' ON Layout', messageID, urlDecodedMessageTitle, urlDecodedMessageContent, messageTitle, messageContent, messageLanguage, messageCategoryId);

        //存款到帳，自動刷新餘額
		if (messageID === 0 && urlDecodedMessageContent && urlDecodedMessageContent && urlDecodedMessageContent.indexOf("存款已成功到账") > 0) {
			console.log('===signalR refresh balance');
			this.props.userInfo_getBalanceSB(true);
		}

        window.notificationRecommend = {
            id: messageID,
            type: thisMsgType,
            title: urlDecodedMessageTitle,
            info: urlDecodedMessageContent
        };

        this.shows(true)
        this.setState({
            notificationRecommendInfo: {
                id: messageID,
                type: thisMsgType,
                title: urlDecodedMessageTitle,
                info: urlDecodedMessageContent
            }
        }, () => {
            //考慮連續push，先關閉現有的timeout
            if (this.signalR_timout_handler) {
                clearTimeout(this.signalR_timout_handler);
                this.signalR_timout_handler = null;
            }
            //然後起一個新的
            this.signalR_timout_handler = setTimeout(() => {
                window.notificationRecommend = ''
                this.shows(false)
                this.setState({ notificationRecommendInfo: null });
                clearTimeout(this.signalR_timout_handler);
                this.signalR_timout_handler = null;
            }, 10000);
        });
    }
    //進球通知
    notification() {
        if (global.localStorage.getItem("loginStatus") != 1) {
            return; //未登入不用通知
        }

        let currentVendor = this.props.Vendor;

        // const { pathname } = this.props.router;

        // if (pathname === VendorBTI.configs.VendorPage) {
        //     currentVendor = VendorBTI;
        // } else if (pathname === VendorIM.configs.VendorPage) {
        //     currentVendor = VendorIM;
        // }

        // if (window.lowerV == 'BTI') {
        //     currentVendor = VendorBTI;
        // } else if (window.lowerV == 'IM') {
        //     currentVendor = VendorIM;
        // }

        if (!currentVendor) {
            return null;
        }

        // let whistle = new Audio("/sound/whistle.mp3");
        // whistle.muted = true;
        // whistle.muted = false;

        //console.log('===currentVendor',currentVendor.configs.VendorPage);

 		// 動態獲取比賽數據，這樣 不管怎麼變動，都不用重新配置輪詢
         const getEventInfosFunc = async () => {
			// 1. 先取用戶配置
			const memberSetting = currentVendor.getMemberSetting();

			let eventInfos = [];
			if (memberSetting.goalNotification) {
				// 進球通知只需要 足球，其他都不用
				const targetSportId = 1;

				// 如果勾選 全部滾球 直接查詢全部滾球數據，因為全部滾球一定會包含 收藏 和 投注 賽事
				if (memberSetting.goalAllRB) {
					const runningPR = await currentVendor.getEvents(targetSportId, VendorMarkets.RUNNING);
					const runningEvents = runningPR.NewData;
					eventInfos = eventInfos.concat(runningEvents.map(ev => new EventInfo(ev.EventId, ev.SportId, ev.IsOutRightEvent === true)));
				} else {
					// 2. 收藏賽事有開，取收藏賽事
					if (memberSetting.goalMyFavorite) {
						const favEvents = await currentVendor.getFavouriteEvents();
						const favEventInfos = favEvents.map(ev => {
							return new EventInfo(ev.EventId, ev.SportId, ev.IsOutRightEvent === true);
						})
						eventInfos = eventInfos.concat(favEventInfos);
					}
					// 3. 投注賽事有開，取投注賽事(注單未結算)
					if (memberSetting.goalIBet) {
						console.log('before await');
						const unsettleWagers = await currentVendor.getUnsettleWagers();
						console.log('after await');
						let unsettleWagerEventInfos = []
						unsettleWagers.map(uw => {
							uw.WagerItems.map(wi => {
								unsettleWagerEventInfos.push(new EventInfo(wi.EventId, wi.SportId, wi.IsOutRightEvent))
							})
						})
						eventInfos = eventInfos.concat(unsettleWagerEventInfos);
					}
					// 4.去重複
					eventInfos = eventInfos.filter((ei, index, self) => self.findIndex(t => t.EventId === ei.EventId) === index);
					// 5.去除優勝冠軍
					eventInfos = eventInfos.filter(ei => !ei.IsOutRightEvent);
					// 6.只保留足球
					eventInfos = eventInfos.filter(ei => parseInt(ei.SportId) === targetSportId);
				}
			}

			//console.log('===notification eventInfos',JSON.parse(JSON.stringify(eventInfos)));

			return eventInfos;
		}

        // 輪詢 多個比賽數據(在notification 使用) 返回輪詢key，在componentWillUnmount時記得刪掉輪詢
        this.eventPollingKey = currentVendor.getEventsDetailPollingGlobal('notification', PollingResult => {
            //console.log('===update Event',PollingResult);
            // this.setState({EventDetail: PollingResult.NewData});

            // 處理 數據變化
            PollingResult.Changes.map(changeData => {
                // 類型：更新
                if (changeData.ChangeType === EventChangeType.Update) {
                    changeData.SpecialUpdates.map(sUpdateData => {
                        const thisEventId = changeData.EventId; // 比賽ID

                        // 進球通知
                        // HomeGoal: 2,  //主場進球
                        // AwayGoal: 3,  //客場進球

                        // 主場進球
                        if (sUpdateData.UpdateType === SpecialUpdateType.HomeGoal) {
                            //處理通知
                            const thisEvent = changeData.NewValue;

                            console.log('===', thisEventId, '主場進球', sUpdateData.OldValue, '=>', sUpdateData.NewValue);
                            this.setState({ notificationInfo: thisEvent.HomeTeamName + '(进球) ' + (thisEvent.HomeScore ?? 0) + ' - ' + (thisEvent.AwayScore ?? 0) + ' ' + thisEvent.AwayTeamName });

                            window.notificationInfo = thisEvent.HomeTeamName + '(进球) ' + (thisEvent.HomeScore ?? 0) + ' - ' + (thisEvent.AwayScore ?? 0) + ' ' + thisEvent.AwayTeamName;
                            this.shows(true)
                            //考慮連續進球，先關閉現有的timeout
                            if (this.notification_timeout_handler) {
                                clearTimeout(this.notification_timeout_handler);
                                this.notification_timeout_handler = null;
                            }
                            //然後起一個新的
                            this.notification_timeout_handler = setTimeout(() => {
                                this.setState({ notificationInfo: "" });
                                window.notificationInfo = ''
                                this.shows(false)
                                clearTimeout(this.notification_timeout_handler);
                                this.notification_timeout_handler = null;
                            }, 10000);

                            //聲音
                            const memberSetting = currentVendor.getMemberSetting();
                            if (memberSetting.goalSound) {
                                this.setState({ whistle: true })
                                try {
                                    // whistle.play().catch(e => {
                                    //     console.log('===play sound error', e);
                                    // })
                                } catch (e) {
                                    console.log('===play sound error', e);
                                }
                            }

                            //震動
                            if (memberSetting.goalVibration) {
                                if (typeof window !== "undefined") {
                                    Vibration.vibrate()
                                    try {
                                        // Vibration.vibrate([0, 1000, 0, 0])
                                    } catch (e) {
                                        console.log('===vibrate error', e);
                                    }
                                }
                            }

                        }

                        // 客場進球
                        if (sUpdateData.UpdateType === SpecialUpdateType.AwayGoal) {
                            const thisEvent = changeData.NewValue;

                            // 處理通知
                            console.log('===', thisEventId, '客場進球', sUpdateData.OldValue, '=>', sUpdateData.NewValue);
                            this.setState({ notificationInfo: thisEvent.HomeTeamName + ' ' + (thisEvent.HomeScore ?? 0) + ' - ' + (thisEvent.AwayScore ?? 0) + ' ' + thisEvent.AwayTeamName + '(进球)' });

                            window.notificationInfo = thisEvent.HomeTeamName + ' ' + (thisEvent.HomeScore ?? 0) + ' - ' + (thisEvent.AwayScore ?? 0) + ' ' + thisEvent.AwayTeamName + '(进球)';
                            this.shows(true)
                            //考慮連續進球，先關閉現有的timeout
                            if (this.notification_timeout_handler) {
                                clearTimeout(this.notification_timeout_handler);
                                this.notification_timeout_handler = null;
                            }
                            //然後起一個新的
                            this.notification_timeout_handler = setTimeout(() => {
                                this.setState({ notificationInfo: "" });
                                window.notificationInfo = ''
                                this.shows(false)
                                clearTimeout(this.notification_timeout_handler);
                                this.notification_timeout_handler = null;
                            }, 10000);

                            //聲音
                            const memberSetting = currentVendor.getMemberSetting();
                            if (memberSetting.goalSound) {
                                this.setState({ whistle: true })
                                try {
                                    // whistle.play().catch(e => {
                                    //     console.log('===play sound error', e);
                                    // })
                                } catch (e) {
                                    console.log('===play sound error', e);
                                }
                            }

                            //震動
                            if (memberSetting.goalVibration) {
                                if (typeof window !== "undefined") {
                                    Vibration.vibrate()
                                    try {
                                        // window.navigator.vibrate(500);
                                    } catch (e) {
                                        console.log('===vibrate error', e);
                                    }
                                }
                            }


                        }
                    })
                }
            })
        }, getEventInfosFunc); // <== 查詢參數 獲取 比賽查詢依據(EventInfo) 的函數
    }

    shows(active) {
        window.showPushHome && window.showPushHome(active)
        window.showPushDeposit && window.showPushDeposit(active)
        window.showPushTransfer && window.showPushTransfer(active)
    }


    render() {

        return (
            <View>
                {
                    this.state.whistle &&
                    <View style={{position: 'absolute', zIndex: -100}}>
                        <Video
                            source={require('../images/whistle.mp3')}
                            onEnd={() => {this.setState({whistle: false})}}
                            rate={1.0}
                            muted={false}
                            resizeMode={"cover"}
                            style={{ height: 1, width: 2 }}
                            playWhenInactive={false}
                            onLoadStart={() => { }}
                        />
                    </View>
                }
            </View>
        );
    }
}


export class PushLayout extends React.Component {
    state = {
        aaa: false,
        shows: true,
    };

    goMsgDetail() {
        let datas = window.notificationRecommend;
        console.log('window.notificationRecommend',window.notificationRecommend)
        if(datas.id == 0) {
            return
        }
        Actions.NotificationDetail({id: datas.id, types: datas.type})
    }
    render() {

        return (
            <View>
                {
                    this.props.showPush &&
                        window.notificationInfo != '' ?
                        <View style={styles.gamePush}>
                            <Image resizeMode='stretch' source={require('../images/news/ball_notification.png')} style={{ width: 36, height: 36 }} />
                            <Text style={{ color: '#000', fontSize: 12, width: width * 0.8 }}>{window.notificationInfo}</Text>
                        </View>
                        : null
                }
                {
                    this.props.showPush && this.state.shows &&
                        window.notificationRecommend != '' ?
                        <View style={styles.msgPush}>
                            <Touch onPress={() => { this.goMsgDetail() }} style={styles.msgPushTxt}>
                                <Image resizeMode='stretch' source={require('../images/news/msgOther.png')} style={{ width: 36, height: 36 }} />
                                <View>
                                    {
                                        window.notificationRecommend.title != '' &&
                                        <Text style={{ color: '#000', fontSize: 12, width: width * 0.7 }} numberOfLines={1}>
                                            {window.notificationRecommend.title}
                                        </Text>
                                    }
                                    {/* <Text style={{ color: '#666', fontSize: 12, width: width * 0.7 }} numberOfLines={1}>
                                        {window.notificationRecommend.info}
                                    </Text> */}
                                    <View style={{ maxHeight: 23, overflow: 'hidden' }}>
                                        <HTMLView
                                            value={`<div>${window.notificationRecommend.info}</div>`}
                                            style={{ width: width * 0.7 }}
                                            stylesheet={styleHtmls}
                                        />
                                    </View>
                                </View>
                            </Touch>
                            <Touch onPress={() => { this.setState({shows: false}) }}>
                                <Image resizeMode='stretch' source={require('../images/close.png')} style={{ width: 18, height: 18 }} />
                            </Touch>
                        </View>
                        : null
                }
            </View>
        );
    }
}

const mapDispatchToProps = {
	userInfo_getBalanceSB: (forceUpdate = false) => actions.ACTION_UserInfo_getBalanceAll(forceUpdate)
}

export default connect( null, mapDispatchToProps)(Layout);


const styleHtmls = StyleSheet.create({
	div: {
		fontSize: 12,
		lineHeight: 22,
	},
})



const styles = StyleSheet.create({
    gamePush: {
        width: width,
        height: 50,
        backgroundColor: '#ffe6dd',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 10,
    },
    msgPush: {
        width: width,
        height: 50,
        backgroundColor: '#cce5f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
    },
    msgPushTxt: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
    },
});
