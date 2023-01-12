import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  loginTouch: {
    width: 18,
    height: 18,
    borderWidth: 5,
    borderColor: '#00A6FF',
    borderRadius: 30,
  },
  setDefual: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#BCBEC3',
    borderRadius: 30,
  },
  setTouch: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
  },
  setLogin: {
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  bgView: {
    height: width * 0.752,
    width: width,
    top: 0,
    left: 0,
  },
  bgFFF: {
    position: 'relative',
    top: -20,
    left: 0,
    width:  width,
    height: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff'
  },
  loginNav: {
    width: width,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    padding: 15,
  },
  loginView: {
    top: -10,
    backgroundColor: '#fff',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    padding: 20,
    width: width,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImg: {
    width: width / 1.2,
    alignItems: "center",
    marginBottom: 15,
    marginTop: 15,
  },
  modalTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 40
  },
  modals: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalView: {
    width: width / 1.1,
    // height: height / 3,
    backgroundColor: "#fff",
    padding: 20,
  },
  errMsg: {
    borderRadius: 5,
    backgroundColor: '#FEE5E5',
    marginBottom: 15,
    paddingLeft: 15,
    width: width - 40,
  },
  inputView: {
    borderRadius: 8,
    borderColor: '#E6E6EB',
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    width: width - 40,
    marginBottom: 30,
  },
  eyesBtn: {
    position: 'absolute',
    right: 15,
  },
  input: {
    width: width * 0.75,
    height: 40,
    color: '#000000',
    textAlign: 'left',
    paddingLeft: 15,
    fontSize: 14,
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: height
  },
  validation: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  titleTxt: {
    color: "#000",
    lineHeight: 25,
    padding: 20,
    textAlign: "center",
  },
  username: {
    color: "#fff",
    lineHeight: 35,
    textAlign: "center"
  },
  passInput: {
    borderBottomColor: "#a8a8a8",
    borderBottomWidth: 1,
    marginTop: 15
  },
  onBtn: {
    backgroundColor: "#01623a",
    borderRadius: 30,
    width: width - 30,
    marginTop: 35
  },
  okBtnTxt: {
    color: "#fff",
    lineHeight: 40,
    textAlign: "center"
  },
  patternTxt: {
    display: "flex",
    position: "absolute",
    width: width,
    alignItems: "center",
    zIndex: 11
  },
  inputBoxView: {
    width: "100%",
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  flexBox: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E6E6EB",
    borderRadius: 10,
    marginVertical: 5
  },
  flexLabel: {
    flexDirection: "row",
    flex: 1,
    // width:100,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  flexRegLabel: {
    flexDirection: "row",
    flex: 1.5,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  textInputLabel: {
    // position: "absolute",
    // left: 15,
    // top: 20,
    color: "#fff",
    alignSelf: "center"
  },
  flexItem: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: Platform.OS == "android" ? 0 : 15,
    paddingBottom: Platform.OS == "android" ? 0 : 15,
    flex: 4
  },
  inputStyle: {
    // width: width - 45,
    color: "rgba(240, 240, 242, 1)",
    textAlign: "left",
    // paddingTop: 15,
    // paddingBottom: 15,
    paddingLeft: 15,
    // marginTop: 5,
    // borderBottomWidth: 1,
    // borderColor: "#9e9e9e",
    fontSize: 14
  },

  submitButton: {
    width: "100%",
    borderWidth: 0,
    // borderRadius: 40,
    backgroundColor: "#EFEFF4",
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 85
  },

  submitButtonText: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontSize: 14
  },
  backButton: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#FFFFFF80",

    // backgroundColor: "#F92D2D",
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10
  },
  backButtonText: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontSize: 14
  },
  successModal: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  },
  successModalView: {
    width: 0.3 * width,
    height: 0.3 * width,
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#000000",
    borderRadius: 10
  },
  iconDone: {
    width: 20,
    height: 20,
    alignSelf: "flex-end"
  },
  patternActiveModal: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  },
  patternActiveModalView: {
    // justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 10,
    width: 0.85 * width,
    // height:0.6*height,
    backgroundColor: "#fff",
    paddingVertical: 10
  },
  PasswordGestureStyle: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 0.78 * width,
    height: 0.78 * width
    // borderRadius: 10,
  },
  closeBtnStyle: {
    alignSelf: "flex-end",
    right: 20
  },
  closeTextStyle: {
    // width: 15,
    // height:15
    color: "#999999",
    fontSize: 15
  },
  stepTitle: {
    textAlign: "center",
    color: "#222222",
    fontSize: 16,
    top: -10
  },
  stepTint: {
    textAlign: "center",
    color: "#220000",
    fontSize: 14
  },
  stepWrongTint: {
    textAlign: "center",
    color: "#F92D2D",
    fontSize: 12
  },
  logPopupBtns: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around"
    // marginTop: 30
  },
  logPopupBtn1: {
    width: 0.3 * width,
    borderRadius: 20,

    paddingVertical: 10,
    marginHorizontal: 10
  },
  logPopupBtnText1: {
    color: "#666666",
    fontSize: 14,

    textAlign: "center"
  },
  logPopupBtn2: {
    width: 0.3 * width,
    backgroundColor: "#F92D2D",
    borderRadius: 20,

    paddingVertical: 10
  },
  logPopupBtnText2: {
    color: "#fff",
    fontSize: 14,

    textAlign: "center"
  },
  validaeSuccessModal: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  validaeSuccessModalView: {
    // justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 10,
    width: 0.85 * width,
    // height:0.6*height,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  validaeSuccessTitle: {
    textAlign: "center",
    color: "#222222",
    fontSize: 16,
    fontWeight: "bold"
    // top: -10
  },
  validaeSuccessTint: {
    textAlign: "center",
    color: "#222222",
    fontSize: 14,
    marginVertical: 30,
  },
  validaeSuccessBtn: {
    width: 0.3 * width,
    backgroundColor: "#F92D2D",
    borderRadius: 20,

    paddingVertical: 10
  },
  validaeSuccessBtnText: {
    color: "#fff",
    fontSize: 14,

    textAlign: "center"
  },

  checkBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkList: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
    width: (width - 60) / 2.1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    borderRadius: 10,
  },
  bonusList: {
    width: 20,
    height: 20,
    borderRadius: 40,
    borderWidth: 2,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  secussModal: {
    // width: width / 1.2,
    // height: height / 3,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputRow: {
    height: 45,
    display: 'flex',
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
  },
});
