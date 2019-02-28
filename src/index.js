// @flow

import React, { Component, Fragment } from 'react';
import {
  StatusBar, AppState, Platform, NativeModules,
} from 'react-native';
import { Provider } from 'react-redux';
// $FlowFixMe
import { PersistGate } from 'redux-persist/integration/react';
import LapoCoreAndroid from 'lapo-core';
// $FlowFixMe
import DeviceInfo from 'react-native-device-info';
import KeepAwake from 'react-native-keep-awake';
import Navigator from './Navigator';
import Loading from './modules/Loading';
import Alert from './modules/Alert';
import NavigationService from './NavigationService';
import { store, persistor } from './redux';
import * as actionsCommon from './commons/actions';
import * as actionsAlert from './modules/Alert/actions';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

if (Platform.OS !== 'ios') {
  // eslint-disable-next-line
  const { Crashlytics } = require('react-native-fabric');
  Crashlytics.setUserIdentifier(DeviceInfo.getUniqueID());
}

const defaultGetStateForAction = Navigator.router.getStateForAction;

Navigator.router.getStateForAction = (action, state) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case 'Navigation/OPEN_DRAWER':
    case 'Navigation/DRAWER_OPENED':
      store.dispatch(actionsCommon.setDrawer(true));
      break;

    case 'Navigation/CLOSE_DRAWER':
    case 'Navigation/DRAWER_CLOSED':
      store.dispatch(actionsCommon.setDrawer(false));
      break;
  }

  return defaultGetStateForAction(action, state);
};

type State = {
  appState: string,
  currentRoute: string,
};
export default class App extends Component<{}, State> {
  state = {
    appState: AppState.currentState,
    currentRoute: '',
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState: string) => {
    const { appState, currentRoute } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      store.dispatch(actionsCommon.setShowSpinner(false));

      if (
        store.getState().wallet.isConfirmPaperWords
        && !store.getState().modals.isGoToOtherWindow
      ) {
        NavigationService.navigate('PinsVerify', { currentRoute });
        LapoCore.reScan();
      }
      if (store.getState().modals.isGoToOtherWindow) {
        store.dispatch(actionsCommon.goToOtherWindow(false));
      }
    }
    if (nextAppState.match(/inactive|background/) && appState === 'active') {
      store.dispatch(actionsAlert.hideAlert());
      store.dispatch(actionsCommon.setShowSpinner(true));
      if (Platform.OS === 'ios') {
        this.setState({ currentRoute: NavigationService.getCurrentRoute().routeName });
      }
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <Fragment>
            <Alert />
            <StatusBar barStyle="light-content" />
            <Navigator
              ref={(navigatorRef) => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
            <KeepAwake />
          </Fragment>
        </PersistGate>
      </Provider>
    );
  }
}
