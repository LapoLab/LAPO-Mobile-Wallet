// @flow
import type { Saga } from 'redux-saga';
import {
  takeLatest, select, call, put, spawn,
} from 'redux-saga/effects';
import LapoCoreAndroid from 'lapo-core';
import {
  NativeModules,
  Platform,
} from 'react-native';
import { loadWallet, setShowSpinner } from '../actions';
import NavigationService from '../../NavigationService';
import { selectPaperWords, selectPathDb } from './selecters';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

export function* loadWalletSaga(): Saga<void> {
  try {
    yield put(setShowSpinner(false));
    yield put(setShowSpinner(true));

    const paperWords = yield select(selectPaperWords);
    const pathDB = yield select(selectPathDb);

    yield call(LapoCore.disconnect);

    yield call(LapoCore.setPhrase, paperWords.join(' '));

    yield call(LapoCore.setPathDB, pathDB);

    yield spawn(LapoCore.connectPeers);

    yield spawn(NavigationService.navigate, 'Dashboard', {});

    yield put(setShowSpinner(false));
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(loadWallet, loadWalletSaga);
}
