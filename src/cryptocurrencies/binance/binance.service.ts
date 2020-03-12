import { Injectable } from '@nestjs/common';

import { BaseCryptocurrency } from '../base.cryptocurrency';

import { ListInterface } from '../interfaces/list.interface';

@Injectable()
export class BinanceService extends BaseCryptocurrency {
    public async pairsHandler(): Promise<Array<ListInterface>> {
        let p = (await this.getExchangeInfo('https://api.binance.com/api/v3/exchangeInfo')).data.symbols.filter(f => f.status === 'TRADING').map(s => { return { base: s.baseAsset, quote: s.quoteAsset, symbol: s.symbol } });

        this.pairs = p;
        return p;
    }
}