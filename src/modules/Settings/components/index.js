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
import SpinnerPage from '../../../commons/components/SpinnerPage';
import {
  setConfirmPinsRecovery as setConfirmPinsRecoveryAction,
  setPinsRecovery as setPinsRecoveryAction,
  share12Words as share12WordsAction,
  setIsRecovery as setIsRecoveryAction,
  setShowSpinner as setShowSpinnerAction,
} from '../../../commons/actions';
import * as actions from '../actions';
import * as actionsAlert from '../../Alert/actions';

import styles from './styles';
import {
  backIcon, restoreIcon, resetIcon, printPaperWordsIcon, backupIcon,
} from '../../../assets';

type Props = {
  navigation: { openDrawer: Function, dispatch: Function, goBack: Function },
  share12Words: Function,
  recoveryWalletSetting: Function,
  printPublicAddress: Function,
  resyncWalletSetting: Function,
  setIsRecovery: Function,
  isOpenDrawer: boolean,
  showAlert: Function,
  hideAlert: Function,
};
class Settings extends Component<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = async () => {
    const { isOpenDrawer } = this.props;
    if (isOpenDrawer) {
      this.navigateToScreen('Dashboard')();
      return true;
    }
    this.handleGoToBack();
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

  handleBackup = () => {
    const { share12Words } = this.props;
    share12Words();
  };


  handleGoToBack = () => {
    const { navigation: { openDrawer }, setIsRecovery } = this.props;
    setIsRecovery(false);
    openDrawer();
  }

  handleSavePdf = async () => {
    const { printPublicAddress } = this.props;
    printPublicAddress();
  };

  handleRecoveryWallet = async () => {
    const { recoveryWalletSetting } = this.props;
    recoveryWalletSetting();
  };

  handleResync = () => {
    const { resyncWalletSetting, showAlert, hideAlert } = this.props;

    showAlert(
      'Message',
      'Do you want to resync blocks headers? It may take a long time',
      [
        {
          text: 'OK',
          onPress: () => {
            resyncWalletSetting();
            hideAlert();
          },
        },
        {
          text: 'Cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  render() {
    return (
      <LinearGradient
        start={{ x: -0.1, y: -0.1 }}
        end={{ x: 1.2, y: 1.2 }}
        locations={[0.04, 0.96]}
        colors={['#4183BD', '#093B0C']}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={this.handleGoToBack}>
              <Image style={styles.backHeader} source={backIcon} />
            </TouchableOpacity>

            <Text style={styles.titleHeader}>App settings</Text>
          </View>

          <View style={styles.links}>
            <TouchableOpacity style={styles.link} onPress={this.handleRecoveryWallet}>
              <Image style={styles.icon} source={restoreIcon} />
              <View style={styles.info}>
                <Text style={styles.title}>Restore wallet</Text>
                <Text style={styles.subTitle}>Restore a wallet that you previously created</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.line} />

            <TouchableOpacity style={styles.link} onPress={this.handleBackup}>
              <Image style={styles.icon} source={backupIcon} />
              <View style={styles.info}>
                <Text style={styles.title}>Backup wallet</Text>
                <Text style={styles.subTitle}>Backup your wallet</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.line} />

            <TouchableOpacity style={styles.link} onPress={this.handleResync}>
              <Image style={styles.icon} source={resetIcon} />
              <View style={styles.info}>
                <Text style={styles.title}>Reset the blockchain</Text>
                <Text style={styles.subTitle}>Reset the blockchain data stored locally</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.line} />

            <TouchableOpacity style={styles.link} onPress={this.handleSavePdf}>
              <Image style={styles.icon} source={printPaperWordsIcon} />
              <View style={styles.info}>
                <Text style={styles.title}>Print paper wallet</Text>
                <Text style={styles.subTitle}>Save in PDF or print your paper wallet</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <SpinnerPage />
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  pins: state.pins.pins,
  paperWords: state.wallet.paperWords,
  isOpenDrawer: state.modals.isOpenDrawer,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setConfirmPins: setConfirmPinsRecoveryAction,
    setPins: setPinsRecoveryAction,
    setIsRecovery: setIsRecoveryAction,
    setShowSpinner: setShowSpinnerAction,
    share12Words: share12WordsAction,
    recoveryWalletSetting: actions.recoveryWalletSetting,
    resyncWalletSetting: actions.resyncWalletSetting,
    printPublicAddress: actions.printPublicAddress,
    showAlert: actionsAlert.showAlert,
    hideAlert: actionsAlert.hideAlert,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
