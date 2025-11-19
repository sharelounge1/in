import apiClient, { tokenManager } from '@/lib/apiClient';
import type {
  ApiResponse,
  KakaoLoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  IdentityVerificationRequest,
} from '@/types';

export const authService = {
  /**
   * Kakao OAuth login
   */
  kakaoLogin: async (data: KakaoLoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/kakao', data);

    // Store tokens on successful login
    if (response.data.success) {
      const { access_token, refresh_token } = response.data.data;
      tokenManager.setTokens(access_token, refresh_token);
    }

    return response.data;
  },

  /**
   * Refresh access token
   */
  refresh: async (data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', data);

    // Update access token on success
    if (response.data.success) {
      tokenManager.setAccessToken(response.data.data.access_token);
    }

    return response.data;
  },

  /**
   * Identity verification (phone authentication)
   */
  verifyIdentity: async (data: IdentityVerificationRequest): Promise<ApiResponse<{ verified: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ verified: boolean }>>('/auth/identity-verification', data);
    return response.data;
  },

  /**
   * Logout
   */
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/logout');

    // Clear tokens on logout
    tokenManager.clearTokens();

    return response.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenManager.hasTokens();
  },

  /**
   * Clear local auth state
   */
  clearAuth: (): void => {
    tokenManager.clearTokens();
  },

  /**
   * Get OAuth login URL (for redirect-based auth)
   */
  getOAuthUrl: (provider: 'kakao' | 'naver'): string => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    return `${baseUrl}/auth/${provider}`;
  },
};

export default authService;
