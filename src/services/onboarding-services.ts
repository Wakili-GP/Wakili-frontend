import httpClient, { type ApiResponse } from "./api/httpClient";

// POST Interfaces
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

export interface VerificationData {
  nationalIdFront: File | string | null;
  nationalIdBack: File | string | null;
  lawyerLicense: File | string | null;
  lawyerLicenseNumber: string;
  lawyerLicenseIssuingAuthority: string;
  lawyerLicenseYearOfIssue: string;
}

// GET Interfaces
export interface ProgressBasicInfo {
  firstName: string;
  lastName: string;
  email?: string;
  profileImage: string | null;
  phoneNumber: string;
  country: string;
  city: string;
  bio: string;
  yearsOfExperience: number;
  practiceAreas: number[];
  sessionTypes: number[];
}

export interface ProgressAcademicQualification {
  degreeType: string;
  fieldOfStudy: string;
  universityName: string;
  graduationYear: string;
  document: string | null;
}

export interface ProgressProfessionalCertification {
  certificateName: string;
  issuingOrganization: string;
  yearObtained: string;
  document: string | null;
}

export interface ProgressEducation {
  academicQualifications: ProgressAcademicQualification[];
  professionalCertifications: ProgressProfessionalCertification[];
}

export interface ProgressExperience {
  workExperiences: WorkExperience[];
}

// The Server Nests LawyerLicense Object
export interface ProgressLawyerLicense {
  licensePath: string | null;
  licenseNumber: string;
  issuingAuthority: string;
  licenseYear: string;
}

export interface ProgressVerification {
  nationalIdFront: string | null;
  nationalIdBack: string | null;
  lawyerLicense: ProgressLawyerLicense | null;
  professionalCertificates?: unknown[];
}

export interface ProgressData {
  basicInfo?: ProgressBasicInfo;
  education?: ProgressEducation;
  experience?: ProgressExperience;
  verification?: ProgressVerification;
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  data: ProgressData;
  lastUpdated: string;
}

// SERVICE

export const onboardingService = {
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
    formData.append("YearsOfExperience", data.yearsOfExperience.toString());
    data.practiceAreas.forEach((id) =>
      formData.append("PracticeAreas", id.toString()),
    );
    data.sessionTypes.forEach((t) =>
      formData.append("SessionTypes", t.toString()),
    );

    const response = await httpClient.post<ApiResponse<string>>(
      "/lawyer/onboarding/basic-info",
      formData,
    );
    return response.data;
  },

  async saveEducation(data: EducationData): Promise<ApiResponse<string>> {
    const formData = new FormData();

    data.academicQualifications.forEach((q, i) => {
      formData.append(`AcademicQualifications[${i}].degreeType`, q.degreeType);
      formData.append(
        `AcademicQualifications[${i}].fieldOfStudy`,
        q.fieldOfStudy,
      );
      formData.append(
        `AcademicQualifications[${i}].universityName`,
        q.universityName,
      );
      formData.append(
        `AcademicQualifications[${i}].graduationYear`,
        q.graduationYear,
      );
      if (q.document instanceof File) {
        formData.append(`AcademicQualifications[${i}].document`, q.document);
      }
    });

    data.professionalCertifications?.forEach((c, i) => {
      formData.append(
        `ProfessionalCertifications[${i}].certificateName`,
        c.certificateName,
      );
      formData.append(
        `ProfessionalCertifications[${i}].issuingOrganization`,
        c.issuingOrganization,
      );
      formData.append(
        `ProfessionalCertifications[${i}].yearObtained`,
        c.yearObtained,
      );
      if (c.document instanceof File) {
        formData.append(
          `ProfessionalCertifications[${i}].document`,
          c.document,
        );
      }
    });

    const response = await httpClient.post<ApiResponse<string>>(
      "/lawyer/onboarding/education",
      formData,
    );
    return response.data;
  },

  async saveExperience(
    data: ExperienceData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await httpClient.post<ApiResponse<{ message: string }>>(
      "/lawyer/onboarding/experience",
      data,
    );
    return response.data;
  },

  async saveVerificationDocuments(
    data: VerificationData,
  ): Promise<ApiResponse<string>> {
    const formData = new FormData();
    if (data.nationalIdFront instanceof File)
      formData.append("NationalIdFront", data.nationalIdFront);
    if (data.nationalIdBack instanceof File)
      formData.append("NationalIdBack", data.nationalIdBack);
    if (data.lawyerLicense instanceof File)
      formData.append("License.LicenseFile", data.lawyerLicense);
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
    return response.data;
  },

  async submitOnboarding(): Promise<ApiResponse<string>> {
    const response = await httpClient.post<ApiResponse<string>>(
      "/lawyer/onboarding/submit-for-review",
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
