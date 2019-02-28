package com.streem.selectcontact;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.AsyncTask;
import android.provider.ContactsContract.CommonDataKinds.Email;
import android.provider.ContactsContract.CommonDataKinds.Phone;
import android.provider.ContactsContract.CommonDataKinds.StructuredName;
import android.provider.ContactsContract.CommonDataKinds.StructuredPostal;
import android.provider.ContactsContract.Contacts;
import android.provider.ContactsContract.Contacts.Entity;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import android.provider.ContactsContract;
import android.app.Activity;
import android.support.v4.app.ActivityCompat;
import android.Manifest;
import android.content.pm.PackageManager;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import android.provider.ContactsContract.CommonDataKinds;
import android.provider.ContactsContract.CommonDataKinds.Organization;
import android.provider.ContactsContract.CommonDataKinds.StructuredName;
import android.provider.ContactsContract.CommonDataKinds.Note;
import android.provider.ContactsContract.CommonDataKinds.Website;
import android.content.ContentValues;
import java.util.ArrayList;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;

public class SelectContactModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final String TAG = "SelectContactModule";
    private static final int CONTACT_REQUEST = 11112;
    public static final String E_CONTACT_CANCELLED = "E_CONTACT_CANCELLED";
    public static final String E_CONTACT_NO_DATA = "E_CONTACT_NO_DATA";
    public static final String E_CONTACT_EXCEPTION = "E_CONTACT_EXCEPTION";
    public static final String E_CONTACT_PERMISSION = "E_CONTACT_PERMISSION";

    private static final String PERMISSION_DENIED = "denied";
    private static final String PERMISSION_AUTHORIZED = "authorized";
    private static final String PERMISSION_READ_CONTACTS = Manifest.permission.READ_CONTACTS;
    private static final int PERMISSION_REQUEST_CODE = 888;

    private static final int REQUEST_OPEN_CONTACT_FORM = 52941;
    private static final int REQUEST_OPEN_EXISTING_CONTACT = 52942;

    private static Callback updateContactCallback;
    private static Callback requestCallback;


    private Promise mContactsPromise;
    private final ContentResolver contentResolver;
    private String address;
    private String idContact;

    public SelectContactModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.contentResolver = getReactApplicationContext().getContentResolver();
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "SelectContact";
    }

    /*
     * Check permission
     */
    @ReactMethod
    public void checkPermission(Callback callback) {
        callback.invoke(null, isPermissionGranted());
    }

    /*
     * Request permission
     */
    @ReactMethod
    public void requestPermission(Callback callback) {
        requestReadContactsPermission(callback);
    }

    private void requestReadContactsPermission(Callback callback) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            callback.invoke(null, PERMISSION_DENIED);
            return;
        }

        if (isPermissionGranted().equals(PERMISSION_AUTHORIZED)) {
            callback.invoke(null, PERMISSION_AUTHORIZED);
            return;
        }

        requestCallback = callback;
        ActivityCompat.requestPermissions(currentActivity, new String[]{PERMISSION_READ_CONTACTS}, PERMISSION_REQUEST_CODE);
    }
    /*
     * Check if READ_CONTACTS permission is granted
     */
    private String isPermissionGranted() {
        // return -1 for denied and 1
        int res = getReactApplicationContext().checkCallingOrSelfPermission(PERMISSION_READ_CONTACTS);
        return (res == PackageManager.PERMISSION_GRANTED) ? PERMISSION_AUTHORIZED : PERMISSION_DENIED;
    }


    /*
     * Start open contact form
     */
    @ReactMethod
    public void openContactForm(ReadableMap contact, Callback callback) {

        Intent intent = new Intent(Intent.ACTION_INSERT, ContactsContract.Contacts.CONTENT_URI);
        intent.putExtra("finishActivityOnSaveCompleted", true);
        intent.putExtra(ContactsContract.Intents.Insert.EMAIL, contact.getString("address"));
        intent.putExtra(ContactsContract.Intents.Insert.EMAIL_TYPE, "LAX");

        updateContactCallback = callback;
        getReactApplicationContext().startActivityForResult(intent, REQUEST_OPEN_CONTACT_FORM, Bundle.EMPTY);
    }


    /*
     * TODO support all phone types
     * http://developer.android.com/reference/android/provider/ContactsContract.CommonDataKinds.Phone.html
     */
    private int mapStringToPhoneType(String label) {
        int phoneType;
        switch (label) {
            case "home":
                phoneType = CommonDataKinds.Phone.TYPE_HOME;
                break;
            case "work":
                phoneType = CommonDataKinds.Phone.TYPE_WORK;
                break;
            case "mobile":
                phoneType = CommonDataKinds.Phone.TYPE_MOBILE;
                break;
            case "main":
                phoneType = CommonDataKinds.Phone.TYPE_MAIN;
                break;
            case "work fax":
                phoneType = CommonDataKinds.Phone.TYPE_FAX_WORK;
                break;
            case "home fax":
                phoneType = CommonDataKinds.Phone.TYPE_FAX_HOME;
                break;
            case "pager":
                phoneType = CommonDataKinds.Phone.TYPE_PAGER;
                break;
            case "work_pager":
                phoneType = CommonDataKinds.Phone.TYPE_WORK_PAGER;
                break;
            case "work_mobile":
                phoneType = CommonDataKinds.Phone.TYPE_WORK_MOBILE;
                break;
            default:
                phoneType = CommonDataKinds.Phone.TYPE_CUSTOM;
                break;
        }
        return phoneType;
    }

    /*
     * TODO support TYPE_CUSTOM
     * http://developer.android.com/reference/android/provider/ContactsContract.CommonDataKinds.Email.html
     */
    private int mapStringToEmailType(String label) {
        int emailType;
        switch (label) {
            case "home":
                emailType = CommonDataKinds.Email.TYPE_HOME;
                break;
            case "work":
                emailType = CommonDataKinds.Email.TYPE_WORK;
                break;
            case "mobile":
                emailType = CommonDataKinds.Email.TYPE_MOBILE;
                break;
            default:
                emailType = CommonDataKinds.Email.TYPE_CUSTOM;
                break;
        }
        return emailType;
    }

    private int mapStringToPostalAddressType(String label) {
        int postalAddressType;
        switch (label) {
            case "home":
                postalAddressType = CommonDataKinds.StructuredPostal.TYPE_HOME;
                break;
            case "work":
                postalAddressType = CommonDataKinds.StructuredPostal.TYPE_WORK;
                break;
            default:
                postalAddressType = CommonDataKinds.StructuredPostal.TYPE_CUSTOM;
                break;
        }
        return postalAddressType;
    }

    @ReactMethod
    public void getAll(final Callback callback) {
        getAllContacts(callback);
    }


    private void getAllContacts(final Callback callback) {
        AsyncTask.execute(new Runnable() {
            @Override
            public void run() {
                Context context = getReactApplicationContext();
                ContentResolver cr = context.getContentResolver();

                ContactsProvider contactsProvider = new ContactsProvider(cr);
                WritableArray contacts = contactsProvider.getContacts();

                callback.invoke(null, contacts);
            }
        });
    }

    @ReactMethod
    public void openContactSelection(String address, String idContact, Promise contactsPromise) {
        if(idContact.length() != 0) {
            launchPickerOneContact(contactsPromise, CONTACT_REQUEST, idContact);
        } else {
            launchPicker(contactsPromise, CONTACT_REQUEST, address);
        }
    }

    /**
     * Lanch the contact picker, with the specified requestCode for returned data.
     *
     * @param contactsPromise - promise passed in from React Native.
     * @param requestCode     - request code to specify what contact data to return
     */
    private void launchPicker(Promise contactsPromise, int requestCode, String address) {
        System.out.println("            launchPicker");

        this.address = address;
        Cursor cursor = this.contentResolver.query(Contacts.CONTENT_URI, null, null, null, null);
        if (cursor != null) {
            mContactsPromise = contactsPromise;

            Intent intent = new Intent(Intent.ACTION_INSERT_OR_EDIT);
            intent.setType(ContactsContract.Contacts.CONTENT_ITEM_TYPE);
            intent.putExtra(ContactsContract.Intents.Insert.EMAIL, address);
            intent.putExtra(ContactsContract.Intents.Insert.EMAIL_TYPE, "LAX");

            Activity activity = getCurrentActivity();
            if (intent.resolveActivity(activity.getPackageManager()) != null) {
                activity.startActivityForResult(intent, requestCode);
            }
            cursor.close();
        } else {
            mContactsPromise.reject(E_CONTACT_PERMISSION, "no permission");
        }
    }

    private void launchPickerOneContact(Promise contactsPromise, int requestCode, String idContact) {
        System.out.println("            launchPickerOneContact");

        this.idContact = idContact;
        Cursor cursor = this.contentResolver.query(Contacts.CONTENT_URI, null, null, null, null);
        if (cursor != null) {
            mContactsPromise = contactsPromise;

            Intent intent = new Intent(Intent.ACTION_VIEW);
            Uri uri = Uri.withAppendedPath(ContactsContract.Contacts.CONTENT_LOOKUP_URI, idContact);
            intent.setData(uri);
//            intent.setType(ContactsContract.Contacts.CONTENT_ITEM_TYPE);
//            intent.putExtra(ContactsContract.Intents.Insert.EMAIL, address);
//            intent.putExtra(ContactsContract.Intents.Insert.EMAIL_TYPE, "LAX");

            Activity activity = getCurrentActivity();
            if (intent.resolveActivity(activity.getPackageManager()) != null) {
                activity.startActivityForResult(intent, requestCode);
            }
            cursor.close();
        } else {
            mContactsPromise.reject(E_CONTACT_PERMISSION, "no permission");
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
        if (mContactsPromise == null || requestCode != CONTACT_REQUEST) {
            return;
        }

        //Request was cancelled
        if (resultCode != Activity.RESULT_OK) {
            mContactsPromise.reject(E_CONTACT_CANCELLED, "Cancelled");
            return;
        }

        // Retrieve all possible data about contact and return as a JS object
        WritableMap contactData = Arguments.createMap();

        try {
            String id = getContactId(intent.getData());
            Uri contactUri = buildContactUri(id);
            boolean foundData = false;

            WritableArray phones = Arguments.createArray();
            WritableArray emails = Arguments.createArray();
            WritableArray postalAddresses = Arguments.createArray();

            Cursor cursor = openContactQuery(contactUri);
            if (cursor.moveToFirst()) {
                do {
                    String mime = cursor.getString(cursor.getColumnIndex(Entity.MIMETYPE));
                    switch (mime) {
                        case StructuredName.CONTENT_ITEM_TYPE:
                            addNameData(contactData, cursor);
                            foundData = true;
                            break;

                        case StructuredPostal.CONTENT_ITEM_TYPE:
                            addPostalData(postalAddresses, cursor, activity);
                            foundData = true;
                            break;

                        case Phone.CONTENT_ITEM_TYPE:
                            addPhoneEntry(phones, cursor, activity);
                            foundData = true;
                            break;

                        case Email.CONTENT_ITEM_TYPE:
                            addEmailEntry(emails, cursor, activity);
                            foundData = true;
                            break;
                    }
                } while (cursor.moveToNext());
            }
            cursor.close();

            contactData.putArray("phones", phones);
            contactData.putArray("emailAddresses", emails);
            contactData.putArray("postalAddresses", postalAddresses);

            if (foundData) {
                mContactsPromise.resolve(contactData);
            } else {
                mContactsPromise.reject(E_CONTACT_NO_DATA, "No data found for contact");
            }
        } catch (SelectContactException e) {
            mContactsPromise.reject(E_CONTACT_EXCEPTION, e.getMessage());
        } catch (Exception e) {
            Log.e(TAG, "Unexpected exception reading from contacts", e);
            mContactsPromise.reject(E_CONTACT_EXCEPTION, e.getMessage());
        }
    }

    private String getContactId(Uri contactUri) throws SelectContactException {
        Cursor cursor = this.contentResolver.query(contactUri, null, null, null, null);
        if (cursor == null || !cursor.moveToFirst()) {
            throw new SelectContactException(E_CONTACT_NO_DATA, "Contact Data Not Found");
        }

        return cursor.getString(cursor.getColumnIndex(Contacts._ID));
    }

    private Uri buildContactUri(String id) {
        return Uri
                .withAppendedPath(Contacts.CONTENT_URI, id)
                .buildUpon()
                .appendPath(Entity.CONTENT_DIRECTORY)
                .build();
    }

    private Cursor openContactQuery(Uri contactUri) throws SelectContactException {
        String[] projection = {
                Entity._ID,
                Entity.MIMETYPE,
//                Entity.DATA1,
//                Entity.DATA2,
//                Entity.DATA3,
//                Entity.DATA4,
//                Entity.DATA5,
//                Entity.DATA6,
//                Entity.DATA7,
                Entity.CONTACT_ID,
                Entity.RAW_CONTACT_ID,
                Entity.DATA_ID,
        };
        String sortOrder = Entity.RAW_CONTACT_ID + " ASC";
        Cursor cursor = this.contentResolver.query(contactUri, projection, null, null, sortOrder);
        if (cursor == null) {
            throw new SelectContactException(E_CONTACT_EXCEPTION, "Could not query contacts data. Unable to create cursor.");
        }

        return cursor;
    }

    private void addNameData(WritableMap contactData, Cursor cursor) {
        int displayNameIndex = cursor.getColumnIndex(StructuredName.DISPLAY_NAME);
        contactData.putString("name", cursor.getString(displayNameIndex));

        int contactId = cursor.getColumnIndex(StructuredName.CONTACT_ID);

        if (contactId != -1) {
            String contactIdString = cursor.getString(contactId);
            contactData.putString("recordID", contactIdString);
        }

        int rawContactId = cursor.getColumnIndex(StructuredName.RAW_CONTACT_ID);

        if (rawContactId != -1) {
            String rawContactString = cursor.getString(rawContactId);
            contactData.putString("rawContactId", rawContactString);
        }

        int givenNameColumn = cursor.getColumnIndex(StructuredName.GIVEN_NAME);
        if (givenNameColumn != -1) {
            String givenName = cursor.getString(givenNameColumn);
            contactData.putString("givenName", givenName);
        }

        int familyNameColumn = cursor.getColumnIndex(StructuredName.FAMILY_NAME);
        if (familyNameColumn != -1) {
            String familyName = cursor.getString(cursor.getColumnIndex(StructuredName.FAMILY_NAME));
            contactData.putString("familyName", familyName);
        }

        int middleNameColumn = cursor.getColumnIndex(StructuredName.MIDDLE_NAME);
        if (middleNameColumn != -1) {
            String middleName = cursor.getString(middleNameColumn);
            contactData.putString("middleName", middleName);
        }
    }

    private void addPostalData(WritableArray postalAddresses, Cursor cursor, Activity activity) {
        // we need to see if the postal address columns exist, if so, add them
        int formattedAddressColumn = cursor.getColumnIndex(StructuredPostal.FORMATTED_ADDRESS);
        int streetColumn = cursor.getColumnIndex(StructuredPostal.STREET);
        int cityColumn = cursor.getColumnIndex(StructuredPostal.CITY);
        int stateColumn = cursor.getColumnIndex(StructuredPostal.REGION);
        int postalCodeColumn = cursor.getColumnIndex(StructuredPostal.POSTCODE);
        int isoCountryCodeColumn = cursor.getColumnIndex(StructuredPostal.COUNTRY);

        WritableMap addressEntry = Arguments.createMap();
        if (formattedAddressColumn != -1) {
            addressEntry.putString("formattedAddress", cursor.getString(formattedAddressColumn));
        }
        if (streetColumn != -1) {
            addressEntry.putString("street", cursor.getString(streetColumn));
        }
        if (cityColumn != -1) {
            addressEntry.putString("city", cursor.getString(cityColumn));
        }
        if (stateColumn != -1) {
            addressEntry.putString("state", cursor.getString(stateColumn));
        }
        if (postalCodeColumn != -1) {
            addressEntry.putString("postalCode", cursor.getString(postalCodeColumn));
        }
        if (isoCountryCodeColumn != -1) {
            addressEntry.putString("isoCountryCode", cursor.getString(isoCountryCodeColumn));
        }

        // add the address type here
        int addressTypeColumn = cursor.getColumnIndex(StructuredPostal.TYPE);
        int addressLabelColumn = cursor.getColumnIndex(StructuredPostal.LABEL);
        if (addressTypeColumn != -1 && addressLabelColumn != -1) {
            String addressLabel = cursor.getString(addressLabelColumn);
            int addressType = cursor.getInt(addressTypeColumn);
            CharSequence typeLabel = StructuredPostal.getTypeLabel(activity.getResources(), addressType, addressLabel);
            addressEntry.putString("type", String.valueOf(typeLabel));
        }

        postalAddresses.pushMap(addressEntry);
    }

    private void addPhoneEntry(WritableArray phones, Cursor cursor, Activity activity) {
        String phoneNumber = cursor.getString(cursor.getColumnIndex(Phone.NUMBER));
        int phoneType = cursor.getInt(cursor.getColumnIndex(Phone.TYPE));
        String phoneLabel = cursor.getString(cursor.getColumnIndex(Phone.LABEL));
        CharSequence typeLabel = Phone.getTypeLabel(activity.getResources(), phoneType, phoneLabel);

        WritableMap phoneEntry = Arguments.createMap();
        phoneEntry.putString("number", phoneNumber);
        phoneEntry.putString("type", String.valueOf(typeLabel));

        phones.pushMap(phoneEntry);
    }

    private void addEmailEntry(WritableArray emails, Cursor cursor, Activity activity) {
        String emailAddress = cursor.getString(cursor.getColumnIndex(Email.ADDRESS));
        int emailType = cursor.getInt(cursor.getColumnIndex(Email.TYPE));
        String emailLabel = cursor.getString(cursor.getColumnIndex(Email.LABEL));
        CharSequence typeLabel = Email.getTypeLabel(activity.getResources(), emailType, emailLabel);

        WritableMap emailEntry = Arguments.createMap();
        emailEntry.putString("email", emailAddress);
        emailEntry.putString("label", String.valueOf(typeLabel));

        emails.pushMap(emailEntry);
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    public static class SelectContactException extends Exception {
        private final String errorCode;

        public SelectContactException(String errorCode, String errorMessage) {
            super(errorMessage);
            this.errorCode = errorCode;
        }

        public String getErrorCode() {
            return errorCode;
        }
    }
}
