import { Router, Response } from 'express';
import { successResponse, errorResponse, createdResponse } from '../utils/response';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

/**
 * POST /announcements/:id/comments
 * 공지사항에 댓글 작성
 */
router.post('/:id/comments', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '댓글 내용을 입력해주세요', 400);
    }

    // TODO: Verify user is participant of the course this announcement belongs to
    // TODO: Create comment
    // const comment = await commentService.create(id, req.user.id, content);

    createdResponse(res, {
      id: 'comment-uuid',
      content,
      created_at: new Date().toISOString(),
      user: {
        id: req.user.id,
        nickname: req.user.name || '',
        avatar_url: req.user.avatarUrl || '',
      },
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '댓글 작성 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /announcements/:id/comments
 * 공지사항 댓글 목록 조회
 */
router.get('/:id/comments', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Verify user is participant
    // TODO: Fetch comments
    // const comments = await commentService.getList(id);

    successResponse(res, {
      items: [],
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '댓글 목록 조회 중 오류가 발생했습니다', 500);
  }
});

export default router;
