import React from "react";
import { Text, View, StyleSheet } from "react-native";

/**
 * 提示訊息
 **/
const PromptBox = ({ type, msg, containerStyle = {}, textStyle = {} }) => {
  return type === "info" ? (
    <View
      style={[
        styles.container,
        containerStyle,
        {
          backgroundColor: "#FFF5BF",
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: "#83630B",
          },
          textStyle,
        ]}
      >
        {msg}
      </Text>
    </View>
  ) : type === "hint" ? (
    <View
      style={[
        styles.container,
        containerStyle,
        {
          backgroundColor: "#D6F0FF",
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          textStyle,
          {
            color: "#00A6FF",
          },
        ]}
      >
        {msg}
      </Text>
    </View>
  ) : type === "error" ? (
    <View
      style={[
        styles.container,
        containerStyle,
        {
          backgroundColor: "#FEE0E0",
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          textStyle,
          {
            color: "#EB2121",
          },
        ]}
      >
        {msg}
      </Text>
    </View>
  ) : null;
};

export default PromptBox;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  text: {
    fontSize: 12,
    padding: 12,
    lineHeight: 20,
  },
});
