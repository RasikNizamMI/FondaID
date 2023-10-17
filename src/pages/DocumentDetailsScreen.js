// DocumentDetails.js

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Modal,} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {postRequest, getRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';
import {COLORS, FONTS} from '../assets/Colors';
import { WebView } from 'react-native-webview';
import Share from 'react-native-share';

const getDisplayName = doc_type => {
  switch (doc_type) {
    case 'passport':
      return 'Passport';
    case 'driverLicense':
      return 'Driving License';
    case 'idCard':
      return 'National ID Card';
    case 'healthCard':
      return 'Health Card';
    case 'professionalLicense':
      return 'Professional Card';
    case 'other':
      return 'Other';
    default:
      return doc_type;
  }
};

const DocumentDetailsScreen = ({route, navigation}) => {
  const {id, doc_type} = route.params;
  const displayName = getDisplayName(doc_type);
  const [userId, setuserId] = useState("");
  const [docType, setdocType] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
setuserId(id);
setdocType(doc_type);
    const getDocumentDetails = async (id) => {
      setLoading(true);

      try {
        const response = await getRequest(API_ENDPOINTS.GETDOCUMENTQR + id);
        console.log(API_ENDPOINTS.GETDOCUMENTQR + id)
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
    return <ActivityIndicator color='#F5A922' size='large' />
  }

  const handleShare = async () => {
    try {
      const imageUrl = API_ENDPOINTS.GETDOCUMENTQR + id; // Replace with your image URL
      const options = {
        url: imageUrl,
      };
      await Share.open(options);
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  // const handleShare = async () => {
  //   try {
  //     const messageToShare = doc_type;
  //     const imageUrl =  API_ENDPOINTS.GETDOCUMENTPREVIEW + id; // Replace with your image URL
  //     await Share.share({
  //       message: messageToShare,
  //       url: imageUrl, // Add the image URL here
  //     });
  //   } catch (error) {
  //     console.error('Error sharing:', error.message);
  //   }
  // };


  return (
    <View style={{flex: 1,marginTop: 10}}>
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
          <View style={{flex:1,marginLeft: 30, 
              marginRight: 30,elevation: 4, backgroundColor: COLORS.WHITE}}>
                <View style={{justifyContent: 'center',
              alignItems: 'center',}}> 
              <View style={{flexDirection: 'row',  justifyContent: 'space-around',justifyContent: 'center',
              alignItems: 'center',}}>

              
                <Image
              source={{ uri: API_ENDPOINTS.GETDOCUMENTQR + id}}
              style={{
                marginTop: 10,
                width: 200,
                height: 200,
                resizeMode: 'contain',
                marginLeft: 70
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
            <Text style={{marginTop: 'auto', marginBottom: 10, fontSize: 12, textAlign: 'center', fontFamily: FONTS.Regular, marginLeft: 10, marginRight: 10, color: COLORS.TEXTCOLOR}}>
            Scan the above QR code to verify the above document.
            </Text>
            </View>
  <WebView
       originWhitelist={['*']}
       source={{ uri: API_ENDPOINTS.GETDOCUMENTPREVIEW + id}}  
       renderLoading={this.LoadingIndicatorView}
       startInLoadingState={true}
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

export default DocumentDetailsScreen;

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
    marginTop: 2.5,
    position: 'absolute',
    left: 0,
  },
  headerText: {
    marginTop: 12,
    fontSize: 24,
    color: COLORS.PRIMARY,
    textAlign: 'center',
    fontFamily: FONTS.Bold
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
    marginLeft: 20
  },
  shareImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 7,
  },
});
