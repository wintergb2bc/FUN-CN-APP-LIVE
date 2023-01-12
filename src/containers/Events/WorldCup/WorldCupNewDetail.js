import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform
} from "react-native";
import HTMLView from "react-native-htmlview";
import Touch from "react-native-touch-once";
// react-native-video的controls不支持android，因此在這用react-native-video-controls
import VideoPlayer from 'react-native-video-controls';
import { getDetail } from "./Common/utils"
import Share from "react-native-share";
import { Toast } from "antd-mobile-rn";
import NewBox from "./Common/NewBox";
import PiwikAction from "../../../lib/utils/piwik";
import AutoHeightImage from 'react-native-auto-height-image';
import RenderHtml from 'react-native-render-html';

const { width } = Dimensions.get("window");

// 延伸閱讀顯示筆數
const relatedNewsLimit = 6;

class WorldCupNewDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      relatedNews: [],
      limit: relatedNewsLimit,
      videoShow: "",
      siteUrl: window.SBTDomain + '/cn/mobile/sbtwo',
    };
    this.videoPlayer = React.createRef();
  }

  componentDidMount() {
    const { data } = this.props;
    this.setDetail();
    this.getRelated();
  }

  componentWillUnmount() {
  }

  setDetail() {
    const { data } = this.props;
    this.setState({
      detail: data,
    });
  }

  getRelated() {
    const { newsId } = this.props;
    fetch(`${window.WorldCup_Domain + ApiPort.worldCupNews}/${newsId}/related_number`, {
      method: "GET",
      headers: {
        token: window.CMS_token,
      },
    })
      .then(response => response.json())
      .then((res) => {
        if (res.data) {
          this.setState({
            relatedNews: res.data.relatedNews || []
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onLoadMore() {
    this.setState({
      limit: this.state.limit + relatedNewsLimit
    });
  }

  openVideo = (url) => {
    this.setState({
      videoShow: url
    })
  }

  copyShareUrl() {
    const shareUrl = this.getShareUrl();
    PiwikAction.SendPiwik("Share_News_WCPage2022");
    if (!Share) {
      Toast.fail("分享失败，请重试");
      return;
    }
    const shareOptions = {
      title: "分享给大家",
      url: shareUrl,
      failOnCancel: false,
    };
    return Share.open(shareOptions);
  }

  newsListUI = () => {
    const { relatedNews } = this.state;
    if(relatedNews.length === 0) {
      return null;
    }
    let isLast = false;
    return (
      <>
        {relatedNews.length > 0 && relatedNews.slice(0, this.state.limit).map((v, index) => {
          isLast = relatedNews.length === index + 1;
          return (
            <NewBox key={index} v={v} isLast={isLast} />
          );
        })}

        {!isLast && relatedNews.length > relatedNewsLimit && (
          <Touch
            onPress={() => this.onLoadMore()}
            style={{
              height: 30,
              width: "100%",
              backgroundColor: "#FFE05C",
              borderRadius: 25,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 8
            }}
          >
            <Text style={{ color: "#000000", fontSize: 16, fontWeight: "bold" }}>载入更多</Text>
          </Touch>
        )}
      </>
    );
  }

  //獲取分享鏈接
  getShareUrl = () => {
    const { newsId } = this.props;
    return this.state.siteUrl
      + `/share/?type=wcp&deeplink=news&nid=${newsId}`;
  }

  renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.name == 'img') {
      const a = node.attribs;
      return ( <AutoHeightImage
        resizeMode="stretch"
        width={width- 40} source={{uri: a.src}}/> );
    }
  }
  
  render() {
    const { detail, relatedNews, videoShow } = this.state;
    return (
      <ImageBackground
        source={require('../../../images/worldCup/BG_1.png')}
        resizeMode='stretch'
        style={{ flex: 1, backgroundColor: "#00327C" }}>

        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          {videoShow === "" ? (
            <View>
              <Image style={{ width: "100%", height: width * 0.427 }}
                     source={{ uri: detail.thumbnail }}
                     defaultSource={require("../../../images/loadIcon/loadingdark.jpg")}/>

              {!!(detail.video) && (
                <Touch
                  onPress={() => this.openVideo(detail.video)}
                  style={{
                    backgroundColor: "rgba(0, 0, 0,0.3)", position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 100,
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Image style={{ width: 36, height: 36 }} source={require('../../../images/worldCup/Btn_Play.png')}/>
                </Touch>
              )}
            </View>
          ) : (
            <VideoPlayer
              source={{ uri: detail.video }}
              navigator={this.props.navigator}
              toggleResizeModeOnFullscreen={false}
              onEnterFullscreen={()=>{console.log('test')}}
              onExitFullscreen={()=>{console.log('test 2')}}
              disableFullscreen={true}
              disableBack={true}
              style={{ width: "100%", height: width * 0.427 }}
            />
          )}
          <View style={{ paddingHorizontal: 20, backgroundColor: "transparent" }}>
            <Text style={{
              color: "#fff",
              fontSize: 15,
              lineHeight: 22,
              marginTop: 10,
              marginBottom: 12,
              fontWeight: "bold",
            }}>
              {detail.title}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: "#9E9E9E", fontSize: 10 }}>{detail.updatedDate}</Text>
              <TouchableOpacity
                onPress={() => {
                  this.copyShareUrl();
                }}
              >
                <Image style={{ width: 30, height: 18 }}
                       source={require('../../../images/worldCup/Btn_Share.png')}/>
              </TouchableOpacity>
            </View>
            {Platform.OS === "ios" ? (
              <HTMLView
                value={`<div>${detail.body}</div>`}
                style={{ width: "100%", marginTop: 32 }}
                stylesheet={styleHtmls}
                renderNode={this.renderNode}
              />
            ) : (
                <RenderHtml
                  contentWidth={width-40}
                  baseFontStyle={{ color: "#fff", lineHeight: 22 }}
                  source={{ html: detail.body }}
                />
              )}
            

            <View style={{ height: 1, backgroundColor: "#0B3E85", width: "100%", marginTop: 19, marginBottom: 10 }}/>
            <Text style={{ color: "#fff", fontWeight: "bold", marginBottom: 10 }}>延伸阅读</Text>

            {this.newsListUI()}
          </View>
        </ScrollView>

      </ImageBackground>
    );
  }
}

export default WorldCupNewDetail;

const styleHtmls = StyleSheet.create({
  div: {
    fontSize: 12,
    lineHeight: 22,
    color: "#FFFFFF"
  },
});
