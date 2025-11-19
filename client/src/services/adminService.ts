import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  InfluencerApplicationAdmin,
  Payment,
  Settlement,
  Report,
  Analytics,
  AnalyticsParams,
  FeeSettings,
  InfluencerFeeSettings,
  RefundRequest,
  ReportResolveRequest,
  PaginationParams,
  PaymentListParams,
  SettlementListParams,
} from '@/types';

export const adminService = {
  // ==========================================
  // Influencer Management
  // ==========================================

  /**
   * Get influencer applications
   */
  getInfluencerApplications: async (
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<InfluencerApplicationAdmin>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<InfluencerApplicationAdmin>>>(
      '/admin/influencer-applications',
      { params }
    );
    return response.data;
  },

  /**
   * Approve influencer application
   */
  approveInfluencer: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/admin/influencer-applications/${id}/approve`);
    return response.data;
  },

  /**
   * Reject influencer application
   */
  rejectInfluencer: async (id: string, reason: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/admin/influencer-applications/${id}/reject`, {
      reason,
    });
    return response.data;
  },

  // ==========================================
  // Payment Management
  // ==========================================

  /**
   * Get all payments
   */
  getPayments: async (params?: PaymentListParams): Promise<ApiResponse<PaginatedResponse<Payment>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Payment>>>('/admin/payments', { params });
    return response.data;
  },

  /**
   * Process refund
   */
  processRefund: async (paymentId: string, data: RefundRequest): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(`/admin/payments/${paymentId}/refund`, data);
    return response.data;
  },

  // ==========================================
  // Settlement Management
  // ==========================================

  /**
   * Get all settlements
   */
  getSettlements: async (params?: SettlementListParams): Promise<ApiResponse<PaginatedResponse<Settlement>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Settlement>>>('/admin/settlements', {
      params,
    });
    return response.data;
  },

  /**
   * Approve settlement
   */
  approveSettlement: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/admin/settlements/${id}/approve`);
    return response.data;
  },

  /**
   * Complete settlement (mark as paid)
   */
  completeSettlement: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/admin/settlements/${id}/complete`);
    return response.data;
  },

  // ==========================================
  // Fee Settings
  // ==========================================

  /**
   * Get fee settings
   */
  getFeeSettings: async (): Promise<ApiResponse<FeeSettings>> => {
    const response = await apiClient.get<ApiResponse<FeeSettings>>('/admin/settings/fees');
    return response.data;
  },

  /**
   * Update fee settings
   */
  updateFeeSettings: async (data: FeeSettings): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>('/admin/settings/fees', data);
    return response.data;
  },

  /**
   * Set custom fees for an influencer
   */
  setInfluencerFees: async (influencerId: string, data: InfluencerFeeSettings): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/admin/influencers/${influencerId}/fees`, data);
    return response.data;
  },

  // ==========================================
  // Report Management
  // ==========================================

  /**
   * Get reports
   */
  getReports: async (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Report>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Report>>>('/admin/reports', { params });
    return response.data;
  },

  /**
   * Resolve a report
   */
  resolveReport: async (id: string, data: ReportResolveRequest): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/admin/reports/${id}/resolve`, data);
    return response.data;
  },

  // ==========================================
  // User Management
  // ==========================================

  /**
   * Suspend a user
   */
  suspendUser: async (userId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/admin/users/${userId}/suspend`);
    return response.data;
  },

  // ==========================================
  // Analytics
  // ==========================================

  /**
   * Get analytics data
   */
  getAnalytics: async (params?: AnalyticsParams): Promise<ApiResponse<Analytics>> => {
    const response = await apiClient.get<ApiResponse<Analytics>>('/admin/analytics', { params });
    return response.data;
  },
};

export default adminService;
