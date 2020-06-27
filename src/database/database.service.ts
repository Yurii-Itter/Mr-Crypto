import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { ChatInterface } from './interfaces/chat.interface';

import { CreateChatDto } from './dto/create-chat.dto';
import { SubDto } from './dto/sub.dto';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel('Chat') private readonly chatModel: Model<ChatInterface>,
  ) {}

  public async ensureChat({
    chatId,
    fullName,
    lang,
  }: CreateChatDto): Promise<ChatInterface> {
    let chat: ChatInterface = await this.chatModel.findOne({ chatId });

    if (chat) {
      return chat;
    }

    chat = new this.chatModel({ chatId, fullName, lang, p: false });
    return chat.save();
  }

  public async sub({ chatId, sub }: SubDto): Promise<ChatInterface> {
    return this.chatModel.findOneAndUpdate({ chatId }, { $push: { sub } });
  }
}
