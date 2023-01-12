import {
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const calcWidth1 =  (width - 16*5)/2  //(100vh - 16*5) 再除以2

const styles = StyleSheet.create({
  //提前兌現按鈕區 負責下半部圓角
  cashoutButtonBox: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 8,
    padding: 16,
    paddingTop: 0,
  },
  cashoutButtonBoxEmpty: {
    padding: 0,
  },

  //按鈕包裹
  cashoutButtonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFF4",
    borderRadius: 8,
    minHeight: 44,
  },

    //提交按鈕
  cashoutButtonNotyet: {
    backgroundColor: "#00A6FF",
  },
  cashoutButtonNotyetBlock: {
    backgroundColor: "#EFEFF4",
    color: "#000",
  },
  cashoutButtonNotyetText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: 'bold',
  },

    //提交前 重複確認
  cashoutButtonConfirmingBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
  },
  cashoutButtonConfirmingMoney: {
    color:"#00A6FF",
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 28,
  },
  cashoutButtonConfirmingText: {
    color:"#000000",
    fontSize: 14,
    lineHeight: 28,
  },
  cashoutButtonConfirmingButtonBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  cashoutButtonConfirmingButton: {
    minHeight: 44,
    width: calcWidth1,
    //border: "1px #00A6FF solid",
    borderWidth:1,
    borderColor: "#00A6FF",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cashoutButtonConfirmingButtonCancel: {
    backgroundColor: "#EFEFF4",
    marginRight: 8,
  },
  cashoutButtonConfirmingButtonCancelText: {
    color: "#00A6FF",
    fontSize: 16,
  },
  cashoutButtonConfirmingButtonSubmit: {
    backgroundColor: "#00A6FF",
    marginLeft: 8,
  },
  cashoutButtonConfirmingButtonSubmitText: {
    color: "#ffffff",
    fontSize: 16,
  },

  //新價格
  cashoutButtonNewpriceBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
  },
  cashoutButtonNewpriceMoney: {
    color:"#00A6FF",
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 28,
  },
  cashoutButtonNewpriceText: {
    color:"#000000",
    fontSize: 14,
    lineHeight: 28,
  },
  cashoutButtonNewpriceButtonBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  cashoutButtonNewpriceButton: {
    minHeight: 44,
    width: calcWidth1,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cashoutButtonNewpriceButtonDecline: {
    backgroundColor: "#F00001",
    marginRight: 8,
  },
  cashoutButtonConfirmingButtonDeclineText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  cashoutButtonNewpriceButtonAccept: {
    backgroundColor: "#34C75D",
    marginLeft: 8,
  },
  cashoutButtonNewpriceButtonAcceptText: {
    color: "#FFFFFF",
    fontSize: 16,
  },

    //處理中
  cashoutButtonProcessBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cashoutButtonProcessText: {
    marginLeft: 8,
    color: "#999999",
    fontSize:16,
  },

    //成功
  cashoutButtonDoneBox: {
    backgroundColor: "#DBFDD9",
  },
  cashoutButtonDoneText: {
    color: "#0CCC3C",
    fontSize:16,
  },
    //失敗
  cashoutButtonFailBox: {
    backgroundColor: "#FF252529",
  },
  cashoutButtonFailText: {
    color: "#F00001",
    fontSize:16,
  },
    //拒絕
  cashoutButtonDeclineBox: {
    backgroundColor: "#FF252529",
  },
  cashoutButtonDeclineText: {
    color: "#F00001",
    fontSize:16,
  },

  //提前兌現 彈窗
  cashoutPopup: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 21,
    width: width-16*2,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  cashoutPopupProgress: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 5,
    backgroundColor: "#00A6FF",
  },
  cashoutPopupWager: {
    padding: 0,
  },
  cashoutPopupStatusBox: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 24,
    height: 29,
  },
  cashoutPopupStatusText: {
    fontSize: 12,
  },
  cashoutPopupStatusGreenBg: {
    backgroundColor: "#DBFDD9",
  },
  cashoutPopupStatusGreenText: {
    color:"#0CCC3C",
  },
  cashoutPopupStatusRedBg: {
    backgroundColor: "#FF252529",
  },
  cashoutPopupStatusRedText: {
    color: "#F00001",
  },

  cashoutPopupButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00A6FF",
    borderRadius: 8,
    minHeight: 44,
    alignSelf: "center",
    width: width - 16*4,
    marginBottom: 12,
  },
  cashoutPopupButtonText: {
    fontSize: 16,
    color: "#fff",
  },


//過濾數據按鈕
  cashoutFilterButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    margin: 16,
    // marginTop: 8,
    marginBottom: 8,
    height: 50,
    // padding: "0 16",
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderRadius: 8,
    color: "#666666",
    width: width - 16*2,
  },

  //投注記錄頁的style
  betRecordsEmpty: {
    width: "100%",
    height: height - 250,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  betRecordsEmptyImg: {
    width: 98,
    height: 98,
  },
  betRecordsEmptyText: {
    color: "#BCBEC3",
    fontSize: 14,
    marginTop: 16,
  },

  cashoutResultBox: {
    borderRadius: 16,
    backgroundColor: "#DBFDD9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    minWidth: 72,
    //padding: "6 12",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cashoutResultBoxText: {
    color: "#0CCC3C",
    fontSize: 12,
    lineHeight: 17
  }
});

export default styles;
