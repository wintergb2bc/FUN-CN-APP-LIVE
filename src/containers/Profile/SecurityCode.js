import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Clipboard,
  Modal,
} from "react-native";
import { Toast } from "antd-mobile-rn";
import { connect } from "react-redux";
import Touch from "react-native-touch-once";
import { Toasts } from "../Toast";
import PiwikAction from "../../lib/utils/piwik";
const { width, height } = Dimensions.get("window");

class SecurityCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      securityCode: "",
      countdown: "00:00",
      countdownActive: true,
      errModal: false,
      getAgain: false,
      codeActive: 1, //1默认，2提示已复制，3提示已过期
    };
  }
  componentWillMount(props) {
    //先拿缓存，判断是否过期
    global.storage
      .load({
        key: "securityCode",
        id: "securityCode",
      })
      .then((data) => {
        console.log(data);
        let dateTime = data.expiredDateTime
          .split(".")[0]
          .replace("T", " ")
          .replace(/\-/g, "/");
        dateTime = new Date(dateTime).getTime();
        let now = new Date().getTime();
        if (dateTime > now) {
          this.setState({ securityCode: data });
          this.countdownTime(dateTime);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  componentWillUnmount() {
    this.Countdowns && clearInterval(this.Countdowns);
  }
  countdownTime(value) {
    this.Countdowns && clearInterval(this.Countdowns);

    let time = parseInt(
      (new Date(value).getTime() - new Date().getTime()) / 1000
    );
    let m, s, ms;

    this.Countdowns = setInterval(() => {
      time -= 1;
      m = parseInt(time / 60).toString();
      s = time - m * 60;
      if (s < 10) {
        s = "0" + s.toString();
      }
      ms = m + ":" + s;
      if (m < 10) {
        ms = "0" + m.toString() + ":" + s;
      }
      this.setState({ countdown: ms });

      if (m == 0 && s == 0) {
        this.setState({
          countdownActive: true,
          codeActive: 3,
          getAgain: false,
        });
        clearInterval(this.Countdowns);
      }
    }, 1000);
  }

  getCode() {
    if (!this.state.countdownActive) {
      return;
    }
    this.setState({ countdownActive: false });

    Toast.loading("加载中,请稍候...", 200);

    fetchRequest(ApiPort.Generate, "POST")
      .then((res) => {
        Toast.hide();
        if (res && res.isSuccess && res.result) {
          let data = res.result;
          try {
            //如果code相同，显示红色提示语，不同就替换旧的code
            if (
              this.state.securityCode &&
              this.state.securityCode.passcode == data.passcode
            ) {
              this.setState({ getAgain: true });
            } else {
              this.setState({ securityCode: data, codeActive: 1 });
              let dateTime = data.expiredDateTime
                .split(".")[0]
                .replace("T", " ")
                .replace(/\-/g, "/");
              this.countdownTime(dateTime);
              storage.save({
                key: "securityCode",
                id: "securityCode",
                data: data,
                expires: null,
              });
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          this.setState({ errModal: true });
        }
      })
      .catch((error) => {
        this.setState({ errModal: true });
        console.log(error);
      });
  }
  //复制
  copy(txt) {
    PiwikEvent("Copy_passcode_profilepage");
    if (this.state.codeActive == 3) {
      return;
    }
    try {
      const value = String(txt);
      Clipboard.setString(value);
      Toasts.success("已复制");
    } catch (error) {
      console.log(error);
    }
  }
  goLiveChat() {
    PiwikEvent("Contactcs_passcode_profilepage");
    LiveChatOpenGlobe();
    this.setState({ countdownActive: true, getAgain: false });
  }

  render() {
    const {
      securityCode,
      countdown,
      countdownActive,
      codeActive,
      getAgain,
      errModal,
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#EFEFF4", padding: 15 }}>
        <Modal
          animationType="none"
          transparent={true}
          visible={errModal}
          style={{ padding: 0, width: width / 1.3 }}
        >
          <View style={[styles.modalContainer]}>
            <View style={[styles.modalBox]}>
              <Touch
                onPress={() => {
                  this.setState({ errModal: false });
                }}
                style={{ position: "absolute", top: 10, right: 10 }}
              >
                <Image
                  resizeMode="contain"
                  source={require("../../images/icon/closeBlack.png")}
                  style={{ width: 24, height: 24 }}
                />
              </Touch>
              <Image
                resizeMode="contain"
                source={require("../../images/warn.png")}
                style={{ width: 60, height: 60 }}
              />
              <Text
                style={{
                  color: "#222",
                  fontSize: 18,
                  paddingTop: 20,
                  fontWeight: "bold",
                }}
              >
                无法生成安全码
              </Text>
              <Text
                style={{
                  color: "#222222",
                  paddingTop: 8,
                  marginBottom: 24,
                  textAlign: "center",
                  lineHeight: 24,
                }}
              >
                抱歉，我们目前无法生成安全码。 请稍后重试或联系在线客服寻求帮助
              </Text>
              <Touch
                onPress={() => {
                  this.setState({ errModal: false }, () => {
                    this.goLiveChat();
                  });
                }}
                style={[styles.modalBtn, { backgroundColor: "#00A6FF" }]}
              >
                <Text
                  style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}
                >
                  在线客服
                </Text>
              </Touch>
            </View>
          </View>
        </Modal>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            paddingBottom: 15,
          }}
        >
          <View style={{ padding: 15 }}>
            <Text style={{ color: "#222222", lineHeight: 24 }}>
              如果您需要取消红利，查询游戏流水/输赢或解除自我限制，请创建安全码并发送给
              <Text
                onPress={() => {
                  this.goLiveChat();
                }}
                style={{ color: "#25AAE1" }}
              >
                在线客服。
              </Text>
            </Text>
          </View>

          {
            //未创建
            securityCode == "" && (
              <Touch
                onPress={() => {
                  PiwikAction.SendPiwik("Generate_Passcode");
                  this.getCode();
                }}
                style={{
                  backgroundColor: "#00A6FF",
                  borderRadius: 10,
                  height: 44,
                  justifyContent: "center",
                  marginHorizontal: 20,
                  // width: width * 0.5,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  产生安全码
                </Text>
              </Touch>
            )
          }
          {
            //已创建
            securityCode != "" && (
              <View
                style={{
                  borderTopColor: "#E5E5E5",
                  borderTopWidth: 1,
                  marginHorizontal: 15,
                }}
              >
                {codeActive === 1 && (
                  <>
                    <Touch
                      onPress={() => {
                        this.copy(securityCode.passcode);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        marginVertical: 16,
                      }}
                    >
                      {securityCode.passcode.split("").map((num, index) => {
                        return (
                          <Text
                            key={index}
                            style={{
                              textAlign: "center",
                              fontSize: 36,
                              color: "#0CCC3C",
                              padding: 5,
                              fontWeight: "bold",
                            }}
                          >
                            {num}
                          </Text>
                        );
                      })}
                      <Image
                        source={require("../../images/icon/copy.png")}
                        resizeMode="stretch"
                        style={{ width: 16, height: 16, marginLeft: 11 }}
                      />
                    </Touch>
                    <Text style={{ color: "#000", textAlign: "center" }}>
                      已创建安全码，您的安全码将在{" "}
                      <Text style={{ color: "#EE0001" }}>{countdown}</Text>{" "}
                      内有效。
                    </Text>
                  </>
                )}
                {codeActive == 3 && (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={require("../../images/Error.png")}
                      style={{
                        width: 36,
                        height: 36,
                        marginTop: 32,
                        marginBottom: 16,
                      }}
                    />
                    <Text
                      style={{
                        color: "#EB2121",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      您的安全码已失效
                    </Text>
                  </View>
                )}
                {getAgain && (
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: "#FFF5BF",
                      borderRadius: 8,
                      padding: 12,
                      marginTop: 17,
                      marginBottom: -16,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#83630B",
                        lineHeight: 20,
                        fontWeight: "bold",
                      }}
                    >
                      此安全码仍可使用。请使用此安全码或等待限期结束创建新的安全码。
                    </Text>
                  </View>
                )}
                <View style={{ alignItems: "center" }}>
                  <Touch
                    onPress={() => {
                      PiwikAction.SendPiwik("Regenerate_Passcode");
                      this.getCode();
                    }}
                    style={{
                      backgroundColor: countdownActive ? "#00A6FF" : "#EFEFF4",
                      borderRadius: 5,
                      width: "100%",
                      marginTop: 32,
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: countdownActive ? "#fff" : "#BCBEC3",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      创建新的安全码
                    </Text>
                  </Touch>
                </View>
              </View>
            )
          }
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
  userSetting: state.userSetting,
});

export default connect(mapStateToProps)(SecurityCode);

const styles = StyleSheet.create({
  modalContainer: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, .6)",
    position: "relative",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: width * 0.9,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalBtn: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: "100%",
  },
});
