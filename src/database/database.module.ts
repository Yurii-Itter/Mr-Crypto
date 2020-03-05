import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseService } from './database.service';

import { ChatSchema } from './schemas/chat.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'Chat', schema: ChatSchema }
    ])],
    providers: [DatabaseService],
    exports: [DatabaseService]
})
export class DatabaseModule { }