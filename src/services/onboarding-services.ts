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
  document: File | null;
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
    // FormData array values should be appended item-by-item for ASP.NET model binding.
    formData.append("YearsOfExperience", data.yearsOfExperience.toString());
    data.practiceAreas.forEach((areaId) => {
      formData.append("PracticeAreas", areaId.toString());
    });
    data.sessionTypes.forEach((sessionType) => {
      formData.append("SessionTypes", sessionType);
    });
    const response = await httpClient.post<ApiResponse<string>>(
      "/lawyer/onboarding/basic-info",
      formData,
    );
    return response.data;
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
    console.log("Education FormData entries:", formData);
    const response = await httpClient.post<ApiResponse<string>>(
      "/lawyer/onboarding/education",
      formData,
    );
    return response.data;
  },

  // Step 3: Save work experience
  async saveExperience(
    data: ExperienceData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await httpClient.post<ApiResponse<{ message: string }>>(
      "/lawyer/onboarding/experience",
      data,
    );
    return response.data;
  },

  // Step 4: Upload verification documents
  async uploadVerificationDocuments(
    data: VerificationData,
  ): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append("UserId", "string");

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

    const response = await httpClient.post<ApiResponse<string>>(
      "/lawyer/onboarding/verification",
      formData,
    );
    return response.data;
  },

  async getOnboardingProgress(): Promise<ApiResponse<OnboardingProgress>> {
    const response = await httpClient.get<ApiResponse<OnboardingProgress>>(
      "/lawyer/onboarding/progress",
    );
    return response.data;
  },
};

export default onboardingService;
