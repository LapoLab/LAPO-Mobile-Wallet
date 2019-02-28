// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import Pins from '../index';

describe('Pins component', () => {
  test('renders snapshots default', () => {
    const fn = jest.fn();
    const tree = renderer.create(<Pins pins="" onChange={fn} />); // eslint-disable-line
    const render = tree.toJSON();
    expect(render).toMatchSnapshot();
  });

  test('renders snapshots with value', () => {
    const fn = jest.fn();
    const tree = renderer.create(<Pins pins="12333212333s" onChange={fn}  />); // eslint-disable-line
    const render = tree.toJSON();
    expect(render).toMatchSnapshot();
  });
});
