import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Actions } from "react-native-router-flux";

const { width, height } = Dimensions.get("window");

const UploadInfor = {
  pending: {
    title: "审核中",
    infor: "您的文件正在审核中",
    buttonText: "知道了",
    imgSrc: require("../../../images/upload/pending.png"),
  },
  approve: {
    title: "验证成功",
    infor: "您的文件已验证",
    buttonText: "知道了",
    imgSrc: require("../../../images/upload/approve.png"),
  },
  reject: {
    title: "被拒绝",
    infor: "请重新上传",
    buttonText: "关闭",
    imgSrc: require("../../../images/upload/reject.png"),
  },
};

class UploadFileStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.navigation.setParams({
      title: this.props.pageTitle,
    });
  }

  changeUploadPage = () => {
    const { imageRestriction, documents, pageTitle, getMemberDocuments } =
      this.props;
    const docStatus = documents.docStatus.toLocaleLowerCase();
    Actions.pop();
    if (docStatus === "reject") {
      if (
        Array.isArray(documents.docToUpload) &&
        documents.docToUpload.length === 0
      ) {
        let documentsJson = JSON.parse(JSON.stringify(documents));
        let docTypeId = documents.docTypeId;
        if (docTypeId == 1 || docTypeId == 3) {
          documentsJson.docToUpload = [
            {
              imageType: "Front",
            },
            {
              imageType: "Back",
            },
          ];
        } else {
          documentsJson.docToUpload = [
            {
              imageType: "FRONT",
            },
          ];
        }
        Actions.UploadFileDetail({
          imageRestriction,
          documents: documentsJson,
          getMemberDocuments,
          pageTitle,
        });
      } else {
        Actions.UploadFileDetail({
          imageRestriction,
          documents,
          getMemberDocuments,
          pageTitle,
        });
      }
    }
  };

  render() {
    const { documents } = this.props;
    let {
      remainingUploadTries,
      attachmentBackFileName,
      attachmentFrontFileName,
    } = documents;
    let docStatus = documents.docStatus.toLocaleLowerCase();
    return (
      <View style={[styles.viewContainer]}>
        <View style={styles.imgBox}>
          <Image
            source={UploadInfor[docStatus].imgSrc}
            resizeMode="stretch"
            style={styles.uploadFileImg}
          />

          <Text style={[styles.textInfor1]}>
            {UploadInfor[docStatus].title}
          </Text>
          <Text style={[styles.textInfor2]}>
            {remainingUploadTries == 0 && docStatus === "reject"
              ? "你最多只能提交文件 3 次，请联系客服"
              : UploadInfor[docStatus].infor}
          </Text>
          {docStatus === "reject" && (
            <Text
              style={{
                color: "#999999",
                marginBottom: 10,
                marginTop: 15,
              }}
            >
              (<Text style={{color: "#00A6FF",}}>{remainingUploadTries}</Text>) 次尝试机会</Text>
          )}
        </View>
        <View style={{ marginHorizontal: 30 }}>
          {remainingUploadTries > 0 && docStatus === "reject" && (
            <TouchableOpacity
              style={[
                styles.closeBtnWrap,
                { backgroundColor: "#0CCC3C", marginBottom: 16 },
              ]}
              onPress={() => this.changeUploadPage()}
            >
              <Text style={styles.closeBtnText}>重试</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.closeBtnWrap, { backgroundColor: "#00A6FF" }]}
            onPress={() => {
              if (remainingUploadTries > 0 && docStatus === "reject") {
                Actions.personal();
              } else {
                console.log("hi");
                this.changeUploadPage();
              }
            }}
          >
            <Text style={styles.closeBtnText}>
              {UploadInfor[docStatus].buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default UploadFileStatus;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#EFEFF4",
  },
  imgName: {
    color: "#00aeff",
    fontSize: 13,
    marginBottom: 5,
  },
  closeBtnWrap: {
    width: "100%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  imgBox: {
    marginTop: 0.15 * height,
    alignItems: "center",
    marginBottom: 24,
  },
  textInfor1: {
    fontWeight: "bold",
    marginTop: 5,
    color: "#222222",
    fontSize: 20,
    marginBottom: 8,
  },
  textInfor2: {
    textAlign: "center",
    color: "#666666",
    fontSize: 14,
  },
  uploadFileImg: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
});
