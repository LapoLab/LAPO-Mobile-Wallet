// @flow
import { createActions } from 'redux-actions';

// actions
export const {
  setWallet,
  createWallet,
  loadWallet,
  share12Words,
  setBalance,
  setAddress,
  setTransactions,
  setPaperWords,
  setPaperWordsConfirm,
  addNoteTx,
} = createActions({
  SET_WALLET: (data = '') => data,
  CREATE_WALLET: (isRecovery = false) => isRecovery,
  LOAD_WALLET: (data = '') => data,
  SHARE_12_WORDS: (data = '') => data,
  SET_BALANCE: (data = '') => data,
  SET_ADDRESS: (data = '') => data,
  SET_TRANSACTIONS: (data = '') => data,
  SET_PAPER_WORDS: (data = '') => data,
  SET_PAPER_WORDS_CONFIRM: (data = true) => data,
  ADD_NOTE_TX: (data = {}) => data,
});

export const {
  setPins, setConfirmPins, setPinsRecovery, setConfirmPinsRecovery,
} = createActions({
  SET_PINS: (data = '') => data,
  SET_CONFIRM_PINS: (data = '') => data,
  SET_PINS_RECOVERY: (data = '') => data,
  SET_CONFIRM_PINS_RECOVERY: (data = '') => data,
});

export const {
  setModalSend,
  setModalReceive,
  setModalTxDetails,
  setShowSpinner,
  setModalSwitchContacts,
  goToOtherWindow,
  setDrawer,
} = createActions({
  SET_MODAL_SEND: (data = '') => data,
  SET_MODAL_RECEIVE: (data = '') => data,
  SET_MODAL_TX_DETAILS: (data = '') => data,
  SET_SHOW_SPINNER: (data = '') => data,
  SET_MODAL_SWITCH_CONTACTS: (address = '', txDetails = '') => ({
    address,
    txDetails,
  }),
  GO_TO_OTHER_WINDOW: (data = false) => data,
  SET_DRAWER: (data = true) => data,
});

export const {
  setPathDb, setIsRecovery, setUserName, setAvatar, closeApp,
} = createActions({
  SET_PATH_DB: (data = '') => data,
  SET_IS_RECOVERY: (data = true) => data,
  SET_USER_NAME: (data = '') => data,
  SET_AVATAR: (data = '') => data,
  CLOSE_APP: (data = true) => data,
});
