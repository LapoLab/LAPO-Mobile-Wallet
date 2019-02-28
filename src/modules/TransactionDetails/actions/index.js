// @flow
import { createActions } from 'redux-actions';

export const {
  saveContact,
  getContactFromAddress,
  setContactFromAddress,
  showContact,
  setLoadingContact,
} = createActions({
  SAVE_CONTACT: (address = '') => ({ address }),
  GET_CONTACT_FROM_ADDRESS: (address = '') => ({ address }),
  SET_CONTACT_FROM_ADDRESS: (name = '', id = '') => ({ name, id }),
  SHOW_CONTACT: (address = '') => ({ address }),
  SET_LOADING_CONTACT: (isLoading = true) => isLoading,
});

export { getContacts } from '../../ChooseContact/actions';
