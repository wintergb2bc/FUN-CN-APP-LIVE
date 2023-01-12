/* 展示 時間 直播等圖示   */
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
import { dataIsEqual } from '../../../../lib/js/util';
import React from "react";
export default class TimeBlock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}

		//指定要監控變化的prop
		this.MonitorProps = ['IsRB', 'SportId', 'RBPeriodName', 'RBMinute', 'HasLiveStreaming', 'HasStatistic', 'HasVisualization', 'EventDate'];
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	  shouldComponentUpdate(nextProps, nextState) {
	      return !dataIsEqual(this.props.EventData, nextProps.EventData, this.MonitorProps);
	  }

	render() {
		const { EventData } = this.props;
		//console.log('asdasdsaaaaaaaaaaaaaaaaa')
		return (
			<View style={{ width: width * 0.25, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
				{
					EventData ?
						(EventData.IsRB ? (
							<View style={styles.tmeTxt}>
								{parseInt(EventData.SportId) !== 1 ? ( //足球不用展示時間段，其他的如果有就展示
									EventData.RBPeriodName !== null && (
										<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 12, paddingRight: 5 }}>
											{EventData.RBPeriodName}{' '}
											{EventData.RBMinute != '' && EventData.RBMinute + "'"}
										</Text>
									)
								) : //足球如果沒有分鐘數，就把時間段展示出來
									EventData.RBMinute != '' ? (
										<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 12, paddingRight: 5 }}>
											{EventData.RBMinute}'
										</Text>
									) : (
											<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 12, paddingRight: 5 }}>
												{EventData.RBPeriodName}
											</Text>
										)}

								{/* 是否有直播 HasVisualization */}
								{EventData.HasLiveStreaming && (
									// <ReactSVG
									//   className="Betting-video-svg"
									//   src="/svg/betting/video.svg"
									// />
									<Image resizeMode='stretch' source={require('../../../../images/betting/video.png')} style={{ width: 16, height: 16 }} />
								)}
								{/* 分析数据 */}
								{EventData.HasStatistic && (
									// <ReactSVG
									//   className="Betting-video-svg"
									//   src="/svg/betting/statistic.svg"
									// />
									<Image resizeMode='stretch' source={require('../../../../images/betting/statistic.png')} style={{ width: 16, height: 16 }} />
								)}
								{EventData.HasVisualization && (
									// <ReactSVG
									//   className="Betting-video-svg"
									//   src="/svg/betting/dh.svg"
									// />
									<Image resizeMode='stretch' source={require('../../../../images/betting/dh.png')} style={{ width: 16, height: 16 }} />
								)}
							</View>
						) : (
								<Text style={{ color: '#000', fontWeight: 'bold', fontSize: 13, fontSize: 12 }}>
									{EventData.getEventDateMoment().format(
										'MM/DD HH:mm'
									)}
								</Text>
							)) : null
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	tmeTxt: {
		height: 38,
		paddingLeft: 15,
		paddingRight: 15,
		borderBottomRightRadius: 10,
		backgroundColor: '#fde8e8',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	}
});