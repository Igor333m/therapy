import type { UserRole } from '@therapy/shared';

export interface InMemoryUser {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  emailVerified: boolean;
  emailVerificationToken: string;
  refreshTokenHash?: string;
  createdAt: Date;
}
