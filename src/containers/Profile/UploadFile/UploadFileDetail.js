import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Toast } from "antd-mobile-rn";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import ImagePicker from "react-native-image-picker";
import {
  ImagePickerOption,
} from "../../Common/CommonFnData";
import Modals from "../../Common/Modals";
import { Toasts } from "../../../containers/Toast";
import PromptBox from "../../Common/Deposit/PromptBox";
import RNHeicConverter from "react-native-heic-converter";
import { errCodeHandle } from "../../Common/ErrorHandle";

const UploadFileDetailText = {
  type1: {
    FRONT: "证件正面",
    BACK: "证件反面",
  },
  type2: {
    FRONT: "地址证明",
    BACK: "",
  },
  type3: {
    FRONT: "手持身份证 - 正面",
    BACK: "手持身份证 - 反面",
  },
  type4: {
    DEFAULT: "银行账户证明",
    BACK: "",
  },
  type5: {
    DEFAULT: "存款证明",
    BACK: "",
  },
};

const docTypeIdName = {
  "1": "Identification", 
  "2": "Address", 
  "3": "IdentificationWithRealTimeFace",
  "4": "Deposit", 
  "5": "BankAccountOwner"
}

const { width, height } = Dimensions.get("window");

class UploadFileDetail extends React.Component {
  constructor(props) {
    super(props);
    const { imageRestriction, documents } = this.props;
    this.state = {
      imgExtension: imageRestriction.extension
        .map((v) => v.toLocaleLowerCase())
        .join(","),
      imgSize: imageRestriction.size,
      docToUpload: documents.docToUpload,
      docTypeId: documents.docTypeId * 1,
      remainingUploadTries: documents.remainingUploadTries,
      imageType1: "",
      filename1: "",
      fileBytes1: "",
      imageType0: "",
      filename0: "",
      fileBytes0: "",

      errString1: "",
      errString2: "",

      openRemoveModal: false,
      closeIndex: null,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      title: this.props.pageTitle,
    });
  }

  selectPhotoTapped(v, docTypeId) {
    console.log(docTypeId);
    ImagePicker.launchImageLibrary(ImagePickerOption, (response) => {
      console.log(response);
      if (response.didCancel) {
      } else if (response.error) {
        Alert.alert("上传失败由于未知的错误， 请稍后再试 ");
      } else if (response.customButton) {
      } else {
        const { imageRestriction } = this.props;

        //后缀要求小写
        let source = { uri: response.data };
        let fileName = response.fileName;
        let fileSize = response.fileSize;
        if (!fileName) {
          Toast.fail(
            "档名错误",
            2
          );
          return;
        }
        let extension = imageRestriction.extension.map((v) =>
          v.toLocaleLowerCase()
        );
        extension.push(".heic", ".heif");
        let size = parseInt(imageRestriction.size);
        let fileNameArr = fileName.split(".");
        let imgType = fileNameArr[fileNameArr.length - 1].toLocaleLowerCase();
        let extensionFlag = Boolean(extension.find((v) => v.includes(imgType)));
        if (!extensionFlag) {
          Toast.fail(
            "仅接受" + extension.join(",") + "格式档案",
            2
          );
          if (docTypeId == 1) {
            this.setState({
              errString1: `此文件不支持上传。仅能使用${extension.join(",")}`,
            });
          } else {
            this.setState({
              errString2: `此文件不支持上传。仅能使用${extension.join(",")}`,
            });
          }
          return;
        }
        console.log(size * 1024 * 1024)
        if (fileSize > size * 1024 * 1024) {
          if (docTypeId == 0) {
            this.setState({
              errString1: `此文件太大。请小于${imageRestriction.size}`,
            });
          } else {
            this.setState({
              errString2: `此文件太大。请小于${imageRestriction.size}`,
            });
          }
          return;
        } else {
          if (docTypeId == 0) {
            this.setState({
              errString1: "",
            });
          } else {
            this.setState({
              errString2: "",
            });
          }
        }

        if (
          Platform.OS === "ios" &&
          fileName &&
          (fileName.endsWith(".heic") ||
            fileName.endsWith(".HEIC") ||
            fileName.endsWith(".heif") ||
            fileName.endsWith(".HEIF"))
        ) {
          RNHeicConverter.convert({ path: response.origURL }).then((data) => {
            const { success, path, error } = data;
            if (!error && success && path) {
              fileName = fileName.replace(".heic", ".jpg");
              fileName = fileName.replace(".HEIC", ".jpg");
              fileName = fileName.replace(".heif", ".jpg");
              fileName = fileName.replace(".HEIF", ".jpg");
              this.setState({
                [`imageType${docTypeId}`]: v.imageType,
                [`filename${docTypeId}`]: fileName,
                [`fileBytes${docTypeId}`]: source.uri,
              });
            } else {
              Toasts.error("此文件不支持上传。");
            }
          });
        } else {
          this.setState({
            [`imageType${docTypeId}`]: v.imageType,
            [`filename${docTypeId}`]: fileName,
            [`fileBytes${docTypeId}`]: source.uri,
          });
        }
      }
    });
  }

  cancleVerification = (docTypeId) => {
    this.setState(
      {
        [`imageType${docTypeId}`]: "",
        [`filename${docTypeId}`]: "",
        [`fileBytes${docTypeId}`]: "",
        openRemoveModal: false,
        closeIndex: null,
      },
      () => {
        Toasts.success("文件已移除", 200000000);
      }
    );
  };

  postVerification() {
    const { docTypeId, remainingUploadTries } = this.state;
    const {
      imageType0,
      filename0,
      fileBytes0,
      imageType1,
      filename1,
      fileBytes1,
    } = this.state;
    let params = [
      {
        imageType: imageType0,
        filename: filename0,
        fileBytes: fileBytes0,
      },
      {
        imageType: imageType1,
        filename: filename1,
        fileBytes: fileBytes1,
      },
    ].filter((v) => v.filename && v.fileBytes);
    Toast.loading(
      <Text style={{ textAlign: "center" }}>文档上传中{"\n"}请稍等...</Text>,
      2000
    );
    
    const getDocTypeName = docTypeIdName[docTypeId+""];
    fetchRequest(
      ApiPort.PostVerification +
      "docTypeId=" +
      getDocTypeName +
      "&numberOfTry=" +
      remainingUploadTries +
      "&",
      "POST",
      params
    )
      .then((res) => {
        Toast.hide();
        if (res.isSuccess) {
          Toast.success("上传成功", 2);
          Actions.pop();
          this.props.getMemberDocuments();
        } else {
          let error = res.errors;
          Toast.fail(error[0].description, 2);
        }
      })
      .catch((err) => {
        Toast.hide();
        errCodeHandle(err, "上传失败");
      });
  }

  render() {
    const {
      remainingUploadTries,
      imageType0,
      imageType1,
      docTypeId,
      imgExtension,
      imgSize,
      docToUpload,
      errString1,
      errString2,
      openRemoveModal,
    } = this.state;
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#EFEFF4",
          paddingHorizontal: 15,
          paddingVertical: 24,
        }}
      >
        <Modals.InfoModal
          desc={"您是否确定要移除这个文件?"}
          onPressLeft={() => {
            this.setState({
              openRemoveModal: false,
              closeIndex: null,
            });
          }}
          onPressRight={() => {
            this.cancleVerification(this.state.closeIndex);
          }}
          leftText="保留"
          rightText="移除文件"
          title="移除文件"
          visible={openRemoveModal}
        />

        <View style={styles.textInforWrap}>
          <Text style={[styles.textInfor]}>
            请上传相应文件，仅支持{imgExtension}文件。 每个文件不超于{imgSize}
          </Text>
        </View>

        {docToUpload.map((v, i) => {
          let flag = this.state[`imageType${i}`] === v.imageType;
          return (
            <View
              key={i}
              style={[
                styles.uploadFileWrap,
                {
                  backgroundColor: "#fff",
                  borderBottomColor: "#E5E5E5",
                  borderRadius: docToUpload.length > 1 ? 0 : 10,
                  paddingBottom: docToUpload.length > 1 && i === 0 ? 0 : 24,
                  borderTopLeftRadius:
                    docToUpload.length == 1
                      ? 10
                      : docToUpload.length > 1 && i === 0
                        ? 10
                        : 0,
                  borderTopRightRadius:
                    docToUpload.length == 1
                      ? 10
                      : docToUpload.length > 1 && i === 0
                        ? 10
                        : 0,
                  borderBottomLeftRadius:
                    docToUpload.length == 1
                      ? 10
                      : docToUpload.length > 1 && i === 1
                        ? 10
                        : 0,
                  borderBottomRightRadius:
                    docToUpload.length == 1
                      ? 10
                      : docToUpload.length > 1 && i === 1
                        ? 10
                        : 0,
                },
              ]}
            >
              {docTypeId == 3 && i == 0 && (
                <PromptBox
                  type="info"
                  containerStyle={{ marginBottom: 16 }}
                  msg={`本人需手持身份证正反面进行拍摄，必须清晰显示脸部面貌和身份证信息。`}
                />
              )}

              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  width: "100%",
                  marginBottom: 16,
                }}
              >
                <Text style={[styles.uplodFileText, { color: "#000" }]}>
                  {
                    UploadFileDetailText[`type${docTypeId}`][
                      v.imageType.toLocaleUpperCase()
                      ]
                  }
                </Text>
                {i == 0 && (
                  <Touch
                    onPress={() => {
                      console.log(this.props.pageTitle);
                      console.log(this.props.documents);
                      Actions.UploadExample({
                        pageTitle: this.props.pageTitle,
                        docTypeId: this.props.documents.docTypeId * 1,
                      })
                    }
                    }
                  >
                    <Text style={{ color: "#00A6FF", fontSize: 14 }}>
                      查看示例
                    </Text>
                  </Touch>
                )}
              </View>

              {flag ? (
                <View style={styles.filenameTextBox}>
                  <Text style={[styles.filenameText, { color: "#000" }]}>
                    {this.state[`filename${i}`]}
                  </Text>
                  <TouchableOpacity
                    style={styles.filenameCancle}
                    onPress={() => {
                      this.setState({
                        openRemoveModal: true,
                        closeIndex: i,
                      });
                    }}
                  >
                    <Image
                      style={{ width: 16, height: 16 }}
                      source={require("../../../images/icon/close-circle.png")}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadFileBtn}
                  onPress={this.selectPhotoTapped.bind(this, v, i)}
                >
                  <Image
                    style={styles.uploadTextIcon}
                    source={require("../../../images/icon/plus-blue.png")}
                  ></Image>
                  <Text style={styles.uploadTextInfor}>选择文件</Text>
                </TouchableOpacity>
              )}
              {i == 0 && errString1 !== "" && (
                <View
                  style={{
                    backgroundColor: "#FEE5E5",
                    padding: 12,
                    width: "100%",
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                >
                  <Text style={{ color: "#EB2121", fontSize: 12 }}>
                    {errString1}
                  </Text>
                </View>
              )}
              {i == 1 && errString2 !== "" && (
                <View
                  style={{
                    backgroundColor: "#FEE5E5",
                    padding: 12,
                    width: "100%",
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                >
                  <Text style={{ color: "#EB2121", fontSize: 12 }}>
                    {errString2}
                  </Text>
                </View>
              )}

              {docToUpload.length > 1 && i == 0 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#E5E5E5",
                    width: "100%",
                    marginTop: 24,
                  }}
                />
              )}
            </View>
          );
        })}

        <Text
          style={{
            color: "#999999",
            fontSize: 12,
            textAlign: "center",
            marginVertical: 24,
          }}
        >
          (<Text style={{ color: "#00A6FF" }}>{remainingUploadTries}</Text>)
          次尝试机会
        </Text>

        {(
          docTypeId === 1
            ? imageType1.length > 0 && imageType0.length > 0
            : imageType1.length > 0 || imageType0.length > 0
        ) ? (
          <TouchableOpacity
            style={[styles.closeBtnWrap, { backgroundColor: "#00A6FF" }]}
            onPress={this.postVerification.bind(this)}
          >
            <Text style={styles.closeBtnText}>提交</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.closeBtnWrap, { backgroundColor: "#E1E1E6" }]}
          >
            <Text style={[styles.closeBtnText, { color: "#BCBEC3" }]}>
              提交
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
  userSetting: state.userSetting,
});

export default connect(mapStateToProps)(UploadFileDetail);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingTop: 20,
  },
  filenameTextBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F5F5F5",
    justifyContent: "space-between",
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  filenameText: {},
  filenameCancle: {
    // paddingVertical: 10,
    // width,
    // alignItems: "center",
  },
  filenameCancleText: {
    color: "#00AEEF",
    textDecorationLine: "underline",
  },
  textInforWrap: {
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  textInfor: {
    fontSize: 12,
    color: "#666",
    lineHeight: 20,
  },
  uploadFileWrap: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  uplodFileText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadFileImg: {
    width: 50,
    height: 65,
    marginTop: 15,
    marginBottom: 15,
  },
  uploadFileImg1: {
    marginTop: 15,
    marginBottom: 15,
    width: 80,
    height: 65,
  },
  uploadFileBtn: {
    backgroundColor: "#F5F5F5",
    width: "100%",
    borderRadius: 8,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  uploadTextIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  uploadTextInfor: {
    color: "#00A6FF",
    fontSize: 13,
  },
  closeBtnWrap: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 8,
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
