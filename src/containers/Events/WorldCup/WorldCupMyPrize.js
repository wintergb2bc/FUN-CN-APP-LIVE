import React from 'react';
import { Dimensions, ScrollView, Text, View, StyleSheet, ActivityIndicator, Image, ImageBackground } from "react-native";
import { TopIconComp } from "../../../EuroCup/Tabs/PromoTab/Commom/TopIcom";

const { width, height } = Dimensions.get("window");


class WorldCupNewPrize extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      myPrizeList: [],
      showScrollTopIcon: false, //置顶icon
    };
  }

  componentDidMount() {
    this.PrizeHistory()
  }

  //  获取我的奖品
  PrizeHistory() {
    if(!this.props.ActiveGame.promoId){
      return;
    }
    fetchRequest(`${ApiPort.PrizeHistory}promoId=${this.props.ActiveGame.promoId}&`, "GET")
      .then(res => {
      
        if (res.isSuccess && res.result) {
          let myPrizeList = [];

          res.result.forEach((item) => {
            if (item.prizeType != 5) {
              //去除空奖prizeType == 5
              myPrizeList.push(item);
            }
          });
          this.setState({ myPrizeList });
        } else {
          //错误提示
          Toasts.fail('系统出现错误，请联系客服', 2);
        }
      })
      .catch(err => {
        Toasts.fail('系统出现错误，请联系客服', 2);
      });
  }

  applyDate(applyDate) {
    if (!applyDate) {
      return `00-00-00${"\n"}00:00 AM`;
    }
    let dates = applyDate.split('T');
    return `${dates[0]}${"\n"}${dates[1].split(':')[0]}:${dates[1].split(':')[1]}`;
  }

  getPrizeName(result) {
    return result.prizeType == 4 ? '神秘惊喜' : result.actualPrizeValue + ' ' + result.prizeTypeDesc;
  }

  triggerScrollTop = () => {
    if (this._scrollView_ref) {
      this._scrollView_ref.scrollTo({ x: 0, y: 0, animated: true });
      this.setState({ showScrollTopIcon: false });
    }
  };
  
  render() {
    const { myPrizeList, showScrollTopIcon } = this.state;
    return (
      <ImageBackground
        source={require('../../../images/worldCup/BG_1.png')}
        resizeMode='cover'
        style={styles.myPrizesModal}>
        {
          myPrizeList == 'default' &&
          <View style={{ paddingTop: 80 }}>
            <ActivityIndicator color="#fff"/>
          </View>
        }
        {
          myPrizeList.length == 0 &&
          <View style={{ justifyContent: 'center', alignItems: "center",alignSelf: "center", flex: 1}}>
            <Image style={{ width: 60, height: 60, marginBottom: 9 }}
                   source={require('../../../images/worldCup/Icon-EmptyPrize.png')}/>
            <Text style={{color: "#D1B88E", fontSize: 14}}>没有获奖记录</Text>
          </View>
        }

        {myPrizeList != 'default' && myPrizeList.length > 0 && (
          <ScrollView style={{
            width: width - 26,
            backgroundColor: "#fff",
            marginVertical: 13,
            paddingBottom: 5,
            borderRadius: 12,
            alignSelf: "center"
          }}
          ref={(el) => {
            this._scrollView_ref = el;
          }}
          onScroll={(e) => {
            let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
            if(offsetY > 30 && !showScrollTopIcon) {
              this.setState({showScrollTopIcon: true})
            }
            if(offsetY < 30 && showScrollTopIcon) {
              this.setState({showScrollTopIcon: false})
            }
          }}
          >
            <View style={[styles.myPrizeListWrap, { marginBottom: 17, marginTop: 33 }]}>
              <Text style={[styles.myPrizesTime, { color: "#012557" }]}>日期</Text>
              <Text style={[styles.myPrizes, { color: "#012557" }]}>奖品</Text>
              <Text style={[styles.myPrizesStatus, { color: "#012557" }]}>状态</Text>
            </View>
            {
              myPrizeList != 'default' && myPrizeList.length > 0 && myPrizeList.map((item, index) => {
                return (
                  <View style={[styles.myPrizeItemWrap, {
                    marginBottom: 8,
                    // backgroundColor: index % 2 == 0 ? '#152E8B' : '#2642AA'
                  }]} key={index}>
                    <Text style={styles.myPrizesTime}>{this.applyDate(item.applyDate)}</Text>
                    <Text style={styles.myPrizes}>{this.getPrizeName(item)}</Text>
                    <Text style={styles.myPrizesStatus}>{item.prizeStatusDesc}</Text>
                  </View>
                );
              })
            }
            <View style={{ height: 50, width: 30 }}/>
          </ScrollView>
        )}
        {/* 置顶ICON */}
        {showScrollTopIcon ? (
          <TopIconComp triggerScrollTop={this.triggerScrollTop}
                       icon={require("../../../images/worldCup/BackToTopCN.png")}
                       style={{ width: 51, height: 46 }}
                       propsWrap={{ right: 38, bottom: 48 }}
          />
        ) : null}
      </ImageBackground>
    );
  }
}

