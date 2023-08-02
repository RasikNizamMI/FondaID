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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

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
  const emailref = useBlurOnFulfill({emailValue, emailCellCount: EMAIL_CELL_COUNT});
  const [emailprops, emailGetCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });


  const handleCaptureFaceID = () => {
    navigation.navigate('CaptureFaceIDScreen');
};

const handleSkip = () => {
    navigation.goBack(null);
};
  return (
    <View style={styles.mainBody}>
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
              Please enter the 4 digit code sent to
            </Text>
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.SubMobileHeaderTextStyle}>625-452-280</Text>
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

            <TouchableOpacity onPress={''}>
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
            <TouchableOpacity onPress={''}>
              <Text
                style={{
                  color: '#007CFF',
                  fontSize: 16,
                  alignSelf: 'center',
                  marginTop: 10,
                  textDecorationLine: 'underline',
                  textDecorationColor: '#007CFF',
                }}>
                Verify Mobile Number
              </Text>
            </TouchableOpacity>
          </View>
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

          <View style={styles.SectionTextStyle}>
            <Text style={styles.SubHeadingTextStyle}>
              Please enter the 4 digit code sent to
            </Text>
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.SubMobileHeaderTextStyle}>contact@307itec.com</Text>
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

            <TouchableOpacity onPress={''}>
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
            <TouchableOpacity onPress={''}>
              <Text
                style={{
                  color: '#007CFF',
                  fontSize: 16,
                  alignSelf: 'center',
                  marginTop: 10,
                  textDecorationLine: 'underline',
                  textDecorationColor: '#007CFF',
                }}>
               Verify Email Acount
              </Text>
            </TouchableOpacity>
          </View>
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
});
