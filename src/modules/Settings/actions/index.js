// @flow
import { createActions } from 'redux-actions';

export const { recoveryWalletSetting, resyncWalletSetting, printPublicAddress } = createActions({
  RECOVERY_WALLET_SETTING: (data = '') => data,
  RESYNC_WALLET_SETTING: (data = '') => data,
  PRINT_PUBLIC_ADDRESS: (data = '') => data,
});
