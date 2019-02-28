// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';

import Send from '../index';


describe('Send modal', () => {
  const tree = renderer.create(
    <Provider store={store}>
      <Send />
    </Provider>,
  );

  const render = tree.toJSON();

  test('renders snapshots', () => {
    expect(render).toMatchSnapshot();
  });
});
