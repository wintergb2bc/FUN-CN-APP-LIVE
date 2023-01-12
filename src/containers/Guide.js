import React, { Component } from "react";
import {
    ScrollView,
    View,
    TextInput,
    Text,
    Dimensions,
    Image,
    ImageBackground,
    TouchableOpacity,
    Platform,
    Modal,
    StyleSheet,
    Linking,
    Clipboard,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { WhiteSpace, Toast, Switch } from "antd-mobile-rn";
const { width, height } = Dimensions.get("window");
import Touch from 'react-native-touch-once';


const guideList = [
    '切换体育平台',
    '快速搜索赛事',
    '体育分类导航',
    '开始下注吧！',
]

class Guide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guide: false,
            activeKey: 0,
            guideKey: 0,
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        setTimeout(() => {
            this.guide()
        }, 2000);
    }

    componentWillUnmount() { }

    //新手引导
    guide() {
        global.storage
            .load({
                key: "guide",
                id: "guide"
            })
            .then(res => { })
            .catch(err => {
                this.setState({ guide: true })
                global.storage.save({
                    key: "guide",
                    id: "guide",
                    data: 'guide',
                    expires: null
                });
            });
    }
    GuideChange(key) {
        if (key == 4) {
            this.setState({ guide: false })
            //打开推荐
            window.ShowHotEvents && window.ShowHotEvents()
            return
        }
        this.setState({ activeKey: key })
        this.props.GuideChange(key)
    }
    guideKey(key) {
        //点击2次关闭
        let guideKey = this.state.guideKey
        guideKey += 1
        this.setState({guideKey})


        if(guideKey == 2 || key == 1) {
            this.setState({guide: false})
             //打开推荐
             window.ShowHotEvents && window.ShowHotEvents()
        }
    }
    render() {
        const {
            guide,
            activeKey,
        } = this.state;

        const {
            GuideLeft,
            GuideTop,
        } = this.props;

        return (
            <View>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={guide}
                    supportedOrientations={['portrait', 'landscape']}
                >
                    <View style={{ flex: 1 }}>
                        <Touch onPress={() => { this.guideKey() }} style={styles.marsk}></Touch>
                        <View style={{ position: 'absolute', top: GuideTop, left: GuideLeft }}>
                            {
                                guideList.map((item, index) => {
                                    return (
                                        activeKey == index &&
                                        <View key={index}>
                                            <View style={styles.guideView}>
                                                <View style={styles.list}>
                                                    <Text style={{ fontSize: 12, color: '#fff', lineHeight: 35, paddingBottom: 15 }}>{item}</Text>
                                                    <Touch onPress={() => { this.guideKey(1) }} style={{ width: 40, paddingLeft: 24 }}>
                                                        <Image source={require("../images/closeWhite.png")} style={{ height: 16, width: 16 }} />
                                                    </Touch>
                                                </View>
                                                <View style={styles.list}>

                                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                                        <View style={activeKey == 0 ? styles.active : styles.noactive} />
                                                        <View style={activeKey == 1 ? styles.active : styles.noactive} />
                                                        <View style={activeKey == 2 ? styles.active : styles.noactive} />
                                                        <View style={activeKey == 3 ? styles.active : styles.noactive} />
                                                    </View>
                                                    <Touch onPress={() => { this.GuideChange(index + 1) }} style={styles.nextBtn}>
                                                        <Text style={{ color: '#000', fontSize: 12, lineHeight: 26, textAlign: 'center' }}>{activeKey == 3 ? '完成' : '下一步'}</Text>
                                                    </Touch>
                                                </View>
                                                {
                                                    activeKey != 3 &&
                                                    <View style={[
                                                        styles.arrow, { left: (activeKey == 0 || activeKey == 2) ? 30 : 140 }
                                                    ]} />
                                                }
                                                {
                                                    activeKey == 3 &&
                                                    <View style={styles.arrowBottom} />
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export default Guide;

const styles = StyleSheet.create({
    marsk: {
        position: 'absolute',
        zIndex: -1,
        width: width,
        height: height,
    },
    guideView: {
        width: 173,
        height: 68,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#363636',
        borderRadius: 8,
    },
    list: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: 173,
        height: 35,
        paddingLeft: 8,
        paddingRight: 8,
    },
    active: {
        width: 12,
        height: 4,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginLeft: 5,
    },
    noactive: {
        width: 4,
        height: 4,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginLeft: 5,
    },
    nextBtn: {
        width: 48,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    arrow: {
        position: 'absolute',
        top: -12,
        width: 0,
        height: 0,
        zIndex: 9,
        borderWidth: 6,
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderBottomColor: "#363636",
        borderRightColor: "transparent",
    },
    arrowBottom: {
        position: 'absolute',
        bottom: -12,
        width: 0,
        height: 0,
        zIndex: 9,
        borderWidth: 6,
        borderTopColor: "#363636",
        borderLeftColor: "transparent",
        borderBottomColor: "transparent",
        borderRightColor: "transparent",
    },
}); 
