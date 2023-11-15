import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { setData, getData, removeData } from '../Utils/AsyncStorageUtil';
import {COLORS, FONTS} from '../assets/Colors';
import withInternetConnectivity from '../Utils/withInternetConnectivity';

const SettingScreen = ({navigation}) => {
  const [dataStorageEnabled, setDataStorageEnabled] = useState(false);
  const [dataStorageEnabled1, setDataStorageEnabled1] = useState(false);
  const [dataStorageEnabled2, setDataStorageEnabled2] = useState(false);

  const toggleDataStorage = () => {
    setDataStorageEnabled(!dataStorageEnabled);
  };
  const toggleDataStorage1 = () => {
    setDataStorageEnabled1(!dataStorageEnabled1);
  };
  const toggleDataStorage2 = () => {
    setDataStorageEnabled2(!dataStorageEnabled2);
  };

  const handleLogout = () => {
    navigation.navigate('Auth', {screen: 'LoginScreen'})
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 50,
              fontSize: 24,
              fontFamily: FONTS.Bold,
              color: '#F5A922',
            }}>
            Settings
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            marginLeft: 30,
            marginRight: 30,
            height: 2,
            backgroundColor: '#999999',
          }}></View>
          <TouchableOpacity
        activeOpacity={0.5}
        onPress={handleLogout}>
        <View style={{flexDirection: 'row', margin: 20}}>
          <Image
            source={require('../assets/images/logout.png')}
            style={{
              width: 20,
              height: 20,
              resizeMode: 'contain',
              marginLeft: 20,
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontFamily: FONTS.SemiBold,
              color: '#37474F',
              marginLeft: 20,
            }}>
            Logout
          </Text>
        </View>
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 30,
            marginRight: 30,
            height: 2,
            backgroundColor: '#999999',
          }}></View>
      </ScrollView>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate('Dashboard', {screen: 'Dashboard'})
          }}>
        <Text style={styles.buttonTextStyle}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F6F8F9',
    flexGrow: 1,
  },
  content: {
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    margin: 10,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#F5A922',
  },
  textView: {
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#37474F',
  },
  mandatorytext: {
    fontSize: 14,
    textAlign: 'center',
    color: '#FF0000',
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 20,
    paddingLeft: 10,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10,
    paddingRight: 20,
    color: '#37474F',
  },
  linkTextView: {
    marginTop: 10,
  },
  linkText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: '#F5A922',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#F5A922',
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  skipButtonStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#F5A922',
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    borderWidth: 2,
    marginBottom: 110,
  },
  skipButtonTextStyle: {
    color: '#F5A922',
    paddingVertical: 10,
    fontSize: 16,
  },
  buttonStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    color: '#FFFFFF',
    borderColor: '#F5A922',
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
  },
  buttonTextStyle: {
    color: '#F5A922',
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default withInternetConnectivity(SettingScreen);
