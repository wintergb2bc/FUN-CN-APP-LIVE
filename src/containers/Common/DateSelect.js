import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableHighlightBase,
} from "react-native";
import {
  Button,
  WhiteSpace,
  WingBlank,
  InputItem,
  Toast,
  Flex,
  Switch,
  List,
  Radio,
  DatePicker,
  Modal,
} from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import Carousel, { Pagination } from "react-native-snap-carousel";
import ModalDropdown from "react-native-modal-dropdown";
import Touch from "react-native-touch-once";
import { GetDateStr } from "../../lib/utils/date";
const { width, height } = Dimensions.get("window");
import ListItems from "antd-mobile-rn/lib/list/style/index.native";
const newStyle = {};
for (const key in ListItems) {
  if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(ListItems[key]) };
    newStyle[key].opacity = 0;
    newStyle[key].color = "transparent";
    newStyle[key].backgroundColor = "transparent";
    newStyle[key].height = 30;
    newStyle[key].width = width;
  }
}
// const DateList = [
//     { name: '今天', key: 0 },
//     { name: '近7天', key: 1 },
//     { name: '近30天', key: 2 },
//     { name: '自定义', key: 3 },
//     // { name: '今天', key: 0 },
// ];

// const DateSelect = Radio.RadioItem;

class DateSelect extends React.Component<any, any> {
  inputRef: any;

  constructor(props) {
    super(props);
    this.state = {
      befosDate: GetDateStr(this.props.beforeDate || 0),
      minDate: GetDateStr(this.props.maxInterval || -90), // 提款限額選擇日期365天，其餘預設90天
      timeInterval: this.props.timeInterval || false, // 提款限額選擇時間間距，false表示無間距
      dateType: "record",
      nowDate: GetDateStr(0),
      beforTime: "",
      newtime: "",
      beforTimeST: "",
      newtimeST: "",
      changeDate: false, //自定义选择时间保留原本的
      DatePage: false,
      activDateList: 0, //为了自定义显示为当前选择的时间
      DateList: this.props.DateList,
    };
    this.changeDateFormat = this.changeDateFormat.bind(this);
  }
  componentDidMount(props) {
    //时间处理
    let beforTime =
      this.props.dateType == "record"
        ? this.changeDateFormat(GetDateStr(-6))
        : this.setTime(GetDateStr(0));
    let newtime = this.setTime(GetDateStr(0));
    this.setState({ beforTime, newtime });
  }

  setTime(value) {
    let settime =
      value &&
      value.split("/")[0] +
        "年" +
        value.split("/")[1] +
        "月" +
        value.split("/")[2] +
        "日";
    return settime;
  }

