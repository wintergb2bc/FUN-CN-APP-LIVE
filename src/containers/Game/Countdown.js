import React, { Component } from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, View, } from "react-native";
import Touch from "react-native-touch-once";
import LinearGradient from "react-native-linear-gradient";
import { Actions } from "react-native-router-flux";
import { Toast } from "antd-mobile-rn";
import { vendorPiwik } from "../Vendors/vendorPiwik";
import PropTypes from "prop-types";
import { labelText, openNewWindowList, openNewWindowListIOS, piwikNameMap, sportsName } from "../../lib/data/game";
import * as Animatable from "react-native-animatable";
import actions from "../../lib/redux/actions/index";
import { connect } from "react-redux";
import PiwikAction from "../../lib/utils/piwik";

/*
 * @Author: Alan
 * @Date: 2022-02-08 17:48:31
 * @LastEditors: Alan
 * @LastEditTime: 2022-07-07 13:53:54
 * @Description: 奖池奖金滚动
 * @FilePath: \Mobile\src\components\Games\Countdown.js
 */
const { width, height } = Dimensions.get("window");

class Countdown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			JackpotNum: ['0', ',', '0', '0', '0', ',', '0', '0', '0', '.', '0', '0'],
			count: Math.round(Math.random() * 999999)
		};
		this.numberItem = React.createRef();
	}

	componentDidMount() {
		this.increaseNumber();
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	/**
		 * @description: 处理奖池数字
		 * @param {*} num
		 * @return {*}
		*/
	toJackpotNum(num) {
		num = num.toString();
		// 把奖池变成字符串
		if (num.length < 9) {
			num = '0' + num; // 如未满9位数，添加"0"补位
			this.toJackpotNum(num); // 递归添加"0"补位
		} else if (num.length === 9) {
			// 奖池数中加入逗号
			num = num.slice(0, 1) + ',' + num.slice(1, 4) + ',' + num.slice(4, 7) + '.' + num.slice(7, 9);
			this.setState({
				JackpotNum: num.split('')
			});
		}
	}

	/**
		 * @description:定时器
		 * @param {*}
		 * @return {*}
		*/
	increaseNumber() {
		this.timer = setInterval(() => {
			this.setState(
				{
					count:
						this.state.count +
						this.getRandomNumber(
							Math.round(Math.random() * this.getRandomNumber(1, 100)),
							Math.round(Math.random() * this.getRandomNumber(1, 99999999))
						)
				},
				() => {
					this.toJackpotNum(this.state.count);
				}
			);
		}, 3000);
	}

	/**
		 * @description: 生产区间随机数
		 * @param {*} min 最低
		 * @param {*} max 最大
		 * @return {*}
		*/
	getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	render() {
		const numberAry = this.state.JackpotNum
		return (
			numberAry.length > 0 &&
			numberAry.map((v, i) => {
				if (v !== "," && v !== ".") {
					return (
						<ImageBackground
							key={i}
							resizeMode="stretch"
							source={require("../../images/Slot_Countdown.png")}
							style={{
								width: 16,
								height: 24,
								justifyContent: "center",
								alignItems: "center",
								marginRight: 3,
							}}
						>
							<Animatable.View>
								<Text
									style={{
										fontWeight: "bold",
										fontSize: 16,
										color: "#fff",
									}}
								>
									{v}
								</Text>
							</Animatable.View>
						</ImageBackground>
					);
				} else {
					return (
						<Text
							style={{
								fontSize: 14,
								color: "#00A6FF",
								marginLeft: -3,
								marginTop: 15,
							}}
						>
							{v}
						</Text>
					);
				}
			})
		);
	}
}

export default Countdown;
