import { all } from 'redux-saga/effects';
import commonsSagas from '../commons/sagas';
import recoveryWordsSagas from '../modules/RecoveryWords/sagas';
import sendSagas from '../modules/Send/sagas';
import paperWordsConfirm from '../modules/PaperWordsConfirm/sagas';
import dashboard from '../modules/Dashboard/sagas';
import settings from '../modules/Settings/sagas';
import paperWords from '../modules/PaperWords/sagas';
import transactionsDetails from '../modules/TransactionDetails/sagas';
import chooseContact from '../modules/ChooseContact/sagas';
import splashScreen from '../modules/SplashScreen/sagas';
import switchContacts from '../modules/SwitchContacts/sagas';
import receive from '../modules/Receive/sagas';

// eslint-disable-next-line
const getListeners = (...args) => args.reduce((acc, nextArg) => [...acc, ...Object.values(nextArg).map(func => func())], []);

export default function* rootSaga() {
  yield all(
    getListeners(
      commonsSagas,
      recoveryWordsSagas,
      sendSagas,
      paperWordsConfirm,
      dashboard,
      settings,
      paperWords,
      transactionsDetails,
      chooseContact,
      splashScreen,
      switchContacts,
      receive,
    ),
  );
}
