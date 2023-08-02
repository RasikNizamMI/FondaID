import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Share,
  TouchableOpacity,
  Linking,
} from 'react-native';

const SharingScreen = ({navigation}) => {
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

  const handleShare = async () => {
    try {
      const shareOptions = {
        message: 'Hello, this is the content I want to share!',
        url: 'https://example.com',
        title: 'Share',
      };

      const result = await Share.share(shareOptions);
      console.log(result);
    } catch (error) {
      console.error(error.message);
    }
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
          <Text style={styles.heading}>Sharing/Copying Fonda ID?</Text>
          <View style={styles.textView}>
            <Text style={styles.text}>We strongly recommend using the</Text>
            <Text style={styles.text}>Fonda App for your KYC document</Text>
            <Text style={styles.text}>verification usage every time.</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.text}>Else your Fonda ID Validity will be</Text>
            <Text style={styles.text}>
            automatically reduced to
            </Text>
          </View>
          <View style={styles.linkTextView}>
              <Text style={styles.linkText}>7 days</Text>  
          </View>
          <View style={styles.textView}>
            <Text style={styles.text}>Next time you create a Fonda ID you will be</Text>
            <Text style={styles.text}>charged as per Fonda Policy.</Text>
            <Text style={styles.text}>The pricing will be.</Text>
          </View>
          <View style={styles.linkTextView}>
              <Text style={styles.priceText}>€1.00</Text>  
          </View>
          <View
            style={{
              width: '85%',
              height: 90,
              backgroundColor: '#FFEDD7',
              marginLeft: 20,
              marginRight: 20,
              borderStyle: 'dashed',
              borderRadius: 10,
              borderColor: '#F5A922',
              borderWidth: 2,
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <Text style={styles.text}>Your Fonda ID:</Text>
            <Text style={styles.subText}>FD87457AS23</Text>
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleShare}>
            <Text style={styles.buttonTextStyle}>Share It Anyway</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButtonStyle}
            activeOpacity={0.5}
            onPress={handleConfirm}>
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
    paddingRight: 20,
    color: '#37474F',
  },
  linkTextView: {
    marginTop: 10,
  },
  linkText: {
    fontSize: 32,
    color: '#FF0000',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  priceText: {
    fontSize: 24,
    color: '#F5A922',
    textAlign: 'center',
    fontWeight: 'bold'
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
    justifyContent: 'center'
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center'
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
    justifyContent: 'center'
  },
  skipButtonTextStyle: {
    color: '#F5A922',
    paddingVertical: 10,
    fontSize: 16,
  },
  subText: {
    fontSize: 32,
    textAlign: 'center',
    color: '#F5A922',
    fontWeight: 'bold',
  },
});

export default SharingScreen;
