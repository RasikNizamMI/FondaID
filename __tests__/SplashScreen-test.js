/**
 * SplashScreen waits 2 seconds, then routes to Auth when onboarding was already seen,
 * otherwise to Onboard. The pending timer is cleared on unmount.
 */
import React from 'react';
import renderer, {act} from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../src/pages/SplashScreen';

const flushPromises = () => act(() => Promise.resolve());

describe('SplashScreen', () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    await AsyncStorage.clear();
  });
  afterEach(() => jest.useRealTimers());

  it.each([
    [null, 'Onboard'],
    [true, 'Auth'],
  ])('onboard=%p routes to %s after 2s', async (onboard, route) => {
    if (onboard !== null) {
      await AsyncStorage.setItem('onboard', JSON.stringify(onboard));
    }
    const navigation = {replace: jest.fn()};
    act(() => {
      renderer.create(<SplashScreen navigation={navigation} />);
    });
    await flushPromises();
    await flushPromises();

    act(() => jest.advanceTimersByTime(1999));
    expect(navigation.replace).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(1));
    expect(navigation.replace).toHaveBeenCalledWith(route);
  });

  it('does not navigate after unmount', async () => {
    const navigation = {replace: jest.fn()};
    let tree;
    act(() => {
      tree = renderer.create(<SplashScreen navigation={navigation} />);
    });
    await flushPromises();
    await flushPromises();
    act(() => tree.unmount());
    act(() => jest.advanceTimersByTime(5000));
    expect(navigation.replace).not.toHaveBeenCalled();
  });
});
