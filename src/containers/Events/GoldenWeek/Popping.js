import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Touch from 'react-native-touch-once';


const {
  width,
  height
} = Dimensions.get('window');
const PoppingAssetsList = [
  {
    poping: 'poping1',
    top: 30,
    left: width - 280,
    width: 110,
  },
  {
    poping: 'poping2',
    top: 150,
    left: width - 200,
    width: 110,
  },
  {
    poping: 'poping3',
    top: 70,
    left: width - 360,
    width: 140,
  },
  {
    poping: 'poping4',
    top: 90,
    left: width - 180,
    width: 130,
  },
  {
    poping: 'poping5',
    top: 150,
    left: width - 400,
    width: 145,
  }
];


class Popping extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      poping1: 0,
      poping2: 0,
      poping3: 0,
      poping4: 0,
      poping5: 0,
      poping6: 0,
    };
    this.popingInterval = null;

  }

  componentWillMount() {
    this.popingActive();
  }

  componentWillUnmount() {
    this.clearIntervals();
  }

  clearIntervals() {
    this.popingInterval && clearInterval(this.popingInterval);
  }


  //开启动画GIF
  popingActive() {
    this.popingInterval = setInterval(() => {
      if (this.props.popingActive) {
        const prizeArray = [1, 2];//3个gif图，使用splice不会有重复显示
        const popingArray = [1, 2, 3, 4, 5];//6个弹出位置，使用splice位置不重复

        //状态恢复默认，防止没刷新gif,没动画
        this.setState({
          poping1: 0,
          poping2: 0,
          poping3: 0,
          poping4: 0,
          poping5: 0,
          poping6: 0,
        }, () => {
          const popingKey = popingArray.splice(Math.floor(Math.random() * popingArray.length), 1)[0];
          const prizeKey = prizeArray.splice(Math.floor(Math.random() * prizeArray.length), 1)[0];
          this.setState({
            ['poping' + popingKey]: prizeKey
          }, () => {
            setTimeout(() => {
              const popingKey = popingArray.splice(Math.floor(Math.random() * popingArray.length), 1)[0];
              const prizeKey = prizeArray.splice(Math.floor(Math.random() * prizeArray.length), 1)[0];
              this.setState({
                ['poping' + popingKey]: prizeKey
              });
            }, 500);
          });
        });
      }
    }, 2000);
  }

  //抽奖api
  SnatchPrize(item) {
    if (this.state[item.poping] != 0) {
      this.props.SnatchPrize();
    }
  }


  render() {

    return (
      <View style={{ flex: 1 }}>
        {
          PoppingAssetsList.map((item, index) => {
            let poping = this.state[item.poping];
            return <View key={index}>
              <Touch onPress={() => {
                this.SnatchPrize(item);
              }} style={[styles.portal, { left: item.left, top: item.top, }]} activeOpacity={1}>
                <View
                  style={{ width: item.width, height: item.width * 0.58 }}
                >
                  <View style={[styles.portalPop, { top: -100 - (index * 10) }]}>
                    {
                      poping == 1 &&
                      <Image resizeMode='stretch' source={require('../../../images/goldenWeek/Firework-Animated.gif')}
                             style={{ width: item.width, height: item.width }}/>
                    }
                    {
                      poping == 2 &&
                      <Image resizeMode='stretch' source={require('../../../images/goldenWeek/Firework-Animated.gif')}
                             style={{ width: item.width, height: item.width }}/>
                    }
                    {/*{*/}
                    {/*    poping == 3 &&*/}
                    {/*  <Image resizeMode='stretch' source={require('../../../images/goldenWeek/Firework-Animated.gif')}*/}
                    {/*        style={{ width: item.width, height: item.width  }} />*/}
                    {/*}*/}
                  </View>
                </View>
              </Touch>
            </View>;
          })
        }
      </View>
    );
  }

}

export default Popping;


const styles = StyleSheet.create({
  portal: {
    position: 'absolute',
    top: 0,
    left: width - 200,
    zIndex: 9,
    height: 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  portalPop: {
    position: 'absolute',
    top: -145,
    left: 0,
    zIndex: 99,
  },
});




