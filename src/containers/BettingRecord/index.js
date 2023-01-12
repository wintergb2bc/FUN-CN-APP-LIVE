import React from "react";
import { Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Touch from "react-native-touch-once";
import { Toast } from "antd-mobile-rn";
import { GetDateStr } from "../../lib/utils/date";
import { getMoneyFormat } from "../Common/CommonFnData";
import RecordItem from "./RecordItem";
import BettingCalendar from "./BettingCalendar";
import { connect } from "react-redux";
import actions from "../../lib/redux/actions/index";
import LoadingBone from "../../containers/Common/LoadingBone";
import { Actions } from "react-native-router-flux";
import { walletName } from "../../lib/data/game";
import CsCallIcon from '@/containers/csCall/CsCallIcon'

const { width } = Dimensions.get("window");

const catArray = [
  {
    localizedName: "全部",
    productType: "All"
  },
  {
    productType: "Sportsbook",
    localizedName: "体育"
  },
  {
    productType: "Esports",
    localizedName: "电竞"
  },
  {
    productType: "InstantGames",
    localizedName: "小游戏",
  },
  {
    productType: "LiveDealer",
    localizedName: "真人"
  },
  {
    productType: "P2P",
    localizedName: "棋牌"
  },
  {
    productType: "Slot",
    localizedName: "老虎机"
  },
  {
    productType: "Fishing",
    localizedName: "捕鱼"
  },
  {
    productType: "Keno",
    localizedName: "彩票"
  },
];

const WalletList = {
  All: {
    imgUrl: require("../../images/promotion/icon-all.png"),
  },
  Sportsbook: {
    imgUrl: require("../../images/promotion/icon-soccer.png"),
  },
  Esports: {
    imgUrl: require("../../images/promotion/icon-esport.png"),
  },
  InstantGames: {
    imgUrl: require("../../images/promotion/icon-instantGames.png"),
  },
  LiveDealer: {
    imgUrl: require("../../images/promotion/icon-spade.png"),
  },
  Slot: {
    imgUrl: require("../../images/promotion/icon-slot.png"),
  },
  Fishing: {
    imgUrl: require("../../images/promotion/icon-fishing.png"),
  },
  P2P: {
    imgUrl: require("../../images/promotion/icon-dice.png"),
  },
  Keno: {
    imgUrl: require("../../images/promotion/icon-lottery.png"),
  },
};


class BettingRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minDate: GetDateStr(-90), //当前日期之前90天
      nowDate: GetDateStr(0),
      beforeDate: GetDateStr(0),
      TransData: "",
      productCode: this.props.productCode,
      tipVisible: false, // 提示框
      productCategories: catArray,
      showCategoryModal: false,
      selectCategoryName: "", ///选择的分类名(英文)
      selectResourcesName: "", //选择的分类名(中文)
    };

    this.closeTip = this.closeTip.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({
      title: this.props.Title,
    });
    this.GetPaymentFirst();
    this.getDailyTurnoverProductTypes()
  }

  getDailyTurnoverProductTypes() {
    fetchRequest(`${ApiPort.DailyTurnoverProductTypes}`, "GET")
      .then((res) => {
        console.log('res', res)

        if (res.isSuccess && res.result) {

          const result = [...res.result]
          result.map((item, index) => {
            if (item.localizedName == "全部") {
              item.productType = 'All'
            }
          })
          // console.log('result', result)
          this.setState({
            productCategories: result,
          })
        }
      })
      .catch(er => { console.log('er', er) })
  }

  GetPaymentFirst(loading = false) {
    const { selectCategoryName, beforeDate, nowDate } = this.state;
    let providerCode = selectCategoryName === "All" ? "" : selectCategoryName;
    loading && Toast.loading("加载中,请稍候...", 200);
    fetchRequest(
      `${ApiPort.MemberDailyTurnoverByProductType}?dateFrom=${beforeDate}&dateTo=${nowDate}&productType=${providerCode}&`,
      "GET"
    )
      .then((data) => {
        loading && Toast.hide();
        if (data && data.result) {
          let res = data.result;

          // 做深拷貝，防改到原始數據
          const copyData = JSON.parse(JSON.stringify(res.dailyTurnoverDetails));
          // 合併的數據
          let margeData = [];

          if (copyData.length > 0) {
            margeData = this.margeData(copyData);
          }
          this.setState({
            totalTurnover: res.totalValidTurnover || 0,
            totalWinLoss: res.totalWinLoss || 0,
            totalBetAmount: res.totalBetAmount || 0,
            originData: res.dailyTurnoverDetails,
            TransData: margeData,
          });
        }
      })
      .catch((error) => {
        Toast.hide();
        this.setState({
          TransData: "",
        });
        console.log(error);
      });
  }

  // 合併一樣的productType providerCode
  margeData = (data) => {
    return data.reduce((acc, cur) => {
      let obj = acc.find(e => (e.providerCode === cur.providerCode) && (e.productType === cur.productType));
      if (obj) {
        obj.betAmount += cur.betAmount;
        obj.winLoss += cur.winLoss;
      } else {
        acc.push(cur);
      }
      return acc;
    }, []);
  }

  DateSelectChange(beforeDate, nowDate) {
    console.log(beforeDate, nowDate);
    this.setState({ beforeDate, nowDate }, () => {
      this.GetPaymentFirst(true);
    });
  }

  closeTip() {
    this.setState({ tipVisible: false });
    storage.save({
      key: "BetRecordTip",
      id: "BetRecordTip",
      data: false,
      expires: null,
    });
  }

  cancelSelect() {
    this.setState({
      selectCategoryName: "",
      selectResourcesName: "",
    }, () => {
      this.submitFilter();
    });
  }

  TransferAClick(item) {
    console.log(item);
    const key = item.productType;
    const name = item.localizedName;
    this.setState({
      selectCategoryName: key,
      selectResourcesName: name,
    });
  }

  submitFilter = () => {
    this.setState({ showCategoryModal: false });
    this.GetPaymentFirst(true);
    this.setState({
      showCategoryModal: false,
    });
  };

  onFilterBtnPress() {
    //回到顶部
    // this.triggerScrollTop();
    const { showCategoryModal } = this.state;
    this.setState({ showCategoryModal: !showCategoryModal });
  }

  getGameIcon = (productType) => {
    console.log('productType ', productType);
    return WalletList[productType]?.imgUrl;
  }

  // 骨架屏
  freePromoLoadingBone = () => {
    return Array.from({ length: 2 }, (v) => v).map((v, i) => {
      return (
        <View key={i} style={{
          // flex: 1,
          height: 200,
          alignItems: "flex-start",
          justifyContent: "flex-start",
          marginHorizontal: 10,
          borderRadius: 5,
          overflow: "hidden",
          backgroundColor: "#e0e0e0",
          marginBottom: 20
        }}>
          <LoadingBone />
        </View>
      );
    });
  }

  goBettingRecordDetail = (providerCode, productType) => {
    const { originData } = this.state;
    const filterData = originData.filter(v => (v.providerCode === providerCode) && (v.productType === productType));
    console.log(filterData);
    Actions.BettingRecordDetail({
      data: filterData,
      Title: walletName[providerCode],
    });
  }

  displayBettingrecordTip = (param) => {
    this.setState({ tipVisible: param })
  }

  render() {
    const {
      TransData,
      tipVisible,
      productCategories,
      showCategoryModal,
      selectResourcesName,
      selectCategoryName,
      totalBetAmount,
      totalWinLoss,
      totalTurnover,
      beforeDate,
      nowDate
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.wrapperNav}>
          <View style={styles.headerWrap}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
                  投注记录
                </Text>
                {/* <BettingrecordTip displayBettingrecordTip={(val) => this.displayBettingrecordTip(val)} /> */}
              </View>
              {/* User 要求移除這個Tooltip (請隱藏這個icon ) 於投注紀錄頁面 (待未來通知後再加回) */}
              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ tipVisible: true });
                  }}
                >
                  <Image
                    resizeMode="stretch"
                    source={require("../../images/icon/info.png")}
                    style={{ width: 16, height: 18, marginLeft: 8 }}
                  />
                </TouchableOpacity>
              </View>

            </View>
            <View style={{ flexDirection: 'row', paddingTop: 5 }}>
              {this.props.csCall.isVip && <CsCallIcon />}
              <Touch
                style={{}}
                onPress={() => {
                  LiveChatOpenGlobe();
                  PiwikEvent("LiveChat", "Launch", "LoginPage");
                }}
              >
                <Image
                  resizeMode="stretch"
                  source={require("../../images/cs.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Touch>
            </View>
          </View>

          {/* 筛选栏 */}
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 19,
              marginBottom: 15,
              paddingHorizontal: 15,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                ref={(el) => (this._dropdown_ref = el)}
                style={styles.selectBtn}
                onPress={() => this.onFilterBtnPress()}
              >
                <Text style={styles.filterText}>筛选</Text>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/icon/filter.png")}
                  style={{ width: 16, height: 16 }}
                />
              </TouchableOpacity>
              {selectResourcesName ? (
                <Touch
                  style={styles.selectedCategoryBtn}
                  onPress={() => this.cancelSelect()}
                >
                  <View style={styles.selectedCategoryBtnView}>
                    <Text style={styles.selectedCategoryNameText}>
                      {selectResourcesName}
                    </Text>
                    <Image
                      source={require("../../images/icon/close.png")}
                      style={styles.cancelIcon}
                    />
                  </View>
                </Touch>
              ) : null}
            </View>
            <BettingCalendar
              maxInterval={90}
              startDate={beforeDate}
              endDate={nowDate}
              selectChange={(beforeDate, nowDate, key) => {
                this.DateSelectChange(beforeDate, nowDate, key);
              }}
            />
          </View>
        </View>

        {
          // 提示
          tipVisible && (
            <View style={styles.tipStyle}>
              <View
                style={{
                  backgroundColor: "#000000CC",
                  width: 0.97 * width,
                  borderRadius: 10,
                  position: "relative",
                }}
              >
                <View
                  style={{
                    paddingVertical: 12,
                    paddingLeft: 12,
                    paddingRight: 27,
                  }}
                >
                  <Text style={styles.tipText}>
                    [总投注金额] 为您在乐天堂所有游戏平台的下注总额。
                  </Text>
                  <Text style={styles.tipText}>
                    [总输/赢] 为您在乐天堂所有游戏平台的输赢总额。
                  </Text>
                  <Text style={styles.tipText}>
                    例：输100+赢100则计算公式为 (-100+100)因此总输/赢值为0 。
                  </Text>
                  <Text style={styles.tipText}>
                    [总有效流水]为您在乐天堂所有游戏平台的有效流水总额。
                    体育、电竞、真人、棋牌、彩票等平台有效流水公式以输赢额度计算,另有效流水最高为投注金额的两倍。
                  </Text>
                  <Text style={styles.tipText}>
                    例一：投注额10元 输/赢8元 有效流水为8
                  </Text>
                  <Text style={styles.tipText}>
                    例二：投注额10元 输/赢38元 有效流水为20
                  </Text>
                  <Text style={styles.tipText}>
                    注：老虎机和捕鱼则以投注额度计算有效流水。
                  </Text>
                  <Text style={styles.tipText}>
                    注：取消的赛事以及任何违反投注规则如对压、倍投等将不计算在有效投注内。
                  </Text>
                </View>
                <Touch
                  onPress={() => this.closeTip()}
                  style={{
                    width: 44,
                    position: "absolute",
                    top: 12,
                    right: -15,
                  }}
                >
                  <Image
                    resizeMode="stretch"
                    source={require("../../images/icon/closeWhite.png")}
                    style={{ width: 16, height: 16 }}
                  />
                </Touch>
              </View>
              <View style={styles.tipArrow}></View>

            </View>
          )
        }

        {TransData.length > 0 ? (
          <ScrollView style={{ marginHorizontal: 15 }}>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 15,
                padding: 15,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 15,
              }}
            >
              <View style={styles.totalBoxWrap}>
                <Text style={styles.totalBoxText}>总投注金额</Text>
                <Text style={{ color: "#222222", fontSize: 14, fontWeight: "500" }}>
                  ¥ {getMoneyFormat(totalBetAmount)}
                </Text>
              </View>
              <View style={styles.totalBoxWrap}>
                <Text style={styles.totalBoxText}>总输/赢</Text>
                <Text
                  style={{
                    color: totalWinLoss > 0 ? "#F92D2D" : "#42D200",
                    fontSize: 14,
                    fontWeight: "500"
                  }}
                >
                  {totalWinLoss > 0 ? "+" : "-"}¥
                  {getMoneyFormat(
                    totalWinLoss && (totalWinLoss + "").replace("-", "")
                  )}
                </Text>
              </View>
              <View style={styles.totalBoxWrap}>
                <Text style={styles.totalBoxText}>总有效流水</Text>
                <Text style={{ color: "#222222", fontSize: 14, fontWeight: "500" }}>
                  {getMoneyFormat(totalTurnover)}
                </Text>
              </View>
            </View>
            {TransData.map((item, index) => (
              <RecordItem
                item={item}
                index={index}
                beforeDate={beforeDate}
                nowDate={nowDate}
                key={index}
                goDetail={(providerCode, productType) => this.goBettingRecordDetail(providerCode, productType)}
                getGameIcon={(item) => this.getGameIcon(item)}
              />
            ))}
          </ScrollView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {TransData === "" ? (
              <ScrollView
                style={{
                  width: '100%',
                  paddingTop: 15,
                  paddingBottom: 25,
                  paddingHorizontal: 16
                }}>
                {this.freePromoLoadingBone()}
              </ScrollView>
            ) : TransData.length === 0 ? (
              <>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/icon/noData.png")}
                  style={{ width: 98, height: 98, marginBottom: 16 }}
                />
                <Text
                  style={{
                    color: "#999999",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  暂无记录！
                </Text>
              </>
            ) : null}
          </View>
        )}

        {/* 分类列表Mpdal */}
        {showCategoryModal ? (
          <View style={styles.dropdownBox}>
            <Text style={styles.dropdownText}>种类</Text>
            <View style={styles.categoriesBox}>
              {productCategories.length > 0 &&
                productCategories.map((item, index) => {
                  const key = item.productType;
                  return (
                    <Touch
                      onPress={() => {
                        this.TransferAClick(item);
                      }}
                      key={index}
                      style={styles.categoryBtn}
                    >
                      <View
                        style={
                          selectCategoryName == key
                            ? styles.selectedCategoryIconView
                            : styles.categoryIconView
                        }
                      >
                        <Image
                          resizeMode="stretch"
                          source={WalletList[key]?.imgUrl}
                          style={styles.categoryIconImg}
                        />
                      </View>
                      <Text
                        style={{
                          color: "#666666",
                          paddingTop: 5,
                          fontSize: 12,
                        }}
                      >
                        {item.localizedName}
                      </Text>
                    </Touch>
                  );
                })}
            </View>

            <Touch
              onPress={() => this.submitFilter()}
              style={styles.submitBtn}
              hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            >
              <Text style={styles.submitBtnText}>提交</Text>
            </Touch>
          </View>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  game: state.game,
  csCall: state.csCall,
});
const mapDispatchToProps = (dispatch) => ({
  setGameTypes: (data) =>
    dispatch(actions.ACTION_GameType(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BettingRecord);

const styles = StyleSheet.create({
  wrapperNav: {
    width: width,
    backgroundColor: "#00A6FF",
    zIndex: 9999,
  },
  headerWrap: {
    display: "flex",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    zIndex: 9999,
  },
  tipStyle: {
    position: "absolute",
    top: 45,
    left: 5,
    zIndex: 99999,
  },
  tipArrow: {
    height: 0,
    width: 0,
    borderWidth: 7,
    borderStyle: "solid",
    borderBottomColor: "#000000CC",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
    position: "absolute",
    top: -13,
    left: 115,
  },
  tipText: {
    color: "#fff",
    fontSize: 11,
    lineHeight: 18,
  },
  filterText: {
    fontSize: 12,
    color: "#fff",
    marginRight: 2,
  },
  selectedCategoryBtn: {
    width: 70,
    backgroundColor: "rgba(255, 255, 255, .3)",
    borderRadius: 13.5,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },
  selectedCategoryBtnView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCategoryNameText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  cancelIcon: {
    width: 16,
    height: 16,
    marginLeft: 3,
  },
  dropdownBox: {
    width: width,
    backgroundColor: "#FFFFFF",
    opacity: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    position: "absolute",
    top: 101,
    left: 0,
  },
  dropdownText: {
    fontSize: 16,
    color: "#222222",
  },
  categoriesBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 20,
    width: "100%",
  },
  categoryBtn: {
    width: "25%",
    // width: 0.25*width,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  selectedCategoryIconView: {
    borderWidth: 2,
    borderColor: "#00A6FF",
    width: 56,
    height: 56,
    borderRadius: 14,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIconView: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIconImg: {
    width: 48,
    height: 48,
  },
  submitBtn: {
    width: 120,
    alignSelf: "center",
    justifyContent: "center",
    height: 44,
    backgroundColor: "#00A6FF",
    borderRadius: 8,
  },
  submitBtnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 70,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 13,
    height: 27,
  },
  totalBoxText: {
    color: "#666666",
    marginBottom: 8,
    fontSize: 14,
  },
  totalBoxWrap: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
});
