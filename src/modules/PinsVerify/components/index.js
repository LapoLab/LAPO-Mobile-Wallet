/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  BackHandler,
  AppState,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LapoCoreAndroid from 'lapo-core';
import * as actions from '../../../commons/actions';
import * as actionsAlert from '../../Alert/actions';
import styles from './styles';
import Pis from '../../../commons/components/Pins';
import SpinnerPage from '../../../commons/components/SpinnerPage';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

type Props = {
  navigation: {
    openDrawer: Function,
    dispatch: Function,
    navigate: Function,
    state: { params: { currentRoute: string } },
  },
  pins: string,
  isStartGetInfo: boolean,
  loadWallet: Function,
  showAlert: Function,
  hideAlert: Function,
  setShowSpinner: Function,
};
type State = {
  pinsVerify: string,
  appState: string,
};
class PinsVerify extends Component<Props, State> {
  state = {
    pinsVerify: '',
    appState: AppState.currentState,
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState: string) => {
    const { appState } = this.state;
    if (nextAppState.match(/inactive|background/) && appState === 'active') {
      this.setState({ pinsVerify: '' });
    }
    this.setState({ appState: nextAppState });
  };

  handleBack = () => {
    LapoCore.disconnect();
    BackHandler.exitApp();
    return true;
  };

  navigateToScreen = route => () => {
    const {
      navigation: { dispatch },
    } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    dispatch(navigateAction);
  };

  handleChangePin = async (value) => {
    const {
      pins: pinsOriginal,
      loadWallet,
      navigation,
      showAlert,
      hideAlert,
      setShowSpinner,
      isStartGetInfo,
    } = this.props;
    const { pinsVerify } = this.state;

    if (value === 'delete') {
      this.setState({ pinsVerify: pinsVerify.slice(0, pinsVerify.length - 1) });
      return;
    }

    const curPins = pinsVerify.length < 6 ? `${pinsVerify}${value}` : pinsVerify;

    this.setState({ pinsVerify: curPins });

    if (curPins.length === 6 && pinsOriginal === curPins) {
      setShowSpinner(true);
      if (isStartGetInfo) {
        navigation.navigate(
          navigation.state.params.currentRoute
            && navigation.state.params.currentRoute !== 'PinsVerify'
            ? navigation.state.params.currentRoute
            : 'WorkStack',
        );
        setShowSpinner(false);
      } else {
        loadWallet();
      }
    } else if (curPins.length === 6) {
      showAlert(
        'Error',
        'Wrong password',
        // eslint-disable-next-line
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState({ pinsVerify: '' });
              hideAlert();
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    }
  };

  render() {
    const { pinsVerify } = this.state;
    return (
      <LinearGradient
        start={{ x: -0.1, y: -0.1 }}
        end={{ x: 1.2, y: 1.2 }}
        locations={[0, 1]}
        colors={['#4183BD', '#093B0C']}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titleHeader}>Unlock your wallet</Text>
          </View>

          <View style={styles.pins}>
            <Pis pins={pinsVerify} onChange={this.handleChangePin} />
          </View>
        </SafeAreaView>
        <SpinnerPage />
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  pins: state.pins.pins,
  isStartGetInfo: state.dashboard.isStartGetInfo,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    loadWallet: actions.loadWallet,
    showAlert: actionsAlert.showAlert,
    hideAlert: actionsAlert.hideAlert,
    setShowSpinner: actions.setShowSpinner,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PinsVerify);
