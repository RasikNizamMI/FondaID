import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Linking,
  Image,
  Share,
  Clipboard,
  FlatList,
} from 'react-native';
import Navigation from '../navigation/Navigator';
import TouchID from 'react-native-touch-id';
import {COLORS, FONTS} from '../assets/Colors';
import withInternetConnectivity from '../Utils/withInternetConnectivity';

const TouchIDLogin = ({navigation}) => {
  const [iconStatus, setIconStatus] = useState(false);
  const [openItemId, setOpenItemId] = useState(null);

  const handleShare = async () => {
    navigation.navigate('SharingScreen');
  };

  const data = [
    {
      id: '1',
      title: 'Passport',
      number: 'M875ZD1228',
      issueDate: '02-02-2014',
      validUntil: '28-02-2024',
    },
    {
      id: '2',
      title: 'Passport1',
      number: 'M875ZD1228',
      issueDate: '04-02-2014',
      validUntil: '04-02-2024',
    },
    // Add more data objects here...
  ];

  const handleCopyToClipboard = () => {
    navigation.navigate('SharingScreen');
  };

  const handleIconClick = itemId => {
    // setIconStatus(itemId === data.id && !iconStatus);
    setOpenItemId(itemId === openItemId ? null : itemId);
  };

  const handleToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handleTouchID = () => {
    TouchID.authenticate('Authenticate to continue')
      .then(success => {
        
            navigation.navigate('LoginOtpScreen');
        // TouchID authentication successful
        console.log('TouchID authentication successful');
      })
      .catch(error => {
        // TouchID authentication failed or canceled
        console.log('TouchID authentication failed:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Touch ID login</Text>
      <TouchableOpacity onPress={handleTouchID}>
      <View
        style={{justifyContent: 'center', marginTop: 20, alignItems: 'center'}}>
        <Image
          source={require('../assets/images/TouchID.png')}
          style={{
            justifyContent: 'center',
            width: 200,
            height: 200,
            resizeMode: 'contain',
            marginTop: 30,
          }}
        />
      </View>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}>
        <Text
          style={{
            color: '#37474F',
            fontSize: 14,
            alignSelf: 'center',
            marginTop: 20,
            fontFamily: FONTS.SemiBold
          }}>
          Switch to
        </Text>
        <TouchableOpacity onPress={handleToLogin}>
          <Text
            style={{
              color: '#F5A922',
              fontSize: 18,
              alignSelf: 'center',
              marginTop: 20,
              textDecorationLine: 'underline',
              textDecorationColor: '#F5A922',
              fontFamily: FONTS.SemiBold
            }}>
            Manual Sign In
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={handleToLogin}>
        <Text style={styles.buttonTextStyle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8F9 ',
    flexGrow: 1,
  },
  content: {
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    margin: 10,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 30,
    color: '#F5A922',
    fontFamily: FONTS.Bold
  },
  textView: {
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#37474F',
    marginTop: 15,
  },
  subText: {
    fontSize: 32,
    textAlign: 'center',
    color: '#F5A922',
    fontWeight: 'bold',
  },
  mandatorytext: {
    fontSize: 14,
    textAlign: 'center',
    color: '#FF0000',
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 20,
    paddingLeft: 10,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10,
    paddingRight: 20,
    color: '#37474F',
  },
  linkTextView: {
    marginTop: 10,
  },
  linkText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    color: '#F5A922',
    borderColor: '#FFFFFF',
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    justifyContent: 'center',
  },
  buttonTextStyle: {
    color: '#F5A922',
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: FONTS.Regular
  },
  skipButtonStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#F5A922',
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    borderWidth: 2,
    marginBottom: 110,
    justifyContent: 'center',
  },
  skipButtonTextStyle: {
    color: '#F5A922',
    paddingVertical: 10,
    fontSize: 16,
  },
  fondaidView: {
    width: 360,
    height: 90,
    backgroundColor: '#FFEDD7',
    marginLeft: 20,
    borderStyle: 'dashed',
    borderRadius: 10,
    borderColor: '#F5A922',
    borderWidth: 2,
    flexDirection: 'column',
  },
  shareView: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 4,
  },
  shareImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 7,
  },
  copyView: {
    marginTop: 10,
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 4,
  },
});

export default withInternetConnectivity(TouchIDLogin);
