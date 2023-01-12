import Types from "./types";
import { Toast } from "antd-mobile-rn";
import NavigationUtil from "../../../lib/utils/NavigationUtil";
import { Actions } from "react-native-router-flux";
import { openNewWindowList, openNewWindowListAndroid, openNewWindowListIOS, sportsName, categoryAnn } from "../../../lib/data/game";
import { Toasts } from "../../../containers/Toast";
import { ACTION_SelfExclusionsPopup } from "./UserSettingAction";
import { removeVendorToken } from './../../../containers/SbSports/lib/js/util';

// 清空
export const ACTION_ClearGameInfo = () => {
  const action = {
    type: Types.ACTION_GAMES_UPDATE,
    payload: {
      url: "",
      id: 0,
      openNewPageShow: false,
    },
  };

  return action;
};

// 體育彈窗
export const ACTION_OpenSport = (code, url) => {
  console.log('Open sport', code)
  return (dispatch, getState) => {
    console.log('getState().game.openSportPopup ', getState().game.openSportPopup)
    // 避免小概率重複開啟問題
    if (getState().game.openSportPopup) {
      dispatch(ACTION_ClearOpenSport());
      return
    }

    const action = {
      type: Types.ACTION_GAMES_UPDATE,
      payload: {
        sportCode: code,
        gameCode: code,
        url,
        openSportPopup: true,
      },
    };

    return dispatch(action);
  }
};

// 清空體育
export const ACTION_ClearOpenSport = () => {
  const action = {
    type: Types.ACTION_GAMES_UPDATE,
    payload: {
      sportCode: "",
      gameCode: "",
      openSportPopup: false,
    },
  };

  return action;
};

// 啟動遊戲
// checkAnn 是否檢查公告，只有sb和keno會是true
// sportPopup 顯示體育彈窗
export function ACTION_PlayGame(gameType) {
  const { provider, gameId = null, category = "", launchGameCode = "", from } = gameType;
  const gameInfo = gameType
  // console.log('gameInfo', gameInfo);
  const gameCategory = categoryAnn[category.toLowerCase()] || "";
  return async (dispatch, getState) => {
    if (!ApiPort.UserLogin) {
      NavigationUtil.goToLogin();
      return Promise.resolve();
    }

    //自我限制
    if (getState().userSetting.selfExclusions.disableBetting) {
      console.log('game selfExclusions')
      setTimeout(() => {
        dispatch(ACTION_SelfExclusionsPopup(true));
      }, 500);
      return;
    }

    if (isGameLock) {
      Toast.fail("您的账户已被锁，请联系在线客服。", 2);
      return Promise.reject();
    }

    // let gameId = item.gameId;
    // let gameType = item.provider;
    let gameType = provider.toLocaleUpperCase();
    let params;
    if (gameType === "SBT") {
      params = {
        provider: gameType,
        isDemo: false,
        hostName: SBTDomain,
        sportsMenu: "",
        vendorQuery: "",
        mobileLobbyUrl: SBTDomain,

        bankingUrl: SBTDomain,
        logoutUrl: SBTDomain + "/accessdenied",
        sportid: "",
        eventId: "",
      };
    } else {
      params = {
        provider: gameType,
        isDemo: false,
        hostName: common_url,
        sportsMenu: "",
        vendorQuery: "",
        mobileLobbyUrl: common_url,

        bankingUrl: common_url,
        logoutUrl: common_url + "/accessdenied",
        sportid: "",
        eventId: "",
      };
    }

    if (gameId) {
      params.gameId = gameId;
    }

    //處理sb2.0遊戲token (開官方網頁版，會刷掉先前獲取的token)
    const codeToSportMapping = { 'IPSB': 'im', 'OWS': 'saba', 'SBT': 'bti' };
    const targetSport = codeToSportMapping[gameType];
    if (targetSport) {
      console.log('===removeVendorToken', targetSport);
      removeVendorToken(targetSport);
    }

    Toast.loading("正在启动游戏,请稍候...", 2000);

    return fetchRequest(ApiPort.Games + "isDemo=false&", "POST", params)
      .then((res) => {
        Toast.hide();
        let data = res.result;
        if (res.isSuccess) {
          if (data.isGameMaintenance) {
            Toasts.fail("游戏维护中,请稍候再来", 2);
            return Promise.reject();
          }
          if (data.accessDenied) {
            Toasts.fail("拒绝访问", 2);
            return Promise.reject();
          }
          if (data.gameLobbyUrl.length) {

            // 體育彈窗
            // if (sportsName.includes(provider)) {
            //   dispatch(ACTION_OpenSport(provider, data.gameLobbyUrl,));
            //   return;
            // }

            // 另開瀏覽器彈窗
            // console.log('gameCategory ', gameCategory)
            if (openNewWindowList.includes(gameType) || openNewWindowListIOS.includes(gameType) || openNewWindowListAndroid.includes(gameType)) {
              const action = {
                type: Types.ACTION_GAMES_UPDATE,
                payload: {
                  url: data.gameLobbyUrl,
                  id: gameId,
                  openNewPageShow: true,
                  gameCategory: gameCategory
                },
              };

              return dispatch(action);
            } else {

              const sceneKey = from === "sb" ? "SbAirCraftWrap" : "GamePage"
              // Actions.SBTabbar();
              Actions[sceneKey]({
                launchGameCode,
                GameOpenUrl: data.gameLobbyUrl,
                gametype: gameType,
                gameCategory: gameCategory,
                gameInfo
              });

              const action = {
                type: Types.ACTION_GAMES_UPDATE,
                payload: {
                  url: data.gameLobbyUrl,
                  id: gameId,
                  gameCategory: gameCategory
                },
              };
              return dispatch(action);
            }
          }
        } else {
          Toast.fail("Error", 2);
          return Promise.reject();
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.errors && error.errors[0] && error.errors[0].description){
          Toast.fail(error.errors[0].description);
        } else {
          Toast.fail("错误");
        }
        return Promise.reject();
      });
  };
}


//取得Game Types
export const ACTION_GameType = (res) => {
  const action = {
    type: Types.ACTION_GAMES_UPDATE,
    payload: {
      gameTypes: res,
    },
  };
  return action;
};

// Aviator遊戲資料
export const ACTION_AviatorGameData = (data) => {
  const action = {
    type: Types.ACTION_GAMES_UPDATE,
    payload: {
      sprHotGame: data
    },
  };

  return action;
};
