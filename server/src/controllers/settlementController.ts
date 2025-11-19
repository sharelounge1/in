import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../types';
import { settlementService } from '../services/settlementService';
import {
  successResponse,
  createdResponse,
  paginatedResponse,
  parsePagination,
} from '../utils/response';
import { asyncHandler, NotFoundError, ForbiddenError } from '../middlewares/errorHandler';
import { supabaseAdmin } from '../config/supabase';

// Validation schemas
const calculateSettlementSchema = z.object({
  reference_type: z.enum(['course', 'party']),
  reference_id: z.string().uuid('올바른 참조 ID가 아닙니다'),
});

const processSettlementSchema = z.object({
  receipt_url: z.string().url().optional(),
  notes: z.string().optional(),
});

/**
 * Settlement Controller for Influencers
 */
export const settlementController = {
  /**
   * GET /settlements
   * Get influencer's settlements
   */
  getSettlements: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;

    // Get influencer profile ID
    const { data: influencer } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!influencer) {
      throw new ForbiddenError('인플루언서 프로필을 찾을 수 없습니다');
    }

    const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
    const { status, from_date, to_date } = req.query;

    const { items, total } = await settlementService.getInfluencerSettlements(influencer.id, {
      page,
      limit,
      status: status as string | undefined,
      fromDate: from_date as string | undefined,
      toDate: to_date as string | undefined,
    });

    paginatedResponse(res, items, total, page, limit);
  }),

  /**
   * GET /settlements/summary
   * Get influencer's settlement summary
   */
  getSummary: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;

    // Get influencer profile ID
    const { data: influencer } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!influencer) {
      throw new ForbiddenError('인플루언서 프로필을 찾을 수 없습니다');
    }

    const summary = await settlementService.getInfluencerSummary(influencer.id);

    successResponse(res, {
      total_gross: summary.totalGross,
      total_fees: summary.totalFees,
      total_net: summary.totalNet,
      pending_amount: summary.pendingAmount,
      completed_count: summary.completedCount,
      pending_count: summary.pendingCount,
    });
  }),

  /**
   * GET /settlements/:id
   * Get settlement detail
   */
  getDetail: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    // Get influencer profile ID
    const { data: influencer } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!influencer) {
      throw new ForbiddenError('인플루언서 프로필을 찾을 수 없습니다');
    }

    const breakdown = await settlementService.getDetail(id, influencer.id);

    successResponse(res, {
      id: breakdown.settlement.id,
      settlement_type: breakdown.settlement.settlement_type,
      reference_type: breakdown.settlement.reference_type,
      reference_id: breakdown.settlement.reference_id,
      gross_amount: breakdown.totalRevenue,
      platform_fee: breakdown.platformFee,
      pg_fee: breakdown.pgFee,
      net_amount: breakdown.netPayout,
      fee_rate: breakdown.settlement.fee_rate,
      status: breakdown.settlement.status,
      bank_name: breakdown.settlement.bank_name,
      bank_account: breakdown.settlement.bank_account,
      account_holder: breakdown.settlement.account_holder,
      calculated_at: breakdown.settlement.calculated_at,
      processed_at: breakdown.settlement.processed_at,
      completed_at: breakdown.settlement.completed_at,
      receipt_url: breakdown.settlement.receipt_url,
      participants: breakdown.participants,
    });
  }),

  /**
   * POST /settlements/calculate
   * Calculate settlement for a course/party (influencer can trigger this)
   */
  calculate: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;
    const validatedData = calculateSettlementSchema.parse(req.body);

    // Get influencer profile ID
    const { data: influencer } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!influencer) {
      throw new ForbiddenError('인플루언서 프로필을 찾을 수 없습니다');
    }

    // Verify the course/party belongs to this influencer
    const tableName = validatedData.reference_type === 'course' ? 'courses' : 'parties';
    const { data: reference } = await supabaseAdmin
      .from(tableName)
      .select('influencer_id')
      .eq('id', validatedData.reference_id)
      .single();

    if (!reference || reference.influencer_id !== influencer.id) {
      throw new ForbiddenError('정산 권한이 없습니다');
    }

    const settlement = await settlementService.calculate(
      validatedData.reference_type,
      validatedData.reference_id
    );

    createdResponse(res, {
      settlement_id: settlement.id,
      gross_amount: settlement.gross_amount,
      fee_rate: settlement.fee_rate,
      fee_amount: settlement.fee_amount,
      pg_fee_amount: settlement.pg_fee_amount,
      net_amount: settlement.net_amount,
      status: settlement.status,
      message: '정산이 계산되었습니다',
    });
  }),
};

