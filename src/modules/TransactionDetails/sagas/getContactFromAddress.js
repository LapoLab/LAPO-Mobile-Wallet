// @flow
import type { Saga } from 'redux-saga';
import { Platform } from 'react-native';
import { takeLatest, put, select } from 'redux-saga/effects';

import * as actions from '../actions';
import * as actionsAlert from '../../Alert/actions';

export function* getContactFromAddressSaga(): Saga<void> {
  yield put(actions.setLoadingContact(true));
  yield put(actions.setContactFromAddress(''));

  try {
    // eslint-disable-next-line
    const transaction = yield select(state => state.wallet.transactions.find(item => item.id === state.modals.txDetails));
    const { address } = transaction || {
      address: '',
    };

    const contacts = yield select(state => state.chooseContact.data);

    const contact = contacts.find(
      item => item.emailAddresses.filter(e => e.email === address).length > 0,
    );

    if (contact) {
      yield put(
        actions.setContactFromAddress(
          `${contact.givenName} ${contact.familyName || ''}`,
          Platform.OS === 'ios' ? contact.recordID : contact.lookupKey,
        ),
      );
    } else {
      yield put(actions.setContactFromAddress('', ''));
    }
    yield put(actions.setLoadingContact(false));
  } catch (e) {
    yield put(
      actionsAlert.showAlert('Error', String(e), [{ text: 'OK' }], {
        cancelable: false,
      }),
    );
    yield put(actions.setLoadingContact(false));
    yield put(actions.getContactFromAddress());
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(actions.getContactFromAddress, getContactFromAddressSaga);
}
