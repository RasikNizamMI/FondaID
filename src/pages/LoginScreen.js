import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Modal,
} from 'react-native';

import {setData} from '../Utils/AsyncStorageUtil';
import {postRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';

const LoginScreen = ({navigation}) => {
  const [fandaID, setFandaID] = useState('');
  const [fandaPhone, setFandaPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const formatPhoneNumber = number => {
    const formattedNumber = number.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
    setFandaPhone(formattedNumber);
  };

  const handleLogin = async () => {
    setLoading(true);

    if (!fandaID) {
      setErrorMessage('Please enter valid Fonda ID');
      setLoading(false);
    } else if (!fandaPhone) {
      setEmailErrorMessage('Please enter valid Email/Phone Number');
      setErrorMessage('');
      setLoading(false);
    } else {
      const requestBody = {
        fonda_id: fandaID,
        email_id_phone_number: fandaPhone,
      };

      try {
        const response = await postRequest(
          API_ENDPOINTS.LOGINUSER,
          requestBody,
        );

        if (response.Status.responseCode === 'F200') {
          await setData('refID', response.refId);
          await setData('phoneNumber', fandaPhone);
          navigation.navigate('LoginOtpScreen');
          setFandaID('');
          setFandaPhone('');
          setErrorMessage('');
          setEmailErrorMessage('')

        } else {
          setModalVisible(true);
        }
      } catch (error) {
        console.log('error', error);
        setErrorMessage('Please check credentials');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegister = () => {
    navigation.navigate('RegisterScreen');
  };

  const handleTouchID = () => {
    navigation.navigate('TouchIDLogin');
  };

  return (
    <View style={styles.mainBody}>
      {loading ? (
        <ActivityIndicator size="large" color="#F5A922" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled">
          <View>
            <View style={styles.logoContainer}>
              <Image
                source={require('../images/logo.png')}
                style={styles.logoImage}
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>Fonda ID</Text>
              <TextInput
                value={fandaID}
                style={styles.input}
                onChangeText={userFandaID => setFandaID(userFandaID)}
                placeholder="Enter Fonda ID"
                placeholderTextColor="#37474F"
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <View style={styles.inputSection}>
              <Text style={styles.label}>Email / Phone Number</Text>
              <TextInput
                value={fandaPhone}
                style={styles.input}
                onChangeText={fandaPhone => setFandaPhone(fandaPhone)}
                placeholder="Enter Email / Phone Number"
                placeholderTextColor="#37474F"
                keyboardType="default"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>

            {emailErrorMessage ? (
              <Text style={styles.errorText}>{emailErrorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.5}
              onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.troubleLoginContainer}>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.troubleLoginText}>Trouble logging in?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.createAccountContainer}>
              <Text style={styles.createAccountText}>
                Don't have a Fonda Account?
              </Text>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              activeOpacity={0.5}
              onPress={handleRegister}>
              <Text style={styles.registerButtonText}>
                Create Fonda Account
              </Text>
            </TouchableOpacity>

            <View style={styles.switchToTouchIDContainer}>
              <Text style={styles.switchToText}>Switch to</Text>
              <TouchableOpacity onPress={handleTouchID}>
                <Text style={styles.touchIDText}>Touch ID Login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={require('../images/loginImage.png')}
                style={styles.loginImage}
              />
            </View>
          </View>
        </ScrollView>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Oops!</Text>
            <Text style={styles.modalSubText}>
              Fonda ID or Email/Phone Number is not registered with us
            </Text>
            <Image
              source={require('../images/modalImage.png')}
              style={styles.modalImage}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.creaeAccount}>Or Create a Fonda Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F6F8F9',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 277.97,
    height: 100,
    resizeMode: 'contain',
    marginVertical: 30,
  },
  inputSection: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  label: {
    color: '#37474F',
  },
  input: {
    flex: 1,
    color: '#37474F',
    paddingLeft: 15,
    paddingRight: 15,
    elevation: 4,
    backgroundColor: '#ffffff',
    height: 50,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#F5A922',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#F5A922',
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  troubleLoginContainer: {
    alignSelf: 'flex-end',
    marginRight: 30,
  },
  troubleLoginText: {
    color: '#007CFF',
    fontSize: 14,
    alignSelf: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
    textDecorationColor: '#007CFF',
  },
  createAccountContainer: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  createAccountText: {
    color: '#37474F',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    height: 50,
    alignItems: 'center',
    borderRadius: 0,
    marginHorizontal: 10,
    marginVertical: 10,
    elevation: 4,
  },
  registerButtonText: {
    color: '#F5A922',
    paddingVertical: 10,
    fontSize: 16,
  },
  switchToTouchIDContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 20,
  },
  switchToText: {
    color: '#37474F',
    fontSize: 14,
    alignSelf: 'center',
  },
  touchIDText: {
    color: '#F5A922',
    fontSize: 18,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    textDecorationColor: '#F5A922',
  },
  imageContainer: {
    alignItems: 'center',
  },
  loginImage: {
    width: 360,
    height: 233.31,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#000',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    color: '#F5A922',
  },
  modalSubText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
  },
  modalImage: {
    width: 158,
    height: 220,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: '#F5A922',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
  },
  creaeAccount: {
    marginBottom: 15,
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
  },
});
