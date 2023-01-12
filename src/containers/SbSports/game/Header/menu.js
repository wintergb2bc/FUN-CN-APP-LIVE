/*
賽事列表頁- 體育 和 市場 共用下拉菜單
此模塊是舊版UI，已廢棄
*/


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

class HeaderMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	render() {
		const { menuName, currentMenuName, items, selectedItem, formatItem, getItemKey } = this.props;

		const isOpen = (menuName === currentMenuName);

		//把選中的項目移到第一個
		let sortedItems = items;
		if (items && items.length > 0 && selectedItem) {
			const selectedItems = items.filter(i => getItemKey(i) === getItemKey(selectedItem));
			const withoutSelectedItems = items.filter(i => getItemKey(i) !== getItemKey(selectedItem));
			sortedItems = selectedItems.concat(withoutSelectedItems);
		}

		return <View style={{ backgroundColor: '#fff', borderBottomRightRadius: 16,borderBottomLeftRadius: 16, shadowOpacity: 0.6, shadowRadius: 9, shadowColor: "#999", elevation: 10, marginBottom: 10}} >
			{/* <TouchableOpacity onPress={() => { this.props.onClickMenu(menuName) }}>
				<Text style={{ lineHeight: 30 }}>{selectedItem != '' && formatItem(selectedItem)}</Text>
			</TouchableOpacity> */}
			{
				// isOpen &&
				<View style={styles.menuView}>
					<View style={styles.menuList}>
						{sortedItems.map((item, index) => {
							const itemKey = getItemKey(item);
							const selectedItemKey = getItemKey(selectedItem);
							return (
								<Touch onPress={() => { this.props.onClickItem(item, index); }} key={itemKey} style={[selectedItemKey === itemKey ? styles.activeBtn : styles.noactiveBtn]}>
									<Text style={{ color: selectedItemKey === itemKey ? '#fff' : '#999', lineHeight: 30 }}>
										{formatItem(item)}
									</Text>
								</Touch>
							);
						})}
						<Touch onPress={() => { this.props.onClickMoreButton() }} style={styles.moreBtn}>
							<Text style={{ textAlign: 'center', fontSize: 12, lineHeight: 35, color: '#999' }}>+ 更多</Text>
						</Touch>
					</View>
				</View>
			}
		</View>
	}
}

export default HeaderMenu

const styles = StyleSheet.create({
	menuView: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 60,
		width: width,
	},
	menuList: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
		position: 'relative',
		zIndex: 99999,
		height: 30,
		overflow: 'hidden',
		paddingRight: 70,
		paddingLeft: 10,
	},
	activeBtn: {
		backgroundColor: '#00a6ff',
		borderRadius: 30,
		marginRight: 10,
		paddingLeft: 15,
		paddingRight: 15,
	},
	noactiveBtn: {
		backgroundColor: '#f5f5f8',
		borderRadius: 30,
		marginRight: 10,
		paddingLeft: 15,
		paddingRight: 15,
	},
	moreBtn: {
		position: 'absolute',
		right: 15,
		width: 50,
		backgroundColor: '#f5f5f8',
		borderRadius: 30,
	}
})