export default WorldCupNewPrize;


const styles = StyleSheet.create({
  myPrizesModal: {
    flex: 1,
    backgroundColor: '#012557',
  },
  myPrizeListWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  myPrizeItemWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: "#EEEEE4",
    borderRadius: 14,
    paddingVertical: 8,
    marginHorizontal: 8.5
  },
  myPrizesTime: {
    width: "33%",
    color: '#012557',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: "bold",
    lineHeight: 18,
    paddingTop: 3,
    paddingBottom: 3,
  },
  myPrizes: {
    width: "33%",
    color: '#012557',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: "bold",
    lineHeight: 12,
    paddingTop: 3,
    paddingBottom: 3,
  },
  myPrizesStatus: {
    width: "33%",
    color: '#012557',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: "bold",
    lineHeight: 12,
    paddingTop: 3,
    paddingBottom: 3,
  },
  noPrizesModal: {
    width: width - 60,
    backgroundColor: '#133292',
    paddingBottom: 20,
    borderRadius: 8,
    alignSelf: "center"
  },
  modalTitle: {
    backgroundColor: '#F6DAB5',
    height: 37,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  modalTitle2: {
    backgroundColor: '#F6DAB5',
    height: 50,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  prizeView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - 10,
    paddingBottom: 70,
  },
  prizeBG: {
    width: width,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 210,
    paddingBottom: 140
  },
  howBtn: {
    width: 160,
    height: 40,
  },
  howStep: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 22,
    paddingBottom: 34,
  },
  howStepList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  howToBG: {
    width: width,
    height: width * .74,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBG2: {
    width: width,
    height: width * 1.5,
    paddingTop: 43,
    zIndex: 10
  },
  headerBG2Android: {
    width: width,
    height: width * 1.5,
    paddingTop: 43,
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: width,
    height: width * 1.44,
    zIndex: 100
  },
  countdown: {
    display: 'flex',
    width: "92%",
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  countdownTime: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 50,
  },
  countDownImg: {
    width: 35,
    height: 50
  },
  timeSeparator: {
    width: 18,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#001B6C',
  },
  countdownFoot: {
    width: 67,
    textAlign: 'center',
    color: '#001B6C',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerBGTitle: {
    // lineHeight: 32,
    textAlign: 'center',
    fontSize: 14,
    color: '#E5EBFF'
  },
  activeAmount: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  resetAmount: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 50,
    borderWidth: 1,
    borderColor: '#FFEB9C',
    borderRadius: 8,
    margin: 8,
    paddingTop: 3,
    paddingBottom: 3,
  },
  resetAmountTxt: {
    color: '#FFEB9C',
    fontSize: 13,
    lineHeight: 20,
  },
  ruleTableDetailText: {
    color: '#FFFFFF',
    fontSize: 11
  }
});




