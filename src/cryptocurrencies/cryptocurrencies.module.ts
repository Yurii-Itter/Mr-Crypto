import { Module, forwardRef } from '@nestjs/common';

import { CryptocurrenciesService } from './cryptocurrencies.service';

import { CommonModule } from '../common/common.module';
import { BinanceModule } from './binance/binance.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
    imports: [CommonModule, forwardRef(() => TelegramModule), BinanceModule],
    providers: [CryptocurrenciesService],
    exports: [CryptocurrenciesService]
})
export class CryptocurrenciesModule { }