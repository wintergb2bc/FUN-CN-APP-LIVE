import React from "react";
import {
    StyleSheet,
    Text,
    Linking,
    Image,
    View,
    ViewStyle,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    Platform,
    FlatList,
    TextInput,
    RefreshControl,
    Modal
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import {
    Toast,
    Flex,
    Tabs,
    InputItem,
    List,
    SearchBar,
    PickerView,
    ActivityIndicator
} from "antd-mobile-rn";
import ModalDropdown from "react-native-modal-dropdown";
import GameMaintain from "./GameMaintain";
import LivechatDragHoliday from "./LivechatDragHoliday"  //可拖動懸浮

const { width, height } = Dimensions.get("window");


const deviceType = Platform.OS;
class GameList extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: navigation.state.params.title
            ? navigation.state.params.title
            : "",
        headerTintColor: "#000",
        headerTitleColor: "#220000",
        titleColor: "#220000"
    });

    constructor(props) {
        super(props);

        this.state = {
            GameData: [],
            refresh: true,
        };
    }

    componentWillMount() {

    }

    componentDidMount(props) { }

    componentWillUnmount() { }


    renderLiveRow = ({ item, index }) => {

        return (
            <View>
            </View>
        );
    };

    onRefresh() {
        this.setState({refresh: true}, () => {

        })
    }
    renderFooter() {
        const { refresh } = this.state
        return (
            refresh ?
                <View>
                    <Text style={{color: '#00a6ff', lineHeight: 30}}>加载更多...</Text>
                </View>
                : null
        )
    }
    render() {

        const {
            GameData,
        } = this.state;


        return (
            <View style={styles.rootView}>
                <View>
                    <FlatList
                        showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                        showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                        automaticallyAdjustContentInsets={false}
                        numColumns={1} //每行显示2个
                        ref={flatList => (this._flatList = flatList)}
                        renderItem={this.renderLiveRow}
                        enableEmptySections={true} //数据可以为空
                        onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                        ListFooterComponent={this.renderFooter}//尾巴
                        keyExtractor={(item, index) => (item.key = index)}
                        onRefresh={this.onRefresh}
                        data={GameData}
                        extraData={GameData}
                    />
                </View>
            </View>
        );
    }
}

export default GameList;

const styles = StyleSheet.create({
    rootView: { flex: 1 },

});
