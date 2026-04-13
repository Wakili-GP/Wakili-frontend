import httpClient, { type ApiResponse } from "./api/httpClient";

export interface LawyerBasicInfo {
  firstName: string;
  lastName: string;
  profileImage: File | string | null;
  phoneNumber: string;
  country: string;
  city: string;
  bio: string;
  yearsOfExperience: number;
  practiceAreas: number[];
  // 0: Phone, 1: Office for sessionTypes
  sessionTypes: number[];
}

export interface AcademicQualification {
  degreeType: string;
  fieldOfStudy: string;
  universityName: string;
  graduationYear: string;
  document: File | string | null;
}

export interface ProfessionalCertification {
  certificateName: string;
  issuingOrganization: string;
  yearObtained: string;
  document: File | string | null;
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
}

export interface LawyerOnboardingData {
  basicInfo: LawyerBasicInfo;
  education: EducationData;
  experience: ExperienceData;
  verification: VerificationData;
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
    formData.append("FirstName", data.firstName);
    formData.append("LastName", data.lastName);
    if (data.profileImage instanceof File) {
      formData.append("ProfileImage", data.profileImage);
    }
    formData.append("PhoneNumber", data.phoneNumber);
    formData.append("Country", data.country);
    formData.append("City", data.city);
    formData.append("Bio", data.bio);
    // FormData array values should be appended item-by-item for ASP.NET model binding.
    formData.append("YearsOfExperience", data.yearsOfExperience.toString());
    data.practiceAreas.forEach((areaId) => {
      formData.append("PracticeAreas", areaId.toString());
    });
    data.sessionTypes.forEach((sessionType) => {
      formData.append("SessionTypes", sessionType.toString());
    });
    console.log("Basic Info FormData entries:", formData);
    const response = await httpClient.post<ApiResponse<string>>(
      "/lawyer/onboarding/basic-info",
      formData,
    );
    console.log("Onboarding Basic Info Response DATA:", response.data);
    return response.data;
  },

  // Step 2: Save education and certifications
  async saveEducation(data: EducationData): Promise<ApiResponse<string>> {
    const formData = new FormData();

    data.academicQualifications.forEach((qualification, i) => {
      formData.append(
        `AcademicQualifications[${i}].degreeType`,
        qualification.degreeType || "",
      );
      formData.append(
        `AcademicQualifications[${i}].fieldOfStudy`,
        qualification.fieldOfStudy || "",
      );
      formData.append(
        `AcademicQualifications[${i}].universityName`,
        qualification.universityName || "",
      );
      formData.append(
        `AcademicQualifications[${i}].graduationYear`,
        qualification.graduationYear || "",
      );
      if (qualification.document instanceof File) {
        formData.append(
          `AcademicQualifications[${i}].document`,
          qualification.document,
        );
      }
    });

    data.professionalCertifications?.forEach((certification, i) => {
      formData.append(
        `ProfessionalCertifications[${i}].certificateName`,
        certification.certificateName || "",
      );
      formData.append(
        `ProfessionalCertifications[${i}].issuingOrganization`,
        certification.issuingOrganization || "",
      );
      formData.append(
        `ProfessionalCertifications[${i}].yearObtained`,
        certification.yearObtained || "",
      );
      if (certification.document instanceof File) {
        formData.append(
          `ProfessionalCertifications[${i}].document`,
          certification.document,
        );
      }
    });

    console.log("Education FormData entries:", formData.entries());

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
  async saveVerificationDocuments(
    data: VerificationData,
  ): Promise<ApiResponse<string>> {
    const formData = new FormData();

    if (data.nationalIdFront.file instanceof File)
      formData.append("NationalIdFront", data.nationalIdFront.file);
    if (data.nationalIdBack.file instanceof File)
      formData.append("NationalIdBack", data.nationalIdBack.file);
    if (data.lawyerLicense.file instanceof File)
      formData.append("License.LicenseFile", data.lawyerLicense.file);
    formData.append("License.LicenseNumber", data.lawyerLicenseNumber);
    formData.append(
      "License.IssuingAuthority",
      data.lawyerLicenseIssuingAuthority,
    );
    formData.append("License.LicenseYear", data.lawyerLicenseYearOfIssue);

    const response = await httpClient.post<ApiResponse<string>>(
      "/lawyer/onboarding/verification",
      formData,
    );
    console.log("Verification Upload Response DATA:", response.data);
    return response.data;
  },

  async getOnboardingProgress(): Promise<ApiResponse<OnboardingProgress>> {
    const response = await httpClient.get<ApiResponse<OnboardingProgress>>(
      "/lawyer/onboarding/progress",
    );
    console.log("Onboarding Progress Response DATA:", response.data);
    return response.data;
  },
};

export default onboardingService;
