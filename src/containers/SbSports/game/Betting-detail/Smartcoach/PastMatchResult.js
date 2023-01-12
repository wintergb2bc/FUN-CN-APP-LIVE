/* Nami賽事分析 */

import React from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  Image,
  View,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
  WebView,
  NativeModules,
  Alert,
  UIManager,
  Clipboard,
  RefreshControl,
  Button,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Touch from "react-native-touch-once";
import Modal from 'react-native-modal';
import ImageForTeam from "../../RNImage/ImageForTeam";

const { width, height } = Dimensions.get("window");

//共用的歷史交鋒模塊
const PastMatchResultVSItem = (props) => {
  const {Vendor, EventData, item, HideSeprator} = props;
  return <View style={styles.NamiAnalysisVSBox}>
    <View style={styles.NamiAnalysisVSTitle}>
      <Text style={styles.NamiAnalysisVSTitleDate}>{item.matchDate}</Text>
      <Text style={styles.NamiAnalysisVSTitleText}>{item.namiLeagueName}</Text>
    </View>
    <View style={styles.NamiAnalysisVSRow}>
      <View style={styles.NamiAnalysisTeamLeft2}>
        <Text style={styles.NamiAnalysisTeamName2}>{item.isLeftHomeGame ? EventData.HomeTeamName : EventData.AwayTeamName}</Text>
        <View style={styles.NamiAnalysisTeamLogoLeft2}>
          <ImageForTeam Vendor={Vendor} TeamId={item.isLeftHomeGame ? EventData.HomeTeamId : EventData.AwayTeamId} IconUrl={item.isLeftHomeGame ? EventData.HomeIconUrl : EventData.AwayIconUrl} imgSize={16} />
        </View>
      </View>
      <View style={styles.NamiAnalysisVSScoreBox}>
        <Text style={styles.NamiAnalysisVSScore}>{item.homeScore}</Text>
        <Text style={styles.NamiAnalysisVSScore}>&nbsp;:&nbsp;</Text>
        <Text style={styles.NamiAnalysisVSScore}>{item.awayScore}</Text>
      </View>
      <View style={styles.NamiAnalysisTeamRight2}>
        <View style={styles.NamiAnalysisTeamLogoRight2}>
          <ImageForTeam Vendor={Vendor} TeamId={item.isLeftHomeGame ? EventData.AwayTeamId : EventData.HomeTeamId} IconUrl={item.isLeftHomeGame ? EventData.AwayIconUrl : EventData.HomeIconUrl} imgSize={16} />
        </View>
        <Text style={styles.NamiAnalysisTeamName2}>{item.isLeftHomeGame ? EventData.AwayTeamName : EventData.HomeTeamName}</Text>
      </View>
    </View>
    {/* for 彈窗展示 最後一個不顯示分隔線 */}
    {!HideSeprator ?
      <View style={styles.NamiAnalysisVSBoxBottomLine}/>
      : null}
  </View>
}

