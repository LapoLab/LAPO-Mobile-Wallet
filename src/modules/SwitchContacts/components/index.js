/**
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import * as actionsCommon from '../../../commons/actions';
import styles from './styles';
import Button from '../../../commons/components/Button';

type Props = {
  // params
  lastTxDetails: string,
  // method
  onClose: Function,
  chooseExistsContact: Function,
  addNewContact: Function,
  setModalTxDetails: Function,
};
class SwitchContacts extends Component<Props> {
  handleAdd = () => {
    const { addNewContact } = this.props;
    addNewContact();
  };

  handleChoose = () => {
    const { chooseExistsContact } = this.props;
    chooseExistsContact();
  };

  handleClose = () => {
    const { onClose, setModalTxDetails, lastTxDetails } = this.props;
    onClose();
    setModalTxDetails(lastTxDetails);
  };

  render() {
    return (
      <TouchableHighlight
        style={styles.GlobalContainer}
        onPress={this.handleClose}
        underlayColor="transparent"
      >
        <TouchableHighlight style={styles.ModalContainer} underlayColor="#EFF4FC">
          <View style={styles.container}>
            <View style={styles.rowSharedButton}>
              <Button onPress={this.handleAdd} title="Add new contact" status="active" />
            </View>

            <View style={styles.rowSharedButton}>
              <Button onPress={this.handleChoose} title="Choose contact" status="active" />
            </View>
          </View>
        </TouchableHighlight>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  lastTxDetails: state.modals.lastTxDetails,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    chooseExistsContact: actions.chooseExistsContact,
    addNewContact: actions.addNewContact,
    setModalTxDetails: actionsCommon.setModalTxDetails,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SwitchContacts);
