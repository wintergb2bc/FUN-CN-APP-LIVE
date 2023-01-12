
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

class ComboBonusModal extends React.Component {
    render() {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={this.props.visible}
            >
                <View style={styles.depModal}>
                    <Touch style={styles.marks} onPress={() => { this.props.onClose() }}></Touch>
                    <View style={styles.secussModal}>
                        <View style={styles.headerView}>
                            <Text style={{ textAlign: 'center', fontSize: 16, color: '#fff', fontWeight: 'bold', lineHeight: 40 }}>混合过关盈利升级</Text>
                        </View>
                        <View style={styles.modalView}>
                            <View>
                                <View style={styles.comboBonus}>
                                    <Text style={styles.titles}>产品：</Text>
                                    <Text style={{ fontSize: 12 }}>乐天堂体育</Text>
                                </View>
                                <View style={styles.comboBonus}>
                                    <Text style={styles.titles}>运动项目：</Text>
                                    <Text style={{ fontSize: 12 }}>足球和篮球</Text>
                                </View>
                                <View style={styles.comboBonus}>
                                    <Text style={styles.titles}>最高奖励</Text>
                                    <Text style={{ fontSize: 12 }}>￥5000</Text>
                                </View>
                            </View>
                            <View style={[styles.comboBonus, { alignItems: 'flex-start' }]}>
                                <Text style={styles.titles}>要求：</Text>
                                <View>
                                    <Text style={{ fontSize: 12, lineHeight: 22 }}>{`1. 投注混合过关，串关>=3串`}</Text>
                                    <Text style={{ fontSize: 12, lineHeight: 22 }}>{`2. 单场最低赔率>=1.70`}</Text>
                                    <Text style={{ fontSize: 12, lineHeight: 22 }}>{`3. 每张注单投注额>=100`}</Text>
                                    <Text style={{ fontSize: 12, lineHeight: 22 }}>4. 仅限早盘赛事</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={[styles.titles, { width: width - 60 }]}>注：系统混合过关不包含在内。</Text>
                        <View>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableLeft}>混合过关场数</Text>
                                <Text style={styles.tableRight}>盈利升级</Text>
                            </View>
                            <View style={styles.tableList}>
                                <Text style={styles.tableLeft}>3场</Text>
                                <Text style={styles.tableRight}>3%</Text>
                            </View>
                            <View style={styles.tableList}>
                                <Text style={styles.tableLeft}>4场</Text>
                                <Text style={styles.tableRight}>5%</Text>
                            </View>
                            <View style={styles.tableList}>
                                <Text style={styles.tableLeft}>5场</Text>
                                <Text style={styles.tableRight}>8%</Text>
                            </View>
                            <View style={styles.tableList}>
                                <Text style={styles.tableLeft}>6场</Text>
                                <Text style={styles.tableRight}>10%</Text>
                            </View>
                            <View style={styles.tableList}>
                                <Text style={styles.tableLeft}>7场</Text>
                                <Text style={styles.tableRight}>12%</Text>
                            </View>
                            <View style={styles.tableList}>
                                <Text style={styles.tableLeft}>8场</Text>
                                <Text style={styles.tableRight}>15%</Text>
                            </View>
                            <View style={[styles.tableList, { borderBottomWidth: 1, borderColor: '#ececec' }]}>
                                <Text style={styles.tableLeft}>9场</Text>
                                <Text style={styles.tableRight}>20%</Text>
                            </View>
                        </View>
                    </View>
                    <Touch onPress={() => { this.props.onClose() }} style={{ padding: 15 }}>
                        <Image resizeMode='stretch' source={require('../images/closeWhite.png')} style={{ width: 25, height: 25 }} />
                    </Touch>
                </View>
                {/* <ReactSVG className="recommend" src="/svg/close.svg" onClick={this.props.onClose} /> */}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    tableList: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    depModal: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secussModal: {
        // width: width / 1.2,
        // height: height / 3,
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: width - 40,
        borderRadius: 10,
        paddingBottom: 30,
    },
    tableLeft: {
        width: (width - 64) * 0.5,
        lineHeight: 35,
        borderColor: '#ececec',
        borderWidth: 1,
        borderBottomWidth: 0,
        textAlign: 'center',
    },
    tableRight: {
        width: (width - 64) * 0.5,
        lineHeight: 35,
        borderColor: '#ececec',
        borderWidth: 1,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        textAlign: 'center',
    },
    tableHeader: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ececec',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    comboBonus: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    marks: {
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
    },
    modalView: {
        width: width - 40,
        backgroundColor: '#fff',
        padding: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    titles: {
        fontSize: 12,
        color: '#b0b0b0',
        lineHeight: 22,
    },
    headerView: {
        backgroundColor: '#00A6FF',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        width: width - 40,
    },
})
export default ComboBonusModal;
