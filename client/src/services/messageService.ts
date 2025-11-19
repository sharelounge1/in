import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  Conversation,
  Message,
  MessageSendRequest,
  PaginationParams,
} from '@/types';

export const messageService = {
  /**
   * Get conversation list
   */
  getConversations: async (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Conversation>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Conversation>>>('/messages', { params });
    return response.data;
  },

  /**
   * Get messages in a conversation
   */
  getMessages: async (
    conversationId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Message>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Message>>>(
      `/messages/${conversationId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Send a message
   */
  send: async (data: MessageSendRequest): Promise<ApiResponse<Message>> => {
    const response = await apiClient.post<ApiResponse<Message>>('/messages', data);
    return response.data;
  },

  /**
   * Mark message as read
   */
  markAsRead: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/messages/${id}/read`);
    return response.data;
  },
};

export default messageService;
