import axios from "axios";

const BASE_URL = "https://med-scan-api-is3a.vercel.app/api/";

// Create an instance for public requests (does not require authentication)
export const publicInstance = axios.create({
  baseURL: BASE_URL,
});

// Create an instance for private requests (requires authentication)
export const privateInstance = axios.create({
  baseURL: BASE_URL,
});

// Add an interceptor to the private instance to automatically include the Authorization header
privateInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//* USER AUTHENTICATION
export const AUTH_URLS = {
  login: `auth/login`,
  signup: `auth/signup`,
  logout: `auth/logout`,
  forgotPassword: `auth/forgot-password`,
  forgotPassword_verifyCode: `auth/forgotPassword_verifyCode`,
  resetPassword: `auth/resetPassword`,
  verifyEmail: `auth/verify-email`,
};

// /chat/67f6150f88f26f44289aa0cb
// tasks_enpoints
export const CHAT_BOT = {
  Chat_With_ChatBot: (userId) => `chatbot/chat/${userId}`,
};

//  /6813c0bda0186e8aa05800a9/PatientOfDoctor
//  https://med-scan-api-is3a.vercel.app/api/doctor
// {{doctorProfile_url}}/6846e3ef82db9600971d0e59/PatientOfDoctor/6846e36882db9600971d0e4f
export const DOCTOR = {
  Get_All_Patients_Of_Doctor: (doctorId) =>
    `doctor/${doctorId}/PatientOfDoctor`,
  Create_Patient_Of_Doctor: (doctorId) => `doctor/${doctorId}/PatientOfDoctor`,
  Get_Specific_Patient: (doctorId, patientId) =>
    `doctor/${doctorId}/PatientOfDoctor/${patientId}`,
  Update_Patient: (doctorId, patientId) =>
    `doctor/${doctorId}/PatientOfDoctor/${patientId}`,
  Delete_Patient: (doctorId, patientId) =>
    `doctor/${doctorId}/PatientOfDoctor/${patientId}`,
  Update_Doctor_Profile: (doctorId) => `doctor/${doctorId}`,
  Delete_Doctor_Profile: (doctorId) => `doctor/${doctorId}`,
};

export const MEDICAL_ADVICES = {
  Get_All_Medical_Advices: (patientId) => `MedicalAdvice/${patientId}`,
  Get_Specific_Medical_Advice: (patientId, adviceID) =>
    `MedicalAdvice/${patientId}/${adviceID}`,
};

export const DOCTOR_RECOMMENDATION = {
  Get_All_Doctors: (options = {}) => {
    const params = new URLSearchParams(options).toString();
    return `doctorRecommendation${params ? `?${params}` : ""}`;
  },
  Get_All_Doctors_By_Specialty: (specialization, options = {}) => {
    const params = new URLSearchParams({
      specialization,
      ...options,
    }).toString();
    return `doctorRecommendation/bySpecialty?${params}`;
  },
  Get_Doctors_By_City: (clinic_location, options = {}) => {
    const params = new URLSearchParams({
      clinic_location,
      ...options,
    }).toString();
    return `doctorRecommendation/byCity?${params}`;
  },
  Get_Doctors_By_City_And_Specialty: (
    clinic_location,
    specialization,
    options = {}
  ) => {
    const params = new URLSearchParams({
      clinic_location,
      specialization,
      ...options,
    }).toString();
    return `doctorRecommendation/byCityAndSpecialty?${params}`;
  },
  Get_Specific_Doctor_By_Id: (doctorId) => `doctorRecommendation/${doctorId}`,
};


export const PATIENT_PROFILE = {
  Update_Patient_Profile: (patientId) => `patient/${patientId}`,
  Delete_Patient_Profile: (patientId) => `patient/${patientId}`,
};

