/*
	賽事分享，app因為有Toast會被Modal蓋住的問題，所以不使用Modal，改成用action跳scene的機制，也比較方便，不用處理state
*/
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  Clipboard,
  CameraRoll,
  Alert,
  SafeAreaView,
  PermissionsAndroid,
} from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import ImageForTeam from "../RNImage/ImageForTeam";
import QRCodeA from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import {Toast} from "antd-mobile-rn";
import { timeout_fetch } from "../../lib/SportRequest";

const { width, height } = Dimensions.get("window");

//從react-native-safe-area抄來的代碼，處理iphone下巴問題
const thisIsIPhoneX = (() => {
  const X_WIDTH = 375;
  const X_HEIGHT = 812;
  const XSMAX_WIDTH = 414;
  const XSMAX_HEIGHT = 896;
  const PAD_WIDTH = 768;
  const PAD_HEIGHT = 1024;

  const IPHONE12_H = 844;
  const IPHONE12_Max = 926;
  const IPHONE12_Mini = 780;

  const IPHONE13_H = 844;
  const IPHONE13_Max = 926;
  const IPHONE13_Mini = 780;

  const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

  return (
    Platform.OS === 'ios' &&
    ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
      (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT)) ||
    ((D_HEIGHT === XSMAX_HEIGHT && D_WIDTH === XSMAX_WIDTH) ||
      (D_HEIGHT === XSMAX_WIDTH && D_WIDTH === XSMAX_HEIGHT)) ||
    (D_HEIGHT === IPHONE12_H) || (D_HEIGHT === IPHONE12_Max) || (D_HEIGHT === IPHONE12_Mini) ||
    (D_HEIGHT === IPHONE13_H) || (D_HEIGHT === IPHONE13_Max) || (D_HEIGHT === IPHONE13_Mini)
  );
})();

