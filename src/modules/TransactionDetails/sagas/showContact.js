// @flow
import type { Saga } from 'redux-saga';
import { PermissionsAndroid, Platform } from 'react-native';
import {
  takeLatest, put, select, call, delay,
} from 'redux-saga/effects';
import {
  selectContact,
  openExistingContact,
  checkPermission,
  requestPermission,
} from 'react-native-select-contact';
import { setShowSpinner, goToOtherWindow, setModalTxDetails } from '../../../commons/actions';
import * as actions from '../actions';

export const isReady = (state: Object) => state.dashboard.isReady;

type Action = {
  type: string,
  payload: {
    address: String,
  },
};
export function* showContactSaga({ payload: { address } }: Action): Saga<void> {
  yield put(setShowSpinner(true));

  try {
    yield put(goToOtherWindow(true));
    const idContact = yield select(state => state.transactionsDetails.idContact);

    if (Platform.OS === 'ios') {
      yield put(setModalTxDetails(''));
      yield delay(20);

      checkPermission((err, permission) => {
        if (err) throw err;

        if (permission === 'undefined') {
          // eslint-disable-next-line
          requestPermission((err, permission) => {});
        }
        if (permission === 'authorized') {
          openExistingContact({ recordID: idContact }, () => {
          });
        }
      });
      yield put(setShowSpinner(false));
    } else {
      const granted = yield call(
        PermissionsAndroid.request,
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        {
          title: 'Get Permission',
          message: 'Lapo needs access to your Documents so you can store paper words.',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        yield selectContact(address, idContact);
      }
    }
    yield put(setShowSpinner(false));
  } catch (e) {
    yield put(setShowSpinner(false));
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(actions.showContact, showContactSaga);
}
