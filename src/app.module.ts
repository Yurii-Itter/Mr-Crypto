import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './telegram/telegram.module';
import { ActionModule } from './actions/actions.module';

@Module({
  imports: [ConfigModule.forRoot(), TelegramModule, ActionModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
