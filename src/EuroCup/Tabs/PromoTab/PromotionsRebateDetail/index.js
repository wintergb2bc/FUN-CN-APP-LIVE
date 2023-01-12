const { width, height } = Dimensions.get("window");
import { Dimensions, Modal, Platform, StyleSheet, Text, View, WebView } from "react-native";
import { Toast } from 'antd-mobile-rn';
import WebViewIOS from "react-native-webview";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';

import React from 'react';

class PromotionsRebateDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* 优惠详细网址URL */
      modalHtml: '',
      /* 默认优惠类型 */
      type: 'Bonus',
      /* 默认优惠状态 */
      status: 'Available',
      Detail: '',
      Successmsg: '恭喜您！申请成功',
      ShowSuccessPopup: false,
      ShowFailPopup: false,
      Failmsg: '您暂时不符合此好礼资格，建议马上存款。'
    };
    console.log('PromotionsRebateDetail')
    console.log(this.props.data)
  }

  componentWillMount() {
    /*------------- 检索需要准备的数据 ------------*/
    let DailyDealsPromotiondata = this.props.data
    console.log('DailyDealsPromotiondata')
    console.log(DailyDealsPromotiondata)
    if (this.props.data) {
      /*------------- 获取每日好礼优惠的本地数据 ----------*/
      this.Detail(this.props.data);
    } else {
      /*------------- 请求每日好礼Api获取优惠数据 --------*/
      this.DailyDealsPromotion();
    }
  }


  /**
   * @description: 每日好礼数据
   */

  DailyDealsPromotion = () => {
    // fetchRequest(ApiPort.DailyDealsPromotion + 'eventCategoryType=Euro2021&', 'GET')
    fetchRequest(ApiPort.DailyDealsPromotion + '&', 'GET')
      .then((res) => {
        if (res && res.length) {
          /*------ 获得本条优惠的ID ------*/
          // const { id } = Router.router.query;
          /*------ 根据ID筛选出对应的数据 -----*/
          const Detail = res.find((item) => item.promoId == this.props.ids);
          this.setState(
            {
              Detail: Detail
            }
          );
          localStorage.setItem('DailyDealsPromotiondata', JSON.stringify(res));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  Detail = (data) => {
    /*------ 获得本条优惠的ID ------*/
    // const { id } = Router.router.query;
    /*------ 根据ID筛选出对应的数据 -----*/
    const Detail = data.find((item) => item.promoId == this.props.ids);
    Detail &&
    this.setState(
      {
        Detail: Detail,
        content: this.props.content
      }
    );
  };

  /**
   * @description: 领取红利
   * @param {*} id 优惠ID
   */

  ClaimBonus = (ID) => {
    let postData = {
      playerBonusId: ID
    };
    Toast.loading('请稍候...');
    fetchRequest(ApiPort.ClaimBonus, 'POST', postData)
      .then((res) => {
        Toast.hide();
        if (res) {
          if (res.result.isClaimSuccess) {
            Toast.success(res.message);
          } else {
            Toast.fail(res.message);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * ---------------------------------------------------------------
   * @data            Detail.status
   * @description:        每日好礼申请优惠按钮的动作状态:
   * ---------------------------------------------------------------
   * @param {string} Available 显示立即申请按钮
   * @bonusType = ManualItems 跳转去收礼地址页面
   * @其他bonusType = 去直接申请
   * ---------------------------------------------------------------
   * @param {string} SoldOut      显示 已售罄 置灰禁止点击
   * @param {string} grabbed      显示 已参与 置灰禁止点击
   * ---------------------------------------------------------------
   */

  /**
   * @description: 申请每日好礼优惠
   * @param {*}
   * @return {Object}
   */

  ApplyDailyDeals = (Detail) => {
    const { bonusId, bonusData } = Detail;
    const getBonusid = bonusId || bonusData.bonusId;
    if (!getBonusid) {
      Toasts.error('优惠异常');
      return;
    }
    Toast.loading('请稍候...');
    let query = `bonusRuleId=${getBonusid + ""}&`;
    let postData = {bonusRuleId: getBonusid + ""};
    fetchRequest(ApiPort.ApplyDailyDeals + query, 'POST', postData)
      .then((res) => {
        Toast.hide();
        if (res) {
          if (res.isSuccess) {
            this.setState({
              ShowSuccessPopup: true,
              Successmsg: res.result.message
            });
          } else {
            this.setState({
              ShowFailPopup: true,
              Failmsg: res.result.message
            });
          }
        }

      })
      .catch((res) => {
        if (res.errors && res.errors[0]){
          if(res.errors[0].errorCode === "BP00006" || res.errors[0].errorCode === "BP00007"){
            Toast.hide();
            this.setState({
              ShowFailPopup: true,
              Failmsg: res.errors[0].description
            });
            return;
          }
          if(res.errors[0].errorCode === "VAL13024"){
            Toast.fail(res.errors[0].message);
            return;
          }
        }
        console.log(res);
      });
  };
  _onNavigationStateChange = (e) => {
    // if (e.url == 'http://livechat.tlc808.com/') {
    // 	LiveChatOpenGlobe()
    // 	this.setState({ onNavigation: false })
    // 	setTimeout(() => {
    // 		//切换回去优惠详情
    // 		this.setState({ onNavigation: true })
    // 	}, 1000);
    // }
  }

  onLoadStart(e) {
    this.setState({ loading: true });
  }

  onLoadEnd(e) {
    this.setState({ loading: false });
  }

  onError(e) {
    this._webView.reload();
  }

  getStatus = () => {
    const { Detail } = this.state;
    const { bonusData } = Detail;
    
    if (bonusData && (bonusData.currentApplications === bonusData.maxApplications)) {
      return "SoldOut"
    }
    return "Available"
  }

  render() {
    const { Detail, ShowSuccessPopup, Successmsg, ShowFailPopup, Failmsg } = this.state;
    const { content } = this.props;
    const { bonusData } = Detail;
    const status = this.getStatus();
    //直接判断这三个状态就行了  简单快捷
    //"Status" = Available 显示 立即申请
    //"Status" = SoldOut   显示 已售罄 没动作
    //"status" = grabbed   显示 已参与 没动作
    const modalHtml = content ? content.body : ''
    return (
      <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
        {content != '' && (
          <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
            {/* -----优惠HTML容器---- */}
            {modalHtml != '' && Platform.OS == "ios" ?

              <WebViewIOS
                ref={ref => {
                  this._webView = ref;
                }}
                onLoadStart={e => this.onLoadStart(e)}
                onLoadEnd={e => this.onLoadEnd(e)}
                onError={(e) => this.onError(e)}
                //source={{ html: body }}
                //<meta>  防止字體縮小 ,只有ios需要這樣處裡 
                source={{ html: '<meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{background-color: #EFEFF4}</style>' + modalHtml }}
                scalesPageToFit={Platform.OS === "ios" ? false : true}
                originWhitelist={["*"]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                thirdPartyCookiesEnabled={true}
                style={styles.webViewStyle}
                // onNavigationStateChange={this._onNavigationStateChange}
              />

              : modalHtml != '' && Platform.OS == "android" &&
              <WebView
                ref={ref => {
                  this._webView = ref;
                }}
                onLoadStart={e => this.onLoadStart(e)}
                onLoadEnd={e => this.onLoadEnd(e)}
                onError={(e) => this.onError(e)}
                source={{ html: '<meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{background-color: #EFEFF4}</style>' + modalHtml }}
                scalesPageToFit={Platform.OS === "ios" ? false : true}
                originWhitelist={["*"]}
                thirdPartyCookiesEnabled={true}
                style={styles.webViewStyle}
                // onNavigationStateChange={this._onNavigationStateChange}
              />
            }
            {/* ---------END--------- */}
            <View style={[styles.activeBtn,{paddingBottom: 15}]}>
              {(() => {
                switch (status) {
                  case 'Available':
                    return bonusData && bonusData.bonusGivenType === 'Manual Items' && bonusData.itemType != 'Free Spin' ? (
                      <Touch
                        onPress={() => {
                          PiwikEvent('Promo History', 'Click', `CTAbutton_(${Detail.id})_EUROPage`)
                          if (!ApiPort.UserLogin) {
                            Toasts.error('请先登陆');
                            Actions.Login()
                            return
                          }
                          Actions.PromotionsAddress({ promoid: bonusData.bonusId })
                        }}

                        style={styles.bonusBtn}>
                        <Text style={styles.bonusBtnTxt}>立即申请</Text>
                      </Touch>
                    ) : (
                      <Touch
                        style={styles.bonusBtn}
                        onPress={() => {
                          if (!ApiPort.UserLogin) {
                            Toasts.error('请先登陆');
                            Actions.Login()
                            return
                          }
                          this.ApplyDailyDeals(Detail);
                        }}
                      >
                        <Text style={styles.bonusBtnTxt}>立即申请</Text>
                      </Touch>
                    );
                    break;
                  case 'SoldOut':
                    return <View style={styles.nullbonusBtn}><Text style={styles.nullbonusBtnTxt}>已售罄</Text></View>;
                    break;
                  case 'grabbed':
                    return <View style={styles.nullbonusBtn}><Text style={styles.nullbonusBtnTxt}>已参与</Text></View>;
                    break;
                  case 'Served':
                    return <View style={styles.nullbonusBtn}><Text style={styles.nullbonusBtnTxt}>已领取</Text></View>;
                    break;
                  default:
                    return null;
                }
              })()}
            </View>
          </View>
        )}
        {/* ------------------申请成功弹窗----------------- */}


        <Modal
          animationType="none"
          transparent={true}
          visible={ShowSuccessPopup}
          onRequestClose={() => {
          }}
        >
          <View style={styles.modalMaster}>
            <View style={styles.modalView}>
              <View style={styles.modalTitle}>
                <Text style={styles.modalTitleTxt}>申请成功</Text>
              </View>
              <Text style={{ lineHeight: 70, textAlign: 'center', color: '#666' }}>{Successmsg}</Text>
              <View style={styles.modalBtn}>
                <Touch onPress={() => {
                  this.setState({ ShowSuccessPopup: false })
                }} style={styles.modalBtnL}>
                  <Text style={{ color: '#00A6FF' }}>关闭</Text>
                </Touch>
                <Touch onPress={() => {
                  this.setState({ ShowSuccessPopup: false }, () => {
                    this.setState({ ShowSuccessPopup: false }, () => {
                      Actions.pop()
                    })
                  })
                }} style={styles.modalBtnR}>
                  <Text style={{ color: '#fff' }}>立即游戏</Text>
                </Touch>
              </View>
            </View>
          </View>
        </Modal>

        {/* ------------------申请失败弹窗----------------- */}

        <Modal
          animationType="none"
          transparent={true}
          visible={ShowFailPopup}
          onRequestClose={() => {
          }}
        >
          <View style={styles.modalMaster}>
            <View style={styles.modalView}>
              <View style={styles.modalTitle}>
                <Text style={styles.modalTitleTxt}>条件不足</Text>
              </View>
              <Text style={{ lineHeight: 70, textAlign: 'center', color: '#666' }}>{Failmsg}</Text>
              <View style={styles.modalBtn}>
                <Touch onPress={() => {
                  this.setState({ ShowFailPopup: false })
                }} style={styles.modalBtnL}>
                  <Text style={{ color: '#00A6FF' }}>关闭</Text>
                </Touch>
                <Touch onPress={() => {
                  this.setState({ ShowFailPopup: false }, () => {
                    Actions.DepositCenter({ from: 'GamePage' })
                  })
                }} style={styles.modalBtnR}>
                  <Text style={{ color: '#fff' }}>存款</Text>
                </Touch>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  webViewStyle: {
    flex: 1,
    backgroundColor: "#EFEFF4",
    borderWidth: 0
    // width: width,
    // height: height,
  },
  bonusBtnTxt: {
    textAlign: 'center',
    lineHeight: 40,
    color: '#fff',
    fontWeight: 'bold'
  },
  bonusBtn: {
    backgroundColor: '#00A6FF',
    width: "100%",
    borderRadius: 5,
  },
  nullbonusBtnTxt: {
    textAlign: 'center',
    lineHeight: 40,
    color: '#BCBEC3',
    fontWeight: 'bold'
  },
  nullbonusBtn: {
    backgroundColor: '#EFEFF4',
    width: width - 30,
    borderRadius: 5,
    marginLeft: 15,
  },
  modalMaster: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0,0.5)',
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
    borderColor: '#00A6FF',
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
  activeBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    padding: 15,
    // paddingBottom: 30,
    backgroundColor: "#fff"
  },
})


export default PromotionsRebateDetail;
