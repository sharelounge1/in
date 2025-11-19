import { supabaseAdmin } from '../config/supabase';
import { PaginatedResponse } from '../types';

// Types for Party Service
export interface PartyListFilters {
  region?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
  page: number;
  limit: number;
}

export interface PartyListItem {
  id: string;
  title: string;
  thumbnail_url: string | null;
  location_name: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
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

export interface PartyDetail {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  images: string[];
  location_name: string | null;
  location_address: string | null;
  map_url: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  recruitment_start: string;
  recruitment_end: string;
  min_participants: number;
  max_participants: number;
  current_participants: number;
  allowed_gender: string;
  min_age: number | null;
  max_age: number | null;
  price: number;
  price_description: string | null;
  refund_policy: string | null;
  status: string;
  influencer: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    instagram_url: string | null;
    average_rating: number;
  };
  is_applied: boolean;
  can_apply: boolean;
}

export interface PartyCreateData {
  title: string;
  description?: string;
  thumbnail_url?: string;
  images?: string[];
  location_name?: string;
  location_address?: string;
  map_url?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  recruitment_start: string;
  recruitment_end: string;
  min_participants?: number;
  max_participants: number;
  allowed_gender?: string;
  min_age?: number;
  max_age?: number;
  price: number;
  price_description?: string;
  refund_policy?: string;
}

export interface PartyUpdateData {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  images?: string[];
  location_name?: string;
  location_address?: string;
  map_url?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  recruitment_start?: string;
  recruitment_end?: string;
  min_participants?: number;
  max_participants?: number;
  allowed_gender?: string;
  min_age?: number;
  max_age?: number;
  price?: number;
  price_description?: string;
  refund_policy?: string;
  status?: string;
}

export interface PartyJoinData {
  applicant_name: string;
  phone: string;
  instagram_url: string;
  age: number;
  gender: string;
  introduction: string;
}

export interface JoinResult {
  application_id: string;
  payment_request: {
    merchant_uid: string;
    amount: number;
    name: string;
  };
}

class PartyService {
  /**
   * Get paginated list of parties with filters
   */
  async getList(filters: PartyListFilters): Promise<PaginatedResponse<PartyListItem>> {
    const { region, date_from, date_to, status, page, limit } = filters;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('parties')
      .select(`
        id,
        title,
        thumbnail_url,
        location_name,
        event_date,
        start_time,
        end_time,
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
      .neq('status', 'draft');

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (region) {
      query = query.ilike('location_address', `%${region}%`);
    }
    if (date_from) {
      query = query.gte('event_date', date_from);
    }
    if (date_to) {
      query = query.lte('event_date', date_to);
    }

    // Apply pagination
    query = query
      .order('event_date', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch parties: ${error.message}`);
    }

