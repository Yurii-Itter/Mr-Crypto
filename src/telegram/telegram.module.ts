import { Module, forwardRef } from '@nestjs/common';

import { CommonModule } from '../common/common.module';
import { CryptocurrenciesModule } from '../cryptocurrencies/cryptocurrencies.module';

import { TelegramService } from './telegram.service';

@Module({
  imports: [forwardRef(() => CommonModule), CryptocurrenciesModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {
  constructor(telegramService: TelegramService) {
    telegramService.launch();
  }
}
