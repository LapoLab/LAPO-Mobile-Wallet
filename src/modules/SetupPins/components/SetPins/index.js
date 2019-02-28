/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './styles';
import {
  setPins as setPinsAction,
  setPinsRecovery as setPinsRecoveryAction,
} from '../../../../commons/actions';
import Pis from '../../../../commons/components/Pins';
import SpinnerPage from '../../../../commons/components/SpinnerPage';
import {
  backIcon, IndicatorIcon, Dot1s,
} from '../../../../assets';

type Props = {
  navigation: { openDrawer: Function, dispatch: Function, goBack: Function },
  pins: string,
  setPins: Function,
  isRecovery: boolean,
  setPinsRecovery: Function,
  isConfirmPaperWords: boolean,
};
class SetPins extends Component<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  navigateToScreen = route => () => {
    const {
      navigation: { dispatch },
    } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    dispatch(navigateAction);
  };

  handleBack = () => {
    const {
      isRecovery,
      isConfirmPaperWords,
    } = this.props;
    if (isRecovery && isConfirmPaperWords) {
      this.navigateToScreen('Settings')();
    } else {
      this.navigateToScreen('Start')();
    }
    return true;
  }

  handleChangePin = (value) => {
    const {
      pins, setPins, isRecovery, setPinsRecovery,
    } = this.props;
    if (value === 'delete') {
      if (isRecovery) {
        setPinsRecovery(pins.slice(0, pins.length - 1));
      } else {
        setPins(pins.slice(0, pins.length - 1));
      }
      return;
    }
    if (pins.length <= 5) {
      if (isRecovery) {
        setPinsRecovery(`${pins}${value}`);
      } else {
        setPins(`${pins}${value}`);
      }
    }
    if (pins.length >= 5) {
      this.navigateToScreen('ConfirmPins')();
    }
  };

  render() {
    const { pins, isRecovery } = this.props;
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
            <TouchableOpacity onPress={this.handleBack}>
              <Image style={styles.backHeader} source={backIcon} />
            </TouchableOpacity>

            <Text style={styles.titleHeader}>Set PIN</Text>
          </View>

          <View style={styles.indicator}>
            <Image style={styles.indicatorIcon} source={isRecovery ? Dot1s : IndicatorIcon} />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Your pin will be used to unlock your wallet</Text>
          </View>

          <View style={styles.pins}>
            <Pis pins={pins} onChange={this.handleChangePin} />
          </View>
          <SpinnerPage />
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  pins: state.settings.isRecovery ? state.pinsRecovery.pinsRecovery : state.pins.pins,
  isRecovery: state.settings.isRecovery,
  isConfirmPaperWords: state.wallet.isConfirmPaperWords,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setPins: setPinsAction,
    setPinsRecovery: setPinsRecoveryAction,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SetPins);
