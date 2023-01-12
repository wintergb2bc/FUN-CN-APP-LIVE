import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  Image,
  View,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Clipboard,
  Platform,
  FlatList,
  RefreshControl,
  Modal,
} from "react-native";
import { Actions } from "react-native-router-flux";
import Accordion from "react-native-collapsible/Accordion";
import {
  Toast,
  Carousel,
  Flex,
  Picker,
  List,
  Tabs,
  DatePicker,
} from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import ModalDropdown from "react-native-modal-dropdown";
import { GetDateStr } from "../lib/utils/date";
import LivechatDragHoliday from "./LivechatDragHoliday"; //可拖動懸浮
import { connect } from "react-redux";
import moment from "moment";

const { width, height } = Dimensions.get("window");
import { getMemberWithdrawalThreshold } from './Common/CommonFnData' // 獲取銀行卡門檻限額

// 最多可添加幾張卡
const withdrawals_Banks_limit = 5;

class BankCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bankarr: [
        {
          title: "便捷提款账户",
        },
        {
          title: "泰达币ERC20提款钱包",
        },
        {
          title: "泰达币TRC20提款钱包",
        },
      ],
      bankarrIndex: 0,
      ctcWalletList: [],
      ctcWalletList2: [],
      withdrawalsBank: [],
      withdrawalThresholdCount: 0,
      withdrawalThresholdAmount: 0,
      withdrawalThresholdPercent: 0,
      aboutPopup: false,
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    Toast.loading("加载中,请稍候...", 200);
    let processed = [
      this.GetCryptoWalletERC(),
      this.GetCryptoWalletTRC(),
      this.getWithdrawalUserBankAction(),
      this.getWithdrawalThreshold(),
    ];
    Promise.all(processed)
      .then((res) => {
        console.log(res);
      })
      .finally(() => {
        Toast.hide();
      });
  };

  getBothCryptoWallet = () => {
    console.log("getBothCryptoWallet");
    Toast.loading("加载中,请稍候...", 200);
    let processed = [
      this.GetCryptoWalletERC(),
      this.GetCryptoWalletTRC()
    ];
    Promise.all(processed)
      .then((res) => {
        console.log(res);
      })
      .finally(() => {
        Toast.hide();
      });
  }

  //獲取銀行限額
  getWithdrawalThreshold() { // 銀行帳戶限額信息
    return getMemberWithdrawalThreshold((count, amount, Threshold) => {
      this.setState({
        withdrawalThresholdCount: count,
        withdrawalThresholdAmount: amount,
        withdrawalThresholdPercent: Threshold,
      });
    });
  }

  //獲取加密貨幣錢包
  GetCryptoWalletERC(showLoading = false) {
    if (showLoading) {
      Toast.loading("加载中,请稍候...", 200);
    }
    return fetchRequest(
      window.ApiPort.CryptoWallet + "?CryptoCurrencyCode=USDT-ERC20&",
      "GET"
    ).then((res) => {
        if (res.result.length > 0) {
          // const banks = this.adjustBanks(res);
          this.setState({ ctcWalletList: res.result });
        } else {
          this.setState({ ctcWalletList: [] });
        }
      }
    ).finally(() => {
      if (showLoading) {
        Toast.hide();
      }
    });
  }

  GetCryptoWalletTRC(showLoading = false) {
    if (showLoading) {
      Toast.loading("加载中,请稍候...", 200);
    }
    return fetchRequest(
      window.ApiPort.CryptoWallet + "?CryptoCurrencyCode=USDT-TRC20&",
      "GET"
    ).then((res) => {
        if (res.result.length > 0) {
          // const banks = this.adjustBanks(res);
          this.setState({ ctcWalletList2: res.result });
        } else {
          this.setState({ ctcWalletList2: [] });
        }
      }
    ).finally(() => {
      if (showLoading) {
        Toast.hide();
      }
    });
    ;
  }

  getWithdrawalUserBankAction() {
    Toast.loading("加载中,请稍候...", 2000);
    // global.storage
    //   .load({
    //     key: "withdrawalsUserBank",
    //     id: "withdrawalsUserBank",
    //   })
    //   .then((data) => {
    //     dispatch({ type: "WITHDRAWALUSERBANKACTION", data });
    //   })
    //   .catch(() => {
    //     dispatch({ type: "WITHDRAWALUSERBANKACTION", data: [] });
    //   });

    return fetchRequest(
      window.ApiPort.GetMemberBanks + "AccountType=Withdrawal&",
      "GET"
    )
      .then((res) => {
        Toast.hide();
        let withdrawalsBank = res.result;
        //this.changeWithdrawalsBtnStatus()
        let defaultBank = withdrawalsBank.find((v) => v.isDefault);
        if (defaultBank) {
          let defaultBankIndex = withdrawalsBank.findIndex((v) => v.isDefault);
          withdrawalsBank.splice(defaultBankIndex, 1);
          withdrawalsBank.unshift(defaultBank);
        }

        this.setState({
          withdrawalsBank,
        });

        global.storage.save({
          key: "withdrawalsUserBank",
          id: "withdrawalsUserBank",
          data: withdrawalsBank,
          expires: null,
        });
      })
      .catch((err) => {
        Toast.hide();
      });
  }

  setDefault(id, type) {
    Toast.loading("加载中,请稍候...", 2000);
    fetchRequest(
      `${window.ApiPort.SetDefault}bankId=${id}&`,
      "PATCH"
    )
      .then((res) => {
        Toast.hide();
        if (res.isSuccess == true) {
          Toasts.success("设置成功！");
        } else {
          Toasts.fail("设置失败！");
        }
        this.getWithdrawalUserBankAction();
      })
      .catch((error) => {
        Toast.hide();
      });
  }

  changeRebateDatePicker(day) {
    this.setState({
      birthdayDate: moment(day).format("YYYY-MM-DD"),
    });
  }

  changeBnak(bankarrIndex) {
    this.setState({
      bankarrIndex,
    });
  }

  //设置默认錢包
  async setDefaultWallet(id) {
    try {
      Toast.loading("设置中,请稍候...", 200);
      const res = await fetchRequest(
        window.ApiPort.CryptoWalletSetDefault + "walletId=" + id + "&",
        "PATCH"
      );
      Toast.hide();
      if (res.isSuccess == true) {
        this.setState({ settingFlag: false });
        await this.getBothCryptoWallet();
        this.setState({
          toastSuccessFlag: true,
        });
        setTimeout(() => {
          this.setState({ toastSuccessFlag: false });
        }, 1500);
        // Toasts.success("设置成功！");
      } else {
        this.setState({
          toastErrorFlag: true,
        });
        setTimeout(() => {
          this.setState({ toastErrorFlag: false });
        }, 1500);
        // Toasts.fail("设置失败！");
      }
    } catch (error) {
      Toast.hide();
      Toasts.fail("设置失败！");
    }
  }

  copy(txt) {
    try {
      const value = String(txt);
      Clipboard.setString(value);
      Toast.info("已复制", 2);
    } catch (error) {
      //console.log(error);
    }
  }

  closePopover() {
    this.setState({
      aboutPopup: this.state.aboutPopup == false ? true : false,
    });
  }

  render() {
    const {
      withdrawalsBank,
      bankarr,
      bankarrIndex,
      ctcWalletList,
      ctcWalletList2,
      withdrawalThresholdCount,
      withdrawalThresholdAmount,
      withdrawalThresholdPercent
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#EFEFF4" }}>
        <View
          style={{
            backgroundColor: "#00A6FF",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {bankarr.map((v, i) => {
            let flag = bankarrIndex == i;
            return (
              <TouchableOpacity
                key={i}
                onPress={this.changeBnak.bind(this, i)}
                style={{
                  width: i == 0 ? width / 4 : (3 * width) / 4 / 2,

                  alignItems: "center",
                  justifyContent: "center",
                  height: 44,
                  borderBottomWidth: 3,
                  borderBottomColor: flag ? "#FFFFFF" : "#00A6FF",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: flag ? "#FFFFFF" : "#B4E4FE",
                    fontWeight: flag ? "bold" : "normal",
                    fontSize: 12,
                  }}
                >
                  {v.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView
          // style={{ flex: 1 ,backgroundColor:'#171717'}}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bankProfile}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                zIndex: 100,
                width: '100%'
              }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#000', fontSize: 14 }}>银行账户限额设置</Text>
                <>
                  <TouchableOpacity
                    onPress={() => {
                      this.closePopover();
                    }}
                    hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../images/transfer/notice.png")}
                      style={{ width: 14, height: 14, marginLeft: 8 }}
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
                            paddingRight: 3,
                            fontSize: 12,
                            lineHeight: 18,

                          }}
                        >
                          限额设置适用于所有提款银行账户。例：{"\n"}
                          提款次数= 50,{"\n"}
                          提款金额= 100,000{"\n"}
                          限额百分比= 50％{"\n"}
                          当您成功提款25笔或提款总额达50,000元人民币至同一银行账户时, 系统将会提醒您注意账户安全，建议您添加或更换新的银行账户。
                        </Text>
                        <Image
                          resizeMode="stretch"
                          source={require("../images/closeWhite.png")}
                          style={{ width: 15, height: 15, position: 'absolute', top: 7, right: 7 }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              </View>
              <Touch onPress={() => {
                Actions.SetBankThreshold({
                  withdrawalThresholdCount,
                  withdrawalThresholdAmount,
                  withdrawalThresholdPercent,
                  reloadMemberWithdrawalThreshold: (param) => {
                    this.getWithdrawalThreshold(param)
                  }
                });
                PiwikEvent('Search_withdrawalrecord_Carddetail')
              }}>
                <Image
                  resizeMode="stretch"
                  source={require("../images/icon/edit.png")}
                  style={{ width: 16, height: 16, marginLeft: 8 }}
                />
              </Touch>
            </View>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', flex: 1, marginTop: 19, zIndex: 50 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#000', fontSize: 14 }}>{withdrawalThresholdCount}次</Text>
                <Text style={{ color: '#999', fontSize: 12, marginTop: 4 }}>提款次数</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#000', fontSize: 14 }}>{withdrawalThresholdAmount} 元</Text>
                <Text style={{ color: '#999', fontSize: 12, marginTop: 4 }}>提款金额</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#000', fontSize: 14 }}>{withdrawalThresholdPercent} %</Text>
                <Text style={{ color: '#999', fontSize: 12, marginTop: 4 }}>限额百分比</Text>
              </View>
            </View>
          </View>

          <View style={{ marginHorizontal: 15, marginTop: 10, zIndex: 50 }}>
            {bankarrIndex == 0 && (
              <View>
                {withdrawalsBank.length > 0 &&
                  withdrawalsBank.map((v, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: 4,
                          marginBottom: 15,
                          padding: 15,
                        }}
                        onPress={() => {
                          Actions.bankcardDetail({
                            detail: v,
                          });
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text>{v.bankName}</Text>

                          {v.isDefault ? (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: "#0CCC3C",
                                  width: 18,
                                  height: 18,
                                  borderRadius: 1000,
                                  marginRight: 5,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text style={{ color: "#fff" }}>✓</Text>
                              </View>
                              <Text style={{ color: "#0CCC3C" }}>默认</Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={this.setDefault.bind(
                                this,
                                v.bankAccountID
                              )}
                            >
                              <Text style={{ color: "#00A6FF" }}>设置默认</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 25,
                          }}
                        >
                          <Text>*************{v.accountNumber.slice(-3)}</Text>

                          <Text
                            style={{
                              backgroundColor: "grren",
                              color: "#999999",
                            }}
                          >
                            &gt;
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                {withdrawalsBank.length < withdrawals_Banks_limit && (
                  <TouchableOpacity
                    onPress={() => {
                      Actions.NewBank({
                        bankType: "W",
                        fromPage: "withdrawals",
                        getWithdrawalUserBankAction: () => {
                          this.getWithdrawalUserBankAction();
                        },
                        reloadMemberWithdrawalThreshold: (param) => {
                          this.getWithdrawalThreshold(param)
                        }
                      });

                      PiwikEvent(
                        "Account",
                        "Click",
                        "Add_BankCard_ProfilePage"
                      );
                    }}
                    style={styles.addBankBtn}
                  >
                    <Text style={{ color: "#00A6FF", fontWeight: "bold" }}>
                      添加银行帐户
                    </Text>
                  </TouchableOpacity>
                )}

                <Text
                  style={{
                    color: "#999999",
                    textAlign: "center",
                    fontSize: 11,
                    marginTop: 12,
                  }}
                >
                  最多可以添加5张银行卡，如需删除银行卡，请联系
                  <Text
                    onPress={() => {
                      LiveChatOpenGlobe();
                    }}
                    style={{ color: "#00A6FF" }}
                  >
                    在线客服
                  </Text>
                  。
                </Text>
              </View>
            )}
            {bankarrIndex == 1 && (
              <View>
                {ctcWalletList.length > 0 &&
                  ctcWalletList.map((v, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: 4,
                          marginBottom: 15,
                          padding: 15,
                        }}
                        onPress={() => {
                          // Actions.bankcardDetail({
                          // 	detail: v
                          // })
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text>{v.walletName}</Text>

                          {v.isDefault ? (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: "#0CCC3C",
                                  width: 18,
                                  height: 18,
                                  borderRadius: 1000,
                                  marginRight: 5,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text style={{ color: "#fff" }}>✓</Text>
                              </View>
                              <Text style={{ color: "#0CCC3C" }}>默认</Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={this.setDefaultWallet.bind(this, v.id)}
                            >
                              <Text style={{ color: "#00A6FF" }}>设置默认</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 25,
                          }}
                        >
                          <Text style={{ width: width - 120 }}>
                            {v.walletAddress}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(v.walletAddress);
                            }}
                          >
                            <Image
                              source={require("./../images/icon/copy.png")}
                              resizeMode="stretch"
                              style={{ width: 14, height: 14 }}
                            />
                          </Touch>
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                {ctcWalletList.length < 3 && (
                  <TouchableOpacity
                    onPress={() => {
                      Actions.CreatWallet({
                        CoinTypesType: "USDT-ERC20",
                        GetCryptoWallet: (v) => {
                          this.getBothCryptoWallet(v);
                        },
                      });

                      PiwikEvent(
                        "Account",
                        "Click",
                        "Add_CryptoWallet_ERC20_ProfilePage"
                      );
                    }}
                    style={styles.addBankBtn}
                  >
                    <Text
                      style={{ color: "#00A6FF", fontWeight: "bold" }}
                    >{`添加 USDT-ERC20 钱包地址`}</Text>
                  </TouchableOpacity>
                )}

                <Text
                  style={{
                    color: "#999999",
                    textAlign: "center",
                    fontSize: 11,
                    marginTop: 12,
                  }}
                >
                  如您需要更改钱包地址，请联系
                  <Text
                    onPress={() => {
                      LiveChatOpenGlobe();
                    }}
                    style={{ color: "#00A6FF" }}
                  >
                    在线客服
                  </Text>
                  。
                </Text>
              </View>
            )}

            {bankarrIndex == 2 && (
              <View>
                {ctcWalletList2.length > 0 &&
                  ctcWalletList2.map((v, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: 4,
                          marginBottom: 15,
                          padding: 15,
                        }}
                        onPress={() => {
                          // Actions.bankcardDetail({
                          // 	detail: v
                          // })
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text>{v.walletName}</Text>

                          {v.isDefault ? (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: "#0CCC3C",
                                  width: 18,
                                  height: 18,
                                  borderRadius: 1000,
                                  marginRight: 5,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text style={{ color: "#fff" }}>✓</Text>
                              </View>
                              <Text style={{ color: "#0CCC3C" }}>默认</Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={this.setDefaultWallet.bind(this, v.id)}
                            >
                              <Text style={{ color: "#00A6FF" }}>设置默认</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 25,
                          }}
                        >
                          <Text style={{ width: width - 120 }}>
                            {v.walletAddress}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(v.walletAddress);
                            }}
                          >
                            <Image
                              source={require("./../images/icon/copy.png")}
                              resizeMode="stretch"
                              style={{ width: 14, height: 14 }}
                            />
                          </Touch>
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                {ctcWalletList2.length < 3 && (
                  <TouchableOpacity
                    onPress={() => {
                      Actions.CreatWallet({
                        CoinTypesType: "USDT-TRC20",
                        GetCryptoWallet: (v) => {
                          this.getBothCryptoWallet(v);
                        },
                      });

                      PiwikEvent(
                        "Account",
                        "Click",
                        "Add_CryptoWallet_TRC20_ProfilePage"
                      );
                    }}
                    style={styles.addBankBtn}
                  >
                    <Text
                      style={{ color: "#00A6FF", fontWeight: "bold" }}
                    >{`添加 USDT-TRC20 钱包地址`}</Text>
                  </TouchableOpacity>
                )}

                <Text
                  style={{
                    color: "#999999",
                    textAlign: "center",
                    fontSize: 11,
                    marginTop: 12,
                  }}
                >
                  如您需要更改钱包地址，请联系
                  <Text
                    onPress={() => {
                      LiveChatOpenGlobe();
                    }}
                    style={{ color: "#00A6FF" }}
                  >
                    在线客服
                  </Text>
                  。
                </Text>
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

export default connect(mapStateToProps)(BankCard);

const styles = StyleSheet.create({
  addBankBtn: {
    borderWidth: 1,
    borderColor: "#00A6FF",
    borderStyle: "dashed",
    paddingVertical: 40,
    alignItems: "center",
    borderRadius: 2,
    justifyContent: "center",
  },
  bankProfile: { // 银行账户限额
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 8,
    zIndex: 100,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
  },
  Popover: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    width: 265,
    top: 24,
    right: -153,
  },
  PopoverContent: {
    backgroundColor: "#363636",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    // height: 40,
  },
  arrowB: {
    position: "absolute",
    left: 98,
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
  circle: {
    width: 8,
    height: 8,
    marginRight: 10,
    borderRadius: 8 / 2,
  },
});
