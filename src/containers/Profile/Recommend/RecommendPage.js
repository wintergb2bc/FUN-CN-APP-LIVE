import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  Clipboard,
  CameraRoll,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { Toast } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import Share from "react-native-share";
import ActivePage from "./activePage";
import QRCodeA from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import actions from "../../../lib/redux/actions/index";
import { connect } from "react-redux";

class Recommend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registered: false,
      QueleaReferrerInfo: this.props.QueleaReferrerInfo || "",
      memberInfo: "",
      phoneData: "",
      emailData: "",
      activepages: false,
      isDeposited: false,
      isContactVerified: false,
      result: "",
      dateRegister: "0000年00月00",
      phoneVerified: false,
      emailVerified: false,
      totalDeposits: "0",
      totalBets: 0,
      isVerificationMet: false,
      isDepositMet: false,
      isRegisteredMet: false,
      //进度条数据
      progressBar1: "0",
      progressBar2: "0",
      progressBar3: "0",
      progressBar4: "0",
      progressBar5: "0",
      firstTierRewardAmount: "0",
      secondTierRewardAmount: "0",
      progressBarData1: "",
      progressBarData2: "",
      referrerPayoutAmount: "0",
      memberCode: "",

      Urls:
        (this.props.QueleaReferrerInfo &&
          this.props.QueleaReferrerInfo.queleaUrl) ||
        "",
    };
  }
  componentWillMount() {
    //获取充值，流水最低详情
    global.storage
      .load({
        key: "QueleaActiveCampaign",
        id: "QueleaActiveCampaign",
      })
      .then((data) => {
        this.setState({ result: data.result });
      });

    //没用加入过的表示条件不知道满足，需要再拿api
    if (!this.state.Urls) {
      //加入推荐条件是否满足
      this.ReferrerEligible();
      //获取不满足的准确信息
      this.ReferrerActivity();
      this.getUser();
    }
    //获取推荐个数，能获取的彩金
    this.ReferrerRewardStatus();
  }

  //加入推荐条件是否满足
  ReferrerEligible() {
    fetchRequest(ApiPort.ReferrerEligible, "GET")
      .then((res) => {
        if (res.isSuccess && res.result) {
          let data = res.result;
          let registered = false;
          let isVerificationMet = data.isVerificationMet;
          let isDepositMet = data.isDepositMet;
          let isRegisteredMet = data.isRegisteredMet;
          let isBetAmountMet = data.isBetAmountMet;

          if (
            isVerificationMet &&
            isDepositMet &&
            isRegisteredMet &&
            isBetAmountMet
          ) {
            //生成二维码满足条件
            registered = true;
          }
          this.setState({
            registered,
            isVerificationMet,
            isDepositMet,
            isRegisteredMet,
            isBetAmountMet,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //获取不满足的准确信息
  ReferrerActivity() {
    Toast.loading("加载中,请稍候...", 200);
    fetchRequest(ApiPort.ReferrerActivity, "GET")
      .then((res) => {
        Toast.hide();
        if (res.isSuccess && res.result) {
          let data = res.result;
          this.setState({
            dateRegister: data[0].dateRegister,
            phoneVerified: data[0].phoneVerified,
            emailVerified: data[0].emailVerified,
            totalDeposits: data[0].totalDeposits,
            totalBets: data[0].totalBets,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //获取推荐个数，能获取的彩金
  ReferrerRewardStatus() {
    Toast.loading("加载中,请稍候...", 200);
    fetchRequest(ApiPort.ReferrerRewardStatus, "GET")
      .then((res) => {
        Toast.hide();
        if (res.isSuccess && res.result) {
          const data = res.result;
          //进度条数据
          this.setState({
            progressBar1: data.linkClicked,
            progressBar2: data.memberRegistered,
            progressBar3: data.memberDeposited,
            progressBar4: data.firstTierMetCount,
            progressBar5: data.secondTierMetCount,
            firstTierRewardAmount: data.firstTierRewardAmountSetting,
            secondTierRewardAmount: data.secondTierRewardAmountSetting,
            progressBarData1: data.firstTierMsg,
            progressBarData2: data.secondTierMsg,
            referrerPayoutAmount: data.referrerPayoutAmount,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getUser() {
    fetchRequest(ApiPort.Member, "GET")
      .then((res) => {
        if (res.isSuccess && res.result) {
          let memberInfo = res.result.memberInfo;
          let contacts = memberInfo.contacts;
          this.setState({
            memberCode: memberInfo.memberCode,
          });
          const phoneData = contacts.filter(
            (item) => item.contactType.toLocaleLowerCase() == "phone"
          )[0];
          const emailData = contacts.filter(
            (item) => item.contactType.toLocaleLowerCase() == "email"
          )[0];
          console.log(phoneData);
          this.setState({
            phoneData,
            emailData,
          });
          this.props.userInfo_updateMemberInfo(res.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // 前往手机验证
  phoneVerify = () => {
    Actions.pop();
    Actions.Verification({
      dataPhone: this.state.phoneData.contact,
      dataEmail: this.state.emailData.contact,
      verificaType: "phone",
      memberCode: this.state.memberCode,
      noMoreverifcation: false,
      getUser: () => {
        this.getUser();
      },
    });
  };

  /*前往邮箱验证*/
  emailVerify = () => {
    Actions.pop();
    Actions.Verification({
      dataPhone: this.state.phoneData.contact,
      dataEmail: this.state.emailData.contact,
      verificaType: "email",
      memberCode: this.state.memberCode,
      noMoreverifcation: false,
      getUser: () => {
        this.getUser();
      },
    });
  };

  Verify() {
    if (!this.state.phoneData) {
      return;
    }

    if (!this.state.phoneVerified) {
      this.phoneVerify(this.state.phoneData.contact);
    } else {
      this.emailVerify(this.state.emailData.contact);
    }
  }

  goDeposit() {
    Actions.pop();
    Actions.DepositCenter({ from: "GamePage" });
  }

  //复制链接
  async copys() {
    if (this.state.Urls == "") {
      return;
    }
    Clipboard.setString(this.state.Urls);
    Toast.info("已复制", 2);
  }

  //保存二维码
  saveImg() {
    if (this.state.Urls == "") {
      return;
    }
    if (Platform.OS == "android") {
      this.getPermissions();
    } else {
      this.refs.viewShot.capture().then(
        (uri) => this.SaveQrCode(uri),
        (error) => Toast.fail(error)
      );
    }
  }
  async getPermissions() {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
      Promise.resolve();

      setTimeout(() => {
        this.refs.viewShot.capture().then(
          (uri) => this.SaveQrCode(uri),
          (error) => Toast.fail(error)
        );
      }, 1000);
    } catch (error) {
      Promise.reject(error);
    }
  }
  SaveQrCode(uri) {
    let promise = CameraRoll.saveToCameraRoll(uri);

    promise
      .then((result) => {
        Toast.info("已保存", 2);
      })
      .catch((error) => {
        let errorMsg =
          Platform.OS == "ios"
            ? "请在iPhone的“设置-隐私-照片” 中允许访问照片"
            : "请在Android的“设置 - 应用管理 - 同乐城 - 应用权限”中允许 访问相机";
        Alert.alert("二维码保存失败", errorMsg);
        console.log(error);
      });
  }

  ShareUrl() {
    if (!Share) {
      Toast.fail("分享失败，请重试");
      return;
    }
    const shareOptions = {
      title: "分享给大家",
      url: this.state.Urls,
      failOnCancel: false,
    };
    return Share.open(shareOptions);
  }

  //生成推荐链接
  getUrls() {
    if (!this.state.registered) {
      //不满足条件
      return;
    }

    Toast.loading("生成中,请稍候...", 200);
    fetchRequest(ApiPort.ReferrerSignUp, "POST")
      .then((res) => {
        Toast.hide();
        if (res.isSuccess && res.result) {
          let data = res.result;
          this.setState({ QueleaReferrerInfo: data, Urls: data.queleaUrl });
        } else {
          Toast.fail("即将开启，敬请期待");
        }
      })
      .catch((error) => {
        Toast.fail("即将开启，敬请期待");
        console.log(error);
      });
  }
  render() {
    const {
      registered,
      dateRegister,
      phoneVerified,
      emailVerified,
      totalDeposits,
      totalBets,
      isVerificationMet,
      isDepositMet,
      isRegisteredMet,
      isBetAmountMet,
      progressBar1,
      progressBar2,
      progressBar3,
      progressBar4,
      progressBar5,
      firstTierRewardAmount,
      secondTierRewardAmount,
      progressBarData1,
      progressBarData2,
      referrerPayoutAmount,
      Urls,
      result,
    } = this.state;
    console.log(this.state);
    return (
      <View style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Image
              resizeMode="stretch"
              source={require("../../../images/user/referFriend.png")}
              style={{ width: width, height: 120 }}
            />
          </View>
          <View style={{ padding: 15 }}>
            {Urls == "" && (
              <View>
                <Text style={styless.titles}>须满足申请资格</Text>
                <View style={styless.pageList}>
                  <Text style={styless.num}>1</Text>
                  <View style={{ width: width * 0.62 }}>
                    <Text style={styless.pageapian}>注册满一个月 </Text>
                    <Text style={styless.pageapian1}>
                      您注册于
                      {dateRegister
                        .split("T")[0]
                        .replace("-", "年")
                        .replace("-", "月")}
                      日
                    </Text>
                  </View>
                  <Image
                    resizeMode="contain"
                    source={
                      !isRegisteredMet
                        ? require("../../../images/posino/check.png")
                        : require("../../../images/posino/icon-done.png")
                    }
                    style={{ width: 22, height: 22 }}
                  />
                </View>

                <View style={[styless.pageList, { height: 150 }]}>
                  <Text style={styless.num}>2</Text>
                  {result != "" && (
                    <View style={{ width: width * 0.62 }}>
                      <Text style={styless.pageapian}>
                        总存款金额满{" "}
                        {result.campaignSignUpPreCondition.totalDepositRequired}{" "}
                        元并达{" "}
                        {
                          result.campaignSignUpPreCondition
                            .totalBetAmountRequired
                        }{" "}
                        流水
                      </Text>
                      <View style={styless.sVerif}>
                        <View style={styless.sVerif}>
                          <Image
                            resizeMode="contain"
                            source={
                              isDepositMet
                                ? require("../../../images/posino/dcheck.png")
                                : require("../../../images/posino/d.png")
                            }
                            style={{ width: 16, height: 16 }}
                          />
                        </View>
                        <Text
                          style={[
                            styless.pageapian1,
                            {
                              color: isDepositMet ? "#222" : "#666",
                              paddingLeft: 5,
                              paddingRight: 10,
                            },
                          ]}
                        >
                          存款:({totalDeposits}/
                          {
                            result.campaignSignUpPreCondition
                              .totalDepositRequired
                          }
                          )
                        </Text>

                        <View style={styless.sVerif}>
                          <Image
                            resizeMode="contain"
                            source={
                              isBetAmountMet
                                ? require("../../../images/posino/wcheck.png")
                                : require("../../../images/posino/w.png")
                            }
                            style={{ width: 16, height: 16 }}
                          />
                        </View>
                        <Text
                          style={[
                            styless.pageapian1,
                            {
                              color: isBetAmountMet ? "#222" : "#666",
                              paddingLeft: 5,
                            },
                          ]}
                        >
                          流水:({totalBets}/
                          {
                            result.campaignSignUpPreCondition
                              .totalBetAmountRequired
                          }
                          )
                        </Text>
                      </View>

                      {!isDepositMet ? (
                        <Touch
                          onPress={() => {
                            if(!isRegisteredMet){return}
                            this.goDeposit();
                          }}
                          style={[styless.touchBtn, { marginTop: 13, backgroundColor: !isRegisteredMet?"#EFEFF4":"#00A6FF" }]}
                        >
                          <Text style={{ color:  !isRegisteredMet?"#999":"#fff", textAlign: "center" }}>
                            马上存款
                          </Text>
                        </Touch>
                      ) : null}
                    </View>
                  )}
                  <Image
                    resizeMode="contain"
                    source={
                      !isDepositMet || !isBetAmountMet
                        ? require("../../../images/posino/check.png")
                        : require("../../../images/posino/icon-done.png")
                    }
                    style={{ width: 22, height: 22 }}
                  />
                </View>

                <View style={styless.pageList}>
                  <Text style={styless.num}>3</Text>
                  <View style={{ width: width * 0.62 }}>
                    <Text style={styless.pageapian}>验证邮箱和手机</Text>
                    <View style={styless.sVerif}>
                      <View
                        style={[
                          styless.sVerif,
                          {
                            backgroundColor: emailVerified
                              ? "#42D200"
                              : "#CCCCCC",
                          },
                        ]}
                      >
                        <Image
                          resizeMode="contain"
                          source={require("../../../images/posino/icon-email.png")}
                          style={{ width: 16, height: 16 }}
                        />
                      </View>
                      <Text
                        style={[
                          styless.pageapian1,
                          {
                            color: emailVerified ? "#222" : "#666",
                            paddingLeft: 5,
                            paddingRight: 10,
                          },
                        ]}
                      >
                        {emailVerified ? "已验证" : "未验证"}
                      </Text>

                      <View
                        style={[
                          styless.sVerif,
                          {
                            backgroundColor: phoneVerified
                              ? "#42D200"
                              : "#CCCCCC",
                          },
                        ]}
                      >
                        <Image
                          resizeMode="contain"
                          source={require("../../../images/posino/icon-phone.png")}
                          style={{ width: 16, height: 16 }}
                        />
                      </View>
                      <Text
                        style={[
                          styless.pageapian1,
                          {
                            color: phoneVerified ? "#222" : "#666",
                            paddingLeft: 5,
                          },
                        ]}
                      >
                        {phoneVerified ? "已验证" : "未验证"}
                      </Text>
                    </View>
                    {!isVerificationMet ? (
                      <Touch
                        onPress={() => {
                          if(!isRegisteredMet) { 
                            return;
                          };
                          this.Verify();
                        }}
                        style={[styless.touchBtn, { marginTop: 13, backgroundColor: !isRegisteredMet?"#EFEFF4":"#00A6FF" }]}
                      >
                        <Text style={{ color:  !isRegisteredMet?"#999":"#fff", textAlign: "center" }}>
                          进行验证
                        </Text>
                      </Touch>
                    ) : null}
                  </View>
                  <Image
                    resizeMode="contain"
                    source={
                      !isVerificationMet
                        ? require("../../../images/posino/check.png")
                        : require("../../../images/posino/icon-done.png")
                    }
                    style={{ width: 22, height: 22 }}
                  />
                </View>
              </View>
            )}
            {
              // Urls != '' &&
              <View>
                {Urls != "" && (
                  <View style={styless.urlStyle}>
                    <Text
                      style={{
                        color: "#666666",
                        lineHeight: 30,
                        width: width - 60,
                        fontSize: 14,
                      }}
                    >
                      分享链接
                    </Text>
                    <View style={styless.Urls}>
                      <Text
                        style={{
                          color: "#222222",
                          lineHeight: 45,
                          width: width - 80,
                          fontSize: 14,
                        }}
                        numberOfLines={1}
                      >
                        {Urls}
                      </Text>
                    </View>
                    <Touch
                      onPress={() => {
                        this.copys();
                      }}
                      style={[
                        styless.cpoys,
                        { borderWidth: 1, borderColor: "#00A6FF" },
                      ]}
                    >
                      <Text
                        style={{
                          color: "#00A6FF",
                          lineHeight: 40,
                          textAlign: "center",
                        }}
                      >
                        复制链接
                      </Text>
                    </Touch>
                    <Text
                      style={{
                        color: "#666666",
                        lineHeight: 30,
                        width: width - 60,
                        fontSize: 14,
                      }}
                    >
                      推荐二维码
                    </Text>
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 10,
                      }}
                    >
                      {Urls != "" && (
                        <ViewShot
                          ref="viewShot"
                          options={{ format: "jpg", quality: 0.9 }}
                        >
                          {
                            // Platform.OS == "ios" &&
                            // <QRCodeS ref="viewShot"
                            //     value={Urls}
                            //     size={160}
                            //     bgColor='#000'
                            // />
                          }

                          {
                            <QRCodeA
                              ref="viewShot"
                              value={Urls}
                              size={160}
                              bgColor="#000"
                            />
                          }
                        </ViewShot>
                      )}
                    </View>
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <Touch
                        onPress={() => {
                          this.saveImg();
                        }}
                        style={[styless.cpoys, { backgroundColor: "#00A6FF" }]}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            lineHeight: 40,
                            textAlign: "center",
                          }}
                        >
                          保存二维码
                        </Text>
                      </Touch>
                      <Touch
                        onPress={() => {
                          this.ShareUrl();
                        }}
                        style={[
                          styless.cpoys,
                          { backgroundColor: "#0CCC3C", marginLeft: 35 },
                        ]}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            lineHeight: 40,
                            textAlign: "center",
                          }}
                        >
                          分享
                        </Text>
                      </Touch>
                    </View>
                    <Text
                      style={{
                        color: "#999999",
                        fontSize: 12,
                        width: width - 60,
                        lineHeight: 20,
                      }}
                    >
                      将此链接或二维码分享给好友，被推荐人透过此网址进行注册并游戏，推荐人即可在“奖金进度”中查看彩金的状况。
                    </Text>
                  </View>
                )}
                <Text style={styless.titles}>奖金进度</Text>
                <View style={{ backgroundColor: "#fff", borderRadius: 10 }}>
                  <View style={styless.progress}>
                    <View style={styless.progressList}>
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <View
                          style={[
                            progressBar1 != 0 ? styless.yuan : styless.kong,
                          ]}
                        />
                        <Text
                          style={[
                            styless.progressTxt,
                            {
                              color: progressBar1 != 0 ? "#00A6FF" : "#999999",
                            },
                          ]}
                        >
                          链接
                        </Text>
                      </View>
                      <Text
                        style={[
                          styless.progressTxt,
                          { color: progressBar1 != 0 ? "#222" : "#999999" },
                        ]}
                      >
                        {progressBar1} 点击
                      </Text>
                      <View style={styless.progressView} />
                    </View>

                    <View style={styless.progressList}>
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <View
                          style={[
                            progressBar2 != 0 ? styless.yuan : styless.kong,
                          ]}
                        />
                        <Text
                          style={[
                            styless.progressTxt,
                            {
                              color: progressBar2 != 0 ? "#00A6FF" : "#999999",
                            },
                          ]}
                        >
                          注册
                        </Text>
                      </View>
                      <Text
                        style={[
                          styless.progressTxt,
                          { color: progressBar2 != 0 ? "#222" : "#999999" },
                        ]}
                      >
                        {progressBar2} 人
                      </Text>
                      <View style={styless.progressView} />
                    </View>

                    <View style={styless.progressList}>
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <View
                          style={[
                            progressBar3 != 0 ? styless.yuan : styless.kong,
                          ]}
                        />
                        <Text
                          style={[
                            styless.progressTxt,
                            {
                              color: progressBar3 != 0 ? "#00A6FF" : "#999999",
                            },
                          ]}
                        >
                          存款
                        </Text>
                      </View>
                      <Text
                        style={[
                          styless.progressTxt,
                          { color: progressBar3 != 0 ? "#222" : "#999999" },
                        ]}
                      >
                        {progressBar3} 人
                      </Text>
                      <View style={styless.progressView} />
                    </View>

                    <View style={styless.progressList}>
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <View
                          style={[
                            progressBar4 != 0 ? styless.yuan : styless.kong,
                          ]}
                        />
                        <Text
                          style={[
                            styless.progressTxt,
                            {
                              color: progressBar4 != 0 ? "#222" : "#666666",
                              fontWeight: progressBar4 != 0 ? "bold" : "normal",
                            },
                          ]}
                        >
                          彩金 ¥{firstTierRewardAmount}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styless.progressTxt,
                          { color: progressBar4 != 0 ? "#222" : "#999999" },
                        ]}
                      >
                        {progressBar4} 人
                      </Text>
                      <View
                        style={{ position: "absolute", bottom: 15, left: 20 }}
                      >
                        {progressBarData1 != "" && (
                          <Text style={{ color: "#999999", fontSize: 11 }}>
                            {progressBarData1.depositMsg +
                              "/" +
                              progressBarData1.turnoverMsg +
                              "/" +
                              progressBarData1.rulesMsg}
                          </Text>
                        )}
                      </View>
                      <View style={styless.progressView} />
                    </View>

                    <View style={styless.progressList}>
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <View
                          style={[
                            progressBar5 != 0 ? styless.yuan : styless.kong,
                          ]}
                        />
                        <Text
                          style={[
                            styless.progressTxt,
                            {
                              color: progressBar5 != 0 ? "#222" : "#666666",
                              fontWeight: progressBar5 != 0 ? "bold" : "normal",
                            },
                          ]}
                        >
                          彩金 ¥{secondTierRewardAmount}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styless.progressTxt,
                          { color: progressBar5 != 0 ? "#222" : "#999999" },
                        ]}
                      >
                        {progressBar5} 人
                      </Text>
                      <View
                        style={{ position: "absolute", bottom: 15, left: 20 }}
                      >
                        {progressBarData2 != "" && (
                          <Text style={{ color: "#999999", fontSize: 11 }}>
                            {progressBarData2.depositMsg +
                              "/" +
                              progressBarData2.turnoverMsg +
                              "/" +
                              progressBarData2.rulesMsg}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 15,
                    }}
                  >
                    <Text
                      style={{
                        color: "#222",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      总得奖金
                    </Text>
                    <Text
                      style={{
                        color: "#222",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      ￥ {referrerPayoutAmount}
                    </Text>
                  </View>
                </View>
              </View>
            }
            <ActivePage />
          </View>
        </ScrollView>
        {Urls == "" && (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 15,
              width: width,
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
          >
            <Touch
              onPress={() => {
                this.getUrls();
              }}
              style={{
                backgroundColor: registered ? "#00A6FF" : "#CCCCCC",
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: 40,
                  color: "#fff",
                  fontSize: 14,
                }}
              >
                生成专属推荐链接
              </Text>
            </Touch>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});
const mapDispatchToProps = (dispatch) => ({
  userInfo_updateMemberInfo: (data) =>
    dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Recommend);

const styless = StyleSheet.create({
  titles: {
    paddingLeft: 15,
    color: "#222222",
    fontSize: 14,
    paddingBottom: 15,
    fontWeight: "bold",
  },
  pageList: {
    height: 110,
    width: width - 30,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 15,
    paddingLeft: 25,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  num: {
    color: "#00A6FF",
    fontSize: 50,
    fontWeight: "bold",
    paddingRight: 10,
  },
  pageapian: {
    color: "#222222",
    paddingBottom: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  pageapian1: {
    color: "#666666",
    lineHeight: 20,
    fontSize: 12,
    paddingBottom: 5,
  },
  touchBtn: {
    borderRadius: 5,
    width: 100,
    padding: 5,
  },
  sVerif: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 15,
  },
  urlStyle: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  Urls: {
    width: width - 60,
    paddingLeft: 15,
    borderRadius: 10,
    backgroundColor: "#EFEFF4",
  },
  cpoys: {
    borderRadius: 8,
    width: 120,
    marginTop: 15,
    marginBottom: 15,
  },
  progress: {
    width: width - 30,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F2",
    marginTop: 15,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 15,
  },
  progressList: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    width: width - 60,
    height: 50,
  },
  progressView: {
    width: 1,
    height: 52,
    backgroundColor: "#999999",
    marginLeft: 5,
    position: "absolute",
    bottom: -6,
    left: 0,
    zIndex: -1,
  },
  yuan: {
    width: 10,
    height: 10,
    borderRadius: 15,
    backgroundColor: "#00A6FF",
    fontSize: 12,
  },
  kong: {
    width: 10,
    height: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#999999",
    backgroundColor: "#fff",
    fontSize: 12,
  },
  progressTxt: {
    fontSize: 12,
    paddingLeft: 10,
  },
});
