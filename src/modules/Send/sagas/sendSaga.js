// @flow
import type { Saga } from 'redux-saga';
import { NativeModules, Platform } from 'react-native';
import {
  takeLatest, put, call, select,
} from 'redux-saga/effects';
import LapoCoreAndroid from 'lapo-core';
import {
  send,
  sendError,
  sendSuccess,
  setSendAddress,
  setSendAmount,
  setSendNote,
} from '../actions';
import { setModalSend, addNoteTx, setShowSpinner } from '../../../commons/actions';
import * as actionsAlert from '../../Alert/actions';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

export const isReady = (state: Object) => state.dashboard.isReady;

type Action = {
  type: string,
  payload: {
    address: string,
    amount: number,
    note: string,
  },
};
export function* sendSaga({ payload: { address, amount, note } }: Action): Saga<void> {
  yield put(setShowSpinner(true));

  const isLoaded = yield select(isReady);
  if (!isLoaded) {
    yield put(
      actionsAlert.showAlert('Sorry', 'Sending is not possible while loading blocks', [
        { text: 'OK' },
      ]),
    );
    yield put(setShowSpinner(false));
    return;
  }

  const verifyAmount = parseFloat(amount);
  if (!verifyAmount || verifyAmount === 0 || verifyAmount < 0) {
    yield put(actionsAlert.showAlert('Error', 'Amount must be greater than 0', [{ text: 'OK' }]));
    yield put(setShowSpinner(false));
    return;
  }

  if (verifyAmount < 0.001) {
    yield put(
      actionsAlert.showAlert('Error', 'Amount must be greater than 0.001', [{ text: 'OK' }]),
    );
    yield put(setShowSpinner(false));
    return;
  }

  try {
    const hash = yield call(LapoCore.newTransaction, address, amount, note);
    yield put(sendSuccess());
    yield put(addNoteTx({ hash, note }));
    yield put(setModalSend(false));

    yield put(setSendAddress(''));
    yield put(setSendAmount(''));
    yield put(setSendNote(''));
    yield put(setShowSpinner(false));
  } catch (e) {
    yield put(
      actionsAlert.showAlert(
        'Error',
        String(e)
          .replace('error:', '')
          .replace('Error:', '')
          .trim(),
        [{ text: 'OK' }],
        {
          cancelable: false,
        },
      ),
    );
    yield put(sendError());
    yield put(setShowSpinner(false));
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(send, sendSaga);
}
