import BettingCalendar from "../../../containers/BettingRecord/BettingCalendar";
import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import React from 'react';
import moment from 'moment';
import { categoryIcons } from "./data";
import LoadingBone from "../../../containers/Common/LoadingBone";

const { width, height } = Dimensions.get("window");
// import DateRange from '@/DateRange/';
const minDate = [new Date(new Date().getTime() - 7257600000), new Date(new Date().getTime() - 7257600000)];
const maxDate = [new Date(), new Date()];
/* 最近30天 */
let Last30days = new Date(moment(new Date()).subtract(1, 'months').format('YYYY/MM/DD HH:mm:ss'));
/* 今天 */
let Today = moment(new Date()).utcOffset(8).format('YYYY-MM-DD');

class PromotionsRebate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activetab: 0,
      dateRangeVisible: false,
      DateFrom: Today,
      DateTo: Today,
      active: true,
      isLogin: false,
      Rebatedata: '',
      filterRes: '',
      Loading: true,
      rebatepromotion: "",
      ActiveTime: false,
      showCategoryModal: false,
      selectedCategoryId: null, //选择的分类Id
      selectCategoryName: "", ////选择的分类名(英文)
      selectResourcesName: "", //选择的分类名(中文)
      showFilteredRes: false, //展示筛选后的优惠列表
      onRefresh: false
    };
  }

  componentWillMount() {
    if (!ApiPort.UserLogin) {
      //获取未登录反水
      // this.RebateList()
      Toasts.error('请先登陆');
      Actions.Login()
      return
    } else {
      this.setState({ isLogin: true })
      this.PromotionsRebate();
    }
  }

  RebateList = () => {
    // let query = `promoCategory=SPORT&promoSecondType=rebatepromotion&eventCategoryType=Euro2021&`;
    let query = `promoCategory=SPORT&promoSecondType=rebatepromotion&`;
    this.setState({
      Loading: true
    });
    fetchRequest(ApiPort.GetPromotions + query, 'GET')
      .then((res) => {
        console.log(res);
        if (res && res.length) {
          this.setState({
            rebatepromotion: res
          });
        }
        this.setState({
          Loading: false
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  PromotionsRebate(onRefresh) {
    const { DateFrom, DateTo } = this.state;
    this.setState({
      dateRangeVisible: false,
      Loading: true,
    });
    if (onRefresh) {
      this.setState({
        onRefresh: true
      });
    }
    // for test
    // let res = {
    //   "result": [
    //     {
    //       "rebateId": 0,
    //       "rebateName": "string",
    //       "totalBetAmount": 1000,
    //       "totalGivenAmount": 50,
    //       "categoryId": 0,
    //       "categoryName": "string",
    //       "fundInWalletCode": "string",
    //       "rebateGroupName": "string",
    //       "platform": "string",
    //       "applyDate": "2022-04-29T07:58:24.983Z",
    //       "promotionId": "string",
    //       "promotionTitle": "test",
    //       "pormotionCategory": "string"
    //     },
    //     {
    //       "rebateId": 0,
    //       "rebateName": "string",
    //       "totalBetAmount": 0,
    //       "totalGivenAmount": 0,
    //       "categoryId": 0,
    //       "categoryName": "string",
    //       "fundInWalletCode": "string",
    //       "rebateGroupName": "string",
    //       "platform": "string",
    //       "applyDate": "2022-04-29T07:58:24.983Z",
    //       "promotionId": "string",
    //       "promotionTitle": "123",
    //       "pormotionCategory": "string"
    //     },
    //     {
    //       "rebateId": 0,
    //       "rebateName": "string",
    //       "totalBetAmount": 0,
    //       "totalGivenAmount": 0,
    //       "categoryId": 0,
    //       "categoryName": "string",
    //       "fundInWalletCode": "string",
    //       "rebateGroupName": "string",
    //       "platform": "string",
    //       "applyDate": "2022-04-29T07:58:24.983Z",
    //       "promotionId": "string",
    //       "promotionTitle": "321",
    //       "pormotionCategory": "string"
    //     }
    //   ], "isSuccess": true
    // }
    // this.setState({
    //   Rebatedata: res.result,
    //   RebateTotal: res.result.length > 0 ? res.result.reduce((sum, e) => sum + Number(e.totalGivenAmount || 0), 0) : 0,
    //   Loading: false
    // });
    // return
    const now = new moment();
    const DateTo2 = now.utcOffset(8).format("HH:mm:ss");

    return fetch(`${CMS_Domain + ApiPort.CMS_Rebate}startDate=${DateFrom}T00:00:00&endDate=${DateTo}T${DateTo2}`, {
      method: "GET",
      headers: {
        token: CMS_token,
        Authorization: ApiPort.Token || "",
      },
    })
      .then((response) => (headerData = response.json()))
      .then((res) => {
        // res = {
        //   "result": [
        //     {
        //       "rebateId": 0,
        //       "rebateName": "string",
        //       "totalBetAmount": 0,
        //       "totalGivenAmount": 0,
        //       "categoryId": 0,
        //       "categoryName": "string",
        //       "fundInWalletCode": "string",
        //       "rebateGroupName": "string",
        //       "platform": "string",
        //       "applyDate": "2022-05-03T09:09:20.080Z",
        //       "promotionId": "string",
        //       "promotionTitle": "string",
        //       "promotionCategory": "string"
        //     },
        //     {
        //       "rebateId": 0,
        //       "rebateName": "string",
        //       "totalBetAmount": 0,
        //       "totalGivenAmount": 0,
        //       "categoryId": 0,
        //       "categoryName": "string",
        //       "fundInWalletCode": "string",
        //       "rebateGroupName": "string",
        //       "platform": "string",
        //       "applyDate": "2022-04-29T07:58:24.983Z",
        //       "promotionId": "string",
        //       "promotionTitle": "123",
        //       "pormotionCategory": "string"
        //     },
        //     {
        //       "rebateId": 0,
        //       "rebateName": "string",
        //       "totalBetAmount": 0,
        //       "totalGivenAmount": 0,
        //       "categoryId": 0,
        //       "categoryName": "string",
        //       "fundInWalletCode": "string",
        //       "rebateGroupName": "string",
        //       "platform": "string",
        //       "applyDate": "2022-04-29T07:58:24.983Z",
        //       "promotionId": "string",
        //       "promotionTitle": "321",
        //       "pormotionCategory": "string"
        //     }
        //   ], "isSuccess": true
        // }
        this.setState({
          Rebatedata: res.result,
          RebateTotal: res.result.length > 0 ? res.result.reduce((sum, e) => sum + Number(e.totalGivenAmount || 0), 0) : 0,
          Loading: false,
          onRefresh: false
        }, () => {
          if(this.props.fromPage === "sports"){
            this.rebateFilter('sports');
          }
        });
        localStorage.setItem('Rebatedata', JSON.stringify(res.result));
      })
      .catch((error) => {
        console.log(error);
        if (error.message) {
          this.setState({
            Rebatedata: [],
            RebateTotal: 0,
            Loading: false,
            onRefresh: false
          });
        }
      });
  }


  /**
   * @description: 获取优惠返水的数据
   */
  PromotionsRebate2 = () => {
    const { DateFrom, DateTo } = this.state;
    /* ---------------------开始时间------------------------ */
    let From = moment(DateFrom).format('YYYY-MM-DD HH:mm:ss');
    /* ---------------------结束时间------------------------ */
    let To = moment(DateTo).format('YYYY-MM-DD HH:mm:ss');
    // let query = `promoCategory=SPORT&promoSecondType=rebatepromotion&eventCategoryType=Euro2021&DateFrom=${From}&DateTo=${To}&`;
    let query = `promoCategory=SPORT&promoSecondType=rebatepromotion&DateFrom=${From}&DateTo=${To}&`;
    this.setState({
      dateRangeVisible: false,
      Loading: true
    });
    fetchRequest(ApiPort.GetPromotions + query, 'GET')
      .then((res) => {
        if (res && res.length) {
          this.setState({
            Rebatedata: res
          });
          localStorage.setItem('Rebatedata', JSON.stringify(res));
        }
        this.setState({
          Loading: false
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      this.setState({
        DateTo: date,
      });
    } else {
      this.setState({
        DateFrom: date,
      });
    }
  }

  DateSelectChange(beforeDate, nowDate) {
    console.log(beforeDate, nowDate)
    this.setState({ DateFrom: beforeDate, DateTo: nowDate }, () => {
      this.PromotionsRebate();
    });
  }

  submitFilter() {
    console.log('submitFilter')
    const { showCategoryModal, selectedCategoryId, selectCategoryName } =
      this.state;
    if (showCategoryModal && selectedCategoryId === null) {
      this.setState({ showCategoryModal: false, showFilteredRes: false });
      return;
    }
    if (selectedCategoryId == 0) {
      // 全部优惠分类
      this.setState({
        filterRes: ''
      });
      // if (!this.props.promotions) {
      //   this.props.getPromotions();
      // }
    } else {
      //   指定优惠分类
      console.log(showCategoryModal, selectedCategoryId, selectCategoryName)
      this.rebateFilter();
    }
    this.setState({
      showCategoryModal: false,
      showFilteredRes: true,
      showScrollTopIcon: false,
    });
  }

  rebateFilter = (forceType = "") => {
    const { showCategoryModal, selectedCategoryId, selectCategoryName } =
      this.state;
    let filterRes;

    if(forceType !== ""){
      filterRes = this.state.Rebatedata.filter(v => v.promotionCategory.toLocaleLowerCase() === forceType)
    } else {
      filterRes = this.state.Rebatedata.filter(v => v.promotionCategory.toLocaleLowerCase() === selectCategoryName.toLocaleLowerCase())
    }
    console.log(filterRes)
    this.setState({
      filterRes: filterRes
    });
  }


  onFilterBtnPress() {
    const { showCategoryModal, showFilteredRes } = this.state;
    this.setState({ showCategoryModal: !showCategoryModal }, () => {
      if (!showFilteredRes) {
        this.cancelSelect();
      }
    });
  }

  cancelSelect() {
    this.setState({
      selectedCategoryId: null,
      selectCategoryName: "",
      selectResourcesName: "",
      showFilteredRes: false,
      filterRes: ""
    });
  }

  selectCategory(category) {
    const { PromoCatID, PromoCatCode, resourcesName } = category;
    this.setState({
      selectedCategoryId: PromoCatID,
      selectCategoryName: PromoCatCode.toLocaleLowerCase(),
      selectResourcesName: resourcesName,
    });
    // this.categoryPiwik(PromoCatCode)
  }

  // 骨架屏
  loadingBone = () => {
    return (
      Array.from({ length: 2 }, (v) => v).map((v, i) => {
        return (
          <View key={i} style={{
            // flex: 1,
            height: 200,
            marginHorizontal: 15,
            paddingHorizontal: 15,
            borderRadius: 5,
            overflow: "hidden",
            backgroundColor: "#e0e0e0",
            marginBottom: 20
          }}>
            <LoadingBone />
          </View>
        )
      })
    )
  }

  onRefresh = (e) => {
    console.log('_contentViewScroll')
    this.PromotionsRebate(true);
  }

  render() {
    const {
      DateFrom,
      DateTo,
      Rebatedata,
      Loading,
      isLogin,
      rebatepromotion,
      RebateTotal,
      showCategoryModal,
      showScrollTopIcon,
      selectedCategoryId,
      selectResourcesName,
      showFilteredRes,
      filterRes,
    } = this.state;
    const { categories, from, fromPage } = this.props;
    const startDate = DateFrom ? DateFrom.toString() : '';
    const endDate = DateTo ? DateTo.toString() : '';
    console.log(this.state)
    console.log(this.props)
    const dataRes = filterRes ? filterRes : Rebatedata
    return !isLogin ? (<ScrollView style={{ flex: 1, paddingBottom: 25 }}>
      {rebatepromotion !== "" ? rebatepromotion.length !== 0 ? (
        rebatepromotion.map((data, index) => {
          return (
            <Touch
              style={styles.list}
              key={index}
              onPress={() => {

                Actions.PromotionsDetail({ Detail: data })
              }}
            >
              <Image style={{ width: width * 0.92, height: width * 0.92 * 0.38 }}
                source={{ uri: data.thumbnailMobileImage || '' }}
                defaultSource={require('../../../images/euroCup/bg2.jpg')} />
            </Touch>
          );
        })
      ) :
        (null) : this.loadingBone()
      }
    </ScrollView>) : (
      <View style={{ flex: 1, paddingBottom: 25 }}>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 15,
            paddingHorizontal: 15,
            paddingBottom: 15,
            paddingTop: 2,
            flexDirection: "row",
            backgroundColor: '#00A6FF',
            position: "relative",
            zIndex: 999999,
          }}
        >
          {fromPage !== "sports" ? (
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
                      source={require(".././../../images/icon/close.png")}
                      style={styles.cancelIcon}
                    />
                  </View>
                </Touch>
              ) : null}
            </View>
          ):<View />}

          {/*可搜尋90天內 最多30天*/}
          <BettingCalendar
            maxInterval={90}
            startDate={DateFrom}
            endDate={DateTo}
            maxRange={29}
            selectChange={(beforeDate, nowDate, key) => {
              this.DateSelectChange(beforeDate, nowDate, key);
            }}
          />
        </View>

        {/* 日期范围 */}
        {/* <DateRange
						dateRangeVisible={dateRangeVisible}
						onClose={(type) => {
							this.setState({ dateRangeVisible: false }, () => {
								if (type == '确认') {
									this.PromotionsRebate();
								}
							});
						}}
						onChange={(time) => {
							this.setState({
								DateFrom: time[0],
								DateTo: time[1],
								ActiveTime: true
							});
						}}
						value={[ DateFrom, DateTo ]}
						note={'搜索时间范围为30天内，并可搜索90天之内的返水记录。'}
					/> */}


        {dataRes != '' && !Loading ? (
          <View style={{
            backgroundColor: '#FFFFFF',
            justifyContent: "space-between",
            alignItems: 'center',
            flexDirection: "row",
            marginHorizontal: 15,
            paddingHorizontal: 15,
            height: 47,
            borderRadius: 10
          }}>
            <Text style={{ color: '#666', fontSize: 12, }}>
              总得返水
            </Text>
            <Text style={{ color: '#222', fontSize: 12, }}>
              ￥{RebateTotal}
            </Text>
          </View>
        ) : Loading ? (
          <View style={{
            marginHorizontal: 15,
            // paddingHorizontal: 15,
            height: 47,
            overflow: "hidden",
            borderRadius: 10,
            marginBottom: 15,
            backgroundColor: "#e0e0e0",
          }}>
            <LoadingBone />
          </View>
        ) : null}

        {dataRes != '' && !Loading ? (
          <ScrollView refreshControl={
            <RefreshControl refreshing={this.state.onRefresh} onRefresh={() => this.onRefresh()} />
          }>
            {dataRes.map((data, index) => {
              // const { rebatesSummary } = data.memberPromotionRebateViewData;
              let Nulldata = Rebatedata.length == 0;
              // let memberCategory = !Nulldata ? rebatesSummary[0].memberCategory : 'Normal';
              let totalTurnover = !Nulldata ? data.totalBetAmount : '-';
              let totalRebateAmount = !Nulldata ? '￥' + data.totalGivenAmount : '-';
              const getCategory = categories.find(v => v.PromoCatCode.toLocaleLowerCase() === data.promotionCategory.toLocaleLowerCase());
              return (
                <TouchableOpacity style={styles.Content} key={index}
                  onPress={() => {
                    PiwikEvent('Promo History', 'View', `RebateRecord_EUROPage`)
                    Actions.PromoRebateHistory({ categoryId: data.categoryId })
                  }}>
                  {/*<Image style={{ width: 80, height: 80 }} source={{ uri: data.thumbnailMobileImage || '' }} />*/}
                  <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {getCategory ? (
                        <Image style={{ width: 40, height: 40, marginRight: 20 }}
                          source={{ uri: getCategory.promoCatImageUrl }} />
                      ) : (
                        <View style={{ backgroundColor: '#e8e8e8', width: 40, height: 40, borderRadius: 8 }} />
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 14,
                          color: "#222",
                          fontWeight: 'bold',
                          marginBottom: 5
                        }}>{getCategory.resourcesName ? getCategory.resourcesName : ""}</Text>
                        <Text style={{ fontSize: 12, color: "#222" }}>会员等级: {data.rebateGroupName == 'Normal' ? '普通会员' : 'VIP会员'}</Text>
                      </View>
                      <Image style={{ width: 20, height: 20 }} source={require('../../../images/icon/rightGrey.png')} />
                    </View>
                  </View>
                  <View style={{ backgroundColor: '#F3F3F3', height: 1, width: '100%', marginVertical: 15 }} />
                  <View style={styles.ContentRight}>
                    <View>
                      <Text style={[styles.listTxt, { fontSize: 12, color: "#999" }]}>总达流水</Text>
                      <Text style={styles.listTxt}>{totalTurnover == '' ? '-' : totalTurnover}</Text>
                    </View>
                    <View>
                      <Text style={[styles.listTxt, { fontSize: 12, color: "#999" }]}>总得返水</Text>
                      <Text style={styles.listTxtRed}>{totalRebateAmount == '' ? '-' : totalRebateAmount}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

        ) : Loading ? (
          this.loadingBone()
        ) : (
          <View style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
            <Image style={{ width: 68, height: 68 }} source={require('../../../images/euroCup/nodata.png')} />
            <Text style={{ color: '#999999', lineHeight: 30, textAlign: 'center' }}>暂无记录</Text>
          </View>
        )}


        {/*<Modal transparent={true} animationType={'slide'} visible={this.state.dateRangeVisible} onRequestClose={() => {*/}
        {/*}}>*/}
        {/*  <View style={{ width, height, position: 'relative' }}>*/}
        {/*    <View style={{ flex: 1 }}>*/}
        {/*      <TouchableOpacity onPress={() => this.setState({ dateRangeVisible: false })}>*/}
        {/*        <View*/}
        {/*          style={{ position: 'absolute', width, height, top: 0, left: 0, backgroundColor: 'rgba(0,0,0,.5)' }}/>*/}
        {/*      </TouchableOpacity>*/}
        {/*    </View>*/}

        {/*    <View style={{ flex: 1.4, justifyContent: 'flex-end', paddingBottom: 35, backgroundColor: '#fff' }}>*/}
        {/*      <View style={{ width: width, backgroundColor: '#fff', marginTop: 15, }}>*/}
        {/*        <View style={styles.mass}>*/}
        {/*          <Text style={{ color: '#83630B', fontSize: 12 }}>搜索时间范围为30天内，并可搜索90天之内的返水记录。</Text>*/}
        {/*        </View>*/}
        {/*      </View>*/}
        {/*      <View style={{*/}
        {/*        paddingTop: 10,*/}
        {/*        flexDirection: 'row',*/}
        {/*        backgroundColor: '#fff',*/}
        {/*        alignItems: 'center',*/}
        {/*        justifyContent: 'center'*/}
        {/*      }}>*/}
        {/*        <View style={{ flex: 1, left: 18 }}>*/}
        {/*          <TouchableOpacity onPress={() => this.setState({ dateRangeVisible: false })}>*/}
        {/*            <Text style={{ color: '#00a6ff' }}>关闭</Text>*/}
        {/*          </TouchableOpacity>*/}
        {/*        </View>*/}

        {/*        <View style={{ flex: 1 }}><Text>选择日期</Text></View>*/}
        {/*        <View style={{ flex: 0.3 }}>*/}
        {/*          <TouchableOpacity onPress={() => {*/}
        {/*            this.PromotionsRebate();*/}
        {/*            this.setState({ ActiveTime: true })*/}
        {/*          }}>*/}
        {/*            <Text style={{ color: '#00a6ff' }}>确认</Text>*/}
        {/*          </TouchableOpacity>*/}
        {/*        </View>*/}
        {/*      </View>*/}

        {/*      <View style={{*/}
        {/*        paddingTop: 20,*/}
        {/*        flexDirection: 'row',*/}
        {/*        backgroundColor: '#fff',*/}
        {/*        alignItems: 'center',*/}
        {/*        justifyContent: 'center'*/}
        {/*      }}>*/}
        {/*        <View style={styles.textDateA}>*/}
        {/*          <Text style={{ color: '#00a6ff', flex: 0.9, paddingLeft: 10 }}>从</Text>*/}
        {/*          <Text style={{ color: '#00a6ff' }}>{moment(startDate).format('YYYY-MM-DD')} </Text>*/}
        {/*        </View>*/}

        {/*        <View style={{ width: 20 }}></View>*/}
        {/*        <View style={styles.textDateB}>*/}
        {/*          <Text style={{ color: '#000', flex: 0.9, paddingLeft: 10 }}>至</Text>*/}
        {/*          <Text style={{ color: '#000' }}>{moment(endDate || (new Date())).format('YYYY-MM-DD')} </Text>*/}
        {/*        </View>*/}

        {/*      </View>*/}

        {/*      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>*/}
        {/*        <CalendarPicker*/}
        {/*          startFromMonday={true}*/}
        {/*          allowRangeSelection={true}*/}
        {/*          minDate={moment(minDate[0]).format('YYYY-MM-DD')}*/}
        {/*          maxDate={moment(maxDate[0]).format('YYYY-MM-DD')}*/}
        {/*          weekdays={['一', '二', '三', '四', '五', '六', '日']}*/}
        {/*          months={['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二']}*/}
        {/*          previousTitle="<"*/}
        {/*          nextTitle=">"*/}
        {/*          selectedDayColor="#00a6ff"*/}
        {/*          selectedDayTextColor="#fff"*/}
        {/*          scaleFactor={375}*/}
        {/*          textStyle={{*/}
        {/*            fontFamily: 'Cochin',*/}
        {/*            color: '#000000',*/}
        {/*          }}*/}
        {/*          onDateChange={this.onDateChange}*/}
        {/*        />*/}


        {/*      </View>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*</Modal>*/}
        {/* 分类列表Mpdal */}
        {showCategoryModal ? (
          <View style={styles.dropdownBox}>
            <Text style={styles.dropdownText}>种类</Text>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Content: {
    width: width - 30,
    marginLeft: 15,
    borderRadius: 10,
    padding: 15,
    display: 'flex',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 15,
  },
  ContentRight: {
    // paddingLeft: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  listTxt: {
    // width: width * 0.3,
    color: '#000',
    fontSize: 14,
    lineHeight: 25,
    textAlign: 'center'
  },
  listTxtRed: {
    // width: width * 0.3,
    color: '#F92D2D',
    fontSize: 14,
    lineHeight: 25,
    textAlign: 'center'
  },
  list: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    marginTop: 12,
  },
  filterBox: {
    // width: width - 40,
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
    paddingHorizontal: 30,
    paddingVertical: 30,
    position: "absolute",
    top: 43,
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

})

export default PromotionsRebate;
