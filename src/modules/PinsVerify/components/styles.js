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
    fontFamily: 'Lato-Regular',
    color: 'white',
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
    resizeMode: 'contain',
  },

  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 80,
  },

  title: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },

  pins: {
    marginTop: 80,
    flex: 1,
  },


  spinnerContainer: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
