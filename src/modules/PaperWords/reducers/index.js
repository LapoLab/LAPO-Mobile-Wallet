import { handleActions } from 'redux-actions';
import {
  setTempPaperWords,
} from '../actions';

export const initialPaperWordsState = {
  tempWords: [],
};

// reducer
const reducer = handleActions(
  {
    [setTempPaperWords](state, { payload }) {
      return {
        ...state,
        tempWords: payload,
      };
    },
  },
  initialPaperWordsState,
);

export default reducer;
