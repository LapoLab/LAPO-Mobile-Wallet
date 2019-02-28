// @flow
import { Platform, Dimensions } from 'react-native';

const d = Dimensions.get('window');
const isX = !!(Platform.OS === 'ios' && (d.height > 800 || d.width > 800));

const marginTopForNotify = () => {
  if (isX) return 176;

  if (Platform.OS === 'ios') return 152;

  return 134;
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
    height: 120,
    marginTop: 30,

    elevation: 6,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 4 },
        shadowColor: 'rgb(0,0,0)',
        shadowOpacity: 0.34,
      },
    }),
    zIndex: 0,
  },
  buttonMenu: {
    height: 18,
  },
  dashboardIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  menuHeader: {
    marginLeft: 8,
    flex: 1,
    width: 18,
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
    flex: 4,
    backgroundColor: '#EFF4FC',
    paddingBottom: 8,
  },

  transactionContainer: {
    flex: 1,
  },
  groupInOut: {
    marginTop: 25,
    marginHorizontal: 30,
    marginBottom: 15,
    flex: 1,
    padding: 2,
    elevation: 10,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 4 },
        shadowColor: 'rgb(0,0,0)',
        shadowOpacity: 0.34,
      },
    }),
    borderRadius: 15,
  },
  headerInOut: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#4183BD',
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
    flex: 1,
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


  RowInOutForNote: {
    marginTop: 5,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  labelNote: {
    fontFamily: 'Lato-Bold',
    fontSize: 12,
  },
  valueNote: {
    fontFamily: 'Lato-Light',
    fontSize: 12,
  },

  rowInOutEmpty: {
    flex: 1,
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
