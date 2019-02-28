// @flow
export default {
  GlobalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  container: {
    height: 450,
    width: '100%',
    backgroundColor: '#EFF4FC',
    alignItems: 'flex-start',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  header: {
    height: 60,
    paddingRight: 15,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    color: '#131313',
    fontFamily: 'Lato-Bold',
    textAlign: 'center',
  },
  buttonClose: {
    padding: 15,
  },
  headerIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  headerIconRight: {
    width: 20,
    resizeMode: 'contain',
    marginTop: -5,
  },

  rowQr: {
    maxHeight: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF4FC',
  },
  address: {
    marginTop: 20,
  },
  rowSharedButton: {
    height: 110,
    borderTopColor: '#D8D8D8',
    borderTopWidth: 1,
  },
  sharedButton: {
    height: 60,
    width: 180,
    backgroundColor: '#4183BD',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 20,
  },
  textSharedButton: {
    fontFamily: 'Lato-Bold',
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  iconShareButton: {
    width: 30,
    resizeMode: 'contain',
  },

  blurBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
};
