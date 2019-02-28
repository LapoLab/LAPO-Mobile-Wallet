/**
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  PanResponder,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import send from '../../../assets/sendButton.png';
import styles from './styles';

const { width: widthWindow } = Dimensions.get('window');

type Props = {
  onUnlock: Function,
};
type State = {
  pos: number,
};
class SwipeButton extends Component<Props, State> {
  _panResponder: Function;

  constructor(props: Props) {
    super(props);
    const { onUnlock } = props;
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderMove: (evt, gestureState) => {
        const pos = Math.abs((gestureState.dx * 100) / widthWindow) + 10;
        if (pos <= 84) {
          this.setState({ pos });
        }
        if (pos > 84 && !this.isActive) {
          onUnlock();
          this.setState({ pos: 0 });
          this.isActive = true;
        }
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: () => {
        this.setState({ pos: 0 });
        this.isActive = false;
      },
      onShouldBlockNativeResponder: () => true,
    });
  }

  state = {
    pos: 0,
  };

  isActive = false;

  render() {
    const { pos } = this.state;
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.textSlideToSend}>SLIDE TO SEND</Text>
        </View>
        {pos > 5 && (
          <View
            style={{
              ...styles.backgroundActive,
              width: `${pos + 17}%`,
            }}
          />
        )}
        <View
          style={{
            ...styles.button,
            marginLeft: `${pos - 1}%`,
          }}
          {...this._panResponder.panHandlers}
        >
          <Image style={styles.SendImage} source={send} />
        </View>
      </View>
    );
  }
}

export default SwipeButton;
