import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Injectable()
export class JwtRolesGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly rolesGuard: RolesGuard
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // JwtAuthGuard will populate request.user or throw 401.
    const authenticated = await this.jwtAuthGuard.canActivate(context);
    if (!authenticated) return false;

    // RolesGuard reads request.user + @Roles metadata.
    return this.rolesGuard.canActivate(context);
  }
}