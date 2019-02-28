// @flow
import type { Saga } from 'redux-saga';
import {
  takeEvery, put, select, call, delay,
} from 'redux-saga/effects';
import LapoCoreAndroid from 'lapo-core';
import {
  NativeModules,
  Platform,
} from 'react-native';
import * as actions from '../actions';
import * as actionsCommons from '../../../commons/actions';
import * as actionNotify from '../../Notify/actions';
import {
  timeNotifyLastPush as timeNotifyLastPushSelector,
} from './selectors';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

export function* getInfoWithPeriodSaga(): Saga<void> {
  try {
    const isReady = yield call(LapoCore.isReady);
    yield put(actions.setIsReady(isReady));

    if (isReady) {
      const balance = yield call(LapoCore.getBalance);
      yield put(actionsCommons.setBalance(balance));

      const address = yield call(LapoCore.getReceiveAddress);
      yield put(actionsCommons.setAddress(address));

      const resJson = yield call(LapoCore.getLastBlockHeight);
      const params = yield call(JSON.parse, resJson);
      yield put(
        actions.setAnalitycLoadBlock({ countBlock: params.curHeight, maxBlock: params.allHeight }),
      );

      const transactionsString = yield call(LapoCore.getTransactions);

      const transactions = yield call(JSON.parse, transactionsString);

      yield put(actionsCommons.setTransactions(transactions));
      const txsWithoutOut = transactions.filter(item => item.mode === 'out');

      const timeNotifyLastPush = yield select(timeNotifyLastPushSelector);

      const isNotifyActive = !!(
        txsWithoutOut.length > 0
        && txsWithoutOut[txsWithoutOut.length - 1].time > timeNotifyLastPush
      );

      if (isNotifyActive) {
        yield put(actionNotify.setTimePushNotify(txsWithoutOut[txsWithoutOut.length - 1].time));
      }
    }

    yield delay(5000);
    yield put(actions.getInfoAboutWallet());
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
}

export default function* listener(): Saga<void> {
  yield takeEvery(actions.getInfoAboutWallet, getInfoWithPeriodSaga);
}
