import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {API_ENDPOINTS} from '../Utils/apiConfig';
import {getRequest, postRequest} from '../Utils/apiUtils';
import {getData, setData} from '../Utils/AsyncStorageUtil';
import {COLORS, FONTS} from '../assets/Colors';
import CommonModal from '../component/CommonModal';
import withInternetConnectivity from '../Utils/withInternetConnectivity';

const CELL_COUNT = 6;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoginOtpScreen = ({navigation}) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [userPhoneNo, setUserPhoneNo] = useState('');
  const [userRefID, setUserRefID] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userFondaID, setUserFondaID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalHeader, setModalHeader] = useState('');

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
      const response = await postRequest(
        API_ENDPOINTS.LOGINVERIFYOTP,
        requestBody,
      );
      console.log(response);
      if (response.responseCode === 'F200') {
        console.log(response);
        setData('jwt_token', response.token);
        handleUser(response.token);
        // setModalVisible(true);
        // setErrorMessage(response.responseMessage);
        // setModalColor(COLORS.PRIMARY);
        // setModalImage(require('../assets/images/sucess.png'))
        // setModalHeader('Success')
      } else {
        setModalVisible(true);
        setErrorMessage(response.responseMessage);
        setModalColor(COLORS.ERROR);
        setModalImage(require('../assets/images/error.png'));
        setModalHeader('Error');
      }
    } catch (error) {
      setModalVisible(true);

      console.log('error', error);
      setErrorMessage('OTP invalid');
    } finally {
      setLoading(false);
    }
  };

  const handleUser = async accessToken => {
    setLoading(true);
    const headers = {
      'Content-Type': 'application/json',
      'access-token': accessToken,
    };
    try {
      const response = await getRequest(
        API_ENDPOINTS.GETUSER + userRefID,
        {},
        headers,
      );
      console.log(JSON.stringify(response));
      setUserFondaID(response.fonda_id);
      setData('fonda_ID', response.fonda_id);
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
      setData('nationalityCode', response.nationality_country_code);
      setData('nativeCode', response.native_country_code);
      navigation.navigate('Home', {screen: 'Dashboard'});
    } catch (error) {
      console.log('error', error);
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    const requestBody = {
      ref_id: userRefID,
    };

    try {
      const response = await postRequest(
        API_ENDPOINTS.LOGINRESENDOTP,
        requestBody,
      );

      if (response.responseCode === 'F200') {
        setModalVisible(true);
        setErrorMessage(response.responseMessage);
        setModalColor(COLORS.PRIMARY);
        setModalImage(require('../assets/images/sucess.png'));
        setModalHeader('Success');
      } else {
        setModalVisible(true);
        setErrorMessage(response.responseMessage);
        setModalColor(COLORS.ERROR);
        setModalImage(require('../assets/images/error.png'));
        setModalHeader('Error');
      }
    } catch (error) {
      console.log('error', error);
      setErrorMessage('Network Issue');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const sucess = () => {
    setModalVisible(false);
    navigation.navigate('Home', {screen: 'Dashboard'});
  };

  const minScreenSize = Math.min(screenWidth, screenHeight);

  return (
    <View style={styles.mainBody}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      ) : (
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Image
              source={require('../assets/images/otpImg.png')}
              style={styles.image}
            />
            <Text style={styles.headerText}>Verify your phone number</Text>
            <Text style={styles.subHeadingText}>
              Please enter the 6-digit code sent to
            </Text>
            <Text style={styles.subMobileHeaderText}>{userPhoneNo}</Text>
            <View style={{marginLeft: 10, marginRight: 10}}>
              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={6}
                rootStyle={styles.codeFiledRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                  <Text
                    key={index}
                    style={[
                      {
                        width: minScreenSize * 0.1, // Adjust as needed
                        height: minScreenSize * 0.1, // Adjust as needed
                        lineHeight: minScreenSize * 0.1,
                        fontSize: 24,
                        borderWidth: 2,
                        borderColor: COLORS.PRIMARY,
                        textAlign: 'center',
                        borderRadius: 10,
                        color: COLORS.WHITE,
                        margin: 5,
                        backgroundColor: symbol ? COLORS.PRIMARY : COLORS.WHITE,
                      },
                      isFocused && styles.focusCell,
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}>
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
              onPress={handleOtpConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>

            <CommonModal
              visible={modalVisible}
              onClose={closeModal}
              message={errorMessage}
              header={modalHeader}
              color={modalColor}
              imageSource={modalImage}></CommonModal>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default withInternetConnectivity(LoginOtpScreen);

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
    color: COLORS.PRIMARY,
    fontSize: 24,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
  },
  subHeadingText: {
    marginTop: 20,
    color: COLORS.TEXTCOLOR,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.Regular,
  },
  subMobileHeaderText: {
    color: COLORS.PRIMARY,
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Bold,
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
    color: COLORS.WHITE,
  },
  resendCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendCodeText: {
    color: COLORS.TEXTCOLOR,
    fontSize: 16,
    fontFamily: FONTS.Regular,
  },
  resendCodeLink: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    marginLeft: 10,
    fontFamily: FONTS.Bold,
  },
  confirmButton: {
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    height: 50,
    alignItems: 'center',
    borderRadius: 0,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
    elevation: 4,
    marginBottom: 30,
    marginTop: 30,
    width: '85%',
    borderRadius: 10,
  },
  confirmButtonText: {
    color: COLORS.WHITE,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: FONTS.Regular,
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
