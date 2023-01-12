import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Toast, } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import React from 'react';

class PromotionsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activetab: 0,
      message: '',
      success: false
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  ApplicationsBonus = (ID) => {
    const { promoTitle, promoId, status, manualRemark, bonusId } = this.props.Detail;
    PiwikEvent("Promo Application", "Submit", `Apply_${ID}_PromoPage`);
    const { contacts } = this.props.userInfo.memberInfo;
    let ContactsPhone = contacts.find((item) => item.contactType == 'Phone')?.contact;
    let ContactsEmail = contacts.find((item) => item.contactType == 'Email')?.contact;

    let postData = {
      memberCode: window.memberCode,
      promoId: promoId * 1,
      applySite: siteId,
      contactNo: ContactsPhone,
      remarks: this.state.message,
      emailAddress: ContactsEmail,
      currency: "CNY"
    }


    Toast.loading('请稍候...');
    fetchRequest(ApiPort.ApplicationsBonus, 'POST', postData)
      .then((res) => {
        Toast.hide();
        if (res) {
          if (res.isSuccess && res.result) {
            this.setState({
              success: true
            });
          } else {
            Toast.fail(res.message);
          }
        }
      })
      .catch((error) => {
        Toast.hide();
        console.log(error);
      });
  };
  
  renderUI = ({promoTitle, promoId, firstName, ContactsEmail, ContactsPhone, remark, statuscheck}) => {
    console.log({promoTitle, promoId, firstName, ContactsEmail, ContactsPhone, remark, statuscheck})
    const { message, success } = this.state;
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titles}>{promoTitle}</Text>
        <View>
          <Text style={styles.txt}>用户名</Text>
          <View style={styles.viewInput}>
            <Text style={{ color: '#202939' }}>{firstName}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.txt}>电子邮箱</Text>
          <View style={styles.viewInput}>
            <Text
              style={{ color: '#202939' }}>{
              `*******${ContactsEmail.split('@')[0].slice(-3)}@${ContactsEmail.split('@')[1]}`
            }</Text>
          </View>

          <View style={[styles.viewInput, { backgroundColor: '#F7F7FC', marginTop: 6 }]}>
            <Touch style={{ color: '#666666', fontSize: 12 }} onPress={() => {
              LiveChatOpenGlobe()
            }}>
              <Text style={{ color: '#666666', fontSize: 12 }}>如果您想更新电子邮箱，请联系我们的<Text
                style={{ color: '#00a6ff', textDecorationLine: 'underline', fontSize: 12 }}>在线客服</Text>。
              </Text>
            </Touch>
          </View>
        </View>
        <View>
          <Text style={styles.txt}>联系电话</Text>
          <View style={styles.viewInput}>
            <Text style={{ color: '#202939' }}>{'******' + ContactsPhone.slice(-4)}</Text>
          </View>
          <Touch style={[styles.viewInput, { backgroundColor: '#F7F7FC', marginTop: 6 }]} onPress={() => {
            LiveChatOpenGlobe()
          }}>
            <Text style={{ color: '#666666', fontSize: 12 }}>如果您想更新联系电话，请联系我们的<Text
              style={{ color: '#00a6ff', textDecorationLine: 'underline', fontSize: 12 }}>在线客服</Text>。
            </Text>
          </Touch>
        </View>
        <View>
          <Text style={styles.txt}>留言</Text>
          <View style={styles.inputBg}>
            <TextInput
              editable={!statuscheck ? true : false}
              style={styles.input}
              underlineColorAndroid="transparent"
              value={!statuscheck ? message : remark}
              placeholder="请输入留言"
              placeholderTextColor="#666666"
              textContentType="username"
              onChangeText={message => {
                this.setState({ message });
              }}
            />
          </View>
        </View>
        {!statuscheck && (
          <Touch
            style={styles.bonusBtn}
            onPress={() => {
              this.ApplicationsBonus(promoId);
            }}
          >
            <Text style={styles.bonusBtnTxt}>提交</Text>
          </Touch>
        )}
        <Modal
          animationType="none"
          transparent={true}
          visible={success}
          onRequestClose={() => {
          }}
        >
          <View style={styles.modalMaster}>
            <View style={styles.modalView}>
              <Image style={{ width: 48, height: 48 }} source={require('../../../../images/icon-done.png')}/>
              <Text style={{
                lineHeight: 30,
                textAlign: 'center',
                color: '#202939',
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 16,
                marginBottom: 8
              }}>完成申请</Text>
              <Text style={{
                lineHeight: 30,
                textAlign: 'center',
                color: '#666',
                fontSize: 16,
                marginBottom: 24
              }}>请到“我的优惠”页面查看</Text>
              <View style={styles.modalBtn}>
                <Touch onPress={() => {
                  this.setState({ success: false })
                }} style={styles.modalBtnL}>
                  <Text style={{ color: '#00A6FF' }}>关闭</Text>
                </Touch>
                <Touch onPress={() => {
                  this.setState({ success: false }, () => {
                    if(this.props.fromPage === "sports" && !isGameLock){
                      Actions.promotionSBWrap();
                    }else{
                      Actions.promotion(); 
                    }
                    window.PromotionsMyType && window.PromotionsMyType();
                  })
                }} style={styles.modalBtnR}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>我的优惠</Text>
                </Touch>
              </View>
            </View>
          </View>
        </Modal>
        {/* <Modal className="Proms" visible={success}>
        <div className="Content">
          <Image src="/img/ec2021/svg/success.svg" />
          <big>完成申请</big>
          <p>请到“我的优惠”页面查看</p>
        </div>
        <div className="flex justify-around">
          <div
            className="Btn-Common"
            onClick={() => {
              this.setState({
                success: false
              });
            }}
          >
            关闭
          </div>
          <div
            className="Btn-Common active"
            onClick={() => {
              Router.push({
                pathname: '/',
                query: { tab: 'promo', key: 1 }
              });
            }}
          >
            我的优惠
          </div>
        </div>
      </Modal> */}
      </ScrollView>
    )
  }

  render() {
    const fromMyPromo = this.props.from === "myPromo";
    const memberInfo = this.props.userInfo.memberInfo;
    let ContactsEmail = fromMyPromo ? this.props.myPromoItem?.emailAddress : memberInfo.contacts?.find((item) => item.contactType == 'Email')?.contact;
    let ContactsPhone = fromMyPromo ? this.props.myPromoItem?.contactNo : memberInfo.contacts?.find((item) => item.contactType == 'Phone')?.contact;
    {
      /* ***************************************
      如果是 Processing 只可以查看资料 不可编辑
      **************************************** */
    }
    // 我的優惠過來 並且是處理中
    let statuscheck = fromMyPromo && this.props.myPromoItem?.status == 'Processing';
    const data = {
      promoTitle: fromMyPromo ? this.props.myPromoItem?.promotionTitle : this.props.Detail?.promoTitle,
      firstName: memberInfo.firstName || "",
      promoId: fromMyPromo ? this.props.myPromoItem?.promotionId : this.props.Detail?.promoId,
      remark: fromMyPromo ? this.props.myPromoItem?.remarks : "",
      ContactsEmail: ContactsEmail,
      ContactsPhone: ContactsPhone,
      statuscheck: statuscheck
    };
    
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', padding: 15, }}>
        {this.renderUI(data)}
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
    backgroundColor: 'rgba(0, 0, 0,0.5)',
  },
  modalView: {
    width: width * 0.9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingBottom: 24,
    paddingTop: 24,
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


  titles: {
    paddingBottom: 15,
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
  txt: {
    color: '#666666',
    lineHeight: 40,
  },
  viewInput: {
    backgroundColor: '#EFEFF4',
    borderRadius: 8,
    width: width - 30,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 15,
  },
  inputBg: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E6EB',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: width - 30,
  },
  input: {
    width: width - 30,
    paddingLeft: 15,
    height: 40,
    color: '#202939',
    textAlign: 'left',
  },
  bonusBtn: {
    backgroundColor: '#00A6FF',
    width: width - 30,
    borderRadius: 5,
    marginTop: 30
  },
  bonusBtnTxt: {
    textAlign: 'center',
    lineHeight: 40,
    color: '#fff',
    fontWeight: 'bold'
  },
})
const mapStateToProps = (state) => ({
  userInfo: state.userInfo
});
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(PromotionsForm);
