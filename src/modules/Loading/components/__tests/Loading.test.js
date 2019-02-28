// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import Loading from '../index';

describe('Loading page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Loading />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
