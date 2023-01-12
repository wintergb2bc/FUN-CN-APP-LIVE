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

export default function SecurityNotice() {
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
          为了维持最高的服务标准，我们正在不断升级我们的系统。
          目前，我们需要进行进一步升级数据安全系统，需要您帮助来验证您的电话号码或电子邮件，以确保是您本人登录。
        </Text>
        <Text
          style={{
            color: "#666666",
            paddingBottom: 12,
            lineHeight: 20,
          }}
        >
          为了进一步保护您的信息，我们将需要您通过短信或电子邮件身份验证您的登录信息。
          您登录后，我们会将6位数的验证码发送到账户绑定的电话或电子邮件，
          您可以通过在网页或客户端上输入6位数验证码来验证您的帐户。
          如果您无法确认电话号码或电子邮件地址，请联系我们在线客户服务，随时为您提供协助。
        </Text>

        <Text
          style={{
            color: "#666666",
            paddingBottom: 12,
            lineHeight: 20,
          }}
        >
          我们全体员工将竭尽全力保护您的个人信息，我们希望得到您的理解与支持。
        </Text>
        <Text
          style={{
            color: "#666666",
            paddingBottom: 12,
            lineHeight: 20,
          }}
        >
          谢谢{"\n"}乐天堂 FUN88
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
              fontWeight: "bold",
            }}
          >
            进行验证
          </Text>
        </Touch>
      </View>
    </View>
  );
}
