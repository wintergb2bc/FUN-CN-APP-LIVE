import { Toast } from "antd-mobile-rn";
import Types from "./types";
import { initialState } from "../reducers/AnnouncementReducer";
import { ACTION_OpenSport } from "./GameAction";


/**
 * @param optionType optionType，必傳 公告api需要
 * @param gameData 關公告彈窗後，才開遊戲的要傳
 * @param showLoading 是否顯示loading效果
 */
export function ACTION_GetAnnouncement(optionType, showLoading = false, gameData={}) {
  console.log("獲取公告 ",optionType)
  return (dispatch, getState) => {
    if (!ApiPort.UserLogin) {
      return Promise.resolve();
    }
    // 已經彈過公告
    if(getState().announcement[`${optionType.toLowerCase()}AnnouncementClose`]) { 
      if(optionType.toLowerCase() === "sportsbook"){
        dispatch(ACTION_OpenSport(gameData?.provider));
      }
      return;
    }
    
    global.storage.load({
      key: `ann${getState().userInfo.username}`,
      id: optionType.toLowerCase(),
    }).then(data => {
      console.log('公告不再顯示 ',data)
      console.log('gameData ',gameData)
      console.log('optionType ',optionType)
      if(optionType.toLowerCase() === "sportsbook"){
        dispatch(ACTION_OpenSport(gameData?.provider));
      }
    }).catch(() => {
      showLoading && Toast.loading("加载中");
      fetchRequest(`${ApiPort.AnnouncementPopup}optionType=${optionType}&`, "GET")
        .then((res) => {
          showLoading && Toast.hide();
          //無公告
          if(!res.result || Object.keys(res.result).length === 0){
            console.log('optionType ',optionType)
            if(optionType.toLowerCase() === "sportsbook"){
              dispatch(ACTION_OpenSport(gameData?.provider));
            }
            return; 
          }
          if (res.result) {
            const { content, topic, updatedAt } = res.result;
            // redux 傳入資料 通知開啟彈窗
            dispatch(ACTION_OpenAnnouncementPopup( { content, topic, updatedAt }, optionType.toLowerCase(), gameData));
          }
        });
    });
  };
}

// 公告彈窗
export const ACTION_OpenAnnouncementPopup = (data, optionType, gameData) => {
  return (dispatch, getState) => {
    const action = {
      type: Types.ACTION_ANNOUNCEMENT_UPDATE,
      payload: {
        optionType,
        announcementPopup: true,
        announcementData: data,
        gameData
      },
    };
    return dispatch(action);
  }
};

// 公告彈窗關閉
export const ACTION_CloseAnnouncementPopup = () => {
  return (dispatch, getState) => {
    let data = {
      announcementPopup: false,
      optionType: "",
      announcementData: initialState.announcementData, 
      [`${getState().announcement.optionType.toLowerCase()}AnnouncementClose`]: true
    };
    const action = {
      type: Types.ACTION_ANNOUNCEMENT_UPDATE,
      payload: data,
    };
    return dispatch(action);
  };
};

//清空
export const ACTION_ClearAnnouncement = () => {
  return {
    type: Types.ACTION_ANNOUNCEMENT_CLEAR
  };
};
