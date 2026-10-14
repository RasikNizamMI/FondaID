// CommonModal.js

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {COLORS, FONTS} from '../assets/Colors';

const CommonModal = ({
  visible,
  onClose,
  imageSource,
  message,
  header,
  color,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={[styles.header, {color}]} accessibilityRole="header">
            {header}
          </Text>
          <View style={styles.imageWrapper}>
            <Image source={imageSource} style={styles.image} />
          </View>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} accessibilityRole="button">
            <View style={styles.button}>
              <Text style={styles.buttonText}>OK</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    flexDirection: 'column',
    elevation: 4,
  },
  header: {
    fontSize: 24,
    fontFamily: FONTS.Bold,
    textAlign: 'center',
  },
  imageWrapper: {justifyContent: 'center', alignItems: 'center', marginTop: 20},
  image: {height: 60, width: 60},
  message: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    height: 40,
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 30,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontFamily: FONTS.Regular,
  },
});

export default CommonModal;
