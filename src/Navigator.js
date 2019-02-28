// @flow
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';

import { Platform } from 'react-native';

import SideMenu from './modules/SideMenu';
import SplashScreen from './modules/SplashScreen';
import Start from './modules/Start';
import SetupPins from './modules/SetupPins';
import Dashboard from './modules/Dashboard';
import QrCodeScan from './modules/QrCodeScan';
import PaperWords from './modules/PaperWords';
import PaperWordsConfirm from './modules/PaperWordsConfirm';
import PinsVerify from './modules/PinsVerify';
import RecoveryWords from './modules/RecoveryWords';
import Settings from './modules/Settings';
import Profile from './modules/Profile';
import Transactions from './modules/Transactions';
import ChooseContact from './modules/ChooseContact';

const isIOS = Platform.OS === 'ios';

const mainScreen = {
  DashboardStack: createStackNavigator({
    Dashboard: {
      screen: Dashboard,
      headerMode: 'none',
      key: 'Dashboard',
    },
    QrCodeScanSend: {
      screen: QrCodeScan,
      headerMode: 'none',
    },
  },
  { headerMode: 'none' }),

  Settings: {
    screen: Settings,
    headerMode: 'none',
  },
  Transactions: {
    screen: Transactions,
    headerMode: 'none',
  },
  Profile: {
    screen: Profile,
    headerMode: 'none',
  },
  RecoveryWordsStack: createStackNavigator(
    {
      RecoveryWords: {
        screen: RecoveryWords,
        headerMode: 'none',
      },
      QrCodeScan: {
        screen: QrCodeScan,
        headerMode: 'none',
      },
    },
    { headerMode: 'none' },
  ),
  ChooseContact: {
    screen: ChooseContact,
    headerMode: 'none',
  },
};

// $FlowFixMe
export default createAppContainer(
  createSwitchNavigator({
    SplashScreen: {
      screen: SplashScreen,
    },
    Start: {
      screen: Start,
    },

    RecoveryWordsStackStart: createStackNavigator(
      {
        RecoveryWords: {
          screen: RecoveryWords,
          headerMode: 'none',
        },
        QrCodeScan: {
          screen: QrCodeScan,
          headerMode: 'none',
        },
      },
      { headerMode: 'none' },
    ),

    Setup: createStackNavigator(
      {
        SetupPins: {
          screen: SetupPins,
        },
        PaperWords: {
          screen: PaperWords,
        },
        PaperWordsConfirm: {
          screen: PaperWordsConfirm,
        },
      },
      {
        headerMode: 'none',
      },
    ),

    Work: createSwitchNavigator({
      PinsVerify: {
        screen: PinsVerify,
      },
      WorkWithMenu: createDrawerNavigator(
        {
          WorkStack: isIOS
            ? createSwitchNavigator(mainScreen)
            : createStackNavigator(mainScreen, {
              headerMode: 'none',
            }),
        },
        // $FlowFixMe
        {
          contentComponent: SideMenu,
          drawerType: 'slide',
        },
      ),
    }),
  }),
);
