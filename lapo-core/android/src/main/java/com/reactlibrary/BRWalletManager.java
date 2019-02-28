package com.reactlibrary;

import com.breadwallet.core.BRCoreAddress;
import com.breadwallet.core.BRCoreKey;
import com.breadwallet.core.BRCoreWalletManager;
import com.breadwallet.core.BRCoreWallet;
import com.breadwallet.core.BRCoreMerkleBlock;
import com.breadwallet.core.BRCorePeerManager;
import com.breadwallet.core.BRCoreMasterPubKey;
import com.breadwallet.core.BRCoreChainParams;
import com.breadwallet.core.BRCoreTransaction;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.graphics.Color;

import android.util.Log;

import java.util.Arrays;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import android.support.v4.app.NotificationCompat;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;

public class BRWalletManager extends BRCoreWalletManager {
    final String LOG_TAG = "BRWalletManager";

    private Executor mListenerExecutor = Executors.newSingleThreadExecutor();

    DBHelper dbHelper;
    boolean isLoadTransactions = false;
    boolean isStoped = false;
    boolean isCloseDB = false;
    long amount = 0;
    Context context;
    int icon;
    SQLiteDatabase dbSaveBlocks;
    public static final String ANDROID_CHANNEL_ID = "com.lapo";
    public static final String ANDROID_CHANNEL_NAME = "LAPO CHANNEL";

    BRWalletManager(BRCoreMasterPubKey masterPubKey, BRCoreChainParams chainParams, double earliestPeerTime, Context context, int icon) {
        super(masterPubKey, chainParams, earliestPeerTime);
        this.context = context;
        this.icon = icon;
        dbHelper = new DBHelper(context);
        dbSaveBlocks = dbHelper.getWritableDatabase();
    }

    public void setupDB() {
//        dbHelper = new DBHelper(context);
//        dbSaveBlocks = dbHelper.getWritableDatabase();
    }

    @Override
    protected BRCoreWallet.Listener createWalletListener() {
        return new BRCoreWalletManager.WrappedExecutorWalletListener(
                super.createWalletListener(),
                mListenerExecutor);
    }

    @Override
    protected BRCorePeerManager.Listener createPeerManagerListener() {
        return new BRCoreWalletManager.WrappedExecutorPeerManagerListener(
                super.createPeerManagerListener(),
                mListenerExecutor);
    }


    public boolean containsAddress(String address) {
        return this.getWallet().containsAddress(new BRCoreAddress(address));
    }

