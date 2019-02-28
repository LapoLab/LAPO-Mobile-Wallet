/**
 * @flow
 */

import React, { Component, Fragment } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import calcAmount from '../../../utils/calcAmount';
import styles from './styles';

type Props = {
  navigation: {
    openDrawer: Function,
    dispatch: Function,
    navigate: Function,
  },

  balance: String,
  countBlock: number,
  maxBlock: number,
  isReady: boolean,

};

class Balance extends Component<Props> {
  navigateToScreen = route => () => {
    const {
      navigation: { dispatch },
    } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    dispatch(navigateAction);
  };

  render() {
    const { countBlock, maxBlock, isReady } = this.props;
    const {
      balance,
    } = this.props;

    return (
      <Fragment>
        <View style={styles.notify}>
          <Text style={styles.notifyText}>
            {isReady ? 'blocks: ' : 'loading from database'}
            {isReady ? countBlock : ''}
            {isReady ? ` - ${maxBlock > 0 ? ((countBlock * 100) / maxBlock).toFixed(2) : 0} %` : ''}
          </Text>
        </View>

        <View style={[styles.balance, styles.balanceColor]}>
          <View style={styles.main}>
            <Text style={styles.textMain}>LAX</Text>
            <Text style={styles.textMain}>{calcAmount.calcAmountLux(Number(balance))}</Text>
          </View>
          <View style={styles.sub}>
            <Text style={styles.textSub}>
              {'$0.035'}
              {' '}
              {'/ LAX'}
            </Text>
            <Text style={styles.textSub}>
              {`$${(calcAmount.calcAmountLux(Number(balance)) * 0.035).toFixed(2)}`}
            </Text>
          </View>
        </View>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  balance: state.wallet.balance,

  isReady: state.dashboard.isReady,
  countBlock: state.dashboard.countBlock,
  maxBlock: state.dashboard.maxBlock,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Balance);
