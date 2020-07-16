import { Model } from 'mongoose';

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ChatInterface } from './interfaces/chat.interface';

import { TimeZoneDto } from './dto/time-zone.dto';
import { CreateChatDto } from './dto/create-chat.dto';
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
    return this.chatModel.findOneAndUpdate({ chatId }, { $push: { sub } });
  }
}
