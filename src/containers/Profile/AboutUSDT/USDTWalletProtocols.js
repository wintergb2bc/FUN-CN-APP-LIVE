import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { tableHeader, tableData } from "./data";
const { width, height } = Dimensions.get("window");

class USDTHelpCenter extends React.Component<any, any> {
  inputRef: any;
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 1,
    };
  }

  onClickInfoTabs = (key) => {
    this.setState({
      tabIndex: key,
    });
  };
  render() {
    return (
      <>
        <View style={styles.magTab}>
          <TouchableOpacity
            onPress={() => {
              this.onClickInfoTabs(1);
            }}
            style={[
              styles.magTabList,
              { borderBottomWidth: this.state.tabIndex == 1 ? 3 : 0 },
            ]}
          >
            <Text style={{ color: this.state.tabIndex == 1?"#fff":"#B4E4FE", fontSize: 14, fontWeight: "bold" }}>
              什么是 USDT
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.onClickInfoTabs(2);
            }}
            style={[
              styles.magTabList,
              { borderBottomWidth: this.state.tabIndex == 2 ? 3 : 0 },
            ]}
          >
            <Text style={{ color: this.state.tabIndex == 2?"#fff":"#B4E4FE", fontSize: 14, fontWeight: "bold" }}>
              钱包协议
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, paddingBottom: 50 }}>
            <View style={{ paddingTop: 24, paddingHorizontal: 15 }}>
              {this.state.tabIndex == 1 && (
                <>
                  <Text
                    style={{
                      color: "#222222",
                      fontSize: 14,
                      fontWeight: "bold",
                      marginBottom: 15,
                    }}
                  >
                    泰达币简介
                  </Text>
                  <View
                    style={{
                      padding: 24,
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      marginBottom: 24,
                      fontSize: 12,
                    }}
                  >
                    <Text style={{ color: "#666", lineHeight: 20 }}>
                      泰达币（USDT）是Tether公司推出的基于稳定价值货币美元（USD）的代币Tether
                      USD。
                      每发行1个USDT，Tether公司的银行账户都会有1美元的资金保障，用户可以在Tether平台进行资金查询。
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: "#222222",
                      fontSize: 14,
                      fontWeight: "bold",
                      marginBottom: 15,
                    }}
                  >
                    泰达币特点
                  </Text>
                  <View
                    style={{
                      padding: 24,
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      marginBottom: 24,
                      fontSize: 12,
                    }}
                  >
                    <Text style={{ color: "#222", fontWeight: 'bold' }}>
                      稳定的货币
                    </Text>
                    <Text style={{ color: "#666", lineHeight: 20 }}>
                      Tether将现金转换成数字货币，锚定或将美元、欧元和日元等国家货币的价格钩。
                    </Text>

                    <Text style={{ color: "#222", fontWeight: 'bold',marginTop: 20 }}>
                      透明的
                    </Text>
                    <Text style={{ color: "#666", lineHeight: 20 }}>
                      我们的外汇储备每天都在公布，并受到频繁的专业审计。流通中的所有东西总是与我们的储备相匹配
                      。
                    </Text>

                    <Text style={{ color: "#222", fontWeight: 'bold',marginTop: 20 }}>
                      区块链技术
                    </Text>
                    <Text style={{ color: "#666", lineHeight: 20 }}>
                      Tether平台建立在区块链技术的基础之上，利用它们提供的安全性和透明性。
                    </Text>

                    <Text style={{ color: "#222", lineHeight: 20, fontWeight: 'bold',marginTop: 20 }}>安全</Text>
                    <Text style={{ color: "#666", lineHeight: 20 }}>
                      Tether的区块链技术在满足国际合规标准和法规的同时，提供了世界级的安全保障。
                    </Text>

                    <Text
                      style={{ color: "#666", lineHeight: 20, marginTop: 30 }}
                    >
                      USDT最大的特点是，它与同数量的美元是等值的，1USDT=1美元。使之成为波动剧烈的加密货币市场中良好的保值代币。
                    </Text>
                  </View>
                </>
              )}

              {this.state.tabIndex == 2 && (
                <>
                  <Text
                    style={{
                      color: "#222222",
                      fontSize: 14,
                      fontWeight: "bold",
                      marginBottom: 15,
                    }}
                  >
                    钱包协议的类型
                  </Text>
                  <View
                    style={{
                      padding: 24,
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      marginBottom: 24,
                      fontSize: 12,
                    }}
                  >
                    <Text style={{ color: "#222", fontSize: 12,  fontWeight: 'bold' }}>
                      第1种 ：ERC20
                    </Text>
                    <Text style={{ color: "#666", fontSize: 12,lineHeight: 20 }}>
                      存储在以太坊的 USDT （基于 ERC - 20 协议发行） 这种USDT存储在以太坊地址上，相对应的，每次转账（链接上转账）是 需要消耗GAS ，也就是ETH。
                    </Text>

                    <Text style={{ color: "#222", fontSize: 12,marginTop: 20, fontWeight: 'bold' }}>
                      第2种 ：TRC20
                    </Text>
                    <Text style={{ color: "#666", fontSize: 12,lineHeight: 20 }}>
                      存储在波场网络的 USDT（基于 TRC - 20 协议发行） 该USDT 存储在TRON 的地址中，存款 提款都是通过 TRON网络进行的。
                    </Text>

                    <Text style={{ color: "#222", fontSize: 12, marginTop: 20, fontWeight: 'bold' }}>
                      第3种：OMNI
                    </Text>
                    <Text style={{ color: "#666", fontSize: 12,lineHeight: 20 }}>
                      存储在比特币网络的 USDT （基于 OMNI 协议发行）这种 USDT 存储在比特币地址上，所以每次转账（链上转账）时，都需要支付少量比特币作为矿工费。
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: "#222222",
                      fontSize: 14,
                      fontWeight: "bold",
                      marginTop: 2,
                      marginLeft: 15,
                    }}
                  >
                    三种 USDT 科普
                  </Text>
                  {/* table */}
                  <View
                    style={{
                      flexDirection: "column",
                      flexWrap: "wrap",
                      // marginHorizontal: 16
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginTop: 16,
                      }}
                    >
                      {tableHeader.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={[
                              styles.tableHeader,
                              {
                                borderTopLeftRadius: index == 0 ? 10 : 0,
                                borderTopRightRadius: index == 3 ? 10 : 0,
                                flex: 1,
                              },
                            ]}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontSize: 12,
                                textAlign: "center",
                                lineHeight: 20,
                                fontWeight: 'bold',
                              }}
                            >
                              {item}
                            </Text>
                          </View>
                        );
                      })}
                    </View>

                    <View style={{ flexDirection: "column", flexWrap: "wrap" }}>
                      {tableData.map((item, index) => {
                        let controlColor = index % 2 == 0;
                        return (
                          <View
                            key={index}
                            style={[
                              {
                                flexDirection: "row",
                                flexWrap: "wrap",
                              },
                            ]}
                          >
                            <View
                              style={[
                                styles.tableHeader,
                                styles.tableContentWrap,
                                {
                                  backgroundColor: controlColor
                                    ? "#E0EEFA"
                                    : "#F3F5F9",
                                },
                              ]}
                            >
                              <Text style={[styles.tableContentText]}>
                                {item.type}
                              </Text>
                            </View>

                            <View
                              style={[
                                styles.tableHeader,
                                styles.tableContentWrap,
                                {
                                  backgroundColor: controlColor
                                    ? "#E0EEFA"
                                    : "#F3F5F9",
                                },
                              ]}
                            >
                              <Text style={[styles.tableContentText]}>
                                {item.first}
                              </Text>
                            </View>

                            <View
                              style={[
                                styles.tableHeader,
                                styles.tableContentWrap,
                                {
                                  backgroundColor: controlColor
                                    ? "#E0EEFA"
                                    : "#F3F5F9",
                                },
                              ]}
                            >
                              <Text style={[styles.tableContentText]}>
                                {item.second}
                              </Text>
                            </View>

                            <View
                              style={[
                                styles.tableHeader,
                                styles.tableContentWrap,
                                {
                                  backgroundColor: controlColor
                                    ? "#E0EEFA"
                                    : "#F3F5F9",
                                  borderRightWidth: 0,
                                },
                              ]}
                            >
                              <Text style={[styles.tableContentText]}>
                                {item.third}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                      <View
                        style={{
                          backgroundColor: "#fff",
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            lineHeight: 20,
                            fontSize: 12,
                            padding: 24,
                            color: "#222",
                          }}
                        >
                          * 三种USDT 地址不互通，转账请务必鉴别，存款等操
                          作应注意严格存入对应地址。
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        color: "#222222",
                        fontSize: 14,
                        fontWeight: "bold",
                        marginBottom: 15,
                        marginTop: 24,
                      }}
                    >
                      哪种协议更加符合您的需求？
                    </Text>
                    <View
                      style={{
                        padding: 24,
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        marginBottom: 24,
                        fontSize: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: "#666",
                          lineHeight: 20,
                          marginBottom: 24,
                        }}
                      >
                        1.大笔转账推荐 OMNI 的USDT，手续费贵，慢一点，但最安全。
                      </Text>
                      <Text
                        style={{
                          color: "#666",
                          lineHeight: 20,
                          marginBottom: 24,
                        }}
                      >
                        2.中等额度就选择 ERC20 的
                        USDT，手续费一般。速度一般，安全性较高。
                      </Text>
                      <Text style={{ color: "#666", lineHeight: 20 }}>
                        3.小额转账可以用波场USDT，速度更快一点，波场网络转账本身不收手续费（交易平台可能收一些）。
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
}

export default USDTHelpCenter;

const styles = StyleSheet.create({
  magTab: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    height: 35,
    width: width,
    backgroundColor: "#00a6ff",
  },
  magTabList: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomColor: "#fff",
    borderBottomWidth: 0,
    marginBottom: -3,
  },
  tableHeader: {
    backgroundColor: "#00A6FF",
    padding: 8,
    borderRightColor: "#fff",
    borderRightWidth: 1,
  },
  tableContentWrap: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 2,
    paddingVertical: 8,
  },
  tableContentText: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
  },
});
