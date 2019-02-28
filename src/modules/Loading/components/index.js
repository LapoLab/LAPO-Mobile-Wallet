/**
 * @flow
 */

import React, { Component } from 'react';
import {
  View, Image, ImageBackground, SafeAreaView,
} from 'react-native';
import {
  Logo, BackgoundImage,
} from '../../../assets';
import styles from './styles';

export default class Loading extends Component<{}> {
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
