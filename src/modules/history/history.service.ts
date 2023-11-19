import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { ChatGptService } from '../chatgpt/chatgpt.service';
import { ContextService } from '../database/context/context.service';
import { UserService } from '../database/user/user.service';
import { UserDocument } from '../database/user/user.schema';
import { ContextDocument } from '../database/context/context.schema';

@Injectable()
export class HistoryService {
  constructor(
    private readonly GPT: ChatGptService,
    private readonly contexService: ContextService,
    private readonly userService: UserService,
  ) {}

  getMessage = async (data: TelegramBot.Message, isError?: boolean) => {
    const { contextData } = await this.getUserAndContext(data);
    // console.log(contextData);
    const response = await this.GPT.send(
      isError
        ? contextData.message.slice(
            contextData.message.length - 1800,
            contextData.message.length,
          )
        : contextData.message,
    );
    if (!response) throw Error('Status: 400, message: Bad request');

    const formattedResponse =
      response.slice(0, 7) === 'ChatGPT'
        ? response.replace('ChatGPT: ', '')
        : response;
    await this.contexService.update(contextData._id, {
      message: contextData.message + `ChatGPT: ${formattedResponse}\n`,
    });

    return formattedResponse;
  };

  getUserAndContext = async (data: TelegramBot.Message) => {
    const info: {
      userData: UserDocument;
      contextData: ContextDocument;
    } = {
      userData: null,
      contextData: null,
    };

    info.userData = await this.userService.findOne(data.from.id);
    if (!info.userData) {
      info.userData = await this.userService.create({
        user_id: data.from.id,
        username: data.from.username,
        current_context_id: null,
      });

      info.contextData = await this.contexService.create({
        generating: false,
        user_id: info.userData._id,
        message: null,
      });

      info.userData = await this.userService.update(info.userData._id, {
        current_context_id: info.contextData._id,
      });
    }

    info.contextData = await this.contexService.findById(
      info.userData.current_context_id,
    );
    info.contextData.message
      ? (info.contextData.message += `User: ${data.text}\n`)
      : (info.contextData.message = `User: ${data.text}\n`);

    return info;
  };

  createNewContext = async (data: TelegramBot.Message) => {
    const { userData } = await this.getUserAndContext(data);

    const contextData = await this.contexService.create({
      generating: false,
      user_id: userData._id,
      message: null,
    });

    await this.userService.update(userData._id, {
      current_context_id: contextData._id,
    });
  };

  getAllContextesByUserId = async (data: TelegramBot.Message) => {
    const { userData } = await this.getUserAndContext(data);
    const allContextes = await this.contexService.findAllByUserId(userData._id);
    return allContextes.map((it) => {
      return {
        _id: it._id,
        user_id: it.user_id,
        generating: it.generating,
        message: it.message
          ? it.message.split('\n')[0].replace('User', data.from.first_name)
          : '*Вопрос не был задан*',
      };
    });
  };

  changeContext = async (data: {
    from: { id: number; context_id: string };
  }) => {
    const { userData } = await this.getUserAndContext(
      data as unknown as TelegramBot.Message,
    );
    const newContext = await this.contexService.findByStringId(
      data.from.context_id,
    );
    await this.userService.update(userData._id, {
      current_context_id: newContext._id,
    });
  };
}
