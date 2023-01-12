import { Toast } from "antd-mobile-rn";
import { ScrollView, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import CalendarPicker from 'react-native-calendar-picker';
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import LoadingBone from "../../../containers/Common/LoadingBone";

import React from 'react';
// import Router from 'next/router';
// import LazyLoad from 'react-image-lazy-load';
// import Countdown from 'react-countdown';
import moment from 'moment';
import BettingCalendar from "../../../containers/BettingRecord/BettingCalendar";
import HeaderBackIcon from "../../../containers/Common/HeaderBackIcon"
const { width, height } = Dimensions.get("window");

const minDate = [new Date(new Date().getTime() - 7257600000), new Date(new Date().getTime() - 7257600000)];
const maxDate = [new Date(), new Date()];
/* 最近30天 */
let Last30days = new Date(moment(new Date()).subtract(1, 'months').format('YYYY/MM/DD HH:mm:ss'));
/* 今天 */
// let Today = new Date();
let Today = moment(new Date()).utcOffset(8).format('YYYY-MM-DD');

class PromotionsEverydayGift extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activetab: 0,
      DailyDeals: '',
      Address: [],
    };
  }

  componentDidMount() {
    let DailyDealsPromotiondata = JSON.parse(localStorage.getItem('DailyDealsPromotiondata'));
    if (DailyDealsPromotiondata) {
      this.setState({
        DailyDeals: DailyDealsPromotiondata
      });
    }
    this.DailyDealsPromotion();
    if (ApiPort.UserLogin) {
      this.ShippingAddress();
    }
  }

  /**
   * @description: 每日好礼数据
   */

  DailyDealsPromotion = () => {
    let reqHeader = {
      token: CMS_token
    };

    if (ApiPort.UserLogin) {
      reqHeader.Authorization = ApiPort.Token;
    }
    // fetchRequest(ApiPort.DailyDealsPromotion + 'eventCategoryType=Euro2021&', 'GET')
    return fetch(`${CMS_Domain + ApiPort.CMS_Promotions}type=daily`, {
      method: "GET",
      headers: reqHeader,
    })
      .then((response) => (headerData = response.json()))
      .then((res) => {
        this.setState({
          DailyDeals: res.data
        });
        localStorage.setItem('DailyDealsPromotiondata', JSON.stringify(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * @description: 获取会员的收礼地址列表
   * @return {Array}
   */

  ShippingAddress = () => {
    fetchRequest(ApiPort.ShippingAddress, 'GET')
      .then((res) => {
        if (res && res.result) {
          this.setState({
            Address: res.result
          });
          localStorage.setItem('Address', JSON.stringify(res.result));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { activetab, DailyDeals, Address } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
        <View style={[styles.topNav]}>
          <HeaderBackIcon tintColor={"#fff"} onPress={() => {
            Actions.pop();
          }} />
          <View style={styles.btnType}>
            <Touch
              style={[
                styles.btnList,
                { backgroundColor: activetab == 0 ? "#fff" : "transparent" },
              ]}
              onPress={() => {
                this.setState({ activetab: 0 });
              }}
            >
              <Text
                style={[
                  styles.btnTxt,
                  { color: activetab == 0 ? "#00a6ff" : "#CCEDFF" },
                ]}
              >
                每日好礼
              </Text>
            </Touch>
            <Touch
              style={[
                styles.btnList,
                { backgroundColor: activetab == 1 ? "#fff" : "transparent" },
              ]}
              onPress={() => {
                this.setState({ activetab: 1 });
                PiwikEvent("Announcement", "View", "Vendor_Announcement");
              }}
            >
              <Text
                style={[
                  styles.btnTxt,
                  { color: activetab == 1 ? "#00a6ff" : "#CCEDFF" },
                ]}
              >
                记录
              </Text>
            </Touch>
          </View>
          <View style={{ width: 50, height: 70, opacity: 0 }} />
          <View />
          <View />
        </View>
        {activetab == 0 ? DailyDeals !== "" ? <ScrollView><EverydayGift DailyDeals={DailyDeals} /></ScrollView> : (
          <View style={{ marginTop: 16, }}>
            {[...Array(3)].map((i, k) => {
              return <View style={styles.loding} key={k}>
                <LoadingBone />
              </View>;
            })}
          </View>
        ) : null}
        {activetab == 1 && <ScrollView><EverydayGiftHistory Address={Address} /></ScrollView>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topNav: {
    width: width,
    height: Platform.OS === "ios" ? 44 : 50,
    backgroundColor: "#00a6ff",
    display: "flex",
    justifyContent: 'space-between',
    alignItems: "center",
    flexDirection: "row",
  },
  btnType: {
    backgroundColor: "#7676801F",
    borderRadius: 50,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  btnList: {
    width: 110,
    backgroundColor: "#00A6FF",
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btnTxt: {
    textAlign: "center",
    lineHeight: 32,
  },
  Menu: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: width,
    paddingTop: 15,
    paddingBottom: 15,
  },
  activetab: {
    width: width * 0.4,
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: '#00A6FF',
  },
  tab: {
    width: width * 0.4,
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  Giftlist: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    overflow: "hidden"
  },
  giftState: {
    backgroundColor: '#33C85D',
    padding: 5,
    borderRadius: 5,
    width: 60,
    height: 40,
    alignSelf: "center",
    justifyContent: "center"
  },
  giftStateNull: {
    backgroundColor: '#CACACA',
    padding: 5,
    borderRadius: 5,
    width: 52,
    height: 25,
    alignSelf: "center"
  },
  giftStateNull2: {
    backgroundColor: '#CACACA',
    padding: 5,
    borderRadius: 5,
    width: 60,
    height: 25,
    alignSelf: "center"
  },
  loding: {
    width: width * 0.92,
    height: width * 0.92 * 0.38,
    marginHorizontal: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    marginBottom: 20
  },
  lodingView: {
    width: width * 0.92,
    height: width * 0.92 * 0.38,
    backgroundColor: '#00000033',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDate: {
    borderWidth: 1,
    borderColor: '#00A6FF',
    borderRadius: 50,
    padding: 7,
    width: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 15,
  },
  Historylist: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
    width: width - 30,
    marginLeft: 15,
  },
  title: {
    fontSize: 12,
    color: '#999999',
    width: 60,
    lineHeight: 25,
  },
  count: {
    width: width * 0.3,
    fontSize: 12,
    color: '#000',
  },
  list: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mass: {
    backgroundColor: '#FFF5BF',
    width: width - 30,
    borderRadius: 10,
    padding: 10,
    marginLeft: 15,
    marginTop: 15,
  },
})

export default PromotionsEverydayGift;


export class Countdown extends React.Component {
  state = {
    countdownTime: '0 小时0 分钟',
  };

  componentDidMount() {

    this.setTime()
    setInterval(() => {
      this.setTime()
    }, 1000 * 60);
  }

  setTime() {
    let endTime = new Date(this.props.dateTo), //结束时间
      fromTime = new Date(); //開始時間
    let lefttime = endTime.getTime() - fromTime.getTime(), //距离结束时间的毫秒数
      leftd = Math.floor(lefttime / (1000 * 24 * 60 * 60)), //计算小时数
      lefth = Math.floor(lefttime / (1000 * 60 * 60) % 24), //计算小时数
      leftm = Math.floor(lefttime / (1000 * 60) % 60), //计算分钟数
      lefts = Math.floor(lefttime / 1000 % 60); //计算秒数
    let countdownTime = ""
    if (leftd >= 1) {
      countdownTime = `${leftd}天${lefth}小时${leftm}分钟`
    } else {
      countdownTime = `${lefth}小时${leftm}分钟`
    }
    this.setState({ countdownTime })
  }

  render() {
    return (
      <View>
        <Text style={{ color: '#999', fontSize: 12, paddingLeft: 10, }}>{this.state.countdownTime}</Text>
      </View>
    )
  }
}

/* --------------每日好礼列表------------------ */
export class EverydayGift extends React.Component {
  state = {};

  componentWillUnmount() {
    this.setState = () => false;
  }

  getStatus = (data) => {
    if (!data.bonusData) {
      return "noData"
    }
    if (data.bonusData.maxApplications === data.bonusData.currentApplications) {
      return "SoldOut"
    } else {
      return "Available"
    }
  }

  getPromotionContent(promotionId = null) {
    PiwikEvent("Promo Click", "View", `${promotionId}_PromoPage`);
    console.log('getPromotionContent 123')
    console.log(this.props.DailyDeals)
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
        // this.props.promotions.filter(v=>)
        // item.history = {
        //   "bonusRuleId": 0,
        //   "playerBonusId": 0,
        //   "bonusName": "string",
        //   "bonusCategory": "string",
        //   "isClaimable": true,
        //   "status": "Waiting for release",
        //   "progress": "string",
        //   "expiredDate": "2022-04-29T09:20:03.412Z",
        //   "percentage": 50,
        //   "bonusAmount": 200,
        //   "turnoverNeeded": 10,
        //   "wallet": "string",
        //   "reference": "string",
        //   "appliedDate": "2022-04-29T09:20:03.412Z",
        //   "releaseType": "string",
        //   "bonusGivenType": "string"
        // }

        Actions.PromotionsRebateDetail({ ids: promotionId, data: this.props.DailyDeals, content: data })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { DailyDeals } = this.props;
    console.log('this.props')
    console.log(this.props)
    return DailyDeals.length !== 0 ? DailyDeals.map((data, index) => {
      const { promoTitle, promoImage, period, promoId, bonusData, startDate, endDate } = data;
      const status = this.getStatus(data);
      console.log('status ',status)
      // let time = period.split(' - ')[1];
      return (
        <Touch
          style={styles.Giftlist}
          key={index}
          onPress={() => {
            if (status == 'SoldOut') return;
            if (status == 'noData') return;
            this.getPromotionContent(promoId)
          }}
        >
          <View style={{ overflow: "hidden", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
            <Image style={{ width: width * 0.92, height: width * 0.92 * 0.38 }} source={{ uri: promoImage || '' }}
              defaultSource={require('../../../images/euroCup/bg2.jpg')} />
          </View>
          <View style={{
            width: width * 0.92,
            backgroundColor: '#fff',
            paddingVertical: 12,
            paddingLeft: 24,
            paddingRight: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8
          }}>
            {(status == 'Available' || status == 'Grabbed') &&
              <>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: "#333", lineHeight: 20, fontWeight: "bold", marginBottom: 5 }}>{promoTitle}</Text>
                  <View style={{
                    flexDirection: "row",
                    // justifyContent: "space-between"
                  }}>
                    <Image style={{ width: 15, height: 15 }} source={require('../../../images/euroCup/history.png')} />
                    <Countdown dateTo={endDate} dateFrom={startDate} />
                  </View>
                </View>
                <View style={styles.giftState}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 12,
                    textAlign: "center",
                  }}>仅剩{data.bonusData.maxApplications - data.bonusData.currentApplications}</Text>
                </View>
              </>
            }
            {status == 'SoldOut' && (
              <>
                <View>
                  <Text
                    style={{ color: "#333", lineHeight: 20, fontWeight: "bold", marginBottom: 5 }}>{promoTitle}</Text>
                  <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                    <Image style={{ width: 15, height: 15 }} source={require('../../../images/euroCup/history.png')} />
                    <Countdown dateTo={endDate} dateFrom={startDate} />
                  </View>
                </View>
                <View style={styles.giftStateNull}>
                  <Text style={{ color: '#888888', fontSize: 12, textAlign: "center" }}>
                    已售罄
                  </Text>
                </View>
              </>
            )}

            {status == 'noData' && (
              <>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: "#333", lineHeight: 20, fontWeight: "bold", marginBottom: 5 }}>{promoTitle}</Text>
                  <View style={{
                    flexDirection: "row",
                    // justifyContent: "space-between"
                  }}>
                    <Image style={{ width: 15, height: 15 }} source={require('../../../images/euroCup/history.png')} />
                    <Countdown dateTo={endDate} dateFrom={startDate} />
                  </View>
                </View>
                <View style={styles.giftState}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 12,
                    textAlign: "center",
                  }}>暂无数据</Text>
                </View>
              </>
            )}
          </View>
        </Touch>
      );
    }) : (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: 50
      }}>
        <Image style={{ width: 68, height: 68, marginBottom: 7.5 }}
          source={require('../../../images/euroCup/nodata.png')} />
        <Text style={{ color: '#999999' }}>暂无纪录!</Text>
      </View>
    );
  }
}

/* --------------每日好礼记录------------------ */
export class EverydayGiftHistory extends React.Component {
  state = {
    DateFrom: Today,
    DateTo: Today,
    GiftHistory: '',
    Loading: true,
    dateRangeVisible: false
  };

  componentDidMount() {
    if (localStorage.getItem('loginStatus') != 1) {
      Toasts.error('请先登陆');
      Actions.Login()
      return
    }
    this.DailyDealsPromotionHistory();
  }

  DailyDealsPromotionHistory = () => {
    const { DateFrom, DateTo } = this.state;
    this.setState({
      Loading: true,
      dateRangeVisible: false,
    });
    // fetchRequest(ApiPort.DailyDealsPromotion + 'eventCategoryType=Euro2021&', 'GET')
    const now = new moment();
    const DateTo2 = now.utcOffset(8).format("HH:mm:ss");
    return fetch(`${CMS_Domain + ApiPort.DailyDeals}startDate=${DateFrom}T00:00:00&endDate=${DateTo}T${DateTo2}`, {
      method: "GET",
      headers: {
        token: CMS_token,
        Authorization: ApiPort.Token || "",
      },
    })
      .then((response) => (headerData = response.json()))
      .then((res) => {
        if (res.isSuccess) {
          this.setState({
            GiftHistory: res.result
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


  /**
   * @description: 获取优惠返水的数据
   */
  DailyDealsHistory = () => {
    const { DateFrom, DateTo } = this.state;
    /* ---------------------开始时间------------------------ */
    let From = moment(DateFrom).format('YYYY-MM-DD HH:mm:ss');
    /* ---------------------结束时间------------------------ */
    let To = moment(DateTo).format('YYYY-MM-DD HH:mm:ss');
    // let query = `promoCategory=SPORT&promoSecondType=rebatepromotion&eventCategoryType=Euro2021&DateFrom=${From}&DateTo=${To}&`;
    let query = `promoCategory=SPORT&promoSecondType=rebatepromotion&DateFrom=${From}&DateTo=${To}&`;
    this.setState({
      Loading: true,
      dateRangeVisible: false,
    });
    fetchRequest(ApiPort.DailyDealsHistory + query, 'GET')
      .then((res) => {
        if (res) {
          this.setState({
            GiftHistory: res
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
      this.DailyDealsPromotionHistory();
    });
  }

  render() {
    const { Loading, DateFrom, DateTo, GiftHistory, dateRangeVisible } = this.state;
    const { Address } = this.props;
    console.log('GiftHistoryGiftHistory', GiftHistory)
    const startDate = DateFrom ? DateFrom.toString() : '';
    const endDate = DateTo ? DateTo.toString() : '';
    return (
      <View style={{ flex: 1 }}>
        <View style={{
          marginTop: 10,
          marginRight: 15,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}>
          <BettingCalendar
            type={"light"}
            maxInterval={90}
            startDate={DateFrom}
            endDate={DateTo}
            maxRange={29}
            selectChange={(beforeDate, nowDate, key) => {
              this.DateSelectChange(beforeDate, nowDate, key);
            }}
          />
        </View>
        {/* --------------日期范围----------- */}
        {/* <DateRange
					dateRangeVisible={dateRangeVisible}
					onClose={(type) => {
						this.setState({ dateRangeVisible: false }, () => {
							if (type == '确认') {
								this.DailyDealsHistory();
							}
						});
					}}
					onChange={(time) => {
						this.setState({
							DateFrom: time[0],
							DateTo: time[1]
						});
					}}
					value={[DateFrom, DateTo]}
					note={'搜索时间范围为30天内，并可搜索90天之内的好礼记录。'}
				/> */}
        {GiftHistory != '' ? (
          GiftHistory.length > 0 && GiftHistory.map((data, index) => {
            const {
              createdDate,
              bonusStatus,
              bonusDailyDealsDetail,
              bonusName,
              referenceOutId,
              remarks,
              memberShippingDetail,
              bonusGivenType
            } = data;
            console.log(data)
            let AddressCheck;
            if (remarks === '点击更多详情' && JSON.stringify(bonusDailyDealsDetail) != '{}') {
              const {
                address,
                city,
                contactNumber,
                district,
                email,
                firstName,
                houseNum,
                lastName,
                province,
                zipCode
              } = bonusDailyDealsDetail;
              AddressCheck = Address.find(
                (item) =>
                  item.address == address &&
                  item.city == city &&
                  item.contactNumber == contactNumber &&
                  item.district == district &&
                  item.email == email &&
                  item.firstName == firstName &&
                  item.houseNum == houseNum &&
                  item.lastName == lastName &&
                  item.province == province &&
                  item.zipCode == zipCode
              );
            }
            return (
              <View style={styles.Historylist} key={index}>
                <View style={styles.list}>
                  <Text style={styles.title}>交易日期</Text>
                  <Text style={styles.count}>{createdDate.split('T')[0]}</Text>

                  <Text style={styles.title}>商品</Text>
                  <Text style={styles.count}>{bonusName}</Text>
                </View>

                <View style={styles.list}>
                  <Text style={styles.title}>参考号</Text>
                  <Text style={styles.count}>{referenceOutId}</Text>

                  <Text style={styles.title}>状态</Text>
                  <Text style={styles.count}>{bonusStatus}</Text>
                </View>

                <View style={styles.list}>
                  <Text style={styles.title}>优惠好礼</Text>
                  <Text style={styles.count}>{bonusGivenType}</Text>

                  <Text style={styles.title}>备注</Text>
                  {bonusDailyDealsDetail && bonusDailyDealsDetail.remarks == '点击更多详情' ? (
                    <Touch
                      onPress={() => {
                        Actions.Newaddress({
                          id: '0',
                          types: 'readOnly',
                          addresskey: '0',
                          addressReadOnly: bonusDailyDealsDetail,
                          ShippingAddress: () => {
                            this.getAdress()
                          }
                        })
                        // if (AddressCheck) { }
                        // // Router.push(
                        // // 	{
                        // // 		pathname: `/promotions/[details]?type=${'readOnly'}&addresskey=${AddressCheck.id}`,
                        // // 		query: {
                        // // 			details: 'addressform',
                        // // 			type: 'edit',
                        // // 			addresskey: AddressCheck.id
                        // // 		}
                        // // 	},
                        // // 	`/promotions/addressform?type=${'readOnly'}&addresskey=${AddressCheck.id}`
                        // // );
                      }}
                    >
                      <Text style={{ color: '#00a6ff', fontSize: 12 }}>点击更多详情</Text>
                    </Touch>
                  ) : (
                    bonusDailyDealsDetail && <Text style={styles.count}>{bonusDailyDealsDetail.remarks}</Text>
                  )}
                </View>
              </View>
            );
          })
        ) : Loading ? (
          <View style={{ marginTop: 16, }}>
            {[...Array(3)].map((i, k) => {
              return <View style={styles.loding} key={k}>
                <LoadingBone />
              </View>;
            })}
          </View>
        ) : (
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            // flex: 1,
            height: height * .6,
            marginTop: 50
          }}>
            <Image style={{ width: 68, height: 68, marginBottom: 7.5 }}
              source={require('@/images/euroCup/nodata.png')} />
            <Text style={{ color: '#999999' }}>暂无纪录!</Text>
          </View>
        )}

        <Modal transparent={true} animationType={'slide'} visible={this.state.dateRangeVisible} onRequestClose={() => {
        }}>
          <View style={{ width, height, position: 'relative' }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => this.setState({ dateRangeVisible: false })}>
                <View
                  style={{ position: 'absolute', width, height, top: 0, left: 0, backgroundColor: 'rgba(0,0,0,.5)' }} />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1.5, justifyContent: 'flex-end', }}>
              <View style={{ width: width, backgroundColor: '#fff' }}>
                <View style={styles.mass}>
                  <Text style={{ color: '#83630B', fontSize: 12 }}>搜索时间范围为30天内，并可搜索90天之内的返水记录。</Text>
                </View>
              </View>

              <View style={{
                paddingTop: 10,
                flexDirection: 'row',
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center'
              }}>

                <View style={{ flex: 1, left: 18 }}>
                  <TouchableOpacity onPress={() => this.setState({ dateRangeVisible: false })}>
                    <Text style={{ color: '#00a6ff' }}>关闭</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}><Text>选择日期</Text></View>
                <View style={{ flex: 0.3 }}>
                  <TouchableOpacity onPress={() => this.DailyDealsHistory()}>
                    <Text style={{ color: '#00a6ff' }}>确认</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{
                paddingTop: 20,
                flexDirection: 'row',
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <View style={styles.textDateA}>
                  <Text style={{ color: '#00a6ff', flex: 0.9, paddingLeft: 10 }}>从</Text>
                  <Text style={{ color: '#00a6ff' }}>{moment(startDate).format('YYYY-MM-DD')} </Text>
                </View>

                <View style={{ width: 20 }}></View>
                <View style={styles.textDateB}>
                  <Text style={{ color: '#000', flex: 0.9, paddingLeft: 10 }}>至</Text>
                  <Text style={{ color: '#000' }}>{moment(endDate || (new Date())).format('YYYY-MM-DD')} </Text>
                </View>

              </View>

              <View style={{ flex: 1, backgroundColor: '#FFFFFF', }}>
                <CalendarPicker
                  startFromMonday={true}
                  allowRangeSelection={true}
                  minDate={moment(minDate[0]).format('YYYY-MM-DD')}
                  maxDate={moment(maxDate[0]).format('YYYY-MM-DD')}
                  weekdays={['一', '二', '三', '四', '五', '六', '日']}
                  months={['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二']}
                  previousTitle="<"
                  nextTitle=">"
                  selectedDayColor="#00a6ff"
                  selectedDayTextColor="#fff"
                  scaleFactor={375}
                  textStyle={{
                    fontFamily: 'Cochin',
                    color: '#000000',
                  }}
                  onDateChange={this.onDateChange}
                />


              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
