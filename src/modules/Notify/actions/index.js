// @flow
import { createActions } from 'redux-actions';

export const { setVisibleNotify, setTimeNotify, setTimePushNotify } = createActions({
  SET_VISIBLE_NOTIFY: (data = true) => data,
  SET_TIME_NOTIFY: (data = []) => data,
  SET_TIME_PUSH_NOTIFY: (data = []) => data,
});

export { setModalTxDetails } from '../../../commons/actions';
