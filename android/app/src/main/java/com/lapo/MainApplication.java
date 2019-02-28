package com.lapo;

import cl.json.ShareApplication;
import android.app.Application;

import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.streem.selectcontact.SelectContactPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.smixx.fabric.FabricPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.imagepicker.ImagePickerPackage;
import cl.json.RNSharePackage;
import com.horcrux.svg.SvgPackage;
import com.hopding.pdflib.PDFLibPackage;
import org.reactnative.camera.RNCameraPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactlibrary.RNLapoCorePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.io.OutputStream;
import java.util.Arrays;
import java.util.List;

import java.io.InputStream;
import java.io.IOException;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

    @Override
    public String getFileProviderAuthority() {
        return "com.lapo.provider";
    }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      InputStream inputStream = getResources().openRawResource(R.raw.lapotables1311);

      RNLapoCorePackage asd = new RNLapoCorePackage();
      asd.setInput(inputStream);
      asd.setIcon(R.mipmap.ic_notification);


      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SplashScreenReactPackage(),
            new SelectContactPackage(),
            new KCKeepAwakePackage(),
            new RNNotificationsPackage(MainApplication.this),
            new RNDeviceInfo(),
            new FabricPackage(),
            new RNGestureHandlerPackage(),
            new ImagePickerPackage(),
            new RNSharePackage(),
            new SvgPackage(),
            new PDFLibPackage(),
            new RNCameraPackage(),
          new LinearGradientPackage(),
              asd
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);

    long size = 50L * 1024L * 1024L; // 50 MB
    com.facebook.react.modules.storage.ReactDatabaseSupplier.getInstance(getApplicationContext()).setMaximumSize(size);
  }
}
