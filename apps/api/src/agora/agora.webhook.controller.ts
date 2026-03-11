import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AgoraService } from './agora.service';

@Controller('webhooks/agora')
export class AgoraWebhookController {
  constructor(private readonly agoraService: AgoraService) {}

  @Post('recording')
  @HttpCode(202)
  async onRecordingWebhook(@Body() payload: unknown): Promise<{ accepted: boolean }> {
    await this.agoraService.handleRecordingUploaded(payload);
    return { accepted: true };
  }
}
