import React, {useState, useEffect} from 'react';
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
  BackHandler,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {setData} from '../Utils/AsyncStorageUtil';
import {postRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';
import {COLORS, FONTS} from '../assets/Colors';

const LoginScreen = ({navigation}) => {
  const [fondaID, setFondaID] = useState('');
  const [fondaPhone, setFondaPhone] = useState('');
  const [fondaEmail, setFondaEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Phone');
  const [callingCodeValue, setCallingCodeValue] = useState('+1');

  useEffect(() => {
    const handleBackButtonPress = () => {
      // Close the app when back button is pressed
      BackHandler.exitApp();
      return true; // Prevent default behavior (closing the current screen)
    };

    // Add event listener for back button press
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

    return () => {
      // Clean up event listener when component is unmounted
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );
    };
  }, []);

  const formatPhoneNumber = number => {
    const formattedNumber = number.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
    setFondaPhone(formattedNumber);
  };

  const handleLogin = async () => {
    setLoading(true);

    if (!fondaID) {
      setErrorMessage('Please enter valid Fonda ID');
      setLoading(false);
    } else if (!fondaPhone && selectedCategory === 'Phone') {
      setEmailErrorMessage('Please enter valid Phone Number');
      setErrorMessage('');
      setLoading(false);
    } else if (!fondaEmail && selectedCategory === 'Email') {
      setEmailErrorMessage('Please enter valid Email');
      setErrorMessage('');
      setLoading(false);
    } else {
      setErrorMessage('');
      setEmailErrorMessage('');

      let requestBody;

      if (selectedCategory === 'Phone') {
        const callingCodeString = callingCodeValue.toString();
        requestBody = {
          fonda_id: fondaID,
          email_id_phone_number: fondaPhone,
          phone_number_country_code: callingCodeString,
        };
      } else {
        requestBody = {
          fonda_id: fondaID,
          email_id_phone_number: fondaEmail,
        };
      }

      const headers = {
        'Content-Type': 'application/json',
      };
      console.log(API_ENDPOINTS.LOGINUSER, requestBody, headers);
      try {
        const response = await postRequest(
          API_ENDPOINTS.LOGINUSER,
          requestBody,
          headers,
        );
        console.log(response);
        if (response.responseCode === 'F200') {
          await setData('refID', response.refId);
          if (selectedCategory === 'Phone') {
          await setData('phoneNumber', fondaPhone);
          }else{
            await setData('phoneNumber', fondaEmail);
          }
          navigation.navigate('LoginOtpScreen');
          setFondaID('');
          setFondaPhone('');
          setErrorMessage('');
          setEmailErrorMessage('');
        } else {
          console.log('12345');
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

  const selectCategory = categary => {
    setSelectedCategory(categary);
    console.log(selectedCategory);
  };

  return (
    <View style={styles.mainBody}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.PRIMARY}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center',
          }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled">
          <View>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logoImage}
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>Fonda ID</Text>
              <TextInput
                value={fondaID}
                style={styles.input}
                onChangeText={userFondaID => setFondaID(userFondaID)}
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
              {/* <Text style={styles.label}>Email / Phone Number</Text> */}
              <View
                style={{
                  flexDirection: 'row',
                  borderColor: COLORS.PRIMARY,
                  borderWidth: 2,
                  borderRadius: 10,
                  width: 200,
                  height: 30,
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  onPress={() => selectCategory('Phone')}
                  style={[
                    {
                      flex: 1, // Ensure that each button takes up equal space
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center', // Center the content vertically
                      borderRightWidth: 1, // Add border on the right side
                      borderColor: COLORS.WHITE, // Border color for the right side
                    },
                    selectedCategory === 'Phone' && {
                      backgroundColor: COLORS.PRIMARY,
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        fontSize: 12,
                        fontFamily: FONTS.Regular,
                        color:
                          selectedCategory === 'Phone'
                            ? COLORS.WHITE
                            : COLORS.BLACK,
                      },
                    ]}>
                    Phone
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectCategory('Email')}
                  style={[
                    {
                      flex: 1, // Ensure that each button takes up equal space
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center', // Center the content vertically
                    },
                    selectedCategory === 'Email' && {
                      backgroundColor: COLORS.PRIMARY,
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        fontSize: 12,
                        fontFamily: FONTS.Regular,
                        color:
                          selectedCategory === 'Email'
                            ? COLORS.WHITE
                            : COLORS.BLACK,
                      },
                    ]}>
                    Email
                  </Text>
                </TouchableOpacity>
              </View>
              {selectedCategory === 'Phone' ? (
                <PhoneInput
                  value={fondaPhone}
                  defaultCode="US"
                  layout="first"
                  onChangeText={fondaPhone => setFondaPhone(fondaPhone)}
                  placeholder="Enter Phone Number"
                  containerStyle={{
                    flex: 1,
                    width: '100%',
                    height: 50,
                    color: COLORS.TEXTCOLOR,
                    elevation: 4,
                    backgroundColor: COLORS.WHITE,
                    borderRadius: 10,
                  }}
                  textContainerStyle={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: 10,
                    fontFamily: FONTS.Regular,
                    fontSize: 14,
                    borderRadius: 10,
                  }}
                  textInputStyle={{
                    flex: 1,
                    fontSize: 14,
                    paddingVertical: 0,
                    fontFamily: FONTS.Regular,
                    alignItems: 'center',
                  }}
                  flagButtonStyle={{width: 50, marginLeft: 10}}
                  onChangeCountry={countryData => {
                    const callingCode = countryData.callingCode;
                    console.log(callingCode);
                    setCallingCodeValue(callingCode);
                  }}
                />
              ) : (
                <TextInput
                  value={fondaEmail}
                  style={styles.input}
                  onChangeText={fondaEmail => setFondaEmail(fondaEmail)}
                  placeholder="Enter Email"
                  placeholderTextColor="#37474F"
                  keyboardType="default"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                />
              )}
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

            <TouchableOpacity activeOpacity={0.5} onPress={handleRegister}>
              <View style={styles.registerButton}>
                <Text style={styles.registerButtonText}>
                  Create Fonda Account
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.switchToTouchIDContainer}>
              <Text style={styles.switchToText}>Switch to</Text>
              <TouchableOpacity onPress={handleTouchID}>
                <Text style={styles.touchIDText}>Touch ID Login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/images/loginImage.png')}
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
              Invalid Fonda Id or Mail/Phone number
            </Text>
            <Image
              source={require('../assets/images/modalImage.png')}
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
    backgroundColor: '#F6F8F9',
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
    marginTop: 30,
  },
  inputSection: {
    marginHorizontal: 30,
    marginTop: 20,
  },
  label: {
    color: COLORS.TEXTCOLOR,
    fontFamily: FONTS.Regular,
    fontSize: 14,
  },
  input: {
    flex: 1,
    color: COLORS.TEXTCOLOR,
    paddingLeft: 15,
    paddingRight: 15,
    elevation: 4,
    backgroundColor: COLORS.WHITE,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.WHITE,
    marginTop: 5,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: FONTS.Regular,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 0,
    color: COLORS.WHITE,
    borderColor: COLORS.PRIMARY,
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 30,
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.WHITE,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: FONTS.Regular,
  },
  troubleLoginContainer: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 30,
  },
  troubleLoginText: {
    color: COLORS.DODGUERBLUE,
    fontSize: 14,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.DODGUERBLUE,
    fontFamily: FONTS.Regular,
  },
  createAccountContainer: {
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 20,
  },
  createAccountText: {
    color: COLORS.TEXTCOLOR,
    fontSize: 16,
    fontFamily: FONTS.Regular,
  },
  registerButton: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    color: COLORS.WHITE,
    borderColor: COLORS.WHITE,
    height: 50,
    alignItems: 'center',
    borderRadius: 0,
    marginHorizontal: 30,
    marginVertical: 10,
    elevation: 4,
    borderRadius: 10,
  },
  registerButtonText: {
    color: COLORS.PRIMARY,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: FONTS.Regular,
  },
  switchToTouchIDContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 20,
  },
  switchToText: {
    color: COLORS.TEXTCOLOR,
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: FONTS.SemiBold,
  },
  touchIDText: {
    color: COLORS.PRIMARY,
    fontSize: 18,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.PRIMARY,
    fontFamily: FONTS.SemiBold,
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
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 30,
    marginTop: 10,
    fontFamily: FONTS.Regular,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: COLORS.BLACK,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
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
    color: COLORS.PRIMARY,
    fontFamily: FONTS.Bold,
  },
  modalSubText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.BLACK,
    fontFamily: FONTS.Regular,
  },
  modalImage: {
    width: 158,
    height: 220,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
    fontFamily: FONTS.Regular,
  },
  creaeAccount: {
    marginBottom: 15,
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.TEXTCOLOR,
    fontFamily: FONTS.Regular,
  },
});
