# SDK Integration Guide

id3 Technologies **Face SDK 10.0.0** and **BioSeal SDK 1.42.10** in the Fonda_ID React Native app.

> Status legend used in this guide: **Verified** = checked by a command or the vendor's own files during the audit. **Derived** = inferred from vendor build metadata, not stated by the vendor. **Unverified** = could not be checked (see §3.5).

---

## 1. Overview

### Purpose

| SDK | Version | Purpose in Fonda_ID |
|---|---|---|
| **id3 Face SDK** | 10.0.0 | Face detection, face template encoding and 1:1 face matching (e.g. selfie vs. ID-document photo). |
| **id3 BioSeal SDK** | 1.42.10 | Decoding and cryptographic verification of BioSeal / Visible Digital Seals (VDS, ISO 22376) read from QR codes. |

Both are commercial, licensed SDKs from id3 Technologies, distributed as ZIP packages. **They are not on npm, Maven Central or CocoaPods.** The unpacked vendor packages are in the repository root:

| Folder | Package identified by | Native artifacts used by the app |
|---|---|---|
| `10.0.0/` | `10.0.0/readme.md` ("id3 Face SDK, Version 10.0.0"), `10.0.0/changelog.md` ("Version 10.0.0 (2026-01-19)") | `bin/android/eu.id3.face.aar`, `bin/apple/id3Face.xcframework.zip` |
| `1.42.10/` | `1.42.10/readme.md` ("id3 Bioseal SDK, Version 1.42.10"), `1.42.10/changelog.md` ("Version 1.42.10 (2026-07-09)") | `bin/android/eu.id3.bioseal.aar`, `bin/apple/id3Bioseal.xcframework.zip` |

### Supported platforms

- **Android:** real devices or ARM emulators (`arm64-v8a`, `armeabi-v7a`). The AARs contain no x86/x86_64 libraries, so **x86 emulators are not supported**.
- **iOS:** **physical devices only** (`ios-arm64`). The xcframeworks contain **no iOS Simulator slice**.

### Integration architecture

Neither SDK ships a React Native package, so the app contains its own thin native bridge exposing the same JS API on both platforms:

```
React Native JS ── src/Utils/Id3Sdk.js  (+ Id3Sdk.d.ts types)
        │  NativeModules.Id3Sdk
        ├── Android: Id3Module.java ── eu.id3.face.* / eu.id3.bioseal.*  (libs/*.aar → libid3Face.so, libid3Bioseal.so)
        └── iOS:     Id3Sdk.swift (+ Id3Sdk.m export) ── import id3Face / id3Bioseal (Frameworks/*.xcframework)
```

All SDK calls run on one background thread/queue per platform. Each JS function returns a Promise.

---

## 2. Prerequisites

| Requirement | Value in this project | Notes |
|---|---|---|
| Node.js | `.node-version` pins **18**; audit ran on 25.2.1 | React Native 0.71 requires `>=14` (`node_modules/react-native/package.json`). Prefer the pinned 18. |
| React Native | 0.71.11 (React Native CLI, **not Expo**) | Expo Go cannot load these native SDKs. |
| Package manager | **npm** (`package-lock.json`) | `.npmrc` sets `legacy-peer-deps=true`. |
| JDK | 17 | Used for all Android builds in the audit. |
| Android SDK | platform `android-33`, build-tools 33.0.0 | `compileSdkVersion = 33`, `minSdkVersion = 21`, `targetSdkVersion = 33` (`android/build.gradle`). |
| Gradle / AGP | Gradle 7.5.1, Android Gradle Plugin 7.3.1 | Plus R8 8.2.47 pinned (see §6). Kotlin is not used. |
| Xcode | **26.3 or newer (Derived)** | Not installed on the audit machine. The frameworks were built with Xcode 26.2/26.3 (Swift 6.2.3/6.2.4, from `DTXcode` in their `Info.plist` and their `.swiftinterface` headers). An older Swift compiler cannot read a newer module interface. |
| Ruby / CocoaPods | System Ruby 2.6.10 + CocoaPods 1.17.0 via Bundler (`Gemfile`) | Homebrew CocoaPods (Ruby 4.0) **fails** on RN 0.71 (see §15). |
| SDK packages | `10.0.0/` and `1.42.10/` from id3 | Needed only to refresh the copied artifacts. The app builds from `android/app/libs/` and `ios/Frameworks/`. |
| **Model files** | `face_detector_v4a.id3nn`, `face_encoder_v9a.id3nn` | Download from the URL in `10.0.0/readme.md` ("Model files" section). File names must not be changed. |
| **Licenses** | One serial key for Face SDK, one for BioSeal SDK | Supplied by id3. Activation needs internet access on first run. |

---

## 3. Version Compatibility

### 3.1 Exact versions

| Component | Version | How it was verified |
|---|---|---|
| id3 Face SDK | 10.0.0 | `FaceLibrary.getVersion()` returned `10.0.0` (desktop JVM smoke test, §14.3); framework `CFBundleShortVersionString = 10.0.0`. |
| id3 BioSeal SDK | 1.42.10 | `1.42.10/readme.md`, changelog, framework `CFBundleShortVersionString = 1.42.10`. |

### 3.2 Compatibility matrix

| Component | Detected Version | Required Version | Compatible? | Evidence |
|---|---|---|---|---|
| React Native | 0.71.11 | Any RN with native modules (no RN-specific requirement from id3) | **Yes (Verified build)** | Android debug APK built with both SDKs. Bridge uses the classic `ReactContextBaseJavaModule` / `RCT_EXTERN_MODULE` APIs. |
| id3 Face SDK (Android) | 10.0.0 | minSdk 21 | **Yes** | AAR `AndroidManifest.xml`: `minSdkVersion="21"`; `aar-metadata`: `minCompileSdk=1`. |
| id3 BioSeal SDK (Android) | 1.42.10 | minSdk 21; AAR metadata asks `minCompileSdk=36` | **Yes, with a workaround (Verified build)** | App compiles against 33. The AAR's classes contain **no `android.*` references** (checked with `javap`), so the metadata check is disabled (§6). Changelog 1.51.2 notes "Updated compile sdk to Version 36", which shows this is the vendor build default. |
| id3 Face SDK (iOS) | 10.0.0 | iOS 12.0 | **Yes** | Framework `MinimumOSVersion = 12.0`; app target is 12.4. |
| id3 BioSeal SDK (iOS) | 1.42.10 | iOS 12 | **Yes** | Framework `MinimumOSVersion = 12`. |
| iOS deployment target | 12.4 | ≥ 12.0 | **Yes** | `IPHONEOS_DEPLOYMENT_TARGET = 12.4` in `project.pbxproj`. |
| Node.js | 25.2.1 installed / 18 pinned | ≥ 14 (RN 0.71) | **Yes** | `npm install`, `tsc`, `jest` and Gradle autolinking ran on 25.2.1. |
| Gradle | 7.5.1 | AGP 7.3.1 requires ≥ 7.4 | **Yes** | `gradle-wrapper.properties`; builds succeeded. |
| Android Gradle Plugin | 7.3.1 | — | **Yes, with R8 8.2.47 pinned** | The R8 bundled with AGP 7.3.1 crashed dexing both AARs (`NullPointerException` in `DexArchiveBuilder`). |
| Kotlin | not used | not required | N/A | Both SDKs ship Java APIs; the bridge is Java. |
| CocoaPods | 1.17.0 (Bundler) | Gemfile `>= 1.11.3` | **Partially verified** | `pod install` resolved all pods, then stopped at glog's `configure` because Xcode is missing. |
| Xcode | not installed | 26.3+ (Derived) | **Unverified** | See §2. |
| 16 KB page size (Android 15+) | — | 64-bit libs aligned to 16 KB | **Yes (arm64)** | ELF `PT_LOAD` alignment = 16384 for both arm64 `.so` files. (Face armeabi-v7a is 4096, which is allowed for 32-bit.) |

