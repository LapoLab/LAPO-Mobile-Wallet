// @flow
import type { Saga } from 'redux-saga';
import {
  takeLatest, put, call,
} from 'redux-saga/effects';
import * as actions from '../actions';

export function* genIndexSaga(): Saga<void> {
  try {
    let random1 = yield call(Math.random);
    random1 *= 6;
    const index1 = Math.floor(random1) + 1;

    let random2 = yield call(Math.random);
    random2 *= 6;
    const index2 = Math.floor(random2) + 7;

    yield put(actions.senIndexForWords({ index1, index2 }));
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(actions.genIndexForWords, genIndexSaga);
}
