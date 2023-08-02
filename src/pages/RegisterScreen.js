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
import {SelectList} from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CountryPicker from 'react-native-country-picker-modal';

const RegisterScreen = ({navigation}) => {
  const [regFirstName, setRegFirstName] = useState('');
  const [regSurName, setRegSurName] = useState('');
  const [regBirthName, setRegBirthName] = useState('');
  const [regPlaceofBirthName, setRegPlaceofBirthName] = useState('');
  const [regPhoneNumber, setRegPhoneNumber] = useState('');
  const [regEmailID, setRegEmailID] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('Date of Birth');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [startDate, setStartDate] = useState(new Date());

  const [countryCodeNationality, setCountryCodeNationality] = useState('');
  const [countryNationality, setCountryNationality] = useState(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [countryCodeNative, setCountryCodeNative] = useState('');
  const [countryNative, setCountryNative] = useState(null);
  const [showNativer, setShowNative] = useState(false);

  const onSelectNationality = country => {
  setCountryCodeNationality(country.cca2);
  setCountryNationality(country);
};

const onSelectNative = country => {
    setCountryCodeNative(country.cca2);
    setCountryNative(country);
  };

  const handleStartDateChange = (event, date) => {
    setShowStartDatePicker(false);
    setShowStartDatePicker(Platform.OS === 'ios');
    if (date) {
      setStartDate(date);
      const formattedDate = date.toDateString(); // Format the selected date
      setSelectedStartDate(formattedDate);
    }
  };

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const formatPhoneNumber = number => {
    const formattedNumber = number.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
    setRegPhoneNumber(formattedNumber);
  };

  const handleCaptureFaceID = () => {
    navigation.navigate('OTPVerificationScreen');
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
            <Text style={styles.headerText}>Register Fonda Account</Text>
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.TextStyle}>First Name</Text>
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              value={regFirstName}
              style={styles.inputStyle}
              onChangeText={RegFirstName => setRegFirstName(RegFirstName)}
              placeholder="Enter First Name" //dummy@abc.com
              placeholderTextColor="#37474F"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.TextStyle}>Surname</Text>
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              value={regSurName}
              style={styles.inputStyle}
              onChangeText={RegSurName => setRegSurName(RegSurName)}
              placeholder="Enter Sur Name" //dummy@abc.com
              placeholderTextColor="#37474F"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.TextStyle}>Birth Name</Text>
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              value={regBirthName}
              style={styles.inputStyle}
              onChangeText={RegBirthName => setRegBirthName(RegBirthName)}
              placeholder="Enter Birth Name" //dummy@abc.com
              placeholderTextColor="#37474F"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.TextStyle}>Date of Birth</Text>
          </View>
          <TouchableOpacity onPress={showStartDatePickerModal}>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}
            <View style={styles.datePickerView}>
              <View style={styles.datePickerViews}>
                <Text style={styles.datePickerText}>{selectedStartDate}</Text>
                <Image
                  source={require('../images/Date.png')}
                  // tintColor={Colors.primaryColor}
                  style={styles.datePickerIcon}></Image>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.TextStyle}>Nationality</Text>
          </View>
          <TouchableOpacity onPress={() => setShowCountryPicker(true)}>
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              marginTop: 5,
              marginLeft: 30,
              marginRight: 30,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#FFFFFF',
              color: '#37474F',
              paddingLeft: 15,
              paddingRight: 5,
              elevation: 4,
              backgroundColor: '#ffffff',
              borderRadius: 10,
              justifyContent: 'space-between',
            }}>
                {showCountryPicker ? (
            <CountryPicker
              countryCode={countryCodeNationality}
              withFilter={true}
              withFlag={true}
              withCountryNameButton={true}
              withAlphaFilter={false}
              withCallingCode={false}
              withEmoji={false}
              onSelect={onSelectNationality}
              visible
            />
            ) : (
                <Text style={styles.TextStyle}>Select Nationality</Text>
            )}
            <Feather
              name="chevron-down"
              size={30}
              color={'#999999'}
            />
           
          </View>
          </TouchableOpacity>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.TextStyle}>Place of Birth</Text>
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              value={regPlaceofBirthName}
              style={styles.inputStyle}
              onChangeText={RegPlaceofBirthName =>
                setRegPlaceofBirthName(RegPlaceofBirthName)
              }
              placeholder="Enter Fonda ID" //dummy@abc.com
              placeholderTextColor="#37474F"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.TextStyle}>Native Country</Text>
          </View>
          <TouchableOpacity onPress={() => setShowNative(true)}>
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              marginTop: 5,
              marginLeft: 30,
              marginRight: 30,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#FFFFFF',
              color: '#37474F',
              paddingLeft: 15,
              paddingRight: 5,
              elevation: 4,
              backgroundColor: '#ffffff',
              borderRadius: 10,
              justifyContent: 'space-between',
            }}>
                {showCountryPicker ? (
            <CountryPicker
              countryCode={countryCodeNative}
              withFilter={true}
              withFlag={true}
              withCountryNameButton={true}
              withAlphaFilter={false}
              withCallingCode={false}
              withEmoji={false}
              onSelect={onSelectNative}
              visible
            />
            ) : (
                <Text style={styles.TextStyle}>Select Nationality</Text>
            )}
            <Feather
              name="chevron-down"
              size={30}
              color={'#999999'}
            />
           
          </View>
          </TouchableOpacity>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.TextStyle}>Phone Number</Text>
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              value={regPhoneNumber}
              style={styles.inputStyle}
              onChangeText={formatPhoneNumber}
              placeholder="Enter Fonda ID" //dummy@abc.com
              placeholderTextColor="#37474F"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionTextStyle}>
            <Text style={styles.TextStyle}>Email Address</Text>
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              value={regEmailID}
              style={styles.inputStyle}
              onChangeText={RegEmailID => setRegEmailID(RegEmailID)}
              placeholder="Enter Fonda ID" //dummy@abc.com
              placeholderTextColor="#37474F"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleCaptureFaceID}>
            <Text style={styles.buttonTextStyle}>OTP Verification</Text>
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
export default RegisterScreen;

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
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
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
  inputStyle: {
    flex: 1,
    color: '#37474F',
    paddingLeft: 15,
    paddingRight: 15,
    elevation: 4,
    backgroundColor: '#ffffff',
    borderRadius: 10,
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
  dropdowmBox: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  dropdown: {
    marginTop: 0,
    marginLeft: 30,
    marginRight: 30,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  datePickerView: {
    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 5,
    borderWidth: 1,
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    elevation: 4,
    height: 50,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  datePickerViews: {
    flexDirection: 'row',
    width: '100%',
  },
  datePickerText: {
    fontSize: 14,
    flex: 1,
    marginTop: 5,

    textAlign: 'left',
    color: '#37474F',
    marginLeft: 16,
  },
  datePickerIcon: {
    height: 25,
    width: 25,
    marginLeft: 10,
    marginRight: 10,
  },
  uploadView: {marginTop: 15, marginLeft: 30},
  uploadText: {color: '#37474F', fontSize: 16},
  uploadImageView: {
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30,
    marginTop: 15,
  },
  uploadImage: {
    height: 350,
    resizeMode: 'contain',
  },
  scannerView: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerImage: {height: 24, width: 24, marginRight: 10},
  SectionStyle: {
    flexDirection: 'row',
    height: 50,
    marginTop: 5,
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
});
