import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Toast } from "antd-mobile-rn";
import Touch from "../../Common/TouchOnce";
const locatData = require("../../locatData.json");
import { connect } from "react-redux";
import moment from "moment";
const { width, height } = Dimensions.get("window");
import ListItems from "antd-mobile-rn/lib/list/style/index.native";
import actions from "../../../lib/redux/actions/index";
import { maskEmail, maskPhone, maskPhone4 } from "../../../actions/Reg";

const newStyle = {};
for (const key in ListItems) {
  if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
    newStyle[key] = { ...StyleSheet.flatten(ListItems[key]) };
    if (key == "Item") {
      newStyle[key].paddingLeft = 0;
      newStyle[key].paddingRight = 0;
      newStyle[key].height = 40;
      newStyle[key].width = width - 20;
      newStyle[key].overflow = "hidden";
    }
    newStyle[key].color = "transparent";
    newStyle[key].fontSize = -999;
    newStyle[key].backgroundColor = "transparent";
    newStyle[key].borderRadius = 4;
  }
}

locatData.forEach((item) => {
  item.value = item.label;
  item.children.forEach((val) => {
    val.value = val.label;
    val.children.forEach((v) => {
      v.value = v.label;
    });
  });
});

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FirstName: "",
      isFirstName: false,
      isName: true,

      DOB: "",
      isDOB: false,

      IdentityCard: "", //身份证号码

      gender: "", //性別

      City: "",
      isCity: "",

      Country: "",
      isCountry: false,

      Address: "",
      isAddress: false,

      phone: "",
      phoneStatus: true,
      email: "",
      emailStatus: true,

      countryData: [],
      countryDataName: "",
      isHaveCountry: false,
      NationId: "",
      isAllowClink: false,

      memberInfor: "",

      QQ: '',
      WX: '',

      walletValue: '',
    };
  }

  componentWillMount(props) {
    this.getUser();
    // this.getProfileMasterCountryData();
  }

  getProfileMasterCountryData() {
    global.storage
      .load({
        key: "countryData",
        id: "countryData",
      })
      .then((countryData) => {
        this.setState({
          countryData,
        });
      })
      .catch(() => {});
    fetchRequest(
      window.ApiPort.GetProfileMasterData + "category=nations&",
      "GET"
    )
      .then((res) => {
        if (res.isSuccess) {
          res.result.forEach((v) => {
            v.value = v.localizedName;
            v.label = v.localizedName;
          });
          this.setState({
            countryData: res.result,
          });
          global.storage.save({
            key: "countryData",
            id: "countryData",
            data: res.result,
            expires: null,
          });
        }
      })
      .catch((err) => {
        Toast.hide();
        console.log(err);
      });
  }

  getUser() {
    Toast.loading("加载中....", 2000);
    fetchRequest(window.ApiPort.Member, "GET")
      .then((data) => {
        Toast.hide();
        if (data.isSuccess) {
          let memberInfor = data.result.memberInfo;
          
          let contacts = memberInfor.contacts;

          localStorage.setItem("memberInfo", JSON.stringify(memberInfor));
          this.props.userInfo_updateMemberInfo(data.result); // redux memberInfo 更新

          let dob = memberInfor.dob || "";
          if (memberInfor && contacts && contacts.length) {
            let tempEmail = contacts.find(
              (v) => v.contactType.toLocaleLowerCase() === "email"
            );
            let emailStatus = tempEmail
              ? tempEmail.status.toLocaleLowerCase() === "unverified"
                ? true
                : false
              : true;
            let email = tempEmail ? tempEmail.contact : "";
            let tempPhone = contacts.find(
              (v) => v.contactType.toLocaleLowerCase() === "phone"
            );
            let phoneStatus = tempPhone
              ? tempPhone.status.toLocaleLowerCase() === "unverified"
                ? true
                : false
              : true;
            let phone = tempPhone ? tempPhone.contact : "";
            const QQData = data.result.memberInfo.contacts.filter(
              item => item.contactType == "QQ"
            )[0];
            const WXData = data.result.memberInfo.contacts.filter(
              item => item.contactType == "WeChat"
            )[0];
            const allBalance = this.props.userInfo.allBalance;
            let getPreferWallet = allBalance.find(v => v.name == memberInfor.preferWallet);

            this.setState({
              memberInfor,
              phone,
              email,
              emailStatus,
              phoneStatus,
              memberCode: memberInfor.memberCode,
              gender: memberInfor.gender || "",
              QQ: QQData ? QQData.contact : "",
              WX: WXData ? WXData.contact : "",
              walletValue: getPreferWallet.localizedName || "",
            });
          }

          this.setState({
            IdentityCard: memberInfor.documentID || "",
            FirstName: memberInfor.firstName,
            isFirstName: memberInfor.firstName.length > 0,

            DOB: dob.toLocaleUpperCase().split("T")[0],
            isDOB: Boolean(dob),

            City: memberInfor.address.city,
            isCity: Boolean(memberInfor.address.city),

            Address: memberInfor.address.address,
            isAddress: Boolean(memberInfor.address.address),

            isHaveCountry: Boolean(memberInfor.address.country),
            NationId: memberInfor.address.nationId,

            isAllowClink:
              memberInfor.firstName.length > 0 &&
              Boolean(dob) &&
              Boolean(memberInfor.address.city) &&
              Boolean(memberInfor.address.country),
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  submitMemberInfor() {
    const {
      FirstName,
      isFirstName,
      DOB,
      isDOB,
      City,
      isCity,
      countryData,
      Address,
      countryDataName,
      isHaveCountry,
      NationId,
      isName,
    } = this.state;
    console.log(this.state);
    if (!isFirstName) {
      if (!FirstName) {
        Toasts.fail("请输入真实姓名");
        return;
      }
    }
    if (!isName) {
      Toasts.fail("姓名格式错误");
      return;
    }

    if (!isDOB) {
      if (!DOB) {
        Toasts.fail("请选择出生日期");
        return;
      }
    }

    if (!isCity) {
      if (!City) {
        Toasts.fail("请选择省市/自治市");
        return;
      }
    }

    if (!isHaveCountry) {
      if (!countryDataName) {
        Toasts.fail("请选择国家");
        return;
      }
    }

    const params = {
      wallet: "MAIN",
      addresses: {
        address: Address,
        city: City,
        country: isHaveCountry
          ? countryData[NationId - 1].localizedName
          : countryDataName,
        nationId: isHaveCountry
          ? NationId
          : (
              countryData.find((v) => v.localizedName == countryDataName) || {
                id: 1,
              }
            ).id,
      },
      dob: DOB,
      firstName: FirstName,
    };

    Toast.loading("加载中,请稍候...", 2000);
    fetchRequest(window.ApiPort.Member, "PUT", params)
      .then((res) => {
        Toast.hide();
        if (res.isSuccess) {
          Toasts.success(res.message, 2);
          // this.setState({
          //     question: ''
          // })

          this.getUser();
        } else {
          Toasts.fail(res.message);
        }
      })
      .catch((err) => {
        Toast.hide();
        console.log(err);
      });
  }
  rightIcon = (key) => {
    return (
      <Touch
        onPress={() => {
          console.log(key);
          if (!key) {
            Toast.fail("Error");
            return;
          }
          if (key === "phone") {
            Actions.Verification({
              dataPhone: this.state.phone,
              dataEmail: this.state.email,
              verificaType: "phone",
              memberCode: this.state.memberCode,
              noMoreverifcation: false,
              from: "user",
              getUser: () => {
                this.getUser();
              },
            });
            PiwikEvent("Verification", "Click", "Verify_Phone_ProfilePage");
          } else if (key === "email") {
            Actions.Verification({
              dataPhone: this.state.phone,
              dataEmail: this.state.email,
              verificaType: "email",
              memberCode: this.state.memberCode,
              noMoreverifcation: false,
              from: "user",
              getUser: () => {
                this.getUser();
              },
            });
            PiwikEvent("Verification", "Click", "Verify_Email_ProfilePage");
          } else if (key === "changePWD") {
            Actions.ChangePassword();
          } else if (key === "securityQuestion") {
            Actions.SecurityQuestion({
              memberInfo: this.state.memberInfor,
              getUser: () => {
                this.getUser();
              },
            });
          } else if (key === "preferWallet") {
            Actions.PreferWallet({
              memberInfo: this.state.memberInfor,
              getUser: () => {
                this.getUser();
              },
            });
          } else {
            Actions.UserUpdateInfo({
              from: key,
              QQWX: key === "QQ" ? this.state.QQ : this.state.WX,
              memberInfo: this.state.memberInfor,
              getUser: () => {
                this.getUser();
              },
            });
          }
        }}
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        style={{
          // width: 100,
          height: 30,
          color: "#222222",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../../../images/icon/lightGreyRight.png")}
          style={{ width: 16, height: 16 }}
        />
      </Touch>
    );
  };
  render() {
    const {
      FirstName,
      isFirstName,
      DOB,
      isDOB,
      IdentityCard,
      emailStatus,
      phoneStatus,
      gender,
      memberInfor,
      walletValue
    } = this.state;
    console.log(this.state);
    return (
      <View style={{ flex: 1, backgroundColor: "#EFEFF4" }}>
        <ScrollView>
          <View
            style={{ marginHorizontal: 10, marginTop: 20, paddingBottom: 50 }}
          >
            <Text
              style={{
                color: "#666",
                fontSize: 14,
                marginBottom: 10,
                paddingLeft: 5,
              }}
            >
              基本信息
            </Text>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                paddingLeft: 15,
                paddingRight: 27,
              }}
            >
              <View style={styles.contentWrap}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#222222", width: 90 }}>真实姓名</Text>
                </View>
                {isFirstName && (
                  <Text style={{ color: "#000" }}>
                    {FirstName.replace(/./g, "*")}
                  </Text>
                )}
                {!isFirstName && this.rightIcon("name")}
              </View>

              <View style={styles.contentWrap}>
                <Text style={{ color: "#222222", width: 90 }}>身份证号码</Text>

                <Text style={{ color: "#000" }}>
                  {IdentityCard !== "" &&
                    IdentityCard !== "documentid" &&
                    "************" + IdentityCard.slice(-6)}
                </Text>
                {(IdentityCard === "" || IdentityCard === "documentid") &&
                  this.rightIcon("IdentityCard")}
              </View>

              <View style={styles.contentWrap}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#222222", width: 90 }}>出生日期</Text>
                </View>
                {DOB != "" && (
                  <Text style={[styles.birthdayDate, { color: "#000" }]}>
                    {moment(DOB).format("YYYY年MM月DD日").slice(0, 2) +
                      "**/**/**"}
                  </Text>
                )}
                {!isDOB && this.rightIcon("DOB")}
              </View>

              <View style={styles.contentWrapLast}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#222222", width: 90 }}>性别</Text>
                </View>
                {gender === "Female" && (
                  <Text style={{ color: "#000" }}>女</Text>
                )}
                {gender === "Male" && (
                  <Text style={{ color: "#000" }}>男</Text>
                )}

                {gender === "" && this.rightIcon("gender")}
              </View>
            </View>
            <Text
              style={{
                color: "#999999",
                fontSize: 12,
                marginTop: 9,
                marginBottom: 15,
                paddingLeft: 15,
              }}
            >
              姓名/身份证号码/出生日期/性别只允许修改一次。
            </Text>

            <Text
              style={{
                color: "#666",
                fontSize: 14,
                marginBottom: 10,
                paddingLeft: 5,
              }}
            >
              隐私安全
            </Text>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                paddingLeft: 15,
                paddingRight: 27,
              }}
            >
              <View style={styles.contentWrap}>
                <Text style={{ color: "#222222", width: 90 }}>登录昵称</Text>
                <Text
                  style={{
                    color: "#000",
                    marginRight: 5,
                    fontSize: 14,
                    fontWeight: "400",
                  }}
                >
                  {memberInfor.userName}
                </Text>
              </View>

              <View style={styles.contentWrap}>
                <Text style={{ color: "#222222", width: 90 }}>会员帐号</Text>
                <Text
                  style={{
                    color: "#000",
                    marginRight: 5,
                    fontSize: 14,
                    fontWeight: "400",
                  }}
                >
                  {memberInfor.memberCode}
                </Text>
              </View>

              <View style={styles.contentWrap}>
                <Text style={{ color: "#222222", width: 90 }}>邮箱</Text>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#000",
                      marginRight: 5,
                      fontSize: 14,
                      fontWeight: "400",
                    }}
                  >
                    {maskEmail(this.state.email)}
                  </Text>
                  {emailStatus ? (
                    <>
                      <Image
                        source={require("../../../images/icon/warn.png")}
                        style={{ width: 20, height: 20, marginRight: 5 }}
                      />
                      {this.rightIcon("email")}
                    </>
                  ) : (
                    <Image
                      source={require("../../../images/icon/checked.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  )}
                </View>
              </View>

              <View style={styles.contentWrap}>
                <Text style={{ color: "#222222", width: 90 }}>手机</Text>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#000",
                      marginRight: 5,
                      fontSize: 14,
                      fontWeight: "400",
                    }}
                  >
                    {maskPhone4(this.state.phone)}
                  </Text>
                  {phoneStatus ? (
                    <>
                      <Image
                        source={require("../../../images/icon/warn.png")}
                        style={{ width: 20, height: 20, marginRight: 5 }}
                      />
                      {this.rightIcon("phone")}
                    </>
                  ) : (
                    <Image
                      source={require("../../../images/icon/checked.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  )}
                </View>
              </View>

              <View style={styles.contentWrap}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#222222", width: 90 }}>密码修改</Text>
                </View>
                {this.rightIcon("changePWD")}
              </View>

              <View style={styles.contentWrap}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#222222", width: 90 }}>联系方式</Text>
                </View>
                {this.rightIcon("contact")}
              </View>

              <View style={styles.contentWrap}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#222222", width: 90 }}>QQ号</Text>
                </View>
                {this.rightIcon("QQ")}
              </View>

              <View style={styles.contentWrapLast}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#222222", width: 90 }}>微信号</Text>
                </View>
                {this.rightIcon("WX")}
              </View>
            </View>
            <Text
              style={{
                color: "#666",
                fontSize: 14,
                marginTop: 30,
                marginBottom: 5,
                paddingLeft: 5,
              }}
            >
              其他设置
            </Text>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                paddingLeft: 15,
                paddingRight: 27,
              }}
            >
              <View style={styles.contentWrap}>
                <Text style={{ color: "#222222", width: 90 }}>语言</Text>
                <Text style={{ color: "#222222", fontWeight: "bold" }}>
                  中文
                </Text>
              </View>
              <View style={styles.contentWrap}>
                <Text style={{ color: "#222222", width: 90 }}>货币</Text>
                <Text style={{ color: "#222222", fontWeight: "bold" }}>
                  人民币
                </Text>
              </View>
              <View style={styles.contentWrap}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#222222", width: 90 }}>首选账户</Text>
                </View>
               <View style={{flexDirection: "row", alignItems: "center"}}>
                 <Text style={{ color: "#000", fontSize: 14, fontWeight: "bold", marginRight: 9 }}>{walletValue}</Text>
                 {this.rightIcon("preferWallet")}
               </View>
              </View>
              <View style={styles.contentWrap}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#222222", width: 90 }}>安全提问</Text>
                </View>
                {this.rightIcon("securityQuestion")}
              </View>
            </View>
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
});

const mapDispatchToProps = (dispatch) => ({
  userInfo_updateMemberInfo: (data) =>
    dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
  toggleListDisplayType: () => ACTION_UserSetting_ToggleListDisplayType(),
});
export default connect(mapStateToProps, mapDispatchToProps)(News);

const styles = StyleSheet.create({
  contentWrap: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#F3F3F3",
    borderBottomWidth: 1,
  },
  contentWrapLast: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
