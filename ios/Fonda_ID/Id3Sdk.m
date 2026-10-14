#import <React/RCTBridgeModule.h>

// Exposes the Swift Id3Sdk class (Id3Sdk.swift) to React Native as NativeModules.Id3Sdk
@interface RCT_EXTERN_MODULE(Id3Sdk, NSObject)

RCT_EXTERN_METHOD(getVersions:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getHardwareCodes:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(activateFaceLicense:(NSString *)serialKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(activateBiosealLicense:(NSString *)serialKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initFace:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(compareFaces:(NSString *)imagePath1 imagePath2:(NSString *)imagePath2 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(verifyBioseal:(NSString *)qrContent resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
