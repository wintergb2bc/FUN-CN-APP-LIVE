import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import { Toast } from "antd-mobile-rn";
import actions from "../../lib/redux/actions";

class SecurityCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // true表示已驗證
      phoneStatus: false,
      emailStatus: false,
      IdentityCardStatus: false,

      phones: false,
      emails: false,
      memberCode: "",
      memberInfor: ""
    };
  }

  componentDidMount() {
    this.getMemberInfo();
  }

  //获取用户信息
  getMemberInfo() {
    if (Object.keys(this.props.userInfo.memberInfo).length !== 0) {
      this.checkVerifyState();
    } else {
      this.getUser();
    }
  }

  checkVerifyState = (data) => {
    const val = data || this.props.userInfo.memberInfo;
    const phoneData = val.contacts.filter(
      (item) => item.contactType.toLocaleLowerCase() == "phone"
    )[0];
    const emailData = val.contacts.filter(
      (item) => item.contactType.toLocaleLowerCase() == "email"
    )[0];

    let memberCode = val.memberCode;
    let firstName = val.firstName;
    let phones = (phoneData && phoneData.contact) || false;
    let emails = (emailData && emailData.contact) || false;
    
    // 電話驗證
    let phoneStatus = phoneData
      ? phoneData.status.toLocaleLowerCase() === "verified"
        ? true
        : false
      : false;

    // email驗證
    let emailStatus = emailData
      ? emailData.status.toLocaleLowerCase() === "verified"
        ? true
        : false
      : false;

    // 姓名驗證
    let IdentityCardStatus = val.firstName !== "" ? true : false;

    let forCount = [phoneStatus, emailStatus, IdentityCardStatus];
    let countVerified = forCount.filter((v) => v === true).length;
    
    this.setState({
      phoneStatus,
      emailStatus,
      IdentityCardStatus,
      phones,
      emails,
      memberCode,
      firstName,
      memberInfor: val
    },()=>{
      // 三個都驗證通過
      if (countVerified === 3) {
        this.props.checkVerifyState(val, true);
        Actions.personal();
      }
    });
  };

  getUser() {
    Toast.loading("加载中....", 2000);
    fetchRequest(window.ApiPort.Member, "GET").then((data) => {
      Toast.hide();
      if (data && data.result) {
        this.props.userInfo_updateMemberInfo(data.result);
        this.checkVerifyState(data.result.memberInfo);
      }
    });
  }

  render() {
    console.log(this.state);
    return (
      <View
        style={[
          styles.viewContainer,
          { backgroundColor: true ? "#EFEFF4" : "#000" },
        ]}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: "#E8E8E8",
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          <Text style={{ color: "#666666", fontSize: 12, lineHeight: 18 }}>
            乐天堂严格遵守法律法规，遵循以下隐私保护原则，为您提供更加安全、可靠的服务：
          </Text>
        </View>
        <View style={styles.boxWrap}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../../images/icon/id.png")}
              style={{ width: 32, height: 30, marginRight: 16 }}
            />
            <View>
              <Text style={styles.boxTitle}>实名认证</Text>
              <Text style={styles.boxDec}>验证实名信息</Text>
            </View>
          </View>
          <View>
            {this.state.IdentityCardStatus ? (
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
                <Text style={{ color: "#34C759", fontSize: 14 }}>已验证</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: "#00A6FF",
                  borderRadius: 8,
                  height: 32,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 12,
                }}
                
                onPress={() =>
                  Actions.UserUpdateInfo({
                    from: "name",
                    memberInfo: this.state.memberInfor,
                    getUser: () => {
                      this.getUser();
                    },
                  })
                }
              >
                <Text
                  style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}
                >
                  马上验证
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.boxWrap}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../../images/icon/phone.png")}
              style={{ width: 28, height: 28, marginRight: 16 }}
            />
            <View>
              <Text style={styles.boxTitle}>验证手机</Text>
              <Text style={styles.boxDec}>验证有效手机号</Text>
            </View>
          </View>
          <View>
            {this.state.phoneStatus ? (
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
                <Text style={{ color: "#34C759", fontSize: 14 }}>已验证</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: "#00A6FF",
                  borderRadius: 8,
                  height: 32,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 12,
                }}
                onPress={() =>
                  Actions.Verification({
                    dataPhone: this.state.phones,
                    dataEmail: this.state.emails,
                    verificaType: "phone",
                    memberCode: this.state.memberCode,
                    noMoreverifcation: false,
                    from: "profile",
                    getUser: () => {
                      this.getUser();
                    },
                  })
                }
              >
                <Text
                  style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}
                >
                  马上验证
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.boxWrap}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../../images/icon/mail.png")}
              style={{ width: 28, height: 32, marginRight: 16 }}
            />
            <View>
              <Text style={styles.boxTitle}>验证邮箱</Text>
              <Text style={styles.boxDec}>验证有效邮箱</Text>
            </View>
          </View>

          <View>
            {this.state.emailStatus ? (
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
                <Text style={{ color: "#34C759", fontSize: 14 }}>已验证</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: "#00A6FF",
                  borderRadius: 8,
                  height: 32,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 12,
                }}
                onPress={() =>
                  Actions.Verification({
                    dataPhone: this.state.phones,
                    dataEmail: this.state.emails,
                    verificaType: "email",
                    memberCode: this.state.memberCode,
                    noMoreverifcation: false,
                    from: "profile",
                    getUser: () => {
                      this.getUser();
                    },
                  })
                }
              >
                <Text
                  style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}
                >
                  马上验证
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(SecurityCheck);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    position: "relative",
    paddingHorizontal: 16,
    backgroundColor: "#EFEFF4",
  },
  boxTitle: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
  },
  boxWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  boxDec: {
    color: "#999999",
    fontSize: 12,
    marginTop: 5,
  },
});
