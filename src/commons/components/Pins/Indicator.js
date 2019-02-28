/**
 * @flow
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import styles from './styles';

type Props = {
  pins: string,
};
class Indicator extends Component<Props> {
  render() {
    const { pins } = this.props;
    const fillPinsLength = pins && pins.length ? pins.length : 0;
    const emptyPinsLength = 6 - fillPinsLength;
    return (
      <View style={styles.containerIndicator}>
        <View style={styles.rowIndicator}>
          {fillPinsLength > 0
            && fillPinsLength < 7
            && Array(fillPinsLength)
              .fill()
              .map((item, index) => (
                <View
                  style={styles.indicatorFillCircle}
                  // eslint-disable-next-line
                  key={`fill-${index}`}
                />
              ))}
          {emptyPinsLength > 0
            && emptyPinsLength < 7
            && Array(emptyPinsLength)
              .fill()
              .map((item, index) => (
                <View
                  style={styles.indicatorEmptyCircle}
                  // eslint-disable-next-line
                  key={`empty-${index}`}
                />
              ))}
        </View>
      </View>
    );
  }
}

export default Indicator;
