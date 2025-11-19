import { supabaseAdmin } from '../config/supabase';
import { NotFoundError, BadRequestError } from '../middlewares/errorHandler';
import { SettlementStatus } from '../types';

// Settlement types
export interface SettlementDetail {
  id: string;
  influencer_id: string;
  settlement_type: string;
  reference_type: string;
  reference_id: string;
  gross_amount: number;
  fee_rate: number;
  fee_amount: number;
  pg_fee_amount: number;
  net_amount: number;
  status: SettlementStatus;
  bank_name: string | null;
  bank_account: string | null;
  account_holder: string | null;
  calculated_at: string;
  processed_at: string | null;
  completed_at: string | null;
  receipt_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SettlementListItem extends SettlementDetail {
  influencer_name?: string;
  reference_title?: string;
}

export interface SettlementBreakdown {
  settlement: SettlementDetail;
  participants: {
    id: string;
    name: string;
    paid_amount: number;
    payment_date: string;
  }[];
  totalRevenue: number;
  platformFee: number;
  pgFee: number;
  netPayout: number;
}

/**
 * Settlement Service - handles all settlement-related database operations
 */
export const settlementService = {
  /**
   * Calculate settlement for a course or party
   */
  async calculate(
    referenceType: 'course' | 'party',
    referenceId: string
  ): Promise<SettlementDetail> {
    // Get reference data (course or party)
    const tableName = referenceType === 'course' ? 'courses' : 'parties';
    const { data: reference, error: refError } = await supabaseAdmin
      .from(tableName)
      .select('*, influencer_profiles!inner(*)')
      .eq('id', referenceId)
      .single();

    if (refError || !reference) {
      throw new NotFoundError(`${referenceType === 'course' ? '코스' : '파티'}를 찾을 수 없습니다`);
    }

    // Check if settlement already exists
    const { data: existingSettlement } = await supabaseAdmin
      .from('settlements')
      .select('*')
      .eq('reference_type', referenceType)
      .eq('reference_id', referenceId)
      .single();

    if (existingSettlement) {
      throw new BadRequestError('이미 정산이 생성되었습니다');
    }

    // Get confirmed payments
    const applicationTable = referenceType === 'course'
      ? 'course_applications'
      : 'party_applications';
    const referenceColumn = referenceType === 'course' ? 'course_id' : 'party_id';

    const { data: applications, error: appError } = await supabaseAdmin
      .from(applicationTable)
      .select('paid_amount')
      .eq(referenceColumn, referenceId)
      .eq('status', 'confirmed');

    if (appError) {
      throw new BadRequestError(`신청 정보 조회 실패: ${appError.message}`);
    }

    // Calculate total revenue
    const grossAmount = (applications || []).reduce(
      (sum, app) => sum + (app.paid_amount || 0),
      0
    );

    if (grossAmount === 0) {
      throw new BadRequestError('정산할 금액이 없습니다');
    }

    // Get fee rates
    const { feeRate, pgFeeRate } = await this.getFeeRates(reference.influencer_id, referenceType);

    // Calculate fees (use Math.floor for currency)
    const feeAmount = Math.floor(grossAmount * (feeRate / 100));
    const pgFeeAmount = Math.floor(grossAmount * (pgFeeRate / 100));
    const netAmount = grossAmount - feeAmount - pgFeeAmount;

    // Get influencer bank info
    const influencerProfile = reference.influencer_profiles;

    // Create settlement record
    const { data: settlement, error: createError } = await supabaseAdmin
      .from('settlements')
      .insert({
        influencer_id: reference.influencer_id,
        settlement_type: referenceType,
        reference_type: referenceType,
        reference_id: referenceId,
        gross_amount: grossAmount,
        fee_rate: feeRate,
        fee_amount: feeAmount,
        pg_fee_amount: pgFeeAmount,
        net_amount: netAmount,
        status: 'pending',
        bank_name: influencerProfile?.bank_name,
        bank_account: influencerProfile?.bank_account,
        account_holder: influencerProfile?.account_holder,
        calculated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      throw new BadRequestError(`정산 생성 실패: ${createError.message}`);
    }

    return settlement;
  },

  /**
   * Process settlement (mark as being processed)
   */
  async process(settlementId: string): Promise<SettlementDetail> {
    // Get existing settlement
    const { data: existingSettlement, error: fetchError } = await supabaseAdmin
      .from('settlements')
      .select('*')
      .eq('id', settlementId)
      .single();

    if (fetchError || !existingSettlement) {
      throw new NotFoundError('정산 정보를 찾을 수 없습니다');
    }

    if (existingSettlement.status !== 'pending') {
      throw new BadRequestError('대기 중인 정산만 처리할 수 있습니다');
    }

    // Update settlement status to processing
    const { data: updatedSettlement, error: updateError } = await supabaseAdmin
      .from('settlements')
      .update({
        status: 'processing',
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', settlementId)
      .select()
      .single();

    if (updateError) {
      throw new BadRequestError(`정산 처리 실패: ${updateError.message}`);
    }

    return updatedSettlement;
  },

  /**
   * Complete settlement (mark as completed/paid)
   */
  async complete(
    settlementId: string,
    receiptUrl?: string,
    notes?: string
  ): Promise<SettlementDetail> {
    // Get existing settlement
    const { data: existingSettlement, error: fetchError } = await supabaseAdmin
      .from('settlements')
      .select('*')
      .eq('id', settlementId)
      .single();

    if (fetchError || !existingSettlement) {
      throw new NotFoundError('정산 정보를 찾을 수 없습니다');
    }

    if (existingSettlement.status !== 'processing') {
      throw new BadRequestError('처리 중인 정산만 완료할 수 있습니다');
    }

    // Update settlement status to completed
    const { data: updatedSettlement, error: updateError } = await supabaseAdmin
      .from('settlements')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        receipt_url: receiptUrl || existingSettlement.receipt_url,
        notes: notes || existingSettlement.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', settlementId)
      .select()
      .single();

    if (updateError) {
      throw new BadRequestError(`정산 완료 처리 실패: ${updateError.message}`);
    }

    return updatedSettlement;
  },

  /**
   * Get influencer's settlements
   */
  async getInfluencerSettlements(
    influencerId: string,
    options?: {
      page?: number;
      limit?: number;
      status?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<{ items: SettlementListItem[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('settlements')
      .select('*', { count: 'exact' })
      .eq('influencer_id', influencerId)
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.fromDate) {
      query = query.gte('created_at', options.fromDate);
    }

    if (options?.toDate) {
      query = query.lte('created_at', options.toDate);
    }

    const { data: settlements, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new BadRequestError(`정산 내역 조회 실패: ${error.message}`);
    }

    // Fetch reference titles
    const settlementItems: SettlementListItem[] = await Promise.all(
      (settlements || []).map(async (settlement) => {
        let referenceTitle = '';

        if (settlement.reference_type === 'course' && settlement.reference_id) {
          const { data: course } = await supabaseAdmin
            .from('courses')
            .select('title')
            .eq('id', settlement.reference_id)
            .single();
          referenceTitle = course?.title || '';
        } else if (settlement.reference_type === 'party' && settlement.reference_id) {
          const { data: party } = await supabaseAdmin
            .from('parties')
            .select('title')
            .eq('id', settlement.reference_id)
            .single();
          referenceTitle = party?.title || '';
        }

        return {
          ...settlement,
          reference_title: referenceTitle,
        };
      })
    );

    return {
      items: settlementItems,
      total: count || 0,
    };
  },

  /**
   * Get settlement detail with breakdown
   */
  async getDetail(settlementId: string, influencerId?: string): Promise<SettlementBreakdown> {
    let query = supabaseAdmin
      .from('settlements')
      .select('*')
      .eq('id', settlementId);

    // If influencerId provided, ensure the settlement belongs to the influencer
    if (influencerId) {
      query = query.eq('influencer_id', influencerId);
    }

    const { data: settlement, error } = await query.single();

    if (error || !settlement) {
      throw new NotFoundError('정산 정보를 찾을 수 없습니다');
    }

    // Get participant payment details
    const applicationTable = settlement.reference_type === 'course'
      ? 'course_applications'
      : 'party_applications';
    const referenceColumn = settlement.reference_type === 'course'
      ? 'course_id'
      : 'party_id';

    const { data: applications } = await supabaseAdmin
      .from(applicationTable)
      .select(`
        id,
        applicant_name,
        paid_amount,
        confirmed_at,
        payments!inner(paid_at)
      `)
      .eq(referenceColumn, settlement.reference_id)
      .eq('status', 'confirmed');

    const participants = (applications || []).map((app) => ({
      id: app.id,
      name: app.applicant_name,
      paid_amount: app.paid_amount || 0,
      payment_date: app.confirmed_at || '',
    }));

    return {
      settlement,
      participants,
      totalRevenue: settlement.gross_amount,
      platformFee: settlement.fee_amount,
      pgFee: settlement.pg_fee_amount,
      netPayout: settlement.net_amount,
    };
  },

  /**
   * Get fee rates for an influencer
   */
  async getFeeRates(
    influencerId: string,
    type: 'course' | 'party'
  ): Promise<{ feeRate: number; pgFeeRate: number }> {
    // Get influencer's custom fee rate if exists
    const { data: influencer } = await supabaseAdmin
      .from('influencer_profiles')
      .select('custom_course_fee_rate, custom_party_fee_rate')
      .eq('id', influencerId)
      .single();

    // Get default fee rates from settings
    const { data: defaultCourseFee } = await supabaseAdmin
      .from('admin_settings')
      .select('value')
      .eq('key', 'default_course_fee_rate')
      .single();

    const { data: defaultPartyFee } = await supabaseAdmin
      .from('admin_settings')
      .select('value')
      .eq('key', 'default_party_fee_rate')
      .single();

    const { data: pgFee } = await supabaseAdmin
      .from('admin_settings')
      .select('value')
      .eq('key', 'pg_fee_rate')
      .single();

    // Determine fee rate
    let feeRate: number;
    if (type === 'course') {
      feeRate = influencer?.custom_course_fee_rate
        || parseFloat(defaultCourseFee?.value || '10');
    } else {
      feeRate = influencer?.custom_party_fee_rate
        || parseFloat(defaultPartyFee?.value || '10');
    }

    const pgFeeRate = parseFloat(pgFee?.value || '3.3');

    return { feeRate, pgFeeRate };
  },

  /**
   * Get settlements for admin (all settlements)
   */
  async getAdminSettlements(
    options?: {
      page?: number;
      limit?: number;
      status?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<{ items: SettlementListItem[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('settlements')
      .select(`
        *,
        influencer_profiles!inner(display_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.fromDate) {
      query = query.gte('created_at', options.fromDate);
    }

    if (options?.toDate) {
      query = query.lte('created_at', options.toDate);
    }

    const { data: settlements, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new BadRequestError(`정산 내역 조회 실패: ${error.message}`);
    }

    // Format response with influencer names
    const settlementItems: SettlementListItem[] = (settlements || []).map((settlement) => ({
      ...settlement,
      influencer_name: settlement.influencer_profiles?.display_name,
      influencer_profiles: undefined, // Remove nested object
    }));

    return {
      items: settlementItems,
      total: count || 0,
    };
  },

  /**
   * Get settlement summary for influencer
   */
  async getInfluencerSummary(influencerId: string): Promise<{
    totalGross: number;
    totalFees: number;
    totalNet: number;
    pendingAmount: number;
    completedCount: number;
    pendingCount: number;
  }> {
    const { data: settlements } = await supabaseAdmin
      .from('settlements')
      .select('gross_amount, fee_amount, pg_fee_amount, net_amount, status')
      .eq('influencer_id', influencerId);

    if (!settlements || settlements.length === 0) {
      return {
        totalGross: 0,
        totalFees: 0,
        totalNet: 0,
        pendingAmount: 0,
        completedCount: 0,
        pendingCount: 0,
      };
    }

    const summary = settlements.reduce(
      (acc, s) => {
        if (s.status === 'completed') {
          acc.totalGross += s.gross_amount;
          acc.totalFees += s.fee_amount + s.pg_fee_amount;
          acc.totalNet += s.net_amount;
          acc.completedCount += 1;
        } else if (s.status === 'pending' || s.status === 'processing') {
          acc.pendingAmount += s.net_amount;
          acc.pendingCount += 1;
        }
        return acc;
      },
      {
        totalGross: 0,
        totalFees: 0,
        totalNet: 0,
        pendingAmount: 0,
        completedCount: 0,
        pendingCount: 0,
      }
    );

    return summary;
  },
};

export default settlementService;
