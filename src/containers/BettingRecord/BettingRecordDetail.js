import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Toast } from "antd-mobile-rn";
import { getMoneyFormat } from "../Common/CommonFnData";

class BettingRecordDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      TransData: this.props.data,
      providerCode: this.props.providerCode,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      title: this.props.Title,
    });
  }

  render() {
    const { TransData } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#EFEFF4", padding: 15 }}>
        <ScrollView
          style={{ flex: 1 }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View>
            {TransData == "" ? (
              <Text
                style={{ color: "#000", fontSize: 18, textAlign: "center" }}
              >
                加载中...
              </Text>
            ) : TransData == "暂无数据" ? (
              <Text
                style={{ color: "#000", fontSize: 18, textAlign: "center" }}
              >
                暂无数据
              </Text>
            ) : (
              TransData.map((item, index) => {
                let WinLoss = item.winLoss + "";
                return (
                  <View
                    style={{
                      backgroundColor: "#fff",
                      // borderRadius: 15,
                      padding: 15,
                      marginBottom: 15,
                    }}
                    key={index}
                  >
                    <View style={styles.listRow}>
                      <Text style={{ color: "#666666" }}>日期</Text>
                      <Text style={{ color: "#222222" }}>
                        {item.dateLabel != "" && item.dateLabel.split("T")[0]}
                      </Text>
                    </View>
                    <View style={styles.listRow}>
                      <Text style={{ color: "#666666" }}>投注金额</Text>
                      <Text style={{ color: "#222222" }}>
                        ¥ {getMoneyFormat(item.betAmount)}
                      </Text>
                    </View>
                    <View style={styles.listRow}>
                      <Text style={{ color: "#666666" }}>有效流水</Text>
                      <Text style={{ color: "#222222" }}>
                        {getMoneyFormat(item.validTurnoverAmount)}
                      </Text>
                    </View>
                    <View style={styles.listRowLast}>
                      <Text style={{ color: "#666666" }}>输/赢</Text>
                      <Text
                        style={{
                          color: item.winLoss > 0 ? "#F92D2D" : "#42D200",
                          fontWeight: "500"
                        }}
                      >
                        {item.winLoss > 0 ? "+" : "-"}{" "}¥{" "}
                        {getMoneyFormat(WinLoss.replace("-", ""))}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default BettingRecordDetail;

const styles = StyleSheet.create({
  listRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
  listRowLast: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});
