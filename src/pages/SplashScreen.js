import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {getData} from '../Utils/AsyncStorageUtil';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    let cancelled = false;
    let timer;

    // Show the splash for 2 seconds, then go to Auth (onboarding already seen) or Onboard.
    getData('onboard').then(storedUserOnboard => {
      if (cancelled) {
        return;
      }
      timer = setTimeout(() => {
        navigation.replace(storedUserOnboard !== null ? 'Auth' : 'Onboard');
      }, 2000);
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splashScreen.png')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});

export default SplashScreen;
