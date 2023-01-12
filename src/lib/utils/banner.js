import NavigationUtil from "./NavigationUtil";
import { Actions } from "react-native-router-flux";
import { Linking } from "react-native";
import { Toast } from "antd-mobile-rn";
import PiwikAction from "./piwik";
import { gameCatIdMap, FP_FlashcategoryCodeMap, sportsName } from "../data/game";
import actions from "../../lib/redux/actions/index";
import store from "../../lib/redux/store/index";

// 優惠點擊動作
export default class BannerAction {
  /**
   *
   * @param item 優惠資料
   * @param from 從哪頁過來 例:Home, Profile
   * @param type 類型 例：Feature
   *
   * actionId: 28 = actionName: "Link To"
   * actionId: 29 = actionName: "Promotion"
   * actionId: 30 = actionName: "Sponsorship"
   * actionId: 31 = actionName: "Deposit"
   * actionId: 32 = actionName: "Launch Game"
   * actionId: 33 = actionName: "Live Chat"
   * actionId: 0 = actionName: "No Action"
   *
   * @returns {void|*}
   */
  static onBannerClick = (item, from = "", type = "") => {
    let fromName = "";
    if (from !== "") {
      fromName = from.toLocaleLowerCase() === "home" ? "Home" : "Profile";
    }

    if (from.toLocaleLowerCase() === 'home' && type.toLocaleLowerCase() === "feature") {
      PiwikEvent('Banner', 'Click', `${item.title}_Feature_Home`);
    } else {
      // PiwikEvent('EventBanner', 'Click', `Event_App-${Platform.OS}_${item.title}`)
    }

    console.log('onBannerClick 123', item);
    const action = item.action;
    if (!action) {
      console.log('缺少action');
      return;
    }
    console.log(action)
    switch (action.actionId) {
      case 0:
        return;
      case 202211:
        //開啟體育詳情頁
        if(action.matchInfo && action.matchInfo.event_id) {
          window.openSB20Detail('im',1, action.matchInfo.event_id*1, 30455);
        }
        break;
      case 28:
        this.linkToAction(action);
        break;
      case 29:
        if (type.toLocaleLowerCase() === "feature") {
          PiwikAction.SendDynamicPiwik("Banner", "Click", `${item.title}_Feature_${fromName}`);
        } else {
          PiwikAction.SendDynamicPiwik("Banner", "Click", `${action.ID}_${item.title}_${fromName}`);
        }
        return this.getPromotionContent(action.ID);
      case 30:
        Actions.Sponsor();
        break;
      case 31:
        if (!ApiPort.UserLogin) return NavigationUtil.goToLogin(); // 先登入
        Actions.DepositCenter();
        return;
      case 32:
        //跳转游戏
        if (action.launchMode === "game_id" || action.launchMode === "web_view") {
          if (!ApiPort.UserLogin) return NavigationUtil.goToLogin(); // 先登入
          if(!action.cgmsVendorCode){
            return;
          }
          if (sportsName.includes(action.cgmsVendorCode)) {
            store.dispatch(actions.ACTION_OpenSport(action.cgmsVendorCode));
            return;
          }
          store.dispatch(actions.ACTION_PlayGame({ provider: action.cgmsVendorCode, gameId: action.gameId }));
          return 'Launch Game';
        }

        //開大廳
        if (action.launchMode === "lobby" && action.cgmsVendorCode) {
          this.gameLobbyAction(action);
        }
        break;
      case 33:
        LiveChatOpenGlobe();
        break;
      default:
        break;
    }


    // if (action.actionId == 32 && action.launchMode) {
    // 
    //
    // } else if (action && action.actionName == 'IMSB deeplink') {
    //   const data = {
    //     providerCode: action.productCode,
    //     gameCatCode: "Sportsbook",
    //     providerGameId: action.gameId,
    //     sportId: action.sportId,
    //     languageCode: action.languageCode,
    //     eventId: action.eventId,
    //     query: `${action.sportId}/${action.eventId}`,
    //   };
    // }
  };

