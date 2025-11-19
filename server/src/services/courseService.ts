import { supabaseAdmin } from '../config/supabase';
import { PaginatedResponse } from '../types';

// Types for Course Service
export interface CourseListFilters {
  status?: string;
  country?: string;
  city?: string;
  startDateFrom?: string;
  startDateTo?: string;
  page: number;
  limit: number;
}

export interface CourseListItem {
  id: string;
  title: string;
  thumbnail_url: string | null;
  country: string;
  city: string;
  start_date: string;
  end_date: string;
  price: number;
  max_participants: number;
  current_participants: number;
  status: string;
  influencer: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export interface CourseDetail {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  images: string[];
  country: string;
  city: string;
  start_date: string;
  end_date: string;
  total_days: number;
  recruitment_start: string;
  recruitment_end: string;
  min_participants: number;
  max_participants: number;
  current_participants: number;
  allowed_gender: string;
  min_age: number | null;
  max_age: number | null;
  price: number;
  price_includes: string | null;
  price_excludes: string | null;
  included_items: Array<{ name: string; description: string }>;
  optional_items: Array<{ name: string; description: string; price: number }>;
  accommodation: {
    name: string;
    description: string;
    address: string;
    map_url: string;
    images: string[];
  } | null;
  refund_policy: string | null;
  status: string;
  influencer: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    instagram_url: string | null;
    average_rating: number;
  };
  days: Array<{
    day_number: number;
    date: string;
    title: string | null;
    items: Array<{
      order_index: number;
      time_slot: string | null;
      title: string;
      description: string | null;
      location_name: string | null;
      location_address: string | null;
      map_url: string | null;
      images: string[];
      item_type: string;
      is_optional: boolean;
    }>;
  }>;
  is_applied: boolean;
  can_apply: boolean;
}

export interface CourseApplyData {
  applicant_name: string;
  phone: string;
  instagram_url: string;
  age: number;
  gender: string;
  introduction: string;
  selected_options?: Array<{ id: string; name: string; price: number }>;
}

export interface ApplicationResult {
  application_id: string;
  payment_request: {
    merchant_uid: string;
    amount: number;
    name: string;
  };
}

export interface CourseApplication {
  id: string;
  course_id: string;
  user_id: string;
  applicant_name: string;
  phone: string;
  instagram_url: string;
  age: number | null;
  gender: string | null;
  introduction: string | null;
  status: string;
  status_reason: string | null;
  payment_id: string | null;
  paid_amount: number | null;
  applied_at: string;
  confirmed_at: string | null;
  rejected_at: string | null;
  cancelled_at: string | null;
}

