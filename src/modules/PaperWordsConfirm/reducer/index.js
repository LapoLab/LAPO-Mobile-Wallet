import { handleActions } from 'redux-actions';
import { confirmWord, senIndexForWords } from '../actions';

export const initialPapaerWordsCondirmState = {
  testConfirmWords: {},
  index1: 1,
  index2: 7,
};

// reducer
const reducer = handleActions(
  {
    [confirmWord](state, { payload }) {
      return {
        ...state,
        testConfirmWords: payload,
      };
    },
    [senIndexForWords](
      state,
      {
        payload: { index1, index2 },
      },
    ) {
      return {
        ...state,
        index1,
        index2,
      };
    },
  },
  initialPapaerWordsCondirmState,
);

export default reducer;
