import { combineReducers } from 'redux';

import wallet from '../commons/reducers/wallet';
import pins from '../commons/reducers/pins';
import pinsRecovery from '../commons/reducers/pinsRecovery';
import modals from '../commons/reducers/modals';
import settings from '../commons/reducers/settings';
import notify from '../modules/Notify/reducers';
import paperConfirm from '../modules/PaperWordsConfirm/reducer';
import dashboard from '../modules/Dashboard/reducers';
import paperWords from '../modules/PaperWords/reducers';
import chooseContact from '../modules/ChooseContact/reducers';
import send from '../modules/Send/reducers';
import transactionsDetails from '../modules/TransactionDetails/reducer';
import alert from '../modules/Alert/reducers';

export default combineReducers({
  wallet,
  pins,
  pinsRecovery,
  notify,
  modals,
  settings,
  paperConfirm,
  dashboard,
  paperWords,
  chooseContact,
  send,
  transactionsDetails,
  alert,
});
