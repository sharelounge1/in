import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  Payment,
  PaymentCompleteRequest,
  PaymentListParams,
} from '@/types';

export const paymentService = {
  /**
   * Complete payment after PG callback
   */
  complete: async (data: PaymentCompleteRequest): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.post<ApiResponse<Payment>>('/payments/complete', data);
    return response.data;
  },

  /**
   * Get my payment history
   */
  getMyPayments: async (params?: PaymentListParams): Promise<ApiResponse<PaginatedResponse<Payment>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Payment>>>('/my/payments', { params });
    return response.data;
  },

  /**
   * Get payment detail
   */
  getPaymentDetail: async (id: string): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.get<ApiResponse<Payment>>(`/my/payments/${id}`);
    return response.data;
  },
};

export default paymentService;
