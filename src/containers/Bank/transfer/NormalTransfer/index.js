import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  Platform,
  NativeModules,
  Image,
  TextInput,
} from "react-native";
import {
  Radio,
  WhiteSpace,
  Flex,
  Toast,
  List,
  Drawer,
  Button,
} from "antd-mobile-rn";
import ModalDropdown from "react-native-modal-dropdown";
import Touch from "react-native-touch-once";
import { formatMoney } from "../../../../lib/utils/util";
const { width, height } = Dimensions.get("window");

export default class index extends Component {
  constructor(props) {
    super(props);
    this.onOpenChange = (isOpen) => {
      /* tslint:disable: no-console */
      console.log("是否打开了 Drawer", isOpen.toString());
    };
    this.state = {
      money: "",
      moneyST: "",
      visible: false,
      payMoneyBtn: false,
      toAccount: this.props.promotionsDetail?.bonusProduct,
      fromAccount: "MAIN",
      BonusData: "",
      bonusId: 0,
      BonusMSG: "", //優惠提示訊息
    };
  }

  componentWillMount() {
    this.Bonus();
    console.log(this.props.promotionsDetail);
  }

  //显示
  show() {
    if (this.props.otherWalletList && this.props.otherWalletList.length > 0) {
      this.setState({
        visible: true,
      });
    }
  }
  //隐藏
  hide() {
    this.setState({
      visible: false,
    });
  }

  //信息完整验证
  validation() {
    const ST = this.state;
    if (ST.UnderMaintenance1) {
      Toasts.fail("您所选的账户在维护中，请重新选择", 2);
      return;
    }
    if (
      ST.money != "" &&
      ST.toAccount != "" &&
      ST.moneyST == "" &&
      ST.fromAccount != ""
    ) {
      this.setState({ payMoneyBtn: true });
    } else {
      this.setState({ payMoneyBtn: false });
    }
  }

  //转入账户
  toWallet = (key) => {
    const { allBalance, toWalletA } = this.state;
    let fromWalletA = allBalance.filter((item) => {
      return item.name != toWalletA[key].name;
    });
    this.setState(
      {
        toWalletKey: key,
        fromWalletA, //转出账户去除已选择的转入
        toAccount: toWalletA[key].name,
        BonusData: [], //重置优惠列表
        bonusId: 0,
        BonusMSG: "",
        UnderMaintenance2: toWalletA[key].state == "UnderMaintenance", //是否维护
      },
      () => {
        this.validation();
      }
    );
    this.Bonus(toWalletA[key].name);
  };

  //拿優惠
  Bonus(key) {
    fetchRequest(
      ApiPort.Bonus +
        `?transactionType=Transfer&wallet=${this.state.toAccount}&`,
      "GET"
    )
      .then((res) => {
        const data = res.result;
        let promotionId = -1;
        let promotionData = "";
        let BonusIndex = 0;

        if (this.props.froms == "promotions") {
          //优惠跳转转账
          promotionId = this.props.promotionsDetail.bonusProductList[0].bonusID;
          promotionData = data.find((Item) => {
            return Item.id == promotionId;
          });
          BonusIndex = data.findIndex((v) => v.id == promotionId);
          if (BonusIndex == -1) {
            BonusIndex = data.length - 1;
          }
        } else {
          BonusIndex = data.length - 1;
        }
        if (promotionData.length == 0) {
          promotionData = "";
        }

        this.setState(
          {
            promotionData,
            BonusData: data,
            BonusMSG: "",
          },
          () => {
            data.length > 0 && this.bonusSelect(BonusIndex);
          }
        );
      })
      .catch(() => {});
  }

  //优惠选择
  bonusSelect(key) {
    const BonusData = this.state.BonusData;
    this.setState({
      bonusCouponID: BonusData[key].bonusCouponID,
      bonusKey: key,
      bonusTitle: BonusData[key].title,
      bonusId: BonusData[key].id,
      BonusMSG: "",
    });
    this.bonusChange(BonusData[key].id, this.state.money);
  }

  //获取优惠详情信息
  bonusChange = (id, money) => {
    let m = money.toString().replace("￥", "");
    if (id == 0) {
      this.setState({ BonusMSG: "" });
      return;
    }
    let data = {
      transactionType: "Transfer",
      bonusId: id,
      amount: m || 0,
      wallet: this.state.toAccount,
      couponText: "string",
    };
    this.setState({ BonusMSG: "" });
    Toast.loading("确认优惠中，请稍等...", 200);

    fetchRequest("/api/Bonus/Calculate?", "POST", data)
      .then((data) => {
        Toast.hide();
        if (data.previewMessage != "") {
          this.setState({
            BonusMSG: data.previewMessage
            // BonusMSG: "",
          });
        } else if (data.errorMessage != "") {
          this.setState({
            BonusMSG: id != 0 ? data.errorMessage : "",
          });
        }
      })
      .catch(() => {
        Toast.hide();
      });
  };

