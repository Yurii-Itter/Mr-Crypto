import { Model } from 'mongoose';
import * as moment from 'moment';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';

import { ChatInterface } from './interfaces/chat.interface';
import { SubscriptionsInterface } from './interfaces/subscriptions.interface';

import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class DatabaseService {
  private logger: Logger;

  private chatModel: Model<ChatInterface>;

  constructor(
    @InjectModel('Chat') chatModel: Model<ChatInterface>,
    logger: Logger,
  ) {
    this.logger = logger;
    this.chatModel = chatModel;
  }

  public async ensureChat(chat: CreateChatDto): Promise<ChatInterface> {
    try {
      const existedChat = await this.chatModel.findOne({ id: chat.id });
      return existedChat ? existedChat : this.chatModel.create(chat);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async findSubscriptions(): Promise<SubscriptionsInterface[]> {
    try {
      return this.chatModel.aggregate([
        { $unwind: '$subscriptions' },
        { $unwind: '$subscriptions.period.days' },
        {
          $redact: {
            $cond: {
              if: {
                $and: [
                  {
                    $eq: [
                      {
                        $isoDayOfWeek: {
                          date: '$$NOW',
                          timezone: '$timeZoneId',
                        },
                      },
                      '$subscriptions.period.days',
                    ],
                  },
                  {
                    $eq: [
                      { $hour: { date: '$$NOW', timezone: '$timeZoneId' } },
                      '$subscriptions.period.hour',
                    ],
                  },
                  {
                    $eq: [
                      { $minute: { date: '$$NOW', timezone: '$timeZoneId' } },
                      '$subscriptions.period.minute',
                    ],
                  },
                ],
              },
              then: '$$KEEP',
              else: '$$PRUNE',
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              id: '$id',
              language_code: '$language_code',
              symbol: '$subscriptions.symbol',
            },
          },
        },
      ]);
    } catch (error) {
      this.logger.log(error);
    }
  }
}
