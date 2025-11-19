import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import type {
  KakaoLoginRequest,
  IdentityVerificationRequest,
} from '@/types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  /**
   * Kakao login mutation
   */
  const kakaoLoginMutation = useMutation({
    mutationFn: (data: KakaoLoginRequest) => authService.kakaoLogin(data),
    onSuccess: (response) => {
      if (response.success) {
        const { user } = response.data;

        // Get redirect path from session storage or default
        const redirectPath = sessionStorage.getItem('auth_redirect') || '/';
        sessionStorage.removeItem('auth_redirect');

        // Navigate based on user state
        if (user.is_new_user || !user.profile_completed) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate(redirectPath, { replace: true });
        }
      }
    },
  });

  /**
   * Identity verification mutation
   */
  const verifyIdentityMutation = useMutation({
    mutationFn: (data: IdentityVerificationRequest) => authService.verifyIdentity(data),
  });

  /**
   * Logout mutation
   */
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Clear all React Query cache
      queryClient.clear();

      // Navigate to home
      navigate('/', { replace: true });
    },
  });

  /**
   * Redirect to OAuth provider login page
   */
  const redirectToOAuth = useCallback((provider: 'kakao' | 'naver') => {
    // Save current path for redirect after login
    sessionStorage.setItem('auth_redirect', window.location.pathname);

    const oauthUrl = authService.getOAuthUrl(provider);
    window.location.href = oauthUrl;
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = authService.isAuthenticated();

  /**
   * Clear auth state
   */
  const clearAuth = useCallback(() => {
    authService.clearAuth();
    queryClient.clear();
  }, [queryClient]);

  return {
    // State
    isAuthenticated,

    // Mutations
    kakaoLogin: kakaoLoginMutation.mutateAsync,
    isLoggingIn: kakaoLoginMutation.isPending,
    loginError: kakaoLoginMutation.error,

    verifyIdentity: verifyIdentityMutation.mutateAsync,
    isVerifying: verifyIdentityMutation.isPending,
    verifyError: verifyIdentityMutation.error,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    // Actions
    redirectToOAuth,
    clearAuth,
  };
};

export default useAuth;
