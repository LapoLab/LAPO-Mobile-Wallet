// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import SearchInput from '../index';

describe('SearchInput component', () => {
  test('renders snapshots default', () => {
    const fn = jest.fn();
    const tree = renderer.create(<SearchInput handleChange={fn} />); // eslint-disable-line
    const render = tree.toJSON();
    expect(render).toMatchSnapshot();
  });
});
