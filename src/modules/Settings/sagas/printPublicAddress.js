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
import * as actionsCommons from '../../../commons/actions';
import * as actionsAlert from '../../Alert/actions';
import createPdfPublicAddress from '../../../utils/createPdfPublicAddress';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

export function* printPublicAddressSaga(): Saga<void> {
  try {
    yield put(actionsCommons.setShowSpinner(true));

    const address = yield select(state => state.wallet.address);

    const pdfPath = yield call(createPdfPublicAddress, address);

    if (Platform.OS === 'ios') {
      const shareImageBase64 = {
        type: 'application/pdf',
        title: 'Lapo address pdf',
        url: pdfPath,
        subject: 'public address lapo', //  for email
      };

      // eslint-disable-next-line
      yield call(Share.open, shareImageBase64);

      yield put(actionsCommons.setShowSpinner(false));
    } else {
      yield put(actionsCommons.goToOtherWindow(true));
      const granted = yield call(
        PermissionsAndroid.request,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Get Permission',
          message: 'Lapo needs access to your Documents so you can store paper words.',
        },
      );
      yield put(actionsCommons.goToOtherWindow(false));
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const pathPaper = yield call(LapoCore.downloadPublicPdf);
        yield put(actionsCommons.setShowSpinner(false));
        yield put(
          actionsAlert.showAlert(
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
        yield put(actionsCommons.setShowSpinner(false));
      }
    }
  } catch (e) {
    // eslint-disable-next-line
    console.log('ERROR', e);
    yield put(actionsCommons.setShowSpinner(false));
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(actions.printPublicAddress, printPublicAddressSaga);
}
