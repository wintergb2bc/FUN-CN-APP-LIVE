import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Toast } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import AccordionItem from "antd-mobile-rn/lib/accordion/style/index.native";
import { helpCenterDetail } from "./CommonFn";
const newStyle = {};
for (const key in AccordionItem) {
  if (Object.prototype.hasOwnProperty.call(AccordionItem, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(AccordionItem[key]) };
    newStyle[key].borderBottomWidth = 0;
    newStyle[key].borderTopWidth = 0;
  }
}
import Accordion from "react-native-collapsible/Accordion";
import LoadingBone from "../../Common/LoadingBone";

class HelpCenter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: [],
      activeSections: [],
      dataLoading: true
    };
  }
  componentDidMount() {
    this.helpCenter();
  }

  helpCenter() {
    fetch(CMS_Domain + ApiPort.CMS_HelpCenter, {
      method: "GET",
      headers: {
        token: CMS_token,
      },
    })
      .then((response) => (headerData = response.json()))
      .then((data) => {
        if (data) {
          this.setState({ dataList: data, dataLoading: false });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderHeader = (section, _, isActive) => {
    return (
      <View style={[styles.header, isActive ? styles.active : styles.inactive]}>
        <Text style={styles.headerText}>{section.title}</Text>
        <Image
          resizeMode="contain"
          source={require("../../../images/icon/plus.png")}
          style={{
            width: 24,
            height: 24,
            transform: [{ rotate: isActive ? "180deg" : "0deg" }],
          }}
        />
      </View>
    );
  };

  renderContent(item, _, isActive) {
    return (
      <View style={[styles.content]}>
        {item.menus &&
          item.menus.length > 0 &&
          item.menus.map((value, key) => {
            return (
              <Touch
                onPress={() => {
                  helpCenterDetail(value.id);
                }}
                key={key}
                style={[
                  styles.touchBtn,
                  key == item.menus.length - 1 ? styles.itemLast : {},
                ]}
              >
                <Text
                  arrow="horizontal"
                  style={{ fontSize: 14, color: "#222", marginLeft: 15 }}
                >
                  {value.title}
                </Text>
                <Image
                  resizeMode="contain"
                  source={require("../../../images/icon/lightGreyRight2.png")}
                  style={{ width: 24, height: 24 }}
                />
              </Touch>
            );
          })}
      </View>
    );
  }
  setSections = (sections) => {
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };
  render() {
    const { dataList, activeSections, dataLoading } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#F2F2F2", padding: 15 }}>
        <ScrollView>
          {dataLoading && (
            Array.from({ length: 4 }, (v) => v).map((v2, i2) => {
              return (
                <View style={ {
                  // 
                  borderRadius: 10,
                  overflow: "hidden",
                  backgroundColor: "#e0e0e0",
                  marginBottom: 10,
                  height: 50
                }} key={i2}>
                  <LoadingBone/>
                </View>
              );
            })
          )}
          {!dataLoading && dataList.length > 0 && (
            <Accordion
              activeSections={activeSections}
              sections={dataList}
              touchableComponent={TouchableOpacity}
              renderHeader={this.renderHeader}
              renderContent={this.renderContent}
              duration={400}
              onChange={this.setSections}
              renderAsFlatList={false}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

export default HelpCenter;

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  touchBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 15,
    marginRight: 15,
    height: 50,
    borderBottomColor: "#F3F3F3",
    borderBottomWidth: 1,
  },
  header: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  inactive: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  active: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: 14,
    color: "#222",
  },
  itemLast: {
    borderBottomWidth: 0,
  },
});
