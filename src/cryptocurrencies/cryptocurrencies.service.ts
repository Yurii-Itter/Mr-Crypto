import { Injectable, Logger } from '@nestjs/common';

import { BinanceService } from './binance/binance.service';

import { ChunkInterface } from './interfaces/chunk.interface';
import { BaseInterface } from './interfaces/base.interface';
import { QuoteInterface } from './interfaces/quote.interface';


@Injectable()
export class CryptocurrenciesService {
    private logger: Logger;
    private binanceService: BinanceService;

    constructor(binanceService: BinanceService, logger: Logger) {
        this.logger = logger;
        this.binanceService = binanceService;
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

    // will be mixed with others
    public getRawBase(): Array<String> {
        return this.binanceService.getBase();
    }

    public getBaseKeyboard() {
        return this.chunkData(this.binanceService.getBase().map(s => { return { base: s } }), 3)
    }

    public getQuoteKeyboard(base: string) {
        return this.chunkData(this.binanceService.getQuote(base).map(s => { return { quote: s } }), 3);
    }
}