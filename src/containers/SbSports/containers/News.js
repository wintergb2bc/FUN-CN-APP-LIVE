import React from 'react';
import { StyleSheet, Text, TextStyle, Image, View, ViewStyle, ScrollView, TouchableOpacity, Dimensions, WebView, Platform, FlatList, RefreshControl, Modal } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Accordion from 'react-native-collapsible/Accordion';
import { Toast, Carousel, Flex, Picker, List, Tabs, Pagination } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import ModalDropdown from 'react-native-modal-dropdown';
import HTMLView from 'react-native-htmlview';
import VendorIM from './../../../containers/SbSports/lib/vendor/im/VendorIM';
import VendorBTI from './../../../containers/SbSports/lib/vendor/bti/VendorBTI';
import VendorSABA from './../../../containers/SbSports/lib/vendor/saba/VendorSABA';
import { ApiPortSB } from "./../../../containers/SbSports/lib/SPORTAPI";
import { fetchRequestSB } from "./../lib/SportRequest";
//import { GetDateStr } from '../utils/date'
//import LivechatDragHoliday from "./LivechatDragHoliday"  //可拖動懸浮

const {
	width, height
} = Dimensions.get('window')

class News extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			tabType: "1", // 1.通知 2.公告
			sportsTabType: "IM", // 1.Bti 2.Im
			PMATab: "1", // 1.Personal 2.Transfer 3.Announcement
			isShowDetail: false,
			detailData: "",
			// 公告
			AnnouncementData: "",
			selItemAnnouncement: { id: "0", egName: "All", label: "全部" },
			AnnouncementUnreadCount: 0,
			// 通知
			TransferData: "", //交易
			PersonalData: "", //个人
			selItemTransfer: { id: "0", egName: "All", label: "全部" },
			PersonalUnreadCount: 0,
			TransferUnreadCount: 0,
			moreLoading: false,
			// page info
			TransferPageInfo: {
				currentIndex: 1,
				lastPage: 1,
			},

			PersonalPageInfo: {
				currentIndex: 1,
				lastPage: 1,
			},

			AnnouncementPageInfo: {
				currentIndex: 1,
				lastPage: 1,
			},

			currentShowNotice: [],
			currentShowNoticeAll: [],
			SportsPageInfo: {
				currentIndex: 1,
				lastPage: 1,
			},
		}
	}

	componentWillMount(props) {
		if (ApiPort.UserLogin == true) {
			Toast.loading('加载中,请稍候...', 200);
			let processed = [
				this.GetAnnouncementData(),
				this.GetTransferData(),
				this.GetPersonalData(),
				this.onClickSportsTabs('IM')
			];
			Promise.all(processed).then((res) => {
				if (res) {
					Toast.hide();
				}
			});
		}

	}
	componentWillUnmount() {
		window.GetMessageCounts && window.GetMessageCounts()
	}

	GetAnnouncementData = () => {
		let { selItemAnnouncement } = this.state;
		let fetchurl = `${ApiPortSB.GetAnnouncements}MessageTypeOptionID=${selItemAnnouncement.id}&PageSize=8&PageIndex=1&`;
		return fetchRequestSB(fetchurl, "GET").then((res) => {
			if (res && res.isSuccess && res.result) {
				this.SetNews("Announcement", res.result)
			}
		});
	};

	GetTransferData = () => {
		let { selItemTransfer } = this.state;
		let fetchurl =
			ApiPortSB.GetMessages +
			"?MessageTypeID=2&MessageTypeOptionID=0&PageSize=8&PageIndex=1&";
		return fetchRequestSB(fetchurl, "GET").then((res) => {
			if (res && res.isSuccess && res.result) {
				this.SetNews("Transfer", res.result)
			}
		});
	};

	GetPersonalData = () => {
		let fetchurl =
			ApiPortSB.GetMessages +
			"?MessageTypeID=1&MessageTypeOptionID=0&PageSize=8&PageIndex=1&";
		return fetchRequestSB(fetchurl, "GET").then((res) => {
			if (res && res.isSuccess && res.result) {
				this.SetNews("Personal", res.result)
			}
		});
	};

	getVendorAnnouncements(vendor = 'IM') {
		let targetVendor = VendorIM;
		if (vendor === 'BTI') {
			targetVendor = VendorBTI;
		} else if (vendor === 'SABA') {
			targetVendor = VendorSABA;
		}
		Toast.loading('加载中,请稍候...', 200);
		this.setState({
			currentShowNotice: [],
			SportsPageInfo: {
				currentIndex: 1,
				lastPage: 1,
			},
		})
		targetVendor.getAnnouncements()
			.then((datas) => {
				Array.isArray(datas) && this.SetSportsNews(datas)
				Toast.hide();
			})
			.catch((err) => {
				Toast.hide();
				console.log(err);
			});
	}

	SetSportsNews = (res) => {
		let pageTotal = Math.ceil((res.length * 1) / 8);
		this.setState({
			currentShowNotice: this.state.currentShowNotice.concat(res.slice(0, this.state.SportsPageInfo.currentIndex * 8)),
			currentShowNoticeAll: res,
			SportsPageInfo: {
				currentIndex: 1,
				lastPage: pageTotal,
			},
		});
	}

	SetNews = (type, res) => {
		let data =
			type === "Announcement"
				? res.announcementsByMember
				: res.inboxMessagesListItem;
		let pageTotal = Math.ceil((res.totalGrandRecordCount * 1) / 8);
		this.setState({
			[`${type}Data`]: data,
			[`${type}UnreadCount`]: res.totalUnreadCount,
			[`${type}PageInfo`]: {
				currentIndex: 1,
				lastPage: pageTotal,
			},
		});
	};

	// 訊息詳情
	closeMessageModal = () => {
		this.setState({
			isShowDetail: false,
		});
	};


	goDetail = (type, data) => {
		!data.isRead && this[`Update${type}Data`](data);
		type !== "Transfer" && this.getDetail(type, data);
		if (type == "Transfer" && data.memberNotificationCategoryID == 29) {
			Actions.pop()
			Actions.recordes({ recordIndex: 2 })
		}
		return;
	};

	getDetail = (type, data) => {
		if (parseInt(data.messageID) === 0) {
			let dateTime = data.sendOn != '' ? this.getTime(data.sendOn) : '—— ——';
			let dataList = {
				type,
				detail: data,
				dateTime,
			}
			Actions.NewsDetailSb({ dataList })
			return;//[個人]有可能包含帳戶信息(MessageID===0)，但是會沒有detail可查，直接使用當前數據展示
		}
		let fetchurl = "";
		if (type === "Announcement") {
			fetchurl =
				ApiPortSB.GetAnnouncementDetail +
				"?AnnouncementID=" +
				data.announcementID +
				"&";
		} else {
			fetchurl =
				ApiPortSB.GetMessageDetail + "?MessageID=" + data.messageID + "&";
		}
		Toast.loading('加载中,请稍候...', 200);
		fetchRequestSB(fetchurl, "GET")
			.then((res) => {
				Toast.hide();
				if (res && res.isSuccess && res.result) {
					let detail = type == "Announcement" ? res.result.announcementResponse : res.result.personalMessage;
					let dateTime = detail.sendOn != '' ? this.getTime(detail.sendOn) : '—— ——';

					let dataList = {
						type,
						detail,
						dateTime,
					}
					Actions.NewsDetailSb({ dataList })
				}
			})
			.catch((error) => {
				Toast.hide();
			})
			.finally(() => {
				Toast.hide();;
			});
	};

	// 更新消息已读
	UpdatePersonalData = (data) => {
		let fetchData = this.getSingleFetchData(data);
		this.update("Personal", fetchData, data, true);
	};

	UpdateTransferData = (data) => {
		let fetchData = this.getSingleFetchData(data);
		this.update("Transfer", fetchData, data, true);
	};

	update = (type, fetchData, data, isSingle) => {
		let fetchstring = type === "Announcement" ? "Announcement" : "Message";
		Toast.loading('请稍候...', 200);
		fetchRequestSB(ApiPortSB[`Update${fetchstring}`], "PATCH", fetchData)
			.then((res) => {
				Toast.hide();
				if (res && res.isSuccess && res.result) {
					if (isSingle) {
						let tempArr = this.state[`${type}Data`];
						let index = tempArr.findIndex((item) => {
							if (type === "Announcement") {
								return (
									data.announcementID === item.announcementID
								);
							} else {
								return (
									data.memberNotificationID ===
									item.memberNotificationID
								);
							}
						});
						tempArr[index].isRead = true;
						this.setState({
							[`${type}Data`]: tempArr,
							[`${type}UnreadCount`]:
								this.state[`${type}UnreadCount`] - 1,
						});
					} else {
						this[`Get${type}Data`]();
					}
				}
				// Toast.hide();
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				Toast.hide();
			});
	};

	getSingleFetchData = (data) => {
		return {
			personalMessageUpdateItem: [
				{
					messageID: data.messageID,
					memberNotificationID: data.memberNotificationID,
					isRead: true,
					isOpen: data.isOpen,
				},
			],
			actionBy: memberCode,
			timestamp: new Date().toJSON(),
		};
	};

	// 更新公告已读
	UpdateAnnouncementData = (data) => {
		let fetchData = {
			announcementUpdateItems: [
				{
					announcementID: data.announcementID,
					isRead: true,
					isOpen: data.isOpen,
				},
			],
			actionBy: memberCode,
			timestamp: new Date().toJSON(),
		};
		this.update("Announcement", fetchData, data, true);
	};

	tabOneUnreadCount = () => {
		const {
			TransferUnreadCount,
			PersonalUnreadCount,
			AnnouncementUnreadCount,
		} = this.state;
		return (
			TransferUnreadCount * 1 +
			PersonalUnreadCount * 1 +
			AnnouncementUnreadCount * 1
		);
	};

	haveUnread = (type) => {
		if (this.state[`${type}Data`]) {
			return this.state[`${type}Data`].some((v) => !v.isRead);
		}
	};

	doReadAllMessage = (type) => {
		let fetchData = {
			actionBy: memberCode,
			readAll: true,
			timestamp: new Date().toJSON()
		};
		this.update(type, fetchData);
		PiwikEvent('Notification', 'View', 'Notification_readAll')
	};



	onClickInfoTabs = (key) => {
		if (key == 1) PiwikEvent('Notification', 'View', 'Notification_personal')
		if (key == 2) PiwikEvent('Notification', 'View', 'Notification_account')
		if (key == 3) PiwikEvent('Notification', 'View', 'Notification_generals')

		this.setState({
			PMATab: key,
		});
	};

	getMessageIcon = (type, data) => {
		switch (type) {
			case "Personal":
				return `messageIcons ${type}`;
			case "Transfer":
				return `messageIcons ${type}-${data.messageTypeOptionID}`;
			case "Announcement":
				if (
					data.newsTemplateCategory !== 7 &&
					data.newsTemplateCategory !== 8 &&
					data.newsTemplateCategory !== 9
				) {
					return `messageIcons ${type}-Other`;
				} else {
					return `messageIcons ${type}-${data.newsTemplateCategory}`;
				}

			default:
				break;
		}

		// return "messageIcons";
	};

	// 顯示更多訊息
	moreMessage = (type) => {
		const { moreLoading } = this.state;
		return (
			<View>
				{this.isLastPage(type) ? (
					<Text style={{ color: '#00a6ff', textAlign: 'center', fontSize: 13 }}>沒有更多信息</Text>
				) : (
					<Touch onPress={() => this.getNextPage(type)}>
						<Text style={{ color: '#00a6ff', textAlign: 'center', fontSize: 13, paddingBottom: 25 }}>点击显示更多信息</Text>
					</Touch>
				)}
			</View>


			// <div className="more-message">
			// 	{this.isLastPage(type) ? (
			// 		<span className="noMore">沒有更多信息</span>
			// 	) : moreLoading ? (
			// 		<MoreLoading />
			// 	) : (
			// 				<span onClick={() => this.getNextPage(type)}>
			// 					点击显示更多信息
			// 				</span>
			// 			)}
			// </div>
		);
	};

	isLastPage = (type) => {
		if (this.state[[`${type}PageInfo`]]["lastPage"] === 1) {
			return true;
		} else {
			return (
				this.state[`${type}PageInfo`]["currentIndex"] >=
				this.state[[`${type}PageInfo`]]["lastPage"]
			);
		}
	};

	getNextPage = (type) => {
		let fetchurl = "";
		const {
			TransferPageInfo,
			PersonalPageInfo,
			AnnouncementPageInfo,
			selItemAnnouncement,
		} = this.state;

		if (this.isLastPage(type)) return;

		switch (type) {
			case "Personal":
				fetchurl = `${ApiPortSB.GetMessages
					}?MessageTypeID=1&MessageTypeOptionID=0&PageSize=8&PageIndex=${PersonalPageInfo.currentIndex * 1 + 1
					}&`;
				break;
			case "Transfer":
				fetchurl = `${ApiPortSB.GetMessages
					}?MessageTypeID=2&MessageTypeOptionID=0&PageSize=8&PageIndex=${TransferPageInfo.currentIndex * 1 + 1
					}&`;
				break;
			case "Announcement":
				fetchurl = `${ApiPortSB.GetAnnouncements}MessageTypeOptionID=${selItemAnnouncement.id
					}&PageSize=8&PageIndex=${AnnouncementPageInfo.currentIndex * 1 + 1
					}&`;
				break;
			case "Sports":
				this.goNextSportMsg()
				return;
			default:
				return;
		}

		this.setState(
			{
				moreLoading: true,
			},
			() => {
				Toast.loading('加载中,请稍候...', 200);
				fetchRequestSB(fetchurl, "GET")
					.then((res) => {
						Toast.hide();
						if (res && res.isSuccess && res.result) {
							let data =
								type === "Announcement"
									? res.announcementsByMember
									: res.inboxMessagesListItem;
							this.setState((prevState, props) => {
								return {
									[`${type}Data`]: [
										...this.state[[`${type}Data`]],
										...data,
									],
									[`${type}PageInfo`]: {
										...this.state[`${type}PageInfo`],
										currentIndex:
											prevState[`${type}PageInfo`][
											"currentIndex"
											] *
											1 +
											1,
									},
								};
							});
						} else {
							Toast.fail("请求失败！");
						}
					})
					.catch((error) => {
						console.log(error);
					})
					.finally(() => {
						this.setState({
							moreLoading: false,
						});
					});
			}
		);
	};

	goNextSportMsg = () => {
		this.setState({
			SportsPageInfo: {
				...this.state.SportsPageInfo,
				currentIndex:
					this.state.SportsPageInfo[
					"currentIndex"
					] *
					1 +
					1,
			},
		}, () => {
			const { currentShowNotice, currentShowNoticeAll } = this.state;
			const indexOfLastPost = this.state.SportsPageInfo.currentIndex * 8;
			const indexOfFirstPost = indexOfLastPost - 8;
			this.setState({
				currentShowNotice: currentShowNotice.concat(currentShowNoticeAll.slice(indexOfFirstPost, indexOfLastPost)),
			})
		})
	}

	getFetchData = (type) => {
		let { AnnouncementData, TransferData, PersonalData } = this.state;
		let fetchData = {
			actionBy: memberCode,
			timestamp: new Date().toJSON(),
		};
		let tempArr = [];
		// let type = Number(this.state.tabIndex) === 0 ? 'System' : 'Personal';
		if (type === "Announcement") {
			for (let i = 0; i < AnnouncementData.length; i++) {
				if (!AnnouncementData[i].isRead) {
					let tempItem = {};
					tempItem.announcementID =
						AnnouncementData[i].announcementID;
					tempItem.isRead = true;
					tempItem.isOpen = AnnouncementData[i].isOpen;
					tempArr.push(tempItem);
				}
			}
			fetchData.announcementUpdateItem = tempArr;
		} else {
			let datalist = this.state[`${type}Data`];
			for (let i = 0; i < datalist.length; i++) {
				if (!datalist[i].isRead) {
					let tempItem = {};
					tempItem.messageID = datalist[i].messageID;
					tempItem.memberNotificationID =
						datalist[i].memberNotificationID;
					tempItem.isRead = true;
					tempItem.isOpen = datalist[i].isOpen;
					tempArr.push(tempItem);
				}
			}
			fetchData.personalMessageUpdateItem = tempArr;
		}

		return fetchData;
	};

	onClickTabs = (key) => {
		if (key === "2") {
			this.getVendorAnnouncements(this.state.sportsTabType);
		}
	}

	onClickSportsTabs = (key) => {
		this.setState({
			sportsTabType: key,
		});
		this.getVendorAnnouncements(key);
	};

	getTime = item => {
		let times = (new Date(item.replace('T', ' ').replace(/\-/g, '/'))).getTime() + 60 * 60 * 8 * 1000;

		let myDate = new Date(times)
		let y = myDate.getFullYear();
		let m = myDate.getMonth() + 1;
		let d = myDate.getDate();
		let h = myDate.getHours();
		let mi = myDate.getMinutes();

		if (m < 10) { m = '0' + m.toString() }
		if (d < 10) { d = '0' + d.toString() }
		if (h < 10) { h = '0' + h.toString() }
		if (mi < 10) { mi = '0' + mi.toString() }

		return `${y}-${m}-${d} ${h}:${mi}`
	};



	getTitle(type, props) {
		if (type === "Announcement") {
			return props.topic;
		} else if (type === "Transfer") {
			switch (props.memberNotificationCategoryID) {
				case 1:
					return "存款已成功到账";
				case 2:
					return "存款已被拒绝";
				case 3:
					return "取款已成功到账";
				case 4:
					return "取款已被拒绝";
				default:
					return props.title;
			}
		} else {
			return props.title;
		}
	};

	MessageItem(item, type) {
		let imgs = require('../images/news/msgOther.png')
		if (type == 'Personal') {
			imgs = require('../images/news/msgOther.png')
		} else if (type == 'Transfer') {
			if (item.messageTypeOptionID == 3) {
				imgs = require('../images/news/msg3.png')
			} else if (item.messageTypeOptionID == 4) {
				imgs = require('../images/news/msg4.png')
			} else if (item.messageTypeOptionID == 5) {
				imgs = require('../images/news/msg5.png')
			} else {
				imgs = require('../images/news/msg6.png')
			}
		} else if (type == 'Announcement') {
			if (item.newsTemplateCategory == 7) {
				imgs = require('../images/news/Announcement7.png')
			} else if (item.newsTemplateCategory == 8) {
				imgs = require('../images/news/Announcement8.png')
			} else if (item.newsTemplateCategory == 9) {
				imgs = require('../images/news/Announcement9.png')
			} else {
				imgs = require('../images/news/other.png')
			}
		}

		return (
			<Touch onPress={() => { this.goDetail(type, item) }} style={[styles.messageItem, { backgroundColor: item.isRead ? '#e6e6ee' : '#fff' }]}>
				<Image resizeMode='stretch' source={imgs} style={{ width: 40, height: 40 }} />
				<View>
					<View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
						<Text style={{ fontSize: 13, color: '#202939', width: width * 0.45 }} numberOfLines={1}>{this.getTitle(type, item)}</Text>
						<Text style={{ color: '#BCBEC3', fontSize: 11 }}>{item.sendOn != '' ? this.getTime(item.sendOn) : ''}</Text>
					</View>
					<View style={[type == 'Transfer' ? {} : { maxHeight: 23, overflow: 'hidden' }]}>
						<HTMLView
							value={`<div>${item.content}</div>`}
							style={{ width: type != 'Transfer' ? width - 120 : width - 90 }}
							stylesheet={styleHtmls}
						/>
					</View>
				</View>
				{
					type != 'Transfer' &&
					<Image resizeMode='stretch' source={require('../images/iconRight.png')} style={{ width: 30, height: 30 }} />
				}
			</Touch>
		)
	}

	readAllUI(type) {
		return (
			<View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', padding: 15, paddingBottom: 0 }}>
				<Text style={{ color: '#bcbec3', fontSize: 12 }}>只显示90天内的信息</Text>
				<Touch style={
					this.haveUnread(type) ? styles.allRed : styles.noallRed
				}
					onPress={() => { this.doReadAllMessage(type) }}
				>
					<Text style={
						this.haveUnread(type) ? styles.allRedTxt : styles.noallRedTxt
					}>全部已读</Text>
				</Touch>
			</View>
		)
	}

	render() {

		const {
			tabType,
			sportsTabType,
			isShowDetail,
			TransferUnreadCount,
			PersonalUnreadCount,
			AnnouncementUnreadCount,
			PersonalData,
			TransferData,
			AnnouncementData,
			detailData,
			PMATab,
		} = this.state;

		return (

			<View style={{ flex: 1, backgroundColor: '#efeff4' }}>
				<View style={[styles.topNav]}>
					<Touch onPress={() => { Actions.pop() }} style={{ position: 'absolute', left: 15 }}>
						<Image resizeMode='stretch' source={require('../images/icon-white.png')} style={{ width: 30, height: 30 }} />
					</Touch>
					<View style={styles.btnType}>
						<Touch style={[styles.btnList, { backgroundColor: tabType == 1 ? '#fff' : 'transparent' }]} onPress={() => { this.setState({ tabType: 1 }) }}>
							<Text style={[styles.btnTxt, { color: tabType == 1 ? '#00a6ff' : '#BCBEC3' }]}>通知</Text>
							{
								(PersonalUnreadCount > 0 || TransferUnreadCount > 0 || AnnouncementUnreadCount > 0) &&
								<View style={styles.redIcon} />
							}
						</Touch>
						<Touch style={[styles.btnList, { backgroundColor: tabType == 2 ? '#fff' : 'transparent' }]} onPress={() => { this.setState({ tabType: 2 }); PiwikEvent('Announcement', 'View', 'Vendor_Announcement') }}>
							<Text style={[styles.btnTxt, { color: tabType == 2 ? '#00a6ff' : '#BCBEC3' }]}>公告</Text>
						</Touch>
					</View>
					<Touch onPress={() => { LiveChatOpenGlobe(); PiwikEvent('Live Chat', 'Launch', 'Notification_CS') }} style={{ position: 'absolute', right: 15 }}>
						<Image resizeMode='stretch' source={require('../images/cs.png')} style={{ width: 30, height: 30 }} />
					</Touch>
				</View>
				{
					tabType == 1 &&
					<View style={{ flex: 1 }}>
						<View style={styles.magTab}>
							<TouchableOpacity onPress={() => { this.onClickInfoTabs(1) }} style={[styles.magTabList, { borderBottomWidth: PMATab == 1 ? 2 : 0 }]}>
								<Text style={{ color: '#fff' }}>个人 {PersonalUnreadCount}</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => { this.onClickInfoTabs(2) }} style={[styles.magTabList, { borderBottomWidth: PMATab == 2 ? 2 : 0 }]}>
								<Text style={{ color: '#fff' }}>账号 {TransferUnreadCount}</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => { this.onClickInfoTabs(3) }} style={[styles.magTabList, { borderBottomWidth: PMATab == 3 ? 2 : 0 }]}>
								<Text style={{ color: '#fff' }}>一般 {AnnouncementUnreadCount}</Text>
							</TouchableOpacity>
						</View>

						{
							PMATab == 1 &&
							<View style={{ flex: 1 }}>
								<ScrollView
									style={{ flex: 1 }}
									automaticallyAdjustContentInsets={false}
									showsHorizontalScrollIndicator={false}
									showsVerticalScrollIndicator={false}
									ref={el => { this.scrollview = el; }}
								>
									{this.readAllUI('Personal')}
									<View style={{ flex: 1, padding: 15 }}>
										{
											PersonalData != '' &&
											PersonalData.map((item, index) => {
												return (
													<View key={index}>{this.MessageItem(item, 'Personal')}</View>
												)
											})
										}
									</View>
									{this.moreMessage("Personal")}
								</ScrollView>
							</View>
						}
						{
							PMATab == 2 &&
							<View style={{ flex: 1 }}>
								<ScrollView
									style={{ flex: 1 }}
									automaticallyAdjustContentInsets={false}
									showsHorizontalScrollIndicator={false}
									showsVerticalScrollIndicator={false}
									ref={el => { this.scrollview = el; }}
								>
									{this.readAllUI('Transfer')}
									<View style={{ flex: 1, padding: 15 }}>
										{
											TransferData != '' &&
											TransferData.map((item, index) => {
												return (
													<View key={index}>{this.MessageItem(item, 'Transfer')}</View>
												)
											})
										}
									</View>
									{this.moreMessage("Transfer")}
								</ScrollView>
							</View>
						}
						{
							PMATab == 3 &&
							<View style={{ flex: 1 }}>
								<ScrollView
									style={{ flex: 1 }}
									automaticallyAdjustContentInsets={false}
									showsHorizontalScrollIndicator={false}
									showsVerticalScrollIndicator={false}
									ref={el => { this.scrollview = el; }}
								>
									{this.readAllUI('Announcement')}
									<View style={{ flex: 1, padding: 15 }}>
										{
											AnnouncementData != '' &&
											AnnouncementData.map((item, index) => {
												return (
													<View key={index}>{this.MessageItem(item, 'Announcement')}</View>
												)
											})
										}
									</View>
									{this.moreMessage("Announcement")}
								</ScrollView>
							</View>
						}
					</View>
				}
				{
					tabType == 2 &&
					<View style={{ flex: 1 }}>
						<View style={styles.magTab}>
							<TouchableOpacity onPress={() => { this.onClickSportsTabs('IM') }} style={[styles.magTabList, { borderBottomWidth: sportsTabType == 'IM' ? 2 : 0 }]}>
								<Text style={{ color: '#fff' }}>IM</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => { this.onClickSportsTabs('SABA') }} style={[styles.magTabList, { borderBottomWidth: sportsTabType == 'SABA' ? 2 : 0 }]}>
								<Text style={{ color: '#fff' }}>沙巴</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => { this.onClickSportsTabs('BTI') }} style={[styles.magTabList, { borderBottomWidth: sportsTabType == 'BTI' ? 2 : 0 }]}>
								<Text style={{ color: '#fff' }}>BTI</Text>
							</TouchableOpacity>
						</View>
						{
							sportsTabType == 'IM' &&
							<View style={{ flex: 1, padding: 15 }}>

								<ScrollView
									style={{ flex: 1 }}
									automaticallyAdjustContentInsets={false}
									showsHorizontalScrollIndicator={false}
									showsVerticalScrollIndicator={false}
									ref={el => { this.scrollview = el; }}
								>
									<Text style={{ textAlign: 'center', lineHeight: 30, color: '#BCBEC3' }}>只显示30天内的信息</Text>
									{
										this.state.currentShowNotice.length > 0 &&
										this.state.currentShowNotice.map((v, index) => {
											return (
												<View key={index} style={styles.gonggaoList}>
													<Text style={{ paddingBottom: 15, color: '#000' }}>{v.PostingDate}</Text>
													<Text style={{ color: '#999', lineHeight: 20 }}>{v.AnnouncementText}</Text>
												</View>
											)
										})
									}
									{this.moreMessage("Sports")}
								</ScrollView>
							</View>
						}
						{
							sportsTabType == 'SABA' &&
							<View style={{ flex: 1, padding: 15 }}>

								<ScrollView
									style={{ flex: 1 }}
									automaticallyAdjustContentInsets={false}
									showsHorizontalScrollIndicator={false}
									showsVerticalScrollIndicator={false}
									ref={el => { this.scrollview = el; }}
								>
									<Text style={{ textAlign: 'center', lineHeight: 30, color: '#BCBEC3' }}>只显示7天内的信息</Text>
									{
										this.state.currentShowNotice.length > 0 &&
										this.state.currentShowNotice.map((v, index) => {
											return (
												<View key={index} style={styles.gonggaoList}>
													<Text style={{ paddingBottom: 15, color: '#000' }}>{v.PostingDate}</Text>
													<Text style={{ color: '#999', lineHeight: 20 }}>{v.AnnouncementText}</Text>
												</View>
											)
										})
									}
									{this.moreMessage("Sports")}
								</ScrollView>
							</View>
						}
						{
							sportsTabType == 'BTI' &&
							<View style={{ flex: 1, padding: 15 }}>

								<ScrollView
									style={{ flex: 1 }}
									automaticallyAdjustContentInsets={false}
									showsHorizontalScrollIndicator={false}
									showsVerticalScrollIndicator={false}
									ref={el => { this.scrollview = el; }}
								>
									<Text style={{ textAlign: 'center', lineHeight: 30, color: '#BCBEC3' }}>只显示30天内的信息</Text>
									{
										this.state.currentShowNotice.length > 0 &&
										this.state.currentShowNotice.map((v, index) => {
											return (
												<View key={index} style={styles.gonggaoList}>
													<Text style={{ paddingBottom: 15, color: '#000' }}>{v.PostingDate}</Text>
													<Text style={{ color: '#999', lineHeight: 20 }}>{v.AnnouncementText}</Text>
												</View>
											)
										})
									}
									{this.moreMessage("Sports")}
								</ScrollView>
							</View>
						}
					</View>
				}

				{/*客服懸浮球*/}
				{/* <LivechatDragHoliday /> */}

			</View>

		)
	}


}


