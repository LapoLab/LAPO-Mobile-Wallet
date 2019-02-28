// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import Recieve from '../index';

describe('Recieve page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Recieve />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
