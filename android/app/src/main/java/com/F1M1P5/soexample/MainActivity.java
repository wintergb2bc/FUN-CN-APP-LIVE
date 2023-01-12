package com.F1M1P5.soexample;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.F1M1P5.soexample.invokenative.PushModule;
import com.facebook.react.ReactActivity;
import com.umeng.analytics.MobclickAgent;
import com.umeng.analytics.MobclickAgent.EScenarioType;
import com.umeng.message.PushAgent;

import org.devio.rn.splashscreen.SplashScreen;
import org.json.JSONException;
import org.json.JSONObject;

import pro.piwik.sdk.Tracker;
import pro.piwik.sdk.extra.TrackHelper;
import com.tinstall.tinstall.TInstall;

public class MainActivity extends ReactActivity {
    public static String Affcodes = "";
    public static String Rafcodes = "";

    protected void onCreate(Bundle savedInstanceState) {


        super.onCreate(savedInstanceState);

        SplashScreen.show(this);
        // ShareModule.initSocialSDK(this);
        PushModule.initPushSDK(this);
        MobclickAgent.setSessionContinueMillis(1000);
        MobclickAgent.setScenarioType(this, EScenarioType.E_DUM_NORMAL);
        MobclickAgent.openActivityDurationTrack(false);
        PushAgent.getInstance(this).onAppStart();PushAgent.getInstance(this).onAppStart();

        getTinstall();
    }


    private void getTinstall() {
        TInstall.getInstall(this,new TInstall.TInstallCallback() {
            @Override
            public void installBack(JSONObject object) {
               try {
                     Affcodes = object.getString("affCode");
                 } catch (JSONException e) {
                     try {
                         Affcodes = object.getString("affcode");
                     } catch (JSONException s) {
                         try {
                             Affcodes = object.getString("aff");
                         } catch (JSONException d) {
                             Affcodes = "err";
                             d.printStackTrace();
                         }
                         s.printStackTrace();
                     }
                     e.printStackTrace();
                 }
                 
                 try {
                     Rafcodes = object.getString("raf");
                 } catch (JSONException e) {
                     Rafcodes = "err";
                     e.printStackTrace();
                 }
            }
        });
    }
    ///piwik sdk By benji 1-19 2020 ////

    @Override
    public void onResume() {
        super.onResume();
//         android.util.Log.e("xxxxxx","onResume=");
        MobclickAgent.onResume(this);
    }
    @Override
    protected void onPause() {
        super.onPause();
//         android.util.Log.e("xxxxxx","onPause=");

        MobclickAgent.onPause(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */

    @Override
    protected String getMainComponentName() {
        return "UMComponent";
    }




}
