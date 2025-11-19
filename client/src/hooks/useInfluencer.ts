import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { influencerService } from '@/services/influencerService';
import type {
  InfluencerApplicationRequest,
  CourseCreateRequest,
  PartyCreateRequest,
  SettlementListParams,
  AnnouncementCreateRequest,
  NbangItemRequest,
} from '@/types';

// Query keys
export const influencerKeys = {
  all: ['influencer'] as const,
  profile: (id: string) => [...influencerKeys.all, 'profile', id] as const,
  myCourses: (params?: object) => [...influencerKeys.all, 'myCourses', params] as const,
  myParties: (params?: object) => [...influencerKeys.all, 'myParties', params] as const,
  courseApplications: (courseId: string) => [...influencerKeys.all, 'courseApplications', courseId] as const,
  partyApplications: (partyId: string) => [...influencerKeys.all, 'partyApplications', partyId] as const,
  settlements: (params?: SettlementListParams) => [...influencerKeys.all, 'settlements', params] as const,
  settlementDetail: (id: string) => [...influencerKeys.all, 'settlementDetail', id] as const,
};

/**
 * Hook to get influencer public profile
 */
export const useInfluencerProfile = (id: string) => {
  return useQuery({
    queryKey: influencerKeys.profile(id),
    queryFn: () => influencerService.getProfile(id),
    enabled: !!id,
  });
};

/**
 * Hook to get my courses as influencer
 */
export const useInfluencerCourses = (params?: { status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: influencerKeys.myCourses(params),
    queryFn: () => influencerService.getMyCourses(params),
  });
};

/**
 * Hook to get my parties as influencer
 */
export const useInfluencerParties = (params?: { status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: influencerKeys.myParties(params),
    queryFn: () => influencerService.getMyParties(params),
  });
};

/**
 * Hook to get course applications
 */
export const useCourseApplications = (courseId: string) => {
  return useQuery({
    queryKey: influencerKeys.courseApplications(courseId),
    queryFn: () => influencerService.getCourseApplications(courseId),
    enabled: !!courseId,
  });
};

/**
 * Hook to get party applications
 */
export const usePartyApplications = (partyId: string) => {
  return useQuery({
    queryKey: influencerKeys.partyApplications(partyId),
    queryFn: () => influencerService.getPartyApplications(partyId),
    enabled: !!partyId,
  });
};

/**
 * Hook to get settlements
 */
export const useSettlements = (params?: SettlementListParams) => {
  return useQuery({
    queryKey: influencerKeys.settlements(params),
    queryFn: () => influencerService.getSettlements(params),
  });
};

/**
 * Hook to get settlement detail
 */
export const useSettlementDetail = (id: string) => {
  return useQuery({
    queryKey: influencerKeys.settlementDetail(id),
    queryFn: () => influencerService.getSettlementDetail(id),
    enabled: !!id,
  });
};

/**
 * Hook for influencer mutations
 */
export const useInfluencerMutations = () => {
  const queryClient = useQueryClient();

  // Apply to become influencer
  const applyMutation = useMutation({
    mutationFn: (data: InfluencerApplicationRequest) => influencerService.apply(data),
  });

  // Course mutations
  const createCourseMutation = useMutation({
    mutationFn: (data: CourseCreateRequest) => influencerService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.myCourses() });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CourseCreateRequest> }) =>
      influencerService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.myCourses() });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => influencerService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.myCourses() });
    },
  });

  // Party mutations
  const createPartyMutation = useMutation({
    mutationFn: (data: PartyCreateRequest) => influencerService.createParty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.myParties() });
    },
  });

  const updatePartyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PartyCreateRequest> }) =>
      influencerService.updateParty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.myParties() });
    },
  });

  const deletePartyMutation = useMutation({
    mutationFn: (id: string) => influencerService.deleteParty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.myParties() });
    },
  });

  // Application mutations
  const selectApplicationMutation = useMutation({
    mutationFn: (applicationId: string) => influencerService.selectApplication(applicationId),
  });

  const rejectApplicationMutation = useMutation({
    mutationFn: (applicationId: string) => influencerService.rejectApplication(applicationId),
  });

  // Recruitment mutations
  const closeCourseRecruitmentMutation = useMutation({
    mutationFn: (courseId: string) => influencerService.closeCourseRecruitment(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.myCourses() });
    },
  });

  const closePartyRecruitmentMutation = useMutation({
    mutationFn: (partyId: string) => influencerService.closePartyRecruitment(partyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.myParties() });
    },
  });

  // Expense mutations
  const requestExpenseMutation = useMutation({
    mutationFn: ({ courseId, amount }: { courseId: string; amount: number }) =>
      influencerService.requestExpense(courseId, amount),
  });

  const addNbangItemMutation = useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: NbangItemRequest }) =>
      influencerService.addNbangItem(courseId, data),
  });

  // Announcement mutations
  const createCourseAnnouncementMutation = useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: AnnouncementCreateRequest }) =>
      influencerService.createCourseAnnouncement(courseId, data),
  });

  const createPartyAnnouncementMutation = useMutation({
    mutationFn: ({ partyId, data }: { partyId: string; data: AnnouncementCreateRequest }) =>
      influencerService.createPartyAnnouncement(partyId, data),
  });

  return {
    // Apply
    applyAsInfluencer: applyMutation.mutateAsync,
    isApplying: applyMutation.isPending,

    // Course
    createCourse: createCourseMutation.mutateAsync,
    isCreatingCourse: createCourseMutation.isPending,
    updateCourse: updateCourseMutation.mutateAsync,
    isUpdatingCourse: updateCourseMutation.isPending,
    deleteCourse: deleteCourseMutation.mutateAsync,
    isDeletingCourse: deleteCourseMutation.isPending,

    // Party
    createParty: createPartyMutation.mutateAsync,
    isCreatingParty: createPartyMutation.isPending,
    updateParty: updatePartyMutation.mutateAsync,
    isUpdatingParty: updatePartyMutation.isPending,
    deleteParty: deletePartyMutation.mutateAsync,
    isDeletingParty: deletePartyMutation.isPending,

    // Applications
    selectApplication: selectApplicationMutation.mutateAsync,
    isSelectingApplication: selectApplicationMutation.isPending,
    rejectApplication: rejectApplicationMutation.mutateAsync,
    isRejectingApplication: rejectApplicationMutation.isPending,

    // Recruitment
    closeCourseRecruitment: closeCourseRecruitmentMutation.mutateAsync,
    isClosingCourseRecruitment: closeCourseRecruitmentMutation.isPending,
    closePartyRecruitment: closePartyRecruitmentMutation.mutateAsync,
    isClosingPartyRecruitment: closePartyRecruitmentMutation.isPending,

    // Expenses
    requestExpense: requestExpenseMutation.mutateAsync,
    isRequestingExpense: requestExpenseMutation.isPending,
    addNbangItem: addNbangItemMutation.mutateAsync,
    isAddingNbangItem: addNbangItemMutation.isPending,

    // Announcements
    createCourseAnnouncement: createCourseAnnouncementMutation.mutateAsync,
    isCreatingCourseAnnouncement: createCourseAnnouncementMutation.isPending,
    createPartyAnnouncement: createPartyAnnouncementMutation.mutateAsync,
    isCreatingPartyAnnouncement: createPartyAnnouncementMutation.isPending,
  };
};

export default useInfluencerProfile;
