import React from 'react';
import { Dimensions, Image, TouchableOpacity, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { getDetail } from "./utils"

export default class NewBox extends React.Component {
  render() {
    const { key, v, isLast } = this.props;
    return (
      <TouchableOpacity key={key} onPress={() => {
        getDetail(v);
      }} style={{ flexDirection: "row", marginBottom: 10 }}>
        <View style={{ width: 100, marginRight: 15, borderRadius: 5 }}>
          <Image style={{ width: 100, height: 60, borderRadius: 5 }}
                 source={{ uri: v.thumbnail }}
                 defaultSource={require("../../../../images/loadIcon/loadingdark.jpg")}/>
        </View>
        <View style={{
          flex: 1,
          justifyContent: "space-between",
          borderBottomColor: "#0B3E85",
          borderBottomWidth: isLast ? 0 : 1,
          paddingBottom: 10
        }}>
          <Text style={{ fontSize: 12, lineHeight: 18, color: "#fff" }}>{v.title}</Text>
          <Text style={{ fontSize: 10, lineHeight: 18, color: "#8396B0" }}>{v.updatedDate}</Text>
        </View>
        {!!(v.video) && (
          <View
            style={{
              position: "absolute",
              top: 3,
              left: 3,
              zIndex: 100,
              width: 24,
              height: 24,
              backgroundColor: "rgba(0, 0, 0,0.5)",
              borderRadius: 24 / 2,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image style={{ width: 16, height: 16 }} source={require('../../../../images/worldCup/Icon-Video.png')}/>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
