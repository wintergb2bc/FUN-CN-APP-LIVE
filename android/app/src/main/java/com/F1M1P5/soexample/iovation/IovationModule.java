//  Created by react-native-create-bridge

package com.F1M1P5.soexample.iovation;

import android.support.annotation.Nullable;

import com.F1M1P5.soexample.MainApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.facebook.react.bridge.Callback;
import com.facebook.react.uimanager.IllegalViewOperationException;

import android.widget.Toast;
import java.util.HashMap;
import java.util.Map;

import android.os.AsyncTask;
// import static com.iovation.mobile.android.DevicePrint.start;
// import static com.iovation.mobile.android.DevicePrint.getBlackbox;


import com.iovation.mobile.android.FraudForceConfiguration;
import com.iovation.mobile.android.FraudForceManager;


import static com.E2.eagleeyes.EagleEyes.getBlackBox;

public class IovationModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "Iovation";
    private static ReactApplicationContext reactContext = null;
    private String blackBoxValue = null;

    public IovationModule(ReactApplicationContext context) {
        // Pass in the context to the constructor and save it so you can emit events
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        super(context);

        // start(reactContext);

        //FraudForceManager.getInstance().refresh();
    }

    @Override
    public String getName() {
        // Tell React the name of the module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        return REACT_CLASS;
    }

    @Override
    public Map<String, Object> getConstants() {
        // Export any constants to be used in your native module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        final Map<String, Object> constants = new HashMap<>();
        constants.put("EXAMPLE_CONSTANT", "example");

        return constants;
    }

    @ReactMethod
    public void getE2BlackBox(Callback successCallback, Callback errorCallback) {

        //String blackbox = FraudForceManager.getInstance().getBlackbox(reactContext);
        String blackbox = getBlackBox(MainApplication.getContext());
        if(blackbox != null){
            try {
                successCallback.invoke(blackbox);
            } catch(IllegalViewOperationException e){
                errorCallback.invoke("native error invoke");
            }
        }
        // Toast.makeText(reactContext, "connected success from native-BB", Toast.LENGTH_SHORT).show();

    }


    @ReactMethod
    public void getIovationBlackBox(Callback successCallback, Callback errorCallback) {

        String blackbox = FraudForceManager.getInstance().getBlackbox(reactContext);
       // String blackbox = getBlackBox(reactContext);
        if(blackbox != null){
            try {
                successCallback.invoke(blackbox);
            } catch(IllegalViewOperationException e){
                errorCallback.invoke("native error invoke");
            }
        }
       // Toast.makeText(reactContext, "connected success from native-BB", Toast.LENGTH_SHORT).show();

    }




//    private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
//        // A method for emitting from the native side to JS
//        // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
//        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
//    }

    // private class PrintThread extends AsyncTask<Void, Void, String> {
    //   @Override
    //   protected String doInBackground(Void... voids){
    //     return getBlackbox(reactContext);
    //   }
    //
    //   @Override
    //   protected void onPostExecute(String bb) {
    //      saveBlackBox(bb);
    //   }
    // }

//    private void saveBlackBox(String blackBoxValue){
//      this.blackBoxValue = blackBoxValue;
//    }
//
//      // print thread for fraud
//    private class FraudForceThread extends AsyncTask<Void, Void, String> {
//      @Override
//      protected String doInBackground(Void... voids){
//        return FraudForceManager.getInstance().getBlackbox(reactContext);
//      }
//
//      @Override
//      protected void onPostExecute(String bb) {
//        saveBlackBox(bb);
//      }
//    }
}
