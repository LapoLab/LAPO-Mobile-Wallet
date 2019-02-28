// @flow

import wordsOriginal from './words';

const isVerify = (words: Object) => {
  let res = true;
  Object.keys(words).forEach((element) => {
    res = res && wordsOriginal.includes(words[element].toLowerCase().trim());
  });
  return res && Object.keys(words).length === 12;
};

export default isVerify;
