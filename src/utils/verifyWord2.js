// @flow

const isVerify = (words: Object, paperWords: Array<string>) => {
  let res = true;
  Object.keys(words).forEach((element) => {
    res = res && paperWords[Number(element)] === words[element].toLowerCase().trim();
  });
  return res && Object.keys(words).length === 2;
};

export default isVerify;
