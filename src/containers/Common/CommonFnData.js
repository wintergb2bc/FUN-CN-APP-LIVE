import { Toast } from "antd-mobile-rn";
import NavigationUtil from "../../lib/utils/NavigationUtil";
import { Linking } from "react-native";
import { Actions } from "react-native-router-flux";
import { StyleSheet, Dimensions, Platform } from 'react-native'

export const getBanner = (key, callback) => {
  // banner of deposit page and withdrawal page
  const login = ApiPort.UserLogin ? "after" : "before";
  const URL = key;

  // Toast.loading("加载中...", 10);
  fetch(`${CMS_Domain + ApiPort.CMS_BannerCategory}/${URL}?login=${login}`, {
    method: "GET",
    headers: { token: CMS_token },
  })
    .then((response) => response.json())
    .then((data) => {
      Toast.hide();
      if (data && data.length) callback(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getPromotionContent = (promotionId = null, callback) => {
  // 优惠内容
  Toast.loading("加载中...", 10);
  const pid = promotionId ? `?id=${promotionId}` : "";
  fetch(`${CMS_Domain + ApiPort.CMS_Promotion}${pid}`, {
    method: "GET",
    headers: { token: CMS_token },
  })
    .then((response) => response.json())
    .then((data) => {
      Toast.hide();
      callback(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getMemberWithdrawalThreshold = (callback) => {
  // 銀行帳戶限額信息
  return fetchRequest(ApiPort.MemberWithdrawalThreshold, "GET").then((res) => {
    if (res.result != undefined) {
      const amount = (res.result.withdrawalThresholdAmount + "").replace(
        /\d{1,3}(?=(\d{3})+$)/g,
        "$&,"
      ); // 千分位
      const count = (res.result.withdrawalThresholdCount + "").replace(
        /\d{1,3}(?=(\d{3})+$)/g,
        "$&,"
      ); // 千分位
      callback(count, amount, res.result.threshold);
    }
  });
};

export const getMoneyFormat = (number) => {
  // 轉千分位
  let newNumber = number + "";
  if (newNumber.includes(".")) {
    // 判斷有無浮點數
    return newNumber.replace(/(\d{1,3})(?=(\d{3})+\.)/g, "$1,");
  } else {
    return newNumber.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
  }
};

export const getTotalBal = (key, callback) => {
  //餘額
  key == "login" && Toast.loading("余额刷新中", 200);
  fetchRequest(ApiPort.Balance, "GET")
    .then((res) => {
      Toast.hide();
      const data = res.result;
      if (data != undefined) {
        allBalance = data;
        console.log("allBalance", allBalance);
        data.map(function (item, index) {
          if (item.name == "TotalBal") {
            TotalBal = item.balance;
          } else if (item.name == "IPSB") {
            IPSB = item.balance;
          } else if (item.name == "MAIN") {
            MAIN = item.balance;
          } else if (item.name == "LD") {
            // LD ＝ 娛樂場 casino
            LD = item.balance;
          } else if (item.name == "SLOT") {
            SLOT = item.balance;
          } else if (item.name == "SB") {
            SB = item.balance;
          } else if (item.name == "CMD") {
            CMD = item.balance;
          } else if (item.name == "PT") {
            PT = item.balance;
          } else if (item.name == "AG") {
            AG = item.balance;
          } else if (item.name == "P2P") {
            P2P = item.balance;
          } else if (item.name == "SGW") {
            SGW = item.balance;
          }
        });
      }

      // if (TotalBal > 0) {
      //   // 总余额大于o,打开游戏时不用提醒充值
      //   // this.setState({ skipDepoPopup: true });
      // }
      callback(data);
      // this.setState({ homeTotalBal: TotalBal })
      //充值的余额显示
      // window.setTotalBalData && window.setTotalBalData(TotalBal, MAIN)
    })
    .catch((error) => {
      Toast.hide();
    });
};

export const ImagePickerOption = {
  title: '选择图片', //TODO:CN-DONE 选择图片
  cancelButtonTitle: '取消', //TODO:CN-DONE 取消
  chooseFromLibraryButtonTitle: '选择图片', //TODO:CN-DONE 选择图片
  cameraType: 'back',
  mediaType: Platform.OS == 'ios' ? 'photo' : 'mixed',
  videoQuality: 'high',
  durationLimit: 10,
  maxWidth: 1200,
  maxHeight: 2800,
  quality: 1,
  angle: 0,
  allowsEditing: false,
  noData: false,
  storageOptions: {
    skipBackup: true
  },
  includeBase64: true,
  saveToPhotos: true
}

// const ImagePickerOption = {
//   title: '选择图片', //TODO:CN-DONE 选择图片
//   cancelButtonTitle: '取消', //TODO:CN-DONE 取消
//   chooseFromLibraryButtonTitle: '确认', //TODO:CN-DONE 选择图片
//   takePhotoButtonTitle: '拍照', //拍照
//   cameraType: 'back',
//   mediaType: Platform.OS == 'ios' ? 'photo' : 'mixed',
//   videoQuality: 'high',
//   durationLimit: 10,
//   maxWidth: 1200,
//   maxHeight: 2800,
//   quality: 1,
//   angle: 0,
//   allowsEditing: false,
//   noData: false,
//   storageOptions: {
//     skipBackup: true,
//     cameraRoll: true, // 拍照後先儲存
//     waitUntilSaved: Platform.OS == 'ios' ? true : false, // 儲存後才能獲取圖片; android 若為true無法使用拍照功能
//   },
//   includeBase64: true,
//   saveToPhotos: true
// }
