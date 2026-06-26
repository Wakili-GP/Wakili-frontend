import httpClient, { type ApiResponse } from "@/services/api/httpClient";

export interface FavoriteLawyer {
  id: string;
  profileImage: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  licenseNumber: string;
  yearsOfExperience: number;
  specializations: string[];
  sessionTypes: number[];
  joinedDate: string;
  phoneSessionPrice: number;
  inOfficeSessionPrice: number;
  averageRating: number;
  numberOfRatings: number;
}

export const favoritesService = {
  async getFavorites(): Promise<FavoriteLawyer[]> {
    const response =
      await httpClient.get<ApiResponse<FavoriteLawyer[]>>("/Favorites");
    console.log("From Favourites --- response.data:", response.data);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch favorites");
    }
    return response.data.data ?? [];
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
