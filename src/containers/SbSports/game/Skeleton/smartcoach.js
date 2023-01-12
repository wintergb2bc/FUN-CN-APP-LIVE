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

export default class Smartcoach extends React.Component {
    state = {
        isBottomSheetVisible: false
    };
    render() {
        return (
            <View style={{ width: width, padding: 15, }}>
                {
                    new Array(9).fill(1).map((item, index) => {
                        return (
                            index % 3 ?
                            <View style={styles.leftList}>
                                <View style={styles.itemView} />
                            </View>
                            :
                            <View style={styles.rightList}>
                                <View style={styles.itemView} />
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}



const styles = StyleSheet.create({
    itemView: {
        backgroundColor: '#00000014',
        borderRadius: 8,
        width: width * 0.7,
        height: 36,
    },
    leftList: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    rightList: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginBottom: 15,
    }
})