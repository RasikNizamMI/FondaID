// DocumentDetails.js

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {postRequest, getRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';
import { WebView } from 'react-native-webview';
import {COLORS, FONTS} from '../assets/Colors';

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

const BioDetailsScreen = ({route, navigation}) => {
  const {id, doc_type} = route.params;
  const displayName = getDisplayName(doc_type);
  const [imageUri, setImageUri] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
console.log( API_ENDPOINTS.GETDOCUMENTPREVIEW + id);

function LoadingIndicatorView() {
  return <ActivityIndicator color='#009b88' size='large' />
}

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
  <WebView
       originWhitelist={['*']}
       source={{ uri: API_ENDPOINTS.GETDOCUMENTPREVIEW + id}}  
       renderLoading={this.LoadingIndicatorView}
       startInLoadingState={true}
     />
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

export default BioDetailsScreen;

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
    marginBottom: 20,
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
  buttonStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    color: '#FFFFFF',
    borderColor: '#F5A922',
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
    color: '#F5A922',
    paddingVertical: 10,
    fontSize: 16,
  },
  bioButtonStyle: {
    backgroundColor: '#F5A922',
    borderWidth: 1,
    color: '#F5A922',
    borderColor: '#F5A922',
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
    color: '#FFFFFF',
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
});