class PastMatchResult extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showVsPopup: false, //是否展示彈窗
    };
  }

  componentDidMount () {
  }

  render () {
    const { Vendor ,EventData, NamiAnalysisData } = this.props;
    if (!EventData || !NamiAnalysisData) { //有數據才render內容
      return null;
    }

    const vsFirst3 = NamiAnalysisData.vsList.filter((item,index)=> index < 3);
    const vsLeftFirst5 = NamiAnalysisData.leftVsList.filter((item,index)=> index < 5);
    const vsRightFirst5 = NamiAnalysisData.rightVsList.filter((item,index)=> index < 5);

    return <>
      <View style={styles.NamiAnalysisContainer}>
        {/*統計區*/}
        <View style={styles.NamiAnalysisTotal}>
          <View style={styles.NamiAnalysisTotalHeader}>
            <View style={styles.NamiAnalysisTeamLeft}>
              <Text style={styles.NamiAnalysisTeamName}>{EventData.HomeTeamName}</Text>
              <View style={styles.NamiAnalysisTeamLogoLeft}>
                <ImageForTeam Vendor={Vendor} TeamId={EventData.HomeTeamId} IconUrl={EventData.HomeIconUrl} imgSize={20} />
              </View>
            </View>
            <View style={styles.NamiAnalysisTeamRight}>
              <View style={styles.NamiAnalysisTeamLogoRight}>
                <ImageForTeam Vendor={Vendor} TeamId={EventData.AwayTeamId} IconUrl={EventData.AwayIconUrl}  imgSize={20} />
              </View>
              <Text style={styles.NamiAnalysisTeamName}>{EventData.AwayTeamName}</Text>
            </View>
          </View>
          <View style={styles.NamiAnalysisTotalLine}>
            <Text style={styles.NamiAnalysisTotalNumberLeft}>{NamiAnalysisData.vsTotal.vsLeftWinCount}</Text>
            <Text style={styles.NamiAnalysisTotalText}>总胜数</Text>
            <Text style={styles.NamiAnalysisTotalNumberRight}>{NamiAnalysisData.vsTotal.vsRightWinCount}</Text>
          </View>
          <View style={styles.NamiAnalysisTotalLine}>
            <Text style={styles.NamiAnalysisTotalNumberLeft}>{NamiAnalysisData.vsTotal.vsLeftHomeWinCount}</Text>
            <Text style={styles.NamiAnalysisTotalText}>主场</Text>
            <Text style={styles.NamiAnalysisTotalNumberRight}>{NamiAnalysisData.vsTotal.vsRightHomeWinCount}</Text>
          </View>
          <View style={styles.NamiAnalysisTotalLine}>
            <Text style={styles.NamiAnalysisTotalNumberLeft}>{NamiAnalysisData.vsTotal.vsLeftAwayWinCount}</Text>
            <Text style={styles.NamiAnalysisTotalText}>客场</Text>
            <Text style={styles.NamiAnalysisTotalNumberRight}>{NamiAnalysisData.vsTotal.vsRightAwayWinCount}</Text>
          </View>
          <View style={styles.NamiAnalysisTotalLine}>
            <View style={styles.NamiAnalysisTotalDescLeft}>
              <Text style={styles.NamiAnalysisTotalDescNumber}>{NamiAnalysisData.vsTotal.vsCount}</Text><Text style={styles.NamiAnalysisTotalDescText}>&nbsp;场</Text>
            </View>
            <View style={styles.NamiAnalysisTotalDescRight}>
              <Text style={styles.NamiAnalysisTotalDescNumber}>{NamiAnalysisData.vsTotal.vsTieCount}</Text><Text style={styles.NamiAnalysisTotalDescText}>&nbsp;平</Text>
            </View>
          </View>
        </View>
        {/*雙方歷史交鋒*/}
        <View style={styles.NamiAnalysisVS}>
          <Text style={styles.NamiAnalysisTitle}>双方历史交锋</Text>
          <View style={styles.NamiAnalysisVSContainer}>
          {
            vsFirst3.map((item,index) => {
              return <PastMatchResultVSItem key={index} Vendor={Vendor} EventData={EventData} item={item} HideSeprator={false} />
            })
          }
          { NamiAnalysisData.vsList.length >3 ?
            <Touch
              style={styles.NamiAnalysisVSShowAllButton}
              onPress={() => this.setState({showVsPopup: true})}>
              <Text style={styles.NamiAnalysisVSShowAllButtonText}>查看全部</Text>
            </Touch>
            : null }
          </View>
        </View>
        {/*近期戰績*/}
        <View style={styles.NamiAnalysisOther}>
          <Text style={styles.NamiAnalysisTitle}>近期战绩</Text>
          <View style={styles.NamiAnalysisOtherContainer}>
            <View style={styles.NamiAnalysisOtherLeftBox}>
              <View style={styles.NamiAnalysisTeamLeft3}>
                <Text style={styles.NamiAnalysisTeamName2}>{EventData.HomeTeamName}</Text>
                <View style={styles.NamiAnalysisTeamLogoLeft2}>
                  <ImageForTeam Vendor={Vendor} TeamId={EventData.HomeTeamId} IconUrl={EventData.HomeIconUrl} imgSize={16} />
                </View>
              </View>
              <View style={styles.NamiAnalysisOtherInnerBoxLeft}>
              {
                vsLeftFirst5.map((item,index) => {
                  return <View key={index} style={styles.NamiAnalysisOtherRowLeft}>
                    <Text style={styles.NamiAnalysisScoreLeft}>{item.leftScore}-{item.rightScore}</Text>
                    <Text style={styles.NamiAnalysisOtherVS}>&nbsp;vs</Text>
                    <Text style={styles.NamiAnalysisOtherNamiTeamName}>{item.namiTeamName}</Text>
                    <Image source={{uri:item.namiTeamLogo}} style={styles.NamiAnalysisOtherNamiTeamLogoLeft} />
                    <Text style={styles.NamiAnalysisOtherHomeOrAway}>{item.isHomeGame ? '主' : '客'}</Text>
                    <View style={[styles.NamiAnalysisOtherWinOrLoseCircle, item.isTie ? styles.NamiAnalysisOtherTieCircle : (item.isWin ? styles.NamiAnalysisOtherWinCircle : styles.NamiAnalysisOtherLoseCircle)]}>
                      <Text style={[styles.NamiAnalysisOtherWinOrLoseText, item.isTie ? styles.NamiAnalysisOtherTieText : {}]}>
                        {item.isTie ? '平' : ( item.isWin ? '赢' : '输')}
                      </Text>
                    </View>
                  </View>
                })
              }
              </View>
            </View>
            <View style={styles.NamiAnalysisOtherCenterLine}/>
            <View style={styles.NamiAnalysisOtherRightBox}>
              <View style={styles.NamiAnalysisTeamRight3}>
                <View style={styles.NamiAnalysisTeamLogoRight2}>
                  <ImageForTeam Vendor={Vendor} TeamId={EventData.AwayTeamId} IconUrl={EventData.AwayIconUrl} imgSize={16} />
                </View>
                <Text style={styles.NamiAnalysisTeamName2}>{EventData.AwayTeamName}</Text>
              </View>
              <View style={styles.NamiAnalysisOtherInnerBoxRight}>
              {
                vsRightFirst5.map((item,index) => {
                  return <View key={index} style={styles.NamiAnalysisOtherRowRight}>
                    <View style={[styles.NamiAnalysisOtherWinOrLoseCircle, item.isTie ? styles.NamiAnalysisOtherTieCircle : (item.isWin ? styles.NamiAnalysisOtherWinCircle : styles.NamiAnalysisOtherLoseCircle)]}>
                      <Text style={[styles.NamiAnalysisOtherWinOrLoseText, item.isTie ? styles.NamiAnalysisOtherTieText : {}]}>
                        {item.isTie ? '平' : ( item.isWin ? '赢' : '输')}
                      </Text>
                    </View>
                    <Text style={styles.NamiAnalysisOtherHomeOrAway}>{item.isHomeGame ? '主' : '客'}</Text>
                    <Image source={{uri:item.namiTeamLogo}} style={styles.NamiAnalysisOtherNamiTeamLogoRight} />
                    <Text style={styles.NamiAnalysisScoreRight}>{item.leftScore}-{item.rightScore}</Text>
                    <Text style={styles.NamiAnalysisOtherVS}>&nbsp;vs</Text>
                    <Text style={styles.NamiAnalysisOtherNamiTeamName}>{item.namiTeamName}</Text>
                  </View>
                })
              }
              </View>
            </View>
          </View>
        </View>
      </View>
      {/*雙方歷史交鋒的彈窗*/}
      <Modal
        isVisible={this.state.showVsPopup}
        onBackButtonPress={() => this.setState({showVsPopup: false})}
        style={styles.NamiAnalysisPopup}
      >
        <SafeAreaView style={styles.NamiAnalysisPopupWrapper}>
          <View style={styles.NamiAnalysisPopupHeader}>
            <Touch
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              onPress={() => this.setState({showVsPopup: false})}
              style={styles.NamiAnalysisPopupBackButton}
            >
              <Image source={require("../../../../../images/icon-white.png")} style={styles.NamiAnalysisPopupBackButtonImg}/>
            </Touch>
            <Text style={styles.NamiAnalysisPopupHeaderText}>双方历史交锋</Text>
          </View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={true}
            bounces={false}
            scrollEventThrottle={16}
            style={{ backgroundColor: '#EFEFF4' }}
          >
            <View style={styles.NamiAnalysisPopupContainer}>
               {
                NamiAnalysisData.vsList.map((item,index) => {
                  return <PastMatchResultVSItem key={index} Vendor={Vendor} EventData={EventData} item={item} HideSeprator={index === (NamiAnalysisData.vsList.length-1)} />
                })
              }
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  }
}

