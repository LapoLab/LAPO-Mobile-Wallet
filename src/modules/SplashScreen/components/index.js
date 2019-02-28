/**
 * @flow
 */

import React, { Component } from 'react';
import {
  View, Image, ImageBackground, SafeAreaView, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// $FlowFixMe
import SplashScreen from 'react-native-splash-screen';
import { Logo, BackgoundImage } from '../../../assets';
import styles from './styles';

type Props = {};
class SplashScreenPage extends Component<Props> {
  componentDidMount() {
    if (Platform.OS !== 'ios') {
      SplashScreen.hide();
    }
  }

  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={BackgoundImage}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Image style={styles.imgLogo} source={Logo} />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SplashScreenPage);
