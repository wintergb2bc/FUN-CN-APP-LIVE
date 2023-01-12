/* 猜冠軍賽事 */

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
import { connect } from 'react-redux';
import ImageForLeague from "../../RNImage/ImageForLeague";


class OutRightEvent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	render() {
		const {Vendor, EventData, ToggleFavourite, ToSportsDetails, ClickOdds} = this.props;
		const isComboBet = this.props.betCartInfo['isComboBet' + Vendor.configs.VendorName];
		const betCartData = this.props.betCartInfo['betCart' + Vendor.configs.VendorName];

		return (
			<View style={{borderWidth: 1, borderColor: '#efeff4'}}>
				<View style={styles.titleList}>
					<Text style={{ color: '#000', paddingRight: 25, paddingLeft: 5 }}>
						{EventData.getEventDateMoment().format(
							'MM/DD HH:mm'
						)}
					</Text>
					<Touch
						onPress={() => ToggleFavourite(EventData)}
					>
						<Image resizeMode='stretch' source={EventData.IsFavourite ? require('../../../images/starActive.png') : require('../../../images/star.png')} style={{ width: 20, height: 20 }} />
					</Touch>
					<Text style={{ paddingLeft: 25, color: '#bcbec3', fontSize: 12 }}>+{EventData.TotalLineCount}</Text>
				</View>
				<Text style={{ color: '#999', lineHeight: 30, paddingLeft: 10 }}>{EventData.OutRightEventName}</Text>
				<View>

					{EventData.Lines &&
						EventData.Lines[0] &&
						EventData.Lines[0].Selections.map(
							(SelectionData) => {
								let CheckSelect =
									(isComboBet == true)
										? betCartData.filter(
											(i) =>
												i.SelectionId ==
												SelectionData.SelectionId
										)
										: [];

								const LineIsLocked = EventData.Lines[0].IsLocked;
								return (
									<View key={SelectionData.SelectionId} style={styles.lists}>
										<Touch
											onPress={() => {
												ToSportsDetails(Vendor, EventData);
											}}
											style={styles.lists}
										>
											<ImageForLeague LeagueId={SelectionData.LeagueId} Vendor={Vendor} />
											<Text style={{ color: '#000', fontWeight: 'bold', paddingLeft: 5 }}>{SelectionData.SelectionName}</Text>
										</Touch>
										<View style={CheckSelect != '' ? styles.active : styles.noactive}>
											{SelectionData.Odds ? (
												LineIsLocked ? (
													<Image resizeMode='stretch' source={require('../../../images/betting/Locked.png')} style={{ width: 15, height: 15 }} />
												) : (
													<Touch
														onPress={() => {
															ClickOdds(SelectionData)
														}}
													>
														<Text>{SelectionData.DisplayOdds}</Text>
													</Touch>
												)
											) : (
													<Text style={{color: '#bcbec3'}}>—</Text>
												)}
										</View>
									</View>
								);
							}
						)}
				</View>
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	betCartInfo: state.betCartInfo,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(OutRightEvent)

const styles = StyleSheet.create({
	titleList: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		height: 35,
	},
	lists: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		height: 33,
		marginBottom: 5,
	},
	active: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#e6f6ff',
		borderRadius: 5,
		height: 33,
		marginBottom: 5,
		borderColor: '#00a6ff',
		borderWidth: 1,
		width: width * 0.38
	},
	noactive: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#f7f7f7',
		borderRadius: 5,
		height: 33,
		marginBottom: 5,
		width: width * 0.38
	},
});
