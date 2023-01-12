import React from "react";
import { Dimensions, Image, Linking, ScrollView, StyleSheet, Text, View, } from "react-native";
import Touch from "react-native-touch-once";
import { Toast } from "antd-mobile-rn";
import { vendorPiwik } from "../Vendors/vendorPiwik";
import PropTypes from "prop-types";
import NavigationUtil from "../../lib/utils/NavigationUtil";
import actions from "../../lib/redux/actions/index";
import { connect } from "react-redux";
import PiwikAction from "../../lib/utils/piwik";
import { Actions } from "react-native-router-flux";
import { getAllVendorToken } from './../../containers/SbSports/lib/js/util';

// 樂體育有的，要跳彈窗
const sportsName = ["IPSB", "OWS", "SBT"];
const { width, height } = Dimensions.get("window");

// 游戏供应商介绍页面
class ProductIntro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // gameProviders
      gameItem: this.props.gameItem,
      // GameCategory
      category: this.props.category,
      gameAccordion: "",
      soprtGameLad: false,
      showLogPopup: false,
      sportOpenModal: false,
      openNewWindowModal: false,
      gameOpenUrl: "",
      gameProvidersDetails: []
    };
  }

  componentWillMount() {
    console.log("props gameItem", this.props.gameItem);
    console.log("propscategory", this.props.category);

    this.checkFP_GameProvider();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      title: this.props.category.title,
    });
    this.GameProvidersDetails()
  }

  checkFP_GameProvider = () => {
    if (this.props.gameItem) {
      return;
    }
    if (!this.props.category) {
      return;
    }
    const gameCatId = this.props.category.gameCatId
    // 沒帶的話，去抓緩存的，還是沒有 call api
    global.storage.load({
      key: `GameProviders${gameCatId}`,
      id: `GameProviders${gameCatId}`,
    })
      .then((data) => {
        this.setState({
          gameItem: data
        });
      })
      .catch((err) => {
        this.getCMS_GameProviders();
      });
  }

  getCMS_GameProviders = () => {
    const gameCatId = this.props.category.gameCatId;
    fetch(
      `${CMS_Domain + ApiPort.CMS_GameProviders}/${gameCatId}`,
      {
        method: "GET",
        headers: {
          token: CMS_token,
        },
      }
    )
      .then(response => response.json())
      .then((data) => {
        if (data && data.providers) {
          storage.save({
            key: `GameProviders${gameCatId}`, // 注意:请不要在key中使用_下划线符号!
            id: `GameProviders${gameCatId}`, // 注意:请不要在id中使用_下划线符号!
            data: data.providers,
          });
          this.setState({
            gameItem: data.providers,
          });
        }
      })
      .catch((error) => {
        //	Toast.hide();
        console.log(error);
      });
  }


  GameProvidersDetails = () => {

    const categoryCode = this.props.categoryCode;
    let fetchurl = `${ApiPort.GameProvidersDetails}gameType=${categoryCode}&`;
    global.storage
      .load({
        key: `Providers${categoryCode}`,
        id: `Providers${categoryCode}`,
      })
      .then((val) => {
        if (val) {
          this.setState({
            gameProvidersDetails: val,
          });
        }
      })
      .catch(() => {
        Toast.loading("加载中,请稍候...", 200);
      });
    fetchRequest(fetchurl, "GET").then((res) => {
      if (res.isSuccess && res.result) {
        this.setState({
          gameProvidersDetails: res.result,
        });
        Toast.hide();
        storage.save({
          key: `Providers${categoryCode}`,
          id: `Providers${categoryCode}`,
          data: res.result,
        });
      }
    });
  };

  gameplay(id) {
    fetch(CMS_Domain + ApiPort.CMS_Gamefaq + id + "?", {
      method: "GET",
      headers: {
        token: CMS_token,
      },
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({ gameAccordion: data });
      })
      .catch((error) => {
        //	Toast.hide();
        console.log(error);
      });
  }

  gamePiwik(item) {
    let code = item.providerCode;

    if (code == "BLE" && item.providerGameId != -1) {
      //同乐麻将大赛
      PiwikEvent("Bolemahjong_P2Ppage");
      return;
    } else if (code == "BLE") {
      PiwikEvent("Bole_P2Ppage");
      return;
    } else if (code == "OWS" && item.gameCatCode == "Esports") {
      //沙巴电竞
      PiwikEvent("OW_esportpage");
      return;
    }

    vendorPiwik(code);
  }

  errGame(key, providerCode) {
    if (key == "") {
      //首次加载较慢，第一次点击体育游戏不再拿api，第二次点击没有再去获取api
      Toast.loading("游戏加载中,请稍候... ", 2);
      setTimeout(() => {
        this.setState({ soprtGameLad: true });
      }, 6000);
      this.state.soprtGameLad &&
        window.ReloadGame &&
        window.ReloadGame(providerCode);

      window.openSportGame && window.openSportGame(true, providerCode);
      return;
    }
    if (key == "异常") {
      Toast.fail(
        "童鞋，由于您的账户存在异常，暂时无法为您提供服务。如有疑问，请联系在线客服。",
        2
      );
    } else if (key == "维护") {
      Toast.fail(
        "您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。",
        2
      );
    }

    setTimeout(() => {
      window.ReloadGame && window.ReloadGame(providerCode);
    }, 2000);
  }

  openDomin(url) {
    url != "" && Linking.openURL(url);
  }

  // 提醒登录 弹窗
  toggleLoginPopup(value) {
    this.setState({ showLogPopup: value });
  }

  goLogin() {
    // 登录/注册 按钮
    window.singBtnPress && window.singBtnPress("register");
  }

  gamesRender = () => {
    const { categoryCode } = this.props;
    switch (categoryCode) {
      case "Sportsbook":
        return this.sbRender();
      case "ESports":
        return this.esRender();
      case "KenoLottery":
        return this.esRender();
      // case "InstantGames":
      //   return this.esRender();
      default:
        break;
    }
  };

  openSBGame = (item, getGameObj) => {
    console.log('openSBGame')
    console.log(item)
    if (item.providerCode === "SB2") {
      //樂體育不用彈窗
      if (ApiPort.UserLogin) {
        // 自我限制檢查
        if (this.props.userSetting.selfExclusions.disableBetting) {
          this.props.selfExclusionsPopup(true);
          return;
        }
        if (ApiPort.UserLogin && isGameLock) {
          Toast.fail("您的账户已被锁，请联系在线客服。", 2);
          return;
        }
        //已登入 先獲取token後跳轉
        Toast.loading("加载中...");
        getAllVendorToken()
          .finally(() => {
            //不管成功或失敗都跳轉
            Toast.hide();
            Actions.SbSports({
              sbType: 'IPSB'
            });
          });
      } else {
        //未登入 直接跳轉
        Actions.SbSports({
          sbType: 'IPSB'
        });
      }

      return;
    }

    if (item.providerCode === "VTG") {
      PiwikAction.SendPiwik(`VTG_Game_ProductPage`);
      Actions.ProductGameDetail({
        code: item.providerCode,
        title: item.providerName,
        navTitle: "V2 虚拟体育",
        category: getGameObj,
        categoryGameCode: "Sportsbook",
      });
      return;
    }

    //vendor體育
    this.props.sportGamePopup(item.providerCode);
  }

  sbRender = () => {
    const { gameItem, gameProvidersDetails } = this.state;
    return <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {
          gameProvidersDetails.length > 0 &&
          gameProvidersDetails.map((item, i) => {
            const getGameObj = gameItem ?
              gameItem.filter(
                (v) =>
                  v.providerCode.toLocaleLowerCase() ===
                  item.providerCode.toLocaleLowerCase()
              )[0] : null;

            if (i === 0) {
              return (
                <Touch
                  style={{
                    marginBottom: 16,
                  }}
                  onPress={() => {
                    this.openSBGame(item, getGameObj);
                  }}
                >
                  {getGameObj && getGameObj.providerImageUrl ? (
                    <Image
                      resizeMethod="resize"
                      style={{
                        width: width - 40,
                        height: 0.382 * (width - 40),
                      }}
                      defaultSource={require("../../images/loadIcon/loadinglight.jpg")}
                      source={{
                        uri: getGameObj.providerImageUrl,
                      }}
                    />
                  ) : (
                    <Image
                      resizeMethod="resize"
                      style={{
                        width: width - 40,
                        height: 0.382 * (width - 40),
                      }}
                      defaultSource={require("../../images/loadIcon/loadinglight.jpg")}
                      source={require("../../images/loadIcon/loadinglight.jpg")}
                    />
                  )}
                </Touch>
              )
            } else {
              return (
                <Touch
                  key={i}
                  style={{
                    width: "48%",
                    height: 0.35 * width,
                    marginBottom: 16,
                  }}
                  onPress={() => {
                    this.openSBGame(item, getGameObj);
                  }}
                >
                  {getGameObj && getGameObj.providerImageUrl ? (
                    <Image
                      resizeMode="stretch"
                      style={[styles.gameImg, { width: "100%" }]}
                      defaultSource={require("../../images/loadIcon/loadinglight.jpg")}
                      source={{
                        uri: getGameObj.providerImageUrl,
                      }}
                    />
                  ) : (
                    <Image
                      resizeMode="stretch"
                      style={[styles.gameImg, { width: "100%" }]}
                      defaultSource={require("../../images/loadIcon/loadinglight.jpg")}
                      source={require("../../images/loadIcon/loadinglight.jpg")}
                    />
                  )}
                </Touch>
              )
            }

          })
        }
      </View>

    </View>
  };

  esRender = () => {
    const { gameItem, gameProvidersDetails, category } = this.state;
    console.log('gameItem,', gameItem)
    console.log('gameProvidersDetails,', gameProvidersDetails)
    return (
      gameProvidersDetails.length > 0 &&
      gameProvidersDetails.map((item, i) => {
        const getGameObj = gameItem ?
          gameItem.filter(
            (v) =>
              v.providerCode.toLocaleLowerCase() ===
              item.providerCode.toLocaleLowerCase()
          )[0] : null;
        return (
          <Touch
            key={i}
            style={{
              width: "100%",
              height: 0.39 * width,
              marginBottom: 16,
            }}
            onPress={() => {
              if (!ApiPort.UserLogin) {
                NavigationUtil.goToLogin();
                return;
              }
              console.log(category)
              const data = {
                provider: item.providerCode,
                gameId: null,
                category: category.gameCatCode
              };
              PiwikAction.SendPiwik(`${item.providerCode}_Game_ProductPage`);
              this.props.playGame(data);
            }}
          >
            {getGameObj && getGameObj.providerImageUrl ? (
              <Image
                resizeMode="stretch"
                style={[styles.gameImg, { width: "100%" }]}
                defaultSource={require("../../images/loadIcon/loadinglight.jpg")}
                source={{
                  uri: getGameObj.providerImageUrl,
                }}
              />
            ) : (
              <Image
                resizeMode="stretch"
                style={[styles.gameImg, { width: "100%" }]}
                defaultSource={require("../../images/loadIcon/loadinglight.jpg")}
                source={require("../../images/loadIcon/loadinglight.jpg")}
              />
            )}
          </Touch>
        );
      })
    );
  };

  render() {
    const {
      category,
    } = this.state;
    console.log(this.state)
    return (
      <ScrollView
        contentInset={{ top: 0, left: 0, bottom: 30, right: 0 }}
        style={styles.rootView}
      >
        <View style={styles.SportsbookTopBox}>
          <Text style={styles.topTitle}>{category.gameCatTitle}</Text>
          <Text style={styles.topTitleEn}>{category.gameCatSubtitle}</Text>
          <Image
            resizeMode='stretch'
            style={styles.topImg}
            source={{ uri: category.gameCatDefaultImageUrl }}
          />
        </View>

        <Text
          style={{
            color: "#333333",
            fontSize: 16,
            marginTop: 26,
            marginBottom: 16,
            fontWeight: "bold",
            paddingHorizontal: 16,
          }}
        >
          平台
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
        >
          {this.gamesRender()}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  userSetting: state.userSetting,
});
const mapDispatchToProps = (dispatch) => ({
  playGame: (data) => dispatch(actions.ACTION_PlayGame(data)),
  sportGamePopup: (code) => dispatch(actions.ACTION_OpenSport(code)),
  selfExclusionsPopup: (open) => dispatch(actions.ACTION_SelfExclusionsPopup(open)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ProductIntro);

const styles = StyleSheet.create({
  rootView: {
    backgroundColor: "#fff",
  },
  topTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    position: "absolute",
    top: 40,
  },
  topTitleEn: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    marginTop: 10,
    position: "absolute",
    top: 70,
  },
  topImg: {
    width: width,
    height: 0.5 * width,
    // top:-20,
  },
  SportsbookTopBox: {
    // backgroundColor: "#2994FF",
    alignItems: "center",
  },
  gameImg: {
    flex: 1,
    borderRadius: 6,
  },
});

ProductIntro.propTypes = {
  gameList: PropTypes.array,
  category: PropTypes.object,
  categoryCode: PropTypes.string,
};
