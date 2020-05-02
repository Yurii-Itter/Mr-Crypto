import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';

import { BinanceService } from './binance/binance.service';
import { TelegramService } from '../telegram/telegram.service';

import { BaseInterface } from './interfaces/base.interface';
import { QuoteInterface } from './interfaces/quote.interface';
import { ListInterface } from './interfaces/list.interface';

@Injectable()
export class CryptocurrenciesService {
    private logger: Logger;
    private binanceService: BinanceService;

    constructor(
        @Inject(forwardRef(() => 'TelegramServiceInstance')) private telegramService: TelegramService,
        binanceService: BinanceService,
        logger: Logger
    ) {
        this.logger = logger;
        this.binanceService = binanceService;

        this.cryptocurrenciesLauncher();
    }

    private async cryptocurrenciesLauncher(): Promise<void> {
        await this.binanceService.launch();
        // await this.telegramService.launch();
    }
}