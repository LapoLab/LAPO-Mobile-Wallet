import { handleActions } from 'redux-actions';
import {
  setSendAddress,
  setSendAmount,
  setSendNote,
} from '../actions';

export const initialSendState = {
  address: '',
  amount: '',
  note: '',
};

// reducer
const reducer = handleActions(
  {
    [setSendAddress](state, { payload }) {
      return {
        ...state,
        address: payload,
      };
    },
    [setSendAmount](state, { payload }) {
      return {
        ...state,
        amount: payload,
      };
    },
    [setSendNote](state, { payload }) {
      return {
        ...state,
        note: payload,
      };
    },
  },
  initialSendState,
);

export default reducer;
