import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';

import { CHAT_MODEL } from '../constants';
import { ChatInterface } from '../interfaces/chat.interface';
import { CreateChatDto } from '../dto/create-chat.dto';

@Injectable()
export class ChatService {
    constructor(
        @Inject(CHAT_MODEL)
        private readonly ChatModel: Model<ChatInterface>,
    ) { }

    async create(createChatDto: CreateChatDto): Promise<ChatInterface> {
        const createdChat = new this.ChatModel(createChatDto);
        return createdChat.save();
    }
}