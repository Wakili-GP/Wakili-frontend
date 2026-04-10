import httpClient, { type ApiResponse } from "@/services/api/httpClient";

export interface FavoriteLawyer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  city: string;
  licenseNumber: string;
  yearsOfExperience: number;
  specializations: {
    id: number;
    name: string;
    description: string;
  }[];
  sessionTypes: string[];
  joinedDate: string;
  phoneSessionPrice: number;
  inOfficeSessionPrice: number;
}

export const favoritesService = {
  async getFavorites(): Promise<ApiResponse<FavoriteLawyer[]>> {
    const response =
      await httpClient.get<ApiResponse<FavoriteLawyer[]>>("/Favorites");
    return response.data;
  },

  async addFavorite(lawyerId: string): Promise<ApiResponse<string>> {
    const response = await httpClient.post<ApiResponse<string>>(
      `Favorites/${lawyerId}`,
    );
    return response.data;
  },

  async removeFavorite(lawyerId: string): Promise<ApiResponse<string>> {
    const response = await httpClient.delete<ApiResponse<string>>(
      `/Favorites/${lawyerId}`,
    );
    return response.data;
  },
};

export default favoritesService;
