import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import moment from "moment";
import ModalDropdown from "react-native-modal-dropdown";
import CalendarPicker from "react-native-calendar-picker";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");

const dateRadioSource = [
  {
    text: "今天",
    piwik: "Betrecord_today",
    value: 0,
  },
  {
    text: "近7天",
    piwik: "Betrecord_yesterday",
    value: 1,
  },
  {
    text: "近30天",
    piwik: "Betrecord_7days",
    value: 2,
  },
  {
    text: "自定义",
    piwik: "Betrecord_daterange",
    value: 3,
  },
];

class BettingCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateRadio: 0,
      date: [new Date(), new Date()],
      visible4: false,
      selectedStartDate: this.props.startDate ? moment(this.props.startDate).format() : moment().subtract(1, 'day'),
      selectedEndDate: this.props.endDate ? moment(this.props.endDate).format() : moment().subtract(0, 'day'),
      minDate: moment().subtract(this.props.maxInterval || 90, 'day'),
      maxDate: moment().add(0, "day"),
      dateActive: false,
      dataErr: "",
      minRangeDuration: this.props.maxRange ? "1" : null,
      maxRangeDuration: this.props.maxRange ? this.props.maxRange : null,
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.changeRecordsDatePicker = this.changeRecordsDatePicker.bind(this);
  }

  changeDate() {
    const { minDate } = this.state;
    let minDates = minDate;
    // let selectedStartDate = moment(minDate[1]).format("YYYY-MM-DD");
    this.setState({ minDate: minDates });
  }

  // 日期區間確認
  dateChange() {
    if (this.state.dataErr != "") {
      return;
    }
    this.getAlreadyBetHistory(3);
    this.setState({ visible4: false, dateActive: true });
  }

  onDateChange(date, type) {
    let dataErr = false
    if (type === 'END_DATE') {
      if (date) {
        this.setState({
          selectedEndDate: date,
        }, () => {
          let startDate = this.state.selectedStartDate.toString()
          dataErr = new Date(startDate).getTime() > new Date(date.toString()).getTime() ? true : false
          this.setState({ dataErr: dataErr ? '结束时间不能小于开始时间' : '' })
        });
      }
    } else {
      this.setState({
        selectedStartDate: date,
      }, () => {
        let endDate = this.state.selectedEndDate ? this.state.selectedEndDate.toString() : new Date()
        dataErr = new Date(date.toString()).getTime() > new Date(endDate).getTime() ? true : false
        this.setState({ dataErr: dataErr ? '开始时间不能大于结束时间' : '' })
      });
    }
  }

  changeRecordsDatePicker(date, type) {
    let dataErr = false
    if (type === 'END_DATE') {
      if (date) {
        this.setState({
          selectedEndDate: date,
        }, () => {
          let startDate = this.state.selectedStartDate.toString()
          dataErr = Math.abs(moment(date).diff(moment(startDate), 'day')) >= 7;
          this.setState({ dataErr: dataErr ? '日期必须在7天内' : '' })
        });
      }
    } else {
      this.setState({
        selectedStartDate: date,
      }, () => {
        let endDate = this.state.selectedEndDate ? this.state.selectedEndDate.toString() : new Date()
        dataErr =  Math.abs(moment(date).diff(moment(endDate), 'day')) >= 7;
        this.setState({ dataErr: dataErr ? '日期必须在7天内' : '' })
      });
    }
  }
  getAlreadyBetHistory = (key) => {
    const { selectedStartDate, selectedEndDate } = this.state;
    let date = typeof key === "number" ? [new Date(), new Date()] : key;
    const startDate = selectedStartDate ? selectedStartDate.toString() : "";
    const endDate = selectedEndDate ? selectedEndDate.toString() : "";

    switch (dateRadioSource[key].value) {
      case 0:
        date = [new Date(), new Date()];
        break;
      case 1:
        // 7天
        date = [new Date(new Date().getTime() - 604800000), new Date()];
        break;
      case 2:
        // 30天
        date = [new Date(new Date().getTime() - 2592000000), new Date()];
        break;
      case 3:
        date = [startDate, endDate];
        break;
      default:
        break;
    }
    this.setState({
      date,
      dateRadio: dateRadioSource[key].value,
      dateActive: false,
    });
    this.props.selectChange(
      moment(date[0]).format("YYYY-MM-DD"),
      moment(date[1]).format("YYYY-MM-DD")
    );
  };

  //时间选择
  selectDate = (key) => {
    // 自定義日期
    if (key == 3) {
      this.setState({ visible4: true, dateRadio: 3 });
      return;
    }
    this.getAlreadyBetHistory(key);
  };

  _dropdown_renderButtonText(rowData) {
    return `${rowData.text}`;
  }

  //时间选择下拉列
  _dropdown_2_renderRow(rowData, rowID) {
    return (
      <TouchableOpacity
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 37,
          backgroundColor: "#fff",
          borderTopLeftRadius: rowID === "0" ? 10 : 0,
          borderTopRightRadius: rowID === "0" ? 10 : 0,
          borderBottomLeftRadius: rowID === "3" ? 10 : 0,
          borderBottomRightRadius: rowID === "3" ? 10 : 0,
        }}
      >
        <Text
          style={{ color: "#6B6B6B", textAlign: "center" }}
        >{`${rowData.text}`}</Text>
      </TouchableOpacity>
    );
  }

  _dropdown_2_renderSeparator() {
    return <View style={{ height: 1, backgroundColor: "#DBF2FF" }}/>;
  }

  changeDateFormat(date) {
    return date.replace(/\//g, "-");
  }

  getStartDate = () => {
    const {
      selectedStartDate,
    } = this.state;
    if (this.props.startDate) {
      return moment(this.props.startDate).format()
    } else {
      return selectedStartDate ? moment(selectedStartDate).format() : ""
    }
  }

  getEndDate = () => {
    const {
      selectedEndDate,
    } = this.state;
    if (this.props.endDate) {
      return moment(this.props.endDate).format()
    } else {
      return selectedEndDate ? moment(selectedEndDate).format() : ""
    }
  }

  render() {
    const {
      selectedStartDate,
      selectedEndDate,
      minDate,
      maxDate,
      dateActive,
      dataErr,
      dateRadio,
      minRangeDuration,
      maxRangeDuration,
    } = this.state;
    const startDate = this.getStartDate();
    const endDate = this.getEndDate();


    return (
      <View>
        {this.props.type && (this.props.type == "bankCard" || this.props.type == "records") ? (
          <TouchableOpacity
            onPress={() => this.setState({ visible4: true })}
            style={{
              justifyContent: "center",
              // alignItems: "flex-start",
              height: 30,
              width: 215,
              backgroundColor: "#0000000A",
              borderRadius: 15,
              paddingLeft: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: 170,
              }}
            >
              <Text style={{ fontSize: 12, color: this.props.type == "records" ? '#666' : "#000" }}>
                {moment(startDate).format("YYYY-MM-DD")}
              </Text>
              <Image
                resizeMode="stretch"
                source={require("../../images/icon/iconSwapright.png")}
                style={{ width: 16, height: 16 }}
              />
              <Text style={{ fontSize: 12, color: this.props.type == "records" ? '#666' : "#000" }}>
                {moment(endDate || new Date()).format(
                  "YYYY-MM-DD"
                )}
              </Text>
            </View>
            <Image
              resizeMode="stretch"
              source={require("../../images/icon/iconCalendar.png")}
              style={{
                width: 16,
                height: 16,
                position: "absolute",
                right: 10,
              }}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              flexDirection: "row",
              backgroundColor: this.props.type === "light" ? "#E6E6EA":"#33B8FF",
              borderRadius: 15,
              position: "relative",
            }}
          >
            {
              <ModalDropdown
                ref={(el) => (this._dropdown_2 = el)}
                defaultValue={dateRadioSource[dateRadio].text}
                defaultIndex={dateRadio}
                textStyle={styles.dropdown_D_text}
                dropdownStyle={[
                  styles.dropdown_DX_dropdown,
                  { width: dateRadio === 3 && dateActive ? 210 : 85 },
                ]}
                options={dateRadioSource}
                renderButtonText={(rowData) =>
                  this._dropdown_renderButtonText(rowData)
                }
                renderSeparator={() => this._dropdown_2_renderSeparator()}
                renderRow={this._dropdown_2_renderRow.bind(this)}
                onSelect={this.selectDate}
                style={[
                  styles.dropStyle,
                  { width: dateRadio === 3 && dateActive ? 210 : 85 },
                ]}
              >
                {dateRadio !== 3 ? (
                  <Text style={{ color: this.props.type === "light" ? "#666":"#fff", textAlign: "center" }}>
                    {dateRadioSource[dateRadio].text}
                  </Text>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {dateActive ? (
                      <>
                        <Text style={[styles.textnoactive, { paddingRight: 3,color: this.props.type === "light" ? "#666":"#fff" }]}>
                          {moment(startDate).format("YYYY/MM/DD")}
                        </Text>
                        {this.props.type === "light"?(
                          <Image
                            resizeMode="stretch"
                            source={require("../../images/icon/iconSwapright.png")}
                            style={{
                              width: 16,
                              height: 16,
                            }}
                          />
                        ):(
                          <Image
                            resizeMode="stretch"
                            source={require("../../images/icon/dateArrow.png")}
                            style={{
                              width: 16,
                              height: 16,
                            }}
                          />
                        )}
                        <Text style={[styles.textnoactive, { paddingLeft: 3,color: this.props.type === "light" ? "#666":"#fff" }]}>
                          {moment(endDate || new Date()).format("YYYY/MM/DD")}
                        </Text>
                      </>
                    ) : (
                      <Text style={[styles.textnoactive, { paddingRight: 5,color: this.props.type === "light" ? "#666":"#fff" }]}>
                        {dateRadioSource[dateRadio].text}
                      </Text>
                    )}
                  </View>
                )}
              </ModalDropdown>
            }

            {this.props.type === "light"?(
              <Image
                resizeMode="stretch"
                source={require("../../images/icon/icon-extand.png")}
                style={{
                  width: 16,
                  height: 16,
                  position: "absolute",
                  right: 5,
                }}
              />
            ):(
              <Image
                resizeMode="stretch"
                source={require("../../images/icon/icon-expand-white.png")}
                style={{
                  width: 16,
                  height: 16,
                  position: "absolute",
                  right: 5,
                }}
              />
            )}
          </View>
        )}
        <Modal
          transparent={true}
          animationType={"slide"}
          visible={this.state.visible4}
          onRequestClose={() => {
          }}
        >
          <View style={{ width, height, position: "relative" }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => this.setState({ visible4: false })}
              >
                <View
                  style={{
                    position: "absolute",
                    width,
                    height,
                    top: 0,
                    left: 0,
                    backgroundColor: "rgba(0,0,0,.5)",
                  }}
                />
              </TouchableOpacity>
            </View>
            {dataErr != "" && (
              <View style={styles.dataErr}>
                <View style={styles.dateErrCenter}>
                  <Text
                    style={{ color: "#eb2121", fontSize: 13, lineHeight: 32 }}
                  >
                    {dataErr}
                  </Text>
                </View>
              </View>
            )}
            <View
              style={{
                height: Platform.OS == "ios" ? 470 : 520,
                width: width,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  paddingTop: 20,
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ flex: 1, left: 18 }}>
                  <TouchableOpacity
                    onPress={() => this.setState({ visible4: false })}
                  >
                    <Text style={{ color: "#00a6ff" }}>取消</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1, color: "#000" }}>
                  <Text>选择日期</Text>
                </View>
                <View style={{ flex: 0.3 }}>
                  <TouchableOpacity onPress={() => this.dateChange()}>
                    <Text style={{ color: "#00a6ff" }}>确定</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  paddingTop: 20,
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={styles.textDateA}>
                  <Text
                    style={{
                      color: "#00a6ff",
                      flex: 0.9,
                      paddingLeft: 10,
                      fontSize: 16,
                    }}
                  >
                    从
                  </Text>
                  <Text style={{ color: "#00a6ff", fontSize: 16 }}>
                    {moment(selectedStartDate).format("YYYY/MM/DD")}{" "}
                  </Text>
                </View>

                <View style={{ width: 20 }}></View>
                <View style={styles.textDateB}>
                  <Text
                    style={{
                      color: "#000",
                      flex: 0.9,
                      paddingLeft: 10,
                      fontSize: 16,
                    }}
                  >
                    至
                  </Text>
                  <Text style={{ color: "#000", fontSize: 16 }}>
                    {moment(selectedEndDate || new Date()).format("YYYY/MM/DD")}{" "}
                  </Text>
                </View>
              </View>
              {console.log("type")}
              {console.log(this.props.type)}
              <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                <CalendarPicker
                  // firstDay={0}
                  selectedStartDate={this.getStartDate()}
                  selectedEndDate={this.getEndDate()}
                  onDateChange={this.props.type === "records" ? this.changeRecordsDatePicker : this.onDateChange}
                  allowRangeSelection={true}
                  allowBackwardRangeSelect={true}
                  minRangeDuration={minRangeDuration && parseInt(minRangeDuration)}
                  maxRangeDuration={maxRangeDuration && parseInt(maxRangeDuration)}

                  minDate={minDate}
                  maxDate={maxDate}
                  weekdays={["日", "一", "二", "三", "四", "五", "六"]}
                  months={[
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月",
                  ]}
                  previousTitle="＜"
                  nextTitle="＞"
                  scaleFactor={375}
                  previousTitleStyle={{ color: "#000" }}
                  nextTitleStyle={{ color: "#000" }}
                  selectedDayColor="#E6F6FF"
                  selectedDayTextColor="#000"
                  textStyle={{
                    fontFamily: "Cochin",
                    color: "#666",
                  }}
                  selectedRangeEndStyle={{
                    backgroundColor: "#00A6FF",
                  }}
                  selectedRangeEndTextStyle={{
                    color: "#fff",
                  }}
                  headerWrapperStyle={styles.headerWrapperStyle}
                  monthYearHeaderWrapperStyle={styles.monthYear}
                  dayLabelsWrapper={styles.dayLabelsWrapper}
                />

              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default BettingCalendar;

