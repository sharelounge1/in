import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import type {
  CourseListParams,
  CourseApplicationRequest,
} from '@/types';

// Query keys
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (params?: CourseListParams) => [...courseKeys.lists(), params] as const,
  featured: () => [...courseKeys.all, 'featured'] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  myApplications: (type?: string) => [...courseKeys.all, 'myApplications', type] as const,
  myActiveTravels: () => [...courseKeys.all, 'myActiveTravels'] as const,
  announcements: (courseId: string) => [...courseKeys.all, 'announcements', courseId] as const,
  myExpenses: (courseId: string) => [...courseKeys.all, 'myExpenses', courseId] as const,
};

/**
 * Hook to get course list
 */
export const useCourseList = (params?: CourseListParams) => {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => courseService.getList(params),
  });
};

/**
 * Hook to get infinite course list with pagination
 */
export const useCourseListInfinite = (params?: Omit<CourseListParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: courseKeys.list(params),
    queryFn: ({ pageParam = 1 }) => courseService.getList({ ...params, page: pageParam }),
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
 * Hook to get featured courses
 */
export const useFeaturedCourses = () => {
  return useQuery({
    queryKey: courseKeys.featured(),
    queryFn: () => courseService.getFeatured(),
  });
};

/**
 * Hook to get course detail
 */
export const useCourseDetail = (id: string) => {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseService.getDetail(id),
    enabled: !!id,
  });
};

/**
 * Hook to get my applications
 */
export const useMyApplications = (type?: 'course' | 'party') => {
  return useQuery({
    queryKey: courseKeys.myApplications(type),
    queryFn: () => courseService.getMyApplications(type),
  });
};

/**
 * Hook to get my active travels
 */
export const useMyActiveTravels = () => {
  return useQuery({
    queryKey: courseKeys.myActiveTravels(),
    queryFn: () => courseService.getMyActiveTravels(),
  });
};

/**
 * Hook to get course announcements
 */
export const useCourseAnnouncements = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.announcements(courseId),
    queryFn: () => courseService.getAnnouncements(courseId),
    enabled: !!courseId,
  });
};

/**
 * Hook to get my expenses for a course
 */
export const useMyExpenses = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.myExpenses(courseId),
    queryFn: () => courseService.getMyExpenses(courseId),
    enabled: !!courseId,
  });
};

/**
 * Hook for course mutations
 */
export const useCourseMutations = () => {
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: CourseApplicationRequest }) =>
      courseService.apply(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.myApplications() });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: ({ announcementId, content }: { announcementId: string; content: string }) =>
      courseService.createAnnouncementComment(announcementId, content),
  });

  const chargeExpenseMutation = useMutation({
    mutationFn: ({ courseId, amount }: { courseId: string; amount: number }) =>
      courseService.chargeExpense(courseId, amount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.myExpenses(variables.courseId) });
    },
  });

  return {
    apply: applyMutation.mutateAsync,
    isApplying: applyMutation.isPending,
    applyError: applyMutation.error,

    createComment: createCommentMutation.mutateAsync,
    isCreatingComment: createCommentMutation.isPending,

    chargeExpense: chargeExpenseMutation.mutateAsync,
    isChargingExpense: chargeExpenseMutation.isPending,
  };
};

export default useCourseList;
