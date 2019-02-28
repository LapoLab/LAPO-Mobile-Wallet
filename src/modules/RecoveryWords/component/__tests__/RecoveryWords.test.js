// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import RecoverWords from '../index';

describe('RecoverWordsPage page', () => {
  test('renders snapshots', () => {
    const fn = jest.fn();
    const tree = renderer
      .create(
        <Provider store={store}>
          <RecoverWords
            navigation={{
              dispatch: fn,
              goBack: fn,
            }}
            setConfirmPins={fn}
            setPins={fn}
            recoveryWallet={fn}
          />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  }); // eslint-disable-line
});
