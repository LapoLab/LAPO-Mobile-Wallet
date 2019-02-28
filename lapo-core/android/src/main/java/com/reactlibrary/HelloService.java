package com.reactlibrary;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.os.IBinder;
import android.util.Log;

import com.breadwallet.core.BRCoreAddress;
import com.breadwallet.core.BRCoreChainParams;
import com.breadwallet.core.BRCoreMasterPubKey;
import com.breadwallet.core.BRCorePeerManager;
import com.breadwallet.core.BRCoreTransaction;
import com.breadwallet.core.BRCoreWallet;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Build;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.support.v4.app.NotificationCompat;

import java.util.concurrent.TimeUnit;

public class HelloService extends Service {

    final static String CASHBACK_INFO = "cashback_info";
    final static String PARAMS_INFO = "params_info";
    final static String SEND_BALANCE = "send_balace";
    final static String SEND_ADDRESS = "send_address";
    final static String SEND_TRANSACTIONS = "send_transactions";
    final static String GET_TRANSACTION = "get_transaction";
    final static String SEND_IS_LOAD_WALLET = "send_is_load_wallet";
    final static String DISCONNECT = "disconnect";
    final static String RESYNC = "resync";
    final static String SEND_IS_DESTROY = "send_is_destroy";
    final static String SEND_TX_HASH = "send_tx_hash";
    final static String VERIFY_TRANSACTION = "verify_transaction";
    final static String SEND_IS_LOADING_START_WALLET = "send_is_loading_start_wallet";
    final static String SEND_DESTROY_CLIENT = "send_destroy_client";

    private static final String TAG = "HelloService";
    BRCoreWallet wallet;
    boolean isReady = false;

    IntentTxReciver txReciver;
    IntentDisconnectReciver disconnectReciver;
    IntentResyncReciver resyncReciver;
    IntentVerifyTxReciver veriffyTxReciver;
    IntentDestroyClientReciver destroyClientReciver;

    private boolean isRunning = false;
    private boolean isStop = false;
    private boolean isClientAppStop = false;

    private static final double BIP39_CREATION_TIME = 1388534400.0;

    private Thread worker;

    boolean isStartCommand = false;
    boolean isStopCommand = false;

    public BRWalletManager walletManager;
    public BRCorePeerManager pm;
    private byte[] phrase;

    private static final String ANDROID_CHANNEL_ID = "com.lapo";
    public static final String ANDROID_CHANNEL_NAME = "LAPO CHANNEL";

    private static final int NOTIFICATION_ID = 555;
    private NotificationManager mManager;
    private int countVerifyBlockHeight = 0;


    private Runnable mAllertRunnable = new Runnable() {
        @Override
        public void run() {

            BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(new Runnable() {
                @Override
                public void run() {
                    if (BuildConfig.DEBUG) {
                        Log.i(TAG, "start:::" + walletManager);
                    }
                    while (true) {
                        try {
                            if (walletManager != null && isRunning) {
                                JSONObject jsonObject = new JSONObject();

                                try {
                                    jsonObject.put("curHeight", pm != null ? pm.getLastBlockHeight() : 0);
                                    jsonObject.put("allHeight", pm != null ? pm.getEstimatedBlockHeight() : 0);

                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }

                                Log.i(TAG, "jsonObject:::" + jsonObject.toString());

                                sendGetLastBlockHeightToClient(jsonObject.toString());

                                if (wallet != null) {
                                    sendBalanceToClient(wallet.getBalance());

                                    sendAddressToClient(wallet.getReceiveAddress().stringify());

                                    sendTransactionsToClient(getTransactions());
                                }

                                sendIsLoadWalletToClient(walletManager != null && walletManager.isLoadTransactions && wallet != null);

                                //
                                if (pm != null && pm.getLastBlockHeight() == pm.getEstimatedBlockHeight()) {

                                    countVerifyBlockHeight += 1;
                                    Log.i(TAG, "LOAD ALL BLOCK ____________ countVerifyBlockHeight:::" + countVerifyBlockHeight + "-isClientAppStop- " + isClientAppStop);

                                    if (countVerifyBlockHeight >= 10 && isClientAppStop) {
                                        Log.i(TAG, "LOAD ALL BLOCK ____________ EXIT SERVICE:::" + pm.getLastBlockHeight() + "-- " + pm.getEstimatedBlockHeight());
                                        isRunning = false;
                                        isClientAppStop = false;
                                        countVerifyBlockHeight = 0;
                                        isStop = true;
                                        walletManager.isCloseDB = true;
                                        Thread.sleep(1000);
                                        walletManager.dbSaveBlocks.close();
                                        walletManager.dbHelper.close();
                                        Thread.sleep(1000);
                                        sendIsLoadingStartWalletToClient(false);

                                        Thread.sleep(1000);

                                        BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mConnectWalletsRunnable);
                                        BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mAllertRunnable);
                                        BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mListenerWalletsRunnable);
                                        BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(mDisconnectWalletsRunnable);
                                        Thread.sleep(1000);

                                        stopForeground(true);
                                        stopSelf();

                                        break;
                                    }


                                } else {
                                    countVerifyBlockHeight = 0;

                                }
                            }
                            Thread.sleep(5000);

                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            });

        }
    };

