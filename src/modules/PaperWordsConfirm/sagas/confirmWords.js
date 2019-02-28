// @flow
import type { Saga } from 'redux-saga';
import {
  takeLatest, put, select, call,
} from 'redux-saga/effects';
import { confirmWord } from '../actions';
import { showAlert } from '../../Alert/actions';
import { setPaperWordsConfirm, createWallet, setShowSpinner } from '../../../commons/actions';
import isVerify from '../../../utils/verifyWord2';

export const selectorTestConfirmWords = (state: Object) => state.paperConfirm.testConfirmWords;
export const selectorPaperWords = (state: Object) => state.wallet.paperWords;

export function* confirmWordsSaga(): Saga<void> {
  try {
    yield put(setShowSpinner(false));
    yield put(setShowSpinner(true));

    const words = yield select(selectorTestConfirmWords);
    const paperWords = yield select(selectorPaperWords);

    const resIsVerify = yield call(isVerify, words, paperWords);

    if (resIsVerify) {
      yield put(setPaperWordsConfirm());

      yield put(createWallet());
    } else {
      yield put(setShowSpinner(false));
      yield put(showAlert(
        'Error',
        'Not verify',
        // eslint-disable-next-line
        [{ text: 'OK' }],
        {
          cancelable: false,
        },
      ));
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(confirmWord, confirmWordsSaga);
}
