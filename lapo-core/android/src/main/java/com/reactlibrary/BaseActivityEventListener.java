package com.reactlibrary;

import android.content.Intent;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;

public class BaseActivityEventListener implements LifecycleEventListener {
    private final ReactApplicationContext reactContext;

    public BaseActivityEventListener(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public void onHostResume() {
        // Activity `onResume`
    }

    @Override
    public void onHostPause() {
        // Activity `onPause`
    }

    @Override
    public void onHostDestroy() {
        sendDestroyClient();
    }

    private void sendDestroyClient(){
        Intent intent = new Intent();
        intent.setAction(HelloService.SEND_DESTROY_CLIENT);
        this.reactContext.sendBroadcast(intent);
    }
}