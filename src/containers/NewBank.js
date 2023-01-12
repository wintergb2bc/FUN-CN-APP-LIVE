import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  Image,
  FlatList,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Toast, Picker, List } from "antd-mobile-rn";
import CheckBox from "react-native-check-box";
import { Toasts } from "./Toast";

export const RealNameReg = /^[\u4e00-\u9fa5\u0E00-\u0E7F ]{2,15}$/;
export const ProvinceReg = /^[a-zA-Z\u4e00-\u9fa5\u0E00-\u0E7F\s ]+$/;
export const CityReg = /^[a-zA-Z\u4e00-\u9fa5\u0E00-\u0E7F\s ]+$/;
export const BranchReg = /^[a-zA-Z0-9\u4e00-\u9fa5\u0E00-\u0E7F\s ]+$/;
export const EmailReg =
  /^\w+[-.`~!@$%^*()={}|?\w]+@([\w.]{2,})+?\.[a-zA-Z]{2,9}$/;
export const HouseNumberReg = /^[^;:：；<>《》]+$/;
const locatData = require("./locatData.json");
const { width, height } = Dimensions.get("window");
const RegObj = {
  accountHolderName: RealNameReg,
  province: ProvinceReg,
  city: CityReg,
  branch: BranchReg,
};
locatData.forEach((item) => {
  item.value = item.label;
  item.children.forEach((val) => {
    val.value = val.label;
    val.children.forEach((v) => {
      v.value = v.label;
    });
  });
});

import ListItems from "antd-mobile-rn/lib/list/style/index.native";

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
const ListItemstyles = newStyle;

class NewBankContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankList: [],
      selectedBank: {}, //選中的銀行
      bankType: this.props.bankType, //提款或充值银行卡
      accountHolderName: "",
      accountHolderNameErr: true,
      accountNumber: "",
      province: "", //省份
      provinceErr: true,
      city: "", //城市
      cityErr: true,
      accountNumberErr: true,
      branch: "", //分行
      branchErr: true,
      addDisalbed: false,
      checkBox: false,
      arrowFlag: false,
      name: "",
      eligible: false,
      isShowCtcModal: false,
      
      filterString: "", // 搜尋關鍵字
      filerBanks: []
    };
  }

  componentDidMount() {
    if (this.props.bankType === "W") {
      this.getWithdrawalLbBankAction();
    }
  }

  getWithdrawalLbBankAction() {
    global.storage
      .load({
        key: "WithdrawalsLbBanks",
        id: "WithdrawalsLbBanks",
      })
      .then((data) => {
        this.setState({
          bankList: data,
        });
      })
      .catch((e) => {
        console.log(e);
      });

    fetchRequest(
      window.ApiPort.PaymentDetails +
      "?transactionType=Withdrawal&method=LB&isMobile=true&",
      "GET"
    )
      .then((data) => {
        let res = data.result;
        let withdrawalsBank = res.banks;
        this.setState({
          bankList: withdrawalsBank,
        });
        global.storage.save({
          key: "WithdrawalsLbBanks",
          id: "WithdrawalsLbBanks",
          data: withdrawalsBank,
          expires: null,
        });
      })
      .catch((err) => {
        Toast.hide();
        console.log(err);
      });
  }

  getDepositLbBank(props) {
    if (props) {
      let depositLbBankData = props.depositLbBankData;
      if (Array.isArray(depositLbBankData)) {
        this.setState({
          bankList: depositLbBankData,
        });
      }
    }
  }

  GetOnlyNumReg(str) {
    return (str + "").replace(/[^\d]/g, "");
  }

  //添加
  addBank() {
    const {
      addDisalbed,
      accountNumber,
      accountHolderName,
      city,
      province,
      branch,
      selectedBank,
      checkBox,
    } = this.state;

    if (!addDisalbed) {
      return "";
    }
    let params = {
      accountNumber: accountNumber,
      accountHolderName: accountHolderName,
      bankName: selectedBank.name,
      city: city,
      province: province,
      branch: branch,
      type: this.props.bankType,
      isDefault: checkBox,
    };
    Toast.loading("加载中,请稍候...", 2000);
    fetchRequest(window.ApiPort.POST_MemberBanks, "POST", params)
      .then((data) => {
        Toast.hide();
        if (data.isSuccess == true) {
          this.props.getWithdrawalUserBankAction();
          Toasts.success("银行卡添加成功", 2);
          Actions.pop();
        } else {
          Toasts.fail(data.message, 1.5);
        }
      })
      .catch((error) => {
        Toast.hide();
        console.log(error);
      });

    PiwikEvent("Withdrawal Nav", "Click", "Save_BankCard_Withdrawal");
  }

  submitName(name) {
    if (this.state.name) {
      this.props.getMemberInforAction();
      Actions.pop();
      Actions.FreeBetPage({
        fillType: "game",
        isGetFreeBet: true,
      });
      return;
    }
    const params = {
      key: "FirstName",
      value1: name.trim(),
      value2: "",
    };

    Toast.loading("加载中,请稍候...", 2000);
    fetchRequest(window.ApiPort.Member, "PATCH", params)
      .then((res) => {
        Toast.hide();
        if (res.result.isSuccess) {
          this.props.getMemberInforAction();
          Actions.pop();
          Actions.FreeBetPage({
            fillType: "game",
            isGetFreeBet: true,
          });
        } else {
          Toasts.fail("Error", 2);
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  changeInputValue(type, value) {
    let Err = RegObj[type].test(value);
    this.setState(
      {
        [`${type}Err`]: Err,
        [type]: value,
      },
      () => {
        this.changeBtnStatus();
      }
    );
  }

  changeBtnStatus() {
    const {
      bankList,
      accountHolderName,
      accountHolderNameErr,
      province,
      city,
      cityErr,
      branch,
      branchErr,
      accountNumber,
      selectedBank
    } = this.state;

    let addDisalbed =
      Object.keys(selectedBank).length != 0 &&
      Array.isArray(bankList) &&
      bankList.length > 0 &&
      accountHolderName.length > 0 &&
      accountNumber.length > 0 &&
      city.length > 0 &&
      province.length > 0 &&
      branch.length > 0 &&
      accountHolderNameErr &&
      branchErr &&
      cityErr;
    console.log('addDisalbed ', addDisalbed)
    this.setState({
      addDisalbed,
    });
  }

  changeArrowStatus(arrowFlag) {
    this.setState({
      arrowFlag,
    });
  }

  renderItem = ({ item, index }) => {
    const { selectedBank } = this.state;
    return (
      <TouchableOpacity
        style={[styles.bankListstyle, { marginTop: index === 0 ? 12 : 0 }]}
        onPress={() => {
          this.setState({
            selectedBank: item,
            isShowCtcModal: false,
          }, () => {
            this.changeBtnStatus();
          });
        }}
      >
        <View>
          <Text style={{ color: "#333", fontSize: 14 }}>{item.name}</Text>
        </View>

        {Object.keys(selectedBank).length != 0 && selectedBank.id == item.id && (
          <Image
            resizeMode="stretch"
            source={require("./../images/icon/check.png")}
            style={{
              width: 16,
              height: 16,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  onSearchInputChanged = (value) => {
    const filterData = value === "" ? [] : this.state.bankList.filter((item) =>
      item.name.includes(value.toLowerCase())
    );
    this.setState({
      filterString: value,
      filerBanks: filterData
    });
  };
  
  render() {
    const {
      selectedBank,
      bankList,
      accountHolderName,
      accountNumber,
      province, //省份
      city, //城市
      branch, //分行
      addDisalbed,
      checkBox,
      accountHolderNameErr,
      cityErr,
      accountNumberErr,
      branchErr,
      isShowCtcModal,
      filterString,
      filerBanks
    } = this.state;
    const PasswordInput = {
      backgroundColor: true ? "#fff" : "#000",
      color: true ? "#3C3C3C" : "#fff",
      borderColor: true ? "#F2F2F2" : "#00AEEF",
    };
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: true ? "#fff" : "#0F0F0F",
          paddingHorizontal: 16,
        }}
      >
        <Modal visible={isShowCtcModal} transparent={true} animationType="fade">
          <View style={styles.modalCOntainer}>
            <View style={styles.modalWrap}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 24,
                  marginBottom: 29,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isShowCtcModal: false,
                    });
                  }}
                >
                  <Text style={styles.modalHeadTitleClose}>关闭</Text>
                </TouchableOpacity>
                <Text style={styles.modalHeadTitle}>选择银行</Text>
                <Text style={{ color: "rgba(0, 0, 0, 0)" }}>佔位</Text>
              </View>
              <View
                style={{
                  marginBottom: 14,
                }}
              >
                <TextInput
                  value={filterString}
                  onChangeText={(value) => {
                    this.onSearchInputChanged(value);
                  }}
                  returnKeyType={"search"}
                  maxLength={30}
                  placeholder={"搜索"}
                  placeholderTextColor={"#ccc"}
                  underlineColorAndroid="transparent"
                  style={{
                    color: "#333",
                    fontSize: 14,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 8,
                    marginHorizontal: 16,
                    paddingLeft: 42,
                    height: 44,
                    justifyContent: "center",
                  }}
                />
                <Image
                  resizeMode="stretch"
                  source={require("./../images/icon/search.png")}
                  style={{
                    position: "absolute",
                    left: 33,
                    top: 13,
                    width: 18,
                    height: 18,
                  }}
                />
              </View>
              {filterString === "" && filerBanks.length === 0 && bankList !== 0 ? (
                <FlatList
                  automaticallyAdjustContentInsets={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={filerBanks.length === 0 ? bankList : filerBanks}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id}
                  style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 16 }}
                />
              ) : (filerBanks.length > 0 && filterString !== "") ? (
                <FlatList
                  automaticallyAdjustContentInsets={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={filerBanks.length === 0 ? bankList : filerBanks}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id}
                  style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 16 }}
                />
              ): (
                <View
                  style={{
                    flex: 1,
                    // justifyContent: "center",
                    marginTop: 62,
                    alignItems: "center",
                  }}
                >
                  <Image
                    resizeMode="stretch"
                    source={require("./../images/icon/noData.png")}
                    style={{
                      width: 60,
                      height: 60,
                      marginBottom: 7.5,
                    }}
                  />
                  <Text style={{ color: "#BCBEC3", fontSize: 14 }}>
                    暂无数据
                  </Text>
                </View>
              )}
              
            
            </View>
          </View>
        </Modal>

        <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
          {/* 银行选择 */}
          <View style={[styles.limitLists, { paddingTop: 15 }]}>
            <Text style={[styles.withdrawalText]}>银行名称</Text>
            {bankList.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isShowCtcModal: true,
                  });
                }}
                style={[styles.targetWalletBox, PasswordInput]}
              >
                {bankList && Object.keys(selectedBank).length !== 0 ? (
                  <Text style={[styles.toreturnModalDropdownText]}>
                    {selectedBank.name}
                  </Text>
                ) : (
                  <Text style={[styles.placeholderText]}>请选择银行</Text>
                )}
                <Image
                  resizeMode="stretch"
                  source={require("./../images/down.png")}
                  style={{
                    width: 12,
                    height: 12,
                    position: "absolute",
                    right: 10,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          {/* 姓名 */}
          <View style={styles.limitLists}>
            <Text style={[styles.withdrawalText]}>账户持有者全名</Text>
            <TextInput
              value={accountHolderName}
              maxLength={50}
              placeholder="请输入您的全名"
              placeholderTextColor={"#BCBEC3"}
              style={[styles.limitListsInput, PasswordInput]}
              onChangeText={this.changeInputValue.bind(
                this,
                "accountHolderName"
              )}
            />
            {!accountHolderNameErr && (
              <View
                style={{
                  backgroundColor: "#FEE0E0",
                  height: 40,
                  justifyContent: "center",
                  paddingLeft: 15,
                  marginTop: 10,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "#EB2121" }}> <Text
                  style={{ color: "#EB2121" }}>{accountHolderName === "" ? "请输入全名" : "格式不正确"} </Text> </Text>
              </View>
            )}
          </View>
          {/* 银行卡号 */}
          <View style={styles.limitLists}>
            <Text style={[styles.withdrawalText]}>银行账户号码</Text>
            <TextInput
              value={accountNumber}
              maxLength={19}
              keyboardType="number-pad"
              placeholder="请输入您的账户号码"
              placeholderTextColor={"#BCBEC3"}
              style={[styles.limitListsInput, PasswordInput]}
              onChangeText={(value) => {
                let accountNumber = this.GetOnlyNumReg(value);
                this.setState(
                  {
                    accountNumberErr: accountNumber.length !== 0,
                    accountNumber,
                  },
                  () => {
                    this.changeBtnStatus();
                  }
                );
              }}
            />
            {!accountNumberErr && (
              <View
                style={{
                  backgroundColor: "#FEE0E0",
                  height: 40,
                  justifyContent: "center",
                  paddingLeft: 15,
                  marginTop: 10,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "#EB2121" }}> <Text
                  style={{ color: "#EB2121" }}>{accountNumber === "" ? "请输入您的账户号码" : "格式不正确"} </Text> </Text>
              </View>
            )}
          </View>
          {
            <View>
              {/* 省份 */}
              <View style={styles.limitLists}>
                <Text style={[styles.withdrawalText]}>省/自治区</Text>
                {/* <TextInput
                                value={province}

                                maxLength={20}
                                placeholderTextColor={PlaceholderTextColor}
                                style={[styles.limitListsInput, PasswordInput]}
                                onChangeText={this.changeInputValue.bind(this, 'province')}
                            /> */}

                <Picker
                  title="省/自治区"
                  onChange={(value) => {
                    this.setState(
                      {
                        province: value[0],
                      },
                      () => {
                        this.changeBtnStatus();
                      }
                    );
                  }}
                  data={locatData}
                  cols={1}
                >
                  <List.Item styles={StyleSheet.create(ListItemstyles)}>
                    <View style={[styles.limitListsInput, PasswordInput]}>
                      {province === "" ? (
                        <Text style={{ color: "#BCBEC3" }}>
                          请输入省/自治区
                        </Text>
                      ) : (
                        <Text>{province}</Text>
                      )}
                    </View>
                  </List.Item>
                </Picker>
                {/* {
                                !provinceErr && <Text style={{ color: 'red', marginTop: 10 }}>Định dạng không đúng.</Text>
                            } */}
              </View>
              {/* 城市 */}
              <View style={styles.limitLists}>
                <Text style={[styles.withdrawalText]}>城市/城镇</Text>
                <TextInput
                  value={city}
                  maxLength={20}
                  placeholder="请输入城市/城镇"
                  placeholderTextColor={"#BCBEC3"}
                  style={[styles.limitListsInput, PasswordInput]}
                  onChangeText={this.changeInputValue.bind(this, "city")}
                />
                {!cityErr && (
                  <View
                    style={{
                      backgroundColor: "#FEE0E0",
                      height: 40,
                      justifyContent: "center",
                      paddingLeft: 15,
                      marginTop: 10,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: "#EB2121" }}>{city === "" ? "请输入城市/城镇" : "格式不正确"} </Text>
                  </View>
                )}
                {/* {
                                !cityErr && <Text style={{ color: 'red', marginTop: 10 }}>Định dạng không đúng.</Text>
                            } */}
              </View>
              {/* 分行 */}
              <View style={styles.limitLists}>
                <Text style={[styles.withdrawalText]}>分行</Text>
                <TextInput
                  value={branch}
                  maxLength={20}
                  placeholder="请输入分行"
                  placeholderTextColor={"#BCBEC3"}
                  style={[styles.limitListsInput, PasswordInput]}
                  onChangeText={this.changeInputValue.bind(this, "branch")}
                />
                {!branchErr && (
                  <View
                    style={{
                      backgroundColor: "#FEE0E0",
                      height: 40,
                      justifyContent: "center",
                      paddingLeft: 15,
                      marginTop: 10,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: "#EB2121" }}> <Text
                      style={{ color: "#EB2121" }}>{branch === "" ? "请输入分行" : "格式不正确"} </Text> </Text>
                  </View>
                )}
                {/* {
                                !branchErr && <Text style={{ color: 'red', marginTop: 10 }}>Định dạng không đúng.</Text>
                            } */}
              </View>
            </View>
          }

          <View style={styles.limitLists}>
            <CheckBox
              checkBoxColor={"#F2F2F2"}
              checkedCheckBoxColor={"#25AAE1"}
              onClick={() => {
                this.setState({ checkBox: !checkBox });
              }}
              isChecked={checkBox}
              rightTextView={
                <Text
                  style={{
                    color: "#222",
                    fontSize: 12,
                    marginLeft: 10,
                  }}
                >
                  设定为首选银行账户
                </Text>
              }
            />
          </View>

          <TouchableOpacity
            style={[
              styles.LBdepositPageBtn1,
              {
                backgroundColor: addDisalbed ? "#00A6FF" : "#EFEFF4",
              },
            ]}
            onPress={this.addBank.bind(this)}
          >
            <Text
              style={[
                styles.LBdepositPageBtnText1,
                { color: addDisalbed ? "#fff" : "#BCBEC3" },
              ]}
            >
              保存
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default NewBank = connect(
  (state) => {
    return {};
  },
  (dispatch) => {
    return {};
  }
)(NewBankContainer);

const styles = StyleSheet.create({
  bankListstyle: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingBottom: 24,
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalHeadTitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  modalHeadTitleClose: {
    color: "#00A6FF",
    fontSize: 16,
  },
  placeholderText: {
    color: "#BCBEC3",
  },
  modalWrap: {
    backgroundColor: "#EFEFF4",
    paddingTop: 15,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 60,
    height: height * 0.8,
  },
  modalCOntainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .5)",
    width,
    height,
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10000,
    justifyContent: "flex-end",
  },
  limitLists: {
    marginBottom: 16,
  },
  limitListsInput: {
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
    height: 40,
    width: width - 20,
    borderRadius: 4,
    justifyContent: "center",
  },
  withdrawalText: {
    color: "#666",
    marginBottom: 8,
    fontSize: 14,
  },
  targetWalletBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    height: 44,
    borderWidth: 1,
    borderColor: "#E3E3E8",
    alignItems: "center",
    borderRadius: 8,
  },
  LBdepositPageBtn1: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 8,
  },
  LBdepositPageBtnText1: {
    color: "#BCBEC3",
    fontSize: 16,
    fontWeight: "bold",
  },
});
