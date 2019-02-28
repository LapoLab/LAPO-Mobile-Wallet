// @flow
// $FlowFixMe
import { Platform } from 'react-native';

export default {
  container: {
    padding: 23,
    flex: 1,
    backgroundColor: '#160A3A',
  },
  navItemStyle: {
    padding: 10,
  },
  navSectionStyle: {
    backgroundColor: 'lightgrey',
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  footerContainer: {
    padding: 20,
    backgroundColor: 'lightgrey',
  },

  header: {
    marginTop: 0,
    marginBottom: 20,
    flex: 1,
  },

  headeColumns: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    marginLeft: 20,
    marginTop: 12,
    flex: 3,
    height: 40,
    padding: 5,
    color: 'white',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foto: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 30,
  },
  headerSub: {
    color: 'white',
    marginVertical: Platform.OS === 'ios' ? 20 : 5,
    opacity: 0.8,
    fontSize: 10,
    width: '100%',
    marginLeft: 14,
  },

  links: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  linksBottom: {
    height: 50,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  icon: {
    width: 54,
    height: 24,
    resizeMode: 'contain',
  },
  link: {
    marginBottom: 40,
    flex: 1,
    flexDirection: 'row',
  },
  linkBottom: {
    flexDirection: 'row',
  },
  title: {
    color: 'white',
    fontSize: 18,
  },
};
