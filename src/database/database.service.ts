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

  public async findChat(id: number): Promise<ChatInterface> {
    try {
      return this.chatModel.findOne({ id });
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async createChat(chat: CreateChatDto): Promise<ChatInterface> {
    try {
      return this.chatModel.create(chat);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async findSubscriptions(): Promise<SubscriptionsInterface[]> {
    try {
      return this.chatModel.aggregate([
        { $unwind: '$sub' },
        { $unwind: '$sub.period.days' },
        {
          $set: {
            date: {
              $toDate: {
                $multiply: [
                  1000,
                  {
                    $add: [
                      moment()
                        .utc()
                        .unix(),
                      {
                        $add: ['$timeZone.dstOffset', '$timeZone.rawOffset'],
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
        {
          $redact: {
            $cond: {
              if: {
                $and: [
                  { $eq: [{ $isoDayOfWeek: '$date' }, '$sub.period.days'] },
                  { $eq: [{ $hour: '$date' }, '$sub.period.hour'] },
                  { $eq: [{ $minute: '$date' }, '$sub.period.minute'] },
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
              chatId: '$chatId',
              symbol: '$sub.symbol',
              lang: '$lang',
              firstName: '$firstName',
              lastName: '$lastName',
            },
          },
        },
      ]);
    } catch (error) {
      this.logger.log(error);
    }
  }
}
