/**
 * Unit tests for the JS wrapper around the id3 native module (src/Utils/Id3Sdk.js).
 * The native module is mocked; this checks argument forwarding and error handling only.
 */
import {NativeModules} from 'react-native';

const mockNative = () => {
  NativeModules.Id3Sdk = {
    getVersions: jest
      .fn()
      .mockResolvedValue({face: '10.0.0', bioseal: '1.42.10'}),
    getHardwareCodes: jest
      .fn()
      .mockResolvedValue({face: 'HW1', bioseal: 'HW2'}),
    activateFaceLicense: jest
      .fn()
      .mockResolvedValue({expiryDate: '2027-01-01', remainingDays: 100}),
    activateBiosealLicense: jest
      .fn()
      .mockResolvedValue({expiryDate: '2027-01-01', remainingDays: 100}),
    initFace: jest.fn().mockResolvedValue(true),
    compareFaces: jest
      .fn()
      .mockResolvedValue({score: 5000, threshold: 4000, isMatch: true}),
    verifyBioseal: jest
      .fn()
      .mockResolvedValue({json: '{}', signatureVerified: true}),
  };
  return NativeModules.Id3Sdk;
};

describe('Id3Sdk wrapper', () => {
  beforeEach(() => jest.resetModules());

  it('forwards calls to the native module', async () => {
    const native = mockNative();
    const Id3 = require('../src/Utils/Id3Sdk');

    expect(await Id3.getId3Versions()).toEqual({
      face: '10.0.0',
      bioseal: '1.42.10',
    });
    await Id3.initId3Face();
    expect(native.initFace).toHaveBeenCalledTimes(1);
    expect(await Id3.compareFaces('file:///a.jpg', '/b.jpg')).toEqual({
      score: 5000,
      threshold: 4000,
      isMatch: true,
    });
    expect(native.compareFaces).toHaveBeenCalledWith('file:///a.jpg', '/b.jpg');
    await Id3.verifyBioseal('QR');
    expect(native.verifyBioseal).toHaveBeenCalledWith('QR');
  });

  it('only activates the licenses whose serial key is provided', async () => {
    const native = mockNative();
    const Id3 = require('../src/Utils/Id3Sdk');

    const result = await Id3.activateId3Licenses({faceSerialKey: 'KEY'});
    expect(native.activateFaceLicense).toHaveBeenCalledWith('KEY');
    expect(native.activateBiosealLicense).not.toHaveBeenCalled();
    expect(result.bioseal).toBeNull();
  });

  it('propagates native rejections', async () => {
    const native = mockNative();
    native.compareFaces.mockRejectedValue(
      Object.assign(new Error('No face'), {code: 'ID3_NO_FACE'}),
    );
    const Id3 = require('../src/Utils/Id3Sdk');

    await expect(Id3.compareFaces('a', 'b')).rejects.toMatchObject({
      code: 'ID3_NO_FACE',
    });
  });

  it('rejects with a clear error when the native module is not linked', async () => {
    delete NativeModules.Id3Sdk;
    const Id3 = require('../src/Utils/Id3Sdk');

    await expect(Id3.initId3Face()).rejects.toThrow(
      'Id3Sdk native module is not linked',
    );
  });
});
