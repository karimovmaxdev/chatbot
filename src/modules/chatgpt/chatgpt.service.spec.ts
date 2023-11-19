import { Test, TestingModule } from '@nestjs/testing';
import { ChatGptService } from './chatgpt.service';

describe('ChatGptService', () => {
  let service: ChatGptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGptService],
    }).compile();

    service = module.get<ChatGptService>(ChatGptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
