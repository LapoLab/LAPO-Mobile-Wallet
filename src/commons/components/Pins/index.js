/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import styles from './styles';
import Indicator from './Indicator';

type Props = {
  pins: string,
  onChange: Function,
};
class Pins extends Component<Props> {
  handleChoose = (nameChoose: string) => () => {
    const { onChange, pins } = this.props;
    if (pins.length < 7) {
      onChange(nameChoose);
    }
  };

  render() {
    const { pins } = this.props;
    return (
      <View style={styles.container}>
        <Indicator pins={pins} />

        <View style={styles.row}>
          <View style={styles.item}>
            <TouchableOpacity style={styles.outerButton} onPress={this.handleChoose('1')}>
              <View style={styles.button}>
                <Text style={styles.textButton}>1</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.item}>
            <TouchableOpacity style={styles.outerButton} onPress={this.handleChoose('2')}>
              <View style={styles.button}>
                <Text style={styles.textButton}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.item}>
            <TouchableOpacity style={styles.outerButton} onPress={this.handleChoose('3')}>
              <View style={styles.button}>
                <Text style={styles.textButton}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.item}>
            <TouchableOpacity style={styles.outerButton} onPress={this.handleChoose('4')}>
              <View style={styles.button}>
                <Text style={styles.textButton}>4</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.item}>
            <TouchableOpacity style={styles.outerButton} onPress={this.handleChoose('5')}>
              <View style={styles.button}>
                <Text style={styles.textButton}>5</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.item}>
            <TouchableOpacity style={styles.outerButton} onPress={this.handleChoose('6')}>
              <View style={styles.button}>
                <Text style={styles.textButton}>6</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.item}>
            <TouchableOpacity style={styles.outerButton} onPress={this.handleChoose('7')}>
              <View style={styles.button}>
                <Text style={styles.textButton}>7</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.item}>
            <TouchableOpacity style={styles.outerButton} onPress={this.handleChoose('8')}>
              <View style={styles.button}>
                <Text style={styles.textButton}>8</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.item}>
            <TouchableOpacity style={styles.outerButton} onPress={this.handleChoose('9')}>
              <View style={styles.button}>
                <Text style={styles.textButton}>9</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.buttonEmpty} />
          <View>
            <TouchableOpacity style={styles.outerButton} onPress={this.handleChoose('0')}>
              <View style={styles.button}>
                <Text style={styles.textButton}>0</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.buttonEmpty} onPress={this.handleChoose('delete')}>
              <Text style={styles.textButtonDelete}>DELETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Pins;
