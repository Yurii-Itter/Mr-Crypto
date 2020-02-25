import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';

import { CHAT_MODEL } from '../constants';

import { ChatInterface } from '../interfaces/chat.interface';

import { CreateChatDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { TargetChatDto } from '../dto/target-chat.dto';
import { GetChatDto } from '../dto/get-chat.dto';

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

    async update(targetChatDto: TargetChatDto, updateChatDto: UpdateChatDto): Promise<any> {
        return await this.ChatModel.update({ targetChatDto }, { updateChatDto })
    }

    async delete(deleteChatDto: TargetChatDto): Promise<any> {
        return await this.ChatModel.deleteOne({ deleteChatDto });
    }

    async get(getChatDto: GetChatDto): Promise<Array<ChatInterface>> {
        return await this.ChatModel.find(getChatDto);
    }
}