import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import {
  Toast,
} from "antd-mobile-rn";
import { connect } from "react-redux";
import Touch from "react-native-touch-once";
import { passwordReg } from "../../../actions/Reg";

const { width, height } = Dimensions.get("window");
class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password1: "",
      password2: "",
      password3: "",
      passwordST1: "",
      passwordST2: "",
      passwordST3: "",
      changeBtn: false,
      eyse1: true,
      eyse2: true,
      eyse3: true,
    };
  }

  password1(value) {
    let passwordST1 = "";
    if (value == "") {
      passwordST1 = "请输入当前密码";
    } else if (!passwordReg.test(value)) {
      passwordST1 =
        "仅可使用字母 ‘A-Z’, ‘a-z’ , 数字 ‘0-9’ （可以包含 ^＃$@ 中的特殊字符）";
    } else if (value == this.state.password2) {
      passwordST1 = "新密码不能与旧密码相同";
    } else if (value == this.state.password3) {
      passwordST1 = "新密码不能与旧密码相同";
    } else if (
      this.state.password2 &&
      this.state.password2 == this.state.password3
    ) {
      this.setState({ passwordST2: "", passwordST3: "" });
    }
    this.setState({ passwordST1, password1: value }, () => {
      setTimeout(() => {
        this.validation();
      }, 600);
    });
  }
  password2(value) {
    let passwordST2 = "";
    if (value == "") {
      passwordST2 = "请输入新密码";
    } else if (!passwordReg.test(value)) {
      passwordST2 =
        "仅可使用字母 ‘A-Z’, ‘a-z’ , 数字 ‘0-9’ （可以包含 ^＃$@ 中的特殊字符）";
    } else if (value == this.state.password1) {
      passwordST2 = "新密码不能与旧密码相同";
    } else if (this.state.password3 != "" && value != this.state.password3) {
      passwordST2 = "两次输入密码不相同";
    } else if (value == this.state.password3) {
      this.setState({ passwordST3: "" });
    }
    if ((this.state.passwordST1 == "新密码不能与旧密码相同")) {
      this.setState({ passwordST1: "" });
    }
    this.setState({ passwordST2, password2: value }, () => {
      setTimeout(() => {
        this.validation();
      }, 600);
    });
  }
  password3(value) {
    let passwordST3 = "";
    if (value == "") {
      passwordST3 = "请再次输入新密码";
    } else if (!passwordReg.test(value)) {
      passwordST3 =
        "仅可使用字母 ‘A-Z’, ‘a-z’ , 数字 ‘0-9’ （可以包含 ^＃$@ 中的特殊字符）";
    } else if (value == this.state.password1) {
      passwordST3 = "新密码不能与旧密码相同";
    } else if (this.state.password2 != "" && value != this.state.password2) {
      passwordST3 = "两次输入密码不相同";
    } else if (value == this.state.password2) {
      this.setState({ passwordST2: "" });
    }
    if ((this.state.passwordST1 == "新密码不能与旧密码相同")) {
      this.setState({ passwordST1: "" });
    }
    this.setState({ passwordST3, password3: value }, () => {
      this.validation();
    });
  }
  validation() {
    const st = this.state;
    let changeBtn = true;
    if (
      !st.password1 ||
      !st.password2 ||
      !st.password3 ||
      st.password2 != st.password3 ||
      st.password1 == st.password2 ||
      st.passwordST1 ||
      st.passwordST2
    ) {
      changeBtn = false;
    }
    this.setState({ changeBtn });
  }

  changeBtn() {
    if (!this.state.changeBtn) {
      return;
    }
    const MemberData = {
      oldPassword: this.state.password1,
      newPassword: this.state.password2,
    };
    PiwikEvent("Submit_PWmodification_personal");
    Toast.loading("更改中,请稍候...", 200);
    fetchRequest(ApiPort.ChangePassword, "PUT", MemberData)
      .then((res) => {
        Toast.hide();
        if (res.isSuccess == true) {
          // console.log("关闭快捷登录方式");
          let fastLoginKey = "fastLogin" + userNameDB.toLowerCase();
          let sfastLoginId = "fastLogin" + userNameDB.toLowerCase();

          global.storage.remove({
            key: fastLoginKey,
            id: sfastLoginId,
          });
          Toast.success("更改成功!", 2, () => {
            //修改成功后退出
            navigateToSceneGlobeX();
          });
        } else if (res.isSuccess == false) {
          Toast.fail(res.message);
        }
      })
      .catch((error) => {
        if (error.message == "MEM00050") {
          Toast.fail("没有更改任何栏位");
        } else {
          Toast.fail("出现错误请稍候重试");
        }
      });
  }

  render() {
    const {
      passwordST1,
      passwordST2,
      passwordST3,
      password1,
      password2,
      password3,
      changeBtn,
      eyse1,
      eyse2,
      eyse3,
    } = this.state; //註冊訊息
    return (
      <View style={{ flex: 1, backgroundColor: "#EFEFF4" }}>
        <View style={styles.boxWrap}>
          <Text style={styles.inputTitle}>当前密码</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={password1}
              placeholder="请输入 6-16位密码"
              placeholderTextColor={"#999999"}
              onChangeText={(value) => {
                this.password1(value);
              }}
              secureTextEntry={eyse1}
              maxLength={16}
              style={[
                styles.limitListsInput,
                // {
                //   borderColor:
                //     IdentityCard != "" && !isIdentityCard ? "#EB2121" : "#CCCCCC",
                // },
              ]}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ eyse1: !eyse1 });
              }}
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              style={{ position: "absolute", right: 15 }}
            >
              <Image
                resizeMode="contain"
                source={
                  eyse1
                    ? require("../../../images/login/close_eye.png")
                    : require("../../../images/login/eyse.png")
                }
                style={{ width: 18, height: 18 }}
              />
            </TouchableOpacity>
          </View>
          {passwordST1 != "" && (
            <View style={styles.infoWrap}>
              <Text style={styles.infoText}>{passwordST1}</Text>
            </View>
          )}

          <Text style={[styles.inputTitle, { marginTop: 20 }]}>新的密码</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={password2}
              placeholder="请输入 6-16位密码"
              placeholderTextColor={"#999999"}
              onChangeText={(value) => {
                this.password2(value);
              }}
              secureTextEntry={eyse2}
              maxLength={16}
              style={[
                styles.limitListsInput,
                // {
                //   borderColor:
                //     IdentityCard != "" && !isIdentityCard ? "#EB2121" : "#CCCCCC",
                // },
              ]}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ eyse2: !eyse2 });
              }}
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              style={{ position: "absolute", right: 15 }}
            >
              <Image
                resizeMode="contain"
                source={
                  eyse2
                    ? require("../../../images/login/close_eye.png")
                    : require("../../../images/login/eyse.png")
                }
                style={{ width: 18, height: 18 }}
              />
            </TouchableOpacity>
          </View>
          {passwordST2 != "" && (
            <View style={styles.infoWrap}>
              <Text style={styles.infoText}>{passwordST2}</Text>
            </View>
          )}

          <Text style={[styles.inputTitle, { marginTop: 20 }]}>
            确认新的密码
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              value={password3}
              placeholder="再次输入密码确认"
              placeholderTextColor={"#999999"}
              onChangeText={(value) => {
                this.password3(value);
              }}
              secureTextEntry={eyse3}
              style={[
                styles.limitListsInput,
                // {
                //   borderColor:
                //     IdentityCard != "" && !isIdentityCard ? "#EB2121" : "#CCCCCC",
                // },
              ]}
            />

            <TouchableOpacity
              onPress={() => {
                this.setState({ eyse3: !eyse3 });
              }}
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              style={{ position: "absolute", right: 15 }}
            >
              <Image
                resizeMode="contain"
                source={
                  eyse3
                    ? require("../../../images/login/close_eye.png")
                    : require("../../../images/login/eyse.png")
                }
                style={{ width: 18, height: 18 }}
              />
            </TouchableOpacity>
          </View>
          {passwordST3 != "" && (
            <View style={styles.infoWrap}>
              <Text style={styles.infoText}>{passwordST3}</Text>
            </View>
          )}
        </View>
        <Touch
          onPress={() => {
            this.changeBtn();
          }}
          style={[
            styles.btn,
            {
              backgroundColor: changeBtn ? "#00A6FF" : "#E1E1E6",
            },
          ]}
        >
          <Text
            style={[
              styles.btnTxt,
              {
                color: changeBtn ? "#fff" : "#BCBEC3",
              },
            ]}
          >
            提交
          </Text>
        </Touch>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
  userSetting: state.userSetting,
});

export default connect(mapStateToProps)(ChangePassword);

const styles = StyleSheet.create({
  boxWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 15,
    marginBottom: 30,
    paddingTop: 30,
    paddingBottom: 18,
    paddingHorizontal: 15,
  },
  inputTitle: {
    color: "#666666",
    fontSize: 14,
    marginBottom: 10,
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginHorizontal: 15,
    height: 44,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: "bold",
  },
  limitListsInput: {
    borderRadius: 4,
    height: 46,
    borderWidth: 1,
    paddingHorizontal: 15,
    width: "100%",
    borderColor: "#E0E0E0",
  },
  inputRow: {
    height: 46,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
  },
  infoWrap: {
    backgroundColor: "#FEE5E5",
    borderRadius: 8,
    paddingLeft: 12,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    color: "#EB2121",
    fontSize: 12,
    paddingVertical: 12,
    alignSelf: "flex-start",
    lineHeight: 17,
  },
});
