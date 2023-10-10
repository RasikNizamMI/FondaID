import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { API_ENDPOINTS } from '../Utils/apiConfig';
import { getRequest, postRequest } from '../Utils/apiUtils';
import { getData, setData } from '../Utils/AsyncStorageUtil';

const CELL_COUNT = 6;

const LoginOtpScreen = ({ navigation }) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

  const [userPhoneNo, setUserPhoneNo] = useState('');
  const [userRefID, setUserRefID] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userFondaID, setUserFondaID] = useState('');

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const storedUserPhoneNo = await getData('phoneNumber');
        const storedUserRefID = await getData('refID');

        setUserPhoneNo(storedUserPhoneNo || '');
        setUserRefID(storedUserRefID || '');
      } catch (error) {
        console.log('Error loading remembered credentials:', error);
      }
    };
    loadRememberedCredentials();
  }, []);

  const handleOtpConfirm = async () => {
    setLoading(true);

    const requestBody = {
      ref_id: userRefID,
      login_otp: value,
    };
    try {
      const response = await postRequest(API_ENDPOINTS.LOGINVERIFYOTP, requestBody);
      console.log(response)
      if (response.responseCode === 'F200') {
        console.log(response)
        handleUser();
      } else {
        setErrorMessage("OTP invalid")
        setErrorMessage(response.responseMessage);
      }
    } catch (error) {
      console.log('error', error);
      setErrorMessage('OTP invalid');
    } finally {
      setLoading(false);
    }
  };

 const handleUser = async () => {
  setLoading(true);

    try {
      const response = await getRequest(API_ENDPOINTS.GETUSER+userRefID);
      console.log(JSON.stringify(response.fonda_id));
      setUserFondaID(response.fonda_id)
      setData('fonda_ID', response.fonda_id)
      setData('_id', response._id);
      setData('emailID', response.email_id);
      setData('phoneNumber', response.phone_number);
      setData('firstName', response.first_name);
      setData('surName', response.sur_name);
      setData('birthName', response.birth_name);
      setData('dateOfBirth', response.date_of_birth);
      setData('placeOfBirth', response.place_of_birth);
      setData('nationality', response.nationality);
      setData('nativeCountry', response.native_country);
      setData('gender', response.gender);
      navigation.navigate('Home', {screen: 'Dashboard'})
      
    } catch (error) {
      console.log('error', error);
      setErrorMessage('Please check credentials');
    } finally {
      setLoading(false);
    }
  }


  const handleLogin = async () => {
    setLoading(true);

    const requestBody = {
      ref_id: userRefID,
    };

    try {
      const response = await postRequest(API_ENDPOINTS.LOGINRESENDOTP, requestBody);

      if (response.responseCode === 'F200') {
        Alert.alert(response.responseMessage);
      } else {
        setErrorMessage(response.responseMessage);
      }
    } catch (error) {
      console.log('error', error);
      setErrorMessage('Please check credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainBody}>
      {loading ? (
        <ActivityIndicator size="large" color="#F5A922" />
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Image source={require('../images/otpImg.png')} style={styles.image} />
            <Text style={styles.headerText}>Verify your phone number</Text>
            <Text style={styles.subHeadingText}>
              Please enter the 6-digit code sent to
            </Text>
            <Text style={styles.subMobileHeaderText}>{userPhoneNo}</Text>
            <View>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={6}
              rootStyle={styles.codeFiledRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[
                    {
                      width: 50,
                      height: 50,
                      lineHeight: 50,
                      fontSize: 24,
                      borderWidth: 2,
                      borderColor: '#F5A922',
                      textAlign: 'center',
                      borderRadius: 10,
                      color: '#FFFFFF',
                      margin: 5,
                      backgroundColor: symbol ? '#F5A922' : '#FFFFFF',
                    },
                    isFocused && styles.focusCell,
                  ]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
            </View>
            <View style={styles.resendCodeContainer}>
              <Text style={styles.resendCodeText}>Didn’t receive a code?</Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.resendCodeLink}>Resend Code</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.5}
              onPress={handleOtpConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default LoginOtpScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F6F8F9',
    alignContent: 'center',
  },
  container: {
    alignItems: 'center',
  },
  image: {
    width: 133.38,
    height: 80,
    resizeMode: 'contain',
    margin: 30,
  },
  headerText: {
    color: '#F5A922',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeadingText: {
    marginTop: 20,
    color: '#37474F',
    textAlign: 'center',
    fontSize: 16,
  },
  subMobileHeaderText: {
    color: '#F5A922',
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  codeFiledRoot: {marginTop: 30, marginRight: 30, marginLeft: 30},
  cell: {
    width: 50,
    height: 50,
    lineHeight: 50,
    fontSize: 24,
    borderWidth: 2,
    textAlign: 'center',
    borderRadius: 10,
    color: '#FFFFFF',
  },
  resendCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendCodeText: {
    color: '#37474F',
    fontSize: 16,
  },
  resendCodeLink: {
    color: '#F5A922',
    fontSize: 16,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: '#F5A922',
    borderWidth: 1,
    borderColor: '#F5A922',
    height: 50,
    alignItems: 'center',
    borderRadius: 0,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
    elevation: 4,
    marginBottom: 30,
    marginTop: 30,
    width: '85%'
  },
  confirmButtonText: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  focusCell: {
    borderColor: '#F5A922',
    backgroundColor: '#F5A922',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
});
