// Type declarations for src/Utils/Id3Sdk.js (id3 Face SDK 10.0.0 + id3 BioSeal SDK 1.42.10).

export interface Id3LicenseInfo {
  expiryDate: string;
  remainingDays: number;
}

export interface Id3FaceMatchResult {
  /** Match score from FaceMatcher.compareTemplates. */
  score: number;
  /** FMR 1/10,000 operating point (FaceMatcherThreshold.FMR10000). */
  threshold: number;
  isMatch: boolean;
}

/** Raw id3 BioSeal VerificationResult values (as returned by the SDK, typically 1 = verified). */
export interface Id3BiosealVerificationResult {
  certificationChainVerified: number;
  governanceValid: number;
  lotlGovernanceValid: number;
  tslGovernanceValid: number;
  manifestGovernanceValid: number;
  vdsNotExpired: number;
  vdsSignatureVerified: number;
  caCertificateVerified: number;
  signingCertificateUsageAuthorized: number;
}

export interface Id3BiosealResult {
  /** Decoded VDS content from Bioseal.buildVdsAsJson. */
  json: string;
  signatureVerified: boolean;
  certificateChainVerified: boolean;
  notExpired: boolean;
  verificationResult: Id3BiosealVerificationResult;
}

export function getId3Versions(): Promise<{face: string; bioseal: string}>;
export function getId3HardwareCodes(): Promise<{face: string; bioseal: string}>;
export function activateId3Licenses(keys: {
  faceSerialKey?: string;
  biosealSerialKey?: string;
}): Promise<{face: Id3LicenseInfo | null; bioseal: Id3LicenseInfo | null}>;
export function initId3Face(): Promise<boolean>;
export function compareFaces(
  imagePath1: string,
  imagePath2: string,
): Promise<Id3FaceMatchResult>;
export function verifyBioseal(qrContent: string): Promise<Id3BiosealResult>;
