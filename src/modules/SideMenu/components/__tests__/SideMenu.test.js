// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import SideMenu from '../index';

describe('SideMenu page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <SideMenu />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
