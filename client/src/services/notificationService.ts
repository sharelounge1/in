import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  Notification,
  NotificationListParams,
} from '@/types';

export const notificationService = {
  /**
   * Get notification list
   */
  getList: async (params?: NotificationListParams): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Notification>>>('/notifications', {
      params,
    });
    return response.data;
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>('/notifications/read-all');
    return response.data;
  },
};

export default notificationService;
