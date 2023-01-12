import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import NavigationUtil from "../../lib/utils/NavigationUtil";
const { width, height } = Dimensions.get("window");
import Timer from "./Timer";

export default class HomeModalCarousel2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homeCarouselIndex: 0,
      startCountDown: false,
      img: require("./../../images/home/homeModalCarousel/newHomeModalCarousel1.jpg"),
    };
  }

  changeImg = () => {
    this.setState({
      img: require("./../../images/home/homeModalCarousel2/homeModalCarousel2.jpg"),
    });
  };

  closeHomeModal() {
    this.props.closeHomeModal();
  }

  render() {
    const { img, startCountDown } = this.state;
    return (
      <Modal
        animationType="fade"
        visible={true}
        transparent={true}
        onRequestClose={() => {}}
      >
        <View style={styles.viewContainer}>
          <Image
            resizeMethod="resize"
            resizeMode="cover"
            source={img}
            defaultSource={img}
            onLoadEnd={() => {
              this.setState({
                startCountDown: true,
              });
            }}
            style={{ width: width, height: height }}
          />

          {startCountDown && (
            <TouchableOpacity
              onPress={() => {
                this.closeHomeModal();
              }}
              style={styles.skipWrap}
            >
              <Timer
                initial="4"
                changeImg={this.changeImg}
                close={() => this.closeHomeModal()}
              />
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    width,
    height,
    backgroundColor: "#000",
  },
  skipWrap: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    position: "absolute",
    top: '5%',
    right: 20,
    width: 76,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
});
