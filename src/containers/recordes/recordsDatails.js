import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Modal,
  TouchableHighlight,
  Dimensions, Platform,
} from "react-native";
import { Toast } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import moment from "moment";
import ViewShot from "react-native-view-shot";
import { fetchRequest } from "../../lib/SportRequest";
import ImagePicker from "react-native-image-picker";
import { Toasts } from "../Toast";
import AbleCompleteFromUIPop from './AbleCompleteFromUIPop'
import PiwikAction from "../../lib/utils/piwik";

const ManualDepositText = [
  "请您按照以下提示操作重新提交:   ",
  '1.点击"是的，我明白了"。',
  '2.点击"提交"。',
  "3.您无需转账，请等待存款记录显示后关闭。",
];

const CTCMethods = {
  OTC: "虚拟币交易所 (OTC)",
  INVOICE: "虚拟币支付 1",
  INVOICE_AUT: "虚拟币支付 2",
  CHANNEL: "极速虚拟币支付",
};

const DepositMethodType = {
  LB: {
    ALIQR: "ZFB 转 支付宝",
    LOCALBANK: "Local Bank",
  },
};

const { width, height } = Dimensions.get("window");
const DepositStatusPending = {
  //'Pending'

  text1: "处理中",
  color1: "#FABE47",
  borderColor1: "#BCBEC3",
  backgroundColor1: "#009DE3",
  opacity1: 1,

  text2: "存款成功",
  color2: "#BCBEC3",
  borderColor2: "#B2B2B2",
  backgroundColor2: "#B2B2B2",
  opacity2: 0.6,
};
const DepositStatus = {
  StatusId1: DepositStatusPending, //'Pending'
  StatusId2: {
    // 'Approved'

    text1: "处理中",
    color1: "#BCBEC3",
    borderColor1: "#BCBEC3",
    backgroundColor1: "#009DE3",
    opacity1: 1,

    text2: "存款成功",
    color2: "#0CCC3C",
    borderColor2: "#BCBEC3",
    backgroundColor2: "#83E300",
    opacity2: 1,
  },
  StatusId3: {
    //'Rejected'

    text1: "处理中",
    color1: "#BCBEC3",
    borderColor1: "#BCBEC3",
    backgroundColor1: "#009DE3",
    opacity1: 1,

    text2: "存款失败",
    color2: "#EB2121",
    borderColor2: "#BCBEC3",
    backgroundColor2: "#E30000",
    opacity2: 1,
  },
  StatusId4: DepositStatusPending, //' Vendor Processing'
  StatusId5: {
    //'time out'

    text1: "处理中",
    color1: "#BCBEC3",
    borderColor1: "#BCBEC3",
    backgroundColor1: "#009DE3",
    opacity1: 1,

    text2: "交易逾期",
    color2: "#EB2121",
    borderColor2: "#BCBEC3",
    backgroundColor2: "#E30000",
    opacity2: 1,
  },
};

const WithdrawalStatusPend = {
  //'等待浏览'

  text1: "待处理",
  color1: "#009DE3",
  borderColor1: "#BCBEC3",
  backgroundColor1: "#fff",
  opacity1: 1,

  text2: "处理中",
  color2: "#BCBEC3",
  borderColor2: "#B2B2B2",
  backgroundColor2: "#B2B2B2",
  opacity2: 0.6,

  text3: "提款成功",
  color3: "#BCBEC3",
  borderColor3: "#B2B2B2",
  backgroundColor3: "#B2B2B2",
  opacity3: 0.6,
};
const WithdrawalStatusPending = {
  //'进行中'

  text1: "待处理",
  color1: "#BCBEC3",
  borderColor1: "#BCBEC3",
  backgroundColor1: "#fff",
  opacity1: 1,

  text2: "处理中",
  color2: "#FABE47",
  borderColor2: "#BCBEC3",
  backgroundColor2: "#009DE3",
  opacity2: 1,

  text3: "提款成功",
  color3: "#BCBEC3",
  borderColor3: "#B2B2B2",
  backgroundColor3: "#B2B2B2",
  opacity3: 0.6,
};
const WithdrawalStatus = {
  StatusId1: WithdrawalStatusPend,
  StatusId2: WithdrawalStatusPending,
  StatusId3: WithdrawalStatusPending,
  StatusId4: {
    //'已完成'

    text1: "待处理",
    color1: "#BCBEC3",
    borderColor1: "#BCBEC3",
    backgroundColor1: "#fff",
    opacity1: 1,

    text2: "处理中",
    color2: "#BCBEC3",
    borderColor2: "#BCBEC3",
    backgroundColor2: "#009DE3",
    opacity2: 1,

    text3: "提款成功",
    color3: "#0CCC3C",
    borderColor3: "#BCBEC3",
    backgroundColor3: "#83E300",
    opacity3: 1,
  },
  StatusId5: {
    //'拒绝'

    text1: "待处理",
    color1: "#BCBEC3",
    borderColor1: "#BCBEC3",
    backgroundColor1: "#fff",
    opacity1: 1,

    text2: "处理中",
    color2: "#BCBEC3",
    borderColor2: "#BCBEC3",
    backgroundColor2: "#009DE3",
    opacity2: 1,

    text3: "提款失败",
    color3: "#EB2121",
    borderColor3: "#BCBEC3",
    backgroundColor3: "#E30000",
    opacity3: 1,
  },
  StatusId6: {
    //'取消'

    text1: "待处理",
    color1: "#BCBEC3",
    borderColor1: "#BCBEC3",
    backgroundColor1: "#fff",
    opacity1: 1,

    text2: "处理中",
    color2: "#BCBEC3",
    borderColor2: "#BCBEC3",
    backgroundColor2: "#009DE3",
    opacity2: 1,

    text3: "取消",
    color3: "#E30000",
    borderColor3: "#E30000",
    backgroundColor3: "#E30000",
    opacity3: 1,
  },
  StatusId7: WithdrawalStatusPend,
  StatusId8: WithdrawalStatusPending,
  StatusId9: WithdrawalStatusPending,
  StatusId10: {
    //'已完成'

    text1: "待处理",
    color1: "#BCBEC3",
    borderColor1: "#BCBEC3",
    backgroundColor1: "#fff",
    opacity1: 1,

    text2: "处理中",
    color2: "#BCBEC3",
    borderColor2: "#BCBEC3",
    backgroundColor2: "#009DE3",
    opacity2: 1,

    text3: "部分成功",
    color3: "#0CCC3C",
    borderColor3: "#BCBEC3",
    backgroundColor3: "#83E300",
    opacity3: 1,
  },
};

const PageTitle = {
  deposit: "存款记录",
  withdrawal: "提款记录",
};

