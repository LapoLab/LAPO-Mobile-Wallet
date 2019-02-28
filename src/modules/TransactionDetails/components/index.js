/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Share from 'react-native-share';
import moment from 'moment';
import calcAmount from '../../../utils/calcAmount';
import * as actions from '../actions';
import Button from '../../../commons/components/Button';
import * as actionsCommon from '../../../commons/actions';
import styles from './styles';
import { close, copyIcon } from '../../../assets';

type Props = {
  saveContact: Function,
  isLoaded: boolean,
  isReady: boolean,
  onClose: Function,
  note: string,
  nameContact: string,
  isLoadingContact: boolean,
  transaction: { address: string, amount: number, time: number, mode: string, status: string },
  getContactFromAddress: Function,
  showContact: Function,
  goToOtherWindow: Function,
};
class TransactionDetails extends Component<Props> {
  componentDidMount() {
    const { getContactFromAddress } = this.props;
    getContactFromAddress();
  }

  svg = null;

  handleClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  shareOnlyAddress = () => {
    const {
      transaction: { address },
      goToOtherWindow,
    } = this.props;

    goToOtherWindow(true);

    const shareImageBase64 = {
      title: 'Lapo address',
      message: address || '',
    };

    // eslint-disable-next-line
    Share.open(shareImageBase64).catch(error => console.log(error));
  };

  handleAddContacts = () => {
    const { saveContact, transaction } = this.props;
    const { address } = transaction || { address: '' };
    saveContact(address);
  };

  handleOpenContact = () => {
    const { showContact, transaction } = this.props;
    const { address } = transaction || { address: '' };

    showContact(address);
  };

  render() {
    const {
      transaction, note, isLoaded, isReady, nameContact, isLoadingContact,
    } = this.props;
    const {
      address, amount, time, mode, status,
    } = transaction || {
      address: '',
      amount: '',
      time: '',
      mode: '',
      status: '',
    };

    return (
      <TouchableHighlight
        style={styles.GlobalContainer}
        onPress={this.handleClose}
        underlayColor="transparent"
      >
        <TouchableHighlight style={styles.container} underlayColor="#EFF4FC">
          <View style={{ flex: 1, width: '100%' }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={this.handleClose} style={styles.buttonClose}>
                <Image style={styles.headerIcon} source={close} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Transaction details</Text>
              <TouchableOpacity style={styles.buttonClose} />
            </View>

            <View style={styles.row}>
              <Text style={styles.rowTitle}>{mode === 'out' ? 'From' : 'To'}</Text>
              <Text style={styles.valueAddress}>{address}</Text>
              <TouchableOpacity onPress={this.shareOnlyAddress}>
                <Image style={styles.copyIcon} source={copyIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowTitle}>Amount</Text>
              <Text
                style={[styles.valueParam, mode === 'out' ? { color: 'green' } : { color: 'red' }]}
              >
                {mode === 'out' ? '+  ' : '-  '}
                {calcAmount.calcAmountLux(amount)}
                {'  LAX'}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowTitle}>Status</Text>
              <Text style={styles.valueParam}>{isLoaded && isReady ? status : '-'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowTitle}>Date</Text>
              <Text style={styles.valueParam}>
                {time > 154262948 ? moment.unix(time).format('DD MMM YYYY - HH:mm') : '-'}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowTitle}>Note</Text>
              <Text style={styles.valueParam}>{note}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowTitle}>Contact</Text>
              <Text style={styles.valueParam}>{nameContact}</Text>
            </View>

            {!isLoadingContact && (
              <Button
                onPress={nameContact === '' ? this.handleAddContacts : this.handleOpenContact}
                title={nameContact === '' ? 'ADD TO CONTACTS' : 'VIEW CONTACT'}
                status={nameContact === '' ? 'active' : 'gray'}
              />
            )}
            {isLoadingContact ? (
              <View style={styles.containerSpiner}>
                <ActivityIndicator size="large" color="#565656" style={styles.spinner} />
              </View>
            ) : null}

          </View>
        </TouchableHighlight>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  isShowSpinner: state.modals.isShowSpinner,
  isLoaded: state.dashboard.maxBlock - state.dashboard.countBlock < 10,
  isReady: state.dashboard.isReady,
  txDetails: state.modals.txDetails || '',
  transaction:
    state.wallet.transactions
    && state.wallet.transactions.find(item => item.id === state.modals.txDetails),
  note: state.wallet.notes[state.modals.txDetails] || '',
  nameContact: state.transactionsDetails.nameContact,
  isLoadingContact: state.transactionsDetails.isLoadingContact,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    saveContact: actions.saveContact,
    showContact: actions.showContact,
    getContactFromAddress: actions.getContactFromAddress,
    goToOtherWindow: actionsCommon.goToOtherWindow,
    // setModalSwitchContacts: actionsCommon.setModalSwitchContacts,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransactionDetails);