export default (News);



const styles = StyleSheet.create({
	topNav: {
		width: width,
		height: 50,
		backgroundColor: '#00a6ff',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
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
		width: 110,
		backgroundColor: '#00A6FF',
		borderRadius: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	btnTxt: {
		textAlign: 'center',
		lineHeight: 32,
	},
	redIcon: {
		width: 5,
		height: 5,
		borderRadius: 5,
		backgroundColor: 'red',
		marginLeft: 10,
	},
	magTab: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		height: 35,
		width: width,
		backgroundColor: '#00a6ff',
	},
	magTabList: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 32,
		paddingLeft: 10,
		paddingRight: 10,
		borderBottomColor: '#fff',
		borderBottomWidth: 0,
	},
	messageItem: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 15,
		borderRadius: 8,
		padding: 10,
		backgroundColor: '#fff',
	},
	allRed: {
		width: 85,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#00a6ff',

	},
	noallRed: {
		width: 85,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#bcbec3',

	},
	allRedTxt: {
		color: '#00a6ff',
		lineHeight: 28,
		textAlign: 'center'
	},
	noallRedTxt: {
		color: '#bcbec3',
		lineHeight: 28,
		textAlign: 'center'
	},
	gonggaoList: {
		backgroundColor: '#fff',
		borderRadius: 10,
		marginBottom: 15,
		padding: 15
	},
});

const styleHtmls = StyleSheet.create({
	div: {
		fontSize: 12,
		lineHeight: 22,
	},
})