class recordsDatails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recordsDatails: this.props.recordsDatails,
      datailsType: this.props.datailsType,
      isShowPisker: false,
      isShowModal: false,
      isCancleFiance: false,
      ctcDetailData: {},
      isSHowUploadText: false,
      iscancledDepost: false,
      IsAbleCompleteFromUIPop: false,//确认到账弹窗
      countTime: 5
    };
    this.intervalRef = React.createRef();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      title: PageTitle[this.props.datailsType],
    });

    this.GetTransactionHistory();
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  async copyTXT(txt, bankIndex) {
    Clipboard.setString(txt);
    Toasts.success("复制成功", 1.5);
    this.setState({
      bankIndex,
      isCopy: true,
    });

    setTimeout(() => {
      this.setState({
        bankIndex: -9999999999,
        isCopy: false,
      });
    }, 1500);
  }

  //存款确认到账 countdown 5s
  countdown(initTime) {
    this.setState({
      countTime: initTime
    }, () => {
      this.intervalRef.current = setInterval(() => {
        if (this.state.countTime > 0) {
          this.setState((prevState) => ({
            countTime: prevState.countTime - 1,
          }));
        } else {
          this.clearTimer();
        }
      }, 1000);
    })
  }

  clearTimer = () => {
    clearInterval(this.intervalRef.current);
  }

  //存款确认到账data
  AbleCompleteFromData() {
    this.setState({IsAbleCompleteFromUIPop: true }, ()=>{
      this.countdown(5);
    })
  }
  
  cancleFiance() {
    this.setState({
      isCancleFiance: false,
    });
    const { recordsDatails, datailsType } = this.state;
    let parmas = {
      transactionType: datailsType,
      remark: "test",
      amount: recordsDatails.amount,
    };
    // console.log('recordsDatails', recordsDatails)
    // return
    Toast.loading("加载中,请稍候...", 2000);

    let postUrl =
      `${window.ApiPort.POSTNoCancellation}transactionId=${recordsDatails.transactionId}&`;
    if (datailsType === "deposit") {
      postUrl =
        window.ApiPort.MemberRequestDepositReject +
        `transactionId=${recordsDatails.transactionId}&`;
      parmas = "";
    }

    fetchRequest(postUrl, "POST", parmas)
      .then((data) => {
        Toast.hide();
        //  debugger;
        if (data.isSuccess) {
          this.props.getDepositWithdrawalsRecords();
          this.setState({
            iscancledDepost: true,
          });
          if (datailsType === "deposit") {
            Toasts.success("存款申请已取消。");
            PiwikEvent("Deposit_History", "Submit", "Cancel_Deposit");
          } else {
            Toasts.success("提现申请已取消。");
            PiwikEvent("Deposit_History", "Submit", "Cancel_Deposit");
          }
          Actions.pop();
        } else {
          Toasts.fail("取消失败");
        }
      })
      .catch((error) => {
        Toast.hide();
      });
  }

  GetTransactionHistory() {
    const { recordsDatails, datailsType } = this.state;
    Toast.loading("加载中,请稍候...", 300);
    fetchRequest(
      window.ApiPort.GetTransactionHistory +
      "transactionID=" +
      recordsDatails.transactionId +
      "&transactionType=" +
      datailsType +
      "&",
      "GET"
    )
      .then((data) => {
        Toast.hide();
        this.setState({
          ctcDetailData: data.result,
        });
      })
      .catch(() => {
        Toast.hide();
      });
  }

  uploadImg = () => {
    const ImagePickerOption = {
      title: "选择图片", //TODO:CN-DONE 选择图片
      cancelButtonTitle: "取消", //TODO:CN-DONE 取消
      chooseFromLibraryButtonTitle: "确认", //TODO:CN-DONE 选择图片
      cameraType: "back",
      mediaType: Platform.OS == 'ios' ? 'photo' : 'mixed',
      videoQuality: "high",
      durationLimit: 10,
      maxWidth: 6000000,
      maxHeight: 6000000,
      quality: 1,
      angle: 0,
      allowsEditing: false,
      noData: false,
      storageOptions: {
        skipBackup: true,
      },
      includeBase64: true,
      saveToPhotos: true,
    };

    ImagePicker.launchImageLibrary(ImagePickerOption, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        // let source = { uri: 'data:image/jpegbase64,' + response.data }
        let source = { uri: response.data };
        //后缀要求小写

        if (!response.fileName) {
          return;
        }
        let idx = response.fileName.lastIndexOf(".");
        let newfileName =
          response.fileName.substring(0, idx) +
          response.fileName.substring(idx).toLowerCase();
        let avatarName = newfileName;
        let avatarSize = response.fileSize;
        let avatarSource = source;
        let fileSize = response.fileSize;
        let fileImgFlag = !(
          response.fileSize <= 1024 * 1024 * 2 &&
          [
            "JPG",
            "GIF",
            "BMP",
            "PNG",
            "DOC",
            "DOCX",
            "PDF",
            "HEIC ",
            "HEIF",
          ].includes(
            response.fileName
              .split(".")
            [response.fileName.split(".").length - 1].toLocaleUpperCase()
          )
        );

        const { recordsDatails } = this.state;

        let params = {
          DepositID: recordsDatails.transactionId,
          PaymentMethod: recordsDatails.paymentMethodId,
          FileName: avatarName,
          byteAttachment: avatarSource.uri,
          RequestedBy: memberCode,
        };

        Toast.loading("加载中,请稍候...", 300);
        fetchRequest(window.ApiPort.UploadAttachment, "POST", params)
          .then((data) => {
            Toast.hide();
            if (data.isSuccess) {
              Toasts.success("存款回执单已上传");
              this.setState({
                isSHowUploadText: true,
              });
              this.props.getDepositWithdrawalsRecords();
              Actions.pop();
            } else {
              Toasts.fail("存款回执单上传失败");
            }
          })
          .catch(() => {
            Toast.hide();
          });
      }
    });
  }

  createBtnStatus() {
    const { recordsDatails, isSHowUploadText, datailsType } = this.state;
    const {
      isContactCS, // 联系在线客服
      isSubmitNewTrans, //再次存款
      isUploadSlip, //上传存款回执单
      isAbleRequestRejectDeposit, //取消存款
      isUploadDocument,
      resubmitFlag,
    } = recordsDatails;
    const statusId = recordsDatails.statusId;
    // console.log(this.state)
    console.log(recordsDatails)
    //const ResubmitFlag = 1
    // const statusId = 3
    // const IsContactCS = true
    // const IsUploadSlip = !true
    // const IsAbleRequestRejectDeposit = true
    // const IsSubmitNewTrans = true
    if (datailsType === "deposit") {
      if (resubmitFlag == true) {
        return (
          <View>
            <Text style={{ marginBottom: 10 }}>
              您输入的存款金额不一致，请点击"重新提交"并确认正确的存款金额。
            </Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[
                  styles.recordsDatailsBtn,
                  styles.recordsDatailsBtn1,
                  { backgroundColor: "#FFFFFF" },
                ]}
                onPress={() => {
                  PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                  LiveChatOpenGlobe();
                }}
              >
                <Text
                  style={[
                    styles.recordsDatailsBtnText,
                    {
                      color: "#00A6FF",
                    },
                  ]}
                >
                  联系在线客服
                </Text>
                {/* 取消提款 */}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]}
                onPress={() => {
                  this.setState({
                    isShowModal: true,
                  });
                  PiwikAction.SendPiwik("Resubmit_Deposit_TransactionRecord");
                }}
              >
                <Text style={styles.recordsDatailsBtnText}>重新提交</Text>
                {/* 取消提款 */}
              </TouchableOpacity>
            </View>
          </View>
        );
      }

      if (statusId == 1 || statusId == 4) {
        if (isAbleRequestRejectDeposit && isContactCS && isUploadSlip) {
          return (
            <View>
              {Boolean(recordsDatails.reasonMsg) && (
                <Text style={{ marginBottom: 15 }}>
                  {recordsDatails.reasonMsg}
                </Text>
              )}
              <TouchableOpacity
                style={[styles.recordsDatailsBtn]}
                onPress={() => {
                  PiwikAction.SendPiwik("Cancel_Deposit_TransactionRecord");
                  this.setState({
                    isCancleFiance: true,
                  });
                }}
              >
                <Text style={styles.recordsDatailsBtnText}>取消存款</Text>
                { }
              </TouchableOpacity>

              {!isSHowUploadText && (
                <View style={styles.btnBox}>
                  <TouchableOpacity
                    onPress={() => {
                      PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                      LiveChatOpenGlobe();
                    }}
                    style={[
                      styles.recordsDatailsBtn,
                      styles.recordsDatailsBtn1,
                      { backgroundColor: "#fff" },
                    ]}
                  >
                    <Text style={{ color: "#00A6FF" }}>联系在线客服</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      PiwikAction.SendPiwik("UploadSlip_TransactionRecord");
                      this.uploadImg();
                    }}
                    style={[
                      styles.recordsDatailsBtn,
                      styles.recordsDatailsBtn1,
                    ]}
                  >
                    <Text style={{ color: "#fff" }}>上传存款凭证</Text>
                  </TouchableOpacity>
                </View>
              )}

              {isSHowUploadText && (
                <View>
                  <Text style={{ color: "#00A6FF", marginBottom: 10 }}>
                    * 您已上传存款回执单。
                  </Text>
                  <TouchableOpacity
                    style={[styles.recordsDatailsBtn]}
                    onPress={() => {
                      LiveChatOpenGlobe();
                      PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                    }}
                  >
                    <Text style={styles.recordsDatailsBtnText}>
                      联系在线客服
                    </Text>
                    { }
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }

        if (
          recordsDatails.paymentMethodId.toLocaleUpperCase() == "CTC" &&
          recordsDatails.methodType.toLocaleUpperCase() == "CHANNEL"
        ) {
          return (
            <View>
              {recordsDatails.reasonMsg != "" && (
                <Text
                  style={{ fontSize: 12, lineHeight: 20 }}
                >{`${recordsDatails.reasonMsg}`}</Text>
              )}
            </View>
          );
        }

        if (isContactCS && isUploadSlip) {
          return (
            <View>
              {Boolean(recordsDatails.reasonMsg) && (
                <Text style={{ marginBottom: 15 }}>
                  {recordsDatails.reasonMsg}
                </Text>
              )}
              {!isSHowUploadText && (
                <View style={styles.btnBox}>
                  <TouchableOpacity
                    onPress={() => {
                      LiveChatOpenGlobe();
                      PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                    }}
                    style={[
                      styles.recordsDatailsBtn,
                      styles.recordsDatailsBtn1,
                      { backgroundColor: "#fff" },
                    ]}
                  >
                    <Text style={{ color: "#00A6FF" }}>联系在线客服</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      PiwikAction.SendPiwik("UploadSlip_TransactionRecord");
                      this.uploadImg();
                    }}
                    style={[
                      styles.recordsDatailsBtn,
                      styles.recordsDatailsBtn1,
                    ]}
                  >
                    <Text style={{ color: "#fff" }}>上传存款回执单</Text>
                  </TouchableOpacity>
                </View>
              )}

              {isSHowUploadText && (
                <View>
                  <Text style={{ color: "#00A6FF", marginBottom: 10 }}>
                    * 您已上传存款回执单。
                  </Text>
                  <TouchableOpacity
                    style={[styles.recordsDatailsBtn]}
                    onPress={() => {
                      LiveChatOpenGlobe();
                      PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                    }}
                  >
                    <Text style={styles.recordsDatailsBtnText}>
                      联系在线客服
                    </Text>
                    { }
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }

        if (isContactCS && isAbleRequestRejectDeposit) {
          return (
            <View>
              {Boolean(recordsDatails.reasonMsg) && (
                <Text style={{ marginBottom: 15 }}>
                  {recordsDatails.reasonMsg}
                </Text>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.recordsDatailsBtn,
                    styles.recordsDatailsBtn1,
                    { backgroundColor: "#FFFFFF" },
                  ]}
                  onPress={() => {
                    LiveChatOpenGlobe();
                    PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                  }}
                >
                  <Text
                    style={[
                      styles.recordsDatailsBtnText,
                      {
                        color: "#00A6FF",
                      },
                    ]}
                  >
                    联系在线客服
                  </Text>
                  {/* 取消提款 */}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]}
                  onPress={() => {
                    PiwikAction.SendPiwik("Cancel_Deposit_TransactionRecord");
                    this.setState({
                      isCancleFiance: true,
                    });
                  }}
                >
                  <Text style={styles.recordsDatailsBtnText}>取消存款</Text>
                  {/* 取消提款 */}
                </TouchableOpacity>
              </View>
            </View>
          );
        }

        if (isUploadSlip && isAbleRequestRejectDeposit) {
          return (
            <View>
              {Boolean(recordsDatails.reasonMsg) && (
                <Text style={{ marginBottom: 15 }}>
                  {recordsDatails.reasonMsg}
                </Text>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.recordsDatailsBtn,
                    !isSHowUploadText
                      ? styles.recordsDatailsBtn1
                      : { width: width - 45 },
                  ]}
                  onPress={() => {
                    PiwikAction.SendPiwik("Cancel_Deposit_TransactionRecord");
                    this.setState({
                      isCancleFiance: true,
                    });
                  }}
                >
                  <Text style={styles.recordsDatailsBtnText}>取消存款</Text>
                  {/* 取消提款 */}
                </TouchableOpacity>
                {!isSHowUploadText && (
                  <TouchableOpacity
                    style={[
                      styles.recordsDatailsBtn,
                      { backgroundColor: "#fff" },
                      styles.recordsDatailsBtn1,
                    ]}
                    onPress={() => {
                      PiwikAction.SendPiwik("UploadSlip_TransactionRecord");
                      this.uploadImg();
                    }}
                  >
                    <Text
                      style={[
                        styles.recordsDatailsBtnText,
                        { color: "#00A6FF" },
                      ]}
                    >
                      上传存款回执单
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }

        if (isAbleRequestRejectDeposit) {
          return (
            <View>
              {Boolean(recordsDatails.reasonMsg) && (
                <Text style={{ marginBottom: 15 }}>
                  {recordsDatails.reasonMsg}
                </Text>
              )}

              <TouchableOpacity
                style={[styles.recordsDatailsBtn]}
                onPress={() => {
                  PiwikAction.SendPiwik("Cancel_Deposit_TransactionRecord");
                  this.setState({
                    isCancleFiance: true,
                  });
                }}
              >
                <Text style={styles.recordsDatailsBtnText}>取消存款</Text>
                { }
              </TouchableOpacity>
            </View>
          );
        }

        if (isContactCS) {
          return (
            <View>
              {Boolean(recordsDatails.reasonMsg) && (
                <Text style={{ marginBottom: 15 }}>
                  {recordsDatails.reasonMsg}
                </Text>
              )}
              <TouchableOpacity
                style={[styles.recordsDatailsBtn]}
                onPress={() => {
                  LiveChatOpenGlobe();
                  PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                }}
              >
                <Text style={styles.recordsDatailsBtnText}>联系在线客服</Text>
                { }
              </TouchableOpacity>
            </View>
          );
        }
        if (!isAbleRequestRejectDeposit && !isContactCS && !isUploadSlip) {
          return (
            <View>
              {recordsDatails.reasonMsg != "" && (
                <Text
                  style={{ fontSize: 12, lineHeight: 20 }}
                >{`${recordsDatails.reasonMsg}`}</Text>
              )}
            </View>
          );
        }
      } else if (statusId == 3) {
        if (isContactCS && isSubmitNewTrans) {
          return (
            <View>
              {Boolean(recordsDatails.reasonMsg) && (
                <Text style={{ marginBottom: 15 }}>
                  {recordsDatails.reasonMsg}
                </Text>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.recordsDatailsBtn,
                    styles.recordsDatailsBtn1,
                    { backgroundColor: "#FFFFFF" },
                  ]}
                  onPress={() => {
                    LiveChatOpenGlobe();
                    PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                  }}
                >
                  <Text
                    style={[
                      styles.recordsDatailsBtnText,
                      {
                        color: "#00A6FF",
                      },
                    ]}
                  >
                    联系在线客服
                  </Text>
                  {/* 取消提款 */}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]}
                  onPress={() => {
                    Actions.DepositCenter();
                  }}
                >
                  <Text style={styles.recordsDatailsBtnText}>再次存款</Text>
                  {/* 取消提款 */}
                </TouchableOpacity>
              </View>
            </View>
          );
        }

        if (
          recordsDatails.paymentMethodId.toLocaleUpperCase() == "CTC" &&
          Boolean(recordsDatails.convertedCurrencyCode) &&
          Boolean(recordsDatails.cryptoExchangeRate)
        ) {
          return (
            <View>
              <Text style={{}}>
                参考汇率 :{" "}
                {`1 ${recordsDatails.convertedCurrencyCode} = ${recordsDatails.cryptoExchangeRate} 人民币`}
              </Text>
            </View>
          );
        } else {
          return (
            <View>
              {recordsDatails.reasonMsg != "" && (
                <Text
                  style={{ fontSize: 12, lineHeight: 20 }}
                >{`${recordsDatails.reasonMsg}`}</Text>
              )}
            </View>
          );
        }
      } else if (statusId == 2) {
        if (
          recordsDatails.paymentMethodId.toLocaleUpperCase() == "CTC" &&
          Boolean(recordsDatails.convertedCurrencyCode) &&
          Boolean(recordsDatails.cryptoExchangeRate)
        ) {
          return (
            <View>
              <Text style={{}}>
                参考汇率 :{" "}
                {`1 ${recordsDatails.convertedCurrencyCode} = ${recordsDatails.cryptoExchangeRate} 人民币`}
              </Text>
            </View>
          );
        }
      } else if (statusId == 5) {
        if (isContactCS) {
          return (
            <View>
              {Boolean(recordsDatails.reasonMsg) && (
                <Text style={{ marginBottom: 15 }}>
                  {recordsDatails.reasonMsg}
                </Text>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.recordsDatailsBtn,
                    styles.recordsDatailsBtn1,
                    { width: '100%' }
                  ]}
                  onPress={() => {
                    LiveChatOpenGlobe();
                    PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                  }}
                >
                  <Text
                    style={[
                      styles.recordsDatailsBtnText,
                    ]}
                  >
                    联系在线客服
                  </Text>
                  {/* 取消提款 */}
                </TouchableOpacity>
              </View>
            </View>
          );
        }

        if (
          recordsDatails.paymentMethodId.toLocaleUpperCase() == "CTC" &&
          Boolean(recordsDatails.convertedCurrencyCode) &&
          Boolean(recordsDatails.cryptoExchangeRate)
        ) {
          return (
            <View>
              <Text style={{}}>
                参考汇率 :{" "}
                {`1 ${recordsDatails.convertedCurrencyCode} = ${recordsDatails.cryptoExchangeRate} 人民币`}
              </Text>
            </View>
          );
        } else {
          return (
            <View>
              {recordsDatails.reasonMsg != "" && (
                <Text
                  style={{ fontSize: 12, lineHeight: 20 }}
                >{`${recordsDatails.reasonMsg}`}</Text>
              )}
            </View>
          );
        }
      }
    } else {
      if (recordsDatails.paymentMethodId.toLocaleUpperCase() == "LB") {
        if (recordsDatails.isAbleCompleteFromUI) {
          //确认到账按钮
          return (
            <View>
              <TouchableOpacity
                style={styles.recordsDatailsBtn}
                onPress={() => { this.AbleCompleteFromData() }}
              >
                <Text style={styles.recordsDatailsBtnText}>确认到账</Text>
              </TouchableOpacity>
              {
                // Boolean(recordsDatails.reasonMsg) &&
                // <View style={[styles.ableCompleteReasonMsg, {}]}>
                //   <Text style={{ color: '#666', fontSize: 14 }}>乐天使温馨提醒 ：</Text>
                //   <Text style={{ color: '#999', fontSize: 12, paddingTop: 5 }}>
                //     {recordsDatails.reasonMsg}
                //   </Text>
                // </View>
              }
            </View>
          )
        }
        if (statusId === 1) {
          if (isContactCS && isUploadSlip) {
            return (
              <View>
                {Boolean(recordsDatails.reasonMsg) && (
                  <Text style={{ marginBottom: 15 }}>
                    {recordsDatails.reasonMsg}
                  </Text>
                )}

                <TouchableOpacity
                  style={[styles.recordsDatailsBtn, { marginBottom: 20 }]}
                  onPress={() => {
                    PiwikAction.SendPiwik("Cancel_Withdraw_TransactionRecord");
                    this.setState({
                      isCancleFiance: true,
                    });
                  }}
                >
                  <Text style={styles.recordsDatailsBtnText}>取消提款</Text>
                  {/* 取消提款 */}
                </TouchableOpacity>

                <View style={styles.btnBox}>
                  <TouchableOpacity
                    onPress={() => {
                      LiveChatOpenGlobe();
                      PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                    }}
                    style={[
                      styles.recordsDatailsBtn,
                      styles.recordsDatailsBtn1,
                      { backgroundColor: "#fff" },
                    ]}
                  >
                    <Text style={{ color: "#00A6FF" }}>联系在线客服</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      PiwikAction.SendPiwik("UploadDoc_Withdraw_TransactionRecord");
                      this.uploadImg();
                    }}
                    style={[
                      styles.recordsDatailsBtn,
                      styles.recordsDatailsBtn1,
                    ]}
                  >
                    <Text style={{ color: "#fff" }}>上载文档</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }

          if (isContactCS) {
            return (
              <View>
                {Boolean(recordsDatails.reasonMsg) && (
                  <Text style={{ marginBottom: 15 }}>
                    {recordsDatails.reasonMsg}
                  </Text>
                )}
                <View style={styles.btnBox}>
                  <TouchableOpacity
                    onPress={() => {
                      LiveChatOpenGlobe();
                      PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                    }}
                    style={[
                      styles.recordsDatailsBtn,
                      styles.recordsDatailsBtn1,
                      { backgroundColor: "#fff" },
                    ]}
                  >
                    <Text style={{ color: "#00A6FF" }}>联系在线客服</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      PiwikAction.SendPiwik("Cancel_Withdraw_TransactionRecord");
                      this.setState({
                        isCancleFiance: true,
                      });
                    }}
                    style={[
                      styles.recordsDatailsBtn,
                      styles.recordsDatailsBtn1,
                    ]}
                  >
                    <Text style={{ color: "#fff" }}>取消提款</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }

          return (
            <View>
              {Boolean(recordsDatails.reasonMsg) && (
                <Text style={{ marginBottom: 15 }}>
                  {recordsDatails.reasonMsg}
                </Text>
              )}
              <View style={styles.btnBox}></View>
              <TouchableOpacity
                style={[styles.recordsDatailsBtn, { marginTop: 20 }]}
                onPress={() => {
                  PiwikAction.SendPiwik("Cancel_Withdraw_TransactionRecord");
                  this.setState({
                    isCancleFiance: true,
                  });
                }}
              >
                <Text style={styles.recordsDatailsBtnText}>取消提款</Text>
                {/* 取消提款 */}
              </TouchableOpacity>
            </View>
          );
        } else {
          if (statusId == 5) {
            if (isContactCS && isSubmitNewTrans) {
              return (
                <View>
                  {Boolean(recordsDatails.reasonMsg) && (
                    <Text style={{ marginBottom: 15 }}>
                      {recordsDatails.reasonMsg}
                    </Text>
                  )}

                  <View style={styles.btnBox}>
                    <TouchableOpacity
                      onPress={() => {
                        LiveChatOpenGlobe();
                        PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                      }}
                      style={[
                        styles.recordsDatailsBtn,
                        styles.recordsDatailsBtn1,
                        { backgroundColor: "#fff" },
                      ]}
                    >
                      <Text style={{ color: "#00A6FF" }}>联系在线客服</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        PiwikAction.SendPiwik("Resubmit_Withdraw_TransactionRecord");
                        Actions.withdrawal();
                      }}
                      style={[
                        styles.recordsDatailsBtn,
                        styles.recordsDatailsBtn1,
                      ]}
                    >
                      <Text style={{ color: "#fff" }}>再次提款</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
          } else if ([2, 3, 8, 9].includes(statusId)) {
            if (
              recordsDatails.totalTransactionCount > 1 &&
              recordsDatails.paymentMethodId == "LB"
            )
              return;
            return (
              <View>
                <TouchableOpacity
                  style={[styles.recordsDatailsBtn]}
                  onPress={() => {
                    PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                    LiveChatOpenGlobe();
                  }}
                >
                  <Text style={styles.recordsDatailsBtnText}>联系在线客服</Text>
                  {/* 取消提款 */}
                </TouchableOpacity>
              </View>
            );
          } else if (statusId == 10) {
            let SubTransactionCount = recordsDatails.subTransactionCount;
            let TotalTransactionCount = recordsDatails.totalTransactionCount;
            if (SubTransactionCount != TotalTransactionCount) {
              return <Text>余额已退还到您的主钱包。</Text>;
            }
          }
        }
      } else {
        if (statusId == 1) {
          if (isContactCS && isUploadSlip) {
            return (
              <View>
                {Boolean(recordsDatails.reasonMsg) && (
                  <Text style={{ marginBottom: 15 }}>
                    {recordsDatails.reasonMsg}
                  </Text>
                )}
                <TouchableOpacity
                  style={[styles.recordsDatailsBtn, { marginBottom: 20 }]}
                  onPress={() => {
                    PiwikAction.SendPiwik("Cancel_Withdraw_TransactionRecord");
                    this.setState({
                      isCancleFiance: true,
                    });
                  }}
                >
                  <Text style={styles.recordsDatailsBtnText}>取消提款</Text>
                  {/* 取消提款 */}
                </TouchableOpacity>

                <View style={styles.btnBox}>
                  <TouchableOpacity
                    onPress={() => {
                      PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                      LiveChatOpenGlobe();
                    }}
                    style={[
                      styles.recordsDatailsBtn,
                      styles.recordsDatailsBtn1,
                      { backgroundColor: "#fff" },
                    ]}
                  >
                    <Text style={{ color: "#00A6FF" }}>联系在线客服</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      PiwikAction.SendPiwik("UploadDoc_Withdraw_TransactionRecord");
                      this.uploadImg();
                    }}
                    style={[
                      styles.recordsDatailsBtn,
                      styles.recordsDatailsBtn1,
                    ]}
                  >
                    <Text style={{ color: "#fff" }}>上载文档</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
        } else if (statusId == 4) {
          return (
            <View>
              {recordsDatails.reasonMsg != "" && (
                <Text>{`${recordsDatails.reasonMsg}`}</Text>
              )}
            </View>
          );
        }
      }
    }
  }

  render() {
    const {
      iscancledDepost,
      isSHowUploadText,
      recordsDatails,
      datailsType,
      isShowPisker,
      isShowModal,
      isCancleFiance,
      ctcDetailData,
      IsAbleCompleteFromUIPop,
      countTime
    } = this.state;
    // console.log(this.state)
    // console.log('recordsDatails', recordsDatails)
    const statusId = recordsDatails.statusId;
    let recordsStatus =
      datailsType === "deposit" ? DepositStatus : WithdrawalStatus;
    let recordsStatusItem = recordsStatus[`StatusId${statusId}`];
    let ResubmitFlag = recordsDatails.resubmitFlag; // 1
    let ViewIcon = (
      <View
        style={{
          width: 20,
          height: 20,
          borderWidth: 1,
          borderColor: "#DCDCE0",
          borderRadius: 1000,
          transform: [{ scale: 0.8 }],
        }}
      ></View>
    );
    // console.log(this.state, 88);
    return (
      <ViewShot
        style={[styles.viewContainer]}
        ref="viewShot"
        options={{ format: "jpg", quality: 0.9 }}
      >
        {/* 提款确认到账弹窗 */}
        <AbleCompleteFromUIPop
          AbleCompleteFromData={recordsDatails}
          IsAbleCompleteFromUIPop={IsAbleCompleteFromUIPop}
          recordes={'recordsDatails'}
          countTime={countTime}
          PopChange={() => {
            //关闭
            this.setState({ IsAbleCompleteFromUIPop: false });
            this.clearTimer();
          }}
          getDepositWithdrawalsRecords={() => {
            this.props.getDepositWithdrawalsRecords()
          }}
          changeBettingHistoryDatesIndex={() => {
            this.props.changeBettingHistoryDatesIndex(1)
          }}
        />
        <Modal visible={isShowPisker} transparent={true} animationType="fade">
          <TouchableHighlight
            onPress={() => {
              this.setState({
                isShowPisker: false,
              });
            }}
            style={styles.modalBg}
          >
            <View style={styles.modalBgContainer}>
              <Text style={styles.modalBgContainerText}>
                {datailsType === "withdrawal" ? "提款信息" : "存款信息"}
              </Text>

              {datailsType == "deposit" && (
                <View style={{ backgroundColor: "#fff", borderRadius: 10 }}>
                  <View style={styles.modalListStyle}>
                    <Text style={styles.modalListStyleText}>存款金额</Text>
                    <Text style={styles.modalListStyleText1}>
                      <Text style={{ fontSize: 14 }}>￥</Text>
                      {ctcDetailData.amount}
                    </Text>
                  </View>

                  {recordsDatails.paymentMethodId.toLocaleUpperCase() ==
                    "CTC" &&
                    (recordsDatails.methodType.toLocaleUpperCase() ==
                      "INVOICE_AUT" ||
                      recordsDatails.methodType.toLocaleUpperCase() ==
                      "CHANNEL") && (
                      <View>
                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>
                            参考汇率
                          </Text>
                          <Text
                            style={styles.modalListStyleText1}
                          >{`1 ${ctcDetailData.currencyFrom} = ${ctcDetailData.cryptoExchangeRate} 人民币`}</Text>
                        </View>

                        {recordsDatails.methodType.toLocaleUpperCase() ==
                          "CHANNEL" && (
                            <View
                              style={[
                                styles.modalListStyle,
                                {
                                  backgroundColor: "#F5F5F5",
                                  marginHorizontal: 15,
                                  borderRadius: 6,
                                },
                              ]}
                            >
                              <Text style={{ color: "#666", fontSize: 12 }}>
                                请注意在完成交易时，汇率可能会发生变化。
                              </Text>
                            </View>
                          )}

                        {Boolean(ctcDetailData.walletAddress) && (
                          <View style={styles.modalListStyle}>
                            <Text style={styles.modalListStyleText}>
                              收款地址
                            </Text>
                            <Text style={styles.modalListStyleText1}>
                              {ctcDetailData.walletAddress}
                            </Text>
                          </View>
                        )}

                        {recordsDatails.methodType.toLocaleUpperCase() ==
                          "CHANNEL" && (
                            <View
                              style={[
                                styles.modalListStyle,
                                {
                                  backgroundColor: "#F5F5F5",
                                  marginHorizontal: 15,
                                  borderRadius: 6,
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  marginBottom: 15,
                                },
                              ]}
                            >
                              {Boolean(ctcDetailData.currencyFrom) && (
                                <Text style={{ color: "#666", fontSize: 12 }}>
                                  最低存款数量 : {ctcDetailData.minAmount}{" "}
                                  {ctcDetailData.currencyFrom}.{" "}
                                </Text>
                              )}
                              <Text style={{ color: "#666", fontSize: 12 }}>
                                该收款地址是您的专属地址，可以多次使用。
                              </Text>
                            </View>
                          )}

                        {recordsDatails.methodType.toLocaleUpperCase() ==
                          "INVOICE_AUT" &&
                          Boolean(ctcDetailData.cryptoTransactionHash) && (
                            <View style={styles.modalListStyle}>
                              <Text style={styles.modalListStyleText}>
                                交易哈希
                              </Text>
                              <Text style={styles.modalListStyleText1}>
                                {ctcDetailData.cryptoTransactionHash}
                              </Text>
                            </View>
                          )}
                      </View>
                    )}

                  {recordsDatails.paymentMethodId.toLocaleUpperCase() ==
                    "LB" && (
                      <View>
                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>
                            存款人姓名
                          </Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.accountHolderName &&
                              ctcDetailData.accountHolderName.replace(/./g, "*")}
                          </Text>
                        </View>

                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>支付类型</Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.methodOriName}
                          </Text>
                        </View>
                      </View>
                    )}

                  {recordsDatails.paymentMethodId.toLocaleUpperCase() ==
                    "AP" && (
                      <View>
                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>
                            AstroPay卡号
                          </Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.cardNo}
                          </Text>
                        </View>

                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>有效日期</Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.expiredDate}
                          </Text>
                        </View>

                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>
                            美金兑换汇率
                          </Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.exchangeRate}
                          </Text>
                        </View>

                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>
                            卡片面值 (USD/RMB)
                          </Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.amount}
                          </Text>
                        </View>

                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>
                            实际存入 (RMB)
                          </Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.actualAmount}
                          </Text>
                        </View>
                      </View>
                    )}

                  {recordsDatails.paymentMethodId.toLocaleUpperCase() ==
                    "CC" && (
                      <View>
                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>
                            现金卡序列号
                          </Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.serialNo}
                          </Text>
                        </View>
                      </View>
                    )}

                  {Boolean(ctcDetailData.actualAmount) && (
                    <View>
                      <View style={styles.modalListStyle}>
                        <Text style={styles.modalListStyleText}>
                          系统提示金额
                        </Text>
                        <Text style={styles.modalListStyleText1}>
                          <Text style={{ fontSize: 14 }}>￥</Text>
                          {ctcDetailData.actualAmount}
                        </Text>
                      </View>
                    </View>
                  )}

                  {Boolean(ctcDetailData.gatewayName) && (
                    <View style={styles.modalListStyle}>
                      <Text style={styles.modalListStyleText}>支付渠道</Text>
                      <Text style={styles.modalListStyleText1}>
                        {ctcDetailData.gatewayName}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {datailsType === "withdrawal" && (
                <View style={{ backgroundColor: "#fff", borderRadius: 10 }}>
                  <View style={styles.modalListStyle}>
                    <Text style={styles.modalListStyleText}>提款金额</Text>
                    <Text style={styles.modalListStyleText1}>
                      <Text style={{ fontSize: 14 }}>￥</Text>
                      {recordsDatails.amount}
                    </Text>
                  </View>

                  {recordsDatails.paymentMethodId.toLocaleUpperCase() ==
                    "LB" && (
                      <View>
                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>银行名称</Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.bankName}
                          </Text>
                        </View>
                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>
                            账户持有者全名
                          </Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.accountHolderName &&
                              ctcDetailData.accountHolderName.replace(/./g, "*")}
                          </Text>
                        </View>
                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>银行账号</Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.withdrawalAccNumber &&
                              "*************" +
                              ctcDetailData.withdrawalAccNumber.slice(-3)}
                          </Text>
                        </View>
                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>省/自治区</Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.province}
                          </Text>
                        </View>
                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>城市/城镇</Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.city}
                          </Text>
                        </View>
                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>分行</Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.branch}
                          </Text>
                        </View>
                      </View>
                    )}

                  {recordsDatails.paymentMethodId.toLocaleUpperCase() ==
                    "CCW" &&
                    ctcDetailData.withdrawalCryptoAmount && (
                      <View>
                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>
                            虚拟币等值数量
                          </Text>
                          <Text style={styles.modalListStyleText1}>
                            {ctcDetailData.withdrawalCryptoAmount}{" "}
                            {ctcDetailData.withdrawalCryptoCurrency}
                          </Text>
                        </View>

                        <View
                          style={{
                            backgroundColor: "#F5F5F5",
                            borderRadius: 4,
                            marginHorizontal: 12,
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                          }}
                        >
                          {recordsDatails.reasonMsg != "" && (
                            <Text
                              style={{
                                fontSize: 12,
                                color: "#666",
                                marginBottom: 5,
                              }}
                            >{`${recordsDatails.reasonMsg}`}</Text>
                          )}
                        </View>

                        <View style={styles.modalListStyle}>
                          <Text style={styles.modalListStyleText}>
                            钱包地址
                          </Text>
                          <View>
                            <Text style={styles.modalListStyleText1}>
                              {ctcDetailData.withdrawalWalletName}
                            </Text>
                            <Text style={styles.modalListStyleText1}>
                              {ctcDetailData.withdrawalWalletAddress}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                </View>
              )}
            </View>
          </TouchableHighlight>
        </Modal>
        {/* <TouchableOpacity
                    onPress={this.uploadImg.bind(this)}
                    style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]}>
                    <Text style={{ color: '#fff' }}>上载文档</Text>
                </TouchableOpacity> */}
        <Modal animationType="fade" transparent={true} visible={isShowModal}>
          <View style={[styles.modalContainer]}>
            <View style={[styles.modalBox]}>
              <View style={[styles.modalTop]}>
                <Text style={styles.modalTopText}>重要提示</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isShowModal: false,
                    });
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 20 }}>X</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <View>
                  {ManualDepositText.map((v, i) => {
                    return (
                      <Text
                        key={i}
                        style={[
                          styles.manualDepositText,
                          {
                            color: true ? "#58585B" : "#fff",
                          },
                        ]}
                      >
                        {v}
                      </Text>
                    );
                  })}
                </View>
                <View style={styles.modalBtnBox}>
                  <TouchableOpacity
                    style={[styles.modalBtn, { borderColor: "#00A6FF" }]}
                    onPress={() => {
                      this.setState({
                        isShowModal: false,
                      });
                      PiwikAction.SendPiwik("LiveChat_TransactionRecord");
                      LiveChatOpenGlobe();
                    }}
                  >
                    <Text style={[styles.modalBtnText, { color: "#00A6FF" }]}>
                      联系在线客服
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalBtn,
                      { backgroundColor: "#00A6FF", borderColor: "#00A6FF" },
                    ]}
                    onPress={() => {
                      this.setState({
                        isShowModal: false,
                      });
                      Actions.pop();
                      Actions.RedoDepositTransaction({
                        recordsDatails,
                        getDepositWithdrawalsRecords: () => {
                          this.props.getDepositWithdrawalsRecords();
                        },
                      });
                    }}
                  >
                    <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                      是的，我明白了
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Modal animationType="fade" transparent={true} visible={isCancleFiance}>
          <View style={[styles.modalContainer]}>
            <View style={[styles.modalBox]}>
              <View style={[styles.modalTop, { justifyContent: "center" }]}>
                <Text style={styles.modalTopText}>
                  {datailsType === "deposit" ? "申请确认" : "取消提款"}
                </Text>
              </View>
              <View style={styles.modalBody}>
                <View>
                  <Text style={[styles.manualDepositText, { color: "#000" }]}>
                    {datailsType === "deposit"
                      ? `您确定要取消存款${recordsDatails.amount}元吗?`
                      : `您确定要取消提款${recordsDatails.amount}元吗?`}
                  </Text>
                </View>
                <View style={styles.modalBtnBox}>
                  <TouchableOpacity
                    style={[styles.modalBtn, { borderColor: "#00A6FF" }]}
                    onPress={() => {
                      this.setState({
                        isCancleFiance: false,
                      });
                    }}
                  >
                    <Text style={[styles.modalBtnText, { color: "#00A6FF" }]}>
                      {datailsType === "deposit" ? "不取消" : "返回"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalBtn,
                      { backgroundColor: "#00A6FF", borderColor: "#00A6FF" },
                    ]}
                    onPress={this.cancleFiance.bind(this)}
                  >
                    <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                      {datailsType === "deposit"
                        ? "是的，我要取消"
                        : "取消提款"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <ScrollView
          automaticallyAdjustContentInsets={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              paddingVertical: 15,
              paddingHorizontal: 10,
            }}
          >
            <View style={styles.datails}>
              <Text
                style={[
                  styles.topLeftText1,
                  {
                    color: true ? "#000000" : "#fff",
                    fontWeight: "bold",
                    fontSize: 16,
                  },
                ]}
              >
                {recordsDatails.paymentMethodName}
                {recordsDatails.paymentMethodId == "CTC" &&
                  `(${CTCMethods[recordsDatails.methodType]})`}
                {/*{datailsType === 'withdrawal' && recordsDatails.paymentMethodId == 'LB' && ('-' + recordsDatails.methodType)}*/}
              </Text>
              {(recordsDatails.statusId == 1 || recordsDatails.statusId == 4) &&
                recordsDatails.methodType == "CHANNEL" ? (
                <Text style={{ color: "#000", textAlign: "right" }}>-</Text>
              ) : (
                <Text
                  style={[
                    styles.topRigthText3,
                    { color: true ? "#000" : "#009DE3" },
                  ]}
                >
                  <Text style={{ fontSize: 14 }}>￥</Text>
                  {recordsDatails.amount}
                </Text>
              )}
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={[
                    styles.topRigthText2,
                    { color: "#BCBEC3", marginBottom: 6, marginTop: 2 },
                  ]}
                >
                  {moment(recordsDatails.submittedAt).format(
                    "YYYY-MM-DD HH:mm"
                  )}
                </Text>
                {datailsType === "withdrawal" &&
                  recordsDatails.totalTransactionCount > 1 &&
                  recordsDatails.paymentMethodId == "LB" && (
                    <Text
                      style={[
                        styles.topRigthText2,
                        { color: "#BCBEC3", marginBottom: 6, marginTop: 2 },
                      ]}
                    >
                      提款申请
                    </Text>
                  )}
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[styles.topRigthText1, { color: "#BCBEC3" }]}>
                  {recordsDatails.transactionId}
                </Text>
                <TouchableOpacity
                  onPress={this.copyTXT.bind(
                    this,
                    recordsDatails.transactionId
                  )}
                >
                  {/* <Text style={{ color: "#25AAE1", marginLeft: 8 }}>复制</Text> */}
                  <Image
                    source={require("../../images/icon/copy.png")}
                    resizeMode="stretch"
                    style={{ width: 14, height: 14, marginLeft: 5 }}
                  />
                </TouchableOpacity>
              </View>
              {datailsType === "withdrawal" &&
                recordsDatails.totalTransactionCount > 1 &&
                recordsDatails.paymentMethodId == "LB" && (
                  <View
                    style={{
                      position: "absolute",
                      right: 0,
                      bottom: -30,
                      alignItems: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        color: "#00A6FF",
                        fontWeight: "600",
                        fontSize: 18,
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>￥</Text>
                      {recordsDatails.paidAmount}
                    </Text>
                    <Text style={{ color: "#999999", fontSize: 13 }}>
                      实际到账
                    </Text>
                  </View>
                )}
            </View>

            <TouchableOpacity
              onPress={() => {
                this.setState({
                  isShowPisker: true,
                });
              }}
              style={styles.viewBtndetail}
            >
              <Text style={{ color: "#25AAE1", fontWeight: "600" }}>
                查看{datailsType === "deposit" ? "存" : "提"}款信息
              </Text>
            </TouchableOpacity>

            {datailsType === "deposit" && (
              <View>
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: "#EFEFF4",
                    marginTop: 15,
                    paddingTop: 20,
                    borderBottomColor: "#EFEFF4",
                    paddingBottom: 40,
                    borderBottomWidth: 1,
                    marginBottom: 25,
                  }}
                >
                  <View>
                    <View style={{ flexDirection: "row" }}>
                      {statusId == 1 || statusId == 4 ? (
                        <Image
                          source={require("../../images/record4.png")}
                          resizeMode="stretch"
                          style={[styles.iconImg, styles.iconImg1]}
                        ></Image>
                      ) : (
                        <Image
                          source={require("../../images/record1.png")}
                          resizeMode="stretch"
                          style={[styles.iconImg, styles.iconImg1]}
                        ></Image>
                      )}

                      <View style={{ marginLeft: 15 }}>
                        <Text style={{ color: recordsStatusItem.color1 }}>
                          {recordsStatusItem.text1}
                        </Text>
                        <Text
                          style={{
                            color: recordsStatusItem.borderColor1,
                            position: "absolute",
                            bottom: 0,
                            width: 200,
                            bottom: -15,
                          }}
                        >
                          {moment(recordsDatails.processingDateTime).format(
                            "YYYY-MM-DD HH:mm"
                          )}
                        </Text>
                      </View>
                    </View>
                    {/* 時間軸 */}
                    <View
                      style={{
                        backgroundColor: "#DCDCE0",
                        width: 2,
                        height: 40,
                        marginVertical: 6,
                        marginLeft: 10,
                      }}
                    ></View>
                    <View style={{ flexDirection: "row" }}>
                      {statusId == 2 ? (
                        <Image
                          source={require("../../images/record3.png")}
                          resizeMode="stretch"
                          style={[styles.iconImg, styles.iconImg1]}
                        ></Image>
                      ) : (statusId == 3 || statusId == 5) ? (
                        <Image
                          source={require("../../images/record2.png")}
                          resizeMode="stretch"
                          style={[styles.iconImg, styles.iconImg1]}
                        ></Image>
                      ) : (
                        ViewIcon
                      )}
                      <View style={{ marginLeft: 15 }}>
                        <Text style={{ color: recordsStatusItem.color2 }}>
                          {recordsStatusItem.text2}
                        </Text>
                        {statusId == 2 && (
                          <Text
                            style={{
                              color: recordsStatusItem.borderColor2,
                              position: "absolute",
                              // bottom: 0,
                              width: 200,
                              bottom: -15,
                            }}
                          >
                            {moment(recordsDatails.approvedDateTime).format(
                              "YYYY-MM-DD HH:mm"
                            )}
                          </Text>
                        )}

                        {statusId == 3 && ( // 存款失敗
                          <Text
                            style={{
                              color: recordsStatusItem.borderColor2,
                              position: "absolute",
                              bottom: 0,
                              width: 200,
                              bottom: -15,
                            }}
                          >
                            {moment(recordsDatails.rejectedDateTime).format(
                              "YYYY-MM-DD HH:mm"
                            )}
                          </Text>
                        )}
                        {statusId == 5 && ( // 超時
                          <Text
                            style={{
                              color: recordsStatusItem.borderColor2,
                              position: "absolute",
                              bottom: 0,
                              width: 200,
                              bottom: -15,
                            }}
                          >
                            {moment(recordsDatails.timeoutDateTime).format(
                              "YYYY-MM-DD HH:mm"
                            )}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                {this.createBtnStatus()}
              </View>
            )}

            {datailsType === "withdrawal" && (
              <View>
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: "#EFEFF4",
                    marginTop: 15,
                    paddingTop: 20,
                    borderBottomColor: "#EFEFF4",
                    paddingBottom: 40,
                    borderBottomWidth: 1,
                    marginBottom: 25,
                  }}
                >
                  <View>
                    {recordsDatails.totalTransactionCount > 1 &&
                      recordsDatails.paymentMethodId == "LB" && (
                        <View
                          style={{
                            backgroundColor: "#FFF5BF",
                            borderRadius: 4,
                            padding: 10,
                            marginBottom: 10,
                          }}
                        >
                          <Text style={{ fontSize: 13, color: "#83630B" }}>
                            基于安全问题，您的提现申请额将分成
                            {recordsDatails.totalTransactionCount}
                            次汇入您的账户。
                          </Text>
                        </View>
                      )}

                    <View style={{ flexDirection: "row" }}>
                      {statusId == 1 || statusId == 7 ? (
                        <Image
                          source={require("../../images/record5.png")}
                          resizeMode="stretch"
                          style={styles.iconImg}
                        ></Image>
                      ) : (
                        <Image
                          source={require("../../images/record1.png")}
                          resizeMode="stretch"
                          style={[styles.iconImg, styles.iconImg1]}
                        ></Image>
                      )}

                      <View style={{ marginLeft: 15 }}>
                        <Text style={{ color: recordsStatusItem.color1 }}>
                          {recordsStatusItem.text1}
                        </Text>
                        <Text
                          style={{
                            color: recordsStatusItem.borderColor1,
                            position: "absolute",
                            bottom: 0,
                            width: 200,
                            bottom: -15,
                          }}
                        >
                          {moment(recordsDatails.processingDateTime).format(
                            "YYYY-MM-DD HH:mm"
                          )}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: "#DCDCE0",
                        width: 2,
                        height: 40,
                        marginVertical: 6,
                        marginLeft: 10,
                      }}
                    ></View>
                    <View style={{ flexDirection: "row" }}>
                      {[2, 3, 8, 9].includes(statusId) ? (
                        <Image
                          source={require("../../images/record4.png")}
                          resizeMode="stretch"
                          style={styles.iconImg}
                        ></Image>
                      ) : statusId == 5 || statusId == 4 ? (
                        <Image
                          source={require("../../images/record1.png")}
                          resizeMode="stretch"
                          style={[styles.iconImg, styles.iconImg1]}
                        ></Image>
                      ) : statusId == 6 ? (
                        <Image
                          source={require("../../images/record1.png")}
                          resizeMode="stretch"
                          style={[styles.iconImg, styles.iconImg1]}
                        ></Image>
                      ) : statusId == 10 ? (
                        <Image
                          source={require("../../images/record1.png")}
                          resizeMode="stretch"
                          style={[styles.iconImg, styles.iconImg1]}
                        ></Image>
                      ) : (
                        ViewIcon
                      )}
                      <View
                        style={{
                          marginLeft: 15,
                        }}
                      >
                        <Text style={{ color: recordsStatusItem.color2 }}>
                          {recordsStatusItem.text2}
                          {recordsDatails.totalTransactionCount > 1 &&
                            recordsDatails.paymentMethodId == "LB" &&
                            `(${recordsDatails.subTransactionCount}/${recordsDatails.totalTransactionCount})`}
                        </Text>
                        {statusId != 1 && (
                          <Text
                            style={{
                              color: recordsStatusItem.borderColor2,
                              position: "absolute",
                              bottom: 0,
                              width: 200,
                              bottom: -15,
                            }}
                          >
                            {moment(recordsDatails.pendingDatetime).format(
                              "YYYY-MM-DD HH:mm"
                            )}
                          </Text>
                        )}
                      </View>
                    </View>

                    {
                      // statusId != 6 &&
                      <View>
                        <View
                          style={{
                            backgroundColor: "#DCDCE0",
                            width: 2,
                            height: 40,
                            marginVertical: 6,
                            marginLeft: 10,
                          }}
                        ></View>
                        <View style={{ flexDirection: "row" }}>
                          {statusId == 5 ? (
                            <Image
                              source={require("../../images/record2.png")}
                              resizeMode="stretch"
                              style={styles.iconImg}
                            ></Image>
                          ) : statusId == 4 ? (
                            <Image
                              source={require("../../images/record3.png")}
                              resizeMode="stretch"
                              style={styles.iconImg}
                            ></Image>
                          ) : statusId == 10 ? (
                            recordsDatails.totalTransactionCount ==
                              recordsDatails.subTransactionCount ? (
                              <Image
                                source={require("../../images/record3.png")}
                                resizeMode="stretch"
                                style={styles.iconImg}
                              ></Image>
                            ) : (
                              <Image
                                source={require("../../images/record33.png")}
                                resizeMode="stretch"
                                style={styles.iconImg}
                              ></Image>
                            )
                          ) : (
                            ViewIcon
                          )}
                          <View
                            style={{
                              marginLeft: 15,
                            }}
                          >
                            <Text style={{ color: recordsStatusItem.color3 }}>
                              {recordsStatusItem.text3}
                            </Text>

                            {/* 4 //'已完成'
                                5 //'拒绝'
                                6 //cancle
                                10 //比分 */}

                            {(statusId == 10 ||
                              statusId == 4 ||
                              statusId == 5 ||
                              statusId == 6) && (
                                <Text
                                  style={{
                                    color: recordsStatusItem.borderColor3,
                                    position: "absolute",
                                    bottom: 0,
                                    width: 200,
                                    bottom: -15,
                                  }}
                                >
                                  {moment(
                                    statusId == 5 || statusId == 6
                                      ? recordsDatails.rejectedDateTime
                                      : recordsDatails.approvedDateTime
                                  ).format("YYYY-MM-DD HH:mm")}
                                </Text>
                              )}
                          </View>
                        </View>
                      </View>
                    }
                  </View>
                </View>

                {this.createBtnStatus()}
              </View>
            )}
          </View>
          {
            recordsDatails.paymentMethodId.toLocaleUpperCase() == "LB" &&
            Boolean(recordsDatails.isAbleCompleteFromUI) &&
            Boolean(recordsDatails.reasonMsg) &&
            <View style={[styles.ableCompleteReasonMsg, {}]}>
              <Text style={{ color: '#666', fontSize: 14 }}>乐天使温馨提醒 ：</Text>
              <Text style={{ color: '#999', fontSize: 12, paddingTop: 5 }}>
                {recordsDatails.reasonMsg}
              </Text>
            </View>
          }
        </ScrollView>
      </ViewShot>
    );
  }
}

