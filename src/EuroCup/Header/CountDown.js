/* 
	投注页面 公用头部  赛事比分概况
*/
import React from "react";
import moment from 'moment';
import ReactNative, {
	StyleSheet,
	Text,
	Image,
	View,
	Platform,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	ImageBackground,
	Linking,
	WebView,
	NativeModules,
	Alert,
	UIManager,
	Modal
} from "react-native";
const { width, height } = Dimensions.get("window");

//左補0
const padLeft = (str, length) => {
	if (str.length >= length)
		return str;
	else
		return padLeft("0" + str, length);
}

class CountDown extends React.Component {
	constructor() {
		super();

		//如果時間已經超過就直接不顯示，也不會發起倒計時
		this.targetTime = moment(EuroCup2021CountDownEndTime);
		const diffSeconds = this.targetTime.diff(moment(), 'seconds');
		if (diffSeconds > 0) {
			const duration = moment.duration(diffSeconds, 'seconds');
			this.state = {
				isVisible: true,
				day: padLeft(Math.floor(duration.asDays()) + '', 2),
				hour: padLeft(duration.hours() + '', 2),
				minute: padLeft(duration.minutes() + '', 2),
				second: padLeft(duration.seconds() + '', 2),
			}
		} else {
			this.state = {
				isVisible: false,
				day: 0,
				hour: 0,
				minute: 0,
				second: 0,
			};
		}

		this.countDown = this.countDown.bind(this);
		this.timer = null;
	}
	componentDidMount() {
		if (this.state.isVisible) {
			this.timer = setInterval(this.countDown, 1000);
		} else {
			this.props.setNoCountDown(true);
		}
	}

	componentWillUnmount() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}

	countDown() {
		const diffSeconds = this.targetTime.diff(moment(), 'seconds');
		if (diffSeconds <= 0) {
			this.props.setNoCountDown(true);
			this.setState({ isVisible: false });
			if (this.timer) {
				clearInterval(this.timer);
			}
		} else {
			const duration = moment.duration(diffSeconds, 'seconds');
			this.setState({
				day: padLeft(Math.floor(duration.asDays()) + '', 2),
				hour: padLeft(duration.hours() + '', 2),
				minute: padLeft(duration.minutes() + '', 2),
				second: padLeft(duration.seconds() + '', 2),
			})
		}
	}

	render() {
		const { isVisible, day, hour, minute, second } = this.state;
		return (
			isVisible &&
			<View style={{ paddingLeft: 10, marginTop: 10, }}>
				<ImageBackground
					source={require("../../images/EuroCup.png")}
					style={{ width: width - 20, height: (width - 20) * 0.334, display: 'flex', justifyContent: 'center', alignItems: 'center', }}
				>
					<Text style={{ color: '#fff', fontSize: 13, paddingBottom: 12, }}>开赛倒数</Text>
					<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row' }}>
						<View style={styles.dateList}>
							<Text style={{ color: '#202939', fontSize: 13, }}>{day}</Text>
						</View>
						<Text style={styles.dateTxt}>天</Text>
						<View style={styles.dateList}>
							<Text style={{ color: '#202939', fontSize: 13, }}>{hour}</Text>
						</View>
						<Text style={styles.dateTxt}>时</Text>
						<View style={styles.dateList}>
							<Text style={{ color: '#202939', fontSize: 13, }}>{minute}</Text>
						</View>
						<Text style={styles.dateTxt}>分</Text>
						<View style={styles.dateList}>
							<Text style={{ color: '#202939', fontSize: 13, }}>{second}</Text>
						</View>
						<Text style={styles.dateTxt}>秒</Text>
					</View>
				</ImageBackground>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	dateList: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 30,
		height: 30,
		backgroundColor: '#FAFAFA',
		borderRadius: 5,

	},
	dateTxt: { color: '#fff', fontSize: 13, paddingLeft: 5, paddingRight: 5 },
})

export default CountDown;
