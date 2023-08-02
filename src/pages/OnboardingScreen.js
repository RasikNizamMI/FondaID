import React, {useRef} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Swiper from 'react-native-swiper';

const OnboardingScreen = ({navigation}) => {
  const swiperRef = useRef(null);

  const handleSkip = () => {
    // Handle the "Skip" button click here
    swiperRef.current?.scrollTo(4);
  };

  const handleArrowClick = () => {
    // Handle the arrow button click here
    swiperRef.current?.scrollBy(1);
  };

  const handleGetStart = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <Swiper
      ref={swiperRef}
      // containerStyle={styles.swiperContainer} // Add containerStyle to customize the Swiper container
      dot={<View style={styles.dot} />} // Customize the dot style
      activeDot={<View style={styles.activeDot} />} // Customize the active dot style
    >
      <View style={styles.slide}>
        <Image
          source={require('../images/Vector.png')}
          style={styles.backgroundImage}
        />
        {/* Your content goes here */}
        <View style={styles.contentContainer}>
          <View>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.topImageView}>
              <Image
                source={require('../images/illustration.png')}
                style={styles.topImage}
              />
            </View>
            <View style={{}}>
              <Text style={styles.text1View}>Drained to upload</Text>
              <Text style={styles.text2View}>KYC documents</Text>
              <Text style={styles.text1View}>to multiple platforms?</Text>
            </View>
            <View style={styles.arrowImageView}>
              <TouchableOpacity onPress={handleArrowClick}>
                <Image
                  source={require('../images/arrow.png')}
                  style={styles.arrowImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.slide}>
        <Image
          source={require('../images/Vector.png')}
          style={styles.backgroundImage}
        />
        {/* Your content goes here */}
        <View style={styles.contentContainer}>
          <View>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.topImageView}>
              <Image
                source={require('../images/illustration1.png')}
                style={styles.topImage}
              />
            </View>
            <View style={{}}>
              <Text style={styles.text1View}>Here, Upload all your</Text>
              <Text style={styles.text2View}>KYC documents</Text>
              <Text style={styles.text1View}>once!</Text>
            </View>
            <View style={styles.arrowImageView}>
              <TouchableOpacity onPress={handleArrowClick}>
                <Image
                  source={require('../images/arrow.png')}
                  style={styles.arrowImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.slide}>
        <Image
          source={require('../images/Vector.png')}
          style={styles.backgroundImage}
        />
        {/* Your content goes here */}
        <View style={styles.contentContainer}>
          <View>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.topImageView}>
              <Image
                source={require('../images/illustration2.png')}
                style={styles.topImage}
              />
            </View>
            <View style={{}}>
              <Text style={styles.text1View}>Use our Fonda ID for</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.text1View}>your </Text>
                <Text style={[styles.text2View, {marginLeft: 0}]}>
                  KYC documents
                </Text>
              </View>
              <Text style={styles.text1View}>on all the platforms!</Text>
            </View>
            <View style={styles.arrowImageView}>
              <TouchableOpacity onPress={handleArrowClick}>
                <Image
                  source={require('../images/arrow.png')}
                  style={styles.arrowImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.slide}>
        <Image
          source={require('../images/Vector.png')}
          style={styles.backgroundImage}
        />
        {/* Your content goes here */}
        <View style={styles.contentContainer}>
          <View>
            <View style={styles.topImageView}>
              <Image
                source={require('../images/illustration3.png')}
                style={styles.topImage}
              />
            </View>
            <View style={{}}>
              <Text style={styles.text1View}>There are 3 steps as</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.text1View}>simple - </Text>
                <Text style={[styles.text2View, {marginLeft: 0}]}>
                  Updating KYC
                </Text>
              </View>
              <Text style={styles.text2View}>Details, Uploading</Text>
              <Text style={styles.text2View}>Documents, Get Fonda ID!</Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleGetStart}
                // onPress={() => navigation.navigate('WebViewPage')}
              >
                <Text style={styles.buttonTextStyle}>Get Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  swiperContainer: {
    backgroundColor: 'lightblue', // Change the background color of the Swiper container
  },
  dot: {
    backgroundColor: '#E0E0E0', // Change the color of the dots
    width: 14,
    height: 14,
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  activeDot: {
    backgroundColor: '#F5A922', // Change the color of the active dot
    width: 14,
    height: 14,
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  slide: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch', // or 'stretch' if you want to stretch the image
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '55%',
  },
  contentContainer: {
    flex: 1,
  },
  skipText: {
    color: '#37474F',
    fontSize: 24,
    alignSelf: 'flex-end',
    textAlign: 'right',
    marginTop: 30,
    marginRight: 30,
  },
  topImageView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topImage: {width: '70%', resizeMode: 'contain', height: '60%'},
  text1View: {
    color: '#37474F',
    fontSize: 28,
    marginLeft: 30,
  },
  text2View: {
    color: '#F5A922',
    fontSize: 28,
    marginLeft: 30,
  },
  arrowImageView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  arrowImage: {
    width: 60,
    resizeMode: 'contain',
    height: 60,
  },
  buttonStyle: {
    backgroundColor: '#F5A922',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#F5A922',
    height: 50,
    alignItems: 'center',
    borderRadius: 0,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 30,
    borderRadius: 10,
    justifyContent: 'center'
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 15,
    fontSize: 16,
  },
});

export default OnboardingScreen;
