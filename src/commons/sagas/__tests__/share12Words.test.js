// @flow
import {
  put, call, select,
} from 'redux-saga/effects';
// $FlowFixMe
import { cloneableGenerator } from '@redux-saga/testing-utils';
import LapoCore from 'lapo-core';
import { PermissionsAndroid } from 'react-native';
import { share12WordsSaga } from '../share12Words';
import createPDF from '../../../utils/createPdf';
import * as actions from '../../actions';
import { showAlert } from '../../../modules/Alert/actions';
import { selectPaperWords } from '../selecters';

const actionTest = actions.share12Words();

describe('share12WordsSaga flow', () => {
  const generator = cloneableGenerator(share12WordsSaga)(actionTest);

  expect(generator.next().value).toEqual(put(actions.setShowSpinner(false)));
  expect(generator.next().value).toEqual(put(actions.setShowSpinner(true)));

  expect(generator.next().value).toMatchObject(select(selectPaperWords));

  expect(generator.next([]).value).toMatchObject(call(createPDF, []));

  expect(generator.next().value).toEqual(put(actions.goToOtherWindow(true)));

  expect(generator.next().value).toMatchObject(
    call(PermissionsAndroid.request, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
      title: 'Get Permission',
      message: 'Lapo needs access to your Documents so you can store paper words.',
    }),
  );

  test('PermissionsAndroid true', () => {
    const clone = generator.clone();
    expect(clone.next(PermissionsAndroid.RESULTS.GRANTED).value).toMatchObject(
      call(LapoCore.lapoName),
    );

    expect(clone.next().value).toMatchObject(put(actions.goToOtherWindow(false)));

    expect(clone.next().value).toMatchObject(put(actions.setShowSpinner(false)));
    expect(clone.next('').value).toMatchObject(
      put(
        showAlert(
          'Message',
          'Your paper words save: undefined',
          [
            {
              text: 'OK',
            },
          ],
          {
            cancelable: true,
          },
        ),
      ),
    );
  });

  test('PermissionsAndroid false', () => {
    const clone = generator.clone();
    expect(clone.next().value).toEqual(put(actions.setShowSpinner(false)));
  });
});
