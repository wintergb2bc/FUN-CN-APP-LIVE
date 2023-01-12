import React, { Component } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image as NativeImage,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import actions from "../../lib/redux/actions/index";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";
import PropTypes from "prop-types";
import { labelText, openNewWindowList, openNewWindowListIOS, piwikNameMap } from "../../lib/data/game";
import { emojiReg, scReg, } from "../../actions/Reg";
import AutoHeightImage from 'react-native-auto-height-image';

const { width, height } = Dimensions.get("window");
const itemWidth = width / 2 - 17.5;
// screen height and width
// const maxPayLines = [
//   { name: "全部赔付线", id: 1 },
//   { name: "25-50", id: 2, min: 25, max: 50 },
//   { name: "少于5", id: 3, min: 0, max: 5 },
//   { name: "55-100", id: 4, min: 55, max: 100 },
//   { name: "5-10", id: 5, min: 5, max: 10 },
//   { name: "派彩方式", id: 6, min: 100, max: 0 },
//   { name: "15-20", id: 7, min: 15, max: 20 },
// ];

const slotDropdown = [
  {
    id: 0,
    title: "默认",
    value: "Default",
  },
  {
    id: 1,
    title: "最新",
    value: "IsNew",
  },
  {
    id: 2,
    title: "推荐",
    value: "Recommended",
  },
  {
    id: 3,
    title: "A-Z",
    value: "AToZ",
  },
];

