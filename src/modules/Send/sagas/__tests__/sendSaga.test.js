// @flow
import {
  put, call, select,
} from 'redux-saga/effects';
// $FlowFixMe
import { cloneableGenerator } from '@redux-saga/testing-utils';

import LapoCore from 'lapo-core';
import { sendSaga, isReady } from '../sendSaga';
import * as actions from '../../actions';
import * as actionsCommons from '../../../../commons/actions';

const address = '123333';
const amount = 1222;
const note = 'note';

const actionTest = actions.send(address, amount, note);

test('sendSaga flow', () => {
  const generator = cloneableGenerator(sendSaga)(actionTest);

  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(true)));

  expect(generator.next().value).toMatchObject(select(isReady));

  const amountAdapt = Number(amount);
  expect(generator.next(true).value).toMatchObject(
    call(LapoCore.newTransaction, address, amountAdapt, note),
  );

  const hash = 'hash';
  expect(generator.next(hash).value).toMatchObject(put(actions.sendSuccess()));
  expect(generator.next().value).toMatchObject(put(actionsCommons.addNoteTx({ hash, note })));

  expect(generator.next().value).toMatchObject(put(actionsCommons.setModalSend(false)));
  expect(generator.next(hash).value).toMatchObject(put(actions.setSendAddress()));
  expect(generator.next(hash).value).toMatchObject(put(actions.setSendAmount()));
  expect(generator.next(hash).value).toMatchObject(put(actions.setSendNote()));
  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(false)));
});
