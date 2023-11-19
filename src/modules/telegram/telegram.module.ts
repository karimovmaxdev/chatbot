import { Module } from '@nestjs/common';
import { HistoryModule } from '../history/history.module';
import { TelegramService } from './telegram.service';

@Module({
  imports: [HistoryModule],
  providers: [TelegramService],
})
export class TelegramModule {}
