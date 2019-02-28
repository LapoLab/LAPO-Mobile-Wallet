import { handleActions } from 'redux-actions';
import {
  setContacts,
} from '../actions';


export const initialChooseContactState = {
  data: [],
};

// reducer
const reducer = handleActions(
  {
    [setContacts](state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },
  initialChooseContactState,
);

export default reducer;
