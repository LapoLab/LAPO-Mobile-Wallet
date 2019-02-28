// @flow
import { createActions } from 'redux-actions';

// eslint-disable-next-line
export const { recoveryWallet } = createActions({
  RECOVERY_WALLET: (data = '') => data,
});
