import { Toast } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";

export const helpCenterDetail = (id) => {
  Toast.loading("加载中,请稍候...", 200);
  fetch(CMS_Domain + ApiPort.CMS_HelpCenterDetail + id, {
    method: "GET",
    headers: {
      token: CMS_token,
    },
  })
    .then((response) => (headerData = response.json()))
    .then((data) => {
      Toast.hide();
      if (data[0] && data[0].body) {
        Actions.HelpDetail({ htmlContent: data[0] });
      } else {
        Toast.fail("加载失败，请重试", 2);
      }
    })
    .catch((error) => Toast.hide());
};
