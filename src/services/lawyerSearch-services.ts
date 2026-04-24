import httpClient from "./api/httpClient";

export interface LawyerCardSpecialization {
  id: number;
  name: string;
  description: string;
}

export interface LawyerCard {
  id: string;
  profileImage: string;
  firstName: string;
  lastName: string;
  joinedDate: string;
  city: string;
  country: string;
  yearsOfExperience: number;
  specializations: LawyerCardSpecialization[];
  // 0: InOffice, 1: Phone
  sessionTypes: number[];
  phoneSessionPrice: number;
  inOfficeSessionPrice: number;
  averageRating: number;
  numberOfRatings: number;
}

export interface ResponseLawyerCard {
  items: LawyerCard[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const lawyerService = {
  async getAllLawyers(
    page: number,
    pageSize: number,
    searchQuery?: string,
    specializationId?: number,
    city?: string,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
    sessionTypes?: number[],
    // 0 -> avgRating, 1 -> Price, 2 -> numberOfRatings
    sortBy?: 0 | 1 | 2,
    sortOrder?: "asc" | "desc",
  ): Promise<ResponseLawyerCard> {
    const response = await httpClient.get<ResponseLawyerCard>(
      "/Lawyers/approved",
      {
        params: {
          page,
          pageSize,
          specializationId,
          city,
          minRating,
          minPrice,
          maxPrice,
          sortBy, // Price or Rating
          sortOrder, // Asc
          sessionTypes,
          searchQuery,
        },
      },
    );
    console.log("Lawyer Cards Response Data: ", response.data);
    return response.data;
  },
};

export default lawyerService;
