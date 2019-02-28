// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import TransactionDetails from '../index';

describe('TransactionDetails page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <TransactionDetails />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
