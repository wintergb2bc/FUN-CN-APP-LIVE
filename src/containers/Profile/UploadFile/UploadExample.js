import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  Image,
  View,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
  FlatList,
} from "react-native";

const { width, height } = Dimensions.get("window");

const data = {
  docTypeId_1: [
    {
      imgSrc: require("../../../images/upload/example/id1.png"),
      texts: [
        "聚焦在相片上，且敏锐度高。",
        "若背景较为杂乱，则图片须在最上层。",
        "身份证背景纹理清晰可见",
        "完美的灯光条件，无阴影遮挡。",
      ],
    },
    {
      imgSrc: require("../../../images/upload/example/id2.png"),
      texts: [
        "证件文字与照片模糊不清晰无法辩识。",
        "背景花纹纹理不清晰‧",
        "光线充足，照片上不能有阴影。",
      ],
    },
  ],
  docTypeId_2: [
    {
      imgSrc: require("../../../images/upload/example/address1.png"),
      texts: [
        "照片清晰完整。",
        "必须显示该文件的完整信息。",
        "该文件应有效且未过期。",
      ],
    },
    {
      imgSrc: require("../../../images/upload/example/address2.png"),
      texts: [
        "模糊或不完整的照片。",
        "遮挡住了部分信息。",
        "翻转或镜像了的照片。",
      ],
    },
  ],
  docTypeId_3: [
    {
      imgSrc: require("../../../images/upload/example/faceAndID1.png"),
      texts: [
        "脸部及证件信息清晰无遮挡。",
        "拍照时将手机或相机对焦在证件上。",
        "完美的灯光。。",
      ],
    },
    {
      imgSrc: require("../../../images/upload/example/faceAndID2.png"),
      texts: [
        "证件距离镜头太远，无法辨别证件信息 •",
        "脸部模糊，照片歪斜。",
        "证件遮挡脸部。",
        "不允许证件颠倒，较常发生在自拍上。",
      ],
    },
  ],
  docTypeId_4: [
    {
      imgSrc: require("../../../images/upload/example/bankOwner1.png"),
      texts: [
        "照片清晰完整。",
        "必须显示该文件的完整信息。",
        "该文件应有效且未过期。。",
      ],
    },
    {
      imgSrc: require("../../../images/upload/example/bankOwner2.png"),
      texts: [
        "模糊或不完整的照片。",
        "遮挡住了部分信息。",
        "翻转或镜像了的照片。",
      ],
    },
  ],
  docTypeId_5: [
    {
      imgSrc: require("../../../images/upload/example/depo1.png"),
      texts: [
        "照片清晰完整。",
        "必须显示该文件的完整信息。",
        "该文件应有效且未过期。。",
      ],
    },
    {
      imgSrc: require("../../../images/upload/example/depo2.png"),
      texts: [
        "模糊或不完整的照片。",
        "遮挡住了部分信息。",
        "翻转或镜像了的照片。",
      ],
    },
  ],
};


class UploadExample extends React.Component {
  componentDidMount() {
    this.props.navigation.setParams({
      title: `${this.props.pageTitle}示例`,
    });
  }

  get3secText = (xIdx, yIdx) => {
    if (xIdx === 0 && yIdx === 1) {
      return <Text style={{
        color: '#D90000',
        fontSize: 10,
        marginBottom: 4,
        marginLeft: 10
      }}>{"乐天使提醒: 在手机荧幕上对着画面中的身份证按下对焦使证件文字清晰，也将使你的验证比别人更早"}</Text>
    }
    if (xIdx === 1 && yIdx === 3) {
      return <Text style={{
        color: '#D90000',
        fontSize: 10,
        marginBottom: 4,
        marginLeft: 10
      }}>{"乐天使提醒: 在手机荧幕上对着画面中的身份证按下对焦使证件文字清晰，也将使你的验证比别人更早"}</Text>
    }
  }

  render() {
    const getData = data[`docTypeId_${this.props.docTypeId}`] || [];
    return (
      <ScrollView style={styles.root}>
        <View style={{
          paddingBottom: 50
        }}>
          {getData &&
            getData.map((x, xIdx) => {
              return (
                <View style={[styles.wrap, { paddingTop: this.props.docTypeId == 1 ? 20 : 0 }]} key={xIdx}>
                  <Image
                    resizeMode="contain"
                    style={[styles.img, { height: this.props.docTypeId == 5 ? 351 : 211 }]}
                    source={x.imgSrc}
                  />
                  <View style={styles.textWrap}>
                    {x.texts.length > 0 &&
                      x.texts.map((y, yIdx) => {
                        return (
                          <>
                            <Text key={yIdx} style={styles.text}>
                              • {y}
                            </Text>
                            {this.props.docTypeId == 3 && this.get3secText(xIdx, yIdx)}
                          </>
                        );
                      })}
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#EFEFF4",
    paddingHorizontal: 15,
    paddingVertical: 16,
  },
  wrap: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingBottom: 24,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 16,

  },
  textWrap: {
    paddingHorizontal: 24,
  },
  text: {
    color: "#222",
    fontSize: 12,
    marginBottom: 5,
  },
  img: {
    width: "100%",
    marginBottom: 16,
  },
});

export default UploadExample;
