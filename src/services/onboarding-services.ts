import httpClient, { type ApiResponse } from "./api/httpClient";

export interface LawyerBasicInfo {
  profileImage: File | null;
  phoneCode: string; // E.g., +20
  phoneNumber: string;
  country: string;
  city: string;
  bio: string;
  yearsOfExperience: number;
  practiceAreas: number[]; // IDs of Specializations
  sessionTypes: string[]; // Array of Strings
}

export interface AcademicQualification {
  degreeType: string;
  fieldOfStudy: string;
  universityName: string;
  graduationYear: string;
}

export interface ProfessionalCertification {
  certificateName: string;
  issuingOrganization: string;
  yearObtained: string;
  document: string | null;
}

export interface EducationData {
  academicQualifications: AcademicQualification[];
  professionalCertifications: ProfessionalCertification[];
}

export interface WorkExperience {
  jobTitle: string;
  organizationName: string;
  startYear: string;
  endYear: string;
  isCurrentJob: boolean;
  description: string;
}

export interface ExperienceData {
  workExperiences: WorkExperience[];
}

export interface VerificationDocument {
  fileName: string | null;
  file: File | null;
  status: "pending" | "uploaded";
}

export interface VerificationData {
  lawyerLicenseNumber: string;
  lawyerLicenseIssuingAuthority: string;
  lawyerLicenseYearOfIssue: string;
  nationalIdFront: VerificationDocument;
  nationalIdBack: VerificationDocument;
  lawyerLicense: VerificationDocument;
  educationalCertificates: VerificationDocument[];
  professionalCertificates: VerificationDocument[];
}

export interface LawyerOnboardingData {
  basicInfo: LawyerBasicInfo;
  education: EducationData;
  experience: ExperienceData;
  verification: VerificationData;
}

export interface OnboardingSubmitRequest {
  step: number;
  data: Partial<LawyerOnboardingData>;
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  data: Partial<LawyerOnboardingData>;
  lastUpdated: string;
}

export const onboardingService = {
  /// Step 1: Save basic info
  async saveBasicInfo(data: LawyerBasicInfo): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append("UserId", "string");
    if (data.profileImage) formData.append("ProfileImage", data.profileImage);
    formData.append("PhoneNumber", `${data.phoneCode}${data.phoneNumber}`);
    formData.append("Country", data.country);
    formData.append("City", data.city);
    formData.append("Bio", data.bio);
    // FormData only supports string values, so we need to convert numbers and arrays to strings
    formData.append("YearsOfExperience", data.yearsOfExperience.toString());
    formData.append("PracticeAreas", JSON.stringify(data.practiceAreas));
    formData.append("SessionTypes", JSON.stringify(data.sessionTypes));
    return httpClient.post("/lawyer/onboarding/basic-info", formData);
  },

  // Step 2: Save education and certifications
  async saveEducation(data: EducationData): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append("UserId", "string");
    formData.append(
      "AcademicQualifications",
      JSON.stringify(data.academicQualifications),
    );
    formData.append(
      "ProfessionalCertifications",
      JSON.stringify(data.professionalCertifications),
    );
    return httpClient.post("/lawyer/onboarding/education", formData);
  },

  // Step 3: Save work experience
  async saveExperience(
    data: ExperienceData,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post("/lawyer/onboarding/experience", data);
  },

  // Step 4: Upload verification documents
  async uploadVerificationDocuments(
    data: VerificationData,
  ): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append("UserId", localStorage.getItem("userId") || "");

    if (data.nationalIdFront.file)
      formData.append("NationalIdFront", data.nationalIdFront.file);
    if (data.nationalIdBack.file)
      formData.append("NationalIdBack", data.nationalIdBack.file);
    if (data.lawyerLicense.file)
      formData.append("License.LicenseFile", data.lawyerLicense.file);
    formData.append("License.LicenseNumber", data.lawyerLicenseNumber);
    formData.append(
      "License.IssuingAuthority",
      data.lawyerLicenseIssuingAuthority,
    );
    formData.append("License.LicenseYear", data.lawyerLicenseYearOfIssue);

    data.educationalCertificates.forEach((cert, i) => {
      if (cert.file)
        formData.append(`EducationalCertificates[${i}]`, cert.file);
    });
    data.professionalCertificates.forEach((cert, i) => {
      if (cert.file)
        formData.append(`ProfessionalCertificates[${i}]`, cert.file);
    });

    return httpClient.post("/lawyer/onboarding/verification", formData);
  },

  async getOnboardingProgress(): Promise<ApiResponse<OnboardingProgress>> {
    return httpClient.get("/lawyer/onboarding/progress");
  },
};

export default onboardingService;
