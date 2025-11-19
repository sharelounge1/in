import { supabaseAdmin } from '../config/supabase';
import {
  Profile,
  UpdateProfileRequest,
  NotificationSettings,
  Notification,
  ActiveTravel,
  PaginatedResponse,
} from '../types';

class UserService {
  /**
   * Get user profile with stats
   */
  async getProfile(userId: string): Promise<Profile> {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      throw new Error('USER_NOT_FOUND');
    }

    return this.mapProfileFromDb(profile);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<Profile> {
    // Check nickname uniqueness if being updated
    if (data.nickname) {
      const { data: existingNickname } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('nickname', data.nickname)
        .neq('id', userId)
        .single();

      if (existingNickname) {
        throw new Error('NICKNAME_ALREADY_EXISTS');
      }
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.nickname !== undefined) updateData.nickname = data.nickname;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
    if (data.instagramUrl !== undefined) updateData.instagram_url = data.instagramUrl;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.birthDate !== undefined) updateData.birth_date = data.birthDate;

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error || !profile) {
      throw new Error('UPDATE_FAILED');
    }

    return this.mapProfileFromDb(profile);
  }

  /**
   * Check if nickname is available
   */
  async checkNicknameAvailable(nickname: string): Promise<boolean> {
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('nickname', nickname)
      .single();

    return !existing;
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(
    userId: string,
    settings: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    // Get current settings
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('notification_settings')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      throw new Error('USER_NOT_FOUND');
    }

    const currentSettings = profile.notification_settings || {
      push: true,
      email: true,
      sms: true,
    };

    const newSettings = {
      ...currentSettings,
      ...settings,
    };

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        notification_settings: newSettings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new Error('UPDATE_FAILED');
    }

    return newSettings;
  }

  /**
   * Save terms agreement
   */
  async saveTermsAgreement(
    userId: string,
    agreements: {
      serviceTerms: boolean;
      privacyPolicy: boolean;
      thirdPartySharing: boolean;
      marketing: boolean;
    }
  ): Promise<void> {
    // Store in a separate table or as JSONB in profiles
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        terms_agreed_at: new Date().toISOString(),
        marketing_agreed: agreements.marketing,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new Error('UPDATE_FAILED');
    }
  }

  /**
   * Get user's course applications
   */
  async getApplications(
    userId: string,
    type?: 'course' | 'party',
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<unknown>> {
    const offset = (page - 1) * limit;

    if (!type || type === 'course') {
      const { data: applications, error, count } = await supabaseAdmin
        .from('course_applications')
        .select(`
          id,
          status,
          applied_at,
          paid_amount,
          courses (
            id,
            title,
            thumbnail_url,
            start_date,
            end_date,
            status
          )
        `, { count: 'exact' })
        .eq('user_id', userId)
        .order('applied_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error('FETCH_FAILED');
      }

      return {
        items: applications || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    }

    // Party applications
    const { data: applications, error, count } = await supabaseAdmin
      .from('party_applications')
      .select(`
        id,
        status,
        applied_at,
        paid_amount,
        parties (
          id,
          title,
          thumbnail_url,
          event_date,
          status
        )
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('applied_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error('FETCH_FAILED');
    }

    return {
      items: applications || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  /**
   * Get user's active/ongoing travels
   */
  async getActiveTravels(userId: string): Promise<ActiveTravel[]> {
    // Get confirmed applications for ongoing/upcoming courses
    const { data: applications, error } = await supabaseAdmin
      .from('course_applications')
      .select(`
        id,
        courses (
          id,
          title,
          thumbnail_url,
          start_date,
          end_date,
          status
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .in('courses.status', ['recruiting', 'ongoing']);

    if (error) {
      throw new Error('FETCH_FAILED');
    }

    const activeTravels: ActiveTravel[] = [];

    for (const app of applications || []) {
      const course = app.courses as unknown as {
        id: string;
        title: string;
        thumbnail_url: string;
        start_date: string;
        end_date: string;
        status: string;
      };

      if (!course) continue;

      // Get expense balance
      const { data: expense } = await supabaseAdmin
        .from('course_participants_expenses')
        .select('balance')
        .eq('course_id', course.id)
        .eq('user_id', userId)
        .single();

      // Check for new announcements
      const { data: lastRead } = await supabaseAdmin
        .from('announcement_reads')
        .select('last_read_at')
        .eq('course_id', course.id)
        .eq('user_id', userId)
        .single();

      const { data: newAnnouncements } = await supabaseAdmin
        .from('course_announcements')
        .select('id')
        .eq('course_id', course.id)
        .gt('created_at', lastRead?.last_read_at || '1970-01-01')
        .limit(1);

      activeTravels.push({
        id: app.id,
        course: {
          id: course.id,
          title: course.title,
          thumbnailUrl: course.thumbnail_url,
          startDate: course.start_date,
          endDate: course.end_date,
        },
        hasNewAnnouncement: (newAnnouncements?.length || 0) > 0,
        expenseBalance: expense?.balance || 0,
      });
    }

    return activeTravels;
  }

  /**
   * Get user notifications
   */
  async getNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Notification>> {
    const offset = (page - 1) * limit;

    const { data: notifications, error, count } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error('FETCH_FAILED');
    }

    const mappedNotifications: Notification[] = (notifications || []).map((n) => ({
      id: n.id,
      userId: n.user_id,
      type: n.type,
      title: n.title,
      message: n.message,
      data: n.data,
      isRead: n.is_read,
      readAt: n.read_at,
      sentPush: n.sent_push,
      sentEmail: n.sent_email,
      sentSms: n.sent_sms,
      createdAt: n.created_at,
    }));

    return {
      items: mappedNotifications,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId: string, userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error('UPDATE_FAILED');
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      throw new Error('UPDATE_FAILED');
    }
  }

  /**
   * Delete user account (soft delete)
   */
  async deleteAccount(
    userId: string,
    reason?: string,
    feedback?: string
  ): Promise<void> {
    // Check for active applications/payments
    const { data: activeApps } = await supabaseAdmin
      .from('course_applications')
      .select('id')
      .eq('user_id', userId)
      .in('status', ['pending', 'confirmed'])
      .limit(1);

    if (activeApps && activeApps.length > 0) {
      throw new Error('ACTIVE_APPLICATIONS_EXIST');
    }

    // Save withdrawal info
    await supabaseAdmin
      .from('user_withdrawals')
      .insert({
        user_id: userId,
        reason,
        feedback,
        withdrawn_at: new Date().toISOString(),
      });

    // Soft delete user
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        status: 'deleted',
        email: `deleted_${userId}@deleted.com`,
        phone: null,
        name: null,
        nickname: `탈퇴회원_${userId.substring(0, 8)}`,
        avatar_url: null,
        instagram_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new Error('DELETE_FAILED');
    }

    // Delete refresh tokens
    await supabaseAdmin
      .from('refresh_tokens')
      .delete()
      .eq('user_id', userId);
  }

  /**
   * Get unread notification count
   */
  async getUnreadNotificationCount(userId: string): Promise<number> {
    const { count, error } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      throw new Error('FETCH_FAILED');
    }

    return count || 0;
  }

  /**
   * Map database profile to Profile type
   */
  private mapProfileFromDb(dbProfile: Record<string, unknown>): Profile {
    return {
      id: dbProfile.id as string,
      email: dbProfile.email as string,
      phone: dbProfile.phone as string | undefined,
      phoneVerified: dbProfile.phone_verified as boolean,
      name: dbProfile.name as string | undefined,
      nickname: dbProfile.nickname as string | undefined,
      avatarUrl: dbProfile.avatar_url as string | undefined,
      instagramUrl: dbProfile.instagram_url as string | undefined,
      gender: dbProfile.gender as string | undefined,
      birthDate: dbProfile.birth_date as string | undefined,
      bio: dbProfile.bio as string | undefined,
      role: dbProfile.role as 'user' | 'influencer' | 'admin',
      status: dbProfile.status as 'active' | 'suspended' | 'deleted',
      notificationSettings: (dbProfile.notification_settings as NotificationSettings) || {
        push: true,
        email: true,
        sms: true,
      },
      createdAt: dbProfile.created_at as string,
      updatedAt: dbProfile.updated_at as string,
    };
  }
}

export const userService = new UserService();
export default userService;