### 3.3 Do the two SDKs work together?

They are **independent products** with separate libraries, packages (`eu.id3.face` / `eu.id3.bioseal`) and licenses, and neither depends on the other. Both are linked into the same APK, and the Android build succeeded with no duplicate-class or native-library conflicts. The vendor documentation **does not state** a pairing or a joint compatibility matrix.

### 3.4 Breaking changes to know about

- **Face 10.0.0** (major): removed deprecated models (Encoder 8A, BlurinessPAD, …), changed error codes, and changed default models. `GetLargestFace` now returns null for an empty list. The bridge selects its models explicitly (Detector 4A, Encoder 9A) and checks the face count first.
- **BioSeal:** the changelog says "Version 1.5x are deprecated and no longer maintained. Please use version 1.42.8 instead." **1.42.10 is the newest release on the maintained line.** Do not "upgrade" to 1.5x.

### 3.5 Unverified items

- iOS compilation and linking in Xcode (Xcode not installed). The Swift bridge **was** typechecked against the SDKs' Swift interfaces (§14.2).
- Runtime behaviour on a device: no Android device or emulator was attached, and no model files or licenses were available.
- Exact minimum Xcode version (Derived, not vendor-stated).
- The BioSeal macOS desktop library could not be loaded on the audit Mac (see §15, "BioSeal macOS library").

---

## 4. Project Structure

```
FondaID/
├── 10.0.0/                         # id3 Face SDK 10.0.0 vendor package (docs, jars, AAR, xcframework zip)
├── 1.42.10/                        # id3 BioSeal SDK 1.42.10 vendor package
├── GUIDE.md                        # this document
├── Gemfile / Gemfile.lock          # CocoaPods via Bundler (Gemfile.lock created by `bundle install`)
├── .bundle/config                  # Bundler installs gems into vendor/bundle (git-ignored)
├── patches/react-native+0.71.11.patch   # fixes RN 0.71 boost download URL (applied on npm install)
├── tsconfig.json                   # excludes vendor SDK folders from type checking
├── __tests__/Id3Sdk-test.js        # Jest tests for the JS wrapper
├── __tests__/sharedUtils-test.js   # Jest tests for apiUtils, AsyncStorageUtil, withInternetConnectivity, CommonModal
├── __tests__/SplashScreen-test.js  # Jest tests for splash routing and timer cleanup
├── jest.setup.js                   # Jest mocks for native modules (needed by App-test.tsx)
├── src/Utils/
│   ├── Id3Sdk.js                   # JS API used by screens
│   └── Id3Sdk.d.ts                 # TypeScript declarations for the JS API
├── android/
│   ├── build.gradle                # R8 8.2.47 pin
│   └── app/
│       ├── build.gradle            # AAR dependencies + AAR-metadata check disabled
│       ├── proguard-rules.pro      # keep eu.id3.** (JNI)
│       ├── libs/eu.id3.face.aar    # copied from 10.0.0/bin/android/
│       ├── libs/eu.id3.bioseal.aar # copied from 1.42.10/bin/android/
│       └── src/main/
│           ├── assets/id3-models/  # ← put *.id3nn model files here (developer must add)
│           └── java/com/fonda_id/
│               ├── Id3Module.java  # Android bridge
│               ├── Id3Package.java # registers the module
│               └── MainApplication.java  # adds Id3Package
└── ios/
    ├── Frameworks/id3Face.xcframework     # unzipped from 10.0.0/bin/apple/
    ├── Frameworks/id3Bioseal.xcframework  # unzipped from 1.42.10/bin/apple/
    ├── id3-models/                 # ← put *.id3nn model files here (developer must add)
    ├── Fonda_ID.xcodeproj/project.pbxproj # frameworks linked + embedded, sources, models folder, Swift settings
    └── Fonda_ID/
        ├── Id3Sdk.swift            # iOS bridge
        ├── Id3Sdk.m                # exports the Swift class to React Native
        └── Fonda_ID-Bridging-Header.h
```

---

## 5. Installation

The steps below rebuild the integration from a fresh clone.

> **The id3 SDK files are not in Git.** The id3 licences forbid redistribution, and the BioSeal licence treats the SDK as confidential, while the GitHub repository is public. So `.gitignore` excludes `10.0.0/`, `1.42.10/`, `android/app/libs/*.aar`, `ios/Frameworks/`, the model files and license files. **On every fresh clone, get the two vendor ZIPs from the team's private storage, unpack them into `10.0.0/` and `1.42.10/`, then run steps 2–4.** Without them the Android build fails with a missing `libs/eu.id3.*.aar`, and the iOS build fails with a missing framework.

**1. JavaScript dependencies** (also applies `patches/` via the `postinstall` script):
```bash
npm install
```

**2. Android artifacts** (only when updating the SDKs):
```bash
cp 10.0.0/bin/android/eu.id3.face.aar   android/app/libs/
cp 1.42.10/bin/android/eu.id3.bioseal.aar android/app/libs/
```

**3. iOS artifacts** (only when updating the SDKs):
```bash
unzip -o 10.0.0/bin/apple/id3Face.xcframework.zip     -d ios/Frameworks
unzip -o 1.42.10/bin/apple/id3Bioseal.xcframework.zip -d ios/Frameworks
```

**4. Model files.** Download them from the link in `10.0.0/readme.md`, then copy the two files into both platform folders:
```bash
cp /path/to/face_detector_v4a.id3nn /path/to/face_encoder_v9a.id3nn android/app/src/main/assets/id3-models/
cp /path/to/face_detector_v4a.id3nn /path/to/face_encoder_v9a.id3nn ios/id3-models/
```