    public void onTxAdded(BRCoreTransaction transaction) {
        super.onTxAdded(transaction);
        if(!this.isCloseDB) {
            try {

                Log.d(LOG_TAG, "onTxAdded:::" + transaction);

                BRTransactionEntity enty = new BRTransactionEntity(transaction.serialize(), transaction.getBlockHeight(), transaction.getTimestamp(), BRCoreKey.encodeHex(transaction.getHash()));

                ContentValues cv = new ContentValues();

                cv.put("TX_COLUMN_ID", enty.getTxHash());
                cv.put("TX_BUFF", enty.getBuff());
                cv.put("TX_BLOCK_HEIGHT", enty.getBlockheight());
                cv.put("TX_TIME_STAMP", enty.getTimestamp());


                cv.put("amount", this.amount);
                cv.put("mode", "output");


                String toAddress = null;

                for (String to : transaction.getInputAddresses()) {
                    if (containsAddress(to)) {
                        toAddress = to;
                        break;
                    }
                }

                if (this.getWallet().getTransactionAmount(transaction) < 0) {
                    toAddress = transaction.getOutputAddresses()[0];
                } else {
                    toAddress = transaction.getInputAddresses()[0];
                }

                long amountReceived = this.getWallet().getTransactionAmountReceived(transaction);
                long amountSent = this.getWallet().getTransactionAmountSent(transaction);
                long fee = this.getWallet().getTransactionFee(transaction);

                String direction = "";
                String plusMinus = "";

                if (amountSent > 0 && (amountReceived + fee) == amountSent) {
                    direction = "move";
                    plusMinus = "";
                } else if (amountSent > 0) {
                    direction = "sent";
                    plusMinus = "-";
                } else {
                    direction = "received";
                    plusMinus = "+";
                }

                long amount = this.getWallet().getTransactionAmount(transaction);

                if (Math.abs(amount) > 0.0 && direction == "received") {

                    if (Build.VERSION.SDK_INT > 26) {
                        NotificationChannel androidChannel = new NotificationChannel(ANDROID_CHANNEL_ID,
                                ANDROID_CHANNEL_NAME, NotificationManager.IMPORTANCE_DEFAULT);
                        // Sets whether notifications posted to this channel should display notification lights
                        androidChannel.enableLights(true);
                        // Sets whether notification posted to this channel should vibrate.
                        androidChannel.enableVibration(true);
                        // Sets the notification light color for notifications posted to this channel
                        androidChannel.setLightColor(Color.GREEN);
//                     Sets whether notifications posted to this channel appear on the locksc


                        PendingIntent intent = PendingIntent.getService(this.context.getApplicationContext(), 0,
                                new Intent(this.context.getApplicationContext(), ProxyService.class),
                                0);

                        NotificationCompat.Builder builder =
                                new NotificationCompat.Builder(this.context.getApplicationContext(), ANDROID_CHANNEL_ID)
//                                .setDefaults(Notification.DEFAULT_ALL)
//                                .setAutoCancel(true)
                                        .setContentIntent(intent)
                                        .setDefaults(Notification.DEFAULT_ALL)
                                        .setAutoCancel(true)
                                        .setSmallIcon(this.icon)
                                        .setContentTitle("New transaction " + direction + " from " + toAddress)
                                        .setContentText(plusMinus + " " + String.valueOf(Math.abs(amount) / 1000000.0) + " LAX");

                        Notification notification = builder.build();

                        NotificationManager notificationManager =
                                (NotificationManager) this.context.getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
                        notificationManager.cancelAll();
                        notificationManager.createNotificationChannel(androidChannel);
                        notificationManager.notify(1, notification);
                    } else {
                        PendingIntent intent = PendingIntent.getService(this.context.getApplicationContext(), 0,
                                new Intent(this.context.getApplicationContext(), ProxyService.class),
                                0);

                        NotificationCompat.Builder builder =
                                new NotificationCompat.Builder(this.context.getApplicationContext(), ANDROID_CHANNEL_ID)
//                                .setDefaults(Notification.DEFAULT_ALL)
//                                .setAutoCancel(true)
                                        .setContentIntent(intent)
                                        .setDefaults(Notification.DEFAULT_ALL)
                                        .setAutoCancel(true)
                                        .setSmallIcon(this.icon)
                                        .setContentTitle("New transaction " + direction + " from " + toAddress)
                                        .setContentText(plusMinus + " " + String.valueOf(Math.abs(amount) / 1000000.0) + " LAX");

                        Notification notification = builder.build();

                        NotificationManager notificationManager =
                                (NotificationManager) this.context.getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
                        notificationManager.cancelAll();
                        notificationManager.notify(1, notification);
                    }

                }

                dbSaveBlocks.beginTransaction();
                long rowID = dbSaveBlocks.insert("transactions", null, cv);
                if (BuildConfig.DEBUG) {
                    Log.d(LOG_TAG, "row inserted, ID = " + rowID);
                }
                this.amount = 0;
                dbSaveBlocks.setTransactionSuccessful();
            } finally {
                dbSaveBlocks.endTransaction();
            }
        }
    }

