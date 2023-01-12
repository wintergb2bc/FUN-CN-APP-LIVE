import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import HTMLView from "react-native-htmlview";

class USDTHelpCenter extends React.Component<any, any> {
  inputRef: any;
  constructor(props) {
    super(props);
    this.state = {
      activeId: 0,
      FaqData: this.props.FaqData,
    };
  }

  render() {
    const { activeId, FaqData } = this.state;

    return (
      <ScrollView style={{ backgroundColor: "#EFEFF4", padding: 15 }}>
        <View style={{ marginBottom: 15 }}>
          {FaqData &&
            FaqData.map((item, index) => {
              return (
                <View key={index} style={styles.questionWrap}>
                  {/* title */}
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        activeId: activeId == item.id ? 0 : item.id,
                      })
                    }
                    style={{}}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: 15,
                        paddingBottom: 15,
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text
                        style={{
                          lineHeight: 20,
                          fontSize: 14,
                          width: "90%",
                          color: "#222",
                        }}
                      >
                        {item.title}
                      </Text>
                      <Image
                        resizeMode="stretch"
                        source={require("../../../images/icon/downBlack.png")}
                        style={{
                          width: 20,
                          height: 20,
                          transform: [
                            { rotate: activeId == item.id ? "180deg" : "0deg" },
                          ],
                        }}
                      />
                    </View>
                  </TouchableOpacity>

                  {
                    // content
                    activeId == item.id && (
                      <View style={[{ paddingBottom: 20 }]}>
                        <HTMLView
                          value={item.body}
                          stylesheet={{
                            p: {
                              color: "#666666",
                              fontSize: 14,
                              lineHeight: 18,
                            },
                          }}
                        />
                      </View>
                    )
                  }
                </View>
              );
            })}
        </View>
      </ScrollView>
    );
  }
}

export default USDTHelpCenter;

const styles = StyleSheet.create({
  questionWrap: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    borderRadius: 8,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 16,
  },
});
