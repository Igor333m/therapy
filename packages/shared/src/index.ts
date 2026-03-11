export type UserRole = 'client' | 'therapist' | 'moderator';

export type AppLocale = 'en' | 'sr';

export const SUPPORTED_LOCALES: readonly AppLocale[] = ['en', 'sr'];

export const CORE_SERVICES = [
  'individual',
  'couples',
  'teen',
  'coping-with-move'
] as const;

export type CoreService = (typeof CORE_SERVICES)[number];

export interface TherapistFilter {
  locale: AppLocale;
  countryCode: string;
  services?: CoreService[];
}
