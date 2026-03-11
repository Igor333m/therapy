import { Injectable } from '@nestjs/common';
import type { UserRole } from '@therapy/shared';

@Injectable()
export class AuthService {
  canAccessRole(requesterRole: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(requesterRole);
  }
}
