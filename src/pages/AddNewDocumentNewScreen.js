import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {SelectList} from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {setData, getData, removeData} from '../Utils/AsyncStorageUtil';
import {COLORS, FONTS} from '../assets/Colors';
import CommonModal from '../component/CommonModal';
import withInternetConnectivity from '../Utils/withInternetConnectivity';
import {postRequest, getRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';
import {WebView} from 'react-native-webview';

const AddNewDocumentNewScreen = ({navigation}) => {
  const [jwtToken, setJwtToken] = useState('');
  const [userFondaID, setUserFondaID] = useState('');
  const [loading, setLoading] = useState(true);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');

  const [filters, setFilters] = useState([
    
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const storedUserFondaID = await getData('fonda_ID');
        const storedJwtToken = await getData('jwt_token');
        setJwtToken(storedJwtToken);
        setUserFondaID(storedUserFondaID);
        getPendingDoc(storedUserFondaID, storedJwtToken);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPendingDoc = (fondaId, jwtToken) => {
    setLoading(true);
    const headers = {
      'Content-Type': 'application/json',
      'access-token': jwtToken,
    };

    getRequest(
      API_ENDPOINTS.GETPENDINGDOC + '?fonda_id=' + fondaId,
      {},
      headers,
    )
      .then(response => {
        const documentList = response.documentList;
        console.log(documentList);
        const updatedFilters = documentList.map(docType => {
          let label;
          switch (docType) {
            case 'national_id':
              label = 'National ID Card';
              break;
            case 'passport':
              label = 'Passport';
              break;
            case 'driving_license':
              label = 'Driving License';
              break;
            case 'residence_permit':
              label = 'Residence Permit';
              break;
            default:
              label = docType.charAt(0).toUpperCase() + docType.slice(1).replace('_', ' ');
          }
  
          return {
            key: docType,
            label,
          };
        });
        setFilters(updatedFilters);

        setLoading(false);
      })
      .catch(error => {
        console.error('GET error:', error);
      });
  };

  const renderButtons = () => {
    
    const buttons = [];
    for (let i = 0; i < filters.length; i += 2) {
      const buttonRow = (
        <View key={i} style={{flexDirection: 'row'}}>
          {filters[i] && renderButton(filters[i])}
          {filters[i + 1] && renderButton(filters[i + 1])}
        </View>
      );
      buttons.push(buttonRow);
    }
    return buttons;
  };

  const renderButton = filter => (
    <TouchableOpacity
      key={filter.key}
      style={{
        marginHorizontal: 10,
        marginVertical: 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE,
        flex: 1,
        borderRadius: 10,
        padding: 5,
        borderColor: COLORS.PRIMARY,
        borderWidth: 1,
      }}
      activeOpacity={0.5}
      onPress={() => handleFilterChange(filter.key)}>
      <Text style={{ color: COLORS.BLACK,
    paddingVertical: 10,
    fontSize: 16,}}>{filter.label}</Text>
    </TouchableOpacity>
  );

  const handleFilterChange = filterKey => {
    const headers = {
      'Content-Type': 'application/json',
      'access-token': jwtToken,
    };

    const requestBody = {
      fonda_id: userFondaID,
      doc_type: filterKey,
    };

    getRequest(
      API_ENDPOINTS.ADDNEWDOCGET +
        '?doc_type=' +
        filterKey +
        '&fonda_id=' +
        userFondaID,
    )
      .then(response => {
        const {responseCode, responseMessage} = response;
        if (responseCode === 'F200') {
          setWebViewUrl(responseMessage);
          setWebViewVisible(true);
        }
      })
      .catch(error => {
        console.error('GET error:', error);
      });
  };

  return (
    <View style={styles.mainBody}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View>
          <View style={styles.headerView}>
            <Text style={styles.headerText}>Add New Document</Text>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.PRIMARY}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}
            />
          ) : webViewVisible ? (
            <View
              style={{
                margin: 20,
                height: '80%',
                backgroundColor: COLORS.WHITE,
                borderRadius: 10,
              }}>
              <WebView
                source={{ uri: webViewUrl }}
                // renderLoading={() => (
          //   <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          // )}
                startInLoadingState={true}
                onError={syntheticEvent => {
                  const { nativeEvent } = syntheticEvent;
                  console.error('WebView error: ', nativeEvent);
                }}
              />
            </View>
          ) : (
            <View
              style={{
                margin: 20,
                height: '80%',
                backgroundColor: COLORS.WHITE,
                borderRadius: 10,
              }}>
              {filters.length === 0 ? (
                <Text
                  style={{
                    marginTop: 20,
                    marginLeft: 20,
                    fontFamily: FONTS.Bold,
                    fontSize: 18,
                    color: COLORS.BLACK,
                  }}>
                  No filters available
                </Text>
              ) : (
                <>
                  <Text
                    style={{
                      marginTop: 20,
                      marginLeft: 20,
                      fontFamily: FONTS.Bold,
                      fontSize: 18,
                      color: COLORS.BLACK,
                    }}>
                    Select Document Type
                  </Text>
                  <View style={{ margin: 10 }}>{renderButtons()}</View>
                </>
              )}
            </View>
          )}

          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => {
              navigation.goBack(null);
            }}>
            <View style={styles.scannerView}>
              <Feather
                style={styles.scannerImage}
                name="chevron-left"
                size={25}
                color={COLORS.PRIMARY}
              />
              <Text style={styles.registerButtonTextStyle}>
                Back to Dashboard
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
export default withInternetConnectivity(AddNewDocumentNewScreen);

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
    borderColor: COLORS.WHITE,
    borderRadius: 10,
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
  },
  registerButtonStyle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    color: COLORS.WHITE,
    borderColor: COLORS.WHITE,
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
    elevation: 4,
    marginBottom: 30,
    marginTop: 30,
  },
  buttonTextStyle: {
    color: COLORS.WHITE,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: FONTS.Regular,
  },
  registerButtonTextStyle: {
    color: COLORS.PRIMARY,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: COLORS.TEXTCOLOR,
    paddingLeft: 15,
    paddingRight: 15,
    elevation: 4,
    backgroundColor: COLORS.WHITE,
    fontFamily: FONTS.Regular,
    fontSize: 14,
    borderRadius: 10,
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
    color: COLORS.PRIMARY,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
  },
  dropdowmBox: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.WHITE,
    elevation: 4,
  },
  dropdown: {
    marginTop: 0,
    marginLeft: 30,
    marginRight: 30,
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.WHITE,
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
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.WHITE,
    elevation: 4,
    height: 50,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  datePickerViews: {
    flexDirection: 'row',
    width: '100%',
  },
  datePickerText: {
    fontSize: 14,
    flex: 1,
    marginTop: 5,
    fontFamily: FONTS.Regular,
    textAlign: 'left',
    color: COLORS.TEXTCOLOR,
    marginLeft: 16,
  },
  datePickerIcon: {
    height: 25,
    width: 25,
    marginLeft: 10,
    marginRight: 10,
  },
  uploadView: {marginTop: 15, marginLeft: 30},
  uploadText: {color: COLORS.TEXTCOLOR, fontSize: 16, fontFamily: FONTS.Medium},
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
  afterUploadImage: {
    height: 200, // Set your desired height here
    aspectRatio: 1, // Maintain the aspect ratio (1:1)
    resizeMode: 'contain', // You can use other values like 'cover' or 'stretch' based on your needs
  },
  scannerView: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerImage: {height: 24, width: 24, marginRight: 10},
});
