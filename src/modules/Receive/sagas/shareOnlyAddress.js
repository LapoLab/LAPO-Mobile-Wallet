// @flow
import type { Saga } from 'redux-saga';
import { takeLatest, put, call } from 'redux-saga/effects';
import Share from 'react-native-share';
import * as actionsCommons from '../../../commons/actions';
import * as actions from '../actions';

export const isReady = (state: Object) => state.dashboard.isReady;

type Action = {
  type: string,
  payload: {
    address: string,
  },
};
export function* shareOnlyAddressSaga({ payload: { address } }: Action): Saga<void> {
  try {
    yield put(actionsCommons.goToOtherWindow(true));

    const shareImageBase64 = {
      title: 'Lapo address',
      message: address,
      failOnCancel: false,
    };

    yield call(Share.open, shareImageBase64);
  } catch (e) {
    // eslint-disable-next-line
    console.log('error::', e);
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(actions.shareOnlyAddress, shareOnlyAddressSaga);
}
