import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {COLORS, FONTS} from '../assets/Colors';

const withInternetConnectivity = WrappedComponent => {
  return props => {
    const [isConnected, setIsConnected] = useState(true);

    const checkInternetConnection = () => {
      NetInfo.fetch().then(state => {
        setIsConnected(state.isConnected);
      });
    };

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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6F8F9',}}>
          <Image
            source={require('../assets/images/oops.png')} // replace with actual image path
            style={{width: 100, height: 100, marginBottom: 16}}
          />
          <Text
            style={{
              fontSize: 16,
              fontFamily: FONTS.Regular,
              textAlign: 'center',
              color: COLORS.BLACK,
              marginTop: 20,
            }}>
            No Internet
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: FONTS.Regular,
              textAlign: 'center',
              color: COLORS.TEXTCOLOR,
              marginTop: 20,
            }}>
            Something wrong with your connection,
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: FONTS.Regular,
              textAlign: 'center',
              color: COLORS.TEXTCOLOR,
            }}>
            Please check and try again.
          </Text>
          {/* <TouchableOpacity onPress={checkInternetConnection}>
            <Text>Try Again</Text>
          </TouchableOpacity> */}
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withInternetConnectivity;
