import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';

import * as moment from 'moment';

import { ChatInterface } from './interfaces/chat.interface';
import { SubscriptionsInterface } from './interfaces/subscriptions.interface';

import { CreateChatDto } from './dto/create-chat.dto';
import { TimeZoneDto } from './dto/time-zone.dto';
import { UnsubDto } from './dto/unsub.dto';
import { SubDto } from './dto/sub.dto';

@Injectable()
export class DatabaseService {
  private logger: Logger;

  constructor(
    @InjectModel('Chat') private readonly chatModel: Model<ChatInterface>,
    logger: Logger,
  ) {
    this.logger = logger;
  }

  public async ensureChat({
    chatId,
    firstName,
    lastName,
    lang,
  }: CreateChatDto): Promise<ChatInterface> {
    try {
      const chat: ChatInterface = await this.chatModel.findOne({ chatId });
      return chat
        ? chat
        : new this.chatModel({ chatId, firstName, lastName, lang }).save();
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async setTimezone({
    chatId,
    timeZone: { dstOffset, rawOffset, timeZoneId, timeZoneName },
  }: TimeZoneDto): Promise<ChatInterface> {
    try {
      return this.chatModel.findOneAndUpdate(
        { chatId },
        { $set: { dstOffset, rawOffset, timeZoneId, timeZoneName } },
      );
    } catch (error) {
      this.logger.log(error);
    }
  }

  public async sub({ chatId, sub }: SubDto): Promise<ChatInterface> {
    try {
      return this.chatModel.findOneAndUpdate({ chatId }, { $push: { sub } });
    } catch (error) {
      this.logger.log(error);
    }
  }

  public async unsub({ chatId, symbol }: UnsubDto): Promise<ChatInterface> {
    try {
      return this.chatModel.findOneAndUpdate(
        { chatId },
        { $pull: { sub: { symbol } } },
      );
    } catch (error) {
      this.logger.log(error);
    }
  }

  public async subscriptions(): Promise<SubscriptionsInterface[]> {
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
