// @flow
import type { Saga } from 'redux-saga';
import {
  Alert,
} from 'react-native';
import {
  takeLatest, put, call, select,
} from 'redux-saga/effects';
import { selectContact, checkPermission, requestPermission } from 'react-native-select-contact';
import * as actionsCommons from '../../../commons/actions';
import { getContactsSaga } from '../../ChooseContact/sagas/getContacts';
import { getContactFromAddress } from '../../TransactionDetails/actions';
import * as actions from '../actions';

export const isReady = (state: Object) => state.dashboard.isReady;

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
export function* chooseExistsContactSaga(): Saga<void> {
  yield put(actionsCommons.setShowSpinner(true));

  try {
    const address = yield select(state => state.modals.isModalSwitchContacts);
    const txDetails = yield select(state => state.modals.lastTxDetails);

    yield put(actionsCommons.setModalTxDetails(''));
    yield put(actionsCommons.setModalSwitchContacts(''));
    yield put(actionsCommons.setModalTxDetails(txDetails));

    let permission = yield promiseCheckPermission;

    if (permission === 'undefined') {
      permission = yield promiseRequestPermission;
    }

    if (permission === 'authorized') {
      const contact = yield selectContact(address, '');

      yield put(actionsCommons.goToOtherWindow(false));
      yield call(getContactsSaga);
      yield put(getContactFromAddress(address));

      if (!contact) {
        yield put(actionsCommons.setModalTxDetails(txDetails));
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
  yield takeLatest(actions.chooseExistsContact, chooseExistsContactSaga);
}
