import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {setData, getData, removeData} from '../Utils/AsyncStorageUtil';
import {loadAndroidRawResource} from 'react-native-svg/lib/typescript/LocalSvg';
import {COLORS, FONTS} from '../assets/Colors';

const SplashScreen = ({navigation}) => {
  const checkAccessKey = async () => {
    try {
      const storedUserFondaID = await getData('fonda_ID');
      const storedUserOnboard = await getData('onboard');
      if (storedUserOnboard !== null) {
        setTimeout(() => {
          navigation.replace('Auth');
        }, 2000); // Delay navigation for 2 seconds (adjust as needed)
      } else {
        setTimeout(() => {
          navigation.replace('Onboard');
        }, 2000);
      }
    } catch (error) {}
  };

  useEffect(() => {
    try {
      checkAccessKey();
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
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
