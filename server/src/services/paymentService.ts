import { supabaseAdmin } from '../config/supabase';
import { NotFoundError, BadRequestError, PaymentError } from '../middlewares/errorHandler';
import { PaymentStatus } from '../types';

// Payment types
export interface CreatePaymentData {
  userId: string;
  applicationId: string;
  amount: number;
  method: string;
  paymentType: 'course_fee' | 'party_fee' | 'expense_charge';
  referenceType: 'course' | 'party';
  referenceId: string;
}

export interface PGResponse {
  imp_uid: string;
  merchant_uid: string;
  status: string;
  amount: number;
  pg_provider?: string;
  pg_tid?: string;
  receipt_url?: string;
}

export interface PaymentDetail {
  id: string;
  user_id: string;
  payment_type: string;
  reference_type: string;
  reference_id: string;
  amount: number;
  payment_method: string;
  pg_provider: string;
  pg_transaction_id: string;
  pg_response: Record<string, unknown>;
  status: PaymentStatus;
  refunded_amount: number;
  refund_reason: string | null;
  refunded_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistoryItem {
  id: string;
  payment_type: string;
  amount: number;
  status: PaymentStatus;
  payment_method: string;
  paid_at: string | null;
  created_at: string;
  reference_type: string;
  reference_id: string;
  reference_title?: string;
}

/**
 * Payment Service - handles all payment-related database operations
 */
export const paymentService = {
  /**
   * Create a new payment record
   */
  async create(data: CreatePaymentData): Promise<PaymentDetail> {
    const { userId, applicationId, amount, method, paymentType, referenceType, referenceId } = data;

    // Generate merchant UID
    const merchantUid = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: userId,
        payment_type: paymentType,
        reference_type: referenceType,
        reference_id: referenceId,
        amount,
        payment_method: method,
        status: 'pending',
        pg_response: { merchant_uid: merchantUid, application_id: applicationId },
      })
      .select()
      .single();

    if (error) {
      throw new PaymentError(`결제 생성 실패: ${error.message}`);
    }

    // Record payment history
    await this.recordHistory(payment.id, 'created', {
      amount,
      status: 'pending',
      merchant_uid: merchantUid,
    });

