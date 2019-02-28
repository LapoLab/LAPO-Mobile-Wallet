// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../redux';
import { PaperWords } from '../index';

describe('PaperWords page', () => {
  test('renders snapshots', () => {
    const navigation = {
      addListener: jest.fn(),
      dispatch: jest.fn(),
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <PaperWords
            navigation={navigation}
            setConfirmPins={jest.fn()}
            setPaperWords={jest.fn()}
            setPins={jest.fn()}
            generatePhrase={jest.fn()}
            tempWords={['123', '234', '345']}
            share12Words={jest.fn()}
          />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
