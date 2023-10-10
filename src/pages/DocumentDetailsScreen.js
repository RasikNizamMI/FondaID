// DocumentDetails.js

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {postRequest, getRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';

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
            <Text style={styles.headerText}>{displayName}</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 10,
              borderWidth: 2,
              borderColor: '#ffffff',
              margin: 30,
              elevation: 4
            }}>
            <Image
              source={{ uri: API_ENDPOINTS.GETDOCUMENTQR + id}}
              style={{
                marginTop: 20,
                width: 225,
                height: 225,
                resizeMode: 'contain',
                marginBottom: 20,
              }}
            />
            <Text style={{marginTop: 'auto', marginBottom: 20, fontSize: 12, margin: 30, textAlign: 'center'}}>
            Scan the above QR code to verify the above document.
            </Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.bioButtonStyle}
        activeOpacity={0.5}
        onPress={() => navigation.navigate('BioDetailsScreen', { id: userId, doc_type: docType })}>
        <Text style={styles.bioButtonTextStyle}>BioSeal Details</Text>
      </TouchableOpacity>
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
