// @flow

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

  links: {
    marginTop: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  link: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  info: {
    flex: 1,
    flexDirection: 'column',
  },
  linkBottom: {
    flexDirection: 'row',
  },
  title: {
    color: 'white',
    fontFamily: 'Lato-Bold',
    fontSize: 20,
  },
  subTitle: {
    marginTop: 5,
    color: 'white',
    fontFamily: 'Lato-Light',
    fontSize: 16,
  },
  icon: {
    width: 100,
    height: 48,
    resizeMode: 'contain',
  },

  line: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#C9C9C9',
  },
};
