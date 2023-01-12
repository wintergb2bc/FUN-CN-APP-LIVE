/* 展示 關注(收藏)星 包含點擊   */

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

export default class FavouriteStar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}

		//指定要監控變化的prop
		this.MonitorProps = ['IsFavourite'];
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
		const { EventData, ToggleFavourite } = this.props;
		//console.log('FavouriteStarFavouriteStarFavouriteStar',EventData.IsFavourite)
		return EventData ? (
			<Touch
				style={{paddingRight: 6,}}
				onPress={() => ToggleFavourite(EventData)}
			>
				<Image resizeMode='stretch' source={EventData.IsFavourite ? require('../../../../images/starActive.png') : require('../../../../images/star.png')} style={{ width: 18, height: 18 }} />
			</Touch>
		) : null
	}
}
