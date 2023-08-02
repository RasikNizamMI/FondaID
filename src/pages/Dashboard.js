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
  FlatList
} from 'react-native';
import Navigation from '../Navigator';

const Dashboard = ({navigation}) => {
  const [iconStatus, setIconStatus] = useState(false);
  const [openItemId, setOpenItemId] = useState(null);


  const handleShare = async () => {
    navigation.navigate("SharingScreen")
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
    navigation.navigate("SharingScreen")
  };

  const handleIconClick = (itemId) => {
    // setIconStatus(itemId === data.id && !iconStatus);
    setOpenItemId(itemId === openItemId ? null : itemId);
  };

  const handleToAddNewDoc = () => {
    navigation.navigate("AddNewDocumentScreen")
  }

  return (
    <View style={styles.container}>
        <Text style={styles.heading}>Dashboard</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={styles.fondaidView}>
            <Text style={styles.text}>Your Fonda ID:</Text>
            <Text style={styles.subText}>FD87457AS23</Text>
          </View>
          <View style={{flexDirection: 'column', marginRight: 20}}>
            <TouchableOpacity onPress={handleShare}>
              <View style={styles.shareView}>
                <Image
                  source={require('../images/copyIcon.png')}
                  style={styles.shareImage}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCopyToClipboard}>
              <View style={styles.copyView}>
                <Image
                  source={require('../images/shareIcon.png')}
                  style={styles.shareImage}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginLeft: 20, marginTop: 20}}>
          <Text>My Verified Documents</Text>
        </View>


        <FlatList
  data={data}
  renderItem={({item}) => (
    <View
      style={{
        height: openItemId === item.id ? 180 : 100,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
      }}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../images/thumb.png')}
          style={{
            width: 80,
            height: 80,
            resizeMode: 'contain',
            marginTop: 10,
            marginLeft: 10,
          }}
        />
        <View style={{ flexDirection: 'column' }}>
          <Text
            style={{
              marginTop: 20,
              marginLeft: 20,
              fontSize: 16,
              fontWeight: '700',
              color: '#37474F',
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              marginTop: 10,
              marginLeft: 20,
              fontSize: 16,
              color: '#999999',
            }}>
            {item.number}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 20,
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => handleIconClick(item.id)}>
            <Image
              source={require('../images/arrow1.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {openItemId === item.id &&  (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column' }}>
            <Text
              style={{
                marginTop: 20,
                marginLeft: 20,
                fontSize: 16,
                fontWeight: '700',
                color: '#37474F',
              }}>
              Issue date
            </Text>
            <Text
              style={{
                marginTop: 10,
                marginLeft: 20,
                fontSize: 16,
                color: '#999999',
              }}>
              {item.issueDate}
            </Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text
              style={{
                marginTop: 20,
                marginLeft: 20,
                fontSize: 16,
                fontWeight: '700',
                color: '#37474F',
              }}>
              Valid upto
            </Text>
            <Text
              style={{
                marginTop: 10,
                marginLeft: 20,
                fontSize: 16,
                color: '#999999',
              }}>
              {item.validUntil}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginRight: 20,
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Image
              source={require('../images/trashIcon.png')}
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
              }}
            />
          </View>
        </View>
      )}
    </View>
  )}
  keyExtractor={(item) => item.id.toString()}
/>
       

        

        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={handleToAddNewDoc}>
          <Text style={styles.buttonTextStyle}>Add New Document</Text>
        </TouchableOpacity>
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
});

export default Dashboard;
