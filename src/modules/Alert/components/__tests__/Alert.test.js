// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import Alert from '../index';

describe('Alert page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Alert />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
