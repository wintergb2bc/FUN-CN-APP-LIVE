import React from 'react';
import {
  ActivityIndicator, AppState,
  Clipboard,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Toast } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import Modals from 'react-native-modal';
import QRCodeA from 'react-native-qrcode-svg';
import ImagePicker from 'react-native-image-picker';
import RNHeicConverter from 'react-native-heic-converter';
import { PPBPrompt } from '../Common/Deposit/depositPrompt';
import CryptoJS from "crypto-js";
import ViewShot from "react-native-view-shot";
import PiwikAction from "../../lib/utils/piwik";

//网银转账第二步，PPB
const {
  width, height
} = Dimensions.get('window');


class PPBSecondStep extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      uploadData: '',//上传图片信息 
      uploadMsg: '',
      upload: false,
      activeDeposit: this.props.activeDeposit,
      secondStepData: this.props.secondStepData,
      bankDetails: '',
      Countdown: '05:00',
      depositNext: false,
      confirmModal: false,
      copyCenter: '',
      amount: 0,
      QRLink: '',
      newURL: '', // qrcode link
    };
    this.getNewUrl = this.getNewUrl.bind(this)
  }

  componentDidMount() {
    this.getNewUrl(); // qrcode 加密
    this.getAmount();
  }

  componentWillMount(props) {

  }

  componentWillUnmount() {
    this.Countdowns && clearInterval(this.Countdowns);
  }

  getNewUrl() { // qrcode 加密
    const { submittedAt, vendorDepositBankDetails } = this.state.secondStepData;
    const subbmitDate = submittedAt.split('.')[0]
    const rawStr = `submittedAt=${subbmitDate}&` +
      `transferAmount=${encodeURIComponent(vendorDepositBankDetails.transferAmount || '')}&` +
      `bankName=${encodeURIComponent(vendorDepositBankDetails.bankName || '')}&` +
      `bankAccountName=${encodeURIComponent(vendorDepositBankDetails.bankAccountName || '')}&` +
      `bankAccountNumber=${encodeURIComponent(vendorDepositBankDetails.bankAccountNumber || '')}&` +
      `bankProvince=${encodeURIComponent(vendorDepositBankDetails.bankProvince || '')}&` +
      `bankCity=${encodeURIComponent(vendorDepositBankDetails.bankCity || '')}&` +
      `bankBranch=${encodeURIComponent(vendorDepositBankDetails.bankBranch || '')}&` +
      `pgRemark=${encodeURIComponent(vendorDepositBankDetails.pgRemark || '')}`
    //encrypt
    const wordArray = CryptoJS.enc.Utf8.parse(rawStr)
    const base64 = CryptoJS.enc.Base64.stringify(wordArray)

    //decrypt
    // const parsedWordArray = CryptoJS.enc.Base64.parse(base64);
    // const parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
    // console.log('parsedStr', parsedStr)
    // console.log('test', `${SBTDomain}/zh/mobile/depositInfo?data=${base64}`)

    return this.setState({ newURL: `${SBTDomain}/cn/mobile/Deposit/DetailsInfo?data=${base64}` })
  }

  getAmount() {
    let amount = 0;
    let bankDetails = '';
    let QRLink = '';
    let depositNext = false;
    if (this.state.secondStepData && this.state.secondStepData.vendorDepositBankDetails) {
      amount = this.state.secondStepData.vendorDepositBankDetails.transferAmount;
      bankDetails = this.state.secondStepData.vendorDepositBankDetails;
      QRLink = this.state.secondStepData.vendorDepositBankDetailsQRLink;
      this.Countdown();
    } else {
      amount = this.state.secondStepData.uniqueAmount;
      depositNext = true;
    }
    this.setState({ amount, bankDetails, QRLink, depositNext });
  }


  //复制
  copy(txt, id) {
    try {
      const value = String(txt);
      Clipboard.setString(value);
      Toasts.success("已复制", 2);
      id && this.setState({ copyCenter: id });
    } catch (error) {
      console.log(error);

    }

  }

  //倒计时处理
  Countdown(key) {
    const { TimeoutSeconds } = this.props
    this.Countdowns && this.Countdowns === null;
    this.Countdowns && clearInterval(this.Countdowns);

    let time = TimeoutSeconds ? TimeoutSeconds : 300;
    //5分钟后时间戳,防止app后台setInterval没有执行，
    let afterMinutes5 = (new Date()).getTime() + (60 * 5 * 1000);

    let m, s, ms;
    this.Countdowns = setInterval(() => {
      if (this.props.TimeoutSeconds) {
        time--
        m = parseInt(time / 60).toString();
        s = time - m * 60;
      } else {
        time = parseInt((afterMinutes5 - (new Date().getTime())) / 1000);
        m = parseInt(time / 60).toString();
        s = time - m * 60;
      }

      // 要處理負數，因如用戶跳出app又跳回 時間超過會變負數
      const isEndOfTime = (m <= 0 && s <= 0);

      if (s < 10) {
        s = "0" + s.toString();
      }
      ms = m + ":" + s;
      if (m < 10) {
        ms = isEndOfTime ? '00:00' : '0' + m.toString() + ":" + s;
      }
      this.setState({ Countdown: ms });

      if (isEndOfTime) {
        this.setState({ confirmModal: true });
        clearInterval(this.Countdowns);
      }
    }, 1000);
  }

  //上传凭证图
  uploadAction() {

    const ImagePickerOption = {
      title: '选择图片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '选择照片',
      customButtons: [],
      cameraType: 'back',
      mediaType: Platform.OS === 'ios' ? 'photo' : 'mixed',
      videoQuality: 'high',
      durationLimit: 0,
      maxWidth: 1200,
      maxHeight: 2800,
      quality: 1,
      angle: 0,
      allowsEditing: false,
      noData: false,
      storageOptions: {
        cameraRoll: true,
        waitUntilSaved: true,
        skipBackup: true,
      },
      includeBase64: true,
      saveToPhotos: true
    };

    ImagePicker.showImagePicker(ImagePickerOption, response => {

      if (response.didCancel) {
      } else if (response.error) {
        // Alert.alert('Lỗi quyền hình ảnh', ImgPermissionsText)
        this.setState({ uploadMsg: 'sizeErr' });
      } else if (response.customButton) {
      } else {
        // let source = { uri: 'data:image/jpegbase64,' + response.data }
        if (Platform.OS === 'ios' && response.fileName && (response.fileName.endsWith('.heic') || response.fileName.endsWith('.HEIC') || response.fileName.endsWith('.heif') || response.fileName.endsWith('.HEIF'))) {
          RNHeicConverter.convert({ path: response.origURL }).then((data) => {
            const { success, path, error } = data;

            if (!error && success && path) {
              let name = response.fileName;
              name = name.replace(".heic", ".jpg");
              name = name.replace(".HEIC", ".jpg");
              name = name.replace(".heif", ".jpg");
              name = name.replace(".HEIF", ".jpg");
              let avatarSource = { uri: response.data };


              this.setState({ uploadData: { avatarName: name, avatarSource }, uploadMsg: 'success' });
            } else {
              this.setState({ uploadMsg: 'sizeErr' });
            }
          });
        } else {
          if (!response || !response.fileName || !response.fileSize || !response.data) {
            this.setState({ uploadMsg: 'sizeErr' });
            return;
          }
          let source = { uri: response.data };
          //后缀要求小写
          let idx = response.fileName.lastIndexOf('.');
          let newfileName = response.fileName.substring(0, idx) + response.fileName.substring(idx).toLowerCase();
          let avatarName = newfileName;
          let avatarSize = response.fileSize;
          let avatarSource = source;
          let fileSize = response.fileSize;
          //超过4M大小
          let fileImgFlag = !(response.fileSize <= 1024 * 1024 * 4 && ['JPG', 'PNG'].includes((response.fileName.split('.')[response.fileName.split('.').length - 1]).toLocaleUpperCase()));

          this.setState({ uploadData: { avatarName, avatarSource }, uploadMsg: fileImgFlag ? 'sizeErr' : 'success' });

        }

      }
    });
  }

  postUpload() {
    const { uploadMsg } = this.state;
    if (uploadMsg == '' || uploadMsg == 'apiErr' || uploadMsg == 'sizeErr') {
      return;
    }

    const { avatarSource, avatarName } = this.state.uploadData;
    this.setState({ uploadMsg: 'loding' });
    let params = {
      DepositID: this.state.secondStepData.transactionId,
      PaymentMethod: this.state.activeDeposit,
      FileName: avatarName,
      byteAttachment: avatarSource.uri,
      RequestedBy: userNameDB
    };

    fetchRequest(window.ApiPort.UploadAttachment, 'POST', params).then(data => {
      if (data.isSuccess) {
        this.setState({ upload: false, uploadMsg: 'success' });
        Toasts.success('存款凭证已上传');
      } else {
        this.setState({ uploadMsg: 'apiErr' });
      }
    }).catch(() => {
      this.setState({ uploadMsg: 'apiErr' });
    });
  }

  succesSsubmit() {
    console.log(this.state.secondStepData)
    const bankAccNum = this.state.secondStepData.vendorDepositBankDetails.bankAccountNumber || ""
    let data = {
      // depositingBankAcctNum: bankAccNum.substring(bankAccNum.length - 6, bankAccNum.length)
    };
    Toast.loading('提交中,请稍候...', 200);
    fetchRequest(`${ApiPort.ConfirmStep}transactionId=${this.state.secondStepData.transactionId}&`, 'POST', data)
      .then((data) => {
        Toast.hide();
        if (data.isSuccess) {
          this.Countdowns && clearInterval(this.Countdowns);
          this.setState({ depositNext: true });
        } else {
          Toast.fail('网络错误，请重试', 2);
        }
      })
      .catch(() => {
      });

  }

  render() {
    const {
      upload,
      uploadMsg,
      secondStepData,
      bankDetails,
      depositNext,
      Countdown,
      confirmModal,
      copyCenter,
      amount,
      newURL,
    } = this.state;
    console.log('newURL ', newURL)

    // console.log('this.props.checkcallbackDatethis.props.checkcallbackDate', this.props.checkcallbackDate)
    return (

      <View style={{ flex: 1 }}>
        {/* 上传凭证 图 */}
        <Modals
          isVisible={upload}
          backdropColor={'#000'}
          backdropOpacity={0.4}
          style={{ justifyContent: 'center', margin: 0, padding: 25 }}
          onBackdropPress={() => {
            this.setState({ upload: false });
          }}
        >
          <View style={styles.uploadModal}>
            {
              uploadMsg == 'loding' &&
              <View style={styles.lodingModal}>
                <View style={styles.protective} />
                <ActivityIndicator color="#fff" />
                <Text style={{ color: '#fff', paddingTop: 15 }}>文档上传中</Text>
                <Text style={{ color: '#fff', paddingTop: 5 }}>请稍等...</Text>
              </View>
            }
            <View style={{
              backgroundColor: '#00A6FF',
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              width: width - 50
            }}>
              <Text style={{ color: '#fff', lineHeight: 42, textAlign: 'center', fontSize: 17 }}>上传存款凭证</Text>
            </View>
            <Text style={{ paddingTop: 25, lineHeight: 21, color: '#666' }}>
              请上传存款凭证，仅接受 jpg 及 png 档案，且档案大小不得超过4MB。
            </Text>
            <Text style={{ color: '#000', width: width - 50, padding: 20 }}>存款凭证</Text>
            <View style={styles.uploadView}>
              <Text style={{ color: '#323232', width: width * 0.5, lineHeight: 45 }}
                numberOfLines={1}>{this.state.uploadData && this.state.uploadData.avatarName}</Text>
              <Touch style={styles.uploadBtn} onPress={() => {
                this.uploadAction();
              }}>
                <Text style={{ color: '#fff' }}>选择文档</Text>
              </Touch>
            </View>
            {
              uploadMsg == 'sizeErr' &&
              <Text style={styles.errTxt}>仅接受 jpg 及 png 档案，且档案大小不得超过4MB。</Text>
            }
            {
              uploadMsg == 'apiErr' &&
              <Text style={styles.errTxt}>上传失败由于未知的错误，请稍后再试</Text>
            }
            <View style={{ flexDirection: 'row' }}>
              <Touch onPress={() => {
                this.setState({ upload: false, uploadMsg: '', uploadData: '' });
              }} style={styles.modalBtnclose}>
                <Text style={{ color: '#00a6ff', textAlign: 'center', lineHeight: 40, fontSize: 16 }}>关闭</Text>
              </Touch>
              <Touch onPress={() => {
                this.postUpload();
              }} style={[styles.modalBtnok, { backgroundColor: uploadMsg == 'success' ? '#00A6FF' : '#EFEFF4' }]}>
                <Text style={{
                  color: uploadMsg == 'success' ? '#fff' : '#BCBEC3',
                  textAlign: 'center',
                  lineHeight: 42,
                  fontSize: 16
                }}>上传存款凭证</Text>
              </Touch>
            </View>
          </View>
        </Modals>
        {/* 已经成功存款 */}
        <Modals
          isVisible={confirmModal}
          backdropColor={'#000'}
          backdropOpacity={0.4}
          style={{ justifyContent: 'center', margin: 0, padding: 25 }}
        >
          <View style={styles.confirmModal}>
            <Text style={{ color: '#000', fontSize: 18, lineHeight: 35 }}>您是否已经成功存款?</Text>
            <Touch style={{
              backgroundColor: '#00A6FF',
              borderRadius: 8,
              width: width - 80,
              marginTop: 20,
              marginBottom: 15
            }} onPress={() => {
              this.setState({ confirmModal: false }, () => {
                this.succesSsubmit();
              });
            }}>
              <Text style={{ textAlign: 'center', lineHeight: 40, color: '#fff' }}>是，我已经成功存款</Text>
            </Touch>
            <Touch style={{ borderColor: '#00A6FF', borderRadius: 8, width: width - 80, borderWidth: 1 }}
              onPress={() => {
                this.setState({ confirmModal: false }, () => {
                  Actions.pop();
                });
              }}>
              <Text style={{ textAlign: 'center', lineHeight: 40, color: '#00A6FF' }}>否，我想提交新交易</Text>
            </Touch>
          </View>
        </Modals>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, padding: 15, backgroundColor: '#F2F2F2' }} contentInset={{ bottom: 50 }}
        >
          <View>
            {
              //存款银行卡信息展示，
              !depositNext &&
              <View style={{ flex: 1 }}>
                <View style={styles.descReceipt}>
                  <View style={styles.PPBDowmTime}>
                    <Text style={{ color: '#83630B', fontSize: 12 }}>请在 <Text
                      style={{ fontSize: 18, color: '#F11818' }}>{Countdown}</Text> 分钟内完成支付和点击“我已经成功存款”</Text>
                  </View>
                  <View style={styles.PPBamount}>
                    <Touch style={styles.PBBamountCopy} onPress={() => {
                      this.copy(amount, 'copyAmount');
                    }}>
                      <Text style={{ fontSize: 30, color: '#0CCC3C', paddingRight: 5 }}><Text
                        style={{ fontSize: 22 }}>￥</Text>{amount || ''}</Text>
                      <Image
                        resizeMode="stretch"
                        source={require("../../images/icon/copy.png")}
                        style={{ width: 16, height: 16 }}
                      />
                      {
                        copyCenter == 'copyAmount' &&
                        <Image
                          resizeMode="stretch"
                          source={require("../../images/check.png")}
                          style={styles.checkIcon}
                        />
                      }
                    </Touch>
                    <Text style={styles.descMsg}>请依照上方显示的金额进行转账</Text>
                  </View>
                  {
                    bankDetails != '' &&
                    <View>
                      <View style={styles.PPBbankList}>
                        <Text style={styles.PPBbankLabel}>银行名称</Text>
                        <Touch style={styles.PPBbankConter} onPress={() => {
                          this.copy(bankDetails.bankName, 'bankName');
                        }}>
                          <Text style={styles.PPBbankTxt}>{bankDetails.bankName || ''}</Text>
                          <Image
                            resizeMode="stretch"
                            source={require("../../images/icon/copy.png")}
                            style={{ width: 16, height: 16 }}
                          />
                          {
                            copyCenter == 'bankName' &&
                            <Image
                              resizeMode="stretch"
                              source={require("../../images/check.png")}
                              style={styles.checkIcon}
                            />
                          }
                        </Touch>
                      </View>
                      <View style={styles.PPBbankList}>
                        <Text style={styles.PPBbankLabel}>账号</Text>
                        <Touch style={styles.PPBbankConter} onPress={() => {
                          this.copy(bankDetails.bankAccountNumber, 'bankAccountNumber');
                        }}>
                          <Text style={styles.PPBbankTxt}>{bankDetails.bankAccountNumber || ''}</Text>
                          <Image
                            resizeMode="stretch"
                            source={require("../../images/icon/copy.png")}
                            style={{ width: 16, height: 16 }}
                          />
                          {
                            copyCenter == 'bankAccountNumber' &&
                            <Image
                              resizeMode="stretch"
                              source={require("../../images/check.png")}
                              style={styles.checkIcon}
                            />
                          }
                        </Touch>
                      </View>
                      <View style={styles.PPBbankList}>
                        <Text style={styles.PPBbankLabel}>账户名称</Text>
                        <Touch style={styles.PPBbankConter} onPress={() => {
                          this.copy(bankDetails.bankAccountName, 'bankAccountName');
                        }}>
                          <Text style={styles.PPBbankTxt}>{bankDetails.bankAccountName || ''}</Text>
                          <Image
                            resizeMode="stretch"
                            source={require("../../images/icon/copy.png")}
                            style={{ width: 16, height: 16 }}
                          />
                          {
                            copyCenter == 'bankAccountName' &&
                            <Image
                              resizeMode="stretch"
                              source={require("../../images/check.png")}
                              style={styles.checkIcon}
                            />
                          }
                        </Touch>
                      </View>
                      {
                        bankDetails.bankProvince != '' &&
                        <View style={styles.PPBbankList}>
                          <Text style={styles.PPBbankLabel}>省/自治区</Text>
                          <Touch style={styles.PPBbankConter} onPress={() => {
                            this.copy(bankDetails.bankProvince, 'bankProvince');
                          }}>
                            <Text style={styles.PPBbankTxt}>{bankDetails.bankProvince}</Text>
                            <Image
                              resizeMode="stretch"
                              source={require("../../images/icon/copy.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            {
                              copyCenter == 'bankProvince' &&
                              <Image
                                resizeMode="stretch"
                                source={require("../../images/check.png")}
                                style={styles.checkIcon}
                              />
                            }
                          </Touch>
                        </View>
                      }
                      {
                        bankDetails.bankCity != '' &&
                        <View style={styles.PPBbankList}>
                          <Text style={styles.PPBbankLabel}>城市/城镇</Text>
                          <Touch style={styles.PPBbankConter} onPress={() => {
                            this.copy(bankDetails.bankCity, 'bankCity');
                          }}>
                            <Text style={styles.PPBbankTxt}>{bankDetails.bankCity}</Text>
                            <Image
                              resizeMode="stretch"
                              source={require("../../images/icon/copy.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            {
                              copyCenter == 'bankCity' &&
                              <Image
                                resizeMode="stretch"
                                source={require("../../images/check.png")}
                                style={styles.checkIcon}
                              />
                            }
                          </Touch>
                        </View>
                      }
                      {
                        bankDetails.bankBranch != '' &&
                        <View style={styles.PPBbankList}>
                          <Text style={styles.PPBbankLabel}>分行</Text>
                          <Touch style={styles.PPBbankConter} onPress={() => {
                            this.copy(bankDetails.bankBranch, 'bankBranch');
                          }}>
                            <Text style={styles.PPBbankTxt}>{bankDetails.bankBranch}</Text>
                            <Image
                              resizeMode="stretch"
                              source={require("../../images/icon/copy.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            {
                              copyCenter == 'bankBranch' &&
                              <Image
                                resizeMode="stretch"
                                source={require("../../images/check.png")}
                                style={styles.checkIcon}
                              />
                            }
                          </Touch>
                        </View>
                      }

                      {/* 有附言的value，才會顯示，沒有則隱藏，適用在Step2 以及掃描QR code之後進入的頁面 */}
                      {!!(bankDetails.pgRemark) && (
                        <View style={styles.PPBbankList}>
                          <Text style={styles.PPBbankLabel}>附言/备注</Text>
                          <Touch style={styles.PPBbankConter} onPress={() => {
                            this.copy(bankDetails.pgRemark, 'pgRemark');
                          }}>
                            <Text style={styles.PPBbankTxt}>{bankDetails.pgRemark || ''}</Text>
                            <Image
                              resizeMode="stretch"
                              source={require("../../images/icon/copy.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            {
                              copyCenter == 'pgRemark' &&
                              <Image
                                resizeMode="stretch"
                                source={require("../../images/check.png")}
                                style={styles.checkIcon}
                              />
                            }
                          </Touch>
                        </View>
                      )}
                    </View>
                  }
                  {!!(bankDetails.pgRemark) && (
                    <Text style={styles.descMsg}>
                      转账前请仔细核对以上所有信息，如有要求填写【附言】或【备注】，请务必填写，否则存款将无法到账。
                    </Text>
                  )}
                </View>
                {
                  newURL !== '' &&
                  <View style={styles.descQRCode}>
                    <Text style={styles.QRCodeMsg}>您可以扫码查询银行账号和进行支付:</Text>
                    <View>
                      <ViewShot ref="viewShot" options={{ format: "jpg", quality: 0.9 }}>
                        {
                          <QRCodeA ref="viewShot"
                            value={newURL}
                            size={160}
                            bgColor='#000'
                          />
                        }

                      </ViewShot>
                    </View>
                  </View>
                }
                <Touch style={styles.successBtn} onPress={() => {
                  this.succesSsubmit();
                }}>
                  <Text style={styles.successBtnTxt}>我已经成功存款</Text>
                </Touch>
                <View style={{ width: width - 50 }}>
                  <PPBPrompt />
                </View>
              </View>
            }
            {
              //存款成功，上传存款凭证
              depositNext &&
              <View style={{ flex: 1 }}>
                <View style={styles.PayAready}>
                  <Image
                    resizeMode="stretch"
                    source={require("../../images/icon-done.png")}
                    style={{ width: 48, height: 48 }}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      color: "#222",
                      textAlign: "center",
                      lineHeight: 35,
                      fontWeight: "bold",
                    }}
                  >
                    已成功提交
                  </Text>
                  <View style={[styles.detials, { paddingTop: 15 }]}>
                    <Text style={{ fontSize: 12, color: "#999999", fontWeight: "bold" }}>存款金额</Text>
                    <Text
                      style={{ color: "#222", fontSize: 20, fontWeight: "bold" }}
                    >
                      ￥{amount || ''}
                    </Text>
                  </View>
                  <View style={[styles.detials, { paddingTop: 15, paddingBottom: 30 }]}>
                    <Text style={{ fontSize: 12, color: "#999999", fontWeight: "bold" }}>交易单号</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontSize: 12, color: '#222222' }}>{secondStepData.transactionId || ''}</Text>
                      <Touch onPress={() => {
                        this.copy(secondStepData.transactionId || '');
                      }}>
                        <Image
                          source={require("../../images/icon/copy.png")}
                          resizeMode="stretch"
                          style={{ width: 14, height: 14, marginLeft: 11 }}
                        />
                      </Touch>
                    </View>
                  </View>
                  <View style={styles.steps}>
                    <View style={styles.stepsLeft}>
                      <Image
                        resizeMode="stretch"
                        source={require("../../images/icon/checkBlue.png")}
                        style={{ width: 12, height: 12 }}
                      />
                      <View style={styles.stepsView} />
                      <View style={styles.steps2}></View>
                    </View>
                    <View style={styles.stepsLeft}>
                      <View>
                        <Text style={[styles.stepeTxt, { color: '#00a6ff', fontSize: 13 }]}>提交成功</Text>
                        <Text style={[styles.stepeTxtSec]}>处理中</Text>
                      </View>
                      <View style={{ height: 26 }}></View>
                      <Text style={[styles.steps2Txt]}>预计10:00分钟到账</Text>
                    </View>
                  </View>
                </View>


                <View style={{ backgroundColor: '#fff', borderRadius: 5, marginTop: 15, padding: 15 }}>
                  <View style={styles.recommended}>
                    <Text style={{ color: '#666666', paddingRight: 10, fontSize: 12 }}>上传存款凭证</Text>
                    <View style={styles.recommendedIcon}><Text
                      style={{ fontSize: 12, color: '#323232', fontWeight: 'bold' }}>推荐使用</Text></View>
                  </View>
                  {
                    uploadMsg != 'success' &&
                    <Touch style={styles.upload} onPress={() => {
                      this.setState({ upload: true });
                    }}>
                      <View style={styles.uploadIcon}><Text
                        style={{ color: '#fff', lineHeight: 16, fontSize: 16 }}>+</Text></View>
                      <Text style={{ paddingLeft: 15, color: '#999' }}>上传存款凭证以利款项快速到帐</Text>
                    </Touch>
                  }
                  {
                    uploadMsg == 'success' &&
                    <View style={[styles.upload, { justifyContent: 'flex-start' }]}>
                      <Text style={{ paddingLeft: 15, color: '#323232' }}>{this.state.uploadData.avatarName}</Text>
                    </View>
                  }
                  <Touch style={[styles.upload, { justifyContent: 'flex-start' }]} onPress={() => {
                    LiveChatOpenGlobe();
                  }}>
                    <Text style={{ paddingLeft: 15, color: '#999', fontSize: 12 }}>若您无法上传凭证，请联系<Text
                      style={{ color: '#00A6FF', textDecorationLine: 'underline', fontSize: 12 }}>在线客服</Text>。</Text>
                  </Touch>
                </View>


                <View style={{ paddingTop: 15 }}>
                  <Text style={{
                    color: '#999',
                    textAlign: 'center',
                    fontSize: 12,
                    lineHeight: 20,
                    fontWeight: "bold"
                  }}>您可以回到首页继续投注，请等待10分钟以刷新金额，</Text>
                  <Text style={{
                    color: '#999',
                    textAlign: 'center',
                    fontSize: 12,
                    lineHeight: 20,
                    fontWeight: "bold"
                  }}>如果有任何问题，请联系我们的在线客服</Text>
                </View>

                <View style={{ marginTop: 20 }}>
                  <Touch
                    onPress={() => {
                      PiwikAction.SendPiwik("DepoToRecord");
                      Actions.recordes({
                        recordIndex: 0,
                      });
                    }}
                    style={{
                      borderRadius: 8,
                      backgroundColor: "#00a6ff",
                      width: width - 30,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "bold",
                        lineHeight: 42,
                        textAlign: "center",
                      }}
                    >
                      查看交易记录
                    </Text>
                  </Touch>
                </View>
                <View style={{ marginTop: 20 }}>
                  <Touch
                    onPress={() => {
                      Actions.pop();
                      Actions.home1();
                    }}
                    style={{
                      borderRadius: 8,
                      borderColor: "#00a6ff",
                      borderWidth: 1,
                      width: width - 30,
                    }}
                  >
                    <Text
                      style={{
                        color: "#00a6ff",
                        fontSize: 16,
                        lineHeight: 42,
                        textAlign: "center",
                      }}
                    >
                      回到首页
                    </Text>
                  </Touch>
                </View>
              </View>
            }
          </View>
          <View style={{ height: 50 }} />
        </ScrollView>
      </View>

    );

  }

}

