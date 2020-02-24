import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TelegramModule } from './telegram/telegram.module';
import { ActionModule } from './actions/actions.module';
import { CatsModule } from './database/chat/chat.module';

@Module({
  imports: [ConfigModule.forRoot(), TelegramModule, ActionModule, CatsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
