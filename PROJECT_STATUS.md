# Fonda_ID – Project Status Update

**Date:** 14 October 2026
**Branch:** `development`
**Detailed technical guide:** [`GUIDE.md`](GUIDE.md)

---

## 1. Project overview

Fonda_ID is a React Native mobile app for Android and iOS that lets users register, upload identity documents, and manage and share them. This phase covered two things:

1. **Adding two identity-verification SDKs** from id3 Technologies:
   - **Face SDK**: compares a user's face with the photo on their ID document.
   - **BioSeal SDK**: checks that a document's secure QR code (a "digital seal") is genuine and hasn't been tampered with.
2. **Improving code quality** without changing how the app looks or behaves.

## 2. SDK versions and integration status

| SDK | Version | Status |
|---|---|---|
| id3 Face SDK | 10.0.0 | Integrated on Android and iOS. **Android builds successfully. iOS not yet built** (see section 7). |
| id3 BioSeal SDK | 1.42.10 | Same as above |

- Both versions were confirmed from the vendor's own files. 1.42.10 is the vendor's current recommended BioSeal release.
- The two SDKs are independent products. They build together in one app with no conflicts.
- The SDKs are **ready for use by the app, but no screen uses them yet**. Deciding where they appear in the user journey (for example, a face check during registration) is a product decision.

## 3. Implementation work completed

- A connection layer ("bridge") between the app and each SDK, on both Android and iOS, with one shared set of app functions:
  - Activate licences.
  - Load the face models.
  - Compare two faces.
  - Verify a digital seal.
- Fixes for three build-tool incompatibilities between the SDKs and the app's current React Native version (0.71). These avoided an upgrade of the whole framework.
- A complete developer guide (`GUIDE.md`) covering setup, configuration, usage, troubleshooting, upgrades and security.

## 4. Build and test results

| Check | Result |
|---|---|
| Android app build | ✅ Passes |
| Automated tests (15 tests) | ✅ All pass |
| Code type check | ✅ Passes (0 errors) |
| iOS app build | ⏸ Not run: requires Xcode, which isn't installed on the development machine |
| Testing on real phones | ⏸ Not run: no test device was available, and the SDK licence keys and model files haven't been supplied yet |

All results above come from actual runs on 14 October 2026. Nothing has been verified on a physical phone yet.

## 5. Code quality improvements completed

- **Fixed 6 hidden crash bugs.** Some screens referred to things that didn't exist, which would crash the app in specific situations:
  - The Register screen on iOS.
  - Choosing a document type on the Upload Document screen.
  - Pressing "Next" on the keyboard in two document forms.
  - Two error pop-ups that would crash instead of showing a message.
- **Removed duplicate server requests.** The Dashboard and Notifications screens loaded the same data twice each time they opened. They now load it once.
- **Removed unused code and libraries.** About 660 lines of unused code and 4 unused third-party libraries are gone, which makes the app slightly smaller (about 0.5 MB) and simpler to maintain.
- **Improved accessibility.** Back buttons are now announced correctly by screen readers, with no visual change.
- **Restored automated testing.** The app's existing test was broken and now runs. New tests cover the shared building blocks.

None of these changes were meant to alter the app's design, screens, navigation, server communication or login behaviour.

## 6. Existing issues and limitations

These were found during the review and **haven't been changed**, because they need a product or team decision:

- A "add document" button after a successful submission does nothing, because it points to a screen that was switched off.
- Two screens exist in the code but can't be reached from the app.
- On first load, the Dashboard may request user details before the login token is available, so that request may fail silently.
- On Android, pressing Back on some login and registration screens may close the app.
- Some code-style clean-up remains (mainly formatting). It's cosmetic and is best done in a separate, focused change.

## 7. Outstanding Android and iOS verification

- **iOS:** the project is configured, but it hasn't been built yet because Xcode isn't installed on the development machine. The SDKs only run on real iPhones, not the iPhone simulator.
- **Android:** the app builds, but it hasn't been run on a phone with the SDKs active. Android emulators on standard PCs aren't supported by the SDKs; an ARM-based phone or emulator is required.
- **Both:** the screens touched by the code clean-up should be checked on real phones, especially the Register screen on iOS.

## 8. Risks and dependencies

| Item | Why it matters |
|---|---|
| **SDK licence keys and model files from id3** | The SDKs can't run without them. |
| **Mac with Xcode 26.3 or newer** | Needed to build and test the iOS app. |
| **Android test phone (ARM) and iPhone** | Needed to confirm the SDKs work end to end. |
| **SDK files are kept out of GitHub** | The id3 licences forbid sharing the SDK, and the repository is public. Developers need access to the SDK packages from private team storage to build the app. |
| **iOS may reveal further build issues** | Until iOS is built once, some extra setup work may still be needed. |

## 9. Recommended next steps

1. Get the id3 licence keys and model files.
2. Set up a Mac with Xcode, build the iOS app, and resolve any iOS-specific build issues.
3. Run the SDK checks on an Android phone and an iPhone (the checklist is in `GUIDE.md`).
4. Decide where face matching and seal verification appear in the app's user journey.
5. Make product decisions on the issues in section 6.
6. Store the vendor SDK packages in a private team location, and make sure developers know where to find them.
7. Schedule a separate, small clean-up for the remaining formatting issues.
