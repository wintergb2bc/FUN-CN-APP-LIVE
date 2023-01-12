import React from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  Clipboard,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import { Toast } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import Modals from "react-native-modal";
import QRCodeA from "react-native-qrcode-svg";
import ImagePicker from "react-native-image-picker";
import RNHeicConverter from "react-native-heic-converter";
import { LBPrompt } from "../Common/Deposit/depositPrompt";
import ViewShot from "react-native-view-shot";
import PiwikAction from "../../lib/utils/piwik";
const { width, height } = Dimensions.get("window");


// 展示第三方頁面
const goThirdPartyPageList = ["JDP", "OA", "WC", "BC", "BCM", "UP", "QQ"]

//充值方式图片
export const bankImage = {
  JDP: require("../../images/bank/bankicon/JDP.png"),
  AP: require("../../images/bank/bankicon/AP.png"),
  BC: require("../../images/bank/bankicon/BC.png"),
  BCM: require("../../images/bank/bankicon/BCM.png"),
  BCActive: require("../../images/bank/bankicon/BCActive.png"),
  CC: require("../../images/bank/bankicon/CC.png"),
  CCActive: require("../../images/bank/bankicon/CCActive.png"),
  LB: require("../../images/bank/bankicon/LB.png"),
  LBActive: require("../../images/bank/bankicon/LBActive.png"),
  OA: require("../../images/bank/bankicon/OA.png"),
  UP: require("../../images/bank/bankicon/UP.png"),
  QQ: require("../../images/bank/bankicon/QQ.png"), //沒圖
  WC: require("../../images/bank/bankicon/WC.png"), //沒圖
  QR: require("../../images/bank/icon_lib_basketballcopy.png"), //沒圖
  Hover: require("../../images/bank/bankIcon1.png"), //選中圖
  WCLB: require("../../images/bank/bankicon/WCLB.png"), //沒圖
  YP: require("../../images/bank/bankicon/LB.png"),
  ALB: require("../../images/bank/bankicon/ALB.png"),
  ALBActive: require("../../images/bank/bankicon/ALBActive.png"),
  PPB: require("../../images/bank/bankicon/PPB.png"),
  CTC: require("../../images/bank/bankicon/CTC.png"),
  BTC: require("../../images/bank/bankicon/bitcoin.png"),
  ETH: require("../../images/bank/bankicon/ethereum.png"),
  "USDT-ERC20": require("../../images/bank/bankicon/tether-erc.png"),
  "USDT-TRC20": require("../../images/bank/bankicon/tether-trc.png"),
};

class DepositCenterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadData: "", //上传图片信息
      uploadMsg: "",
      upload: false,
      activeDeposit: this.props.checkcallbackDate.activeCode,
      activeName: this.props.checkcallbackDate.activeName,
      depositDate: this.props.checkcallbackDate.data,
      otherAccount: false,
      CTC_code: this.props.CTC_code || "",
      otherBank: "",
      otherBankST: "",
      ALBTypeActive: this.props.checkcallbackDate.ALBTypeActive || "",
      Bottoms: false,
      propsData: this.props.checkcallbackDate,
      payCallback: this.props.checkcallbackDate.payCallback,
      PayAready: false,
      countdownTime: "",
      previousPage: this.props.previousPage || "", //.. 从哪个页面过来
      Countdown: "00:00",
      INVOICE_TimeOut: false,
      prompt: false,
      INVOICE_AutNext: "",
      INVOICE_AutCodeErr: false,
      INVOICE_AutModal: false,
      INVOICE_AutCode: "",
      isSmileLBAvailable: false,
      ALBPay: false,
      INVOICE_AUT: this.props.checkcallbackDate.INVOICE_AUT,
      CTC_INVOICE_OTC: this.props.checkcallbackDate.CTC_INVOICE_OTC,
    };
  }

  // componentDidMount = () => {
  //     this.props.navigation.setParams({
  //         title: this.props.checkcallbackDate.activeName,
  //       });
  // };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isSmileLBAvailable: this.props.isSmileLBAvailable || false,
      });
    }, 600);
    this.Countdown();
    this.props.navigation &&
      this.props.navigation.setParams({
        title: this.props.checkcallbackDate.activeName,
      });
  }

  componentWillMount() {
    if (this.state.INVOICE_AUT) {
      this.GetProcessingDepositbyMethod(
        (this.state.payCallback && this.state.payCallback.transactionId) || ""
      );
    }
    // const activeDeposit = this.state.activeDeposit;
    // if (activeDeposit == 'ALB' || activeDeposit == 'WCLB') {
    //     this.setState({ prompt: true })
    // }
  }
  componentWillUnmount() {
    this.Countdowns && clearInterval(this.Countdowns);

    if (this.props.previousPage && this.props.previousPage == "Topup") {
      //   从注册优惠 过来此页面的 直接回到首页
      Actions.home();
    }
  }
  GetProcessingDepositbyMethod(transactionId) {
    Toast.loading("加载中,请稍候...", 200);
    fetchRequest(
      `${ApiPort.GetProcessingDepositbyMethod}${transactionId ? `depositId=${transactionId}&` : ""
      }method=CTC&methodCode=INVOICE_AUT&`,
      "GET"
    )
      .then((data) => {
        Toast.hide();
        const res = data.result;
        let orderData = res.filter((v) => v.transactionId === transactionId);
        orderData.length && this.setState({ INVOICE_AutNext: orderData[0] });
      })
      .catch(() => {
        Toast.fail("网络错误，请重试", 2);
      });
  }

  //存到其他账号
  otherBank(value) {
    const otherTest = /^[0-9]{6}$/;
    let otherBank = value;
    let otherBankST = "";
    if (value == "") {
      otherBankST = "请输入改账号最后6位号码";
    } else if (otherTest.test(value) != true) {
      otherBankST = "账号最后6位号码格式错误";
    }

    this.setState({ otherBank, otherBankST });
  }
  otherBankPiwik() {
    switch (this.state.activeDeposit) {
      case "LB":
        PiwikEvent("Otheracc_localbank_deposit");
        break;
      case "ALB":
        PiwikEvent("Otheracc_Localalipay_deposit");
        break;
      case "WCLB":
        PiwikEvent("Otheracc_Localwechat_deposit");
        break;
      default:
        break;
    }
  }
  okPay() {
    const accNum = this.state.payCallback.returnedBankDetails.accountNumber;
    var accNumLength = accNum.length;
    var accNumSix = accNum.substring(accNumLength - 6, accNumLength);
    console.log(accNumSix);
    let data = {
      depositingBankAcctNum: accNumSix,
      // offlineDepositDate: "2022-02-18T05:55:35.445Z",
      // transactionId: this.state.payCallback.transactionId,
      // depositingBankAcctNum: accNumSix,
    };

    //打开后6为输入，没有输入后6位数不能提交
    if (
      this.state.otherAccount &&
      (this.state.otherBankST != "" || this.state.otherBank == "")
    ) {
      Toast.fail("请输入正确的改账号最后6位号码", 2);
      return;
    }
    //有后六位数
    if (this.state.otherBankST == "" && this.state.otherBank != "") {
      data = {
        depositingBankAcctNum: this.state.otherBank,
      };
    }
    // if (this.state.prompt) { return }
    // this.okPayPiwik();
    Toast.loading("提交中,请稍候...", 200);
    fetchRequest(
      `${ApiPort.ConfirmStep}transactionId=${this.state.payCallback.transactionId}&`,
      "POST",
      data
    )
      .then((data) => {
        Toast.hide();
        if (data.isSuccess) {
          if (this.props.froms == "promotions") {
            window.goHome && window.goHome();
            window.bonusState &&
              Actions.PromotionsBank({
                BonusData: this.props.BonusData,
                data: this.state.payCallback,
                froms: "DepositCenter",
              });
          }
          this.setState({ PayAready: true });
          // this.Countdown()
        } else {
          Toast.fail("银行账户后6位号码不正确", 2);
        }
      })
      .catch(() => {
        // Toast.fail("网络错误，请重试", 2);
      });
  }
  okPayPiwik() {
    switch (this.state.activeDeposit) {
      case "LB":
        PiwikEvent("Deposit", "Submit", "Localbank");
        break;
      case "ALB":
        PiwikEvent("Deposit", "Submit", "LocalbankAlipay");
        break;
      case "WCLB":
        PiwikEvent("Deposit", "Submit", "LocalbankWechat");
        break;
      default:
        break;
    }
  }
  //复制
  copy(txt) {
    try {
      const value = String(txt);
      Clipboard.setString(value);
      Toast.info("已复制", 2);
    } catch (error) {
      console.log(error);
    }
  }

  goBack() {
    if (this.state.previousPage == "Topup") {
      // 从注册优惠过来的,返回
      this.Countdowns && clearInterval(this.Countdowns);
      this.setState({ PayAready: false }, () => {
        Actions.TopupDone();
        // Actions.pop()
      });
    } else if (this.state.previousPage == "GamePage") {
      //游戏过来的
      this.setState({ PayAready: false }, () => {
        Actions.pop();
      });
    } else {
      // 从充值过来的
      this.setState({ PayAready: false }, () => {
        this.props.navigateToScene("deposit");
      });
    }
  }

  //倒计时处理
  Countdown() {
    this.Countdowns && this.Countdowns === null;
    this.Countdowns && clearInterval(this.Countdowns);

    let time = 1800;
    if (this.state.ALBTypeActive == "qrcode") {
      time = 300;
    }
    if (this.state.INVOICE_AUT) {
      time = 1200;
    }
    let m, s, ms;
    this.Countdowns = setInterval(() => {
      time -= 1;
      m = parseInt(time / 60).toString();
      s = time - m * 60;
      if (s < 10) {
        s = "0" + s.toString();
      }
      ms = m + ":" + s;
      if (m < 10) {
        ms = "0" + m.toString() + ":" + s;
      }
      this.setState({ Countdown: ms });

      if (m == 0 && s == 0) {
        clearInterval(this.Countdowns);
        if (this.state.ALBTypeActive == "qrcode") {
          this.setState({ ALBPay: true });
          return;
        }
        if (this.state.INVOICE_AUT) {
          this.setState({ INVOICE_TimeOut: true });
        }
        this.setState({ PayAready: true });
        // if (this.state.previousPage == "Topup") {
        //     this.setState({ PayAready: false }, () => {
        //         Actions.TopupDone()
        //     })
        // } else if (this.state.previousPage == 'GamePage') {
        //     //游戏过来的
        //     this.setState({ PayAready: false }, () => {
        //         Actions.pop()
        //     })
        // } else {
        //     this.setState({ PayAready: false }, () => {
        //         key !== 'qrcode' && this.props.navigateToScene('deposit')
        //     })
        // }
      }
    }, 1000);
  }

  pops() {
    window.goHome && window.goHome();
    Actions.pop();
  }
  cancelDeposit = () => {
    this.setState({ INVOICE_AutModal: false });
    Toast.loading("取消中,请稍候...", 200);
    fetchRequest(
      ApiPort.POSTMemberCancelDeposit +
      "transactionId=" +
      this.state.payCallback.transactionId +
      "&",
      "POST"
    ).then((res) => {
      Toast.hide();
      if (res && res.isSuccess) {
        Toasts.success("交易已取消");
        Actions.pop();
      } else {
        Toasts.fail("错误");
      }
    });
  };
  goThirdStep = () => {
    const {
      INVOICE_AutCodeErr,
      INVOICE_AutCode,
      payCallback,
      INVOICE_AutNext,
    } = this.state;

    if (INVOICE_AutCodeErr || !INVOICE_AutCode) {
      return;
    }

    Toast.loading("提交中,请稍候...", 200);
    PiwikEvent("Deposit", "Submit", "Crypto_Channel");
    fetchRequest(
      `${ApiPort.ProcessInvoiceAutCryptoDeposit}?transactionID=${payCallback.transactionId}&transactionHash=${INVOICE_AutCode}&`,
      "POST"
    )
      .then((res) => {
        Toast.hide();
        if (res.isSuccess) {
          let payCallback = this.state.payCallback;
          payCallback.uniqueAmount = INVOICE_AutNext.amount;
          this.setState({ payCallback, PayAready: true });
        } else {
          Toasts.error(res.errorMessage);
        }
      })
      .catch((error) => {
        hide();
        console.log(error);
      });
  };
  //lb上传凭证图
  uploadAction() {
    const ImagePickerOption = {
      title: "选择图片",
      cancelButtonTitle: "取消",
      takePhotoButtonTitle: "使用相机拍摄",
      chooseFromLibraryButtonTitle: "选取照片",
      customButtons: [],
      cameraType: "back",
      mediaType: Platform.OS === "ios" ? "photo" : "mixed",
      videoQuality: "high",
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
      saveToPhotos: true,
    };

    ImagePicker.showImagePicker(ImagePickerOption, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        this.setState({ uploadMsg: "sizeErr" });
      } else if (response.customButton) {
      } else {
        // let source = { uri: 'data:image/jpegbase64,' + response.data }
        if (
          Platform.OS === "ios" &&
          response.fileName &&
          (response.fileName.endsWith(".heic") ||
            response.fileName.endsWith(".HEIC") ||
            response.fileName.endsWith(".heif") ||
            response.fileName.endsWith(".HEIF"))
        ) {
          RNHeicConverter.convert({ path: response.origURL }).then((data) => {
            const { success, path, error } = data;

            if (!error && success && path) {
              let name = response.fileName;
              name = name.replace(".heic", ".jpg");
              name = name.replace(".HEIC", ".jpg");
              name = name.replace(".heif", ".jpg");
              name = name.replace(".HEIF", ".jpg");
              let avatarSource = { uri: response.data };

              this.setState({
                uploadData: { avatarName: name, avatarSource },
                uploadMsg: "success",
              });
            } else {
              this.setState({ uploadMsg: "sizeErr" });
            }
          });
        } else {
          if (
            !response ||
            !response.fileName ||
            !response.fileSize ||
            !response.data
          ) {
            this.setState({ uploadMsg: "sizeErr" });
            return;
          }
          let source = { uri: response.data };
          //后缀要求小写
          let idx = response.fileName.lastIndexOf(".");
          let newfileName =
            response.fileName.substring(0, idx) +
            response.fileName.substring(idx).toLowerCase();
          let avatarName = newfileName;
          let avatarSize = response.fileSize;
          let avatarSource = source;
          let fileSize = response.fileSize;
          //超过4M大小
          let fileImgFlag = !(
            response.fileSize <= 1024 * 1024 * 4 &&
            ["JPG", "PNG"].includes(
              response.fileName
                .split(".")
              [response.fileName.split(".").length - 1].toLocaleUpperCase()
            )
          );

          this.setState({
            uploadData: { avatarName, avatarSource },
            uploadMsg: fileImgFlag ? "sizeErr" : "success",
          });
        }
      }
    });
  }

  postUpload() {
    const { uploadMsg } = this.state;
    if (uploadMsg == "" || uploadMsg == "apiErr" || uploadMsg == "sizeErr") {
      return;
    }

    const { avatarSource, avatarName } = this.state.uploadData;
    this.setState({ uploadMsg: "loding" });
    let params = {
      DepositID: this.state.payCallback.transactionId,
      PaymentMethod: this.state.activeDeposit,
      FileName: avatarName,
      byteAttachment: avatarSource.uri,
      RequestedBy: window.memberCode,
    };

    fetchRequest(window.ApiPort.UploadAttachment, "POST", params)
      .then((data) => {
        if (data.isSuccess) {
          this.setState({ upload: false, uploadMsg: "success" });
          Toasts.success("存款凭证已上传");
        } else {
          this.setState({ uploadMsg: "apiErr" });
        }
      })
      .catch(() => {
        this.setState({ uploadMsg: "apiErr" });
      });
  }

  render() {
    const {
      upload,
      uploadMsg,
      activeDeposit,
      activeName,
      CTC_code,
      depositDate,
      otherAccount,
      otherBank,
      otherBankST,
      propsData,
      payCallback,
      PayAready,
      Countdown,
      INVOICE_TimeOut,
      Bottoms,
      prompt,
      INVOICE_AutNext,
      INVOICE_AutCode,
      INVOICE_AutCodeErr,
      ALBPay,
      isSmileLBAvailable,
      INVOICE_AutModal,
    } = this.state;
    // console.log('this.props.checkcallbackDatethis.props.checkcallbackDate', this.props.checkcallbackDate)
    return (
      <View style={{ flex: 1 }}>
        {/* 本地银行充值银行错误 */}
        <Modals
          isVisible={isSmileLBAvailable}
          backdropColor={"#000"}
          transparent={true}
          backdropOpacity={0.4}
          style={{ justifyContent: "center", margin: 0, padding: 25 }}
        >
          <View style={[styles.secussModal, { borderRadius: 15, padding: 0 }]}>
            <View
              style={{
                backgroundColor: "#00A6FF",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                width: width - 40,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  lineHeight: 42,
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                错误提示
              </Text>
            </View>
            <Text style={{ color: "#666", padding: 25, lineHeight: 21 }}>
              很抱歉，目前暂无可存款的银行。此次交易将被取消，请尝试其他存款方式。
            </Text>
            <View style={{ marginBottom: 15 }}>
              <Touch
                onPress={() => {
                  this.setState({ isSmileLBAvailable: false }, () => {
                    this.props.depositCodeClick();
                    Actions.pop();
                  });
                }}
                style={[styles.modalBtnok, { width: width * 0.6 }]}
              >
                <Text
                  style={{
                    color: "#fff",
                    lineHeight: 44,
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  重新提交
                </Text>
              </Touch>
            </View>
          </View>
        </Modals>
        <Modal
          animationType="none"
          transparent={true}
          visible={INVOICE_TimeOut}
        >
          <View style={styles.depModal}>
            <View style={styles.secussModal}>
              <Text
                style={{ lineHeight: 20, color: "#000", fontWeight: "bold" }}
              >
                操作超时，系统将自动取消该笔交易。
              </Text>
              <Text
                style={{
                  lineHeight: 20,
                  color: "#000",
                  fontWeight: "bold",
                  paddingBottom: 20,
                }}
              >
                若您已经完成交易，请联系在线客服。?
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Touch
                  onPress={() => {
                    this.setState({ INVOICE_TimeOut: false }, () => {
                      LiveChatOpenGlobe();
                    });
                  }}
                  style={styles.AutModalClose}
                >
                  <Text style={styles.AutModalCloseTxt}>在线客服</Text>
                </Touch>
                <Touch
                  onPress={() => {
                    this.setState({ INVOICE_TimeOut: false }, () => {
                      Actions.pop();
                    });
                  }}
                  style={styles.AutModalok}
                >
                  <Text style={styles.AutModalokTxt}>回到存款页面</Text>
                </Touch>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="none"
          transparent={true}
          visible={INVOICE_AutModal}
        >
          <View style={styles.depModal}>
            <View style={styles.secussModal}>
              <Text
                style={{ lineHeight: 40, color: "#000", fontWeight: "bold" }}
              >
                您确定要取消这笔交易吗?
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Touch
                  onPress={() => {
                    this.setState({ INVOICE_AutModal: false });
                  }}
                  style={styles.AutModalClose}
                >
                  <Text style={styles.AutModalCloseTxt}>不取消</Text>
                </Touch>
                <Touch
                  onPress={() => {
                    this.cancelDeposit();
                  }}
                  style={styles.AutModalok}
                >
                  <Text style={styles.AutModalokTxt}>是的，我要取消</Text>
                </Touch>
              </View>
            </View>
          </View>
        </Modal>
        {/* 本地银行上传凭证 图 */}
        <Modals
          isVisible={upload}
          backdropColor={"#000"}
          backdropOpacity={0.4}
          style={{ justifyContent: "center", margin: 0, padding: 25 }}
          onBackdropPress={() => {
            this.setState({ upload: false });
          }}
        >
          <View style={styles.uploadModal}>
            {uploadMsg == "loding" && (
              <View style={styles.lodingModal}>
                <View style={styles.protective} />
                <ActivityIndicator color="#fff" />
                <Text style={{ color: "#fff", paddingTop: 15 }}>
                  文档上传中
                </Text>
                <Text style={{ color: "#fff", paddingTop: 5 }}>请稍等...</Text>
              </View>
            )}
            <View
              style={{
                backgroundColor: "#00A6FF",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                width: width - 50,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  lineHeight: 42,
                  textAlign: "center",
                  fontSize: 17,
                }}
              >
                上传存款凭证
              </Text>
            </View>
            <Text style={{ paddingTop: 25, lineHeight: 21, color: "#666" }}>
              请上传存款凭证，仅接受 jpg 及 png 档案，且档案大小不得超过4MB。
            </Text>
            <Text style={{ color: "#000", width: width - 50, padding: 20 }}>
              存款凭证
            </Text>
            <View style={styles.uploadView}>
              <Text
                style={{ color: "#323232", width: width * 0.5, lineHeight: 45 }}
                numberOfLines={1}
              >
                {this.state.uploadData && this.state.uploadData.avatarName}
              </Text>
              <Touch
                style={styles.uploadBtn}
                onPress={() => {
                  this.uploadAction();
                }}
              >
                <Text style={{ color: "#fff" }}>选择文档</Text>
              </Touch>
            </View>
            {uploadMsg == "sizeErr" && (
              <Text style={styles.errTxt}>
                仅接受 jpg 及 png 档案，且档案大小不得超过4MB。
              </Text>
            )}
            {uploadMsg == "apiErr" && (
              <Text style={styles.errTxt}>
                上传失败由于未知的错误，请稍后再试
              </Text>
            )}
            <View style={{ flexDirection: "row" }}>
              <Touch
                onPress={() => {
                  this.setState({
                    upload: false,
                    uploadMsg: "",
                    uploadData: "",
                  });
                }}
                style={styles.modalBtnclose}
              >
                <Text
                  style={{
                    color: "#00a6ff",
                    textAlign: "center",
                    lineHeight: 40,
                    fontSize: 16,
                  }}
                >
                  关闭
                </Text>
              </Touch>
              <Touch
                onPress={() => {
                  this.postUpload();
                }}
                style={[
                  styles.modalBtnok,
                  {
                    backgroundColor:
                      uploadMsg == "success" ? "#00A6FF" : "#EFEFF4",
                  },
                ]}
              >
                <Text
                  style={{
                    color: uploadMsg == "success" ? "#fff" : "#BCBEC3",
                    textAlign: "center",
                    lineHeight: 42,
                    fontSize: 16,
                  }}
                >
                  上传存款凭证
                </Text>
              </Touch>
            </View>
          </View>
        </Modals>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, padding: 15, backgroundColor: "#F2F2F2" }}
          contentInset={{ bottom: 50 }}
        >
          <Modal animationType="none" transparent={true} visible={ALBPay}>
            <View style={styles.depModal}>
              <View style={styles.secussModal}>
                {/* <Image
                            resizeMode="stretch"
                            source={require("../../images/icon-done.png")}
                            style={{ width: 60, height: 60 }}
                        />
                        <Text style={{ color: '#222222', lineHeight: 25 }}>提交成功</Text>
                        <Text style={{ color: '#42D200', lineHeight: 25 }}>{Countdown != '' && Countdown || '14:59'}</Text>
                        <Text style={{ color: '#222222', padding: 10, fontSize: 13 }}>交易需要一段时间，请稍后再检查您的目标账户。</Text>
                        <Touch onPress={() => { Actions.pop() }} style={{ padding: 10, backgroundColor: '#00A6FF', borderRadius: 50, paddingHorizontal: 50, }}>
                            <Text style={{ color: '#fff' }}>{previousPage == "Topup" || previousPage == 'GamePage' ? "返回" : "返回充值首页"}</Text>
                        </Touch> */}
                <Text
                  style={{ fontSize: 16, textAlign: "center", color: "#000" }}
                >
                  您是否成功充值？
                </Text>
                <Touch
                  onPress={() => {
                    this.setState(
                      { otherAccount: false, ALBPay: false },
                      () => {
                        this.okPay();
                      }
                    );
                  }}
                  style={{
                    backgroundColor: "#00A6FF",
                    borderRadius: 10,
                    marginTop: 30,
                    width: width - 90,
                  }}
                >
                  <Text
                    style={{
                      lineHeight: 40,
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    是，我已成功存款
                  </Text>
                </Touch>
                <Touch
                  onPress={() => {
                    this.setState(
                      { ALBTypeActive: "bank", ALBPay: false },
                      () => {
                        this.Countdown();
                      }
                    );
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: "#00A6FF",
                    borderRadius: 10,
                    marginTop: 30,
                    marginButtom: 30,
                    width: width - 90,
                  }}
                >
                  <Text
                    style={{
                      lineHeight: 40,
                      textAlign: "center",
                      color: "#00A6FF",
                    }}
                  >
                    否，请显示银行账号
                  </Text>
                </Touch>
              </View>
            </View>
          </Modal>
          {activeDeposit == "CTC" &&
            this.state.INVOICE_AUT &&
            INVOICE_AutNext != "" &&
            !PayAready && (
              <View>
                <View style={{ paddingBottom: 20 }}>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      marginTop: 20,
                    }}
                  >
                    <View style={{ padding: 15 }}>
                      <View
                        style={{ backgroundColor: "#fff5bf", borderRadius: 5 }}
                      >
                        <Text
                          style={{
                            paddingLeft: 10,
                            lineHeight: 40,
                            color: "#83630b",
                            fontSize: 12,
                          }}
                        >
                          请在{Countdown}
                          分钟内完成交易并输入交易哈希，否则系统将自动取消交易。
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.CTClist, { borderColor: "#fff" }]}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#666666",
                          marginBottom: 20,
                        }}
                      >
                        存款金额
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#000",
                          marginBottom: 20,
                        }}
                      >
                        {INVOICE_AutNext.cryptocurrencyDetail.exchangeAmount}{" "}
                        USDT-ERC20
                      </Text>
                    </View>
                    <View style={{ padding: 15 }}>
                      <View
                        style={{ backgroundColor: "#d6f0ff", borderRadius: 5 }}
                      >
                        <Text style={styles.CTCtxt}>
                          参考汇率：1 USDT-ERC20 ={" "}
                          {INVOICE_AutNext.cryptoExchangeRate} 人民币
                        </Text>
                        <Text style={styles.CTCtxt}>
                          USDT-ERC20 交易需加上手续费。
                        </Text>
                        <Text style={styles.CTCtxt}>
                          例：火币交易手续费为 3 USDT 加上充值数量 15.88
                        </Text>
                        <Text style={styles.CTCtxt}>
                          USDT，交易总量为 18.88 USDT。
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.CTClist, { padding: 0 }]}></View>
                    <View
                      style={[styles.CTClist, { alignItems: "flex-start" }]}
                    >
                      <Text style={{ fontSize: 12, color: "#666666" }}>
                        二维码
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {INVOICE_AutNext &&
                          INVOICE_AutNext.cryptocurrencyDetail.deepLink !=
                          "" && (
                            <ViewShot
                              ref="viewShot"
                              options={{ format: "jpg", quality: 0.9 }}
                            >
                              {
                                <QRCodeA
                                  ref="viewShot"
                                  value={
                                    INVOICE_AutNext.cryptocurrencyDetail
                                      .deepLink
                                  }
                                  size={160}
                                  bgColor="#000"
                                />
                              }
                            </ViewShot>
                          )}
                      </View>
                    </View>
                    <View style={{ padding: 15 }}>
                      <Text style={{ fontSize: 12, color: "#666666" }}>
                        收款地址
                      </Text>
                      <View
                        style={{
                          borderRadius: 5,
                          paddingLeft: 15,
                          paddingRight: 35,
                          marginTop: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#666666",
                            lineHeight: 40,
                          }}
                          numberOfLines={1}
                        >
                          {INVOICE_AutNext.cryptocurrencyDetail.walletAddress}
                        </Text>
                        <Touch
                          onPress={() => {
                            PiwikEvent(
                              "Deposit_Nav",
                              "Copy",
                              "Crypto_Channel_Copy"
                            );
                            this.copy(
                              INVOICE_AutNext.cryptocurrencyDetail.walletAddress
                            );
                          }}
                          style={{ position: "absolute", right: 0, width: 35 }}
                        >
                          <Text
                            style={{
                              color: "#1C8EFF",
                              fontSize: 12,
                              lineHeight: 40,
                            }}
                          >
                            复制
                          </Text>
                        </Touch>
                      </View>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#666666",
                          paddingLeft: 15,
                        }}
                      >
                        交易哈希
                      </Text>
                      <View style={styles.inputView}>
                        <TextInput
                          multiline={true}
                          value={INVOICE_AutCode}
                          style={{
                            color: "#000",
                            height: 38,
                            width: width - 80,
                          }}
                          placeholder={"交易哈希"}
                          placeholderTextColor="#BCBEC3"
                          onChangeText={(value) => {
                            let INVOICE_AutCodeErr = false;
                            if (!/^(0x|0X)[a-zA-Z0-9]{64}$/.test(value)) {
                              INVOICE_AutCodeErr = true;
                            }
                            this.setState({
                              INVOICE_AutCode: value,
                              INVOICE_AutCodeErr,
                            });
                          }}
                        />
                      </View>
                      {INVOICE_AutCodeErr && (
                        <View style={{ padding: 15 }}>
                          <View
                            style={{
                              backgroundColor: "#fee0e0",
                              borderRadius: 8,
                            }}
                          >
                            <Text
                              style={{
                                color: "#eb2121",
                                fontSize: 12,
                                textAlign: "center",
                                lineHeight: 35,
                              }}
                            >
                              请输入以0x开头的66位字符，不包含空格和特殊字符。
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        marginTop: 20,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        marginBottom: 30,
                        padding: 15,
                      }}
                    >
                      <Touch
                        onPress={() => {
                          this.setState({ INVOICE_AutModal: true });
                        }}
                        style={styles.closeBtn}
                      >
                        <Text
                          style={{
                            lineHeight: 40,
                            color: "#00a6ff",
                            textAlign: "center",
                          }}
                        >
                          取消交易
                        </Text>
                      </Touch>
                      <Touch
                        onPress={() => {
                          PiwikAction.SendPiwik("DepoSubmitInvo2");
                          this.goThirdStep();
                        }}
                        style={[
                          !INVOICE_AutCodeErr && INVOICE_AutCode
                            ? styles.payBtn
                            : styles.nopayBtn,
                        ]}
                      >
                        <Text
                          style={{
                            lineHeight: 40,
                            color:
                              !INVOICE_AutCodeErr && INVOICE_AutCode
                                ? "#fff"
                                : "#bcbec3",
                            textAlign: "center",
                          }}
                        >
                          我已经成功存款
                        </Text>
                      </Touch>
                    </View>
                  </View>
                </View>
              </View>
            )}
          {activeDeposit == "CTC" && !this.state.INVOICE_AUT && !this.state.CTC_INVOICE_OTC && (
            <View>
              <View style={{ paddingBottom: 20 }}>
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    marginTop: 20,
                  }}
                >
                  {CTC_code == "USDT-TRC20" && (
                    <View style={styles.noPage}>
                      <Text style={{ color: "#fff", fontSize: 11, padding: 1 }}>
                        免手续费
                      </Text>
                    </View>
                  )}
                  <View style={styles.CTCtOP}>
                    <Image
                      resizeMode="contain"
                      source={bankImage[CTC_code]}
                      style={{ width: 98, height: 30, marginTop: 5 }}
                    />
                    <Text style={{ color: "#000", lineHeight: 35 }}>
                      {activeName}
                    </Text>
                  </View>
                  <View style={[styles.CTClist, { borderColor: "#fff" }]}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#666666",
                        marginBottom: 20,
                      }}
                    >
                      参考汇率
                    </Text>
                    <Text
                      style={{ fontSize: 12, color: "#000", marginBottom: 20 }}
                    >
                      1 {payCallback.baseCurrency} = {payCallback.exchangeRate}{" "}
                      RMB
                    </Text>
                  </View>
                  <View style={{ padding: 15 }}>
                    <View
                      style={{ backgroundColor: "#d6f0ff", borderRadius: 5 }}
                    >
                      <Text
                        style={{
                          paddingLeft: 10,
                          lineHeight: 40,
                          color: "#00a6ff",
                          fontSize: 12,
                        }}
                      >
                        请注意在完成交易时，汇率可能会发生变化。
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.CTClist, { padding: 0 }]}></View>
                  <View style={[styles.CTClist, { alignItems: "flex-start" }]}>
                    <Text style={{ fontSize: 12, color: "#666666" }}>
                      二维码
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {payCallback.deepLink != "" && (
                        <ViewShot
                          ref="viewShot"
                          options={{ format: "jpg", quality: 0.9 }}
                        >
                          {
                            <QRCodeA
                              ref="viewShot"
                              value={payCallback.deepLink}
                              size={160}
                              bgColor="#000"
                            />
                          }
                        </ViewShot>
                      )}
                    </View>
                  </View>
                  <View style={{ padding: 15 }}>
                    <Text style={{ fontSize: 12, color: "#666666" }}>
                      收款地址
                    </Text>
                    <View
                      style={{
                        borderRadius: 5,
                        paddingLeft: 15,
                        paddingRight: 35,
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#666666",
                          lineHeight: 40,
                        }}
                        numberOfLines={1}
                      >
                        {payCallback.walletAddress}
                      </Text>
                      <Touch
                        onPress={() => {
                          PiwikEvent("Copy_crypto_deposit");
                          this.copy(payCallback.walletAddress);
                        }}
                        style={{ position: "absolute", right: 0, width: 35 }}
                      >
                        <Text
                          style={{
                            color: "#1C8EFF",
                            fontSize: 12,
                            lineHeight: 40,
                          }}
                        >
                          复制
                        </Text>
                      </Touch>
                    </View>
                  </View>
                  <View style={{ padding: 15 }}>
                    <View
                      style={{ backgroundColor: "#d6f0ff", borderRadius: 5 }}
                    >
                      <Text
                        style={{
                          paddingLeft: 10,
                          lineHeight: 20,
                          color: "#00a6ff",
                          fontSize: 12,
                        }}
                      >
                        最低存款数量：{payCallback.minAmt}{" "}
                        {payCallback.baseCurrency}{" "}
                      </Text>
                      <Text
                        style={{
                          paddingLeft: 10,
                          lineHeight: 20,
                          color: "#00a6ff",
                          fontSize: 12,
                        }}
                      >
                        该收款地址是您的专属地址，可以多次使用。
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Touch
                    onPress={() => {
                      PiwikEvent("Close_crypto_deposit");
                      Actions.pop();
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
                        fontSize: 14,
                        lineHeight: 42,
                        textAlign: "center",
                      }}
                    >
                      关闭
                    </Text>
                  </Touch>
                </View>
              </View>
            </View>
          )}
          {activeDeposit != "CTC" && !PayAready && (
            <View>
              {activeDeposit == "LB" && (
                <View style={{ marginBottom: Bottoms ? 80 : 0 }}>
                  <View style={{ paddingBottom: 15 }}>
                    <View
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 5,
                        marginTop: 15,
                      }}
                    >
                      <View style={{ padding: 10 }}>
                        <View
                          style={{
                            backgroundColor: "#fff5bf",
                            borderRadius: 5,
                            padding: 10,
                          }}
                        >
                          <Text
                            style={{
                              paddingLeft: 10,
                              lineHeight: 21,
                              color: "#83630b",
                              fontSize: 12,
                            }}
                          >
                            交易生成时间{" "}
                            {payCallback.submittedAt != "" &&
                              payCallback.submittedAt
                                .split("T")
                                .join("  ")
                                .split(".")[0]}
                          </Text>
                          <Text
                            style={{
                              paddingLeft: 10,
                              lineHeight: 21,
                              color: "#83630b",
                              fontSize: 12,
                            }}
                          >
                            请在{Countdown}分钟内完成支付，或者系统自动延迟交易
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          paddingLeft: 10,
                          color: "#999999",
                          paddingBottom: 15,
                        }}
                      >
                        您的存款信息:
                      </Text>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12, color: "#999999" }}>
                          存款金额
                        </Text>
                        <View style={styles.copyView}>
                          <Text style={{ fontSize: 18, color: "#000" }}>
                            ￥{payCallback.uniqueAmount}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(payCallback.uniqueAmount);
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12, color: "#999999" }}>
                          存款人姓名
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontSize: 12, color: "#666" }}>
                            {propsData.userName.replace(/./g, "*")}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12, color: "#999999" }}>
                          支付类型
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontSize: 12, color: "#222222" }}>
                            银行卡
                          </Text>
                        </View>
                      </View>
                      <View style={styles.line} />
                      <Text
                        style={{
                          fontSize: 12,
                          paddingLeft: 10,
                          color: "#999999",
                          paddingTop: 15,
                          paddingBottom: 15,
                        }}
                      >
                        我们的收款账户：
                      </Text>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12, color: "#999" }}>
                          银行名称
                        </Text>
                        <View style={styles.copyView}>
                          <Text style={{ fontSize: 12, color: "#666" }}>
                            {payCallback.returnedBankDetails.bankName}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(
                                payCallback.returnedBankDetails.bankName
                              );
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12, color: "#999999" }}>
                          账户姓名
                        </Text>
                        <View style={styles.copyView}>
                          <Text style={{ fontSize: 12, color: "#666" }}>
                            {payCallback.returnedBankDetails.accountHolderName}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(
                                payCallback.returnedBankDetails
                                  .accountHolderName
                              );
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12, color: "#999999" }}>
                          收款账号
                        </Text>
                        <View style={styles.copyView}>
                          <Text style={{ fontSize: 12, color: "#666" }}>
                            {payCallback.returnedBankDetails.accountNumber}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(
                                payCallback.returnedBankDetails.accountNumber
                              );
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12, color: "#999999" }}>
                          省/自治区
                        </Text>
                        <View style={styles.copyView}>
                          <Text style={{ fontSize: 12, color: "#666" }}>
                            {payCallback.returnedBankDetails.province}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(
                                payCallback.returnedBankDetails.province
                              );
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12, color: "#999999" }}>
                          城市/城镇
                        </Text>
                        <View style={styles.copyView}>
                          <Text style={{ fontSize: 12, color: "#666" }}>
                            {payCallback.returnedBankDetails.city}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(payCallback.returnedBankDetails.city);
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12, color: "#999999" }}>
                          分行
                        </Text>
                        <View style={styles.copyView}>
                          <Text style={{ fontSize: 12, color: "#666" }}>
                            {payCallback.returnedBankDetails.branch}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(payCallback.returnedBankDetails.branch);
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={{ backgroundColor: "#fff", borderRadius: 5 }}>
                    <Touch
                      style={styles.odleNum}
                      onPress={() => {
                        this.otherBankPiwik();
                        this.setState({ otherAccount: !otherAccount });
                      }}
                    >
                      <Text style={{ color: "#666", fontSize: 12 }}>
                        糟了! 我存到旧账号了
                      </Text>
                      <Image
                        resizeMode="stretch"
                        source={
                          otherAccount
                            ? require("../../images/up.png")
                            : require("../../images/down.png")
                        }
                        style={{
                          width: 16,
                          height: 16,
                          position: "absolute",
                          right: 10,
                        }}
                      />
                    </Touch>
                    {otherAccount && (
                      <View>
                        <View style={styles.inputView}>
                          <TextInput
                            value={otherBank}
                            style={{
                              color: "#000",
                              height: 38,
                              width: width - 80,
                            }}
                            placeholder={"请输入旧账号后6位数字"}
                            placeholderTextColor="#BCBEC3"
                            maxLength={6}
                            onChangeText={(value) => {
                              this.otherBank(value);
                            }}
                            onFocus={() => {
                              this.setState({ Bottoms: true });
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            color: "red",
                            fontSize: 12,
                            paddingLeft: 15,
                          }}
                        >
                          {otherBankST != "" && otherBankST}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 5,
                      marginTop: 15,
                      padding: 15,
                    }}
                  >
                    <View style={styles.recommended}>
                      <Text
                        style={{
                          color: "#666666",
                          paddingRight: 10,
                          fontSize: 12,
                        }}
                      >
                        上传存款凭证
                      </Text>
                      <View style={styles.recommendedIcon}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#323232",
                            fontWeight: "bold",
                          }}
                        >
                          推荐使用
                        </Text>
                      </View>
                    </View>
                    {uploadMsg != "success" && (
                      <Touch
                        style={styles.upload}
                        onPress={() => {
                          this.setState({ upload: true });
                        }}
                      >
                        <View style={styles.uploadIcon}>
                          <Text
                            style={{
                              color: "#fff",
                              lineHeight: 16,
                              fontSize: 16,
                            }}
                          >
                            +
                          </Text>
                        </View>
                        <Text style={{ paddingLeft: 15, color: "#999" }}>
                          上传存款凭证以利款项快速到帐
                        </Text>
                      </Touch>
                    )}
                    {uploadMsg == "success" && (
                      <View
                        style={[
                          styles.upload,
                          { justifyContent: "flex-start" },
                        ]}
                      >
                        <Text style={{ paddingLeft: 15, color: "#323232" }}>
                          {this.state.uploadData.avatarName}
                        </Text>
                      </View>
                    )}
                    <Touch
                      style={[styles.upload, { justifyContent: "flex-start" }]}
                      onPress={() => {
                        LiveChatOpenGlobe();
                      }}
                    >
                      <Text
                        style={{
                          paddingLeft: 15,
                          color: "#666666",
                          fontSize: 12,
                        }}
                      >
                        若您无法上传凭证，请联系
                        <Text
                          style={{
                            color: "#00A6FF",
                            textDecorationLine: "underline",
                            fontSize: 12,
                          }}
                        >
                          在线客服
                        </Text>
                        。
                      </Text>
                    </Touch>
                  </View>
                  <Touch
                    onPress={() => {
                      this.okPay();
                    }}
                    style={{
                      backgroundColor: "#00A6FF",
                      borderRadius: 10,
                      width: width - 30,
                      marginTop: 30,
                      marginButtom: 30,
                    }}
                  >
                    <Text
                      style={{
                        lineHeight: 40,
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      我已经成功存款
                    </Text>
                  </Touch>

                  <View style={{ width: width - 55 }}>
                    <LBPrompt />
                  </View>
                </View>
              )}
              {activeDeposit == "WCLB" && (
                <View style={{ marginBottom: Bottoms ? 80 : 0 }}>
                  <View style={{ paddingBottom: 20 }}>
                    <View
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 5,
                        marginTop: 15,
                        paddingTop: 10,
                      }}
                    >
                      <View style={{ padding: 15 }}>
                        <View
                          style={{
                            backgroundColor: "#fff5bf",
                            borderRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              paddingLeft: 10,
                              lineHeight: 40,
                              color: "#83630b",
                              fontSize: 12,
                            }}
                          >
                            请在{Countdown}分钟内完成支付，或者系统自动延迟交易
                          </Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 12, paddingLeft: 10 }}>
                        您的存款信息:
                      </Text>
                      <View style={styles.LBdetials1}>
                        <Text style={{ fontSize: 12 }}>存款金额</Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontSize: 18, color: "#222222" }}>
                            ￥{payCallback.uniqueAmount}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(payCallback.uniqueAmount);
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                      <View style={styles.line} />
                      <Text
                        style={{
                          fontSize: 12,
                          paddingLeft: 10,
                          paddingTop: 15,
                          paddingBottom: 15,
                        }}
                      >
                        我们的收款账户：
                      </Text>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12, color: "#999" }}>
                          银行名称
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontSize: 12, color: "#222222" }}>
                            {depositDate.bankName}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(depositDate.bankName);
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12 }}>账户姓名</Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontSize: 12, color: "#222222" }}>
                            {depositDate.accountHolderName}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(depositDate.accountHolderName);
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12 }}>收款账号</Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontSize: 12, color: "#222222" }}>
                            {depositDate.accountNo}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(depositDate.accountNo);
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12 }}>省/自治区</Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontSize: 12, color: "#222222" }}>
                            {depositDate.province || "-"}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(depositDate.province);
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12 }}>城市/城镇</Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontSize: 12, color: "#222222" }}>
                            {depositDate.city || "-"}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(depositDate.city);
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                      <View style={styles.LBdetials}>
                        <Text style={{ fontSize: 12 }}>分行</Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontSize: 12, color: "#222222" }}>
                            {depositDate.branch || "-"}
                          </Text>
                          <Touch
                            onPress={() => {
                              this.copy(depositDate.branch);
                            }}
                          >
                            <Text style={styles.copyTxt}>复制</Text>
                          </Touch>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 5,
                      marginTop: 10,
                    }}
                  >
                    <Touch
                      style={styles.odleNum}
                      onPress={() => {
                        this.otherBankPiwik();
                        this.setState({ otherAccount: !otherAccount });
                      }}
                    >
                      <Text style={{ color: "#666" }}>
                        糟了! 我存到旧账号了
                      </Text>
                      <Image
                        resizeMode="stretch"
                        source={
                          otherAccount
                            ? require("../../images/up.png")
                            : require("../../images/down.png")
                        }
                        style={{
                          width: 16,
                          height: 16,
                          position: "absolute",
                          right: 10,
                        }}
                      />
                    </Touch>
                    {otherAccount && (
                      <View>
                        <View style={styles.inputView}>
                          <TextInput
                            value={otherBank}
                            style={{
                              color: "#000",
                              height: 38,
                              width: width - 80,
                            }}
                            placeholder={"请输入旧账号后6位数字"}
                            placeholderTextColor="#BCBEC3"
                            maxLength={6}
                            onChangeText={(value) => {
                              this.otherBank(value);
                            }}
                            onFocus={() => {
                              this.setState({ Bottoms: true });
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            color: "red",
                            fontSize: 12,
                            paddingLeft: 15,
                          }}
                        >
                          {otherBankST != "" && otherBankST}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Touch
                    onPress={() => {
                      this.okPay();
                    }}
                    style={{
                      backgroundColor: prompt ? "#999999" : "#00A6FF",
                      borderRadius: 10,
                      width: width - 30,
                      marginTop: 30,
                      marginButtom: 30,
                    }}
                  >
                    <Text
                      style={{
                        lineHeight: 40,
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      我已经成功存款
                    </Text>
                  </Touch>
                </View>
              )}
              {activeDeposit == "ALB" && (
                <View style={{ marginBottom: Bottoms ? 80 : 0 }}>
                  <View style={{ paddingBottom: 20 }}>
                    {
                      // 银行卡
                      this.state.ALBTypeActive == "bank" && (
                        <View>
                          <View
                            style={{
                              backgroundColor: "#fff",
                              borderRadius: 5,
                              marginTop: 15,
                              paddingTop: 10,
                            }}
                          >
                            <View style={{ padding: 15 }}>
                              <View
                                style={{
                                  backgroundColor: "#fff5bf",
                                  borderRadius: 5,
                                }}
                              >
                                <Text
                                  style={{
                                    paddingLeft: 10,
                                    lineHeight: 40,
                                    color: "#83630b",
                                    fontSize: 12,
                                  }}
                                >
                                  请在{Countdown}
                                  分钟内完成支付，或者系统自动延迟交易
                                </Text>
                              </View>
                            </View>
                            {/* <View style={[styles.LBdetials, { flexWrap: 'wrap' }]}>
                                        <Text style={{ color: '#F92D2D', width: width - 60, fontSize: 12 }}>交易生成时间 {payCallback.submittedAt != '' && payCallback.submittedAt.split("T").join("  ").split('.')[0]}</Text>
                                        <Text style={{ color: '#000', fontSize: 12 }}>请在30分钟内完成支付，必须转入系统生成的金额方能极速到账。请务必按显示金额存款, 否则将延迟该笔存款到账。 </Text>
                                    </View> */}
                            <Text style={{ fontSize: 12, paddingLeft: 10 }}>
                              您的存款信息:
                            </Text>
                            <View style={styles.LBdetials1}>
                              <Text style={{ fontSize: 12 }}>存款金额</Text>
                              <View style={{ flexDirection: "row" }}>
                                <Text
                                  style={{ fontSize: 18, color: "#222222" }}
                                >
                                  ￥{payCallback.uniqueAmount}
                                </Text>
                                <Touch
                                  onPress={() => {
                                    this.copy(payCallback.uniqueAmount);
                                  }}
                                >
                                  <Text style={styles.copyTxt}>复制</Text>
                                </Touch>
                              </View>
                            </View>
                            <View style={styles.line} />
                            <Text
                              style={{
                                fontSize: 12,
                                paddingLeft: 10,
                                paddingTop: 15,
                                paddingBottom: 15,
                              }}
                            >
                              我们的收款账户：
                            </Text>
                            <View style={styles.LBdetials}>
                              <Text style={{ fontSize: 12, color: "#999" }}>
                                银行名称
                              </Text>
                              <View style={{ flexDirection: "row" }}>
                                <Text
                                  style={{ fontSize: 12, color: "#222222" }}
                                >
                                  {payCallback.returnedBankDetails.bankName}
                                </Text>
                                <Touch
                                  onPress={() => {
                                    this.copy(
                                      payCallback.returnedBankDetails.bankName
                                    );
                                  }}
                                >
                                  <Text style={styles.copyTxt}>复制</Text>
                                </Touch>
                              </View>
                            </View>
                            <View style={styles.LBdetials}>
                              <Text style={{ fontSize: 12 }}>账户姓名</Text>
                              <View style={{ flexDirection: "row" }}>
                                <Text
                                  style={{ fontSize: 12, color: "#222222" }}
                                >
                                  {
                                    payCallback.returnedBankDetails
                                      .accountHolderName
                                  }
                                </Text>
                                <Touch
                                  onPress={() => {
                                    this.copy(
                                      payCallback.returnedBankDetails
                                        .accountHolderName
                                    );
                                  }}
                                >
                                  <Text style={styles.copyTxt}>复制</Text>
                                </Touch>
                              </View>
                            </View>
                            <View style={styles.LBdetials}>
                              <Text style={{ fontSize: 12 }}>收款账号</Text>
                              <View style={{ flexDirection: "row" }}>
                                <Text
                                  style={{ fontSize: 12, color: "#222222" }}
                                >
                                  {
                                    payCallback.returnedBankDetails
                                      .accountNumber
                                  }
                                </Text>
                                <Touch
                                  onPress={() => {
                                    this.copy(
                                      payCallback.returnedBankDetails
                                        .accountNumber
                                    );
                                  }}
                                >
                                  <Text style={styles.copyTxt}>复制</Text>
                                </Touch>
                              </View>
                            </View>
                            <View style={styles.LBdetials}>
                              <Text style={{ fontSize: 12 }}>省/自治区</Text>
                              <View style={{ flexDirection: "row" }}>
                                <Text
                                  style={{ fontSize: 12, color: "#222222" }}
                                >
                                  {payCallback.returnedBankDetails.province}
                                </Text>
                                <Touch
                                  onPress={() => {
                                    this.copy(
                                      payCallback.returnedBankDetails.province
                                    );
                                  }}
                                >
                                  <Text style={styles.copyTxt}>复制</Text>
                                </Touch>
                              </View>
                            </View>
                            <View style={styles.LBdetials}>
                              <Text style={{ fontSize: 12 }}>城市/城镇</Text>
                              <View style={{ flexDirection: "row" }}>
                                <Text
                                  style={{ fontSize: 12, color: "#222222" }}
                                >
                                  {payCallback.returnedBankDetails.city}
                                </Text>
                                <Touch
                                  onPress={() => {
                                    this.copy(
                                      payCallback.returnedBankDetails.city
                                    );
                                  }}
                                >
                                  <Text style={styles.copyTxt}>复制</Text>
                                </Touch>
                              </View>
                            </View>
                            <View style={styles.LBdetials}>
                              <Text style={{ fontSize: 12 }}>分行</Text>
                              <View style={{ flexDirection: "row" }}>
                                <Text
                                  style={{ fontSize: 12, color: "#222222" }}
                                >
                                  {payCallback.returnedBankDetails.branch}
                                </Text>
                                <Touch
                                  onPress={() => {
                                    this.copy(
                                      payCallback.returnedBankDetails.branch
                                    );
                                  }}
                                >
                                  <Text style={styles.copyTxt}>复制</Text>
                                </Touch>
                              </View>
                            </View>
                            {propsData.bonusTitle != "" && (
                              <View style={styles.LBdetials}>
                                <Text style={{ fontSize: 12 }}>
                                  已申请彩金优惠
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: "#222222",
                                    width: width / 2.5,
                                  }}
                                >
                                  {propsData.bonusTitle}
                                </Text>
                              </View>
                            )}
                          </View>
                          <View
                            style={{
                              backgroundColor: "#fff",
                              borderRadius: 5,
                              marginTop: 10,
                            }}
                          >
                            <Touch
                              style={styles.odleNum}
                              onPress={() => {
                                this.otherBankPiwik();
                                this.setState({ otherAccount: !otherAccount });
                              }}
                            >
                              <Text style={{ color: "#666" }}>
                                糟了! 我存到旧账号了
                              </Text>
                              <Image
                                resizeMode="stretch"
                                source={
                                  otherAccount
                                    ? require("../../images/up.png")
                                    : require("../../images/down.png")
                                }
                                style={{
                                  width: 16,
                                  height: 16,
                                  position: "absolute",
                                  right: 10,
                                }}
                              />
                            </Touch>
                            {otherAccount && (
                              <View>
                                <View style={styles.inputView}>
                                  <TextInput
                                    value={otherBank}
                                    style={{
                                      color: "#000",
                                      height: 38,
                                      width: width - 80,
                                    }}
                                    placeholder={"请输入旧账号后6位数字"}
                                    placeholderTextColor="#BCBEC3"
                                    maxLength={6}
                                    onChangeText={(value) => {
                                      this.otherBank(value);
                                    }}
                                    onFocus={() => {
                                      this.setState({ Bottoms: true });
                                    }}
                                  />
                                </View>
                                <Text
                                  style={{
                                    color: "red",
                                    fontSize: 12,
                                    paddingLeft: 15,
                                  }}
                                >
                                  {otherBankST != "" && otherBankST}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      )
                    }
                    {this.state.ALBTypeActive == "qrcode" && (
                      <View>
                        <View
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: 5,
                            marginTop: 15,
                            paddingTop: 10,
                          }}
                        >
                          <View style={{ padding: 15 }}>
                            <View
                              style={{
                                backgroundColor: "#fff5bf",
                                borderRadius: 5,
                              }}
                            >
                              <Text
                                style={{
                                  paddingLeft: 10,
                                  lineHeight: 40,
                                  color: "#83630b",
                                  fontSize: 12,
                                }}
                              >
                                二维码有效期{Countdown}, 请在有效期内完成支付
                              </Text>
                            </View>
                          </View>
                          <View style={styles.LBdetials}>
                            <Text style={{ fontSize: 12 }}>存款金额</Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text style={{ fontSize: 18, color: "#222222" }}>
                                ￥{payCallback.uniqueAmount}
                              </Text>
                              <Touch
                                onPress={() => {
                                  this.copy(payCallback.uniqueAmount);
                                }}
                              >
                                <Text style={styles.copyTxt}>复制</Text>
                              </Touch>
                            </View>
                          </View>
                          <View>
                            <View
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                padding: 15,
                                flexDirection: "row",
                              }}
                            >
                              <Text style={{ fontSize: 12 }}>二维码</Text>
                              {payCallback.redirectUrl != "" && (
                                <ViewShot
                                  ref="viewShot"
                                  options={{ format: "jpg", quality: 0.9 }}
                                >
                                  {
                                    // Platform.OS == "ios" &&
                                    // <QRCodeS ref="viewShot"
                                    //     value={payCallback.redirectUrl}
                                    //     size={160}
                                    //     bgColor='#000'
                                    // />
                                  }

                                  {
                                    <QRCodeA
                                      ref="viewShot"
                                      value={payCallback.redirectUrl}
                                      size={180}
                                      bgColor="#000"
                                    />
                                  }
                                </ViewShot>
                              )}
                            </View>
                          </View>
                        </View>
                        <View
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: 5,
                            marginTop: 10,
                          }}
                        >
                          <Touch
                            style={styles.odleNum}
                            onPress={() => {
                              this.otherBankPiwik();
                              this.setState({ otherAccount: !otherAccount });
                            }}
                          >
                            <Text style={{ color: "#666" }}>
                              糟了! 我存到旧账号了
                            </Text>
                            <Image
                              resizeMode="stretch"
                              source={
                                otherAccount
                                  ? require("../../images/up.png")
                                  : require("../../images/down.png")
                              }
                              style={{
                                width: 16,
                                height: 16,
                                position: "absolute",
                                right: 10,
                              }}
                            />
                          </Touch>
                          {otherAccount && (
                            <View>
                              <View style={styles.inputView}>
                                <TextInput
                                  value={otherBank}
                                  style={{
                                    color: "#000",
                                    height: 38,
                                    width: width - 80,
                                  }}
                                  placeholder={"请输入旧账号后6位数字"}
                                  placeholderTextColor="#BCBEC3"
                                  maxLength={6}
                                  onChangeText={(value) => {
                                    this.otherBank(value);
                                  }}
                                  onFocus={() => {
                                    this.setState({ Bottoms: true });
                                  }}
                                />
                              </View>
                              <Text
                                style={{
                                  color: "red",
                                  fontSize: 12,
                                  paddingLeft: 15,
                                }}
                              >
                                {otherBankST != "" && otherBankST}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    )}
                    <Touch
                      onPress={() => {
                        this.okPay();
                      }}
                      style={{
                        backgroundColor: prompt ? "#999999" : "#00A6FF",
                        borderRadius: 10,
                        width: width - 30,
                        marginTop: 30,
                        marginButtom: 30,
                      }}
                    >
                      <Text
                        style={{
                          lineHeight: 40,
                          textAlign: "center",
                          color: "#fff",
                        }}
                      >
                        我已经成功存款
                      </Text>
                    </Touch>
                  </View>
                </View>
              )}
            </View>
          )}
          {(activeDeposit != "CTC" || this.state.INVOICE_AUT) && PayAready && (
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
                <View style={styles.detials}>
                  <Text style={{ fontSize: 12 }}>存款金额</Text>
                  <Text style={{ color: "#000" }}>
                    ￥{payCallback.uniqueAmount}
                  </Text>
                </View>
                <View style={styles.detials}>
                  <Text style={{ fontSize: 12 }}>交易单号</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 12, color: "#222222" }}>
                      {payCallback.transactionId}
                    </Text>
                    <Touch
                      onPress={() => {
                        this.copy(payCallback.transactionId);
                      }}
                    >
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
                    <View style={styles.steps2} />
                  </View>
                  <View style={styles.stepsLeft}>
                    <View style={{ marginBottom: 10 }}>
                      <Text style={[styles.stepeTxt, { color: "#00a6ff" }]}>
                        提交成功
                      </Text>
                      <Text style={[styles.stepeTxtSec, { lineHeight: 35 }]}>
                        处理中
                      </Text>
                    </View>
                    <Text style={styles.stepeTxt}>预计30:00分钟到账</Text>
                  </View>
                </View>
              </View>
              <View style={{ paddingTop: 15 }}>
                <Text
                  style={{
                    color: "#999",
                    textAlign: "center",
                    fontSize: 12,
                    lineHeight: 20,
                  }}
                >
                  您可以回到首页继续投注，请等待30:00分钟以刷新金额，
                </Text>
                <Text
                  style={{
                    color: "#999",
                    textAlign: "center",
                    fontSize: 12,
                    lineHeight: 20,
                  }}
                >
                  如果有任何问题，请联系我们的在线客服
                </Text>
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
                      fontWeight: "bold",
                      lineHeight: 42,
                      textAlign: "center",
                    }}
                  >
                    回到首页
                  </Text>
                </Touch>
              </View>

            </View>
          )}

          {activeDeposit === "PPB" && (
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
                <View style={styles.detials}>
                  <Text style={{ fontSize: 12, color: "#999999" }}>
                    存款金额
                  </Text>
                  <Text
                    style={{ color: "#222", fontSize: 20, fontWeight: "bold" }}
                  >
                    ￥{this.props.data?.moneys}
                  </Text>
                </View>
                <View style={styles.detials}>
                  <Text style={{ fontSize: 12, color: "#999999" }}>
                    交易单号
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 14, color: "#222222" }}>
                      {payCallback.transactionId}
                    </Text>
                    <Touch
                      onPress={() => {
                        this.copy(payCallback.transactionId);
                      }}
                    >
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
                    <View style={styles.steps2} />
                  </View>
                  <View style={styles.stepsLeft}>
                    <View style={{ marginBottom: 10 }}>
                      <Text style={[styles.stepeTxt, { color: "#00a6ff" }]}>
                        提交成功
                      </Text>
                      <Text style={[styles.stepeTxtSec, { lineHeight: 35 }]}>
                        处理中
                      </Text>
                    </View>
                    <Text style={styles.stepeTxt}>预计10:00分钟到账</Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 5,
                  marginTop: 15,
                  padding: 15,
                }}
              >
                <View style={styles.recommended}>
                  <Text
                    style={{ color: "#666666", paddingRight: 10, fontSize: 12 }}
                  >
                    上传存款凭证
                  </Text>
                  <View style={styles.recommendedIcon}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#323232",
                        fontWeight: "bold",
                      }}
                    >
                      推荐使用
                    </Text>
                  </View>
                </View>
                {uploadMsg != "success" && (
                  <Touch
                    style={styles.upload}
                    onPress={() => {
                      this.setState({ upload: true });
                    }}
                  >
                    <View style={styles.uploadIcon}>
                      <Text
                        style={{ color: "#fff", lineHeight: 16, fontSize: 16 }}
                      >
                        +
                      </Text>
                    </View>
                    <Text
                      style={{ paddingLeft: 15, color: "#999", fontSize: 13 }}
                    >
                      上传存款凭证以利款项快速到帐
                    </Text>
                  </Touch>
                )}
                {uploadMsg == "success" && (
                  <View
                    style={[styles.upload, { justifyContent: "flex-start" }]}
                  >
                    <Text style={{ paddingLeft: 15, color: "#323232" }}>
                      {this.state.uploadData.avatarName}
                    </Text>
                  </View>
                )}
                <Touch
                  style={[styles.upload, { justifyContent: "flex-start" }]}
                  onPress={() => {
                    LiveChatOpenGlobe();
                  }}
                >
                  <Text
                    style={{ paddingLeft: 15, color: "#999", fontSize: 12 }}
                  >
                    若您无法上传凭证，请联系
                    <Text
                      style={{
                        color: "#00A6FF",
                        textDecorationLine: "underline",
                        fontSize: 12,
                      }}
                    >
                      在线客服
                    </Text>
                    。
                  </Text>
                </Touch>
              </View>

              <View style={{ paddingTop: 15 }}>
                <Text
                  style={{
                    color: "#999",
                    textAlign: "center",
                    fontSize: 12,
                    lineHeight: 20,
                  }}
                >
                  您可以回到首页继续投注，请等待10:00分钟以刷新金额，
                </Text>
                <Text
                  style={{
                    color: "#999",
                    textAlign: "center",
                    fontSize: 12,
                    lineHeight: 20,
                  }}
                >
                  如果有任何问题，请联系我们的在线客服
                </Text>
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
                      fontWeight: "bold",
                      lineHeight: 42,
                      textAlign: "center",
                    }}
                  >
                    回到首页
                  </Text>
                </Touch>
              </View>
            </View>
          )}
          {this.state.CTC_INVOICE_OTC || goThirdPartyPageList.some(v => v === activeDeposit) ? (
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
                <View style={styles.detials}>
                  <Text style={{ fontSize: 12, color: "#999999" }}>
                    存款金额
                  </Text>
                  <Text
                    style={{ color: "#222", fontSize: 20, fontWeight: "bold" }}
                  >
                    ￥{this.props.data?.moneys}
                  </Text>
                </View>
                <View style={styles.detials}>
                  <Text style={{ fontSize: 12, color: "#999999" }}>
                    交易单号
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 14, color: "#222222" }}>
                      {payCallback.transactionId}
                    </Text>
                    <Touch
                      onPress={() => {
                        this.copy(payCallback.transactionId);
                      }}
                    >
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
                    <View style={styles.steps2} />
                  </View>
                  <View style={styles.stepsLeft}>
                    <View style={{ marginBottom: 10 }}>
                      <Text style={[styles.stepeTxt, { color: "#00a6ff" }]}>
                        提交成功
                      </Text>
                      <Text style={[styles.stepeTxtSec, { lineHeight: 35 }]}>
                        处理中
                      </Text>
                    </View>
                    <Text style={styles.stepeTxt}>预计10:00分钟到账</Text>
                  </View>
                </View>
              </View>



              <View style={{ paddingTop: 15 }}>
                <Text
                  style={{
                    color: "#999",
                    textAlign: "center",
                    fontSize: 12,
                    lineHeight: 20,
                  }}
                >
                  您可以回到首页继续投注，请等待10:00分钟以刷新金额，
                </Text>
                <Text
                  style={{
                    color: "#999",
                    textAlign: "center",
                    fontSize: 12,
                    lineHeight: 20,
                  }}
                >
                  如果有任何问题，请联系我们的在线客服
                </Text>
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
                      fontWeight: "bold",
                      lineHeight: 42,
                      textAlign: "center",
                    }}
                  >
                    回到首页
                  </Text>
                </Touch>
              </View>

            </View>
          ) : null}

          <View style={{ height: 50 }} />
        </ScrollView>
        {/*客服懸浮球*/}
        {/* <LivechatDragHoliday /> */}
      </View>
    );
  }
}