    public void onTxUpdated(String hash, int blockHeight, int timeStamp) {
        super.onTxUpdated(hash, blockHeight, timeStamp);
        if(!this.isCloseDB) {
            try {
                dbSaveBlocks.beginTransaction();
                if (BuildConfig.DEBUG) {
                    Log.d(LOG_TAG, "onTxUpdated:::" + hash + " blockHeight::" + blockHeight);
                }

                ContentValues cv = new ContentValues();
                cv.put("TX_BLOCK_HEIGHT", blockHeight);
                cv.put("TX_TIME_STAMP", timeStamp);

                long rowID = dbSaveBlocks.update("transactions", cv, "TX_COLUMN_ID=\"" + hash + "\"", null);
                if (BuildConfig.DEBUG) {
                    Log.d(LOG_TAG, "row updated, ID = " + rowID);
                }
                dbSaveBlocks.setTransactionSuccessful();
            } finally {
                dbSaveBlocks.endTransaction();
            }
        }

    }

    public void txPublished(final String error) {
        super.txPublished(error);
        Log.d(LOG_TAG, "txPublished:::" + error);
    }

    public BRCoreTransaction[] loadTransactions() {
        isLoadTransactions = false;
        Log.d(LOG_TAG, "isLoadTransactions:::" + isLoadTransactions);
        BRCoreTransaction arr[] = new BRCoreTransaction[0];


        try {
            Cursor c = dbSaveBlocks.query("transactions", null, null, null, null, null, null);

            if (c.moveToFirst()) {

                int idColIndex = c.getColumnIndex("id");
                int idHexColIndex = c.getColumnIndex("TX_COLUMN_ID");
                int buffColIndex = c.getColumnIndex("TX_BUFF");
                int heightColIndex = c.getColumnIndex("TX_BLOCK_HEIGHT");
                int timetColIndex = c.getColumnIndex("TX_TIME_STAMP");

                arr = new BRCoreTransaction[c.getCount()];
                int i = 0;

                do {


                    BRTransactionEntity ent = new BRTransactionEntity(c.getBlob(buffColIndex), c.getInt(heightColIndex), c.getLong(timetColIndex), c.getString(idHexColIndex));

                    arr[i] = new BRCoreTransaction(ent.getBuff(), ent.getBlockheight(), ent.getTimestamp());

                    if (BuildConfig.DEBUG) {
                        Log.d(LOG_TAG,
                                "loadTransactions = " + ent.getBlockheight() +
                                        ", block = " + convert(ent.getBuff()) +
                                        ", getTimestamp = " + ent.getTimestamp() +
                                        ", height = " + ent.getBlockheight());
                    }
                    i += 1;
                } while (c.moveToNext());
            } else
                Log.d(LOG_TAG, "0 rows");

            c.close();
        } finally {
        }
        isLoadTransactions = true;

        return arr;
    }

    public BRCoreMerkleBlock[] loadBlocks() {
        BRCoreMerkleBlock[] arr = new BRCoreMerkleBlock[0];
        try {
            dbSaveBlocks.beginTransaction();

            Cursor c = dbSaveBlocks.query("mytable", null, null, null, null, null, null);

            if (c.moveToFirst()) {

                int idColIndex = c.getColumnIndex("id");
                int blockColIndex = c.getColumnIndex("hash");
                int heightColIndex = c.getColumnIndex("height");

                Log.d(LOG_TAG, "start allocate memory ");
                arr = new BRCoreMerkleBlock[c.getCount()];
                Log.d(LOG_TAG, "stop allocate memory ");

                int i = 0;

                do {

                    if(!this.isCloseDB) {
                        byte[] block = c.getBlob(blockColIndex);

                        BRMerkleBlockEntity merkleBlockEntity = new BRMerkleBlockEntity(block, c.getInt(idColIndex));
                        merkleBlockEntity.setId(c.getInt(idColIndex));

                        arr[i] = new BRCoreMerkleBlock(merkleBlockEntity.getBuff(), merkleBlockEntity.getBlockHeight());

                        i += 1;
                    } else {
                        c.close();
                        dbSaveBlocks.endTransaction();
                        return arr;
                    }
                } while (c.moveToNext());
            } else
                Log.d(LOG_TAG, "0 rows");

            c.close();
            dbSaveBlocks.setTransactionSuccessful();
            Log.d(LOG_TAG, "load length:: " + arr.length);

        } catch (SQLException error) {
            error.printStackTrace();
            if(!this.isCloseDB) {
                this.loadBlocks();
            } else {
                dbSaveBlocks.endTransaction();
                return arr;
            }

        } finally {
            dbSaveBlocks.endTransaction();
        }
        return arr;
    }

