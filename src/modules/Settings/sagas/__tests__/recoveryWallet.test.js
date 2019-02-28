// @flow
import {
  put, call,
} from 'redux-saga/effects';
// $FlowFixMe
import { cloneableGenerator } from '@redux-saga/testing-utils';
import NavigationService from '../../../../NavigationService';
import { recoveryWalletSettingSaga } from '../recoveryWallet';
import * as actions from '../../actions';
import * as actionsCommons from '../../../../commons/actions';

const actionTest = actions.recoveryWalletSetting();

test('recoveryWalletSettingSaga flow', () => {
  const generator = cloneableGenerator(recoveryWalletSettingSaga)(actionTest);

  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(false)));
  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(true)));

  expect(generator.next().value).toMatchObject(put(actionsCommons.setConfirmPinsRecovery('')));
  expect(generator.next().value).toMatchObject(put(actionsCommons.setPinsRecovery('')));
  expect(generator.next().value).toMatchObject(put(actionsCommons.setIsRecovery(true)));

  expect(generator.next().value).toMatchObject(call(NavigationService.navigate, 'SetPins', {}));

  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(false)));
});
