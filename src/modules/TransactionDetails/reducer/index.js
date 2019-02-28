import { handleActions } from 'redux-actions';
import {
  setContactFromAddress,
  setLoadingContact,
} from '../actions';


export const initialChooseContactState = {
  nameContact: '',
  idContact: '',
  isLoadingContact: '',
};

// reducer
const reducer = handleActions(
  {
    [setContactFromAddress](state, { payload }) {
      return {
        ...state,
        nameContact: payload.name,
        idContact: payload.id,
      };
    },
    [setLoadingContact](state, { payload }) {
      return {
        ...state,
        isLoadingContact: payload,
      };
    },
  },
  initialChooseContactState,
);

export default reducer;
