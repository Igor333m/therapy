import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class SessionsService {
  async createBookingRequest(input: {
    clientId: string;
    therapistId: string;
    startAtUtc: string;
  }): Promise<{ bookingId: string; status: 'pending_therapist_confirmation' }> {
    void input;

    return {
      bookingId: randomUUID(),
      status: 'pending_therapist_confirmation'
    };
  }
}
