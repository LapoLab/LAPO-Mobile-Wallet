// @flow
import {
  put, call, select, spawn,
} from 'redux-saga/effects';
// $FlowFixMe
import { cloneableGenerator } from '@redux-saga/testing-utils';
import LapoCore from 'lapo-core';
import {
  loadWalletSaga,
} from '../loadWallet';
import { selectPaperWords, selectPathDb } from '../selecters';

import * as actions from '../../actions';
import NavigationService from '../../../NavigationService';

const actionTest = actions.loadWallet();

test('loadWalletSaga flow', () => {
  const generator = cloneableGenerator(loadWalletSaga)(actionTest);

  expect(generator.next().value).toEqual(put(actions.setShowSpinner(false)));
  expect(generator.next().value).toEqual(put(actions.setShowSpinner(true)));

  expect(generator.next().value).toMatchObject(select(selectPaperWords));
  expect(generator.next([]).value).toMatchObject(select(selectPathDb));

  expect(generator.next('').value).toMatchObject(call(LapoCore.disconnect));

  expect(generator.next().value).toMatchObject(call(LapoCore.setPhrase, ''));

  expect(generator.next().value).toMatchObject(call(LapoCore.setPathDB, ''));

  const clone = generator.clone();
  // expect(clone.next(true).value).toMatchObject(delay(1000));
  expect(clone.next().value).toMatchObject(spawn(LapoCore.connectPeers));
  expect(clone.next().value).toMatchObject(spawn(NavigationService.navigate, 'Dashboard', {}));
  expect(clone.next().value).toMatchObject(put(actions.setShowSpinner(false)));
});
