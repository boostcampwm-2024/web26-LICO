import { InjectRedis } from '@nestjs-modules/ioredis';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UUID } from 'crypto';
import Redis from 'ioredis';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async ingestChat({
    channelId,
    message,
    userId,
    nickname,
  }: {
    channelId;
    message: string;
    userId: number;
    nickname: string;
  }) {
    const chatId = crypto.randomUUID();
    const chat = {
      content: message,
      userId,
      nickname,
      timestamp: new Date(),
      channelId,
      chatId,
      filteringResult: true,
    };
    const chatString = JSON.stringify(chat);
    await this.redisClient
      .multi()
      .publish(`${channelId}:chat`, chatString)
      .rpush(`${channelId}:chatQueue`, chatId)
      .exec();
    this.clovaFiltering(chat);
  }

  async readViewers(channelId: UUID) {
    return await this.redisClient.hlen(`${channelId}:viewers`);
  }

  async clearChat(channelId: UUID) {
    this.redisClient.del(
      `${channelId}:viewers`,
      `${channelId}:chats`,
      `${channelId}:chatQueue`,
      `${channelId}:chatCache`,
    );
  }

  async clovaFiltering(chat) {
    const postData = {
      messages: [
        {
          role: 'system',
          content: this.configService.get<string>('CLOVA_CHAT_FILTERING_SYSTEM_PROMPT'),
        },
        {
          role: 'user',
          content: `채팅내용 : "${chat.content}"`,
        },
      ],
      maxTokens: this.configService.get<number>('CLOVA_CHAT_FILTERING_MAX_TOKEN') || 10,
      topP: 0.8,
      topK: 1,
      temperature: 0.1,
      repeatPenalty: 1.0,
      includeAiFilters: true,
      seed: 0,
    };
    const { data } = await firstValueFrom(
      this.httpService.post(this.configService.get<string>('CLOVA_API_URL'), postData, {
        headers: {
          'X-NCP-CLOVASTUDIO-API-KEY': this.configService.get<string>('CLOVA_API_KEY'),
          'X-NCP-APIGW-API-KEY': this.configService.get<string>('CLOVA_API_GATEWAY_KEY'),
          'X-NCP-CLOVASTUDIO-REQUEST-ID': this.configService.get<string>('CLOVA_REQUEST_ID'),
        },
      }),
    );

    chat.filteringResult = data?.result?.message?.content?.includes('true');
    await this.redisClient
      .multi()
      .publish(
        `${chat.channelId}:filter`,
        JSON.stringify({ chatId: chat.chatId, filteringResult: chat.filteringResult }),
      )
      .hset(`${chat.channelId}:chatCache`, chat.chatId, JSON.stringify(chat))
      .exec();
    this.flushChat(chat.channelId);
  }

  async flushChat(channelId) {
    const lockKey = `${channelId}:flush:lock`;
    const lock = await this.redisClient.set(lockKey, 'lock', 'NX');
    const redisQueueKey = `${channelId}:chatQueue`;
    const redisCacheKey = `${channelId}:chatCache`;

    try {
      if (lock) {
        while (true) {
          const frontChatId = await this.redisClient.lindex(redisQueueKey, 0);
          const chatString = await this.redisClient.hget(redisCacheKey, frontChatId);
          if (!chatString) {
            break;
          } else {
            const chat = JSON.parse(chatString);
            await this.redisClient.multi().rpush(`${chat.channelId}:chats`, chatString).lpop(redisQueueKey).exec();
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      await this.redisClient.del(lockKey);
    }
  }
}
