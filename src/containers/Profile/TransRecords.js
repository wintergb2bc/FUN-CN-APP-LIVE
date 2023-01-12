import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";
const { width, height } = Dimensions.get("window");

class TransRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      NowBankType: this.props.previousPage || "deposit", // 用戶選擇充值銀行
    };
  }

  componentDidMount() {
    if (this.props.previousPage == "Transferbonus") {
      this.setState({ activeTabs: 2, NowBankType: "Transfer" });
      this.GetTransf();
    } else if (this.props.previousPage == "Withdrawal") {
      this.Getrecords("Withdrawal");
      return;
    } else {
      this.Getrecords();
    }
  }

  //查詢 存款 提款 紀錄
  Getrecords() {
    const { NowBankType, befosDate, nowDate } = this.state;
    Toast.loading("查询中，请稍侯...", 200);
    fetchRequest(
      ApiPort.BankingHistory +
        "transactionType=" +
        NowBankType +
        "&paymentMethod=&dateFrom=" +
        befosDate +
        "&dateTo=" +
        nowDate +
        "&",
      "GET"
    )
      .then((res) => {
        Toast.hide();
        const data = res.result;
        if (data.errorMessage == "") {
          if (NowBankType == "deposit") {
            this.setState({
              recordsHistory: data.historyList[0]
                ? data.historyList
                : "暂无数据",
              records: data,
            });
          } else if (NowBankType == "Withdrawal") {
            this.setState({
              withdrawalHistory: data.historyList[0]
                ? data.historyList
                : "暂无数据",
              WithdrawalData: data,
              activeTabs: 1,
            });
          }
        } else {
          Toast.fail(data.errorMessage, 2);
        }
      })
      .catch((error) => {
        Toast.hide();
        console.log(error);
      });
  }

  onClickInfoTabs = (key) => {
    this.setState({
      activeTab: key,
    });
  };

  render() {
    const { activeTab } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#efeff4" }}>
        <View style={{ flex: 1 }}>
          <View style={styles.magTab}>
            <TouchableOpacity
              onPress={() => {
                this.onClickInfoTabs(1);
              }}
              style={[
                styles.magTabList,
                { borderBottomWidth: activeTab == 1 ? 2 : 0 },
              ]}
            >
              <Text style={{ color: "#fff" }}>交易 </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.onClickInfoTabs(2);
              }}
              style={[
                styles.magTabList,
                { borderBottomWidth: activeTab == 2 ? 2 : 0 },
              ]}
            >
              <Text style={{ color: "#fff" }}>个人</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.onClickInfoTabs(3);
              }}
              style={[
                styles.magTabList,
                { borderBottomWidth: activeTab == 3 ? 2 : 0 },
              ]}
            >
              <Text style={{ color: "#fff" }}>一般</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TransRecords);

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
  },
});
