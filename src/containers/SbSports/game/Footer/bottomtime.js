import {
	StyleSheet,
	WebView,
	Text,
	View,
	Animated,
	TouchableOpacity,
	Dimensions,
	Modal,
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
import moment from 'moment';


export default class _Bottomtime extends React.Component {
	state = {
		isBottomSheetVisible: false,
		active: 0
	};
	componentDidMount() {
		window.openTime && window.openTime(true)
	}
	componentWillUnmount() {
		window.openTime && window.openTime(false)
	}
	ShowBottomSheet = () => {
		this.setState({ isBottomSheetVisible: true });
	};
	render() {
		const { Selectdate, SportId } = this.props;
		const { isBottomSheetVisible } = this.state;
		/* 未来10天 */
		let Nextdays = [];
		for (var i = 0; i < 10; i++) {
			Nextdays.unshift(moment(new Date(new Date().setDate(new Date().getDate() + i))).format('YYYY/MM/DD'));
		}

		//格式不一樣，要轉一下，傳入的格式是 YYYY-MM-DD
		let SelectdateFormated = null;
		if (Selectdate) {
			SelectdateFormated = moment(Selectdate).format('YYYY/MM/DD');
		}
		window.Bottomtimes = (isBottomSheetVisible) => {
			this.setState({ isBottomSheetVisible })
		}
		return (
			<View>
				<Modal
					animationType="none"
					transparent={true}
					visible={isBottomSheetVisible}
					animationType={'slide'}
				>
					<View style={styles.depModal}>
						<Touch onPress={() => { this.setState({ isBottomSheetVisible: false }) }} style={{ width: width, height: height * 0.45 }}></Touch>
						<View style={styles.modalCenter}>
							<View>
								<Text style={{ lineHeight: 40, textAlign: 'center', fontSize: 18, fontWeight: 'bold', paddingBottom: 25 }}>选择日期</Text>
							</View>
							<View style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
								{Nextdays.sort().map((item, index) => {
									return (
										<Touch
											key={index}
											style={
												SportId == 1 && index == 0 && !Selectdate ? (
													styles.active
												) : SportId != 1 && index == 2 && !Selectdate ? (
													styles.active
												) : SelectdateFormated === item ? (
													styles.active
												) : (
													styles.noactive
												)
											}
											onPress={() => {
												this.setState({
													active: index
												});
												this.props.ChangeGame(item);
											}}
										>
											<Text style={{ 
												color: SportId == 1 && index == 0 && !Selectdate ? (
													'#fff'
												) : SportId != 1 && index == 2 && !Selectdate ? (
													'#fff'
												) : SelectdateFormated === item ? (
													'#fff'
												) : (
													'#999' 
												)
												}}>{item.substring(5)}</Text>
										</Touch>
									);
								})}

							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}



const styles = StyleSheet.create({
	depModal: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
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
