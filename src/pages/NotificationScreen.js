import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const NotificationScreen = () => {

  const notifications = [
    {
      id: '1',
      time: '9:30 AM',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: '2',
      time: '10:45 AM',
      content: 'Nulla facilisi. Sed hendrerit feugiat nisl, ac eleifend tortor porta non.',
    },
    {
      id: '3',
      time: '12:15 PM',
      content: 'Cras sed urna ac odio posuere ultricies sed eget odio.',
    },
  ];


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
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
           
      <Image source={require('../images/infoIcon.png')} style={styles.icon} />
      <View style={styles.notificationInfo}>
        
        <Text style={styles.content}>{item.content}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Image source={require('../images/exit.png')} style={{
    width: 24,
    height: 24,
      position: 'relative',
      left: 10,
      right: -10,
      top: -20,
      bottom: 0
   
  }} />
    </View>
        )}
      />
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
    marginTop: 10 ,
    marginLeft: 30,
    marginRight: 30,
    elevation: 4,
    borderRadius: 10,
    marginBottom: 10
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
    marginLeft: 10
  },
  notificationInfo: {
    flex: 1,
    flexDirection: 'row'
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
    color: '#000000'
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
});

export default NotificationScreen;