/**
 * Admin Settlement Controller
 */
export const adminSettlementController = {
  /**
   * GET /admin/settlements
   * Get all settlements (admin)
   */
  getAll: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
    const { status, from_date, to_date } = req.query;

    const { items, total } = await settlementService.getAdminSettlements({
      page,
      limit,
      status: status as string | undefined,
      fromDate: from_date as string | undefined,
      toDate: to_date as string | undefined,
    });

    paginatedResponse(res, items, total, page, limit);
  }),

  /**
   * GET /admin/settlements/:id
   * Get settlement detail (admin)
   */
  getDetail: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const breakdown = await settlementService.getDetail(id);

    successResponse(res, {
      id: breakdown.settlement.id,
      influencer_id: breakdown.settlement.influencer_id,
      settlement_type: breakdown.settlement.settlement_type,
      reference_type: breakdown.settlement.reference_type,
      reference_id: breakdown.settlement.reference_id,
      gross_amount: breakdown.totalRevenue,
      platform_fee: breakdown.platformFee,
      pg_fee: breakdown.pgFee,
      net_amount: breakdown.netPayout,
      fee_rate: breakdown.settlement.fee_rate,
      status: breakdown.settlement.status,
      bank_name: breakdown.settlement.bank_name,
      bank_account: breakdown.settlement.bank_account,
      account_holder: breakdown.settlement.account_holder,
      calculated_at: breakdown.settlement.calculated_at,
      processed_at: breakdown.settlement.processed_at,
      completed_at: breakdown.settlement.completed_at,
      receipt_url: breakdown.settlement.receipt_url,
      notes: breakdown.settlement.notes,
      participants: breakdown.participants,
    });
  }),

  /**
   * PUT /admin/settlements/:id/approve
   * Approve settlement (mark as processing)
   */
  approve: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const settlement = await settlementService.process(id);

    successResponse(res, {
      settlement_id: settlement.id,
      status: settlement.status,
      processed_at: settlement.processed_at,
      message: '정산이 승인되었습니다',
    });
  }),

  /**
   * PUT /admin/settlements/:id/complete
   * Complete settlement (mark as completed)
   */
  complete: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const validatedData = processSettlementSchema.parse(req.body);

    const settlement = await settlementService.complete(
      id,
      validatedData.receipt_url,
      validatedData.notes
    );

    successResponse(res, {
      settlement_id: settlement.id,
      status: settlement.status,
      completed_at: settlement.completed_at,
      receipt_url: settlement.receipt_url,
      message: '정산이 완료되었습니다',
    });
  }),

  /**
   * POST /admin/settlements/:id/process
   * Process settlement (legacy endpoint)
   */
  process: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const settlement = await settlementService.process(id);

    successResponse(res, {
      settlement_id: settlement.id,
      status: settlement.status,
      processed_at: settlement.processed_at,
      message: '정산 처리가 시작되었습니다',
    });
  }),

  /**
   * POST /admin/settlements/calculate
   * Admin can calculate settlement for any course/party
   */
  calculate: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = calculateSettlementSchema.parse(req.body);

    const settlement = await settlementService.calculate(
      validatedData.reference_type,
      validatedData.reference_id
    );

    createdResponse(res, {
      settlement_id: settlement.id,
      gross_amount: settlement.gross_amount,
      fee_rate: settlement.fee_rate,
      fee_amount: settlement.fee_amount,
      pg_fee_amount: settlement.pg_fee_amount,
      net_amount: settlement.net_amount,
      status: settlement.status,
      message: '정산이 계산되었습니다',
    });
  }),
};

export default settlementController;
