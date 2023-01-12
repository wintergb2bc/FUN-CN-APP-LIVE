import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Dimensions,
  NativeModules,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Flex, Toast, WhiteSpace } from "antd-mobile-rn";
import { connect } from "react-redux";
import Touch from "@/containers/Common/TouchOnce";
import { Actions } from "react-native-router-flux";
import PiwikAction from "$LIB/utils/piwik";
import { Toasts } from "../../../Toast";
import actions from "$LIB/redux/actions/index";
import { getMoneyFormat } from '@/containers/Common/CommonFnData'

const { width, height } = Dimensions.get("window");

const circleColor = {
  MAIN: {
    color: "#BCBEC3",
  },
  SB: {
    color: "#00A6FF",
  },
  LD: {
    color: "#E91E63",
  },
  YBP: {
    color: "#99683D",
  },
  KYG: {
    color: "#99683D",
  },
  P2P: {
    color: "#99683D",
  },
  SLOT: {
    color: "#2ACB7A",
  },
  IMOPT: {
    color: "#2ACB7A",
  },
  KENO: {
    color: "#20BDAD",
  },
  LBK: {
    color: "#20BDAD",
  },
};

class OneClickTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutPopup: false,
    };
  }

  closePopover() {
    this.setState({
      aboutPopup: this.state.aboutPopup == false ? true : false,
    });
  }

  //一键转账
  fastPayMoney(item) {
    const { allBalance, } = this.props;
    const accountTotalBal = allBalance.filter(item => {
      return item.name == "TotalBal"
    })[0]

    if (!item) {
      return;
    }

    if (item.state === "UnderMaintenance") {
      Toasts.fail("您所选的账户在维护中，请重新选择", 2);
      return;
    }

    let data = {
      fromAccount: "All",
      toAccount: item.name,
      amount: accountTotalBal.balance,
      bonusId: 0,
      blackBoxValue: Iovation,
      e2BlackBoxValue: E2Backbox,
      bonusCoupon: "",
    };
    if(this.props.isFromSB){
      PiwikAction.SendPiwik(`InstantGames_Transfer_SB`);
    } else {
      PiwikEvent("Transfer", "Submit", "Transfer_GameNavigation");
    }
    Toast.loading("转账中,请稍候...", 200);
    fetchRequest(ApiPort.POST_Transfer, "POST", data)
      .then((data) => {
        Toast.hide();
        if (data.isSuccess) {
          this.payAfter(data.result);
        }
      })
      .catch(() => { });
  }

  //转账后处理
  payAfter(data) {
    // this.TotalBal();
    this.props.userInfo_getBalance(true);
    if (data.selfExclusionOption && data.selfExclusionOption.isExceedLimit) {
      // 有設轉帳總額限制
      this.setState({
        exceedLimitModal: true
      });
    } else if (data.status != 1 && data.unfinishedGames) {
      // 有未完成遊戲
      this.checkUnfinishedGames(data);
    } else if (data.status != 1) {
      if (!data.messages) {
        Toasts.fail("转帐失败", 2);
      } else {
        let msg = data.messages;
        Toasts.fail(msg, 2);
      }
    } else {
      Toasts.success("转账成功", 2);
      // this.Bonus();
      // if (data && this.state.bonusId != 0) {
      //   this.okBonusId(data);
      // }
    }
    //刷新账户余额
    this.setState({ fromAccount: "MAIN", money: "", payMoneyBtn: false });
  }


  render() {
    const { allBalance, } = this.props;
    return (
      <View style={styles.fastBox}>
        {allBalance != "" &&
          allBalance.map((item, index) => {
            return (
              <View
                key={index}
                style={[
                  styles.fastList,
                  { zIndex: item.name === "SB" ? 999 : 9 },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  <View
                    style={[
                      styles.circle,
                      {
                        backgroundColor: circleColor[item.name]
                          ? circleColor[item.name].color
                          : "#BCBEC3",
                      },
                    ]}
                  />
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 14, color: "#222" }}
                  >
                    {item.localizedName}
                  </Text>

                  {item.name === "SB" && (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          this.closePopover();
                        }}
                        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                      >
                        <Image
                          resizeMode="stretch"
                          source={require("@/images/transfer/notice.png")}
                          style={{ width: 14, height: 14, marginLeft: 10 }}
                        />
                      </TouchableOpacity>
                      {this.state.aboutPopup && (
                        <View style={styles.Popover}>
                          <TouchableOpacity
                            onPress={() => {
                              this.closePopover();
                            }}
                            style={styles.PopoverContent}
                          >
                            <View style={styles.arrowB} />
                            <Text
                              style={{
                                color: "#fff",
                                // paddingRight: 5,
                                fontSize: 12,
                                lineHeight: 18
                                // padding: 15,
                              }}
                            >
                              包含 V2 虚拟体育, 沙巴体育, BTI 体育，{"\n"}IM 体育和电竞
                            </Text>
                            <Image
                              resizeMode="stretch"
                              source={require("../../../../images/closeWhite.png")}
                              style={{ width: 15, height: 15 }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 14,
                      color: item.state == "UnderMaintenance" ? "red" : "#222",
                    }}
                  >
                    {item.state == "UnderMaintenance"
                      ? "维护中"
                      : "￥" + getMoneyFormat(item.balance)}
                  </Text>

                  {
                    item.name == "P2P" ? (
                      <Touch
                        style={{ marginLeft: 15 }}
                        onPress={() => {
                          this.fastPayMoney(item);
                        }}
                      >
                        <Image
                          resizeMode="stretch"
                          source={require("@/images/transfer/onebutton.png")}
                          style={{ width: 20, height: 20 }}
                        />
                      </Touch>
                    ) : (
                      <View style={{ width: 35 }} />
                    )
                  }
                </View>


              </View>
            );
          })}

        <View style={{ flexDirection: 'row', justifyContent: "space-around", alignItems: 'center', marginTop: 20 }}>

          <Touch
            onPress={() => {
              if(this.props.isFromSB){
                PiwikAction.SendPiwik(`TransferPage_SB`);
              } else {
                PiwikEvent("Transfer Nav", "Click", "Transfer_GameNavigation");
              }
              Actions.Transfer();
            }}
            style={[styles.btnStyle, {}]}
          >
            <Text style={{ textAlign: 'center', color: '#00A6FF' }}>转账</Text>
          </Touch>

          <Touch
            onPress={() => {
              if(this.props.isFromSB){
                PiwikAction.SendPiwik(`DepositPage_SB`);
              } else {
                PiwikEvent("Deposit Nav", "Click", "Deposit_GameNavigation");
              }
              Actions.DepositCenter({ from: "GamePage" });
            }}
            style={[styles.btnStyle, { backgroundColor: '#00A6FF' }]}
          >
            <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>存款</Text>
          </Touch>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  game: state.game,
});
const mapDispatchToProps = (dispatch) => ({
  userInfo_getBalance: (forceUpdate = false) =>
    dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OneClickTransfer);

const styles = StyleSheet.create({
  fastBox: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 15,
    width,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  fastList: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  PopoverContent: {
    backgroundColor: "#363636",
    borderRadius: 8,
    padding: 15,
    width: 270,
    display: "flex",
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: "row",
  },
  arrowB: {
    position: "absolute",
    left: 80,
    top: -13,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: 7,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderBottomColor: "#363636",
    borderRightColor: "transparent",
  },
  Popover: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    width: 270,
    top: 24,
    right: -176,
  },
  circle: {
    width: 8,
    height: 8,
    marginRight: 10,
    borderRadius: 8 / 2,
  },
  btnStyle: {
    borderWidth: 1,
    borderColor: '#00A6FF',
    flex: 1,
    borderRadius: 8,
    marginHorizontal: 5,
    padding: 10
  }
});