const hideRightBtnsList = ["instantgames"];
class ProductGameDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      lastPage: false, //是否為最後一頁
      isEmptyData: false, //是否為空
      loading: true,
      loadingMore: false,
      refreshing: false,

      // 當前的遊戲
      nowCode: this.props.code,
      title: this.props.title,

      //搜尋
      searchText: "", //
      searchResult: null, //搜索结果
      showSearchBar: false,
      searchBarhasFocus: false,

      // 排序
      slotKey: 0,
      showOrderDropdown: false,

      // 開啟遊戲
      openNewWindowModal: false,
      gameOpenUrl: "",

      // 篩選用
      gameCategories: [],
      gameFeature: [],
      maxPayLines: [],
      gameCategoriesSelected: this.getCatSelected(),
      gameFeatureSelected: this.getFeatureSelected(),
      gameProvidersSelected: {
        providerCode: this.props.code ? this.props.code : "",
        providerName: this.props.title ? this.props.title : "全部平台",
      },
      gameProvidersDetails: [],
      maxPayLineSelected: { name: "全部赔付线", id: 1 },
      showFilterModal: false,

      // 點擊暫存
      maxPayLineSelectedTemp: { name: "全部赔付线", id: 1 },
      gameFeatureSelectedTemp: this.props.gameFeature
        ? this.props.gameFeature
        : { id: 1, category: "AllGames", name: "全部类型" },
      gameCategoriesSelectedTemp: this.props.gameCategories
        ? this.props.gameCategories
        : { id: 1, category: "AllGames", name: "全部类型" },
      gameProvidersSelectedTemp: {
        providerCode: this.props.code ? this.props.code : "",
        providerName: this.props.title ? this.props.title : "全部平台",
      },
    };

    console.log(this.props)
  }

  componentDidMount() {
    console.log(this.props);
    this.props.navigation.setParams({
      title: "",
    });
    const gameCatCode = this.props.category?.gameCatCode;
    // 只有Slot和LD會在這裡開公告
    console.log('gameCatCode ', gameCatCode.toLocaleLowerCase())
    if (gameCatCode.toLowerCase() === "casino" || gameCatCode.toLowerCase() === "slot") {
      // 第一個字大寫以符合api格式
      this.props.getAnnouncementPopup(`${gameCatCode[0].toUpperCase()}${gameCatCode.slice(1)}`);
    }
    let processed = [
      this.getGames(),
      this.getGameCategories(),
      this.getGameProviders(),
    ];
    Promise.all(processed).then((res) => {
      if (res) {
        Toast.hide();
      }
    });
  }

  getCatSelected = () => {
    switch (this.props.from) {
      case "recommend":
        return {
          category: "IsRecommendedGames",
          categoryType: "Category",
          id: "130",
          isNew: false,
          name: "推荐游戏",
        };
      case "category":
        return this.props.gameCategories;
      default:
        return { id: 1, category: "AllGames", name: "全部类型" };
    }
  };

  getFeatureSelected = () => {
    switch (this.props.from) {
      case "Jackpot":
        return this.props.gameFeature;
      default:
        return { id: 1, category: "AllGames", name: "全部类型" };
    }
  };

  getGameProviders = () => {
    if (this.props.categoryGameCode.toLocaleLowerCase() === "slot") {
      this.GameProvidersYBFDetails();
      return;
    }
    if (
      this.props.gameProvidersDetails &&
      this.props.gameProvidersDetails.length > 0
    ) {
      let data = [...this.props.gameProvidersDetails];
      data.unshift({ providerCode: "", providerName: "全部平台" });
      this.setState(
        {
          gameProvidersDetails: data,
        },
        () => {
          this.initGameProvidersSelected();
          return Promise.resolve();
        }
      );
    } else {
      this.GameProvidersDetails();
    }
  };

  // 有醉心捕魚的Provider，slot才需要
  GameProvidersYBFDetails = () => {
    const { categoryGameCode } = this.props;
    let fetchurl = `${ApiPort.GameProvidersDetails}gameType=${categoryGameCode}&isShowFishingGames=true&`;
    return fetchRequest(fetchurl, "GET").then((res) => {
      if (res.isSuccess && res.result) {
        let data = res.result;
        data.unshift({
          providerCode: "",
          providerName: "全部平台",
        });
        this.setState(
          {
            gameProvidersDetails: data,
          },
          () => {
            this.initGameProvidersSelected();
          }
        );
      }
    });
  };


  GameProvidersDetails = () => {
    const { categoryGameCode } = this.props;
    let fetchurl = `${ApiPort.GameProvidersDetails}gameType=${categoryGameCode}&`;
    console.log("GameProvidersDetails");
    return fetchRequest(fetchurl, "GET").then((res) => {
      if (res.isSuccess && res.result) {
        let data = res.result;
        data.unshift({
          providerCode: "",
          providerName: "全部平台",
        });
        this.setState(
          {
            gameProvidersDetails: data,
          },
          () => {
            this.initGameProvidersSelected();
          }
        );
      }
    });
  };

  initGameProvidersSelected = () => {
    let res;
    if (this.state.nowCode === "FISHING") {
      res = { providerCode: "FISHING", providerName: "捕鱼游戏" };
    } else if (this.state.nowCode) {
      res = this.state.gameProvidersDetails.filter(
        (v) => v.providerCode === this.state.nowCode
      )[0];
    } else {
      res = { providerCode: "", providerName: "全部平台" };
    }
    this.setState({
      gameProvidersSelected: res ? res : {},
    });
  };

  getGameCategories = () => {
    const { categoryGameCode } = this.props;
    let fetchurl = `${ApiPort.GameCategories}gameType=${categoryGameCode}&`;
    return fetchRequest(fetchurl, "GET").then((res) => {
      if (res.isSuccess && res.result) {
        let data = [...res.result];
        let payLines = [...res.result];
        data.unshift({ id: 1, category: "AllGames", name: "全部类型" });
        payLines.unshift({ id: 1, category: "AllGames", name: "全部赔付线" });
        this.setState({
          gameCategories: data.filter(
            (a) => a.id == 1 || a.categoryType === "Category"
          ),
          gameFeature: data.filter(
            (a) => a.id == 1 || a.categoryType === "Feature"
          ),
          maxPayLines: payLines.filter(
            (a) => a.id == 1 || a.categoryType === "Line"
          ),
        });
      }
    });
  };

  getProviderGames = (code) => {
    console.log(code);
    let res = this.state.allGames.filter((v) => v.provider === code);

    this.setState({
      games: res,
      providerAllGames: res,
      loading: false,
    });
  };

  getGames = () => {
    const {
      page,
      searchText,
      gameProvidersSelected,
      maxPayLineSelected,
      gameCategoriesSelected,
      gameFeatureSelected,
      slotKey,
    } = this.state;
    const { categoryGameCode } = this.props;
    console.log(gameProvidersSelected);
    const gameType = categoryGameCode;
    const max = maxPayLineSelected.max || -1;
    const min = maxPayLineSelected.min || -1;
    let categoryCode = "";

    const catenateId = gameCategoriesSelected.id;
    const featuredId = gameFeatureSelected.id;

    if (catenateId == 1 && featuredId == 1) {
      categoryCode = "";
    } else if (catenateId == 1 || featuredId == 1) {
      if (catenateId != 1) {
        categoryCode = gameCategoriesSelected.category;
      }
      if (featuredId != 1) {
        categoryCode = gameFeatureSelected.category;
      }
    } else {
      categoryCode = `${gameCategoriesSelected.category},${gameFeatureSelected.category}`;
    }

    const providers = gameProvidersSelected.providerCode;
    const sortingType = slotDropdown[slotKey].value;
    let fetchurl;

    if (gameType.toLocaleLowerCase() === "slot") {
      if (max == -1 && min == -1) {
        fetchurl = `${ApiPort.GetGame}gameType=${gameType}&pageNumber=${page}&provider=${providers}&category=${categoryCode}&pageSize=15&gameSortingType=${sortingType}&keyword=${searchText}&`;
      } else {
        fetchurl = `${ApiPort.GetGame}gameType=${gameType}&pageNumber=${page}&provider=${providers}&category=${categoryCode}&pageSize=15&minPayline=${min}&maxPayline=${max}&gameSortingType=${sortingType}&keyword=${searchText}&`;
      }
    } else {
      fetchurl = `${ApiPort.GetGame}gameType=${gameType}&pageNumber=${page}&provider=${providers}&category=${categoryCode}&pageSize=15&gameSortingType=${sortingType}&keyword=${searchText}&`;
    }
    this.setState(
      {
        loading: true,
      },
      () => {
        return fetchRequest(fetchurl, "GET").then((res) => {
          if (res.isSuccess && res.result.gameDetails) {
            // Prod才做isLive判斷
            const filterIsLive = !isStaging ? res.result.gameDetails.filter(v => v.isLive) : res.result.gameDetails;
            this.setState({
              data:
                page === 1
                  ? Array.from(filterIsLive)
                  : [...this.state.data, ...filterIsLive],
              loading: false,
              loadingMore: false,
              refreshing: false,
              isEmptyData: page === 1 && res.result.gameDetails.length === 0,
              lastPage: res.result.gameDetails.length === 0,
            });
          }
        });
      }
    );
  };

  menuFilter = () => {
    const {
      gameCategoriesSelectedTemp,
      gameCategoriesSelected,
      gameFeatureSelectedTemp,
      gameFeatureSelected,
      maxPayLineSelectedTemp,
      maxPayLineSelected,
      gameProvidersSelected,
      gameProvidersSelectedTemp,
    } = this.state;

    let c =
      gameCategoriesSelected.id !== gameCategoriesSelectedTemp.id
        ? gameCategoriesSelectedTemp
        : gameCategoriesSelected;

    let f =
      gameFeatureSelected.id !== gameFeatureSelectedTemp.id
        ? gameFeatureSelectedTemp
        : gameFeatureSelected;

    let p =
      maxPayLineSelected.name !== maxPayLineSelectedTemp.name
        ? maxPayLineSelectedTemp
        : maxPayLineSelected;

    let prov =
      gameProvidersSelected.providerCode !==
        gameProvidersSelectedTemp.providerCode
        ? gameProvidersSelectedTemp
        : gameProvidersSelected;
    if (
      gameCategoriesSelected.id !== gameCategoriesSelectedTemp.id ||
      gameFeatureSelected.id !== gameFeatureSelectedTemp.id ||
      maxPayLineSelected.name !== maxPayLineSelectedTemp.name ||
      gameProvidersSelected.providerCode !==
      gameProvidersSelectedTemp.providerCode
    ) {
      this.setState(
        {
          gameCategoriesSelected: c,
          gameFeatureSelected: f,
          maxPayLineSelected: p,
          gameProvidersSelected: prov,
        },
        () => {
          this.doFilter();
        }
      );
    } else {
      this.doFilter();
    }
  };

  doFilter = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
        showFilterModal: false,
      },
      () => {
        this.getGames();
      }
    );
  };

  _onEndReached = () => {
    if (this.state.lastPage) {
      return;
    }
    this.setState(
      (prevState, nextProps) => ({
        page: prevState.page + 1,
        loadingMore: true,
      }),
      () => {
        this.getGames();
      }
    );
  };

  _renderFooter = () => {
    if (this.state.isEmptyData) return null;
    return (
      <>
        <Text style={{ color: "#BBBBBB", textAlign: "center", fontSize: 14 }}>
          {this.state.lastPage ? "没有更多游戏啦" : "下滑显示更多"}
        </Text>
        {this.state.loading && (
          <View
            style={{
              position: "relative",
              width: width,
              height: height,
              marginTop: 16,
              marginBottom: 10,
            }}
          >
            <ActivityIndicator animating size="small" />
          </View>
        )}
      </>
    );
  };

  // 排序
  onSlot = (item, index) => {
    this.setState({ slotKey: index, showOrderDropdown: false }, () => {
      this.getGames();
    });
  };

  renderItem = ({ item, index, separators }) => {
    return (
      <Touch
        style={[styles.item, { marginRight: index % 2 !== 0 ? 0 : 11 }]}
        key={item.gameId}
        onPress={() => {
          const needNewWindow = !!(openNewWindowList.includes(item.provider) || openNewWindowListIOS.includes(item.provider));
          console.log('needNewWindow ', needNewWindow);
          if (this.props.code === "VTG") {
            PiwikEvent("Game", "Launch", `${item.gameName}_V2G_SportPage_ProductPage`);
          } else {
            PiwikEvent("Game", "Launch", `${item.gameName}_${piwikNameMap[this.props.categoryGameCode.toLowerCase()]}_ProductPage`);
          }
          this.props.playGame({ provider: item.provider, gameId: item.gameId, category: this.props.category.gameCatCode, launchGameCode: item.launchGameCode || "" });
        }}
      >
        <View style={{ minHeight: 85 }}>
          <AutoHeightImage
            resizeMode="stretch"
            width={itemWidth}
            fallbackSource={require("../../images/loadIcon/loadinglight.jpg")}
            source={{ uri: item.imageUrl }}
            defaultSource={require("../../images/loadIcon/loadinglight.jpg")}
          />
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            paddingVertical: 10.6,
            paddingHorizontal: 10,
            alignSelf: "flex-start",
            width: itemWidth,
          }}
        >
          <Text numberOfLines={1} style={{ color: "#333", fontSize: 12 }}>
            {item.gameName}
          </Text>
        </View>
        {labelText[item.provider] && (
          <View
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              backgroundColor: labelText[item.provider].bgColor,
              paddingVertical: 3,
              paddingHorizontal: 5,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                color: labelText[item.provider].color,
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              {labelText[item.provider].text}
            </Text>
          </View>
        )}
      </Touch>
    );
  };

  //输入框文字
  setScreening(value) {
    if (!emojiReg.test(value) && !scReg.test(value)) {
      this.setState({ searchText: value });
    }
  }

  searchGame = () => {
    this.setState(
      {
        data: [],
      },
      () => this.doFilter()
    );
  };

  setGameCategoriesSelected = (value) => {
    this.setState({
      gameCategoriesSelectedTemp: value,
    });
  };

  setGameFeatureSelected = (value) => {
    this.setState({
      gameFeatureSelectedTemp: value,
    });
  };

  setGameProvidersSelected = (value) => {
    this.setState({
      gameProvidersSelectedTemp: value,
    });
  };

  setMaxPayLineSelected = (value) => {
    this.setState({
      maxPayLineSelectedTemp: value,
    });
  };

  _listEmptyComponent = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 185,
        }}
      >
        <NativeImage
          resizeMode="stretch"
          source={require("../../images/emptybox.png")}
          style={{ width: 98, height: 98 }}
        />
        <Text
          style={{
            color: "#CCCCCC",
            fontSize: 14,
            fontWeight: "bold",
            marginTop: 16.5,
          }}
        >
          未找到结果
        </Text>
      </View>
    );
  };

  renderFilterCategory = () => {
    const { gameCategories, gameCategoriesSelectedTemp } = this.state;
    return (
      <View>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 8,
            color: "#000000",
            fontWeight: "600",
            marginTop:
              this.props.categoryGameCode.toLocaleLowerCase() === "slot"
                ? 0
                : 16,
          }}
        >
          游戏类型
        </Text>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            padding: 24,
            paddingBottom: 8,
          }}
        >
          {gameCategories.length > 0 &&
            gameCategories.map((b, index) => {
              return (
                <Touch
                  key={index}
                  style={styles.channel}
                  onPress={() => {
                    this.setGameCategoriesSelected(b);
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: '#333' }}>{b.name}</Text>
                    {b.isNew && (
                      <View style={{
                        borderRadius: 4,
                        width: 18,
                        height: 18,
                        backgroundColor: "#FF4141",
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10
                      }}>
                        <Text style={{ fontSize: 10, color: '#fff' }}>新</Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={
                      b.id == gameCategoriesSelectedTemp.id
                        ? styles.paymenRadiusAHover
                        : styles.paymenRadiusA
                    }
                  >
                    <View
                      style={
                        b.id == gameCategoriesSelectedTemp.id
                          ? styles.paymenRadiusBHover
                          : styles.paymenRadiusB
                      }
                    />
                  </View>
                </Touch>
              );
            })}
        </View>
      </View>
    );
  };

  renderFilterFeature = () => {
    const { gameFeature, gameFeatureSelectedTemp } = this.state;
    return (
      <View>
        <Text
          style={{
            fontSize: 16,
            marginTop: 16,
            marginBottom: 8,
            color: "#000000",
            fontWeight: "600",
          }}
        >
          游戏特色
        </Text>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            padding: 24,
            paddingBottom: 8,
          }}
        >
          {gameFeature.length > 0 &&
            gameFeature.map((b, index) => {
              return (
                <Touch
                  key={index}
                  style={styles.channel}
                  onPress={() => {
                    this.setGameFeatureSelected(b);
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: '#333' }}>{b.name}</Text>
                    {b.isNew && (
                      <View style={{
                        borderRadius: 4,
                        width: 18,
                        height: 18,
                        backgroundColor: "#FF4141",
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10
                      }}>
                        <Text style={{ fontSize: 10, color: '#fff' }}>新</Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={
                      b.id == gameFeatureSelectedTemp.id
                        ? styles.paymenRadiusAHover
                        : styles.paymenRadiusA
                    }
                  >
                    <View
                      style={
                        b.id == gameFeatureSelectedTemp.id
                          ? styles.paymenRadiusBHover
                          : styles.paymenRadiusB
                      }
                    />
                  </View>
                </Touch>
              );
            })}
        </View>
      </View>
    );
  };

  renderFilterPayLine = () => {
    const { maxPayLineSelectedTemp, maxPayLines } = this.state;
    return (
      <View>
        <Text
          style={{
            fontSize: 16,
            marginTop: 16,
            marginBottom: 8,
            color: "#000000",
            fontWeight: "600",
          }}
        >
          赔付线
        </Text>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            padding: 24,
            paddingBottom: 8,
          }}
        >
          {console.log('maxPayLines')}
          {console.log(maxPayLines)}
          {maxPayLines.length > 0 &&
            maxPayLines.map((item, index) => {
              return (
                <Touch
                  key={index}
                  style={styles.channel}
                  onPress={() => {
                    this.setMaxPayLineSelected(item);
                  }}
                >
                  <Text style={{ color: '#333' }}>{item.name}</Text>
                  <View
                    style={
                      item.name == maxPayLineSelectedTemp.name
                        ? styles.paymenRadiusAHover
                        : styles.paymenRadiusA
                    }
                  >
                    <View
                      style={
                        item.name == maxPayLineSelectedTemp.name
                          ? styles.paymenRadiusBHover
                          : styles.paymenRadiusB
                      }
                    />
                  </View>
                </Touch>
              );
            })}
        </View>
      </View>
    );
  };

  renderFilterProvider = () => {
    const { gameProvidersSelectedTemp, gameProvidersDetails } = this.state;
    return (
      <View>
        <Text
          style={{
            fontSize: 16,
            marginTop:
              this.props.categoryGameCode.toLocaleLowerCase() === "slot"
                ? 16
                : 0,
            marginBottom: 8,
            color: "#000000",
            fontWeight: "600",
          }}
        >
          平台
        </Text>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            padding: 24,
            paddingBottom: 8,
          }}
        >
          {gameProvidersDetails.length > 0 &&
            gameProvidersDetails.map((b, index) => {
              return (
                <Touch
                  key={index}
                  style={styles.channel2}
                  onPress={() => {
                    this.setGameProvidersSelected(b);
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: '#333' }}>{b.providerName}</Text>
                    {b.isNew && (
                      <View style={{
                        borderRadius: 4,
                        width: 18,
                        height: 18,
                        backgroundColor: "#FF4141",
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10
                      }}>
                        <Text style={{ fontSize: 10, color: '#fff' }}>新</Text>
                      </View>
                    )}
                    {b.isHot && (
                      <View style={{
                        borderRadius: 4,
                        width: 18,
                        height: 18,
                        backgroundColor: "#FDB454",
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10
                      }}>
                        <Text style={{ fontSize: 10, color: '#fff' }}>热</Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={
                      b.providerCode == gameProvidersSelectedTemp.providerCode
                        ? styles.paymenRadiusAHover
                        : styles.paymenRadiusA
                    }
                  >
                    <View
                      style={
                        b.providerCode == gameProvidersSelectedTemp.providerCode
                          ? styles.paymenRadiusBHover
                          : styles.paymenRadiusB
                      }
                    />
                  </View>
                </Touch>
              );
            })}
        </View>
      </View>
    );
  };

  render() {
    const {
      gameCategories,
      gameCategoriesSelected,
      gameFeatureSelected,
      showFilterModal,
      gameFeature,
      gameProvidersSelected,
      maxPayLineSelected,
      gameProvidersDetails,
      searchText,
      showSearchBar,
      showOrderDropdown,
      slotKey,
      searchBarhasFocus,
      gameOpenUrl,
      gameCategoriesSelectedTemp,
      maxPayLineSelectedTemp,
      gameFeatureSelectedTemp,
    } = this.state;
    return (
      <View style={{ flex: 1, height: height, backgroundColor: "#EFEFF4" }}>
        <View style={styles.topNav}>
          <Touch
            onPress={() => {
              Actions.pop();
            }}
            style={{ flex: 1 }}
          >
            <NativeImage
              resizeMode="stretch"
              source={require("../../images/icon-white.png")}
              style={{ width: 21, height: 21 }}
            />
          </Touch>
          <View style={{ flex: 1 }}>
            {this.props.navTitle ? (
              <Text style={[styles.btnTxt]}>{this.props.navTitle}</Text>
            ) : (
              Object.keys(gameProvidersSelected).length !== 0 && (
                <Text style={[styles.btnTxt]}>{gameProvidersSelected.providerName}</Text>
              )
            )}
          </View>
          {
            !hideRightBtnsList.includes(this.props.category.gameCatCode) ? (
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
                  onPress={() => {
                    if (!showSearchBar) {
                      PiwikEvent("Game Nav", "Click", `Search_${piwikNameMap[this.props.categoryGameCode.toLowerCase()]}`);
                    }
                    this.setState({
                      showSearchBar: !showSearchBar,
                    });
                  }}
                >
                  <NativeImage
                    resizeMode="stretch"
                    source={require("../../images/icon/search-white.png")}
                    style={{ width: 18, height: 18, marginRight: 16 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
                  onPress={() => {
                    if (!showFilterModal) {
                      PiwikEvent("Game Nav", "Click", `Filter_${piwikNameMap[this.props.categoryGameCode.toLowerCase()]}`);
                    }
                    this.setState({ showFilterModal: true });
                  }}
                >
                  <NativeImage
                    resizeMode="stretch"
                    source={require("../../images/icon/filter2.png")}
                    style={{ width: 18, height: 18, marginRight: 16 }}
                  />
                </TouchableOpacity>
                {this.props.code !== "VTG" && (
                  <View style={{ position: "relative" }}>
                    <TouchableOpacity
                      hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
                      onPress={() => {
                        if (!showOrderDropdown) {
                          PiwikEvent("Game Nav", "Click", `Sorting_${piwikNameMap[this.props.categoryGameCode.toLowerCase()]}`);
                        }
                        this.setState({ showOrderDropdown: !showOrderDropdown });
                      }}
                    >
                      <NativeImage
                        source={require("../../images/icon/order.png")}
                        style={{ width: 18, height: 18 }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (<View style={{ flex: 1 }} />)
          }

        </View>
        {showOrderDropdown && (
          <View
            style={{
              backgroundColor: "#fff",
              width: 100,
              // height: 200,
              position: "absolute",
              zIndex: 9999,
              top: 50,
              right: -5,
              paddingHorizontal: 16,
              paddingTop: 16,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            {slotDropdown.map((item, index) => {
              return (
                <Touch
                  key={index}
                  style={styles.channel2}
                  onPress={() => {
                    this.onSlot(item, index);
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        paddingLeft: 5,
                        color: "#222222",
                      }}
                    >
                      {`${item.title}`}
                    </Text>
                  </View>
                  <View
                    style={
                      item.id == slotKey
                        ? styles.paymenRadiusAHover
                        : styles.paymenRadiusA
                    }
                  >
                    <View
                      style={
                        item.id == slotKey
                          ? styles.paymenRadiusBHover
                          : styles.paymenRadiusB
                      }
                    />
                  </View>
                </Touch>
              );
            })}
          </View>
        )}
        {/* 搜索框 */}
        {showSearchBar && (
          <View style={styles.screeningView}>
            <View style={[styles.screening, { borderColor: searchBarhasFocus ? "#00a6ff" : "#fff", borderWidth: 1 }]}>
              <NativeImage
                style={{ width: 24, height: 24 }}
                source={require("../../images/icon/search.png")}
              />
              <TextInput
                value={searchText}
                style={{ color: "#000", height: 37, width: width - 145 }}
                placeholder={"请输入关键字"}
                placeholderTextColor={"#ccc"}
                maxLength={30}
                onChangeText={(value) => {
                  this.setScreening(value);
                }}
                onBlur={() => {
                  if (this.state.searchText == "") {
                    this.setState({ GameData: this.initialGameList });
                  }
                  this.setState({ searchBarhasFocus: false });
                }}
                onFocus={() => {
                  this.setState({ searchBarhasFocus: true });
                }}
              />
              <Touch
                onPress={() => {
                  this.searchGame();
                }}
                style={styles.screeningBtn}
              >
                <Text style={{ color: "#fff", fontSize: 14 }}>搜索</Text>
              </Touch>
            </View>
          </View>
        )}

        {this.props.from !== "category" && (
          <View style={{ marginHorizontal: 16, flexDirection: "row" }}>
            {Object.keys(gameCategoriesSelected).length !== 0 &&
              gameCategoriesSelected.id != 1 && (
                <Touch
                  style={styles.filterShowBox}
                  onPress={() => {
                    this.setState(
                      {
                        gameCategoriesSelected: {
                          id: 1,
                          category: "AllGames",
                          name: "全部类型",
                        },
                        gameCategoriesSelectedTemp: {
                          id: 1,
                          category: "AllGames",
                          name: "全部类型",
                        },
                      },
                      () => {
                        this.getGames();
                      }
                    );
                  }}
                >
                  <Text>{gameCategoriesSelected.name}</Text>
                  <NativeImage
                    resizeMode="stretch"
                    source={require("../../images/close.png")}
                    style={{ width: 9, height: 9, marginLeft: 11 }}
                  />
                </Touch>
              )}
            {Object.keys(gameFeatureSelected).length !== 0 &&
              gameFeatureSelected.id != 1 && (
                <Touch
                  style={styles.filterShowBox}
                  onPress={() => {
                    this.setState(
                      {
                        gameFeatureSelected: {
                          id: 1,
                          category: "AllGames",
                          name: "全部类型",
                        },
                        gameFeatureSelectedTemp: {
                          id: 1,
                          category: "AllGames",
                          name: "全部类型",
                        },
                      },
                      () => {
                        this.getGames();
                      }
                    );
                  }}
                >
                  <Text>{gameFeatureSelected.name}</Text>
                  <NativeImage
                    resizeMode="stretch"
                    source={require("../../images/close.png")}
                    style={{ width: 9, height: 9, marginLeft: 11 }}
                  />
                </Touch>
              )}
            {Object.keys(maxPayLineSelected).length !== 0 &&
              maxPayLineSelected.name != "全部赔付线" && (
                <Touch
                  style={styles.filterShowBox}
                  onPress={() => {
                    this.setState(
                      {
                        maxPayLineSelected: { name: "全部赔付线", id: 1 },
                        maxPayLineSelectedTemp: { name: "全部赔付线", id: 1 },
                      },
                      () => {
                        this.getGames();
                      }
                    );
                  }}
                >
                  <Text>{maxPayLineSelected.name}</Text>
                  <NativeImage
                    resizeMode="stretch"
                    source={require("../../images/close.png")}
                    style={{ width: 9, height: 9, marginLeft: 11 }}
                  />
                </Touch>
              )}

            {
              ["sportsbook", 'instantgames'].includes(this.props.categoryGameCode.toLocaleLowerCase()) ? null : Object.keys(gameProvidersSelected).length !== 0 &&
                gameProvidersSelected.providerName !== "全部平台" && (
                  <Touch
                    style={styles.filterShowBox}
                    onPress={() => {
                      this.setState(
                        {
                          gameProvidersSelected: {
                            providerCode: "",
                            providerName: "全部平台",
                          },
                        },
                        () => {
                          this.getGames();
                        }
                      );
                    }}
                  >
                    <Text>{gameProvidersSelected.providerName}</Text>
                    <NativeImage
                      resizeMode="stretch"
                      source={require("../../images/close.png")}
                      style={{ width: 9, height: 9, marginLeft: 11 }}
                    />
                  </Touch>
                )}
          </View>
        )}

        {!this.state.loadingMore &&
          !this.state.loading &&
          this.state.isEmptyData &&
          this._listEmptyComponent()}

        {!this.state.loadingMore && this.state.loading ? (
          <FlatList
            data={["", "", "", "", "", "", "", "", ""]}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: this.state.data.length % 2 === 0 ? "center" : "flex-start",
              alignItems: "center",
              marginHorizontal: 12,
              backgroundColor: "#EFEFF4",
            }}
            renderItem={({ item, index }) => {
              return (
                <View style={[styles.item, { marginRight: index % 2 !== 0 ? 0 : 11 }]}>
                  <View
                    style={[styles.gameImg, { backgroundColor: "#d0d0d0" }]}
                  />

                  <View
                    style={{
                      backgroundColor: "#fff",
                      paddingVertical: 10.6,
                      paddingHorizontal: 10,
                      alignSelf: "flex-start",
                      width: itemWidth,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{ color: "#333", fontSize: 12 }}
                    ></Text>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            numColumns={2}
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.gameId}
            ListFooterComponent={this._renderFooter}
            onEndReached={() => (this.callOnScrollEnd = true)}
            onMomentumScrollEnd={() => {
              this.callOnScrollEnd && this._onEndReached();
              this.callOnScrollEnd = false;
            }}
            columnWrapperStyle={{
              justifyContent: this.state.data.length % 2 === 0 ? "center" : "flex-start",
              alignItems: "center",
              marginHorizontal: 12,
              backgroundColor: "#EFEFF4",
            }}
          />
        )}

        <Modal
          visible={showFilterModal}
          transparent={true}
          animationType="fade"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, .4)",
              width,
              height,
              position: "absolute",
              left: 0,
              right: 0,
              zIndex: 10000,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "#EFEFF4",
                paddingTop: 15,
                paddingHorizontal: 10,
                borderTopRightRadius: 16,
                borderTopLeftRadius: 16,
                height: height * 0.8,
                paddingBottom: 40,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Touch
                  onPress={() => {
                    this.setState({
                      showFilterModal: false,
                    });
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      paddingBottom: 25,
                      color: "#00A6FF",
                    }}
                  >
                    关闭
                  </Text>
                </Touch>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    paddingBottom: 25,
                    color: "#000000",
                    fontWeight: "600",
                  }}
                >
                  筛选
                </Text>
                <Touch
                  onPress={() => {
                    this.menuFilter();
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      paddingBottom: 25,
                      color: "#00A6FF",
                    }}
                  >
                    筛选
                  </Text>
                </Touch>
              </View>
              <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                {this.props.categoryGameCode.toLocaleLowerCase() === "slot" ? (
                  <>
                    {this.renderFilterCategory()}
                    {this.renderFilterFeature()}
                    {this.renderFilterPayLine()}
                    {this.renderFilterProvider()}
                  </>
                ) : this.props.categoryGameCode.toLocaleLowerCase() === "sportsbook" ? (
                  this.renderFilterCategory()
                ) : (
                  <>
                    {this.renderFilterProvider()}
                    {this.renderFilterCategory()}
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
});
const mapDispatchToProps = (dispatch) => ({
  playGame: (data) =>
    dispatch(actions.ACTION_PlayGame(data)),
  getAnnouncementPopup: (optionType) => dispatch(actions.ACTION_GetAnnouncement(optionType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductGameDetail);

const styles = StyleSheet.create({
  topNav: {
    width: width,
    height: 50,
    backgroundColor: "#00a6ff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
    zIndex: 99999999,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  btnTxt: {
    textAlign: "center",
    lineHeight: 32,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  gameImg: {
    width: itemWidth,
    // height: 80,
    height: 0.28 * width,
    // height: 0.333 * (width - 20),
  },
  item: {
    width: itemWidth, // is 50% of container width
    // height: 114,
    // height: 0.333 * (width - 20),
    // marginRight: 8,
    borderRadius: 8,
    marginBottom: 16,
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
  channel: {
    width: "44%",
    paddingLeft: 5,
    // height: 44,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 16,
  },
  channel2: {
    width: "100%",
    paddingLeft: 5,
    // height: 44,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 16,
  },
  paymenRadiusA: {
    borderColor: "#E3E3E8",
    borderWidth: 2,
    borderRadius: 12,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    // top: 10,
    // left: 10
  },
  paymenRadiusAHover: {
    borderColor: "#00a6ff",
    borderWidth: 4,
    borderRadius: 12,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    // top: 10,
    // left: 10
  },

  paymenRadiusB: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 11,
    height: 11,
  },
  paymenRadiusBHover: {
    // backgroundColor: '#00a6ff', borderRadius: 12, width: 15, height: 15,
  },
  screeningView: {
    marginHorizontal: 16,
    marginBottom: 15,
  },
  screening: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 64,
    paddingLeft: 15,
    height: 36,
  },
  screeningBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00A6FF",
    borderRadius: 50,
    height: 28,
    width: 52,
    marginRight: 4,
  },
  filterShowBox: {
    backgroundColor: "#E3E3E3",
    borderRadius: 4,
    padding: 6,
    // width: 140,
    marginBottom: 16,
    marginRight: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

ProductGameDetail.propTypes = {
  gameList: PropTypes.array,
  category: PropTypes.object,
  sequences: PropTypes.object,
};
