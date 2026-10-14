package com.fonda_id;

import android.content.res.AssetManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import eu.id3.bioseal.Bioseal;
import eu.id3.bioseal.BiosealException;
import eu.id3.bioseal.BiosealLicense;
import eu.id3.bioseal.VerificationResult;
import eu.id3.face.DetectedFace;
import eu.id3.face.DetectedFaceList;
import eu.id3.face.FaceDetector;
import eu.id3.face.FaceEncoder;
import eu.id3.face.FaceException;
import eu.id3.face.FaceLibrary;
import eu.id3.face.FaceLicense;
import eu.id3.face.FaceMatcher;
import eu.id3.face.FaceMatcherThreshold;
import eu.id3.face.FaceModel;
import eu.id3.face.FaceTemplate;
import eu.id3.face.Image;
import eu.id3.face.PixelFormat;
import eu.id3.face.ProcessingUnit;

/**
 * React Native bridge for id3 Face SDK 10.0.0 and id3 BioSeal SDK 1.42.10.
 * All SDK calls run on a single background thread so the JS thread is never blocked.
 */
public class Id3Module extends ReactContextBaseJavaModule {

    private static final String FACE_LICENSE_FILE = "id3Face.lic";
    private static final String BIOSEAL_LICENSE_FILE = "id3Bioseal.lic";
    private static final String MODELS_ASSET_DIR = "id3-models";

    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    private FaceDetector faceDetector;
    private FaceEncoder faceEncoder;
    private FaceMatcher faceMatcher;

    Id3Module(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "Id3Sdk";
    }

    @ReactMethod
    public void getVersions(Promise promise) {
        executor.execute(() -> {
            try {
                WritableMap map = Arguments.createMap();
                map.putString("face", FaceLibrary.getVersion());
                map.putString("bioseal", eu.id3.bioseal.BiosealLibrary.getVersion());
                promise.resolve(map);
            } catch (Exception e) {
                promise.reject("ID3_ERROR", e.getMessage(), e);
            }
        });
    }

    /** Hardware codes to give id3 when requesting licenses for this app. */
    @ReactMethod
    public void getHardwareCodes(Promise promise) {
        executor.execute(() -> {
            try {
                WritableMap map = Arguments.createMap();
                map.putString("face", FaceLicense.getHostHardwareCode(eu.id3.face.LicenseHardwareCodeType.ANDROID));
                map.putString("bioseal", BiosealLicense.getHostHardwareCode(eu.id3.bioseal.LicenseHardwareCodeType.ANDROID));
                promise.resolve(map);
            } catch (Exception e) {
                promise.reject("ID3_ERROR", e.getMessage(), e);
            }
        });
    }

    /**
     * Loads the stored Face license, or activates it online with the serial key on first run.
     * The license file is kept in the app's private files directory.
     */
    @ReactMethod
    public void activateFaceLicense(String serialKey, Promise promise) {
        executor.execute(() -> {
            try {
                File licenseFile = new File(getReactApplicationContext().getFilesDir(), FACE_LICENSE_FILE);
                if (!licenseFile.exists()) {
                    String hardwareCode = FaceLicense.getHostHardwareCode(eu.id3.face.LicenseHardwareCodeType.ANDROID);
                    byte[] license = FaceLicense.activateSerialKeyBuffer(hardwareCode, serialKey, "FondaID Android");
                    writeFile(licenseFile, license);
                }
                FaceLicense.checkLicense(licenseFile.getAbsolutePath());
                WritableMap map = Arguments.createMap();
                map.putString("expiryDate", FaceLicense.getExpiryDate());
                map.putInt("remainingDays", FaceLicense.getRemainingDays());
                promise.resolve(map);
            } catch (FaceException e) {
                promise.reject("ID3_FACE_LICENSE_" + e.getErrorCode(), e.getMessage(), e);
            } catch (Exception e) {
                promise.reject("ID3_ERROR", e.getMessage(), e);
            }
        });
    }

    @ReactMethod
    public void activateBiosealLicense(String serialKey, Promise promise) {
        executor.execute(() -> {
            try {
                File licenseFile = new File(getReactApplicationContext().getFilesDir(), BIOSEAL_LICENSE_FILE);
                if (!licenseFile.exists()) {
                    String hardwareCode = BiosealLicense.getHostHardwareCode(eu.id3.bioseal.LicenseHardwareCodeType.ANDROID);
                    byte[] license = BiosealLicense.activateSerialKeyBuffer(hardwareCode, serialKey, "FondaID Android");
                    writeFile(licenseFile, license);
                }
                BiosealLicense.checkLicense(licenseFile.getAbsolutePath());
                WritableMap map = Arguments.createMap();
                map.putString("expiryDate", BiosealLicense.getExpiryDate());
                map.putInt("remainingDays", BiosealLicense.getRemainingDays());
                promise.resolve(map);
            } catch (BiosealException e) {
                promise.reject("ID3_BIOSEAL_LICENSE_" + e.getErrorCode(), e.getMessage(), e);
            } catch (Exception e) {
                promise.reject("ID3_ERROR", e.getMessage(), e);
            }
        });
    }

    /**
     * Loads the detector and encoder models from android/app/src/main/assets/id3-models
     * and creates the reusable computation objects. Call once after activateFaceLicense.
     */
    @ReactMethod
    public void initFace(Promise promise) {
        executor.execute(() -> {
            try {
                if (faceDetector == null) {
                    loadModelFromAssets(FaceModel.FACE_DETECTOR_4A);
                    loadModelFromAssets(FaceModel.FACE_ENCODER_9A);
                    faceDetector = new FaceDetector();
                    faceDetector.setModel(FaceModel.FACE_DETECTOR_4A);
                    faceEncoder = new FaceEncoder();
                    faceEncoder.setModel(FaceModel.FACE_ENCODER_9A);
                    faceMatcher = new FaceMatcher();
                }
                promise.resolve(true);
            } catch (FaceException e) {
                promise.reject("ID3_FACE_" + e.getErrorCode(), e.getMessage(), e);
            } catch (Exception e) {
                promise.reject("ID3_ERROR", e.getMessage(), e);
            }
        });
    }

