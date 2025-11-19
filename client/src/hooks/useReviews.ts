import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/reviewService';
import type {
  ReviewCreateRequest,
  ReviewUpdateRequest,
  PaginationParams,
} from '@/types';

// Query keys
export const reviewKeys = {
  all: ['reviews'] as const,
  myReviews: (params?: PaginationParams) => [...reviewKeys.all, 'my', params] as const,
};

/**
 * Hook to get my reviews
 */
export const useMyReviews = (params?: PaginationParams) => {
  return useQuery({
    queryKey: reviewKeys.myReviews(params),
    queryFn: () => reviewService.getMyReviews(params),
  });
};

/**
 * Hook for review mutations
 */
export const useReviewMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: ReviewCreateRequest) => reviewService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewUpdateRequest }) =>
      reviewService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });

  return {
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    delete: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

export default useMyReviews;
