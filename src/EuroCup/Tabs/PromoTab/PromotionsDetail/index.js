import HeaderBackIcon from "../../../../containers/Common/HeaderBackIcon";

const { width, height } = Dimensions.get("window");
import {
  Alert,
  CameraRoll, Clipboard,
  Dimensions,
  Image,
  ImageBackground,
  Modal, PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView
} from "react-native";
import { Toast } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import React from 'react';
// import Router from 'next/router';
// import Toast from '@/Toast';
// import Modal from '@/Modal';
import WebViewIOS from "react-native-webview";
import { ACTION_UserInfo_getBalanceAll, ACTION_UserInfo_getBalanceSB } from '$LIB/redux/actions/UserInfoAction';
import { connect } from 'react-redux';
import { Toasts, ToastSuccess } from "../../../../containers/Toast";
import QRCodeA from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import ImageForTeam from "../../../../containers/SbSports/game/RNImage/ImageForTeam";
import moment from "moment/moment";

class PromotionsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* 优惠详细网址URL */
      modalHtml: this.props.Detail && this.props.Detail.body || '',
      /* 默认优惠类型 */
      type: 'Bonus',
      /* 默认优惠状态 */
      status: 'Available',
      /* 显示余额不足 */
      Todeposit: false,
      htmlcontent: '',
      shareModal: false,
      detail: this.props.Detail,
      siteUrl: window.SBTDomain + '/cn/mobile/sbtwo',
      shareModalToast: false,
      shareModalText: ""
    };
    this.ViewShotRef = React.createRef();
  }

  componentDidMount() {
  }


  /**
   * @description: 领取红利
   * @param {*} id 优惠ID
   */

  ClaimBonus = (ID) => {
    console.log('ClaimBonus')
    console.log(ID)
    let postData = {
      playerBonusId: ID*1
    };
    Toast.loading('请稍候...');
    fetchRequest(ApiPort.ClaimBonus, 'POST', postData)
      .then((data) => {
        console.log(data);
        const res = data.result;
        if (res) {
          if (res.isClaimSuccess) {
            Toast.success(res.message);
          } else {
            Toast.fail(res.message);
          }
          setTimeout(() => {
            this.props.userInfo_getBalanceAll(true)
          }, 2000);
        }
        // Toast.destroy();
      })
      .catch((error) => {
        console.log(error);
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

  getBalance = () => {
    const allBalance = this.props.userInfo.allBalance;
    if (allBalance.length > 0) {
      this.checkBalance();
    } else {

    }
  }


  checkBalance = () => {
    const { bonusProduct, bonusMinAmount, promoType, bonusId, bonusProductList } = this.props.Detail;
    console.log(this.props)
    const allBalance = this.props.userInfo.allBalance;
    console.log('this.props.Detail')
    console.log(this.props.Detail)
    if (allBalance.length === 0) {
      this.props.userInfo_getBalanceAll();
      return;
    }

    const memberInfo = this.props.userInfo.memberInfo;

    const totalBalance = this.props.userInfo.balanceTotal;
    const mainBalance = allBalance.find(v => v.name === "MAIN").balance;
    const otherBalance = allBalance.some(v => v.balance > 0);

    console.log('totalBalance ', totalBalance)
    console.log('mainBalance ', mainBalance)
    console.log('otherBalance ', otherBalance)
    console.log('bonusMinAmount ', bonusMinAmount)
    if (
      !memberInfo.firstName
    ) {
      Toasts.error('资料不完整，请至个人资料完善！', 3);
      Actions.userInfor()
      return
    }

    if (promoType === "Bonus") {
      // Total balance < 最小申請優惠金額 -> 存款page
      if (totalBalance < bonusMinAmount) {
        this.setState({
          Todeposit: true
        });
        return;
      }

      // 主錢包<=最小申請優惠金額  && 其他的產品錢包>=最小申請優惠金額 -> 轉帳 + one click button
      if ((mainBalance <= bonusMinAmount) && (otherBalance >= bonusMinAmount)) {
        Actions.pop();
        Actions.Transfer({ froms: 'promotions', promotionsDetail: this.props.Detail, oneClick: true })
        return;
      } else {
        Actions.pop();
        Actions.Transfer({ froms: 'promotions', promotionsDetail: this.props.Detail })
        return;
      }
    } else {
      Actions.PromotionsForm({Detail: this.props.Detail, fromPage: this.props.fromPage || "" })
    }

  }

  //下載分享圖片
  downloadShareImage = async () => {

    const saveImage = (uri) => {
      Toast.loading('请稍候...',0);
      CameraRoll.saveToCameraRoll(uri)
        .then((result) => {
          Toast.hide();
          this.setState({
            shareModalToast: true,
            shareModalText: "图片已下载",
          },()=>{
            setTimeout(() => {
              this.setState({
                shareModalToast: false,
                shareModalText: ""
              });
            }, 1000);
          })
        })
        .catch((error) => {
          Toast.hide();
          let errorMsg =
            Platform.OS == "ios"
              ? "请在iPhone的“设置-隐私-照片” 中允许访问照片"
              : "请在Android的“设置 - 应用管理 - 同乐城 - 应用权限”中允许 访问相机";
          Alert.alert("二维码保存失败", errorMsg);
          console.log(error);
        });
    };

    if (Platform.OS == "android") {
      try {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        await PermissionsAndroid.request(permission);
        Promise.resolve();

        setTimeout(() => {
          this.ViewShotRef.current.capture().then(
            (uri) => saveImage(uri),
            (error) => Toasts.fail(error)
          );
        }, 1000);
      } catch (error) {
        Promise.reject(error);
      }
    } else {
      this.ViewShotRef.current.capture().then(
        (uri) => saveImage(uri),
        (error) => Toasts.fail(error)
      );
    }
  }

  //獲取分享鏈接
  getShareUrl = () => {
    return this.state.siteUrl
      + `/share/?deeplink=promo&pid=${this.props.Detail.promoId}`;
  }

  //复制
  copy(txt) {
    try {
      const value = String(txt)
      Clipboard.setString(value);
      this.setState({
        shareModalToast: true,
        shareModalText: "链接已复制",
      },()=>{
        setTimeout(() => {
          this.setState({
            shareModalToast: false,
            shareModalText: ""
          });
        }, 1000); 
      })
    } catch (error) {
      console.log(error);
    }

  }
  
  /**
   * 申请优惠按钮的动作状态:
   * ------------------------------------------------------------------------------------------------------------------------------
   * @data            PromotionsData
   * @description:
   * ------------------------------------------------------------------------------------------------------------------------------
   * @type  {Bonus}        立即申请
   * @type  {Manual}        立即申请 打开奖金申请表页面
   * @type  {Other}        不做任何状态 隐藏按钮
   * -------------------------------------------------------------------------------------------------------------------------------
   * @param {Pending}      @type  {Bonus}  显示待处理按钮
   * @param {Processing}      @type  {Bonus}  显示待处理按钮
   * -------------------------------------------------------------------------------------------------------------------------------
   * @param {Serving}      @type  {Bonus}  显示进度条 => 百分比 => 进度完成率 => 显示所需的营业额
   * -------------------------------------------------------------------------------------------------------------------------------
   * @param {Waiting for release} @type  {Bonus}  显示待派发按钮
   * -------------------------------------------------------------------------------------------------------------------------------
   * @param {Release}        @type  {Bonus}  显示领取按钮  when [ isClaimable = true ]  call POST /api/Bonus/Claim
   * -------------------------------------------------------------------------------------------------------------------------------
   * @param {Available}      @type  {Bonus}  显示立即申请按钮 如果钱包有足够的金额重定向到转账页面，否则重定向到存款页面与选定的奖金
   * @param {Available}      @type  {Manual} 显示立即申请按钮 打开优惠申请表页面
   * -------------------------------------------------------------------------------------------------------------------------------
   * @param {Served}        @type  {Bonus}  显示已领取按钮
   * @param {Force to served}  @type  {Bonus}  显示已领取按钮
   * -------------------------------------------------------------------------------------------------------------------------------
   */

  render() {
    const { Todeposit, modalHtml, shareModalToast, shareModalText } = this.state;
    const { promoType, actionType } = this.props.Detail;
    const { history, from, startDate, endDate, fromPage = "" } = this.props;
    console.log(this.props)
    return (
      <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
        <View style={[styles.topNav]}>
          <HeaderBackIcon tintColor={"#fff"} onPress={() => {
            Actions.pop();
          }} />
         <Text style={{color: "#FFFFFF", fontSize: 16, fontWeight: "bold"}}>优惠详情</Text>
          {fromPage === "sports" ? (
            <TouchableOpacity
              style={{width: 70, height: 50, justifyContent: "center", alignItems: "center"}}
              onPress={()=>{
              this.setState({
                shareModal: true
              });
                PiwikEvent("Navigation", "Click", `Share_${this.props.Detail.promoId}`);
            }}>
              <Image
                resizeMode="stretch"
                source={require("../../../../images/icon/share.png")}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
          ):(
            <View style={{height: 50, width: 70,}} />
          )}
        </View>
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
            source={{ html: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' + modalHtml }}
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
            source={{ html: modalHtml }}
            scalesPageToFit={Platform.OS === "ios" ? false : true}
            originWhitelist={["*"]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            thirdPartyCookiesEnabled={true}
            style={styles.webViewStyle}
            // onNavigationStateChange={this._onNavigationStateChange}
          />
        }
        {/* ---------END--------- */}
        <View style={[styles.activeBtn,{paddingBottom: actionType && actionType === "NO_ACTION" ? 10 : 30}]}>
          {(() => {
            if(actionType && actionType === "NO_ACTION"){
              return null
            }
            if (promoType === "Bonus" && history) {
              switch (history.status) {
                case "Serving":
                  return (
                    <View>
                      <View style={styles.progressBar}>
                        <View
                          style={[styles.Progress, { width: (parseInt(history.percentage) / 100) * (width - 30) }]}/>
                      </View>
                      <Text style={{ textAlign: 'center', fontSize: 13, color: '#111' }}>还需<Text
                        style={{ fontWeight: 'bold' }}>{history.turnoverNeeded}</Text>流水,可得<Text
                        style={{ fontWeight: 'bold' }}>{history.bonusAmount}</Text>元红利</Text>
                    </View>
                  );
                  break;
                case 'Release':
                  return (
                    /* ****** 先检查 isClaimable 为 true *******/
                    history.isClaimable && (
                      <Touch
                        style={styles.bonusBtnOk}
                        onPress={() => {
                          /***********检查是否已经登录 ********/
                          if (!ApiPort.UserLogin) {
                            Toasts.error('请先登陆');
                            Actions.Login()
                            return
                          }
                          // PiwikEvent('Promo Nav', 'Click', `Claim_(${this.props.Detail.contentId})_EUROPage`)
                          this.ClaimBonus(history.playerBonusId);
                        }}
                      >

                        <Text style={styles.bonusBtnTxt}>领取红利</Text>
                      </Touch>
                    )
                  );
                case 'Served':
                case 'Force to served':
                  return (
                    <View
                      style={styles.bonusBtnNull}
                    >

                      <Text style={styles.bonusBtnTxtNull}>已领取</Text>
                    </View>
                  );
                  break;
                case 'Waiting for release':
                  return (
                    <View
                      style={styles.bonusBtnNull}
                    >

                      <Text style={styles.bonusBtnTxtNull}>待派发</Text>
                    </View>
                  );
                default:
                  return null;
              }
            } else {
              return (
                <Touch
                  style={styles.bonusBtn}
                  onPress={() => {
                    console.log(this.props)
                    PiwikEvent("Promo Application", "Submit", `Apply_${this.props.Detail.promoId}_PromoPage`);
                    /***********检查是否已经登录 ********/
                    if (!ApiPort.UserLogin) {
                      Toasts.error('请先登陆');
                      Actions.Login()
                      return
                    }
                    if (this.props.from === "myPromoProcessing") {
                      if(!this.props.item){
                        console.log('缺少資料')
                        return;
                      }
                      Actions.PromotionsForm({ Detail: this.props.Detail, myPromoItem: this.props.item, fromPage: this.props.fromPage || "" })
                      return;
                    }
                    if (this.props.from === "freeBet") {
                      Actions.FreebetSetting({
                        promotionsDetail: this.props.item,
                        getPromotionsApplications: () => {
                          this.props.getFreePromotions()
                        }
                      })
                      return
                    }
                    if (promoType == 'Bonus') {
                      this.checkBalance();
                      return
                    } else if (promoType == 'Manual') {
                      // Actions.pop();
                      this.checkBalance();
                    }
                  }}
                >
    
                  <Text style={styles.bonusBtnTxt}>
                    {this.props.from === "freeBet" ? "立即领取" : this.props.from === "myPromoProcessing"? "查看已提交资料" : "立即申请"}
                  </Text>
                </Touch>
              )
            }
          })()}
        </View>
        {/*-------------------------------取消优惠弹窗 选择取消的原因 -----------------------------------*/}

        <Modal
          animationType="none"
          transparent={false}
          visible={this.state.shareModal}
          onRequestClose={() => {
          }}
        >
          <View style={[styles.modalMaster, {justifyContent: "flex-end"}]}>
            <View style={styles.GameDetailSharePopupTopBox}>
              {shareModalToast && (
                <ToastSuccess text={shareModalText} />
              )}
              <ViewShot ref={this.ViewShotRef} options={{ fileName: `${this.state.detail.promoTitle}.png`, format: "png" }} style={styles.GameDetailSharePopupShareBox}>
                <ImageBackground
                  style={styles.GameDetailSharePopupShareBoxTop}
                  resizeMode="stretch"
                  imageStyle={{	borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                  source={{ uri: this.state.detail.image }}
                />
                <View style={styles.GameDetailSharePopupShareBoxBottom}>
                  <View style={styles.GameDetailSharePopupShareBoxBottomLeft}>
                    <Text style={styles.ShareLeagueName2}>{this.state.detail.promoTitle}</Text>
                    <Text style={styles.ShareVS2}>
                      活动时间（北京时间）： {"\n"}
                      {moment(startDate).format('YYYY年MM月DD日 HH:mm')} - {moment(endDate).format('YYYY年MM月DD日 HH:mm')}
                    </Text>

                  </View>
                  <View style={styles.GameDetailSharePopupShareBoxBottomRight}>
                    <QRCodeA
                      value={this.getShareUrl()}
                      size={75}
                      bgColor="#FFF"
                    />
                  </View>
                </View>
              </ViewShot>
            </View>
            <View style={styles.GameDetailSharePopupBottomBox}>
              <View style={styles.GameDetailSharePopupBottomBoxTop}>
                <Touch
                  style={styles.ShareButtonBox}
                  onPress={() => {
                    this.copy(this.getShareUrl());
                  }}
                >
                  <View style={styles.ShareButton}>
                    <Image resizeMode='stretch' source={require('../../../../containers/SbSports/images/sbshare/shareCopy.png')} style={{ width: 22, height: 22 }} />
                  </View>
                  <Text style={styles.ShareText}>复制链接</Text>
                </Touch>
                <Touch
                  style={styles.ShareButtonBox}
                  onPress={() => {
                    this.downloadShareImage();
                  }}
                >
                  <View style={styles.ShareButton}>
                    <Image resizeMode='stretch' source={require('../../../../containers/SbSports/images/sbshare/shareDownload.png')} style={{ width: 22, height: 22 }} />
                  </View>
                  <Text style={styles.ShareText}>下载图片</Text>
                </Touch>
              </View>
              <View style={styles.GameDetailSharePopupBottomBoxBottom}>
                <Touch
                  onPress={()=>{
                    this.setState({
                      shareModal: false
                    })
                  }}
                >
                  <Text style={styles.ShareCancelText}>取消</Text>
                </Touch>
                <View style={styles.ShareCancelBar}/>
              </View>
            </View>
          </View>
        </Modal>
        
        <Modal
          animationType="none"
          transparent={true}
          visible={Todeposit}
          onRequestClose={() => {
          }}
        >
          <View style={styles.modalMaster}>
            <View style={styles.modalView}>
              <View style={styles.modalTitle}>
                <Text style={styles.modalTitleTxt}>余额不足</Text>
              </View>
              <Text style={{ lineHeight: 70, textAlign: 'center', color: '#000' }}>您的余额不足，请马上存款。</Text>
              <View style={styles.modalBtn}>
                <Touch onPress={() => {
                  this.setState({ Todeposit: false })
                }} style={styles.modalBtnL}>
                  <Text style={{ color: '#00A6FF' }}>关闭</Text>
                </Touch>
                <Touch onPress={() => {
                  this.setState({ Todeposit: false }, () => {
                    Actions.pop();
                    Actions.DepositCenter({ froms: 'promotions', promotionsDetail: this.props.Detail });
                    // PiwikEvent('Promo Application', 'Submit', `Apply_(${this.props.Detail.contentId})_EUROPage`)
                  })
                }} style={styles.modalBtnR}>
                  <Text style={{ color: '#fff' }}>存款</Text>
                </Touch>
              </View>
            </View>
          </View>
        </Modal>
        {/* <Modal closable={false} className="Proms" title="余额不足" visible={Todeposit}>
					<p className="txt">您的余额不足，请马上存款。</p>
					<div className="flex justify-around">
						<div
							className="Btn-Common"
							onClick={() => {
								this.setState({
									Todeposit: false
								});
							}}
						>
							关闭
						</div>
						<div
							className="Btn-Common active"
							onClick={() => {
								window.location.href = `${window.location
									.origin}/deposit?origin=ec2021&id=${bonusProductList[0]
										.bonusID}&wallet=${bonusProductList[0].bonusProduct}`;
							}}
						>
							存款
						</div>
					</div>
				</Modal> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalMaster: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalBtn: {
    width: width * 0.8,
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

  webViewStyle: {
    flex: 1,
    // backgroundColor: "#EFEFF4",
    backgroundColor: 'transparent',
    borderWidth: 0
    // width: width,
    // height: height,
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
  bonusBtnTxt: {
    textAlign: 'center',
    lineHeight: 44,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  bonusBtnTxtNull: {
    textAlign: 'center',
    lineHeight: 44,
    color: '#BCBEC3',
    fontWeight: 'bold',
    fontSize: 16
  },
  bonusBtn: {
    backgroundColor: '#00A6FF',
    width: width - 30,
    borderRadius: 5,
  },
  bonusBtnOk: {
    backgroundColor: '#0CCC3C',
    width: width - 30,
    borderRadius: 10,
    height: 44
  },
  bonusBtnNull: {
    backgroundColor: '#EFEFF4',
    width: width - 30,
    borderRadius: 5,
    height: 44
  },
  progressBar: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#E0E0E0',
    height: 10,
    width: width - 30,
    borderRadius: 50,
  },
  Progress: {
    backgroundColor: '#00A6FF',
    height: 10,
    borderRadius: 50,
  },
  progressTxt: {
    width: width - 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topNav: {
    width: width,
    height: Platform.OS === "ios" ? 44 : 50,
    backgroundColor: "#00a6ff",
    display: "flex",
    justifyContent: 'space-between',
    alignItems: "center",
    flexDirection: "row",
  },
  GameDetailSharePopupTopBox: {
    flex: 1,
    width: width,
    height: 'auto',
    backgroundColor: '#00000080',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  GameDetailSharePopupShareBox: {
    width: 0.829 * width,
    height: (0.315 * width)+135,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  GameDetailSharePopupShareBoxTop: {
    width: 0.829 * width,
    height: 0.315 * width,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 25,
    paddingHorizontal: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  GameDetailSharePopupShareBoxTopTeamBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  // ShareTeamImage: {
  // 	height: 40,
  // },
  ShareTeamName: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 17,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  GameDetailSharePopupShareBoxTopLeagueBox: {
    flex: 1.5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
  },
  ShareLeagueName: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 17,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  ShareVS: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 22,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  GameDetailSharePopupShareBoxBottom: {
    width: 0.829 * width,
    height: 130,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  GameDetailSharePopupShareBoxBottomLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    paddingRight: 8,
  },
  ShareLeagueName2: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    lineHeight: 22,
  },
  ShareVS2: {
    marginTop: 8,
    fontSize: 12,
    color: '#666666',
    lineHeight: 17,
  },
  GameDetailSharePopupShareBoxBottomRight: {
    width: 80,
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  GameDetailSharePopupBottomBox: {
    width: width,
    height: 208,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  GameDetailSharePopupBottomBoxTop: {
    width: width,
    height: 118,
    backgroundColor: '#EFEFF4',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ShareButtonBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 24,
  },
  ShareButton: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // svg: {
    // 	width: 24,
    // 	height: 24,
    // }
  },
  ShareText: {
    fontSize: 12,
    color: '#222222',
    lineHeight: 22,
  },
  GameDetailSharePopupBottomBoxBottom: {
    width: width,
    height: 90,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ShareCancelText: {
    marginTop: 24,
    marginBottom: 31,
    fontSize: 16,
    color: '#00A6FF',
    lineHeight: 22,
  },
  ShareCancelBar: {
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: Platform.OS === 'ios' ? '#00000000' : '#000000', //處理iphone下巴問題
  },
})

const mapStateToProps = (state) => ({
  userInfo: state.userInfo
});
const mapDispatchToProps = {
  userInfo_getBalanceAll: (forceUpdate = false) => ACTION_UserInfo_getBalanceAll(forceUpdate)
};

export default connect(mapStateToProps, mapDispatchToProps)(PromotionsDetail);
