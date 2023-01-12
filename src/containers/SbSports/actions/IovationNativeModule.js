//  Created by react-native-create-bridge

import { NativeModules } from 'react-native'

const { Iovation } = NativeModules

export default {
  getIovationBlackBox(successCallback, errorCallback) {
    return Iovation.getIovationBlackBox(successCallback, errorCallback)
  },
  
  getE2BlackBox(successCallback, errorCallback) {
    return Iovation.getE2BlackBox(successCallback, errorCallback)
  },


  // EXAMPLE_CONSTANT: Iovation.EXAMPLE_CONSTANT
}

