import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  UploadResponse,
  StorageFolder,
} from '@/types';

export const storageService = {
  /**
   * Upload an image
   */
  upload: async (file: File, folder: StorageFolder): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await apiClient.post<ApiResponse<UploadResponse>>('/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Upload multiple images
   */
  uploadMultiple: async (files: File[], folder: StorageFolder): Promise<ApiResponse<UploadResponse>[]> => {
    const uploadPromises = files.map((file) => storageService.upload(file, folder));
    return Promise.all(uploadPromises);
  },
};

export default storageService;
