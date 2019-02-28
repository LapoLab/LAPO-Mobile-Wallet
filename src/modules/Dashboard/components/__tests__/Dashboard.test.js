// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import Dashboard from '../index';

describe('Dashboard page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Dashboard />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