**5. iOS pods** (macOS with Xcode installed):
```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
bundle install            # installs CocoaPods into vendor/bundle
cd ios && bundle exec pod install && cd ..
```
Run `pod install` again after any change to `ios/Podfile` or to npm packages that contain native code. You don't need to rerun it for the id3 frameworks, because they are linked directly in the Xcode project rather than through pods.

**Linking:** npm packages use React Native autolinking. The id3 bridge is **linked manually**:
- Android registers `Id3Package` in `MainApplication.java`.
- iOS adds the files and frameworks to `project.pbxproj`.

Nothing extra is needed in `react-native.config.js`.

**6. Rebuild the app** after any native change. A Metro reload is not enough:
```bash
npx react-native run-android
npx react-native run-ios --device   # physical device only
```

---

## 6. Required File Changes

| File | Change | Reason |
|---|---|---|
| `android/app/build.gradle` | `implementation files("libs/eu.id3.face.aar")`, `implementation files("libs/eu.id3.bioseal.aar")` | Links the SDKs. |
| `android/app/build.gradle` | `tasks.matching { it.name ==~ /check.*AarMetadata/ }.configureEach { enabled = false }` | The BioSeal AAR declares `minCompileSdk=36`. That would force compileSdk 36, which AGP 7.3.1 (and therefore RN 0.71) doesn't support. The AAR uses no Android APIs, so the check is safe to skip. **Note:** this disables the metadata check for all AARs. |
| `android/build.gradle` | `classpath("com.android.tools:r8:8.2.47")` placed **before** the AGP classpath | The R8/D8 bundled with AGP 7.3.1 crashes with `NullPointerException` when dexing the id3 classes. |
| `android/app/proguard-rules.pro` | `-keep class eu.id3.** { *; }` | The SDK's Java classes are called from native code (JNI). Minification would break them if release minification is enabled. |
| `android/app/src/main/java/com/fonda_id/MainApplication.java` | `packages.add(new Id3Package());` | Registers the native module. |
| `android/app/src/main/java/com/fonda_id/Id3Module.java`, `Id3Package.java` | New | Android bridge (§9). |
| `android/app/src/main/assets/id3-models/` | New folder (`.gitkeep`) | The models are loaded from here with `FaceLibrary.loadModelBuffer`. |
| `ios/Fonda_ID/Id3Sdk.swift`, `Id3Sdk.m`, `Fonda_ID-Bridging-Header.h` | New | iOS bridge. The `.m` file exports the Swift class through `RCT_EXTERN_MODULE`. |
| `ios/Fonda_ID.xcodeproj/project.pbxproj` | Adds both xcframeworks (Link + **Embed & Sign**), `FRAMEWORK_SEARCH_PATHS += $(PROJECT_DIR)/Frameworks`, `SWIFT_VERSION = 5.0`, `SWIFT_OBJC_BRIDGING_HEADER`, the bridge sources and the `id3-models` folder reference (Copy Bundle Resources) | Links the SDKs, compiles the bridge and bundles the models. |
| `ios/id3-models/` | New folder (`.gitkeep`) | Bundled into the app as `id3-models/`. |
| `src/Utils/Id3Sdk.js`, `src/Utils/Id3Sdk.d.ts` | New | JS API and types. |
| `__tests__/Id3Sdk-test.js` | New | Jest tests for the JS wrapper. |
| `package.json` / `package-lock.json` | `patch-package` devDependency + `"postinstall": "patch-package"` | Applies `patches/react-native+0.71.11.patch`. |
| `patches/react-native+0.71.11.patch` | Changes the boost source URL in `boost.podspec` to `https://archives.boost.io/...` (same SHA-256) | The original URL no longer serves the expected file, so `pod install` fails with "Verification checksum was incorrect". |
| `tsconfig.json` | Excludes `vendor`, `1.42.10` and `10.0.0` | `tsc` was type-checking JavaScript inside the vendor docs (10 errors). |
| `Gemfile.lock` | New (from `bundle install`) | Pins the CocoaPods version used. |

`ios/Info.plist` already contains `NSCameraUsageDescription`, and `AndroidManifest.xml` already declares `INTERNET` and `CAMERA`. **No permission changes were needed.** Internet access is only needed for license activation.

---

## 7. SDK Configuration

| Setting | Mandatory? | Where | Notes |
|---|---|---|---|
| Face SDK serial key | **Mandatory** for face features | Passed at runtime to `activateId3Licenses({faceSerialKey})` | Do not hard-code it (§17). |
| BioSeal SDK serial key | **Mandatory** for BioSeal | `activateId3Licenses({biosealSerialKey})` | Separate license from Face. |
| Model files | **Mandatory** for `initId3Face` | `android/app/src/main/assets/id3-models/`, `ios/id3-models/` | `face_detector_v4a.id3nn`, `face_encoder_v9a.id3nn`. |
| Detector / encoder model | Fixed in code | `FACE_DETECTOR_4A`, `FACE_ENCODER_9A` (Java) / `.faceDetector4A`, `.faceEncoder9A` (Swift) | To change them, update both bridges **and** ship the matching model files. |
| Match threshold | Fixed in code | `FaceMatcherThreshold.FMR10000` (value **4000**, verified) | Gives a false-match rate of 1 in 10,000. |
| Processing unit | Fixed | CPU | — |
| License storage | Automatic | Android: `getFilesDir()/id3Face.lic`, `id3Bioseal.lic`. iOS: Application Support directory | Created on first activation and reused afterwards. |
| Hardware code type | Automatic | `LicenseHardwareCodeType.ANDROID` / `.ios` | Read it with `getId3HardwareCodes()` if id3 asks for it. |

The project has no environment-variable mechanism; there is no `react-native-config` or `.env`. Serial keys should come from your backend or another secure source at runtime, never from source code.

---

## 8. SDK Initialization

Initialize once, for example after login or at app start, in this order:

```js
import {activateId3Licenses, initId3Face} from '../Utils/Id3Sdk';

let id3Ready; // module-level promise, so every caller shares one initialization

export const ensureId3Ready = keys => {
  if (!id3Ready) {
    id3Ready = (async () => {
      await activateId3Licenses(keys); // 1. license: online the first time, then from the stored file
      await initId3Face();             // 2. load models + create detector/encoder/matcher
    })().catch(e => {
      id3Ready = undefined; // allow a retry
      throw e;
    });
  }
  return id3Ready;
};
```

Duplicate calls are safe:
- `initFace` returns immediately if it has already run.
- License activation is skipped when a stored license file exists.

The shared promise above also avoids running the work twice in parallel.

---

## 9. SDK Functions and Methods

