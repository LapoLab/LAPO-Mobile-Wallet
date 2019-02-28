// @flow
import { createActions } from 'redux-actions';

export { setSendAddress } from '../../Send/actions';

export const {
  getInfoAboutWallet, setIsReady, setAnalitycLoadBlock, closeApp,
} = createActions({
  GET_INFO_ABOUT_WALLET: (data = '') => data,
  SET_IS_READY: (data = true) => data,
  SET_ANALITYC_LOAD_BLOCK: (data = true) => data,
  CLOSE_APP: (data = true) => data,
});

export { getContacts } from '../../ChooseContact/actions';
