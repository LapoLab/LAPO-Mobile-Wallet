/**
 * @flow
 */

import React, { Component, Fragment } from 'react';
import {
  View,
  Modal,
  Platform,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setModalSend as setModalSendAction,
  setModalReceive as setModalReceiveAction,
  setModalSwitchContacts as setModalSwitchContactsAction,
  setModalTxDetails as setModalTxDetailsAction,
} from '../../../commons/actions';

import * as actionDashboard from '../actions';
import Send from '../../Send';
import Alert from '../../Alert';
import Receive from '../../Receive/components';
import TransactionDetails from '../../TransactionDetails';
import SwitchContacts from '../../SwitchContacts';
import styles from './styles';

type Props = {
  navigation: {
    openDrawer: Function,
    dispatch: Function,
    navigate: Function,
  },
  isModalSend: boolean,
  isModalReceive: boolean,
  txDetails: string,
  isModalSwitchContacts: boolean,
  // methods
  setModalTxDetails: Function,
  setSendAddress: Function,
  setModalSend: Function,
  setModalReceive: Function,
  setModalSwitchContacts: Function,
};
class Modals extends Component<Props> {
  navigateToScreen = route => () => {
    const {
      navigation: { dispatch },
    } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    dispatch(navigateAction);
  };

  handleCLoseModal = () => {
    const {
      setModalReceive, setModalSend, setModalTxDetails, setModalSwitchContacts,
    } = this.props;
    setModalReceive(false);
    setModalSend(false);
    setModalTxDetails('');
    setModalSwitchContacts('');
  };

  returnDataQrCode = ({ data }) => {
    const { setModalSend, setSendAddress } = this.props;
    setModalSend(true);
    setSendAddress(data);
  };

  render() {
    const {
      navigation,
      isModalSend,
      isModalReceive,
      txDetails,
      isModalSwitchContacts,
    } = this.props;

    const modalVisible = isModalSend || isModalReceive || txDetails !== '' || isModalSwitchContacts !== '';

    return (
      <Fragment>
        {modalVisible && <View style={styles.blurBackground} />}

        {modalVisible && (
          <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={this.handleCLoseModal}
          >
            {isModalSend && (
              <Send
                onClose={this.handleCLoseModal}
                returnDataQrCode={this.returnDataQrCode}
                navigation={navigation}
              />
            )}
            {isModalReceive && <Receive onClose={this.handleCLoseModal} navigation={navigation} />}
            {txDetails !== '' && (
              <TransactionDetails onClose={this.handleCLoseModal} navigation={navigation} />
            )}
            {Platform.OS === 'ios' && <Alert />}
            {isModalSwitchContacts !== '' && <SwitchContacts onClose={this.handleCLoseModal} />}
          </Modal>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isModalSend: state.modals.isModalSend,
  isModalReceive: state.modals.isModalReceive,
  txDetails: state.modals.txDetails,
  isModalSwitchContacts: state.modals.isModalSwitchContacts,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setModalSend: setModalSendAction,
    setModalReceive: setModalReceiveAction,
    setModalTxDetails: setModalTxDetailsAction,
    setModalSwitchContacts: setModalSwitchContactsAction,

    setSendAddress: actionDashboard.setSendAddress,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Modals);
