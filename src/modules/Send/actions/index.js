// @flow
import { createActions } from 'redux-actions';

export const {
  send, sendSuccess, sendError, setSendAddress, setSendAmount, setSendNote,
} = createActions({
  SEND: (address = '', amount = 0, note = '') => ({
    address,
    amount,
    note,
  }),
  SEND_SUCCESS: (data = '') => data,
  SEND_ERROR: (data = '') => data,
  SET_SEND_ADDRESS: (data = '') => data,
  SET_SEND_AMOUNT: (data = '') => data,
  SET_SEND_NOTE: (data = '') => data,
});
