// @flow
export default {
  GlobalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  container: {
    height: 350,
    width: '100%',
    backgroundColor: '#EFF4FC',
    alignItems: 'flex-start',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  keyboard: {
    flex: 1,
    justifyContent: 'space-between',
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
    fontSize: 18,
    color: '#131313',
    fontFamily: 'Lato-Bold',
    marginRight: 5,
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
    height: 20,
    resizeMode: 'contain',
    marginTop: 2,
  },

  row: {
    height: 60,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  rowTitle: {
    width: 65,
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    color: '#565656',
    lineHeight: 24,
  },
  rowValue: {
    flex: 1,
    marginTop: 5,
    marginLeft: 12,
    fontSize: 16,
    textAlign: 'left',
    color: 'black',
    marginBottom: 6,
  },
  valueAddress: {
    fontFamily: 'Lato-Bold',
    flex: 1,
    color: 'black',
    marginTop: 8,
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 6,
    marginLeft: 10,
  },
  copyIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  buttonRow: {
    fontFamily: 'Lato-Bold',
    minWidth: 60,
    justifyContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#BBCDEB',
  },
  buttonRowUser: {
    justifyContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#BBCDEB',
    marginLeft: 10,
  },
  textButton: {
    fontFamily: 'Lato-Light',
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
  users2Icon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },

  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  SendImage: {
    width: '100%',
    resizeMode: 'contain',
  },
  buttonSend: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    width: '80%',
    height: 60,
  },
};