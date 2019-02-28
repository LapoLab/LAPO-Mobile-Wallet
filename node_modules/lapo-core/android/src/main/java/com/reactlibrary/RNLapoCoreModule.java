
package com.reactlibrary;

import com.facebook.react.bridge.Promise;

import com.breadwallet.core.BRCoreChainParams;
import com.breadwallet.core.BRCoreWallet;
import com.breadwallet.core.BRCorePeerManager;
import com.breadwallet.core.BRCoreMasterPubKey;
import com.breadwallet.core.BRCoreAddress;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.database.SQLException;
import android.util.Log;
import android.content.IntentFilter;

import java.io.ByteArrayInputStream;
import android.os.Environment;
import android.os.Build;
import android.app.DownloadManager;

import java.io.File;
import java.io.BufferedInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.io.OutputStream;
import java.io.ByteArrayOutputStream;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.content.ServiceConnection;
import android.content.ComponentName;
import android.os.IBinder;

import android.graphics.Bitmap;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import android.content.Intent;
import java.text.SimpleDateFormat;
import java.util.Date;

public class RNLapoCoreModule extends ReactContextBaseJavaModule {
    static {
        try {
            System.loadLibrary("core");
        } catch (UnsatisfiedLinkError e) {
            e.printStackTrace();
            if (BuildConfig.DEBUG) {
                Log.d("CORE", "Native code library failed to load.\\n\" + " + e);
            }
        }
    }


    BRCoreWallet wallet;

    BRWalletManager walletManager;

    BRCorePeerManager pm;

    byte[] phrase = new String("asda as ").getBytes();

    final long SATOSHIS = 100000000L;
    private static final double BIP39_CREATION_TIME = 1388534400.0;
    final long MAX_MONEY = 2100000L * SATOSHIS;

    boolean isReady = false;
    boolean isStart = false;

    Intent intent;
    ServiceConnection sConn;
    boolean bound = false;

    public static final int QR_DIMENSION = 1080, BAR_HEIGHT = 640, BAR_WIDTH = 1080;

    private static final int WHITE = 0xFFFFFFFF;
    private static final int BLACK = 0xFF000000;

    private IntentReciver cashbackReciver;
    private IntentParamsReciver paramsReciver;
    private IntentBalaceReciver balanceReciver;
    private IntentAddressReciver addressReciver;
    private IntentTransactionsReciver transactionsReciver;
    private IntentIsLoadWalletReciver isLoadWalletReciver;
    private IntentDestroyReciver destroyReciver;
    private IntentTxHashReciver txHashReciver;
    private IntentIsLoadingStartWalletReciver isLoadingStartWalletReciver;

    public int icon;

    private final ReactApplicationContext reactContext;
    InputStream inputStream;

    public RNLapoCoreModule(ReactApplicationContext reactContext, InputStream inputStream, int icon) {
        super(reactContext);
        this.reactContext = reactContext;
        this.inputStream = inputStream;
        this.icon = icon;

        registerCashbackReceiver();
        registerInfoParamsReceiver();
        registerBalaceReceiver();
        registerAddressReceiver();
        registerTransactionsReceiver();
        registerIsLoadWalletReceiver();
        registerDestroyReceiver();
        registerTxHashReceiver();
        registerIsLoadingStartWalletReceiver();

        reactContext.addLifecycleEventListener(new BaseActivityEventListener(reactContext));

    }

    @Override
    public String getName() {
        return "RNLapoCore";
    }

