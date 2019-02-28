/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  BackHandler,
  FlatList,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';

import SpinnerPage from '../../../commons/components/SpinnerPage';
import Modals from '../../Dashboard/components/Modals';
import {
  setModalTxDetails as setModalTxDetailsAction,
  setShowSpinner as setShowSpinnerAction,
} from '../../../commons/actions';
import calcAmount from '../../../utils/calcAmount';
import * as actionNotify from '../../Notify/actions';
import Notify from '../../Notify/component';
import styles from './styles';
import {
  menuIcon, ActivityIcon, iconNotifyActive, dashboardIcon, triangle,
} from '../../../assets';

type Props = {
  navigation: { openDrawer: Function, dispatch: Function, navigate: Function },
  transactions: [Object],
  setVisibleNotify: Function,
  isVisibleNotify: boolean,
  isOpenDrawer: boolean,
  timeNotifyLast: number,
  txDetails: string,
  setModalTxDetails: Function,
  notes: Object,
};
type State = {
  nameFilter: string,
};

class Transactions extends Component<Props, State> {
  state = {
    nameFilter: 'all',
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = () => {
    const { navigation: { openDrawer }, isOpenDrawer } = this.props;
    if (isOpenDrawer) {
      this.navigateToScreen('Dashboard')();
      return true;
    }
    openDrawer();
    return true;
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

  handleShowNotify = () => {
    const { setVisibleNotify, isVisibleNotify } = this.props;
    setVisibleNotify(!isVisibleNotify);
  };

  handleCLoseModal = () => {
    const { setModalTxDetails } = this.props;
    setModalTxDetails('');
  };

  handleChooseTx = (txId: string) => () => {
    const { setModalTxDetails } = this.props;
    setModalTxDetails(txId);
  };

  renderTiangle = () => {
    const { nameFilter } = this.state;
    return (
      <View style={styles.conrainerTriangle}>
        <View style={styles.activeIconColumn}>
          {nameFilter === 'all' && <Image style={styles.iconActiveInOut} source={triangle} />}
        </View>
        <View style={styles.activeIconColumn2}>
          {nameFilter === 'income' && <Image style={styles.iconActiveInOut} source={triangle} />}
        </View>
        <View style={styles.activeIconColumn}>
          {nameFilter === 'outcome' && <Image style={styles.iconActiveInOut} source={triangle} />}
        </View>
      </View>
    );
  };

  keyExtractor = item => item.id;

  renderNote = (tran) => {
    const { notes } = this.props;
    if (!notes[tran.id]) return null;
    if (notes[tran.id] && notes[tran.id] === '') return null;

    return (
      <View style={styles.RowInOutForNote}>
        <Text style={styles.labelNote}>Note:</Text>
        <Text style={styles.valueNote}>{notes[tran.id] ? `${notes[tran.id]}` : '-'}</Text>
      </View>
    );
  };

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
      <View style={{ marginBottom: 0 }}>
        <FlatList
          data={trans}
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
                  {calcAmount.calcAmountLux(tran.amount) || ''}
                  {' LAX'}
                </Text>
              </View>
              <View style={styles.RowInOut}>
                <Text style={styles.subTitleInOutLeft}>
                  {tran.time > 154262948 ? moment.unix(tran.time).format('HH:mm') : '-'}
                </Text>
                <Text style={styles.subTitleInOutRight}>{tran.address || ' '}</Text>
              </View>
              {this.renderNote(tran)}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  render() {
    const { nameFilter } = this.state;
    const {
      isVisibleNotify, transactions, timeNotifyLast, txDetails, navigation,
    } = this.props;

    const modalVisible = txDetails !== '';

    const txsWithoutOut = transactions.filter(item => item.mode === 'out');

    const isNotifyActive = !!(
      txsWithoutOut.length > 0 && txsWithoutOut[txsWithoutOut.length - 1].time > timeNotifyLast
    );

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
            <TouchableOpacity style={styles.buttonMenu} onPress={this.handleShowMenu}>
              <Image style={styles.menuHeader} source={menuIcon} />
            </TouchableOpacity>

            <Image source={dashboardIcon} style={styles.dashboardIcon} />

            <TouchableOpacity
              style={styles.buttonNotify}
              onPress={isNotifyActive ? this.handleShowNotify : null}
            >
              <Image
                style={styles.notifyHeader}
                source={isNotifyActive ? iconNotifyActive : ActivityIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.transactionContainer}>
              <View style={styles.groupInOut}>
                <View style={styles.headerInOut}>
                  <TouchableOpacity onPress={this.handleSetFilter('all')}>
                    <Text style={nameFilter === 'all' ? styles.textInOutActive : styles.textInOut}>
                      ALL
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.handleSetFilter('income')}>
                    <Text
                      style={nameFilter === 'income' ? styles.textInOutActive : styles.textInOut}
                    >
                      INCOME
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.handleSetFilter('outcome')}>
                    <Text
                      style={nameFilter === 'outcome' ? styles.textInOutActive : styles.textInOut}
                    >
                      OUTCOME
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.bodyInOut}>{this.renderTransactions()}</View>
              </View>
            </View>
          </View>
        </SafeAreaView>
        <View style={styles.bottomPlaceForX} />

        {Platform.OS !== 'ios' && modalVisible && <View style={styles.blurBackground} />}

        {isVisibleNotify && isNotifyActive && <Notify />}

        <SpinnerPage />

        {Platform.OS === 'ios' && <Modals navigation={navigation} />}

      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  transactions: state.wallet.transactions,
  isVisibleNotify: state.notify.isVisibleNotify,
  timeNotifyLast: state.notify.timeLast,
  txDetails: state.modals.txDetails,
  notes: state.wallet.notes,
  isOpenDrawer: state.modals.isOpenDrawer,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setVisibleNotify: actionNotify.setVisibleNotify,
    setModalTxDetails: setModalTxDetailsAction,
    setShowSpinner: setShowSpinnerAction,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Transactions);
