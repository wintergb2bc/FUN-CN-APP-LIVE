import { getInitialState } from "../reducers/UserInfoReducer";
// import { fetchRequest } from '$LIB/SportRequest';
import { Decimal } from "decimal.js";
import Types from "./types";
//用戶登入
export const ACTION_UserInfo_login = (username) => {
  const payload = { ...getInitialState(), isLogin: true, username: username };
  const action = {
    type: Types.ACTION_USERINFO_UPDATE,
    payload: payload,
  };
  return action;
};

//用戶登出
export const ACTION_UserInfo_logout = () => {
  const action = {
    type: Types.ACTION_USERINFO_UPDATE,
    payload: getInitialState(),
  };

  return action;
};

// 更新用戶資料
export const ACTION_UserInfo_updateMemberInfo = (res) => {
  const action = {
    type: Types.ACTION_USERINFO_UPDATE,
    payload: {
      memberInfo: res && res.memberInfo ? res.memberInfo : {},
      memberNewInfo: res && res.memberNewInfo ? res.memberNewInfo : {},
    },
  };
  return action;
};

export const ACTION_UserInfo_updateBalance = (newBalance) => {
  const action = {
    type: Types.ACTION_USERINFO_UPDATE,
    payload: { balanceTotal: newBalance },
  };
  return action;
};

//查詢SB餘額(因為需要展示 總餘額，所以這個API直接 改查全部餘額)
export const ACTION_UserInfo_getBalanceSB = (forceUpdate = false) => {
  //直接改查全部
  return ACTION_UserInfo_getBalanceAll(forceUpdate);
};

//查詢全部餘額
export function ACTION_UserInfo_getBalanceAll(forceUpdate = false) {
  console.log("ACTION_UserInfo_getBalanceAll");
  return (dispatch, getState) => {
    console.log("ACTION_UserInfo_getBalanceAll 1 ", ApiPort.UserLogin);
    if (!ApiPort.UserLogin) return Promise.resolve(); //沒登入不用處理
    console.log("ACTION_UserInfo_getBalanceAll 2");
    //10秒節流，避免短時間頻繁調用
    if (global._getBalanceAll_throttle_handle && !forceUpdate) {
      //console.log('===太頻繁...跳過getBalanceAll...')
      return Promise.resolve();
    }
    console.log("ACTION_UserInfo_getBalanceAll 3");
    if (!forceUpdate) {
      global._getBalanceAll_throttle_handle = setTimeout(function () {
        clearTimeout(global._getBalanceAll_throttle_handle);
        global._getBalanceAll_throttle_handle = null;
        //console.log('===clear getBalanceAll handle', JSON.stringify(global._getBalanceAll_throttle_handle));
      }, 10 * 1000); //10秒節流
    }
    console.log("ACTION_UserInfo_getBalanceAll 4");
    const updateGettingBalance = {
      type: Types.ACTION_USERINFO_UPDATE,
      payload: { isGettingBalance: true },
    };
    dispatch(updateGettingBalance);
    return fetchRequest(ApiPort.Balance, "GET")
      .then((res) => {
        let payload = {
          allBalance: [],
          balanceTotal: 0,
          balanceSB: 0,
          isGettingBalance: false,
        };

        if (res && res.result && res.result.length > 0) {
          let data = res.result;

          payload.allBalance = res.result;
          //返回是數組
          //balance: 3795.51
          //category: "TotalBal"
          //localizedName: "总余额"
          //name: "TotalBal"
          //state: "Available"

          const safeNumber = (x, precision = 2) => {
            if (!x) {
              return 0;
            }

            return new Decimal(
              new Decimal(x).toFixed(precision).toString()
            ).toNumber();
          };

          //順便更新 總餘額 和 sb餘額
          data.map((item) => {
            item.balance = safeNumber(item.balance);

            //更新總餘額
            if (item && item.name && item.name.toUpperCase() === "TOTALBAL") {
              payload.balanceTotal = item.balance;
            }
            //更新主账户
            if (item && item.name && item.name.toUpperCase() === "MAIN") {
              window.MAIN = item.balance;
            }
            ///更新sb餘額
            if (item && item.name && item.name.toUpperCase() === "SB") {
              payload.balanceSB = item.balance;
            }
          });
        }

        const action = {
          type: Types.ACTION_USERINFO_UPDATE,
          payload: payload,
        };

        return dispatch(action);
      })
      .catch((error) => {
        const updateGettingBalance = {
          type: Types.ACTION_USERINFO_UPDATE,
          payload: { isGettingBalance: false },
        };
        return dispatch(updateGettingBalance);
      });
  };
}
