import React from "react";
import {
  Dimensions,
  Image as NativeImage,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView,
  ActivityIndicator
} from "react-native";
import AutoHeightImage from 'react-native-auto-height-image';
import { Toast } from "antd-mobile-rn";

const { width, height } = Dimensions.get("window");

const patchPostMessageFunction = function () {
  var originalPostMessage = window.postMessage;

  var patchedPostMessage = function (message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };

  patchedPostMessage.toString = function () {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  };

  window.postMessage = patchedPostMessage;
  var sponsorBtn = document.querySelector('.sponsorBtn')
  sponsorBtn.onclick = function (event) {
    window.postMessage(this.href);
    event.preventDefault();
  }
};
const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

const htmls = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge "><meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no"><title>Document</title></head><body>`;
const viewStyle = `
<style>
body {
    margin: 0;
	  width: 100%;
}
.container{
 position: relative;
}
.sponsorBtn {
    width: 190px;
    position: absolute;
    bottom: 50px;
    left: 0; 
    right: 0; 
    margin-left: auto; 
    margin-right: auto; 
}
.sponsorBtn img{
 width: 100%;
}
</style>
`;

class Sponsor extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 1,
      openWindowPopup: false,
      bannerData: [
        {
          cmsImageUrl: ""
        }
      ],
      bannerLoading: true,
      webViewLoading: true
    };
  }

  componentDidMount() {
    global.storage.load({
      key: 'CMSSponsorship',
      id: 'CMSSponsorship'
    }).then(data => {
      this.setState({
        bannerData: data,
      });
    }).catch(() => {
    });

    fetch(`${CMS_Domain + ApiPort.CMS_Sponsorship}`, {
      method: "GET",
      headers: {
        token: CMS_token,
      },
    })
      .then((response) => (headerData = response.json()))
      .then((data) => {
        // Toast.hide();
        if (data.length) {
          if (data[0].cmsImageUrl) {
            this.setState({
              bannerData: data,
            });
            global.storage.save({
              key: "CMSSponsorship",
              id: "CMSSponsorship",
              data: data,
              expires: null,
            });
          } else {
            this.setState({
              bannerData: [
                {
                  cmsImageUrl: "error"
                }
              ],
            });
          }
        }
      })
      .catch((error) => {
        // Toast.hide();
        this.setState({
          bannerData: [
            {
              cmsImageUrl: "error"
            }
          ],
        });
        console.log(error);
      });
  }

  videoButton = (hasImg = true) => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", marginTop: hasImg ? -110 : 40 }}>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              openWindowPopup: true
            });
          }}
        >
          <NativeImage
            resizeMode="stretch"
            source={require("../../images/user/moreVideo.png")}
            style={{ width: 172, height: 44 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  _onMessage = (e) => {
    this.setState({
      openWindowPopup: true
    });
  }

  hideSpinner() {
    this.setState({ webViewLoading: false });
  }

  hideSpinnerIOS() {
    this.setState({ bannerLoading: false });
  }

  // 圖片太大時 <Image />在android上會很模糊，因此android用WebView處理
  render() {
    const ViewComponent = Platform.OS === 'ios'
      ? ScrollView
      : View;
    return (
      <ViewComponent style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? 50 : 0, backgroundColor: "#fff" }}>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.openWindowPopup}
          onRequestClose={() => {
          }}
        >
          <View style={styles.modalMaster}>
            <View style={styles.modalView}>
              <View style={styles.modalTitle}>
                <Text style={[styles.modalTitleTxt, { fontWeight: 'bold', fontSize: 16 }]}>温馨提醒</Text>
              </View>
              <Text style={{ marginVertical: 24, textAlign: 'center', color: '#000' }}>将使用浏览器开启</Text>
              <View style={styles.modalBtn}>
                <TouchableOpacity onPress={() => {
                  this.setState({ openWindowPopup: false });
                }} style={styles.modalBtnL}>
                  <Text style={{ color: '#00A6FF', fontWeight: 'bold', fontSize: 16 }}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.setState({
                    openWindowPopup: false
                  }, () => {
                    Linking.openURL(
                      "https://m.youku.com/profile?callApp=1&showHeader=1&uid=UNDcxOTM4MzAw"
                    );
                  });
                }} style={styles.modalBtnR}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>确定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {Platform.OS === "ios" && this.state.bannerLoading && (
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator color="#00A6FF"/>
          </View>
        )}
        {Platform.OS === "android" && this.state.webViewLoading && (
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator color="#00A6FF"/>
          </View>
        )}
        {Platform.OS === "ios" ? (
          <View style={{ paddingBottom: 50 }}>
            <AutoHeightImage
              resizeMode="stretch"
              source={{ uri: this.state.bannerData[0].cmsImageUrl }}
              width={width}
              onLoadEnd={() => this.hideSpinnerIOS()}
            />
            {!!(this.state.bannerData[0].cmsImageUrl) && !this.state.bannerLoading && this.videoButton()}
          </View>
        ) : (
          <>
            <WebView
              originWhitelist={["*"]}
              source={{
                html: `${htmls}${viewStyle} 
                        <div class="container">
                        <img src=${this.state.bannerData[0].cmsImageUrl} style="width: 100%;" >
                        <div class="sponsorBtn"><img class="" src="https://www.fun282.com/cn/mobile/img/about/Sponsorship/CN_Button@2x.webp" alt="优酷"></div></div>
                        </body></html>`,
              }}
              onMessage={this._onMessage}
              injectedJavaScript={patchPostMessageJsCode}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scrollEnabled={false}
              scalesPageToFit={Platform.OS === 'ios' ? true : false}
              thirdPartyCookiesEnabled={true}
              style={{ height: height, width: width }}
              onLoadEnd={() => this.hideSpinner()}
            />
          </>
        )}
      </ViewComponent>
    );
  }
}

export default Sponsor;


const styles = StyleSheet.create({
  modalMaster: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0,0.5)',
  },
  modalView: {
    width: width * 0.85,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingBottom: 15,
  },
  modalTitle: {
    width: width * 0.85,
    backgroundColor: '#00A6FF',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  modalTitleTxt: {
    lineHeight: 40,
    textAlign: 'center',
    color: '#fff',
  },
  modalBtn: {
    width: width * 0.85,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalBtnL: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00A6FF',
    width: width * 0.35,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnR: {
    borderRadius: 5,
    backgroundColor: '#00A6FF',
    width: width * 0.35,
    height: 42,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
