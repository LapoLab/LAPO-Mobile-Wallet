// @flow
import type { Saga } from 'redux-saga';
import {
  takeLatest, put, call, delay, select,
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
export function* saveContactSaga({ payload: { address } }: Action): Saga<void> {
  yield put(actions.setLoadingContact(true));
  yield put(actionsCommons.goToOtherWindow(true));

  try {
    const txDetails = yield select(state => state.modals.txDetails);
    yield put(actionsCommons.setModalTxDetails(''));
    yield delay(10);

    yield put(actionsCommons.setModalSwitchContacts(address, txDetails));

    yield put(actions.setLoadingContact(false));
  } catch (e) {
    yield put(actions.setLoadingContact(false));
    yield call(getContactsSaga);
    yield put(actions.getContactFromAddress(address));
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(actions.saveContact, saveContactSaga);
}
