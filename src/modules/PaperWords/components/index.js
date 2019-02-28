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
  ScrollView,
  BackHandler,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearGradient from 'react-native-linear-gradient';

import Button from '../../../commons/components/Button';
import SpinnerPage from '../../../commons/components/SpinnerPage';
import {
  setConfirmPins as setConfirmPinsAction,
  setPins as setPinsAction,
  share12Words as share12WordsAction,
} from '../../../commons/actions';
import * as actions from '../actions';
import styles from './styles';
import {
  backIcon, indicator3Icon,
} from '../../../assets';

type Props = {
  navigation: {
    dispatch: Function,
    addListener: Function,
  },
  setPins: Function,
  setConfirmPins: Function,
  share12Words: Function,
  tempWords: Array<string>,
  generatePhrase: Function,
};
export class PaperWords extends Component<Props> {
  componentDidMount() {
    const { navigation: { addListener } } = this.props;
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    addListener('willFocus', this.handleFocus);
    this.genPhrase(true);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleFocus = () => {
    this.genPhrase(true);
  }

  genPhrase = (isSave: boolean = true) => {
    const { generatePhrase } = this.props;
    generatePhrase(isSave);
  }

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
    const { setPins, setConfirmPins } = this.props;
    setPins('');
    setConfirmPins('');
    this.navigateToScreen('SetPins')();
    return true;
  };

  handleReady = async () => {
    await this.navigateToScreen('PaperWordsConfirm')();
  };

  renderWord = (number: number) => {
    const { tempWords } = this.props;
    const paperWords = tempWords.map((item, key) => ({
      key: item,
      number: key + 1,
    }));
    const item = paperWords[number];
    if (!item) return null;
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.item}>
          {`${item.number}.  `}
          {item.key.toUpperCase()}
        </Text>
      </View>
    );
  };

  handleSavePdf = async () => {
    const { share12Words } = this.props;
    share12Words();
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
          <View style={styles.header}>
            <TouchableOpacity style={styles.buttonMain} onPress={this.handleBack}>
              <Image style={styles.backHeader} source={backIcon} />
            </TouchableOpacity>

            <Text style={styles.titleHeader}>Paper key</Text>

            <TouchableOpacity style={styles.buttonMain} onPress={this.handleSavePdf}>
              <Text style={styles.textSaveToPdf}>Save to pdf</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.indicator}>
            <Image style={styles.indicatorIcon} source={indicator3Icon} />
          </View>

          <ScrollView>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Your paper key is the only way to restore your LAPO Mobile wallet if your phone is
                lost, stolen, broken or upgraded.
              </Text>
              <Text style={styles.title}>
                We will show you a list of words to write down in this exactly order on a piece of
                paper and keep safe.
              </Text>
            </View>

            <View style={styles.listWords}>
              <View style={styles.rowList}>
                {this.renderWord(0)}
                {this.renderWord(1)}
                {this.renderWord(2)}
              </View>
              <View style={styles.rowList}>
                {this.renderWord(3)}
                {this.renderWord(4)}
                {this.renderWord(5)}
              </View>
              <View style={styles.rowList}>
                {this.renderWord(6)}
                {this.renderWord(7)}
                {this.renderWord(8)}
              </View>
              <View style={styles.rowList}>
                {this.renderWord(9)}
                {this.renderWord(10)}
                {this.renderWord(11)}
              </View>
            </View>
          </ScrollView>

          <View style={{ height: 100 }}>
            <Button title="OK, I NOTED IT" onPress={this.handleReady} status="activeLight" />
          </View>

        </SafeAreaView>
        <SpinnerPage />
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  tempWords: state.paperWords.tempWords,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setConfirmPins: setConfirmPinsAction,
    setPins: setPinsAction,
    share12Words: share12WordsAction,
    generatePhrase: actions.generatePhrase,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaperWords);
