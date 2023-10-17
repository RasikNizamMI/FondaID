import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {setData, getData, removeData} from '../Utils/AsyncStorageUtil';
import {COLORS, FONTS} from '../assets/Colors';

const ProfileScreen = ({navigation}) => {
  const [userDocument, setUserDocument] = useState('');
  const [userDateOfIssue, setUserDateOfIssue] = useState('');
  const [userDateOfExpiry, setUserDateOfExpiry] = useState('');
  const [userUploadImage, setUserUploadImage] = useState('');
  const [userDocumentNumber, setUserDocumentNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhoneNO, setUserPhoneNO] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userSurName, setUserSurName] = useState('');
  const [userBirthName, setUserBirthName] = useState('');
  const [userDateOfBirth, setUserDateOfBirth] = useState('');
  const [userPlaceOfBirth, setUserPlaceOfBirth] = useState('');
  const [userNationality, setUserNationality] = useState('');
  const [userNativeCountry, setUserNativeCountry] = useState('');
  const [userGender, setUserGender] = useState('');
  const [userCountyCode, setUserCountyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [userUploadImageBase64, setUserUploadImageBase64] = useState('');
  const [userFondaID, setUserFondaID] = useState('');

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      setLoading(true);
      try {
        const storedUserDocument = await getData('addDoScelectDocument');
        const storedUserDateOfIssue = await getData('addDoDateIssue');
        const storedUserDateOfExpiry = await getData('addDoDateExpiry');
        const storedUserUploadImage = await getData('addDoUploadImg');
        const storeUserDocumentNumber = await getData('addDocumentNumber');
        const storedUserEmail = await getData('emailID');
        const storedUserPhoneNO = await getData('phoneNumber');
        const storedUserFirstName = await getData('firstName');
        const storedUserSurName = await getData('surName');
        const storedUserBirthName = await getData('birthName');
        const storedUserDateOfBirth = await getData('dateOfBirth');
        const storedUserPlaceOfBirth = await getData('placeOfBirth');
        const storedUserNationality = await getData('nationality');
        const storedUserNativeCountry = await getData('nativeCountry');
        const storeUserGender = await getData('gender');
        const storeUserCountryCode = await getData('nationalityCode');
        const storedUserUploadImageBase64 = await getData(
          'addDoUploadImgBase64',
        );
        const storedUserFondaID = await getData('fondaId');
        setUserDocument(storedUserDocument);
        setUserDateOfIssue(storedUserDateOfIssue);
        setUserDateOfExpiry(storedUserDateOfExpiry);
        setUserUploadImage(storedUserUploadImage);
        setUserDocumentNumber(storeUserDocumentNumber);
        setUserEmail(storedUserEmail);
        setUserPhoneNO(storedUserPhoneNO);
        setUserFirstName(storedUserFirstName);
        setUserSurName(storedUserSurName);
        setUserBirthName(storedUserBirthName);
        setUserDateOfBirth(storedUserDateOfBirth);
        setUserPlaceOfBirth(storedUserPlaceOfBirth);
        setUserNationality(storedUserNationality);
        setUserNativeCountry(storedUserNativeCountry);
        setUserGender(storeUserGender);
        setUserCountyCode(storeUserCountryCode);
        setUserUploadImageBase64(
          'data:image/jpeg;base64,' + storedUserUploadImageBase64,
        );
        setUserFondaID(storedUserFondaID);
        console.log(storeUserCountryCode);

        if (userDocument === 'passport') {
          console.log('Passport');
        }
        setLoading(false);
      } catch (error) {
        console.log('Error loading remembered credentials:', error);
        setLoading(false);
      }
    };
    loadRememberedCredentials();
  }, []);

  const formatDateOfBirth = dateOfBirth => {
    const date = new Date(dateOfBirth);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleSkip = () => {
    navigation.goBack(null);
  };


  const handleLogin = ({navigation}) => {
    navigation.navigate('LoginOtpScreen');
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
              color={COLORS.PRIMARY}
            />
            <Text style={styles.headerText}>My Profile</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          ) : (
            <>
              <View
                style={{
                  backgroundColor: COLORS.WHITE,
                  marginTop: 20,
                  marginBottom: 20,
                }}>
                <View style={styles.headerTextView}>
                  <Text style={styles.headerTexts}>First Name</Text>
                </View>
                <View style={styles.subheaderView}>
                  <Text style={styles.subheaderText}>{userFirstName}</Text>
                </View>
              </View>
              <View style={styles.headerTextView1}>
                <Text style={styles.headerTexts}>Sur Name</Text>
              </View>
              <View style={styles.subheaderView1}>
                <Text style={styles.subheaderText}>{userSurName}</Text>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.WHITE,
                  marginTop: 20,
                  marginBottom: 20,
                }}>
                <View style={styles.headerTextView}>
                  <Text style={styles.headerTexts}>Birth Name</Text>
                </View>
                <View style={styles.subheaderView}>
                  <Text style={styles.subheaderText}>{userBirthName}</Text>
                </View>
              </View>
              <View style={styles.headerTextView1}>
                <Text style={styles.headerTexts}>Date of Birth</Text>
              </View>
              <View style={styles.subheaderView1}>
                <Text style={styles.subheaderText}>
                  {formatDateOfBirth(userDateOfBirth)}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.WHITE,
                  marginTop: 20,
                  marginBottom: 20,
                }}>
                <View style={styles.headerTextView}>
                  <Text style={styles.headerTexts}>Nationality</Text>
                </View>
                <View style={styles.subheaderView}>
                  <Text style={styles.subheaderText}>{userNationality}</Text>
                </View>
              </View>
              <View style={styles.headerTextView1}>
                <Text style={styles.headerTexts}>Place of Birth</Text>
              </View>
              <View style={styles.subheaderView1}>
                <Text style={styles.subheaderText}>{userPlaceOfBirth}</Text>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.WHITE,
                  marginTop: 20,
                  marginBottom: 20,
                }}>
                <View style={styles.headerTextView}>
                  <Text style={styles.headerTexts}>Native Country</Text>
                </View>
                <View style={styles.subheaderView}>
                  <Text style={styles.subheaderText}>{userNativeCountry}</Text>
                </View>
              </View>
              <View style={styles.headerTextView}>
                <Text style={styles.headerTexts}>My Face ID</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.imageView}>
                  <Image
                    source={require('../assets/images/faceIdIcon.png')}
                    style={styles.images}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    marginRight: 20,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.WHITE,
                    height: 50,
                    width: '40%',
                    borderRadius: 10,
                    elevation: 4,
                  }}
                  activeOpacity={0.5}
                  onPress={" "}>
                 
                  <Text style={styles.registerButtonTextStyle}>
                    Change My Face ID
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.WHITE,
                  marginTop: 20,
                  marginBottom: 20,
                  flexDirection: 'row',
                }}>
                <View style={{flexDirection: 'column'}}>
                  <View style={styles.headerTextView}>
                    <Text style={styles.headerTexts}>Mobile Number</Text>
                  </View>
                  <View style={styles.subheaderView}>
                    <Text style={styles.subheaderText}>{userPhoneNO}</Text>
                  </View>
                </View>
                <View style={{marginLeft: 20}}>
                  <Image
                    source={require('../assets/images/editIcon.png')}
                    style={styles.editImages}
                  />
                </View>
              </View>
              <View style={{marginBottom: 20, flexDirection: 'row'}}>
                <View style={{flexDirection: 'column'}}>
                  <View style={styles.headerTextView1}>
                    <Text style={styles.headerTexts}>Email Address</Text>
                  </View>
                  <View style={styles.subheaderView1}>
                    <Text style={styles.subheaderText}>{userEmail}</Text>
                  </View>
                </View>
                <View style={{marginLeft: 20}}>
                  <Image
                    source={require('../assets/images/editIcon.png')}
                    style={styles.editImages}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleLogin}>
                <Text style={styles.buttonTextStyle}>Update My Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButtonStyle}
                activeOpacity={0.5}
                // onPress={handleSubmitPress}
                onPress={handleSkip}>
                <Text style={styles.registerButtonTextStyle}>Skip</Text>
              </TouchableOpacity>
              <View></View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F6F8F9',
    alignContent: 'center',
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
  registerButtonStyle: {
    backgroundColor: '#fff',
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
  buttonTextStyle: {
    color: COLORS.WHITE,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: FONTS.Regular
  },
  registerButtonTextStyle: {
    color: COLORS.PRIMARY,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: FONTS.Regular
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
    fontSize: 24,
    color: COLORS.PRIMARY,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
  },
  headerTextView: {marginLeft: 30, marginTop: 10},
  headerTexts: {color: COLORS.SUBTEXT, fontSize: 14, fontFamily: FONTS.Regular},
  subheaderText: {color: COLORS.TEXTCOLOR, fontSize: 14, fontFamily: FONTS.Bold},
  subheaderView: {marginTop: 5, marginLeft: 30, marginBottom: 10},
  headerTextView1: {marginLeft: 30},
  headerTexts1: {color: COLORS.SUBTEXT, fontSize: 14},
  subheaderText1: {color: COLORS.TEXTCOLOR, fontSize: 14, fontFamily: FONTS.Bold},
  subheaderView1: {marginTop: 5, marginLeft: 30},
  imageView: {
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 30,
    marginTop: 15,
    height: 180,
    width: 180,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    elevation: 4,
  },
  images: {
    flex: 1,
    height: 130,
    width: 110,
    resizeMode: 'contain',
  },
  editImages: {
    flex: 1,
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
});
