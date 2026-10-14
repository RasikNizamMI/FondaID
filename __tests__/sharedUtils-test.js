/**
 * Tests for shared utilities refactored during the code-quality pass:
 * apiUtils, AsyncStorageUtil, withInternetConnectivity and CommonModal.
 */
import React from 'react';
import {Text} from 'react-native';
import renderer, {act} from 'react-test-renderer';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

let netInfoListener;
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(listener => {
    netInfoListener = listener;
    return jest.fn();
  }),
}));

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

const axios = require('axios');
const {getRequest, postRequest, putRequest} = require('../src/Utils/apiUtils');
const {setData, getData, removeData} = require('../src/Utils/AsyncStorageUtil');
const withInternetConnectivity =
  require('../src/Utils/withInternetConnectivity').default;
const CommonModal = require('../src/component/CommonModal').default;

describe('apiUtils', () => {
  it('resolves with the response body and passes params/headers through', async () => {
    axios.get.mockResolvedValue({data: {ok: 1}});
    axios.post.mockResolvedValue({data: {ok: 2}});
    axios.put.mockResolvedValue({data: {ok: 3}});

    await expect(getRequest('u', {a: 1}, {h: 1})).resolves.toEqual({ok: 1});
    expect(axios.get).toHaveBeenCalledWith('u', {
      params: {a: 1},
      headers: {h: 1},
    });
    await expect(postRequest('u', {b: 2}, {h: 2})).resolves.toEqual({ok: 2});
    expect(axios.post).toHaveBeenCalledWith('u', {b: 2}, {headers: {h: 2}});
    await expect(putRequest('u', {c: 3})).resolves.toEqual({ok: 3});
    expect(axios.put).toHaveBeenCalledWith('u', {c: 3}, {headers: {}});
  });

  it('rejects with the original axios error (callers read error.response.status)', async () => {
    const error = Object.assign(new Error('401'), {response: {status: 401}});
    axios.get.mockRejectedValue(error);
    await expect(getRequest('u')).rejects.toBe(error);
  });
});

describe('AsyncStorageUtil', () => {
  it('round-trips JSON values and returns null for missing keys', async () => {
    await setData('k', {x: 1});
    await expect(getData('k')).resolves.toEqual({x: 1});
    await removeData('k');
    await expect(getData('k')).resolves.toBeNull();
  });

  it('returns null instead of throwing when stored data is not JSON', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    await AsyncStorage.setItem('bad', '{not json');
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(getData('bad')).resolves.toBeNull();
    warn.mockRestore();
  });
});

describe('withInternetConnectivity', () => {
  const Screen = ({label}) => <Text>{label}</Text>;
  const Wrapped = withInternetConnectivity(Screen);

  it('sets a debuggable display name', () => {
    expect(Wrapped.displayName).toBe('withInternetConnectivity(Screen)');
  });

  it('renders the wrapped screen online and the offline view when disconnected', () => {
    let tree;
    act(() => {
      tree = renderer.create(<Wrapped label="hello" />);
    });
    expect(tree.root.findByType(Text).props.children).toBe('hello');

    act(() => netInfoListener({isConnected: false}));
    const texts = tree.root.findAllByType(Text).map(t => t.props.children);
    expect(texts).toEqual([
      'No Internet',
      'Something wrong with your connection,',
      'Please check and try again.',
    ]);

    act(() => netInfoListener({isConnected: true}));
    expect(tree.root.findByType(Text).props.children).toBe('hello');
  });
});

describe('CommonModal', () => {
  it('renders header, message and calls onClose from the OK button', () => {
    const onClose = jest.fn();
    let tree;
    act(() => {
      tree = renderer.create(
        <CommonModal
          visible
          onClose={onClose}
          header="Error"
          message="Session timed out"
          color="#f00"
          imageSource={1}
        />,
      );
    });
    const texts = tree.root.findAllByType(Text);
    expect(texts.map(t => t.props.children)).toEqual([
      'Error',
      'Session timed out',
      'OK',
    ]);
    // dynamic header color is still applied on top of the shared style
    expect(texts[0].props.style[1]).toEqual({color: '#f00'});
    act(() =>
      tree.root.findByProps({accessibilityRole: 'button'}).props.onPress(),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
