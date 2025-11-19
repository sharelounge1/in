import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commonService } from '@/services/commonService';
import { storageService } from '@/services/storageService';
import type {
  InquiryCreateRequest,
  TravelRecordCreateRequest,
  PaginationParams,
  StorageFolder,
} from '@/types';

// Query keys
export const commonKeys = {
  all: ['common'] as const,
  banners: () => [...commonKeys.all, 'banners'] as const,
  notices: (params?: PaginationParams) => [...commonKeys.all, 'notices', params] as const,
  faqs: () => [...commonKeys.all, 'faqs'] as const,
  myInquiries: (params?: PaginationParams) => [...commonKeys.all, 'myInquiries', params] as const,
  travelRecords: (params?: PaginationParams) => [...commonKeys.all, 'travelRecords', params] as const,
  myTravelRecords: (params?: PaginationParams) => [...commonKeys.all, 'myTravelRecords', params] as const,
};

/**
 * Hook to get banners
 */
export const useBanners = () => {
  return useQuery({
    queryKey: commonKeys.banners(),
    queryFn: () => commonService.getBanners(),
  });
};

/**
 * Hook to get service notices
 */
export const useNotices = (params?: PaginationParams) => {
  return useQuery({
    queryKey: commonKeys.notices(params),
    queryFn: () => commonService.getNotices(params),
  });
};

/**
 * Hook to get FAQs
 */
export const useFAQs = () => {
  return useQuery({
    queryKey: commonKeys.faqs(),
    queryFn: () => commonService.getFAQs(),
  });
};

/**
 * Hook to get my inquiries
 */
export const useMyInquiries = (params?: PaginationParams) => {
  return useQuery({
    queryKey: commonKeys.myInquiries(params),
    queryFn: () => commonService.getMyInquiries(params),
  });
};

/**
 * Hook to get travel records
 */
export const useTravelRecords = (params?: PaginationParams) => {
  return useQuery({
    queryKey: commonKeys.travelRecords(params),
    queryFn: () => commonService.getTravelRecords(params),
  });
};

/**
 * Hook to get my travel records
 */
export const useMyTravelRecords = (params?: PaginationParams) => {
  return useQuery({
    queryKey: commonKeys.myTravelRecords(params),
    queryFn: () => commonService.getMyTravelRecords(params),
  });
};

/**
 * Hook for common mutations
 */
export const useCommonMutations = () => {
  const queryClient = useQueryClient();

  const createInquiryMutation = useMutation({
    mutationFn: (data: InquiryCreateRequest) => commonService.createInquiry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commonKeys.myInquiries() });
    },
  });

  const createTravelRecordMutation = useMutation({
    mutationFn: (data: TravelRecordCreateRequest) => commonService.createTravelRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commonKeys.travelRecords() });
      queryClient.invalidateQueries({ queryKey: commonKeys.myTravelRecords() });
    },
  });

  return {
    createInquiry: createInquiryMutation.mutateAsync,
    isCreatingInquiry: createInquiryMutation.isPending,

    createTravelRecord: createTravelRecordMutation.mutateAsync,
    isCreatingTravelRecord: createTravelRecordMutation.isPending,
  };
};

/**
 * Hook for file upload
 */
export const useUpload = () => {
  const uploadMutation = useMutation({
    mutationFn: ({ file, folder }: { file: File; folder: StorageFolder }) =>
      storageService.upload(file, folder),
  });

  const uploadMultipleMutation = useMutation({
    mutationFn: ({ files, folder }: { files: File[]; folder: StorageFolder }) =>
      storageService.uploadMultiple(files, folder),
  });

  return {
    upload: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,

    uploadMultiple: uploadMultipleMutation.mutateAsync,
    isUploadingMultiple: uploadMultipleMutation.isPending,
  };
};

export default useBanners;
