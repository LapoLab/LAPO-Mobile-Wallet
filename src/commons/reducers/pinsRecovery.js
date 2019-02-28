import { handleActions } from 'redux-actions';
import {
  setPinsRecovery, setConfirmPinsRecovery,
} from '../actions';

export const initialPinsState = {
  pinsRecovery: '',
  pinsConfirmRecovery: '',
};

// reducer
const reducer = handleActions(
  {
    [setPinsRecovery](state, { payload }) {
      return {
        ...state,
        pinsRecovery: payload,
      };
    },
    [setConfirmPinsRecovery](state, { payload }) {
      return {
        ...state,
        pinsConfirmRecovery: payload,
      };
    },
  },
  initialPinsState,
);

export default reducer;
