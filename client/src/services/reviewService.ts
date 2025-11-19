import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  Review,
  ReviewCreateRequest,
  ReviewUpdateRequest,
  PaginationParams,
} from '@/types';

export const reviewService = {
  /**
   * Create a review
   */
  create: async (data: ReviewCreateRequest): Promise<ApiResponse<Review>> => {
    const response = await apiClient.post<ApiResponse<Review>>('/reviews', data);
    return response.data;
  },

  /**
   * Get my reviews
   */
  getMyReviews: async (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Review>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Review>>>('/my/reviews', { params });
    return response.data;
  },

  /**
   * Update a review
   */
  update: async (id: string, data: ReviewUpdateRequest): Promise<ApiResponse<Review>> => {
    const response = await apiClient.put<ApiResponse<Review>>(`/reviews/${id}`, data);
    return response.data;
  },

  /**
   * Delete a review
   */
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/reviews/${id}`);
    return response.data;
  },
};

export default reviewService;
