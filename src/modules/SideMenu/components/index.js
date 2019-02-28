// @flow
import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Share from 'react-native-share';
import type { Dispatch } from 'redux';
import {
  setModalSend as setModalSendAction,
  setModalReceive as setModalReceiveAction,
  setPaperWordsConfirm as setPaperWordsConfirmAction,
  setPins as setPinsAction,
  setConfirmPins as setConfirmPinsAction,
  goToOtherWindow as goToOtherWindowAction,
} from '../../../commons/actions';
import * as actionNotify from '../../Notify/actions';

import styles from './styles';
import {
  dashboard, send, recieve, trans, notify, profile, setup,
} from '../../../assets';

const { height: heightWindow } = Dimensions.get('window');

type Props = {
  navigation: {
    dispatch: Function,
    closeDrawer: Function,
  },
  setModalSend: Function,
  setModalReceive: Function,
  setVisibleNotify: Function,
  username: string,
  avatarSource: { uri: string },
  address: String,
  goToOtherWindow: Function,
};
class SideMenu extends Component<Props> {
  navigateToScreen = route => () => {
    const {
      navigation: { dispatch },
    } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    dispatch(navigateAction);
  };

  handleDashboard = () => {
    const {
      navigation: { closeDrawer },
    } = this.props;
    closeDrawer();
    this.navigateToScreen('Dashboard')();
  };

  handleSend = () => {
    const {
      navigation: { closeDrawer },
      setModalSend,
    } = this.props;
    closeDrawer();
    this.navigateToScreen('Dashboard')();
    setModalSend(true);
  };

  handleReceive = () => {
    const {
      navigation: { closeDrawer },
      setModalReceive,
    } = this.props;
    closeDrawer();
    this.navigateToScreen('Dashboard')();
    setModalReceive(true);
  };

  handleSetup = () => {
    const {
      navigation: { closeDrawer },
    } = this.props;

    closeDrawer();
    this.navigateToScreen('Settings')();
  };

  handleTransactions = () => {
    const {
      navigation: { closeDrawer },
    } = this.props;

    closeDrawer();
    this.navigateToScreen('Transactions')();
  };

  handleNotifications = () => {
    const {
      navigation: { closeDrawer },
      setVisibleNotify,
    } = this.props;
    closeDrawer();
    setVisibleNotify(true);
    this.navigateToScreen('Dashboard')();
  };

  handleProfiles = () => {
    const {
      navigation: { closeDrawer },
    } = this.props;

    closeDrawer();
    this.navigateToScreen('Profile')();
  };

  renderBottomButtonForSmall = () => {
    if (heightWindow <= 600) {
      return (
        <View style={styles.links}>
          <TouchableOpacity style={styles.link} onPress={this.handleSetup}>
            <Image style={styles.icon} source={setup} />
            <Text style={styles.title}>Settings</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  renderBottomButton = () => {
    if (heightWindow > 600) {
      return (
        <View style={styles.linksBottom}>
          <TouchableOpacity style={styles.linkBottom} onPress={this.handleSetup}>
            <Image style={styles.icon} source={setup} />
            <Text style={styles.title}>Settings</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  shareOnlyAddress = () => {
    const { address, goToOtherWindow } = this.props;

    if (address) {
      goToOtherWindow(true);

      const shareImageBase64 = {
        title: 'Lapo address',
        message: address,
        failOnCancel: false,
      };

      Share.open(shareImageBase64).catch();
    }
  }

  render() {
    const { address, username, avatarSource } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView>
          <SafeAreaView>
            <View style={styles.header}>
              {(username !== '' || avatarSource.uri !== '') && (
                <View style={styles.headeColumns}>
                  <Image style={styles.foto} source={avatarSource} />
                  <Text style={styles.headerTitle}>{username}</Text>
                </View>
              )}
              <TouchableOpacity onPress={this.shareOnlyAddress}>
                {address !== '' && <Text style={styles.headerSub}>{address}</Text>}
              </TouchableOpacity>
            </View>

            <View style={styles.links}>
              <TouchableOpacity style={styles.link} onPress={this.handleDashboard}>
                <Image style={styles.icon} source={dashboard} />
                <Text style={styles.title}>Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link} onPress={this.handleSend}>
                <Image style={styles.icon} source={send} />
                <Text style={styles.title}>Send LAX</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link} onPress={this.handleReceive}>
                <Image style={styles.icon} source={recieve} />
                <Text style={styles.title}>Receive LAX</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link} onPress={this.handleTransactions}>
                <Image style={styles.icon} source={trans} />
                <Text style={styles.title}>Transactions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link} onPress={this.handleNotifications}>
                <Image style={styles.icon} source={notify} />
                <Text style={styles.title}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.link} onPress={this.handleProfiles}>
                <Image style={styles.icon} source={profile} />
                <Text style={styles.title}>Profile</Text>
              </TouchableOpacity>

              {this.renderBottomButtonForSmall()}
            </View>
          </SafeAreaView>
        </ScrollView>
        {this.renderBottomButton()}
      </View>
    );
  }
}

const mapStateToProps = (state: any): Object => ({
  address: state.wallet.address,
  avatarSource: state.settings.avatar,
  username: state.settings.username,
});

const mapDispatchToProps = (dispatch: Dispatch<*>) => bindActionCreators(
  {
    setModalSend: setModalSendAction,
    setModalReceive: setModalReceiveAction,
    setPaperWordsConfirm: setPaperWordsConfirmAction,
    setPins: setPinsAction,
    setConfirmPins: setConfirmPinsAction,
    setVisibleNotify: actionNotify.setVisibleNotify,
    goToOtherWindow: goToOtherWindowAction,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SideMenu);
