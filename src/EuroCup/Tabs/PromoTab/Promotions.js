import LoadingBone from "../../../containers/Common/LoadingBone";
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import React from "react";
import { categoryIcons } from "./data";
import { Toast } from "antd-mobile-rn";
import { TopIconComp } from "./Commom/TopIcom";
import * as Animatable from "react-native-animatable";
import moment from 'moment'

const { width, height } = Dimensions.get("window");

const AnimatableView = Animatable.View;
const sbData = {
  PromoCatCode: "Sports",
  PromoCatID: "89",
  parentId: "398",
  resourcesName: "体育"
}
class Promotions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCategoryModal: false,
      selectedCategoryId: null, //选择的分类Id
      selectCategoryName: this.props.fromPage === "sports"?sbData.PromoCatCode:"", ////选择的分类名(英文)
      selectResourcesName: this.props.fromPage === "sports"?sbData.resourcesName:"", //选择的分类名(中文)
      showFilteredRes: false, //展示筛选后的优惠列表
      showScrollTopIcon: false, //置顶icon
      isSubmitFilter: false, // 提交優惠分類
    };
  }
  
  componentDidMount() {
    // this.submitFilter()
    
    if(this.props.fromPage === "sports"){
      const { categories } = this.props;
      const getSBCategory = (Array.isArray(categories) && categories.length) ? categories.filter(v=> v.PromoCatCode.toLocaleLowerCase() === "sports"  && v.parentName.toLocaleLowerCase() === "general") : [];
      console.log('getSBCategory ',getSBCategory)
      if(getSBCategory.length > 0){
        this.selectCategory(getSBCategory[0], true)
      } else {
        this.selectCategory(sbData, true)
      }
    }
  }

  pressMore = (item) => {
    console.log(item);
    const { PromoCatID, PromoCatCode, resourcesName } = item;
    // this.pressMorePiwik(PromoCatCode)
    this.setState(
      {
        selectedCategoryId: PromoCatID,
        selectCategoryName: PromoCatCode.toLocaleLowerCase(),
        selectResourcesName: resourcesName,
      },
      () => {
        this.submitFilter();
      }
    );
  };

  getPromotionContent(promotionId = null, item) {
    PiwikEvent("Promo Click", "View", `${promotionId}_PromoPage`);
    console.log('getPromotionContent')
    console.log(item)
    Toast.loading("优惠加载中...", 10);
    const pid = promotionId ? `?id=${promotionId}` : "";
    fetch(`${CMS_Domain + ApiPort.CMS_Promotion}${pid}`, {
      method: "GET",
      headers: {
        token: CMS_token,
        Authorization: ApiPort.Token || "",
      },
    })
      .then((response) => (headerData = response.json()))
      .then((data) => {
        Toast.hide();
        this.setState({
          promotionContent: data,
        });
        Actions.PromotionsDetail({ Detail: data, history: item.history, fromPage: this.props.fromPage });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  triggerScrollTop = () => {
    if (this._scrollView_ref) {
      this._scrollView_ref.scrollTo({ x: 0, y: 0, animated: true });
      this.setState({ showScrollTopIcon: false });
      // this.props.navigation.setParams({
      //   HeaderTitle: timeLabel,
      //   HeaderTitleStyle: {
      //     flex: 1,
      //     color: "#fff",
      //     fontSize: 20,
      //     textAlign: "left",
      //   },
      // });
    }
  };

  submitFilter() {
    console.log('submitFilter')
    const { showCategoryModal, selectedCategoryId, selectCategoryName } =
      this.state;
    const { classifiedPromotions } = this.props;
    if (showCategoryModal && selectedCategoryId === null) {
      this.setState({ showCategoryModal: false, showFilteredRes: false });
      return;
    }
    if (selectedCategoryId == 0) {
      // 全部优惠分类
      if (!this.props.promotions) {
        this.props.getPromotions();
      }
      this.setState({
        showCategoryModal: false,
        showFilteredRes: false,
        showScrollTopIcon: false,
        isSubmitFilter: true,
      });
      return;
    } else {
      //   指定优惠分类
      this.props.setPromoData(classifiedPromotions[selectCategoryName]);
    }
    this.setState({
      showCategoryModal: false,
      showFilteredRes: true,
      showScrollTopIcon: false,
      isSubmitFilter: true,
    });
  }

  onFilterBtnPress() {
    //回到顶部
    // this.triggerScrollTop();
    const { showCategoryModal, showFilteredRes } = this.state;
    this.setState({ showCategoryModal: !showCategoryModal }, () => {
      if (!showFilteredRes) {
        this.cancelSelect();
      }
    });
  }

  selectCategory(category, doFilter = false) {
    console.log('category')
    console.log(category)
    const { PromoCatID, PromoCatCode, resourcesName } = category;
    console.log(PromoCatID, PromoCatCode, resourcesName, "test");
    this.setState({
      selectedCategoryId: PromoCatID,
      selectCategoryName: PromoCatCode.toLocaleLowerCase(),
      selectResourcesName: resourcesName,
    }, () => {
      if(doFilter){
        console.log('do submitFilter')
        this.submitFilter();
      }
    });
    // this.categoryPiwik(PromoCatCode)
  }

  cancelSelect() {
    this.setState({
      selectedCategoryId: null,
      selectCategoryName: "",
      selectResourcesName: "",
      showFilteredRes: false,
      isSubmitFilter: false,
    });
  }

  renderPromRow = ({ item, index, list = false }) => {
    return (
      <AnimatableView
        key={index}
        delay={400 * index}
        animation={index % 2 ? "fadeInDown" : "fadeInUp"}
        easing="ease-out-cubic"
      >
        <Touch
          key={index}
          onPress={() => {
            this.getPromotionContent(item.promoId, item);
          }}
        >
          <View
            style={list ? styles.promListItemItemView : styles.promItemItemView}
          >
            <Image
              resizeMode="stretch"
              source={{ uri: item.promoImage }}
              defaultSource={require("../../../images/loadIcon/loadinglight.jpg")}
              style={list ? styles.promListItemImg : styles.promItemImg}
            />

            <Text
              style={styles.promItemNameStyle}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {item.promoTitle}
            </Text>
            <View style={{ flexDirection: 'row', paddingHorizontal: 24, }}>
              <Image source={require(".././../../images/icon/time.png")}
                style={{ width: 12, height: 12, marginRight: 6 }} />
              <Text
                style={{
                  fontSize: 10,
                  color: "#999999",
                  // paddingHorizontal: 24,
                }}
                numberOfLines={1}
                ellipsizeMode={"tail"}
              >
                {moment(item.startDate).format('YYYY/MM/DD HH:mm')} - {moment(item.endDate).format('YYYY/MM/DD HH:mm')}
              </Text>
            </View>
          </View>
        </Touch>
      </AnimatableView>
    );
  };
  SubCateHeader = (item) => {
    return (
      <View style={styles.subCateHeader}>
        <View style={styles.subCateHeaderLeft}>
          {item.PromoCatCode === "All" ? (
            <Image
              source={categoryIcons["All"]}
              style={styles.subCateIcon}
            />
          ) : (
            <Image
              source={{ uri: item.promoCatImageUrl }}
              style={styles.subCateIcon}
            />
          )}
          <Text style={styles.subCateTitle}>{item.resourcesName ? item.resourcesName : ""}</Text>
        </View>

        <Touch
          onPress={() => {
            this.pressMore(item);
          }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#666666" }}>更多</Text>
          <Image
            source={require(".././../../images/icon/darkGreyRight.png")}
            style={{ width: 16, height: 16 }}
          />
        </Touch>
      </View>
    );
  };

  // 当用户停止拖动页面时调用此函数。
  onRootScrollEndDrag(event) {
    //
    // console.log(event.nativeEvent);
    // console.log(this._scrollView_Height);

    if (event.nativeEvent.contentOffset.y > 100) {
      this.setState({ showScrollTopIcon: true });
      // this.props.navigation.setParams({
      //   HeaderTitle: "优惠",
      //   HeaderTitleStyle: {
      //     flex: 1,
      //     color: "#fff",
      //     fontSize: 20,
      //     left: Platform.OS == "ios" ? 10 : 25,
      //     alignSelf: "center",
      //     textAlign: "center",
      //   },
      // });
    } else {
      this.setState({ showScrollTopIcon: false });
      // this.props.navigation.setParams({
      //   HeaderTitle: timeLabel,
      //   HeaderTitleStyle: {
      //     flex: 1,
      //     color: "#fff",
      //     fontSize: 20,
      //     textAlign: "left",
      //   },
      // });
    }
  }

  onRefresh = (e) => {
    console.log('_contentViewScroll')
    this.props.initialization(true)
  }

  // 骨架屏
  PromoLoadingBone = () => {
    return Array.from({ length: 2 }, (v) => v).map((v, i1) => {
      return (
        <View key={i1} style={styles.subCateBox}>
          <View style={{
            flex: 1,
            height: 30,
            alignItems: "flex-start",
            justifyContent: "flex-start",
            marginTop: i1 !== 0 ? 15 : 0,
            marginHorizontal: 10,
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "#e0e0e0",
          }}>
            <LoadingBone />
          </View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginRight: 20 }}
          >
            {Array.from({ length: 4 }, (v) => v).map((v2, i2) => {
              return (
                <View style={[styles.promListItemItemView, { backgroundColor: "#e0e0e0" }]} key={i2}>
                  <LoadingBone />
                </View>
              );
            })}
          </ScrollView>
        </View>
      )
    })
  }

  // 骨架屏
  PromoLoadingBone2 = () => {
    return (
      <View style={{justifyContent: "center", alignItems: "center", marginTop: 20}}>
        {Array.from({ length: 2 }, (v) => v).map((v2, i2) => {
          return (
            <View style={[styles.promItemItemView, { backgroundColor: "#e0e0e0" }]} key={i2}>
              <LoadingBone/>
            </View>
          );
        })}
      </View>
    )
  }

  render() {
    const {
      showCategoryModal,
      showScrollTopIcon,
      selectedCategoryId,
      selectResourcesName,
      showFilteredRes,
      isSubmitFilter,
      selectCategoryName
    } = this.state;
    const { categories, classifiedPromotions, promotions, onRefresh } =
      this.props;
    console.log('this.props')
    console.log(this.props)
    return (
      <View style={{ flex: 1 }}>
        {this.props.fromPage !== "sports" && (
          <View
            style={{
              backgroundColor: "#00A6FF",
              paddingBottom: 15,
              paddingLeft: 20,
              position: "relative",
              zIndex: 999999,
            }}
          >
            {/* 筛选栏 */}
            <View style={styles.filterBox}>
              <TouchableOpacity
                ref={(el) => (this._dropdown_ref = el)}
                style={styles.filterBtn}
                hitSlop={{ top: 10, bottom: 10, left: 30, right: 30 }}
                onPress={() => this.onFilterBtnPress()}
              >
                <View style={styles.filterBtnView}>
                  <Text style={styles.filterText}>筛选</Text>
                  <Image
                    source={require(".././../../images/icon/filter.png")}
                    style={styles.filterIcon}
                  />
                </View>
              </TouchableOpacity>

              {isSubmitFilter && selectResourcesName ? (
                <Touch
                  style={styles.selectedCategoryBtn}
                  onPress={() => this.cancelSelect()}
                >
                  <View style={styles.selectedCategoryBtnView}>
                    <Text style={styles.selectedCategoryNameText}>
                      {selectResourcesName}
                    </Text>
                    <Image
                      source={require(".././../../images/icon/close.png")}
                      style={styles.cancelIcon}
                    />
                  </View>
                </Touch>
              ) : null}
            </View>
          </View>
        )}
        <ScrollView
          ref={(el) => {
            this._scrollView_ref = el;
          }}
          // ref='_scrollView_ref'
          onContentSizeChange={() => {
            this._scrollView_ref.scrollTo({ x: 0, y: 0, animated: true });
          }}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
          onScrollEndDrag={(event) => {
            this.onRootScrollEndDrag(event);
          }}
          refreshControl={
            <RefreshControl refreshing={this.props.onRefresh} onRefresh={() => this.onRefresh()} />
          }
        >
          {!showFilteredRes && classifiedPromotions ? (
            <>
              {promotions === "" ? (
                this.PromoLoadingBone()
              ) : promotions.length > 0 ? (
                categories.length > 0 && classifiedPromotions && categories.map((item) => {
                  if (item.PromoCatID != 0 && item.resourcesName) {
                    // 全部分类 不需要展示
                    const PromoCatCode = item.PromoCatCode.toLocaleLowerCase();
                    const specifiedPromotions =
                      classifiedPromotions[PromoCatCode];
                    if (specifiedPromotions.length === 0) return;
                    return (
                      <View key={item.PromoCatID} style={styles.subCateBox}>
                        {specifiedPromotions ? this.SubCateHeader(item) : null}
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          style={{ marginRight: 20 }}
                        // onRefresh={this.onRefresh}
                        // refreshControl={
                        //   <RefreshControl refreshing={onRefresh} onRefresh={()=>this.onRefresh()} />
                        // }
                        // refreshControl={
                        //   <RefreshControl refreshing={this.props.onRefresh} onRefresh={() => this._contentViewScroll()}/>
                        // }
                        >
                          {specifiedPromotions
                            ? specifiedPromotions.map((promotion, index) => {
                              return this.renderPromRow({
                                item: promotion,
                                index: index,
                                list: true,
                              });
                            })
                            : null
                          }
                        </ScrollView>
                      </View>
                    );
                  }
                  return null;
                })
              ) : (
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                  <Image style={{ width: 68, height: 68, marginBottom: 7.5 }}
                    source={require('../../../images/euroCup/nodata.png')} />
                  <Text style={{ color: '#999999' }}>暂无数据</Text>
                </View>
              )}
            </>
          ) : null}
       
          {/* 筛选后的优惠 */}
          {showFilteredRes && (
            !promotions ? (
              this.PromoLoadingBone2()
            ): (
              <View
                style={{ flex: 1 }}
                onLayout={(event) => {
                  this.maskY = event.nativeEvent.layout.y;
                }}
                //   style={[ showCategoryModal?{ position: "absolute", top: -50 }:{}]}
              >
                <FlatList
                  showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                  showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                  automaticallyAdjustContentInsets={false}
                  numColumns={1} //每行显示2个
                  ref={(flatList) => (this._flatList = flatList)}
                  renderItem={this.renderPromRow}
                  enableEmptySections={true} //数据可以为空
                  onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                  //ListFooterComponent={this.renderFooter}//尾巴
                  keyExtractor={(item, index) => (item.key = index)}
                  //   onEndReached={this.LoreMore}
                  data={promotions}
                  extraData={promotions}
                  ListEmptyComponent={() => {
                    return (
                      <View style={{ marginTop: 200, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                          source={require(".././../../images/icon/promo.png")}
                          style={{ width: 64, height: 64 }}
                        />
                        <Text style={{ color: '#999999', marginTop: 16 }}>暂时没有任何优惠</Text>
                      </View>
                    )
                  }}
                />
              </View>
            )
          )}
        
        </ScrollView>

        {/* 分类列表Mpdal */}
        {showCategoryModal ? (
          <View style={styles.dropdownBox}>
            <Text style={styles.dropdownText}>优惠种类</Text>
            <View style={styles.categoriesBox}>
              {categories.map((item, i) => {
                if (!item.resourcesName) return;
                return (
                  <TouchableOpacity
                    style={styles.categoryBtn}
                    key={i}
                    onPress={() => {
                      this.selectCategory(item);
                    }}
                    hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                  >
                    <View>
                      <View
                        style={
                          item.PromoCatID == selectedCategoryId
                            ? styles.selectedCategoryIconView
                            : styles.categoryIconView
                        }
                      >
                        {item.PromoCatCode === "All" ? (
                          <Image
                            source={categoryIcons["All"]}
                            style={styles.categoryIconImg}
                          />
                        ) : (
                          <Image
                            source={{ uri: item.promoCatImageUrl }}
                            style={styles.categoryIconImg}
                          />
                        )}

                      </View>
                      <Text style={styles.categoryName}>
                        {item.resourcesName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Touch
              onPress={() => {
                this.submitFilter();
              }}
              style={styles.submitBtn}
              hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            >
              <Text style={styles.submitBtnText}>提交</Text>
            </Touch>
          </View>
        ) : null}
        {/* 置顶ICON */}
        {showScrollTopIcon ? (
          <TopIconComp triggerScrollTop={this.triggerScrollTop} />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper2: {
    width: width - 60,
    height: 0.498 * (width - 60),
    margin: 10,
    marginBottom: 0,
    overflow: "hidden",
    borderRadius: 6,
    alignSelf: "center",
  },
  subCateBox: {
    marginTop: 20,
  },
  subCateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  subCateHeaderLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subCateIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  subCateTitle: {
    color: "#1A1A1A",
    fontSize: 16,
  },
  promItemItemView: {
    width: 0.95 * width,
    height: 0.48 * width,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 15,
    marginLeft: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  promListItemItemView: {
    width: 0.865 * width,
    height: 0.48 * width,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 15,
    marginLeft: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  promItemImg: {
    width: 0.95 * width,
    height: 0.345 * width,
  },
  promListItemImg: {
    width: 0.865 * width,
    height: 0.345 * width,
  },
  promItemNameStyle: {
    color: "#1A1A1A",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 14,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 6,
    // minHeight:30,
  },
  filterBox: {
    width: width - 40,
    flexDirection: "row",
    // justifyContent: "space-between",
  },

  filterBtn: {
    width: 70,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 13,
  },
  filterBtnView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  filterIcon: {
    width: 16,
    height: 16,
  },
  filterText: {
    fontSize: 12,
    color: "#fff",
    marginRight: 2,
  },
  selectedCategoryBtn: {
    // width: 70,
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
    top: 43,
    zIndex: 9999
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
    width: 48,
    height: 48,
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
    width: 40,
    height: 40,
  },
  categoryName: {
    textAlign: "center",
    color: "#222222",
    fontSize: 12,
    marginVertical: 5,
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
  ndData: {
    // paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // height: height
  },
});

export default Promotions;
