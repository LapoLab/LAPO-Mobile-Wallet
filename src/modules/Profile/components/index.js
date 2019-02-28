/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Keyboard,
  Platform,
  BackHandler,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImagePicker from 'react-native-image-picker';

import styles from './styles';
import Button from '../../../commons/components/Button';
import * as actions from '../../../commons/actions';
import * as actionsAlert from '../../Alert/actions';
import { backIcon, fotoAparat, iconEdit } from '../../../assets';

type Props = {
  navigation: { openDrawer: Function, dispatch: Function },
  avatarSource: { uri: string },
  // eslint-disable-next-line
  password: string,
  // eslint-disable-next-line
  username: string,
  isOpenDrawer: boolean,
  setAvatar: Function,
  setUserName: Function,
  setPins: Function,
  setConfirmPins: Function,
  goToOtherWindow: Function,
  showAlert: Function,
};
type State = {
  keyboardShow: boolean,
  avatarSource: { uri: string },
  password: string,
  username: string,
  isEdit: boolean,
};
class Profile extends Component<Props, State> {
  state = {
    keyboardShow: false,
    avatarSource: { uri: '' },
    password: '',
    username: '',
    // eslint-disable-next-line
    isEdit: false,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (!state.isEdit) {
      return {
        ...state,
        avatarSource: props.avatarSource,
        password: props.password,
        username: props.username,
      };
    }
    return state;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  handleBack = async () => {
    const { isOpenDrawer } = this.props;
    if (isOpenDrawer) {
      this.navigateToScreen('Dashboard')();
      return true;
    }
    this.handleGoToBack();
    return true;
  };

  // eslint-disable-next-line react/sort-comp
  keyboardDidShowListener: Function;

  keyboardDidHideListener: Function;

  _keyboardDidShow = () => {
    this.setState({ keyboardShow: true });
  };

  _keyboardDidHide = () => {
    this.setState({ keyboardShow: false });
  };

  handleGoToBack = () => {
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

  textInputPassword: Object;

  textInputName: Object;

  handleSaveProfile = () => {
    const {
      setAvatar, setUserName, setPins, setConfirmPins, showAlert,
    } = this.props;
    const { username, password, avatarSource } = this.state;

    if (password.length !== 6) {
      showAlert(
        'Message',
        'passcode not valid',
        // eslint-disable-next-line
        [{ text: 'OK' }],
        {
          cancelable: false,
        },
      );
      return;
    }

    setPins(password);
    setConfirmPins(password);

    setUserName(username);
    setAvatar(avatarSource);

    // eslint-disable-next-line
    this.setState({ isEdit: false });

    this.navigateToScreen('Dashboard')();
  };

  handleEditPassword = () => {
    this.textInputPassword.focus();
  };

  handleEditName = () => {
    this.textInputName.focus();
  };

  handleChangePassword = (value: string) => {
    // eslint-disable-next-line
    this.setState({ password: value, isEdit: true });
  };

  handleChangeUserName = (value: string) => {
    // eslint-disable-next-line
    this.setState({ username: value, isEdit: true });
  };

  handleShowImagePicker = async () => {
    const { goToOtherWindow } = this.props;
    // eslint-disable-next-line
    await this.setState({ isEdit: true });

    goToOtherWindow(true);

    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      goToOtherWindow(true);
      // console.log('response:::::', response);
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: Platform.OS === 'ios' ? response.uri : `file://${response.path}` };
        this.setState({
          avatarSource: source,
        });
      }
    });
  };

  render() {
    const {
      keyboardShow, avatarSource, username,
    } = this.state;

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
            <Text style={styles.titleHeader}>Your profile</Text>
          </View>

          {!keyboardShow && (
            <View style={styles.fotoContainer}>
              <View style={styles.fotoProxy}>
                <View style={avatarSource && avatarSource.uri ? '' : styles.imgContainerWithBorder}>
                  <Image style={styles.imgFota} source={avatarSource} />
                </View>
                <TouchableOpacity
                  style={styles.fotoAparatContainer}
                  onPress={this.handleShowImagePicker}
                >
                  <Image style={styles.fotoAparat} source={fotoAparat} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.rowInput}>
              <TextInput
                style={styles.input}
                value={username}
                autoCapitalize="words"
                textContentType="username"
                // $FlowFixMe
                ref={ref => (this.textInputName = ref)}
                onChangeText={this.handleChangeUserName}
              />
              <TouchableOpacity style={styles.buttonEdit} onPress={this.handleEditName}>
                <Image style={styles.iconEdit} source={iconEdit} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.line} />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your passcode</Text>
            <View style={styles.rowInput}>
              <TextInput
                style={styles.input}
                // defaultValue={password}
                secureTextEntry
                textContentType="password"
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={6}
                autoCorrect={false}
                // $FlowFixMe
                ref={ref => (this.textInputPassword = ref)}
                onChangeText={this.handleChangePassword}
              />
              <TouchableOpacity style={styles.buttonEdit} onPress={this.handleEditPassword}>
                <Image style={styles.iconEdit} source={iconEdit} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.line} />

          {!keyboardShow && (
            <Text style={styles.info}>
              Please note: all this information are stored ONLY in your cellphone. We are not
              storing any of your personal data and/or picture.
            </Text>
          )}

          <View style={{ flex: 2 }}>
            <Button title="SAVE PROFILE" onPress={this.handleSaveProfile} status="activeLight" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  avatarSource: state.settings.avatar,
  username: state.settings.username,
  password: state.pins.pins,
  isOpenDrawer: state.modals.isOpenDrawer,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setUserName: actions.setUserName,
    setAvatar: actions.setAvatar,
    setPins: actions.setPins,
    setConfirmPins: actions.setConfirmPins,
    goToOtherWindow: actions.goToOtherWindow,
    showAlert: actionsAlert.showAlert,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
