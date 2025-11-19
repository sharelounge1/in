import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  Course,
  CourseDetail,
  CourseListParams,
  CourseApplicationRequest,
  CourseApplication,
  ActiveTravel,
  Announcement,
  Comment,
  ExpenseInfo,
  PaymentRequest,
} from '@/types';

export const courseService = {
  /**
   * Get course list
   */
  getList: async (params?: CourseListParams): Promise<ApiResponse<PaginatedResponse<Course>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Course>>>('/courses', { params });
    return response.data;
  },

  /**
   * Get featured courses
   */
  getFeatured: async (): Promise<ApiResponse<PaginatedResponse<Course>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Course>>>('/courses/featured');
    return response.data;
  },

  /**
   * Get course detail
   */
  getDetail: async (id: string): Promise<ApiResponse<CourseDetail>> => {
    const response = await apiClient.get<ApiResponse<CourseDetail>>(`/courses/${id}`);
    return response.data;
  },

  /**
   * Apply for a course
   */
  apply: async (
    id: string,
    data: CourseApplicationRequest
  ): Promise<ApiResponse<{ application_id: string; payment_request: PaymentRequest }>> => {
    const response = await apiClient.post<
      ApiResponse<{ application_id: string; payment_request: PaymentRequest }>
    >(`/courses/${id}/apply`, data);
    return response.data;
  },

  /**
   * Get my applications
   */
  getMyApplications: async (type?: 'course' | 'party'): Promise<ApiResponse<{ items: CourseApplication[] }>> => {
    const response = await apiClient.get<ApiResponse<{ items: CourseApplication[] }>>('/my/applications', {
      params: { type },
    });
    return response.data;
  },

  /**
   * Get my active travels
   */
  getMyActiveTravels: async (): Promise<ApiResponse<{ items: ActiveTravel[] }>> => {
    const response = await apiClient.get<ApiResponse<{ items: ActiveTravel[] }>>('/my/active-travels');
    return response.data;
  },

  /**
   * Get course announcements
   */
  getAnnouncements: async (courseId: string): Promise<ApiResponse<{ items: Announcement[] }>> => {
    const response = await apiClient.get<ApiResponse<{ items: Announcement[] }>>(
      `/courses/${courseId}/announcements`
    );
    return response.data;
  },

  /**
   * Create announcement comment
   */
  createAnnouncementComment: async (
    announcementId: string,
    content: string
  ): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post<ApiResponse<Comment>>(
      `/announcements/${announcementId}/comments`,
      { content }
    );
    return response.data;
  },

  /**
   * Get my expenses for a course
   */
  getMyExpenses: async (courseId: string): Promise<ApiResponse<ExpenseInfo>> => {
    const response = await apiClient.get<ApiResponse<ExpenseInfo>>(`/courses/${courseId}/my-expenses`);
    return response.data;
  },

  /**
   * Charge expense
   */
  chargeExpense: async (
    courseId: string,
    amount: number
  ): Promise<ApiResponse<{ payment_request: PaymentRequest }>> => {
    const response = await apiClient.post<ApiResponse<{ payment_request: PaymentRequest }>>(
      `/courses/${courseId}/charge-expense`,
      { amount }
    );
    return response.data;
  },
};

export default courseService;
