import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Image,
} from "react-native";
import { Toast } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import ActivePage from "./activePage";
const { width } = Dimensions.get("window");

export default class Recommend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
    };
  }
  componentWillMount() {
    //取缓存
    global.storage
      .load({
        key: "QueleaActiveCampaign",
        id: "QueleaActiveCampaign",
      })
      .then((data) => {
        this.setState({ result: data.result });
      });
  }
  componentDidMount() {
    // this.getBanner();
  }

  componentWillUnmount() {}

  getBanner = () => {
    // USDT FAQ
    Toast.loading("请稍候...");
    fetch(`${CMS_Domain + ApiPort.CMS_ReferBanner}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
        // return res && res.length && this.setState({ FaqData: res });
      })
      .catch((error) => {
        Toast.hide();
        console.log(error);
      });
  };

  //下一步,加入，或者查看进度
  goDetail() {
    if (ApiPort.UserLogin == false) {
      Toast.fail("请先登入", 2, () => {
        Actions.Login();
      });
      return;
    }
    Actions.RecommendPage({ QueleaReferrerInfo: "" });
  }
  render() {
    const { result } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Image
              resizeMode="stretch"
              source={require("../../../images/user/referFriend.png")}
              style={{ width: width, height: 120 }}
            />
          </View>
          <View style={{ padding: 15 }}>
            <Text style={styles.titles}>推荐好友三步骤</Text>
            <View style={styles.pageList}>
              <Text style={styles.num}>1</Text>
              <View>
                <Text style={styles.pageapian}>点击“立即加入”按钮 </Text>
                <Text style={styles.pageapian1}>
                  满足指定条件，生成推荐链接。
                </Text>
              </View>
            </View>
            <View style={styles.pageList}>
              <Text style={styles.num}>2</Text>
              <View>
                <Text style={styles.pageapian}>分享推荐链接或二维码</Text>
                <Text style={styles.pageapian1}>
                  被推荐的好友须透过链接注册并进行游戏。
                </Text>
              </View>
            </View>
            <View style={styles.pageList}>
              <Text style={styles.num}>3</Text>
              <View>
                <Text style={styles.pageapian}>查看进度及获得彩金</Text>
                <Text style={styles.pageapian1}>
                  可随时前往“推荐好友”页面查看好友们的注册、充值、流水进度。
                </Text>
              </View>
            </View>
            <Text
              style={{
                textAlign: "center",
                lineHeight: 35,
                fontSize: 13,
                color: "#999999",
              }}
            >
              活动开始时间：
              {(result != "" &&
                result.startDate.split("T")[0].replace(/\-/g, "/")) ||
                "2020/01/01"}
            </Text>
            <ActivePage />
          </View>
        </ScrollView>
        <View style={styles.depositButtonWrap}>
          <Touch
            onPress={() => {
              this.goDetail();
            }}
            style={styles.depositButton}
          >
            <Text style={[styles.buttonText, { color: "#fff", fontSize: 16 }]}>
              立即加入
            </Text>
          </Touch>
        </View>
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
  pageList: {
    height: 100,
    width: width - 30,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 35,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  num: {
    color: "#00A6FF",
    fontSize: 50,
    fontWeight: "bold",
    paddingRight: 30,
  },
  pageapian: {
    color: "#222222",
    paddingBottom: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  pageapian1: {
    color: "#666666",
    lineHeight: 20,
    fontSize: 12,
    width: width * 0.65,
  },
  depositButtonWrap: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,.9)",
    width: width,
    height: 76,
    padding: 10,
    bottom: 0,
    flex: 1,
    alignItems: "center",
  },
  depositButton: {
    backgroundColor: "#00A6FF",
    width: width * 0.9,
    height: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 40,
    fontWeight: "bold",
  },
});
