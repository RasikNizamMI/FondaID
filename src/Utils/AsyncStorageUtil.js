import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log('Data stored successfully.');
  } catch (error) {
    console.log('Error storing data:', error);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log('Data retrieved successfully:', JSON.parse(value));
      return JSON.parse(value);
    } else {
      console.log('No data found for the given key.');
      return null;
    }
  } catch (error) {
    console.log('Error retrieving data:', error);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Data with key '${key}' has been removed from AsyncStorage.`);
  } catch (error) {
    console.log(`Error removing data from AsyncStorage: ${error}`);
  }
}


