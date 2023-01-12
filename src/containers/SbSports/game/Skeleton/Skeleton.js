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
    ImageBackground,
    Platform,
    Modal,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import SnapCarousel, {
    ParallaxImage,
    Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import React from "react";

export default class Skeleton extends React.Component {
    //EventsOnly = true 表示只展示Event loading區
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#EFEFF4'}}>
                { (this.props.EventsOnly === true) ? null : <>
                    {/* banner */}
                    <View style={{ width: width, padding: 10, display: 'flex',justifyContent: 'center',alignItems: 'center', paddingBottom: 0 }}>
                        <View style={{ width: width - 20, height: 0.333 * (width - 20), borderRadius: 8, backgroundColor: '#e0e0e9' }} />
                    </View>
                    {/* banner下方指示點*/}
                    <View style={{ height: 14, display: 'flex', flexDirection: 'row', justifyContent: 'center',alignItems: 'center', marginBottom: 4 }}>
                        <View style={{ width: 16 ,height:4, backgroundColor: '#00A6FF', borderRadius: 2 }} />
                        <View style={{ width: 4 ,height:4, backgroundColor: '#B8B8B8', borderRadius: 2, marginLeft: 8 }} />
                        <View style={{ width: 4 ,height:4, backgroundColor: '#B8B8B8', borderRadius: 2, marginLeft: 8 }} />
                        <View style={{ width: 4 ,height:4, backgroundColor: '#B8B8B8', borderRadius: 2, marginLeft: 8 }} />
                    </View>
                    {/* 體育項目 */}
                    <View style={{ height: 56, display: 'flex', flexDirection: 'row', backgroundColor: '#E1E1E6' }}>
                        <View style={{ width: 56, height: 56, backgroundColor: '#fff', borderTopLeftRadius:8 , borderTopRightRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center',alignItems: 'center' }}>
                            <View style={{ width: 20, height: 20, backgroundColor: '#EFEFF4', borderRadius: 40 }} />
                            <View style={{ width: 36, height: 12, backgroundColor: '#EFEFF4', borderRadius: 50, marginTop: 5 }} />
                        </View>
                        {
                            [1,2,3,4,5,6].map(item => {
                                return <View  key={item} style={{ width: 56, height: 56, display: 'flex', flexDirection: 'column', justifyContent: 'center',alignItems: 'center' }}>
                                    <View style={{ width: 20, height: 20, backgroundColor: '#EFEFF4', borderRadius: 40 }} />
                                    <View style={{ width: 36, height: 12, backgroundColor: '#EFEFF4', borderRadius: 50, marginTop: 5 }} />
                                </View>
                            })
                        }
                    </View>
                    {/* 市場(滾球,今日,早盤...) */}
                    <View style={{ height: 34, display: 'flex', flexDirection: 'row', backgroundColor: '#FFFFFF', justifyContent: 'space-around',alignItems: 'center' }}>
                        {
                            [1,2,3,4,5].map(item => {
                                return <View key={item} style={{ width: 56, height: 24, borderRadius: 112, backgroundColor: '#EFEFF4' }} />
                            })
                        }
                    </View>
                    {/* 分隔線 */}
                    <View style={{paddingHorizontal: 13, backgroundColor: '#FFFFFF'}}>
                        <View style={{ width: (width - 26) , height: 1, backgroundColor: '#EFEFF4' }} />
                    </View>
                    {/* 波膽按鈕 和 聯賽/時間排序 */}
                    <View style={{ height: 46, display: 'flex', flexDirection: 'row', backgroundColor: '#FFFFFF', justifyContent: 'space-between',alignItems: 'center', paddingHorizontal: 12 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'center' }}>
                            <View style={{ width: 76, height: 25, borderRadius: 152, backgroundColor: '#EFEFF4' }} />
                            <View style={{ width: 76, height: 25, borderRadius: 152, backgroundColor: '#EFEFF4', marginLeft: 5 }} />
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end',alignItems: 'center' }}>
                            <View style={{ width: 76, height: 25, borderRadius: 152, backgroundColor: '#EFEFF4', marginRight: 8 }} />
                            <View style={{ width: 26, height: 25, borderRadius: 52, backgroundColor: '#EFEFF4' }} />
                        </View>
                    </View>
                </>}
                {/* 聯賽 */}
                <View style={{ width: width, height: 32, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'center', paddingLeft: 8 }}>
                    <View style={{ width: 24, height: 24, borderRadius: 48, backgroundColor: '#E0E0E9', marginRight: 8 }} />
                    <View style={{ width: 84, height: 8, borderRadius: 168, backgroundColor: '#E0E0E9' }} />
                </View>
                {
                    [1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
                        return ( //單個比賽
                          <View style={{ height: 118, backgroundColor: '#FFFFFF',
                              display: 'flex', flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center',
                              paddingHorizontal: 8, paddingBottom: 14,
                              borderBottomColor: '#efeff4', borderBottomWidth: 1}}
                              key={item}
                          >
                              <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',alignItems: 'flex-start', paddingTop: 28 }}>
                                  <View style={{ height:38, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'center' }}>
                                      <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: '#efeff4', marginRight: 12 }} />
                                      <View style={{ width: 84, height: 8, borderRadius: 50, backgroundColor: '#efeff4' }} />
                                  </View>
                                  <View style={{ height:38, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'center' }}>
                                      <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: '#efeff4', marginRight: 12 }} />
                                      <View style={{ width: 84, height: 8, borderRadius: 50, backgroundColor: '#efeff4' }} />
                                  </View>
                              </View>
                              <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',alignItems: 'space-between', paddingTop: 6 }}>
                                  <View style={{ height:17, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'center' }}>
                                      <View style={{ width: 82, height: 17, borderRadius: 50, backgroundColor: '#efeff4', marginRight: 4 }} />
                                      <View style={{ width: 82, height: 17, borderRadius: 50, backgroundColor: '#efeff4' }} />
                                  </View>
                                  <View style={{ height:34, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'center',marginTop:9 }}>
                                      <View style={{ width: 82, height: 34, borderRadius: 4, backgroundColor: '#efeff4', marginRight: 4 }} />
                                      <View style={{ width: 82, height: 34, borderRadius: 4, backgroundColor: '#efeff4' }} />
                                  </View>
                                  <View style={{ height:34, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'center',marginTop:4 }}>
                                      <View style={{ width: 82, height: 34, borderRadius: 4, backgroundColor: '#efeff4', marginRight: 4 }} />
                                      <View style={{ width: 82, height: 34, borderRadius: 4, backgroundColor: '#efeff4' }} />
                                  </View>
                              </View>
                          </View>
                        )
                    })
                }
            </View>
        )
    }
}



const styles = StyleSheet.create({
    topList: {
        paddingLeft: 15,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        width: width,
        height: 50,
        backgroundColor: '#efeff4',
    },
    listView: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomColor: '#efeff4',
        borderBottomWidth: 1,
        width: width,
        paddingTop: 15,
        paddingBottom: 15,
    },
    listLeft: {
        paddingLeft: 15,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        width: width * 0.4,
        marginBottom: 15
    },
    listRight: {
        width: width * 0.5,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    rightList: {
        width: width * 0.2,
        height: 32,
        backgroundColor: '#efeff4',
        borderRadius: 5,
        marginBottom: 10
    }
})
