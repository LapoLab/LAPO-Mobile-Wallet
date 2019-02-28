// @flow
import type { Saga } from 'redux-saga';
import {
  NativeModules,
  Platform,
} from 'react-native';
import {
  takeLatest, put, call, select, delay,
} from 'redux-saga/effects';
import LapoCoreAndroid from 'lapo-core';
import NavigationService from '../../../NavigationService';
import * as actions from '../../../commons/actions';
import { resyncWalletSetting } from '../actions';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

export const selectorPaperWords = (state: Object) => state.wallet.paperWords;

export function* resyncWalletSettingsSaga(): Saga<void> {
  try {
    yield put(actions.setShowSpinner(false));
    yield put(actions.setShowSpinner(true));

    const paperWords = yield select(selectorPaperWords);

    let isReady = yield call(LapoCore.isReady);
    while (!isReady) {
      yield delay(100);
      isReady = yield call(LapoCore.isReady);
    }
    yield delay(100);

    yield call(LapoCore.disconnect);
    // yield delay(5000);

    yield call(LapoCore.resync);
    // yield delay(1000);

    yield call(LapoCore.setPhrase, paperWords.join(' '));

    yield put(actions.loadWallet());

    yield call(NavigationService.navigate, 'Dashboard', {});

    yield put(actions.setShowSpinner(false));
  } catch (e) {
    // eslint-disable-next-line
    console.log('ERROR', e);
    yield put(actions.setShowSpinner(false));
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(resyncWalletSetting, resyncWalletSettingsSaga);
}
