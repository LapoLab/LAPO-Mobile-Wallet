// @flow
import React from 'react';
import renderer from 'react-test-renderer';

import { NotifyWidget } from '../index';

describe('NotifyWidget page', () => {
  test('renders snapshots transactopns empty', () => {
    const transactions = [];
    const tree = renderer
      .create(
        <NotifyWidget
          transactions={transactions}
          navigation={{ dispatch: jest.fn(), navigate: jest.fn() }}
          timeLast={0}
          setTimeNotify={jest.fn()}
          setVisibleNotify={jest.fn()}
          setModalTxDetails={jest.fn()}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders snapshots with transactopns', () => {
    const transactions = [{
      id: 'id',
      mode: 'out',
      amount: 123,
      address: 'address',
      time: 100,
    }];
    const tree = renderer
      .create(
        <NotifyWidget
          transactions={transactions}
          navigation={{ dispatch: jest.fn(), navigate: jest.fn() }}
          timeLast={0}
          setTimeNotify={jest.fn()}
          setVisibleNotify={jest.fn()}
          setModalTxDetails={jest.fn()}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
