import { Module } from '@nestjs/common';
import { AgoraService } from './agora.service';
import { AgoraWebhookController } from './agora.webhook.controller';

@Module({
  controllers: [AgoraWebhookController],
  providers: [AgoraService],
  exports: [AgoraService]
})
export class AgoraModule {}
