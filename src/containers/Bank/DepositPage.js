import React from "react";
import {
  StyleSheet,
  WebView,
  Text,
  View,
  CameraRoll,
  Animated,
  TouchableOpacity,
  PermissionsAndroid,
  Dimensions,
  Platform,
  Image,
  BackHandler,
  Linking
} from "react-native";
import { Actions } from "react-native-router-flux";
import {
  Carousel,
  WhiteSpace,
  WingBlank,
  Modal,
  Flex,
  Toast,
  ActivityIndicator,
  Picker,
  List,
} from "antd-mobile-rn";
import { captureScreen } from "react-native-view-shot";
import Touch from "react-native-touch-once";
import WebViewIOS from "react-native-webview";
const { width, height } = Dimensions.get("window");
import WebViewAndroid from "react-native-webview-android";

class DepositPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadD: false,
      loadone: 1,
      payHtml: this.props.data ? this.props.data.redirectUrl : "",
      activeName: this.props.activeName,
      visible: false,
    };
    console.log(this.props);
    console.log(this.state);
  }

  componentWillMount(props) {
    this.props.navigation.setParams({
      title: this.props.activeName || "存款",
    });
  }

  componentDidMount() {
    // this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.props.activeCode == "PPB" &&
      this.setState({ visible: true }, () =>
        console.log("visible", this.state.visible)
      );
  }

  componentWillUnmount() {
    if (this.props.froms == "promotions") {
      window.goHome && window.goHome();
      window.bonusState &&
        Actions.PromotionsBank({
          BonusData: this.props.BonusData,
          data: this.props.data,
          froms: "DepositCenter",
        });
    }
    //虚拟币充值跳转
    // if (this.props.activeCode && this.props.activeCode == 'CTC') {
    // 	let transactionId = this.props.data && this.props.data.transactionId || ''
    // 	Actions.CTCpage({transactionId, activeName: this.state.activeName})
    // }

    // 成功頁
    Actions.DepositCenterPage({
      activeCode: this.props.activeCode,
      data: this.props.data,
      activeName: this.props.activeName,
      previousPage: "",
      froms: this.props.froms,
      BonusData: this.props.BonusData,
      checkcallbackDate: this.props.checkcallbackDate,
    });
  }

  SaveQrCode(uri) {
    let promise = CameraRoll.saveToCameraRoll(uri);
    promise
      .then(function (result) {
        Toast.success("保存成功！");
      })
      .catch(function (error) {
        Toast.fail("保存失败,无访问照片权限!");
      });
  }

  _onNavigationStateChange = (e) => {
    if (e.url && this.props.activeCode == 'QQ') {
      if (e.url.indexOf('https') == 0 || e.url.indexOf('http') == 0) {
        Linking.openURL(e.url);
        Actions.pop()
        return false
      }
    }
  }

  render() {
    const js = `$('#btnClose').remove()`;
    const { payHtml, loadD, loadone, activeName } = this.state;
    let testUrl = payHtml.split(":");
    let urlHtml = false;
    if (testUrl[0] != "https" && testUrl[0] != "http") {
      urlHtml = false;
    } else {
      urlHtml = true;
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {Platform.OS == "ios" ? (
            <WebViewIOS
              onLoadStart={(e) => this.setState({ loadD: true })}
              onLoadEnd={(e) => this.setState({ loadD: false, loadone: 2 })}
              source={urlHtml == false ? { html: payHtml } : { uri: payHtml }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={Platform.OS === "ios" ? false : true}
              onNavigationStateChange={this._onNavigationStateChange}
              style={{
                width: width,
                height: height - Platform.OS === "ios" ? 175 : 115,
              }}
            />
          ) : (
            Platform.OS == "android" &&
            (this.props.activeCode == "CTC" || this.props.activeCode == "QQ" ? (
              <WebViewAndroid
                onLoadStart={(e) => this.setState({ loadD: true })}
                onLoadEnd={(e) => this.setState({ loadD: false, loadone: 2 })}
                source={urlHtml == false ? { html: payHtml } : { uri: payHtml }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scalesPageToFit={Platform.OS === "ios" ? false : true}
                onNavigationStateChange={this._onNavigationStateChange}
                style={{
                  width: width,
                  height: height - 115,
                }}
              />
            ) : (
              <WebView
                onLoadStart={(e) => this.setState({ loadD: true })}
                onLoadEnd={(e) => this.setState({ loadD: false, loadone: 2 })}
                source={urlHtml == false ? { html: payHtml } : { uri: payHtml }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scalesPageToFit={Platform.OS === "ios" ? false : true}
                style={{
                  width: width,
                  height: height - Platform.OS === "ios" ? 175 : 115,
                }}
              />
            ))
          )}

          {loadone == 1 && loadD == true && (
            <Flex
              style={{
                height: height,
                width: width,
                backgroundColor: "#202020",
              }}
            >
              <Flex.Item>
                <ActivityIndicator size="large" color="#fff" />
              </Flex.Item>
            </Flex>
          )}
        </View>
      </View>
    );
  }
}

export default DepositPage;

const styles = StyleSheet.create({
  closeButton: {
    top: Platform.OS === "ios" ? 45 : 15,
    left: 20,
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingTop: Platform.OS === "ios" ? 8 : 5,
    borderColor: "#d3d3d3",
    textAlign: "center",
  },
  SaveButton: {
    top: Platform.OS === "ios" ? 45 : 15,
    left: 0,
    fontSize: 18,
    fontWeight: "900",
    color: "#00623b",
    borderRadius: 6,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: "#fafafa",
    textAlign: "center",
  },
});
