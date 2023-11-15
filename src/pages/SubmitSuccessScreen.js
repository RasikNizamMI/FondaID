import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Button,
  Platform,
  Share,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {setData, getData, removeData} from '../Utils/AsyncStorageUtil';
import {useClipboard} from '@react-native-community/clipboard';
import {COLORS, FONTS} from '../assets/Colors';
import CommonModal from '../component/CommonModal';
import withInternetConnectivity from '../Utils/withInternetConnectivity';

const SubmitSuccessScreen = ({navigation}) => {
  const [userFondaID, setUserFondaID] = useState('');
  const [data, setString] = useClipboard();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalHeader, setModalHeader] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const storedUserFondaID = await getData('fondaId');

        setUserFondaID(storedUserFondaID);
      } catch (error) {
        console.log('Error loading remembered credentials:', error);
      }
    };
    loadRememberedCredentials();
  }, []);

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handleUploadDoc = () => {
    navigation.goBack(null);
  };

  const handleShare = async () => {
    try {
      const messageToShare = userFondaID;
      await Share.share({
        message: messageToShare,
      });
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  const handleCopyToClipboard = () => {
    setString(userFondaID);
    setModalVisible(true);
          setErrorMessage("Fonda ID Coppied Successfully");
          setModalColor(COLORS.PRIMARY);
          setModalImage(require('../assets/images/sucess.png'));
          setModalHeader('Success');
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.mainBody}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Feather
              onPress={() => {
                navigation.goBack(null);
              }}
              style={{
                marginLeft: 16,
                marginTop: 2.5,
                position: 'absolute',
                left: 0,
              }}
              name="chevron-left"
              size={25}
              color={'#F5A922'}
            />
            <Text
              style={{
                marginTop: 12,
                fontSize: 24,
                color: '#F5A922',
                textAlign: 'center',
                fontFamily: FONTS.Bold,
              }}>
              Success
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              marginRight: 30,
              marginLeft: 30,
              marginTop: 30,
            }}>
            <Image
              source={require('../assets/images/SucessPic.png')}
              style={{
                height: 180,
                width: 250,
                resizeMode: 'contain',
              }}
            />
          </View>

          <View style={{marginTop: 15, marginLeft: 30, alignItems: 'center'}}>
            <Text style={{color: '#37474F', fontSize: 18, fontFamily: FONTS.Medium}}>
              Your KYC Details & Documents are
            </Text>
            <Text style={{color: '#37474F', fontSize: 18, fontFamily: FONTS.Medium, marginTop: 10}}>
              verified successfully!
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 20,
            }}>
            <View
              style={{
                width: '70%',
                height: 90,
                backgroundColor: '#FFEDD7',
                marginLeft: 20,
                borderStyle: 'dashed',
                borderRadius: 10,
                borderColor: '#F5A922',
                borderWidth: 2,
                flexDirection: 'column',
              }}>
              <Text style={styles.text}>Your Fonda ID:</Text>
              <Text style={styles.subText}>{userFondaID}</Text>
            </View>

            <View style={{flexDirection: 'column', marginRight: 20}}>
              <TouchableOpacity onPress={handleCopyToClipboard}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    color: '#FFFFFF',
                    borderColor: '#FFFFFF',
                    borderRadius: 10,
                    elevation: 4,
                  }}>
                  <Image
                    source={require('../assets/images/copyIcon.png')}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                      marginTop: 7,
                    }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleShare}>
                <View
                  style={{
                    marginTop: 10,
                    width: 40,
                    height: 40,
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    color: '#FFFFFF',
                    borderColor: '#FFFFFF',
                    borderRadius: 10,
                    elevation: 4,
                  }}>
                  <Image
                    source={require('../assets/images/shareIcon.png')}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                      marginTop: 7,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{marginTop: 15, marginLeft: 30, alignItems: 'center'}}>
            <Text style={{color: '#37474F', fontSize: 14, textAlign: 'center', fontFamily: FONTS.Medium}}>
              Note: You can use this Fonda ID on various platforms/applications
              as your Digital Identity!
            </Text>
          </View>

          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleLogin}>
            <Text style={styles.buttonTextStyle}>Login your Fonda Account</Text>
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
export default withInternetConnectivity(SubmitSuccessScreen);

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
  SectionTextStyle: {
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
  },
  TextStyle: {
    color: '#37474F',
  },
  HeaderTextStyle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  SubHeadingTextStyle: {
    color: '#8392a5',
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
    borderRadius:10,
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
    fontFamily: FONTS.Regular
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
  registerTextStyle: {
    color: '#F5A922',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
    marginTop: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
  },
  checkbox: {
    alignSelf: 'center',
    color: '#0168fa',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
    color: '#37474F',
    marginTop: 15,
  },
  subText: {
    fontSize: 32,
    textAlign: 'center',
    color: '#F5A922',
    fontFamily: FONTS.Bold
  },
});
