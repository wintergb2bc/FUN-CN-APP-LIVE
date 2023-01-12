import React from 'react'
import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { toThousands } from '../../../../actions/Reg'
import * as Animatable from 'react-native-animatable'
import { Toast } from 'antd-mobile-rn'
import { Actions } from 'react-native-router-flux'
import { Toasts } from "../../../../containers/Toast";

const { width, height } = Dimensions.get('window')
const AnimatableView = Animatable.View
import ModalDropdown from 'react-native-modal-dropdown';
import ModalDropdownArrow from '../../../../containers/Common/ModalDropdownArrow'
class FreebetSettingContainer extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    let promotionsDetail = this.props.promotionsDetail
    let bonusData = promotionsDetail.bonusData || []
    this.state = {
      balanceInforIndex: bonusData.length !== 0 ? 0 : -99,
      arrowFlag: false,
      balanceInfor: [],
      promotionsDetail,
      isShowModalFlag1: false,
      isShowModalFlag2: false,
      isShowModalFlag3: false
    }
  }

  componentDidMount() {
    if (this.props.userInfo.allBalance.length) {
      this.setState({
        balanceInfor: this.props.userInfo.allBalance.filter(v => !['TOTALBAL', 'MAIN'].includes(v.category.toLocaleUpperCase()))
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.userInfo.allBalance.length) {
      this.setState({
        balanceInfor: nextProps.userInfo.allBalance.filter(v => !['TOTALBAL', 'MAIN'].includes(v.category.toLocaleUpperCase()))
      })
    }
  }

  createWalletList(item) {
    const { balanceInfor } = this.state
    let balanceInforItem = balanceInfor.find(v => v.name.toLocaleUpperCase() == item.wallet.toLocaleUpperCase())
    return <TouchableOpacity style={styles.WalletModalDropdownList}>
      <View
        style={[styles.balanceLeftCircle, { backgroundColor: balanceInforItem ? balanceInforItem.color : '#C1DFFF' }]}></View>
      <Text
        style={[styles.WalletModalDropdownListText, { color: '#000' }]}>{item.walletLocalizedName}</Text>
    </TouchableOpacity>
  }

  changeArrowStatus(arrowFlag) {
    this.setState({
      arrowFlag
    })
  }

  submitMemberInfor() {
    this.setState({
      isShowModalFlag1: false
    })
    const { balanceInfor, balanceInforIndex, promotionsDetail } = this.state
    if(balanceInforIndex === -99){
      Toasts.fail("Error")
      return;
    }
    let params = {
      "blackBox": E2Backbox,
      "bonusId": promotionsDetail.bonusData[balanceInforIndex].id,
      "amount": promotionsDetail.bonusData[balanceInforIndex].releaseValue,
      "bonusMode": "Transfer",
      "targetWallet": promotionsDetail.bonusData[balanceInforIndex].wallet,
      "transferBonus": {
        "isFreeBet": true
      }
    }

    Toast.loading('加载中...', 200000)
    fetchRequest(ApiPort.BonusApplications, 'POST', params).then(data => {
      Toast.hide()
      if (data) {
        const res = data.result
        let bonusResult = res.bonusResult || { message: '' }

        if (bonusResult.message.toLocaleUpperCase() == 'SUCCESS') {
          // Toast.success(res.message, 1.5)
          this.setState({
            isShowModalFlag2: true
          })
          this.props.getPromotionsApplications && this.props.getPromotionsApplications();
        } else {
          // Toast.fail(res.message, 1.5)
          this.setState({
            isShowModalFlag3: true
          })
        }
      }
    }).catch(err => {
      Toast.hide();
      this.setState({
        isShowModalFlag3: true
      })
    })
  }

  render() {
    const {
      promotionsDetail,
      balanceInfor,
      arrowFlag,
      balanceInforIndex,
      isShowModalFlag1,
      isShowModalFlag2,
      isShowModalFlag3
    } = this.state
    console.log(this.state)
    const { bonusData } = promotionsDetail;
    return <View style={[styles.viewContainer, { backgroundColor: '#EFEFF4' }]}>
      <Modal animationType='fade' transparent={true} visible={isShowModalFlag1}>
        <View style={[styles.modalContainer]}>
          <View style={[styles.modalBox, { backgroundColor: '#fff' }]}>
            <View style={[styles.modalTop, { backgroundColor: '#00A6FF' }]}>
              <Text style={styles.modalTopText}>温馨提示</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.reasonText, { color: '#333' }]}>
                请注意，点击确认后，钱包余额将被暂时锁定 无法转出，直到满足流水要求为止。
              </Text>

              <View style={styles.modalBtnBox}>
                <TouchableOpacity style={[styles.modalBtn, { borderColor: '#00A6FF' }]} onPress={() => {
                  this.setState({
                    isShowModalFlag1: false
                  })
                }}>
                  <Text style={[styles.modalBtnText, { color: '#00A6FF' }]}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#00A6FF', borderColor: '#00A6FF' }]}
                                  onPress={this.submitMemberInfor.bind(this)}
                >
                  <Text style={[styles.modalBtnText, { color: '#fff', fontWeight: 'bold', }]}>确认</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType='fade' transparent={true} visible={isShowModalFlag2}>
        <View style={[styles.modalContainer]}>
          <View style={[styles.modalBox, { backgroundColor: '#fff' }]}>

            <View style={[styles.modalBody, { alignItems: 'center' }]}>
              <Image
                style={{ height: 48, width: 48, marginBottom: 16 }}
                source={require('../../../../images/icon/checkCircle.png')}
                resizeMode='stretch'/>
              <Text style={{
                color: '#333333',
                fontSize: 20,
                marginBottom: 4,
                textAlign: 'center',
                fontWeight: 'bold'
              }}>领取成功</Text>
              <Text style={[styles.reasonText, { color: '#666' }]}>已申请该优惠</Text>

              <View style={styles.modalBtnBox}>
                <TouchableOpacity style={[styles.modalBtn, { borderColor: '#00A6FF', marginRight: 11 }]}
                                  onPress={() => {
                                    this.setState({
                                      isShowModalFlag2: false
                                    })
                                  }}>
                  <Text style={[styles.modalBtnText, { color: '#00A6FF' }]}>关闭</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#00A6FF', borderColor: '#00A6FF' }]}
                                  onPress={() => {
                                    this.setState({
                                      isShowModalFlag2: false
                                    })
                                    Actions.promotion({
                                      tabIndex: 0
                                    })
                                  }}
                >
                  <Text style={[styles.modalBtnText, { color: '#fff', fontWeight: 'bold', }]}>我的优惠</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType='fade' transparent={true} visible={isShowModalFlag3}>
        <View style={[styles.modalContainer]}>
          <View style={[styles.modalBox, { backgroundColor: '#fff' }]}>

            <View style={[styles.modalBody, { alignItems: 'center' }]}>
              <Image
                style={{ height: 48, width: 48, marginBottom: 16 }}
                source={require('../../../../images/icon/errorCircle.png')}
                resizeMode='stretch'/>
              <Text style={{
                color: '#333333',
                fontSize: 20,
                marginBottom: 4,
                textAlign: 'center',
                fontWeight: 'bold'
              }}>无法领取</Text>
              <Text style={[styles.reasonText, { color: '#666' }]}>发生错误，请联系在线客服获取协助</Text>

              <View style={styles.modalBtnBox}>
                <TouchableOpacity style={[styles.modalBtn, { borderColor: '#00A6FF', marginRight: 11 }]}
                                  onPress={() => {
                                    this.setState({
                                      isShowModalFlag3: false
                                    });
                                    LiveChatOpenGlobe();
                                  }}>
                  <Text style={[styles.modalBtnText, { color: '#00A6FF' }]}>联系在线客服</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#00A6FF', borderColor: '#00A6FF' }]}
                                  onPress={() => {
                                    this.setState({
                                      isShowModalFlag3: false
                                    });
                                  }}
                >
                  <Text style={[styles.modalBtnText, { color: '#fff', fontWeight: 'bold', }]}>好的</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={{
            backgroundColor: '#fff',
            paddingHorizontal: 15,
            paddingVertical: 15,
            borderRadius: 8,
          }}>
            <Text style={{
              textAlign: 'center',
              color: '#3C3C3C',
              fontWeight: '500',
              fontSize: 18
            }}>{promotionsDetail.promoTitle}</Text>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingHorizontal: 20 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#999999', fontSize: 12 }}>投注金额</Text>
                <Text style={{
                  color: '#222',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginTop: 6
                }}>￥{balanceInforIndex >= 0 ? toThousands(bonusData[balanceInforIndex].releaseValue) : toThousands(0)}</Text>
              </View>
              <View style={{ height: 60, width: 2, backgroundColor: '#F2F2F2' }}></View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#999999', fontSize: 12 }}>所需流水</Text>
                <Text style={{
                  color: '#222',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginTop: 6
                }}>{balanceInforIndex >= 0 ? toThousands(bonusData[balanceInforIndex].givenAmount) : toThousands(0)}</Text>
              </View>
            </View>
          </View>
        </View>
        {
          Array.isArray(bonusData) && balanceInfor.length > 0 && promotionsDetail.bonusData.length > 0 &&
          <View>
            <Text style={{color: "#333333" ,fontSize: 14, fontWeight: 'bold', marginTop: 24, marginBottom:8}}>产品钱包</Text>
            <ModalDropdown
              animated={true}
              options={promotionsDetail.bonusData}
              renderRow={this.createWalletList.bind(this)}
              style={[styles.WalletModalDropdown, { borderBottomColor:  '#f6f6f6'  }]}
              onDropdownWillShow={this.changeArrowStatus.bind(this, true)}
              onDropdownWillHide={this.changeArrowStatus.bind(this, false)}
              onSelect={balanceInforIndex => {
                this.setState({
                  balanceInforIndex
                })
              }}
              dropdownStyle={[styles.WalletDropdownStyle, { backgroundColor: '#fff'  }]}
            >
              <View style={[styles.targetWalletBox, { backgroundColor:'#fff', borderColor: '#F2F2F2' }]}>
                <View style={styles.lbimgIconBox}>

                  {/*<Image*/}
                  {/*  resizeMode='stretch'*/}
                  {/*  source={require('./../../../images/promotion/preferential/preferentialRecord/wallet.png')}*/}
                  {/*  style={styles.promotionListNo}*/}
                  {/*></Image>*/}


                  {/* {
                                        balanceInforIndex != -99 && <View style={[styles.balanceLeftCircle, {
                                            backgroundColor: balanceInfor.find(v => v.name.toLocaleUpperCase() == promotionsDetail.bonusData[balanceInforIndex].wallet.toLocaleUpperCase()) ? balanceInfor.find(v => v.name.toLocaleUpperCase() == promotionsDetail.bonusData[balanceInforIndex].wallet.toLocaleUpperCase()).color : '#C1DFFF'
                                        }]}></View>
                                    } */}
                  <Text style={{ color: balanceInforIndex != -99 ? '#333' : '#B7B7B7' }}>
                    {
                      balanceInforIndex != -99
                        ?
                        (
                          balanceInfor.find(v => v.name.toLocaleUpperCase() == promotionsDetail.bonusData[balanceInforIndex].wallet.toLocaleUpperCase())
                            ?
                            balanceInfor.find(v => v.name.toLocaleUpperCase() == promotionsDetail.bonusData[balanceInforIndex].wallet.toLocaleUpperCase()).localizedName
                            :
                            promotionsDetail.bonusData[balanceInforIndex].wallet.toLocaleUpperCase()
                        )
                        :
                        '请选择钱包'
                    }
                  </Text>
                </View>
                {/*<ModalDropdownArrow arrowFlag={arrowFlag} />*/}
                <Image resizeMode='stretch' source={arrowFlag ? require('../../../../images/up.png') : require('../../../../images/down.png')} style={{ width: 16, height: 16 }} />
              </View>
            </ModalDropdown>

          </View>
        }
        <TouchableOpacity
          style={[styles.closeBtnWrap, { backgroundColor: "#00A6FF" }]}
          onPress={() => {
            // if (balanceInforIndex < 0) return
            this.setState({
              isShowModalFlag1: true
            })
          }}>
          <Text style={styles.closeBtnText}>提交</Text>
        </TouchableOpacity>
      </View>
    </View>
  }
}


