// require('react-native-mock-render/mock');

jest.useFakeTimers();

jest.mock('lapo-core', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  setPhrase: jest.fn(),
  copyDB: jest.fn(),
  createWallet: jest.fn(),
  isLoadWallet: jest.fn().mockReturnValue(true),
  connectPeers: jest.fn(),
  setPathDB: jest.fn(),
  lapoName: jest.fn(),
  isReady: jest.fn(),
  getBalance: jest.fn(),
  getReceiveAddress: jest.fn(),
  getLastBlockHeight: jest.fn(),
  getTransactions: jest.fn(),
  closeApp: jest.fn(),
  resync: jest.fn(),
  newTransaction: jest.fn(),
  // createPDF: jest.fn().mockReturnValue('path'),
}));
jest.mock('react-native-camera', () => ({ RNCamera: jest.fn() }));
jest.mock('react-native-share', () => 'react-native-share');
jest.mock('react-native-notifications', () => ({
  NotificationsAndroid: {

  },
  PendingNotifications: {
    getInitialNotification: () => ({ then: () => ({ catch: jest.fn() }) }),
  },
}));
jest.mock('BackHandler', () => ({
  addEventListener: () => {},
}));

jest.mock('react-navigation', () => ({
  NavigationActions: jest.fn(),
  StackNavigator: jest.fn(),
  TabNavigator: () => {},
  Header: {
    HEIGHT: 0,
  },
}));

jest.mock('Platform', () => {
  const Platform = require.requireActual('Platform');
  Platform.OS = 'android';
  return Platform;
});

jest.mock('Alert', () => ({
  alert: () => {},
}));

jest.mock('react-native-splash-screen', () => ({
  hide: () => {},
}));

jest.mock('static-container', () => ({
  alert: () => {},
}));

jest.mock('PermissionsAndroid', () => ({
  RESULTS: {
    GRANTED: '',
  },
  PERMISSIONS: {
    WRITE_EXTERNAL_STORAGE: '',
    READ_CONTACTS: '',
  },
  request: () => {},
}));
