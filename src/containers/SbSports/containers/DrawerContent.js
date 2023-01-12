import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { connect } from "react-redux";

import Touch from "react-native-touch-once";

import { Actions } from "react-native-router-flux";
import { ACTION_UserSetting_ToggleListDisplayType } from '../../../lib/redux/actions/UserSettingAction';

import { fetchRequestSB } from "./../lib/SportRequest";
import { ApiPortSB } from "./../lib/SPORTAPI";

const { width, height } = Dimensions.get("window");


class DrawerContent extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      memberInfo: '',
      UserLogin: ApiPort.UserLogin,
      balance: '0.00',
      StatisticsAll: 0,
      message: false,
      hotGmae: false,
      setTing: false,
      tutorial: false,
      discDisplay: true,
      tutorialDisplay: true
    };
  }

  componentWillMount() {
    if (ApiPort.UserLogin == true) {
      this.getMessageCount();
      this.setState({
        memberInfo: JSON.parse(localStorage.getItem("memberInfo"))
      });
    }
  }

  componentDidMount() {
    let popverList = ['message', 'hotGmae', 'setTing', 'tutorial'];
    popverList.forEach((item) => {
      global.storage
        .load({
          key: item,
          id: item
        })
        .then(data => {
        })
        .catch(err => {
          this.setState({ [item]: true });
        });
    });
  }


  componentWillUnmount() {

  }

  // 未讀訊息統計
  getMessageCount = () => {
    fetchRequestSB(ApiPortSB.UnreadMessage + "key=All&", "GET")
      .then((res) => {
        if (res && res.isSuccess && res.result) {
          const total =
            res.result.unreadPersonalMessageCount +
            res.result.unreadTransactionCount;
          this.setState({
            StatisticsAll: total,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  closePopver(message) {
    this.setState({ [message]: false });
    global.storage.save({
      key: message,
      id: message,
      data: message,
      expires: null
    });
  }

  close() {
    Actions.pop();
  }

  actionPage(key) {
    if (!ApiPort.UserLogin) {
      Actions.Login({from: "sb"});
      return;
    }
    switch (key) {
      case 'DepositCenter':
        PiwikEvent('Deposit_Nav', 'Launch', 'Sidenav');
        Actions.DepositCenter({ from: 'GamePage' });
        break;
      case 'TransferSb':
        PiwikEvent('Transfer_Nav', 'Launch', 'Sidenav');
        Actions.TransferSb();
        break;
      case 'News':
        PiwikEvent('Notification', 'Launch', 'Sidenav');
        Actions.NewsSb();
        break;
      case 'setSystem':
        PiwikEvent('HotMatches', 'Launch', 'Sidenav');
        Actions.Setting({ setType: 'setSystem' });
        break;
      case 'setPush':
        PiwikEvent('Notification_Setting', 'Launch', 'Sidenav');
        Actions.Setting({ setType: 'setPush' });
        break;
      case 'Rules':
        Actions.Rules();
        break;
      default:
        '';
    }
  }

  logout() {
    Actions.home1();
  }

  DomainC(key) {
    if (key == 'live') {

    }
  }


  render() {
    const {
      UserLogin,
      balance,
      memberInfo,
      message,
      hotGmae,
      setTing,
      StatisticsAll,
      tutorial,
    } = this.state;

    window.GetMessageCounts = () => {
      this.getMessageCount();
    };
    const {
      userSetting,
    } = this.props;
    return (
      <View style={{ flex: 1, paddingTop: DeviceInfoIos ? 35 : 0, backgroundColor: "#FFFFFF" }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
        >
          <View style={styles.logos}>
            <Image resizeMode='stretch' source={require('../../../images/funLogoXL.png')}
                   style={{ width: 90, height: 40 }}/>
            <Text style={{ color: '#fff' }}>123</Text>
          </View>

          <View>
            {
              !UserLogin &&
              <View style={styles.userName}>
                <Text style={{ color: '#666' }}>欢迎, 访客参访中...</Text>
              </View>
            }
            {
              UserLogin &&
              <View style={styles.userName}>
                <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 16 }}>{
                  memberInfo.userName && memberInfo.userName.length > 10 ? memberInfo.userName.slice(0, 10) + '...' : memberInfo.userName
                }</Text>
                <Text
                  style={{ color: '#222', fontSize: 16, fontWeight: 'bold' }}>￥ {this.props.userInfo.balanceSB}</Text>
              </View>
            }
            <View style={{ backgroundColor: "#E5E5E5", width: width - 40, height: 1, alignSelf: "center" }}/>
          </View>
          {/* <Touch
                        onPress={() => {
                            window.GameMenus && window.GameMenus(0)
                            Actions.EuroCup()
                            PiwikEvent('Engagement Event', 'Launch', 'Enter_EUROPage')
                        }}
                        style={{paddingLeft: 20, marginBottom: 10}}
                    >
                        <Image resizeMode='stretch' source={require('../images/euroCup/evenPage.png')} style={{ width: (width * 0.8) - 40, height: ((width * 0.8) - 40) * 0.315 }} />
                    </Touch> */}

          <View style={styles.listItem}>
            <Touch onPress={() => {
              this.actionPage('DepositCenter');
              PiwikEvent('Deposit Nav', 'Click', 'Deposit_Sidenav_SB2.0');
            }} style={styles.iconBtn}>
              <Image resizeMode='stretch' source={require('../images/drawer/deposit.png')}
                     style={{ width: 35, height: 35 }}/>
              <Text style={{ color: '#000' }}>存款</Text>
            </Touch>
          </View>

          <View style={styles.listItem}>
            <Touch onPress={() => {
              this.actionPage('TransferSb');
              PiwikEvent('Transfer Nav', 'Click', 'Transfer_Sidenav_SB2.0');
            }} style={styles.iconBtn}>
              <Image resizeMode='stretch' source={require('../images/drawer/transfer.png')}
                     style={{ width: 35, height: 35 }}/>
              <Text style={{ color: '#000' }}>转账</Text>
            </Touch>
          </View>
          <View style={{ backgroundColor: "#E5E5E5", width: width - 40, height: 1, alignSelf: "center" }}/>
          <View style={[styles.listItem, { paddingTop: 9 }]}>
            <Touch onPress={() => {
              this.actionPage('News');
              PiwikEvent('Account', 'Click', 'Notification_Sidenav_SB2.0');
            }} style={styles.iconBtn}>
              <Image resizeMode='stretch' source={require('../images/drawer/message.png')}
                     style={{ width: 35, height: 35 }}/>
              <Text style={{ color: '#000' }}>通知</Text>
            </Touch>
            {
              // StatisticsAll > 0 &&
              UserLogin &&
              <View style={styles.news}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{StatisticsAll}</Text>
              </View>
            }
            {
              UserLogin && message &&
              <View style={styles.Popover}>
                <Touch onPress={() => {
                  this.closePopver('message');
                }} style={styles.PopoverConten}>
                  <View style={styles.arrow}/>
                  <Text style={{ color: '#fff', paddingRight: 5, fontSize: 12 }}>查看赛事通知</Text>
                  <Image resizeMode='stretch' source={require('../images/closeWhite.png')}
                         style={{ width: 15, height: 15 }}/>
                </Touch>
              </View>
            }
          </View>

          <View style={styles.listItem}>
            <Touch onPress={() => {
              this.close();
              window.ShowHotEvents && window.ShowHotEvents(1);
              PiwikEvent('Game Nav', 'Click', 'HotMatches_Sidenav_SB2.0');
            }} style={styles.iconBtn}>
              <Image resizeMode='stretch' source={require('../images/drawer/hotGame.png')}
                     style={{ width: 35, height: 35 }}/>
              <Text style={{ color: '#000' }}>热门赛事</Text>
            </Touch>
            {
              hotGmae &&
              <View style={[styles.Popover, { left: 130 }]}>
                <Touch onPress={() => {
                  this.closePopver('hotGmae');
                }} style={styles.PopoverConten}>
                  <View style={styles.arrow}/>
                  <Text style={{ color: '#fff', paddingRight: 5, fontSize: 12 }}>推荐热门赛事</Text>
                  <Image resizeMode='stretch' source={require('../images/closeWhite.png')}
                         style={{ width: 15, height: 15 }}/>
                </Touch>
              </View>
            }
          </View>
          <View style={{ backgroundColor: "#E5E5E5", width: width - 40, height: 1, alignSelf: "center" }}/>
          <View style={[styles.listItem, { paddingTop: 9 }]}>
            <TouchableOpacity style={[styles.iconBtn, { width: width - 40, justifyContent: 'space-between' }]}
                              onPress={() => {
                                this.setState(
                                  (prevState, nextProps) => ({
                                    discDisplay: !prevState.discDisplay,
                                  }));
                              }}>
              <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <Image resizeMode='stretch' source={require('../images/drawer/set.png')}
                       style={{ width: 35, height: 35 }}/>
                <Text style={{ color: '#000' }}>设置</Text>
              </View>
              <View style={this.state.discDisplay ? styles.arrows : styles.arrow1}></View>
            </TouchableOpacity>
          </View>
          <View style={[this.state.discDisplay ? styles.showContext : styles.hideContext]}>
            <View style={[styles.listItemList]}>
              <View style={styles.iconListBtn}>
                <Text style={{ color: '#222', fontSize: 13, }}>盘口显示</Text>
              </View>
              <View style={styles.horizontal}>
                <Touch
                  onPress={() => {
                    this.props.toggleListDisplayType();
                    PiwikEvent('Navigation', 'Click', 'VerticalDisplay_Sidenav_SB2.0');
                  }}
                  style={[styles.horizontalBtn, { backgroundColor: userSetting.ListDisplayType != 2 ? '#00a6ff' : 'transparent' }]}
                >
                  <Text
                    style={{ color: userSetting.ListDisplayType != 2 ? '#fff' : '#999999', fontSize: 12 }}>纵向</Text>
                </Touch>
                <Touch
                  onPress={() => {
                    this.props.toggleListDisplayType();
                    PiwikEvent('Navigation', 'Click', 'HorizontalDisplay_Sidenav_ SB2.0');
                  }}
                  style={[styles.horizontalBtn, { backgroundColor: userSetting.ListDisplayType == 2 ? '#00a6ff' : 'transparent' }]}
                >
                  <Text
                    style={{ color: userSetting.ListDisplayType == 2 ? '#fff' : '#999999', fontSize: 12 }}>横向</Text>
                </Touch>
              </View>
            </View>

            <View style={styles.listItemList}>
              <Touch onPress={() => {
                this.actionPage('setSystem');
                PiwikEvent('Account', 'Click', 'Setting_Sidenav_SB2.0');
              }} style={styles.iconListBtn}>
                <Text style={{ color: '#222', fontSize: 13, }}>系统设置</Text>
              </Touch>
            </View>

            <View style={styles.listItemList}>
              <Touch onPress={() => {
                this.actionPage('setPush');
                PiwikEvent('Account', 'Click', 'NotificationSetting_Sidenav_ SB2.0');
              }} style={styles.iconListBtn}>
                <Text style={{ color: '#222', fontSize: 13, }}>推送设置</Text>
              </Touch>
              {
                UserLogin && setTing &&
                <View style={[styles.Popover, { left: 130 }]}>
                  <Touch onPress={() => {
                    this.closePopver('setTing');
                  }} style={styles.PopoverConten}>
                    <View style={styles.arrow}/>
                    <Text style={{ color: '#fff', paddingRight: 5, fontSize: 12 }}>赛事进球推送设置</Text>
                    <Image resizeMode='stretch' source={require('../images/closeWhite.png')}
                           style={{ width: 15, height: 15 }}/>
                  </Touch>
                </View>
              }
            </View>
          </View>
          <View style={{ backgroundColor: "#E5E5E5", width: width - 40, height: 1, alignSelf: "center" }}/>
          <View style={[styles.listItem, { paddingTop: 9 }]}>
            <Touch onPress={() => {
              Actions.Rules();
              PiwikEvent('Navigation', 'Click', 'BettingRules_Sidenav_SB2.0');
            }} style={styles.iconBtn}>
              <Image resizeMode='stretch' source={require('../images/drawer/rules.png')}
                     style={{ width: 35, height: 35 }}/>
              <Text style={{ color: '#000' }}>投注规则</Text>
            </Touch>
          </View>
          <View style={styles.listItem}>
            <TouchableOpacity style={[styles.iconBtn, { width: width - 40, justifyContent: 'space-between' }]}
                              onPress={() => {
                                this.setState(
                                  (prevState, nextProps) => ({
                                    tutorialDisplay: !prevState.tutorialDisplay,
                                  }));
                              }}>
              <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <Image resizeMode='stretch' source={require('../images/drawer/tutorial.png')}
                       style={{ width: 35, height: 35 }}/>
                <Text style={{ color: '#000' }}>新手教程</Text>
              </View>
              <View style={this.state.tutorialDisplay ? styles.arrows : styles.arrow1}></View>
            </TouchableOpacity>
            {
              tutorial &&
              <View style={[styles.Popover, { left: 130 }]}>
                <Touch onPress={() => {
                  this.closePopver('tutorial');
                }} style={styles.PopoverConten}>
                  <View style={styles.arrow}/>
                  <Text style={{ color: '#fff', paddingRight: 5, fontSize: 12 }}>新手教程讲解</Text>
                  <Image resizeMode='stretch' source={require('../images/closeWhite.png')}
                         style={{ width: 15, height: 15 }}/>
                </Touch>
              </View>
            }
          </View>
          <View style={[this.state.tutorialDisplay ? styles.showContext : styles.hideContext]}>
            <View style={styles.listItemList}>
              <Touch onPress={() => {
                PiwikEvent('Navigation', 'Click', 'OddsTutorial_Sidenav_SB2.0');
                Actions.BetTutorial({ types: 'trends' });
              }} style={styles.iconListBtn}>
                <Text style={{ color: '#222', fontSize: 13, }}>盘口教程</Text>
              </Touch>
            </View>
            <View style={styles.listItemList}>
              <Touch onPress={() => {
                PiwikEvent('Navigation', 'Click', 'BetTutorial_Sidenav_SB2.0');
                Actions.BetTutorial({ types: 'bet' });
              }} style={styles.iconListBtn}>
                <Text style={{ color: '#222', fontSize: 13, }}>投注教程</Text>
              </Touch>
            </View>
          </View>
          <View style={{ backgroundColor: "#E5E5E5", width: width - 40, height: 1, alignSelf: "center" }}/>
          {
            // ApiPort.UserLogin &&
            <View style={[styles.listItem, { paddingTop: 9 }]}>
              <Touch onPress={() => {
                this.logout();
                PiwikEvent('Navigation', 'Click', 'Back_MainSite_SB2.0_Sidenav');
              }} style={styles.iconBtn}>
                <Image resizeMode='stretch' source={require('../images/drawer/loginOut.png')}
                       style={{ width: 35, height: 35 }}/>
                <Text style={{ color: '#000' }}>返回乐天堂</Text>
              </Touch>
            </View>
          }
          {
            // SBTDomain == 'http://sportsstaging.fun88.biz/' &&
            // <View style={styles.listItem}>
            //     <Touch onPress={() => { this.DomainC('live') }} style={styles.iconBtn}>
            //         <Image resizeMode='stretch' source={require('../images/closeWhite.png')} style={{ width: 35, height: 35 }} />
            //         <Text style={{ color: '#000' }}>切换live</Text>
            //     </Touch>
            // </View>
          }


        </ScrollView>

        <Touch style={{
          width: 48,
          height: 48,
          borderRadius: 48 / 2,
          backgroundColor: "#00A6FF",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          position: "absolute",
          bottom: 34,
        }} onPress={() => {
          this.close();
        }}>
          <Image resizeMode='stretch' source={require('../../../images/icon/closeWhite.png')}
                 style={{ width: 23, height: 23 }}/>
        </Touch>
        {
          //     <Text style={{textAlign: 'center', lineHeight: 38}}>
          //     版本号: v{Rb88Version}
          // </Text>
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  maintainStatus: state.maintainStatus,
  userSetting: state.userSetting
});
const mapDispatchToProps = {
  toggleListDisplayType: () => ACTION_UserSetting_ToggleListDisplayType(),
};
export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);

const styles = StyleSheet.create({
  horizontalBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    width: 50,
    height: 30,
  },
  horizontal: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#EEEEF0',
    borderRadius: 50,
    width: 100,
    height: 30,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logos: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    paddingTop: 25,
  },
  userName: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
    paddingVertical: 10
  },
  listItem: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 9,
  },
  listItemList: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 6,
    paddingBottom: 6,
    // backgroundColor: 'rgba(239,239,244,.3)',
  },
  iconBtn: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  iconListBtn: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 50,
    paddingTop: 5,
    paddingBottom: 5,
  },
  Popover: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    left: 100,
  },
  PopoverConten: {
    backgroundColor: '#363636',
    borderRadius: 8,
    padding: 5,
    paddingLeft: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  arrow: {
    position: 'absolute',
    left: -13,
    width: 0,
    height: 0,
    zIndex: 9,
    borderStyle: "solid",
    borderWidth: 7,
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderBottomColor: "#ffffff",
    borderRightColor: "#363636"
  },
  news: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 109999,
    padding: 4,
    backgroundColor: '#eb2121',
    position: 'absolute',
    width: 26,
    height: 26,
    right: 15,
  },
  arrow1: {
    top: -5,
    left: 8,
    width: 10,
    height: 10,
    borderColor: '#999',
    borderRightWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  arrows: {
    top: 0,
    left: 8,
    width: 10,
    height: 10,
    borderColor: '#999',
    borderLeftWidth: 2,
    borderTopWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  showContext: {
    width: width - 50,
    backgroundColor: '#fff',
    paddingBottom: 10
  },
  hideContext: {
    display: 'none',
    backgroundColor: '#fff',
    paddingBottom: 10,
    height: 0,
  },
});








