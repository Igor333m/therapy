import { IsISO8601, IsUUID } from 'class-validator';

export class CreateBookingRequestDto {
  @IsUUID('all', { message: 'Invalid therapist' })
  therapistId!: string;

  @IsISO8601()
  startAtUtc!: string;
}