JS API in `src/Utils/Id3Sdk.js`, with types in `Id3Sdk.d.ts`. Every function returns a Promise. When the native module isn't linked, every function rejects with `Id3Sdk native module is not linked on <os>`.

| JS function | Native method (Android `Id3Module.java` / iOS `Id3Sdk.swift`) | id3 SDK calls used | Parameters | Resolves | Status |
|---|---|---|---|---|---|
| `getId3Versions()` | `getVersions` | `FaceLibrary.getVersion`, `BiosealLibrary.getVersion` | — | `{face, bioseal}` | Android built ✓, iOS typechecked ✓ |
| `getId3HardwareCodes()` | `getHardwareCodes` | `FaceLicense.getHostHardwareCode`, `BiosealLicense.getHostHardwareCode` | — | `{face, bioseal}` | same |
| `activateId3Licenses({faceSerialKey?, biosealSerialKey?})` | `activateFaceLicense(serialKey)`, `activateBiosealLicense(serialKey)` | `*License.activateSerialKeyBuffer`, `*License.checkLicense`, `getExpiryDate`, `getRemainingDays` | serial keys (each optional) | `{face, bioseal}`, each `{expiryDate, remainingDays}` or `null` | same |
| `initId3Face()` | `initFace` | `FaceLibrary.getModelFileName`, `FaceLibrary.loadModelBuffer`, `new FaceDetector/FaceEncoder/FaceMatcher`, `setModel` | — | `true` | same |
| `compareFaces(path1, path2)` | `compareFaces` | `Image.fromFile(BGR_24_BITS)`, `FaceDetector.detectFaces`, `DetectedFaceList.getLargestFace`, `FaceEncoder.createTemplate`, `FaceMatcher.compareTemplates` | two image paths (`file://` prefix allowed) | `{score, threshold, isMatch}` | same |
| `verifyBioseal(qrContent)` | `verifyBioseal` | `new Bioseal()`, `Bioseal.verifyFromString`, `Bioseal.buildVdsAsJson` | QR text | `{json, signatureVerified, certificateChainVerified, notExpired, verificationResult}` | same |
| *(cleanup)* | Android `invalidate()` | `close()` on detector/encoder/matcher, shuts down the executor | — | — | Android built ✓. iOS releases objects through ARC (the SDK classes free native memory in `deinit`). |

The SDKs have no event listeners or callbacks. Every operation is a single request and response.

**Error codes** (Promise rejection `code`):

| Code | Meaning |
|---|---|
| `ID3_FACE_<n>` | `FaceException.getErrorCode()`. For example, `-103` means "License Error: No license was found" (verified). |
| `ID3_BIOSEAL_<n>` | `BiosealException.getErrorCode()` |
| `ID3_FACE_LICENSE_<n>` / `ID3_BIOSEAL_LICENSE_<n>` | Android only, raised during license activation or check |
| `ID3_NOT_INITIALIZED` | `compareFaces` was called before `initId3Face` |
| `ID3_NO_FACE` | No face was detected in one of the images |
| `ID3_ERROR` | Any other error, such as a missing model file or an I/O error |

---

## 10. Complete Integration Example

This sample component uses the project's existing `react-native-image-picker`. It isn't wired into any screen; add it where your flow needs it.

```jsx
import React, {useEffect, useState} from 'react';
import {Button, Text, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {activateId3Licenses, initId3Face, compareFaces} from '../Utils/Id3Sdk';

// getId3Keys(): fetch serial keys from your backend. Never hard-code them.
export default function FaceMatchExample({getId3Keys}) {
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('Initializing…');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await activateId3Licenses(await getId3Keys());
        await initId3Face();
        if (!cancelled) { setReady(true); setMessage('Ready'); }
      } catch (e) {
        if (!cancelled) setMessage(`Init failed: ${e.code ?? ''} ${e.message}`);
      }
    })();
    return () => { cancelled = true; }; // native resources are released by the module itself
  }, [getId3Keys]);

  const run = async () => {
    const selfie = await launchCamera({mediaType: 'photo', cameraType: 'front'});
    const idPhoto = await launchImageLibrary({mediaType: 'photo'});
    const a = selfie.assets?.[0]?.uri;
    const b = idPhoto.assets?.[0]?.uri;
    if (!a || !b) return;
    try {
      const {score, threshold, isMatch} = await compareFaces(a, b);
      setMessage(`${isMatch ? 'Match' : 'No match'} (score ${score}, threshold ${threshold})`);
    } catch (e) {
      setMessage(e.code === 'ID3_NO_FACE' ? e.message : `Error: ${e.code} ${e.message}`);
    }
  };

  return (
    <View>
      <Text>{message}</Text>
      <Button title="Compare faces" onPress={run} disabled={!ready} />
    </View>
  );
}
```

BioSeal verification, given QR text from any QR scanner:

```js
import {verifyBioseal} from '../Utils/Id3Sdk';

const {signatureVerified, certificateChainVerified, notExpired, json} = await verifyBioseal(qrText);
const valid = signatureVerified && certificateChainVerified && notExpired;
const document = JSON.parse(json);
```

---

## 11. Android Setup

The configuration is already applied (§6). Summary:
- **Dependencies:** local AARs in `android/app/libs/`, which contain `libid3Face.so` and `libid3Bioseal.so` for `arm64-v8a` and `armeabi-v7a`.
- **Permissions:** `INTERNET` (license activation) and `CAMERA` are already in `AndroidManifest.xml`.
- **Build:**
  ```bash
  cd android && ./gradlew :app:assembleDebug       # debug APK
  cd android && ./gradlew :app:assembleRelease     # release (needs signing config)
  ```
  If `./gradlew` gives "permission denied", run `chmod +x android/gradlew` or use `sh ./gradlew`.
- **APK size:** the debug APK is about 92 MB, because each SDK adds roughly 30 MB of native libraries. For Play Store releases, use App Bundles (`bundleRelease`), which split by ABI automatically.

---

## 12. iOS Setup

The configuration is already applied (§6). Summary:
- **Frameworks:** `ios/Frameworks/id3Face.xcframework` and `id3Bioseal.xcframework` are set to **Embed & Sign**.
- **Swift:** the app target has `SWIFT_VERSION = 5.0` and a bridging header that imports `<React/RCTBridgeModule.h>`.
- **Permissions:** `NSCameraUsageDescription` is already present.
- **Pods:**
  ```bash
  cd ios && bundle exec pod install
  ```
  Then open **`ios/Fonda_ID.xcworkspace`**, not the `.xcodeproj`.
- **Signing:** select your Team under *Signing & Capabilities*. The embedded frameworks are re-signed automatically.
- **Device:** select a connected iPhone. Simulator builds will fail to link, because there is no simulator slice.

---

## 13. Running the Application

