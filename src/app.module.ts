import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramModule } from './modules/telegram/telegram.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://mongo:27017'), TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
