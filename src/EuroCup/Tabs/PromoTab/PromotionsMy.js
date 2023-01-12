const { width, height } = Dimensions.get("window");
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Tabs, Toast } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import React from 'react';
import moment from 'moment';
import LoadingBone from "../../../containers/Common/LoadingBone";

const PromotionsMyTab = [
  {
    title: "已申请优惠",
  },
  {
    title: "免费投注",
  },
];

class Promotions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* 隐藏失效的优惠 */
      HideInvalid: true,
      activeIndex: 0,

      // freeBet
      toggleIndex: 0,
      isShowToggle: false,
    };
  }

  componentDidMount() {
    if (!ApiPort.UserLogin) {
      Toasts.error('请先登陆');
      Actions.Login()
      return
    }
  }

  onRefresh = (e) => {
    console.log('_contentViewScroll')
    this.props.initialization(true)
  }

  changeToggleStatus(isShowToggle, toggleIndex) {
    this.setState({
      isShowToggle,
      toggleIndex: isShowToggle ? toggleIndex * 1 : ''
    })
  }

  createToggle1(i) {
    return <TouchableOpacity
      onPress={this.changeToggleStatus.bind(this, this.state.toggleIndex == i ? !this.state.isShowToggle : true, i)}
      hitSlop={{ left: 15, top: 15, bottom: 15, right: 15 }}
    >
      <Image style={{ width: 16, height: 16 }} source={require('../../../images/icon/exclamation2.png')}/>
    </TouchableOpacity>
  }

  createToggle2() {
    return <View
      style={[styles.toggleBox, {
        backgroundColor: '#363636',
      }]}>
      <View style={[styles.toggleArrow, {
        borderBottomColor: '#363636',
        right: 6
      }]}/>
      <Text style={[styles.toggleText1, { color: '#fff' }]}>
        该免费投注为您特别优惠。
        {"\n"}
        马上点击领取以防优惠失效。
      </Text>
      <TouchableOpacity
        style={{ position: "absolute", right: 7, top: 12 }}
        onPress={this.changeToggleStatus.bind(this, false, this.state.toggleIndex)}
        hitSlop={{ left: 15, top: 5, bottom: 5, right: 15 }}
      >
        <Image style={{ width: 14, height: 14 }} source={require('../../../images/icon/closeWhite.png')}/>
      </TouchableOpacity>
    </View>
  }

  /**
   * @description: 领取红利
   * @param {*} id 优惠ID
   */
  ClaimBonus = (ID) => {
    PiwikEvent('Promo History', 'Click', `Cancel_(${ID})_MyPromo_EUROPage`)
    let postData = {
      playerBonusId: ID
    };
    Toast.loading('请稍候...');
    fetchRequest(ApiPort.ClaimBonus, 'POST', postData)
      .then((res) => {
        Toast.hide();
        console.log(res)
        if (res) {
          console.log(res)
          if (res.isSuccess && res.result.isClaimSuccess) {
            Toast.success(res.result.message);
          } else {
            Toast.fail(res.result.message);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getPromotionContent(promotionId = null, item) {
    PiwikEvent("Promo Click", "View", `${promotionId}_PromoPage`);
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
        Actions.PromotionsDetail({
          Detail: data,
          from: "freeBet",
          item: item,
          getFreePromotions: this.props.getFreePromotions(),
          fromPage: this.props.fromPage
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // 骨架屏
  myPromoLoadingBone = () => {
    return Array.from({ length: 3 }, (v) => v).map((v, i) => {
      return (
        <View key={i} style={{
          flex: 1,
          height: 135,
          alignItems: "flex-start",
          justifyContent: "flex-start",
          marginHorizontal: 10,
          borderRadius: 5,
          overflow: "hidden",
          backgroundColor: "#e0e0e0",
          marginBottom: 20
        }}>
          <LoadingBone/>
        </View>
      )
    })
  }

  // 骨架屏
  freePromoLoadingBone = () => {
    return Array.from({ length: 2 }, (v) => v).map((v, i) => {
      return (
        <View key={i} style={{
          flex: 1,
          height: 200,
          alignItems: "flex-start",
          justifyContent: "flex-start",
          marginHorizontal: 10,
          borderRadius: 5,
          overflow: "hidden",
          backgroundColor: "#e0e0e0",
          marginBottom: 20
        }}>
          <LoadingBone/>
        </View>
      )
    })
  }

  filterSports = (data) => {
    if(data && data != '' && data.length > 0){
      return data.filter((item) => {
        if(item.promotionCategory){
          return item.promotionCategory.toLowerCase() === "sports" 
        }
      });
    } else {
      return []
    }
  }

  render() {
    let { PromotionsData, FreePromotionsData, from, fromPage } = this.props;
    if(fromPage === "sports"){
      PromotionsData = this.filterSports(PromotionsData);
      FreePromotionsData = this.filterSports(FreePromotionsData);
    }
    
    const { HideInvalid, activeIndex, toggleIndex, isShowToggle } = this.state;

    /*---------------------- 
      筛选出失效状态的优惠 
    ------------------------*/
    let Invalidstatus = [
      'Expired',
      'Served',
      'Force to Serve',
      'Canceled',
      'Claimed',
      'Not eligible',
      'Approved'
    ];

    /*------------------------------------------------------------------------------
      筛选出正常显示的优惠数据  Note:只有这些状态才出现在【我的优惠Tab】列表 反之过滤掉
    --------------------------------------------------------------------------------*/
    let Normalstatus = ['Pending', 'Serving', 'Waiting for release', 'Release', 'Processing'];

    const filterData = (status) => {
      let filterDataList =
        PromotionsData && PromotionsData != ''
          ? PromotionsData.filter((item) => {
            return status.some((n) => n.toLowerCase() === item.status.toLowerCase());
          })
          : [];
      return filterDataList;
    };
    /*---------------- 正常的优惠列表 --------------------*/
    let Normaldata = filterData(Normalstatus);
    /*---------------- 失效的优惠列表 ---------------------*/
    let Invaliddata = filterData(Invalidstatus);

    return (
      <>
        <Tabs
          tabs={PromotionsMyTab}
          page={this.state.activeIndex}
          swipeable={false}
          renderTabBar={(tabProps) => (
            <View
              style={[
                styles.bettingWraps,
                {
                  borderColor: true ? "transparent" : "#646464",
                  backgroundColor: true ? "#00A6FF" : "#212121",
                },
              ]}
            >
              {tabProps.tabs.map((v, i) => {
                let flag = i * 1 === activeIndex * 1;
                return (
                  <TouchableOpacity
                    key={v.key || i}
                    style={[
                      styles.bettingBox,
                      {
                        backgroundColor: "#00A6FF",
                        borderBottomWidth: 2,
                        borderBottomColor: flag ? "#FFFFFF" : "#00A6FF",
                      },
                    ]}
                    onPress={() => {
                      const { goToTab, onTabClick } = tabProps;
                      this.setState({
                        activeIndex: i
                      })
                    }}
                  >
                    <Text
                      style={[
                        {
                          color: flag ? "#FFFFFF" : "#B4E4FE",
                          fontWeight: flag ? "bold" : "normal",
                          fontSize: 14,
                          marginBottom: 7
                        },
                      ]}
                    >
                      {v.title ? v.title : ""}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        >
          <ScrollView style={{ flex: 1, backgroundColor: '#EFEFF4'}}
                      refreshControl={
                        <RefreshControl refreshing={this.props.onRefresh} onRefresh={() => this.onRefresh()}/>
                      }>
            <View style={{height: 14}} />
            {/*----------------------------------------------------------------
					正常显示的优惠 如果有数据则显示。没有数据就显示 暂无任何优惠记录
				-------------------------------------------------------------------*/}
            {PromotionsData !== '' ? Normaldata.length != 0 ? (
              Normaldata.map((data, index) => {
                return <PromotionsCard data={data} categories={this.props.categories} key={index}
                                       Promotions={() => this.props.Promotions()}/>;
              })
            ) : (
              // !Invaliddata.length &&
              <View style={styles.ndData}>
                <Image style={{ width: 68, height: 68 }} source={require('../../../images/euroCup/nodata.png')}/>
                <Text style={{ color: '#999999', lineHeight: 25 }}>您暂无任何优惠记录， </Text>
                <Text style={{ color: '#999999', lineHeight: 25 }}>先去优惠页面申请吧！</Text>
              </View>
            ) : (
              this.myPromoLoadingBone()
            )}
            {/*-------------------------------
						展示已经失效的优惠
				----------------------------------*/}
            {PromotionsData !== '' &&
              !!Invaliddata.length && (
                <Touch
                  onPress={() => {
                    this.setState({
                      HideInvalid: !HideInvalid
                    });
                  }}
                >
                  {HideInvalid ? (
                    <Text style={styles.moreList}>
                      失效的优惠已被隐藏 <Text style={{ color: '#00A6FF' }}> 点击查看</Text>
                    </Text>
                  ) : (
                    <Text style={styles.moreList}>
                      <Text style={{ color: '#00A6FF' }}>点击隐藏 </Text>所有失效的优惠
                    </Text>
                  )}
                </Touch>
              )}
            {PromotionsData !== '' &&
              !HideInvalid &&
              Invaliddata.map((data, index) => {
                return (
                  <View key={index}>
                    {/* <PromotionsCard
									data={data}
									dataindex={index}
									Promotions={() => this.props.Promotions()}
								/> */}
                    <PromotionsCardOverdue
                      data={data}
                      dataindex={index}
                      categories={this.props.categories}
                    />
                  </View>
                );
              })}
          </ScrollView>

          <ScrollView
            style={{ flex: 1, backgroundColor: '#EFEFF4', paddingTop: 15, paddingBottom: 25, paddingHorizontal: 16 }}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
              <RefreshControl refreshing={this.props.onRefresh} onRefresh={() => this.onRefresh()}/>
            }>
            {FreePromotionsData !== '' ? FreePromotionsData.length !== 0 ? (
              FreePromotionsData.map((item, index) => {
                return (
                  <ImageBackground
                    source={require('../../../images/promotion/freebetBG.png')}
                    resizeMode='stretch'
                    key={index}
                    style={{
                      // width: '100%',
                      // padding: 24
                      height: 200,
                      marginBottom: 8,
                      // marginHorizontal: 16
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 24 }}>
                      <View style={{ width: '90%' }}>
                        <Text
                          style={{
                            color: '#3C3C3C',
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginBottom: 4,
                            lineHeight: 22,
                            height: 45,
                            // width: "50%"
                          }}>{item.promoTitle}</Text>
                        <Text style={{
                          color: '#999999',
                          fontSize: 12
                        }}>结束时间：{moment(item.endDate.split('GMT')[0].trim()).format('YYYY-MM-DD HH:MM:SS')}</Text>
                      </View>
                      <View style={{ position: 'relative' }}>
                        {this.createToggle1(index)}
                        {(isShowToggle && index === toggleIndex) && this.createToggle2()}
                      </View>

                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        this.getPromotionContent(item.promoId, item);
                      }}
                      style={{
                        backgroundColor: '#00A6FF',
                        marginHorizontal: 24,
                        height: 44,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        marginTop: 25
                      }}>
                      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>立即领取</Text>
                    </TouchableOpacity>
                  </ImageBackground>
                )
              })
            ) : (
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
                <Image style={{ width: 68, height: 68, marginBottom: 7.5 }}
                       source={require('../../../images/euroCup/nodata.png')}/>
                <Text style={{ color: '#999999' }}>暂无数据</Text>
              </View>
            ) : (
              this.freePromoLoadingBone()
            )}
          </ScrollView>
        </Tabs>

      </>

    );
  }
}

const styles = StyleSheet.create({
  ndData: {
    paddingTop: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  loding: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    marginTop: 12,
  },
  lodingView: {
    width: width * 0.92,
    height: width * 0.92 * 0.38,
    backgroundColor: '#00000033',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreList: {
    textAlign: 'center',
    lineHeight: 35,
    color: '#000000',
    fontSize: 12,
  },
  progressBar: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#E0E0E0',
    height: 8,
    width: width - 60,
    borderRadius: 50,
  },
  progressTxt: {
    width: width - 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Progress: {
    backgroundColor: '#00A6FF',
    height: 8,
    borderRadius: 50,
  },
  Card1: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    width: width - 30,
    marginLeft: 15,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 20,
  },
  Card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    width: width - 30,
    marginLeft: 15,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  smart: {
    backgroundColor: '#999999',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
    opacity: 0.5,
    width: '150%',
    height: '150%',
    borderRadius: 5,
  },
  LeftContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  CenterContent: {
    width: width * 0.7,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  Bubble: {
    position: 'absolute',
    zIndex: 999,
    top: 35,
    right: 0,
    padding: 15,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    backgroundColor: '#363636',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowView: {
    position: 'absolute',
    top: -13,
    right: 5,
    borderWidth: 7,
    borderBottomColor: '#363636',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  rowView1: {
    position: 'absolute',
    top: -13,
    right: 5,
    borderWidth: 7,
    borderBottomColor: '#363636',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  BubbleBtn: {
    position: 'absolute',
    zIndex: 999,
    top: 35,
    right: 0,
    padding: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    backgroundColor: '#363636',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  freebetBgImg: {
    width: width - 20,
    height: (width - 20) * .35,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  cancelTxt: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cancelBtn: {
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    marginLeft: 50,
  },
  BubbleBtnView: {
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    backgroundColor: '#00A6FF',
  },
  goDetail: {
    width: width - 60,
    borderWidth: 1,
    borderColor: '#00a6ff',
    height: 42,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  goRelease: {
    width: width - 60,
    backgroundColor: '#33BC63',
    height: 42,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },


  modalMaster: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0,0.5)',
  },
  modalTitle: {
    width: width * 0.9,
    backgroundColor: '#00A6FF',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  modalTitleTxt: {
    lineHeight: 40,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  modalView: {
    width: width * 0.9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingBottom: 15,
  },
  modalBtn: {
    width: width * 0.9,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalBtnL: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C5C7CB',
    width: width * 0.35,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnR: {
    borderRadius: 5,
    backgroundColor: '#00A6FF',
    width: width * 0.35,
    height: 42,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectView: {
    width: width * 0.9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectList: {
    width: width * 0.7,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 15,
  },
  acpItem: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 10,
    width: width * 0.7 * 0.5,
    marginBottom: 15,
  },
  activeSelect: {
    borderWidth: 3,
    borderColor: '#00a6ff',
    width: 15,
    height: 15,
    borderRadius: 30,
    marginRight: 10,
  },
  selectItem: {
    borderWidth: 1,
    borderColor: '#666',
    width: 15,
    height: 15,
    borderRadius: 30,
    marginRight: 10,
  },
  otherInput: {
    width: width * 0.5,
    borderBottomWidth: 1,
    borderColor: '#666666',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10,
  },
  bettingWraps: {
    flexDirection: "row",
    justifyContent: "space-around",
    overflow: "hidden",
    paddingTop: 30,
    // paddingHorizontal: 50
  },
  toggleBox: {
    position: 'absolute',
    padding: 10,
    top: 25,
    right: -7,
    alignItems: 'center',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowColor: '#000',
    elevation: 4,
    zIndex: 999,
    width: 189,
    // height: 58,
    borderRadius: 8
  },
  toggleArrow: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 8,
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    top: -15,
    right: 6
  },
  toggleText1: {
    flexWrap: 'wrap',
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 18,
    width: "100%",
  },
  toggleText2: {
    color: '#2199e8',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
})

export default Promotions;

/**
 * 优惠数据 相关类型 还有每个类型 需要对应的条件:
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @data          |  PromotionsData
 * @description:      |
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @promotionType  {Bonus}      |
 * @promotionType  {Manual}      |  三种奖金类型 Bonus Manual Other
 * @promotionType  {Other}      |
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Pending}    |  => @type Bonus   展示 待处理和交易编码
 * -----------------------------------------------------------------------------------------------------------------------------------
 *              |  => @type Bonus   展示:
 *                         最后更新时间 = updatedDate
 *              |             红利结束时间   = bonusProductList(Array) = expireDateTime
 * @param {Serving}      |               进度条    = percentage
 *              |             还需要多少流水  = turnoverNeeded
 *              |             200红利        = bonusAmount
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Waiting for release} => @type Bonus   展示 待派发 => 200紅利 = bonusAmount
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Release}      |  => @type Bonus   展示 领取 when [ isClaimable = true ]
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Processing}    |  => @type Manual  展示 待处理 【查看已提交资料】 按钮
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Served}      |  => @type Bonus   失效 已领取  展示=>红利结束时间 bonusProductList = expireDateTime | 200红利 = bonusAmount
 * @param {Force to served} |  => @type Bonus   失效 已领取  展示=>红利结束时间 bonusProductList = expireDateTime | 200红利 = bonusAmount
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Cancelled}    |  => @type Bonus   失效 已取消  展示=>红利结束时间 bonusProductList = expireDateTime | 200红利 = bonusAmount
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Approved}    |  => @type Manual  失效 已过期  展示=>禁用【查看已提交资料】 按钮
 * @param {Not eligible}  |   => @type Manual  失效 已过期  展示=>禁用【查看已提交资料】 按钮
 * @param {Expired}    |  => @type Bonus   失效 已过期
 * ------------------------------------------------------------------------------------------------------------------------------------
 *
 */
export class PromotionsCard extends React.Component {
  state = {
    /* 展开取消申请优惠弹窗 */
    ShowCancellPopup: false,
    remark: '选错优惠',
    remarkKey: 0
  };

  /**
   * @description: 领取红利
   * @param {*} id 优惠ID
   */
  ClaimBonus = (ID) => {
    PiwikEvent('Promo History', 'Click', `Cancel_(${ID})_MyPromo_EUROPage`)
    let postData = {
      playerBonusId: ID
    };
    Toast.loading('请稍候...');
    fetchRequest(ApiPort.ClaimBonus, 'POST', postData)
      .then((res) => {
        Toast.hide();
        console.log(res)
        if (res) {
          console.log(res)
          if (res.isSuccess && res.result.isClaimSuccess) {
            Toast.success(res.result.message);
          } else {
            Toast.fail(res.result.message);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * @description: 取消优惠
   * @param {*} bonusID 红利id
   * @param {*} playerBonusID 优惠id
   *
   */

  CancelPromotion = (bonusID, playerBonusID) => {
    // PiwikEvent('Promo History', 'Click', `Cancel_(${playerBonusID})_MyPromo_EUROPage​`)
    Toast.loading('请稍候...');
    let data = {
      bonusID: bonusID,
      playerBonusID: playerBonusID,
      remark: this.state.remark || '其他'
    };
    fetchRequest(ApiPort.CancelPromotion, 'POST', data)
      .then((res) => {
        Toast.hide();
        if (res) {
          if (res.result.isSuccess) {
            this.setState({
              ShowCancellPopup: false
            });
            Toast.success(res.result.message);
            this.props.Promotions();
          } else {
            Toast.fail(res.result.message);
          }
        }
        hide();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  times(t) {
    if (!t) {
      return
    }
    let times = ''
    if (t.includes('GMT')) {
      times = t
      const months = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12'
      }

      let datetime = times[2] + '-' + months[times[1]] + '-' + times[0] + ' ' + times[3]

      return datetime
    } else {
      times = t.split('+')[0]
      times = times.replace('T', ' ')
      return times
    }
  }

  getPromotionContent(promotionId = null, item, status = "") {
    PiwikEvent("Promo Click", "View", `${promotionId}_PromoPage`);
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
        const arr = Object.keys(data);
        if(arr.length === 0){
          Toasts.fail("无优惠")
          return;
        };
        this.setState({
          promotionContent: data,
        });
        if(status === "Processing"){
          Actions.PromotionsDetail({ Detail: data, item: item, from: "myPromoProcessing" });
        }else{
          Actions.PromotionsDetail({ Detail: data, item: item });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { ShowCancellPopup, remark, remarkKey } = this.state;
    /* status 
      Release 領取紅利
      Serving 流水 
      Served 或 Force to served 已領取
      Waiting for release 待派發
      pending 可取消
      expired 已失效優惠
    * */
    const {
      /* 标题 */
      promotionTitle,
      reference,
      /* 红利状态 */
      status,
      /* 红利ID */
      contentId,
      promotionId,
      /* 红利过期时间 */
      expiredDate,
      bonusRuleId,
      /* 红利的类型 */
      promotionType,
      playerBonusId,
      bonusAmount,
      turnoverNeeded,
      promotionCategory,
      percentage,
    } = this.props.data;
    console.log(this.props.data)
    const { categories } = this.props;
    const getObj = categories.find(v => v.PromoCatCode === promotionCategory);
    const { dataindex } = this.props;

    return (
      <View
        disabled={status !== 'Serving'}
        style={styles.Card1}>
        <View>
          <View style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            width: width - 60,
            paddingBottom: 5
          }}>

            {promotionCategory && getObj && getObj.promoCatImageUrl ?
              <Image source={{ uri: getObj.promoCatImageUrl }} style={{ width: 36, height: 36 }}/> :
              <Image style={{ width: 36, height: 36 }}
                     source={promotionType == 'Manual' ? require('../../../images/euroCup/icon_hs.png') : require('../../../images/euroCup/icon.png')}/>}

            {/*-------------------------------
								优惠基本信息
						----------------------------- --*/}
            <View style={{ paddingLeft: 15 }}>
              <Text style={{ color: '#3C3C3C', fontSize: 16, width: width * 0.62 }}
                    numberOfLines={1}>{promotionTitle ? promotionTitle : ""}</Text>
              {/*-------------------------------- 
									优惠结束时间
							---------------------------------*/}
              {status != 'Pending' &&
                <Text style={{ color: '#AEAEAE', fontSize: 12, paddingTop: 10 }}>结束时间：{moment(expiredDate).format('YYYY-MM-DD HH:mm:ss')}</Text>}
              {
                (status == 'Pending' || status == 'Processing') &&
                <Text style={{ color: '#00A6FF', fontSize: 12, paddingTop: 15 }}>待处理</Text>
              }
              {status == 'Pending' && (
                <Text
                  style={{ color: '#AEAEAE', fontSize: 12, paddingTop: 10 }}>交易编码 {reference.split(':')[1]}</Text>
              )}
            </View>
            <View>
              {/*--------------------------------------------------------------------------------------
						气泡框 进行中的优惠才显示，点击可以弹出 (取消优惠按钮) 与（不可取消的优惠联系客服提示）
						-----------------------------------------------------------------------------------------*/}
              {promotionType != 'Manual' &&
                (status == 'Waiting for release' ||
                  status == 'Processing' ||
                  status == 'Pending' ||
                  status == 'Serving') && (
                  <View style={{ paddingBottom: 40, }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          ['ShowBubble' + dataindex]: !this.state['ShowBubble' + dataindex]
                        });
                      }}
                    >
                      <Image style={{ width: 20, height: 20 }} source={require('../../../images/euroCup/set.png')}/>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          </View>
          {/* 取消按钮 */}
          {this.state['ShowBubble' + dataindex] && (
            status != 'Pending' ? <Touch style={styles.Bubble} onPress={() => {
                this.setState({ ['ShowBubble' + dataindex]: !this.state['ShowBubble' + dataindex] });
              }}>
                <View style={styles.rowView}/>
                <Text style={{ color: '#fff', fontSize: 11 }}>若想取消优惠，请联系客服</Text>
                <Text style={{ color: '#fff', fontSize: 12, paddingLeft: 15 }}>x</Text>
              </Touch>
              : <View style={styles.BubbleBtn}>
                <View style={styles.rowView1}/>
                <Touch style={styles.cancelTxt} onPress={() => {
                  this.setState({ ['ShowBubble' + dataindex]: !this.state['ShowBubble' + dataindex] })
                }}>
                  <Text style={{ color: '#fff', fontSize: 11 }}>需要取消优惠吗?</Text>
                  <Text style={{ color: '#fff', fontSize: 12, paddingLeft: 20 }}>x</Text>
                </Touch>
                <Touch style={styles.cancelBtn} onPress={() => {
                  this.setState({ ShowCancellPopup: true })
                }}>
                  <Text style={{ color: '#000', fontSize: 12 }}>取消</Text>
                </Touch>
              </View>

          )}

          {/*-------------------------------- 
								流水进度条 
					---------------------------------*/}
          {status == 'Serving' && (
            <View>
              <View style={styles.progressBar}>
                <View style={[styles.Progress, { width: (parseInt(percentage) / 100) * (width - 60) }]}/>
              </View>
              <View style={styles.progressTxt}>
                <Text>还需 {turnoverNeeded} 流水</Text>
                {(status == 'Serving' || status == 'Release') &&
                  <Text style={{ color: '#00a6ff', }}>{bonusAmount}元红利</Text>}
              </View>
            </View>
          )}

          {/*----------------------------------------
							已达到领取红利的条件 等待领取
					------------------------------------------*/}
          {status == 'Release' &&
            <Text style={{ color: '#00a6ff', lineHeight: 40, paddingLeft: 70 }}>{bonusAmount}元红利</Text>}
          {status == 'Release' && (
            <Touch
              onPress={() => {
                this.ClaimBonus(playerBonusId);
              }}
              style={styles.goRelease}
            >
              <Text style={{ color: '#fff' }}>领取红利</Text>
            </Touch>
          )}

          {/*---------------------------------
						待处理红利（可取消）
					----------------------------------*/}
          {(status == 'Pending' || status == 'Processing') && (
            <View>
              {/* {status == 'Pending' && (
								<Text style={{ color: '#AEAEAE', fontSize: 12 }}>
									交易编码 {Bonus.reference.split(':')[1]}
								</Text>
							)} */}
              {status == 'Processing' && (
                <Touch
                  style={styles.goDetail}
                  onPress={() => {
                    Actions.PromotionsForm({ myPromoItem: this.props.data, from: "myPromo" })
                    // Router.push(
                    // 	{
                    // 		pathname: `/promotions/[details]?id=${contentId}`,
                    // 		query: { details: 'promoform', id: contentId }
                    // 	},
                    // 	`/promotions/promoform?id=${contentId}`
                    // );
                  }}
                >
                  <Text style={{ color: '#00a6ff' }}>查看已提交资料</Text>
                </Touch>
              )}
            </View>
          )}

          {/*----------------------------------------
							已领取红利
					------------------------------------------*/}
          {status == 'Served' &&
            <Text style={{ color: '#0000004D', lineHeight: 40, paddingLeft: 70 }}>{bonusAmount}元红利</Text>}
          {status == 'Served' && (
            <View
              style={[styles.goRelease, { backgroundColor: '#0000001A' }]}
            >
              <Text style={{ color: '#0000004D' }}>已领取</Text>
            </View>
          )}
          {/*----------------------------------------
							待派发
					------------------------------------------*/}
          {status == 'Waiting for release' &&
            <Text style={{ color: '#00A6FF', paddingLeft: 60, marginBottom: 15 }}>{bonusAmount}元红利</Text>}
          {status == 'Waiting for release' && (
            <View
              style={[styles.goRelease, { backgroundColor: '#0000001A' }]}
            >
              <Text style={{ color: '#0000004D' }}>待派发</Text>
            </View>
          )}
        </View>


        {/*-------------------------------取消优惠弹窗 选择取消的原因 -----------------------------------*/}

        <Modal
          animationType="none"
          transparent={true}
          visible={ShowCancellPopup}
          onRequestClose={() => {
          }}
        >
          <View style={styles.modalMaster}>
            <View style={styles.modalView}>
              <View style={styles.modalTitle}>
                <Text style={styles.modalTitleTxt}>您真的要取消优惠？</Text>
              </View>
              <Text style={{ lineHeight: 30, paddingLeft: 15, width: width * 0.9, textAlign: 'left' }}>取消原因</Text>
              <View style={styles.selectView}>
                <View style={styles.selectList}>
                  {['选错优惠', '存款资料错误', '流水太多', '存款未到账', '其他'].map((val, index) => {
                    return (
                      <Touch
                        style={styles.acpItem}
                        key={index}
                        onPress={() => {
                          this.setState({
                            remarkKey: index,
                            remark: val == '其他' ? '' : val
                          });
                        }}
                      >
                        <View style={[remarkKey === index ? styles.activeSelect : styles.selectItem]}/>
                        <Text style={{ color: '#666', fontSize: 13 }}>{val}</Text>
                        {remarkKey == 4 && index == 4 && (
                          <View style={styles.otherInput}>
                            <TextInput
                              multiline={true}
                              style={{ width: width * 0.5, paddingLeft: 10, }}
                              placeholder='请输入原因'
                              value={remark}
                              onChangeText={(e) => {
                                this.setState({
                                  remark: e
                                });
                              }}
                            />
                          </View>
                        )}
                      </Touch>
                    );
                  })}
                </View>
              </View>
              <View style={styles.modalBtn}>
                <Touch onPress={() => {
                  this.setState({ ShowCancellPopup: false }, () => {
                    this.CancelPromotion(bonusRuleId, playerBonusId);
                  })
                }} style={styles.modalBtnL}>
                  <Text style={{ color: '#C5C7CB' }}>确认取消</Text>
                </Touch>
                <Touch onPress={() => {
                  this.setState({ ShowCancellPopup: false })
                }} style={styles.modalBtnR}>
                  <Text style={{ color: '#fff' }}>保留优惠</Text>
                </Touch>
              </View>
            </View>
          </View>
        </Modal>

        {/* <Modal closable={false} className="Proms" title="您真的要取消优惠？" visible={true}>
					<label>取消原因</label>
					<ul className="cap-list cancell-list">
						{['选错优惠', '存款资料错误', '流水太多', '存款未到账', '其他'].map((val, index) => {
							return (
								<li
									className="cap-item"
									key={index}
									onClick={() => {
										this.setState({
											remarkKey: index,
											remark: val
										});
									}}
								>
									<div className={`cap-item-circle${remarkKey === index ? ' curr' : ''}`} />
									<div className="padding-left-xs">{val}</div>
									{val == '其他' && (
										<Input
											size="large"
											placeholder=""
											value={remarkKey == 4 && remark != '其他' ? remark : ''}
											onChange={(e) => {
												this.setState({
													remark: e.target.value
												});
											}}
										/>
									)}
								</li>
							);
						})}
					</ul>
					<div className="flex justify-around">
						<div
							className="Btn-Common Cancell _active"
							onClick={() => {
								this.CancelPromotion(bonusId, playerBonusId);
							}}
						>
							确认取消
						</div>
						<div
							className="Btn-Common active"
							onClick={() => {
								this.setState({
									ShowCancellPopup: false
								});
							}}
						>
							保留优惠
						</div>
					</div>
				</Modal> */}
      </View>
    );
  }
}


// 已失效

export class PromotionsCardOverdue extends React.Component {
  state = {
    /* 展开取消申请优惠弹窗 */
    ShowCancellPopup: false,
    remark: '选错优惠',
    remarkKey: 0
  };

  times(t) {
    let times = ''
    if (!t) {
      return
    }
    if (t.includes('GMT')) {
      times = t
      const months = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12'
      }

      let datetime = times[2] + '-' + months[times[1]] + '-' + times[0] + ' ' + times[3]

      return datetime
    } else {
      times = t.split('+')[0]
      times = times.replace('T', ' ')
      return times
    }
  }

  render() {
    const { ShowCancellPopup, remark, remarkKey } = this.state;
    const {
      /* 标题 */
      promotionTitle,
      /* 红利数组 */
      bonusProductList,
      /* 红利状态 */
      status,
      /* 红利ID */
      contentId,
      /* 红利过期时间 */
      expiredDate,
      bonusId,
      /* 红利的类型 */
      promotionType,
      playerBonusId,
      bonusAmount,
      turnoverNeeded,
      promotionId,
      promotionCategory,
      percentage,
      bonusName,
    } = this.props.data;
    console.log(this.props.data)
    const { categories } = this.props;
    const { dataindex } = this.props;
    const getObj = categories.find(v => v.PromoCatCode === promotionCategory);
    console.log('getObj ', getObj)
    return (
      <View style={[styles.Card, { backgroundColor: '#f6f6f9' }]}>
        <View sty={styles.smart}/>
        <View>
          <View style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            width: width - 60,
            paddingBottom: 5
          }}>
            {promotionCategory && getObj && getObj.promoCatImageUrl ?
              <Image source={{ uri: getObj.promoCatImageUrl }} style={{ width: 36, height: 36 }}/> :
              <Image style={{ width: 36, height: 36 }}
                     source={promotionType == 'Manual' ? require('../../../images/euroCup/icon_hs.png') : require('../../../images/euroCup/icon.png')}/>}
            {/*-------------------------------
								优惠基本信息
						----------------------------- --*/}
            <View style={{ paddingLeft: 15 }}>
              <Text style={{ color: '#BCBEC3', fontSize: 16, width: width * 0.62 }}
                    numberOfLines={1}>{promotionTitle ? promotionTitle : ""}</Text>
              {/*-------------------------------- 
									优惠结束时间
							---------------------------------*/}
              <Text style={{ color: '#BCBEC3', fontSize: 12, paddingTop: 10 }}>结束时间：{this.times(expiredDate)}</Text>
              {
                promotionType == 'Manual' && <Text style={{ color: '#BCBEC3', fontSize: 12, paddingTop: 10 }}>已失效</Text>
              }
            </View>
            <View>
              {/*-------- 已领取和填表的没有icon -----*/}
              {(status != 'Served' && promotionType != 'Manual') && (
                <View>
                  <View>
                    <Image style={{ width: 20, height: 20 }} source={require('../../../images/euroCup/set.png')}/>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/*-------------------------------- 
								流水进度条 
					---------------------------------*/}
          {promotionType != 'Manual' && (status == 'Canceled' || status == 'Expired' || status == 'Force to Serve' || status == 'Claimed') && (
            <View>
              <View style={[styles.progressBar, { backgroundColor: '#0000001A' }]}>
                <View style={[styles.Progress, {
                  width: (parseInt(percentage) / 100) * (width - 60),
                  backgroundColor: '#E0E0E0'
                }]}/>
              </View>
              <View style={styles.progressTxt}>
                {turnoverNeeded && <Text style={{ color: '#0000004D' }}>还需 {turnoverNeeded} 流水</Text>}
                {bonusAmount && <Text style={{ color: '#0000004D', }}>{bonusAmount}元红利</Text>}
              </View>
            </View>
          )}

          {/*----------------------------------------
							已领取红利
					------------------------------------------*/}
          {promotionType != 'Manual' && status == 'Served' &&
            <Text style={{ color: '#0000004D', lineHeight: 40, paddingLeft: 70 }}>{bonusAmount}元红利</Text>}
          {promotionType != 'Manual' && status == 'Served' && (
            <View
              style={[styles.goRelease, { backgroundColor: '#0000001A' }]}
            >
              <Text style={{ color: '#0000004D' }}>已领取</Text>
            </View>
          )}

          {/*---------------------------------
						待处理红利（可取消）
					----------------------------------*/}
          {promotionType == 'Manual' && (
            <View>
              {/* {status == 'Pending' && (
								<Text style={{ color: '#AEAEAE', fontSize: 12 }}>
									交易编码 {Bonus.reference.split(':')[1]}
								</Text>
							)} */}
              {status == 'Processing' && (
                <View
                  style={[styles.goDetail, { borderColor: '#BCBEC3' }]}
                >
                  <Text style={{ color: '#BCBEC3' }}>查看已提交资料</Text>
                </View>
              )}
            </View>
          )}
        </View>

      </View>
    );
  }
}
