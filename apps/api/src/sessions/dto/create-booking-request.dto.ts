import { IsISO8601, IsString, MinLength } from 'class-validator';

export class CreateBookingRequestDto {
  @IsString()
  @MinLength(5)
  therapistId!: string;

  @IsISO8601()
  startAtUtc!: string;
}
