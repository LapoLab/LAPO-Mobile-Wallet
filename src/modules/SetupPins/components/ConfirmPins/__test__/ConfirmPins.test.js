// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../../redux';
import ConfirmPins from '../index';

describe('ConfirmPins page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <ConfirmPins />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