```bash
npm start                                  # Metro bundler (terminal 1)
npx react-native run-android               # terminal 2: ARM device / ARM emulator
npx react-native run-ios --device          # terminal 2: physical iPhone (or run from Xcode)
```

Platform differences:
- **Android:** x86 emulators can't load the SDK; use an ARM device or ARM image.
- **iOS:** the app needs a physical device and Xcode 26.3+ (Derived).

---

## 14. Testing

### 14.1 Static checks (run during the audit)

```bash
npx eslint src/Utils/Id3Sdk.js src/Utils/Id3Sdk.d.ts __tests__/Id3Sdk-test.js
npx tsc --noEmit
npx jest                      # all suites (15 tests)
npm ls --depth=0
```

### 14.2 iOS bridge typecheck without Xcode (optional)

Command Line Tools can typecheck `Id3Sdk.swift` against the macOS slice of the frameworks. The audit confirmed that the macOS and iOS Swift interfaces are identical for both SDKs. You need a stub file with `typealias RCTPromiseResolveBlock = (Any?) -> Void` and `typealias RCTPromiseRejectBlock = (String?, String?, Error?) -> Void`:

```bash
swiftc -typecheck -swift-version 5 -target x86_64-apple-macos12.0 \
  -F ios/Frameworks/id3Face.xcframework/macos-arm64_x86_64 \
  -F ios/Frameworks/id3Bioseal.xcframework/macos-arm64_x86_64 \
  RCTStubs.swift ios/Fonda_ID/Id3Sdk.swift
```

### 14.3 Build checks

```bash
cd android && ./gradlew :app:assembleDebug
unzip -l android/app/build/outputs/apk/debug/app-debug.apk | grep libid3   # expect 4 .so files
cd ios && bundle exec pod install && xcodebuild -workspace Fonda_ID.xcworkspace -scheme Fonda_ID -sdk iphoneos -configuration Debug build
```

### 14.4 On-device functional checks (manual; need a device, model files and licenses)

1. `getId3Versions()` should return `{face: '10.0.0', bioseal: '1.42.10'}`.
2. `activateId3Licenses(...)` should return expiry dates. Restart the app and call it again: it must succeed **offline**, using the stored license.
3. `initId3Face()` should return `true`. Call it twice; the second call should return immediately.
4. `compareFaces` with two photos of the same person should give `isMatch: true`. Two different people should give `false`. A photo with no face should reject with `ID3_NO_FACE`.
5. `compareFaces` before `initId3Face` should reject with `ID3_NOT_INITIALIZED`.
6. `verifyBioseal` with a real BioSeal QR should return `signatureVerified: true`. Random text should reject with `ID3_BIOSEAL_<n>`.
7. Remove the model files: `initId3Face` should reject with `ID3_ERROR` "Model file … not found".
8. Background and foreground the app, then call `compareFaces` again; it should still work. Reload JS (Android): `invalidate()` releases the native objects, and `initId3Face` works again afterwards.

---

## 15. Troubleshooting

Each fix below was **observed during the audit** unless it is marked otherwise.

| Symptom | Cause | Fix |
|---|---|---|
| `Dependency 'eu.id3.bioseal.aar' requires … compile against version 36` (`checkDebugAarMetadata`) | BioSeal AAR metadata | Already handled in `android/app/build.gradle` (§6). |
| `desugarDebugFileDependencies` → `Error while dexing` / `NullPointerException` | Old R8 in AGP 7.3.1 | Keep `classpath("com.android.tools:r8:8.2.47")` **above** the AGP classpath. |
| `pod install`: `Invalid FBReactNativeSpec.podspec … wrong number of arguments (given 3, expected 1)` | Homebrew CocoaPods runs on Ruby 4, which is incompatible with RN 0.71 scripts | Use `bundle exec pod install` (system Ruby 2.6 + CocoaPods 1.17.0). |
| `pod install`: `Error installing boost — Verification checksum was incorrect` | The boost URL in RN 0.71 is outdated | Already patched through `patches/`. Make sure `npm install` ran so `postinstall` applied it. |
| `pod install`: glog `C compiler cannot create executables` / `xcode-select` points to CommandLineTools | Xcode not installed or not selected | Install Xcode, then run `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`. |
| `Id3Sdk native module is not linked` | App not rebuilt after native changes, or running in Expo Go | Rebuild with `run-android` / `run-ios`. |
| `./gradlew: permission denied` | Missing execute bit | `chmod +x android/gradlew`. |
| `java.lang.UnsatisfiedLinkError … libid3Face.so` on an emulator | x86 emulator | Use an ARM device or ARM emulator image. *(From the AAR contents; not reproduced.)* |
| iOS link error for `id3Face` / `id3Bioseal` on the simulator | No simulator slice | Build for a physical device. *(From the xcframework contents; not reproduced.)* |
| `ID3_FACE_-103` / "No license was found" | License not activated or not checked | Call `activateId3Licenses` before `initId3Face`. *(Error text verified.)* |
| `Model file 'face_detector_v4a.id3nn' not found` | Models not copied | See §5 step 4. Folder names must be exactly `id3-models`. |
| `tsc` errors in `10.0.0/docs/...` | Vendor folders type-checked | Already excluded in `tsconfig.json`. |
| `npx jest` fails with `Jest encountered an unexpected token` or `NativeModule … is null` | React Native packages ship untransformed ESM, and native modules don't exist in Jest | Fixed by `transformIgnorePatterns` in `package.json` and the native mocks in `jest.setup.js`. Add a mock there for any new native package. |
| **BioSeal macOS library**: `library load disallowed by system policy` | macOS blocked the quarantined desktop `libid3Bioseal.1.42.10.jnilib`. The file then disappeared from `1.42.10/bin/apple/fat-arm64-x86_64/` | Desktop file only; the app doesn't use it. Re-extract it from the original vendor ZIP if you need it. The Android AAR and iOS xcframework are unaffected: their checksums match the vendor files. |
| License fails after reinstalling or changing devices | The hardware code is per app and per device | The stored file is deleted with the app, and activation runs again. If id3 reports the activation limit, contact id3 support. *(Behaviour from id3 docs, `activate_license_programmatically`.)* |

---

## 16. Upgrade and Migration

1. Read the new `changelog.md`. Face 10.0.0 was a breaking release, and BioSeal 1.5x is deprecated by the vendor.
2. Replace the artifacts (§5 steps 2–3).
3. Check the API that the bridges use:
   ```bash
   javap -cp <new>/java/eu.id3.face.jar eu.id3.face.FaceLicense eu.id3.face.FaceDetector eu.id3.face.FaceEncoder eu.id3.face.FaceMatcher
   javap -cp <new>/java/eu.id3.bioseal.jar eu.id3.bioseal.Bioseal eu.id3.bioseal.BiosealLicense
   ```
   Also check the iOS `.swiftinterface` files inside the xcframeworks.
