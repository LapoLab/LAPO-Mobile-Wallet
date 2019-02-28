// @flow
import type { Saga } from 'redux-saga';
import {
  Platform,
  NativeModules,
} from 'react-native';
import LapoCoreAndroid from 'lapo-core';
import {
  takeLatest, put, call, select, delay,
} from 'redux-saga/effects';

import * as actions from '../../../commons/actions';
import isVerify from '../../../utils/verifyWords12';
import { recoveryWallet } from '../actions';
import * as actionNotify from '../../Notify/actions';
import * as actionAlert from '../../Alert/actions';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

export const selectorPinsRecovery = (state: Object) => state.pinsRecovery.pinsRecovery;

type Action = {
  type: string,
  payload: Object,
};
export function* recoveryWalletSaga({ payload: words }: Action): Saga<void> {
  try {
    yield put(actions.setShowSpinner(false));
    yield put(actions.setShowSpinner(true));

    const resVerify = yield call(isVerify, words);

    if (!resVerify) {
      yield put(actions.setShowSpinner(false));
      yield put(actionAlert.showAlert(
        'Error',
        'Not valid words',
        // eslint-disable-next-line
        [{ text: 'OK' }],
        {
          cancelable: false,
        },
      ));
    } else {
      const isLoadWallet = yield call(LapoCore.isLoadWallet);
      if (isLoadWallet) {
        let isReady = yield call(LapoCore.isReady);
        while (!isReady) {
          yield delay(1000);
          isReady = yield call(LapoCore.isReady);
        }
      }

      const arrayWords = ['', '', '', '', '', '', '', '', '', '', '', ''];
      Object.keys(words).forEach((element) => {
        arrayWords[Number(element)] = words[element].toLowerCase().replace(/ /g, '');
      });

      yield put(actions.setPaperWords(arrayWords));

      yield put(actions.setPaperWordsConfirm(true));
      yield put(actions.setPaperWordsConfirm(true));

      yield put(actions.setTransactions([]));
      yield put(actions.setBalance(0));
      yield put(actions.setAddress(''));

      yield put(actionNotify.setTimeNotify(0));
      yield put(actionNotify.setVisibleNotify(false));

      yield put(actions.setIsRecovery(false));

      const pinsRecovery = yield select(selectorPinsRecovery);

      yield put(actions.setPins(pinsRecovery));
      yield put(actions.setConfirmPins(pinsRecovery));

      yield put(actions.createWallet());
    }
  } catch (e) {
    // eslint-disable-next-line
    console.log('ERROR', e);
    yield put(actions.setShowSpinner(false));
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(recoveryWallet, recoveryWalletSaga);
}
