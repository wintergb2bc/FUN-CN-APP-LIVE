import React from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Progress, Toast } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
import Carousel, { Pagination } from "react-native-snap-carousel";
import NavigationUtil from "../../lib/utils/NavigationUtil";
import TestFunctions from "../TestFunctions";
import BannerAction from "../../lib/utils/banner";
import PiwikAction from "../../lib/utils/piwik";
import CsCallIcon from '@/containers/csCall/CsCallIcon'

const { width, height } = Dimensions.get("window");

// let bannerData = [
//   { cmsImageUrl: require("../images/user/banner1.png") },
//   { cmsImageUrl: require("../images/user/banner2.png") },
//   { cmsImageUrl: require("../images/user/banner3.png") },
// ];
const bannerWidth = width - 33;
const bannerHeight = width * 0.20;

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faceLogin: false,
      bannerData: [],
      bannerIndex: 0,
      refreshing: false,
      TotalMoney: 0,

      // 驗證相關
      percent: 0, // 驗證進度條
      securityLevel: "低",
      securityBarShow: true,

      aboutList: "",
      showUnionPage: false,

      QueleaActiveCampaign: "", //推薦好友
      isRecommend: false,

      unreadCount: 0,
    };
  }

  componentWillMount(props) {
    if (window.ApiPort.UserLogin) {
      // this.getBanner()
      this.getInitData();

      Platform.OS == "ios" && this.getFastLogin();
    }
    this.getInitNotLogin();
  }

  getInitData = (bal = false) => {
    this.TotalBal(bal);
    this.getBannerProfile();
    this.getMemberInfo();
    this.getMessageCount();
  }

  getInitNotLogin = () => {
    this.getAbout();
    this.getFaq();
    //获取推荐好友彩金详情和开始时间
    this.QueleaActiveCampaign();
  }

  //获取用户信息
  getMemberInfo() {
    console.log("getMemberInfo");
    if (Object.keys(this.props.userInfo.memberInfo).length !== 0) {
      this.checkVerifyState();
    } else {
      console.log("缺少memberInfo");
    }
  }

  //提前获取，获取推荐好友彩金详情和开始时间
  QueleaActiveCampaign() {
    fetchRequest(ApiPort.QueleaActiveCampaign, "GET")
      .then((res) => {
        if (res.isSuccess) {
          this.setState({ QueleaActiveCampaign: res });
          storage.save({
            key: "QueleaActiveCampaign",
            id: "QueleaActiveCampaign",
            data: res,
            expires: 1000 * 1200 * 24,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  goRecommend = () => {
    const activeCampaign = this.state.QueleaActiveCampaign;
    //没用获取到彩金详情和开始时间
    if (!activeCampaign) {
      Toast.loading("加载中，请稍后重试", 3);
      this.QueleaActiveCampaign();
      return;
    }

    //表示活动没开始
    if (!activeCampaign.isSuccess) {
      this.setState({ isRecommend: true });
      return;
    }

    //未登录进入活动页面
    if (ApiPort.UserLogin == false) {
      Actions.Recommend();
      return;
    }

    //获取推荐人的信息,判断是否加入过，跳转不同页面
    this.QueleaReferrerInfo();
  };

  //获取推荐人的信息
  QueleaReferrerInfo() {
    Toast.loading("加载中，请稍等...", 200);
    fetchRequest(ApiPort.QueleaReferrerInfo, "GET")
      .then((res) => {
        Toast.hide();
        if (res) {
          if (res.result && res.result.queleaUrl) {
            //进入进度页面
            Actions.RecommendPage({ QueleaReferrerInfo: res.result });
          } else {
            //进入活动页面
            Actions.Recommend();
          }
        }
      })
      .catch((error) => {
        Toast.hide();
        console.log(error);
      });
  }


  /**
   檢查驗證狀態，判斷是否顯示驗證框
   * data {number} 會員資料
   * passedAllVerify {Boolean} 剛通過三個驗證
   */
  checkVerifyState = (data, passedAllVerify = false) => {
    console.log('checkVerifyState')
    let val = data || this.props.userInfo.memberInfo;
    // 電話驗證
    let phoneData = val.contacts.find(
      (v) => v.contactType.toLocaleLowerCase() === "phone"
    );
    let phoneStatus = phoneData
      ? phoneData.status.toLocaleLowerCase() === "verified"
      : false;

    // email驗證
    let emailData = val.contacts.find(
      (v) => v.contactType.toLocaleLowerCase() === "email"
    );
    let emailStatus = emailData
      ? emailData.status.toLocaleLowerCase() === "verified"
      : false;

    // 姓名驗證
    let IdentityCardStatus = !!val.firstName;

    let percentNum = 0;
    let securityString = "低";
    let forCount = [phoneStatus, emailStatus, IdentityCardStatus];
    let countVerified = forCount.filter((v) => v === true).length;

    if (countVerified === 3) {
      percentNum = 100;
      securityString = "高";
    } else if (countVerified === 0 || countVerified === 1) {
      securityString = "低";
      percentNum = 33;
    } else if (countVerified === 2) {
      securityString = "中";
      percentNum = 66;
    }

    if (percentNum === 100) {
      // 只有剛通過三個驗證時要顯示驗證框
      if (passedAllVerify) {
        this.setState({
          securityBarShow: true,
        });
      } else {
        this.setState({
          securityBarShow: false,
        });
      }
    }

    this.setState({
      percent: percentNum,
      securityLevel: securityString,
    });
  };

  getBannerProfile() {
    //先获取缓存
    storage
      .load({
        key: "getBannerProfile",
        id: "getBannerProfile",
      })
      .then((data) => {
        this.setState({
          bannerData: data,
        });
      });
    fetch(`${CMS_Domain + ApiPort.CMS_BannerProfile}`, {
      method: "GET",
      headers: {
        token: CMS_token,
      },
    })
      .then((response) => (headerData = response.json()))
      .then((data) => {
        if (data) {
          // PiwikEvent('CMS_home_feature' + ((new Date()).getTime() - times - 600))
          // PiwikEvent("CMS_home_feature");
          this.setState({
            bannerData: data,
          });
          storage.save({
            key: "getBannerProfile",
            id: "getBannerProfile",
            data: data,
            expires: null,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getFastLogin() {
    //ios获取快速登录方式
    let fastLoginKey = "fastLogin" + userNameDB.toLowerCase();
    let sfastLoginId = "fastLogin" + userNameDB.toLowerCase();
    global.storage
      .load({
        key: fastLoginKey,
        id: sfastLoginId,
      })
      .then((ret) => {
        this.setState({ faceLogin: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setFastLogin() {
    if (!window.ApiPort.UserLogin) {
      Actions.Login();
      return;
    }
    if (this.state.faceLogin) {
      //关闭脸部识别
      Alert.alert(
        "提醒你",
        `您已经认证过${DeviceInfoIos ? "脸部辨识" : "指纹辨识"
        }，\n可用于下次登入采用${DeviceInfoIos ? "脸部辨识" : "指纹辨识"}。`,
        [
          {
            text: "确认",
          },
          // {
          // 	text: '确认', onPress: () => {
          // 		this.setState({faceLogin: false})
          // 		const username = userNameDB.toLowerCase();
          // 		let fastLogin = "fastLogin" + username;
          // 		let sfastLogin = "fastLogin" + username;
          // 		global.storage.remove({
          // 			key: fastLogin,
          // 			id: sfastLogin
          // 		});
          // 	}
          // },
        ]
      );
      return;
    }

    if (Platform.OS == "ios") {
      //直接去指纹脸部识别设置
      Actions.LoginTouch({
        username: userNameDB.toLowerCase(),
        fastChange: true,
        changeBack: () => {
          this.setState({ faceLogin: true });
        },
      });
    } else {
      //去设定界面
      Actions.SetLogin({ username: userNameDB.toLowerCase() });
    }
  }

  getBanner() {
    fetchRequest(
      window.ApiPort.Banner +
      `pageType=main&isLogin=${window.ApiPort.UserLogin}&playerPreference=${window.ApiPort.UserLogin ? "Member" : "Member"
      }&`,
      "GET"
    )
      .then((data) => {
        Toast.hide();
        this.setState({
          bannerData: data.result,
        });
      })
      .catch((err) => {
        Toast.hide();
        this.setState({
          refreshing: false,
        });
        console.log(err);
      });
  }

  //获取vip,关于我们的内容
  getAbout() {
    fetch(CMS_Domain + ApiPort.CMS_About, {
      method: "GET",
      headers: { token: CMS_token },
    })
      .then((response) => (headerData = response.json()))
      .then((data) => {
        if (data) {
          this.setAbout(data);
          storage.save({
            key: "getAbout",
            id: "getAbout",
            data: data,
            expires: null,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getFaq() {
    fetch(CMS_Domain + ApiPort.CMS_HelpCenter, {
      method: "GET",
      headers: { token: CMS_token },
    })
      .then((response) => (headerData = response.json()))
      .then((data) => {
        if (data) {
          storage.save({
            key: "FAQData",
            id: "FAQData",
            data: data,
            expires: null,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setAbout(data) {
    let aboutList = [];
    if (window.isStaging) {
      aboutList = data.filter((item) => {
        return item.title != "关于兑换记录";
      });
    } else {
      const Arr = ["8934", "8938", "8983", "8939", "11996", "12156", "12319"];
      aboutList = data.filter((item) => {
        return Arr.includes(item.id);
        // item.id === '8934' || item.id === '8938' || item.id === '8983' || item.id === '8939' || item.id === '11996' || item.id === '12156'
      });
    }

    this.setState({ aboutList });
  }

  //获取所以账户
  TotalBal(flag) {
    if (flag) {
      this.setState({
        refreshing: true,
      });
    }
    fetchRequest(window.ApiPort.Balance, "GET")
      .then((data) => {
        this.setState({
          refreshing: false,
        });
        if (Array.isArray(data.result) && data.result.length) {
          let TotalMoney = data.result.find(
            (v) => v.name.toLocaleUpperCase() == "TotalBal".toLocaleUpperCase()
          );
          this.setState({
            TotalMoney: TotalMoney.balance,
          });
        }
      })
      .catch(() => {
        this.setState({
          refreshing: false,
        });
      });
  }

  actionPage(key) {
    // 不需登入就可進
    const doNeedLogin = ["dailyGift", "VIP", "KingClub", "AboutUSDT", "Sponsor", "HelpCenter"];

    if (!doNeedLogin.some(v => v === key) && !window.ApiPort.UserLogin) {
      Actions.Login();
      return;
    }

    switch (key) {
      case "DepositCenter":
        Actions.DepositCenter({ from: "GamePage" });
        break;
      case "Transfer":
        Actions.Transfer();
        break;
      case "Recordes":
        Actions.recordes();
        break;
      case "News":
        Actions.News();
        break;
      case "setSystem":
        Actions.Setting({ setType: "setSystem" });
        break;
      case "setPush":
        Actions.Setting({ setType: "setPush" });
        break;
      case "Rules":
        Actions.Rules();
        break;
      case "userInfor":
        Actions.userInfor();
        break;
      case "bankcard":
        Actions.bankcard();
        break;
      case "recordes":
        Actions.recordes();
        break;
      case "withdrawal":
        Actions.withdrawal();
        break;
      case "SelfExclusion":
        Actions.SelfExclusion();
        break;
      case "SecurityCode":
        Actions.SecurityCode();
        break;
      case "UploadFile":
        Actions.UploadFile();
        break;
      case "dailyGift":
        Actions.PromotionsEverydayGift();
        break;
      case "VIP":
        Actions.VIP();
        break;
      case "KingClub":
        Actions.KingClub();
        break;
      case "AboutUSDT":
        Actions.AboutUSDT();
        break;
      case "Sponsor":
        Actions.Sponsor();
        break;
      case "HelpCenter":
        Actions.HelpCenter();
        break;
      default:
        "";
    }
  }

  rightIcon = () => {
    return (
      <Image
        source={require("../../images/icon/darkGreyRight.png")}
        style={{ width: 16, height: 16 }}
      />
    );
  };

  renderPage(item) {
    return (
      <TouchableOpacity
        key={item.index}
        style={[styles.carouselImg]}
        onPress={() => {
          console.log(item)
          PiwikEvent("Banner", "Click", `${item.item.title}_ProfilePage`);
          BannerAction.onBannerClick(item.item)
        }}
      >
        <Image
          resizeMode="stretch"
          style={styles.carouselImg}
          source={{ uri: item.item.cmsImageUrl }}
        />
      </TouchableOpacity>
    );
  }

  download() {
    let affc = affCodeKex || "";
    if (affc) {
      affc = "aff=" + affc.replace(/[^\w\.\/]/gi, "");
    }
    Linking.canOpenURL("funpodium-fun88://").then((supported) => {
      if (!supported) {
        Linking.openURL(
          "https://www.fun88asia.com/cn/download/app.htm?" + affc
        );
      } else {
        return Linking.openURL("funpodium-fun88://");
      }
    });
  }

  // 未讀訊息統計
  getMessageCount = () => {
    fetchRequest(ApiPort.UnreadMessage + "key=All&", "GET")
      .then((res) => {
        if (res && res.result) {
          const total =
            res.result.unreadAnnouncementCount +
            res.result.unreadPersonalMessageCount +
            res.result.unreadTransactionCount;
          this.setState({
            unreadCount: total,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  openSportAPP = () => {
    let affc = affCodeKex || ''
    if (affc) {
      affc = 'aff=' + affc.replace(/[^\w\.\/]/ig, '')
    }
    Linking.canOpenURL('sb20://').then(supported => {
      if (!supported) {

        // LIVE環境
        if (common_url.indexOf('idcf5') > -1) {
          Linking.openURL('https://sbone.qhufr.com/Appinstall.html?aff=' + affc + '?')
        } else {
          Linking.openURL('https://sportsstaging.fun88.biz/Appinstall.html?aff=' + affc + '?')
        }

      } else {
        return Linking.openURL('sb20://')
      }
    })

  }

  render() {
    window.refreshingProfile = () => {
      this.getInitNotLogin();
    };
    const {
      faceLogin,
      TotalMoney,
      bannerData,
      bannerIndex,
      refreshing,
      securityLevel,
      percent,
      showUnionPage,
    } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#EFEFF4",
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
        }}
      >
        <Modal animationType="fade" transparent={true} visible={showUnionPage}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContainer1}>
              <View style={styles.modalContainerHead}>
                <Text style={styles.modalContainerHeadText}>温馨提醒</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 24,
                }}
              >
                <Text style={{ fontSize: 14, color: "#000" }}>
                  将为您打开新的窗口
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 15,
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Touch
                    onPress={() => {
                      this.setState({
                        showUnionPage: false,
                      });
                    }}
                    style={{
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#00A6FF",
                      paddingHorizontal: 40,
                      flex: 1,
                      marginRight: 5,
                    }}
                  >
                    <Text style={{ color: "#00A6FF", fontSize: 15 }}>取消</Text>
                  </Touch>
                  <Touch
                    onPress={() => {
                      Linking.openURL("https://www.luckyf86.com/zh-cn");
                    }}
                    style={{
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#00A6FF",
                      paddingHorizontal: 40,
                      backgroundColor: "#00A6FF",
                      flex: 1,
                      marginLeft: 5,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 15 }}>确定</Text>
                  </Touch>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <ScrollView
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={"#25AAE1"}
              onRefresh={() => {
                window.ApiPort.UserLogin && this.getInitData(true);
                this.QueleaActiveCampaign();
              }}
            />
          }
        >
          <View
            style={{
              backgroundColor: "#00A6FF",
              height: 100,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                height: 30,
                backgroundColor: "#EFEFF4",
                borderTopRightRadius: 40,
                borderTopLeftRadius: 40,
              }}
            ></View>
          </View>
          <View
            style={{
              marginHorizontal: 16,
              marginTop: -60,
              paddingBottom: 70,
            }}
          >
            {window.ApiPort.UserLogin ? (
              <View
                style={{
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: 6,
                  padding: 12,
                  paddingVertical: 20,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      backgroundColor: "#EFEFF4",
                      borderRadius: 1000,
                      width: 44,
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/usericon1.png")}
                      style={{ width: 26, height: 26 }}
                    />
                  </View>
                  <View>
                    <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
                      {userNameDB}
                    </Text>
                    <Text style={{ color: "#999999" }}>
                      总余额{" "}
                      <Text style={{ fontWeight: "bold", color: "#000" }}>
                        ￥ {TotalMoney.toFixed(2)}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {this.props.csCall.isVip && <CsCallIcon />}
                  <TouchableOpacity
                    onPress={() => {
                      LiveChatOpenGlobe();
                      PiwikEvent("CS", "Launch", "LiveChat_ProfilePage");
                    }}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/cs.png")}
                      style={{ width: 28, height: 28 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      backgroundColor: "#E3E3E8",
                      borderRadius: 1000,
                      width: 44,
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/usericon11.png")}
                      style={{ width: 26, height: 26 }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginBottom: 6,
                        color: "#666666",
                      }}
                    >
                      访客参访中
                    </Text>
                    <Touch
                      onPress={() => {
                        Actions.Login();
                        PiwikEvent("Navigation", "Click", "Login_Profile Page");
                      }}
                      style={{
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: "#00A6FF",
                        paddingTop: 2,
                        paddingBottom: 2,
                        paddingRight: 6,
                        paddingLeft: 6,
                      }}
                    >
                      <Text style={{ color: "#00A6FF" }}>登录/注册</Text>
                    </Touch>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    LiveChatOpenGlobe();
                    PiwikEvent("CS", "Launch", "LiveChat_ProfilePage");
                  }}
                >
                  <Image
                    resizeMode="stretch"
                    source={require("../../images/cs.png")}
                    style={{ width: 28, height: 28 }}
                  />
                </TouchableOpacity>
              </View>
            )}

            {
              Array.isArray(bannerData) &&
              bannerData.length > 0 && (
                <View style={styles.wrapper}>
                  <Carousel
                    data={bannerData}
                    renderItem={this.renderPage.bind(this)}
                    sliderWidth={bannerWidth}
                    itemWidth={bannerWidth}
                    height={bannerHeight}
                    autoplay={true}
                    loop={true}
                    autoplayDelay={500}
                    autoplayInterval={4000}
                    onSnapToItem={(index) => {
                      this.setState({ bannerIndex: index });
                    }}
                  />
                  <Pagination
                    dotsLength={bannerData.length}
                    activeDotIndex={bannerIndex}
                    containerStyle={styles.containerStyle}
                    dotStyle={styles.dotStyle}
                    inactiveDotStyle={styles.inactiveDotStyle}
                    inactiveDotOpacity={1}
                    inactiveDotScale={0.6}
                  />
                </View>
              )}
            {window.ApiPort.UserLogin && (
              <View
                style={{
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 16,
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 3 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#333333",
                        fontWeight: "bold",
                        marginBottom: 2,
                      }}
                    >
                      安全等级: {securityLevel}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#999999",
                        marginBottom: 8,
                      }}
                    >
                      验证您的账户信息, 提高账户安全性
                    </Text>

                    <View style={{ marginRight: 10, height: 4, flex: 1 }}>
                      <Progress
                        barStyle={{
                          backgroundColor:
                            (percent === 0 || percent === 33) ? "#EB2121" : percent === 66 ? "#FFBF58" : "#34C759",
                          borderColor:
                            (percent === 0 || percent === 33) ? "#EB2121" : percent === 66 ? "#FFBF58" : "#34C759",
                          borderRadius: 50,
                        }}
                        style={{ backgroundColor: "#EFEFF4" }}
                        percent={percent}
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1, paddingHorizontal: 16 }}>
                    {percent === 100 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          resizeMode="stretch"
                          source={require("../../images/icon/checkCircle.png")}
                          style={{ width: 18.7, height: 18.7, marginRight: 7 }}
                        />
                        <Text style={{ color: "#34C759", fontSize: 14 }}>
                          已验证
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#00A6FF",
                          borderRadius: 8,
                          height: 32,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => Actions.SecurityCheck({
                          checkVerifyState: (data, passedAllVerify) => {
                            this.checkVerifyState(data, passedAllVerify);
                          },
                        })}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          马上验证
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            )}

            <View
              style={{
                backgroundColor: "#fff",
                marginTop: 16,
                borderRadius: 6,
                paddingVertical: 20,
                // paddingHorizontal: 26,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  // justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.listItem}>
                  <Touch
                    onPress={() => {
                      NavigationUtil.goPage("DepositCenter");
                      PiwikAction.SendPiwik("Deposit_ProfilePage");
                    }}
                    style={styles.iconBtn}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/userFianceIcon1.png")}
                      style={styles.iconBtnImg}
                    />
                    <Text style={styles.iconText}>存款</Text>
                  </Touch>
                </View>

                <View style={styles.listItem}>
                  <Touch
                    onPress={() => {
                      this.actionPage("Transfer");
                      PiwikAction.SendPiwik("Transfer_ProfilePage");
                    }}
                    style={styles.iconBtn}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/userFianceIcon2.png")}
                      style={styles.iconBtnImg}
                    />
                    <Text style={styles.iconText}>转账</Text>
                  </Touch>
                </View>

                <View style={styles.listItem}>
                  <Touch
                    onPress={() => {
                      this.actionPage("withdrawal");
                      PiwikAction.SendPiwik("Withdraw_ProfilePage");
                    }}
                    style={styles.iconBtn}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/userFianceIcon3.png")}
                      style={[styles.iconBtnImg]}
                    />
                    <Text style={styles.iconText}>提款</Text>
                  </Touch>
                </View>

                <View style={styles.listItem}>
                  <Touch
                    onPress={() => {
                      this.actionPage("Recordes");
                      PiwikAction.SendPiwik("TransactionRecord_ProfilePage");
                    }}
                    style={styles.iconBtn}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/Record.png")}
                      style={[styles.iconBtnImg]}
                    />
                    <Text style={styles.iconText}>交易记录</Text>
                  </Touch>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  // justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 24,
                }}
              >
                <View style={styles.listItem}>
                  <Touch
                    onPress={() => {
                      this.actionPage("News");
                      // PiwikEvent(
                      //   "Deposit Nav",
                      //   "Launch",
                      //   "Deposit_ProfilePage"
                      // );
                    }}
                    style={styles.iconBtn}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/notify.png")}
                      style={styles.iconBtnImg}
                    />
                    <Text style={styles.iconText}>通知中心</Text>
                    <View style={styles.news}>
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {this.state.unreadCount}
                      </Text>
                    </View>
                  </Touch>
                </View>

                <View style={styles.listItem}>
                  <Touch
                    onPress={() => {
                      this.actionPage("KingClub");
                    }}
                    style={styles.iconBtn}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/kingClub.png")}
                      style={styles.iconBtnImg}
                    />
                    <Text style={styles.iconText}>天王俱乐部</Text>
                  </Touch>
                </View>

                <View style={styles.listItem}>
                  <Touch
                    onPress={() => {
                      this.actionPage("VIP")
                    }}
                    style={styles.iconBtn}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/diamondClub.png")}
                      style={[styles.iconBtnImg]}
                    />
                    <Text style={styles.iconText}>钻石俱乐部</Text>
                  </Touch>
                </View>

                <View style={styles.listItem}>
                  <Touch
                    onPress={() => {
                      this.actionPage("dailyGift");
                    }}
                    style={styles.iconBtn}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/dailyGift.png")}
                      style={[styles.iconBtnImg]}
                    />
                    <Text style={styles.iconText}>每日好礼</Text>
                  </Touch>
                </View>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#fff",
                marginTop: 16,
                borderRadius: 6,
                paddingHorizontal: 16,
                paddingVertical: 15,
              }}
            >
              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouch}
                  onPress={() => {
                    this.actionPage("AboutUSDT")
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/icon/USDT.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      USDT介绍
                    </Text>
                  </View>
                  {this.rightIcon()}
                </Touch>
              </View>

              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouch}
                  onPress={() => {
                    this.actionPage("Sponsor")
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/icon/Sponsor.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      赞助伙伴
                    </Text>
                  </View>
                  {this.rightIcon()}
                </Touch>
              </View>

              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouch}
                  onPress={() => {
                    this.setState({
                      showUnionPage: true,
                    });
                    PiwikEvent("Account", "Click", "Account_ProfilePage");
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/union.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      联盟合作
                    </Text>
                  </View>
                  {this.rightIcon()}
                </Touch>
              </View>

              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouchLast}
                  onPress={() => {
                    this.goRecommend();
                    PiwikEvent("Account", "Click", "Account_ProfilePage");
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/friend.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      推荐好友
                    </Text>
                  </View>
                  {this.rightIcon()}
                </Touch>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#fff",
                marginTop: 16,
                borderRadius: 6,
                padding: 12,
              }}
            >
              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouch}
                  onPress={() => {
                    this.actionPage("userInfor");
                    PiwikEvent("Account", "Click", "Account_ProfilePage");
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/profile.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      账户资料
                    </Text>
                  </View>
                  {this.rightIcon()}
                </Touch>
              </View>

              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouch}
                  onPress={() => {
                    this.actionPage("bankcard");
                    PiwikEvent(
                      "Account",
                      "Click",
                      "Bank_Management_ProfilePage"
                    );
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/bankInfo.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      银行信息
                    </Text>
                  </View>
                  {this.rightIcon()}
                </Touch>
              </View>
              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouch}
                  onPress={() => {
                    this.actionPage("SelfExclusion");
                    PiwikEvent(
                      "Account",
                      "Click",
                      "Bank_Management_ProfilePage"
                    );
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/selfControl.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      自我限制
                    </Text>
                  </View>
                  {this.rightIcon()}
                </Touch>
              </View>
              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouch}
                  onPress={() => {
                    this.actionPage("SecurityCode");
                    PiwikEvent(
                      "Account",
                      "Click",
                      "Bank_Management_ProfilePage"
                    );
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/safeKey.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      创建安全码
                    </Text>
                  </View>
                  {this.rightIcon()}
                </Touch>
              </View>
              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouchLast}
                  onPress={() => {
                    this.actionPage("UploadFile");
                    // PiwikEvent(
                    //   "Account",
                    //   "Click",
                    //   "Bank_Management_ProfilePage"
                    // );
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/uploadFile.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      上传文件
                    </Text>
                  </View>
                  {this.rightIcon()}
                </Touch>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#fff",
                marginTop: 16,
                borderRadius: 6,
                padding: 12,
              }}
            >
              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouch}
                  onPress={() => {
                    this.setFastLogin();
                    PiwikEvent(
                      "Transaction Record",
                      "Click",
                      "TransactionRecord_ProfilePage"
                    );
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/logins.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      {Platform.OS == "ios"
                        ? DeviceInfoIos
                          ? "脸部辨识认证"
                          : "使用指纹辨识"
                        : "快速登入"}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: "#999999", marginRight: 10 }}>
                      {Platform.OS == "ios" && (faceLogin ? "启用" : "关闭")}
                    </Text>
                    {this.rightIcon()}
                  </View>
                </Touch>
              </View>

              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouch}
                  onPress={() => {
                    Linking.openURL(`${SBTDomain}/cn/mobile/Appinstall.html`);
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/downloadApp.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      下载 App
                    </Text>
                  </View>
                  {this.rightIcon()}
                </Touch>
              </View>

              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouch}
                  onPress={() => {
                    window.CheckUptateGlobe && window.CheckUptateGlobe(true);
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/usericon4.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      版本更新 {window.Rb88Version}
                    </Text>
                  </View>
                  {this.rightIcon()}
                </Touch>
              </View>



              <View style={styles.managerLists}>
                <Touch
                  style={styles.managerListsTouchLast}
                  onPress={() => {
                    this.actionPage("HelpCenter")
                  }}
                >
                  <View style={styles.managerListsLeft}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/user/faq.png")}
                      style={styles.managerListsImg}
                    ></Image>
                    <Text
                      style={{
                        color: "#666666",
                      }}
                    >
                      帮助中心
                    </Text>
                  </View>
                  {this.rightIcon()}
                </Touch>
              </View>
            </View>
            {window.ApiPort.UserLogin && (
              <TouchableOpacity
                onPress={() => {
                  window.navigateToSceneGlobeX && window.navigateToSceneGlobeX();
                  PiwikEvent("Navigation", "Click", "Logout_ProfilePage");
                }}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "#E0E0E0",
                  borderWidth: 1,
                  borderRadius: 10,
                  height: 48,
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    color: "#00A6FF",
                    fontSize: 14,
                  }}
                >
                  登出
                </Text>
              </TouchableOpacity>
            )}

            {/*線上環境不顯示*/}
            {window.isStaging && (
              <TestFunctions />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
  userSetting: state.userSetting,
  csCall: state.csCall,
});

export default connect(mapStateToProps)(News);

const styles = StyleSheet.create({
  listItem: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "25%"
  },
  iconBtn: {
    justifyContent: "center",
    alignItems: "center",
    // width: (width - 20 - 24) / 4,
  },
  iconBtnImg: {
    width: 34,
    height: 34,
    marginBottom: 7,
  },
  managerLists: {
    flexDirection: "row",
  },
  managerListsTouch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F3F3",
    paddingBottom: 15,
    marginBottom: 15,
  },
  managerListsTouchLast: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  managerListsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  managerListsImg: {
    width: 18,
    height: 18,
    marginRight: 12,
  },
  carouselImg: {
    width: bannerWidth,
    height: bannerHeight,
    borderRadius: 4,
  },
  wrapper: {
    height: bannerHeight,
    // margin: 10,
    marginTop: 16,
    marginBottom: 0,
    overflow: "hidden",
    borderRadius: 6,
  },
  containerStyle: {
    paddingVertical: 2,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 5,
  },
  dotStyle: {
    width: 20,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
    backgroundColor: "#00CEFF",
  },
  inactiveDotStyle: {
    width: 10,
    backgroundColor: "#fff",
  },
  iconText: {
    color: "#222",
    fontSize: 12,
  },
  modalContainer: {
    width,
    height,
    flex: 1,
    backgroundColor: "rgba(0 ,0 ,0, .6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer1: {
    width: width * 0.9,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  modalContainerHead: {
    height: 44,
    backgroundColor: "#00A6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainerHeadText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  news: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 1000,
    width: 18,
    height: 18,
    backgroundColor: "#FF1C1C",
    position: "absolute",
    top: -4,
    right: 0,
  },
});
