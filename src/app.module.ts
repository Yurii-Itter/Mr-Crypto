import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TelegramModule } from './telegram/telegram.module';
import { EventModule } from './events/events.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { CryptocurrenciesModule } from './cryptocurrencies/cryptocurrencies.module';

import { ConfigService } from './common/config.service';

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
      }),
      inject: [ConfigService],
    }),
    TelegramModule,
    EventModule,
    DatabaseModule,
    CryptocurrenciesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
