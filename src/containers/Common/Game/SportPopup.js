import React from "react";
import { Linking } from "react-native";
import CommonModals from "../Modals";
import { connect } from "react-redux";
import actions from "../../../lib/redux/actions/index";
import { Actions } from "react-native-router-flux";
import { Toast } from "antd-mobile-rn";
import { getAllVendorToken } from './../../../containers/SbSports/lib/js/util';
import NavigationUtil from "../../../lib/utils/NavigationUtil";

class SportPopup extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  download() {
    let affc = affCodeKex || ''
    if(affc) {
      affc = 'aff=' + affc.replace(/[^\w\.\/]/ig, '')
    }
    Linking.canOpenURL('sb20://').then(supported => {
      if (!supported) {
        // LIVE環境
        if (common_url.indexOf('idcf5') > -1) {
          Linking.openURL('https://sbone.qhufr.com/Appinstall.html?aff='+ affc +'?')
        } else {
          Linking.openURL('https://sportsstaging.fun88.biz/Appinstall.html?aff='+ affc +'?')
        }
      } else {
        return Linking.openURL('sb20://')
      }
    })

  }

  render() {
    return (
      <CommonModals.ExclamationModal
        desc={"请选择打开方式"}
        onPressLeft={() => {
          //網頁版 需要檢查登入態
          if (!ApiPort.UserLogin) {
            NavigationUtil.goToLogin();
            this.props.clearGame();
            return;
          }

          // this.props.playGame(this.props.game.sportCode);
          this.props.playGame({ provider:this.props.game.sportCode, gameId: null, category: "sportsbook" });
          this.props.clearGame();
        }}
        onPressRight={() => {
          //轉Sb2.0
          const sportsName = ["IPSB", "OWS", "SBT"];
          if (sportsName.includes(this.props.game.sportCode)) {
            const sportName = this.props.game.sportCode;
            if (ApiPort.UserLogin) {
              // 自我限制檢查
              if(this.props.userSetting.selfExclusions.disableBetting){
                this.props.clearGame();
                Toast.loading();
                setTimeout(() => {
                  this.props.selfExclusionsPopup(true);
                  Toast.hide();
                }, 1000);
                return;
              }
              if (ApiPort.UserLogin && isGameLock) {
                this.props.clearGame();
                Toast.fail("您的账户已被锁，请联系在线客服。", 2);
                return;
              }
              //已登入 先獲取token後跳轉
              Toast.loading("加载中...");
              getAllVendorToken()
                .finally(() => {
                  //不管成功或失敗都跳轉
                  Toast.hide();
                  Actions.SbSports({
                    sbType: sportName
                  });
                });
            } else {
              //未登入 直接跳轉
              Actions.SbSports({
                sbType: sportName
              });
            }
          }
          this.props.clearGame();
        }}
        closeModal={() => {
          this.props.clearGame();
        }}
        leftText="网页版"
        rightText="乐体育"
        visible={true}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  game: state.game,
  userSetting: state.userSetting,
});
const mapDispatchToProps = (dispatch) => ({
  clearGame: () => dispatch(actions.ACTION_ClearOpenSport()),
  playGame: (provider) => dispatch(actions.ACTION_PlayGame(provider)),
  selfExclusionsPopup: (open) => dispatch(actions.ACTION_SelfExclusionsPopup(open)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SportPopup);
