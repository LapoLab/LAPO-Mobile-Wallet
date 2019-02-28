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
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import QRCode from 'react-native-qrcode-svg';
import Button from '../../../commons/components/Button';
import * as actionsCommon from '../../../commons/actions';
import * as actions from '../actions';
import styles from './styles';
import { close } from '../../../assets';

const styleScrollView = { backgroundColor: '#EFF4FC' };

type Props = {
  address: string,
  onClose: Function,
  shareRecieve: Function,
  shareOnlyAddress: Function,
};
class Receive extends Component<Props> {
  svg = null;

  handleClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  getDataURL = () => {
    const { address } = this.props;
    if (address) {
      // $FlowFixMe
      this.svg.toDataURL(this.callback);
    }
  };

  shareOnlyAddress = () => {
    const { address, shareOnlyAddress } = this.props;

    if (address) {
      shareOnlyAddress(address);
    }
  };

  callback = (dataURL) => {
    const { address, shareRecieve } = this.props;

    if (address) {
      shareRecieve(address, dataURL);
    }
  };

  render() {
    const { address } = this.props;
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
              <Text style={styles.headerTitle}>Receive</Text>
              <TouchableOpacity style={styles.buttonClose} />
            </View>

            {address !== '' && (
              <ScrollView style={styleScrollView} contentContainerStyle={styleScrollView}>
                <View style={styles.rowQr}>
                  {address !== '' && (
                    <QRCode
                      value={address}
                      size={200}
                      bgColor="black"
                      fgColor="white"
                      getRef={c => (this.svg = c)}
                    />
                  )}

                  <TouchableOpacity onPress={this.shareOnlyAddress}>
                    {address !== '' && <Text style={styles.address}>{address}</Text>}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

            <View style={styles.rowSharedButton}>
              <Button onPress={this.getDataURL} title="SHARE IT!" status="active" />
            </View>
          </View>
        </TouchableHighlight>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  address: state.wallet.address || '',
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    goToOtherWindow: actionsCommon.goToOtherWindow,
    shareRecieve: actions.shareRecieve,
    shareOnlyAddress: actions.shareOnlyAddress,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Receive);