const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FreebetSettingContainer);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 10
  },
  WalletModalDropdownList: {
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 20
  },
  balanceLeftCircle: {
    width: 8,
    height: 8,
    borderRadius: 100,
    marginRight: 8
  },
  WalletModalDropdown: {
    height: 40,
    borderBottomColor: '#f6f6f6',
    borderBottomWidth: 1,
    width: width - 20,
  },
  WalletDropdownStyle: {
    width: width - 20,
    shadowColor: '#DADADA',
    shadowRadius: 4,
    shadowOpacity: .6,
    shadowOffset: { width: 2, height: 2 },
    elevation: 4,
  },
  targetWalletBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    height: 44,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F2F2F2',
  },
  lbimgIconBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  closeBtnWrap: {
    // width: '90%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 24
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  modalContainer: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .6)'
  },
  modalBox: {
    backgroundColor: '#EFEFEF',
    borderRadius: 16,
    width: width * .9,
    overflow: 'hidden'
  },
  modalTop: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25AAE1'
  },
  modalTopText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBody: {
    paddingTop: 24,
    paddingBottom: 25,
    paddingHorizontal: 20
  },
  modalBtnBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24
  },
  modalBtn: {
    height: 44,
    width: (width * .9 - 40) * .48,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  modalBtnText: {
    fontSize: 16
  },
  reasonText: {
    textAlign: 'left',
    fontSize: 14,
    lineHeight: 20
  },
  promotionListNo: {
    width: 26,
    height: 22,
    marginRight: 5
  },
  toreturnModalDropdownText: {
    color: '#000'
  }
})
