// @flow
import type { Saga } from 'redux-saga';
import {
  NativeModules, Platform, PermissionsAndroid,
} from 'react-native';
import {
  takeLatest, put, call, select,
} from 'redux-saga/effects';
import LapoCoreAndroid from 'lapo-core';
import Share from 'react-native-share';
import * as actions from '../actions';
import createPDF from '../../utils/createPdf';
import { selectPaperWords } from './selecters';
import { showAlert } from '../../modules/Alert/actions';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

export function* share12WordsSaga(): Saga<void> {
  try {
    yield put(actions.setShowSpinner(false));
    yield put(actions.setShowSpinner(true));

    const paperWords = yield select(selectPaperWords);

    const pdfPath = yield call(createPDF, paperWords);

    if (Platform.OS === 'ios') {
      const shareImageBase64 = {
        type: 'application/pdf',
        title: 'Lapo pdf',
        url: pdfPath,
        subject: 'Copy pdf words lapo', //  for email
      };

      // eslint-disable-next-line
      yield call(Share.open, shareImageBase64);

      yield put(actions.setShowSpinner(false));
    } else {
      yield put(actions.goToOtherWindow(true));
      const granted = yield call(
        PermissionsAndroid.request,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Get Permission',
          message: 'Lapo needs access to your Documents so you can store paper words.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const pathPaper = yield call(LapoCore.lapoName);
        yield put(actions.goToOtherWindow(false));
        yield put(actions.setShowSpinner(false));
        yield put(
          showAlert(
            'Message',
            `Your paper words save: ${pathPaper}`,
            [
              {
                text: 'OK',
              },
            ],
            {
              cancelable: true,
            },
          ),
        );
      } else {
        yield put(actions.setShowSpinner(false));
      }
    }
  } catch (e) {
    // eslint-disable-next-line
    console.log('ERROR', e);
    yield put(actions.setShowSpinner(false));
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(actions.share12Words, share12WordsSaga);
}
