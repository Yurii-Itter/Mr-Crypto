import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigService } from './common/config.service';

import { EventModule } from './events/events.module';
import { CommonModule } from './common/common.module';
import { TelegramModule } from './telegram/telegram.module';
import { DatabaseModule } from './database/database.module';
import { ExchangeModule } from './exchanges/exchange.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [CommonModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DATABASE_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    EventModule,
    DatabaseModule,
    ExchangeModule,
    TelegramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
