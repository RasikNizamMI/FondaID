import React, {useEffect, useState} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {COLORS, FONTS} from '../assets/Colors';

// Renders a "No Internet" screen instead of the wrapped screen while the device is offline.
const withInternetConnectivity = WrappedComponent => {
  const WithInternetConnectivity = props => {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
      });

      return () => {
        unsubscribe();
      };
    }, []);

    if (!isConnected) {
      return (
        <View style={styles.container}>
          <Image
            source={require('../assets/images/oops.png')}
            style={styles.image}
          />
          <Text style={styles.title}>No Internet</Text>
          <Text style={[styles.message, styles.messageFirstLine]}>
            Something wrong with your connection,
          </Text>
          <Text style={styles.message}>Please check and try again.</Text>
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithInternetConnectivity.displayName = `withInternetConnectivity(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithInternetConnectivity;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F8F9',
  },
  image: {width: 100, height: 100, marginBottom: 16},
  title: {
    fontSize: 16,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
    color: COLORS.BLACK,
    marginTop: 20,
  },
  message: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
    color: COLORS.TEXTCOLOR,
  },
  messageFirstLine: {marginTop: 20},
});

export default withInternetConnectivity;