export default DepositCenterPage;

const styles = StyleSheet.create({
  copyView: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  errTxt: {
    color: "#F11818",
    paddingBottom: 20,
    width: width - 50,
    paddingLeft: 20,
  },
  protective: {
    position: "absolute",
    zIndex: 999999,
    width: width,
    height: height,
    top: -height / 2,
    left: -width / 1.5,
  },
  lodingModal: {
    position: "absolute",
    backgroundColor: "#333333",
    padding: 20,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  uploadView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingLeft: 15,
    height: 45,
    width: width - 80,
    marginBottom: 15,
  },
  uploadBtn: {
    position: "absolute",
    right: 10,
    backgroundColor: "#00A6FF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    width: 72,
    borderRadius: 8,
  },
  uploadModal: {
    padding: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingTop: 0,
  },
  modalBtnclose: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#00A6FF",
    width: (width - 100) / 2,
    marginRight: 15,
  },
  modalBtnok: {
    borderRadius: 5,
    backgroundColor: "#00A6FF",
    width: (width - 100) / 2,
  },
  uploadIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 16,
    height: 16,
    borderRadius: 16,
    backgroundColor: "#999999",
  },
  upload: {
    width: width - 60,
    backgroundColor: "#F5F5F5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 8,
    height: 42,
    marginBottom: 10,
  },
  recommended: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  recommendedIcon: {
    backgroundColor: "#FFE273",
    padding: 5,
    borderRadius: 4,
  },
  AutModalCloseTxt: {
    lineHeight: 40,
    color: "#00a6ff",
    textAlign: "center",
  },
  AutModalClose: {
    borderWidth: 1,
    borderColor: "#00a6ff",
    borderRadius: 8,
    width: (width - 40) * 0.4,
    marginRight: 30,
  },
  AutModalok: {
    backgroundColor: "#00a6ff",
    borderRadius: 8,
    width: (width - 40) * 0.4,
  },
  AutModalokTxt: {
    lineHeight: 40,
    color: "#fff",
    textAlign: "center",
  },
  closeBtn: {
    borderWidth: 1,
    borderColor: "#00a6ff",
    borderRadius: 10,
    width: width * 0.39,
  },
  payBtn: {
    backgroundColor: "#00a6ff",
    borderRadius: 10,
    width: width * 0.39,
  },
  nopayBtn: {
    backgroundColor: "#efeff4",
    borderRadius: 10,
    width: width * 0.39,
  },
  CTCtxt: { paddingLeft: 10, lineHeight: 20, color: "#00a6ff", fontSize: 12 },
  noPage: {
    backgroundColor: "#eb2121",
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
    position: "absolute",
    right: 0,
    top: 0,
  },
  detials: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 15,
    width: width - 60,
  },
  stepeTxt: {
    color: "#666",
    fontSize: 12,
    width: 120,
    textAlign: "left",
  },
  stepeTxtSec: {
    color: "#666",
    fontSize: 11,
    width: 120,
    textAlign: "left",
  },
  stepsLeft: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
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
    display: "flex",
    height: 20,
    width: 20,
    borderRadius: 50,
    backgroundColor: "#108ee9",
    justifyContent: "center",
    alignItems: "center",
  },
  steps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    width: width - 60,
  },
  PayAready: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: width - 30,
  },
  depModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  LBdetials: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    paddingTop: 0,
  },
  LBdetials1: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
  },
  inputView: {
    backgroundColor: "#fff",
    borderRadius: 5,
    height: 38,
    display: "flex",
    alignItems: "center",
    marginTop: 5,
    borderWidth: 1,
    marginLeft: 15,
    width: width - 60,
    borderColor: "#E0E0E0",
  },
  secussModal: {
    // width: width / 1.2,
    // height: height / 3,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: width - 40,
    padding: 15,
    borderRadius: 10,
  },
  copyTxt: {
    fontSize: 12,
    color: "#1C8EFF",
    paddingLeft: 10,
  },
  CTCtOP: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  CTClist: {
    padding: 15,
    borderBottomColor: "#F3F3F3",
    borderBottomWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  odleNum: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: width - 30,
    height: 40,
    paddingLeft: 15,
  },
  line: {
    width: "95%",
    height: 1,
    backgroundColor: "#EFEFF4",
    justifyContent: "center",
    alignSelf: "center",
  },
});
