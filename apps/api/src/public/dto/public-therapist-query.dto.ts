import { CORE_SERVICES, SUPPORTED_LOCALES, type AppLocale, type CoreService } from '@therapy/shared'
import { Transform } from 'class-transformer'
import { IsIn, IsOptional, IsString, Matches } from 'class-validator'

const splitCsv = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => splitCsv(item) ?? [])
  }

  if (typeof value !== 'string') {
    return undefined
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export class PublicTherapistQueryDto {
  @IsOptional()
  @IsIn(SUPPORTED_LOCALES)
  locale?: AppLocale

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @Matches(/^[A-Z]{2}$/)
  countryCode?: string

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @Matches(/^[a-z]{2}(?:-[a-z]{2})?$/)
  languageCode?: string

  @IsOptional()
  @Transform(({ value }) => splitCsv(value))
  @IsString({ each: true })
  @IsIn(CORE_SERVICES, { each: true })
  services?: CoreService[]
}