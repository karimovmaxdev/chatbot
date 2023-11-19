import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ChatGptModule } from '../chatgpt/chatgpt.module';
import { ContexModule } from '../database/context/context.module';
import { UserModule } from '../database/user/user.module';

@Module({
  imports: [ChatGptModule, ContexModule, UserModule],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
