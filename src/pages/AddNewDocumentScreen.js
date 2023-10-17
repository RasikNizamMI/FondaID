import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Modal
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {SelectList} from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {setData, getData, removeData} from '../Utils/AsyncStorageUtil';
import {COLORS, FONTS} from '../assets/Colors';
import CommonModal from '../component/CommonModal';

const AddNewDocumentScreen = ({navigation}) => {
  const [useDocumentNumber, setUseDocumentNumber] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('Date of Issue');
  const [selectedEndDate, setSelectedEndDate] = useState('Date of Expiry');
  const [filePath, setFilePath] = useState({});
  const [selectedDocumentType, setSelectedDocumentType] = React.useState('');
  const [modalImage, setModalImage] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalHeader, setModalHeader] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const documentTypes = [
    {key: 'passport', value: 'Passport'},
    {key: 'idCard', value: 'ID Card'},
    {key: 'driverLicense', value: "Driver's License"},
    {key: 'healthCard', value: 'Health Card'},
    {key: 'professionalLicense', value: 'Professional License'},
    {key: 'other', value: 'Other'},
  ];

  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  const handleEndDateChange = (event, date) => {
    setShowEndDatePicker(false);
    setShowEndDatePicker(Platform.OS === 'ios');
    if (date) {
      setEndDate(date);
      const formattedDate = date.toDateString(); // Format the selected date
      setSelectedEndDate(formattedDate);
    }
  };

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatePickerModal = () => {
    setShowEndDatePicker(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  // const handleToAddNewDoc = () => {
  //   navigation.navigate('ConfirmDocument');
  // }
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
      includeBase64: true,
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
      includeBase64: true
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

  const handleToAddNewDoc = () => {
    if (
      !selectedDocumentType ||
      !useDocumentNumber ||
      selectedStartDate === 'Date of Issue' ||
      selectedEndDate === 'Date of Expiry' ||
      !filePath.uri
    ) {
      setModalVisible(true);
      setErrorMessage('Please fill in all fields');
      setModalColor(COLORS.PRIMARY);
      setModalImage(require('../assets/images/failur.png'));
      setModalHeader('Error');
      return;
    }else{
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    setData('addDoScelectDocument', selectedDocumentType);
    setData('addDoDateIssue', formattedStartDate);
    setData('addDoDateExpiry', formattedEndDate);
    setData('addDoUploadImg', filePath.uri);
    setData('addDocumentNumber', useDocumentNumber)
    setData('addDoUploadImgBase64', filePath.base64)

    navigation.navigate('ConfirmDocument');
    }
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
            <Text style={styles.headerText}>Add New Document</Text>
          </View>

          <View>
            <SelectList
              placeholder="Choose Document Type"
              boxStyles={styles.dropdowmBox}
              dropdownStyles={styles.dropdown}
              inputStyles={{fontSize: 14, color: COLORS.TEXTCOLOR, fontFamily: FONTS.Regular}}
              dropdownTextStyles={{fontSize: 14, color: COLORS.TEXTCOLOR, fontFamily: FONTS.Regular}}
              setSelected={val => setSelectedDocumentType(val)} // Set the selected document type
              data={documentTypes}
              save="key" // Save the key of the selected item
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              value={useDocumentNumber}
              style={styles.inputStyle}
              onChangeText={UserDocumentNumber =>
                setUseDocumentNumber(UserDocumentNumber)
              }
              placeholder="Document Number" //dummy@abc.com
              placeholderTextColor={COLORS.TEXTCOLOR}
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
              maxLength={12}
            />
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
                  source={require('../assets/images/Date.png')}
                  // tintColor={Colors.primaryColor}
                  style={styles.datePickerIcon}></Image>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={showEndDatePickerModal}>
            {showEndDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}
            <View style={styles.datePickerView}>
              <View style={styles.datePickerViews}>
                <Text style={styles.datePickerText}>{selectedEndDate}</Text>
                <Image
                  source={require('../assets/images/Date.png')}
                  // tintColor={Colors.primaryColor}
                  style={styles.datePickerIcon}></Image>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.uploadView}>
            <Text style={styles.uploadText}>
             Capture a picture of the document along with your FaceID.
            </Text>
          </View>

          <TouchableOpacity onPress={() => handleCameraLaunch()}>
            <View style={styles.uploadImageView}>
              {filePath.uri ? (
                <Image
                  source={{uri: filePath.uri}}
                  style={styles.afterUploadImage}
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
            <Text style={styles.buttonTextStyle}>Preview Document</Text>
          </TouchableOpacity>
         
        </View>
        <CommonModal
        visible={modalVisible}
        onClose={closeModal}
        message={errorMessage}
        header={modalHeader}
        color={modalColor}
        imageSource={modalImage}></CommonModal>
      </ScrollView>
    </View>
  );
};
export default AddNewDocumentScreen;

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
    borderColor: COLORS.WHITE,
    borderRadius: 10,
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
    fontFamily: FONTS.Regular,
  },
  registerButtonTextStyle: {
    color: COLORS.PRIMARY,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: COLORS.TEXTCOLOR,
    paddingLeft: 15,
    paddingRight: 15,
    elevation: 4,
    backgroundColor: COLORS.WHITE,
    fontFamily: FONTS.Regular,
    fontSize: 14,
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
    color: COLORS.PRIMARY,
    textAlign: 'center',
    fontFamily: FONTS.Bold
  },
  dropdowmBox: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.WHITE,
    elevation: 4,
  },
  dropdown: {
    marginTop: 0,
    marginLeft: 30,
    marginRight: 30,
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.WHITE,
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
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.WHITE,
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
fontFamily: FONTS.Regular,
    textAlign: 'left',
    color: COLORS.TEXTCOLOR,
    marginLeft: 16,
  },
  datePickerIcon: {
    height: 25,
    width: 25,
    marginLeft: 10,
    marginRight: 10,
  },
  uploadView: {marginTop: 15, marginLeft: 30},
  uploadText: {color: COLORS.TEXTCOLOR, fontSize: 16, fontFamily: FONTS.Medium},
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
  afterUploadImage: {
    height: 200, // Set your desired height here
    aspectRatio: 1, // Maintain the aspect ratio (1:1)
    resizeMode: 'contain', // You can use other values like 'cover' or 'stretch' based on your needs
  },
  scannerView: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerImage: {height: 24, width: 24, marginRight: 10},
});
