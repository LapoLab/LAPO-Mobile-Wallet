// @flow
import { Platform } from 'react-native';

export default {
  globalContaiber: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {

  },

  buttons: {

  },
  contentText: {
    fontSize: 16,
    color: 'black',
  },

  GlobalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  container: {
    minHeight: 180,
    width: '80%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    elevation: 6,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 4 },
        shadowColor: 'rgb(0,0,0)',
        shadowOpacity: 0.34,
      },
    }),
  },
};
