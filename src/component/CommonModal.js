// CommonModal.js

import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS } from '../assets/Colors';

const CommonModal = ({ visible, onClose, imageSource, message, header, color }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', flexDirection: 'column',  elevation: 4, }}>
          <Text style={{color: color, fontSize: 24, fontFamily: FONTS.Bold, textAlign: 'center'}}>{header}</Text>
          <View style={{justifyContent: 'center', alignItems: 'center',marginTop: 20}}>
          <Image source={imageSource} style={{height: 60, width: 60, }} />
          </View>
          <Text style={{color: COLORS.BLACK, fontSize: 14, fontFamily: FONTS.Regular, textAlign: 'center', marginTop: 20}}>{message}</Text>
          <TouchableOpacity onPress={onClose}>
            <View style={{height: 40, borderColor: COLORS.PRIMARY, borderWidth: 2, borderRadius: 10, marginTop: 30, justifyContent: 'center'}}>
            <Text style={{ textAlign: 'center', color: COLORS.PRIMARY, fontSize: 16, fontFamily: FONTS.Regular }}>OK</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CommonModal;
