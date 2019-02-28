/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  Linking,
  BackHandler,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setConfirmPins as setConfirmPinsAction,
  setPins as setPinsAction,
  createWallet as createWalletAction,
  setIsRecovery as setIsRecoveryAction,
  closeApp as closeAppAction,
} from '../../../commons/actions';
import { Logo, BackgoundImage } from '../../../assets';
import styles from './styles';

type Props = {
  navigation: {
    dispatch: Function,
  },
  setConfirmPins: Function,
  setPins: Function,
  setIsRecovery: Function,
  closeApp: Function,
};
class Start extends Component<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = async () => {
    const { closeApp } = this.props;
    closeApp();
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

  handleCreateWallet = async () => {
    const { setConfirmPins, setPins, setIsRecovery } = this.props;
    setConfirmPins('');
    setPins('');
    setIsRecovery(false);

    this.navigateToScreen('SetPins')();
  };

  handleRecoveryWallet = () => {
    const { setConfirmPins, setPins, setIsRecovery } = this.props;
    setConfirmPins('');
    setPins('');
    setIsRecovery(true);

    this.navigateToScreen('SetPins')();
  };

  handleGoToFaqClick = () => {
    const url = 'http://support.lapo.io/?sid=17858';
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // eslint-disable-next-line
        console.log(`Don't know how to open URI: ${url}`);
      }
    });
  };

  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={BackgoundImage}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Image style={styles.imgLogo} source={Logo} />
          </View>

          <View style={styles.groupButtons}>

            <TouchableOpacity style={styles.buttonMain} onPress={this.handleCreateWallet}>
              <Text style={styles.textButton}>CREATE A NEW WALLET</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.buttonRecovery} onPress={this.handleRecoveryWallet}>
              <Text style={styles.textButton}>RECOVER AN EXISTING WALLET</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.helpFooter}>Need any help?</Text>
            <TouchableOpacity onPress={this.handleGoToFaqClick}>
              <Text style={styles.faqFooter}>FAQ</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    createWallet: createWalletAction,
    setConfirmPins: setConfirmPinsAction,
    setPins: setPinsAction,
    setIsRecovery: setIsRecoveryAction,
    closeApp: closeAppAction,
  },
  dispatch,
);

export default connect(
  null,
  mapDispatchToProps,
)(Start);
