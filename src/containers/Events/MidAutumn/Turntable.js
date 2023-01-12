import React from "react"
import { Animated, Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native"
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");
const btnHeight = width * 0.212;
const btnWidth = width * 0.183;
export default class AnimatedTurnTableDrawPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }


  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.mainImg, {
          transform: [{
            rotate: this.props.rotateDeg.interpolate({
              inputRange: [0, 3],
              outputRange: ['0deg', '1080deg']
            })
          }]
        }]}>

          <View style={styles.wheelBg}>
            <Image style={styles.wheel} source={require('../../../images/minGame/luckyWheelFrame.png')}/>
          </View>
        </Animated.View>
        {this.props.poppingGameActive ? (          
          <TouchableOpacity activeOpacity={0.9} onPress={async () => {
            this.props.SnatchPrize();
          }} style={styles.centerPoint}>
            {this.props.wheelClick ? (
              <Image
                style={[styles.playBtn, {width: btnWidth, btnHeight: btnHeight}]}
                source={require('../../../images/minGame/CN_Button-Clicked.gif')}
              />
            ): (
              <FastImage
                style={styles.playBtn}
                width={btnWidth}
                height={btnHeight}
                source={require('../../../images/minGame/CN_Button-Static.gif')}
              />
            )}
          </TouchableOpacity>  
        ):(
          <View style={styles.centerPoint}>
            <Image
              style={[styles.playBtn, {width: btnWidth, height: btnHeight}]}
              source={require('../../../images/minGame/CN_Button-Disabled.png')}
            />
          </View>
        )}
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImg: {
    width: width,
    height: width,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  wheel: {
    position: "absolute",
    height: 0.92 * width,
    width: 0.92 * width,
    resizeMode: 'stretch'
  },
  wheelBg: {
    height: 0.92 * width,
    width: 0.92 * width,
    alignItems: "center",
    justifyContent: "center"
  },

  centerPoint: {
    position: 'absolute',
    // left: Dimensions.get('window').width / 2 - 53,
    // top: 107,
    zIndex: 200,
    height: btnHeight + 20,
    width: btnWidth + 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: btnWidth,
    height: btnHeight,
    resizeMode: "stretch",
    position: "absolute",
    zIndex: 100,
  },


});
