/* 展示 球隊名 比分 紅牌  */
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
import { dataIsEqual } from '../../../../lib/js/util';
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import React from "react";
import ImageForTeam from "../../../RNImage/ImageForTeam";

class TeamBlock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}

		//指定要監控變化的prop
		this.MonitorPropsForHOME = ['IsRB', 'HomeTeamId', 'HomeTeamName', 'HomeScore', 'HomeRedCard'];
		this.MonitorPropsForAWAY = ['IsRB', 'AwayTeamId', 'AwayTeamName', 'AwayScore', 'AwayRedCard'];
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	shouldComponentUpdate(nextProps, nextState) {
	  if (this.props.Vendor !== nextProps.Vendor) {
	    return true;
	  }
	  if (this.props.HomeOrAway !== nextProps.HomeOrAway) {
	    return true;
	  }
	  if (this.props.EventType !== nextProps.EventType ) {
	  	return true;
		}
	  return !dataIsEqual(this.props.EventData, nextProps.EventData, this['MonitorPropsFor' + this.props.HomeOrAway]);
	}

	render() {
		const { Vendor, EventData, ToSportsDetails, HomeOrAway, EventType } = this.props;

		let TeamId, TeamName, Score, RedCard,IconUrl;
		if (HomeOrAway === 'HOME') {
			TeamId = EventData.HomeTeamId;
			TeamName = EventData.HomeTeamName;
			Score = EventData.HomeScore;
			RedCard = EventData.HomeRedCard;
			IconUrl = EventData.HomeIconUrl;
		} else if (HomeOrAway === 'AWAY') {
			TeamId = EventData.AwayTeamId;
			TeamName = EventData.AwayTeamName;
			Score = EventData.AwayScore;
			RedCard = EventData.AwayRedCard;
			IconUrl = EventData.AwayIconUrl;
		}

		const IsCorrectScoreEvent = (EventType === 'CORRECTSCORE'); //全場波膽特殊樣式

		const HomeOrAwayIsOK = (['HOME', 'AWAY'].indexOf(HomeOrAway) !== -1)

		return EventData && HomeOrAwayIsOK ? (
			<Touch
				onPress={() => {
					ToSportsDetails(Vendor, EventData);
				}}
				style={[styles.lists, IsCorrectScoreEvent ? { width: width, justifyContent: 'flex-start' } : {}]}
			>
				<View style={[{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' },IsCorrectScoreEvent ? { width: 'auto', maxWidth: 0.7*width} : {}]}>
					{/* <LazyImageForTeam
						Vendor={Vendor}
						TeamId={TeamId}
						thisClassName="Game-logo"
					/> */}
					<ImageForTeam TeamId={TeamId} Vendor={Vendor} IconUrl={IconUrl} />
					<Text style={[{ paddingLeft: 5, width: width * 0.33, fontSize: 16, fontWeight: '600', lineHeight: 18, color: '#202939' },IsCorrectScoreEvent ? { width: 'auto'} : {}]} numberOfLines={1}>{TeamName}</Text>
				</View>
				{EventData.IsRB &&
				RedCard &&
				parseInt(RedCard) > 0 ? (
						<View style={[{ backgroundColor: '#eb2121', paddingLeft: 3, paddingRight: 3, borderRadius: 5 },IsCorrectScoreEvent ? { marginLeft: 12 } : {}]}>
							<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', lineHeight: 18 }}>
								{RedCard ?? 0}
							</Text>
						</View>
					) : null}
				<Text
					style={[{
						color:
							Score == 0
								? '#BCBEC3'
								: '#000000',
						paddingRight: 8,
						fontSize: 18,
						fontWeight: '600',
						lineHeight: 18,
					},IsCorrectScoreEvent ? { position: 'absolute', right: 16} : {}]}
				>
					{EventData.IsRB ? (Score ?? 0) : ''}
				</Text>
			</Touch>
		) : null
	}
}

export default TeamBlock

const styles = StyleSheet.create({
	lists: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		height: 42,
		width: width * 0.5,
	},
});


export class TeamBlockHorizontal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}

		//指定要監控變化的prop
		this.MonitorPropsForHOME = ['IsRB', 'HomeTeamId', 'HomeTeamName', 'HomeScore', 'HomeRedCard'];
		this.MonitorPropsForAWAY = ['IsRB', 'AwayTeamId', 'AwayTeamName', 'AwayScore', 'AwayRedCard'];
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	// shouldComponentUpdate(nextProps, nextState) {
	//   if (this.props.Vendor !== nextProps.Vendor) {
	//     return true;
	//   }
	//   if (this.props.HomeOrAway !== nextProps.HomeOrAway) {
	//     return true;
	//   }
	//   return !dataIsEqual(this.props.EventData, nextProps.EventData, this['MonitorPropsFor' + this.props.HomeOrAway]);
	// }

	render() {
		const { Vendor, EventData, ToSportsDetails, HomeOrAway } = this.props;

		let TeamId, TeamName, Score, RedCard, IconUrl;
		if (HomeOrAway === 'HOME') {
			TeamId = EventData.HomeTeamId;
			TeamName = EventData.HomeTeamName;
			Score = EventData.HomeScore;
			RedCard = EventData.HomeRedCard;
			IconUrl = EventData.HomeIconUrl;
		} else if (HomeOrAway === 'AWAY') {
			TeamId = EventData.AwayTeamId;
			TeamName = EventData.AwayTeamName;
			Score = EventData.AwayScore;
			RedCard = EventData.AwayRedCard;
			IconUrl = EventData.AwayIconUrl;
		}

		const HomeOrAwayIsOK = (['HOME', 'AWAY'].indexOf(HomeOrAway) !== -1)

		return EventData && HomeOrAwayIsOK ? (
			<Touch
				onPress={() => {
					PiwikEvent('Odds', 'Submit', 'Odds_mainpage_horizontal')
					ToSportsDetails(Vendor, EventData);
				}}
				style={[{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: (width * 0.5) - 30, height: 40}, HomeOrAway === 'AWAY' ? {flexDirection: 'row-reverse'} : {}]}
			>
				{EventData.IsRB &&
				RedCard &&
				parseInt(RedCard) > 0 ? (
					<View style={[{ backgroundColor: '#eb2121', borderRadius: 1, paddingHorizontal:3, marginLeft: 0, marginRight: 11 }, HomeOrAway === 'AWAY' ? {marginLeft: 11, marginRight: 0} : {}]}>
						<Text style={{ color: '#fff', fontSize: 12, lineHeight:18, fontWeight: '600' }}>
							{1}{RedCard ?? 0}
						</Text>
					</View>
				) : null}
				<View style={[{ maxWidth: (width * 0.5) - 100, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginLeft: 0, marginRight: 4 }, HomeOrAway === 'AWAY' ? {flexDirection: 'row-reverse', marginLeft: 4, marginRight: 0} : {}]}>
					<Text style={{ fontSize: 16, fontWeight: '600', color: '#202939'}} numberOfLines={1}>{TeamName}</Text>
				</View>
				<View style={[{ marginLeft: 0, marginRight: 13 }, HomeOrAway === 'AWAY' ? { marginLeft: 13, marginRight: 0} : {}]}>
					<ImageForTeam TeamId={TeamId} Vendor={Vendor} IconUrl={IconUrl} />
				</View>
				<Text
					style={{
						color:
							Score == 0
								? '#BCBEC3'
								: '#000000',
						fontSize: 20,
						fontWeight: '600',
					}}
				>
					{EventData.IsRB ? (Score ?? 0) : ''}
				</Text>
			</Touch>
		) : null
	}
}
