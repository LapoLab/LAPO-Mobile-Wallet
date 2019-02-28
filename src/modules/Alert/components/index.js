/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text, View, Modal, TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
  // $FlowFixMe
} from 'react-native-popup-dialog';
import * as actions from '../actions';
import styles from './styles';

type Props = {
  title: string,
  content: string,
  buttons: Array<{ text: string, onPress: Function }>,
  isShow: boolean,
  hideAlert: Function,
};
export class AlertModal extends Component<Props> {
  handleClose = () => {
    const { hideAlert, buttons } = this.props;
    hideAlert();
    if (buttons && buttons.length === 1 && buttons[0].onPress) {
      buttons[0].onPress();
    }
  };

  render() {
    const {
      title, content, isShow, buttons,
    } = this.props;

    return (
      <Modal transparent animationType="fade" visible={isShow} onRequestClose={this.handleClose}>
        <TouchableHighlight
          style={styles.GlobalContainer}
          onPress={this.handleClose}
          underlayColor="transparent"
        >
          <View style={styles.container}>
            <View style={styles.content}>
              <DialogTitle
                title={title}
                style={{
                  padding: 20,
                }}
                hasTitleBar={false}
                align="left"
              />
              <DialogContent style={styles.content}>
                <Text style={styles.contentText}>{content}</Text>
              </DialogContent>
              <DialogFooter>
                {buttons.map(item => (
                  <DialogButton
                    key={item.text}
                    text={item.text}
                    style={{
                      padding: 0,
                      borderRadius: 12,
                    }}
                    textStyle={{
                      color: 'gray',
                      fontSize: 14,
                    }}
                    onPress={item.onPress || this.handleClose}
                  />
                ))}
              </DialogFooter>
            </View>
          </View>
        </TouchableHighlight>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  title: state.alert.title,
  content: state.alert.content,
  buttons: state.alert.buttons,
  isShow: state.alert.isShow,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    hideAlert: actions.hideAlert,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AlertModal);
