// @flow
import { Platform } from 'react-native';

export default {
  container: {
    flex: 1,
  },

  header: {
    height: 30,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  backHeader: {
    marginLeft: 12,
    flex: 1,
    width: 12,
    resizeMode: 'contain',
  },
  titleHeader: {
    fontFamily: 'Lato-Bold',
    color: 'white',
    marginRight: 24,
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    alignItems: 'center',
  },

  containerSearch: {
    marginVertical: 15,
    paddingHorizontal: 20,
    // height: 50,
  },
  inputSearch: {
    color: 'white',
    borderWidth: 1,
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 32,
    borderColor: 'white',
    borderRadius: 15,
    fontFamily: 'Lato-Regular',
  },

  links: {
    flex: 1,
    paddingBottom: 20,
  },
  link: {
    height: 30,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  info: {
    flex: 1,
    paddingVertical: 20,
    flexDirection: 'column',
  },
  linkBottom: {
    flexDirection: 'row',
  },
  title: {
    color: 'white',
    fontFamily: 'Lato-Bold',
    fontSize: 20,
    paddingLeft: 30,
  },
  subTitle: {
    marginTop: 5,
    color: 'white',
    fontFamily: 'Lato-Light',
    fontSize: 12,
    ...Platform.select({
      ios: {
        height: 20,
        paddingVertical: 2,
      },
    }),
  },

  line: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#C9C9C9',
  },
};
