// @flow
import { createActions } from 'redux-actions';

export const { generatePhrase, setTempPaperWords } = createActions({
  GENERATE_PHRASE: (data = true) => data,
  SET_TEMP_PAPER_WORDS: (data = []) => data,
});
