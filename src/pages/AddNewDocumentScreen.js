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

const AddNewDocumentScreen = ({navigation}) => {
  const [useDocumentNumber, setUseDocumentNumber] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('Date of Issue');
  const [selectedEndDate, setSelectedEndDate] = useState('Date of Expiry');
  const [filePath, setFilePath] = useState({});

  const data = [
    {key: '1', value: 'Mobiles', disabled: true},
    {key: '2', value: 'Appliances'},
    {key: '3', value: 'Cameras'},
    {key: '4', value: 'Computers', disabled: true},
    {key: '5', value: 'Vegetables'},
    {key: '6', value: 'Diary Products'},
    {key: '7', value: 'Drinks'},
  ];

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

const handleToAddNewDoc = () => {
  navigation.navigate('ConfirmDocument');
}

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
            <Text style={styles.headerText}>Add New Document</Text>
          </View>

          <View>
            <SelectList
              placeholder="Choose Document Type"
              boxStyles={styles.dropdowmBox}
              dropdownStyles={styles.dropdown}
              inputStyles={{fontSize: 14, color: '#37474F'}}
              dropdownTextStyles={{fontSize: 14, color: '#37474F'}}
              setSelected={val => setSelected(val)}
              data={data}
              save="value"
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
              placeholderTextColor="#37474F"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
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
                  source={require('../images/Date.png')}
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
                  source={require('../images/Date.png')}
                  // tintColor={Colors.primaryColor}
                  style={styles.datePickerIcon}></Image>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.uploadView}>
            <Text style={styles.uploadText}>
              Upload/Capture a picture of the document along with your FaceID.
            </Text>
          </View>

          <TouchableOpacity onPress={() => captureImage('photo')}>
            <View style={styles.uploadImageView}>
              {filePath.uri ? (
                <Image
                  source={{uri: filePath.uri}}
                  style={styles.uploadImage}
                />
              ) : (
                <Image
                  source={require('../images/camera.png')}
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
          <TouchableOpacity
            style={styles.registerButtonStyle}
            activeOpacity={0.5}
            // onPress={handleSubmitPress}
            onPress={() => navigation.navigate('RegisterScreen')}>
            <View style={styles.scannerView}>
              <Image
                source={require('../images/qrcode.png')}
                style={styles.scannerImage}></Image>
              <Text style={styles.registerButtonTextStyle}>
                Switch to QR Scanner
              </Text>
            </View>
          </TouchableOpacity>
          <View></View>
        </View>
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
