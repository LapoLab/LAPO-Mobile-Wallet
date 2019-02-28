// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import SplashScreen from '../index';

describe('SplashScreen page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <SplashScreen />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
