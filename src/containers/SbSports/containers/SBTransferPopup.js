import React, { Component } from 'react';
import OneClickTransfer from "../../Bank/transfer/OneClickTransfer";
import { Dimensions, StyleSheet, TouchableOpacity, View, Platform } from "react-native";
import { ActivityIndicator, Toast } from "antd-mobile-rn";
import actions from "../../../lib/redux/actions";
import { connect } from "react-redux";
import { Toasts } from "../../Toast";
import { ACTION_UserInfo_getBalanceSB } from '$LIB/redux/actions/UserInfoAction';
import PiwikAction from "../../../lib/utils/piwik";

const { width, height } = Dimensions.get("window");

class SbTransferPopup extends Component {
  //一键转账
  fastPayMoney(item) {
    if (!item) {
      return;
    }

    if (item.state === "UnderMaintenance") {
      Toasts.fail("您所选的账户在维护中，请重新选择", 2);
      return;
    }

    let data = {
      fromAccount: "All",
      toAccount: this.props.from === "P2P"? "P2P" : "SB",
      amount: this.props.userInfo.allBalance.find((v) => v.name === "TotalBal").balance,
      bonusId: 0,
      blackBoxValue: Iovation,
      e2BlackBoxValue: E2Backbox,
      bonusCoupon: "",
    };
    PiwikAction.SendPiwik(`Sports_Transfer_SB`);
    Toast.loading("转账中,请稍候...", 200);
    fetchRequest(ApiPort.POST_Transfer, "POST", data)
      .then((data) => {
        Toast.hide();
        if (data.isSuccess) {
          this.payAfter(data.result);
        }
      })
      .catch(() => {
      });
  }

  //转账后处理
  payAfter(data) {
    this.props.userInfo_getBalanceSB(true);
    if (data.selfExclusionOption && data.selfExclusionOption.isExceedLimit) {
      console.log('金额超过自我限制')
      Toasts.fail("金额超过自我限制", 2);
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
      // 	this.okBonusId(data);
      // }
    }
  }

  render() {
    return (
      <>
        {this.props.userSetting.sbTransferPopup && (
          <View style={[styles.gameMenuModals, {top: this.props.from === "P2P"? Platform.OS === "ios" ? 44 : 50 : 0}]}>
            <TouchableOpacity style={styles.modalMark} onPress={() => {
              this.props.sbTransferToggle()
            }} />

            {
              this.props.userInfo.allBalance != "" ? (
                <OneClickTransfer
                  allBalance={this.props.userInfo.allBalance}
                  AccountTotalBal={this.props.userInfo.allBalance.find((v) => v.name === "TotalBal").balance}
                  fastPayMoney={(item) => this.fastPayMoney(item)}
                  from={"sbHeader"}
                  closeModal={() => {
                    this.setState({
                      fastTransferModal: false
                    })
                  }}
                />
              ) : (
                <View style={{ marginTop: 20 }}>
                  <ActivityIndicator color="#00A6FF"/>
                </View>
              )
            }
          </View>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
  userSetting: state.userSetting,
});
const mapDispatchToProps = {
  userInfo_getBalanceSB: (forceUpdate = false) => ACTION_UserInfo_getBalanceSB(forceUpdate),
  sbTransferToggle: () => actions.ACTION_SBTransferPopup(),
};

export default connect(mapStateToProps, mapDispatchToProps)(SbTransferPopup);

const styles = StyleSheet.create({
  selfExclusionBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: width * 0.9 - 30,
    backgroundColor: '#00A6FF',
    borderRadius: 8,
  },
  selfExclusionTitle: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    backgroundColor: '#00A6FF',
    width: width * 0.9,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selfExclusionMsg: {
    padding: 15,
    paddingBottom: 25,
    paddingTop: 25,
    lineHeight: 18,
    color: '#000',
    fontSize: 13,
  },
  selfExclusion: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingBottom: 20,
  },
  maintenance: {
    borderColor: '#FFEDA6',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFEDA6',
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    width: 26,
    height: 16,
    top: -13,
    right: -5
  },
  modalMark: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  gameList: {
    width: 90,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  gameListDown: {
    width: 90,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  headers: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 50,
    width: width,
    backgroundColor: "#00a6ff",
    zIndex: 50,
    marginBottom: 7,
    // elevation: 999, // 这是重点！
  },
  modalView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modals: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0,0.5)",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameMenuModals: {
    flex: 1,
    width: width,
    height: height,
    position: "absolute",
    zIndex: 9999,
    elevation: 9999, // 这是重点！
    backgroundColor: "rgba(0, 0, 0,0.5)"
  },
  GameMenu: {},
  GameMenuText: {
    lineHeight: 35,
    color: '#fff',
    fontSize: 16,
  },
  GameMenuTextB: {
    lineHeight: 35,
    color: '#000',
    fontSize: 16,
  },
  GameMenuTextC: {
    lineHeight: 35,
    color: '#00A6FF',
    fontSize: 16,
  },
  Gamedropdown: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 90,
    backgroundColor: "#fff",
    borderRadius: 8,
    position: 'absolute',
    zIndex: 99,
  },
  arrow: {
    top: 9,
    left: 8,
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderTopColor: '#fff',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
    borderBottomWidth: 7,
    borderBottomColor: 'transparent',
  },
  MoneyBG: {
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative",
    // flex: 1,
    // left: 25,
  },
  dropdown_D_text1: {
    paddingBottom: 3,
    fontSize: 15,
    color: "#00A6FF",
    textAlignVertical: "center",
    lineHeight: 30,
    textAlign: 'center',
  },
  dropdown_D_text2: {
    paddingBottom: 3,
    fontSize: 15,
    color: "#fff",
    textAlignVertical: "center",
    lineHeight: 30,
    textAlign: 'center',
  },
  dropdown_DX_dropdown: {
    height: 40 * 2,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowColor: "#666",
    elevation: 4,
    backgroundColor: '#fff'
  },
  selectShow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: 100,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  selectHide: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: 100,
  },
});
