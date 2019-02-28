// @flow
import type { Saga } from 'redux-saga';
import { Alert, Platform } from 'react-native';
import {
  takeLatest, put, select, delay,
} from 'redux-saga/effects';
import {
  openUnknownContact,
  checkPermission,
  requestPermission,
  openContactForm,
} from 'react-native-select-contact';
import * as actionsCommons from '../../../commons/actions';
import * as actions from '../actions';

const promiseCheckPermission = new Promise((resolve, reject) => {
  checkPermission((errGetAll, permission) => {
    if (errGetAll) {
      reject(errGetAll);
    }
    resolve(permission);
  });
});

const promiseRequestPermission = new Promise((resolve, reject) => {
  requestPermission((errGetAll, permission) => {
    if (errGetAll) {
      reject(errGetAll);
    }
    resolve(permission);
  });
});

// $FlowFixMe
export function* createNewContactSaga(): Saga<void> {
  yield put(actionsCommons.setShowSpinner(true));

  try {
    const address = yield select(state => state.modals.isModalSwitchContacts);
    const txDetails = yield select(state => state.modals.lastTxDetails);

    yield put(actionsCommons.setModalTxDetails(''));
    yield put(actionsCommons.setModalSwitchContacts('', txDetails));
    yield delay(20);

    let permission = yield promiseCheckPermission;

    if (permission === 'undefined') {
      permission = yield promiseRequestPermission;
    }

    const promiseOpenUnknownContact = new Promise((resolve, reject) => {
      openUnknownContact({ address }, (errGetAll) => {
        if (errGetAll) {
          reject(errGetAll);
        }
        resolve(permission);
      });
    });

    if (permission === 'authorized') {
      if (Platform.OS === 'ios') {
        yield put(actionsCommons.setShowSpinner(false));
        yield promiseOpenUnknownContact;
      } else {
        const newPerson = {
          address,
        };

        const promiseOpenContactForm = new Promise((resolve, reject) => {
          openContactForm(newPerson, (errGetAll) => {
            if (errGetAll) {
              reject(errGetAll);
            }
            resolve(permission);
          });
        });

        yield promiseOpenContactForm;
      }
    }

    yield put(actionsCommons.setShowSpinner(false));
  } catch (e) {
    Alert.alert('Error', String(e), [{ text: 'OK' }], {
      cancelable: false,
    });
    yield put(actionsCommons.setShowSpinner(false));
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(actions.addNewContact, createNewContactSaga);
}
