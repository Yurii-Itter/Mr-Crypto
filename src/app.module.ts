import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TelegramModule } from './telegram/telegram.module';
import { ActionModule } from './actions/actions.module';
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
      }),
      inject: [ConfigService],
    }),
    TelegramModule,
    ActionModule,
    DatabaseModule,
    CryptocurrenciesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
