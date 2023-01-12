import { Actions } from "react-native-router-flux";
import PiwikAction from "./piwik";
const needLogin = ["DepositCenter", "Transfer", "News", "recordes", "setPush"];
/**
 * 全域跳轉工具類 by AndyTsai
 */
export default class NavigationUtil {
  /**
   * 跳轉指定頁
   * @param params 傳遞的參數
   * @param pageKey 頁面名
   **/
  static goPage(page, params) {
    if (!page) {
      console.log("page can not be null");
      return;
    }

    // 需要先登入的頁面
    if (needLogin.find((v) => v === page)) {
      if (!window.ApiPort.UserLogin) {
        Actions.Login();
        return;
      }

      PiwikAction.SendPiwik(page);
      Actions[page](params);
    } else {
      PiwikAction.SendPiwik(page);
      Actions[page](params);
    }
  }

  /**
   * 返回上一页
   * @param navigation
   */
  static goBack() {
    Actions.pop();
  }

  /**
   * 首页
   */
  static goToHome() {
    Actions.home1();
  }

  /**
   * 登录
   */
  static goToLogin(params) {
    Actions.Login(params);
  }

  /**
   * 註冊
   */
  static goToRegister() {
    Actions.Login({ tabType: "register" });
  }
}
