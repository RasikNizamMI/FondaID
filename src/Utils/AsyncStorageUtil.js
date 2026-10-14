import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage failures are non-fatal for callers (getData falls back to null), but should not
// disappear silently while developing.
const warn = (action, key, error) => {
  if (__DEV__) {
    console.warn(`AsyncStorage ${action} failed for "${key}"`, error);
  }
};

export const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    warn('setItem', key, error);
  }
};

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (error) {
    warn('getItem', key, error);
    return null;
  }
};

export const removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    warn('removeItem', key, error);
  }
};
