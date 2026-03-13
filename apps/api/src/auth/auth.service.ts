import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { UserRole } from '@therapy/shared';
import { compare, hash } from 'bcryptjs';
import { randomBytes, randomUUID } from 'node:crypto';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} from './auth.constants';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { InMemoryUser } from './in-memory-user.interface';
import type { JwtPayload, Tokens } from './auth.types';

@Injectable()
export class AuthService {
  private readonly usersByEmail = new Map<string, InMemoryUser>();
  private readonly usersByVerifyToken = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto): Promise<{
    userId: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    emailVerificationToken: string;
  }> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    if (this.usersByEmail.has(normalizedEmail)) {
      throw new BadRequestException('Email already registered');
    }

    const role: UserRole = dto.role ?? 'client';
    const passwordHash = await hash(dto.password, 12);
    const emailVerificationToken = randomBytes(24).toString('hex');

    const user: InMemoryUser = {
      id: randomUUID(),
      email: normalizedEmail,
      passwordHash,
      role,
      emailVerified: false,
      emailVerificationToken,
      createdAt: new Date()
    };

    this.usersByEmail.set(normalizedEmail, user);
    this.usersByVerifyToken.set(emailVerificationToken, normalizedEmail);

    // Returning token now because email provider is not wired in this phase yet.
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      emailVerificationToken
    };
  }

  async verifyEmail(token: string): Promise<{ verified: boolean }> {
    const email = this.usersByVerifyToken.get(token);

    if (!email) {
      throw new BadRequestException('Invalid verification token');
    }

    const user = this.usersByEmail.get(email);
    if (!user) {
      throw new BadRequestException('User not found for token');
    }

    user.emailVerified = true;
    this.usersByVerifyToken.delete(token);

    return { verified: true };
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const user = this.usersByEmail.get(normalizedEmail);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email must be verified before login');
    }

    return this.issueTokensForUser(user);
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const user = Array.from(this.usersByEmail.values()).find(
      (entry) => entry.id === payload.sub
    );

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const validStoredToken = await compare(refreshToken, user.refreshTokenHash);
    if (!validStoredToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokensForUser(user);
  }

  canAccessRole(requesterRole: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(requesterRole);
  }

  private async issueTokensForUser(user: InMemoryUser): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified
    };

    const accessSecret = this.configService.getOrThrow<string>(
      'JWT_ACCESS_SECRET'
    );
    const refreshSecret = this.configService.getOrThrow<string>(
      'JWT_REFRESH_SECRET'
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: ACCESS_TOKEN_EXPIRES_IN
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: REFRESH_TOKEN_EXPIRES_IN
      })
    ]);

    user.refreshTokenHash = await hash(refreshToken, 12);

    return { accessToken, refreshToken };
  }

  private async verifyRefreshToken(token: string): Promise<JwtPayload> {
    const refreshSecret = this.configService.getOrThrow<string>(
      'JWT_REFRESH_SECRET'
    );

    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: refreshSecret
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
