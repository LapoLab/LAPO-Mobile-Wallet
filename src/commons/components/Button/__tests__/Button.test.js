// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../index';

describe('Button component', () => {
  test('renders snapshots default', () => {
    const fn = jest.fn();
    const tree = renderer.create(<Button title="Button" status="active"  onPress={fn} />); // eslint-disable-line
    const render = tree.toJSON();
    expect(render).toMatchSnapshot();
  });

  test('renders snapshots activeLight', () => {
    const fn = jest.fn();
    const tree = renderer.create(<Button title="Button" status="activeLight"  onPress={fn} />); // eslint-disable-line
    const render = tree.toJSON();
    expect(render).toMatchSnapshot();
  });

  test('renders snapshots gray ', () => {
    const fn = jest.fn();
    const tree = renderer.create(<Button title="Button" status="gray"  onPress={fn} />); // eslint-disable-line
    const render = tree.toJSON();
    expect(render).toMatchSnapshot();
  });
});
