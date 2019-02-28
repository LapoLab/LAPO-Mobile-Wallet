import { handleActions } from 'redux-actions';
import {
  setBalance,
  setAddress,
  setPaperWords,
  setPaperWordsConfirm,
  setTransactions,
  addNoteTx,

} from '../actions';

export const initialWalletState = {
  balance: '',
  address: '',
  transactions: [],
  paperWords: [],
  isConfirmPaperWords: false,
  notes: {},
};

// reducer
const reducer = handleActions(
  {
    [setBalance](state, { payload }) {
      return {
        ...state,
        balance: payload,
      };
    },
    [setAddress](state, { payload }) {
      return {
        ...state,
        address: payload,
      };
    },
    [setTransactions](state, { payload }) {
      return {
        ...state,
        transactions: payload,
      };
    },
    [setPaperWords](state, { payload }) {
      return {
        ...state,
        paperWords: payload,
      };
    },
    [setPaperWordsConfirm](state, { payload }) {
      return {
        ...state,
        isConfirmPaperWords: payload,
      };
    },

    [addNoteTx](state, { payload }) {
      const { notes } = state;
      notes[payload.hash] = payload.note;
      return {
        ...state,
        notes,
      };
    },

  },
  initialWalletState,
);

export default reducer;
