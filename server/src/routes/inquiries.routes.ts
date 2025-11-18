import { Router, Response } from 'express';
import { successResponse, errorResponse, createdResponse } from '../utils/response';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

/**
 * POST /inquiries
 * 1:1 문의 등록
 */
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '제목, 내용, 카테고리를 모두 입력해주세요', 400);
    }

    // TODO: Create inquiry in database
    // const inquiry = await inquiryService.create(req.user.id, {
    //   title,
    //   content,
    //   category,
    // });

    createdResponse(res, {
      id: 'inquiry-uuid',
    }, '문의가 등록되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '문의 등록 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /inquiries
 * 문의 목록 조회 (인플루언서/관리자용)
 */
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, category, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // TODO: Fetch inquiries based on user role
    // - Admin: All inquiries
    // - Influencer: Inquiries related to their courses
    // const inquiries = await inquiryService.getList(req.user, {
    //   status,
    //   category,
    //   page: pageNum,
    //   limit: limitNum,
    // });

    // Placeholder response
    successResponse(res, {
      items: [],
      total: 0,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '문의 목록 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /inquiries/:id
 * 문의 상세 조회
 */
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Fetch inquiry detail
    // const inquiry = await inquiryService.getDetail(id, req.user);

    // Placeholder response
    successResponse(res, {
      id,
      title: '문의 제목',
      content: '문의 내용',
      category: 'payment',
      status: 'pending',
      created_at: new Date().toISOString(),
      user: {
        id: 'user-uuid',
        nickname: '사용자',
        email: 'user@email.com',
      },
      response: null,
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '문의 상세 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /inquiries/:id/respond
 * 문의 답변 등록
 */
router.post('/:id/respond', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '답변 내용을 입력해주세요', 400);
    }

    // TODO: Add response to inquiry
    // 1. Update inquiry with response
    // 2. Update inquiry status to resolved
    // 3. Send notification to user
    // await inquiryService.respond(id, req.user.id, content);

    successResponse(res, null, '답변이 등록되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '답변 등록 중 오류가 발생했습니다', 500);
  }
});

export default router;
