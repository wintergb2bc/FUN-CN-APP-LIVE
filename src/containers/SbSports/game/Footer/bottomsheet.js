{
	/* 點擊菜單的「更多」出現的下浮窗 列表頁 和 詳情頁 都有使用  */
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
export default class _Bottomsheet extends React.Component {
	state = {
		isBottomSheetVisible: false
	};

	show = () => {
		this.setState({ isBottomSheetVisible: true });
	};
	render() {
		const {
			hasDefaultButton,
			defaultButtonText,
			items,
			selectedItem,
			formatItem,
			getItemKey,
			headerName,
			isLandscape,
			detailWidth,
			detailHeight,
		} = this.props;
		const { isBottomSheetVisible } = this.state;
		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return items && items.length > 0 ? (
			<View>
				<Modal
					animationType="none"
					transparent={true}
					visible={isBottomSheetVisible}
					animationType={'slide'}
					supportedOrientations={['portrait', 'landscape']}
					onRequestClose={() => { }}
				>
					<View style={isLandscape? styles.depModalMin: styles.depModal}>
						<Touch onPress={() => { this.setState({ isBottomSheetVisible: false }) }} style={styles.marsks}></Touch>
						{
							isLandscape &&
							<Touch  onPress={() => { this.setState({ isBottomSheetVisible: false }) }} style={[styles.LandscapeClose,{width: width, height: detailHeight,right: DeviceInfoIos? 35:0}]}></Touch>
						}
						<ScrollView
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							style={isLandscape? [styles.modalCenterLandscape,{width: width, height: detailHeight * 0.5,right: DeviceInfoIos? 35:0}]: styles.modalCenter}
						>
							<View>
								<Text style={{ lineHeight: 40, textAlign: 'center', fontSize: 18, fontWeight: 'bold', paddingBottom: 25 }}>{headerName}</Text>
							</View>
							<View style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
							{hasDefaultButton ? ( //默認按鈕(詳情頁使用)
								<Touch
									style={selectedItem === null? styles.active : styles.noactive}
									onPress={() => {
										this.setState({
											isBottomSheetVisible: false
										});
										this.props.onClickItem(null, -1);
									}}
								>
									<Text style={{ color: selectedItem === null ? '#fff' : '#999999' }}>{defaultButtonText!='' && defaultButtonText}</Text>
								</Touch>
							) : null}
								{items.map((item, index) => {
									const itemKey = getItemKey(item);
									const selectedItemKey = selectedItem ? getItemKey(selectedItem) : null;
									return (
										<Touch
											key={itemKey}
											style={selectedItemKey === itemKey ? styles.active : styles.noactive}
											onPress={() => {
												this.setState({
													isBottomSheetVisible: false
												});
												this.props.onClickItem(item, index);
											}}
										>
											<Text style={{ color: selectedItemKey === itemKey ? '#fff' : '#999999' }}>{formatItem(item)}</Text>
										</Touch>
									);
								})}
							</View>
						</ScrollView>
					</View>
				</Modal>
			</View>
		) : null;
	}
}



const styles = StyleSheet.create({
	marsks: {width: width, height: width },
	depModal: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	depModalMin: {
		flex: 1,
	},
	LandscapeClose: {
		position: 'absolute',
		top: 0,
		right: 0,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		zIndex: 1,
	},
	modalCenterLandscape: {
		position: 'absolute',
		bottom: 0,
		zIndex: 9,
		backgroundColor: '#fff',
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
	},
	modalCenter: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: width,
		height: height * 0.5,
		backgroundColor: '#fff',
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
	},
	active: {
		padding: 8,
		backgroundColor: '#00a6ff',
		borderRadius: 35,
		paddingLeft: 12,
		paddingRight: 12,
		marginLeft: 8,
		marginRight: 8,
		marginTop: 12,
	},
	noactive: {
		padding: 8,
		backgroundColor: '#ecedef',
		borderRadius: 35,
		paddingLeft: 12,
		paddingRight: 12,
		marginLeft: 8,
		marginRight: 8,
		marginTop: 12,
	}
})
