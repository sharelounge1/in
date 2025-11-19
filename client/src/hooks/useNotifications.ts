import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import type { NotificationListParams } from '@/types';

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params?: NotificationListParams) => [...notificationKeys.lists(), params] as const,
};

/**
 * Hook to get notification list
 */
export const useNotifications = (params?: NotificationListParams) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationService.getList(params),
  });
};

/**
 * Hook to get infinite notification list
 */
export const useNotificationsInfinite = (params?: Omit<NotificationListParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: notificationKeys.list(params),
    queryFn: ({ pageParam = 1 }) => notificationService.getList({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.success) return undefined;
      const { page, limit, total } = lastPage.data;
      const hasMore = page * limit < total;
      return hasMore ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

/**
 * Hook for notification mutations
 */
export const useNotificationMutations = () => {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  return {
    markAsRead: markAsReadMutation.mutateAsync,
    isMarkingAsRead: markAsReadMutation.isPending,

    markAllAsRead: markAllAsReadMutation.mutateAsync,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
};

export default useNotifications;
