import { Toasts } from "../Toast";

const errCodeMap = {
  // MEM00041: "邮箱地址已注册",
  // MEM00026: "用户名已注册",
  // VAL03012: "用户名不存在",
  MEM00145: "地区访问限制",
  GEN0005: "重复登录,系统检测到您重复登录",
  GEN0006: "请重新登录,访问过期",
  GEN0002: "地区访问限制",
  GEN0001: "系统正在更新中，请您稍后再尝试登入",
  // VAL08005: "用戶名已存在",
};

/**
 * 錯誤處理
 * @param errObj api返回的object
 * @param customError 如果api沒有錯誤訊息，指定錯誤訊息
 **/
export const errCodeHandle = (errObj, customError = "") => {
  /** {
    errObj預期格式
    errors: [{}],
   isSuccess: false
  }
   **/

  if (errObj.errors && errObj.errors[0]) {
    let getDesc = errObj.errors[0].description;
    let getErrCode = errObj.errors[0].errorCode;
    
    if (errCodeMap[getErrCode]) {
      Toasts.fail(errCodeMap[getErrCode], 2);
      return;
    }
    
    Toasts.fail(getDesc, 2);
    
  } else {
    if (customError !== "") {
      Toasts.fail(customError, 2);
      return;
    }
    Toasts.fail('Error', 2);
  }
};
