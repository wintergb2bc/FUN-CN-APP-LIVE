import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  subCateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  subCateTitle: {
    color: "#212121",
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 6,
  },
  subRightText: {
    color: '#424242',
    fontSize: 12
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flexColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subCateBox: {
    marginTop: 20,
  },
  subCateHeaderLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 3,
    borderLeftColor: '#D91616',
  },
  promItemItemView: {
    width: 0.4267 * width,
    height: 0.4267 * width,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 15,
    marginLeft: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  promListItemItemView: {
    width: 0.4 * width,
    height: 0.4 * width,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 15,
    marginLeft: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  promItemImg: {
    width: 0.4267 * width,
    height: 0.2667 * width,
  },
  promListItemImg: {
    width: 0.4 * width,
    height: 0.25 * width,
  },
  promItemNameStyle: {
    color: "#1A1A1A",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 12,
    paddingVertical: 10,
    padding: 10
    // minHeight:30,
  },
});