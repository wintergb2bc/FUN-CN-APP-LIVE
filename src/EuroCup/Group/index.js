import React, { Component } from "react";
import {
	Text,
	Platform,
	StyleSheet,
	View,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	Clipboard,
	Image,
	ART,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Flex, Toast, Modal, ActivityIndicator } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import euroCommandStyle from './common/euroCommonStyle'
import EuroGroups from './EuroGroupList'
import { euro2021Teams, latestRoundMap } from './common/commonData';
import { getRequestBody, postRequestBody } from './Request'
import natureCompare from 'natural-compare';

const { width, height } = Dimensions.get("window");
const commandStyle = euroCommandStyle

export default class EuroGroup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			EuroGroupList: [], // 賽組信息
			seasonId: seasonId, // 賽季, 23 = 2016 , 24 = 2020 歐洲杯
			type: 'league', // cup or league
			currentPage: 1,
			perPageSize: 1000,
			teamList: [],
			teamListFirst8: [], //多此一句的前8
			showMore: true, //多此一舉的 更多 按鈕
		};
	}

	componentDidMount() {
		this.setState({ loading: true });
		//默認值
		let defaultTeamList = euro2021Teams.map(e => {
			return {
				id: e.key,
				name: e.note,
				group: '',
				chanceToWin: '',
				teamId: '',
				teamStat: '',
			}
		});

		const CACHE_KEY = 'STAT_LIST';
		const cachedDataJSON = localStorage.getItem(CACHE_KEY);
		if (cachedDataJSON) {
			let cachedData = JSON.parse(cachedDataJSON);
			if (cachedData) {
				defaultTeamList = cachedData;
			}
		}

		const getFirst8 = (list) => {
			return (list && list.length > 0) ? list.filter((item, index) => index < 8) : [];
		}

		this.setState({
			//先提供默認/緩存數據 下面才查詢，反應速度比較快
			teamListFirst8: getFirst8(defaultTeamList),
			teamList: defaultTeamList
		})
		const { seasonId, type, currentPage, perPageSize } = this.state

		const reqData = {
			currentPage: currentPage,
			perPageSize: perPageSize,
			platform: Platform.OS == 'ios' ? 'IOS' : 'ANDROID',
			seasonId: seasonId,
			type: type,
		}
		postRequestBody(EuroCupDomain + ApiPort.getEuroGroupList, reqData)
			.then(groupData => {

				console.log('===groupData', groupData);

				let teamDataMap = {};
				//這個API用來收集chanceToWin 還有 teamcode跟teamid的對應關係
				if (groupData && groupData.data && groupData.data.length > 0) {
					let teamIds = [];
					let teamId2TeamCodeMap = {};
					groupData.data.map(g => {
						if (g.teams && g.teams.length > 0) {
							g.teams.map(t => {
								const safeTeamCode = t.code.replace(/ /g, "-");
								teamDataMap[safeTeamCode] = {
									teamId: t.id,
									teamName: t.name,
									chanceToWin: t.chanceToWin,
								}
								teamIds.push(t.id);
								teamId2TeamCodeMap[t.id] = safeTeamCode;
							})
						}
					})
					const { seasonId } = this.state

					const reqData = {
						id: teamIds,
						platform: Platform.OS == 'ios' ? 'IOS' : 'ANDROID',
						seasonId: seasonId,
					}
					postRequestBody(EuroCupDomain + ApiPort.getEuroTeamStat, reqData)
						.then(teamsData => {

							console.log('===teamsData', teamsData);
							this.setState({ loading: false });
							//這個API只用來收集 LatestRound
							if (teamsData && teamsData.length > 0) {
								teamsData.map(t => {
									const thisTeamCode = teamId2TeamCodeMap[t.teamId];
									if (thisTeamCode && teamDataMap[thisTeamCode]) {
										teamDataMap[thisTeamCode].latestRound = t.latestRound;
										teamDataMap[thisTeamCode].teamStat = t;
									}
								})
							}
							let teamList = euro2021Teams.map(e => {
								let defaultData = {
									id: e.key,
									name: e.note,
									group: '',
									chanceToWin: '',
									teamId: '',
									teamStat: '',
								}
								const teamData = teamDataMap[e.key];
								if (teamData) {
									defaultData.teamStat = teamData,
									defaultData.teamId = teamData.teamId;
									defaultData.name = teamData.teamName;
									defaultData.group = latestRoundMap[teamData.latestRound] ? latestRoundMap[teamData.latestRound].name : '';
									defaultData.chanceToWin = ((latestRoundMap[teamData.latestRound] && !latestRoundMap[teamData.latestRound].isout) && teamData.chanceToWin) ? teamData.chanceToWin : 0;
								}
								return defaultData;
							})

							//按英文字母排
							const sort1 = (left, right) => {
								var nameA = left.id.toLowerCase(), nameB = right.id.toLowerCase();
								if (nameA < nameB) //sort string ascending
									return -1;
								if (nameA > nameB)
									return 1;
								return 0; //default return value (no sorting)
							}

							//按奪冠機率高＝>低排序 這個排出來是低->高 後面還要反轉一下
							const sort2 = (left, right) => {
								const a = (latestRoundMap[left.latestRound] ? latestRoundMap[left.latestRound].sortId : 0) + '_' + left.chanceToWin;
								const b = (latestRoundMap[right.latestRound] ? latestRoundMap[right.latestRound].sortId : 0) + '_' + right.chanceToWin;
								const r = natureCompare(a, b); //自然排序
								//反向
								if (r === 0) return;
								if (r > 0) return -1;
								if (r < 0) return 1;
							}
							//先按英文字母排，然後按 淘汰/奪冠機率排
							teamList = teamList.sort(sort1).sort(sort2);

							//緩存
							localStorage.setItem(CACHE_KEY, JSON.stringify(teamList));

							this.setState({
								teamListFirst8: getFirst8(teamList),
								teamList: teamList,
							})
						})

				}
			})
	}

	componentWillMount() {
	}



	render() {
		const {teamListFirst8, teamList, showMore, loading} = this.state;

		let thisTeamList = teamList;
		if (showMore) {
			thisTeamList = teamListFirst8;
		}
		return (
			<View style={styles.rootView} >
				{
					thisTeamList.length > 0 && <EuroGroups EuroGroupData={thisTeamList} showMoreBtn={() => {this.setState({showMore: false})}} />
				}
				{loading ? (
					<View style={styles.activityIndicator}>
						<ActivityIndicator
							animating={loading}
							size="large"
						// text="加载中..."
						/>
					</View>
				) : null}
			</View >
		);
	}
}

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},


});
