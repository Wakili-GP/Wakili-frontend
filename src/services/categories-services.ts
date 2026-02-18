import { httpClient, type ApiResponse } from "./api/httpClient";

export interface Specialization {
  id: number;
  name: string;
  description: string;
}

// ============ Service ============

export const categoriesService = {
  /**
   * Get all active specializations
   * GET /api/Specializations/active
   */
  async getActiveSpecializations(): Promise<ApiResponse<Specialization[]>> {
    const response = await httpClient.get<Specialization[]>(
      "/Specializations/active",
    );

    // httpClient already unwraps the data property, so response.data is already the array
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        statusCode: response.statusCode,
      };
    }

    return {
      success: false,
      error: response.error || "Failed to fetch specializations",
      statusCode: response.statusCode,
    };
  },

  /**
   * Get specialization by ID
   */
  async getSpecializationById(
    id: number,
  ): Promise<ApiResponse<Specialization>> {
    const response = await this.getActiveSpecializations();

    if (response.success && response.data) {
      const specialization = response.data.find((spec) => spec.id === id);
      if (specialization) {
        return {
          success: true,
          data: specialization,
          statusCode: 200,
        };
      }
    }

    return {
      success: false,
      error: "Specialization not found",
      statusCode: 404,
    };
  },

  /**
   * Get multiple specializations by IDs
   */
  getSpecializationsByIds(
    ids: number[],
    allSpecializations: Specialization[],
  ): Specialization[] {
    return allSpecializations.filter((spec) => ids.includes(spec.id));
  },

  /**
   * Convert specialization names to IDs
   */
  getIdsByNames(
    names: string[],
    allSpecializations: Specialization[],
  ): number[] {
    return allSpecializations
      .filter((spec) => names.includes(spec.name))
      .map((spec) => spec.id);
  },

  /**
   * Convert specialization IDs to names
   */
  getNamesByIds(ids: number[], allSpecializations: Specialization[]): string[] {
    return allSpecializations
      .filter((spec) => ids.includes(spec.id))
      .map((spec) => spec.name);
  },
};

export default categoriesService;
