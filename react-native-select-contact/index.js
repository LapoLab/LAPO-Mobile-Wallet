import {
  Alert, ActionSheetIOS, NativeModules, Platform,
} from 'react-native';

const { SelectContact, ActionSheetAndroid } = NativeModules;
const ActionSheet = Platform.select({
  ios: ActionSheetIOS,
  android: ActionSheetAndroid,
});

let currentlyOpen = false;

const SelectContactApi = {
  getAll(callback) { return SelectContact.getAll(callback)},
  checkPermission(callback) { return SelectContact.checkPermission(callback)},
  requestPermission(callback) { return SelectContact.requestPermission(callback)},
  openExistingContact(contactData, callback) { return SelectContact.openExistingContact(contactData, callback)},
  openContactForm(contactData, callback) { return SelectContact.openContactForm(contactData, callback)},
  openUnknownContact(contactData, callback) { return SelectContact.openUnknownContact(contactData, callback)},
  selectContact(address, idContact) {
    if (currentlyOpen) {
      return Promise.reject(new Error('Cannot open the contact selector twice'));
    }

    currentlyOpen = true;

    return SelectContact.openContactSelection(address, idContact)
      .then((contact) => {
        currentlyOpen = false;
        return contact;
      })
      .catch((err) => {
        currentlyOpen = false;

        // Resolve to null when cancelled
        if (err.code === 'E_CONTACT_CANCELLED') {
          return null;
        }

        throw err;
      });
  },

  selectContactPostalAddress() {
    return SelectContactApi.selectContact().then((contact) => {
      if (!contact) {
        return null;
      }

      const addresses = (contact && contact.postalAddresses) || [];
      if (addresses.length === 0) {
        Alert.alert(
          'No Postal Addresses',
          `We could not find any postal addresses for ${contact.name}`,
        );
        return null;
      }

      return selectPostalAddress(addresses).then(selectedAddress => (selectedAddress ? { contact, selectedAddress } : null));
    });
  },

  selectContactPhone() {
    return SelectContactApi.selectContact().then((contact) => {
      if (!contact) {
        return null;
      }

      const phones = (contact && contact.phones) || [];
      if (phones.length === 0) {
        Alert.alert('No Phone Numbers', `We could not find any phone numbers for ${contact.name}`);
        return null;
      }

      return selectPhone(phones).then(selectedPhone => (selectedPhone ? { contact, selectedPhone } : null));
    });
  },

  selectContactEmail() {
    return SelectContactApi.selectContact().then((contact) => {
      if (!contact) {
        return null;
      }

      const emails = (contact && contact.emails) || [];
      if (emails.length === 0) {
        Alert.alert(
          'No Email Addresses',
          `We could not find any email addresses for ${contact.name}`,
        );
        return null;
      }

      return selectEmail(emails).then(selectedEmail => (selectedEmail ? { contact, selectedEmail } : null));
    });
  },
};

module.exports = SelectContactApi;

function selectPhone(phones) {
  if (phones.length < 2 || !ActionSheet) {
    return Promise.resolve(phones[0]);
  }

  const options = phones.map((phone) => {
    const { number, type } = phone;
    return number + (type ? ` - ${type}` : '');
  });

  if (Platform.OS === 'ios') {
    options.push('Cancel');
  }

  return new Promise((resolve) => {
    ActionSheet.showActionSheetWithOptions(
      {
        title: 'Select Phone',
        options,
        cancelButtonIndex: options.length - 1,
        tintColor: 'blue',
      },
      (buttonIndex) => {
        resolve(phones[buttonIndex]);
      },
    );
  });
}

function selectPostalAddress(addresses) {
  if (addresses.length < 2 || !ActionSheet) {
    return Promise.resolve(addresses[0]);
  }

  const options = addresses.map((address) => {
    const {
      formattedAddress, street, city, state, postalCode, isoCountryCode,
    } = address;

    if (formattedAddress) {
      return formattedAddress;
    }

    return `${street} ${city}, ${state} ${postalCode} ${isoCountryCode}`;
  });

  if (Platform.OS === 'ios') {
    options.push('Cancel');
  }

  return new Promise((resolve) => {
    ActionSheet.showActionSheetWithOptions(
      {
        title: 'Select Postal Address',
        options,
        cancelButtonIndex: options.length - 1,
        tintColor: 'blue',
      },
      (buttonIndex) => {
        resolve(addresses[buttonIndex]);
      },
    );
  });
}

function selectEmail(emails) {
  if (emails.length < 2 || !ActionSheet) {
    return Promise.resolve(emails[0]);
  }

  const options = emails.map((email) => {
    const { address, type } = email;
    return address + (type ? ` - ${type}` : '');
  });

  if (Platform.OS === 'ios') {
    options.push('Cancel');
  }

  return new Promise((resolve) => {
    ActionSheet.showActionSheetWithOptions(
      {
        title: 'Select Email',
        options,
        cancelButtonIndex: options.length - 1,
        tintColor: 'blue',
      },
      (buttonIndex) => {
        resolve(emails[buttonIndex]);
      },
    );
  });
}