  //时间选择
  _dropdown_renderButtonText(rowData) {
    return `${rowData.name}`;
  }
  //时间选择下拉
  _dropdown_1_renderRow(rowData, rowID, highlighted) {
    return (
      <View
        style={{
          width: 70,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 37,
          backgroundColor: "#fff",
          borderRadius: 5,
        }}
      >
        <Text
          style={{ color: highlighted ? "red" : "#6B6B6B" }}
        >{`${rowData.name}`}</Text>
      </View>
    );
  }
  //时间选择下拉
  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    return (
      <View
        style={{
          width: 230,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 35,
          backgroundColor: "#F0F0F2",
          borderBottomColor: "#fff",
          borderBottomWidth: 1,
        }}
      >
        <Text
          style={{ color: highlighted ? "red" : "#222222" }}
        >{`${rowData.name}`}</Text>
      </View>
    );
  }

  befosDate = (value) => {
    let Wdate = new Date(value);
    let Wy = Wdate.getFullYear();
    let Wm = Wdate.getMonth() + 1;
    Wm = Wm < 10 ? "0" + Wm : Wm;
    let Wd = Wdate.getDate();
    Wd = Wd < 10 ? "0" + Wd : Wd;
    const befosDate = Wy + "/" + Wm + "/" + Wd;

    let news = new Date(this.state.nowDate).getTime();
    let befors = new Date(befosDate).getTime();
    let newtimeST = "";
    let beforTime =
      this.props.dateType == "record"
        ? this.changeDateFormat(befosDate)
        : this.setTime(befosDate);
    let result = (news - befors) / 1000 / 60 / 60 / 24; // 換算為天數，除以毫秒，分，時，天

    if (this.state.timeInterval && result > 14) {
      newtimeST = "只能选择14天内的时间";
    }

    if (this.props.dateType && result > 6) {
      // 包含當日起算7天
      newtimeST = "只能选择7天内的时间";
    }

    if (befors > news) {
      newtimeST = "开始时间不能大于结束时间";
    }

    // console.log('result1111', result, this.state.nowDate, befosDate)

    if (
      (this.state.timeInterval || this.props.dateType) &&
      this.state.beforTimeST
    ) {
      newtimeST = "";
      if (this.state.nowDate >= befosDate) this.setState({ beforTimeST: "" });
    }
    this.setState({ befosDate, beforTime, newtimeST });
  };

  nowDate = (value, title) => {
    let Wdate = new Date(value);
    let Wy = Wdate.getFullYear();
    let Wm = Wdate.getMonth() + 1;
    Wm = Wm < 10 ? "0" + Wm : Wm;
    let Wd = Wdate.getDate();
    Wd = Wd < 10 ? "0" + Wd : Wd;
    const nowDate = Wy + "/" + Wm + "/" + Wd;

    let news = new Date(value).getTime();
    let befors = new Date(this.state.befosDate).getTime();
    let beforTimeST = "";
    let newtime =
      this.props.dateType == "record"
        ? this.changeDateFormat(nowDate)
        : this.setTime(nowDate);
    let result = (news - befors) / 1000 / 60 / 60 / 24; // 換算為天數，除以毫秒，分，時，天
    if (news < befors) {
      beforTimeST = "结束时间不能小于开始时间";
    }

    if (this.state.timeInterval && result > 14) {
      beforTimeST = "只能选择14天内的时间";
    }

    if (this.props.dateType && result > 6) {
      // 包含當日起算7天
      beforTimeST = "只能选择7天内的时间";
    }

    // console.log('result', result, this.state.befosDate, newtime)

    if (
      (this.state.timeInterval || this.props.dateType) &&
      this.state.newtimeST
    ) {
      beforTimeST = "";
      if (this.state.befosDate <= nowDate) this.setState({ newtimeST: "" });
    }
    this.setState({ nowDate, newtime, beforTimeST });
  };

  FourteenthDate(befosDate) {
    // 從開始時間計算＋14天
    let day = this.props.dateType == "record" ? 6 : 13;

    const fourteenthDate = new Date(
      new Date(befosDate).setTime(
        new Date(befosDate).getTime() + 1000 * 60 * 60 * 24 * day
      )
    );
    const newDate =
      fourteenthDate > new Date(new Date())
        ? new Date(new Date())
        : fourteenthDate;
    return newDate;
  }

  //时间选择
  selsctDate = (key) => {
    let befosDate = new Date();
    let Date1 = new Date();
    if (key == 3) {
      if (!this.state.changeDate) {
        let newtime =
          this.props.dateType == "record"
            ? this.changeDateFormat(GetDateStr(0))
            : this.setTime(GetDateStr(0));
        let beforTime = this.props.timeInterval
          ? this.setTime(GetDateStr(-13))
          : this.props.dateType == "record"
          ? this.changeDateFormat(GetDateStr(-6))
          : this.setTime(GetDateStr(-6));
        befosDate = this.props.timeInterval ? GetDateStr(-13) : GetDateStr(-6);
        this.setState({ newtime, beforTime, befosDate, DatePage: true });
        return;
      } else {
        this.setState({ DatePage: true });
        return;
      }
    }

    if (key == 0) {
      //今天
      befosDate = GetDateStr(0);
    } else if (key == 1) {
      //七天内
      befosDate = GetDateStr(-6);
    } else if (key == 2) {
      //30天内
      befosDate = GetDateStr(-30);
    }
    let newtime =
      this.props.dateType == "record"
        ? this.changeDateFormat(GetDateStr(0))
        : this.setTime(GetDateStr(0));
    let beforTime =
      this.props.dateType == "record"
        ? this.changeDateFormat(GetDateStr(-6))
        : this.setTime(GetDateStr(-6));
    this.setState({ newtime, beforTime, befosDate, activDateList: key });

    this.props.selectChange(befosDate, this.state.nowDate, key);
  };

  changeDate() {
    if (!this.state.newtimeST && !this.state.beforTimeST) {
      this.setState({ DatePage: false, changeDate: true, activDateList: 3 });
      this.props.selectChange(this.state.befosDate, this.state.nowDate, 3);
    }
  }

  changeDateFormat(date) {
    return date.replace(/\//g, "-");
  }

  render() {
    const {
      DateList,
      DatePage,
      minDate,
      newtime,
      beforTime,
      newtimeST,
      beforTimeST,
      activDateList,
      befosDate,
      nowDate,
      timeInterval,
    } = this.state;
    const { dateType } = this.props;
    
    return (
      <View>
        <Modal
          animationType="none"
          transparent={true}
          visible={DatePage}
          onRequestClose={() => {}}
          style={{ width: width * 0.9, padding: 0 }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View
              style={{
                padding: 10,
                backgroundColor: "#fff",
                width: width / 1.3,
                borderRadius: 15,
              }}
            >
              <Text
                style={{ textAlign: "center", fontSize: 18, color: "#000" }}
              >
                {dateType ? "自定义日期范围搜寻" : "自定义日期范围"}
              </Text>
              <Text style={{ color: "#222222", lineHeight: 30 }}>
                {dateType
                  ? "可搜索近 90 天内任意连续 7 天的交易记录"
                  : timeInterval
                  ? "可查询一年之内 14 日期间的数据记录"
                  : "仅提供近 90 天内的记录查询。"}
              </Text>
              <View>
                <Text style={{ color: "#666666", fontSize: 12 }}>开始时间</Text>
                <View style={styles.dateInput}>
                  <Text>{(beforTime != "" && beforTime) || "-- --"}</Text>
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 999,
                      width: width,
                    }}
                  >
                    <DatePicker
                      title=""
                      value={new Date(befosDate)}
                      mode="date"
                      minDate={new Date(minDate)}
                      maxDate={new Date(new Date())}
                      onChange={this.befosDate}
                      format="YYYY-MM-DD"
                    >
                      <List.Item styles={StyleSheet.create(newStyle)}>
                        {/* <Text style={{ fontSize: 14, color: '#fff' }}>月份</Text> */}
                      </List.Item>
                    </DatePicker>
                  </View>
                </View>
                <Text style={{ color: "red", fontSize: 12 }}>
                  {newtimeST != "" && newtimeST}
                </Text>
                <Text style={{ color: "#666666", fontSize: 12, marginTop: 15 }}>
                  结束时间
                </Text>
                <View style={styles.dateInput}>
                  <Text>{(newtime != "" && newtime) || "-- --"}</Text>
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 999,
                      width: width,
                    }}
                  >
                    <DatePicker
                      title=""
                      value={
                        timeInterval || dateType
                          ? this.FourteenthDate(befosDate)
                          : new Date(nowDate)
                      }
                      mode="date"
                      minDate={new Date(minDate)}
                      maxDate={
                        timeInterval || dateType
                          ? this.FourteenthDate(befosDate)
                          : new Date(new Date())
                      }
                      onChange={this.nowDate}
                      format="YYYY-MM-DD"
                    >
                      <List.Item styles={StyleSheet.create(newStyle)}>
                        {/* <Text style={{ fontSize: 14, color: '#fff' }}>月份</Text> */}
                      </List.Item>
                    </DatePicker>
                  </View>
                </View>
                <Text style={{ color: "red", fontSize: 12 }}>
                  {beforTimeST != "" && beforTimeST}
                </Text>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: 25,
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.modalBtn,
                      {
                        backgroundColor:
                          timeInterval || dateType ? "#fff" : "#F92D2D",
                      },
                    ]}
                    onPress={() => {
                      this.setState({
                        DatePage: false,
                        beforTimeST: false,
                        newtimeST: false,
                      });
                    }}
                  >
                    <Text
                      style={{
                        color: timeInterval || dateType ? "#666666" : "#fff",
                      }}
                    >
                      取消
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: "#F92D2D" }]}
                    onPress={() => {
                      this.changeDate();
                    }}
                  >
                    <Text style={{ color: "#fff" }}>
                      {timeInterval || dateType ? "提交" : "送出"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <View>
          {timeInterval ? ( // 添加銀行卡提現紀錄
            <TouchableOpacity
              onPress={() => {
                this.selsctDate(3);
                PiwikEvent("Search_withdrawalrecord_Carddetail");
              }}
            >
              <Text style={{ color: "#F92D2D" }}>搜寻</Text>
            </TouchableOpacity>
          ) : dateType == "record" ? (
            <TouchableOpacity
              onPress={() => this.selsctDate(3)}
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                height: 30,
                width: 219,
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
                <Text style={{ fontSize: 12 }}>
                  {this.changeDateFormat(beforTime)}
                </Text>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/icon/iconSwapright.png")}
                  style={{ width: 16, height: 16 }}
                />
                <Text style={{ fontSize: 12 }}>
                  {this.changeDateFormat(nowDate)}
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
                flexDirection: 'row',
                height: 27,
                width: 85,
                backgroundColor: "#33B8FF",
                borderRadius: 15,
              }}
            >
              {
                // activDateList != 3 &&
                <ModalDropdown
                  ref={(el) => (this._dropdown_3 = el)}
                  defaultValue={DateList[activDateList].name}
                  defaultIndex={activDateList}
                  textStyle={styles.dropdown_D_text}
                  dropdownStyle={styles.dropdown_DX_dropdown}
                  options={DateList}
                  renderButtonText={(rowData) =>
                    this._dropdown_renderButtonText(rowData)
                  }
                  renderRow={this._dropdown_1_renderRow.bind(this)}
                  onSelect={this.selsctDate}
                  style={{ zIndex: 10, width: 73 }}
                />
              }
              <Image
                resizeMode="stretch"
                source={require("../../images/icon/icon-expand-white.png")}
                style={{
                  width: 16,
                  height: 16,
                  position: 'absolute',
                  right: 5
                }}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default DateSelect;

const styles = StyleSheet.create({
  dropdown_D_text: {
    fontSize: 14,
    color: "#fff",
    textAlignVertical: "center",
    textAlign: "center",
  },
  dropdown_DX_dropdown: {
    height: 35 * 4 + 6,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowColor: "#666",
    elevation: 4,
    marginTop: 8,
    backgroundColor: "#F0F0F2",
  },
  dateInput: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
  },
  modalBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: width / 3.8,
    height: 40,
    borderRadius: 60,
    margin: 15,
  },
});
