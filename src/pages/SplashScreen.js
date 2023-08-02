import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const delay = setTimeout(() => {
      navigation.replace('Auth');
    }, 3000);
    return () => clearTimeout(delay);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../images/splashScreen.png')}
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