export default (PPBSecondStep);


const styles = StyleSheet.create({
  checkIcon: {
    width: 16,
    height: 16,
    position: 'absolute',
    right: -21,
  },
  confirmModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countDownErr: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
    width: width,
    height: height,
    padding: 20,
    backgroundColor: '#EFEFF4',
  },
  errMsg: {
    padding: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  successBtn: {
    backgroundColor: '#00A6FF',
    borderRadius: 8,
    marginTop: 15,
  },
  successBtnTxt: {
    lineHeight: 45,
    textAlign: 'center',
    color: '#fff',
  },
  descReceipt: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  QRCodeMsg: {
    color: '#999',
    fontSize: 12,
    lineHeight: 35,
  },
  descQRCode: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descMsg: {
    fontSize: 12,
    color: '#F11818',
    lineHeight: 18,
    paddingTop: 10,
  },
  PPBbankConter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  PPBbankTxt: {
    fontSize: 12,
    color: '#000',
    paddingRight: 5,
  },
  PPBbankLabel: {
    fontSize: 12,
    color: '#999',
  },
  PPBbankList: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    paddingRight: 30,
  },
  PPBDowmTime: {
    backgroundColor: '#FFF5BF',
    borderRadius: 5,
    padding: 10,
    width: width - 50,
  },
  PPBamount: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF4',
  },
  PBBamountCopy: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  errTxt: {
    color: '#F11818',
    paddingBottom: 20,
    width: width - 50,
    paddingLeft: 20,
  },
  protective: {
    position: 'absolute',
    zIndex: 999999,
    width: width,
    height: height,
    top: -height / 2,
    left: -width / 1.5,
  },
  lodingModal: {
    position: 'absolute',
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  uploadView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingLeft: 15,
    height: 45,
    width: width - 80,
    marginBottom: 15
  },
  uploadBtn: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#00A6FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    width: 72,
    borderRadius: 8,
  },
  uploadModal: {
    padding: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingTop: 0,
  },
  modalBtnclose: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00A6FF',
    width: (width - 100) / 2,
    marginRight: 15,
  },
  modalBtnok: {
    borderRadius: 5,
    backgroundColor: '#00A6FF',
    width: (width - 100) / 2,
  },
  uploadIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 16,
    height: 16,
    borderRadius: 16,
    backgroundColor: '#999999',
  },
  upload: {
    width: width - 60,
    backgroundColor: '#F5F5F5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    height: 42,
    marginBottom: 10,
  },
  recommended: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  recommendedIcon: {
    backgroundColor: '#FFE273',
    padding: 5,
    borderRadius: 4,
  },
  detials: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: width - 60,
  },
  stepeTxt: {
    color: '#666',
    fontSize: 12,
    width: 140,
    textAlign: 'left'
  },
  steps2Txt: {
    color: "#BCBEC3",
    fontWeight: "bold",
    fontSize: 13,
    width: 140,
    textAlign: 'left'
  },
  stepeTxtSec: {
    color: "#666",
    fontWeight: "bold",
    fontSize: 11,
    width: 120,
    textAlign: "left",
    marginTop: 6
  },
  stepsLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
  },
  stepsView: {
    width: 2,
    height: 39,
    marginVertical: 5,
    backgroundColor: "#DCDCE0",
  },
  steps2: {
    display: "flex",
    height: 9,
    width: 9,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#DCDCE0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#E5E5EA4D'
  },
  steps1: {
    display: 'flex',
    height: 20,
    width: 20,
    borderRadius: 50,
    backgroundColor: '#108ee9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: width - 60,
  },
  PayAready: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: width - 30,
  },
  copyTxt: {
    fontSize: 12,
    color: '#1C8EFF',
    paddingLeft: 10,
  },
});

