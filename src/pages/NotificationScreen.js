import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../assets/Colors';
import {postRequest, getRequest} from '../Utils/apiUtils';
import {API_ENDPOINTS} from '../Utils/apiConfig';
import {useIsFocused} from '@react-navigation/native';
import {setData, getData, removeData} from '../Utils/AsyncStorageUtil';
import CommonModal from '../component/CommonModal';

const NotificationScreen = () => {
  const [userFondaID, setUserFondaID] = useState('');
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [notificationInfo, setNotificationInfo] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalHeader, setModalHeader] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserFondaID = await getData('fonda_ID');
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
      } catch (error) {
        console.log('Error loading remembered credentials:', error);
      }
    };

    fetchData();
  }, [isFocused]);

  const getDocumentDetails = fondaId => {
    const headers = {
      'Content-Type': 'application/json',
    };

    getRequest(API_ENDPOINTS.NOTIFICATION + fondaId, {}, headers)
      .then(response => {
        console.log(JSON.stringify(response));
        setNotificationInfo(response.data);
      })
      .catch(error => {
        console.error('GET error:', error);
      });
  };

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

  const handleImageClick = async () => {
    const postData = {
      doc_ref_id: notificationInfo[0]._id,
      notification_ref_id: notificationInfo[0].notifications[0]._id,
      is_viewed: true,
    };

    try {
      const response = await postRequest(
        API_ENDPOINTS.UPDATENOTIFICATION,
        postData,
      )
        .then(response => {
          console.log('response' + JSON.stringify(response));
          if (response.responseCode === 'F200') {
            setLoading(false);
            setEmailVerificationSuccess(true);
            setEmailVerificationError(false);
            setModalVisible(true);
            setErrorMessage(response.responseMessage);
            setModalColor(COLORS.PRIMARY);
            setModalImage(require('../assets/images/sucess.png'));
            setModalHeader('Success');
          } else {
            setLoading(false);
            setEmailVerificationSuccess(false);
            setEmailVerificationError(true);
            setMobileVerificationError(true);
            setModalVisible(true);
            setErrorMessage(response.responseMessage);
            setModalColor(COLORS.ERROR);
            setModalImage(require('../assets/images/error.png'));
            setModalHeader('Error');
          }
        })
        .catch(error => {
          setLoading(false);
          setApiResponseMessage('POST error:', error);
          setModalVisible(true);
          setErrorMessage(error);
          setModalColor(COLORS.ERROR);
          setModalImage(require('../assets/images/error.png'));
          setModalHeader('Error');
        })
        .finally(() => {
          setLoading(false);
        });
      getDocumentDetails(userFondaID);
      // Handle success, if needed
    } catch (error) {
      console.error('POST error:', error);
      // Handle error, if needed
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerText}>Notifications</Text>
      </View>
      {notificationInfo.length > 0 ? (
        <FlatList
          data={notificationInfo}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Image
                source={require('../assets/images/infoIcon.png')}
                style={styles.icon}
              />
              <View style={styles.notificationInfo}>
                <Text style={styles.content}>
                  {item.notifications[0].message}
                </Text>
                <Text style={styles.time}>
                  {formattedDate(item.notifications[0].created_dtm)}
                </Text>
              </View>
              <TouchableOpacity onPress={handleImageClick}>
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
          )}
        />
      ) : (
        <View style={styles.noNotificationsContainer}>
          <Text style={styles.noNotificationsText}>No notifications found</Text>
        </View>
      )}
      <CommonModal
        visible={modalVisible}
        onClose={closeModal}
        message={errorMessage}
        header={modalHeader}
        color={modalColor}
        imageSource={modalImage}></CommonModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F6F8F9',
    alignContent: 'center',
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
  },
});

export default NotificationScreen;
