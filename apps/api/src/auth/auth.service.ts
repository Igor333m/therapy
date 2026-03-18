import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import type { UserRole } from '@therapy/shared'
import { compare, hash } from 'bcryptjs'
import { randomBytes, randomUUID } from 'node:crypto'
import { Repository } from 'typeorm'
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} from './auth.constants'
import type { LoginDto } from './dto/login.dto'
import type { RegisterDto } from './dto/register.dto'
import type { JwtPayload, Tokens } from './auth.types'
import { User } from '../database/entities'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto): Promise<{
    userId: string
    email: string
    role: UserRole
    emailVerified: boolean
    emailVerificationToken?: string
  }> {
    const normalizedEmail = dto.email.trim().toLowerCase()

    const exists = await this.userRepo.existsBy({ email: normalizedEmail })
    if (exists) {
      throw new BadRequestException('Email already registered')
    }

    const role: UserRole = dto.role ?? 'client'
    const passwordHash = await hash(dto.password, 12)
    const emailVerificationToken = randomBytes(24).toString('hex')
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production'

    const user = this.userRepo.create({
      id: randomUUID(),
      email: normalizedEmail,
      passwordHash,
      role,
      emailVerified: false,
      emailVerificationToken,
      refreshTokenHash: null
    })

    await this.userRepo.save(user)

    // // Only expose the email verification token in non-production environments.
    // TODO: Returning token directly — email provider not wired yet
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      emailVerificationToken: isProduction
         ? undefined
         : emailVerificationToken
    }
  }

  async verifyEmail(token: string): Promise<{ verified: boolean }> {
    const user = await this.userRepo.findOneBy({ emailVerificationToken: token })

    if (!user) {
      throw new BadRequestException('Invalid verification token')
    }

    user.emailVerified = true
    user.emailVerificationToken = null
    await this.userRepo.save(user)

    return { verified: true }
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const normalizedEmail = dto.email.trim().toLowerCase()
    const user = await this.userRepo.findOneBy({ email: normalizedEmail })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const passwordMatch = await compare(dto.password, user.passwordHash)
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email must be verified before login')
    }

    return this.issueTokensForUser(user)
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    const payload = await this.verifyRefreshToken(refreshToken)
    const user = await this.userRepo.findOneBy({ id: payload.sub })

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const valid = await compare(refreshToken, user.refreshTokenHash)
    if (!valid) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return this.issueTokensForUser(user)
  }

  canAccessRole(requesterRole: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(requesterRole)
  }

  private async issueTokensForUser(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified
    }

    const accessSecret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET')
    const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET')

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: ACCESS_TOKEN_EXPIRES_IN
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: REFRESH_TOKEN_EXPIRES_IN
      })
    ])

    user.refreshTokenHash = await hash(refreshToken, 12)
    await this.userRepo.save(user)

    return { accessToken, refreshToken }
  }

  private async verifyRefreshToken(token: string): Promise<JwtPayload> {
    const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET')

    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: refreshSecret
      })
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
