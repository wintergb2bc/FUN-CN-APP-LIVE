import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import { Toast } from "antd-mobile-rn";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import LoadingBone from "../../Common/LoadingBone";
import Touch from "react-native-touch-once";

const { width, height } = Dimensions.get("window");

const UploadfileName = {
  type1: "身份证明",
  type2: "地址证明",
  type3: "实时人脸识别证明",
  type4: "银行账户证明",
  type5: "存款证明",
};

const UploadTypeIcon = {
  type1: require("../../../images/upload/type1.png"),
  type2: require("../../../images/upload/type2.png"),
  type3: require("../../../images/upload/type1.png"),
  type4: require("../../../images/upload/type4.png"),
  type5: require("../../../images/upload/type5.png"),
};

const uploadFileStatus = {
  invalid: {
    text: "",
  },
  pending: {
    text: "审核中",
    color: "#F2A523",
  },
  approve: {
    text: "已验证",
    color: "#59BA6D",
  },
  reject: {
    text: "被拒绝",
    color: "#FF0000",
  },
  noattachment: {
    text: "需要上传",
    color: "#999999",
  },
};

class UploadFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imageRestriction: "", documents: [], loading: false };
  }

  componentDidMount() {
    this.getMemberDocuments();
  }

  getMemberDocuments(flag, i) {
    global.storage
      .load({
        key: "Uploadfile",
        id: "Uploadfile",
      })
      .then((res) => {
        const data = res.result;
        this.setState({
          imageRestriction: data.imageRestriction,
          documents: data.documents,
        });
      })
      .catch(() => {
        Toast.loading("加载中,请稍候...", 2000);
        this.setState({
          loading: true,
        });
      });
    fetchRequest(ApiPort.MemberDocuments, "GET")
      .then((res) => {
        Toast.hide();
        if (res.isSuccess) {
          let data = res.result;
          let documents = data.documents;
          let imageRestriction = data.imageRestriction;
          this.setState({
            imageRestriction,
            documents,
            loading: false,
          });
          if (flag) {
            if (Array.isArray(documents) && documents.length > 0) {
              let documentsList = documents[i];
              let docStatus = documentsList.docStatus.toLocaleLowerCase();
              let uploadStatus = ["pending", "approve", "reject"].some(
                (v1) => v1 === docStatus
              );
              if (uploadStatus) {
                Actions.UploadFileStatus({
                  pageTitle: UploadfileName[`type${documentsList.docTypeId}`],
                  documents: documentsList,
                  imageRestriction,
                });
              }
            }
          }
          global.storage.save({
            key: "Uploadfile",
            id: "Uploadfile",
            data: res,
            expires: null,
          });
        }
      })
      .catch((err) => {
        Toast.hide();
        this.setState({
          loading: false,
        });
      });
  }

  actionToPage(v, i) {
    const { imageRestriction } = this.state;
    // v.docTypeId = 5
    if (Array.isArray(v.docToUpload) && v.docToUpload.length) {
      Actions.UploadFileDetail({
        imageRestriction,
        documents: v,
        getMemberDocuments: () => {
          this.getMemberDocuments(true, i);
        },
        pageTitle: UploadfileName[`type${v.docTypeId}`],
      });
    } else {
      let docStatus = v.docStatus.toLocaleLowerCase();
      let uploadStatus = ["pending", "approve", "reject"].some(
        (v1) => v1 === docStatus
      );
      if (uploadStatus) {
        Actions.UploadFileStatus({
          pageTitle: UploadfileName[`type${v.docTypeId}`],
          documents: v,
          imageRestriction,
          getMemberDocuments: () => {
            this.getMemberDocuments(true, i);
          },
        });
      }
    }
  }

  render() {
    const { documents, loading } = this.state;
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#EFEFF4",
          // paddingHorizontal: 15,
          paddingVertical: 24,
        }}
      >
        {Array.isArray(documents) && documents.length > 0 ? (
          <View style={{justifyContent: "center",
            alignItems: "center"}}>
            <Text style={{ color: "#666666", fontSize: 14, marginBottom: 24 }}>
              上传所需文件来验证您的帐户信息
            </Text>
            {documents.map((v, i) => {
              let docStatus = v.docStatus.toLocaleLowerCase();
              return (
                <View style={styles.managerListsStyle} key={i}>
                  <View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        resizeMode="stretch"
                        source={UploadTypeIcon[`type${v.docTypeId}`]}
                        style={{ width: 24, height: 24, marginRight: 8 }}
                      ></Image>
                      <Text style={[styles.managerListsText0]}>
                        {UploadfileName[`type${v.docTypeId}`]}
                      </Text>
                    </View>
                  </View>
                  <Touch
                    style={styles.managerListsTouch}
                    onPress={this.actionToPage.bind(this, v, i)}
                  >
                    <View style={styles.managerListsLeft}>
                      <View style={styles.managerListsTextWrap}>
                        {docStatus &&
                          uploadFileStatus[docStatus] &&
                          uploadFileStatus[docStatus].text.length > 0 && (
                            <Text
                              style={[
                                styles.managerListsText1,
                                {
                                  color:
                                    uploadFileStatus[docStatus].color || "#000",
                                },
                              ]}
                            >
                              {uploadFileStatus[docStatus].text}
                            </Text>
                          )}
                      </View>
                      <Image
                        resizeMode="stretch"
                        source={require("../../../images/icon-right.png")}
                        style={[styles.arrowRight]}
                      ></Image>
                    </View>
                  </Touch>
                </View>
              );
            })}
            <Touch
              style={styles.btn}
              onPress={() => {
                Actions.UploadFileGuide();
              }}
            >
              <Text style={styles.btnText}>如何上传您的文件</Text>
            </Touch>
          </View>
        ) : loading ? (
          <View>
            {Array.from({ length: 2 }, (v) => v).map((v, i) => {
              return (
                <View
                  style={[styles.managerLists, { backgroundColor: "#e0e0e0" }]}
                  key={i}
                >
                  <LoadingBone></LoadingBone>
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 200,
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../../../images/upload/empty.png")}
              style={{ width: 64, height: 64, margin: 16 }}
            ></Image>
            <Text style={{ color: "#666" }}>您的账户目前无需进行文件验证</Text>
          </View>
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

export default connect(mapStateToProps)(UploadFile);

const styles = StyleSheet.create({
  managerListsStyle: {
    backgroundColor: "#FFFFFF",
    width: "93%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
  managerListsText0: {
    fontSize: 14,
  },
  managerListsText1: {
    fontSize: 12,
  },
  arrowRight: {
    width: 16,
    height: 16,
    marginLeft: 8,
  },
  managerLists: {
    height: 50,
    justifyContent: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  managerListsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  btn: {
    borderWidth: 1,
    borderColor: "#00A6FF",
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  btnText: {
    color: "#00A6FF",
    fontSize: 14,
  },
});
