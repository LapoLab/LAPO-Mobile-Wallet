// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import PinsVerify from '../index';

describe('PinsVerify page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <PinsVerify />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
