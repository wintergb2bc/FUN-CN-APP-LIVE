import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import { Toast } from "antd-mobile-rn";

const { width } = Dimensions.get("window");
import { connect } from "react-redux";
import PiwikAction from "../../lib/utils/piwik";

class LoginOtp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phones: false,
      emails: false,
      memberCode: "",
      memberInfo: this.props.memberInfo,
      emailVerifyTime: 5,
      smsVerifyTime: 5,

      smsShow: true,
      emailShow: true,
      serviceAction: this.props.from === "reSetPwd" ? "Revalidate" : "OTP"
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      title: this.props.from === "loginOTP" ? "安全验证" : "安全系统升级",
    });
    let memberInfo = this.props.memberInfo || "";
    if (memberInfo) {
      const phoneData = memberInfo.contacts.filter(
        (item) => item.contactType.toLocaleLowerCase() == "phone"
      )[0];
      const emailData = memberInfo.contacts.filter(
        (item) => item.contactType.toLocaleLowerCase() == "email"
      )[0];

      let memberCode = memberInfo.memberCode;
      let phones = (phoneData && phoneData.contact) || false;
      let emails = (emailData && emailData.contact) || false;

      this.setState({ phones, emails, memberCode });
      this.getVerifyTimes();
    }
  }

  componentDidMount() {
    global.storage.remove({
      key: "VerifyPhone",
      id: "VerifyPhone",
    });
    global.storage.remove({
      key: "VerifyEmail",
      id: "VerifyEmail",
    });
    global.storage.remove({
      key: "verifyTimes",
      id: "verifyTimes",
    });
    this.getLiveChat();
  }

  componentWillUnmount() {
  }

  getLiveChat() {
    fetchRequest(ApiPort.LiveChat, "GET") //拿克服連結
      .then((data) => {
        LiveChatX = data.result;
      })
      .catch((error) => {
      });
  }

  getVerifyTimes() {
    //获取剩余次数
    Toast.loading("加载中...", 100);
    let processed = [this.getVerifyEmailTimes(), this.getVerifySMSTimes()];
    Promise.all(processed).then((res) => {
      if (res) {
        Toast.hide();
        console.log(processed);
        console.log(res);

        // 兩種驗證次數都剩0 顯示客服

        // 其中一種驗證次數剩0 顯示另外一種
      }
    });
  }

  getVerifyEmailTimes() {
    return fetchRequest(
      ApiPort.VerificationAttempt + `?ServiceAction=${this.state.serviceAction}&channelType=Email&`,
      "GET"
    )
      .then((res) => {
        this.setState({
          emailVerifyTime: res.result.attempt,
          emailShow: res.result.attempt == 0 ? false : true
        });
      })
      .catch(() => {
      });
  }

  getVerifySMSTimes() {
    return fetchRequest(
      ApiPort.VerificationAttempt + `?ServiceAction=${this.state.serviceAction}&channelType=SMS&`,
      "GET"
    )
      .then((res) => {
        this.setState({
          smsVerifyTime: res.result.attempt,
          smsShow: res.result.attempt == 0 ? false : true
        });
      })
      .catch(() => {
      });
  }

  goSetPassword(key, type) {
    Actions.SetVerification({
      dataPhone: this.state.phones,
      dataEmail: this.state.emails,
      verificaType: type,
      memberCode: this.state.memberCode,
      smsShow: this.state.smsShow,
      emailShow: this.state.emailShow,
      from: this.props.from,
      updateState: (type) => this.updateState(type)
    });
  }

  updateState = (type) => {
    console.log('updateState')
    console.log(type)
    if (type === "email") {
      this.setState({ emailShow: false });
    }
    if (type === "phone") {
      this.setState({ smsShow: false });
    }
  };

  render() {
    window.PromptPagPop = () => {
      Actions.pop();
    };
    console.log(this.state);
    const {
      phones,
      emails,
      emailShow,
      smsShow
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
            <View
              style={{
                borderRadius: 8,
                backgroundColor: "#F7F7FC",
                padding: 15,
              }}
            >
              {this.props.from === "reSetPwd" && (
                <Text style={{
                  color: "#000",
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 16,
                }}>保护您的账户安全</Text>
              )}
              <Text
                style={{
                  color: "#666",
                  lineHeight: 20,
                  paddingBottom: 16,
                  fontSize: 14,
                }}
              >
                为了更好的保护您的账户安全，提高账户安全等级，反劫持并降低交易风险，我们需要您进行账户信息验证。
              </Text>
              <View style={{ display: "flex", alignItems: "flex-end" }}>
                <Touch
                  onPress={() => {
                    if (this.props.from === "loginOTP") {
                      Actions.SecurityNotice();
                    } else {
                      Actions.SecurityUpdateNotice();
                    }

                  }}
                  style={[
                    styles.moreBtn,
                    {
                      width: 90,
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text style={{ color: "#00a6ff" }}>了解更多</Text>
                </Touch>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "row",
                marginTop: 15,
              }}
            >
              {phones && smsShow && (
                <Touch
                  onPress={() => {
                    this.goSetPassword(phones, "phone");
                    PiwikAction.SendPiwik("VerificationClickPhone");
                  }}
                  style={styles.btnTouch}
                >
                  <View style={styles.listBtn}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/loginOtp/Phone.png")}
                      style={{ width: 54, height: 54, marginBottom: 16 }}
                    />
                  </View>
                  <View
                    style={[styles.btnTxt, {
                      width: !emailShow ? '50%' : '90%'
                    }]}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 'bold'
                      }}
                    >
                      通过手机验证
                    </Text>
                  </View>
                </Touch>
              )}
              {smsShow && emailShow && (
                <View style={{ flex: 0.1 }}/>
              )}
              {emails && emailShow && (
                <Touch
                  onPress={() => {
                    this.goSetPassword(emails, "email");
                    PiwikAction.SendPiwik("VerificationClickEmail");
                  }}
                  style={styles.btnTouch}
                >
                  <View style={styles.listBtn}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/loginOtp/Email.png")}
                      style={{ width: 54, height: 54, marginBottom: 16 }}
                    />
                  </View>
                  <View
                    style={[styles.btnTxt, {
                      width: !smsShow ? '50%' : '90%'
                    }]}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 'bold'
                      }}
                    >
                      通过邮箱验证
                    </Text>
                  </View>
                </Touch>
              )}

              {!smsShow && !emailShow && (
                <Touch
                  onPress={() => {
                    LiveChatOpenGlobe();
                  }}
                  style={styles.btnTouch}
                >
                  <View style={styles.listBtn}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/loginOtp/CS.png")}
                      style={{ width: 54, height: 54, marginBottom: 16 }}
                    />
                  </View>
                  <View style={[styles.btnTxt, { width: '50%' }]}>
                    <Text style={{ color: "#fff" }}>联系在线客服</Text>
                  </View>
                </Touch>
              )}
            </View>

            <Touch
              onPress={() => {
                Actions.home1();
                window.navigateToSceneGlobeX && window.navigateToSceneGlobeX();
              }}
              style={{ marginTop: 46, alignItems: "center" }}
            >
              <Text style={{ color: "#00A6FF" }}>跳过验证</Text>
            </Touch>
          </View>
        </ScrollView>

        {/*客服懸浮球*/}
        {/* <LivechatDragHoliday /> */}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LoginOtp);

const styles = StyleSheet.create({
  btnTouch: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    // height: 146,
    backgroundColor: "#F7F7FC",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  listBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.22,
    height: width * 0.15,
  },
  btnTxt: {
    width: '90%',
    height: 44,
    backgroundColor: "#00a6ff",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  nobtnTxt: {
    width: '90%',
    height: 44,
    backgroundColor: "#e8e8e8",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  moreBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00a6ff",
  },
});
