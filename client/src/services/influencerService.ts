import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  InfluencerProfile,
  InfluencerApplicationRequest,
  Course,
  CourseCreateRequest,
  Party,
  PartyCreateRequest,
  ApplicationListResponse,
  Settlement,
  SettlementListParams,
  AnnouncementCreateRequest,
  Announcement,
  NbangItemRequest,
  NbangItemResponse,
} from '@/types';

export const influencerService = {
  /**
   * Get influencer public profile
   */
  getProfile: async (id: string): Promise<ApiResponse<InfluencerProfile>> => {
    const response = await apiClient.get<ApiResponse<InfluencerProfile>>(`/influencers/${id}`);
    return response.data;
  },

  /**
   * Apply to become an influencer
   */
  apply: async (data: InfluencerApplicationRequest): Promise<ApiResponse<{ application_id: string }>> => {
    const response = await apiClient.post<ApiResponse<{ application_id: string }>>('/influencers/apply', data);
    return response.data;
  },

  // ==========================================
  // Influencer Management APIs
  // ==========================================

  /**
   * Get my courses as influencer
   */
  getMyCourses: async (params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Course>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Course>>>('/influencer/courses', { params });
    return response.data;
  },

  /**
   * Create a new course
   */
  createCourse: async (data: CourseCreateRequest): Promise<ApiResponse<Course>> => {
    const response = await apiClient.post<ApiResponse<Course>>('/influencer/courses', data);
    return response.data;
  },

  /**
   * Update a course
   */
  updateCourse: async (id: string, data: Partial<CourseCreateRequest>): Promise<ApiResponse<Course>> => {
    const response = await apiClient.put<ApiResponse<Course>>(`/influencer/courses/${id}`, data);
    return response.data;
  },

  /**
   * Delete a course
   */
  deleteCourse: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/influencer/courses/${id}`);
    return response.data;
  },

  /**
   * Get my parties as influencer
   */
  getMyParties: async (params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Party>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Party>>>('/influencer/parties', { params });
    return response.data;
  },

  /**
   * Create a new party
   */
  createParty: async (data: PartyCreateRequest): Promise<ApiResponse<Party>> => {
    const response = await apiClient.post<ApiResponse<Party>>('/influencer/parties', data);
    return response.data;
  },

  /**
   * Update a party
   */
  updateParty: async (id: string, data: Partial<PartyCreateRequest>): Promise<ApiResponse<Party>> => {
    const response = await apiClient.put<ApiResponse<Party>>(`/influencer/parties/${id}`, data);
    return response.data;
  },

  /**
   * Delete a party
   */
  deleteParty: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/influencer/parties/${id}`);
    return response.data;
  },

  /**
   * Get applications for a course
   */
  getCourseApplications: async (courseId: string): Promise<ApiResponse<ApplicationListResponse>> => {
    const response = await apiClient.get<ApiResponse<ApplicationListResponse>>(
      `/influencer/courses/${courseId}/applications`
    );
    return response.data;
  },

  /**
   * Get applications for a party
   */
  getPartyApplications: async (partyId: string): Promise<ApiResponse<ApplicationListResponse>> => {
    const response = await apiClient.get<ApiResponse<ApplicationListResponse>>(
      `/influencer/parties/${partyId}/applications`
    );
    return response.data;
  },

  /**
   * Select an applicant (confirm)
   */
  selectApplication: async (applicationId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/influencer/applications/${applicationId}/select`);
    return response.data;
  },

  /**
   * Reject an applicant
   */
  rejectApplication: async (applicationId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/influencer/applications/${applicationId}/reject`);
    return response.data;
  },

  /**
   * Close recruitment for a course
   */
  closeCourseRecruitment: async (courseId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(`/influencer/courses/${courseId}/close-recruitment`);
    return response.data;
  },

  /**
   * Close recruitment for a party
   */
  closePartyRecruitment: async (partyId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(`/influencer/parties/${partyId}/close-recruitment`);
    return response.data;
  },

  /**
   * Request expense charge from participants
   */
  requestExpense: async (courseId: string, requested_amount: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(`/influencer/courses/${courseId}/request-expense`, {
      requested_amount,
    });
    return response.data;
  },

  /**
   * Add N-bang (split payment) item
   */
  addNbangItem: async (courseId: string, data: NbangItemRequest): Promise<ApiResponse<NbangItemResponse>> => {
    const response = await apiClient.post<ApiResponse<NbangItemResponse>>(
      `/influencer/courses/${courseId}/nbang-items`,
      data
    );
    return response.data;
  },

  /**
   * Create announcement for a course
   */
  createCourseAnnouncement: async (
    courseId: string,
    data: AnnouncementCreateRequest
  ): Promise<ApiResponse<Announcement>> => {
    const response = await apiClient.post<ApiResponse<Announcement>>(
      `/influencer/courses/${courseId}/announcements`,
      data
    );
    return response.data;
  },

  /**
   * Create announcement for a party
   */
  createPartyAnnouncement: async (
    partyId: string,
    data: AnnouncementCreateRequest
  ): Promise<ApiResponse<Announcement>> => {
    const response = await apiClient.post<ApiResponse<Announcement>>(
      `/influencer/parties/${partyId}/announcements`,
      data
    );
    return response.data;
  },

  /**
   * Get settlements
   */
  getSettlements: async (params?: SettlementListParams): Promise<ApiResponse<PaginatedResponse<Settlement>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Settlement>>>('/influencer/settlements', {
      params,
    });
    return response.data;
  },

  /**
   * Get settlement detail
   */
  getSettlementDetail: async (id: string): Promise<ApiResponse<Settlement>> => {
    const response = await apiClient.get<ApiResponse<Settlement>>(`/influencer/settlements/${id}`);
    return response.data;
  },
};

export default influencerService;
