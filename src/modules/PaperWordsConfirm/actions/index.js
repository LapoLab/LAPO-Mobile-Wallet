// @flow
import { createActions } from 'redux-actions';

// actions
// eslint-disable-next-line
export const { confirmWord, genIndexForWords, senIndexForWords } = createActions({
  CONFIRM_WORD: (data = '') => data,
  GEN_INDEX_FOR_WORDS: (data = '') => data,
  SEN_INDEX_FOR_WORDS: (data = '') => data,
});
