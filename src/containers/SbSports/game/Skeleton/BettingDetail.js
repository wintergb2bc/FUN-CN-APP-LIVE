{
    /* 详情页loding */
}
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

export default class SkeletonBettingDetail extends React.Component {
    state = {
        isBottomSheetVisible: false
    };
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.headerView} />
                <View style={styles.navView}>
                    <View style={styles.navList} />
                    <View style={styles.navList} />
                    <View style={styles.navList} />
                    <View style={styles.navList} />
                </View>
                <View style={styles.betView}>
                    <View style={styles.betList1} />
                    <View style={styles.betList} />
                    <View style={styles.betList} />
                    <View style={styles.betList} />
                    <View style={styles.betList} />
                    <View style={styles.betList} />
                </View>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    headerView: {
        height:  width * 0.555,
        width: width,
        backgroundColor: 'rgba(217, 216, 227, 1)'
    },
    navView: {
        width: width,
        height: 50,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(235, 235, 242, 1)'
    },
    navList: {
        width: width * 0.2,
        height: 35,
        borderRadius: 50,
        backgroundColor: 'rgba(217, 216, 227, 1)',
    },
    betView: {
        padding: 5,
        backgroundColor: '#fff',
    },
    betList: {
        width: width - 10,
        backgroundColor: 'rgba(235, 235, 242, 1)',
        height: width * 0.5,
        marginBottom: 5,
    },
    betList1: {
        width: width - 10,
        backgroundColor: 'rgba(235, 235, 242, 1)',
        height: 65,
        marginBottom: 5,
    },
})