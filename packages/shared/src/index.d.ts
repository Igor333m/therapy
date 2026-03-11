export type UserRole = 'client' | 'therapist' | 'moderator';
export type AppLocale = 'en' | 'sr';
export declare const SUPPORTED_LOCALES: readonly AppLocale[];
export declare const CORE_SERVICES: readonly ["individual", "couples", "teen", "coping-with-move"];
export type CoreService = (typeof CORE_SERVICES)[number];
export interface TherapistFilter {
    locale: AppLocale;
    countryCode: string;
    services?: CoreService[];
}
