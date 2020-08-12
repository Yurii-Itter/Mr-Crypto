import { Module } from '@nestjs/common';

import { ExchangeService } from './exchange.service';

import { CommonModule } from '../common/common.module';
import { BinanceModule } from './binance/binance.module';
import { CoinbaseModule } from './coinbase/coinbase.module';

@Module({
  imports: [CommonModule, BinanceModule, CoinbaseModule],
  providers: [
    ExchangeService,
    {
      provide: 'ExchangeServiceInstance',
      useFactory: (exchangeService: ExchangeService) => {
        return exchangeService;
      },
      inject: [ExchangeService],
    },
  ],
  exports: ['ExchangeServiceInstance'],
})
export class ExchangeModule {}