const styles = StyleSheet.create({
  viewBtndetail: {
    borderWidth: 1,
    borderRadius: 6,
    width: 120,
    alignItems: "center",
    paddingVertical: 4,
    borderColor: "#00A6FF",
    marginTop: 10,
  },
  btnBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .4)",
    width,
    height,
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10000,
    justifyContent: "flex-end",
  },
  modalBgContainer: {
    backgroundColor: "#EFEFF4",
    paddingTop: 15,
    paddingHorizontal: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 40,
  },
  modalBgContainerText: {
    textAlign: "center",
    fontSize: 16,
    paddingBottom: 25,
    color: "#000000",
    fontWeight: "600",
  },
  viewContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  datails: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  topLeftText1: {
    color: "#9B9B9B",
  },
  topRigthText1: {
    color: "#000",
  },
  topRigthText2: {
    color: "#9B9B9B",
  },
  topRigthText3: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "right",
  },
  recordsDatailsBtn: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#25AAE1",
    height: 40,
    marginBottom: 10,
    backgroundColor: "#00A6FF",
    borderRadius: 8,
  },
  recordsDatailsBtn1: {
    width: (width - 40) * 0.45,
  },
  recordsDatailsBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalListStyle: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  modalListStyleText: {
    color: "#999999",
    width: 95,
    marginRight: 5,
    fontSize: 12,
  },
  modalListStyleText1: {
    width: width - 140,
    fontSize: 12,
  },
  depositStatusBox: {
    flexDirection: "row",
    height: 32,
    width: 240,
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1,
    paddingLeft: 35,
  },
  depositStatusImg: {
    marginRight: 5,
    width: 18,
    height: 18,
    position: "absolute",
    left: 10,
  },
  recordsStatusBox: {
    position: "relative",
    marginTop: 10,
    marginBottom: 20,
  },
  recordsStatusBoxLine: {
    width: 2,
    height: 20,
    backgroundColor: "#B2B2B2",
    marginLeft: 18,
  },
  depositStatusBoxText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  iconImg: {
    width: 20,
    height: 20,
  },
  iconImg1: {
    transform: [{ scale: 0.8 }],
  },
  modalContainer: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, .6)",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: width * 0.9,
    overflow: "hidden",
  },
  modalTop: {
    height: 50,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#25AAE1",
    flexDirection: "row",
    paddingHorizontal: 20,
    backgroundColor: "#00A6FF",
  },
  modalTopText: {
    color: "#fff",
    fontSize: 16,
  },
  modalBody: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  modalBtnBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  modalBtn: {
    height: 38,
    width: (width * 0.9 - 30) / 2.1,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  modalBtnText: {
    fontWeight: "bold",
    color: "#58585B",
  },
  manualDepositText: {
    lineHeight: 22,
  },
  deposiBanktList: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 55,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderTopWidth: 1,
  },
  ableCompleteReasonMsg: {
    position: 'relative',
    marginVertical: 10,
    // bottom: Platform.OS == 'ios' ? -70 : -30,
    zIndex: 99,
  },
  reasonMsg: {
    marginBottom: 12,
    fontSize: 12,
    lineHeight: 19,
    color: '#666'
  },
  modalClose: {
    position: 'absolute',
    top: 25,
    right: 25,
    zIndex: 99,
  },
  modalContainerText: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 22,
  },
  modalContainerList: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 6,
    paddingRight: 6,
  },
});

export default recordsDatails;
