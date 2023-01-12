import { Toast } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";

export function   getDetail(item) {
  console.log('item ',item)
  Toast.loading("加载中,请稍候...", 200);
  fetch(`${window.WorldCup_Domain + ApiPort.worldCupNews}/${item.id}`, {
    method: "GET",
    headers: {
      token: window.CMS_token,
    },
  })
    .then(response => response.json())
    .then((res) => {
      const { data } = res;
      if (!!data) {
        Actions.WorldCupNewDetail({ newsId: item.id, data: data });
      } else {
        console.log("無資料");
      }

    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      Toast.hide();
    });
}
