import Foundation
import id3Face
import id3Bioseal

/// React Native bridge for id3 Face SDK 10.0.0 and id3 BioSeal SDK 1.42.10.
/// Mirrors android/app/src/main/java/com/fonda_id/Id3Module.java.
/// All SDK calls run on a serial background queue so the JS thread is never blocked.
@objc(Id3Sdk)
class Id3Sdk: NSObject {

  private static let faceLicenseFile = "id3Face.lic"
  private static let biosealLicenseFile = "id3Bioseal.lic"
  private static let modelsDir = "id3-models"

  private let queue = DispatchQueue(label: "com.fonda_id.id3sdk")

  private var faceDetector: FaceDetector?
  private var faceEncoder: FaceEncoder?
  private var faceMatcher: FaceMatcher?

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc func getVersions(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    run(reject) {
      resolve(["face": try FaceLibrary.getVersion(), "bioseal": try BiosealLibrary.getVersion()])
    }
  }

  /// Hardware codes to give id3 when requesting licenses for this app.
  @objc func getHardwareCodes(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    run(reject) {
      resolve([
        "face": try FaceLicense.getHostHardwareCode(hardwareCodeType: id3Face.LicenseHardwareCodeType.ios),
        "bioseal": try BiosealLicense.getHostHardwareCode(hardwareCodeType: id3Bioseal.LicenseHardwareCodeType.ios),
      ])
    }
  }

  /// Loads the stored Face license, or activates it online with the serial key on first run.
  @objc func activateFaceLicense(_ serialKey: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    run(reject) {
      let licenseUrl = try Id3Sdk.licenseUrl(Id3Sdk.faceLicenseFile)
      if !FileManager.default.fileExists(atPath: licenseUrl.path) {
        let hardwareCode = try FaceLicense.getHostHardwareCode(hardwareCodeType: id3Face.LicenseHardwareCodeType.ios)
        let license = try FaceLicense.activateSerialKeyBuffer(hardwareCode: hardwareCode, serialKey: serialKey, commentary: "FondaID iOS")
        try Data(license).write(to: licenseUrl)
      }
      try FaceLicense.checkLicense(licensePath: licenseUrl.path)
      resolve(["expiryDate": try FaceLicense.getExpiryDate(), "remainingDays": try FaceLicense.getRemainingDays()])
    }
  }

  @objc func activateBiosealLicense(_ serialKey: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    run(reject) {
      let licenseUrl = try Id3Sdk.licenseUrl(Id3Sdk.biosealLicenseFile)
      if !FileManager.default.fileExists(atPath: licenseUrl.path) {
        let hardwareCode = try BiosealLicense.getHostHardwareCode(hardwareCodeType: id3Bioseal.LicenseHardwareCodeType.ios)
        let license = try BiosealLicense.activateSerialKeyBuffer(hardwareCode: hardwareCode, serialKey: serialKey, commentary: "FondaID iOS")
        try Data(license).write(to: licenseUrl)
      }
      try BiosealLicense.checkLicense(licensePath: licenseUrl.path)
      resolve(["expiryDate": try BiosealLicense.getExpiryDate(), "remainingDays": try BiosealLicense.getRemainingDays()])
    }
  }

  /// Loads the detector and encoder models bundled from ios/id3-models and creates the
  /// reusable computation objects. Call once after activateFaceLicense.
  @objc func initFace(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    run(reject) {
      if self.faceDetector == nil {
        try Id3Sdk.loadModel(.faceDetector4A)
        try Id3Sdk.loadModel(.faceEncoder9A)
        let detector = try FaceDetector()
        try detector.setModel(model: .faceDetector4A)
        let encoder = try FaceEncoder()
        try encoder.setModel(model: .faceEncoder9A)
        self.faceMatcher = try FaceMatcher()
        self.faceEncoder = encoder
        self.faceDetector = detector
      }
      resolve(true)
    }
  }

