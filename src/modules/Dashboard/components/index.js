/**
 * @flow
 */

import React, { Component, Fragment } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import {
  setModalSend as setModalSendAction,
  setModalReceive as setModalReceiveAction,
  setBalance as setBalanceAction,
  setAddress as setAddressAction,
  setTransactions as setTransactionsAction,
  setModalTxDetails as setModalTxDetailsAction,
  closeApp as closeAppAction,
} from '../../../commons/actions';
import SpinnerPage from '../../../commons/components/SpinnerPage';
import * as actionNotify from '../../Notify/actions';
import * as actionAlert from '../../Alert/actions';
import * as actionDashboard from '../actions';

import Modals from './Modals';

import Balance from './Balance';
import Transactions from './Transactions';
import Notify from '../../Notify/component';
import styles from './styles';
import {
  menuIcon,
  ActivityIcon,
  iconNotifyActive,
  dashboardIcon,
  iconSend,
  iconRecieve,
} from '../../../assets';

type Props = {
  isModalSend: boolean,
  isModalReceive: boolean,
  txDetails: string,
  navigation: {
    openDrawer: Function,
    closeDrawer: Function,
    dispatch: Function,
    navigate: Function,
  },
  setModalSend: Function,
  getContacts: Function,
  setModalReceive: Function,
  showAlert: Function,
  transactions: [Object],
  setVisibleNotify: Function,
  isVisibleNotify: boolean,
  timeNotifyLast: number,
  getInfo: Function,
  closeApp: Function,
  isStartGetInfo: boolean,
  isOpenDrawer: boolean,
  isModalSwitchContacts: boolean,
};

class Dashboard extends Component<Props> {
  componentDidMount() {
    const { getInfo, isStartGetInfo, getContacts } = this.props;

    getContacts();

    if (!isStartGetInfo) getInfo();
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = async () => {
    const {
      closeApp,
      isOpenDrawer,
      showAlert,
      navigation: { closeDrawer },
    } = this.props;

    if (isOpenDrawer) {
      closeDrawer();
      return true;
    }

    // showAlert();
    showAlert(
      'Confirm Exit',
      'Do you really want to exit the app?',
      // eslint-disable-next-line
      [{ text: 'OK', onPress: () => closeApp() }, { text: 'CANCEL' }],
      {
        cancelable: true,
      },
    );
    return true;
  };

  handleShowMenu = () => {
    const {
      navigation: { openDrawer },
    } = this.props;
    openDrawer();
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

  handleSend = () => {
    const { setModalSend } = this.props;
    setModalSend(true);
  };

  handleRecieve = async () => {
    const { setModalReceive } = this.props;
    setModalReceive(true);
  };

  handleShowNotify = () => {
    const { setVisibleNotify, isVisibleNotify } = this.props;
    setVisibleNotify(!isVisibleNotify);
  };

  render() {
    const {
      navigation,
      isVisibleNotify,
      transactions,
      timeNotifyLast,
      isModalSend,
      isModalReceive,
      txDetails,
      isModalSwitchContacts,
    } = this.props;

    const txsWithoutOut = transactions.filter(item => item.mode === 'out');

    const isNotifyActive = !!(
      txsWithoutOut.length > 0 && txsWithoutOut[txsWithoutOut.length - 1].time > timeNotifyLast
    );

    const modalVisible = isModalSend || isModalReceive || (txDetails !== '' && isModalSwitchContacts !== '');

    return (
      <Fragment>
        <LinearGradient
          start={{ x: -0.1, y: -0.1 }}
          end={{ x: 1.2, y: 1.2 }}
          locations={[0, 1]}
          colors={['#4183BD', '#093B0C']}
          style={{ flex: 1, width: '100%' }}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.buttonMenu} onPress={this.handleShowMenu}>
                <Image style={styles.menuHeader} source={menuIcon} />
              </TouchableOpacity>

              <Image source={dashboardIcon} style={styles.dashboardIcon} />

              <TouchableOpacity style={styles.buttonNotify} onPress={this.handleShowNotify}>
                <Image
                  style={styles.notifyHeader}
                  source={isNotifyActive ? iconNotifyActive : ActivityIcon}
                />
              </TouchableOpacity>
            </View>

            <Balance />

            <View style={styles.body}>
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.buttonLeft} onPress={this.handleSend}>
                  <Image style={styles.iconSend} source={iconSend} />
                  <Text style={styles.textSend}>SEND</Text>
                </TouchableOpacity>

                <View style={styles.line} />

                <TouchableOpacity style={styles.buttonRight} onPress={this.handleRecieve}>
                  <Image style={styles.iconRecieve} source={iconRecieve} />
                  <Text style={styles.textRecieve}>RECEIVE</Text>
                </TouchableOpacity>
              </View>

              <Transactions />
            </View>
          </SafeAreaView>

          <View style={styles.bottomPlaceForX} />

          {isVisibleNotify && <Notify />}

          {!modalVisible && <SpinnerPage />}
        </LinearGradient>
        <Modals navigation={navigation} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isModalSend: state.modals.isModalSend,
  isModalReceive: state.modals.isModalReceive,
  txDetails: state.modals.txDetails,
  transactions: state.wallet.transactions,
  isVisibleNotify: state.notify.isVisibleNotify,
  timeNotifyLast: state.notify.timeLast,
  isOpenDrawer: state.modals.isOpenDrawer,
  isModalSwitchContacts: state.modals.isModalSwitchContacts,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setBalance: setBalanceAction,
    setAddress: setAddressAction,
    setTransactions: setTransactionsAction,
    setModalSend: setModalSendAction,
    setModalReceive: setModalReceiveAction,
    setModalTxDetails: setModalTxDetailsAction,

    setVisibleNotify: actionNotify.setVisibleNotify,
    setTimeNotify: actionNotify.setTimeNotify,

    getInfo: actionDashboard.getInfoAboutWallet,
    closeApp: closeAppAction,
    getContacts: actionDashboard.getContacts,
    showAlert: actionAlert.showAlert,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
