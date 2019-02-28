export default {
  container: {
    flex: 1,
  },

  header: {
    height: 30,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backHeader: {
    marginLeft: 12,
    width: 12,
    resizeMode: 'contain',
  },
  titleHeader: {
    fontFamily: 'Lato-Regular',
    color: 'white',
    marginLeft: 30,
    paddingLeft: 10,
    fontSize: 22,
    textAlign: 'center',
    alignItems: 'center',
  },
  textSaveToPdf: {
    color: 'white',
    marginRight: 12,
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
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontFamily: 'Lato-Light',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },

  listWords: {
    height: 200,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,

    flexDirection: 'column',
  },
  rowList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  itemContainer: {
    backgroundColor: '#0C3841',
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    fontFamily: 'Lato-Bold',
    fontSize: 14,
    color: 'white',
  },

  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 25,
  },
  buttonReady: {
    marginHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#4183BD',
    borderRadius: 74,
    borderColor: 'rgb(42, 101, 117)',
    borderWidth: 8,
  },
  textButtonReady: {
    fontFamily: 'Lato-Bold',
    fontSize: 16,
    color: 'white',
  },
};