  /// Compares the largest face of two image files. Resolves { score, isMatch, threshold }
  /// where threshold is the FMR 1/10,000 operating point.
  @objc func compareFaces(_ imagePath1: String, imagePath2: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    run(reject) {
      guard let matcher = self.faceMatcher else {
        reject("ID3_NOT_INITIALIZED", "Call initFace() first", nil)
        return
      }
      guard let t1 = try self.createTemplate(Id3Sdk.stripFileScheme(imagePath1)) else {
        reject("ID3_NO_FACE", "No face detected in first image", nil)
        return
      }
      guard let t2 = try self.createTemplate(Id3Sdk.stripFileScheme(imagePath2)) else {
        reject("ID3_NO_FACE", "No face detected in second image", nil)
        return
      }
      let score = Int(try matcher.compareTemplates(reference: t1, probe: t2))
      let threshold = FaceMatcherThreshold.fmr10000.value
      resolve(["score": score, "threshold": threshold, "isMatch": score >= threshold])
    }
  }

  /// Decodes and verifies a BioSeal (VDS) from the text content of a scanned QR code.
  @objc func verifyBioseal(_ qrContent: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    run(reject) {
      let bioseal = try Bioseal()
      let result = try bioseal.verifyFromString(data: qrContent)
      resolve([
        "json": try bioseal.buildVdsAsJson(indentation: "  "),
        "signatureVerified": result.VdsSignatureVerified == 1,
        "certificateChainVerified": result.CertificationChainVerified == 1,
        "notExpired": result.VdsNotExpired == 1,
        "verificationResult": [
          "certificationChainVerified": result.CertificationChainVerified,
          "governanceValid": result.GovernanceValid,
          "lotlGovernanceValid": result.LotlGovernanceValid,
          "tslGovernanceValid": result.TslGovernanceValid,
          "manifestGovernanceValid": result.ManifestGovernanceValid,
          "vdsNotExpired": result.VdsNotExpired,
          "vdsSignatureVerified": result.VdsSignatureVerified,
          "caCertificateVerified": result.CaCertificateVerified,
          "signingCertificateUsageAuthorized": result.SigningCertificateUsageAuthorized,
        ],
      ])
    }
  }

  // MARK: - Helpers

  private func run(_ reject: @escaping RCTPromiseRejectBlock, _ body: @escaping () throws -> Void) {
    queue.async {
      do {
        try body()
      } catch let e as FaceException {
        reject("ID3_FACE_\(e.getErrorCode())", e.getMessage(), e)
      } catch let e as BiosealException {
        reject("ID3_BIOSEAL_\(e.getErrorCode())", e.getMessage(), e)
      } catch {
        reject("ID3_ERROR", error.localizedDescription, error)
      }
    }
  }

  private func createTemplate(_ imagePath: String) throws -> FaceTemplate? {
    guard let detector = faceDetector, let encoder = faceEncoder else { return nil }
    let image = try Image.fromFile(filepath: imagePath, pixelFormat: .bgr24Bits)
    let faces = try detector.detectFaces(image: image)
    if faces.count == 0 {
      return nil
    }
    return try encoder.createTemplate(image: image, detectedFace: try faces.getLargestFace())
  }

  private static func loadModel(_ model: FaceModel) throws {
    let fileName = try FaceLibrary.getModelFileName(model: model)
    guard let url = Bundle.main.resourceURL?.appendingPathComponent(modelsDir).appendingPathComponent(fileName),
          let data = FileManager.default.contents(atPath: url.path) else {
      throw NSError(domain: "Id3Sdk", code: 1, userInfo: [NSLocalizedDescriptionKey: "Model file '\(fileName)' not found in app bundle folder \(modelsDir)"])
    }
    try FaceLibrary.loadModelBuffer(modelBuffer: [UInt8](data), faceModel: model, processingUnit: .cpu)
  }

  private static func licenseUrl(_ fileName: String) throws -> URL {
    let dir = try FileManager.default.url(for: .applicationSupportDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
    return dir.appendingPathComponent(fileName)
  }

  private static func stripFileScheme(_ path: String) -> String {
    return path.hasPrefix("file://") ? String(path.dropFirst("file://".count)) : path
  }
}
