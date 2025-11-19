export interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  profileImage?: string;
  role: 'user' | 'influencer' | 'admin';
  provider: 'kakao' | 'naver';
  providerId: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}
