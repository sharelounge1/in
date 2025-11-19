import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import type {
  TermsAgreement,
  ProfileUpdateRequest,
  NotificationSettings,
  WithdrawRequest,
} from '@/types';

// Query keys
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  checkNickname: (nickname: string) => [...userKeys.all, 'checkNickname', nickname] as const,
};

/**
 * Hook to get current user profile
 */
export const useProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => userService.getProfile(),
  });
};

/**
 * Hook to check nickname availability
 */
export const useCheckNickname = (nickname: string) => {
  return useQuery({
    queryKey: userKeys.checkNickname(nickname),
    queryFn: () => userService.checkNickname(nickname),
    enabled: nickname.length >= 2,
  });
};

/**
 * Hook for user mutations
 */
export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const agreeToTermsMutation = useMutation({
    mutationFn: (data: TermsAgreement) => userService.agreeToTerms(data),
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: ProfileUpdateRequest) => userService.createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileUpdateRequest) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });

  const updateNotificationSettingsMutation = useMutation({
    mutationFn: (data: NotificationSettings) => userService.updateNotificationSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (data: WithdrawRequest) => userService.deleteAccount(data),
  });

  return {
    agreeToTerms: agreeToTermsMutation.mutateAsync,
    isAgreeingToTerms: agreeToTermsMutation.isPending,

    createProfile: createProfileMutation.mutateAsync,
    isCreatingProfile: createProfileMutation.isPending,

    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,

    updateNotificationSettings: updateNotificationSettingsMutation.mutateAsync,
    isUpdatingNotifications: updateNotificationSettingsMutation.isPending,

    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeletingAccount: deleteAccountMutation.isPending,
  };
};

export default useProfile;
