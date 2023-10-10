import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {setData, getData, removeData} from '../Utils/AsyncStorageUtil';
import { loadAndroidRawResource } from 'react-native-svg/lib/typescript/LocalSvg';

const SplashScreen = ({navigation}) => {
  const checkAccessKey = async () => {
    try {
      const storedUserFondaID = await getData('fonda_ID');
      const storedUserOnboard = await getData('onboard');
      console.log(storedUserFondaID);
      console.log(storedUserOnboard);
      if (storedUserFondaID !== null && storedUserOnboard !== null) {
        console.log("11111")
        setTimeout(() => {
          navigation.replace('Home');
        }, 2000); // Delay navigation for 2 seconds (adjust as needed)
      } else if (storedUserFondaID == null && storedUserOnboard !== null){
        console.log('22222')
        setTimeout(() => {
          navigation.replace('Auth');
        }, 2000); // Delay navigation for 2 seconds (adjust as needed)
      }else{
        console.log('3333')
        setTimeout(() => {
          navigation.replace('Onboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error accessing data:', error);
      // Handle the error appropriately (e.g., show a message to the user)
    }
  };

  useEffect(() => {
    try {
      checkAccessKey();
    } catch (error) {
      console.error('Error in useEffect:', error);
      // Handle the error appropriately
    }
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
