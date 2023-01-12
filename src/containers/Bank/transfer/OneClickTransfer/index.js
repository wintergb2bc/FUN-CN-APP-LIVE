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
import Touch from "../../../Common/TouchOnce";
import { Actions } from "react-native-router-flux";
import PiwikAction from "../../../../lib/utils/piwik";

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

export default class index extends Component {
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
  
  oneButtonUI = (item) => {
    const { allBalance, AccountTotalBal, from } = this.props;

    if(from === "sbHeader"){
      if(item.name === "SB"){
        return (
          <Touch
            style={{ marginLeft: 15 }}
            onPress={() => {
              this.props.fastPayMoney(item);
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../../../../images/transfer/onebutton.png")}
              style={{ width: 20, height: 20 }}
            />
          </Touch>
        )
      } else {
        return (
          <View style={{width: 35}} />
        )
      }
    }

    if(from === "P2P"){
      if(item.name === "P2P"){
        return (
          <Touch
            style={{ marginLeft: 15 }}
            onPress={() => {
              PiwikEvent("Transfer", "Submit", `${item.name}_QuickTransfer`);
              this.props.fastPayMoney(item);
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../../../../images/transfer/onebutton.png")}
              style={{ width: 20, height: 20 }}
            />
          </Touch>
        )
      } else {
        return (
          <View style={{width: 35}} />
        )
      }
    }
    
    return (
      <Touch
        style={{ marginLeft: 15 }}
        onPress={() => {
          PiwikEvent("Transfer", "Submit", `${item.name}_QuickTransfer`);
          this.props.fastPayMoney(item);
        }}
      >
        <Image
          resizeMode="stretch"
          source={require("../../../../images/transfer/onebutton.png")}
          style={{ width: 20, height: 20 }}
        />
      </Touch>
    )
  }

  render() {
    const { allBalance, AccountTotalBal, from } = this.props;
    return (
      <View style={from === "sbHeader" || from === "P2P" ? styles.fastSBHeaderBox : styles.fastBox}>
        {from !== "sbHeader" && (
          <View style={[styles.fastList]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={[styles.circle, { backgroundColor: "#BCBEC3" }]}/>
              <Text numberOfLines={1} style={{ fontSize: 14, color: "#222" }}>
                总余额
              </Text>
            </View>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                color: "#222",
                marginRight: 35,
              }}
            >
              ￥ {AccountTotalBal}
            </Text>
          </View>
        )}
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
                          source={require("../../../../images/transfer/notice.png")}
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
                            <View style={styles.arrowB}/>
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
                      : "￥" + item.balance}
                  </Text>

                  {this.oneButtonUI(item)}
                </View>
              </View>
            );
          })}
        {(from === "sbHeader" || from === "P2P") && (
          <View style={styles.modalBtnBox}>
            <TouchableOpacity style={[styles.modalBtn, { borderColor: '#00A6FF' }]} onPress={()=>{
              this.props.closeModal();
              Actions.Transfer();
              PiwikAction.SendPiwik(`TransferPage_SB`);
            }}>
              <Text style={[styles.modalBtnText, { color: '#00A6FF' }]}>转账</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#00A6FF', borderColor: '#00A6FF' }]}
                              onPress={()=>{
                                this.props.closeModal();
                                Actions.DepositCenter({ from: 'GamePage' })
                                PiwikAction.SendPiwik(`DepositPage_SB`);
                              }}
            >
              <Text style={[styles.modalBtnText, { color: '#fff', fontWeight: 'bold', }]}>存款</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fastBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    margin: 15,
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  fastSBHeaderBox: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 16,
    paddingBottom: 15,
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
  modalBtnBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24
  },
  modalBtn: {
    height: 44,
    width: "48%",
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  modalBtnText: {
    fontSize: 16
  },
});
