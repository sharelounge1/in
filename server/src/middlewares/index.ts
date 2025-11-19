// Export all middleware modules

export {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  PaymentError,
} from './errorHandler';

export {
  authenticate,
  optionalAuth,
  requireRole,
  requireInfluencer,
  requireAdmin,
  AuthenticatedRequest,
} from './auth.middleware';

export {
  validate,
  validateId,
  validatePagination,
  // Schemas
  emailSchema,
  passwordSchema,
  phoneSchema,
  uuidSchema,
  paginationSchema,
  dateSchema,
  amountSchema,
  ageSchema,
  genderSchema,
  urlSchema,
  instagramUrlSchema,
  ratingSchema,
  // Composite schemas
  userRegistrationSchema,
  userLoginSchema,
  profileUpdateSchema,
  courseApplicationSchema,
  courseSearchSchema,
  reviewSchema,
  bankAccountSchema,
  inquirySchema,
  Schemas,
} from './validate';
