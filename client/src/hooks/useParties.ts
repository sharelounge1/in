import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { partyService } from '@/services/partyService';
import type {
  PartyListParams,
  CourseApplicationRequest,
} from '@/types';

// Query keys
export const partyKeys = {
  all: ['parties'] as const,
  lists: () => [...partyKeys.all, 'list'] as const,
  list: (params?: PartyListParams) => [...partyKeys.lists(), params] as const,
  details: () => [...partyKeys.all, 'detail'] as const,
  detail: (id: string) => [...partyKeys.details(), id] as const,
};

/**
 * Hook to get party list
 */
export const usePartyList = (params?: PartyListParams) => {
  return useQuery({
    queryKey: partyKeys.list(params),
    queryFn: () => partyService.getList(params),
  });
};

/**
 * Hook to get infinite party list with pagination
 */
export const usePartyListInfinite = (params?: Omit<PartyListParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: partyKeys.list(params),
    queryFn: ({ pageParam = 1 }) => partyService.getList({ ...params, page: pageParam }),
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
 * Hook to get party detail
 */
export const usePartyDetail = (id: string) => {
  return useQuery({
    queryKey: partyKeys.detail(id),
    queryFn: () => partyService.getDetail(id),
    enabled: !!id,
  });
};

/**
 * Hook for party mutations
 */
export const usePartyMutations = () => {
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: ({ partyId, data }: { partyId: string; data: CourseApplicationRequest }) =>
      partyService.apply(partyId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: partyKeys.detail(variables.partyId) });
    },
  });

  return {
    apply: applyMutation.mutateAsync,
    isApplying: applyMutation.isPending,
    applyError: applyMutation.error,
  };
};

export default usePartyList;
