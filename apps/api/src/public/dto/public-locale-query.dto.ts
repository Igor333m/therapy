import { SUPPORTED_LOCALES, type AppLocale } from '@therapy/shared'
import { IsIn, IsOptional } from 'class-validator'

export class PublicLocaleQueryDto {
  @IsOptional()
  @IsIn(SUPPORTED_LOCALES)
  locale?: AppLocale
}