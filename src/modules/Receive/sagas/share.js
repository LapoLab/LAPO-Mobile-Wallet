// @flow
import type { Saga } from 'redux-saga';
import { takeLatest, put, call } from 'redux-saga/effects';
import { PermissionsAndroid, Platform } from 'react-native';
import Share from 'react-native-share';
import * as actionsCommons from '../../../commons/actions';
import * as actions from '../actions';

export const isReady = (state: Object) => state.dashboard.isReady;

type Action = {
  type: string,
  payload: {
    address: string,
    dataURL: string,
  },
};
export function* shareRecieveSaga({ payload: { address, dataURL } }: Action): Saga<void> {
  try {
    yield put(actionsCommons.goToOtherWindow(true));

    const shareImageBase64 = {
      type: 'image/png',
      title: 'Lapo address',
      message: address,
      url: `data:image/png;base64,${dataURL}`,
      subject: 'Share address lapo', //  for email
      failOnCancel: false,
    };

    if (Platform.OS !== 'ios') {
      const granted = yield call(
        PermissionsAndroid.request,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Get Permission',
          message: 'Lapo needs access to your Documents so you can store paper words.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        yield put(actionsCommons.goToOtherWindow(true));
        yield call(Share.open, shareImageBase64);
        yield put(actionsCommons.goToOtherWindow(true));
      }
    } else {
      yield call(Share.open, shareImageBase64);
    }
  } catch (e) {
    // eslint-disable-next-line
    console.log('error::', e);
  }
}

export default function* listener(): Saga<void> {
  yield takeLatest(actions.shareRecieve, shareRecieveSaga);
}
