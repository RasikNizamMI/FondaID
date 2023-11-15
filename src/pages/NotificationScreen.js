import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../assets/Colors';
import {postRequest, getRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';
import {setData, getData, removeData} from '../Utils/AsyncStorageUtil';
import CommonModal from '../component/CommonModal';
import withInternetConnectivity from '../Utils/withInternetConnectivity';
import {useIsFocused} from '@react-navigation/native';

const NotificationScreen = ({navigation}) => {
  const [userFondaID, setUserFondaID] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationInfo, setNotificationInfo] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalHeader, setModalHeader] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const isFocused = useIsFocused();
  const [jwtToken, setJwtToken] = useState('');
  const [errorCode, setErrorCode] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserFondaID = await getData('fonda_ID');
        const storedJwtToken = await getData('jwt_token');
        getDocumentDetails(storedUserFondaID, storedJwtToken);
        if (storedUserFondaID) {
          setUserFondaID(storedUserFondaID);
          setJwtToken(storedJwtToken);
          if (isFocused) {
            getDocumentDetails(storedUserFondaID, storedJwtToken);
          }
        } else {
          console.log('No remembered credentials found.');
        }
      } catch (error) {
        console.log('Error loading remembered credentials:', error);
      }
    };

    fetchData();
  }, [isFocused]);

  const getDocumentDetails = (fondaId, jwtToken) => {
    setLoading(true);
    const headers = {
      'Content-Type': 'application/json',
      'access-token': jwtToken,
    };

    getRequest(API_ENDPOINTS.NOTIFICATION + fondaId, {}, headers)
      .then(response => {
        console.log('getnotifiaction' + JSON.stringify(response));
        setNotificationInfo(response.data);
        setLoading(false);
      })
      .catch(error => {
      //   console.error('GET error:', error);
      //   setLoading(false);
      // });
      if (error.response && error.response.status === 401) {
        setLoading(false);
        setModalVisible(true);
        setErrorMessage("Session timed out, please login again");
        setModalColor(COLORS.ERROR);
        setModalImage(require('../assets/images/error.png'));
        setModalHeader('Error');
        setErrorCode('F401');
      } else {
        // Handle other errors
        console.error('GET error:', error);
        setLoading(false);
      }
    });
  };

//   if (response.responseCode === 'F200') {
//     // Successfully loaded data
//     setNotificationInfo(response.data);
//     setLoading(false);
//   } else if (response.responseCode === 'F401') {
//     // Show popup and redirect to login screen
//     setLoading(false);
//         setModalVisible(true);
//         setErrorMessage(response.responseMessage);
//         setModalColor(COLORS.ERROR);
//         setModalImage(require('../assets/images/error.png'));
//         setModalHeader('Error');
//         setErrorCode('F401');
//   } else {
//     // Handle other response codes if needed
//     console.error('Unhandled responseCode:', response.responseCode);
//     setLoading(false);
//   }
// })
// .catch(error => {
//   console.error('GET error:', error);
//   setLoading(false);
// });
// };

  const formattedDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const handleImageClick = async (doc_ref_id, notification_ref_id) => {
    setLoading(true);

    const headers = {
      'Content-Type': 'application/json',
      'access-token': jwtToken,
    };

    const postData = {
      doc_ref_id: doc_ref_id,
      notification_ref_id: notification_ref_id,
      is_viewed: true,
    };

    try {
      const response = await postRequest(
        API_ENDPOINTS.UPDATENOTIFICATION,
        postData,
        headers,
      );
      console.log('response', response);

      if (response.responseCode === 'F200') {
        console.log(response)
        // Handle success, if needed
        // setLoading(false);
        // setModalVisible(true);
        // setErrorMessage(response.responseMessage);
        // setModalColor(COLORS.PRIMARY);
        // setModalImage(require('../assets/images/sucess.png'));
        // setModalHeader('Success');
      } else {
        // Handle error, if needed
        setLoading(false);
        setModalVisible(true);
        setErrorMessage(response.responseMessage);
        setModalColor(COLORS.ERROR);
        setModalImage(require('../assets/images/error.png'));
        setModalHeader('Error');
      }
      getDocumentDetails(userFondaID, jwtToken);
    } catch (error) {
      console.error('POST error:', error);
      if (error.response && error.response.status === 401) {
        setLoading(false);
        setModalVisible(true);
        setErrorMessage("Session timed out, please login again");
        setModalColor(COLORS.ERROR);
        setModalImage(require('../assets/images/error.png'));
        setModalHeader('Error');
        setErrorCode('F401');
      } else {
      setLoading(false);
      setApiResponseMessage('POST error:', error);
      setModalVisible(true);
      setErrorMessage(error);
      setModalColor(COLORS.ERROR);
      setModalImage(require('../assets/images/error.png'));
      setModalHeader('Error');
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const sucess = () => {
    setModalVisible(false);
    navigation.navigate('Auth', {screen: 'LoginScreen'})
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Feather
          onPress={() => {
            navigation.navigate('Dashboard', {screen: 'Dashboard'});
          }}
          style={styles.headerIcon}
          name="chevron-left"
          size={25}
          color={'#F5A922'}
        />
        <Text style={styles.headerText}>Notifications</Text>
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
            alignSelf: 'center',
          }}
        />
      ) : (
        <>
          {notificationInfo.length > 0 ? (
            <FlatList
              data={notificationInfo}
              keyExtractor={item => item._id}
              renderItem={({item}) =>
                item.notifications.length > 0 ? (
                  item.notifications.map(notification => (
                    <View style={styles.itemContainer} key={notification._id}>
                      <Image
                        source={require('../assets/images/infoIcon.png')}
                        style={styles.icon}
                      />
                      <View style={styles.notificationInfo}>
                        <Text style={styles.content}>
                          {notification.message}
                        </Text>
                        <Text style={styles.time}>
                          {formattedDate(notification.created_dtm)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          handleImageClick(item._id, notification._id)
                        }>
                        <Image
                          source={require('../assets/images/exit.png')}
                          style={{
                            width: 24,
                            height: 24,
                            position: 'relative',
                            left: 10,
                            right: -10,
                            top: -20,
                            bottom: 0,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View style={styles.noNotificationsContainer}>
                    <Text style={styles.noNotificationsText}>
                      No notifications found
                    </Text>
                  </View>
                )
              }
            />
          ) : (
            <View style={styles.noNotificationsContainer}>
              <Text style={styles.noNotificationsText}>
                No notifications found
              </Text>
            </View>
          )}

          <CommonModal
            visible={modalVisible}
            onClose={errorCode == 'F401' ? sucess : closeModal}
            message={errorMessage}
            header={modalHeader}
            color={modalColor}
            imageSource={modalImage}></CommonModal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8F9',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    height: 80,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    elevation: 4,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
    marginLeft: 10,
  },
  notificationInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  time: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginRight: 0,
    flex: 3,
  },
  content: {
    fontSize: 14,
    marginRight: 10,
    marginLeft: 10,
    flex: 7,
    color: '#000000',
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
  noNotificationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotificationsText: {
    fontSize: 16,
    color: COLORS.BLACK,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
});

export default withInternetConnectivity(NotificationScreen);
