// @flow
import {
  put, call, select, spawn, delay,
} from 'redux-saga/effects';
// $FlowFixMe
import { cloneableGenerator } from '@redux-saga/testing-utils';
import LapoCore from 'lapo-core';
import { createWalletSaga } from '../createWallet';
import { selectPaperWords } from '../selecters';
import * as actions from '../../actions';
import NavigationService from '../../../NavigationService';

const actionTest = actions.createWallet();

test('createWalletSaga flow', () => {
  const generator = cloneableGenerator(createWalletSaga)(actionTest);

  expect(generator.next().value).toEqual(put(actions.setShowSpinner(true)));
  expect(generator.next().value).toMatchObject(select(selectPaperWords));

  expect(generator.next([]).value).toMatchObject(call(LapoCore.disconnect));
  expect(generator.next().value).toMatchObject(delay(5000));

  expect(generator.next().value).toMatchObject(call(LapoCore.setPhrase, ''));

  expect(generator.next().value).toMatchObject(call(LapoCore.copyDB));

  expect(generator.next().value).toMatchObject(delay(1000));

  const clone = generator.clone();
  expect(clone.next().value).toMatchObject(spawn(LapoCore.connectPeers));
  expect(clone.next().value).toMatchObject(put(actions.setPathDb('')));
  expect(clone.next().value).toMatchObject(spawn(NavigationService.navigate, 'Dashboard', {}));
  expect(clone.next().value).toMatchObject(put(actions.setShowSpinner(false)));
});
