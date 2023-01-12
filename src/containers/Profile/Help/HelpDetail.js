import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  Alert,
} from "react-native";
import WebViewIOS from "react-native-webview";
import WebViewAndroid from 'react-native-webview-android'
import { Actions } from "react-native-router-flux";
import AccordionItem from "antd-mobile-rn/lib/accordion/style/index.native";

import ReactNativeAutoHeightWebview from '../../ReactNativeAutoHeightWebview'
import { times } from "../../SbSports/lib/js/numberPrecision";

const { width, height } = Dimensions.get("window");

const newStyle = {};
for (const key in AccordionItem) {
  if (Object.prototype.hasOwnProperty.call(AccordionItem, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(AccordionItem[key]) };
    newStyle[key].borderBottomWidth = 0;
    newStyle[key].borderTopWidth = 0;
  }
}
let fireLoad = false
const WEBVIEW_REF = 'webview';

const viewStyle = `
<style>
body {
    padding: 10px;
    margin: 0;
	  width: ${width - 40}px;
    height:auto;
}
img {
	max-width: 100%;
    max-height: 100%;
    display: block;
    margin: auto;
}

</style>
`;
const htmls = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge "><meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no"><title>Document</title></head><body>`;

class HelpCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      htmlContent: this.props.htmlContent,
    };

    this._onNavigationStateChange = this._onNavigationStateChange.bind(this)
  }

  componentWillMount() {
    this.props.navigation.setParams({
      title: this.props.htmlContent.title,
    });
  }

  _onNavigationStateChange(e) {
    console.log('e', e)

    if (
      e.url.startsWith("tel:") ||
      e.url.startsWith("mailto:") ||
      e.url.startsWith("maps:") ||
      e.url.startsWith("geo:") ||
      e.url.startsWith("sms:")
    ) {

      Linking.openURL(e.url).catch(er => {
        console.log('er', er)
        Alert.alert("Failed to open Link: " + er.message);
      });
      reloadKey()
      // Actions.pop()

      return false;
    }

    // let everything else to the webview
    return true;
  }

  render() {
    const { htmlContent, key } = this.state;

    window.reloadKey = () => {
      this.setState({
        key: Math.random(),
      })
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#F2F2F2", padding: 10 }}>
        {Platform.OS == "ios" ? (
          <WebViewIOS
            key={key}
            originWhitelist={["*"]}
            source={{
              html: `${htmls} ${viewStyle} ${htmlContent.body}</body></html>`,
            }}
            onError={(err) => console.log('err', err)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mixedContentMode="always"
            scalesPageToFit={false}
            style={{
              width: width - 20,
              height: height,
              backgroundColor: "#fff",
            }}
            onNavigationStateChange={this._onNavigationStateChange}
          />
        ) : (
          Platform.OS == "android" && (
            <WebViewAndroid
              key={key}
              originWhitelist={["*"]}
              source={{
                html: `${htmls} ${viewStyle} ${htmlContent.body}</body></html>`,
              }}
              onError={(err) => console.log('err', err)}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              mixedContentMode="always"
              scalesPageToFit={false}
              style={{
                width: width - 20,
                height: height * .9,
                backgroundColor: "#fff",
              }}
              onNavigationStateChange={this._onNavigationStateChange}
            />
          )
        )}
      </View>
    );
  }
}

export default HelpCenter;

const styles = StyleSheet.create({
  listBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
  },
  listData: {
    paddingBottom: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  touchBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: "#F3F3F3",
    borderBottomWidth: 1,
    marginLeft: 15,
    marginRight: 15,
    height: 40,
    paddingRight: 10,
  },
});

// import React from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   Image,
//   Dimensions
// } from "react-native";
// import { List, Flex, Tabs, WingBlank,WhiteSpace } from "antd-mobile-rn";
// import HelpData from "./HelpData";
// const Item = List.Item;
// const { width, height } = Dimensions.get("window");
// /**
//  *帮助中心
//  * @class HelpCenter
//  */
// class HelpCenter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       tabs: null
//     };
//   }
//   componentDidMount() {
//     this.initTabs();
//   }

//   initTabs() {
//     let tabs = [];
//     this.props.data.data.map(item => {
//       tabs.push({
//         title: item.subTitle
//       });
//     });
//     this.setState({
//       tabs
//     });
//   }

//   render() {
//     const { tabs } = this.state;
//     const { data } = this.props.data;
//     if (!tabs) {
//       return null;
//     }

//     if (data.length >1) {
//       return (
//         <View style={{ flex: 1 }}>

//           <Tabs
//             tabs={tabs}
//             tabBarInactiveTextColor={"#fff"}
//             tabBarActiveTextColor={"#f9e3a1"}
//             tabBarBackgroundColor={"#00633c"}
//             tabBarUnderlineStyle={{ backgroundColor: "#00633c" }}
//           >
//             {data.map(item => {
//               return <SectionBox data={item} key={item.subTitle} />;
//             })}
//           </Tabs>
//         </View>
//       );
//     }else{
//       return (
//         <View style={{ flex: 1 }}>

//             {data.map(item => {
//               return <SectionBox data={item} key={item.subTitle} />;
//             })}

//         </View>
//       );
//     }

//   }
// }

// const SectionBox = ({ data }) => {
//   return (
//     <ScrollView>
//       <WingBlank>
//         <View style={styles.sectionBox}>
//           {/* <Flex.Item> */}
//           {data.descList &&
//             data.descList.map((desc, index) => (
//               <Text key={index} style={styles.desc}>
//                 {desc}
//               </Text>
//             ))}
//           {data.subData &&
//             data.subData.map(section => {
//               return <Section data={section} key={section.sectionTitle} />;
//             })}
//           {data.footer && <Text>{data.footer}</Text>}
//           {/* </Flex.Item> */}
//         </View>
//       </WingBlank>
//     </ScrollView>
//   );
// };

// const Section = ({ data }) => {
//   return (
//     <View style={styles.section}>
//       <WhiteSpace />
//       <Flex styles={styles.sectionTitleBox}>
//         <View style={styles.sectionTitleBorder} />
//         <View>
//           <Text style={styles.sectionTitle}>{data.sectionTitle}</Text>
//         </View>
//       </Flex>

//       {data.desc ? <Text>{data.desc}</Text> : null}
//       {data.descList
//         ? data.descList.map((desc, i) => <Text key={i}>{desc}</Text>)
//         : null}
//       {data.img ? (
//         <Image
//           source={data.img}
//           style={{ width: width }}
//           resizeMode="stretch"
//         />
//       ) : null}
//       {data.imgList
//         ? data.imgList.map((img, i) => (
//             <Image source={img} style={{ width: width }} resizeMode="stretch" />
//           ))
//         : null}
//       {data.sectionData && (
//         <View style={styles.sectionDataBox}>

//           {data.sectionData.map((item, index) => (
//             <View key={index}>
//                     <WhiteSpace />
//               <Text style={styles.sectionData}>
//                 {index + 1}.{item.title}
//               </Text>
//               {item.desc ? <Text>{item.desc}</Text> : null}
//               {item.img ? (
//                 <Image
//                   source={item.img}
//                   style={{ width: width }}
//                   resizeMode="contain"
//                 />
//               ) : null}
//               {item.imgList
//                 ? item.imgList.map((img, i) => (
//                     <Image
//                       source={img}
//                       style={{ width: width }}
//                       resizeMode="contain"
//                     />
//                   ))
//                 : null}
//               {item.detailList &&
//                 item.detailList.map((detail, i) => (
//                   <Text key={i} style={styles.detail}>
//                     {detail}
//                   </Text>
//                 ))}
//             </View>
//           ))}
//         </View>
//       )}

//       {data.imgEnd ? (
//         <Image
//           source={data.imgEnd}
//           style={{ width: width }}
//           resizeMode="stretch"
//         />
//       ) : null}
//     </View>
//   );
// };

// export default HelpCenter;

// const styles = StyleSheet.create({
//   helpTabs: {
//     backgroundColor: "#00623B",
//     color: "#fff"
//   },
//   sectionBox: {
//     paddingTop: 10,
//     paddingBottom: 10
//   },
//   section: {
//     flex: 1
//     // paddingBottom: 20
//   },

//   desc: {
//     paddingLeft: 5
//   },
//   detail: {
//     paddingLeft: 10,
//     fontSize: 14
//   },
//   sectionTitleBox: {
//     // display: "flex",
//     width: width,
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     alignContent: "center",
//     alignItems: "center",
//     textAlign: "left"
//   },
//   sectionTitleBorder: {
//     width: 10,
//     height: "100%",
//     // height:20,
//     // borderWidth: 2,
//     backgroundColor: "#013625",
//     borderRadius: 5,
//     // position:'absolute',
//     left: -5
//   },
//   sectionTitle: {
//     flex: 4,
//     color: "#000",
//     fontWeight: "bold",
//     fontSize: 16,
//     paddingLeft: 10
//     // borderLeftWidth: 10,
//     // borderColor: "#013625",
//     // paddingLeft: 15
//     // borderRadius: 5
//   },
//   sectionDataBox: {
//     borderLeftWidth: 1,
//     borderRadius: 1,
//     borderColor: "#013625",
//     borderStyle: "dashed",
//     paddingLeft: 5,
//     paddingBottom: 10
//   },
//   sectionData: {
//     paddingLeft: 0
//   }
// });
