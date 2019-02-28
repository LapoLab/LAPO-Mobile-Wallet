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

  fotoContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoProxy: {
  },
  imgContainerWithBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
  },
  imgFota: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  fotoAparatContainer: {
    position: 'absolute',
    top: '65%',
    left: 80,
  },
  fotoAparat: {
    width: 25,
    resizeMode: 'contain',
  },

  inputContainer: {
    flexDirection: 'column',
    height: 60,

    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 35,
  },
  label: {
    marginVertical: 10,
    color: 'white',
    fontFamily: 'Lato-Bold',
    fontSize: 20,
  },
  input: {
    minHeight: 30,
    flex: 8,
    padding: 0,
    color: 'white',
    fontFamily: 'Lato-Regular',
    fontSize: 16,
  },

  rowInput: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 30,
  },
  buttonEdit: {
    flex: 1,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEdit: {
    width: 20,
    resizeMode: 'contain',
  },

  info: {
    flex: 2,
    paddingHorizontal: 40,
    color: 'white',
    fontFamily: 'Lato-Regular',
    fontSize: 18,
  },

  line: {
    // flex: 1,
    marginVertical: 20,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#C9C9C9',
  },

  buttonContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonReady: {
    width: '80%',
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#4183BD',
    borderRadius: 74,
    borderColor: 'rgb(42, 101, 117)',
    borderWidth: 8,
  },
  textButtonReady: {
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    color: 'white',
  },
};
