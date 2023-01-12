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

export default class KeyboardLoding extends React.Component {
    state = {
        isBottomSheetVisible: false
    };
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
                <View style={styles.betList} />
                <View style={styles.betList} />
                <View style={styles.betBtn}> 
                    <View style={styles.btn1} />
                    <View style={styles.btn2} />
                </View>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    betList: {
        width: width - 20,
        height: width * 0.5,
        marginBottom: 10,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(235, 235, 242, 1)',
        borderRadius: 10,
    },
    betBtn: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 40,
    },
    btn1: {
        width: (width - 30) * 0.2,
        height: 40,
        backgroundColor: 'rgba(235, 235, 242, 1)',
        borderRadius: 5,
    },
    btn2: {
        width: (width - 30) * 0.8,
        height: 40,
        backgroundColor: 'rgba(235, 235, 242, 1)',
        borderRadius: 5,
    }
})