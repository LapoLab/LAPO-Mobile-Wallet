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
  BackHandler,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../../commons/components/Button';
import * as actions from '../../../commons/actions';
import * as actionsLocal from '../actions';
import SpinnerPage from '../../../commons/components/SpinnerPage/components';
import styles from './styles';
import { backIcon, Dot3s } from '../../../assets';

type Props = {
  navigation: {
    dispatch: Function,
    goBack: Function,
    navigate: Function,
  },
  setConfirmPins: Function,
  setPins: Function,
  recoveryWallet: Function,
};

type State = {
  words: Object,
};

const INPUTS_NUMBER = 12;

export class RecoverWordsPage extends Component<Props, State> {
  state = {
    words: {},
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  // $FlowFixMe
  inputs = new Array(INPUTS_NUMBER)
    .fill(null)
    .map((_, i) => ({ id: i + 1, ref: React.createRef() }));

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
    const { setConfirmPins, setPins } = this.props;
    this.navigateToScreen('SetPins')();
    setConfirmPins('');
    setPins('');
    return true;
  };

  handleReady = async () => {
    const { words } = this.state;
    const { recoveryWallet } = this.props;

    recoveryWallet(words);
  };

  handleScan = () => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate('QrCodeScan', { returnData: this.returnDataQrCode });
  };

  // eslint-disable-next-line
  returnDataQrCode = ({ data }: { data: string }) => {
    const dataArray = data
      .trim()
      .split(' ')
      .filter(Boolean);
    dataArray.forEach((value, index) => {
      this.handleChange(index + 1)(value.toLowerCase());
    });
  };

  handleChange = (index: number) => (value: string) => {
    this.setState(state => ({
      ...state,
      words: {
        ...state.words,
        [index - 1]: value,
      },
    }));
  };

  renderWords = () => {
    const { words } = this.state;
    // $FlowFixMe
    return this.inputs.map(({ id, ref }, i) => {
      let returnKeyType = 'default';
      let onSubmitEditing = this.handleReady;
      if (id < INPUTS_NUMBER) {
        returnKeyType = 'next';
        onSubmitEditing = () => {
          // $FlowFixMe
          this.inputs[i + 1].ref.current.focus();
        };
      }
      return (
        <View style={styles.row} key={id}>
          <Text style={styles.textItem}>{`Word #${id}`}</Text>
          <TextInput
            style={styles.input}
            onChangeText={this.handleChange(id)}
            value={words[i]}
            onSubmitEditing={onSubmitEditing}
            ref={ref}
            autoCapitalize="none"
            returnKeyType={returnKeyType}
          />
        </View>
      );
    });
  };

  render() {
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

              <Text style={styles.titleHeader}>Recovery words</Text>

              <TouchableOpacity style={styles.buttonMain} onPress={this.handleScan}>
                <Text style={styles.textScan}>Scan</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.indicator}>
              <Image style={styles.indicatorIcon} source={Dot3s} />
            </View>

            <ScrollView>
              <View style={styles.listWords}>{this.renderWords()}</View>

              <View style={{ height: 100 }}>
                <Button title="VERIFY IT!" onPress={this.handleReady} status="activeLight" />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
        <SpinnerPage />
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  paperWords: state.wallet.paperWords,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setConfirmPins: actions.setConfirmPinsRecovery,
    setPins: actions.setPinsRecovery,
    recoveryWallet: actionsLocal.recoveryWallet,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecoverWordsPage);
