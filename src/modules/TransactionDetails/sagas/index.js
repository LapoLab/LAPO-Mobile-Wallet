import saveContact from './saveContactSaga';
import showContact from './showContact';
import getContactFromAddress from './getContactFromAddress';
import showDetails from './showDetails';

export * from '../actions';

export default {
  saveContact,
  getContactFromAddress,
  showContact,
  showDetails,
};
