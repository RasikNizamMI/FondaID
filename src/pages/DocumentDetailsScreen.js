// DocumentDetails.js

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {postRequest, getRequest, putRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';
import {COLORS, FONTS} from '../assets/Colors';
import {WebView} from 'react-native-webview';
import Share from 'react-native-share';
import withInternetConnectivity from '../Utils/withInternetConnectivity';
import {setData, getData, removeData} from '../Utils/AsyncStorageUtil';

const getDisplayName = doc_type => {
  switch (doc_type) {
    case 'passport':
      return 'Passport';
    case 'driving_license':
      return 'Driving License';
    case 'national_id':
      return 'National ID Card';
    case 'healthCard':
      return 'Health Card';
    case 'residence_permit':
      return 'Professional Card';
    case 'other':
      return 'Other';
    default:
      return doc_type;
  }
};

const DocumentDetailsScreen = ({route, navigation}) => {
  const {id, doc_type, fonda_id} = route.params;
  const displayName = getDisplayName(doc_type);
  const [userId, setuserId] = useState('');
  const [docType, setdocType] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [jwtToken, setJwtToken] = useState('');
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    setuserId(id);
    setdocType(doc_type);
    const getDocumentDetails = async id => {
      setLoading(true);
      const storedJwtToken = await getData('jwt_token');
      setJwtToken(storedJwtToken);
      const headers = {
        'Content-Type': 'application/json',
        'access-token': storedJwtToken,
      };
      try {
        const response = await getRequest(
          API_ENDPOINTS.GETDOCUMENTPREVIEW + id,
          {},
          headers,
        );
        setHtmlContent(response);
        // setDocuments(response);
      } catch (error) {
        console.error('GET error:', error);
      } finally {
        setLoading(false);
      }
    };

    getDocumentDetails(id);
  }, [id]);

  function LoadingIndicatorView() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#F5A922" />
      </View>
    );
  }

  const handleShare = async () => {
    try {
      const imageUrl = API_ENDPOINTS.GETDOCUMENTQR + id;
      const options = {
        url: imageUrl,
      };
      await Share.open(options);
      addNotification();
    } catch (error) {
      addNotification();
      console.error('Error sharing:', error.message);
    }
  };

  const addNotification = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'access-token': jwtToken,
    };

    const requestBody = {
      fonda_id: fonda_id,
      message: 'You shared ' + displayName + ' QR code',
    };
    putRequest(API_ENDPOINTS.ADDNOTIFICATION, requestBody, headers)
      .then(response => {})
      .catch(error => {
        console.error('GET error:', error);
      });
  };

  return (
    <View style={{flex: 1, marginTop: 10}}>
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
        <Text style={styles.headerText}>{displayName}</Text>
      </View>
      <View
        style={{
          flex: 1,
          marginLeft: 30,
          marginRight: 30,
          elevation: 4,
          backgroundColor: COLORS.WHITE,
          marginTop: 20,
        }}>
        {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.PRIMARY}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center',
          }}
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{uri: API_ENDPOINTS.GETDOCUMENTQR + id}}
              style={{
                marginTop: 10,
                width: 200,
                height: 200,
                resizeMode: 'contain',
                marginLeft: 70,
              }}
            />
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={handleShare}>
                <View style={styles.copyView}>
                  <Image
                    source={require('../assets/images/shareIcon.png')}
                    style={styles.shareImage}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{
              marginTop: 'auto',
              marginBottom: 10,
              fontSize: 12,
              textAlign: 'center',
              fontFamily: FONTS.Regular,
              marginLeft: 10,
              marginRight: 10,
              color: COLORS.TEXTCOLOR,
            }}>
            Scan the above QR code to verify the above document.
          </Text>
        </View>
      )}
        {/* <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{
            uri: API_ENDPOINTS.GETDOCUMENTPREVIEW + id,
          }}
          renderLoading={LoadingIndicatorView}
          startInLoadingState={true}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          // Add other WebView props as needed
        /> */}
        <WebView
          source={{html: htmlContent}}
          // renderLoading={() => (
          //   <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          // )}
          startInLoadingState={true}
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
          }}
        />
      </View>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={() => {
          navigation.goBack(null);
        }}>
        <Text style={styles.buttonTextStyle}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default withInternetConnectivity(DocumentDetailsScreen);

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
    marginTop: 12,
    fontSize: 24,
    color: COLORS.PRIMARY,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
  },
  buttonStyle: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    color: COLORS.WHITE,
    borderColor: COLORS.PRIMARY,
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
  },
  buttonTextStyle: {
    color: COLORS.PRIMARY,
    paddingVertical: 10,
    fontSize: 16,
  },
  bioButtonStyle: {
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    color: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
  },
  bioButtonTextStyle: {
    color: COLORS.WHITE,
    paddingVertical: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  iconContainer: {flexDirection: 'column', marginRight: 20},
  copyView: {
    marginTop: 10,
    width: 40,
    height: 40,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    color: COLORS.WHITE,
    borderColor: COLORS.WHITE,
    borderRadius: 10,
    elevation: 4,
    marginLeft: 20,
  },
  shareImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 7,
  },
});
