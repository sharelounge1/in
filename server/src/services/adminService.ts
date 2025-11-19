import { supabaseAdmin } from '../config/supabase';
import { PaginationQuery } from '../types';

// Types for admin service
export interface AdminDashboardStats {
  totalUsers: number;
  newUsersToday: number;
  totalInfluencers: number;
  pendingInfluencers: number;
  totalCourses: number;
  activeCourses: number;
  totalRevenue: number;
  pendingSettlements: number;
  completedSettlements: number;
}

export interface UserFilters extends PaginationQuery {
  role?: string;
  status?: string;
  search?: string;
}

export interface PaymentFilters extends PaginationQuery {
  status?: string;
  paymentType?: string;
  fromDate?: string;
  toDate?: string;
}

export interface SettlementFilters extends PaginationQuery {
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface InquiryFilters extends PaginationQuery {
  status?: string;
  category?: string;
}

export interface InquiryResponse {
  content: string;
}

// Admin Service
export const adminService = {
  /**
   * Get admin dashboard statistics
   */
  async getDashboard(): Promise<AdminDashboardStats> {
    // Get total users count
    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get new users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: newUsersToday } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Get total influencers
    const { count: totalInfluencers } = await supabaseAdmin
      .from('influencer_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'verified');

    // Get pending influencer applications
    const { count: pendingInfluencers } = await supabaseAdmin
      .from('influencer_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'pending');

    // Get total courses
    const { count: totalCourses } = await supabaseAdmin
      .from('courses')
      .select('*', { count: 'exact', head: true });

    // Get active courses
    const { count: activeCourses } = await supabaseAdmin
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .in('status', ['recruiting', 'ongoing']);

    // Get payment statistics
    const { data: payments } = await supabaseAdmin
      .from('payments')
      .select('amount, status')
      .eq('status', 'completed');

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    // Get settlement statistics
    const { data: settlements } = await supabaseAdmin
      .from('settlements')
      .select('net_amount, status');

    let pendingSettlements = 0;
    let completedSettlements = 0;

    settlements?.forEach((s) => {
      if (s.status === 'pending') {
        pendingSettlements += s.net_amount || 0;
      } else if (s.status === 'completed') {
        completedSettlements += s.net_amount || 0;
      }
    });

    return {
      totalUsers: totalUsers || 0,
      newUsersToday: newUsersToday || 0,
      totalInfluencers: totalInfluencers || 0,
      pendingInfluencers: pendingInfluencers || 0,
      totalCourses: totalCourses || 0,
      activeCourses: activeCourses || 0,
      totalRevenue,
      pendingSettlements,
      completedSettlements,
    };
  },

  /**
   * Get all users with pagination and filters
   */
  async getUsers(
    filters: UserFilters
  ): Promise<{ items: unknown[]; total: number }> {
    const { page = 1, limit = 20, role, status, search } = filters;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,nickname.ilike.%${search}%`);
    }

    const { data, count, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return {
      items: data || [],
      total: count || 0,
    };
  },

  /**
   * Get all influencers with pagination and filters
   */
  async getInfluencers(
    filters: UserFilters
  ): Promise<{ items: unknown[]; total: number }> {
    const { page = 1, limit = 20, status, search } = filters;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('influencer_profiles')
      .select(`
        *,
        profiles:user_id (
          email,
          name,
          nickname,
          phone
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('verification_status', status);
    }

    if (search) {
      query = query.ilike('display_name', `%${search}%`);
    }

    const { data, count, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return {
      items: data || [],
      total: count || 0,
    };
  },

  /**
   * Update user status (activate/suspend)
   */
  async updateUserStatus(
    userId: string,
    status: 'active' | 'suspended'
  ): Promise<void> {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ status })
      .eq('id', userId);

    if (error) {
      throw error;
    }
  },

  /**
   * Get all payments with pagination and filters
   */
  async getPayments(
    filters: PaymentFilters
  ): Promise<{ items: unknown[]; total: number }> {
    const { page = 1, limit = 20, status, paymentType, fromDate, toDate } = filters;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('payments')
      .select(`
        *,
        profiles:user_id (
          email,
          name,
          nickname
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (paymentType) {
      query = query.eq('payment_type', paymentType);
    }

    if (fromDate) {
      query = query.gte('created_at', fromDate);
    }

    if (toDate) {
      query = query.lte('created_at', toDate);
    }

    const { data, count, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return {
      items: data || [],
      total: count || 0,
    };
  },

  /**
   * Get all settlements with pagination and filters
   */
  async getSettlements(
    filters: SettlementFilters
  ): Promise<{ items: unknown[]; total: number }> {
    const { page = 1, limit = 20, status, fromDate, toDate } = filters;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('settlements')
      .select(`
        *,
        influencer_profiles:influencer_id (
          display_name,
          bank_name,
          bank_account,
          account_holder
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (fromDate) {
      query = query.gte('created_at', fromDate);
    }

    if (toDate) {
      query = query.lte('created_at', toDate);
    }

    const { data, count, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return {
      items: data || [],
      total: count || 0,
    };
  },

  /**
   * Process settlement payout
   */
  async processSettlement(settlementId: string): Promise<void> {
    // Get settlement details
    const { data: settlement, error: fetchError } = await supabaseAdmin
      .from('settlements')
      .select('*')
      .eq('id', settlementId)
      .single();

    if (fetchError || !settlement) {
      throw new Error('SETTLEMENT_NOT_FOUND');
    }

    if (settlement.status !== 'pending') {
      throw new Error('SETTLEMENT_ALREADY_PROCESSED');
    }

    // Update settlement status to processing
    const { error: updateError } = await supabaseAdmin
      .from('settlements')
      .update({
        status: 'processing',
        processed_at: new Date().toISOString(),
      })
      .eq('id', settlementId);

    if (updateError) {
      throw updateError;
    }

    // In production, this would integrate with bank transfer API
    // For now, we'll mark it as completed after a simulated process

    // Mark as completed
    const { error: completeError } = await supabaseAdmin
      .from('settlements')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', settlementId);

    if (completeError) {
      throw completeError;
    }
  },

  /**
   * Get support inquiries with pagination and filters
   */
  async getInquiries(
    filters: InquiryFilters
  ): Promise<{ items: unknown[]; total: number }> {
    const { page = 1, limit = 20, status, category } = filters;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('inquiries')
      .select(`
        *,
        profiles:user_id (
          email,
          name,
          nickname
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, count, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return {
      items: data || [],
      total: count || 0,
    };
  },

  /**
   * Respond to an inquiry
   */
  async respondToInquiry(
    inquiryId: string,
    adminId: string,
    response: InquiryResponse
  ): Promise<void> {
    // Get inquiry details
    const { data: inquiry, error: fetchError } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('id', inquiryId)
      .single();

    if (fetchError || !inquiry) {
      throw new Error('INQUIRY_NOT_FOUND');
    }

    // Update inquiry with response
    const { error: updateError } = await supabaseAdmin
      .from('inquiries')
      .update({
        response: response.content,
        responded_by: adminId,
        responded_at: new Date().toISOString(),
        status: 'answered',
      })
      .eq('id', inquiryId);

    if (updateError) {
      throw updateError;
    }

    // Create notification for user
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: inquiry.user_id,
        type: 'inquiry_response',
        title: '문의 답변 등록',
        message: '문의하신 내용에 대한 답변이 등록되었습니다.',
        data: {
          referenceType: 'inquiry',
          referenceId: inquiryId,
        },
      });
  },

  /**
   * Get fee settings
   */
  async getFeeSettings(): Promise<{
    defaultCourseFeeRate: number;
    defaultPartyFeeRate: number;
    pgFeeRate: number;
  }> {
    const { data: settings, error } = await supabaseAdmin
      .from('admin_settings')
      .select('key, value')
      .in('key', ['default_course_fee_rate', 'default_party_fee_rate', 'pg_fee_rate']);

    if (error) {
      throw error;
    }

    const settingsMap = new Map(settings?.map((s) => [s.key, s.value]));

    return {
      defaultCourseFeeRate: Number(settingsMap.get('default_course_fee_rate')) || 10,
      defaultPartyFeeRate: Number(settingsMap.get('default_party_fee_rate')) || 10,
      pgFeeRate: Number(settingsMap.get('pg_fee_rate')) || 3.3,
    };
  },

  /**
   * Update fee settings
   */
  async updateFeeSettings(
    adminId: string,
    fees: {
      defaultCourseFeeRate?: number;
      defaultPartyFeeRate?: number;
      pgFeeRate?: number;
    }
  ): Promise<void> {
    const updates: Array<{ key: string; value: string }> = [];

    if (fees.defaultCourseFeeRate !== undefined) {
      updates.push({
        key: 'default_course_fee_rate',
        value: String(fees.defaultCourseFeeRate),
      });
    }

    if (fees.defaultPartyFeeRate !== undefined) {
      updates.push({
        key: 'default_party_fee_rate',
        value: String(fees.defaultPartyFeeRate),
      });
    }

    if (fees.pgFeeRate !== undefined) {
      updates.push({
        key: 'pg_fee_rate',
        value: String(fees.pgFeeRate),
      });
    }

    for (const update of updates) {
      const { error } = await supabaseAdmin
        .from('admin_settings')
        .update({
          value: update.value,
          updated_by: adminId,
          updated_at: new Date().toISOString(),
        })
        .eq('key', update.key);

      if (error) {
        throw error;
      }

      // Record fee history
      await supabaseAdmin
        .from('fee_history')
        .insert({
          influencer_id: null,
          fee_type: update.key.replace('default_', '').replace('_fee_rate', ''),
          new_rate: Number(update.value),
          changed_by: adminId,
          reason: 'Admin settings update',
        });
    }
  },

  /**
   * Get analytics data
   */
  async getAnalytics(params: {
    fromDate?: string;
    toDate?: string;
    type?: string;
  }): Promise<{
    summary: {
      totalUsers: number;
      newUsers: number;
      totalRevenue: number;
      totalSettlements: number;
    };
    charts: {
      users: Array<{ date: string; count: number }>;
      revenue: Array<{ date: string; amount: number }>;
    };
  }> {
    const { fromDate, toDate } = params;

    // Get user counts
    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    let newUsersQuery = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (fromDate) {
      newUsersQuery = newUsersQuery.gte('created_at', fromDate);
    }
    if (toDate) {
      newUsersQuery = newUsersQuery.lte('created_at', toDate);
    }

    const { count: newUsers } = await newUsersQuery;

    // Get revenue
    let paymentsQuery = supabaseAdmin
      .from('payments')
      .select('amount')
      .eq('status', 'completed');

    if (fromDate) {
      paymentsQuery = paymentsQuery.gte('paid_at', fromDate);
    }
    if (toDate) {
      paymentsQuery = paymentsQuery.lte('paid_at', toDate);
    }

    const { data: payments } = await paymentsQuery;
    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    // Get settlements
    let settlementsQuery = supabaseAdmin
      .from('settlements')
      .select('net_amount')
      .eq('status', 'completed');

    if (fromDate) {
      settlementsQuery = settlementsQuery.gte('completed_at', fromDate);
    }
    if (toDate) {
      settlementsQuery = settlementsQuery.lte('completed_at', toDate);
    }

    const { data: settlements } = await settlementsQuery;
    const totalSettlements = settlements?.reduce((sum, s) => sum + (s.net_amount || 0), 0) || 0;

    // For charts, we would aggregate by date
    // This is simplified - in production, use SQL aggregation
    const charts = {
      users: [] as Array<{ date: string; count: number }>,
      revenue: [] as Array<{ date: string; amount: number }>,
    };

    return {
      summary: {
        totalUsers: totalUsers || 0,
        newUsers: newUsers || 0,
        totalRevenue,
        totalSettlements,
      },
      charts,
    };
  },

  /**
   * Approve influencer application
   */
  async approveInfluencer(influencerId: string): Promise<void> {
    // Get influencer profile
    const { data: influencer, error: fetchError } = await supabaseAdmin
      .from('influencer_profiles')
      .select('user_id')
      .eq('id', influencerId)
      .single();

    if (fetchError || !influencer) {
      throw new Error('INFLUENCER_NOT_FOUND');
    }

    // Update influencer verification status
    const { error: updateInfluencerError } = await supabaseAdmin
      .from('influencer_profiles')
      .update({ verification_status: 'verified' })
      .eq('id', influencerId);

    if (updateInfluencerError) {
      throw updateInfluencerError;
    }

    // Update user role to influencer
    const { error: updateUserError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'influencer' })
      .eq('id', influencer.user_id);

    if (updateUserError) {
      throw updateUserError;
    }

    // Send notification
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: influencer.user_id,
        type: 'influencer_approved',
        title: '인플루언서 승인 완료',
        message: '인플루언서 신청이 승인되었습니다. 이제 코스와 파티를 등록할 수 있습니다.',
        data: {},
      });
  },

  /**
   * Reject influencer application
   */
  async rejectInfluencer(influencerId: string, reason: string): Promise<void> {
    // Get influencer profile
    const { data: influencer, error: fetchError } = await supabaseAdmin
      .from('influencer_profiles')
      .select('user_id')
      .eq('id', influencerId)
      .single();

    if (fetchError || !influencer) {
      throw new Error('INFLUENCER_NOT_FOUND');
    }

    // Update influencer verification status
    const { error: updateError } = await supabaseAdmin
      .from('influencer_profiles')
      .update({
        verification_status: 'rejected',
      })
      .eq('id', influencerId);

    if (updateError) {
      throw updateError;
    }

    // Send notification
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: influencer.user_id,
        type: 'influencer_rejected',
        title: '인플루언서 신청 반려',
        message: `인플루언서 신청이 반려되었습니다. 사유: ${reason}`,
        data: { reason },
      });
  },
};

export default adminService;
