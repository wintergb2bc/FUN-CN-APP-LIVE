import {fetchRequestSB} from './../../../containers/SbSports/lib/SportRequest';
import {ApiPortSB} from './../../../containers/SbSports/lib/SPORTAPI';
import Types from "./types";
import { getInitialState } from "../reducers/UserSettingReducer";

//切換 盘口显示方式
export const ACTION_UserSetting_ToggleListDisplayType = () => {
  return (dispatch, getState) => {
    let currentType = getState().userSetting.ListDisplayType;
    let newType = 2;
    if (parseInt(currentType) === 2) {
      newType = 1;
    }

    const action = {
      type: Types.ACTION_USERSETTING_UPDATE,
      payload: { ListDisplayType: newType },
    };

    //console.log('===ACTION_UserSetting_ToggleListDisplayType',action);

    const actionDispatchPromise = dispatch(action);

    if (!getState().userInfo.isLogin) return actionDispatchPromise; //沒登入不用更新

    if (typeof window !== "undefined") {
      //防抖
      const debounce = (func, wait = 5, immediate = true) => {
        return () => {
          const later = () => {
            window.ACTION_UserSetting_ToggleListDisplayType_TimeOut = null;
            if (!immediate && func) func();
          };
          const callNow =
            immediate &&
            !window.ACTION_UserSetting_ToggleListDisplayType_TimeOut;
          clearTimeout(window.ACTION_UserSetting_ToggleListDisplayType_TimeOut);
          window.ACTION_UserSetting_ToggleListDisplayType_TimeOut = setTimeout(
            later,
            wait
          );
          if (callNow && func) func();
        };
      };

      //配置 更新到服務器
      const UpdateServerSetting = (newSettings) => {
        //console.log('====newSettings', newSettings);

        //獲取memberCode
        const localMemberInfoJSON = localStorage.getItem("memberInfo");
        let localMemberInfo = {};
        if (localMemberInfoJSON) {
          localMemberInfo = JSON.parse(localMemberInfoJSON);
        }
        let memberCode = localMemberInfo["memberCode"];
        if (memberCode) {
          const defaultSetting = {
            amount1: 99999,
            amount2: 1000,
            amount3: 100,
            oddsType: "HK",
            alwaysAcceptBetterOdds: true,
            betSlipVibration: false,
            betSlipSound: false,
            goalNotification: true,
            goalMyFavorite: true,
            goalIBet: true,
            goalAllRB: false,
            goalSound: true,
            goalSoundType: 1,
            goalVibration: true,
            listDisplayType: 1,
          };

          let updateData = defaultSetting;

          const jsonString = localStorage.getItem(
            "NotificationSetting-" + memberCode
          );
          if (jsonString) {
            const jsonData = JSON.parse(jsonString);
            if (jsonData) {
              updateData = Object.assign(
                {},
                defaultSetting,
                jsonData,
                newSettings
              );
            }
          }

          //console.log('====updateData', JSON.parse(JSON.stringify(updateData)));

          fetchRequestSB(
            ApiPortSB.EditMemberNotificationSetting,
            "POST",
            updateData
          )
            .then((res) => {
              if (res.isSuccess == true) {
                //更新緩存
                localStorage.setItem(
                  "NotificationSetting-" + res.result.memberCode,
                  JSON.stringify(updateData)
                );
              }
            })
            .catch((err) => {
              // console.log('API:' + ApiPort.EditMemberNotificationSetting + ' has error: ' + err);
            });
        }
      };

      //防抖2秒，避免用戶切著玩
      const UpdateServerSettingWithDebounce = debounce(
        () => UpdateServerSetting({ listDisplayType: newType }),
        2000,
        false
      );
      UpdateServerSettingWithDebounce();
    }

    return actionDispatchPromise;
  };
};

//手機號前綴
export const ACTION_PhoneSetting_Update = (phonePrefix) => {
  const action = {
    type: Types.ACTION_USERSETTING_UPDATE,
    payload: { phonePrefix: phonePrefix },
  };

  return action;
};

//用戶設置變更
export const ACTION_UserSetting_Update = (newSetting) => {
  const action = {
    type: Types.ACTION_USERSETTING_UPDATE,
    payload: newSetting,
  };

  return action;
};

//自我限制
export const ACTION_SelfExclusionsAction = () => {
  return (dispatch, getState) => {
    global.storage.remove({
      key: "SelfExclusionRestriction",
      id: "SelfExclusionRestriction"
    });
    window.SelfExclusionRestriction = false
    fetchRequest(ApiPort.SelfExclusions, "GET")
      .then((res) => {
        let result = res.result || ''
        if (res.isSuccess) {
          
          //是否自我锁定账户  自我锁定,投注锁定，存款锁定，转账锁定
          if (result.disableDeposit || result.disableFundIn || result.disableBetting){
            window.SelfExclusionRestriction = {
              DisableBetting: result.disableBetting || false,
              DisableDeposit: result.disableDeposit || false,
              DisableFundIn: result.disableFundIn || false,
            }

            global.storage.save({
              key: 'SelfExclusionRestriction',
              id: 'SelfExclusionRestriction',
              data: res.result,
              expires: null
            }); 
          }
          
          return dispatch({
            type: Types.ACTION_USERSETTING_UPDATE,
            payload: { selfExclusions: res.result || getInitialState().selfExclusions },
          });
        }
      })
      .catch((err) => {});
  };
};

// 自我限制彈窗
export const ACTION_SelfExclusionsPopup = (open = false) => {
  console.log('ACTION_CloseSelfExclusions')
  let action = {
    type: Types.ACTION_USERSETTING_UPDATE,
    payload: {
      selfExclusionsPopup: open
    },
  };


  return action;
};


//清空
export const ACTION_ClearSelfExclusions = () => {
  const action = {
    type: Types.ACTION_USERSETTING_UPDATE,
    payload: { selfExclusions: getInitialState().selfExclusions },
  };
  return action;
};

export const ACTION_SBTransferPopup = (flag) => {
  return (dispatch, getState) => {
    const action = {
      type: Types.ACTION_USERSETTING_UPDATE,
      payload: { sbTransferPopup: flag === 'close' ? false : !getState().userSetting.sbTransferPopup },
    };
    return dispatch(action);
  }
};
