import { Injectable } from '@nestjs/common';

@Injectable()
export class AgoraService {
  async createRtcToken(input: { channelName: string; uid: string; expiresInSeconds: number }): Promise<string> {
    // Placeholder until Agora AccessToken2 generation is wired in.
    return `rtc-token:${input.channelName}:${input.uid}:${input.expiresInSeconds}`;
  }

  async handleRecordingUploaded(payload: unknown): Promise<void> {
    // Placeholder for webhook signature validation and queue dispatch.
    void payload;
  }
}
