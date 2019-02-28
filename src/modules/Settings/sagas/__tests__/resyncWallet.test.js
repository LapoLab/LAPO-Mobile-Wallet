// @flow
import {
  put, call, select, delay,
} from 'redux-saga/effects';
// $FlowFixMe
import { cloneableGenerator } from '@redux-saga/testing-utils';
import LapoCore from 'lapo-core';
import NavigationService from '../../../../NavigationService';
import { resyncWalletSettingsSaga, selectorPaperWords } from '../resyncWallet';
import * as actions from '../../actions';
import * as actionsCommons from '../../../../commons/actions';

const actionTest = actions.resyncWalletSetting();

test('resyncWalletSettingsSaga flow', () => {
  const generator = cloneableGenerator(resyncWalletSettingsSaga)(actionTest);

  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(false)));
  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(true)));

  expect(generator.next().value).toMatchObject(select(selectorPaperWords));

  expect(generator.next([]).value).toMatchObject(call(LapoCore.isReady));
  expect(generator.next(true).value).toMatchObject(delay(100));

  expect(generator.next(false).value).toMatchObject(call(LapoCore.disconnect));
  // expect(generator.next().value).toMatchObject(delay(5000));

  // expect(generator.next().value).toMatchObject(call(LapoCore.disconnect));
  // expect(generator.next().value).toMatchObject(call(delay, 100));

  // expect(generator.next().value).toMatchObject(call(LapoCore.disconnect));
  // expect(generator.next().value).toMatchObject(call(delay, 100));

  expect(generator.next().value).toMatchObject(call(LapoCore.resync));
  // expect(generator.next().value).toMatchObject(delay(1000));


  expect(generator.next().value).toMatchObject(call(LapoCore.setPhrase, ''));

  // expect(generator.next().value).toMatchObject(call(LapoCore.createWallet));

  // expect(generator.next().value).toMatchObject(call(delay, 100));

  expect(generator.next().value).toMatchObject(put(actionsCommons.loadWallet()));

  // expect(generator.next(true).value).toMatchObject(call(delay, 100));

  // expect(generator.next().value).toMatchObject(spawn(LapoCore.connectPeers));

  expect(generator.next().value).toMatchObject(call(NavigationService.navigate, 'Dashboard', {}));

  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(false)));
});
