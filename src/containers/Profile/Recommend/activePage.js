import React from "react";
import { View, StyleSheet, Text, Dimensions, Image } from "react-native";
import Touch from "react-native-touch-once";
const { width } = Dimensions.get("window");

export default class activePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: true,
      lists: [
        "被推荐人必须是第一次来本站注册并且游戏。",
        "被推荐人必须和您以不同的IP地址注册的, 有不同的住址。",
        "被推荐人必须是在您的推荐链接或推荐二维码下面进行注册成为会员的。",
        "被推荐人必须核实过有效电话和邮箱的真实性。",
        "仅正确填写有效电话号码的会员方有获奖资格。会员可在“更新个人资料”中对错误/无效的电话进行更新。",
        "任何非正常性投注套利行为，一旦发现将立即取消其参与本优惠的资格。",
        "此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址﹑电话号码﹑支付方式（相同借记卡/信用卡/银行账户号码）IP地址， 同一网络环境等将可以作为判定是否独立玩家的条件。",
        "活动截止日期由乐天堂官方进行通知。",
        "乐天堂享有活动最终解释权。 此活动必须遵守乐天堂标准条款",
      ],
      campaignRewardDetails: "",
      result: "",
    };
  }
  componentWillMount() {
    global.storage
      .load({
        key: "QueleaActiveCampaign",
        id: "QueleaActiveCampaign",
      })
      .then((data) => {
        this.setState({
          campaignRewardDetails: data.result.campaignRewardDetails,
          result: data.result,
        });
      });
  }

  render() {
    const { campaignRewardDetails } = this.state;
    return (
      <View style={{ paddingBottom: 80 }}>
        <Text style={[styles.titles, { paddingTop: 15 }]}>推荐奖金</Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 10 }}>
          <View
            style={[
              styles.prices,
              {
                backgroundColor: "#00A6FF",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              },
            ]}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                width: (width - 30) * 0.666,
                textAlign: "center",
              }}
            >
              被推荐人
            </Text>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                width: (width - 30) / 3,
                textAlign: "center",
              }}
            >
              推荐人
            </Text>
          </View>
          <View style={[styles.prices, { backgroundColor: "#fff" }]}>
            <Text
              style={{
                color: "#030303",
                width: width / 4,
                textAlign: "center",
              }}
            >
              存款金额
            </Text>
            <Text
              style={{
                color: "#030303",
                width: width / 4,
                textAlign: "center",
              }}
            >
              流水
            </Text>
            <Text
              style={{
                color: "#030303",
                width: width / 4,
                textAlign: "center",
              }}
            >
              可得彩金
            </Text>
          </View>
          {campaignRewardDetails != "" && (
            <View style={[styles.prices, { backgroundColor: "#F3F5F9" }]}>
              <Text
                style={{
                  color: "#030303",
                  width: width / 4,
                  textAlign: "center",
                }}
              >
                {campaignRewardDetails[0].depositAmount} 元
              </Text>
              <Text
                style={{
                  color: "#030303",
                  width: width / 4,
                  textAlign: "center",
                }}
              >
                {campaignRewardDetails[0].turnoverAmount}
              </Text>
              <Text
                style={{
                  color: "#00A6FF",
                  width: width / 4,
                  textAlign: "center",
                }}
              >
                {campaignRewardDetails[0].referralRewardAmount} 元
              </Text>
            </View>
          )}
          {campaignRewardDetails != "" && (
            <View
              style={[
                styles.prices,
                { borderBottomWidth: 0, backgroundColor: "#fff" },
              ]}
            >
              <Text
                style={{
                  color: "#030303",
                  width: width / 4,
                  textAlign: "center",
                }}
              >
                {campaignRewardDetails[1].depositAmount} 元
              </Text>
              <Text
                style={{
                  color: "#030303",
                  width: width / 4,
                  textAlign: "center",
                }}
              >
                {campaignRewardDetails[1].turnoverAmount}
              </Text>
              <Text
                style={{
                  color: "#00A6FF",
                  width: width / 4,
                  textAlign: "center",
                }}
              >
                {campaignRewardDetails[1].referralRewardAmount} 元
              </Text>
            </View>
          )}
        </View>
        <View style={{ padding: 15 }}>
          <Text
            style={{
              fontSize: 12,
              color: "#666666",
              paddingTop: 15,
              paddingBottom: 5,
              fontWeight: "bold",
            }}
          >
            范例：A 推荐 B
          </Text>
          <Text style={{ fontSize: 12, color: "#666666", lineHeight: 20 }}>
            B 完成注册，存款满 1000 元并达到 3000 元的流水，A 即能获得 38 元 +
            88 元，共 126 元的免费彩金。如果 B 存款 100 元以上 1000
            元以下，并达到 300 元流水，那会员 A 只能获得 38 元免费彩金。
          </Text>
        </View>
        <View style={{ padding: 15, paddingBottom: 30 }}>
          <Text
            style={{
              fontSize: 12,
              color: "#666666",
              paddingTop: 15,
              paddingBottom: 5,
              fontWeight: "bold",
            }}
          >
            备注：
          </Text>
          <View style={styles.pageList}>
            <Text style={styles.activePageList}>1.</Text>
            {campaignRewardDetails != "" && (
              <Text style={styles.activePageList}>
                需要被推荐人完成相应的存款和流水后推荐人才能获取彩金。（
                {campaignRewardDetails[0].referralRewardAmount} 彩金和
                {campaignRewardDetails[1].referralRewardAmount}{" "}
                彩金推荐人可以同时获得）
              </Text>
            )}
          </View>
          <View style={styles.pageList}>
            <Text style={styles.activePageList}>2.</Text>
            <Text style={styles.activePageList}>
              推荐人必须为在乐天堂活跃1个月以上且总存款达到1,000 元。
            </Text>
          </View>
          <View style={styles.pageList}>
            <Text style={styles.activePageList}>3.</Text>
            <Text style={styles.activePageList}>
              被推荐的新会员名额上限为10 人。
            </Text>
          </View>
        </View>
        <Text style={styles.titles}>常见问题</Text>
        <View style={{ padding: 15, paddingTop: 0 }}>
          <Text
            style={{
              color: "#222222",
              paddingBottom: 5,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            Q: 彩金是否可以申请其他优惠？
          </Text>
          <Text style={{ color: "#222", paddingBottom: 15, fontSize: 12 }}>
            A: 此优惠所派发的彩金是可以申请官网其他优惠。
          </Text>
          <Text
            style={{
              color: "#222222",
              paddingBottom: 5,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            Q: 所获得的彩金需要多少流水才可以提款？
          </Text>
          <Text style={{ color: "#222", paddingBottom: 15, fontSize: 12 }}>
            A: 此优惠所派发的彩金只需一倍流水即可提款。
          </Text>
          <Text
            style={{
              color: "#222222",
              paddingBottom: 5,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            Q: 无法验证手机号以及邮箱账号？
          </Text>
          <Text style={{ color: "#666666", paddingBottom: 15, fontSize: 12 }}>
            A:联系官网24小时{" "}
            <Text
              onPress={() => {
                LiveChatOpenGlobe();
              }}
              style={{ color: "#1C8EFF" }}
            >
              在线客服
            </Text>{" "}
            进行辅助验证。
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Touch
            onPress={() => {
              this.setState({ activePage: !this.state.activePage });
            }}
            style={styles.activePage}
          >
            <Text style={{ color: "#222", paddingRight: 5, fontSize: 12 }}>
              {this.state.activePage ? "隐藏" : "显示"}活动规则
            </Text>
             <Image
                        resizeMode="stretch"
                        source={require("../../../images/icon/icon-extand2.png")}
                        style={{ width: 16, height: 16, }}
                    /> 
          </Touch>
        </View>
        {this.state.activePage ? (
          <View style={{ padding: 15 }}>
            {this.state.lists.map((item, index) => {
              return (
                <View key={index} style={styles.pageList}>
                  <Text style={styles.activePageList}>{index + 1}.</Text>
                  <Text style={styles.activePageList}>{item}</Text>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titles: {
    paddingLeft: 15,
    color: "#222222",
    fontSize: 14,
    paddingBottom: 15,
    fontWeight: "bold",
  },
  prices: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F2",
    height: 45,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  activePage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 45,
    width: 160,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  activePageList: {
    fontSize: 12,
    color: "#666666",
    lineHeight: 17,
    paddingRight: 3,
    paddingBottom: 10,
  },
  pageList: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
  },
});
