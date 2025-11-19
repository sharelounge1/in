import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  User,
  TermsAgreement,
  ProfileUpdateRequest,
  NotificationSettings,
  WithdrawRequest,
} from '@/types';

export const userService = {
  /**
   * Agree to terms
   */
  agreeToTerms: async (data: TermsAgreement): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/users/terms-agreement', data);
    return response.data;
  },

  /**
   * Check nickname availability
   */
  checkNickname: async (nickname: string): Promise<ApiResponse<{ available: boolean }>> => {
    const response = await apiClient.get<ApiResponse<{ available: boolean }>>('/users/check-nickname', {
      params: { nickname },
    });
    return response.data;
  },

  /**
   * Create initial profile
   */
  createProfile: async (data: ProfileUpdateRequest): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/users/profile', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: ProfileUpdateRequest): Promise<ApiResponse<User>> => {
    const response = await apiClient.put<ApiResponse<User>>('/users/me', data);
    return response.data;
  },

  /**
   * Update notification settings
   */
  updateNotificationSettings: async (data: NotificationSettings): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>('/users/me/notifications', data);
    return response.data;
  },

  /**
   * Delete account (withdraw)
   */
  deleteAccount: async (data: WithdrawRequest): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>('/users/me', { data });
    return response.data;
  },
};

export default userService;
