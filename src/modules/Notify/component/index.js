/**
 * @flow
 */
import React, { Component, Fragment } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import calcAmount from '../../../utils/calcAmount';
import * as actions from '../actions';
import styles from './styles';

type Props = {
  navigation: { dispatch: Function, navigate: Function },
  transactions: Array<Object>,
  timeLast: number,
  setVisibleNotify: Function,
  setTimeNotify: Function,
  setModalTxDetails: Function,
};

export class NotifyWidget extends Component<Props> {
  navigateToScreen = (route: string) => () => {
    const {
      navigation: { dispatch },
    } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    dispatch(navigateAction);
  };

  handleClose = () => {
    const { setVisibleNotify } = this.props;

    setVisibleNotify(false);
  };

  handleChoose = (tx: {id: string, time: string}) => () => {
    const {
      setVisibleNotify,
      setTimeNotify,
      transactions,
      timeLast,
      setModalTxDetails,
    } = this.props;
    const filterTransaction = transactions.filter(item => item.time > timeLast);
    if (filterTransaction.length > 0) {
      setTimeNotify(tx.time);
      setVisibleNotify(false);
      setModalTxDetails(tx.id);
    }
  };

  handleClearAll = () => {
    const {
      setVisibleNotify, setTimeNotify, transactions, timeLast,
    } = this.props;
    const filterTransaction = transactions.filter(item => item.time > timeLast);
    if (filterTransaction.length > 0) {
      setTimeNotify(filterTransaction[filterTransaction.length - 1].time);
    }
    setVisibleNotify(false);
  };

  keyExtractor = (item: { id: string}) => item.id;

  render() {
    const { transactions, timeLast } = this.props;
    const filterTransaction = transactions
      .filter(item => item.mode === 'out')
      .filter(item => item.time && item.time > timeLast)
      .sort((a, b) => b.time - a.time);

    return (
      <TouchableHighlight
        style={styles.GlobalContainer}
        onPress={this.handleClose}
        underlayColor="transparent"
      >
        <View style={styles.container}>

          <View style={styles.panel}>
            {filterTransaction.length !== 0 && (
              <TouchableOpacity onPress={this.handleClearAll}>
                <Fragment>
                  <View style={styles.txContainerTop}>
                    <Text style={styles.titleTop}>Clear all transactions</Text>
                  </View>

                  <View style={styles.line} />
                </Fragment>
              </TouchableOpacity>
            )}

            {filterTransaction.length > 0 && (
              <FlatList
                data={filterTransaction}
                contentContainerStyle={{ paddingBottom: 40 }}
                keyExtractor={this.keyExtractor}
                renderItem={({ item: tx }) => (
                  <TouchableOpacity key={`${tx.id}`} onPress={this.handleChoose(tx)}>
                    <Fragment>
                      <View style={styles.txContainer} key={`vv_${tx.id}`}>
                        <Text style={styles.txTitle}>
                          {tx.mode === 'out' ? 'Incoming transaction' : 'Outcomming transaction'}
                        </Text>
                        <Text style={styles.txAmount}>
                          {tx.mode === 'out' ? '+ ' : '- '}
                          {calcAmount.calcAmountLux(tx.amount)}
                          {' '}
                          {'LAX'}
                        </Text>
                        <Text style={styles.txAddress}>{tx.address}</Text>
                      </View>

                      <View style={styles.line} />
                    </Fragment>
                  </TouchableOpacity>
                )}
              />
            )}
            {filterTransaction.length === 0 && (
              <View style={styles.txsEmpty}>
                <Text>no notifications</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  transactions: state.wallet.transactions,
  timeLast: state.notify.timeLast,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setVisibleNotify: actions.setVisibleNotify,
    setTimeNotify: actions.setTimeNotify,
    setModalTxDetails: actions.setModalTxDetails,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotifyWidget);
