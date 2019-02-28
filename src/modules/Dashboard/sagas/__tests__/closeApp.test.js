// @flow
import {
  put, call,
} from 'redux-saga/effects';
// $FlowFixMe
import { cloneableGenerator } from '@redux-saga/testing-utils';
import LapoCore from 'lapo-core';
import { closeAppSaga } from '../closeApp';
import * as actions from '../../actions';
import * as actionsCommons from '../../../../commons/actions';

const actionTest = actions.closeApp();

test('closeApp flow', () => {
  const generator = cloneableGenerator(closeAppSaga)(actionTest);

  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(true)));
  expect(generator.next().value).toMatchObject(call(LapoCore.closeApp));
  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(false)));
});
