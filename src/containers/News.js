import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Toast } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import HTMLView from "react-native-htmlview";
import ModalDropdown from "react-native-modal-dropdown";

const { width, height } = Dimensions.get("window");

const newSelsctDate = [
  { name: "全部", key: 0 },
  { name: "个人", key: 1 },
  { name: "产品", key: 8 },
  { name: "优惠", key: 9 },
  { name: "其它", key: 10 },
];

const newSelsctDate3 = [
  { name: "全部", key: 0 },
  { name: "存款", key: 3 },
  { name: "转账", key: 4 },
  { name: "提款", key: 5 },
  { name: "红利", key: 6 },
];

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabType: 1, // 1.通知 2.公告
      PMATab: 2, // 1.Personal 2.Transfer
      // 公告
      AnnouncementData: "",
      AnnouncementUnreadCount: 0,
      // 通知
      TransferData: "", //交易
      PersonalData: "", //个人
      PersonalUnreadCount: 0,
      TransferUnreadCount: 0,
      moreLoading: false,
      readAllPopup: false,

      inboxMessagesKey: 0, //通知==》交易选择key
      announcementsKey: 0, //公告key

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
    };
  }

  componentWillMount(props) {
    if (ApiPort.UserLogin == true) {
      this.initData();
    }
  }
  componentWillUnmount() {
    window.GetMessageCounts && window.GetMessageCounts();
  }

  initData = () => {
    console.log("init");
    Toast.loading("加载中,请稍候...", 200);
    let processed = [
      this.GetAnnouncementData(),
      this.GetTransferData(),
      this.GetPersonalData(),
    ];
    Promise.all(processed)
      .then((res) => {
        console.log(res);
        if (res) {
          Toast.hide();
        }
      })
      .catch((error) => {
        console.log(error);
        Toast.hide();
      });
  };

  GetAnnouncementData = (val) => {
    let { announcementsKey } = this.state;
    let key = val || announcementsKey;
    let fetchurl = `${ApiPort.GetAnnouncements}MessageTypeOptionID=${key}&PageSize=8&PageIndex=1&`;
    return fetchRequest(fetchurl, "GET").then((res) =>
      this.SetNews("Announcement", res.result)
    );
  };

  GetTransferData = (val) => {
    let { inboxMessagesKey } = this.state;
    let key = val || inboxMessagesKey;
    let fetchurl =
      ApiPort.GetMessages +
      `?MessageTypeID=2&MessageTypeOptionID=${key}&PageSize=8&PageIndex=1&`;
    return fetchRequest(fetchurl, "GET").then((res) =>
      this.SetNews("Transfer", res.result)
    );
  };

  GetPersonalData = () => {
    let fetchurl =
      ApiPort.GetMessages +
      "?MessageTypeID=1&MessageTypeOptionID=0&PageSize=8&PageIndex=1&";
    return fetchRequest(fetchurl, "GET").then((res) =>
      this.SetNews("Personal", res.result)
    );
  };

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

  goDetail = (type, data) => {
    console.log(data);
    console.log('goDetail')
    !data.isRead && this[`Update${type}Data`](data);
    this.getDetail(type, data);
    return;
  };

  getDetail = (type, data) => {
    console.log(type)
    console.log(data)
    if (parseInt(data.messageID) === 0) {
      Actions.NewsDetail({ data: data, megType: type });
      return;
      //[個人]有可能包含帳戶信息(MessageID===0)，但是會沒有detail可查，直接使用當前數據展示
    }
    let fetchurl = "";
    if (type === "Announcement") {
      fetchurl =
        ApiPort.GetAnnouncementDetail +
        "?AnnouncementID=" +
        data.announcementID +
        "&";
    } else {
      fetchurl =
        ApiPort.GetMessageDetail + "?MessageID=" + data.messageID + "&";
    }
    Toast.loading("加载中,请稍候...", 200);
    fetchRequest(fetchurl, "GET")
      .then((data) => {
        Toast.hide();
        if (data && data.result) {
          let res = data.result;
          let detail =
            type == "Announcement"
              ? res.announcementResponse
              : res.personalMessage;

          let dataList = {
            type,
            detail,
          };
          Actions.NewsDetail({ data: detail, megType: type });
        }
      })
      .catch((error) => {
        Toast.hide();
      })
      .finally(() => {
        Toast.hide();
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
    const siteId = Platform.OS === "android" ? 39 : 40;
    let fetchstring = type === "Announcement" ? "Announcement" : "Message";
    const url = ApiPort[`Update${fetchstring}`];
    Toast.loading("请稍候...", 200);
    fetchRequest(`${url}siteId=${siteId}&`, "PATCH", fetchData)
      .then((res) => {
        Toast.hide();
        if (res && res.result) {
          if (isSingle) {
            let tempArr = this.state[`${type}Data`];
            let index = tempArr.findIndex((item) => {
              if (type === "Announcement") {
                return data.announcementID === item.announcementID;
              } else {
                return data.memberNotificationID === item.memberNotificationID;
              }
            });
            tempArr[index].isRead = true;
            this.setState({
              [`${type}Data`]: tempArr,
              [`${type}UnreadCount`]: this.state[`${type}UnreadCount`] - 1,
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
    console.log('getSingleFetchData')
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
      readAll: false,
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

  getType = () => {
    return this.state.tabType == 2 ? "Announcement" : this.state.PMATab == 1 ? "Transfer" : "Personal";
  }

  doReadAllMessage = () => {
    const type = this.getType()
    console.log('type ', type)
    let fetchData = {
      actionBy: memberCode,
      readAll: true,
      timestamp: new Date().toJSON(),
    };
    this.update(type, fetchData);
    PiwikEvent("Notification", "View", "Notification_readAll");
  };

  onClickInfoTabs = (key) => {
    if (key == 1) PiwikEvent("Notification", "View", "Notification_personal");
    if (key == 2) PiwikEvent("Notification", "View", "Notification_account");
    if (key == 3) PiwikEvent("Notification", "View", "Notification_generals");

    this.setState({
      PMATab: key,
      inboxMessagesKey: 0,
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
          <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
            <View style={{ backgroundColor: '#D2D0D0', height: 1, flex: 1, alignSelf: 'center' }} />
            <Text style={{ alignSelf: 'center', paddingHorizontal: 17, color: "#999999", textAlign: "center", fontSize: 12 }}>
              没有更多消息了！
            </Text>
            <View style={{ backgroundColor: '#D2D0D0', height: 1, flex: 1, alignSelf: 'center' }} />
          </View>
        ) : (
          <Touch onPress={() => this.getNextPage(type)}>
            <Text
              style={{
                color: "#00a6ff",
                textAlign: "center",
                fontSize: 12,
                paddingBottom: 25,
              }}
            >
              点击显示更多信息
            </Text>
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
      announcementsKey,
      inboxMessagesKey
    } = this.state;
    console.log(this.state)
    if (this.isLastPage(type)) return;

    switch (type) {
      case "Personal":
        fetchurl = `${ApiPort.GetMessages
          }?MessageTypeID=1&MessageTypeOptionID=${inboxMessagesKey}&PageSize=8&PageIndex=${PersonalPageInfo.currentIndex * 1 + 1
          }&`;
        break;
      case "Transfer":
        fetchurl = `${ApiPort.GetMessages
          }?MessageTypeID=2&MessageTypeOptionID=0&PageSize=8&PageIndex=${TransferPageInfo.currentIndex * 1 + 1
          }&`;
        break;
      case "Announcement":
        fetchurl = `${ApiPort.GetAnnouncements}MessageTypeOptionID=${announcementsKey
          }&PageSize=8&PageIndex=${AnnouncementPageInfo.currentIndex * 1 + 1}&`;
        break;
      default:
        return;
    }

    this.setState(
      {
        moreLoading: true,
      },
      () => {
        Toast.loading("加载中,请稍候...", 200);
        fetchRequest(fetchurl, "GET")
          .then((result) => {
            Toast.hide();
            if (result) {
              let res = result.result;
              let data =
                type === "Announcement"
                  ? res.announcementsByMember
                  : res.inboxMessagesListItem;
              this.setState((prevState, props) => {
                return {
                  [`${type}Data`]: [...this.state[[`${type}Data`]], ...data],
                  [`${type}PageInfo`]: {
                    ...this.state[`${type}PageInfo`],
                    currentIndex:
                      prevState[`${type}PageInfo`]["currentIndex"] * 1 + 1,
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

  getTime = (item) => {
    let times =
      new Date(item.replace("T", " ").replace(/\-/g, "/")).getTime() +
      60 * 60 * 8 * 1000;

    let myDate = new Date(times);
    let y = myDate.getFullYear();
    let m = myDate.getMonth() + 1;
    let d = myDate.getDate();
    let h = myDate.getHours();
    let mi = myDate.getMinutes();

    if (m < 10) {
      m = "0" + m.toString();
    }
    if (d < 10) {
      d = "0" + d.toString();
    }
    if (h < 10) {
      h = "0" + h.toString();
    }
    if (mi < 10) {
      mi = "0" + mi.toString();
    }

    return `${y}/${m}/${d} ${h}:${mi}`;
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
  }

  MessageItem(item, type) {
    // 3  '[存款]'
    // 4  '[转账]'
    // 5  '[提现]'
    // 6 '[红利]'
    let imgs = require("../images/news/msgOther.png");
    if (type == "Personal") {
      imgs = require("../images/news/msgOther.png");
    } else if (type == "Transfer") {
      if (item.messageTypeOptionID == 3) {
        imgs = require("../images/news/msg3.png");
      } else if (item.messageTypeOptionID == 4) {
        imgs = require("../images/news/msg4.png");
      } else if (item.messageTypeOptionID == 5) {
        imgs = require("../images/news/msg5.png");
      } else {
        imgs = require("../images/news/msg6.png");
      }
    } else if (type == "Announcement") {
      if (item.newsTemplateCategory == 7) {
        imgs = require("../images/news/Announcement7.png");
      } else if (item.newsTemplateCategory == 8) {
        imgs = require("../images/news/Announcement8.png");
      } else if (item.newsTemplateCategory == 9) {
        imgs = require("../images/news/Announcement9.png");
      } else {
        imgs = require("../images/news/other.png");
      }
    }

    let titleCat = ""
    if (type == "Announcement") {
      if (item.newsTemplateCategory == 7) {
        titleCat = "[个人]"
      } else if (item.newsTemplateCategory == 8) {
        titleCat = "[产品]"
      } else if (item.newsTemplateCategory == 9) {
        titleCat = "[优惠]";
      } else {
        titleCat = "[其他]";
      }
    }

    return (
      <Touch
        onPress={() => {
          this.goDetail(type, item);
        }}
        style={[styles.messageItem, { backgroundColor: "#fff" }]}
      >
        <View style={{ position: "relative" }}>
          <Image
            resizeMode="stretch"
            source={imgs}
            style={{ width: 40, height: 40 }}
          />
          {!item.isRead && (
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 12 / 2,
                backgroundColor: "#F53D3D",
                borderColor: "#fff",
                borderWidth: 2,
                position: "absolute",
                right: 0,
                top: 0,
              }}
            />
          )}
        </View>
        <View style={{ paddingLeft: 0 }}>
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{ fontSize: 13, color: "#202939", width: width * 0.45 }}
              numberOfLines={1}
            >
              {titleCat !== "" && (
                <Text style={{ color: "#78909C", fontSize: 12 }}>{titleCat}</Text>
              )} {this.getTitle(type, item)}
            </Text>
            <Text style={{ color: "#BCBEC3", fontSize: 11 }}>
              {item.sendOn != "" ? this.getTime(item.sendOn) : ""}
            </Text>
          </View>
          <View
            style={[
              type == "Transfer" ? {} : { maxHeight: 23, overflow: "hidden" },
            ]}
          >
            <HTMLView
              value={`<div>${item.content}</div>`}
              style={{ width: width - 120 }}
              stylesheet={styleHtmls}
            />
          </View>
        </View>
      </Touch>
    );
  }

  _dropdown_renderButtonText(rowData) {
    return `${rowData.name}`;
  }

  _dropdown_1_renderRow(rowData, rowID, highlighted) {
    return (
      <View
        style={{
          width: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 40,
          backgroundColor: "#fff",
          borderBottomColor: "#0000000A",
          borderBottomWidth: 1,
        }}
      >
        <Text
          style={{ color: highlighted ? "#00a6ff" : "#6B6B6B", fontSize: 12, marginRight: 15, }}
        >{`${rowData.name}`}</Text>
      </View>
    );
  }

  readAllUI(type) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          padding: 15,
          paddingBottom: 0,
        }}
      >
        {this.state.tabType == 1 && this.state.PMATab == 1 && (
          <View
            style={{ display: "flex", alignItems: "flex-end", marginLeft: 15 }}
          >
            <View style={styles.selectWrap}>
              <ModalDropdown
                ref={(el) => (this._dropdown_3 = el)}
                defaultValue={
                  newSelsctDate3[
                    newSelsctDate3.findIndex(
                      (v) => v.key === this.state.inboxMessagesKey
                    ) || 0
                  ].name
                }
                // defaultIndex={0}
                textStyle={styles.dropdown_D_text}
                dropdownStyle={styles.dropdown_state_dropdown}
                options={newSelsctDate3}
                renderButtonText={(rowData) =>
                  this._dropdown_renderButtonText(rowData)
                }
                renderRow={this._dropdown_1_renderRow.bind(this)}
                onSelect={this.MessageTypeO}
                style={{ zIndex: 10, width: 100, }}
              />
              <Image
                resizeMode="stretch"
                source={require("@/images/icon/dropdown.png")}
                style={{
                  width: 16,
                  height: 16,
                  position: "absolute",
                  right: 30,
                }}
              />
            </View>
          </View>
        )}

        {this.state.tabType == 2 && (
          <View
            style={{ display: "flex", alignItems: "flex-end", marginLeft: 15 }}
          >
            <View style={styles.selectWrap}>
              <ModalDropdown
                ref={(el) => (this._dropdown_3 = el)}
                defaultValue={
                  newSelsctDate[
                    newSelsctDate.findIndex(
                      (v) => v.key === this.state.announcementsKey
                    ) || 0
                  ].name
                }
                // defaultIndex={0}
                textStyle={styles.dropdown_D_text}
                dropdownStyle={styles.dropdown_state_dropdown}
                options={newSelsctDate}
                renderButtonText={(rowData) =>
                  this._dropdown_renderButtonText(rowData)
                }
                renderRow={this._dropdown_1_renderRow.bind(this)}
                onSelect={this.newActive}
                style={{ zIndex: 10, width: 100 }}
              />
              <Image
                resizeMode="stretch"
                source={require("@/images/icon/dropdown.png")}
                style={{
                  width: 16,
                  height: 16,
                  position: "absolute",
                  right: 30,
                }}
              />
            </View>
          </View>
        )}


        {/* 個人沒有分類 排版佔位用 */}
        {this.state.PMATab == 2 && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 30,
              width: 90,
            }}
          />
        )}

        <Touch
          style={styles.allRed}
          onPress={() => {
            this.setState({
              readAllPopup: true
            });
          }}
        >
          <Text style={styles.allRedTxt}>标示全部已读</Text>
        </Touch>
      </View>
    );
  }

  // 公告選擇分類
  newActive = (key) => {
    key == 0 && PiwikEvent("All_sorting_announcement");
    key == 1 && PiwikEvent("Bank_sorting_announcement");
    key == 2 && PiwikEvent("Product_sorting_announcement");
    key == 3 && PiwikEvent("Promotion_sorting_announcement");
    key == 4 && PiwikEvent("Other_sorting_announcement");
    let announcementsKey = newSelsctDate[key].key;
    this.setState({ announcementsKey }, async () => {
      // this.activeLength();
      Toast.loading("加载中,请稍候...");
      let getAnnouncement = await this.GetAnnouncementData(announcementsKey);
      Toast.hide();
    });
  };

  //通知選擇分類
  MessageTypeO = (key) => {
    key == 0 && PiwikEvent("All_sorting_transaction");
    key == 1 && PiwikEvent("Deposit_sorting_transaction");
    key == 2 && PiwikEvent("Transfer_sorting_transaction");
    key == 3 && PiwikEvent("Withdrawal_sorting_transaction");
    key == 4 && PiwikEvent("Bonus_sorting_transaction");

    let inboxMessagesKey = newSelsctDate3[key].key;
    console.log(inboxMessagesKey);

    this.setState({ inboxMessagesKey }, async () => {
      // this.activeLength();
      Toast.loading("加载中,请稍候...");
      let getTrans = await this.GetTransferData(inboxMessagesKey);
      Toast.hide();
    });
  };

  //不显示标记已读按钮
  activeLength() {
    let activeLength = 1;
    const st = this.state;
    console.log(st);
    return;

    if (st.Nowatype == "通知") {
      activeLength =
        (st.InboxMessagesListItem != "暂无数据" &&
          st.InboxMessagesListItem.filter((item) => {
            return (
              item.MessageTypeOptionID == st.inboxMessagesKey ||
              st.inboxMessagesKey == 0
            );
          }).length) ||
        0;
    } else {
      activeLength =
        (st.Announcements != "暂无数据" &&
          st.Announcements.filter((item) => {
            return (
              item.NewsTemplateCategory == st.AnnouncementsKey ||
              st.AnnouncementsKey == 0
            );
          }).length) ||
        0;
    }
    this.setState({ activeLength });
  }


  render() {
    const {
      tabType,
      TransferUnreadCount,
      PersonalUnreadCount,
      AnnouncementUnreadCount,
      PersonalData,
      TransferData,
      AnnouncementData,
      PMATab,
      readAllPopup
    } = this.state;
    console.log(this.state)
    return (
      <View style={{ flex: 1, backgroundColor: "#efeff4" }}>
        <Modal
          animationType="none"
          transparent={true}
          visible={readAllPopup}
          onRequestClose={() => { }}
        >
          <View style={styles.modalMaster}>
            <View style={styles.modalView}>
              <View style={styles.modalTitle}>
                <Text style={styles.modalTitleTxt}>标示为已读</Text>
              </View>
              <Text style={{ marginVertical: 24, textAlign: 'center', color: '#000' }}>确认要将所有信息标示为已读吗 ？</Text>
              <View style={styles.modalBtn}>
                <Touch onPress={() => {
                  this.setState({ readAllPopup: false });
                }} style={styles.modalBtnL}>
                  <Text style={{ color: '#00A6FF' }}>取消</Text>
                </Touch>
                <Touch onPress={() => {
                  this.setState({
                    readAllPopup: false
                  }, () => {
                    this.doReadAllMessage();
                  });
                }} style={styles.modalBtnR}>
                  <Text style={{ color: '#fff' }}>已读</Text>
                </Touch>
              </View>
            </View>
          </View>
        </Modal>
        <View style={[styles.topNav]}>
          <Touch
            onPress={() => {
              Actions.pop();
            }}
            style={{ position: "absolute", left: 12, bottom: 18 }}
          >
            <Image
              resizeMode="stretch"
              source={require("@/images/icon/iconWhite.png")}
              style={{ width: 22, height: 22 }}
            />
            {/* <View style={styles.arrow} /> */}
          </Touch>
          <View style={styles.btnType}>
            <Touch
              style={[
                styles.btnList,
                { backgroundColor: tabType == 1 ? "#fff" : "transparent" },
              ]}
              onPress={() => {
                this.setState({ tabType: 1 });
              }}
            >
              <Text
                style={[
                  styles.btnTxt,
                  { color: tabType == 1 ? "#00a6ff" : "#CCEDFF" },
                ]}
              >
                通知
              </Text>
              {(PersonalUnreadCount > 0 ||
                TransferUnreadCount > 0) && <View style={styles.redIcon} />}
            </Touch>
            <Touch
              style={[
                styles.btnList,
                { backgroundColor: tabType == 2 ? "#fff" : "transparent" },
              ]}
              onPress={() => {
                this.setState({ tabType: 2 });
                PiwikEvent("Announcement", "View", "Vendor_Announcement");
              }}
            >
              <Text
                style={[
                  styles.btnTxt,
                  { color: tabType == 2 ? "#00a6ff" : "#CCEDFF" },
                ]}
              >
                公告
              </Text>
              {(AnnouncementUnreadCount > 0) && <View style={styles.redIcon} />}
            </Touch>
          </View>
          <Touch
            onPress={() => {
              LiveChatOpenGlobe();
              PiwikEvent("Live Chat", "Launch", "Notification_CS");
            }}
            style={{ position: "absolute", right: 15 }}
          >
            <Image
              resizeMode="stretch"
              source={require("../images/cs.png")}
              style={{ width: 30, height: 30 }}
            />
          </Touch>
        </View>
        {tabType == 1 && (
          <View style={{ flex: 1 }}>
            <View style={styles.magTab}>
              <TouchableOpacity
                onPress={() => {
                  this.onClickInfoTabs(1);
                }}
                style={[
                  styles.magTabList,
                  { borderBottomWidth: PMATab == 1 ? 2 : 0 },
                ]}
              >
                <Text style={{ color: PMATab == 1 ? "#fff" : '#B4E4FE', fontWeight: PMATab == 1 ? 'bold' : 'normal' }}>
                  交易
                </Text>
                <Text style={{ color: PMATab == 1 ? "#fff" : '#B4E4FE', position: 'absolute', top: 0, right: -20 }}>
                  [{TransferUnreadCount}]
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.onClickInfoTabs(2);
                }}
                style={[
                  styles.magTabList,
                  { borderBottomWidth: PMATab == 2 ? 2 : 0 },
                ]}
              >
                <Text style={{ color: PMATab == 2 ? "#fff" : '#B4E4FE', fontWeight: PMATab == 2 ? 'bold' : 'normal' }}>
                  个人
                </Text>
                <Text style={{ color: PMATab == 2 ? "#fff" : '#B4E4FE', position: 'absolute', top: 0, right: -20 }}>
                  [{PersonalUnreadCount}]
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={() => {
                  this.onClickInfoTabs(3);
                }}
                style={[
                  styles.magTabList,
                  { borderBottomWidth: PMATab == 3 ? 2 : 0 },
                ]}
              >
                <Text style={{ color: "#fff" }}>
                  一般 {AnnouncementUnreadCount}
                </Text>
              </TouchableOpacity> */}
            </View>

            {PMATab == 2 && (
              <View style={{ flex: 1 }}>
                <ScrollView
                  style={{ flex: 1 }}
                  automaticallyAdjustContentInsets={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  ref={(el) => {
                    this.scrollview = el;
                  }}
                >
                  {this.readAllUI("Personal")}
                  <View style={{ flex: 1, padding: 15 }}>
                    {PersonalData != "" &&
                      PersonalData.map((item, index) => {
                        return (
                          <View key={index}>
                            {this.MessageItem(item, "Personal")}
                          </View>
                        );
                      })}
                  </View>
                  {this.moreMessage("Personal")}
                </ScrollView>
              </View>
            )}
            {PMATab == 1 && (
              <View style={{ flex: 1 }}>
                <ScrollView
                  style={{ flex: 1 }}
                  automaticallyAdjustContentInsets={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  ref={(el) => {
                    this.scrollview = el;
                  }}
                >
                  {this.readAllUI("Transfer")}
                  <View style={{ flex: 1, padding: 15 }}>
                    {TransferData != "" &&
                      TransferData.map((item, index) => {
                        return (
                          <View key={index}>
                            {this.MessageItem(item, "Transfer")}
                          </View>
                        );
                      })}
                  </View>
                  {this.moreMessage("Transfer")}
                </ScrollView>
              </View>
            )}
          </View>
        )}
        {tabType == 2 && (
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1, marginBottom: 55 }}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ref={(el) => {
                this.scrollview = el;
              }}
            >
              {this.readAllUI("Announcement")}
              <View style={{ flex: 1, padding: 15 }}>
                {AnnouncementData != "" &&
                  AnnouncementData.map((item, index) => {
                    return (
                      <View key={index}>
                        {this.MessageItem(item, "Announcement")}
                      </View>
                    );
                  })}
              </View>
              {this.moreMessage("Announcement")}
            </ScrollView>
          </View>
        )}

        {/*客服懸浮球*/}
        {/* <LivechatDragHoliday /> */}
      </View>
    );
  }
}

export default News;

const styles = StyleSheet.create({
  topNav: {
    width: width,
    height: 50,
    backgroundColor: "#00a6ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btnType: {
    backgroundColor: "#7676801F",
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btnList: {
    width: 110,
    backgroundColor: "#00A6FF",
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btnTxt: {
    textAlign: "center",
    lineHeight: 32,
  },
  redIcon: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "red",
    marginLeft: 10,
  },
  magTab: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    height: 35,
    width: width,
    backgroundColor: "#00a6ff",
  },
  magTabList: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomColor: "#fff",
    borderBottomWidth: 0,
  },
  messageItem: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  allRed: {
    width: 102,
    borderRadius: 20,
    height: 27,
    backgroundColor: "#0000000A",
  },
  noallRed: {
    width: 102,
    height: 27,
    borderRadius: 20,
    backgroundColor: "#bcbec3",
  },
  allRedTxt: {
    color: "#666666",
    lineHeight: 28,
    textAlign: "center",
    fontSize: 12,
  },
  noallRedTxt: {
    color: "#bcbec3",
    lineHeight: 28,
    textAlign: "center",
    fontSize: 12,
  },
  gonggaoList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
  },
  dropdown_D_text: {
    paddingBottom: 3,
    fontSize: 12,
    color: "#666666",
    textAlignVertical: "center",
    paddingVertical: 5,
    textAlign: "center",
    paddingRight: 20,
  },
  dropdown_state_dropdown: {
    height: 206,
    borderRadius: 5,
    overflow: 'hidden',
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.6,
    // shadowRadius: 5,
    // shadowColor: "#666",
    // elevation: 4,
    // backgroundColor: "#0000000A",
    marginTop: 5,
  },
  selectWrap: {
    justifyContent: "center",
    alignItems: "center",
    height: 27,
    width: 100,
    backgroundColor: "#0000000A",
    borderRadius: 20,
  },
  modalMaster: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0,0.5)',
  },
  modalView: {
    width: width * 0.9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingBottom: 15,
  },
  modalTitle: {
    width: width * 0.9,
    backgroundColor: '#00A6FF',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  modalTitleTxt: {
    lineHeight: 40,
    textAlign: 'center',
    color: '#fff',
  },
  modalBtn: {
    width: width * 0.9,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalBtnL: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00A6FF',
    width: width * 0.35,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnR: {
    borderRadius: 5,
    backgroundColor: '#00A6FF',
    width: width * 0.35,
    height: 42,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  add: {
    width: width - 30,
    borderWidth: 1,
    borderColor: '#00A6FF',
    borderRadius: 10,
  },
  subminBtn: {
    width: width - 30,
    backgroundColor: '#00A6FF',
    borderRadius: 10,
  },
  arrow: {
    borderTopWidth: 0,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderLeftWidth: 0,
    padding: 6.5,
    transform: [{ rotate: '133deg' }],
    borderColor: '#fff',
    position: 'absolute',
    // bottom: 5,
    // right: 10,
    zIndex: 100,
  },
});

const styleHtmls = StyleSheet.create({
  div: {
    fontSize: 12,
    lineHeight: 22,
  },
});
