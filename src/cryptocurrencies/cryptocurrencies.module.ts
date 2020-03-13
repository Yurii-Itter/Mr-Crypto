import { Module, forwardRef } from '@nestjs/common';

import { CryptocurrenciesService } from './cryptocurrencies.service';

import { CommonModule } from '../common/common.module';
import { BinanceModule } from './binance/binance.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
    imports: [forwardRef(() => TelegramModule), CommonModule, BinanceModule],
    providers: [
        CryptocurrenciesService,
        {
            provide: 'CryptocurrenciesServiceInstance',
            useFactory: (cryptocurrenciesService: CryptocurrenciesService) => {
                return cryptocurrenciesService;
            },
            inject: [CryptocurrenciesService]
        }
    ],
    exports: ['CryptocurrenciesServiceInstance']
})
export class CryptocurrenciesModule { }