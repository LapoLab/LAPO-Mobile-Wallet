/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, FlatList,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import {
  setModalTxDetails as setModalTxDetailsAction,
  setShowSpinner as setShowSpinnerAction,
} from '../../../commons/actions';
import calcAmount from '../../../utils/calcAmount';
import styles from './styles';

type Props = {
  navigation: {
    openDrawer: Function,
    dispatch: Function,
    navigate: Function,
  },

  transactions: [Object],
  setModalTxDetails: Function,
};
type State = {
  nameFilter: string,
};
class Dashboard extends Component<Props, State> {
  state = {
    nameFilter: 'all',
  };

  handleShowMenu = () => {
    const {
      navigation: { openDrawer },
    } = this.props;
    openDrawer();
  };

  navigateToScreen = route => () => {
    const {
      navigation: { dispatch },
    } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    dispatch(navigateAction);
  };

  handleSetFilter = nameFilter => () => {
    this.setState({ nameFilter });
  };

  handleChooseTx = (txId: string) => () => {
    const { setModalTxDetails } = this.props;
    setModalTxDetails(txId);
  };

  keyExtractor = item => item.id;

  renderTransactions = () => {
    const { transactions } = this.props;
    const { nameFilter } = this.state;
    const tranFilter = transactions.filter((item) => {
      if (nameFilter === 'outcome') {
        return item.mode === 'input';
      }
      if (nameFilter === 'income') {
        return item.mode === 'out';
      }
      return true;
    });

    const trans = tranFilter.sort(
      (a, b) => Number(b.time === 0 ? b.time2 : b.time) - Number(a.time === 0 ? a.time2 : a.time),
    );

    if (trans.length === 0) {
      return (
        <View style={styles.rowInOutEmpty}>
          <Text style={styles.textEmpty}>no transactions yet</Text>
        </View>
      );
    }

    return (
      <View style={{ paddingBottom: 50 }}>
        <FlatList
          data={trans}
          contentContainerStyle={{ paddingBottom: 0 }}
          keyExtractor={this.keyExtractor}
          renderItem={({ item: tran }) => (
            <TouchableOpacity
              style={styles.rowInOut}
              key={`${tran.id}`}
              onPress={this.handleChooseTx(tran.id)}
            >
              <View style={styles.RowInOut}>
                <Text style={tran.mode === 'out' ? styles.titleIn : styles.titleOut}>
                  {tran.time > 154262948 ? moment.unix(tran.time).format('DD MMM YYYY') : '-'}
                </Text>
                <Text style={tran.mode === 'out' ? styles.titleIn : styles.titleOut}>
                  {tran.mode === 'out' ? '+ ' : '- '}
                  {calcAmount.calcAmountLux(tran.amount)}
                  {' LAX'}
                </Text>
              </View>
              <View style={styles.RowInOut}>
                <Text style={styles.subTitleInOutLeft}>
                  {tran.time > 154262948 ? moment.unix(tran.time).format('HH:mm') : '-'}
                </Text>
                <Text style={styles.subTitleInOutRight}>{tran.address}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  render() {
    const { nameFilter } = this.state;

    return (
      <View style={styles.transactionContainer}>
        <View style={styles.groupInOut}>
          <View style={styles.headerInOut}>
            <TouchableOpacity onPress={this.handleSetFilter('all')}>
              <Text style={nameFilter === 'all' ? styles.textInOutActive : styles.textInOut}>
                ALL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleSetFilter('income')}>
              <Text style={nameFilter === 'income' ? styles.textInOutActive : styles.textInOut}>
                INCOME
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleSetFilter('outcome')}>
              <Text style={nameFilter === 'outcome' ? styles.textInOutActive : styles.textInOut}>
                OUTCOME
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bodyInOut}>{this.renderTransactions()}</View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  address: state.wallet.address,
  transactions: state.wallet.transactions,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setModalTxDetails: setModalTxDetailsAction,
    setShowSpinner: setShowSpinnerAction,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