    private Runnable mListenerWalletsRunnable = new Runnable() {
        @Override
        public void run() {

            BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(new Runnable() {
                @Override
                public void run() {
                    Log.i(TAG, "start:::" + walletManager);

                    while (true) {
                        try {
                            sendIsLoadingStartWalletToClient(true);
                            Log.i(TAG, "isStop::==" + isStop);
                            if (isStop) {
                                pm = walletManager.getPeerManager();
                                Log.i(TAG, "isStop::start " + pm.getConnectStatus().name());

                                while (pm.getConnectStatus().getValue() != 0) {

                                    try {
                                        walletManager.syncStopped("eror");
                                        pm.disconnect();
                                        walletManager.syncStopped("eror");
                                        pm.disconnect();

                                    } catch (Exception e) {
                                        e.printStackTrace();
                                        Log.i(TAG, "Exception HelloService dissconet");

                                    }
                                    if (BuildConfig.DEBUG) {
                                        Log.i(TAG, "isStop::sleep 8 " + walletManager.getPeerManager().getConnectStatus().name());
                                    }
                                }

                                Thread.sleep(1000);
                                walletManager.dbSaveBlocks.close();
                                walletManager.dbHelper.close();

                                stopForeground(true);
                                stopSelf();
                                isStop = false;
                                isRunning = false;
                                walletManager.isCloseDB = true;
                                Log.i(TAG, "isStop::finish");

                            }
                            Thread.sleep(1000);

                        } catch (Exception e) {
                            e.printStackTrace();
                            Log.i(TAG, "Exception global HelloService ");
                            walletManager.isCloseDB = true;
                            walletManager.dbSaveBlocks.close();
                            walletManager.dbHelper.close();

                            stopForeground(true);
                            stopSelf();

                        }

                        if (walletManager.isCloseDB) {
                            break;
                        }
                    }
                }
            });

        }
    };

    private Runnable mDisconnectWalletsRunnable = new Runnable() {
        @Override
        public void run() {

            BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(new Runnable() {
                @Override
                public void run() {
                    try {

                        walletManager.syncStopped("eror");
                        walletManager.getPeerManager().disconnect();
                        walletManager.getPeerManager().disposeNative();

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });

        }
    };

    private Runnable mDisconnectLightWalletsRunnable = new Runnable() {
        @Override
        public void run() {

            BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        walletManager.getPeerManager().disconnect();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });

        }
    };

    private Runnable mConnectWalletsRunnable = new Runnable() {
        @Override
        public void run() {

            BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(new Runnable() {
                @Override
                public void run() {
                    if (walletManager != null) {
                        Log.i(TAG, "pm:::" + walletManager);


                        isRunning = true;
                        isClientAppStop = false;
                        walletManager.isCloseDB = false;
                        walletManager.syncStarted();
                        pm = walletManager.getPeerManager();
                        if (pm != null) {
                            if (BuildConfig.DEBUG) {
                                Log.d("CORE", "pm::" + pm.getConnectStatus());
                            }
                            pm.connect();
                            if (BuildConfig.DEBUG) {
                                Log.d("CORE", "pm::" + pm.getDownloadPeerName());
                            }
                        }
                        walletManager.syncStarted();

                        isReady = true;
                        sendIsReadyToClient(true);
//                        intent.putExtra("isReady", true);

//                        if (pm != null) {
//                            walletManager.getPeerManager().rescan();
//                        }
                        isStartCommand = false;
                    }
                }
            });

        }
    };


