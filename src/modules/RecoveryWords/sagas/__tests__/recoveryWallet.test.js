// @flow
import {
  put, call, select,
} from 'redux-saga/effects';
// $FlowFixMe
import { cloneableGenerator } from '@redux-saga/testing-utils';
import LapoCore from 'lapo-core';
import { recoveryWalletSaga, selectorPinsRecovery } from '../recoveryWallet';
import * as actions from '../../actions';
import * as actionsCommons from '../../../../commons/actions';
import * as actionNotify from '../../../Notify/actions';
import isVerify from '../../../../utils/verifyWords12';

const actionTest = actions.recoveryWallet();

test('closeApp flow', () => {
  const generator = cloneableGenerator(recoveryWalletSaga)(actionTest);

  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(false)));
  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(true)));
  expect(generator.next().value).toMatchObject(call(isVerify, {}));

  expect(generator.next(true).value).toMatchObject(call(LapoCore.isLoadWallet));
  expect(generator.next(true).value).toMatchObject(call(LapoCore.isReady));

  const arrayWords = ['', '', '', '', '', '', '', '', '', '', '', ''];

  expect(generator.next(true).value).toMatchObject(put(actionsCommons.setPaperWords(arrayWords)));

  expect(generator.next().value).toMatchObject(put(actionsCommons.setPaperWordsConfirm(true)));
  expect(generator.next().value).toMatchObject(put(actionsCommons.setPaperWordsConfirm(true)));

  expect(generator.next().value).toMatchObject(put(actionsCommons.setTransactions([])));
  expect(generator.next().value).toMatchObject(put(actionsCommons.setBalance(0)));
  expect(generator.next().value).toMatchObject(put(actionsCommons.setAddress('')));

  expect(generator.next().value).toMatchObject(put(actionNotify.setTimeNotify(0)));
  expect(generator.next().value).toMatchObject(put(actionNotify.setVisibleNotify(false)));

  expect(generator.next().value).toMatchObject(put(actionsCommons.setIsRecovery(false)));

  expect(generator.next().value).toMatchObject(select(selectorPinsRecovery));

  expect(generator.next().value).toMatchObject(put(actionsCommons.setPins()));
  expect(generator.next().value).toMatchObject(put(actionsCommons.setConfirmPins()));

  expect(generator.next().value).toMatchObject(put(actionsCommons.createWallet()));
});