const styles = StyleSheet.create({
  dataErr: {
    display: "flex",
    justifyContent: "center",
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    top: 70,
    left: 0,
    width: width,
    zIndex: 999,
  },
  dateErrCenter: {
    backgroundColor: "#ffdada",
    borderRadius: 6,
    paddingLeft: 15,
    paddingRight: 15,
  },
  dayLabelsWrapper: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  headerWrapperStyle: {
    backgroundColor: "#F8F8F8",
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 15,
    width: width - 30,
  },
  monthYear: {
    display: "flex",
    flexDirection: "row-reverse",
  },
  textDateA: {
    borderColor: "#00a6ff",
    borderWidth: 1,
    borderRadius: 6,
    width: width / 2.3,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    backgroundColor: "#E6F6FF",
  },
  textDateB: {
    borderColor: "#bcbec3",
    borderWidth: 1,
    borderRadius: 6,
    width: width / 2.3,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
  },
  dropdown_D_text: {
    fontSize: 14,
    color: "#fff",
    textAlignVertical: "center",
    textAlign: "center",
  },
  dropdown_DX_dropdown: {
    height: 37 * 4 + 6,
    borderRadius: 10,
    marginTop: 8,
    borderColor: "#DBF2FF",
    borderWidth: 1,
  },
  dropStyle: {
    zIndex: 10,
    position: "relative",
    height: 27,
    justifyContent: "center",
    // borderRadius: 20
  },
  textnoactive: {
    textAlign: "center",
  },
});

BettingCalendar.propTypes = {
  // 預選開始日（多久前）
  startDate: PropTypes.number,
  // 可選區間
  maxInterval: PropTypes.number,
  // 一次可選多少區間
  maxRange: PropTypes.number,
  // 類別，關係到顯示的樣式
  type: PropTypes.string
};

