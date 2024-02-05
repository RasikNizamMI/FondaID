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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {getData} from '../Utils/AsyncStorageUtil';
import {postRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';
import {convertImageToBase64} from 'react-native-image-base64';
import {COLORS, FONTS} from '../assets/Colors';
import CommonModal from '../component/CommonModal';
import withInternetConnectivity from '../Utils/withInternetConnectivity';

const ConfirmDocument = ({navigation}) => {
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalHeader, setModalHeader] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    const loadRememberedCredentials = async () => {
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
        const storedUserNativeCountry = await getData('nationalityCode');
        const storeUserGender = await getData('gender');
        const storeUserCountryCode = await getData('nationalityCode');
        const storedUserUploadImageBase64 = await getData(
          'addDoUploadImgBase64',
        );
        const storedJwtToken = await getData('jwt_token');
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
        setUserUploadImageBase64(storedUserUploadImageBase64);
        setUserFondaID(storedUserFondaID);
        setJwtToken(storedJwtToken);

        if (userDocument === 'passport') {
        }
      } catch (error) {}
    };
    loadRememberedCredentials();
  }, []);

  const formatDateOfBirth = dateOfBirth => {
    const date = new Date(dateOfBirth);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handletoSubmitDoc = () => {
    setLoading(true);

    const headers = {
      'Content-Type': 'application/json',
      'access-token': jwtToken,
    };

    const requestBody = {
      fonda_id: userFondaID,
      payload: {
        first_name: userFirstName,
        last_name: userSurName,
        date_of_birth: formatDateOfBirth(userDateOfBirth),
        place_of_birth: userPlaceOfBirth,
        gender: userGender,
        country: userNativeCountry,
        doc_id: userDocumentNumber,
        doc_type: userDocument,
        doc_date_of_issue: userDateOfIssue,
        doc_date_of_expiration: userDateOfExpiry,
        face_image: 'imageToProcess',
        face_template: 'imageToProcess',
      },
      images: {
        imageToProcess: userUploadImageBase64,
      },
    };
    postRequest(API_ENDPOINTS.UPLOADDOCUMENT, requestBody, headers)
      .then(response => {
        if (response.responseCode === 'F200') {
          setModalVisible(true);
          setErrorMessage(response.message);
          setModalColor(COLORS.PRIMARY);
          setModalImage(require('../assets/images/sucess.png'));
          setModalHeader('Success');
        } else {
          setModalVisible(true);
          setErrorMessage(response.message);
          setModalColor(COLORS.ERROR);
          setModalImage(require('../assets/images/error.png'));
          setModalHeader('Error');
        }
      })
      .catch(error => {
        setModalVisible(true);
        setErrorMessage('No face Detected');
        setModalColor(COLORS.ERROR);
        setModalImage(require('../assets/images/error.png'));
        setModalHeader('Error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleSkip = () => {
    navigation.goBack(null);
  };

  const sucess = () => {
    setModalVisible(false);
    navigation.navigate('SubmitSuccess');
  };

  return (
    <View style={styles.mainBody}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
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
                color={COLORS.PRIMARY}
              />
              <Text style={styles.headerText}>Document Preview</Text>
            </View>

            <View style={styles.headerTextView}>
              <Text style={styles.headerTexts}>Document Type</Text>
            </View>
            <View style={styles.subheaderView}>
              <Text style={styles.subheaderText}>{userDocument}</Text>
            </View>

            <View style={styles.headerTextView}>
              <Text style={styles.headerTexts}>Document Number</Text>
            </View>
            <View style={styles.subheaderView}>
              <Text style={styles.subheaderText}>{userDocumentNumber}</Text>
            </View>

            <View style={styles.headerTextView}>
              <Text style={styles.headerTexts}>Date of Issue</Text>
            </View>
            <View style={styles.subheaderView}>
              <Text style={styles.subheaderText}>{userDateOfIssue}</Text>
            </View>

            <View style={styles.headerTextView}>
              <Text style={styles.headerTexts}>Date of Expiry</Text>
            </View>
            <View style={styles.subheaderView}>
              <Text style={styles.subheaderText}>{userDateOfExpiry}</Text>
            </View>

            <View style={styles.headerTextView}>
              <Text style={styles.headerTexts}>Document Preview</Text>
            </View>
            <View style={styles.imageView}>
              <Image source={{uri: userUploadImage}} style={styles.images} />
            </View>

            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handletoSubmitDoc}>
              <Text style={styles.buttonTextStyle}>Submit Document</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButtonStyle}
              activeOpacity={0.5}
              onPress={handleSkip}>
              <Text style={styles.registerButtonTextStyle}>Skip</Text>
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

export default withInternetConnectivity(ConfirmDocument);

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
  buttonTextStyle: {
    color: COLORS.WHITE,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: FONTS.Regular,
  },
  registerButtonTextStyle: {
    color: COLORS.PRIMARY,
    paddingVertical: 10,
    fontSize: 16,
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
  headerTextView: {marginTop: 20, marginLeft: 30, marginRight: 30},
  headerTexts: {color: COLORS.SUBTEXT, fontSize: 14, fontFamily: FONTS.Regular},
  subheaderText: {
    color: COLORS.TEXTCOLOR,
    fontSize: 14,
    fontFamily: FONTS.Bold,
  },
  subheaderView: {marginTop: 5, marginLeft: 30, marginRight: 30},
  imageView: {
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30,
    marginTop: 15,
    height: 300,
    backgroundColor: COLORS.WHITE,
    elevation: 4,
  },
  images: {
    flex: 1,
    width: 255,
    height: 200,
    resizeMode: 'contain',
  },
});
