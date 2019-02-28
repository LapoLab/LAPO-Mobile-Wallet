// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../../redux';
import SetPins from '../index';

describe('SetPins page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <SetPins />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
