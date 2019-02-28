// @flow
import { Platform, Dimensions } from 'react-native';

const d = Dimensions.get('window');
const isX = !!(Platform.OS === 'ios' && (d.height > 800 || d.width > 800));

const marginTopForNotify = () => {
  if (isX) return 176;

  if (Platform.OS === 'ios') return 152;

  return 134;
};

const topForBalance = () => {
  if (isX) return 196;
  if (Platform.OS === 'ios') return 174;
  return 156;
};

export default {
  container: {
    flex: 1,
    zIndex: 0,
  },

  header: {
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 170,
    marginTop: 30,

    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 4 },
        shadowColor: 'rgb(0,0,0)',
        shadowOpacity: 0.34,
      },
    }),
    elevation: 6,
    zIndex: 0,
  },
  buttonMenu: {
    paddingRight: 15,
    paddingBottom: 15,
  },
  dashboardIcon: {
    marginRight: 15,
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  menuHeader: {
    marginLeft: 8,
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  buttonNotify: {
    height: 18,
  },
  notifyHeader: {
    marginRight: 8,
    flex: 1,
    width: 18,
    resizeMode: 'contain',
  },

  body: {
    flex: 3,
    backgroundColor: '#EFF4FC',
    paddingBottom: 6,
    // borderWidth: 1,
    zIndex: 0,
  },

  balance: {
    position: 'absolute',
    top: topForBalance(),
    zIndex: 1,
    height: 80,
    left: 30,
    right: 30,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,

    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 4 },
        shadowColor: 'rgb(0,0,0)',
        shadowOpacity: 0.34,
      },
    }),
    elevation: 10,
  },
  balanceColor: {
    backgroundColor: '#4183BD',
  },

  main: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textMain: {
    fontFamily: 'Lato-Bold',
    color: 'white',
    fontSize: 26,
  },
  sub: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textSub: {
    fontFamily: 'Lato-Light',
    color: 'white',
    fontSize: 14,
  },

  buttonGroup: {
    marginTop: 35,
    // marginBottom: 5,
    height: 150,
    flexDirection: 'row',
  },
  buttonLeft: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  line: {
    marginTop: 30,
    width: 1,
    height: 100,
    borderRightWidth: 1,
    borderRightColor: '#BCB8B8',
  },
  iconSend: {
    marginTop: 25,
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  textSend: {
    fontFamily: 'Lato-Light',
    color: '#4183BD',
    fontSize: 16,
    marginTop: 14,
  },
  buttonRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRecieve: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginTop: 5,
  },
  textRecieve: {
    color: '#7C8991',
    fontFamily: 'Lato-Light',
    fontSize: 16,
    marginTop: 10,
  },

  transactionContainer: {
    flex: 1,
  },
  groupInOut: {
    backgroundColor: 'transparent',
    marginHorizontal: 28,
    marginBottom: 44,
    elevation: 10,
    borderRadius: 15,
    // borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 4 },
        shadowColor: 'rgb(0,0,0)',
        shadowOpacity: 0.34,
      },
    }),

  },
  headerInOut: {
    backgroundColor: '#4183BD',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  activeColumn: {
    height: 50,
    flexDirection: 'column',
    borderWidth: 1,
  },
  textInOutActive: {
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    color: 'white',
  },
  iconActiveInOut: {
    height: 12,
    resizeMode: 'contain',
    marginRight: 26,
  },
  iconInComeActiveInOut: {
    height: 12,
    resizeMode: 'contain',
    marginRight: 34,
    paddingRight: 20,
  },
  iconOutComeActiveInOut: {
    height: 12,
    resizeMode: 'contain',
    marginRight: 32,
  },
  textInOut: {
    fontFamily: 'Lato-Light',
    fontSize: 18,
    color: 'white',
    opacity: 0.7,
  },
  activeIconColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconColumn2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 26,
  },

  conrainerTriangle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  bodyInOut: {
    backgroundColor: 'white',
    minHeight: 116,

    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  rowInOut: {
    paddingVertical: 15,
    marginHorizontal: 10,
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
    flexDirection: 'column',
  },

  RowInOut: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  colRightInOut: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  titleIn: {
    fontFamily: 'Lato-Regular',
    color: '#36A54D',
    fontSize: 16,
  },
  titleOut: {
    fontFamily: 'Lato-Regular',
    color: '#D64343',
    fontSize: 16,
  },
  subTitleInOutLeft: {
    fontFamily: 'Lato-Light',
    fontSize: 14,
    opacity: 0.6,
  },
  subTitleInOutRight: {
    fontFamily: 'Lato-Light',
    fontSize: 10,
    opacity: 0.6,
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
  notify: {
    position: 'absolute',
    top: marginTopForNotify(),
    height: 20,
    width: '100%',
  },
  notifyText: {
    fontFamily: 'Lato-Light',
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },

  rowInOutEmpty: {
    flex: 1,
    paddingVertical: 25,

    alignItems: 'center',
    justifyContent: 'center',
  },
  textEmpty: {
    fontFamily: 'Lato-Light',
    marginBottom: 12,
  },

  bottomPlaceForX: {
    backgroundColor: '#EFF4FC',
    height: isX ? 36 : 0,
  },
};