4. Check the AAR `aar-metadata.properties` (`minCompileSdk`), the AAR `AndroidManifest.xml` (`minSdkVersion`) and the framework `Info.plist` (`MinimumOSVersion`, `DTXcode`).
5. If you change models, update the model constants in **both** bridges and ship the new `.id3nn` files.
6. Rerun all of §14.

---

## 17. Security

- **Never commit serial keys** or `.lic` files. Fetch serial keys from your backend at runtime, and keep them out of logs and analytics.
- License files are stored in app-private storage (Android `filesDir`, iOS Application Support).
- The bridge doesn't log images, templates or seal content. Keep it that way, because faces and identity documents are personal data.
- Face images passed to `compareFaces` are read from disk. Delete temporary captures after use.
- BioSeal verification may download trust lists (LoTL/TSL) and CRLs from the network (SDK properties `getLotlUrl`, `getVerifiesCrlUpdates`). Treat `verifyBioseal` results as trustworthy only when `signatureVerified`, `certificateChainVerified` and `notExpired` are all true.

---

## 18. Final Verification Checklist

- [ ] `npm install` completes, and `patches/` is applied.
- [ ] Model files are present in `android/app/src/main/assets/id3-models/` **and** `ios/id3-models/`.
- [ ] Serial keys come from a secure source, not source code.
- [ ] `cd android && ./gradlew :app:assembleDebug` succeeds, and the APK contains 4 `libid3*.so` files.
- [ ] Xcode 26.3+ is installed, `bundle exec pod install` succeeds, and the device build succeeds.
- [ ] `npx tsc --noEmit` reports 0 errors, and `npx jest __tests__/Id3Sdk-test.js` passes.
- [ ] All §14.4 on-device checks pass on Android **and** iOS.
- [ ] A release build (with ProGuard enabled, if used) still runs `compareFaces` and `verifyBioseal`.
- [ ] `git status` shows no id3 files (vendor folders, `.aar`, `.xcframework`, `.id3nn`, `.lic`). They must stay out of Git (see §5 and §21.10).

---

## 19. References

- id3 Face SDK 10.0.0 package: `10.0.0/readme.md`, `10.0.0/changelog.md`, `10.0.0/docs/developer-guide/` (quick start, installation, `licensing/activate_license_programmatically`), `10.0.0/docs/javadoc/`.
- id3 BioSeal SDK 1.42.10 package: `1.42.10/readme.md`, `1.42.10/changelog.md`, `1.42.10/docs/javadoc/`.
- id3 Face SDK samples: https://github.com/id3Technologies/face-sdk-samples (linked from `10.0.0/readme.md`).
- id3 support: https://id3.eu/contact-us/ and support@id3.eu.
- React Native 0.71 native modules: https://reactnative.dev/docs/0.71/native-modules-android, https://reactnative.dev/docs/0.71/native-modules-ios.
- Android 16 KB page sizes: https://developer.android.com/guide/practices/page-sizes.

The id3 SDKs aren't published on a public registry, so no registry check was possible. Versions were verified from the vendor package files and the SDK's own `getVersion()`.

---

## 20. Audit Results

**Files inspected:**
- `package.json`, `package-lock.json`, `.npmrc`, `.node-version`, `app.json`, `react-native.config.js`, `babel.config.js`, `metro.config.js`, `tsconfig.json`, `index.js`, `src/**`.
- `android/build.gradle`, `android/settings.gradle`, `android/gradle.properties`, `android/gradle/wrapper/gradle-wrapper.properties`, `android/app/build.gradle`, `AndroidManifest.xml`, `MainApplication.java`.
- `ios/Podfile`, `ios/Fonda_ID.xcodeproj/project.pbxproj`, `ios/Fonda_ID/Info.plist`.
- Both vendor packages: readmes, changelogs, the developer guide, javadoc, jars (`javap`), AAR manifests and metadata, framework `Info.plist`s and `.swiftinterface`s.

**Project:** React Native CLI 0.71.11, JavaScript (TS tooling present), npm, Android + iOS, old architecture (`newArchEnabled=false`), Hermes enabled.

**Files changed:** see §6.

**Versions verified:** Face SDK 10.0.0 and BioSeal SDK 1.42.10 (§3.1).

**Issues resolved:**
- **Critical:** BioSeal AAR metadata blocked the build. R8 crashed dexing the SDKs. CocoaPods failed under Ruby 4. The boost checksum failed. There was no React Native bridge.
- **Medium:** a `DetectedFace` wasn't closed. Native resources weren't released on reload. The JS layer gave an unclear error when the module was missing.
- **Low:** an unused `multiDexEnabled` (left from an earlier attempt) was removed, and vendor folders were excluded from `tsc`.

**Commands executed and results:**

| Test | Platform | Result | Evidence | Notes |
|---|---|---|---|---|
| Dependency installation (`npm install`, `npm ls --depth=0`) | JS | PASS | No missing or invalid packages | — |
| ESLint (SDK files) | JS | PASS | `eslint` exit 0 | — |
| TypeScript check (`npx tsc --noEmit`) | JS | PASS | 0 errors (10 before, all in vendor docs) | — |
| Jest – `__tests__/Id3Sdk-test.js` | JS | PASS | 4/4 tests | Native module mocked |
| Jest – `__tests__/App-test.tsx` | JS | PASS (after the later code-quality pass) | Initially failed (`unexpected token` in `@react-navigation`); fixed with Jest config and mocks | — |
| Android build (`:app:assembleDebug`) | Android | PASS | APK built; contains `libid3Face.so` + `libid3Bioseal.so` for arm64-v8a and armeabi-v7a | — |
| 16 KB alignment | Android | PASS (arm64) | ELF `PT_LOAD` align 16384 | — |
| Face SDK API smoke test (desktop JVM, macOS lib) | macOS | PASS | `getVersion()` → 10.0.0; model file names; FMR10000 = 4000; missing license → `-103` | Not on device |
| BioSeal API smoke test (desktop JVM) | macOS | BLOCKED | macOS refused to load the quarantined desktop library | Not relevant to the app |
| iOS Swift bridge typecheck | iOS (macOS slice) | PASS | `swiftc -typecheck` exit 0 | iOS and macOS interfaces are identical |
| `pod install` | iOS | BLOCKED | Pods resolved; glog `configure` fails without Xcode | Needs Xcode |
| iOS build | iOS | BLOCKED | Xcode not installed | — |
| SDK initialization (license + models) | Android / iOS | NOT RUN | No device, no licenses, no model files | — |
| SDK operation (`compareFaces`, `verifyBioseal`) | Android / iOS | NOT RUN | Same as above | — |
| Event handling | — | N/A | The SDK APIs used are request/response; there are no events | — |
| Error handling (JS layer) | JS | PASS | Jest: rejection propagated; clear error when the module is missing | Native error paths not run on a device |
| Cleanup | Android | NOT RUN | `invalidate()` compiles; not exercised at runtime | — |

