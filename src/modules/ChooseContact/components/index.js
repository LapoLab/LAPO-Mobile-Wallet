/**
 * @flow
 */

import React, { Component, Fragment } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  BackHandler,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import * as actionsCommon from '../../../commons/actions';
import SpinnerPage from '../../../commons/components/SpinnerPage';

import SearchInput from '../../../commons/components/SearchInput';
import styles from './styles';
import { backIcon } from '../../../assets';

type Props = {
  navigation: { openDrawer: Function, dispatch: Function, goBack: Function, navigate: Function },
  getContacts: Function,
  setAddress: Function,
  setModalSend: Function,
  contacts: Array<{
    givenName: string,
    familyName: string,
    emailAddresses: Array<{ email: string, label: string }>,
    recordID: string,
  }>,
};
type State = {
  search: string,
};
class ChooseContact extends Component<Props, State> {
  state = {
    search: '',
  };

  componentDidMount() {
    const { getContacts } = this.props;
    getContacts();
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = async () => {
    this.handleGoToBack();
    return true;
  };

  handleGoToBack = () => {
    const {
      navigation: { goBack, navigate },
      setModalSend,
    } = this.props;
    if (Platform.OS === 'ios') {
      navigate('Dashboard');
    } else {
      goBack();
    }
    setModalSend(true);
    return true;
  };

  handleChooseContact = (address: string) => () => {
    const {
      setAddress,
      navigation: { goBack, navigate },
      setModalSend,
    } = this.props;
    setAddress(address);
    if (Platform.OS === 'ios') {
      navigate('Dashboard');
    } else {
      goBack();
    }
    setModalSend(true);
  };

  handleChange = (search) => {
    this.setState({ search });
  };

  getFilterContact = () => {
    const { contacts } = this.props;
    const { search } = this.state;
    if (search === '') {
      return contacts;
    }
    return contacts.filter(
      item => (item.givenName && item.givenName.toLowerCase().includes(search.toLowerCase()))
        || (item.familyName && item.familyName.toLowerCase().includes(search.toLowerCase())),
    );
  };

  getSortContact = (contact) => {
    if (!contact || contact.length === 0) return [];
    return contact.sort((oldRelease, newRelease) => {
      const compareName = oldRelease.givenName && oldRelease.givenName
        .toLowerCase()
        .localeCompare(newRelease.givenName ? newRelease.givenName.toLowerCase() : '');
      const compareTitle = oldRelease.familyName && oldRelease.familyName
        .toLowerCase()
        .localeCompare(newRelease.familyName ? newRelease.familyName.toLowerCase() : '');

      // $FlowFixMe
      return compareName || compareTitle;
    });
  };

  render() {
    const contacts = this.getSortContact(this.getFilterContact());

    return (
      <LinearGradient
        start={{ x: -0.1, y: -0.1 }}
        end={{ x: 1.2, y: 1.2 }}
        locations={[0.04, 0.96]}
        colors={['#4183BD', '#093B0C']}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={this.handleGoToBack}>
              <Image style={styles.backHeader} source={backIcon} />
            </TouchableOpacity>
            <Text style={styles.titleHeader}>Choose contact</Text>
          </View>

          <SearchInput handleChange={this.handleChange} />

          <View style={styles.links}>
            <ScrollView>
              {contacts
                && contacts.map(item => (
                  <Fragment key={item.recordID}>
                    <View style={styles.info}>
                      <Text style={styles.title}>
                        {item.givenName}
                        {' '}
                        {item.familyName}
                      </Text>
                      <ScrollView>
                        {item.emailAddresses
                          && item.emailAddresses.map(email => (
                            <TouchableOpacity
                              key={`${item.recordID}-${email.email}`}
                              style={styles.link}
                              onPress={this.handleChooseContact(email.email)}
                            >
                              <Text style={styles.subTitle}>{email.email}</Text>
                            </TouchableOpacity>
                          ))}
                      </ScrollView>
                    </View>

                    <View style={styles.line} />
                  </Fragment>
                ))}
            </ScrollView>
          </View>

          <SpinnerPage />
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  contacts: state.chooseContact.data,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getContacts: actions.getContacts,
    setAddress: actions.setSendAddress,
    setModalSend: actionsCommon.setModalSend,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChooseContact);
