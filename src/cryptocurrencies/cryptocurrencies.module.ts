import { Module, forwardRef } from '@nestjs/common';

import { CryptocurrenciesService } from './cryptocurrencies.service';

import { CommonModule } from '../common/common.module';
import { BinanceModule } from './binance/binance.module';
import { CoinbaseModule } from './coinbase/coinbase.module';

@Module({
  imports: [CommonModule, BinanceModule, CoinbaseModule],
  providers: [
    CryptocurrenciesService,
    {
      provide: 'CryptocurrenciesServiceInstance',
      useFactory: (cryptocurrenciesService: CryptocurrenciesService) => {
        return cryptocurrenciesService;
      },
      inject: [CryptocurrenciesService],
    },
  ],
  exports: ['CryptocurrenciesServiceInstance'],
})
export class CryptocurrenciesModule {}
