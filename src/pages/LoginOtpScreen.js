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
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

const LoginOtpScreen = ({navigation}) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleOtpConfirm = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.mainBody}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../images/otpImg.png')}
              style={{
                width: 133.38,
                height: 80,
                resizeMode: 'contain',
                margin: 30,
              }}
            />
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.HeaderTextStyle}>Verify your phone number</Text>
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

          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleOtpConfirm}
            // onPress={() => navigation.navigate('DataStoragePolicyScreen')}
          >
            <Text style={styles.buttonTextStyle}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  SectionTextStyle: {
    marginLeft: 35,
    marginRight: 35,
  },
  TextStyle: {
    color: '#37474F',
  },
  HeaderTextStyle: {
    color: '#F5A922',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  SubHeadingTextStyle: {
    marginTop: 20,
    color: '#37474F',
    textAlign: 'center',
    fontSize: 16,
  },
  SubMobileHeaderTextStyle: {
    color: '#F5A922',
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
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
    marginLeft: 35,
    marginRight: 35,
    marginTop: 60,
  },
  registerButtonStyle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    height: 40,
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
  root: {padding: 20},
  title: {textAlign: 'center', fontSize: 40},
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
});
