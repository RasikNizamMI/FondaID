import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const ConfirmDocument = ({navigation}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const data = [
    {key: '1', value: 'Mobiles', disabled: true},
    {key: '2', value: 'Appliances'},
    {key: '3', value: 'Cameras'},
    {key: '4', value: 'Computers', disabled: true},
    {key: '5', value: 'Vegetables'},
    {key: '6', value: 'Diary Products'},
    {key: '7', value: 'Drinks'},
  ];

  const handletoSubmitDoc = () => {
    navigation.navigate('SubmitSuccess');
  }

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
            <Text style={styles.headerText}>Document Preview</Text>
          </View>

          <View style={styles.headerTextView}>
            <Text style={styles.headerTexts}>Document Type</Text>
          </View>
          <View style={styles.subheaderView}>
            <Text style={styles.subheaderText}>Driving License</Text>
          </View>

          <View style={styles.headerTextView}>
            <Text style={styles.headerTexts}>Document Type</Text>
          </View>
          <View style={styles.subheaderView}>
            <Text style={styles.subheaderText}>Driving License</Text>
          </View>

          <View style={styles.headerTextView}>
            <Text style={styles.headerTexts}>Document Type</Text>
          </View>
          <View style={styles.subheaderView}>
            <Text style={styles.subheaderText}>Driving License</Text>
          </View>

          <View style={styles.headerTextView}>
            <Text style={styles.headerTexts}>Document Type</Text>
          </View>
          <View style={styles.subheaderView}>
            <Text style={styles.subheaderText}>Driving License</Text>
          </View>

          <View style={styles.headerTextView}>
            <Text style={styles.headerTexts}>Document Preview</Text>
          </View>
          <View style={styles.imageView}>
            <Image
              source={require('../images/documentPreview.png')}
              style={styles.images}
            />
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
            // onPress={handleSubmitPress}
            onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.registerButtonTextStyle}>Skip</Text>
          </TouchableOpacity>
          <View></View>
        </View>
      </ScrollView>
    </View>
  );
};
export default ConfirmDocument;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F6F8F9',
    alignContent: 'center',
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
  headerTextView: {marginTop: 20, marginLeft: 30, marginRight: 30},
  headerTexts: {color: '#999999', fontSize: 14},
  subheaderText: {color: '#37474F', fontSize: 14, fontWeight: 'bold'},
  subheaderView: {marginTop: 5, marginLeft: 30, marginRight: 30},
  imageView: {
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30,
    marginTop: 15,
    height: 300,
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  images: {
    flex: 1,
    width: 255,
    height: 200,
    resizeMode: 'contain',
  },
});
