// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import Start from '../index';

describe('Start page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Start />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
