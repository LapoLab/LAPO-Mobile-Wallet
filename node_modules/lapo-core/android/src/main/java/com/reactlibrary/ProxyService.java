package com.reactlibrary;

import android.app.IntentService;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class ProxyService extends IntentService {

    private static final String TAG = ProxyService.class.getSimpleName();

    public ProxyService() {
        super("notificationsProxyService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        Log.d(TAG, "ProxyService New intent: "+intent);
        try {
            final Intent helperIntent = this.getApplicationContext().getPackageManager().getLaunchIntentForPackage(this.getApplicationContext().getPackageName());
            final Intent intentMain = new Intent(this.getApplicationContext(), Class.forName(helperIntent.getComponent().getClassName()));

            this.getApplicationContext().startActivity(intentMain);

        } catch (ClassNotFoundException e) {
            // Note: this is an imaginary scenario cause we're asking for a class of our very own package.
            Log.e(TAG, "Failed to launch/resume app", e);
        }
    }
}