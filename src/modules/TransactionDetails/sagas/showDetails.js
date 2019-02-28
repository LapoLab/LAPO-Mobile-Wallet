// @flow
import type { Saga } from 'redux-saga';
import {
  takeLatest, put, call,
} from 'redux-saga/effects';
import * as actionsCommons from '../../../commons/actions';
import { getContactsSaga } from '../../ChooseContact/sagas/getContacts';
import * as actions from '../actions';

export const isReady = (state: Object) => state.dashboard.isReady;

type Action = {
  type: string,
  payload: {
    address: String,
  },
};
export function* showDetailsSaga({ payload }: Action): Saga<void> {
  try {
    if (payload) {
      yield call(getContactsSaga);
      yield put(actions.getContactFromAddress());
    }
  } catch (e) {
    // eslint-disable-next-line
    console.log('error:', e);
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(actionsCommons.setModalTxDetails, showDetailsSaga);
}
