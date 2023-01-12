import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Touch from "react-native-touch-once";
import { Toasts } from "./Toast";

const { width, height } = Dimensions.get("window");

export default class TestFunctions extends Component {

  async changeDomain(key, v) {
    key !== "version" && this.logout();
    window.CMS_token = "71b512d06e0ada5e23e7a0f287908ac1";
    switch (key) {
      case 'ST':
        window.common_url = "https://gateway-idcstgf1p5.gamealiyun.com";
        window.CMS_Domain = "https://f1-api-stage-web.fubnb.com";
        break;
      case 'SL2':
        if (common_url === "https://gateway-idcslf5.gamealiyun.com") {
          Toasts.fail("已在SL")
          return;
        }
        window.common_url = "https://gateway-idcslf5.gamealiyun.com";
        window.CMS_Domain = "https://slapi.550fun.com";
        window.WorldCup_Domain = "https://f1m1-worldcup-pprod-web.fubnb.com";
        window.SBTDomain = "https://p5sl.fun88.biz";
        window.isStaging = false;
        break;
      case 'Prod':
        if (common_url === "https://gateway-idcf5.gamealiyun.com") {
          Toasts.fail("已在Prod")
          return;
        }
        window.common_url = "https://gateway-idcf5.gamealiyun.com";
        window.CMS_Domain = "https://cache.f866u.com";
        window.SBTDomain = "https://www.fun993.com";
        window.isStaging = false;
        break;
      case 'storage':
        global.storage.clearMap();
        Toasts.success("已清除");
        break;
      case 'version':
        window.CheckUptateGlobe && window.CheckUptateGlobe();
        break;
      case 'STOHHER':
        window.common_url = `https://gateway-idcstgf1p5${v}.gamealiyun.com`;
        window.CMS_Domain = "https://f1-api-stage-web.fubnb.com";
        break;
      default:
        break;
    }

    await global.storage.clearMap();
    window.refreshingHome();
    window.refreshingProfile();
  }

  logout() {
    window.navigateToSceneGlobe && window.navigateToSceneGlobe();
  }

  render() {
    return (
      window.isSTcommon_url && (
        <View
          style={{
            backgroundColor: "#fff",
            marginTop: 16,
            borderRadius: 6,
            paddingHorizontal: 16,
            paddingVertical: 15,
          }}
        >
          <View style={styles.managerLists}>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "space-between",
                flex: 1,
                borderBottomWidth: 1,
                borderBottomColor: "#F3F3F3",
                paddingBottom: 15,
                marginBottom: 15,
              }}
            >
              <Text style={styles.ListsText}>当前Domain API</Text>
              <Text style={{ color: "red", fontWeight: "bold" }}>
                {window.common_url}
              </Text>
            </View>
          </View>
          <View style={styles.managerLists}>
            <Touch
              style={styles.managerListsTouch}
              onPress={this.changeDomain.bind(this, "ST")}
            >
              <View style={styles.managerListsLeft}>
                <Text style={styles.ListsText}>切换到ST Default</Text>
              </View>
              {/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
            </Touch>
          </View>
          {Array.from({ length: 5 }, (v, i) => `0${i + 1}`).map((v, i) => {
            return (
              <View style={styles.managerLists} key={i}>
                <Touch
                  style={styles.managerListsTouch}
                  onPress={this.changeDomain.bind(this, "STOHHER", v)}
                >
                  <View style={styles.managerListsLeft}>
                    <Text style={styles.ListsText}>切换到ST {v}</Text>
                  </View>
                  {/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
                </Touch>
              </View>
            );
          })}

          <View style={styles.managerLists}>
            <Touch
              style={styles.managerListsTouch}
              onPress={this.changeDomain.bind(this, "SL2")}
            >
              <View style={styles.managerListsLeft}>
                <Text style={styles.ListsText}>切换到 SL</Text>
              </View>
              {/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
            </Touch>
          </View>

          <View style={styles.managerLists}>
            <Touch
              style={styles.managerListsTouch}
              onPress={this.changeDomain.bind(this, "Prod")}
            >
              <View style={styles.managerListsLeft}>
                <Text style={styles.ListsText}>切换到 Prod</Text>
              </View>
              {/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
            </Touch>
          </View>

          <View style={styles.managerLists}>
            <Touch
              style={styles.managerListsTouch}
              onPress={this.changeDomain.bind(this, "storage")}
            >
              <View style={styles.managerListsLeft}>
                {/* <Image resizeMode='stretch' source={managerImg8} style={styles.managerListsImg}></Image> */}
                <Text style={styles.ListsText}>清除缓存</Text>
              </View>
              {/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
            </Touch>
          </View>
          <View style={styles.managerLists}>
            <Touch
              style={styles.managerListsTouchLast}
              onPress={this.changeDomain.bind(this, "version")}
            >
              <View style={styles.managerListsLeft}>
                {/* <Image resizeMode='stretch' source={managerImg8} style={styles.managerListsImg}></Image> */}
                <Text style={styles.ListsText}>检测版本</Text>
              </View>
              {/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
            </Touch>
          </View>
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtn: {
    justifyContent: "center",
    alignItems: "center",
    // width: (width - 20 - 24) / 4,
  },
  iconBtnImg: {
    width: 34,
    height: 34,
    marginBottom: 7,
  },
  managerLists: {
    flexDirection: "row",
  },
  managerListsTouch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F3F3",
    paddingBottom: 15,
    marginBottom: 15,
  },
  managerListsTouchLast: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  managerListsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  managerListsImg: {
    width: 18,
    height: 18,
    marginRight: 12,
  },
  carouselImg: {
    width: width - 20,
    height: (width - 20) * 0.314,
    borderRadius: 4,
  },
  wrapper: {
    height: (width - 20) * 0.314,
    margin: 10,
    marginBottom: 0,
    overflow: "hidden",
    borderRadius: 6,
  },
  containerStyle: {
    paddingVertical: 2,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 5,
  },
  dotStyle: {
    width: 20,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
    backgroundColor: "#00CEFF",
  },
  inactiveDotStyle: {
    width: 10,
    backgroundColor: "#fff",
  },
  iconText: {
    color: "#222",
    fontSize: 12,
  },
  modalContainer: {
    width,
    height,
    flex: 1,
    backgroundColor: "rgba(0 ,0 ,0, .6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer1: {
    width: width * 0.9,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  modalContainerHead: {
    height: 44,
    backgroundColor: "#00A6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainerHeadText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
