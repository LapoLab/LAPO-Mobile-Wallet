/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, Image, SafeAreaView, BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './styles';
import {
  setConfirmPins as setConfirmPinsAction,
  setPins as setPinsAction,
  setConfirmPinsRecovery as setConfirmPinsRecoveryAction,
  setPinsRecovery as setPinsRecoveryAction,
} from '../../../../commons/actions';
import SpinnerPage from '../../../../commons/components/SpinnerPage';
import Pis from '../../../../commons/components/Pins';

import { backIcon, Indicator2Icon, Dot2s } from '../../../../assets';

type Props = {
  navigation: { goBack: Function, dispatch: Function },
  pins: string,
  pinsConfirm: string,
  setConfirmPins: Function,
  setPinsRecovery: Function,
  setConfirmPinsRecovery: Function,
  setPins: Function,
  isRecovery: boolean,
};

class ConfirmPins extends Component<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.navigateToBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.navigateToBack);
  }

  navigateToBack = () => {
    const {
      navigation: { goBack },
      setConfirmPins,
      setPins,
      setConfirmPinsRecovery,
      setPinsRecovery,
    } = this.props;
    setConfirmPins('');
    setPins('');
    setConfirmPinsRecovery('');
    setPinsRecovery('');
    goBack();
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

  handleChangePin = (value) => {
    const {
      pins,
      pinsConfirm,
      setConfirmPins,
      setPins,
      isRecovery,
      setPinsRecovery,
      setConfirmPinsRecovery,
    } = this.props;

    if (value === 'delete') {
      if (isRecovery) {
        setConfirmPinsRecovery(pinsConfirm.slice(0, pinsConfirm.length - 1));
      } else {
        setConfirmPins(pinsConfirm.slice(0, pinsConfirm.length - 1));
      }
      return;
    }

    const newPins = `${pinsConfirm}${value}`;

    if (newPins.length <= 6) {
      if (isRecovery) {
        setConfirmPinsRecovery(newPins);
      } else {
        setConfirmPins(newPins);
      }
    }

    if (newPins.length === 6 && pins === newPins) {
      if (isRecovery) {
        this.navigateToScreen('RecoveryWordsStackStart')();
      } else {
        this.navigateToScreen('PaperWords')();
      }
    } else if (newPins.length === 6 && newPins !== pinsConfirm) {
      if (isRecovery) {
        setConfirmPinsRecovery('');
        setPinsRecovery('');
      } else {
        setConfirmPins('');
        setPins('');
      }
      this.navigateToScreen('SetPins')();
    }
  };

  render() {
    const { pinsConfirm, isRecovery } = this.props;
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
            <TouchableOpacity onPress={this.navigateToBack}>
              <Image style={styles.backHeader} source={backIcon} />
            </TouchableOpacity>

            <Text style={styles.titleHeader}>Confirm the PIN</Text>
          </View>

          <View style={styles.indicator}>
            <Image style={styles.indicatorIcon} source={isRecovery ? Dot2s : Indicator2Icon} />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Your pin will be used to unlock your wallet</Text>
          </View>

          <View style={styles.pins}>
            <Pis onChange={this.handleChangePin} pins={pinsConfirm} />
          </View>
          <SpinnerPage />
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  pins: state.settings.isRecovery ? state.pinsRecovery.pinsRecovery : state.pins.pins,
  pinsConfirm: state.settings.isRecovery
    ? state.pinsRecovery.pinsConfirmRecovery
    : state.pins.pinsConfirm,
  isRecovery: state.settings.isRecovery,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setConfirmPins: setConfirmPinsAction,
    setPins: setPinsAction,
    setConfirmPinsRecovery: setConfirmPinsRecoveryAction,
    setPinsRecovery: setPinsRecoveryAction,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmPins);
