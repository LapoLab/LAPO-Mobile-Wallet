/**
 * @flow
 */

import React from 'react';
import {
  View,
  TextInput,
} from 'react-native';

import styles from './styles';

const SearchInput = ({ handleChange }: { handleChange: Function}) => (
  <View style={styles.containerSearch}>
    <TextInput style={styles.inputSearch} onChangeText={handleChange} />
  </View>
);

export default SearchInput;
