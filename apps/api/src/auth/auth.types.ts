import type { UserRole } from '@therapy/shared';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
}

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
