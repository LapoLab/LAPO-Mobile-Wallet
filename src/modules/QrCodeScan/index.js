/**
 * @flow
 */

import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import {
  BackHandler,
  Platform,
  View,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import * as actionsCommon from '../../commons/actions';
import QRScannerView from './QrScanLib';
import styles from './styles';
import { backIcon } from '../../assets';

type QrCodeScanProps = {
  navigation: Object,
  isRecovery: boolean,
  setModalSend: Function,
};

type QrCodeScanState = {
  isScan: boolean,
};

class QrCodeScan extends Component<QrCodeScanProps, QrCodeScanState> {
  state = {
    isScan: false,
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = () => {
    const {
      navigation: { goBack, navigate },
      setModalSend,
      isRecovery,
    } = this.props;
    if (Platform.OS === 'ios') {
      if (!isRecovery) {
        navigate('Dashboard');
      } else {
        goBack();
      }
    } else {
      goBack();
    }
    if (!isRecovery) {
      setModalSend(true);
    }
    return true;
  };

  barcodeReceived = async ({ data, type }) => {
    const { navigation, isRecovery } = this.props;
    const { isScan } = this.state;
    if (!isScan) {
      await this.setState({ isScan: true });
      const dataArray = data.split(':');
      const dataFormat = dataArray.length > 1 ? dataArray[1] : dataArray[0];
      if (navigation.isFocused()) {
        navigation.state.params.returnData({ data: dataFormat, type });
        if (Platform.OS === 'ios' && !isRecovery) {
          navigation.navigate('Dashboard');
        } else {
          navigation.goBack();
        }
      }
    }
  };

  render() {
    const { isScan } = this.state;
    return (
      <Fragment>
        <LinearGradient
          start={{ x: -0.1, y: -0.1 }}
          end={{ x: 1.2, y: 1.2 }}
          locations={[0.04, 0.96]}
          colors={['#4183BD', '#093B0C']}
          style={{ height: 80 }}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={this.handleBack}>
                <Image style={styles.backHeader} source={backIcon} />
              </TouchableOpacity>

              <Text style={styles.titleHeader}>Scan QR Code</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
        <QRScannerView
          onScanResultReceived={!isScan ? this.barcodeReceived : null}
          hintText=""
          cornerColor="rgba(255, 255, 255, 0.45)"
          cornerBorderWidth={6}
          cornerBorderLength={40}
          rectHeight={236}
          rectWidth={236}
          scanBarColor="rgba(255, 255, 255, 0.25)"
          scanBarHeight={4}
          maskColor="transparent"
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isRecovery: state.settings.isRecovery,
});

const mapDispatchToProps = (dispatch: Function) => bindActionCreators(
  {
    setModalSend: actionsCommon.setModalSend,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QrCodeScan);
