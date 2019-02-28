// @flow
import { Platform, Dimensions } from 'react-native';

const d = Dimensions.get('window');
const isX = !!(Platform.OS === 'ios' && (d.height > 800 || d.width > 800));

export default {
  GlobalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  container: {
    height: 510,
    width: '100%',
    backgroundColor: '#EFF4FC',
    alignItems: 'flex-start',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 0,
  },
  header: {
    height: 60,
    paddingRight: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
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
    width: 70,
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
  copyIcon: {
    width: 20,
    resizeMode: 'contain',
  },
  valueAddress: {
    fontFamily: 'Lato-Regular',
    flex: 1,
    color: 'black',
    marginTop: 8,
    ...Platform.select({
      ios: {
        fontSize: isX ? 10 : 8,
      },
      android: {
        fontSize: 10,
      },
    }),
    textAlign: 'left',
    marginBottom: 6,
    marginLeft: 10,
  },
  valueParam: {
    fontFamily: 'Lato-Regular',
    flex: 1,
    color: 'black',
    marginTop: 8,
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 8,
    marginLeft: 10,
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
  textButton: {
    fontFamily: 'Lato-Light',
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },

  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonReady: {
    width: '80%',
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#4183BD',
    borderRadius: 74,
    borderColor: '#BBCDEB',
    borderWidth: 8,
  },
  textButtonReady: {
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    color: 'white',
  },
  containerSpiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