export default PastMatchResult;

const styles = StyleSheet.create({
  NamiAnalysisContainer: {
    width: width,
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  NamiAnalysisTotal: {
    width: width,
    height: 192,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  NamiAnalysisTotalHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: 36,
  },
  NamiAnalysisTeamName: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 36,
  },
  // NamiAnalysisTeamLogo: {
  //   width: 20,
  //   height: 20,
  // },
  NamiAnalysisTeamLogoLeft: {
    marginLeft:4,
    marginRight:58,
  },
  NamiAnalysisTeamLogoRight: {
    marginRight:4,
    marginLeft:58,
  },
  NamiAnalysisTeamLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 0.5*width,
    height: 36,
  },
  NamiAnalysisTeamRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 0.5*width,
    height: 36,
  },
  NamiAnalysisTotalLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 295,
    height: 32,
    backgroundColor: '#F7F7F7',
    borderRadius: 4,
    marginBottom: 4,
  },
  NamiAnalysisTotalText: {
    textAlign: 'center',
    width:116,
    fontSize: 10,
    lineHeight: 32,
    color:'#666666',
  },
  NamiAnalysisTotalNumberLeft: {
    width: 58,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 32,
    color:'#222222',
    textAlign: 'right',
  },
  NamiAnalysisTotalNumberRight: {
    width: 58,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 32,
    color:'#222222',
    textAlign: 'left',
  },
  NamiAnalysisTotalDescNumber:{
    fontSize: 12,
    color: '#666666',
    fontWeight: 'bold',
  },
  NamiAnalysisTotalDescText: {
    fontSize: 12,
    color: '#666666',
  },
  NamiAnalysisTotalDescLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 8,
  },
  NamiAnalysisTotalDescRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 8,
  },
  NamiAnalysisTitle: {
    width: width,
    height: 34,
    backgroundColor: '#EFEFF4',
    textAlign: 'center',
    lineHeight: 34,
    fontSize: 12,
    color: '#666666',
  },
  NamiAnalysisVS: {
    width: width,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 8,
  },
  NamiAnalysisVSContainer: {
    width: width,
    paddingTop: 8,
    paddingBottom: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  NamiAnalysisVSShowAllButton: {
    width: 80,
    height: 33,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00A6FF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  NamiAnalysisVSShowAllButtonText: {
    fontSize: 12,
    color: '#00A6FF',
    lineHeight: 33,
  },
  NamiAnalysisVSBox: {
    width: width,
    height: 52,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 8,
  },
  NamiAnalysisVSTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  NamiAnalysisVSTitleDate: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 14,
    paddingRight: 8,
  },
  NamiAnalysisVSTitleText: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 14,
  },
  NamiAnalysisVSRow: {
    marginTop: 4,
    width: width,
    height: 28,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  NamiAnalysisVSScoreBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 46,
    height: 24,
    backgroundColor: '#EFEFF4',
    borderRadius: 2,
    //padding: 2px 8px 2px 8px,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  //.NamiAnalysisVSHomeScore, .NamiAnalysisVSScoreSep, .NamiAnalysisVSAwayScore {
  NamiAnalysisVSScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 20,
  },
  NamiAnalysisTeamName2: {
    fontSize: 12,
    color: '#222222',
    lineHeight: 28,
  },
  // NamiAnalysisTeamLogo: {
  //   width: 16,
  //   height: 16,
  // },
  NamiAnalysisTeamLeft2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex:1,
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
  NamiAnalysisTeamRight2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex:1,
    justifyContent: 'flex-start',
    paddingLeft: 16,
  },
  NamiAnalysisTeamLogoLeft2: {
    marginLeft: 4,
  },
  NamiAnalysisTeamLogoRight2: {
    marginRight: 4,
  },
  NamiAnalysisVSBoxBottomLine: {
    width: 295,
    height: 7,
    borderBottomWidth: 1,
    borderColor: '#EFEFF4',
  },
  NamiAnalysisOther: {
    width: width,
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  NamiAnalysisOtherContainer: {
    width: width,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  NamiAnalysisOtherCenterLine: {
    width: 1,
    height: 160.5,
    borderWidth: 0.5,
    borderColor: '#EFEFF4',
    marginLeft: 16,
    marginRight: 16,
  },
  NamiAnalysisOtherLeftBox: {
    width: width*0.5,
    flex:1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'flex-end',
  },
  NamiAnalysisOtherRightBox: {
    width: width*0.5,
    flex:1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'flex-start',
  },
  NamiAnalysisTeamLeft3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  NamiAnalysisOtherInnerBoxLeft: {
    marginTop: 16,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  NamiAnalysisOtherRowLeft: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    marginBottom: 8,
    justifyContent: 'flex-end',
  },
  NamiAnalysisScoreLeft: {
    fontSize: 10,
    color: '#222222',
    lineHeight: 20,
    height: 20,
    textAlign: 'right',
  },
  NamiAnalysisOtherNamiTeamLogoLeft: {
    width: 14,
    height: 14,
    marginLeft: 4,
  },
  NamiAnalysisTeamRight3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  NamiAnalysisOtherInnerBoxRight: {
    marginTop: 16,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  NamiAnalysisOtherRowRight: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  NamiAnalysisScoreRight: {
    fontSize: 10,
    color: '#222222',
    lineHeight: 20,
    height: 20,
    textAlign: 'center',
  },
  NamiAnalysisOtherNamiTeamLogoRight: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  //NamiAnalysisOtherScore, NamiAnalysisOtherVS, NamiAnalysisOtherNamiTeamName, NamiAnalysisOtherHomeOrAway: {
  NamiAnalysisOtherVS: {
    fontSize: 10,
    color: '#222222',
    lineHeight: 20,
    height: 20,
  },
  NamiAnalysisOtherNamiTeamName: {
    fontSize: 10,
    color: '#222222',
    lineHeight: 20,
    height: 20,
    marginLeft: 4,
  },
  NamiAnalysisOtherHomeOrAway: {
    fontSize: 10,
    color: '#222222',
    lineHeight: 20,
    height: 20,
    marginLeft: 8,
    marginRight: 8,
  },
  NamiAnalysisOtherWinOrLoseCircle: {
    width: 20,
    height: 20,
    borderRadius: 40,
  },
  NamiAnalysisOtherTieCircle: {
    backgroundColor: '#EFEFF4',
  },
  NamiAnalysisOtherWinCircle: {
    backgroundColor: '#EB2121',
  },
  NamiAnalysisOtherLoseCircle: {
    backgroundColor: '#0BBF38',
  },
  NamiAnalysisOtherWinOrLoseText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#FFFFFF',
    lineHeight: 20,
    width: 20,
    height: 20,
  },
  NamiAnalysisOtherTieText: {
    color: '#222222',
  },
  NamiAnalysisPopup: {
    backgroundColor: '#00a6ff',
    padding: 0,
    margin: 0,
    width: width,
    minHeight: height,
  },
  NamiAnalysisPopupWrapper: {
    backgroundColor: '#00a6ff',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    width: width,
  },
  NamiAnalysisPopupHeader: {
    color: '#fff',
    backgroundColor: '#00a6ff',
    width: width,
    height: 52,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  NamiAnalysisPopupBackButton: {
    position: 'absolute',
    left: 8,
    //top: 13,
  },
  NamiAnalysisPopupBackButtonImg: {
    width: 26,
    height: 26,
  },
  NamiAnalysisPopupHeaderText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
  },
  NamiAnalysisPopupContainer: {
    width: width,
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex:1,
  },
});
