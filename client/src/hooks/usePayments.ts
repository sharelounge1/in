import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';
import type {
  PaymentCompleteRequest,
  PaymentListParams,
} from '@/types';

// Query keys
export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (params?: PaymentListParams) => [...paymentKeys.lists(), params] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
};

/**
 * Hook to get my payment history
 */
export const useMyPayments = (params?: PaymentListParams) => {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => paymentService.getMyPayments(params),
  });
};

/**
 * Hook to get payment detail
 */
export const usePaymentDetail = (id: string) => {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentService.getPaymentDetail(id),
    enabled: !!id,
  });
};

/**
 * Hook for payment mutations
 */
export const usePaymentMutations = () => {
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: (data: PaymentCompleteRequest) => paymentService.complete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });

  return {
    complete: completeMutation.mutateAsync,
    isCompleting: completeMutation.isPending,
    completeError: completeMutation.error,
  };
};

export default useMyPayments;
