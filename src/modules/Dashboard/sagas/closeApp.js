// @flow
import type { Saga } from 'redux-saga';
import {
  takeEvery, put, call,
} from 'redux-saga/effects';
import LapoCoreAndroid from 'lapo-core';
import {
  NativeModules,
  Platform,
} from 'react-native';
import * as actions from '../actions';
import * as actionsCommons from '../../../commons/actions';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

export function* closeAppSaga(): Saga<void> {
  yield put(actionsCommons.setShowSpinner(true));
  try {
    yield call(LapoCore.closeApp);

    yield put(actionsCommons.setShowSpinner(false));
  } catch (error) {
    yield put(actionsCommons.setShowSpinner(false));
  }
}

export default function* listener(): Saga<void> {
  yield takeEvery(actions.closeApp, closeAppSaga);
}
