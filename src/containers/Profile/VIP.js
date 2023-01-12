import React from "react";
import { Dimensions, Image, Platform, StyleSheet, Text, View, WebView, ActivityIndicator } from "react-native";
import { Toast } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import WebViewIOS from "react-native-webview";
import LivechatDragHoliday from "../LivechatDragHoliday"; //可拖動懸浮
import { Actions } from "react-native-router-flux";
const { width, height } = Dimensions.get("window");
import { viewStyle } from "./VipCSS"
import AutoHeightImage from 'react-native-auto-height-image';
import LoadingBone from "../Common/LoadingBone";

const htmls = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge "><meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no"><title>Document</title></head><body>`;

class Vip extends React.Component<any, any> {
  inputRef: any;

  constructor(props) {
    super(props);
    this.state = {
      aboutDetail: "",
      aboutDetail2: "",
      aboutGeneralMember: "", //第一个
      getVIPImg1: "",
      getVIPImg2: "",
      Timeout: "",
      tabType: 1,
      activeSections: [],
      tab1Loading: true,
      tab2Loading: true
    };
  }

  componentDidMount() {

    this.getVIPImgCache();

    // tab2 上方圖片
    this.getVIPImgDetail();
    this.props.navigation.setParams({
      title: "",
    });
  }

  // fetch normal和roller Vip圖片
  getAllVIPImg = () => {
    // Toast.loading();
    Promise.all([this.getVIPImg(), this.getVIPImgRoller(), this.getVipList()]).then(
      async (data) => {
        // 整理
        this.getAbout(data[0], data[1], data[2]);
        // Toast.hide();
      },
      (e) => {
        console.log("error " + e);
      }
    );
  };

  // 取緩存 VIP normal圖片
  getVIPImgCache = () => {
    global.storage
      .load({
        key: "getVIPImg",
        id: "getVIPImg",
      })
      .then((data) => {
        this.setState(
          {
            getVIPImg1: data,
          },
          () => {
            this.getVIPImg2Cache();
          }
        );
      })
    this.getAllVIPImg();
  };

  // 取緩存 VIP roller圖片
  getVIPImg2Cache = () => {
    global.storage
      .load({
        key: "getVIPImgRoller",
        id: "getVIPImgRoller",
      })
      .then((data) => {
        this.setState(
          {
            getVIPImg2: data,
          },
          () => {
            // 整理
            this.getAbout();
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getAbout(data1, data2, data3) {
    global.storage
      .load({
        key: "getAbout",
        id: "getAbout",
      })
      .then((ret) => {
        let getVipPage1 = "";
        let getVipPage2 = "";

        getVipPage1 = ret.filter((item) => {
          return item.id === "5658";
        });

        getVipPage2 = ret.filter((item) => {
          return item.id === "5659";
        });

        let vip1UI = "";
        let vip2UI = "";

        let dataList = (getVipPage1 && getVipPage1[0]) || "";
        if (dataList) {
          vip1UI = this.vip1TabUI(dataList, data1, data2);
        }

        let dataList2 = (getVipPage2 && getVipPage2[0]) || "";
        if (dataList2) {
          vip2UI = this.vip2TabUI(dataList2, data1, data2, data3);
        }

        this.setState({ aboutDetail: vip1UI, aboutDetail2: vip2UI });

      })
      .catch((err) => {
        Toast.fail("网络错误，请稍后重试", 2, () => {
          console.log(err);
          Actions.pop();
        });
        window.getAllAbout && window.getAllAbout();
      });
  }

  // 處理VIP tab1 內容
  vip1TabUI = (dataList, data1, data2) => {
    let imgs = data1 || this.state.getVIPImg1;
    let imgs2 = data2 || this.state.getVIPImg2;

    let aboutGeneralMember = (dataList != "" && dataList.body.general_member) || "";
    console.log(aboutGeneralMember);
    let VIP_Level =
      (dataList != "" && dataList.body.VIP_Level) || "";

    let aboutDetail =
      (dataList != "" && Object.values(dataList.body)) || [];

    let divBanner1 = imgs[0]
      ? `
          <div class="caption">一般会员等级</div>
          <div class="Banner"><img alt="bg" src='${imgs[0].cmsImageUrl}' /><img alt="bg" src='${imgs[1].cmsImageUrl}' /><img alt="bg" src='${imgs[2].cmsImageUrl}' /></div>
          `
      : "";

    let divBanner2 = imgs[0]
      ? `
          <div class="caption">VIP 会员等级</div>
          <div class="Banner"><img alt="bg" src='${imgs2[0].cmsImageUrl}' /><img alt="bg" src='${imgs2[1].cmsImageUrl}' /><img alt="bg" src='${imgs2[2].cmsImageUrl}' /></div>
          `
      : "";
    //讲html片段拼接成为一段
    VIP_Level = VIP_Level.replace(
      ">",
      ` class="table0"> `
    );
    aboutGeneralMember = aboutGeneralMember.replace(
      ">",
      ` class="table0 generalMember"> `
    );
    aboutGeneralMember = aboutGeneralMember.replace("<caption>一般会员等级</caption>",``)
    aboutDetail = aboutDetail.map((item, index) => {
      let classL = "table" + index;
      let htmls = item.replace(">", ` class="${classL}"> `);
      return index > 1 ? htmls : "";
    });
    aboutDetail = divBanner1 + aboutGeneralMember + `<div class="line"></div>` + divBanner2 + aboutDetail.join("");
    console.log(aboutDetail)
    return aboutDetail;
  }

  // 處理VIP tab2 內容
  vip2TabUI = (dataList, data1, data2, data3) => {
    let faqMap = data3 ? data3.map((item) => {
      const arrow = `<div class="arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up"><polyline points="18 15 12 9 6 15"></polyline></svg>
    </div>`
      let htmls = `<details><summary><span>${item.title}</span>${arrow}</summary><div><p>${item.body}</p></div></details>`;
      return htmls;
    }) : [];

    let faqList = [`<div class="wrapper accordion">${faqMap.join("")}</div>`]
    let div1 =
      (dataList != "" && Object.values(dataList.body)) || [];

    div1 = div1.map((item, index) => {
      let classL = "tab2Table" + index;
      let htmls = item.replace(">", ` class="${classL}"> `);
      return htmls;
    });

    div1.splice(-1, 0, ...faqList)
    return div1.join("");
  }


  //获取vip的图片
  getVIPImg() {
    return fetch(CMS_Domain + ApiPort.CMS_VIP, {
      method: "GET",
      headers: { token: CMS_token },
    })
      .then((response) => (headerData = response.json()))
      .then((data) => {
        if (data) {
          storage.save({
            key: "getVIPImg",
            id: "getVIPImg",
            data: data,
            expires: null,
          });

          return data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getVIPImgRoller() {
    return fetch(CMS_Domain + ApiPort.CMS_VIP_Roller, {
      method: "GET",
      headers: { token: CMS_token },
    })
      .then((response) => (headerData = response.json()))
      .then((data) => {
        if (data) {
          storage.save({
            key: "getVIPImgRoller",
            id: "getVIPImgRoller",
            data: data,
            expires: null,
          });

          return data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getVipList() {
    return fetch(CMS_Domain + ApiPort.CMS_VipList, {
      method: "GET",
      headers: { token: CMS_token },
    })
      .then((response) => (headerData = response.json()))
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getVIPImgDetail() {
    global.storage
      .load({
        key: "getVIPImgDetail",
        id: "getVIPImgDetail",
      })
      .then((data) => {
        console.log('123')
        console.log(data)
        this.setState({
          detailBanner: data[0].cmsImageUrl,
        });
      })
    fetch(CMS_Domain + ApiPort.CMS_VIP_Detail, {
      method: "GET",
      headers: { token: CMS_token },
    })
      .then((response) => (headerData = response.json()))
      .then((data) => {
        if (data) {
          this.setState({
            detailBanner: data[0].cmsImageUrl,
          });
          storage.save({
            key: "getVIPImgDetail",
            id: "getVIPImgDetail",
            data: data,
            expires: null,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderHeader = (section, _, isActive) => {
    return (
      <View style={[styles.header, isActive ? styles.active : styles.inactive]}>
        <Text style={styles.headerText}>{section.title}</Text>
        <Image
          resizeMode="contain"
          source={require("../../images/up.png")}
          style={{ width: 12, height: 12 }}
        />
      </View>
    );
  };

  setSections = (sections) => {
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };

  hideSpinner1() {
    this.setState({ tab1Loading: false });
  }

  hideSpinner2() {
    this.setState({ tab2Loading: false });
  }

  loadingBoneUI = () => {
    return (
      <View style={{marginTop: 20}}>
        <View style={ {
          marginHorizontal: 20,
          width: "70%",
          overflow: "hidden",
          backgroundColor: "#50535a",
          marginBottom: 12,
          height: 9
        }}>
          <LoadingBone type={"dark"} boneWidth={"100%"} />
        </View>
        <View style={ {
          marginHorizontal: 20,
          width: "85%",
          overflow: "hidden",
          backgroundColor: "#50535a",
          marginBottom: 12,
          height: 9
        }}>
          <LoadingBone type={"dark"} boneWidth={"100%"} />
        </View>
        <View style={ {
          marginHorizontal: 20,
          width: "50%",
          overflow: "hidden",
          backgroundColor: "#50535a",
          marginBottom: 12,
          height: 9
        }}>
          <LoadingBone type={"dark"} boneWidth={"100%"} />
        </View>
      </View>
    )
  }

  render() {
    const { aboutDetail, aboutDetail2, tabType, tab1Loading, tab2Loading} = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#17191C" }}>

        <View style={[styles.topNav]}>
          <Touch
            onPress={() => {
              Actions.pop();
            }}
            style={{ position: "absolute", left: 15 }}
          >
            <Image
              resizeMode="stretch"
              source={require("../../images/icon-white.png")}
              style={{ width: 25, height: 25 }}
            />
          </Touch>
          <View style={styles.btnType}>
            <Touch
              style={[
                styles.btnList,
                { backgroundColor: tabType == 1 ? "#fff" : "transparent" },
              ]}
              onPress={() => {
                this.setState({ tabType: 1 });
              }}
            >
              <Text
                style={[
                  styles.btnTxt,
                  { color: tabType == 1 ? "#00a6ff" : "#CCEDFF" },
                ]}
              >
                会员等级
              </Text>
            </Touch>
            <Touch
              style={[
                styles.btnList,
                { backgroundColor: tabType == 2 ? "#fff" : "transparent" },
              ]}
              onPress={() => {
                this.setState({ tabType: 2 });
              }}
            >
              <Text
                style={[
                  styles.btnTxt,
                  { color: tabType == 2 ? "#00a6ff" : "#CCEDFF" },
                ]}
              >
                详情
              </Text>
            </Touch>
          </View>
        </View>
        {Platform.OS == "ios" && tabType == 1 && tab1Loading && this.loadingBoneUI()}
        {Platform.OS == "android" && aboutDetail === "" && tabType == 1 && tab1Loading && this.loadingBoneUI()}
        {aboutDetail != "" && (
          <View style={{ opacity: tabType == 1 ? 1 : 0, flex: tabType == 1 ? height : 0  }}>
            {Platform.OS == "ios" ? (
              <WebViewIOS
                originWhitelist={["*"]}
                source={{
                  html: `${htmls}${viewStyle} ${aboutDetail}</body></html>`,
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mixedContentMode="always"
                scalesPageToFit={false}
                style={{ flex: 1, backgroundColor: "#17191C" }}
                onLoadEnd={() => this.hideSpinner1()}
              />
            ) : (
              Platform.OS == "android" && (
                <WebView
                  originWhitelist={["*"]}
                  source={{
                    html: `${htmls}${viewStyle} ${aboutDetail}</body></html>`,
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  mixedContentMode="always"
                  scalesPageToFit={false}
                  style={{ flex: 1, backgroundColor: "#17191C" }}
                  onLoadEnd={() => this.hideSpinner1()}
                />
              )
            )}
          </View>
        )}

        {Platform.OS == "ios" && tabType == 2 && tab2Loading && this.loadingBoneUI()}
        {Platform.OS == "android" && aboutDetail2 === "" && tabType == 2 && tab2Loading && this.loadingBoneUI()}

        <View style={{ opacity: tabType == 2 ? 1 : 0, flex: tabType == 2 ? height : 0, backgroundColor: "#17191C" }}>
          {tabType == 2 && (
            <AutoHeightImage
              resizeMode="stretch"
              source={{ uri: this.state.detailBanner }}
              width={width}
            />
          )}
          {aboutDetail2 !== "" && (
            <View style={{flex: 1, position: "relative"}}>
              {/*<Image source={require("../../images/home/vipTab2BG.png")}*/}
              {/*       style={{ width: width, height: 200, position: "absolute",top: -150, zIndex: 999  }} />*/}
              {
                Platform.OS == "ios" ? (
                  <WebViewIOS
                    originWhitelist={["*"]}
                    source={{
                      html: `${htmls}${viewStyle} ${aboutDetail2}</body></html>`,
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    mixedContentMode="always"
                    scalesPageToFit={false}
                    style={{ flex: 1, backgroundColor: "#17191C" }}
                    onLoad={() => this.hideSpinner2()}
                  />
                ) : (
                  Platform.OS == "android" && (
                    <WebView
                      originWhitelist={["*"]}
                      source={{
                        html: `${htmls}${viewStyle} ${aboutDetail2}</body></html>`,
                      }}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      mixedContentMode="always"
                      scalesPageToFit={false}
                      style={{ flex: 1, backgroundColor: "#17191C" }}
                      onLoad={() => this.hideSpinner2()}
                    />
                  )
                )
              }
            </View>
          )}
        </View>

      </View>
    );
  }
}

export default Vip;

const styles = StyleSheet.create({
  topNav: {
    width: width,
    height: 50,
    backgroundColor: "#00a6ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    zIndex: 9999
  },
  btnType: {
    backgroundColor: "#7676801F",
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btnList: {
    width: 110,
    backgroundColor: "#00A6FF",
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btnTxt: {
    textAlign: "center",
    lineHeight: 32,
  },
  tableHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#707070",
    borderBottomWidth: 1,
  },
  tableHeadLast: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableHeadWrap: {
    flex: 1,
    height: 40,
    justifyContent: "center",
  },
  tableHeadText: {
    textAlign: "center",
    color: "#D6D1C2",
    fontWeight: "bold",
    fontSize: 12,
  },
  tableBodyText: {
    textAlign: "center",
    color: "#D6D1C2",
    fontSize: 12,
  },
  tableBodyTitleText: {
    textAlign: "left",
    color: "#D6D1C2",
    fontSize: 12,
    left: 25
  },
  content: {
    backgroundColor: "#2D2F33",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    // height: 50
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  header: {
    // height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2D2F33",
    padding: 15,
    marginTop: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  inactive: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  active: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: 14,
    color: "#D6D1C2",
    lineHeight: 20,
    paddingRight: 5
  },
  ruleText: {
    color: "#ABA79D",
    lineHeight: 20,
    marginBottom: 3,
    fontSize: 12,
  },
});

const styleHtmls = StyleSheet.create({
  p: {
    fontSize: 12,
    color: "#D6D1C2",
    // lineHeight: 17,
  },
  a: {
    fontSize: 12,
    color: "#D6D1C2",
    lineHeight: 17,
  },
});