    const items: PartyListItem[] = (data || []).map((party: Record<string, unknown>) => {
      const influencerProfile = party.influencer_profiles as Record<string, unknown>;
      const profile = influencerProfile?.profiles as Record<string, unknown>;

      return {
        id: party.id as string,
        title: party.title as string,
        thumbnail_url: party.thumbnail_url as string | null,
        location_name: party.location_name as string | null,
        event_date: party.event_date as string,
        start_time: party.start_time as string | null,
        end_time: party.end_time as string | null,
        price: party.price as number,
        max_participants: party.max_participants as number,
        current_participants: party.current_participants as number,
        status: party.status as string,
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
   * Get detailed party information
   */
  async getDetail(partyId: string, userId?: string): Promise<PartyDetail | null> {
    // Fetch party with influencer info
    const { data: party, error: partyError } = await supabaseAdmin
      .from('parties')
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
      .eq('id', partyId)
      .single();

    if (partyError || !party) {
      return null;
    }

    // Check if user has already applied
    let isApplied = false;
    if (userId) {
      const { data: application } = await supabaseAdmin
        .from('party_applications')
        .select('id, status')
        .eq('party_id', partyId)
        .eq('user_id', userId)
        .single();

      isApplied = !!application && application.status !== 'cancelled';
    }

    // Check if user can apply
    const now = new Date().toISOString().split('T')[0];
    const canApply =
      party.status === 'recruiting' &&
      party.recruitment_end >= now &&
      party.current_participants < party.max_participants &&
      !isApplied;

    const influencerProfile = party.influencer_profiles as Record<string, unknown>;
    const profile = influencerProfile?.profiles as Record<string, unknown>;

    return {
      id: party.id,
      title: party.title,
      description: party.description,
      thumbnail_url: party.thumbnail_url,
      images: party.images || [],
      location_name: party.location_name,
      location_address: party.location_address,
      map_url: party.map_url,
      event_date: party.event_date,
      start_time: party.start_time,
      end_time: party.end_time,
      recruitment_start: party.recruitment_start,
      recruitment_end: party.recruitment_end,
      min_participants: party.min_participants,
      max_participants: party.max_participants,
      current_participants: party.current_participants,
      allowed_gender: party.allowed_gender,
      min_age: party.min_age,
      max_age: party.max_age,
      price: party.price,
      price_description: party.price_description,
      refund_policy: party.refund_policy,
      status: party.status,
      influencer: {
        id: influencerProfile?.id as string,
        display_name: influencerProfile?.display_name as string,
        avatar_url: profile?.avatar_url as string | null,
        instagram_url: profile?.instagram_url as string | null,
        average_rating: (influencerProfile?.average_rating as number) || 0,
      },
      is_applied: isApplied,
      can_apply: canApply,
    };
  }

  /**
   * Create a new party (influencer only)
   */
  async create(influencerId: string, data: PartyCreateData): Promise<{ id: string }> {
    // Get influencer profile
    const { data: influencerProfile, error: profileError } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id, verification_status')
      .eq('user_id', influencerId)
      .single();

    if (profileError || !influencerProfile) {
      throw new Error('인플루언서 프로필을 찾을 수 없습니다');
    }

    if (influencerProfile.verification_status !== 'verified') {
      throw new Error('인증된 인플루언서만 파티를 생성할 수 있습니다');
    }

    // Validate dates
    const recruitmentStart = new Date(data.recruitment_start);
    const recruitmentEnd = new Date(data.recruitment_end);
    const eventDate = new Date(data.event_date);

    if (recruitmentEnd < recruitmentStart) {
      throw new Error('모집 마감일은 시작일 이후여야 합니다');
    }

    if (eventDate < recruitmentEnd) {
      throw new Error('이벤트 날짜는 모집 마감일 이후여야 합니다');
    }

    // Create party
    const partyData = {
      influencer_id: influencerProfile.id,
      title: data.title,
      description: data.description || null,
      thumbnail_url: data.thumbnail_url || null,
      images: data.images || [],
      location_name: data.location_name || null,
      location_address: data.location_address || null,
      map_url: data.map_url || null,
      event_date: data.event_date,
      start_time: data.start_time || null,
      end_time: data.end_time || null,
      recruitment_start: data.recruitment_start,
      recruitment_end: data.recruitment_end,
      min_participants: data.min_participants || 1,
      max_participants: data.max_participants,
      allowed_gender: data.allowed_gender || 'all',
      min_age: data.min_age || null,
      max_age: data.max_age || null,
      price: data.price,
      price_description: data.price_description || null,
      refund_policy: data.refund_policy || null,
      status: 'draft',
      current_participants: 0,
    };

    const { data: created, error: createError } = await supabaseAdmin
      .from('parties')
      .insert(partyData)
      .select('id')
      .single();

    if (createError) {
      throw new Error(`파티 생성 실패: ${createError.message}`);
    }

    return { id: created.id };
  }

  /**
   * Update a party (influencer only)
   */
  async update(partyId: string, influencerId: string, data: PartyUpdateData): Promise<{ id: string }> {
    // Verify party belongs to influencer
    const { data: party, error: partyError } = await supabaseAdmin
      .from('parties')
      .select(`
        id,
        status,
        influencer_id,
        influencer_profiles!inner (
          user_id
        )
      `)
      .eq('id', partyId)
      .single();

    if (partyError || !party) {
      throw new Error('파티를 찾을 수 없습니다');
    }

    const influencerProfile = party.influencer_profiles as Record<string, unknown>;
    if (influencerProfile.user_id !== influencerId) {
      throw new Error('본인의 파티만 수정할 수 있습니다');
    }

    // Restrict updates based on status
    if (party.status === 'completed' || party.status === 'cancelled') {
      throw new Error('완료되거나 취소된 파티는 수정할 수 없습니다');
    }

    // Validate dates if provided
    if (data.recruitment_start && data.recruitment_end) {
      const recruitmentStart = new Date(data.recruitment_start);
      const recruitmentEnd = new Date(data.recruitment_end);

      if (recruitmentEnd < recruitmentStart) {
        throw new Error('모집 마감일은 시작일 이후여야 합니다');
      }
    }

    // Update party
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Only include provided fields
    const allowedFields = [
      'title', 'description', 'thumbnail_url', 'images',
      'location_name', 'location_address', 'map_url',
      'event_date', 'start_time', 'end_time',
      'recruitment_start', 'recruitment_end',
      'min_participants', 'max_participants',
      'allowed_gender', 'min_age', 'max_age',
      'price', 'price_description', 'refund_policy', 'status'
    ];

    for (const field of allowedFields) {
      if (data[field as keyof PartyUpdateData] !== undefined) {
        updateData[field] = data[field as keyof PartyUpdateData];
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from('parties')
      .update(updateData)
      .eq('id', partyId);

    if (updateError) {
      throw new Error(`파티 수정 실패: ${updateError.message}`);
    }

    return { id: partyId };
  }

  /**
   * Join a party
   */
  async join(partyId: string, userId: string, data: PartyJoinData): Promise<JoinResult> {
    // Fetch party to validate
    const { data: party, error: partyError } = await supabaseAdmin
      .from('parties')
      .select('id, title, price, status, max_participants, current_participants, recruitment_end, allowed_gender, min_age, max_age')
      .eq('id', partyId)
      .single();

    if (partyError || !party) {
      throw new Error('파티를 찾을 수 없습니다');
    }

    // Validate party status
    if (party.status !== 'recruiting') {
      throw new Error('현재 모집 중인 파티가 아닙니다');
    }

    // Check recruitment period
    const now = new Date().toISOString().split('T')[0];
    if (party.recruitment_end < now) {
      throw new Error('모집 기간이 종료되었습니다');
    }

    // Check capacity
    if (party.current_participants >= party.max_participants) {
      throw new Error('모집 인원이 마감되었습니다');
    }

    // Validate gender restriction
    if (party.allowed_gender !== 'all' && party.allowed_gender !== data.gender) {
      throw new Error('참가 조건에 맞지 않습니다 (성별)');
    }

    // Validate age restriction
    if (party.min_age && data.age < party.min_age) {
      throw new Error(`최소 ${party.min_age}세 이상만 참가 가능합니다`);
    }
    if (party.max_age && data.age > party.max_age) {
      throw new Error(`최대 ${party.max_age}세까지만 참가 가능합니다`);
    }

    // Check if already applied
    const { data: existingApp } = await supabaseAdmin
      .from('party_applications')
      .select('id, status')
      .eq('party_id', partyId)
      .eq('user_id', userId)
      .single();

    if (existingApp && existingApp.status !== 'cancelled') {
      throw new Error('이미 신청한 파티입니다');
    }

    // Create or update application
    const applicationData = {
      party_id: partyId,
      user_id: userId,
      applicant_name: data.applicant_name,
      phone: data.phone,
      instagram_url: data.instagram_url,
      age: data.age,
      gender: data.gender,
      introduction: data.introduction,
      status: 'pending',
      paid_amount: party.price,
      applied_at: new Date().toISOString(),
    };

    let applicationId: string;

    if (existingApp) {
      // Update existing cancelled application
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('party_applications')
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
        .from('party_applications')
        .insert(applicationData)
        .select('id')
        .single();

      if (createError) {
        throw new Error(`신청 생성 실패: ${createError.message}`);
      }
      applicationId = created.id;
    }

    // Generate payment request
    const merchantUid = `party_${partyId}_${Date.now()}`;

    return {
      application_id: applicationId,
      payment_request: {
        merchant_uid: merchantUid,
        amount: Number(party.price),
        name: party.title,
      },
    };
  }

  /**
   * Get applications for a party (for influencer)
   */
  async getApplications(partyId: string, influencerId: string): Promise<{
    summary: {
      pending: number;
      confirmed: number;
      rejected: number;
      cancelled: number;
      max_participants: number;
    };
    items: Array<{
      id: string;
      applicant_name: string;
      phone: string;
      instagram_url: string;
      age: number | null;
      gender: string | null;
      introduction: string | null;
      status: string;
      applied_at: string;
    }>;
  }> {
    // Verify party belongs to influencer
    const { data: party, error: partyError } = await supabaseAdmin
      .from('parties')
      .select('id, max_participants, influencer_id')
      .eq('id', partyId)
      .single();

    if (partyError || !party) {
      throw new Error('파티를 찾을 수 없습니다');
    }

    // Get influencer profile
    const { data: influencerProfile } = await supabaseAdmin
      .from('influencer_profiles')
      .select('id')
      .eq('user_id', influencerId)
      .single();

    if (!influencerProfile || party.influencer_id !== influencerProfile.id) {
      throw new Error('본인의 파티만 조회할 수 있습니다');
    }

    // Fetch applications
    const { data: applications, error: appsError } = await supabaseAdmin
      .from('party_applications')
      .select('id, applicant_name, phone, instagram_url, age, gender, introduction, status, applied_at')
      .eq('party_id', partyId)
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
      max_participants: party.max_participants,
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
}

export const partyService = new PartyService();
export default partyService;
