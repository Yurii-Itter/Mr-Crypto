import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseService } from './database.service';
import { CommonModule } from '../common/common.module';

import { ChatSchema } from './schemas/chat.schema';

@Module({
  imports: [
    forwardRef(() => CommonModule),
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
