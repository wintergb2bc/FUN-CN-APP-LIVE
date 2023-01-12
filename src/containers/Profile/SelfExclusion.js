import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import { Toast } from "antd-mobile-rn";
import { connect } from "react-redux";
import CheckBox from "react-native-check-box";
import ModalDropdown from "react-native-modal-dropdown";
import actions from "../../lib/redux/actions/index";

const LoginLimitData = [
  {
    name: "7 天内无法进行存款、转账及游戏",
    betLimitDayRange: 7,
  },
  {
    name: "90 天内无法进行存款、转账及游戏",
    betLimitDayRange: 90,
  },
  {
    name: "永远",
    betLimitDayRange: 99999,
  },
];

const { width, height } = Dimensions.get("window");
class SelfExclusion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      money: "",
      moneyST: "",
      activeCheck: -1,
      checkBox1: false,
      checkBox2: false,
      
      // 如果設過了，不顯示送出鈕
      submitHide: true
    };
  }

  componentDidMount() {
    this.getSelfExclusions();
  }

  getSelfExclusions = () => {
    const selfExclusionsData = this.props.userSetting.selfExclusions;
    console.log(selfExclusionsData);
    if (!selfExclusionsData) return;
    
    this.setState({
      money: (selfExclusionsData.status && selfExclusionsData.transferLimit !== 0) ? selfExclusionsData.transferLimit + "":"",
      checkBox1: selfExclusionsData.status,
      activeCheck: selfExclusionsData.status ? LoginLimitData.findIndex(v => v.betLimitDayRange === selfExclusionsData.selfExcludeDuration) : -1,
      
      // 如有設定過，不顯示submit按鈕
      submitHide: selfExclusionsData.status,
    });
  };

  //输入金额
  moneyChange(value) {
    let test = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/g;
    let moneyST = "";
    let money = value.replace(" ", "");

    if (money == "" || Number(money) == 0) {
      moneyST = "请输入限制金额";
    } else if (test.test(Number(money)) != true) {
      moneyST = "请输入正确的请输入限制金额";
    }
  
    this.setState({ money, moneyST });
  }

  submitBtn = () => {
    console.log(this.state.moneyST)
    if (!this.state.checkBox1 && !this.state.checkBox2){
      return false;
    }
    if (this.state.checkBox1 && this.state.moneyST !== "" && this.state.money !== ""){
      return false;
    } 
    if (this.state.checkBox2 && this.state.activeCheck === -1){
      return false;
    }
    
    return true;
  }
  submit() {
    if(!this.submitBtn()){
      return;
    }
    PiwikEvent("Confirm_selfexclusion_profilepage");
    let setting = "NotAvailable";
    let dayRange = 0;
    let activeCheck = this.state.activeCheck;
    if (activeCheck == 0) {
      setting = "SevenDays";
      dayRange = "7";
    } else if (activeCheck == 1) {
      setting = "NinetyDays";
      dayRange = "90";
    } else if (activeCheck == 2) {
      setting = "Permanent";
      dayRange = "0";
    }

    const MemberData = {
      setting: setting, // 'NotAvailable', //是否限制登录 SevenDays  NinetyDays
      isEnabled: true, //是否自用自我限制
      limitAmount: Number(this.state.money), //限制转账金额
      betLimitDayRange: dayRange,
    };
    console.log('MemberData')
    console.log(MemberData)
    Toast.loading("设置中,请稍候...", 200);
    fetchRequest(ApiPort.SelfExclusions, "PUT", MemberData)
      .then((res) => {
        Toast.hide();
        if (res.isSuccess == true) {
          Toast.success("个人限制设置成功！");
          this.setState({
            submitHide: true
          });
          this.props.getSelfExclusionsAction();
        } else {
          Toast.fail("设置失败！");
        }
      })
      .catch((error) => {
        Toast.fail("网络错误，请重试");
        console.log(error);
      });
  }

  renderRow(rowData, i) {
    let flag = this.state.activeCheck * 1 === i * 1;
    return (
      <View
        style={{
          width: width - 65,
          height: 45,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 15,
        }}
      >
        <Text
          style={{
            color: "#000",
            lineHeight: 38,
          }}
        >{`${rowData.name}`}</Text>
        {flag && (
          <Image
            resizeMode="cover"
            source={require("../../images/icon/blueCheck.png")}
            style={{ width: 14, height: 14 }}
          />
        )}
      </View>
    );
  }

  renderButtonText(rowData) {
    return `${rowData.name}`;
  }

  onSelect = (key) => {
    console.log(key);
    this.setState({ activeCheck: key });
  };
  renderSeparator() {
    return <View style={{ height: 1, backgroundColor: "#F2F2F2" }} />;
  }
  
  //可否編輯
  /*
  * checkbox1和2，不能複選
  * */
  checkbox1Editable = () => {
    const { checkBox1, checkBox2, submitHide } = this.state;
    if(submitHide){
      return false;
    }
    return (checkBox1 || (!checkBox1 && !checkBox2));
  }

  checkbox2Editable = () => {
    const { checkBox1, checkBox2, submitHide } = this.state;
    if(submitHide){
      return false;
    }
    return (checkBox2 || (!checkBox1 && !checkBox2));
  }

  render() {
    const { money, moneyST, submitHide, checkBox1, checkBox2 } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#30C7F9" }}>
        <ScrollView>
          <Image
            resizeMode="cover"
            source={require("../../images/user/selfExclusionBG.png")}
            style={{ width: width, height: width / 0.96 }}
          />

          <View
            style={{
              marginHorizontal: 15,
              marginTop: -150,
              marginBottom: 150,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 15,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "#000",
                  fontWeight: "bold",
                  marginVertical: 20,
                }}
              >
                行為限制
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#222",
                  marginBottom: 20,
                  lineHeight: 24,
                }}
              >
                “健康博彩从乐天堂开始”-
                乐天堂秉承着“健康博彩”的服务理念以营造一个健康的娱乐环境，为广大用户提供优质的服务与全新的体验。推出健康模式帮助您限制个人投注行为。
                我们致力为用户创造安全、诚信、可靠、健康娱乐的博彩环境，以保证能够提供世界一流的服务。
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 15,
                borderRadius: 10,
                // justifyContent: "center",
                // alignItems: "center",
                marginTop: 15,
              }}
            >
              <TouchableOpacity 
                style={{ flexDirection: "row", alignItems: "center"}}
                onPress={()=>{
                  this.setState({
                    checkBox1: !checkBox1,
                    checkBox2: false
                  })
                }}>
                {checkBox1 ? (
                  <View style={{
                    width: 16,
                    height: 16,
                    borderRadius: 16 / 2,
                    backgroundColor: "#00A6FF",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <View style={{ backgroundColor: "#fff", width: 8, height: 8, borderRadius: 8 / 2, }}/>
                  </View>
                ) : (
                  <View style={{
                    width: 16,
                    height: 16,
                    borderRadius: 16 / 2,
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#BCBEC3",
                    alignItems: "center",
                    justifyContent: "center"
                  }}/>
                )}
                <Text
                  style={{
                    fontSize: 14,
                    color: "#222",
                    marginVertical: 15,
                    lineHeight: 20,
                    marginLeft: 15,
                  }}
                >
                  转账总额限制
                </Text>
              </TouchableOpacity>
              
              <TextInput
                value={money}
                style={{
                  color: "#222",
                  height: 45,
                  borderColor: "#E0E0E0",
                  borderWidth: 1,
                  // width: width - 60,
                  paddingLeft: 15,
                  borderRadius: 8,
                  backgroundColor: this.checkbox1Editable() ? "#fff" : "#EFEFF4",
                }}
                placeholder={"请输入限制金额"}
                placeholderTextColor={"#999"}
                onChangeText={(value) => {
                  this.moneyChange(value);
                }}
                onFocus={() => {
                  PiwikEvent("Amount_selfexclusion_profilepage");
                }}
                editable={this.checkbox1Editable()}
              />
              {moneyST != "" && (
                <Text style={{ color: "#F92D2D", fontSize: 12, marginTop: 12 }}>
                  {moneyST}
                </Text>
              )}

              <Text
                style={{
                  color: "#F92D2D",
                  fontSize: 12,
                  textAlign: "center",
                  marginVertical: 15,
                }}
              >
                注：7 天内您的转账总额将以您填入的数目为准。
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 15,
                borderRadius: 10,
                // justifyContent: "center",
                // alignItems: "center",
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center"}}
                onPress={()=>{
                  this.setState({
                    checkBox2: !checkBox2,
                    checkBox1: false
                  })
                }}>
                {checkBox2 ? (
                  <View style={{
                    width: 16,
                    height: 16,
                    borderRadius: 16 / 2,
                    backgroundColor: "#00A6FF",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <View style={{ backgroundColor: "#fff", width: 8, height: 8, borderRadius: 8 / 2, }}/>
                  </View>
                ) : (
                  <View style={{
                    width: 16,
                    height: 16,
                    borderRadius: 16 / 2,
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#BCBEC3",
                    alignItems: "center",
                    justifyContent: "center"
                  }}/>
                )}
                <Text
                  style={{
                    fontSize: 14,
                    color: "#222",
                    marginVertical: 15,
                    lineHeight: 20,
                    marginLeft: 15,
                  }}
                >
                  登入限制
                </Text>
              </TouchableOpacity>
              
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  height: 40,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <ModalDropdown
                  ref={(el) => (this._dropdown_3 = el)}
                  defaultValue={"选择限制天数"}
                  defaultTextStyle={{ color: "#999" }}
                  disabled={!this.checkbox2Editable()}
                  // defaultIndex={this.state.activeCheck}
                  textStyle={styles.dropdown_D_text}
                  renderSeparator={() => this.renderSeparator()}
                  dropdownStyle={[
                    styles.dropdown_DX_dropdown,
                    {
                      height: 45 * 3,
                    },
                  ]}
                  options={LoginLimitData}
                  renderButtonText={(rowData) => this.renderButtonText(rowData)}
                  renderRow={this.renderRow.bind(this)}
                  onSelect={this.onSelect}
                  style={{
                    zIndex: 10,
                    width: width - 60,
                    height: 45,
                    // backgroundColor: "#EFEFF4"
                  }}
                >
                  <View style={[styles.limitModalDropdownTextWrap, { backgroundColor: this.checkbox2Editable()? "#fff" : "#EFEFF4", borderColor: '#e0e0e0', borderWidth: 1, borderLeftWidth: 0, borderRadius: 8 }]}>
                    {this.state.activeCheck === -1 ? (
                      <Text
                        style={[styles.limitModalDropdownText, { color: "#999" }]}
                      >
                        选择限制天数
                      </Text>
                    ):(
                      <Text
                        style={[styles.limitModalDropdownText, { color: "#000" }]}
                      >
                        {LoginLimitData[this.state.activeCheck].name}
                      </Text>
                    )}
                    {/* <ModalDropdownArrow arrowFlag={arrowFlag} /> */}
                  </View>
                </ModalDropdown>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/down.png")}
                  style={{
                    width: 16,
                    height: 16,
                    position: "absolute",
                    right: 10,
                  }}
                />
              </View>
              <Text
                style={{
                  color: "#F92D2D",
                  fontSize: 12,
                  textAlign: "center",
                  marginVertical: 15,
                }}
              >
                开启之后您将在选择日期内无法登入乐天堂。
              </Text>
            </View>

            {!submitHide && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 15,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 120,
                    height: 40,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:
                      this.submitBtn()
                        ? "#00A6FF"
                        : "#999999",
                  }}
                  onPress={() => {
                    this.submit();
                  }}
                >
                  <Text
                    style={{ fontSize: 16, color: "#fff", fontWeight: "bold" }}
                  >
                    确定
                  </Text>
                </TouchableOpacity>
              </View>
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
});
const mapDispatchToProps = (dispatch) => ({
  getSelfExclusionsAction: () =>
    dispatch(actions.ACTION_SelfExclusionsAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelfExclusion);

const styles = StyleSheet.create({
  dropdown_D_text: {
    paddingBottom: 3,
    fontSize: 14,
    color: "#222",
    textAlignVertical: "center",
    lineHeight: 45,
    paddingLeft: 15,
  },
  dropdown_DX_dropdown: {
    borderRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowColor: "#666",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4,
  },
  limitModalDropdownTextWrap: {
    paddingLeft: 15,
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    height: 45,
  },
  limitModalDropdownText: {
    fontSize: 13,
    color: "#222",
  },
});
