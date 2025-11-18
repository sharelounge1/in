import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

// Success response helper
export const successResponse = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };

  return res.status(statusCode).json(response);
};

// Created response (201)
export const createdResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Created successfully'
): Response => {
  return successResponse(res, data, message, 201);
};

// No content response (204)
export const noContentResponse = (res: Response): Response => {
  return res.status(204).send();
};

// Paginated response helper
export const paginatedResponse = <T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  limit: number
): Response => {
  const totalPages = Math.ceil(total / limit);

  const response: ApiResponse<PaginatedResponse<T>> = {
    success: true,
    data: {
      items,
      total,
      page,
      limit,
      totalPages,
    },
  };

  return res.status(200).json(response);
};

// Error response helper (for manual error responses)
export const errorResponse = (
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: unknown
): Response => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  });
};

// Parse pagination params from query
export const parsePagination = (
  query: { page?: string; limit?: string },
  defaultLimit: number = 20,
  maxLimit: number = 100
): { page: number; limit: number; offset: number } => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const requestedLimit = parseInt(query.limit || String(defaultLimit), 10);
  const limit = Math.min(Math.max(1, requestedLimit), maxLimit);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

// Format currency for Korean Won
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

// Calculate settlement amounts
export const calculateSettlement = (
  grossAmount: number,
  feeRate: number
): { grossAmount: number; feeAmount: number; netAmount: number } => {
  const feeAmount = Math.floor(grossAmount * (feeRate / 100));
  const netAmount = grossAmount - feeAmount;

  return {
    grossAmount,
    feeAmount,
    netAmount,
  };
};
