import React from "react";
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, View, } from "react-native";
import Touch from "react-native-touch-once";
import LinearGradient from "react-native-linear-gradient";
import { Actions } from "react-native-router-flux";
import { Toast } from "antd-mobile-rn";
import { vendorPiwik } from "../Vendors/vendorPiwik";
import PropTypes from "prop-types";
import { labelText, openNewWindowList, openNewWindowListIOS, piwikNameMap, sportsName } from "../../lib/data/game";
import * as Animatable from "react-native-animatable";
import actions from "../../lib/redux/actions/index";
import { connect } from "react-redux";
import PiwikAction from "../../lib/utils/piwik";
import Countdown from './Countdown'
const { width, height } = Dimensions.get("window");

const catIcon = {
  OthersGame: require("../../images/game/cat/liveCasino/3.png"),
  Baccarat: require("../../images/game/cat/liveCasino/1.png"),
  Sicbo: require("../../images/game/cat/liveCasino/6.png"),
  Roulette: require("../../images/game/cat/liveCasino/5.png"),
  DragonTiger: require("../../images/game/cat/liveCasino/7.png"),

  FishingGame: require("../../images/game/cat/slot/2.png"),
  IsRecommendedGames: require("../../images/game/cat/slot/3.png"),
  HotGames: require("../../images/game/cat/slot/4.png"),
  Arcade: require("../../images/game/cat/slot/1.png"),

  DouDizhu: require("../../images/game/cat/P2P/5.png"),
  CowCow: require("../../images/game/cat/P2P/1.png"),
  KYGMahjong: require("../../images/game/cat/P2P/2.png"),
  GoldenFlower: require("../../images/game/cat/P2P/4.png"),
  Poker: require("../../images/game/cat/P2P/3.png"),

}

const itemWidth = width / 2 - 17.5
const itemWidth3 = width / 3.6

class ProductGamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // gameProviders
      gameItem: this.props.gameItem,
      // GameCategory
      category: this.props.category,
      pageNumber: 1,
      recommendedGames: [],
      jackpotGames: [],
      // slotJackPotNumber: 9999999,
      JackpotNum: ['0', ',', '0', '0', '0', ',', '0', '0', '0', '.', '0', '0'],
      count: Math.round(Math.random() * 999999),
      gameProvidersDetails: [],
      gameCategories: [],
      gameCategoriesAll: [],
      openNewWindowModal: false,
      gameOpenUrl: "",
    };
  }

  componentDidMount() {
    this.increaseNumber()
    console.log(this.props)
    this.checkFP_GameProvider();
    const gameCatCode = this.props.category?.gameCatCode;
    const navTitle = gameCatCode === "casino" ? "真人娱乐场" : this.props.category.title;
    this.props.navigation.setParams({
      title: navTitle,
    });
    Toast.loading("加载中,请稍候...", 200);

    // 只有Slot和LD會在這裡開公告
    console.log('gameCatCode ', gameCatCode)
    if (gameCatCode.toLowerCase() === "casino" || gameCatCode.toLowerCase() === "slot") {
      // 第一個字大寫以符合api格式
      this.props.getAnnouncementPopup(`${gameCatCode[0].toUpperCase()}${gameCatCode.slice(1)}`);
    }
    let getAllData = [
      this.getRecommendedGame(),
      this.GameProvidersDetails(),
      this.getGameCategories(),
    ];

    if (gameCatCode.toLowerCase() === "slot") {
      getAllData.push(this.getJackpotGame());
    }

    Promise.all(getAllData).then((res) => {
      if (res) {
        Toast.hide();
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  checkFP_GameProvider = () => {
    if (this.props.gameItem) {
      return;
    }
    if (!this.props.category) {
      return;
    }
    const gameCatId = this.props.category.gameCatId;
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

  getRecommendedGame = () => {
    let { pageNumber } = this.state;
    let fetchurl = `${ApiPort.GetGame}gameType=${this.props.categoryCode}&pageNumber=${pageNumber}&pageSize=15&gameSortingType=Recommended&`;
    console.log("getRecommendedGame");
    global.storage
      .load({
        key: `recommended${this.props.categoryCode}`,
        id: `recommended${this.props.categoryCode}`,
      })
      .then((val) => {
        if (val) {
          this.setState({
            recommendedGames: val,
          });
        }
      })
      .catch((err) => {
      });
    return fetchRequest(fetchurl, "GET").then((res) => {
      if (res.isSuccess && res.result.gameDetails) {
        this.setState({
          recommendedGames: res.result.gameDetails,
        });
        storage.save({
          key: `recommended${this.props.categoryCode}`,
          id: `recommended${this.props.categoryCode}`,
          data: res.result.gameDetails,
        });
      }
    });
  };

  GameProvidersDetails = () => {
    let fetchurl = `${ApiPort.GameProvidersDetails}gameType=${this.props.categoryCode}&`;
    console.log("GameProvidersDetails");
    global.storage
      .load({
        key: `Providers${this.props.categoryCode}`,
        id: `Providers${this.props.categoryCode}`,
      })
      .then((val) => {
        if (val) {
          this.setState({
            gameProvidersDetails: val,
          });
        }
      })
      .catch((err) => {
      });
    return fetchRequest(fetchurl, "GET").then((res) => {
      if (res.isSuccess && res.result) {
        this.setState({
          gameProvidersDetails: res.result,
        });
        storage.save({
          key: `Providers${this.props.categoryCode}`,
          id: `Providers${this.props.categoryCode}`,
          data: res.result,
        });
      }
    });
  };

  getGameCategories = () => {
    const { categoryCode } = this.props;
    let fetchurl = `${ApiPort.GameCategories}gameType=${categoryCode}&`;
    global.storage
      .load({
        key: `Categories${this.props.categoryCode}`,
        id: `Categories${this.props.categoryCode}`,
      })
      .then((val) => {
        if (val) {
          let result = val.filter(v => v.categoryType === "Category");
          this.setState({
            gameCategories: result,
            gameCategoriesAll: val
          });
        }
      })
      .catch((err) => {
      });
    return fetchRequest(fetchurl, "GET").then((res) => {
      let result = res.result.filter(v => v.categoryType === "Category");
      if (res.isSuccess && res.result) {
        this.setState({
          gameCategories: result,
        });
        storage.save({
          key: `Categories${this.props.categoryCode}`,
          id: `Categories${this.props.categoryCode}`,
          data: res.result,
        });
      }
    });
  };

  bounce = () =>
    this.view
      .bounce(800)
      .then((endState) =>
        console.log(endState.finished ? "bounce finished" : "bounce cancelled")
      );

  getJackpotGame = () => {
    let { pageNumber } = this.state;
    let fetchurl = `${ApiPort.GetGame}gameType=${this.props.categoryCode}&pageNumber=${pageNumber}&pageSize=15&category=Jackpot&gameSortingType=Default&`;
    global.storage
      .load({
        key: `jackpotGameSlot`,
        id: `jackpotGameSlot`,
      })
      .then((val) => {
        if (val) {
          this.setState({
            jackpotGames: val,
          });
        }
      })
      .catch((err) => {
      });
    return fetchRequest(fetchurl, "GET").then((res) => {
      if (res.isSuccess && res.result.gameDetails) {
        this.setState({
          jackpotGames: res.result.gameDetails,
        });
        storage.save({
          key: `jackpotGameSlot`,
          id: `jackpotGameSlot`,
          data: res.result.gameDetails,
        });
      }
    });
  };

  gamesJackPotRender = () => {
    const { jackpotGames } = this.state;
    return (
      <ScrollView horizontal={true} style={{ marginLeft: 16 }}>
        {jackpotGames.length > 0 &&
          jackpotGames.map((v, index) => {
            // Prod才做isLive判斷
            if(!isStaging && !v.isLive){
              return null;
            }
            return (
              <Touch
                style={{
                  // width: 109,
                  // height: 114,
                  flex: 1,
                }}
                key={index}
                onPress={() => {
                  const needNewWindow = !!(openNewWindowList.includes(v.provider) || openNewWindowListIOS.includes(v.provider));
                  PiwikEvent("Game", "Launch", `${v.gameName}_Slots_ProductPage`);
                  this.props.playGame({ provider: v.provider, gameId: v.gameId, category: this.props.category.gameCatCode });
                }}
              >
                <ImageBackground
                  resizeMethod="resize"
                  resizeMode="stretch"
                  source={require("../../images/slotBody.png")}
                  // style={{ flex: 1, height: 99 }}
                  style={{
                    minWidth: width - 30,
                    height: 99,
                    flexDirection: "row",
                    paddingTop: 15,
                    paddingBottom: 20,
                    paddingLeft: 20,
                    paddingRight: 61,
                  }}
                >
                  <View style={{ flex: 0.3 }}>
                    <Image
                      resizeMethod="resize"
                      resizeMode="stretch"
                      source={{ uri: v.imageUrl }}
                      style={{ width: 89, height: 64, borderRadius: 8 }}
                    />
                  </View>
                  <View style={{ flex: 0.7, marginLeft: 10, justifyContent: "center" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: 37,
                      }}
                    >
                      {/* {this.renderJackPotNumber()} */}
                      <Countdown />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      {labelText[v.provider] && (
                        <View
                          style={{
                            backgroundColor: labelText[v.provider].bgColor,
                            paddingVertical: 3,
                            paddingHorizontal: 5,
                            borderRadius: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: labelText[v.provider].color,
                              fontSize: 10,
                              fontWeight: "bold",
                            }}
                          >
                            {labelText[v.provider].text}
                          </Text>
                        </View>
                      )}
                      <Text
                        style={{ color: "#333", fontSize: 12, marginLeft: 8 }}
                      >
                        {v.gameName}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </Touch>
            );
          })}
      </ScrollView>
    );
  };

  toJackpotNum(num) {
    num = num.toString();
    // 把奖池变成字符串
    if (num.length < 9) {
      num = '0' + num; // 如未满9位数，添加"0"补位
      this.toJackpotNum(num); // 递归添加"0"补位
    } else if (num.length === 9) {
      // 奖池数中加入逗号
      num = num.slice(0, 1) + ',' + num.slice(1, 4) + ',' + num.slice(4, 7) + '.' + num.slice(7, 9);
      this.setState({
        JackpotNum: num.split('')
      });
    }
  }

  /**
     * @description:定时器
     * @param {*}
     * @return {*}
    */
  increaseNumber() {
    this.timer = setInterval(() => {
      this.setState(
        {
          count:
            this.state.count +
            this.getRandomNumber(
              Math.round(Math.random() * this.getRandomNumber(1, 100)),
              Math.round(Math.random() * this.getRandomNumber(1, 99999999))
            )
        },
        () => {
          this.toJackpotNum(this.state.count);
          //this.setNumberTransform();
        }
      );
    }, 3000);
  }

  /**
     * @description: 生产区间随机数
     * @param {*} min 最低
     * @param {*} max 最大
     * @return {*}
    */
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // jackPotNumber = () => {
  //   const { slotJackPotNumber } = this.state;
  //   var str = slotJackPotNumber.toString().split(".");
  //   str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //   return str.join(".") + ".00";
  // };

  // renderJackPotNumber = () => {
  //   // const getFormatNumber = this.jackPotNumber();
  //   // const numberAry = getFormatNumber.split("");
  //   // console.log(getFormatNumber);
  //   const numberAry = this.state.JackpotNum
  //   return (
  //     numberAry.length > 0 &&
  //     numberAry.map((v, i) => {
  //       if (v !== "," && v !== ".") {
  //         return (
  //           <ImageBackground
  //             key={i}
  //             resizeMode="stretch"
  //             source={require("../../images/Slot_Countdown.png")}
  //             style={{
  //               width: 16,
  //               height: 24,
  //               justifyContent: "center",
  //               alignItems: "center",
  //               marginRight: 3,
  //             }}
  //           >
  //             <Animatable.View>
  //               <Text
  //                 style={{
  //                   fontWeight: "bold",
  //                   fontSize: 16,
  //                   color: "#fff",
  //                 }}
  //               >
  //                 {v}
  //               </Text>
  //             </Animatable.View>
  //           </ImageBackground>
  //         );
  //       } else {
  //         return (
  //           <Text
  //             style={{
  //               fontSize: 14,
  //               color: "#00A6FF",
  //               marginLeft: -3,
  //               marginTop: 15,
  //             }}
  //           >
  //             {v}
  //           </Text>
  //         );
  //       }
  //     })
  //   );
  // };

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

  gamesRender = () => {
    const { recommendedGames } = this.state;
    return (
      <ScrollView horizontal={true}>
        {recommendedGames.length > 0 &&
          recommendedGames.map((v, index) => {
            // Prod才做isLive判斷
            if(!isStaging && !v.isLive){
              return null;
            }
            return (
              <Touch
                style={{
                  width: width / 2 - 17.5,
                  height: 0.4 * width,
                  marginRight: 6,
                  borderRadius: 8,
                  marginLeft: index === 0 ? 16 : 0,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.23,
                  shadowRadius: 2.62,
                  elevation: 4,
                }}
                key={index}
                onPress={() => {
                  const needNewWindow = !!(openNewWindowList.includes(v.provider) || openNewWindowListIOS.includes(v.provider));
                  PiwikEvent("Game", "Launch", `${v.gameName}_${piwikNameMap[this.props.categoryCode.toLowerCase()]}_ProductPage`);
                  this.props.playGame({ provider: v.provider, gameId: v.gameId, category: this.props.category.gameCatCode });
                }}
              >
                <Image
                  resizeMode="cover"
                  style={[styles.gameImg]}
                  source={{ uri: v.imageUrl }}
                  defaultSource={require("../../images/loadIcon/loadinglight.jpg")}
                />

                <View
                  style={{
                    backgroundColor: "#fff",
                    paddingVertical: 10.6,
                    paddingHorizontal: 10,
                    alignSelf: "flex-start",
                    width: itemWidth,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8
                  }}
                >
                  <Text numberOfLines={1} style={{ color: "#333", fontSize: 12 }}>
                    {v.gameName}
                  </Text>
                </View>
                {labelText[v.provider] && (
                  <View
                    style={{
                      position: "absolute",
                      top: 6,
                      left: 6,
                      backgroundColor: labelText[v.provider].bgColor,
                      paddingVertical: 3,
                      paddingHorizontal: 5,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: labelText[v.provider].color,
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {labelText[v.provider].text}
                    </Text>
                  </View>
                )}
              </Touch>
            );
          })}
      </ScrollView>
    );
  };

  renderGameProviders = () => {
    const { gameProvidersDetails, gameItem } = this.state;
    return (
      <View style={styles.container}>
        {gameProvidersDetails.length > 0 &&
          gameProvidersDetails.map((v, i) => {
            const findObj = gameItem ? gameItem.find(a => a.providerCode === v.providerCode) : null;
            const imgUrl = findObj ? findObj.providerImageUrl : "";
            return (
              <Touch
                key={i}
                style={[styles.item, { marginBottom: i + 1 % 3 === 0 ? 0 : 8, }]}
                onPress={() => {
                  PiwikAction.SendPiwik(`${v.providerCode}_Game_ProductPage`);
                  Actions.ProductGameDetail({
                    code: v.providerCode,
                    title: v.providerName,
                    gameProvidersDetails: gameProvidersDetails,
                    category: this.props.category,
                    categoryGameCode: this.props.categoryCode,
                    navTitle: this.props.category.title
                  })
                }
                }
              >
                <ImageBackground
                  source={{ uri: imgUrl }}
                  resizeMethod="resize"
                  resizeMode="stretch"
                  style={{ flex: 1 }}
                  defaultSource={require("../../images/loadIcon/loadinglight.jpg")}
                >
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(0, 0, 0, 0.4)",
                      "rgba(0, 0, 0, 0.4)",
                    ]}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      bottom: 0,
                      position: "absolute",
                      width: "100%",
                      height: 35,
                      // backgroundColor: "rgba(0, 0, 0,0.2)",
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}
                  >
                    <Text style={styles.gameContentTitle}>
                      {v.providerName}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </Touch>
            );
          })}
        {gameProvidersDetails.length > 0 && gameProvidersDetails.length % 3 !== 0 && (
          <View
            style={[styles.fakeItem]}
          />
        )}
      </View>
    );
  };

  renderGameCategory = () => {
    const { gameCategories, gameProvidersDetails } = this.state;
    return (
      gameCategories.length > 0 && (
        <>
          <View
            style={{
              marginTop: 24,
              marginBottom: 16,
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                color: "#333333",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              游戏类型
            </Text>
          </View>
          <View style={styles.container}>
            {gameCategories.length > 0 &&
              gameCategories.map((v, i) => {
                return (
                  <Touch
                    key={i}
                    onPress={() => {
                      console.log(piwikNameMap)
                      console.log(this.props.categoryCode)
                      PiwikEvent("Game Nav", "View", `${v.name}_${piwikNameMap[this.props.categoryCode.toLowerCase()]}_ProductPage`);
                      Actions.ProductGameDetail({
                        code: "",
                        title: v.name,
                        navTitle: this.props.category.title,
                        from: "category",
                        gameProvidersDetails: gameProvidersDetails,
                        category: this.props.category,
                        gameCategories: v,
                        categoryGameCode: this.props.categoryCode,
                      })
                    }
                    }
                    style={{
                      borderRadius: 10,
                      backgroundColor: "#fff",
                      height: 44,
                      width: itemWidth3, // is 50% of container width
                      // marginRight: i + 1 % 3 === 0 ? 0 : 8,
                      marginBottom: 8,
                      overflow: "hidden",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.23,
                      shadowRadius: 2.62,
                      elevation: 4,
                      flexDirection: 'row'
                    }}
                  >
                    {catIcon[v.category] &&
                      <Image resizeMode='stretch' source={catIcon[v.category]} style={{ width: 28, height: 28 }} />}
                    <Text style={{ color: "#333", lineHeight: 44, fontSize: 11 }}>
                      {v.name}
                    </Text>
                  </Touch>
                );
              })}

            {gameCategories.length > 0 && gameCategories.length % 3 !== 0 && (
              <View
                style={{
                  height: 44,
                  width: itemWidth3,
                  marginBottom: 8,
                }}
              />
            )}
          </View>
        </>
      )
    );
  };

  render() {
    const { gameProvidersDetails, category, jackpotGames } =
      this.state;
    return (
      <ScrollView
        contentInset={{ top: 0, left: 0, bottom: 30, right: 0 }}
        style={styles.rootView}
      >
        <View style={styles.SportsbookTopBox}>
          <Text style={styles.topTitle}>{category.gameCatTitle}</Text>
          <Text style={styles.topTitleEn}>{category.gameCatSubtitle}</Text>
          <Image
            style={styles.topImg}
            source={{ uri: category.gameCatDefaultImageUrl }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 24,
            marginBottom: 16,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              color: "#333333",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            推荐游戏
          </Text>
          <Touch
            onPress={() => {
              const navTitle = this.props.category.gameCatCode === "casino" ? "真人娱乐场" : this.props.category.title;
              Actions.ProductGameDetail({
                code: "",
                navTitle: navTitle,
                title: "",
                from: "recommend",
                gameProvidersDetails: gameProvidersDetails,
                category: this.props.category,
                categoryGameCode: this.props.categoryCode,
              });
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: "#00A6FF", marginRight: 7 }}>查看更多</Text>
              <Image
                style={{ width: 5, height: 15 }}
                source={require("../../images/icon-right-blue.png")}
              />
            </View>
          </Touch>
        </View>
        {this.gamesRender()}
        {this.props.categoryCode === "Slot" && jackpotGames.length > 0 && (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 24,
                marginBottom: 16,
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{
                  color: "#333333",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                彩池游戏
              </Text>
              <Touch
                onPress={() => {
                  const findJackPot = this.state.gameCategoriesAll.find(
                    (element) => element.category == "Jackpot"
                  );
                  if (!findJackPot) {
                    return;
                  }
                  Actions.ProductGameDetail({
                    code: "",
                    title: "",
                    from: "Jackpot",
                    gameProvidersDetails: gameProvidersDetails,
                    category: this.props.category,
                    gameFeature: findJackPot,
                    categoryGameCode: this.props.categoryCode,
                  });
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: "#00A6FF", marginRight: 7 }}>查看更多</Text>
                  <Image
                    style={{ width: 5, height: 15 }}
                    source={require("../../images/icon-right-blue.png")}
                  />
                </View>
              </Touch>
            </View>
            {this.gamesJackPotRender()}
          </>
        )}

        <View
          style={{
            marginTop: 24,
            marginBottom: 16,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              color: "#333333",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            平台
          </Text>
        </View>
        {this.renderGameProviders()}

        {this.renderGameCategory()}

        <View style={{ paddingBottom: 100 }} />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});
const mapDispatchToProps = (dispatch) => ({
  playGame: (data) => dispatch(actions.ACTION_PlayGame(data)),
  getAnnouncementPopup: (optionType) => dispatch(actions.ACTION_GetAnnouncement(optionType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductGamePage);

const styles = StyleSheet.create({
  rootView: {
    backgroundColor: "#EFEFF4",
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
    width: itemWidth,
    height: 0.28 * width,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
    alignItems: "center",
  },
  item: {
    width: itemWidth3, // is 50% of container width
    height: itemWidth3,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  fakeItem: {
    width: itemWidth3, // is 50% of container width
    height: itemWidth3,
    borderRadius: 8,
    overflow: "hidden",
  },
  gameContentTitle: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 14,
    // width: 0.373 * width,
    // position: 'absolute',
    // bottom: 5,
  },
});

ProductGamePage.propTypes = {
  gameItem: PropTypes.array,
  category: PropTypes.object,
};
