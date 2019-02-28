// @flow
import {
  put, call, select, delay,
} from 'redux-saga/effects';
// $FlowFixMe
import { cloneableGenerator } from '@redux-saga/testing-utils';
import LapoCore from 'lapo-core';
import { getInfoWithPeriodSaga } from '../getInfoWithPeriod';
import { timeNotifyLastPush } from '../selectors';
import * as actions from '../../actions';
import * as actionsCommons from '../../../../commons/actions';

const actionTest = actions.getInfoAboutWallet();

test('createWalletSaga flow', () => {
  const generator = cloneableGenerator(getInfoWithPeriodSaga)(actionTest);

  expect(generator.next().value).toMatchObject(call(LapoCore.isReady));
  expect(generator.next(true).value).toMatchObject(put(actions.setIsReady(true)));

  expect(generator.next().value).toMatchObject(call(LapoCore.getBalance));
  expect(generator.next(40).value).toMatchObject(put(actionsCommons.setBalance(40)));

  expect(generator.next().value).toMatchObject(call(LapoCore.getReceiveAddress));
  expect(generator.next('address').value).toMatchObject(put(actionsCommons.setAddress('address')));

  expect(generator.next().value).toMatchObject(call(LapoCore.getLastBlockHeight));
  expect(generator.next('{"curHeight": 123, "allHeight": 1234 }').value).toMatchObject(
    call(JSON.parse, '{"curHeight": 123, "allHeight": 1234 }'),
  );
  expect(generator.next({ curHeight: 123, allHeight: 1234 }).value).toMatchObject(
    put(actions.setAnalitycLoadBlock({ countBlock: 123, maxBlock: 1234 })),
  );

  expect(generator.next().value).toMatchObject(call(LapoCore.getTransactions));
  expect(generator.next('[{"mode": "out"}]').value).toMatchObject(
    call(JSON.parse, '[{"mode": "out"}]'),
  );
  expect(generator.next([{ mode: 'out' }]).value).toMatchObject(
    put(actionsCommons.setTransactions([{ mode: 'out' }])),
  );

  // expect(generator.next().value).toMatchObject(select(isVisibleNotify));
  expect(generator.next(false).value).toMatchObject(select(timeNotifyLastPush));
  // expect(generator.next(0).value).toMatchObject(put(actionNotify.setVisibleNotify(false)));

  expect(generator.next().value).toMatchObject(delay(5000));

  expect(generator.next(0).value).toMatchObject(put(actions.getInfoAboutWallet()));
});
