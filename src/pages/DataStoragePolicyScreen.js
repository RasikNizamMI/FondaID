import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Linking,
} from 'react-native';

const DataStoragePolicyScreen = ({navigation}) => {
  const [dataStorageEnabled, setDataStorageEnabled] = useState(false);
  const [dataStorageEnabled1, setDataStorageEnabled1] = useState(false);
  const [dataStorageEnabled2, setDataStorageEnabled2] = useState(false);

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

  const handleConfirm = () => {
    navigation.navigate('Dashboard');
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.heading}>Data Storage Acceptance</Text>
          <View style={styles.textView}>
            <Text style={styles.text}>I agree Fonda Team store</Text>
            <Text style={styles.text}>my following personal data</Text>
            <Text style={styles.text}>as per the GDPR policy.</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.text}>You may withdraw any data at</Text>
            <Text style={styles.text}>
              any time by visiting the Settings section.
            </Text>
          </View>
          <View style={styles.linkTextView}>
            <TouchableOpacity onPress={handleLinkPress}>
              <Text style={styles.linkText}>View our Data Storage Policy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchContainer}>
            <Switch
              style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
              trackColor={{false: '#767577', true: '#33C759'}}
              thumbColor={dataStorageEnabled ? '#FFFFFF' : '#000000'}
              value={dataStorageEnabled}
              onValueChange={toggleDataStorage}
            />
            <Text ellipsizeMode="tail" numberOfLines={4}style={styles.switchLabel}>
              I agree to store my personal KYC details like, Name, Email, Mobile
              Number, Date of birth, Nationality, Gender.
            </Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch
              style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
              trackColor={{false: '#767577', true: '#33C759'}}
              thumbColor={dataStorageEnabled1 ? '#FFFFFF' : '#000000'}
              value={dataStorageEnabled1}
              onValueChange={toggleDataStorage1}
            />
            <Text style={styles.switchLabel}>Data 2</Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch
              style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
              trackColor={{false: '#767577', true: '#33C759'}}
              thumbColor={dataStorageEnabled2 ? '#FFFFFF' : '#000000'}
              value={dataStorageEnabled2}
              onValueChange={toggleDataStorage2}
            />
            <Text style={styles.switchLabel}>Data 3</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.mandatorytext}>
              * Mandatory to select personal KYC information to store
            </Text>
            <Text style={styles.mandatorytext}>to store</Text>
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleConfirm}>
            <Text style={styles.buttonTextStyle}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButtonStyle}
            activeOpacity={0.5}
            onPress={''}>
            <Text style={styles.skipButtonTextStyle}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2E35',
    padding: 16,
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
    paddingRight: 40,
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
  },
  skipButtonTextStyle: {
    color: '#F5A922',
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default DataStoragePolicyScreen;