  render() {
    const {
      transferType,
      BonusMSG,
      BonusData,
      fromWalletA,
      froms,
      fromAccount,
      SbUnderMaintenance,
      SBbalance,
      promotionData,
    } = this.props;
    const { visible, money, moneyST } = this.state;
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        {transferType == "" && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              top: 10,
            }}
          >
            <View
              style={{
                padding: 10,
                backgroundColor: "#fff",
                borderRadius: 10,
                width: width - 20,
              }}
            >
              {/* 转出自 */}
              <View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: "#666666", lineHeight: 30, fontSize: 12 }}
                  >
                    源自账户
                  </Text>
                  {froms != "promotions" && (
                    <View
                      style={{
                        borderColor: "#E3E3E8",
                        borderWidth: 1,
                        borderRadius: 6,
                      }}
                    >
                      {fromWalletA.length == 0 ? (
                        <Text
                          style={{
                            fontSize: 14,
                            lineHeight: 40,
                            paddingLeft: 15,
                          }}
                        >
                          数据加载中..
                        </Text>
                      ) : (
                        <Touch onPress={() => this.show()}>
                          <View
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexDirection: "row",
                              height: 44,
                            }}
                          >
                            <Text
                              style={{
                                color: "#000",
                                paddingLeft: 5,
                                fontSize: 14,
                              }}
                            >
                              {
                                fromWalletA.find((v) => v.name === fromAccount)
                                  .localizedName
                              }
                              ￥
                              {
                                fromWalletA.find((v) => v.name === fromAccount)
                                  .balance
                              }
                            </Text>
                          </View>
                        </Touch>
                      )}
                    </View>
                  )}
                  {froms == "promotions" && (
                    <View
                      style={{
                        borderColor: "#E3E3E8",
                        borderWidth: 1,
                        borderRadius: 6,
                      }}
                    >
                      {fromWalletA.length == 0 ? (
                        <Text
                          style={{
                            fontSize: 14,
                            lineHeight: 44,
                            paddingLeft: 15,
                          }}
                        >
                          数据加载中..
                        </Text>
                      ) : (
                        <View
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                            height: 44,
                            borderRadius: 8,
                            flex: 1,
                          }}
                        >
                          <Touch
                            style={{
                              height: 44,
                              flex: 1,
                            }}
                            onPress={() => this.show()}
                          >
                            <View
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "row",
                                width: "100%",
                                height: 44,
                              }}
                            >
                              <Text
                                style={{
                                  color: "#000",
                                  paddingLeft: 16,
                                  fontSize: 14,
                                }}
                              >
                                {
                                  fromWalletA.find(
                                    (v) => v.name === fromAccount
                                  ).localizedName
                                }
                                ￥
                                {
                                  fromWalletA.find(
                                    (v) => v.name === fromAccount
                                  ).balance
                                }
                              </Text>
                            </View>
                          </Touch>
                          <View
                            style={{
                              position: "absolute",
                              right: 16,
                              top: 14,
                            }}
                          >
                            <Image
                              resizeMode="stretch"
                              source={
                                visible
                                  ? require("../../../../images/up.png")
                                  : require("../../../../images/down.png")
                              }
                              style={{
                                width: 16,
                                height: 16,
                                transform: [{ rotateY: "180deg" }],
                              }}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
                {/* 转入至 */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: "#666666", lineHeight: 30, fontSize: 12 }}
                  >
                    目标账户
                  </Text>
                  <View style={{ backgroundColor: "#EFEFF4", borderRadius: 8 }}>
                    {SbUnderMaintenance ? (
                      <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 44,
                          paddingLeft: 15,
                        }}
                      >
                        数据加载中..
                      </Text>
                    ) : (
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          height: 44,
                        }}
                      >
                        <Text
                          style={{
                            color: "#bcbec3",
                            paddingLeft: 16,
                            fontSize: 14,
                          }}
                        >
                          {SbUnderMaintenance
                            ? "维护中"
                            : `${this.state.toWallet} ￥` +
                              formatMoney(SBbalance, 2)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              {/* 转账金额 */}
              <View>
                <View style={{ backgroundColor: "#fff", paddingTop: 10 }}>
                  <Text
                    style={{
                      color: "#666666",
                      fontSize: 12,
                      paddingBottom: 10,
                    }}
                  >
                    金额
                  </Text>
                  <View
                    style={{
                      borderColor: moneyST != "" ? "red" : "#ddd",
                      borderWidth: 1,
                      borderRadius: 5,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      value={money != "" && money}
                      maxLength={8}
                      style={{
                        textAlign: "left",
                        color: "#000",
                        height: 44,
                        width: "100%",
                        fontSize: 14,
                        paddingLeft: 16,
                      }}
                      placeholder={"输入金额"}
                      placeholderTextColor={"#999"}
                      onChangeText={(value) => {
                        this.moneyChange(value);
                      }}
                      onBlur={() => {
                        this.moneyBlur();
                      }}
                    />
                  </View>
                  {moneyST != "" && (
                    <View
                      style={{
                        backgroundColor: "#fee0e0",
                        borderRadius: 10,
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "red",
                          fontSize: 11,
                          paddingLeft: 10,
                          paddingBottom: 10,
                          paddingTop: 10,
                        }}
                      >
                        {moneyST}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {promotionData != "" && this.props.froms == "promotions" && (
                <View>
                  <View style={styles.BonusDatas}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#000",
                        width: width - 60,
                        lineHeight: 22,
                        paddingBottom: 15,
                        fontSize: 17,
                      }}
                    >
                      {promotionData.title}
                    </Text>
                    <View style={styles.stateList}>
                      <Text style={styles.statesTitle}>申请金额</Text>
                      <Text style={styles.statesTitle}>可得红利</Text>
                      <Text style={styles.statesTitle}>所需流水</Text>
                    </View>
                    <View style={styles.stateList}>
                      <Text style={styles.statesTitles}>
                        ¥{money == "" ? "0" : money}
                      </Text>
                      <Text style={styles.statesTitles}>
                        ¥
                        {Number(money) * promotionData.givingRate >
                        promotionData.maxGiving
                          ? promotionData.maxGiving
                          : (Number(money) * promotionData.givingRate).toFixed(
                              2
                            )}
                      </Text>
                      <Text style={styles.statesTitles}>
                        {(
                          (Number(money) +
                            Number(money) * promotionData.givingRate) *
                          promotionData.releaseValue
                        ).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  {BonusMSG != "" && (
                    <Text
                      style={{
                        color: "red",
                        fontSize: 11,
                        width: width - 60,
                        lineHeight: 15,
                        paddingTop: 10,
                      }}
                    >
                      {BonusMSG}
                    </Text>
                  )}
                </View>
              )}

              {/* 优惠选择 */}
              {(this.props.froms != "promotions" || promotionData == "") &&
                BonusData != "" && (
                  <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontSize: 12, paddingBottom: 10 }}>
                      优惠申请
                    </Text>

                    <Flex style={{ backgroundColor: "#fff" }}>
                      <Flex.Item
                        style={{
                          flex: 1,
                          paddingTop: 5,
                          backgroundColor: "#fff",
                          borderColor: "#E3E3E8",
                          borderWidth: 1,
                          borderRadius: 6,
                        }}
                      >
                        <ModalDropdown
                          ref={(el) => (this._dropdown_3 = el)}
                          defaultValue="下回再参与"
                          defaultIndex={BonusData.length - 1}
                          textStyle={styles.dropdown_D_text}
                          dropdownStyle={[
                            styles.dropdown_DX_dropdown,
                            {
                              height:
                                BonusData.length > 2
                                  ? 55 * 3
                                  : 55 * BonusData.length,
                            },
                          ]}
                          options={BonusData}
                          renderButtonText={(rowData) =>
                            this._dropdown_1_renderButtonText(rowData)
                          }
                          renderRow={this._dropdown_3_renderRow.bind(this)}
                          onSelect={this.BonusButton}
                        />
                        <View
                          style={{ position: "absolute", right: 10, top: 12 }}
                        >
                          <Image
                            resizeMode="stretch"
                            source={require("../../../../images/down.png")}
                            style={{ width: 16, height: 16 }}
                          />
                        </View>
                      </Flex.Item>
                    </Flex>
                    {BonusMSG != "" && (
                      <Text
                        style={{
                          color: "red",
                          fontSize: 11,
                          width: width - 50,
                          lineHeight: 16,
                          paddingTop: 10,
                        }}
                      >
                        {BonusMSG}
                      </Text>
                    )}
                  </View>
                )}

              {/* 立即转账 */}
              <Touch
                onPress={() => this.okPayMoney()}
                style={{
                  backgroundColor: payMoneyBtn ? "#00a6ff" : "#EFEFF4",
                  borderRadius: 5,
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    color: payMoneyBtn ? "#fff" : "#BCBEC3",
                    lineHeight: 44,
                    textAlign: "center",
                  }}
                >
                  提交
                </Text>
              </Touch>

              <Touch
                onPress={() => {
                  Actions.pop();
                  Actions.DepositCenter({
                    froms: "promotions",
                    promotionsDetail: this.props.promotionsDetail,
                  });
                }}
                style={{
                  borderColor: "#00a6ff",
                  borderRadius: 5,
                  borderWidth: 1,
                  marginTop: 15,
                }}
              >
                <Text
                  style={{
                    color: "#00a6ff",
                    lineHeight: 44,
                    textAlign: "center",
                  }}
                >
                  存款
                </Text>
              </Touch>
            </View>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  dropdown_D_text: {
    paddingBottom: 3,
    fontSize: 14,
    color: "#666666",
    textAlignVertical: "center",
    lineHeight: 30,
    paddingLeft: 10,
    width: width * 0.75,
  },
  dropdown_DX_dropdown: {
    borderWidth: 1,
    borderColor: "#E3E3E8",
    overflow: "hidden",
    marginTop: 10,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowColor: "#fff",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4,
  },
  BonusDatas: {
    width: width - 40,
    borderWidth: 1,
    borderColor: "#E3E3E8",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  stateList: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 10,
    width: width - 60,
  },
  statesTitle: {
    color: "#666666",
    fontSize: 12,
    width: (width - 60) / 3,
    textAlign: "center",
  },
  statesTitles: {
    color: "#000",
    width: (width - 60) / 3,
    textAlign: "center",
  },
});
