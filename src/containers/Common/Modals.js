import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  Image,
  View,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
  FlatList,
} from "react-native";
import { Flex, Modal } from "antd-mobile-rn";
const { width, height } = Dimensions.get("window");

export default class CommonModals {
  // 兩按鈕，帶有驚嘆號
  static ExclamationModal({
    desc,
    onPressLeft,
    onPressRight,
    leftText,
    rightText,
    closeModal,
    visible,
  }) {
    return (
      <Modal
        visible={visible}
        style={{ padding: 0, width: width / 1.3, borderRadius: 10 }}
        transparent
        maskClosable={true}
        onClose={()=> {
          closeModal();
        }}
      >
        <View style={styles.successModal}>
          <View>
            <Image
              resizeMode="stretch"
              source={require("../../images/icon/exclamation.png")}
              style={{ width: 60, height: 60 }}
            />
          </View>
          <Text style={{ color: "#222222", paddingTop: 32, paddingBottom: 24 }}>
            {desc}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                onPressLeft();
              }}
              style={{
                height: 40,
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#00A6FF",
                borderRadius: 8,
                marginRight: 10,
                width: 120,
              }}
            >
              <Text style={{ color: "#00A6FF", textAlign: "center" }}>
                {leftText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onPressRight();
              }}
              style={{
                height: 40,
                justifyContent: "center",
                backgroundColor: "#00A6FF",
                borderRadius: 8,
                marginLeft: 10,
                width: 120,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                {rightText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // 單按鈕，帶有驚嘆號
  static ExclamationSingleModal({ desc, title, onPress, btnText, visible }) {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        style={{ padding: 0, width: width / 1.3, borderRadius: 10 }}
      >
        <View style={styles.successModal}>
          <View>
            <Image
              resizeMode="stretch"
              source={require("../../images/icon/exclamation.png")}
              style={{ width: 60, height: 60 }}
            />
          </View>
          {!!title && (
            <Text
              style={{ color: "#222222", paddingTop: 20, fontSize: 18, fontWeight: 'bold' }}
            >
              {title}
            </Text>
          )}
          <Text style={{ color: "#222222", paddingTop: 8, paddingBottom: 24 }}>
            {desc}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                onPress();
              }}
              style={{
                height: 40,
                justifyContent: "center",
                backgroundColor: "#00A6FF",
                borderRadius: 8,
                marginLeft: 10,
                width: 120,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                {btnText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // 兩按鈕基本款
  static InfoModal({
    desc,
    onPressLeft,
    onPressRight,
    leftText,
    rightText,
    visible,
    title,
  }) {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        style={{
          padding: 0,
          width: width / 1.3,
          borderRadius: 10,
          paddingTop: 0,
        }}
      >
        <View
          style={{
            backgroundColor: "#00A6FF",
            height: 44,
            marginHorizontal: -15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff" }}>{title}</Text>
        </View>
        <View style={styles.successModal}>
          <Text style={{ color: "#222222", paddingTop: 32, paddingBottom: 24 }}>
            {desc}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                onPressLeft();
              }}
              style={{
                height: 40,
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#00A6FF",
                borderRadius: 8,
                marginRight: 10,
                width: 120,
              }}
            >
              <Text style={{ color: "#00A6FF", textAlign: "center" }}>
                {leftText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onPressRight();
              }}
              style={{
                height: 40,
                justifyContent: "center",
                backgroundColor: "#00A6FF",
                borderRadius: 8,
                marginLeft: 10,
                width: 120,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                {rightText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

   // 單按鈕，無圖
   static SingleModal({ desc, title, onPress, btnText, visible }) {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        style={{ padding: 0, width: width / 1.3, borderRadius: 10 }}
      >
        <View style={styles.successModal}>
          {title && (
            <Text
              style={{ color: "#222222", paddingTop: 20, fontSize: 18, fontWeight: 'bold' }}
            >
              {title}
            </Text>
          )}
          <Text style={{ color: "#222222", paddingTop: 8, paddingBottom: 24 }}>
            {desc}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                onPress();
              }}
              style={{
                height: 40,
                justifyContent: "center",
                backgroundColor: "#00A6FF",
                borderRadius: 8,
                marginLeft: 10,
                width: 120,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                {btnText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  successModal: {
    // width: width / 1.2,
    // height: height / 3,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
});
