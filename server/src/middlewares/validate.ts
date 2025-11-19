import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../utils/response';
import { ErrorCodes } from '../config';

// ========================================
// Common Validation Schemas
// ========================================

// Email validation schema
export const emailSchema = z
  .string()
  .email('유효한 이메일 주소를 입력해주세요')
  .max(255, '이메일은 255자를 초과할 수 없습니다')
  .transform((val) => val.toLowerCase().trim());

// Password validation schema
// - Minimum 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
export const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .max(100, '비밀번호는 100자를 초과할 수 없습니다')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    '비밀번호는 대문자, 소문자, 숫자를 각각 하나 이상 포함해야 합니다'
  );

// Korean phone number validation schema
// Formats: 010-1234-5678, 01012345678, 02-123-4567
export const phoneSchema = z
  .string()
  .transform((val) => val.replace(/[\s-]/g, '')) // Remove spaces and dashes
  .refine(
    (val) => /^(01[016789]|02|0[3-9][0-9])\d{7,8}$/.test(val),
    '유효한 전화번호 형식이 아닙니다'
  );

// UUID validation schema
export const uuidSchema = z
  .string()
  .uuid('유효한 UUID 형식이 아닙니다');

// Pagination validation schema
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, '페이지는 1 이상이어야 합니다'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((val) => val > 0 && val <= 100, '페이지 크기는 1~100 사이여야 합니다'),
});

// Date validation schema (YYYY-MM-DD format)
export const dateSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    '날짜 형식은 YYYY-MM-DD여야 합니다'
  )
  .refine(
    (val) => !isNaN(Date.parse(val)),
    '유효한 날짜가 아닙니다'
  );

// Price/Amount validation schema (non-negative integer)
export const amountSchema = z
  .number()
  .int('금액은 정수여야 합니다')
  .nonnegative('금액은 0 이상이어야 합니다');

// Age validation schema
export const ageSchema = z
  .number()
  .int()
  .min(1, '나이는 1세 이상이어야 합니다')
  .max(150, '유효한 나이를 입력해주세요');

// Gender validation schema
export const genderSchema = z.enum(['male', 'female', 'other'], {
  errorMap: () => ({ message: '성별은 male, female, other 중 하나여야 합니다' }),
});

// URL validation schema
export const urlSchema = z
  .string()
  .url('유효한 URL 형식이 아닙니다')
  .max(500, 'URL은 500자를 초과할 수 없습니다');

// Instagram URL validation schema
export const instagramUrlSchema = z
  .string()
  .refine(
    (val) => {
      if (!val) return true;
      return /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/.test(val);
    },
    '유효한 인스타그램 URL 형식이 아닙니다'
  );

// Rating validation schema (1-5)
export const ratingSchema = z
  .number()
  .int()
  .min(1, '평점은 1 이상이어야 합니다')
  .max(5, '평점은 5 이하여야 합니다');

// ========================================
// Validation Middleware
// ========================================

interface ValidationTarget {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Validation middleware using Zod schemas
 * @param schemas - Object containing schemas for body, query, and/or params
 * @returns Express middleware function
 *
 * @example
 * const createCourseSchema = z.object({
 *   title: z.string().min(1),
 *   price: z.number().positive(),
 * });
 *
 * router.post('/courses', validate({ body: createCourseSchema }), controller.create);
 */
export const validate = (schemas: ValidationTarget) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate body
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      // Validate query parameters
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }

      // Validate URL parameters
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        errorResponse(
          res,
          ErrorCodes.VALIDATION_001,
          '입력값 검증에 실패했습니다',
          422,
          formattedErrors
        );
        return;
      }

      next(error);
    }
  };
};

/**
 * Validate UUID parameter middleware
 * Convenience middleware for validating :id parameter
 */
export const validateId = validate({
  params: z.object({
    id: uuidSchema,
  }),
});

/**
 * Validate pagination query parameters
 * Adds page and limit to req.query
 */
export const validatePagination = validate({
  query: paginationSchema,
});

// ========================================
// Composite Schemas
// ========================================

// User registration schema
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다').max(100),
  phone: phoneSchema.optional(),
});

// User login schema
export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  nickname: z.string().min(2).max(50).optional(),
  phone: phoneSchema.optional(),
  bio: z.string().max(500).optional(),
  instagramUrl: instagramUrlSchema.optional(),
  gender: genderSchema.optional(),
  birthDate: dateSchema.optional(),
});

// Course application schema
export const courseApplicationSchema = z.object({
  applicantName: z.string().min(2, '이름은 최소 2자 이상이어야 합니다').max(100),
  phone: phoneSchema,
  instagramUrl: instagramUrlSchema,
  age: ageSchema.optional(),
  gender: genderSchema.optional(),
  introduction: z.string().max(1000, '자기소개는 1000자를 초과할 수 없습니다').optional(),
});

// Course search/filter schema
export const courseSearchSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
  country: z.string().optional(),
  city: z.string().optional(),
  status: z.enum(['draft', 'recruiting', 'closed', 'ongoing', 'completed', 'cancelled']).optional(),
  minPrice: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  maxPrice: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  sortBy: z.enum(['price', 'startDate', 'createdAt', 'popularity']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Review schema
export const reviewSchema = z.object({
  rating: ratingSchema,
  content: z.string().max(2000, '후기는 2000자를 초과할 수 없습니다').optional(),
});

// Bank account schema for influencer settlement
export const bankAccountSchema = z.object({
  bankName: z.string().min(1, '은행명을 입력해주세요').max(50),
  bankAccount: z.string()
    .min(10, '계좌번호는 최소 10자 이상이어야 합니다')
    .max(30, '계좌번호는 30자를 초과할 수 없습니다')
    .regex(/^\d+$/, '계좌번호는 숫자만 입력 가능합니다'),
  accountHolder: z.string().min(2, '예금주명은 최소 2자 이상이어야 합니다').max(100),
});

// Inquiry schema
export const inquirySchema = z.object({
  title: z.string().min(5, '제목은 최소 5자 이상이어야 합니다').max(200),
  content: z.string().min(10, '내용은 최소 10자 이상이어야 합니다').max(5000),
  courseId: uuidSchema.optional(),
});

// Export all schemas as a namespace for convenience
export const Schemas = {
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  uuid: uuidSchema,
  pagination: paginationSchema,
  date: dateSchema,
  amount: amountSchema,
  age: ageSchema,
  gender: genderSchema,
  url: urlSchema,
  instagramUrl: instagramUrlSchema,
  rating: ratingSchema,
  userRegistration: userRegistrationSchema,
  userLogin: userLoginSchema,
  profileUpdate: profileUpdateSchema,
  courseApplication: courseApplicationSchema,
  courseSearch: courseSearchSchema,
  review: reviewSchema,
  bankAccount: bankAccountSchema,
  inquiry: inquirySchema,
};
