package com.F1M1P5.soexample;

import android.util.Log;
import android.widget.Toast;
import android.app.Activity;
import android.content.Intent;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import pro.piwik.sdk.Tracker;
import pro.piwik.sdk.extra.TrackHelper;

public class opeinstall extends ReactContextBaseJavaModule {

    public static String TAG = "";
    public static String RAF = "";
    private static final String SHORT = "SHORT";
    private static final String LONG = "J";

    private String CODE;

    public void setName(String name) {
        this.CODE = name;
    }

    public opeinstall(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void passDictionaryBackToRN(Callback callback) {
        WritableMap map = Arguments.createMap();
        map.putString("CODE", this.CODE);
        callback.invoke(map);
    }

    @ReactMethod
    public void getAffCode(Callback callback) {
        if(TAG == null || TAG.equals("")) {
            //TInstall代理码affcode
            TAG = com.F1M1P5.soexample.MainActivity.Affcodes;
        }
        callback.invoke(TAG);
    }

    @ReactMethod
    public void getRafCode(Callback callback) {
        RAF = com.F1M1P5.soexample.MainActivity.Rafcodes;
        callback.invoke(RAF);
    }

    @Override
    public String getName() {
        return "opeinstall";
    }

    @ReactMethod

    public void show(String message, int duration) {
        android.widget.Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

    @Override
    public Map<String, Object> getConstants() {//设置JS可以使用的常量
        Map<String, Object> Constants = new HashMap<>();
        Constants.put(SHORT, "12312321");
        Constants.put(LONG, Toast.LENGTH_LONG);
        return Constants;
    }


    @ReactMethod
    public void getUMMSG(Callback callback) {
        WritableMap map = Arguments.createMap();
        map.putString("CODE", MainApplication.umMSG);
        callback.invoke(map);

        MainApplication.umMSG ="";
    }

    private Tracker getTracker() {
        return ((MainApplication) getReactApplicationContext().getApplicationContext()).getTracker();
    }

    //piwki 點擊事件
    @ReactMethod
    public void PiwikTackEvent(String type,String category,String action,String name) {
          if(type.equals("Tarck")) {
              TrackHelper.track().event(category, action).name(name).with(getTracker());
          }

          if(type.equals("menberCode")) {
              getTracker().setUserId(category);
          }

          if(type.equals("APPVER")) {
            TrackHelper.track().visitVariables(4,"AppRealVersion",category).event("UPLOAD VERSION", "touch").with(getTracker());
          }

        //Log.e("benjiTTTTTT",SHORT);
//         MainActivity.PiwikTarck = type;
//         MainActivity.PiwikMsg = msg;
//         MainActivity.PiwikAction = action;
//         MainActivity.PiwikName = name;
        //   TrackHelper.track().event("category", "action").path("/main/actionScreen").name("label").value(1000f).with(tracker);
//         Log.e("benjiTTTTTT",msg);
    }


    //跳转手机设置
    @ReactMethod
    public void openNetworkSettings(Callback cb) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            cb.invoke(false);
            return;
        }
        try {
            currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS));
            cb.invoke(true);
        } catch (Exception e) {
            cb.invoke(e.getMessage());
        }
    }


}
