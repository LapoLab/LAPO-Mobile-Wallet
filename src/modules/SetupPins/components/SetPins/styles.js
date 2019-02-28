// @flow

export default {
  container: {
    flex: 1,
    // backgroundColor: '#4183BD',
    // backgroundColor: 'rgba(37, 95,99, 0.8)',
  },

  header: {
    height: 30,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  backHeader: {
    // color: 'white',
    marginLeft: 12,
    flex: 1,
    width: 12,
    // height: null,
    resizeMode: 'contain',
  },
  titleHeader: {
    fontFamily: 'Lato-Regular',
    color: 'white',
    marginRight: 24,
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    alignItems: 'center',
  },

  indicator: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorIcon: {
    height: 20,
    resizeMode: 'contain',
  },

  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 80,
  },

  title: {
    fontFamily: 'Lato-Light',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },

  pins: {
    flex: 7,
  },
};
