// @flow
import type { Saga } from 'redux-saga';
import {
  takeEvery, put,
} from 'redux-saga/effects';
import words from '../../../utils/words';
import * as actions from '../actions';
import * as actionsCommon from '../../../commons/actions';

type Action = {
  payload: boolean,
}
export function* generatePhraseSaga({ payload: isSave }: Action): Saga<void> {
  yield put(actionsCommon.setShowSpinner(true));
  try {
    const lengthAllWords = words.length;
    const phrases = [];
    for (let n = 0; n < 12; n += 1) {
      const index = Math.floor(Math.random() * lengthAllWords);
      phrases.push(words[index]);
    }

    if (isSave) yield put(actionsCommon.setPaperWords(phrases));
    yield put(actions.setTempPaperWords(phrases));

    yield put(actionsCommon.setShowSpinner(false));
  } catch (error) {
    yield put(actionsCommon.setShowSpinner(false));
  }
}

export default function* listener(): Saga<void> {
  yield takeEvery(actions.generatePhrase, generatePhraseSaga);
}
