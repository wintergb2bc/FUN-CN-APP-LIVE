import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  ImageBackground,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
import NavigationUtil from "../../lib/utils/NavigationUtil";

const { width, height } = Dimensions.get("window");
const HomeCarousel = [
  {
    img: require("./../../images/home/homeModalCarousel/newHomeModalCarousel1.jpg"),
    text: "Tự Hào Là Nhà Cái Hàng Đầu Châu Á Và Là Đối Tác Chính Thức Của Tottenham Hotspurs, Newcastle",
    infor: "Bỏ Qua",
  },
  {
    img: require("./../../images/home/homeModalCarousel/newHomeModalCarousel2.jpg"),
    text: "Trải Nghiệm Giải Trí Đỉnh Cao Với Sản Phẩm Đa Dạng, Gửi Tiền Và Rút Tiền Nhanh Chóng, Dễ Dàng.",
    infor: "Bỏ Qua",
  },
  {
    img: require("./../../images/home/homeModalCarousel/homeModalCarousel3.jpg"),
    text: "Tận Hưởng Khuyến Mãi Hấp Dẫn. Thưởng Đăng Ký, Hoàn Trả Không Giới Hạn Mỗi Ngày Đang Chờ Bạn!",
    infor: "Bỏ Qua",
  },
  {
    img: require("./../../images/home/homeModalCarousel/homeModalCarousel4.jpg"),
    text: "Tận Hưởng Khuyến Mãi Hấp Dẫn. Thưởng Đăng Ký, Hoàn Trả Không Giới Hạn Mỗi Ngày Đang Chờ Bạn!",
    infor: "Bỏ Qua",
  },
];
export default class HomeModalCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homeCarouselIndex: 0,
    };
  }

  closeHomeModal() {
    this.props.closeHomeModal();
  }

  renderHomeCarouse(item) {
    return (
      <ImageBackground
        key={item.index}
        source={item.item.img}
        resizeMode="cover"
        resizeMethod="resize"
        style={styles.homeCarouselImg}
      >
        {item.index === 3 && (
          <View style={styles.homeModalBottom}>
            <Touch
              onPress={() => {
                this.props.closeHomeModal();
              }}
              style={[
                styles.carouselBtn,
                {
                  marginBottom: 16,
                  backgroundColor: "#00A6FF",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text style={{ color: "#fff" }}>登入</Text>
            </Touch>
            <Touch
             onPress={() => {
                this.props.closeHomeModal();
                NavigationUtil.goToRegister();
              }}
              style={[
                styles.carouselBtn,
                {
                  marginBottom: 16,
                  backgroundColor: "#0CCC3C",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text style={{ color: "#fff" }}>立即开户​</Text>
            </Touch>
          </View>
        )}
      </ImageBackground>
    );
  }

  render() {
    const { homeCarouselIndex } = this.state;
    return (
      <Modal
        animationType="fade"
        visible={true}
        transparent={false}
        style={{ width, height }}
      >
        <Carousel
          data={HomeCarousel}
          renderItem={this.renderHomeCarouse.bind(this)}
          sliderWidth={width}
          itemWidth={width}
          // scrollEndDragDebounceValue={homeCarouselIndex}
          // initialNumToRender={homeCarouselIndex}
          // activeSlideOffset={homeCarouselIndex}
          // 關閉轉場動畫
          inactiveSlideScale={1}
          initialScrollIndex={homeCarouselIndex}
          firstItem={homeCarouselIndex}
          onSnapToItem={(homeCarouselIndex) => {
            this.setState({ homeCarouselIndex });
          }}
          onBeforeSnapToItem={(homeCarouselIndex) => {
            this.setState({ homeCarouselIndex });
          }}
        />
        <Pagination
          dotsLength={HomeCarousel.length}
          activeDotIndex={homeCarouselIndex}
          containerStyle={styles.homePaginationContainer}
          dotStyle={styles.homePaginationDot}
          inactiveDotStyle={styles.homePaginationInactiveDot}
          dotContainerStyle={{ marginHorizontal: 3 }}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
        />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  homeCarouselImg: {
    width,
    height,
  },
  homePaginationContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: '1%',
  },
  homePaginationDot: {
    width: 16,
    height: 6,
    borderRadius: 1000,
    backgroundColor: "#00A6FF",
  },
  homePaginationInactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 1000,
    backgroundColor: "#5C5C5C",
  },
  carouselBtn: {
    width: "90%",
    height: 40,
    borderRadius: 8,
  },
  homeModalBottom: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    right: 0,
    bottom: '7%',
  },
});