    private NotificationManager getManager() {
        if (mManager == null) {
            mManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        }
        return mManager;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        if (BuildConfig.DEBUG) {
            Log.i(TAG, "Service onCreate");
        }

        isRunning = true;
        isStop = false;

        registerTxReceiver();
        registerDisconnectReceiver();
        registerResyncReceiver();
        registerVerifyTxReceiver();
        registerDestroyClientReceiver();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel androidChannel = new NotificationChannel(ANDROID_CHANNEL_ID,
                    ANDROID_CHANNEL_NAME, NotificationManager.IMPORTANCE_DEFAULT);
            // Sets whether notifications posted to this channel should display notification lights
            androidChannel.enableLights(true);
            // Sets whether notification posted to this channel should vibrate.
            androidChannel.enableVibration(true);
            // Sets the notification light color for notifications posted to this channel
            androidChannel.setLightColor(Color.GREEN);
//                     Sets whether notifications posted to this channel appear on the locksc

            getManager().createNotificationChannel(androidChannel);


            PendingIntent intent = PendingIntent.getService(getApplicationContext(), 0,
                    new Intent(getApplicationContext(), ProxyService.class),
                    0);

            NotificationCompat.Builder builder =
                    new NotificationCompat.Builder(getApplicationContext(), ANDROID_CHANNEL_ID)
//                                .setDefaults(Notification.DEFAULT_ALL)
//                                .setAutoCancel(true)
                            .setContentIntent(intent)
                            .setDefaults(Notification.DEFAULT_ALL)
                            .setAutoCancel(true)
                            .setSmallIcon(R.mipmap.ic_notification)
//                            .setSmallIcon(this.icon)
                            .setContentTitle("Lapo is syncing")
                            .setContentText("Tap for more information or to stop app.");

            Notification notification = builder.build();

            getManager().notify(NOTIFICATION_ID, notification);

            startForeground(NOTIFICATION_ID, notification);
        } else {
            NotificationCompat.Builder builder = new NotificationCompat.Builder(this)
                    .setContentTitle("Lapo is syncing")
                    .setContentText("Tap for more information or to stop app.")
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setAutoCancel(true);
            Notification notification = builder.build();

            startForeground(NOTIFICATION_ID, notification);
        }
    }

    @Override
    public int onStartCommand(final Intent intent, int flags, int startId) {
        isRunning = true;
//        intent.putExtra("isReady", false);
        sendIsReadyToClient(false);

        if (BuildConfig.DEBUG) {
            Log.i(TAG, "Service onStartCommand");
            Log.d("CORE", "createWallet::");
        }
        if (intent != null) {
            this.phrase = intent.getExtras().getString("phrase").getBytes();

            int icon = intent.getExtras().getInt("icon");

            final BRCoreMasterPubKey masterPubKey =
                    new BRCoreMasterPubKey(this.phrase, true);

            final BRCoreChainParams chainParams =
                    BRCoreChainParams.mainnetChainParams;

            this.walletManager =
                    new BRWalletManager(masterPubKey, chainParams, BIP39_CREATION_TIME, getApplicationContext(), icon);
            this.walletManager.setupDB();

            this.wallet = this.walletManager.getWallet();
            this.walletManager.isCloseDB = false;


            if (BuildConfig.DEBUG) {
                Log.d("CORE", "walletManager != null::" + String.valueOf(walletManager != null));
                Log.d("CORE", "walletManager.isLoadTransactions::" + String.valueOf(walletManager.isLoadTransactions));
            }

            BRExecutor.getInstance().forLightWeightBackgroundTasks().getRejectedExecutionHandler();
            BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mConnectWalletsRunnable);
            BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mAllertRunnable);
            BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mListenerWalletsRunnable);
            BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mDisconnectWalletsRunnable);

            BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(mConnectWalletsRunnable);
            BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(mAllertRunnable);
            BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(mListenerWalletsRunnable);
        }
        return Service.START_NOT_STICKY;
    }

    @Override
    public IBinder onBind(Intent arg0) {
        Log.i(TAG, "Service onBind::" + arg0.getExtras().getString("address"));
        return null;
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        Log.i(TAG, "Service onTaskRemoved:: onTaskRemoved" + rootIntent.getDataString());
    }

    @Override
    public void onDestroy() {
        Log.i(TAG, "onDestroy::start");
        Log.i(TAG, "Service onDestroy:: finish");
        sendIsDestroyToClient(true);

        stopForeground(true);
        if (walletManager != null) {
            walletManager.isCloseDB = true;
        }
    }

    public boolean containsAddress(String address) {
        return wallet.containsAddress(new BRCoreAddress(address));
    }

    public String getTransactions() {
        JSONArray jsonArray = new JSONArray();

        try {
            BRCoreTransaction[] transactions = wallet.getTransactions();

            for (int i = 0; i < transactions.length; i++) {
                BRCoreTransaction tras = transactions[i];
                BRCoreTransaction tx = transactions[i];

                String toAddress = null;


                for (String to : tx.getInputAddresses()) {
                    if (containsAddress(to)) {
                        toAddress = to;
                        break;
                    }
                }

                if (this.walletManager.getWallet().getTransactionAmount(tx) < 0) {
                    toAddress = tx.getOutputAddresses()[0];
                } else {
                    toAddress = tx.getInputAddresses()[0];
                }
                if (toAddress == null) {
                    throw new NullPointerException("Failed to retrieve toAddress");
                }

                long amountReceived = wallet.getTransactionAmountReceived(tx);

                long amountSent = wallet.getTransactionAmountSent(tx);
                long fee = wallet.getTransactionFee(tx);

                String direction = "";

                if (amountSent > 0 && (amountReceived + fee) == amountSent) {
                    direction = "move";
                } else if (amountSent > 0) {
                    direction = "sent";
                } else {
                    direction = "received";
                }

                boolean isReceived = wallet.getTransactionAmount(tx) > 0;

                long amount = wallet.getTransactionAmount(tx);

                boolean isValid = wallet.transactionIsValid(tx);

                long lastBlockHeight = this.walletManager.getPeerManager().getEstimatedBlockHeight();
                long blockHeight = this.walletManager.getPeerManager().getLastBlockHeight();
                long confirmations = blockHeight > lastBlockHeight
                        ? 0
                        : (lastBlockHeight - blockHeight) + 1;


                String status = "invalid";

                if (isValid) {
                    status = "pending";

                    if (confirmations == 0) {
                        status = "pending";
                    }
                    if (confirmations >= 1 && confirmations < 6) {
                        status = "confirmed";
                    }
                }


                boolean isPedding = this.wallet.transactionIsPending(tx);

                if (Math.abs(amount) > 0) {
                    try {
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.put("id", byteArrayToHex(tx.getHash()));
                        jsonObject.put("address", amount > 0 ? toAddress : wallet.getTransactionAddressOutputs(tx) != null ? wallet.getTransactionAddressOutputs(tx).stringify() : "??");
                        jsonObject.put("amount", Math.abs(amount));

//                        jsonObject.put("sendAddress", wallet.getTransactionAddressOutputs(tx).stringify());

                        jsonObject.put("time", tras.getTimestamp());
                        jsonObject.put("time2", System.currentTimeMillis());
                        jsonObject.put("mode", amount > 0 ? "out" : "input");
                        jsonObject.put("direction", direction);
                        jsonObject.put("status", status);
                        jsonObject.put("fee", wallet.getTransactionFee(tx));

                        jsonArray.put(jsonObject);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }

            Log.i(TAG, "TXSSS:::::LENGTH::start ========>>>>>>>" + jsonArray.length());
            return jsonArray.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return jsonArray.toString();
        }
    }

    public static String byteArrayToHex(byte[] a) {
        StringBuilder sb = new StringBuilder(a.length * 2);
        for (byte b : a)
            sb.append(String.format("%02x", b));
        return sb.toString();
    }

    private void sendIsDestroyToClient(Boolean isDestroy) {
        Intent intent = new Intent();
        intent.setAction(SEND_IS_DESTROY);
        intent.putExtra("isDestroy", isDestroy);
        sendBroadcast(intent);
    }

    private void sendIsReadyToClient(Boolean isReady) {
        Intent intent = new Intent();
        intent.setAction(CASHBACK_INFO);
        intent.putExtra("isReady", isReady);
        sendBroadcast(intent);
    }

    private void sendGetLastBlockHeightToClient(String params) {
        Intent intent = new Intent();
        intent.setAction(PARAMS_INFO);
        intent.putExtra("params", params);
        sendBroadcast(intent);
    }

    private void sendTxHashToClient(String hash) {
        Intent intent = new Intent();
        intent.setAction(SEND_TX_HASH);
        intent.putExtra("hash", hash);
        sendBroadcast(intent);
    }

    private void sendBalanceToClient(long balance) {
        Intent intent = new Intent();
        intent.setAction(SEND_BALANCE);
        intent.putExtra("balance", balance);
        sendBroadcast(intent);
    }

    private void sendAddressToClient(String address) {
        Intent intent = new Intent();
        intent.setAction(SEND_ADDRESS);
        intent.putExtra("address", address);
        sendBroadcast(intent);
    }

    private void sendTransactionsToClient(String transactions) {
        Intent intent = new Intent();
        intent.setAction(SEND_TRANSACTIONS);
        intent.putExtra("transactions", transactions);
        sendBroadcast(intent);
    }

    private void sendIsLoadWalletToClient(boolean isLoadWallet) {
        Intent intent = new Intent();
        intent.setAction(SEND_IS_LOAD_WALLET);
        intent.putExtra("isLoadWallet", isLoadWallet);
        sendBroadcast(intent);
    }

    private void sendIsLoadingStartWalletToClient(boolean isLoadWallet) {
        Intent intent = new Intent();
        intent.setAction(SEND_IS_LOADING_START_WALLET);
        intent.putExtra("isLoadingStartWallet", isLoadWallet);
        sendBroadcast(intent);
    }

    private class IntentTxReciver extends BroadcastReceiver {
        public String address = "";
        public long amount = 0;

        @Override
        public void onReceive(Context context, Intent intent) {
            address = intent.getStringExtra("txAddress");
            amount = intent.getLongExtra("txAmount", 0);

            System.out.println("            tx: address: " + address);
            System.out.println("            tx: amount: " + amount);

            if (address != "" && amount > 0 && walletManager != null) {

                while (veriffyTxReciver.isNotFinish) {
                    try {
                        Thread.sleep(100);
                        System.out.println("            veriffyTxReciver.isNotFinish==true:");

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                if (veriffyTxReciver.error.length() > 0) {
                    sendTxHashToClient(new String("error:" + veriffyTxReciver.error));
                    return;
                }

                System.out.println("            tx::" + address);
                System.out.println("            tx::" + amount);

                BRCoreAddress addr = new BRCoreAddress(address);
                System.out.println("            addr::" + String.valueOf(addr));

                wallet = walletManager.getWallet();

                BRCoreTransaction tx = wallet.createTransaction(amount, addr);
                if (tx == null) {
                    sendTxHashToClient(new String("error:" + "Not enough money"));
                    return;
                }

                walletManager.setTransaction(amount, address);

                wallet.signTransaction(tx, 0x00, phrase);

                walletManager.getPeerManager().publishTransaction(tx);


                sendTxHashToClient(byteArrayToHex(tx.getHash()));
            } else {
                sendTxHashToClient(new String("error:" + veriffyTxReciver.error));
            }

        }
    }

    private class IntentVerifyTxReciver extends BroadcastReceiver {
        public String address = "";
        public String error = "";
        public boolean isNotFinish = false;
        public long amount = 0;

        @Override
        public void onReceive(Context context, Intent intent) {
            error = "";
            isNotFinish = true;
            Log.i(TAG, "IntentVarifyTxReciver:::start");
            address = intent.getStringExtra("txAddress");
            amount = intent.getLongExtra("txAmount", 0);

            if (BuildConfig.DEBUG) {
                System.out.println("            tx: address: " + address);
                System.out.println("            tx: amount: " + amount);
            }

            if (address != "" && amount > 0 && walletManager != null) {
                wallet = walletManager.getWallet();

                BRCoreAddress addr = new BRCoreAddress(address);
                if (BuildConfig.DEBUG) {
                    System.out.println("            addr::" + String.valueOf(addr));
                }

                boolean isMyAddress = false;

                for (int i = 0; i < wallet.getAllAddresses().length; i++) {
                    if (wallet.getAllAddresses()[i].stringify().contains(address)) {
                        isMyAddress = true;
                    }
                }

                if (isMyAddress) {
                    error = "Payment to yourself is not possible";
                }

                if (wallet.createTransaction(amount, addr) == null) {
                    error = "Not enough money";
                }
            }
            isNotFinish = false;
        }
    }


    private class IntentDisconnectReciver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            try {

                isRunning = false;
                isClientAppStop = false;
                countVerifyBlockHeight = 0;
                isStop = true;
                walletManager.isCloseDB = true;
                Thread.sleep(1000);

                BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mConnectWalletsRunnable);

                BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(mDisconnectWalletsRunnable);

                BRExecutor.getInstance().forLightWeightBackgroundTasks().awaitTermination(5, TimeUnit.SECONDS);



                walletManager.dbSaveBlocks.close();
                walletManager.dbHelper.close();
                Thread.sleep(1000);


                BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mAllertRunnable);
                BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mListenerWalletsRunnable);


                BRExecutor.getInstance().forLightWeightBackgroundTasks().purge();
                BRExecutor.getInstance().forLightWeightBackgroundTasks().awaitTermination(5, TimeUnit.SECONDS);


                stopForeground(true);
                stopSelf();
                
            } catch (Exception e) {

            }

        }
    }

    private class IntentDestroyClientReciver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Log.i(TAG, "IntentDestroyClientReciver:::start");
            isClientAppStop = true;
            Log.i(TAG, "IntentDestroyClientReciver:::finish");

        }
    }

    private class IntentResyncReciver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Log.i(TAG, "IntentResyncReciver: -->>>>>>>>::start::count task: " + String.valueOf(BRExecutor.getInstance().forLightWeightBackgroundTasks().getActiveCount()));
            if (isReady && walletManager != null && walletManager.isLoadTransactions && wallet != null) {
                try {
                    walletManager.isCloseDB = true;

                    BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mConnectWalletsRunnable);
                    BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(mDisconnectLightWalletsRunnable);

                    BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mAllertRunnable);

                    BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mListenerWalletsRunnable);

                    try {
                        Thread.sleep(1000);
                        System.out.println("            veriffyTxReciver.isNotFinish==true:");

                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    walletManager.isCloseDB = false;
//                    walletManager.setupDB();

                    BRExecutor.getInstance().forLightWeightBackgroundTasks().remove(mDisconnectLightWalletsRunnable);
                    BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(mConnectWalletsRunnable);

                    BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(mAllertRunnable);

                    BRExecutor.getInstance().forLightWeightBackgroundTasks().execute(mListenerWalletsRunnable);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            Log.i(TAG, "IntentResyncReciver:-->>>>>>>>::finish");

        }
    }

    private void registerVerifyTxReceiver() {
        veriffyTxReciver = new IntentVerifyTxReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.VERIFY_TRANSACTION);

        getApplicationContext().registerReceiver(veriffyTxReciver, intentFilter);
    }

    private void registerTxReceiver() {
        txReciver = new IntentTxReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.GET_TRANSACTION);

        getApplicationContext().registerReceiver(txReciver, intentFilter);
    }

    private void registerDisconnectReceiver() {
        disconnectReciver = new IntentDisconnectReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.DISCONNECT);

        getApplicationContext().registerReceiver(disconnectReciver, intentFilter);
    }

    private void registerDestroyClientReceiver() {
        destroyClientReciver = new IntentDestroyClientReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.SEND_DESTROY_CLIENT);

        getApplicationContext().registerReceiver(destroyClientReciver, intentFilter);
    }

    private void registerResyncReceiver() {
        resyncReciver = new IntentResyncReciver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(HelloService.RESYNC);

        getApplicationContext().registerReceiver(resyncReciver, intentFilter);
    }

}
