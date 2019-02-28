// @flow
import {
  put, call, select,
} from 'redux-saga/effects';
// $FlowFixMe
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { confirmWordsSaga, selectorTestConfirmWords, selectorPaperWords } from '../confirmWords';
import * as actions from '../../actions';
import * as actionsCommons from '../../../../commons/actions';
import isVerify from '../../../../utils/verifyWord2';

const actionTest = actions.confirmWord();

test('confirmWordsSaga flow', () => {
  const generator = cloneableGenerator(confirmWordsSaga)(actionTest);

  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(false)));
  expect(generator.next().value).toMatchObject(put(actionsCommons.setShowSpinner(true)));

  expect(generator.next().value).toMatchObject(select(selectorTestConfirmWords));
  expect(generator.next({ words: 'words' }).value).toMatchObject(select(selectorPaperWords));

  expect(generator.next(['words', 'paperWords']).value).toMatchObject(call(isVerify, { words: 'words' }, ['words', 'paperWords']));

  expect(generator.next(true).value).toMatchObject(put(actionsCommons.setPaperWordsConfirm()));
  expect(generator.next().value).toMatchObject(put(actionsCommons.createWallet()));
});