    /**
     * Compares the largest face of two image files (absolute paths, e.g. from react-native-image-picker).
     * Resolves { score, isMatch, threshold } where threshold is the FMR 1/10,000 operating point.
     */
    @ReactMethod
    public void compareFaces(String imagePath1, String imagePath2, Promise promise) {
        executor.execute(() -> {
            if (faceDetector == null) {
                promise.reject("ID3_NOT_INITIALIZED", "Call initFace() first");
                return;
            }
            try (FaceTemplate t1 = createTemplate(stripFileScheme(imagePath1));
                 FaceTemplate t2 = createTemplate(stripFileScheme(imagePath2))) {
                if (t1 == null || t2 == null) {
                    promise.reject("ID3_NO_FACE", "No face detected in " + (t1 == null ? "first" : "second") + " image");
                    return;
                }
                int score = faceMatcher.compareTemplates(t1, t2);
                int threshold = FaceMatcherThreshold.FMR10000.getValue();
                WritableMap map = Arguments.createMap();
                map.putInt("score", score);
                map.putInt("threshold", threshold);
                map.putBoolean("isMatch", score >= threshold);
                promise.resolve(map);
            } catch (FaceException e) {
                promise.reject("ID3_FACE_" + e.getErrorCode(), e.getMessage(), e);
            } catch (Exception e) {
                promise.reject("ID3_ERROR", e.getMessage(), e);
            }
        });
    }

    /**
     * Decodes and verifies a BioSeal (VDS) from the text content of a scanned QR code.
     * Resolves { json, signatureVerified, certificateChainVerified, notExpired, verificationResult }.
     */
    @ReactMethod
    public void verifyBioseal(String qrContent, Promise promise) {
        executor.execute(() -> {
            try (Bioseal bioseal = new Bioseal()) {
                VerificationResult result = bioseal.verifyFromString(qrContent);
                WritableMap map = Arguments.createMap();
                map.putString("json", bioseal.buildVdsAsJson("  "));
                map.putBoolean("signatureVerified", result.vdsSignatureVerified == 1);
                map.putBoolean("certificateChainVerified", result.certificationChainVerified == 1);
                map.putBoolean("notExpired", result.vdsNotExpired == 1);

                WritableMap raw = Arguments.createMap();
                raw.putInt("certificationChainVerified", result.certificationChainVerified);
                raw.putInt("governanceValid", result.governanceValid);
                raw.putInt("lotlGovernanceValid", result.lotlGovernanceValid);
                raw.putInt("tslGovernanceValid", result.tslGovernanceValid);
                raw.putInt("manifestGovernanceValid", result.manifestGovernanceValid);
                raw.putInt("vdsNotExpired", result.vdsNotExpired);
                raw.putInt("vdsSignatureVerified", result.vdsSignatureVerified);
                raw.putInt("caCertificateVerified", result.caCertificateVerified);
                raw.putInt("signingCertificateUsageAuthorized", result.signingCertificateUsageAuthorized);
                map.putMap("verificationResult", raw);
                promise.resolve(map);
            } catch (BiosealException e) {
                promise.reject("ID3_BIOSEAL_" + e.getErrorCode(), e.getMessage(), e);
            } catch (Exception e) {
                promise.reject("ID3_ERROR", e.getMessage(), e);
            }
        });
    }

    private FaceTemplate createTemplate(String imagePath) throws FaceException {
        try (Image image = Image.fromFile(imagePath, PixelFormat.BGR_24_BITS);
             DetectedFaceList faces = faceDetector.detectFaces(image)) {
            if (faces.getCount() == 0) {
                return null;
            }
            try (DetectedFace face = faces.getLargestFace()) {
                return faceEncoder.createTemplate(image, face);
            }
        }
    }

    /** Releases native SDK resources when the React instance is torn down (e.g. reload). */
    @Override
    public void invalidate() {
        executor.execute(() -> {
            if (faceDetector != null) faceDetector.close();
            if (faceEncoder != null) faceEncoder.close();
            if (faceMatcher != null) faceMatcher.close();
            faceDetector = null;
            faceEncoder = null;
            faceMatcher = null;
        });
        executor.shutdown();
        super.invalidate();
    }

    private void loadModelFromAssets(FaceModel model) throws IOException, FaceException {
        String fileName = FaceLibrary.getModelFileName(model);
        AssetManager assets = getReactApplicationContext().getAssets();
        try (InputStream in = assets.open(MODELS_ASSET_DIR + "/" + fileName)) {
            FaceLibrary.loadModelBuffer(readAll(in), model, ProcessingUnit.CPU);
        } catch (IOException e) {
            throw new IOException("Model file '" + fileName + "' not found in assets/" + MODELS_ASSET_DIR, e);
        }
    }

    private static String stripFileScheme(String path) {
        return path.startsWith("file://") ? path.substring("file://".length()) : path;
    }

    private static byte[] readAll(InputStream in) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buffer = new byte[64 * 1024];
        int n;
        while ((n = in.read(buffer)) != -1) {
            out.write(buffer, 0, n);
        }
        return out.toByteArray();
    }

    private static void writeFile(File file, byte[] data) throws IOException {
        try (FileOutputStream out = new FileOutputStream(file)) {
            out.write(data);
        }
    }
}
