import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { ChatInterface } from './interfaces/chat.interface';
import { MessageInterface } from '../message/interfaces/message.interface';

@Injectable()
export class DatabaseService {

    constructor(@InjectModel('Chat') private readonly chatModel: Model<ChatInterface>) { }

    public async ensureChat({ chatId, fullName, lang }: MessageInterface): Promise<ChatInterface> {
        
        let chat: ChatInterface = await this.chatModel.findOne({ chatId });

        if (chat) { return chat }

        chat = new this.chatModel({ chatId, fullName, lang, p: false });
        return chat.save();
    }
}