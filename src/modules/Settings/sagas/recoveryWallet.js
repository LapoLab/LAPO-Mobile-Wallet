// @flow
import type { Saga } from 'redux-saga';
import {
  takeLatest, put, call,
} from 'redux-saga/effects';

import NavigationService from '../../../NavigationService';
import * as actions from '../../../commons/actions';
import { recoveryWalletSetting } from '../actions';

export function* recoveryWalletSettingSaga(): Saga<void> {
  try {
    yield put(actions.setShowSpinner(false));
    yield put(actions.setShowSpinner(true));

    yield put(actions.setConfirmPinsRecovery(''));
    yield put(actions.setPinsRecovery(''));
    yield put(actions.setIsRecovery(true));

    yield call(NavigationService.navigate, 'SetPins', {});

    yield put(actions.setShowSpinner(false));
  } catch (e) {
    // eslint-disable-next-line
    console.log('ERROR', e);
    yield put(actions.setShowSpinner(false));
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(recoveryWalletSetting, recoveryWalletSettingSaga);
}
