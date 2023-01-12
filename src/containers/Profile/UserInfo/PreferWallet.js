import React from "react";
import { Dimensions, StyleSheet, Text, View, } from "react-native";
import { connect } from "react-redux";
import Touch from "react-native-touch-once";
import { Toast } from "antd-mobile-rn";
import { Toasts } from "../../Toast";
import { Actions } from "react-native-router-flux";

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

class PreferWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curWalletIndex: 0,
    };
  }

  componentWillMount(props) {
    const { memberInfo } = this.props;
    const allBalance = this.props.userInfo.allBalance;
    let walletIndex = allBalance.findIndex(v => v.name == memberInfo.preferWallet);
    walletIndex = walletIndex < 0 ? 0 : walletIndex;
    this.setState({
      curWalletIndex: walletIndex,
      curWalletName: allBalance[walletIndex].name
    });
  }

  submit() {
    console.log("submit");
    const data = {
      key: "Wallet",
      value1: this.state.curWalletName
    };
    Toast.loading("提交中,请稍候...", 200);
    fetchRequest(window.ApiPort.Register, "PATCH", data)
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


  render() {
    const { curWalletIndex } = this.state;
    const { preferWallet } = this.props.memberInfo;
    console.log(curWalletIndex);
    
    return (
      <View style={{ flex: 1, backgroundColor: "#EFEFF4" }}>
        <View style={[styles.listData, { margin: 15 }]}>
          {this.props.userInfo.allBalance.map((item, index) => {
            if(item.name === "TotalBal") {
               return null; 
            }
            return (
              <Touch
                key={index}
                style={styles.container}
                onPress={() => {
                  this.setState({ curWalletIndex: index, curWalletName: item.name });
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
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
                  <Text style={{ color: "#222", marginLeft: 10, fontSize: 14, fontWeight: "400" }}>
                    {item.localizedName}
                  </Text>
                </View>
                {curWalletIndex === index ? (
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

              </Touch>
            );
          })}
        </View>
        <Touch
          onPress={() => {
            this.submit();
          }}
          style={[
            styles.btn,
            {
              backgroundColor: "#00A6FF",
            },
          ]}
        >
          <Text
            style={[
              styles.btnTxt,
              {
                color: "#fff",
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

export default connect(mapStateToProps)(PreferWallet);

const styles = StyleSheet.create({
  listData: {
    paddingBottom: 20,
    paddingTop: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  container: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: 18,
    paddingHorizontal: 24
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
  circle: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
  },
});
