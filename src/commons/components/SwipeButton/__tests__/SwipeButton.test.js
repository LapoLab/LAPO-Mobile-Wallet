import React from 'react';
import renderer from 'react-test-renderer';
import SwipeButton from '../index';

describe('SwipeButton component', () => {
  test('renders snapshots default', () => {
    const tree = renderer.create(<SwipeButton />);
    const render = tree.toJSON();
    expect(render).toMatchSnapshot();
  });
});