    @ReactMethod
    public void generateQRCode(String phraseGen, Promise promise) {
        String str = phraseGen;
        BitMatrix result;
        try {
            result = new MultiFormatWriter().encode(str,
                    BarcodeFormat.QR_CODE, QR_DIMENSION, QR_DIMENSION, null);
        } catch (Exception iae) {
            // Unsupported format
            promise.reject("Unsupported format");
            return;
        }
        int w = result.getWidth();
        int h = result.getHeight();
        int[] pixels = new int[w * h];
        for (int y = 0; y < h; y++) {
            int offset = y * w;
            for (int x = 0; x < w; x++) {
                pixels[offset + x] = result.get(x, y) ? BLACK : WHITE;
            }
        }
        Bitmap bitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
        bitmap.setPixels(pixels, 0, QR_DIMENSION, 0, 0, w, h);

        String fileName = "qrCode.png";

        FileOutputStream out = null;
        String filePath = getFilename(fileName);
        try {
            out = new FileOutputStream(filePath);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out);
        } catch (Exception e) {
            e.printStackTrace();
        }

        promise.resolve(filePath);
    }

    private String getFilename(String fileName) {
        File file = new File("/data/user/0/com.lapo/files");
        if (!file.exists()) {
            file.mkdirs();
        }
        if(fileName.contains("/")) {
            fileName = fileName.replace("/", "\\");
        }
        return (file.getAbsolutePath() + "/" + fileName + ".png");
    }

    @ReactMethod
    public void isLoadWallet(Promise promise) {
        if (BuildConfig.DEBUG) {
            Log.d("CORE", ">>>>>>>>>>>>>>>>this.isLoadWalletReciver.isLoadWallet::" + this.isLoadWalletReciver.isLoadWallet);
        }
        promise.resolve(this.isLoadWalletReciver.isLoadWallet);
    }


    @ReactMethod
    public void isLoadingStartWallet(Promise promise) {
        if (BuildConfig.DEBUG) {
            Log.d("CORE", ">>>>>>>>>>>>>>>>this.isLoadingStartWalletReciver.isLoadingStartWallet::" + this.isLoadingStartWalletReciver.isLoadingStartWallet);
        }
        promise.resolve(this.isLoadingStartWalletReciver.isLoadingStartWallet);
    }


    @ReactMethod
    public void closeApp(Promise promise) {
        android.os.Process.killProcess(android.os.Process.myPid());

        if(this.walletManager != null) {
            this.walletManager.isCloseDB = true;
        }

        if (BuildConfig.DEBUG) {
            Log.d("CORE", "disconnect::this.isStart::" + this.isStart);
            Log.d("CORE", "disconnect::isStart::" + isStart);
            Log.d("CORE", "disconnect::isReady::" + isReady);
        }

        if (this.isLoadWalletReciver.isLoadWallet) {

            if (BuildConfig.DEBUG) {
                Log.d("CORE", "disconnect::this.isStart::" + this.isStart);
                Log.d("CORE", "disconnect::isStart::" + isStart);
                Log.d("CORE", "disconnect::this.isLoadWalletReciver.isLoadWallet::" + this.isLoadWalletReciver.isLoadWallet);
            }

            disconnectToClient();
            if (BuildConfig.DEBUG) {
                Log.d("CORE", "start wait whe destroy::" + this.destroyReciver.isDestroy);
            }

            try {
                Thread.sleep(3000);
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (BuildConfig.DEBUG) {
                Log.d("CORE", "finish wait whe destroy::" + this.destroyReciver.isDestroy);
            }
            Context context = this.reactContext.getApplicationContext();

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                boolean res = context.stopService(intent);
                if (BuildConfig.DEBUG) {
                    Log.d("CORE", "stopService---->>>>: " + res);
                }
            }else{
                boolean res = context.stopService(intent);
                if (BuildConfig.DEBUG) {
                    Log.d("CORE", "stopService---->>>>: " + res);
                }
            }
        } else {
            disconnectToClient();
        }

        try {
            Thread.sleep(1000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (BuildConfig.DEBUG) {
            Log.d("CORE", "finish wait whe destroy::" + this.destroyReciver.isDestroy);
        }

        Context context = this.reactContext.getApplicationContext();
        context.stopService(intent);

        this.isReady = false;
        this.isStart = false;

        promise.resolve(true);
    }

    @ReactMethod
    public void connectPeers(Promise promise) {
        if (BuildConfig.DEBUG) {
            Log.d("CORE", "connectPeers::");
        }
        isReady = false;
        isStart = true;

        Context context = this.reactContext.getApplicationContext();

        intent = new Intent(context, HelloService.class);
        intent.putExtra("phrase", new String(this.phrase));
        intent.putExtra("icon", this.icon);

        sConn = new ServiceConnection() {
            public void onServiceConnected(ComponentName name, IBinder binder) {
                if (BuildConfig.DEBUG) {
                    Log.d("LOG_TAG", "MainActivity onServiceConnected");
                }
                bound = true;
            }

            public void onServiceDisconnected(ComponentName name) {
                if (BuildConfig.DEBUG) {
                    Log.d("LOG_TAG", "MainActivity onServiceDisconnected");
                }
                bound = false;
            }
        };

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent);
        } else {
            context.startService(intent);
        }
//        context.startService(intent);


        promise.resolve(String.valueOf(true));
    }

    @ReactMethod
    public void disconnect(Promise promise) {
        if(this.walletManager != null) {
            this.walletManager.isCloseDB = true;
        }

        if (BuildConfig.DEBUG) {
            Log.d("CORE", "disconnect::this.isStart::" + this.isStart);
            Log.d("CORE", "disconnect::isStart::" + isStart);
            Log.d("CORE", "disconnect::isReady::" + isReady);
        }

        if (this.isLoadWalletReciver.isLoadWallet) {

            if (BuildConfig.DEBUG) {
                Log.d("CORE", "disconnect::this.isStart::" + this.isStart);
                Log.d("CORE", "disconnect::isStart::" + isStart);
                Log.d("CORE", "disconnect::this.isLoadWalletReciver.isLoadWallet::" + this.isLoadWalletReciver.isLoadWallet);
            }

            disconnectToClient();
            if (BuildConfig.DEBUG) {
                Log.d("CORE", "start wait whe destroy::" + this.destroyReciver.isDestroy);
            }

            try {
                Thread.sleep(3000);
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (BuildConfig.DEBUG) {
                Log.d("CORE", "finish wait whe destroy::" + this.destroyReciver.isDestroy);
            }
            Context context = this.reactContext.getApplicationContext();

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                boolean res = context.stopService(intent);
                if (BuildConfig.DEBUG) {
                    Log.d("CORE", "stopService---->>>>: " + res);
                }
            }else{
                boolean res = context.stopService(intent);
                if (BuildConfig.DEBUG) {
                    Log.d("CORE", "stopService---->>>>: " + res);
                }
            }
        }

        try {
            Thread.sleep(1000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (BuildConfig.DEBUG) {
            Log.d("CORE", "finish wait whe destroy::" + this.destroyReciver.isDestroy);
        }


        if (this.isLoadWalletReciver.isLoadWallet) {
            Context context = this.reactContext.getApplicationContext();

            context.stopService(intent);
        }

        this.isReady = false;
        this.isStart = false;
        promise.resolve(String.valueOf(true));
    }

    @ReactMethod
    public void setPhrase(String phrase, Promise promise) {
        this.phrase = phrase.getBytes();
        promise.resolve("ok");
    }

    @ReactMethod
    public void resync(Promise promise) {
        isReady = false;
        this.isStart = false;

        if (walletManager != null && walletManager.dbSaveBlocks != null ) {
//            walletManager.dbSaveBlocks.endTransaction();
            walletManager.dbSaveBlocks.close();
        }
        if(walletManager != null && walletManager.dbHelper != null) {
            walletManager.dbHelper.close();
        }

        Context context = this.reactContext.getApplicationContext();

        context.stopService(intent);

        /////////////////////
        ZipInputStream zis;
        String fileOutput = "/data/user/"
                + "/0/com.lapo"
                + "/databases/";


        try {
            if (BuildConfig.DEBUG) {
                Log.d("CORE", "reset::" + this.inputStream);
            }

            zis = new ZipInputStream(new BufferedInputStream(this.inputStream));

            ZipEntry ze;

            while ((ze = zis.getNextEntry()) != null && !ze.isDirectory()) {
                FileOutputStream fout = new FileOutputStream(fileOutput + ze.getName());

                byte[] buffer = new byte[1024];
                int length = 0;

                while ((length = zis.read(buffer)) > 0) {
                    fout.write(buffer, 0, length);
                }
                zis.closeEntry();
                fout.close();
            }

//            zis.close();
//            inputStream.close();

            final BRCoreMasterPubKey masterPubKey =
                    new BRCoreMasterPubKey(this.phrase, true);

            final BRCoreChainParams chainParams =
                    BRCoreChainParams.mainnetChainParams;

            walletManager =
                    new BRWalletManager(masterPubKey, chainParams, BIP39_CREATION_TIME, this.reactContext, this.icon);

            if (walletManager != null && walletManager.dbHelper != null) {
                walletManager.dbSaveBlocks = walletManager.dbHelper.getWritableDatabase();
                try {
                    walletManager.dbSaveBlocks.beginTransaction();

                    walletManager.dbSaveBlocks.delete("mytable", "1=1", null);
                    walletManager.dbSaveBlocks.delete("transactions", "1=1", null);

                    walletManager.dbSaveBlocks.setTransactionSuccessful();
                } catch (SQLException error) {
                    error.printStackTrace();
                    promise.reject("error");
                } catch (NullPointerException e) {
                    e.printStackTrace();
                    promise.reject("error");
                } finally {
                    walletManager.dbSaveBlocks.endTransaction();
                    walletManager.dbSaveBlocks.close();
                    walletManager.dbHelper.close();
                }
            }
        } catch (IOException error) {
            promise.reject("error");

            error.printStackTrace();
        }

        promise.resolve("ok");
    }

    public static InputStream clone(final InputStream inputStream) {
        try {
            inputStream.mark(0);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int readLength = 0;
            while ((readLength = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, readLength);
            }
            inputStream.reset();
            outputStream.flush();
            return new ByteArrayInputStream(outputStream.toByteArray());
        }
        catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @ReactMethod
    public void copyDB(Promise promise) {
        if (walletManager != null && walletManager.dbSaveBlocks != null ) {
            walletManager.dbSaveBlocks.close();
        }
        if(walletManager != null && walletManager.dbHelper != null) {
            walletManager.dbHelper.close();
        }

        ZipInputStream zis;
        String fileOutput = "/data/user/"
                + "/0/com.lapo"
                + "/databases/";

        try {
            if (BuildConfig.DEBUG) {
                Log.d("CORE", "copyDB::" + this.inputStream);
            }

            zis = new ZipInputStream(new BufferedInputStream(this.inputStream));

            ZipEntry ze;

            while ((ze = zis.getNextEntry()) != null && !ze.isDirectory()) {
                FileOutputStream fout = new FileOutputStream(fileOutput + ze.getName());

                byte[] buffer = new byte[1024];
                int length = 0;

                while ((length = zis.read(buffer)) > 0) {
                    fout.write(buffer, 0, length);
                }
                zis.closeEntry();
                fout.close();
            }


            final BRCoreMasterPubKey masterPubKey =
                    new BRCoreMasterPubKey(this.phrase, true);

            final BRCoreChainParams chainParams =
                    BRCoreChainParams.mainnetChainParams;

            walletManager =
                    new BRWalletManager(masterPubKey, chainParams, BIP39_CREATION_TIME, this.reactContext, this.icon);

//            zis.close();
//            inputStream.close();
            if (walletManager != null && walletManager.dbHelper != null) {
                walletManager.dbSaveBlocks = walletManager.dbHelper.getWritableDatabase();
                try {
                    walletManager.dbSaveBlocks.beginTransaction();

                    walletManager.dbSaveBlocks.delete("mytable", "id>440000", null);
                    walletManager.dbSaveBlocks.delete("transactions", "1=1", null);

                    walletManager.dbSaveBlocks.setTransactionSuccessful();
                } catch (SQLException error) {
                    error.printStackTrace();
                    promise.reject("error");
                } catch (NullPointerException e) {
                    e.printStackTrace();
                    promise.reject("error");
                } finally {
                    walletManager.dbSaveBlocks.endTransaction();
                    walletManager.dbSaveBlocks.close();
                    walletManager.dbHelper.close();
                }
            }
        } catch (IOException error) {
            promise.reject("error");

            error.printStackTrace();
        }

        promise.resolve("ok");
    }

    @ReactMethod
    public void getBalance(Promise promise) {
        promise.resolve(String.valueOf(this.balanceReciver.balance));
    }

    @ReactMethod
    public void getLastBlockHeight(Promise promise) {
        promise.resolve(paramsReciver.params);
    }

    @ReactMethod
    public void setPathDB(String pathDB, Promise promise) {
        promise.resolve(pathDB);
    }

    @ReactMethod
    public void getReceiveAddress(Promise promise) {
        promise.resolve(this.addressReciver.address);
    }

    @ReactMethod
    public void isReady(Promise promise) {
        if (BuildConfig.DEBUG) {
            Log.d("CORE", "isReady::" + this.cashbackReciver.isReady);
        }
        promise.resolve(this.cashbackReciver.isReady);
    }

    @ReactMethod
    public void getTransactions(Promise promise) {
        promise.resolve(this.transactionsReciver.transactions);
    }

    @ReactMethod
    public void reScan(Promise promise) {
        resyncToClient();
        promise.resolve("resync");
    }


    @ReactMethod
    public void newTransaction(final String addString, final String amountInput, final String note, Promise promise) {
        long amount = (long) (Double.parseDouble(amountInput) * 1000000.0);
        if (BuildConfig.DEBUG) {
            System.out.println("newTransaction            addString:: " + addString + " amount:: " + amount);
        }
        BRCoreAddress addr = new BRCoreAddress(addString);

        if (!this.isLoadWalletReciver.isLoadWallet) {
            promise.reject("is not load wallet", "please wait");
            return;
        }
//
//
        if (!addr.isValid()) {
            promise.reject("Not a valid address", "Not a valid address");
            return;
        }
//
        if (amount <= 0) {
            promise.reject("Amount must be greater than 0", "Amount must be greater than 0");
            return;
        }

        sendValidTxToClient(addString, amount);

        txHashReciver.hash = "";

        sendTxToClient(addString, amount);


        while(txHashReciver.hash == "") {
            if(txHashReciver.hash.contains( "error")) {
                promise.reject("error", txHashReciver.hash);
                return;
            }
            try {
                Thread.sleep(1000);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if(txHashReciver.hash.contains( "error")) {
            promise.reject("error", txHashReciver.hash);
            return;
        }
        if (BuildConfig.DEBUG) {
            System.out.println("            txHashReciver :hash:" + txHashReciver.hash);
        }

        promise.resolve(txHashReciver.hash);

    }

    public static void copyFile(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[1024];
        int read;
        while ((read = in.read(buffer)) != -1) {
            out.write(buffer, 0, read);
        }
    }

    @ReactMethod
    public void lapoName(Promise promise) {
        System.out.println("            start lapoName");

        String pathName = "/data/user/0/com.lapo/files/lapo.pdf";
        File fromFile = new File(pathName);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
        String currentDateandTime = sdf.format(new Date());

        String fileName =  currentDateandTime + "-" + fromFile.getName();
        String fileName2 =  "secret_" + currentDateandTime + "-" + fromFile.getName();
        File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS).getAbsolutePath());
        dir.mkdirs();

        System.out.println("            start dir::" + dir.getAbsolutePath());
        File toFile = new File(dir.getAbsolutePath(), fileName);
        File toFile2 = new File(dir.getAbsolutePath(), fileName2);

        InputStream in = null;
        InputStream in2 = null;
        OutputStream out = null;
        OutputStream out2 = null;

        try {
            in = new FileInputStream(fromFile);
            in2 = new FileInputStream(fromFile);

            out = new FileOutputStream(toFile);
            out2 = new FileOutputStream(toFile2);

            copyFile(in, out);
            copyFile(in2, out2);

            DownloadManager downloadManager = (DownloadManager) this.reactContext.getSystemService(Context.DOWNLOAD_SERVICE);
            downloadManager.addCompletedDownload(fileName2, fileName2, true, "application/pdf", toFile2.getPath(), toFile2.length(), true);
        } catch (IOException e) {
            System.out.println("            start lapoName" + e);
        } finally {

        }

        promise.resolve(toFile.getPath());
    }

    @ReactMethod
    public void downloadPublicPdf(Promise promise) {
        System.out.println("            downloadPublicPdf");

        String pathName = "/data/user/0/com.lapo/files/lapoPublic.pdf";
        File fromFile = new File(pathName);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
        String currentDateandTime = sdf.format(new Date());

        String fileName =  currentDateandTime + "-" + fromFile.getName();
        String fileName2 =  "public_" + currentDateandTime + "-" + fromFile.getName();
        File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS).getAbsolutePath());
        dir.mkdirs();

        System.out.println("            start dir::" + dir.getAbsolutePath());
        File toFile = new File(dir.getAbsolutePath(), fileName);
        File toFile2 = new File(dir.getAbsolutePath(), fileName2);

        InputStream in = null;
        InputStream in2 = null;
        OutputStream out = null;
        OutputStream out2 = null;

        try {
            in = new FileInputStream(fromFile);
            in2 = new FileInputStream(fromFile);

            out = new FileOutputStream(toFile);
            out2 = new FileOutputStream(toFile2);

            copyFile(in, out);
            copyFile(in2, out2);

            DownloadManager downloadManager = (DownloadManager) this.reactContext.getSystemService(Context.DOWNLOAD_SERVICE);
            downloadManager.addCompletedDownload(fileName2, fileName2, true, "application/pdf", toFile2.getPath(), toFile2.length(), true);
        } catch (IOException e) {
            System.out.println("            downloadPublicPdf" + e);
        } finally {

        }

        promise.resolve(toFile.getPath());
    }
    private static byte[] asBytes(int ints[]) {
        byte bytes[] = new byte[ints.length];

        for (int i = 0; i < ints.length; i++)
            bytes[i] = (byte) ints[i];

        return bytes;

    }

    private void registerDestroyReceiver(){
        destroyReciver = new IntentDestroyReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.SEND_IS_DESTROY);

        this.reactContext.registerReceiver(destroyReciver, intentFilter);
    }


    private void registerCashbackReceiver(){
        cashbackReciver = new IntentReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.CASHBACK_INFO);

        this.reactContext.registerReceiver(cashbackReciver, intentFilter);
    }

    private void registerInfoParamsReceiver(){
        paramsReciver = new IntentParamsReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.PARAMS_INFO);

        this.reactContext.registerReceiver(paramsReciver, intentFilter);
    }

    private void registerBalaceReceiver(){
        balanceReciver = new IntentBalaceReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.SEND_BALANCE);

        this.reactContext.registerReceiver(balanceReciver, intentFilter);
    }

    private void registerTxHashReceiver(){
        txHashReciver = new IntentTxHashReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.SEND_TX_HASH);

        this.reactContext.registerReceiver(txHashReciver, intentFilter);
    }

    private void registerAddressReceiver(){
        addressReciver = new IntentAddressReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.SEND_ADDRESS);

        this.reactContext.registerReceiver(addressReciver, intentFilter);
    }


    private void registerTransactionsReceiver(){
        transactionsReciver = new IntentTransactionsReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.SEND_TRANSACTIONS);

        this.reactContext.registerReceiver(transactionsReciver, intentFilter);
    }

    private void registerIsLoadWalletReceiver(){
        isLoadWalletReciver = new IntentIsLoadWalletReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.SEND_IS_LOAD_WALLET);

        this.reactContext.registerReceiver(isLoadWalletReciver, intentFilter);
    }

    private void registerIsLoadingStartWalletReceiver(){
        isLoadingStartWalletReciver = new IntentIsLoadingStartWalletReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.SEND_IS_LOADING_START_WALLET);

        this.reactContext.registerReceiver(isLoadingStartWalletReciver, intentFilter);
    }

    private class IntentDestroyReciver extends BroadcastReceiver {
        public Boolean isDestroy = false;
        @Override
        public void onReceive(Context context, Intent intent) {
            isDestroy = intent.getBooleanExtra("isDestroy", false);
            if (BuildConfig.DEBUG) {
                System.out.println("            isDestroy:::" + isDestroy);
            }
        }
    }


    private class IntentReciver extends BroadcastReceiver {
        public Boolean isReady = false;
        @Override
        public void onReceive(Context context, Intent intent) {
            isReady = intent.getBooleanExtra("isReady", false);
            if (BuildConfig.DEBUG) {
                System.out.println("            isReady:::" + isReady);
            }
        }
    }

    private class IntentParamsReciver extends BroadcastReceiver {
        public String params = "";
        @Override
        public void onReceive(Context context, Intent intent) {
            params = intent.getStringExtra("params");
        }
    }

    private class IntentBalaceReciver extends BroadcastReceiver {
        public long balance = 0;
        @Override
        public void onReceive(Context context, Intent intent) {
            balance = intent.getLongExtra("balance", 0);
            if (BuildConfig.DEBUG) {
                System.out.println("            balance:::" + balance);
            }
        }
    }

    private class IntentTxHashReciver extends BroadcastReceiver {
        public String hash = "";
        @Override
        public void onReceive(Context context, Intent intent) {
            hash = intent.getStringExtra("hash");
        }
    }

    private class IntentAddressReciver extends BroadcastReceiver {
        public String address = "";
        @Override
        public void onReceive(Context context, Intent intent) {
            address = intent.getStringExtra("address");
        }
    }

    private class IntentTransactionsReciver extends BroadcastReceiver {
        public String transactions = "";
        @Override
        public void onReceive(Context context, Intent intent) {
            transactions = intent.getStringExtra("transactions");
        }
    }

    private class IntentIsLoadWalletReciver extends BroadcastReceiver {
        public boolean isLoadWallet = false;
        @Override
        public void onReceive(Context context, Intent intent) {
            isLoadWallet = intent.getBooleanExtra("isLoadWallet", false);
        }
    }

    private class IntentIsLoadingStartWalletReciver extends BroadcastReceiver {
        public boolean isLoadingStartWallet = false;
        @Override
        public void onReceive(Context context, Intent intent) {
            isLoadingStartWallet = intent.getBooleanExtra("isLoadingStartWallet", false);
        }
    }

    private void sendValidTxToClient(String tx, long amount){
        Intent intent = new Intent();
        intent.setAction(HelloService.VERIFY_TRANSACTION);
        intent.putExtra("txAddress", tx);
        intent.putExtra("txAmount", amount);
        this.reactContext.sendBroadcast(intent);
    }

    private void sendTxToClient(String tx, long amount){
        Intent intent = new Intent();
        intent.setAction(HelloService.GET_TRANSACTION);
        intent.putExtra("txAddress", tx);
        intent.putExtra("txAmount", amount);
        this.reactContext.sendBroadcast(intent);
    }

    private void disconnectToClient(){
        Intent intent = new Intent();
        intent.setAction(HelloService.DISCONNECT);
        this.reactContext.sendBroadcast(intent);
    }


    private void resyncToClient(){
        Intent intent = new Intent();
        intent.setAction(HelloService.RESYNC);
        this.reactContext.sendBroadcast(intent);
    }

}