  static getPromotionContent = (promotionId = null) => {
    Toast.loading("优惠加载中...", 10);
    const pid = promotionId ? `?id=${promotionId}` : "";
    fetch(`${CMS_Domain + ApiPort.CMS_Promotion}${pid}&jumpfrom=BANNER`, {
      method: "GET",
      headers: {
        token: CMS_token,
        Authorization: ApiPort.Token || "",
      },
    })
      .then(response => response.json())
      .then((data) => {
        Toast.hide();

        const isDailyDeal = data.promotionMainType ? data.promotionMainType === "Daily Deal" : false;
        const isFreeBets = data.promotionMainType ? data.promotionMainType === "Free Bets" : false;
        console.log('isDailyDeal ', isDailyDeal);
        if (isDailyDeal) {
          if (!ApiPort.UserLogin) {
            return NavigationUtil.goToLogin(); // 先登入
          }
          Actions.PromotionsRebateDetail({ ids: promotionId, data: [data], content: data });
        } else if (isFreeBets) {
          if (!ApiPort.UserLogin) {
            return NavigationUtil.goToLogin(); // 先登入
          }
          Actions.PromotionsDetail({
            Detail: data,
            from: "freeBet",
            item: data,
          });
        } else {
          Actions.PromotionsDetail({ Detail: data });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  static gameLobbyAction = async (action) => {
    // Toast.loading("加载中...", 10);
    // 找出遊戲分類
    let gameCat;
    for (let i = 0; i < gameCatIdMap.length; i++) {
      const item = gameCatIdMap[i];
      if (item.games.find(x => x === action.cgmsVendorCode)) {
        gameCat = item;
        break;
      }
    }
    
    if(!gameCat || !gameCat.id){
      console.log('沒找到game provider id')
      return;
    }

    let GameCategory;
    let GameProviders;

    await global.storage.load({
      key: 'GameCategory',
      id: 'GameCategory'
    }).then(data => {
      GameCategory = data.find(v => v.gameCatId + "" === gameCat.id + "");
    }).catch(() => {
      console.log("無GameCategory")
    });

    await global.storage.load({
      key: `GameProviders${gameCat.id}`,
      id: `GameProviders${gameCat.id}`,
    })
      .then((data) => {
        GameProviders = data;
      })
      .catch((err) => {
        console.log("無GameProviders")
      });


    const findGame = FP_FlashcategoryCodeMap.filter(
      (v) =>
        v.fpCode.toLocaleLowerCase() === GameCategory.gameCatCode.toLocaleLowerCase()
    )[0];

    console.log('GameCategory')
    console.log(GameCategory)
    if (
      GameCategory.gameCatCode.toLocaleLowerCase() === "slot" ||
      GameCategory.gameCatCode.toLocaleLowerCase() === "p2p" ||
      GameCategory.gameCatCode.toLocaleLowerCase() === "casino"
    ) {
      Actions.ProductGamePage({
        gameItem: GameProviders,
        category: GameCategory,
        categoryCode: findGame.flashCode,
      });
      return;
    }
    if(action.cgmsVendorCode === "VTG") {
      Actions.ProductGameDetail({
        code: "VTG",
        title: "体育",
        navTitle: "V2 虚拟体育",
        category: GameCategory,
        categoryGameCode: "Sportsbook"
      });
      return;
    }
    Actions.ProductIntro({
      gameItem: GameProviders,
      category: GameCategory,
      categoryCode: findGame.flashCode,
    });

  }

  static linkToAction = (action) => {
    console.log('action.url ',action.url)
    if (['/fishing', '/depositCTC'].includes(action.url)) {
      if (!ApiPort.UserLogin) return NavigationUtil.goToLogin(); // 先登入
      /**
       钓鱼特殊处理
       去虚拟货币特俗处理
       */
      // action.url == '/fishing' ? this.onFishingPress() : this.goCrypto()
      return;
    } else if (action.url.indexOf("event_MidAutumn2022") !== -1) {
      // 中秋活動
      PiwikAction.SendPiwik("Enter_MidAutumn2022");
      Actions.PoppingGame();
      return;
    } else if (action.url.indexOf("nationalday2022") !== -1) {
      // Golden Week
      PiwikAction.SendPiwik("Enter_NationalDay2022");
      Actions.GoldenWeek();
      return;
    } else if (action.url.indexOf("WC2022") !== -1) {
      // WCP
      PiwikAction.SendPiwik("Enter_WCPage2022");
      Actions.WorldCup();
      return;
    } else if (action.url == '/eurocup') { //歐洲杯
      PiwikEvent('Engagement Event', 'Launch', 'Enter_EUROPage');
      return Actions.EuroCup({});
    } else if (!['/fishing', '/depositCTC'].includes(action.url)) {
      if (!action.url.match(/https|http/gi)) { // 判斷url 是否帶有https, http
        Linking.openURL(SBTDomain + action.url);
      } else {
        Linking.openURL(action.url);
      }
      return;
    }
  }
}


