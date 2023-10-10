import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {setData, getData, removeData} from '../Utils/AsyncStorageUtil';
import {postRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
const CELL_COUNT = 6;
const EMAIL_CELL_COUNT = 6;

const OTPVerificationScreen = ({navigation}) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [emailValue, setEmailValue] = useState('');
  const emailref = useBlurOnFulfill({
    emailValue,
    emailCellCount: EMAIL_CELL_COUNT,
  });
  const [emailprops, emailGetCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [userEmail, setUserEmail] = useState('');
  const [userPhoneNO, setUserPhoneNO] = useState('');
  const [userPhoneOTP, setUserPhoneOTP] = useState('');
  const [userEmailOTP, setUserEmailOTP] = useState('');

  const [mobileVerificationSuccess, setMobileVerificationSuccess] =
    useState(false);
  const [mobileVerificationError, setMobileVerificationError] = useState(false);
  const [emailVerificationSuccess, setEmailVerificationSuccess] =
    useState(false);
  const [emailVerificationError, setEmailVerificationError] = useState(false);
  const [userRefID, setuserRefID] = useState('');
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const storedUserEmail = await getData('emailID');
        const storedUserPhoneNO = await getData('phoneNumber');
        const storedUserPhoneOTP = await getData('phoneOTP');
        const storedUserEmailOTP = await getData('emailOTP');
        const storeduserRefID = await getData('refID');

        setUserEmail(storedUserEmail);
        setUserPhoneNO(storedUserPhoneNO);
        setUserPhoneOTP(storedUserPhoneOTP);
        setUserEmailOTP(storedUserEmailOTP);
        setuserRefID(storeduserRefID);
      } catch (error) {
        console.log('Error loading remembered credentials:', error);
      }
    };
    loadRememberedCredentials();
  }, []);

  const handleCaptureFaceID = () => {
    if(mobileVerificationSuccess && emailVerificationSuccess){
      navigation.navigate('CaptureFaceIDScreen');
    }
  };

  const handleSkip = () => {
    navigation.goBack(null);
  };

  const handleMobileResend = () => {
    setLoading(true);
    const requestBody = {
      ref_id: userRefID,
    };

    console.log(API_ENDPOINTS.MOBILERESENDOTP);
    postRequest(API_ENDPOINTS.MOBILERESENDOTP, requestBody)
      .then(response => {
        setLoading(false);
        console.log('response' + JSON.stringify(response));
        if (
          response.responseCode === 'F200'
        ) {
          setLoading(false);
          Alert.alert(response.responseMessage)
        } else {
          setLoading(false);
          setApiResponseMessage(response.Status.responseMessage);
        }
      })
      .catch(error => {
        setApiResponseMessage('POST error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEmailResend = () => {
    setLoading(true);
    const requestBody = {
      ref_id: userRefID,
    };

    console.log(API_ENDPOINTS.EMAILRESENDOTP);
    postRequest(API_ENDPOINTS.EMAILRESENDOTP, requestBody)
      .then(response => {
        setLoading(false);
        console.log('response' + JSON.stringify(response));
        if (
          response.responseCode === 'F200'
        ) {
          setLoading(false);
          Alert.alert(response.responseMessage)
          // setData('emailOTP', response.emailOTP);
          // setUserEmailOTP(response.emailOTP);
        } else {
          setLoading(false);
          setApiResponseMessage(response.responseMessage);
        }
      })
      .catch(error => {
        setApiResponseMessage('POST error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleMobileVerification = () => {
    setLoading(true);
    const requestBody = {
      phone_otp: value,
      ref_id: userRefID,
    };

    console.log(API_ENDPOINTS.REGISTERMOBILEVALIDATE);
    postRequest(API_ENDPOINTS.REGISTERMOBILEVALIDATE, requestBody)
      .then(response => {
        removeData('phoneOTP');
        console.log('response' + JSON.stringify(response));
        if (
          response.responseCode === 'F200'
        ) {
          setLoading(false);
          setMobileVerificationSuccess(true);
          setMobileVerificationError(false); // Reset error state
        } else {
          setApiResponseMessage(response.responseMessage);
          setMobileVerificationSuccess(false);
      setMobileVerificationError(true);
        }
      })
      .catch(error => {
        setLoading(false);
        setApiResponseMessage('POST error:', error);
        setMobileVerificationSuccess(false);
      setMobileVerificationError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEmailVerification = () => {
    setLoading(true);
    const requestBody = {
      email_otp: emailValue,
      ref_id: userRefID,
    };

    console.log(API_ENDPOINTS.REGISTEREMAILVALIDATE);
    postRequest(API_ENDPOINTS.REGISTEREMAILVALIDATE, requestBody)
      .then(response => {
        removeData('phoneOTP');
        console.log('response' + JSON.stringify(response));
        if (
          response.responseCode === 'F200'
        ) {
          setLoading(false);
          setEmailVerificationSuccess(true);
      setEmailVerificationError(false); 
        } else {
          setLoading(false);
          setApiResponseMessage(response.responseMessage);
          setEmailVerificationSuccess(false);
      setEmailVerificationError(true);
        }
      })
      .catch(error => {
        setLoading(false);
        setApiResponseMessage('POST error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const renderMobileVerificationButton = () => {
    if (mobileVerificationSuccess) {
      return (
        <Text style={styles.buttonSuccessTextStyle}>
          Mobile Verified Successfully
        </Text>
      );
    } else {
      return (
        <TouchableOpacity onPress={handleMobileVerification}>
          <Text
            style={{
              color: mobileVerificationError == true ? 'red' : '#007CFF',
              fontSize: 16,
              alignSelf: 'center',
              marginTop: 10,
              textDecorationLine: 'underline',
              textDecorationColor:
                mobileVerificationError == true ? 'red' : '#007CFF',
            }}>
            Verify Mobile Number
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const renderEmailVerificationButton = () => {
    if (emailVerificationSuccess) {
      return (
        <Text style={styles.buttonSuccessTextStyle}>
          Email Verified Successfully
        </Text>
      );
    } else {
      return (
        <TouchableOpacity onPress={handleEmailVerification}>
          <Text
            style={{
              color: emailVerificationError == true ? 'red' : '#007CFF',
              fontSize: 16,
              alignSelf: 'center',
              marginTop: 10,
              textDecorationLine: 'underline',
              textDecorationColor:
                emailVerificationError == true ? 'red' : '#007CFF',
            }}>
            Verify Email Account
          </Text>
        </TouchableOpacity>
      );
    }
  };
  return (
    <View style={styles.mainBody}>
      {loading ? (
        <ActivityIndicator size="large" color="#F5A922" />
      ) : (
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View>
          <View style={styles.headerView}>
            <Feather
              onPress={() => {
                navigation.goBack(null);
              }}
              style={styles.headerIcon}
              name="chevron-left"
              size={25}
              color={'#F5A922'}
            />
            <Text style={styles.headerText}>OTP Verification</Text>
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.HeaderTextStyle}>
              Verify your Mobile number & Email
            </Text>
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.SubHeadingTextStyle}>
              Please enter the 6 digit code sent to
            </Text>
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.SubMobileHeaderTextStyle}>{userPhoneNO}</Text>
          </View>
          <View>
            <CodeField
              ref={ref}
              {...props}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
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
                      width: 50,
                      height: 50,
                      lineHeight: 50,
                      fontSize: 24,
                      borderWidth: 2,
                      borderColor: '#F5A922',
                      textAlign: 'center',
                      borderRadius: 10,
                      color: '#FFFFFF',
                      backgroundColor: symbol ? '#F5A922' : '#FFFFFF',
                    },
                    isFocused && styles.focusCell,
                  ]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#37474F',
                fontSize: 16,
                alignSelf: 'center',
                marginTop: 20,
              }}>
              Didn’t receive a code?
            </Text>
            <Text> </Text>

            <TouchableOpacity onPress={handleMobileResend}>
              <Text
                style={{
                  color: '#F5A922',
                  fontSize: 16,
                  alignSelf: 'center',
                  marginTop: 20,
                }}>
                Resend Code
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{alignSelf: 'center'}}>
            {renderMobileVerificationButton()}
          </View>
          {mobileVerificationSuccess && (
            <View style={styles.SectionTextStyle}>
              <Text
                style={{
                  marginTop: 10,
                  color: '#37474F',
                  textAlign: 'center',
                  fontSize: 13,
                }}>
                Your Mobile Number has been successfully verified!
              </Text>
            </View>
          )}

          <View style={styles.SectionTextStyle}>
            <Text style={styles.SubHeadingTextStyle}>
              Please enter the 6 digit code sent to
            </Text>
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.SubMobileHeaderTextStyle}>{userEmail}</Text>
          </View>
          <View>
            <CodeField
              ref={emailref}
              {...emailprops}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={emailValue}
              onChangeText={setEmailValue}
              cellCount={6}
              rootStyle={styles.codeFiledRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
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
                      backgroundColor: symbol ? '#F5A922' : '#FFFFFF',
                    },
                    isFocused && styles.focusCell,
                  ]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#37474F',
                fontSize: 16,
                alignSelf: 'center',
                marginTop: 20,
              }}>
              Didn’t receive a code?
            </Text>
            <Text> </Text>

            <TouchableOpacity onPress={handleEmailResend}>
              <Text
                style={{
                  color: '#F5A922',
                  fontSize: 16,
                  alignSelf: 'center',
                  marginTop: 20,
                }}>
                Resend Code
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{alignSelf: 'center'}}>
            {renderEmailVerificationButton()}
          </View>
          {emailVerificationSuccess && (
            <View style={styles.SectionTextStyle}>
              <Text
                style={{
                  marginTop: 10,
                  color: '#37474F',
                  textAlign: 'center',
                  fontSize: 13,
                }}>
                Your Email Account has been successfully verified!
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleCaptureFaceID}>
            <Text style={styles.buttonTextStyle}>Capture Face ID</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButtonStyle}
            activeOpacity={0.5}
            // onPress={handleSubmitPress}
            onPress={handleSkip}>
            <View style={styles.scannerView}>
              <Feather
                style={styles.scannerImage}
                name="chevron-left"
                size={25}
                color={'#F5A922'}
              />
              <Text style={styles.registerButtonTextStyle}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      )}
    </View>
  );
};
export default OTPVerificationScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F6F8F9',
    alignContent: 'center',
  },

  headerView: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 16,
    marginTop: 2.5,
    position: 'absolute',
    left: 0,
  },
  headerText: {
    marginTop: 12,
    fontSize: 18,
    color: '#F5A922',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  SectionTextStyle: {
    marginLeft: 35,
    marginRight: 35,
  },
  HeaderTextStyle: {
    color: '#F5A922',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  SubMobileHeaderTextStyle: {
    color: '#F5A922',
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  SubHeadingTextStyle: {
    marginTop: 20,
    color: '#37474F',
    textAlign: 'center',
    fontSize: 16,
  },
  codeFiledRoot: {marginTop: 30, marginRight: 30, marginLeft: 30},
  cell: {
    width: 70,
    height: 70,
    lineHeight: 70,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#F5A922',
    textAlign: 'center',
    borderRadius: 10,
    color: '#FFFFFF',
  },
  focusCell: {
    borderColor: '#F5A922',
    backgroundColor: '#F5A922',
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
    marginBottom: 30,
    marginTop: 30,
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
  scannerView: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerImage: {height: 24, width: 24, marginRight: 10},
  buttonSuccessTextStyle: {
    color: 'green',
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 10,
  },
});
