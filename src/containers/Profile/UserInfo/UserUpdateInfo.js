import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Toast, List, DatePicker } from "antd-mobile-rn";
import { connect } from "react-redux";
import moment from "moment";
import { IdentityCardReg } from "../../../actions/Reg";
import Touch from "react-native-touch-once";
import { nameTest } from "../../../actions/Reg";
import ListItems from "antd-mobile-rn/lib/list/style/index.native";
import { Toasts } from "../../../containers/Toast";

const { width, height } = Dimensions.get("window");

// 只能修改一次
const onlyModifyOnce = ["IdentityCard", "name", "DOB", "gender"];

const DatePickerLocale = {
  DatePickerLocale: {
    year: "年",
    month: "月",
    day: "日",
    hour: "",
    minute: "",
  },
  okText: "确定",
  dismissText: "取消",
};

const newStyle = {};
for (const key in ListItems) {
  if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(ListItems[key]) };
    newStyle[key].opacity = 0;
    newStyle[key].color = "transparent";
    newStyle[key].backgroundColor = "transparent";
    newStyle[key].height = 50;
    newStyle[key].width = width;
  }
}

class UserUpdateInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      IdentityCard: "",
      isIdentityCard: false,

      FirstName: "",
      isFirstName: false,
      isName: false,

      DOB: "",
      forShowDOB: "",
      isDOB: false,

      gender: "Male",

      IsCall: true,
      IsSMS: true,
      IsEmail: true,
      contactSelectST: "",

      QQ: "",
      WX: "",
      QQWXST: "",

      confirmPopup: false,

      addBtn:
        this.props.form === "gender" || this.props.form === "contact"
          ? true
          : false,
    };
  }

  componentWillMount(props) {
    this.validation();

    if (!this.props.from) {
      Toast.fail("Error");
      Actions.pop();
    }

    this.props.navigation.setParams({
      title: this.navTitle(),
    });

    if (this.props.from === "contact") {
      console.log("heelo");
      let OfferContacts = this.props.memberInfo.offerContacts;
      console.log("OfferContacts");
      console.log(OfferContacts);
      if (OfferContacts) {
        this.setState({
          IsCall: OfferContacts.isCall,
          IsSMS: OfferContacts.isSMS,
          IsEmail: OfferContacts.isEmail,
        });
      }
    }

    if (this.props.from === "QQ") {
      let contacts = this.props.memberInfo.contacts;
      let tempQQ = contacts.filter((v) => v.contactType === "QQ");

      if (tempQQ.length > 0) {
        this.setState({
          QQ: tempQQ[0].contact,
        });
      }
    }

    if (this.props.from === "WX") {
      let contacts = this.props.memberInfo.contacts;
      let tempQQ = contacts.filter((v) => v.contactType === "WeChat");

      if (tempQQ.length > 0) {
        this.setState({
          WX: tempQQ[0].contact,
        });
      }
    }
  }

  navTitle = () => {
    switch (this.props.from) {
      case "name":
        return "姓名";
      case "Address":
        return "联系地址";
      case "IdentityCard":
        return "身份证号码";
      case "DOB":
        return "出生日期";
      case "gender":
        return "性别";
      case "contact":
        return "联系方式";
      case "QQ":
        return "QQ号";
      case "WX":
        return "微信号";
      default:
        return "";
    }
  };

  getData = () => {
    switch (this.props.from) {
      case "IdentityCard":
        return {
          key: "IdentityCard",
          value1: this.state.IdentityCard,
        };
      case "Address":
        return {
          wallet: "MAIN",
          addresses: {
            address: this.state.address,
            city: "",
            country: "中国",
            nationId: 1,
          },
        };
      case "name":
        return { firstName: this.state.FirstName };
      case "DOB":
        return { dob: this.state.DOB };
      case "gender":
        return { gender: this.state.gender };
      case "contact":
        return {
          offerContacts: {
            isCall: this.state.IsCall,
            isSMS: this.state.IsSMS,
            isEmail: this.state.IsEmail,
          },
        };
      case "QQ":
        return {
          key: "QQ",
          value1: this.state.QQ,
        };
      case "WX":
        return {
          key: "WeChat",
          value1: this.state.WX,
        };
      default:
        return null;
    }
  };

  getType = () => {
    switch (this.props.from) {
      case "IdentityCard":
        return "PATCH";
      case "QQ":
        return "PATCH";
      case "WX":
        return "PATCH";
      default:
        return "PUT";
    }
  };

  openConfirmPopup = () => {
    this.setState({
      confirmPopup: true,
    });
  };

  closeConfirmPopup = () => {
    this.setState({
      confirmPopup: false,
    });
  };

  submit() {
    console.log("submit");
    let MemberData = this.getData();
    if (!this.state.addBtn) {
      return;
    }
    if (!MemberData) {
      Toast.fail("Error");
      return;
    }

    let type = this.getType();

    Toast.loading("提交中,请稍候...", 200);
    fetchRequest(window.ApiPort.Register, type, MemberData)
      .then((data) => {
        Toast.hide();
        if (data.result.isSuccess) {
          Toasts.success("更新成功!");
          Actions.pop();
          this.props.getUser();
        } else if (!data.result.isSuccess) {
          const error = data.errors ? data.errors[0] : null;
          if (error) {
            if (error.errorCode == "MEM00050") {
              Toasts.fail("您并未修改资料。");
            } else {
              Toasts.fail(error.message);
            }
          } else {
            Toasts.fail("更新失败");
          }
        }
      })
      .catch((error) => {
        console.log(error);
        Toasts.fail(error.errorMessage, 1);
      });
  }

  accountPiwik(code) {
    switch (code) {
      case "userName":
        PiwikEvent("Submit_realname_personal");
        break;
      case "birthday":
        PiwikEvent("Submit_BOD_personal");
        break;
      case "gender":
        PiwikEvent("Submit_gender_personal");
        break;
      case "contact":
        PiwikEvent("Submit_contact_personal");
        break;
      case "QQ":
        PiwikEvent("Submit_QQ_personal");
        break;
      case "WX":
        PiwikEvent("Submit_WX_personal");
        break;
      case "Phone_contact_personal":
        PiwikEvent("Phone_contact_personal");
        break;
      case "MSG_contact_personal":
        PiwikEvent("MSG_contact_personal");
        break;
      case "Email_contact_personal":
        PiwikEvent("Email_contact_personal");
        break;
      case "wallet":
        PiwikEvent("Submit_preferredacc_personal");
        break;
      case "security":
        PiwikEvent("Submit_securityquestion_personal");
        break;
      default:
        break;
    }
  }

  //联系方式选择
  contactSelect() {
    const st = this.state;
    let arrs = [st.IsCall, st.IsSMS, st.IsEmail];
    arrs = arrs.filter((item) => {
      return item == true;
    });
    if (st.IsNonMandatory)
      return this.setState({ addBtn: true, contactSelectST: "" });
    if (!st.IsNonMandatory) {
      if (arrs.length < 2) {
        this.setState({
          addBtn: false,
          contactSelectST: "请至少选择两个联系方式。",
        });
      } else {
        this.setState({ addBtn: true, contactSelectST: "" });
      }
    }
  }

  fsd = () => {
    this.setState({QQ : value})
  }
  QQWX(val) {
    // this.setState({QQ : value}) 
    // return
    const QQTest = /^[1-9]\d{4,15}$/;
    const value = val.replace(' ', '')

    let QQWXST = "";
    let title = this.props.from === "QQ" ? "QQ号" : "微信号";
    if (value == "") {
      QQWXST = "请输入您的" + title;
      this.setState({ QQ: value, QQWXST }, () => {
        this.validation();
      });
    } else if (this.props.from == "QQ") {
      if (QQTest.test(value) != true) {
        QQWXST = "QQ号格式错误";
      }
      this.setState({ QQ: value, QQWXST }, () => {
        this.validation();
      });
    } else if (this.props.from == "WX") {
      if (value.length < 6) {
        QQWXST = "微信号格式错误";
      }
      this.setState({ WX: value, QQWXST }, () => {
        this.validation();
      });
    }
  }

  validation() {
    const {
      isIdentityCard,
      FirstName,
      isName,
      DOB,
      gender,
      contactSelectST,
      QQWXST,
      QQ,
      WX,
    } = this.state;
    let addBtn = false;
    console.log("validation");
    console.log(this.state);
    if (this.props.from === "name" && FirstName !== "" && isName) {
      addBtn = true;
    } else if (this.props.from === "IdentityCard" && isIdentityCard) {
      addBtn = true;
    } else if (this.props.from === "DOB" && DOB !== "") {
      addBtn = true;
    } else if (this.props.from === "gender" && gender !== "") {
      addBtn = true;
    } else if (this.props.from === "contact" && contactSelectST === "") {
      addBtn = true;
    } else if (this.props.from === "QQ" && QQWXST === "" && QQ !== "") {
      addBtn = true;
    } else if (this.props.from === "WX" && QQWXST === "" && WX !== "") {
      addBtn = true;
    }
    this.setState({ addBtn });
  }

  render() {
    const {
      IdentityCard,
      isIdentityCard,
      FirstName,
      isName,
      DOB,
      gender,
      IsCall,
      IsEmail,
      IsSMS,
      contactSelectST,
      QQWXST,
      QQ,
      addBtn,
      WX,
      confirmPopup,
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#EFEFF4" }}>
        <Modal animationType="fade" transparent={true} visible={confirmPopup}>
          <View style={[styles.modalContainer]}>
            <View style={[styles.modalBox]}>
              <View style={[styles.modalTop, { justifyContent: "center" }]}>
                <Text style={styles.modalTopText}>确认提交</Text>
              </View>
              <View style={styles.modalBody}>
                <View style={{ alignItems: "center" }}>
                  <Text style={[styles.manualDepositText, { color: "#000" }]}>
                    一旦提交后，无法再进行修改。
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
                      style={[styles.modalBtn, { borderColor: "#00A6FF" }]}
                      onPress={() => {
                        this.closeConfirmPopup();
                      }}
                    >
                      <Text style={[styles.modalBtnText, { color: "#00A6FF" }]}>
                        取消
                      </Text>
                    </TouchableOpacity>
                    <View style={{ width: 11 }} />
                    <TouchableOpacity
                      style={[
                        styles.modalBtn,
                        { backgroundColor: "#00A6FF", borderColor: "#00A6FF" },
                      ]}
                      onPress={() => {
                        this.closeConfirmPopup();
                        this.submit();
                      }}
                    >
                      <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                        确认提交
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {this.props.from == "IdentityCard" && (
          <>
            <View style={styles.boxWrap}>
              <Text style={styles.inputTitle}>身份证号码</Text>
              <TextInput
                value={IdentityCard}
                maxLength={18}
                placeholder="请输入您的身份证号码"
                onChangeText={(val) => {
                  let IdentityCard = val;
                  let isIdentityCard = true;
                  if (!IdentityCardReg.test(IdentityCard)) {
                    isIdentityCard = false;
                  }

                  this.setState(
                    {
                      IdentityCard,
                      isIdentityCard,
                    },
                    () => {
                      this.validation();
                    }
                  );
                }}
                placeholderTextColor={"#999999"}
                style={[
                  styles.limitListsInput,
                  {
                    borderColor:
                      IdentityCard != "" && !isIdentityCard
                        ? "#EB2121"
                        : "#CCCCCC",
                  },
                ]}
              />
              {IdentityCard != "" && !isIdentityCard && (
                <View
                  style={{
                    backgroundColor: "#FEE0E0",
                    borderRadius: 8,
                    paddingLeft: 15,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{ color: "#EB2121", fontSize: 12, lineHeight: 40 }}
                  >
                    身份证号码格式错误
                  </Text>
                </View>
              )}
              <Text
                style={{
                  color: "#999999",
                  fontSize: 12,
                  marginTop: 10,
                  marginLeft: 15,
                }}
              >
                身份证号码只允许修改一次。
              </Text>
            </View>
          </>
        )}
        {this.props.from == "name" && (
          <>
            <View style={styles.boxWrap}>
              <Text style={styles.inputTitle}>真实姓名</Text>
              <TextInput
                value={FirstName}
                placeholder="请填写真实姓名"
                onChangeText={(val) => {
                  let FirstName = val;
                  let isName = false;
                  if (nameTest.test(FirstName)) {
                    isName = true;
                  }

                  this.setState(
                    {
                      FirstName,
                      isName,
                    },
                    () => {
                      this.validation();
                    }
                  );
                }}
                placeholderTextColor={"#999999"}
                style={[
                  styles.limitListsInput,
                  {
                    borderColor:
                      FirstName !== "" && !isName
                        ? "#EB2121"
                        : "#CCCCCC",
                  },
                ]}
              />
              {FirstName !== "" && !isName && (
                <View
                  style={{
                    backgroundColor: "#FEE0E0",
                    borderRadius: 8,
                    paddingLeft: 15,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{ color: "#EB2121", fontSize: 12, lineHeight: 40 }}
                  >
                    真实姓名格式错误
                  </Text>
                </View>
              )}
              <Text
                style={{
                  color: "#999999",
                  fontSize: 12,
                  marginTop: 10,
                  marginLeft: 15,
                }}
              >
                姓名只允许修改一次。
              </Text>
            </View>
          </>
        )}
        {this.props.from === "DOB" && (
          <>
            <View style={styles.boxWrap}>
              <View>
                <Text style={styles.inputTitle}>出生日期</Text>
                <View style={styles.dateSelect}>
                  {/* 佔位 */}
                  <View></View>
                  {DOB == "" && (
                    <Text style={{ color: "#999999" }}>请点击选择出生日期</Text>
                  )}
                  {DOB != "" && <Text style={{ color: "#222222" }}>{this.state.forShowDOB}</Text>}
                  <Image
                    resizeMode="stretch"
                    source={require("../../../images/icon/downBlack.png")}
                    style={{ width: 18, height: 18 }}
                  />
                </View>
                <View
                  style={{
                    position: "absolute",
                    top: 15,
                    left: 0,
                    zIndex: 999,
                    width: width,
                  }}
                >
                  <DatePicker
                    minDate={new Date(1930, 1, 1)}
                    maxDate={new Date(moment(new Date()).subtract(21, "year"))}
                    mode="date"
                    title="选择日期"
                    onChange={(DOB) => {
                      this.setState(
                        {
                          DOB: moment(DOB).format("YYYY-MM-DD"),
                          forShowDOB: moment(DOB).format("YYYY年MM月DD日")
                        },
                        () => this.validation()
                      );
                    }}
                    format="YYYY/MM/DD"
                    locale={DatePickerLocale}
                  >
                    <List.Item styles={StyleSheet.create(newStyle)}>
                      {/* <Text style={{ fontSize: 14, color: '#fff' }}>月份</Text> */}
                    </List.Item>
                  </DatePicker>
                </View>
              </View>
              <Text
                style={{
                  color: "#999999",
                  fontSize: 12,
                  marginTop: 10,
                  marginLeft: 15,
                }}
              >
                出生日期只允许修改一次。
              </Text>
            </View>
          </>
        )}

        {this.props.from === "gender" && (
          <>
            <View style={styles.boxWrap}>
              <View>
                <Text style={styles.inputTitle}>请选择您的性别</Text>
                <Touch
                  style={styles.gender}
                  onPress={() => {
                    this.setState({ gender: "Male" }, () => this.validation());
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={
                      gender === "Male"
                        ? require("../../../images/icon/checked.png")
                        : require("../../../images/icon/uncheck.png")
                    }
                    style={{ width: 18, height: 18 }}
                  />
                  <Text style={{ paddingLeft: 15, color: "#222" }}>男</Text>
                </Touch>
                <Touch
                  style={styles.gender}
                  onPress={() => {
                    this.setState({ gender: "Female" }, () =>
                      this.validation()
                    );
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={
                      gender === "Female"
                        ? require("../../../images/icon/checked.png")
                        : require("../../../images/icon/uncheck.png")
                    }
                    style={{ width: 18, height: 18 }}
                  />
                  <Text style={{ paddingLeft: 15, color: "#222" }}>女</Text>
                </Touch>
              </View>
              <Text
                style={{
                  color: "#999999",
                  fontSize: 12,
                  marginTop: 10,
                  marginLeft: 15,
                }}
              >
                性别只允许修改一次。
              </Text>
            </View>
          </>
        )}

        {this.props.from === "contact" && (
          <>
            <View style={styles.boxWrap}>
              <Text
                style={{
                  color: "#222",
                  lineHeight: 24,
                  fontSize: 14,
                  marginBottom: 20,
                }}
              >
                您可选择至少两种以上方式，以便奖励派发、
                礼品寄送、新的活动时，我们及时联系到您！
              </Text>
              <View>
                <Text style={styles.inputTitle}>选择联系方式</Text>
                <Touch
                  style={styles.gender}
                  onPress={() => {
                    this.setState({ IsCall: !IsCall }, () => {
                      this.accountPiwik("Phone_contact_personal");
                      this.contactSelect();
                    });
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={
                      IsCall
                        ? require("../../../images/icon/checked.png")
                        : require("../../../images/icon/uncheck.png")
                    }
                    style={{ width: 18, height: 18 }}
                  />
                  <Text style={{ paddingLeft: 15, color: "#222" }}>电话</Text>
                </Touch>
                <Touch
                  style={styles.gender}
                  onPress={() => {
                    this.setState({ IsSMS: !IsSMS }, () => {
                      this.accountPiwik("MSG_contact_personal");
                      this.contactSelect();
                    });
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={
                      IsSMS
                        ? require("../../../images/icon/checked.png")
                        : require("../../../images/icon/uncheck.png")
                    }
                    style={{ width: 18, height: 18 }}
                  />
                  <Text style={{ paddingLeft: 15, color: "#222" }}>短信</Text>
                </Touch>
                <Touch
                  style={styles.gender}
                  onPress={() => {
                    this.setState({ IsEmail: !IsEmail }, () => {
                      this.accountPiwik("Email_contact_personal");
                      this.contactSelect();
                    });
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={
                      IsEmail
                        ? require("../../../images/icon/checked.png")
                        : require("../../../images/icon/uncheck.png")
                    }
                    style={{ width: 18, height: 18 }}
                  />
                  <Text style={{ paddingLeft: 15, color: "#222" }}>邮件</Text>
                </Touch>
              </View>
              {contactSelectST !== "" && (
                <View
                  style={{
                    backgroundColor: "#FEE0E0",
                    borderRadius: 8,
                    paddingLeft: 15,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{ color: "#EB2121", fontSize: 12, lineHeight: 40 }}
                  >
                    {contactSelectST}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
        {this.props.from == "QQ" && (
          <>
            <View style={styles.boxWrap}>
              <Text style={styles.inputTitle}>QQ号</Text>
              <TextInput
                editable={!this.props.QQWX}
                value={QQ}
                placeholder="请输入您的QQ号"
                // onChangeText={(value) => this.setState({QQ : value})}
                onChangeText={(value) => {
                  this.QQWX(value.replace(/\s+/g, ""));
                }}
                placeholderTextColor={"#999999"}
                style={[
                  styles.limitListsInput,
                  {
                    borderColor: QQWXST != "" ? "#EB2121" : "#CCCCCC",
                  },
                ]}
              />
              {QQWXST !== "" && (
                <View
                  style={{
                    backgroundColor: "#FEE0E0",
                    borderRadius: 8,
                    paddingLeft: 15,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{ color: "#EB2121", fontSize: 12, lineHeight: 40 }}
                  >
                    {QQWXST}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
        {this.props.from == "WX" && (
          <>
            <View style={styles.boxWrap}>
              <Text style={styles.inputTitle}>微信号</Text>
              <TextInput
                value={WX}
                editable={!this.props.QQWX}
                placeholder="请输入您的微信号"
                onChangeText={(value) => {
                  this.QQWX(value.replace(/\s+/g, ""));
                }}
                placeholderTextColor={"#999999"}
                style={[
                  styles.limitListsInput,
                  {
                    borderColor: QQWXST != "" ? "#EB2121" : "#CCCCCC",
                  },
                ]}
              />
              {QQWXST !== "" && (
                <View
                  style={{
                    backgroundColor: "#FEE0E0",
                    borderRadius: 8,
                    paddingLeft: 15,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{ color: "#EB2121", fontSize: 12, lineHeight: 40 }}
                  >
                    {QQWXST}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
        <Touch
          onPress={() => {
            onlyModifyOnce.includes(this.props.from)
              ? this.openConfirmPopup()
              : this.submit();
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

export default connect(mapStateToProps)(UserUpdateInfo);

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
    height: 44,
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  gender: {
    display: "flex",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    alignItems: "center",
    paddingLeft: 15,
    height: 46,
    marginTop: 8,
    flexDirection: "row",
  },
  dateSelect: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    height: 40,
    width: width - 60,
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 12,
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
    marginHorizontal: 10,
  },
  modalBtn: {
    height: 44,
    flex: 1,
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
