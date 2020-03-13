import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';

import { BinanceService } from './binance/binance.service';
import { TelegramService } from '../telegram/telegram.service';

import { ChunkInterface } from './interfaces/chunk.interface';
import { BaseInterface } from './interfaces/base.interface';
import { QuoteInterface } from './interfaces/quote.interface';
import { ListInterface } from './interfaces/list.interface';

@Injectable()
export class CryptocurrenciesService {
    private logger: Logger;
    private binanceService: BinanceService;

    private pairs: Array<ListInterface> = [];

    constructor(
        @Inject(forwardRef(() => 'TelegramServiceInstance')) private telegramService: TelegramService,
        binanceService: BinanceService,
        logger: Logger
    ) {
        this.logger = logger;
        this.binanceService = binanceService;

        this.cryptocurrenciesHandler();
    }

    //will be mixed
    private async cryptocurrenciesHandler(): Promise<void> {
        await this.processPairs(await this.binanceService.pairsHandler());
        this.telegramService.launch();
    }

    private async processPairs(pairs: Array<ListInterface>): Promise<void> {
        pairs.forEach(pair => {
            this.pairs.push(pair);
        })
    }

    private chunkData(basic: Array<BaseInterface | QuoteInterface>, size: number): Array<ChunkInterface> {
        const chunked_arr = [];
        let copied = [...basic];
        const numOfChild = Math.ceil(copied.length / size);
        for (let i = 0; i < numOfChild; i++) {
            chunked_arr.push({ chunk: copied.splice(0, size) });
        }
        return chunked_arr;
    }

    public getBase(): Array<String> {
        let base = this.pairs.map(s => s.base);
        return base.filter((v, i) => base.indexOf(v) === i).sort();
    }

    public getQuote(base: string): Array<QuoteInterface> {
        return this.pairs.filter(f => f.base === base).map(s => { return { quote: s.quote, symbol: s.symbol } }).sort((a, b) => {
            if (a.quote < b.quote) return -1;
            if (a.quote > b.quote) return 1;
            return 0;
        });
    }

    public getBaseKeyboard(): Array<ChunkInterface> {
        return this.chunkData(this.getBase().map(s => { return { base: s } }), 3)
    }

    public getQuoteKeyboard(base: string): Array<ChunkInterface> {
        return this.chunkData(this.getQuote(base), 3)
    }
}