import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  Banner,
  Notice,
  FAQ,
  Inquiry,
  InquiryCreateRequest,
  TravelRecord,
  TravelRecordCreateRequest,
  PaginationParams,
} from '@/types';

export const commonService = {
  // ==========================================
  // Banners
  // ==========================================

  /**
   * Get banners
   */
  getBanners: async (): Promise<ApiResponse<{ items: Banner[] }>> => {
    const response = await apiClient.get<ApiResponse<{ items: Banner[] }>>('/banners');
    return response.data;
  },

  // ==========================================
  // Notices
  // ==========================================

  /**
   * Get service notices
   */
  getNotices: async (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Notice>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Notice>>>('/notices', { params });
    return response.data;
  },

  // ==========================================
  // FAQ
  // ==========================================

  /**
   * Get FAQs
   */
  getFAQs: async (): Promise<ApiResponse<{ items: FAQ[] }>> => {
    const response = await apiClient.get<ApiResponse<{ items: FAQ[] }>>('/faqs');
    return response.data;
  },

  // ==========================================
  // Inquiries
  // ==========================================

  /**
   * Create an inquiry
   */
  createInquiry: async (data: InquiryCreateRequest): Promise<ApiResponse<Inquiry>> => {
    const response = await apiClient.post<ApiResponse<Inquiry>>('/inquiries', data);
    return response.data;
  },

  /**
   * Get my inquiries
   */
  getMyInquiries: async (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Inquiry>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Inquiry>>>('/my/inquiries', { params });
    return response.data;
  },

  // ==========================================
  // Travel Records
  // ==========================================

  /**
   * Create a travel record
   */
  createTravelRecord: async (data: TravelRecordCreateRequest): Promise<ApiResponse<TravelRecord>> => {
    const response = await apiClient.post<ApiResponse<TravelRecord>>('/travel-records', data);
    return response.data;
  },

  /**
   * Get travel records
   */
  getTravelRecords: async (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<TravelRecord>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<TravelRecord>>>('/travel-records', {
      params,
    });
    return response.data;
  },

  /**
   * Get my travel records
   */
  getMyTravelRecords: async (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<TravelRecord>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<TravelRecord>>>('/my/travel-records', {
      params,
    });
    return response.data;
  },
};

export default commonService;
