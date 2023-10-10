import React, {useState, useEffect} from 'react';
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
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
  BackHandler,
} from 'react-native';
import {setData, getData, removeData} from '../Utils/AsyncStorageUtil';
import {useClipboard} from '@react-native-community/clipboard';
import {postRequest, getRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';
import {useIsFocused} from '@react-navigation/native';

const Dashboard = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [iconStatus, setIconStatus] = useState(false);
  const [dataStorageEnabled, setDataStorageEnabled] = useState(false);
  const [dataStorageEnabled1, setDataStorageEnabled1] = useState(false);
  const [dataStorageEnabled2, setDataStorageEnabled2] = useState(false);
  const [openItemId, setOpenItemId] = useState(null);
  const [userFondaID, setUserFondaID] = useState('');
  const [documents, setDocuments] = useState([]);
  const [data, setString] = useClipboard();
  const [loading, setLoading] = useState(false);
  const [userRefID, setUserRefID] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserRefID = await getData('refID');
        const storedUserFondaID = await getData('fonda_ID');
        const storedDataStorage = await getData('dataStorageAccepted');

        setUserRefID(storedUserRefID || '');
        setUserFondaID(storedUserFondaID);
        handleUser(storedUserRefID);
        getDocumentDetails(storedUserFondaID);
        if (storedUserFondaID) {
          setUserFondaID(storedUserFondaID);
          if (isFocused) {
            getDocumentDetails(storedUserFondaID);
          }
          console.log('fodaid++++' + storedUserFondaID);
        } else {
          console.log('No remembered credentials found.');
        }

        if (storedDataStorage !== null) {
          console.log(storedDataStorage);
          setIconStatus(true);
        } else {
          setIconStatus(false);
        }
      } catch (error) {
        console.log('Error loading remembered credentials:', error);
      }
    };

    fetchData();
  }, [isFocused]);

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

  const handleUser = async (userRefID) => {
    setLoading(true);
  
      try {
        const response = await getRequest(API_ENDPOINTS.GETUSER+userRefID);
        console.log(JSON.stringify(response));
        setData('fondaId', response.fonda_id)
        setData('_id', response._id);
        setData('emailID', response.email_id);
        setData('phoneNumber', response.phone_number);
        setData('firstName', response.first_name);
        setData('surName', response.sur_name);
        setData('birthName', response.birth_name);
        setData('dateOfBirth', response.date_of_birth);
        setData('placeOfBirth', response.place_of_birth);
        setData('nationality', response.nationality);
        setData('nativeCountry', response.native_country);
        setData('gender', response.gender);
        
      } catch (error) {
        console.log('error', error);
        setErrorMessage('Please check credentials');
      } finally {
        setLoading(false);
      }
    }

  const getDocumentDetails = fondaId => {
    setLoading(true);

    console.log(API_ENDPOINTS.GETDOCUMENT + fondaId);

    getRequest(API_ENDPOINTS.GETDOCUMENT + fondaId)
      .then(response => {
        console.log(JSON.stringify(response));
        setDocuments(response);
        setLoading(false);
      })

      .catch(error => {
        setLoading(false);
        console.error('GET error:', error);
      });
  };

  const handleCopyToClipboard = () => {
    setString(userFondaID);
  };

  const handleIconClick = itemId => {
    // setIconStatus(itemId === data.id && !iconStatus);
    setOpenItemId(itemId === openItemId ? null : itemId);
  };

  const handleToAddNewDoc = () => {
    navigation.navigate('AddNewDocumentScreen');
  };

  const toggleDataStorage = () => {
    setDataStorageEnabled(!dataStorageEnabled);
  };
  const toggleDataStorage1 = () => {
    setDataStorageEnabled1(!dataStorageEnabled1);
  };
  const toggleDataStorage2 = () => {
    setDataStorageEnabled2(!dataStorageEnabled2);
  };

  const handleLinkPress = () => {
    const url = 'https://www.example.com'; // Replace with your desired URL
    Linking.openURL(url);
  };

  const handleConfirm = async () => {
    if (
      dataStorageEnabled == true &&
      dataStorageEnabled1 == true &&
      dataStorageEnabled2 == true
    ) {
      await setData('dataStorageAccepted', 'true');
      setIconStatus(true);
    } else {
      Alert.alert('Please enable Data storage');
    }
  };

  return iconStatus == true ? (
    <View style={[styles.container, {backgroundColor: '#F6F8F9'}]}>
      <Text style={styles.heading}>Dashboard</Text>
      <View style={styles.infoContainer}>
        <View style={styles.fondaidView}>
          <Text style={styles.text}>Your Fonda ID:</Text>
          <Text style={styles.subText}>{userFondaID}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleCopyToClipboard}>
            <View style={styles.shareView}>
              <Image
                source={require('../images/copyIcon.png')}
                style={styles.shareImage}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare}>
            <View style={styles.copyView}>
              <Image
                source={require('../images/shareIcon.png')}
                style={styles.shareImage}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.documentsHeader}>
        <Text style={styles.documentsHeaderText}>My Verified Documents</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F5A922" />
      ) : (
        <FlatList
          data={documents}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DocumentDetailsScreen', {
                  id: item._id,
                  doc_type: item.doc_type,
                })
              }>
              <View style={styles.documentItem}>
                <View style={{flexDirection: 'row'}}>
                  {item.doc_type == 'passport' && (
                    <Image
                      source={require('../images/passport.png')}
                      style={styles.documentImage}
                    />
                  )}
                  {item.doc_type == 'driverLicense' && (
                    <Image
                      source={require('../images/driving.png')}
                      style={styles.documentImage}
                    />
                  )}
                  {item.doc_type == 'idCard' && (
                    <Image
                      source={require('../images/national.png')}
                      style={styles.documentImage}
                    />
                  )}
                  {item.doc_type == 'healthCard' && (
                    <Image
                      source={require('../images/health.png')}
                      style={styles.documentImage}
                    />
                  )}
                  {item.doc_type == 'professionalLicense' && (
                    <Image
                      source={require('../images/professional.png')}
                      style={styles.documentImage}
                    />
                  )}
                  {item.doc_type == 'other' && (
                    <Image
                      source={require('../images/other.png')}
                      style={styles.documentImage}
                    />
                  )}

                  <View style={{flexDirection: 'column'}}>
                    <Text style={styles.documentType}>
                      {item.doc_type == 'passport' && 'Passport'}
                      {item.doc_type == 'driverLicense' && 'Driving License'}
                      {item.doc_type == 'idCard' && 'National ID Card'}
                      {item.doc_type == 'healthCard' && 'Health Card'}
                      {item.doc_type == 'professionalLicense' &&
                        'Professional Card'}
                      {item.doc_type == 'other' && 'Other'}
                    </Text>
                    <Text style={styles.documentId}>{item.doc_id}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item._id}
        />
      )}

      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={handleToAddNewDoc}>
        <Text style={styles.buttonTextStyle}>Add New Document</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.datacontainer}>
      <ScrollView>
        <View style={styles.datacontent}>
          <Text style={styles.dataheading}>Data Storage Acceptance</Text>
          <View style={styles.datatextView}>
            <Text style={styles.datatext}>I agree Fonda Team store</Text>
            <Text style={styles.datatext}>my following personal data</Text>
            <Text style={styles.datatext}>as per the GDPR policy.</Text>
          </View>
          <View style={styles.datatextView}>
            <Text style={styles.datatext}>You may withdraw any data at</Text>
            <Text style={styles.datatext}>
              any time by visiting the Settings section.
            </Text>
          </View>
          <View style={styles.datalinkTextView}>
            <TouchableOpacity onPress={handleLinkPress}>
              <Text style={styles.datalinkText}>
                View our Data Storage Policy
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dataswitchContainer}>
            <Switch
              style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
              trackColor={{false: '#767577', true: '#33C759'}}
              thumbColor={dataStorageEnabled ? '#FFFFFF' : '#000000'}
              value={dataStorageEnabled}
              onValueChange={toggleDataStorage}
            />
            <Text
              ellipsizeMode="tail"
              numberOfLines={4}
              style={styles.switchLabel}>
              I agree to store my personal KYC details like, Name, Email, Mobile
              Number, Date of birth, Nationality, Gender.
            </Text>
          </View>
          <View style={styles.dataswitchContainer}>
            <Switch
              style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
              trackColor={{false: '#767577', true: '#33C759'}}
              thumbColor={dataStorageEnabled1 ? '#FFFFFF' : '#000000'}
              value={dataStorageEnabled1}
              onValueChange={toggleDataStorage1}
            />
            <Text style={styles.dataswitchLabel1}>Data 2</Text>
          </View>
          <View style={styles.dataswitchContainer}>
            <Switch
              style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
              trackColor={{false: '#767577', true: '#33C759'}}
              thumbColor={dataStorageEnabled2 ? '#FFFFFF' : '#000000'}
              value={dataStorageEnabled2}
              onValueChange={toggleDataStorage2}
            />
            <Text style={styles.dataswitchLabel1}>Data 3</Text>
          </View>
          <View style={styles.datatextView}>
            <Text style={styles.datamandatorytext}>
              * Mandatory to select personal KYC information
            </Text>
            <Text style={styles.datamandatorytext}>to store</Text>
          </View>
          <TouchableOpacity
            style={styles.databuttonStyle}
            activeOpacity={0.5}
            onPress={handleConfirm}>
            <Text style={styles.databuttonTextStyle}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dataskipButtonStyle}
            activeOpacity={0.5}
            onPress={() => BackHandler.exitApp()}>
            <Text style={styles.dataskipButtonTextStyle}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#F5A922',
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
    backgroundColor: '#F5A922',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#F5A922',
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    justifyContent: 'center',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
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
    width: '75%',
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
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconContainer: {flexDirection: 'column', marginRight: 20},
  documentsHeader: {marginLeft: 20, marginTop: 20},
  documentsHeaderText: {color: '#37474F'},
  documentItem: {
    height: 100,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  documentImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginTop: 10,
    marginLeft: 10,
  },
  documentType: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 16,
    fontWeight: '700',
    color: '#37474F',
  },
  documentId: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 16,
    color: '#999999',
  },
  datacontainer: {
    flex: 1,
    backgroundColor: '#1A2E35',
    padding: 16,
    flexGrow: 1,
  },
  datacontent: {
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    margin: 10,
    flexGrow: 1,
  },
  dataheading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#F5A922',
  },
  datatextView: {
    marginTop: 10,
  },
  datatext: {
    fontSize: 16,
    textAlign: 'center',
    color: '#37474F',
  },
  datamandatorytext: {
    fontSize: 14,
    textAlign: 'center',
    color: '#FF0000',
  },
  dataswitchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 20,
    paddingLeft: 10,
  },
  dataswitchLabel: {
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10,
    paddingRight: 40,
    color: '#37474F',
    marginTop: 20,
  },
  dataswitchLabel1: {
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10,
    paddingRight: 40,
    color: '#37474F',
  },
  datalinkTextView: {
    marginTop: 10,
  },
  datalinkText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  databuttonStyle: {
    backgroundColor: '#F5A922',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#F5A922',
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  databuttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  dataskipButtonStyle: {
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
  },
  dataskipButtonTextStyle: {
    color: '#F5A922',
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default Dashboard;
