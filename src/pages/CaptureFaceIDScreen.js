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
  Alert,
  PermissionsAndroid
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {setData, getData, removeData} from '../Utils/AsyncStorageUtil';
import {postRequest, putRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';
import {COLORS, FONTS} from '../assets/Colors';
import CommonModal from '../component/CommonModal';

const CaptureFaceIDScreen = ({navigation}) => {
  const [filePath, setFilePath] = useState({});

  const [userEmail, setUserEmail] = useState('');
  const [userPhoneNO, setUserPhoneNO] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userSurName, setUserSurName] = useState('');
  const [userBirthName, setUserBirthName] = useState('');
  const [userDateOfBirth, setUserDateOfBirth] = useState('');
  const [userPlaceOfBirthl, setUserPlaceOfBirth] = useState('');
  const [userNationality, setUserNationality] = useState('');
  const [userNativeCountry, setUserNativeCountry] = useState('');
  const [userGender, setUserGender] = useState('');
  const [userRefID, setuserRefID] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalHeader, setModalHeader] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleSkip = () => {
    navigation.goBack(null);
  };

  const handleToAddNewDoc = () => {
    setLoading(true);
    console.log('1234567890');
    // Form validation and API call
    const requestBody = {
      ref_id: userRefID,
    };

    console.log(API_ENDPOINTS.CREATEUSER, requestBody);
    putRequest(API_ENDPOINTS.CREATEUSER, requestBody)
      .then(response => {
        console.log('response' + JSON.stringify(response));
        if (response.statusCode === 200) {
          console.log('12345');
          setData('fondaId',response.fondaId);
          setModalVisible(true);
        setErrorMessage(response.message);
        setModalColor(COLORS.PRIMARY);
        setModalImage(require('../assets/images/sucess.png'))
        setModalHeader('Success')
         
        } else {
          console.log('12345678');
           setErrorMessage(response.message);
           setModalVisible(true);
        setModalColor(COLORS.ERROR);
        setModalImage(require('../assets/images/error.png'))
        setModalHeader('Error')
        }
      })
      .catch(error => {
        console.log(error);
        setApiResponseMessage('POST error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
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
        const storeduserRefID = await getData('refID');
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
        setuserRefID(storeduserRefID);
      } catch (error) {
        console.log('Error loading remembered credentials:', error);
      }
    };
    loadRememberedCredentials();
  }, []);

  const handleCameraLaunch = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          // title: 'Cool Photo App Camera Permission',
          // message:
          //   'FondaID Access to camera',
          // buttonNegative: 'Cancel',
          // buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission denied');
        return;
      }
    }

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 550,
      maxWidth: 550,
    };

    launchCamera(options, response => {
      console.log('Response = ', response);
      const {assets} = response;
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        console.log('base64 -> ', assets[0].base64);
      console.log('uri -> ', assets[0].uri);
      console.log('width -> ', assets[0].width);
      console.log('height -> ', assets[0].height);
      console.log('fileSize -> ', assets[0].fileSize);
      console.log('type -> ', assets[0].type);
      console.log('fileName -> ', assets[0].fileName);
      setFilePath(assets[0]);
      }
    });
  };


  const captureImage = type => {
    let options = {
      mediaType: type,
      maxWidth: 550,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      console.log('Response = ', response);
      const {assets} = response;

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode === 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode === 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode === 'others') {
        alert(response.errorMessage);
        return;
      }
      console.log('base64 -> ', assets[0].base64);
      console.log('uri -> ', assets[0].uri);
      console.log('width -> ', assets[0].width);
      console.log('height -> ', assets[0].height);
      console.log('fileSize -> ', assets[0].fileSize);
      console.log('type -> ', assets[0].type);
      console.log('fileName -> ', assets[0].fileName);
      setFilePath(assets[0]);
    });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const sucess = () => {
    setModalVisible(false);
    navigation.navigate('SubmitSuccessScreen');
  }

  return (
    <View style={styles.mainBody}>
      {loading ? (
        // Render the loader or loading indicator here
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
              <Text style={styles.headerText}>Capture Face ID</Text>
            </View>

            <View style={styles.uploadView}>
              <Text style={styles.uploadText}>
                Please look into the camera and look still
              </Text>
            </View>

            <TouchableOpacity onPress={() => handleCameraLaunch()}>
              <View style={styles.uploadImageView}>
                {filePath.uri ? (
                  <Image
                    source={{uri: filePath.uri}}
                    style={styles.uploadImage}
                  />
                ) : (
                  <Image
                    source={require('../assets/images/camera.png')}
                    style={styles.uploadImage}
                  />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleToAddNewDoc}>
              {/* <Text style={styles.buttonTextStyle}>Upload Supporting Documents</Text> */}
              <Text style={styles.buttonTextStyle}>Create Fonda Account</Text>
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
          <CommonModal visible={modalVisible} onClose={modalHeader == 'Success' ? sucess : closeModal} message={errorMessage} header={modalHeader} color={modalColor} imageSource={modalImage}>
      </CommonModal>
        </ScrollView>
      )}
    </View>
  );
};
export default CaptureFaceIDScreen;

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
    borderRadius: 10,
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
});
