import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';

import { BinanceService } from './binance/binance.service';
import { TelegramService } from '../telegram/telegram.service';

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
        await this.telegramService.launch();
    }

    public getBase(keyboard?: boolean): Array<string | Array<string>> {

        let bases = [...Object.keys(this.binanceService.symbols)];
        let mixed = [...new Set(bases)];
        let chunk = [];

        return keyboard ?
            mixed.reduce(
                (accum, base, index, array) => {

                    if (chunk.length === 2 || index === array.length - 1) { chunk.push({ base }); accum.push({ chunk }); chunk = [] }
                    else { chunk.push({ base }) }

                    return accum;
                }, []
            ) :
            mixed;

    }

    public getQuote(base: string, keyboard?: boolean): Array<string | Array<string>> {

        let quotes = [...this.binanceService.symbols[base]];
        let mixed = [...new Set(quotes)];
        let chunk = [];

        return keyboard ?
            mixed.reduce(
                (accum, quote, index, array) => {

                    if (chunk.length === 2 || index === array.length - 1) { chunk.push(quote); accum.push({ chunk }); chunk = [] }
                    else { chunk.push(quote) }

                    return accum;
                }, []
            ) :
            mixed;
    }

    public getList(list: string) {
        return [
            {
                symbol: list.toLocaleUpperCase(),
                source: 'Binance',
                ...this.binanceService.list[list]
            }
        ]
    }
}