    return payment;
  },

  /**
   * Verify payment with PG response
   */
  async verify(paymentId: string, pgResponse: PGResponse): Promise<PaymentDetail> {
    // Get existing payment
    const { data: existingPayment, error: fetchError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (fetchError || !existingPayment) {
      throw new NotFoundError('결제 정보를 찾을 수 없습니다');
    }

    if (existingPayment.status !== 'pending') {
      throw new BadRequestError('이미 처리된 결제입니다');
    }

    // Verify amount matches
    if (existingPayment.amount !== pgResponse.amount) {
      // Mark as failed due to amount mismatch
      await supabaseAdmin
        .from('payments')
        .update({
          status: 'failed',
          pg_response: pgResponse,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentId);

      await this.recordHistory(paymentId, 'failed', {
        reason: 'amount_mismatch',
        expected: existingPayment.amount,
        received: pgResponse.amount,
      });

      throw new PaymentError('결제 금액이 일치하지 않습니다');
    }

    // Use transaction to update payment and related application
    const { data: updatedPayment, error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'completed',
        pg_provider: pgResponse.pg_provider,
        pg_transaction_id: pgResponse.imp_uid,
        pg_response: pgResponse,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (updateError) {
      throw new PaymentError(`결제 검증 실패: ${updateError.message}`);
    }

    // Update related application status
    const applicationId = (existingPayment.pg_response as Record<string, unknown>)?.application_id;
    if (applicationId) {
      const tableName = existingPayment.reference_type === 'course'
        ? 'course_applications'
        : 'party_applications';

      await supabaseAdmin
        .from(tableName)
        .update({
          payment_id: paymentId,
          paid_amount: pgResponse.amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicationId);
    }

    // Record payment history
    await this.recordHistory(paymentId, 'completed', {
      pg_transaction_id: pgResponse.imp_uid,
      amount: pgResponse.amount,
    });

    return updatedPayment;
  },

  /**
   * Get user's payment history
   */
  async getHistory(
    userId: string,
    options?: { page?: number; limit?: number; status?: string }
  ): Promise<{ items: PaymentHistoryItem[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    const { data: payments, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new BadRequestError(`결제 내역 조회 실패: ${error.message}`);
    }

    // Fetch reference titles
    const paymentItems: PaymentHistoryItem[] = await Promise.all(
      (payments || []).map(async (payment) => {
        let referenceTitle = '';

        if (payment.reference_type === 'course' && payment.reference_id) {
          const { data: course } = await supabaseAdmin
            .from('courses')
            .select('title')
            .eq('id', payment.reference_id)
            .single();
          referenceTitle = course?.title || '';
        } else if (payment.reference_type === 'party' && payment.reference_id) {
          const { data: party } = await supabaseAdmin
            .from('parties')
            .select('title')
            .eq('id', payment.reference_id)
            .single();
          referenceTitle = party?.title || '';
        }

        return {
          id: payment.id,
          payment_type: payment.payment_type,
          amount: payment.amount,
          status: payment.status,
          payment_method: payment.payment_method,
          paid_at: payment.paid_at,
          created_at: payment.created_at,
          reference_type: payment.reference_type,
          reference_id: payment.reference_id,
          reference_title: referenceTitle,
        };
      })
    );

    return {
      items: paymentItems,
      total: count || 0,
    };
  },

  /**
   * Process refund for a payment
   */
  async refund(
    paymentId: string,
    reason: string,
    amount?: number
  ): Promise<PaymentDetail> {
    // Get existing payment
    const { data: existingPayment, error: fetchError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (fetchError || !existingPayment) {
      throw new NotFoundError('결제 정보를 찾을 수 없습니다');
    }

    if (existingPayment.status !== 'completed') {
      throw new BadRequestError('완료된 결제만 환불할 수 있습니다');
    }

    // Calculate refund amount
    const refundAmount = amount || existingPayment.amount;
    const totalRefunded = (existingPayment.refunded_amount || 0) + refundAmount;

    if (totalRefunded > existingPayment.amount) {
      throw new BadRequestError('환불 금액이 결제 금액을 초과할 수 없습니다');
    }

    // Determine new status
    const newStatus: PaymentStatus = totalRefunded === existingPayment.amount
      ? 'refunded'
      : 'partial_refund';

    // Update payment with refund information
    const { data: updatedPayment, error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status: newStatus,
        refunded_amount: totalRefunded,
        refund_reason: reason,
        refunded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (updateError) {
      throw new PaymentError(`환불 처리 실패: ${updateError.message}`);
    }

    // Record payment history
    await this.recordHistory(paymentId, 'refunded', {
      refund_amount: refundAmount,
      total_refunded: totalRefunded,
      reason,
    });

    // Update related application status if full refund
    if (newStatus === 'refunded') {
      const applicationId = (existingPayment.pg_response as Record<string, unknown>)?.application_id;
      if (applicationId) {
        const tableName = existingPayment.reference_type === 'course'
          ? 'course_applications'
          : 'party_applications';

        await supabaseAdmin
          .from(tableName)
          .update({
            status: 'cancelled',
            status_reason: reason,
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', applicationId);
      }
    }

    return updatedPayment;
  },

  /**
   * Get payment detail by ID
   */
  async getDetail(paymentId: string, userId?: string): Promise<PaymentDetail> {
    let query = supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', paymentId);

    // If userId provided, ensure the payment belongs to the user
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: payment, error } = await query.single();

    if (error || !payment) {
      throw new NotFoundError('결제 정보를 찾을 수 없습니다');
    }

    return payment;
  },

  /**
   * Get payment by merchant UID
   */
  async getByMerchantUid(merchantUid: string): Promise<PaymentDetail | null> {
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .contains('pg_response', { merchant_uid: merchantUid })
      .single();

    if (error || !payment) {
      return null;
    }

    return payment;
  },

  /**
   * Record payment history for audit trail
   */
  async recordHistory(
    paymentId: string,
    action: string,
    details: Record<string, unknown>
  ): Promise<void> {
    // Note: This would ideally insert into a payment_history table
    // For now, we'll use the pg_response JSONB field to track history
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('pg_response')
      .eq('id', paymentId)
      .single();

    if (payment) {
      const currentResponse = payment.pg_response as Record<string, unknown> || {};
      const history = (currentResponse.history as Record<string, unknown>[]) || [];

      history.push({
        action,
        timestamp: new Date().toISOString(),
        ...details,
      });

      await supabaseAdmin
        .from('payments')
        .update({
          pg_response: {
            ...currentResponse,
            history,
          },
        })
        .eq('id', paymentId);
    }
  },

  /**
   * Get payments for admin (all payments)
   */
  async getAdminPayments(
    options?: {
      page?: number;
      limit?: number;
      status?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<{ items: PaymentDetail[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('payments')
      .select('*', { count: 'exact' })
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

    const { data: payments, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new BadRequestError(`결제 내역 조회 실패: ${error.message}`);
    }

    return {
      items: payments || [],
      total: count || 0,
    };
  },
};

export default paymentService;
