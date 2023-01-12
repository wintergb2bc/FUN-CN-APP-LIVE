import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { TopIconComp } from "../../../EuroCup/Tabs/PromoTab/Commom/TopIcom";

const { width, height } = Dimensions.get("window");


class WorldCupNewRule extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showScrollTopIcon: false, //置顶icon
    };
  }

  componentDidMount() {
  }

  triggerScrollTop = () => {
    if (this._scrollView_ref) {
      this._scrollView_ref.scrollTo({ x: 0, y: 0, animated: true });
      this.setState({ showScrollTopIcon: false });
    }
  };

  render() {
    const { showScrollTopIcon } = this.state;
    return (
      <View style={styles.myPrizesModal}>
        <ScrollView
          ref={(el) => {
            this._scrollView_ref = el;
          }}
          onScroll={(e) => {
            let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
            if(offsetY > 30 && !showScrollTopIcon) {
              this.setState({showScrollTopIcon: true})
            }
            if(offsetY < 30 && showScrollTopIcon) {
              this.setState({showScrollTopIcon: false})
            }
          }}
          style={{
          width: width - 26,
          backgroundColor: "#fff",
          marginVertical: 13,
          paddingHorizontal: 15,
          paddingTop: 35,
          paddingBottom: 5,
          borderRadius: 12,
          alignSelf: "center"
        }}>
          <Text style={styles.rulesTxt}>1. 此活动开放给所有乐天堂会员</Text>
          <Text style={styles.rulesTxt}>活动时间： 2022年11月21日 00:00 至2022年12月18日 23:59:59。 (北京时间）</Text>
          <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>2. 参加方式:</Text>
          <Text style={styles.rulesTxt}>- 游戏次数将以会员当天累计存款总额为标准，最低存款为300元，如下图：</Text>
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerTh}>存款等级(元)</Text>
              <Text style={styles.headerTHMin}>游戏次数</Text>
              <Text style={styles.headerTHMin}>累积次数</Text>
            </View>
            <View style={styles.tableBody}>
              <View style={{ width: "40%" }}>
                <View style={styles.tableTh}>
                  <Text style={styles.ruleTableDetailText}>300 - 999</Text>
                </View>
                <View style={styles.tableTh}>
                  <Text style={styles.ruleTableDetailText}>1,000 - 2,499</Text>
                </View>
                <View style={styles.tableTh}>
                  <Text style={styles.ruleTableDetailText}>2,500 - 4,999</Text>
                </View>
                <View style={styles.tableTh}>
                  <Text style={styles.ruleTableDetailText}>5,000 - 9,999</Text>
                </View>
                <View style={styles.tableTh}>
                  <Text style={styles.ruleTableDetailText}>10,000 以上</Text>
                </View>
              </View>
              <View style={{ width: "30%" }}>
                <View style={styles.tableThMin}>
                  <Text style={styles.ruleTableDetailText}>1</Text>
                </View>
                <View style={styles.tableThMin}>
                  <Text style={styles.ruleTableDetailText}>2</Text>
                </View>
                <View style={styles.tableThMin}>
                  <Text style={styles.ruleTableDetailText}>3</Text>
                </View>
                <View style={styles.tableThMin}>
                  <Text style={styles.ruleTableDetailText}>4</Text>
                </View>
                <View style={styles.tableThMin}>
                  <Text style={styles.ruleTableDetailText}>5</Text>
                </View>
              </View>
              <View style={[styles.tableThMin, { width: "30%", height: 125 }]}>
                <Text style={styles.ruleTableDetailText}>一天5次</Text>
              </View>

            </View>
          </View>
          <Text style={[styles.rulesTxt, { paddingTop: 15 }]}>例:</Text>
          <Text
            style={[styles.rulesTxt, { paddingBottom: 10 }]}>会员于11月21日完成第一笔300元存款，即可获取一次点球机会。会员其后再存款2,700元，当日总存款累积至3,000元，便可进行剩余的游戏次数。</Text>
          <Text style={styles.rulesTxt}>- 当日游戏次数最多为5次。</Text>
          <Text style={styles.rulesTxt}>- 会员点击 <Image style={{ width: 18, height: 18 }} resizeMode="stretch"
                                                          source={require('../../../images/worldCup/Button-Play.png')}/> 以开始游戏。</Text>
          <Text style={styles.rulesTxt}>- 未进行的游戏次数不会累计至次日。</Text>
          <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>3. 此活动将以乐币, 免费彩金与世界杯大礼包为奖品。</Text>
          <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>4. 派彩时间：</Text>
          <Text style={styles.rulesTxt}>免费彩金（主钱包）：得奖后30分钟内。</Text>
          <Text style={styles.rulesTxt}>乐币（天王俱乐部）：得奖后30分钟内。</Text>
          <Text style={styles.rulesTxt}>世界杯大礼包（礼品）：确认收货信息之后的30天内。</Text>
          <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>5. 乐币：</Text>
          <Text style={styles.rulesTxt}>乐币自动计入会员账号后，可在天王俱乐部查询。使用有效期为30天。</Text>
          <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>6. 免费彩金：</Text>
          <Text style={styles.rulesTxt}>彩金自动记入会员主钱包后，有效期为30天。1倍流水方可提款。</Text>
          <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>7. 世界杯大礼包（礼品）：</Text>
          <Text style={styles.rulesTxt}>- 礼品将随机派发，该礼品将不会透露直到会员收件。</Text>
          <Text style={styles.rulesTxt}>- 天使客服将在活动结束后7天之内联系中奖会员，索取收件信息。</Text>
          <Text style={styles.rulesTxt}>-
            若礼品已出库，因收件信息不完整，物流公司无法联系会员而被退回，乐天堂有权撤销该礼品。</Text>
          <Text style={styles.rulesTxt}>- 礼品不可兑换成现金、彩金、乐币、免费旋转。</Text>
          <Text style={[styles.rulesTxt, { paddingTop: 10, paddingBottom: 40 }]}>8. 须遵守乐天堂条款。</Text>
        </ScrollView>
        {/* 置顶ICON */}
        {showScrollTopIcon ? (
          <TopIconComp triggerScrollTop={this.triggerScrollTop}
                       icon={require("../../../images/worldCup/BackToTopCN.png")}
                       style={{ width: 51, height: 46 }}
                       propsWrap={{ right: 38, bottom: 48 }}
          />
        ) : null}
      </View>
    );
  }
}

export default WorldCupNewRule;


const styles = StyleSheet.create({
  myPrizesModal: {
    flex: 1,
    backgroundColor: '#012557',
  },
  headerTh: {
    width: "40%",
    lineHeight: 25,
    textAlign: 'center',
    fontSize: 11,
    color: '#fff',
  },
  headerTHMin: {
    width: "30%",
    lineHeight: 25,
    textAlign: 'center',
    fontSize: 11,
    color: '#fff',
  },
  tableTh: {
    width: "100%",
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#012557'
  },
  tableThMin: {
    width: "100%",
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#012557'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#012557',
    flexDirection: 'row',
    marginTop: 10,
  },
  tableBody: {
    width: "100%",
    borderWidth: 1,
    borderColor: '#012557',
    // display: 'flex',
    flexDirection: 'row',
  },
  rulesTxt: {
    fontSize: 13,
    color: '#012557',
    lineHeight: 20,
  },
  ruleTableDetailText: {
    color: '#012557',
    fontSize: 11
  }
});