    public void saveBlocks(boolean replace, BRCoreMerkleBlock[] blocks) {
        if(!this.isCloseDB) {
            try {
                BlockEntity[] entities = new BlockEntity[blocks.length];
                dbSaveBlocks.beginTransaction();

                for (int i = 0; i < blocks.length; i++) {
                    entities[i] = new BlockEntity(blocks[i].serialize(), (int) blocks[i].getHeight());

                    ContentValues cv = new ContentValues();

                    cv.put("id", entities[i].getBlockHeight());
                    cv.put("hash", entities[i].getBlockBytes());
                    cv.put("height", entities[i].getBlockHeight());

                    String selection = "id = ?";
                    String[] selectionArgs = new String[]{"" + entities[i].getBlockHeight()};
                    Cursor cursor = dbSaveBlocks.query("mytable", null, selection, selectionArgs, null, null, null);

                    if (cursor.getCount() > 0) {
                        Log.d(LOG_TAG, "row exists, Height = " + entities[i].getBlockHeight());
                    } else {
                        long rowID = dbSaveBlocks.insert("mytable", null, cv);
                        Log.d(LOG_TAG, "row inserted, ID = " + rowID);
                    }
                    cursor.close();

                }
                dbSaveBlocks.setTransactionSuccessful();
            } finally {
                dbSaveBlocks.endTransaction();
            }
        }
    }

    @Override
    public void syncStarted() {
        this.isCloseDB = false;
        Log.d(LOG_TAG, "syncStarted ");

    }

    @Override
    public void syncStopped(String error) {
        Log.d(LOG_TAG, "syncStopped ");
    }

    @Override
    public boolean networkIsReachable() {
         System.out.println ("networkIsReachable----------------------------");
        return true;//!this.isCloseDB;
    }



    class DBHelper extends SQLiteOpenHelper {

        public DBHelper(Context context) {
            // конструктор суперкласса
            super(context, "lapotables1311.db", null, 1);
        }

        @Override
        public void onCreate(SQLiteDatabase db) {
            Log.d(LOG_TAG, "--- onCreate database ---");
            // создаем таблицу с полями
            db.execSQL("create table mytable ("
                    + "id integer primary key,"
                    + "hash blob,"
                    + "height integer" + ");");

            db.execSQL("create table transactions ("
                    + "id integer primary key AUTOINCREMENT,"
                    + "TX_COLUMN_ID text,"
                    + "TX_BUFF blob,"
                    + "TX_BLOCK_HEIGHT integer,"
                    + "TX_TIME_STAMP integer,"
                    + "mode text,"
                    + "amount integer" + ");");
        }


        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

        }


    }

    public void setTransaction(long amount, String address) {
        this.amount = amount;
    }

    public String convertInt(byte buf[]) {
        int intArr[] = new int[buf.length / 4];
        int offset = 0;
        for (int i = 0; i < intArr.length; i++) {
            intArr[i] = (buf[3 + offset] & 0xFF) | ((buf[2 + offset] & 0xFF) << 8) |
                    ((buf[1 + offset] & 0xFF) << 16) | ((buf[0 + offset] & 0xFF) << 24);
            offset += 4;
        }
        return Arrays.toString(intArr);
    }

    private final static char[] hexArray = "0123456789ABCDEF".toCharArray();

    public static String convert(byte[] bytes) {
        char[] hexChars = new char[bytes.length * 2];
        for (int j = 0; j < bytes.length; j++) {
            int v = bytes[j] & 0xFF;
            hexChars[j * 2] = hexArray[v >>> 4];
            hexChars[j * 2 + 1] = hexArray[v & 0x0F];
        }
        return new String(hexChars);
    }

}
