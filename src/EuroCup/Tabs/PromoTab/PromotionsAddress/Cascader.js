const { width, height } = Dimensions.get("window");
import ReactNative, {
	StyleSheet,
	Text,
	Image,
	View,
	Dimensions,
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";

import React from 'react';
class CeshiContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			province: '省',
			city: '市',
			county: '区',
			provinces: [],
			cities: [],
			counties: [],
			provinceIds: '',
			cityIds: '',
			countyIds: '',
			selectFirst: this.props.pagetype == 'add',

		};
	}

	componentDidMount() {
		if (this.props.pagetype != 'add') {
			const { provinceName, districtName, townName, province = "", city = "", village = "" } = this.props.selectData
			this.setState({ province: provinceName || province, city: districtName || city, county: townName || village })
		}
		this.RewardUserProvince('default');
	}


	/* ---------省----------- */
	RewardUserProvince = (status) => {
		const { pagetype } = this.props
		if (pagetype == 'readOnly') { return }

		fetchRequest(ApiPort.AddressProvince, 'GET').then((res) => {
			if (res.result) {
				this.setState({ provinces: res.result, },
					() => {
						let provinceIds = ''
						if (pagetype == 'edit') {
							const obj = res.result.find(
								(item) => item.name == this.state.province
							);
							provinceIds = obj ? obj.id : ''
						} else {
							provinceIds = res.result[0].id
						}
						this.RewardUserDistricts(status, provinceIds)
						this.setState({ provinceIds }, () => { this.backAdress() })
					}
				);
			}
		});
	};

	/* -------------市---------- */
	RewardUserDistricts = (status, provinceId) => {
		const { pagetype } = this.props
		this.setState({ cities: [] })
		fetchRequest(ApiPort.AddressDistrict + 'provinceId=' + provinceId + '&', 'GET').then((res) => {
			if (res) {
				this.setState({ cities: res.result },
					() => {
						let cityIds = '', city = ''
						if (pagetype == 'edit' && status == 'default') {
							const obj = res.result.find(
								(item) => item.name == this.state.city
							);
							cityIds = obj ? obj.id : ''
						} else {
							cityIds = res.result[0].id
							city = res.result[0].name
							status != 'default' && this.setState({ city })
						}
						this.RewardUserRewardTown(status, cityIds);
						this.setState({ cityIds }, () => { this.backAdress() })
					}
				);
			}
		});
	};

	/* --------------县------------- */
	RewardUserRewardTown = (status, districtId) => {
		this.setState({ counties: [] })
		const { pagetype } = this.props
		fetchRequest(ApiPort.AddressTown + 'districtId=' + districtId + '&', 'GET').then((res) => {
			if (res && res.result) {
				this.setState({ counties: res.result },
					() => {
						let countyIds = '', county = ''
						if (pagetype == 'edit' && status == 'default') {
							const obj = res.result.find(
								(item) => item.name == this.state.county
							);
							countyIds = obj ? obj.id : ''
						} else {
							countyIds = res.result[0].id
							county = res.result[0].name
							status != 'default' && this.setState({ county })
						}
						this.setState({ countyIds }, () => { this.backAdress() })
					}
				);
			}
		});
	};

	//省份
	_dropdown_1_renderButtonText(rowData) {
		return rowData.name
	}
	//省份
	_dropdown_1_renderRow(rowData, rowID, highlighted) {
		return (
			<View style={{ width: (width - 60) * 0.32, padding: 15 }}>
				<Text style={{ color: '#666' }}>
					{rowData.name}
				</Text>
			</View>
		);
	}
	selectBtn1 = (key) => {
		let id = this.state.provinces[key].id
		this.setState({ provinceIds: id, selectFirst: false }, () => {
			this.RewardUserDistricts('', id)
		})
	}


	//市
	_dropdown_2_renderButtonText(rowData) {
		return rowData.name
	}
	//市
	_dropdown_2_renderRow(rowData, rowID, highlighted) {
		return (
			<View style={{ width: (width - 60) * 0.32, padding: 15 }}>
				<Text style={{ color: '#666' }}>
					{rowData.name}
				</Text>
			</View>
		);
	}
	selectBtn2 = (key) => {
		let id = this.state.cities[key].id
		this.setState({ cityIds: id }, () => {
			this.RewardUserRewardTown('', id)
		})
	}


	//区
	_dropdown_3_renderButtonText(rowData) {
		return rowData.name
	}
	//区
	_dropdown_3_renderRow(rowData, rowID, highlighted) {
		return (
			<View style={{ width: (width - 60) * 0.32, padding: 15 }}>
				<Text style={{ color: '#666' }}>
					{rowData.name}
				</Text>
			</View>
		);
	}
	selectBtn3 = (key) => {
		let id = this.state.counties[key].id
		this.setState({ countyIds: id }, () => { this.backAdress() })
	}

	backAdress() {

		this.props.AddressState({
			province: this.state.provinceIds,
			city: this.state.cityIds,
			county: this.state.countyIds,
		})
	}

	render() {
		const { provinces, cities, counties, province, city, county, selectFirst } = this.state;
		console.log(this.state);
		let readOnly = this.props.pagetype == 'readOnly' ? true : false;
		let disables = this.props.pagetype == 'readOnly' ? true : selectFirst
		return (
			<View style={{ flex: 1 }}>
				{!readOnly && provinces.length > 0 ? (
					<View style={{ width: width - 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
						<View style={styles.selectView}>
							<ModalDropdown
								ref={el => (this._dropdown_1 = el)}
								defaultValue={province}
								disabled={readOnly}
								textStyle={styles.dropdown_D_text}
								dropdownStyle={styles.dropdown_DX_dropdown}
								options={provinces}
								renderButtonText={rowData =>
									this._dropdown_1_renderButtonText(rowData)
								}
								renderRow={this._dropdown_1_renderRow.bind(this)}
								onSelect={this.selectBtn1}
							/>
							<View style={{ position: 'absolute', right: 10, top: 10, zIndex: -1 }}>
								<Image resizeMode='stretch' source={require('../../../../images/down.png')} style={{ width: 16, height: 16 }} />
							</View>
						</View>

						<View style={styles.selectView}>
							{
								cities.length > 0 &&
								<ModalDropdown
									ref={el => (this._dropdown_2 = el)}
									defaultValue={city}
									disabled={disables}
									textStyle={styles.dropdown_D_text}
									dropdownStyle={styles.dropdown_DX_dropdown}
									options={cities}
									renderButtonText={rowData =>
										this._dropdown_2_renderButtonText(rowData)
									}
									renderRow={this._dropdown_2_renderRow.bind(this)}
									onSelect={this.selectBtn2}
								/>
							}
							<View style={{ position: 'absolute', right: 10, top: 10, zIndex: -1 }}>
								<Image resizeMode='stretch' source={require('../../../../images/down.png')} style={{ width: 16, height: 16 }} />
							</View>
						</View>

						<View style={styles.selectView}>
							{
								counties.length > 0 &&
								<ModalDropdown
									ref={el => (this._dropdown_3 = el)}
									defaultValue={county}
									disabled={disables}
									textStyle={styles.dropdown_D_text}
									dropdownStyle={styles.dropdown_DX_dropdown}
									options={counties}
									renderButtonText={rowData =>
										this._dropdown_3_renderButtonText(rowData)
									}
									renderRow={this._dropdown_3_renderRow.bind(this)}
									onSelect={this.selectBtn3}
								/>
							}
							<View style={{ position: 'absolute', right: 10, top: 10, zIndex: -1 }}>
								<Image resizeMode='stretch' source={require('../../../../images/down.png')} style={{ width: 16, height: 16 }} />
							</View>
						</View>
					</View>
				) : null}
				{readOnly && (
					<View style={{ width: width - 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
						<View style={styles.readOnlySelectView}>
							<Text style={{color: "#202939", fontSize: 14}}>{province}</Text>
							<View style={{ position: 'absolute', right: 10, top: 10, zIndex: -1 }}>
								<Image resizeMode='stretch' source={require('../../../../images/down.png')} style={{ width: 16, height: 16 }} />
							</View>
						</View>

						<View style={styles.readOnlySelectView}>
							<Text style={{color: "#202939", fontSize: 14}}>{city}</Text>
							<View style={{ position: 'absolute', right: 10, top: 10, zIndex: -1 }}>
								<Image resizeMode='stretch' source={require('../../../../images/down.png')} style={{ width: 16, height: 16 }} />
							</View>
						</View>

						<View style={styles.readOnlySelectView}>
							<Text style={{color: "#202939", fontSize: 14}}>{county}</Text>
							<View style={{ position: 'absolute', right: 10, top: 10, zIndex: -1 }}>
								<Image resizeMode='stretch' source={require('../../../../images/down.png')} style={{ width: 16, height: 16 }} />
							</View>
						</View>
					</View>
				)}
			</View>
		);
	}
}

export default CeshiContainer;

const styles = StyleSheet.create({
	dropdown_D_text: {
		paddingBottom: 3,
		fontSize: 14,
		color: "#666666",
		textAlignVertical: "center",
		lineHeight: 30,
		paddingLeft: 10,
		width: (width - 60) * 0.33,
	},
	dropdown_DX_dropdown: {
		borderRadius: 1,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.6,
		shadowRadius: 5,
		shadowColor: "#666",
		//注意：这一句是可以让安卓拥有灰色阴影
		elevation: 4
	},
	selectView: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		width: (width - 60) * 0.33,
		height: 40,
		borderWidth: 1,
		borderColor: '#E3E3E8',
		borderRadius: 5,
	},
	readOnlySelectView: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		width: (width - 60) * 0.33,
		height: 40,
		borderWidth: 1,
		backgroundColor: "#EFEFF4",
		borderColor: '#EFEFF4',
		borderRadius: 5,
		paddingLeft: 10
	},
})
