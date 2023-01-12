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
  WebView,
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

const locatData = require("./locatData.json");
import HTMLView from "react-native-htmlview";
import { GetDateStr } from "../lib/utils/date";
import LivechatDragHoliday from "./LivechatDragHoliday"; //可拖動懸浮
import { connect } from "react-redux";
import moment from "moment";
import BettingCalendar from "../containers/BettingRecord/BettingCalendar"

const { width, height } = Dimensions.get("window");

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bankDEtails: this.props.detail,
      TotalAmountThreshold: 0, // 金額
      TotalCountThreshold: 0, // 次數
      LatestWithdrawalUpdateDate: '', // 最近更新日期
      beforeDate: GetDateStr(-13), // 默認14天
      nowDate: GetDateStr(0), // 默認當天
      WithdrawalThresholdLimitCount: '', // 提現限制次數
      WithdrawalThresholdLimitAmount: '', // 提現限額
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    Toast.loading("加载中,请稍候...", 200);
    let processed = [
      this.GetWithdrawalThresholdLimit(),
      this.getWithdrawalThresholdHistory(false)
    ];
    Promise.all(processed)
      .then((res) => {
        console.log(res);
      })
      .finally(() => {
        Toast.hide();
      });
  };

  GetWithdrawalThresholdLimit = () => { // 獲取提現限額與限制次數
    return fetchRequest(ApiPort.GetWithdrawalThresholdLimit, 'GET')
      .then((data) => {
        const res = data.result;
        if (res != undefined) {
          this.setState({
            WithdrawalThresholdLimitCount: res.withdrawalThresholdLimitCount,
            WithdrawalThresholdLimitAmount: res.withdrawalThresholdLimitAmount,
          })
        }
      })
      .catch((error) => console.log(error))
  }

  getWithdrawalThresholdHistory(loading = true) { // 獲取特定銀行卡提現紀錄
    const { beforeDate, nowDate, bankDEtails } = this.state
    loading && Toast.loading('请稍候')
    return fetchRequest(ApiPort.GetWithdrawalThresholdHistory + `startDate=${beforeDate}T00:00:00&endDate=${nowDate}T23:59:59&`, 'GET')
      .then((data) => {
        loading && Toast.hide()
        const res = data.result;
        if (res != undefined) {
          const filterData = res.filter(item => {
            if (item.bankAccountNum == bankDEtails.accountNumber) return item
          })
          const newDate = filterData && filterData[0] && filterData[0].latestWithdrawalUpdateDate.replace(/\//gi, '-')
          this.setState({
            TotalAmountThreshold: filterData && filterData[0] && filterData[0].totalAmountThreshold || 0,
            TotalCountThreshold: filterData && filterData[0] && filterData[0].totalCountThreshold || 0,
            LatestWithdrawalUpdateDate: newDate || ''
          })
        }
      })
      .catch((error) => console.log(error))
  }

  DateSelectChange(beforeDate, nowDate) {
    this.setState({ beforeDate, nowDate }, () => {
      this.getWithdrawalThresholdHistory();
    });
  }

  render() {
    const { detail } = this.props;
    const {
      LatestWithdrawalUpdateDate,
      WithdrawalThresholdLimitCount,
      WithdrawalThresholdLimitAmount,
      beforeDate, nowDate,
      TotalAmountThreshold,
      TotalCountThreshold
      
    } = this.state;
    console.log(this.state)
    return (
      <View style={{ flex: 1, backgroundColor: "#EFEFF4" }}>
        <View
          style={{
            marginHorizontal: 10,
            marginTop: 15,
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ width: 100, color: "#999999" }}>银行名称</Text>
              <Text style={{ width: width - 160, color: "#000" }}>
                {detail.bankName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ width: 100, color: "#999999" }}>银行账号</Text>
              <Text style={{ width: width - 160, color: "#000" }}>
                *************
                {detail.accountNumber && detail.accountNumber.slice(-3)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ width: 100, color: "#999999" }}>省/自治区</Text>
              <Text style={{ width: width - 160, color: "#000" }}>
                {detail.province}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ width: 100, color: "#999999" }}>城市/城镇</Text>
              <Text style={{ width: width - 160, color: "#000" }}>
                {detail.city}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 0,
              }}
            >
              <Text style={{ width: 100, color: "#999999" }}>分行</Text>
              <Text style={{ width: width - 160, color: "#000" }}>
                {detail.branch}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 10,
            marginTop: 15,
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 19 }}>提款记录</Text>
          <Text style={{ color: '#999', fontSize: 12, marginBottom: 5 }}>可查询一年之内14日间数据记录。</Text>
          <Text style={{
            color: '#999',
            fontSize: 12,
            marginBottom: 13
          }}>最近更新时间：{LatestWithdrawalUpdateDate || "暂无更新"}</Text>
          <BettingCalendar type={"bankCard"}
                           maxInterval={365}
                           startDate={beforeDate}
                           endDate={nowDate}
                           maxRange={14}
                           selectChange={(beforeDate, nowDate, key) => {
                             this.DateSelectChange(beforeDate, nowDate, key)
                           }}/>
          <View style={{ height: 1, backgroundColor: "#E3E3E8", width: '100%', marginVertical: 16 }}/>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ flex: 1, color: '#999999', fontSize: 12 }}>通过审核的提款总次数</Text>
            <Text style={{ flex: 1, fontSize: 12, color: '#323232' }}>{TotalCountThreshold}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            <Text style={{ flex: 1, color: '#999999', fontSize: 12 }}>通过审核的提款总额</Text>
            <Text style={{ flex: 1, fontSize: 12, color: '#323232' }}>{TotalAmountThreshold}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: "#E3E3E8", width: '100%', marginVertical: 16 }}/>
          <View style={{ backgroundColor: '#FFF5BF', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#83630B', fontSize: 12, lineHeight: 20 }}>
              当您使用同一账户提款 {WithdrawalThresholdLimitCount} 次或达到提款 {WithdrawalThresholdLimitAmount} 总额时, 为了您银行账户安全起见,
              建议您更换或添加新的银行账户进行提款。
            </Text>
          </View>
        </View>

      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
  userSetting: state.userSetting,
});

export default connect(mapStateToProps)(News);

const styles = StyleSheet.create({});
