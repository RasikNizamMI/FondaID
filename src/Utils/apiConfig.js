const API_BASE_URL = 'https://fonda.dturn.net/v2/';
const API_BASE_BIO_URL = 'http://vps-35c5bf77.vps.ovh.net:8000/';

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}user`,
  REGISTERVERIFYOTP: `${API_BASE_URL}v1/user/registration/generate/otp`,
  REGISTEREMAILVALIDATE: `${API_BASE_URL}v1/user/registration/validate/email/otp`,
  REGISTERMOBILEVALIDATE: `${API_BASE_URL}v1/user/registration/validate/phone/otp`,
  MOBILERESENDOTP: `${API_BASE_URL}v1/user/registration/resend/phone/otp`,
  EMAILRESENDOTP: `${API_BASE_URL}v1/user/registration/resend/email/otp`,
  CREATEUSER: `${API_BASE_URL}v1/user`,
  LOGINUSER: `${API_BASE_URL}v1/user/login`,
  UPLOADDOCUMENT: `${API_BASE_URL}v1/document/upload`,
  GETDOCUMENT: `${API_BASE_URL}v1/documents?fonda_id=`,
  LOGINRESPONSE: `${API_BASE_URL}v1/get/user?user_id=`,
  VALIDATEMAIL: `${API_BASE_URL}v1/user/validate/email?email_id=`,
  VALIDATEPHONENO: `${API_BASE_URL}v1/user/validate/phone?phone_number=`,
  LOGINVERIFYOTP: `${API_BASE_URL}v1/user/login/validate/otp`,
  LOGINRESENDOTP: `${API_BASE_URL}v1/user/login/resend/otp`,
  GETUSER: `${API_BASE_URL}v1/user?user_id=`,
  // GETDOCUMENTQR: `${API_BASE_URL}v1/document/qrcode?ref_id=`,
  GETDOCUMENTQR: `${API_BASE_URL}v1/document/share/qrcode?ref_id=`,
  GETDOCUMENTPREVIEW: `${API_BASE_URL}v1/document/verify/qrcode?ref_id=`,
  NOTIFICATION: `${API_BASE_URL}v1/user/notification?fonda_id=`,
  UPDATENOTIFICATION: `${API_BASE_URL}v1/user/notification/update/status`,
  ADDNOTIFICATION: `${API_BASE_URL}v1/user/notification`
};
