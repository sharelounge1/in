import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  Party,
  PartyListParams,
  CourseApplicationRequest,
  PaymentRequest,
} from '@/types';

export const partyService = {
  /**
   * Get party list
   */
  getList: async (params?: PartyListParams): Promise<ApiResponse<PaginatedResponse<Party>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Party>>>('/parties', { params });
    return response.data;
  },

  /**
   * Get party detail
   */
  getDetail: async (id: string): Promise<ApiResponse<Party>> => {
    const response = await apiClient.get<ApiResponse<Party>>(`/parties/${id}`);
    return response.data;
  },

  /**
   * Apply for a party
   */
  apply: async (
    id: string,
    data: CourseApplicationRequest
  ): Promise<ApiResponse<{ application_id: string; payment_request: PaymentRequest }>> => {
    const response = await apiClient.post<
      ApiResponse<{ application_id: string; payment_request: PaymentRequest }>
    >(`/parties/${id}/apply`, data);
    return response.data;
  },
};

export default partyService;
