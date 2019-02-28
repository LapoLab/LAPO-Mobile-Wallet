// @flow
import { createActions } from 'redux-actions';

export const { shareOnlyAddress, shareRecieve } = createActions({
  SHARE_ONLY_ADDRESS: (address = '') => ({ address }),
  SHARE_RECIEVE: (address = '', dataURL = '') => ({ address, dataURL }),
});
