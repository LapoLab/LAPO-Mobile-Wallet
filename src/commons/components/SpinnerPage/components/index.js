/**
 * @flow
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './styles';

type Props = {
  isShowSpinner: boolean,
  isRadius: boolean,
};
class SpinnerPage extends Component<Props> {
  getStyles = () => {
    const { isRadius } = this.props;
    if (isRadius) {
      return {
        ...styles.spinnerContainer,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
      };
    }
    return styles.spinnerContainer;
  };

  render() {
    const { isShowSpinner } = this.props;
    if (!isShowSpinner) {
      return null;
    }
    return (
      <View style={this.getStyles()}>
        <ActivityIndicator size="large" color="white" style={styles.spinner} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  isShowSpinner: state.modals.isShowSpinner,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SpinnerPage);
