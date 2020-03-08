import { Module } from '@nestjs/common';

import { CryptocurrenciesService } from './cryptocurrencies.service';

import { CommonModule } from '../common/common.module';
import { BinanceModule } from './binance/binance.module';

@Module({
    imports: [CommonModule, BinanceModule],
    providers: [CryptocurrenciesService],
    exports: [CryptocurrenciesService]
})
export class CryptocurrenciesModule { }