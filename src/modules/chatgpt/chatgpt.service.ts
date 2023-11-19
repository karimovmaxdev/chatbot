import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

@Injectable()
export class ChatGptService {
  private readonly chatAPI: OpenAI = new OpenAI({ apiKey: API_KEY });

  send = async (msg: string) => {
    try {
      this.chatAPI.apiKey = API_KEY;
      const response = await this.chatAPI.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: msg,
          },
        ],
        model: 'gpt-3.5-turbo',
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.log('gpt serivce error: ', error);
    }
  };
}