class SbShare extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      siteUrl: window.SBTDomain + '/cn/mobile/sbtwo',
    };

    this.ViewShotRef = React.createRef();
    this.isIPhoneX = false;


  }

  componentDidMount () {
    this.getSiteUrl();
  }

  //從配置文件獲取分享按鈕的固定域名
  getSiteUrl = () =>  {
    return timeout_fetch(
      fetch("https://www.zdhrb62.com/CMSFiles/F1APP/FUNSBRedirect.json?v=" + Math.random(), {method: "GET"})
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if(data.sbtwo){
            this.setState({siteUrl: data.sbtwo})
          }
        }),5000)
      .catch(error => {
        // 错误处理
      });
  }

  //關閉分享彈窗
  hideSharePopup = () => {
    Actions.pop();
  }

  //獲取分享鏈接
  getShareUrl = (Vendor, EventData) => {
    return this.state.siteUrl
      + `/share/?deeplink=${Vendor.configs.VendorName.toLowerCase()}&sid=${EventData.SportId}&eid=${EventData.EventId}&lid=${EventData.LeagueId}`;
  }

  //複製分享鏈接
  copyShareUrl = (shareUrl) => {
    const value = String(shareUrl);
    Clipboard.setString(value);
    Toasts.success('链接已复制');
  }

  //下載分享圖片
  downloadShareImage = async () => {

    const saveImage = (uri) => {
      Toast.loading('请稍候...',0);
      CameraRoll.saveToCameraRoll(uri)
        .then((result) => {
          Toast.hide();
          Toasts.success("图片已下载", 2);
        })
        .catch((error) => {
          Toast.hide();
          let errorMsg =
            Platform.OS == "ios"
              ? "请在iPhone的“设置-隐私-照片” 中允许访问照片"
              : "请在Android的“设置 - 应用管理 - 同乐城 - 应用权限”中允许 访问相机";
          Alert.alert("二维码保存失败", errorMsg);
          console.log(error);
        });
    };

    if (Platform.OS == "android") {
      try {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        await PermissionsAndroid.request(permission);
        Promise.resolve();

        setTimeout(() => {
          this.ViewShotRef.current.capture().then(
            (uri) => saveImage(uri),
            (error) => Toasts.fail(error)
          );
        }, 1000);
      } catch (error) {
        Promise.reject(error);
      }
    } else {
      this.ViewShotRef.current.capture().then(
        (uri) => saveImage(uri),
        (error) => Toasts.fail(error)
      );
    }
  }

  render () {
    const { Vendor , EventDetail } = this.props;

    const shareUrl = this.getShareUrl(Vendor,EventDetail);

    return <SafeAreaView style={styles.GameDetailSharePopup}>
        <View style={styles.GameDetailSharePopupTopBox}>
          <ViewShot ref={this.ViewShotRef} options={{ fileName: `${EventDetail.LeagueName}-${EventDetail.HomeTeamName}-${EventDetail.AwayTeamName}.png`, format: "png" }} style={styles.GameDetailSharePopupShareBox}>
            <ImageBackground
              style={styles.GameDetailSharePopupShareBoxTop}
              resizeMode="cover"
              imageStyle={{	borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
              source={require("../../images/sbshare/shareBg.png")}
            >
              <View style={styles.GameDetailSharePopupShareBoxTopTeamBox}>
                <ImageForTeam Vendor={Vendor} TeamId={EventDetail.HomeTeamId} IconUrl={EventDetail.HomeIconUrl} imgSize={40}/>
                <Text style={styles.ShareTeamName}>{EventDetail.HomeTeamName}</Text>
              </View>
              <View style={styles.GameDetailSharePopupShareBoxTopLeagueBox}>
                <Text style={styles.ShareLeagueName}>{EventDetail.LeagueName}</Text>
                <Text style={styles.ShareVS}>VS</Text>
              </View>
              <View style={styles.GameDetailSharePopupShareBoxTopTeamBox}>
                <ImageForTeam Vendor={Vendor} TeamId={EventDetail.AwayTeamId} IconUrl={EventDetail.AwayIconUrl} imgSize={40}/>
                <Text style={styles.ShareTeamName}>{EventDetail.AwayTeamName}</Text>
              </View>
            </ImageBackground>
            <View style={styles.GameDetailSharePopupShareBoxBottom}>
              <View style={styles.GameDetailSharePopupShareBoxBottomLeft}>
                <Text style={styles.ShareLeagueName2}>{EventDetail.LeagueName}</Text>
                <Text style={styles.ShareVS2}>{EventDetail.HomeTeamName}&nbsp;vs&nbsp;{EventDetail.AwayTeamName}</Text>
              </View>
              <View style={styles.GameDetailSharePopupShareBoxBottomRight}>
                <QRCodeA
                  value={shareUrl}
                  size={75}
                  bgColor="#FFF"
                />
              </View>
            </View>
          </ViewShot>
        </View>
        <View style={styles.GameDetailSharePopupBottomBox}>
          <View style={styles.GameDetailSharePopupBottomBoxTop}>
            <Touch
              style={styles.ShareButtonBox}
              onPress={() => {
                this.copyShareUrl(shareUrl);
              }}
            >
              <View style={styles.ShareButton}>
                <Image resizeMode='stretch' source={require('../../images/sbshare/shareCopy.png')} style={{ width: 22, height: 22 }} />
              </View>
              <Text style={styles.ShareText}>复制链接</Text>
            </Touch>
            <Touch
              style={styles.ShareButtonBox}
              onPress={() => {
                this.downloadShareImage(EventDetail);
              }}
            >
              <View style={styles.ShareButton}>
                <Image resizeMode='stretch' source={require('../../images/sbshare/shareDownload.png')} style={{ width: 22, height: 22 }} />
              </View>
              <Text style={styles.ShareText}>下载图片</Text>
            </Touch>
          </View>
          <View style={styles.GameDetailSharePopupBottomBoxBottom}>
            <Touch

              onPress={this.hideSharePopup}
            >
              <Text style={styles.ShareCancelText}>取消</Text>
            </Touch>
            <View style={styles.ShareCancelBar}/>
          </View>
        </View>
      </SafeAreaView>
  }
}

export default SbShare;

const styles = StyleSheet.create({
  GameDetailSharePopup: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: width,
    height: thisIsIPhoneX ? height+34 : height, //處理iphone下巴問題
  },
  GameDetailSharePopupTopBox: {
    flex: 1,
    width: width,
    height: 'auto',
    backgroundColor: '#8a8a8a',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  GameDetailSharePopupShareBox: {
    width: 343,
    height: 230,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  GameDetailSharePopupShareBoxTop: {
    width: 343,
    height: 118,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 25,
    paddingHorizontal: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  GameDetailSharePopupShareBoxTopTeamBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  // ShareTeamImage: {
  // 	height: 40,
  // },
  ShareTeamName: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 17,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  GameDetailSharePopupShareBoxTopLeagueBox: {
    flex: 1.5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
  },
  ShareLeagueName: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 17,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  ShareVS: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 22,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  GameDetailSharePopupShareBoxBottom: {
    width: 343,
    height: 112,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  GameDetailSharePopupShareBoxBottomLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    paddingRight: 8,
  },
  ShareLeagueName2: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    lineHeight: 22,
  },
  ShareVS2: {
    marginTop: 8,
    fontSize: 12,
    color: '#666666',
    lineHeight: 17,
  },
  GameDetailSharePopupShareBoxBottomRight: {
    width: 80,
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  GameDetailSharePopupBottomBox: {
    width: width,
    height: 208,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  GameDetailSharePopupBottomBoxTop: {
    width: width,
    height: 118,
    backgroundColor: '#EFEFF4',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ShareButtonBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 24,
  },
  ShareButton: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // svg: {
    // 	width: 24,
    // 	height: 24,
    // }
  },
  ShareText: {
    fontSize: 12,
    color: '#222222',
    lineHeight: 22,
  },
  GameDetailSharePopupBottomBoxBottom: {
    width: width,
    height: 90,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ShareCancelText: {
    marginTop: 24,
    marginBottom: 31,
    fontSize: 16,
    color: '#00A6FF',
    lineHeight: 22,
  },
  ShareCancelBar: {
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: Platform.OS === 'ios' ? '#00000000' : '#000000', //處理iphone下巴問題
  },
});
