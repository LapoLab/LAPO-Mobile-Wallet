// @flow
import type { Saga } from 'redux-saga';
import {
  takeLatest, put, call, select, spawn, delay,
} from 'redux-saga/effects';
import LapoCoreAndroid from 'lapo-core';
import {
  NativeModules,
  Platform,
} from 'react-native';
import NavigationService from '../../NavigationService';
import { createWallet, setPathDb, setShowSpinner } from '../actions';
import { selectPaperWords } from './selecters';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

export function* createWalletSaga(): Saga<void> {
  try {
    yield put(setShowSpinner(true));

    const paperWords = yield select(selectPaperWords);

    yield call(LapoCore.disconnect);

    if (Platform.OS !== 'ios') {
      yield delay(5000);
    }

    yield call(LapoCore.setPhrase, paperWords.join(' '));

    const pathDB = yield call(LapoCore.copyDB);

    if (Platform.OS !== 'ios') {
      yield delay(1000);
    }

    yield spawn(LapoCore.connectPeers);

    yield put(setPathDb(pathDB));

    yield spawn(NavigationService.navigate, 'Dashboard', {});

    yield put(setShowSpinner(false));
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(createWallet, createWalletSaga);
}
