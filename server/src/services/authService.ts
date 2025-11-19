import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';
import {
  AuthTokens,
  UserRole,
  Profile,
  RegisterRequest,
  LoginRequest,
  JwtPayload,
  RefreshTokenPayload,
} from '../types';

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES_IN = 900; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60; // 7 days in seconds

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<{
    tokens: AuthTokens;
    user: Partial<Profile>;
  }> {
    const { email, password, name, phone } = data;

    // Check if email already exists
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw new Error('REGISTRATION_FAILED');
    }

    const userId = authData.user.id;

    // Create profile in profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email,
        name,
        phone,
        role: 'user' as UserRole,
        status: 'active',
        notification_settings: {
          push: true,
          email: true,
          sms: true,
        },
      });

    if (profileError) {
      // Rollback: delete auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw new Error('PROFILE_CREATION_FAILED');
    }

    // Store hashed password (in a separate table or use Supabase's built-in)
    // For this implementation, we rely on Supabase Auth's password handling

    // Generate tokens
    const tokens = await this.generateTokens(userId, email, 'user');

    return {
      tokens,
      user: {
        id: userId,
        email,
        name,
        phone,
        role: 'user',
        status: 'active',
      },
    };
  }

  /**
   * Login user with email and password
   */
  async login(data: LoginRequest): Promise<{
    tokens: AuthTokens;
    user: Partial<Profile>;
  }> {
    const { email, password } = data;

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('USER_NOT_FOUND');
    }

    if (profile.status === 'suspended') {
      throw new Error('ACCOUNT_SUSPENDED');
    }

    if (profile.status === 'deleted') {
      throw new Error('ACCOUNT_DELETED');
    }

    // Generate tokens
    const tokens = await this.generateTokens(
      profile.id,
      profile.email,
      profile.role as UserRole
    );

    return {
      tokens,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        nickname: profile.nickname,
        avatarUrl: profile.avatar_url,
        role: profile.role,
        status: profile.status,
      },
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    // Verify refresh token
    let decoded: RefreshTokenPayload;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_SECRET) as RefreshTokenPayload;
    } catch {
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    if (decoded.type !== 'refresh') {
      throw new Error('INVALID_TOKEN_TYPE');
    }

    // Check if refresh token is valid in database
    const { data: tokenRecord, error: tokenError } = await supabaseAdmin
      .from('refresh_tokens')
      .select('*')
      .eq('user_id', decoded.sub)
      .eq('token', refreshToken)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (tokenError || !tokenRecord) {
      throw new Error('REFRESH_TOKEN_EXPIRED');
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, status')
      .eq('id', decoded.sub)
      .single();

    if (profileError || !profile) {
      throw new Error('USER_NOT_FOUND');
    }

    if (profile.status !== 'active') {
      throw new Error('ACCOUNT_NOT_ACTIVE');
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(
      profile.id,
      profile.email,
      profile.role as UserRole
    );

    return {
      accessToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    };
  }

  /**
   * Logout user by invalidating refresh token
   */
  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Delete specific refresh token
      await supabaseAdmin
        .from('refresh_tokens')
        .delete()
        .eq('user_id', userId)
        .eq('token', refreshToken);
    } else {
      // Delete all refresh tokens for user
      await supabaseAdmin
        .from('refresh_tokens')
        .delete()
        .eq('user_id', userId);
    }
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(
    userId: string,
    email: string,
    role: UserRole
  ): Promise<AuthTokens> {
    const accessToken = this.generateAccessToken(userId, email, role);
    const refreshToken = this.generateRefreshToken(userId);

    // Store refresh token in database
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000).toISOString();

    await supabaseAdmin
      .from('refresh_tokens')
      .insert({
        id: uuidv4(),
        user_id: userId,
        token: refreshToken,
        expires_at: expiresAt,
      });

    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    };
  }

  /**
   * Generate access token
   */
  private generateAccessToken(userId: string, email: string, role: UserRole): string {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      role,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(userId: string): string {
    const payload: Omit<RefreshTokenPayload, 'iat' | 'exp'> = {
      sub: userId,
      type: 'refresh',
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  /**
   * Verify identity (phone verification via Iamport)
   */
  async verifyIdentity(
    userId: string,
    impUid: string,
    name: string,
    phone: string,
    birthDate: string,
    gender: string
  ): Promise<boolean> {
    // TODO: Verify with Iamport API
    // const isValid = await iamportService.verifyIdentity(impUid);
    // if (!isValid) throw new Error('VERIFICATION_FAILED');

    // Update user profile with verified info
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        name,
        phone,
        phone_verified: true,
        birth_date: birthDate,
        gender,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new Error('UPDATE_FAILED');
    }

    return true;
  }
}

export const authService = new AuthService();
export default authService;
