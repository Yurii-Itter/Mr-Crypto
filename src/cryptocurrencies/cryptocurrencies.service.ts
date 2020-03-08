import { Injectable, Logger } from '@nestjs/common';

import { BinanceService } from './binance/binance.service';

import { ChunkInterface } from './interfaces/chunk.interface';

@Injectable()
export class CryptocurrenciesService {
    private logger: Logger;
    private binanceService: BinanceService;

    constructor(binanceService: BinanceService, logger: Logger) {
        this.logger = logger;
        this.binanceService = binanceService;
    }

    public getBase(): Array<ChunkInterface> {
        return this.binanceService.chunkData(this.binanceService.getBase(), 3);
    }

    public getQuote(): Array<ChunkInterface> {
        return this.binanceService.chunkData(this.binanceService.getQuote(), 3);
    }
}