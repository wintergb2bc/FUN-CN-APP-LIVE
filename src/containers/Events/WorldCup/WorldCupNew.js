import React from 'react';
import { Dimensions, Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Touch from "react-native-touch-once";
import { Toast } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import SnapCarousel, { ParallaxImage } from "react-native-snap-carousel";
import LinearGradient from "react-native-linear-gradient";
import NewBox from "./Common/NewBox";

const { width } = Dimensions.get("window");

const bannerHeight = 0.99 * (width);
const bannerWrapperHeight = 1.12 * width;

// 延伸閱讀顯示筆數
const NewsLimit = 6;

class WorldCupNew extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      news: this.props.news,
      newsSticky: this.props.newsSticky,
      limit: NewsLimit,
    };
  }

  componentDidMount() {

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
        ;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getDetail(item) {
    console.log('item ',item)
    Toast.loading("加载中,请稍候...", 200);
    fetch(`${window.WorldCup_Domain + ApiPort.worldCupNews}/${item.id}`, {
      method: "GET",
      headers: {
        token: window.CMS_token,
      },
    })
      .then(response => response.json())
      .then((res) => {
        const { data } = res;
        if (!!data) {
          Actions.WorldCupNewDetail({ newsId: item.id, data: data });
        } else {
          console.log("無資料");
        }

      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        Toast.hide();
      });
  }

  onLoadMore() {
    this.setState({
      limit: this.state.limit + NewsLimit
    });
  }

  openVideo = (url) => {
    this.setState({
      videoShow: url
    })
  }

  _renderNewBannerItem = ({ item, index }, parallaxProps) => {
    // console.log('home_main_banner', item, index)
    if (!item.thumbnail) {
      return null;
    }
    return (
      <View style={{ position: "relative" }}>
        <Touch
          key={index}
          onPress={() => this.getDetail(item)}
          style={styles.carouselItem2}
        >
          <ParallaxImage
            source={{ uri: item.thumbnail }}
            containerStyle={styles.carouselImageContainer}
            style={styles.carouselImage}
            parallaxFactor={0}
            {...parallaxProps}
          />
          <LinearGradient
            colors={[
              "transparent",
              "rgba(0, 0, 0, 0.4)",
              "rgba(0, 0, 0, 0.4)",
            ]}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              bottom: 0,
              position: "absolute",
              width: width - 60,
              height: 50,
              // backgroundColor: "rgba(0, 0, 0,0.2)",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              zIndex: 99999,
              paddingHorizontal: 20
            }}
          >
            <Text style={{
              color: "#fff",
              fontSize: 12,
              fontWeight: "bold",
              zIndex: 99,
              // textAlign: "left",
              // alignItems: "center"
            }}>{item.title}</Text>
          </LinearGradient>
        </Touch>
        {!!(item.video) && (
          <View
            style={{
              position: "absolute",
              top: 16,
              left: 20,
              zIndex: 100,
              width: 24,
              height: 24,
              backgroundColor: "rgba(0, 0, 0,0.5)",
              borderRadius: 24 / 2,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image style={{ width: 16, height: 16 }} source={require('../../../images/worldCup/Icon-Video.png')}/>
          </View>
        )}
      </View>
    );
  };
  
  newsListUI = () => {
    const { news } = this.state;
    if(news.length === 0) {
      return null;
    }
    let isLast = false;
    return (
      <View style={{ marginTop: 18, paddingHorizontal: 20 }}>
        {news.length > 0 && news.slice(0, this.state.limit).map((v, index) => {
          isLast = news.length === index + 1;
          return (
            <NewBox key={index} v={v} isLast={isLast} />
          );
        })}

        {!isLast && news.length > NewsLimit && (
          <Touch
            style={{
              height: 30,
              width: "95%",
              backgroundColor: "#FFE05C",
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 8,
              alignSelf: "center"
            }}
            onPress={() => this.onLoadMore()}
          >
            <Text style={{ color: "#000000", fontSize: 12 }}>载入更多</Text>
          </Touch>
        )}
      </View>
    );
  }


  render() {
    const { newsSticky, news } = this.state;
    console.log(this.state)
    return (
      <ImageBackground
        source={require('../../../images/worldCup/BG_1.png')}
        resizeMode='stretch'
        style={{ flex: 1, paddingTop: 16 }}>

        <ScrollView style={{
          marginBottom: 50
        }}>
          <SnapCarousel
            ref={(c) => {
              this._snapcarousel = c;
            }}
            data={newsSticky}
            renderItem={this._renderNewBannerItem}
            onSnapToItem={(index) => this.setState({ activeSlide: index })}
            sliderWidth={width}
            // sliderHeight={0.52 * (width - 60)}
            itemWidth={width - 60}
            hasParallaxImages={true}
            firstItem={0}
            loop={true}
            autoplay={true}
          />

          <Text style={{
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: "bold",
            marginLeft: 20,
            marginTop: 20
          }}>为您推荐</Text>

          {this.newsListUI()}
        </ScrollView>

      </ImageBackground>
    );
  }
}

export default WorldCupNew;

const styles = StyleSheet.create({
  bannerWrapper: {
    width: width,
    // height: bannerWrapperHeight,
    paddingBottom: 17,
  },
  bannerWrapper2: {
    width: width,
    // height: bannerWrapperHeight,
    paddingBottom: 17,
  },
  carouselItem: {
    width: width - 60,
    height: bannerHeight,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 15
  },
  carouselItem2: {
    width: width - 60,
    height: 0.498 * (width - 60),
    borderRadius: 10,
    position: "relative",
    overflow: 'hidden'
  },
  carouselImageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    // backgroundColor: " white",
    borderRadius: 10,
  },
  carouselImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "stretch",
    width: width - 60,
    height: 0.498 * (width - 60),
    borderRadius: 10,
  },
  paginationStyle: {
    position: "absolute",
    left: 0,
    bottom: -4,
    width: width,
    // paddingVertical: 25,
    // height:30,
    // backgroundColor: 'rgba(0, 0, 0, 0.75)',
    // backgroundColor: 'rgba(255, 255, 255, 0.92)'
  },
  paginationdotStyle: {
    width: 16,
    height: 4,
    backgroundColor: "#FFE786",
    marginHorizontal: -5,
    top: 15,
  },
  paginationdotStyle2: {
    width: 4,
    height: 4,
    borderRadius: 1000,
    backgroundColor: "#B8B8B8",
    top: 15,
  },
  diamond: {
    width: 10,
    height: 10,
    backgroundColor: "#FFE786",
    transform: [{ rotate: "45deg" }],
  },
  diamond2: {
    width: 7,
    height: 7,
    backgroundColor: "#FFE786",
    transform: [{ rotate: "45deg" }],
  },
  modalMaster: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0,0.5)',
  },
  modalView: {
    width: width * 0.95,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingBottom: 15,
  },
  modalTitle: {
    width: width * 0.95,
    backgroundColor: '#00A6FF',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  modalTitleTxt: {
    lineHeight: 44,
    textAlign: 'center',
    color: '#fff',
  },
  modalBtn: {
    width: width * 0.95,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalBtnL: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00A6FF',
    width: width * 0.4,
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnR: {
    borderRadius: 5,
    backgroundColor: '#00A6FF',
    width: width * 0.4,
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxFlex: {
    display: "flex",
    // justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: '50%',
    marginBottom: 20
  },
});


const styleHtmls = StyleSheet.create({
  div: {
    fontSize: 12,
    lineHeight: 22,
    color: "#FFFFFF"
  },
});
