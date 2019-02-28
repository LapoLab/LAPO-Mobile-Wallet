// @flow
import { put, call } from 'redux-saga/effects';
// $FlowFixMe
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { genIndexSaga } from '../genIndex';
import * as actions from '../../actions';

const actionTest = actions.genIndexForWords();

test('genIndexSaga flow', () => {
  const generator = cloneableGenerator(genIndexSaga)(actionTest);

  expect(generator.next(1).value).toMatchObject(
    call(Math.random),
  );

  expect(generator.next(1).value).toMatchObject(
    call(Math.random),
  );

  expect(generator.next(1).value).toMatchObject(
    put(actions.senIndexForWords({ index1: 7, index2: 13 })),
  );
});
