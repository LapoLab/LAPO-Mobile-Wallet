// @flow
import { Dimensions } from 'react-native';

const widthWindow = Dimensions.get('window').width;

export default {
  buttonContainer: {
    backgroundColor: '#BBCDEB',
    borderRadius: 30,
    height: 64,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#4183BD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SendImage: {
    width: 24,
    resizeMode: 'contain',
  },
  backgroundActive: {
    width: '98%',
    height: 52,
    borderRadius: 26,
    left: 8,
    backgroundColor: '#4183BD',
    position: 'absolute',
  },
  infoContainer: {
    height: 56,
    width: widthWindow * 0.80,
    top: 22,
    position: 'absolute',
    alignItems: 'center',
  },
  textSlideToSend: {
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    color: 'white',
  },
  imageStrelka: {
    width: 60,
    top: -4,
    resizeMode: 'contain',
  },
};
