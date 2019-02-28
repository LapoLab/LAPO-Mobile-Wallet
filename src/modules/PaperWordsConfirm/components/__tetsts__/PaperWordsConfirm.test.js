// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import { PaperWordsConfirm } from '../index';

describe('PaperWordsConfirm page', () => {
  test('renders snapshots', () => {
    const navigation = {
      addListener: jest.fn(),
      dispatch: jest.fn(),
      goBack: jest.fn(),
    };

    const tree = renderer
      .create(
        <Provider store={store}>
          <PaperWordsConfirm
            navigation={navigation}
            index1={2}
            index2={8}
            confirmWord={jest.fn()}
            genIndexForWords={jest.fn()}
          />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
