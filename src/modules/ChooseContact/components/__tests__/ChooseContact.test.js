// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import ChooseContact from '../index';

describe('ChooseContact page', () => {
  test('renders snapshots', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <ChooseContact />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
