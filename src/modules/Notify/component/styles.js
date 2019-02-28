// @flow

import { Platform } from 'react-native';

export default {
  GlobalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
  },
  container: {
    position: 'absolute',
    right: 15,
    top: Platform.OS === 'ios' ? 70 : 50,
    zIndex: 10,
    padding: 5,
  },
  iconTriangle: {
    marginLeft: 235,
    width: 25,
    height: 12,
    resizeMode: 'contain',
  },

  panel: {
    width: 260,
    maxHeight: 500,
    minHeight: 60,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 4,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 4 },
        shadowColor: 'rgb(0,0,0)',
        shadowOpacity: 0.34,
      },
    }),
  },
  txContainer: {
    padding: 10,
    height: 75,
  },
  txContainerTop: {
    padding: 10,
    height: 35,
  },
  titleTop: {
    fontFamily: 'Lato-Bold',
    fontSize: 14,
  },
  txTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 18,
  },
  txAmount: {
    marginTop: 3,
    fontFamily: 'Lato-Light',
    fontSize: 12,
  },
  txAddress: {
    marginTop: 2,
    fontFamily: 'Lato-Light',
    fontSize: 10,
  },

  txsEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  line: {
    borderTopWidth: 1,
    borderTopColor: '#E4E4E4',
  },
};
