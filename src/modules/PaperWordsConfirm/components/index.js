/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Keyboard,
  BackHandler,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearGradient from 'react-native-linear-gradient';

import Button from '../../../commons/components/Button';
import SpinnerPage from '../../../commons/components/SpinnerPage';
import * as actions from '../actions';
import styles from './styles';
import {
  backIcon, indicator4Icon,
} from '../../../assets';

type Props = {
  navigation: {
    dispatch: Function,
    goBack: Function,
  },
  confirmWord: Function,
  genIndexForWords: Function,
  index1: number,
  index2: number,
};

type State = {
  words: Object,
  keyboardShow: boolean,
};
export class PaperWordsConfirm extends Component<Props, State> {
  state = {
    words: {},
    keyboardShow: false,
  };

  componentDidMount() {
    const { genIndexForWords } = this.props;
    genIndexForWords();

    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  // eslint-disable-next-line react/sort-comp
  keyboardDidShowListener: Function;

  keyboardDidHideListener: Function;

  _keyboardDidShow = () => {
    this.setState({ keyboardShow: true });
  };

  _keyboardDidHide = () => {
    this.setState({ keyboardShow: false });
  };

  navigateToScreen = (route: string) => () => {
    const {
      navigation: { dispatch },
    } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    dispatch(navigateAction);
  };

  handleBack = () => {
    this.navigateToScreen('PaperWords')();
    return true;
  };

  handleReady = async () => {
    const {
      confirmWord,
    } = this.props;
    const { words } = this.state;

    confirmWord(words);
  };

  handleChange = (index: number) => (value: string) => {
    this.setState(state => ({
      ...state,
      words: {
        ...state.words,
        [index - 1]: value.toLowerCase().replace(/ /g, ''),
      },
    }));
  };

  renderWord = (number: number) => (
    <View style={styles.row}>
      <Text style={styles.textItem}>{`Word #${number}`}</Text>
      <TextInput style={styles.input} onChangeText={this.handleChange(number)} />
    </View>
  );

  render() {
    const { index1, index2 } = this.props;
    const { keyboardShow } = this.state;
    return (
      <LinearGradient
        start={{ x: -0.1, y: -0.1 }}
        end={{ x: 1.2, y: 1.2 }}
        locations={[0, 1]}
        colors={['#4183BD', '#093B0C']}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={styles.keyboard}
            behavior={Platform.OS === 'ios' ? 'padding' : ''}
            enabled
          >
            <View style={styles.header}>
              <TouchableOpacity style={styles.buttonMain} onPress={this.handleBack}>
                <Image style={styles.backHeader} source={backIcon} />
              </TouchableOpacity>

              <Text style={styles.titleHeader}>Confirm words</Text>
            </View>

            <View style={styles.indicator}>
              <Image style={styles.indicatorIcon} source={indicator4Icon} />
            </View>

            <ScrollView>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  To make sure everything was written down correctly, please enter the following
                  words from your paper key.
                </Text>
              </View>

              <View style={styles.listWords}>
                {this.renderWord(index1)}
                {this.renderWord(index2)}
              </View>
            </ScrollView>


            {!keyboardShow && (
              <View style={{ height: 100 }}>
                <Button title="VERIFY IT!" onPress={this.handleReady} status="activeLight" />
              </View>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
        <SpinnerPage />
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  index1: state.paperConfirm.index1,
  index2: state.paperConfirm.index2,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    confirmWord: actions.confirmWord,
    genIndexForWords: actions.genIndexForWords,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaperWordsConfirm);
