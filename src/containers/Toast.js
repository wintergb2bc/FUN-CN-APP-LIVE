import Toast from "react-native-tiny-toast";
import React from "react";
import { Image, Text, View } from "react-native";

export const Toasts = {
  success: (msg) => {
    console.log(msg)
    Toast.show(msg || "", {
      position: DeviceInfoIos ? 45 : 20,
      containerStyle: {
        backgroundColor: "#daffe3",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 50,
        paddingHorizontal: 14,
        paddingVertical: 11,
      },
      textStyle: { color: "#34c759", paddingLeft: 5, fontSize: 13 },
      imgSource: require("../images/icon-done.png"),
      imgStyle: { height: 18, width: 18 },
    });
  },

  fail: (msg) => {
    Toast.show(msg || "", {
      position: DeviceInfoIos ? 45 : 20,
      containerStyle: {
        backgroundColor: "#ffdada",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 50,
        paddingHorizontal: 14,
        paddingVertical: 11,
      },
      textStyle: { color: "#eb2121", paddingLeft: 5, fontSize: 13 },
      imgSource: require("../images/Error.png"),
      imgStyle: { height: 18, width: 18 },
    });
  },
  error: (msg) => {
    Toast.show(msg || "", {
      position: DeviceInfoIos ? 45 : 20,
      containerStyle: {
        backgroundColor: "#ffdada",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 50,
        paddingHorizontal: 14,
        paddingVertical: 11,
      },
      textStyle: { color: "#eb2121", paddingLeft: 5, fontSize: 13 },
      imgSource: require("../images/Error.png"),
      imgStyle: { height: 18, width: 18 },
    });
  },

  info: (msg) => {
    Toast.show(msg || "", {
      position: DeviceInfoIos ? 45 : 20,
    });
  },
};

export const ToastSuccess = ({ text }) => {
  return (
    <View style={{position:'absolute', top: 70, backgroundColor: "#daffe3",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 50,
      paddingHorizontal: 14,
      paddingVertical: 11,}}>
      <Text style={{color: "#34c759", paddingLeft: 5, fontSize: 13}}>{text}</Text>
      <Image
        resizeMode="stretch"
        source={require("../images/icon-done.png")}
        style={{ width: 18, height: 18, marginLeft: 5 }}
      />
    </View>
  )
};
