import { Injectable } from '@nestjs/common';

@Injectable()
export class TranscriptionService {
  async enqueueAsyncTranscription(input: { recordingUrl: string; sessionId: string }): Promise<void> {
    // Placeholder for BullMQ + AssemblyAI async pipeline.
    void input;
  }
}
