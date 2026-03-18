import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../database/entities'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { JwtRolesGuard } from './guards/jwt-roles.guard'
import { ACCESS_TOKEN_EXPIRES_IN } from './auth.constants'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    JwtRolesGuard
  ],
  exports: [AuthService, JwtAuthGuard, RolesGuard, JwtRolesGuard]
})
export class AuthModule {}
