// @flow
import { createActions } from 'redux-actions';

export { setSendAddress } from '../../Send/actions';

export const {
  getContacts, setContacts,
} = createActions({
  GET_CONTACTS: (data = '') => data,
  SET_CONTACTS: (data = '') => data,
});
