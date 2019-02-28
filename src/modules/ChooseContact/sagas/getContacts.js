// @flow
import { PermissionsAndroid, Platform } from 'react-native';
import type { Saga } from 'redux-saga';
import { takeEvery, put, call } from 'redux-saga/effects';
import { getAll } from 'react-native-select-contact';
import * as actions from '../actions';
import * as actionsCommons from '../../../commons/actions';

// $FlowFixMe
export function* getContactsSaga(): Saga<void> {
  try {
    yield put(actionsCommons.goToOtherWindow(true));

    if (Platform.OS !== 'ios') {
      const granted = yield call(
        PermissionsAndroid.request,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Get Permission',
          message: 'Lapo needs access to your Documents so you can store paper words.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const promise = new Promise((resolve, reject) => {
          getAll((errGetAll, contacts) => {
            if (errGetAll) {
              reject(errGetAll);
            }
            resolve({ errGetAll, contacts });
          });
        });
        const { contacts } = yield promise;
        yield put(actionsCommons.goToOtherWindow(false));

        const mapFilterDublicate = {};
        const contactsLapo = contacts.filter(
          item => item.emailAddresses.filter(tx => tx.label === 'lax').length > 0,
        );
        contactsLapo.forEach((contact) => {
          mapFilterDublicate[`${contact.givenName}-${contact.familyName}-${contact.emailAddresses.length}`] = {
            recordID: contact.recordID,
            givenName: contact.givenName,
            familyName: contact.familyName,
            lookupKey: contact.lookupKey,
            note: contact.note,
            emailAddresses: contact.emailAddresses.filter(tx => tx.label === 'lax'),
          };
        });
        const resContacts = Object.keys(mapFilterDublicate).map(item => mapFilterDublicate[item]);
        yield put(actions.setContacts(resContacts.sort(item => item.givenName)));
      }
    } else {
      const promise = new Promise((resolve, reject) => {
        getAll((errGetAll, contacts) => {
          if (errGetAll) {
            reject(errGetAll);
          }
          resolve({ errGetAll, contacts });
        });
      });
      const { contacts } = yield promise;

      const mapFilterDublicate = {};
      const contactsLapo = contacts.filter(
        item => item.emailAddresses.filter(tx => tx.label === 'lax').length > 0,
      );
      contactsLapo.forEach((contact) => {
        mapFilterDublicate[`${contact.givenName}-${contact.familyName}-${contact.emailAddresses.length}`] = {
          recordID: contact.recordID,
          givenName: contact.givenName,
          familyName: contact.familyName,
          lookupKey: contact.lookupKey,
          note: contact.note,
          emailAddresses: contact.emailAddresses.filter(tx => tx.label === 'lax'),
        };
      });
      const resContacts = Object.keys(mapFilterDublicate).map(item => mapFilterDublicate[item]);
      yield put(actions.setContacts(resContacts.sort(item => item.givenName)));
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
}

export default function* listener(): Saga<void> {
  yield takeEvery(actions.getContacts, getContactsSaga);
}
