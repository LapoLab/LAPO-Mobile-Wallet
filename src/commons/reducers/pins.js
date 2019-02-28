import { handleActions } from 'redux-actions';
import {
  setPins, setConfirmPins,
} from '../actions';

export const initialPinsState = {
  pins: '',
  pinsConfirm: '',
};

// reducer
const reducer = handleActions(
  {
    [setPins](state, { payload }) {
      return {
        ...state,
        pins: payload,
      };
    },
    [setConfirmPins](state, { payload }) {
      return {
        ...state,
        pinsConfirm: payload,
      };
    },
  },
  initialPinsState,
);

export default reducer;
