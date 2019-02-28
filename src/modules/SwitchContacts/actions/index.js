// @flow
import { createActions } from 'redux-actions';

export const { addNewContact, chooseExistsContact } = createActions({
  ADD_NEW_CONTACT: (address = '') => ({ address }),
  CHOOSE_EXISTS_CONTACT: (address = '') => ({ address }),
});
