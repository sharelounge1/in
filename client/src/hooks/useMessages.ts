import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { messageService } from '@/services/messageService';
import type {
  MessageSendRequest,
  PaginationParams,
} from '@/types';

// Query keys
export const messageKeys = {
  all: ['messages'] as const,
  conversations: (params?: PaginationParams) => [...messageKeys.all, 'conversations', params] as const,
  messages: (conversationId: string, params?: PaginationParams) =>
    [...messageKeys.all, 'conversation', conversationId, params] as const,
};

/**
 * Hook to get conversation list
 */
export const useConversations = (params?: PaginationParams) => {
  return useQuery({
    queryKey: messageKeys.conversations(params),
    queryFn: () => messageService.getConversations(params),
  });
};

/**
 * Hook to get messages in a conversation
 */
export const useMessages = (conversationId: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: messageKeys.messages(conversationId, params),
    queryFn: () => messageService.getMessages(conversationId, params),
    enabled: !!conversationId,
  });
};

/**
 * Hook to get infinite messages in a conversation
 */
export const useMessagesInfinite = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: messageKeys.messages(conversationId),
    queryFn: ({ pageParam = 1 }) =>
      messageService.getMessages(conversationId, { page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.success) return undefined;
      const { page, limit, total } = lastPage.data;
      const hasMore = page * limit < total;
      return hasMore ? page + 1 : undefined;
    },
    enabled: !!conversationId,
    initialPageParam: 1,
  });
};

/**
 * Hook for message mutations
 */
export const useMessageMutations = () => {
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: (data: MessageSendRequest) => messageService.send(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => messageService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
    },
  });

  return {
    send: sendMutation.mutateAsync,
    isSending: sendMutation.isPending,

    markAsRead: markAsReadMutation.mutateAsync,
    isMarkingAsRead: markAsReadMutation.isPending,
  };
};

export default useConversations;
