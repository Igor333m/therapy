import type { UserRole } from '@therapy/shared';
import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

class RoleEnum {
  static readonly CLIENT = 'client';
  static readonly THERAPIST = 'therapist';
  static readonly MODERATOR = 'moderator';
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsIn([RoleEnum.CLIENT, RoleEnum.THERAPIST, RoleEnum.MODERATOR])
  role?: UserRole;
}
