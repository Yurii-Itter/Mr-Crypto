import { Module, forwardRef } from '@nestjs/common';

import { CommonModule } from '../common/common.module';
import { ExchangeModule } from '../exchanges/exchange.module';

import { TelegramService } from './telegram.service';

@Module({
  imports: [forwardRef(() => CommonModule), ExchangeModule],
  providers: [
    TelegramService,
    {
      provide: 'TelegramServiceInstance',
      useFactory: async (telegramService: TelegramService) => {
        await telegramService.launch();
        return telegramService;
      },
      inject: [TelegramService],
    },
  ],
  exports: ['TelegramServiceInstance'],
})
export class TelegramModule {}
