import {NativeModules, Platform} from 'react-native';

// Native bridge implemented in:
//   android/app/src/main/java/com/fonda_id/Id3Module.java
//   ios/Fonda_ID/Id3Sdk.swift
const {Id3Sdk} = NativeModules;

// Returns the native module, or throws a clear error if it is not linked
// (e.g. the app was not rebuilt after adding the SDK, or running in Expo Go).
const sdk = () => {
  if (!Id3Sdk) {
    throw new Error(
      `Id3Sdk native module is not linked on ${Platform.OS}. Rebuild the native app.`,
    );
  }
  return Id3Sdk;
};

// Returns {face, bioseal} SDK versions.
export const getId3Versions = async () => sdk().getVersions();

// Returns {face, bioseal} hardware codes to send to id3 when requesting licenses.
export const getId3HardwareCodes = async () => sdk().getHardwareCodes();

// Activates (first run, needs internet) or reloads the stored licenses.
// Each resolves {expiryDate, remainingDays}.
export const activateId3Licenses = async ({
  faceSerialKey,
  biosealSerialKey,
}) => {
  const face = faceSerialKey
    ? await sdk().activateFaceLicense(faceSerialKey)
    : null;
  const bioseal = biosealSerialKey
    ? await sdk().activateBiosealLicense(biosealSerialKey)
    : null;
  return {face, bioseal};
};

// Loads the face detector/encoder models. Call once after the Face license is active.
// Safe to call again: models are only loaded the first time.
export const initId3Face = async () => sdk().initFace();

// Compares the largest face in two image files (e.g. selfie vs. ID photo from
// react-native-image-picker `assets[0].uri`). Resolves {score, threshold, isMatch}.
export const compareFaces = async (imagePath1, imagePath2) =>
  sdk().compareFaces(imagePath1, imagePath2);

// Verifies a BioSeal / VDS QR code from its scanned text content.
// Resolves {json, signatureVerified, certificateChainVerified, notExpired, verificationResult}.
export const verifyBioseal = async qrContent => sdk().verifyBioseal(qrContent);
