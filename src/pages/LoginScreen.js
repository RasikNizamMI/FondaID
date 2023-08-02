import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

const LoginScreen = ({navigation}) => {
  const [useFandaID, setUseFandaID] = useState('');
  const [useFandaPhone, setUseFandaPhone] = useState('');

  const formatPhoneNumber = number => {
    const formattedNumber = number.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
    setUseFandaPhone(formattedNumber);
  };

  const handleLogin = () => {
    navigation.navigate('LoginOtpScreen');
  };

  const handleRegister = () => {
    navigation.navigate('RegisterScreen');
  }

  const handleTouchID = () => {
    navigation.navigate('TouchIDLogin');
  }

  return (
    <View style={styles.mainBody}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../images/logo.png')}
              style={{
                width: 277.97,
                height: 100,
                resizeMode: 'contain',
                margin: 30,
              }}
            />
          </View>

          <View style={styles.SectionTextStyle}>
            <Text style={styles.TextStyle}>Fonda ID</Text>
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              value={useFandaID}
              style={styles.inputStyle}
              onChangeText={UserFandaID => setUseFandaID(UserFandaID)}
              placeholder="Enter Fonda ID" //dummy@abc.com
              placeholderTextColor="#37474F"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.TextStyle}>Email / Phone Number</Text>
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              value={useFandaPhone}
              style={styles.inputStyle}
              onChangeText={formatPhoneNumber}
              placeholder="Enter Email / Phone Number" //12345
              placeholderTextColor="#37474F"
              keyboardType="default"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              underlineColorAndroid="#f000"
              returnKeyType="next"
            />
          </View>

          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleLogin}>
            <Text style={styles.buttonTextStyle}>Login</Text>
          </TouchableOpacity>

          <View style={{ alignSelf: 'flex-end', marginRight: 30}}>
            <TouchableOpacity onPress={''}>
            <Text
              style={{
                color: '#007CFF',
                fontSize: 14,
                alignSelf: 'center',
                marginTop: 10,
                textDecorationLine: 'underline',
                textDecorationColor: '#007CFF',
              }}>
               Trouble logging in?
            </Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text
              style={{
                color: '#37474F',
                fontSize: 16,
                alignSelf: 'center',
                marginTop: 20,
              }}>
              Don't have a Fonda Account?
            </Text>
          </View>
          <TouchableOpacity
            style={styles.registerButtonStyle}
            activeOpacity={0.5}
            // onPress={handleSubmitPress}
            onPress={handleRegister}>
            <View style={{alignSelf: 'center'}}>
              <Text style={styles.registerButtonTextStyle}>
                Create Fonda Account
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}>
            <Text
              style={{
                color: '#37474F',
                fontSize: 14,
                alignSelf: 'center',
                marginTop: 20,
              }}>
              Switch to 
            </Text>
            <TouchableOpacity onPress={handleTouchID}>
            <Text
              style={{
                color: '#F5A922',
                fontSize: 18,
                alignSelf: 'center',
                marginTop: 20,
                textDecorationLine: 'underline',
                textDecorationColor: '#F5A922',
              }}>
               Touch ID Login
            </Text>
            </TouchableOpacity>
          </View>
          <View>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../images/loginImage.png')}
                style={{
                  width: 360,
                  height: 233.31,
                  resizeMode: 'contain',
                  margin: 20,
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F6F8F9',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 50,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  SectionTextStyle: {
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
  },
  TextStyle: {
    color: '#37474F',
  },
  HeaderTextStyle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  SubHeadingTextStyle: {
    color: '#8392a5',
  },
  buttonStyle: {
    backgroundColor: '#F5A922',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#F5A922',
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
  },
  registerButtonStyle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    height: 50,
    alignItems: 'center',
    borderRadius: 0,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
    elevation: 4,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  registerButtonTextStyle: {
    color: '#F5A922',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: '#37474F',
    paddingLeft: 15,
    paddingRight: 15,
    elevation: 4,
    backgroundColor: '#ffffff',
  },
  registerTextStyle: {
    color: '#F5A922',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
    marginTop: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
  },
  checkbox: {
    alignSelf: 'center',
    color: '#0168fa',
  },
  icon: {
    marginRight: 10,
  },
});
