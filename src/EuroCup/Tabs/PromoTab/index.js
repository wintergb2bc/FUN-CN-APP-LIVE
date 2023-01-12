import moment from "moment";
import { Dimensions, Image, StyleSheet, Text, View, } from "react-native";
import Touch from "react-native-touch-once";
import React from "react";
import { connect } from "react-redux";
/* --------优惠列表--------*/
import Promotions from "./Promotions";
/* ----------返水----------*/
import PromotionsRebate from "./PromotionsRebate";
// /* --------每日好礼--------*/
// import PromotionsEverydayGift from "./PromotionsEverydayGift";
// /* --------我的优惠--------*/
import PromotionsMy from "./PromotionsMy";
import { Actions } from "react-native-router-flux";
import CsCallIcon from '@/containers/csCall/CsCallIcon'

const { width } = Dimensions.get("window");

let Last30days = moment().subtract(90, 'day').format('YYYY-MM-DD');
/* 今天 */
let Today = moment(new Date()).format('YYYY-MM-DD');

// 置顶ICON
const TopIconComp = (props) => (
  <Touch
    style={styles.topIconView}
    onPress={() => props.triggerScrollTop()}
    onPressIn={() => props.triggerScrollTop()}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Image
      style={styles.topIconImg}
      source={require("../../../images/icon/btnUp.png")}
    />
  </Touch>
);

class PromoTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activetab: 0,
      PromotionsData: "",
      MyPromotionsData: "",
      FreePromotionsData: "",
      rebateData: "",
      generalCategories: [],
      rebateCategories: [],
      classifiedPromotions: {}, //分类后的全部优惠
      promotionContent: null,
      showCategoryModal: false,
      selectedCategoryId: null, //选择的分类Id
      selectCategoryName: "", ////选择的分类名(英文)
      selectResourcesName: "", //选择的分类名(中文)
      showFilteredRes: false, //展示筛选后的优惠列表
      isloginGuide: false,
      fromPage: this.props.navigation.state.routeName === "promotionSB"? "sports" : ""
    };
  }

  // componentDidMount() {
  //   /*------------------ 获取本地优惠，加快访问速度 ----------------- */
  //   // let PromotionsData = JSON.parse(localStorage.getItem("PromotionsData"));
  //   // if (PromotionsData) {
  //   //   this.setState({
  //   //     PromotionsData: PromotionsData,
  //   //   });
  //   // }
  //   this.getCategory();
  // }

  componentDidMount() {
    // tab1
    this.initialization();
    if (ApiPort.UserLogin) {
      // tab2
      this.initTab2();
    }

  }

  // 初始頁面加載
  initialization(onRefresh) {
    console.log('initialization')
    if (onRefresh) {
      this.setState({
        onRefresh: true
      });
    }
    // Toast.loading("加载中,请稍候...");
    Promise.all([this.getCategory(), this.getPromotions()]).then(
      async (data) => {

        // 整理分類數據
        await this.setCategory(data[0]);
        // 整理優惠數據
        await this.sortPromotions(data[1]);

        this.setState({
          onRefresh: false
        });
        // Toast.hide();
      },
      (e) => {
        console.log("error " + e);
      }
    );
  }

  initTab2 = () => {
    this.getMyPromotions();
    this.getFreePromotions();
  }

  /**
   * @description: 獲取CMS優惠分類
   * @return {*} 優惠分類
   */
  getCategory() {
    return global.storage
      .load({
        key: "PromotionCategory",
        id: "PromotionCategory",
      })
      .then((res) => {
        // console.log('res', res)
        if (res.length) {
          return Promise.resolve(res);
        }
      })
      .catch(() => {
        return fetch(CMS_Domain + ApiPort.CMS_PromotionCategory, {
          method: "GET",
          headers: {
            token: CMS_token,
          },
        })
          .then((response) => (headerData = response.json()))
          .then((data) => {
            global.storage.save({
              key: "PromotionCategory",
              id: "PromotionCategory",
              data: data,
            });
            return Promise.resolve(data);
          })
          .catch((error) => {
            console.log(error);
            return Promise.reject();
          });
      });

  }

  setCategory(data) {
    if (data.length === 0) {
      return Promise.reject("array is empty");
    }

    const all = {
      PromoCatID: 0,
      PromoCatCode: "All",
      languageCode: "zh-hans",
      resourcesName: "全部",
    };
    let categories = data;
    let classifiedPromotions = {};
    let generalCategories = categories.filter(v => v.parentName === "General");
    let rebateCategories = categories.filter(v => v.parentName === "Rebate");
    generalCategories.unshift(all);
    rebateCategories.unshift(all);
    //先按api排序好
    data.forEach((item) => {
      classifiedPromotions[item.PromoCatCode.toLocaleLowerCase()] = new Array();
    });
    console.log('categories')
    this.setState({ classifiedPromotions, generalCategories, rebateCategories }, () => {
      return Promise.resolve();
    });
  }

  /**
   * @description: 获取优惠数据
   * @return {*} 优惠列表
   */
  getPromotions() {
    let reqHeader = {
      token: CMS_token
    };

    if (ApiPort.UserLogin) {
      reqHeader.Authorization = ApiPort.Token;
    }
    return fetch(`${CMS_Domain + ApiPort.CMS_Promotions}type=general`, {
      method: "GET",
      headers: reqHeader,
    })
      .then((response) => (headerData = response.json()))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getMyPromotions() {
    console.log("MyPromotionsData");
    // moment(item.startDate).format('YYYY/MM/DD HH:mm')
    const now = new moment();
    const DateTo2 = now.format("HH:mm:ss");
    const endDate = moment().utcOffset(8).format('YYYY-MM-DDTHH:mm:ss')
    const lastThreeMonth = moment().subtract(3, 'month').add(1, 'day').format("YYYY-MM-DD");
    return fetch(`${CMS_Domain + ApiPort.CMS_PromotionsHistory}startDate=${lastThreeMonth}T00:00:00&endDate=${endDate}`, {
      method: "GET",
      headers: {
        token: CMS_token,
        Authorization: ApiPort.Token || "",
      },
    })
      .then((response) => (headerData = response.json()))
      .then((res) => {
        // 用isArray確定是不是陣列，因無資料時後端data會傳不同型別（真雷），導致渲染錯誤
        this.setState({
          MyPromotionsData: Array.isArray(res.data) ? res.data : []
        })
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          MyPromotionsData: []
        })
      });
  }

  getFreePromotions() {
    return fetch(`${CMS_Domain + ApiPort.CMS_Promotions}type=free`, {
      method: "GET",
      headers: {
        token: CMS_token,
        Authorization: ApiPort.Token || "",
      },
    })
      .then((response) => (headerData = response.json()))
      .then((res) => {
        this.setState({
          FreePromotionsData: Array.isArray(res.data) ? res.data : []
        })
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          FreePromotionsData: []
        })
      });
  }

  //分类整理所有优惠数据
  sortPromotions(data) {
    if (!data) {
      return Promise.reject("error in sortPromotions");
    }
    const { classifiedPromotions } = this.state;
    console.log(classifiedPromotions)
    data.forEach((v) => {
      for (var prop in classifiedPromotions) {
        const fromPage = this.state.fromPage ? "sports" : prop.toLocaleLowerCase();
        if (
          v.category.find(
            (b) => b.toLocaleLowerCase() === fromPage
          )
        ) {
          classifiedPromotions[prop].push(v);
        }
      }
    });
    const getSB = classifiedPromotions['sports'];

    this.setState(
      {
        PromotionsData: this.state.fromPage === "sports" ? getSB ? getSB : [] : data,
        classifiedPromotions, //整理后的数据
      },
      () => {
        // 當優惠頁刷新重新請求數據時，若已有篩選，則整理篩選後的數據
        console.log('selectCategoryName ', this.state.selectCategoryName)
        // if (this.state.selectCategoryName != "") {
        //   this.submitFilter();
        // }
        return Promise.resolve();
      }
    );
    if (this.state.selectedCategoryId == null) {
      // 页面初始化的时候,把全部优惠数据存到PromotionsData
      this.PromotionsData = data;
    }
  }

  piwikClick(key) {
    if (key == 0) PiwikEvent("Promo Nav", "View​", "Promo_EUROPage");
    if (key == 1) PiwikEvent("Promo History​​", "View​", "MyPromo_EUROPage");
    if (key == 2) PiwikEvent("Promo Nav", "View​", "Rebate_EUROPage");
    if (key == 3) PiwikEvent("Promo Nav", "View​", "DailyDeal");
  }

  pressMore = (item) => {
    const { PromoCatID, PromoCatCode, resourcesName } = item;
    // this.pressMorePiwik(PromoCatCode)
    this.setState(
      {
        selectedCategoryId: PromoCatID,
        selectCategoryName: PromoCatCode.toLocaleLowerCase(),
        selectResourcesName: resourcesName,
      },
      () => {
        // this.submitFilter();
      }
    );
  };

  setPromoData = (data) => {
    this.setState({ PromotionsData: data });
  };

  render() {
    const {
      activetab,
      generalCategories,
      rebateCategories,
      FreePromotionsData,
      selectedCategoryId,
      selectResourcesName,
      PromotionsData,
      classifiedPromotions,
      MyPromotionsData,
    } = this.state;
    console.log(this.state)
    // console.log(this.state)
    // control switch to promo tabs should be request
    // window.requestPromoData = () => {
    //   this.getCategory();
    // };

    window.PromotionsMyType = () => {
      this.setState({ activetab: 1 });
      this.getMyPromotions();
    };

    return (
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.promoHeader,
            { paddingBottom: activetab === 1 ? 0 : 19 },
          ]}
        >
          {/* {['优惠', '我的优惠', '返水', '每日好礼'].map((name, index) => { */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={styles.tabsView}>
              {["优惠", "我的优惠", "返水"].map((name, index) => {
                return (
                  <Touch
                    style={{ marginRight: 20 }}
                    key={index}
                    onPress={() => {
                      if (ApiPort.UserLogin) {
                        this.setState({
                          activetab: index,
                        });
                        this.piwikClick(index);
                      } else {
                        Toasts.error('请先登陆');
                        Actions.Login()
                        return;
                      }
                      // this.Promotions();
                    }}
                  >
                    <Text
                      style={
                        activetab == index ? styles.activeTabTxt : styles.tabTxt
                      }
                    >
                      {name}
                    </Text>
                  </Touch>
                );
              })}
            </View>
            <View style={{ flexDirection: 'row' }}>
              {this.props.csCall.isVip && <CsCallIcon />}
              <Touch
                onPress={() => {
                  LiveChatOpenGlobe();
                }}
                style={{ width: 30, height: 25 }}
              >
                <View>
                  <Image
                    source={require(".././../../images/cs.png")}
                    style={{ width: 28, height: 28 }}
                  />
                </View>
              </Touch>
            </View>
          </View>
          {this.state.fromPage === "sports" && (
            <View
              style={{
                position: "absolute",
                zIndex: -1,
                top: -width * 0.25,
                left: 0,
              }}
            >
              <Image
                resizeMethod="resize"
                resizeMode="contain"
                style={{
                  width: width,
                  height: width * 0.9,
                }}
                source={require("../../../images/home/headerBG3New.png")}
              />
            </View>
          )}
        </View>
        {/* ------------------优惠----------------- */}
        {activetab == 0 && (
          <Promotions
            categories={generalCategories}
            classifiedPromotions={classifiedPromotions}
            promotions={PromotionsData}
            pressMore={this.pressMore}
            getPromotions={() => this.getPromotions()}
            setPromoData={(v) => this.setPromoData(v)}
            onRefresh={this.state.onRefresh}
            initialization={(onRefresh) => this.initialization(onRefresh)}
            fromPage={this.state.fromPage}
          />
        )}
        {/* ----------------我的优惠-------------- */}
        {activetab == 1 && (
          <PromotionsMy
            PromotionsData={MyPromotionsData}
            FreePromotionsData={FreePromotionsData}
            categories={generalCategories}
            onRefresh={this.state.onRefresh}
            initialization={(onRefresh) => this.initTab2(onRefresh)}
            fromPage={this.state.fromPage}
            Promotions={() => {
              this.getMyPromotions();
            }}
            getFreePromotions={() => {
              this.getFreePromotions()
            }}
          />
        )}
        {/* ----------------返水--------------------*/}
        {activetab == 2 && (
          <PromotionsRebate
            categories={rebateCategories}
            fromPage={this.state.fromPage}
          // classifiedPromotions={this.state.rebateData}
          />
        )}
        {/* -----------------每日好礼-------------- */}
        {/* {activetab == 3 && <PromotionsEverydayGift />} */}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  csCall: state.csCall,
});

export default connect(mapStateToProps)(PromoTab);

const styles = StyleSheet.create({
  tabTxt: {
    fontSize: 14,
    color: "#FFFFFFCC",
  },
  activeTabTxt: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  promoHeader: {
    backgroundColor: "#00A6FF",
    paddingHorizontal: 20,
    position: "relative",
    // zIndex: 99999,
    paddingTop: 10,
  },
  tabsView: {
    alignItems: "center",
    flexDirection: "row",
    // paddingBottom: 19,
  },
  topIconView: {
    position: "absolute",
    right: 10,
    bottom: 30,
    width: 44,
    height: 44,
  },
  topIconImg: {
    width: 44,
    height: 44,
  },
});

