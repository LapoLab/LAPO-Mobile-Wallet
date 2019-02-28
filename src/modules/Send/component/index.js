/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Clipboard,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import * as actionsCommon from '../../../commons/actions';
import SwipeButton from '../../../commons/components/SwipeButton';
import SpinnerPage from '../../../commons/components/SpinnerPage';
import styles from './styles';
import {
  close, qr, Users2Icon, copyIcon,
} from '../../../assets';

type Props = {
  navigation: { dispatch: Function, navigate: Function },
  onClose: Function,
  returnDataQrCode: Function,
  send: Function,
  address: string,
  setAddress: Function,
  setAmount: Function,
  setNote: Function,
  goToOtherWindow: Function,
  address: string,
  amount: string,
  note: string,
};
type State = {
  isShowKeyboard: boolean,
};
export class SendModal extends Component<Props, State> {
  keyboardDidShowListener: Function;

  keyboardDidHideListener: Function;

  state = {
    isShowKeyboard: false,
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = () => {
    this.setState({ isShowKeyboard: true });
  };

  keyboardDidHide = () => {
    this.setState({ isShowKeyboard: false });
  };

  navigateToScreen = (route: string) => () => {
    const {
      navigation: { dispatch },
    } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    dispatch(navigateAction);
  };

  handleChooseContact = () => {
    const {
      navigation: { navigate },
      onClose,
    } = this.props;
    onClose();
    navigate('ChooseContact');
  };

  handleClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleSend = () => {
    const {
      send, amount, address, note,
    } = this.props;

    send(address, amount, note);
  };

  handleChangeAddress = (e: string) => {
    const { setAddress } = this.props;
    setAddress(e);
  };

  handleChangeAmount = (e: string) => {
    const { setAmount, amount } = this.props;
    if (e.length === 1 && e === '0' && amount.length === 0) {
      setAmount('0.');
    } else {
      setAmount(
        e
          .replace(/,/g, '.')
          .replace(/,,/g, '.')
          .replace(/\.\./g, '.'),
      );
    }
  };

  handleChangeNote = (e: string) => {
    const { setNote } = this.props;
    setNote(e);
  };

  handlePaste = async () => {
    const { setAddress } = this.props;
    const content = await Clipboard.getString();
    setAddress(content || '');
  };

  handleScanQrCode = () => {
    const {
      navigation: { navigate },
      onClose,
      returnDataQrCode,
      setAddress,
      goToOtherWindow,
    } = this.props;
    goToOtherWindow(true);
    setAddress('');
    onClose();
    navigate('QrCodeScanSend', { returnData: returnDataQrCode });
  };

  handleCloseKeyboard = () => {
    const { isShowKeyboard } = this.state;
    if (isShowKeyboard) {
      Keyboard.dismiss();
    }
  };

  render() {
    const {
      address, amount, note,
    } = this.props;
    return (
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
      >
        <TouchableHighlight
          style={styles.GlobalContainer}
          onPress={this.handleClose}
          underlayColor="transparent"
        >
          <TouchableHighlight
            style={styles.container}
            onPress={this.handleCloseKeyboard}
            underlayColor="#EFF4FC"
          >
            <View style={{ flex: 1, width: '100%' }}>
              <View style={styles.header}>
                <TouchableOpacity onPress={this.handleClose} style={styles.buttonClose}>
                  <Image style={styles.headerIcon} source={close} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Send</Text>
                <TouchableOpacity onPress={this.handleScanQrCode}>
                  <Image style={styles.headerIconRight} source={qr} />
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowTitle}>To</Text>
                <TextInput
                  style={styles.valueAddress}
                  value={address}
                  autoCapitalize="none"
                  onChangeText={this.handleChangeAddress}
                />
                <TouchableOpacity style={styles.buttonRowUser} onPress={this.handlePaste}>
                  <Image style={styles.copyIcon} source={copyIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonRowUser} onPress={this.handleChooseContact}>
                  <Image style={styles.users2Icon} source={Users2Icon} />
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowTitle}>Amount</Text>
                <TextInput
                  style={styles.valueAddress}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={this.handleChangeAmount}
                />
                <TouchableOpacity style={styles.buttonRow}>
                  <Text style={styles.textButton}>LAX</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowTitle}>Note</Text>
                <TextInput
                  style={styles.valueAddress}
                  value={note}
                  onChangeText={this.handleChangeNote}
                />
              </View>

              <View style={styles.buttonContainer}>
                <SwipeButton onUnlock={this.handleSend} />
              </View>
            </View>
          </TouchableHighlight>
        </TouchableHighlight>

        <SpinnerPage />
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  address: state.send.address,
  amount: state.send.amount,
  note: state.send.note,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    send: actions.send,
    setAddress: actions.setSendAddress,
    setAmount: actions.setSendAmount,
    setNote: actions.setSendNote,
    goToOtherWindow: actionsCommon.goToOtherWindow,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SendModal);
