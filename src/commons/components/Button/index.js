/**
 * @flow
 */

import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './styles';

type Props = {
  onPress: Function,
  title: string,
  status: 'active' | 'activeLight' | 'gray',
};
export default class Button extends Component<Props> {
  getStyleButton = (): Object => {
    const { status } = this.props;
    if (status === 'active') {
      return styles.buttonReady;
    }

    if (status === 'activeLight') {
      return styles.buttonReadyOtherBorder;
    }

    if (status === 'gray') {
      return styles.grayButton;
    }
    return {};
  };

  render() {
    const { onPress, title } = this.props;
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={this.getStyleButton()} onPress={onPress}>
          <Text style={styles.textButtonReady}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
