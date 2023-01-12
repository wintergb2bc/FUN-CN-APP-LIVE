import React from 'react';
import { I18nManager, Image, Platform, StyleSheet, View } from 'react-native';
import defaultBackImage2 from '../../images/icon-white.png';
import homeImage from '../../images/euroCup/home.png';
import Touch from "../Common/TouchOnce";

class HeaderBackIcon extends React.PureComponent {
  static defaultProps = {
    tintColor: Platform.select({
      ios: '#037aff'
    }),
  };


  render() {
    const { tintColor, onPress, useHome = false, containerStyle = {} } = this.props;
    const style = [useHome ? {} : styles.backButton];

    return <Touch
      hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
      testID="backNavButton"
      style={[styles.backButtonContainer, containerStyle]} onPress={() => onPress()}>
      <View style={style}>
        <Image source={useHome ? homeImage : defaultBackImage2}
               style={[useHome ? styles.homeButtonImage : styles.backButtonImage, { tintColor }]}/>
      </View>
    </Touch>;
  }
}

const styles = StyleSheet.create({
  backButtonContainer: {
    height: 50,
    width: 70,
  },
  homeButtonImage: {
    height: 22,
    width: 22,
  },
  backButtonImage: {
    ...Platform.select({
      android: {
        marginTop: 5,
      },
    }),
    width: 13,
    height: 21,
  },
  backButton: {
    ...Platform.select({
      ios: {
        top: 12,
      },
      android: {
        top: 10,
      },
      windows: {
        top: 8,
      },
    }),
    left: 2,
    paddingLeft: 8,
    flexDirection: 'row',
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});

export default HeaderBackIcon;
