// @flow

import {
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const backButtonWidthHeight = width <= 320 ? 76 : 96;
const buttonWidthHeight = width <= 320 ? 60 : 80;

const widthHeightCircle = 12;

export default {
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingdVertical: 0,
    paddingBottom: 10,
    paddingHorizontal: '10%',
  },
  containerIndicator: {
    height: 40,
    alignItems: 'center',
  },
  rowIndicator: {
    width: 180,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    flexDirection: 'row',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    width: '100%',
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorEmptyCircle: {
    width: widthHeightCircle,
    height: widthHeightCircle,
    borderWidth: 1,
    borderColor: '#4183BD',
    borderRadius: widthHeightCircle / 2,
  },
  indicatorFillCircle: {
    width: widthHeightCircle,
    height: widthHeightCircle,
    borderWidth: 3,
    borderColor: '#4183BD',
    borderRadius: widthHeightCircle / 2,
    backgroundColor: 'white',
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerButton: {
    height: backButtonWidthHeight,
    width: backButtonWidthHeight,
    borderRadius: backButtonWidthHeight / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(93,112,241, 0.2)',
  },
  button: {
    height: buttonWidthHeight,
    width: buttonWidthHeight,
    borderRadius: buttonWidthHeight / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4183BD',
  },
  buttonEmpty: {
    width: 150,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },

  textButton: {
    fontFamily: 'Lato-Bold',
    color: 'white',
    fontSize: 20,
  },
  textButtonDelete: {
    marginRight: 40,
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: '#D5D9F3',
  },
};
