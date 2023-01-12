import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Touch from "react-native-touch-once";
import { getMoneyFormat } from "../Common/CommonFnData";
import moment from "moment";

export default function RecordItem({ item, index, beforeDate, nowDate, getGameIcon, goDetail }) {
    let WinLoss = parseFloat(item.winLoss.toFixed(3)) + "";
    return (
      <Touch
        onPress={() => {
         goDetail(item.providerCode, item.productType);
        }}
        key={index}
        style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          marginBottom: 15,
          paddingBottom: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 20,
            paddingHorizontal: 24,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              resizeMode="stretch"
              source={getGameIcon(item.productType)}
              // source={require("../../images/promotion/icon-soccer.png")}
              style={{ width: 40, height: 40 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{
                  color: "#000",
                  fontWeight: "bold",
                  marginBottom: 2,
                  fontSize: 16,
                }}
              >
                {item.providerCode === "VTG"? "V2 虚拟体育" : item.providerCodeLocalizedName}
                
              </Text>
              <Text style={{ fontSize: 14, color: "#8a8a8a" }}>
                {moment(beforeDate).format("YYYY/MM/DD") + " ~ " + moment(nowDate).format("YYYY/MM/DD")}
              </Text>
            </View>
          </View>
          <Image
            resizeMode="stretch"
            source={require("../../images/icon/right.png")}
            style={{ width: 6, height: 11 }}
          />
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#F3F3F3",
            alignSelf: "stretch",
            marginHorizontal: 15,
          }}
        />
        <View
          style={[
            styles.recordsDataList,
            { justifyContent: "space-around", marginTop: 15 },
          ]}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 14, marginBottom: 10, color: "#999999" }}>
              总投注金额
            </Text>
            <Text
              style={{ color: "#222222", fontWeight: "500", fontSize: 16 }}
            >
              ¥{" "}{getMoneyFormat(parseFloat(item.betAmount.toFixed(3)))}
            </Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 14, marginBottom: 10, color: "#999999" }}>
              总输赢
            </Text>
            <Text
              style={{
                color: item.winLoss > 0 ? "#F92D2D" : "#42D200",
                fontWeight: "500",
                fontSize: 16,
              }}
            >
              {item.winLoss > 0 ? "+" : "-"}{" "}¥{" "}
              {getMoneyFormat(WinLoss.replace("-", ""))}
            </Text>
          </View>
        </View>
      </Touch>
    );
}

const styles = StyleSheet.create({
  recordsDataList: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});