**Remaining risks:**
- iOS hasn't been compiled in Xcode yet.
- There is no runtime test on a device yet.
- Disabling the AAR metadata check applies to all AARs.
- The minimum Xcode version is derived, not stated by id3.
- The SDK isn't wired into any screen yet; the integration point is a product decision.
- `1.42.10/` and `10.0.0/` should stay out of git.

---

## 21. Code Quality and Maintenance

### 21.1 Existing application architecture

| Layer | Location | Notes |
|---|---|---|
| Entry | `index.js` → `App.js` → `src/navigation/Navigator.js` | React Navigation 6. A root stack (`SplashScreen`, `Onboard`, `Auth`, `Home`) and a bottom-tab `Home` (`Dashboard` stack, `Profile`, `Notification`, `Setting`). |
| Screens | `src/pages/*.js` (24 files) | Each screen owns its state with `useState`. There is no Redux and no Context. Every screen is exported wrapped in `withInternetConnectivity`. |
| Shared UI | `src/component/CommonModal.js` | The result/error modal used by most screens. |
| Shared logic | `src/Utils/` | `apiUtils.js` (axios GET/POST/PUT), `apiConfig.js` (endpoints), `AsyncStorageUtil.js` (JSON storage), `withInternetConnectivity.js` (offline HOC), `Id3Sdk.js` (+ `.d.ts`, the SDK bridge) |
| Theme | `src/assets/Colors.js` | `COLORS` and `FONTS`. Fonts are linked with `react-native-asset` (`react-native.config.js`). |
| Native | `android/`, `ios/` | id3 bridges (§6) plus autolinked packages. |

Language: JavaScript, with TypeScript used for type-checking only (`tsconfig.json`, `Id3Sdk.d.ts`). Package manager: **npm**.

### 21.2 Reusable component and hook conventions

- Put a new shared component in `src/component/` and a new shared helper in `src/Utils/`. Extract only when at least two screens need the **same** behaviour and appearance.
- Use `StyleSheet.create` for static styles. Keep inline styles only for values computed at runtime, for example `[styles.header, {color}]` in `CommonModal`.
- Wrap a new screen in `withInternetConnectivity` like the existing ones. The HOC sets a `displayName` (`withInternetConnectivity(Screen)`) for debugging.
- Define components at module level, never inside another component's render. Otherwise React treats them as a new component type on every render; `BioDetailsScreen`'s `LoadingIndicatorView` was moved out for this reason.
- Custom hooks: there are none yet. A good first candidate is the repeated error-modal state (`modalVisible`, `modalImage`, `modalColor`, `modalHeader`, `errorMessage`) in 9 screens. Treat it as a separate, tested refactor, because every screen's error flow would need re-checking (§22.6).

### 21.3 Code cleanup rules

- Before removing code, trace navigation route names, string references, native references, tests and build scripts, not only imports.
- Use AST tools such as `jscodeshift` (already in `node_modules`) for bulk removals, and review the diff afterwards. The cleanup pass removed only identifiers that were never referenced, and kept anything whose initialiser has side effects (e.g. `await getData(...)`).
- Don't delete screens registered in `Navigator.js`. Unreachable screens are listed in §22.6 for a product decision.
- Keep `React` imported in files that use JSX; the project uses the classic JSX runtime.

### 21.4 Dependency management

- Use npm only, and commit `package.json` and `package-lock.json` together.
- Before removing a package, check: (1) app imports, (2) `peerDependencies` of other packages (e.g. `react-native-screens`, `react-native-safe-area-context` and `react-native-gesture-handler` are peers of React Navigation, so keep them), (3) native and build references.
- Removed in the cleanup pass (verified unused): `react-native-reanimated`, `react-native-svg`, `rn-fetch-blob`, `@react-native-community/masked-view`. `react-native-asset` moved to devDependencies, still at 2.1.1.
- `patch-package` runs on `postinstall` and applies `patches/react-native+0.71.11.patch` (iOS boost URL). Don't remove it while on RN 0.71.
- Don't upgrade React Native, AGP or Gradle as part of unrelated work. The SDK workarounds in §6 depend on the current versions.

### 21.5 Memoization guidelines

