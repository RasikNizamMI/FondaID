import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  ActivityIndicator,
  DatePickerIOS,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryPicker, {FlagButton} from 'react-native-country-picker-modal';
import {postRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';
import {setData} from '../Utils/AsyncStorageUtil';
import {Picker} from '@react-native-picker/picker';
import {SelectList} from 'react-native-dropdown-select-list';
import {COLORS, FONTS} from '../assets/Colors';
import CommonModal from '../component/CommonModal';
import PhoneInput from 'react-native-phone-number-input';
import withInternetConnectivity from '../Utils/withInternetConnectivity';

const RegisterScreen = ({navigation}) => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    surName: '',
    birthName: '',
    placeOfBirth: '',
    phoneNumber: '',
    email: '',
    startDate: '',
    nationality: null,
    nativeCountry: null,
    gender: '',
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showNativeCountryPicker, setShowNativeCountryPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryCodeNationality, setCountryCodeNationality] = useState('');
  const [countryCodeNative, setCountryCodeNative] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('Date of Birth');
  const [selectedDocumentType, setSelectedDocumentType] = useState({ key: '', value: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalHeader, setModalHeader] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [callingCodeValue, setCallingCodeValue] = useState('+33');
  const [defaultCode, setDefaultCode] = useState('FR')
  const documentTypes = [
    {key: 'M', value: 'Male'},
    {key: 'F', value: 'Female'},
    {key: 'O', value: 'Other'},
  ];
  // Calculate 18 years ago from today
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );

  const [startDate, setStartDate] = useState(eighteenYearsAgo);

  const convertToThreeDigitCode = twoDigitCode => {
    const codeMappings = {
      AF: 'AFG',
      AL: 'ALB',
      DZ: 'DZA',
      AS: 'ASM',
      AD: 'AND',
      AO: 'AGO',
      AI: 'AIA',
      AQ: 'ATA',
      AG: 'ATG',
      AR: 'ARG',
      AM: 'ARM',
      AW: 'ABW',
      AU: 'AUS',
      AT: 'AUT',
      AZ: 'AZE',
      BS: 'BHS',
      BH: 'BHR',
      BD: 'BGD',
      BB: 'BRB',
      BY: 'BLR',
      BE: 'BEL',
      BZ: 'BLZ',
      BJ: 'BEN',
      BM: 'BMU',
      BT: 'BTN',
      BO: 'BOL',
      BA: 'BIH',
      BW: 'BWA',
      BV: 'BVT',
      BR: 'BRA',
      IO: 'IOT',
      VG: 'VGB',
      BN: 'BRN',
      BG: 'BGR',
      BF: 'BFA',
      BI: 'BDI',
      KH: 'KHM',
      CM: 'CMR',
      CA: 'CAN',
      CV: 'CPV',
      BQ: 'BES',
      KY: 'CYM',
      CF: 'CAF',
      TD: 'TCD',
      CL: 'CHL',
      CN: 'CHN',
      CX: 'CXR',
      CC: 'CCK',
      CO: 'COL',
      KM: 'COM',
      CK: 'COK',
      CR: 'CRI',
      HR: 'HRV',
      CU: 'CUB',
      CW: 'CUW',
      CY: 'CYP',
      CZ: 'CZE',
      CD: 'COD',
      DK: 'DNK',
      DJ: 'DJI',
      DM: 'DMA',
      DO: 'DOM',
      EC: 'ECU',
      EG: 'EGY',
      SV: 'SLV',
      GQ: 'GNQ',
      ER: 'ERI',
      EE: 'EST',
      SZ: 'SWZ',
      ET: 'ETH',
      FK: 'FLK',
      FO: 'FRO',
      FJ: 'FJI',
      FI: 'FIN',
      FR: 'FRA',
      GF: 'GUF',
      PF: 'PYF',
      TF: 'ATF',
      GA: 'GAB',
      GM: 'GMB',
      GE: 'GEO',
      DE: 'DEU',
      GH: 'GHA',
      GI: 'GIB',
      GR: 'GRC',
      GL: 'GRL',
      GD: 'GRD',
      GP: 'GLP',
      GU: 'GUM',
      GT: 'GTM',
      GG: 'GGY',
      GN: 'GIN',
      GW: 'GNB',
      GY: 'GUY',
      HT: 'HTI',
      HM: 'HMD',
      HN: 'HND',
      HU: 'HUN',
      IS: 'ISL',
      IN: 'IND',
      ID: 'IDN',
      IR: 'IRN',
      IQ: 'IRQ',
      IE: 'IRL',
      IM: 'IMN',
      IL: 'ISR',
      IT: 'ITA',
      CI: 'CIV',
      JM: 'JAM',
      JP: 'JPN',
      JE: 'JEY',
      JO: 'JOR',
      KZ: 'KAZ',
      KE: 'KEN',
      XK: 'XKX',
      KW: 'KWT',
      KG: 'KGZ',
      LA: 'LAO',
      LV: 'LVA',
      LB: 'LBN',
      LS: 'LSO',
      LR: 'LBR',
      LY: 'LBY',
      LI: 'LIE',
      LT: 'LTU',
      LU: 'LUX',
      MO: 'MAC',
      MK: 'MKD',
      MG: 'MDG',
      MW: 'MWI',
      MY: 'MYS',
      MV: 'MDV',
      ML: 'MLI',
      MT: 'MLT',
      MH: 'MHL',
      MQ: 'MTQ',
      MR: 'MRT',
      MU: 'MUS',
      YT: 'MYT',
      MX: 'MEX',
      FM: 'FSM',
      MD: 'MDA',
      MC: 'MCO',
      MN: 'MNG',
      ME: 'MNE',
      MS: 'MSR',
      MA: 'MAR',
      MZ: 'MOZ',
      MM: 'MMR',
      NA: 'NAM',
      NR: 'NRU',
      NP: 'NPL',
      NL: 'NLD',
      NC: 'NCL',
      NZ: 'NZL',
      NI: 'NIC',
      NE: 'NER',
      NG: 'NGA',
      NU: 'NIU',
      NF: 'NFK',
      KP: 'PRK',
      MP: 'MNP',
      NO: 'NOR',
      OM: 'OMN',
      PK: 'PAK',
      PW: 'PLW',
      PS: 'PSE',
      PA: 'PAN',
      PG: 'PNG',
      PY: 'PRY',
      PE: 'PER',
      PH: 'PHL',
      PN: 'PCN',
      PL: 'POL',
      PT: 'PRT',
      PR: 'PRI',
      QA: 'QAT',
      CG: 'COG',
      RO: 'ROU',
      RU: 'RUS',
      RW: 'RWA',
      RE: 'REU',
      BL: 'BLM',
      SH: 'SHN',
      KN: 'KNA',
      LC: 'LCA',
      MF: 'MAF',
      PM: 'SPM',
      VC: 'VCT',
      WS: 'WSM',
      SM: 'SMR',
      SA: 'SAU',
      SN: 'SEN',
      RS: 'SRB',
      SC: 'SYC',
      SL: 'SLE',
      SG: 'SGP',
      SX: 'SXM',
      SK: 'SVK',
      SI: 'SVN',
      SB: 'SLB',
      SO: 'SOM',
      ZA: 'ZAF',
      GS: 'SGS',
      KR: 'KOR',
      SS: 'SSD',
      ES: 'ESP',
      LK: 'LKA',
      SD: 'SDN',
      SR: 'SUR',
      SJ: 'SJM',
      SE: 'SWE',
      CH: 'CHE',
      SY: 'SYR',
      ST: 'STP',
      TW: 'TWN',
      TJ: 'TJK',
      TZ: 'TZA',
      TH: 'THA',
      TL: 'TLS',
      TG: 'TGO',
      TK: 'TKL',
      TO: 'TON',
      TT: 'TTO',
      TN: 'TUN',
      TR: 'TUR',
      TM: 'TKM',
      TC: 'TCA',
      TV: 'TUV',
      UG: 'UGA',
      UA: 'UKR',
      AE: 'ARE',
      GB: 'GBR',
      US: 'USA',
      UM: 'UMI',
      VI: 'VIR',
      UY: 'URY',
      UZ: 'UZB',
      VU: 'VUT',
      VA: 'VAT',
      VE: 'VEN',
      VN: 'VNM',
      WF: 'WLF',
      EH: 'ESH',
      YE: 'YEM',
      ZM: 'ZMB',
      ZW: 'ZWE',
      KI: 'KIR',
      HK: 'HKG',
      AX: 'ALA',
    };

    return codeMappings[twoDigitCode] || twoDigitCode;
  };

  const threeDigitCodeNationality = convertToThreeDigitCode(countryCodeNationality);

  const threeDigitCodeNativeCountry = convertToThreeDigitCode(countryCodeNative);

  const handleCountryPicker = () => {
    setShowNativeCountryPicker(false);
    setShowCountryPicker(!showCountryPicker);
  };

  const handleNativeCountryPicker = () => {
    setShowCountryPicker(false);
    setShowNativeCountryPicker(!showNativeCountryPicker);
  };

  const isFieldEmpty = fieldValue => {
    if (typeof fieldValue === 'string') {
      const trimmedValue = fieldValue.trim();
      return trimmedValue === '';
    }
    return !fieldValue;
  };

  const validateAlphabets = value => /^[A-Za-z]+$/.test(value);

  const validateEmail = email => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = phoneNumber => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleRegister = () => {
    // Validate all form fields
    if (
      isFieldEmpty(formValues.firstName) ||
      isFieldEmpty(formValues.surName) ||
      isFieldEmpty(formValues.birthName) ||
      isFieldEmpty(formValues.placeOfBirth) ||
      isFieldEmpty(formValues.nationality) ||
      isFieldEmpty(formValues.nativeCountry) ||
      isFieldEmpty(formValues.phoneNumber) ||
      isFieldEmpty(formValues.email) ||
      isFieldEmpty(selectedDocumentType) ||
      isFieldEmpty(startDate)
    ) {
      console.log(selectedDocumentType);
      setApiResponseMessage('Please fill in all required fields');
      return;
    }

    // if (!validateAlphabets(formValues.firstName)) {
    //   setApiResponseMessage('First Name should be alphabets');
    //   return;
    // }

    // if (!validateAlphabets(formValues.surName)) {
    //   setApiResponseMessage('Sur Name should be alphabets');
    //   return;
    // }

    // if (!validateAlphabets(formValues.birthName)) {
    //   setApiResponseMessage('Birth Name should be alphabets');
    //   return;
    // }

    // if (!validateAlphabets(formValues.placeOfBirth)) {
    //   setApiResponseMessage('Place Of Birth should be alphabets');
    //   return;
    // }

    if (!validatePhoneNumber(formValues.phoneNumber)) {
      setApiResponseMessage('Please enter a 10-digit phone number');
      return;
    }

    if (!validateEmail(formValues.email)) {
      setApiResponseMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);
    console.log( formValues.nationality);
    const callingCodeString = callingCodeValue.toString();
    console.log(callingCodeString);
    const formattedStartDate = formatDate(startDate);

    const headers = {
      'Content-Type': 'application/json',
    };

    const requestBody = {
      first_name: formValues.firstName,
      sur_name: formValues.surName,
      birth_name: formValues.birthName,
      date_of_birth: formattedStartDate,
      email_id: (formValues.email.toLowerCase()),
      place_of_birth: formValues.placeOfBirth,
      phone_number: formValues.phoneNumber,
      phone_number_country_code: callingCodeString,
      nationality: formValues.nationality.name,
      nationality_country_code: threeDigitCodeNationality,
      native_country: formValues.nativeCountry.name,
      native_country_code: threeDigitCodeNativeCountry,
      gender: selectedDocumentType.key,
    };
    console.log(JSON.stringify(requestBody));
    postRequest(API_ENDPOINTS.REGISTERVERIFYOTP, requestBody,
      headers,)
      .then(response => {
        console.log(JSON.stringify(response));
        if (
          response.responseCode === 'F200'
        ) {
          console.log("1234")
          setData('refID', response.refId);
          setData('emailID', (formValues.email.toLowerCase()));
          setData('phoneNumber', formValues.phoneNumber);
          setData('firstName', formValues.firstName);
          setData('surName', formValues.surName);
          setData('birthName', formValues.birthName);
          setData('dateOfBirth', formattedStartDate);
          setData('placeOfBirth', formValues.placeOfBirth);
          setData('nationality', formValues.nationality.name);
          setData('nativeCountry', formValues.nativeCountry.name);
          setData('gender', selectedDocumentType.key);
          setData('nationalityCode', countryCodeNationality);
          // navigation.navigate('OTPVerificationScreen');
          setModalVisible(true);
          setErrorMessage(response.responseMessage);
          setModalColor(COLORS.PRIMARY);
          setModalImage(require('../assets/images/sucess.png'));
          setModalHeader('Success');
        } else {
          setModalVisible(true);
          setModalColor(COLORS.ERROR);
          setModalImage(require('../assets/images/error.png'))
          setModalHeader('Error');
          setErrorMessage(response.responseMessage);
          setApiResponseMessage(response.responseMessage);
        }
      })
      .catch(error => {
        setModalVisible(true);
          setModalColor(COLORS.ERROR);
          setModalImage(require('../assets/images/error.png'))
          setModalHeader('Error')
        setApiResponseMessage(error)
        console.log('POST error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const handleStartDateChange = (event, date) => {
    setShowStartDatePicker(false);
    setShowStartDatePicker(Platform.OS === 'ios');
    if (date) {
      setStartDate(date);
      const formattedDate = formatDate(date); // Format the selected date
      setSelectedStartDate(formattedDate);
    }
  };

  const formatDate = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const sucess = () => {
    setModalVisible(false);
    navigation.navigate('OTPVerificationScreen');
  };


  return (
    <View style={styles.mainBody}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          alignSelf: 'center',
        }}/>
      ) : (
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <View>
            <View style={styles.headerView}>
              <Feather
                onPress={() => navigation.goBack(null)}
                style={styles.headerIcon}
                name="chevron-left"
                size={25}
                color={COLORS.PRIMARY}
              />
              <Text style={styles.headerText}>Register Fonda Account</Text>
            </View>

            {/* First Name */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>First Name</Text>
              <TextInput
                value={formValues.firstName}
                style={styles.inputStyle}
                onChangeText={text =>
                  setFormValues({...formValues, firstName: text})
                }
                placeholder="Enter First Name"
                placeholderTextColor={COLORS.SUBTEXT}
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="next"
                blurOnSubmit={false}
                maxLength={200}
              />
            </View>

            {/* Surname */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Surname</Text>
              <TextInput
                value={formValues.surName}
                style={styles.inputStyle}
                onChangeText={text =>
                  setFormValues({...formValues, surName: text})
                }
                placeholder="Enter Surname"
                placeholderTextColor={COLORS.SUBTEXT}
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="next"
                blurOnSubmit={false}
                maxLength={200}
              />
            </View>

            {/* Birth Name */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Birth Name</Text>
              <TextInput
                value={formValues.birthName}
                style={styles.inputStyle}
                onChangeText={text =>
                  setFormValues({...formValues, birthName: text})
                }
                placeholder="Enter Birth Name"
                placeholderTextColor={COLORS.SUBTEXT}
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="next"
                blurOnSubmit={false}
                maxLength={200}
              />
            </View>

            {/* Gender */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Gender</Text>
              <SelectList
                placeholder={selectedDocumentType.key === '' ? "Choose Gender" : documentTypes.find(item => item.key === selectedDocumentType.key).value}
                boxStyles={styles.dropdowmBox}
                dropdownStyles={styles.dropdown}
                inputStyles={{fontSize: 16, color: COLORS.SUBTEXT,  fontFamily: FONTS.Regular,}}
                dropdownTextStyles={{fontSize: 16, fontFamily: FONTS.Regular,color: COLORS.TEXTCOLOR}}
                setSelected={(key,value) => setSelectedDocumentType({ key : key, value: value })} // Set the selected document type
                data={documentTypes}
                save="key" // Save the key of the selected item
                label={selectedDocumentType.value}
              />
            </View>

            {/* Date of Birth */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Date of Birth</Text>
              <TouchableOpacity onPress={showStartDatePickerModal}>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    maximumDate={eighteenYearsAgo}
                    onChange={handleStartDateChange}
                  />
                )}
                <View style={styles.datePickerView}>
                  <View style={styles.datePickerViews}>
                    <Text style={styles.datePickerText}>
                      {selectedStartDate}
                    </Text>
                    <Image
                      source={require('../assets/images/Date.png')}
                      // tintColor={Colors.primaryColor}
                      style={styles.datePickerIcon}></Image>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Nationality */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Nationality</Text>
              <TouchableOpacity onPress={handleCountryPicker}>
                <View style={styles.countryPickerButton}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FlagButton withEmoji={formValues.nationality? true : false} countryCode={countryCodeNationality} />
                  <Text style={styles.placeholderText}>
                    {formValues.nationality
                      ? formValues.nationality.name
                      : 'Select Nationality'}
                  </Text>
                  </View>
                  <View style={{marginRight: 20}}>
                  <Feather name="chevron-down" size={15} color={'#999999'}/>
                  </View>
                </View>
              </TouchableOpacity>
              {showCountryPicker && (
                <CountryPicker
                  visible={showCountryPicker}
                  withFilter={true}
                  withFlag={true}
                  withCountryNameButton={true}
                  withAlphaFilter={false}
                  withCallingCode={false}
                  withEmoji={false}
                  onSelect={country => {
                    setFormValues({
                      ...formValues,
                      nationality: country,
                    });
                    setCountryCodeNationality(country.cca2);
                    setShowCountryPicker(false);
                  }}
                />
              )}
            </View>

            {/* Place of Birth */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Place of Birth</Text>
              <TextInput
                value={formValues.placeOfBirth}
                style={styles.inputStyle}
                onChangeText={text =>
                  setFormValues({...formValues, placeOfBirth: text})
                }
                placeholder="Enter Place of Birth"
                placeholderTextColor={COLORS.SUBTEXT}
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="next"
                blurOnSubmit={false}
                maxLength={200}
              />
            </View>

            {/* Native Country */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Native Country</Text>
              <TouchableOpacity onPress={handleNativeCountryPicker}>
                <View style={styles.countryPickerButton}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FlagButton withEmoji={formValues.nativeCountry? true : false} countryCode={countryCodeNative} />
                  <Text style={styles.placeholderText}>
                    {formValues.nativeCountry
                      ? formValues.nativeCountry.name
                      : 'Select Native Country'}
                  </Text>
                  </View>
                  <View style={{marginRight: 20}}>
                  <Feather name="chevron-down" size={15} color={'#999999'}/>
                  </View>
                  
                </View>
              </TouchableOpacity>
              {showNativeCountryPicker && (
                <CountryPicker
                  countryCode={countryCodeNative}
                  visible={showNativeCountryPicker}
                  withFilter={true}
                  withFlag={true}
                  withCountryNameButton={true}
                  withAlphaFilter={false}
                  withCallingCode={false}
                  withEmoji={false}
                  onSelect={country => {
                    setFormValues({
                      ...formValues,
                      nativeCountry: country,
                    });
                    setCountryCodeNative(country.cca2);
                    setShowNativeCountryPicker(false);
                  }}
                />
              )}
            </View>

            {/* Phone Number */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Phone Number</Text>
              <PhoneInput
                defaultValue={formValues.phoneNumber}
                defaultCode={defaultCode}
                layout="first"
                onChangeText={text =>
                  setFormValues({...formValues, phoneNumber: text})
                }
              textStyle={{ color: COLORS.SUBTEXT,
                fontFamily: FONTS.Regular,
                fontSize: 16,}}
                containerStyle={{
                  flex: 1,
                  width: '100%',
                  height: 50,
                  color: COLORS.SUBTEXT,
                  elevation: 4,
                  backgroundColor: COLORS.WHITE,
                  borderRadius: 10,
                  justifyContent: 'center',
                  marginTop: 10
                }}
                textContainerStyle={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingLeft: 10,
                  fontFamily: FONTS.Regular,
                  fontSize: 16,
                  borderRadius: 10,
                  paddingVertical: 0,
                  color: COLORS.SUBTEXT,
                }}
                textInputStyle={{
                  flex: 1,
                  fontSize: 16,
                  paddingVertical: 0,
                  fontFamily: FONTS.Regular,
                  color: COLORS.SUBTEXT,
                }}
                textInputProps={{ maxLength: 12, placeholder: 'Enter Phone Number', placeholderTextColor: COLORS.SUBTEXT}}
                flagButtonStyle={{width: 50, marginLeft: 10}}
                codeTextStyle={{color: COLORS.SUBTEXT, marginLeft: -5, textAlign: 'center',  paddingVertical: 0,}}
                onChangeCountry={countryData => {
                  const callingCode = countryData.callingCode;
                  console.log(callingCode);
                  setCallingCodeValue(callingCode);
                  setDefaultCode(countryData.cca2)
                }}
              />
            </View>

            {/* Email Address */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Email Address</Text>
              <TextInput
                value={formValues.email}
                style={styles.inputStyle}
                onChangeText={text =>
                  setFormValues({...formValues, email: text})
                }
                placeholder="Enter Email Address"
                placeholderTextColor={COLORS.SUBTEXT}
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="next"
                blurOnSubmit={false}
                maxLength={200}
              />
            </View>

            {/* Error Message */}
            {apiResponseMessage !== '' && (
              <View style={styles.apiResponseMessage}>
                <Text style={styles.apiResponseText}>{apiResponseMessage}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleRegister}>
              <Text style={styles.buttonTextStyle}>OTP Verification</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButtonStyle}
              activeOpacity={0.5}
              onPress={() => navigation.goBack(null)}>
              <View style={styles.scannerView}>
                <Feather
                  style={styles.scannerImage}
                  name="chevron-left"
                  size={25}
                  color={COLORS.PRIMARY}
                />
                <Text style={styles.registerButtonTextStyle}>Back</Text>
              </View>
            </TouchableOpacity>
          </View>
          <CommonModal
            visible={modalVisible}
            onClose={modalHeader == 'Success' ? sucess : closeModal}
            message={errorMessage}
            header={modalHeader}
            color={modalColor}
            imageSource={modalImage}></CommonModal>
        </ScrollView>
      )}
    </View>
  );
};

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
    position: 'absolute',
    left: 0,
  },
  headerText: {
    marginLeft: 10,
    marginTop: 12,
    fontSize: 24,
    color: COLORS.PRIMARY,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    marginRight: 10,
    width: '80%'
  },
  formSection: {
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
  },
  formLabel: {
    color: COLORS.TEXTCOLOR,
    fontFamily: FONTS.Regular,
    fontSize: 14,
  },
  inputStyle: {
    flex: 1,
    color: COLORS.SUBTEXT,
    paddingLeft: 15,
    paddingRight: 15,
    elevation: 4,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    fontFamily: FONTS.Regular,
    fontSize: 16,
    marginTop: 10,
  },
  countryPickerButton: {
    flexDirection: 'row',
    height: 50,
    marginTop: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.WHITE,
    color: COLORS.TEXTCOLOR,
    paddingLeft: 15,
    paddingRight: 5,
    elevation: 4,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  placeholderText: {
    color: COLORS.SUBTEXT,
    fontFamily: FONTS.Regular,
    fontSize: 16,
  },
  datePickerView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.WHITE,
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
    fontSize: 16,
    flex: 1,
    marginTop: 5,
    textAlign: 'left',
    color: COLORS.SUBTEXT,
    marginLeft: 16,
    fontFamily: FONTS.Regular,
  },
  datePickerIcon: {
    height: 25,
    width: 25,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonStyle: {
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 0,
    color: COLORS.WHITE,
    borderColor: COLORS.PRIMARY,
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
  },
  buttonTextStyle: {
    color: COLORS.WHITE,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: FONTS.Regular
  },
  registerButtonStyle: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    color: COLORS.WHITE,
    borderColor: COLORS.WHITE,
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
    elevation: 4,
    marginBottom: 30,
    marginTop: 30,
  },
  registerButtonTextStyle: {
    color: COLORS.PRIMARY,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: FONTS.Regular
  },
  scannerView: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerImage: {
    height: 24,
    width: 24,
    marginRight: 10,
  },
  countryFlag: {
    width: 25,
    height: 20,
    marginRight: 10,
  },
  apiResponseMessage: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apiResponseText: {
    color: '#FF0000',
    fontSize: 16,
    fontFamily: FONTS.Regular
  },

  genderPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdowmBox: {
    marginTop: 10,
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.WHITE,
    elevation: 4,
  },
  dropdown: {
    marginTop: 10,
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.WHITE,
    elevation: 4,
  },
});

export default withInternetConnectivity(RegisterScreen);
