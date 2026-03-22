import { SUPPORTED_LOCALES, type AppLocale } from '@therapy/shared'
import { Transform } from 'class-transformer'
import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator'

export class CreateContactInquiryDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @MaxLength(320)
  email: string

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string

  @IsIn(SUPPORTED_LOCALES)
  locale: AppLocale

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  therapistSlug?: string
}