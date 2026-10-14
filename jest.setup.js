/* eslint-env jest */
// Native module mocks for Jest (official mocks shipped by each library where available).
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock'),
);
jest.mock('react-native-webview', () => {
  const {View} = require('react-native');
  return {WebView: View, default: View};
});
jest.mock('react-native-share', () => ({
  open: jest.fn(),
  default: {open: jest.fn()},
}));
jest.mock('react-native-touch-id', () => ({
  isSupported: jest.fn(() => Promise.resolve(false)),
  authenticate: jest.fn(() => Promise.resolve(false)),
}));
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));
jest.mock('@react-native-community/clipboard', () => ({
  setString: jest.fn(),
  getString: jest.fn(() => Promise.resolve('')),
}));
