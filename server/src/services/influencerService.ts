import { supabaseAdmin } from '../config/supabase';
import { PaginationQuery } from '../types';

// Types for influencer service
export interface InfluencerDashboardStats {
  totalCourses: number;
  activeCourses: number;
  totalParticipants: number;
  totalRevenue: number;
  pendingSettlements: number;
  completedSettlements: number;
}

export interface CourseFilters extends PaginationQuery {
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface CreateCourseData {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  images?: string[];
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  recruitmentStart: string;
  recruitmentEnd: string;
  minParticipants?: number;
  maxParticipants: number;
  allowedGender?: string;
  minAge?: number;
  maxAge?: number;
  requirements?: string;
  price: number;
  priceIncludes?: string;
  priceExcludes?: string;
  includedItems?: Array<{ name: string; description: string }>;
  optionalItems?: Array<{ name: string; description: string; price: number }>;
  accommodation?: {
    name: string;
    description: string;
    address: string;
    mapUrl: string;
    images: string[];
  };
  refundPolicy?: string;
  status?: string;
  visibility?: string;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {}

export interface ParticipantInfo {
  id: string;
  userId: string;
  applicantName: string;
  phone: string;
  instagramUrl: string;
  age: number;
  gender: string;
  introduction: string;
  status: string;
  appliedAt: string;
  paidAmount: number;
  expenseBalance?: number;
}

export interface AnnouncementData {
  title: string;
  content: string;
  images?: string[];
  isPinned?: boolean;
}

export interface NbangData {
  title: string;
  description?: string;
  totalAmount: number;
  participantIds: string[];
  includeFeeInAmount?: boolean;
}

export interface NbangResult {
  id: string;
  perPersonAmount: number;
  participantCount: number;
  insufficientBalanceUsers: string[];
}

// Influencer Service
export const influencerService = {
  /**
   * Get influencer dashboard statistics
   */
  async getDashboard(influencerId: string): Promise<InfluencerDashboardStats> {
    // Get influencer profile ID first
    const { data: influencerProfile } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', influencerId)
      .single();

    if (!influencerProfile) {
      throw new Error('INFLUENCER_NOT_FOUND');
    }

    const profileId = influencerProfile.id;

    // Get courses count
    const { count: totalCourses } = await supabaseAdmin
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('influencer_id', profileId);

    // Get active courses count
    const { count: activeCourses } = await supabaseAdmin
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('influencer_id', profileId)
      .in('status', ['recruiting', 'ongoing']);

    // Get total participants from completed courses
    const { data: participantData } = await supabaseAdmin
      .from('courses')
      .select('current_participants')
      .eq('influencer_id', profileId)
      .eq('status', 'completed');

    const totalParticipants = participantData?.reduce(
      (sum, course) => sum + (course.current_participants || 0),
      0
    ) || 0;

    // Get settlement totals
    const { data: settlements } = await supabaseAdmin
      .from('settlements')
      .select('net_amount, status')
      .eq('influencer_id', profileId);

    let totalRevenue = 0;
    let pendingSettlements = 0;
    let completedSettlements = 0;

    settlements?.forEach((s) => {
      if (s.status === 'completed') {
        completedSettlements += s.net_amount || 0;
        totalRevenue += s.net_amount || 0;
      } else if (s.status === 'pending') {
        pendingSettlements += s.net_amount || 0;
      }
    });

    return {
      totalCourses: totalCourses || 0,
      activeCourses: activeCourses || 0,
      totalParticipants,
      totalRevenue,
      pendingSettlements,
      completedSettlements,
    };
  },

  /**
   * Get influencer's courses with filters
   */
  async getCourses(
    influencerId: string,
    filters: CourseFilters
  ): Promise<{ items: unknown[]; total: number }> {
    // Get influencer profile ID
    const { data: influencerProfile } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', influencerId)
      .single();

    if (!influencerProfile) {
      throw new Error('INFLUENCER_NOT_FOUND');
    }

    const { page = 1, limit = 20, status, fromDate, toDate } = filters;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('courses')
      .select('*', { count: 'exact' })
      .eq('influencer_id', influencerProfile.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (fromDate) {
      query = query.gte('start_date', fromDate);
    }

    if (toDate) {
      query = query.lte('end_date', toDate);
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
   * Create a new course
   */
  async createCourse(
    influencerId: string,
    data: CreateCourseData
  ): Promise<{ id: string }> {
    // Get influencer profile ID
    const { data: influencerProfile } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', influencerId)
      .single();

    if (!influencerProfile) {
      throw new Error('INFLUENCER_NOT_FOUND');
    }

    const courseData = {
      influencer_id: influencerProfile.id,
      title: data.title,
      description: data.description,
      thumbnail_url: data.thumbnailUrl,
      images: data.images || [],
      country: data.country,
      city: data.city,
      start_date: data.startDate,
      end_date: data.endDate,
      total_days: data.totalDays,
      recruitment_start: data.recruitmentStart,
      recruitment_end: data.recruitmentEnd,
      min_participants: data.minParticipants || 1,
      max_participants: data.maxParticipants,
      allowed_gender: data.allowedGender || 'all',
      min_age: data.minAge,
      max_age: data.maxAge,
      requirements: data.requirements,
      price: data.price,
      price_includes: data.priceIncludes,
      price_excludes: data.priceExcludes,
      included_items: data.includedItems || [],
      optional_items: data.optionalItems || [],
      accommodation: data.accommodation || {},
      refund_policy: data.refundPolicy,
      status: data.status || 'draft',
      visibility: data.visibility || 'public',
    };

    const { data: course, error } = await supabaseAdmin
      .from('courses')
      .insert(courseData)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return { id: course.id };
  },

  /**
   * Update an existing course
   */
  async updateCourse(
    courseId: string,
    influencerId: string,
    data: UpdateCourseData
  ): Promise<void> {
    // Verify course belongs to influencer
    const { data: influencerProfile } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', influencerId)
      .single();

    if (!influencerProfile) {
      throw new Error('INFLUENCER_NOT_FOUND');
    }

    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .eq('influencer_id', influencerProfile.id)
      .single();

    if (!course) {
      throw new Error('COURSE_NOT_FOUND');
    }

    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.thumbnailUrl !== undefined) updateData.thumbnail_url = data.thumbnailUrl;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.startDate !== undefined) updateData.start_date = data.startDate;
    if (data.endDate !== undefined) updateData.end_date = data.endDate;
    if (data.totalDays !== undefined) updateData.total_days = data.totalDays;
    if (data.recruitmentStart !== undefined) updateData.recruitment_start = data.recruitmentStart;
    if (data.recruitmentEnd !== undefined) updateData.recruitment_end = data.recruitmentEnd;
    if (data.minParticipants !== undefined) updateData.min_participants = data.minParticipants;
    if (data.maxParticipants !== undefined) updateData.max_participants = data.maxParticipants;
    if (data.allowedGender !== undefined) updateData.allowed_gender = data.allowedGender;
    if (data.minAge !== undefined) updateData.min_age = data.minAge;
    if (data.maxAge !== undefined) updateData.max_age = data.maxAge;
    if (data.requirements !== undefined) updateData.requirements = data.requirements;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.priceIncludes !== undefined) updateData.price_includes = data.priceIncludes;
    if (data.priceExcludes !== undefined) updateData.price_excludes = data.priceExcludes;
    if (data.includedItems !== undefined) updateData.included_items = data.includedItems;
    if (data.optionalItems !== undefined) updateData.optional_items = data.optionalItems;
    if (data.accommodation !== undefined) updateData.accommodation = data.accommodation;
    if (data.refundPolicy !== undefined) updateData.refund_policy = data.refundPolicy;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.visibility !== undefined) updateData.visibility = data.visibility;

    const { error } = await supabaseAdmin
      .from('courses')
      .update(updateData)
      .eq('id', courseId);

    if (error) {
      throw error;
    }
  },

  /**
   * Get participants for a course
   */
  async getParticipants(
    courseId: string,
    influencerId: string
  ): Promise<{
    summary: {
      pending: number;
      confirmed: number;
      rejected: number;
      maxParticipants: number;
    };
    items: ParticipantInfo[];
  }> {
    // Verify course belongs to influencer
    const { data: influencerProfile } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', influencerId)
      .single();

    if (!influencerProfile) {
      throw new Error('INFLUENCER_NOT_FOUND');
    }

    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('id, max_participants')
      .eq('id', courseId)
      .eq('influencer_id', influencerProfile.id)
      .single();

    if (!course) {
      throw new Error('COURSE_NOT_FOUND');
    }

    // Get applications
    const { data: applications } = await supabaseAdmin
      .from('course_applications')
      .select(`
        id,
        user_id,
        applicant_name,
        phone,
        instagram_url,
        age,
        gender,
        introduction,
        status,
        applied_at,
        paid_amount
      `)
      .eq('course_id', courseId)
      .order('applied_at', { ascending: false });

    const items: ParticipantInfo[] = (applications || []).map((app) => ({
      id: app.id,
      userId: app.user_id,
      applicantName: app.applicant_name,
      phone: app.phone,
      instagramUrl: app.instagram_url,
      age: app.age,
      gender: app.gender,
      introduction: app.introduction,
      status: app.status,
      appliedAt: app.applied_at,
      paidAmount: app.paid_amount,
    }));

    // Calculate summary
    const summary = {
      pending: items.filter((i) => i.status === 'pending').length,
      confirmed: items.filter((i) => i.status === 'confirmed').length,
      rejected: items.filter((i) => i.status === 'rejected').length,
      maxParticipants: course.max_participants,
    };

    return { summary, items };
  },

  /**
   * Create an announcement for a course
   */
  async createAnnouncement(
    courseId: string,
    influencerId: string,
    data: AnnouncementData
  ): Promise<{ id: string }> {
    // Verify course belongs to influencer
    const { data: influencerProfile } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', influencerId)
      .single();

    if (!influencerProfile) {
      throw new Error('INFLUENCER_NOT_FOUND');
    }

    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .eq('influencer_id', influencerProfile.id)
      .single();

    if (!course) {
      throw new Error('COURSE_NOT_FOUND');
    }

    const announcementData = {
      course_id: courseId,
      author_id: influencerId,
      title: data.title,
      content: data.content,
      images: data.images || [],
      is_pinned: data.isPinned || false,
    };

    const { data: announcement, error } = await supabaseAdmin
      .from('course_announcements')
      .insert(announcementData)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return { id: announcement.id };
  },

  /**
   * Get announcements for a course
   */
  async getAnnouncements(
    courseId: string,
    influencerId: string
  ): Promise<unknown[]> {
    // Verify course belongs to influencer
    const { data: influencerProfile } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', influencerId)
      .single();

    if (!influencerProfile) {
      throw new Error('INFLUENCER_NOT_FOUND');
    }

    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .eq('influencer_id', influencerProfile.id)
      .single();

    if (!course) {
      throw new Error('COURSE_NOT_FOUND');
    }

    const { data: announcements, error } = await supabaseAdmin
      .from('course_announcements')
      .select(`
        id,
        title,
        content,
        images,
        is_pinned,
        created_at,
        updated_at
      `)
      .eq('course_id', courseId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return announcements || [];
  },

  /**
   * Update expense request for participants
   */
  async updateExpense(
    courseId: string,
    influencerId: string,
    requestedAmount: number
  ): Promise<void> {
    // Verify course belongs to influencer
    const { data: influencerProfile } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', influencerId)
      .single();

    if (!influencerProfile) {
      throw new Error('INFLUENCER_NOT_FOUND');
    }

    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .eq('influencer_id', influencerProfile.id)
      .single();

    if (!course) {
      throw new Error('COURSE_NOT_FOUND');
    }

    // Update requested amount for all participants
    const { error } = await supabaseAdmin
      .from('course_participants_expenses')
      .update({ requested_amount: requestedAmount })
      .eq('course_id', courseId);

    if (error) {
      throw error;
    }
  },

  /**
   * Create N빵 settlement
   */
  async createNbang(
    courseId: string,
    influencerId: string,
    data: NbangData
  ): Promise<NbangResult> {
    // Verify course belongs to influencer
    const { data: influencerProfile } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', influencerId)
      .single();

    if (!influencerProfile) {
      throw new Error('INFLUENCER_NOT_FOUND');
    }

    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .eq('influencer_id', influencerProfile.id)
      .single();

    if (!course) {
      throw new Error('COURSE_NOT_FOUND');
    }

    const perPersonAmount = Math.ceil(data.totalAmount / data.participantIds.length);

    // Create N빵 item
    const { data: nbangItem, error: nbangError } = await supabaseAdmin
      .from('course_nbang_items')
      .insert({
        course_id: courseId,
        title: data.title,
        description: data.description,
        total_amount: data.totalAmount,
        per_person_amount: perPersonAmount,
        include_fee_in_amount: data.includeFeeInAmount || false,
        participant_count: data.participantIds.length,
        status: 'pending',
      })
      .select('id')
      .single();

    if (nbangError) {
      throw nbangError;
    }

    // Check balances and create participant records
    const insufficientBalanceUsers: string[] = [];

    for (const userId of data.participantIds) {
      // Get participant expense balance
      const { data: expense } = await supabaseAdmin
        .from('course_participants_expenses')
        .select('id, balance')
        .eq('course_id', courseId)
        .eq('user_id', userId)
        .single();

      if (!expense || expense.balance < perPersonAmount) {
        insufficientBalanceUsers.push(userId);
      }

      // Create N빵 participant record
      await supabaseAdmin
        .from('course_nbang_participants')
        .insert({
          nbang_item_id: nbangItem.id,
          user_id: userId,
          amount: perPersonAmount,
          is_paid: false,
        });
    }

    // If all participants have sufficient balance, process deductions
    if (insufficientBalanceUsers.length === 0) {
      for (const userId of data.participantIds) {
        const { data: expense } = await supabaseAdmin
          .from('course_participants_expenses')
          .select('id, balance')
          .eq('course_id', courseId)
          .eq('user_id', userId)
          .single();

        if (expense) {
          const newBalance = expense.balance - perPersonAmount;

          // Update balance
          await supabaseAdmin
            .from('course_participants_expenses')
            .update({
              balance: newBalance,
              total_used: supabaseAdmin.rpc('increment', { x: perPersonAmount }),
            })
            .eq('id', expense.id);

          // Create transaction record
          await supabaseAdmin
            .from('expense_transactions')
            .insert({
              expense_id: expense.id,
              type: 'deduct',
              amount: perPersonAmount,
              balance_after: newBalance,
              nbang_item_id: nbangItem.id,
              description: data.title,
            });

          // Mark as paid
          await supabaseAdmin
            .from('course_nbang_participants')
            .update({ is_paid: true, paid_at: new Date().toISOString() })
            .eq('nbang_item_id', nbangItem.id)
            .eq('user_id', userId);
        }
      }

      // Update N빵 item status to completed
      await supabaseAdmin
        .from('course_nbang_items')
        .update({ status: 'completed' })
        .eq('id', nbangItem.id);
    }

    return {
      id: nbangItem.id,
      perPersonAmount,
      participantCount: data.participantIds.length,
      insufficientBalanceUsers,
    };
  },

  /**
   * Get influencer settlements
   */
  async getSettlements(
    influencerId: string,
    filters: {
      status?: string;
      fromDate?: string;
      toDate?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ items: unknown[]; total: number }> {
    // Get influencer profile ID
    const { data: influencerProfile } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', influencerId)
      .single();

    if (!influencerProfile) {
      throw new Error('INFLUENCER_NOT_FOUND');
    }

    const { page = 1, limit = 20, status, fromDate, toDate } = filters;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('settlements')
      .select('*', { count: 'exact' })
      .eq('influencer_id', influencerProfile.id)
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
};

export default influencerService;