- Don't add `React.memo`, `useMemo` or `useCallback` by default. Add them only for a measured problem, or for a clear cost such as a large list row or an expensive computation.
- None were added in the cleanup pass. Lists are small (a user's documents and notifications) and already use `FlatList` with stable `_id` keys.
- When adding `useCallback` or `useMemo`, list every dependency. Don't silence `react-hooks/exhaustive-deps`.

### 21.6 Performance considerations

- Avoid duplicate requests. `Dashboard` and `NotificationScreen` used to fetch the same data twice per focus; each now fetches once (inside the `isFocused` branch).
- Clear timers and listeners in effect cleanups. `SplashScreen` clears its timer; `withInternetConnectivity` unsubscribes NetInfo; the `LoginScreen` back handler is removed on unmount.
- id3 SDK work runs on a background thread or queue in the native bridge. Never call the SDK from a render path, and initialize it once (§8).
- The APK is about 92 MB, mainly from the id3 native libraries. Use App Bundles for store builds (§11).

### 21.7 Responsive implementation practices

- Use Flexbox and the existing `ScrollView` containers. Don't add a responsive-design library.
- `LoginOtpScreen` and `OTPVerificationScreen` size the OTP cells from `Math.min(width, height)` computed at module load. That gives the same value in portrait and landscape; it only goes stale in split-screen or multi-window.
- iOS `Info.plist` allows landscape, but the screens are laid out for portrait. Locking orientation is a product decision (§22.6).
- Responsive behaviour hasn't been tested on devices (§22.5).

### 21.8 TypeScript conventions

- Application code is JavaScript. Don't convert files as part of unrelated work.
- Add `.d.ts` declarations next to shared modules whose API other code depends on (see `src/Utils/Id3Sdk.d.ts`).
- `npx tsc --noEmit` must stay at 0 errors. `tsconfig.json` excludes `vendor`, `1.42.10` and `10.0.0`.

### 21.9 Testing and regression prevention

Run before every commit:
```bash
npx tsc --noEmit
npx eslint App.js src __tests__ jest.setup.js
npx jest
cd android && ./gradlew :app:assembleDebug
```
- When you add a native package, mock it in `jest.setup.js`; otherwise `App-test.tsx` fails with `NativeModule … is null`.
- Add a Jest test when you change a shared utility or component (see `__tests__/sharedUtils-test.js`).
- There is no visual-regression tooling. UI changes need a manual check on Android and iOS devices.

### 21.10 SDK folder protection

- `10.0.0/` and `1.42.10/` are the unmodified vendor packages. Don't edit, move or rename them, and don't add project files to them.
- They are **git-ignored** together with the copied binaries (`android/app/libs/*.aar`, `ios/Frameworks/`), model files (`*.id3nn`) and license files (`*.lic`). The id3 licences prohibit redistribution, and the repository is public.
- Keep the original vendor ZIPs in private team storage. Note that `1.42.10/bin/apple/fat-arm64-x86_64/libid3Bioseal.1.42.10.jnilib` (the macOS desktop library) is missing locally (§15). The app doesn't need it.

### 21.11 Safe SDK upgrade procedure

1. Unpack the new vendor package into a **new** folder named after its version. Keep the old folder until the upgrade is verified.
2. Follow §16: check the changelog, the API via `javap` and `.swiftinterface`, the AAR metadata and the framework `Info.plist`.
3. Copy the new artifacts (§5 steps 2–3), update the `.gitignore` folder entries, update the versions in this guide, and run §21.9.
4. Run §14.4 on an Android device and an iPhone before releasing.

---

## 22. Project Status and Verification

Last re-checked: 2026-10-14, on macOS with Command Line Tools only (no Xcode) and no Android device attached.

### 22.1 Completed implementation work

- The id3 Face SDK 10.0.0 and BioSeal SDK 1.42.10 are integrated through native bridges: `Id3Module.java` / `Id3Package.java` for Android, `Id3Sdk.swift` / `Id3Sdk.m` for iOS. The JS wrapper is `src/Utils/Id3Sdk.js`, with types in `Id3Sdk.d.ts`.
- Android build workarounds: R8 8.2.47 pinned, the AAR metadata check disabled, and a ProGuard keep rule.
- iOS project wiring: frameworks embedded and signed, a bridging header, and the models folder. The CocoaPods/boost fixes are done via Bundler and `patch-package`.
- Code-quality pass on application code:
  - 6 crash bugs fixed (undefined variables).
  - 2 error-message render crashes fixed.
  - Duplicate API requests removed in 2 screens.
  - The splash timer is now cleaned up.
  - 28 duplicate style keys and 140 unused imports removed, plus dead functions and state.
  - 4 unused native packages removed.
  - Shared utilities tidied, back buttons labelled for accessibility, and Jest made runnable.

### 22.2 Successful static checks (re-run 2026-10-14)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| ESLint: undefined variables and duplicate keys | 0 (baseline: 11 and 28) |
| ESLint total | 546 problems: 167 Prettier formatting, 193 inline styles, 121 unused variables, 4 `exhaustive-deps`, others minor (baseline: 813) |
| `npm ls --depth=0` | No missing or invalid packages |
| `npx jest` | 4 suites, 15/15 tests pass |
| Swift bridge typecheck against the id3 Swift interfaces | Pass (macOS slice; iOS and macOS interfaces are identical) |
| id3 Face SDK API smoke test (desktop JVM) | Pass: version 10.0.0, model names, threshold 4000, licence error −103 |
| SDK artifact integrity | The app's `.aar` files match the vendor files (SHA-256); framework versions are 10.0.0 / 1.42.10 |

### 22.3 Successful build checks

| Build | Result |
|---|---|
| Android `./gradlew :app:assembleDebug` | **PASS** (re-run 2026-10-14, exit 0). The APK contains `libid3Face.so` and `libid3Bioseal.so` for arm64-v8a and armeabi-v7a. |
| Android release build | NOT RUN (no signing configuration available) |

### 22.4 Tests that failed

- None in the current state. `__tests__/App-test.tsx` failed at the start of the work and now passes after the Jest configuration fix.
- The BioSeal desktop smoke test was **blocked**: macOS refused to load the desktop library. This doesn't affect the app.

### 22.5 Tests that could not run

| Check | Reason |
|---|---|
| `bundle exec pod install` (to completion) | Xcode not installed. Pods resolve, then glog's `configure` fails. |
| iOS build (`xcodebuild`) | Xcode not installed |
| Android runtime tests (§14.4) | No device or emulator; no id3 model files or licence keys |
| UI regression and responsive checks | No device and no visual-regression tooling |

### 22.6 Runtime checks that still require a physical device

On Android (ARM device) **and** iPhone (no simulator support):
- id3 licence activation online, then offline restart.
- Model loading (`initId3Face`).
- `compareFaces` match, non-match and no-face cases.
- `verifyBioseal` with a real seal and with invalid input.
- Background/foreground behaviour and JS reload (Android `invalidate()`).
- Smoke test of every screen that was cleaned up: Register (especially the **iOS date picker**), Upload Document, Notifications (error modal), OTP Verification (network error), Dashboard (document list refresh on focus), Splash routing.

### 22.7 Outstanding iOS verification

1. Install Xcode 26.3 or newer (Derived, §3.2) and select it with `xcode-select`.
2. `bundle install && cd ios && bundle exec pod install`
3. Build on a physical iPhone with a signing team; fix any linker or Swift-version issues.
4. Run §22.6.

### 22.8 Remaining risks and follow-up actions

| Item | Risk | Suggested action |
|---|---|---|
| iOS not compiled | Build errors may surface only in Xcode | §22.7 |
| No runtime test with real licences or models | Licence or model problems could appear late | Get id3 serial keys and model files; run §22.6 |
| AAR metadata check disabled globally | A future AAR with a real compile-SDK need would not be flagged | Re-evaluate when upgrading AGP or RN |
| `SubmitSuccess` navigates to the disabled `AddNewDocumentScreen` route | The button does nothing | Product decision: re-enable the route or point to `AddNewDocumentNewScreen` |
| `BioDetailsScreen` and `DataStoragePolicyScreen` are unreachable | Dead code | Product decision: link them or delete them |
| `Dashboard` first user fetch reads the token from state before it's set | First `GETUSER` call may go out without a token | Fix together with API owners (changes the request) |
| `LoginScreen` back handler stays active under other auth screens | Back may exit the app from OTP/Register | Product decision on back behaviour |
| `LogBox.ignoreAllLogs()` in `Navigator.js` | Hides warnings during development | Remove once the warnings are triaged |
| Remaining lint (formatting, inline styles, unused state) | Maintainability only | Run a dedicated formatting PR with `npx eslint --fix`, reviewed separately |
| 4 `exhaustive-deps` errors | Stale values in effects | Fix screen by screen, with device testing |
| Error-modal state repeated in 9 screens | Duplication | Extract a tested `useErrorModal` hook in a separate PR |
| SDK files not in Git | A fresh clone can't build without the private vendor ZIPs | Keep the ZIPs in private team storage; document the location internally |
