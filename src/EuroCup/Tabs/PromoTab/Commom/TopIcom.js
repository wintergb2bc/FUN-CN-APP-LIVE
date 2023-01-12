import {
  StyleSheet,
  Image,
} from "react-native";
import React from 'react';
import Touch from "react-native-touch-once";

export const TopIconComp = (props) => (
  <Touch
    style={[styles.topIconView, props.propsWrap]}
    onPress={() => props.triggerScrollTop()}
    onPressIn={() => props.triggerScrollTop()}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Image
      style={props.style?props.style:styles.topIconImg}
      source={props.icon?props.icon:require("../../../../images/icon/btnUp.png")}
    />
  </Touch>
);

const styles = StyleSheet.create({
  tabTxt: {
    fontSize: 14,
    color: "#FFFFFFCC",
  },
  activeTabTxt: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  promoHeader: {
    backgroundColor: "#00A6FF",
    paddingHorizontal: 20,
    position: "relative",
    // zIndex: 99999,
    paddingTop: 10,
  },
  tabsView: {
    alignItems: "center",
    flexDirection: "row",
    // paddingBottom: 19,
  },
  topIconView: {
    position: "absolute",
    right: 10,
    bottom: 30,
    width: 44,
    height: 44,
  },
  topIconImg: {
    width: 44,
    height: 44,
  },
});
