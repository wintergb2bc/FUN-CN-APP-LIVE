import React from "react";
import {
  StyleSheet,
  WebView,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  TouchableHighlight,
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
const { width, height } = Dimensions.get("window");

export default function SecurityUpdateNotice() {
  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <Image
        resizeMode="stretch"
        source={require("../../images/loginOtp/Password.png")}
        style={{ width: width, height: width * 0.248 }}
      />
      <View style={{ padding: 20 }}>
        <Text
          style={{
            color: "#666666",
            paddingBottom: 12,
            lineHeight: 20,
          }}
        >
          亲爱的玩家，
        </Text>
        <Text
          style={{
            color: "#666666",
            paddingBottom: 12,
            lineHeight: 20,
          }}
        >
         感谢您一直以来的支持与信任，乐天堂一直秉持着为客户提供业界最好的服务。为了更好的保护您的账户安全，目前我们正在升级安全系统，需要您协助更新您的密码。 
        </Text>
        <Text
          style={{
            color: "#666666",
            paddingBottom: 12,
            lineHeight: 20,
          }}
        >
         为了更进一步保护您的个人信息，我们将在您登录账户时进行短信或电子邮件验证，在您登录的那一刻，系统将会发送6位数的验证码至您注册的手机号码或电子邮件地址中，您可以在网页或APP客户端上输入验证码进行验证登录。如果您无法确认您的注册电话号码或电子邮件地址，您可以随时联系乐天使在线客服或发送邮件到cs@fun88.com，她们将全力协助您。
        </Text>

        <Text
          style={{
            color: "#666666",
            paddingBottom: 12,
            lineHeight: 20,
          }}
        >
         再次感谢您的支持与理解，保障客户账户安全是乐天堂所有员工的使命！
        </Text>
        <Text
          style={{
            color: "#666666",
            paddingBottom: 12,
            lineHeight: 20,
          }}
        >
          此敬{"\n"}乐天堂 FUN88
        </Text>
        <Touch
          onPress={() => {
            Actions.pop();
          }}
          style={{
            backgroundColor: "#00a6ff",
            borderRadius: 8,
            paddingHorizontal: 20,
            marginTop: 32
          }}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              lineHeight: 45,
              fontSize: 16,
              fontWeight: "bold"
            }}
          >
            进行验证
          </Text>
        </Touch>
      </View>
    </View>
  );
}
