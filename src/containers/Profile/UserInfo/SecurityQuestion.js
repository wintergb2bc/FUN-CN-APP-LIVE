import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
} from "react-native";
import { Actions } from "react-native-router-flux";
import {
  Toast,
} from "antd-mobile-rn";
import { connect } from "react-redux";
import Touch from "react-native-touch-once";
import { Toasts } from "../../../containers/Toast";

const { width, height } = Dimensions.get("window");
class SecurityQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      security: "",
      securityData: [],
      successPopup: false,
      addBtn: false,
    };
  }
  componentWillMount(props) {
    this.GetSecretQuestions();
  }

  //获取安全问题
  GetSecretQuestions() {
    Toast.loading("加载中,请稍候...");
    fetchRequest(ApiPort.GetSecretQuestions, "GET")
      .then((date) => {
        Toast.hide();

        if (date.result) {
          let securityIndex = 0;
          let id = this.props.memberInfo.secretQID;
          securityIndex = date.result.findIndex((item) => {
            return item.id == id;
          });
          securityIndex = securityIndex == -1 ? 0 : securityIndex;

          this.setState({ securityData: date.result, securityIndex });
        }
      })
      .catch(() => {
        Toast.fail("网络错误，请重试", 2);
      });
  }

  security(value) {
    this.setState({ security: value, addBtn: true });
  }

  submit() {
    const { securityData, securityIndex, security } = this.state;
    if (!this.state.addBtn) {
      return;
    }
    let MemberData = {
      key: "SecretQuestionAnswer",
      value1: securityData[securityIndex].id,
      value2: security,
    };

    Toast.loading("提交中,请稍候...", 200);
    fetchRequest(window.ApiPort.Register, "PATCH", MemberData)
      .then((data) => {
        Toast.hide();
        if (data.result && data.result.isSuccess) {
          this.setState({
            successPopup: true,
          });
          Toast.hide();
        } else {
          Toasts.fail("Error");
        }
      })
      .catch((error) => {
        Toasts.fail("Error", 1);
        console.log(error);
      });
  }

  closePopup = () => {
    Actions.pop();
    this.props.getUser();
  };

  // 檢查有沒有填過提問，如有return false
  checkSecretQID = () => {
    const { memberInfo } = this.props;
    return !memberInfo.secretQID || memberInfo.secretQID == 0;
  }

  render() {
    const { securityData, securityIndex, security, successPopup, addBtn } =
      this.state;
    const { memberInfo } = this.props;
    console.log(this.state);
    return (
      <View style={{ flex: 1, backgroundColor: "#EFEFF4" }}>
        <View style={[styles.listData, { margin: 15 }]}>
          <Text style={{ color: "#666666", lineHeight: 25 }}>安全提问</Text>
          {!this.checkSecretQID() && memberInfo.securityQuestion ? (
            <View style={styles.gender}>
              <Image
                resizeMode="contain"
                source={require("../../../images/icon/checked.png")}
                style={{ width: 18, height: 18 }}
              />
              <Text style={{ color: "#222", marginLeft: 10 }}>
                {securityData[memberInfo.secretQID-1]?.localizedName}
              </Text>
            </View>
          ):(
            securityData.map((item, index) => {
              return (
                <Touch
                  key={index}
                  style={styles.gender}
                  onPress={() => {
                    this.setState({ securityIndex: index });
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={
                      securityIndex == index
                        ? require("../../../images/icon/checked.png")
                        : require("../../../images/icon/uncheck.png")
                    }
                    style={{ width: 18, height: 18 }}
                  />
                  <Text style={{ color: "#222", marginLeft: 10 }}>
                    {item.localizedName}
                  </Text>
                </Touch>
              );
            })
          )}
        </View>
        <View style={[styles.listData, { marginHorizontal: 15 }]}>
          <Text style={{ color: "#666666", marginBottom: 10 }}>
            安全提问答案
          </Text>
          <View style={[styles.inputView]}>
            <TextInput
              value={
                memberInfo.secretQID == 0
                  ? security
                  : this.props.memberInfo.securityAnswer
                    ? this.props.memberInfo.securityAnswer.replace(
                      /^(.).*(.)$/,
                      "$1*******"
                    )
                    : security
              }
              style={[
                styles.limitListsInput,
                {
                  color: "#222",
                },
              ]}
              placeholder={""}
              placeholderTextColor={"#666"}
              maxLength={50}
              editable={memberInfo.secretQID == 0}
              onChangeText={(value) => {
                this.security(value);
              }}
            />
          </View>
        </View>
        <Touch
          onPress={() => {
            this.submit();
          }}
          style={[
            styles.btn,
            {
              backgroundColor: addBtn ? "#00A6FF" : "#E1E1E6",
            },
          ]}
        >
          <Text
            style={[
              styles.btnTxt,
              {
                color: addBtn ? "#fff" : "#BCBEC3",
              },
            ]}
          >
            {!this.checkSecretQID() ? "修改" : "提交"}
          </Text>
        </Touch>

        <Modal animationType="fade" transparent={true} visible={successPopup}>
          <View style={[styles.modalContainer]}>
            <View style={[styles.modalBox]}>
              <View style={[styles.modalTop, { justifyContent: "center" }]}>
                <Text style={styles.modalTopText}>安全提问设置完成</Text>
              </View>
              <View style={styles.modalBody}>
                <View>
                  <Text style={[styles.manualDepositText, { color: "#000" }]}>
                    恭喜您，安全提问已经设置完成。日后可透过安全提问进行验证。
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 24,
                  }}
                >
                  <View style={styles.modalBtnBox}>
                    <TouchableOpacity
                      style={[
                        styles.modalBtn,
                        { backgroundColor: "#00A6FF", borderColor: "#00A6FF" },
                      ]}
                      onPress={() => this.closePopup()}
                    >
                      <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                        确认
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
  userSetting: state.userSetting,
});

export default connect(mapStateToProps)(SecurityQuestion);

const styles = StyleSheet.create({
  listData: {
    padding: 15,
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  gender: {
    display: "flex",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    alignItems: "center",
    height: 46,
    marginTop: 5,
    flexDirection: "row",
    paddingLeft: 15,
  },
  limitListsInput: {
    borderRadius: 10,
    height: 44,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderColor: "#ccc",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginHorizontal: 15,
    height: 44,
    marginTop: 15,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, .6)",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: width * 0.9,
    overflow: "hidden",
  },
  modalTop: {
    height: 50,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#00A6FF",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  modalTopText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBody: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  modalBtnBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalBtn: {
    height: 44,
    width: '100%',
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  modalBtnText: {
    fontWeight: "bold",
    color: "#58585B",
    fontSize: 16,
  },
  manualDepositText: {
    lineHeight: 22,
    fontSize: 14,
  },
});