class CourseService {
  /**
   * Get paginated list of courses with filters
   */
  async getList(filters: CourseListFilters): Promise<PaginatedResponse<CourseListItem>> {
    const { status, country, city, startDateFrom, startDateTo, page, limit } = filters;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('courses')
      .select(`
        id,
        title,
        thumbnail_url,
        country,
        city,
        start_date,
        end_date,
        price,
        max_participants,
        current_participants,
        status,
        influencer_profiles!inner (
          id,
          display_name,
          user_id,
          profiles!inner (
            avatar_url
          )
        )
      `, { count: 'exact' })
      .neq('status', 'draft')
      .eq('visibility', 'public');

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (country) {
      query = query.eq('country', country);
    }
    if (city) {
      query = query.eq('city', city);
    }
    if (startDateFrom) {
      query = query.gte('start_date', startDateFrom);
    }
    if (startDateTo) {
      query = query.lte('start_date', startDateTo);
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }

    const items: CourseListItem[] = (data || []).map((course: Record<string, unknown>) => {
      const influencerProfile = course.influencer_profiles as Record<string, unknown>;
      const profile = influencerProfile?.profiles as Record<string, unknown>;

      return {
        id: course.id as string,
        title: course.title as string,
        thumbnail_url: course.thumbnail_url as string | null,
        country: course.country as string,
        city: course.city as string,
        start_date: course.start_date as string,
        end_date: course.end_date as string,
        price: course.price as number,
        max_participants: course.max_participants as number,
        current_participants: course.current_participants as number,
        status: course.status as string,
        influencer: {
          id: influencerProfile?.id as string,
          display_name: influencerProfile?.display_name as string,
          avatar_url: profile?.avatar_url as string | null,
        },
      };
    });

    return {
      items,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  /**
   * Get featured courses for homepage
   */
  async getFeatured(limit: number = 10): Promise<CourseListItem[]> {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select(`
        id,
        title,
        thumbnail_url,
        country,
        city,
        start_date,
        end_date,
        price,
        max_participants,
        current_participants,
        status,
        influencer_profiles!inner (
          id,
          display_name,
          user_id,
          is_featured,
          profiles!inner (
            avatar_url
          )
        )
      `)
      .eq('status', 'recruiting')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch featured courses: ${error.message}`);
    }

    return (data || []).map((course: Record<string, unknown>) => {
      const influencerProfile = course.influencer_profiles as Record<string, unknown>;
      const profile = influencerProfile?.profiles as Record<string, unknown>;

      return {
        id: course.id as string,
        title: course.title as string,
        thumbnail_url: course.thumbnail_url as string | null,
        country: course.country as string,
        city: course.city as string,
        start_date: course.start_date as string,
        end_date: course.end_date as string,
        price: course.price as number,
        max_participants: course.max_participants as number,
        current_participants: course.current_participants as number,
        status: course.status as string,
        influencer: {
          id: influencerProfile?.id as string,
          display_name: influencerProfile?.display_name as string,
          avatar_url: profile?.avatar_url as string | null,
        },
      };
    });
  }

  /**
   * Get detailed course information
   */
  async getDetail(courseId: string, userId?: string): Promise<CourseDetail | null> {
    // Fetch course with influencer info
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select(`
        *,
        influencer_profiles!inner (
          id,
          display_name,
          average_rating,
          user_id,
          profiles!inner (
            avatar_url,
            instagram_url
          )
        )
      `)
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return null;
    }

    // Fetch course days with items
    const { data: days, error: daysError } = await supabaseAdmin
      .from('course_days')
      .select(`
        id,
        day_number,
        date,
        title,
        course_day_items (
          id,
          order_index,
          time_slot,
          title,
          description,
          location_name,
          location_address,
          map_url,
          images,
          item_type,
          is_optional
        )
      `)
      .eq('course_id', courseId)
      .order('day_number', { ascending: true });

    if (daysError) {
      throw new Error(`Failed to fetch course days: ${daysError.message}`);
    }

    // Check if user has already applied
    let isApplied = false;
    if (userId) {
      const { data: application } = await supabaseAdmin
        .from('course_applications')
        .select('id, status')
        .eq('course_id', courseId)
        .eq('user_id', userId)
        .single();

      isApplied = !!application && application.status !== 'cancelled';
    }

    // Check if user can apply
    const now = new Date().toISOString().split('T')[0];
    const canApply =
      course.status === 'recruiting' &&
      course.recruitment_end >= now &&
      course.current_participants < course.max_participants &&
      !isApplied;

    const influencerProfile = course.influencer_profiles as Record<string, unknown>;
    const profile = influencerProfile?.profiles as Record<string, unknown>;

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail_url: course.thumbnail_url,
      images: course.images || [],
      country: course.country,
      city: course.city,
      start_date: course.start_date,
      end_date: course.end_date,
      total_days: course.total_days,
      recruitment_start: course.recruitment_start,
      recruitment_end: course.recruitment_end,
      min_participants: course.min_participants,
      max_participants: course.max_participants,
      current_participants: course.current_participants,
      allowed_gender: course.allowed_gender,
      min_age: course.min_age,
      max_age: course.max_age,
      price: course.price,
      price_includes: course.price_includes,
      price_excludes: course.price_excludes,
      included_items: course.included_items || [],
      optional_items: course.optional_items || [],
      accommodation: course.accommodation,
      refund_policy: course.refund_policy,
      status: course.status,
      influencer: {
        id: influencerProfile?.id as string,
        display_name: influencerProfile?.display_name as string,
        avatar_url: profile?.avatar_url as string | null,
        instagram_url: profile?.instagram_url as string | null,
        average_rating: (influencerProfile?.average_rating as number) || 0,
      },
      days: (days || []).map((day: Record<string, unknown>) => ({
        day_number: day.day_number as number,
        date: day.date as string,
        title: day.title as string | null,
        items: ((day.course_day_items as Array<Record<string, unknown>>) || [])
          .sort((a, b) => (a.order_index as number) - (b.order_index as number))
          .map((item) => ({
            order_index: item.order_index as number,
            time_slot: item.time_slot as string | null,
            title: item.title as string,
            description: item.description as string | null,
            location_name: item.location_name as string | null,
            location_address: item.location_address as string | null,
            map_url: item.map_url as string | null,
            images: (item.images as string[]) || [],
            item_type: item.item_type as string,
            is_optional: item.is_optional as boolean,
          })),
      })),
      is_applied: isApplied,
      can_apply: canApply,
    };
  }

  /**
   * Apply to a course
   */
  async apply(courseId: string, userId: string, data: CourseApplyData): Promise<ApplicationResult> {
    // Fetch course to validate
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id, title, price, status, max_participants, current_participants, recruitment_end, allowed_gender, min_age, max_age')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      throw new Error('코스를 찾을 수 없습니다');
    }

    // Validate course status
    if (course.status !== 'recruiting') {
      throw new Error('현재 모집 중인 코스가 아닙니다');
    }

    // Check recruitment period
    const now = new Date().toISOString().split('T')[0];
    if (course.recruitment_end < now) {
      throw new Error('모집 기간이 종료되었습니다');
    }

    // Check capacity
    if (course.current_participants >= course.max_participants) {
      throw new Error('모집 인원이 마감되었습니다');
    }

    // Validate gender restriction
    if (course.allowed_gender !== 'all' && course.allowed_gender !== data.gender) {
      throw new Error('참가 조건에 맞지 않습니다 (성별)');
    }

    // Validate age restriction
    if (course.min_age && data.age < course.min_age) {
      throw new Error(`최소 ${course.min_age}세 이상만 참가 가능합니다`);
    }
    if (course.max_age && data.age > course.max_age) {
      throw new Error(`최대 ${course.max_age}세까지만 참가 가능합니다`);
    }

    // Check if already applied
    const { data: existingApp } = await supabaseAdmin
      .from('course_applications')
      .select('id, status')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .single();

    if (existingApp && existingApp.status !== 'cancelled') {
      throw new Error('이미 신청한 코스입니다');
    }

    // Calculate total amount with options
    let totalAmount = Number(course.price);
    if (data.selected_options && data.selected_options.length > 0) {
      for (const option of data.selected_options) {
        totalAmount += option.price;
      }
    }

    // Create or update application
    const applicationData = {
      course_id: courseId,
      user_id: userId,
      applicant_name: data.applicant_name,
      phone: data.phone,
      instagram_url: data.instagram_url,
      age: data.age,
      gender: data.gender,
      introduction: data.introduction,
      status: 'pending',
      paid_amount: totalAmount,
      applied_at: new Date().toISOString(),
    };

    let applicationId: string;

    if (existingApp) {
      // Update existing cancelled application
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('course_applications')
        .update(applicationData)
        .eq('id', existingApp.id)
        .select('id')
        .single();

      if (updateError) {
        throw new Error(`신청 업데이트 실패: ${updateError.message}`);
      }
      applicationId = updated.id;
    } else {
      // Create new application
      const { data: created, error: createError } = await supabaseAdmin
        .from('course_applications')
        .insert(applicationData)
        .select('id')
        .single();

      if (createError) {
        throw new Error(`신청 생성 실패: ${createError.message}`);
      }
      applicationId = created.id;
    }

    // Generate payment request
    const merchantUid = `course_${courseId}_${Date.now()}`;

    return {
      application_id: applicationId,
      payment_request: {
        merchant_uid: merchantUid,
        amount: totalAmount,
        name: course.title,
      },
    };
  }

  /**
   * Cancel a course application
   */
  async cancelApplication(applicationId: string, userId: string): Promise<{ refund_eligible: boolean; refund_amount: number }> {
    // Fetch application with course info
    const { data: application, error: appError } = await supabaseAdmin
      .from('course_applications')
      .select(`
        id,
        user_id,
        status,
        paid_amount,
        course_id,
        courses (
          id,
          title,
          start_date,
          refund_policy
        )
      `)
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      throw new Error('신청 내역을 찾을 수 없습니다');
    }

    // Verify ownership
    if (application.user_id !== userId) {
      throw new Error('본인의 신청만 취소할 수 있습니다');
    }

    // Check if cancellation is possible
    if (application.status === 'cancelled') {
      throw new Error('이미 취소된 신청입니다');
    }

    if (application.status === 'rejected') {
      throw new Error('미선정된 신청은 취소할 수 없습니다');
    }

    // Calculate refund based on policy (simplified)
    const course = application.courses as Record<string, unknown>;
    const startDate = new Date(course.start_date as string);
    const now = new Date();
    const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let refundRate = 0;
    if (daysUntilStart > 30) {
      refundRate = 100;
    } else if (daysUntilStart > 14) {
      refundRate = 80;
    } else if (daysUntilStart > 7) {
      refundRate = 50;
    } else if (daysUntilStart > 3) {
      refundRate = 30;
    } else {
      refundRate = 0;
    }

    const paidAmount = application.paid_amount || 0;
    const refundAmount = Math.floor(paidAmount * (refundRate / 100));

    // Update application status
    const { error: updateError } = await supabaseAdmin
      .from('course_applications')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        status_reason: '사용자 취소',
      })
      .eq('id', applicationId);

    if (updateError) {
      throw new Error(`신청 취소 실패: ${updateError.message}`);
    }

    return {
      refund_eligible: refundAmount > 0,
      refund_amount: refundAmount,
    };
  }

  /**
   * Get all applications for a course (for influencer)
   */
  async getApplications(courseId: string, influencerId: string): Promise<{
    summary: {
      pending: number;
      confirmed: number;
      rejected: number;
      cancelled: number;
      max_participants: number;
    };
    items: CourseApplication[];
  }> {
    // Verify course belongs to influencer
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id, max_participants, influencer_id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      throw new Error('코스를 찾을 수 없습니다');
    }

    // Get influencer profile
    const { data: influencerProfile } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', influencerId)
      .single();

    if (!influencerProfile || course.influencer_id !== influencerProfile.id) {
      throw new Error('본인의 코스만 조회할 수 있습니다');
    }

    // Fetch applications
    const { data: applications, error: appsError } = await supabaseAdmin
      .from('course_applications')
      .select('*')
      .eq('course_id', courseId)
      .order('applied_at', { ascending: false });

    if (appsError) {
      throw new Error(`신청 목록 조회 실패: ${appsError.message}`);
    }

    // Calculate summary
    const summary = {
      pending: 0,
      confirmed: 0,
      rejected: 0,
      cancelled: 0,
      max_participants: course.max_participants,
    };

    for (const app of applications || []) {
      switch (app.status) {
        case 'pending':
          summary.pending++;
          break;
        case 'confirmed':
          summary.confirmed++;
          break;
        case 'rejected':
          summary.rejected++;
          break;
        case 'cancelled':
          summary.cancelled++;
          break;
      }
    }

    return {
      summary,
      items: applications || [],
    };
  }

  /**
   * Increment view count for a course
   */
  async incrementViewCount(courseId: string): Promise<void> {
    await supabaseAdmin.rpc('increment_course_view_count', { course_id: courseId });
  }
}

export const courseService = new CourseService();
export default courseService;
