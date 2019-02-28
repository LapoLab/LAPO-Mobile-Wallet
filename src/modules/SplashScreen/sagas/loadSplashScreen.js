// @flow
import type { Saga } from 'redux-saga';
import {
  takeLatest, call, select, delay,
} from 'redux-saga/effects';
import NavigationService from '../../../NavigationService';

export function* loadSplashScreenSaga(): Saga<void> {
  yield delay(500);

  const isConfirmPaperWords = yield select(state => state.wallet.isConfirmPaperWords);
  if (isConfirmPaperWords) {
    yield call(NavigationService.navigate, 'PinsVerify', {});
  } else {
    yield call(NavigationService.navigate, 'Start', {});
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest('persist/REHYDRATE', loadSplashScreenSaga);
}
