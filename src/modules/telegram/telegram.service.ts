import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { HistoryService } from '../history/history.service';
import * as dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.TELEGRAM_TOKEN;

@Injectable()
export class TelegramService {
  private readonly bot: TelegramBot = new TelegramBot(TOKEN, { polling: true });
  private intervalId: NodeJS.Timeout;

  constructor(private readonly historyService: HistoryService) {
    this.bot.setMyCommands([
      {
        command: 'clear',
        description: 'Очистить контекст переписки.',
      },
      {
        command: 'chats',
        description: 'Показать список чатов',
      },
    ]);

    this.bot.addListener(
      'callback_query',
      async (data: TelegramBot.CallbackQuery) => {
        const { context_id } = JSON.parse(data.data);
        const info = {
          from: {
            id: data.from.id,
            context_id,
          },
        };
        await this.historyService.changeContext(info);
        this.bot.sendMessage(data.message.chat.id, 'Контекст изменен');
      },
    );

    this.bot.on('message', async (data: TelegramBot.Message) => {
      if (!data.text) return;

      try {
        this.bot.sendChatAction(data.chat.id, 'typing');

        this.intervalId = setInterval(() => {
          this.bot.sendChatAction(data.chat.id, 'typing');
        }, 5000);

        if (data.text === '/chats') {
          const allContextes =
            await this.historyService.getAllContextesByUserId(data);

          const buttonsData = allContextes.map((it) => {
            return [
              {
                text: it.message,
                callback_data: JSON.stringify({
                  context_id: it._id,
                }),
              },
            ];
          });

          this.bot.sendMessage(data.chat.id, 'Выберите чат', {
            reply_markup: {
              inline_keyboard: buttonsData,
            },
          });
          clearInterval(this.intervalId);
          return;
        }

        if (data.text === '/clear') {
          this.historyService.createNewContext(data);
          this.bot.sendMessage(data.chat.id, 'Контекст очищен.');
          clearInterval(this.intervalId);
          return;
        }

        const response = await this.historyService.getMessage(data);
        this.bot.sendMessage(data.chat.id, response);
        clearInterval(this.intervalId);
      } catch (error) {
        if (error.message.includes('400')) {
          const res = await this.historyService.getMessage(data, true);
          this.bot.sendMessage(data.chat.id, res);
          clearInterval(this.intervalId);
          return;
        }
        console.log('Unhandled error in tg service: ', error);
        this.historyService.createNewContext(data);
        this.bot.sendMessage(
          data.chat.id,
          'Произошла ошибка: Создан новый контекст',
        );
        clearInterval(this.intervalId);
      }
    });
  }
}
