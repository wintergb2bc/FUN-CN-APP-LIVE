import React, { Component } from 'react';
import { Platform, Text, TextInput, View } from "react-native";
import Blink from './Blink';

/* 
  此模組用於不讓TextInput閃爍。
  因TextInput要手動擋一些String的話，會閃爍一下才消失，是React Native本身的bug，
  無傷大雅，但是user比較靠北的話可能會提。
  
  Options:
  inputStyle: 輸入框樣式
  textStyle: 文字樣式
  height: 高度
  cursorColor: 游標顏色
 */
class FlickerFreeTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: false
    };
  }

  render() {
    const {
      value = "",
      cursorColor = Platform.OS === "ios" ? "#416AF2" : "#000",
      height = 44,
      inputStyle,
      onFocus,
      onBlur,
      textStyle,
      ...rest
    } = this.props;
    return (
      <View style={{ position: "relative" }}>
        <TextInput
          style={[inputStyle, { height: height, color: "transparent" }]}
          value={value}
          caretHidden={true}
          onFocus={() => {
            if (onFocus) {
              onFocus();
            }
            this.setState({
              isFocus: true
            });
          }}
          onBlur={() => {
            if (onBlur) {
              onBlur();
            }
            this.setState({
              isFocus: false
            });
          }}
          {...rest}
        />
        <View
          style={{ position: "absolute", zIndex: -1, alignItems: "center", height: height, justifyContent: "center" }}>
          <View style={{ alignItems: 'baseline' }}>
            <View style={{ flexDirection: "row", alignSelf: "center", }}>
              <Text style={textStyle}>{value}</Text>
              {this.state.isFocus && (
                <Blink><View
                  style={{ backgroundColor: cursorColor, height: height * 0.4, width: 2, borderRadius: 20 }}/></Blink>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default FlickerFreeTextInput;
