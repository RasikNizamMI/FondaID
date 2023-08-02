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

const ProfileScreen = ({navigation}) => {
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
              color={'#F5A922'}
            />
            <Text style={styles.headerText}>My Profile</Text>
          </View>

          <View style={{backgroundColor: '#FFFFFF', marginTop: 20, marginBottom: 20}}>
          <View style={styles.headerTextView}>
            <Text style={styles.headerTexts}>First Name</Text>
          </View>
          <View style={styles.subheaderView}>
            <Text style={styles.subheaderText}>Jagannath</Text>
          </View>
          </View>

          <View style={styles.headerTextView1}>
            <Text style={styles.headerTexts}>Sur Name</Text>
          </View>
          <View style={styles.subheaderView1}>
            <Text style={styles.subheaderText}>Ranganathan</Text>
          </View>

          <View style={{backgroundColor: '#FFFFFF', marginTop: 20, marginBottom: 20}}>
          <View style={styles.headerTextView}>
            <Text style={styles.headerTexts}>Birth Name</Text>
          </View>
          <View style={styles.subheaderView}>
            <Text style={styles.subheaderText}>Jagannath</Text>
          </View>
          </View>

          <View style={styles.headerTextView1}>
            <Text style={styles.headerTexts}>Date of Birth</Text>
          </View>
          <View style={styles.subheaderView1}>
            <Text style={styles.subheaderText}>30/07/1984</Text>
          </View>

          <View style={{backgroundColor: '#FFFFFF', marginTop: 20, marginBottom: 20}}>
          <View style={styles.headerTextView}>
            <Text style={styles.headerTexts}>Nationality</Text>
          </View>
          <View style={styles.subheaderView}>
            <Text style={styles.subheaderText}>Indian</Text>
          </View>
          </View>

          <View style={styles.headerTextView1}>
            <Text style={styles.headerTexts}>Place of Birth</Text>
          </View>
          <View style={styles.subheaderView1}>
            <Text style={styles.subheaderText}>Pondicherry</Text>
          </View>

          <View style={{backgroundColor: '#FFFFFF', marginTop: 20, marginBottom: 20}}>
          <View style={styles.headerTextView}>
            <Text style={styles.headerTexts}>Native Country</Text>
          </View>
          <View style={styles.subheaderView}>
            <Text style={styles.subheaderText}>India</Text>
          </View>
          </View>

        
          <View style={styles.headerTextView}>
            <Text style={styles.headerTexts}>My Face ID</Text>
          </View>
          <View style={{flexDirection: 'row'}}> 
          <View style={styles.imageView}>
            <Image
              source={require('../images/faceIdIcon.png')}
              style={styles.images}
            />
          </View>
          <TouchableOpacity
            style={{ marginRight: 20, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', height: 50, width: '40%', borderRadius: 10, elevation: 4}}
            activeOpacity={0.5}
            // onPress={handleSubmitPress}
            onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.registerButtonTextStyle}>Change My Face ID</Text>
          </TouchableOpacity>
          </View>

          <View style={{backgroundColor: '#FFFFFF', marginTop: 20, marginBottom: 20, flexDirection: 'row'}}>
            <View style={{flexDirection: 'column'}}>
          <View style={styles.headerTextView}>
            <Text style={styles.headerTexts}>Mobile Number</Text>
          </View>
          <View style={styles.subheaderView}>
            <Text style={styles.subheaderText}>625-452-280</Text>
          </View>
          </View>
          <View style={{marginLeft: 20}}>
          <Image
              source={require('../images/editIcon.png')}
              style={styles.editImages}
            />
          </View>
          </View>


          <View style={{ marginBottom: 20, flexDirection: 'row'}}>
            <View style={{flexDirection: 'column'}}>
            <View style={styles.headerTextView1}>
            <Text style={styles.headerTexts}>Email Address</Text>
          </View>
          <View style={styles.subheaderView1}>
            <Text style={styles.subheaderText}>ranganathanjagannath@gmail.com</Text>
          </View>
          </View>
          <View style={{marginLeft: 20}}>
          <Image
              source={require('../images/editIcon.png')}
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
            onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.registerButtonTextStyle}>Skip</Text>
          </TouchableOpacity>
          <View></View>
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
  headerTextView: { marginLeft: 30,  marginTop: 10},
  headerTexts: {color: '#999999', fontSize: 14},
  subheaderText: {color: '#37474F', fontSize: 14, fontWeight: 'bold'},
  subheaderView: {marginTop: 5, marginLeft: 30,  marginBottom: 10},
  headerTextView1: { marginLeft: 30,  },
  headerTexts1: {color: '#999999', fontSize: 14},
  subheaderText1: {color: '#37474F', fontSize: 14, fontWeight: 'bold'},
  subheaderView1: {marginTop: 5, marginLeft: 30, },
  imageView: {
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 30,
    marginTop: 15,
    height: 180,
    width: 180, 
    backgroundColor: '#FFFFFF',
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
