import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  Keyboard, ActivityIndicator,
  Animated,
} from "react-native";
import { Toast, Flex } from "antd-mobile-rn";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import { getBanner, getPromotionContent } from "../../Common/CommonFnData";
import { prompt, Advantage } from "./data";
import HTMLView from "react-native-htmlview";
import NavigationUtil from "../../../lib/utils/NavigationUtil";
import { Toasts } from "../../Toast";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");

class AboutUSDT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerData: "",
      username: ApiPort.UserLogin ? this.props.userInfo.username : "",
      usernameST: "",
      feedback: "",
      feedbackST: "",
      feedbackBtnEnable: false,
      scrollY: 0,
      whereToBuyData: [], // 哪裡可以購買
      FaqData: "",
      showPopup: false, // 顯示彈窗
      currentHref: "", // 當前link
      offsetY: 0,
    };
    // this.offsetY = 0
  }

  componentDidMount(props) {
    getBanner("usdtinfo", (data) => {
      if (data) this.setState({ bannerData: data });
    });
    // this.getWhereToBuyUSDT();
    this.getUsdtFAQ();
  }

  getUsdtFAQ = () => {
    // USDT FAQ
    fetch(`${CMS_Domain + ApiPort.getUsdtFaq}`, {
      method: "GET",
      headers: { token: CMS_token },
    })
      .then((response) => response.json())
      .then((res) => {
        return res && res.length && this.setState({ FaqData: res });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  directToPromo(bannerData) {
    // 跳轉優惠頁
    const id = bannerData && bannerData[0].action && bannerData[0].action.ID;

    getPromotionContent(id, (data) => {
      if (data && data.body) {
        Actions.promoPageDetail({ promotionContent: data });
        PiwikEvent("Banner_USDTPage");
      }
      // else {
      //   Toast.fail('网络错误，请稍后重试', 2);
      // }
    });
  }

  renderTitle = (str, iconSize = "m") => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          resizeMode="stretch"
          source={require("../../../images/usdtInfo/titleRight.png")}
          style={{ width: iconSize === "s" ? 42 : 75, height: 18 }}
        />
        <Text
          style={{
            color: "#FFE4C4",
            fontSize: 20,
            flex: 1,
            textAlign: "center",
          }}
        >
          {str}
        </Text>
        <Image
          resizeMode="stretch"
          source={require("../../../images/usdtInfo/titleLeft.png")}
          style={{ width: iconSize === "s" ? 42 : 75, height: 18 }}
        />
      </View>
    );
  };

  postFeedbackForm() {
    // 提交反饋
    const { username, feedback, feedbackBtnEnable } = this.state;

    if (!username.length || !feedback.length || !feedbackBtnEnable) return;
    if (!ApiPort.UserLogin) {
      Toasts.fail("请先登入");
      return;
    }
    const data = {
      username,
      feedback: feedback.trim(),
    };
    Keyboard.dismiss();
    Toast.loading("请稍候...");
    fetchRequest(ApiPort.feedbackForm + `?`, "POST", data)
      .then((res) => {
        Toast.hide();
        if (res.isSuccess) {
          if (res.result.isSuceess) {
            Toasts.success("提交成功");
          } else if (res.errors.length > 0) {
            Toast.info(res.errors[0].message);
          } else {
            Toast.fail("错误");
          }
          this.setState({
            feedback: "",
            feedbackST: "",
            feedbackBtnEnable: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  testUserName(val) {
    // 驗證用戶名
    // let username = val.replace(/\s/, '') // 禁止字元空白
    const namereg = /^[a-zA-Z0-9]{5,16}$/;
    this.setState(
      {
        username: val,
        usernameST:
          val.length == 0
            ? "用户名不能为空。"
            : !namereg.test(val)
              ? "5 - 16个字母或数字组合，中间不得有任何特殊符号"
              : "",
      },
      () => this.feedBackBtn()
    );
  }

  feedBackBtn() {
    // 控制反饋按鈕
    const { usernameST, feedbackST, username } = this.state;

    this.setState({
      feedbackBtnEnable:
        !usernameST && !feedbackST && username.length ? true : false,
    });
  }

  testFeedBack(val) {
    // 驗證反饋
    let feedback = val.replace(/(^\s*)|(\s*$)/, ""); // 禁止字元開頭空白

    this.setState(
      {
        feedback: val,
        feedbackST:
          feedback.length <= 0
            ? "问题反馈内容不得为空。"
            : feedback.length > 200
              ? "问题反馈仅限 200 字符以内。"
              : "", // 反饋長度等於0或大於200
      },
      () => this.feedBackBtn()
    );
  }

  triggerScroll(y) {
    if (this.scroll) {
      if (y == 'end') return this.scroll.scrollToEnd()
      this.scroll.scrollTo({ y, animated: true });
    }
    // console.log('this.scroll', this.scroll)
    // console.log('this.scroll.onLayout', this.scroll.props.onLayout())
  }

  render() {
    const { bannerData, usernameST, feedbackST, FaqData, activeId, username, feedback, feedbackBtnEnable, offsetY, contentHeight } = this.state;
    // console.log(this.state);
    const avgHeight = contentHeight / 6
    const dotsArr = [
      { axisY: 0, range: offsetY <= 0 },
      { axisY: 276, range: offsetY > 0 && offsetY < avgHeight },
      { axisY: 725, range: offsetY >= avgHeight && offsetY < (avgHeight * 2) },
      { axisY: 1170, range: offsetY >= (avgHeight * 2) && offsetY < (avgHeight * 3) },
      { axisY: 1673, range: offsetY >= (avgHeight * 3) && offsetY < (avgHeight * 4) },
      { axisY: 'end', range: offsetY >= (avgHeight * 4) },
    ]
    return (
      <View style={[styles.viewContainer]} resizeMode="stretch">
        <View style={{ position: 'absolute', right: 10, zIndex: 99, top: height * .3 }}>
          {
            dotsArr.map((item, index) => (
              <TouchableOpacity key={index} onPress={this.triggerScroll.bind(this, item.axisY)}
                style={[styles.dotStyle, { backgroundColor: item.range ? '#fff' : '#aaaaaa', }]} />
            ))
          }
        </View>
        <KeyboardAwareScrollView
          innerRef={ref => { this.scroll = ref }}
          // enableResetScrollToCoords={true}
          removeClippedSubviews={false}
          contentInset={{ bottom: 90 }}
          contentContainerStyle={({ bottom: 90 })}
          // resetScrollToCoords={{ x: 0, y: 300 }}
          onKeyboardWillShow={(frames: Object) =>
            this.setState({ keyboardOpen: true })
          }
          onKeyboardWillHide={(frames: Object) =>
            this.setState({ keyboardOpen: false })
          }
          extraScrollHeight={200}
          enableOnAndroid={true}
          keyboardOpeningTime={0}
          keyboardShouldPersistTaps="handled"
          onScroll={(e) => {
            // this.offsetY = e.nativeEvent.contentOffset.y; //滑动距离
            const offsetY = e.nativeEvent.contentOffset.y; //滑动距离
            const contentHeight = e.nativeEvent.contentSize.height
            // this.contentHeight = e.nativeEvent.contentSize.height
            this.setState((preState) => ({
              offsetY,
              contentHeight,
            }))
            // console.log('offsetY', offsetY)
            console.log('e', e.nativeEvent.contentSize.height)
          }}
        >
          {/* banner */}
          <View style={{ width: width, height: 450 }}>
            {!!bannerData && bannerData[0]?.cmsImageUrl && (
              <Image
                resizeMode="cover"
                source={{ uri: bannerData[0].cmsImageUrl }}
                style={{ width: width, height: 450 }}
              />
            )}
          </View>

          <View style={styles.contentContainer}>
            {/* first scope */}
            <View style={styles.contentWrap}>
              {/* title */}
              <View style={[styles.titleWrap]}>
                <View>
                  <Text style={styles.titleText}>您必须了解的加密货币</Text>
                  <Text style={styles.titleSubtitle}>
                    加密货币是现代社会中最有价值的发明之一，其颠覆传统的去中心化交易模式及安全、稳定、隐秘之特性，
                    广受企业机构的青睐，成为现今市场交易的主流。
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 45 }}>
                {prompt.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        paddingHorizontal: 23,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 45,
                      }}
                    >
                      <Image
                        source={item.icon}
                        style={{ width: 65, height: 65 }}
                      />
                      <View style={{ marginLeft: 15, flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            marginBottom: 5,
                            color: "#FFE4C4",
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#DFDFDF",
                            lineHeight: 20,
                          }}
                        >
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {this.renderTitle("USDT泰达币的优势")}
              <Text style={styles.titleSubtitle2}>
                泰达币（Tether）也被称为USDT，其价值与美元对等
                1USDT=1美元。作为最稳定且保值的币种，在加密货币中独占鳌头。
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginTop: 15,
                  marginBottom: 15,
                }}
              >
                {Advantage.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: "rgba(14,20,64,.9)",
                        opacity: 0.9,
                        width: width * 0.27,
                        height: 95,
                        margin: 5,
                        marginBottom: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                      }}
                    >
                      <Image
                        source={item.icon}
                        style={{ width: 30, height: 30 }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          marginBottom: 5,
                          marginTop: 10,
                          color: "#DFDFDF",
                        }}
                      >
                        {item.title}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <Touch
                onPress={() => Actions.USDTWalletProtocols()}
                style={styles.buttonAlign}
              >
                <Text style={styles.buttonText}>钱包协议的区别</Text>
                <Image
                  resizeMode="stretch"
                  source={require("../../../images/icon/rightPink.png")}
                  style={{ width: 12, height: 12, marginLeft: 15 }}
                />
              </Touch>

              <View style={{ marginTop: 47 }}>
                {this.renderTitle("FUN88 USDT 存款支付方式", "s")}
                <View style={{ paddingHorizontal: 4, marginTop: 31 }}>
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        backgroundColor: "#1A2151",
                        marginRight: 0.29,
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 29,
                        borderTopLeftRadius: 8,
                      }}
                    >
                      <Text style={{ color: "#FFFFFF", fontSize: 12 }}>
                        极速虚拟币
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#1A2151",
                        flex: 1,
                        height: 29,
                        marginLeft: 0.29,
                        justifyContent: "center",
                        alignItems: "center",
                        borderTopRightRadius: 8,
                      }}
                    >
                      <Text style={{ color: "#FFFFFF", fontSize: 12 }}>
                        虚拟币支付
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={[
                        styles.tableLeft,
                        {
                          backgroundColor: "#141337",
                        },
                      ]}
                    >
                      <Text style={styles.tableText}>
                        以实时兑换率来进行交易
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableRight,
                        {
                          backgroundColor: "#141337",
                        },
                      ]}
                    >
                      <Text style={styles.tableText}>
                        以锁定的交易时间内的兑换率来进行交易
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={[
                        styles.tableLeft,
                        {
                          backgroundColor: "#1B1A3D",
                        },
                      ]}
                    >
                      <Text
                        style={styles.tableText}
                      >
                        您的专属存款二维码和钱包地址，
                        可储存于第三方平台重复使用
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableRight,
                        {
                          backgroundColor: "#1B1A3D",
                        },
                      ]}
                    >
                      <Text style={styles.tableText}>
                        每次您提交存款交易请求时，
                        所产生的二维码和收款地址仅限一次使用
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={[
                        styles.tableLeft,
                        {
                          backgroundColor: "#141337",
                        },
                      ]}
                    >
                      <Text
                        style={styles.tableText}
                      >
                        您无需浏览乐天堂的泰达币存款页面，
                        亦能直接从第三方平台直接进行存款
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableRight,
                        {
                          backgroundColor: "#141337",
                        },
                      ]}
                    >
                      <Text style={styles.tableText}>
                        您需要浏览乐天堂的泰达币 存款页面才能进行存款
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={[
                        styles.tableLeft,
                        {
                          backgroundColor: "#1B1A3D",
                        },
                      ]}
                    >
                      <Text
                        style={styles.tableText}
                      >
                        您的交易单号会在您的泰达币入账后才产生
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableRight,
                        {
                          backgroundColor: "#1B1A3D",
                        },
                      ]}
                    >
                      <Text style={styles.tableText}>
                        一旦完成提交存款后， 您即可获得交易单号
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={[
                        styles.tableLeft,
                        {
                          backgroundColor: "#141337",
                        },
                      ]}
                    >
                      <Text
                        style={styles.tableText}
                      >
                        您可以随时随地进行存款
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableRight,
                        {
                          backgroundColor: "#141337",
                        },
                      ]}
                    >
                      <Text style={styles.tableText}>
                        您必须在交易限定的时间内完成存款
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: 10,
                    marginBottom: 15,
                  }}
                >
                  <Touch
                    onPress={() => Actions.CTCpage({ actionType: "Deposit" })}
                    style={[styles.tutorialButton, { marginRight: 10 }]}
                  >
                    <Text style={styles.buttonText}>存款教程</Text>
                    <Image
                      resizeMode="stretch"
                      source={require("../../../images/icon/rightPink.png")}
                      style={{ width: 12, height: 12, marginLeft: 5 }}
                    />
                  </Touch>
                  <Touch
                    onPress={() =>
                      Actions.withdrawalGuide({
                        paymentWithdrawalType: "CCW",
                        coinTypes: "USDT-TRC20",
                      })
                    }
                    style={styles.tutorialButton}
                  >
                    <Text style={styles.buttonText}>提款教程</Text>
                    <Image
                      resizeMode="stretch"
                      source={require("../../../images/icon/rightPink.png")}
                      style={{ width: 12, height: 12, marginLeft: 5 }}
                    />
                  </Touch>
                </View>
              </View>

              <View style={{ marginTop: 47 }}>
                {this.renderTitle("常见问题")}
                <View style={{ marginTop: 35 }}>
                  {FaqData && FaqData.length
                    ? (
                      <>
                        {FaqData.map((item, index) => {
                          if (index >= 3) return;
                          return (
                            <View key={index} style={styles.questionWrap}>
                              {/* title */}
                              <TouchableOpacity
                                onPress={() =>
                                  this.setState({
                                    activeId: activeId == item.id ? 0 : item.id,
                                  })
                                }
                                style={{}}
                              >
                                <View
                                  style={{
                                    flex: 1,
                                    paddingTop: 15,
                                    paddingBottom: 15,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      lineHeight: 20,
                                      fontSize: 14,
                                      fontWeight: "bold",
                                      color: "#DFDFDF",
                                    }}
                                  >
                                    {item.title}
                                  </Text>
                                  <Image
                                    resizeMode="stretch"
                                    source={require("../../../images/icon/rightGrey.png")}
                                    style={{
                                      width: 12,
                                      height: 12,
                                      marginLeft: 15,
                                      transform: [
                                        {
                                          rotate:
                                            activeId == item.id
                                              ? "90deg"
                                              : "0deg",
                                        },
                                      ],
                                    }}
                                  />
                                </View>
                              </TouchableOpacity>

                              {
                                // content
                                activeId == item.id && (
                                  <View style={[{ paddingBottom: 20 }]}>
                                    <HTMLView
                                      value={item.body}
                                      stylesheet={styleHtmls}
                                    />
                                  </View>
                                )
                              }
                            </View>
                          );
                        })}
                        <Touch
                          onPress={() => Actions.USDTHelpCenter({ FaqData })}
                          style={styles.buttonAlign}
                        >
                          <Text style={styles.buttonText}>查看更多</Text>
                          <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                            <Image
                              resizeMode="stretch"
                              source={require("@/images/icon/rightPink.png")}
                              style={{ width: 12, height: 12, }}
                            />
                            <Image
                              resizeMode="stretch"
                              source={require("@/images/icon/rightPink.png")}
                              style={{ width: 12, height: 12, marginLeft: -5 }}
                            />
                          </View>
                        </Touch>
                      </>
                    )
                    : (<ActivityIndicator color="#00A6FF" />)}
                </View>
              </View>

              <View style={{ marginTop: 47 }}>
                {this.renderTitle("问题反馈")}
                <View
                  style={{
                    backgroundColor: "#212750",
                    marginTop: 20,
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <Flex
                    style={[
                      styles.bottomLineStyle,
                      {
                        backgroundColor: "#212750",
                        flexDirection: "column",
                        borderBottomWidth: 0,
                      },
                    ]}
                  >
                    <Flex.Item style={[styles.flexInputIem]}>
                      <TextInput
                        value={this.state.username}
                        style={[styles.inputStyle]}
                        editable={ApiPort.UserLogin ? false : true}
                        // onChangeText={value => this.setState({ username: value })}
                        onChangeText={(value) => this.testUserName(value)}
                        placeholder="请输入您的用户名"
                        placeholderTextColor="#DFDFDF" // 夜間模式導致顏色變淡，故額外寫
                        maxLength={16}
                        underlineColorAndroid="transparent"
                      />
                    </Flex.Item>

                    <Flex.Item style={{ alignSelf: "flex-start" }}>
                      {usernameST ? (
                        <Text
                          style={{
                            color: "#F92D2D",
                            fontSize: 12,
                            lineHeight: 20,
                          }}
                        >
                          {usernameST}
                        </Text>
                      ) : null}
                    </Flex.Item>

                    <Flex.Item
                      style={[
                        styles.flexInputIem,
                        { marginTop: 10, height: 100 },
                      ]}
                    >
                      <TextInput
                        value={this.state.feedback}
                        style={[styles.inputStyle]}
                        // onChangeText={value => this.setState({ feedback: value })}
                        onChangeText={(value) => this.testFeedBack(value)}
                        placeholder="请输入您的问题或意见"
                        placeholderTextColor="#DFDFDF" // 夜間模式導致顏色變淡，故額外寫
                        multiline={true} // 输入多行文字
                        textAlignVertical="top"
                        underlineColorAndroid="transparent"
                      // maxLength={200}
                      />
                    </Flex.Item>

                    <Flex.Item style={[{ alignSelf: "flex-start" }]}>
                      {feedbackST ? (
                        <Text
                          style={{
                            color: "#F92D2D",
                            fontSize: 12,
                            lineHeight: 16,
                          }}
                        >
                          {feedbackST}
                        </Text>
                      ) : (
                        <View style={{ height: 17 }} />
                      )}
                    </Flex.Item>
                  </Flex>
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: "left",
                      color: "#DFDFDF",
                      lineHeight: 17,
                    }}
                  >
                    我们期待倾听您使用加密货币过程中遇到的问题与宝贵意见。
                  </Text>

                  <Touch
                    onPress={this.postFeedbackForm.bind(this)}
                    style={[
                      {
                        backgroundColor: (username.length && feedback.length && feedbackBtnEnable) ? "#00A6FF" : "#2E345D",
                        marginTop: 30,
                        borderRadius: 5,
                      },
                    ]}
                  >
                    <Text style={[styles.buttonText]}>提交</Text>
                  </Touch>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {/* deposit button */}
        <View style={styles.depositButtonWrap}>
          <Touch
            onPress={() => {
              if (ApiPort.UserLogin) {
                Actions.DepositCenter();
                PiwikEvent("Deposit_USDTPage");
              } else {
                NavigationUtil.goToLogin();
              }
            }}
            style={styles.depositButton}
          >
            <Text style={[styles.buttonText, { color: "#fff", fontSize: 16 }]}>
              立即存款
            </Text>
          </Touch>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AboutUSDT);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#0C113D",
  },
  contentWrap: {
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 30,
  },
  contentContainer: {
    backgroundColor: "#0C113D",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    marginTop: -90,
  },
  titleWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  titleSubtitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  titleSubtitle2: {
    fontSize: 14,
    color: "#DFDFDF",
    marginTop: 20,
    lineHeight: 20,
  },
  buttonAlign: {
    borderColor: "#FFE4C4",
    borderWidth: 0.5,
    borderRadius: 5,
    marginBottom: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFE4C4",
    textAlign: "center",
    lineHeight: 40,
    fontWeight: "bold",
  },
  tableLeft: {
    marginRight: 0.29,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
  },
  tableRight: {
    flex: 1,
    height: 45,
    marginLeft: 0.29,
    justifyContent: "center",
    alignItems: "center",
  },
  tableText: {
    color: "#FFFFFF",
    fontSize: 8,
    paddingHorizontal: 15,
    textAlign: "center",
    lineHeight: 11,
  },
  questionWrap: {
    backgroundColor: "#0D133E",
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 20,
    // paddingBottom: 10,
  },
  tutorialButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "#FFE4C4",
    borderWidth: 0.5,
    borderRadius: 6,
    width: width * 0.45,
  },
  inputStyle: {
    // flex: 1,
    width: width - 60,
    fontSize: 12,
    color: "#DFDFDF",
    borderBottomWidth: 0,
    textAlign: "left",
    paddingRight: Platform.OS == "ios" ? 25 : 30,
    marginLeft: 0,
  },
  flexInputIem: {
    flexDirection: "row",
    flex: 1,
    width: width - 60,
    alignItems: "flex-start",
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    fontSize: 12,
    borderColor: "#FFE4C4",
    borderWidth: 1,
    borderRadius: 5,
    padding: Platform.OS == "ios" ? 10 : 0,
    paddingLeft: 10, // for android
    backgroundColor: "#212750",
  },
  depositButtonWrap: {
    position: "absolute",
    backgroundColor: "#0C113D",
    width: width,
    height: 76,
    padding: 10,
    bottom: 0,
    flex: 1,
    alignItems: "center",
  },
  depositButton: {
    backgroundColor: "#0CCC3C",
    width: width * 0.9,
    height: 40,
    borderRadius: 10,
  },
  dotStyle: {
    width: 10,
    height: 10,
    marginVertical: 5,
    borderRadius: 10,
  }
});

const styleHtmls = StyleSheet.create({
  div: {
    fontSize: 12,
    color: "#DFDFDF",
    lineHeight: 17,
  },
});
