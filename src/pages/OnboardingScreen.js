// OnboardingScreen.js

import React, {useRef} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Swiper from 'react-native-swiper';
import {setData, getData} from '../Utils/AsyncStorageUtil';
import {COLORS, FONTS} from '../assets/Colors';

const OnboardingScreen = ({navigation}) => {
  const swiperRef = useRef(null);

  const handleSkip = () => {
    swiperRef.current?.scrollTo(4);
  };

  const handleArrowClick = () => {
    swiperRef.current?.scrollBy(1);
  };

  const handleGetStart = async () => {
    await setData('onboard', 'true');
    navigation.navigate('Auth');
  };

  return (
    <Swiper
      ref={swiperRef}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}>
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/illustration.png')}
            style={styles.backgroundImage}
          />
           <View
              style={styles.skipView}>
              <TouchableOpacity onPress={handleSkip}>
                <Text
                  style={styles.skipText}>
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text1View}>Drained to upload</Text>
          <Text style={styles.text2View}>KYC documents</Text>
          <Text style={styles.text1View}>to multiple platforms?</Text>
        </View>
        <TouchableOpacity
          onPress={handleArrowClick}
          style={styles.arrowContainer}>
          <Image
            source={require('../assets/images/arrow.png')}
            style={styles.arrowImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/illustration1.png')}
            style={styles.backgroundImage}
          />
          <View
              style={styles.skipView}>
              <TouchableOpacity onPress={handleSkip}>
                <Text
                  style={styles.skipText}>
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text1View}>Here, Upload all your</Text>
          <Text style={styles.text2View}>KYC documents</Text>
          <Text style={styles.text1View}>once!</Text>
        </View>
        <TouchableOpacity
          onPress={handleArrowClick}
          style={styles.arrowContainer}>
          <Image
            source={require('../assets/images/arrow.png')}
            style={styles.arrowImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/illustration2.png')}
            style={styles.backgroundImage}
          />
          <View
              style={styles.skipView}>
              <TouchableOpacity onPress={handleSkip}>
                <Text
                  style={styles.skipText}>
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text1View}>Use our Fonda ID for</Text>
          <View style={styles.row}>
            <Text style={styles.text1View}>your </Text>
            <Text style={styles.text2View}>KYC documents</Text>
          </View>
          <Text style={styles.text1View}>on all the platforms!</Text>
        </View>
        <TouchableOpacity
          onPress={handleArrowClick}
          style={styles.arrowContainer}>
          <Image
            source={require('../assets/images/arrow.png')}
            style={styles.arrowImage}
          />
          <View
              style={styles.skipView}>
              <TouchableOpacity onPress={handleSkip}>
                <Text
                  style={styles.skipText}>
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
        </TouchableOpacity>
      </View>

      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/illustration3.png')}
            style={styles.backgroundImage}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text1View}>There are 3 steps as</Text>
          <Text style={styles.row}>
            <Text style={styles.text1View}>simple - </Text>
            <Text style={styles.text2View}>Updating KYC</Text>
          </Text>
          <Text style={styles.text2View}>Details, Uploading</Text>
          <Text style={styles.text2View}>Documents, Get Fonda ID!</Text>
        </View>
        <TouchableOpacity
          onPress={handleGetStart}
          style={styles.buttonContainer}>
          <Text style={styles.buttonTextStyle}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  dot: {
    backgroundColor: '#E0E0E0',
    width: 14,
    height: 14,
    borderRadius: 10,
    margin: 5,
  },

  activeDot: {
    backgroundColor: '#F5A922',
    width: 14,
    height: 14,
    borderRadius: 10,
    margin: 5,
  },

  slide: {
    flex: 1,
  },

  imageContainer: {
    flex: 5,
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  textContainer: {
    flex: 4,
    marginTop: 10,
    marginLeft: 30,
  },

  text1View: {
    color: COLORS.TEXTCOLOR,
    fontSize: 28,
    fontFamily: FONTS.Medium,
  },

  text2View: {
    color: COLORS.PRIMARY,
    fontSize: 28,
    fontFamily: FONTS.Bold,
  },

  arrowContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },

  arrowImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  buttonContainer: {
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 0,
    color: COLORS.WHITE,
    borderColor: COLORS.PRIMARY,
    height: 50,
    alignItems: 'center',
    marginLeft: 35,
    marginRight: 35,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 60
  },
  skipView: {
      flex: 1,
  },
  skipText: {
    color: COLORS.TEXTCOLOR,
    fontFamily: FONTS.Regular,
    fontSize: 24,
    alignSelf: 'flex-end',
    textAlign: 'right',
    marginTop: 30,
    marginRight: 30,
  }
});

export default OnboardingScreen;
