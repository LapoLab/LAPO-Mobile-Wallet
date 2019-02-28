// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import Settings from '../index';

describe('Settings page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Settings />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  }); // eslint-disable-line
});
